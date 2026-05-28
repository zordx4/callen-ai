// Profile dropdown — matches the ElevenLabs reference popup, adapted to
// Callen-relevant sections.
//
// Top: a circular usage ring on the trigger avatar (shows % of minutes used).
// Dropdown:
//   - Balance card: total + remaining call minutes + Upgrade
//   - Current workspace card with quick switch
//   - Settings / Workspace settings / Subscription
//   - Theme toggle
//   - Usage analytics / API keys
//   - Docs and resources / Terms and privacy
//   - Sign out

"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import {
  LogOut,
  Settings as SettingsIcon,
  Building2,
  CreditCard,
  BarChart3,
  KeyRound,
  BookOpen,
  FileText,
  ArrowLeftRight,
  Sun,
  Moon,
  Monitor,
  ExternalLink,
  ChevronRight,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useAppStore, useHasHydrated } from "@/lib/store";
import { tenants } from "@/lib/mock-data";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "sonner";
import { currentUser as fallbackUser } from "@/lib/mock-data";
import { cn } from "@/lib/utils";
import { signOut } from "@/lib/auth-store";

// Plan caps — mirrors the Settings billing tab so numbers stay consistent.
const MINUTES_TOTAL = 5_000;
const MINUTES_USED = 1_247;

export function UserMenu() {
  const router = useRouter();
  const hydrated = useHasHydrated();
  const userFromStore = useAppStore((s) => s.user);
  const currentTenant = useAppStore((s) => s.currentTenant);
  const setTenant = useAppStore((s) => s.setTenant);

  const [theme, setTheme] = useState<"light" | "dark" | "system">("light");
  const [signingOut, setSigningOut] = useState(false);

  if (!hydrated) {
    return <Skeleton className="size-9 rounded-full" />;
  }

  const user = userFromStore ?? fallbackUser;
  const initials = user.name
    .split(" ")
    .map((n) => n[0])
    .slice(0, 2)
    .join("");

  const usedPct = Math.min(100, (MINUTES_USED / MINUTES_TOTAL) * 100);

  async function handleSignOut() {
    if (signingOut) return;
    setSigningOut(true);
    const result = await signOut();
    if (!result.ok) {
      toast.error(result.error);
      setSigningOut(false);
      return;
    }
    toast.success("Signed out");
    // Full reload to drop any in-memory tenant-specific state along
    // with the cleared session cookie.
    router.replace("/login");
    router.refresh();
  }

  function go(href: string) {
    router.push(href);
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        className="relative size-9 outline-none focus-visible:ring-2 focus-visible:ring-ring/40 hover:opacity-90 transition-opacity"
        aria-label="Account menu"
      >
        <UsageRing pct={usedPct}>
          <span className="size-7 rounded-full bg-neutral-950 text-white flex items-center justify-center text-[10px] font-semibold">
            {initials}
          </span>
        </UsageRing>
      </DropdownMenuTrigger>

      <DropdownMenuContent
        align="end"
        className="w-[300px] p-2 rounded-2xl"
      >
        {/* Balance card */}
        <div className="rounded-xl border border-neutral-200 p-3 mb-2">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <UsageRing pct={usedPct} small />
              <p className="text-sm font-semibold tracking-tight">Balance</p>
            </div>
            <button
              onClick={() => {
                go("/settings");
                toast("Opening billing");
              }}
              className="h-6 px-2.5 rounded-full bg-neutral-950 text-white text-[11px] font-medium hover:bg-neutral-800 transition-colors"
            >
              Upgrade
            </button>
          </div>
          <div className="flex items-center justify-between text-[12px]">
            <span className="text-neutral-500">Total</span>
            <span className="font-mono tabular-nums">
              {MINUTES_TOTAL.toLocaleString()} minutes
            </span>
          </div>
          <div className="flex items-center justify-between text-[12px] mt-0.5">
            <span className="text-neutral-500">Remaining</span>
            <span className="font-mono tabular-nums font-semibold">
              {(MINUTES_TOTAL - MINUTES_USED).toLocaleString()}
            </span>
          </div>
        </div>

        {/* Current workspace card */}
        <WorkspaceCard
          name={currentTenant.name}
          plan={currentTenant.plan}
          gradient={currentTenant.avatarGradient}
          onSwitch={() => {
            // cycle to next tenant for a one-click demo
            const i = tenants.findIndex((t) => t.id === currentTenant.id);
            const next = tenants[(i + 1) % tenants.length];
            setTenant(next);
            toast(`Switched to ${next.name}`);
          }}
        />

        {/* Menu sections */}
        <div className="py-1">
          <MenuItem icon={SettingsIcon} label="Settings"           onClick={() => go("/settings")} />
          <MenuItem icon={Building2}    label="Workspace settings" onClick={() => go("/settings")} />
          <MenuItem icon={CreditCard}   label="Subscription"       onClick={() => go("/settings")} />
          <ThemeRow theme={theme} setTheme={setTheme} />
        </div>

        <Divider />

        <div className="py-1">
          <MenuItem icon={BarChart3} label="Usage analytics" onClick={() => go("/analytics")} />
          <MenuItem icon={KeyRound}  label="API keys"         onClick={() => go("/settings")} />
        </div>

        <Divider />

        <div className="py-1">
          <MenuItem
            icon={BookOpen}
            label="Docs and resources"
            trailing={<ExternalLink className="size-3 text-neutral-400" />}
            onClick={() => toast("Docs opened (mock)")}
          />
          <MenuItem
            icon={FileText}
            label="Terms and privacy"
            trailing={<ExternalLink className="size-3 text-neutral-400" />}
            onClick={() => toast("Terms opened (mock)")}
          />
        </div>

        <Divider />

        <button
          onClick={handleSignOut}
          disabled={signingOut}
          className="w-full flex items-center gap-2.5 px-2.5 py-2 rounded-md hover:bg-rose-50 text-rose-700 text-[13px] font-medium transition-colors disabled:opacity-60 disabled:cursor-wait"
        >
          <LogOut className="size-4" />
          {signingOut ? "Signing out..." : "Sign out"}
        </button>

        <div className="px-1 py-1.5 mt-1">
          <p className="text-[10px] text-neutral-400 text-center">
            {user.name} · {user.email}
          </p>
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

// =============================================================
// Sub-components
// =============================================================

function UsageRing({
  pct,
  children,
  small = false,
}: {
  pct: number;
  children?: React.ReactNode;
  small?: boolean;
}) {
  // Conic gradient ring around the avatar.
  const size = small ? 22 : 36;
  return (
    <div
      className="rounded-full p-[2px]"
      style={{
        width: size,
        height: size,
        background: `conic-gradient(#0a0a0a ${pct * 3.6}deg, #e5e5e5 0)`,
      }}
    >
      <div className="size-full rounded-full bg-white flex items-center justify-center">
        {children ?? (
          <span className="text-[9px] font-mono text-neutral-700 tabular-nums">
            {Math.round(pct)}%
          </span>
        )}
      </div>
    </div>
  );
}

function WorkspaceCard({
  name,
  plan,
  gradient,
  onSwitch,
}: {
  name: string;
  plan: string;
  gradient?: string;
  onSwitch: () => void;
}) {
  return (
    <div className="rounded-xl border border-neutral-200 p-2.5 mb-2 flex items-center gap-2.5">
      <span
        className="size-9 rounded-md shrink-0 ring-1 ring-black/5"
        style={{ background: gradient ?? "#0a0a0a" }}
        aria-hidden="true"
      />
      <div className="flex-1 min-w-0">
        <p className="text-[10px] uppercase tracking-widest text-neutral-500 font-semibold leading-none mb-0.5">
          Current workspace
        </p>
        <p className="text-sm font-semibold truncate leading-tight">{name}</p>
        <p className="text-[11px] text-neutral-500 capitalize leading-tight">{plan} plan</p>
      </div>
      <button
        onClick={onSwitch}
        className="size-7 rounded-md hover:bg-neutral-100 flex items-center justify-center text-neutral-600 transition-colors shrink-0"
        aria-label="Switch workspace"
      >
        <ArrowLeftRight className="size-3.5" />
      </button>
    </div>
  );
}

function MenuItem({
  icon: Icon,
  label,
  trailing,
  onClick,
}: {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  trailing?: React.ReactNode;
  onClick?: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className="w-full flex items-center gap-2.5 px-2.5 py-1.5 rounded-md hover:bg-neutral-100 text-neutral-800 text-[13px] font-medium transition-colors"
    >
      <Icon className="size-4 text-neutral-600 shrink-0" />
      <span className="flex-1 text-left">{label}</span>
      {trailing}
    </button>
  );
}

function Divider() {
  return <div className="h-px bg-neutral-100 my-1" />;
}

function ThemeRow({
  theme,
  setTheme,
}: {
  theme: "light" | "dark" | "system";
  setTheme: (t: "light" | "dark" | "system") => void;
}) {
  const [open, setOpen] = useState(false);

  const Active = theme === "light" ? Sun : theme === "dark" ? Moon : Monitor;
  const Label = theme.charAt(0).toUpperCase() + theme.slice(1);

  return (
    <div className="relative">
      <button
        onClick={() => setOpen((v) => !v)}
        className="w-full flex items-center gap-2.5 px-2.5 py-1.5 rounded-md hover:bg-neutral-100 text-neutral-800 text-[13px] font-medium transition-colors"
      >
        <Active className="size-4 text-neutral-600 shrink-0" />
        <span className="flex-1 text-left">Theme</span>
        <span className="text-[11px] text-neutral-500 capitalize">{Label}</span>
        <ChevronRight className="size-3 text-neutral-400" />
      </button>
      {open && (
        <div className="absolute left-1 right-1 top-full mt-1 z-10 rounded-lg border border-neutral-200 bg-white shadow-md p-1">
          {(["light", "dark", "system"] as const).map((t) => {
            const Icon = t === "light" ? Sun : t === "dark" ? Moon : Monitor;
            return (
              <button
                key={t}
                onClick={() => {
                  setTheme(t);
                  setOpen(false);
                  toast(`Theme set to ${t}`);
                }}
                className={cn(
                  "w-full flex items-center gap-2.5 px-2.5 py-1.5 rounded-md hover:bg-neutral-100 text-[12px] font-medium transition-colors capitalize",
                  theme === t && "bg-neutral-50"
                )}
              >
                <Icon className="size-3.5 text-neutral-600 shrink-0" />
                {t}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
