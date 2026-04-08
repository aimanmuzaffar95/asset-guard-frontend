"use client";

import { useMemo, useState } from "react";
import type { Asset } from "@/lib/assets";
import AssetCategoryFilter from "./asset-category-filter";
import AssetsTable, { normalizeAssetTableRow } from "./assets-table";

type AssetsViewProps = {
  assets: Asset[];
};

type AssetStatusFilter = "All" | "Assigned" | "Available";

export default function AssetsView({ assets }: AssetsViewProps) {
  const categories = useMemo(() => {
    const uniqueCategories = new Set(
      assets.map((asset) => asset.assetType.name.trim()).filter(Boolean),
    );

    return ["All", ...Array.from(uniqueCategories).sort((left, right) => left.localeCompare(right))];
  }, [assets]);

  const [selectedCategory, setSelectedCategory] = useState("All");
  const [selectedStatus, setSelectedStatus] = useState<AssetStatusFilter>("All");

  const filteredAssets = useMemo(() => {
    return assets.filter((asset) => {
      const matchesCategory =
        selectedCategory === "All" || asset.assetType.name.trim() === selectedCategory;
      const matchesStatus =
        selectedStatus === "All" ||
        (selectedStatus === "Assigned" ? asset.status === "assigned" : asset.status === "available");

      return matchesCategory && matchesStatus;
    });
  }, [assets, selectedCategory, selectedStatus]);

  const summary = useMemo(() => {
    return filteredAssets.reduce(
      (totals, asset) => ({
        total: totals.total + 1,
        available: totals.available + (asset.status === "available" ? 1 : 0),
        assigned: totals.assigned + (asset.status === "assigned" ? 1 : 0),
      }),
      { total: 0, available: 0, assigned: 0 },
    );
  }, [filteredAssets]);

  return (
    <>
      <AssetCategoryFilter
        categories={categories}
        selectedCategory={selectedCategory}
        selectedStatus={selectedStatus}
        onCategoryChange={setSelectedCategory}
        onStatusChange={setSelectedStatus}
      />

      <AssetsTable assets={filteredAssets.map(normalizeAssetTableRow)} />

      <div className="grid grid-cols-1 gap-6 mt-8 md:grid-cols-3">
        <SummaryCard
          title="Total Assets"
          value={summary.total}
          icon="inventory"
          iconClassName="bg-primary/10 text-primary"
        />
        <SummaryCard
          title="Available Items"
          value={summary.available}
          icon="verified"
          iconClassName="bg-emerald-100 text-emerald-600"
        />
        <SummaryCard
          title="Assigned Assets"
          value={summary.assigned}
          icon="assignment_ind"
          iconClassName="bg-amber-100 text-amber-600"
        />
      </div>
    </>
  );
}

function SummaryCard({
  title,
  value,
  icon,
  iconClassName,
}: {
  title: string;
  value: number;
  icon: string;
  iconClassName: string;
}) {
  const testId = `summary-${title.toLowerCase().replace(/\s+/g, "-")}`;

  return (
    <div
      className="flex items-center gap-4 rounded-xl border border-slate-200 bg-white p-6"
      data-testid={testId}
    >
      <div className={`flex size-12 items-center justify-center rounded-full ${iconClassName}`}>
        <span className="material-symbols-outlined text-2xl">{icon}</span>
      </div>
      <div>
        <p className="text-xs font-bold uppercase tracking-widest text-slate-500">{title}</p>
        <p className="text-2xl font-black text-slate-900">
          {new Intl.NumberFormat("en-US").format(value)}
        </p>
      </div>
    </div>
  );
}
