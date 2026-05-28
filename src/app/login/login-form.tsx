"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { motion, AnimatePresence } from "motion/react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { signIn } from "@/lib/auth-store";
import { toast } from "sonner";
import { Loader2, ArrowLeft, ArrowRight, AlertCircle } from "lucide-react";
import { Logo } from "@/components/logo";
import { DarkPanelMotion } from "@/components/auth/dark-panel-motion";

export function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Pick up errors propagated from /auth/callback (e.g., expired link,
  // missing code). Friendlier than blank-form silence.
  useEffect(() => {
    const fromQuery = searchParams.get("error");
    if (fromQuery) setError(decodeURIComponent(fromQuery));
  }, [searchParams]);

  function clearError() {
    if (error) setError(null);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);
    const result = await signIn(email, password);
    if (!result.ok) {
      setError(result.error);
      toast.error(result.error);
      setLoading(false);
      return;
    }
    toast.success("Signed in.");
    const next = searchParams.get("next");
    router.push(next || "/dashboard");
    // Keep loading true so the button stays disabled during the route
    // transition. The page unmounts shortly after.
  }

  return (
    <div className="min-h-screen bg-white grid lg:grid-cols-2">
      {/* === Left: brand panel === */}
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
            Voice AI built for{" "}
            <span className="italic font-light">your business.</span>
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-white/60 text-lg leading-relaxed"
          >
            Manage agents, monitor calls, and review analytics from one place.
          </motion.p>
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.3 }}
          className="relative z-10 grid grid-cols-3 gap-6 max-w-md"
        >
          {[
            { v: "50k+", l: "Calls this month" },
            { v: "<800ms", l: "Avg latency" },
            { v: "12", l: "Languages" },
          ].map((s) => (
            <div key={s.l}>
              <p className="text-2xl font-bold tracking-tight tabular-nums">{s.v}</p>
              <p className="text-[10px] uppercase tracking-widest text-white/50 mt-0.5">{s.l}</p>
            </div>
          ))}
        </motion.div>
      </div>

      {/* === Right: form === */}
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
            <h2 className="text-3xl font-bold tracking-tight mb-2">Welcome back</h2>
            <p className="text-neutral-600 text-[15px]">Sign in to your Callen.ai workspace.</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email" className="text-sm font-medium">Email</Label>
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
              <div className="flex items-center justify-between">
                <Label htmlFor="password" className="text-sm font-medium">Password</Label>
                <Link
                  href="/forgot-password"
                  className="text-xs text-neutral-500 hover:text-neutral-900 transition-colors"
                >
                  Forgot password?
                </Link>
              </div>
              <Input
                id="password"
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => { setPassword(e.target.value); clearError(); }}
                required
                autoComplete="current-password"
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
                <><Loader2 className="size-4 mr-2 animate-spin" /> Signing in...</>
              ) : (
                <>Sign in <ArrowRight className="size-4 ml-1" /></>
              )}
            </Button>
          </form>

          <p className="text-sm text-center text-neutral-600 mt-8">
            New to Callen?{" "}
            <Link href="/signup" className="text-neutral-900 font-semibold hover:underline">
              Create an account
            </Link>
          </p>
        </motion.div>
      </div>
    </div>
  );
}
