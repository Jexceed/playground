import { readFileSync } from "node:fs";
import test from "node:test";
import assert from "node:assert/strict";

const appSource = readFileSync(new URL("../src/App.tsx", import.meta.url), "utf8");
const gameSource = readFileSync(new URL("../src/games/ProgressiveSetGame.tsx", import.meta.url), "utf8");

test("round navigator clicks request an immediate round read", () => {
  assert.match(appSource, /import \{ speak, stopSpeech, warmVoiceManifest \} from "\.\/speech";/);
  assert.match(appSource, /const \[roundReadRequestKey, setRoundReadRequestKey\] = useState\(0\);/);
  assert.match(appSource, /function jumpToRound\(index: number\)/);
  assert.match(appSource, /stopSpeech\(\);[\s\S]*setRequestedRoundIndex\(index\);[\s\S]*setRoundReadRequestKey\(\(current\) => current \+ 1\);/);
  assert.match(appSource, /requestedRoundReadKey=\{roundReadRequestKey\}/);
  assert.match(appSource, /onJump=\{jumpToRound\}/);
});

test("game surface reads the requested target round instead of only the current render", () => {
  assert.match(gameSource, /requestedRoundReadKey/);
  assert.match(gameSource, /lastRoundReadKey/);
  assert.match(gameSource, /const requestedRound = game\.rounds\[nextIndex\];/);
  assert.match(gameSource, /speak\(joinVoiceLine\(requestedRound\.prompt, requestedRound\.instruction\)\);/);
});

