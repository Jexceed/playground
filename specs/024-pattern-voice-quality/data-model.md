# Data Model: Pattern Visual And Voice Quality

## PatternCardAsset

- `token`: Stable value used in round sequences and choices.
- `label`: Child-facing and accessible Chinese name.
- `galleryKey`: Stable `imageGallery.items` key.
- `runtimeSrc`: Registered transparent 256x256 PNG.
- `sourceSrc`: Image-gen source sheet retained under the item source taxonomy.
- `family`: `color-disc`, `sky`, `size-disc`, or `snack`.
- `occupiedDiameter`: Required for the three size-disc variants.

Validation:

- Every non-`?` token in `logic-pattern-train` has one mapping.
- Runtime and source paths exist.
- Runtime media is square PNG with alpha.
- Sequence and choice rendering resolve through the same mapping.
- Size-disc occupied diameters are strictly ordered and differ by at least 25%.

## VoiceMediaInspection

- `path`: Local path referenced by a manifest entry.
- `text`: Exact exported line text.
- `frameCount`: Count of complete compatible MP3 frames.
- `sampleRate`: Parsed MP3 sample rate.
- `bitrateKbps`: Parsed MP3 bitrate.
- `durationSeconds`: Duration derived from complete frames.
- `hanCount`: Count of Chinese characters used for sentence calibration.
- `minimumDurationSeconds`: Text-aware conservative lower bound.
- `problems`: Zero or more stable finding codes/messages.

Validation:

- At least one complete MP3 frame exists and no truncated final frame is used.
- Duration is positive.
- For eight or more Han characters, duration is at least
  `hanCount * 0.18` seconds.
- Short choices, clock values, digits, and Latin addresses use only the absolute
  media-validity floor.

## ReleaseVoicePack

- `provider`, `voice`, `rate`, `pitch`, `includeParent`, `format`
- `count`, `requestedCount`, `failures`
- `entries[]`: `id`, `kind`, `text`, `src`

Validation:

- Metadata equals the project standard.
- Export, requested, manifest, and runtime-file counts agree.
- Each exported line maps to exactly one entry.
- Every entry has a passing `VoiceMediaInspection`.
- Failures and orphan files are empty.

## State Transitions

```text
existing file
  -> inspect
  -> valid: retain and manifest
  -> invalid: delete
      -> generate temporary/output file
      -> inspect
      -> valid: retain and manifest
      -> invalid: delete and retry
      -> retries exhausted: record failure, do not manifest
```
