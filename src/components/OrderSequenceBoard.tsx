import { useEffect, useState } from "react";
import { ArrowLeft, ArrowRight, Pause, Play, RotateCcw, Volume2 } from "lucide-react";
import { orderStorySteps } from "../data/orderStories";
import { publicAsset } from "../publicAsset";
import { speak } from "../speech";
import type { GameRound } from "../types";

function useReducedMotion() {
  const [reduced, setReduced] = useState(() => window.matchMedia("(prefers-reduced-motion: reduce)").matches);
  useEffect(() => {
    const query = window.matchMedia("(prefers-reduced-motion: reduce)");
    const change = () => setReduced(query.matches);
    query.addEventListener("change", change);
    return () => query.removeEventListener("change", change);
  }, []);
  return reduced;
}

export function OrderSequenceBoard({ round, solved, showScene, onStart, onScene }: {
  round: GameRound;
  solved: boolean;
  showScene: boolean;
  onStart: () => void;
  onScene: () => void;
}) {
  const steps = orderStorySteps(round, solved);
  const reducedMotion = useReducedMotion();
  const [activeStep, setActiveStep] = useState(0);
  const [playing, setPlaying] = useState(false);

  useEffect(() => {
    setActiveStep(0);
    setPlaying(solved && !showScene && !reducedMotion);
  }, [solved, round.id, showScene, reducedMotion]);

  useEffect(() => {
    if (!playing || showScene || !solved || reducedMotion) return;
    const timer = window.setTimeout(() => {
      if (activeStep >= steps.length - 1) setPlaying(false);
      else setActiveStep(step => step + 1);
    }, 2400);
    return () => window.clearTimeout(timer);
  }, [playing, showScene, solved, reducedMotion, activeStep, steps.length]);

  useEffect(() => {
    const pause = () => setPlaying(false);
    window.addEventListener("blur", pause);
    document.addEventListener("visibilitychange", pause);
    return () => {
      window.removeEventListener("blur", pause);
      document.removeEventListener("visibilitychange", pause);
    };
  }, []);

  if (showScene) return (
    <section className="order-story order-story-intro" aria-label="喝水故事情境">
      <figure>
        <img src={publicAsset(round.sceneImage!.src)} alt={round.sceneImage!.alt} />
      </figure>
      <div className="order-story-intro-controls">
        <span>先看看，小朋友遇到了什么事？</span>
        <button type="button" className="primary" onClick={onStart}>{solved ? "回到完整顺序" : "开始排顺序"}<ArrowRight size={18} /></button>
      </div>
    </section>
  );

  const current = steps[activeStep];
  return (
    <section className={`order-story order-story-task ${solved ? "order-story-solved" : ""}`} aria-label="喝水顺序图卡">
      <div className="order-story-toolbar">
        <strong>{solved ? "连起来，看一看" : "从左到右，补上缺少的一步"}</strong>
        <button type="button" onClick={onScene}>再看场景</button>
      </div>
      {solved && <div className="order-story-demonstration" data-step={activeStep}>
        <img key={activeStep} className={playing ? "order-story-frame-playing" : ""} src={publicAsset(current.image!.src)} alt={current.image!.alt} />
        <div>
          <p className="order-story-current" aria-live={playing ? "off" : "polite"}>第 {activeStep + 1} 步 · {current.label}</p>
          <div className="order-story-playback" aria-label="顺序播放">
            <button type="button" aria-label="上一步" disabled={activeStep === 0} onClick={() => { setPlaying(false); setActiveStep(step => step - 1); }}><ArrowLeft size={18} /></button>
            {!reducedMotion && <button type="button" onClick={() => {
              if (!playing && activeStep === steps.length - 1) setActiveStep(0);
              setPlaying(value => !value);
            }}>{playing ? <Pause size={18} /> : <Play size={18} />}{playing ? "暂停" : "播放"}</button>}
            <button type="button" aria-label="下一步" disabled={activeStep === steps.length - 1} onClick={() => { setPlaying(false); setActiveStep(step => step + 1); }}><ArrowRight size={18} /></button>
            <button type="button" onClick={() => { setActiveStep(0); setPlaying(!reducedMotion); }}><RotateCcw size={16} />重播</button>
          </div>
        </div>
      </div>}
      <ol className="order-story-steps">
        {steps.map((step, index) => <li key={index} className={`${step.missing ? "order-step-missing" : ""} ${step.filled ? "order-step-filled" : ""} ${solved && index === activeStep ? "order-step-current" : ""}`}>
          <button type="button" aria-label={`第${index + 1}步：${step.label}`} aria-current={solved && index === activeStep ? "step" : undefined}
            onClick={() => { if (solved) { setPlaying(false); setActiveStep(index); } speak(step.label); }}>
            {step.image ? <img src={publicAsset(step.image.src)} alt={step.image.alt} /> : <span className="order-story-missing" aria-hidden="true">?</span>}
            <span className="order-story-step-label"><b>{index + 1}</b>{step.label}<Volume2 size={14} /></span>
          </button>
        </li>)}
      </ol>
    </section>
  );
}
