import type { ReactNode } from 'react';
import { activitySlots, type GridActivity } from '../domain/activity';

export function PyramidBoard({ activity, renderSlot, renderBase }: {
  activity: GridActivity;
  renderSlot: (slot: ReturnType<typeof activitySlots>[number], column: number) => ReactNode;
  renderBase: (id: string) => ReactNode;
}) {
  const pyramid = activity.presentation!.pyramid!, slots = activitySlots(activity);
  const count = pyramid.baseTokenIds.length, levels = pyramid.rowSizes.length;
  const width = count * 60 + 40, height = (levels + 1) * 70 + 16;
  const center = (size: number, col: number) => 20 + (count - size) * 30 + (col + .5) * 60;
  const y = (level: number) => 14 + (levels - level - 1) * 70 + 30;
  const slotStyle = (x: number, yy: number) => ({ left: `${(x - 25) / width * 100}%`, top: `${(yy - 30) / height * 100}%`, width: `${50 / width * 100}%`, height: `${60 / height * 100}%` });
  let offset = 0;
  return <div className="pyramid-board" role="group" aria-label="图形金字塔，从底层向上填写" style={{ width, aspectRatio: `${width}/${height}` }}>
    <svg viewBox={`0 0 ${width} ${height}`} aria-hidden="true">{pyramid.rowSizes.flatMap((size, level) => Array.from({ length: size }, (_, col) => {
      const x = center(size, col), yy = y(level);
      return [-30, 30].map(delta => <line key={`${level}-${col}-${delta}`} x1={x} y1={yy + 30} x2={x + delta} y2={yy + 40} />);
    }))}</svg>
    {pyramid.rowSizes.map((size, level) => {
      const first = offset; offset += size;
      return <div key={level}>
        <span className="pyramid-row-label" style={{ top: `${(y(level) - 7) / height * 100}%` }}>{level + 1}层</span>
        {Array.from({ length: size }, (_, col) => <div className="pyramid-slot" key={col} style={slotStyle(center(size, col), y(level))}>{renderSlot(slots[first + col], col + 1)}</div>)}
      </div>;
    })}
    <span className="pyramid-row-label" style={{ top: `${(y(-1) - 7) / height * 100}%` }}>底层</span>
    {pyramid.baseTokenIds.map((id, col) => <div key={col} className="pyramid-slot pyramid-base-tile" style={slotStyle(center(count, col), y(-1))} aria-label={`已给的第${col + 1}张底图`}>{renderBase(id)}</div>)}
  </div>;
}
