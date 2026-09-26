import { Check, Eye, Lightbulb, RotateCcw, Volume2, X, Maximize2 } from "lucide-react";
import { useEffect, useReducer, useRef, useState } from "react";
import type { CSSProperties, PointerEvent as ReactPointerEvent } from "react";
import {
  ACTIVITY_COPY,
  activityPromptSpeech,
  activitySlots,
  activitySlotLabel,
} from "../domain/activity";
import type {
  Activity,
  ActivitySet,
  ActivityToken,
  SlotValue,
} from "../domain/activity";
import { responseValue } from "../domain/activity-evaluation";
import { createSession, transitionSession } from "../engine/activity-session";
import type { SessionEvent } from "../engine/activity-session";
import { recordActivityEvent } from "../services/activity-progress";
import type {
  ActivityProgress,
  EvidenceEvent,
} from "../services/activity-progress";
import { playTone, speak, stopSpeech, playRequiredAudio } from "../speech";
import { isAdvancedActivity } from "../domain/advanced-activity";
import { AdvancedInteraction } from "../interactions/AdvancedInteraction";
import { publicAsset } from "../publicAsset";
import { ActivityImage, ActivityTokenArt as TokenArt } from "../interactions/ActivityTokenArt";
import { ActivityEvidence } from "../interactions/ActivityEvidence";
import { PyramidBoard } from '../interactions/PyramidBoard';
import type { ParentMode } from '../interactions/ParentActivity';
import { ImageViewer } from '../interactions/ImageViewer';

type Props = {
  game: ActivitySet;
  requestedRoundIndex: number;
  requestedRoundReadKey: number;
  completedRoundIds: Set<string>;
  onRoundIndexChange: (index: number) => void;
  onProgressChange: (progress: ActivityProgress) => void;
  onComplete: () => void;
};
export function ActivitySetGame(props: Props) {
  const index = Math.min(
    Math.max(props.requestedRoundIndex, 0),
    props.game.rounds.length - 1,
  );
  const activity = props.game.rounds[index];
  const allComplete = props.game.rounds.every((round) =>
    props.completedRoundIds.has(round.id),
  );
  function next() {
    if (index < props.game.rounds.length - 1) {
      props.onRoundIndexChange(index + 1);
      return;
    }
    const firstIncomplete = props.game.rounds.findIndex(
      (r) => !props.completedRoundIds.has(r.id),
    );
    if (firstIncomplete >= 0) props.onRoundIndexChange(firstIncomplete);
    else {
      props.onComplete();
      props.onRoundIndexChange(0);
    }
  }
  return (
    <section className="activity-game" aria-label={props.game.title}>
      <header className="activity-game-heading">
        <div>
          <p className="eyebrow">
            {props.game.interactionLabel === '亲子活动' ? props.game.interactionLabel : activity.stage ? ["", "先试一试", "多想一步", "组合挑战"][activity.stage] : props.game.interactionLabel} · 第 {index + 1} /{" "}
            {props.game.rounds.length} 题
          </p>
          <h1>{props.game.title}</h1>
        </div>
        <button
          className="activity-listen"
          type="button"
          onClick={() => void speak(activityPromptSpeech(activity))}
          aria-label="听一听题目"
        >
          <Volume2 size={21} />
          <span>听题</span>
        </button>
      </header>
      <ActivityRound
        key={`${activity.id}@${activity.revision}`}
        activity={activity}
        readKey={props.requestedRoundReadKey}
        onProgressChange={props.onProgressChange}
        onNext={next}
        onSkip={() =>
          props.onRoundIndexChange((index + 1) % props.game.rounds.length)
        }
        nextLabel={
          index < props.game.rounds.length - 1
            ? "下一题"
            : allComplete
              ? "再玩一遍"
              : "接着试一试"
        }
      />
    </section>
  );
}

function ActivityRound({
  activity,
  readKey,
  onProgressChange,
  onNext,
  onSkip,
  nextLabel,
}: {
  activity: Activity;
  readKey: number;
  onProgressChange: (p: ActivityProgress) => void;
  onNext: () => void;
  onSkip: () => void;
  nextLabel: string;
}) {
  const [state, dispatch] = useReducer(
    (current: ReturnType<typeof createSession>, event: SessionEvent) =>
      transitionSession(activity, current, event),
    activity,
    createSession,
  );
  const [selectedToken, setSelectedToken] = useState<string | null>(null);
  const [pictureTarget, setPictureTarget] = useState<{ source: 'choices' | 'board'; key: string } | null>(null);
  const [parentMode, setParentMode] = useState<ParentMode>('play');
  const [messageMode, setMessageMode] = useState<'hint' | 'result'>('result');
  const [assetsReady, setAssetsReady] = useState(false);
  const [assetError, setAssetError] = useState(false);
  const [remaining, setRemaining] = useState(0);
  const [storageIssue, setStorageIssue] = useState(false);
  const [cueError, setCueError] = useState(false);
  const [dragPoint, setDragPoint] = useState<{
    tokenId: string;
    x: number;
    y: number;
  } | null>(null);
  const pointerDrag = useRef<{
    tokenId: string;
    x: number;
    y: number;
    pointerId: number;
    moved: boolean;
  } | null>(null);
  const [visitId] = useState(() =>
    typeof crypto.randomUUID === "function"
      ? crypto.randomUUID()
      : String(Date.now()) + "-" + Math.random(),
  );
  const recordedThrough = useRef(0);
  const previousPhase = useRef(state.phase);
  const slotEntries = activitySlots(activity);
  const canEdit = state.phase === "respond" && assetsReady;
  const isMemory = activity.protocol.kind === "memory";
  const isListening = activity.protocol.kind === "memory" && !!(activity.protocol.audioText || activity.protocol.soundSrc);
  useEffect(()=>{
    if(state.phase!=="observe" || activity.protocol.kind!=="memory" || !isListening)return;
    let live=true;setCueError(false);
    void playRequiredAudio({text:activity.protocol.audioText,src:activity.protocol.soundSrc,locale:activity.protocol.audioLocale}).then(result=>{
      if(!live)return;
      if(result==="ended")dispatch({type:"observationFinished"});
      else {setCueError(result==="failed");dispatch({type:"interrupt"});}
    });
    return ()=>{live=false;stopSpeech();};
  },[state.phase,activity,isListening]);
  const tokenById = new Map(activity.tokens.map((token) => [token.id, token]));
  const storyTokenIds = activity.kind === 'orderedPlacement' && activity.presentation?.evidence?.kind === 'storySequence' ? activity.presentation.evidence.tokenIds : undefined;
  const palette = activity.presentation?.pyramid?.choiceIds.map(id => tokenById.get(id)!)
    ?? (storyTokenIds ? storyTokenIds.map(id => tokenById.get(id)!) : activity.tokens);
  const pictureTokens = palette.filter(token => token.image.style === 'illustration' && !token.textOnly && !token.quantityPicture);
  useEffect(() => { setPictureTarget(null); }, [activity.id, state.phase]);

  useEffect(() => {
    void speak(activityPromptSpeech(activity));
    return stopSpeech;
  }, [activity, readKey]);

  useEffect(() => {
    let cancelled = false;
    const sources = new Set(activity.tokens.map((t) => t.image.src));
    for (const image of activity.presentation?.storyCards ?? []) sources.add(image.src);
    for (const card of activity.presentation?.materialCards ?? []) if (card.image) sources.add(card.image.src);
    if (activity.presentation?.evidence?.kind === 'storySequence')
      for (const image of activity.presentation.evidence.cards) sources.add(image.src);
    if (activity.presentation?.evidence?.kind === 'visualComparison')
      for (const panel of activity.presentation.evidence.panels) if (panel.kind === 'image') sources.add(panel.image.src);
    if (activity.illustration) sources.add(activity.illustration.src);
    if (activity.kind === "multiSelect" && activity.example)
      sources.add(activity.example.image.src);
    Promise.all(
      [...sources].map(
        (src) =>
          new Promise<void>((resolve, reject) => {
            const image = new Image();
            image.onload = () => resolve();
            image.onerror = () => reject(new Error(src));
            image.src = publicAsset(src);
          }),
      ),
    )
      .then(() => {
        if (!cancelled) setAssetsReady(true);
      })
      .catch(() => {
        if (!cancelled) setAssetError(true);
      });
    return () => {
      cancelled = true;
    };
  }, [activity]);

  useEffect(() => {
    const memory = activity.protocol;
    if (
      memory.kind !== "memory" ||
      (state.phase === "observe" && isListening) ||
      (state.phase !== "observe" && state.phase !== "retain")
    )
      return;
    const duration =
      state.phase === "observe" ? memory.observeMs : memory.retainMs;
    const event =
      state.phase === "observe" ? "observationFinished" : "retentionFinished";
    const deadline = performance.now() + duration;
    setRemaining(Math.ceil(duration / 1000));
    const ticker = window.setInterval(
      () =>
        setRemaining(
          Math.max(0, Math.ceil((deadline - performance.now()) / 1000)),
        ),
      100,
    );
    const timer = window.setTimeout(() => dispatch({ type: event }), duration);
    return () => {
      window.clearInterval(ticker);
      window.clearTimeout(timer);
    };
  }, [activity, state.phase]);

  useEffect(() => {
    if ((state.phase === "observe" && !isListening) || state.phase === "retain") stopSpeech();
    if (state.phase === "respond" && previousPhase.current === "retain")
      void speak(ACTIVITY_COPY.recall);
    previousPhase.current = state.phase;
  }, [state.phase]);

  useEffect(() => {
    const interrupt = () => {
      stopSpeech();
      dispatch({ type: "interrupt" });
    };
    const visibility = () => {
      if (document.hidden) interrupt();
    };
    document.addEventListener("visibilitychange", visibility);
    window.addEventListener("blur", interrupt);
    return () => {
      document.removeEventListener("visibilitychange", visibility);
      window.removeEventListener("blur", interrupt);
    };
  }, []);

  useEffect(() => {
    for (const item of state.evidence.filter(
      (event) => event.sequence > recordedThrough.current,
    )) {
      const event: EvidenceEvent = {
        ...item,
        id: `${visitId}:${item.sequence}`,
      };
      const result = recordActivityEvent(activity.id, activity.revision, event);
      setStorageIssue(!result.stored);
      onProgressChange(result.progress);
      if (!result.stored) break;
      recordedThrough.current = item.sequence;
    }
  }, [activity, state.evidence, visitId, onProgressChange]);

  function chooseToken(token: ActivityToken) {
    if (!canEdit) return;
    playTone("tap");
    if (token.soundSrc) void playRequiredAudio({src:token.soundSrc}); else void speak(token.speechText ?? token.label);
    if (activity.kind === "multiSelect")
      dispatch({ type: "toggle", tokenId: token.id });
    else setSelectedToken(token.id);
  }
  function put(slotId: string, tokenId = selectedToken) {
    if (!canEdit) return;
    if (!tokenId) {
      void speak(ACTIVITY_COPY.selectFirst);
      return;
    }
    dispatch({ type: "place", slotId, tokenId });
    playTone("tap");
    if ((activity.kind === "orderedPlacement" || activity.kind === "gridPlacement") && activity.tokenUse === "once")
      setSelectedToken(null);
  }
  function submit() {
    if (activity.kind === 'parentObservation' && parentMode === 'play') { stopSpeech(); setParentMode('record'); return; }
    const next = transitionSession(activity, state, { type: "submit" });
    dispatch({ type: "submit" });
    setMessageMode('result');
    if (next.result) {
      playTone(next.result.status === "correct" ? "success" : "notice");
      void speak(next.result.message);
    }
    setSelectedToken(null);
  }
  function hint() {
    const text =
      activity.hints[Math.min(state.hints, activity.hints.length - 1)] ??
      ACTIVITY_COPY.hintEnd;
    dispatch({ type: "hint" });
    setMessageMode('hint');
    void speak(text);
  }
  function skip() {
    const result = recordActivityEvent(activity.id, activity.revision, {
      id: `${visitId}:skip`,
      kind: "skip",
    });
    onProgressChange(result.progress);
    stopSpeech();
    onSkip();
  }

  // Pointer capture works for mouse, pen and touch in both WebKit and browsers.
  // HTML drag-and-drop does not reliably provide drop events on these surfaces.
  function dragHandlers(token: ActivityToken, tap: () => void) {
    return {
      onPointerDown: (event: ReactPointerEvent<HTMLElement>) => {
        if (!canEdit || event.button !== 0) return;
        event.currentTarget.setPointerCapture(event.pointerId);
        pointerDrag.current = {
          tokenId: token.id,
          x: event.clientX,
          y: event.clientY,
          pointerId: event.pointerId,
          moved: false,
        };
      },
      onPointerMove: (event: ReactPointerEvent<HTMLElement>) => {
        const drag = pointerDrag.current;
        if (!drag || drag.pointerId !== event.pointerId) return;
        if (Math.hypot(event.clientX - drag.x, event.clientY - drag.y) > 8)
          drag.moved = true;
        if (drag.moved) {
          setSelectedToken(drag.tokenId);
          setDragPoint({
            tokenId: drag.tokenId,
            x: event.clientX,
            y: event.clientY,
          });
        }
      },
      onPointerUp: (event: ReactPointerEvent<HTMLElement>) => {
        const drag = pointerDrag.current;
        if (!drag || drag.pointerId !== event.pointerId) return;
        pointerDrag.current = null;
        setDragPoint(null);
        if (event.currentTarget.hasPointerCapture(event.pointerId))
          event.currentTarget.releasePointerCapture(event.pointerId);
        if (drag.moved) {
          const target = document
            .elementFromPoint(event.clientX, event.clientY)
            ?.closest<HTMLElement>("[data-slot-id]");
          if (target?.dataset.slotId) put(target.dataset.slotId, drag.tokenId);
        } else tap();
      },
      onPointerCancel: () => {
        pointerDrag.current = null;
        setDragPoint(null);
      },
    };
  }

  function renderSlot(
    slot: { id: string; index: number; fixedTokenId: string | null },
    previewId?: string,
    displayNumber = slot.index + 1,
  ) {
    const value: SlotValue = previewId
      ? { state: "filled", tokenId: previewId }
      : slot.fixedTokenId
        ? { state: "filled", tokenId: slot.fixedTokenId }
        : responseValue(state.response, slot.id);
    const token =
      value.state === "filled" ? tokenById.get(value.tokenId) : undefined;
    const fixed = slot.fixedTokenId !== null || previewId !== undefined;
    const label = activitySlotLabel(activity, slot.index);
    return (
      <div
        key={slot.id}
        className={`activity-slot ${fixed ? "is-fixed" : ""} ${token ? "is-filled" : ""} ${state.result?.slotId === slot.id ? 'is-error' : ''}`}
      >
        <span className="slot-number" aria-hidden="true">
          {displayNumber}
        </span>
        {fixed ? (
          <div
            className="fixed-token"
            aria-label={`${label}，${token?.label ?? "图卡"}`}
          >
            <TokenArt token={token} />
          </div>
        ) : (
          <button
            type="button"
            className="slot-target"
            data-slot-id={slot.id}
            aria-label={`${label}，${token?.label ?? "空位"}`}
            disabled={!canEdit}
            {...(token
              ? dragHandlers(token, () =>
                  selectedToken ? put(slot.id) : chooseToken(token),
                )
              : {})}
            onClick={(event) => {
              if (!token || event.detail === 0)
                selectedToken
                  ? put(slot.id)
                  : token
                    ? chooseToken(token)
                    : put(slot.id);
            }}
            onDragOver={(event) => {
              if (canEdit) event.preventDefault();
            }}
            onDrop={(event) => {
              event.preventDefault();
              put(slot.id, event.dataTransfer.getData("text/plain"));
            }}
          >
            {token ? (
              <TokenArt token={token} />
            ) : (
              <span className="slot-question">?</span>
            )}
          </button>
        )}
        {!fixed && token && canEdit && (
          <button
            className="slot-remove"
            type="button"
            aria-label={`清空${label}`}
            onClick={() =>
              dispatch({ type: "place", slotId: slot.id, tokenId: null })
            }
          >
            <X size={12} />
          </button>
        )}
        {token?.image.style === 'illustration' && previewId === undefined && (state.phase === 'respond' || state.phase === 'complete') && <button
          type="button" className="picture-peek slot-picture-peek" title={ACTIVITY_COPY.viewPicture}
          aria-label={`看大图：${label}的${token.label}`} onClick={() => setPictureTarget({ source: 'board', key: slot.id })}><Maximize2 size={14} /></button>}
      </div>
    );
  }
  function tokenButton(token: ActivityToken, multi = false) {
    const illustrated = token.image.style === 'illustration' && !token.textOnly && !token.quantityPicture && !token.moneyValues;
    const selected =
      multi && state.response.kind === "multiSelect"
        ? state.response.tokenIds.includes(token.id)
        : selectedToken === token.id;
    const used =
      !multi &&
      (activity.kind === "orderedPlacement" || activity.kind === "gridPlacement") &&
      activity.tokenUse === "once" &&
      slotEntries.some(
        (s) =>
          responseValue(state.response, s.id).state === "filled" &&
          (
            responseValue(state.response, s.id) as {
              state: "filled";
              tokenId: string;
            }
          ).tokenId === token.id,
      );
    const choice = (
      <button
        key={token.id}
        type="button"
        className={`activity-token ${token.image.style === "illustration" ? "has-illustration" : ""} ${token.textOnly ? "has-text" : ""} ${selected ? "is-selected" : ""} ${used ? "is-used" : ""}`}
        aria-pressed={selected}
        aria-label={token.label}
        data-token-id={token.id}
        disabled={!canEdit}
        {...(!multi ? dragHandlers(token, () => chooseToken(token)) : {})}
        onClick={(event) => {
          if (multi || event.detail === 0) chooseToken(token);
        }}
      >
        {!illustrated && <TokenArt token={token} label />}
        {selected && !illustrated && (
          <span className="token-check">
            <Check size={13} />
          </span>
        )}
      </button>
    );
    return illustrated ? <div className={`illustrated-token${selected ? ' is-selected' : ''}${used ? ' is-used' : ''}`} key={token.id}>
      <div className="illustrated-picture" aria-hidden="true">
        <ActivityImage image={token.image} className="activity-token-image is-illustration" decorative />
        {selected && <span className="token-check"><Check size={13} /></span>}
      </div>
      <span className="token-label illustrated-caption" aria-hidden="true">{token.label}</span>
      {choice}<button type="button" className="picture-peek" title={ACTIVITY_COPY.viewPicture} aria-label={`看大图：${token.label}`}
        onClick={() => setPictureTarget({ source: 'choices', key: token.id })}><Maximize2 size={15} /></button>
    </div> : choice;
  }
  const currentHint =
    state.hints > 0
      ? activity.hints[Math.min(state.hints - 1, activity.hints.length - 1)]
      : null;
  const showResponses = state.phase === "respond" || state.phase === "complete";
  const pictureChoices = pictureTarget?.source === 'board' ? slotEntries.flatMap(slot => {
    const value = responseValue(state.response, slot.id);
    const token = tokenById.get(slot.fixedTokenId ?? (value.state === 'filled' ? value.tokenId : ''));
    return token?.image.style === 'illustration' && !token.textOnly && !token.quantityPicture
      ? [{ key: slot.id, image: { ...token.image, alt: `${activitySlotLabel(activity, slot.index)}：${token.label}` } }] : [];
  }) : pictureTokens.map(token => ({ key: token.id, image: { ...token.image, alt: token.label } }));
  const pictureIndex = pictureChoices.findIndex(item => item.key === pictureTarget?.key);
  const showHint = Boolean(currentHint && (messageMode === 'hint' || !state.result));
  const statusText = showHint ? currentHint : state.result?.message;
  const hasStatus = state.phase !== 'observe' && state.phase !== 'retain';
  return (
    <div
      className="activity-round"
      data-testid="activity-round"
      data-activity-id={activity.id}
      data-family={activity.primaryFamilyId}
      data-readable-evidence={activity.presentation?.readableEvidence || undefined}
      data-phase={state.phase}
      data-kind={activity.kind}
      data-dense={activity.tokens.length > 6 && !activity.presentation?.compactSymbols || undefined}
      data-pyramid={Boolean(activity.presentation?.pyramid) || undefined}
      data-folding={Boolean(activity.presentation?.folding) || undefined}
      data-number-placement={activity.kind === 'orderedPlacement' && activity.tokens.length > 6 && activity.tokens.every(t => t.textOnly && /^\d+$/.test(t.label)) || undefined}
      data-paired-story={activity.kind === 'orderedPlacement' && activity.presentation?.evidence?.kind === 'storySequence' && !storyTokenIds || undefined}
      data-paired-matching={activity.kind === 'matching' && Boolean(activity.illustration) && !isMemory || undefined}
      data-paired-choices={activity.kind === 'multiSelect' && Boolean(activity.illustration) && !activity.presentation?.evidence && activity.tokens.length > 4 && !isMemory || undefined}
      data-paired-grid={activity.kind === 'gridPlacement' && activity.cells.length > 9 && Boolean(activity.illustration) && !isMemory || undefined}
      data-wide-reference={Boolean(activity.illustration && (activity.illustration.width ?? 1) / (activity.illustration.height ?? 1) > 2.5 && !activity.presentation?.folding) || undefined}
      data-parent-mode={activity.kind === 'parentObservation' ? parentMode : undefined}
      data-illustrated={activity.tokens.some(t => t.image.style === "illustration") || undefined}
    >
      <div className="activity-question">
        <h2>{activity.prompt}</h2>
        <p>{activity.instruction}</p>
      </div>

      {!storyTokenIds && (activity.kind !== 'parentObservation' || parentMode === 'play') && <ActivityEvidence activity={activity} phase={state.phase} />}
      {activity.clues.length > 0 && (
        <ol className="activity-clues">
          {activity.clues.map((clue, index) => (
            <li
              key={clue}
              className={state.result?.clueIndex === index ? "clue-focus" : ""}
            >
              <span>{index + 1}</span>
              {clue}
            </li>
          ))}
        </ol>
      )}
      {activity.kind === "multiSelect" && activity.example && (
        <div className="activity-example">
          <span>和它比一比</span>
          <TokenArt token={activity.example} />
          <strong>{activity.example.label}</strong>
        </div>
      )}
      {assetError && <p role="alert">图卡没有加载好，请重新打开这个关卡。</p>}
      {!assetsReady && !assetError && <p className="muted">正在准备图卡…</p>}
      {state.phase === "ready" && (
        <div className="memory-stage memory-ready">
          {isListening ? <Volume2 size={38} /> : <Eye size={38} />}
          <h3>{activity.protocol.kind === "learnThenTransfer" ? "先学一条新规则" : isListening ? "先听清，再来试" : activity.kind === "multiSelect" ? "先看清，再找出来" : activity.kind === "matching" ? "先看清，再连起来" : "先看清，再摆回来"}</h3>
          {activity.protocol.kind === "learnThenTransfer" && <p>{activity.protocol.demonstration}</p>}
          {isListening && <p>先听完声音，线索不会显示在屏幕上。</p>}
          {cueError && <p role="alert">声音暂时没能播放。请重试，听完以后再作答。</p>}
          <p>
            {state.restarts > 0
              ? isListening ? ACTIVITY_COPY.interruptedAudio : ACTIVITY_COPY.interrupted
              : activity.protocol.kind === "learnThenTransfer" ? ACTIVITY_COPY.readyTransfer : isListening ? ACTIVITY_COPY.readyAudio : ACTIVITY_COPY.readyVisual}
          </p>
          <button
            type="button"
            className="activity-primary"
            disabled={!assetsReady}
            onClick={() => dispatch({ type: "start" })}
          >
            {activity.protocol.kind === "learnThenTransfer" ? "我会了，试新题" : isListening ? "开始听声音" : "开始记忆"}
          </button>
        </div>
      )}
      {state.phase === "observe" && isListening && <div className="memory-stage"><Volume2 size={38}/><h3>仔细听一听</h3><p>声音播完后再开始作答。</p></div>}
      {state.phase === "observe" && activity.protocol.kind === "memory" && !isListening && (
        <div className="memory-stage" data-testid="memory-cue">
          <div className="memory-caption">
            <strong>{activity.kind === "multiSelect" ? "记住出现了哪些图卡" : activity.kind === "matching" ? "看清每一组对应关系" : activity.kind === "gridPlacement" ? "看清图卡的位置" : "看清图卡的先后顺序"}</strong>
            <span>还可看 {remaining} 秒</span>
          </div>
          <div
            className={`activity-board ${activity.kind === "gridPlacement" ? "is-grid" : "is-order"}`}
            style={
              {
                "--board-columns":
                  activity.kind === "gridPlacement"
                    ? activity.columns
                    : Math.min(slotEntries.length || (activity.protocol.kind === "memory" ? activity.protocol.preview.length : 1), 6),
              } as CSSProperties
            }
          >
            {slotEntries.length===0 ? activity.protocol.preview.map((id,index)=><div className="activity-token" key={index}><TokenArt token={tokenById.get(id)}/></div>) : slotEntries.map((slot, index) =>
              renderSlot(
                slot,
                activity.protocol.kind === "memory"
                  ? activity.protocol.preview[index]
                  : undefined,
              ),
            )}
          </div>
          <button
            type="button"
            className="activity-secondary"
            onClick={() => dispatch({ type: "observationFinished" })}
          >
            我记好了
          </button>
        </div>
      )}
      {state.phase === "retain" && (
        <div className="memory-stage memory-retain" data-testid="memory-retain">
          <span aria-hidden="true">···</span>
          <h3>{ACTIVITY_COPY.remember}</h3>
          <p>{isListening ? ACTIVITY_COPY.audioRetain : "图卡已经藏起来了"}</p>
        </div>
      )}
      {showResponses && (
        <>
          {isAdvancedActivity(activity) ? <AdvancedInteraction activity={activity} response={state.response} disabled={!canEdit} onChange={response=>dispatch({type:"response",response})} parentMode={parentMode} onParentModeChange={setParentMode}/> : activity.kind === "multiSelect" ? (
            <div className={`activity-choice-grid ${activity.presentation?.compactSymbols ? 'is-symbol-grid' : ''} ${activity.tokens.some(t => (t.image.width ?? 1) / (t.image.height ?? 1) > 1.4) ? "has-wide-options" : ""}`} style={{ '--symbol-columns': activity.tokens.length > 15 ? 7 : Math.min(5, Math.ceil(Math.sqrt(activity.tokens.length))), '--mobile-symbol-columns': Math.min(4, Math.ceil(Math.sqrt(activity.tokens.length))) } as CSSProperties} aria-label="可多选的图卡">
              {activity.tokens.map((t) => tokenButton(t, true))}
            </div>
          ) : (
            <div
              className={`activity-workspace ${activity.presentation?.pyramid ? 'for-pyramid' : activity.kind === "gridPlacement" ? "for-grid" : "for-order"} ${state.phase === "complete" ? "is-complete" : ""}`}
            >
              {activity.kind === 'gridPlacement' && activity.presentation?.pyramid ? <PyramidBoard activity={activity} renderSlot={(slot, column) => renderSlot(slot, undefined, column)} renderBase={id => <TokenArt token={tokenById.get(id)} />} /> : <div
                className={`activity-board ${activity.kind === "gridPlacement" ? "is-grid" : "is-order"}`}
                aria-label={
                  activity.kind === "gridPlacement"
                    ? "图形盘"
                    : "按编号排列的队伍"
                }
                style={
                  {
                    "--board-columns":
                      activity.kind === "gridPlacement"
                        ? activity.columns
                        : Math.min(slotEntries.length, 6),
                  } as CSSProperties
                }
              >
                {slotEntries.map((slot) => renderSlot(slot))}
              </div>}
              {state.phase !== "complete" && (
                <div className="activity-supply">
                  <p className="tray-instruction">
                    {selectedToken
                      ? `已选：${tokenById.get(selectedToken)?.label}。点一个位置放进去。`
                      : "选一张图卡，再点位置放进去；也可以拖过去。"}
                    {activity.tokenUse === "unlimited" && (
                      <span>图卡可以重复用</span>
                    )}
                  </p>
                  <div
                    className="activity-token-tray"
                    aria-label="可使用的图卡"
                    style={
                      {
                        "--tray-columns": Math.min(palette.length, 6),
                        "--grid-tray-columns": Math.min(
                          palette.length,
                          5,
                        ),
                      } as CSSProperties
                    }
                  >
                    {palette.map((t) => tokenButton(t))}
                  </div>
                </div>
              )}
            </div>
          )}
        </>
      )}
      {hasStatus && <div className="activity-status-space" data-testid="activity-status">
        {statusText && <div className={`activity-feedback ${showHint ? 'is-hint' : state.result?.status === 'correct' ? 'is-correct' : ''}`} role="status" aria-live="polite">
          {showHint ? <Lightbulb size={18}/> : state.result?.status === 'correct' ? <Check size={20}/> : null}
          <span>{statusText}</span>
          {currentHint && state.result && state.phase !== 'complete' && <button type="button" className="status-switch" onClick={() => setMessageMode(showHint ? 'result' : 'hint')}>{showHint ? '看检查结果' : '看刚才提示'}</button>}
        </div>}
      </div>}
      <div className="activity-actions">
        {state.phase === "complete" ? (
          <>
            <button
              type="button"
              className="activity-secondary"
              onClick={() => { dispatch({ type: "again" }); setParentMode('play'); setMessageMode('result'); }}
            >
              再试一次
            </button>
            <button
              type="button"
              className="activity-primary"
              onClick={() => {
                stopSpeech();
                onNext();
              }}
            >
              {nextLabel}
            </button>
          </>
        ) : (
          <>
            <div className="activity-tools">
              <button
                type="button"
                title="撤销上一步"
                aria-label="撤销上一步"
                disabled={!canEdit || !state.history.length}
                onClick={() => dispatch({ type: "undo" })}
              >
                <RotateCcw size={18} />
              </button>
              <button
                type="button"
                disabled={!canEdit}
                onClick={() => {
                  dispatch({ type: "clear" });
                  setSelectedToken(null);
                }}
              >
                清空
              </button>
              <button
                type="button"
                disabled={state.phase !== "respond" && state.phase !== "ready"}
                onClick={hint}
              >
                <Lightbulb size={17} />
                提示
              </button>
              {isMemory && (
                <button
                  type="button"
                  disabled={state.phase !== "respond"}
                  onClick={() => {
                    setSelectedToken(null);
                    dispatch({ type: "reveal" });
                  }}
                >
                  {isListening ? <Volume2 size={17} /> : <Eye size={17} />}
                  {isListening ? "再听一次" : "再看一次"}
                </button>
              )}
            </div>
            <button
              type="button"
              className="activity-primary"
              disabled={!canEdit}
              onClick={submit}
            >
              {activity.kind === "parentObservation" ? parentMode === 'play' ? ACTIVITY_COPY.parentRecordNext : "记录这次活动" : activity.presentation?.pyramid ? ACTIVITY_COPY.checkPyramid : activity.kind === "multiSelect" || activity.kind === "singleChoice"
                ? "选好了，看看"
                : "摆好了，看看"}
            </button>
          </>
        )}
      </div>
      <footer className="activity-footer">
        <span>
          这次尝试 {state.attempts} 次 · 提示 {state.hints} 次
          {isMemory ? ` · ${isListening ? "重听" : "重看"} ${state.reveals} 次` : ""}
          {state.checks > 0 ? ` · 中途检查 ${state.checks} 次` : ''}
        </span>
        <button type="button" onClick={skip}>
          先跳过
        </button>
      </footer>
      {storageIssue && (
        <p className="activity-storage-note">
          这台设备暂时不能保存新的练习记录，可以继续玩。
        </p>
      )}
      <ImageViewer images={pictureChoices.map(item => item.image)}
        index={showResponses && pictureIndex >= 0 ? pictureIndex : null}
        onIndexChange={index => { if (pictureTarget && pictureChoices[index]) setPictureTarget({ ...pictureTarget, key: pictureChoices[index].key }); }} onClose={() => setPictureTarget(null)} />
      {dragPoint && (
        <div
          className="activity-drag-preview"
          aria-hidden="true"
          style={{ left: dragPoint.x, top: dragPoint.y }}
        >
          <TokenArt token={tokenById.get(dragPoint.tokenId)} />
        </div>
      )}
    </div>
  );
}
