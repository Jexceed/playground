# Implementation Plan: 行列语音定音

**Branch**: dev | **Date**: 2026-10-06 | **Spec**: [spec.md](spec.md)

## Summary and technical context

Keep React/TypeScript, the existing local voice manifest and standard Edge Xiaoxiao (-12%, +2Hz). Add a shared Chinese speech-only pronunciation function, attach optional spokenText to exported/manifest entries, and regenerate affected clips under content-dependent URLs. Original text/IDs remain the lookup key. No new service or runtime dependency.

## Constitution Check

Before/after design: PASS. Correct child-facing audio without altering task meaning or progress. Keep local auditable assets, explicit Spec Kit acceptance, production build/curriculum/media gates and real Mac installation. No exceptions.

## Implementation

- src/speech-pronunciation.ts: targeted row-context rules; Chinese-only and idempotent; preserve xing words.
- src/speech.ts: prepare browser-fallback input while preserving original-text local-asset lookup.
- scripts/export-voice-lines.mjs: record speech-only input beside original text.
- scripts/generate-edge-voices.mjs and scripts/lib/voice-rendering.mjs: synthesize spokenText and use a fingerprinted filename for corrected lines, retaining unaffected assets.
- scripts/generate-voice-segments.mjs: apply the same full-text pronunciation before splitting; current manifest has no active segment entries.
- scripts/audit-curriculum.mjs and focused tests: enforce exported/manifest pronunciation alignment and fallback/local lookup separation.
- public/audio/: regenerate affected clips, then prune unreferenced files using --write.
- docs/CHANGELOG.md, TODO.md, assets.md and this feature's verification/: count, before/after mapping, provider and actual audition limits.

## Verification

Classify all 182 current lines containing 行. Test numeric/Chinese/letter row forms, full sentence row contexts and preserved 行动/执行/自行车/平行/可行/飞行/行人. Test filename invalidation and original-text local hits. Export voices, generate standard Edge pack, audit media/curriculum, build and mac:install. Inspect representative audio samples and native hearing controls; do not claim every phoneme was heard from media integrity alone.

No extension hooks or agent-context script exists. The only provider constraint was checked in the upstream edge-tts documentation (research.md); no research delegation is needed.
