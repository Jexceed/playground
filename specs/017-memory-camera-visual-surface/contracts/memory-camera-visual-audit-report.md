# Contract: Memory Camera Visual Audit Report

`pnpm audit:curriculum` must report source-level regressions for the memory
camera visual surface.

## Finding Shape

```text
MemoryBoard renderer should use flat memory-card tokens instead of nested VisualToken cards
```

## Required Checks

- Inspect `src/games/ProgressiveSetGame.tsx`.
- Isolate the `MemoryBoard` renderer implementation.
- Report the finding when the isolated renderer contains `VisualToken` usage.

## Passing State

- The audit report has `problemCount: 0`.
- `MemoryBoard` renders dedicated flat memory-slot tokens.
- Browser DOM has zero `.memory-card .visual-token` elements.
