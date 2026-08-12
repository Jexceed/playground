import { readFile } from "node:fs/promises";
import ts from "typescript";

export async function loadGameData() {
  const imageGallerySource = await readFile("src/data/imageGallery.ts", "utf8");
  const imageGalleryOutput = ts.transpileModule(imageGallerySource, {
    compilerOptions: { module: ts.ModuleKind.ES2020, target: ts.ScriptTarget.ES2020 },
  }).outputText;
  const imageGalleryModuleUrl = toDataModule(imageGalleryOutput);
  const { imageGallery } = await import(imageGalleryModuleUrl);

  const gamesSource = await readFile("src/data/games.ts", "utf8");
  const gamesOutput = ts.transpileModule(gamesSource, {
    compilerOptions: { module: ts.ModuleKind.ES2020, target: ts.ScriptTarget.ES2020 },
  }).outputText
    .replace('import { imageGallery } from "./imageGallery";', `const imageGallery = ${JSON.stringify(imageGallery)};`)
    .replace('import { imageGallery } from "./imageGallery.js";', `const imageGallery = ${JSON.stringify(imageGallery)};`)
    .replaceAll("../types", "data:text/javascript,export{}");
  const { games, worlds } = await import(toDataModule(gamesOutput));
  return { games, worlds, imageGallery };
}

function toDataModule(source) {
  return `data:text/javascript;base64,${Buffer.from(source).toString("base64")}`;
}
