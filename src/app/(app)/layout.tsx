// Dashboard shell — white throughout.
//
// Primary auth gate: server-side getUser() check before any UI renders.
// If Supabase has no session, redirect to /login with a ?next= param so
// the user lands back where they were after signing in.
//
// AuthGuard (client) is the secondary gate: it handles the case where a
// session expires mid-page or the user signs out in another tab, by
// reacting to onAuthStateChange and bouncing them back to /login.

import { redirect } from "next/navigation";
import { headers } from "next/headers";
import { Sidebar } from "@/components/sidebar";
import { Header } from "@/components/header";
import { AuthGuard } from "@/components/auth/auth-guard";
import { createClient } from "@/lib/supabase/server";

export default async function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    // Preserve where they were trying to go. The middleware sets
    // x-pathname so we can read it here.
    const h = await headers();
    const path = h.get("x-pathname") || "/dashboard";
    redirect(`/login?next=${encodeURIComponent(path)}`);
  }

  return (
    <AuthGuard>
      <div className="flex h-screen overflow-hidden bg-neutral-50">
        <Sidebar />
        <div className="flex-1 flex flex-col overflow-hidden">
          <Header />
          <main className="flex-1 overflow-y-auto">
            {children}
          </main>
        </div>
      </div>
    </AuthGuard>
  );
}
