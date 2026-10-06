import { createHash } from "node:crypto";

export function safeVoiceFileName(input) {
  return input.normalize("NFKC").replace(/[^\p{Letter}\p{Number}-]+/gu, "-").replace(/^-|-$/g, "").slice(0, 110);
}

/** Preserve existing assets, but never reuse old audio after a pronunciation change. */
export function voiceFileName(line, { voice, rate, pitch }) {
  const base = safeVoiceFileName(line.id);
  const spokenText = line.spokenText ?? line.text;
  if (spokenText === line.text) return `${base}.mp3`;
  const fingerprint = createHash("sha256").update(JSON.stringify([line.id, line.text, spokenText, voice, rate, pitch])).digest("hex").slice(0, 12);
  return `${base.slice(0, 65)}-pron-${fingerprint}.mp3`;
}
