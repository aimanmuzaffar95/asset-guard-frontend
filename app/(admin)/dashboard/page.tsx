import { cookies } from "next/headers";
import DashboardHeader from "../_components/dashboard-header";
import MetricCard from "../_components/metric-card";
import RecentAssignments from "../_components/recent-assignments";
import AssetDistribution from "../_components/asset-distribution";
import { getApiBaseUrl } from "@/lib/config";

type DashboardTotals = {
  totalAssets?: number;
  assignedAssets?: number;
  availableAssets?: number;
  staffCount?: number;
};

type DashboardDistributionItem = {
  category?: string;
  count?: number;
  percentage?: number;
};

type DashboardResponse = {
  success?: boolean;
  data?: {
    totals?: DashboardTotals;
    assetDistribution?: DashboardDistributionItem[];
  };
  error?: {
    messages?: string[];
  };
  meta?: {
    timestamp?: string;
  };
};

type DashboardViewData = {
  totals: {
    totalAssets: number;
    assignedAssets: number;
    availableAssets: number;
    staffCount: number;
  };
  assetDistribution: Array<{
    category: string;
    count: number;
    percentage: number;
  }>;
  timestamp?: string;
};

export default async function DashboardPage() {
  const dashboardResult = await getDashboardData();

  if (dashboardResult.status === "error") {
    return (
      <div className="flex min-h-screen flex-col">
        <DashboardHeader />

        <main className="flex-1 space-y-6 p-6">
          <div className="space-y-1">
            <h1 className="text-2xl font-bold text-[var(--text-strong)]">Dashboard Overview</h1>
            <p className="text-[var(--text-muted)]">
              Manage and track company resources efficiently
            </p>
          </div>

          <section className="rounded-xl border border-rose-200 bg-rose-50 p-6 shadow-sm">
            <div className="flex items-start gap-3">
              <span className="material-symbols-outlined text-2xl text-rose-600">error</span>
              <div>
                <h2 className="text-lg font-semibold text-rose-700">Unable to load dashboard data</h2>
                <p className="mt-2 text-sm text-rose-700/80">{dashboardResult.message}</p>
                <p className="mt-3 text-sm text-rose-700/80">
                  Refresh the page after checking your admin session and API connectivity.
                </p>
              </div>
            </div>
          </section>
        </main>
      </div>
    );
  }

  const dashboardData = dashboardResult.data;
  const isEmpty = isDashboardEmpty(dashboardData);
  const lastUpdatedLabel = formatTimestamp(dashboardData.timestamp);

  return (
    <div className="flex min-h-screen flex-col">
      <DashboardHeader />

      <main className="flex-1 space-y-6 p-6">
        <div className="space-y-1">
          <h1 className="text-2xl font-bold text-[var(--text-strong)]">Dashboard Overview</h1>
          <p className="text-[var(--text-muted)]">
            Manage and track company resources efficiently
            {lastUpdatedLabel ? ` • Last updated ${lastUpdatedLabel}` : ""}
          </p>
        </div>

        {isEmpty && (
          <section className="rounded-xl border border-dashed border-[var(--border)] bg-[var(--surface)] p-5 shadow-sm">
            <div className="flex items-start gap-3">
              <span className="material-symbols-outlined text-2xl text-[var(--text-subtle)]">
                inventory
              </span>
              <div>
                <h2 className="text-base font-semibold text-[var(--text-strong)]">
                  No dashboard data yet
                </h2>
                <p className="mt-1 text-sm text-[var(--text-muted)]">
                  Add assets and staff records to populate these dashboard metrics and category
                  insights.
                </p>
              </div>
            </div>
          </section>
        )}

        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
          <MetricCard
            title="Total Assets"
            value={formatNumber(dashboardData.totals.totalAssets)}
            icon="inventory_2"
            iconContainerClassName="bg-blue-100 text-blue-600"
            description="All inventory items tracked in Asset Guard"
          />
          <MetricCard
            title="Assigned Assets"
            value={formatNumber(dashboardData.totals.assignedAssets)}
            icon="person_pin_circle"
            iconContainerClassName="bg-sky-100 text-sky-600"
            description="Currently issued to staff members"
          />
          <MetricCard
            title="Available Assets"
            value={formatNumber(dashboardData.totals.availableAssets)}
            icon="check_circle"
            iconContainerClassName="bg-amber-100 text-amber-600"
            description="Ready to be assigned to staff"
          />
          <MetricCard
            title="Staff Count"
            value={formatNumber(dashboardData.totals.staffCount)}
            icon="groups"
            iconContainerClassName="bg-violet-100 text-violet-600"
            description="Active staff records in the system"
          />
        </div>

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          <div className="lg:col-span-2">
            <RecentAssignments />
          </div>
          <div>
            <AssetDistribution categories={dashboardData.assetDistribution} />
          </div>
        </div>
      </main>
    </div>
  );
}

async function getDashboardData(): Promise<
  | {
      status: "success";
      data: DashboardViewData;
    }
  | {
      status: "error";
      message: string;
    }
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
    response = await fetch(`${getApiBaseUrl()}/admin/dashboard`, {
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
      message: "The dashboard service could not be reached right now.",
    };
  }

  const responseData = (await parseJson(response)) as DashboardResponse | null;

  if (!response.ok || responseData?.success !== true || !responseData.data) {
    const errorMessage =
      response.status === 401 || response.status === 403
        ? "Your session is no longer authorized to view the admin dashboard."
        : responseData?.error?.messages?.filter(Boolean).join(" ") ||
          "The dashboard service returned an unexpected response.";

    return {
      status: "error",
      message: errorMessage,
    };
  }

  return {
    status: "success",
    data: normalizeDashboardData(responseData),
  };
}

async function parseJson(response: Response) {
  const contentType = response.headers.get("content-type");

  if (!contentType?.includes("application/json")) {
    return null;
  }

  try {
    return await response.json();
  } catch {
    return null;
  }
}

function normalizeDashboardData(responseData: DashboardResponse): DashboardViewData {
  const totals = responseData.data?.totals;
  const assetDistribution = (responseData.data?.assetDistribution ?? []).map((item) => ({
    category: item.category?.trim() || "Unknown",
    count: toSafeNumber(item.count),
    percentage: toSafePercentage(item.percentage),
  }));

  const totalAssets = toSafeNumber(totals?.totalAssets) || sumCounts(assetDistribution);
  const assignedAssets = toSafeNumber(totals?.assignedAssets);
  const availableAssets =
    typeof totals?.availableAssets === "number" && Number.isFinite(totals.availableAssets)
      ? totals.availableAssets
      : Math.max(totalAssets - assignedAssets, 0);

  return {
    totals: {
      totalAssets,
      assignedAssets,
      availableAssets,
      staffCount: toSafeNumber(totals?.staffCount),
    },
    assetDistribution: assetDistribution.map((item) => ({
      ...item,
      percentage: item.percentage || resolveDistributionPercentage(item.count, totalAssets),
    })),
    timestamp: responseData.meta?.timestamp,
  };
}

function isDashboardEmpty(data: DashboardViewData) {
  return (
    data.totals.totalAssets === 0 &&
    data.totals.assignedAssets === 0 &&
    data.totals.availableAssets === 0 &&
    data.totals.staffCount === 0 &&
    data.assetDistribution.length === 0
  );
}

function sumCounts(items: Array<{ count: number }>) {
  return items.reduce((sum, item) => sum + item.count, 0);
}

function resolveDistributionPercentage(count: number, totalAssets: number) {
  if (!totalAssets) {
    return 0;
  }

  return Math.round((count / totalAssets) * 100);
}

function toSafeNumber(value?: number) {
  return typeof value === "number" && Number.isFinite(value) ? value : 0;
}

function toSafePercentage(value?: number) {
  if (typeof value !== "number" || !Number.isFinite(value)) {
    return 0;
  }

  return Math.max(0, Math.round(value));
}

function formatNumber(value: number) {
  return new Intl.NumberFormat("en-US").format(value);
}

function formatTimestamp(value?: string) {
  if (!value) {
    return "";
  }

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return "";
  }

  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
  }).format(date);
}
