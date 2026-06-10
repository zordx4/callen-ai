// Branded 404. Replaces the default Next.js black screen with the
// Callen.ai white-minimal system: big display type, italic accent,
// pill CTAs back to safety.

import Link from "next/link";
import type { Metadata } from "next";
import { ArrowRight } from "lucide-react";
import { Logo } from "@/components/logo";

export const metadata: Metadata = {
  title: "Page not found",
};

export default function NotFound() {
  return (
    <div className="min-h-screen bg-white text-neutral-950 flex flex-col">
      <header className="h-16 flex items-center px-6 lg:px-8 max-w-7xl mx-auto w-full">
        <Link href="/" className="text-neutral-950">
          <Logo />
        </Link>
      </header>

      <main className="flex-1 flex items-center justify-center px-6">
        <div className="text-center max-w-xl">
          <p className="text-xs uppercase tracking-[0.2em] text-neutral-500 mb-6 font-medium">
            Error 404
          </p>
          <h1 className="text-6xl md:text-8xl font-bold tracking-[-0.04em] leading-[0.95] mb-6">
            Wrong <span className="italic font-light">number.</span>
          </h1>
          <p className="text-lg text-neutral-600 leading-relaxed mb-10">
            This page does not exist, or it moved without forwarding its calls.
            Let&apos;s get you back to something real.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
            <Link
              href="/"
              className="inline-flex items-center gap-2 px-6 py-3.5 rounded-full bg-neutral-950 text-white text-sm font-semibold hover:bg-neutral-800 transition-colors"
            >
              Back to home
              <ArrowRight className="size-4" />
            </Link>
            <Link
              href="/contact"
              className="inline-flex items-center gap-2 px-6 py-3.5 rounded-full bg-white border border-neutral-300 text-neutral-950 text-sm font-semibold hover:bg-neutral-50 transition-colors"
            >
              Contact us
            </Link>
          </div>
        </div>
      </main>

      <footer className="py-8 text-center text-xs text-neutral-400">
        Callen.ai · AI voice agents for every business call
      </footer>
    </div>
  );
}
