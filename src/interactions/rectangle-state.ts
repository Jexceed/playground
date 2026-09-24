export type GridCorner = { row: number; column: number };
export type MarkedRectangle = { top: number; left: number; bottom: number; right: number };
export function rectangleFromCorners(a: GridCorner, b: GridCorner, rows: number, columns: number): MarkedRectangle | null {
  if (![a, b].every(p => Number.isInteger(p.row) && Number.isInteger(p.column) && p.row >= 0 && p.row <= rows && p.column >= 0 && p.column <= columns)) return null;
  if (a.row === b.row || a.column === b.column) return null;
  return { top: Math.min(a.row, b.row), bottom: Math.max(a.row, b.row), left: Math.min(a.column, b.column), right: Math.max(a.column, b.column) };
}
export const rectangleKey = (r: MarkedRectangle) => `${r.top}:${r.left}:${r.bottom}:${r.right}`;
export function rememberRectangle(rectangles: MarkedRectangle[], rectangle: MarkedRectangle): MarkedRectangle[] {
  return rectangles.some(r => rectangleKey(r) === rectangleKey(rectangle)) ? rectangles : [...rectangles, rectangle];
}
