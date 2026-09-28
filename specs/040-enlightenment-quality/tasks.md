# Tasks: 启蒙质量优化

## Setup and baseline

- [x] T001 Write scope and design in specs/040-enlightenment-quality/spec.md and plan.md using Spec Kit workflow.
- [x] T002 Export baseline identities/data hashes and complete group inventory to specs/040-enlightenment-quality/verification/baseline.json.

## US1 — Coherent content

Independent check: every group has reviewed content/evidence and all confirmed defects have before/after evidence.

- [x] T003 [US1] Review all math and clock variants in src/data/games.ts and actual assets; record in specs/040-enlightenment-quality/verification/review.md.
- [x] T004 [US1] Review every narrative, rule, planning and relation variant in src/data/games.ts; record findings in verification/review.md.
- [x] T005 [US1] Review all space, map, pattern, memory and six graphic families and renderer; record findings in verification/review.md.
- [x] T006 [US1] Correct confirmed content/visual defects in src/data/games.ts and relevant local surfaces.
- [x] T007 [US1] Add independent semantic regressions in scripts/enlightenment-quality.test.mjs and align scripts/audit-curriculum.mjs with corrected requirements.

## US2 — Fair interactions and truthful progress

Independent check: readiness/review/interrupt/jump flows gate grading correctly and skipped rounds never count as completed.

- [x] T008 [US2] Replace cyclic answer scheduling in src/data/games.ts while preserving graphic/value/letter associations.
- [x] T009 [US2] Implement explicit observation readiness/review and gating in src/games/ProgressiveSetGame.tsx, scoped styles and local voice strings.
- [x] T010 [US2] Correct actual-completion accounting in src/games/ProgressiveSetGame.tsx and src/App.tsx without deleting history.
- [x] T011 [US2] Add meaningful state/progress/order regressions in scripts/enlightenment-quality.test.mjs.

## US3 — Verified installed experience

Independent check: current Mac app contains verified data/assets; local progress and exploration are preserved.

- [x] T012 [US3] Export/regenerate changed public/audio voice assets and verify provider/manifest/media alignment.
- [x] T013 [US3] Run required build/curriculum/illustration and regression checks; record logs in verification/.
- [x] T014 [US3] Verify current-Mac browser surfaces and corrected interactions; record screenshots and outcomes in verification/qa.md.
- [ ] T015 [US3] Run pnpm mac:install, verify binary/signature and native corrected interactions; record separate evidence in verification/qa.md. Installation passes; native input acceptance awaits Mac unlock.

## Cross-cutting completion

- [x] T016 Complete the 40-group review ledger and final identity/exploration comparison in verification/.
- [x] T017 Update docs/CHANGELOG.md and docs/TODO.md with completed work and factual limitations.
- [ ] T018 Audit every spec requirement against current evidence before declaring goal complete.

## Dependencies and execution

T001 → T002 → T003–T005 → T006–T007. T008–T011 can follow baseline independently of content review, but implementation is performed sequentially in this shared checkout. US3 follows both US1 and US2. T016–T018 require all review and acceptance evidence. Independent reviews and test reads can be batched; no concurrent agent edits are required. The first reviewable increment is content diagnosis plus baseline, followed by full corrections and installation; that increment is not the final goal.
