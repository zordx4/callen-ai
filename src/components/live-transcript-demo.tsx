// LiveTranscriptDemo — animated typewriter-style chat bubbles.
// Cycles through a sample Urdu+English call to show Callen in action.

"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Phone, Sparkles } from "lucide-react";
import { Waveform } from "@/components/waveform";

type Turn = {
  speaker: "caller" | "agent";
  text: string;
  lang: "ur" | "en";
};

const SCRIPT: Turn[] = [
  { speaker: "caller", text: "Salam, mujhe family deal order karna hai.", lang: "ur" },
  { speaker: "agent", text: "Bilkul! Family Feast 2,499 rupees mein available hai — pizza, chicken, fries, drink. Delivery ya pickup?", lang: "ur" },
  { speaker: "caller", text: "Delivery please. Defence Phase 6.", lang: "en" },
  { speaker: "agent", text: "Got it. House number aur phone confirm karein?", lang: "ur" },
  { speaker: "caller", text: "House 42, Street 9. Same number.", lang: "en" },
  { speaker: "agent", text: "Done. Order KB-7821 confirmed — 35 minutes mein pohonch jaye gi. Shukria!", lang: "ur" },
];

export function LiveTranscriptDemo() {
  // Start with 2 turns already visible so the card never looks empty.
  // Animation continues from there.
  const [visibleIndex, setVisibleIndex] = useState(2);
  const [restartKey, setRestartKey] = useState(0);

  useEffect(() => {
    if (visibleIndex >= SCRIPT.length) {
      const t = setTimeout(() => {
        setVisibleIndex(0);
        setRestartKey((k) => k + 1);
      }, 2800);
      return () => clearTimeout(t);
    }
    const t = setTimeout(() => setVisibleIndex((i) => i + 1), 1700);
    return () => clearTimeout(t);
  }, [visibleIndex]);

  const visible = SCRIPT.slice(0, visibleIndex);

  return (
    <div className="bg-white rounded-3xl border border-neutral-200 shadow-2xl shadow-neutral-900/5 overflow-hidden">
      {/* Header — like a phone call interface */}
      <div className="flex items-center gap-3 px-5 py-4 border-b border-neutral-100">
        <div className="size-9 rounded-full bg-neutral-950 flex items-center justify-center text-white">
          <Phone className="size-4" />
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-semibold tracking-tight">+92 312 4567890</p>
          <div className="flex items-center gap-1.5 mt-0.5">
            <span className="size-1.5 rounded-full bg-neutral-900 animate-pulse" />
            <span className="text-[11px] text-neutral-500">Live · 00:{(visibleIndex * 18).toString().padStart(2, "0")}</span>
          </div>
        </div>
        <Waveform bars={12} maxHeight={20} barWidth={2} intensity={2} className="shrink-0" />
      </div>

      {/* Transcript stream */}
      <div className="px-5 py-5 space-y-3 min-h-[340px] max-h-[340px] overflow-hidden flex flex-col justify-end">
        <AnimatePresence mode="popLayout">
          {visible.map((turn, i) => (
            <motion.div
              key={`${restartKey}-${i}`}
              layout
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.4, ease: [0.2, 0.65, 0.3, 0.9] }}
              className={turn.speaker === "agent" ? "flex justify-start" : "flex justify-end"}
            >
              <div
                className={
                  turn.speaker === "agent"
                    ? "max-w-[80%] bg-neutral-100 rounded-2xl rounded-bl-md px-3.5 py-2"
                    : "max-w-[80%] bg-neutral-950 text-white rounded-2xl rounded-br-md px-3.5 py-2"
                }
              >
                <div className="flex items-center gap-1.5 mb-1">
                  <span
                    className={
                      turn.speaker === "agent"
                        ? "text-[9px] uppercase tracking-widest text-neutral-500 font-semibold"
                        : "text-[9px] uppercase tracking-widest text-white/60 font-semibold"
                    }
                  >
                    {turn.speaker} · {turn.lang.toUpperCase()}
                  </span>
                </div>
                <p className="text-[13px] leading-snug">{turn.text}</p>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>

        {/* "Typing" indicator while next bubble is loading */}
        {visibleIndex < SCRIPT.length && visibleIndex > 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className={SCRIPT[visibleIndex]?.speaker === "agent" ? "flex justify-start" : "flex justify-end"}
          >
            <div className="bg-neutral-100 rounded-2xl px-3 py-2 flex items-center gap-1">
              {[0, 1, 2].map((d) => (
                <motion.span
                  key={d}
                  className="size-1.5 rounded-full bg-neutral-400"
                  animate={{ opacity: [0.3, 1, 0.3] }}
                  transition={{ duration: 1, repeat: Infinity, delay: d * 0.15 }}
                />
              ))}
            </div>
          </motion.div>
        )}
      </div>

      {/* Footer — live indicators */}
      <div className="px-5 py-3 border-t border-neutral-100 bg-neutral-50/60 flex items-center gap-4 text-[11px] text-neutral-600">
        <div className="flex items-center gap-1.5">
          <Sparkles className="size-3" />
          <span>Intent: <span className="font-semibold text-neutral-900">order_food</span></span>
        </div>
        <div className="hidden sm:flex items-center gap-1.5">
          <span className="size-1 rounded-full bg-neutral-900" />
          <span>Tool: <span className="font-semibold text-neutral-900">createOrder</span></span>
        </div>
        <div className="ml-auto font-mono text-neutral-500">752ms</div>
      </div>
    </div>
  );
}
