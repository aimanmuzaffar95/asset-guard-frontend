"use client";

import { useState } from "react";
import type { SyntheticEvent } from "react";
import { useRouter } from "next/navigation";

type SubmissionState = {
  status: "idle" | "success" | "error";
  message: string;
};

type LoginResponse = {
  success?: boolean;
  data?: {
    accessToken?: string;
    refreshToken?: string;
    tokenExpires?: number;
    user?: {
      id?: string;
      email?: string;
      firstName?: string;
      lastName?: string;
      role?: string;
      profileImageUrl?: string | null;
    };
  };
  error?: {
    messages?: string[];
    code?: string;
  };
};

export function LoginForm() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submissionState, setSubmissionState] = useState<SubmissionState>({
    status: "idle",
    message: "",
  });

  async function handleSubmit(event: SyntheticEvent<HTMLFormElement, SubmitEvent>) {
    event.preventDefault();
    setIsSubmitting(true);
    setSubmissionState({ status: "idle", message: "" });

    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        credentials: "include",
        body: JSON.stringify({ email: email.trim(), password }),
      });

      const responseData = (await parseResponse(response)) as LoginResponse;
      const isSuccess = response.ok && responseData?.success === true;
      const message = getResponseMessage(responseData, isSuccess);

      setSubmissionState({
        status: isSuccess ? "success" : "error",
        message,
      });

      if (isSuccess) {
        router.push("/dashboard");
        router.refresh();
      }
    } catch {
      setSubmissionState({
        status: "error",
        message: "Unable to reach the login service. Please try again.",
      });
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <form className="space-y-6 p-8" onSubmit={handleSubmit}>
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
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            placeholder="name@company.com"
            autoComplete="email"
            required
            disabled={isSubmitting}
            className="w-full rounded-lg border border-[var(--input-border)] bg-[var(--input-background)] py-3 pr-4 pl-10 text-[var(--text-strong)] outline-none transition-all focus:border-transparent focus:ring-2 focus:ring-primary disabled:cursor-not-allowed disabled:opacity-70"
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
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            placeholder="••••••••"
            autoComplete="current-password"
            required
            disabled={isSubmitting}
            className="w-full rounded-lg border border-[var(--input-border)] bg-[var(--input-background)] py-3 pr-4 pl-10 text-[var(--text-strong)] outline-none transition-all focus:border-transparent focus:ring-2 focus:ring-primary disabled:cursor-not-allowed disabled:opacity-70"
          />
        </div>
      </div>

      <div className="flex items-center">
        <input
          id="remember"
          type="checkbox"
          disabled={isSubmitting}
          className="h-4 w-4 rounded border-[var(--input-border)] bg-[var(--input-background)] text-primary focus:ring-2 focus:ring-primary disabled:cursor-not-allowed"
        />
        <label
          className="ml-2 text-sm font-medium text-[var(--text-muted)]"
          htmlFor="remember"
        >
          Remember this device
        </label>
      </div>

      <div className="space-y-3">
        <button
          type="submit"
          disabled={isSubmitting}
          className="flex w-full items-center justify-center gap-2 rounded-lg bg-primary py-3.5 font-bold text-white shadow-lg shadow-primary/20 transition-all hover:bg-primary/90 disabled:cursor-not-allowed disabled:bg-primary/75"
        >
          {isSubmitting ? <SpinnerIcon className="h-5 w-5 animate-spin" /> : <LoginIcon className="h-5 w-5" />}
          <span>{isSubmitting ? "Signing In..." : "Sign In"}</span>
        </button>

        <p
          aria-live="polite"
          className={`min-h-6 text-sm font-medium ${
            submissionState.status === "error"
              ? "text-rose-500"
              : submissionState.status === "success"
                ? "text-emerald-600"
                : "text-transparent"
          }`}
        >
          {submissionState.message || " "}
        </p>
      </div>
    </form>
  );
}

async function parseResponse(response: Response) {
  const contentType = response.headers.get("content-type");

  if (contentType?.includes("application/json")) {
    return response.json();
  }

  return null;
}

function getResponseMessage(responseData: LoginResponse | null, isSuccess: boolean) {
  if (isSuccess) {
    const firstName = responseData?.data?.user?.firstName?.trim();
    const lastName = responseData?.data?.user?.lastName?.trim();
    const fullName = [firstName, lastName].filter(Boolean).join(" ");
    const role = responseData?.data?.user?.role;

    if (fullName && role) {
      return `Login successful. Welcome ${fullName} (${role}).`;
    }

    if (fullName) {
      return `Login successful. Welcome ${fullName}.`;
    }

    if (role) {
      return `Login successful. Signed in as ${role}.`;
    }

    return "Login successful.";
  }

  const errorMessages = responseData?.error?.messages?.filter(Boolean);

  if (errorMessages?.length) {
    return errorMessages.join(" ");
  }

  return isSuccess ? "Login successful." : "Login failed. Please check your credentials.";
}

type IconProps = {
  className?: string;
};

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

function SpinnerIcon({ className }: IconProps) {
  return (
    <svg
      aria-hidden="true"
      className={className}
      fill="none"
      viewBox="0 0 24 24"
      xmlns="http://www.w3.org/2000/svg"
    >
      <circle
        cx="12"
        cy="12"
        r="9"
        className="opacity-20"
        stroke="currentColor"
        strokeWidth="3"
      />
      <path
        d="M21 12a9 9 0 0 0-9-9"
        stroke="currentColor"
        strokeLinecap="round"
        strokeWidth="3"
      />
    </svg>
  );
}
