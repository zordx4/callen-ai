// Callen.ai marketing landing page — mirroring elevenlabs.io/agents structure.
// Pure white minimalism, bold display typography, aggressive whitespace, pill buttons.

"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { motion } from "motion/react";
import {
  ArrowRight, Check, ChevronRight, ShieldCheck, Globe, Zap, Phone,
  Sparkles, Webhook, BarChart3, MessageCircle, Lock, Users, FileCheck,
} from "lucide-react";
import {
  Accordion, AccordionContent, AccordionItem, AccordionTrigger,
} from "@/components/ui/accordion";
import { Logo } from "@/components/logo";
import { CountUp } from "@/components/count-up";
import { LogoMarquee } from "@/components/logo-marquee";
import { LiveTranscriptDemo } from "@/components/live-transcript-demo";
import { AgentStudioMockup } from "@/components/mockups/agent-studio-mockup";
import { ChatInterfaceMockup } from "@/components/mockups/chat-interface-mockup";
import { PhoneMockup } from "@/components/mockups/phone-mockup";
import { CalendarMockup } from "@/components/mockups/calendar-mockup";
import { cn } from "@/lib/utils";

const fadeUp = {
  initial: { opacity: 0, y: 20 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: "-80px" },
  transition: { duration: 0.6, ease: [0.2, 0.65, 0.3, 0.9] as [number, number, number, number] },
};

export default function LandingPage() {
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <div className="bg-white text-neutral-950 selection:bg-neutral-950 selection:text-white">
      {/* ============================ NAV ============================ */}
      <header
        className={cn(
          "fixed top-0 left-0 right-0 z-50 transition-all duration-300",
          scrolled ? "bg-white/90 backdrop-blur-md border-b border-neutral-200/60" : "bg-transparent"
        )}
      >
        <nav className="max-w-7xl mx-auto px-6 lg:px-8 h-16 flex items-center justify-between">
          <Link href="/" className="text-neutral-950">
            <Logo />
          </Link>
          <div className="hidden md:flex items-center gap-7 text-sm font-medium text-neutral-600">
            <a href="#product" className="hover:text-neutral-950 transition-colors">Product</a>
            <a href="#usecases" className="hover:text-neutral-950 transition-colors">Use cases</a>
            <a href="#integrations" className="hover:text-neutral-950 transition-colors">Integrations</a>
            <a href="#pricing" className="hover:text-neutral-950 transition-colors">Pricing</a>
            <a href="#" className="hover:text-neutral-950 transition-colors">Docs</a>
          </div>
          <div className="flex items-center gap-1">
            <Link
              href="/login"
              className="text-sm font-medium px-3 py-2 text-neutral-700 hover:text-neutral-950 transition-colors"
            >
              Log in
            </Link>
            <Link
              href="/login"
              className="text-sm font-semibold px-4 py-2 rounded-full bg-white border border-neutral-200 hover:border-neutral-400 hover:bg-neutral-50 transition-all"
            >
              Sign up
            </Link>
          </div>
        </nav>
      </header>

      {/* ============================ HERO ============================ */}
      <section className="pt-32 pb-20 lg:pt-44 lg:pb-28">
        <div className="max-w-5xl mx-auto px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-neutral-100 border border-neutral-200 mb-8 text-xs font-medium text-neutral-700"
          >
            <span className="size-1.5 rounded-full bg-emerald-500" />
            Now in private beta — Urdu + English voice agents
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.05 }}
            className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-bold tracking-[-0.04em] leading-[0.95] mb-7"
          >
            AI voice agents
            <br />
            for every <span className="italic font-light">business call.</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.15 }}
            className="text-lg md:text-xl text-neutral-600 max-w-2xl mx-auto leading-relaxed mb-10"
          >
            Deploy natural, human-sounding agents that handle customer calls in Urdu and English. Low latency.
            Voice and chat. Live in 10 minutes.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.25 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-3 mb-16"
          >
            <Link
              href="/login"
              className="inline-flex items-center gap-2 px-6 py-3.5 rounded-full bg-neutral-950 text-white text-sm font-semibold hover:bg-neutral-800 transition-colors"
            >
              Create your agent
              <ArrowRight className="size-4" />
            </Link>
            <Link
              href="#contact"
              className="inline-flex items-center gap-2 px-6 py-3.5 rounded-full bg-white border border-neutral-300 text-neutral-950 text-sm font-semibold hover:bg-neutral-50 transition-colors"
            >
              Talk to sales
            </Link>
          </motion.div>

          {/* Floating live demo card */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4, ease: [0.2, 0.65, 0.3, 0.9] }}
            className="max-w-md mx-auto relative"
          >
            {/* Decorative blur halo */}
            <div className="absolute -inset-x-12 -inset-y-8 bg-gradient-to-br from-indigo-300/20 via-fuchsia-200/20 to-pink-200/20 rounded-[3rem] blur-3xl -z-10" />
            <LiveTranscriptDemo />
          </motion.div>
        </div>
      </section>

      {/* ============================ STAT BAND (animated count-up) ============================ */}
      <section className="py-12 border-y border-neutral-200">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-y-8 gap-x-4 text-center md:text-left">
            <div>
              <div className="text-3xl md:text-4xl font-bold tracking-tight">
                <CountUp to={50000} format={(n) => Math.round(n).toLocaleString()} />
                <span className="text-neutral-400">+</span>
              </div>
              <div className="text-sm text-neutral-600 mt-1">Calls handled this month</div>
            </div>
            <div>
              <div className="text-3xl md:text-4xl font-bold tracking-tight">
                <span className="text-neutral-400">&lt;</span>
                <CountUp to={800} duration={1.4} />
                <span className="text-neutral-500 text-2xl ml-0.5">ms</span>
              </div>
              <div className="text-sm text-neutral-600 mt-1">Avg first-token latency</div>
            </div>
            <div>
              <div className="text-3xl md:text-4xl font-bold tracking-tight">
                <CountUp to={12} duration={1.2} />
              </div>
              <div className="text-sm text-neutral-600 mt-1">Languages supported</div>
            </div>
            <div>
              <div className="text-3xl md:text-4xl font-bold tracking-tight">
                <CountUp to={99.9} duration={1.8} decimals={1} />
                <span className="text-neutral-400">%</span>
              </div>
              <div className="text-sm text-neutral-600 mt-1">Uptime since launch</div>
            </div>
          </div>
        </div>
      </section>

      {/* ============================ CUSTOMER LOGOS ============================ */}
      <section className="py-16 lg:py-20">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <p className="text-center text-xs uppercase tracking-[0.2em] text-neutral-500 mb-10 font-medium">
            Powering customer calls for businesses across Pakistan
          </p>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-6 lg:gap-10 items-center">
            {["Karachi Bites", "Lahore Smile", "Islamabad Tech", "Pak Realty", "Sehat First", "DastakPK"].map((name) => (
              <div
                key={name}
                className="text-center text-neutral-400 hover:text-neutral-700 transition-colors font-semibold text-base tracking-tight"
              >
                {name}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ============================ WHAT IS — COMPARISON ============================ */}
      <section id="product" className="py-24 lg:py-32 bg-neutral-50 border-y border-neutral-200">
        <div className="max-w-6xl mx-auto px-6 lg:px-8">
          <div className="text-center mb-16 max-w-3xl mx-auto">
            <motion.span {...fadeUp} className="inline-block text-xs uppercase tracking-[0.2em] text-neutral-500 mb-4 font-medium">
              What is voice AI
            </motion.span>
            <motion.h2 {...fadeUp} className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-[-0.03em] leading-[1.05] mb-5">
              Beyond press-1-for-English.
            </motion.h2>
            <motion.p {...fadeUp} className="text-lg text-neutral-600 leading-relaxed">
              Traditional IVR is a maze. Modern voice AI is a conversation. Callen understands what callers say,
              decides what to do, takes action, and remembers context — in Urdu or English, instantly.
            </motion.p>
          </div>

          <div className="grid md:grid-cols-2 gap-5 lg:gap-6">
            {/* Legacy */}
            <motion.div {...fadeUp} className="bg-white rounded-3xl p-8 lg:p-10 border border-neutral-200">
              <span className="inline-block text-xs uppercase tracking-widest text-neutral-500 mb-4 font-semibold">Legacy IVR</span>
              <h3 className="text-2xl font-bold mb-6 tracking-tight">Rigid menus. Frustrated callers.</h3>
              <ul className="space-y-3">
                {[
                  "\"Press 1 for English, 2 for Urdu\" before any conversation",
                  "Trees of pre-recorded prompts that never quite fit",
                  "Calls drop out of hours — no human, no answer",
                  "Adding a new option needs a developer ticket",
                  "Zero analytics on what callers actually wanted",
                ].map((t) => (
                  <li key={t} className="flex gap-2.5 text-neutral-600 text-[15px] leading-relaxed">
                    <span className="text-neutral-400 shrink-0 mt-1">—</span>
                    <span>{t}</span>
                  </li>
                ))}
              </ul>
            </motion.div>

            {/* Modern */}
            <motion.div {...fadeUp} className="bg-neutral-950 text-white rounded-3xl p-8 lg:p-10 relative overflow-hidden">
              <div className="absolute -top-24 -right-24 w-64 h-64 bg-gradient-to-br from-indigo-500/30 via-fuchsia-500/30 to-pink-500/30 rounded-full blur-3xl" />
              <div className="relative">
                <span className="inline-block text-xs uppercase tracking-widest text-white/60 mb-4 font-semibold">Callen.ai</span>
                <h3 className="text-2xl font-bold mb-6 tracking-tight">Natural conversation. Real outcomes.</h3>
                <ul className="space-y-3">
                  {[
                    "Detects Urdu or English in the first sentence, no menus",
                    "Understands intent — \"order kar do\", \"appointment chahiye\", or anything in between",
                    "Available 24/7, scales to 1000+ concurrent calls",
                    "Update behaviour by editing plain text, not code",
                    "Every call transcribed, analyzed, searchable",
                  ].map((t) => (
                    <li key={t} className="flex gap-2.5 text-white/80 text-[15px] leading-relaxed">
                      <Check className="size-4 shrink-0 mt-1 text-emerald-400" />
                      <span>{t}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ============================ FEATURE: WORKFLOW (with Agent Studio mockup) ============================ */}
      <section className="py-24 lg:py-32">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
            {/* Left: copy */}
            <motion.div {...fadeUp}>
              <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-[-0.03em] leading-[1.05] mb-7">
                Design workflows with{" "}
                <span className="italic font-light">strict guardrails</span> and track results
                with in-depth analytics
              </h2>
              <div className="space-y-6 max-w-md">
                <div>
                  <h3 className="text-base font-semibold mb-2 tracking-tight">Build multi-step flows</h3>
                  <p className="text-neutral-600 leading-relaxed text-[15px]">
                    Design conversation flows using intuitive visual tools. Combine scripted steps with dynamic
                    agents, customise behaviour at each stage, and define exactly how your AI responds across
                    voice and chat.
                  </p>
                </div>
                <div>
                  <h3 className="text-base font-semibold mb-2 tracking-tight text-neutral-400">Test guardrails</h3>
                  <p className="text-neutral-400 leading-relaxed text-[15px]">
                    Simulate edge cases before deploying. Validate that every branch hits your safety and
                    compliance standards.
                  </p>
                </div>
              </div>
            </motion.div>

            {/* Right: mockup */}
            <motion.div {...fadeUp} transition={{ ...fadeUp.transition, delay: 0.1 }}>
              <AgentStudioMockup />
            </motion.div>
          </div>
        </div>
      </section>

      {/* ============================ FEATURE: MULTIMODAL (with chat interface mockup) ============================ */}
      <section className="py-24 lg:py-32 bg-neutral-50 border-y border-neutral-200">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
            {/* Left: mockup */}
            <motion.div {...fadeUp} className="order-2 lg:order-1">
              <ChatInterfaceMockup />
            </motion.div>

            {/* Right: copy */}
            <motion.div {...fadeUp} transition={{ ...fadeUp.transition, delay: 0.1 }} className="order-1 lg:order-2">
              <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-[-0.03em] leading-[1.05] mb-7">
                AI agents that speak,{" "}
                <span className="italic font-light">read, and listen</span> — across voice and chat.
              </h2>
              <div className="space-y-6 max-w-md">
                <div>
                  <h3 className="text-base font-semibold mb-2 tracking-tight">Multimodal by design</h3>
                  <p className="text-neutral-600 leading-relaxed text-[15px]">
                    Agents understand spoken or written inputs, retrieve the right answers, and respond
                    naturally in real time. They listen, read, and interact just like a human would.
                  </p>
                </div>
                <div>
                  <h3 className="text-base font-semibold mb-2 tracking-tight">Take action with external tool calls</h3>
                  <p className="text-neutral-600 leading-relaxed text-[15px]">
                    Book appointments, place orders, check delivery status — by calling your existing APIs
                    through the Model Context Protocol.
                  </p>
                </div>
                <div>
                  <h3 className="text-base font-semibold mb-2 tracking-tight text-neutral-400">Deploy anywhere</h3>
                  <p className="text-neutral-400 leading-relaxed text-[15px]">
                    Voice (Twilio), WhatsApp, web widget, mobile SDK. Same agent everywhere.
                  </p>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ============================ 3-STEP — BUILD IN 5 MIN ============================ */}
      <section className="py-24 lg:py-32">
        <div className="max-w-6xl mx-auto px-6 lg:px-8">
          <div className="text-center mb-16 max-w-3xl mx-auto">
            <motion.span {...fadeUp} className="inline-block text-xs uppercase tracking-[0.2em] text-neutral-500 mb-4 font-medium">
              From signup to first call
            </motion.span>
            <motion.h2 {...fadeUp} className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-[-0.03em] leading-[1.05] mb-5">
              Build your first agent in 5 minutes.
            </motion.h2>
          </div>

          <div className="grid md:grid-cols-3 gap-5 lg:gap-6">
            {[
              { n: "01", title: "Describe your business", body: "Paste your business name and a one-line description. Agent Studio drafts the prompt, voice, and greeting for you." },
              { n: "02", title: "Upload your knowledge", body: "Drag in your menu, FAQs, policies. We chunk, embed, and index everything for instant retrieval during calls." },
              { n: "03", title: "Connect your phone number", body: "Use a free Twilio number or port your existing one. Calls forward to Callen in under 60 seconds." },
            ].map((s, i) => (
              <motion.div
                key={s.n}
                {...fadeUp}
                transition={{ ...fadeUp.transition, delay: i * 0.08 }}
                className="card-lift rounded-3xl border border-neutral-200 p-8 hover:border-neutral-400"
              >
                <div className="text-4xl font-bold tabular-nums text-neutral-300 mb-6 tracking-tight">{s.n}</div>
                <h3 className="text-xl font-bold mb-2.5 tracking-tight">{s.title}</h3>
                <p className="text-neutral-600 leading-relaxed text-[15px]">{s.body}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ============================ USE CASES GRID ============================ */}
      <section id="usecases" className="py-24 lg:py-32 bg-neutral-50 border-y border-neutral-200">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="text-center mb-16 max-w-3xl mx-auto">
            <motion.span {...fadeUp} className="inline-block text-xs uppercase tracking-[0.2em] text-neutral-500 mb-4 font-medium">
              Use cases
            </motion.span>
            <motion.h2 {...fadeUp} className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-[-0.03em] leading-[1.05] mb-5">
              One agent. Every kind of call.
            </motion.h2>
          </div>

          {/* Top row: 4 visual hero cards */}
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-5 mb-5">
            {/* Customer Support - phone mockup */}
            <motion.div
              {...fadeUp}
              className="card-lift bg-neutral-100 rounded-3xl border border-neutral-200 hover:border-neutral-400 overflow-hidden p-5 pb-7 group"
            >
              <div className="aspect-[3/4] overflow-hidden -mx-5 -mt-5 mb-5 relative">
                <PhoneMockup label="Support" timer="00:23" gradient="from-rose-300 via-orange-300 to-amber-300" />
              </div>
              <h3 className="text-sm font-semibold tracking-tight mb-1">Customer Support</h3>
              <p className="text-xs text-neutral-600 leading-relaxed">
                Always-on, empathetic voice agents that resolve issues instantly, reduce wait times, and boost satisfaction.
              </p>
            </motion.div>

            {/* Inbound Scheduling - calendar mockup */}
            <motion.div
              {...fadeUp}
              transition={{ ...fadeUp.transition, delay: 0.05 }}
              className="card-lift bg-neutral-100 rounded-3xl border border-neutral-200 hover:border-neutral-400 overflow-hidden p-5 pb-7 group"
            >
              <div className="aspect-[3/4] overflow-hidden -mx-5 -mt-5 mb-5 relative">
                <CalendarMockup />
              </div>
              <h3 className="text-sm font-semibold tracking-tight mb-1">Inbound Scheduling</h3>
              <p className="text-xs text-neutral-600 leading-relaxed">
                Automated through voice agents that coordinate calendars and handle booking requests 24/7.
              </p>
            </motion.div>

            {/* Restaurants - phone with order */}
            <motion.div
              {...fadeUp}
              transition={{ ...fadeUp.transition, delay: 0.1 }}
              className="card-lift bg-neutral-100 rounded-3xl border border-neutral-200 hover:border-neutral-400 overflow-hidden p-5 pb-7 group"
            >
              <div className="aspect-[3/4] overflow-hidden -mx-5 -mt-5 mb-5 relative">
                <PhoneMockup label="Order" timer="01:12" gradient="from-emerald-300 via-teal-300 to-cyan-400" />
              </div>
              <h3 className="text-sm font-semibold tracking-tight mb-1">Restaurants & Delivery</h3>
              <p className="text-xs text-neutral-600 leading-relaxed">
                Take orders, answer menu questions, and confirm delivery details — in Urdu or English.
              </p>
            </motion.div>

            {/* Healthcare - phone */}
            <motion.div
              {...fadeUp}
              transition={{ ...fadeUp.transition, delay: 0.15 }}
              className="card-lift bg-neutral-100 rounded-3xl border border-neutral-200 hover:border-neutral-400 overflow-hidden p-5 pb-7 group"
            >
              <div className="aspect-[3/4] overflow-hidden -mx-5 -mt-5 mb-5 relative">
                <PhoneMockup label="Clinic" timer="00:48" gradient="from-violet-300 via-fuchsia-300 to-pink-300" />
              </div>
              <h3 className="text-sm font-semibold tracking-tight mb-1">Healthcare & Clinics</h3>
              <p className="text-xs text-neutral-600 leading-relaxed">
                Book appointments, answer common patient questions, route urgent calls to staff.
              </p>
            </motion.div>
          </div>

          {/* Bottom row: 3 quote-style cards */}
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-5">
            {[
              { cat: "Real estate", caller: "I want to view the Phase 6 listing.", agent: "Sure! Tomorrow 4 PM or Sunday 11 AM — which works?" },
              { cat: "Law firms", caller: "I need to schedule a consultation.", agent: "Of course. Could you briefly tell me what matter this is regarding?" },
              { cat: "E-commerce", caller: "Mera order kahan hai?", agent: "Order TRX-7821 is out for delivery — reaches you in 30 minutes." },
            ].map((u, i) => (
              <motion.div
                key={u.cat}
                {...fadeUp}
                transition={{ ...fadeUp.transition, delay: i * 0.05 }}
                className="card-lift bg-white rounded-3xl border border-neutral-200 p-7 hover:border-neutral-400 group"
              >
                <div className="flex items-center justify-between mb-5">
                  <span className="text-xs uppercase tracking-widest text-neutral-500 font-semibold">{u.cat}</span>
                  <ChevronRight className="size-4 text-neutral-400 group-hover:text-neutral-700 group-hover:translate-x-0.5 transition-all" />
                </div>
                <div className="space-y-2.5 text-[15px]">
                  <div className="flex gap-2">
                    <span className="text-neutral-400 font-mono text-xs uppercase shrink-0 mt-0.5">caller</span>
                    <span className="text-neutral-700">{u.caller}</span>
                  </div>
                  <div className="flex gap-2">
                    <span className="text-indigo-600 font-mono text-xs uppercase shrink-0 mt-0.5">agent</span>
                    <span className="text-neutral-950 font-medium">{u.agent}</span>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ============================ FEATURE CARDS (emotionally aware) ============================ */}
      <section className="py-24 lg:py-32">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="mb-16 max-w-3xl">
            <motion.span {...fadeUp} className="inline-block text-xs uppercase tracking-[0.2em] text-neutral-500 mb-4 font-medium">
              Built for production
            </motion.span>
            <motion.h2 {...fadeUp} className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-[-0.03em] leading-[1.05]">
              Emotionally and contextually aware voice AI.
            </motion.h2>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {[
              { icon: Users, title: "White-glove onboarding", body: "Our team helps configure your agent, ingest your knowledge, and validate quality before you go live." },
              { icon: FileCheck, title: "Custom workflows", body: "Describe procedures in plain English. The agent follows them. No code, no flow-charts." },
              { icon: BarChart3, title: "Improve over time", body: "Analyze every call, A/B test prompts, correct behaviour with one-line edits." },
              { icon: Lock, title: "Safety-first AI", body: "Compliance guardrails, consent flows, audit logs, and per-tenant data isolation." },
            ].map((f) => (
              <motion.div
                key={f.title}
                {...fadeUp}
                className="card-lift rounded-3xl border border-neutral-200 p-7 hover:border-neutral-400"
              >
                <div className="size-10 rounded-xl bg-neutral-100 flex items-center justify-center mb-5">
                  <f.icon className="size-5" />
                </div>
                <h3 className="text-lg font-bold mb-2 tracking-tight">{f.title}</h3>
                <p className="text-neutral-600 leading-relaxed text-sm">{f.body}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ============================ THREE HIGHLIGHTS ============================ */}
      <section className="py-24 lg:py-32 bg-neutral-950 text-white">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="grid md:grid-cols-3 gap-8 lg:gap-16">
            {[
              { icon: Zap, big: "<800ms", title: "Sub-second responsiveness", body: "Streaming STT + streaming TTS. The conversation flows like talking to a human." },
              { icon: MessageCircle, big: "10,000+", title: "Voices to choose from", body: "ElevenLabs voice library. Pick a brand voice, or clone yours." },
              { icon: Globe, big: "12", title: "Languages, seamlessly", body: "Urdu, English, Punjabi, Sindhi, Pashto, Hindi, Arabic, and more. Switches mid-sentence." },
            ].map((h, i) => (
              <motion.div
                key={h.title}
                {...fadeUp}
                transition={{ ...fadeUp.transition, delay: i * 0.08 }}
              >
                <h.icon className="size-7 mb-6 text-white/60" />
                <div className="text-5xl lg:text-6xl font-bold tracking-tight mb-3 tabular-nums">{h.big}</div>
                <h3 className="text-xl font-bold mb-2 tracking-tight">{h.title}</h3>
                <p className="text-white/60 leading-relaxed text-[15px]">{h.body}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ============================ INTEGRATIONS ============================ */}
      <section id="integrations" className="py-24 lg:py-32">
        <div className="max-w-6xl mx-auto px-6 lg:px-8 mb-16">
          <div className="text-center max-w-3xl mx-auto">
            <motion.span {...fadeUp} className="inline-block text-xs uppercase tracking-[0.2em] text-neutral-500 mb-4 font-medium">
              Integrations
            </motion.span>
            <motion.h2 {...fadeUp} className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-[-0.03em] leading-[1.05] mb-5">
              Plugs into the tools you already use.
            </motion.h2>
            <motion.p {...fadeUp} className="text-lg text-neutral-600 leading-relaxed">
              Connect your CRM, calendar, payment processor, and telephony provider. Or use our API to build custom workflows.
            </motion.p>
          </div>
        </div>

        {/* Auto-scrolling logo marquee */}
        <LogoMarquee />

        {/* Static grid (kept below for searchability + hover) */}
        <motion.div
          {...fadeUp}
          className="max-w-6xl mx-auto px-6 lg:px-8 mt-16 grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-3 lg:gap-4"
        >
          {[
            "Twilio", "OpenAI", "ElevenLabs", "Whisper", "Google AI", "Anthropic",
            "Cal.com", "HubSpot", "Salesforce", "Stripe", "WhatsApp", "Zendesk",
          ].map((name) => (
            <div
              key={name}
              className="card-lift aspect-[3/2] rounded-2xl border border-neutral-200 hover:border-neutral-400 hover:bg-neutral-50 flex items-center justify-center text-sm font-semibold text-neutral-700"
            >
              {name}
            </div>
          ))}
        </motion.div>
      </section>

      {/* ============================ ENTERPRISE SECURITY ============================ */}
      <section className="py-24 lg:py-32 bg-neutral-50 border-y border-neutral-200">
        <div className="max-w-6xl mx-auto px-6 lg:px-8 grid md:grid-cols-2 gap-12 lg:gap-20 items-center">
          <motion.div {...fadeUp}>
            <span className="inline-block text-xs uppercase tracking-[0.2em] text-neutral-500 mb-4 font-medium">
              Enterprise ready
            </span>
            <h2 className="text-4xl md:text-5xl font-bold tracking-[-0.03em] leading-[1.05] mb-5">
              Security and compliance, baked in.
            </h2>
            <p className="text-lg text-neutral-600 leading-relaxed mb-8">
              Per-tenant data isolation, encrypted recordings, consent management, audit logs.
              Built to pass procurement at any business — startup or enterprise.
            </p>
            <Link
              href="#"
              className="inline-flex items-center gap-2 text-sm font-semibold text-neutral-950 hover:gap-3 transition-all"
            >
              Read the trust report <ArrowRight className="size-4" />
            </Link>
          </motion.div>

          <motion.div {...fadeUp} className="grid grid-cols-2 gap-3">
            {[
              { icon: ShieldCheck, label: "SOC 2", sub: "(in progress)" },
              { icon: Lock, label: "GDPR", sub: "Data residency" },
              { icon: FileCheck, label: "Consent flows", sub: "Per-jurisdiction" },
              { icon: BarChart3, label: "Audit logs", sub: "Every action" },
            ].map((c) => (
              <div key={c.label} className="rounded-2xl bg-white border border-neutral-200 p-5">
                <c.icon className="size-5 mb-3" />
                <div className="font-semibold tracking-tight">{c.label}</div>
                <div className="text-xs text-neutral-500 mt-0.5">{c.sub}</div>
              </div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ============================ GETTING STARTED (2 paths) ============================ */}
      <section id="pricing" className="py-24 lg:py-32">
        <div className="max-w-6xl mx-auto px-6 lg:px-8">
          <div className="text-center mb-14 max-w-3xl mx-auto">
            <motion.span {...fadeUp} className="inline-block text-xs uppercase tracking-[0.2em] text-neutral-500 mb-4 font-medium">
              Getting started
            </motion.span>
            <motion.h2 {...fadeUp} className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-[-0.03em] leading-[1.05] mb-5">
              Two ways to ship.
            </motion.h2>
          </div>

          <div className="grid md:grid-cols-2 gap-5 lg:gap-6">
            <motion.div
              {...fadeUp}
              className="rounded-3xl border border-neutral-200 p-8 lg:p-10 hover:border-neutral-400 transition-colors"
            >
              <span className="inline-block text-xs uppercase tracking-widest text-neutral-500 mb-5 font-semibold">No-code</span>
              <h3 className="text-2xl lg:text-3xl font-bold mb-4 tracking-tight">Use the platform</h3>
              <p className="text-neutral-600 leading-relaxed mb-7">
                Sign up, configure an agent in Agent Studio, upload your knowledge, get a phone number. Live in
                under 10 minutes. No engineer required.
              </p>
              <Link
                href="/login"
                className="inline-flex items-center gap-2 px-5 py-3 rounded-full bg-neutral-950 text-white text-sm font-semibold hover:bg-neutral-800 transition-colors"
              >
                Create your agent <ArrowRight className="size-4" />
              </Link>
            </motion.div>

            <motion.div
              {...fadeUp}
              className="rounded-3xl bg-neutral-950 text-white p-8 lg:p-10 relative overflow-hidden"
            >
              <div className="absolute -top-24 -right-24 w-64 h-64 bg-gradient-to-br from-indigo-500/30 via-fuchsia-500/30 to-pink-500/30 rounded-full blur-3xl" />
              <div className="relative">
                <span className="inline-block text-xs uppercase tracking-widest text-white/60 mb-5 font-semibold">For developers</span>
                <h3 className="text-2xl lg:text-3xl font-bold mb-4 tracking-tight">Use the API</h3>
                <p className="text-white/70 leading-relaxed mb-7">
                  Build custom workflows with our REST and WebSocket APIs. SDKs for Node, Python, Go.
                  Stream transcripts and trigger tool calls in your own backend.
                </p>
                <Link
                  href="#"
                  className="inline-flex items-center gap-2 px-5 py-3 rounded-full bg-white text-neutral-950 text-sm font-semibold hover:bg-white/90 transition-colors"
                >
                  Read the docs <ArrowRight className="size-4" />
                </Link>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ============================ FAQ ============================ */}
      <section className="py-24 lg:py-32 bg-neutral-50 border-y border-neutral-200">
        <div className="max-w-3xl mx-auto px-6 lg:px-8">
          <div className="text-center mb-12">
            <motion.span {...fadeUp} className="inline-block text-xs uppercase tracking-[0.2em] text-neutral-500 mb-4 font-medium">
              FAQ
            </motion.span>
            <motion.h2 {...fadeUp} className="text-4xl md:text-5xl font-bold tracking-[-0.03em] leading-[1.05]">
              Common questions.
            </motion.h2>
          </div>

          <Accordion type="single" collapsible className="w-full">
            {[
              {
                q: "What is Callen.ai?",
                a: "Callen.ai is a multilingual AI voice agent platform for businesses. Customers call your number; an AI agent answers, holds a natural conversation in Urdu or English, takes actions in your business systems, and logs everything. Built specifically for the Pakistani SMB market.",
              },
              {
                q: "How does Callen handle Urdu calls?",
                a: "Urdu speech is transcribed by Whisper large-v3 (best-in-class for Urdu accuracy). Language is auto-detected in the first sentence. The LLM understands and responds in the detected language. ElevenLabs synthesises natural Urdu output with the voice you choose.",
              },
              {
                q: "What's the difference between Callen and a regular IVR?",
                a: "IVR is decision-tree menus (press 1, press 2). Callen is open conversation. Callers say what they want in their own words, the agent understands intent and context, and either resolves the request or escalates to a human.",
              },
              {
                q: "How long does setup take?",
                a: "Under 10 minutes for a basic agent. Describe your business, upload your menu/FAQs/policies, get a Twilio number, point your line at it. Going from zero to first call typically takes 5 to 15 minutes depending on how much knowledge base content you upload.",
              },
              {
                q: "Can I bring my own phone number?",
                a: "Yes. Either get a new Twilio number through Callen, or port your existing number, or set up call-forwarding from any number you control. Callen works with any provider that supports SIP or PSTN forwarding.",
              },
              {
                q: "Is there an API for developers?",
                a: "Yes. REST endpoints for configuration, knowledge base ingestion, and analytics. WebSocket streams for real-time transcript and tool-call events. SDKs for Node, Python, and Go are coming Q2 2026.",
              },
              {
                q: "What does it cost?",
                a: "Free demo with 30 minutes of call time. Paid plans start at PKR 12,000/month for the Pro tier (5,000 minutes/month, 1 tenant, basic analytics). Enterprise pricing is custom. Talk to sales for a quote.",
              },
            ].map((item, i) => (
              <AccordionItem
                key={i}
                value={`item-${i}`}
                className="border-b border-neutral-200 last:border-0"
              >
                <AccordionTrigger className="text-left text-base lg:text-lg font-semibold py-5 hover:no-underline">
                  {item.q}
                </AccordionTrigger>
                <AccordionContent className="text-neutral-600 leading-relaxed text-[15px] pb-5">
                  {item.a}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </section>

      {/* ============================ FINAL CTA ============================ */}
      <section className="py-28 lg:py-36" id="contact">
        <div className="max-w-4xl mx-auto px-6 lg:px-8 text-center">
          <motion.h2 {...fadeUp} className="text-5xl md:text-6xl lg:text-7xl font-bold tracking-[-0.04em] leading-[0.95] mb-6">
            Stop missing calls.<br />Start serving customers.
          </motion.h2>
          <motion.p {...fadeUp} className="text-lg text-neutral-600 max-w-xl mx-auto mb-10 leading-relaxed">
            Free demo. No credit card. Configure your first agent in 10 minutes and hear it speak your language.
          </motion.p>
          <motion.div {...fadeUp} className="flex flex-col sm:flex-row items-center justify-center gap-3">
            <Link
              href="/login"
              className="inline-flex items-center gap-2 px-6 py-3.5 rounded-full bg-neutral-950 text-white text-sm font-semibold hover:bg-neutral-800 transition-colors"
            >
              Try Callen.ai free <ArrowRight className="size-4" />
            </Link>
            <Link
              href="#contact"
              className="inline-flex items-center gap-2 px-6 py-3.5 rounded-full bg-white border border-neutral-300 text-neutral-950 text-sm font-semibold hover:bg-neutral-50 transition-colors"
            >
              Talk to sales
            </Link>
          </motion.div>
        </div>
      </section>

      {/* ============================ FOOTER ============================ */}
      <footer className="border-t border-neutral-200 py-16">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-5 gap-8 lg:gap-12 mb-12">
            <div className="col-span-2">
              <Logo />
              <p className="text-sm text-neutral-600 mt-4 max-w-xs leading-relaxed">
                Multilingual AI voice agents for Pakistani businesses. Voice and chat. Live in 10 minutes.
              </p>
            </div>
            {[
              { title: "Product", links: ["Use cases", "Integrations", "Pricing", "Changelog"] },
              { title: "Developers", links: ["API docs", "SDKs", "MCP support", "Status"] },
              { title: "Company", links: ["About", "Trust", "Careers", "Contact"] },
            ].map((col) => (
              <div key={col.title}>
                <h4 className="text-sm font-semibold mb-4 tracking-tight">{col.title}</h4>
                <ul className="space-y-2.5">
                  {col.links.map((l) => (
                    <li key={l}>
                      <a href="#" className="text-sm text-neutral-600 hover:text-neutral-950 transition-colors">{l}</a>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
          <div className="pt-8 border-t border-neutral-200 flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-neutral-500">
            <p>© 2026 Callen.ai — Built for Pakistani SMBs.</p>
            <div className="flex items-center gap-5">
              <a href="#" className="hover:text-neutral-950 transition-colors">Privacy</a>
              <a href="#" className="hover:text-neutral-950 transition-colors">Terms</a>
              <a href="#" className="hover:text-neutral-950 transition-colors">Cookies</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
