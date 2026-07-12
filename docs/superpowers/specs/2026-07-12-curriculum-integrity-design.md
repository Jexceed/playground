# Curriculum Integrity Design

## Goal

Make the curriculum auditable for consistent narration, coherent reasoning, and
answer choices that cannot be solved by memorizing a screen position.

## Baseline Findings

- The active manifest has 1,799 Edge `zh-CN-XiaoxiaoNeural` entries and zero
  failures, but the launch sound uses a separate temporary Xiaoyi source.
- Runtime voice directories contain 124 obsolete macOS files and hundreds of
  unreferenced old Edge files.
- Across 489 rounds, correct answers appear in positions 1/2/3/4 at
  56.0%/35.2%/5.9%/2.9%; thirteen games put every correct answer first.
- Some bridge, rotation, and evidence questions leak answers or support a weak
  conclusion. Clock copy currently teaches minute hand before hour hand.

## Design

Choice order is balanced when data is constructed, not randomized at runtime.
Within each game and choice-count bucket, the correct answer cycles through all
positions deterministically. Distractors keep relative order. Graphic options
move with their values and are relabeled A/B/C/D.

Confirmed semantic defects are corrected without unrelated editorial churn:
remove answer-repeating instructions, make bridge evidence sufficient, replace
proximity-as-proof with direct-evidence search, strengthen changed L5/L6
distractors, and teach hour hand first, minute hand second everywhere.

Curriculum narration remains standard Edge Xiaoxiao. The dedicated launch sound
is regenerated from Xiaoxiao until a real child-chorus recording is available.
A dry-run-by-default pruning command removes voice files absent from the active
manifest. The curriculum audit enforces all invariants.

## Verification

Run voice-asset tests, curriculum audit, speech tests, voice export/generation,
browser build, NAS release, and real Mac application installation.

