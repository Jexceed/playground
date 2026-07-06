# Data Model: Visual Choice And Session Memory

## Visual Card Choice

Represents a choice whose label can be parsed into visual glyph parts.

Validation rules:

- Exact-match visual-card choices render as compact visual cards.
- Position choices remain readable text.
- Click, selected, correct, and wrong states remain attached to the outer
  answer button.

## Flat Matrix Token

Represents cell content inside `MatrixBoard`.

Validation rules:

- Does not render a full `.visual-token` card inside `.matrix-cell`.
- Supports single glyphs, multi-glyph combinations, and text fallback.
- Speaks a child-facing label when clicked.

## Last Play Location

Stored shape:

```ts
{
  worldId: "math" | "logic";
  gameId: string;
  roundIndex: number;
}
```

Validation rules:

- `worldId` must be a known world.
- `gameId` must exist and belong to `worldId`.
- `roundIndex` is clamped to the selected game's round range.
- Corrupt JSON or invalid shapes return `null`.
