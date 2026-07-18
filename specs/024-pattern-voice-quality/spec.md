# Feature Specification: Pattern Visual And Voice Quality

**Feature Branch**: `dev`

**Created**: 2026-07-18

**Status**: Draft

**Input**: User reports that some 找规律火车 images are not image-gen assets,
the large/medium/small circles are hard to distinguish in the stem and choices,
and some local audio sounds strange.

## User Scenarios & Testing

### User Story 1 - Coherent Local Pattern Cards (Priority: P1)

As a child playing 找规律火车, I see one coherent set of locally stored picture
cards in both the sequence and answer choices, so I can reason from the repeated
unit without being distracted by mixed emoji, inline drawings, or inconsistent
art styles.

**Why this priority**: The picture cards are the evidence surface of every
pattern round. Mixed rendering makes the rule harder to inspect and violates the
project's local-asset standard.

**Independent Test**: Open all 18 找规律火车 rounds on desktop and mobile-sized
screens and confirm every non-missing pattern card resolves to a registered
local PNG derived from an image-gen source.

**Acceptance Scenarios**:

1. **Given** any 找规律火车 sequence or choice, **When** a color disc, sun, moon,
   star, size disc, strawberry, or cookie is rendered, **Then** it uses a local
   registered PNG rather than emoji or inline SVG.
2. **Given** sequence and answer cards contain the same token, **When** both are
   displayed, **Then** they use the same asset and visual label.
3. **Given** the app is offline, **When** a pattern round opens, **Then** every
   required picture card still renders.

---

### User Story 2 - Distinguishable Size Progression (Priority: P1)

As a four-year-old comparing large, medium, and small circles, I can distinguish
the three sizes immediately in the main sequence and the choices without relying
only on tiny labels.

**Why this priority**: Size is the rule being assessed. If the three states look
nearly identical after responsive scaling, the question no longer has a fair
visual answer.

**Independent Test**: Review the large/medium/small circle cards at desktop and
375-pixel mobile widths and verify the occupied diameters form an obvious,
ordered progression while all cards keep the same outer canvas.

**Acceptance Scenarios**:

1. **Given** large, medium, and small circle cards side by side, **When** viewed
   without reading their labels, **Then** their occupied areas are clearly
   ordered large > medium > small.
2. **Given** the size-pattern stem and its answer choices, **When** responsive
   layout reduces the card width, **Then** the size hierarchy remains visible
   and no image is cropped or stretched.
3. **Given** a size distractor, **When** a child compares it with the missing
   position, **Then** the distractor differs only in the relevant size attribute,
   not by an unrelated object or decorative cue.

---

### User Story 3 - Complete And Natural Local Speech (Priority: P1)

As a child or parent using the audio controls, I hear complete, intelligible
Xiaoxiao narration that matches the visible text instead of clipped or unusually
short files.

**Why this priority**: A manifest entry can exist while the underlying audio is
truncated. Broken narration directly harms comprehension and cannot be left to
manual chance.

**Independent Test**: Scan every active manifest entry against its exported text,
regenerate every rejected file, and confirm the resulting pack has no missing,
undecodable, empty, or implausibly short entries.

**Acceptance Scenarios**:

1. **Given** a long Chinese voice line, **When** its generated duration is
   implausibly short for the spoken content, **Then** validation rejects it.
2. **Given** an invalid existing MP3, **When** voice generation runs, **Then** the
   file is regenerated instead of silently retained.
3. **Given** a generation attempt returns an undersized or invalid result,
   **When** retries are available, **Then** the bad output is removed and retried;
   otherwise it is recorded as a failure and excluded from a release-ready pack.
4. **Given** the final active pack, **When** it is audited, **Then** all exported
   lines have one matching manifest entry, the provider and voice are standard,
   failures and orphan files are empty, and media-quality validation passes.

### Edge Cases

- One-character choices naturally have short audio and must not be rejected by a
  rule intended for sentence-length narration.
- Numeric, Latin-letter, and punctuation-heavy lines need a separate spoken-unit
  estimate from Chinese sentence lines.
- A valid MP3 may use a stable bitrate but contain an unexpectedly long leading
  or trailing silence; validation must bound silence without removing natural
  pauses.
- Pattern assets must remain readable against the existing white card background
  and at both normal and compact rendering sizes.
- Generated sources may contain a background; runtime assets must have clean
  transparency and no text, watermark, cast shadow, or cropped edges.

## Requirements

### Functional Requirements

- **FR-001**: Every non-missing token used by `logic-pattern-train` MUST resolve
  to a registered local PNG at runtime.
- **FR-002**: Pattern-train runtime PNGs MUST have retained generation sources in
  the matching `public/images/items/source/` taxonomy.
- **FR-003**: Pattern-train sequence cards and choice cards MUST share the same
  token-to-asset mapping.
- **FR-004**: Large, medium, and small circle assets MUST use a common canvas and
  visibly distinct occupied diameters with large > medium > small.
- **FR-005**: The size-pattern answer set MUST contain the correct size exactly
  once and use only size-family distractors.
- **FR-006**: The curriculum audit MUST reject any pattern-train token that falls
  back to emoji or inline SVG.
- **FR-007**: The image registry audit MUST confirm every required runtime and
  source asset exists and each runtime pattern asset is a square PNG.
- **FR-008**: The standard voice generator MUST validate existing and newly
  generated files before retaining or manifesting them.
- **FR-009**: Voice validation MUST reject missing, undecodable, empty, truncated,
  or sentence-length audio that is implausibly short for its exported text.
- **FR-010**: Voice validation MUST avoid false failures for short choices,
  digits, clock values, and Latin grid addresses.
- **FR-011**: Failed generated output MUST be removed before retry so a partial
  file cannot satisfy a later existence check.
- **FR-012**: The release-ready voice manifest MUST use Edge
  `zh-CN-XiaoxiaoNeural`, rate `-12%`, pitch `+2Hz`, include all parent lines,
  contain zero failures, and match the current voice-line export.
- **FR-013**: Changed wording, if any, MUST be re-exported and its local audio
  regenerated before completion.
- **FR-014**: Maintained asset, build, changelog, and TODO documentation MUST
  describe the new pattern-card and voice-quality gates.
- **FR-015**: Completion MUST include desktop and mobile visual inspection of all
  pattern families plus build, curriculum audit, speech/asset tests, NAS release,
  and installed Mac app verification.

### Key Entities

- **Pattern Card Asset**: A semantic token, local runtime PNG, generation source,
  registry entry, accessible label, and compact/normal rendering behavior.
- **Size Card Family**: Three same-style circle assets with a common outer canvas
  and ordered occupied sizes.
- **Voice Media Finding**: A manifest entry, exported text, media path, measured
  duration/format, expected lower bound, and pass/fail reason.
- **Release Voice Pack**: The complete set of validated local media entries and
  generation metadata used before browser TTS fallback.

### Asset & Documentation Impact

- **Assets**: `public/images/items/pattern-train/`,
  `public/images/items/source/`, `public/audio/voice/zh-CN/`,
  `public/audio/voice-lines.json`, and `public/audio/voice/manifest.json`.
- **Docs**: `docs/assets.md`, `docs/build-generation-guide.md`,
  `docs/CHANGELOG.md`, `docs/TODO.md`, and this feature directory.
- **Audit Coverage**: Pattern-local-image checks, image registry/source checks,
  voice media validation, `pnpm test:voice-assets`, `pnpm test:speech`,
  `pnpm audit:curriculum`, `pnpm build`, `pnpm release:nas`, and
  `pnpm mac:install`.

## Success Criteria

### Measurable Outcomes

- **SC-001**: 100% of the 18 pattern-train rounds render all non-missing stem and
  choice tokens from registered local PNG assets.
- **SC-002**: Large, medium, and small circle occupied diameters differ by at
  least 25% between adjacent levels on a shared canvas and remain distinguishable
  at a 375-pixel viewport.
- **SC-003**: 100% of active voice manifest files decode successfully and pass
  text-aware duration validation; zero known truncated files remain.
- **SC-004**: Voice export count, manifest count, requested count, and runtime
  media count agree, with zero failures and zero orphan files.
- **SC-005**: Curriculum audit, targeted tests, production build, and NAS release
  complete with zero errors.
- **SC-006**: A visual review of all six pattern families confirms no missing,
  cropped, stretched, mixed-style, or ambiguous picture card.

## Assumptions

- The current six pattern families and 18-round progression remain in scope;
  this feature repairs presentation and audio quality rather than expanding the
  curriculum.
- Edge `zh-CN-XiaoxiaoNeural` remains the approved narration voice and browser
  TTS remains fallback-only.
- Existing image-gen strawberry, cookie, and star assets may be reused if they
  pass the same local registration and visual consistency checks.
- Image generation will be used for the requested pattern-card artwork, while
  deterministic local processing may crop, resize, and remove a flat chroma-key
  background.
