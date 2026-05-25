// Large feature tile for the "Handpicked for your use case" row.
// Abstract motion art tile on top, label + blurb on bottom. Click to filter
// the library to that use case.

"use client";

import { cn } from "@/lib/utils";
import type { UseCaseCard as UseCaseCardModel } from "@/lib/voice-library";

type Props = {
  card: UseCaseCardModel;
  onSelect?: (id: string) => void;
};

export function UseCaseCard({ card, onSelect }: Props) {
  return (
    <button
      type="button"
      onClick={() => onSelect?.(card.id)}
      className={cn(
        "group relative w-full rounded-3xl overflow-hidden text-left",
        "border border-neutral-200 bg-white hover:border-neutral-300",
        "transition-all outline-none focus-visible:ring-2 focus-visible:ring-neutral-900"
      )}
    >
      <div
        className="relative aspect-[5/4] w-full overflow-hidden"
        style={{
          background: `linear-gradient(135deg, ${card.art.from}, ${card.art.via} 55%, ${card.art.to})`,
        }}
      >
        {/* Abstract concentric arcs — different for each tile via hashing the id */}
        <svg
          aria-hidden="true"
          className="absolute inset-0 size-full opacity-80 transition-transform duration-700 group-hover:scale-[1.04]"
          viewBox="0 0 200 200"
          preserveAspectRatio="xMidYMid slice"
        >
          <defs>
            <radialGradient
              id={`ring-${card.id.replace(/\s/g, "-")}`}
              cx="50%"
              cy="50%"
              r="50%"
            >
              <stop offset="0%" stopColor="white" stopOpacity="0.5" />
              <stop offset="60%" stopColor="white" stopOpacity="0.05" />
              <stop offset="100%" stopColor="white" stopOpacity="0" />
            </radialGradient>
          </defs>
          {Array.from({ length: 8 }).map((_, i) => (
            <circle
              key={i}
              cx="100"
              cy="100"
              r={20 + i * 12}
              fill="none"
              stroke="white"
              strokeOpacity={0.18 - i * 0.018}
              strokeWidth="0.6"
            />
          ))}
          <circle
            cx="100"
            cy="100"
            r="90"
            fill={`url(#ring-${card.id.replace(/\s/g, "-")})`}
          />
        </svg>

        <div className="absolute inset-0 p-5 flex flex-col justify-end">
          <p className="text-white text-2xl font-bold tracking-tight leading-tight">
            {card.title}
          </p>
          <p className="text-white/75 text-[12px] mt-1.5 leading-snug">
            {card.blurb}
          </p>
        </div>
      </div>
    </button>
  );
}
