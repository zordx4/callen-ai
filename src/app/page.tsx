// Callen.ai marketing landing page.
// Top: dark HeroGeometric (ElevenLabs-inspired hero).
// Below: cream sections (social proof, bento features, how it works, CTA, footer).
// Nav: adaptive — transparent/white over dark hero, cream/dark after scroll past hero.

"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { motion } from "motion/react";
import {
  ArrowRight,
  Phone,
  Languages,
  Sparkles,
  BarChart3,
  Webhook,
  ShieldCheck,
  Clock,
  Zap,
} from "lucide-react";
import { Logo } from "@/components/logo";
import { Waveform } from "@/components/waveform";
import { HeroGeometric } from "@/components/ui/shape-landing-hero";
import { cn } from "@/lib/utils";

const fadeUp = {
  initial: { opacity: 0, y: 24 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: "-80px" },
  transition: { duration: 0.6, ease: [0.2, 0.65, 0.3, 0.9] as [number, number, number, number] },
};

export default function LandingPage() {
  // Adaptive nav: dark + white text over hero, cream + dark text after scroll.
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > window.innerHeight * 0.8);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <div className="bg-cream text-foreground">
      {/* ============ ADAPTIVE NAV ============ */}
      <header
        className={cn(
          "fixed top-0 left-0 right-0 z-50 transition-all duration-300",
          scrolled
            ? "bg-cream/80 backdrop-blur-md border-b border-border/40"
            : "bg-transparent"
        )}
      >
        <nav className="max-w-7xl mx-auto px-6 lg:px-8 h-16 flex items-center justify-between">
          <Link
            href="/"
            className={cn(
              "transition-colors",
              scrolled ? "text-foreground" : "text-white"
            )}
          >
            <Logo />
          </Link>
          <div className="hidden md:flex items-center gap-8 text-sm font-medium">
            {["Product", "Features", "How it works", "Pricing"].map((label) => (
              <a
                key={label}
                href={`#${label.toLowerCase().replace(/\s+/g, "-")}`}
                className={cn(
                  "transition-colors",
                  scrolled
                    ? "text-muted-foreground hover:text-foreground"
                    : "text-white/60 hover:text-white"
                )}
              >
                {label}
              </a>
            ))}
          </div>
          <div className="flex items-center gap-2">
            <Link
              href="/login"
              className={cn(
                "text-sm font-medium px-3 py-2 transition-colors",
                scrolled
                  ? "text-muted-foreground hover:text-foreground"
                  : "text-white/70 hover:text-white"
              )}
            >
              Sign in
            </Link>
            <Link
              href="/login"
              className={cn(
                "text-sm font-medium px-4 py-2 rounded-full transition-all",
                scrolled
                  ? "bg-foreground text-background hover:opacity-90"
                  : "bg-white text-foreground hover:opacity-90"
              )}
            >
              Get started
            </Link>
          </div>
        </nav>
      </header>

      {/* ============ DARK HERO (shape-landing-hero) ============ */}
      <HeroGeometric
        badge="Callen.ai · Now in private beta"
        title1="Voice AI for"
        title2="Every Business Call"
        description="Callen.ai handles your customer phone calls in Urdu and English, 24/7. Built for Pakistani businesses who can't hire a full-time receptionist — but deserve to sound like they did."
      >
        <Link
          href="/login"
          className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-white text-[#030303] text-sm font-semibold hover:opacity-90 transition-opacity"
        >
          Try the demo
          <ArrowRight className="size-4" />
        </Link>
        <a
          href="#how"
          className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-white/[0.05] border border-white/[0.12] text-white text-sm font-semibold hover:bg-white/[0.1] transition-colors backdrop-blur"
        >
          See how it works
        </a>
      </HeroGeometric>

      {/* ============ SOCIAL PROOF / STATS ============ */}
      <section className="border-b border-border/60 bg-background py-12">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <p className="text-center text-xs uppercase tracking-widest text-muted-foreground mb-8 font-medium">
            Built on the most reliable voice and AI infrastructure
          </p>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 text-center">
            {[
              { label: "Twilio", desc: "Cloud telephony" },
              { label: "Whisper", desc: "Speech recognition" },
              { label: "GPT-4o", desc: "Conversational AI" },
              { label: "ElevenLabs", desc: "Voice synthesis" },
            ].map((s) => (
              <div key={s.label}>
                <div className="text-xl font-semibold tracking-tight">{s.label}</div>
                <div className="text-xs text-muted-foreground mt-0.5">{s.desc}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ============ BENTO FEATURES ============ */}
      <section id="features" className="py-24 lg:py-32">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="text-center mb-16 max-w-2xl mx-auto">
            <motion.span
              {...fadeUp}
              className="inline-block text-sm font-medium text-muted-foreground uppercase tracking-wider mb-3"
            >
              What Callen handles
            </motion.span>
            <motion.h2 {...fadeUp} className="text-display-lg mb-4">
              Every part of a phone call,{" "}
              <span className="text-gradient-callen">automated.</span>
            </motion.h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 lg:gap-5">
            <motion.div
              {...fadeUp}
              className="md:col-span-2 md:row-span-2 bg-foreground text-background rounded-3xl p-8 lg:p-10 overflow-hidden relative min-h-[400px] flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center gap-2 text-sm font-medium text-background/60 mb-4">
                  <Languages className="size-4" /> Multilingual
                </div>
                <h3 className="text-3xl lg:text-4xl font-bold mb-4 tracking-tight">
                  Speaks Urdu and English.{" "}
                  <span className="text-background/60">Switches mid-sentence.</span>
                </h3>
                <p className="text-background/70 leading-relaxed max-w-md">
                  Auto-detects the caller&apos;s language with fastText, picks the right voice, never breaks the flow.
                  No more &quot;press 1 for English&quot;.
                </p>
              </div>
              <div className="mt-8">
                <Waveform bars={40} maxHeight={48} gradient barWidth={3} intensity={2} />
              </div>
              <div className="absolute -top-20 -right-20 w-80 h-80 bg-gradient-callen rounded-full blur-3xl opacity-40" />
            </motion.div>

            <motion.div {...fadeUp} className="bg-card rounded-3xl p-7 border border-border/60">
              <div className="size-10 rounded-xl bg-foreground/5 flex items-center justify-center mb-4">
                <Clock className="size-5" />
              </div>
              <h3 className="text-xl font-bold mb-2 tracking-tight">Answers 24/7</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Never miss a call again — not at midnight, not on Eid, not when you&apos;re asleep.
              </p>
            </motion.div>

            <motion.div {...fadeUp} className="bg-card rounded-3xl p-7 border border-border/60">
              <div className="size-10 rounded-xl bg-foreground/5 flex items-center justify-center mb-4">
                <Sparkles className="size-5" />
              </div>
              <h3 className="text-xl font-bold mb-2 tracking-tight">Knows your business</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Upload your menu, FAQs, or policies. Callen grounds every answer in your own knowledge base.
              </p>
            </motion.div>

            <motion.div {...fadeUp} className="bg-card rounded-3xl p-7 border border-border/60">
              <div className="size-10 rounded-xl bg-foreground/5 flex items-center justify-center mb-4">
                <Webhook className="size-5" />
              </div>
              <h3 className="text-xl font-bold mb-2 tracking-tight">Takes action</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Books appointments, places orders, checks delivery status — by calling your existing APIs.
              </p>
            </motion.div>

            <motion.div {...fadeUp} className="bg-card rounded-3xl p-7 border border-border/60">
              <div className="size-10 rounded-xl bg-foreground/5 flex items-center justify-center mb-4">
                <BarChart3 className="size-5" />
              </div>
              <h3 className="text-xl font-bold mb-2 tracking-tight">Every call analyzed</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Transcripts, sentiment, intents, escalation rate. See what your customers really want.
              </p>
            </motion.div>

            <motion.div
              {...fadeUp}
              className="md:col-span-2 bg-card rounded-3xl p-8 lg:p-10 border border-border/60 overflow-hidden relative"
            >
              <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground mb-3">
                <span className="size-2 rounded-full bg-emerald-500 animate-pulse" />
                <span className="uppercase tracking-wider text-xs">Live monitoring</span>
              </div>
              <h3 className="text-2xl lg:text-3xl font-bold mb-3 tracking-tight">
                Watch calls happen,{" "}
                <span className="text-muted-foreground">in real time.</span>
              </h3>
              <p className="text-sm text-muted-foreground leading-relaxed max-w-lg mb-6">
                Transcript streams word-by-word. Intent classification fires live. Tool calls show in the log.
                Listen-in to any call without revealing yourself.
              </p>
              <div className="flex items-center gap-2 text-xs font-mono text-muted-foreground border-l-2 border-border pl-3">
                <span className="text-foreground">caller</span>
                <span>·</span>
                <span>Mujhe family deal order karna hai</span>
              </div>
              <div className="flex items-center gap-2 text-xs font-mono text-muted-foreground border-l-2 border-indigo-500 pl-3 mt-1.5">
                <span className="text-indigo-600">agent</span>
                <span>·</span>
                <span>Bilkul! Family Feast 2499 rupees, delivery ya pickup?</span>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ============ HOW IT WORKS ============ */}
      <section id="how" className="py-24 lg:py-32 bg-background border-y border-border/60">
        <div className="max-w-5xl mx-auto px-6 lg:px-8">
          <div className="text-center mb-16">
            <span className="inline-block text-sm font-medium text-muted-foreground uppercase tracking-wider mb-3">
              From signup to first call
            </span>
            <h2 className="text-display-lg">
              Live in <span className="text-gradient-callen">10 minutes.</span>
            </h2>
          </div>

          <div className="space-y-6">
            {[
              {
                step: "01",
                title: "Configure your agent",
                body: "Paste your business description, pick a voice (Urdu or English), set business hours. Agent Studio handles the rest.",
                icon: Phone,
              },
              {
                step: "02",
                title: "Upload your knowledge",
                body: "Drag in your menu, FAQs, policies. Callen ingests, chunks, and embeds them so every answer is grounded in your data.",
                icon: Sparkles,
              },
              {
                step: "03",
                title: "Connect your phone number",
                body: "Get a Twilio number or port your existing one. Calls forward to Callen instantly. You watch the dashboard fill up.",
                icon: Zap,
              },
            ].map((s) => (
              <motion.div
                key={s.step}
                {...fadeUp}
                className="flex flex-col md:flex-row gap-6 md:items-center p-6 lg:p-8 rounded-3xl bg-card border border-border/60"
              >
                <div className="flex items-center gap-4">
                  <span className="text-display-md text-gradient-callen font-bold tabular-nums">{s.step}</span>
                  <div className="size-12 rounded-2xl bg-foreground/5 flex items-center justify-center shrink-0">
                    <s.icon className="size-5" />
                  </div>
                </div>
                <div className="flex-1">
                  <h3 className="text-xl lg:text-2xl font-bold mb-1.5 tracking-tight">{s.title}</h3>
                  <p className="text-muted-foreground leading-relaxed">{s.body}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ============ FINAL CTA ============ */}
      <section className="py-24 lg:py-32">
        <div className="max-w-5xl mx-auto px-6 lg:px-8">
          <motion.div
            {...fadeUp}
            className="relative bg-foreground text-background rounded-3xl p-12 lg:p-20 text-center overflow-hidden"
          >
            <div className="absolute inset-0 bg-gradient-callen opacity-20 blur-3xl" />
            <div className="relative">
              <ShieldCheck className="size-10 mx-auto mb-6 text-background/80" />
              <h2 className="text-display-lg mb-5 max-w-2xl mx-auto">
                Stop missing calls.{" "}
                <span className="text-background/60">Start serving customers.</span>
              </h2>
              <p className="text-background/70 max-w-xl mx-auto mb-8 leading-relaxed">
                Free demo. No credit card. Configure your first agent in under 10 minutes
                and hear it speak your language.
              </p>
              <Link
                href="/login"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-background text-foreground text-sm font-semibold hover:opacity-90 transition-opacity"
              >
                Try Callen.ai free
                <ArrowRight className="size-4" />
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ============ FOOTER ============ */}
      <footer className="border-t border-border/60 py-12">
        <div className="max-w-7xl mx-auto px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between gap-6">
          <Logo />
          <div className="flex items-center gap-6 text-sm text-muted-foreground">
            <a href="#" className="hover:text-foreground transition-colors">Privacy</a>
            <a href="#" className="hover:text-foreground transition-colors">Terms</a>
            <a href="#" className="hover:text-foreground transition-colors">Contact</a>
            <a href="#" className="hover:text-foreground transition-colors">Docs</a>
          </div>
          <p className="text-xs text-muted-foreground">© 2026 Callen.ai — Built for Pakistani SMBs.</p>
        </div>
      </footer>
    </div>
  );
}
