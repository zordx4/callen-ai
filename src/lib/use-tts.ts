// React hook around the browser SpeechSynthesis API.
//
// Why this exists: pre-recorded mp3 samples of each voice persona can
// only say their fixed sample text. Real production TTS (ElevenLabs,
// Azure, etc) requires API keys + a backend. For the demo we use the
// browser's built-in TTS so the agent's actual configured first message
// (or canned chat reply) is what gets spoken. Audio and chat stay in
// sync, no backend needed, no per-character cost.
//
// Trade-off the user accepts: browser voices are clearly synthesised
// and not as polished as our curated mp3 samples. We keep the mp3s for
// the voice library / picker (those answer "what does this voice sound
// like at studio quality") and use this hook for the agent editor's
// test panel (which answers "what would my agent actually say").

"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { pickBrowserVoice, describeBrowserVoice } from "./voice-matcher";
import type { Voice } from "./voice-library";

// Stage directions like [warmly] or [softly] are useful to the LLM /
// the human reading the prompt, but they should NOT be spoken aloud.
const STAGE_DIRECTION_REGEX = /\[[^\]]*\]/g;

// Remove anything our browser TTS would mispronounce.
function sanitizeForSpeech(text: string): string {
  return text.replace(STAGE_DIRECTION_REGEX, "").replace(/\s+/g, " ").trim();
}

export interface SpeakOptions {
  rate?: number;        // 0.1 - 10, default 1
  pitch?: number;       // 0 - 2, default 1
  onEnd?: () => void;
  onError?: (err: SpeechSynthesisErrorEvent) => void;
}

export interface UseTTSResult {
  supported: boolean;
  voicesReady: boolean;
  matchedVoice: SpeechSynthesisVoice | null;
  matchedVoiceLabel: string;
  speaking: boolean;
  /** Text that's currently being spoken (post-sanitisation). Empty when idle. */
  spokenText: string;
  speak: (text: string, options?: SpeakOptions) => void;
  cancel: () => void;
}

/**
 * @param voice — our Voice persona (gender + language used to pick a
 *               browser voice; rate/pitch overrides applied when speaking)
 */
export function useTTS(voice: Voice): UseTTSResult {
  const [supported, setSupported] = useState(true);
  const [voices, setVoices] = useState<SpeechSynthesisVoice[]>([]);
  const [voicesReady, setVoicesReady] = useState(false);
  const [speaking, setSpeaking] = useState(false);
  const [spokenText, setSpokenText] = useState("");

  // Track the current utterance so we can cancel cleanly.
  const utteranceRef = useRef<SpeechSynthesisUtterance | null>(null);

  // ----- Load available voices -----
  useEffect(() => {
    if (typeof window === "undefined") return;
    if (!("speechSynthesis" in window)) {
      setSupported(false);
      return;
    }

    let mounted = true;

    function load() {
      const list = window.speechSynthesis.getVoices();
      if (!mounted) return;
      if (list.length > 0) {
        setVoices(list);
        setVoicesReady(true);
      }
    }

    // Some browsers return [] until 'voiceschanged' fires
    load();
    window.speechSynthesis.addEventListener("voiceschanged", load);

    return () => {
      mounted = false;
      window.speechSynthesis.removeEventListener("voiceschanged", load);
    };
  }, []);

  // Resolve our persona -> browser voice (recomputes when either changes)
  const matchedVoice = useMemo(
    () =>
      pickBrowserVoice(voices, {
        gender: voice.gender,
        language: voice.language,
      }),
    [voices, voice.gender, voice.language]
  );

  const matchedVoiceLabel = useMemo(
    () => describeBrowserVoice(matchedVoice),
    [matchedVoice]
  );

  // ----- Speak / cancel -----
  const cancel = useCallback(() => {
    if (typeof window === "undefined" || !("speechSynthesis" in window)) return;
    window.speechSynthesis.cancel();
    utteranceRef.current = null;
    setSpeaking(false);
    setSpokenText("");
  }, []);

  const speak = useCallback(
    (text: string, options: SpeakOptions = {}) => {
      if (!supported) return;
      if (typeof window === "undefined") return;

      // Cancel any in-flight speech so back-to-back calls don't queue up
      window.speechSynthesis.cancel();

      const clean = sanitizeForSpeech(text);
      if (!clean) return;

      const u = new SpeechSynthesisUtterance(clean);
      if (matchedVoice) {
        u.voice = matchedVoice;
        u.lang = matchedVoice.lang;
      }
      u.rate = options.rate ?? 1.0;
      u.pitch = options.pitch ?? 1.0;
      u.volume = 1.0;

      u.onstart = () => {
        setSpeaking(true);
        setSpokenText(clean);
      };
      u.onend = () => {
        setSpeaking(false);
        setSpokenText("");
        utteranceRef.current = null;
        options.onEnd?.();
      };
      u.onerror = (e) => {
        setSpeaking(false);
        setSpokenText("");
        utteranceRef.current = null;
        options.onError?.(e);
      };

      utteranceRef.current = u;
      window.speechSynthesis.speak(u);
    },
    [supported, matchedVoice]
  );

  // ----- Cleanup: cancel speech on unmount or voice persona change -----
  useEffect(() => {
    return () => {
      if (typeof window !== "undefined" && "speechSynthesis" in window) {
        window.speechSynthesis.cancel();
      }
    };
  }, []);

  // When the persona changes (different voiceId), cancel any in-flight
  // utterance so the wrong-voice audio stops immediately.
  useEffect(() => {
    if (typeof window === "undefined" || !("speechSynthesis" in window)) return;
    window.speechSynthesis.cancel();
    setSpeaking(false);
    setSpokenText("");
    utteranceRef.current = null;
  }, [voice.id]);

  return {
    supported,
    voicesReady,
    matchedVoice,
    matchedVoiceLabel,
    speaking,
    spokenText,
    speak,
    cancel,
  };
}
