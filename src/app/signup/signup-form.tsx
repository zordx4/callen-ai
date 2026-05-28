"use client";

import { useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "motion/react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { signUp } from "@/lib/auth-store";
import { toast } from "sonner";
import {
  Loader2, ArrowLeft, ArrowRight, Check, AlertCircle, Mail,
} from "lucide-react";
import { Logo } from "@/components/logo";
import { DarkPanelMotion } from "@/components/auth/dark-panel-motion";

export function SignupForm() {
  const [name, setName] = useState("");
  const [business, setBusiness] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [acceptedTerms, setAcceptedTerms] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [submittedEmail, setSubmittedEmail] = useState<string | null>(null);

  function clearError() {
    if (error) setError(null);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    if (!acceptedTerms) {
      const msg = "Please accept the Terms and Privacy Policy to continue.";
      setError(msg);
      toast.error(msg);
      return;
    }
    setLoading(true);
    const result = await signUp({ name, business, email, password });
    if (!result.ok) {
      setError(result.error);
      toast.error(result.error);
      setLoading(false);
      return;
    }
    setSubmittedEmail(email.trim().toLowerCase());
    setLoading(false);
  }

  return (
    <div className="min-h-screen bg-white grid lg:grid-cols-2">
      {/* === Left: brand panel with benefits === */}
      <div className="hidden lg:flex relative overflow-hidden bg-neutral-950 text-white flex-col justify-between p-12">
        <DarkPanelMotion />

        <div className="relative z-10 flex items-center justify-between">
          <Link href="/" className="hover:opacity-80 transition-opacity">
            <Logo inverse />
          </Link>
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-sm text-white/70 hover:text-white transition-colors"
          >
            <ArrowLeft className="size-4" /> Back to home
          </Link>
        </div>

        <div className="relative z-10 max-w-md">
          <motion.h1
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-5xl md:text-6xl font-bold tracking-[-0.03em] leading-[1.02] mb-5"
          >
            Live in{" "}
            <span className="italic font-light">10 minutes.</span>
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-white/60 text-lg leading-relaxed mb-8"
          >
            Configure your first AI voice agent, upload your knowledge base, and start taking calls today.
          </motion.p>

          <motion.ul
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.5 }}
            className="space-y-3"
          >
            {[
              "Free 30 minutes of call time",
              "No credit card required",
              "Urdu + English from day one",
              "Cancel anytime",
            ].map((benefit, i) => (
              <motion.li
                key={benefit}
                initial={{ opacity: 0, x: -8 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.4 + i * 0.06 }}
                className="flex items-center gap-2.5 text-white/80 text-[15px]"
              >
                <div className="size-5 rounded-full bg-white/15 flex items-center justify-center shrink-0">
                  <Check className="size-3" />
                </div>
                {benefit}
              </motion.li>
            ))}
          </motion.ul>
        </div>

        <div className="relative z-10 text-xs text-white/40">
          By signing up, you agree to our{" "}
          <Link href="/terms" className="underline hover:text-white/60">Terms</Link>
          {" "}and{" "}
          <Link href="/privacy" className="underline hover:text-white/60">Privacy Policy</Link>.
        </div>
      </div>

      {/* === Right: form OR check-email confirmation === */}
      <div className="flex items-center justify-center p-6 lg:p-12">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="w-full max-w-sm"
        >
          <div className="lg:hidden flex justify-center mb-8">
            <Logo />
          </div>

          {submittedEmail ? (
            <CheckEmailState email={submittedEmail} onBack={() => setSubmittedEmail(null)} />
          ) : (
            <>
              <div className="mb-8">
                <h2 className="text-3xl font-bold tracking-tight mb-2">Create your account</h2>
                <p className="text-neutral-600 text-[15px]">Start automating customer calls in minutes.</p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="name" className="text-sm font-medium">Your name</Label>
                  <Input
                    id="name"
                    placeholder="Muhammad Talha"
                    value={name}
                    onChange={(e) => { setName(e.target.value); clearError(); }}
                    required
                    autoComplete="name"
                    className="h-11 bg-white border-neutral-300"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="business" className="text-sm font-medium">Business name</Label>
                  <Input
                    id="business"
                    placeholder="Cheezious"
                    value={business}
                    onChange={(e) => { setBusiness(e.target.value); clearError(); }}
                    required
                    autoComplete="organization"
                    className="h-11 bg-white border-neutral-300"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email" className="text-sm font-medium">Work email</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="you@business.pk"
                    value={email}
                    onChange={(e) => { setEmail(e.target.value); clearError(); }}
                    required
                    autoComplete="email"
                    className="h-11 bg-white border-neutral-300"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="password" className="text-sm font-medium">Password</Label>
                  <Input
                    id="password"
                    type="password"
                    placeholder="At least 8 characters"
                    value={password}
                    onChange={(e) => { setPassword(e.target.value); clearError(); }}
                    required
                    minLength={8}
                    autoComplete="new-password"
                    className="h-11 bg-white border-neutral-300"
                  />
                </div>

                <label className="flex items-start gap-2.5 pt-1 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={acceptedTerms}
                    onChange={(e) => { setAcceptedTerms(e.target.checked); clearError(); }}
                    className="mt-0.5 size-4 rounded border-neutral-300 text-neutral-900 focus:ring-neutral-900 cursor-pointer"
                  />
                  <span className="text-[12.5px] text-neutral-600 leading-relaxed">
                    I agree to Callen.ai's{" "}
                    <Link href="/terms" className="text-neutral-900 underline hover:no-underline" target="_blank">
                      Terms of Service
                    </Link>
                    {" "}and{" "}
                    <Link href="/privacy" className="text-neutral-900 underline hover:no-underline" target="_blank">
                      Privacy Policy
                    </Link>
                    .
                  </span>
                </label>

                <AnimatePresence>
                  {error && (
                    <motion.div
                      initial={{ opacity: 0, y: -4 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -4 }}
                      transition={{ duration: 0.2 }}
                      className="flex items-start gap-2 rounded-lg bg-rose-50 border border-rose-200 px-3 py-2.5 text-[13px] text-rose-800"
                    >
                      <AlertCircle className="size-4 mt-0.5 shrink-0 text-rose-600" />
                      <span>{error}</span>
                    </motion.div>
                  )}
                </AnimatePresence>

                <Button
                  type="submit"
                  className="w-full h-11 rounded-full text-sm font-semibold mt-2"
                  disabled={loading}
                >
                  {loading ? (
                    <><Loader2 className="size-4 mr-2 animate-spin" /> Creating account...</>
                  ) : (
                    <>Create account <ArrowRight className="size-4 ml-1" /></>
                  )}
                </Button>
              </form>

              <p className="text-sm text-center text-neutral-600 mt-8">
                Already have an account?{" "}
                <Link href="/login" className="text-neutral-900 font-semibold hover:underline">
                  Sign in
                </Link>
              </p>
            </>
          )}
        </motion.div>
      </div>
    </div>
  );
}

function CheckEmailState({
  email,
  onBack,
}: {
  email: string;
  onBack: () => void;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35 }}
      className="text-center"
    >
      <div className="mx-auto mb-6 size-14 rounded-full bg-neutral-950 text-white flex items-center justify-center">
        <Mail className="size-6" />
      </div>
      <h2 className="text-2xl font-bold tracking-tight mb-2">Check your inbox</h2>
      <p className="text-neutral-600 text-[14.5px] leading-relaxed mb-6">
        We sent a confirmation link to{" "}
        <span className="font-semibold text-neutral-900">{email}</span>.{" "}
        Click it to verify your account, then come back and sign in.
      </p>
      <div className="rounded-xl border border-neutral-200 bg-neutral-50 p-4 text-left mb-6">
        <p className="text-[12px] font-semibold text-neutral-900 mb-1.5 uppercase tracking-wider">
          Can't find the email?
        </p>
        <ul className="text-[12.5px] text-neutral-600 leading-relaxed space-y-1 list-disc pl-4">
          <li>Check your spam or promotions folder.</li>
          <li>The link may take a minute to arrive.</li>
          <li>Make sure {email} is spelled correctly.</li>
        </ul>
      </div>
      <div className="flex flex-col gap-2.5">
        <Link
          href="/login"
          className="inline-flex items-center justify-center h-11 px-4 rounded-full bg-neutral-950 text-white text-sm font-semibold hover:bg-neutral-800 transition-colors"
        >
          Go to sign in
        </Link>
        <button
          onClick={onBack}
          type="button"
          className="text-[13px] text-neutral-500 hover:text-neutral-900 transition-colors"
        >
          Use a different email
        </button>
      </div>
    </motion.div>
  );
}
