import { Check, RotateCcw } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { games, worlds } from "./data/games";
import { ProgressiveSetGame } from "./games/ProgressiveSetGame";
import { addCompletion, addRoundCompletion, readLastPlayLocation, readProgress, saveLastPlayLocation, saveProgress } from "./storage";
import { speak, stopSpeech, warmVoiceManifest } from "./speech";
import type { GameConfig, GameRound, LastPlayLocation, ProgressLog, WorldId } from "./types";

const launchBrandAudioSrc = "/audio/brand/launch-brand-shout.wav";

export function App() {
  const [initialPlayLocation] = useState(resolveInitialPlayLocation);
  const [showSplash, setShowSplash] = useState(true);
  const [activeWorld, setActiveWorld] = useState<WorldId>(initialPlayLocation.worldId);
  const [selectedGameId, setSelectedGameId] = useState(initialPlayLocation.gameId);
  const [requestedRoundIndex, setRequestedRoundIndex] = useState(initialPlayLocation.roundIndex);
  const [roundReadRequestKey, setRoundReadRequestKey] = useState(0);
  const [progress, setProgress] = useState<ProgressLog>(() => readProgress());

  useEffect(() => {
    warmVoiceManifest();
  }, []);

  const selectedGame = useMemo(
    () => games.find((game) => game.id === selectedGameId) ?? games[0],
    [selectedGameId],
  );

  useEffect(() => {
    const roundIndex = clampRoundIndex(requestedRoundIndex, selectedGame);
    if (roundIndex !== requestedRoundIndex) {
      setRequestedRoundIndex(roundIndex);
      return;
    }
    saveLastPlayLocation({
      worldId: selectedGame.world,
      gameId: selectedGame.id,
      roundIndex,
    });
  }, [requestedRoundIndex, selectedGame]);

  const visibleGames = games.filter((game) => game.world === activeWorld);
  const questionStats = useMemo(() => {
    const counts = Object.fromEntries(
      worlds.map((world) => [
        world.id,
        games.filter((game) => game.world === world.id).reduce((sum, game) => sum + game.rounds.length, 0),
      ]),
    ) as Record<WorldId, number>;
    return {
      ...counts,
      total: Object.values(counts).reduce((sum, count) => sum + count, 0),
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

  function requestRoundRead() {
    setRoundReadRequestKey((current) => current + 1);
  }

  function jumpToRound(index: number) {
    stopSpeech();
    setRequestedRoundIndex(index);
    setRoundReadRequestKey((current) => current + 1);
  }

  function chooseWorld(worldId: WorldId) {
    stopSpeech();
    setActiveWorld(worldId);
    const firstGame = games.find((game) => game.world === worldId);
    if (firstGame) {
      setSelectedGameId(firstGame.id);
      setRequestedRoundIndex(0);
      requestRoundRead();
    }
  }

  function chooseGame(gameId: string) {
    stopSpeech();
    setSelectedGameId(gameId);
    setRequestedRoundIndex(0);
    requestRoundRead();
  }

  if (showSplash) {
    return <LaunchSplash onEnter={() => setShowSplash(false)} />;
  }

  return (
    <main className="app-shell">
      <section className="layout">
        <nav className="world-nav" aria-label="主题地图">
          <div className="sidebar-brand">
            <img className="brand-image" src="/images/brand/thinking-house-brand-v3.png" alt="小小思考屋 亲子思维游戏" />
          </div>

          <div className="world-switcher">
            {worlds.map((world) => (
              <button
                className={`world-button ${activeWorld === world.id ? "active expanded" : "collapsed"}`}
                aria-expanded={activeWorld === world.id}
                data-testid={`world-${world.id}`}
                key={world.id}
                type="button"
                onClick={() => chooseWorld(world.id)}
              >
                <span className={`world-icon world-icon-${world.id}`} aria-hidden="true" />
                <span>
                  <strong>{world.name}</strong>
                  <small>{world.summary}</small>
                  <em>{questionStats[world.id]} 题</em>
                </span>
              </button>
            ))}
          </div>

          <section className="sidebar-game-picker" aria-label="关卡列表">
            <div className="sidebar-section-title">
              <strong>{worlds.find((world) => world.id === activeWorld)?.name ?? "关卡"}关卡</strong>
              <span>{visibleGames.length} 个</span>
            </div>
            <label className="mobile-game-select">
              <span>选择关卡</span>
              <select
                value={selectedGameId}
                onChange={(event) => chooseGame(event.target.value)}
              >
                {visibleGames.map((game) => (
                  <option key={game.id} value={game.id}>
                    {game.title} · {game.rounds.length} 题
                  </option>
                ))}
              </select>
            </label>
            <div className="game-picker">
              {visibleGames.length > 0 ? (
                visibleGames.map((game) => (
                  <button
                    className={`game-chip ${selectedGameId === game.id ? "active" : ""}`}
                    data-testid={`game-${game.id}`}
                    key={game.id}
                    type="button"
                    onClick={() => chooseGame(game.id)}
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
          </section>
        </nav>

        <section className="game-column">
          <article className="game-stage">
            <ProgressiveSetGame
              key={selectedGame.id}
              game={selectedGame}
              requestedRoundIndex={requestedRoundIndex}
              requestedRoundReadKey={roundReadRequestKey}
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
            onJump={jumpToRound}
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

function LaunchSplash({ onEnter }: { onEnter: () => void }) {
  const [leaving, setLeaving] = useState(false);

  useEffect(() => {
    const launchBrandAudio = new Audio(launchBrandAudioSrc);
    launchBrandAudio.preload = "auto";
    launchBrandAudio.volume = 0.9;
    const voiceTimer = window.setTimeout(() => {
      launchBrandAudio.currentTime = 0;
      void launchBrandAudio.play().catch(() => undefined);
    }, 720);
    const splashTimer = window.setTimeout(() => {
      setLeaving(true);
    }, 2820);
    const enterTimer = window.setTimeout(onEnter, 3580);
    return () => {
      window.clearTimeout(voiceTimer);
      window.clearTimeout(splashTimer);
      window.clearTimeout(enterTimer);
      launchBrandAudio.pause();
    };
  }, [onEnter]);

  return (
    <main className={`startup-splash ${leaving ? "leaving" : ""}`} aria-label="小小思考屋启动页">
      <div className="splash-orbit" aria-hidden="true">
        <span />
        <span />
        <span />
        <span />
      </div>
      <div className="splash-stage">
        <div className="splash-logo-wrap" aria-hidden="true">
          <img className="splash-logo" src="/images/brand/thinking-house-brand-v3.png" alt="" />
          <span className="splash-glow" />
        </div>
        <div className="splash-title">
          <strong>小小思考屋</strong>
          <span>正在打开今天的小小问题</span>
        </div>
        <div className="splash-light-trail" aria-hidden="true">
          <span />
          <span />
          <span />
        </div>
        <div className="splash-dots" aria-hidden="true">
          <span />
          <span />
          <span />
        </div>
      </div>
    </main>
  );
}

function resolveInitialPlayLocation(): LastPlayLocation {
  return normalizeLastPlayLocation(readLastPlayLocation());
}

function normalizeLastPlayLocation(saved: LastPlayLocation | null): LastPlayLocation {
  const fallbackGame = games[0];
  if (!saved) {
    return { worldId: fallbackGame.world, gameId: fallbackGame.id, roundIndex: 0 };
  }

  const worldExists = worlds.some((world) => world.id === saved.worldId);
  const worldId = worldExists ? saved.worldId : fallbackGame.world;
  const game = games.find((item) => item.id === saved.gameId && item.world === worldId) ?? games.find((item) => item.world === worldId) ?? fallbackGame;

  return {
    worldId: game.world,
    gameId: game.id,
    roundIndex: clampRoundIndex(saved.roundIndex, game),
  };
}

function clampRoundIndex(index: number, game: GameConfig) {
  return Math.min(Math.max(index, 0), Math.max(game.rounds.length - 1, 0));
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
