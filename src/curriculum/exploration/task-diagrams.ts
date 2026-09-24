import { picture, rect, line, circle, text, palette, type Primitive } from './draw';

export function partitionDiagram(left: number, right: number) {
  const objects: Primitive[] = [];
  [left, right].forEach((count, side) => {
    const x = 8 + side * 174;
    objects.push(rect(x, 33, 160, 91, '#fafbf5'), text(x + 80, 25, side ? '右盒' : '左盒', 24));
    if (!count) objects.push(text(x + 80, 88, '0', 26));
    for (let i = 0; i < count; i++) objects.push(circle(x + 80 - (Math.min(4, count) - 1) * 14 + i % 4 * 28, count <= 4 ? 80 : 64 + Math.floor(i / 4) * 28, 9, palette[1]));
  });
  return picture(objects, 350, 134);
}

/** An unfolded 4×4 sheet. Every option uses the same round-hole symbol as the stem. */
export function holePattern(bits: number[]) {
  const objects: Primitive[] = [];
  for (let row = 0; row < 4; row++) for (let col = 0; col < 4; col++) {
    objects.push(rect(20 + col * 60, 20 + row * 60, 60, 60, '#fffdf7'));
    if (bits[row * 4 + col]) objects.push(circle(50 + col * 60, 50 + row * 60, 10, palette[0]));
  }
  return picture(objects, 280, 280);
}

/** All panels keep the original grid coordinates; removed halves are genuinely absent. */
export function foldedPaperScene(folds: 1 | 2, holeRow: number, holeColumn: number) {
  const objects: Primitive[] = [], panels = folds + 1;
  for (let panel = 0; panel < panels; panel++) {
    const x = panel * 300 + 30, y = 50, size = 50;
    const firstCol = panel > 0 ? 2 : 0, firstRow = panel > 1 ? 2 : 0;
    const title = panel === folds ? `折好后（${2 ** folds}层）` : panel === 0 ? '左半向右折' : '上半向下折';
    objects.push(text(panel * 300 + 150, 26, title, 24));
    for (let row = firstRow; row < 4; row++) for (let col = firstCol; col < 4; col++)
      objects.push(rect(x + col * size, y + row * size, size, size, panel ? '#e5eedb' : '#fffdf7'));
    if (panel === folds) {
      objects.push(circle(x + (holeColumn + .5) * size, y + (holeRow + .5) * size, 9, palette[0]));
    } else if (panel === 0) {
      objects.push({ ...line(x + 100, y - 5, x + 100, y + 205, true), color: palette[1] });
      objects.push({ ...line(x + 35, y + 95, x + 157, y + 95), color: palette[1] });
      objects.push({ kind: 'polygon', points: [[x + 170, y + 95], [x + 150, y + 83], [x + 150, y + 107]], fill: palette[1] });
    } else {
      objects.push({ ...line(x + 95, y + 100, x + 205, y + 100, true), color: palette[1] });
      objects.push({ ...line(x + 150, y + 35, x + 150, y + 157), color: palette[1] });
      objects.push({ kind: 'polygon', points: [[x + 150, y + 170], [x + 138, y + 150], [x + 162, y + 150]], fill: palette[1] });
    }
    if (panel < folds) objects.push(text((panel + 1) * 300, 160, '→', 30));
  }
  objects.push(text(panels * 150, 287, '红色小圆点表示孔的位置', 22));
  return picture(objects, panels * 300, 305);
}
