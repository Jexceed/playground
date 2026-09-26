const prefix = '/images/items/exploration-art/';
const frameKey = image => `${image.src}#${image.frame?.index}`;

/** Match the image branches used by ActivityTokenArt, ActivityEvidence and ParentActivity. */
function renderedImages(activity) {
  const refs = [];
  const add = (image, surface, label = image?.alt) => { if (image?.src?.startsWith(prefix)) refs.push({ image, surface, label }); };
  const matchingIds = activity.kind === 'matching'
    ? new Set([...activity.leftIds, ...activity.rightIds, ...(activity.protocol.kind === 'memory' ? activity.protocol.preview : [])]) : null;
  for (const token of activity.tokens) {
    if (matchingIds && !matchingIds.has(token.id)) continue;
    if (token.textOnly || token.moneyValues || (activity.kind === 'singleChoice' && /^\d+$/.test(token.label))) continue;
    add(token.quantityPicture?.image ?? token.image, 'token', token.label);
  }
  const presentation = activity.presentation;
  if (!presentation?.evidence) add(activity.illustration, 'illustration');
  if (presentation?.evidence?.kind === 'storySequence')
    presentation.evidence.cards.forEach(image => add(image, 'evidence'));
  if (presentation?.evidence?.kind === 'collection') add(presentation.evidence.image, 'evidence');
  if (presentation?.evidence?.kind === 'visualComparison')
    presentation.evidence.panels.forEach(panel => { if (panel.kind === 'image') add(panel.image, 'evidence', panel.label); });
  if (activity.kind === 'parentObservation') {
    presentation?.storyCards?.forEach(image => add(image, 'story'));
    presentation?.materialCards?.forEach(card => add(card.image, 'material', card.label));
  }
  return refs;
}

export function collectIllustrationUsage(sets, gallery) {
  const frames = new Map();
  for (const [key, image] of Object.entries(gallery.items)) if (image.src.startsWith(prefix) && image.frame)
    frames.set(frameKey(image), { key, src: image.src, index: image.frame.index, columns: image.frame.columns, rows: image.frame.rows, alt: image.alt, references: [] });
  const problems = [];
  for (const group of sets) for (const [index, activity] of group.rounds.entries()) {
    for (const { image, surface, label } of renderedImages(activity)) {
      const frame = frames.get(frameKey(image));
      if (!frame || !image.frame) { problems.push(`${activity.id}: unregistered atlas frame ${frameKey(image)}`); continue; }
      if (frame.columns !== image.frame.columns || frame.rows !== image.frame.rows)
        problems.push(`${activity.id}: atlas geometry differs from registration for ${frameKey(image)}`);
      frame.references.push({ activityId: activity.id, family: activity.primaryFamilyId, gameId: group.id, groupTitle: group.title, world: group.world, round: index + 1, surface, label });
    }
  }
  const atlases = [...new Set([...frames.values()].map(f => f.src))].map(src => ({
    src, frames: [...frames.values()].filter(f => f.src === src).sort((a,b) => a.index - b.index),
  }));
  const unusedFrames = [...frames.values()].filter(f => !f.references.length).map(({ references, ...frame }) => frame);
  return { atlasCount: atlases.length, registeredFrameCount: frames.size, usedFrameCount: frames.size - unusedFrames.length, unusedFrames, problems, atlases };
}
