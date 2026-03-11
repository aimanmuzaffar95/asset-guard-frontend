"use client";

import type { ReactNode } from "react";
import { useState } from "react";

type Theme = "light" | "dark";

export function ThemeToggle() {
  const [theme, setTheme] = useState<Theme>(() =>
    document.documentElement.classList.contains("dark") ? "dark" : "light",
  );

  function updateTheme(nextTheme: Theme) {
    const root = document.documentElement;

    root.classList.toggle("dark", nextTheme === "dark");
    window.localStorage.setItem("theme", nextTheme);
    setTheme(nextTheme);
  }

  return (
    <div className="mb-6 flex justify-center">
      <div className="inline-flex items-center gap-1 rounded-full border border-[var(--border)] bg-[var(--surface-overlay)] p-1 shadow-sm backdrop-blur">
        <ThemeButton
          active={theme === "light"}
          icon={<SunIcon className="h-4 w-4" />}
          label="Light"
          onClick={() => updateTheme("light")}
        />
        <ThemeButton
          active={theme === "dark"}
          icon={<MoonIcon className="h-4 w-4" />}
          label="Dark"
          onClick={() => updateTheme("dark")}
        />
      </div>
    </div>
  );
}

type ThemeButtonProps = {
  active: boolean;
  icon: ReactNode;
  label: string;
  onClick: () => void;
};

function ThemeButton({ active, icon, label, onClick }: ThemeButtonProps) {
  return (
    <button
      type="button"
      aria-pressed={active}
      onClick={onClick}
      className={`inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-semibold transition-colors ${
        active
          ? "bg-primary text-white shadow-sm"
          : "text-[var(--text-interactive)] hover:bg-[var(--surface-muted)]"
      }`}
    >
      {icon}
      <span>{label}</span>
    </button>
  );
}

type IconProps = {
  className?: string;
};

function SunIcon({ className }: IconProps) {
  return (
    <svg
      aria-hidden="true"
      className={className}
      fill="none"
      viewBox="0 0 24 24"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M12 3.75v1.5M12 18.75v1.5M5.813 5.813l1.062 1.062M17.125 17.125l1.062 1.062M3.75 12h1.5M18.75 12h1.5M5.813 18.187l1.062-1.062M17.125 6.875l1.062-1.062"
        stroke="currentColor"
        strokeLinecap="round"
        strokeWidth="1.5"
      />
      <circle cx="12" cy="12" r="3.75" stroke="currentColor" strokeWidth="1.5" />
    </svg>
  );
}

function MoonIcon({ className }: IconProps) {
  return (
    <svg
      aria-hidden="true"
      className={className}
      fill="none"
      viewBox="0 0 24 24"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M21 12.79A9 9 0 1 1 11.21 3a7.5 7.5 0 0 0 9.79 9.79Z"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1.5"
      />
    </svg>
  );
}
