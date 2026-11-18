import { createHash } from 'node:crypto';
import { readFileSync } from 'node:fs';

const changes067 = JSON.parse(readFileSync(new URL('../../specs/067-curriculum-appeal-and-difficulty/content-changes.json', import.meta.url)));
const changes066 = JSON.parse(readFileSync(new URL('../../specs/066-curriculum-review-remediation/content-changes.json', import.meta.url)));

function indexChanges(changes) {
  const byId = new Map();
  for (const change of changes.fields) {
    for (const id of change.ids) {
      if (!byId.has(id)) byId.set(id, []);
      byId.get(id).push(change);
    }
  }
  return { byId, gallery: changes.gallery };
}

const indexed067 = indexChanges(changes067);
const indexed066 = indexChanges(changes066);

export const contentDigest = value => value === undefined ? null : createHash('sha256').update(JSON.stringify(value)).digest('hex');

function restoreField(object, key, change) {
  if (contentDigest(object[key]) !== change.current) return;
  if (!Object.hasOwn(change, 'previous')) {
    delete object[key];
    return;
  }
  // Older snapshots also fingerprint serialized key order. A retired field
  // must return to its original position relative to the surviving fields.
  const keys = change.before ? Object.keys(object) : [];
  const position = keys.indexOf(change.before);
  object[key] = structuredClone(change.previous);
  if (position >= 0) {
    for (const later of keys.slice(position)) {
      const value = object[later];
      delete object[later];
      object[later] = value;
    }
  }
}

function applyReversal(data, indexed) {
  const copy = JSON.parse(JSON.stringify(data));
  function visit(value) {
    if (!value || typeof value !== 'object') return;
    if (indexed.byId.has(value.id)) {
      for (const change of indexed.byId.get(value.id)) restoreField(value, change.field, change);
    }
    for (const child of Object.values(value)) visit(child);
  }
  visit(copy);
  if (copy.imageGallery) {
    for (const change of indexed.gallery) {
      const category = copy.imageGallery[change.category];
      if (category) restoreField(category, change.key, change);
    }
  }
  return copy;
}

export function beforeAppealAndDifficulty(data) {
  return applyReversal(data, indexed067);
}

// The historic comparisons see only the exact approved edits reversed. A later
// change to an unrelated field or a different value on the same field stays visible.
export function beforeCurriculumReview(data) {
  return applyReversal(beforeAppealAndDifficulty(data), indexed066);
}
