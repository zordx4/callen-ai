// Tenant switcher dropdown.
// Two variants:
//   - "header" (compact, used when embedded in the top header bar)
//   - "sidebar" (full-width pill, used at the top of the sidebar — default)
//
// shadcn v4 + base-ui: the Trigger is itself a button, so we style it directly
// rather than wrapping a Button inside it (which would nest <button> in <button>).

"use client";

import { Check, ChevronsUpDown, Plus } from "lucide-react";
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem,
  DropdownMenuSeparator, DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useAppStore, useHasHydrated } from "@/lib/store";
import { tenants } from "@/lib/mock-data";
import { cn } from "@/lib/utils";
import { Skeleton } from "@/components/ui/skeleton";

type Variant = "header" | "sidebar";

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

  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        className={cn(
          "inline-flex items-center outline-none focus-visible:ring-2 focus-visible:ring-ring/40 transition-colors",
          variant === "header"
            ? "gap-2 h-9 px-2 rounded-lg hover:bg-accent"
            : "gap-2.5 h-10 w-full px-2.5 rounded-xl bg-white border border-neutral-200 hover:border-neutral-300 hover:shadow-sm"
        )}
        aria-label="Switch tenant"
      >
        <div
          className={cn(
            "rounded-full flex items-center justify-center text-white text-xs font-bold shrink-0 relative overflow-hidden",
            variant === "header" ? "size-6 rounded-md" : "size-6"
          )}
          style={
            variant === "header"
              ? { backgroundColor: currentTenant.logoColor }
              : {
                  background:
                    "radial-gradient(circle at 30% 30%, #f5f5f5 0%, #525252 45%, #0a0a0a 100%)",
                }
          }
        >
          {variant === "header" && currentTenant.name.charAt(0)}
          {variant === "sidebar" && (
            <span
              className="absolute inset-0"
              style={{
                background: `radial-gradient(circle at 70% 30%, ${currentTenant.logoColor}55, transparent 60%)`,
              }}
              aria-hidden="true"
            />
          )}
        </div>
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
        className={cn(variant === "sidebar" ? "w-[232px]" : "w-72")}
      >
        <div className="px-2 py-1.5 text-xs font-medium text-muted-foreground">
          Switch workspace
        </div>
        {tenants.map((t) => (
          <DropdownMenuItem
            key={t.id}
            onClick={() => setTenant(t)}
            className="gap-2 cursor-pointer"
          >
            <div
              className="size-7 rounded-md flex items-center justify-center text-white text-xs font-bold shrink-0"
              style={{ backgroundColor: t.logoColor }}
            >
              {t.name.charAt(0)}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium truncate">{t.name}</p>
              <p className="text-xs text-muted-foreground capitalize">
                {t.plan} plan
              </p>
            </div>
            <Check
              className={cn(
                "size-4 text-primary",
                currentTenant.id === t.id ? "opacity-100" : "opacity-0"
              )}
            />
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
