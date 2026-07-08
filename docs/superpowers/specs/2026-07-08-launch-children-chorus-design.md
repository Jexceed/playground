# Launch Brand Shout Design

## Goal

Replace the app launch voice with a dedicated local brand shout for
`小小思考屋`, and retime the launch animation so the logo arrival and audio feel
like one branded opening moment.

## Direction

The desired final direction is an "幼儿园小朋友齐喊" style. The current Codex
environment does not expose a native high-quality child chorus generation
model, and simple Edge TTS layering sounded unnatural. The safe runtime asset is
therefore a clean, lively local brand shout that can be replaced later by a
real or higher-quality AI-generated child chorus recording.

## Audio Architecture

The launch sound is a brand asset, not a curriculum voice line. It lives under
`public/audio/brand/` and is played directly by the launch splash. It should not
use `speak("小小思考屋")`, because that routes through the normal question-bank
voice manifest and produces a single narrator voice.

The generated runtime file is:

```text
public/audio/brand/launch-brand-shout.wav
```

Intermediate generated source files live outside the runtime package under:

```text
references/audio/launch-brand-shout/
```

## Animation Timing

The launch page starts visually, then plays the brand shout shortly after the
logo appears. The splash should stay on screen long enough for the shout to
finish, then fade into the app without requiring a click.

## Verification

`pnpm audit:curriculum` must fail if the launch splash regresses to
`speak("小小思考屋")`, if the brand audio file is missing, or if the splash no
longer references the dedicated brand asset.
