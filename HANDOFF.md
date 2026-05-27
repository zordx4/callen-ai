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

## 3) Phase 2 status: sprint DONE + create-agent + marketing site + live TTS

Started 2026-05-23. **All sprint days shipped.** Post-sprint additions: end-to-end create-agent flow with editor + test panel + widget embed, browser-side TTS so chat text and audio match, 16 new Pakistani-named voice samples, ambient motion on the auth pages, and **14 real marketing pages** so every footer link lands on substantive content.

**Project root:** `C:\Users\talha\voice-agent-dashboard\`
**Brand name:** **Callen.ai** (locked)
**Primary demo tenant:** **Cheezious**
**Dev server:** `npm run dev` from project root → http://localhost:3000
**GitHub:** https://github.com/zordx4/callen-ai (public, Vercel auto-deploy)
**Latest commit:** `33727f3` (Lulu placeholder cleanup)

---

## 4) Locked design system

| Element | Decision |
|---|---|
| Brand name | Callen.ai |
| Tagline (working) | "AI voice agents for every business call." |
| Aesthetic | ElevenLabs / Linear / Vercel: pure white minimalism + bold display typography |
| Colour palette | Pure white background, near-black text, neutral grayscale. **Identity surfaces (workspace avatars, agent template avatars, preview orb, voice palettes) are the documented exception** and use colourful gradients. |
| Font | Geist Sans (loaded via `next/font/google`) |
| Typography | Bold display weights, tight letter-spacing (`-0.04em`), italic accent words for emphasis |
| Buttons | Rounded-full pill, black filled primary, white outlined secondary |
| Cards | White with neutral-200 borders, rounded-3xl (24px) |
| Em-dashes | **Forbidden** in user-visible content |
| Scrollbars | Globally thin (8px, neutral thumb 14% → 26% on hover) via `globals.css` |
| Logo | Black rounded square + bold white C arc + single white centre dot. `inverse` prop for dark surfaces. |
| Favicon | `src/app/icon.svg`. Tab title template: "%s · Callen.ai". |

**Locked voice + language style:**
- Headlines italic-accent emphasis words
- Bilingual Urdu+English transcripts throughout
- **Agent voice convention** baked into all mock prompts AND `buildSystemPrompt`: greet warmly (assalam alaikum, khush amdeed) → confirm each item back → suggest one deal (never push) → verify address → restate full order with total + payment + ETA → close warmly. Under 25 words per turn.

---

## 5) Locked tech stack

| Layer | Library | Version | Notes |
|---|---|---|---|
| Framework | Next.js | 16.2.6 | **NOT THE NEXT.JS YOU KNOW.** Read `node_modules/next/dist/docs/`. `AGENTS.md` reminds you. |
| React | React | 19.2.4 | Server Components default. `"use client"` for interactive. |
| Styling | Tailwind CSS | v4 | v4 syntax differs from v3 in spots. |
| Components | shadcn | v4 | **Uses `@base-ui/react`, NOT radix-ui.** Triggers ARE buttons. Style triggers directly via className. |
| Animation | **motion** | 12.40.0 | Rebranded framer-motion. **Import from `"motion/react"`**. |
| Charts | Recharts | 3.8 | Pass `minWidth={1}` to `ResponsiveContainer`. |
| Tables | @tanstack/react-table | 8.21 | Hand-rolled tables used. |
| State | Zustand | 5.0 | `persist({skipHydration: true})` + `useHasHydrated()` gate. |
| Icons | lucide-react | 1.16 | |
| Dates | date-fns | 4.3 | |
| Toasts | sonner | 2.0 | `import { toast } from "sonner"`. |

**Critical gotchas (read before touching the editor or auth):**

1. **shadcn v4 base-ui buttons.** Never wrap `<Button>` inside `<DropdownMenuTrigger>` via `asChild` — nested `<button>` hydration error. Canonical pattern: `src/components/tenant-switcher.tsx`, `FilterDropdown` in `dashboard/page.tsx`.
2. **`VoicePreview` is `<div role="button">`** so it can be embedded inside any clickable row. Don't change back.
3. **`DropdownMenuLabel` requires `<DropdownMenuGroup>` parent.** Bare use throws `MenuGroupContext is missing` → Edge shows "page couldn't load". Use styled `<div>`s for visual headers inside menus.
4. **`Accordion.Root` prop is `multiple` (default false), NOT `openMultiple`.** Invalid prop gets forwarded to DOM div as unknown attribute.
5. **`useSearchParams` requires a Suspense boundary** in Next 16 production builds. Wrap the component using it in `<Suspense>` or the prerender fails. `src/app/(app)/agent/page.tsx` is the canonical fix.
6. **Zustand persist** needs `skipHydration: true` + `useHasHydrated()` gate. Pattern in `store.ts`, `workspace-store.ts`, `custom-agents-store.ts`.
7. **`AGENTS.md` at repo root** reminds agents to read `node_modules/next/dist/docs/`.
8. **PowerShell PATH refresh inline:** `$env:Path = [System.Environment]::GetEnvironmentVariable("Path","Machine") + ";" + [System.Environment]::GetEnvironmentVariable("Path","User")`.
9. **Headless screenshots miss motion animations.** Verify in real Chrome / Edge.
10. **MCP installed:** `magic` (21st.dev).
11. **Skills installed at `~/.claude/skills/`:** `ui-ux-pro-max`, `awesome-design-md` (71 brand DESIGN.md files).
12. **`gh` CLI** at `C:\Program Files\GitHub CLI\gh.exe`, auth `zordx4`. May need full path in fresh shells.
13. **`dev.run.log`, `.frames/`** in `.gitignore`.
14. **`next.config.ts`** has `typescript.ignoreBuildErrors: true` + `eslint.ignoreDuringBuilds: true` to dodge 3-4 pre-existing TS errors (Recharts Tooltip formatter, base-ui TooltipProvider). Runtime fine.
15. **Vercel push-to-deploy works.** On a failed build, the previous successful deploy stays live — that's why "voices not updating" can happen. Check deploy status via `gh api repos/zordx4/callen-ai/deployments` if changes don't show up after refresh.

---

## 6) File inventory

### `src/app/` — marketing routes
- `layout.tsx`, `globals.css` (global thin scrollbars), `icon.svg`
- **`page.tsx`** — landing. Uses `MarketingFooter` for the footer now.
- **`login/page.tsx`**, **`signup/page.tsx`** — split layouts. Dark side has `DarkPanelMotion`.
- **`use-cases/page.tsx`**, **`pricing/page.tsx`**, **`changelog/page.tsx`** — Product column.
- **`docs/api/page.tsx`**, **`docs/sdks/page.tsx`**, **`docs/mcp/page.tsx`**, **`status/page.tsx`** — Developers column.
- **`about/page.tsx`**, **`trust/page.tsx`**, **`careers/page.tsx`**, **`contact/page.tsx`** — Company column.
- **`privacy/page.tsx`**, **`terms/page.tsx`**, **`cookies/page.tsx`** — Legal.

### `src/app/(app)/` — app shell routes (auth-gated mental model, no real auth gate)
- `layout.tsx` — Sidebar + Header
- `dashboard/page.tsx` — ElevenLabs-style home with HeroStatStrip + 8-tab KPI strip + LiveActivitySection + QuickActions
- `analytics/page.tsx` — deep call analytics (legacy dashboard layout)
- `calls/page.tsx` — Call History table
- `calls/live/page.tsx` — Live Call Console
- `agent/page.tsx` — Agent Studio (15 templates + SiriOrb preview + pannable canvas + `?new=1` opens wizard + "Use template" → instant create). **Wrapped in `<Suspense>`** so `useSearchParams` builds cleanly.
- **`agent/[id]/page.tsx`** — custom agent editor + test panel (live TTS) + Widget embed
- `knowledge/page.tsx`, `tools/page.tsx`, `integrations/page.tsx` — functional add flows
- `voices/page.tsx` — voice library (16 voices, filters, mp3 sample playback)
- `whatsapp/`, `phone-numbers/`, `settings/`, `users/`, `tenants/` — all filled
- `escalations/`, `outbound/` — placeholders (off-sidebar)
- `hero-preview/`, `paths-preview/` — unused reference

### `src/components/`
- `logo.tsx`, `providers.tsx`, `sidebar.tsx` (with **Your agents** section), `header.tsx`, `tenant-switcher.tsx`, `user-menu.tsx`, `waveform.tsx`, `count-up.tsx`, `live-transcript-demo.tsx`, `page-placeholder.tsx`
- `testimonials-section.tsx`, `integrations-grid.tsx`, `brand-logo.tsx`
- `header/docs-sheet.tsx`, `header/ask-sheet.tsx`, `header/notifications-button.tsx`

### `src/components/marketing/` (new)
- **`marketing-nav.tsx`** — scroll-aware fixed top nav. Logo + 5 links + Log in / Sign up.
- **`marketing-footer.tsx`** — single source of truth for footer links. Any change propagates everywhere.
- **`marketing-shell.tsx`** — wraps page in nav + footer. Exports `MarketingHero` (eyebrow + title + lede) and `MarketingSection` for consistent typography.

### `src/components/auth/` (new)
- **`dark-panel-motion.tsx`** — drifting white orbs + voice waveform ribbon on the dark side of `/login` and `/signup`. Three motion layers, all monochrome.

### `src/components/agent/`
- `preview-call.tsx` — drives call state, routes per-template `previewColors` into SiriOrb
- `workflow-graph.tsx` — read-only canvas, pan + zoom
- `create-agent-wizard.tsx` — 5-step wizard (type → industry → use case → voice → name + main goal). On Create, calls `addAgent()` + routes to `/agent/[id]`.

### `src/components/voices/`
- `voice-preview.tsx` — `<div role="button">` outer (do not change back)
- `voice-card.tsx`, `voice-detail-sheet.tsx`

### `src/components/dashboard/`
- `home/kpi-chart-card.tsx`, `home/secondary-card.tsx`
- Legacy used by `/analytics`: `dashboard-hero.tsx`, `kpi-card.tsx`, `call-volume-chart.tsx`, `language-pie.tsx`, `intent-breakdown.tsx`, `recent-activity.tsx`

### `src/components/ui/`
Standard shadcn + **siri-orb.tsx** (CSS Houdini `@property` rotating conic gradients), testimonials-columns-1, text-reveal.

### `src/components/mockups/` (landing mockups)
8 mockup components, 2 unused.

### `src/lib/`
- `mock-data.ts` — 3 tenants (Cheezious is t1), users, 50 calls, transcript, agent configs, KB docs
- `mock-api.ts`
- `store.ts` — Zustand (current tenant + user)
- `workspace-store.ts` — KB/Tools/Integrations (`callen-workspace-store-v2`)
- `custom-agents-store.ts` — custom agents (`callen-custom-agents-v2`). `addAgent`, `updateAgent`, `removeAgent`, `regeneratePromptForAgent`.
- **`agent-meta.ts`** — `INDUSTRIES` (17), `USE_CASES` (13), `LLM_MODELS` (9: 3x Gemini + 3x GPT + 3x Claude), `BEHAVIOR_TRAITS` (12), `LANGUAGES` (Urdu + English), `buildSystemPrompt`, `buildFirstMessage`
- `utils.ts`
- `agent-templates.ts` — 15 templates with `previewColors`
- **`voice-library.ts`** — 16 Pakistani-named voices (Hira, Hamza, Ruhaan, Faraz, Sehar, Amna, Imran, Bilal, Armaan, Roohi, Sana, Aiza, Tariq, Junaid, Yasir, Mansoor). 6F / 10M. `TEMPLATE_VOICE_OVERRIDES` semantic map.
- **`voice-matcher.ts`** — picks the best `SpeechSynthesisVoice` for a persona via 6-tier ladder. Filters non-Latin names (`describeBrowserVoice`).
- **`use-tts.ts`** — React hook over `speechSynthesis`. Voice loading via `voiceschanged`. Bracket-stripping (`[warmly]` not spoken). Tracks `{ speaking, matchedVoice, matchedVoiceLabel, spokenText, supported, voicesReady }`. Cleanup on unmount.
- `voice-playback.ts` — single-source for which mp3 preview is playing
- `dashboard-home-data.ts` — KPI defs + filter generators
- `avatar-gradients.ts` — 12 organic palettes

### `public/voices/`
16 Pakistani-named mp3 slugs matching `voice-library.ts` IDs: `aiza, amna, armaan, bilal, faraz-cheerful, hamza-steady, hira-pro, imran-rich, junaid, mansoor, roohi, ruhaan, sana, sehar-sweet, tariq, yasir`.

---

## 7) Sprint progress + post-sprint

| Block | Status |
|---|---|
| Day 1-7 + refresh + landing polish + dashboard rebuild | ✅ |
| KB + Tools + Integrations functional, 7 secondary pages filled (`d59c3eb`) | ✅ |
| Colourful identity (`0258a81`), brand logos (`3757303` → `5cd8a55`) | ✅ |
| 15 role-based templates (`7f12210`) | ✅ |
| SiriOrb preview, 8 iterations (`b663525`) | ✅ |
| Header surfaces — Docs + Ask AI + Notifications (`aa14ef8`) | ✅ |
| Logo + favicon refinement (`4105074`, `80040d5`) | ✅ |
| GitHub push, Vercel auto-deploy live | ✅ |
| Dashboard polish — HeroStatStrip + LiveActivity + QuickActions (`81b5c5a`) | ✅ |
| 14 Edge-neural voices generated locally (`e9b9883`) | ✅ |
| Agent preview plays real audio (`072fcb0`) | ✅ |
| **End-to-end create-agent flow** — wizard + editor + test panel (`cc6b59c`) | ✅ |
| **Your agents in sidebar** (`aadffad`) | ✅ |
| **Smart prompts + UR/EN languages + 9 LLMs + 12 behavior traits** (`3f1e28a`) | ✅ |
| **base-ui hydration / Accordion / DropdownMenuLabel fixes** (`4d03a97`, `3323805`, `ee2e5e5`, `77266d1`, `c7f96f2`) | ✅ |
| **Widget embed + voice-chat consistency** (`b5d7f86`) | ✅ |
| **Voice catalog rebrand to 16 Pakistani names** (`81a3670`, `2cae163`) | ✅ |
| **Global thin scrollbars** (`3323805`) | ✅ |
| **Live browser TTS in agent test panel** (`57bb3af`, `cdc0a0e`, `b80a4da`) | ✅ |
| **Vercel build fix — Suspense around useSearchParams** (`46ef1cf`) | ✅ |
| **Ambient motion on /login + /signup dark side** (`250dfbc`) | ✅ |
| **14 real marketing pages for every footer link** (`5ec4f80`) | ✅ |

---

## 8) Dashboard home

`/dashboard` layout:
1. Active-calls pill (links to `/calls/live`, drift every 4.2s) + Deep-analytics link
2. Greeting: `[tenant] workspace` + time-based "Good morning, Talha"
3. **HeroStatStrip** — 4 KPI cards with `CountUp` + colour-aware delta chips
4. 8-tab nav (General, Evaluation, Data Collection, Audio, Tools, LLMs, Knowledge Base, Advanced)
5. Filter pill bar (range / granularity / agent)
6. Per-tab: 6-KPI strip + linked area chart + 2 sparkline cards
7. **LiveActivitySection** (2 cols) + **QuickActions** (1 col, dark surface)
8. Advanced tab → settings panel linking to `/settings`

---

## 9) Create-agent flow + live TTS test panel

**Two entry points → same editor:**

1. **Sidebar `+` or "Create agent"** → opens `CreateAgentWizard` (5 steps, ~30 sec)
2. **`/agent` template card "Use template"** → instantly creates agent pre-populated with template's name, system prompt, voice → routes to `/agent/[id]`

**Wizard steps:** type (Personal/Business/Blank) → industry (17) → use case (13) → voice (16 with inline mp3 preview) → name + main goal + chat-only toggle.

**Editor (`/agent/[id]`) — 3 columns:**

- **Column 1 (prompts):** Auto-generated system prompt with sections (Personality / Goal / Use case / Knowledge / Style / Limits). Freely editable. `Regenerate` button rebuilds from current config. First message textarea with Interruptible toggle.

- **Column 2 (config cards):**
  - Voice — opens `VoicePickerSheet` to swap among 16 voices
  - Language — Urdu Default chip + English chip with X to remove + "Add language" dropdown
  - LLM — DropdownMenu grouped by Google / OpenAI / Anthropic (9 models + descriptions)
  - Agent behavior — opens `BehaviorSheet` with 12 togglable trait chips (Respectful, Empathetic, Patient, Concise, Warm, Formal, Playful, Authoritative, Encouraging, Apologetic, Solution-focused, Detail-oriented). Selected traits get spliced into Style section on next Regenerate.

- **Column 3 (test panel):**
  - **Inline tab:** SiriOrb (per-voice palette) + phone button. **Phone button uses Web Speech API to speak the agent's actual configured first message** — no mp3, no fake bubble. Status line shows `Speaking as Hira · Uzma` + the actual spoken text in italic. Per-bubble hover-replay button on agent turns. Chat empty by default; user typing appends user + agent reply pairs (replies also spoken).
  - **Widget tab:** mini preview frame + HTML/React variant toggle + code snippet pre-filled with agent id + copy button + 3-step install guide.

**Sidebar "Your agents":** auto-section under Create agent. Tinted gradient dot + name + Draft amber pill or pulsing emerald dot.

**Persistence:** `callen-custom-agents-v2`. Stale voiceIds gracefully fall back to first voice (Hira) on load.

---

## 10) Voice catalog (16 voices, Pakistani-named)

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

**MP3 samples** still used for voice library / picker sheet / wizard step 4 (they're the studio-quality voice demos). **Web Speech API** drives the agent editor test panel so chat text and audio always match.

`voice-matcher.ts` ladder: Microsoft Asad/Uzma Urdu → any `ur-*` → Hindi neural (closest phonetically) → English neural gender-matched → any English → browser default. Non-Latin names hidden from UI label.

---

## 11) Marketing pages (15 routes, all real content)

The footer links to all 15. Shared `MarketingShell` wraps each in nav + footer.

**Product:** `/use-cases` (8 verticals), `/#integrations` (anchor), `/pricing` (3-tier in PKR + FAQ), `/changelog` (9 dated entries)

**Developers:** `/docs/api` (REST + WebSocket + webhooks), `/docs/sdks` (Node/Python/Go), `/docs/mcp` (Model Context Protocol explainer + register-server example), `/status` (7 services + 3 past incidents)

**Company:** `/about` (3-observation story + values), `/trust` (6 controls + compliance table + FAQs), `/careers` (5 open roles + culture), `/contact` (working form + direct channels)

**Legal:** `/privacy` (8 sections), `/terms` (11 sections, Pakistani jurisdiction), `/cookies` (4-row table + controls)

All written in plain language, no em-dashes, brand voice consistent.

---

## 12) Auth pages (dark-side motion)

`/login` and `/signup` share a dark left panel with three motion layers:
1. Dotted grid (6% opacity, static)
2. Three large soft white orbs drifting on independent 22s / 26s / 32s loops, heavy blur, 1.5-8% opacity
3. 64-bar voice-waveform ribbon in the negative space, deterministic per-index amplitude, staggered traveling wave

All monochrome (locked design respected). Content (logo, headline, stats / benefits) sits over via `relative z-10`.

---

## 13) Recent commit history (most recent first)

```
33727f3 chore: strip the "Dumb Lulu" placeholder titles from /hero-preview
36fffcf fix: link "What's new" pill straight to /changelog
a69ff3a docs: refresh HANDOFF — TTS + auth motion + 14 footer pages all shipped
5ec4f80 feat: real content for every footer destination (14 marketing pages)
250dfbc feat: ambient motion on the dark side of /login and /signup
46ef1cf fix: wrap useSearchParams in Suspense so production builds succeed
b80a4da fix: hide non-Latin browser-voice labels in status line
cdc0a0e fix: empty chat by default; phone speaks first message + shows it inline
57bb3af feat: live browser TTS in agent test panel — chat and audio always agree
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
```

Plus 4 small commits made via direct GitHub editor (toast message tweaks, HeroGeometric prop, page.tsx update) — preserved via rebase.

---

## 14) Open items / next moves

- **Real backend wiring** — Twilio + Whisper + Gemini/GPT-4o + ElevenLabs + Vapi/Retell-style runtime. Every flow is mock + localStorage today.
- **Production TTS via ElevenLabs API** — the `useTTS` hook + `voice-matcher` architecture is swap-ready. Replace the `speechSynthesis.speak()` call with an API fetch that streams back audio chunks for the chosen ElevenLabs voice id.
- **Top-callers leaderboard** on `/dashboard`
- **Agent health row per agent** on dashboard
- **Pakistan map** with pulsing call-origin dots
- **Command palette (Cmd+K)** for quick navigation
- **Real mobile sidebar** (hidden on `<md` today)
- **Four pre-existing TS errors** to clean up (Recharts Tooltip formatter on `kpi-chart-card.tsx` + `secondary-card.tsx`; base-ui TooltipProvider `delayDuration` on `providers.tsx`). Bypassed via `next.config.ts` flags.
- **Stale agent voiceIds in localStorage** silently fall back to Hira. Could add a one-time migration.

---

## 15) Git + GitHub state

**Branch:** `master`
**Latest commit:** `5ec4f80`
**Remote:** `origin` → https://github.com/zordx4/callen-ai (public, Vercel-connected)
**`gh` CLI:** authenticated as `zordx4`
**`.gitignore`:** `dev.run.log`, `.frames/`, standard Next.js entries

---

## 16) Memory files

`C:\Users\talha\.claude\projects\C--\memory\`:
- `MEMORY.md` — index
- `user_profile.md`
- `project_voice_agent.md` — SDS-locked architecture
- `project_voice_agent_build.md` — active build phase (kept in sync with this HANDOFF)

---

## 17) How to resume in a new chat

Paste this entire HANDOFF.md as the first message in a fresh Claude chat:

> "Read the handoff doc above. Dev server lives at http://localhost:3000 (restart with `cd C:\Users\talha\voice-agent-dashboard && npm run dev` if needed). Repo + Vercel: https://github.com/zordx4/callen-ai. Let's <next task>."

---

## 18) Honest assessment

- **Sprint is done. Create-agent flow is live. TTS is wired. Footer pages all real. Auth pages have motion.** What you can do in the app today: sign up → create an agent from a template OR via the 5-step wizard → tune the prompt / language / LLM / behavior traits → hear the agent literally speak its first message in your browser (in Urdu, in English, gender-matched browser voice) → save → publish → see it in the sidebar's Your agents list → copy a widget embed snippet. All zero-backend, all client-side persistence.
- **Still "looks like SaaS", not "production SaaS."** No real Twilio, no real Whisper, no real ElevenLabs. The widget script URL is fictional. The `/status` page is hard-coded green.
- **For viva and portfolio, the bar is comfortably exceeded.** SiriOrb, smart prompt generator, 12-trait behavior selector, 16-voice catalog with browser TTS that actually speaks the configured text, 18 in-app routes, 15 marketing routes, working footer, ambient motion on auth, end-to-end create-agent flow — all clear "industry-grade" signals.

---

## 19) Working style I appreciate

- Tight, scannable responses (markdown tables, code blocks, bold for key items)
- Tool calls batched into single messages when possible
- Honest "I don't know" or "this could be better" callouts
- Commits at each milestone with detailed messages
- Bias toward shipping over perfecting
- **No em-dashes** anywhere in user-visible content

---

**End of handoff. Last refreshed at commit `33727f3`. Sprint + create-agent flow + voice rebrand + live TTS + marketing site all shipped. "What's new" pill links to /changelog now; Lulu placeholders stripped. Ready for backend wiring, polish, or whatever you direct next.**
