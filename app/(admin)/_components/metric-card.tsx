type MetricCardProps = {
  title: string;
  value: string | number;
  icon: string;
  iconContainerClassName?: string;
  iconClassName?: string;
  trend?: {
    value: string | number;
    isUp: boolean;
  };
  description?: string;
};

export default function MetricCard({
  title,
  value,
  icon,
  iconContainerClassName,
  iconClassName,
  trend,
  description,
}: MetricCardProps) {
  return (
    <div className="rounded-xl border border-[var(--border)] bg-[var(--surface)] p-5 shadow-sm transition-all hover:shadow-md">
      <div className="flex items-start justify-between">
        <div
          className={`rounded-lg p-2 ${
            iconContainerClassName ?? "bg-primary/5 text-primary"
          }`}
        >
          <span className={`material-symbols-outlined text-2xl ${iconClassName ?? ""}`}>
            {icon}
          </span>
        </div>
        {trend && (
          <div
            className={`flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-medium ${
              trend.isUp ? "bg-emerald-500/10 text-emerald-600" : "bg-rose-500/10 text-rose-600"
            }`}
          >
            <span className="material-symbols-outlined text-xs">
              {trend.isUp ? "trending_up" : "trending_down"}
            </span>
            {trend.value}%
          </div>
        )}
      </div>

      <div className="mt-4">
        <h3 className="text-sm font-medium text-[var(--text-muted)]">{title}</h3>
        <p className="mt-1 text-2xl font-bold text-[var(--text-strong)]">{value}</p>
        {(trend || description) && (
          <p className="mt-2 text-xs text-[var(--text-subtle)]">
            {description ? description : "vs previous month"}
          </p>
        )}
      </div>
    </div>
  );
}
