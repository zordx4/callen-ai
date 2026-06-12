// Singleton Retell SDK client. Everything that talks to Retell goes
// through this module so the runtime stays swappable (the rest of the
// app only knows about our own API routes and DB rows).

import "server-only";
import Retell from "retell-sdk";

let cached: Retell | null = null;

export function isRetellConfigured(): boolean {
  return Boolean(process.env.RETELL_API_KEY);
}

export function retell(): Retell {
  const apiKey = process.env.RETELL_API_KEY;
  if (!apiKey) {
    throw new Error("RETELL_API_KEY is not set. Add it to .env.local.");
  }
  if (!cached) {
    cached = new Retell({ apiKey });
  }
  return cached;
}
