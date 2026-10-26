import fs from 'node:fs';
import assert from 'node:assert/strict';
import {loadTypeScriptModule} from '../../scripts/lib/load-ts-module.mjs';
const base='specs/059-chapter-readability/';
const old=JSON.parse(fs.readFileSync(base+'reviews/catalog-before.json'));
const {catalogGames}=await loadTypeScriptModule('src/curriculum/catalog.ts');
const next=JSON.parse(JSON.stringify(catalogGames)), restored=structuredClone(next),changes=[];
const permitted=new Set(['presentation','tokens','clues','hints']);
for(let g=0;g<old.length;g++)for(let r=0;r<old[g].rounds.length;r++){
 const a=old[g].rounds[r],b=next[g].rounds[r];const fields=[...new Set([...Object.keys(a),...Object.keys(b)])].filter(k=>JSON.stringify(a[k])!==JSON.stringify(b[k]));if(!fields.length)continue;
 assert.ok(['N03','N04','N07','N10','N11','N12','N13','N14','N15'].includes(b.primaryFamilyId));
 const entry={id:a.id,fields,before:{},after:{}};
 for(const field of fields){assert.ok(permitted.has(field),a.id+'/'+field);if(Object.hasOwn(a,field))entry.before[field]=a[field];if(Object.hasOwn(b,field))entry.after[field]=b[field];if(Object.hasOwn(a,field))restored[g].rounds[r][field]=a[field];else delete restored[g].rounds[r][field];}
 changes.push(entry);
}
assert.deepEqual(restored,old);fs.writeFileSync(base+'math-presentation-changes.json',JSON.stringify(changes,null,2)+'\n');
const {imageGallery}=await loadTypeScriptModule('src/data/imageGallery.ts');const keys=['mathPlayNote','mathPlayCoin','mathWaterTall','mathWaterWide','birdFlying','birdBranch'];fs.writeFileSync(base+'math-gallery-additions.json',JSON.stringify(keys.map(key=>({category:'items',key,after:imageGallery.items[key]})),null,2)+'\n');
console.log({changedRounds:changes.length,fields:[...new Set(changes.flatMap(c=>c.fields))],families:[...new Set(next.flatMap(g=>g.rounds).filter(r=>changes.some(c=>c.id===r.id)).map(r=>r.primaryFamilyId))]});
