import { loadTypeScriptModule } from "./load-ts-module.mjs";

export async function loadGameData() {
  const catalog = await loadTypeScriptModule("src/curriculum/catalog.ts");
  // Existing exporters deliberately retain their legacy question semantics.
  return { ...catalog, games: catalog.legacyGames };
}
