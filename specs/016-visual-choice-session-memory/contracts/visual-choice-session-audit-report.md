# Contract: Visual Choice And Session Audit Report

The curriculum audit must report renderer and storage failures with direct
source context.

## Visual Choice Problems

Example:

```text
ProgressiveSetGame should render exact visual-card choices without duplicated raw labels
```

Expected behavior:

- Fires when answer rendering still always combines `ChoiceCue` and raw
  `{choice.label}` for every choice.
- Clears when exact visual-card choices have a dedicated compact-card path while
  position labels remain visible.

## Matrix Nested Card Problems

Example:

```text
MatrixBoard renderer should use flat matrix-cell tokens instead of nested VisualToken cards
```

Expected behavior:

- Fires when `MatrixBoard` directly renders `VisualToken` inside `.matrix-cell`.
- Clears when matrix cells render flat matrix-cell tokens.

## Last Location Storage Problems

Example:

```text
storage should expose readLastPlayLocation and saveLastPlayLocation helpers
```

Expected behavior:

- Fires when storage helpers are missing.
- Fires when `App` does not read and save last play location.
- Clears when app startup and selection changes use the helpers.
