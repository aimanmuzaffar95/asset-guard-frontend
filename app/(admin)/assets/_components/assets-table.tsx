import type { Asset } from "@/lib/assets";

type DisplayAssetStatus = "Assigned" | "Available";

export type AssetTableRow = {
  id: string;
  name: string;
  icon: string;
  iconClassName: string;
  category: string;
  status: DisplayAssetStatus;
  assignedTo: string | null;
  serialNumber: string;
};

type AssetsTableProps = {
  assets: AssetTableRow[];
};

const statusStyles: Record<DisplayAssetStatus, string> = {
  Assigned: "bg-amber-100 text-amber-700",
  Available: "bg-emerald-100 text-emerald-700",
};

const statusDotStyles: Record<DisplayAssetStatus, string> = {
  Assigned: "bg-amber-500",
  Available: "bg-emerald-500",
};

const iconMap: Record<
  string,
  {
    icon: string;
    iconClassName: string;
  }
> = {
  laptop: { icon: "laptop_mac", iconClassName: "bg-blue-100 text-blue-600" },
  monitor: { icon: "monitor", iconClassName: "bg-indigo-100 text-indigo-600" },
  chair: { icon: "chair", iconClassName: "bg-orange-100 text-orange-600" },
  phone: { icon: "smartphone", iconClassName: "bg-emerald-100 text-emerald-600" },
  tablet: { icon: "tablet_mac", iconClassName: "bg-purple-100 text-purple-600" },
  keyboard: { icon: "keyboard", iconClassName: "bg-slate-100 text-slate-600" },
};

const defaultIcon = {
  icon: "inventory_2",
  iconClassName: "bg-slate-100 text-slate-600",
};

export default function AssetsTable({ assets }: AssetsTableProps) {
  return (
    <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
      <div className="overflow-x-auto @container">
        <table className="w-full border-collapse text-left">
          <thead>
            <tr className="border-b border-slate-200 bg-slate-50/50">
              <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-slate-500">
                Item Name
              </th>
              <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-slate-500">
                Category
              </th>
              <th className="px-6 py-4 text-center text-xs font-bold uppercase tracking-wider text-slate-500">
                Status
              </th>
              <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-slate-500">
                Assigned To
              </th>
              <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-slate-500">
                Serial/Tag
              </th>
              <th className="px-6 py-4 text-right text-xs font-bold uppercase tracking-wider text-slate-500">
                Actions
              </th>
            </tr>
          </thead>

          <tbody className="divide-y divide-slate-200">
            {assets.length === 0 ? (
              <tr>
                <td colSpan={6} className="px-6 py-10 text-center text-sm text-slate-500">
                  No assets match the selected filters.
                </td>
              </tr>
            ) : (
              assets.map((asset) => (
                <tr key={asset.id} className="transition-colors hover:bg-slate-50">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className={`rounded-lg p-2 ${asset.iconClassName}`}>
                        <span className="material-symbols-outlined">{asset.icon}</span>
                      </div>
                      <span className="text-sm font-semibold text-slate-900">{asset.name}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="rounded-full bg-slate-100 px-2.5 py-1 text-xs font-medium capitalize text-slate-600">
                      {asset.category}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-center">
                    <span
                      className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-bold ${statusStyles[asset.status]}`}
                    >
                      <span
                        className={`size-1.5 rounded-full ${statusDotStyles[asset.status]}`}
                      ></span>
                      {asset.status}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    {asset.assignedTo ? (
                      <span className="text-sm text-slate-600">{asset.assignedTo}</span>
                    ) : (
                      <span className="text-sm text-slate-400">Unassigned</span>
                    )}
                  </td>
                  <td className="px-6 py-4 font-mono text-sm text-slate-500">
                    {asset.serialNumber}
                  </td>
                  <td className="px-6 py-4 text-right">
                    <button className="text-sm font-bold text-primary hover:text-primary/70">
                      Edit
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <div className="flex items-center justify-between border-t border-slate-200 bg-slate-50/30 px-6 py-4">
        <div className="text-xs font-medium text-slate-500">
          Showing {assets.length} result{assets.length === 1 ? "" : "s"}
        </div>
        <div className="flex items-center gap-1">
          <button
            className="flex size-8 items-center justify-center rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-100"
            aria-label="Previous page"
          >
            <span className="material-symbols-outlined text-sm">chevron_left</span>
          </button>
          <button className="flex size-8 items-center justify-center rounded-lg bg-primary text-xs font-bold text-white">
            1
          </button>
          <button className="flex size-8 items-center justify-center rounded-lg border border-slate-200 text-xs font-medium text-slate-600 hover:bg-slate-100">
            2
          </button>
          <button className="flex size-8 items-center justify-center rounded-lg border border-slate-200 text-xs font-medium text-slate-600 hover:bg-slate-100">
            3
          </button>
          <span className="px-1 text-slate-400">...</span>
          <button className="flex size-8 items-center justify-center rounded-lg border border-slate-200 text-xs font-medium text-slate-600 hover:bg-slate-100">
            25
          </button>
          <button
            className="flex size-8 items-center justify-center rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-100"
            aria-label="Next page"
          >
            <span className="material-symbols-outlined text-sm">chevron_right</span>
          </button>
        </div>
      </div>
    </div>
  );
}

export function normalizeAssetTableRow(asset: Asset): AssetTableRow {
  const iconConfig = iconMap[asset.assetType.name.trim().toLowerCase()] ?? defaultIcon;

  return {
    id: asset.id,
    name: asset.name,
    icon: iconConfig.icon,
    iconClassName: iconConfig.iconClassName,
    category: asset.assetType.name,
    status: asset.status === "assigned" ? "Assigned" : "Available",
    assignedTo: asset.assignedTo,
    serialNumber: asset.serialNumber,
  };
}
