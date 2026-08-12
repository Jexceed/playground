export type AbilityLevel = "L1" | "L2" | "L3" | "L4" | "L5" | "L6";

export type MathChoice = { label: string; value: string };
export type VisualGroup = { label: string; items: string[]; layout?: "counting" | "subitize" };
export type SceneImage = { src: string; alt: string };
export type ClockChallenge = {
  hour: number;
  minute: 0 | 30;
  mode: "read-time" | "time-conversion";
  label: string;
  activity?: string;
};
export type VoiceReference = { id: string; text: string; src: string };

export type MathRound = {
  id: string;
  level: AbilityLevel;
  prompt: string;
  instruction: string;
  difficultyNote: string;
  sceneImage?: SceneImage;
  visualGroups?: VisualGroup[];
  clockChallenge?: ClockChallenge;
  choices: MathChoice[];
  answer: string;
  success: string;
  retry: string;
  parentPrompt: string;
  abilityTags: string[];
  voice: {
    prompt: VoiceReference;
    success: VoiceReference;
    retry: VoiceReference;
    parent: VoiceReference;
    choices: Record<string, VoiceReference>;
  };
};

export type MathGame = {
  id: string;
  title: string;
  subtitle: string;
  goal: string;
  parentPrompt: string;
  abilityTags: string[];
  level: AbilityLevel;
  voice: { title: VoiceReference; goal: VoiceReference };
  rounds: MathRound[];
};

export type TokenRenderer =
  | { kind: "image"; source: string; src: string; label: string }
  | { kind: "shape"; shape: "circle" | "rounded-square"; color: string; label: string }
  | { kind: "empty"; label: string };

export type MathIslandCatalog = {
  schemaVersion: 1;
  generatedAt: string;
  sourceRevision: string;
  world: { id: "math"; name: "数字岛"; summary: string; gameCount: 8; roundCount: 122 };
  games: MathGame[];
  tokenRenderers: Record<string, TokenRenderer>;
  brandImage: string;
  contentDigest: string;
};

export type RoundState = "idle" | "selected" | "checking" | "retry" | "correct" | "complete";
