// /contact is a client component (form state), so its metadata lives here
// in a server layout wrapper.

import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Contact",
  description:
    "Talk to the Callen.ai team. Sales, support, security, and press. We answer every message within one business day.",
};

export default function ContactLayout({ children }: { children: React.ReactNode }) {
  return children;
}
