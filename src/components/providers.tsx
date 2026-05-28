// Client-side providers wrapper. Anything that uses React context (TooltipProvider, ThemeProvider)
// must live in a client component because providers maintain state.
// The root layout (server component) renders this around `children`.

"use client";

import { TooltipProvider } from "@/components/ui/tooltip";
import { Toaster } from "@/components/ui/sonner";
import { ThemeProvider } from "next-themes";
import { AuthListener } from "@/components/auth/auth-listener";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider attribute="class" defaultTheme="light" enableSystem={false}>
      <TooltipProvider delayDuration={150}>
        <AuthListener />
        {children}
        <Toaster position="bottom-right" richColors />
      </TooltipProvider>
    </ThemeProvider>
  );
}
