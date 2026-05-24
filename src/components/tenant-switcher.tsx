// Tenant switcher dropdown.
// Two variants:
//   - "header"  (compact, used when embedded in the top header bar)
//   - "sidebar" (full-width pill, used at the top of the sidebar — default)
//
// Avatars are colorful organic gradients per workspace (the identity surface
// exception to the otherwise-monochrome design system).

"use client";

import { Check, ChevronsUpDown, Plus, ArrowLeftRight } from "lucide-react";
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem,
  DropdownMenuSeparator, DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useAppStore, useHasHydrated } from "@/lib/store";
import { tenants } from "@/lib/mock-data";
import { gradientCssForId } from "@/lib/avatar-gradients";
import { cn } from "@/lib/utils";
import { Skeleton } from "@/components/ui/skeleton";

type Variant = "header" | "sidebar";

function avatarFor(tenant: { id: string; avatarGradient?: string }) {
  return tenant.avatarGradient ?? gradientCssForId(tenant.id);
}

export function TenantSwitcher({ variant = "sidebar" }: { variant?: Variant } = {}) {
  const hydrated = useHasHydrated();
  const currentTenant = useAppStore((s) => s.currentTenant);
  const setTenant = useAppStore((s) => s.setTenant);

  if (!hydrated) {
    return (
      <Skeleton
        className={variant === "sidebar" ? "h-10 w-full" : "h-9 w-48"}
      />
    );
  }

  const currentAvatar = avatarFor(currentTenant);

  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        className={cn(
          "inline-flex items-center outline-none focus-visible:ring-2 focus-visible:ring-ring/40 transition-colors",
          variant === "header"
            ? "gap-2 h-9 px-2 rounded-lg hover:bg-accent"
            : "gap-2.5 h-10 w-full px-2.5 rounded-xl bg-white border border-neutral-200 hover:border-neutral-300 hover:shadow-sm"
        )}
        aria-label="Switch workspace"
      >
        <span
          className={cn(
            "rounded-md shrink-0 ring-1 ring-black/5",
            variant === "header" ? "size-6" : "size-6"
          )}
          style={{ background: currentAvatar }}
          aria-hidden="true"
        />
        {variant === "header" ? (
          <div className="hidden sm:flex flex-col items-start min-w-0">
            <span className="text-sm font-semibold truncate max-w-[180px]">
              {currentTenant.name}
            </span>
            <span className="text-[10px] uppercase tracking-wider text-muted-foreground leading-none mt-0.5">
              {currentTenant.plan}
            </span>
          </div>
        ) : (
          <span className="flex-1 min-w-0 text-left text-sm font-semibold tracking-tight truncate text-neutral-900">
            {currentTenant.name}
          </span>
        )}
        <ChevronsUpDown
          className={cn(
            "shrink-0",
            variant === "header"
              ? "size-3.5 text-muted-foreground"
              : "size-3.5 text-neutral-400 ml-1"
          )}
        />
      </DropdownMenuTrigger>
      <DropdownMenuContent
        align="start"
        className={cn(variant === "sidebar" ? "w-[260px]" : "w-72")}
      >
        <div className="px-2 py-1.5 text-xs font-medium text-muted-foreground">
          Switch workspace
        </div>
        {tenants.map((t) => (
          <DropdownMenuItem
            key={t.id}
            onClick={() => setTenant(t)}
            className="gap-2.5 cursor-pointer items-start py-2"
          >
            <span
              className="size-9 rounded-md shrink-0 ring-1 ring-black/5"
              style={{ background: avatarFor(t) }}
              aria-hidden="true"
            />
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold truncate leading-tight">
                {t.name}
              </p>
              <p className="text-[11px] text-muted-foreground truncate leading-snug">
                {t.description ?? `${t.plan} plan`}
              </p>
            </div>
            {currentTenant.id === t.id ? (
              <Check className="size-4 text-primary shrink-0 mt-1" />
            ) : (
              <ArrowLeftRight className="size-3.5 text-neutral-300 shrink-0 mt-1" />
            )}
          </DropdownMenuItem>
        ))}
        <DropdownMenuSeparator />
        <DropdownMenuItem className="gap-2 cursor-pointer text-muted-foreground">
          <Plus className="size-4" />
          Add workspace
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
