import { card, fillGrid, stableChoiceOrder } from './helpers';
import { mosaic } from './draw';
import type { Activity } from '../../domain/activity';

export function pyramidActivity(index: number, base: number[][]): Activity {
  const levels: number[][][] = [];
  let lower = base;
  while (lower.length > 1) {
    const upper = lower.slice(0, -1).map((tile, i) => tile.map((bit, k) => bit ^ lower[i + 1][k]));
    levels.push(upper);
    lower = upper;
  }
  const expected = levels.flat(), key = (bits: number[]) => bits.join('');
  const candidates = [...new Map([
    ...expected,
    ...[0, 4, 8].map(k => expected[expected.length - 1].map((bit, i) => i === k ? 1 - bit : bit)),
    Array(9).fill(0),
  ].map(bits => [key(bits), bits])).values()];
  const choices = stableChoiceOrder(candidates, `pyramid-${index}`);
  const all = [...new Map([...choices, ...base].map(bits => [key(bits), bits])).values()];
  const id = (bits: number[]) => `pattern-${key(bits)}`;
  const tokens = all.map((bits, i) => card(id(bits), i < choices.length ? `图${i + 1}` : `底图${i - choices.length + 1}`, mosaic(bits)));
  const solution = expected.map(id);
  const a = fillGrid('G07', index, '从底层往上，把金字塔每一层都补完整。', tokens, 1, solution, solution.map((_, i) => i),
    '每一层的图都对上了。中间结果摆在图上，就可以逐层检查，不必全记在脑海里。',
    ['上面一张图由下方相邻的两张合成。', '只有一张有颜色的格子留下，两张都有颜色的格子变空白。']);
  a.instruction = '选一张图，再点问号格。每补一层，可以检查已摆好的图。图卡可以重复用。';
  a.hints = ['先补最靠近底层的一排，再向上一层一层看。', '逐格比较下方相邻两图：一个有色就留下，两个都有色就变白。'];
  a.revision = 2;
  a.presentation = { pyramid: { baseTokenIds: base.map(id), rowSizes: levels.map(row => row.length), choiceIds: choices.map(id) } };
  return a;
}
