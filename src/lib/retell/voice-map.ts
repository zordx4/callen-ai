// Maps Callen's voice catalog slugs to Retell voice ids (English, US).
//
// The catalog (voice-library.ts) ships 13 ElevenLabs voices whose preview
// clips are the real ElevenLabs samples. Those exact voices are NOT in
// Retell's default catalog, so each slug maps here to the closest real
// Retell voice for actual calls. This is the single place to swap to the
// imported ElevenLabs voice ids once they are added to Retell
// (bring-your-own ElevenLabs key) — change the right-hand side only.

const VOICE_MAP: Record<string, string> = {
  // Female catalog voice -> closest Retell voice
  eryn: "cartesia-Grace",     // friendly customer-service female
  lana: "cartesia-Kate",      // warm, calm
  natalee: "cartesia-Marissa",// bright receptionist
  diana: "cartesia-Sloane",   // polished concierge
  bella: "cartesia-Hailey",   // expressive young
  // Male catalog voice -> closest Retell voice
  adam: "cartesia-Brian",     // bright, energetic young
  jack: "cartesia-Andrew",    // upbeat, persuasive
  stokes: "cartesia-Nico",    // relaxed, steady
  dan: "11labs-Adrian",       // energetic, charismatic
  chris: "cartesia-Michael",  // grounded, guiding
  george: "cartesia-Nico",    // casual, neutral
  dustin: "cartesia-Lucas",   // smooth, dependable
  kirk: "11labs-Nico",        // deep, broadcast
};

export const DEFAULT_RETELL_VOICE = "cartesia-Grace";

const RETELL_PROVIDER_PREFIX = /^(11labs|openai|play|deepgram|cartesia|retell|minimax|fish_audio|qwen3)-/i;

export function toRetellVoiceId(callenVoiceId: string | null | undefined): string {
  if (!callenVoiceId) return DEFAULT_RETELL_VOICE;
  // Raw Retell ids (already provider-prefixed) pass through untouched.
  if (RETELL_PROVIDER_PREFIX.test(callenVoiceId)) {
    return callenVoiceId;
  }
  return VOICE_MAP[callenVoiceId] ?? DEFAULT_RETELL_VOICE;
}
