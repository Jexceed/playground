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

export function orderStorySteps(round: GameRound, solved: boolean) {
  const answer = round.choices.find(choice => choice.value === round.answer)?.label;
  return (round.sequence ?? []).map(value => {
    const label = value === "?" && solved && answer ? answer : value;
    return {
      label: label === "?" ? "待补位置" : label === "🧒" ? "小朋友" : label,
      missing: label === "?",
      image: drinkingImage(label),
      filled: value === "?" && solved,
    };
  });
}
