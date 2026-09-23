import { useEffect, useLayoutEffect, useRef, useState, type CSSProperties, type PointerEvent } from "react";
import { X } from "lucide-react";
import type { MatchingActivity } from "../domain/advanced-activity";
import { speak } from "../speech";
import { connectPair, disconnectPair, type MatchingResponse } from "./connection-state";
import { ActivityTokenArt } from "./ActivityTokenArt";

type Point = { x: number; y: number };
type Drag = { id: string; pointerId: number; start: Point; moved: boolean };
const colors = ["#3e789f", "#956cad", "#ae792f", "#3f8784"];
const curve = (a: Point, b: Point) => {
  const bend = Math.abs(b.x - a.x) * .45;
  return `M ${a.x} ${a.y} C ${a.x + bend} ${a.y}, ${b.x - bend} ${b.y}, ${b.x} ${b.y}`;
};

export function MatchingInteraction({ activity, response, disabled, onChange }: {
  activity: MatchingActivity; response: MatchingResponse; disabled: boolean; onChange: (response: MatchingResponse) => void;
}) {
  const board = useRef<HTMLDivElement>(null);
  const cards = useRef(new Map<string, HTMLButtonElement>());
  const pointer = useRef<Drag | null>(null);
  const suppressClick = useRef(false);
  const [selected, setSelected] = useState<string | null>(null);
  const [preview, setPreview] = useState<{ id: string; point: Point; target: string | null } | null>(null);
  const [layout, setLayout] = useState<{ width: number; height: number; points: Record<string, Point> }>({ width: 1, height: 1, points: {} });
  const token = (id: string) => activity.tokens.find(t => t.id === id)!;
  const isLeft = (id: string) => activity.leftIds.includes(id);
  const cancel = () => { if (pointer.current?.moved) suppressClick.current = true; pointer.current = null; setPreview(null); setSelected(null); };

  useEffect(() => { cancel(); }, [response, disabled, activity.id]);
  useEffect(() => {
    const onBlur = () => cancel();
    const onVisibility = () => { if (document.hidden) cancel(); };
    window.addEventListener("blur", onBlur);
    document.addEventListener("visibilitychange", onVisibility);
    return () => { window.removeEventListener("blur", onBlur); document.removeEventListener("visibilitychange", onVisibility); };
  }, []);
  useLayoutEffect(() => {
    const measure = () => {
      if (!board.current) return;
      const rect = board.current.getBoundingClientRect(), points: Record<string, Point> = {};
      cards.current.forEach((card, id) => {
        const r = card.getBoundingClientRect();
        points[id] = { x: (activity.leftIds.includes(id) ? r.right : r.left) - rect.left, y: r.top + r.height / 2 - rect.top };
      });
      setLayout({ width: rect.width, height: rect.height, points });
    };
    measure();
    const observer = new ResizeObserver(measure);
    if (board.current) observer.observe(board.current);
    cards.current.forEach(card => observer.observe(card));
    return () => observer.disconnect();
  }, [activity]);

  const connect = (first: string, second: string) => {
    const next = connectPair(activity, response, first, second);
    if (next !== response) onChange(next);
    cancel();
  };
  const clickCard = (id: string) => {
    if (disabled) return;
    if (selected && isLeft(selected) !== isLeft(id)) connect(selected, id);
    else setSelected(selected === id ? null : id);
    void speak(token(id).speechText ?? token(id).label);
  };
  const hitCard = (x: number, y: number) => {
    for (const [id, element] of cards.current) {
      const r = element.getBoundingClientRect();
      if (x >= r.left && x <= r.right && y >= r.top && y <= r.bottom) return id;
    }
    return null;
  };
  const move = (e: PointerEvent) => {
    const drag = pointer.current;
    if (!drag || drag.pointerId !== e.pointerId || !board.current) return;
    if (!drag.moved && Math.hypot(e.clientX - drag.start.x, e.clientY - drag.start.y) < 6) return;
    drag.moved = true;
    const r = board.current.getBoundingClientRect(), hit = hitCard(e.clientX, e.clientY);
    setSelected(drag.id);
    setPreview({ id: drag.id, point: { x: e.clientX - r.left, y: e.clientY - r.top }, target: hit && isLeft(hit) !== isLeft(drag.id) ? hit : null });
  };
  const finish = (e: PointerEvent) => {
    const drag = pointer.current;
    if (!drag || drag.pointerId !== e.pointerId) return;
    pointer.current = null;
    if (drag.moved) {
      suppressClick.current = true;
      const hit = hitCard(e.clientX, e.clientY);
      if (hit && isLeft(hit) !== isLeft(drag.id)) connect(drag.id, hit);
      else cancel();
    }
  };
  const pairFor = (id: string) => response.pairs.find(pair => pair.includes(id));
  const colorFor = (id: string) => colors[activity.leftIds.indexOf(pairFor(id)?.[0] ?? id) % colors.length] ?? colors[0];
  const pendingStart = preview && layout.points[preview.id];
  const pendingEnd = preview && (preview.target ? layout.points[preview.target] : preview.point);
  const selectedLabel = selected ? token(selected).label : "";

  return <section className="matching-workspace" aria-label="连线配对" onKeyDown={e => { if (e.key === "Escape") { e.preventDefault(); cancel(); } }}>
    <div className="connection-toolbar">
      <p role="status">{disabled ? '沿着连线，说说每一对的关系' : selected ? `再选${isLeft(selected) ? '右' : '左'}边一张，和“${selectedLabel}”连起来` : '拖到另一张图卡，或两边各点一下'}</p>
      <span className="connection-count">已连 {response.pairs.length} / {activity.leftIds.length} 对</span>
    </div>
    <div className={`matching-board${selected ? ' has-selection' : ''}`} ref={board} onPointerMove={move} onPointerUp={finish} onPointerCancel={cancel} onLostPointerCapture={() => { if (pointer.current) cancel(); }}>
      <svg className="matching-lines" viewBox={`0 0 ${layout.width} ${layout.height}`} aria-hidden="true">
        {response.pairs.map(([left, right]) => {
          const a = layout.points[left], b = layout.points[right];
          if (!a || !b) return null;
          return <g className="matching-link" key={`${left}-${right}`} data-left={left} data-right={right}>
            <path className="matching-line-halo" d={curve(a, b)} />
            <path d={curve(a, b)} stroke={colorFor(left)} />
          </g>;
        })}
        {pendingStart && pendingEnd && <path className="matching-preview" d={isLeft(preview!.id) ? curve(pendingStart, pendingEnd) : curve(pendingEnd, pendingStart)} />}
      </svg>
      {[activity.leftIds, activity.rightIds].map((ids, column) => <div className={`matching-column ${column === 0 ? 'is-left' : 'is-right'}`} key={column}>
        {ids.map(id => {
          const t = token(id), pair = pairFor(id), partner = pair?.find(other => other !== id);
          const active = selected === id, target = selected && isLeft(selected) !== isLeft(id);
          return <div className="matching-card-wrap" key={id} style={{ '--connection-color': colorFor(id) } as CSSProperties}>
            <button type="button" ref={element => { if (element) cards.current.set(id, element); else cards.current.delete(id); }}
              className={`matching-card${pair ? ' is-connected' : ''}${active ? ' is-selected' : ''}${target ? ' is-target' : ''}${preview?.target === id ? ' is-drop-target' : ''}${t.textOnly ? ' is-text' : ''}`}
              aria-label={`${t.label}${partner ? `，已连接${token(partner).label}` : '，未连接'}`}
              aria-pressed={active} disabled={disabled} data-matching-id={id}
              onPointerDown={e => {
                if (e.button !== 0 || !e.isPrimary || disabled) return;
                suppressClick.current = false;
                pointer.current = { id, pointerId: e.pointerId, start: { x: e.clientX, y: e.clientY }, moved: false };
                e.currentTarget.setPointerCapture(e.pointerId);
              }}
              onClick={e => { if (suppressClick.current && e.detail !== 0) { suppressClick.current = false; return; } clickCard(id); }}>
              <ActivityTokenArt token={t} label />
              <span className="matching-port" aria-hidden="true" />
            </button>
            {pair && !disabled && <button type="button" className="matching-unlink" aria-label={`断开${t.label}和${token(partner!).label}`} title="断开这条线" onClick={() => { cancel(); onChange(disconnectPair(response, id)); }}><X size={15} aria-hidden="true" /></button>}
          </div>;
        })}
      </div>)}
    </div>
    {!disabled && <p className="connection-footnote">想换一个朋友，直接重新连；点卡片上的 × 可以断开。</p>}
  </section>;
}
