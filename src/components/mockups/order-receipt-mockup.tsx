// OrderReceiptMockup — order ticket that ASSEMBLES LIVE.
// Items appear one by one, total updates, then cycles to next order.

"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Receipt, MapPin, CheckCircle2 } from "lucide-react";

type OrderItem = { name: string; qty: number; price: number };
type Order = {
  number: string;
  items: OrderItem[];
  delivery: number;
  location: string;
  eta: string;
};

const ORDERS: Order[] = [
  {
    number: "CH-7821",
    items: [
      { name: "Peri Peri Pizza · medium", qty: 1, price: 1190 },
      { name: "Cheesy Fries", qty: 1, price: 350 },
      { name: "Pepsi 1.5L", qty: 1, price: 150 },
    ],
    delivery: 150,
    location: "Phase 6, Defence",
    eta: "30 min",
  },
  {
    number: "KFC-7822",
    items: [
      { name: "Zinger Burger Combo", qty: 2, price: 990 },
      { name: "Hot Wings · 6pc", qty: 1, price: 720 },
      { name: "Mountain Dew 1.5L", qty: 1, price: 150 },
    ],
    delivery: 120,
    location: "Gulberg III, Lahore",
    eta: "25 min",
  },
  {
    number: "DP-7823",
    items: [
      { name: "BBQ Chicken · medium", qty: 1, price: 1490 },
      { name: "Stuffed Crust Pepperoni", qty: 1, price: 1890 },
      { name: "Garlic Bread", qty: 1, price: 350 },
      { name: "Coke 1.5L", qty: 1, price: 150 },
    ],
    delivery: 180,
    location: "F-11, Islamabad",
    eta: "38 min",
  },
];

export function OrderReceiptMockup() {
  const [orderIdx, setOrderIdx] = useState(0);
  const [itemsShown, setItemsShown] = useState(0);
  const order = ORDERS[orderIdx];

  // Add an item every 700ms; when all shown, wait 3s and cycle to next order
  useEffect(() => {
    if (itemsShown < order.items.length) {
      const t = setTimeout(() => setItemsShown((i) => i + 1), 700);
      return () => clearTimeout(t);
    }
    const t = setTimeout(() => {
      setItemsShown(0);
      setOrderIdx((i) => (i + 1) % ORDERS.length);
    }, 3200);
    return () => clearTimeout(t);
  }, [itemsShown, order.items.length, orderIdx]);

  const visibleItems = order.items.slice(0, itemsShown);
  const subtotal = visibleItems.reduce((s, i) => s + i.qty * i.price, 0);
  const total = subtotal + (itemsShown === order.items.length ? order.delivery : 0);

  return (
    <div className="relative w-full h-full overflow-hidden bg-neutral-950 p-6">
      {/* Decorative wave bg */}
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

      {/* Live indicator */}
      <div className="relative z-10 inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-white/10 backdrop-blur text-white text-[9px] font-semibold mb-3">
        <motion.span animate={{ opacity: [0.4, 1, 0.4] }} transition={{ duration: 1.6, repeat: Infinity }} className="size-1 rounded-full bg-emerald-300" />
        Taking order via Callen
      </div>

      {/* Receipt paper */}
      <motion.div
        animate={{ rotate: [-1.5, -0.8, -1.5] }}
        transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
        className="relative mx-auto bg-white rounded-md shadow-2xl shadow-neutral-900/40 w-[200px] py-4 font-mono text-neutral-900"
      >
        {/* Torn top edge */}
        <div
          className="absolute -top-1.5 left-0 right-0 h-3"
          style={{
            backgroundImage: "radial-gradient(circle at 6px 0, transparent 4px, white 4px)",
            backgroundSize: "12px 12px",
            backgroundPosition: "0 -6px",
          }}
        />

        <div className="px-4">
          <div className="text-center mb-2 pb-2 border-b border-dashed border-neutral-300">
            <Receipt className="size-4 mx-auto mb-1" />
            <p className="text-[10px] font-bold tracking-widest">JOHNNY &amp; JUGNU</p>
            <AnimatePresence mode="wait">
              <motion.p
                key={order.number}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="text-[8px] text-neutral-500"
              >
                order #{order.number}
              </motion.p>
            </AnimatePresence>
          </div>

          <div className="min-h-[60px]">
            <AnimatePresence mode="popLayout">
              {visibleItems.map((item, i) => (
                <motion.div
                  key={`${order.number}-${i}`}
                  layout
                  initial={{ opacity: 0, x: -8 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.3 }}
                  className="flex justify-between items-baseline mb-1 text-[10px]"
                >
                  <div className="flex gap-1 min-w-0">
                    <span className="text-neutral-500 shrink-0">{item.qty}×</span>
                    <span className="truncate">{item.name}</span>
                  </div>
                  <span className="tabular-nums shrink-0 ml-2">{(item.qty * item.price).toLocaleString()}</span>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>

          <div className="border-t border-dashed border-neutral-300 mt-2 pt-2 text-[10px] space-y-0.5">
            <div className="flex justify-between text-neutral-500">
              <span>Subtotal</span>
              <span className="tabular-nums">{subtotal.toLocaleString()}</span>
            </div>
            <AnimatePresence>
              {itemsShown === order.items.length && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  className="flex justify-between text-neutral-500"
                >
                  <span>Delivery</span>
                  <span className="tabular-nums">{order.delivery}</span>
                </motion.div>
              )}
            </AnimatePresence>
            <motion.div
              key={total}
              initial={{ scale: 0.96 }}
              animate={{ scale: 1 }}
              className="flex justify-between font-bold text-[11px] pt-1 border-t border-neutral-200 mt-1"
            >
              <span>TOTAL · PKR</span>
              <span className="tabular-nums">{total.toLocaleString()}</span>
            </motion.div>
          </div>

          <AnimatePresence>
            {itemsShown === order.items.length && (
              <motion.div
                initial={{ opacity: 0, y: 4 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className="mt-3 pt-2 border-t border-dashed border-neutral-300"
              >
                <div className="flex items-center gap-1 text-[9px] text-neutral-600">
                  <MapPin className="size-2.5 shrink-0" />
                  <span className="truncate">{order.location} · {order.eta} ETA</span>
                </div>
                <div className="mt-2 text-center">
                  <motion.div
                    initial={{ scale: 0.6, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ type: "spring", stiffness: 220, damping: 16 }}
                  >
                    <CheckCircle2 className="size-4 mx-auto" />
                    <p className="text-[9px] font-bold mt-0.5">Confirmed by Callen</p>
                  </motion.div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Torn bottom edge */}
        <div
          className="absolute -bottom-1.5 left-0 right-0 h-3"
          style={{
            backgroundImage: "radial-gradient(circle at 6px 6px, transparent 4px, white 4px)",
            backgroundSize: "12px 12px",
          }}
        />
      </motion.div>
    </div>
  );
}
