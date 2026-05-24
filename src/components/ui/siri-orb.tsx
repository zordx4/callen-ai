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
          /* Tinted hairline ring + coloured halo. Both shadows pull from
             the same palette as the interior so the edge reads as part
             of the orb instead of a dark outline. The 1.5px ring is the
             "sharp border"; the wider blurred halo is the lift that
             separates the orb from the page background. */
          box-shadow:
            0 0 0 1.5px color-mix(in oklch, var(--c2) 75%, transparent),
            0 0 0 4px  color-mix(in oklch, var(--c2) 18%, transparent),
            0 16px 40px -12px color-mix(in oklch, var(--c2) 55%, transparent),
            0 4px 14px -4px  color-mix(in oklch, var(--c1) 35%, transparent);
          background:
            radial-gradient(
              circle,
              rgba(0, 0, 0, 0.04) 0%,
              transparent 55%,
              color-mix(in oklch, var(--c2) 18%, transparent) 92%,
              color-mix(in oklch, var(--c2) 32%, transparent) 100%
            ),
            var(--bg);
        }

        :global(.dark) .siri-orb {
          box-shadow:
            0 0 0 1.5px color-mix(in oklch, var(--c2) 70%, transparent),
            0 0 0 4px  color-mix(in oklch, var(--c2) 22%, transparent),
            0 16px 40px -12px color-mix(in oklch, var(--c2) 55%, transparent),
            0 4px 14px -4px  color-mix(in oklch, var(--c1) 40%, transparent);
          background:
            radial-gradient(
              circle,
              rgba(255, 255, 255, 0.06) 0%,
              transparent 55%,
              color-mix(in oklch, var(--c2) 22%, transparent) 92%,
              color-mix(in oklch, var(--c2) 38%, transparent) 100%
            ),
            var(--bg);
        }

        /* Rotating colour layer. Each conic-gradient picks a different
           centre point and angle multiplier so the colours weave through
           each other instead of marching in lockstep. */
        .siri-orb::before {
          content: "";
          display: block;
          grid-area: stack;
          width: 100%;
          height: 100%;
          border-radius: 50%;
          background:
            conic-gradient(
              from calc(var(--angle) * 1.2) at 32% 62%,
              var(--c3) 0deg,
              transparent 50deg 310deg,
              var(--c3) 360deg
            ),
            conic-gradient(
              from calc(var(--angle) * 0.85) at 68% 38%,
              var(--c2) 0deg,
              transparent 65deg 295deg,
              var(--c2) 360deg
            ),
            conic-gradient(
              from calc(var(--angle) * -1.4) at 60% 72%,
              var(--c1) 0deg,
              transparent 90deg 270deg,
              var(--c1) 360deg
            ),
            conic-gradient(
              from calc(var(--angle) * 2.0) at 28% 28%,
              var(--c2) 0deg,
              transparent 35deg 325deg,
              var(--c2) 360deg
            ),
            conic-gradient(
              from calc(var(--angle) * -0.7) at 78% 78%,
              var(--c1) 0deg,
              transparent 50deg 310deg,
              var(--c1) 360deg
            ),
            radial-gradient(
              ellipse 120% 80% at 42% 58%,
              var(--c3) 0%,
              transparent 55%
            );
          filter:
            blur(var(--blur-amount))
            contrast(var(--contrast-amount))
            saturate(1.2);
          animation: siri-orb-rotate var(--animation-duration) linear infinite;
          transform: translateZ(0);
          will-change: transform;
        }

        /* Soft top-left highlight that makes the orb read as a sphere
           rather than a flat disc. */
        .siri-orb::after {
          content: "";
          display: block;
          grid-area: stack;
          width: 100%;
          height: 100%;
          border-radius: 50%;
          background: radial-gradient(
            circle at 42% 52%,
            rgba(255, 255, 255, 0.1) 0%,
            rgba(255, 255, 255, 0.04) 32%,
            transparent 62%
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
