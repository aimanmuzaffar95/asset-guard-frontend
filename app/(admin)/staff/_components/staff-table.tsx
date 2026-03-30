import { cookies } from "next/headers";
import { buildApiUrl } from "@/lib/config";
import { parseJson } from "../../dashboard/page";

type StaffRow = {
  id: string;
  name: string;
  initials: string;
  email: string;
  role: string;
  assetsCount: number;
};

type StaffMember = {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: "admin" | "staff";
  activeAssignementsCount: number;
};

type StaffMemberResponse = {
  success?: boolean;
  data?: StaffMember[] | { staffMembers?: StaffMember[] } | unknown;
  error?: {
    messages?: string[];
  };
};

export default async function StaffTable() {
  const result = await getStaffMembers();

  if (result.status === "error") {
    return (
      <div className="rounded-xl border border-rose-200 bg-rose-50 p-6 shadow-sm">
        <div className="flex items-start gap-3">
          <span className="material-symbols-outlined text-2xl text-rose-600">error</span>
          <div>
            <h2 className="text-base font-semibold text-rose-700">Unable to load staff</h2>
            <p className="mt-1 text-sm text-rose-700/80">{result.message}</p>
          </div>
        </div>
      </div>
    );
  }

  const staffMembers = result.data;

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
            {staffMembers.length === 0 ? (
              <tr>
                <td colSpan={5} className="px-6 py-10 text-center text-sm text-slate-500">
                  No staff members found.
                </td>
              </tr>
            ) : (
              staffMembers.map((staff) => (
                <tr key={staff.id} className="group transition-colors hover:bg-slate-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center gap-3">
                      <div className="size-9 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-sm">
                        {staff.initials}
                      </div>
                      <span className="font-semibold text-slate-900">{staff.name}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500">
                    {staff.email}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span
                      className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                        staff.role === "admin"
                          ? "bg-primary/10 text-primary"
                          : "bg-slate-100 text-slate-600"
                      }`}
                    >
                      {staff.role.charAt(0).toUpperCase() + staff.role.slice(1)}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-center font-bold text-slate-700">
                    {staff.assetsCount}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right">
                    <button className="text-primary font-bold text-sm hover:underline flex items-center gap-1 justify-end ml-auto">
                      View Details
                      <span className="material-symbols-outlined text-sm">arrow_forward</span>
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

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

async function getStaffMembers(): Promise<
  { status: "success"; data: StaffRow[] } | { status: "error"; message: string }
> {
  const cookieStore = await cookies();
  const accessToken = cookieStore.get("access_token")?.value;

  if (!accessToken) {
    return {
      status: "error",
      message: "Your admin session is missing. Please sign in again to continue.",
    };
  }

  let response: Response;

  try {
    response = await fetch(buildApiUrl("/users"), {
      method: "GET",
      headers: {
        Accept: "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
      cache: "no-store",
    });
  } catch {
    return {
      status: "error",
      message: "The staff service could not be reached right now.",
    };
  }

  const responseData = (await parseJson(response)) as StaffMemberResponse | null;

  if (!response.ok || responseData?.success !== true || !responseData.data) {
    return {
      status: "error",
      message:
        responseData?.error?.messages?.filter(Boolean).join(" ") ||
        "Failed to load staff members.",
    };
  }

  const members = extractStaffItems(responseData.data);

  return {
    status: "success",
    data: members.map(normalizeStaffMember),
  };
}

function extractStaffItems(data: unknown): StaffMember[] {
  if (Array.isArray(data)) return data as StaffMember[];
  if (data && typeof data === "object") {
    const nested = data as Record<string, unknown>;
    for (const key of ["staffMembers", "staff", "users", "data", "items", "results"]) {
      if (Array.isArray(nested[key])) return nested[key] as StaffMember[];
    }
  }
  return [];
}

function normalizeStaffMember(member: StaffMember): StaffRow {
  const firstName = member.firstName?.trim() ?? "";
  const lastName = member.lastName?.trim() ?? "";
  const name = [firstName, lastName].filter(Boolean).join(" ") || "Unknown";
  const initials =
    [firstName[0], lastName[0]].filter(Boolean).join("").toUpperCase() || "?";

  return {
    id: String(member.id),
    name,
    initials,
    email: member.email ?? "—",
    role: member.role ?? "staff",
    assetsCount: typeof member.activeAssignementsCount === "number" ? member.activeAssignementsCount : 0,
  };
}
