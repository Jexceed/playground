import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync,existsSync} from 'node:fs';
import {createHash} from 'node:crypto';
import sharp from 'sharp';
import {loadTypeScriptModule} from './lib/load-ts-module.mjs';
import {restoreVocabularyArt} from './lib/restore-reviewed-art.mjs';
const {catalogGames}=await loadTypeScriptModule('src/curriculum/catalog.ts');
const {imageGallery}=await loadTypeScriptModule('src/data/imageGallery.ts');
const json=p=>JSON.parse(readFileSync(p));
const root='specs/058-concrete-word-pictures/';
const baseline=json(root+'verification/baseline.json');
const changes=json(root+'image-changes.json');
const additions=json(root+'gallery-additions.json');
const manifest=json('public/images/items/vocabulary-058/source/manifest.json');
const game=catalogGames.find(g=>g.id==='explore-vocabulary-relations');
const digest=x=>createHash('sha256').update(x).digest('hex');
test('all 1110 questions differ only in the 22 reviewed word pictures',()=>{
  assert.equal(catalogGames.flatMap(g=>g.rounds).length,1110);
  assert.equal(digest(JSON.stringify(restoreVocabularyArt(catalogGames))),baseline.catalogSHA256);
  assert.equal(changes.length,6);assert.equal(changes.flatMap(c=>c.tokens).length,22);
  assert.equal(game.rounds.length,9);
  assert.ok(game.rounds.slice(0,6).every(r=>r.kind==='matching'));
  assert.ok(game.rounds.slice(6).every(r=>r.kind==='parentObservation'));
});
test('all eight meanings use unique registered concrete pictures; open and closed retain their existing pair',()=>{
  const sources=new Set();const words=new Set();let retained=0;
  for(const c of changes)for(const t of c.tokens){words.add(t.word);sources.add(t.after.src);assert.ok(additions.some(a=>JSON.stringify(a.after)===JSON.stringify(t.after)));}
  assert.deepEqual([...words].sort(),['高','低','上','下','长','短','多','少'].sort());assert.equal(sources.size,8);assert.equal(additions.length,8);
  for(const a of additions)assert.deepEqual(JSON.parse(JSON.stringify(imageGallery[a.category][a.key])),a.after);
  for(const r of game.rounds.slice(0,6))for(const t of r.tokens)if(['开','关'].includes(t.label)){assert.match(t.image.src,/box-(open|closed)\.png$/);assert.deepEqual(t.image.frame,{columns:1,rows:1,index:0});retained++;}
  assert.equal(retained,8);
});
test('source originals, prompts and 640px whole-canvas PNGs are reproducible and untrimmed',async()=>{
  assert.equal(manifest.tool,'built-in image_gen');assert.equal(manifest.assets.length,8);
  for(const a of manifest.assets){
    assert.equal(digest(readFileSync(a.source)),a.sourceSHA256);assert.equal(digest(readFileSync(a.runtime)),a.sha256);assert.ok(a.prompt.length>100);
    if(a.reference)assert.ok(existsSync(a.reference));
    const s=await sharp(a.source).metadata(),r=await sharp(a.runtime).metadata();
    assert.equal(s.width,s.height);assert.equal(s.width,a.sourceWidth);assert.equal(r.width,640);assert.equal(r.height,640);assert.equal(r.format,'png');
    assert.match(a.processing,/no trim or crop/);
    const raw=await sharp(a.source).resize(640,640,{fit:'inside',withoutEnlargement:true}).removeAlpha().raw().toBuffer();
    const current=await sharp(a.runtime).removeAlpha().raw().toBuffer();assert.deepEqual(current,raw,`${a.name}: only proportional resize`);
  }
});
test('historical normalization rejects unreviewed images and never masks word, answer or progress changes',()=>{
  const bad=structuredClone(catalogGames),r=bad.find(g=>g.id===game.id).rounds[0];r.tokens[0].image.src='/images/unreviewed.png';assert.throws(()=>restoreVocabularyArt(bad),/exact reviewed 058 picture/);
  const badWord=structuredClone(catalogGames);badWord.find(g=>g.id===game.id).rounds[0].tokens[0].label='大';assert.throws(()=>restoreVocabularyArt(badWord));
  const badAnswer=structuredClone(catalogGames);badAnswer.find(g=>g.id===game.id).rounds[0].expectedPairs=[];assert.notEqual(digest(JSON.stringify(restoreVocabularyArt(badAnswer))),baseline.catalogSHA256);
  const badRevision=structuredClone(catalogGames);badRevision.find(g=>g.id===game.id).rounds[0].revision++;assert.notEqual(digest(JSON.stringify(restoreVocabularyArt(badRevision))),baseline.catalogSHA256);
  const gallery={imageGallery:JSON.parse(JSON.stringify(imageGallery))};const restored=restoreVocabularyArt(gallery);for(const a of additions)assert.equal(restored.imageGallery.items[a.key],undefined);
});
