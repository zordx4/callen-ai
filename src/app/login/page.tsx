// /login — server-side auth check, then renders the client form.
// If the user already has a valid Supabase session, redirect them
// straight to /dashboard (or whatever ?next= points at) without ever
// rendering the form.

import { Suspense } from "react";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { LoginForm } from "./login-form";

export const metadata = { title: "Sign in" };

type SearchParams = Promise<{ next?: string }>;

export default async function LoginPage({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (user) {
    const params = await searchParams;
    redirect(params.next ?? "/dashboard");
  }

  return (
    <Suspense fallback={null}>
      <LoginForm />
    </Suspense>
  );
}
