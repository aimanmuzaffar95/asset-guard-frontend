import DashboardHeader from "../_components/dashboard-header";
import Image from "next/image";

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
          <button className="flex items-center gap-2 rounded-lg bg-primary px-5 py-2.5 text-white text-sm font-bold shadow-lg shadow-primary/20 hover:bg-primary/90 transition-all">
            <span className="material-symbols-outlined text-lg">add</span>
            <span>Add Asset Item</span>
          </button>
        </div>

        {/* Filter Toolbar */}
        <div className="flex flex-wrap items-center gap-3 mb-6">
          <div className="relative group">
            <button className="flex h-10 items-center justify-between gap-x-2 rounded-lg border border-slate-200 bg-white px-4 text-sm font-medium text-slate-700 hover:border-primary/50">
              <span className="flex items-center gap-2">
                <span className="material-symbols-outlined text-lg text-slate-400">
                  category
                </span>
                Category: All
              </span>
              <span className="material-symbols-outlined text-lg">
                expand_more
              </span>
            </button>
          </div>
          <div className="relative group">
            <button className="flex h-10 items-center justify-between gap-x-2 rounded-lg border border-slate-200 bg-white px-4 text-sm font-medium text-slate-700 hover:border-primary/50">
              <span className="flex items-center gap-2">
                <span className="material-symbols-outlined text-lg text-slate-400">
                  check_circle
                </span>
                Status: All
              </span>
              <span className="material-symbols-outlined text-lg">
                expand_more
              </span>
            </button>
          </div>
          <div className="h-6 w-px bg-slate-200 mx-1 hidden sm:block"></div>
          <div className="flex gap-2">
            <button className="rounded-lg bg-slate-200 px-3 py-1.5 text-xs font-semibold text-slate-700">
              Laptops
            </button>
            <button className="rounded-lg bg-slate-200 px-3 py-1.5 text-xs font-semibold text-slate-700">
              Furniture
            </button>
            <button className="rounded-lg bg-slate-200 px-3 py-1.5 text-xs font-semibold text-slate-700">
              Peripherals
            </button>
          </div>
          <button className="ml-auto flex items-center gap-2 text-slate-500 hover:text-primary transition-colors text-sm font-medium">
            <span className="material-symbols-outlined text-lg">
              filter_alt
            </span>
            Advanced Filters
          </button>
        </div>

        {/* Table Card */}
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="overflow-x-auto @container">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-200 bg-slate-50/50">
                  <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-slate-500">
                    Item Name
                  </th>
                  <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-slate-500">
                    Category
                  </th>
                  <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-slate-500 text-center">
                    Status
                  </th>
                  <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-slate-500">
                    Assigned To
                  </th>
                  <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-slate-500">
                    Serial/Tag
                  </th>
                  <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-slate-500 text-right">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                {/* Item 1 */}
                <tr className="hover:bg-slate-50 transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-blue-100 rounded-lg text-blue-600">
                        <span className="material-symbols-outlined">
                          laptop_mac
                        </span>
                      </div>
                      <span className="text-sm font-semibold text-slate-900">
                        MacBook Pro 14&quot; M2
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="px-2.5 py-1 rounded-full bg-slate-100 text-xs font-medium text-slate-600">
                      Laptops
                    </span>
                  </td>
                  <td className="px-6 py-4 text-center">
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-amber-100 text-amber-700 text-xs font-bold">
                      <span className="size-1.5 rounded-full bg-amber-500"></span>{" "}
                      Assigned
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <Image
                        className="size-6 rounded-full"
                        alt="Alex Rivera profile picture"
                        src="https://lh3.googleusercontent.com/aida-public/AB6AXuD6USqpJBuwIpUZCAsmfaL5Ur7cmbMWdyChkgZWhquyik2FSAk0r57eUNRzOnJcKU9CyK1o1mO3NAeqn6UFnbejQ9xQox2r8ogSipAT5dLuW7Wq30cltXT_UVmFyZr6YCBHidc1YIe4cxhU1BHYw6W4d1ZuY1A4nxY52EXfmk5C1T3uN_1n6taZ8HJg7INB1BWgZM1H8QjFYcwfzvbMo-pQl1a4fu4eN32Sd7yEHYbuq0VFkOj0NmpzvxCVKuouRNDkGODoZMnYgKE"
                        width={24}
                        height={24}
                      />
                      <span className="text-sm text-slate-600">
                        Alex Rivera
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm font-mono text-slate-500">
                    SN-98234-APL
                  </td>
                  <td className="px-6 py-4 text-right">
                    <button className="text-primary hover:text-primary/70 font-bold text-sm">
                      Edit
                    </button>
                  </td>
                </tr>
                {/* Item 2 */}
                <tr className="hover:bg-slate-50 transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-indigo-100 rounded-lg text-indigo-600">
                        <span className="material-symbols-outlined">
                          monitor
                        </span>
                      </div>
                      <span className="text-sm font-semibold text-slate-900">
                        Dell UltraSharp 27&quot; 4K
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="px-2.5 py-1 rounded-full bg-slate-100 text-xs font-medium text-slate-600">
                      Monitors
                    </span>
                  </td>
                  <td className="px-6 py-4 text-center">
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-700 text-xs font-bold">
                      <span className="size-1.5 rounded-full bg-emerald-500"></span>{" "}
                      Available
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm text-slate-400">—</td>
                  <td className="px-6 py-4 text-sm font-mono text-slate-500">
                    SN-11029-DEL
                  </td>
                  <td className="px-6 py-4 text-right">
                    <button className="text-primary hover:text-primary/70 font-bold text-sm">
                      Edit
                    </button>
                  </td>
                </tr>
                {/* Item 3 */}
                <tr className="hover:bg-slate-50 transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-orange-100 rounded-lg text-orange-600">
                        <span className="material-symbols-outlined">chair</span>
                      </div>
                      <span className="text-sm font-semibold text-slate-900">
                        Herman Miller Aeron
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="px-2.5 py-1 rounded-full bg-slate-100 text-xs font-medium text-slate-600">
                      Furniture
                    </span>
                  </td>
                  <td className="px-6 py-4 text-center">
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-amber-100 text-amber-700 text-xs font-bold">
                      <span className="size-1.5 rounded-full bg-amber-500"></span>{" "}
                      Assigned
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <Image
                        className="size-6 rounded-full"
                        alt="Jordan Smith profile picture"
                        src="https://lh3.googleusercontent.com/aida-public/AB6AXuBnaKS4ueJAX_3BjdDC9Tj1UqtdBv00HavnTw7Nb5prsMmcAKY93fDraBuIYfYh7wRKUdrj_0jZit4QmISpW8ovdtMpdBu0RIEbvcPt2fGJTfkhGh3XeZxfl1VCx0OL1GmHon8t1v6-jJasABzkEtnKFxCo6Oj8ySJFlCeHEeW1GIaZOwfa4bHCOZC0mqgBnOEXmGUeL8sEEkbYLwkP06YaU0dVRvRvyTPvTwgvYEeK79IowJRTARplDKYMnVJrYEDh2Z9X41pLqqU"
                        width={24}
                        height={24}
                      />
                      <span className="text-sm text-slate-600">
                        Jordan Smith
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm font-mono text-slate-500">
                    TAG-4421-HM
                  </td>
                  <td className="px-6 py-4 text-right">
                    <button className="text-primary hover:text-primary/70 font-bold text-sm">
                      Edit
                    </button>
                  </td>
                </tr>
                {/* Item 4 */}
                <tr className="hover:bg-slate-50 transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-purple-100 rounded-lg text-purple-600">
                        <span className="material-symbols-outlined">
                          tablet_mac
                        </span>
                      </div>
                      <span className="text-sm font-semibold text-slate-900">
                        iPad Air Gen 5
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="px-2.5 py-1 rounded-full bg-slate-100 text-xs font-medium text-slate-600">
                      Tablets
                    </span>
                  </td>
                  <td className="px-6 py-4 text-center">
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-700 text-xs font-bold">
                      <span className="size-1.5 rounded-full bg-emerald-500"></span>{" "}
                      Available
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm text-slate-400">—</td>
                  <td className="px-6 py-4 text-sm font-mono text-slate-500">
                    SN-55672-TAB
                  </td>
                  <td className="px-6 py-4 text-right">
                    <button className="text-primary hover:text-primary/70 font-bold text-sm">
                      Edit
                    </button>
                  </td>
                </tr>
                {/* Item 5 */}
                <tr className="hover:bg-slate-50 transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-slate-100 rounded-lg text-slate-600">
                        <span className="material-symbols-outlined">
                          keyboard
                        </span>
                      </div>
                      <span className="text-sm font-semibold text-slate-900">
                        Logitech MX Mechanical
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="px-2.5 py-1 rounded-full bg-slate-100 text-xs font-medium text-slate-600">
                      Peripherals
                    </span>
                  </td>
                  <td className="px-6 py-4 text-center">
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-amber-100 text-amber-700 text-xs font-bold">
                      <span className="size-1.5 rounded-full bg-amber-500"></span>{" "}
                      Assigned
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <Image
                        className="size-6 rounded-full"
                        alt="Elena Rodriguez profile picture"
                        src="https://lh3.googleusercontent.com/aida-public/AB6AXuAjQ_9xj5K_QoM7nkJp1Uy-rzxG5V8EkIa1fQb1LGadLVxnlCmBk-kKWYHvAOUEYWd3e0FM0-ixrcU-Vt44IVsnTy94AzeYxybFWE2RpwtUTcIQBhoQpyKZ1d2WHXOX3v-eHJk48v0FUoKBXCEdysN5bNkEdSS-MOeboyjTNcI1_tFMSsd_2PeBiftsySDVNHofaey3tFqAKDdYjITevnX85DvgNOhfGfzRkbMhbvy2tpHVpRoDzsaMWK3TFYqV8ooMddQzDTgqq-s"
                        width={24}
                        height={24}
                      />
                      <span className="text-sm text-slate-600">
                        Elena Rodriguez
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm font-mono text-slate-500">
                    SN-22883-LOG
                  </td>
                  <td className="px-6 py-4 text-right">
                    <button className="text-primary hover:text-primary/70 font-bold text-sm">
                      Edit
                    </button>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
          {/* Pagination */}
          <div className="flex items-center justify-between border-t border-slate-200 px-6 py-4 bg-slate-50/30">
            <div className="text-xs text-slate-500 font-medium">
              Showing 1-5 of 124 results
            </div>
            <div className="flex items-center gap-1">
              <button
                className="flex size-8 items-center justify-center rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-100 disabled:opacity-50"
                disabled
              >
                <span className="material-symbols-outlined text-sm">
                  chevron_left
                </span>
              </button>
              <button className="flex size-8 items-center justify-center rounded-lg bg-primary text-white text-xs font-bold">
                1
              </button>
              <button className="flex size-8 items-center justify-center rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-100 text-xs font-medium">
                2
              </button>
              <button className="flex size-8 items-center justify-center rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-100 text-xs font-medium">
                3
              </button>
              <span className="text-slate-400 px-1">...</span>
              <button className="flex size-8 items-center justify-center rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-100 text-xs font-medium">
                25
              </button>
              <button className="flex size-8 items-center justify-center rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-100">
                <span className="material-symbols-outlined text-sm">
                  chevron_right
                </span>
              </button>
            </div>
          </div>
        </div>

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
