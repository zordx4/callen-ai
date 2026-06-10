// Single source of truth for the canonical site origin.
// Swap NEXT_PUBLIC_SITE_URL (Vercel env) to https://callen.ai once the
// domain is purchased; everything downstream (metadataBase, sitemap,
// robots, og images) follows automatically.

export const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL ?? "https://callen-ai-pi.vercel.app";
