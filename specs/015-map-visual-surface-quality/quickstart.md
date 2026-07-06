# Quickstart: Map Visual Surface Quality

## Baseline Red Check

Baseline before adding this feature's audit rules:

```text
2026-07-06 pnpm audit:curriculum -> problemCount 0
```

This confirmed the previous audit suite did not catch the visual-surface issue.

Run:

```bash
pnpm audit:curriculum
```

Expected before implementation:

- Fails with spatial surface problems for current address, position, and route
  rounds that combine `sceneImage` with `grid` or `visualGroups`.
- Fails with an address-grid renderer problem if it still nests `VisualToken`
  cards inside object cells.

Observed after adding the red audit rules:

```text
2026-07-06 pnpm audit:curriculum -> problemCount 35
```

The first failures named the nested `AddressGrid` renderer and affected
`logic-address-map`, `logic-position-map`, and `logic-route-steps` rounds.

## Implementation Check

Run:

```bash
pnpm audit:curriculum
pnpm build
git diff --check
```

Expected after implementation:

- `pnpm audit:curriculum` exits with zero problems.
- `pnpm build` exits successfully.
- `git diff --check` reports no whitespace problems.

Observed after data and renderer changes:

```text
2026-07-06 pnpm audit:curriculum -> problemCount 0
2026-07-06 pnpm build -> success
2026-07-06 git diff --check -> no output
```

## Browser Visual Check

Run:

```bash
pnpm dev
```

Open the app and inspect representative rounds in:

- `地图找宝物`
- `方位小地图`
- `路线听指令`

Expected:

- Each selected round shows one spatial answer surface.
- Grid object cells contain flat icons and labels without nested card frames.
- No character or object position in a scene image conflicts with the grid.

Observed:

- Desktop 1280x720 representative rounds for `地图找宝物`, `方位小地图`, and
  `路线听指令`: `sceneImageCards=0`, `nestedVisualTokens=0`, and overflow counts
  were `0`.
- Mobile 390x844 representative rounds for the same games:
  `sceneImageCards=0`, `nestedVisualTokens=0`, and overflow counts were `0`.
