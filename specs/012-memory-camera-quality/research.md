# Research: Memory-Camera Logic Quality

## Decision: Add deterministic audit checks before rewriting memory-camera copy

**Rationale**: The current project quality loop relies on `pnpm
audit:curriculum` as the executable guardrail. Memory-camera questions can be
computed from `memory.items`, so audit checks can prove the answer and wording
quality rather than relying on manual review.

**Alternatives considered**:

- Manual review only: rejected because it would not prevent future regressions.
- Add a separate test runner: rejected because the existing audit script already
  imports game data and validates similar logic-house clusters.

## Decision: Normalize emoji memory cards to child-facing labels

**Rationale**: Several memory rounds show emoji cards but use Chinese answer
labels such as `苹果` and `小兔`. The audit must compare by child-facing meaning,
not by raw glyph string.

**Alternatives considered**:

- Rewrite all emoji cards to Chinese words: rejected because existing visual
  tokens are child-friendly and already used elsewhere.
- Compare only raw strings: rejected because it would falsely fail valid rounds
  like `🍎` answer `苹果`.

## Decision: Keep all visual surfaces and choices local

**Rationale**: The current memory surface and visual-token catalogue can render
all affected items. No new image generation is required.

**Alternatives considered**:

- Generate a new camera scene image: rejected because it does not improve the
  specific answer/feedback quality problem.
- Add new asset categories: rejected because existing `memory` and visual token
  paths are sufficient.

## Decision: Regenerate Edge voice assets after text rewrites

**Rationale**: The app prefers local audio when available. Wording changes must
be reflected in `voice-lines.json`, `public/audio/voice/manifest.json`, and
generated mp3 files.

**Alternatives considered**:

- Rely on browser TTS fallback: rejected because project rules treat browser TTS
  as fallback only.
- Skip unchanged prompt audio: rejected because the manifest comparison expects
  a complete local pack for exported lines.
