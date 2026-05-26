// Ambient motion layer for the dark brand panel on /login and /signup.
// Three layers, all monochrome:
//   1. The existing dotted grid (kept for texture)
//   2. Two large soft white orbs drifting on long, independent loops
//      to make the panel feel alive without competing with the headline
//   3. A voice waveform ribbon — thin vertical bars in a row that
//      pulse like a real-time audio meter. Reads as "voice AI" without
//      being noisy.
//
// All white-on-black at low opacity so nothing competes with the form
// on the right side. Respects the locked monochrome rule (no coloured
// accents).

"use client";

import { motion } from "motion/react";

export function DarkPanelMotion() {
  return (
    <>
      {/* Layer 1: dotted grid (texture) */}
      <div
        className="absolute inset-0 opacity-[0.06] pointer-events-none"
        style={{
          backgroundImage:
            "linear-gradient(to right, #fff 1px, transparent 1px), linear-gradient(to bottom, #fff 1px, transparent 1px)",
          backgroundSize: "40px 40px",
        }}
        aria-hidden
      />

      {/* Layer 2a: top-left drifting orb */}
      <motion.div
        className="absolute pointer-events-none"
        style={{
          top: "5%",
          left: "10%",
          width: 640,
          height: 640,
          background:
            "radial-gradient(circle, rgba(255,255,255,0.08) 0%, rgba(255,255,255,0.025) 40%, transparent 70%)",
          filter: "blur(60px)",
          willChange: "transform",
        }}
        animate={{
          x: [0, 80, -40, 50, 0],
          y: [0, -60, 50, -30, 0],
          scale: [1, 1.12, 0.96, 1.06, 1],
        }}
        transition={{ duration: 26, repeat: Infinity, ease: "easeInOut" }}
        aria-hidden
      />

      {/* Layer 2b: bottom-right drifting orb on a different path */}
      <motion.div
        className="absolute pointer-events-none"
        style={{
          bottom: "5%",
          right: "5%",
          width: 520,
          height: 520,
          background:
            "radial-gradient(circle, rgba(255,255,255,0.06) 0%, rgba(255,255,255,0.02) 40%, transparent 70%)",
          filter: "blur(55px)",
          willChange: "transform",
        }}
        animate={{
          x: [0, -60, 40, -20, 0],
          y: [0, 50, -40, 20, 0],
          scale: [1, 0.95, 1.1, 0.98, 1],
        }}
        transition={{ duration: 32, repeat: Infinity, ease: "easeInOut" }}
        aria-hidden
      />

      {/* Layer 2c: smaller mid-right halo to break the symmetry */}
      <motion.div
        className="absolute pointer-events-none"
        style={{
          top: "40%",
          right: "20%",
          width: 320,
          height: 320,
          background:
            "radial-gradient(circle, rgba(255,255,255,0.05) 0%, rgba(255,255,255,0.015) 40%, transparent 70%)",
          filter: "blur(45px)",
          willChange: "transform",
        }}
        animate={{
          x: [0, 30, -20, 15, 0],
          y: [0, -25, 20, -10, 0],
          scale: [1, 1.08, 0.94, 1.04, 1],
        }}
        transition={{ duration: 22, repeat: Infinity, ease: "easeInOut" }}
        aria-hidden
      />

      {/* Layer 3: voice waveform ribbon — sits in the negative space
          between the headline and the bottom content. Bars travel a
          staggered wave around the row so it reads as voice activity. */}
      <WaveformRibbon />
    </>
  );
}

function WaveformRibbon() {
  const BAR_COUNT = 64;
  return (
    <div
      className="absolute inset-x-0 bottom-44 flex items-center justify-center gap-[3px] h-12 px-16 pointer-events-none"
      aria-hidden
    >
      {Array.from({ length: BAR_COUNT }).map((_, i) => {
        // Deterministic per-bar amplitude noise: some bars swing hard,
        // others stay quiet, mimicking a real frequency spectrum.
        const noise = Math.sin(i * 12.9898 + 78.233);
        const variance = noise - Math.floor(noise);
        const baseHeight = 3;
        const maxHeight = 6 + variance * 22;
        const duration = 0.95 + variance * 0.7;
        // Stagger creates a wave that travels around the row.
        const delay = (i / BAR_COUNT) * 1.8;
        return (
          <motion.span
            key={i}
            className="w-[2px] rounded-full bg-white/40"
            initial={{ height: `${baseHeight}px` }}
            animate={{
              height: [`${baseHeight}px`, `${maxHeight}px`, `${baseHeight}px`],
              opacity: [0.25, 0.7, 0.25],
            }}
            transition={{
              duration,
              repeat: Infinity,
              delay,
              ease: "easeInOut",
            }}
          />
        );
      })}
    </div>
  );
}
