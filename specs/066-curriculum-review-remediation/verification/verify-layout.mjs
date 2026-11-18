// Run from the repository root. PLAYWRIGHT_MODULE can point to a Playwright
// index.mjs outside the project. CHROME_PATH selects a locally installed Chrome.
import assert from 'node:assert/strict';
import { mkdtemp, mkdir, rm, writeFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { createServer } from 'vite';
import { loadTypeScriptModule } from '../../../scripts/lib/load-ts-module.mjs';

const { chromium } = await import(process.env.PLAYWRIGHT_MODULE || 'playwright');
const { curriculumSections } = await loadTypeScriptModule('src/curriculum/catalog.ts');
const { authoringSolutions } = await loadTypeScriptModule('src/curriculum/exploration/index.ts');
const groups = new Map(curriculumSections.flatMap(s => s.games.map(g => [g.id, { g, section: s.id }])));
const cases = [
  ['math-counting-cardinality', 11, 18], ['math-group-counting', 10, 11],
  ['math-compare-equalize', 1, 12], ['logic-balance-swap', 1, 10],
  ['logic-difference-detective', 1, 12], ['logic-block-height-map', 10, 12],
  ['logic-visual-match', 7, 12], ['explore-recursive-composition', 4, 9],
  ['explore-grid-copy-reconstruction', 4, 6], ['explore-rotation-reflection', 5, 6],
];
const capture = new Set([
  '390-math-counting-cardinality-16', '390-logic-balance-swap-7',
  '360-logic-visual-match-9', '390-explore-recursive-composition-4',
  '390-explore-grid-copy-reconstruction-5', '1440-explore-rotation-reflection-6',
]);
const output = process.env.LAYOUT_OUTPUT_DIR || fileURLToPath(new URL('./', import.meta.url));
const widths = (process.env.LAYOUT_WIDTHS || '360,390,1440').split(',').map(Number);
const cache = await mkdtemp(join(tmpdir(), 'thinking-layout-vite-'));
const server = await createServer({ cacheDir: cache, logLevel: 'error', server: { host: '127.0.0.1', port: 0, hmr: false, watch: null } });
await server.listen();
const url = 'http://127.0.0.1:' + server.httpServer.address().port;
const browser = await chromium.launch({ executablePath: process.env.CHROME_PATH, args: ['--mute-audio'] });
const failures = [], results = [];
await mkdir(output, { recursive: true });

// Scroll only the document vertically. Locator.click() may also scroll a
// clipped parent sideways and make an otherwise unreachable card seem usable.
async function activate(page, locator, touch) {
  await locator.waitFor();
  const point = await locator.evaluate(async el => {
    const first = el.getBoundingClientRect();
    window.scrollTo({ top: window.scrollY + first.top + first.height / 2 - innerHeight / 2, behavior: 'instant' });
    await new Promise(resolve => requestAnimationFrame(resolve));
    const rect = el.getBoundingClientRect();
    const x = rect.left + rect.width / 2, y = rect.top + rect.height / 2;
    const target = document.elementFromPoint(x, y);
    return { x, y, disabled: el.disabled, hit: el.contains(target), target: target?.closest('button')?.textContent.trim() };
  });
  assert.ok(!point.disabled && point.hit, 'Unreachable control ' + locator + ' at ' + JSON.stringify(point));
  if (touch) await page.touchscreen.tap(point.x, point.y);
  else await page.mouse.click(point.x, point.y);
}

async function checkLegacy(stage, round) {
  const check = await stage.locator('.visual-groups').evaluate(container => {
    const problems = [], groups = [...container.querySelectorAll('.visual-group')];
    const rect = el => el.getBoundingClientRect();
    const fits = (el, outer) => rect(el).left >= rect(outer).left - 1 && rect(el).right <= rect(outer).right + 1;
    const sameRow = (a, b) => Math.abs(rect(a).top - rect(b).top) < 2 && rect(a).right <= rect(b).left + 1;
    if (!fits(container, container.closest('.round-board'))) problems.push('group grid is clipped by its board');
    for (const group of groups) {
      if (!fits(group, container)) problems.push('group outside board: ' + group.dataset.label);
      const cards = [...group.querySelectorAll('.object-row > button')];
      for (const card of cards) {
        if (!fits(card, group)) problems.push('object outside its group: ' + group.dataset.label);
        for (const image of card.querySelectorAll('.kid-illustration'))
          if (!fits(image, card)) problems.push('picture outside its own card: ' + group.dataset.label);
      }
      for (const [i, a] of cards.entries()) for (const b of cards.slice(i + 1)) {
        const x = Math.min(rect(a).right, rect(b).right) - Math.max(rect(a).left, rect(b).left);
        const y = Math.min(rect(a).bottom, rect(b).bottom) - Math.max(rect(a).top, rect(b).top);
        if (x > 1 && y > 1) problems.push('overlapping objects: ' + group.dataset.label);
      }
      if (group.dataset.label === '三张小卡' && !(sameRow(cards[0], cards[1]) && sameRow(cards[1], cards[2])))
        problems.push('three positional samples are not ordered horizontally');
    }
    const left = groups.find(g => ['左图','左边','天平左边'].includes(g.dataset.label));
    const right = groups.find(g => ['右图','右边','天平右边'].includes(g.dataset.label));
    if (left && right && !sameRow(left, right)) problems.push('left/right panels are not side by side');
    return { problems, counts: groups.map(g => g.querySelectorAll('.object-row > button').length) };
  });
  assert.deepEqual(check.problems, []);
  assert.deepEqual(check.counts, round.visualGroups.map(g => g.items.length));
}

async function checkScale(stage, round, number) {
  const outline = async locator => locator.evaluate(img => {
    const canvas = document.createElement('canvas');
    canvas.width = img.naturalWidth; canvas.height = img.naturalHeight;
    const ctx = canvas.getContext('2d'); ctx.drawImage(img, 0, 0);
    const { data } = ctx.getImageData(0, 0, canvas.width, canvas.height);
    let left = canvas.width, right = -1, top = canvas.height, bottom = -1;
    // Measure the grid pixels inside the image. The warm near-white canvas
    // background is deliberately present in both the reference and choices.
    for (let y = 0; y < canvas.height; y++) for (let x = 0; x < canvas.width; x++) {
      const i = (y * canvas.width + x) * 4;
      if (data[i + 3] < 200 || Math.max(data[i], data[i+1], data[i+2]) > 205) continue;
      left = Math.min(left, x); right = Math.max(right, x);
      top = Math.min(top, y); bottom = Math.max(bottom, y);
    }
    const rect = img.getBoundingClientRect();
    const scale = Math.min(rect.width / canvas.width, rect.height / canvas.height);
    return { width: (right-left+1)*scale, height: (bottom-top+1)*scale };
  });
  const reference = await outline(stage.locator('.activity-evidence-board > .activity-evidence-image'));
  const correctIndex = round.tokens.findIndex(t => t.id === round.answerId);
  const choice = await outline(stage.locator('.single-choice .activity-token-image').nth(correctIndex));
  assert.ok(reference.width > 35 && choice.width / reference.width > 1.48, 'horizontal enlargement is not visible');
  if (number === 5) assert.ok(Math.abs(choice.width / reference.width - choice.height / reference.height) < .02);
  else assert.ok(Math.abs(reference.height - choice.height) < 1, 'horizontal stretch changed the visible height');
  return { reference, choice };
}

async function run(width) {
  const touch = width < 700;
  const context = await browser.newContext({ viewport: { width, height: touch ? 844 : 960 }, isMobile: touch, hasTouch: touch, reducedMotion: 'reduce' });
  const page = await context.newPage();
  try {
    await page.goto(url);
    await page.locator('.app-shell').waitFor();
    const stage = page.locator('.game-stage');
    for (const [groupId, first, last] of cases) {
      const { g, section } = groups.get(groupId);
      await page.getByTestId('section-' + section).click();
      await page.getByTestId('world-' + g.world).click();
      if (await page.locator('.mobile-game-select select').isVisible()) await page.locator('.mobile-game-select select').selectOption(g.id);
      else await page.getByTestId('game-' + g.id).click();
      for (let n = first; n <= last; n++) {
        const round = g.rounds[n-1], key = width + '-' + round.id;
        try {
          const jump = page.locator('.round-jump').nth(n-1);
          if (!(await jump.getAttribute('class')).split(' ').includes('current')) await jump.click();
          if (section === 'exploration') {
            await page.locator('[data-activity-id="' + round.id + '"][data-phase="respond"]').waitFor();
            await stage.locator('.activity-actions > .activity-primary:enabled').waitFor();
          } else {
            await page.waitForFunction(({ id, n }) => document.querySelector('.progressive-game')?.dataset.game === id &&
              document.querySelector('.round-toolbar .eyebrow')?.innerText.includes('第 ' + n + ' /'), { id: groupId, n });
          }
          await stage.evaluate(e => Promise.all([...e.querySelectorAll('img')].map(i => i.decode())));
          // Navigation focuses the new stage on the next animation frame.
          await page.evaluate(() => new Promise(resolve => requestAnimationFrame(() => requestAnimationFrame(resolve))));
          if (capture.has(key)) await stage.screenshot({ path: join(output, key+'.jpg'), quality: 75 });
          const record = { width, id: round.id };
          if (section === 'enlightenment') {
            await checkLegacy(stage, round);
            await activate(page, page.getByTestId('answer-' + round.answer), touch);
            await stage.locator('[data-testid="check-answer"]:enabled').waitFor({ timeout: 1500 });
            await activate(page, page.getByTestId('check-answer'), touch);
            await stage.locator('.feedback.success').waitFor();
          } else {
            if (round.kind === 'gridPlacement') {
              const slots = Object.entries(authoringSolutions[round.id].cells);
              for (const [slot, value] of slots) {
                await activate(page, stage.locator('[data-token-id="' + value.tokenId + '"]'), touch);
                await activate(page, stage.locator('[data-slot-id="' + slot + '"]'), touch);
              }
              record.filled = slots.length;
            } else {
              record.scale = await checkScale(stage, round, n);
              await activate(page, stage.locator('.single-choice .activity-token').nth(round.tokens.findIndex(t => t.id === round.answerId)), touch);
            }
            await activate(page, stage.locator('.activity-actions > .activity-primary'), touch);
            await stage.locator('.activity-round[data-phase="complete"]').waitFor({ timeout: 2000 });
          }
          results.push(record);
        } catch (e) {
          failures.push({ width, id: round.id, error: String(e.message).slice(0,500) });
        }
      }
    }
  } finally {
    await context.close();
  }
}
try {
  await Promise.all(widths.map(run));
  const summary = { widths, rounds: new Set(results.map(r => r.id)).size, passed: results.length,
    completedGridSlots: results.reduce((n, r) => n + (r.filled || 0), 0), failures,
    scales: results.filter(r => r.scale), checkedRounds: cases };
  await writeFile(join(output, 'responsive-layout.json'), JSON.stringify(summary, null, 2)+'\n');
  console.log(JSON.stringify({ widths, passed: results.length, failed: failures.length, completedGridSlots: summary.completedGridSlots }));
  assert.equal(failures.length, 0, failures.slice(0,3).map(f => f.id+' '+f.error).join('\n'));
} finally {
  await browser.close();
  await server.close();
  await rm(cache, { recursive: true, force: true });
}
