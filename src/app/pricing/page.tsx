// /pricing — three-tier pricing card matrix tuned for Pakistani SMBs.

import Link from "next/link";
import { Check, ArrowRight, Phone } from "lucide-react";
import {
  MarketingShell,
  MarketingHero,
  MarketingSection,
} from "@/components/marketing/marketing-shell";

export const metadata = {
  title: "Pricing · Callen.ai",
  description:
    "Pakistani SMB pricing for Callen.ai. Starter free, Pro at PKR 12,000/month, Enterprise custom. Pay in PKR, no card needed to start.",
};

type Tier = {
  id: "starter" | "pro" | "enterprise";
  name: string;
  price: string;
  priceLabel: string;
  description: string;
  features: string[];
  cta: string;
  ctaHref: string;
  featured?: boolean;
};

const TIERS: Tier[] = [
  {
    id: "starter",
    name: "Starter",
    price: "Free",
    priceLabel: "30 mins included",
    description: "Spin up an agent in 10 minutes. Perfect for solo founders and demos.",
    features: [
      "1 agent",
      "30 minutes of call time",
      "Urdu + English",
      "1 phone number (shared Twilio pool)",
      "Knowledge base up to 5 MB",
      "Email support",
    ],
    cta: "Start free",
    ctaHref: "/signup",
  },
  {
    id: "pro",
    name: "Pro",
    price: "PKR 12,000",
    priceLabel: "per month",
    description: "For real Pakistani SMBs taking calls every day.",
    features: [
      "5 agents",
      "5,000 minutes / month",
      "Urdu, English, Punjabi, Sindhi, Pashto",
      "Dedicated +92 phone number",
      "Knowledge base up to 500 MB",
      "MCP tools + CRM webhooks",
      "Call recordings, transcripts, analytics",
      "Priority WhatsApp + email support",
    ],
    cta: "Start 14-day trial",
    ctaHref: "/signup",
    featured: true,
  },
  {
    id: "enterprise",
    name: "Enterprise",
    price: "Custom",
    priceLabel: "annual contract",
    description: "Multi-tenant, multi-vertical, audit-ready.",
    features: [
      "Unlimited agents",
      "Custom minute pool",
      "All 12 languages",
      "Multiple +92 numbers and SIP trunk",
      "Per-tenant data isolation",
      "SOC 2 + custom DPA",
      "SSO via SAML / OIDC",
      "Onboarding engineer + 4-hour SLA",
    ],
    cta: "Talk to sales",
    ctaHref: "/contact",
  },
];

const FAQS: Array<{ q: string; a: string }> = [
  {
    q: "What currencies do you accept?",
    a: "PKR primary, billed via Stripe with the conversion locked at the start of each month. Enterprise contracts can pay in USD on annual terms.",
  },
  {
    q: "What happens if I go over my minute pool?",
    a: "Overage at PKR 3 per minute for Starter and Pro. No surprise bills: we email at 80% and ask before charging.",
  },
  {
    q: "Can I bring my own phone number?",
    a: "Yes. Port any +92 landline or mobile to Callen, or set up call-forwarding from any provider that supports SIP or PSTN forwarding.",
  },
  {
    q: "Is there a long-term contract?",
    a: "Starter and Pro are monthly. Cancel any time. Enterprise is an annual contract.",
  },
];

export default function PricingPage() {
  return (
    <MarketingShell>
      <MarketingHero
        eyebrow="Pricing"
        title={
          <>
            Simple PKR pricing.{" "}
            <span className="italic font-light">Built for Pakistan.</span>
          </>
        }
        lede="Pay in rupees, not dollars. Start free, upgrade when your call volume justifies it. No card required to begin."
      />

      <MarketingSection>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-5 lg:gap-6">
          {TIERS.map((tier) => (
            <div
              key={tier.id}
              className={
                tier.featured
                  ? "rounded-3xl bg-neutral-950 text-white p-8 lg:p-10 relative overflow-hidden"
                  : "rounded-3xl border border-neutral-200 p-8 lg:p-10"
              }
            >
              {tier.featured && (
                <div className="absolute -top-24 -right-24 w-64 h-64 bg-gradient-to-br from-neutral-100/15 via-neutral-50/15 to-white/20 rounded-full blur-3xl" />
              )}
              <div className="relative">
                <div className="flex items-center justify-between mb-5">
                  <h3 className="text-xl font-bold tracking-tight">{tier.name}</h3>
                  {tier.featured && (
                    <span className="inline-flex items-center px-2 py-0.5 rounded-full bg-white text-neutral-950 text-[10px] font-semibold uppercase tracking-wider">
                      Most popular
                    </span>
                  )}
                </div>
                <div className="mb-6">
                  <p
                    className={
                      tier.featured
                        ? "text-4xl font-bold tracking-tight"
                        : "text-4xl font-bold tracking-tight"
                    }
                  >
                    {tier.price}
                  </p>
                  <p
                    className={
                      tier.featured
                        ? "text-xs uppercase tracking-widest text-white/60 mt-1"
                        : "text-xs uppercase tracking-widest text-neutral-500 mt-1"
                    }
                  >
                    {tier.priceLabel}
                  </p>
                </div>
                <p
                  className={
                    tier.featured
                      ? "text-[14px] text-white/70 leading-relaxed mb-7"
                      : "text-[14px] text-neutral-600 leading-relaxed mb-7"
                  }
                >
                  {tier.description}
                </p>
                <ul className="space-y-3 mb-8">
                  {tier.features.map((f) => (
                    <li
                      key={f}
                      className={
                        tier.featured
                          ? "flex gap-2.5 text-[14px] text-white/85"
                          : "flex gap-2.5 text-[14px] text-neutral-700"
                      }
                    >
                      <Check
                        className={
                          tier.featured
                            ? "size-4 shrink-0 mt-0.5 text-white/90"
                            : "size-4 shrink-0 mt-0.5 text-neutral-900"
                        }
                      />
                      <span>{f}</span>
                    </li>
                  ))}
                </ul>
                <Link
                  href={tier.ctaHref}
                  className={
                    tier.featured
                      ? "w-full inline-flex items-center justify-center gap-2 px-5 py-3 rounded-full bg-white text-neutral-950 text-sm font-semibold hover:bg-white/90 transition-colors"
                      : "w-full inline-flex items-center justify-center gap-2 px-5 py-3 rounded-full bg-neutral-950 text-white text-sm font-semibold hover:bg-neutral-800 transition-colors"
                  }
                >
                  {tier.cta} <ArrowRight className="size-4" />
                </Link>
              </div>
            </div>
          ))}
        </div>
      </MarketingSection>

      <MarketingSection
        eyebrow="Pricing FAQ"
        title={<>What you&apos;d ask <span className="italic font-light">on a demo call.</span></>}
      >
        <div className="space-y-5">
          {FAQS.map((f) => (
            <div key={f.q} className="rounded-2xl border border-neutral-200 p-6">
              <h4 className="text-base font-semibold tracking-tight mb-2">{f.q}</h4>
              <p className="text-[14.5px] text-neutral-600 leading-relaxed">{f.a}</p>
            </div>
          ))}
        </div>
      </MarketingSection>

      <MarketingSection>
        <div className="rounded-3xl bg-neutral-950 text-white p-10 lg:p-14 text-center">
          <Phone className="size-7 mx-auto mb-4 text-white/70" />
          <h2 className="text-3xl md:text-4xl font-bold tracking-tight mb-3">
            Still working out the math?
          </h2>
          <p className="text-white/70 leading-relaxed mb-7 max-w-xl mx-auto">
            We&apos;ll size a plan to your monthly call volume and target latency, in Pakistani Rupees, in under fifteen minutes.
          </p>
          <Link
            href="/contact"
            className="inline-flex items-center gap-2 px-5 py-3 rounded-full bg-white text-neutral-950 text-sm font-semibold hover:bg-white/90 transition-colors"
          >
            Talk to sales <ArrowRight className="size-4" />
          </Link>
        </div>
      </MarketingSection>
    </MarketingShell>
  );
}
