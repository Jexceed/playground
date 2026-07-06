# Data Model: Memory Camera Visual Surface

## Memory Slot

Represents one visible or covered card position in `记忆小相机`.

Fields:

- `value`: Original item string from `round.memory.items`.
- `label`: Child-readable label used for speech and visible text.
- `kind`: Existing visual glyph kind when the item is known.
- `covered`: Whether the item has been hidden by the camera cover action.

Validation:

- `value` must be a non-empty string.
- `label` must be non-empty.
- Covered slots use the fixed label `遮住了`.

## Memory Camera Round

Existing game round that owns memory slots.

Fields used by this feature:

- `memory.items`: Ordered list of memory slot values.
- `choices`: Existing answer choices, unchanged by this feature.
- `answer`, `success`, `retry`, `parentPrompt`: Existing educational content,
  unchanged by this feature.
