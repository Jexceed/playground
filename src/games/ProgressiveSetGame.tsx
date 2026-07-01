import { ArrowRight, Check, RotateCcw } from "lucide-react";
import { Fragment, useEffect, useMemo, useState } from "react";
import type { CSSProperties } from "react";
import { GuideMascot } from "../components/GuideMascot";
import { VisualGlyph, VisualToken, visualMetaFor, visualParts } from "../components/VisualToken";
import { playTone, speak } from "../speech";
import type { GameConfig, GameRound } from "../types";

export function ProgressiveSetGame({
  game,
  requestedRoundIndex,
  onComplete,
  onRoundComplete,
  onRoundIndexChange,
}: {
  game: GameConfig;
  requestedRoundIndex: number;
  onComplete: () => void;
  onRoundComplete: (roundId: string, tags: string[]) => void;
  onRoundIndexChange: (index: number) => void;
}) {
  const [roundIndex, setRoundIndex] = useState(0);
  const [selected, setSelected] = useState<string | null>(null);
  const [answered, setAnswered] = useState(false);
  const [retryMessage, setRetryMessage] = useState<string | null>(null);
  const [completedOnce, setCompletedOnce] = useState(false);
  const [voiceReady, setVoiceReady] = useState(false);
  const [memoryCovered, setMemoryCovered] = useState(false);
  const [subitizeVisible, setSubitizeVisible] = useState(true);

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
    if (nextIndex === roundIndex) return;
    setRoundIndex(nextIndex);
    setSelected(null);
    setAnswered(false);
    setRetryMessage(null);
    setMemoryCovered(false);
    setSubitizeVisible(true);
    setVoiceReady(true);
  }, [game.rounds.length, requestedRoundIndex, roundIndex]);

  const round = game.rounds[roundIndex];
  const isCorrect = answered && selected === round.answer;
  const isLastRound = roundIndex === game.rounds.length - 1;
  const isSubitizeRound = game.id === "math-subitize-match";

  useEffect(() => {
    if (voiceReady) speak(joinVoiceLine(round.prompt, round.instruction));
  }, [round.id, round.instruction, round.prompt, voiceReady]);

  useEffect(() => {
    if (!isSubitizeRound || !subitizeVisible) return;
    const timer = window.setTimeout(() => setSubitizeVisible(false), 1250);
    return () => window.clearTimeout(timer);
  }, [isSubitizeRound, round.id, subitizeVisible]);

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
    setVoiceReady(true);
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
    setRoundIndex((current) => current + 1);
    onRoundIndexChange(roundIndex + 1);
    setSelected(null);
    setAnswered(false);
    setRetryMessage(null);
    setMemoryCovered(false);
    setSubitizeVisible(true);
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
            setVoiceReady(true);
            speak(joinVoiceLine(round.prompt, round.instruction));
          }}
        />
      </div>

      <RoundBoard
        gameId={game.id}
        memoryCovered={memoryCovered}
        round={round}
        subitizeVisible={!isSubitizeRound || subitizeVisible}
        onCoverMemory={() => {
          setMemoryCovered(true);
          playTone("notice");
          speak("遮住啦。现在想一想，再选答案。");
        }}
        onSubitizePeek={
          isSubitizeRound
            ? () => {
                setSubitizeVisible(true);
                playTone("notice");
              }
            : undefined
        }
      />

      <div className="choice-grid answer-grid">
        {round.choices.map((choice) => {
          const active = selected === choice.value;
          const wrong = answered && active && choice.value !== round.answer;
          const correct = answered && choice.value === round.answer;
          return (
            <button
              className={`answer-choice ${active ? "active" : ""} ${correct ? "correct" : ""} ${wrong ? "wrong" : ""}`}
              data-testid={`answer-${choice.value}`}
              disabled={answered}
              key={choice.value}
              type="button"
              onClick={() => choose(choice.value)}
            >
              {correct && <Check size={18} />}
              <ChoiceCue label={choice.label} />
              <span>{choice.label}</span>
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
  const boardClasses = [
    "round-board",
    `round-scene-${scene}`,
    round.sceneImage ? "round-board-with-image" : "",
    round.sceneImage && round.visualGroups ? "round-board-image-groups" : "",
  ].filter(Boolean).join(" ");
  return (
    <section className={boardClasses} aria-label="题目画面">
      <SceneBackdrop scene={scene} />
      {round.sceneImage && (
        <figure className="scene-image-card">
          <img src={round.sceneImage.src} alt={round.sceneImage.alt} />
        </figure>
      )}

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
        <div className="visual-groups">
          {round.visualGroups.map((group) => (
            <div className="visual-group" key={group.label}>
              <strong>{group.label}</strong>
              {group.layout === "subitize" ? (
                <SubitizeFrame items={group.items} visible={subitizeVisible} onPeek={onSubitizePeek} />
              ) : (
                <div className="object-row">
                  {group.items.map((item, index) => (
                    <VisualToken key={`${item}-${index}`} value={item} />
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

function MemoryBoard({ covered, items, onCover }: { covered: boolean; items: string[]; onCover: () => void }) {
  return (
    <div className={`memory-board ${covered ? "covered" : ""}`} aria-label="记忆小相机">
      <div className="memory-card-row">
        {items.map((item, index) => (
          <div className="memory-card" key={`${item}-${index}`}>
            {covered ? <VisualToken value="遮住了" /> : <VisualToken value={item} />}
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
              <VisualToken value={grid.cells[rowIndex]?.[columnIndex] ?? ""} />
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
              <VisualToken value={cell} />
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
