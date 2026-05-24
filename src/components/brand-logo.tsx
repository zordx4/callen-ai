// BrandLogo — renders the avatar tile for an integration provider.
// Three render paths, picked in order:
//   1. logoSlug present -> fetch the SVG from cdn.simpleicons.org on a white
//      tile. SimpleIcons is CC0 and serves icons via that CDN as its intended
//      distribution pattern.
//   2. brandColor + monogram present -> a brand-colour tile with the
//      monogram in white (or brandText) on top. Used for Pakistan-specific
//      brands that SimpleIcons does not carry.
//   3. avatar gradient present -> the legacy gradient fallback (also covers
//      user-added custom MCP servers).

"use client";

import { Server } from "lucide-react";
import { cn } from "@/lib/utils";
import { gradientCssForId } from "@/lib/avatar-gradients";
import type { IntegrationProvider } from "@/lib/workspace-store";

type Size = "sm" | "md" | "lg";

const SIZE_MAP: Record<Size, { tile: number; icon: number; text: string }> = {
  sm: { tile: 24, icon: 14, text: "text-[9px]" },
  md: { tile: 32, icon: 18, text: "text-[10px]" },
  lg: { tile: 40, icon: 22, text: "text-[12px]" },
};

export function BrandLogo({
  provider,
  size = "md",
  className,
  isCustom,
}: {
  provider: Pick<
    IntegrationProvider,
    | "id"
    | "name"
    | "logoSlug"
    | "logoColor"
    | "brandColor"
    | "brandText"
    | "monogram"
    | "avatar"
  >;
  size?: Size;
  className?: string;
  isCustom?: boolean;
}) {
  const dims = SIZE_MAP[size];
  const tileCls = cn(
    "rounded-md shrink-0 ring-1 ring-black/5 overflow-hidden relative flex items-center justify-center",
    className
  );

  // Custom MCP server: generic icon
  if (isCustom) {
    return (
      <span
        className={cn(tileCls, "bg-neutral-100")}
        style={{ width: dims.tile, height: dims.tile }}
      >
        <Server className="text-neutral-600" style={{ width: dims.icon, height: dims.icon }} />
      </span>
    );
  }

  // 1) SimpleIcons-hosted brand
  if (provider.logoSlug) {
    const color = provider.logoColor ?? "111111";
    const src = `https://cdn.simpleicons.org/${provider.logoSlug}/${color}`;
    return (
      <span
        className={cn(tileCls, "bg-white")}
        style={{ width: dims.tile, height: dims.tile }}
      >
        {/* Using a plain img tag, not next/image, because SimpleIcons serves
            tiny SVGs that don't benefit from Next image optimisation. */}
        <img
          src={src}
          alt={provider.name}
          width={dims.icon}
          height={dims.icon}
          loading="lazy"
          referrerPolicy="no-referrer"
          className="block"
          style={{ width: dims.icon, height: dims.icon }}
        />
      </span>
    );
  }

  // 2) Brand-coloured monogram tile (PK brands)
  if (provider.brandColor && provider.monogram) {
    return (
      <span
        className={cn(tileCls, "font-bold tracking-tight")}
        style={{
          width: dims.tile,
          height: dims.tile,
          background: provider.brandColor,
          color: provider.brandText ?? "white",
        }}
      >
        <span className={dims.text}>{provider.monogram}</span>
      </span>
    );
  }

  // 3) Legacy gradient fallback
  return (
    <span
      className={tileCls}
      style={{
        width: dims.tile,
        height: dims.tile,
        background: provider.avatar ?? gradientCssForId(provider.id),
      }}
    />
  );
}
