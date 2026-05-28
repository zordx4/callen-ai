// /forgot-password — sends a Supabase password-reset email.

import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { ForgotPasswordForm } from "./forgot-password-form";

export const metadata = { title: "Reset password" };

export default async function ForgotPasswordPage() {
  // Already signed in? Send them to the dashboard. Resetting password
  // while authenticated should happen from /settings, not here.
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (user) redirect("/dashboard");

  return <ForgotPasswordForm />;
}
