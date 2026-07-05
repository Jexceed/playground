# Research: Pattern-Train Logic Quality

## Decision: Audit From Explicit Repeat Unit Metadata

**Rationale**: The current generator knows each pattern's unit before it creates
the visible sequence. Persisting that unit on each generated round gives the
audit a reliable source for deriving the missing answer and checking wording.

**Alternatives considered**:

- Infer the unit from the first few visible cards. This breaks when the missing
  card appears at the front.
- Check only that the answer is present in choices. That misses the core
  pattern reasoning problem.

## Decision: Distractors Should Come From The Pattern Unit First

**Rationale**: For a 4-year-old, the best wrong answers are usually "the card
before" or "the card after" in the repeat unit. They represent real mistakes and
can be explained by a parent. Unrelated global filler choices are visually noisy
and weaken the task.

**Alternatives considered**:

- Keep a global pool of choices. This caused unrelated options for food patterns.
- Generate random distractors. Randomness is harder to audit and can create
  duplicate or unfair options.

## Decision: Feedback Should Name Unit, Filled Sequence, And Answer

**Rationale**: Pattern solving is often auditory for preschoolers: they say the
chunk aloud and land on the blank. Naming only the abstract rule does not give
parents enough material to ask "why".

**Alternatives considered**:

- Keep short feedback like "规律是红蓝". This is concise but too weak for parent
  follow-up.
- Add long explanations per case. The generator can produce concrete wording
  without manual per-round duplication.

## Decision: No New Image Assets For This Slice

**Rationale**: `logic-pattern-train` already uses visual token sequences, and
the issue is relationship quality between sequence, choices, text, and audio.
Adding scenes would increase scope without solving the core gap.

**Alternatives considered**:

- Create a new train scene image. Useful later, but not required for an audited
  quality pass.
