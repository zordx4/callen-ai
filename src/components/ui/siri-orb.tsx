// SiriOrb — animated planet-style orb. CSS Houdini `@property --angle`
// drives two rotating conic-gradient cloud layers that swirl across the
// sphere; a static lighting overlay adds a top-left specular highlight,
// a bottom-right terminator shadow, and a subtle rim-light around the
// edge to sell the sphere illusion. The cloud blur is clipped to the
// circle (overflow:hidden) so nothing leaks past the silhouette, and
// the orb has no hard outer ring — just a soft inset glow.
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
  bg: "#0c0a18",
  c1: "oklch(72% 0.17 220)",
  c2: "oklch(78% 0.14 290)",
  c3: "oklch(75% 0.16 340)",
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
  // Blur + contrast scale with size so the look stays consistent from a
  // 64px chip to a 320px hero.
  const blurAmount = Math.max(px * 0.06, 6);
  const contrastAmount = Math.max(px * 0.0025, 1.4);

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
          position: relative;
          border-radius: 50%;
          background: var(--bg);
          /* Clip the cloud-layer blur so it does not leak past the edge.
             This is what makes the silhouette read as a hard sphere. */
          overflow: hidden;
          /* No outer halo. A faint inset ring of the brightest accent
             tints the very edge so the planet has subtle atmosphere. */
          box-shadow:
            inset 0 0 calc(var(--blur-amount) * 0.5)
              color-mix(in oklch, var(--c3) 30%, transparent);
        }

        /* Rotating cloud layer — two conics + a soft centred bloom share
           the same --angle driver so the entire pattern spins as one,
           with different multipliers giving each conic a different
           effective speed for organic swirl. */
        .siri-orb::before {
          content: "";
          position: absolute;
          inset: 0;
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
            saturate(1.2);
          animation: siri-orb-rotate var(--animation-duration) linear infinite;
          transform: translateZ(0);
          will-change: transform;
        }

        /* Static lighting overlay — sells the sphere illusion:
             1. Specular highlight (light from the top-left)
             2. Terminator shadow on the opposite (lower-right) side
             3. Subtle rim light at the very edge for atmospheric scatter */
        .siri-orb::after {
          content: "";
          position: absolute;
          inset: 0;
          border-radius: 50%;
          background:
            radial-gradient(
              ellipse 42% 32% at 26% 22%,
              rgba(255, 255, 255, 0.45) 0%,
              rgba(255, 255, 255, 0.15) 35%,
              transparent 70%
            ),
            radial-gradient(
              ellipse 70% 70% at 74% 80%,
              rgba(0, 0, 0, 0.55) 0%,
              rgba(0, 0, 0, 0.2) 38%,
              transparent 70%
            ),
            radial-gradient(
              circle at 50% 50%,
              transparent 78%,
              rgba(255, 255, 255, 0.16) 92%,
              transparent 100%
            );
          pointer-events: none;
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
