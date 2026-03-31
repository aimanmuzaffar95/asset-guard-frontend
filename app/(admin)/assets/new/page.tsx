import Link from "next/link";
import DashboardHeader from "../../_components/dashboard-header";
import AssetForm from "./_components/asset-form";

export default function AddAssetPage() {
  return (
    <div className="flex flex-col min-h-screen">
      <DashboardHeader />

      <main className="flex-1 p-6 lg:p-10 max-w-[1200px] mx-auto w-full">
        {/* Breadcrumb */}
        <nav aria-label="Breadcrumb" className="flex items-center gap-2 mb-6 text-sm">
          <Link
            href="/assets"
            className="text-primary font-medium hover:underline"
          >
            Asset Inventory
          </Link>
          <span className="material-symbols-outlined text-sm text-[var(--text-subtle)]">
            chevron_right
          </span>
          <span className="text-[var(--text-muted)]">Add New Asset</span>
        </nav>

        {/* Page heading */}
        <div className="mb-8">
          <h1 className="text-3xl font-extrabold tracking-tight text-[var(--text-strong)] mb-2">
            Asset Details
          </h1>
          <p className="text-[var(--text-muted)] text-base">
            Fill in the information below to register a new asset in the
            system. Required fields are marked with an asterisk (*).
          </p>
        </div>

        {/* Form */}
        <AssetForm />
      </main>
    </div>
  );
}
