// Service-role Supabase client. Bypasses RLS — server-side only, used by
// webhook ingestion and provisioning paths that write tables users can
// only read (calls, call_turns, phone_numbers, usage_events,
// webhook_events). NEVER import this from client components.

import "server-only";
import { createClient } from "@supabase/supabase-js";

export function createAdminClient() {
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!key) {
    throw new Error(
      "SUPABASE_SERVICE_ROLE_KEY is not set. Copy it from the Supabase dashboard (Project Settings -> API keys) into .env.local."
    );
  }
  return createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, key, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
}
