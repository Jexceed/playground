# Feature Specification: Curriculum Integrity

**Feature Branch**: `dev`

**Created**: 2026-07-12

**Status**: Approved

**Input**: Review and correct narration, question logic, distractor quality,
answer-position bias, and clock-reading wording across the current curriculum.

## User Scenarios & Testing

### User Story 1 - Think Instead of Memorize (Priority: P1)

As a child replaying a game, I need correct choices to move between positions in
a stable, balanced pattern so I inspect evidence rather than memorize the first
button.

**Why this priority**: Position bias invalidates the thinking exercise across
the curriculum.

**Independent Test**: Audit every game by choice count and confirm all available
positions are used evenly without breaking graphic A/B/C/D mappings.

**Acceptance Scenarios**:

1. **Given** three-choice rounds, **When** they load, **Then** position counts
   differ by at most one.
2. **Given** a graphic round, **When** its answer moves, **Then** button value,
   drawn option, accessible meaning, and A/B/C/D label stay aligned.
3. **Given** the same build and round, **When** reopened, **Then** order is stable.

---

### User Story 2 - Follow Coherent Evidence (Priority: P1)

As a child and parent, I need prompt, visual evidence, choices, answer, feedback,
and parent guidance to support the same conclusion.

**Why this priority**: Weak or answer-leaking questions teach the wrong reasoning.

**Independent Test**: Audit and manually inspect corrected bridge, rotation,
evidence, priority, and clock rounds.

**Acceptance Scenarios**:

1. **Given** a bridge round, **When** distance and materials are compared,
   **Then** exactly one option is supported and the instruction does not state it.
2. **Given** spilled water, **When** evidence is sought, **Then** the task asks
   where to inspect for direct traces and does not equate proximity with guilt.
3. **Given** a clock round, **When** guidance is read, **Then** it introduces the
   hour hand (short hand) before the minute hand (long hand).
4. **Given** a changed L5/L6 round, **When** wrong options are reviewed, **Then**
   each is a plausible misread or weaker action rather than unrelated noise.

---

### User Story 3 - Hear One Auditable Voice (Priority: P2)

As a family using web or Mac, I need an intentional local voice policy without
stale fallback files in the release package.

**Why this priority**: Unexplained voices reduce clarity and auditability.

**Independent Test**: Compare export, manifest, provider metadata, referenced
files, and packaged audio directories.

**Acceptance Scenarios**:

1. **Given** exported lines, **When** generated, **Then** all entries use Edge
   Xiaoxiao and failures are empty.
2. **Given** launch, **When** sound plays, **Then** it uses a dedicated local
   Xiaoxiao-derived asset outside the curriculum manifest.
3. **Given** the manifest, **When** assets are audited, **Then** no obsolete macOS
   or unreferenced narration remains.
4. **Given** failed local audio, **When** narration is requested, **Then** browser
   speech synthesis remains fallback-only.

### Edge Cases

- Balance rounds separately when one game uses different choice counts.
- Buckets smaller than their choice count may leave positions unused while the
  maximum count difference remains one.
- Graphic options reorder as a unit with accessible labels and near-miss data.
- Voice pruning never removes manifests, exports, brand audio, or referenced files.
- Wording changes require fresh voice export and standard generation.

## Requirements

### Functional Requirements

- **FR-001**: Correct answer positions MUST be deterministic, not session-random.
- **FR-002**: Within each game and choice-count bucket, position counts MUST
  differ by no more than one.
- **FR-003**: One correct position MUST NOT repeat over two consecutive rounds in
  the same bucket.
- **FR-004**: Graphic reordering MUST align choice value, drawing, accessible
  meaning, and A/B/C/D label.
- **FR-005**: Prompts and instructions MUST NOT reveal the correct choice.
- **FR-006**: Corrected distractors MUST be plausible misunderstandings, near
  misses, or weaker strategies.
- **FR-007**: Evidence rounds MUST distinguish direct evidence from proximity or
  mere presence.
- **FR-008**: Bridge rounds MUST provide enough evidence for one best plan.
- **FR-009**: All clock guidance MUST introduce hour hand (short hand) before
  minute hand (long hand).
- **FR-010**: Curriculum audio MUST use Edge `zh-CN-XiaoxiaoNeural`, rate `-12%`,
  pitch `+2Hz`, with export/manifest alignment and zero failures.
- **FR-011**: Launch audio MUST remain outside the curriculum manifest and use a
  documented Xiaoxiao source until an approved real child recording exists.
- **FR-012**: A repeatable command MUST safely prune unreferenced narration.
- **FR-013**: Curriculum audit MUST fail on position, graphic, semantic, clock,
  provider, failure, or orphan-voice regressions.
- **FR-014**: Release validation MUST include build, audit, speech tests, NAS
  release, and real Mac application installation.

### Key Entities

- **Choice Bucket**: Rounds in one game with the same choice count.
- **Balanced Round**: A round whose choices and optional graphic options move together.
- **Voice Reference Set**: Runtime narration paths referenced by the manifest.
- **Integrity Finding**: A game/round or asset failure reported by the audit.

### Asset & Documentation Impact

- **Assets**: Regenerate launch WAV, voice export, manifest, and changed Edge
  files; remove unreferenced files below `public/audio/voice/zh-CN/`.
- **Docs**: Update feature artifacts, changelog, TODO, assets, and generation guide.
- **Audit Coverage**: `pnpm test:voice-assets`, `pnpm audit:curriculum`,
  `pnpm test:speech`, `pnpm build`, `pnpm release:nas`, `pnpm mac:install`.

## Success Criteria

### Measurable Outcomes

- **SC-001**: All 489 rounds pass distribution checks with max-minus-min <= 1.
- **SC-002**: No multi-round bucket keeps every correct answer first.
- **SC-003**: All identified answer leakage, bridge ambiguity,
  proximity-as-proof, and clock-order findings are removed and guarded.
- **SC-004**: Export count equals manifest request count, failures are zero, and
  100% of entries use the standard Edge Xiaoxiao directory.
- **SC-005**: Runtime voice directories contain zero unreferenced files.
- **SC-006**: Build, audit, speech, NAS release, and Mac install succeed freshly.

## Assumptions

- Stable deterministic ordering is preferred for reproducible parent review.
- Existing scenes remain authoritative unless unable to support corrected logic.
- Launch audio is a brand sound, not a curriculum line.
- A real child chorus is outside this feature; Xiaoxiao is the interim source.

