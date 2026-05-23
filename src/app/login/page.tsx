// Login page at /login.
// Client Component because it uses useState (form state) and useRouter (redirect on submit).

"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { api } from "@/lib/mock-api";
import { useAppStore } from "@/lib/store";
import { toast } from "sonner";
import { Loader2, Mic } from "lucide-react";

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
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 via-blue-50 to-purple-50 dark:from-slate-950 dark:via-blue-950/30 dark:to-purple-950/30 p-4">
      <div className="w-full max-w-md">
        {/* Brand */}
        <div className="flex flex-col items-center mb-8">
          <div className="size-14 rounded-2xl bg-gradient-to-br from-blue-600 to-purple-600 flex items-center justify-center shadow-lg mb-3">
            <Mic className="size-7 text-white" />
          </div>
          <h1 className="text-2xl font-bold tracking-tight">Sawti</h1>
          <p className="text-sm text-muted-foreground mt-1">Multilingual AI voice agent platform</p>
        </div>

        <Card className="border-border/60 shadow-xl">
          <CardHeader className="pb-3">
            <h2 className="text-xl font-semibold">Sign in to your account</h2>
            <p className="text-sm text-muted-foreground">Manage your AI voice agent and review calls.</p>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="you@business.pk"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  autoComplete="email"
                />
              </div>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="password">Password</Label>
                  <button type="button" className="text-xs text-muted-foreground hover:text-foreground">
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
                />
              </div>
              <Button type="submit" className="w-full" disabled={loading}>
                {loading ? <><Loader2 className="size-4 mr-2 animate-spin" /> Signing in...</> : "Sign in"}
              </Button>
            </form>

            <div className="mt-5 pt-4 border-t border-border/60">
              <p className="text-xs text-muted-foreground text-center">
                Demo mode — credentials are pre-filled. Just click <span className="font-semibold">Sign in</span>.
              </p>
            </div>
          </CardContent>
        </Card>

        <p className="text-xs text-muted-foreground text-center mt-6">
          © 2026 Sawti. Built for Pakistani SMBs.
        </p>
      </div>
    </div>
  );
}
