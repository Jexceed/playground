const voiceMap: Record<string, string> = {};
const voiceSegments: Record<string, string[]> = {};

let audioContext: AudioContext | null = null;
let preferredVoice: SpeechSynthesisVoice | null = null;
let activeAudio: HTMLAudioElement | null = null;
let manifestPromise: Promise<void> | null = null;
let speechRun = 0;

if (typeof window !== "undefined" && "speechSynthesis" in window) {
  window.speechSynthesis.onvoiceschanged = () => {
    preferredVoice = null;
    pickVoice("zh-CN");
  };
}

export async function speak(text: string, lang = "zh-CN") {
  const clean = normalizeSpeechText(text);
  await loadVoiceManifest();
  const src = voiceMap[clean] ?? voiceMap[text];
  const segmentSrcs = voiceSegments[clean] ?? voiceSegments[text];
  const useChunkedSpeech = shouldSplitLongLocalAudio(clean);
  speechRun += 1;
  activeAudio?.pause();
  activeAudio = null;

  if (segmentSrcs?.length) {
    window.speechSynthesis?.cancel();
    recordSpeechSource("voice-segments");
    void playAudioSegments(segmentSrcs, speechRun);
    return;
  }

  if (src && (!useChunkedSpeech || !("speechSynthesis" in window))) {
    window.speechSynthesis?.cancel();
    recordSpeechSource(src);
    const audio = new Audio(src);
    const run = speechRun;
    let fellBack = false;
    const fallbackToSpeechSynthesis = () => {
      if (fellBack || run !== speechRun || !("speechSynthesis" in window)) return;
      fellBack = true;
      recordSpeechSource("speechSynthesis");
      void speakChunks(splitSpeechText(clean), lang, run);
    };
    activeAudio = audio;
    audio.volume = 0.9;
    audio.onerror = fallbackToSpeechSynthesis;
    try {
      await audio.play();
    } catch {
      fallbackToSpeechSynthesis();
    }
    return;
  }

  if ("speechSynthesis" in window) {
    const run = speechRun;
    recordSpeechSource("speechSynthesis");
    window.speechSynthesis.cancel();
    void speakChunks(splitSpeechText(clean), lang, run);
    return;
  }

  recordSpeechSource("tone");
  playTone(clean.includes("对") || clean.includes("完成") || clean.includes("成功") ? "success" : "notice");
}

function shouldSplitLongLocalAudio(text: string) {
  if (Array.from(text).length <= 34) return false;
  return splitSpeechText(text).length > 1;
}

async function loadVoiceManifest() {
  if (manifestPromise) return manifestPromise;
  manifestPromise = (async () => {
    if (typeof window === "undefined") return;
    try {
      const manifest = await readVoiceManifest();
      for (const entry of manifest.entries ?? []) {
        if (entry.text && entry.src) voiceMap[normalizeSpeechText(entry.text)] = entry.src;
      }
      for (const entry of manifest.segmentEntries ?? []) {
        if (entry.text && Array.isArray(entry.srcs) && entry.srcs.length > 0) {
          voiceSegments[normalizeSpeechText(entry.text)] = entry.srcs;
        }
      }
    } catch {
      // Missing local voice files should not break the prototype.
    }
  })();
  return manifestPromise;
}

async function playAudioSegments(srcs: string[], run: number) {
  for (const src of srcs) {
    if (run !== speechRun) return;
    const audio = new Audio(src);
    activeAudio = audio;
    audio.volume = 0.9;
    try {
      const ended = new Promise<void>((resolve) => {
        audio.onended = () => resolve();
        audio.onerror = () => resolve();
      });
      await audio.play();
      await ended;
    } catch {
      if (run !== speechRun) return;
      const fallbackText = srcToFallbackText(src);
      if (fallbackText) await speakOnce(fallbackText, "zh-CN", run);
    }
    if (run !== speechRun) return;
    await delay(120);
  }
}

async function readVoiceManifest() {
  if (typeof fetch !== "undefined") {
    const response = await fetch("/audio/voice/manifest.json", { cache: "no-cache" });
    if (!response.ok) return {};
    return (await response.json()) as VoiceManifest;
  }

  return new Promise<VoiceManifest>((resolve) => {
    if (typeof XMLHttpRequest === "undefined") {
      resolve({});
      return;
    }
    let resolved = false;
    const finish = (manifest: VoiceManifest) => {
      if (resolved) return;
      resolved = true;
      resolve(manifest);
    };
    window.setTimeout(() => finish({}), 1500);
    const request = new XMLHttpRequest();
    request.open("GET", "/audio/voice/manifest.json", true);
    request.timeout = 1500;
    request.onreadystatechange = () => {
      if (request.readyState !== 4) return;
      if (request.status < 200 || request.status >= 300) {
        finish({});
        return;
      }
      try {
        finish(JSON.parse(request.responseText) as VoiceManifest);
      } catch {
        finish({});
      }
    };
    request.onerror = () => finish({});
    request.ontimeout = () => finish({});
    request.send();
  });
}

export function playTone(kind: "notice" | "success" | "tap" | "error" = "tap") {
  const AudioContextCtor = window.AudioContext || window.webkitAudioContext;
  if (!AudioContextCtor) return;

  audioContext ??= new AudioContextCtor();
  const now = audioContext.currentTime;
  const notes = {
    tap: [520],
    notice: [587, 659],
    success: [523, 659, 784],
    error: [294, 247],
  }[kind];

  notes.forEach((frequency, index) => {
    const oscillator = audioContext!.createOscillator();
    const gain = audioContext!.createGain();
    oscillator.type = kind === "tap" ? "triangle" : "sine";
    oscillator.frequency.value = frequency;
    const start = now + index * (kind === "success" ? 0.105 : 0.12);
    const peak = kind === "error" ? 0.055 : kind === "tap" ? 0.045 : 0.075;
    gain.gain.setValueAtTime(0.0001, start);
    gain.gain.exponentialRampToValueAtTime(peak, start + 0.018);
    gain.gain.exponentialRampToValueAtTime(0.0001, start + (kind === "tap" ? 0.09 : 0.18));
    oscillator.connect(gain).connect(audioContext!.destination);
    oscillator.start(start);
    oscillator.stop(start + (kind === "tap" ? 0.1 : 0.2));
  });
}

declare global {
  interface Window {
    webkitAudioContext?: typeof AudioContext;
  }
}

function pickVoice(lang: string) {
  if (preferredVoice) return preferredVoice;
  const voices = window.speechSynthesis.getVoices();
  const preferredNames = ["Xiaoxiao", "Xiaoyi", "Tingting", "Meijia", "Sinji", "Li-mu", "Yu-shu"];
  preferredVoice =
    voices.find((voice) => preferredNames.some((name) => voice.name.includes(name))) ??
    voices.find((voice) => voice.lang === lang) ??
    voices.find((voice) => voice.lang.toLowerCase().startsWith("zh")) ??
    null;
  return preferredVoice;
}

function normalizeSpeechText(text: string) {
  return text
    .replace(/\s+/g, " ")
    .replace(/([。？！])。/g, "$1")
    .replace(/。。+/g, "。")
    .trim();
}

function splitSpeechText(text: string) {
  const parts = text
    .split(/(?<=[。？！])|(?<=[，、：；])/u)
    .map((part) => part.trim())
    .filter(Boolean);

  if (parts.length <= 1) return parts;
  return parts.flatMap((part) => splitLongPart(part));
}

function splitLongPart(part: string) {
  if (part.length <= 22) return [part];
  const chunks: string[] = [];
  let current = part;
  while (current.length > 22) {
    const cut = Math.max(current.lastIndexOf("，", 22), current.lastIndexOf("、", 22), current.lastIndexOf(" ", 22));
    const index = cut > 8 ? cut + 1 : 22;
    chunks.push(current.slice(0, index).trim());
    current = current.slice(index).trim();
  }
  if (current) chunks.push(current);
  return chunks;
}

async function speakChunks(parts: string[], lang: string, run: number) {
  for (const part of parts) {
    if (run !== speechRun) return;
    await speakOnce(part, lang, run);
    if (run !== speechRun) return;
    await delay(pauseMs(part));
  }
}

function speakOnce(text: string, lang: string, run: number) {
  return new Promise<void>((resolve) => {
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = lang;
    utterance.rate = text.length <= 4 ? 0.78 : 0.84;
    utterance.pitch = 1.08;
    utterance.volume = 0.95;
    utterance.voice = pickVoice(lang);
    utterance.onend = () => resolve();
    utterance.onerror = () => resolve();
    if (run !== speechRun) {
      resolve();
      return;
    }
    window.speechSynthesis.speak(utterance);
  });
}

function pauseMs(text: string) {
  if (/[？！]$/.test(text)) return 320;
  if (/[。]$/.test(text)) return 260;
  return 130;
}

function delay(ms: number) {
  return new Promise<void>((resolve) => {
    window.setTimeout(resolve, ms);
  });
}

function recordSpeechSource(source: string) {
  if (typeof document === "undefined") return;
  document.documentElement.dataset.lastSpeechSource = source;
}

type VoiceManifest = {
  entries?: Array<{
    text?: string;
    src?: string;
  }>;
  segmentEntries?: Array<{
    text?: string;
    srcs?: string[];
  }>;
};

function srcToFallbackText(src: string) {
  const file = decodeURIComponent(src.split("/").pop() ?? "").replace(/\.mp3$/i, "");
  const match = file.match(/^segment-[^-]+-(.+)$/);
  return match?.[1]?.replace(/-/g, "") ?? "";
}
