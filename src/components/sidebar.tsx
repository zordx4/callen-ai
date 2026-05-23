// Sidebar — white surface, neutral borders, black active state.
// Matches landing aesthetic.

"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { Logo } from "./logo";
import {
  LayoutDashboard, PhoneCall, History, Bot, BookOpen,
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
    <aside className="hidden md:flex flex-col w-60 shrink-0 border-r border-neutral-200 bg-white">
      {/* Logo */}
      <div className="flex items-center px-5 h-16 border-b border-neutral-200">
        <Link href="/dashboard" className="hover:opacity-80 transition-opacity">
          <Logo size="default" />
        </Link>
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
                  ? "bg-neutral-950 text-white"
                  : "text-neutral-600 hover:bg-neutral-100 hover:text-neutral-900"
              )}
            >
              <item.icon className="size-4 shrink-0" />
              <span className="flex-1">{item.label}</span>
              {item.accent && (
                <span
                  className="size-2 rounded-full bg-neutral-900 animate-pulse"
                  title="2 calls live"
                  style={active ? { background: "white" } : {}}
                />
              )}
            </Link>
          );
        })}

        <div className="pt-4 mt-4 border-t border-neutral-200 space-y-0.5">
          <p className="px-3 py-1.5 text-[10px] uppercase tracking-widest text-neutral-500 font-semibold">
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
                    ? "bg-neutral-950 text-white"
                    : "text-neutral-600 hover:bg-neutral-100 hover:text-neutral-900"
                )}
              >
                <item.icon className="size-4 shrink-0" />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </div>
      </nav>

      {/* Usage / upgrade card */}
      <div className="m-3 p-4 rounded-2xl bg-neutral-950 text-white relative overflow-hidden">
        <div
          className="absolute inset-0 opacity-[0.08]"
          style={{
            backgroundImage:
              "radial-gradient(circle, #fff 1px, transparent 1px)",
            backgroundSize: "12px 12px",
          }}
        />
        <div className="relative">
          <p className="text-xs font-semibold mb-0.5 tracking-tight">Pro plan</p>
          <p className="text-[11px] text-white/60 mb-2.5 tabular-nums">1,247 / 5,000 mins used</p>
          <div className="h-1.5 bg-white/15 rounded-full overflow-hidden">
            <div className="h-full bg-white rounded-full" style={{ width: "25%" }} />
          </div>
        </div>
      </div>
    </aside>
  );
}
