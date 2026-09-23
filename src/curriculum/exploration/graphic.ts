import { visibleLayerPairs } from "../../domain/layer-visibility";
import { set, nine, choice, numeric, selection, ordered, fillGrid, parent, base, card, authoringSolutions } from './helpers';
import { picture, text, rect, circle, line, grid, mosaic, symbol, panels, blocks, palette, transform, type Drawing, type Primitive } from './draw';
import type { Activity } from '../../domain/activity';
import type { ConstructionActivity, Point3, Piece } from '../../domain/advanced-activity';

/** Empty upper cells show the combination route without exposing any intermediate answer. */
export function pyramidDiagram(base: number[][]): Drawing {
    const count = base.length, side = 76, stepX = 110, stepY = 95;
    const width = count * stepX + 30, height = count * stepY + 20, objects: Primitive[] = [];
    for (let row = 0; row < count; row++) {
        const cells = count - row, y = height - 100 - row * stepY;
        for (let col = 0; col < cells; col++) {
            const x = (width - cells * stepX) / 2 + col * stepX + 17;
            if (row > 0) {
                objects.push(line(x - stepX / 2 + side / 2, y + stepY, x + side / 2, y + side), line(x + stepX / 2 + side / 2, y + stepY, x + side / 2, y + side));
                objects.push(rect(x, y, side, side, '#f0f3e9', true), text(x + side / 2, y + 49, '?', 30));
            } else {
                const source = mosaic(base[col]);
                objects.push(...transform(source.objects, side / source.width, side / source.height, x, y));
            }
        }
    }
    return picture(objects, width, height);
}

const patterns = [[1, 0, 0, 1, 1, 0, 0, 1, 0], [0, 1, 0, 1, 1, 1, 1, 0, 0], [1, 1, 0, 0, 1, 0, 0, 1, 1]];
const turn = (a: number[], n = 3) => a.map((_, k) => a[(n - 1 - k % n) * n + Math.floor(k / n)]);
const mirror = (a: number[], n = 3) => a.map((_, k) => a[Math.floor(k / n) * n + n - 1 - k % n]);
const flip = (a: number[], k: number) => a.map((n, i) => i === k ? 1 - n : n);
function fig(id: Parameters<typeof choice>[0], i: number, prompt: string, answer: Drawing, wrong: Drawing[], reason: string, stem?: Drawing, clues: string[] = []): Activity {
    const options = [answer];
    for (const d of wrong)
        if (!options.some(a => JSON.stringify(a) === JSON.stringify(d)))
            options.push(d);
    if (options.length < 3)
        throw Error(`${id}/${i} needs distinct figures`);
    return choice(id, i, prompt, options.slice(0, 4).map((drawing, k) => ({ label: `图${String.fromCharCode(65 + k)}`, drawing })), 0, reason, stem, clues);
}
export function cubeNormals(coords: [
    number,
    number
][]) {
    type V = [
        number,
        number,
        number
    ];
    const negate = (v: V) => v.map(n => -n) as V;
    const frames = new Map<number, {
        r: V;
        d: V;
        n: V;
    }>([[0, { r: [1, 0, 0], d: [0, 1, 0], n: [0, 0, 1] }]]), queue = [0];
    while (queue.length) {
        const i = queue.shift()!, p = coords[i], f = frames.get(i)!;
        for (const [dx, dy] of [[1, 0], [-1, 0], [0, 1], [0, -1]]) {
            const j = coords.findIndex(([x, y]) => x === p[0] + dx && y === p[1] + dy);
            if (j < 0 || frames.has(j))
                continue;
            frames.set(j, dx === 1 ? { r: negate(f.n), d: f.d, n: f.r } : dx === -1 ? { r: f.n, d: f.d, n: negate(f.r) } : dy === 1 ? { r: f.r, d: negate(f.n), n: f.d } : { r: f.r, d: f.n, n: negate(f.d) });
            queue.push(j);
        }
    }
    return coords.map((_, i) => frames.get(i)?.n ?? [0, 0, 0]);
}
export const graphicSets = [
    set('G01', '图案观察员', nine((i, s, v) => { const bits = patterns[v], target = s === 0 ? bits : s === 1 ? turn(bits) : mirror(bits); return fig('G01', i, s === 0 ? '找出和上面完全相同的图案。' : s === 1 ? '仔细看每个格子，找出完全相同的图案。' : '不漏掉小角落，哪张图案和上面完全一样？', mosaic(target), [mosaic(flip(target, v)), mosaic(flip(target, 8 - v)), mosaic(flip(target, 4))], '逐行对应，色块的位置、数量都一样。', mosaic(target)); })),
    set('G02', '遮住了什么', nine((i, s, v) => { if (s === 0) {
        const d = symbol(v, 1);
        const stem = picture([...d.objects, rect(90, 120, 140, 80, '#b6bcc5')], 320, 320);
        return fig('G02', i, '灰色纸片下面可能是哪个完整图形？', d, [symbol((v + 1) % 3, 1), symbol((v + 2) % 3, 1)], '用露在外面的轮廓判断，颜色相同还不够。', stem);
    } const n = 4, bits = Array.from({ length: 16 }, (_, k) => s === 1 ? (v === 2 ? Math.floor(k / n) % 2 : (Math.floor(k / n) + k % n + v) % 2) : ((Math.floor(k / n) + v) % 3 === 0 ? 1 : 0)); const patch = [bits[5], bits[6], bits[9], bits[10]]; const stem = grid(bits.map((b, k) => [5, 6, 9, 10].includes(k) ? '?' : ''), 4, [], bits.map((b, k) => [5, 6, 9, 10].includes(k) ? '#d8d8d8' : b ? palette[1] : '#fffdf7')); return fig('G02', i, '选哪一块补片，能把行列里的纹理接上？', mosaic(patch, 2), [mosaic(flip(patch, 0), 2), mosaic(flip(patch, 3), 2), mosaic(patch.map(x => 1 - x), 2)], '补片的四条边都要和周围纹理对上。', stem, [s === 1 ? (v === 2 ? '每行同色，蓝白行交替。' : '蓝白格沿每行、每列交替。') : '相同的一整行保持同色，按三行一组重复。']); })),
    set('G03', '行列规律研究', nine((i, s, v) => { const ids = Array.from({ length: 9 }, (_, k) => `s${k}`), ts = ids.map((id, k) => card(id, `${['红', '蓝', '黄'][Math.floor(k / 3)]}${['圆', '方', '三角'][k % 3]}`, symbol(k % 3, Math.floor(k / 3)))); const sol = Array.from({ length: 9 }, (_, k) => ids[(s === 0 ? v : Math.floor(k / 3)) * 3 + (k % 3 + v) % 3]); return fillGrid('G03', i, '把每行每列的规律补完整。', ts, 3, sol, s === 0 ? [2, 5] : s === 1 ? [1, 5, 6] : [0, 2, 4, 6, 8], '同一行的颜色保持不变，同一列的形状也保持不变。', ['每一行颜色相同。', `从左到右依次是${[0, 1, 2].map(n => ['圆', '方', '三角'][(n + v) % 3]).join('、')}。`, ...(s > 0 ? ['从上到下依次是红、蓝、黄。'] : [])]); })),
    set('G04', '标记走格子', nine((i, s, v) => { const n = 5, start = 1 + v, steps = 2 + v; let end: number; if (s === 0)
        end = (start + steps) % n;
    else {
        const t = (start + steps) % (2 * (n - 1));
        end = t < n ? t : 2 * (n - 1) - t;
    } const draw = (p: number, q?: number) => { const d = grid(Array(n).fill(''), n); d.objects.push(circle(62.5 + p * 85 - (p === q ? 12 : 0), 62.5, 14, palette[0])); if (q !== undefined) d.objects.push(circle(62.5 + q * 85 + (p === q ? 12 : 0), 62.5, 14, palette[1])); return d; }; const second = s === 2 ? (4 - v - steps % n + n) % n : undefined; return fig('G04', i, '标记按规则移动，最后在哪个位置？', draw(end, second), [draw((end + 1) % n, second), draw((end + n - 1) % n, second), draw(start, second)], s === 0 ? '走到最右边以后，从最左边继续数。' : '红标记碰到边就反向，每一步都从上一步的位置继续。', draw(start, s === 2 ? 4 - v : undefined), [s === 0 ? '红标记每次向右一格，走到边上就回最左。' : '红标记先向右一格一格走，碰到边就反向。', `走${steps}步。`, ...(s === 2 ? ['蓝标记同时向左走，出左边就回最右。'] : [])]); })),
    set('G05', '转一转照一照', nine((i, s, v) => { const bits = patterns[v]; if (s === 1 && v > 0) {
        const small = (sx: number, sy: number) => picture(transform(mosaic(bits).objects, sx, sy, (320 - mosaic(bits).width * sx) / 2, (320 - mosaic(bits).height * sy) / 2), 320, 320);
        return fig('G05', i, v === 1 ? '把图案等比例放大，哪张只变大而没有拉扁？' : '只把图案横向拉长，上下高度保持不变。', small(.85, v === 1 ? .85 : .55), [small(.55, .85), small(.85, v === 1 ? .55 : .85), small(.55, .55)], v === 1 ? '横和竖用同样的比例放大，形状不会被拉扁。' : '只改变横向距离，上下位置和高度不变。', small(.55, .55));
    } const answer = s === 0 ? turn(bits) : s === 1 ? mirror(bits) : mirror(turn(bits)); return fig('G05', i, s === 0 ? '把图案顺时针转四分之一圈，得到哪张？' : s === 1 ? '把图案照在左右镜子里，得到哪张？' : '先顺时针转四分之一圈，再左右翻过来。', mosaic(answer), [mosaic(flip(answer, 0)), mosaic(flip(answer, 8)), mosaic(bits)], '每个色格一起变换，相邻关系和色格数量保持不变。', mosaic(bits), [s === 1 ? '这里左右翻转，上下不变。' : s === 2 ? '两次变换要按给定顺序做。' : '顺时针就是钟表指针走的方向。']); })),
    set('G06', '图形合并机', nine((i, s, v) => { const a = patterns[v], b = patterns[(v + 1) % 3], op = s === 0 ? '并起来' : s === 1 ? ['共同', '不同', '共同'][v] : ['左减右', '右减左', '左减右'][v]; const out = a.map((x, k) => op === '并起来' ? Number(!!(x || b[k])) : op === '共同' ? x & b[k] : op === '不同' ? x ^ b[k] : op === '右减左' ? b[k] * (1 - x) : x * (1 - b[k])); return fig('G06', i, `按“${op}”的规则，结果是哪张？`, mosaic(out), [mosaic(flip(out, 0)), mosaic(flip(out, 5)), mosaic(flip(out, 8))], '逐格比较，再把符合规则的格子留下。', panels([{ title: '左图', drawing: mosaic(a) }, { title: '右图', drawing: mosaic(b) }]), [op === '并起来' ? '任意一张有色的格子都留下。' : op === '共同' ? '两张都有色的格子才留下。' : op === '不同' ? '只有一张有色的格子才留下。' : op === '右减左' ? '右图有、左图没有的格子留下。' : '左图有、右图没有的格子留下。']); })),
    set('G07', '图形金字塔', nine((i, s, v) => { const a = patterns[v], b = patterns[(v + 1) % 3], c = patterns[(v + 2) % 3]; const operation = (x: number[], y: number[]) => x.map((n, k) => s === 0 ? Number(!!(n || y[k])) : n ^ y[k]); const d = flip(a, v + 3), ab = operation(a, b), bc = operation(b, c), cd = operation(c, d), answer = s === 0 ? ab : s === 1 ? operation(ab, bc) : operation(operation(ab, bc), operation(bc, cd)); return fig('G07', i, s === 0 ? '两块合成上面一块，结果是哪张？' : '每一层把相邻两块合成一块，一直合到顶层。', mosaic(answer), [mosaic(flip(answer, 0)), mosaic(flip(answer, 4)), mosaic(flip(answer, 8))], s === 0 ? '任一块有色就留下。' : '从底层开始，每层都用同一条规则合并相邻图案，最后检查顶层。', pyramidDiagram([a, b, ...(s > 0 ? [c] : []), ...(s === 2 ? [d] : [])]), [s === 0 ? '合并时，有颜色的格子都留下。' : '合并时，只有一块有色才留下，两块都有色就变白。']); })),
    set('G08', '颜色密码运算', nine((i, s, v) => { const n = 2 + s, colors = ['红', '蓝', '黄']; const a = Array.from({ length: n }, (_, k) => (k + v) % 3), b = Array.from({ length: n }, (_, k) => (k + 1 + s) % 3), out = a.map((x, k) => (x + b[k]) % 3); const draw = (xs: number[]) => grid(xs.map(n => colors[n]), xs.length, [], xs.map(n => palette[n])); return fig('G08', i, '这是颜色密码规则，算出的图卡是哪张？', draw(out), [draw(out.map((x, k) => k === 0 ? (x + 1) % 3 : x)), draw(out.map((x, k) => k === n - 1 ? (x + 2) % 3 : x))], '先把颜色读成数字，相加，满三就减三，再换回颜色。这里是编码规则，不是调颜料。', panels([{ title: '第一排', drawing: draw(a) }, { title: '第二排', drawing: draw(b) }]), ['红代表0，蓝代表1，黄代表2。', '同一位置的两个数相加，满3就减3。']); })),
    set('G09', '点线面数清楚', nine((i, s, v) => { let answer: number, prompt: string, art: Drawing, reason: string; if (s === 1 && v === 1)
        return numeric('G09', i, '把交点作为分界，这个十字共有几段小线段？', 4, [2, 3, 5], '两条整直线在交点处分开，每条变成两段，所以有四段小线段。', picture([line(80, 140, 520, 140), line(300, 40, 300, 240), circle(300, 140, 6, '#253243')]), { operation: 'multiply', values: [2, 2] }); if (s === 2 && v < 2) {
        const count = v + 2, objects: Primitive[] = [];
        for (let k = 0; k < count; k++) {
            objects.push(circle(100 + k * 180, 125, 42, palette[k]), rect(100 + k * 180, 125, 42, 42, palette[k]));
        }
        return numeric('G09', i, '每组连在一起的图形算一个整体。图中共有几个互不相连的部分？', count, [count * 2, count + 1, count - 1], `组内圆和方形重叠，合为一部分；组与组分开，共${count}部分。`, picture(objects), { operation: 'identity', values: [count] });
    } if (s === 0) {
        const sides = 3 + v, points = Array.from({ length: sides }, (_, k) => [160 + 100 * Math.sin(k * 2 * Math.PI / sides), 155 - 100 * Math.cos(k * 2 * Math.PI / sides)] as [
            number,
            number
        ]);
        answer = sides;
        prompt = v === 0 ? '这个图形有几条边？' : v === 1 ? '这个图形有几个角？' : '图上有几个顶点？';
        art = picture([{ kind: 'polygon', points, fill: '#edf2d9' }, ...points.map(([x, y]) => circle(x, y, 5, '#253243'))], 320, 320);
        reason = `沿轮廓有序地数，每个${v === 0 ? '边' : v === 1 ? '角' : '顶点'}只数一次，共${answer}个。`;
    }
    else {
        const rows = s === 1 ? 2 : 3, cols = 2 + v;
        answer = s === 1 ? rows * cols : rows * (rows + 1) * cols * (cols + 1) / 4;
        prompt = s === 1 ? '只数最小的小格，图里有几个面？' : '大小长方形都算，图里一共有几个长方形？';
        art = grid(Array(rows * cols).fill(''), cols);
        reason = s === 1 ? `${rows}排，每排${cols}格，一共${answer}格。` : `先按宽和高分类。每个长方形由两条横边和两条竖边确定，一共${answer}个。`;
    } return numeric('G09', i, prompt, answer, [answer - 1, answer + 1, answer + 3], reason, art, { operation: 'identity', values: [answer] }); })),
    set('G10', '哪里可以对折', nine((i, s, v) => { const shapes = [picture([{ kind: 'polygon', points: [[160, 45], [55, 265], [265, 265]], fill: palette[1] }], 320, 320), picture([rect(60, 65, 200, 65, palette[1]), rect(127, 130, 66, 135, palette[1])], 320, 320), picture([{ kind: 'polygon', points: [[160, 35], [275, 145], [200, 145], [200, 275], [120, 275], [120, 145], [45, 145]], fill: palette[1] }], 320, 320)]; const bits = [[1, 0, 1, 1, 1, 1, 0, 1, 0], [1, 1, 1, 0, 1, 0, 1, 1, 1], [1, 0, 1, 0, 1, 0, 1, 0, 1]][v]; const shape = s === 0 ? shapes[v] : s === 1 ? (v === 0 ? picture([rect(50, 95, 220, 130, palette[1])], 320, 320) : v === 1 ? picture([rect(60, 60, 200, 200, palette[1])], 320, 320) : picture([{ kind: 'polygon', points: [[160, 35], [280, 160], [160, 285], [40, 160]], fill: palette[1] }], 320, 320)) : mosaic(bits); const w = shape.width, h = shape.height, foldLines = [[w / 2, 10, w / 2, h - 10], [10, h / 2, w - 10, h / 2], [10, 10, w - 10, h - 10], [10, h - 10, w - 10, 10]], valid = s === 0 ? [0] : s === 1 ? (v === 1 ? [0, 1, 2, 3] : [0, 1]) : v === 0 ? [0] : v === 1 ? [0, 1] : [0, 1, 2, 3]; return selection('G10', i, '沿哪些虚线对折，两边能完全重合？', foldLines.map(([x, y, x2, y2], k) => card(`axis${k}`, `折线${k + 1}`, picture([...shape.objects, line(x, y, x2, y2, true)], w, h))), valid.map(k => `axis${k}`), '要检查整个图案都重合，不能只看外轮廓或只看一个色块。', shape); })),
    set('G11', '相碰还是相交', nine((i, s, v) => { const draw = (distance: number, inside = false) => picture([circle(120, 155, 70, '#f5d7d0'), circle(inside ? 120 : 120 + distance, 155, inside ? 25 : 55, '#c9dfef')], 320, 320); if (s === 0) {
        const outline = symbol(v, 0);
        const option = (x: number) => picture([...outline.objects, circle(x, 155, 23, palette[1])], 320, 320);
        return fig('G11', i, '哪张图里，蓝色圆完全在红色图形里面？', option(160), [option(35), option(245)], '蓝色圆的每个部分都在红色图形内，边界没有伸出去。', undefined);
    } const options = [draw(125), draw(95), draw(145), draw(0, true)]; return selection('G11', i, s === 1 ? ['哪些图形的边界相碰，但没有交叉？', '哪些图形的边界互相交叉？', '哪些图形完全分开？'][v] : ['哪些图中，红蓝两块作为一个整体连在一起？', '哪些图里一个图形完全包含另一个？', '哪些图里两块有重叠，但互不包含？'][v], options.map((d, k) => card(`r${k}`, `图${k + 1}`, d)), (s === 1 ? [[0], [1], [2]][v] : [[0, 1, 3], [3], [1]][v]).map(k => `r${k}`), '看清边界的关系：相碰、交叉、分开和包含是不同情况。', undefined, [v === 0 ? '看清两条边界。' : v === 1 ? '不要把中间的白色空隙忽略掉。' : '可以用手指沿边界检查。']); })),
    set('G12', '小黑点的任务', nine((i, s, v) => { const outline = symbol(v, 2), placements: [
        [
            number,
            number
        ],
        [
            number,
            number
        ],
        [
            number,
            number
        ]
    ] = [[160, 160], [32, 32], [160, v === 2 ? 72 : 88]], art = (k: number) => picture([...outline.objects, circle(placements[k][0], placements[k][1], 7, '#263547')], 320, 320), answer = s === 0 ? 0 : s === 1 ? 2 : 1; return fig('G12', i, ['小黑点负责标出图形里面。哪张符合这项任务？', '小黑点的中心要落在轮廓线上。哪张符合？', '小黑点负责标出图形外面。哪张符合？'][s], art(answer), [0, 1, 2].filter(k => k !== answer).map(art), '形状可以变，标记的作用不能变。要根据这次指定的任务判断。', undefined, [['点的中心要在内部。', '点的中心要在边界上。', '点的中心要在外部。'][s]]); })),
    set('G13', '多位图形密码', nine((i, s, v) => { const symbols = ['○', '□', '△'], numbers = [2 + v, 5 + v, 8 + v], seq = Array.from({ length: 3 + s }, (_, k) => (k + v) % 3); const reverse = s === 2; const ts = reverse ? symbols.map((n, k) => card(`s${k}`, n, symbol(k, 1))) : numbers.map((n, k) => card(`n${k}`, n)); return fillGrid('G13', i, reverse ? '把数字密码译回图形。' : '把图形密码译成数字。', ts, seq.length, seq.map(k => `${reverse ? 's' : 'n'}${k}`), seq.map((_, k) => k), '每一位都要用同一张对照表，不因为位置改变对应关系。', [symbols.map((n, k) => `${n}对应${numbers[k]}`).join('，')], grid(seq.map(k => reverse ? numbers[k] : symbols[k]), seq.length)); })),
    set('G14', '拼搭小工坊', nine((i, s, v) => { if (s === 1) {
        const l: Point3[] = [[0, 0, 0], [1, 0, 0], [0, 1, 0]], specs = v === 0 ? [{ cells: l, x: 0, y: 0, r: 0 }, { cells: [[0, 0, 0]] as Point3[], x: 1, y: 1, r: 0 }] : v === 1 ? [{ cells: l, x: 0, y: 0, r: 0 }, { cells: l, x: 1, y: 0, r: 2 }] : [{ cells: l, x: 0, y: 0, r: 0 }, { cells: [[0, 0, 0], [0, 1, 0]] as Point3[], x: 2, y: 0, r: 0 }, { cells: l, x: 1, y: 1, r: 3 }], pieces = specs.map((p, k) => ({ id: `p${k}`, label: String.fromCharCode(65 + k), cells: p.cells, color: palette[k] })), placements = specs.map((p, k) => ({ pieceId: `p${k}`, x: p.x, y: p.y, z: 0, rotation: p.r }));
        const occupied = specs.flatMap((p, k) => { let cs = p.cells.map(c => [...c] as Point3); for (let j = 0; j < p.r; j++)
            cs = cs.map(([x, y, z]) => [-y, x, z]); const minX = Math.min(...cs.map(c => c[0])), minY = Math.min(...cs.map(c => c[1])); return cs.map(([x, y, z]) => [x - minX + p.x, y - minY + p.y, z] as Point3); });
        const a: ConstructionActivity = { ...base('G14', i, '转一转部件，把缺口拼完整。', '选部件，必要时转动，再把它放到阴影里。', '不同形状的部件恰好拼满，没有重叠，也没有盖到阴影外。'), kind: 'construction', columns: v === 0 ? 2 : 3, rows: v === 2 ? 3 : 2, layers: 1, pieces, target: occupied, allowRotate: true };
        authoringSolutions[a.id] = { kind: 'construction', placements };
        return a;
    } const columns = 2 + v, rows = 2, layers = s === 2 ? 2 : 1; const pieces: Piece[] = [], target: Point3[] = []; const placements = []; for (let z = 0; z < layers; z++)
        for (let x = 0; x < columns; x++) {
            const id = `p${z * columns + x}`;
            pieces.push({ id, label: String.fromCharCode(65 + pieces.length), cells: s === 1 ? [[0, 0, 0], [1, 0, 0]] : [[0, 0, 0], [0, 1, 0]], color: palette[pieces.length % 5] });
            placements.push({ pieceId: id, x, y: 0, z, rotation: s === 1 ? 1 : 0 });
            target.push([x, 0, z], [x, 1, z]);
        } const a: ConstructionActivity = { ...base('G14', i, s === 2 ? '用部件把每一层都搭完整。' : s === 1 ? '有的部件需要转一转，再拼满阴影。' : '用这些部件，刚好盖住阴影。', '选部件，再点格子作为它的左上角。可以取下重摆。', '每个目标格都盖住了，没有重叠，也没有多出来的格子。'), kind: 'construction', columns, rows, layers, pieces, target, allowRotate: s > 0 }; authoringSolutions[a.id] = { kind: 'construction', placements }; return a; })),
    set('G15', '折开会怎样', nine((i, s, v) => { if (s === 0)
        return parent('G15', i, ['对折找重合', '折两次找痕迹', '从折痕倒推折法'][v], ['正方形纸', '彩笔', '圆头儿童剪刀（由家长示范剪口）'], v === 0 ? ['把纸左右对折，摸一摸哪两条边重合。', '在折好的纸上画一个点，请家长演示一个小剪口。', '展开看看对应位置，再把纸合上验证。'] : v === 1 ? ['先左右对折，再上下对折。', '在折好的角落画记号，预测展开有几处。', '由家长演示剪口，展开后核对对称位置。'] : ['观察一张有横竖折痕的纸。', '试着说出一种能留下这些折痕的折法。', '实际折一遍，比较你的预测和结果。'], ['能说明重合的边', '能先预测再操作', '能用对应位置解释结果']); const bits = Array(16).fill(0), row = s === 2 ? [2, 2, 3][v] : v, col = s === 2 ? [2, 3, 3][v] : 2; bits[row * 4 + col] = 1; bits[row * 4 + 3 - col] = 1; if (s === 2) {
        bits[(3 - row) * 4 + col] = 1;
        bits[(3 - row) * 4 + 3 - col] = 1;
    } return fig('G15', i, s === 1 ? '左右对折后打了一个孔，展开后是哪种分布？' : '先左右、再上下对折后打孔，展开后是哪种分布？', mosaic(bits, 4), [mosaic(flip(bits, 0), 4), mosaic(flip(bits, 15), 4), mosaic(flip(bits, 5), 4)], '展开时，每道折线两边的孔位置成对称关系。', grid(Array.from({ length: 16 }, (_, k) => k === row * 4 + col ? '孔' : ''), 4), [s === 1 ? '竖直中线是左右折线。' : '横、竖两条中线都是折线。', '图里标出折好后打孔的位置。']); })),
    set('G16', '积木的另一面', nine((i, s, v) => { if (s === 0)
        return parent('G16', i, ['球、盒子和圆柱', '找平面和曲面', '照着视图搭一搭'][v], ['球', '方盒', '圆柱形积木', '三到五块方积木'], v === 0 ? ['分别观察三种物体，再让它们在平面上轻轻移动。', '比较哪些方向容易滚动，哪些能稳稳叠放。', '按观察到的特征分组，并解释依据。'] : v === 1 ? ['用手指沿方盒和圆柱的表面观察。', '找出平平的面和弯曲的面，比较接触桌面的不同情况。', '换一个放置方向，再检查是否能稳稳站住。'] : ['家长搭一个简单结构，让孩子分别从前、侧和上面看。', '孩子换到同一位置，用自己的积木试搭。', '从三个方向比较，指出哪里还需要调整。'], ['能描述实际观察到的立体特征', '能按同一依据比较', '能换观察方向重新检查']); const columns = 2, heights = [1 + v, 1, 2, 1 + s], art = blocks(heights, columns); if (s < 2) {
        const n = heights.reduce((a, b) => a + b, 0);
        return numeric('G16', i, '每摞从地面连续向上搭，没有空洞。一共几块？', n, [n - 1, n + 1, heights.filter(n => n > 0).length], '把每摞的块数加起来，挡在后面的也不能漏掉。', panels([{ title: '积木', drawing: art }, { title: '从上面标出每摞块数', drawing: grid(heights, columns) }]), { operation: 'add', values: heights });
    } const candidates = [heights, [heights[0], heights[1] + 1, heights[2], heights[3]], [...heights.slice(0, 3), heights[3] + 1], [heights[0], heights[1], heights[2] + 1, heights[3]]]; const front = (h: number[]) => [Math.max(h[0], h[2]), Math.max(h[1], h[3])], side = (h: number[]) => [Math.max(h[0], h[1]), Math.max(h[2], h[3])]; const mask = (h: number[]) => h.map(n => n > 0); const silhouette = (h: number[]) => { const height = Math.max(...h); return mosaic(Array.from({ length: h.length * height }, (_, k) => Number(h[k % h.length] >= height - Math.floor(k / h.length))), h.length, '#405769'); }; const same = (a: unknown, b: unknown) => JSON.stringify(a) === JSON.stringify(b); const expected = candidates.flatMap((h, k) => same(front(h), front(heights)) && same(side(h), side(heights)) && same(mask(h), mask(heights)) ? [`b${k}`] : []); return selection('G16', i, '根据前、侧、上三个视图，哪些搭法都有可能？', candidates.map((h, k) => card(`b${k}`, `搭法${k + 1}`, blocks(h, 2))), expected, '从每个方向看到的轮廓都要相符。只看轮廓，有时不能确定藏在后面的高度。', panels([{ title: '从前面看', drawing: silhouette(front(heights)) }, { title: '从侧面看', drawing: silhouette(side(heights)) }, { title: '上面：有积木的位置', drawing: mosaic([1, 1, 1, 1], 2) }])); })),
    set('G17', '换个方向看左右', nine((i, s, v) => { const dirs = [[0, -1], [1, 0], [0, 1], [-1, 0]], d = dirs[(s + v) % 4], left = [d[1], -d[0]], onLeft = v !== 1, axis = s === 2 ? d : left, p = [160 + axis[0] * (onLeft ? 95 : -95), 160 + axis[1] * (onLeft ? 95 : -95)]; return choice('G17', i, '小朋友面向箭头。红球在小朋友自己的哪一边？', ['左边', '右边', '前面', '后面'], s === 2 ? (onLeft ? 2 : 3) : (onLeft ? 0 : 1), '先和小朋友朝向同一边，再判断他的左和右。画面左边不一定是他的左边。', picture([circle(160, 160, 28, '#f2d8a8'), line(160, 160, 160 + d[0] * 65, 160 + d[1] * 65), { kind: 'polygon', points: [[160 + d[0] * 80, 160 + d[1] * 80], [160 + d[0] * 55 + left[0] * 10, 160 + d[1] * 55 + left[1] * 10], [160 + d[0] * 55 - left[0] * 10, 160 + d[1] * 55 - left[1] * 10]], fill: '#40566a' }, circle(p[0], p[1], 18, palette[0])], 320, 320)); })),
    set('G18', '纸盒六个面', nine((i, s, v) => { const nets: [
        number,
        number
    ][][] = [[[1, 0], [0, 1], [1, 1], [2, 1], [1, 2], [1, 3]], [[0, 1], [1, 1], [2, 1], [3, 1], [1, 0], [1, 2]], [[0, 0], [1, 0], [1, 1], [2, 1], [2, 2], [3, 2]]]; const net = nets[v], normals = cubeNormals(net); if (new Set(normals.map(n => n.join(','))).size !== 6)
        throw Error('Invalid cube net'); const face = s % 6, opposite = normals.findIndex(n => n.every((x, j) => x === -normals[face][j])); const objects: Primitive[] = net.flatMap(([x, y], k) => [rect(60 + x * 72, 20 + y * 72, 72, 72, palette[k]), { ...text(96 + x * 72, 65 + y * 72, String.fromCharCode(65 + k), 25), color: k === 5 ? '#fffdf7' : '#253243' }]); if (s === 1)
        return selection('G18', i, `折成盒子后，哪些面和${String.fromCharCode(65 + face)}面相邻？`, net.map((_, k) => card(`face${k}`, String.fromCharCode(65 + k))), net.flatMap((_, k) => k !== face && k !== opposite ? [`face${k}`] : []), '一个面有四个相邻面，只有正对面的那个不相邻。', picture(objects, 500, 330)); return choice('G18', i, `折成盒子后，哪个面和${String.fromCharCode(65 + face)}面相对？`, [opposite, (opposite + 1) % 6, (opposite + 2) % 6].map(k => String.fromCharCode(65 + k)), 0, '沿相邻的边折起来，面对面的两个面不会共用一条边。可以用纸折盒验证。', picture(objects, 500, 330)); })),
    set('G19', '方格重建师', nine((i, s, v) => { const columns = s === 1 ? 4 : 3, bits = s === 1 ? Array.from({ length: 16 }, (_, k) => { const x = k % 4 - (v === 1 ? 1 : 0), y = Math.floor(k / 4) - (v === 2 ? 1 : 0); return x >= 0 && x < 3 && y >= 0 && y < 3 ? patterns[v][y * 3 + x] : 0; }) : patterns[v], sol = s === 2 ? mirror(bits) : bits; const ts = [card('filled', '蓝格', mosaic([1], 1)), card('blank', '空白格', mosaic([0], 1))]; return fillGrid('G19', i, s === 2 ? '把参照图左右翻过来，摆进方格里。' : '照着参照图，把蓝格和空白格都摆出来。', ts, columns, sol.map(x => x ? 'filled' : 'blank'), sol.map((_, k) => k), '每个格位都要对应，空白也是图案的一部分。', [s === 2 ? '左右反过来，上下不变。' : '按行找位置，模型会一直保留。'], mosaic(bits, columns)); })),
    set('G20', '谁盖住了谁', nine((i, s, v) => { const n = s === 0 ? (v === 2 ? 3 : 2) : s === 1 ? 3 : 4, positions = [[105, 100], [215, 100], [105, 210], [215, 210]], order = Array.from({ length: n }, (_, k) => (k + v) % n), names = ['红片', '蓝片', '黄片', '绿片']; const ts = Array.from({ length: n }, (_, k) => card(`p${k}`, names[k], picture([circle(160, 160, 90, palette[k])], 320, 320))); const radius = s === 1 && v === 2 ? 64 : 83; const art = picture(order.map(k => circle(positions[k][0], positions[k][1], radius, palette[k])), 320, 320); const seq = order.map(k => `p${k}`), a = ordered('G20', i, '照着遮挡图，把纸片按从底层到顶层排好。', ts, seq, '看得见的遮挡关系要对上。两片之间的重叠如果被别的纸片完全挡住，也可能无法确定它们的先后。', [], art); if (a.kind === 'orderedPlacement') {
        const rules = visibleLayerPairs(order.map(k => ({ id: `p${k}`, x: positions[k][0], y: positions[k][1], radius }))).map(([first, second]) => ({ type: 'before' as const, first, second, text: `${ts.find(t => t.id === first)!.label}放在${ts.find(t => t.id === second)!.label}下面。` }));
        a.evaluation = { kind: 'constraints', rules };
        a.clues = [];
        a.cluesFromIllustration = true;
    } return a; })),
];
