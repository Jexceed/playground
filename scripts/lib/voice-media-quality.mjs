import { readFile } from "node:fs/promises";

export const MINIMUM_HAN_SECONDS = 0.18;
export const MINIMUM_MEDIA_SECONDS = 0.35;

const MPEG1_LAYER3_BITRATES = [0, 32, 40, 48, 56, 64, 80, 96, 112, 128, 160, 192, 224, 256, 320];
const MPEG2_LAYER3_BITRATES = [0, 8, 16, 24, 32, 40, 48, 56, 64, 80, 96, 112, 128, 144, 160];
const MPEG1_SAMPLE_RATES = [44_100, 48_000, 32_000];

export function inspectMp3(input) {
  const buffer = Buffer.isBuffer(input) ? input : Buffer.from(input);
  const problems = [];
  let offset = id3v2End(buffer);
  const firstFrameOffset = findFirstFrame(buffer, offset);
  if (firstFrameOffset < 0) {
    return {
      bitrateKbps: 0,
      durationSeconds: 0,
      firstFrameOffset: -1,
      frameCount: 0,
      problems: ["voice file has no complete MP3 frames"],
      sampleRate: 0,
    };
  }

  offset = firstFrameOffset;
  let bitrateKbps = 0;
  let durationSeconds = 0;
  let frameCount = 0;
  let sampleRate = 0;

  while (offset + 4 <= buffer.length) {
    const frame = parseFrameHeader(buffer, offset);
    if (!frame) break;
    if (offset + frame.length > buffer.length) {
      problems.push("voice file ends with a truncated MP3 frame");
      break;
    }

    bitrateKbps ||= frame.bitrateKbps;
    sampleRate ||= frame.sampleRate;
    durationSeconds += frame.samplesPerFrame / frame.sampleRate;
    frameCount += 1;
    offset += frame.length;
  }

  if (frameCount === 0) {
    problems.push("voice file has no complete MP3 frames");
  } else if (offset < buffer.length && !isKnownTrailingTag(buffer, offset)) {
    const partial = parseFrameHeader(buffer, offset);
    problems.push(partial
      ? "voice file ends with a truncated MP3 frame"
      : `voice file contains unexpected data after ${frameCount} MP3 frames`);
  }

  return {
    bitrateKbps,
    durationSeconds,
    firstFrameOffset,
    frameCount,
    problems: Array.from(new Set(problems)),
    sampleRate,
  };
}

export function inspectVoiceMedia(input, text) {
  const media = inspectMp3(input);
  const hanCount = countHan(text);
  const minimumDurationSeconds = minimumVoiceDuration(text);
  const problems = [...media.problems];

  if (
    media.frameCount > 0
    && media.durationSeconds + 0.001 < minimumDurationSeconds
  ) {
    problems.push(
      `voice duration ${media.durationSeconds.toFixed(2)}s is below `
      + `${minimumDurationSeconds.toFixed(2)}s for ${hanCount} Han characters`,
    );
  }

  return {
    ...media,
    hanCount,
    minimumDurationSeconds,
    problems,
  };
}

export async function inspectVoiceFile(filePath, text) {
  try {
    return {
      filePath,
      ...inspectVoiceMedia(await readFile(filePath), text),
    };
  } catch (error) {
    if (error?.code === "ENOENT") {
      return emptyFileResult(filePath, text, "voice file is missing");
    }
    return emptyFileResult(filePath, text, `voice file could not be read: ${error.message}`);
  }
}

export function minimumVoiceDuration(text) {
  const hanCount = countHan(text);
  if (hanCount >= 8) return hanCount * MINIMUM_HAN_SECONDS;
  return MINIMUM_MEDIA_SECONDS;
}

function countHan(text) {
  return (String(text).match(/[\u3400-\u9fff]/g) ?? []).length;
}

function emptyFileResult(filePath, text, problem) {
  return {
    bitrateKbps: 0,
    durationSeconds: 0,
    filePath,
    firstFrameOffset: -1,
    frameCount: 0,
    hanCount: countHan(text),
    minimumDurationSeconds: minimumVoiceDuration(text),
    problems: [problem],
    sampleRate: 0,
  };
}

function findFirstFrame(buffer, start) {
  const maximumOffset = Math.min(buffer.length - 4, start + 4096);
  for (let offset = start; offset <= maximumOffset; offset += 1) {
    const frame = parseFrameHeader(buffer, offset);
    if (frame && offset + frame.length <= buffer.length) return offset;
  }
  return -1;
}

function parseFrameHeader(buffer, offset) {
  if (offset + 4 > buffer.length) return null;
  const header = buffer.readUInt32BE(offset);
  if ((header >>> 21) !== 0x7ff) return null;

  const versionBits = (header >>> 19) & 0b11;
  const layerBits = (header >>> 17) & 0b11;
  const bitrateIndex = (header >>> 12) & 0b1111;
  const sampleRateIndex = (header >>> 10) & 0b11;
  const padding = (header >>> 9) & 0b1;
  if (versionBits === 0b01 || layerBits !== 0b01 || bitrateIndex === 0 || bitrateIndex === 0b1111 || sampleRateIndex === 0b11) {
    return null;
  }

  const isMpeg1 = versionBits === 0b11;
  const bitrateKbps = (isMpeg1 ? MPEG1_LAYER3_BITRATES : MPEG2_LAYER3_BITRATES)[bitrateIndex];
  const divisor = versionBits === 0b11 ? 1 : versionBits === 0b10 ? 2 : 4;
  const sampleRate = MPEG1_SAMPLE_RATES[sampleRateIndex] / divisor;
  const coefficient = isMpeg1 ? 144_000 : 72_000;
  const length = Math.floor((coefficient * bitrateKbps) / sampleRate) + padding;

  return {
    bitrateKbps,
    length,
    sampleRate,
    samplesPerFrame: isMpeg1 ? 1152 : 576,
  };
}

function id3v2End(buffer) {
  if (buffer.length < 10 || buffer.toString("ascii", 0, 3) !== "ID3") return 0;
  const size = (
    ((buffer[6] & 0x7f) << 21)
    | ((buffer[7] & 0x7f) << 14)
    | ((buffer[8] & 0x7f) << 7)
    | (buffer[9] & 0x7f)
  );
  return Math.min(buffer.length, 10 + size);
}

function isKnownTrailingTag(buffer, offset) {
  return buffer.length - offset === 128 && buffer.toString("ascii", offset, offset + 3) === "TAG";
}
