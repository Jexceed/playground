import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';

// Immutable historical tests still compare their own snapshot. Validate each
// later, explicitly reviewed change before reversing it solely for that comparison.
export function restoreReviewedArt(data) {
  const copy=JSON.parse(JSON.stringify(data));
  const changes=[...JSON.parse(readFileSync('specs/051-rule-play-art/image-changes.json')).map(c=>({...c,feature:'051'})),...JSON.parse(readFileSync('specs/052-art-review-framework-guard/image-changes.json')).map(c=>({...c,feature:'052'}))];
  for(const change of changes)assert.deepEqual(copy.imageGallery[change.category][change.key],change.after,`exact reviewed ${change.feature} asset ${change.key}`);
  function visit(value){
    if(!value||typeof value!=='object')return;
    const change=changes.find(c=>c.before&&value.src===c.after.src&&value.alt===c.after.alt);
    if(change)value.src=change.before.src;
    for(const child of Object.values(value))visit(child);
  }
  visit(copy);
  for(const change of changes)if(!change.before)delete copy.imageGallery[change.category][change.key];
  return copy;
}

export function restoreRulePlayPresentation(data) {
  const copy=restoreNumberWalkPresentation(data);
  const changes=new Map(JSON.parse(readFileSync('specs/050-concrete-rule-play/content-changes.json')).map(c=>[c.id,c]));
  const permitted=new Set(['prompt','instruction','clues','hints','success','retry','parentPrompt','protocol','presentation','illustration']);
  function visit(value){
    if(!value||typeof value!=='object')return;
    const imageChange=[...changes.values()].find(c=>c.after.illustration&&value.src===c.after.illustration.src&&value.alt===c.after.illustration.alt);
    if(imageChange)value.alt=imageChange.before.illustration.alt;
    const change=changes.get(value.id);
    if(change&&value.schemaVersion===1)for(const field of change.fields){
      assert.ok(permitted.has(field));
      assert.deepEqual(value[field],change.after[field],`${value.id}/${field}: exact reviewed 050 presentation`);
      if(Object.hasOwn(change.before,field))value[field]=structuredClone(change.before[field]);else delete value[field];
    }
    for(const child of Object.values(value))visit(child);
  }
  visit(copy);return copy;
}

export function restoreNumberWalkPresentation(data) {
  const copy=restoreBoardMovePresentation(data);
  const changes=new Map(JSON.parse(readFileSync('specs/054-number-walk-model/content-changes.json')).map(c=>[c.id,c]));
  function visit(value) {
    if(!value || typeof value!=='object')return;
    const change=changes.get(value.id);
    if(change && value.schemaVersion===1)for(const field of change.fields) {
      assert.ok(['instruction','presentation'].includes(field));
      assert.deepEqual(value[field],change.after[field],`${value.id}/${field}: exact reviewed 054 presentation`);
      if(Object.hasOwn(change.before,field))value[field]=structuredClone(change.before[field]);else delete value[field];
    }
    for(const child of Object.values(value))visit(child);
  }
  visit(copy);return copy;
}

export function restoreBoardMovePresentation(data) {
  const copy=restoreIslandBridgeWording(data);
  const changes=new Map(JSON.parse(readFileSync('specs/055-board-move-clarity/content-changes.json')).map(c=>[c.id,c]));
  function visit(value) {
    if(!value || typeof value!=='object')return;
    const change=changes.get(value.id);
    if(change && value.schemaVersion===1)for(const field of change.fields) {
      assert.ok(['instruction','presentation'].includes(field));
      assert.deepEqual(value[field],change.after[field],`${value.id}/${field}: exact reviewed 055 presentation`);
      if(Object.hasOwn(change.before,field))value[field]=structuredClone(change.before[field]);else delete value[field];
    }
    for(const child of Object.values(value))visit(child);
  }
  visit(copy);return copy;
}

export function restoreIslandBridgeWording(data) {
  const copy=restoreVocabularyArt(data);
  const changes=new Map(JSON.parse(readFileSync('specs/056-island-bridge-goals/content-changes.json')).map(c=>[c.id,c]));
  function visit(value) {
    if(!value || typeof value!=='object')return;
    const change=changes.get(value.id);
    if(change && value.schemaVersion===1)for(const field of change.fields) {
      assert.ok(['instruction','clues','hints','success'].includes(field));
      assert.deepEqual(value[field],change.after[field],`${value.id}/${field}: exact reviewed 056 wording`);
      value[field]=structuredClone(change.before[field]);
    }
    for(const child of Object.values(value))visit(child);
  }
  visit(copy);return copy;
}

// Only the 22 reviewed picture references may differ from the older snapshots.
// Keep words, speech, answers, identifiers and every other field visible to tests.
export function restoreVocabularyArt(data) {
  const copy=restoreMathReadability(data);
  const changes=new Map(JSON.parse(readFileSync('specs/058-concrete-word-pictures/image-changes.json')).map(c=>[c.id,c]));
  function visit(value) {
    if(!value || typeof value!=='object')return;
    const change=changes.get(value.id);
    if(change && value.schemaVersion===1) {
      assert.equal(value.kind,'matching');
      for(const reviewed of change.tokens) {
        const token=value.tokens.find(t=>t.id===reviewed.id);
        assert.ok(token,`${value.id}/${reviewed.id}: existing token`);
        assert.equal(token.label,reviewed.word);
        assert.deepEqual(token.image,reviewed.after,`${value.id}/${reviewed.id}: exact reviewed 058 picture`);
        token.image=structuredClone(reviewed.before);
      }
    }
    for(const child of Object.values(value))visit(child);
  }
  visit(copy);
  if(copy.imageGallery)for(const change of JSON.parse(readFileSync('specs/058-concrete-word-pictures/gallery-additions.json'))) {
    assert.deepEqual(copy.imageGallery[change.category][change.key],change.after,`exact reviewed 058 asset ${change.key}`);
    delete copy.imageGallery[change.category][change.key];
  }
  return copy;
}

export function restoreMathReadability(data) {
  const copy=JSON.parse(JSON.stringify(data));
  const changes=new Map(JSON.parse(readFileSync('specs/059-chapter-readability/math-presentation-changes.json')).map(c=>[c.id,c]));
  function visit(value) {
    if(!value || typeof value!=='object')return;
    const change=changes.get(value.id);
    if(change && value.schemaVersion===1)for(const field of change.fields) {
      assert.ok(['presentation','tokens','clues','hints'].includes(field));
      assert.deepEqual(value[field],change.after[field],`${value.id}/${field}: exact reviewed 059 math presentation`);
      if(Object.hasOwn(change.before,field))value[field]=structuredClone(change.before[field]);else delete value[field];
    }
    for(const child of Object.values(value))visit(child);
  }
  visit(copy);
  if(copy.imageGallery)for(const change of JSON.parse(readFileSync('specs/059-chapter-readability/math-gallery-additions.json'))) {
    assert.deepEqual(copy.imageGallery[change.category][change.key],change.after,`exact reviewed 059 math asset ${change.key}`);
    delete copy.imageGallery[change.category][change.key];
  }
  return copy;
}
