"use client";

import { usePathname } from "next/navigation";

export default function DashboardHeader() {
    const pathname = usePathname();

    // Simple breadcrumb logic based on path
    const segments = pathname.split("/").filter(Boolean);
    const breadcrumbs = segments.map((segment, index) => {
        const isLast = index === segments.length - 1;
        const label = segment.charAt(0).toUpperCase() + segment.slice(1).replace(/-/g, " ");

        return (
            <span key={segment} className="flex items-center gap-2">
                <span className={isLast ? "text-[var(--text-strong)] font-semibold" : "text-[var(--text-muted)]"}>
                    {label}
                </span>
                {!isLast && (
                    <span className="material-symbols-outlined text-sm text-[var(--text-subtle)]">
                        chevron_right
                    </span>
                )}
            </span>
        );
    });

    return (
        <header className="flex h-16 items-center justify-between border-b border-[var(--border)] bg-[var(--surface-overlay)] px-6 backdrop-blur-md sticky top-0 z-10">
            <div className="flex items-center gap-2 text-sm">
                {breadcrumbs}
            </div>

            <div className="flex items-center gap-4">
                <div className="relative">
                    <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-lg text-[var(--text-muted)]">
                        search
                    </span>
                    <input
                        type="text"
                        placeholder="Search assets..."
                        className="h-9 w-64 rounded-lg border border-[var(--input-border)] bg-[var(--input-background)] pl-10 pr-4 text-xs focus:border-primary focus:outline-none transition-colors"
                    />
                </div>

                <button className="flex h-9 w-9 items-center justify-center rounded-lg border border-[var(--border)] bg-[var(--surface)] text-[var(--text-interactive)] hover:bg-[var(--surface-muted)] transition-colors">
                    <span className="material-symbols-outlined text-xl">notifications</span>
                </button>
            </div>
        </header>
    );
}
