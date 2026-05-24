// Colorful organic avatar gradients in the ElevenLabs style.
// Each palette is a multi-layered radial+linear gradient that paints a small
// circle with a blobby, atmospheric look. Used for workspace switcher and
// agent template thumbnails. Identity surfaces only; the rest of the app
// stays monochrome per the locked design system.

export type AvatarGradient = {
  id: string;
  name: string;     // human label for debug
  css: string;      // ready-to-use CSS background value
};

export const AVATAR_GRADIENTS: AvatarGradient[] = [
  {
    id: "sunset",
    name: "Sunset",
    css: [
      "radial-gradient(circle at 28% 30%, #fde68a 0%, transparent 38%)",
      "radial-gradient(circle at 75% 38%, #fb7185 0%, transparent 45%)",
      "radial-gradient(circle at 55% 80%, #c084fc 0%, transparent 50%)",
      "linear-gradient(135deg, #fb923c, #db2777 70%, #7e22ce)",
    ].join(", "),
  },
  {
    id: "ocean",
    name: "Ocean",
    css: [
      "radial-gradient(circle at 25% 25%, #5eead4 0%, transparent 40%)",
      "radial-gradient(circle at 75% 75%, #1e40af 0%, transparent 55%)",
      "radial-gradient(circle at 55% 50%, #2563eb 0%, transparent 60%)",
      "linear-gradient(135deg, #0ea5e9, #1e3a8a)",
    ].join(", "),
  },
  {
    id: "steel",
    name: "Steel",
    css: [
      "radial-gradient(circle at 30% 30%, #f3f4f6 0%, transparent 40%)",
      "radial-gradient(circle at 65% 70%, #71717a 0%, transparent 55%)",
      "linear-gradient(135deg, #9ca3af, #3f3f46 70%, #18181b)",
    ].join(", "),
  },
  {
    id: "lime",
    name: "Lime",
    css: [
      "radial-gradient(circle at 30% 25%, #d9f99d 0%, transparent 40%)",
      "radial-gradient(circle at 70% 70%, #16a34a 0%, transparent 55%)",
      "radial-gradient(circle at 55% 55%, #65a30d 0%, transparent 60%)",
      "linear-gradient(135deg, #84cc16, #14532d)",
    ].join(", "),
  },
  {
    id: "magenta",
    name: "Magenta",
    css: [
      "radial-gradient(circle at 30% 30%, #fbcfe8 0%, transparent 38%)",
      "radial-gradient(circle at 72% 70%, #a21caf 0%, transparent 55%)",
      "linear-gradient(135deg, #ec4899, #6b21a8)",
    ].join(", "),
  },
  {
    id: "amber",
    name: "Amber",
    css: [
      "radial-gradient(circle at 30% 30%, #fef3c7 0%, transparent 40%)",
      "radial-gradient(circle at 72% 65%, #b45309 0%, transparent 55%)",
      "linear-gradient(135deg, #f59e0b, #78350f)",
    ].join(", "),
  },
  {
    id: "indigo",
    name: "Indigo",
    css: [
      "radial-gradient(circle at 25% 25%, #c7d2fe 0%, transparent 40%)",
      "radial-gradient(circle at 70% 70%, #4338ca 0%, transparent 55%)",
      "linear-gradient(135deg, #6366f1, #1e1b4b)",
    ].join(", "),
  },
  {
    id: "rose",
    name: "Rose",
    css: [
      "radial-gradient(circle at 30% 25%, #fecdd3 0%, transparent 40%)",
      "radial-gradient(circle at 70% 75%, #be123c 0%, transparent 55%)",
      "linear-gradient(135deg, #f43f5e, #881337)",
    ].join(", "),
  },
  {
    id: "teal",
    name: "Teal",
    css: [
      "radial-gradient(circle at 30% 28%, #99f6e4 0%, transparent 40%)",
      "radial-gradient(circle at 72% 70%, #0f766e 0%, transparent 55%)",
      "linear-gradient(135deg, #14b8a6, #134e4a)",
    ].join(", "),
  },
  {
    id: "violet",
    name: "Violet",
    css: [
      "radial-gradient(circle at 30% 30%, #e9d5ff 0%, transparent 40%)",
      "radial-gradient(circle at 70% 70%, #6d28d9 0%, transparent 55%)",
      "linear-gradient(135deg, #a855f7, #2e1065)",
    ].join(", "),
  },
  {
    id: "earth",
    name: "Earth",
    css: [
      "radial-gradient(circle at 30% 30%, #fef3c7 0%, transparent 40%)",
      "radial-gradient(circle at 70% 65%, #78350f 0%, transparent 55%)",
      "linear-gradient(135deg, #d97706, #44403c)",
    ].join(", "),
  },
  {
    id: "cyan",
    name: "Cyan",
    css: [
      "radial-gradient(circle at 30% 30%, #cffafe 0%, transparent 40%)",
      "radial-gradient(circle at 70% 70%, #0e7490 0%, transparent 55%)",
      "linear-gradient(135deg, #06b6d4, #164e63)",
    ].join(", "),
  },
];

// Deterministic hash so the same id always picks the same palette.
function hashId(id: string): number {
  let h = 0;
  for (let i = 0; i < id.length; i++) {
    h = (h << 5) - h + id.charCodeAt(i);
    h |= 0;
  }
  return Math.abs(h);
}

export function gradientForId(id: string): AvatarGradient {
  const i = hashId(id) % AVATAR_GRADIENTS.length;
  return AVATAR_GRADIENTS[i];
}

export function gradientCssForId(id: string): string {
  return gradientForId(id).css;
}
