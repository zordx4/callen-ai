// Large feature tile for the "Handpicked for your use case" row.
// Each card carries a bespoke vector illustration matched to its category:
//   - Customer Service → chat bubbles
//   - Order Taking     → receipt
//   - Receptionist     → hotel-style bell
//   - Sales            → upward trending chart
//   - Healthcare       → stethoscope
//   - Concierge        → suitcase + travel tags
// Static by design — the gradient + illustration carry the visual weight.

"use client";

import { cn } from "@/lib/utils";
import type {
  UseCaseCard as UseCaseCardModel,
  VoiceCategory,
} from "@/lib/voice-library";

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
        "border border-neutral-200 hover:border-neutral-300 hover:shadow-md",
        "transition-all outline-none focus-visible:ring-2 focus-visible:ring-neutral-900"
      )}
    >
      <div
        className="relative aspect-[5/4] w-full overflow-hidden"
        style={{
          background: `linear-gradient(135deg, ${card.art.from}, ${card.art.via} 55%, ${card.art.to})`,
        }}
      >
        {/* Category-specific illustration — fills the upper two-thirds */}
        <div className="absolute inset-x-0 top-0 h-[68%] flex items-center justify-center p-6 pointer-events-none">
          <CategoryArt category={card.id} />
        </div>

        {/* Soft central highlight to deepen the gradient */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_38%,rgba(255,255,255,0.18),transparent_60%)] pointer-events-none" />

        {/* Title + blurb */}
        <div className="absolute inset-0 p-5 flex flex-col justify-end">
          <p className="text-white text-2xl font-bold tracking-tight leading-tight drop-shadow-sm">
            {card.title}
          </p>
          <p className="text-white/80 text-[12px] mt-1.5 leading-snug">
            {card.blurb}
          </p>
        </div>
      </div>
    </button>
  );
}

// =============================================================
// Per-category vector illustrations
// =============================================================

function CategoryArt({ category }: { category: VoiceCategory | string }) {
  switch (category) {
    case "Customer Service":
      return <ChatBubblesArt />;
    case "Order Taking":
      return <ReceiptArt />;
    case "Receptionist":
      return <BellArt />;
    case "Sales":
      return <ChartArt />;
    case "Healthcare":
      return <StethoscopeArt />;
    case "Concierge":
      return <SuitcaseArt />;
    default:
      return null;
  }
}

const SVG_BASE_PROPS = {
  viewBox: "0 0 200 200",
  className: "h-full w-auto max-w-full",
  fill: "none" as const,
  xmlns: "http://www.w3.org/2000/svg",
  "aria-hidden": true,
};

// ---- Customer Service: two overlapping chat bubbles ----
function ChatBubblesArt() {
  return (
    <svg {...SVG_BASE_PROPS}>
      {/* Back bubble (larger) */}
      <path
        d="M 110 40 H 178 Q 188 40 188 50 V 100 Q 188 110 178 110 H 142 L 126 126 L 128 110 H 110 Q 100 110 100 100 V 50 Q 100 40 110 40 Z"
        stroke="white"
        strokeOpacity="0.7"
        strokeWidth="2"
        fill="white"
        fillOpacity="0.04"
      />
      <line x1="115" y1="62" x2="170" y2="62" stroke="white" strokeOpacity="0.45" strokeWidth="1.5" strokeLinecap="round" />
      <line x1="115" y1="75" x2="158" y2="75" stroke="white" strokeOpacity="0.45" strokeWidth="1.5" strokeLinecap="round" />
      <line x1="115" y1="88" x2="165" y2="88" stroke="white" strokeOpacity="0.45" strokeWidth="1.5" strokeLinecap="round" />

      {/* Front bubble (smaller, with typing dots) */}
      <path
        d="M 28 95 H 88 Q 98 95 98 105 V 145 Q 98 155 88 155 H 64 L 48 170 L 50 155 H 28 Q 18 155 18 145 V 105 Q 18 95 28 95 Z"
        stroke="white"
        strokeOpacity="0.9"
        strokeWidth="2"
        fill="white"
        fillOpacity="0.12"
      />
      <circle cx="40" cy="125" r="4" fill="white" fillOpacity="0.85" />
      <circle cx="58" cy="125" r="4" fill="white" fillOpacity="0.85" />
      <circle cx="76" cy="125" r="4" fill="white" fillOpacity="0.85" />
    </svg>
  );
}

// ---- Order Taking: tilted receipt with items + total ----
function ReceiptArt() {
  return (
    <svg {...SVG_BASE_PROPS}>
      <g transform="rotate(-7 100 100)">
        {/* Receipt paper with zig-zag bottom */}
        <path
          d="M 60 28 H 140 V 162 L 130 158 L 120 162 L 110 158 L 100 162 L 90 158 L 80 162 L 70 158 L 60 162 Z"
          stroke="white"
          strokeOpacity="0.85"
          strokeWidth="2"
          fill="white"
          fillOpacity="0.08"
          strokeLinejoin="round"
        />
        {/* Header logo block */}
        <rect x="72" y="40" width="22" height="22" rx="3" fill="white" fillOpacity="0.45" />
        <line x1="100" y1="46" x2="128" y2="46" stroke="white" strokeOpacity="0.65" strokeWidth="2.5" strokeLinecap="round" />
        <line x1="100" y1="56" x2="120" y2="56" stroke="white" strokeOpacity="0.45" strokeWidth="1.5" strokeLinecap="round" />

        {/* Item rows */}
        {[80, 92, 104].map((y) => (
          <g key={y}>
            <line x1="72" y1={y} x2="116" y2={y} stroke="white" strokeOpacity="0.45" strokeWidth="1.5" strokeLinecap="round" />
            <line x1="122" y1={y} x2="132" y2={y} stroke="white" strokeOpacity="0.55" strokeWidth="1.5" strokeLinecap="round" />
          </g>
        ))}

        {/* Dashed divider */}
        <line x1="72" y1="122" x2="132" y2="122" stroke="white" strokeOpacity="0.5" strokeWidth="1" strokeDasharray="3 3" />

        {/* Total */}
        <line x1="72" y1="135" x2="100" y2="135" stroke="white" strokeOpacity="0.85" strokeWidth="2.5" strokeLinecap="round" />
        <line x1="116" y1="135" x2="132" y2="135" stroke="white" strokeOpacity="0.85" strokeWidth="2.5" strokeLinecap="round" />
      </g>
    </svg>
  );
}

// ---- Receptionist: hotel-style desk bell ----
function BellArt() {
  return (
    <svg {...SVG_BASE_PROPS}>
      {/* Bell button on top */}
      <circle cx="100" cy="46" r="7" fill="white" fillOpacity="0.7" stroke="white" strokeOpacity="0.85" strokeWidth="1.5" />
      <line x1="100" y1="53" x2="100" y2="64" stroke="white" strokeOpacity="0.7" strokeWidth="2.5" />

      {/* Dome */}
      <path
        d="M 50 132 Q 50 64 100 64 Q 150 64 150 132 Z"
        stroke="white"
        strokeOpacity="0.9"
        strokeWidth="2.5"
        fill="white"
        fillOpacity="0.08"
        strokeLinejoin="round"
      />
      {/* Dome highlight curve */}
      <path d="M 70 78 Q 72 95 72 116" stroke="white" strokeOpacity="0.5" strokeWidth="1.5" strokeLinecap="round" />

      {/* Base */}
      <rect x="42" y="132" width="116" height="10" rx="3" fill="white" fillOpacity="0.5" stroke="white" strokeOpacity="0.9" strokeWidth="1.5" />
      <line x1="42" y1="148" x2="158" y2="148" stroke="white" strokeOpacity="0.3" strokeWidth="2" strokeLinecap="round" />

      {/* Ding arcs */}
      <path d="M 138 36 Q 148 28 156 32" stroke="white" strokeOpacity="0.6" strokeWidth="1.5" strokeLinecap="round" />
      <path d="M 145 22 Q 158 14 168 22" stroke="white" strokeOpacity="0.4" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
}

// ---- Sales: upward trending line chart with arrow ----
function ChartArt() {
  return (
    <svg {...SVG_BASE_PROPS}>
      {/* Grid axes */}
      <line x1="34" y1="32" x2="34" y2="160" stroke="white" strokeOpacity="0.4" strokeWidth="1.5" strokeLinecap="round" />
      <line x1="34" y1="160" x2="178" y2="160" stroke="white" strokeOpacity="0.4" strokeWidth="1.5" strokeLinecap="round" />

      {/* Subtle grid lines */}
      {[70, 100, 130].map((y) => (
        <line key={y} x1="34" y1={y} x2="178" y2={y} stroke="white" strokeOpacity="0.12" strokeWidth="1" strokeDasharray="2 4" />
      ))}

      {/* Filled area under line */}
      <path
        d="M 44 142 L 72 122 L 102 110 L 132 78 L 164 50 L 164 160 L 44 160 Z"
        fill="white"
        fillOpacity="0.14"
      />

      {/* Trend line */}
      <path
        d="M 44 142 L 72 122 L 102 110 L 132 78 L 164 50"
        stroke="white"
        strokeOpacity="0.95"
        strokeWidth="3"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
      />

      {/* Data points */}
      {[
        [44, 142],
        [72, 122],
        [102, 110],
        [132, 78],
      ].map(([x, y]) => (
        <circle key={`${x}-${y}`} cx={x} cy={y} r="3.5" fill="white" fillOpacity="0.9" />
      ))}
      <circle cx="164" cy="50" r="6" fill="white" stroke="white" strokeOpacity="0.6" strokeWidth="3" />

      {/* Arrowhead at top-right */}
      <path
        d="M 164 50 L 154 56 M 164 50 L 158 42"
        stroke="white"
        strokeOpacity="0.95"
        strokeWidth="2.5"
        strokeLinecap="round"
      />
    </svg>
  );
}

// ---- Healthcare: stethoscope with pulse ----
function StethoscopeArt() {
  return (
    <svg {...SVG_BASE_PROPS}>
      {/* Earpieces */}
      <circle cx="55" cy="48" r="7" fill="white" fillOpacity="0.85" />
      <circle cx="145" cy="48" r="7" fill="white" fillOpacity="0.85" />

      {/* Tubes from earpieces, curving down to chest piece */}
      <path
        d="M 55 55 Q 55 110 90 130"
        stroke="white"
        strokeOpacity="0.85"
        strokeWidth="3"
        strokeLinecap="round"
        fill="none"
      />
      <path
        d="M 145 55 Q 145 110 110 130"
        stroke="white"
        strokeOpacity="0.85"
        strokeWidth="3"
        strokeLinecap="round"
        fill="none"
      />

      {/* Chest piece (disc) */}
      <circle cx="100" cy="140" r="24" stroke="white" strokeOpacity="0.95" strokeWidth="3" fill="white" fillOpacity="0.1" />
      <circle cx="100" cy="140" r="14" stroke="white" strokeOpacity="0.55" strokeWidth="1.5" fill="none" />

      {/* Pulse line across the chest piece */}
      <path
        d="M 82 140 L 90 140 L 94 130 L 100 152 L 106 130 L 110 140 L 118 140"
        stroke="white"
        strokeOpacity="0.95"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
      />
    </svg>
  );
}

// ---- Concierge: suitcase with handle, stripe, and travel stickers ----
function SuitcaseArt() {
  return (
    <svg {...SVG_BASE_PROPS}>
      {/* Handle */}
      <path
        d="M 78 60 Q 78 48 90 48 H 110 Q 122 48 122 60 V 72"
        stroke="white"
        strokeOpacity="0.85"
        strokeWidth="3"
        strokeLinecap="round"
        fill="none"
      />

      {/* Suitcase body */}
      <rect
        x="50"
        y="72"
        width="100"
        height="90"
        rx="8"
        stroke="white"
        strokeOpacity="0.95"
        strokeWidth="2.5"
        fill="white"
        fillOpacity="0.1"
      />

      {/* Latches on top edge */}
      <rect x="66" y="77" width="8" height="4" rx="1.5" fill="white" fillOpacity="0.7" />
      <rect x="126" y="77" width="8" height="4" rx="1.5" fill="white" fillOpacity="0.7" />

      {/* Center horizontal stripe */}
      <line x1="50" y1="105" x2="150" y2="105" stroke="white" strokeOpacity="0.55" strokeWidth="2" />

      {/* Travel sticker labels */}
      <rect x="62" y="118" width="24" height="14" rx="2.5" fill="white" fillOpacity="0.4" />
      <rect x="92" y="124" width="16" height="11" rx="2" fill="white" fillOpacity="0.55" />
      <rect x="114" y="118" width="26" height="16" rx="2.5" fill="white" fillOpacity="0.35" />

      {/* Faux text lines on stickers */}
      <line x1="68" y1="125" x2="80" y2="125" stroke="white" strokeOpacity="0.6" strokeWidth="1" />
      <line x1="118" y1="124" x2="136" y2="124" stroke="white" strokeOpacity="0.6" strokeWidth="1" />
      <line x1="118" y1="129" x2="132" y2="129" stroke="white" strokeOpacity="0.6" strokeWidth="1" />
    </svg>
  );
}
