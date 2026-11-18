// Start in the repository root with PLAYWRIGHT_MODULE and CHROME_PATH if needed.
import assert from 'node:assert/strict';
import { mkdtemp, rm, writeFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { createServer } from 'vite';
import { loadGameData } from '../../../scripts/lib/load-game-data.mjs';

const { chromium } = await import(process.env.PLAYWRIGHT_MODULE || 'playwright');
const { games } = await loadGameData();
const byId = new Map(games.map(g => [g.id, g]));
const out = fileURLToPath(new URL('./', import.meta.url));
const cacheDir = await mkdtemp(join(tmpdir(), 'thinking-sharing-'));
const server = await createServer({ cacheDir, logLevel: 'error', server: { host: '127.0.0.1', port: 0, hmr: false, watch: null } });
await server.listen();
const url = 'http://127.0.0.1:' + server.httpServer.address().port;
const browser = await chromium.launch({ executablePath: process.env.CHROME_PATH, args: ['--mute-audio'] });
const widths = [360, 390, 1440];

async function atWidth(width) {
  const touch = width < 600;
  const context = await browser.newContext({ viewport: { width, height: touch ? 844 : 960 }, hasTouch: touch, reducedMotion: 'reduce' });
  const page = await context.newPage();
  const results = [];
  const errors = [];
  page.on('pageerror', error => errors.push(error.message));
  await page.goto(url);
  const activate = locator => touch ? locator.tap() : locator.click();
  const stage = page.locator('.game-stage');
  const check = page.getByTestId('check-answer');
  async function group(id) {
    const game = byId.get(id);
    await activate(page.getByTestId('world-' + game.world));
    if (touch) await page.locator('.mobile-game-select select').selectOption(id);
    else await activate(page.getByTestId('game-' + id));
    return game.rounds;
  }
  async function jump(index) {
    await activate(page.locator('.round-jump').nth(index));
    await page.waitForFunction(n => document.querySelector('.round-toolbar .eyebrow')?.innerText.includes('第 ' + n + ' /'), index + 1);
  }
  async function success(id) {
    await activate(check);
    await stage.locator('.feedback.success').waitFor();
    assert.ok(await page.evaluate(id => JSON.parse(localStorage.getItem('thinking-island-progress')).completedRoundIds.includes(id), id));
    results.push(id);
  }
  try {
    const share = await group('math-fair-share');
    for (const [i, r] of share.entries()) {
      await jump(i);
      const [total, children] = r.prompt.match(/\d+/g).map(Number);
      const board = stage.locator('.fair-share-board');
      const dishes = board.locator('.share-give');
      const takeBack = board.locator('.share-return');
      const remaining = () => board.locator('.share-tray').getAttribute('data-remaining');
      assert.equal(await dishes.count(), children);
      assert.equal(await remaining(), String(total));
      assert.equal(await check.isEnabled(), false);
      if (i === 1) {
        await activate(dishes.first());
        await activate(check);
        assert.match(await stage.locator('.feedback.needs-work').innerText(), /哪盘多/);
        await activate(takeBack.first());
        assert.equal(await remaining(), String(total));
        for (let j = 0; j < children; j++) await activate(dishes.nth(j));
        await activate(check);
        assert.match(await stage.locator('.feedback.needs-work').innerText(), /再分一块/);
        await activate(board.locator('.share-reset'));
        assert.equal(await remaining(), String(total));
      }
      for (let count = 0; count < Math.floor(total / children); count++)
        for (let j = children - 1; j >= 0; j--) await activate(dishes.nth(j));
      assert.deepEqual(await board.locator('.share-plate-target .sharing-pieces').evaluateAll(elements => elements.map(el => el.querySelectorAll('img').length)), Array(children).fill(Math.floor(total / children)));
      assert.equal(await remaining(), String(total % children));
      await success(r.id);
      if (width === 390 && i === 9) await stage.screenshot({ path: join(out, '390-fair-share-10.jpg'), quality: 78 });
    }
    const parts = await group('math-compose-decompose');
    for (const [i, r] of parts.entries()) {
      if (r.visualGroups[0].label !== '蓝盒') continue;
      await jump(i);
      const [whole, known] = r.prompt.match(/\d+/g).map(Number);
      const partition = stage.locator('.block-partition-board');
      assert.equal(await partition.locator('.is-blue img').count(), known);
      assert.equal(await partition.locator('.is-yellow img').count(), whole - known);
      assert.match(await partition.locator('.is-yellow strong').innerText(), /\?/);
      if (width === 390 && i === 7) await stage.screenshot({ path: join(out, '390-block-partition-8.jpg'), quality: 78 });
      await activate(page.getByTestId('answer-' + (whole - known)));
      await success(r.id);
    }
    for (const g of ['logic-condition-detective', 'logic-fix-plan']) {
      const r = (await group(g))[2];
      await jump(2);
      await activate(stage.getByRole('button', { name: '开始想一想' }));
      assert.equal(await stage.getByRole('button', { name: '继续等着' }).count(), 0);
      await activate(page.getByTestId('answer-car-only'));
      await activate(check);
      await stage.locator('.feedback.needs-work').waitFor();
      await activate(page.getByTestId('answer-walk'));
      await success(r.id);
    }
    for (const [g, indices] of [
      ['logic-same-kind-detective', [7,8,9,10,11,12]], ['logic-matrix-puzzle', [2,4]], ['logic-part-whole-puzzle', [7,8,9,10,11,12]], ['math-clock-time', [9,10,11,12]]
    ]) {
      const rounds = await group(g);
      for (const n of indices) {
        const r = rounds[n - 1];
        await jump(n - 1);
        for (const choice of r.choices.filter(c => /^\p{Extended_Pictographic}\uFE0F?$/u.test(c.label))) {
          const button = page.getByTestId('answer-' + choice.value);
          assert.equal(await button.locator('[data-visual-kind]').count(), 1, r.id);
          assert.doesNotMatch(await button.innerText(), /\p{Extended_Pictographic}/u);
        }
        if (g === 'math-clock-time') assert.match(await stage.innerText(), /24 小时制[\s\S]*13:00/);
        await activate(page.getByTestId('answer-' + r.answer));
        await success(r.id);
      }
    }
    assert.deepEqual(errors, []);
    return { width, pointer: touch ? 'touch' : 'mouse', completed: results.length, roundIds: results, errors };
  } finally { await context.close(); }
}
try {
  const checks = await Promise.all(widths.map(atWidth));
  await writeFile(join(out, 'enlightenment-interactions.json'), JSON.stringify(checks, null, 2) + '\n');
  console.log(checks.map(({ width, completed }) => ({ width, completed })));
} finally {
  await browser.close();
  await server.close();
  await rm(cacheDir, { recursive: true, force: true });
}
