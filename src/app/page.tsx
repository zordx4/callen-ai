// Callen.ai marketing landing page.
// ElevenLabs-inspired: cream background, massive bold typography, bento grid,
// black primary CTAs, subtle motion. This is the public front door.

"use client";

import Link from "next/link";
import { motion } from "motion/react";
import { ArrowRight, Phone, Languages, Sparkles, BarChart3, Webhook, ShieldCheck, Clock, Zap } from "lucide-react";
import { Logo } from "@/components/logo";
import { Waveform } from "@/components/waveform";
import { Button } from "@/components/ui/button";

const fadeUp = {
  initial: { opacity: 0, y: 24 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.6, ease: [0.2, 0.65, 0.3, 0.9] as [number, number, number, number] },
};

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-cream text-foreground">
      {/* ============ NAV ============ */}
      <header className="sticky top-0 z-50 backdrop-blur-md bg-cream/80 border-b border-border/40">
        <nav className="max-w-7xl mx-auto px-6 lg:px-8 h-16 flex items-center justify-between">
          <Link href="/" className="text-foreground hover:opacity-80 transition-opacity">
            <Logo />
          </Link>
          <div className="hidden md:flex items-center gap-8 text-sm font-medium">
            <a href="#product" className="text-muted-foreground hover:text-foreground transition-colors">Product</a>
            <a href="#features" className="text-muted-foreground hover:text-foreground transition-colors">Features</a>
            <a href="#how" className="text-muted-foreground hover:text-foreground transition-colors">How it works</a>
            <a href="#pricing" className="text-muted-foreground hover:text-foreground transition-colors">Pricing</a>
          </div>
          <div className="flex items-center gap-2">
            <Link
              href="/login"
              className="text-sm font-medium px-3 py-2 text-muted-foreground hover:text-foreground transition-colors"
            >
              Sign in
            </Link>
            <Link
              href="/login"
              className="text-sm font-medium px-4 py-2 rounded-full bg-foreground text-background hover:opacity-90 transition-opacity"
            >
              Get started
            </Link>
          </div>
        </nav>
      </header>

      {/* ============ HERO ============ */}
      <section className="relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-6 lg:px-8 pt-20 pb-32 lg:pt-32 lg:pb-40 text-center">
          {/* Announcement pill */}
          <motion.div {...fadeUp}>
            <Link
              href="#features"
              className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-foreground/5 border border-border/60 text-xs font-medium text-muted-foreground hover:bg-foreground/10 transition-colors mb-8"
            >
              <span className="size-1.5 rounded-full bg-emerald-500 animate-pulse" />
              Now serving Urdu + English calls in real time
              <ArrowRight className="size-3" />
            </Link>
          </motion.div>

          {/* Headline */}
          <motion.h1
            {...fadeUp}
            transition={{ ...fadeUp.transition, delay: 0.1 }}
            className="text-display-2xl font-bold mb-6 max-w-5xl mx-auto"
          >
            Voice AI for{" "}
            <span className="text-gradient-callen">every business call.</span>
          </motion.h1>

          {/* Subhead */}
          <motion.p
            {...fadeUp}
            transition={{ ...fadeUp.transition, delay: 0.2 }}
            className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-10 leading-relaxed"
          >
            Callen.ai handles your customer phone calls in Urdu and English, 24/7. Built for Pakistani businesses
            who can&apos;t hire a full-time receptionist — but deserve to sound like they did.
          </motion.p>

          {/* CTAs */}
          <motion.div
            {...fadeUp}
            transition={{ ...fadeUp.transition, delay: 0.3 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-3 mb-16"
          >
            <Link
              href="/login"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-foreground text-background text-sm font-semibold hover:opacity-90 transition-opacity"
            >
              Try the demo
              <ArrowRight className="size-4" />
            </Link>
            <a
              href="#how"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-background border border-border text-sm font-semibold hover:bg-foreground/5 transition-colors"
            >
              See how it works
            </a>
          </motion.div>

          {/* Waveform visual */}
          <motion.div
            {...fadeUp}
            transition={{ ...fadeUp.transition, delay: 0.4 }}
            className="max-w-3xl mx-auto"
          >
            <div className="relative rounded-3xl bg-foreground p-8 lg:p-12 overflow-hidden">
              <div className="absolute inset-0 bg-gradient-callen opacity-30 blur-3xl" />
              <div className="relative">
                <Waveform bars={64} maxHeight={120} gradient barWidth={4} intensity={2} className="mb-6" />
                <p className="text-center text-background/80 text-sm font-mono">
                  &quot;Salam, Karachi Bites mein khush amdeed. Aap ka order kya hoga?&quot;
                </p>
              </div>
            </div>
          </motion.div>

          {/* Decorative gradient blob */}
          <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gradient-callen rounded-full blur-[120px] opacity-15 -z-10" />
        </div>
      </section>

      {/* ============ SOCIAL PROOF / STATS ============ */}
      <section className="border-y border-border/60 bg-background py-12">
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
              viewport={{ once: true }}
              className="inline-block text-sm font-medium text-muted-foreground uppercase tracking-wider mb-3"
            >
              What Callen handles
            </motion.span>
            <motion.h2
              {...fadeUp}
              transition={{ ...fadeUp.transition, delay: 0.1 }}
              viewport={{ once: true }}
              className="text-display-lg mb-4"
            >
              Every part of a phone call,{" "}
              <span className="text-gradient-callen">automated.</span>
            </motion.h2>
          </div>

          {/* Bento grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 lg:gap-5">
            {/* Big card — multilingual */}
            <motion.div
              {...fadeUp}
              viewport={{ once: true }}
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

            {/* 24/7 */}
            <motion.div
              {...fadeUp}
              transition={{ ...fadeUp.transition, delay: 0.05 }}
              viewport={{ once: true }}
              className="bg-card rounded-3xl p-7 border border-border/60"
            >
              <div className="size-10 rounded-xl bg-foreground/5 flex items-center justify-center mb-4">
                <Clock className="size-5" />
              </div>
              <h3 className="text-xl font-bold mb-2 tracking-tight">Answers 24/7</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Never miss a call again — not at midnight, not on Eid, not when you&apos;re asleep.
              </p>
            </motion.div>

            {/* RAG */}
            <motion.div
              {...fadeUp}
              transition={{ ...fadeUp.transition, delay: 0.1 }}
              viewport={{ once: true }}
              className="bg-card rounded-3xl p-7 border border-border/60"
            >
              <div className="size-10 rounded-xl bg-foreground/5 flex items-center justify-center mb-4">
                <Sparkles className="size-5" />
              </div>
              <h3 className="text-xl font-bold mb-2 tracking-tight">Knows your business</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Upload your menu, FAQs, or policies. Callen grounds every answer in your own knowledge base.
              </p>
            </motion.div>

            {/* Takes action */}
            <motion.div
              {...fadeUp}
              transition={{ ...fadeUp.transition, delay: 0.15 }}
              viewport={{ once: true }}
              className="bg-card rounded-3xl p-7 border border-border/60"
            >
              <div className="size-10 rounded-xl bg-foreground/5 flex items-center justify-center mb-4">
                <Webhook className="size-5" />
              </div>
              <h3 className="text-xl font-bold mb-2 tracking-tight">Takes action</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Books appointments, places orders, checks delivery status — by calling your existing APIs.
              </p>
            </motion.div>

            {/* Analytics */}
            <motion.div
              {...fadeUp}
              transition={{ ...fadeUp.transition, delay: 0.2 }}
              viewport={{ once: true }}
              className="bg-card rounded-3xl p-7 border border-border/60"
            >
              <div className="size-10 rounded-xl bg-foreground/5 flex items-center justify-center mb-4">
                <BarChart3 className="size-5" />
              </div>
              <h3 className="text-xl font-bold mb-2 tracking-tight">Every call analyzed</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Transcripts, sentiment, intents, escalation rate. See what your customers really want.
              </p>
            </motion.div>

            {/* Live console */}
            <motion.div
              {...fadeUp}
              transition={{ ...fadeUp.transition, delay: 0.25 }}
              viewport={{ once: true }}
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
            ].map((s, i) => (
              <motion.div
                key={s.step}
                {...fadeUp}
                transition={{ ...fadeUp.transition, delay: i * 0.1 }}
                viewport={{ once: true }}
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
            viewport={{ once: true }}
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
