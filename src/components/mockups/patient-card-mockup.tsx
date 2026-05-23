// PatientCardMockup — medical patient summary card.
// For the Healthcare & Clinics use case. Distinct visual from phone or calendar.

"use client";

import { motion } from "motion/react";
import { Heart, Calendar, Pill, Phone } from "lucide-react";

export function PatientCardMockup() {
  return (
    <div className="relative w-full h-full overflow-hidden bg-gradient-to-br from-neutral-100 via-white to-neutral-200 p-5">
      {/* Subtle medical-cross pattern bg */}
      <div
        className="absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage:
            "linear-gradient(to right, #000 1px, transparent 1px), linear-gradient(to bottom, #000 1px, transparent 1px)",
          backgroundSize: "24px 24px",
        }}
      />

      <motion.div
        initial={{ opacity: 0, y: 12 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
        className="relative rounded-3xl bg-white border border-neutral-200 shadow-xl shadow-neutral-900/10 overflow-hidden"
      >
        {/* Header */}
        <div className="bg-neutral-950 text-white px-4 py-3.5">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[9px] uppercase tracking-widest text-white/60 font-semibold">Patient · MRN #4421</span>
            <span className="text-[9px] px-1.5 py-0.5 rounded bg-white/15 font-medium">Active</span>
          </div>
          <div className="flex items-center gap-3">
            <div className="size-10 rounded-full bg-white/15 flex items-center justify-center font-bold text-sm">
              AK
            </div>
            <div>
              <p className="text-sm font-bold tracking-tight">Ahsan Khan</p>
              <p className="text-[10px] text-white/70">34 · Male · Phase 8, Karachi</p>
            </div>
          </div>
        </div>

        {/* Vitals strip */}
        <div className="grid grid-cols-3 divide-x divide-neutral-200 border-b border-neutral-200">
          {[
            { label: "BP", value: "120/80", icon: Heart },
            { label: "HR", value: "72 bpm", icon: Heart },
            { label: "Visits", value: "3", icon: Calendar },
          ].map((v) => (
            <div key={v.label} className="px-2.5 py-2 text-center">
              <p className="text-[9px] text-neutral-500 uppercase tracking-wider">{v.label}</p>
              <p className="text-xs font-bold tabular-nums mt-0.5">{v.value}</p>
            </div>
          ))}
        </div>

        {/* Body */}
        <div className="px-4 py-3 space-y-2.5">
          <div>
            <p className="text-[9px] uppercase tracking-widest text-neutral-500 font-semibold mb-1">Last appointment</p>
            <p className="text-[12px] font-medium">Dr. Hina Faisal · GP</p>
            <p className="text-[10px] text-neutral-500">15 May 2026 · 11:30 AM</p>
          </div>

          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3 }}
            className="rounded-xl bg-neutral-50 border border-neutral-200 px-2.5 py-2"
          >
            <div className="flex items-center gap-1.5 mb-0.5">
              <Phone className="size-3 text-neutral-700" />
              <p className="text-[9px] uppercase tracking-widest font-semibold text-neutral-700">
                Booked by Callen
              </p>
            </div>
            <p className="text-[10px] text-neutral-600 leading-snug">
              &quot;Doctor sahab ke saath checkup chahiye agle hafte&quot;
            </p>
            <p className="text-[10px] mt-1 font-medium">→ Wed 22 May · 3:00 PM</p>
          </motion.div>

          <div className="flex items-center gap-1.5 pt-1">
            <Pill className="size-3 text-neutral-500" />
            <p className="text-[10px] text-neutral-600">2 active prescriptions</p>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
