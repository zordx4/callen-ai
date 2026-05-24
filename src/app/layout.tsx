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
  // Default tab title + template so child pages can set their own title
  // and have "Callen.ai" appended automatically.
  title: {
    default: "Callen.ai · AI voice agents for every business call",
    template: "%s · Callen.ai",
  },
  description:
    "Callen.ai is the multilingual AI voice agent platform for Pakistani businesses. Handle customer calls in Urdu and English, 24/7. Built on Twilio, Whisper, GPT-4o, and ElevenLabs.",
  metadataBase: new URL("https://callen.ai"),
  // app/icon.svg is auto-picked up by Next.js; declaring it here as well
  // gives older browsers an explicit hint.
  icons: {
    icon: "/icon.svg",
    shortcut: "/icon.svg",
  },
  openGraph: {
    title: "Callen.ai · AI voice agents for every business call",
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
      <head>
        {/* Warm the connection to the brand logo CDNs so integration logos
            paint without a cold handshake on first visit. */}
        <link rel="preconnect" href="https://cdn.simpleicons.org" crossOrigin="anonymous" />
        <link rel="preconnect" href="https://www.google.com" crossOrigin="anonymous" />
        <link rel="dns-prefetch" href="https://t2.gstatic.com" />
      </head>
      <body className="min-h-screen bg-background text-foreground antialiased">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
