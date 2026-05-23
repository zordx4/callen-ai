// Agent Studio workflow editor mockup — monochrome theme.

"use client";

import { motion } from "motion/react";
import { ChevronLeft, Flag, GitBranch, MessageCircle, Globe, BookOpen } from "lucide-react";

export function AgentStudioMockup() {
  return (
    <div className="relative rounded-3xl overflow-hidden bg-gradient-to-br from-neutral-50 via-neutral-100 to-neutral-200 border border-neutral-200/80 shadow-2xl shadow-neutral-900/10 aspect-[4/3]">
      {/* Grid texture */}
      <div
        className="absolute inset-0 opacity-[0.04]"
        style={{
          backgroundImage:
            "linear-gradient(to right, #000 1px, transparent 1px), linear-gradient(to bottom, #000 1px, transparent 1px)",
          backgroundSize: "32px 32px",
        }}
      />

      {/* Window header */}
      <div className="relative px-5 pt-5">
        <div className="flex items-center gap-2 mb-4">
          <ChevronLeft className="size-4 text-neutral-500" />
          <span className="text-base font-semibold tracking-tight">Restaurant Reception Agent</span>
        </div>

        <div className="flex items-center gap-1 -mb-px text-[13px]">
          {["Agent", "Workflow", "Knowledge", "Tools", "Evaluation", "Widget", "Settings"].map((t, i) => (
            <div
              key={t}
              className={
                i === 1
                  ? "px-3 py-2 border-b-2 border-neutral-900 text-neutral-900 font-medium"
                  : "px-3 py-2 text-neutral-500"
              }
            >
              {t}
            </div>
          ))}
        </div>
      </div>

      {/* Workflow canvas */}
      <div className="relative flex flex-col items-center pt-10 pb-8 px-6">
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="rounded-2xl bg-white border border-neutral-200 shadow-sm px-4 py-3 w-[260px]"
        >
          <div className="flex items-center gap-1.5 mb-1">
            <Flag className="size-3.5 text-neutral-500" />
            <span className="text-xs font-semibold text-neutral-900">Start</span>
          </div>
          <p className="text-[11px] text-neutral-600 leading-snug">
            Salam! Karachi Bites mein khush amdeed. Aap ki kya madad...
          </p>
        </motion.div>

        <svg className="my-2" width="2" height="36" viewBox="0 0 2 36" fill="none">
          <line x1="1" y1="0" x2="1" y2="36" stroke="#737373" strokeWidth="1.2" strokeDasharray="3 2" />
        </svg>

        <div className="text-[11px] text-neutral-500 mb-3 italic">caller intent → place_order</div>

        <div className="grid grid-cols-2 gap-3 w-full max-w-[420px]">
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="rounded-2xl bg-white border border-neutral-200 shadow-sm px-3.5 py-3"
          >
            <div className="flex items-center gap-1.5 mb-1">
              <GitBranch className="size-3.5 text-neutral-700" />
              <span className="text-[11px] font-semibold text-neutral-900">Take order</span>
            </div>
            <p className="text-[10px] text-neutral-600 leading-snug">
              Collect items, address, payment method. Confirm total.
            </p>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.15 }}
            className="rounded-2xl bg-white border border-neutral-200 shadow-sm px-3.5 py-3"
          >
            <div className="flex items-center gap-1.5 mb-1">
              <MessageCircle className="size-3.5 text-neutral-700" />
              <span className="text-[11px] font-semibold text-neutral-900">Answer FAQ</span>
            </div>
            <p className="text-[10px] text-neutral-600 leading-snug">
              Hours, location, menu — grounded in knowledge base.
            </p>
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 8 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.25 }}
          className="mt-4 rounded-xl bg-white/80 backdrop-blur border border-neutral-200/80 px-3 py-1.5 flex items-center gap-1.5"
        >
          <Globe className="size-3 text-neutral-500" />
          <span className="text-[10px] font-medium text-neutral-700">Global</span>
          <span className="text-neutral-400">·</span>
          <BookOpen className="size-3 text-neutral-500" />
          <span className="text-[10px] font-medium text-neutral-700">Knowledge Base</span>
        </motion.div>
      </div>
    </div>
  );
}
