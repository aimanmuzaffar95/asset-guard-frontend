import type { Metadata } from "next";
import { ThemeToggle } from "./theme-toggle";

export const metadata: Metadata = {
  title: "Login",
  description: "Sign in to Asset Guard.",
};

export default function LoginPage() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-[var(--page-background)] p-4 transition-colors">
      <div className="w-full max-w-md">
        <ThemeToggle />
        <section className="overflow-hidden rounded-xl border border-[var(--border)] bg-[var(--surface)] shadow-xl transition-colors">
          <header className="p-8 pb-0 text-center">
            <div className="mb-4 inline-flex items-center justify-center rounded-xl bg-primary/10 p-3 text-primary">
              <WalletIcon className="h-10 w-10" />
            </div>
            <h1 className="text-2xl font-bold tracking-tight text-[var(--text-strong)]">
              Asset Manager
            </h1>
            <p className="mt-2 text-[var(--text-muted)]">
              Sign in to manage your portfolio
            </p>
          </header>

          <form className="space-y-6 p-8">
            <div className="space-y-2">
              <label
                className="ml-1 text-sm font-semibold text-[var(--text-interactive)]"
                htmlFor="email"
              >
                Email Address
              </label>
              <div className="relative">
                <MailIcon className="pointer-events-none absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />
                <input
                  id="email"
                  type="email"
                  placeholder="name@company.com"
                  autoComplete="email"
                  className="w-full rounded-lg border border-[var(--input-border)] bg-[var(--input-background)] py-3 pr-4 pl-10 text-[var(--text-strong)] outline-none transition-all focus:border-transparent focus:ring-2 focus:ring-primary"
                />
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between gap-4">
                <label
                  className="ml-1 text-sm font-semibold text-[var(--text-interactive)]"
                  htmlFor="password"
                >
                  Password
                </label>
                <a
                  className="text-sm font-medium text-primary transition-all hover:underline"
                  href="#"
                >
                  Forgot password?
                </a>
              </div>
              <div className="relative">
                <LockIcon className="pointer-events-none absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />
                <input
                  id="password"
                  type="password"
                  placeholder="••••••••"
                  autoComplete="current-password"
                  className="w-full rounded-lg border border-[var(--input-border)] bg-[var(--input-background)] py-3 pr-4 pl-10 text-[var(--text-strong)] outline-none transition-all focus:border-transparent focus:ring-2 focus:ring-primary"
                />
              </div>
            </div>

            <div className="flex items-center">
              <input
                id="remember"
                type="checkbox"
                className="h-4 w-4 rounded border-[var(--input-border)] bg-[var(--input-background)] text-primary focus:ring-2 focus:ring-primary"
              />
              <label
                className="ml-2 text-sm font-medium text-[var(--text-muted)]"
                htmlFor="remember"
              >
                Remember this device
              </label>
            </div>

            <button
              type="submit"
              className="flex w-full items-center justify-center gap-2 rounded-lg bg-primary py-3.5 font-bold text-white shadow-lg shadow-primary/20 transition-all hover:bg-primary/90"
            >
              <span>Sign In</span>
              <LoginIcon className="h-5 w-5" />
            </button>
          </form>

          <footer className="border-t border-[var(--border-soft)] bg-[var(--footer-surface)] px-8 py-6 text-center transition-colors">
            <p className="text-sm text-[var(--text-muted)]">
              Don&apos;t have an account?{" "}
              <a className="font-bold text-primary hover:underline" href="#">
                Request Access
              </a>
            </p>
          </footer>
        </section>

        <div className="mt-8 flex flex-wrap items-center justify-center gap-x-6 gap-y-3 text-xs font-medium text-[var(--text-subtle)] transition-colors">
          <div className="flex items-center gap-1.5">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
            System Operational
          </div>
          <a
            className="transition-colors hover:text-[var(--text-interactive)]"
            href="#"
          >
            Privacy Policy
          </a>
          <a
            className="transition-colors hover:text-[var(--text-interactive)]"
            href="#"
          >
            Help Center
          </a>
        </div>
      </div>
    </main>
  );
}

type IconProps = {
  className?: string;
};

function WalletIcon({ className }: IconProps) {
  return (
    <svg
      aria-hidden="true"
      className={className}
      fill="none"
      viewBox="0 0 24 24"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M3.75 7.5A2.25 2.25 0 0 1 6 5.25h10.94a2.25 2.25 0 0 1 1.6.66l1.8 1.8c.42.42.66 1 .66 1.59v7.44A2.25 2.25 0 0 1 18.75 19H6a2.25 2.25 0 0 1-2.25-2.25V7.5Z"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1.5"
      />
      <path
        d="M16.5 12.75a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3Z"
        fill="currentColor"
      />
      <path
        d="M3.75 8.25h16.5"
        stroke="currentColor"
        strokeLinecap="round"
        strokeWidth="1.5"
      />
    </svg>
  );
}

function MailIcon({ className }: IconProps) {
  return (
    <svg
      aria-hidden="true"
      className={className}
      fill="none"
      viewBox="0 0 24 24"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M3.75 7.5A2.25 2.25 0 0 1 6 5.25h12A2.25 2.25 0 0 1 20.25 7.5v9A2.25 2.25 0 0 1 18 18.75H6a2.25 2.25 0 0 1-2.25-2.25v-9Z"
        stroke="currentColor"
        strokeWidth="1.5"
      />
      <path
        d="m4.5 7.5 7.5 6 7.5-6"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1.5"
      />
    </svg>
  );
}

function LockIcon({ className }: IconProps) {
  return (
    <svg
      aria-hidden="true"
      className={className}
      fill="none"
      viewBox="0 0 24 24"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M7.5 10.5V8.25a4.5 4.5 0 1 1 9 0v2.25"
        stroke="currentColor"
        strokeLinecap="round"
        strokeWidth="1.5"
      />
      <path
        d="M6 10.5h12a1.5 1.5 0 0 1 1.5 1.5v6A2.25 2.25 0 0 1 17.25 20.25H6.75A2.25 2.25 0 0 1 4.5 18v-6A1.5 1.5 0 0 1 6 10.5Z"
        stroke="currentColor"
        strokeWidth="1.5"
      />
    </svg>
  );
}

function LoginIcon({ className }: IconProps) {
  return (
    <svg
      aria-hidden="true"
      className={className}
      fill="none"
      viewBox="0 0 24 24"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M15.75 8.25 19.5 12l-3.75 3.75"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1.5"
      />
      <path
        d="M19.5 12H9"
        stroke="currentColor"
        strokeLinecap="round"
        strokeWidth="1.5"
      />
      <path
        d="M10.5 5.25H7.875A2.625 2.625 0 0 0 5.25 7.875v8.25a2.625 2.625 0 0 0 2.625 2.625H10.5"
        stroke="currentColor"
        strokeLinecap="round"
        strokeWidth="1.5"
      />
    </svg>
  );
}
