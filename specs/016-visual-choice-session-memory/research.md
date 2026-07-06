# Research: Visual Choice And Session Memory

## Decision: Use compact visual-choice rendering for exact-match card options

**Rationale**: Exact-match choices are themselves visual cards. Showing both a
small cue and raw token text duplicates the same evidence. A compact card cue
keeps the comparison visual and easier for young children.

**Alternatives considered**:

- Keep text and only shrink icons. Rejected because duplicate evidence remains.
- Rewrite all exact-match labels to prose. Rejected because it makes visual
  comparison less direct.

## Decision: Keep position choices textual

**Rationale**: Odd-card rounds answer by position, not card content. Text labels
such as "左边这张" are clear and should not be replaced with content-like icons.

**Alternatives considered**:

- Render arrows only. Rejected because children and parents benefit from the
  readable position word.

## Decision: Share a flat token renderer pattern for matrix cells

**Rationale**: Matrix cells and address-grid cells are both containers. Flat
icon/label content avoids nested card frames while preserving click-to-speak.

**Alternatives considered**:

- Remove matrix cell borders and keep cards. Rejected because the matrix grid
  itself is the reasoning surface.

## Decision: Store last play location separately from progress

**Rationale**: Progress reset clears achievement records, but users may still
want the app to open where they were browsing. Separate storage keeps behavior
predictable and backward compatible.

**Alternatives considered**:

- Add last location fields to `ProgressLog`. Rejected because reset semantics
  would become ambiguous.
