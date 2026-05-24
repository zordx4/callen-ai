// Integrations — functional. Matches the ElevenLabs reference image:
// header with Alpha badge + "Add integration" button, search, sort, connected
// table, and a marketplace grid of providers. Each marketplace card installs
// with one click; the "Add integration" button opens a custom MCP server modal.

"use client";

import { useMemo, useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  Search,
  Plus,
  ArrowUpDown,
  CheckCircle2,
  Loader2,
  AlertCircle,
  Trash2,
  ChevronRight,
  Server,
  HelpCircle,
  Filter,
} from "lucide-react";
import { toast } from "sonner";

import { cn } from "@/lib/utils";
import {
  useWorkspaceStore,
  useWorkspaceHydrated,
  INTEGRATION_PROVIDERS,
  type IntegrationProvider,
  type ConnectedIntegration,
} from "@/lib/workspace-store";
import { useAppStore } from "@/lib/store";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from "@/components/ui/sheet";

type SortBy = "recent" | "name";

// =============================================================
// Page
// =============================================================

export default function IntegrationsPage() {
  const hydrated = useWorkspaceHydrated();
  const integrations = useWorkspaceStore((s) => s.integrations);
  const installIntegration = useWorkspaceStore((s) => s.installIntegration);
  const removeIntegration = useWorkspaceStore((s) => s.removeIntegration);
  const user = useAppStore((s) => s.user);
  const creatorName = user?.name ?? "Muhammad Talha";

  const [search, setSearch] = useState("");
  const [sortBy, setSortBy] = useState<SortBy>("recent");
  const [drawerId, setDrawerId] = useState<string | null>(null);
  const [customOpen, setCustomOpen] = useState(false);

  const filteredConnected = useMemo(() => {
    let list = [...integrations];
    if (search) {
      const q = search.toLowerCase();
      list = list.filter(
        (i) =>
          i.name.toLowerCase().includes(q) ||
          i.category.toLowerCase().includes(q)
      );
    }
    if (sortBy === "name") {
      list.sort((a, b) => a.name.localeCompare(b.name));
    } else {
      list.sort((a, b) => b.connectedAt.localeCompare(a.connectedAt));
    }
    return list;
  }, [integrations, search, sortBy]);

  const filteredMarketplace = useMemo(() => {
    const installedIds = new Set(integrations.map((i) => i.providerId));
    let list = INTEGRATION_PROVIDERS.filter((p) => !installedIds.has(p.id));
    if (search) {
      const q = search.toLowerCase();
      list = list.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          p.category.toLowerCase().includes(q) ||
          p.description.toLowerCase().includes(q)
      );
    }
    return list;
  }, [integrations, search]);

  const drawerIntegration = drawerId ? integrations.find((i) => i.id === drawerId) : null;

  if (!hydrated) {
    return (
      <div className="p-6 lg:p-8 max-w-7xl mx-auto space-y-6">
        <Skeleton className="h-10 w-48" />
        <Skeleton className="h-12" />
        <Skeleton className="h-64" />
      </div>
    );
  }

  return (
    <div className="p-6 lg:p-8 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex items-start justify-between gap-4 mb-6">
        <div className="flex items-center gap-2.5">
          <h1 className="text-3xl md:text-4xl font-bold tracking-tight">Integrations</h1>
          <span className="inline-flex items-center px-2 py-0.5 rounded-full bg-neutral-100 text-neutral-700 text-[10px] font-semibold tracking-wide border border-neutral-200">
            Alpha
          </span>
        </div>
        <button
          onClick={() => setCustomOpen(true)}
          className="inline-flex items-center gap-2 h-10 px-4 rounded-full bg-neutral-950 text-white text-sm font-medium hover:bg-neutral-800 transition-colors"
        >
          <Plus className="size-3.5" />
          Add integration
        </button>
      </div>

      {/* Search + sort */}
      <div className="flex flex-col sm:flex-row gap-2 mb-5">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-3.5 text-neutral-400 pointer-events-none" />
          <Input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search integrations..."
            className="pl-9 h-11 bg-white border-neutral-200"
          />
        </div>
        <SortDropdown sortBy={sortBy} setSortBy={setSortBy} />
      </div>

      {/* Connected integrations table */}
      <div className="rounded-2xl border border-neutral-200 bg-white overflow-hidden mb-8">
        <div className="grid grid-cols-12 px-4 py-2.5 bg-neutral-50/50 border-b border-neutral-200 text-[10px] uppercase tracking-widest font-semibold text-neutral-500">
          <div className="col-span-5">Name</div>
          <div className="col-span-3">Created by</div>
          <div className="col-span-3">Date created</div>
          <div className="col-span-1 text-right">Status</div>
        </div>

        {filteredConnected.length === 0 ? (
          <div className="px-4 py-12 text-center">
            <div className="size-12 rounded-full mx-auto mb-3 relative">
              <svg viewBox="0 0 48 48" className="size-12 text-neutral-300" fill="none">
                <circle cx="24" cy="24" r="20" stroke="currentColor" strokeWidth="1.5" strokeDasharray="3 3" />
                <path d="M16 24 Q 24 14 32 24 T 24 34" stroke="currentColor" strokeWidth="1.5" fill="none" />
              </svg>
              <div className="absolute -top-1 -right-2 size-5 rounded-full bg-white border border-neutral-200 flex items-center justify-center">
                <HelpCircle className="size-3 text-neutral-500" />
              </div>
            </div>
            <p className="text-sm font-semibold tracking-tight">No integrations configured</p>
            <p className="text-xs text-neutral-500 mt-1">
              Create a new custom MCP server or browse our library of integrations below.
            </p>
          </div>
        ) : (
          <AnimatePresence initial={false}>
            {filteredConnected.map((c) => (
              <motion.button
                key={c.id}
                layout
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2 }}
                onClick={() => setDrawerId(c.id)}
                className="w-full text-left grid grid-cols-12 px-4 py-3 border-b border-neutral-100 last:border-b-0 hover:bg-neutral-50/50 transition-colors group items-center"
              >
                <div className="col-span-5 flex items-center gap-2.5 min-w-0">
                  <IntegrationAvatar
                    name={c.name}
                    providerId={c.providerId}
                    isCustom={c.isCustom}
                  />
                  <div className="min-w-0">
                    <p className="text-sm font-semibold tracking-tight truncate">{c.name}</p>
                    <p className="text-[11px] text-neutral-500 truncate">{c.category}</p>
                  </div>
                </div>
                <div className="col-span-3 text-[12px] text-neutral-700 truncate">{c.createdByName}</div>
                <div className="col-span-3 text-[12px] text-neutral-600 tabular-nums">
                  {new Date(c.connectedAt).toLocaleDateString()}
                </div>
                <div className="col-span-1 flex items-center justify-end gap-2">
                  <ConnectionStatusPill status={c.status} />
                  <ChevronRight className="size-3.5 text-neutral-400 group-hover:text-neutral-700" />
                </div>
              </motion.button>
            ))}
          </AnimatePresence>
        )}
      </div>

      {/* Marketplace grid */}
      <div className="mb-5">
        <p className="text-[11px] uppercase tracking-widest text-neutral-500 font-semibold mb-3">
          Browse providers
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {filteredMarketplace.map((p) => (
            <MarketplaceCard
              key={p.id}
              provider={p}
              onInstall={() => {
                installIntegration(p.id, creatorName);
                toast(`${p.name} installed`, {
                  description: "Your agent can now use this integration.",
                });
              }}
            />
          ))}
          {filteredMarketplace.length === 0 && (
            <p className="col-span-full text-center text-[12px] text-neutral-400 py-10">
              No more providers to install.
            </p>
          )}
        </div>
      </div>

      {/* Add custom MCP server modal */}
      <AddCustomIntegrationDialog
        open={customOpen}
        onClose={() => setCustomOpen(false)}
      />

      {/* Drawer */}
      <Sheet open={!!drawerIntegration} onOpenChange={(o) => !o && setDrawerId(null)}>
        <SheetContent side="right" className="w-full sm:max-w-md p-6 overflow-y-auto">
          {drawerIntegration && (
            <IntegrationDrawer
              integration={drawerIntegration}
              onDelete={() => {
                removeIntegration(drawerIntegration.id);
                setDrawerId(null);
                toast("Integration disconnected");
              }}
            />
          )}
        </SheetContent>
      </Sheet>
    </div>
  );
}

// =============================================================
// Avatar
// =============================================================

function IntegrationAvatar({
  name,
  providerId,
  isCustom,
}: {
  name: string;
  providerId: string;
  isCustom?: boolean;
}) {
  const provider = INTEGRATION_PROVIDERS.find((p) => p.id === providerId);
  if (isCustom) {
    return (
      <span className="size-8 rounded-lg bg-neutral-100 flex items-center justify-center shrink-0">
        <Server className="size-4 text-neutral-700" />
      </span>
    );
  }
  return (
    <span
      className="size-8 rounded-lg flex items-center justify-center shrink-0 text-white text-[11px] font-bold relative overflow-hidden"
      style={{
        background:
          provider?.avatar ?? "radial-gradient(circle at 30% 30%, #f5f5f5 0%, #525252 45%, #0a0a0a 100%)",
      }}
    >
      <span className="relative drop-shadow">{name.charAt(0)}</span>
    </span>
  );
}

// =============================================================
// Sort dropdown
// =============================================================

function SortDropdown({
  sortBy,
  setSortBy,
}: {
  sortBy: SortBy;
  setSortBy: (s: SortBy) => void;
}) {
  const [open, setOpen] = useState(false);
  const label = sortBy === "recent" ? "Recent" : "Name";
  return (
    <div className="relative">
      <button
        onClick={() => setOpen((v) => !v)}
        className="inline-flex items-center gap-2 h-11 px-4 rounded-md border border-neutral-200 bg-white text-sm font-medium text-neutral-700 hover:border-neutral-300 transition-colors"
      >
        <ArrowUpDown className="size-3.5" />
        {label}
        <Filter className="size-3 text-neutral-400" />
      </button>
      {open && (
        <>
          <div className="fixed inset-0 z-30" onClick={() => setOpen(false)} />
          <div className="absolute right-0 top-full mt-1.5 z-40 min-w-[180px] rounded-lg border border-neutral-200 bg-white shadow-lg py-1">
            {(["recent", "name"] as SortBy[]).map((s) => (
              <button
                key={s}
                onClick={() => {
                  setSortBy(s);
                  setOpen(false);
                }}
                className={cn(
                  "w-full text-left px-3 py-1.5 text-[12px] hover:bg-neutral-50 transition-colors capitalize",
                  sortBy === s && "font-semibold"
                )}
              >
                {s === "recent" ? "Recently added" : "Alphabetical"}
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  );
}

// =============================================================
// Connection status pill
// =============================================================

function ConnectionStatusPill({ status }: { status: ConnectedIntegration["status"] }) {
  if (status === "connected") {
    return (
      <span className="inline-flex items-center gap-1 text-[10px] text-emerald-700 font-medium">
        <CheckCircle2 className="size-3" />
        Connected
      </span>
    );
  }
  if (status === "pending") {
    return (
      <span className="inline-flex items-center gap-1 text-[10px] text-amber-700 font-medium">
        <Loader2 className="size-3 animate-spin" />
        Pending
      </span>
    );
  }
  return (
    <span className="inline-flex items-center gap-1 text-[10px] text-rose-700 font-medium">
      <AlertCircle className="size-3" />
      Error
    </span>
  );
}

// =============================================================
// Marketplace card
// =============================================================

function MarketplaceCard({
  provider,
  onInstall,
}: {
  provider: IntegrationProvider;
  onInstall: () => void;
}) {
  return (
    <div className="rounded-2xl border border-neutral-200 bg-white p-4 hover:border-neutral-300 hover:shadow-sm transition-all duration-200 group flex flex-col">
      <div className="flex items-center gap-2.5 mb-2.5">
        <span
          className="size-8 rounded-lg flex items-center justify-center shrink-0 text-white text-[11px] font-bold relative overflow-hidden"
          style={{ background: provider.avatar }}
        >
          <span className="relative drop-shadow">{provider.name.charAt(0)}</span>
        </span>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-semibold tracking-tight">{provider.name}</p>
          <p className="text-[11px] text-neutral-500">{provider.category}</p>
        </div>
      </div>
      <p className="text-[12px] text-neutral-600 leading-relaxed mb-3 flex-1">
        {provider.description}
      </p>
      <button
        onClick={onInstall}
        className="self-start inline-flex items-center gap-1.5 h-7 px-2.5 rounded-full bg-neutral-100 text-neutral-900 text-[11px] font-medium hover:bg-neutral-200 transition-colors"
      >
        <Plus className="size-3" />
        Install
      </button>
    </div>
  );
}

// =============================================================
// Custom MCP integration dialog
// =============================================================

function AddCustomIntegrationDialog({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  const addCustomIntegration = useWorkspaceStore((s) => s.addCustomIntegration);
  const user = useAppStore((s) => s.user);
  const creatorName = user?.name ?? "Muhammad Talha";

  const [name, setName] = useState("");
  const [category, setCategory] = useState("Custom");
  const [endpoint, setEndpoint] = useState("");
  const [apiKey, setApiKey] = useState("");
  const [description, setDescription] = useState("");

  const reset = () => {
    setName("");
    setCategory("Custom");
    setEndpoint("");
    setApiKey("");
    setDescription("");
  };

  const submit = () => {
    if (!name.trim()) return;
    addCustomIntegration(name, category, creatorName);
    toast("Custom integration added", {
      description: "Your custom MCP server is connected.",
    });
    reset();
    onClose();
  };

  return (
    <Dialog
      open={open}
      onOpenChange={(o) => {
        if (!o) {
          reset();
          onClose();
        }
      }}
    >
      <DialogContent className="sm:max-w-md">
        <div className="flex items-center gap-2 mb-1">
          <span className="size-7 rounded-md bg-neutral-100 flex items-center justify-center">
            <Server className="size-4 text-neutral-700" />
          </span>
          <DialogTitle>Add custom integration</DialogTitle>
        </div>
        <DialogDescription>
          Connect a custom MCP server. The agent will use your endpoint and credentials when it calls the integration.
        </DialogDescription>

        <div className="space-y-3 mt-2">
          <div className="space-y-1.5">
            <Label htmlFor="int-name" className="text-xs">Integration name</Label>
            <Input
              id="int-name"
              placeholder="Internal POS"
              value={name}
              onChange={(e) => setName(e.target.value)}
              autoFocus
            />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="int-cat" className="text-xs">Category</Label>
            <Input
              id="int-cat"
              placeholder="Custom"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
            />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="int-endpoint" className="text-xs">MCP server URL</Label>
            <Input
              id="int-endpoint"
              placeholder="https://mcp.cheezious.pk"
              value={endpoint}
              onChange={(e) => setEndpoint(e.target.value)}
              className="font-mono text-[12px]"
            />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="int-apikey" className="text-xs">API key (optional)</Label>
            <Input
              id="int-apikey"
              placeholder="sk-..."
              type="password"
              value={apiKey}
              onChange={(e) => setApiKey(e.target.value)}
              className="font-mono text-[12px]"
            />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="int-desc" className="text-xs">Description</Label>
            <Textarea
              id="int-desc"
              placeholder="What this integration does, what tools it exposes."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={2}
            />
          </div>
        </div>

        <DialogFooterRow
          onCancel={() => {
            reset();
            onClose();
          }}
          onSubmit={submit}
          submitLabel="Connect"
          submitDisabled={!name.trim()}
        />
      </DialogContent>
    </Dialog>
  );
}

// =============================================================
// Drawer for connected integration
// =============================================================

function IntegrationDrawer({
  integration,
  onDelete,
}: {
  integration: ConnectedIntegration;
  onDelete: () => void;
}) {
  const provider = INTEGRATION_PROVIDERS.find((p) => p.id === integration.providerId);
  return (
    <>
      <SheetHeader className="px-0 mb-4">
        <div className="flex items-center gap-3 mb-2">
          <IntegrationAvatar name={integration.name} providerId={integration.providerId} isCustom={integration.isCustom} />
          <div className="flex-1 min-w-0">
            <SheetTitle className="text-base truncate">{integration.name}</SheetTitle>
            <SheetDescription className="text-xs">
              {integration.category} · connected {new Date(integration.connectedAt).toLocaleDateString()}
            </SheetDescription>
          </div>
        </div>
      </SheetHeader>

      <div className="space-y-5 text-[13px]">
        <Detail label="Status">
          <ConnectionStatusPill status={integration.status} />
        </Detail>
        {provider && (
          <Detail label="Description">
            <p className="text-neutral-700 leading-relaxed">{provider.description}</p>
          </Detail>
        )}
        <Detail label="Created by">
          <p className="text-neutral-800">{integration.createdByName}</p>
          <p className="text-[11px] text-neutral-500 mt-0.5">
            {new Date(integration.connectedAt).toLocaleString()}
          </p>
        </Detail>
        <Detail label="Exposed tools">
          <p className="text-[12px] text-neutral-500 italic">
            Tools synced from this integration appear under /tools with the integration tag.
          </p>
        </Detail>
      </div>

      <button
        onClick={onDelete}
        className="mt-6 w-full inline-flex items-center justify-center gap-2 h-9 rounded-full bg-rose-50 text-rose-700 border border-rose-100 hover:bg-rose-100 text-sm font-medium transition-colors"
      >
        <Trash2 className="size-3.5" />
        Disconnect integration
      </button>
    </>
  );
}

function Detail({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <p className="text-[10px] uppercase tracking-widest text-neutral-500 font-semibold mb-1.5">{label}</p>
      {children}
    </div>
  );
}

function DialogFooterRow({
  onCancel,
  onSubmit,
  submitLabel,
  submitDisabled,
}: {
  onCancel: () => void;
  onSubmit: () => void;
  submitLabel: string;
  submitDisabled?: boolean;
}) {
  return (
    <div className="-mx-4 -mb-4 mt-3 flex items-center justify-end gap-2 px-4 py-3 bg-neutral-50/60 border-t border-neutral-100 rounded-b-xl">
      <button
        onClick={onCancel}
        className="h-8 px-3 rounded-full text-sm font-medium text-neutral-700 hover:bg-neutral-100 transition-colors"
      >
        Cancel
      </button>
      <button
        onClick={onSubmit}
        disabled={submitDisabled}
        className={cn(
          "h-8 px-4 rounded-full text-sm font-medium transition-colors",
          submitDisabled
            ? "bg-neutral-200 text-neutral-400 cursor-not-allowed"
            : "bg-neutral-950 text-white hover:bg-neutral-800"
        )}
      >
        {submitLabel}
      </button>
    </div>
  );
}
