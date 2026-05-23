// PhoneMockup — generic iPhone-style frame for use-case showcase cards.
// Accepts label, primary content, and an optional waveform/timer for ringing UI.

"use client";

import { motion } from "motion/react";
import { Waveform } from "@/components/waveform";
import { cn } from "@/lib/utils";

type PhoneMockupProps = {
  label: string;
  caller?: string;
  timer?: string;
  /** Background gradient for the phone "screen" */
  gradient?: string;
  /** Optional waveform "ripples" out from the bottom */
  showWaveform?: boolean;
  className?: string;
};

export function PhoneMockup({
  label,
  caller = "+92 312 4567890",
  timer = "00:23",
  gradient = "from-sky-300 via-blue-400 to-indigo-500",
  showWaveform = true,
  className,
}: PhoneMockupProps) {
  return (
    <div className={cn("relative mx-auto", className)}>
      {/* Phone frame */}
      <div className="relative w-[220px] h-[450px] rounded-[44px] bg-neutral-900 p-1.5 shadow-2xl shadow-neutral-900/30">
        {/* Screen */}
        <div className={cn("relative w-full h-full rounded-[38px] overflow-hidden bg-gradient-to-br", gradient)}>
          {/* Notch */}
          <div className="absolute top-2 left-1/2 -translate-x-1/2 w-20 h-5 bg-neutral-900 rounded-full z-10" />

          {/* Top bar */}
          <div className="relative z-10 px-5 pt-3 flex items-center justify-between text-white text-[10px] font-semibold">
            <span>11:11</span>
            <div className="flex items-center gap-1">
              <span className="opacity-90">●●●●</span>
              <span className="opacity-90">📶</span>
            </div>
          </div>

          {/* Center content */}
          <div className="relative z-10 flex flex-col items-center justify-center h-full px-4 -mt-6">
            <p className="text-white/80 text-xs font-mono tabular-nums mb-1">{timer}</p>
            <h3 className="text-white text-3xl font-bold tracking-tight mb-1">{label}</h3>
            <p className="text-white/70 text-[11px] mb-8">{caller}</p>

            {showWaveform && (
              <Waveform bars={26} maxHeight={42} barWidth={2.5} intensity={2} className="opacity-80" />
            )}
          </div>

          {/* Animated bloom (radial glow) */}
          <motion.div
            initial={{ scale: 0.7, opacity: 0.3 }}
            animate={{ scale: 1.4, opacity: 0 }}
            transition={{ duration: 3, repeat: Infinity, ease: "easeOut" }}
            className="absolute bottom-1/3 left-1/2 -translate-x-1/2 size-32 rounded-full bg-white/20 blur-2xl"
          />
        </div>
      </div>
    </div>
  );
}
