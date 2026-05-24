// Tools — functional. Matches the ElevenLabs reference image:
// 3 quick-action cards (Add webhook tool / Add client tool / Add Integration
// tool), search + Type / Creator filters, tools list, drawer with full schema.

"use client";

import { useMemo, useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  BookOpenText,
  Webhook,
  Wrench,
  Boxes,
  Search,
  Trash2,
  Plus,
  X,
  ChevronRight,
} from "lucide-react";
import { toast } from "sonner";

import { cn } from "@/lib/utils";
import {
  useWorkspaceStore,
  useWorkspaceHydrated,
  INTEGRATION_PROVIDERS,
  type ToolItem,
  type ToolKind,
  type ToolParam,
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

// =============================================================
// Page
// =============================================================

type ModalKind = ToolKind | null;

export default function ToolsPage() {
  const hydrated = useWorkspaceHydrated();
  const tools = useWorkspaceStore((s) => s.tools);
  const removeTool = useWorkspaceStore((s) => s.removeTool);

  const [modal, setModal] = useState<ModalKind>(null);
  const [search, setSearch] = useState("");
  const [kindFilter, setKindFilter] = useState<ToolKind | "all">("all");
  const [creatorFilter, setCreatorFilter] = useState<string | "all">("all");
  const [drawerId, setDrawerId] = useState<string | null>(null);

  const creators = useMemo(
    () => Array.from(new Set(tools.map((t) => t.creatorName))),
    [tools]
  );

  const filtered = useMemo(() => {
    return tools.filter((t) => {
      if (kindFilter !== "all" && t.kind !== kindFilter) return false;
      if (creatorFilter !== "all" && t.creatorName !== creatorFilter)
        return false;
      if (search) {
        const q = search.toLowerCase();
        if (
          !t.name.toLowerCase().includes(q) &&
          !t.description.toLowerCase().includes(q) &&
          !(t.endpoint ?? "").toLowerCase().includes(q)
        ) {
          return false;
        }
      }
      return true;
    });
  }, [tools, search, kindFilter, creatorFilter]);

  const drawerTool = drawerId ? tools.find((t) => t.id === drawerId) : null;

  if (!hydrated) {
    return (
      <div className="p-6 lg:p-8 max-w-7xl mx-auto space-y-6">
        <Skeleton className="h-10 w-48" />
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
          {[1, 2, 3].map((i) => <Skeleton key={i} className="h-24" />)}
        </div>
        <Skeleton className="h-12" />
        <Skeleton className="h-64" />
      </div>
    );
  }

  return (
    <div className="p-6 lg:p-8 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex items-center gap-2.5 mb-6">
        <h1 className="text-3xl md:text-4xl font-bold tracking-tight">Tools</h1>
        <span className="inline-flex items-center justify-center size-7 rounded-md bg-neutral-100 text-neutral-700">
          <BookOpenText className="size-4" />
        </span>
      </div>

      {/* Quick action cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-6">
        <QuickActionCard icon={Webhook} label="Add webhook tool"     onClick={() => setModal("webhook")} />
        <QuickActionCard icon={Wrench}  label="Add client tool"      onClick={() => setModal("client")} />
        <QuickActionCard icon={Boxes}   label="Add Integration tool" onClick={() => setModal("integration")} />
      </div>

      {/* Search */}
      <div className="relative mb-3">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-3.5 text-neutral-400 pointer-events-none" />
        <Input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search tools..."
          className="pl-9 h-11 bg-white border-neutral-200"
        />
      </div>

      {/* Filter chips */}
      <div className="flex flex-wrap gap-2 mb-5">
        <FilterChip
          label="Type"
          value={kindFilter}
          onClear={() => setKindFilter("all")}
          options={[
            { value: "all",         label: "All types" },
            { value: "webhook",     label: "Webhook" },
            { value: "client",      label: "Client" },
            { value: "integration", label: "Integration" },
          ]}
          onSelect={(v) => setKindFilter(v as ToolKind | "all")}
        />
        <FilterChip
          label="Creator"
          value={creatorFilter}
          onClear={() => setCreatorFilter("all")}
          options={[
            { value: "all", label: "All creators" },
            ...creators.map((c) => ({ value: c, label: c })),
          ]}
          onSelect={(v) => setCreatorFilter(v)}
        />
      </div>

      {/* Tools list or empty state */}
      {filtered.length === 0 ? (
        <EmptyTools hasAny={tools.length > 0} />
      ) : (
        <ToolsTable
          tools={filtered}
          onOpen={(id) => setDrawerId(id)}
          onDelete={(id) => {
            removeTool(id);
            toast("Tool removed");
          }}
        />
      )}

      {/* Modals */}
      <AddToolDialog
        kind="webhook"
        open={modal === "webhook"}
        onClose={() => setModal(null)}
      />
      <AddToolDialog
        kind="client"
        open={modal === "client"}
        onClose={() => setModal(null)}
      />
      <AddToolDialog
        kind="integration"
        open={modal === "integration"}
        onClose={() => setModal(null)}
      />

      {/* Drawer */}
      <Sheet
        open={!!drawerTool}
        onOpenChange={(o) => !o && setDrawerId(null)}
      >
        <SheetContent side="right" className="w-full sm:max-w-md p-6 overflow-y-auto">
          {drawerTool && (
            <ToolDrawer
              tool={drawerTool}
              onDelete={() => {
                removeTool(drawerTool.id);
                setDrawerId(null);
                toast("Tool removed");
              }}
            />
          )}
        </SheetContent>
      </Sheet>
    </div>
  );
}

// =============================================================
// Quick action card
// =============================================================

function QuickActionCard({
  icon: Icon,
  label,
  onClick,
}: {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className="text-left rounded-2xl border border-neutral-200 bg-white p-4 hover:border-neutral-300 hover:shadow-sm transition-all duration-200"
    >
      <Icon className="size-5 text-neutral-900 mb-2.5" />
      <p className="text-sm font-semibold tracking-tight">{label}</p>
    </button>
  );
}

// =============================================================
// Filter chip (reused style)
// =============================================================

function FilterChip({
  label,
  value,
  options,
  onSelect,
  onClear,
}: {
  label: string;
  value: string;
  options: { value: string; label: string }[];
  onSelect: (v: string) => void;
  onClear: () => void;
}) {
  const [open, setOpen] = useState(false);
  const active = value !== "all";
  const activeLabel = options.find((o) => o.value === value)?.label;

  return (
    <div className="relative">
      <button
        onClick={() => setOpen((v) => !v)}
        className={cn(
          "inline-flex items-center gap-1.5 px-2.5 h-7 rounded-full border text-[12px] font-medium transition-colors",
          active
            ? "bg-neutral-950 text-white border-neutral-950"
            : "bg-white text-neutral-700 border-neutral-200 hover:border-neutral-300"
        )}
      >
        {active ? null : <Plus className="size-3" />}
        <span>
          {label}
          {active ? ": " : ""}
          {active ? activeLabel : ""}
        </span>
        {active && (
          <span
            onClick={(e) => {
              e.stopPropagation();
              onClear();
            }}
            className="ml-0.5 hover:bg-white/15 rounded-full p-0.5"
          >
            <X className="size-3" />
          </span>
        )}
      </button>
      {open && (
        <>
          <div className="fixed inset-0 z-30" onClick={() => setOpen(false)} />
          <div className="absolute left-0 top-full mt-1.5 z-40 min-w-[180px] rounded-lg border border-neutral-200 bg-white shadow-lg py-1">
            {options.map((opt) => (
              <button
                key={opt.value}
                onClick={() => {
                  onSelect(opt.value);
                  setOpen(false);
                }}
                className={cn(
                  "w-full text-left px-3 py-1.5 text-[12px] hover:bg-neutral-50 transition-colors",
                  value === opt.value && "font-semibold"
                )}
              >
                {opt.label}
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  );
}

// =============================================================
// Empty state
// =============================================================

function EmptyTools({ hasAny }: { hasAny: boolean }) {
  return (
    <div className="rounded-2xl border border-neutral-200 bg-neutral-50/40 p-12 text-center">
      <div className="size-12 rounded-2xl bg-white border border-neutral-200 mx-auto mb-4 flex items-center justify-center">
        <Wrench className="size-5 text-neutral-700" />
      </div>
      <p className="text-sm font-semibold tracking-tight">
        {hasAny ? "No matching tools" : "No tools found"}
      </p>
      <p className="text-xs text-neutral-500 mt-1">
        {hasAny ? "Try adjusting your filters." : "You don't have any tools yet."}
      </p>
    </div>
  );
}

// =============================================================
// Tools table
// =============================================================

function ToolsTable({
  tools,
  onOpen,
  onDelete,
}: {
  tools: ToolItem[];
  onOpen: (id: string) => void;
  onDelete: (id: string) => void;
}) {
  return (
    <div className="rounded-2xl border border-neutral-200 bg-white overflow-hidden">
      <div className="grid grid-cols-12 px-4 py-2.5 bg-neutral-50/50 border-b border-neutral-200 text-[10px] uppercase tracking-widest font-semibold text-neutral-500">
        <div className="col-span-5">Name</div>
        <div className="col-span-2">Type</div>
        <div className="col-span-1 text-right">Calls</div>
        <div className="col-span-1 text-right">Success</div>
        <div className="col-span-2">Created by</div>
        <div className="col-span-1 text-right">Actions</div>
      </div>
      <AnimatePresence initial={false}>
        {tools.map((t) => (
          <motion.button
            key={t.id}
            layout
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={() => onOpen(t.id)}
            className="w-full text-left grid grid-cols-12 px-4 py-3 border-b border-neutral-100 last:border-b-0 hover:bg-neutral-50/50 transition-colors group items-center"
          >
            <div className="col-span-5 flex items-center gap-2.5 min-w-0">
              <ToolKindIcon kind={t.kind} />
              <div className="min-w-0">
                <p className="text-sm font-semibold tracking-tight truncate font-mono">{t.name}</p>
                <p className="text-[11px] text-neutral-500 truncate">{t.description}</p>
              </div>
            </div>
            <div className="col-span-2 text-[12px] text-neutral-600 capitalize">
              {t.kind === "webhook"
                ? `${t.method ?? "POST"} webhook`
                : t.kind === "client"
                ? "Client"
                : `${t.integrationProvider ?? "Integration"}`}
            </div>
            <div className="col-span-1 text-right text-[12px] text-neutral-700 font-mono tabular-nums">
              {t.invocations.toLocaleString()}
            </div>
            <div className="col-span-1 text-right text-[12px] text-neutral-700 font-mono tabular-nums">
              {Math.round(t.successRate * 100)}%
            </div>
            <div className="col-span-2 text-[12px] text-neutral-600 truncate">{t.creatorName}</div>
            <div className="col-span-1 flex items-center justify-end gap-2">
              <ChevronRight className="size-3.5 text-neutral-400 group-hover:text-neutral-700" />
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onDelete(t.id);
                }}
                className="opacity-0 group-hover:opacity-100 transition-opacity p-1 rounded hover:bg-neutral-100"
                aria-label="Delete tool"
              >
                <Trash2 className="size-3.5 text-neutral-500" />
              </button>
            </div>
          </motion.button>
        ))}
      </AnimatePresence>
    </div>
  );
}

function ToolKindIcon({ kind }: { kind: ToolKind }) {
  const Map = { webhook: Webhook, client: Wrench, integration: Boxes } as const;
  const Icon = Map[kind];
  return (
    <span className="size-8 rounded-lg bg-neutral-100 flex items-center justify-center shrink-0">
      <Icon className="size-4 text-neutral-700" />
    </span>
  );
}

// =============================================================
// Drawer
// =============================================================

function ToolDrawer({ tool, onDelete }: { tool: ToolItem; onDelete: () => void }) {
  // Build a JSON-schema preview that looks like real MCP tool definitions
  const schemaPreview = useMemo(() => {
    const properties: Record<string, { type: string; description: string }> = {};
    const required: string[] = [];
    tool.parameters.forEach((p) => {
      properties[p.name] = { type: p.type, description: p.description };
      if (p.required) required.push(p.name);
    });
    return JSON.stringify(
      { name: tool.name, description: tool.description, parameters: { type: "object", properties, required } },
      null,
      2
    );
  }, [tool]);

  return (
    <>
      <SheetHeader className="px-0 mb-4">
        <div className="flex items-center gap-3 mb-2">
          <ToolKindIcon kind={tool.kind} />
          <div className="flex-1 min-w-0">
            <SheetTitle className="text-base truncate font-mono">{tool.name}</SheetTitle>
            <SheetDescription className="text-xs">
              {tool.kind === "webhook" ? `${tool.method ?? "POST"} webhook` : tool.kind === "client" ? "Client tool" : `${tool.integrationProvider} integration`}
              {" · "}
              {tool.invocations.toLocaleString()} calls · {Math.round(tool.successRate * 100)}% success
            </SheetDescription>
          </div>
        </div>
      </SheetHeader>

      <div className="space-y-5 text-[13px]">
        <Detail label="Description">
          <p className="text-neutral-800 leading-relaxed">{tool.description}</p>
        </Detail>

        {tool.endpoint && (
          <Detail label="Endpoint">
            <pre className="font-mono text-[11px] bg-neutral-50 border border-neutral-200 rounded-lg px-2.5 py-1.5 text-neutral-800 break-all">
              {tool.method} {tool.endpoint}
            </pre>
          </Detail>
        )}

        <Detail label={`Parameters (${tool.parameters.length})`}>
          <ul className="space-y-1.5">
            {tool.parameters.map((p) => (
              <li
                key={p.name}
                className="rounded-lg border border-neutral-200 px-3 py-2 bg-white text-[12px]"
              >
                <div className="flex items-center gap-2">
                  <span className="font-mono font-semibold">{p.name}</span>
                  <span className="text-[10px] px-1.5 py-0.5 rounded bg-neutral-100 text-neutral-600 uppercase tracking-wider">
                    {p.type}
                  </span>
                  {p.required && (
                    <span className="text-[10px] px-1.5 py-0.5 rounded bg-rose-50 text-rose-700">
                      required
                    </span>
                  )}
                </div>
                <p className="text-[11px] text-neutral-500 mt-0.5">{p.description}</p>
              </li>
            ))}
          </ul>
        </Detail>

        <Detail label="Schema (MCP-compatible)">
          <pre className="text-[11px] leading-snug whitespace-pre-wrap font-mono bg-neutral-950 text-emerald-200 border border-neutral-200 rounded-xl p-3 max-h-60 overflow-auto">
            {schemaPreview}
          </pre>
        </Detail>

        <Detail label="Created by">
          <p className="text-neutral-800">{tool.creatorName}</p>
          <p className="text-[11px] text-neutral-500 mt-0.5">
            {new Date(tool.createdAt).toLocaleString()}
          </p>
        </Detail>
      </div>

      <button
        onClick={onDelete}
        className="mt-6 w-full inline-flex items-center justify-center gap-2 h-9 rounded-full bg-rose-50 text-rose-700 border border-rose-100 hover:bg-rose-100 text-sm font-medium transition-colors"
      >
        <Trash2 className="size-3.5" />
        Delete tool
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

// =============================================================
// Add tool dialog (shared for all three kinds)
// =============================================================

function AddToolDialog({
  kind,
  open,
  onClose,
}: {
  kind: ToolKind;
  open: boolean;
  onClose: () => void;
}) {
  const addTool = useWorkspaceStore((s) => s.addTool);
  const user = useAppStore((s) => s.user);
  const creatorName = user?.name ?? "Muhammad Talha";

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [endpoint, setEndpoint] = useState("");
  const [method, setMethod] = useState<"GET" | "POST" | "PUT" | "DELETE">("POST");
  const [provider, setProvider] = useState(INTEGRATION_PROVIDERS[0].name);
  const [params, setParams] = useState<ToolParam[]>([
    { name: "", type: "string", required: true, description: "" },
  ]);

  const reset = () => {
    setName("");
    setDescription("");
    setEndpoint("");
    setMethod("POST");
    setProvider(INTEGRATION_PROVIDERS[0].name);
    setParams([{ name: "", type: "string", required: true, description: "" }]);
  };

  const isValid =
    name.trim().length > 0 &&
    description.trim().length > 0 &&
    (kind !== "webhook" || endpoint.trim().length > 0);

  const submit = () => {
    if (!isValid) return;
    addTool({
      id: `tool_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`,
      name,
      kind,
      description,
      method: kind === "webhook" ? method : undefined,
      endpoint: kind === "webhook" ? endpoint : undefined,
      integrationProvider: kind === "integration" ? provider : undefined,
      parameters: params.filter((p) => p.name.trim().length > 0),
      createdAt: new Date().toISOString(),
      creatorId: "u1",
      creatorName,
      invocations: 0,
      successRate: 1,
    });
    toast("Tool created", {
      description: "Available for the agent on the next call.",
    });
    reset();
    onClose();
  };

  const title = kind === "webhook" ? "Add webhook tool" : kind === "client" ? "Add client tool" : "Add integration tool";
  const Icon = kind === "webhook" ? Webhook : kind === "client" ? Wrench : Boxes;

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
      <DialogContent className="sm:max-w-lg">
        <div className="flex items-center gap-2 mb-1">
          <span className="size-7 rounded-md bg-neutral-100 flex items-center justify-center">
            <Icon className="size-4 text-neutral-700" />
          </span>
          <DialogTitle>{title}</DialogTitle>
        </div>
        <DialogDescription>
          {kind === "webhook" && "Calls a JSON HTTP endpoint. The agent passes the parameters as a request body."}
          {kind === "client" && "Runs on the client (browser, mobile, IVR). No network call required."}
          {kind === "integration" && "Calls an existing integration. Pick a provider and the agent uses your saved credentials."}
        </DialogDescription>

        <div className="space-y-3 mt-2 max-h-[60vh] overflow-y-auto pr-1">
          <div className="grid grid-cols-1 gap-3">
            <div className="space-y-1.5">
              <Label htmlFor="tool-name" className="text-xs">Tool name (snake_case)</Label>
              <Input
                id="tool-name"
                placeholder="createOrder"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="font-mono"
                autoFocus
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="tool-desc" className="text-xs">Description</Label>
              <Textarea
                id="tool-desc"
                placeholder="What this tool does. The agent reads this to decide when to call it."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={2}
              />
            </div>

            {kind === "webhook" && (
              <div className="grid grid-cols-[100px_1fr] gap-2">
                <div className="space-y-1.5">
                  <Label className="text-xs">Method</Label>
                  <select
                    value={method}
                    onChange={(e) =>
                      setMethod(e.target.value as "GET" | "POST" | "PUT" | "DELETE")
                    }
                    className="h-10 w-full rounded-md border border-neutral-200 bg-white px-2.5 text-sm font-mono"
                  >
                    {["GET", "POST", "PUT", "DELETE"].map((m) => (
                      <option key={m}>{m}</option>
                    ))}
                  </select>
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="tool-endpoint" className="text-xs">Endpoint URL</Label>
                  <Input
                    id="tool-endpoint"
                    placeholder="https://api.cheezious.pk/orders"
                    value={endpoint}
                    onChange={(e) => setEndpoint(e.target.value)}
                    className="font-mono text-[12px]"
                  />
                </div>
              </div>
            )}

            {kind === "integration" && (
              <div className="space-y-1.5">
                <Label className="text-xs">Provider</Label>
                <select
                  value={provider}
                  onChange={(e) => setProvider(e.target.value)}
                  className="h-10 w-full rounded-md border border-neutral-200 bg-white px-2.5 text-sm"
                >
                  {INTEGRATION_PROVIDERS.map((p) => (
                    <option key={p.id} value={p.name}>
                      {p.name} · {p.category}
                    </option>
                  ))}
                </select>
              </div>
            )}

            <div>
              <Label className="text-xs">Parameters</Label>
              <div className="space-y-2 mt-1.5">
                {params.map((p, i) => (
                  <div
                    key={i}
                    className="grid grid-cols-[1fr_100px_auto_auto] gap-1.5 items-start rounded-lg border border-neutral-200 p-2 bg-neutral-50/40"
                  >
                    <div className="space-y-1">
                      <Input
                        placeholder="parameter name"
                        value={p.name}
                        onChange={(e) => {
                          const np = [...params];
                          np[i] = { ...np[i], name: e.target.value };
                          setParams(np);
                        }}
                        className="h-8 font-mono text-[12px]"
                      />
                      <Input
                        placeholder="description"
                        value={p.description}
                        onChange={(e) => {
                          const np = [...params];
                          np[i] = { ...np[i], description: e.target.value };
                          setParams(np);
                        }}
                        className="h-7 text-[11px]"
                      />
                    </div>
                    <select
                      value={p.type}
                      onChange={(e) => {
                        const np = [...params];
                        np[i] = { ...np[i], type: e.target.value as ToolParam["type"] };
                        setParams(np);
                      }}
                      className="h-8 rounded-md border border-neutral-200 bg-white px-2 text-[12px]"
                    >
                      <option value="string">string</option>
                      <option value="number">number</option>
                      <option value="boolean">boolean</option>
                    </select>
                    <button
                      onClick={() => {
                        const np = [...params];
                        np[i] = { ...np[i], required: !np[i].required };
                        setParams(np);
                      }}
                      className={cn(
                        "h-8 px-2 rounded-md text-[10px] font-semibold tracking-wider uppercase border",
                        p.required
                          ? "bg-neutral-950 text-white border-neutral-950"
                          : "bg-white text-neutral-600 border-neutral-200"
                      )}
                    >
                      Req
                    </button>
                    <button
                      onClick={() => setParams(params.filter((_, j) => j !== i))}
                      className="size-8 flex items-center justify-center rounded-md text-neutral-400 hover:bg-neutral-100 hover:text-neutral-900"
                      aria-label="Remove parameter"
                    >
                      <X className="size-3" />
                    </button>
                  </div>
                ))}
                <button
                  onClick={() =>
                    setParams([
                      ...params,
                      { name: "", type: "string", required: false, description: "" },
                    ])
                  }
                  className="inline-flex items-center gap-1.5 text-[12px] text-neutral-700 hover:text-neutral-900 font-medium"
                >
                  <Plus className="size-3" />
                  Add parameter
                </button>
              </div>
            </div>
          </div>
        </div>

        <DialogFooterRow
          onCancel={() => {
            reset();
            onClose();
          }}
          onSubmit={submit}
          submitLabel="Create tool"
          submitDisabled={!isValid}
        />
      </DialogContent>
    </Dialog>
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
