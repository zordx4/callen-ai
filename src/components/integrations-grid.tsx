"use client";

import { motion } from "motion/react";
import { useRef, useState, type MouseEvent } from "react";
import {
  Phone, Sparkles, Mic, Headphones, Brain, Bot,
  Calendar, Workflow, Building2, CreditCard, MessageCircle, MessagesSquare,
} from "lucide-react";

type Integration = {
  name: string;
  icon: typeof Phone;
  category: string;
};

const INTEGRATIONS: Integration[] = [
  { name: "Twilio",      icon: Phone,           category: "Telephony" },
  { name: "OpenAI",      icon: Sparkles,        category: "LLM" },
  { name: "ElevenLabs",  icon: Mic,             category: "Voice TTS" },
  { name: "Whisper",     icon: Headphones,      category: "Speech to text" },
  { name: "Google AI",   icon: Brain,           category: "LLM" },
  { name: "Anthropic",   icon: Bot,             category: "LLM" },
  { name: "Cal.com",     icon: Calendar,        category: "Scheduling" },
  { name: "HubSpot",     icon: Workflow,        category: "CRM" },
  { name: "Salesforce",  icon: Building2,       category: "CRM" },
  { name: "Stripe",      icon: CreditCard,      category: "Payments" },
  { name: "WhatsApp",    icon: MessageCircle,   category: "Channel" },
  { name: "Zendesk",     icon: MessagesSquare,  category: "Support desk" },
];

export function IntegrationsGrid() {
  const ref = useRef<HTMLDivElement>(null);
  const [pos, setPos] = useState({ x: 0, y: 0, visible: false });

  const handleMove = (e: MouseEvent<HTMLDivElement>) => {
    const rect = ref.current?.getBoundingClientRect();
    if (!rect) return;
    setPos({ x: e.clientX - rect.left, y: e.clientY - rect.top, visible: true });
  };

  const handleLeave = () => setPos((p) => ({ ...p, visible: false }));

  return (
    <div
      ref={ref}
      onMouseMove={handleMove}
      onMouseLeave={handleLeave}
      className="relative max-w-6xl mx-auto px-6 lg:px-8"
    >
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 rounded-3xl transition-opacity duration-300"
        style={{
          opacity: pos.visible ? 1 : 0,
          background: `radial-gradient(420px circle at ${pos.x}px ${pos.y}px, rgba(10,10,10,0.07), transparent 70%)`,
        }}
      />

      <div className="relative grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 lg:gap-4">
        {INTEGRATIONS.map((item, i) => (
          <motion.div
            key={item.name}
            initial={{ opacity: 0, y: 14 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.45, delay: i * 0.04, ease: [0.2, 0.65, 0.3, 0.9] }}
            whileHover={{ y: -3 }}
            className="group relative rounded-2xl border border-neutral-200 bg-white px-5 py-6 transition-colors duration-300 hover:border-neutral-900"
          >
            <div className="flex items-center gap-3">
              <div className="size-9 rounded-xl bg-neutral-100 group-hover:bg-neutral-950 transition-colors duration-300 flex items-center justify-center shrink-0">
                <item.icon className="size-4 text-neutral-700 group-hover:text-white transition-colors duration-300" />
              </div>
              <div className="min-w-0">
                <div className="text-sm font-semibold tracking-tight text-neutral-950 truncate">{item.name}</div>
                <div className="text-[11px] text-neutral-500 mt-0.5 truncate uppercase tracking-wider">{item.category}</div>
              </div>
            </div>

            <div className="absolute top-3 right-3 size-1.5 rounded-full bg-neutral-300 group-hover:bg-neutral-950 transition-colors duration-300" />
          </motion.div>
        ))}
      </div>
    </div>
  );
}
