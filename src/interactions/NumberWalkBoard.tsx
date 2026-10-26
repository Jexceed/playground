import { Check, Flag, Footprints, Hand, Volume2 } from 'lucide-react';
import { useEffect, useRef, useState, type CSSProperties, type DragEvent } from 'react';
import type { ActivityResponse, NumberWalkEvidence } from '../domain/activity';
import { responseValue } from '../domain/activity-evaluation';
import { imageGallery } from '../data/imageGallery';
import { speak } from '../speech';
import { ActivityImage } from './ActivityTokenArt';
import './number-walk.css';

type Actor = NumberWalkEvidence['actors'][number];
type Props = {
  model: NumberWalkEvidence;
  response: ActivityResponse;
  disabled: boolean;
  onPlace: (slotId: string, tokenId: string) => void;
  clues: string[];
};

const friends = {
  red: { name: '红色朋友', image: imageGallery.characters.rabbit },
  blue: { name: '蓝色朋友', image: imageGallery.characters.dog },
};
const actorDragType = 'application/x-number-walk-actor';

/** This miniature explains one move, without showing any destination from the question. */
function StepModel({ actor }: { actor: Actor }) {
  const length = Math.abs(actor.delta);
  const count = length + 1;
  const right = actor.delta > 0;
  const origin = right ? 0 : length;
  const target = right ? length : 0;
  const width = count * 40;
  const startX = origin * 40 + 20;
  const endX = target * 40 + 20;
  return <div className="number-walk-step-model" role="img" aria-label={`每次向${right ? '右' : '左'}走${length}格`}>
    <span className="number-walk-step-copy">每次向{right ? '右' : '左'} <b>{length}</b> 格</span>
    <span className="number-walk-mini-track" style={{ '--walk-mini-columns': count } as CSSProperties} aria-hidden="true">
      <svg className="number-walk-hop" viewBox={`0 0 ${width} 44`}>
        <path d={`M ${startX} 35 Q ${width / 2} -12 ${endX} 30`} />
        <path className="number-walk-arrow-tip" d={right ? `M ${endX - 9} 27 L ${endX} 33 L ${endX + 1} 22` : `M ${endX - 1} 22 L ${endX} 33 L ${endX + 9} 27`} />
      </svg>
      {Array.from({ length: count }, (_, index) => <span className={`number-walk-mini-cell${index === origin ? ' is-origin' : ''}`} key={index}>
        {index === origin ? <ActivityImage image={friends[actor.id].image} decorative /> : <Footprints size={19} />}
      </span>)}
    </span>
  </div>;
}

/** All positions come from the child's response. The board never calculates an answer. */
export function NumberWalkBoard({ model, response, disabled, onPlace, clues }: Props) {
  const [selectedId, setSelectedId] = useState<Actor['id']>(model.actors[0]?.id ?? 'red');
  const scrollRef = useRef<HTMLDivElement>(null);
  const selected = model.actors.find(actor => actor.id === selectedId) ?? model.actors[0];
  const numbers = Array.from({ length: model.max - model.min + 1 }, (_, index) => model.min + index);
  const readPosition = (actor: Actor) => {
    const value = responseValue(response, actor.slotId);
    const number = value.state === 'filled' && /^n\d+$/.test(value.tokenId) ? Number(value.tokenId.slice(1)) : null;
    const filled = number !== null && number >= model.min && number <= model.max;
    return { filled, position: filled ? number : actor.start };
  };
  const selectedPosition = selected ? readPosition(selected).position : model.min;

  useEffect(() => { setSelectedId(model.actors[0]?.id ?? 'red'); }, [model]);
  useEffect(() => {
    const container = scrollRef.current;
    const cell = container?.querySelector<HTMLElement>(`[data-number-walk-position="${selectedPosition}"]`);
    if (!container || !cell || container.scrollWidth <= container.clientWidth) return;
    const box = container.getBoundingClientRect();
    const target = cell.getBoundingClientRect();
    container.scrollTo({ left: container.scrollLeft + target.left - box.left - (container.clientWidth - target.width) / 2,
      behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth' });
  }, [selectedId, selectedPosition, model]);

  if (!selected || response.kind !== 'orderedPlacement') return null;

  function choose(actor: Actor) {
    if (!disabled) setSelectedId(actor.id);
  }
  function place(actor: Actor, position: number) {
    if (disabled) return;
    onPlace(actor.slotId, `n${position}`);
  }
  function drag(actor: Actor, event: DragEvent<HTMLButtonElement>) {
    if (disabled) { event.preventDefault(); return; }
    setSelectedId(actor.id);
    event.dataTransfer.setData(actorDragType, actor.id);
    event.dataTransfer.effectAllowed = 'move';
  }
  function drop(position: number, event: DragEvent<HTMLButtonElement>) {
    event.preventDefault();
    if (disabled) return;
    const actor = model.actors.find(item => item.id === event.dataTransfer.getData(actorDragType));
    if (actor) { setSelectedId(actor.id); place(actor, position); }
  }

  return <section className="number-walk-board" aria-label="两位朋友走格子模型" data-testid="number-walk-board" data-selected-actor={selected.id}>
    <div className="number-walk-rules">
      {model.actors.map((actor, index) => <article className="number-walk-rule" data-actor={actor.id} data-selected={selected.id === actor.id || undefined} key={actor.id}>
        <button type="button" className="number-walk-friend-select" disabled={disabled} aria-pressed={selected.id === actor.id}
          aria-label={`选择${friends[actor.id].name}`} onClick={() => choose(actor)}>
          <span className="number-walk-portrait"><ActivityImage image={friends[actor.id].image} decorative /></span>
          <span><strong>{friends[actor.id].name}</strong><small><Flag size={13} />从 <b>{actor.start}</b> 出发</small></span>
          <span className="number-walk-selected-mark" aria-hidden="true">{selected.id === actor.id ? <Check size={16} /> : <Hand size={16} />}</span>
        </button>
        <StepModel actor={actor} />
        <button type="button" className="number-walk-listen" disabled={!clues[index]} aria-label={`听${friends[actor.id].name}的走法`}
          onClick={() => void speak(clues[index])}><Volume2 size={19} /></button>
      </article>)}
    </div>

    <div className="number-walk-turns">
      <span className="number-walk-turns-label">一起走 <b>{model.turns}</b> 次</span>
      <ol className="number-walk-turn-markers" aria-label={`两位朋友都走${model.turns}次`}>
        {Array.from({ length: model.turns }, (_, index) => <li key={index}><span aria-hidden="true"><Footprints className="number-walk-red-foot" size={19} /><Footprints className="number-walk-blue-foot" size={19} /></span><b>{index + 1}</b></li>)}
      </ol>
      <button type="button" className="number-walk-listen" disabled={!clues[2]} aria-label="听一起走几次" onClick={() => void speak(clues[2])}><Volume2 size={19} /></button>
    </div>

    <div className="number-walk-play-heading"><Hand size={18} /><span>{disabled ? '两位朋友停在这里' : '选一位朋友，点格子让它走'}</span><span className="number-walk-scroll-hint" aria-hidden="true">↔</span></div>
    <div className="number-walk-scroll" ref={scrollRef} aria-label={`从${model.min}到${model.max}的连续格子，可左右滑动`}>
      <div className="number-walk-track" style={{ '--walk-columns': numbers.length } as CSSProperties}>
        {numbers.map(number => <div className="number-walk-column" data-number-walk-position={number} key={number}>
          {model.actors.slice(0, 1).map(actor => {
            const value = readPosition(actor);
            return <div className="number-walk-lane" data-actor={actor.id} key={actor.id}>
              {actor.start === number && <span className="number-walk-start-flag" aria-label={`${friends[actor.id].name}从${number}出发`}><Flag size={13} /><span>起点</span></span>}
              {value.position === number && <button type="button" className="number-walk-piece" data-actor={actor.id} data-selected={selected.id === actor.id || undefined}
                data-filled={value.filled} data-testid={`number-walk-piece-${actor.id}`} disabled={disabled} draggable={!disabled}
                aria-label={`${friends[actor.id].name}，${value.filled ? '现在' : '出发'}在${number}，点选后点数字格`} aria-pressed={selected.id === actor.id}
                onClick={() => choose(actor)} onDragStart={event => drag(actor, event)}><ActivityImage image={friends[actor.id].image} decorative /><span className="number-walk-piece-base" /></button>}
            </div>;
          })}
          <button type="button" className="number-walk-number" disabled={disabled} data-testid={`number-walk-cell-${number}`}
            aria-label={`把${friends[selected.id].name}放到${number}`} onClick={() => place(selected, number)}
            onDragOver={event => { if (!disabled && Array.from(event.dataTransfer.types).includes(actorDragType)) { event.preventDefault(); event.dataTransfer.dropEffect = 'move'; } }}
            onDrop={event => drop(number, event)}>{number}</button>
          {model.actors.slice(1, 2).map(actor => {
            const value = readPosition(actor);
            return <div className="number-walk-lane" data-actor={actor.id} key={actor.id}>
              {actor.start === number && <span className="number-walk-start-flag" aria-label={`${friends[actor.id].name}从${number}出发`}><Flag size={13} /><span>起点</span></span>}
              {value.position === number && <button type="button" className="number-walk-piece" data-actor={actor.id} data-selected={selected.id === actor.id || undefined}
                data-filled={value.filled} data-testid={`number-walk-piece-${actor.id}`} disabled={disabled} draggable={!disabled}
                aria-label={`${friends[actor.id].name}，${value.filled ? '现在' : '出发'}在${number}，点选后点数字格`} aria-pressed={selected.id === actor.id}
                onClick={() => choose(actor)} onDragStart={event => drag(actor, event)}><ActivityImage image={friends[actor.id].image} decorative /><span className="number-walk-piece-base" /></button>}
            </div>;
          })}
        </div>)}
      </div>
    </div>

    <div className="number-walk-answers" aria-live="polite" aria-label="两位朋友最后的位置">
      {model.actors.map(actor => {
        const value = readPosition(actor);
        return <div className="number-walk-answer" data-actor={actor.id} data-testid={`number-walk-answer-${actor.id}`} key={actor.id}>
          <ActivityImage image={friends[actor.id].image} decorative /><span>{friends[actor.id].name}<small>停在</small></span>
          <strong data-filled={value.filled}>{value.filled ? value.position : '?'}</strong>
        </div>;
      })}
    </div>
  </section>;
}
