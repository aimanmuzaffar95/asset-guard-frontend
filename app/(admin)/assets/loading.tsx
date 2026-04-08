import DashboardHeader from "../_components/dashboard-header";

export default function Loading() {
  return (
    <div className="flex min-h-screen flex-col">
      <DashboardHeader />

      <main className="mx-auto flex-1 w-full max-w-[1200px] space-y-6 p-6 lg:p-10">
        <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
          <div className="space-y-3">
            <div className="h-10 w-64 animate-pulse rounded-lg bg-slate-200" />
            <div className="h-5 w-96 animate-pulse rounded-lg bg-slate-200" />
          </div>
          <div className="h-11 w-40 animate-pulse rounded-lg bg-slate-200" />
        </div>

        <div className="h-11 w-full animate-pulse rounded-xl bg-slate-200" />
        <div className="h-[360px] w-full animate-pulse rounded-xl bg-slate-200" />

        <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
          <div className="h-28 animate-pulse rounded-xl bg-slate-200" />
          <div className="h-28 animate-pulse rounded-xl bg-slate-200" />
          <div className="h-28 animate-pulse rounded-xl bg-slate-200" />
        </div>
      </main>
    </div>
  );
}
