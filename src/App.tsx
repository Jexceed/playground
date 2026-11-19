import { Check, RotateCcw } from "lucide-react";
import { lazy, Suspense, useEffect, useMemo, useRef, useState } from "react";
import { curriculumSections, getCurriculumSection, worlds, type CurriculumSectionId } from "./curriculum/catalog";
import { ProgressiveSetGame } from "./games/ProgressiveSetGame";
import { clearActivityProgress, mergeActivityProgress, readActivityProgress, readCatalogLocation, saveCatalogLocation } from "./services/activity-progress";
import { filterWorldGames, nextGameInWorld, readCurriculumNavigation, rememberCurriculumLocation, resolveGamePlayLocation, resolveSectionPlayLocation, saveCurriculumNavigation } from "./services/curriculum-navigation";
import { explorationUnit, groupExplorationGames } from "./curriculum/exploration/navigation";
import type { Activity, CatalogGame } from "./domain/activity";
import { publicAsset } from "./publicAsset";
import { addCompletion, addRoundCompletion, readLastPlayLocation, readProgress, saveLastPlayLocation, saveProgress } from "./storage";
import { speak, stopSpeech, warmVoiceManifest } from "./speech";
import type { GameConfig, GameRound, ProgressLog, WorldId } from "./types";

const brandLogoSrc = "/images/brand/thinking-house-brand-v3.png";
const launchBrandAudioSrc = "/audio/brand/launch-brand-shout.wav";
const maxVisibleProgressTags = 12;
const ActivitySetGame = lazy(() => import("./games/ActivitySetGame").then(module => ({ default: module.ActivitySetGame })));

const worldSummaries: Record<CurriculumSectionId, Partial<Record<WorldId, string>>> = {
  enlightenment: {
    math: "数数、比较、分合、平均分与认钟表",
    logic: "规律、分类、先后顺序、方位与线索推理",
    graphic: "影子轮廓、遮挡还原、叠合、密码与补缺口",
  },
  exploration: {
    math: "数量结构、凑十数位、零钱、时间与日历",
    logic: "多维分类、条件排除、路线、翻牌与连桥",
    graphic: "图形矩阵、对称旋转、折剪、拼搭与三视图",
    memory: "看后回忆、听记指令、声音节奏与专注搜索",
    language: "词义故事、字音对应、英语听辨与日常对话",
    life: "物品分类、自然生长、科学小实验与生活判断",
  },
};

export function App() {
  const [initialNavigation] = useState(() => readCurriculumNavigation(readLastPlayLocation(), readCatalogLocation()));
  const navigation = useRef(initialNavigation);
  const [initialPlayLocation] = useState(() => resolveSectionPlayLocation(initialNavigation.activeSectionId, initialNavigation.locations[initialNavigation.activeSectionId]));
  const [activeSectionId, setActiveSectionId] = useState(initialNavigation.activeSectionId);
  const activeSection = getCurriculumSection(activeSectionId);
  const games = activeSection.games;
  const [gameSearch, setGameSearch] = useState("");
  const searchInput = useRef<HTMLInputElement>(null);
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

  const visibleGames = useMemo(() => filterWorldGames(games, activeWorld, gameSearch), [games, activeWorld, gameSearch]);
  const selectionVisible = visibleGames.some(game => game.id === selectedGameId);
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
  const activeWorldMeta = worlds.find((world) => world.id === activeWorld);
  const activeWorldGameCount = games.filter((game) => game.world === activeWorld).length;
  const selectedRoundIndex = clampRoundIndex(requestedRoundIndex, selectedGame);
  const nextGame = selectedGame.kind === "progressiveSet" ? nextGameInWorld(activeSectionId, selectedGame.id) : undefined;
  const selectedEnlightenmentRound = selectedGame.kind === "progressiveSet" ? selectedGame.rounds[selectedRoundIndex] : undefined;
  const selectedActivity = selectedGame.kind === "activitySet" ? selectedGame.rounds[selectedRoundIndex] : undefined;
  const isParentObservation = selectedActivity?.kind === "parentObservation";
  const isSelectedMemory = selectedActivity?.protocol.kind === "memory";
  const isSelectedAudioMemory = Boolean(
    selectedActivity?.protocol.kind === "memory" && (selectedActivity.protocol.audioText || selectedActivity.protocol.soundSrc),
  );
  const activityEvidence = selectedActivity ? activityProgress.entries[`${selectedActivity.id}@${selectedActivity.revision}`] : undefined;
  const completedRoundSet = useMemo(() => new Set(progress.completedRoundIds), [progress.completedRoundIds]);
  const completedGameCount = progress.completedIds.filter((id) => games.some((game) => game.id === id)).length;
  const completedRoundCount = progress.completedRoundIds.filter((id) =>
    games.some((game) => game.rounds.some((round) => round.id === id)),
  ).length;
  const visibleProgressTags = progress.abilityTags.slice(0, maxVisibleProgressTags);
  const hiddenProgressTagCount = Math.max(0, progress.abilityTags.length - visibleProgressTags.length);

  function completeGame(game: GameConfig) {
    setProgress(current => {
      if (!game.rounds.every(round => current.completedRoundIds.includes(round.id))) return current;
      const next = addCompletion(current, game.id, game.abilityTags);
      saveProgress(next);
      return next;
    });
    if (nextGame) {
      setGameSearch("");
      chooseGame(nextGame.id, true);
    } else {
      speak("完成啦。我们再想一想，为什么会这样？");
    }
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
    if (worldId === activeWorld) return;
    setGameSearch("");
    const firstGame = games.find((game) => game.world === worldId);
    if (firstGame) chooseGame(firstGame.id);
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

  function chooseGame(gameId: string, fromBeginning = false) {
    if (gameId === selectedGame.id) return;
    stopSpeech();
    const location = resolveGamePlayLocation(activeSectionId, gameId, fromBeginning ? undefined : navigation.current.gameLocations[gameId]);
    setActiveWorld(location.worldId);
    setSelectedGameId(location.gameId);
    setRequestedRoundIndex(location.roundIndex);
    requestRoundRead();
    revealActiveQuestion();
  }

  const supportPanel = (
<aside className="side-panel">
          <RoundNavigator
            completedRoundIds={completedRoundSet}
            currentIndex={selectedRoundIndex}
            rounds={selectedGame.rounds}
            onJump={jumpToRound}
          />

          <details className="parent-support-disclosure" open={activeSectionId === "enlightenment"}><summary>给家长 · 陪玩提示</summary>
          <section className="prompt-panel">
            <p className="eyebrow">{selectedGame.kind === "activitySet" ? "本题追问建议" : "本组共玩建议"}</p>
            <p>{selectedGame.kind === "activitySet" ? selectedActivity?.parentPrompt : selectedGame.parentPrompt}</p>
            {selectedGame.kind === "progressiveSet" && <p className="activity-parent-focus">本组目标：{selectedGame.goal}</p>}
            {selectedGame.kind === "progressiveSet" && selectedEnlightenmentRound && <details className="enlightenment-round-guidance">
              <summary>本题怎么追问</summary>
              <p>{selectedEnlightenmentRound.parentPrompt}</p>
              <button type="button" onClick={() => speak(selectedEnlightenmentRound.parentPrompt)}>听本题追问</button>
            </details>}
            {selectedActivity && <p className="activity-parent-note">{isParentObservation ? "和孩子一起动手或轮流说。每一项都可以记为“自己做到了”“一起做到了”或“下次再试”。" : "先让孩子自己试一试，再请孩子说说看到了什么线索、为什么这样判断。提示和尝试都会记在本机。"}</p>}
            {selectedActivity && <p className="activity-parent-focus">这题练习：{selectedActivity.difficultyNote}{selectedActivity.prerequisites ? `。${selectedActivity.prerequisites}` : ""}</p>}
            {selectedActivity?.difficulty?.calibration === "design-estimate" && <p className="activity-parent-focus">每个孩子的节奏不同，建议不按固定年龄对号入座，跟着孩子的实际状态慢慢来。</p>}
            {selectedActivity && selectedActivity.revision > 1 && <p className="activity-parent-focus">题目已优化升级，此前的练习记录仍保留在本机。</p>}
            {activityEvidence && <div className="activity-evidence" aria-label="本题累计记录">
              {isParentObservation ? <>
                <strong>{activityEvidence.observedAt === undefined ? "待记录亲子观察" : "已记录亲子观察"}</strong>
                {activityEvidence.observations && <span>自主 {Object.values(activityEvidence.observations).filter(v=>v==='independent').length} 项 · 一起做到 {Object.values(activityEvidence.observations).filter(v=>v==='supported').length} 项 · 下次再试 {Object.values(activityEvidence.observations).filter(v=>v==='notYet').length} 项</span>}
              </> : <>
                <strong>{activityEvidence.correctAttempts > 0 ? "这题做过了" : "正在尝试这道题"}</strong>
                <span>累计尝试 {activityEvidence.attempts} 次</span>
              </>}
              <span>提示 {activityEvidence.hints} 次{(isSelectedMemory || activityEvidence.reveals > 0) ? ` · ${isSelectedAudioMemory ? "重听" : isSelectedMemory ? "重看" : "重看或重听"} ${activityEvidence.reveals} 次` : ""}</span>
              {(activityEvidence.checks ?? 0) > 0 && <span>中途检查 {activityEvidence.checks} 次</span>}
            </div>}
          </section>

          </details>
          <details className="progress-support-disclosure" open={activeSectionId === "enlightenment"}><summary>{activeSection.name} · 成长记录</summary>
          <section className="progress-panel">
            <div className="panel-title">
              <p className="eyebrow">本机练习足迹</p>
              <button className="icon-button small" type="button" onClick={resetProgress} title={`清空${activeSection.name}记录`} aria-label={`清空${activeSection.name}记录`}>
                <RotateCcw size={16} />
              </button>
            </div>
            <p className="section-progress-count">已完成 {completedGameCount} / {games.length} 组 · {completedRoundCount} / {questionStats.total} 题</p>
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
              <p className="muted">每完成一题或一次亲子活动，这里都会点亮练到的思维能力。</p>
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
                title={section.id === "enlightenment" ? "启蒙：看图观察、点选与动手起步" : "探索：组合线索、多步操作与亲子探究"}
                aria-pressed={activeSectionId === section.id}
                data-testid={`section-${section.id}`}
                onClick={() => chooseSection(section.id)}
              >
                <strong>{section.name}</strong>
                <small>{section.id === "enlightenment" ? "看图起步" : "多步进阶"}</small>
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
                  <small>{worldSummaries[activeSectionId][world.id] ?? world.summary}</small>
                  <em>{questionStats[world.id]} 题</em>
                </span>
              </button>
            ))}
          </div>

          <section className="sidebar-game-picker" aria-label="题组列表">
            <div className="sidebar-section-title">
              <strong>{activeSection.name} · {activeWorldMeta?.name ?? "主题"}</strong>
              <span aria-live="polite">{gameSearch.trim() ? `找到 ${visibleGames.length} 组` : `${visibleGames.length} 组`}</span>
            </div>
            <input ref={searchInput} className="game-search" type="search" aria-label="查找当前主题题组" placeholder="搜题组名称或玩法" value={gameSearch} onChange={event => setGameSearch(event.target.value)} />
            {visibleGames.length > 0 ? <>
              <label className="mobile-game-select">
                <span>选择题组</span>
                <select value={selectionVisible ? selectedGameId : ""} onChange={event => chooseGame(event.target.value)}>
                  {!selectionVisible && <option value="" disabled>选择筛选出的题组</option>}
                  {visibleGames.map(game => <option key={game.id} value={game.id}>
                    {game.title} · {game.rounds.length} 题
                  </option>)}
                </select>
              </label>
              <div className="game-picker">
                {(activeSectionId === "exploration" ? groupExplorationGames(visibleGames) : [{ title: "", games: visibleGames }]).map(unit =>
                  <div className="game-unit" key={unit.title}>
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
                        <small>{game.rounds.length} 题</small>
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </> : (
              <div className="empty-chip-box">
                <span className="empty-chip">
                  {gameSearch.trim() ? "当前主题没有匹配的题组，换个词或切到别的主题试试" : "当前主题暂无题组"}
                </span>
                {gameSearch.trim() && <button className="empty-search-reset" type="button" onClick={() => {
                  setGameSearch("");
                  searchInput.current?.focus();
                }}>清空搜索</button>}
              </div>
            )}
          </section>
        </nav>

        <section className="game-column">
          <header className="curriculum-heading" aria-label="当前学习位置">
            <div>
              <strong>{activeSection.name} · {activeWorldMeta?.name ?? "主题"}{activeSectionId === "exploration" ? ` · ${explorationUnit(selectedGame)}` : ""}</strong>
              <span>{stageHeadingSummary(selectedGame, selectedEnlightenmentRound, selectedActivity)}</span>
            </div>
            <small>本主题 {activeWorldGameCount} 组 · 全阶段 {questionStats.total} 题</small>
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
              completedRoundIds={completedRoundSet}
              nextGameTitle={nextGame?.title}
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
          <span>一起看图、动手，说说为什么</span>
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

function stageHeadingSummary(
  game: CatalogGame,
  enlightenmentRound?: GameRound,
  activity?: Activity,
): string {
  if (game.kind === "progressiveSet") {
    if (game.id === "logic-space-bridge" || game.id === "math-fair-share") {
      return "看清条件、动手试摆，说说为什么这样分或这样搭";
    }
    if (enlightenmentRound?.memory || enlightenmentRound?.observation) {
      return "先专心看图记住线索，遮住后再想一想";
    }
    return "看图发现规律与线索，选好后和家长说说为什么";
  }
  if (activity?.kind === "parentObservation") {
    return "和家长一起动手、观察或轮流表达，完成后记下这次发现";
  }
  if (activity?.protocol.kind === "memory") {
    return "先专心看清或听清内容，再凭记忆一步步还原";
  }
  if (activity?.protocol.kind === "learnThenTransfer") {
    return "先从示例里看懂变化规则，再试着用到新问题上";
  }
  return "结合图面与多条线索动手尝试，做完聊聊是怎么想出来的";
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
              aria-label={`跳到第 ${index + 1} 题${current ? "，当前题" : ""}${done ? "，已做" : ""}`}
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
