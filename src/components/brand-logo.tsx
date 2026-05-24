// BrandLogo — renders the avatar tile for an integration provider.
// Render order, picked top-down. If a stage fails to load, we transparently
// fall through to the next stage so the user never sees a broken-image glyph.
//
//   1. logoSlug      -> SVG from cdn.simpleicons.org on a white tile.
//                       (SimpleIcons is CC0; this is its intended CDN.)
//   2. faviconDomain -> Google's s2/favicons API.
//                       (Same favicon the browser shows in the tab.)
//   3. brandColor    -> brand-colour tile with a 1 or 2 letter monogram.
//   4. avatar        -> legacy gradient fallback (also covers custom MCP).

"use client";

import { useState, useEffect } from "react";
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

type RenderStage = "logo" | "favicon" | "monogram" | "gradient";

function initialStageFor(p: BrandLogoProvider): RenderStage {
  if (p.logoSlug) return "logo";
  if (p.faviconDomain) return "favicon";
  if (p.brandColor && p.monogram) return "monogram";
  return "gradient";
}

function nextStageAfter(
  current: RenderStage,
  p: BrandLogoProvider
): RenderStage {
  if (current === "logo" && p.faviconDomain) return "favicon";
  if (current === "logo" && p.brandColor && p.monogram) return "monogram";
  if (current === "favicon" && p.brandColor && p.monogram) return "monogram";
  return "gradient";
}

type BrandLogoProvider = Pick<
  IntegrationProvider,
  | "id"
  | "name"
  | "logoSlug"
  | "logoColor"
  | "faviconDomain"
  | "brandColor"
  | "brandText"
  | "monogram"
  | "avatar"
>;

export function BrandLogo({
  provider,
  size = "md",
  className,
  isCustom,
}: {
  provider: BrandLogoProvider;
  size?: Size;
  className?: string;
  isCustom?: boolean;
}) {
  const dims = SIZE_MAP[size];
  const tileCls = cn(
    "rounded-md shrink-0 ring-1 ring-black/5 overflow-hidden relative flex items-center justify-center",
    className
  );
  const tileStyle = { width: dims.tile, height: dims.tile };

  // Custom MCP server: generic icon tile, no stages.
  if (isCustom) {
    return (
      <span className={cn(tileCls, "bg-neutral-100")} style={tileStyle}>
        <Server className="text-neutral-600" style={{ width: dims.icon, height: dims.icon }} />
      </span>
    );
  }

  // Reset the stage whenever the provider identity changes.
  const [stage, setStage] = useState<RenderStage>(() => initialStageFor(provider));
  useEffect(() => {
    setStage(initialStageFor(provider));
  }, [provider.id]);

  const onLoadError = () => setStage((s) => nextStageAfter(s, provider));

  // Stage 1: SimpleIcons SVG.
  if (stage === "logo" && provider.logoSlug) {
    const color = provider.logoColor ?? "111111";
    const src = `https://cdn.simpleicons.org/${provider.logoSlug}/${color}`;
    return (
      <span className={cn(tileCls, "bg-white")} style={tileStyle}>
        <img
          src={src}
          alt={provider.name}
          width={dims.icon}
          height={dims.icon}
          decoding="async"
          referrerPolicy="no-referrer"
          onError={onLoadError}
          className="block"
          style={{ width: dims.icon, height: dims.icon }}
        />
      </span>
    );
  }

  // Stage 2: Google favicon API.
  if (stage === "favicon" && provider.faviconDomain) {
    const src = `https://www.google.com/s2/favicons?domain=${encodeURIComponent(
      provider.faviconDomain
    )}&sz=64`;
    return (
      <span className={cn(tileCls, "bg-white")} style={tileStyle}>
        <img
          src={src}
          alt={provider.name}
          width={dims.icon + 4}
          height={dims.icon + 4}
          decoding="async"
          referrerPolicy="no-referrer"
          onError={onLoadError}
          className="block rounded-sm"
          style={{
            width: dims.icon + 4,
            height: dims.icon + 4,
            objectFit: "contain",
          }}
        />
      </span>
    );
  }

  // Stage 3: brand-colour monogram tile.
  if (stage === "monogram" && provider.brandColor && provider.monogram) {
    return (
      <span
        className={cn(tileCls, "font-bold tracking-tight")}
        style={{
          ...tileStyle,
          background: provider.brandColor,
          color: provider.brandText ?? "white",
        }}
      >
        <span className={dims.text}>{provider.monogram}</span>
      </span>
    );
  }

  // Stage 4: gradient fallback.
  return (
    <span
      className={tileCls}
      style={{
        ...tileStyle,
        background: provider.avatar ?? gradientCssForId(provider.id),
      }}
    />
  );
}
