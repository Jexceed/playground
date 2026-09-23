import type { GalleryImage } from "../data/imageGallery";
import type { AbilityLevel, GameConfig, WorldId } from "../types";
import type { AdvancedActivity, AdvancedResponse } from "./advanced-activity";

export type ActivityToken = { id: string; label: string; image: GalleryImage; soundSrc?: string; speechText?: string; textOnly?: boolean; quantityPicture?: { image: GalleryImage; count: number } };
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
    compactSymbols?: boolean;
    evidence?: { kind: "quantityStory"; parts: { label: string; count: number | null }[] }
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
  difficulty?: { rules: number; steps: number; memory: number; representation: "pictures" | "symbols" | "physical"; reading: number; motor: number };
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
} as const;

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
