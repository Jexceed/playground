import { Check, RotateCcw } from "lucide-react";
import { useMemo, useState } from "react";
import { games, worlds } from "./data/games";
import { ProgressiveSetGame } from "./games/ProgressiveSetGame";
import { addCompletion, addRoundCompletion, readProgress, saveProgress } from "./storage";
import { speak } from "./speech";
import type { GameConfig, GameRound, ProgressLog, WorldId } from "./types";

export function App() {
  const [activeWorld, setActiveWorld] = useState<WorldId>("math");
  const [selectedGameId, setSelectedGameId] = useState(games[0].id);
  const [requestedRoundIndex, setRequestedRoundIndex] = useState(0);
  const [progress, setProgress] = useState<ProgressLog>(() => readProgress());

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
            <p className="eyebrow">今日探险</p>
            <h1>小小思考岛</h1>
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
