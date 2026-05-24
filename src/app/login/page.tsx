"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { motion } from "motion/react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { api } from "@/lib/mock-api";
import { useAppStore } from "@/lib/store";
import { toast } from "sonner";
import { Loader2, ArrowLeft, ArrowRight } from "lucide-react";
import { Logo } from "@/components/logo";

export default function LoginPage() {
  const router = useRouter();
  const setUser = useAppStore((s) => s.setUser);
  const [email, setEmail] = useState("talha@karachibites.pk");
  const [password, setPassword] = useState("demo");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    try {
      const { user } = await api.login(email, password);
      setUser(user);
      toast.success(`Welcome back, ${user.name.split(" ")[0]}`);
      router.push("/dashboard");
    } catch (err) {
      toast.error((err as Error).message);
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-white grid lg:grid-cols-2">
      {/* === Left: brand panel === */}
      <div className="hidden lg:flex relative overflow-hidden bg-neutral-950 text-white flex-col justify-between p-12">
        {/* Subtle grid */}
        <div
          className="absolute inset-0 opacity-[0.06]"
          style={{
            backgroundImage:
              "linear-gradient(to right, #fff 1px, transparent 1px), linear-gradient(to bottom, #fff 1px, transparent 1px)",
            backgroundSize: "40px 40px",
          }}
        />

        {/* Top: logo + back */}
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

        {/* Center pitch */}
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

        {/* Stats */}
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
          {/* Mobile logo */}
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
                onChange={(e) => setEmail(e.target.value)}
                required
                autoComplete="email"
                className="h-11 bg-white border-neutral-300"
              />
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="password" className="text-sm font-medium">Password</Label>
                <button type="button" className="text-xs text-neutral-500 hover:text-neutral-900 transition-colors">
                  Forgot password?
                </button>
              </div>
              <Input
                id="password"
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                autoComplete="current-password"
                className="h-11 bg-white border-neutral-300"
              />
            </div>

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

          <div className="mt-6 pt-6 border-t border-neutral-200 text-center">
            <p className="text-xs text-neutral-500">
              Demo mode. Credentials are pre-filled, just click{" "}
              <span className="font-semibold text-neutral-900">Sign in</span>.
            </p>
          </div>

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
