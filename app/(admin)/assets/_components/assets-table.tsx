import Image from "next/image";

type AssetStatus = "Assigned" | "Available";

type AssetRow = {
  id: string;
  name: string;
  icon: string;
  iconClassName: string;
  category: string;
  status: AssetStatus;
  assignee: {
    name: string;
    avatarUrl: string;
  } | null;
  serialOrTag: string;
};

const assets: AssetRow[] = [
  {
    id: "1",
    name: 'MacBook Pro 14" M2',
    icon: "laptop_mac",
    iconClassName: "bg-blue-100 text-blue-600",
    category: "Laptops",
    status: "Assigned",
    assignee: {
      name: "Alex Rivera",
      avatarUrl:
        "https://lh3.googleusercontent.com/aida-public/AB6AXuD6USqpJBuwIpUZCAsmfaL5Ur7cmbMWdyChkgZWhquyik2FSAk0r57eUNRzOnJcKU9CyK1o1mO3NAeqn6UFnbejQ9xQox2r8ogSipAT5dLuW7Wq30cltXT_UVmFyZr6YCBHidc1YIe4cxhU1BHYw6W4d1ZuY1A4nxY52EXfmk5C1T3uN_1n6taZ8HJg7INB1BWgZM1H8QjFYcwfzvbMo-pQl1a4fu4eN32Sd7yEHYbuq0VFkOj0NmpzvxCVKuouRNDkGODoZMnYgKE",
    },
    serialOrTag: "SN-98234-APL",
  },
  {
    id: "2",
    name: 'Dell UltraSharp 27" 4K',
    icon: "monitor",
    iconClassName: "bg-indigo-100 text-indigo-600",
    category: "Monitors",
    status: "Available",
    assignee: null,
    serialOrTag: "SN-11029-DEL",
  },
  {
    id: "3",
    name: "Herman Miller Aeron",
    icon: "chair",
    iconClassName: "bg-orange-100 text-orange-600",
    category: "Furniture",
    status: "Assigned",
    assignee: {
      name: "Jordan Smith",
      avatarUrl:
        "https://lh3.googleusercontent.com/aida-public/AB6AXuBnaKS4ueJAX_3BjdDC9Tj1UqtdBv00HavnTw7Nb5prsMmcAKY93fDraBuIYfYh7wRKUdrj_0jZit4QmISpW8ovdtMpdBu0RIEbvcPt2fGJTfkhGh3XeZxfl1VCx0OL1GmHon8t1v6-jJasABzkEtnKFxCo6Oj8ySJFlCeHEeW1GIaZOwfa4bHCOZC0mqgBnOEXmGUeL8sEEkbYLwkP06YaU0dVRvRvyTPvTwgvYEeK79IowJRTARplDKYMnVJrYEDh2Z9X41pLqqU",
    },
    serialOrTag: "TAG-4421-HM",
  },
  {
    id: "4",
    name: "iPad Air Gen 5",
    icon: "tablet_mac",
    iconClassName: "bg-purple-100 text-purple-600",
    category: "Tablets",
    status: "Available",
    assignee: null,
    serialOrTag: "SN-55672-TAB",
  },
  {
    id: "5",
    name: "Logitech MX Mechanical",
    icon: "keyboard",
    iconClassName: "bg-slate-100 text-slate-600",
    category: "Peripherals",
    status: "Assigned",
    assignee: {
      name: "Elena Rodriguez",
      avatarUrl:
        "https://lh3.googleusercontent.com/aida-public/AB6AXuAjQ_9xj5K_QoM7nkJp1Uy-rzxG5V8EkIa1fQb1LGadLVxnlCmBk-kKWYHvAOUEYWd3e0FM0-ixrcU-Vt44IVsnTy94AzeYxybFWE2RpwtUTcIQBhoQpyKZ1d2WHXOX3v-eHJk48v0FUoKBXCEdysN5bNkEdSS-MOeboyjTNcI1_tFMSsd_2PeBiftsySDVNHofaey3tFqAKDdYjITevnX85DvgNOhfGfzRkbMhbvy2tpHVpRoDzsaMWK3TFYqV8ooMddQzDTgqq-s",
    },
    serialOrTag: "SN-22883-LOG",
  },
];

const statusStyles: Record<AssetStatus, string> = {
  Assigned: "bg-amber-100 text-amber-700",
  Available: "bg-emerald-100 text-emerald-700",
};

const statusDotStyles: Record<AssetStatus, string> = {
  Assigned: "bg-amber-500",
  Available: "bg-emerald-500",
};

export default function AssetsTable() {
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
            {assets.map((asset) => (
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
                  <span className="rounded-full bg-slate-100 px-2.5 py-1 text-xs font-medium text-slate-600">
                    {asset.category}
                  </span>
                </td>
                <td className="px-6 py-4 text-center">
                  <span
                    className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-bold ${statusStyles[asset.status]}`}
                  >
                    <span className={`size-1.5 rounded-full ${statusDotStyles[asset.status]}`}></span>
                    {asset.status}
                  </span>
                </td>
                <td className="px-6 py-4">
                  {asset.assignee ? (
                    <div className="flex items-center gap-2">
                      <Image
                        className="size-6 rounded-full"
                        alt={`${asset.assignee.name} profile picture`}
                        src={asset.assignee.avatarUrl}
                        width={24}
                        height={24}
                      />
                      <span className="text-sm text-slate-600">{asset.assignee.name}</span>
                    </div>
                  ) : (
                    <span className="text-sm text-slate-400">-</span>
                  )}
                </td>
                <td className="px-6 py-4 font-mono text-sm text-slate-500">{asset.serialOrTag}</td>
                <td className="px-6 py-4 text-right">
                  <button className="text-sm font-bold text-primary hover:text-primary/70">
                    Edit
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="flex items-center justify-between border-t border-slate-200 bg-slate-50/30 px-6 py-4">
        <div className="text-xs font-medium text-slate-500">Showing 1-5 of 124 results</div>
        <div className="flex items-center gap-1">
          <button
            className="flex size-8 items-center justify-center rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-100 disabled:opacity-50"
            disabled
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
          <button className="flex size-8 items-center justify-center rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-100">
            <span className="material-symbols-outlined text-sm">chevron_right</span>
          </button>
        </div>
      </div>
    </div>
  );
}
