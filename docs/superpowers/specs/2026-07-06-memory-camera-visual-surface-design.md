# Memory Camera Visual Surface Design

## Problem

`记忆小相机` still renders `VisualToken` inside `.memory-card`. Because both are
card-like containers, children see a card inside a card, similar to the matrix
surface issue reported earlier.

## Decision

Keep `.memory-card` as the single framed slot. Render the item inside it with a
new flat `MemoryCardToken` that uses `VisualGlyph`, a child-readable label, and
the same speech behavior.

## Scope

- Change only the memory-camera visual surface.
- Do not rewrite memory-camera round content.
- Do not add assets or change audio lines.

## Verification

- Add audit coverage for nested `VisualToken` in `MemoryBoard`.
- Browser-check desktop and mobile before and after covering the memory cards.
