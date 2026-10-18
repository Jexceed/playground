import { imageGallery } from "./imageGallery";
import type { GameRound, RoundSceneImage } from "../types";

const items = imageGallery.items;
const drinkingImages: Partial<Record<string, RoundSceneImage>> = {
  "口渴": items.drinkingThirsty,
  "🧒": items.drinkingThirsty,
  "杯子": items.drinkingTakeCup,
  "先拿杯子": items.drinkingTakeCup,
  "先倒水": items.drinkingPour,
  "倒水": items.drinkingPour,
  "直接喝水": items.drinkingDrink,
  "喝水": items.drinkingDrink,
  "再拿一个杯子": items.drinkingAnotherCup,
  "端空杯子过去": items.drinkingCarryEmpty,
};

export function drinkingImage(label: string) {
  return drinkingImages[label];
}

type StoryDefinition = {
  family: string;
  scene: string;
  images: Record<string, string>;
};

const snack = {
  "手脏": "dirty", "先洗手": "wash", "拿饼干": "take", "吃": "eat", "拿盘子": "plate",
  "先拿饼干": "dirtyTake", "先吃饼干": "dirtyEat", "先拿盘子": "dirtyPlate",
};
const tower = {
  "🧱倒了": "fallen", "先捡积木": "pick", "高塔": "tower",
  "先搭高塔": "build", "直接搭高塔": "build", "先放进盒子": "box",
};
const sorting = {
  "积木和小车": "mixed", "先分开两类": "sort", "分开放进盒子": "put",
  "分类装好": "done", "全放同一个盒子": "allOne", "只收一个玩具": "one",
  "分好的两类玩具": "sorted", "再分类一遍": "sortAgain",
};
const traffic = {
  "路口": "junction", "先看灯": "look", "🟢": "green", "绿灯": "green", "走过去": "cross",
  "🔴": "red", "红灯": "red", "停": "stop", "走": "directCross", "直接走过去": "directCross",
  "等别人先走": "waitOthers", "只看车停着": "carOnly",
};
const bridge = {
  "小河": "river", "先搭桥": "build", "走过去": "cross", "🥕": "carrot",
  "🏁": "flag", "先走进水里": "water", "直接走进水里": "water",
  "先拿胡萝卜": "reachCarrot", "站在岸边等": "wait",
};

// A token such as "走过去" has a different picture at a road and at a toy river.
// Resolve against the stable round identity, never a group-wide word guess.
const stories: Record<number, StoryDefinition> = {
  2: { family: "door", scene: "locked", images: {
    "门锁着": "locked", "用钥匙开锁": "unlock", "开门": "open", "进屋": "enter",
    "先推门": "push", "先敲门": "knock",
  } },
  3: { family: "fish", scene: "shore", images: {
    "小鱼在岸上": "shore", "轻轻放回水里": "return", "🌊": "swim",
    "继续看着": "watch", "拿杯子接水": "cup",
  } },
  4: { family: "plant", scene: "soil", images: {
    "只有土的花盆": "soil", "种下种子": "sow", "🌱": "sprout", "🌼": "flower",
    "只给空土浇水": "waterSoil", "直接等开花": "waitSoil",
  } },
  5: { family: "snack", scene: "dirty", images: snack },
  6: { family: "tower", scene: "fallen", images: tower },
  7: { family: "sorting", scene: "mixed", images: sorting },
  8: { family: "traffic", scene: "red", images: traffic },
  10: { family: "snack", scene: "dirty", images: snack },
  11: { family: "bridge", scene: "carrot", images: bridge },
  12: { family: "blocks", scene: "picked", images: {
    "🧱倒了": "fallen", "先捡积木": "pick", "先分类": "sort",
    "放进盒子": "put", "整齐": "done", "先搭高塔": "build", "先放进盒子": "mixedBox",
  } },
  13: { family: "writing", scene: "classroom", images: {
    "上课": "classroom", "铅笔": "pencil", "写字": "write", "书本": "book", "尺子": "ruler",
  } },
  14: { family: "packing", scene: "book", images: {
    "书本": "book", "书包": "bag", "去学校": "school", "饭盒": "lunch", "水壶": "bottle",
  } },
  15: { family: "rain", scene: "rain", images: {
    "下雨": "rain", "雨衣": "raincoat", "出门": "out", "帽子": "hat", "足球": "ball",
  } },
  16: { family: "snack", scene: "clean", images: {
    "饼干": "cookies", "拿盘子": "plate", "吃": "eat", "拿杯子": "cup", "拿文具盒": "pencilCase",
  } },
  17: { family: "snack", scene: "dirty", images: snack },
  19: { family: "traffic", scene: "red", images: traffic },
  20: { family: "traffic", scene: "red", images: traffic },
  21: { family: "tower", scene: "fallen", images: tower },
  22: { family: "bridge", scene: "flag", images: bridge },
  23: { family: "plant", scene: "dry", images: {
    "🌱": "drySprout", "先浇水": "waterSprout", "🌼": "flower",
    "先摘花": "pickFlower", "直接等开花": "waitSprout",
  } },
  24: { family: "sorting", scene: "sorted", images: sorting },
};

const stepLabels: Record<string, string> = {
  "🧒": "小朋友", "🌊": "小河", "🌱": "小芽", "🌼": "花",
  "🥕": "胡萝卜", "🏁": "小旗", "🔴": "红灯", "🟢": "绿灯", "🧱倒了": "积木倒了",
};

function storyNumber(round: Pick<GameRound, "id">) {
  const match = /^logic-order-plan-(\d+)$/.exec(round.id);
  return match ? Number(match[1]) : undefined;
}

export function orderStoryScene(roundNumber: number): RoundSceneImage {
  if (roundNumber === 1) return imageGallery.scenes.drinkingThirsty;
  if (roundNumber === 9 || roundNumber === 18) return imageGallery.scenes.drinkingEmptyCup;
  const story = stories[roundNumber];
  if (!story) throw new Error(`Missing order story: ${roundNumber}`);
  const image = (imageGallery.scenes as Record<string, RoundSceneImage>)[`order045_${story.family}_${story.scene}`];
  if (!image) throw new Error(`Unregistered order scene: ${roundNumber}`);
  return image;
}

export function orderStoryImage(round: Pick<GameRound, "id">, label: string) {
  const number = storyNumber(round);
  if (number === undefined) return undefined;
  if ([1, 9, 18].includes(number)) return drinkingImage(label);
  const story = stories[number];
  const card = story?.images[label];
  return card ? (imageGallery.items as Record<string, RoundSceneImage>)[`order045_${story.family}_${card}`] : undefined;
}

export function orderStorySteps(round: GameRound, solved: boolean) {
  const answer = round.choices.find(choice => choice.value === round.answer)?.label;
  return (round.sequence ?? []).map(value => {
    const label = value === "?" && solved && answer ? answer : value;
    return {
      label: label === "?" ? "待补位置" : stepLabels[label] ?? label,
      missing: label === "?",
      image: orderStoryImage(round, label),
      filled: value === "?" && solved,
    };
  });
}
