import type { CSSProperties } from 'react';
import type { ComparisonPanel } from '../domain/activity';
import { ActivityImage } from './ActivityTokenArt';

/** Keep labels at reading size instead of shrinking them with a composite bitmap. */
export function VisualComparison({ panels }: { panels: ComparisonPanel[] }) {
  const rows = Math.max(1, ...panels.map(panel => panel.kind === 'dots' ? Math.ceil(panel.count / panel.columns) : 1));
  return <div className="visual-comparison" data-content={panels.every(panel => panel.kind === 'image') ? 'images' : 'counts'} style={{ '--comparison-rows': rows } as CSSProperties}>
    {panels.map(panel => <section className="comparison-panel" key={panel.label} aria-label={panel.label}>
      <h3>{panel.label}</h3>
      <div className="comparison-body">
        {panel.kind === 'dots' ? <div className="comparison-dots" role="img" aria-label={`${panel.label}的圆点图`}
          style={{ '--comparison-columns': panel.columns } as CSSProperties}>
          {Array.from({ length: panel.count }, (_, i) => <span className="comparison-dot" aria-hidden="true" key={i} />)}
        </div> : panel.kind === 'placeValue' ? <div className="comparison-place-value">
          <div className="place-value-blocks" role="img" aria-label="用长条和小方块表示数量">
            {panel.tens > 0 && <div className="comparison-tens">{Array.from({ length:panel.tens }, (_, i)=><span key={i} />)}</div>}
            {panel.ones > 0 && <div className="comparison-ones">{Array.from({ length:panel.ones }, (_, i)=><span key={i} />)}</div>}
          </div>
          <p className="comparison-legend"><span>一长条代表10</span><span>一小块代表1</span></p>
        </div> : <ActivityImage image={panel.image} className="comparison-image" />}
      </div>
    </section>)}
  </div>;
}
