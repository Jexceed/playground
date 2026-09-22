import { registerExplorationImage, type Drawing, type Primitive } from "../../data/explorationImages";
export type { Drawing, Primitive };
export const palette = ["#db675e", "#548cb3", "#e8b64e", "#76a784", "#a189bd", "#333f50"];
export const text = (x: number, y: number, value: string | number, size = 28): Primitive => ({ kind: 'text', x, y, text: String(value), size });
export const line = (x: number, y: number, x2: number, y2: number, dash = false): Primitive => ({ kind: 'line', x, y, x2, y2, dash });
export const rect = (x: number, y: number, w: number, h: number, fill = "#fffdf7", dash = false): Primitive => ({ kind: 'rect', x, y, w, h, fill, dash });
export const circle = (x: number, y: number, r = 16, fill = palette[1]): Primitive => ({ kind: 'circle', x, y, r, fill });
export const picture = (objects: Primitive[], width = 600, height = 280): Drawing => ({ width, height, objects });
export const image = (d: Drawing, alt: string) => registerExplorationImage(d, alt);
export function label(value: string | number): Drawing { const chars = Array.from(String(value)), lines = []; for (let i = 0; i < chars.length; i += 6)
    lines.push(chars.slice(i, i + 6).join('')); return picture(lines.map((s, i) => text(160, 165 + (i - (lines.length - 1) / 2) * 48, s, chars.length > 4 ? 40 : 64)), 320, 320); }
export function dots(n: number, columns = 5, color = palette[1], spread = 1): Drawing {
    const rows = Math.ceil(n / columns), step = Math.min(48, 250 / Math.max(columns, rows)) * spread;
    return picture(Array.from({ length: n }, (_, i) => circle(160 - (Math.min(columns, n) - 1) * step / 2 + (i % columns) * step, 160 - (rows - 1) * step / 2 + Math.floor(i / columns) * step, Math.min(15, step * .28), color)), 320, 320);
}
export function symbol(shape: number, color = 0, rotation = 0): Drawing {
    const objects: Primitive[] = shape % 3 === 0 ? [circle(160, 160, 72, palette[color % palette.length])] : shape % 3 === 1 ? [rect(88, 88, 144, 144, palette[color % palette.length])] : [{ kind: 'polygon', points: [[160, 72], [242, 226], [78, 226]], fill: palette[color % palette.length] }];
    if (rotation)
        objects.push(line(160, 160, 160 + 55 * Math.sin(rotation * Math.PI / 180), 160 - 55 * Math.cos(rotation * Math.PI / 180)));
    return picture(objects, 320, 320);
}
export function grid(values: (string | number | null)[], columns: number, marked: number[] = [], colors: string[] = []): Drawing {
    const rows = Math.ceil(values.length / columns), step = Math.min(85, 500 / columns, 250 / rows), w = step * columns + 40, h = step * rows + 40;
    const o: Primitive[] = [];
    values.forEach((v, i) => { const x = 20 + (i % columns) * step, y = 20 + Math.floor(i / columns) * step; o.push(rect(x, y, step, step, colors[i] ?? (marked.includes(i) ? '#c4dacb' : '#fffdf7'))); if (v !== null && v !== '')
        o.push(text(x + step / 2, y + step / 2 + 10, String(v), Math.min(30, step * .43))); });
    return picture(o, w, h);
}
export function mosaic(bits: number[], columns = 3, color = palette[1]): Drawing { return grid(bits.map(() => ''), columns, [], bits.map(x => x ? color : '#fffdf7')); }
export function panels(items: {
    title: string;
    drawing: Drawing;
}[]): Drawing {
    const width = 600, height = 310, w = width / items.length, o: Primitive[] = [];
    items.forEach((p, i) => { o.push(text(i * w + w / 2, 30, p.title, 22)); const scale = Math.min((w - 20) / p.drawing.width, 245 / p.drawing.height); o.push(...transform(p.drawing.objects, scale, scale, i * w + (w - p.drawing.width * scale) / 2, 55)); });
    return picture(o, width, height);
}
export function transform(objects: Primitive[], sx = 1, sy = sx, dx = 0, dy = 0): Primitive[] {
    return objects.map(o => {
        if (o.kind === 'polygon')
            return { ...o, points: o.points.map(([x, y]) => [x * sx + dx, y * sy + dy] as [
                    number,
                    number
                ]) };
        if (o.kind === 'line')
            return { ...o, x: o.x * sx + dx, y: o.y * sy + dy, x2: o.x2 * sx + dx, y2: o.y2 * sy + dy };
        if (o.kind === 'rect')
            return { ...o, x: o.x * sx + dx, y: o.y * sy + dy, w: o.w * sx, h: o.h * sy };
        if (o.kind === 'circle')
            return { ...o, x: o.x * sx + dx, y: o.y * sy + dy, r: o.r * Math.min(Math.abs(sx), Math.abs(sy)) };
        return { ...o, x: o.x * sx + dx, y: o.y * sy + dy, size: (o.size ?? 28) * Math.min(Math.abs(sx), Math.abs(sy)) };
    });
}
export function clock(hour: number, minute: number): Drawing {
    const o: Primitive[] = [circle(160, 160, 124, '#fffdf7')];
    for (let tick = 0; tick < 60; tick++) {
        const angle = tick * Math.PI / 30, inner = tick % 5 === 0 ? 110 : 116;
        o.push(line(160 + Math.sin(angle) * inner, 160 - Math.cos(angle) * inner, 160 + Math.sin(angle) * 123, 160 - Math.cos(angle) * 123));
    }
    for (let n = 1; n <= 12; n++)
        o.push(text(160 + Math.sin(n * Math.PI / 6) * 96, 168 - Math.cos(n * Math.PI / 6) * 96, n, 22));
    o.push(line(160, 160, 160 + Math.sin((hour % 12 + minute / 60) * Math.PI / 6) * 65, 160 - Math.cos((hour % 12 + minute / 60) * Math.PI / 6) * 65));
    o.push(line(160, 160, 160 + Math.sin(minute * Math.PI / 30) * 92, 160 - Math.cos(minute * Math.PI / 30) * 92));
    return picture(o, 320, 320);
}
export function blocks(heights: number[], columns: number): Drawing {
    const o: Primitive[] = [];
    const rows = Math.ceil(heights.length / columns), s = 28;
    for (let y = 0; y < rows; y++)
        for (let x = 0; x < columns; x++)
            for (let z = 0; z < heights[y * columns + x]; z++) {
                const px = 160 + (x - y) * s, py = 235 + (x + y) * s / 2 - z * s;
                o.push({ kind: 'polygon', points: [[px, py - s], [px + s, py - s / 2], [px, py], [px - s, py - s / 2]], fill: '#c7dfec' }, { kind: 'polygon', points: [[px - s, py - s / 2], [px, py], [px, py + s], [px - s, py + s / 2]], fill: '#75a1be' }, { kind: 'polygon', points: [[px, py], [px + s, py - s / 2], [px + s, py + s / 2], [px, py + s]], fill: '#4e7d9d' });
            }
    const points = o.flatMap(shape => shape.kind === 'polygon' ? shape.points : []);
    if (!points.length) return picture([], 160, 160);
    const xs = points.map(p => p[0]), ys = points.map(p => p[1]);
    const minX = Math.min(...xs), minY = Math.min(...ys);
    return picture(transform(o, 1, 1, 12 - minX, 12 - minY), Math.max(...xs) - minX + 24, Math.max(...ys) - minY + 24);
}
