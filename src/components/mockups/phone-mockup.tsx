// PhoneMockup — voice-call screen that LIVES.
// Cycles through callers, ticks timer, streams transcript lines.
// Pure black/white grayscale.

"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Waveform } from "@/components/waveform";
import { cn } from "@/lib/utils";

const CALLS = [
  { number: "+92 312 4567890", line: "Salam, mujhe order karna hai..." },
  { number: "+92 321 8901234", line: "Hi, can you help me with my booking?" },
  { number: "+92 333 5678901", line: "Aap se baat kar sakti hoon abhi?" },
  { number: "+92 304 1234567", line: "Need to track my delivery please." },
];

const TONE_BG: Record<NonNullable<PhoneMockupProps["tone"]>, string> = {
  darker: "from-neutral-950 via-neutral-900 to-black",
  dark: "from-neutral-800 via-neutral-700 to-neutral-900",
  mid: "from-neutral-400 via-neutral-300 to-neutral-500",
  light: "from-neutral-50 via-white to-neutral-100",
};

type PhoneMockupProps = {
  label: string;
  tone?: "dark" | "darker" | "mid" | "light";
  className?: string;
};

export function PhoneMockup({ label, tone = "darker", className }: PhoneMockupProps) {
  const [callIdx, setCallIdx] = useState(0);
  const [seconds, setSeconds] = useState(23);

  // Tick the call timer every second
  useEffect(() => {
    const t = setInterval(() => setSeconds((s) => s + 1), 1000);
    return () => clearInterval(t);
  }, []);

  // Rotate caller every 6 seconds — reset timer
  useEffect(() => {
    const t = setInterval(() => {
      setCallIdx((i) => (i + 1) % CALLS.length);
      setSeconds(0);
    }, 6000);
    return () => clearInterval(t);
  }, []);

  const isLight = tone === "light";
  const textColor = isLight ? "text-neutral-900" : "text-white";
  const subColor = isLight ? "text-neutral-600" : "text-white/70";
  const timerColor = isLight ? "text-neutral-500" : "text-white/80";
  const bloomColor = isLight ? "bg-neutral-900/10" : "bg-white/20";
  const transcriptBg = isLight ? "bg-neutral-900/8 text-neutral-700" : "bg-white/10 text-white/85";

  const call = CALLS[callIdx];
  const minutes = Math.floor(seconds / 60);
  const displaySec = (seconds % 60).toString().padStart(2, "0");
  const displayMin = minutes.toString().padStart(2, "0");

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
            <p className={cn("text-xs font-mono tabular-nums mb-1", timerColor)}>
              {displayMin}:{displaySec}
            </p>
            <h3 className={cn("text-3xl font-bold tracking-tight mb-1", textColor)}>{label}</h3>
            <AnimatePresence mode="wait">
              <motion.p
                key={call.number}
                initial={{ opacity: 0, y: 4 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -4 }}
                transition={{ duration: 0.3 }}
                className={cn("text-[11px] mb-6 tabular-nums", subColor)}
              >
                {call.number}
              </motion.p>
            </AnimatePresence>

            <Waveform bars={26} maxHeight={42} barWidth={2.5} intensity={2} className={cn(isLight ? "opacity-70" : "opacity-80")} />

            {/* Streaming transcript bubble */}
            <AnimatePresence mode="wait">
              <motion.div
                key={call.line}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -4 }}
                transition={{ duration: 0.4, delay: 0.2 }}
                className={cn("mt-5 px-3 py-2 rounded-xl text-[10px] leading-snug font-medium", transcriptBg)}
              >
                <TypewriterText text={call.line} />
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Pulsing radial bloom */}
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

// Tiny typewriter that types the line then pauses
function TypewriterText({ text }: { text: string }) {
  const [shown, setShown] = useState("");
  useEffect(() => {
    setShown("");
    let i = 0;
    const t = setInterval(() => {
      i += 1;
      setShown(text.slice(0, i));
      if (i >= text.length) clearInterval(t);
    }, 35);
    return () => clearInterval(t);
  }, [text]);
  return <span>{shown}<motion.span animate={{ opacity: [1, 0] }} transition={{ duration: 0.5, repeat: Infinity }}>▌</motion.span></span>;
}
