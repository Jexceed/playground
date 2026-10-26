import type { GraphicFigure } from '../types';
import { contourArtwork, fullContour, hasContourArtwork, openContour } from '../data/contourArtwork';
import './graphic-contour.css';

export function GraphicContourFigure({ figure, large = false }: { figure: GraphicFigure; large?: boolean }) {
  if (!hasContourArtwork(figure.shape)) return null;
  const artwork = contourArtwork[figure.shape];
  const missing = figure.mode === 'missing' ? openContour(figure.shape, figure.gap ?? artwork.gap!.side) : null;
  const transform = `translate(${(figure.x ?? 0) * 4 / 3} ${(figure.y ?? 0) * 4 / 3}) translate(80 80) rotate(${figure.rotate ?? 0}) scale(${figure.scale ?? 1}) translate(-80 -80)`;
  return <svg className={`graphic-figure graphic-contour-figure${large ? ' graphic-figure-large' : ''}`}
    viewBox="0 0 160 160" aria-hidden="true" data-contour-shape={figure.shape} data-contour-mode={missing ? 'missing' : 'complete'}>
    <g transform={transform} opacity={figure.opacity ?? 1}>
      <path className="graphic-contour-line" data-contour-outline d={missing?.d ?? fullContour(figure.shape)} />
      {!missing?.hideDetails && artwork.details?.map((detail, index) => <path key={index} className={`graphic-contour-detail${detail.solid ? ' is-solid' : ''}`} d={detail.d} />)}
      {missing && <g className="graphic-contour-endpoints">{missing.endpoints.map(([cx, cy], i) => <circle key={i} cx={cx} cy={cy} r="2.8" />)}</g>}
    </g>
  </svg>;
}
