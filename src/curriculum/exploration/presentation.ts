import type { Activity, ActivitySet } from "../../domain/activity";
import { imageGallery, type GalleryImage } from "../../data/imageGallery";
import { explorationArt } from "../../data/explorationArt";
import { image as diagram, picture, rect, symbol, transform, text, type Primitive } from './draw';

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
  const exact: Record<string, GalleryImage> = {
    '球': items.soccer, '方盒': items.box,
    '圆柱形积木': explorationArt.parentMaterials[0],
    '三到五块方积木': explorationArt.parentMaterials[1], '大积木': explorationArt.parentMaterials[1], '不透明积木': explorationArt.parentMaterials[1],
    '透明杯': explorationArt.parentMaterials[2], '不透明袋': explorationArt.parentMaterials[3], '布袋': explorationArt.parentMaterials[3],
    '布片': explorationArt.parentMaterials[4], '小托盘': explorationArt.parentMaterials[5],
    '手电筒': explorationArt.parentMaterials[6], '橡皮泥': explorationArt.parentMaterials[7], '家长操作的塑料切刀': explorationArt.parentMaterials[8],
    '纸': explorationArt.craftMaterials[0], '白纸': explorationArt.craftMaterials[0],
    '正方形纸': diagram(picture([rect(55,55,210,210,'#ffffff')],320,320), '正方形纸'),
    '彩笔': explorationArt.craftMaterials[1], '透明彩色片': explorationArt.craftMaterials[2], '软垫': explorationArt.craftMaterials[3],
    '纸条当小河': diagram(picture([rect(25,120,270,80,'#b4d8eb')],320,320), '代替小河的纸条'), '小玩具': items.toyCar,
  };
  const rules: [RegExp, GalleryImage][] = [
    [/积木/, items.block], [/木块/, explorationArt.experimentMaterials[0]],
    [/塑料盒/, explorationArt.experimentMaterials[1]], [/纸盒|盒子/, items.box],
    [/金属勺/, explorationArt.experimentMaterials[2]], [/一盆浅水/, explorationArt.experimentMaterials[3]],
    [/杯/, items.cup], [/剪刀/, explorationArt.tools[2]],
    [/颜料/, explorationArt.tools[3]], [/玩具/, items.toyCar], [/毛巾|擦水布/, explorationArt.tools[1]],
    [/书|绘本/, items.book], [/^铅笔$/, items.pencil],
  ];
  return activity.materials.map(label => ({ label, image: exact[label] ?? rules.find(([pattern]) => pattern.test(label))?.[1] }));
}

const nineFeatureCards = () => diagram(picture(Array.from({ length: 9 }, (_, i) => {
  const col = i % 3, row = Math.floor(i / 3), x = 12 + col * 194, y = 9 + row * 76;
  return [rect(x, y, 180, 66, '#ffffff'), ...transform(symbol(col, row).objects, .36, .36, x + 90 - 57.6, y + 33 - 57.6)];
}).flat(), 600, 240), '九张图卡：红、蓝、黄三种颜色，每种都有圆形、方形和三角形。');

const lineTemplate = () => {
  const thick = (x: number, y: number, x2: number, y2: number): Primitive => {
    const length = Math.hypot(x2 - x, y2 - y), dx = -(y2 - y) / length * 3, dy = (x2 - x) / length * 3;
    return { kind: 'polygon', points: [[x+dx,y+dy],[x2+dx,y2+dy],[x2-dx,y2-dy],[x-dx,y-dy]], fill:'#344555' };
  };
  return diagram(picture([rect(60,35,180,180,'#ffffff'), text(150,25,'直线',20), thick(150,48,150,202),
    rect(360,35,180,180,'#ffffff'),text(450,25,'折线',20),thick(388,52,505,111),thick(505,111,395,198)],600,230), '可照画的粗线模板：左边是直线，右边是折线。');
};

/** Author-owned visual mappings; never render answer IDs or infer pictures from a score. */
export function presentExploration(group: ActivitySet): ActivitySet {
  for (const [i, activity] of group.rounds.entries()) {
    const family = activity.primaryFamilyId, variant = i % 3;
    if (activity.kind === 'singleChoice' && ['N01','N02','N03','N05','N07','N10','N11','N12','N13','N14','N15'].includes(family ?? ''))
      activity.presentation = { ...activity.presentation, readableEvidence: true };
    const procedurePictures = family === 'L06' ? [explorationArt.planting, explorationArt.painting, explorationArt.fruitSalad][variant] : null;
    if (['A06','A07','L01','L07'].includes(family ?? '') && activity.kind === 'multiSelect') activity.presentation = { ...activity.presentation, compactSymbols: true };
    for (const token of activity.tokens) {
      const image = family === 'P01' && token.id.startsWith('use') ? explorationArt.everydayActions[variant * 3 + Number(token.id.slice(3))]
        : procedurePictures ? procedurePictures[Number(token.id.slice(4))]
        : concrete[token.label] ?? (['E03', 'P02'].includes(family ?? '') ? storyPictures[token.label] : undefined);
      if (image) { token.image = image; token.textOnly = false; }
    }
    if (activity.kind === "parentObservation") {
      activity.presentation = { ...activity.presentation, materialCards: materials(activity) };
      if (family === 'E03') activity.presentation.storyCards = [explorationArt.rain, explorationArt.bearTower, explorationArt.catPlant][variant];
      if (family === 'P02') activity.presentation.storyCards = [explorationArt.plantGrowth, explorationArt.butterflyGrowth, explorationArt.frogGrowth][variant];
      if (family === 'E04' && variant === 0) activity.presentation.storyCards = [
        { ...characters.rabbit, alt:'小兔' }, { ...items.river, alt:'小河边' }, { ...items.apple, alt:'苹果' }, explorationArt.tools[0],
      ];
      if (family === 'E04' && variant === 2) activity.illustration = { ...imageGallery.scenes.spilledWaterRoom, width:1200, height:675 };
      if (family === 'L07') activity.illustration = nineFeatureCards();
      if (family === 'P06' && variant === 0) activity.illustration = lineTemplate();
    }
    if (family === 'N16') activity.presentation = { evidence: { kind: 'calendar' } };
    if (family === 'L06' && activity.stage === 3) {
      const reversed = [...activity.tokens].sort((a, b) => Number(b.id.slice(4)) - Number(a.id.slice(4)));
      activity.presentation = { evidence: { kind: 'storySequence', cards: reversed.map(token => ({ ...token.image, alt: token.label })), tokenIds: reversed.map(token => token.id) } };
    }
    if (family === 'A05' && activity.kind === 'orderedPlacement') {
      const stages = variant === 2 ? [explorationArt.planting[1], explorationArt.planting[2], explorationArt.planting[3]]
        : explorationArt.memoryEvents.slice(variant * 3, variant * 3 + 3);
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
