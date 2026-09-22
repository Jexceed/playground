import { imageGallery } from "../../data/imageGallery";
import type { ActivityToken } from "../../domain/activity";

const item = imageGallery.items;
export const pilotTokens: Record<string, ActivityToken> = Object.fromEntries(
  [
    ["red-circle", item.thinkingRedCircle],
    ["red-square", item.thinkingRedSquare],
    ["red-triangle", item.thinkingRedTriangle],
    ["blue-circle", item.thinkingBlueCircle],
    ["blue-square", item.thinkingBlueSquare],
    ["blue-triangle", item.thinkingBlueTriangle],
    ["yellow-circle", item.thinkingYellowCircle],
    ["yellow-square", item.thinkingYellowSquare],
    ["yellow-triangle", item.thinkingYellowTriangle],
    ["blank-card", item.thinkingBlankCard],
    ["rabbit", imageGallery.characters.rabbit],
    ["cat", imageGallery.characters.cat],
    ["dog", imageGallery.characters.dog],
    ["bear", imageGallery.characters.bear],
    ["apple", item.apple],
    ["strawberry", item.strawberry],
    ["cookie", item.patternCookie],
    ["orange", item.orange],
  ].map(([id, image]) => {
    const asset = image as ActivityToken["image"];
    const names: Record<string, string> = {
      rabbit: "小兔",
      cat: "小猫",
      dog: "小狗",
      bear: "小熊",
      apple: "苹果",
      strawberry: "草莓",
      cookie: "饼干",
      orange: "橘子",
    };
    return [
      id,
      {
        id: id as string,
        label: names[id as string] ?? asset.alt,
        image: asset,
      },
    ];
  }),
);
export function tokens(...ids: string[]) {
  return ids.map((id) => pilotTokens[id]);
}
