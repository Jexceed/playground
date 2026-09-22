import { Check, RotateCcw } from "lucide-react";
import { lazy, Suspense, useEffect, useMemo, useState } from "react";
import { catalogGames as games, activitySets, worlds } from "./curriculum/catalog";
import { ProgressiveSetGame } from "./games/ProgressiveSetGame";
import { clearActivityProgress, mergeActivityProgress, readActivityProgress, readCatalogLocation, saveCatalogLocation } from "./services/activity-progress";
import type { CatalogGame } from "./domain/activity";
import { publicAsset } from "./publicAsset";
import { addCompletion, addRoundCompletion, readLastPlayLocation, readProgress, saveLastPlayLocation, saveProgress } from "./storage";
import { speak, stopSpeech, warmVoiceManifest } from "./speech";
import type { GameConfig, GameRound, LastPlayLocation, ProgressLog, WorldId } from "./types";

const brandLogoSrc = "/images/brand/thinking-house-brand-v3.png";
const launchBrandAudioSrc = "/audio/brand/launch-brand-shout.wav";
const maxVisibleProgressTags = 12;
const ActivitySetGame = lazy(() => import("./games/ActivitySetGame").then(module => ({ default: module.ActivitySetGame })));

export function App() {
  const [initialPlayLocation] = useState(resolveInitialPlayLocation);
  const [showSplash, setShowSplash] = useState(true);
  const [activeWorld, setActiveWorld] = useState<WorldId>(initialPlayLocation.worldId);
  const [selectedGameId, setSelectedGameId] = useState(initialPlayLocation.gameId);
  const [requestedRoundIndex, setRequestedRoundIndex] = useState(initialPlayLocation.roundIndex);
  const [roundReadRequestKey, setRoundReadRequestKey] = useState(0);
  const [savedProgress, setProgress] = useState<ProgressLog>(() => readProgress());
  const [activityProgress, setActivityProgress] = useState(() => readActivityProgress().progress);
  const progress = useMemo(() => mergeActivityProgress(savedProgress, activitySets, activityProgress), [savedProgress, activityProgress]);

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
    if (selectedGame.kind === "progressiveSet") {
      saveLastPlayLocation({ worldId: selectedGame.world, gameId: selectedGame.id, roundIndex });
    }
    saveCatalogLocation({
      schemaVersion: 1, worldId: selectedGame.world, gameId: selectedGame.id,
      roundId: selectedGame.rounds[roundIndex].id,
    });
  }, [requestedRoundIndex, selectedGame]);

  const visibleGames = games.filter((game) => game.world === activeWorld)
    .sort((a, b) => Number(b.kind === "activitySet") - Number(a.kind === "activitySet"));
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
  const selectedActivity = selectedGame.kind === "activitySet" ? selectedGame.rounds[requestedRoundIndex] : undefined;
  const activityEvidence = selectedActivity ? activityProgress.entries[`${selectedActivity.id}@${selectedActivity.revision}`] : undefined;
  const completedRoundSet = useMemo(() => new Set(progress.completedRoundIds), [progress.completedRoundIds]);
  const visibleProgressTags = progress.abilityTags.slice(0, maxVisibleProgressTags);
  const hiddenProgressTagCount = Math.max(0, progress.abilityTags.length - visibleProgressTags.length);

  function completeGame(game: GameConfig) {
    const next = addCompletion(savedProgress, game.id, game.abilityTags);
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
    setActivityProgress(clearActivityProgress().progress);
  }

  function requestRoundRead() {
    setRoundReadRequestKey((current) => current + 1);
  }

  function jumpToRound(index: number) {
    stopSpeech();
    setRequestedRoundIndex(index);
    setRoundReadRequestKey((current) => current + 1);
    revealActiveQuestion();
  }

  function chooseWorld(worldId: WorldId) {
    stopSpeech();
    setActiveWorld(worldId);
    const firstGame = activitySets.find((game) => game.world === worldId) ?? games.find((game) => game.world === worldId);
    if (firstGame) {
      setSelectedGameId(firstGame.id);
      setRequestedRoundIndex(0);
      requestRoundRead();
      revealActiveQuestion();
    }
  }

  function chooseGame(gameId: string) {
    stopSpeech();
    setSelectedGameId(gameId);
    setRequestedRoundIndex(0);
    requestRoundRead();
    revealActiveQuestion();
  }

  if (showSplash) {
    return <LaunchSplash onEnter={() => setShowSplash(false)} />;
  }

  return (
    <main className="app-shell">
      <section className="layout">
        <nav className="world-nav" aria-label="主题地图">
          <div className="sidebar-brand">
            <img className="brand-image" src={publicAsset(brandLogoSrc)} alt="小小思考屋 亲子思维游戏" />
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
                    <small>{game.kind === "activitySet" ? "动手 · " : ""}{game.rounds.length} 题</small>
                  </button>
                ))
              ) : (
                <span className="empty-chip">这个世界的关卡正在制作</span>
              )}
            </div>
          </section>
        </nav>

        <section className="game-column">
          <article className="game-stage" tabIndex={-1} aria-label={selectedGame.title}>
            {selectedGame.kind === "activitySet" ? <Suspense fallback={<p className="muted">正在准备图卡…</p>}><ActivitySetGame
              key={selectedGame.id}
              game={selectedGame}
              requestedRoundIndex={requestedRoundIndex}
              requestedRoundReadKey={roundReadRequestKey}
              completedRoundIds={completedRoundSet}
              onRoundIndexChange={setRequestedRoundIndex}
              onProgressChange={setActivityProgress}
              onComplete={() => void speak("完成啦。我们再想一想，为什么会这样？")}
            /></Suspense> : <ProgressiveSetGame
              key={selectedGame.id}
              game={selectedGame}
              requestedRoundIndex={requestedRoundIndex}
              requestedRoundReadKey={roundReadRequestKey}
              onComplete={() => completeGame(selectedGame)}
              onRoundIndexChange={setRequestedRoundIndex}
              onRoundComplete={completeRound}
            />}
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
            <p>{selectedGame.kind === "activitySet" ? selectedGame.rounds[requestedRoundIndex]?.parentPrompt : selectedGame.parentPrompt}</p>
            {selectedGame.kind === "activitySet" && <p className="activity-parent-note">先让孩子自己试，再请他说说线索和理由。提示、重看和尝试会留下记录。</p>}
            {activityEvidence && <div className="activity-evidence" aria-label="本题累计记录">
              <strong>{activityEvidence.correctAttempts > 0 ? "这题做过了" : "正在尝试这道题"}</strong>
              <span>累计尝试 {activityEvidence.attempts} 次</span>
              <span>提示 {activityEvidence.hints} 次 · 重看 {activityEvidence.reveals} 次</span>
            </div>}
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
                {visibleProgressTags.map((tag) => (
                  <span key={tag}>{tag}</span>
                ))}
                {hiddenProgressTagCount > 0 && (
                  <span className="tag-overflow">还有 {hiddenProgressTagCount} 个</span>
                )}
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

function revealActiveQuestion() {
  window.requestAnimationFrame(() => {
    const stage = document.querySelector<HTMLElement>(".game-stage");
    if (!stage) return;
    const top = stage.getBoundingClientRect().top;
    if (top < 0 || top > window.innerHeight / 2) {
      stage.scrollIntoView({ block: "start" });
      stage.focus({ preventScroll: true });
    }
  });
}

function LaunchSplash({ onEnter }: { onEnter: () => void }) {
  const [leaving, setLeaving] = useState(false);

  useEffect(() => {
    const launchBrandAudio = new Audio(publicAsset(launchBrandAudioSrc));
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
          <img className="splash-logo" src={publicAsset(brandLogoSrc)} alt="" />
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
  const stable = readCatalogLocation();
  if (stable) {
    const game = games.find(item => item.id === stable.gameId && item.world === stable.worldId);
    const index = game?.rounds.findIndex(round => round.id === stable.roundId) ?? -1;
    if (game && index >= 0) return { worldId: game.world, gameId: game.id, roundIndex: index };
  }
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

function clampRoundIndex(index: number, game: CatalogGame) {
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
  rounds: Pick<GameRound, "id">[];
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
