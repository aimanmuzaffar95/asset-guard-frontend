import type { Metadata } from "next";
import { LoginForm } from "./login-form";

export const metadata: Metadata = {
  title: "Login",
  description: "Sign in to Asset Guard.",
};

const LOGIN_API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL ?? "https://asset-guard-pied.vercel.app";

export default function LoginPage() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-[var(--page-background)] p-4 transition-colors">
      <div className="w-full max-w-md">
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

          <LoginForm apiBaseUrl={LOGIN_API_BASE_URL} />

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
