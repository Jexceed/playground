import { PackageOpen, Footprints, MessageCircle, Volume2 } from "lucide-react";
import type { ParentActivity as ParentActivityData, AdvancedResponse } from "../domain/advanced-activity";
import { ActivityImage } from "./ActivityTokenArt";
import { speak, stopSpeech } from "../speech";
import { useEffect, useRef, useState } from 'react';

type ParentResponse = Extract<AdvancedResponse, { kind: "parentObservation" }>;
export type ParentMode = 'play' | 'record';
export function ParentActivity({ activity, response, disabled, onChange, mode, onModeChange }: { activity: ParentActivityData; response: ParentResponse; disabled: boolean; onChange: (r: ParentResponse) => void; mode: ParentMode; onModeChange: (mode: ParentMode) => void }) {
  const [stepIndex, setStepIndex] = useState(0);
  const wasDisabled = useRef(disabled);
  useEffect(() => { if (wasDisabled.current && !disabled) setStepIndex(0); wasDisabled.current = disabled; }, [disabled]);
  const longTask = activity.steps.length > 3;
  const chooseStep = (index: number) => { stopSpeech(); setStepIndex(index); };
  const chooseMode = (next: ParentMode) => { stopSpeech(); onModeChange(next); };
  return <div className="parent-playbook" data-mode={mode}>
    <div className="parent-mode" role="group" aria-label="亲子活动内容"><button type="button" aria-pressed={mode === 'play'} onClick={() => chooseMode('play')}>一起玩</button><button type="button" aria-pressed={mode === 'record'} onClick={() => chooseMode('record')}>记发现</button></div>
    {mode === 'play' && activity.materials.length > 0 && <section className="parent-preparation">
      <h3><PackageOpen size={19} />先准备</h3>
      <div className="parent-material-pictures">{(activity.presentation?.materialCards ?? activity.materials.map(label => ({ label, image: undefined }))).map((material, i) => <figure className={material.image ? '' : 'material-text-only'} key={i}>{material.image && <ActivityImage image={material.image} decorative />}<figcaption>{material.label}</figcaption></figure>)}</div>
    </section>}
    {mode === 'play' && <section className="parent-steps"><h3><Footprints size={19} />一起试一试</h3>
      {activity.presentation?.storyCards && <div className="parent-story-strip">{activity.presentation.storyCards.map((art, i) => <figure key={i}><ActivityImage image={art} /><figcaption>{art.alt}</figcaption></figure>)}</div>}
      {longTask && <div className="parent-step-nav" role="group" aria-label="选择操作步骤">{activity.steps.map((_, i) => <button type="button" key={i} aria-pressed={stepIndex === i} aria-label={`查看第${i + 1}步`} onClick={() => chooseStep(i)}>{i + 1}</button>)}</div>}
      <ol>{activity.steps.flatMap((step, i) => !longTask || i === stepIndex ? [<li key={step}><span className="parent-step-number">{i + 1}</span><p>{step}</p><button type="button" className="parent-step-listen" aria-label={`听第${i + 1}步`} onClick={() => void speak(step)}><Volume2 size={18} /></button></li>] : [])}</ol>
      {longTask && <div className="parent-step-arrows"><button type="button" disabled={stepIndex === 0} onClick={() => chooseStep(stepIndex - 1)}>上一步</button><span>第 {stepIndex + 1} / {activity.steps.length} 步</span><button type="button" disabled={stepIndex === activity.steps.length - 1} onClick={() => chooseStep(stepIndex + 1)}>下一步</button></div>}
    </section>}
    {mode === 'record' && <section className="parent-record"><h3><MessageCircle size={19} />做完了，聊一聊</h3><p>请家长按这次实际表现记录，每一项都可以慢慢来。</p>
      {activity.observations.map(o => <div className="parent-observe-row" role="group" aria-label={o.text} key={o.id}><p>{o.text}</p><div className="parent-record-options">{([['independent', '自己做到了'], ['supported', '一起做到了'], ['notYet', '下次再试']] as const).map(([value, label]) => <label key={value} className={response.observations[o.id] === value ? 'is-checked' : ''}><input type="radio" name={`${activity.id}-${o.id}`} value={value} checked={response.observations[o.id] === value} disabled={disabled} onChange={() => onChange({ kind: 'parentObservation', observations: { ...response.observations, [o.id]: value } })} />{label}</label>)}</div></div>)}
    </section>}
  </div>;
}
