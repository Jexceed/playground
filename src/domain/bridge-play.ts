import { enlightenmentBridgeModels } from '../data/enlightenmentBridges';

export type BridgeModel = { width: number; supports: readonly number[]; lengths: readonly number[] };
export type BridgePlacement = Array<number | null>;
export type BridgeAttempt = { ready: boolean; valid: boolean; feedback: string };
export type MeasurePoint = 'bear' | 'left-bank' | 'right-bank' | 'plank' | 'flag';
export const BRIDGE_STAGE_WIDTH = 720;
export const BRIDGE_PLAY_UNIT = 56;
export const measurePointLabels: Record<MeasurePoint, string> = {
  bear: '小熊', 'left-bank': '这边岸', 'right-bank': '那边岸', plank: '木板', flag: '小旗',
};
export const bridgePlayCopy = {
  choose: '先选木板，再点河上的空位。',
  secondPoint: '再点一个地方，连出要量的距离。',
  sameUnit: '每小格一样长',
  clear: '清空重搭', redo: '再搭一次', remeasure: '重新量一量', replay: '再走一遍', check: '试试看',
  ready: '摆好了，可以试试看。',
  measureReady: '连好了，可以试试看。',
};

export function bridgeModelFor(id: string): BridgeModel | undefined {
  const match = id.match(/^logic-space-bridge-([1-8])$/);
  return match ? enlightenmentBridgeModels[Number(match[1]) - 1] : undefined;
}
export function bridgeGaps(model: BridgeModel) {
  const stops = [0, ...model.supports, model.width];
  return stops.slice(1).map((end, index) => ({ start: stops[index], end, width: end - stops[index] }));
}
export function emptyBridge(model: BridgeModel): BridgePlacement { return bridgeGaps(model).map(() => null); }
export function bridgeMaterialLabel(model: BridgeModel, index: number) {
  const length = model.lengths[index];
  return model.lengths.filter(value => value === length).length > 1
    ? `第${index + 1}块 ${length} 格木板` : `${length} 格木板`;
}
export function bridgeGapLabel(model: BridgeModel, index: number) {
  return model.supports.length ? (index === 0 ? '左边' : '右边') : '这里';
}
/** Moving a physical piece frees its previous slot; replacing returns the old piece. */
export function placeBridgeWood(model: BridgeModel, placements: BridgePlacement, gap: number, wood: number): BridgePlacement {
  if (!Number.isInteger(gap) || gap < 0 || gap >= bridgeGaps(model).length || !Number.isInteger(wood) || wood < 0 || wood >= model.lengths.length) return placements;
  return placements.map((value, index) => index === gap ? wood : value === wood ? null : value);
}
export function bridgePlacementAttempt(model: BridgeModel, placements: BridgePlacement): BridgeAttempt {
  const ready = placements.some(value => value !== null);
  const used = placements.filter((value): value is number => value !== null);
  if (placements.length !== bridgeGaps(model).length || used.some(value => !Number.isInteger(value) || value < 0 || value >= model.lengths.length) || new Set(used).size !== used.length) {
    return { ready, valid: false, feedback: '每块木板只能放一处，拿回来再试试。' };
  }
  for (const [index, gap] of bridgeGaps(model).entries()) {
    const wood = placements[index];
    const where = bridgeGapLabel(model, index);
    if (wood === null) return { ready, valid: false, feedback: `${where}还没有桥。选一块木板放上去。` };
    const missing = gap.width - model.lengths[wood];
    if (missing > 0) return { ready, valid: false, feedback: `${where}还差 ${missing} 格。换一块长些的木板试试。` };
  }
  return { ready, valid: true, feedback: '每一段都连上了，木板两头都有支点。' };
}
export function measureBridgeAttempt(points: MeasurePoint[]): BridgeAttempt {
  const valid = points.length === 2 && new Set(points).size === 2 && points.includes('left-bank') && points.includes('right-bank');
  return { ready: points.length === 2, valid, feedback: valid ? '要量的是两岸之间的距离。' : '看看木板要跨过哪里，再点两个地方。' };
}
export function chooseMeasurePoint(points: MeasurePoint[], point: MeasurePoint): MeasurePoint[] {
  if (points.length === 1 && points[0] === point) return [];
  return points.length === 1 ? [...points, point] : [point];
}
export function bridgePlayLayout(model: BridgeModel) {
  const left = (BRIDGE_STAGE_WIDTH - model.width * BRIDGE_PLAY_UNIT) / 2;
  return { left, right: left + model.width * BRIDGE_PLAY_UNIT, unit: BRIDGE_PLAY_UNIT,
    gaps: bridgeGaps(model).map(gap => ({ ...gap, x: left + gap.start * BRIDGE_PLAY_UNIT, pixels: gap.width * BRIDGE_PLAY_UNIT })) };
}
export function placedBridgeShape(model: BridgeModel, gapIndex: number, woodIndex: number) {
  const layout = bridgePlayLayout(model), gap = layout.gaps[gapIndex], length = model.lengths[woodIndex];
  // Meet at the island instead of hiding one board's grid under the other.
  // Excess length rests on the outer banks. Keep oversized failed trials visible.
  const overhang = Math.max(0, length - gap.width) * layout.unit;
  const x = model.supports.length
    ? gap.x - (gapIndex === 0 ? overhang : 0)
    : gap.x - overhang / 2;
  const width = length * layout.unit;
  return { x: Math.min(BRIDGE_STAGE_WIDTH - 14 - width, Math.max(14, x)), width, length };
}
/** Export the complete finite set of spoken interaction lines, including errors. */
export function bridgePlayVoiceLines(): string[] {
  const lines = new Set<string>([...Object.values(bridgePlayCopy), ...Object.values(measurePointLabels), measureBridgeAttempt(['bear','plank']).feedback, measureBridgeAttempt(['left-bank','right-bank']).feedback]);
  for (const model of enlightenmentBridgeModels) {
    model.lengths.forEach((_, index) => lines.add(bridgeMaterialLabel(model, index)));
    for (const a of [null,0,1,2]) for (const b of [null,0,1,2]) {
      lines.add(bridgePlacementAttempt(model, model.supports.length ? [a,b] : [a]).feedback);
    }
  }
  return [...lines];
}
