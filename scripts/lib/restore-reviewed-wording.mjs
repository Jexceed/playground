import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';

// Older frozen baselines remain immutable. First require exact 047 text, then
// reverse only its reviewed text edits for the earlier feature's boundary test.
export function restoreChildReadableWording(data) {
  const changes = new Map(JSON.parse(readFileSync('specs/047-child-readable-logic/content-changes.json')).map(change => [change.id, change]));
  const copy = JSON.parse(JSON.stringify(data));
  function visit(value) {
    if (!value || typeof value !== 'object') return;
    const change = changes.get(value.id);
    if (change && Array.isArray(value.choices)) {
      for (const field of change.fields) {
        assert.ok(['prompt','instruction','choices','success','retry','parentPrompt'].includes(field));
        assert.deepEqual(value[field], change.after[field], `${value.id}/${field}: exact approved 047 text`);
        if (field === 'choices') assert.deepEqual(value.choices.map(choice => choice.value), change.before.choices.map(choice => choice.value));
        value[field] = structuredClone(change.before[field]);
      }
    }
    for (const child of Object.values(value)) visit(child);
  }
  visit(copy);
  return copy;
}
