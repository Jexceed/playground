import { Maximize2, X } from "lucide-react";
import { useEffect, useRef } from "react";
import { ACTIVITY_COPY, type Activity } from "../domain/activity";
import { imageGallery } from "../data/imageGallery";
import { ActivityImage } from "./ActivityTokenArt";
import { evidenceVisible } from "./presentation-state";
import { RectangleExplorer } from './RectangleExplorer';
import { VisualComparison } from './VisualComparison';
import { MathEvidence } from './MathEvidence';
import { MATH_EVIDENCE_KINDS, type MathEvidence as MathEvidenceData } from '../domain/math-evidence';
import { MoneyPiece, MoneyCollection } from './MoneyArt';
import { QueueCountingEvidence } from './QueueCountingEvidence';

export function ActivityEvidence({ activity, phase }: { activity: Activity; phase: string }) {
  const dialog = useRef<HTMLDialogElement>(null);
  useEffect(() => { dialog.current?.close(); }, [phase, activity.id]);
  if (!evidenceVisible(activity, phase)) return null;
  const art = activity.illustration;
  const evidence = activity.presentation?.evidence;
  const comparison = evidence?.kind === 'visualComparison';
  const queue = evidence?.kind === 'queuePositionAndTail' || evidence?.kind === 'overlapQueue';
  const mathModel = evidence && MATH_EVIDENCE_KINDS.has(evidence.kind);
  const canEnlarge = comparison || mathModel || queue || Boolean(art && !evidence);
  const content = mathModel ? <MathEvidence evidence={evidence as MathEvidenceData} />
  : comparison ? <VisualComparison panels={evidence.panels} />
  : evidence?.kind === 'rectangleSearch' ? <RectangleExplorer rows={evidence.rows} columns={evidence.columns} disabled={phase === 'complete'} />
  : evidence?.kind === 'moneyInventory' ? <div className="math-money-inventory"><div><MoneyCollection values={Array(evidence.fives).fill(5)} /><strong>{evidence.fives} 张</strong></div><div><MoneyCollection values={Array(evidence.ones).fill(1)} /><strong>{evidence.ones} 枚</strong></div></div>
  : evidence?.kind === "quantityStory" ? <div className="quantity-story">
    {evidence.parts.map((part, index) => <div className="quantity-story-step" key={part.label}>
      <span className="evidence-step-label">{part.label}</span>
      <div className="story-object-group">{part.count === null ? <span className="story-unknown">?</span> : Array.from({ length: part.count }, (_, k) => <ActivityImage key={k} image={imageGallery.items.bird} decorative />)}</div>
      <strong>{part.count === null ? '想一想' : `${part.count} 只`}</strong>
      {index < evidence.parts.length - 1 && <span className="story-step-arrow" aria-hidden="true">→</span>}
    </div>)}
  </div> : evidence?.kind === "shopping" ? <div className="shopping-evidence">
    <div className="shop-object"><ActivityImage image={imageGallery.items.book} /><span>价格 <b>{evidence.cost} 元</b></span></div>
    <div className="shop-payment"><span>付给店主</span><MoneyPiece value={evidence.paid} /></div>
    <div className="shop-change"><span>找回</span><strong>?</strong><span>元</span></div>
  </div> : queue ? <QueueCountingEvidence evidence={evidence} />
  : evidence?.kind === "collection" ? <div className="collection-evidence"><p>{evidence.caption}</p><div>{Array.from({ length: evidence.count }, (_, k) => <ActivityImage key={k} image={evidence.image} decorative />)}</div></div>
  : evidence?.kind === "storySequence" ? <div className="parent-story-strip">{evidence.cards.map((image, i) => <figure key={i}><ActivityImage image={image} /><figcaption>{image.alt}</figcaption></figure>)}</div>
  : evidence?.kind === "calendar" ? <table className="practice-calendar" aria-label="练习日历"><thead><tr>{['一', '二', '三', '四', '五', '六', '日'].map(day => <th key={day}>周{day}</th>)}</tr></thead><tbody>{Array.from({ length: 4 }, (_, row) => <tr key={row}>{Array.from({ length: 7 }, (_, col) => <td key={col}>{row * 7 + col + 1}</td>)}</tr>)}</tbody></table>
  : art ? <ActivityImage image={art} className={`activity-evidence-image${art.style === 'illustration' ? ' is-illustration' : ''}`} /> : null;
  if (!content) return null;
  return <figure className="activity-evidence-board">
    <div className="evidence-caption"><span>{evidenceCaption(activity)}</span>{canEnlarge && <button type="button" className="image-enlarge" onClick={() => dialog.current?.showModal()} aria-label="放大题目图片"><Maximize2 size={15} />放大看</button>}</div>
    {content}
    {canEnlarge && <dialog className={`evidence-dialog${comparison ? ' comparison-dialog' : ''}${mathModel || comparison || queue ? ' math-evidence-dialog' : ''}`} ref={dialog} onClick={e => { if (e.target === e.currentTarget) e.currentTarget.close(); }}>
      <button type="button" className="evidence-dialog-close" autoFocus onClick={() => dialog.current?.close()} aria-label="关闭放大图片"><X size={22} /></button>
      {mathModel || comparison || queue ? <><p className="math-zoom-note">{ACTIVITY_COPY.imageScrollHint}</p><div className="math-zoom-scroll" role="region" aria-label="放大的题图" tabIndex={0}><div className="math-model-enlarged">{content}</div></div></> : art && <ActivityImage image={art} className="enlarged-evidence" />}
      <p>{activity.prompt}</p>
    </dialog>}
  </figure>;
}

export function evidenceCaption(activity: Activity): string {
  const evidence = activity.presentation?.evidence;
  if (evidence?.kind === 'queuePositionAndTail' || evidence?.kind === 'overlapQueue') return '一起排队数一数';
  if (evidence?.kind === 'moneyInventory') return ACTIVITY_COPY.moneyStock;
  if (evidence?.kind === 'moneyExchange') return '看面额，想怎么换';
  if (evidence?.kind === 'shopping') return '看价格，算找零';
  if (evidence?.kind === 'rectangleSearch') return '在网格里找长方形';
  if (evidence?.kind === 'calendar') return '看日历，找日期';
  if (evidence?.kind === 'collection') return '看图数一数';
  if (evidence?.kind === 'sharingModel') return '看图分一分、数一数';
  if (evidence?.kind === 'visualComparison') return '对照两组线索';
  if (evidence?.kind === 'waterModel' || evidence?.kind === 'quantityStory' || evidence?.kind === 'storySequence') return '看看发生了什么';
  if (activity.presentation?.folding) return '看折纸步骤，想展开后的样子';
  return '先看图，找线索';
}
