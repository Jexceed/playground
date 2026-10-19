import { enlightenmentBridgeModels } from "../data/enlightenmentBridges";
import type { GameRound, RoundOption } from "../types";

export type LogicChoicePictureModel =
  | { kind: "quantity"; count: number; item: string }
  | { kind: "height-profile"; heights: number[] }
  | { kind: "ordered-card"; value: string; position: number }
  | { kind: "category"; marker: "color"; color: string }
  | { kind: "category"; marker: "circle" | "square" };

/** Candidate values, never the answer, determine the picture. */
export function logicChoicePictureFor(gameId: string, round: GameRound, choice: RoundOption): LogicChoicePictureModel | null {
  if (gameId === "logic-balance-swap") {
    const match = choice.label.match(/^(\d+)\s*(?:个|颗)\s*(草莓|饼干|糖果|星星)$/);
    if (match && Number(match[1]) > 0 && Number(match[1]) <= 20) {
      return { kind: "quantity", count: Number(match[1]), item: match[2] };
    }
  }
  if (gameId === "logic-three-view-blocks" && /-(?:[7-9]|1[0-8])$/.test(round.id)) {
    const values = choice.label.split(/和|、/);
    if (values.length >= 2 && values.every(value => /^[0-3]$/.test(value))) {
      return { kind: "height-profile", heights: values.map(Number) };
    }
  }
  if (gameId === "logic-visual-match") {
    const position = ({ left: 0, middle: 1, right: 2 } as Record<string, number>)[choice.value];
    const value = round.visualGroups?.find(group => group.label === "三张小卡")?.items[position];
    if (value !== undefined) return { kind: "ordered-card", value, position };
  }
  if (gameId === "logic-sorter-switch") {
    const colors: Record<string, string> = { 红色篮子: "#e43b30", 蓝色篮子: "#298ac7", 绿色篮子: "#48a65c", 黄色篮子: "#efc330" };
    if (colors[choice.value]) return { kind: "category", marker: "color", color: colors[choice.value] };
    if (choice.value === "圆形篮子") return { kind: "category", marker: "circle" };
    if (choice.value === "方形篮子") return { kind: "category", marker: "square" };
  }
  return null;
}

export type BridgeCandidatePlank = { length: number; start: number; onShore?: boolean };
export type LogicBridgeChoiceModel = {
  width: number;
  supports: readonly number[];
  planks: BridgeCandidatePlank[];
  inventory?: readonly number[];
  measure?: "bear-plank" | "plank-flag" | "banks";
};

export const LOGIC_BRIDGE_UNIT = 20;

/** One viewport and one unit keep available wood comparable to the river. */
export function logicBridgeDiagramLayout(model: LogicBridgeChoiceModel) {
  const unit = LOGIC_BRIDGE_UNIT;
  const left = (320 - model.width * unit) / 2;
  const inventory = (model.inventory ?? []).map((length, index) => ({ length, x: 100, y: 182 + index * 38, width: length * unit, height: 18 }));
  return {
    unit,
    width: 320,
    height: inventory.length ? 182 + inventory.length * 38 : 172,
    left,
    right: left + model.width * unit,
    riverWidth: model.width * unit,
    inventory,
    planks: model.planks.map((piece, index) => ({
      ...piece,
      x: model.measure ? left + 20 : left + piece.start * unit,
      y: model.measure ? 119 : piece.onShore ? 36 + index * 32 : 56,
      width: piece.length * unit,
      height: 18,
    })),
  };
}

/** Coordinates and lengths use the river model's unit, including wrong plans. */
export function logicBridgeChoiceFor(round: GameRound, choice: RoundOption): LogicBridgeChoiceModel | null {
  const match = round.id.match(/^logic-space-bridge-(\d+)$/);
  if (!match) return null;
  const index = Number(match[1]) - 1;
  const model = enlightenmentBridgeModels[index];
  if (!model) return null;
  const result: LogicBridgeChoiceModel = { width: model.width, supports: model.supports, planks: [] };
  const single = (piece: number) => {
    const length = model.lengths[piece];
    result.planks = [{ length, start: Math.min(0, (model.width - length) / 2) }];
    return result;
  };
  const pair = (leftPiece: number, rightPiece: number) => {
    const support = model.supports[0];
    if (support === undefined) return null;
    const leftLength = model.lengths[leftPiece];
    result.planks = [
      { length: leftLength, start: Math.min(0, support - leftLength) },
      { length: model.lengths[rightPiece], start: support },
    ];
    return result;
  };
  if (index === 0) {
    const measure = ({ "guess-longest": "bear-plank", "try-nearest": "plank-flag", "river-width": "banks" } as const)[choice.value as "guess-longest" | "try-nearest" | "river-width"];
    return measure ? { ...result, measure, planks: [{ length: model.lengths[0], start: 0, onShore: true }] } : null;
  }
  if (index === 1) {
    if (choice.value === "same-length") return single(0);
    if (choice.value === "two-planks") return pair(0, 1);
    if (choice.value === "separate") return { ...result, planks: [0, 1].map(piece => ({ length: model.lengths[piece], start: -model.lengths[piece] - 0.25, onShore: true })) };
  }
  if (index === 2 || index === 5) {
    if (choice.value === "long-short") return pair(0, 1);
    if (choice.value === "short-tiny") return pair(1, 2);
    if (choice.value === "long-only") return single(0);
  }
  if (index === 3 || index === 6) {
    const piece = ({ long: 0, short: 1, tiny: 2 } as Record<string, number>)[choice.value];
    if (piece !== undefined) return single(piece);
  }
  if (index === 4) {
    if (choice.value === "two-planks") return pair(0, 1);
    if (choice.value === "long-only") return single(0);
    if (choice.value === "short-only") return single(1);
  }
  if (index === 7) {
    if (choice.value === "two-planks") return pair(1, 0);
    if (choice.value === "reversed") return pair(0, 1);
    if (choice.value === "long-only") return single(0);
  }
  return null;
}
