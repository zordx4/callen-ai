// OrderReceiptMockup — restaurant order ticket visualization.
// Distinct from phone mockups. Vertical receipt card with line items.

"use client";

import { motion } from "motion/react";
import { Receipt, MapPin, CheckCircle2 } from "lucide-react";

const ITEMS = [
  { name: "Family Feast", qty: 1, price: 2499 },
  { name: "Extra fries · large", qty: 2, price: 320 },
  { name: "Coke 1.5L", qty: 1, price: 280 },
];

export function OrderReceiptMockup() {
  const subtotal = ITEMS.reduce((s, i) => s + i.qty * i.price, 0);
  const delivery = 150;
  const total = subtotal + delivery;

  return (
    <div className="relative w-full h-full overflow-hidden bg-neutral-950 p-6">
      {/* Decorative subtle wave behind receipt */}
      <svg className="absolute inset-0 w-full h-full opacity-10" preserveAspectRatio="none" viewBox="0 0 400 600">
        {[...Array(20)].map((_, i) => (
          <path
            key={i}
            d={`M0 ${i * 35} Q 100 ${i * 35 - 8} 200 ${i * 35} T 400 ${i * 35}`}
            stroke="white"
            strokeWidth="0.5"
            fill="none"
          />
        ))}
      </svg>

      {/* Receipt paper */}
      <motion.div
        initial={{ opacity: 0, y: 12, rotate: -1 }}
        whileInView={{ opacity: 1, y: 0, rotate: -1.5 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
        className="relative mx-auto bg-white rounded-md shadow-2xl shadow-neutral-900/40 w-[200px] py-4 font-mono text-neutral-900"
        style={{
          backgroundImage:
            "linear-gradient(to bottom, transparent calc(100% - 8px), white calc(100% - 8px)), radial-gradient(circle at 4px 4px, transparent 4px, white 4px)",
        }}
      >
        {/* Torn edge top */}
        <div className="absolute -top-1.5 left-0 right-0 h-3"
          style={{
            backgroundImage:
              "radial-gradient(circle at 6px 0, transparent 4px, white 4px)",
            backgroundSize: "12px 12px",
            backgroundPosition: "0 -6px",
          }}
        />

        <div className="px-4">
          <div className="text-center mb-2 pb-2 border-b border-dashed border-neutral-300">
            <Receipt className="size-4 mx-auto mb-1" />
            <p className="text-[10px] font-bold tracking-widest">KARACHI BITES</p>
            <p className="text-[8px] text-neutral-500">order #KB-7821</p>
          </div>

          {ITEMS.map((item, i) => (
            <motion.div
              key={item.name}
              initial={{ opacity: 0, x: -4 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 + i * 0.08 }}
              className="flex justify-between items-baseline mb-1 text-[10px]"
            >
              <div className="flex gap-1 min-w-0">
                <span className="text-neutral-500 shrink-0">{item.qty}×</span>
                <span className="truncate">{item.name}</span>
              </div>
              <span className="tabular-nums shrink-0 ml-2">{(item.qty * item.price).toLocaleString()}</span>
            </motion.div>
          ))}

          <div className="border-t border-dashed border-neutral-300 mt-2 pt-2 text-[10px] space-y-0.5">
            <div className="flex justify-between text-neutral-500">
              <span>Subtotal</span>
              <span className="tabular-nums">{subtotal.toLocaleString()}</span>
            </div>
            <div className="flex justify-between text-neutral-500">
              <span>Delivery</span>
              <span className="tabular-nums">{delivery}</span>
            </div>
            <div className="flex justify-between font-bold text-[11px] pt-1 border-t border-neutral-200 mt-1">
              <span>TOTAL · PKR</span>
              <span className="tabular-nums">{total.toLocaleString()}</span>
            </div>
          </div>

          <div className="mt-3 pt-2 border-t border-dashed border-neutral-300 flex items-center gap-1 text-[9px] text-neutral-600">
            <MapPin className="size-2.5 shrink-0" />
            <span className="truncate">Phase 6, Defence · 32 min ETA</span>
          </div>

          <div className="mt-2 text-center">
            <CheckCircle2 className="size-4 mx-auto" />
            <p className="text-[9px] font-bold mt-0.5">Confirmed by Callen</p>
          </div>
        </div>

        {/* Torn edge bottom */}
        <div className="absolute -bottom-1.5 left-0 right-0 h-3"
          style={{
            backgroundImage:
              "radial-gradient(circle at 6px 6px, transparent 4px, white 4px)",
            backgroundSize: "12px 12px",
          }}
        />
      </motion.div>
    </div>
  );
}
