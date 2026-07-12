import { ArrowRight, Check, RotateCcw } from "lucide-react";
import { Fragment, useEffect, useId, useMemo, useRef, useState } from "react";
import type { CSSProperties } from "react";
import { GuideMascot } from "../components/GuideMascot";
import { VisualGlyph, VisualToken, visualMetaFor, visualParts } from "../components/VisualToken";
import { imageGallery } from "../data/imageGallery";
import { playTone, speak } from "../speech";
import type { GameConfig, GameRound, GraphicChallengeOption, GraphicFigure, GraphicFigureGroup } from "../types";

export function ProgressiveSetGame({
  game,
  requestedRoundIndex,
  requestedRoundReadKey,
  onComplete,
  onRoundComplete,
  onRoundIndexChange,
}: {
  game: GameConfig;
  requestedRoundIndex: number;
  requestedRoundReadKey: number;
  onComplete: () => void;
  onRoundComplete: (roundId: string, tags: string[]) => void;
  onRoundIndexChange: (index: number) => void;
}) {
  const [roundIndex, setRoundIndex] = useState(0);
  const [selected, setSelected] = useState<string | null>(null);
  const [answered, setAnswered] = useState(false);
  const [retryMessage, setRetryMessage] = useState<string | null>(null);
  const [completedOnce, setCompletedOnce] = useState(false);
  const [memoryCovered, setMemoryCovered] = useState(false);
  const [subitizeVisible, setSubitizeVisible] = useState(true);
  const lastRoundReadKey = useRef(0);

  useEffect(() => {
    setRoundIndex(0);
    setSelected(null);
    setAnswered(false);
    setRetryMessage(null);
    setCompletedOnce(false);
    setMemoryCovered(false);
    setSubitizeVisible(true);
  }, [game.id]);

  useEffect(() => {
    const nextIndex = Math.min(Math.max(requestedRoundIndex, 0), game.rounds.length - 1);
    const shouldReadRequestedRound = requestedRoundReadKey !== lastRoundReadKey.current;
    if (shouldReadRequestedRound) lastRoundReadKey.current = requestedRoundReadKey;
    if (nextIndex !== roundIndex) {
      setRoundIndex(nextIndex);
      setSelected(null);
      setAnswered(false);
      setRetryMessage(null);
      setMemoryCovered(false);
      setSubitizeVisible(true);
    }
    if (shouldReadRequestedRound) {
      const requestedRound = game.rounds[nextIndex];
      if (requestedRound) speak(joinVoiceLine(requestedRound.prompt, requestedRound.instruction));
    }
  }, [game.rounds, requestedRoundIndex, requestedRoundReadKey, roundIndex]);

  const round = game.rounds[roundIndex];
  const isCorrect = answered && selected === round.answer;
  const isLastRound = roundIndex === game.rounds.length - 1;
  const isSubitizeRound = game.id === "math-subitize-match";
  const subitizeCoverStartIndex = Math.max(0, game.rounds.length - 5);
  const shouldAutoCoverSubitize = isSubitizeRound && roundIndex >= subitizeCoverStartIndex;

  useEffect(() => {
    if (!shouldAutoCoverSubitize || !subitizeVisible) return;
    const timer = window.setTimeout(() => setSubitizeVisible(false), 1250);
    return () => window.clearTimeout(timer);
  }, [round.id, shouldAutoCoverSubitize, subitizeVisible]);

  const completedTags = useMemo(
    () => Array.from(new Set(game.rounds.slice(0, roundIndex + (isCorrect ? 1 : 0)).flatMap((item) => item.abilityTags))),
    [game.rounds, isCorrect, roundIndex],
  );

  function choose(value: string) {
    if (answered) return;
    if (round.memory && !memoryCovered) {
      playTone("notice");
      speak("先看一看，记住以后再遮住。");
      return;
    }
    const choice = round.choices.find((item) => item.value === value);
    playTone("tap");
    if (choice) speak(labelForVoice(choice.label));
    setSelected(value);
    setRetryMessage(null);
  }

  function checkAnswer() {
    if (!selected) return;
    if (selected === round.answer) {
      setAnswered(true);
      setRetryMessage(null);
      onRoundComplete(round.id, round.abilityTags);
      playTone("success");
      speak(round.success);
    } else {
      setAnswered(false);
      setRetryMessage(round.retry);
      setSelected(null);
      playTone("error");
      speak(round.retry);
    }
  }

  function nextRound() {
    if (!isCorrect) return;
    if (isLastRound) {
      if (!completedOnce) {
        setCompletedOnce(true);
        onComplete();
      }
      return;
    }
    const nextIndex = roundIndex + 1;
    const requestedRound = game.rounds[nextIndex];
    setRoundIndex(nextIndex);
    onRoundIndexChange(nextIndex);
    setSelected(null);
    setAnswered(false);
    setRetryMessage(null);
    setMemoryCovered(false);
    setSubitizeVisible(true);
    if (requestedRound) speak(joinVoiceLine(requestedRound.prompt, requestedRound.instruction));
  }

  function resetGame() {
    setRoundIndex(0);
    onRoundIndexChange(0);
    setSelected(null);
    setAnswered(false);
    setRetryMessage(null);
    setCompletedOnce(false);
    setMemoryCovered(false);
    setSubitizeVisible(true);
    const requestedRound = game.rounds[0];
    if (requestedRound) speak(joinVoiceLine(requestedRound.prompt, requestedRound.instruction));
  }

  return (
    <div className="play-area progressive-game">
      <div className="round-toolbar">
        <div>
          <p className="eyebrow">
            第 {roundIndex + 1} / {game.rounds.length} 题 ·{" "}
            <span
              className="difficulty-badge"
              title={`难度判定：${difficultyText(round)}`}
              data-tooltip={`难度判定：${difficultyText(round)}`}
              aria-label={`难度 ${round.level}，${difficultyText(round)}`}
              tabIndex={0}
            >
              难度 {round.level}
            </span>
          </p>
          <h3>{round.prompt}</h3>
          <p>{round.instruction}</p>
        </div>
        <GuideMascot
          onSpeak={() => {
            speak(joinVoiceLine(round.prompt, round.instruction));
          }}
        />
      </div>

      <RoundBoard
        gameId={game.id}
        memoryCovered={memoryCovered}
        round={round}
        subitizeVisible={!shouldAutoCoverSubitize || subitizeVisible}
        onCoverMemory={() => {
          setMemoryCovered(true);
          playTone("notice");
          speak("遮住啦。现在想一想，再选答案。");
        }}
        onSubitizePeek={
          shouldAutoCoverSubitize
            ? () => {
                setSubitizeVisible(true);
                playTone("notice");
              }
            : undefined
        }
      />

      <div className={`choice-grid answer-grid ${round.graphicChallenge ? "answer-grid-graphic" : ""}`}>
        {round.choices.map((choice) => {
          const active = selected === choice.value;
          const wrong = answered && active && choice.value !== round.answer;
          const correct = answered && choice.value === round.answer;
          const graphicOption = round.graphicChallenge?.options.find((option) => option.value === choice.value);
          const voiceLabel = labelForVoice(choice.label);
          return (
            <button
              aria-label={voiceLabel}
              className={`answer-choice ${graphicOption ? "answer-choice-graphic" : ""} ${isVisualCardChoice(choice.label) ? "answer-choice-visual-card" : ""} ${active ? "active" : ""} ${correct ? "correct" : ""} ${wrong ? "wrong" : ""}`}
              data-testid={`answer-${choice.value}`}
              disabled={answered}
              key={choice.value}
              type="button"
              onClick={() => choose(choice.value)}
            >
              {correct && <Check size={18} />}
              <ChoiceContent graphicOption={graphicOption} label={choice.label} />
            </button>
          );
        })}
      </div>

      <div className="control-row">
        <button type="button" onClick={resetGame}>
          <RotateCcw size={18} />
          从头来
        </button>
        {!answered && (
          <button type="button" className="primary" disabled={!selected} onClick={checkAnswer} data-testid="check-answer">
            <span>看看对不对</span>
          </button>
        )}
        {answered && (
          <button type="button" className="primary" disabled={!isCorrect} onClick={nextRound} data-testid="next-round">
            <span>{isLastRound ? "完成关卡" : "下一题"}</span>
            <ArrowRight size={18} />
          </button>
        )}
      </div>

      {(answered || retryMessage) && (
        <p className={`feedback ${isCorrect ? "success" : "needs-work"}`}>
          {isCorrect ? round.success : retryMessage}
        </p>
      )}

      {completedTags.length > 0 && (
        <div className="tag-list">
          {completedTags.map((tag) => (
            <span key={tag}>{tag}</span>
          ))}
        </div>
      )}
    </div>
  );
}

function ChoiceContent({ graphicOption, label }: { graphicOption?: GraphicChallengeOption; label: string }) {
  if (graphicOption) return <GraphicAnswerFigure letter={label} option={graphicOption} />;

  const visualParts = visualCardParts(label);
  if (visualParts.length > 1) {
    return (
      <span className="choice-visual-card" aria-hidden="true">
        {visualParts.map((item, index) => (
          <VisualGlyph kind={item.kind} key={`${item.kind}-${index}`} small />
        ))}
      </span>
    );
  }

  return (
    <>
      <ChoiceCue label={label} />
      <span>{label}</span>
    </>
  );
}

function GraphicAnswerFigure({ letter, option }: { letter: string; option: GraphicChallengeOption }) {
  return (
    <span className="graphic-answer-figure">
      <span className="graphic-choice-letter" aria-hidden="true">{letter}</span>
      <GraphicFigureSetSvg figures={option.figures ?? (option.figure ? [option.figure] : [])} />
    </span>
  );
}

function ChoiceCue({ label }: { label: string }) {
  const numericValue = Number(label);
  if (Number.isInteger(numericValue) && numericValue > 0 && numericValue <= 10) {
    return (
      <span className="choice-cue choice-number-cue" aria-hidden="true">
        <span>
          {Array.from({ length: numericValue }).map((_, index) => (
            <i key={index} />
          ))}
        </span>
      </span>
    );
  }
  const meta = visualMetaFor(label);
  if (!meta) {
    const parts = visualParts(label);
    const metas = parts.map((part) => visualMetaFor(part));
    if (metas.length <= 1 || metas.some((item) => !item)) return null;
    return (
      <span className="choice-cue choice-multi-cue" aria-hidden="true">
        {metas.map((item, index) => (
          <VisualGlyph kind={item!.kind} key={`${item!.kind}-${index}`} small />
        ))}
      </span>
    );
  }
  return (
    <span className="choice-cue" aria-hidden="true">
      <VisualGlyph kind={meta.kind} small />
    </span>
  );
}

function isVisualCardChoice(label: string) {
  return visualCardParts(label).length > 1;
}

function visualCardParts(value: string) {
  const exact = visualMetaFor(value);
  if (exact) return [exact];
  const parts = visualParts(value);
  if (parts.length <= 1) return [];
  const metas = parts.map((part) => visualMetaFor(part));
  if (metas.some((item) => !item)) return [];
  return metas as Array<NonNullable<ReturnType<typeof visualMetaFor>>>;
}

function joinVoiceLine(prompt: string, instruction: string) {
  const trimmed = prompt.trim();
  const separator = /[。？！]$/.test(trimmed) ? "" : "。";
  return `${trimmed}${separator}${instruction}`;
}

function difficultyText(round: GameRound) {
  if (round.difficultyNote?.trim()) return round.difficultyNote;
  const label = {
    L1: "入门，单一动作或 1-3 个数量。",
    L2: "基础，需要稳定点数或匹配。",
    L3: "基础进阶，需要按一个规则判断。",
    L4: "中等，需要两步观察或简单推理。",
    L5: "较难，需要抗干扰、换规则或多特征比较。",
    L6: "挑战，需要工作记忆、连续步骤或综合推理。",
  }[round.level];
  const tags = round.abilityTags.slice(0, 2).join("、");
  return tags ? `${label} 主要看 ${tags}。` : label;
}

function labelForVoice(label: string) {
  const exact = visualMetaFor(label);
  if (exact) return exact.label;
  const parts = visualParts(label);
  const labels = parts.map((part) => visualMetaFor(part)?.label);
  if (labels.length > 1 && labels.every(Boolean)) return labels.join("、");
  return label;
}

function RoundBoard({
  gameId,
  memoryCovered,
  subitizeVisible,
  round,
  onCoverMemory,
  onSubitizePeek,
}: {
  gameId: string;
  memoryCovered: boolean;
  subitizeVisible: boolean;
  round: GameRound;
  onCoverMemory: () => void;
  onSubitizePeek?: () => void;
}) {
  const scene = sceneForGame(gameId);
  const hasOnlySceneImage = Boolean(
    round.sceneImage &&
      !round.visualGroups &&
      !round.sequence &&
      !round.grid &&
      !round.matrix &&
      !round.memory &&
      !round.clockChallenge,
  );
  const boardClasses = [
    "round-board",
    `round-scene-${scene}`,
    round.sceneImage ? "round-board-with-image" : "",
    hasOnlySceneImage ? "round-board-image-only" : "",
    round.sceneImage && round.visualGroups ? "round-board-image-groups" : "",
    round.sceneImage && round.clockChallenge ? "round-board-clock-scene" : "",
    round.clockChallenge ? "round-board-clock" : "",
  ].filter(Boolean).join(" ");
  return (
    <section className={boardClasses} aria-label="题目画面">
      {!round.sceneImage && !round.graphicChallenge && !round.clockChallenge && <SceneBackdrop scene={scene} />}
      {round.sceneImage && (
        <figure className="scene-image-card">
          <img src={round.sceneImage.src} alt={round.sceneImage.alt} />
        </figure>
      )}

      {round.clockChallenge && <ClockChallengeBoard challenge={round.clockChallenge} hasSceneImage={Boolean(round.sceneImage)} />}

      {round.graphicChallenge && <GraphicChallengeBoard challenge={round.graphicChallenge} />}

      {round.sequence && (
        <div className="sequence-row">
          {round.sequence.map((item, index) => (
            <VisualToken key={`${item}-${index}`} value={item} />
          ))}
        </div>
      )}

      {round.grid && <AddressGrid grid={round.grid} />}

      {round.matrix && <MatrixBoard cells={round.matrix.cells} />}

      {round.memory && (
        <MemoryBoard covered={memoryCovered} items={round.memory.items} onCover={onCoverMemory} />
      )}

      {round.visualGroups && (
        <div className={visualGroupClasses(round.visualGroups)}>
          {round.visualGroups.map((group) => (
            <div className="visual-group" key={group.label}>
              <strong>{group.label}</strong>
              {group.layout === "subitize" ? (
                <SubitizeFrame items={group.items} visible={subitizeVisible} onPeek={onSubitizePeek} />
              ) : (
                <div className={`object-row ${group.layout === "counting" ? "object-row-counting" : ""}`}>
                  {group.items.map((item, index) => (
                    group.layout === "counting" ? (
                      <CountingToken key={`${item}-${index}`} value={item} />
                    ) : (
                      <VisualToken key={`${item}-${index}`} value={item} />
                    )
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </section>
  );
}

function ClockChallengeBoard({ challenge, hasSceneImage }: { challenge: NonNullable<GameRound["clockChallenge"]>; hasSceneImage: boolean }) {
  const minuteHand = clockHandEndpoint(challenge.minute * 6, 78);
  const hourHand = clockHandEndpoint(((challenge.hour % 12) + challenge.minute / 60) * 30, 50);
  const label = formatClockDisplay(challenge.hour, challenge.minute);
  const showContext = Boolean(challenge.activity && !hasSceneImage);
  return (
    <div className={`clock-challenge-board clock-mode-${challenge.mode} ${showContext ? "clock-with-context" : "clock-no-context"}`} aria-label={`时钟显示${label}`}>
      <div className="clock-card">
        <svg className="clock-face" viewBox="0 0 240 240" role="img" aria-label={`时针也就是短针${challenge.minute === 0 ? `指向${challenge.hour}` : `在${challenge.hour}和${challenge.hour === 12 ? 1 : challenge.hour + 1}中间`}，分针也就是长针在${challenge.minute === 0 ? "12" : "6"}`}>
          <circle className="clock-rim" cx="120" cy="120" r="104" />
          <circle className="clock-inner" cx="120" cy="120" r="92" />
          {Array.from({ length: 60 }).map((_, index) => {
            const angle = index * 6;
            const isHour = index % 5 === 0;
            const outer = clockHandEndpoint(angle, isHour ? 96 : 90);
            const inner = clockHandEndpoint(angle, isHour ? 84 : 85);
            return (
              <line
                className={isHour ? "clock-tick clock-tick-hour" : "clock-tick"}
                key={`tick-${index}`}
                x1={outer.x}
                x2={inner.x}
                y1={outer.y}
                y2={inner.y}
              />
            );
          })}
          {Array.from({ length: 12 }).map((_, index) => {
            const hour = index + 1;
            const { x, y } = clockLabelPosition(hour);
            return (
              <text className="clock-number" key={`hour-${hour}`} x={x} y={y}>
                {hour}
              </text>
            );
          })}
          <line className="clock-hand clock-hour-hand" x1="120" x2={hourHand.x} y1="120" y2={hourHand.y} />
          <line className="clock-hand clock-minute-hand" x1="120" x2={minuteHand.x} y1="120" y2={minuteHand.y} />
          <circle className="clock-pin" cx="120" cy="120" r="7" />
        </svg>
        <div className="clock-caption">
          <strong>{challenge.label}</strong>
          <span>{challenge.minute === 0 ? "先看时针（短针），再看分针（长针）在 12。" : "先看时针（短针），再看分针（长针）在 6。"}</span>
        </div>
      </div>
      {showContext && (
        <div className="clock-context-card">
          <span>活动</span>
          <strong>{challenge.activity}</strong>
        </div>
      )}
    </div>
  );
}

function formatClockDisplay(hour: number, minute: 0 | 30) {
  return `${String(hour).padStart(2, "0")}:${String(minute).padStart(2, "0")}`;
}

function clockLabelPosition(hour: number) {
  return clockPoint(hour * 30, 72, 6);
}

function clockHandEndpoint(angle: number, radius: number) {
  return clockPoint(angle, radius, 0);
}

function clockPoint(angle: number, radius: number, yOffset: number) {
  const radians = (angle - 90) * (Math.PI / 180);
  return {
    x: 120 + Math.cos(radians) * radius,
    y: 120 + yOffset + Math.sin(radians) * radius,
  };
}

function GraphicChallengeBoard({ challenge }: { challenge: NonNullable<GameRound["graphicChallenge"]> }) {
  return (
    <div className={`graphic-challenge-board graphic-challenge-${challenge.kind}`} aria-label={challenge.stemLabel}>
      <div className="graphic-stem-card">
        <strong>{challenge.stemLabel}</strong>
        {challenge.groups && (
          <div className="graphic-stem-groups">
            {challenge.groups.map((group, index) => (
              <GraphicFigureGroupCard group={group} key={`${group.label ?? "group"}-${index}`} />
            ))}
          </div>
        )}
        <div className="graphic-stem-figures">
          {challenge.kind === "layer-overlap" ? (
            <GraphicLayerTaskFigures figures={challenge.figures} />
          ) : (
            <GraphicFigureSetSvg figures={challenge.figures} large />
          )}
        </div>
      </div>
    </div>
  );
}

function GraphicLayerTaskFigures({ figures }: { figures: GraphicFigure[] }) {
  const [lower, upper] = figures;
  return (
    <div className="graphic-layer-task-figures">
      {lower && <GraphicFigureGroupCard group={{ label: "1 先放这张", figures: [lower] }} />}
      <div className="graphic-layer-stack-cue" aria-hidden="true">
        <span>再盖上</span>
        <strong>{"→"}</strong>
      </div>
      {upper && <GraphicFigureGroupCard group={{ label: "2 盖上这张", figures: [upper] }} />}
    </div>
  );
}

function GraphicFigureGroupCard({ group }: { group: GraphicFigureGroup }) {
  return (
    <div className={`graphic-figure-group graphic-figure-group-${group.connector ?? "plain"}`}>
      {group.label && <span>{group.label}</span>}
      <GraphicFigureSetSvg figures={group.figures} />
    </div>
  );
}

function GraphicFigureSvg({ figure, large = false }: { figure: GraphicFigure; large?: boolean }) {
  return <GraphicFigureSetSvg figures={[figure]} large={large} />;
}

function GraphicFigureSetSvg({ figures, large = false }: { figures: GraphicFigure[]; large?: boolean }) {
  const clipId = useId().replace(/:/g, "");
  const first = figures[0];
  if (!first) {
    return <svg className={`graphic-figure ${large ? "graphic-figure-large" : ""}`} viewBox="0 0 120 120" aria-hidden="true" />;
  }
  if (figures.length === 1 && first.mode === "detail") {
    return (
      <svg className={`graphic-figure ${large ? "graphic-figure-large" : ""} graphic-figure-detail`} viewBox="0 0 120 120" role="img" aria-hidden="true">
        <defs>
          <clipPath id={clipId}>
            <circle cx="60" cy="60" r="48" />
          </clipPath>
        </defs>
        <circle cx="60" cy="60" r="52" fill="#fff9e8" stroke="#2f3037" strokeWidth="5" />
        <g clipPath={`url(#${clipId})`}>
          <GraphicDetailShape figure={first} />
        </g>
        <circle cx="60" cy="60" r="48" fill="none" stroke="#4b5563" strokeWidth="3" />
        <line x1="94" y1="94" x2="112" y2="112" stroke="#4b5563" strokeWidth="8" strokeLinecap="round" />
      </svg>
    );
  }
  return (
    <svg className={`graphic-figure ${large ? "graphic-figure-large" : ""} graphic-figure-${first.mode ?? "color"}`} viewBox="0 0 120 120" role="img" aria-hidden="true">
      {figures.map((figure, index) => {
        const color = figure.mode === "shadow" ? "#242424" : figure.mode === "outline" || figure.mode === "missing" ? "rgba(255, 253, 247, 0.16)" : figure.color ?? defaultGraphicColor(figure.shape);
        const stroke = figure.mode === "shadow" ? "#242424" : "#2f3037";
        const transform = `translate(${figure.x ?? 0} ${figure.y ?? 0}) translate(60 60) rotate(${figure.rotate ?? 0}) scale(${figure.scale ?? 1}) translate(-60 -60)`;
        const figureId = `${clipId}-figure-${index}`;
        return (
          <g key={`${figure.shape}-${index}`} opacity={figure.opacity ?? 1} strokeDasharray={figure.mode === "missing" ? "10 7" : undefined} transform={transform}>
            <GraphicFigureArt figure={figure} fill={color} idPrefix={figureId} stroke={stroke} />
            {figure.mode === "covered" && <CoverMask cover={figure.cover ?? "middle"} />}
            {figure.mode === "missing" && <GapMask gap={figure.gap ?? "right"} />}
          </g>
        );
      })}
    </svg>
  );
}

function GraphicFigureArt({ figure, fill, idPrefix, stroke }: { figure: GraphicFigure; fill: string; idPrefix?: string; stroke: string }) {
  if (figure.mode === "blank") return <BlankSlot />;
  const assetSrc = graphicFigureAssetSrc(figure.shape);
  if (assetSrc && figure.mode !== "missing" && figure.mode !== "outline") {
    if (figure.mode === "shadow") {
      const maskId = `${idPrefix ?? "graphic-shadow"}-mask`;
      return (
        <>
          <defs>
            <mask id={maskId} maskUnits="userSpaceOnUse" maskContentUnits="userSpaceOnUse" x="0" y="0" width="120" height="120" style={{ maskType: "alpha" }}>
              <image href={assetSrc} height="112" preserveAspectRatio="xMidYMid meet" width="112" x="4" y="4" />
            </mask>
          </defs>
          <rect x="4" y="4" width="112" height="112" fill="#242424" mask={`url(#${maskId})`} />
        </>
      );
    }
    return <image href={assetSrc} height="112" preserveAspectRatio="xMidYMid meet" width="112" x="4" y="4" />;
  }
  return <GraphicShape shape={figure.shape} fill={fill} stroke={stroke} />;
}

function BlankSlot() {
  return (
    <g>
      <rect x="25" y="25" width="70" height="70" rx="16" fill="#fffdf7" stroke="#64748b" strokeDasharray="8 6" strokeWidth="4" />
      <text x="60" y="70" textAnchor="middle" fontSize="36" fontWeight="800" fill="#64748b">?</text>
    </g>
  );
}

function GraphicShape({ fill, shape, stroke }: { fill: string; shape: GraphicFigure["shape"]; stroke: string }) {
  switch (shape) {
    case "circle":
      return <circle cx="60" cy="60" r="35" fill={fill} stroke={stroke} strokeWidth="4" />;
    case "diamond":
      return <path d="M60 17 L102 60 L60 103 L18 60 Z" fill={fill} stroke={stroke} strokeLinejoin="round" strokeWidth="4" />;
    case "rounded-square":
      return <rect x="27" y="27" width="66" height="66" rx="12" fill={fill} stroke={stroke} strokeWidth="4" />;
    case "star":
      return <path d="M60 16 L72 45 L104 47 L79 67 L88 99 L60 81 L32 99 L41 67 L16 47 L48 45 Z" fill={fill} stroke={stroke} strokeLinejoin="round" strokeWidth="4" />;
    case "triangle":
      return <path d="M60 18 L103 96 L17 96 Z" fill={fill} stroke={stroke} strokeLinejoin="round" strokeWidth="4" />;
    case "flower":
      return (
        <g fill={fill} stroke={stroke} strokeWidth="4">
          <circle cx="60" cy="33" r="20" />
          <circle cx="84" cy="54" r="20" />
          <circle cx="74" cy="84" r="20" />
          <circle cx="46" cy="84" r="20" />
          <circle cx="36" cy="54" r="20" />
          <circle cx="60" cy="61" r="16" fill="#ffd166" />
        </g>
      );
    case "apple":
      return (
        <g fill={fill} stroke={stroke} strokeWidth="4">
          <path d="M37 48 C28 59 30 93 54 96 C58 97 62 97 66 96 C90 93 92 59 83 48 C74 35 65 42 60 46 C55 42 46 35 37 48 Z" />
          <path d="M60 42 C62 29 72 24 84 25 C79 37 70 43 60 42 Z" fill="#58a55c" />
        </g>
      );
    case "pear":
      return (
        <g fill={fill} stroke={stroke} strokeWidth="4">
          <path d="M60 24 C46 25 44 43 50 52 C36 61 33 95 60 99 C87 95 84 61 70 52 C76 43 74 25 60 24 Z" />
          <path d="M61 28 C66 21 73 19 82 20 C78 29 70 33 61 31 Z" fill="#58a55c" />
        </g>
      );
    case "leaf":
      return <path d="M22 75 C42 28 82 18 101 24 C96 67 63 95 23 79 Z" fill={fill} stroke={stroke} strokeWidth="4" />;
    case "fish":
      return (
        <g fill={fill} stroke={stroke} strokeWidth="4">
          <path d="M22 61 C40 35 77 35 94 61 C77 87 40 87 22 61 Z" />
          <path d="M94 61 L113 43 L113 79 Z" />
          <circle cx="42" cy="55" r="4" fill="#202124" stroke="none" />
        </g>
      );
    case "cat":
      return (
        <g fill={fill} stroke={stroke} strokeWidth="4">
          <path d="M31 49 L39 22 L57 40 L63 40 L81 22 L89 49 C98 82 78 100 60 100 C42 100 22 82 31 49 Z" />
          <circle cx="48" cy="63" r="4" fill="#202124" stroke="none" />
          <circle cx="72" cy="63" r="4" fill="#202124" stroke="none" />
        </g>
      );
    case "dog":
      return (
        <g fill={fill} stroke={stroke} strokeWidth="4">
          <circle cx="60" cy="62" r="35" />
          <path d="M29 42 C16 54 18 79 34 83 C39 67 40 51 29 42 Z" />
          <path d="M91 42 C104 54 102 79 86 83 C81 67 80 51 91 42 Z" />
          <circle cx="48" cy="61" r="4" fill="#202124" stroke="none" />
          <circle cx="72" cy="61" r="4" fill="#202124" stroke="none" />
        </g>
      );
    case "rabbit":
      return (
        <g fill={fill} stroke={stroke} strokeWidth="4">
          <ellipse cx="47" cy="31" rx="11" ry="29" />
          <ellipse cx="73" cy="31" rx="11" ry="29" />
          <circle cx="60" cy="70" r="33" />
          <circle cx="49" cy="66" r="4" fill="#202124" stroke="none" />
          <circle cx="71" cy="66" r="4" fill="#202124" stroke="none" />
        </g>
      );
    case "bear":
      return (
        <g fill={fill} stroke={stroke} strokeWidth="4">
          <circle cx="35" cy="42" r="15" />
          <circle cx="85" cy="42" r="15" />
          <circle cx="60" cy="66" r="36" />
          <circle cx="48" cy="64" r="4" fill="#202124" stroke="none" />
          <circle cx="72" cy="64" r="4" fill="#202124" stroke="none" />
        </g>
      );
  }
}

function GraphicDetailShape({ figure }: { figure: GraphicFigure }) {
  const color = figure.color ?? defaultGraphicColor(figure.shape);
  const stroke = "#2f3037";
  switch (figure.detail) {
    case "ear":
      return <GraphicFigureArt figure={{ ...figure, mode: "color" }} fill={color} stroke={stroke} />;
    case "leaf":
      return <g transform="translate(-22 -24) scale(1.7)"><GraphicFigureArt figure={{ ...figure, mode: "color" }} fill={color} stroke={stroke} /></g>;
    case "point":
      return <g transform="translate(-15 -18) scale(1.65)"><GraphicFigureArt figure={{ ...figure, mode: "color" }} fill={color} stroke={stroke} /></g>;
    case "tail":
      return <g transform="translate(-58 -8) scale(1.7)"><GraphicFigureArt figure={{ ...figure, mode: "color" }} fill={color} stroke={stroke} /></g>;
    case "curve":
    default:
      return <g transform="translate(-18 -10) scale(1.55)"><GraphicFigureArt figure={{ ...figure, mode: "color" }} fill={color} stroke={stroke} /></g>;
  }
}

function CoverMask({ cover }: { cover: NonNullable<GraphicFigure["cover"]> }) {
  const rect = {
    left: { x: 0, y: 0, width: 62, height: 120 },
    right: { x: 58, y: 0, width: 62, height: 120 },
    bottom: { x: 0, y: 62, width: 120, height: 58 },
    middle: { x: 25, y: 24, width: 70, height: 72 },
  }[cover];
  return (
    <g>
      <rect {...rect} rx="10" fill="#f8fafc" stroke="#64748b" strokeDasharray="7 6" strokeWidth="4" />
      <text x={rect.x + rect.width / 2} y={rect.y + rect.height / 2 + 5} textAnchor="middle" fontSize="15" fontWeight="700" fill="#64748b">遮住</text>
    </g>
  );
}

function GapMask({ gap }: { gap: NonNullable<GraphicFigure["gap"]> }) {
  const rect = {
    top: { x: 18, y: 0, width: 84, height: 30 },
    right: { x: 88, y: 18, width: 32, height: 84 },
    bottom: { x: 18, y: 88, width: 84, height: 32 },
    left: { x: 0, y: 18, width: 32, height: 84 },
  }[gap];
  return <rect {...rect} fill="#fffdf7" stroke="none" />;
}

function defaultGraphicColor(shape: GraphicFigure["shape"]) {
  return {
    apple: "#ef4444",
    bear: "#a16207",
    cat: "#f59e0b",
    circle: "#ef4444",
    diamond: "#14b8a6",
    dog: "#b45309",
    fish: "#38bdf8",
    flower: "#f472b6",
    leaf: "#22c55e",
    pear: "#a3e635",
    rabbit: "#f3f4f6",
    "rounded-square": "#3b82f6",
    star: "#facc15",
    triangle: "#fb7185",
  }[shape];
}

function graphicFigureAssetSrc(shape: GraphicFigure["shape"]) {
  return {
    apple: imageGallery.items.graphicApple.src,
    bear: imageGallery.items.graphicBear.src,
    cat: imageGallery.items.graphicCat.src,
    circle: imageGallery.items.graphicCircle.src,
    diamond: imageGallery.items.graphicDiamond.src,
    dog: imageGallery.items.graphicDog.src,
    fish: imageGallery.items.graphicFish.src,
    flower: imageGallery.items.graphicFlower.src,
    leaf: imageGallery.items.graphicLeaf.src,
    pear: imageGallery.items.graphicPear.src,
    rabbit: imageGallery.items.graphicRabbit.src,
    "rounded-square": imageGallery.items.graphicRoundedSquare.src,
    star: imageGallery.items.graphicStar.src,
    triangle: imageGallery.items.graphicTriangle.src,
  }[shape];
}

const evidenceGroupLabels = new Set([
  "完整图",
  "已经有",
  "可选小块",
  "天平左边",
  "天平右边",
  "1 个可以换",
  "现在有",
  "规则",
  "左边",
  "右边",
]);
const specificEvidenceGroupLabels = new Set([
  "完整图",
  "已经有",
  "可选小块",
  "天平左边",
  "天平右边",
  "1 个可以换",
  "现在有",
  "规则",
]);
const relationGroupLabels = new Set(["目标", "例子", "新目标", "新问题", "新内容", "内容"]);

function visualGroupClasses(groups: NonNullable<GameRound["visualGroups"]>) {
  const allCounting = groups.every((group) => group.layout === "counting");
  const isCountingChoice =
    allCounting &&
    groups.length === 3 &&
    groups.every((group, index) => group.label === ["A", "B", "C"][index]);
  const isComparisonPair =
    groups.length === 2 &&
    groups[0].label === "左图" &&
    groups[1].label === "右图";
  const isEvidenceGroup =
    groups.length >= 2 &&
    groups.every((group) => !group.layout && evidenceGroupLabels.has(group.label)) &&
    groups.some((group) => specificEvidenceGroupLabels.has(group.label));
  const isRelationGroup =
    groups.length >= 1 &&
    groups.every((group) => !group.layout && relationGroupLabels.has(group.label));

  return [
    "visual-groups",
    allCounting && groups.length === 1 ? "visual-groups-counting-single" : "",
    isCountingChoice ? "visual-groups-counting-choice" : "",
    isComparisonPair ? "visual-groups-compare" : "",
    isEvidenceGroup ? "visual-groups-evidence" : "",
    isRelationGroup ? "visual-groups-relation" : "",
  ].filter(Boolean).join(" ");
}

function CountingToken({ value }: { value: string }) {
  const meta = visualMetaFor(value);
  const label = meta?.label ?? value;
  return (
    <button className="counting-token" type="button" onClick={() => speak(label)} aria-label={label}>
      {meta ? <VisualGlyph kind={meta.kind} /> : <span aria-hidden="true">{value}</span>}
    </button>
  );
}

function SubitizeFrame({ items, visible, onPeek }: { items: string[]; visible: boolean; onPeek?: () => void }) {
  return (
    <div className={`subitize-peek ${visible ? "" : "covered"}`}>
      <div className="subitize-frame" aria-label="一眼看数量的点阵">
        {items.map((item, index) => {
          const meta = item ? visualMetaFor(item) : null;
          return (
            <div className={`subitize-cell ${item ? "" : "subitize-cell-empty"}`} key={`${item || "empty"}-${index}`}>
              {item && visible && (
                <button className="subitize-dot" type="button" onClick={() => speak(meta?.label ?? item)} aria-label={meta?.label ?? item}>
                  {meta ? <VisualGlyph kind={meta.kind} small /> : <span aria-hidden="true">{item}</span>}
                </button>
              )}
            </div>
          );
        })}
      </div>
      {!visible && onPeek && (
        <button className="subitize-peek-button" type="button" onClick={onPeek}>
          再看一眼
        </button>
      )}
    </div>
  );
}

function MapCellToken({ value }: { value: string }) {
  const meta = visualMetaFor(value);
  const label = meta?.label ?? labelForVoice(value);
  return (
    <button className={`map-cell-token ${meta ? "" : "map-cell-token-text"}`} type="button" onClick={() => speak(label)} aria-label={label}>
      {meta ? <VisualGlyph kind={meta.kind} /> : <span className="map-cell-glyph" aria-hidden="true">{value}</span>}
      <span className="map-cell-label">{label}</span>
    </button>
  );
}

function MatrixCellToken({ value }: { value: string }) {
  const label = labelForVoice(value);
  const parts = visualCardParts(value);
  return (
    <button className={`matrix-cell-token ${parts.length > 1 ? "matrix-cell-token-multi" : ""}`} type="button" onClick={() => speak(label)} aria-label={label}>
      {parts.length > 0 ? (
        <span className="matrix-token-glyphs" aria-hidden="true">
          {parts.map((item, index) => (
            <VisualGlyph kind={item.kind} key={`${item.kind}-${index}`} small={parts.length > 1} />
          ))}
        </span>
      ) : (
        <span className="matrix-cell-text" aria-hidden="true">{value}</span>
      )}
      <span className="matrix-cell-label">{label}</span>
    </button>
  );
}

function MemoryCardToken({ covered, value }: { covered: boolean; value: string }) {
  const displayValue = covered ? "遮住了" : value;
  const meta = visualMetaFor(displayValue);
  const label = meta?.label ?? labelForVoice(displayValue);
  return (
    <button
      className={`memory-card-token ${covered ? "memory-card-token-covered" : ""} ${meta ? "" : "memory-card-token-text"}`}
      type="button"
      onClick={() => speak(label)}
      aria-label={label}
    >
      {meta ? <VisualGlyph kind={meta.kind} /> : <span className="memory-card-text" aria-hidden="true">{displayValue}</span>}
      <span className="memory-card-label">{label}</span>
    </button>
  );
}

function MemoryBoard({ covered, items, onCover }: { covered: boolean; items: string[]; onCover: () => void }) {
  return (
    <div className={`memory-board ${covered ? "covered" : ""}`} aria-label="记忆小相机">
      <div className="memory-card-row">
        {items.map((item, index) => (
          <div className="memory-card" key={`${item}-${index}`}>
            <MemoryCardToken covered={covered} value={item} />
          </div>
        ))}
      </div>
      {!covered && (
        <button className="memory-cover-button" type="button" onClick={onCover}>
          遮住再答
        </button>
      )}
    </div>
  );
}

function AddressGrid({ grid }: { grid: NonNullable<GameRound["grid"]> }) {
  return (
    <div
      className="address-grid"
      style={{ "--grid-columns": grid.columns.length + 1 } as CSSProperties}
      aria-label="地址地图"
    >
      <div className="address-cell address-corner" />
      {grid.columns.map((column) => (
        <div className="address-cell address-label" key={`column-${column}`}>
          {column}
        </div>
      ))}
      {grid.rows.map((row, rowIndex) => (
        <Fragment key={`row-${row}`}>
          <div className="address-cell address-label">{row}</div>
          {grid.columns.map((column, columnIndex) => (
            <div className="address-cell address-object" key={`${row}-${column}`}>
              <MapCellToken value={grid.cells[rowIndex]?.[columnIndex] ?? ""} />
            </div>
          ))}
        </Fragment>
      ))}
    </div>
  );
}

function MatrixBoard({ cells }: { cells: string[][] }) {
  return (
    <div className="matrix-board" aria-label="图形规律表">
      {cells.map((row, rowIndex) => (
        <div className="matrix-row" key={`matrix-row-${rowIndex}`}>
          {row.map((cell, cellIndex) => (
            <div className={`matrix-cell ${cell === "?" ? "matrix-cell-missing" : ""}`} key={`${rowIndex}-${cellIndex}`}>
              <MatrixCellToken value={cell} />
            </div>
          ))}
        </div>
      ))}
    </div>
  );
}

type SceneKind = "garden" | "tray" | "balance" | "blocks" | "story" | "picnic" | "train" | "sorting" | "traffic" | "path" | "detective" | "river";

function sceneForGame(gameId: string): SceneKind {
  const scenes: Record<string, SceneKind> = {
    "math-counting-cardinality": "garden",
    "math-subitize-match": "tray",
    "math-compare-equalize": "balance",
    "math-compose-decompose": "blocks",
    "math-story-operations": "story",
    "math-fair-share": "picnic",
    "math-clock-time": "train",
    "logic-pattern-train": "train",
    "logic-sorter-switch": "sorting",
    "logic-stop-think": "traffic",
    "logic-order-plan": "path",
    "logic-story-evidence": "detective",
    "logic-space-bridge": "river",
    "logic-same-kind-detective": "detective",
    "logic-number-pattern-trail": "train",
    "logic-address-map": "path",
    "logic-matrix-puzzle": "sorting",
    "logic-position-map": "path",
    "logic-memory-camera": "detective",
    "logic-visual-match": "sorting",
    "logic-difference-detective": "detective",
    "logic-rotation-direction": "path",
    "logic-part-whole-puzzle": "blocks",
    "logic-balance-swap": "balance",
    "logic-mirror-fold": "sorting",
    "logic-block-height-map": "blocks",
    "logic-three-view-blocks": "blocks",
    "logic-route-steps": "path",
    "graphic-shadow-match": "detective",
    "graphic-covered-restore": "detective",
    "graphic-detail-whole": "detective",
    "graphic-layer-overlap": "blocks",
    "graphic-code-machine": "detective",
    "graphic-gap-close": "sorting",
  };
  return scenes[gameId] ?? "garden";
}

function SceneBackdrop({ scene }: { scene: SceneKind }) {
  return (
    <svg className="scene-backdrop" viewBox="0 0 720 220" aria-hidden="true">
      <defs>
        <filter id={`sceneCrayon-${scene}`} x="-5%" y="-10%" width="110%" height="120%">
          <feTurbulence type="fractalNoise" baseFrequency="0.32" numOctaves="2" seed="7" result="noise" />
          <feDisplacementMap in="SourceGraphic" in2="noise" scale="0.55" />
        </filter>
      </defs>
      <SceneBase />
      {scene === "garden" && <GardenScene />}
      {scene === "tray" && <TrayScene />}
      {scene === "balance" && <BalanceScene />}
      {scene === "blocks" && <BlocksScene />}
      {scene === "story" && <StoryScene />}
      {scene === "picnic" && <PicnicScene />}
      {scene === "train" && <TrainScene />}
      {scene === "sorting" && <SortingScene />}
      {scene === "traffic" && <TrafficScene />}
      {scene === "path" && <PathScene />}
      {scene === "detective" && <DetectiveScene />}
      {scene === "river" && <RiverScene />}
    </svg>
  );
}

function SceneBase() {
  return (
    <>
      <rect className="scene-sky" x="0" y="0" width="720" height="220" rx="16" />
      <path className="scene-ground" d="M0 168c95-20 162 16 249-2 115-24 191 18 283-4 76-18 129-10 188 7v51H0Z" />
      <circle className="scene-sun" cx="660" cy="42" r="21" />
      <path className="scene-cloud" d="M55 55c8-18 31-20 41-5 14-16 43-9 47 11 18-1 31 9 31 23H34c1-17 9-27 21-29Z" />
    </>
  );
}

function GardenScene() {
  return <><path className="scene-stem" d="M96 176v-25M112 176v-31M128 176v-21" /><circle className="scene-fruit" cx="96" cy="147" r="9" /><circle className="scene-fruit" cx="112" cy="141" r="9" /><circle className="scene-fruit" cx="128" cy="151" r="9" /><path className="scene-fence" d="M508 150h150M525 132v48M565 132v48M605 132v48M645 132v48" /></>;
}

function TrayScene() {
  return <><ellipse className="scene-table" cx="360" cy="174" rx="255" ry="28" /><rect className="scene-tray" x="500" y="122" width="120" height="46" rx="18" /><circle className="scene-dot" cx="530" cy="145" r="7" /><circle className="scene-dot" cx="562" cy="145" r="7" /><circle className="scene-dot" cx="594" cy="145" r="7" /></>;
}

function BalanceScene() {
  return <><path className="scene-line" d="M360 82v91M300 173h120M260 110h200" /><path className="scene-pan" d="M224 111c15 39 87 39 102 0Z" /><path className="scene-pan" d="M394 111c15 39 87 39 102 0Z" /><circle className="scene-dot" cx="276" cy="133" r="7" /><circle className="scene-dot" cx="442" cy="133" r="7" /></>;
}

function BlocksScene() {
  return <><rect className="scene-block-a" x="78" y="146" width="42" height="32" rx="6" /><rect className="scene-block-b" x="123" y="128" width="42" height="50" rx="6" /><rect className="scene-block-c" x="168" y="108" width="42" height="70" rx="6" /><rect className="scene-block-b" x="560" y="142" width="38" height="36" rx="6" /><rect className="scene-block-a" x="603" y="126" width="38" height="52" rx="6" /></>;
}

function StoryScene() {
  return <><path className="scene-house" d="M74 113l58-43 58 43v65H74Z" /><rect className="scene-door" x="118" y="135" width="28" height="43" rx="5" /><path className="scene-path" d="M160 180c75-37 136-33 205-10 74 24 141 26 214 1" /></>;
}

function PicnicScene() {
  return <><rect className="scene-blanket" x="98" y="128" width="140" height="58" rx="10" /><path className="scene-grid" d="M98 157h140M128 128v58M168 128v58M208 128v58" /><circle className="scene-plate" cx="562" cy="156" r="28" /><circle className="scene-dot" cx="550" cy="154" r="6" /><circle className="scene-dot" cx="574" cy="154" r="6" /></>;
}

function TrainScene() {
  return <><path className="scene-rail" d="M65 178h590M76 194h568M125 176l-30 20M210 176l-30 20M295 176l-30 20M380 176l-30 20M465 176l-30 20M550 176l-30 20M635 176l-30 20" /><rect className="scene-car-a" x="92" y="128" width="70" height="42" rx="10" /><rect className="scene-car-b" x="172" y="116" width="78" height="54" rx="10" /><circle className="scene-wheel" cx="115" cy="174" r="9" /><circle className="scene-wheel" cx="218" cy="174" r="9" /></>;
}

function SortingScene() {
  return <><rect className="scene-bin-a" x="78" y="128" width="72" height="56" rx="10" /><rect className="scene-bin-b" x="570" y="128" width="72" height="56" rx="10" /><circle className="scene-dot" cx="114" cy="107" r="12" /><rect className="scene-block-b" x="592" y="95" width="26" height="26" rx="5" /></>;
}

function TrafficScene() {
  return <><path className="scene-road" d="M0 176c180-25 330-25 720 0v44H0Z" /><rect className="scene-light" x="102" y="70" width="38" height="92" rx="12" /><circle className="scene-red" cx="121" cy="94" r="9" /><circle className="scene-yellow" cx="121" cy="117" r="9" /><circle className="scene-green" cx="121" cy="140" r="9" /><path className="scene-crossing" d="M500 184h96M522 174v38M546 174v38M570 174v38" /></>;
}

function PathScene() {
  return <><path className="scene-path" d="M72 184c76-76 169-79 272-33 104 46 181 35 304-18" /><circle className="scene-step" cx="176" cy="143" r="8" /><circle className="scene-step" cx="230" cy="136" r="8" /><circle className="scene-step" cx="284" cy="143" r="8" /><path className="scene-flag" d="M612 83v86M612 84h55v35h-55" /></>;
}

function DetectiveScene() {
  return <><circle className="scene-lens" cx="116" cy="129" r="31" /><path className="scene-handle" d="M138 151l42 42" /><circle className="scene-print" cx="564" cy="142" r="10" /><circle className="scene-print" cx="548" cy="126" r="5" /><circle className="scene-print" cx="564" cy="121" r="5" /><circle className="scene-print" cx="580" cy="126" r="5" /></>;
}

function RiverScene() {
  return <><path className="scene-river" d="M0 126c96-48 174 34 270-11 105-50 167 25 275-14 67-24 118-3 175 23v96H0Z" /><path className="scene-wave" d="M60 155c58-21 90 16 143-3M320 151c55-19 96 14 151-6M538 158c38-15 72 10 113-5" /><path className="scene-plank" d="M242 122h235v20H242Z" /></>;
}
