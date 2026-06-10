// sitemap.xml — every public marketing + auth entry route.

import type { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/site-url";

const ROUTES: Array<{ path: string; priority: number; changeFrequency: "weekly" | "monthly" | "yearly" }> = [
  { path: "/",                priority: 1.0, changeFrequency: "weekly"  },
  { path: "/use-cases",       priority: 0.9, changeFrequency: "monthly" },
  { path: "/pricing",         priority: 0.9, changeFrequency: "monthly" },
  { path: "/changelog",       priority: 0.7, changeFrequency: "weekly"  },
  { path: "/docs/api",        priority: 0.8, changeFrequency: "monthly" },
  { path: "/docs/sdks",       priority: 0.7, changeFrequency: "monthly" },
  { path: "/docs/mcp",        priority: 0.7, changeFrequency: "monthly" },
  { path: "/status",          priority: 0.5, changeFrequency: "weekly"  },
  { path: "/about",           priority: 0.6, changeFrequency: "monthly" },
  { path: "/trust",           priority: 0.6, changeFrequency: "monthly" },
  { path: "/careers",         priority: 0.6, changeFrequency: "monthly" },
  { path: "/contact",         priority: 0.6, changeFrequency: "yearly"  },
  { path: "/privacy",         priority: 0.3, changeFrequency: "yearly"  },
  { path: "/terms",           priority: 0.3, changeFrequency: "yearly"  },
  { path: "/cookies",         priority: 0.3, changeFrequency: "yearly"  },
  { path: "/login",           priority: 0.4, changeFrequency: "yearly"  },
  { path: "/signup",          priority: 0.8, changeFrequency: "yearly"  },
];

export default function sitemap(): MetadataRoute.Sitemap {
  return ROUTES.map(({ path, priority, changeFrequency }) => ({
    url: `${SITE_URL}${path}`,
    lastModified: new Date(),
    changeFrequency,
    priority,
  }));
}
