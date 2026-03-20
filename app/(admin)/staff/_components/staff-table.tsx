type StaffRow = {
  id: string;
  name: string;
  initials: string;
  email: string;
  department: string;
  assetsCount: number;
};

const staffMembers: StaffRow[] = [
  {
    id: "1",
    name: "John Doe",
    initials: "JD",
    email: "john.doe@company.com",
    department: "Engineering",
    assetsCount: 4,
  },
  {
    id: "2",
    name: "Jane Smith",
    initials: "JS",
    email: "jane.smith@company.com",
    department: "Design",
    assetsCount: 2,
  },
  {
    id: "3",
    name: "Robert Brown",
    initials: "RB",
    email: "robert.b@company.com",
    department: "Marketing",
    assetsCount: 3,
  },
  {
    id: "4",
    name: "Emily Davis",
    initials: "ED",
    email: "emily.d@company.com",
    department: "Operations",
    assetsCount: 1,
  },
  {
    id: "5",
    name: "Michael Wilson",
    initials: "MW",
    email: "m.wilson@company.com",
    department: "Finance",
    assetsCount: 5,
  },
];

export default function StaffTable() {
  return (
    <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
      <div className="overflow-x-auto @container">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-slate-200 bg-slate-50">
              <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wider text-slate-600">
                Staff Member
              </th>
              <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wider text-slate-600">
                Email Address
              </th>
              <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wider text-slate-600">
                Department
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
            {staffMembers.map((staff) => (
              <tr
                key={staff.id}
                className="group transition-colors hover:bg-slate-50"
              >
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center gap-3">
                    <div className="size-9 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-sm">
                      {staff.initials}
                    </div>
                    <span className="font-semibold text-slate-900">
                      {staff.name}
                    </span>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500">
                  {staff.email}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span
                    className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                      staff.department === "Engineering"
                        ? "bg-primary/10 text-primary"
                        : "bg-slate-100 text-slate-600"
                    }`}
                  >
                    {staff.department}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-center font-bold text-slate-700">
                  {staff.assetsCount}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right">
                  <button className="text-primary font-bold text-sm hover:underline flex items-center gap-1 justify-end ml-auto">
                    View Details
                    <span className="material-symbols-outlined text-sm">
                      arrow_forward
                    </span>
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="flex items-center justify-between border-t border-slate-200 px-6 py-4">
        <p className="text-sm text-slate-500">
          Showing 1 to 5 of 42 results
        </p>
        <div className="flex items-center gap-1">
          <button className="flex size-8 items-center justify-center rounded-lg text-slate-600 transition-colors hover:bg-slate-200 md:size-10">
            <span className="material-symbols-outlined text-sm md:text-base">chevron_left</span>
          </button>
          <button className="flex size-8 md:size-10 items-center justify-center text-xs md:text-sm font-bold bg-primary text-white rounded-lg shadow-sm">
            1
          </button>
          <button className="flex size-8 items-center justify-center rounded-lg text-xs font-medium text-slate-600 transition-colors hover:bg-slate-200 md:size-10 md:text-sm">
            2
          </button>
          <button className="flex size-8 items-center justify-center rounded-lg text-xs font-medium text-slate-600 transition-colors hover:bg-slate-200 md:size-10 md:text-sm">
            3
          </button>
          <span className="px-1 md:px-2 text-slate-400 text-sm md:text-base">...</span>
          <button className="flex size-8 items-center justify-center rounded-lg text-xs font-medium text-slate-600 transition-colors hover:bg-slate-200 md:size-10 md:text-sm">
            9
          </button>
          <button className="flex size-8 items-center justify-center rounded-lg text-slate-600 transition-colors hover:bg-slate-200 md:size-10">
            <span className="material-symbols-outlined text-sm md:text-base">chevron_right</span>
          </button>
        </div>
      </div>
    </div>
  );
}
