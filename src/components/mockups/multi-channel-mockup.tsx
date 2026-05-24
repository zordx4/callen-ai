// MultiChannelMockup — shows the same Callen agent across phone, WhatsApp,
// web chat widget, and mobile app simultaneously. Visual metaphor: one brain,
// many surfaces. Pure black/white grayscale.

"use client";

import { motion } from "motion/react";
import { Phone, MessageSquare, Globe2, Smartphone } from "lucide-react";

export function MultiChannelMockup() {
  return (
    <div className="relative rounded-3xl overflow-hidden bg-gradient-to-br from-neutral-50 via-neutral-100 to-neutral-200 border border-neutral-200/80 shadow-2xl shadow-neutral-900/10 aspect-[4/5] p-6">
      {/* Background grid */}
      <div
        className="absolute inset-0 opacity-[0.04]"
        style={{
          backgroundImage:
            "radial-gradient(circle, #000 1px, transparent 1px)",
          backgroundSize: "20px 20px",
        }}
      />

      {/* Central hub: the AGENT */}
      <div className="relative h-full flex items-center justify-center">
        {/* Connecting lines from hub to each channel card (drawn as SVG) */}
        <svg className="absolute inset-0 w-full h-full pointer-events-none" preserveAspectRatio="none">
          <defs>
            <linearGradient id="line-grad" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0%" stopColor="#0a0a0a" stopOpacity="0" />
              <stop offset="50%" stopColor="#0a0a0a" stopOpacity="0.5" />
              <stop offset="100%" stopColor="#0a0a0a" stopOpacity="0" />
            </linearGradient>
          </defs>
          {[
            { x1: "50%", y1: "50%", x2: "15%", y2: "20%" },
            { x1: "50%", y1: "50%", x2: "85%", y2: "20%" },
            { x1: "50%", y1: "50%", x2: "15%", y2: "80%" },
            { x1: "50%", y1: "50%", x2: "85%", y2: "80%" },
          ].map((l, i) => (
            <motion.line
              key={i}
              x1={l.x1}
              y1={l.y1}
              x2={l.x2}
              y2={l.y2}
              stroke="url(#line-grad)"
              strokeWidth="1.2"
              strokeDasharray="4 4"
              initial={{ pathLength: 0, opacity: 0 }}
              whileInView={{ pathLength: 1, opacity: 0.8 }}
              viewport={{ once: true }}
              transition={{ duration: 1.2, delay: 0.3 + i * 0.1 }}
            />
          ))}
        </svg>

        {/* Hub */}
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          whileInView={{ scale: 1, opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="relative z-10 rounded-3xl bg-neutral-950 text-white p-4 shadow-xl shadow-neutral-900/30"
        >
          <div className="relative">
            {/* Pulse rings */}
            <motion.div
              animate={{ scale: [1, 1.8, 1], opacity: [0.6, 0, 0.6] }}
              transition={{ duration: 3, repeat: Infinity, ease: "easeOut" }}
              className="absolute inset-0 rounded-3xl border border-white/20"
            />
            <div className="relative px-2 py-1 text-center min-w-[120px]">
              <p className="text-[10px] uppercase tracking-widest text-white/60 font-semibold mb-0.5">Agent</p>
              <p className="text-base font-bold tracking-tight">Cheezious</p>
              <p className="text-[10px] text-white/70 mt-0.5">Active · UR + EN</p>
            </div>
          </div>
        </motion.div>

        {/* Four channel cards */}
        <ChannelCard
          icon={Phone}
          label="Voice"
          sub="Twilio"
          message="Salam, order karna hai..."
          position="top-[6%] left-[2%]"
          delay={0.4}
        />
        <ChannelCard
          icon={MessageSquare}
          label="WhatsApp"
          sub="Business API"
          message="Hi! Family deal?"
          position="top-[6%] right-[2%]"
          delay={0.5}
        />
        <ChannelCard
          icon={Globe2}
          label="Web chat"
          sub="Embed widget"
          message="What are your hours?"
          position="bottom-[6%] left-[2%]"
          delay={0.6}
        />
        <ChannelCard
          icon={Smartphone}
          label="Mobile SDK"
          sub="iOS · Android"
          message="Track order TRX-7821"
          position="bottom-[6%] right-[2%]"
          delay={0.7}
        />
      </div>
    </div>
  );
}

function ChannelCard({
  icon: Icon,
  label,
  sub,
  message,
  position,
  delay,
}: {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  sub: string;
  message: string;
  position: string;
  delay: number;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay }}
      className={`absolute z-10 rounded-2xl bg-white border border-neutral-200 shadow-lg shadow-neutral-900/5 p-3 w-[42%] ${position}`}
    >
      <div className="flex items-center gap-2 mb-1.5">
        <div className="size-6 rounded-md bg-neutral-100 flex items-center justify-center">
          <Icon className="size-3 text-neutral-700" />
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-[11px] font-semibold tracking-tight leading-tight">{label}</p>
          <p className="text-[9px] text-neutral-500">{sub}</p>
        </div>
      </div>
      <div className="rounded-md bg-neutral-50 border border-neutral-100 px-2 py-1 text-[10px] text-neutral-700 leading-snug">
        {message}
      </div>
    </motion.div>
  );
}
