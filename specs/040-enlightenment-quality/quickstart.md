# Validation guide

Run from the curriculum-benchmark worktree on dev with Node/pnpm and the existing Edge Python environment.

1. Run the feature semantic/behavior tests and existing relevant regressions; compare all stable IDs and exploration data against the baseline.
2. Run `pnpm export:voice-lines`, standard `pnpm generate:edge-voices` (Xiaoxiao, -12%, +2Hz, project Edge Python), `pnpm prune:voice-assets -- --write`, and `pnpm audit:voice-media`.
3. Run `pnpm build`, `pnpm audit:curriculum`, and `pnpm audit:illustrations`.
4. In the browser inspect all changed families and representative unchanged families, including upper/lower difficulty variants. Exercise subitizing ready/show/hide/review, memory retry/review, jumps and truthful completion.
5. Run `pnpm mac:install`; verify installed/build binary equality and strict signature. Open the installed app and check the same critical behaviors and saved progress. A locked/blocked native pass remains incomplete.
6. Record exact outcomes and screenshots in verification/qa.md and per-group review evidence. Update tasks and maintained docs.
