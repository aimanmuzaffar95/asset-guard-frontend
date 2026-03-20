import DashboardHeader from "../_components/dashboard-header";

export default function DashboardLoading() {
  return (
    <div className="flex min-h-screen flex-col">
      <DashboardHeader />

      <main className="flex-1 space-y-6 p-6">
        <div className="space-y-2">
          <div className="h-8 w-56 animate-pulse rounded bg-[var(--surface-muted)]" />
          <div className="h-4 w-80 animate-pulse rounded bg-[var(--surface-muted)]" />
        </div>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
          {Array.from({ length: 4 }).map((_, index) => (
            <div
              key={index}
              className="rounded-xl border border-[var(--border)] bg-[var(--surface)] p-5 shadow-sm"
            >
              <div className="flex items-start justify-between">
                <div className="h-10 w-10 animate-pulse rounded-lg bg-[var(--surface-muted)]" />
                <div className="h-6 w-20 animate-pulse rounded-full bg-[var(--surface-muted)]" />
              </div>
              <div className="mt-4 space-y-3">
                <div className="h-4 w-24 animate-pulse rounded bg-[var(--surface-muted)]" />
                <div className="h-8 w-20 animate-pulse rounded bg-[var(--surface-muted)]" />
                <div className="h-3 w-32 animate-pulse rounded bg-[var(--surface-muted)]" />
              </div>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          <div className="rounded-xl border border-[var(--border)] bg-[var(--surface)] p-6 shadow-sm lg:col-span-2">
            <div className="h-6 w-40 animate-pulse rounded bg-[var(--surface-muted)]" />
            <div className="mt-6 h-48 animate-pulse rounded-lg bg-[var(--surface-muted)]" />
          </div>
          <div className="rounded-xl border border-[var(--border)] bg-[var(--surface)] p-6 shadow-sm">
            <div className="h-6 w-36 animate-pulse rounded bg-[var(--surface-muted)]" />
            <div className="mt-6 h-40 animate-pulse rounded-lg bg-[var(--surface-muted)]" />
            <div className="mt-6 h-24 animate-pulse rounded-lg bg-[var(--surface-muted)]" />
          </div>
        </div>
      </main>
    </div>
  );
}
