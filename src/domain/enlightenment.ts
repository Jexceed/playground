import type { GameConfig, GameRound } from "../types";
import { FAIR_SHARE_COPY } from "./fair-share";

export type ObservationPhase = "ready" | "observing" | "answering";
export type ObservationEvent = "start" | "hide" | "review" | "interrupt";

export const ENLIGHTENMENT_COPY = {
  prepare: "准备好了，看两秒",
  peek: "再看一眼",
  reviewMemory: "重新看图",
  hideMemory: "遮住再答",
  observeFirst: "先看一看，遮住以后再选答案。",
  ready: "准备好再看，图卡会显示两秒。",
  observing: "先看图，遮住后再选。",
  answering: "图卡遮住了，想一想再选。也可以再看一次。",
} as const;

export function initialObservationPhase(round: Pick<GameRound, "observation" | "memory">): ObservationPhase {
  return round.observation ? "ready" : round.memory ? "observing" : "answering";
}

const memoryObservationPrompt = {
  prompt: "记住这些图卡。",
  instruction: "从左往右看一遍，记好了就点“遮住再答”。",
};

export function enlightenmentPromptForPhase(round: Pick<GameRound, "prompt" | "instruction" | "memory">, phase: ObservationPhase) {
  return round.memory && phase !== "answering" ? memoryObservationPrompt : round;
}

/** The desktop/web sharing board accepts physical placements. Other (exported) players can keep the numerical choice. */
export function enlightenmentPromptSpeech(
  gameId: string,
  round: Pick<GameRound, "prompt" | "instruction" | "memory" | "observation">,
  phase = initialObservationPhase(round),
): string {
  const displayed = enlightenmentPromptForPhase(round, phase);
  const prompt = displayed.prompt.trim();
  const separator = /[。？！]$/.test(prompt) ? "" : "。";
  return prompt + separator + displayed.instruction + (gameId === "math-fair-share" ? FAIR_SHARE_COPY.tap : "");
}

export function observationTransition(phase: ObservationPhase, event: ObservationEvent, timed: boolean): ObservationPhase {
  if (event === "interrupt") return timed && phase === "observing" ? "ready" : phase;
  if (event === "review") return timed ? "ready" : "observing";
  if (event === "start") return "observing";
  return phase === "observing" ? "answering" : phase;
}

export function completedGameRounds(game: GameConfig, completedIds: ReadonlySet<string>) {
  return game.rounds.filter(round => completedIds.has(round.id));
}

/** Replay follows question order; history only decides where to go at the end. */
export function nextEnlightenmentRoundIndex(game: Pick<GameConfig, "rounds">, currentIndex: number, completedIds: ReadonlySet<string>): number | null {
  if (currentIndex < game.rounds.length - 1) return currentIndex + 1;
  const firstIncomplete = game.rounds.findIndex(round => !completedIds.has(round.id));
  return firstIncomplete < 0 ? null : firstIncomplete;
}

/** Balanced positions, stable per group, without repeating a fixed answer cycle. */
export function answerPositionSchedule(length: number, choices: number, key: string): number[] {
  if (choices < 2) return Array(length).fill(0);
  let seed = 2166136261;
  for (const character of key) seed = Math.imul(seed ^ character.charCodeAt(0), 16777619);
  const random = (limit: number) => {
    seed ^= seed << 13; seed ^= seed >>> 17; seed ^= seed << 5;
    return (seed >>> 0) % limit;
  };
  const offset = random(choices);
  const base = Array.from({ length }, (_, i) => (i + offset) % choices);
  for (let attempt = 0; attempt < 256; attempt++) {
    const result = [...base];
    for (let i = result.length - 1; i > 0; i--) {
      const j = random(i + 1);
      [result[i], result[j]] = [result[j], result[i]];
    }
    const longRun = result.some((value, i) => i >= 2 && value === result[i - 1] && value === result[i - 2]);
    const cycle = length >= choices * 2 && result.every((value, i) => i < choices || value === result[i - choices]);
    if (!longRun && !cycle) return result;
  }
  throw new Error(`Cannot arrange answer positions for ${key}`);
}
