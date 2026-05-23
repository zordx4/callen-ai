// CalendarMockup — booking calendar where slots GET BOOKED LIVE every few seconds.
// Counter at top updates. New slots ripple to black when booked.

"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Sparkles } from "lucide-react";

const DAYS = ["Mon", "Tue", "Wed", "Thu", "Fri"];
const DATES = ["June 5", "June 5", "June 6", "June 7", "June 8"];
const HOURS = [9, 10, 11, 12, 13, 14, 15, 16, 17];

// Pre-seeded booked slots
const INITIAL: Array<{ d: number; h: number }> = [
  { d: 0, h: 1 }, { d: 0, h: 3 },
  { d: 2, h: 0 }, { d: 2, h: 4 },
  { d: 3, h: 2 }, { d: 3, h: 5 },
  { d: 4, h: 1 },
];

// Sequence of new bookings to animate in
const SCHEDULE: Array<{ d: number; h: number }> = [
  { d: 1, h: 2 }, { d: 4, h: 4 }, { d: 0, h: 6 }, { d: 3, h: 7 }, { d: 2, h: 3 }, { d: 1, h: 5 }, { d: 4, h: 0 },
];

export function CalendarMockup() {
  const [booked, setBooked] = useState(INITIAL);
  const [scheduleIdx, setScheduleIdx] = useState(0);
  const [pulse, setPulse] = useState<{ d: number; h: number } | null>(null);

  useEffect(() => {
    const t = setInterval(() => {
      const next = SCHEDULE[scheduleIdx % SCHEDULE.length];
      // Already booked? reset to initial after going through schedule
      if (booked.some((b) => b.d === next.d && b.h === next.h)) {
        // Reset
        setBooked(INITIAL);
        setScheduleIdx(0);
      } else {
        setBooked((b) => [...b, next]);
        setPulse(next);
        setTimeout(() => setPulse(null), 800);
        setScheduleIdx((i) => i + 1);
      }
    }, 2400);
    return () => clearInterval(t);
  }, [booked, scheduleIdx]);

  return (
    <div className="relative w-full h-full overflow-hidden bg-gradient-to-br from-neutral-200 via-neutral-100 to-neutral-300 p-4">
      {/* Decorative top */}
      <svg className="absolute top-0 left-0 right-0 h-12 w-full" viewBox="0 0 400 50" preserveAspectRatio="none">
        <path d="M0 30 Q 100 0 200 25 T 400 20 L400 0 L0 0 Z" fill="rgba(0,0,0,0.05)" />
      </svg>

      {/* Live counter */}
      <div className="relative flex items-center justify-between mb-2 z-10">
        <div className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-neutral-950 text-white text-[9px] font-semibold">
          <motion.span animate={{ opacity: [0.4, 1, 0.4] }} transition={{ duration: 1.6, repeat: Infinity }} className="size-1 rounded-full bg-emerald-300" />
          LIVE
        </div>
        <AnimatePresence mode="wait">
          <motion.span
            key={booked.length}
            initial={{ opacity: 0, y: 4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -4 }}
            transition={{ duration: 0.3 }}
            className="text-[10px] font-bold tabular-nums"
          >
            {booked.length} booked
          </motion.span>
        </AnimatePresence>
      </div>

      {/* Days header */}
      <div className="relative grid grid-cols-5 gap-1.5 mb-2 text-neutral-800">
        {DAYS.map((d, i) => (
          <div key={d} className="text-center">
            <p className="text-[10px] font-semibold">{d}</p>
            <p className="text-[9px] text-neutral-500">{DATES[i]}</p>
          </div>
        ))}
      </div>

      {/* Slot grid */}
      <div className="relative grid grid-cols-5 gap-1.5">
        {HOURS.map((hour, hourIdx) =>
          DAYS.map((_, dayIdx) => {
            const isBooked = booked.some((b) => b.d === dayIdx && b.h === hourIdx);
            const isPulse = pulse && pulse.d === dayIdx && pulse.h === hourIdx;
            return (
              <motion.div
                key={`${dayIdx}-${hourIdx}`}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: (dayIdx * HOURS.length + hourIdx) * 0.012 }}
                className="relative"
              >
                <motion.div
                  animate={isBooked ? { backgroundColor: "#0a0a0a", color: "#ffffff" } : { backgroundColor: "#fafafa" }}
                  transition={{ duration: 0.4 }}
                  className={
                    isBooked
                      ? "h-6 rounded-md text-[9px] font-semibold flex items-center justify-center"
                      : "h-6 rounded-md border border-neutral-200/60"
                  }
                >
                  {isBooked && `${hour}:00`}
                </motion.div>
                {/* Pulse ring when newly booked */}
                {isPulse && (
                  <motion.div
                    initial={{ scale: 1, opacity: 0.5 }}
                    animate={{ scale: 1.8, opacity: 0 }}
                    transition={{ duration: 0.8 }}
                    className="absolute inset-0 rounded-md border-2 border-neutral-900 pointer-events-none"
                  />
                )}
              </motion.div>
            );
          })
        )}
      </div>

      {/* Notification toast */}
      <AnimatePresence>
        {pulse && (
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -4 }}
            className="absolute bottom-3 left-3 right-3 z-20 rounded-xl bg-neutral-950 text-white p-2 flex items-center gap-2 shadow-lg"
          >
            <Sparkles className="size-3 shrink-0" />
            <div className="text-[10px] leading-tight">
              <p className="font-semibold">New booking by Callen</p>
              <p className="text-white/70">{DAYS[pulse.d]} {DATES[pulse.d]} · {HOURS[pulse.h]}:00</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
