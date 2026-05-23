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
import { Loader2, ArrowLeft } from "lucide-react";
import { Logo } from "@/components/logo";
import { Waveform } from "@/components/waveform";

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
      toast.success(`Welcome back, ${user.name.split(" ")[0]}!`);
      router.push("/dashboard");
    } catch (err) {
      toast.error((err as Error).message);
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-cream grid lg:grid-cols-2">
      {/* === Left: gradient/visual side === */}
      <div className="hidden lg:flex relative overflow-hidden bg-foreground text-background flex-col justify-between p-12">
        <div className="absolute inset-0 bg-gradient-callen opacity-30 blur-3xl" />

        {/* Top: back to home + logo */}
        <div className="relative z-10 flex items-center justify-between">
          <Link href="/" className="text-background hover:opacity-80 transition-opacity">
            <Logo />
          </Link>
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-sm text-background/70 hover:text-background transition-colors"
          >
            <ArrowLeft className="size-4" /> Back to home
          </Link>
        </div>

        {/* Middle: pitch + waveform */}
        <div className="relative z-10 max-w-lg">
          <motion.h1
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-display-xl mb-6"
          >
            Voice AI that speaks{" "}
            <span className="text-gradient-callen">your language.</span>
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-background/70 text-lg leading-relaxed mb-10"
          >
            Handle every customer call in Urdu and English. 24/7. Without hiring.
          </motion.p>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="rounded-2xl bg-background/5 border border-background/10 backdrop-blur-sm p-6"
          >
            <Waveform bars={56} maxHeight={64} gradient barWidth={3} intensity={2} className="mb-4" />
            <p className="text-xs text-background/60 font-mono text-center">
              Live call · Urdu detected · 94% confidence
            </p>
          </motion.div>
        </div>

        {/* Bottom: footer */}
        <div className="relative z-10 text-xs text-background/50">
          © 2026 Callen.ai — Built for Pakistani SMBs.
        </div>
      </div>

      {/* === Right: form side === */}
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
            <p className="text-muted-foreground">Sign in to manage your AI voice agent.</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
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
                className="h-11 bg-background border-border/80"
              />
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="password" className="text-sm font-medium">Password</Label>
                <button type="button" className="text-xs text-muted-foreground hover:text-foreground transition-colors">
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
                className="h-11 bg-background border-border/80"
              />
            </div>

            <Button type="submit" className="w-full h-11 rounded-full text-sm font-semibold" disabled={loading}>
              {loading ? <><Loader2 className="size-4 mr-2 animate-spin" /> Signing in...</> : "Sign in"}
            </Button>
          </form>

          <div className="mt-6 pt-6 border-t border-border/60">
            <p className="text-xs text-center text-muted-foreground">
              Demo mode — credentials are pre-filled. Just click{" "}
              <span className="font-semibold text-foreground">Sign in</span>.
            </p>
          </div>

          <p className="text-xs text-center text-muted-foreground mt-8">
            New to Callen?{" "}
            <Link href="/" className="text-foreground font-medium hover:underline">
              Learn more
            </Link>
          </p>
        </motion.div>
      </div>
    </div>
  );
}
