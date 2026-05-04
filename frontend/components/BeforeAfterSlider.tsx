"use client";

import { useState } from "react";
import type { PortfolioItem } from "@/types/content";

export function BeforeAfterSlider({ item }: { item: PortfolioItem }) {
  const [position, setPosition] = useState(52);

  return (
    <div className="relative overflow-hidden rounded-card border border-white/15 bg-surface shadow-2xl">
      <div className="relative aspect-[16/10] min-h-[21rem]">
        <img
          className="absolute inset-0 h-full w-full object-cover"
          src={item.afterImageUrl}
          alt={`${item.title} after`}
        />
        <div
          className="absolute inset-0 overflow-hidden"
          style={{ width: `${position}%` }}
          aria-hidden="true"
        >
          <img className="h-full w-full object-cover" src={item.beforeImageUrl} alt="" />
        </div>
        <div
          className="absolute inset-y-0 w-0.5 bg-accent shadow-[0_0_40px_rgb(var(--color-accent))]"
          style={{ left: `${position}%` }}
          aria-hidden="true"
        >
          <span className="absolute left-1/2 top-1/2 grid h-12 w-12 -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full border border-black bg-accent text-xs font-black text-black">
            DRAG
          </span>
        </div>
        <input
          className="before-after-range"
          type="range"
          min="0"
          max="100"
          value={position}
          aria-label="Compare before and after image"
          onChange={(event) => setPosition(Number(event.target.value))}
        />
        <div className="absolute left-4 top-4 rounded-full bg-black/70 px-3 py-2 text-xs font-black uppercase text-white backdrop-blur">
          Before
        </div>
        <div className="absolute right-4 top-4 rounded-full bg-accent px-3 py-2 text-xs font-black uppercase text-black">
          After
        </div>
      </div>
      <div className="grid gap-2 p-5 sm:grid-cols-[1fr_auto] sm:items-end">
        <div>
          <p className="text-xs font-black uppercase text-accent">{item.category}</p>
          <h3 className="mt-2 text-2xl font-black uppercase leading-none">{item.title}</h3>
        </div>
        {item.description ? <p className="max-w-md text-sm text-muted">{item.description}</p> : null}
      </div>
    </div>
  );
}
