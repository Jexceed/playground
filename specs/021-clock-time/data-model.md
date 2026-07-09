# Data Model: Clock-Time Reading

## Clock-Time Game

- `id`: stable value `math-clock-time`
- `world`: `math`
- `title`: user-facing name, expected `时钟小管家`
- `subtitle`: child-facing summary of reading clock hands and electronic clock time
- `goal`: parent-facing learning objective
- `parentPrompt`: global parent prompt for the game
- `abilityTags`: includes `认识时钟`, `整点半点`, and `24小时制`
- `rounds`: exactly 12 Clock Rounds

## Clock Round

- `id`: generated from game id and round index
- `level`: expected L3-L5 for this first pass
- `prompt`: asks the child to read the clock or choose the 24-hour electronic clock time
- `instruction`: names the intended strategy
- `clockChallenge`: one Clock Visual Surface
- `choices`: at least three options, answer exactly once
- `answer`: choice value
- `success`: explains clock-hand or scene-to-24-hour evidence
- `retry`: points back to long hand, short hand, scene activity, or 24-hour choices
- `parentPrompt`: asks the parent to have the child explain the evidence
- `abilityTags`: includes one or more of `整点`, `半点`, `24小时制`, `生活时间`
- `difficultyNote`: names the reasoning load

## Clock Visual Surface

- `hour`: integer 1-12
- `minute`: allowed values 0 or 30
- `mode`: `read-time` or `time-conversion`
- `label`: short visible caption for the clock surface
- `activity`: optional daily routine clue stored for feedback in time-conversion rounds

## Validation Rules

- `clockChallenge.minute` must be 0 or 30.
- `read-time` rounds must have success, retry, and parent prompts naming both
  `长针` and `短针`.
- `time-conversion` rounds must include a registered 1200x675 scene image,
  `activity`, `HH:MM` choices, and feedback naming scene evidence plus 24-hour
  conversion.
- `time-conversion` prompt, instruction, visible context, and choices must not
  reveal day-part labels before answering.
- `math-clock-time` must have exactly 12 rounds.
- At least four rounds must have minute 0, at least four must have minute 30,
  and at least four must use `time-conversion` mode.
- Round signatures include prompt, instruction, clock challenge, choices, and
  answer to reject duplicates.
