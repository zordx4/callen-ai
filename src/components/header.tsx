// Top header — white surface, neutral border. The workspace switcher now
// lives in the sidebar (ElevenLabs-style), so the header keeps just
// the search field, notifications, and user menu.

"use client";

import { Search, Bell } from "lucide-react";
import { Input } from "@/components/ui/input";
import { UserMenu } from "./user-menu";
import { Button } from "@/components/ui/button";

export function Header() {
  return (
    <header className="h-14 shrink-0 border-b border-neutral-200 bg-white/90 backdrop-blur-md flex items-center px-5 gap-3 sticky top-0 z-30">
      <div className="flex-1 max-w-md hidden md:block">
        <div className="relative">
          <Search className="size-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400" />
          <Input
            placeholder="Search calls, callers, intents..."
            className="pl-9 h-9 bg-neutral-50 border-neutral-200 focus-visible:bg-white focus-visible:border-neutral-400"
          />
          <kbd className="hidden md:inline-flex absolute right-2 top-1/2 -translate-y-1/2 text-[10px] font-mono bg-white border border-neutral-200 rounded px-1.5 py-0.5 text-neutral-500">
            ⌘K
          </kbd>
        </div>
      </div>

      <div className="flex-1 md:hidden" />

      <Button
        variant="ghost"
        size="icon"
        className="relative size-9 rounded-full"
        aria-label="Notifications"
      >
        <Bell className="size-4" />
        <span className="absolute top-1.5 right-1.5 size-2 rounded-full bg-neutral-950" />
      </Button>

      <UserMenu />
    </header>
  );
}
