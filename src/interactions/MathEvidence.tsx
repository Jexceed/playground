import type { CSSProperties } from 'react';
import { ArrowRight, ArrowDown, ArrowLeft, ArrowUp } from 'lucide-react';
import type { MathEvidence as Evidence } from '../domain/math-evidence';
import { imageGallery } from '../data/imageGallery';
import { ActivityImage } from './ActivityTokenArt';
import { MoneyPiece } from './MoneyArt';
import { PlaceValueBlocks } from './PlaceValueBlocks';
import './math-evidence.css';

function Objects({ count, cookie = false }: { count: number; cookie?: boolean }) {
  return <div className="math-loose-objects" data-count={count}>{Array.from({ length: count }, (_, i) => <ActivityImage key={i} image={cookie ? imageGallery.items.cookie : imageGallery.items.patternBlueDisc} decorative />)}</div>;
}

export function MathClock({ hour, minute, label }: { hour: number; minute: number; label: string }) {
  const point = (angle: number, radius: number) => ({ x: 120 + Math.sin(angle) * radius, y: 120 - Math.cos(angle) * radius });
  const h = point((hour % 12 + minute / 60) * Math.PI / 6, 45), m = point(minute * Math.PI / 30, 72);
  return <div className="math-clock-panel">
    {label && <strong className="math-model-label">{label}</strong>}
    <div className="math-clock" role="img" aria-label={label ? `${label}的钟面` : '钟面'}>
      <svg viewBox="0 0 240 240" aria-hidden="true">
        <circle cx="120" cy="120" r="115" className="math-clock-rim" />
        <circle cx="120" cy="120" r="106" fill="#fffdf6" />
        {Array.from({ length: 60 }, (_, i) => { const a = point(i * Math.PI / 30, i % 5 === 0 ? 99 : 103), b = point(i * Math.PI / 30, 108); return <line key={i} x1={a.x} y1={a.y} x2={b.x} y2={b.y} stroke="#7c8078" strokeWidth={i % 5 === 0 ? 2.6 : 1.3} />; })}
        <line x1="120" y1="120" x2={h.x} y2={h.y} stroke="#3d655a" strokeWidth="8" strokeLinecap="round" data-hand="hour" />
        <line x1="120" y1="120" x2={m.x} y2={m.y} stroke="#4c8199" strokeWidth="5" strokeLinecap="round" data-hand="minute" />
        <circle cx="120" cy="120" r="6" fill="#c99d51" />
      </svg>
      {Array.from({ length: 12 }, (_, index) => { const n = index + 1; return <span className="math-clock-number" key={n} style={{ left: `${50 + Math.sin(n * Math.PI / 6) * 37.5}%`, top: `${50 - Math.cos(n * Math.PI / 6) * 37.5}%` }}>{n}</span>; })}
    </div>
  </div>;
}

export function MathEvidence({ evidence }: { evidence: Evidence }) {
  if (evidence.kind === 'waterModel') return <div className="math-water-model">
    <figure><figcaption>原来</figcaption><ActivityImage image={imageGallery.items.mathWaterTall} /><strong>{evidence.smallCups} 小杯的水</strong></figure>
    <div className="math-water-transfer"><ArrowRight aria-hidden="true" /><span>全部倒入</span></div>
    <figure><figcaption>现在</figcaption><ActivityImage image={imageGallery.items.mathWaterWide} /><strong>? 小杯的水</strong></figure>
  </div>;
  if (evidence.kind === 'placeValueModel') return <PlaceValueBlocks tens={evidence.tens} ones={evidence.ones} />;
  if (evidence.kind === 'numberPattern') return <div className="math-number-pattern" style={{ '--pattern-columns': evidence.columns } as CSSProperties}>
    {evidence.values.map((value, i) => <span key={i}>{value ?? '?'}</span>)}
  </div>;
  if (evidence.kind === 'shapeEquations') return <div className="math-shape-equations">{evidence.relations.map((relation, i) => <div className="math-equation" key={i}>
    {relation.shapes.map((shape, n) => <span className="math-equation-term" key={n}>{n > 0 && <b>+</b>}<span className={`math-equation-shape is-${shape}`} role="img" aria-label={shape === 'circle' ? '圆形' : '三角形'} /></span>)}
    <b>=</b><strong>{relation.total ?? '?'}</strong>
  </div>)}</div>;
  if (evidence.kind === 'clockModel') return <div className={`math-clock-row ${evidence.clocks.length === 1 ? 'is-single' : ''}`}>
    {evidence.clocks.map((c, i) => <MathClock key={i} {...c} />)}
  </div>;
  if (evidence.kind === 'moneyExchange') return <div className="math-money-exchange">
    <div><span className="math-model-label">原来</span><MoneyPiece value={evidence.from} /><strong>1 张</strong></div>
    <ArrowRight className="math-model-arrow" aria-hidden="true" />
    <div><span className="math-model-label">换成</span><MoneyPiece value={evidence.denomination} /><strong className="math-unknown-count">? 张</strong></div>
  </div>;
  if (evidence.kind === 'rulerModel') return <div className="math-ruler" style={{ '--ruler-maximum': evidence.maximum } as CSSProperties}>
    <div className="math-ruler-track">
      <div className="math-measured-paper" style={{ left: `${evidence.start / evidence.maximum * 100}%`, width: `${(evidence.end - evidence.start) / evidence.maximum * 100}%` }} />
      {[evidence.start, evidence.end].map((n, i) => <span className="math-ruler-guide" style={{ left: `${n / evidence.maximum * 100}%` }} key={i} />)}
      <div className="math-ruler-line" />
      {Array.from({ length: evidence.maximum + 1 }, (_, n) => <span className="math-ruler-tick" key={n} style={{ left: `${n / evidence.maximum * 100}%` }}><i /><b>{n}</b></span>)}
    </div>
  </div>;
  if (evidence.kind === 'perimeterModel') return <div className="math-perimeter" style={{ '--perimeter-columns': evidence.columns, '--perimeter-rows': evidence.rows } as CSSProperties}>
    <strong className="math-perimeter-width">{evidence.columns} 格</strong><strong className="math-perimeter-height">{evidence.rows} 格</strong>
    <div className="math-perimeter-grid">{Array.from({ length: evidence.rows * evidence.columns }, (_, i) => <span key={i} />)}</div>
    <ArrowRight className="math-perimeter-top" aria-hidden="true" /><ArrowDown className="math-perimeter-right" aria-hidden="true" /><ArrowLeft className="math-perimeter-bottom" aria-hidden="true" /><ArrowUp className="math-perimeter-left" aria-hidden="true" />
  </div>;
  if (evidence.kind === 'sharingModel') {
    if (evidence.mode === 'groups') return <div className="math-group-model">
      <strong className="math-model-label">每盒 {evidence.each} 个</strong>
      <div className="math-known-groups">{Array.from({ length: evidence.groups }, (_, i) => <div className="math-chip-box" key={i}><Objects count={evidence.each} /></div>)}</div>
    </div>;
    return <div className="math-sharing-model">
      <div><strong className="math-model-label">{evidence.total} {evidence.mode === 'share' ? '块饼干' : '个圆片'}</strong><Objects count={evidence.total} cookie={evidence.mode === 'share'} /></div>
      <ArrowDown className="math-model-arrow" aria-hidden="true" />
      {evidence.mode === 'share' ? <div className="math-recipients">{Array.from({ length: evidence.people }, (_, i) => <div className="math-recipient" key={i}>
        <ActivityImage image={imageGallery.items.child} decorative /><div className="math-empty-plate"><ActivityImage image={imageGallery.items.plate} decorative /><strong>?</strong></div>
      </div>)}</div> : <div className="math-capacity-model"><span className="math-model-label">每盒 {evidence.capacity} 个</span><div className="math-empty-box">{Array.from({ length: evidence.capacity }, (_, i) => <span key={i} />)}</div></div>}
    </div>;
  }
  return null;
}
