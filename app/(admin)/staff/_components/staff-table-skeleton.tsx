export default function StaffTableSkeleton() {
  return (
    <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
      <div className="overflow-x-auto">
        <table className="w-full border-collapse text-left">
          <thead>
            <tr className="border-b border-slate-200 bg-slate-50">
              <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wider text-slate-600">
                Staff Member
              </th>
              <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wider text-slate-600">
                Email Address
              </th>
              <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wider text-slate-600">
                Role
              </th>
              <th className="px-6 py-4 text-center text-xs font-semibold uppercase tracking-wider text-slate-600">
                Assets
              </th>
              <th className="px-6 py-4 text-right text-xs font-semibold uppercase tracking-wider text-slate-600">
                Action
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {Array.from({ length: 5 }).map((_, index) => (
              <tr key={index}>
                <td className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    <div className="size-9 animate-pulse rounded-full bg-slate-200" />
                    <div className="h-4 w-32 animate-pulse rounded bg-slate-200" />
                  </div>
                </td>
                <td className="px-6 py-4">
                  <div className="h-4 w-48 animate-pulse rounded bg-slate-200" />
                </td>
                <td className="px-6 py-4">
                  <div className="h-6 w-16 animate-pulse rounded-full bg-slate-200" />
                </td>
                <td className="px-6 py-4">
                  <div className="ml-auto h-4 w-8 animate-pulse rounded bg-slate-200" />
                </td>
                <td className="px-6 py-4">
                  <div className="ml-auto h-4 w-24 animate-pulse rounded bg-slate-200" />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="flex items-center justify-between border-t border-slate-200 px-6 py-4">
        <div className="h-4 w-40 animate-pulse rounded bg-slate-200" />
        <div className="flex items-center gap-2">
          {Array.from({ length: 5 }).map((_, index) => (
            <div key={index} className="size-8 animate-pulse rounded-lg bg-slate-200 md:size-10" />
          ))}
        </div>
      </div>
    </div>
  );
}
