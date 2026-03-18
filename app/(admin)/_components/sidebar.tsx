"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";

type NavItem = {
  label: string;
  href: string;
  icon: string; // Material Symbols name
};

type SidebarProps = {
  activeHref?: string; // e.g. "/dashboard"
  brandTitle?: string;
  brandSubtitle?: string;
  userName?: string;
  userRole?: string;
  userImageUrl?: string;
  navItems?: NavItem[];
  onLogoutClick?: () => void;
};

const defaultNav: NavItem[] = [
  { label: "Dashboard", href: "/dashboard", icon: "dashboard" },
  { label: "Assets", href: "/assets", icon: "package_2" },
  { label: "Staff", href: "/staff", icon: "group" },
  { label: "Reports", href: "/reports", icon: "bar_chart" },
  { label: "Settings", href: "/settings", icon: "settings" },
];

function cx(...classes: Array<string | false | null | undefined>) {
  return classes.filter(Boolean).join(" ");
}

export default function Sidebar({
  activeHref,
  brandTitle = "Asset Manager",
  brandSubtitle = "Admin Console",
  userName = "Alex Rivera",
  userRole = "System Admin",
  userImageUrl = "https://lh3.googleusercontent.com/aida-public/AB6AXuDBCo3kczg7NtvkUKjFgqv6GodH328rorP5g3kXVXLSsYfgMKmUfxACyA-ynaRlwKgQ_B69ODwVyNb-_589ru9xl2hl_wa1WJVdU39sOPiZjkwVJlrNeCBLm9mx3x3LPcxgygjKrq0OhE-qdoyyTy5m_Hr2fNRASWJzw-ODeVyNBpkYXBXVqCfOwI7tf6KAhxsaRPllknpFKid9FrzdxGIRHFB0jtQYGrQMzLCSWIWdzBnPkUXrYET78uJUcAa5VSFgNH0K41P-Loc",
  navItems = defaultNav,
  onLogoutClick,
}: SidebarProps) {
  const router = useRouter();
  const pathname = usePathname();
  const currentHref = activeHref ?? pathname;
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  async function handleLogout() {
    if (onLogoutClick) {
      onLogoutClick();
      return;
    }

    if (isLoggingOut) {
      return;
    }

    setIsLoggingOut(true);

    try {
      await fetch("/api/auth/logout", {
        method: "POST",
        credentials: "include",
      });
    } finally {
      router.replace("/login");
      router.refresh();
      setIsLoggingOut(false);
    }
  }

  return (
    <aside className="w-64 flex-shrink-0 overflow-y-auto border-r border-[var(--border)] bg-[var(--surface)] transition-colors">
      <div className="flex flex-col h-full p-4">
        {/* Brand */}
        <div className="flex items-center gap-3 mb-8 px-2">
          <div className="rounded-lg bg-primary/10 p-1.5 text-primary flex items-center justify-center">
            <span className="material-symbols-outlined text-2xl">inventory_2</span>
          </div>
          <div>
            <h1 className="text-base font-bold leading-none text-[var(--text-strong)]">
              {brandTitle}
            </h1>
            <p className="mt-1 text-xs font-medium text-[var(--text-muted)]">
              {brandSubtitle}
            </p>
          </div>
        </div>

        {/* Nav */}
        <nav className="flex-1 space-y-1">
          {navItems.map((item) => {
            const isActive = item.href === currentHref;

            return (
              <Link
                key={item.href}
                href={item.href}
                aria-current={isActive ? "page" : undefined}
                className={cx(
                  "flex items-center gap-3 px-3 py-2 rounded-lg font-medium transition-colors",
                  isActive
                    ? "bg-primary/10 text-primary font-semibold"
                    : "text-[var(--text-interactive)] hover:bg-[var(--surface-muted)]"
                )}
              >
                <span className="material-symbols-outlined">{item.icon}</span>
                <span className="text-sm">{item.label}</span>
              </Link>
            );
          })}
        </nav>

        {/* User / Footer */}
        <div className="mt-auto border-t border-[var(--border)] pt-4">
          <div className="flex items-center gap-3 px-2 py-3">
            <div
              className="h-10 w-10 rounded-full bg-[var(--surface-muted)] bg-cover bg-center"
              style={{ backgroundImage: `url('${userImageUrl}')` }}
              aria-label="User profile"
              role="img"
            />
            <div className="flex-1 min-w-0">
              <p className="truncate text-sm font-semibold text-[var(--text-strong)]">
                {userName}
              </p>
              <p className="truncate text-xs text-[var(--text-muted)]">
                {userRole}
              </p>
            </div>

            <button
              type="button"
              onClick={handleLogout}
              disabled={isLoggingOut}
              className="rounded-md p-1 text-[var(--text-muted)] hover:bg-[var(--surface-muted)] disabled:cursor-not-allowed disabled:opacity-60"
              aria-label={isLoggingOut ? "Logging out" : "Logout"}
            >
              <span className="material-symbols-outlined text-lg">logout</span>
            </button>
          </div>
        </div>
      </div>
    </aside>
  );
}
