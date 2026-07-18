# Research: Pattern Visual And Voice Quality

## Decision: Use one coherent image-gen sticker sheet as the source

**Rationale**: The current pattern families mix emoji, inline SVG, and local PNG.
A single source sheet modeled on the existing graphic-workshop sticker style
gives the sequence and choices consistent lighting, outline weight, texture, and
padding. It also follows an established project asset workflow.

**Alternatives considered**:

- Keep simple colored circles as SVG. Rejected because the user explicitly
  identified mixed non-image-gen pattern cards as incomplete.
- Generate a complete scene for every round. Rejected because the sequence cards
  themselves carry the rule; a scene would duplicate or distract from evidence.
- Generate each of 12 cards separately. Rejected because style drift is more
  likely and source maintenance is noisier than one audited sheet.

## Decision: Derive size variants from one generated purple token

**Rationale**: Generating three independent circles can introduce unrelated
texture, border, or shape differences. Cropping one generated token and placing
it at fixed occupied diameters on identical 256x256 transparent canvases makes
size the only varying attribute. Target diameters are 196, 124, and 64 pixels,
which exceed the 25% adjacent-difference requirement.

**Alternatives considered**:

- Keep radii 29, 22, and 16 in a 96-unit SVG. Rejected because the current
  responsive presentation makes adjacent levels ambiguous.
- Add written 大/中/小 inside the pictures. Rejected because the task should be
  solvable visually and not reveal the assessed attribute through text.
- Give each size a different color. Rejected because that adds a second rule and
  weakens the distractor.

## Decision: Validate MP3 frames and text-aware minimum duration

**Rationale**: File size greater than 1 KB does not prove complete speech. The
active Edge files use MPEG-2 Layer III at 24 kHz and 48 kbps. A lightweight
frame scan can prove decodability and duration without a platform-specific
binary. Calibration shows normal Chinese sentence lines begin near 0.248 seconds
per Han character, while six outliers fall between 0.047 and 0.138. A conservative
0.18-second-per-Han floor for lines with at least eight Han characters separates
the known broken files with margin.

**Alternatives considered**:

- Check only byte size. Rejected because the current 5 KB truncated file passes
  the existing 1 KB test.
- Require ffmpeg/ffprobe at audit time. Rejected because the project also builds
  on Windows runners and static/NAS workflows where that binary is not a declared
  dependency.
- Speech-to-text every generated file. Rejected because it is slow, adds a model
  dependency, and is unnecessary for detecting the observed truncation class.

## Decision: Validate before reuse and after every generation attempt

**Rationale**: Existing bad media must not be silently kept. Newly written
partial files must be deleted before retry, otherwise the next pass can mistake
them for valid cached output. Only media that passes the shared inspector is
eligible for the manifest.

**Alternatives considered**:

- Add a separate audit only after generation. Rejected because it reports the
  defect but leaves retry behavior unsafe.
- Force-regenerate all 1,801 files on every run. Rejected because valid local
  speech is expensive to regenerate and the validator can precisely select bad
  files.

## Baseline Findings

- `pnpm audit:curriculum`: 489 rounds, zero reported problems.
- Pattern-train non-PNG families: colored discs, sun/moon, and size circles.
- Known duration failures below the calibrated threshold: six.
- Worst failure: `这题只看颜色。圆形篮子是看形状时才用的。` is 0.84 seconds
  for 18 Han characters.
- Current manifest metadata is otherwise standard Edge Xiaoxiao with 1,801
  requested and manifested entries and zero recorded generation failures.
