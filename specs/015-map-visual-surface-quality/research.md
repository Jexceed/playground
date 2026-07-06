# Research: Map Visual Surface Quality

## Decision: Use one authoritative spatial surface per map round

**Rationale**: Four-year-old users need to point to one visible surface and
explain the answer. When a decorative scene image and a separate answer grid
both express positions, the task becomes ambiguous even if the data answer is
correct.

**Alternatives considered**:

- Generate exact 1200x675 scene images from every grid. Rejected for this pass
  because it adds asset volume and increases the chance of future mismatch.
- Overlay labels and grids on the scene image. Rejected because responsive
  alignment would be brittle and harder to audit.
- Keep scene images and only flatten grid styling. Rejected because it fixes
  visual density but not conflicting spatial evidence.

## Decision: Remove scene images from affected grid/group rounds

**Rationale**: The existing grids and visual groups already contain the data
needed for address, route, and position reasoning. Removing the scene image is
the smallest change that makes the answer source unambiguous.

**Alternatives considered**:

- Replace scenes with neutral non-positional decorations. Rejected because the
  existing vector backdrop already appears when no `sceneImage` is present.
- Keep address-map treasure art above the grid. Rejected because it creates two
  maps on the same screen.

## Decision: Render address-grid items with flat tokens

**Rationale**: A map grid cell already has a border and position. A full
`VisualToken` card inside that cell adds a second frame and competes with row
and column structure. A flat icon with a short label keeps click-to-speak while
preserving the grid as the primary surface.

**Alternatives considered**:

- Remove all cell borders and keep card tokens. Rejected because the row-column
  grid would be weaker for address and route reasoning.
- Keep card tokens but shrink them. Rejected because nested framing remains.
