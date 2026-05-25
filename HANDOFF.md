# Callen.ai — Project Handoff

> Paste this entire document into a fresh Claude chat to resume work seamlessly.

---

## 1) Who I am

I'm **Muhammad Talha Dilshad** (ID `2502944`), a **2nd-semester BS Software Engineering student at AIR University Islamabad** (Pakistan). My supervisor is **Dr. Zulfiqar Ali**.

I'm building a solo final-year-style project for my SE coursework sequence. I'm ambitious. I want this to look and feel like a real industry-grade SaaS, not a typical college project.

**How I like to be helped:**
- Honest, calibrated assessments over cheerleading
- Don't oversell. Undersell-then-deliver is the pattern I respond to
- When scoping work, distinguish "demo-quality MVP" from "production SaaS" explicitly
- I do my own research first, then ask Claude to validate and extend
- I'm on Windows 10 with both PowerShell and Git Bash available
- I prefer not to use em-dashes anywhere in user-visible content (use periods, colons, or `·` middots)

---

## 2) The bigger project

**Cloud-Based Multilingual AI Voice Agent for Telephony Customer Support Automation.** A multi-tenant SaaS platform that lets Pakistani businesses deploy an AI agent that handles inbound customer phone calls in Urdu and English.

**Three assignments delivered for the SE course:**
1. Assignment 1 — Scope Presentation (submitted to GCR, locked)
2. Assignment 2 — SRS document (submitted to GCR, locked)
3. Assignment 3 — SDS document (submitted on 2026-05-22; file at `C:\Users\talha\Downloads\2502944_SDS.docx`)

**SRS locks (must not contradict in code):**
- 4 actors: Customer, AI Voice Agent, Admin, Telephony System
- 11 FRs (login, receive call, STT, lang detect, generate response, TTS, play response, store logs, admin dashboard, reports, system config)
- 8 modules: Telephony Integration, Audio Streaming, Multilingual STT, Conversational AI Engine, Business Logic, API Integration, Voice Synthesis, Web-Based Business Management

**Architecture (SDS-justified):** Cascaded pipeline (STT → LLM → TTS) chosen over native speech-to-speech because native models still have weak Urdu support as of May 2026. Pipeline allows per-language quality control.

**Recommended 2026 tech stack (per SDS):**
- Twilio Voice + Media Streams (PSTN) + Twilio Voice SDK (WebRTC fallback)
- Pipecat or LiveKit Agents for orchestration
- Whisper large-v3 local (fallback to ElevenLabs Scribe v2)
- Gemini 2.5 Flash / GPT-4o for LLM
- ElevenLabs Eleven v3 for TTS
- pgvector on Postgres for RAG
- Next.js 16 + Tailwind + shadcn v4 (base-ui) for dashboard
- MCP for function/tool calling
- Langfuse for observability

---

## 3) Phase 2 status: 7-day UI sprint DONE + create-agent flow live

Started 2026-05-23. **All planned sprint days have shipped**, plus a substantial post-sprint round delivering the end-to-end create-agent flow with editor + test panel + widget embed. Repo is on GitHub and ready for Vercel deploy.

**Project root:** `C:\Users\talha\voice-agent-dashboard\`
**Brand name:** **Callen.ai** (locked)
**Primary demo tenant:** **Cheezious** (real Pakistani pizza + burger chain)
**Dev server:** `npm run dev` from project root → http://localhost:3000
**GitHub:** https://github.com/zordx4/callen-ai (public, Vercel-ready)

---

## 4) Locked design system

| Element | Decision |
|---|---|
| Brand name | Callen.ai |
| Tagline (working) | "AI voice agents for every business call." |
| Aesthetic | ElevenLabs / Linear / Vercel style: pure white minimalism + bold display typography |
| Colour palette | Pure white background, near-black text, neutral grayscale. **Identity surfaces (workspace avatars, agent template avatars, preview orb, voice palettes) are the documented exception** and use colourful gradients. |
| Font | Geist Sans (loaded via `next/font/google`) |
| Typography | Bold display weights for headings, tight letter-spacing (`-0.04em`), italic accent words for emphasis |
| Buttons | Rounded-full pill, black filled primary, white outlined secondary |
| Cards | White with neutral-200 borders, rounded-3xl (24px) |
| Em-dashes | **Forbidden** in user-visible content (use periods, colons, or `·` middots) |
| Scrollbars | Globally thin (8px, neutral thumb at 14% → 26% on hover) via `globals.css` |
| Logo | Black rounded square (rx=9 on 40-viewBox) + bold white C arc + single white centre dot. `inverse` prop for dark surfaces. Sizes sm 16px / default 24px / lg 32px / xl 44px. |
| Favicon | `src/app/icon.svg` — same mark. Tab title template: "%s · Callen.ai". |

**Locked voice + language style:**
- Headlines use italic accent on emphasis words
- Body copy is service-focused with concrete metrics
- Bilingual Urdu+English transcripts throughout

**Locked agent voice convention** (baked into mock-data system prompts, sample transcripts, LiveTranscriptDemo, agent-studio-mockup, AND the auto-generated system prompts in `buildSystemPrompt`):
- Respectful and structured Pakistani call-center flow
- Greet warmly ("assalam alaikum", "khush amdeed") → confirm each item back → suggest one deal (never push) → verify address → restate full order with total + payment + ETA → close warmly
- Polite forms throughout (ji, shukria, bilkul, bohat acha)
- Under 25 words per agent turn

---

## 5) Locked tech stack

| Layer | Library | Version | Notes |
|---|---|---|---|
| Framework | Next.js | 16.2.6 | **THIS IS NOT THE NEXT.JS YOU KNOW.** Read `node_modules/next/dist/docs/` first. `AGENTS.md` at repo root reminds you. |
| React | React | 19.2.4 | Server Components default. Use `"use client"` for interactive. |
| Styling | Tailwind CSS | v4 | v4 syntax differs from v3 in spots. |
| Components | shadcn | v4 | **Uses `@base-ui/react`, NOT radix-ui.** Triggers ARE buttons; style directly via className. |
| Animation | **motion** | 12.40.0 | Rebranded framer-motion. **Import from `"motion/react"`**. |
| Charts | Recharts | 3.8 | Pass `minWidth={1}` to `ResponsiveContainer` to silence width(-1) warnings. |
| Tables | @tanstack/react-table | 8.21 | Hand-rolled tables used elsewhere. |
| State | Zustand | 5.0 | With `persist({skipHydration: true})` + `useHasHydrated()` gate. |
| Icons | lucide-react | 1.16 | |
| Dates | date-fns | 4.3 | |
| Toasts | sonner | 2.0 | `import { toast } from "sonner"`. |

**Critical gotchas (read before touching the editor):**

1. **shadcn v4 uses `@base-ui/react`.** Triggers ARE buttons; never wrap `<Button>` inside `<DropdownMenuTrigger>` via `asChild` — produces nested `<button>` hydration errors. Canonical pattern: `src/components/tenant-switcher.tsx` and `FilterDropdown` in `src/app/(app)/dashboard/page.tsx`.
2. **`VoicePreview` is `<div role="button">`** (not `<button>`) so it can be safely embedded inside other clickable rows. Don't change it back.
3. **base-ui `DropdownMenuLabel` requires a `<DropdownMenuGroup>` parent.** Used bare, it throws `MenuGroupContext is missing` which Edge surfaces as the generic "This page couldn't load" crash screen. Use plain styled `<div>`s for visual headers inside menus instead.
4. **base-ui `Accordion.Root` prop is `multiple` (default false), NOT `openMultiple`.** Passing `openMultiple` gets forwarded to the DOM div as an unknown attribute and React warns. Just omit it for single-open behaviour.
5. **Zustand persist needs `skipHydration: true`** + `useHasHydrated()` gate. Pattern in `src/lib/store.ts`, `workspace-store.ts`, `custom-agents-store.ts`.
6. **`AGENTS.md` at repo root** reminds agents the bundled docs at `node_modules/next/dist/docs/` are authoritative.
7. **PowerShell PATH refresh inline:** `$env:Path = [System.Environment]::GetEnvironmentVariable("Path","Machine") + ";" + [System.Environment]::GetEnvironmentVariable("Path","User")`.
8. **Headless screenshots miss motion animations.** Verify in real Chrome / Edge.
9. **MCP installed:** `magic` (21st.dev).
10. **Skills installed at `~/.claude/skills/`:** `ui-ux-pro-max`, `awesome-design-md` (71 brand DESIGN.md files).
11. **`gh` CLI** installed via winget at `C:\Program Files\GitHub CLI\gh.exe`, authenticated as `zordx4`. PATH may not auto-include — use full path or refresh.
12. **`dev.run.log`, `.frames/`** are in `.gitignore` as local scratch artefacts.
13. **`next.config.ts`** has `typescript.ignoreBuildErrors: true` + `eslint.ignoreDuringBuilds: true` to dodge four pre-existing TS errors (Recharts Tooltip formatter on two cards, base-ui TooltipProvider). Runtime is fine; types are gaps in third-party packages.

---

## 6) File inventory (current)

### `src/app/`
- `layout.tsx` — root layout, Geist font + Providers. Metadata title "%s · Callen.ai".
- `globals.css` — Tailwind v4 + monochrome tokens + global `.thin-scrollbar` defaults
- `page.tsx` — **MARKETING LANDING**. Hero → stat band → logos → IVR comparison → TextReveal manifesto → workflow + Agent Studio mockup → multichannel + Unified Feed → "Build in 5 min" → use cases → feature cards → three highlights → integrations grid → enterprise security → pricing → testimonials → FAQ → final CTA → footer.
- `icon.svg` — favicon
- `login/page.tsx`, `signup/page.tsx` — split layouts
- `(app)/` — route group:
  - `layout.tsx` — Sidebar + Header shell
  - `dashboard/page.tsx` — ElevenLabs-style home with HeroStatStrip + 8-tab KPI strip + LiveActivitySection + QuickActions
  - `analytics/page.tsx` — deep call analytics (legacy dashboard layout)
  - `calls/page.tsx` — Call History table
  - `calls/live/page.tsx` — Live Call Console
  - `agent/page.tsx` — Agent Studio (15 templates + SiriOrb preview + pannable canvas + **wizard launch on `?new=1`** + **"Use template" → instant create + jump to editor**)
  - **`agent/[id]/page.tsx`** — custom agent editor + test panel + widget embed (new today, see Section 9)
  - `knowledge/page.tsx`, `tools/page.tsx`, `integrations/page.tsx` — functional with add flows
  - `voices/page.tsx` — voice library (16 voices, filters, audio playback)
  - `whatsapp/`, `phone-numbers/`, `settings/`, `users/`, `tenants/` — all real data + working flows
  - `escalations/`, `outbound/` — placeholders (removed from sidebar, kept to avoid 404s)
- `hero-preview/page.tsx`, `paths-preview/page.tsx` — unused reference snippets

### `src/components/`
- `logo.tsx`, `providers.tsx`, `sidebar.tsx` (+ **Your agents section** today), `header.tsx`, `tenant-switcher.tsx`, `user-menu.tsx`, `waveform.tsx`, `count-up.tsx`, `live-transcript-demo.tsx`, `page-placeholder.tsx`
- `testimonials-section.tsx`, `integrations-grid.tsx`, `brand-logo.tsx`
- `header/docs-sheet.tsx`, `header/ask-sheet.tsx`, `header/notifications-button.tsx`

### `src/components/ui/`
Standard shadcn primitives: button, card, input, label, dialog, tabs, separator, badge, dropdown-menu, avatar, table, sheet, tooltip, select, switch, textarea, sonner, skeleton, scroll-area, accordion. Plus **siri-orb.tsx** (CSS Houdini `@property` rotating conic gradients), **testimonials-columns-1.tsx**, **text-reveal.tsx**.

### `src/components/mockups/` (landing mockups)
`agent-studio-mockup.tsx`, `unified-feed-mockup.tsx`, `phone-mockup.tsx`, `calendar-mockup.tsx`, `order-receipt-mockup.tsx`, `patient-card-mockup.tsx`, `multi-channel-mockup.tsx` (unused), `chat-interface-mockup.tsx` (unused).

### `src/components/dashboard/`
- `home/kpi-chart-card.tsx` — 6 KPI tabs → linked area chart
- `home/secondary-card.tsx` — sparkline KPI tile
- Legacy used by `/analytics`: `dashboard-hero.tsx`, `kpi-card.tsx`, `call-volume-chart.tsx`, `language-pie.tsx`, `intent-breakdown.tsx`, `recent-activity.tsx`

### `src/components/agent/`
- `preview-call.tsx` — drives call state (idle/connecting/connected/ending), routes per-template `previewColors` into SiriOrb
- `workflow-graph.tsx` — read-only canvas with pan + zoom
- **`create-agent-wizard.tsx`** (new today) — 5-step wizard: type → industry → use case → voice → name + main goal. On Create, calls `addAgent()` + routes to `/agent/[id]`.

### `src/components/voices/`
- `voice-preview.tsx` — orb-shaped tile that plays the voice's mp3. `<div role="button">` outer to prevent nesting errors.
- `voice-card.tsx`, `voice-detail-sheet.tsx`

### `src/lib/`
- `mock-data.ts` — 3 tenants (Cheezious is t1), users, 50 calls, transcript, agent configs, KB docs
- `mock-api.ts` — async wrapper around mock data
- `store.ts` — Zustand (current tenant + user)
- `workspace-store.ts` — persisted KB/Tools/Integrations slices (`callen-workspace-store-v2`)
- **`custom-agents-store.ts`** (new today) — persisted custom agents (`callen-custom-agents-v2`). `addAgent`, `updateAgent`, `removeAgent`, `regeneratePromptForAgent`. Defaults intelligent system prompt + first message via `buildSystemPrompt` / `buildFirstMessage` from `agent-meta`.
- **`agent-meta.ts`** (new today) — centralised metadata: `INDUSTRIES` (17), `USE_CASES` (13), `LLM_MODELS` (9: 3x Gemini + 3x GPT + 3x Claude), `BEHAVIOR_TRAITS` (12 togglable personality chips), `LANGUAGES` (Urdu + English), plus `buildSystemPrompt(input)` and `buildFirstMessage(input)` generators that emit Personality / Goal / Use case / Knowledge / Style / Limits sections from the agent's config.
- `utils.ts`
- `agent-templates.ts` — 15 role-based templates with `previewColors`. Voice mapping lives in `voice-library.ts` (semantic override map, not round-robin).
- **`voice-library.ts`** (rewritten today) — 16 Pakistani-named voices (Hira, Hamza, Ruhaan, Faraz, Sehar, Amna, Imran, Bilal, Armaan, Roohi, Sana, Aiza, Tariq, Junaid, Yasir, Mansoor). 6F / 10M. Each entry has `id`, `name`, `tagline`, `language`, `accent`, `gender`, `age`, `category`, `useCases`, `sample`, `audioSrc`. `TEMPLATE_VOICE_OVERRIDES` hand-maps each of the 15 templates to its most-fitting persona.
- `voice-playback.ts` — global single-source-of-truth for which voice preview is playing
- `dashboard-home-data.ts` — typed KPI defs + filter generators
- `avatar-gradients.ts` — 12 organic gradient palettes for identity surfaces (`gradientForId`, `gradientCssForId`)

### `public/voices/`
16 mp3s with Pakistani-named slugs (matching `voice-library.ts` IDs): `aiza.mp3`, `amna.mp3`, `armaan.mp3`, `bilal.mp3`, `faraz-cheerful.mp3`, `hamza-steady.mp3`, `hira-pro.mp3`, `imran-rich.mp3`, `junaid.mp3`, `mansoor.mp3`, `roohi.mp3`, `ruhaan.mp3`, `sana.mp3`, `sehar-sweet.mp3`, `tariq.mp3`, `yasir.mp3`.

---

## 7) Sprint progress — all shipped

| Block | Goal | Status |
|---|---|---|
| Day 1-4 + 2.5 | Scaffold, login, dashboard v1, landing, Live Call Console, Agent Studio v1 | ✅ |
| Refresh 1 | Sidebar workspace switcher, dashboard hero banner | ✅ |
| Refresh 2 | Testimonials, Cheezious brand, manifesto, integrations grid | ✅ |
| Dashboard rebuild | ElevenLabs-style home, working filters | ✅ (`c0c0dda`) |
| Day 5-7 fill | KB + Tools + Integrations functional, 7 secondary pages filled | ✅ (`d59c3eb`) |
| Identity colours | Workspace + template avatars, header restructure, profile dropdown | ✅ (`0258a81`) |
| Brand logos | SimpleIcons CDN + favicon fallback (9 providers) | ✅ (`3757303` → `5cd8a55`) |
| Templates | 15 role-based agent templates (from original 6) | ✅ (`7f12210`) |
| SiriOrb preview | 8 visual iterations, landed on tight tinted ring + uniform density | ✅ (`b663525`) |
| Header surfaces | Docs sheet + Ask AI chat + Notifications popover | ✅ (`aa14ef8`) |
| Logo + favicon | Refined mark + SVG favicon + tab title | ✅ (`4105074`, `80040d5`) |
| GitHub push | Public repo at github.com/zordx4/callen-ai | ✅ |
| Vercel build fixes | `ignoreBuildErrors` + (later) Accordion `multiple` fix | ✅ (`fd538df`, `ee2e5e5`) |
| Dashboard polish | HeroStatStrip + LiveActivity + QuickActions | ✅ (`81b5c5a`) |
| Voices library | 14 Edge-neural voices generated locally | ✅ (`e9b9883`) |
| Audio in preview | Agent preview plays the voice's real mp3 | ✅ (`072fcb0`) |
| **End-to-end create-agent flow** | Wizard + per-agent editor + test panel | ✅ (`cc6b59c`) |
| **Your agents in sidebar** | Auto-listing of created agents with tinted dot + Draft/Live status | ✅ (`aadffad`) |
| **Smart prompts + UR/EN languages + 9 LLMs + 12 behavior traits** | Agent editor config sections become real | ✅ (`3f1e28a`) |
| **Hydration + Accordion + DropdownMenuLabel fixes** | Crashes on opening Add language / LLM resolved | ✅ (`4d03a97`, `3323805`, `ee2e5e5`, `77266d1`, `c7f96f2`) |
| **Widget embed + voice-chat consistency** | Widget tab shows real HTML/React snippet with copy; phone button no longer adds contradictory chat bubble | ✅ (`b5d7f86`) |
| **Voice catalog rebrand** | 16 new high-quality voices, Pakistani names, gender-matched, semantic template mapping | ✅ (`81a3670`, `2cae163`) |
| **Global thin scrollbars** | 8px slim track app-wide via globals.css | ✅ (`3323805`) |

**Voices route (`/voices`) is built** — 16-voice library with filters, audio playback, voice cards, and detail sheet. Originally deferred but `e9b9883` shipped it.

---

## 8) Dashboard home

`/dashboard` is the ElevenLabs-style operations home.

**Layout (top to bottom):**
1. Active-calls pill (links to `/calls/live`, drift every 4.2s) + Deep-analytics link
2. Greeting: `[tenant] workspace` + time-based "Good morning, Talha"
3. **HeroStatStrip**: 4 KPI cards with `CountUp` on mount, colour-aware delta chips
4. 8-tab nav (General, Evaluation, Data Collection, Audio, Tools, LLMs, Knowledge Base, Advanced)
5. Filter pill bar (range / granularity / agent)
6. Per-tab: 6-KPI strip + linked area chart + 2 sparkline cards
7. **LiveActivitySection** (2 cols) + **QuickActions** (1 col, dark surface)
8. Advanced tab → settings panel with Escalation rules / Compliance / Webhooks / API keys

---

## 9) Create-agent flow (new this round)

**Two entry points → same editor:**

1. **Sidebar `+` or "Create agent"** → opens `CreateAgentWizard` (a Dialog). The sidebar link is `/agent?new=1` which auto-opens the wizard on mount.
2. **Template "Use template" button on `/agent`** → instantly creates an agent pre-populated with the template's name, system prompt, and round-robin voice. Skips the wizard for speed.

Both call `useCustomAgentsStore.addAgent()` and route to `/agent/[id]`.

**Wizard (5 steps):**
1. Agent type (Personal / Business / Blank) — auto-advances on click
2. Industry (17 options, 3-col grid) — auto-advances
3. Use case (13 options, 3-col grid) — auto-advances
4. Voice (16 entries with inline `VoicePreview` mp3 playback) — manual Next
5. Complete — name (50-char cap), website (optional), main goal (required), chat-only toggle. Create button persists + navigates.

**Editor (`/agent/[id]`) — 3 columns:**

- **Column 1 (prompts):** System prompt (auto-generated via `buildSystemPrompt` with Personality / Goal / Use case / Knowledge / Style / Limits sections; freely editable; `Regenerate` button rebuilds from current config; Wand2 stub for AI improve). First message (with Interruptible switch).
- **Column 2 (config cards):**
  - Voice — opens `VoicePickerSheet` to swap among 16 voices
  - Language — Urdu chip locked as Default; English chip with X to remove; "Add language" dropdown (only Urdu + English in the trimmed catalog); clicking a chip label opens "Make default" menu
  - LLM — DropdownMenu grouped by Google / OpenAI / Anthropic with 9 models + descriptions. Selecting persists.
  - Agent behavior — opens `BehaviorSheet` (right-side panel) with 12 togglable trait chips (Respectful, Empathetic, Patient, Concise, Warm, Formal, Playful, Authoritative, Encouraging, Apologetic, Solution-focused, Detail-oriented). Each trait has a lucide icon + description + a prompt line that gets spliced into the system prompt's Style section the next time the user hits Regenerate. The card shows up to 3 selected traits + `+N` for the rest, plus a chip row below.
- **Column 3 (test panel):**
  - Inline / Widget tab switch + mute toggle
  - **Inline tab:** SiriOrb (tinted by per-voice palette) with phone button. Phone plays the voice's mp3 — no chat bubble added (chat already shows the configured first message; adding a second bubble would lie about what's being spoken). Below the orb: "Playing voice sample of [Name]" indicator. Chat transcript shows first message + user text + canned bilingual responses. No audio on chat replies.
  - **Widget tab:** mini preview frame (browser chrome + corner orb) + HTML/React variant toggle + code snippet pre-filled with the agent's id (`<script src="https://widget.callen.ai/v1.js" data-agent-id="..." defer></script>`) + copy button (clipboard API + toast) + 3-step install guide + footer with live agent id and Draft/Live status pill.

**Header bar:** name + Main + Live 100% pill + Draft / Published badge + dirty-state Save button + Publish button.

**Sidebar "Your agents" section:** auto-appears under "Create agent" when at least one agent exists. Each row: tinted gradient dot (deterministic by agent.id), name (truncated), Draft amber pill or pulsing emerald dot. Count badge in section header.

**Persistence:** `callen-custom-agents-v2` localStorage key. v1 → v2 was bumped to invalidate old partial-schema agents. Old voiceIds gracefully fall back to first voice (Hira) on load.

---

## 10) Voice catalog (16 voices, Pakistani-named, gender-matched)

Source of truth: `src/lib/voice-library.ts`. Audio: `public/voices/<slug>.mp3`.

| # | Voice | Gender | Vibe | Category | Trending | Premium |
|---|---|---|---|---|---|---|
| 1 | Hira | F | Clear, warm, professional | Customer Service | ✓ | |
| 2 | Hamza | M | Clear and steady | Customer Service | ✓ | |
| 3 | Ruhaan | M | Clear and confident | Customer Service | ✓ | |
| 4 | Faraz | M | Cheerful, natural, soft | Conversational | | |
| 5 | Sehar | F | Sweet, lively, warm | Receptionist | | |
| 6 | Amna | F | Warm and motherly | Healthcare | ✓ | |
| 7 | Imran | M | Rich, confident, expressive | Sales | ✓ | ✓ |
| 8 | Bilal | M | Punchy, crisp, energetic | Sales | | |
| 9 | Armaan | M | Funny and expressive | Conversational | | |
| 10 | Roohi | F | Breathy, soft, whisper | Conversational | | ✓ |
| 11 | Sana | F | Warm, emotional companion | Conversational | | ✓ |
| 12 | Aiza | F | Cute and friendly young | Conversational | | ✓ |
| 13 | Tariq | M | Storyteller | Narration | | |
| 14 | Junaid | M | True-crime narrator | Narration | | ✓ |
| 15 | Yasir | M | Cinematic horror narrator | Narration | | ✓ |
| 16 | Mansoor | M | Firm collections agent | Customer Service | | |

`TEMPLATE_VOICE_OVERRIDES` maps each of the 15 agent templates to its most fitting persona (Accounts Receivable → Mansoor, Healthcare → Amna, Customer Support → Hira, etc.).

---

## 11) Preview orb (SiriOrb)

After ~10 visual iterations, the current orb is `src/components/ui/siri-orb.tsx`:
- CSS Houdini `@property --angle` drives a rotating colour blend
- Two conic gradients centred at 50% 50% (uniform colour density, no clustering)
- Heavy blur + contrast filter
- 1.5px tinted hairline ring (`color-mix(in oklch, var(--c2) 80%, transparent)`) — no drop shadow, no aura
- Respects `prefers-reduced-motion`
- API: `size` (px string), `colors` (`{ bg, c1, c2, c3 }`), `animationDuration` (seconds)

`preview-call.tsx` maps template `previewColors[1, 2, 3]` to SiriOrb's c1/c2/c3, applies `filter: brightness(0.92) saturate(1.0)`, and shrinks `animationDuration` when speaking (8s) vs idle (20s).

---

## 12) Header (top-right cluster)

`src/components/header.tsx`:
- Left: sidebar-toggle + page title from pathname mapping
- Right: `What's new` pill + `DocsButton` + `AskButton` + `NotificationsButton` + `UserMenu`

**Sheets/popovers** (all functional):
- `header/docs-sheet.tsx` — 8 categorised sections, ~22 articles, search + category chips
- `header/ask-sheet.tsx` — chat UI, 20-entry KB, keyword-scored matcher, typing simulation, deep-link buttons
- `header/notifications-button.tsx` — bell with unread badge, 8 seeded events, mark-read + navigate

---

## 13) Recent commit history (most recent first)

```
2cae163 feat: rebrand voice catalog with Pakistani names matched to gender
81a3670 feat: swap voice library to 16 new high-quality samples
b5d7f86 feat: real Widget tab + voice-chat consistency in agent editor
c7f96f2 fix: drop bare DropdownMenuLabel that crashed Add language + LLM menus
77266d1 fix: explicit remove button on language chip + trim to Urdu and English
ee2e5e5 fix: drop invalid openMultiple prop on landing Accordion
3323805 fix: nested-button error at the source + global thin scrollbars
4d03a97 fix: nested-button hydration error + thin scrollbar on editor
3f1e28a feat: smart prompts + language / LLM / behavior config + voice-chat consistency
aadffad feat: Your agents section in the sidebar
cc6b59c feat: end-to-end create-agent flow with editor + voice test panel
072fcb0 feat: planet orbs, vector use-case art, agent preview plays real audio
479d97f fix: rewrite Urdu samples in Nastaliq, regenerate audio
e9b9883 feat: voices library with 14 real playable voices
93ec23a docs: refresh HANDOFF for session switch — sprint complete
81b5c5a feat: hero stat strip + live activity feed + quick actions on home
```

---

## 14) Open items / next moves

- **Real backend wiring** (Twilio + Whisper + Gemini/GPT-4o + ElevenLabs + Vapi/Retell-style runtime). Currently every flow is mock data + local Zustand persistence.
- **Top-callers leaderboard widget** on `/dashboard`
- **Agent health row per agent** on dashboard
- **Pakistan map** showing call origins as pulsing dots
- **Command palette (Cmd+K)** for quick navigation
- **Real mobile sidebar** (currently hidden on `<md` screens)
- **Four pre-existing TS errors** to clean up: Recharts Tooltip formatter on `kpi-chart-card.tsx` + `secondary-card.tsx`; base-ui TooltipProvider `delayDuration` on `providers.tsx`. Bypassed via `next.config.ts` flags.
- **Stale agent voiceIds in localStorage** silently fall back to Hira on load. Could add a one-time migration if you'd rather patch them.

---

## 15) Git + GitHub state

**Branch:** `master`
**Latest commit:** `2cae163` — feat: rebrand voice catalog with Pakistani names matched to gender
**Remote:** `origin` → https://github.com/zordx4/callen-ai (public)
**`gh` CLI:** authenticated as `zordx4`, located at `C:\Program Files\GitHub CLI\gh.exe`
**`.gitignore`:** `dev.run.log`, `.frames/`, standard Next.js entries

---

## 16) Memory files (persist across Claude sessions)

These live at `C:\Users\talha\.claude\projects\C--\memory\`:
- `MEMORY.md` — index pointing to other memory files
- `user_profile.md` — about me (Talha, AIR Uni, SE student)
- `project_voice_agent.md` — SDS-locked architecture
- `project_voice_agent_build.md` — active build phase context (kept in sync with this HANDOFF)

A fresh chat reads MEMORY.md automatically and follows the links.

---

## 17) How to resume in a new chat

Paste this entire HANDOFF.md as the first message in a fresh Claude chat, then add a brief instruction:

> "Read the handoff doc above. Dev server lives at http://localhost:3000 (restart with `cd C:\Users\talha\voice-agent-dashboard && npm run dev` if needed). Repo at https://github.com/zordx4/callen-ai. Let's <next task>."

---

## 18) Honest assessment

- **The sprint is done and the create-agent flow is live.** Every planned route has substantial content + working flows. Wizard creates persisted agents, editor lets you tune prompts / language / LLM / behavior / voice, test panel lets you hear the voice, widget tab gives a copy-paste embed snippet. Sidebar lists your created agents.
- **It's still "looks like SaaS" not "production SaaS."** Zero real backend. Twilio, Whisper, ElevenLabs are all aspirational. Everything is mock data + localStorage. The widget code snippet points at a fictional `widget.callen.ai/v1.js` endpoint.
- **For viva and portfolio purposes, the bar is comfortably exceeded.** The interactive integrations grid, SiriOrb, streaming activity feed, smart prompt generator, 12-trait behavior selector, 16-voice catalog, consistent design system across 18 routes, working create-agent flow → editor → test → widget — all clear "industry-grade" signals.

---

## 19) Working style I appreciate

- Tight, scannable responses (markdown tables, code blocks, bold for key items)
- Tool calls batched into single messages when possible
- Honest "I don't know" or "this could be better" callouts over false confidence
- Commits at each milestone with detailed messages
- Bias toward shipping over perfecting
- **No em-dashes** anywhere in user-visible content

---

**End of handoff. Last refreshed at commit `2cae163`. Sprint + create-agent flow + voice rebrand all shipped. Ready for backend wiring, polish, or whatever you direct next.**
