// Top header bar. Tenant switcher on the left, search in the middle, user menu on the right.

"use client";

import { Search, Bell } from "lucide-react";
import { Input } from "@/components/ui/input";
import { TenantSwitcher } from "./tenant-switcher";
import { UserMenu } from "./user-menu";
import { Button } from "@/components/ui/button";

export function Header() {
  return (
    <header className="h-14 shrink-0 border-b border-border/60 bg-background/80 backdrop-blur-sm flex items-center px-4 gap-3 sticky top-0 z-30">
      <TenantSwitcher />

      <div className="flex-1 max-w-md hidden md:block">
        <div className="relative">
          <Search className="size-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search calls, callers, intents..."
            className="pl-9 h-9 bg-muted/50 border-transparent focus-visible:bg-background focus-visible:border-input"
          />
          <kbd className="hidden md:inline-flex absolute right-2 top-1/2 -translate-y-1/2 text-[10px] font-mono bg-background border border-border rounded px-1.5 py-0.5 text-muted-foreground">
            ⌘K
          </kbd>
        </div>
      </div>

      <div className="flex-1 md:hidden" />

      <Button variant="ghost" size="icon" className="relative size-9" aria-label="Notifications">
        <Bell className="size-4" />
        <span className="absolute top-1.5 right-1.5 size-2 rounded-full bg-red-500" />
      </Button>

      <UserMenu />
    </header>
  );
}
