// Supabase server client. Use this from Server Components, Route
// Handlers, and Server Actions. Reads/writes auth cookies via the
// next/headers cookies() API.
//
// The setAll() try/catch swallows the error that fires when this is
// invoked from a Server Component (where cookies are read-only) — the
// middleware (src/middleware.ts) is responsible for refreshing them in
// that case.

import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";

export async function createClient() {
  const cookieStore = await cookies();

  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options)
            );
          } catch {
            // Server Component context — middleware refreshes instead.
          }
        },
      },
    }
  );
}
