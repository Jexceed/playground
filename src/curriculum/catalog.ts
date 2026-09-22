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
export const catalogGames: CatalogGame[] = [...legacyGames, ...activitySets];
export const catalogVersion = "2026-09-22-pilot";
export { activityVoiceLines } from "./activity-voice-lines";
