import { PackageOpen, Footprints, MessageCircle, Volume2, Maximize2, ChevronLeft, ChevronRight } from "lucide-react";
import type { ParentActivity as ParentActivityData, AdvancedResponse } from "../domain/advanced-activity";
import { ActivityImage } from "./ActivityTokenArt";
import { speak, stopSpeech } from "../speech";
import { useEffect, useRef, useState } from 'react';
import { ImageViewer } from './ImageViewer';
import { ACTIVITY_COPY } from '../domain/activity';

type ParentResponse = Extract<AdvancedResponse, { kind: "parentObservation" }>;
export type ParentMode = 'play' | 'record';
export function ParentActivity({ activity, response, disabled, onChange, mode, onModeChange }: { activity: ParentActivityData; response: ParentResponse; disabled: boolean; onChange: (r: ParentResponse) => void; mode: ParentMode; onModeChange: (mode: ParentMode) => void }) {
  const [stepIndex, setStepIndex] = useState(0);
  const [pictureIndex, setPictureIndex] = useState<number | null>(null);
  const storyCards = activity.presentation?.storyCards ?? [];
  const materialCards = (activity.presentation?.materialCards ?? activity.materials.map(label => ({ label, image: undefined })))
    .filter(material => !material.label.startsWith('屏幕上的'));
  useEffect(() => { setPictureIndex(null); }, [mode]);
  const wasDisabled = useRef(disabled);
  useEffect(() => { if (wasDisabled.current && !disabled) setStepIndex(0); wasDisabled.current = disabled; }, [disabled]);
  const longTask = activity.steps.length > 3 || Boolean(activity.illustration);
  const chooseStep = (index: number) => { stopSpeech(); setStepIndex(index); };
  const chooseMode = (next: ParentMode) => { stopSpeech(); setPictureIndex(null); onModeChange(next); };
  return <div className="parent-playbook" data-mode={mode} data-story={storyCards.length > 0 || undefined} data-reference={Boolean(activity.illustration) || undefined}>
    <div className="parent-mode" role="group" aria-label="亲子活动内容"><button type="button" aria-pressed={mode === 'play'} onClick={() => chooseMode('play')}>一起玩</button><button type="button" aria-pressed={mode === 'record'} onClick={() => chooseMode('record')}>记发现</button></div>
    {mode === 'play' && materialCards.length > 0 && <section className="parent-preparation">
      <h3><PackageOpen size={19} />先准备</h3>
      <div className="parent-material-pictures">{materialCards.map((material, i) => <figure className={material.image ? '' : 'material-text-only'} key={i}>{material.image && <ActivityImage image={material.image} decorative />}<figcaption>{material.label}</figcaption></figure>)}</div>
    </section>}
    {mode === 'play' && <section className="parent-steps"><h3><Footprints size={19} />一起试一试</h3>
      {storyCards.length > 0 && <div className="parent-story-strip">{storyCards.map((art, i) => <figure key={i}><button type="button" className="story-picture" title={ACTIVITY_COPY.viewPicture} aria-label={`放大故事图：${art.alt}`} onClick={() => setPictureIndex(i)}><ActivityImage image={art} className="parent-story-image" decorative /><span className="picture-enlarge-mark" aria-hidden="true"><Maximize2 size={15} /></span></button><figcaption>{art.alt}</figcaption></figure>)}</div>}
      {longTask && <div className="parent-step-nav" role="group" aria-label="选择操作步骤"><button type="button" aria-label="上一步" disabled={stepIndex === 0} onClick={() => chooseStep(stepIndex - 1)}><ChevronLeft size={17} /></button>{activity.steps.map((_, i) => <button type="button" key={i} aria-pressed={stepIndex === i} aria-label={`查看第${i + 1}步`} onClick={() => chooseStep(i)}>{i + 1}</button>)}<button type="button" aria-label="下一步" disabled={stepIndex === activity.steps.length - 1} onClick={() => chooseStep(stepIndex + 1)}><ChevronRight size={17} /></button><span className="parent-step-progress">第 {stepIndex + 1} / {activity.steps.length} 步</span></div>}
      <ol>{activity.steps.flatMap((step, i) => !longTask || i === stepIndex ? [<li key={step}><span className="parent-step-number">{i + 1}</span><p>{step}</p><button type="button" className="parent-step-listen" aria-label={`听第${i + 1}步`} onClick={() => void speak(step)}><Volume2 size={18} /></button></li>] : [])}</ol>
    </section>}
    {mode === 'record' && <section className="parent-record"><h3><MessageCircle size={19} />做完了，聊一聊</h3><p>请家长按这次实际表现记录，每一项都可以慢慢来。</p>
      {activity.observations.map(o => <div className="parent-observe-row" role="group" aria-label={o.text} key={o.id}><p>{o.text}</p><div className="parent-record-options">{([['independent', '自己做到了'], ['supported', '一起做到了'], ['notYet', '下次再试']] as const).map(([value, label]) => <label key={value} className={response.observations[o.id] === value ? 'is-checked' : ''}><input type="radio" name={`${activity.id}-${o.id}`} value={value} checked={response.observations[o.id] === value} disabled={disabled} onChange={() => onChange({ kind: 'parentObservation', observations: { ...response.observations, [o.id]: value } })} />{label}</label>)}</div></div>)}
    </section>}
    <ImageViewer images={storyCards} index={mode === 'play' ? pictureIndex : null} onIndexChange={setPictureIndex} onClose={() => setPictureIndex(null)} />
  </div>;
}
