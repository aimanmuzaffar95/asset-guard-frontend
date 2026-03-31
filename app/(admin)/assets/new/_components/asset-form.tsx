"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

type SubmissionState = {
  status: "idle" | "error";
  message: string;
};

type AssetType = {
  id: string;
  name: string;
  description: string | null;
};

type AssetTypesResponse = {
  success?: boolean;
  data?: AssetType[];
  error?: {
    messages?: string[];
  };
};

export default function AssetForm() {
  const router = useRouter();
  const [assetTypes, setAssetTypes] = useState<AssetType[]>([]);
  const [assetTypesStatus, setAssetTypesStatus] = useState<
    "loading" | "ready" | "error"
  >("loading");
  const [assetTypesMessage, setAssetTypesMessage] = useState(
    "Loading asset types...",
  );
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccessDialogOpen, setIsSuccessDialogOpen] = useState(false);
  const [submission, setSubmission] = useState<SubmissionState>({
    status: "idle",
    message: "",
  });

  useEffect(() => {
    let isMounted = true;

    async function loadAssetTypes() {
      setAssetTypesStatus("loading");
      setAssetTypesMessage("Loading asset types...");

      try {
        const response = await fetch("/api/asset-types", {
          method: "GET",
          credentials: "include",
          cache: "no-store",
        });
        const data = (await response.json()) as AssetTypesResponse;

        if (!response.ok || data.success !== true || !Array.isArray(data.data)) {
          if (!isMounted) {
            return;
          }

          setAssetTypes([]);
          setAssetTypesStatus("error");
          setAssetTypesMessage(
            data.error?.messages?.[0] ?? "Failed to load asset types.",
          );
          return;
        }

        if (!isMounted) {
          return;
        }

        setAssetTypes(data.data);
        setAssetTypesStatus("ready");
        setAssetTypesMessage(
          data.data.length > 0
            ? "Select the asset type that best matches this inventory item."
            : "No asset types are available yet. Create an asset type before adding assets.",
        );
      } catch {
        if (!isMounted) {
          return;
        }

        setAssetTypes([]);
        setAssetTypesStatus("error");
        setAssetTypesMessage("Failed to load asset types.");
      }
    }

    void loadAssetTypes();

    return () => {
      isMounted = false;
    };
  }, []);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setSubmission({ status: "idle", message: "" });

    if (isSubmitting) {
      return;
    }

    if (assetTypesStatus !== "ready" || assetTypes.length === 0) {
      setSubmission({
        status: "error",
        message: "Asset types must load before you can save an asset.",
      });
      return;
    }

    const formData = new FormData(e.currentTarget);
    const payload = {
      name: getFormValue(formData, "name"),
      assetTypeId: getFormValue(formData, "assetTypeId"),
      serialNumber: getFormValue(formData, "serialNumber"),
      notes: getFormValue(formData, "notes"),
    };

    setIsSubmitting(true);

    try {
      const res = await fetch("/api/assets", {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await res.json();

      if (!res.ok || !data.success) {
        setSubmission({
          status: "error",
          message: data?.error?.messages?.[0] ?? "Failed to save asset.",
        });
        return;
      }

      setIsSuccessDialogOpen(true);
    } catch {
      setSubmission({
        status: "error",
        message: "An unexpected error occurred. Please try again.",
      });
    } finally {
      setIsSubmitting(false);
    }
  }

  function handleSuccessDialogClose() {
    setIsSuccessDialogOpen(false);
    router.push("/assets");
  }

  const areAssetTypesUnavailable =
    assetTypesStatus !== "ready" || assetTypes.length === 0;
  const areFormControlsDisabled = areAssetTypesUnavailable || isSubmitting;

  return (
    <div className="rounded-xl border border-[var(--border)] bg-[var(--surface)] shadow-sm overflow-hidden">
      <form className="p-8 space-y-8" onSubmit={handleSubmit} noValidate>
        {/* Item Name + Asset Type */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="flex flex-col gap-2">
            <label
              htmlFor="name"
              className="text-sm font-semibold text-[var(--text-strong)]"
            >
              Item Name <span className="text-red-500">*</span>
            </label>
            <input
              id="name"
              name="name"
              type="text"
              required
              disabled={isSubmitting}
              placeholder="e.g. MacBook Pro 16-inch"
              className="w-full rounded-lg border border-[var(--input-border)] bg-[var(--input-background)] text-[var(--text-strong)] placeholder:text-[var(--text-subtle)] focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary p-3 text-sm transition-all"
            />
            <p className="text-xs text-[var(--text-muted)]">
              Unique identifier name for the hardware or software.
            </p>
          </div>

          <div className="flex flex-col gap-2">
            <label
              htmlFor="assetTypeId"
              className="text-sm font-semibold text-[var(--text-strong)]"
            >
              Asset Type <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <select
                id="assetTypeId"
                name="assetTypeId"
                required
                defaultValue=""
                disabled={areFormControlsDisabled}
                className="w-full appearance-none rounded-lg border border-[var(--input-border)] bg-[var(--input-background)] text-[var(--text-strong)] focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary p-3 pr-10 text-sm transition-all"
              >
                <option value="" disabled>
                  {assetTypesStatus === "loading"
                    ? "Loading asset types..."
                    : assetTypes.length === 0
                      ? "No asset types available"
                      : "Select an asset type"}
                </option>
                {assetTypes.map((assetType) => (
                  <option key={assetType.id} value={assetType.id}>
                    {assetType.description
                      ? `${assetType.name} - ${assetType.description}`
                      : assetType.name}
                  </option>
                ))}
              </select>
              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-[var(--text-muted)]">
                <span className="material-symbols-outlined text-lg">
                  expand_more
                </span>
              </div>
            </div>
            <p
              className={`text-xs ${
                assetTypesStatus === "error"
                  ? "text-red-600"
                  : "text-[var(--text-muted)]"
              }`}
            >
              {assetTypesMessage}
            </p>
          </div>
        </div>

        {/* Serial Number + Status */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="flex flex-col gap-2">
            <label
              htmlFor="serialNumber"
              className="text-sm font-semibold text-[var(--text-strong)]"
            >
              Serial Number <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-[var(--text-muted)] text-lg">
                qr_code
              </span>
              <input
                id="serialNumber"
                name="serialNumber"
                type="text"
                required
                disabled={isSubmitting}
                placeholder="SN-123456789"
                className="w-full rounded-lg border border-[var(--input-border)] bg-[var(--input-background)] text-[var(--text-strong)] placeholder:text-[var(--text-subtle)] focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary p-3 pl-10 text-sm transition-all"
              />
            </div>
            <p className="text-xs text-[var(--text-muted)]">
              Enter the manufacturer serial number for this asset.
            </p>
          </div>

          <div className="flex flex-col gap-2">
            <span className="text-sm font-semibold text-[var(--text-strong)]">
              Status
            </span>
            <div className="flex items-center gap-3 pt-1">
              <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-emerald-100 text-emerald-700 text-xs font-semibold">
                <span className="size-2 rounded-full bg-emerald-500" />
                Available
              </span>
              <span className="text-xs text-[var(--text-muted)]">
                Default for new items
              </span>
            </div>
          </div>
        </div>

        {/* Notes */}
        <div className="flex flex-col gap-2">
          <label
            htmlFor="notes"
            className="text-sm font-semibold text-[var(--text-strong)]"
          >
            Notes
          </label>
          <textarea
            id="notes"
            name="notes"
            rows={4}
            disabled={isSubmitting}
            placeholder="Add any additional details, maintenance history, or specific configuration notes..."
            className="w-full rounded-lg border border-[var(--input-border)] bg-[var(--input-background)] text-[var(--text-strong)] placeholder:text-[var(--text-subtle)] focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary p-3 text-sm transition-all resize-none"
          />
        </div>

        {/* System Validation notice */}
        <div className="flex items-start gap-3 rounded-lg bg-primary/5 border border-primary/10 p-4">
          <span className="material-symbols-outlined text-primary mt-0.5">
            info
          </span>
          <div>
            <h4 className="text-sm font-semibold text-primary">
              System Validation
            </h4>
            <p className="text-sm text-[var(--text-muted)]">
              Once saved, the asset tag will be verified against the database to
              prevent duplicate entries.
            </p>
          </div>
        </div>

        {/* Feedback */}
        {submission.status !== "idle" && (
          <p
            aria-live="polite"
            className="text-sm font-medium text-red-600"
          >
            {submission.message}
          </p>
        )}

        {/* Actions */}
        <div className="pt-6 border-t border-[var(--border)] flex flex-col sm:flex-row justify-end gap-3">
          <Link
            href="/assets"
            className="px-6 py-2.5 rounded-lg border border-[var(--border)] text-[var(--text-interactive)] text-sm font-semibold hover:bg-[var(--surface-muted)] transition-colors text-center"
            aria-disabled={isSubmitting}
            onClick={(event) => {
              if (isSubmitting) {
                event.preventDefault();
              }
            }}
          >
            Cancel
          </Link>
          <button
            type="submit"
            disabled={areFormControlsDisabled}
            aria-busy={isSubmitting}
            className="px-8 py-2.5 rounded-lg bg-primary text-white text-sm font-semibold hover:bg-primary/90 shadow-lg shadow-primary/20 transition-all flex items-center justify-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed"
          >
            <span className="material-symbols-outlined text-xl">
              {isSubmitting ? "progress_activity" : "save"}
            </span>
            {isSubmitting ? "Saving Asset..." : "Save Asset"}
          </button>
        </div>
      </form>

      {isSuccessDialogOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/45 p-4">
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="asset-save-success-title"
            aria-describedby="asset-save-success-description"
            className="w-full max-w-md rounded-2xl border border-emerald-100 bg-white p-6 shadow-2xl"
          >
            <div className="flex items-start gap-4">
              <div className="flex size-12 shrink-0 items-center justify-center rounded-full bg-emerald-100 text-emerald-700">
                <span className="material-symbols-outlined text-2xl">
                  check_circle
                </span>
              </div>
              <div className="space-y-2">
                <h2
                  id="asset-save-success-title"
                  className="text-lg font-bold text-slate-900"
                >
                  Asset saved successfully
                </h2>
                <p
                  id="asset-save-success-description"
                  className="text-sm text-slate-600"
                >
                  The new asset has been added to inventory. Close this dialog
                  to return to the asset list.
                </p>
              </div>
            </div>

            <div className="mt-6 flex justify-end">
              <button
                type="button"
                onClick={handleSuccessDialogClose}
                className="rounded-lg bg-primary px-5 py-2.5 text-sm font-semibold text-white shadow-lg shadow-primary/20 transition-all hover:bg-primary/90"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function getFormValue(formData: FormData, fieldName: string) {
  const value = formData.get(fieldName);
  return typeof value === "string" ? value : "";
}
