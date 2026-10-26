import type { GraphicFigure, GraphicShapeId } from '../types';

export type ContourShape = Exclude<GraphicShapeId, 'cat' | 'dog' | 'rabbit' | 'bear'>;
export type ContourPoint = readonly [number, number];
export type ContourSegment = { to: ContourPoint; draw: string };
export type ContourPath = { start: ContourPoint; segments: ContourSegment[] };
export type ContourArtwork = {
  outline: ContourPath;
  details?: { d: string; solid?: boolean }[];
  gap?: { side: NonNullable<GraphicFigure['gap']>; omit: number[]; hideDetails?: boolean };
};
const round = (n: number) => Number(n.toFixed(3));
const point = (x: number, y: number): ContourPoint => [round(x), round(y)];
const xy = (p: ContourPoint) => `${p[0]} ${p[1]}`;
const line = (to: ContourPoint): ContourSegment => ({ to, draw: `L ${xy(to)}` });
const cubic = (a: ContourPoint, b: ContourPoint, to: ContourPoint): ContourSegment => ({ to, draw: `C ${xy(a)} ${xy(b)} ${xy(to)}` });
const polygon = (points: ContourPoint[]): ContourPath => ({ start: points[0], segments: points.map((_, i) => line(points[(i + 1) % points.length])) });
const polar = (r: number, angle: number) => point(80 + r * Math.cos(angle), 80 + r * Math.sin(angle));

function circle(): ContourPath {
  const r = 52, step = Math.PI / 4, start = -Math.PI / 2, k = 4 / 3 * Math.tan(step / 4);
  return { start: polar(r, start), segments: Array.from({ length: 8 }, (_, i) => {
    const a = start + step * i, b = a + step;
    return cubic(point(80 + r * (Math.cos(a) - k * Math.sin(a)), 80 + r * (Math.sin(a) + k * Math.cos(a))),
      point(80 + r * (Math.cos(b) + k * Math.sin(b)), 80 + r * (Math.sin(b) - k * Math.cos(b))), polar(r, b));
  }) };
}

function flower(): ContourPath {
  // Outer intersections of five overlapping petals form one clean perimeter.
  const radius = 26, centres = 34, half = Math.PI / 5;
  const valleyRadius = centres * Math.cos(half) + Math.sqrt(radius ** 2 - (centres * Math.sin(half)) ** 2);
  const valleys = Array.from({ length: 5 }, (_, i) => polar(valleyRadius, -Math.PI / 2 - half + i * Math.PI * 2 / 5));
  return { start: valleys[0], segments: valleys.map((_, i) => {
    const to = valleys[(i + 1) % valleys.length];
    return { to, draw: `A ${radius} ${radius} 0 0 1 ${xy(to)}` };
  }) };
}

export const contourArtwork: Record<ContourShape, ContourArtwork> = {
  circle: { outline: circle(), gap: { side: 'right', omit: [1, 2] } },
  'rounded-square': { outline: { start: [46, 28], segments: [line([114, 28]), cubic([124, 28], [132, 36], [132, 46]),
    line([132, 114]), cubic([132, 124], [124, 132], [114, 132]), line([46, 132]), cubic([36, 132], [28, 124], [28, 114]),
    line([28, 46]), cubic([28, 36], [36, 28], [46, 28])] }, gap: { side: 'top', omit: [0, 1] } },
  triangle: { outline: polygon([[80, 24], [138, 132], [22, 132]]), gap: { side: 'bottom', omit: [1] } },
  diamond: { outline: polygon([[80, 20], [140, 80], [80, 140], [44, 104], [20, 80], [44, 56]]), gap: { side: 'left', omit: [3, 4] } },
  star: { outline: polygon([[80, 19], [96, 57], [138, 61], [109, 89], [116, 131], [80, 106], [44, 131], [51, 89], [22, 61], [64, 57]]),
    gap: { side: 'right', omit: [1, 2, 3] } },
  flower: { outline: flower(), details: [{ d: 'M 95 80 A 15 15 0 1 1 65 80 A 15 15 0 1 1 95 80 Z' }], gap: { side: 'top', omit: [0] } },
  apple: { outline: { start: [80, 48], segments: [cubic([64, 34], [42, 35], [32, 54]), cubic([20, 70], [23, 98], [41, 119]),
    cubic([52, 132], [65, 132], [80, 126]), cubic([95, 134], [109, 131], [120, 117]), cubic([137, 98], [141, 70], [128, 53]),
    cubic([117, 36], [98, 34], [80, 48])] },
    details: [{ d: 'M 80 46 C 80 36 84 28 89 23' }, { d: 'M 83 34 C 91 17 111 12 125 18 C 115 34 99 42 83 36 Z' }],
    gap: { side: 'top', omit: [5, 0], hideDetails: true } },
  pear: { outline: { start: [80, 27], segments: [cubic([65, 27], [66, 47], [62, 59]), cubic([59, 67], [45, 75], [40, 91]),
    cubic([31, 120], [48, 139], [80, 140]), cubic([112, 139], [129, 120], [120, 91]), cubic([115, 75], [101, 67], [98, 59]),
    cubic([94, 47], [95, 27], [80, 27])] },
    details: [{ d: 'M 81 30 C 81 23 84 18 88 16' }, { d: 'M 84 27 C 91 15 106 13 118 18 C 108 30 95 34 84 30 Z' }] },
  leaf: { outline: { start: [27, 122], segments: [cubic([25, 68], [67, 27], [132, 25]), cubic([135, 85], [94, 129], [27, 122])] },
    details: [{ d: 'M 32 118 Q 78 77 125 32' }, { d: 'M 56 96 Q 49 75 54 61 M 76 77 Q 97 82 111 75' }] },
  fish: { outline: { start: [26, 80], segments: [cubic([45, 53], [80, 47], [106, 64]), cubic([109, 67], [111, 71], [114, 73]),
    line([140, 48]), line([140, 112]), line([114, 87]), cubic([111, 89], [109, 93], [106, 96]), cubic([80, 113], [45, 107], [26, 80])] },
    details: [{ d: 'M 50 75 A 3.2 3.2 0 1 1 43.6 75 A 3.2 3.2 0 1 1 50 75 Z', solid: true }, { d: 'M 59 65 Q 49 80 59 95' }],
    gap: { side: 'right', omit: [1, 2, 3, 4, 5] } },
};

export function hasContourArtwork(shape: GraphicShapeId): shape is ContourShape {
  return shape in contourArtwork;
}

export function fullContour(shape: ContourShape): string {
  const { outline } = contourArtwork[shape];
  return `M ${xy(outline.start)} ${outline.segments.map(segment => segment.draw).join(' ')} Z`;
}

/** Remove one continuous cyclic interval; all remaining geometry is shared verbatim. */
export function openContour(shape: ContourShape, side: NonNullable<GraphicFigure['gap']>) {
  const { outline, gap } = contourArtwork[shape];
  if (!gap || gap.side !== side) throw new Error(`No authored ${side} gap for ${shape}`);
  const omitted = new Set(gap.omit), total = outline.segments.length;
  const first = outline.segments.findIndex((_, index) => !omitted.has(index) && omitted.has((index + total - 1) % total));
  if (first < 0) throw new Error(`Invalid gap for ${shape}`);
  const start = first === 0 ? outline.start : outline.segments[first - 1].to;
  const indices: number[] = [];
  for (let i = first; !omitted.has(i); i = (i + 1) % total) {
    indices.push(i);
    if (indices.length >= total) throw new Error(`Unclosed gap interval for ${shape}`);
  }
  if (indices.length + omitted.size !== total) throw new Error(`Multiple gaps for ${shape}`);
  return { d: `M ${xy(start)} ${indices.map(index => outline.segments[index].draw).join(' ')}`,
    endpoints: [start, outline.segments[indices[indices.length - 1]].to] as const, indices, hideDetails: gap.hideDetails ?? false };
}
