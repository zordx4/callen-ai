// /reset-password — landing page from the password-reset email.
//
// The auth callback route (/auth/callback) exchanges the email's ?code=
// for a session before redirecting here, so by the time this renders
// the user has a valid session and can call supabase.auth.updateUser.
// If they hit this page without a session, send them back to /forgot-password.

import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { ResetPasswordForm } from "./reset-password-form";

export const metadata = { title: "Set new password" };

export default async function ResetPasswordPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/forgot-password");

  return <ResetPasswordForm />;
}
