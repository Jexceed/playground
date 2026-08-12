import { readFile, readdir, stat } from "node:fs/promises";
import { homedir } from "node:os";
import { join, resolve } from "node:path";

const appId = "tta51dd3a03b67523202";
const projectPath = resolve("doyingame/build/bytedance-mini-game");
const gameConfigPath = join(projectPath, "game.json");
const logDirectory = join(homedir(), "Library/Application Support/@byted/vela/tempFile");
const gameConfig = JSON.parse(await readFile(gameConfigPath, "utf8"));
if (gameConfig.deviceOrientation !== "landscape") throw new Error("Douyin output is not landscape");

const candidates = (await readdir(logDirectory))
  .filter((name) => /^compiler-\d+\.log$/.test(name))
  .map((name) => join(logDirectory, name));
const logs = await Promise.all(candidates.map(async (path) => ({ path, mtimeMs: (await stat(path)).mtimeMs, text: await readFile(path, "utf8") })));
const matching = logs
  .filter((entry) => entry.text.includes(`input: '${projectPath}'`) && entry.text.includes(`"appid":"${appId}"`))
  .sort((left, right) => right.mtimeMs - left.mtimeMs)[0];
if (!matching) throw new Error("No Douyin DevTools compile log was found for the current project and AppID");

const latestSuccess = matching.text.lastIndexOf('"result":"success"');
const latestFailure = Math.max(matching.text.lastIndexOf("Panic occurred at runtime"), matching.text.lastIndexOf('"result":"fail"'));
if (latestSuccess < 0 || latestFailure > latestSuccess) {
  throw new Error("The latest Douyin DevTools compile did not finish successfully");
}
const buildTime = (await stat(gameConfigPath)).mtimeMs;
const logBeforeSuccess = matching.text.slice(0, latestSuccess);
const timestampMatches = [...logBeforeSuccess.matchAll(/\[(\d{4}-\d{2}-\d{2} \d{2}:\d{2}:\d{2})\]/g)];
const latestTimestamp = timestampMatches.at(-1)?.[1];
const successTime = latestTimestamp ? new Date(`${latestTimestamp.replace(" ", "T")}+08:00`).getTime() : 0;
if (!Number.isFinite(successTime) || successTime + 1_000 < buildTime) throw new Error("Douyin DevTools success log predates the current Cocos build; compile again");

console.log(JSON.stringify({
  project: projectPath,
  appId,
  deviceOrientation: gameConfig.deviceOrientation,
  compileLog: matching.path,
  compilationFinished: true,
}, null, 2));
