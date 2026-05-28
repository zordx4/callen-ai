"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { motion, AnimatePresence } from "motion/react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { updatePassword } from "@/lib/auth-store";
import { toast } from "sonner";
import { Loader2, ArrowLeft, ArrowRight, AlertCircle, ShieldCheck } from "lucide-react";
import { Logo } from "@/components/logo";
import { DarkPanelMotion } from "@/components/auth/dark-panel-motion";

export function ResetPasswordForm() {
  const router = useRouter();
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    if (password.length < 8) {
      setError("Password must be at least 8 characters.");
      return;
    }
    if (password !== confirm) {
      setError("Passwords don't match.");
      return;
    }

    setLoading(true);
    const result = await updatePassword(password);
    if (!result.ok) {
      setError(result.error);
      toast.error(result.error);
      setLoading(false);
      return;
    }
    toast.success("Password updated. Welcome back.");
    router.push("/dashboard");
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
            Pick a new{" "}
            <span className="italic font-light">password.</span>
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-white/60 text-lg leading-relaxed"
          >
            Make it strong enough that you'll remember it but no one else could guess.
          </motion.p>
        </div>

        <div className="relative z-10 flex items-center gap-2 text-xs text-white/40">
          <ShieldCheck className="size-3.5" />
          End-to-end encrypted in transit.
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

          <div className="mb-8">
            <h2 className="text-3xl font-bold tracking-tight mb-2">Set a new password</h2>
            <p className="text-neutral-600 text-[15px]">Choose something at least 8 characters long.</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="password" className="text-sm font-medium">New password</Label>
              <Input
                id="password"
                type="password"
                placeholder="At least 8 characters"
                value={password}
                onChange={(e) => { setPassword(e.target.value); if (error) setError(null); }}
                required
                minLength={8}
                autoComplete="new-password"
                className="h-11 bg-white border-neutral-300"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="confirm" className="text-sm font-medium">Confirm new password</Label>
              <Input
                id="confirm"
                type="password"
                placeholder="Type it again"
                value={confirm}
                onChange={(e) => { setConfirm(e.target.value); if (error) setError(null); }}
                required
                minLength={8}
                autoComplete="new-password"
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
                <><Loader2 className="size-4 mr-2 animate-spin" /> Saving...</>
              ) : (
                <>Update password <ArrowRight className="size-4 ml-1" /></>
              )}
            </Button>
          </form>

          <p className="text-sm text-center text-neutral-600 mt-8">
            Changed your mind?{" "}
            <Link href="/login" className="text-neutral-900 font-semibold hover:underline">
              Back to sign in
            </Link>
          </p>
        </motion.div>
      </div>
    </div>
  );
}
