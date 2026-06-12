// Maps Callen's voice catalog ids to Retell voice ids (English, US market).
// Curated from GET /list-voices on 2026-06-12 (295 voices, 207 American).
// Cartesia = default tier (cheapest per minute at equal latency);
// ElevenLabs = premium tier upsell. "REC" = Retell-recommended voices.

const VOICE_MAP: Record<string, string> = {
  // Female, middle aged, warm receptionist defaults
  "voice-grace": "cartesia-Grace", // REC
  "voice-marissa": "cartesia-Marissa",
  "voice-kate": "cartesia-Kate",
  "voice-sloane": "cartesia-Sloane",
  // Female, young
  "voice-hailey": "cartesia-Hailey", // REC
  "voice-nia": "cartesia-Nia", // REC
  "voice-chloe": "cartesia-Chloe",
  // Male
  "voice-nico": "cartesia-Nico", // REC
  "voice-brian": "cartesia-Brian",
  "voice-andrew": "cartesia-Andrew",
  "voice-lucas": "cartesia-Lucas",
  "voice-michael": "cartesia-Michael",
  // Premium tier (ElevenLabs)
  "voice-grace-premium": "11labs-Grace", // REC
  "voice-hailey-premium": "11labs-Hailey", // REC
  "voice-nico-premium": "11labs-Nico", // REC
  "voice-adrian-premium": "11labs-Adrian",
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
