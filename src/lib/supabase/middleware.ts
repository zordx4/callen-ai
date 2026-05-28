// Session-refresh helper called from src/middleware.ts on every request.
// Keeps the auth cookie fresh so the user stays signed in across long
// tabs without a manual reload.
//
// IMPORTANT: per Supabase's SSR guide, do not insert any code between
// the client creation and the getUser() call below — doing so risks
// stale-session bugs that are hard to debug.

import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

export async function updateSession(request: NextRequest) {
  // Forward the requested pathname to downstream server code (layouts,
  // pages) via a custom header. The (app)/layout uses this to build the
  // ?next= redirect target when a user without a session hits a deep
  // link.
  const requestHeaders = new Headers(request.headers);
  requestHeaders.set("x-pathname", request.nextUrl.pathname);

  let supabaseResponse = NextResponse.next({
    request: { headers: requestHeaders },
  });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) =>
            request.cookies.set(name, value)
          );
          supabaseResponse = NextResponse.next({
            request: { headers: requestHeaders },
          });
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          );
        },
      },
    }
  );

  await supabase.auth.getUser();

  return supabaseResponse;
}
