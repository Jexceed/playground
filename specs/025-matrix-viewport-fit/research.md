# Research: Matrix Puzzle Viewport Fit

## Decision: Remove The Redundant Scene Instead Of Shrinking Everything

**Rationale**: At 1280x720 the scene consumes 361 pixels and the matrix consumes
294 pixels, producing a 689-pixel board and a 989-pixel document. The matrix
already contains all evidence required by every rule. Removing the scene reduces
height while preserving readable cells and eliminates competing visual evidence.

**Alternatives considered**:

- Scale both surfaces down: rejected because cell labels and combined tokens
  would become harder for a four-year-old to inspect.
- Place scene and matrix side by side: rejected because the scene is not needed
  to solve the question and would still divide attention.
- Hide the scene only with CSS: rejected because it would remain in the content
  model and accessibility tree and could regress in another renderer.

## Decision: Guard The Content Model In Curriculum Audit

**Rationale**: A semantic audit rule prevents future content edits from stacking
a decorative scene above the authoritative matrix again.

**Alternatives considered**:

- Screenshot-only regression: useful for verification but less direct and more
  fragile than enforcing the content invariant.

## Decision: Align The Desktop Navigation Height With The Shell Inset

**Rationale**: After removing the redundant scene, the only remaining overflow
was 8 pixels. The sticky navigation reserved 14 pixels per edge while the
application shell uses 18 pixels per edge. Using the actual 36-pixel total inset
removes the global desktop scrollbar without shrinking question content.

**Alternatives considered**:

- Leave the 8-pixel scroll: rejected because it violates the one-viewport
  acceptance criterion and leaves an avoidable scrollbar on every desktop game.
