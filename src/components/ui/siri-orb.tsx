// SiriOrb — animated conic-gradient orb in the Siri / Conversational AI
// style. Uses CSS Houdini `@property --angle` to drive a rotating colour
// blend, then a heavy blur + contrast filter merges the colours into a
// smooth, watercolour-like sphere.
//
// API mirrors the 21st.dev paste-and-go pattern (size + colours + duration).

"use client";

import type { CSSProperties } from "react";
import { cn } from "@/lib/utils";

export type SiriOrbColors = {
  bg?: string;
  c1?: string;
  c2?: string;
  c3?: string;
};

const DEFAULT_COLORS: Required<SiriOrbColors> = {
  bg: "transparent",
  c1: "oklch(75% 0.15 350)",
  c2: "oklch(80% 0.12 200)",
  c3: "oklch(78% 0.14 280)",
};

export interface SiriOrbProps {
  /** CSS length, must end with "px". Defaults to "192px". */
  size?: string;
  /** Extra classes applied to the orb container. */
  className?: string;
  /** Override one or more colours. Anything omitted falls back to the default Siri palette. */
  colors?: SiriOrbColors;
  /** Seconds for a full rotation. Smaller = faster spin. */
  animationDuration?: number;
}

export function SiriOrb({
  size = "192px",
  className,
  colors,
  animationDuration = 20,
}: SiriOrbProps) {
  const merged = { ...DEFAULT_COLORS, ...colors };
  const px = parseInt(size.replace("px", ""), 10);
  // Blur + contrast scale with size so the blend feel stays consistent
  // from a 64px chip to a 320px hero.
  const blurAmount = Math.max(px * 0.08, 8);
  const contrastAmount = Math.max(px * 0.003, 1.8);

  return (
    <div
      className={cn("siri-orb", className)}
      style={
        {
          width: size,
          height: size,
          "--bg": merged.bg,
          "--c1": merged.c1,
          "--c2": merged.c2,
          "--c3": merged.c3,
          "--animation-duration": `${animationDuration}s`,
          "--blur-amount": `${blurAmount}px`,
          "--contrast-amount": contrastAmount,
        } as CSSProperties
      }
      aria-hidden="true"
    >
      <style jsx>{`
        @property --angle {
          syntax: "<angle>";
          inherits: false;
          initial-value: 0deg;
        }

        .siri-orb {
          display: grid;
          grid-template-areas: "stack";
          overflow: hidden;
          border-radius: 50%;
          position: relative;
          /* Single tight tinted ring for the sharp border + a small drop
             shadow for separation. No expanding aura, no wide halo. */
          box-shadow:
            0 0 0 1.5px color-mix(in oklch, var(--c2) 80%, transparent),
            0 6px 16px -6px rgba(15, 23, 42, 0.18);
          background:
            radial-gradient(
              circle,
              rgba(0, 0, 0, 0.03) 0%,
              transparent 100%
            ),
            var(--bg);
        }

        :global(.dark) .siri-orb {
          box-shadow:
            0 0 0 1.5px color-mix(in oklch, var(--c2) 75%, transparent),
            0 6px 16px -6px rgba(0, 0, 0, 0.45);
          background:
            radial-gradient(
              circle,
              rgba(255, 255, 255, 0.04) 0%,
              transparent 100%
            ),
            var(--bg);
        }

        /* Rotating colour layer. All conics share a single centre (50% 50%)
           so the colour density stays uniform across the orb instead of
           bunching at corners. Variation comes from the angle multipliers
           and the colour-stop widths, not anchor position. */
        .siri-orb::before {
          content: "";
          display: block;
          grid-area: stack;
          width: 100%;
          height: 100%;
          border-radius: 50%;
          background:
            conic-gradient(
              from calc(var(--angle) * 1.2) at 50% 50%,
              var(--c1) 0deg,
              var(--c2) 120deg,
              var(--c3) 240deg,
              var(--c1) 360deg
            ),
            conic-gradient(
              from calc(var(--angle) * -0.85) at 50% 50%,
              transparent 0deg,
              var(--c2) 90deg,
              transparent 180deg,
              var(--c3) 270deg,
              transparent 360deg
            ),
            radial-gradient(
              circle at 50% 50%,
              var(--c2) 0%,
              transparent 70%
            );
          filter:
            blur(var(--blur-amount))
            contrast(var(--contrast-amount))
            saturate(1.15);
          animation: siri-orb-rotate var(--animation-duration) linear infinite;
          transform: translateZ(0);
          will-change: transform;
        }

        /* Soft centred highlight for a touch of depth. Centred so it
           doesn't break the uniform-density feel. */
        .siri-orb::after {
          content: "";
          display: block;
          grid-area: stack;
          width: 100%;
          height: 100%;
          border-radius: 50%;
          background: radial-gradient(
            circle at 50% 50%,
            rgba(255, 255, 255, 0.08) 0%,
            rgba(255, 255, 255, 0.03) 35%,
            transparent 65%
          );
          mix-blend-mode: overlay;
        }

        @keyframes siri-orb-rotate {
          from { --angle: 0deg; }
          to   { --angle: 360deg; }
        }

        @media (prefers-reduced-motion: reduce) {
          .siri-orb::before {
            animation: none;
          }
        }
      `}</style>
    </div>
  );
}
