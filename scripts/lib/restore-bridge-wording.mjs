import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
export function restoreBridgeWording(data) {
  const changes = new Map(JSON.parse(readFileSync('specs/048-hands-on-bridge/content-changes.json')).map(c => [c.id,c]));
  const copy = JSON.parse(JSON.stringify(data));
  function visit(value) {
    if (!value || typeof value !== 'object') return;
    const change = changes.get(value.id);
    if (change && Array.isArray(value.choices)) for (const field of change.fields) {
      assert.ok(['prompt','instruction','success','retry','parentPrompt','difficultyNote'].includes(field));
      assert.deepEqual(value[field], change.after[field], `${value.id}/${field}: exact 048 wording`);
      value[field] = structuredClone(change.before[field]);
    }
    for (const child of Object.values(value)) visit(child);
  }
  visit(copy);
  return copy;
}
