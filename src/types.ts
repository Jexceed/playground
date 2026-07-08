export type WorldId = "math" | "logic" | "graphic";

export type AbilityLevel = "L1" | "L2" | "L3" | "L4" | "L5" | "L6";

export type GameKind = "progressiveSet";

export type RoundOption = {
  label: string;
  value: string;
};

export type RoundVisualGroup = {
  label: string;
  items: string[];
  layout?: "counting" | "subitize";
};

export type RoundGrid = {
  columns: string[];
  rows: string[];
  cells: string[][];
};

export type RoundMatrix = {
  cells: string[][];
};

export type RoundMemory = {
  items: string[];
};

export type RoundSceneImage = {
  src: string;
  alt: string;
};

export type GraphicShapeId =
  | "apple"
  | "bear"
  | "cat"
  | "circle"
  | "diamond"
  | "dog"
  | "fish"
  | "flower"
  | "leaf"
  | "pear"
  | "rabbit"
  | "rounded-square"
  | "star"
  | "triangle";

export type GraphicFigure = {
  shape: GraphicShapeId;
  color?: string;
  mode?: "color" | "shadow" | "covered" | "detail" | "outline" | "missing" | "blank";
  cover?: "left" | "right" | "bottom" | "middle";
  detail?: "curve" | "ear" | "leaf" | "point" | "tail";
  gap?: "top" | "right" | "bottom" | "left";
  x?: number;
  y?: number;
  scale?: number;
  rotate?: number;
  opacity?: number;
};

export type GraphicFigureGroup = {
  label?: string;
  figures: GraphicFigure[];
  connector?: "arrow" | "plus" | "overlap" | "gap";
};

export type GraphicChallengeOption = {
  value: string;
  label: string;
  figure?: GraphicFigure;
  figures?: GraphicFigure[];
  nearMiss?: string;
};

export type RoundGraphicChallenge = {
  kind: "silhouette-match" | "covered-match" | "detail-match" | "layer-overlap" | "code-match" | "closure-match";
  stemLabel: string;
  figures: GraphicFigure[];
  groups?: GraphicFigureGroup[];
  options: GraphicChallengeOption[];
};

export type GameRound = {
  id: string;
  level: AbilityLevel;
  prompt: string;
  instruction: string;
  difficultyNote?: string;
  sceneImage?: RoundSceneImage;
  visualGroups?: RoundVisualGroup[];
  sequence?: string[];
  patternUnit?: string[];
  grid?: RoundGrid;
  matrix?: RoundMatrix;
  memory?: RoundMemory;
  graphicChallenge?: RoundGraphicChallenge;
  choices: RoundOption[];
  answer: string;
  success: string;
  retry: string;
  parentPrompt: string;
  abilityTags: string[];
};

export type GameConfig = {
  id: string;
  kind: GameKind;
  world: WorldId;
  title: string;
  subtitle: string;
  goal: string;
  parentPrompt: string;
  abilityTags: string[];
  level: AbilityLevel;
  rounds: GameRound[];
};

export type ProgressLog = {
  completedIds: string[];
  completedRoundIds: string[];
  abilityTags: string[];
};

export type LastPlayLocation = {
  worldId: WorldId;
  gameId: string;
  roundIndex: number;
};
