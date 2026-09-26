import assert from 'node:assert/strict';
import { execFileSync } from 'node:child_process';
import { readFileSync, writeFileSync } from 'node:fs';
import { relative, resolve } from 'node:path';
import { build } from 'vite';
import { loadTypeScriptModule } from '../../../scripts/lib/load-ts-module.mjs';

const baseline = 'c5d8f19';
const root = process.cwd();
const gitFile = file => execFileSync('git', ['show', `${baseline}:${file}`], { cwd: root, encoding:'utf8', maxBuffer:16*1024*1024 });
const result = await build({ configFile:false, root, publicDir:false, logLevel:'silent',
  plugins:[{ name:'read-baseline-source', enforce:'pre', load(id) {
    const file = relative(root, id.split('?')[0]);
    return file.startsWith('src/') && /\.(ts|tsx|json)$/.test(file) ? gitFile(file) : null;
  } }],
  build:{ ssr:resolve('src/curriculum/catalog.ts'), write:false, minify:false,
    rollupOptions:{ output:{ format:'es', inlineDynamicImports:true } } },
});
const chunks = (Array.isArray(result) ? result.flatMap(r=>r.output) : result.output).filter(r=>r.type==='chunk');
assert.equal(chunks.length,1);
const before = await import(`data:text/javascript;base64,${Buffer.from(chunks[0].code).toString('base64')}`);
const after = await loadTypeScriptModule('src/curriculum/catalog.ts');
// Only layout and visual representations may differ in this feature.
const semantics = sets => JSON.parse(JSON.stringify(sets, (key,value) => ['image','illustration','presentation'].includes(key) ? undefined : value));
assert.deepEqual(semantics(after.activitySets),semantics(before.activitySets));
assert.deepEqual(after.legacyGames,before.legacyGames);
const oldVoices=JSON.parse(gitFile('public/audio/voice-lines.json'));
const newVoices=JSON.parse(readFileSync('public/audio/voice-lines.json'));
assert.deepEqual(newVoices.lines,oldVoices.lines);
const report={baseline,explorationActivities:after.activitySets.reduce((n,g)=>n+g.rounds.length,0),
  allNonVisualActivityFieldsUnchanged:true,legacyGamesUnchanged:true,voiceLinesUnchanged:newVoices.lines.length};
writeFileSync('specs/039-picture-card-captions/verification/semantic-invariants.json',JSON.stringify(report,null,2)+'\n');
console.log(report);
