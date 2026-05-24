// Knowledge Base — functional. Matches the ElevenLabs reference image:
// header with RAG storage indicator, 4 quick-action cards (Add URL / Add Files /
// Create Text / Create Folder), search + Type/Creator filters, doc list.
// All four create flows persist via Zustand workspace-store.

"use client";

import { useMemo, useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  BookOpenText,
  Globe,
  FileText,
  Type as TypeIcon,
  FolderPlus,
  Search,
  Trash2,
  Loader2,
  CheckCircle2,
  AlertCircle,
  Plus,
  X,
} from "lucide-react";
import { toast } from "sonner";

import { cn } from "@/lib/utils";
import {
  useWorkspaceStore,
  useWorkspaceHydrated,
  formatBytes,
  totalKbStorageBytes,
  RAG_STORAGE_LIMIT_BYTES,
  type KbDoc,
  type KbDocType,
  type KbDocStatus,
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

type ModalKind = "url" | "files" | "text" | "folder" | null;

export default function KnowledgeBasePage() {
  const hydrated = useWorkspaceHydrated();
  const docs = useWorkspaceStore((s) => s.kbDocs);
  const removeKbDoc = useWorkspaceStore((s) => s.removeKbDoc);

  const [modal, setModal] = useState<ModalKind>(null);
  const [search, setSearch] = useState("");
  const [typeFilter, setTypeFilter] = useState<KbDocType | "all">("all");
  const [creatorFilter, setCreatorFilter] = useState<string | "all">("all");
  const [drawerDocId, setDrawerDocId] = useState<string | null>(null);

  const creators = useMemo(
    () => Array.from(new Set(docs.map((d) => d.creatorName))),
    [docs]
  );

  const filtered = useMemo(() => {
    return docs.filter((d) => {
      if (typeFilter !== "all" && d.type !== typeFilter) return false;
      if (creatorFilter !== "all" && d.creatorName !== creatorFilter)
        return false;
      if (search) {
        const q = search.toLowerCase();
        if (
          !d.name.toLowerCase().includes(q) &&
          !(d.source ?? "").toLowerCase().includes(q) &&
          !(d.preview ?? "").toLowerCase().includes(q)
        ) {
          return false;
        }
      }
      return true;
    });
  }, [docs, search, typeFilter, creatorFilter]);

  const drawerDoc = drawerDocId ? docs.find((d) => d.id === drawerDocId) : null;

  const totalBytes = useMemo(
    () => (hydrated ? totalKbStorageBytes(docs) : 0),
    [docs, hydrated]
  );
  const storagePct = Math.min(100, (totalBytes / RAG_STORAGE_LIMIT_BYTES) * 100);
  const overLimit = totalBytes > RAG_STORAGE_LIMIT_BYTES;

  if (!hydrated) {
    return (
      <div className="p-6 lg:p-8 max-w-7xl mx-auto space-y-6">
        <Skeleton className="h-10 w-72" />
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {[1, 2, 3, 4].map((i) => (
            <Skeleton key={i} className="h-24" />
          ))}
        </div>
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
          <h1 className="text-3xl md:text-4xl font-bold tracking-tight">
            Knowledge Base
          </h1>
          <span className="inline-flex items-center justify-center size-7 rounded-md bg-neutral-100 text-neutral-700">
            <BookOpenText className="size-4" />
          </span>
        </div>
        <RagStoragePill
          totalBytes={totalBytes}
          storagePct={storagePct}
          overLimit={overLimit}
        />
      </div>

      {/* Quick action cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
        <QuickActionCard icon={Globe}      label="Add URL"       onClick={() => setModal("url")} />
        <QuickActionCard icon={FileText}   label="Add Files"     onClick={() => setModal("files")} />
        <QuickActionCard icon={TypeIcon}   label="Create Text"   onClick={() => setModal("text")} />
        <QuickActionCard icon={FolderPlus} label="Create Folder" onClick={() => setModal("folder")} />
      </div>

      {/* Search + filters */}
      <div className="flex flex-col sm:flex-row gap-2 mb-3">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-3.5 text-neutral-400 pointer-events-none" />
          <Input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search Knowledge Base..."
            className="pl-9 h-11 bg-white border-neutral-200"
          />
        </div>
        <button className="inline-flex items-center gap-2 h-11 px-4 rounded-md border border-neutral-200 bg-white text-sm font-medium text-neutral-700 cursor-default">
          <TypeIcon className="size-3.5" />
          Title
        </button>
      </div>

      <div className="flex flex-wrap gap-2 mb-5">
        <FilterChip
          label="Type"
          value={typeFilter}
          onClear={() => setTypeFilter("all")}
          options={[
            { value: "all",    label: "All types" },
            { value: "url",    label: "URL" },
            { value: "file",   label: "File" },
            { value: "text",   label: "Text" },
            { value: "folder", label: "Folder" },
          ]}
          onSelect={(v) => setTypeFilter(v as KbDocType | "all")}
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

      {/* Document list / empty state */}
      {filtered.length === 0 ? (
        <EmptyDocs hasAny={docs.length > 0} />
      ) : (
        <DocsTable
          docs={filtered}
          onOpen={(id) => setDrawerDocId(id)}
          onDelete={(id) => {
            removeKbDoc(id);
            toast("Document removed", {
              description: "It has been deleted from the knowledge base.",
            });
          }}
        />
      )}

      {/* Modals */}
      <AddUrlDialog       open={modal === "url"}    onClose={() => setModal(null)} />
      <AddFilesDialog     open={modal === "files"}  onClose={() => setModal(null)} />
      <CreateTextDialog   open={modal === "text"}   onClose={() => setModal(null)} />
      <CreateFolderDialog open={modal === "folder"} onClose={() => setModal(null)} />

      {/* Drawer */}
      <Sheet open={!!drawerDoc} onOpenChange={(o) => !o && setDrawerDocId(null)}>
        <SheetContent side="right" className="w-full sm:max-w-md p-6 overflow-y-auto">
          {drawerDoc && (
            <DocDrawer
              doc={drawerDoc}
              onDelete={() => {
                removeKbDoc(drawerDoc.id);
                setDrawerDocId(null);
                toast("Document removed");
              }}
            />
          )}
        </SheetContent>
      </Sheet>
    </div>
  );
}

// =============================================================
// RAG storage pill
// =============================================================

function RagStoragePill({
  totalBytes,
  storagePct,
  overLimit,
}: {
  totalBytes: number;
  storagePct: number;
  overLimit: boolean;
}) {
  return (
    <div className="hidden sm:flex items-center gap-2.5 px-3.5 py-2 rounded-full bg-white border border-neutral-200">
      <span className={cn("size-2 rounded-full", overLimit ? "bg-rose-500" : "bg-emerald-500")} />
      <div className="text-[12px] text-neutral-600 tabular-nums">
        RAG Storage:{" "}
        <span className="font-semibold text-neutral-900">{formatBytes(totalBytes)}</span>{" "}
        / {formatBytes(RAG_STORAGE_LIMIT_BYTES)}
      </div>
      <div className="w-16 h-1 bg-neutral-100 rounded-full overflow-hidden">
        <div
          className={cn("h-full rounded-full", overLimit ? "bg-rose-500" : "bg-neutral-900")}
          style={{ width: `${Math.min(100, storagePct)}%` }}
        />
      </div>
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
// Filter chip
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

function EmptyDocs({ hasAny }: { hasAny: boolean }) {
  return (
    <div className="rounded-2xl border border-neutral-200 bg-neutral-50/40 p-12 text-center">
      <div className="size-12 rounded-2xl bg-white border border-neutral-200 mx-auto mb-4 flex items-center justify-center">
        <BookOpenText className="size-5 text-neutral-700" />
      </div>
      <p className="text-sm font-semibold tracking-tight">
        {hasAny ? "No matching documents" : "No documents found"}
      </p>
      <p className="text-xs text-neutral-500 mt-1">
        {hasAny ? "Try adjusting your search or filters." : "You don't have any documents yet."}
      </p>
    </div>
  );
}

// =============================================================
// Docs table
// =============================================================

function DocsTable({
  docs,
  onOpen,
  onDelete,
}: {
  docs: KbDoc[];
  onOpen: (id: string) => void;
  onDelete: (id: string) => void;
}) {
  return (
    <div className="rounded-2xl border border-neutral-200 bg-white overflow-hidden">
      <div className="grid grid-cols-12 px-4 py-2.5 bg-neutral-50/50 border-b border-neutral-200 text-[10px] uppercase tracking-widest font-semibold text-neutral-500">
        <div className="col-span-6">Name</div>
        <div className="col-span-2">Type</div>
        <div className="col-span-1 text-right">Chunks</div>
        <div className="col-span-2">Created by</div>
        <div className="col-span-1 text-right">Status</div>
      </div>
      <AnimatePresence initial={false}>
        {docs.map((d) => (
          <motion.button
            key={d.id}
            layout
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={() => onOpen(d.id)}
            className="w-full text-left grid grid-cols-12 px-4 py-3 border-b border-neutral-100 last:border-b-0 hover:bg-neutral-50/50 transition-colors group items-center"
          >
            <div className="col-span-6 flex items-center gap-2.5 min-w-0">
              <DocTypeIcon type={d.type} />
              <div className="min-w-0">
                <p className="text-sm font-semibold tracking-tight truncate">{d.name}</p>
                <p className="text-[11px] text-neutral-500 truncate">
                  {d.source ?? d.preview ?? `${formatBytes(d.sizeBytes)} · ${d.fileType?.toUpperCase() ?? ""}`}
                </p>
              </div>
            </div>
            <div className="col-span-2 text-[12px] text-neutral-600 capitalize">
              {d.type === "file" && d.fileType ? d.fileType.toUpperCase() : d.type}
            </div>
            <div className="col-span-1 text-right text-[12px] text-neutral-700 font-mono tabular-nums">
              {d.chunks}
            </div>
            <div className="col-span-2 text-[12px] text-neutral-600 truncate">{d.creatorName}</div>
            <div className="col-span-1 flex items-center justify-end gap-2">
              <StatusPill status={d.status} />
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onDelete(d.id);
                }}
                className="opacity-0 group-hover:opacity-100 transition-opacity p-1 rounded hover:bg-neutral-100"
                aria-label="Delete document"
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

function DocTypeIcon({ type }: { type: KbDocType }) {
  const Map = { url: Globe, file: FileText, text: TypeIcon, folder: FolderPlus } as const;
  const Icon = Map[type];
  return (
    <span className="size-8 rounded-lg bg-neutral-100 flex items-center justify-center shrink-0">
      <Icon className="size-4 text-neutral-700" />
    </span>
  );
}

function StatusPill({ status }: { status: KbDocStatus }) {
  if (status === "indexed") {
    return (
      <span className="inline-flex items-center gap-1 text-[10px] text-emerald-700 font-medium">
        <CheckCircle2 className="size-3" />
        Indexed
      </span>
    );
  }
  if (status === "pending") {
    return (
      <span className="inline-flex items-center gap-1 text-[10px] text-amber-700 font-medium">
        <Loader2 className="size-3 animate-spin" />
        Indexing
      </span>
    );
  }
  return (
    <span className="inline-flex items-center gap-1 text-[10px] text-rose-700 font-medium">
      <AlertCircle className="size-3" />
      Failed
    </span>
  );
}

// =============================================================
// Drawer
// =============================================================

function DocDrawer({ doc, onDelete }: { doc: KbDoc; onDelete: () => void }) {
  return (
    <>
      <SheetHeader className="px-0 mb-4">
        <div className="flex items-center gap-3 mb-2">
          <DocTypeIcon type={doc.type} />
          <div className="flex-1 min-w-0">
            <SheetTitle className="text-base truncate">{doc.name}</SheetTitle>
            <SheetDescription className="text-xs">
              {doc.type.toUpperCase()} · {formatBytes(doc.sizeBytes)} · {doc.chunks} chunks
            </SheetDescription>
          </div>
        </div>
      </SheetHeader>

      <div className="space-y-5 text-[13px]">
        <Detail label="Status">
          <StatusPill status={doc.status} />
        </Detail>
        <Detail label="Created by">
          <p className="text-neutral-800">{doc.creatorName}</p>
          <p className="text-[11px] text-neutral-500 mt-0.5">
            {new Date(doc.createdAt).toLocaleString()}
          </p>
        </Detail>
        {doc.source && (
          <Detail label="Source">
            <a
              href={doc.source}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-700 underline break-all text-[12px]"
            >
              {doc.source}
            </a>
          </Detail>
        )}
        {doc.preview && (
          <Detail label="Preview">
            <pre className="text-[11.5px] leading-snug whitespace-pre-wrap font-mono bg-neutral-50 border border-neutral-200 rounded-xl p-3 text-neutral-800">
              {doc.preview}
            </pre>
          </Detail>
        )}
        <Detail label="Indexed chunks">
          <p className="text-neutral-700">
            {doc.chunks} chunks · about {doc.chunks > 0 ? Math.round(doc.sizeBytes / doc.chunks) : 0} B average
          </p>
        </Detail>
      </div>

      <button
        onClick={onDelete}
        className="mt-6 w-full inline-flex items-center justify-center gap-2 h-9 rounded-full bg-rose-50 text-rose-700 border border-rose-100 hover:bg-rose-100 text-sm font-medium transition-colors"
      >
        <Trash2 className="size-3.5" />
        Remove from knowledge base
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
      <p className="text-[10px] uppercase tracking-widest text-neutral-500 font-semibold mb-1.5">
        {label}
      </p>
      {children}
    </div>
  );
}

// =============================================================
// Modals
// =============================================================

function useCreatorName() {
  const user = useAppStore((s) => s.user);
  return user?.name ?? "Muhammad Talha";
}

function AddUrlDialog({ open, onClose }: { open: boolean; onClose: () => void }) {
  const addKbDoc = useWorkspaceStore((s) => s.addKbDoc);
  const creatorName = useCreatorName();
  const [url, setUrl] = useState("");
  const [title, setTitle] = useState("");

  const reset = () => {
    setUrl("");
    setTitle("");
  };

  const submit = () => {
    if (!url.trim()) return;
    const finalTitle = title.trim() || url;
    addKbDoc({
      id: `kb_url_${Date.now()}`,
      name: finalTitle,
      type: "url",
      source: url,
      sizeBytes: 35_000 + Math.floor(Math.random() * 40_000),
      chunks: 8 + Math.floor(Math.random() * 16),
      status: "pending",
      createdAt: new Date().toISOString(),
      creatorId: "u1",
      creatorName,
    });
    toast("URL added to knowledge base", {
      description: "Scraping and chunking will complete in a moment.",
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
            <Globe className="size-4 text-neutral-700" />
          </span>
          <DialogTitle>Add URL</DialogTitle>
        </div>
        <DialogDescription>
          Paste a page URL. We will scrape, chunk, and index it for retrieval during calls.
        </DialogDescription>

        <div className="space-y-3 mt-2">
          <div className="space-y-1.5">
            <Label htmlFor="url" className="text-xs">URL</Label>
            <Input
              id="url"
              placeholder="https://cheezious.com/menu"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              autoFocus
            />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="url-title" className="text-xs">Title (optional)</Label>
            <Input
              id="url-title"
              placeholder="Cheezious · Menu page"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
          </div>
        </div>

        <DialogFooterRow
          onCancel={() => {
            reset();
            onClose();
          }}
          onSubmit={submit}
          submitLabel="Add URL"
          submitDisabled={!url.trim()}
        />
      </DialogContent>
    </Dialog>
  );
}

function AddFilesDialog({ open, onClose }: { open: boolean; onClose: () => void }) {
  const addKbDoc = useWorkspaceStore((s) => s.addKbDoc);
  const creatorName = useCreatorName();
  const [files, setFiles] = useState<File[]>([]);
  const [dragOver, setDragOver] = useState(false);

  const reset = () => setFiles([]);

  const onDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    const dropped = Array.from(e.dataTransfer.files);
    setFiles((prev) => [...prev, ...dropped]);
  };

  const submit = () => {
    if (files.length === 0) return;
    files.forEach((f) => {
      const ext = f.name.split(".").pop()?.toLowerCase() ?? "";
      addKbDoc({
        id: `kb_file_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`,
        name: f.name,
        type: "file",
        fileType: ext || "txt",
        sizeBytes: f.size || 50_000,
        chunks: Math.max(4, Math.round((f.size || 50_000) / 6_000)),
        status: "pending",
        createdAt: new Date().toISOString(),
        creatorId: "u1",
        creatorName,
      });
    });
    toast(`${files.length} file${files.length === 1 ? "" : "s"} uploaded`, {
      description: "Indexing will complete in a moment.",
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
            <FileText className="size-4 text-neutral-700" />
          </span>
          <DialogTitle>Add files</DialogTitle>
        </div>
        <DialogDescription>
          Drag and drop or browse. PDFs, DOCX, TXT, and Markdown are supported.
        </DialogDescription>

        <div
          onDragOver={(e) => {
            e.preventDefault();
            setDragOver(true);
          }}
          onDragLeave={() => setDragOver(false)}
          onDrop={onDrop}
          className={cn(
            "mt-2 rounded-2xl border-2 border-dashed p-6 text-center transition-colors",
            dragOver ? "border-neutral-900 bg-neutral-50" : "border-neutral-200 bg-neutral-50/30"
          )}
        >
          <FileText className="size-6 text-neutral-400 mx-auto mb-2" />
          <p className="text-sm font-medium">Drop files here</p>
          <p className="text-[11px] text-neutral-500 mb-3">or click below to browse</p>
          <label className="inline-flex items-center gap-1.5 h-8 px-3 rounded-full bg-neutral-950 text-white text-[12px] font-medium cursor-pointer hover:bg-neutral-800 transition-colors">
            <Plus className="size-3.5" />
            Choose files
            <input
              type="file"
              multiple
              className="hidden"
              accept=".pdf,.txt,.md,.docx"
              onChange={(e) => {
                const list = Array.from(e.target.files ?? []);
                setFiles((prev) => [...prev, ...list]);
              }}
            />
          </label>
        </div>

        {files.length > 0 && (
          <ul className="mt-3 space-y-1.5 max-h-32 overflow-y-auto">
            {files.map((f, i) => (
              <li
                key={i}
                className="flex items-center gap-2 text-[12px] px-2 py-1.5 rounded-md bg-neutral-50 border border-neutral-200"
              >
                <FileText className="size-3.5 text-neutral-500 shrink-0" />
                <span className="flex-1 truncate">{f.name}</span>
                <span className="text-[10px] text-neutral-500 font-mono">{formatBytes(f.size || 0)}</span>
                <button
                  onClick={() => setFiles((prev) => prev.filter((_, j) => j !== i))}
                  className="text-neutral-400 hover:text-neutral-900"
                  aria-label="Remove"
                >
                  <X className="size-3" />
                </button>
              </li>
            ))}
          </ul>
        )}

        <DialogFooterRow
          onCancel={() => {
            reset();
            onClose();
          }}
          onSubmit={submit}
          submitLabel={`Upload ${files.length || ""}`.trim()}
          submitDisabled={files.length === 0}
        />
      </DialogContent>
    </Dialog>
  );
}

function CreateTextDialog({ open, onClose }: { open: boolean; onClose: () => void }) {
  const addKbDoc = useWorkspaceStore((s) => s.addKbDoc);
  const creatorName = useCreatorName();
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");

  const reset = () => {
    setTitle("");
    setContent("");
  };

  const submit = () => {
    if (!title.trim() || !content.trim()) return;
    const bytes = new Blob([content]).size;
    addKbDoc({
      id: `kb_text_${Date.now()}`,
      name: title,
      type: "text",
      preview: content.slice(0, 200),
      sizeBytes: bytes,
      chunks: Math.max(1, Math.ceil(bytes / 2_500)),
      status: "indexed",
      createdAt: new Date().toISOString(),
      creatorId: "u1",
      creatorName,
    });
    toast("Text document created", {
      description: "It is indexed and ready for calls.",
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
      <DialogContent className="sm:max-w-lg">
        <div className="flex items-center gap-2 mb-1">
          <span className="size-7 rounded-md bg-neutral-100 flex items-center justify-center">
            <TypeIcon className="size-4 text-neutral-700" />
          </span>
          <DialogTitle>Create text document</DialogTitle>
        </div>
        <DialogDescription>
          Write a short knowledge snippet. Plain text or Markdown work.
        </DialogDescription>

        <div className="space-y-3 mt-2">
          <div className="space-y-1.5">
            <Label htmlFor="text-title" className="text-xs">Title</Label>
            <Input
              id="text-title"
              placeholder="Refund policy"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              autoFocus
            />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="text-content" className="text-xs">Content</Label>
            <Textarea
              id="text-content"
              placeholder="Refunds are processed within 24 hours for orders cancelled before kitchen confirmation..."
              value={content}
              onChange={(e) => setContent(e.target.value)}
              rows={8}
              className="font-mono text-[12px]"
            />
            <p className="text-[10px] text-neutral-500">
              {content.length} characters · about{" "}
              {Math.max(1, Math.ceil(new Blob([content]).size / 2_500))} chunk
              {content.length > 2_500 ? "s" : ""}
            </p>
          </div>
        </div>

        <DialogFooterRow
          onCancel={() => {
            reset();
            onClose();
          }}
          onSubmit={submit}
          submitLabel="Create"
          submitDisabled={!title.trim() || !content.trim()}
        />
      </DialogContent>
    </Dialog>
  );
}

function CreateFolderDialog({ open, onClose }: { open: boolean; onClose: () => void }) {
  const addKbDoc = useWorkspaceStore((s) => s.addKbDoc);
  const creatorName = useCreatorName();
  const [name, setName] = useState("");

  const reset = () => setName("");

  const submit = () => {
    if (!name.trim()) return;
    addKbDoc({
      id: `kb_folder_${Date.now()}`,
      name,
      type: "folder",
      sizeBytes: 0,
      chunks: 0,
      status: "indexed",
      createdAt: new Date().toISOString(),
      creatorId: "u1",
      creatorName,
    });
    toast("Folder created");
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
            <FolderPlus className="size-4 text-neutral-700" />
          </span>
          <DialogTitle>Create folder</DialogTitle>
        </div>
        <DialogDescription>
          Folders help organize knowledge by topic. Drag documents into them from the list view.
        </DialogDescription>

        <div className="space-y-3 mt-2">
          <div className="space-y-1.5">
            <Label htmlFor="folder-name" className="text-xs">Folder name</Label>
            <Input
              id="folder-name"
              placeholder="Menu and pricing"
              value={name}
              onChange={(e) => setName(e.target.value)}
              autoFocus
            />
          </div>
        </div>

        <DialogFooterRow
          onCancel={() => {
            reset();
            onClose();
          }}
          onSubmit={submit}
          submitLabel="Create folder"
          submitDisabled={!name.trim()}
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
