// Left sidebar with logo + navigation.
// Client Component because it uses usePathname() to highlight the active route.

"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import {
  Mic, LayoutDashboard, PhoneCall, History, Bot, BookOpen,
  Wrench, BarChart3, GitBranch, Users, Building2,
} from "lucide-react";

const navItems = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/calls/live", label: "Live Calls", icon: PhoneCall, accent: true },
  { href: "/calls", label: "Call History", icon: History },
  { href: "/agent", label: "Agent Studio", icon: Bot },
  { href: "/knowledge", label: "Knowledge Base", icon: BookOpen },
  { href: "/tools", label: "Tools", icon: Wrench },
  { href: "/analytics", label: "Analytics", icon: BarChart3 },
  { href: "/escalations", label: "Escalations", icon: GitBranch },
];

const navItemsBottom = [
  { href: "/users", label: "Users & Roles", icon: Users },
  { href: "/tenants", label: "Tenants", icon: Building2 },
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="hidden md:flex flex-col w-60 shrink-0 border-r border-border/60 bg-sidebar/40 backdrop-blur">
      {/* Logo */}
      <div className="flex items-center gap-2.5 px-5 h-14 border-b border-border/60">
        <div className="size-7 rounded-lg bg-gradient-to-br from-blue-600 to-purple-600 flex items-center justify-center shadow-sm">
          <Mic className="size-3.5 text-white" />
        </div>
        <span className="font-semibold tracking-tight">Sawti</span>
      </div>

      {/* Main nav */}
      <nav className="flex-1 px-3 py-4 space-y-0.5 overflow-y-auto">
        {navItems.map((item) => {
          const active = pathname === item.href || (item.href !== "/dashboard" && pathname.startsWith(item.href));
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors",
                active
                  ? "bg-primary text-primary-foreground"
                  : "text-muted-foreground hover:bg-accent hover:text-foreground"
              )}
            >
              <item.icon className="size-4 shrink-0" />
              <span className="flex-1">{item.label}</span>
              {item.accent && (
                <span className="size-2 rounded-full bg-emerald-500 animate-pulse" title="2 calls live" />
              )}
            </Link>
          );
        })}

        <div className="pt-4 mt-4 border-t border-border/60 space-y-0.5">
          <p className="px-3 py-1.5 text-xs uppercase tracking-wider text-muted-foreground/70 font-semibold">
            Administration
          </p>
          {navItemsBottom.map((item) => {
            const active = pathname.startsWith(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors",
                  active
                    ? "bg-primary text-primary-foreground"
                    : "text-muted-foreground hover:bg-accent hover:text-foreground"
                )}
              >
                <item.icon className="size-4 shrink-0" />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </div>
      </nav>

      {/* Bottom: usage / upgrade card */}
      <div className="m-3 p-3 rounded-xl bg-gradient-to-br from-blue-50 to-purple-50 dark:from-blue-950/40 dark:to-purple-950/40 border border-blue-100 dark:border-blue-900/40">
        <p className="text-xs font-semibold text-blue-900 dark:text-blue-100">Pro plan</p>
        <p className="text-xs text-muted-foreground mt-0.5">1,247 / 5,000 minutes used this month</p>
        <div className="mt-2 h-1.5 bg-blue-100 dark:bg-blue-900/60 rounded-full overflow-hidden">
          <div className="h-full bg-gradient-to-r from-blue-500 to-purple-600 rounded-full" style={{ width: "25%" }} />
        </div>
      </div>
    </aside>
  );
}
