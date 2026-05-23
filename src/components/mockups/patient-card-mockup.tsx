// PatientCardMockup — medical record that CYCLES through patients booked by Callen.
// BP/HR pulse subtly. Patient name + booking quote swap in.

"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Heart, Activity, Calendar, Phone, Pill } from "lucide-react";

type Patient = {
  mrn: string;
  initials: string;
  name: string;
  meta: string;
  bp: string;
  hr: number;
  visits: number;
  doctor: string;
  doctorRole: string;
  date: string;
  callQuote: string;
  appointment: string;
};

const PATIENTS: Patient[] = [
  {
    mrn: "4421",
    initials: "AK",
    name: "Ahsan Khan",
    meta: "34 · Male · Phase 8, Karachi",
    bp: "120/80",
    hr: 72,
    visits: 3,
    doctor: "Dr. Hina Faisal",
    doctorRole: "GP",
    date: "15 May 2026 · 11:30 AM",
    callQuote: "Doctor sahab ke saath checkup chahiye agle hafte",
    appointment: "Wed 22 May · 3:00 PM",
  },
  {
    mrn: "4422",
    initials: "FA",
    name: "Fatima Ahmed",
    meta: "28 · Female · Gulberg, Lahore",
    bp: "118/76",
    hr: 68,
    visits: 1,
    doctor: "Dr. Ali Raza",
    doctorRole: "Cardiologist",
    date: "12 May 2026 · 4:00 PM",
    callQuote: "I need to schedule a follow-up consultation",
    appointment: "Thu 23 May · 11:00 AM",
  },
  {
    mrn: "4423",
    initials: "IM",
    name: "Imran Malik",
    meta: "52 · Male · F-7, Islamabad",
    bp: "135/86",
    hr: 80,
    visits: 7,
    doctor: "Dr. Sara Iqbal",
    doctorRole: "Endocrinologist",
    date: "9 May 2026 · 10:15 AM",
    callQuote: "Mujhe lab results ke baray mein baat karni hai",
    appointment: "Fri 24 May · 9:30 AM",
  },
];

export function PatientCardMockup() {
  const [idx, setIdx] = useState(0);
  const p = PATIENTS[idx];

  useEffect(() => {
    const t = setInterval(() => setIdx((i) => (i + 1) % PATIENTS.length), 5500);
    return () => clearInterval(t);
  }, []);

  return (
    <div className="relative w-full h-full overflow-hidden bg-gradient-to-br from-neutral-100 via-white to-neutral-200 p-5">
      {/* Grid bg */}
      <div
        className="absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage: "linear-gradient(to right, #000 1px, transparent 1px), linear-gradient(to bottom, #000 1px, transparent 1px)",
          backgroundSize: "24px 24px",
        }}
      />

      <AnimatePresence mode="wait">
        <motion.div
          key={p.mrn}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -8 }}
          transition={{ duration: 0.4 }}
          className="relative rounded-3xl bg-white border border-neutral-200 shadow-xl shadow-neutral-900/10 overflow-hidden"
        >
          {/* Header */}
          <div className="bg-neutral-950 text-white px-4 py-3.5">
            <div className="flex items-center justify-between mb-2">
              <span className="text-[9px] uppercase tracking-widest text-white/60 font-semibold">Patient · MRN #{p.mrn}</span>
              <span className="text-[9px] px-1.5 py-0.5 rounded bg-white/15 font-medium">Active</span>
            </div>
            <div className="flex items-center gap-3">
              <div className="size-10 rounded-full bg-white/15 flex items-center justify-center font-bold text-sm">
                {p.initials}
              </div>
              <div>
                <p className="text-sm font-bold tracking-tight">{p.name}</p>
                <p className="text-[10px] text-white/70">{p.meta}</p>
              </div>
            </div>
          </div>

          {/* Vitals strip with pulsing HR */}
          <div className="grid grid-cols-3 divide-x divide-neutral-200 border-b border-neutral-200">
            <div className="px-2.5 py-2 text-center">
              <p className="text-[9px] text-neutral-500 uppercase tracking-wider">BP</p>
              <p className="text-xs font-bold tabular-nums mt-0.5">{p.bp}</p>
            </div>
            <div className="px-2.5 py-2 text-center">
              <p className="text-[9px] text-neutral-500 uppercase tracking-wider">HR</p>
              <p className="text-xs font-bold tabular-nums mt-0.5 inline-flex items-center gap-1">
                <motion.span
                  animate={{ scale: [1, 1.2, 1] }}
                  transition={{ duration: 60 / p.hr, repeat: Infinity, ease: "easeInOut" }}
                >
                  <Heart className="size-2.5 fill-current" />
                </motion.span>
                {p.hr}
              </p>
            </div>
            <div className="px-2.5 py-2 text-center">
              <p className="text-[9px] text-neutral-500 uppercase tracking-wider">Visits</p>
              <p className="text-xs font-bold tabular-nums mt-0.5">{p.visits}</p>
            </div>
          </div>

          {/* Body */}
          <div className="px-4 py-3 space-y-2.5">
            <div>
              <p className="text-[9px] uppercase tracking-widest text-neutral-500 font-semibold mb-1">Last appointment</p>
              <p className="text-[12px] font-medium">{p.doctor} · {p.doctorRole}</p>
              <p className="text-[10px] text-neutral-500">{p.date}</p>
            </div>

            <motion.div
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2 }}
              className="rounded-xl bg-neutral-50 border border-neutral-200 px-2.5 py-2"
            >
              <div className="flex items-center gap-1.5 mb-0.5">
                <Phone className="size-3 text-neutral-700" />
                <p className="text-[9px] uppercase tracking-widest font-semibold text-neutral-700">Booked by Callen</p>
                <span className="ml-auto inline-flex items-center gap-1 text-[8px] text-neutral-500">
                  <motion.span animate={{ opacity: [0.4, 1, 0.4] }} transition={{ duration: 1.6, repeat: Infinity }} className="size-1 rounded-full bg-neutral-900" />
                  live
                </span>
              </div>
              <p className="text-[10px] text-neutral-600 leading-snug italic">&quot;{p.callQuote}&quot;</p>
              <p className="text-[10px] mt-1 font-medium">→ {p.appointment}</p>
            </motion.div>

            <div className="flex items-center justify-between pt-1">
              <div className="flex items-center gap-1.5">
                <Pill className="size-3 text-neutral-500" />
                <p className="text-[10px] text-neutral-600">{p.visits >= 5 ? "4" : "2"} active prescriptions</p>
              </div>
              <Activity className="size-3 text-neutral-400" />
            </div>
          </div>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
