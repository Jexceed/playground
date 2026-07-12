# Implementation Plan: Curriculum Integrity

**Branch**: `dev` | **Date**: 2026-07-12 | **Spec**: [spec.md](spec.md)

## Summary

Balance answers at `makeSet`, extend curriculum audits, correct identified
content, standardize launch voice source, and add manifest-based pruning.

## Technical Context

**Language/Version**: TypeScript 5.x, Node.js 24

**Dependencies**: React, Vite, TypeScript, Node built-ins, Edge TTS Python env

**Storage**: Static TypeScript data and local JSON/audio files

**Testing**: Node `--test`, curriculum audit, TypeScript/Vite build, Tauri build

**Target**: Browser/NAS static hosting and macOS application

**Constraints**: Preserve round IDs and answer values; no runtime randomness;
local voice first; no unrelated UI redesign

**Scale**: 40 games, 489 rounds, 1,799 baseline voice lines

## Constitution Check

- Child-centered integrity: PASS; removes weak distractors and logical shortcuts.
- Spec traceability: PASS; requirements map to tasks and checks.
- Auditable assets: PASS; manifest alignment and pruning are explicit.
- Verification: PASS; build, audit, speech, release, and Mac install are required.
- Documentation: PASS; maintained docs are included.

## Project Structure

```text
src/data/games.ts
scripts/audit-curriculum.mjs
scripts/prune-voice-assets.mjs
scripts/prune-voice-assets.test.mjs
public/audio/brand/
public/audio/voice-lines.json
public/audio/voice/
docs/
specs/022-curriculum-integrity/
```

**Structure Decision**: Keep existing game and audit boundaries. Add one focused,
tested pruning script because filesystem cleanup is independent of semantics.

## Design Artifacts

- [research.md](research.md)
- [data-model.md](data-model.md)
- [contracts/curriculum-integrity-audit.md](contracts/curriculum-integrity-audit.md)
- [quickstart.md](quickstart.md)

No constitution violations or new architectural layers are required.

