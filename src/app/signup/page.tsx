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
import { Loader2, ArrowLeft, ArrowRight, Check } from "lucide-react";
import { Logo } from "@/components/logo";

export default function SignupPage() {
  const router = useRouter();
  const setUser = useAppStore((s) => s.setUser);
  const [name, setName] = useState("");
  const [business, setBusiness] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!name || !business || !email || !password) {
      toast.error("Please fill in all fields");
      return;
    }
    setLoading(true);
    try {
      const { user } = await api.login(email, password);
      setUser({ ...user, name });
      toast.success(`Welcome to Callen.ai, ${name.split(" ")[0]}`);
      router.push("/dashboard");
    } catch (err) {
      toast.error((err as Error).message);
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-white grid lg:grid-cols-2">
      {/* === Left: brand panel with benefits === */}
      <div className="hidden lg:flex relative overflow-hidden bg-neutral-950 text-white flex-col justify-between p-12">
        <div
          className="absolute inset-0 opacity-[0.06]"
          style={{
            backgroundImage:
              "linear-gradient(to right, #fff 1px, transparent 1px), linear-gradient(to bottom, #fff 1px, transparent 1px)",
            backgroundSize: "40px 40px",
          }}
        />

        <div className="relative z-10 flex items-center justify-between">
          <Link href="/" className="text-white hover:opacity-80 transition-opacity">
            <Logo />
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
          By signing up, you agree to our Terms and Privacy Policy.
        </div>
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
                onChange={(e) => setName(e.target.value)}
                required
                autoComplete="name"
                className="h-11 bg-white border-neutral-300"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="business" className="text-sm font-medium">Business name</Label>
              <Input
                id="business"
                placeholder="Karachi Bites Restaurant"
                value={business}
                onChange={(e) => setBusiness(e.target.value)}
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
                onChange={(e) => setEmail(e.target.value)}
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
                onChange={(e) => setPassword(e.target.value)}
                required
                minLength={8}
                autoComplete="new-password"
                className="h-11 bg-white border-neutral-300"
              />
            </div>

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
        </motion.div>
      </div>
    </div>
  );
}
