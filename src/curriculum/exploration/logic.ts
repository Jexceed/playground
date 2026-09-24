import { set, nine, choice, numeric, selection, ordered, fillGrid, parent, base, card, authoringSolutions, authoringNotes, matching } from './helpers';
import { picture, text, grid, dots, symbol, panels, palette } from './draw';
import { tokens as familiar } from '../pilot/tokens';
import type { Activity } from '../../domain/activity';
import type { Graph, RouteActivity } from '../../domain/advanced-activity';
const equation = (value: string) => picture([text(300, 135, value, 35)]);
function routeSolution(a: RouteActivity) { const found: string[][] = []; function walk(node: string, path: string[]) { if (node === a.end && a.requiredNodes.every(id => visitedNodes(path).includes(id)) && a.requiredEdges.every(id => path.includes(id)))
    found.push(path); if (path.length >= a.graph.edges.length)
    return; for (const e of a.graph.edges) {
    if (path.includes(e.id) || a.blockedEdges.includes(e.id))
        continue;
    if (e.from === node || e.to === node)
        walk(e.from === node ? e.to : e.from, [...path, e.id]);
} } function visitedNodes(path: string[]) { let cur = a.start; return [cur, ...path.map(id => { const e = a.graph.edges.find(e => e.id === id)!; cur = e.from === cur ? e.to : e.from; return cur; })]; } walk(a.start, []); found.sort((x, y) => x.length - y.length); if (!found.length)
    throw Error(a.id + ' has no route'); return found[0]; }
const featureCards = () => Array.from({ length: 9 }, (_, k) => card(`f${k}`, `${['红', '蓝', '黄'][Math.floor(k / 3)]}色${['圆形', '方形', '三角形'][k % 3]}`, symbol(k % 3, Math.floor(k / 3))));
export const logicSets = [
    set('L01', '分类换个角度', nine((i, s, v) => { const ts = featureCards(); const valid = ts.filter((_, k) => s === 0 ? Math.floor(k / 3) === v : s === 1 ? k % 3 === v : Math.floor(k / 3) !== v && k % 3 !== ((v + 1) % 3)); const clues = s === 0 ? [`选出${['红', '蓝', '黄'][v]}色。`] : s === 1 ? [`选出${['圆形', '方形', '三角形'][v]}。`] : [`颜色不是${['红', '蓝', '黄'][v]}色。`, `形状不是${['圆形', '方形', '三角形'][(v + 1) % 3]}。`]; return selection('L01', i, '按这次的规则整理图卡。', ts, valid.map(t => t.id), '每一张留下的图卡都符合这次的条件。换一个条件，原来同组的图卡也可能分开。', undefined, clues); })),
    set('L02', '关系接力', nine((i, s, v) => { const n = 2 + s; const left = Array.from({ length: n }, (_, k) => card(`a${k}`, `左图${k + 1}`, s === 0 ? dots(k + 2 + v) : symbol(k % 3, v))); const right = Array.from({ length: n }, (_, k) => card(`b${k}`, s === 0 ? String(k + 2 + v) : `右图${k + 1}`, s === 0 ? undefined : symbol(k % 3, (v + 1) % 3))); const a = matching('L02', i, s === 0 ? '把点群和表示数量的数连起来。' : s === 1 ? '颜色换了，找到形状关系相同的图。' : '把左边每个图和右边同形状的图配对，颜色可以不同。', left, right, left.map((t, k) => [t.id, right[k].id]), s === 0 ? '点的数量和数字一一对应，排法不会改变这个关系。' : '颜色不同不会改变形状关系。先说出形状，再寻找对应图。'); if (a.kind === 'matching' && s === 2) a.alternativePairings = [[['a0', 'b3'], ['a1', 'b1'], ['a2', 'b2'], ['a3', 'b0']]]; return a; })),
    set('L03', '线索够不够', nine((i, s, v) => { if (s === 2) {
        const ts = ['小兔', '小猫', '小狗'];
        return choice('L03', i, `只知道${ts[v]}比${ts[(v + 1) % 3]}高，${ts[(v + 2) % 3]}也比${ts[(v + 1) % 3]}高。谁更高：${ts[v]}还是${ts[(v + 2) % 3]}？`, [`${ts[v]}更高`, `${ts[(v + 2) % 3]}更高`, '现在还不能确定'], 2, '两位都比同一位高，不能确定这两位之间谁更高。还需要比较他们的线索。', equation(`${ts[v]} > ${ts[(v + 1) % 3]} < ${ts[(v + 2) % 3]}`));
    } const ts = familiar(...['rabbit', 'cat', 'dog', 'bear'].slice(0, 3 + s)); const seq = ts.map(t => t.id); const order = [...seq.slice(v), ...seq.slice(0, v)]; const clues = order.slice(0, -1).map((id, k) => `${ts.find(t => t.id === id)!.label}在${ts.find(t => t.id === order[k + 1])!.label}前面。`); const a = ordered('L03', i, '根据线索，把队伍排好。', ts, order, '把前后关系连起来，每一条线索都能在队伍里验证。', clues); if (a.kind === 'orderedPlacement')
        a.evaluation = { kind: 'constraints', rules: order.slice(0, -1).map((id, k) => ({ type: 'before', first: id, second: order[k + 1], text: clues[k] })) }; return a; })),
    set('L04', '格子里的线索', nine((i, s, v) => { const n = 3, ts = familiar('rabbit', 'cat', 'dog'); const solution = Array.from({ length: 9 }, (_, k) => ts[(Math.floor(k / 3) + k % 3 + v) % 3].id); const blanks = s === 0 ? [2, 7] : s === 1 ? [1, 2, 3, 7] : [1, 2, 3, 5, 6, 7]; const a = fillGrid('L04', i, '每行每列都要有三位不同的朋友。', ts, n, solution, blanks, '逐行、逐列看，小兔、小猫、小狗都各出现一次。', ['每一行每种动物只有一张。', '每一列每种动物只有一张。']); if (a.kind === 'gridPlacement')
        a.evaluation = { kind: 'latin', tokenIds: ts.map(t => t.id) }; return a; })),
    set('L05', '路线设计师', nine((i, s, v) => {
        let graph: Graph, start = 'n0', end: string, requiredNodes: string[] = [], requiredEdges: string[] = [], blockedEdges: string[] = [];
        if (s !== 1) {
            const n = 3 + v;
            graph = { nodes: Array.from({ length: n }, (_, k) => ({ id: `n${k}`, label: String.fromCharCode(65 + k), x: 300 + Math.sin(k * 2 * Math.PI / n) * 180, y: 155 - Math.cos(k * 2 * Math.PI / n) * 105 })), edges: Array.from({ length: s === 0 ? n - 1 : n }, (_, k) => ({ id: `e${k}`, from: `n${k}`, to: `n${(k + 1) % n}` })) };
            if (s === 2) {
                graph.edges.push({ id: 'parallel', from: 'n0', to: 'n1', curve: 48 });
                requiredEdges = graph.edges.map(e => e.id);
                end = 'n1';
            }
            else
                end = `n${n - 1}`;
        }
        else {
            const hub = [1, 3, 4][v], upper = [2, 1, 1][v], lower = [4, 4, 2][v], detour = [3, 2, 3][v];
            const positions: Record<number, [number, number]> = { 0: [60, 155], 5: [540, 155], [hub]: [280, 155], [upper]: [410, 45], [lower]: [410, 260], [detour]: [170, 260] };
            graph = { nodes: Array.from({ length: 6 }, (_, k) => ({ id: `n${k}`, label: String.fromCharCode(65 + k), x: positions[k][0], y: positions[k][1] })), edges: [[0, hub], [hub, upper], [upper, 5], [hub, lower], [lower, 5], [0, detour], [detour, hub], [0, upper], [hub, 5]].map(([from, to], k) => ({ id: `e${k}`, from: `n${from}`, to: `n${to}` })) };
            end = 'n5';
            requiredNodes = [`n${hub}`];
            blockedEdges = ['e8'];
        }
        const a: RouteActivity = { ...base('L05', i, s === 2 ? '每一段路都走一次，走到终点。' : s === 1 ? '经过指定地点，找到少走几段的路。' : '从起点一步步走到终点。', '直接点图上相邻的地点或路段，沿着路一步步走。可以撤销。', s === 2 ? '每个路段都走了一次；连接相同两点的直路和弯路是不同路段。' : '路线连贯，经过了所有指定地点。'), kind: 'route', graph, start, end, requiredNodes, requiredEdges, blockedEdges, allowRevisit: false };
        a.clues = s === 2 ? ['不能抬笔跳走。', '每段路只走一次，弯路也算一段。'] : s === 1 ? [`必须经过${graph.nodes.find(n => n.id === requiredNodes[0])!.label}。`, '标记不通的路不能走。', '在合法路线里，找段数最少的。'] : ['从A出发，沿相连的路走。'];
        const path = routeSolution(a);
        if (s === 1) {
            a.optimalLength = path.length;
            a.revision = 2;
            a.instruction = '点相邻地点或路段，一步步走。不重复走同一段路，可以撤销。';
            a.success = '这条路线符合条件，用的路段最少。还可以找另一条同样短的路线。';
            a.hints = ['先找能经过指定地点的路线，再数一数走了几段。', '可以撤销回到起点，试试另一条路。只比较都符合条件的路线。'];
            a.parentPrompt = '你比较了哪两条合法路线？哪条少走几段？有没有一样短的路线？';
            authoringNotes[a.id].reason = a.success;
        }
        authoringSolutions[a.id] = { kind: 'route', edgeIds: path };
        return a;
    })),
    set('L06', '先后有讲究', nine((i, s, v) => { const stories = [['准备种子', '把种子放进土里', '轻轻浇水', '等待发芽'], ['准备画纸', '画出轮廓', '给画涂色', '把画晾干'], ['洗净水果', '把水果切块', '把果块装碗', '一起品尝']]; const steps = stories[v].slice(0, 3 + (s > 0 ? 1 : 0)); const ts = steps.map((t, k) => card(`step${k}`, t)); const clues = steps.slice(1).map((t, k) => `先${steps[k]}，再${t}。`); const a = ordered('L06', i, s === 2 ? '这次顺序弄乱了，请按先后条件修好。' : '按步骤做事，哪些事要先做？', ts, ts.map(t => t.id), '每一步的准备都已经完成，再做下一步。请再解释一条不能颠倒的关系。', clues, s === 2 ? grid([...steps].reverse(), steps.length) : undefined); if (a.kind === 'orderedPlacement')
        a.evaluation = { kind: 'constraints', rules: ts.slice(1).map((t, k) => ({ type: 'before', first: ts[k].id, second: t.id, text: clues[k] })) }; return a; })),
    set('L07', '证据说明什么', nine((i, s, v) => { if (s === 2)
        return parent('L07', i, ['悄悄选一张图卡，用两条线索让家长来找。', '先给颜色线索，再补形状。家长能找到吗？', '先给形状线索，再补颜色。家长能找到吗？'][v], ['三种颜色、三种形状的九张图卡'], ['家长先转身。孩子在心里选一张，九张都留在桌上，不指给家长看。', v === 0 ? '家长转回来后，孩子说一条颜色线索和一条形状线索，请家长找图卡。' : v === 1 ? '先只说颜色，请家长指出所有可能的图卡；再补上形状线索。' : '先只说形状，请家长指出所有可能的图卡；再补上颜色线索。', '最后公布选中的图卡。少说一条线索时，还有哪几张也有可能？'], ['能说出观察到的事实', '能让两条线索共同确定目标', '能解释少一条线索时为什么可能有多个答案']); const ts = featureCards(); const expected = ts.filter((_, k) => Math.floor(k / 3) === v && (s === 0 || k % 3 !== 1)).map(t => t.id); return selection('L07', i, '哪些图卡仍然有可能藏在盒子里？', ts, expected, '没有被线索排除的都还是可能的。线索不够时，不急着选唯一答案。', undefined, [`它的颜色是${['红', '蓝', '黄'][v]}色。`, ...(s === 1 ? ['它不是方形。'] : [])]); })),
    set('L08', '学会新规则', nine((i, s, v) => { const start = 2 + v, add = 2 + s, mult = s === 2 ? 2 : 1, answer = (start + add) * mult; const a = numeric('L08', i, `让${start}个圆片经过规则机，最后变成几个？`, answer, [start + add + 1, start * mult + add, answer + 2], `先加${add}，${s === 2 ? '再把总数变成两倍，' : ''}得到${answer}。换了起始数量，也要按同一条规则做。`, panels([{ title: '先看例子', drawing: grid([1, '→', (1 + add) * mult], 3) }, { title: '轮到你', drawing: grid([start, '→', '?'], 3) }]), { operation: 'affine', values: [start, add, mult] }, [`先添上${add}个。`, ...(s === 2 ? ['再把所有圆片变成两倍。'] : [])]); a.protocol = { kind: 'learnThenTransfer', demonstration: `先看例子：一个圆片先添${add}个，${s === 2 ? '再把总数变成两倍，' : ''}得到${(1 + add) * mult}个。接下来换一个起始数量，仍用这条规则。` }; return a; })),
    set('L09', '翻牌小机关', nine((i, s, v) => { const n = 3 + s, initial = Array.from({ length: n }, (_, k) => (k + v) % 2), steps = s === 0 ? [v % n] : s === 1 ? [v % n, (v + 1) % n] : [v % n, (v + 1) % n, v % n]; const final = [...initial]; steps.forEach(k => final[k] = 1 - final[k]); const ts = [card('off', '白面', grid([''], 1)), card('on', '黄面', symbol(1, 2))]; return fillGrid('L09', i, '按顺序翻牌，最后每个位置朝上的是哪一面？', ts, n, final.map(n => n ? 'on' : 'off'), Array.from({ length: n }, (_, k) => k), '翻一次换一面；同一张翻两次，又回到原来。', steps.map(k => `翻第${k + 1}张。`), grid(initial.map(() => ''), n, [], initial.map(n => n ? palette[2] : '#fffdf7'))); })),
    set('L10', '两位朋友走格子', nine((i, s, v) => { const a = 1 + v, b = 9 + v, steps = 2 + s, redStep = 1, blueStep = s === 0 ? 1 : 2, red = a + steps * redStep, blue = b - steps * blueStep; const ts = Array.from({ length: 12 }, (_, k) => card(`n${k}`, k)); const result = ordered('L10', i, '走完以后，两位朋友分别停在哪个数字？', ts, [`n${red}`, `n${blue}`], `每走一次都更新位置。红色停在${red}，蓝色停在${blue}。两个位置可以相同。`, [`红色从${a}出发，每次向右走${redStep}格。`, `蓝色从${b}出发，每次向左走${blueStep}格。`, `同时走${steps}次。先摆红色位置，再摆蓝色位置。`], grid(Array.from({ length: 12 }, (_, k) => k), 12)); if (result.kind === 'orderedPlacement')
        result.tokenUse = 'unlimited'; return result; })),
    set('L11', '棋盘下一步', nine((i, s, v) => { if (s === 2) {
        const b = Array(16).fill('');
        b[5] = '○';
        b[6] = '●';
        b[9] = '●';
        b[10] = '○';
        if (v > 0) {
            b[0] = '●';
            b[1] = '○';
            b[2] = '○';
        }
        if (v === 2) {
            b[4] = '○';
            b[8] = '○';
        }
        const captures = (pos: number) => { let total = 0; for (const [dx, dy] of [[1, 0], [-1, 0], [0, 1], [0, -1], [1, 1], [1, -1], [-1, 1], [-1, -1]]) {
            let x = pos % 4 + dx, y = Math.floor(pos / 4) + dy, n = 0;
            while (x >= 0 && x < 4 && y >= 0 && y < 4 && b[y * 4 + x] === '○') {
                n++;
                x += dx;
                y += dy;
            }
            if (n && x >= 0 && x < 4 && y >= 0 && y < 4 && b[y * 4 + x] === '●')
                total += n;
        } return total; };
        const open = b.flatMap((n, k) => n === '' ? [k] : []), max = Math.max(...open.map(captures)), candidates = open.filter(k => captures(k) > 0).slice(0, 6);
        const wrong = open.find(k => captures(k) === 0);
        if (wrong !== undefined)
            candidates.push(wrong);
        return selection('L11', i, '下一颗黑子放在哪里，能夹住最多白子？', candidates.map(k => card(`p${k}`, `第${k + 1}格`, grid(b.map((x, j) => j === k ? '●' : x), 4))), candidates.filter(k => captures(k) === max).map(k => `p${k}`), `沿横、竖和斜线检查，两端是黑子、中间连续白子才算夹住。这题最多夹住${max}颗，并列最多的都可以选。`, grid(b.map((n, k) => n || String(k + 1)), 4), ['新落下的黑子和已有黑子之间，要连续夹着白子。', '空格会把夹子断开。', '找出所有夹住最多白子的落点。']);
    } const board = Array(9).fill(''); const lineSets = [[0, 1, 2], [3, 4, 5], [6, 7, 8], [0, 3, 6], [1, 4, 7], [2, 5, 8], [0, 4, 8], [2, 4, 6]]; const target = lineSets[(s * 2 + v) % lineSets.length]; board[target[0]] = '●'; board[target[1]] = '●'; if (s > 0)
        board[(target[2] + 1) % 9] = board[(target[2] + 1) % 9] || '○'; const open = board.flatMap((n, k) => n === '' ? [k] : []); const winners = open.filter(k => lineSets.some(xs => xs.every(x => x === k || board[x] === '●'))); return selection('L11', i, '在哪些空格补一颗黑子，能连成三颗黑子？', open.map(k => card(`p${k}`, `第${k + 1}格`, grid(board.map((x, j) => j === k ? '●' : x), 3))), winners.map(k => `p${k}`), '检查横、竖和两条对角线。只补一颗，已有白子不能算成黑子。', grid(board.map((n, k) => n || String(k + 1)), 3), ['横、竖或对角线，三颗黑子连成一条直线。', '把所有能达成的空格都找出来。']); })),
    set('L12', '小岛连桥', nine((i, s, v) => { const count = s === 2 ? 6 : 4; const nodes = Array.from({ length: count }, (_, k) => ({ id: `n${k}`, label: String.fromCharCode(65 + k), x: count === 4 ? [130, 470, 470, 130][k] : [90, 300, 510, 510, 300, 90][k], y: count === 4 ? [65, 65, 235, 235][k] : [65, 65, 65, 235, 235, 235][k], degree: 0 })); const edges = nodes.map((n, k) => ({ id: `e${k}`, from: n.id, to: nodes[(k + 1) % count].id, max: 2, fixed: s === 0 && k < 2 ? 1 : s === 1 && k === v ? 1 : 0 })); if (count === 6)
        edges.push({ id: 'middle', from: 'n1', to: 'n4', max: 2, fixed: 0 }); const counts = Object.fromEntries(edges.map((e, k) => [e.id, k === v ? 2 : e.id === 'middle' ? 0 : 1])); for (const e of edges) {
        nodes.find(n => n.id === e.from)!.degree += counts[e.id];
        nodes.find(n => n.id === e.to)!.degree += counts[e.id];
    } const a: Activity = { ...base('L12', i, '把所有小岛连起来。', '直接点两个小岛之间的线来搭桥，再点可以改变桥数。每处最多两座桥。', '每个岛连出的桥数和数字相同，所有小岛也连成了一个整体。'), kind: 'network', graph: { nodes, edges }, connected: true }; a.clues = ['数字表示这个岛连出的桥数。', '桥不能交叉，所有岛要互相通达。']; authoringSolutions[a.id] = { kind: 'network', counts }; return a; })),
];
