import { ArrowRight, Check, Pointer, RotateCcw, RotateCw, Volume2 } from 'lucide-react';
import { useEffect, useState, type CSSProperties, type ReactNode } from 'react';
import type { ActivityResponse, CardFlipEvidence, RuleMachineEvidence } from '../domain/activity';
import { RULE_PLAY_COPY } from '../domain/rule-play';
import { imageGallery } from '../data/imageGallery';
import { speak } from '../speech';
import { ActivityImage } from './ActivityTokenArt';
import './rule-play.css';

const art = imageGallery.items;

/** The art never contains quantities: each visible chip is counted from the task. */
export function CountingDiscs({ count, blue = count }: { count: number; blue?: number }) {
  return <span className="counting-discs" role="img" aria-label={`${count}个圆片`}>
    {Array.from({ length: Math.ceil(count / 5) }, (_, row) => <span className="disc-row" key={row}>
      {Array.from({ length: Math.min(5, count - row * 5) }, (_, col) => <ActivityImage key={col}
        image={row * 5 + col < blue ? art.patternBlueDisc : art.patternYellowDisc} decorative />)}
    </span>)}
  </span>;
}

function WoodenTray({ children, copy = false }: { children: ReactNode; copy?: boolean }) {
  return <div className={`disc-dish${copy ? ' is-copy' : ''}`}>
    <ActivityImage image={art.rulePlayTray} className="wooden-tray-art" decorative />
    <div className="tray-contents">{children}</div>
  </div>;
}

function ToyMachine({ model, example, step, disabled, onAdvance }: {
  model: RuleMachineEvidence; example: boolean; step: number; disabled: boolean; onAdvance: () => void;
}) {
  const finished = step >= (model.multiplier === 2 ? 2 : 1);
  const doubling = example && step === 1 && model.multiplier === 2;
  const plus = <span className="machine-equation"><strong>＋</strong><CountingDiscs count={model.add} blue={0} /></span>;
  const display = <>
    <ActivityImage image={art.rulePlayMachine} className="toy-machine-art" decorative />
    <span className="machine-display">
      {example ? doubling ? <><strong className="machine-times">× 2</strong><span className="machine-display-caption">{RULE_PLAY_COPY.another}</span></> : <>{plus}{model.multiplier === 2 && <span className="machine-next-rule">→ × 2</span>}</>
        : <>{plus}{model.multiplier === 2 && <strong className="machine-times">× 2</strong>}</>}
    </span>
  </>;
  return <div className={`rule-machine-action${example && !finished ? ' is-active' : ''}`}>
    {example && !finished ? <button type="button" className="rule-demo-action machine-action-button" disabled={disabled} onClick={onAdvance}
      aria-label={doubling ? RULE_PLAY_COPY.another : `添上 ${model.add} 个`}>
      <span className="toy-machine-figure">{display}</span>
      <span className="machine-action-label"><Pointer size={20} />{doubling ? RULE_PLAY_COPY.another : `添上 ${model.add} 个`}</span>
    </button> : <div className="toy-machine-figure">{display}</div>}
    <span className="rule-flow-arrow" aria-hidden="true"><ArrowRight size={22} /></span>
  </div>;
}

export function RuleMachineBoard({ model, clues, phase, disabled, onStart }: {
  model: RuleMachineEvidence; clues: string[]; phase: string; disabled: boolean; onStart: () => void;
}) {
  const [step, setStep] = useState(0);
  const [replay, setReplay] = useState(false);
  useEffect(() => { setStep(0); setReplay(false); }, [phase]);
  const example = phase === 'ready' || replay;
  const lastStep = model.multiplier === 2 ? 2 : 1;
  const done = step === lastStep;
  const advance = () => {
    setStep(current => Math.min(current + 1, lastStep));
    void speak(clues[step]);
  };
  return <section className="rule-machine-board" data-example={example || undefined} aria-label={example ? '规则机小例子' : '这次的圆片'}>
    <div className="rule-board-heading">
      <h3><span className="rule-section-number">{example ? '1' : '2'}</span>{example ? RULE_PLAY_COPY.example : RULE_PLAY_COPY.yourTurn}</h3>
      {!example && <button type="button" className="rule-text-button" onClick={() => { setReplay(true); setStep(0); }}><RotateCcw size={17} />{RULE_PLAY_COPY.replay}</button>}
      {replay && <button type="button" className="rule-text-button" onClick={() => setReplay(false)}>{RULE_PLAY_COPY.back}</button>}
    </div>
    <div className="rule-machine-flow">
      <div className="rule-input"><span className="rule-area-label">放进来</span><WoodenTray><CountingDiscs count={example ? 1 : model.start} /></WoodenTray><b>{example ? 1 : model.start}<small> 个</small></b></div>
      <ToyMachine model={model} example={example} step={step} disabled={disabled} onAdvance={advance} />
      <div className="rule-output"><span className="rule-area-label">变成了</span>
        <div className="rule-output-piles" key={example ? step : 'question'} aria-live="polite">
          {example && step > 0 ? <>
            <WoodenTray><CountingDiscs count={1 + model.add} blue={1} /></WoodenTray>
            {step === 2 && <WoodenTray copy><CountingDiscs count={1 + model.add} blue={1} /></WoodenTray>}
          </> : <WoodenTray><span className="tray-question">?</span></WoodenTray>}
        </div>
        {example && step > 0 ? <b>{(1 + model.add) * (step === 2 ? 2 : 1)}<small> 个</small></b> : <b className="rule-unknown-caption">{example ? '动手看看' : '几个呢？'}</b>}
      </div>
    </div>
    {example && step > 0 && <div className="rule-demo-controls">
      <button type="button" className="rule-text-button" onClick={() => setStep(0)}><RotateCcw size={17} />{RULE_PLAY_COPY.again}</button>
      {done && <button type="button" className="rule-demo-action rule-continue" disabled={disabled} onClick={() => { setReplay(false); if (phase === 'ready') onStart(); }}><Check size={21} />{replay ? RULE_PLAY_COPY.back : RULE_PLAY_COPY.try}</button>}
    </div>}
  </section>;
}

function CardFace({ yellow, className = '' }: { yellow: boolean; className?: string }) {
  return <ActivityImage image={yellow ? art.rulePlayCardYellow : art.rulePlayCardWhite} className={className} decorative />;
}

function SmallCards({ initial, target }: { initial: CardFlipEvidence['initial']; target?: number }) {
  return <span className="flip-small-row" aria-hidden="true">{initial.map((face, index) =>
    <span className={`flip-small-card ${target === undefined ? `is-${face}` : target === index ? 'is-target' : 'is-muted'}`} key={index}>
      <CardFace yellow={target === undefined && face === 'on'} />
      {target === index && <RotateCw className="flip-target-mark" size={17} />}<b>{index + 1}</b>
    </span>)}
  </span>;
}

function DoubleSidedCard({ yellow }: { yellow: boolean }) {
  return <span className={`flip-card-surface${yellow ? ' is-yellow' : ''}`} aria-hidden="true">
    <CardFace yellow={false} className="flip-face flip-face-front" />
    <CardFace yellow className="flip-face flip-face-back" />
  </span>;
}

export function CardFlipBoard({ model, response, disabled, onFlip }: {
  model: CardFlipEvidence; response: ActivityResponse; disabled: boolean; onFlip: (slotId: string, tokenId: string) => void;
}) {
  const [demoYellow, setDemoYellow] = useState(false);
  if (response.kind !== 'gridPlacement') return null;
  return <section className="card-flip-board" aria-label="动手翻牌">
    <div className="flip-introduction">
      <div className="flip-start" role="img" aria-label={`开始时：${model.initial.map((face, index) => `第${index + 1}张${face === 'on' ? '黄面' : '白面'}`).join('，')}`}><span className="rule-area-label">开始时</span><SmallCards initial={model.initial} /></div>
      <button type="button" className="flip-demo" aria-label={RULE_PLAY_COPY.flipDemo} onClick={() => { setDemoYellow(!demoYellow); void speak(demoYellow ? RULE_PLAY_COPY.white : RULE_PLAY_COPY.yellow); }}>
        <span className="flip-demo-card"><DoubleSidedCard yellow={demoYellow} /></span><RotateCw size={20} /><span>点点看<br />翻一面</span>
      </button>
    </div>
    <ol className="flip-step-list" aria-label="翻牌顺序">{model.steps.map((target, index) => <li key={index}>
      <button type="button" className="flip-step" aria-label={`听第${index + 1}步：翻第${target + 1}张`} onClick={() => void speak(`第${index + 1}步，翻第${target + 1}张。`)}>
        <span className="flip-step-title"><b>{index + 1}</b>翻第 {target + 1} 张<Volume2 size={16} /></span>
        <SmallCards initial={model.initial} target={target} />
      </button>{index < model.steps.length - 1 && <ArrowRight className="flip-step-arrow" size={20} aria-hidden="true" />}
    </li>)}</ol>
    <div className="flip-play-caption"><Pointer size={20} /><span>{disabled ? '翻好的牌' : '轮到你，点大牌翻面'}</span></div>
    <div className="flip-playing-cards" style={{ '--flip-columns': model.initial.length } as CSSProperties}>
      {model.initial.map((initial, index) => {
        const slotId = `cell-${index}`, value = response.cells[slotId];
        const face = value?.state === 'filled' ? value.tokenId : initial;
        return <div className="flip-card-position" key={slotId}>
          <button type="button" className={`flip-playing-card is-${face}`} disabled={disabled}
            aria-label={`第${index + 1}张，${face === 'on' ? '黄面' : '白面'}，点一下翻面`}
            onClick={() => onFlip(slotId, face === 'on' ? 'off' : 'on')}>
            <DoubleSidedCard yellow={face === 'on'} />
          </button>
          <span className="flip-position-number">{index + 1}</span>
        </div>;
      })}
    </div>
  </section>;
}
