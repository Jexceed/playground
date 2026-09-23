import { Maximize2, X } from "lucide-react";
import { useEffect, useRef } from "react";
import type { Activity } from "../domain/activity";
import { imageGallery } from "../data/imageGallery";
import { ActivityImage } from "./ActivityTokenArt";
import { evidenceVisible } from "./presentation-state";

export function ActivityEvidence({ activity, phase }: { activity: Activity; phase: string }) {
  const dialog = useRef<HTMLDialogElement>(null);
  useEffect(() => { dialog.current?.close(); }, [phase, activity.id]);
  if (!evidenceVisible(activity, phase)) return null;
  const art = activity.illustration;
  const evidence = activity.presentation?.evidence;
  const content = evidence?.kind === "quantityStory" ? <div className="quantity-story">
    {evidence.parts.map((part, index) => <div className="quantity-story-step" key={part.label}>
      <span className="evidence-step-label">{part.label}</span>
      <div className="story-object-group">{part.count === null ? <span className="story-unknown">?</span> : Array.from({ length: part.count }, (_, k) => <ActivityImage key={k} image={imageGallery.items.bird} decorative />)}</div>
      <strong>{part.count === null ? '想一想' : `${part.count} 只`}</strong>
      {index < evidence.parts.length - 1 && <span className="story-step-arrow" aria-hidden="true">→</span>}
    </div>)}
  </div> : evidence?.kind === "shopping" ? <div className="shopping-evidence">
    <div className="shop-object"><ActivityImage image={imageGallery.items.book} /><span>价格 <b>{evidence.cost} 元</b></span></div>
    <div className="shop-payment"><span>付给店主</span><strong>{evidence.paid} <small>元</small></strong></div>
    <div className="shop-change"><span>找回</span><strong>?</strong><span>元</span></div>
  </div> : evidence?.kind === "overlapQueue" ? <div className="queue-overlap-evidence">
    <div><span>从左数到小兔</span><strong>{evidence.left} 位</strong><small>这一组里有小兔</small></div>
    <div className="queue-common-friend"><ActivityImage image={imageGallery.characters.rabbit} /><span>两边都数到了我</span></div>
    <div><span>从右数到小兔</span><strong>{evidence.right} 位</strong><small>这一组里也有小兔</small></div>
  </div> : evidence?.kind === "collection" ? <div className="collection-evidence"><p>{evidence.caption}</p><div>{Array.from({ length: evidence.count }, (_, k) => <ActivityImage key={k} image={evidence.image} decorative />)}</div></div>
  : evidence?.kind === "storySequence" ? <div className="parent-story-strip">{evidence.cards.map((image, i) => <figure key={i}><ActivityImage image={image} /><figcaption>{image.alt}</figcaption></figure>)}</div>
  : evidence?.kind === "calendar" ? <table className="practice-calendar" aria-label="练习日历"><thead><tr>{['一', '二', '三', '四', '五', '六', '日'].map(day => <th key={day}>周{day}</th>)}</tr></thead><tbody>{Array.from({ length: 4 }, (_, row) => <tr key={row}>{Array.from({ length: 7 }, (_, col) => <td key={col}>{row * 7 + col + 1}</td>)}</tr>)}</tbody></table>
  : art ? <ActivityImage image={art} className={`activity-evidence-image${art.style === 'illustration' ? ' is-illustration' : ''}`} /> : null;
  if (!content) return null;
  return <figure className="activity-evidence-board">
    <div className="evidence-caption"><span>{evidence ? '看看发生了什么' : '先看图，找线索'}</span>{art && !evidence && <button type="button" className="image-enlarge" onClick={() => dialog.current?.showModal()} aria-label="放大题目图片"><Maximize2 size={15} />放大看</button>}</div>
    {content}
    {art && !evidence && <dialog className="evidence-dialog" ref={dialog} onClick={e => { if (e.target === e.currentTarget) e.currentTarget.close(); }}>
      <button type="button" className="evidence-dialog-close" autoFocus onClick={() => dialog.current?.close()} aria-label="关闭放大图片"><X size={22} /></button>
      <ActivityImage image={art} className="enlarged-evidence" />
      <p>{activity.prompt}</p>
    </dialog>}
  </figure>;
}
