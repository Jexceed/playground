// Run against a served production build. Each viewport has its own empty browser storage.
import assert from 'node:assert/strict';

const url = process.env.PLAYGROUND_QA_URL || process.argv[2];
if (!url) throw new Error('Set PLAYGROUND_QA_URL to the production preview URL.');
const { chromium } = await import(process.env.PLAYWRIGHT_MODULE || 'playwright');
const browser = await chromium.launch({ executablePath: process.env.CHROME_PATH, args: ['--mute-audio'] });

async function verify(width) {
  const touch = width <= 760;
  const context = await browser.newContext({ viewport: { width, height: touch ? 844 : 880 }, hasTouch: touch, reducedMotion: 'reduce' });
  const page = await context.newPage();
  page.setDefaultTimeout(6000);
  const errors = [];
  page.on('pageerror', error => errors.push(error.message));
  const act = control => touch ? control.tap() : control.click();
  const search = page.getByRole('searchbox', { name: '查找当前主题题组' });
  const selector = page.locator('.mobile-game-select select');
  const list = page.locator('.sidebar-game-picker');
  const resultCount = list.locator('.sidebar-section-title span');
  const round = page.getByTestId('activity-round');
  const primary = round.locator('.activity-actions .activity-primary');
  const support = page.locator('.parent-support-disclosure');
  const summaries = {};

  async function openGame(id) {
    if (touch) await selector.selectOption(id);
    else await act(page.getByTestId('game-' + id));
  }

  async function checkEmptySearch() {
    const count = await resultCount.innerText();
    const selection = touch ? await selector.inputValue() : await list.locator('.game-chip.active').getAttribute('data-testid');
    const heading = await page.locator('.game-stage').getAttribute('aria-label');
    await search.fill('没有这个题组068');
    assert.equal(await resultCount.innerText(), '找到 0 组');
    await list.getByText(/当前主题没有匹配的题组/).waitFor();
    assert.equal(await selector.count(), 0);
    await act(list.getByRole('button', { name: '清空搜索' }));
    assert.equal(await search.inputValue(), '');
    assert.equal(await resultCount.innerText(), count);
    assert.equal(touch ? await selector.inputValue() : await list.locator('.game-chip.active').getAttribute('data-testid'), selection);
    assert.equal(await page.locator('.game-stage').getAttribute('aria-label'), heading);
    assert.ok(await search.evaluate(input => input === document.activeElement));
  }

  try {
    await page.goto(url);
    await page.locator('.app-shell').waitFor();
    for (const [section, worlds] of [
      ['enlightenment', ['math', 'logic', 'graphic']],
      ['exploration', ['math', 'logic', 'graphic', 'memory', 'language', 'life']],
    ]) {
      await act(page.getByTestId('section-' + section));
      summaries[section] = [];
      for (const world of worlds) {
        const button = page.getByTestId('world-' + world);
        await act(button);
        const summary = button.locator('small');
        await summary.waitFor();
        assert.equal(await button.getAttribute('aria-expanded'), 'true');
        const fit = await summary.evaluate(el => {
          const range = document.createRange();
          range.selectNodeContents(el);
          const card = el.closest('button').getBoundingClientRect();
          const lines = [...range.getClientRects()];
          return lines.length > 0 && lines.every(r => r.width > 0 && r.height > 0 && r.left >= card.left - 1 &&
            r.right <= card.right + 1 && r.top >= card.top - 1 && r.bottom <= card.bottom + 1);
        });
        assert.ok(fit, section + '/' + world + ' clipped at ' + width);
        assert.equal(await page.locator('.world-button.collapsed small:visible').count(), 0);
        summaries[section].push(await summary.innerText());
      }
      await checkEmptySearch();
    }

    await act(page.getByTestId('world-language'));
    const english = ['everyday-english-greetings', 'everyday-english-kind-words', 'everyday-english-asking'];
    for (const term of ['看图选句', '亲子对话']) {
      await search.fill(term);
      assert.equal(await resultCount.innerText(), '找到 3 组');
      const ids = touch
        ? await selector.locator('option:not([disabled])').evaluateAll(options => options.map(o => o.value))
        : await list.locator('.game-chip').evaluateAll(buttons => buttons.map(b => b.dataset.testid.slice(5)));
      assert.deepEqual(ids, english);
    }
    await openGame(english[0]);
    await search.fill('');
    assert.match(await page.locator('.activity-game-heading .eyebrow').innerText(), /看图选句/);
    const jump = n => act(page.getByRole('button', { name: new RegExp('^跳到第 ' + n + ' 题') }));
    await jump(2);
    assert.match(await page.locator('.activity-game-heading .eyebrow').innerText(), /亲子对话/);
    await act(support.locator('summary').first());

    const note = await support.locator('.activity-parent-note').innerText();
    assert.match(note, /自己做到了.*一起做到了.*下次再试/);
    assert.doesNotMatch(note, /做完了，记发现/);
    assert.equal(await primary.innerText(), '做完了，记发现');
    await act(round.getByRole('button', { name: '提示', exact: true }));
    await support.getByText('待记录亲子观察').waitFor();
    await act(round.getByRole('button', { name: '先跳过' }));
    await jump(2);
    assert.doesNotMatch(await support.locator('.activity-evidence').innerText(), /累计尝试|正在尝试/);
    await act(primary);
    await round.locator('.parent-record').waitFor();
    assert.equal(await primary.innerText(), '保存这次观察');
    assert.equal(await support.locator('.activity-parent-note').innerText(), note);
    for (const radio of await round.locator('.parent-observe-row input[value="supported"]').all()) await radio.check();
    await act(primary);
    await support.getByText('已记录亲子观察').waitFor();
    assert.equal(await support.locator('.activity-parent-note').innerText(), note);
    assert.doesNotMatch(await support.locator('.activity-evidence').innerText(), /累计尝试/);

    await act(page.getByTestId('world-logic'));
    await openGame('explore-transitive-order');
    await jump(7);
    const board = round.locator('.activity-evidence-board');
    const panels = board.locator(':scope > .visual-comparison > .comparison-panel');
    await panels.first().waitFor();
    assert.equal(await board.locator('.evidence-caption > span').innerText(), '对照两组线索');
    const positions = await panels.evaluateAll(xs => xs.map(x => {
      const { x: left, y: top } = x.getBoundingClientRect();
      return [Math.round(left), Math.round(top)];
    }));
    assert.equal(positions.length, 2);
    const [[x1, y1], [x2, y2]] = positions;
    assert.ok(touch ? x1 === x2 && y2 > y1 : y1 === y2 && x2 > x1);
    assert.deepEqual(errors, []);
    return { width, input: touch ? 'touch' : 'mouse', summaries, emptySearch: 'cleared in both sections',
      englishMatches: english, observationStages: ['play', 'record', 'complete'], comparisonPositions: positions };
  } finally {
    await context.close();
  }
}

try {
  const results = await Promise.all([verify(1280), verify(390)]);
  console.log(JSON.stringify({ browser: browser.version(), results }, null, 2));
} finally {
  await browser.close();
}
