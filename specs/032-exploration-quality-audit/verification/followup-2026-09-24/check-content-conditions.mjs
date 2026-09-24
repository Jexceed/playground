import { readFileSync, writeFileSync } from 'node:fs';
import { loadTypeScriptModule } from '../../../../scripts/lib/load-ts-module.mjs';
const { explorationSets, explorationDrawings } = await loadTypeScriptModule('src/curriculum/exploration/index.ts');
const activities = explorationSets.flatMap(s => s.rounds);
const art = image => explorationDrawings[image.src.split('/').at(-1).replace('.png', '')];
const family = id => activities.filter(a => a.primaryFamilyId === id);
const money = family('N13').filter(a => a.stage === 3).map(a => {
  const target = Number(a.prompt.match(/刚好付(\d+)元/)[1]);
  const options = a.tokens.map(t => {
    const amounts = art(t.image).objects.filter(o => o.kind === 'text').map(o => Number(o.text.replace('元', '')));
    const total = amounts.reduce((sum, n) => sum + n, 0);
    const stockOkay = amounts.filter(n => n === 5).length <= 1 && amounts.filter(n => n === 1).length <= 7;
    return { id: t.id, amounts, total, stockOkay, correctTotal: total === target };
  });
  return { id: a.id, target, options, correctTotalButOverstock: options.filter(o => o.correctTotal && !o.stockOkay).length };
});
const marker = family('G04').filter(a => a.stage === 3).map(a => {
  const blueCells = a.tokens.map(t => {
    const blue = art(t.image).objects.find(o => o.kind === 'circle' && o.fill === '#548cb3');
    // Markers sharing a cell shift 12px, less than half the public 85px grid cell.
    return Math.round((blue.x - 62.5) / 85);
  });
  return { id: a.id, blueCells, distinctBlueCells: new Set(blueCells).size };
});
const independent = JSON.parse(readFileSync(new URL('./independent-math-logic.json', import.meta.url), 'utf8'));
const routes = independent.families.find(f => f.family === 'L05').rounds.filter(a => a.stage === 2).map(a => ({id:a.id,...a.diagnostics}));
const pyramids = family('G07').filter(a => a.stage > 1).map(a => ({id:a.id,kind:a.kind,staticQuestionMarks:art(a.illustration).objects.filter(o=>o.kind==='text'&&o.text==='?').length,hasIntermediateInputs:a.kind !== 'singleChoice'}));
const fold = family('G15').filter(a => a.stage > 1).map(a => ({id:a.id,prompt:a.prompt,clues:a.clues,drawnPaperCells:art(a.illustration).objects.filter(o=>o.kind==='rect').length,explicitFoldLines:art(a.illustration).objects.filter(o=>o.kind==='line').length}));
const rectangle = family('G09').at(-1);
const atlasUsers = activities.flatMap(a => {
  const cards = a.presentation?.storyCards ?? (a.presentation?.evidence?.kind === 'storySequence' ? a.presentation.evidence.cards : []);
  return cards.some(c => c.frame) ? [{id:a.id,framedCards:cards.filter(c=>c.frame).length,frames:cards.map(c=>c.frame)}] : [];
});
const report = {
  reviewedCommit:'3660c2b', activities:activities.length,
  money, routes, marker, pyramids, fold,
  rectangleProgression:family('G09').map(a=>({id:a.id,stage:a.stage,prompt:a.prompt,answer:a.kind==='singleChoice'?a.tokens.find(t=>t.id===a.answerId).label:null})),
  rectangleIndependentCount:{id:rectangle.id,rows:3,columns:4,count:(3*4/2)*(4*5/2)},
  difficulty:{readingOne:activities.filter(a=>a.difficulty.reading===1).length,motorOne:activities.filter(a=>a.difficulty.motor===1).length,rulesEqualStage:activities.filter(a=>a.difficulty.rules===a.stage).length,stepsEqualStage:activities.filter(a=>a.difficulty.steps===a.stage).length},
  atlasUsers,
  limits:['This detects ineffective conditions and rendering risk, not observed developmental difficulty.','Atlas failure was visually reproduced in the installed Mac E03-9; other listed activities use the same affected render path.']
};
writeFileSync(new URL('./content-conditions.json',import.meta.url),JSON.stringify(report,null,2)+'\n');
console.log(JSON.stringify({money:money.map(a=>({id:a.id,correctTotalButOverstock:a.correctTotalButOverstock})),routes:routes.map(a=>({id:a.id,lengths:a.legalRouteLengths})),marker,difficulty:report.difficulty,atlasAffectedActivities:atlasUsers.length}));
