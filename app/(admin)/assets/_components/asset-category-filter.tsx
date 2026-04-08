"use client";

type AssetCategoryFilterProps = {
  categories: string[];
  selectedCategory: string;
  selectedStatus: "All" | "Assigned" | "Available";
  onCategoryChange: (category: string) => void;
  onStatusChange: (status: "All" | "Assigned" | "Available") => void;
};

const chipLimit = 4;
const allCategoryLabel = "All";
const statusOptions: Array<"All" | "Assigned" | "Available"> = [
  "All",
  "Assigned",
  "Available",
];

export default function AssetCategoryFilter({
  categories,
  selectedCategory,
  selectedStatus,
  onCategoryChange,
  onStatusChange,
}: AssetCategoryFilterProps) {
  const visibleChipCategories = categories.slice(0, chipLimit);

  return (
    <div className="mb-6 flex flex-wrap items-center gap-3">
      <label className="flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-4 text-sm font-medium text-slate-700">
        <span className="material-symbols-outlined text-lg text-slate-400">category</span>
        <span className="sr-only">Filter assets by category</span>
        <select
          aria-label="Filter assets by category"
          value={selectedCategory}
          onChange={(event) => onCategoryChange(event.target.value)}
          className="h-10 bg-transparent pr-8 outline-none"
        >
          {categories.map((category) => (
            <option key={category} value={category}>
              {`Category: ${category}`}
            </option>
          ))}
        </select>
      </label>

      <label className="flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-4 text-sm font-medium text-slate-700">
        <span className="material-symbols-outlined text-lg text-slate-400">
          check_circle
        </span>
        <span className="sr-only">Filter assets by status</span>
        <select
          aria-label="Filter assets by status"
          value={selectedStatus}
          onChange={(event) =>
            onStatusChange(event.target.value as "All" | "Assigned" | "Available")
          }
          className="h-10 bg-transparent pr-8 outline-none"
        >
          {statusOptions.map((status) => (
            <option key={status} value={status}>
              {`Status: ${status}`}
            </option>
          ))}
        </select>
      </label>

      <div className="mx-1 hidden h-6 w-px bg-slate-200 sm:block"></div>

      <div className="flex flex-wrap gap-2">
        {visibleChipCategories.map((category) => (
          <button
            type="button"
            aria-pressed={selectedCategory === category}
            onClick={() => onCategoryChange(category)}
            className={`rounded-lg px-3 py-1.5 text-xs font-semibold transition-colors ${
              selectedCategory === category
                ? "bg-primary text-white"
                : "bg-slate-200 text-slate-700 hover:bg-slate-300"
            }`}
            key={category}
          >
            {category}
          </button>
        ))}
        {!visibleChipCategories.includes(allCategoryLabel) && (
          <button
            type="button"
            aria-pressed={selectedCategory === allCategoryLabel}
            onClick={() => onCategoryChange(allCategoryLabel)}
            className={`rounded-lg px-3 py-1.5 text-xs font-semibold transition-colors ${
              selectedCategory === allCategoryLabel
                ? "bg-primary text-white"
                : "bg-slate-200 text-slate-700 hover:bg-slate-300"
            }`}
          >
            {allCategoryLabel}
          </button>
        )}
      </div>
    </div>
  );
}
