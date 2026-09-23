import { writeFileSync } from 'node:fs';
import { loadTypeScriptModule } from '../../../scripts/lib/load-ts-module.mjs';
const { explorationSets, explorationDrawings } = await loadTypeScriptModule('src/curriculum/exploration/index.ts');
const { evaluateActivity } = await loadTypeScriptModule('src/domain/activity-evaluation.ts');
const drawing = image => explorationDrawings[image.src.split('/').pop().replace('.png', '')];
const permutations = xs => xs.length ? xs.flatMap((x, i) => permutations(xs.filter((_, j) => i !== j)).map(p => [x, ...p])) : [[]];
const results = [], mismatches = [];
for (const a of explorationSets.flatMap(s => s.rounds).filter(a => a.primaryFamilyId === 'G20')) {
  const art = drawing(a.illustration), circles = art.objects.filter(o => o.kind === 'circle');
  const ids = circles.map(c => a.tokens.find(t => drawing(t.image).objects.some(o => o.kind === 'circle' && o.fill === c.fill)).id);
  // Independent oracle: sample the visible color at every 2x output-pixel center.
  // A coverage mask suffices: every point in the same mask has the same visible top layer.
  const masks = new Set();
  for (let y = .25; y < art.height; y += .5) for (let x = .25; x < art.width; x += .5) {
    let mask = 0;
    circles.forEach((c, i) => { if ((x-c.x)**2 + (y-c.y)**2 < c.r**2) mask |= 1 << i; });
    if (mask) masks.add(mask);
  }
  const top = (order, mask) => [...order].reverse().find(id => mask & (1 << ids.indexOf(id)));
  const accepted = [], equivalent = [];
  for (const order of permutations(ids)) {
    const samePicture = [...masks].every(mask => top(order, mask) === top(ids, mask));
    const actual = evaluateActivity(a, {kind:'orderedPlacement', slots:order.map(tokenId => ({state:'filled',tokenId}))}).status === 'correct';
    if (samePicture) equivalent.push(order);
    if (actual) accepted.push(order);
    if (samePicture !== actual) mismatches.push({activityId:a.id,order,samePicture,actual});
  }
  results.push({id:a.id,pixelScale:2,coverageMasks:masks.size,permutations:permutations(ids).length,equivalent,accepted});
}
const report={method:'Compare rendered-circle visible colors at 2x pixel centers, independently of authoring solutions and order rules',activityCount:results.length,permutations:results.reduce((n,r)=>n+r.permutations,0),mismatches,results};
writeFileSync(new URL('./layer-orders-after.json',import.meta.url),JSON.stringify(report,null,2)+'\n');
console.log(JSON.stringify({activityCount:report.activityCount,permutations:report.permutations,mismatches:mismatches.length}));
if(mismatches.length)process.exitCode=1;
