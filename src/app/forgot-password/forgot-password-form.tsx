"use client";

import { useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "motion/react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { requestPasswordReset } from "@/lib/auth-store";
import { toast } from "sonner";
import {
  Loader2, ArrowLeft, ArrowRight, AlertCircle, Mail,
} from "lucide-react";
import { Logo } from "@/components/logo";
import { DarkPanelMotion } from "@/components/auth/dark-panel-motion";

export function ForgotPasswordForm() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [sent, setSent] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);
    const result = await requestPasswordReset(email);
    if (!result.ok) {
      setError(result.error);
      toast.error(result.error);
      setLoading(false);
      return;
    }
    setSent(true);
    setLoading(false);
  }

  return (
    <div className="min-h-screen bg-white grid lg:grid-cols-2">
      <div className="hidden lg:flex relative overflow-hidden bg-neutral-950 text-white flex-col justify-between p-12">
        <DarkPanelMotion />

        <div className="relative z-10 flex items-center justify-between">
          <Link href="/" className="hover:opacity-80 transition-opacity">
            <Logo inverse />
          </Link>
          <Link
            href="/login"
            className="inline-flex items-center gap-2 text-sm text-white/70 hover:text-white transition-colors"
          >
            <ArrowLeft className="size-4" /> Back to sign in
          </Link>
        </div>

        <div className="relative z-10 max-w-md">
          <motion.h1
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-5xl md:text-6xl font-bold tracking-[-0.03em] leading-[1.02] mb-5"
          >
            Forgot it?{" "}
            <span className="italic font-light">No problem.</span>
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-white/60 text-lg leading-relaxed"
          >
            Enter your email and we'll send a secure link to reset your password.
          </motion.p>
        </div>

        <div className="relative z-10 text-xs text-white/40">
          Reset links expire in 60 minutes for your security.
        </div>
      </div>

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

          {sent ? (
            <SentState email={email} />
          ) : (
            <>
              <div className="mb-8">
                <h2 className="text-3xl font-bold tracking-tight mb-2">Reset password</h2>
                <p className="text-neutral-600 text-[15px]">
                  Enter the email tied to your Callen.ai account.
                </p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="email" className="text-sm font-medium">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="you@business.pk"
                    value={email}
                    onChange={(e) => { setEmail(e.target.value); if (error) setError(null); }}
                    required
                    autoComplete="email"
                    className="h-11 bg-white border-neutral-300"
                  />
                </div>

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
                    <><Loader2 className="size-4 mr-2 animate-spin" /> Sending link...</>
                  ) : (
                    <>Send reset link <ArrowRight className="size-4 ml-1" /></>
                  )}
                </Button>
              </form>

              <p className="text-sm text-center text-neutral-600 mt-8">
                Remembered it?{" "}
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

function SentState({ email }: { email: string }) {
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
        We sent a password reset link to{" "}
        <span className="font-semibold text-neutral-900">{email.trim().toLowerCase()}</span>.{" "}
        Click the link to choose a new password.
      </p>
      <div className="rounded-xl border border-neutral-200 bg-neutral-50 p-4 text-left mb-6">
        <p className="text-[12px] font-semibold text-neutral-900 mb-1.5 uppercase tracking-wider">
          Didn't get it?
        </p>
        <ul className="text-[12.5px] text-neutral-600 leading-relaxed space-y-1 list-disc pl-4">
          <li>Check your spam folder.</li>
          <li>Wait a minute — emails can lag.</li>
          <li>Make sure the email is correct.</li>
        </ul>
      </div>
      <Link
        href="/login"
        className="inline-flex items-center justify-center h-11 px-4 w-full rounded-full bg-neutral-950 text-white text-sm font-semibold hover:bg-neutral-800 transition-colors"
      >
        Back to sign in
      </Link>
    </motion.div>
  );
}
