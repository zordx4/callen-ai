// Create Agent — 5-step wizard launched from /agent or the sidebar "+" button.
// Step 1: Agent type   (Personal / Business / Blank)
// Step 2: Industry     (17 cards)
// Step 3: Use case     (13 cards)
// Step 4: Voice        (pick from the library, with inline preview playback)
// Step 5: Complete     (name, website, main goal, chat-only + procedures toggles)
//
// State is local. On Create the form toasts and the dialog resets. Persisting
// to a real custom-agent store can come later — for now this matches the
// ElevenLabs-style flow the user wants to demo in viva.

"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "motion/react";
import {
  ArrowRight,
  ArrowUpRight,
  ChevronLeft,
  Plus,
  ShoppingBag,
  HeartPulse,
  Landmark,
  Home,
  GraduationCap,
  Plane,
  Car,
  Briefcase,
  Cpu,
  Building2,
  UtensilsCrossed,
  Factory,
  HeartHandshake,
  Scale,
  HandHeart,
  Tv,
  HelpCircle,
  Headphones,
  TrendingUp,
  BookOpen,
  Calendar,
  Users,
  Phone,
  ShoppingCart,
  CalendarCheck,
  Star,
  Truck,
  Heart,
  type LucideIcon,
} from "lucide-react";
import { toast } from "sonner";

import { cn } from "@/lib/utils";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { VOICES, type Voice } from "@/lib/voice-library";
import { VoicePreview } from "@/components/voices/voice-preview";
import { useCustomAgentsStore } from "@/lib/custom-agents-store";

// =============================================================
// Step data
// =============================================================

type Step = 1 | 2 | 3 | 4 | 5;
type AgentType = "personal" | "business" | "blank";

type IndustryOption = { id: string; label: string; icon: LucideIcon };
const INDUSTRIES: IndustryOption[] = [
  { id: "retail",        label: "Retail & E-commerce",   icon: ShoppingBag },
  { id: "healthcare",    label: "Healthcare & Medical",   icon: HeartPulse },
  { id: "finance",       label: "Finance & Banking",      icon: Landmark },
  { id: "real-estate",   label: "Real Estate",            icon: Home },
  { id: "education",     label: "Education & Training",   icon: GraduationCap },
  { id: "hospitality",   label: "Hospitality & Travel",   icon: Plane },
  { id: "automotive",    label: "Automotive",             icon: Car },
  { id: "professional",  label: "Professional Services",  icon: Briefcase },
  { id: "technology",    label: "Technology & Software",  icon: Cpu },
  { id: "government",    label: "Government & Public",    icon: Building2 },
  { id: "food",          label: "Food & Beverage",        icon: UtensilsCrossed },
  { id: "manufacturing", label: "Manufacturing",          icon: Factory },
  { id: "fitness",       label: "Fitness & Wellness",     icon: HeartHandshake },
  { id: "legal",         label: "Legal Services",         icon: Scale },
  { id: "nonprofit",     label: "Non-Profit",             icon: HandHeart },
  { id: "media",         label: "Media & Entertainment",  icon: Tv },
  { id: "other",         label: "Other",                  icon: HelpCircle },
];

type UseCaseOption = { id: string; label: string; icon: LucideIcon };
const USE_CASES: UseCaseOption[] = [
  { id: "customer-support",  label: "Customer Support",       icon: Headphones },
  { id: "outbound-sales",    label: "Outbound Sales",         icon: TrendingUp },
  { id: "learning",          label: "Learning and Development", icon: BookOpen },
  { id: "scheduling",        label: "Scheduling",             icon: Calendar },
  { id: "lead-qualification",label: "Lead Qualification",     icon: Users },
  { id: "answering",         label: "Answering Service",      icon: Phone },
  { id: "order-taking",      label: "Order Taking",           icon: ShoppingCart },
  { id: "reservation",       label: "Reservation Management", icon: CalendarCheck },
  { id: "menu-rec",          label: "Menu Recommendations",   icon: Star },
  { id: "delivery",          label: "Delivery Tracking",      icon: Truck },
  { id: "loyalty",           label: "Loyalty Programs",       icon: Heart },
  { id: "nutrition",         label: "Nutritional Information",icon: Heart },
  { id: "other",             label: "Other",                  icon: HelpCircle },
];

// =============================================================
// Wizard
// =============================================================

type Props = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

export function CreateAgentWizard({ open, onOpenChange }: Props) {
  const router = useRouter();
  const addAgent = useCustomAgentsStore((s) => s.addAgent);

  const [step, setStep] = useState<Step>(1);
  const [type, setType] = useState<AgentType | null>(null);
  const [industry, setIndustry] = useState<string | null>(null);
  const [useCase, setUseCase] = useState<string | null>(null);
  const [voiceId, setVoiceId] = useState<string | null>(null);
  const [name, setName] = useState("");
  const [website, setWebsite] = useState("");
  const [mainGoal, setMainGoal] = useState("");
  const [chatOnly, setChatOnly] = useState(false);

  const NAME_MAX = 50;

  function reset() {
    setStep(1);
    setType(null);
    setIndustry(null);
    setUseCase(null);
    setVoiceId(null);
    setName("");
    setWebsite("");
    setMainGoal("");
    setChatOnly(false);
  }

  function close() {
    onOpenChange(false);
    // Reset slightly after the close animation
    setTimeout(reset, 250);
  }

  function next() {
    if (step < 5) setStep((s) => (s + 1) as Step);
  }
  function back() {
    if (step > 1) setStep((s) => (s - 1) as Step);
  }

  function canProceed(): boolean {
    if (step === 1) return type !== null;
    if (step === 2) return industry !== null;
    if (step === 3) return useCase !== null;
    if (step === 4) return voiceId !== null;
    if (step === 5) return name.trim().length > 0 && mainGoal.trim().length > 0;
    return false;
  }

  function create() {
    if (!voiceId) return;
    const id = addAgent({
      name: name.trim() || "Untitled Agent",
      type,
      industry,
      useCase,
      voiceId,
      website: website.trim(),
      mainGoal: mainGoal.trim(),
      chatOnly,
    });
    const voice = VOICES.find((v) => v.id === voiceId);
    toast.success(`${name || "Agent"} created`, {
      description: voice
        ? `Voice: ${voice.name} · ${voice.language}`
        : "Your custom agent is ready.",
    });
    close();
    // Land on the new agent's editor + test page.
    router.push(`/agent/${id}`);
  }

  const stepTitle = STEP_META[step].title;
  const stepSubtitle = STEP_META[step].subtitle;

  return (
    <Dialog open={open} onOpenChange={(o) => (o ? onOpenChange(true) : close())}>
      <DialogContent
        className="!max-w-3xl p-0 gap-0 overflow-hidden"
        showCloseButton
      >
        <div className="flex flex-col max-h-[88vh]">
          {/* Header */}
          <div className="px-7 pt-7 pb-4">
            <DialogTitle className="text-[22px] font-bold tracking-tight">
              {stepTitle}
            </DialogTitle>
            <DialogDescription className="text-[13px] text-neutral-500 mt-0.5">
              {stepSubtitle}
            </DialogDescription>
          </div>

          {/* Body */}
          <div className="flex-1 overflow-y-auto px-7 pb-2">
            <AnimatePresence mode="wait">
              <motion.div
                key={step}
                initial={{ opacity: 0, x: 12 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -12 }}
                transition={{ duration: 0.18 }}
              >
                {step === 1 && (
                  <StepType
                    selected={type}
                    onSelect={(t) => {
                      setType(t);
                      // Auto advance for a snappier feel
                      setTimeout(next, 220);
                    }}
                  />
                )}
                {step === 2 && (
                  <StepIndustry
                    selected={industry}
                    onSelect={(id) => {
                      setIndustry(id);
                      setTimeout(next, 220);
                    }}
                  />
                )}
                {step === 3 && (
                  <StepUseCase
                    selected={useCase}
                    onSelect={(id) => {
                      setUseCase(id);
                      setTimeout(next, 220);
                    }}
                  />
                )}
                {step === 4 && (
                  <StepVoice
                    selected={voiceId}
                    onSelect={setVoiceId}
                  />
                )}
                {step === 5 && (
                  <StepComplete
                    name={name}
                    setName={(v) => setName(v.slice(0, NAME_MAX))}
                    nameMax={NAME_MAX}
                    website={website}
                    setWebsite={setWebsite}
                    mainGoal={mainGoal}
                    setMainGoal={setMainGoal}
                    chatOnly={chatOnly}
                    setChatOnly={setChatOnly}
                  />
                )}
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Footer */}
          <div className="border-t border-neutral-200 bg-white px-7 py-4 flex items-center justify-between gap-3">
            {step > 1 ? (
              <Button
                variant="outline"
                onClick={back}
                className="rounded-full gap-1 h-9 px-4"
              >
                <ChevronLeft className="size-4" />
                Back
              </Button>
            ) : (
              <span />
            )}

            {/* Pagination dots */}
            <div className="flex items-center gap-1.5">
              {[1, 2, 3, 4, 5].map((i) => (
                <span
                  key={i}
                  className={cn(
                    "h-1.5 rounded-full transition-all",
                    i === step ? "w-6 bg-neutral-950" : "w-1.5 bg-neutral-300"
                  )}
                />
              ))}
            </div>

            {step === 5 ? (
              <Button
                onClick={create}
                disabled={!canProceed()}
                className="rounded-full h-9 px-5"
              >
                Create Agent
              </Button>
            ) : step === 4 ? (
              <Button
                onClick={next}
                disabled={!canProceed()}
                className="rounded-full h-9 px-5 gap-1"
              >
                Next
                <ArrowRight className="size-4" />
              </Button>
            ) : (
              <span className="w-[92px]" />
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

// =============================================================
// Step metadata
// =============================================================

const STEP_META: Record<Step, { title: string; subtitle: string }> = {
  1: {
    title: "New agent",
    subtitle: "What type of agent would you like to create?",
  },
  2: {
    title: "What industry is your business in?",
    subtitle: "Select the industry that best describes your business",
  },
  3: {
    title: "Use case",
    subtitle: "What will your agent help with?",
  },
  4: {
    title: "Pick a voice",
    subtitle: "Choose how your agent will sound on calls. Tap any tile to preview.",
  },
  5: {
    title: "Complete your agent",
    subtitle: "Name your agent, describe its goal, and optionally add your website",
  },
};

// =============================================================
// Step 1 — Agent type
// =============================================================

function StepType({
  selected,
  onSelect,
}: {
  selected: AgentType | null;
  onSelect: (t: AgentType) => void;
}) {
  return (
    <div className="space-y-3">
      {/* Browse templates link */}
      <button
        type="button"
        onClick={() => toast("Switch to template browser", { description: "Pick from the 15 prebuilt templates." })}
        className="w-full flex items-center justify-center gap-2 rounded-2xl border border-neutral-200 hover:border-neutral-300 px-4 py-3.5 text-[13px] font-medium text-neutral-800 transition-colors"
      >
        <span className="inline-flex items-center gap-1.5">
          <span className="grid grid-cols-2 gap-0.5">
            <span className="size-1.5 rounded-[2px] bg-neutral-500" />
            <span className="size-1.5 rounded-[2px] bg-neutral-500" />
            <span className="size-1.5 rounded-[2px] bg-neutral-500" />
            <span className="size-1.5 rounded-[2px] bg-neutral-500" />
          </span>
          Browse Templates
        </span>
        <ArrowUpRight className="size-3.5 text-neutral-500" />
      </button>

      {/* Personal Assistant + Business Agent — two cards with chat previews */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <TypeCard
          active={selected === "personal"}
          onClick={() => onSelect("personal")}
          icon={<UserIcon />}
          label="Personal Assistant"
          preview={<ChatPreviewPersonal />}
        />
        <TypeCard
          active={selected === "business"}
          onClick={() => onSelect("business")}
          icon={<BriefcaseIcon />}
          label="Business Agent"
          badge="Improved"
          preview={<ChatPreviewBusiness />}
        />
      </div>

      <button
        type="button"
        onClick={() => onSelect("blank")}
        className={cn(
          "w-full flex items-center justify-center gap-2 rounded-2xl border-2 border-dashed px-4 py-3.5 text-[13px] font-medium transition-colors",
          selected === "blank"
            ? "border-neutral-900 bg-neutral-50 text-neutral-950"
            : "border-neutral-300 hover:border-neutral-400 text-neutral-700"
        )}
      >
        <span className="size-5 rounded-full border border-dashed border-neutral-400 flex items-center justify-center">
          <Plus className="size-3" />
        </span>
        Blank Agent
      </button>
    </div>
  );
}

function TypeCard({
  active,
  onClick,
  icon,
  label,
  preview,
  badge,
}: {
  active: boolean;
  onClick: () => void;
  icon: React.ReactNode;
  label: string;
  preview: React.ReactNode;
  badge?: string;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "group relative rounded-2xl border bg-white text-left transition-all overflow-hidden",
        active
          ? "border-neutral-900 shadow-[0_0_0_3px_rgba(0,0,0,0.04)]"
          : "border-neutral-200 hover:border-neutral-300"
      )}
    >
      <div className="h-[180px] bg-neutral-50 p-4 flex items-end">
        {preview}
      </div>
      <div className="px-4 py-3 border-t border-neutral-200 flex items-center justify-between">
        <div className="flex items-center gap-2 text-[13px] font-medium text-neutral-800">
          {icon}
          {label}
        </div>
        {badge && (
          <span className="inline-flex items-center px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-700 text-[10px] font-semibold">
            {badge}
          </span>
        )}
      </div>
    </button>
  );
}

function ChatPreviewPersonal() {
  return (
    <div className="w-full space-y-1.5">
      <BubbleDark>Could you see whether I have any urgent outstanding emails?</BubbleDark>
      <BubbleLight small>Sure, let me check.</BubbleLight>
      <BubbleLight withOrb>
        You&apos;ve got one urgent email from your manager about tomorrow&apos;s meeting. Want a quick summary?
      </BubbleLight>
    </div>
  );
}

function ChatPreviewBusiness() {
  return (
    <div className="w-full space-y-1.5">
      <BubbleDark className="ml-auto">Can you tell me more about pricing?</BubbleDark>
      <BubbleLight withOrb>
        Absolutely! We offer three plans, Starter, Pro, and Enterprise. Want a quick breakdown, or should I help you pick the best fit?
      </BubbleLight>
    </div>
  );
}

function BubbleDark({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "inline-block max-w-[85%] rounded-2xl bg-neutral-950 text-white text-[10.5px] leading-snug px-2.5 py-1.5",
        className
      )}
    >
      {children}
    </div>
  );
}

function BubbleLight({
  children,
  small,
  withOrb,
}: {
  children: React.ReactNode;
  small?: boolean;
  withOrb?: boolean;
}) {
  return (
    <div className="flex items-start gap-1.5">
      {withOrb && (
        <span
          aria-hidden
          className="mt-1.5 size-3 rounded-full shrink-0"
          style={{
            background:
              "radial-gradient(circle at 30% 30%, #5eead4 0%, transparent 45%), radial-gradient(circle at 70% 70%, #4338ca 0%, transparent 55%), linear-gradient(135deg, #06b6d4, #1e1b4b)",
          }}
        />
      )}
      <div
        className={cn(
          "inline-block rounded-2xl bg-neutral-100 text-neutral-900 leading-snug px-2.5 py-1.5",
          small ? "text-[10.5px] max-w-[60%]" : "text-[10.5px] max-w-[85%]"
        )}
      >
        {children}
      </div>
    </div>
  );
}

function UserIcon() {
  return (
    <svg
      width="14"
      height="14"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" />
      <circle cx="12" cy="7" r="4" />
    </svg>
  );
}
function BriefcaseIcon() {
  return (
    <svg
      width="14"
      height="14"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <rect width="20" height="14" x="2" y="7" rx="2" />
      <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" />
    </svg>
  );
}

// =============================================================
// Step 2 — Industry
// =============================================================

function StepIndustry({
  selected,
  onSelect,
}: {
  selected: string | null;
  onSelect: (id: string) => void;
}) {
  return (
    <div className="grid grid-cols-3 gap-3 pb-2">
      {INDUSTRIES.map((item) => (
        <OptionCard
          key={item.id}
          icon={item.icon}
          label={item.label}
          active={selected === item.id}
          onClick={() => onSelect(item.id)}
        />
      ))}
    </div>
  );
}

// =============================================================
// Step 3 — Use case
// =============================================================

function StepUseCase({
  selected,
  onSelect,
}: {
  selected: string | null;
  onSelect: (id: string) => void;
}) {
  return (
    <div className="grid grid-cols-3 gap-3 pb-2">
      {USE_CASES.map((item) => (
        <OptionCard
          key={item.id}
          icon={item.icon}
          label={item.label}
          active={selected === item.id}
          onClick={() => onSelect(item.id)}
        />
      ))}
    </div>
  );
}

function OptionCard({
  icon: Icon,
  label,
  active,
  onClick,
}: {
  icon: LucideIcon;
  label: string;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "flex flex-col items-center justify-center gap-2 rounded-2xl border px-3 py-5 transition-all",
        active
          ? "border-neutral-900 bg-neutral-50 shadow-[0_0_0_3px_rgba(0,0,0,0.05)]"
          : "border-neutral-200 bg-white hover:border-neutral-300"
      )}
    >
      <Icon className="size-5 text-neutral-700" strokeWidth={1.75} />
      <span className="text-[13px] font-medium text-neutral-900 text-center leading-tight">
        {label}
      </span>
    </button>
  );
}

// =============================================================
// Step 4 — Voice
// =============================================================

const LANGUAGE_FLAG: Record<string, string> = {
  Urdu: "🇵🇰",
  English: "🇺🇸",
  "Urdu + English": "🇵🇰",
};

function StepVoice({
  selected,
  onSelect,
}: {
  selected: string | null;
  onSelect: (id: string) => void;
}) {
  return (
    <div className="grid grid-cols-2 gap-2.5 pb-2">
      {VOICES.map((v) => (
        <VoicePickerRow
          key={v.id}
          voice={v}
          active={selected === v.id}
          onSelect={() => onSelect(v.id)}
        />
      ))}
    </div>
  );
}

function VoicePickerRow({
  voice,
  active,
  onSelect,
}: {
  voice: Voice;
  active: boolean;
  onSelect: () => void;
}) {
  const flag = LANGUAGE_FLAG[voice.language] ?? "🌐";
  return (
    <div
      role="button"
      tabIndex={0}
      onClick={onSelect}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          onSelect();
        }
      }}
      className={cn(
        "flex items-center gap-3 rounded-2xl border p-2.5 pr-3 cursor-pointer transition-all",
        active
          ? "border-neutral-900 bg-neutral-50 shadow-[0_0_0_3px_rgba(0,0,0,0.05)]"
          : "border-neutral-200 bg-white hover:border-neutral-300"
      )}
    >
      <VoicePreview voice={voice} size="sm" showBadge={false} />
      <div className="flex-1 min-w-0">
        <p className="text-[13px] font-semibold text-neutral-950 truncate tracking-tight">
          {voice.name}
        </p>
        <p className="text-[11px] text-neutral-500 truncate">
          {voice.tagline}
        </p>
        <div className="mt-1 flex items-center gap-1.5 text-[11px] text-neutral-700">
          <span aria-hidden>{flag}</span>
          <span>{voice.language}</span>
        </div>
      </div>
      {active && (
        <span className="size-5 shrink-0 rounded-full bg-neutral-950 text-white flex items-center justify-center text-[11px]">
          ✓
        </span>
      )}
    </div>
  );
}

// =============================================================
// Step 5 — Complete
// =============================================================

function StepComplete({
  name,
  setName,
  nameMax,
  website,
  setWebsite,
  mainGoal,
  setMainGoal,
  chatOnly,
  setChatOnly,
}: {
  name: string;
  setName: (v: string) => void;
  nameMax: number;
  website: string;
  setWebsite: (v: string) => void;
  mainGoal: string;
  setMainGoal: (v: string) => void;
  chatOnly: boolean;
  setChatOnly: (v: boolean) => void;
}) {
  return (
    <div className="space-y-5 pb-2">
      <div>
        <div className="flex items-center justify-between mb-1.5">
          <Label htmlFor="agent-name" className="text-[13px] font-medium">
            Agent Name <span className="text-rose-500">*</span>
          </Label>
          <span className="text-[11px] text-neutral-400 tabular-nums">
            {name.length}/{nameMax}
          </span>
        </div>
        <Input
          id="agent-name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="e.g. Dominos Urdu Agent"
          className="h-10 rounded-xl"
        />
      </div>

      <div>
        <Label htmlFor="agent-website" className="text-[13px] font-medium mb-1.5 block">
          Website <span className="text-neutral-400 font-normal">(Optional)</span>
        </Label>
        <Input
          id="agent-website"
          value={website}
          onChange={(e) => setWebsite(e.target.value)}
          placeholder="https://www.example.com"
          className="h-10 rounded-xl"
        />
        <p className="text-[11px] text-neutral-500 mt-1.5">
          We&apos;ll only access publicly available information from your
          website to personalize your agent.
        </p>
      </div>

      <div>
        <Label htmlFor="agent-goal" className="text-[13px] font-medium mb-1.5 block">
          Main Goal <span className="text-rose-500">*</span>
        </Label>
        <Textarea
          id="agent-goal"
          value={mainGoal}
          onChange={(e) => setMainGoal(e.target.value)}
          placeholder="Describe what this agent should do, in plain language."
          rows={4}
          className="rounded-xl resize-none"
        />
      </div>

      <div>
        <ToggleRow
          label="Chat only"
          description="Audio will not be processed and only text will be used"
          checked={chatOnly}
          onChange={setChatOnly}
        />
      </div>
    </div>
  );
}

function ToggleRow({
  label,
  description,
  badge,
  checked,
  onChange,
}: {
  label: string;
  description: string;
  badge?: string;
  checked: boolean;
  onChange: (v: boolean) => void;
}) {
  return (
    <div className="flex items-center gap-3 rounded-2xl border border-neutral-200 bg-neutral-50/50 px-4 py-3">
      <Switch
        checked={checked}
        onCheckedChange={onChange}
      />
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-1.5">
          <p className="text-[13px] font-medium text-neutral-900">{label}</p>
          {badge && (
            <span className="inline-flex items-center px-1.5 py-0.5 rounded-full bg-neutral-200 text-neutral-700 text-[9px] font-semibold tracking-wide">
              {badge}
            </span>
          )}
        </div>
        <p className="text-[11.5px] text-neutral-500 leading-tight mt-0.5">
          {description}
        </p>
      </div>
    </div>
  );
}
