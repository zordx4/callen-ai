// Generate one mp3 per voice in the catalog.
// Reads src/lib/voice-library.ts via a tiny TS-stripping regex parse
// (avoids spinning up ts-node just for this one script). Writes the audio
// to public/voices/<id>.mp3. Idempotent: skips files that already exist
// unless --force is passed.

import { MsEdgeTTS, OUTPUT_FORMAT } from "msedge-tts";
import { createWriteStream, existsSync, readFileSync, statSync } from "node:fs";
import { pipeline } from "node:stream/promises";
import path from "node:path";

const FORCE = process.argv.includes("--force");
const ONLY = process.argv.find((a) => a.startsWith("--only="))?.split("=")[1];

// -----------------------------------------------------------------
// Minimal parse of voice-library.ts to pull out the VOICES array.
// We only need: id, edgeVoice, rate, pitch, sample.
// -----------------------------------------------------------------

const libPath = path.resolve("src/lib/voice-library.ts");
const libSrc = readFileSync(libPath, "utf8");

// Grab the slice between `export const VOICES: Voice[] = [` and the
// matching closing `];` at top level.
const startMatch = libSrc.match(/export\s+const\s+VOICES[^=]*=\s*\[/);
if (!startMatch) {
  console.error("Could not find VOICES export in voice-library.ts");
  process.exit(1);
}
const openBracket = startMatch.index + startMatch[0].length - 1;
let depth = 0;
let end = -1;
for (let i = openBracket; i < libSrc.length; i++) {
  const ch = libSrc[i];
  if (ch === "[") depth++;
  else if (ch === "]") {
    depth--;
    if (depth === 0) {
      end = i;
      break;
    }
  }
}
if (end === -1) {
  console.error("Could not parse VOICES array bounds");
  process.exit(1);
}
const arraySlice = libSrc.slice(openBracket + 1, end);

// Split into entries by top-level `},` boundaries. Each entry is a `{ ... }`.
const entries = [];
{
  let braceDepth = 0;
  let entryStart = -1;
  for (let i = 0; i < arraySlice.length; i++) {
    const ch = arraySlice[i];
    if (ch === "{") {
      if (braceDepth === 0) entryStart = i;
      braceDepth++;
    } else if (ch === "}") {
      braceDepth--;
      if (braceDepth === 0 && entryStart !== -1) {
        entries.push(arraySlice.slice(entryStart, i + 1));
        entryStart = -1;
      }
    }
  }
}

function pluck(entry, field) {
  // Match `field: "value"` or `field: 'value'` — handle escapes inside.
  const re = new RegExp(
    `${field}\\s*:\\s*("(?:[^"\\\\]|\\\\.)*"|'(?:[^'\\\\]|\\\\.)*')`
  );
  const m = entry.match(re);
  if (!m) return undefined;
  return m[1].slice(1, -1).replace(/\\"/g, '"').replace(/\\'/g, "'");
}

const voices = entries
  .map((e) => ({
    id: pluck(e, "id"),
    edgeVoice: pluck(e, "edgeVoice"),
    rate: pluck(e, "rate"),
    pitch: pluck(e, "pitch"),
    sample: pluck(e, "sample"),
  }))
  .filter((v) => v.id && v.edgeVoice && v.sample);

console.log(`Found ${voices.length} voices in catalog.`);

// -----------------------------------------------------------------
// Generate
// -----------------------------------------------------------------

const outDir = path.resolve("public/voices");

let generated = 0;
let skipped = 0;
for (const v of voices) {
  if (ONLY && v.id !== ONLY) continue;
  const outPath = path.join(outDir, `${v.id}.mp3`);
  if (!FORCE && existsSync(outPath) && statSync(outPath).size > 1000) {
    console.log(`  - skip ${v.id} (exists, ${statSync(outPath).size} bytes)`);
    skipped++;
    continue;
  }

  process.stdout.write(`  - ${v.id.padEnd(10)}  ${v.edgeVoice.padEnd(24)} ...`);
  const tts = new MsEdgeTTS();
  const prosody = {};
  if (v.rate) prosody.rate = v.rate;
  if (v.pitch) prosody.pitch = v.pitch;
  await tts.setMetadata(
    v.edgeVoice,
    OUTPUT_FORMAT.AUDIO_24KHZ_48KBITRATE_MONO_MP3,
    Object.keys(prosody).length ? prosody : undefined
  );
  const { audioStream } = await tts.toStream(v.sample);
  await pipeline(audioStream, createWriteStream(outPath));
  const size = statSync(outPath).size;
  console.log(`  ${(size / 1024).toFixed(1)} KB`);
  generated++;
}

console.log(`\nDone. Generated ${generated}, skipped ${skipped}.`);
