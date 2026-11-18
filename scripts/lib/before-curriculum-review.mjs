import { createHash } from 'node:crypto';
import { readFileSync } from 'node:fs';

const changes = JSON.parse(readFileSync(new URL('../../specs/066-curriculum-review-remediation/content-changes.json', import.meta.url)));
const byId = new Map();
for (const change of changes.fields) {
  for (const id of change.ids) {
    if (!byId.has(id)) byId.set(id, []);
    byId.get(id).push(change);
  }
}

export const contentDigest = value => value === undefined ? null : createHash('sha256').update(JSON.stringify(value)).digest('hex');

function restoreField(object, key, change) {
  if (contentDigest(object[key]) !== change.current) return;
  if (Object.hasOwn(change, 'previous')) object[key] = structuredClone(change.previous);
  else delete object[key];
}

// The historic comparisons see only the exact approved edits reversed. A later
// change to an unrelated field or a different value on the same field stays visible.
export function beforeCurriculumReview(data) {
  const copy = JSON.parse(JSON.stringify(data));
  function visit(value) {
    if (!value || typeof value !== 'object') return;
    if (byId.has(value.id)) {
      for (const change of byId.get(value.id)) restoreField(value, change.field, change);
    }
    for (const child of Object.values(value)) visit(child);
  }
  visit(copy);
  if (copy.imageGallery) {
    for (const change of changes.gallery) {
      const category = copy.imageGallery[change.category];
      if (category) restoreField(category, change.key, change);
    }
  }
  return copy;
}
