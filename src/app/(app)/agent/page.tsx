// Agent Studio (Day 4).
// Two-pane studio: template browser on the left, workflow / preview pane on the right.
// All client-side — no real persistence yet, but the workflow visualisation and
// preview call mimic what shipping the real backend will plug into.

"use client";

import { Suspense, useEffect, useMemo, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { motion, AnimatePresence } from "motion/react";
import { Search, Plus, Sparkles, ChevronRight } from "lucide-react";
import { toast } from "sonner";
import { WorkflowGraph } from "@/components/agent/workflow-graph";
import { PreviewCall } from "@/components/agent/preview-call";
import { CreateAgentWizard } from "@/components/agent/create-agent-wizard";
import {
  agentTemplates,
  templateCategories,
  type AgentTemplate,
} from "@/lib/agent-templates";
import { voiceForTemplateId } from "@/lib/voice-library";
import { useCustomAgentsStore } from "@/lib/custom-agents-store";
import { cn } from "@/lib/utils";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from "@/components/ui/sheet";

type Tab = "workflow" | "preview";

// Next.js 16 requires any component using useSearchParams() to live
// inside a Suspense boundary or the page is forced out of static
// rendering — and the production build fails. The default export is a
// thin shell; the real content (which calls useSearchParams) renders
// inside Suspense.
export default function AgentStudioPage() {
  return (
    <Suspense fallback={null}>
      <AgentStudioContent />
    </Suspense>
  );
}

function AgentStudioContent() {
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState<(typeof templateCategories)[number]>("All");
  const [selectedId, setSelectedId] = useState<string>(agentTemplates[0].id);
  const [tab, setTab] = useState<Tab>("workflow");
  const [detailsOpen, setDetailsOpen] = useState(false);
  const [wizardOpen, setWizardOpen] = useState(false);
  const addAgent = useCustomAgentsStore((s) => s.addAgent);

  // Sidebar's "+" link routes here with ?new=1 to open the wizard.
  const searchParams = useSearchParams();
  const router = useRouter();

  // Spin up a custom agent from a template and jump straight to its
  // editor + test page. Skips the 5-step wizard for browsers who just
  // want to use a pre-built flow.
  function useTemplate(t: AgentTemplate) {
    const voice = voiceForTemplateId(t.id);
    const id = addAgent({
      name: t.name,
      type: "business",
      industry: null,
      useCase: null,
      voiceId: voice.id,
      website: "",
      mainGoal: t.description,
      chatOnly: false,
      systemPrompt: t.systemPrompt,
    });
    toast.success(`${t.name} added`, {
      description: "Opening the editor so you can tune and test it.",
    });
    router.push(`/agent/${id}`);
  }
  useEffect(() => {
    if (searchParams.get("new") === "1") {
      setWizardOpen(true);
      // Clean the param so refreshing the page doesn't keep re-opening it.
      router.replace("/agent");
    }
  }, [searchParams, router]);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return agentTemplates.filter((t) => {
      if (category !== "All" && t.category !== category) return false;
      if (q.length > 0) {
        const hay = `${t.name} ${t.description} ${t.category}`.toLowerCase();
        if (!hay.includes(q)) return false;
      }
      return true;
    });
  }, [search, category]);

  const selected =
    agentTemplates.find((t) => t.id === selectedId) ?? agentTemplates[0];

  return (
    <div className="h-full flex flex-col">
      {/* Top bar */}
      <div className="border-b border-neutral-200 bg-white px-5 py-3 flex items-center gap-3">
        <h1 className="text-lg font-semibold tracking-tight">Agents</h1>
        <span className="text-[11px] text-neutral-400">·</span>
        <p className="text-[12px] text-neutral-500">
          Pick a template, see how it answers calls, and try it out before going live.
        </p>
      </div>

      <div className="flex-1 grid grid-cols-1 lg:grid-cols-[440px_minmax(0,1fr)] min-h-0">
        {/* ============================================================= */}
        {/* LEFT RAIL: template browser                                    */}
        {/* ============================================================= */}
        <aside className="border-r border-neutral-200 bg-white flex flex-col min-h-0">
          <div className="p-5 pb-3">
            <h2 className="text-2xl font-bold tracking-tight">
              Browse{" "}
              <span className="italic font-light">templates.</span>
            </h2>

            {/* Search */}
            <div className="mt-3 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-3.5 text-neutral-400" />
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search templates"
                className="w-full h-9 pl-9 pr-3 rounded-full bg-neutral-100 border border-transparent text-[13px] focus:outline-none focus:bg-white focus:border-neutral-300 transition-colors"
              />
            </div>

            {/* Category chips */}
            <div className="mt-3 flex flex-wrap gap-1.5">
              {templateCategories.map((c) => (
                <button
                  key={c}
                  onClick={() => setCategory(c)}
                  className={cn(
                    "px-2.5 py-1 rounded-full text-[11px] font-medium transition-colors border",
                    category === c
                      ? "bg-neutral-950 text-white border-neutral-950"
                      : "bg-white text-neutral-700 border-neutral-200 hover:border-neutral-300"
                  )}
                >
                  {c}
                </button>
              ))}
            </div>
          </div>

          {/* Template list */}
          <div className="flex-1 overflow-y-auto px-5 pb-5">
            {/* Create new agent — opens the 5-step wizard */}
            <button
              onClick={() => setWizardOpen(true)}
              className="w-full flex items-center justify-center gap-2 rounded-2xl border-2 border-dashed border-neutral-300 hover:border-neutral-400 px-4 py-4 text-[13px] font-medium text-neutral-700 transition-colors mb-3"
            >
              <span className="size-5 rounded-full border border-dashed border-neutral-400 flex items-center justify-center">
                <Plus className="size-3" />
              </span>
              Create new agent
            </button>

            {/* Cards grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              <AnimatePresence mode="popLayout">
                {filtered.map((t) => (
                  <motion.div
                    key={t.id}
                    layout
                    initial={{ opacity: 0, y: 6 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.25 }}
                  >
                    <TemplateCard
                      template={t}
                      selected={t.id === selectedId}
                      onClick={() => setSelectedId(t.id)}
                    />
                  </motion.div>
                ))}
              </AnimatePresence>
              {filtered.length === 0 && (
                <p className="col-span-full text-center text-[12px] text-neutral-400 py-10">
                  No templates match that search.
                </p>
              )}
            </div>
          </div>
        </aside>

        {/* ============================================================= */}
        {/* RIGHT PANE: workflow / preview                                 */}
        {/* ============================================================= */}
        <section className="relative bg-neutral-50/30 flex flex-col min-h-0">
          {/* Toolbar */}
          <div className="px-5 py-3 flex items-center justify-between gap-3">
            <TabSwitcher tab={tab} onChange={setTab} />

            <div className="flex items-center gap-2">
              <button
                onClick={() => setDetailsOpen(true)}
                className="h-9 px-3.5 rounded-full bg-white border border-neutral-200 text-[12.5px] font-medium hover:border-neutral-300 transition-colors"
              >
                View details
              </button>
              <button
                onClick={() => useTemplate(selected)}
                className="h-9 px-3.5 rounded-full bg-neutral-950 text-white text-[12.5px] font-medium hover:bg-neutral-800 transition-colors"
              >
                Use template
              </button>
            </div>
          </div>

          {/* Canvas */}
          <div className="flex-1 min-h-0 px-5 pb-5">
            <div className="relative h-full rounded-3xl border border-neutral-200 bg-white overflow-hidden">
              <AnimatePresence mode="wait">
                {tab === "workflow" ? (
                  <motion.div
                    key={`wf-${selected.id}`}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.2 }}
                    className="absolute inset-0"
                  >
                    <WorkflowGraph
                      nodes={selected.workflow.nodes}
                      edges={selected.workflow.edges}
                    />
                  </motion.div>
                ) : (
                  <motion.div
                    key={`pv-${selected.id}`}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.2 }}
                    className="absolute inset-0"
                  >
                    <PreviewCall
                      agentName={selected.name}
                      colors={selected.previewColors}
                      voiceAudioSrc={voiceForTemplateId(selected.id).audioSrc}
                    />
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </section>
      </div>

      {/* Details sheet */}
      <Sheet open={detailsOpen} onOpenChange={setDetailsOpen}>
        <SheetContent side="right" className="w-full sm:max-w-md p-6 overflow-y-auto">
          <SheetHeader className="px-0 mb-4">
            <div className="flex items-center gap-3 mb-2">
              <div
                className="size-10 rounded-full ring-1 ring-neutral-200 shrink-0"
                style={{ background: selected.avatar }}
              />
              <div>
                <SheetTitle className="text-base">{selected.name}</SheetTitle>
                <SheetDescription className="text-xs">
                  {selected.category} · {selected.integrations} integrations
                </SheetDescription>
              </div>
            </div>
          </SheetHeader>

          <div className="space-y-5 text-[13px]">
            <Detail label="Description">
              <p className="text-neutral-700 leading-relaxed">
                {selected.description}
              </p>
            </Detail>

            <Detail label="Voice">
              <span className="inline-flex items-center gap-1.5 px-2 py-1 rounded-full bg-neutral-100 text-[12px] font-medium">
                <Sparkles className="size-3" />
                {voiceForTemplateId(selected.id).name} ·{" "}
                <span className="text-neutral-500 font-normal">
                  {voiceForTemplateId(selected.id).language}
                </span>
              </span>
            </Detail>

            <Detail label="Languages">
              <div className="flex flex-wrap gap-1.5">
                {selected.languages.map((l) => (
                  <span
                    key={l}
                    className="px-2 py-0.5 rounded-full bg-neutral-100 text-[11px] font-medium"
                  >
                    {l}
                  </span>
                ))}
              </div>
            </Detail>

            <Detail label="System prompt">
              <pre className="text-[11.5px] leading-snug whitespace-pre-wrap font-mono bg-neutral-50 border border-neutral-200 rounded-xl p-3 text-neutral-800">
                {selected.systemPrompt}
              </pre>
            </Detail>

            <Detail label="Workflow">
              <p className="text-neutral-600 leading-relaxed">
                {selected.workflow.nodes.length} nodes ·{" "}
                {selected.workflow.edges.length} transitions
              </p>
            </Detail>
          </div>
        </SheetContent>
      </Sheet>

      {/* Create-agent wizard */}
      <CreateAgentWizard open={wizardOpen} onOpenChange={setWizardOpen} />
    </div>
  );
}

// =============================================================
// Template card
// =============================================================

function TemplateCard({
  template,
  selected,
  onClick,
}: {
  template: AgentTemplate;
  selected: boolean;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "w-full text-left rounded-2xl border p-3.5 transition-all duration-200 group",
        selected
          ? "border-neutral-900 bg-white shadow-lg shadow-neutral-900/5"
          : "border-neutral-200 bg-white hover:border-neutral-300 hover:shadow-sm"
      )}
    >
      <div className="flex items-center gap-2.5 mb-2">
        <div
          className="size-6 rounded-full ring-1 ring-neutral-200 shrink-0"
          style={{ background: template.avatar }}
        />
        <p className="text-[13px] font-semibold tracking-tight truncate">
          {template.name}
        </p>
      </div>
      <p className="text-[11.5px] text-neutral-500 leading-relaxed line-clamp-3 mb-3">
        {template.description}
      </p>
      <div className="flex items-center justify-between text-[11px] text-neutral-500">
        <span className="inline-flex items-center gap-1">
          <span className="size-1 rounded-full bg-neutral-400" />
          {template.integrations} integration{template.integrations === 1 ? "" : "s"}
        </span>
        <span
          className={cn(
            "inline-flex items-center gap-0.5 text-neutral-400 group-hover:text-neutral-700 transition-colors",
            selected && "text-neutral-700"
          )}
        >
          <ChevronRight className="size-3" />
        </span>
      </div>
    </button>
  );
}

// =============================================================
// Tab switcher
// =============================================================

function TabSwitcher({
  tab,
  onChange,
}: {
  tab: Tab;
  onChange: (t: Tab) => void;
}) {
  return (
    <div className="inline-flex items-center gap-0.5 rounded-full bg-white border border-neutral-200 p-1 shadow-sm">
      {(["workflow", "preview"] as const).map((t) => (
        <button
          key={t}
          onClick={() => onChange(t)}
          className={cn(
            "h-7 px-3 rounded-full text-[12px] font-medium capitalize transition-colors",
            tab === t
              ? "bg-neutral-950 text-white"
              : "text-neutral-600 hover:text-neutral-900"
          )}
        >
          {t}
        </button>
      ))}
    </div>
  );
}

// =============================================================
// Detail row helper
// =============================================================

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
