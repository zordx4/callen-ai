// Single-source-of-truth for which voice preview is currently playing.
// When one voice starts, every other VoicePreview component sees the
// change and stops its own audio element. No global event bus needed.

import { create } from "zustand";

type VoicePlaybackStore = {
  currentId: string | null;
  setCurrent: (id: string | null) => void;
};

export const useVoicePlayback = create<VoicePlaybackStore>((set) => ({
  currentId: null,
  setCurrent: (currentId) => set({ currentId }),
}));
