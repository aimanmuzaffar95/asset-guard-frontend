"use client";

type Category = {
    label: string;
    count: number;
    color: string;
};

const categories: Category[] = [
    { label: "Laptops", count: 65, color: "#1152d4" },
    { label: "Monitors", count: 42, color: "#6366f1" },
    { label: "Peripherals", count: 28, color: "#a855f7" },
    { label: "Mobile Phones", count: 15, color: "#ec4899" },
];

export default function AssetDistribution() {
    const total = categories.reduce((acc, cat) => acc + cat.count, 0);

    return (
        <div className="rounded-xl border border-[var(--border)] bg-[var(--surface)] p-6 shadow-sm">
            <h2 className="text-lg font-bold text-[var(--text-strong)] mb-6">Asset Distribution</h2>

            <div className="flex flex-col gap-6">
                {/* Simple visual bar */}
                <div className="h-4 w-full flex rounded-full overflow-hidden bg-[var(--surface-muted)]">
                    {categories.map((cat) => (
                        <div
                            key={cat.label}
                            style={{ width: `${(cat.count / total) * 100}%`, backgroundColor: cat.color }}
                            title={`${cat.label}: ${cat.count}`}
                        />
                    ))}
                </div>

                {/* Legend */}
                <div className="space-y-4">
                    {categories.map((cat) => (
                        <div key={cat.label} className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                                <div className="h-3 w-3 rounded-full" style={{ backgroundColor: cat.color }} />
                                <span className="text-sm font-medium text-[var(--text-interactive)]">
                                    {cat.label}
                                </span>
                            </div>
                            <div className="flex items-center gap-2">
                                <span className="text-sm font-bold text-[var(--text-strong)]">{cat.count}</span>
                                <span className="text-xs text-[var(--text-subtle)]">
                                    ({Math.round((cat.count / total) * 100)}%)
                                </span>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            <div className="mt-8 rounded-lg bg-primary/5 p-4">
                <div className="flex items-start gap-3">
                    <span className="material-symbols-outlined text-primary">analytics</span>
                    <div>
                        <h4 className="text-sm font-bold text-primary">Need a Report?</h4>
                        <p className="mt-1 text-xs text-primary/80">
                            Generate detailed inventory reports for your quarterly audit.
                        </p>
                        <button className="mt-3 text-xs font-bold text-primary hover:underline uppercase tracking-wider">
                            Download CSV
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
