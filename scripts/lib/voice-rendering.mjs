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

/** A truncated line ID is not an input fingerprint. Media checks alone are insufficient. */
export function canReuseVoiceInput(line, previous, options, manifest) {
  if (!previous || !manifest) return false;
  let samePath = false;
  try { samePath = decodeURIComponent(previous.src ?? '') === decodeURIComponent(options.src); } catch { return false; }
  return samePath && previous.text === line.text
    && (previous.spokenText ?? previous.text) === (line.spokenText ?? line.text)
    && (previous.locale ?? 'zh-CN') === (line.locale ?? 'zh-CN')
    && previous.voice === options.voice && manifest.rate === options.rate && manifest.pitch === options.pitch;
}
