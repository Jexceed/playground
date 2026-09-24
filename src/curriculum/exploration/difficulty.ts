import profiles from './difficulty-profiles.json';
import type { Activity, ActivitySet, OrderRule } from '../../domain/activity';

type Profile = Pick<NonNullable<Activity['difficulty']>, 'rules' | 'steps' | 'reading' | 'motor' | 'representation'> & { prerequisites: string; basis: string };
const table = profiles as Record<string, { selector: string; profiles: Profile[] }>;

function memoryItems(a: Activity): number {
  if (a.protocol.kind !== 'memory') return 0;
  if (a.protocol.preview.length) return a.protocol.preview.length;
  if (a.primaryFamilyId === 'A05') return a.stage === 1 ? 1 : 3;
  if (a.primaryFamilyId === 'A07') return a.stage === 1 ? 1 : 2;
  if (a.kind === 'orderedPlacement') return a.slotCount;
  if (a.primaryFamilyId === 'A08') return 4;
  if (a.protocol.audioLocale === 'en-US') return a.stage === 1 ? 1 : 2;
  return 0;
}

function irredundantBeforeCount(rules: OrderRule[]): number {
  const edges = rules.filter((r): r is Extract<OrderRule, { type: 'before' }> => r.type === 'before');
  return edges.filter((edge, omit) => {
    const pending = [edge.first], seen = new Set<string>();
    while (pending.length) {
      const current = pending.pop()!;
      if (current === edge.second) return false;
      if (seen.has(current)) continue;
      seen.add(current);
      edges.forEach((e, i) => { if (i !== omit && e.first === current) pending.push(e.second); });
    }
    return true;
  }).length;
}

/** Reviewed design estimates; never an age score or a claim about a child's ability. */
export function assessExploration(group: ActivitySet): ActivitySet {
  group.rounds.forEach((a, index) => {
    const config = table[a.primaryFamilyId];
    if (!config) throw Error(`Missing difficulty profile: ${a.primaryFamilyId}`);
    const selected = config.selector === 'activity-index' ? index : (a.stage ?? 1) - 1;
    const profile = config.profiles[selected];
    if (!profile) throw Error(`Missing activity load: ${a.id}`);
    const { prerequisites, ...load } = profile;
    const workload: Record<string, number> = {};
    if (a.kind === 'singleChoice' || a.kind === 'multiSelect') workload.candidates = a.tokens.length;
    if (a.kind === 'orderedPlacement') workload.slots = a.slotCount;
    if (a.kind === 'gridPlacement') workload.editableCells = a.cells.filter(x => x === null).length;
    if (a.kind === 'matching') workload.pairs = a.expectedPairs.length;
    if (a.kind === 'route' || a.kind === 'network') workload.edges = a.graph.edges.length;
    if (a.kind === 'construction') { workload.pieces = a.pieces.length; workload.targetCells = a.target.length; }
    if (a.kind === 'parentObservation') workload.observationItems = a.observations.length;
    if (a.presentation?.pyramid) workload.compositionLayers = a.presentation.pyramid.rowSizes.length;
    a.difficulty = { ...load, memory: memoryItems(a), calibration: 'design-estimate', workload };
    a.prerequisites = prerequisites;
    if (a.protocol.kind === 'memory' && a.protocol.audioLocale) a.difficulty.languageLocale = a.protocol.audioLocale;
    // The third story has pictures; the first two use written event phrases with voice support.
    if (a.primaryFamilyId === 'A05' && a.stage === 2) {
      a.difficulty.reading = index % 3 === 2 ? 0 : 2;
      a.difficulty.representation = index % 3 === 2 ? 'pictures' : 'symbols';
      a.difficulty.basis += index % 3 === 2 ? '；本题事件卡有图片支持。' : '；本题需要辨认事件短语，可听图卡语音辅助。';
    }
    if (a.primaryFamilyId === 'A08' && a.kind === 'parentObservation') {
      Object.assign(a.difficulty, { rules: 2, steps: 3, reading: 0, motor: 3, representation: 'physical', basis: '亲子节拍模仿与交换编创；包括保持长短/先后、身体动作和口述核对。' });
    }
    if (a.primaryFamilyId === 'G20' && a.kind === 'orderedPlacement' && a.evaluation.kind === 'constraints') {
      a.difficulty.rules = irredundantBeforeCount(a.evaluation.rules);
      a.difficulty.basis += `；本图${a.evaluation.rules.length}条可见先后关系，去除可推得关系后为${a.difficulty.rules}条。`;
    }
  });
  return group;
}
