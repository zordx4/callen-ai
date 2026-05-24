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
- I prefer not to use em-dashes anywhere in user-visible content (periods, colons, or `·` middots)

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

7-day UI sprint (started 2026-05-23). Backend follows after semester papers.

**Project root:** `C:\Users\talha\voice-agent-dashboard\`
**Brand name:** **Callen.ai** (locked, after iterating through Sawti / Telix / Voxon)
**Primary demo tenant:** **Cheezious** (popular Pakistani pizza and burger chain; rebranded from Johnny & Jugnu)
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
| **Mock tenant** | "Cheezious" (real Pakistani brand). Landing surfaces a mix: Domino's, KFC, Pizza Hut, Hardee's, Howdy, OPTP |

**Locked voice & language style:**
- Headlines use italic accent on emphasis words. Examples currently live: *"Your callers deserve more than menus."*, *"Listens like a human. Acts like an expert."*, *"Procurement-proof from day one."*
- Body copy is service-focused with concrete metrics
- Bilingual Urdu+English transcripts mixed throughout for authenticity
- **Agent voice convention** (locked): respectful and structured. Greet warmly ("assalam alaikum", "khush amdeed"), confirm each item back, suggest one deal (never push), verify address, restate full order with total, payment, and ETA before closing. Polite forms throughout (ji, shukria, bilkul, bohat acha). Under 25 words per agent turn.

---

## 5) Locked tech stack (verified working)

| Layer | Library | Version | Notes |
|---|---|---|---|
| Framework | Next.js | 16.2.6 | **THIS IS NOT THE NEXT.JS YOU KNOW.** Read `node_modules/next/dist/docs/` before writing code. `AGENTS.md` at repo root reminds you of this. |
| React | React | 19.2.4 | Server Components by default. Use `"use client"` for interactive components. |
| Styling | Tailwind CSS | v4 | v4 syntax differs from v3 in spots. |
| Components | shadcn | v4 | **Uses `@base-ui/react`, NOT radix-ui.** The `asChild` pattern doesn't work the same. Triggers ARE buttons themselves. Style the trigger directly via className. |
| Animation | **motion** | 12.40.0 | The rebranded framer-motion. **Import from `"motion/react"`, NEVER `"framer-motion"`**. Same API. |
| Charts | Recharts | 3.8 | Used for dashboard charts. Always pass `minWidth={1}` (and `minHeight={1}` for percentage-height containers) to `ResponsiveContainer` to silence the `width(-1) height(-1)` warning. Gradient URL fills sometimes fail in donut charts: use solid colors. |
| Tables | @tanstack/react-table | 8.21 | Available for Day 6 Call History. |
| State | Zustand | 5.0 | With `persist({ skipHydration: true })` + `useHasHydrated()` gate. |
| Icons | lucide-react | 1.16 | |
| Dates | date-fns | 4.3 | |
| Toasts | sonner | 2.0 | `import { toast } from "sonner"`. Wired into the dashboard for "View saved" confirmations. |

**Critical gotchas already learned the hard way:**

1. **shadcn v4 button uses `@base-ui/react/button`.** Wrapping a Button in DropdownMenuTrigger via asChild produces nested `<button>` and hydration errors. Style the DropdownMenuTrigger directly with className (see `src/components/tenant-switcher.tsx` and `src/app/(app)/dashboard/page.tsx` `FilterDropdown` for the canonical pattern).

2. **Zustand `persist` causes hydration mismatch** unless you set `skipHydration: true` and gate persisted-state reads behind a `useHasHydrated()` hook. Pattern lives in `src/lib/store.ts`.

3. **`AGENTS.md` at the repo root** says: "This is NOT the Next.js you know. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code."

4. **PowerShell tool calls don't pick up newly-installed PATH** unless refreshed inline:
   `$env:Path = [System.Environment]::GetEnvironmentVariable("Path","Machine") + ";" + [System.Environment]::GetEnvironmentVariable("Path","User")`

5. **Headless Edge screenshots can't capture motion library animations.** Trust the code, verify in real Chrome/Edge. `Claude in Chrome` MCP extension is not currently installed.

6. **MCP servers installed:**
   - `magic` (21st.dev) — generates UI components via natural language. API key in `~/.claude.json`.

7. **Skills installed at `~/.claude/skills/`:**
   - `ui-ux-pro-max` — searchable design intelligence
   - `awesome-design-md` — 71 brand DESIGN.md files (Vercel, Stripe, Linear, Domino's, etc.) for cloning a specific brand's look

8. **Local artifact `dev.run.log`** lives in the project root from `npm run dev > dev.run.log 2>&1 &`. It's untracked. Either delete it or add to `.gitignore` when convenient. Not currently in `.gitignore`.

---

## 6) Everything we've built (file inventory)

### `src/app/`
- `layout.tsx` — root layout, Geist font + Providers wrapper
- `globals.css` — Tailwind v4 + monochrome design tokens. Cream variable now resolves to pure white (legacy alias). Marquee keyframes (unused since the logo marquee was removed) + card-lift utility + `.no-scrollbar` utility for the dashboard tab strip.
- `page.tsx` — **MARKETING LANDING** (the showpiece). Mirrors elevenlabs.io/agents structure. Pure white minimalism, bold display headlines with italic accent. Sections (in order): nav, hero, stat band, customer logos, IVR-vs-Callen comparison, **TextReveal manifesto** (scroll-triggered word fade), workflow + Agent Studio mockup, multichannel + Unified Feed mockup, "Build in 5 min" 3-step, use cases, feature cards, three highlights (dark), interactive integrations grid, enterprise security, pricing, **testimonials**, FAQ, final CTA, footer.
- `login/page.tsx`, `signup/page.tsx` — split layouts
- `(app)/` — route group containing the dashboard
  - `layout.tsx` — shell with Sidebar + Header
  - `dashboard/page.tsx` — **ElevenLabs-style operations home** (see Section 8)
  - `analytics/page.tsx` — **deep call analytics** (formerly the dashboard contents: 4 KPI cards + 4 charts + recent activity)
  - `calls/page.tsx`, `calls/live/page.tsx`, `agent/page.tsx`, `knowledge/page.tsx`, `tools/page.tsx`, `escalations/page.tsx`, `users/page.tsx`, `tenants/page.tsx`, `integrations/page.tsx`, `outbound/page.tsx`, `phone-numbers/page.tsx`, `settings/page.tsx`, `voices/page.tsx`, `whatsapp/page.tsx`
- `hero-preview/page.tsx`, `paths-preview/page.tsx` — kept as reference for unused hero variations

### `src/components/`
- `logo.tsx`, `providers.tsx`, `sidebar.tsx`, `header.tsx`, `tenant-switcher.tsx`, `user-menu.tsx`, `waveform.tsx`, `count-up.tsx`, `live-transcript-demo.tsx`, `page-placeholder.tsx`
- **`testimonials-section.tsx`** — landing testimonials with 9 Pakistani SMB voices, monochrome ui-avatars
- **`integrations-grid.tsx`** — single consolidated integrations grid (12 cards with icons + categories) with mouse-follow spotlight, staggered scroll-in, hover lift, status dot. Replaces the old marquee + static grid duplication.

### `src/components/ui/` (shadcn primitives + custom)
button, card, input, label, dialog, tabs, separator, badge, dropdown-menu, avatar, table, sheet, tooltip, select, switch, textarea, sonner, skeleton, scroll-area, accordion, **shape-landing-hero.tsx** (kokonut, unused), **background-paths.tsx** (unused), **testimonials-columns-1.tsx** (motion infinite-scroll primitive), **text-reveal.tsx** (scroll-triggered word-by-word fade, motion/react not framer-motion)

### `src/components/mockups/` (the 8 product mockups)
- `agent-studio-mockup.tsx` — 7 interactive tabs
- `unified-feed-mockup.tsx` — live inbox feed
- `phone-mockup.tsx`, `calendar-mockup.tsx`, `order-receipt-mockup.tsx`, `patient-card-mockup.tsx` — varied use cases
- `multi-channel-mockup.tsx`, `chat-interface-mockup.tsx` — UNUSED but kept

### `src/components/dashboard/`
- Legacy widgets used by `/analytics`: `dashboard-hero.tsx`, `kpi-card.tsx`, `call-volume-chart.tsx`, `language-pie.tsx`, `intent-breakdown.tsx`, `recent-activity.tsx`
- **`home/kpi-chart-card.tsx`** — 6 clickable KPI tabs that drive a single linked area chart. Reacts to (tab, range, granularity, agent) props.
- **`home/secondary-card.tsx`** — sparkline KPI tile, clickable, agent-aware.

### `src/components/agent/`
- `preview-call.tsx`, `workflow-graph.tsx` — used by the Agent Studio page

### `src/lib/`
- `mock-data.ts` — 3 tenants (Cheezious is t1), 1 user, 2 agent configs, 50 generated calls, sample transcript, 3 tools, 4 KB docs, dashboard KPIs. **Agent system prompts** encode the locked respectful-structured voice.
- `mock-api.ts` — async wrapper around mock data
- `store.ts` — Zustand global store (current tenant + user). Includes `useHasHydrated()` hook
- `utils.ts` — `cn()` Tailwind class merger
- `agent-templates.ts` — Cheezious Order Agent template + system prompt
- **`dashboard-home-data.ts`** — typed KPI definitions per tab (General, Evaluation, Data Collection, Audio, Tools, LLMs, Knowledge Base; Advanced is a settings panel), filter types (Range, Granularity, AgentId), and deterministic hash-seeded series generators

---

## 7) Sprint progress

| Day | Goal | Status |
|---|---|---|
| **1** | Scaffold + login + app shell + mock data | ✅ SHIPPED (`39b9c03`) |
| **2** | Dashboard home with KPI cards + charts + activity | ✅ SHIPPED (`8ee5f0e`) — later moved to `/analytics` |
| **2.5** | ElevenLabs aesthetic, landing rebuild, monochrome theme, 8 product mockups, signup, theme propagation | ✅ SHIPPED |
| **3** | Live Call Console (`/calls/live`) | ✅ SHIPPED (`3c8e967`) |
| **4** | Agent Studio (`/agent`) | ✅ SHIPPED (`c7e8d0a`) |
| **Refresh** | Sidebar workspace switcher + grouped sections, dashboard hero banner + sparkline KPIs, Johnny & Jugnu rebrand | ✅ SHIPPED (`ce9419e`, `599e8e5`, `296c496`) |
| **Landing polish** | Testimonials section, Cheezious brand rebrand + big PK brand mix, refined agent voice, hooky H2s, scroll-reveal manifesto | ✅ SHIPPED (`45c07c0`) |
| **Integrations** | Consolidated marquee + grid into single interactive integrations grid (12 cards, spotlight, hover effects) | ✅ SHIPPED (`9a1d344`) |
| **Dashboard rebuild** | ElevenLabs-style home with Callen-relevant KPIs per tab, working filters, live active-calls pill. Old dashboard contents moved to `/analytics`. | ✅ SHIPPED (`c0c0dda`) |
| **5** | Knowledge Base (`/knowledge`) + Tool Registry (`/tools`) | ⏭️ **NEXT** |
| **6** | Call History (`/calls`) + Call Detail + Analytics polish | Pending |
| **7** | Escalations + Users + Tenants + final polish | Pending |

---

## 8) Dashboard home — current shape

`/dashboard` (rebuilt 2026-05-24 in `c0c0dda`) is the ElevenLabs-style operations home. `/analytics` holds the deep-metrics layout (the old dashboard).

**Layout:**
- **Top row:** Active-calls pill (links to `/calls/live`, count live-drifts every 4.2s for the live feel) + Deep-analytics link (to `/analytics`)
- **Greeting:** `[tenant] workspace` label + time-based "Good morning/afternoon/evening, [name]" (parses "Muhammad Talha Dilshad" → "Talha")
- **Tab nav (8 tabs):** General, Evaluation, Data Collection, Audio, Tools, LLMs, Knowledge Base, Advanced — animated spring underline
- **Filter pill bar:** Create view (toast), Date range (24h/7d/30d/90d), Granularity (Hour/Day/Week, auto-constrained per range), Agent (All/Cheezious/Lahore Smile)
- **Main panel per tab:** 6-KPI strip + linked area chart (Recharts) + two sparkline cards below (Success rate, CSAT — both clickable to `/analytics`)
- **Advanced tab:** settings panel with 4 tiles (Escalation rules, Compliance & PII, Webhooks, API keys) linking to `/settings`

**KPI sets per tab** (defined in `src/lib/dashboard-home-data.ts`):
- General: Calls answered, Avg first-token latency, Resolution rate, Avg handling time, Urdu share, Tool invocations
- Evaluation: Success rate, CSAT, FCR, Escalation rate, Sentiment, Transfer rate
- Data Collection: Variables captured, Field-fill rate, Validation pass, PII redactions, Schema drift, Completion rate
- Audio: STT latency, TTS latency, WER, Barge-in rate, Audio dropoff, MOS quality
- Tools: Invocations, Success rate, Tool latency, createOrder share, Error rate, MCP servers active
- LLMs: Prompt tokens, Completion tokens, Per-call tokens, Cost/call, Cache hit, Total LLM spend
- Knowledge Base: Queries, Hit rate, Avg chunks, Top doc share, Missing-answer rate, Doc age

**Data semantics:**
- Total-type KPIs scale with range × agent multiplier (Cheezious ≈ 72%, Lahore Smile ≈ 28%)
- Average/rate-type KPIs stay steady with small per-bucket noise
- All randomness is deterministic (hash-seeded by key + filter combo) so same combo always renders the same chart

---

## 9) Day 5 (next up) — Knowledge Base + Tool Registry

**Route 1: `/knowledge`** — replace placeholder with:
- Upload zone (drag-and-drop, multi-file)
- Ingested sources list: name, source type (pdf/txt/url), chunk count, indexed/pending status, upload date, size
- Click a source → drawer with chunk preview (the first N chunks as cards with text)
- Filter by status (indexed/pending/failed)
- Mock data already exists at `kbDocuments` in `mock-data.ts` (4 docs for Cheezious tenant)

**Route 2: `/tools`** — replace placeholder with:
- Card grid of MCP-registered tools (use `tools` from `mock-data.ts`)
- Per-card: name, description, endpoint, invocations-last-30d, success rate
- "Add Tool" modal with JSON schema editor
- Click a tool → drawer with full schema + recent invocation samples

Both should follow the locked design system. Both are mostly visual + mock-data interactivity (no backend).

**Estimated time:** 4 to 6 hours focused.

---

## 10) Other 7-day plans (briefer)

### Day 6: Call History + Detail + Analytics polish
- `/calls`: TanStack Table with filters (date, language, intent, outcome), paginated
- Click row → Call Detail page with full transcript, sentiment graph, tool log, audio player, Export PDF button
- Polish `/analytics`: it currently has the moved-from-dashboard layout (4 KPIs + 4 charts + activity). Could add resolution funnel, escalation rate over time, top callers leaderboard.

### Day 7: Settings pages + final polish
- `/escalations`: if-then rule cards
- `/users`: per-tenant user list, Add User modal, CSV bulk-invite
- `/tenants`: super-admin tenants table
- Cross-page polish, micro-animations
- Optional: add `.gitignore` entry for `dev.run.log`

---

## 11) Memory files (persist across Claude sessions)

These files live at `C:\Users\talha\.claude\projects\C--\memory\`:
- `MEMORY.md` — index pointing to other memory files
- `user_profile.md` — about me (Talha, AIR Uni, SE student, ambitions)
- `project_voice_agent.md` — the SDS-locked architecture
- `project_voice_agent_build.md` — the active build phase context (kept in sync with this HANDOFF)

A new Claude chat should automatically read MEMORY.md and follow the links.

---

## 12) How to resume in a new chat

**Paste this entire HANDOFF.md** as the first message in a fresh Claude chat, then add a brief instruction:

> "Read the handoff doc above. The dev server might still be running at http://localhost:3000; if not, restart with `cd C:\Users\talha\voice-agent-dashboard && npm run dev`. Let's start Day 5: Knowledge Base + Tool Registry."

Or whatever you want to work on next. Claude will read this doc plus the memory files and have full context.

**Verify the dev server is still running** (or restart). If you closed your laptop and reopened, you may need to restart it.

---

## 13) Git status

**Branch:** `master`
**Last commit:** `c0c0dda` — feat: production-ready dashboard home with Callen-relevant KPIs
**Total commits on the dashboard build:** ~22
**Commits are atomic and well-described** for easy cherry-picking or reverting.

**Recent commits (newest first):**
- `c0c0dda` feat: production-ready dashboard home with Callen-relevant KPIs
- `9a1d344` feat: consolidate integrations into one interactive grid
- `45c07c0` feat: testimonials + Cheezious rebrand + structured agent + manifesto
- `296c496` feat: restructure sidebar with workspace switcher + grouped sections
- `599e8e5` feat: dashboard visual upgrade with hero banner + sparkline KPIs
- `ce9419e` feat: pannable canvas, layered preview sphere, Johnny & Jugnu rebrand
- `c7e8d0a` feat: agent studio with template library, workflow viz, and preview call
- `3c8e967` feat: build live call console with looping scripted calls
- `e48ef49` docs: add HANDOFF.md for new-chat continuity
- `2a66664` feat: extend landing aesthetic across the entire app

**Remote:** Not pushed anywhere yet. When ready, push to GitHub:
```bash
gh repo create callen-ai --private --source=. --remote=origin --push
```

---

## 14) Honest assessment / open risks

- **Solo + ambitious scope** — building this MVP entirely in 7 days is doable with AI help but requires 10–20 focused hours per week. Sprint is now ~5 days in (with some unscheduled landing-polish + dashboard-rebuild pivots that absorbed Day 5 time).
- **What's MVP not production:** This is "looks like SaaS" not "competes with Vapi/Retell at scale". For viva and portfolio purposes, MVP is enough.
- **Backend not started yet** — all data is mock. Real Twilio + Whisper + LLM integration is post-exams work.
- **No automated tests** — moving fast. Add Vitest + Playwright in week 2 if there's time.
- **`dev.run.log`** is an untracked runtime artifact in repo root. Should go in `.gitignore` eventually.

---

## 15) Things I appreciate (working style)

- Tight, scannable responses (markdown tables, code blocks, bold for key items)
- Tool calls batched into single messages when possible
- Honest "I don't know" or "this could be better" callouts over false confidence
- Commits at each milestone with detailed messages
- A bias toward shipping over perfecting
- **No em-dashes** anywhere in user-visible content

---

**End of handoff. Ready to continue with Day 5: Knowledge Base + Tool Registry.**
