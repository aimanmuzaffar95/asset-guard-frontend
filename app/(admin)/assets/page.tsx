import Link from "next/link";
import DashboardHeader from "../_components/dashboard-header";
import AssetsTable from "./_components/assets-table";
import AssetFilters from "./_components/asset-category-filter";

export default function AssetsPage() {
  return (
    <div className="flex flex-col min-h-screen">
      <DashboardHeader />

      <main className="flex-1 p-6 lg:p-10 space-y-6 max-w-[1200px] mx-auto w-full">
        {/* Header Section */}
        <div className="flex flex-wrap justify-between items-end gap-4 mb-8">
          <div className="flex flex-col gap-1">
            <h1 className="text-slate-900 text-3xl font-extrabold tracking-tight">
              Asset Inventory
            </h1>
            <p className="text-slate-500 text-base">
              Monitor and manage company equipment and assignments.
            </p>
          </div>
          <Link
            href="/assets/new"
            className="flex items-center gap-2 rounded-lg bg-primary px-5 py-2.5 text-white text-sm font-bold shadow-lg shadow-primary/20 hover:bg-primary/90 transition-all"
          >
            <span className="material-symbols-outlined text-lg">add</span>
            <span>Add Asset Item</span>
          </Link>
        </div>

        {/* Filter Toolbar */}
        <AssetFilters/>
        {/* Table Card */}
        <AssetsTable />

        {/* Summary Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
          <div className="bg-white border border-slate-200 rounded-xl p-6 flex items-center gap-4">
            <div className="size-12 rounded-full bg-primary/10 flex items-center justify-center text-primary">
              <span className="material-symbols-outlined text-2xl">
                inventory
              </span>
            </div>
            <div>
              <p className="text-xs font-bold text-slate-500 uppercase tracking-widest">
                Total Assets
              </p>
              <p className="text-2xl font-black text-slate-900">
                1,248
              </p>
            </div>
          </div>
          <div className="bg-white border border-slate-200 rounded-xl p-6 flex items-center gap-4">
            <div className="size-12 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-600">
              <span className="material-symbols-outlined text-2xl">
                verified
              </span>
            </div>
            <div>
              <p className="text-xs font-bold text-slate-500 uppercase tracking-widest">
                Available Items
              </p>
              <p className="text-2xl font-black text-slate-900">
                312
              </p>
            </div>
          </div>
          <div className="bg-white border border-slate-200 rounded-xl p-6 flex items-center gap-4">
            <div className="size-12 rounded-full bg-amber-100 flex items-center justify-center text-amber-600">
              <span className="material-symbols-outlined text-2xl">
                assignment_ind
              </span>
            </div>
            <div>
              <p className="text-xs font-bold text-slate-500 uppercase tracking-widest">
                Assigned Assets
              </p>
              <p className="text-2xl font-black text-slate-900">
                936
              </p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
