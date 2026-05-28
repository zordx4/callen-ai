// Thin adapter over Supabase Auth. Pages call these functions and get
// back a structured AuthResult so they can render inline errors without
// having to know about Supabase response shapes.
//
// Business data (name, business) is stashed in supabase auth user
// metadata until we introduce a proper profiles table. The mapping to
// our local User shape lives in supabaseUserToAppUser().

import { createClient } from "./supabase/client";
import { tenants, type User } from "./mock-data";
import type { User as SupabaseUser } from "@supabase/supabase-js";

export type AuthResult =
  | { ok: true }
  | { ok: false; error: string };

type SignUpInput = {
  name: string;
  business: string;
  email: string;
  password: string;
};

function getOrigin() {
  if (typeof window === "undefined") return "";
  return window.location.origin;
}

// Map a Supabase auth user to our app User type. tenantId + role are
// hard-coded for now — real multi-tenant workspace creation lands when
// the backend goes beyond mock data.
export function supabaseUserToAppUser(u: SupabaseUser): User {
  const meta = (u.user_metadata ?? {}) as { name?: string; business?: string };
  return {
    id: u.id,
    email: u.email ?? "",
    name: meta.name?.trim() || (u.email ?? "").split("@")[0],
    tenantId: tenants[0].id,
    role: "admin",
  };
}

function friendlyError(message: string): string {
  // Translate a few Supabase error messages into more user-friendly copy.
  const m = message.toLowerCase();
  if (m.includes("invalid login credentials"))
    return "Wrong email or password. Try again.";
  if (m.includes("email not confirmed"))
    return "Please verify your email first. Check your inbox for the confirmation link.";
  if (m.includes("user already registered"))
    return "An account with this email already exists. Try signing in instead.";
  if (m.includes("password should be at least"))
    return "Password must be at least 8 characters.";
  if (m.includes("unable to validate email address"))
    return "That doesn't look like a valid email address.";
  if (m.includes("over_email_send_rate_limit") || m.includes("rate limit"))
    return "Too many attempts. Please wait a minute and try again.";
  return message;
}

export async function signIn(
  email: string,
  password: string
): Promise<AuthResult> {
  const supabase = createClient();
  const { error } = await supabase.auth.signInWithPassword({
    email: email.trim(),
    password,
  });
  if (error) return { ok: false, error: friendlyError(error.message) };
  return { ok: true };
}

export async function signUp(input: SignUpInput): Promise<AuthResult> {
  const name = input.name.trim();
  const business = input.business.trim();
  const email = input.email.trim().toLowerCase();

  if (!name) return { ok: false, error: "Please enter your name." };
  if (!business) return { ok: false, error: "Please enter your business name." };
  if (!email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/))
    return { ok: false, error: "That doesn't look like a valid email address." };
  if (input.password.length < 8)
    return { ok: false, error: "Password must be at least 8 characters." };

  const supabase = createClient();
  const { error } = await supabase.auth.signUp({
    email,
    password: input.password,
    options: {
      data: { name, business },
      emailRedirectTo: `${getOrigin()}/auth/callback?next=/dashboard`,
    },
  });
  if (error) return { ok: false, error: friendlyError(error.message) };
  return { ok: true };
}

export async function signOut(): Promise<AuthResult> {
  const supabase = createClient();
  const { error } = await supabase.auth.signOut();
  if (error) return { ok: false, error: friendlyError(error.message) };
  return { ok: true };
}

export async function requestPasswordReset(email: string): Promise<AuthResult> {
  const trimmed = email.trim().toLowerCase();
  if (!trimmed.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/))
    return { ok: false, error: "That doesn't look like a valid email address." };

  const supabase = createClient();
  const { error } = await supabase.auth.resetPasswordForEmail(trimmed, {
    redirectTo: `${getOrigin()}/auth/callback?next=/reset-password`,
  });
  if (error) return { ok: false, error: friendlyError(error.message) };
  return { ok: true };
}

export async function updatePassword(password: string): Promise<AuthResult> {
  if (password.length < 8)
    return { ok: false, error: "Password must be at least 8 characters." };

  const supabase = createClient();
  const { error } = await supabase.auth.updateUser({ password });
  if (error) return { ok: false, error: friendlyError(error.message) };
  return { ok: true };
}
