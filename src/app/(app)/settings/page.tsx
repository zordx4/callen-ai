// Settings — workspace + billing + API keys + webhooks tabs.

"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  Building2,
  CreditCard,
  KeyRound,
  Webhook,
  Copy,
  Eye,
  EyeOff,
  RotateCcw,
  Trash2,
  Plus,
  Check,
} from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";

type Tab = "workspace" | "billing" | "api" | "webhooks";

const TABS: { id: Tab; label: string; icon: React.ComponentType<{ className?: string }> }[] = [
  { id: "workspace", label: "Workspace", icon: Building2 },
  { id: "billing",   label: "Billing",   icon: CreditCard },
  { id: "api",       label: "API keys",  icon: KeyRound },
  { id: "webhooks",  label: "Webhooks",  icon: Webhook },
];

export default function SettingsPage() {
  const [tab, setTab] = useState<Tab>("workspace");

  return (
    <div className="p-6 lg:p-8 max-w-5xl mx-auto">
      <div className="mb-6">
        <h1 className="text-3xl md:text-4xl font-bold tracking-tight">Settings</h1>
        <p className="text-sm text-neutral-500 mt-1">
          Workspace, billing, API keys, and webhook routing for your Callen workspace.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-[200px_1fr] gap-6">
        {/* Tab nav */}
        <nav className="space-y-0.5">
          {TABS.map((t) => (
            <button
              key={t.id}
              onClick={() => setTab(t.id)}
              className={cn(
                "w-full text-left flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm font-medium transition-colors",
                tab === t.id
                  ? "bg-neutral-100 text-neutral-950"
                  : "text-neutral-700 hover:bg-neutral-100"
              )}
            >
              <t.icon className="size-4 shrink-0" />
              {t.label}
            </button>
          ))}
        </nav>

        {/* Tab content */}
        <div className="min-w-0">
          <AnimatePresence mode="wait">
            <motion.div
              key={tab}
              initial={{ opacity: 0, y: 4 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.18 }}
            >
              {tab === "workspace" && <WorkspaceTab />}
              {tab === "billing" && <BillingTab />}
              {tab === "api" && <ApiKeysTab />}
              {tab === "webhooks" && <WebhooksTab />}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}

// =============================================================
// Workspace tab
// =============================================================

function WorkspaceTab() {
  const [name, setName] = useState("Cheezious");
  const [region, setRegion] = useState("ap-south-1");

  return (
    <Card title="Workspace details" subtitle="Branding and routing region.">
      <div className="space-y-3">
        <Row>
          <Label htmlFor="ws-name" className="text-xs">Workspace name</Label>
          <Input id="ws-name" value={name} onChange={(e) => setName(e.target.value)} />
        </Row>
        <Row>
          <Label htmlFor="ws-region" className="text-xs">Routing region</Label>
          <select
            id="ws-region"
            value={region}
            onChange={(e) => setRegion(e.target.value)}
            className="h-10 w-full rounded-md border border-neutral-200 bg-white px-2.5 text-sm"
          >
            <option value="ap-south-1">Asia Pacific · Mumbai (lowest PK latency)</option>
            <option value="me-south-1">Middle East · Bahrain</option>
            <option value="eu-west-1">Europe · Ireland</option>
            <option value="us-east-1">US East · Virginia</option>
          </select>
          <p className="text-[11px] text-neutral-500 mt-1">
            Your calls and recordings stay inside this region.
          </p>
        </Row>
      </div>
      <SaveButton onClick={() => toast("Workspace updated")} />
    </Card>
  );
}

// =============================================================
// Billing tab
// =============================================================

function BillingTab() {
  return (
    <div className="space-y-4">
      <Card title="Current plan" subtitle="Pro plan · billed monthly">
        <div className="flex items-center justify-between gap-4">
          <div>
            <p className="text-3xl font-bold tracking-tight">$199<span className="text-sm font-medium text-neutral-500">/mo</span></p>
            <p className="text-[12px] text-neutral-500 mt-0.5">5,000 voice minutes + 10,000 messages</p>
          </div>
          <button
            onClick={() => toast("Plan switcher opened (mock)")}
            className="h-9 px-4 rounded-full bg-neutral-950 text-white text-sm font-medium hover:bg-neutral-800 transition-colors"
          >
            Change plan
          </button>
        </div>
      </Card>

      <Card title="This month" subtitle="Resets on the 1st">
        <div className="grid grid-cols-3 gap-3 mb-3">
          <UsageTile label="Voice minutes" used={1247} cap={5000} />
          <UsageTile label="Messages" used={1812} cap={10_000} />
          <UsageTile label="Storage" used={742} cap={1000} suffix=" KB" />
        </div>
      </Card>

      <Card title="Payment method" subtitle="Charged on the 1st of each month">
        <div className="flex items-center justify-between gap-3 rounded-xl border border-neutral-200 px-4 py-3 bg-white">
          <div className="flex items-center gap-3">
            <div className="size-10 rounded-md bg-neutral-950 text-white flex items-center justify-center text-[10px] font-bold tracking-widest">
              VISA
            </div>
            <div>
              <p className="text-sm font-semibold">Visa ending 4242</p>
              <p className="text-[11px] text-neutral-500">Exp 04 / 28 · billed in USD</p>
            </div>
          </div>
          <button
            onClick={() => toast("Card update (mock)")}
            className="h-9 px-3 rounded-full text-sm font-medium text-neutral-700 hover:bg-neutral-100 transition-colors"
          >
            Update
          </button>
        </div>
      </Card>
    </div>
  );
}

function UsageTile({
  label,
  used,
  cap,
  suffix,
}: {
  label: string;
  used: number;
  cap: number;
  suffix?: string;
}) {
  const pct = Math.min(100, (used / cap) * 100);
  return (
    <div className="rounded-xl border border-neutral-200 bg-white p-3">
      <p className="text-[10px] uppercase tracking-widest text-neutral-500 font-semibold mb-1">{label}</p>
      <p className="text-lg font-bold tabular-nums">
        {used.toLocaleString()}<span className="text-[11px] text-neutral-500"> / {cap.toLocaleString()}{suffix ?? ""}</span>
      </p>
      <div className="mt-1.5 h-1 bg-neutral-100 rounded-full overflow-hidden">
        <div className="h-full bg-neutral-900 rounded-full" style={{ width: `${pct}%` }} />
      </div>
    </div>
  );
}

// =============================================================
// API keys tab
// =============================================================

type ApiKey = {
  id: string;
  name: string;
  prefix: string;
  full: string;
  createdAt: string;
  lastUsed: string;
};

const SEED_KEYS: ApiKey[] = [
  { id: "k1", name: "Production",  prefix: "ck_live_8a2f", full: "ck_live_8a2f_b4c5d6e7f890a1b2c3d4e5f6a7b8c9d0", createdAt: "2026-04-12T10:30:00Z", lastUsed: "3 minutes ago" },
  { id: "k2", name: "Staging",     prefix: "ck_test_2e91", full: "ck_test_2e91_a1b2c3d4e5f6a7b8c9d0e1f2a3b4c5d6", createdAt: "2026-04-20T14:20:00Z", lastUsed: "2 hours ago" },
  { id: "k3", name: "Mobile app",  prefix: "ck_mob_91d4",  full: "ck_mob_91d4_e1f2a3b4c5d6e7f8a9b0c1d2e3f4a5b6",  createdAt: "2026-05-02T09:00:00Z", lastUsed: "yesterday" },
];

function ApiKeysTab() {
  const [keys, setKeys] = useState<ApiKey[]>(SEED_KEYS);
  const [shown, setShown] = useState<Record<string, boolean>>({});
  const [addOpen, setAddOpen] = useState(false);

  const generate = (name: string) => {
    const full = `ck_live_${Math.random().toString(36).slice(2, 6)}_${Math.random().toString(36).slice(2, 26)}`;
    setKeys((prev) => [
      {
        id: `k_${Date.now()}`,
        name,
        prefix: full.slice(0, 12),
        full,
        createdAt: new Date().toISOString(),
        lastUsed: "never",
      },
      ...prev,
    ]);
    toast("API key created", {
      description: "Copy it now. It won't be shown again in full.",
    });
  };

  const rotate = (id: string) => {
    setKeys((prev) =>
      prev.map((k) =>
        k.id === id
          ? {
              ...k,
              full: `ck_live_${Math.random().toString(36).slice(2, 6)}_${Math.random().toString(36).slice(2, 26)}`,
              prefix: `ck_live_${Math.random().toString(36).slice(2, 6)}`,
              lastUsed: "just now",
            }
          : k
      )
    );
    toast("Key rotated", {
      description: "Old key is invalidated immediately.",
    });
  };

  return (
    <Card
      title="API keys"
      subtitle="Authenticate with the Callen REST + WebSocket APIs."
      action={
        <button
          onClick={() => setAddOpen(true)}
          className="inline-flex items-center gap-1.5 h-9 px-3 rounded-full bg-neutral-950 text-white text-[12px] font-medium hover:bg-neutral-800 transition-colors"
        >
          <Plus className="size-3.5" />
          New key
        </button>
      }
    >
      <div className="space-y-2">
        {keys.map((k) => (
          <div
            key={k.id}
            className="rounded-xl border border-neutral-200 bg-white px-4 py-3 flex items-center gap-3"
          >
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold tracking-tight">{k.name}</p>
              <p className="text-[11px] text-neutral-500 font-mono">
                {shown[k.id] ? k.full : `${k.prefix}${"·".repeat(28)}`}
              </p>
              <p className="text-[10px] text-neutral-400 mt-0.5">
                Created {new Date(k.createdAt).toLocaleDateString()} · last used {k.lastUsed}
              </p>
            </div>
            <button
              onClick={() => setShown((s) => ({ ...s, [k.id]: !s[k.id] }))}
              className="size-8 rounded-md hover:bg-neutral-100 flex items-center justify-center text-neutral-600"
              aria-label="Show key"
            >
              {shown[k.id] ? <EyeOff className="size-3.5" /> : <Eye className="size-3.5" />}
            </button>
            <button
              onClick={() => {
                navigator.clipboard?.writeText(k.full).catch(() => {});
                toast("Copied to clipboard");
              }}
              className="size-8 rounded-md hover:bg-neutral-100 flex items-center justify-center text-neutral-600"
              aria-label="Copy"
            >
              <Copy className="size-3.5" />
            </button>
            <button
              onClick={() => rotate(k.id)}
              className="size-8 rounded-md hover:bg-neutral-100 flex items-center justify-center text-neutral-600"
              aria-label="Rotate"
            >
              <RotateCcw className="size-3.5" />
            </button>
            <button
              onClick={() => {
                setKeys((prev) => prev.filter((x) => x.id !== k.id));
                toast("Key revoked");
              }}
              className="size-8 rounded-md hover:bg-neutral-100 flex items-center justify-center text-neutral-600"
              aria-label="Revoke"
            >
              <Trash2 className="size-3.5" />
            </button>
          </div>
        ))}
      </div>

      <NewKeyDialog open={addOpen} onClose={() => setAddOpen(false)} onCreate={generate} />
    </Card>
  );
}

function NewKeyDialog({
  open,
  onClose,
  onCreate,
}: {
  open: boolean;
  onClose: () => void;
  onCreate: (name: string) => void;
}) {
  const [name, setName] = useState("");
  return (
    <Dialog open={open} onOpenChange={(o) => !o && onClose()}>
      <DialogContent className="sm:max-w-md">
        <DialogTitle>Create API key</DialogTitle>
        <DialogDescription>
          Give it a memorable name. The full key is shown only once after creation.
        </DialogDescription>
        <div className="space-y-3 mt-2">
          <div className="space-y-1.5">
            <Label htmlFor="k-name" className="text-xs">Key name</Label>
            <Input
              id="k-name"
              placeholder="Production"
              value={name}
              onChange={(e) => setName(e.target.value)}
              autoFocus
            />
          </div>
        </div>
        <div className="-mx-4 -mb-4 mt-3 flex items-center justify-end gap-2 px-4 py-3 bg-neutral-50/60 border-t border-neutral-100 rounded-b-xl">
          <button
            onClick={() => {
              setName("");
              onClose();
            }}
            className="h-8 px-3 rounded-full text-sm font-medium text-neutral-700 hover:bg-neutral-100 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={() => {
              onCreate(name);
              setName("");
              onClose();
            }}
            disabled={!name.trim()}
            className={cn(
              "h-8 px-4 rounded-full text-sm font-medium transition-colors",
              !name.trim()
                ? "bg-neutral-200 text-neutral-400 cursor-not-allowed"
                : "bg-neutral-950 text-white hover:bg-neutral-800"
            )}
          >
            Create key
          </button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

// =============================================================
// Webhooks tab
// =============================================================

type WebhookEndpoint = {
  id: string;
  url: string;
  events: string[];
  status: "active" | "paused";
  lastDelivery: string;
};

const SEED_HOOKS: WebhookEndpoint[] = [
  { id: "wh1", url: "https://api.cheezious.pk/hooks/calls",   events: ["call.completed", "call.escalated"], status: "active", lastDelivery: "3m ago" },
  { id: "wh2", url: "https://hooks.zapier.com/cheezious/orders", events: ["tool.invoked"],                  status: "active", lastDelivery: "12m ago" },
];

function WebhooksTab() {
  const [hooks, setHooks] = useState<WebhookEndpoint[]>(SEED_HOOKS);
  const [secretShown, setSecretShown] = useState(false);
  const [newUrl, setNewUrl] = useState("");

  return (
    <Card
      title="Webhook endpoints"
      subtitle="Receive real-time events when calls complete, tools fire, or escalations happen."
    >
      <div className="rounded-xl border border-neutral-200 bg-white px-4 py-3 mb-3">
        <div className="flex items-center gap-3">
          <div className="flex-1 min-w-0">
            <p className="text-[10px] uppercase tracking-widest text-neutral-500 font-semibold mb-0.5">
              Signing secret
            </p>
            <p className="text-[12px] font-mono text-neutral-800">
              {secretShown ? "whsec_8a2f4b5c7d3e1f0a9b8c6d5e4f3a2b1c" : `whsec_${"·".repeat(32)}`}
            </p>
          </div>
          <button
            onClick={() => setSecretShown((s) => !s)}
            className="size-8 rounded-md hover:bg-neutral-100 flex items-center justify-center text-neutral-600"
            aria-label="Reveal secret"
          >
            {secretShown ? <EyeOff className="size-3.5" /> : <Eye className="size-3.5" />}
          </button>
          <button
            onClick={() => {
              navigator.clipboard?.writeText("whsec_8a2f4b5c7d3e1f0a9b8c6d5e4f3a2b1c").catch(() => {});
              toast("Secret copied");
            }}
            className="size-8 rounded-md hover:bg-neutral-100 flex items-center justify-center text-neutral-600"
            aria-label="Copy secret"
          >
            <Copy className="size-3.5" />
          </button>
        </div>
      </div>

      <div className="space-y-2 mb-3">
        {hooks.map((h) => (
          <div
            key={h.id}
            className="rounded-xl border border-neutral-200 bg-white px-4 py-3 flex items-center gap-3"
          >
            <div className="flex-1 min-w-0">
              <p className="text-sm font-mono truncate">{h.url}</p>
              <div className="flex items-center gap-2 mt-0.5">
                {h.events.map((e) => (
                  <span
                    key={e}
                    className="px-1.5 py-0.5 rounded text-[9px] font-semibold uppercase tracking-wider bg-neutral-100 text-neutral-700"
                  >
                    {e}
                  </span>
                ))}
                <span className="text-[10px] text-neutral-500">
                  · last delivery {h.lastDelivery}
                </span>
              </div>
            </div>
            <span
              className={cn(
                "inline-flex items-center gap-1 text-[10px] font-medium",
                h.status === "active" ? "text-emerald-700" : "text-neutral-500"
              )}
            >
              <span
                className={cn(
                  "size-1.5 rounded-full",
                  h.status === "active" ? "bg-emerald-500 animate-pulse" : "bg-neutral-300"
                )}
              />
              {h.status === "active" ? "Active" : "Paused"}
            </span>
            <button
              onClick={() => {
                setHooks((prev) => prev.filter((x) => x.id !== h.id));
                toast("Webhook removed");
              }}
              className="size-8 rounded-md hover:bg-neutral-100 flex items-center justify-center text-neutral-600"
              aria-label="Remove webhook"
            >
              <Trash2 className="size-3.5" />
            </button>
          </div>
        ))}
      </div>

      <div className="flex items-center gap-2">
        <Input
          value={newUrl}
          onChange={(e) => setNewUrl(e.target.value)}
          placeholder="https://your-endpoint.com/hook"
          className="flex-1 h-10 font-mono text-[12px]"
        />
        <button
          onClick={() => {
            if (!newUrl.trim()) return;
            setHooks((prev) => [
              {
                id: `wh_${Date.now()}`,
                url: newUrl,
                events: ["call.completed"],
                status: "active",
                lastDelivery: "never",
              },
              ...prev,
            ]);
            setNewUrl("");
            toast("Webhook added");
          }}
          disabled={!newUrl.trim()}
          className={cn(
            "inline-flex items-center gap-1.5 h-10 px-3 rounded-md text-sm font-medium transition-colors",
            !newUrl.trim()
              ? "bg-neutral-200 text-neutral-400 cursor-not-allowed"
              : "bg-neutral-950 text-white hover:bg-neutral-800"
          )}
        >
          <Plus className="size-3.5" />
          Add endpoint
        </button>
      </div>
    </Card>
  );
}

// =============================================================
// Shared
// =============================================================

function Card({
  title,
  subtitle,
  action,
  children,
}: {
  title: string;
  subtitle?: string;
  action?: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <div className="rounded-2xl border border-neutral-200 bg-white p-5">
      <div className="flex items-start justify-between gap-3 mb-4">
        <div>
          <h2 className="text-base font-semibold tracking-tight">{title}</h2>
          {subtitle && (
            <p className="text-[12px] text-neutral-500 mt-0.5">{subtitle}</p>
          )}
        </div>
        {action}
      </div>
      {children}
    </div>
  );
}

function Row({ children }: { children: React.ReactNode }) {
  return <div className="space-y-1.5">{children}</div>;
}

function SaveButton({ onClick }: { onClick: () => void }) {
  const [saved, setSaved] = useState(false);
  return (
    <button
      onClick={() => {
        onClick();
        setSaved(true);
        setTimeout(() => setSaved(false), 1500);
      }}
      className="mt-4 inline-flex items-center gap-2 h-9 px-4 rounded-full bg-neutral-950 text-white text-sm font-medium hover:bg-neutral-800 transition-colors"
    >
      {saved ? <Check className="size-3.5" /> : null}
      {saved ? "Saved" : "Save changes"}
    </button>
  );
}
