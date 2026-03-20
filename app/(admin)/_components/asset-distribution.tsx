type Category = {
  category: string;
  count: number;
  percentage: number;
};

type AssetDistributionProps = {
  categories: Category[];
};

const CATEGORY_COLORS = ["#1152d4", "#0f766e", "#d97706", "#be185d", "#7c3aed", "#0891b2"];

export default function AssetDistribution({ categories }: AssetDistributionProps) {
  const total = categories.reduce((sum, category) => sum + category.count, 0);

  return (
    <div className="rounded-xl border border-[var(--border)] bg-[var(--surface)] p-6 shadow-sm">
      <h2 className="mb-6 text-lg font-bold text-[var(--text-strong)]">Asset Distribution</h2>

      {categories.length === 0 ? (
        <div className="rounded-lg border border-dashed border-[var(--border)] bg-[var(--surface-muted)] px-4 py-10 text-center">
          <span className="material-symbols-outlined text-3xl text-[var(--text-subtle)]">donut_large</span>
          <h3 className="mt-3 text-sm font-semibold text-[var(--text-strong)]">
            No distribution data yet
          </h3>
          <p className="mt-2 text-sm text-[var(--text-muted)]">
            Asset categories will appear here once inventory has been added to the system.
          </p>
        </div>
      ) : (
        <div className="flex flex-col gap-6">
          <div className="flex h-4 w-full overflow-hidden rounded-full bg-[var(--surface-muted)]">
            {categories.map((category, index) => (
              <div
                key={`${category.category}-${index}`}
                style={{
                  width: `${resolvePercentageWidth(category.percentage, category.count, total)}%`,
                  backgroundColor: CATEGORY_COLORS[index % CATEGORY_COLORS.length],
                }}
                title={`${category.category}: ${category.count} (${category.percentage}%)`}
              />
            ))}
          </div>

          <div className="space-y-4">
            {categories.map((category, index) => (
              <div key={`${category.category}-${index}`} className="flex items-center justify-between gap-4">
                <div className="flex items-center gap-2">
                  <div
                    className="h-3 w-3 rounded-full"
                    style={{ backgroundColor: CATEGORY_COLORS[index % CATEGORY_COLORS.length] }}
                  />
                  <span className="text-sm font-medium text-[var(--text-interactive)]">
                    {category.category}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-sm font-bold text-[var(--text-strong)]">{category.count}</span>
                  <span className="text-xs text-[var(--text-subtle)]">({category.percentage}%)</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="mt-8 rounded-lg bg-primary/5 p-4">
        <div className="flex items-start gap-3">
          <span className="material-symbols-outlined text-primary">analytics</span>
          <div>
            <h4 className="text-sm font-bold text-primary">Inventory Mix</h4>
            <p className="mt-1 text-xs text-primary/80">
              {categories.length === 0
                ? "Category insights will appear here once inventory records are available."
                : `${total} total assets are represented across ${categories.length} category${
                    categories.length === 1 ? "" : "ies"
                  }.`}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

function resolvePercentageWidth(percentage: number, count: number, total: number) {
  if (percentage > 0) {
    return percentage;
  }

  if (!total) {
    return 0;
  }

  return Math.round((count / total) * 100);
}
