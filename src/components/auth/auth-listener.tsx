// AuthListener — single subscriber to supabase.auth.onAuthStateChange.
// Keeps useAppStore.user in sync with the real Supabase session so the
// rest of the app can keep reading useAppStore.user the way it did
// before. Mounted once inside Providers.

"use client";

import { useEffect } from "react";
import { createClient } from "@/lib/supabase/client";
import { supabaseUserToAppUser } from "@/lib/auth-store";
import { useAppStore } from "@/lib/store";

export function AuthListener() {
  const setUser = useAppStore((s) => s.setUser);

  useEffect(() => {
    const supabase = createClient();

    // Seed on mount so a hard refresh doesn't flash an unauth state.
    supabase.auth.getUser().then(({ data: { user } }) => {
      setUser(user ? supabaseUserToAppUser(user) : null);
    });

    const { data: sub } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ? supabaseUserToAppUser(session.user) : null);
    });

    return () => sub.subscription.unsubscribe();
  }, [setUser]);

  return null;
}
