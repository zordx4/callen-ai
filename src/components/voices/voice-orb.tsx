// VoiceOrb — planet-style orb used as the voice card avatar.
// Sits inside the rounded-square grey tile. Distinct from SiriOrb (used in
// the Agent Studio preview), which is intentionally minimal — this one is
// decorative and aims to look like a small alien planet:
//   1. base sphere colour
//   2. two conic cloud layers rotating at different rates for organic swirl
//   3. static specular highlight from a top-left light source
//   4. static terminator shadow on the opposite side
//   5. soft rim light at the edge to suggest atmosphere
//   6. atmospheric halo extending past the orb (no hard border)

"use client";

import type { CSSProperties } from "react";
import { cn } from "@/lib/utils";

export type VoiceOrbColors = {
  base: string;     // sphere base — deepest colour
  c1: string;       // cloud accent 1
  c2: string;       // cloud accent 2
  c3: string;       // cloud accent 3 (brightest)
  atmo: string;     // atmospheric halo tint
};

export interface VoiceOrbProps {
  /** CSS length, must end with "px". */
  size?: string;
  className?: string;
  colors: VoiceOrbColors;
  /** Seconds for a full rotation. Smaller = faster spin. */
  animationDuration?: number;
}

export function VoiceOrb({
  size = "64px",
  className,
  colors,
  animationDuration = 30,
}: VoiceOrbProps) {
  const px = parseInt(size.replace("px", ""), 10);
  // Blur scales with size so the look stays consistent from 40px to 200px.
  const blurAmount = Math.max(px * 0.05, 4);
  const contrastAmount = Math.max(px * 0.0025, 1.3);

  return (
    <div
      className={cn("voice-orb", className)}
      style={
        {
          width: size,
          height: size,
          "--base": colors.base,
          "--c1": colors.c1,
          "--c2": colors.c2,
          "--c3": colors.c3,
          "--atmo": colors.atmo,
          "--duration": `${animationDuration}s`,
          "--blur": `${blurAmount}px`,
          "--contrast": contrastAmount,
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

        .voice-orb {
          position: relative;
          border-radius: 50%;
          background: var(--base);
          /* Clip the cloud-layer blur so it does not leak past the edge. */
          overflow: hidden;
          /* Inset rim only — no outer halo. */
          box-shadow:
            inset 0 0 calc(var(--blur) * 0.4)
              color-mix(in oklch, var(--c3) 25%, transparent);
        }

        /* Rotating cloud layer — fills the sphere with swirling colour.
           Two conics + a soft central bloom, all rotated together. Per the
           existing SiriOrb trick: one --angle drives two cloud bands at
           different multipliers so they appear to move independently. */
        .voice-orb::before {
          content: "";
          position: absolute;
          inset: 0;
          border-radius: 50%;
          background:
            conic-gradient(
              from calc(var(--angle) * 1) at 50% 50%,
              var(--c1) 0deg,
              var(--c2) 110deg,
              var(--c3) 220deg,
              var(--c1) 360deg
            ),
            conic-gradient(
              from calc(var(--angle) * -0.7) at 50% 50%,
              transparent 0deg,
              var(--c3) 80deg,
              transparent 170deg,
              var(--c2) 260deg,
              transparent 360deg
            ),
            radial-gradient(
              circle at 50% 50%,
              var(--c2) 0%,
              transparent 70%
            );
          filter: blur(var(--blur)) contrast(var(--contrast)) saturate(1.25);
          animation: voice-orb-rotate var(--duration) linear infinite;
          will-change: transform;
          transform: translateZ(0);
        }

        /* Static lighting overlay — sells the sphere illusion.
           Specular highlight from upper-left, terminator shadow on
           lower-right, and a faint rim brightening at the edge. */
        .voice-orb::after {
          content: "";
          position: absolute;
          inset: 0;
          border-radius: 50%;
          background:
            /* Specular highlight (light from top-left) */
            radial-gradient(
              ellipse 42% 32% at 26% 22%,
              rgba(255, 255, 255, 0.5) 0%,
              rgba(255, 255, 255, 0.18) 35%,
              transparent 70%
            ),
            /* Inner darken at lower-right (terminator) */
            radial-gradient(
              ellipse 65% 65% at 72% 78%,
              rgba(0, 0, 0, 0.55) 0%,
              rgba(0, 0, 0, 0.2) 40%,
              transparent 70%
            ),
            /* Subtle rim light at the very edge */
            radial-gradient(
              circle at 50% 50%,
              transparent 78%,
              rgba(255, 255, 255, 0.18) 92%,
              transparent 100%
            );
          pointer-events: none;
        }

        @keyframes voice-orb-rotate {
          from { --angle: 0deg; }
          to   { --angle: 360deg; }
        }

        @media (prefers-reduced-motion: reduce) {
          .voice-orb::before {
            animation: none;
          }
        }
      `}</style>
    </div>
  );
}
