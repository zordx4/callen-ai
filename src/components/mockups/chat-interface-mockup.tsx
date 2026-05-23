// Chat interface mockup — monochrome theme.
// Replaces the colorful conic-gradient sphere with a grayscale variant.

"use client";

import { motion } from "motion/react";
import { Mic, MicOff } from "lucide-react";

export function ChatInterfaceMockup() {
  return (
    <div className="relative rounded-3xl overflow-hidden bg-gradient-to-br from-neutral-100 via-neutral-200 to-neutral-300 border border-neutral-200/80 shadow-2xl shadow-neutral-900/10 aspect-[4/5] p-6">
      {/* Decorative wave grid bg — monochrome */}
      <svg
        className="absolute inset-0 w-full h-full opacity-25"
        viewBox="0 0 400 500"
        fill="none"
        preserveAspectRatio="none"
      >
        {[...Array(15)].map((_, i) => (
          <path
            key={i}
            d={`M0 ${i * 35 + 30} Q 100 ${i * 35 + 10} 200 ${i * 35 + 30} T 400 ${i * 35 + 30}`}
            stroke="#000"
            strokeWidth="0.6"
            opacity="0.4"
            fill="none"
          />
        ))}
      </svg>

      {/* Inner chat window */}
      <div className="relative h-full flex flex-col rounded-2xl bg-white border border-white/60 shadow-xl shadow-neutral-900/5">
        {/* Header with sphere avatar + listening */}
        <div className="flex items-center gap-3 px-4 py-3 border-b border-neutral-100">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 16, repeat: Infinity, ease: "linear" }}
            className="size-9 rounded-full relative overflow-hidden shrink-0"
            style={{
              background: "conic-gradient(from 180deg, #0a0a0a, #404040, #a3a3a3, #f5f5f5, #404040, #0a0a0a)",
            }}
          >
            <div className="absolute inset-0.5 rounded-full bg-gradient-to-br from-white/30 to-neutral-400/30" />
          </motion.div>
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-neutral-100 text-[11px] font-medium text-neutral-700">
            <motion.span
              animate={{ opacity: [0.4, 1, 0.4] }}
              transition={{ duration: 1.4, repeat: Infinity }}
              className="size-1.5 rounded-full bg-neutral-900"
            />
            Listening
          </div>
        </div>

        {/* Conversation */}
        <div className="flex-1 px-4 py-4 space-y-3 overflow-hidden">
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="flex gap-2"
          >
            <div
              className="size-6 rounded-full shrink-0 mt-0.5"
              style={{ background: "conic-gradient(from 180deg, #0a0a0a, #404040, #a3a3a3, #404040, #0a0a0a)" }}
            />
            <div className="max-w-[85%] bg-neutral-100 rounded-2xl rounded-bl-md px-3 py-2 text-[12.5px] text-neutral-800 leading-snug">
              Salam! Karachi Bites mein khush amdeed. Aap ka order kya hoga?
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 8 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="flex justify-end"
          >
            <div className="max-w-[85%] bg-neutral-900 text-white rounded-2xl rounded-br-md px-3 py-2 text-[12.5px] leading-snug">
              Hi, I want a family deal — delivery to Phase 6.
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 8 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.4 }}
            className="flex gap-2"
          >
            <div
              className="size-6 rounded-full shrink-0 mt-0.5"
              style={{ background: "conic-gradient(from 180deg, #0a0a0a, #404040, #a3a3a3, #404040, #0a0a0a)" }}
            />
            <div className="max-w-[85%] bg-neutral-100 rounded-2xl rounded-bl-md px-3 py-2 text-[12.5px] text-neutral-800 leading-snug">
              Bilkul! Family Feast — pizza, chicken, fries, drink. PKR 2,499.
              House number aur phone confirm karein?
            </div>
          </motion.div>
        </div>

        {/* Input bar */}
        <div className="px-3 py-2.5 border-t border-neutral-100 flex items-center gap-2">
          <div className="flex-1 px-3 py-1.5 rounded-full bg-neutral-100 text-[12px] text-neutral-400">
            Or send a message...
          </div>
          <button className="size-8 rounded-full bg-neutral-100 flex items-center justify-center text-neutral-700">
            <Mic className="size-3.5" />
          </button>
          <button className="size-8 rounded-full bg-neutral-900 flex items-center justify-center text-white">
            <MicOff className="size-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
}
