"use client";

import { useState } from "react";

const categories = ["All", "Laptops", "Furniture", "Peripherals", "Monitors", "Tablets"];
const statuses = ["All", "Assigned", "Available"];
const chipCategories = ["All", "Laptops", "Furniture", "Peripherals"];

export default function AssetCategoryFilter() {
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [isCategoryOpen, setIsCategoryOpen] = useState(false);

  const [selectedStatus, setSelectedStatus] = useState("All");
  const [isStatusOpen, setIsStatusOpen] = useState(false);

  return (
    <div className="mb-6 flex flex-wrap items-center gap-3">
      <div className="relative">
        <button
          type="button"
          aria-expanded={isCategoryOpen}
          aria-haspopup="menu"
          onClick={() => setIsCategoryOpen((prev) => !prev)}
          className="flex h-10 items-center justify-between gap-x-2 rounded-lg border border-slate-200 bg-white px-4 text-sm font-medium text-slate-700 hover:border-primary/50"
        >
          <span className="flex items-center gap-2">
            <span className="material-symbols-outlined text-lg text-slate-400">
              category
            </span>
            {`Category: ${selectedCategory}`}
          </span>
          <span className="material-symbols-outlined text-lg">expand_more</span>
        </button>

        {isCategoryOpen ? (
          <div
            role="menu"
            className="absolute left-0 z-20 mt-2 w-48 overflow-hidden rounded-lg border border-slate-200 bg-white shadow-lg"
          >
            {categories.map((category) => (
              <button
                key={category}
                type="button"
                role="menuitem"
                onClick={() => {
                  setSelectedCategory(category);
                  setIsCategoryOpen(false);
                }}
                className={`block w-full px-3 py-2 text-left text-sm transition-colors hover:bg-slate-100 ${
                  category === selectedCategory
                    ? "bg-slate-100 font-semibold text-slate-900"
                    : "text-slate-700"
                }`}
              >
                {category}
              </button>
            ))}
          </div>
        ) : null}
      </div>

      <div className="relative group">
        <button 
          type="button"
          onClick={() => setIsStatusOpen((prev => !prev))}
          className="flex h-10 items-center justify-between gap-x-2 rounded-lg border border-slate-200 bg-white px-4 text-sm font-medium text-slate-700 hover:border-primary/50">
          <span className="flex items-center gap-2">
            <span className="material-symbols-outlined text-lg text-slate-400">
              check_circle
            </span>
            {`Status: ${selectedStatus}`}
          </span>
          <span className="material-symbols-outlined text-lg">expand_more</span>
        </button>
        
        {isStatusOpen ? (
          <div
            role="menu"
            className="absolute left-0 z-20 mt-2 w-48 overflow-hidden rounded-lg border border-slate-200 bg-white shadow-lg"
          >
            {statuses.map((status) => (
              <button
                key={status}
                type="button"
                role="menuitem"
                onClick={() => {
                  setSelectedStatus(status);
                  setIsStatusOpen(false);
                }}
                className={`block w-full px-3 py-2 text-left text-sm transition-colors hover:bg-slate-100 ${
                  status === selectedStatus
                    ? "bg-slate-100 font-semibold text-slate-900"
                    : "text-slate-700"
                }`}
              >
                {status}
              </button>
            ))}
          </div>
        ) : null}
      </div>
      <div className="mx-1 hidden h-6 w-px bg-slate-200 sm:block"></div>
      <div className="flex gap-2">
        {chipCategories.map((category) => (
            <button 
              type="button"
              aria-pressed={selectedCategory === category}
              onClick={() => setSelectedCategory(category)}
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
      </div>
    </div>
  );
}
