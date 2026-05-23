// Tenant switcher dropdown in the header.
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

export function TenantSwitcher() {
  const hydrated = useHasHydrated();
  const currentTenant = useAppStore((s) => s.currentTenant);
  const setTenant = useAppStore((s) => s.setTenant);

  if (!hydrated) {
    return <Skeleton className="h-9 w-48" />;
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        className="inline-flex items-center gap-2 h-9 px-2 rounded-lg hover:bg-accent transition-colors outline-none focus-visible:ring-2 focus-visible:ring-ring/40"
        aria-label="Switch tenant"
      >
        <div
          className="size-6 rounded-md flex items-center justify-center text-white text-xs font-bold shrink-0"
          style={{ backgroundColor: currentTenant.logoColor }}
        >
          {currentTenant.name.charAt(0)}
        </div>
        <div className="hidden sm:flex flex-col items-start min-w-0">
          <span className="text-sm font-semibold truncate max-w-[180px]">{currentTenant.name}</span>
          <span className="text-[10px] uppercase tracking-wider text-muted-foreground leading-none mt-0.5">{currentTenant.plan}</span>
        </div>
        <ChevronsUpDown className="size-3.5 text-muted-foreground" />
      </DropdownMenuTrigger>
      <DropdownMenuContent align="start" className="w-72">
        <div className="px-2 py-1.5 text-xs font-medium text-muted-foreground">Switch tenant</div>
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
              <p className="text-xs text-muted-foreground capitalize">{t.plan} plan</p>
            </div>
            <Check className={cn("size-4 text-primary", currentTenant.id === t.id ? "opacity-100" : "opacity-0")} />
          </DropdownMenuItem>
        ))}
        <DropdownMenuSeparator />
        <DropdownMenuItem className="gap-2 cursor-pointer text-muted-foreground">
          <Plus className="size-4" />
          Add tenant
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
