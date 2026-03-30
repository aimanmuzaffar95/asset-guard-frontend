import type { Assignment } from "@/app/(admin)/dashboard/page";

export default function RecentAssignments({ assignments }: { assignments: Assignment[] }) {
  return (
    <div className="rounded-xl border border-[var(--border)] bg-[var(--surface)] p-6 shadow-sm">
      <div className="mb-6 flex items-center justify-between">
        <h2 className="text-lg font-bold text-[var(--text-strong)]">Recent Assignments</h2>
        <button className="text-sm font-medium text-primary hover:underline">View all</button>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left">
          <thead>
            <tr className="border-b border-[var(--border)] text-xs font-semibold uppercase tracking-wider text-[var(--text-muted)]">
              <th className="pb-3 pr-4">Asset</th>
              <th className="pb-3 pr-4">Assigned To</th>
              <th className="pb-3 pr-4">Date</th>
              <th className="pb-3">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[var(--border-soft)]">
            {assignments.length === 0 ? (
              <tr>
                <td colSpan={4} className="py-8 text-center text-sm text-[var(--text-muted)]">
                  No recent assignments found.
                </td>
              </tr>
            ) : (
              assignments.map((assignment) => (
                <tr key={assignment.id} className="group transition-colors hover:bg-[var(--surface-muted)]">
                  <td className="py-4 pr-4">
                    <span className="text-sm font-medium text-[var(--text-strong)]">
                      {assignment.assetName}
                    </span>
                  </td>
                  <td className="py-4 pr-4">
                    <div className="flex items-center gap-2">
                      <div className="flex h-6 w-6 items-center justify-center rounded-full bg-primary/10 text-[10px] font-bold text-primary">
                        {assignment.staffName.charAt(0)}
                      </div>
                      <span className="text-sm text-[var(--text-interactive)]">{assignment.staffName}</span>
                    </div>
                  </td>
                  <td className="py-4 pr-4 text-sm text-[var(--text-muted)]">{assignment.date}</td>
                  <td className="py-4">
                    <span
                      className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                        assignment.status === "Assigned"
                          ? "bg-emerald-500/10 text-emerald-600"
                          : assignment.status === "Pending"
                            ? "bg-amber-500/10 text-amber-600"
                            : "bg-slate-500/10 text-slate-600"
                      }`}
                    >
                      {assignment.status}
                    </span>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
