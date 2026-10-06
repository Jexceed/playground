# Tasks: 行列语音定音

## Setup

- [x] T001 Record scope, provider constraint and design in specs/042-row-pronunciation/spec.md, plan.md, research.md and contracts/speech.md using the existing Spec Kit workflow.

## US1 — Correct the intended reading

Independent check: row references read hang2 while mixed-sentence xing words and all UI text remain intact.

- [x] T002 [US1] Add focused row-context, preservation and locale/idempotence regressions in scripts/speech-pronunciation.test.mjs.
- [x] T003 [US1] Implement reviewed speech-only rules in src/speech-pronunciation.ts and record the complete current 行 corpus in specs/042-row-pronunciation/verification/row-lines.json.

## US2 — Regenerate and actually use corrected audio

Independent check: corrected input produces new URLs, original-text lookup plays them, and fallback/segmentation applies the same pronunciation.

- [x] T004 [US2] Add spokenText export/manifest metadata and cache-safe corrected filenames in scripts/export-voice-lines.mjs, scripts/generate-edge-voices.mjs and scripts/lib/voice-rendering.mjs.
- [x] T005 [US2] Wire shared preparation into src/speech.ts and scripts/generate-voice-segments.mjs; strengthen scripts/audit-curriculum.mjs and scripts/speech.test.mjs against stale pronunciation or changed lookup keys.
- [x] T006 [US2] Export and generate the standard Edge pack in public/audio/, retain actual audition samples, then prune unreferenced voice files and record generation results in specs/042-row-pronunciation/verification/.

## Verification and handback

- [x] T007 Run focused regressions, build, curriculum/media audits and mac:install; verify installed identity and representative native controls in specs/042-row-pronunciation/verification/qa.md, clearly separating media checks from acoustic confirmation (human audition is pending; see qa.md).
- [x] T008 Update docs/CHANGELOG.md, docs/TODO.md, docs/assets.md and specs/042-row-pronunciation/tasks.md with the verified scope and any limitations.

## Dependencies and execution

T001 → T002 → T003 → T004/T005 → T006 → T007 → T008. The first independently reviewable increment is the pronunciation sample and shared rules; deliver the regenerated installed pack as well. Pipeline/runtime reads and final independent audits can be batched; edits, synthesis inputs and installation are sequential. No extension hooks are configured. No sub-agent work is needed.
