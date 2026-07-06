# Contract: Map Visual Surface Audit Report

The curriculum audit must report visual-surface failures using existing problem
strings.

## Spatial Surface Problems

Example:

```text
logic-position-map/logic-position-map-1: spatial map round should use one answer surface; remove sceneImage when grid or visual groups provide the answer surface
```

Expected behavior:

- Includes the game id and round id for content data problems.
- Fires for `logic-address-map`, `logic-position-map`, and `logic-route-steps`
  when a round has `sceneImage` plus `grid` or `visualGroups`.
- Does not fire for non-spatial games that intentionally combine scene images
  with other visual aids.

## Nested Grid Card Problems

Example:

```text
AddressGrid renderer should use flat map-cell tokens instead of nested VisualToken cards
```

Expected behavior:

- Fires when the address grid renderer directly renders a full `VisualToken`
  from `grid.cells`.
- Clears when address-grid object cells use a dedicated flat map-cell token.
