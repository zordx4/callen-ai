// Voice preview playback. Each catalog Voice ships with a real,
// provider-rendered preview clip (voice.audioSrc — Retell's official
// sample mp3s), so previews sound exactly like the production voice.
// The hook keeps the old browser-TTS interface so every consumer
// (voice cards, detail sheet, wizard) works unchanged.

"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import type { Voice } from "./voice-library";

// Strip stage directions like "[warmly]" if a caller passes a first
// message through as preview text (display-only).
const STAGE_DIRECTION_REGEX = /\[[^\]]*\]/g;

function sanitizeForSpeech(text: string): string {
  return text.replace(STAGE_DIRECTION_REGEX, "").replace(/\s+/g, " ").trim();
}

export interface SpeakOptions {
  rate?: number;        // playback rate, default 1
  pitch?: number;       // unused with pre-rendered clips; kept for compat
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
 * @param voice — catalog Voice; playback streams its provider-rendered
 *               preview clip (voice.audioSrc).
 */
export function useTTS(voice: Voice): UseTTSResult {
  const [speaking, setSpeaking] = useState(false);
  const [spokenText, setSpokenText] = useState("");
  const audioRef = useRef<HTMLAudioElement | null>(null);

  // Stop playback when the voice changes or the consumer unmounts.
  useEffect(() => {
    return () => {
      audioRef.current?.pause();
      audioRef.current = null;
      setSpeaking(false);
      setSpokenText("");
    };
  }, [voice.id]);

  const cancel = useCallback(() => {
    audioRef.current?.pause();
    audioRef.current = null;
    setSpeaking(false);
    setSpokenText("");
  }, []);

  const speak = useCallback(
    (text: string, options?: SpeakOptions) => {
      if (typeof window === "undefined") return;
      // Restart cleanly if something is already playing.
      audioRef.current?.pause();

      const audio = new Audio(voice.audioSrc);
      audio.playbackRate = options?.rate ?? 1;
      audioRef.current = audio;
      setSpokenText(sanitizeForSpeech(text || voice.sample));
      setSpeaking(true);

      const done = () => {
        setSpeaking(false);
        setSpokenText("");
        if (audioRef.current === audio) audioRef.current = null;
        options?.onEnd?.();
      };
      audio.addEventListener("ended", done, { once: true });
      audio.addEventListener(
        "error",
        () => {
          done();
          options?.onError?.(
            new Event("error") as unknown as SpeechSynthesisErrorEvent
          );
        },
        { once: true }
      );

      void audio.play().catch(() => done());
    },
    [voice.audioSrc, voice.sample]
  );

  return {
    supported: true,
    voicesReady: true,
    matchedVoice: null,
    matchedVoiceLabel: voice.edgeVoice,
    speaking,
    spokenText,
    speak,
    cancel,
  };
}
