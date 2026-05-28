// AuthGuard — client-side gate that wraps every route under /(app).
//
// On hydrate: if no user in the persisted session store, redirect to
// /login with a ?next= param pointing at the requested path, so the user
// lands back where they wanted after signing in.
//
// We deliberately render the dashboard children during the pre-hydration
// window so server output and initial client output match (no hydration
// warning). Once hydration confirms there's no user, we swap to a
// branded placeholder and trigger the redirect.

"use client";

import { useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import { useAppStore, useHasHydrated } from "@/lib/store";
import { Logo } from "@/components/logo";

export function AuthGuard({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const hydrated = useHasHydrated();
  const user = useAppStore((s) => s.user);

  useEffect(() => {
    if (hydrated && !user) {
      const next = encodeURIComponent(pathname || "/dashboard");
      router.replace(`/login?next=${next}`);
    }
  }, [hydrated, user, router, pathname]);

  if (hydrated && !user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="flex flex-col items-center gap-5">
          <Logo />
          <div className="flex items-center gap-1.5">
            <span className="size-1.5 rounded-full bg-neutral-400 animate-pulse [animation-delay:-0.3s]" />
            <span className="size-1.5 rounded-full bg-neutral-400 animate-pulse [animation-delay:-0.15s]" />
            <span className="size-1.5 rounded-full bg-neutral-400 animate-pulse" />
          </div>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
