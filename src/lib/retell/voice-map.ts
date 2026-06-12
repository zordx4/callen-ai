// Maps Callen's voice catalog ids to Retell voice ids (English, US market).
// Retell voice ids are provider-prefixed ("11labs-*", "openai-*", etc.).
// TODO: replace/extend from GET /list-voices once the API key is live —
// run `retell().voice.list()` and curate.

const VOICE_MAP: Record<string, string> = {
  // Callen catalog id -> Retell voice id
  "voice-adrian": "11labs-Adrian",
  "voice-anthony": "11labs-Anthony",
  "voice-billy": "11labs-Billy",
  "voice-brian": "11labs-Brian",
  "voice-chloe": "11labs-Chloe",
  "voice-dorothy": "11labs-Dorothy",
  "voice-grace": "11labs-Grace",
  "voice-lily": "11labs-Lily",
};

export const DEFAULT_RETELL_VOICE = "11labs-Adrian";

export function toRetellVoiceId(callenVoiceId: string | null | undefined): string {
  if (!callenVoiceId) return DEFAULT_RETELL_VOICE;
  // Allow raw Retell ids to pass through (already provider-prefixed).
  if (callenVoiceId.includes("-") && /^(11labs|openai|play|deepgram|cartesia|retell)-/i.test(callenVoiceId)) {
    return callenVoiceId;
  }
  return VOICE_MAP[callenVoiceId] ?? DEFAULT_RETELL_VOICE;
}
