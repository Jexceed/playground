import { set, nine, choice, selection, ordered, fillGrid, matching, parent, card, stableChoiceOrder } from './helpers';
import { picture, text, rect, circle, grid, dots, symbol, palette } from './draw';
import { tokens as familiar } from '../pilot/tokens';
import { soundSequence } from './sounds';
import type { Activity } from '../../domain/activity';
const objects = familiar('rabbit', 'cat', 'bear', 'dog', 'apple', 'orange', 'cookie', 'strawberry');
const memory = (a: Activity, preview: string[], audioText?: string, soundSrc?: string) => {
    a.protocol = { kind: 'memory', observeMs: 8000 + (a.stage ?? 1) * 2000, retainMs: 1000 + (a.stage ?? 1) * 500, preview, audioText, soundSrc };
    return a;
};
export const memorySets = [
    set('A01', '看过哪些朋友', nine((i, s, v) => { const ts = [...objects.slice(v), ...objects.slice(0, v)], seen = ts.slice(0, 3 + s).map(t => t.id), pool = stableChoiceOrder([...objects], `A01:pool:${i}`); return memory(selection('A01', i, s === 2 ? '把刚才没有出现的图卡都选出来。' : '把刚才出现过的图卡都选出来。', pool, s === 2 ? objects.filter(t => !seen.includes(t.id)).map(t => t.id) : seen, '先回忆看到的集合，再逐张对照。顺序不同不影响有没有出现。'), seen); })),
    set('A02', '位置藏起来', nine((i, s, v) => { const itemCount = s === 2 ? 5 : 4; const ts = [...objects.slice(0, itemCount), card('blank', '空白', grid([''], 1))]; const n = s === 0 ? 4 : s === 1 ? 6 : 9; const blanks = s === 2 ? [(v + 1) % n, (v + 5) % n] : [(v + s) % n]; const seq = Array.from({ length: n }, (_, k) => blanks.includes(k) ? 'blank' : ts[(k + v) % itemCount].id); const a = fillGrid('A02', i, '记住每个位置，再把图案摆回来。原本空着的位置也要放空白卡。', ts, s === 0 ? 2 : 3, seq, seq.map((_, k) => k), '物品和位置都要对应。原本空着的位置，也要用空白卡表示。'); return memory(a, seq); })),
    set('A03', '顺着记倒着摆', nine((i, s, v) => { const n = 3 + s, poolSize = s === 2 ? 6 : 5, seq = Array.from({ length: n }, (_, k) => objects[(k + (s === 1 ? k % 2 : 0) + v) % poolSize].id); const a = ordered('A03', i, s === 2 ? '记住以后，倒着摆回来。' : '记住图卡的先后，按原来的顺序摆回来。', objects.slice(0, poolSize), s === 2 ? [...seq].reverse() : seq, s === 2 ? '倒着回忆，从最后一张开始。' : '顺序和重复出现的图卡都要记住。'); if (a.kind === 'orderedPlacement')
        a.tokenUse = 'unlimited'; return memory(a, seq); })),
    set('A04', '听懂再行动', nine((i, s, v) => { const seq = Array.from({ length: 2 + s }, (_, k) => objects[(k + v + s) % 5].id); const a = ordered('A04', i, '听完指令，再按要求摆图卡。', objects.slice(0, 5), seq, '按听到的次序执行，每一步都不能漏。'); if (a.kind === 'orderedPlacement')
        a.tokenUse = 'unlimited'; const names = seq.map(id => objects.find(t => t.id === id)!.label); return memory(a, [], `从左到右，${names.map((n, k) => `${k === 0 ? '先' : k === names.length - 1 ? '最后' : '然后'}放${n}`).join('，')}。`); })),
    set('A05', '故事留在脑海里', nine((i, s, v) => { const stories = [{ audio: '早上，小兔带着苹果去找小猫。路上小兔看见下雨，就在树下等了一会儿。雨停后，小兔把苹果分给了小猫。', who: '小兔', actions: ['带苹果出门', '在树下等雨停', '和小猫分苹果'] }, { audio: '小熊想搭一座桥，先找来木板。小狗帮忙扶住一头，小熊放好另一头。桥搭好以后，他们一起走过去。', who: '小熊', actions: ['找来木板', '合作放好木板', '走过小桥'] }, { audio: '小猫想种花，先把种子放进土里。小猫记得给土浇水。过了一段时间，小苗长出来了，小猫把这个发现告诉小兔。', who: '小猫', actions: ['把种子放进土里', '给土浇水', '告诉小兔发芽了'] }]; const story = stories[v]; let a: Activity; if (s === 0)
        a = choice('A05', i, '听过故事以后，回答：故事最先说的是谁？', objects.slice(0, 4).map(t => ({ label: t.label, drawing: picture([text(160, 160, t.label, 55)], 320, 320) })), objects.slice(0, 4).findIndex(t => t.label === story.who), `故事最先说的是${story.who}。回忆开头，和后来出现的人物区分开。`);
    else if (s === 1)
        a = ordered('A05', i, '听完故事，把三件事按先后排好。', story.actions.map((t, k) => card(`e${k}`, t)), ['e0', 'e1', 'e2'], '先说发生了什么，再说接下来发生了什么。');
    else
        a = parent('A05', i, '把刚才的故事讲给家长听。', [], ['听完以后，先说故事里有哪些角色。', '按先后说三件关键的事。', '再说一说其中一件事为什么发生。'], ['记住主要角色', '关键事件顺序清楚', '能区分故事事实和自己的猜想']); return memory(a, [], story.audio); })),
    set('A06', '细心搜索员', nine((i, s, v) => {
        const count = 9 + s * 6;
        const shapes = ['圆形', '方形', '三角形'];
        const features = Array.from({length: count}, (_, k) => ({ shape: (k + v) % 3, color: Math.floor(k / 3) % 3 }));
        const board = stableChoiceOrder(features, `A06:board:${i}`);
        const cards = board.map(({shape, color}, k) => card(`c${k}`, `第${k + 1}张`, symbol(shape, color)));
        const matches = board.flatMap(({shape, color}, k) => {
            const sameShape = shape === v;
            const keep = s === 2 ? color === 2 && !sameShape : sameShape && (s === 0 || color === 1);
            return keep ? [cards[k].id] : [];
        });
        const prompt = s === 0 ? `找出所有${shapes[v]}。` : s === 1 ? `找出所有蓝色${shapes[v]}。` : `这次换规则：选黄色图卡，但跳过${shapes[v]}。`;
        const a = selection('A06', i, prompt, cards, matches, '一行一行检查，选过的再对照规则看一次。这里不比谁快。');
        a.revision = 2;
        return a;
    })),
    set('A07', '记规则再出手', nine((i, s, v) => { const shapes = ['圆形', '方形', '三角形'], raw = Array.from({ length: 9 }, (_, k) => card(`t${k}`, `${['红', '蓝', '黄'][Math.floor(k / 3)]}色${shapes[k % 3]}`, symbol(k % 3, Math.floor(k / 3)))); const expected = raw.flatMap((t, k) => (s === 0 ? k % 3 === v : s === 1 ? k % 3 === (v + 1) % 3 : Math.floor(k / 3) === v && k % 3 !== (v + 1) % 3) ? [t.id] : []); const ts = stableChoiceOrder(raw, `A07:${i}`); const cue = s === 0 ? `这次只选${shapes[v]}，其他形状先不动。` : s === 1 ? `原来选${shapes[v]}。现在换规则，只选${shapes[(v + 1) % 3]}。要按新的规则做。` : `先记住颜色是${['红', '蓝', '黄'][v]}色。但如果看到${shapes[(v + 1) % 3]}，就不能选。`; return memory(selection('A07', i, '听清这次的规则，再选择图卡。', ts, expected, '先回忆这次有效的规则，再检查有没有需要停手的情况。'), [], cue); })),
    set('A08', '声音排队', nine((i, s, v) => { if (s === 2 && v === 2) {
        const a = parent('A08', i, '听完节奏，用拍手把它模仿出来。', ['双手'], ['听完声音以后，用拍手或轻拍膝盖表示长短节奏。', '请家长比较先后、长短和停顿，不要求音色一样。', '交换角色，孩子编一个节奏，家长来模仿。'], ['能保持主要先后顺序', '能区分长短或停顿', '能自己编一个可重复的节奏']);
        return memory(a, [], undefined, soundSequence('rhythm-parent', [0, 1, 1, 0]));
    } const softArt = picture([rect(52, 92, 216, 44, palette[1]), text(160, 218, '长—', 52)], 320, 320); const brightArt = picture([{ kind: 'polygon', points: [[160, 56], [178, 102], [228, 106], [190, 138], [202, 186], [160, 160], [118, 186], [130, 138], [92, 106], [142, 102]], fill: palette[2] }, circle(160, 124, 14, palette[0]), text(160, 236, '短·', 52)], 320, 320); const ts = [card('soft', '柔和长音', softArt), card('bright', '清脆短音', brightArt)]; ts[0].soundSrc = soundSequence('soft-example', [0]); ts[1].soundSrc = soundSequence('bright-example', [1]); const rhythms = [[0, 1], [1, 0], [0, 1, 1], [0, 1, 0], [1, 0, 1], [0, 0, 1], [0, 1, 1, 0], [1, 0, 1, 0]]; const seq = rhythms[i]; const a = ordered('A08', i, '听声音的先后，再把声音卡排回来。', ts, seq.map(n => n ? 'bright' : 'soft'), '长短和音色都能帮助记住顺序。可以点声音卡再听它的声音。'); if (a.kind === 'orderedPlacement')
        a.tokenUse = 'unlimited'; return memory(a, [], undefined, soundSequence(`sequence-${i + 1}`, seq)); })),
    set('A09', '谁有几个', nine((i, s, v) => {
        const ranks = [
            [1, 0], [0, 1], [1, 0],
            [1, 0, 2], [2, 1, 0], [0, 2, 1],
            [2, 0, 3, 1], [0, 3, 1, 2], [1, 2, 0, 3],
        ][i];
        const friends = objects.slice(0, 2 + s);
        const quantities = friends.map((_, k) => card(`number${k}`, 2 + v + k, dots(2 + v + k)));
        const pairs: [string, string][] = friends.map((friend, k) => [friend.id, quantities[ranks[k]].id]);
        const a = matching('A09', i, '记住每位朋友的数量，再把朋友和数量配对。', friends, quantities, pairs, '想想每位朋友身边有几个圆片，再检查你连的数量。');
        const preview = friends.map((friend, k) => {
            const count = Number(quantities[ranks[k]].label);
            return {
                id: `preview${k}`, label: `${friend.label}有${count}个`, image: friend.image,
                quantityPicture: { image: friend.image, count },
            };
        });
        a.tokens.push(...preview);
        a.revision = 2;
        return memory(a, preview.map(t => t.id));
    })),
];
for (const group of memorySets)
    for (const a of group.rounds)
        if (a.primaryFamilyId === 'A05' && a.stage === 1)
            a.tokens.forEach(t => { t.image = objects[Number(t.id.slice(1))].image; });
