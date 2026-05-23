import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Providers } from "@/components/providers";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
  display: "swap",
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Callen.ai — AI voice agents for every business call",
  description:
    "Callen.ai is the multilingual AI voice agent platform for Pakistani businesses. Handle customer calls in Urdu and English, 24/7. Built on Twilio, Whisper, GPT-4o, and ElevenLabs.",
  metadataBase: new URL("https://callen.ai"),
  openGraph: {
    title: "Callen.ai — AI voice agents for every business call",
    description:
      "Multilingual AI voice agent platform. Urdu + English calls, 24/7, integrated with your business systems.",
    siteName: "Callen.ai",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable}`}
      suppressHydrationWarning
    >
      <body className="min-h-screen bg-background text-foreground antialiased">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
