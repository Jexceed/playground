# Data Model: Map Visual Surface Quality

## Spatial Round

Represents a round in `logic-address-map`, `logic-position-map`, or
`logic-route-steps`.

Fields relevant to this feature:

- `sceneImage`: must be absent when the round has `grid` or `visualGroups`.
- `grid`: the authoritative answer surface for address, route, neighbor, and
  relative-direction rounds.
- `visualGroups`: the authoritative answer surface for position-map
  inside/outside rounds.
- `prompt`, `choices`, `answer`, `success`, `retry`, `parentPrompt`: unchanged by
  this feature unless a directly related verification failure is found.

Validation rules:

- A spatial round with `grid` must not also have `sceneImage`.
- A spatial round with `visualGroups` must not also have `sceneImage`.
- Existing answer-logic audits continue to validate grid shape, answer
  derivation, choices, and wording.

## Flat Grid Token

Represents the icon-and-label content rendered inside an address-grid object
cell.

Fields:

- `value`: the source item string from a grid cell.
- `label`: the child-facing label from visual metadata or the raw value.
- `kind`: optional visual glyph kind from existing visual metadata.

Validation rules:

- The renderer must not place a full `VisualToken` inside an address object
  cell.
- The rendered token must keep an accessible label and click-to-speak behavior.

## Visual-Surface Finding

Represents an audit problem.

Fields:

- `context`: game id and round id, or renderer-level source context.
- `message`: specific rule violated.

Validation rules:

- Findings must be specific enough to locate the affected round or renderer.
