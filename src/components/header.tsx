// Top header — restructured to match the ElevenLabs reference.
// Left: sidebar toggle icon + page title from pathname.
// Right: What's new, Feedback, Docs, Ask pills + notifications bell + profile avatar.

"use client";

import { usePathname } from "next/navigation";
import { PanelLeftClose, Sparkles, MessageSquare, BookOpen, MessageCircleMore, Bell } from "lucide-react";
import { toast } from "sonner";
import { UserMenu } from "./user-menu";

// Map pathname prefixes to a clean page title. Order matters — longest match wins.
const PAGE_TITLES: Array<{ match: string; title: string }> = [
  { match: "/calls/live",      title: "Live Calls" },
  { match: "/calls",           title: "Call History" },
  { match: "/phone-numbers",   title: "Phone Numbers" },
  { match: "/whatsapp",        title: "WhatsApp" },
  { match: "/knowledge",       title: "Knowledge Base" },
  { match: "/tools",           title: "Tools" },
  { match: "/voices",          title: "Voices" },
  { match: "/integrations",    title: "Integrations" },
  { match: "/agent",           title: "Agents" },
  { match: "/analytics",       title: "Analytics" },
  { match: "/users",           title: "Users" },
  { match: "/settings",        title: "Settings" },
  { match: "/tenants",         title: "Tenants" },
  { match: "/dashboard",       title: "Home" },
];

function titleFor(pathname: string): string {
  for (const { match, title } of PAGE_TITLES) {
    if (pathname === match || pathname.startsWith(match + "/")) return title;
  }
  return "Home";
}

export function Header() {
  const pathname = usePathname();
  const title = titleFor(pathname);

  return (
    <header className="h-14 shrink-0 border-b border-neutral-200 bg-white/95 backdrop-blur-md flex items-center px-4 lg:px-5 gap-2 sticky top-0 z-30">
      {/* Left: sidebar collapse icon + page title */}
      <button
        className="size-7 rounded-md hover:bg-neutral-100 flex items-center justify-center text-neutral-600 transition-colors"
        aria-label="Toggle sidebar"
        onClick={() => toast("Sidebar collapse coming soon")}
      >
        <PanelLeftClose className="size-3.5" />
      </button>
      <h1 className="text-[15px] font-semibold tracking-tight">{title}</h1>

      <div className="flex-1" />

      {/* Right cluster */}
      <div className="hidden sm:flex items-center gap-1">
        <ToolbarPill
          icon={Sparkles}
          label="What's new"
          highlight
          onClick={() =>
            toast("What's new", {
              description: "Cheezious dashboard rebuild · 7 new pages · colorful avatars.",
            })
          }
        />
        <ToolbarPill
          icon={MessageSquare}
          label="Feedback"
          onClick={() => toast("Feedback form opened (mock)")}
        />
        <ToolbarPill
          icon={BookOpen}
          label="Docs"
          onClick={() => toast("Docs (mock link)")}
        />
        <ToolbarPill
          icon={MessageCircleMore}
          label="Ask"
          onClick={() => toast("Ask Callen AI (mock)")}
        />
      </div>

      <button
        className="relative size-9 rounded-full hover:bg-neutral-100 flex items-center justify-center text-neutral-700 transition-colors ml-1"
        aria-label="Notifications"
      >
        <Bell className="size-4" />
        <span className="absolute top-2 right-2 size-1.5 rounded-full bg-blue-500" />
      </button>

      <UserMenu />
    </header>
  );
}

// =============================================================
// Toolbar pill
// =============================================================

function ToolbarPill({
  icon: Icon,
  label,
  highlight,
  onClick,
}: {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  highlight?: boolean;
  onClick?: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className={
        highlight
          ? "inline-flex items-center gap-1.5 h-8 px-3 rounded-full bg-white border border-transparent text-[12px] font-medium text-neutral-800 transition-colors hover:border-neutral-200 relative overflow-hidden"
          : "inline-flex items-center gap-1.5 h-8 px-3 rounded-full hover:bg-neutral-100 text-[12px] font-medium text-neutral-700 transition-colors"
      }
      style={
        highlight
          ? {
              // Subtle gradient ring for "What's new"
              backgroundImage:
                "linear-gradient(white, white), linear-gradient(120deg, #c084fc, #38bdf8, #fb7185)",
              backgroundOrigin: "border-box",
              backgroundClip: "padding-box, border-box",
              border: "1px solid transparent",
            }
          : undefined
      }
    >
      <Icon className="size-3.5" />
      {label}
    </button>
  );
}
