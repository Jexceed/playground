import { Check, RotateCcw } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { games, worlds } from "./data/games";
import { ProgressiveSetGame } from "./games/ProgressiveSetGame";
import { addCompletion, addRoundCompletion, readProgress, saveProgress } from "./storage";
import { speak, warmVoiceManifest } from "./speech";
import type { GameConfig, GameRound, ProgressLog, WorldId } from "./types";

export function App() {
  const [activeWorld, setActiveWorld] = useState<WorldId>("math");
  const [selectedGameId, setSelectedGameId] = useState(games[0].id);
  const [requestedRoundIndex, setRequestedRoundIndex] = useState(0);
  const [progress, setProgress] = useState<ProgressLog>(() => readProgress());

  useEffect(() => {
    warmVoiceManifest();
  }, []);

  const selectedGame = useMemo(
    () => games.find((game) => game.id === selectedGameId) ?? games[0],
    [selectedGameId],
  );

  const visibleGames = games.filter((game) => game.world === activeWorld);
  const questionStats = useMemo(() => {
    const math = games.filter((game) => game.world === "math").reduce((sum, game) => sum + game.rounds.length, 0);
    const logic = games.filter((game) => game.world === "logic").reduce((sum, game) => sum + game.rounds.length, 0);
    return {
      math,
      logic,
      total: math + logic,
    };
  }, []);
  const completed = progress.completedIds.includes(selectedGame.id);
  const completedRoundSet = useMemo(() => new Set(progress.completedRoundIds), [progress.completedRoundIds]);

  function completeGame(game: GameConfig) {
    const next = addCompletion(progress, game.id, game.abilityTags);
    setProgress(next);
    saveProgress(next);
    speak("完成啦。我们再想一想，为什么会这样？");
  }

  function completeRound(roundId: string, tags: string[]) {
    setProgress((current) => {
      const next = addRoundCompletion(current, roundId, tags);
      saveProgress(next);
      return next;
    });
  }

  function resetProgress() {
    const empty = { completedIds: [], completedRoundIds: [], abilityTags: [] };
    setProgress(empty);
    saveProgress(empty);
  }

  return (
    <main className="app-shell">
      <section className="layout">
        <nav className="world-nav" aria-label="主题地图">
          <div className="sidebar-brand">
            <span className="brand-mark" aria-hidden="true">
              <svg className="brand-logo" viewBox="0 0 64 64" role="img">
                <path className="brand-logo-sky" d="M9 24c3-10 12-16 24-16 13 0 22 7 23 19 4 2 7 7 7 13 0 10-8 18-18 18H20C9 58 1 50 1 40c0-8 4-14 8-16Z" />
                <path className="brand-logo-water" d="M9 47c5 3 10 3 15 0s10-3 15 0 10 3 16 0v9H9v-9Z" />
                <path className="brand-logo-island" d="M16 38c3-10 10-16 18-16s14 6 17 16c-5 3-11 5-18 5-6 0-12-2-17-5Z" />
                <path className="brand-logo-grass" d="M19 35c4-6 9-9 15-9s10 3 14 9c-9 4-19 4-29 0Z" />
                <path className="brand-logo-bubble" d="M42 10c5 0 9 3 9 7s-4 7-9 7h-6l-4 4 1-6c-2-1-3-3-3-5 0-4 5-7 12-7Z" />
                <circle className="brand-logo-dot brand-logo-dot-a" cx="23" cy="35" r="2.2" />
                <circle className="brand-logo-dot brand-logo-dot-b" cx="41" cy="35" r="2.2" />
                <path className="brand-logo-smile" d="M26 40c4 3 8 3 12 0" />
                <path className="brand-logo-spark" d="M18 15l2 4 4 2-4 2-2 4-2-4-4-2 4-2 2-4Z" />
              </svg>
            </span>
            <div>
              <h1>小小思考岛</h1>
              <p>亲子思维游戏</p>
            </div>
          </div>
          {worlds.map((world) => (
            <button
              className={`world-button ${activeWorld === world.id ? "active" : ""}`}
              data-testid={`world-${world.id}`}
              key={world.id}
              type="button"
              onClick={() => {
                setActiveWorld(world.id);
                const firstGame = games.find((game) => game.world === world.id);
                if (firstGame) {
                  setSelectedGameId(firstGame.id);
                  setRequestedRoundIndex(0);
                }
              }}
            >
              <span className={`world-icon world-icon-${world.id}`} aria-hidden="true" />
              <span>
                <strong>{world.name}</strong>
                <small>{world.summary}</small>
                <em>{world.id === "math" ? questionStats.math : questionStats.logic} 题</em>
              </span>
            </button>
          ))}
        </nav>

        <section className="game-column">
          <div className="game-picker" aria-label="关卡列表">
            {visibleGames.length > 0 ? (
              visibleGames.map((game) => (
                <button
                  className={`game-chip ${selectedGameId === game.id ? "active" : ""}`}
                  data-testid={`game-${game.id}`}
                  key={game.id}
                  type="button"
                  onClick={() => {
                    setSelectedGameId(game.id);
                    setRequestedRoundIndex(0);
                  }}
                >
                  {progress.completedIds.includes(game.id) && <Check size={16} />}
                  <span>{game.title}</span>
                  <small>{game.rounds.length} 题</small>
                </button>
              ))
            ) : (
              <span className="empty-chip">这个世界的关卡正在制作</span>
            )}
          </div>

          <article className="game-stage">
            <header className="stage-header">
              <div>
                <h2>{selectedGame.title}</h2>
                <p>{selectedGame.subtitle}</p>
              </div>
              {completed && <span className="done-badge">已完成</span>}
            </header>

            <ProgressiveSetGame
              game={selectedGame}
              requestedRoundIndex={requestedRoundIndex}
              onComplete={() => completeGame(selectedGame)}
              onRoundIndexChange={setRequestedRoundIndex}
              onRoundComplete={completeRound}
            />
          </article>
        </section>

        <aside className="side-panel">
          <RoundNavigator
            completedRoundIds={completedRoundSet}
            currentIndex={requestedRoundIndex}
            rounds={selectedGame.rounds}
            onJump={setRequestedRoundIndex}
          />

          <section className="prompt-panel">
            <p className="eyebrow">亲子提示卡</p>
            <p>{selectedGame.parentPrompt}</p>
          </section>

          <section className="progress-panel">
            <div className="panel-title">
              <p className="eyebrow">成长记录</p>
              <button className="icon-button small" type="button" onClick={resetProgress} aria-label="清空记录">
                <RotateCcw size={16} />
              </button>
            </div>
            {progress.abilityTags.length > 0 ? (
              <div className="tag-list">
                {progress.abilityTags.map((tag) => (
                  <span key={tag}>{tag}</span>
                ))}
              </div>
            ) : (
              <p className="muted">完成一个小任务后，这里会留下能力标签。</p>
            )}
          </section>
        </aside>
      </section>
    </main>
  );
}

function RoundNavigator({
  completedRoundIds,
  currentIndex,
  rounds,
  onJump,
}: {
  completedRoundIds: Set<string>;
  currentIndex: number;
  rounds: GameRound[];
  onJump: (index: number) => void;
}) {
  const completedCount = rounds.filter((round) => completedRoundIds.has(round.id)).length;
  return (
    <section className="round-navigator" aria-label="题目导航">
      <div className="round-nav-header">
        <strong>题目导航</strong>
        <span>{completedCount} / {rounds.length} 已做</span>
      </div>
      <div className="round-jump-grid">
        {rounds.map((round, index) => {
          const done = completedRoundIds.has(round.id);
          const current = index === currentIndex;
          return (
            <button
              aria-label={`跳到第 ${index + 1} 题${done ? "，已做" : ""}`}
              className={`round-jump ${current ? "current" : ""} ${done ? "done" : ""}`}
              key={round.id}
              type="button"
              onClick={() => onJump(index)}
            >
              {done && <Check size={12} />}
              <span>{index + 1}</span>
            </button>
          );
        })}
      </div>
    </section>
  );
}
