// Zustand global store. Holds the current tenant + user across the app.
// Why Zustand: lightweight (vs Redux), no boilerplate. Replace selectively per screen.

import { create } from "zustand";
import { persist } from "zustand/middleware";
import { useEffect, useState } from "react";
import { tenants, currentUser, type Tenant, type User } from "./mock-data";

type AppStore = {
  user: User | null;
  currentTenant: Tenant;
  setUser: (u: User | null) => void;
  setTenant: (t: Tenant) => void;
  logout: () => void;
};

export const useAppStore = create<AppStore>()(
  persist(
    (set) => ({
      user: null,
      currentTenant: tenants[0],
      setUser: (user) => set({ user }),
      setTenant: (currentTenant) => set({ currentTenant }),
      logout: () => set({ user: null }),
    }),
    {
      name: "voice-agent-app",
      // Critical: avoid SSR/CSR mismatch by skipping hydration on the server.
      // Components must call useHasHydrated() before reading persisted state.
      skipHydration: true,
    }
  )
);

// Hook: returns true once the persisted store has finished hydrating on the client.
// Components reading persisted state should render a placeholder while this is false.
export function useHasHydrated() {
  const [hydrated, setHydrated] = useState(false);
  useEffect(() => {
    // Trigger rehydration after mount, then mark hydrated
    useAppStore.persist.rehydrate();
    const unsub = useAppStore.persist.onFinishHydration(() => setHydrated(true));
    // If already hydrated by the time we subscribe, set immediately
    if (useAppStore.persist.hasHydrated()) setHydrated(true);
    return unsub;
  }, []);
  return hydrated;
}

// Helper to seed the user on first load (in dev we auto-login)
export function seedAuthIfNeeded() {
  if (typeof window === "undefined") return;
  const state = useAppStore.getState();
  if (!state.user) state.setUser(currentUser);
}
