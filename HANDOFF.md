# Callen.ai — Project Handoff

> Paste this entire document into a fresh Claude chat to resume work seamlessly.

---

## 1) Who I am

I'm **Muhammad Talha Dilshad** (ID `2502944`), a **2nd-semester BS Software Engineering student at AIR University Islamabad** (Pakistan). My supervisor is **Dr. Zulfiqar Ali**.

I'm building a solo final-year-style project for my SE coursework sequence. I'm ambitious — I want this to look and feel like a real industry-grade SaaS, not a typical college project.

**How I like to be helped:**
- Honest, calibrated assessments over cheerleading
- Don't oversell — undersell-then-deliver is the pattern I respond to
- When scoping work, distinguish "demo-quality MVP" from "production SaaS" explicitly
- I do my own research first, then ask Claude to validate and extend
- I'm on Windows 10 with both PowerShell and Git Bash available
- I prefer not to use em-dashes (`—`) anywhere in user-visible content

---

## 2) The bigger project

**Cloud-Based Multilingual AI Voice Agent for Telephony Customer Support Automation.** A multi-tenant SaaS platform that lets Pakistani businesses deploy an AI agent that handles inbound customer phone calls in Urdu and English.

**Three assignments delivered for the SE course:**
1. **Assignment 1 — Scope Presentation** (submitted to GCR, locked)
2. **Assignment 2 — SRS document** (submitted to GCR, locked)
3. **Assignment 3 — SDS document** (submitted on 2026-05-22; final file at `C:\Users\talha\Downloads\2502944_SDS.docx`)

**SRS locks (must not contradict in code):**
- 4 actors: Customer, AI Voice Agent, Admin, Telephony System
- 11 FRs (login, receive call, STT, lang detect, generate response, TTS, play response, store logs, admin dashboard, reports, system config)
- 8 modules: Telephony Integration, Audio Streaming, Multilingual STT, Conversational AI Engine, Business Logic, API Integration, Voice Synthesis, Web-Based Business Management

**Architecture decision (justified in SDS):** Cascaded pipeline (STT → LLM → TTS) chosen over native speech-to-speech (OpenAI Realtime, Gemini Live, Cartesia Sonic 3) because native models still have weak Urdu/regional language support as of May 2026. Pipeline allows per-language quality control. Architecture leaves room for future migration to Realtime API for English-only deployments.

**Recommended 2026 tech stack (documented in SDS):**
- Twilio Voice + Media Streams (PSTN) + Twilio Voice SDK (WebRTC for browser fallback)
- Pipecat or LiveKit Agents for orchestration
- Whisper large-v3 local (fallback to ElevenLabs Scribe v2)
- Gemini 2.5 Flash / GPT-4o for LLM
- ElevenLabs Eleven v3 for TTS
- pgvector on Postgres for RAG
- Next.js 15 + Tailwind + shadcn/ui for dashboard
- MCP for function/tool calling
- Langfuse for observability

---

## 3) Current focus: Phase 2 — Build the dashboard MVP

I'm in a **7-day UI sprint** (starting 2026-05-23) to build the actual product. After the semester papers end, I plan to also do the backend.

**Project root:** `C:\Users\talha\voice-agent-dashboard\`
**Brand name:** **Callen.ai** (locked, after iterating through Sawti / Telix / Voxon)
**Dev server command:** `npm run dev` from project root → http://localhost:3000

---

## 4) Locked design system

| Element | Decision |
|---|---|
| **Brand name** | Callen.ai |
| **Tagline (working)** | "AI voice agents for every business call." |
| **Aesthetic** | ElevenLabs / Linear / Vercel style: pure white minimalism + bold display typography + monochrome |
| **Colour palette** | Pure white background, near-black text, neutral grayscale. **No coloured accents anywhere.** |
| **Font** | Geist Sans (loaded via `next/font/google`) |
| **Typography** | Bold display weights for headings, tight letter-spacing (`-0.04em` on display sizes), italic accent words for emphasis |
| **Buttons** | Rounded-full pill, black filled primary, white outlined secondary |
| **Cards** | White with neutral-200 borders, rounded-3xl (24px) |
| **Em-dashes** | **Forbidden** anywhere in user-visible content (use periods, colons, or `·` middots) |
| **Logo** | Black rounded-square with white "C" arc + 3 voice-wave dots inside |
| **Mock tenant** | "Karachi Bites Restaurant" (Pakistani fast-food chain — primary demo persona) |

**Locked-in voice & language style:**
- Headlines use italic accent on emphasis words: *"AI voice agents for every business call."*
- Body copy is service-focused with concrete metrics ("Resolve 70%+ of inbound issues", "<800ms latency")
- Bilingual Urdu+English transcripts mixed throughout for authenticity

---

## 5) Locked tech stack (verified working)

| Layer | Library | Version | Notes |
|---|---|---|---|
| Framework | Next.js | 16.2.6 | **THIS IS NOT THE NEXT.JS YOU KNOW** — read `node_modules/next/dist/docs/` before writing code. There's an `AGENTS.md` at repo root reminding you of this. |
| React | React | 19.2.4 | Server Components by default. Use `"use client"` for interactive components. |
| Styling | Tailwind CSS | v4 | Note v4 syntax differs from v3 in spots |
| Components | shadcn | v4 | **Uses `@base-ui/react`, NOT radix-ui.** The `asChild` pattern doesn't work the same — triggers ARE buttons themselves. Style the trigger directly via className. |
| Animation | **motion** | 12.40.0 | The rebranded framer-motion. **Import from `"motion/react"`, NEVER `"framer-motion"`**. Same API. |
| Charts | Recharts | 3.8 | Used for dashboard charts. Note: gradient URL fills sometimes fail to render in donut charts — use solid colors. |
| Tables | @tanstack/react-table | 8.21 | Not used yet, available for Day 6 Call History. |
| State | Zustand | 5.0 | With `persist({ skipHydration: true })` to avoid SSR hydration errors. |
| Icons | lucide-react | 1.16 | |
| Dates | date-fns | 4.3 | |
| Toasts | sonner | 2.0 | Used via `import { toast } from "sonner"` |

**Critical gotchas already learned the hard way:**

1. **shadcn v4 button uses `@base-ui/react/button`.** The OLD `<DropdownMenuTrigger asChild><Button>...</Button></DropdownMenuTrigger>` produces nested `<button>` elements and hydration errors. Style the DropdownMenuTrigger directly with className.

2. **Zustand `persist` causes hydration mismatch** unless you set `skipHydration: true` and gate persisted-state reads behind a `useHasHydrated()` hook. Pattern lives in `src/lib/store.ts`.

3. **`AGENTS.md` at the repo root** says: "This is NOT the Next.js you know. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code." The bundled docs ARE the source of truth — your training data is out of date for this version.

4. **PowerShell tool calls don't pick up newly-installed PATH** unless refreshed inline:
   `$env:Path = [System.Environment]::GetEnvironmentVariable("Path","Machine") + ";" + [System.Environment]::GetEnvironmentVariable("Path","User")`

5. **Headless Edge screenshots can't capture motion library animations.** The page renders correctly in real browsers but headless captures elements at `opacity:0` (initial motion state). Trust the code; verify in real Chrome/Edge.

6. **MCP servers installed:**
   - `magic` (21st.dev) — generates UI components via natural language. API key already in `~/.claude.json`. Tools: `mcp__magic__21st_magic_component_builder`, `mcp__magic__21st_magic_component_inspiration`, `mcp__magic__21st_magic_component_refiner`, `mcp__magic__logo_search`.

7. **Skill installed:** `ui-ux-pro-max` at `~/.claude/skills/ui-ux-pro-max/` — searchable databases of 85 UI styles, 161 color palettes, 57 font pairings, 99 UX guidelines.

---

## 6) Everything we've built (file inventory)

### `src/app/`
- `layout.tsx` — root layout, Geist font + Providers wrapper
- `globals.css` — Tailwind v4 + monochrome design tokens. **Cream variable now resolves to pure white (legacy alias).** Marquee keyframes + card-lift utility.
- `page.tsx` — **MARKETING LANDING** (the showpiece). Mirrors elevenlabs.io/agents structure. Pure white minimalism, bold display headlines with italic accent.
- `login/page.tsx` — split layout: dark grid brand panel left + clean white form right
- `signup/page.tsx` — same split layout, benefits checklist on dark side
- `(app)/` — route group containing the dashboard (parens = no URL segment)
  - `layout.tsx` — shell with `<Sidebar />` + `<Header />` wrapping `<main>`
  - `dashboard/page.tsx` — KPI cards + 4 charts + recent activity (COMPLETE)
  - `calls/page.tsx`, `calls/live/page.tsx`, `agent/page.tsx`, `knowledge/page.tsx`, `tools/page.tsx`, `analytics/page.tsx`, `escalations/page.tsx`, `users/page.tsx`, `tenants/page.tsx` — all use `<PagePlaceholder />` for now
- `hero-preview/page.tsx` — preview of the unused shape-landing-hero (kept as reference)
- `paths-preview/page.tsx` — preview of the unused BackgroundPaths (kept as reference)

### `src/components/`
- `logo.tsx` — Callen.ai mark (black rounded square + white "C" + 3 voice dots)
- `providers.tsx` — ThemeProvider, TooltipProvider, Toaster wrappers
- `sidebar.tsx` — left nav, white surface, black active state, black Pro plan card at bottom
- `header.tsx` — top bar with tenant switcher, search, notifications bell, user menu
- `tenant-switcher.tsx` — dropdown to swap tenants (3 demo tenants in mock data)
- `user-menu.tsx` — top-right avatar dropdown with profile/settings/sign-out
- `waveform.tsx` — animated audio waveform (used in PhoneMockup + live demo)
- `count-up.tsx` — animates number from 0 to target when in viewport
- `logo-marquee.tsx` — infinite-scrolling integration partner names (CSS animation)
- `live-transcript-demo.tsx` — cycling chat-bubble call demo (used in hero)
- `page-placeholder.tsx` — consistent header + dashed card for unbuilt pages

### `src/components/ui/` (shadcn primitives)
button, card, input, label, dialog, tabs, separator, badge, dropdown-menu, avatar, table, sheet, tooltip, select, switch, textarea, sonner, skeleton, scroll-area, accordion, **shape-landing-hero.tsx** (kokonut, unused), **background-paths.tsx** (unused)

### `src/components/mockups/` (the 8 product mockups)
- `agent-studio-mockup.tsx` — **7 interactive tabs** (Agent, Workflow, Knowledge, Tools, Evaluation, Widget, Settings), each with distinct content + AnimatePresence transitions
- `unified-feed-mockup.tsx` — **live inbox feed** showing voice/WhatsApp/web/mobile conversations streaming in every 3s
- `phone-mockup.tsx` — iPhone frame with live caller rotation, ticking timer, streaming typewriter transcript
- `calendar-mockup.tsx` — weekly booking grid, new slots get booked live every 2.4s with toast notification
- `order-receipt-mockup.tsx` — receipt paper with line items typing in, cycles through 3 different orders
- `patient-card-mockup.tsx` — medical record card cycling through 3 patients, heart icon pulses at each patient's HR
- `multi-channel-mockup.tsx` — hub-and-spoke (UNUSED — replaced by UnifiedFeed but kept in repo)
- `chat-interface-mockup.tsx` — earlier chat UI (UNUSED — kept in repo)

### `src/components/dashboard/`
- `kpi-card.tsx` — monochrome KPI card with delta chips
- `call-volume-chart.tsx` — 24-hour bar chart (monochrome black bars)
- `language-pie.tsx` — Urdu/English donut (black + mid-gray)
- `intent-breakdown.tsx` — horizontal bars (black on neutral-100)
- `recent-activity.tsx` — recent calls feed with monochrome outcome icons

### `src/lib/`
- `mock-data.ts` — 3 tenants, 1 user, 2 agent configs, 50 generated calls, sample transcript, 3 tools, 4 KB docs, dashboard KPIs
- `mock-api.ts` — async wrapper around mock data (Promise + setTimeout to simulate latency)
- `store.ts` — Zustand global store (current tenant + user). Includes `useHasHydrated()` hook for SSR safety
- `utils.ts` — `cn()` Tailwind class merger (from shadcn)

---

## 7) 7-day sprint plan: where we are

| Day | Goal | Status |
|---|---|---|
| **1** | Scaffold project + login + app shell + mock data | ✅ COMPLETE |
| **2** | Dashboard home with KPI cards + charts + activity feed | ✅ COMPLETE |
| **2.5** | (Extra) Apply ElevenLabs aesthetic, build landing page, monochrome theme, 8 product mockups, interactive Agent Studio tabs, sign-up page, propagate theme across all pages | ✅ COMPLETE (massive scope expansion) |
| **3** | **Live Call Console (THE WOW PAGE)** | ⏭️ **NEXT UP** |
| **4** | Agent Studio (functional, not just mockup) | Pending |
| **5** | Knowledge Base + Tool Registry | Pending |
| **6** | Call History + Call Detail + Analytics | Pending |
| **7** | Escalations + Users + Tenants + final polish | Pending |

---

## 8) What Day 3 (Live Call Console) needs

This is the **demo hero** of the dashboard. When my supervisor sees this in viva, they need to think "this is industry-grade".

**Route:** `/calls/live`
**Currently:** Placeholder using `PagePlaceholder` component

**What to build:**
1. **Active calls list** (left rail) — shows 2-3 calls currently in progress with green pulse + caller number + duration. Click any call to focus.
2. **Live Transcript stream** (centre) — selected call's transcript appears word-by-word as it would in real life. Caller bubbles right-aligned (dark), agent bubbles left-aligned (light). Auto-scroll to newest.
3. **Intent timeline** (right top) — chronological list of detected intents during this call with confidence scores.
4. **Tool execution log** (right middle) — each MCP function call the agent has made (createOrder, lookupOrder, etc.) with arguments + result + duration_ms.
5. **Waveform tracker** (top of centre) — real-time-feeling audio level visualization showing caller speaking vs agent speaking.
6. **Listen In button** — admin can "tap" the audio without revealing presence (mock button, no actual audio).
7. **Sentiment graph** (right bottom) — sentiment over time as a sparkline.

**Mock data needed:** Simulate a realistic call playing out over ~45 seconds with multiple turns, intent detections, and one tool call. The page should auto-loop so a viewer never sees it "end".

**Estimated time:** 3-4 hours focused work.

---

## 9) Other 7-day plans (briefer)

### Day 4: Agent Studio (`/agent`)
Replace placeholder with functional editor:
- System prompt textarea
- Voice selector with audio preview (mock)
- Language toggle chips (Urdu / English / Punjabi / Sindhi / Pashto)
- Business hours grid (7 days × 24 hours)
- Try-It panel — fake browser-mic input + agent response preview

### Day 5: Knowledge Base + Tool Registry
- `/knowledge`: upload zone, ingested sources list with chunk counts + status, chunk preview drawer
- `/tools`: card grid of MCP-registered tools, Add Tool modal with JSON schema editor

### Day 6: Call History + Detail + Analytics
- `/calls`: TanStack Table with filters (date, language, intent, outcome), paginated
- Click row → Call Detail page with full transcript, sentiment graph, tool log, audio player, Export PDF button
- `/analytics`: 6-card grid (volume timeseries, language pie, intent bar, resolution funnel, escalation rate, top callers)

### Day 7: Settings pages + final polish
- `/escalations`: if-then rule cards
- `/users`: per-tenant user list, Add User modal, CSV bulk-invite
- `/tenants`: super-admin tenants table
- Cross-page polish, dark mode toggle (optional), micro-animations

---

## 10) Memory files (persist across Claude sessions)

These files live at `C:\Users\talha\.claude\projects\C--\memory\`:
- `MEMORY.md` — index pointing to other memory files
- `user_profile.md` — about me (Talha, AIR Uni, SE student, ambitions)
- `project_voice_agent.md` — the SDS-locked architecture
- `project_voice_agent_build.md` — the active build phase context

A new Claude chat should automatically read MEMORY.md and follow the links.

---

## 11) How to resume in a new chat

**Paste this entire HANDOFF.md** as the first message in a fresh Claude chat, then add a brief instruction:

> "Read the handoff doc above. The dev server is running at http://localhost:3000. Let's start Day 3: Live Call Console."

Or whatever you want to work on next. Claude will read this doc plus the memory files and have full context.

**Verify the dev server is still running** (or restart with `cd C:\Users\talha\voice-agent-dashboard && npm run dev`). If you closed your laptop and reopened, you may need to restart it.

---

## 12) Git status

**Branch:** `main`
**Last commit:** `2a66664` — feat: extend landing aesthetic across the entire app
**Total commits on the dashboard build:** ~13
**Commits are atomic and well-described** — useful for cherry-picking or reverting if needed.

**Remote:** Not pushed anywhere yet. When ready, push to GitHub:
```bash
gh repo create callen-ai --private --source=. --remote=origin --push
```

---

## 13) Honest assessment / open risks

- **Solo + ambitious scope** — building this MVP entirely in 7 days is doable with AI help but requires 10–20 focused hours per week.
- **What's MVP not production:** This is "looks like SaaS" not "competes with Vapi/Retell at scale". For viva and portfolio purposes, MVP is enough.
- **Backend not started yet** — currently all mock data. Real Twilio + Whisper + LLM integration is post-exams work.
- **No automated tests** — moving fast; consider adding Vitest + Playwright in week 2 if there's time.

---

## 14) Things I appreciate (working style)

- Tight, scannable responses (markdown tables, code blocks, bold for key items)
- Tool calls batched into single messages when possible
- Honest "I don't know" or "this could be better" callouts over false confidence
- Commits at each milestone with detailed messages
- Visual screenshots after big changes to verify
- A bias toward shipping over perfecting
- **No em-dashes** (`—`) anywhere in user-visible content

---

**End of handoff. Ready to continue from Day 3.**
