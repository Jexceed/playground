# Visual Choice And Session Memory Design

## Scope

This design covers three user-approved improvements:

- Improve `一模一样在哪里` answer choice display.
- Remove nested card frames from `图形补一补` matrix cells.
- Restore the last opened world, game, and round on app startup.

It does not rewrite round content, change answers, or add new image/audio
assets.

## Approach

Exact visual-match choices that are themselves visual cards will render as a
compact card inside the answer button. The raw token label will not be printed a
second time. Position choices such as `左边这张` remain text-first because those
answers refer to position, not card contents.

Matrix cells will use a flat token renderer, similar to the map-cell renderer
from `015-map-visual-surface-quality`. The matrix grid remains the visual
surface; the content inside each cell becomes icon/label material without a
nested card border.

Last opened location will be stored separately from progress as
`{ worldId, gameId, roundIndex }`. Startup validates the saved data against the
current `games` list and clamps invalid round indexes. Progress reset will not
clear the last opened location.

## Validation

The curriculum audit will add source checks for:

- exact visual-card choices no longer using the duplicated cue-plus-raw-label path;
- `MatrixBoard` no longer nesting `VisualToken` inside `.matrix-cell`;
- storage and app code exposing and using last-location helpers.

Final verification includes `pnpm audit:curriculum`, `pnpm build`,
`git diff --check`, and browser checks for visual-match, matrix puzzle, and
reload persistence on desktop/mobile representative views.
