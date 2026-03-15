import DashboardHeader from "../_components/dashboard-header";
import MetricCard from "../_components/metric-card";
import RecentAssignments from "../_components/recent-assignments";
import AssetDistribution from "../_components/asset-distribution";

export default function DashboardPage() {
  return (
    <div className="flex flex-col min-h-screen">
      <DashboardHeader />

      <main className="flex-1 p-6 space-y-6">
        {/* Header Section */}
        <div className="space-y-1">
          <h1 className="text-2xl font-bold text-[var(--text-strong)]">Dashboard Overview</h1>
          <p className="text-[var(--text-muted)]">Manage and track company resources efficiently</p>
        </div>

        {/* Metrics Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <MetricCard
            title="Total Assets"
            value="150"
            icon="inventory_2"
            trend={{ value: 5.2, isUp: true }}
          />
          <MetricCard
            title="Assigned Assets"
            value="120"
            icon="person_pin_circle"
            trend={{ value: 2.1, isUp: true }}
          />
          <MetricCard
            title="Available Assets"
            value="30"
            icon="check_circle"
            trend={{ value: 1.5, isUp: false }}
          />
          <MetricCard
            title="Staff Count"
            value="45"
            icon="groups"
            trend={{ value: 8.4, isUp: true }}
          />
        </div>

        {/* Content Tabs/Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <RecentAssignments />
          </div>
          <div>
            <AssetDistribution />
          </div>
        </div>
      </main>
    </div>
  );
}
