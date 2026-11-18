import type { CSSProperties } from 'react';
import type { ComparisonPanel } from '../domain/activity';
import { ActivityImage } from './ActivityTokenArt';
import { imageGallery, type GalleryImage } from '../data/imageGallery';
import { PlaceValueBlocks } from './PlaceValueBlocks';

function FriendPortrait({ image }: { image: GalleryImage }) {
  return <figure><ActivityImage image={image} decorative /><figcaption>{image.alt}</figcaption></figure>;
}

/** Keep labels at reading size instead of shrinking them with a composite bitmap. */
export function VisualComparison({ panels }: { panels: ComparisonPanel[] }) {
  const rows = Math.max(1, ...panels.map(panel => panel.kind === 'dots' ? Math.ceil(panel.count / panel.columns) : 1));
  return <div className="visual-comparison" data-content={panels[0]?.kind === 'heightPair' ? 'heights' : panels.every(panel => panel.kind === 'image') ? 'images' : 'counts'} style={{ '--comparison-rows': rows } as CSSProperties}>
    {panels.map(panel => <section className="comparison-panel" key={panel.label} aria-label={panel.label}>
      <h3>{panel.label}</h3>
      <div className="comparison-body">
        {panel.kind === 'dots' ? <div className="comparison-dots" role="img" aria-label={`${panel.label}的圆点图`}
          style={{ '--comparison-columns': panel.columns } as CSSProperties}>
          {Array.from({ length: panel.count }, (_, i) => <ActivityImage key={i} image={imageGallery.items.patternBlueDisc} className="comparison-dot" decorative />)}
        </div> : panel.kind === 'placeValue' ? <PlaceValueBlocks tens={panel.tens} ones={panel.ones} /> : panel.kind === 'heightPair'
          ? <div className="height-relation"><FriendPortrait image={panel.taller} /><span>比</span><FriendPortrait image={panel.shorter} /><span>高</span></div>
          : <ActivityImage image={panel.image} className="comparison-image" />}
      </div>
    </section>)}
  </div>;
}
