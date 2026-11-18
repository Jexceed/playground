// From the repository root, point PLAYGROUND_URL at the served production build.
// PLAYWRIGHT_MODULE and CHROME_PATH may select an existing Playwright and Chrome.
import assert from 'node:assert/strict';
import { writeFile } from 'node:fs/promises';
import { loadGameData } from '../../../scripts/lib/load-game-data.mjs';

const url = process.env.PLAYGROUND_URL || process.argv[2];
if (!url) throw new Error('Set PLAYGROUND_URL to the running production build, or pass its URL as the first argument.');
const { chromium } = await import(process.env.PLAYWRIGHT_MODULE || 'playwright');
const { activitySets } = await loadGameData();
const pictureTokens = round => round.tokens.filter(t => !t.textOnly && !t.quantityPicture && !t.moneyValues && !t.partitionCounts);
const pictureGroups = activitySets.map(group => ({
  group,
  rounds: group.rounds.filter(round => round.kind === 'singleChoice' && pictureTokens(round).length),
})).filter(entry => entry.rounds.length);

async function verifyWidth(width) {
  const touch = width === 390;
  const browser = await chromium.launch({
    executablePath: process.env.CHROME_PATH,
    args: ['--mute-audio', '--autoplay-policy=no-user-gesture-required'],
  });
  const context = await browser.newContext({ viewport: { width, height: touch ? 844 : 880 }, hasTouch: touch, reducedMotion: 'reduce' });
  const page = await context.newPage();
  page.setDefaultTimeout(10000);
  await page.addInitScript(() => {
    const play = HTMLMediaElement.prototype.play;
    HTMLMediaElement.prototype.play = function () {
      const capture = window.optionAudio;
      if (capture && this instanceof HTMLAudioElement) {
        const file = decodeURIComponent(new URL(this.src).pathname.split('/').at(-1));
        capture.calls.push(file);
        this.addEventListener('ended', () => capture.ended.push(file), { once: true });
      }
      return play.call(this);
    };
  });
  const errors = [];
  page.on('pageerror', error => errors.push(error.message));
  const act = control => touch ? control.tap() : control.click();
  const stage = page.getByTestId('activity-round');
  const choices = stage.locator('.single-choice button.activity-token');
  const viewer = page.locator('dialog.picture-viewer[open]');
  const selected = () => choices.evaluateAll(items => items.filter(b => b.getAttribute('aria-pressed') === 'true').map(b => b.getAttribute('aria-label')));
  const groupResults = [];
  let opened = 0;
  let activeGroup;

  async function visit(group, round) {
    if (activeGroup !== group.id) {
      const world = page.getByTestId('world-' + group.world);
      if (await world.getAttribute('aria-expanded') !== 'true') await act(world);
      if (touch) await page.locator('.mobile-game-select select').selectOption(group.id);
      else await act(page.getByTestId('game-' + group.id));
      activeGroup = group.id;
    }
    if (await stage.getAttribute('data-activity-id') !== round.id) {
      const number = group.rounds.findIndex(r => r.id === round.id) + 1;
      await act(page.getByRole('button', { name: new RegExp('^跳到第 ' + number + ' 题(，已做)?$') }));
    }
    const activeRound = page.locator(`[data-activity-id="${round.id}"]`);
    await activeRound.waitFor();
    if (round.protocol.kind === 'memory' && await activeRound.getAttribute('data-phase') === 'ready') {
      await act(activeRound.getByRole('button', { name: '开始听声音' }));
    }
    await page.locator(`[data-activity-id="${round.id}"][data-phase="respond"]`).waitFor({ timeout: 45000 });
  }

  async function showGroupRound(slug, number) {
    const group = activitySets.find(g => g.id === 'explore-' + slug);
    await visit(group, group.rounds[number - 1]);
    return group.rounds[number - 1];
  }

  async function checkViewer(token) {
    assert.equal(await viewer.locator('figcaption').innerText(), token.label);
    const source = await viewer.locator('figure img').evaluate(async image => {
      await image.decode();
      return image.naturalWidth && new URL(image.currentSrc).pathname;
    });
    assert.ok(typeof source === 'string' && source.endsWith(token.image.src), token.id + ' enlarged the wrong image');
  }

  async function checkPictures() {
    for (const { group, rounds } of pictureGroups) {
      const before = opened;
      for (const round of rounds) {
        await visit(group, round);
        const tokens = pictureTokens(round);
        const buttons = stage.locator('.single-choice button.picture-peek');
        assert.equal(await buttons.count(), tokens.length, round.id);
        assert.deepEqual(await selected(), [], round.id);
        for (const [i, token] of tokens.entries()) {
          if (i === 1) await act(choices.getByText(tokens[0].label, { exact: true }));
          const prior = await selected();
          const button = buttons.nth(i);
          assert.equal(await button.getAttribute('aria-label'), '看大图：' + token.label);
          assert.ok(await button.evaluate(element => {
            const bounds = element.getBoundingClientRect();
            const image = element.parentElement.querySelector('.activity-token img').getBoundingClientRect();
            return bounds.left >= 0 && bounds.right <= innerWidth && bounds.bottom <= image.top + 1;
          }), round.id + '/' + token.id + ' clipped control or covered diagram');
          await act(button);
          await checkViewer(token);
          if (i === 0 && tokens.length > 1) {
            await act(viewer.getByRole('button', { name: '下一张' }));
            await checkViewer(tokens[1]);
            if (touch) await act(viewer.getByRole('button', { name: '上一张' }));
            else await page.keyboard.press('ArrowLeft');
            await checkViewer(token);
          }
          if (i === 0 && !touch) await page.keyboard.press('Escape');
          else await act(viewer.getByRole('button', { name: '回到题目' }));
          await viewer.waitFor({ state: 'hidden' });
          assert.deepEqual(await selected(), prior, round.id + '/' + token.id);
          opened++;
        }
      }
      groupResults.push({ group: group.id, rounds: rounds.length, options: opened - before });
      console.log(width + 'px ' + group.id + ': ' + (opened - before) + ' images opened');
    }
  }

  async function checkConstruction() {
    await showGroupRound('shape-assembly', 1);
    const pieces = stage.locator('.construction-tools').first().getByRole('button');
    const cells = stage.locator('.construction-board button');
    await act(pieces.nth(0)); await act(cells.nth(0));
    await act(pieces.nth(1)); await act(cells.nth(1));
    assert.deepEqual(await cells.allTextContents(), ['1','2','1','2']);
    await act(cells.nth(0));
    assert.deepEqual(await cells.allTextContents(), ['','2','','2']);
    await act(cells.nth(0));
    await act(stage.getByRole('button', { name: '摆好了，看看' }));
    await page.locator('[data-phase="complete"]').waitFor();

    const round = await showGroupRound('shape-assembly', 9);
    const layer = stage.getByRole('combobox', { name: '摆放层' });
    assert.equal(round.layers, 2);
    assert.equal(await layer.locator('option').count(), 2);
    await act(pieces.nth(0)); await act(cells.nth(0));
    await act(pieces.nth(1)); await act(cells.nth(3));
    const lower = await cells.allTextContents();
    assert.deepEqual(lower, ['1','1','1','2']);
    await layer.selectOption('1');
    assert.deepEqual(await cells.evaluateAll(nodes => nodes.map(n => n.classList.contains('target-cell'))), [false,true,false,true]);
    await act(pieces.nth(2));
    await act(stage.getByRole('button', { name: /转一下方向/ }));
    await act(cells.nth(1)); await act(cells.nth(3));
    assert.deepEqual(await cells.allTextContents(), ['','','','']);
    assert.match(await stage.getByRole('button', { name: /转一下方向/ }).innerText(), /90°/);
    await act(cells.nth(1));
    const upper = await cells.allTextContents();
    assert.deepEqual(upper, ['','3','','3']);
    await layer.selectOption('0');
    assert.deepEqual(await cells.allTextContents(), lower);
    await act(stage.getByRole('button', { name: '摆好了，看看' }));
    await page.locator('[data-phase="complete"]').waitFor();
    return { singleLayerPickup: true, twoLayerRound: round.id, lower, upper, retainedDegrees: 90, accepted: true };
  }

  async function checkGrid() {
    await showGroupRound('grid-copy-reconstruction', 4);
    const grid = stage.locator('button.slot-target[data-slot-id]');
    const values = () => grid.evaluateAll(nodes => nodes.map(n => n.getAttribute('aria-label').split('，').at(-1)));
    await act(grid.nth(0)); await act(grid.nth(2)); await act(grid.nth(2));
    const before = await values();
    assert.equal(before.length, 16);
    await act(stage.getByRole('button', { name: '其余填空白' }));
    assert.equal((await values()).filter(v => v === '空白格').length, 15);
    await act(stage.getByRole('button', { name: '撤销上一步' }));
    assert.deepEqual(await values(), before);
    return { cells: 16, previouslyMarked: 2, filledAtOnce: 14, restoredByOneUndo: true };
  }

  async function checkPhonics() {
    const samples = [];
    for (let number = 1; number <= 6; number++) {
      const round = await showGroupRound('character-phonics', number);
      const labels = await choices.evaluateAll(nodes => nodes.map(n => n.getAttribute('aria-label')));
      const listening = number > 3;
      assert.deepEqual(labels, round.tokens.map((t, i) => listening ? `第 ${i + 1} 张字卡` : t.label));
      await page.evaluate(() => {
        delete document.documentElement.dataset.lastSpeechSource;
        window.optionAudio = { calls: [], ended: [] };
      });
      await act(choices.nth(0));
      if (listening) {
        // Let pending manifest lookups and a potential local play() start.
        await page.evaluate(() => new Promise(resolve => requestAnimationFrame(() => requestAnimationFrame(resolve))));
        assert.equal(await page.locator('html').getAttribute('data-last-speech-source'), null, round.id);
        assert.deepEqual(await page.evaluate(() => window.optionAudio.calls), [], round.id);
        samples.push({ round: number, labels, spoken: null });
      } else {
        await page.waitForFunction(() => window.optionAudio.ended.length > 0);
        const source = decodeURIComponent(await page.locator('html').getAttribute('data-last-speech-source'));
        assert.ok(source.endsWith('-' + round.tokens[0].label + '.mp3'), source);
        const file = source.split('/').at(-1);
        assert.deepEqual(await page.evaluate(() => window.optionAudio.ended), [file]);
        samples.push({ round: number, labels, spoken: file, ended: true });
      }
      await page.evaluate(() => { window.optionAudio = null; });
    }
    return samples;
  }

  try {
    await page.goto(url);
    const module = await page.locator('script[type="module"][src]').getAttribute('src');
    assert.match(module, /\/assets\/index-[^/]+\.js$/, 'Serve the production build for this check');
    await page.locator('.app-shell').waitFor({ timeout: 15000 });
    await act(page.getByTestId('section-exploration'));
    await checkPictures();
    await showGroupRound('rotation-reflection', 4);
    const scaleWidths = await stage.locator('.activity-evidence-board > img, .single-choice .activity-token-image')
      .evaluateAll(images => images.map(image => image.getBoundingClientRect().width));
    assert.ok(scaleWidths.length >= 4 && scaleWidths.every(w => Math.abs(w - scaleWidths[0]) <= 1));
    const construction = await checkConstruction();
    const grid = await checkGrid();
    const phonics = await checkPhonics();
    assert.deepEqual(errors, []);
    return { width, touch, productionModule: module, browser: browser.version(), pictureRounds: pictureGroups.reduce((n, g) => n + g.rounds.length, 0),
      directOptionPreviews: opened, groups: groupResults, equalScaleWidths: scaleWidths, construction, grid, phonics };
  } finally { await browser.close(); }
}

const runs = await Promise.allSettled([1280, 390].map(verifyWidth));
for (const run of runs) if (run.status === 'rejected') throw run.reason;
const results = runs.map(run => run.value);
assert.ok(results.every(r => r.pictureRounds === 105 && r.directOptionPreviews === 368));
await writeFile(new URL('./exploration-ui.json', import.meta.url), JSON.stringify({ results }, null, 2) + '\n');
console.log(JSON.stringify(results.map(r => ({ width: r.width, rounds: r.pictureRounds, opened: r.directOptionPreviews }))));
