# Quickstart: Visual Choice And Session Memory

## Baseline Red Check

Run before adding this feature's audit checks:

```bash
pnpm audit:curriculum
```

Expected:

- Existing audit reports zero problems, showing the new UI/session issues are
  not covered yet.

Observed before adding checks:

```text
2026-07-06 pnpm audit:curriculum -> problemCount 0
```

After adding red audit checks, run:

```bash
pnpm audit:curriculum
```

Expected:

- Fails on visual-choice duplicated-label rendering.
- Fails on nested matrix-cell `VisualToken` rendering.
- Fails on missing last-location storage/app integration.

Observed after adding red checks:

```text
2026-07-06 pnpm audit:curriculum -> problemCount 4
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

## Browser Visual And Reload Check

Run:

```bash
pnpm dev
```

Check:

- `一模一样在哪里`: exact-match choices show compact card choices without raw
  duplicate symbol text; odd-card position choices remain readable.
- `图形补一补`: matrix cells do not contain nested card frames.
- Select `逻辑屋 -> 图形补一补 -> 第 5 题`, reload, and confirm the same location
  opens.
- Repeat representative checks on desktop and mobile widths.

Observed after implementation:

```text
2026-07-06 desktop visual-match check -> 3 compact visual-card choices, no raw duplicate text
2026-07-06 desktop matrix check -> 9 matrix-cell tokens, 0 nested visual-token cells, no overflow
2026-07-06 reload check -> fresh tab opened 逻辑屋 / 图形补一补 / 第 5 题
2026-07-06 mobile matrix check -> 9 matrix-cell tokens, 0 nested visual-token cells, no overflow
2026-07-06 mobile visual-match check -> compact visual-card choices, no raw duplicate text, no overflow
```
