// PhoneMockup — generic iPhone-style frame for use-case showcase cards.
// Black & white only. The `tone` prop varies between dark/mid/light/inverted
// grayscale screens to give visual variety without color.

"use client";

import { motion } from "motion/react";
import { Waveform } from "@/components/waveform";
import { cn } from "@/lib/utils";

type PhoneMockupProps = {
  label: string;
  caller?: string;
  timer?: string;
  /** Tone of the screen background — pure B&W grayscale variants */
  tone?: "dark" | "darker" | "mid" | "light";
  showWaveform?: boolean;
  className?: string;
};

const TONE_BG: Record<NonNullable<PhoneMockupProps["tone"]>, string> = {
  darker: "from-neutral-950 via-neutral-900 to-black",
  dark: "from-neutral-800 via-neutral-700 to-neutral-900",
  mid: "from-neutral-400 via-neutral-300 to-neutral-500",
  light: "from-neutral-50 via-white to-neutral-100",
};

export function PhoneMockup({
  label,
  caller = "+92 312 4567890",
  timer = "00:23",
  tone = "dark",
  showWaveform = true,
  className,
}: PhoneMockupProps) {
  const isLight = tone === "light";
  const textColor = isLight ? "text-neutral-900" : "text-white";
  const subColor = isLight ? "text-neutral-600" : "text-white/70";
  const timerColor = isLight ? "text-neutral-500" : "text-white/80";
  const bloomColor = isLight ? "bg-neutral-900/10" : "bg-white/20";

  return (
    <div className={cn("relative mx-auto", className)}>
      <div className="relative w-[220px] h-[450px] rounded-[44px] bg-neutral-950 p-1.5 shadow-2xl shadow-neutral-900/40">
        <div className={cn("relative w-full h-full rounded-[38px] overflow-hidden bg-gradient-to-br", TONE_BG[tone])}>
          {/* Notch */}
          <div className="absolute top-2 left-1/2 -translate-x-1/2 w-20 h-5 bg-neutral-950 rounded-full z-10" />

          {/* Top bar */}
          <div className={cn("relative z-10 px-5 pt-3 flex items-center justify-between text-[10px] font-semibold", textColor)}>
            <span>11:11</span>
            <div className="flex items-center gap-1 opacity-90">
              <span>●●●●</span>
              <span>●●</span>
            </div>
          </div>

          {/* Center content */}
          <div className="relative z-10 flex flex-col items-center justify-center h-full px-4 -mt-6">
            <p className={cn("text-xs font-mono tabular-nums mb-1", timerColor)}>{timer}</p>
            <h3 className={cn("text-3xl font-bold tracking-tight mb-1", textColor)}>{label}</h3>
            <p className={cn("text-[11px] mb-8", subColor)}>{caller}</p>

            {showWaveform && (
              <Waveform bars={26} maxHeight={42} barWidth={2.5} intensity={2} className={cn(isLight ? "opacity-70" : "opacity-80")} />
            )}
          </div>

          {/* Pulsing radial bloom — monochrome */}
          <motion.div
            initial={{ scale: 0.7, opacity: 0.4 }}
            animate={{ scale: 1.5, opacity: 0 }}
            transition={{ duration: 3, repeat: Infinity, ease: "easeOut" }}
            className={cn("absolute bottom-1/3 left-1/2 -translate-x-1/2 size-32 rounded-full blur-2xl", bloomColor)}
          />
        </div>
      </div>
    </div>
  );
}
