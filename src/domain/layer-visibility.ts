export type LayerCircle = { id: string; x: number; y: number; radius: number };
type Point = { x: number; y: number };

/** Sample the cells of the circle arrangement, not a fixed-resolution screenshot grid. */
function arrangementWitnesses(circles: readonly LayerCircle[]): Point[] {
  const points: Point[] = circles.map(({ x, y }) => ({ x, y }));
  const tau = Math.PI * 2;
  for (const circle of circles) {
    const angles = [0, Math.PI / 2, Math.PI, Math.PI * 1.5];
    for (const other of circles) {
      if (other === circle) continue;
      const dx = other.x - circle.x, dy = other.y - circle.y, d = Math.hypot(dx, dy);
      if (d === 0 || d >= circle.radius + other.radius || d <= Math.abs(circle.radius - other.radius)) continue;
      const direction = Math.atan2(dy, dx);
      const alpha = Math.acos(Math.max(-1, Math.min(1, (circle.radius ** 2 + d ** 2 - other.radius ** 2) / (2 * circle.radius * d))));
      angles.push((direction - alpha + tau) % tau, (direction + alpha + tau) % tau);
    }
    const cuts = [...new Set(angles)].sort((a, b) => a - b);
    const epsilon = Math.min(...circles.map(c => c.radius)) * 1e-5;
    cuts.forEach((angle, index) => {
      const next = cuts[(index + 1) % cuts.length] + (index === cuts.length - 1 ? tau : 0);
      const middle = (angle + next) / 2;
      for (const r of [circle.radius - epsilon, circle.radius + epsilon])
        points.push({ x: circle.x + Math.cos(middle) * r, y: circle.y + Math.sin(middle) * r });
    });
  }
  return points;
}

/** Input order is bottom-to-top. Hidden intersections reveal no order between their lower layers. */
export function visibleLayerPairs(layers: readonly LayerCircle[]): [string, string][] {
  const inside = (p: Point, c: LayerCircle) => (p.x - c.x) ** 2 + (p.y - c.y) ** 2 < c.radius ** 2 - 1e-8;
  const witnesses = arrangementWitnesses(layers), pairs: [string, string][] = [];
  for (let lower = 0; lower < layers.length; lower++) {
    for (let upper = lower + 1; upper < layers.length; upper++) {
      const above = layers.slice(upper + 1);
      if (witnesses.some(p => inside(p, layers[lower]) && inside(p, layers[upper]) && !above.some(c => inside(p, c))))
        pairs.push([layers[lower].id, layers[upper].id]);
    }
  }
  return pairs;
}
