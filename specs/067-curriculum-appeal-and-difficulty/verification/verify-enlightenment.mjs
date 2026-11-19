// Run from the repo root after pnpm build. PLAYGROUND_QA_URL can select an existing preview.
// PLAYWRIGHT_MODULE and CHROME_PATH can select a locally installed Playwright and Chrome.
import assert from 'node:assert/strict';
import { createHash } from 'node:crypto';
import { writeFile } from 'node:fs/promises';
import { preview } from 'vite';
import { loadTypeScriptModule } from '../../../scripts/lib/load-ts-module.mjs';

const { chromium } = await import(process.env.PLAYWRIGHT_MODULE || 'playwright');
const [{ games }, { logicLessonFor }, { enlightenmentPromptSpeech }] = await Promise.all([
  loadTypeScriptModule('src/data/games.ts'),
  loadTypeScriptModule('src/data/logicLessonVisuals.ts'),
  loadTypeScriptModule('src/domain/enlightenment.ts'),
]);
const camera = games.find(g => g.id === 'logic-memory-camera');
const birds = games.find(g => g.id === 'math-story-operations');
const partitions = games.find(g => g.id === 'math-compose-decompose');
const orderStory = games.find(g => g.id === 'logic-order-plan');
const splits = partitions.rounds.filter(r => r.visualGroups.some(g => g.label === '蓝盒'));
const sceneGroups = games.map(game => ({
  game, rounds: game.rounds.filter(r => logicLessonFor(r)?.evidenceScene && !r.sequenceStory),
})).filter(({ rounds }) => rounds.length);

async function verifyWidth(browser, url, voices, width) {
  const touch = width === 390;
  const context = await browser.newContext({
    viewport: { width, height: touch ? 844 : 880 }, hasTouch: touch, reducedMotion: 'reduce',
  });
  const page = await context.newPage();
  const errors = [];
  const audioChecks = {};
  page.on('pageerror', e => errors.push(e.message));
  // Count a real media element only after the browser accepts playback. Keep its original promise.
  await page.addInitScript(() => {
    window.startedVoiceClips = [];
    const play = HTMLMediaElement.prototype.play;
    HTMLMediaElement.prototype.play = function (...args) {
      const promise = play.apply(this, args);
      promise.then(() => {
        const path = decodeURIComponent(new URL(this.currentSrc || this.src, document.baseURI).pathname);
        if (path.includes('/audio/voice/')) window.startedVoiceClips.push(path);
      }, () => {});
      return promise;
    };
  });
  const activate = locator => touch ? locator.tap() : locator.click();
  const button = name => page.getByRole('button', { name, exact: true });
  const roundButton = index => page.getByRole('button', { name: new RegExp('^跳到第 ' + (index + 1) + ' 题') });
  const toolbar = page.locator('.progressive-game .round-toolbar');
  async function hear(action, expectedText, source) {
    const clip = voices.get(expectedText);
    assert.ok(clip, 'Missing exported prompt: ' + expectedText);
    const start = await page.evaluate(() => window.startedVoiceClips.length);
    await action();
    await page.waitForFunction(([index, suffix]) =>
      window.startedVoiceClips.slice(index).some(path => path.endsWith(suffix)), [start, decodeURIComponent(clip)]);
    audioChecks[source] = (audioChecks[source] || 0) + 1;
  }
  async function open(game, expectedSpeech) {
    await activate(page.getByTestId('world-' + game.world));
    const enter = () => touch
      ? page.locator('.mobile-game-select select').selectOption(game.id)
      : activate(page.getByTestId('game-' + game.id));
    if (expectedSpeech) await hear(enter, expectedSpeech, 'enter');
    else await enter();
    await page.locator('[data-game="' + game.id + '"]').waitFor();
  }
  async function jump(game, round) {
    await activate(roundButton(game.rounds.indexOf(round)));
    await toolbar.getByRole('heading', { name: round.prompt, exact: true }).waitFor();
  }
  async function solve(round) {
    await activate(page.getByTestId('answer-' + round.answer));
    await activate(page.getByTestId('check-answer'));
    await page.getByTestId('next-round').waitFor();
  }
  try {
    await page.goto(url);
    await page.locator('.app-shell').waitFor();
    const observe = enlightenmentPromptSpeech(camera.id, camera.rounds[0], 'observing');
    await open(camera, observe);
    for (const [i, round] of camera.rounds.entries()) {
      const recall = enlightenmentPromptSpeech(camera.id, round, 'answering');
      assert.ok(recall.includes(round.prompt) && !observe.includes(round.prompt), round.id);
      await hear(() => activate(roundButton(i)), observe, 'jumpToObserve');
      assert.ok(!(await toolbar.innerText()).includes(round.prompt), round.id);
      assert.equal(await page.locator('.answer-grid button').count(), 0, round.id);
      await hear(() => activate(button('听题')), observe, 'readObserve');
      await hear(() => activate(button('遮住再答')), recall, 'cover');
      assert.equal(await toolbar.locator('h3').innerText(), round.prompt);
      assert.equal(await page.locator('.memory-board.covered').count(), 1);
      assert.equal(await page.locator('.answer-grid button').count(), round.choices.length);
      await hear(() => activate(button('听题')), recall, 'readRecall');
      await hear(() => activate(roundButton(i)), recall, 'readSameRound');
      await hear(() => activate(button('重新看图')), observe, 'review');
      assert.ok(!(await toolbar.innerText()).includes(round.prompt), round.id);
      assert.equal(await page.locator('.answer-grid button').count(), 0);
    }
    await hear(() => activate(page.getByTestId('restart-game')), observe, 'reset');
    await activate(button('遮住再答'));
    await solve(camera.rounds[0]);
    await hear(() => activate(page.getByTestId('next-round')), observe, 'next');
    for (const { game, rounds } of sceneGroups) {
      await open(game);
      for (const round of rounds) {
        await jump(game, round);
        const evidence = page.getByRole('region', { name: '当前题目证据' });
        const original = await evidence.locator('.logic-picture img').first().getAttribute('src');
        await solve(round);
        await activate(button('再看场景'));
        const scene = page.locator('.logic-lesson-intro');
        assert.equal(await scene.locator('.logic-picture img').first().getAttribute('src'), original, round.id);
        await activate(button('回到解释'));
        await page.locator('.logic-lesson-solved').waitFor();
        assert.ok(await page.getByTestId('next-round').isEnabled(), round.id);
      }
    }
    await open(orderStory);
    await jump(orderStory, orderStory.rounds[0]);
    assert.equal(await page.locator('.answer-grid button').count(), 0);
    await activate(button('开始排顺序'));
    assert.ok(await page.locator('.answer-grid button').count());
    await open(birds);
    for (const round of birds.rounds) {
      await jump(birds, round);
      assert.doesNotMatch(await toolbar.innerText(), /看飞走|点按钮|按下|动画/);
      const [start, gone] = round.visualGroups.map(g => g.items.length);
      const perched = page.locator('.bird-departure-board [data-location="branch"]');
      assert.equal(await perched.count(), start, round.id);
      await activate(button('让 ' + gone + ' 只小鸟飞走'));
      assert.equal(await perched.count(), Number(round.answer), round.id);
      await activate(button('回到开始，再看一次'));
      assert.equal(await perched.count(), start, round.id);
    }
    await open(partitions);
    for (const round of splits) {
      await jump(partitions, round);
      const [known, asked] = round.visualGroups;
      const box = group => page.locator('.block-partition-board .is-' + (group.label === '蓝盒' ? 'blue' : 'yellow'));
      assert.ok((await box(known).innerText()).includes(String(known.items.length)), round.id);
      assert.match(await box(asked).innerText(), /\?/, round.id);
      assert.equal(await box(asked).locator('img').count(), Number(round.answer), round.id);
      await solve(round);
      assert.ok((await box(asked).innerText()).includes(round.answer), round.id);
    }
    assert.deepEqual(errors, []);
    return { width, pointer: touch ? 'touch' : 'mouse', localPlayback: audioChecks, errors };
  } finally {
    await context.close();
  }
}

const external = process.env.PLAYGROUND_QA_URL;
const server = external ? undefined : await preview({ logLevel: 'error', preview: { host: '127.0.0.1', port: 0 } });
const url = external || 'http://127.0.0.1:' + server.httpServer.address().port + '/';
let browser;
try {
  const [indexResponse, manifestResponse] = await Promise.all([
    fetch(url), fetch(new URL('audio/voice/manifest.json', url)),
  ]);
  assert.ok(indexResponse.ok && manifestResponse.ok, 'Could not read the served build and voice manifest');
  const [indexHtml, manifestText] = await Promise.all([indexResponse.text(), manifestResponse.text()]);
  const sha256 = text => createHash('sha256').update(text).digest('hex');
  const build = { indexSHA256: sha256(indexHtml), voiceManifestSHA256: sha256(manifestText) };
  const manifest = JSON.parse(manifestText);
  const voices = new Map(manifest.entries.filter(e => e.locale === 'zh-CN').map(e => [e.text, e.src]));
  browser = await chromium.launch({ executablePath: process.env.CHROME_PATH, args: ['--mute-audio'] });
  const sceneRoundIds = sceneGroups.flatMap(({ rounds }) => rounds.map(r => r.id));
  assert.deepEqual([sceneRoundIds.length, camera.rounds.length, birds.rounds.length, splits.length], [23, 12, 12, 12]);
  const runs = [];
  for (const width of [1280, 390]) runs.push(await verifyWidth(browser, url, voices, width));
  const report = { build, sceneRoundIds, memoryRounds: camera.rounds.length, birdRounds: birds.rounds.length,
    partitionRounds: splits.length, voiceProvider: manifest.provider, manifestEntries: manifest.entries.length, runs };
  await writeFile(new URL('enlightenment-interactions.json', import.meta.url), JSON.stringify(report, null, 2) + '\n');
  console.log(JSON.stringify(report));
} finally {
  await browser?.close();
  await server?.close();
}
