import {
  games as legacyGames,
  worlds,
  patternTrainSizeDiameters,
} from "../data/games";
import { imageGallery } from "../data/imageGallery";
import { activitySets } from "./pilot/activities";
import type { CatalogGame } from "../domain/activity";

// The legacy bank stays authoritative until it is deliberately migrated.
// New activities are independent modules, never copied into GameRound.
export {
  legacyGames,
  worlds,
  imageGallery,
  activitySets,
  patternTrainSizeDiameters,
};
export type CurriculumSectionId = "enlightenment" | "exploration";
export type CurriculumSection = {
  id: CurriculumSectionId;
  name: string;
  summary: string;
  games: CatalogGame[];
};

// Section membership is a content decision, independent of the rendering engine.
export const curriculumSections: CurriculumSection[] = [
  { id: "enlightenment", name: "启蒙", summary: "看图发现，轻松起步", games: legacyGames },
  { id: "exploration", name: "探索", summary: "组合线索，多步思考", games: activitySets },
];
export function getCurriculumSection(id: CurriculumSectionId): CurriculumSection {
  return curriculumSections.find(section => section.id === id)!;
}
export const catalogGames: CatalogGame[] = curriculumSections.flatMap(section => section.games);
export const catalogVersion = "2026-09-22-sections";
export { activityVoiceLines } from "./activity-voice-lines";
