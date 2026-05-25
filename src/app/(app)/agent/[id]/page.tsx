// Custom agent editor + tester. Created by the Create-Agent wizard.
// Layout: header with name + draft pill + publish, then three columns:
//   - Left  : System prompt + First message (editable)
//   - Middle: Voice card, Language, LLM, Behavior
//   - Right : Test panel — planet orb, call button (plays the voice's mp3),
//             a tiny chat input that echoes a canned response and replays
//             the voice. Enough to demo the experience in viva.

"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { motion, AnimatePresence } from "motion/react";
import {
  ArrowLeft,
  Sparkles,
  ChevronRight,
  Phone,
  PhoneOff,
  Send,
  Globe,
  Wand2,
  Pencil,
  Mic,
  Volume2,
  VolumeX,
} from "lucide-react";
import { toast } from "sonner";

import { cn } from "@/lib/utils";
import {
  useCustomAgentsStore,
  useCustomAgentsHydrated,
  type CustomAgent,
} from "@/lib/custom-agents-store";
import { getVoice, VOICES, type Voice } from "@/lib/voice-library";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Switch } from "@/components/ui/switch";
import { SiriOrb } from "@/components/ui/siri-orb";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from "@/components/ui/sheet";
import { VoicePreview } from "@/components/voices/voice-preview";

// =============================================================
// Page
// =============================================================

export default function AgentDetailPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const hydrated = useCustomAgentsHydrated();
  const agents = useCustomAgentsStore((s) => s.agents);
  const updateAgent = useCustomAgentsStore((s) => s.updateAgent);

  const agent = useMemo(
    () => agents.find((a) => a.id === id) ?? null,
    [agents, id]
  );

  if (!hydrated) return <DetailSkeleton />;

  if (!agent) {
    return (
      <div className="h-full flex items-center justify-center px-6 py-16">
        <div className="text-center max-w-md">
          <h1 className="text-2xl font-bold tracking-tight mb-2">
            Agent not found
          </h1>
          <p className="text-[13px] text-neutral-500 mb-5">
            We could not find that agent in your workspace. It may have been
            removed or never finished saving.
          </p>
          <Button
            variant="outline"
            className="rounded-full"
            onClick={() => router.push("/agent")}
          >
            Back to agents
          </Button>
        </div>
      </div>
    );
  }

  return (
    <AgentEditor
      agent={agent}
      onPatch={(patch) => updateAgent(agent.id, patch)}
      onBack={() => router.push("/agent")}
    />
  );
}

// =============================================================
// Editor
// =============================================================

function AgentEditor({
  agent,
  onPatch,
  onBack,
}: {
  agent: CustomAgent;
  onPatch: (patch: Partial<CustomAgent>) => void;
  onBack: () => void;
}) {
  const voice = getVoice(agent.voiceId) ?? VOICES[0];
  const [voiceSheetOpen, setVoiceSheetOpen] = useState(false);
  const [systemPrompt, setSystemPrompt] = useState(agent.systemPrompt);
  const [firstMessage, setFirstMessage] = useState(agent.firstMessage);
  const [dirty, setDirty] = useState(false);

  // Stay in sync with store updates that happen elsewhere (e.g. voice change)
  useEffect(() => {
    setSystemPrompt(agent.systemPrompt);
    setFirstMessage(agent.firstMessage);
    setDirty(false);
  }, [agent.systemPrompt, agent.firstMessage]);

  function save() {
    onPatch({ systemPrompt, firstMessage });
    setDirty(false);
    toast.success("Changes saved");
  }

  function publish() {
    onPatch({ status: "published", systemPrompt, firstMessage });
    setDirty(false);
    toast.success(`${agent.name} published`, {
      description: "The draft is now live on your workspace number.",
    });
  }

  return (
    <div className="h-full flex flex-col bg-neutral-50/40">
      {/* ============= Header ============= */}
      <div className="bg-white border-b border-neutral-200 px-5 py-3 flex items-center gap-3">
        <button
          onClick={onBack}
          className="size-8 rounded-full hover:bg-neutral-100 flex items-center justify-center text-neutral-600"
          aria-label="Back to agents"
        >
          <ArrowLeft className="size-4" />
        </button>
        <div className="flex items-center gap-2 min-w-0">
          <p className="text-[14px] font-semibold tracking-tight truncate">
            {agent.name}
          </p>
          <span className="text-neutral-300">/</span>
          <p className="text-[13px] text-neutral-500">Main</p>
          <span className="inline-flex items-center gap-1 ml-1 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 px-1.5 py-0.5 text-[10px] font-semibold">
            <span className="size-1.5 rounded-full bg-emerald-500 animate-pulse" />
            Live 100%
          </span>
        </div>
        <div className="flex-1" />
        <span
          className={cn(
            "inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[11px] font-semibold",
            agent.status === "published"
              ? "bg-emerald-100 text-emerald-700"
              : "bg-amber-50 text-amber-700 border border-amber-200"
          )}
        >
          {agent.status === "published" ? "Published" : "Draft"}
        </span>
        {dirty && (
          <Button
            variant="outline"
            className="rounded-full h-8 px-3 text-[12px]"
            onClick={save}
          >
            Save
          </Button>
        )}
        <Button
          className="rounded-full h-8 px-4 text-[12px]"
          onClick={publish}
        >
          {agent.status === "published" ? "Republish" : "Publish"}
        </Button>
      </div>

      {/* ============= Body ============= */}
      <div className="flex-1 min-h-0 grid grid-cols-1 lg:grid-cols-[minmax(0,1fr)_320px_minmax(0,420px)]">
        {/* ---------------- Column 1: prompts ---------------- */}
        <div className="border-r border-neutral-200 bg-white p-6 overflow-y-auto">
          <h2 className="text-xl font-bold tracking-tight flex items-center gap-2 mb-5">
            Agent
            <span className="text-[10px] font-semibold rounded-full bg-neutral-100 text-neutral-700 px-1.5 py-0.5">
              NEW
            </span>
          </h2>

          {/* System prompt */}
          <div className="mb-6">
            <div className="flex items-center justify-between mb-2">
              <p className="text-[13px] font-semibold">System prompt</p>
              <button
                className="size-7 rounded-md hover:bg-neutral-100 flex items-center justify-center text-neutral-600"
                title="Improve with AI"
                onClick={() =>
                  toast("Prompt improver", {
                    description: "Hooks into the prompt rewriter once backend lands.",
                  })
                }
              >
                <Wand2 className="size-3.5" />
              </button>
            </div>
            <textarea
              value={systemPrompt}
              onChange={(e) => {
                setSystemPrompt(e.target.value);
                setDirty(true);
              }}
              rows={12}
              className="w-full rounded-2xl border border-neutral-200 bg-white px-3.5 py-3 text-[12.5px] leading-relaxed font-mono resize-none focus:outline-none focus:ring-2 focus:ring-neutral-900 focus:border-neutral-900"
            />
            <div className="mt-1.5 flex items-center justify-between text-[11px] text-neutral-500">
              <span>
                Type{" "}
                <kbd className="px-1.5 py-0.5 rounded bg-neutral-100 border border-neutral-200 font-mono text-[10px]">
                  {"{{"}
                </kbd>{" "}
                to add variables
              </span>
              <span className="inline-flex items-center gap-1">
                <Globe className="size-3" />
                Asia/Karachi
              </span>
            </div>
          </div>

          {/* First message */}
          <div className="mb-2">
            <div className="flex items-center justify-between mb-2">
              <p className="text-[13px] font-semibold">First message</p>
              <span className="text-[11px] text-neutral-500 inline-flex items-center gap-1">
                <Mic className="size-3" />
                Interruptible
                <Switch defaultChecked size="sm" />
              </span>
            </div>
            <p className="text-[11.5px] text-neutral-500 mb-2 leading-snug">
              The first message the agent will say. If empty, the agent will
              wait for the user to start the conversation.
            </p>
            <textarea
              value={firstMessage}
              onChange={(e) => {
                setFirstMessage(e.target.value);
                setDirty(true);
              }}
              rows={3}
              className="w-full rounded-2xl border border-neutral-200 bg-white px-3.5 py-3 text-[12.5px] leading-relaxed resize-none focus:outline-none focus:ring-2 focus:ring-neutral-900 focus:border-neutral-900"
            />
          </div>
        </div>

        {/* ---------------- Column 2: config cards ---------------- */}
        <div className="border-r border-neutral-200 bg-white p-5 overflow-y-auto space-y-5">
          <ConfigSection title="Voice" subtitle="The neural voice the agent uses on calls.">
            <button
              type="button"
              onClick={() => setVoiceSheetOpen(true)}
              className="w-full flex items-center gap-3 rounded-2xl border border-neutral-200 hover:border-neutral-300 p-2.5 pr-3 transition-colors text-left"
            >
              <VoicePreview voice={voice} size="sm" showBadge={false} />
              <div className="flex-1 min-w-0">
                <p className="text-[13px] font-semibold truncate">{voice.name}</p>
                <p className="text-[11px] text-neutral-500 truncate">{voice.tagline}</p>
              </div>
              <span className="inline-flex items-center px-1.5 py-0.5 rounded-full bg-neutral-950 text-white text-[10px] font-semibold">
                Primary
              </span>
              <ChevronRight className="size-4 text-neutral-400" />
            </button>
          </ConfigSection>

          <ConfigSection title="Language" subtitle="Default and additional languages the agent speaks.">
            <div className="rounded-2xl border border-neutral-200 p-3 flex items-center gap-2 text-[13px]">
              <span aria-hidden className="text-base leading-none">
                {voice.language === "English" ? "🇺🇸" : "🇵🇰"}
              </span>
              <span className="font-medium">{voice.language}</span>
              <span className="ml-auto inline-flex items-center px-1.5 py-0.5 rounded-full bg-neutral-100 text-neutral-700 text-[10px] font-semibold">
                Default
              </span>
            </div>
          </ConfigSection>

          <ConfigSection title="LLM" subtitle="Provider + model that powers the agent's reasoning.">
            <button
              type="button"
              onClick={() =>
                toast("Model picker stub", {
                  description: "Swap between Gemini 2.5 Flash and GPT-4o once wired.",
                })
              }
              className="w-full flex items-center gap-2 rounded-2xl border border-neutral-200 hover:border-neutral-300 px-3 py-2.5 transition-colors text-[13px]"
            >
              <Sparkles className="size-4 text-neutral-700" />
              <span className="font-medium">{agent.llm}</span>
              <ChevronRight className="size-4 ml-auto text-neutral-400" />
            </button>
          </ConfigSection>

          <ConfigSection title="Agent behavior" subtitle="Personality and channel-specific reply style.">
            <button
              type="button"
              onClick={() =>
                toast("Behavior profiles", {
                  description: "Switch between default, formal, casual once configured.",
                })
              }
              className="w-full flex items-center gap-2 rounded-2xl border border-neutral-200 hover:border-neutral-300 px-3 py-2.5 transition-colors text-[13px]"
            >
              <span className="font-medium">Default behavior</span>
              <ChevronRight className="size-4 ml-auto text-neutral-400" />
            </button>
          </ConfigSection>
        </div>

        {/* ---------------- Column 3: Test panel ---------------- */}
        <TestPanel agent={agent} voice={voice} firstMessage={firstMessage} />
      </div>

      {/* Voice picker sheet */}
      <VoicePickerSheet
        open={voiceSheetOpen}
        onOpenChange={setVoiceSheetOpen}
        currentVoiceId={agent.voiceId}
        onPick={(id) => {
          onPatch({ voiceId: id });
          setVoiceSheetOpen(false);
          const v = getVoice(id);
          toast.success(`Voice changed to ${v?.name ?? "selection"}`);
        }}
      />
    </div>
  );
}

// =============================================================
// Test panel — orb + canned chat
// =============================================================

const ORB_PALETTES = [
  { c1: "oklch(72% 0.17 220)", c2: "oklch(80% 0.13 200)", c3: "oklch(75% 0.15 250)" },
  { c1: "oklch(72% 0.18 30)",  c2: "oklch(78% 0.16 60)",  c3: "oklch(75% 0.17 10)" },
  { c1: "oklch(70% 0.18 290)", c2: "oklch(78% 0.14 260)", c3: "oklch(76% 0.16 310)" },
  { c1: "oklch(72% 0.17 150)", c2: "oklch(78% 0.14 170)", c3: "oklch(75% 0.16 130)" },
  { c1: "oklch(70% 0.20 340)", c2: "oklch(78% 0.16 320)", c3: "oklch(75% 0.18 0)" },
  { c1: "oklch(74% 0.14 190)", c2: "oklch(80% 0.11 220)", c3: "oklch(77% 0.13 170)" },
];

function paletteForVoice(voiceId: string) {
  let h = 0;
  for (let i = 0; i < voiceId.length; i++) h = (h * 31 + voiceId.charCodeAt(i)) | 0;
  return ORB_PALETTES[Math.abs(h) % ORB_PALETTES.length];
}

type ChatMessage = { from: "user" | "agent"; text: string };

function TestPanel({
  agent,
  voice,
  firstMessage,
}: {
  agent: CustomAgent;
  voice: Voice;
  firstMessage: string;
}) {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [tab, setTab] = useState<"inline" | "widget">("inline");
  const [playing, setPlaying] = useState(false);
  const [connecting, setConnecting] = useState(false);
  const [muted, setMuted] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([
    { from: "agent", text: firstMessage },
  ]);
  const [draft, setDraft] = useState("");
  const palette = paletteForVoice(voice.id);

  // Keep the seeded first-message synced if the user edits it
  useEffect(() => {
    setMessages((prev) =>
      prev.length === 1 && prev[0].from === "agent"
        ? [{ from: "agent", text: firstMessage }]
        : prev
    );
  }, [firstMessage]);

  // Mute toggles audio volume
  useEffect(() => {
    if (audioRef.current) audioRef.current.volume = muted ? 0 : 1;
  }, [muted]);

  function playVoice() {
    const audio = audioRef.current;
    if (!audio) return;
    setConnecting(true);
    setTimeout(() => {
      setConnecting(false);
      setPlaying(true);
      audio.currentTime = 0;
      audio.play().catch(() => setPlaying(false));
    }, 450);
  }

  function stopVoice() {
    const audio = audioRef.current;
    if (audio) {
      audio.pause();
      audio.currentTime = 0;
    }
    setPlaying(false);
    setConnecting(false);
  }

  function onAudioEnded() {
    setPlaying(false);
  }

  function sendMessage() {
    if (!draft.trim()) return;
    const userText = draft.trim();
    setDraft("");
    setMessages((m) => [...m, { from: "user", text: userText }]);
    // Simulate a brief thinking pause + a canned response. Plays the voice
    // sample so the user hears something for every turn.
    setTimeout(() => {
      const response = cannedResponseFor(userText, agent.mainGoal, voice);
      setMessages((m) => [...m, { from: "agent", text: response }]);
      playVoice();
    }, 700);
  }

  const orbDuration = playing ? 6 : connecting ? 12 : 24;
  const isActive = playing || connecting;

  return (
    <div className="flex flex-col bg-white border-l border-neutral-200">
      {/* Test header */}
      <div className="px-5 py-3 border-b border-neutral-200 flex items-center justify-between">
        <div className="inline-flex rounded-full bg-neutral-100 p-0.5 text-[12px] font-medium">
          <button
            onClick={() => setTab("inline")}
            className={cn(
              "px-3 py-1 rounded-full transition-colors",
              tab === "inline" ? "bg-white text-neutral-950 shadow-sm" : "text-neutral-600"
            )}
          >
            Inline
          </button>
          <button
            onClick={() => setTab("widget")}
            className={cn(
              "px-3 py-1 rounded-full transition-colors",
              tab === "widget" ? "bg-white text-neutral-950 shadow-sm" : "text-neutral-600"
            )}
          >
            Widget
          </button>
        </div>
        <button
          onClick={() => setMuted((v) => !v)}
          className="size-8 rounded-full hover:bg-neutral-100 flex items-center justify-center text-neutral-600"
          aria-label={muted ? "Unmute" : "Mute"}
        >
          {muted ? <VolumeX className="size-4" /> : <Volume2 className="size-4" />}
        </button>
      </div>

      {/* Audio element */}
      <audio ref={audioRef} src={voice.audioSrc} preload="auto" onEnded={onAudioEnded} />

      {/* Orb area */}
      <div className="flex-1 flex flex-col items-center justify-center px-6 py-6 min-h-[320px]">
        <div
          className="relative"
          style={{ filter: "brightness(0.95) saturate(1.05)" }}
        >
          <motion.div
            animate={{ scale: isActive ? [1, 1.02, 1] : [1, 1.005, 1] }}
            transition={{ duration: playing ? 2 : 4, repeat: Infinity, ease: "easeInOut" }}
          >
            <SiriOrb
              size="200px"
              colors={palette}
              animationDuration={orbDuration}
            />
          </motion.div>

          <button
            onClick={isActive ? stopVoice : playVoice}
            aria-label={isActive ? "End call" : "Start call"}
            className="absolute -bottom-2 left-1/2 -translate-x-1/2 size-12 rounded-full flex items-center justify-center shadow-lg border-4 border-white bg-neutral-950 hover:bg-neutral-800 text-white transition-colors"
          >
            {isActive ? <PhoneOff className="size-4" /> : <Phone className="size-4" />}
          </button>
        </div>

        <p className="mt-6 text-[11px] text-neutral-500 text-center max-w-[260px]">
          Hit the phone to hear how <span className="font-medium text-neutral-800">{agent.name}</span> sounds.
          Send a message below to see how it would reply.
        </p>
      </div>

      {/* Chat transcript */}
      <div className="px-5 pb-3 space-y-1.5 max-h-[180px] overflow-y-auto">
        {messages.slice(-4).map((m, i) => (
          <ChatBubble key={`${i}-${m.text.slice(0, 8)}`} from={m.from} text={m.text} />
        ))}
      </div>

      {/* Chat input */}
      <div className="border-t border-neutral-200 p-3">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            sendMessage();
          }}
          className="flex items-center gap-2 rounded-full border border-neutral-300 bg-white pl-4 pr-1.5 py-1 focus-within:border-neutral-900 focus-within:ring-2 focus-within:ring-neutral-200"
        >
          <input
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            placeholder="Send a message to start a chat"
            className="flex-1 bg-transparent text-[13px] outline-none placeholder:text-neutral-400 py-1"
          />
          <button
            type="submit"
            disabled={!draft.trim()}
            className="size-8 rounded-full bg-neutral-950 text-white flex items-center justify-center disabled:opacity-40 disabled:cursor-not-allowed hover:bg-neutral-800 transition-colors"
            aria-label="Send"
          >
            <Send className="size-3.5" />
          </button>
        </form>
      </div>
    </div>
  );
}

function ChatBubble({ from, text }: { from: "user" | "agent"; text: string }) {
  return (
    <div className={cn("flex", from === "user" ? "justify-end" : "justify-start")}>
      <div
        className={cn(
          "max-w-[85%] rounded-2xl px-3 py-1.5 text-[12.5px] leading-snug",
          from === "user"
            ? "bg-neutral-950 text-white"
            : "bg-neutral-100 text-neutral-900"
        )}
      >
        {text}
      </div>
    </div>
  );
}

// Canned response generator — strictly mock. Looks at the user's message
// for cues and replies in the agent's voice's language register. Enough
// to make the demo feel real without wiring a backend.
function cannedResponseFor(userText: string, mainGoal: string, voice: Voice): string {
  const q = userText.toLowerCase();
  const urdu = voice.language === "Urdu" || voice.language === "Urdu + English";
  const greet = /salam|hi|hello|hey|aoa|assalam/.test(q);
  const order = /order|pizza|menu|deal|food|buy|chahiye|chahta|chahti/.test(q);
  const help = /help|madad|issue|problem|complain|shikayat/.test(q);
  const thanks = /thanks|thank you|shukria|shukr/.test(q);
  const bye = /bye|good ?bye|allah hafiz|khuda hafiz/.test(q);

  if (greet) {
    return urdu
      ? "Wa-alaikum-as-salam! Main aap ki kis tarah madad kar sakta hoon?"
      : "Hello! I'm glad you reached out. How can I help you today?";
  }
  if (order) {
    return urdu
      ? "Bilkul, abhi aap ka order lene mein madad karta hoon. Aap kya order karna chahein ge?"
      : "Of course. I can take your order right now. What would you like to start with?";
  }
  if (help) {
    return urdu
      ? "Aap fikr na karen, mein abhi aap ka masla check karta hoon. Ek minute."
      : "I'm sorry to hear that. Let me look into this for you right away.";
  }
  if (thanks) {
    return urdu
      ? "Aap ka shukria. Kya koi aur cheez main aap ke liye kar sakta hoon?"
      : "You're very welcome. Is there anything else I can help with?";
  }
  if (bye) {
    return urdu
      ? "Allah hafiz. Aap ka din acha guzray."
      : "Thanks for calling. Have a great day.";
  }

  // Default: paraphrase main goal so the response feels grounded
  const goalSnippet = mainGoal.split(".")[0].trim();
  if (goalSnippet) {
    return urdu
      ? `Theek hai. Yeh ${voice.name === "Hassan" ? "ka" : "is"} agent ke liye bana hai: ${goalSnippet.slice(0, 90)}. Aap kya jaanna chahein ge?`
      : `Got it. I'm built to ${goalSnippet.slice(0, 100).toLowerCase()}. Could you tell me a bit more about what you're trying to do?`;
  }
  return urdu
    ? "Theek hai. Aap thori detail share kar saktay hain?"
    : "Got it. Could you share a little more detail so I can help?";
}

// =============================================================
// Voice picker sheet
// =============================================================

function VoicePickerSheet({
  open,
  onOpenChange,
  currentVoiceId,
  onPick,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  currentVoiceId: string;
  onPick: (id: string) => void;
}) {
  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="right" className="!w-full sm:!max-w-md p-0 flex flex-col">
        <div className="px-6 pt-6 pb-3 border-b border-neutral-200">
          <SheetHeader className="p-0">
            <SheetTitle className="text-base">Change voice</SheetTitle>
            <SheetDescription className="text-xs">
              Pick the voice your agent uses on calls. Tap a tile to preview.
            </SheetDescription>
          </SheetHeader>
        </div>
        <div className="flex-1 overflow-y-auto p-4 space-y-2">
          {VOICES.map((v) => {
            const active = v.id === currentVoiceId;
            return (
              <div
                key={v.id}
                role="button"
                tabIndex={0}
                onClick={() => onPick(v.id)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") onPick(v.id);
                }}
                className={cn(
                  "flex items-center gap-3 rounded-2xl border p-2.5 pr-3 cursor-pointer transition-all",
                  active
                    ? "border-neutral-900 bg-neutral-50 shadow-[0_0_0_3px_rgba(0,0,0,0.05)]"
                    : "border-neutral-200 bg-white hover:border-neutral-300"
                )}
              >
                <VoicePreview voice={v} size="sm" showBadge={false} />
                <div className="flex-1 min-w-0">
                  <p className="text-[13px] font-semibold truncate">{v.name}</p>
                  <p className="text-[11px] text-neutral-500 truncate">
                    {v.tagline}
                  </p>
                  <p className="text-[11px] text-neutral-600 mt-0.5">
                    {v.language}
                  </p>
                </div>
                {active && (
                  <span className="size-5 shrink-0 rounded-full bg-neutral-950 text-white flex items-center justify-center text-[11px]">
                    ✓
                  </span>
                )}
              </div>
            );
          })}
        </div>
      </SheetContent>
    </Sheet>
  );
}

// =============================================================
// Small helpers
// =============================================================

function ConfigSection({
  title,
  subtitle,
  children,
}: {
  title: string;
  subtitle: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <p className="text-[13px] font-semibold">{title}</p>
      <p className="text-[11.5px] text-neutral-500 mt-0.5 mb-2 leading-snug">
        {subtitle}
      </p>
      {children}
    </div>
  );
}

function DetailSkeleton() {
  return (
    <div className="h-full p-6 grid grid-cols-1 lg:grid-cols-3 gap-4">
      <Skeleton className="h-full" />
      <Skeleton className="h-full" />
      <Skeleton className="h-full" />
    </div>
  );
}
