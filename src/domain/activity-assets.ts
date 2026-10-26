import type { Activity } from './activity';
import { imageGallery } from '../data/imageGallery';
import { MATH_EVIDENCE_KINDS } from './math-evidence';

/** Readiness depends on rendered media, not historical diagram references. */
export function activityImageSources(activity: Activity): string[] {
  const sources = new Set<string>();
  const items = imageGallery.items;
  const evidence = activity.presentation?.evidence;
  const money = () => { sources.add(items.mathPlayNote.src); sources.add(items.mathPlayCoin.src); };
  for (const token of activity.tokens) {
    if (token.partitionCounts) sources.add(items.patternBlueDisc.src);
    else if (token.moneyValues) money();
    else if (token.quantityPicture) {
      sources.add(token.quantityPicture.image.src);
      sources.add(items.patternBlueDisc.src);
    } else if (!token.textOnly) sources.add(token.image.src);
  }
  if (activity.kind === 'network') sources.add(items.art052Island.src);
  if (evidence?.kind === 'numberWalk') {
    sources.add(imageGallery.characters.rabbit.src);
    sources.add(imageGallery.characters.dog.src);
  }
  if (evidence?.kind === 'ruleMachine')
    for (const image of [items.patternBlueDisc, items.patternYellowDisc, items.rulePlayMachine, items.rulePlayTray]) sources.add(image.src);
  if (evidence?.kind === 'cardFlip')
    for (const image of [items.rulePlayCardWhite, items.rulePlayCardYellow]) sources.add(image.src);
  if (evidence?.kind === 'sharingModel') {
    if (evidence.mode === 'share')
      for (const image of [items.cookie, items.child, items.plate]) sources.add(image.src);
    else sources.add(items.patternBlueDisc.src);
  }
  if (evidence?.kind === 'waterModel')
    for (const image of [items.mathWaterTall, items.mathWaterWide]) sources.add(image.src);
  if (evidence?.kind === 'moneyExchange' || evidence?.kind === 'moneyInventory' || evidence?.kind === 'shopping') money();
  if (evidence?.kind === 'shopping') sources.add(items.book.src);
  if (evidence?.kind === 'quantityStory') sources.add(items.bird.src);
  if (evidence?.kind === 'overlapQueue') sources.add(imageGallery.characters.rabbit.src);
  if (evidence?.kind === 'collection') sources.add(evidence.image.src);
  if (evidence?.kind === 'storySequence') for (const image of evidence.cards) sources.add(image.src);
  if (evidence?.kind === 'visualComparison') for (const panel of evidence.panels) {
    if (panel.kind === 'image') sources.add(panel.image.src);
    if (panel.kind === 'dots') sources.add(items.patternBlueDisc.src);
  }
  for (const image of activity.presentation?.storyCards ?? []) sources.add(image.src);
  for (const card of activity.presentation?.materialCards ?? []) if (card.image) sources.add(card.image.src);
  const replacesIllustration = evidence && (MATH_EVIDENCE_KINDS.has(evidence.kind) || [
    'visualComparison', 'rectangleSearch', 'moneyInventory', 'quantityStory', 'shopping',
    'overlapQueue', 'collection', 'storySequence', 'calendar',
  ].includes(evidence.kind));
  if (activity.illustration && !replacesIllustration) sources.add(activity.illustration.src);
  if (activity.kind === 'multiSelect' && activity.example) sources.add(activity.example.image.src);
  return [...sources];
}
