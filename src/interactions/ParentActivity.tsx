import { PackageOpen, Footprints, MessageCircle, Volume2 } from "lucide-react";
import type { ParentActivity as ParentActivityData, AdvancedResponse } from "../domain/advanced-activity";
import { ActivityImage } from "./ActivityTokenArt";
import { speak } from "../speech";

type ParentResponse = Extract<AdvancedResponse, { kind: "parentObservation" }>;
export function ParentActivity({ activity, response, disabled, onChange }: { activity: ParentActivityData; response: ParentResponse; disabled: boolean; onChange: (r: ParentResponse) => void }) {
  return <div className="parent-playbook">
    {activity.materials.length > 0 && <section className="parent-preparation">
      <h3><PackageOpen size={19} />先准备</h3>
      <div className="parent-material-pictures">{(activity.presentation?.materialCards ?? activity.materials.map(label => ({ label, image: undefined }))).map((material, i) => <figure className={material.image ? '' : 'material-text-only'} key={i}>{material.image && <ActivityImage image={material.image} decorative />}<figcaption>{material.label}</figcaption></figure>)}</div>
    </section>}
    <section className="parent-steps"><h3><Footprints size={19} />一起试一试</h3>
      {activity.presentation?.storyCards && <div className="parent-story-strip">{activity.presentation.storyCards.map((art, i) => <figure key={i}><ActivityImage image={art} /><figcaption>{art.alt}</figcaption></figure>)}</div>}
      <ol>{activity.steps.map((step, i) => <li key={step}><span className="parent-step-number">{i + 1}</span><p>{step}</p><button type="button" className="parent-step-listen" aria-label={`听第${i + 1}步`} onClick={() => void speak(step)}><Volume2 size={18} /></button></li>)}</ol>
    </section>
    <section className="parent-record"><h3><MessageCircle size={19} />做完了，聊一聊</h3><p>请家长按这次实际表现记录，每一项都可以慢慢来。</p>
      {activity.observations.map(o => <fieldset key={o.id}><legend>{o.text}</legend><div className="parent-record-options">{([['independent', '自己做到了'], ['supported', '一起做到了'], ['notYet', '下次再试']] as const).map(([value, label]) => <label key={value} className={response.observations[o.id] === value ? 'is-checked' : ''}><input type="radio" name={`${activity.id}-${o.id}`} value={value} checked={response.observations[o.id] === value} disabled={disabled} onChange={() => onChange({ kind: 'parentObservation', observations: { ...response.observations, [o.id]: value } })} />{label}</label>)}</div></fieldset>)}
    </section>
  </div>;
}
