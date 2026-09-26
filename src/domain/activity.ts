import type { GalleryImage } from "../data/imageGallery";
import type { AbilityLevel, GameConfig, WorldId } from "../types";
import type { AdvancedActivity, AdvancedResponse } from "./advanced-activity";

export type ActivityToken = { id: string; label: string; image: GalleryImage; soundSrc?: string; speechText?: string; textOnly?: boolean; moneyValues?: number[]; quantityPicture?: { image: GalleryImage; count: number } };
export type ComparisonPanel = { kind: 'dots'; label: string; count: number; columns: number }
  | { kind: 'placeValue'; label: string; tens: number; ones: number }
  | { kind: 'image'; label: string; image: GalleryImage };
export type TokenUse = "once" | "unlimited" | {kind:"counted"; limits:Record<string,number>};
export type SlotValue =
  | { state: "unfilled" }
  | { state: "filled"; tokenId: string };
export type ActivityResponse =
  | { kind: "multiSelect"; tokenIds: string[] }
  | { kind: "orderedPlacement"; slots: SlotValue[] }
  | { kind: "gridPlacement"; cells: Record<string, SlotValue> }
  | AdvancedResponse;

export type MemoryProtocol = {
  kind: "memory";
  observeMs: number;
  retainMs: number;
  /** Values in visible slot/cell order, not necessarily answer order. */
  preview: string[];
  audioText?: string;
  audioLocale?: "zh-CN" | "en-US";
  soundSrc?: string;
};
export type OrderRule =
  | { type: "before"; first: string; second: string; text: string }
  | { type: "immediatelyBefore"; first: string; second: string; text: string }
  | { type: "position"; tokenId: string; positions: number[]; text: string };

export type ActivityBase = {
  id: string;
  schemaVersion: 1;
  revision: number;
  primaryFamilyId: string;
  level: AbilityLevel;
  difficultyNote: string;
  prompt: string;
  instruction: string;
  clues: string[];
  tokens: ActivityToken[];
  hints: string[];
  success: string;
  retry: string;
  parentPrompt: string;
  abilityTags: string[];
  protocol: { kind: "practice" } | MemoryProtocol | {kind:"learnThenTransfer"; demonstration:string};
  sourceRefs: { sourceId: string; locator: string }[];
  illustration?: GalleryImage;
  presentation?: {
    readableEvidence?: boolean;
    compactSymbols?: boolean;
    folding?: { folds: ("right" | "down")[]; holeRow: number; holeColumn: number };
    pyramid?: { baseTokenIds: string[]; rowSizes: number[]; choiceIds: string[] };
    evidence?: { kind: "visualComparison"; panels: ComparisonPanel[] }
      | { kind: "moneyInventory"; fives: number; ones: number }
      | { kind: "rectangleSearch"; rows: number; columns: number }
      | { kind: "quantityStory"; parts: { label: string; count: number | null }[] }
      | { kind: "shopping"; cost: number; paid: number }
      | { kind: "overlapQueue"; left: number; right: number }
      | { kind: "collection"; count: number; image: GalleryImage; caption: string }
      | { kind: "storySequence"; cards: GalleryImage[] }
      | { kind: "calendar" };
    materialCards?: { label: string; image?: GalleryImage }[];
    storyCards?: GalleryImage[];
  };
  cluesFromIllustration?: boolean;
  stage?: 1 | 2 | 3;
  prerequisites?: string;
  difficulty?: { rules: number; steps: number; memory: number; representation: "pictures" | "symbols" | "physical"; reading: number; motor: number; basis?: string; calibration?: "design-estimate"; workload?: Record<string, number>; languageLocale?: string };
};
export type MultiSelectActivity = ActivityBase & {
  kind: "multiSelect";
  expectedTokenIds: string[];
  example?: ActivityToken;
};
export type OrderedActivity = ActivityBase & {
  kind: "orderedPlacement";
  slotCount: number;
  tokenUse: TokenUse;
  evaluation:
    | { kind: "sequence"; tokenIds: string[] }
    | { kind: "constraints"; rules: OrderRule[] };
};
export type GridActivity = ActivityBase & {
  kind: "gridPlacement";
  columns: number;
  /** null is an editable cell. A blank card has a real token ID. */
  cells: (string | null)[];
  tokenUse: TokenUse;
  evaluation:
    | { kind: "exact"; cells: Record<string, string> }
    | { kind: "latin"; tokenIds: string[] };
};
export type Activity = MultiSelectActivity | OrderedActivity | GridActivity | AdvancedActivity;
export type ActivitySet = Omit<GameConfig, "kind" | "rounds"> & {
  kind: "activitySet";
  rounds: Activity[];
  interactionLabel: string;
};
export type CatalogGame = GameConfig | ActivitySet;
export type CatalogLocation = {
  schemaVersion: 1;
  worldId: WorldId;
  gameId: string;
  roundId: string;
};

export const ACTIVITY_COPY = {
  incomplete: "还有空位没有放好，再看一看。",
  invalid: "这次摆放没有对上，请重新放一放。",
  noHistory: "先试着放一张图卡吧。",
  ready: "准备好以后，点开始记忆。看清图卡的位置和顺序。",
  remember: "先在脑海里想一想。",
  recall: "现在试着完成刚才的任务吧。",
  interrupted: "刚才暂停了。准备好以后，我们重新看一遍。",
  hintEnd: "线索都在这里了，试着一步一步检查。",
  latin: "再检查每一行和每一列，看看有没有重复或缺少的图卡。",
  once: "每张图卡只放一次，再检查一下。",
  inventory: "图卡的数量超过可用库存了，请先取下一张。",
  selectFirst: "先选一张图卡，再点空位。",
  readyVisual: "准备好了再开始。作答时也可以再看一次。",
  readyAudio: "准备好了再开始。作答时也可以再听一次。",
  readyTransfer: "先看懂例子里的规则，准备好后试一试新题。",
  interruptedAudio: "刚才暂停了。准备好以后，我们重新听一遍。",
  audioRetain: "声音已经停下了，先回想刚才听到的内容。",
  pyramidPartial: "目前摆好的图都符合规则。继续补完剩下的格子。",
  checkPyramid: "检查摆好的图",
  moneyStock: "手里的钱",
  rectangleGuide: "点一个角点，再点斜对面的角点，记下一个长方形。",
  rectangleDuplicate: "这个长方形已经记过了，不重复计数。",
  rectangleInvalid: "这两个点还不能围成长方形，请换一个斜对角点。",
  rectangleRecorded: "记下了。可以继续找，也可以点编号回看。",
  parentRecordNext: "做完了，记发现",
  designEstimate: "以上是陪玩起点建议，尚待真实亲子试玩校准，不对应固定年龄。",
  viewPicture: "看大图",
  closePicture: "回到题目",
  previousPicture: "上一张",
  nextPicture: "下一张",
} as const;

export function activitySlotLabel(activity: Activity, index: number): string {
  const pyramid = activity.presentation?.pyramid;
  if (pyramid) {
    let offset = 0;
    for (let level = 0; level < pyramid.rowSizes.length; level++) {
      if (index < offset + pyramid.rowSizes[level]) return `第${level + 1}层第${index - offset + 1}格`;
      offset += pyramid.rowSizes[level];
    }
  }
  return activity.kind === 'gridPlacement' ? `第${Math.floor(index / activity.columns) + 1}行第${index % activity.columns + 1}格` : `第${index + 1}个位置`;
}
export function pyramidMismatch(activity: Activity, index: number): string {
  return `${activitySlotLabel(activity, index)}还没对上。对照它下面相邻的两张图，再试试。`;
}

export function activityPromptSpeech(activity: Activity) {
  return [...(activity.protocol.kind === "learnThenTransfer" ? [activity.protocol.demonstration] : []),activity.prompt, activity.instruction, ...activity.clues]
    .join("。")
    .replace(/[。？！]。/g, "。");
}

export function activitySlots(
  activity: Activity,
): { id: string; index: number; fixedTokenId: string | null }[] {
  if (activity.kind !== "orderedPlacement" && activity.kind !== "gridPlacement") return [];
  if (activity.kind === "orderedPlacement") {
    return Array.from({ length: activity.slotCount }, (_, index) => ({
      id: `slot-${index}`,
      index,
      fixedTokenId: null,
    }));
  }
  return activity.cells.map((fixedTokenId, index) => ({
    id: `cell-${index}`,
    index,
    fixedTokenId,
  }));
}
