import { useEffect, useRef, useState } from 'react';
import { ACTIVITY_COPY } from '../domain/activity';
import { rectangleFromCorners, rectangleKey, rememberRectangle, type GridCorner, type MarkedRectangle } from './rectangle-state';

export function RectangleExplorer({ rows, columns, disabled }: { rows: number; columns: number; disabled: boolean }) {
  const [first, setFirst] = useState<GridCorner | null>(null);
  const [found, setFound] = useState<MarkedRectangle[]>([]);
  const [active, setActive] = useState<string | null>(null);
  const [message, setMessage] = useState('');
  const wasDisabled = useRef(disabled);
  const reset = () => { setFirst(null); setFound([]); setActive(null); setMessage(''); };
  useEffect(() => { if (wasDisabled.current && !disabled) reset(); wasDisabled.current = disabled; }, [disabled]);
  const width = columns * 66 + 36, height = rows * 66 + 36;
  const current = found.find(r => rectangleKey(r) === active);
  const select = (point: GridCorner) => {
    if (disabled) return;
    if (!first) { setFirst(point); setMessage(''); return; }
    const rectangle = rectangleFromCorners(first, point, rows, columns);
    setFirst(null);
    if (!rectangle) { setMessage(ACTIVITY_COPY.rectangleInvalid); return; }
    const next = rememberRectangle(found, rectangle);
    setFound(next); setActive(rectangleKey(rectangle));
    setMessage(next === found ? ACTIVITY_COPY.rectangleDuplicate : ACTIVITY_COPY.rectangleRecorded);
  };
  return <div className="rectangle-explorer">
    <p>{ACTIVITY_COPY.rectangleGuide}</p>
    <div className="rectangle-board" style={{ width, aspectRatio: `${width}/${height}` }} role="group" aria-label="标记长方形的网格">
      <svg viewBox={`0 0 ${width} ${height}`} aria-hidden="true">
        {Array.from({ length: rows + 1 }, (_, row) => <line key={`r${row}`} x1={18} y1={18 + row * 66} x2={width - 18} y2={18 + row * 66} />)}
        {Array.from({ length: columns + 1 }, (_, col) => <line key={`c${col}`} x1={18 + col * 66} y1={18} x2={18 + col * 66} y2={height - 18} />)}
        {current && <rect x={18 + current.left * 66} y={18 + current.top * 66} width={(current.right - current.left) * 66} height={(current.bottom - current.top) * 66} className="rectangle-mark" />}
      </svg>
      {Array.from({ length: (rows + 1) * (columns + 1) }, (_, i) => {
        const point = { row: Math.floor(i / (columns + 1)), column: i % (columns + 1) };
        return <button type="button" key={i} disabled={disabled} aria-label={`第${point.row + 1}行第${point.column + 1}列角点`} aria-pressed={first?.row === point.row && first?.column === point.column}
          style={{ left: `${(18 + point.column * 66) / width * 100}%`, top: `${(18 + point.row * 66) / height * 100}%` }} onClick={() => select(point)}><span /></button>;
      })}
    </div>
    <div className="rectangle-tools"><strong>已记 {found.length} 个</strong><button type="button" disabled={disabled || !found.length} onClick={() => { const next = found.slice(0, -1); setFound(next); setActive(next.length ? rectangleKey(next[next.length - 1]) : null); setFirst(null); setMessage(''); }}>撤销标记</button><button type="button" disabled={disabled || (!found.length && !first)} onClick={reset}>清空标记</button></div>
    <div className="rectangle-review" aria-label="回看已记的长方形">{found.map((r, i) => <button type="button" key={rectangleKey(r)} aria-label={`回看第${i + 1}个长方形`} aria-pressed={active === rectangleKey(r)} onClick={() => setActive(rectangleKey(r))}>{i + 1}</button>)}</div>
    <p className="rectangle-message" role="status">{message}</p>
  </div>;
}
