import { existsSync, mkdirSync, writeFileSync } from 'node:fs';
import { dirname, basename, join, relative } from 'node:path';
import { loadGameData } from './lib/load-game-data.mjs';
import { collectIllustrationUsage } from './lib/illustration-usage.mjs';

const option = (flag, fallback) => {
  const index = process.argv.indexOf(flag);
  if (index < 0) return fallback;
  if (!process.argv[index + 1] || process.argv[index + 1].startsWith('--')) throw Error(`${flag} requires a path`);
  return process.argv[index + 1];
};
const output = option('--output', 'docs/illustration-usage.json');
const guide = option('--guide', 'docs/illustration-guide.md');
const { activitySets, imageGallery } = await loadGameData();
const report = collectIllustrationUsage(activitySets, imageGallery);
for (const atlas of report.atlases) if (!existsSync(join('public', atlas.src))) report.problems.push(`Missing atlas: ${atlas.src}`);
const worlds = { math:'数字岛', logic:'逻辑屋', graphic:'图形工坊', memory:'记忆小屋', language:'语言花园', life:'生活实验室' };
const titles = { 'cat-plant-story':'小猫收到种子', 'bear-tower-story':'小熊搭塔', 'rain-story':'下雨的故事', 'plant-growth':'植物生长', 'butterfly-growth':'蝴蝶生长', 'frog-growth':'青蛙生长', 'everyday-tools':'日常工具', 'fruit-salad-steps':'水果沙拉步骤', 'painting-steps':'画画步骤', 'planting-steps':'小猫种植步骤', 'experiment-materials':'实验材料', 'memory-event-stories':'听力故事事件', 'everyday-actions':'日常用品的用途', 'parent-materials':'亲子操作材料', 'craft-materials':'纸笔与手工材料' };
const locations = atlas => {
  const groups = new Map();
  for (const frame of atlas.frames) for (const ref of frame.references) {
    const key = `${worlds[ref.world]} → ${ref.groupTitle}`;
    if (!groups.has(key)) groups.set(key, new Set());
    groups.get(key).add(ref.round);
  }
  return [...groups].map(([key, rounds]) => `${key}：第${[...rounds].sort((a,b)=>a-b).join('、')}题`).join('<br>');
};
const rows = report.atlases.map(atlas => `| ${titles[basename(atlas.src, '.png')]} | ${atlas.frames.filter(f=>f.references.length).length}/${atlas.frames.length} | ${locations(atlas)} |`);
const reportLink = relative(dirname(guide), output).split('\\').join('/');
const body = `# 探索插画位置\n\n由\`pnpm audit:illustrations\`生成。${report.atlasCount}组、${report.registeredFrameCount}张注册图卡中，${report.usedFrameCount}张有可渲染的题目引用。每组原图按注册的行列和帧位置拆成独立图卡显示。\n\n用户所问的两组完整入口：\n\n- 水果沙拉：探索 → 逻辑屋 → 先后有讲究，第6、9题。第3题是前三步的简化版。\n- 小猫种植：同一题组第4、7题。第1题是前三步的简化版；记忆小屋的“故事留在脑海里”第6题使用其中三个事件。\n- 语言花园“故事接起来”中的小猫收到种子，是另一组故事插画。\n\n| 图组 | 使用帧/注册帧 | “探索”中的入口 |\n|---|---:|---|\n${rows.join('\n')}\n\n逐帧的题目ID、题号与使用位置见[机器记录](${reportLink})。这份报告验证引用与文件；图片实际裁切、图文对应和按钮可达性还要在真实应用中验收。\n`;
for (const [path, content] of [[output, JSON.stringify(report, null, 2)+'\n'], [guide, body]]) {
  mkdirSync(dirname(path), { recursive:true }); writeFileSync(path, content);
}
console.log(JSON.stringify({ atlasCount:report.atlasCount, registeredFrameCount:report.registeredFrameCount, usedFrameCount:report.usedFrameCount, unusedFrames:report.unusedFrames, problems:report.problems, output, guide }, null, 2));
if (report.unusedFrames.length || report.problems.length) process.exitCode = 1;
