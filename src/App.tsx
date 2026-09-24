import { Check, RotateCcw } from "lucide-react";
import { lazy, Suspense, useEffect, useMemo, useRef, useState } from "react";
import { curriculumSections, getCurriculumSection, worlds, type CurriculumSectionId } from "./curriculum/catalog";
import { ProgressiveSetGame } from "./games/ProgressiveSetGame";
import { clearActivityProgress, mergeActivityProgress, readActivityProgress, readCatalogLocation, saveCatalogLocation } from "./services/activity-progress";
import { readCurriculumNavigation, rememberCurriculumLocation, resolveSectionPlayLocation, saveCurriculumNavigation } from "./services/curriculum-navigation";
import { groupExplorationGames } from "./curriculum/exploration/navigation";
import { ACTIVITY_COPY, type CatalogGame } from "./domain/activity";
import { publicAsset } from "./publicAsset";
import { addCompletion, addRoundCompletion, readLastPlayLocation, readProgress, saveLastPlayLocation, saveProgress } from "./storage";
import { speak, stopSpeech, warmVoiceManifest } from "./speech";
import type { GameConfig, GameRound, ProgressLog, WorldId } from "./types";

const brandLogoSrc = "/images/brand/thinking-house-brand-v3.png";
const launchBrandAudioSrc = "/audio/brand/launch-brand-shout.wav";
const maxVisibleProgressTags = 12;
const ActivitySetGame = lazy(() => import("./games/ActivitySetGame").then(module => ({ default: module.ActivitySetGame })));

export function App() {
  const [initialNavigation] = useState(() => readCurriculumNavigation(readLastPlayLocation(), readCatalogLocation()));
  const navigation = useRef(initialNavigation);
  const [initialPlayLocation] = useState(() => resolveSectionPlayLocation(initialNavigation.activeSectionId, initialNavigation.locations[initialNavigation.activeSectionId]));
  const [activeSectionId, setActiveSectionId] = useState(initialNavigation.activeSectionId);
  const activeSection = getCurriculumSection(activeSectionId);
  const games = activeSection.games;
  const [gameSearch,setGameSearch] = useState("");
  const [showSplash, setShowSplash] = useState(true);
  const [activeWorld, setActiveWorld] = useState<WorldId>(initialPlayLocation.worldId);
  const [selectedGameId, setSelectedGameId] = useState(initialPlayLocation.gameId);
  const [requestedRoundIndex, setRequestedRoundIndex] = useState(initialPlayLocation.roundIndex);
  const [roundReadRequestKey, setRoundReadRequestKey] = useState(0);
  const [savedProgress, setProgress] = useState<ProgressLog>(() => readProgress());
  const [activityProgress, setActivityProgress] = useState(() => readActivityProgress().progress);
  const explorationProgress = useMemo(() => mergeActivityProgress(
    { completedIds: [], completedRoundIds: [], abilityTags: [] },
    getCurriculumSection("exploration").games.filter(game => game.kind === "activitySet"), activityProgress,
  ), [activityProgress]);
  const progress = activeSectionId === "enlightenment" ? savedProgress : explorationProgress;

  useEffect(() => {
    warmVoiceManifest();
  }, []);

  const selectedGame = useMemo(
    () => games.find((game) => game.id === selectedGameId) ?? games[0],
    [selectedGameId, games],
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
    const location = {
      schemaVersion: 1 as const, worldId: selectedGame.world, gameId: selectedGame.id,
      roundId: selectedGame.rounds[roundIndex].id,
    };
    navigation.current = rememberCurriculumLocation(navigation.current, activeSectionId, location);
    saveCurriculumNavigation(navigation.current);
    saveCatalogLocation(location);
  }, [requestedRoundIndex, selectedGame, activeSectionId]);

  const visibleGames = games.filter((game) => game.world === activeWorld && `${game.title}${game.subtitle}`.includes(gameSearch.trim()));
  const visibleWorlds = worlds.filter(world => games.some(game => game.world === world.id));
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
  }, [games]);
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
    if (activeSectionId === "enlightenment") {
      const empty = { completedIds: [], completedRoundIds: [], abilityTags: [] };
      setProgress(empty);
      saveProgress(empty);
    } else {
      setActivityProgress(clearActivityProgress().progress);
    }
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
    setGameSearch("");
    stopSpeech();
    setActiveWorld(worldId);
    const firstGame = games.find((game) => game.world === worldId);
    if (firstGame) {
      setSelectedGameId(firstGame.id);
      setRequestedRoundIndex(0);
      requestRoundRead();
      revealActiveQuestion();
    }
  }

  function chooseSection(sectionId: CurriculumSectionId) {
    if (sectionId === activeSectionId) return;
    setGameSearch("");
    stopSpeech();
    const location = resolveSectionPlayLocation(sectionId, navigation.current.locations[sectionId]);
    setActiveSectionId(sectionId);
    setActiveWorld(location.worldId);
    setSelectedGameId(location.gameId);
    setRequestedRoundIndex(location.roundIndex);
    requestRoundRead();
    revealActiveQuestion();
  }

  function chooseGame(gameId: string) {
    stopSpeech();
    setSelectedGameId(gameId);
    setRequestedRoundIndex(0);
    requestRoundRead();
    revealActiveQuestion();
  }

  const supportPanel = (
<aside className="side-panel">
          <RoundNavigator
            completedRoundIds={completedRoundSet}
            currentIndex={requestedRoundIndex}
            rounds={selectedGame.rounds}
            onJump={jumpToRound}
          />

          <details className="parent-support-disclosure" open={activeSectionId === "enlightenment"}><summary>给家长 · 陪玩提示</summary>
          <section className="prompt-panel">
            <p className="eyebrow">亲子提示卡</p>
            <p>{selectedGame.kind === "activitySet" ? selectedGame.rounds[requestedRoundIndex]?.parentPrompt : selectedGame.parentPrompt}</p>
            {selectedGame.kind === "activitySet" && <p className="activity-parent-note">先让孩子自己试，再请他说说线索和理由。提示、重看和尝试会留下记录。</p>}
            {selectedActivity && <p className="activity-parent-focus">这题练习：{selectedActivity.difficultyNote}{selectedActivity.prerequisites ? `。${selectedActivity.prerequisites}` : ""}</p>}
            {selectedActivity?.difficulty?.calibration === 'design-estimate' && <p className="activity-parent-focus">{ACTIVITY_COPY.designEstimate}</p>}
            {selectedActivity && selectedActivity.revision > 1 && <p className="activity-parent-focus">题目已更新，原有练习记录仍保留。</p>}
            {activityEvidence && <div className="activity-evidence" aria-label="本题累计记录">
              <strong>{activityEvidence.observedAt ? "已记录亲子观察" : activityEvidence.correctAttempts > 0 ? "这题做过了" : "正在尝试这道题"}</strong>
              {activityEvidence.observations ? <span>自主 {Object.values(activityEvidence.observations).filter(v=>v==='independent').length} 项 · 一起做到 {Object.values(activityEvidence.observations).filter(v=>v==='supported').length} 项 · 下次再试 {Object.values(activityEvidence.observations).filter(v=>v==='notYet').length} 项</span> : <span>累计尝试 {activityEvidence.attempts} 次</span>}
              <span>提示 {activityEvidence.hints} 次 · 重看或重听 {activityEvidence.reveals} 次</span>
              {(activityEvidence.checks ?? 0) > 0 && <span>中途检查 {activityEvidence.checks} 次</span>}
            </div>}
          </section>

          </details>
          <details className="progress-support-disclosure" open={activeSectionId === "enlightenment"}><summary>{activeSection.name} · 成长记录</summary>
          <section className="progress-panel">
            <div className="panel-title">
              <p className="eyebrow">{activeSection.name}成长记录</p>
              <button className="icon-button small" type="button" onClick={resetProgress} aria-label={`清空${activeSection.name}记录`}>
                <RotateCcw size={16} />
              </button>
            </div>
            <p className="section-progress-count">已完成 {progress.completedRoundIds.filter(id => games.some(game => game.rounds.some(round => round.id === id))).length} / {questionStats.total} 题</p>
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
          </details>
        </aside>
  );

  if (showSplash) {
    return <LaunchSplash onEnter={() => setShowSplash(false)} />;
  }

  return (
    <main className="app-shell" data-section={activeSectionId}>
      <section className="layout">
        <nav className="world-nav" aria-label="主题地图">
          <div className="sidebar-brand">
            <img className="brand-image" src={publicAsset(brandLogoSrc)} alt="小小思考屋 亲子思维游戏" />
          </div>

          <div className="curriculum-switcher" role="group" aria-label="选择启蒙或探索">
            {curriculumSections.map(section => (
              <button
                className={`curriculum-button ${activeSectionId === section.id ? "active" : ""}`}
                type="button"
                key={section.id}
                aria-pressed={activeSectionId === section.id}
                data-testid={`section-${section.id}`}
                onClick={() => chooseSection(section.id)}
              >
                <strong>{section.name}</strong>
                <small>{section.id === "enlightenment" ? "轻松起步" : "进阶挑战"}</small>
              </button>
            ))}
          </div>

          <div className="world-switcher">
            {visibleWorlds.map((world) => (
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
              <strong>{activeSection.name} · {worlds.find((world) => world.id === activeWorld)?.name ?? "关卡"}</strong>
              <span>{visibleGames.length} 个</span>
            </div>
            <input className="game-search" type="search" aria-label="查找当前主题题组" placeholder="查找题组" value={gameSearch} onChange={event=>setGameSearch(event.target.value)}/>
            <label className="mobile-game-select">
              <span>选择关卡</span>
              <select
                value={visibleGames.some(game=>game.id===selectedGameId)?selectedGameId:""}
                onChange={(event) => chooseGame(event.target.value)}
              >
                {!visibleGames.some(game=>game.id===selectedGameId)&&<option value="" disabled>选择找到的题组</option>}
                {visibleGames.map((game) => (
                  <option key={game.id} value={game.id}>
                    {game.title} · {game.rounds.length} 题
                  </option>
                ))}
              </select>
            </label>
            <div className="game-picker">
              {visibleGames.length > 0 ? (
                (activeSectionId === "exploration" ? groupExplorationGames(visibleGames) : [{ title: "", games: visibleGames }]).map(unit => <div className="game-unit" key={unit.title}>
                  {unit.title && <h3>{unit.title}</h3>}
                  {unit.games.map(game => (
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
                  ))}
                </div>)
              ) : (
                <span className="empty-chip">这个世界的关卡正在制作</span>
              )}
            </div>
          </section>
        </nav>

        <section className="game-column">
          <header className="curriculum-heading" aria-label="当前部分">
            <div><strong>{activeSection.name}</strong><span>{activeSection.summary}</span></div>
            <small>{games.length} 组 · {questionStats.total} 题</small>
          </header>
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

        {supportPanel}
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
