import type { GalleryImage } from "./imageGallery";

/** Each generated atlas is one source asset. Frame coordinates are explicit and auditable. */
function story(name: string, captions: string[], columns = 2, rows = 2): GalleryImage[] {
  return captions.map((alt, index) => ({ src: `/images/items/exploration-art/${name}.png`, alt, frame: { columns, rows, index }, style: "illustration" }));
}
export const explorationArt = {
  catPlant: story("cat-plant-story", ["小猫收到种子", "小猫把种子种进土里", "小猫按记录照顾小苗", "小猫观察新叶片"]),
  bearTower: story("bear-tower-story", ["小熊准备木块", "小熊搭起高塔", "球碰倒了高塔", "小熊换宽底座重搭"]),
  rain: story("rain-story", ["天上积起乌云", "开始下雨", "地面留下水洼", "小朋友穿雨靴出门"]),
  plantGrowth: story("plant-growth", ["种子在土里", "先长出根", "小芽出土", "叶片展开"]),
  butterflyGrowth: story("butterfly-growth", ["毛毛虫吃叶子", "形成蛹", "蝴蝶出来", "蝴蝶展开翅膀"]),
  frogGrowth: story("frog-growth", ["水里有卵", "孵出蝌蚪", "蝌蚪长出后腿", "小青蛙尾巴变短"]),
  tools: story("everyday-tools", ["雨伞", "毛巾", "圆头剪刀", "颜料和画笔"]),
  fruitSalad: story("fruit-salad-steps", ["洗净水果", "把水果切块", "把果块装碗", "一起品尝"]),
  painting: story("painting-steps", ["准备画纸", "画出轮廓", "给画涂色", "把画晾干"]),
  planting: story("planting-steps", ["取花盆", "放土和种子", "轻轻浇水", "等待发芽"]),
  experimentMaterials: story("experiment-materials", ["木块", "塑料盒", "金属勺", "一盆浅水"]),
  memoryEvents: story("memory-event-stories", ["带苹果出门", "在树下等雨停", "和小猫分苹果", "找来木板", "合作放好木板", "走过小桥"], 3, 2),
  everydayActions: story("everyday-actions", ["喝水", "画线", "擦干", "挡雨", "遮阳", "装饭", "拼搭", "阅读", "量长度"], 3, 3),
  parentMaterials: story("parent-materials", ["圆柱形积木", "方积木", "透明杯", "不透明袋", "布片", "小托盘", "手电筒", "橡皮泥", "塑料切刀"], 3, 3),
  craftMaterials: story("craft-materials", ["白纸", "彩笔", "透明彩色片", "软垫"]),
};
export const explorationArtImages: Record<string, GalleryImage> = Object.fromEntries(Object.entries(explorationArt).flatMap(([name, frames]) => frames.map((frame, index) => [`${name}${index + 1}`, frame])));
