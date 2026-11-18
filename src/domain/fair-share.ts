import type { BoardAttempt, GameRound } from "../types";

export const FAIR_SHARE_COPY = {
  tap: "点小朋友的盘子，每次分一块。",
  guide: "点小朋友的盘子，给他一块蛋糕。想拿回来，就点盘子下面的拿回一块。",
  more: "还够给每个小朋友再分一块。再轮流分一圈吧。",
  uneven: "看看每个盘子，哪盘多，哪盘少？可以把多的拿回来，再分一次。",
  done: "分好了，每个人一样多。",
  reset: "重新分",
} as const;

export function fairShareInventory(round: GameRound) {
  const [cakes, children] = round.visualGroups!;
  return { total: cakes.items.length, children: children.items.length };
}

export function checkFairShare(total: number, plates: readonly number[]): BoardAttempt {
  const ready = plates.some(count => count > 0);
  const even = plates.every(count => count === plates[0]);
  if (!even) return { ready, valid: false, feedback: FAIR_SHARE_COPY.uneven };
  const valid = ready && plates[0] === Math.floor(total / plates.length);
  return { ready, valid, feedback: valid ? FAIR_SHARE_COPY.done : FAIR_SHARE_COPY.more };
}
