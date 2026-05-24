// Workspace store — Zustand slices for Knowledge Base, Tools, Integrations.
// Persisted to localStorage so created items survive page navigation and reloads.
// Uses skipHydration + useHasHydrated() pattern (same as main app store).

import { create } from "zustand";
import { persist } from "zustand/middleware";
import { useEffect, useState } from "react";

// =============================================================
// Types
// =============================================================

export type KbDocType = "url" | "file" | "text" | "folder";
export type KbDocStatus = "indexed" | "pending" | "failed";

export type KbDoc = {
  id: string;
  name: string;
  type: KbDocType;
  fileType?: string;        // "pdf" / "docx" / "txt" / "md" — for file type
  source?: string;          // URL string — for url type
  preview?: string;         // first 200 chars — for text type
  sizeBytes: number;
  chunks: number;
  status: KbDocStatus;
  createdAt: string;
  creatorId: string;
  creatorName: string;
  folderId?: string;        // null => root
};

export type ToolKind = "webhook" | "client" | "integration";

export type ToolParam = {
  name: string;
  type: "string" | "number" | "boolean";
  required: boolean;
  description: string;
};

export type ToolItem = {
  id: string;
  name: string;
  kind: ToolKind;
  description: string;
  method?: "GET" | "POST" | "PUT" | "DELETE";
  endpoint?: string;
  integrationProvider?: string;
  parameters: ToolParam[];
  createdAt: string;
  creatorId: string;
  creatorName: string;
  invocations: number;
  successRate: number;     // 0..1
};

export type IntegrationProvider = {
  id: string;
  name: string;
  category: string;
  description: string;
  // Avatar gradient (monochrome) so we don't need real logos
  avatar: string;
};

export type ConnectedIntegration = {
  id: string;
  providerId: string;
  name: string;
  category: string;
  connectedAt: string;
  createdById: string;
  createdByName: string;
  status: "connected" | "pending" | "error";
  isCustom?: boolean;       // true if user-added custom MCP server
};

// =============================================================
// Seed data — Cheezious context, respectful agent voice
// =============================================================

const SEED_KB_DOCS: KbDoc[] = [
  {
    id: "kb_menu_2026",
    name: "Cheezious_Menu_2026.pdf",
    type: "file",
    fileType: "pdf",
    sizeBytes: 487_000,
    chunks: 62,
    status: "indexed",
    createdAt: "2026-04-12T10:30:00Z",
    creatorId: "u1",
    creatorName: "Muhammad Talha",
  },
  {
    id: "kb_delivery_policy",
    name: "Delivery_Policy_v3.pdf",
    type: "file",
    fileType: "pdf",
    sizeBytes: 96_000,
    chunks: 14,
    status: "indexed",
    createdAt: "2026-04-18T14:20:00Z",
    creatorId: "u1",
    creatorName: "Muhammad Talha",
  },
  {
    id: "kb_faq",
    name: "FAQ — Customer Calls.txt",
    type: "text",
    preview:
      "Q: Aap ka minimum order kya hai? A: Free home delivery ke liye minimum order Rs. 800 hai...",
    sizeBytes: 24_000,
    chunks: 31,
    status: "indexed",
    createdAt: "2026-04-22T09:00:00Z",
    creatorId: "u1",
    creatorName: "Muhammad Talha",
  },
  {
    id: "kb_locations",
    name: "https://cheezious.com/locations",
    type: "url",
    source: "https://cheezious.com/locations",
    sizeBytes: 38_000,
    chunks: 18,
    status: "indexed",
    createdAt: "2026-05-02T11:15:00Z",
    creatorId: "u1",
    creatorName: "Muhammad Talha",
  },
  {
    id: "kb_promos_may",
    name: "Promotions_May2026.pdf",
    type: "file",
    fileType: "pdf",
    sizeBytes: 142_000,
    chunks: 9,
    status: "pending",
    createdAt: "2026-05-20T11:15:00Z",
    creatorId: "u1",
    creatorName: "Muhammad Talha",
  },
  {
    id: "kb_allergens",
    name: "Allergen_Information.txt",
    type: "text",
    preview:
      "Cheezious products may contain wheat, dairy, eggs, soy, mustard, and traces of nuts. The following items are vegetarian-friendly...",
    sizeBytes: 8_400,
    chunks: 5,
    status: "indexed",
    createdAt: "2026-05-04T16:42:00Z",
    creatorId: "u1",
    creatorName: "Muhammad Talha",
  },
];

const SEED_TOOLS: ToolItem[] = [
  {
    id: "tool_create_order",
    name: "createOrder",
    kind: "webhook",
    description:
      "Creates a new order in the POS system and returns an order ID with delivery ETA.",
    method: "POST",
    endpoint: "https://api.cheezious.pk/orders",
    parameters: [
      { name: "items",   type: "string",  required: true,  description: "Comma separated menu SKUs" },
      { name: "address", type: "string",  required: true,  description: "Full delivery address" },
      { name: "phone",   type: "string",  required: true,  description: "Customer phone in E.164" },
      { name: "payment", type: "string",  required: false, description: "cash | card | jazzcash | easypaisa" },
    ],
    createdAt: "2026-04-10T08:00:00Z",
    creatorId: "u1",
    creatorName: "Muhammad Talha",
    invocations: 1_842,
    successRate: 0.98,
  },
  {
    id: "tool_check_delivery",
    name: "checkDeliveryStatus",
    kind: "webhook",
    description:
      "Looks up an existing order and returns rider position plus estimated minutes.",
    method: "GET",
    endpoint: "https://api.cheezious.pk/orders/{orderId}",
    parameters: [
      { name: "orderId", type: "string", required: true, description: "Order number, prefixed CZ-" },
    ],
    createdAt: "2026-04-10T08:05:00Z",
    creatorId: "u1",
    creatorName: "Muhammad Talha",
    invocations: 924,
    successRate: 0.99,
  },
  {
    id: "tool_transfer_human",
    name: "transferToManager",
    kind: "client",
    description:
      "Hand the call to a human manager. Logs the reason and queues a callback if no agent is available.",
    parameters: [
      { name: "reason",     type: "string", required: true,  description: "Short reason string" },
      { name: "priority",   type: "string", required: false, description: "low | normal | high" },
    ],
    createdAt: "2026-04-15T10:00:00Z",
    creatorId: "u1",
    creatorName: "Muhammad Talha",
    invocations: 142,
    successRate: 1.0,
  },
  {
    id: "tool_lookup_menu",
    name: "lookupMenuItem",
    kind: "webhook",
    description: "Search the live menu for an item by name or SKU. Returns price, availability, and combo deals.",
    method: "GET",
    endpoint: "https://api.cheezious.pk/menu/search",
    parameters: [
      { name: "query", type: "string", required: true, description: "Free-text item name or SKU" },
    ],
    createdAt: "2026-04-22T12:00:00Z",
    creatorId: "u1",
    creatorName: "Muhammad Talha",
    invocations: 2_410,
    successRate: 0.97,
  },
  {
    id: "tool_send_jazzcash",
    name: "sendJazzCashInvoice",
    kind: "integration",
    description: "Send a JazzCash payment request to the caller's number and wait for confirmation.",
    integrationProvider: "JazzCash",
    parameters: [
      { name: "phone",  type: "string", required: true, description: "Customer phone" },
      { name: "amount", type: "number", required: true, description: "Amount in PKR" },
      { name: "note",   type: "string", required: false, description: "Note shown to payer" },
    ],
    createdAt: "2026-05-02T09:30:00Z",
    creatorId: "u1",
    creatorName: "Muhammad Talha",
    invocations: 318,
    successRate: 0.95,
  },
];

export const INTEGRATION_PROVIDERS: IntegrationProvider[] = [
  { id: "foodpanda",  name: "Foodpanda",         category: "Food delivery",      description: "Pull orders, push status updates, sync menus.", avatar: "radial-gradient(circle at 30% 30%, #f5f5f5 0%, #404040 50%, #0a0a0a 100%)" },
  { id: "cheetay",    name: "Cheetay",           category: "Logistics",          description: "Book a rider for ad-hoc deliveries.",            avatar: "radial-gradient(circle at 70% 30%, #fafafa 0%, #525252 45%, #171717 100%)" },
  { id: "bykea",      name: "Bykea",             category: "Logistics",          description: "Same-day bike delivery across Karachi, Lahore, Islamabad.", avatar: "radial-gradient(circle at 40% 60%, #ededed 0%, #525252 40%, #0a0a0a 100%)" },
  { id: "jazzcash",   name: "JazzCash",          category: "Payments",           description: "Send and verify payment requests over the call.",  avatar: "radial-gradient(circle at 50% 30%, #f0f0f0 0%, #525252 45%, #1a1a1a 100%)" },
  { id: "easypaisa",  name: "EasyPaisa",         category: "Payments",           description: "Easypaisa mobile wallet for payments and refunds.", avatar: "radial-gradient(circle at 60% 60%, #f5f5f5 0%, #404040 45%, #0a0a0a 100%)" },
  { id: "sadapay",    name: "SadaPay",           category: "Payments",           description: "Modern wallet popular with younger callers.",      avatar: "radial-gradient(circle at 30% 60%, #fafafa 0%, #404040 50%, #171717 100%)" },
  { id: "hubspot",    name: "HubSpot",           category: "CRM",                description: "Sync callers as contacts and log call activity.",  avatar: "radial-gradient(circle at 65% 25%, #ededed 0%, #525252 40%, #0a0a0a 100%)" },
  { id: "zendesk",    name: "Zendesk",           category: "Support",            description: "Create support tickets from escalated calls.",     avatar: "radial-gradient(circle at 40% 35%, #f5f5f5 0%, #404040 40%, #171717 100%)" },
  { id: "notion",     name: "Notion",            category: "Docs",               description: "Pull standard operating procedures from a Notion database.", avatar: "radial-gradient(circle at 55% 45%, #fafafa 0%, #525252 45%, #0a0a0a 100%)" },
  { id: "gcal",       name: "Google Calendar",   category: "Scheduling",         description: "Book and reschedule appointments on a shared calendar.", avatar: "radial-gradient(circle at 45% 55%, #f0f0f0 0%, #404040 45%, #1a1a1a 100%)" },
  { id: "whatsapp",   name: "WhatsApp Business", category: "Messaging",          description: "Send order confirmations and templates to the caller.", avatar: "radial-gradient(circle at 25% 35%, #f5f5f5 0%, #525252 45%, #171717 100%)" },
  { id: "salesforce", name: "Salesforce",        category: "CRM",                description: "Enterprise CRM sync. Calls, contacts, opportunities.", avatar: "radial-gradient(circle at 70% 60%, #ededed 0%, #404040 45%, #0a0a0a 100%)" },
];

const SEED_INTEGRATIONS: ConnectedIntegration[] = [
  {
    id: "ci_jazzcash",
    providerId: "jazzcash",
    name: "JazzCash",
    category: "Payments",
    connectedAt: "2026-04-12T08:30:00Z",
    createdById: "u1",
    createdByName: "Muhammad Talha",
    status: "connected",
  },
  {
    id: "ci_foodpanda",
    providerId: "foodpanda",
    name: "Foodpanda",
    category: "Food delivery",
    connectedAt: "2026-04-15T11:10:00Z",
    createdById: "u1",
    createdByName: "Muhammad Talha",
    status: "connected",
  },
  {
    id: "ci_whatsapp",
    providerId: "whatsapp",
    name: "WhatsApp Business",
    category: "Messaging",
    connectedAt: "2026-05-02T14:22:00Z",
    createdById: "u1",
    createdByName: "Muhammad Talha",
    status: "pending",
  },
];

// =============================================================
// Store
// =============================================================

type WorkspaceStore = {
  kbDocs: KbDoc[];
  tools: ToolItem[];
  integrations: ConnectedIntegration[];

  addKbDoc: (doc: KbDoc) => void;
  removeKbDoc: (id: string) => void;

  addTool: (tool: ToolItem) => void;
  removeTool: (id: string) => void;

  installIntegration: (providerId: string, creatorName: string) => void;
  addCustomIntegration: (name: string, category: string, creatorName: string) => void;
  removeIntegration: (id: string) => void;
};

export const useWorkspaceStore = create<WorkspaceStore>()(
  persist(
    (set) => ({
      kbDocs: SEED_KB_DOCS,
      tools: SEED_TOOLS,
      integrations: SEED_INTEGRATIONS,

      addKbDoc: (doc) =>
        set((s) => ({ kbDocs: [doc, ...s.kbDocs] })),
      removeKbDoc: (id) =>
        set((s) => ({ kbDocs: s.kbDocs.filter((d) => d.id !== id) })),

      addTool: (tool) =>
        set((s) => ({ tools: [tool, ...s.tools] })),
      removeTool: (id) =>
        set((s) => ({ tools: s.tools.filter((t) => t.id !== id) })),

      installIntegration: (providerId, creatorName) =>
        set((s) => {
          if (s.integrations.some((i) => i.providerId === providerId)) return s;
          const provider = INTEGRATION_PROVIDERS.find((p) => p.id === providerId);
          if (!provider) return s;
          return {
            integrations: [
              {
                id: `ci_${providerId}_${Date.now()}`,
                providerId,
                name: provider.name,
                category: provider.category,
                connectedAt: new Date().toISOString(),
                createdById: "u1",
                createdByName: creatorName,
                status: "connected",
              },
              ...s.integrations,
            ],
          };
        }),
      addCustomIntegration: (name, category, creatorName) =>
        set((s) => ({
          integrations: [
            {
              id: `ci_custom_${Date.now()}`,
              providerId: "custom",
              name,
              category,
              connectedAt: new Date().toISOString(),
              createdById: "u1",
              createdByName: creatorName,
              status: "connected",
              isCustom: true,
            },
            ...s.integrations,
          ],
        })),
      removeIntegration: (id) =>
        set((s) => ({ integrations: s.integrations.filter((i) => i.id !== id) })),
    }),
    {
      name: "callen-workspace-store",
      skipHydration: true,
    }
  )
);

// =============================================================
// Hydration helper
// =============================================================

export function useWorkspaceHydrated() {
  const [hydrated, setHydrated] = useState(false);
  useEffect(() => {
    useWorkspaceStore.persist.rehydrate();
    const unsub = useWorkspaceStore.persist.onFinishHydration(() => setHydrated(true));
    if (useWorkspaceStore.persist.hasHydrated()) setHydrated(true);
    return unsub;
  }, []);
  return hydrated;
}

// =============================================================
// Storage math helpers (used by RAG storage indicator)
// =============================================================

export const RAG_STORAGE_LIMIT_BYTES = 1_048_576; // 1 MB cap to feel like a free plan

export function formatBytes(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / 1024 / 1024).toFixed(2)} MB`;
}

export function totalKbStorageBytes(docs: KbDoc[]): number {
  return docs.reduce((sum, d) => sum + d.sizeBytes, 0);
}
