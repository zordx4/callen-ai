// CalendarMockup — booking calendar visualisation.
// Pure black/white/grayscale theme.

"use client";

import { motion } from "motion/react";

export function CalendarMockup() {
  const days = ["Mon", "Tue", "Wed", "Thu", "Fri"];
  const dates = ["June 5", "June 5", "June 6", "June 7", "June 8"];
  const slots = [9, 10, 11, 12, 13, 14, 15, 16, 17];
  const booked = [
    { day: 0, slot: 1 }, { day: 0, slot: 3 },
    { day: 2, slot: 0 }, { day: 2, slot: 4 },
    { day: 3, slot: 2 }, { day: 3, slot: 5 },
    { day: 4, slot: 1 },
  ];

  return (
    <div className="relative w-full h-full rounded-3xl overflow-hidden bg-gradient-to-br from-neutral-200 via-neutral-100 to-neutral-300 p-4">
      {/* Subtle decoration top */}
      <svg className="absolute top-0 left-0 right-0 h-12 w-full" viewBox="0 0 400 50" preserveAspectRatio="none">
        <path d="M0 30 Q 100 0 200 25 T 400 20 L400 0 L0 0 Z" fill="rgba(0,0,0,0.05)" />
      </svg>

      {/* Days header */}
      <div className="relative grid grid-cols-5 gap-1.5 mb-2 mt-3 text-neutral-800">
        {days.map((d, i) => (
          <div key={d} className="text-center">
            <p className="text-[10px] font-semibold">{d}</p>
            <p className="text-[9px] text-neutral-500">{dates[i]}</p>
          </div>
        ))}
      </div>

      {/* Slot grid */}
      <div className="relative grid grid-cols-5 gap-1.5">
        {slots.map((hour) =>
          days.map((_, dayIdx) => {
            const isBooked = booked.some((b) => b.day === dayIdx && b.slot === slots.indexOf(hour));
            return (
              <motion.div
                key={`${dayIdx}-${hour}`}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: (dayIdx * slots.length + slots.indexOf(hour)) * 0.012 }}
                className={
                  isBooked
                    ? "h-6 rounded-md bg-neutral-950 text-white text-[9px] font-semibold flex items-center justify-center"
                    : "h-6 rounded-md bg-neutral-50 border border-neutral-200/60"
                }
              >
                {isBooked && `${hour}:00`}
              </motion.div>
            );
          })
        )}
      </div>
    </div>
  );
}
