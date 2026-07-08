import assert from "node:assert/strict";
import { mkdtemp, readFile, rm, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import test from "node:test";
import { pathToFileURL } from "node:url";
import ts from "typescript";

async function importSpeechWithBrowser(browser) {
  Object.assign(globalThis, browser.globals);
  const source = await readFile(new URL("../src/speech.ts", import.meta.url), "utf8");
  const { outputText } = ts.transpileModule(source, {
    compilerOptions: {
      module: ts.ModuleKind.ES2020,
      target: ts.ScriptTarget.ES2020,
    },
  });
  const dir = await mkdtemp(join(tmpdir(), "thinking-house-speech-"));
  const modulePath = join(dir, "speech.mjs");
  await writeFile(modulePath, outputText);
  const mod = await import(`${pathToFileURL(modulePath).href}?t=${Date.now()}-${Math.random()}`);
  return {
    mod,
    cleanup: async () => {
      await rm(dir, { force: true, recursive: true });
      for (const key of ["window", "document", "fetch", "Audio", "SpeechSynthesisUtterance"]) {
        delete globalThis[key];
      }
    },
  };
}

function createBrowserHarness({ manifest }) {
  const audioInstances = [];
  const speechSynthesis = {
    cancelCalls: 0,
    cancel() {
      this.cancelCalls += 1;
    },
    getVoices() {
      return [{ lang: "zh-CN", name: "Xiaoxiao" }];
    },
    speak() {},
  };
  class MockAudio {
    constructor(src) {
      this.src = src;
      this.error = null;
      this.paused = false;
      this.playCalls = 0;
      this.volume = 1;
      audioInstances.push(this);
    }

    play() {
      this.playCalls += 1;
      return Promise.resolve();
    }

    pause() {
      this.paused = true;
    }
  }

  return {
    audioInstances,
    speechSynthesis,
    globals: {
      Audio: MockAudio,
      SpeechSynthesisUtterance: class MockSpeechSynthesisUtterance {
        constructor(text) {
          this.text = text;
        }
      },
      document: { documentElement: { dataset: {} } },
      fetch: async () => ({
        ok: true,
        json: async () => manifest,
      }),
      window: {
        clearTimeout,
        setTimeout,
        speechSynthesis,
      },
    },
  };
}

function deferredManifest(manifest) {
  let resolve;
  const ready = new Promise((done) => {
    resolve = () =>
      done({
        ok: true,
        json: async () => manifest,
      });
  });
  return { ready, resolve };
}

test("new speech requests invalidate stale requests before the manifest finishes loading", async () => {
  const deferred = deferredManifest({
    entries: [
      { text: "第一题", src: "/audio/first.mp3" },
      { text: "第二题", src: "/audio/second.mp3" },
    ],
  });
  const browser = createBrowserHarness({ manifest: {} });
  browser.globals.fetch = async () => deferred.ready;
  const { mod, cleanup } = await importSpeechWithBrowser(browser);
  try {
    const first = mod.speak("第一题");
    const second = mod.speak("第二题");

    deferred.resolve();
    await Promise.all([first, second]);

    assert.deepEqual(
      browser.audioInstances.map((audio) => audio.src),
      ["/audio/second.mp3"],
    );
    assert.equal(browser.audioInstances[0].playCalls, 1);
  } finally {
    await cleanup();
  }
});

test("stopSpeech immediately pauses local audio and prevents pending speech from starting", async () => {
  const browser = createBrowserHarness({
    manifest: {
      entries: [{ text: "正在播放", src: "/audio/current.mp3" }],
    },
  });
  const { mod, cleanup } = await importSpeechWithBrowser(browser);
  try {
    await mod.speak("正在播放");

    assert.equal(browser.audioInstances.length, 1);
    mod.stopSpeech();

    assert.equal(browser.audioInstances[0].paused, true);
    assert.equal(browser.speechSynthesis.cancelCalls > 0, true);
  } finally {
    await cleanup();
  }

  const deferred = deferredManifest({
    entries: [{ text: "不要播放", src: "/audio/stale.mp3" }],
  });
  const pendingBrowser = createBrowserHarness({ manifest: {} });
  pendingBrowser.globals.fetch = async () => deferred.ready;
  const pending = await importSpeechWithBrowser(pendingBrowser);
  try {
    const stale = pending.mod.speak("不要播放");
    pending.mod.stopSpeech();
    deferred.resolve();
    await stale;

    assert.equal(pendingBrowser.audioInstances.length, 0);
  } finally {
    await pending.cleanup();
  }
});

