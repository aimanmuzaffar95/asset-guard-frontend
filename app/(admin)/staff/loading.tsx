import DashboardHeader from "../_components/dashboard-header";
import StaffTableSkeleton from "./_components/staff-table-skeleton";

export default function StaffLoading() {
  return (
    <div className="flex min-h-screen flex-col">
      <DashboardHeader />

      <main className="mx-auto flex-1 w-full max-w-[1200px] space-y-6 p-6 lg:p-10">
        <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
          <div className="flex flex-col gap-2">
            <div className="h-10 w-64 animate-pulse rounded bg-slate-200" />
            <div className="h-5 w-96 max-w-full animate-pulse rounded bg-slate-200" />
          </div>
          <div className="h-11 w-[140px] animate-pulse rounded-lg bg-slate-200" />
        </div>

        <div className="mb-6">
          <div className="flex h-12 w-full items-center rounded-xl border border-slate-200 bg-white px-4 shadow-sm">
            <div className="size-5 animate-pulse rounded bg-slate-200" />
            <div className="ml-3 h-4 w-56 animate-pulse rounded bg-slate-200" />
          </div>
        </div>

        <StaffTableSkeleton />
      </main>
    </div>
  );
}
