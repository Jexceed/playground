# Research: Curriculum Integrity

## Deterministic construction-time balancing

**Decision**: Move answers by ordinal within each game/choice-count bucket.

**Rationale**: Even distribution with reproducible review, screenshots, speech,
and bug reports.

**Rejected**: Runtime shuffle changes the same round between visits. Manual order
is easy to regress when content grows.

## Graphic options move with choices

**Decision**: Reorder `choices` and `graphicChallenge.options` by shared value,
then regenerate A/B/C/D labels.

**Rationale**: Choice-only reordering would accept a value different from the
drawn card.

## Target confirmed semantic defects

**Decision**: Correct answer leakage, bridge ambiguity, proximity-as-proof, and
clock order without rewriting coherent content.

**Rationale**: Keeps the change reviewable and limits voice churn.

## Standardize active and launch voice family

**Decision**: Keep curriculum on Edge Xiaoxiao and regenerate the dedicated
launch asset from Xiaoxiao.

**Rationale**: Curriculum is already complete and correct; Xiaoyi launch audio
is the unexplained audible exception. Browser TTS is not auditable, synthetic
layering sounded unnatural, and a real child chorus remains future work.

## Prune from manifest references

**Decision**: Add a dry-run-by-default Node command which deletes only locale
voice files absent from manifest entry and segment paths.

**Rationale**: Manual deletion is not repeatable; deleting full directories can
lose valid partial output after a generation failure.

