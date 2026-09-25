import type { Activity, ActivitySet } from "../../domain/activity";
import { imageGallery, type GalleryImage } from "../../data/imageGallery";
import { explorationArt } from "../../data/explorationArt";

const items = imageGallery.items, characters = imageGallery.characters;
const concrete: Record<string, GalleryImage> = {
  小猫: characters.cat, 小狗: characters.dog, 小熊: characters.bear, 小兔: characters.rabbit,
  杯子: items.cup, 铅笔: items.pencil, 帽子: items.sunHat, 饭盒: items.lunchBox,
  积木: items.block, 书本: items.book, 尺子: items.ruler, 毛巾: explorationArt.tools[1], 雨伞: explorationArt.tools[0],
};
const storyPictures = Object.fromEntries([
  ...explorationArt.catPlant, ...explorationArt.bearTower, ...explorationArt.rain,
  ...explorationArt.plantGrowth, ...explorationArt.butterflyGrowth, ...explorationArt.frogGrowth,
  ...explorationArt.fruitSalad, ...explorationArt.painting, ...explorationArt.planting,
].map(image => [image.alt, image]));
storyPictures['把种子种进土里'] = explorationArt.catPlant[1];
storyPictures['按记录照顾小苗'] = explorationArt.catPlant[2];

function materials(activity: Activity): { label: string; image?: GalleryImage }[] {
  if (activity.kind !== "parentObservation") return [];
  const rules: [RegExp, GalleryImage][] = [
    [/积木/, items.block], [/木块/, explorationArt.experimentMaterials[0]],
    [/塑料盒/, explorationArt.experimentMaterials[1]], [/纸盒|盒子/, items.box],
    [/金属勺/, explorationArt.experimentMaterials[2]], [/一盆浅水/, explorationArt.experimentMaterials[3]],
    [/杯/, items.cup], [/剪刀/, explorationArt.tools[2]],
    [/颜料/, explorationArt.tools[3]], [/玩具/, items.toyCar], [/毛巾|擦水布/, explorationArt.tools[1]],
    [/图卡/, characters.cat], [/书|绘本/, items.book], [/笔/, items.pencil],
  ];
  return activity.materials.map(label => ({ label, image: rules.find(([pattern]) => pattern.test(label))?.[1] }));
}

/** Author-owned visual mappings; never render answer IDs or infer pictures from a score. */
export function presentExploration(group: ActivitySet): ActivitySet {
  for (const [i, activity] of group.rounds.entries()) {
    const family = activity.primaryFamilyId, variant = i % 3;
    const procedurePictures = family === 'L06' ? [explorationArt.planting, explorationArt.painting, explorationArt.fruitSalad][variant] : null;
    if (['A06','A07','L01','L07'].includes(family ?? '') && activity.kind === 'multiSelect') activity.presentation = { ...activity.presentation, compactSymbols: true };
    for (const token of activity.tokens) {
      const image = procedurePictures ? procedurePictures[Number(token.id.slice(4))]
        : concrete[token.label] ?? (['E03', 'P02'].includes(family ?? '') ? storyPictures[token.label] : undefined);
      if (image) { token.image = image; token.textOnly = false; }
    }
    if (activity.kind === "parentObservation") {
      activity.presentation = { ...activity.presentation, materialCards: materials(activity) };
      if (family === 'E03') activity.presentation.storyCards = [explorationArt.rain, explorationArt.bearTower, explorationArt.catPlant][variant];
      if (family === 'P02') activity.presentation.storyCards = [explorationArt.plantGrowth, explorationArt.butterflyGrowth, explorationArt.frogGrowth][variant];
    }
    if (family === 'N16') activity.presentation = { evidence: { kind: 'calendar' } };
    if (family === 'L06' && activity.stage === 3) {
      const reversed = [...activity.tokens].sort((a, b) => Number(b.id.slice(4)) - Number(a.id.slice(4)));
      activity.presentation = { evidence: { kind: 'storySequence', cards: reversed.map(token => ({ ...token.image, alt: token.label })) } };
    }
    if (family === 'A05' && variant === 2 && activity.kind === 'orderedPlacement') {
      const stages = [explorationArt.planting[1], explorationArt.planting[2], explorationArt.planting[3]];
      for (const token of activity.tokens) { const index = Number(token.id.slice(1)); token.image = stages[index]; token.textOnly = false; }
    }
    if (family === 'A09' && activity.protocol.kind === 'memory') {
      for (const [index, id] of activity.protocol.preview.entries()) {
        const token = activity.tokens.find(t => t.id === id)!;
        const friend = activity.tokens[index];
        token.quantityPicture = { image: friend.image, count: index + 2 + variant };
      }
    }
  }
  return group;
}
