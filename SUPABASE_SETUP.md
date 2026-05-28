# Supabase Auth setup

One-time configuration to make the new auth flow actually work. Total time: ~10 minutes.

## 1. Create a Supabase project

1. Go to https://supabase.com/dashboard and click **New project**.
2. Pick a project name (e.g. `callen-ai-prod`), set a strong database password (save it in 1Password or similar — you may need it for migrations later), and choose the region closest to your users. For Pakistan: **South Asia (Mumbai)** is the closest.
3. Wait ~2 minutes for the project to provision.

## 2. Grab your keys

In the Supabase dashboard:

1. Go to **Project Settings → API**.
2. Copy two values:
   - **Project URL** (e.g. `https://xxxxxxxx.supabase.co`)
   - **`anon` `public` key** (a long JWT starting with `eyJ...`)

The `anon` key is safe to expose in the browser. **Never** put the `service_role` key anywhere client-side.

## 3. Wire local env vars

Create `.env.local` at the project root (it's git-ignored):

```bash
NEXT_PUBLIC_SUPABASE_URL=https://YOUR_PROJECT_REF.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGc...your_anon_key_here
```

Restart the dev server (`Ctrl+C` then `npm run dev`).

## 4. Configure auth in the Supabase dashboard

Go to **Authentication → Providers**, then make sure:

- **Email** provider is **enabled**.
- **Confirm email** is **ON** (this is the production default — users must verify before signing in).
- **Secure email change** is **ON**.
- **Minimum password length** is **8** (matches the form's client validation).

Optional:
- **Leaked password protection** — enable it. Supabase checks new passwords against the haveibeenpwned breach corpus.

## 5. URL configuration

Go to **Authentication → URL Configuration**.

| Field | Local dev | Production |
|---|---|---|
| Site URL | `http://localhost:3000` | `https://callen.ai` (or your domain) |
| Redirect URLs (allow list) | `http://localhost:3000/**` | `https://callen.ai/**` (and your Vercel preview pattern, e.g. `https://*-zordx4.vercel.app/**`) |

The `**` is required — Supabase pattern-matches the full URL including query strings.

If you skip the redirect-URL allow list, Supabase will refuse to send users back to your `/auth/callback` route and confirmation emails will land them on a generic Supabase page instead.

## 6. Email templates (optional but recommended)

Go to **Authentication → Email Templates**.

- **Confirm signup** — replace `{{ .SiteURL }}/auth/confirm?token_hash=...` with `{{ .ConfirmationURL }}` so it uses the OAuth-style PKCE flow our `/auth/callback` route expects. The default template already uses `{{ .ConfirmationURL }}` in newer Supabase projects.
- **Reset password** — same pattern. The link should hit `{{ .ConfirmationURL }}`.
- Customize the subject lines and sender display name. The free SMTP defaults to "Callen.ai" team but you can rebrand fully.

For higher email volume (>~30 emails/hour), wire your own SMTP under **Settings → Auth → SMTP**. Recommended providers: Resend, SendGrid, or AWS SES.

## 7. Production env vars on Vercel

```
Project Settings → Environment Variables
```

Add both keys for Production, Preview, and Development:

- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`

Trigger a redeploy after saving (or push a commit — Vercel auto-redeploys).

## 8. Smoke test

Local (`http://localhost:3000`):

1. Visit `/dashboard` while signed out → bounces to `/login?next=%2Fdashboard`.
2. `/signup` with a real email → see "Check your inbox" state.
3. Click the email link → lands on `/dashboard` (verified + signed in).
4. Sign out from the avatar menu → back to `/login`.
5. Sign in with the same credentials → back on `/dashboard`.
6. `/forgot-password` with that email → "Check your inbox" state.
7. Click the reset email → land on `/reset-password` → set new password → `/dashboard`.

## Troubleshooting

| Symptom | Fix |
|---|---|
| "Email rate limit exceeded" toast on signup | Supabase free tier rate-limits at 3 emails/hour to the same address. Wait or wire your own SMTP. |
| Email link opens to a Supabase page instead of your app | Check the **Redirect URLs** allow list (step 5). The URL must match the `**` pattern. |
| Confirmation email never arrives | Check spam. Then verify the `Confirm email` toggle is ON. Then check the dashboard's **Authentication → Logs** for delivery errors. |
| Build error: "supabaseUrl is required" | `.env.local` not set, or you forgot to restart the dev server after creating it. |
| Sign-in works but user immediately bounces back to /login | The Proxy can't read auth cookies. Make sure `src/proxy.ts` exists (Next 16 renamed `middleware.ts` → `proxy.ts`) and the matcher in it isn't excluding your route. |

## What's NOT included

These are intentional follow-ups, not bugs:

- **Google / GitHub OAuth** — easy to add (a single button + `supabase.auth.signInWithOAuth({ provider })`), but each provider needs its own OAuth credentials configured in both Google Cloud / GitHub and the Supabase dashboard.
- **Multi-tenant workspaces per user** — every new signup currently joins the demo Cheezious workspace as admin. Real workspace creation flow is part of the backend wiring milestone.
- **Profile table** — name + business are stored in Supabase user metadata for now. Migrate to a `profiles` table when you start needing relational queries (e.g. "all admins of workspace X"). **When you add it**: as of April 2026, new public-schema tables are no longer auto-exposed to the Data API. You'll need to (1) enable RLS on the table, (2) write policies that combine `TO authenticated` with an `auth.uid() = user_id` predicate, and (3) `GRANT` access to the `authenticated` role if anon/authenticated need to query it directly. Never trust `user_metadata` for authz — store role/permission claims in `app_metadata` instead.
- **Email change flow** — `supabase.auth.updateUser({ email })` is supported, but there's no UI for it yet. Add to `/settings`.
