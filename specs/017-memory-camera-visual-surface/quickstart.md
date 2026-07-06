# Quickstart: Memory Camera Visual Surface

## Red Check

After adding the memory-board source audit, run:

```bash
pnpm audit:curriculum
```

Expected before implementation:

- Audit fails with a `MemoryBoard` nested visual-token finding.

Observed before implementation:

```text
2026-07-06 pnpm audit:curriculum -> problemCount 1
MemoryBoard renderer should use flat memory-card tokens instead of nested VisualToken cards
```

## Implementation Check

Run after implementation:

```bash
pnpm audit:curriculum
pnpm build
git diff --check
```

Expected:

- Audit reports zero problems.
- Build exits successfully.
- Whitespace check has no output.

Observed after implementation:

```text
2026-07-06 pnpm audit:curriculum -> problemCount 0
2026-07-06 pnpm build -> success
2026-07-06 git diff --check -> success
```

## Browser Check

Run:

```bash
pnpm dev
```

Check `逻辑屋 -> 记忆小相机`:

- Before covering: `.memory-card .visual-token` count is `0`, and
  `.memory-card-token` count matches the number of memory items.
- After tapping `遮住再答`: covered slots remain flat, and
  `.memory-card .visual-token` count is still `0`.
- On a mobile viewport: memory slots and labels do not overflow.

Observed after implementation:

```text
2026-07-06 desktop before cover -> 3 memory-card-token, 0 nested visual-token, no overflow
2026-07-06 desktop after cover -> 3 covered memory-card-token, 0 nested visual-token, no overflow
2026-07-06 mobile round 12 before cover -> 4 memory-card-token, 0 nested visual-token, no overflow
2026-07-06 mobile round 12 after cover -> 4 covered memory-card-token, 0 nested visual-token, no overflow
```
