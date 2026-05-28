// Next.js 16 Proxy (formerly Middleware). Runs on every request per
// the matcher below to keep Supabase auth cookies fresh. Route
// protection itself happens in (app)/layout.tsx via
// supabase.auth.getUser() + redirect().

import { type NextRequest } from "next/server";
import { updateSession } from "@/lib/supabase/middleware";

export async function proxy(request: NextRequest) {
  return await updateSession(request);
}

export const config = {
  matcher: [
    // Skip Next internals and static assets. Auth-relevant pages and
    // API routes pass through so cookies stay current.
    "/((?!_next/static|_next/image|favicon.ico|icon.svg|.*\\.(?:svg|png|jpg|jpeg|gif|webp|mp3|mp4)$).*)",
  ],
};
