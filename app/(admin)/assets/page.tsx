import { cookies } from "next/headers";
import DashboardHeader from "../_components/dashboard-header";
import { buildApiUrl } from "@/lib/config";
import type { Asset, AssetListErrorResponse, AssetListSuccessResponse } from "@/lib/assets";
import Link from "next/link";
import AssetsView from "./_components/assets-view";
import { parseJson } from "../dashboard/page";

type AssetsPageResult =
  | { status: "success"; data: Asset[] }
  | { status: "error"; message: string };

export default async function AssetsPage() {
  const result = await getAssets();

  return (
    <div className="flex flex-col min-h-screen">
      <DashboardHeader />

      <main className="flex-1 p-6 lg:p-10 space-y-6 max-w-[1200px] mx-auto w-full">
        <div className="flex flex-wrap justify-between items-end gap-4 mb-8">
          <div className="flex flex-col gap-1">
            <h1 className="text-slate-900 text-3xl font-extrabold tracking-tight">
              Asset Inventory
            </h1>
            <p className="text-slate-500 text-base">
              Monitor and manage company equipment and assignments.
            </p>
          </div>
          <Link
            href="/assets/new"
            className="flex items-center gap-2 rounded-lg bg-primary px-5 py-2.5 text-white text-sm font-bold shadow-lg shadow-primary/20 hover:bg-primary/90 transition-all"
          >
            <span className="material-symbols-outlined text-lg">add</span>
            <span>Add Asset Item</span>
          </Link>
        </div>

        {result.status === "error" ? (
          <section className="rounded-xl border border-rose-200 bg-rose-50 p-6 shadow-sm">
            <div className="flex items-start gap-3">
              <span className="material-symbols-outlined text-2xl text-rose-600">error</span>
              <div>
                <h2 className="text-base font-semibold text-rose-700">Unable to load assets</h2>
                <p className="mt-1 text-sm text-rose-700/80">{result.message}</p>
              </div>
            </div>
          </section>
        ) : result.data.length === 0 ? (
          <section className="rounded-xl border border-dashed border-slate-300 bg-white p-6 shadow-sm">
            <div className="flex items-start gap-3">
              <span className="material-symbols-outlined text-2xl text-slate-500">inventory_2</span>
              <div>
                <h2 className="text-base font-semibold text-slate-900">No assets yet</h2>
                <p className="mt-1 text-sm text-slate-500">
                  Add your first asset to start tracking inventory and assignments.
                </p>
              </div>
            </div>
          </section>
        ) : (
          <AssetsView assets={result.data} />
        )}
      </main>
    </div>
  );
}

async function getAssets(): Promise<AssetsPageResult> {
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
    response = await fetch(buildApiUrl("/assets"), {
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
      message: "The asset service could not be reached right now.",
    };
  }

  const responseData = (await parseJson(response)) as
    | AssetListSuccessResponse
    | AssetListErrorResponse
    | null;

  if (!response.ok || responseData?.success !== true || !Array.isArray(responseData.data)) {
    return {
      status: "error",
      message:
        responseData?.error?.messages?.filter(Boolean).join(" ") ||
        "Failed to load assets.",
    };
  }

  return {
    status: "success",
    data: responseData.data,
  };
}
