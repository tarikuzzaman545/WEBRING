"use client";

import { useMemo, useState } from "react";
import type { PortfolioItem } from "@/types/content";
import { BeforeAfterSlider } from "./BeforeAfterSlider";

export function PortfolioGrid({ items }: { items: PortfolioItem[] }) {
  const categories = useMemo(
    () => ["All", ...Array.from(new Set(items.map((item) => item.category)))],
    [items]
  );
  const [category, setCategory] = useState("All");
  const filtered = category === "All" ? items : items.filter((item) => item.category === category);

  return (
    <div>
      <div className="mb-7 flex flex-wrap gap-2">
        {categories.map((item) => (
          <button
            className={`rounded-full border px-4 py-2 text-xs font-black uppercase transition ${
              item === category
                ? "border-accent bg-accent text-black"
                : "border-white/15 text-muted hover:border-white/40 hover:text-white"
            }`}
            type="button"
            key={item}
            onClick={() => setCategory(item)}
          >
            {item}
          </button>
        ))}
      </div>
      <div className="grid gap-5 lg:grid-cols-2">
        {filtered.map((item) => (
          <BeforeAfterSlider item={item} key={item._id} />
        ))}
      </div>
    </div>
  );
}
