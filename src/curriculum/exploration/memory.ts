import { set, nine, choice, selection, ordered, fillGrid, matching, parent, card } from './helpers';
import { picture, text, grid, dots, symbol, panels, palette } from './draw';
import { tokens as familiar } from '../pilot/tokens';
import { soundSequence } from './sounds';
import type { Activity } from '../../domain/activity';
const objects = familiar('rabbit', 'cat', 'bear', 'dog', 'apple', 'orange', 'cookie', 'strawberry');
const memory = (a: Activity, preview: string[], audioText?: string, soundSrc?: string) => {
    a.protocol = { kind: 'memory', observeMs: 8000 + (a.stage ?? 1) * 2000, retainMs: 1000 + (a.stage ?? 1) * 500, preview, audioText, soundSrc };
    if (a.difficulty)
        a.difficulty.memory = preview.length || a.stage || 1;
    return a;
};
export const memorySets = [
    set('A01', '看过哪些朋友', nine((i, s, v) => { const ts = [...objects.slice(v), ...objects.slice(0, v)], seen = ts.slice(0, 3 + s).map(t => t.id); return memory(selection('A01', i, s === 2 ? '把刚才没有出现的图卡都选出来。' : '把刚才出现过的图卡都选出来。', [...objects], s === 2 ? objects.filter(t => !seen.includes(t.id)).map(t => t.id) : seen, '先回忆看到的集合，再逐张对照。顺序不同不影响有没有出现。'), seen); })),
    set('A02', '位置藏起来', nine((i, s, v) => { const ts = [...objects.slice(0, 4), card('blank', '空白', grid([''], 1))]; const n = s === 0 ? 4 : 6, seq = Array.from({ length: n }, (_, k) => k === (v + s) % n ? 'blank' : ts[(k + v) % 4].id); const a = fillGrid('A02', i, '记住每个位置，再把图案摆回来。', ts, s === 0 ? 2 : 3, seq, seq.map((_, k) => k), '物品和位置都要对应。原本空着的位置，也要用空白卡表示。'); return memory(a, seq); })),
    set('A03', '顺着记倒着摆', nine((i, s, v) => { const n = 3 + s, seq = Array.from({ length: n }, (_, k) => objects[(k + (s === 1 ? k % 2 : 0) + v) % 5].id); const a = ordered('A03', i, s === 2 ? '记住以后，倒着摆回来。' : '记住图卡的先后，按原来的顺序摆回来。', objects.slice(0, 5), s === 2 ? [...seq].reverse() : seq, s === 2 ? '倒着回忆，从最后一张开始。' : '顺序和重复出现的图卡都要记住。'); if (a.kind === 'orderedPlacement')
        a.tokenUse = 'unlimited'; return memory(a, seq); })),
    set('A04', '听懂再行动', nine((i, s, v) => { const seq = Array.from({ length: 2 + s }, (_, k) => objects[(k + v + s) % 5].id); const a = ordered('A04', i, '听完指令，再按要求摆图卡。', objects.slice(0, 5), seq, '按听到的次序执行，每一步都不能漏。'); if (a.kind === 'orderedPlacement')
        a.tokenUse = 'unlimited'; const names = seq.map(id => objects.find(t => t.id === id)!.label); return memory(a, [], `从左到右，${names.map((n, k) => `${k === 0 ? '先' : k === names.length - 1 ? '最后' : '然后'}放${n}`).join('，')}。`); })),
    set('A05', '故事留在脑海里', nine((i, s, v) => { const stories = [{ audio: '早上，小兔带着苹果去找小猫。路上小兔看见下雨，就在树下等了一会儿。雨停后，小兔把苹果分给了小猫。', who: '小兔', actions: ['带苹果出门', '在树下等雨停', '和小猫分苹果'] }, { audio: '小熊想搭一座桥，先找来木板。小狗帮忙扶住一头，小熊放好另一头。桥搭好以后，他们一起走过去。', who: '小熊', actions: ['找来木板', '合作放好木板', '走过小桥'] }, { audio: '小猫想种花，先把种子放进土里。小猫记得给土浇水。过了一段时间，小苗长出来了，小猫把这个发现告诉小兔。', who: '小猫', actions: ['把种子放进土里', '给土浇水', '告诉小兔发芽了'] }]; const story = stories[v]; let a: Activity; if (s === 0)
        a = choice('A05', i, '听过故事以后，回答：故事最先说的是谁？', objects.slice(0, 4).map(t => ({ label: t.label, drawing: picture([text(160, 160, t.label, 55)], 320, 320) })), objects.slice(0, 4).findIndex(t => t.label === story.who), `故事最先说的是${story.who}。回忆开头，和后来出现的人物区分开。`);
    else if (s === 1)
        a = ordered('A05', i, '听完故事，把三件事按先后排好。', story.actions.map((t, k) => card(`e${k}`, t)), ['e0', 'e1', 'e2'], '先说发生了什么，再说接下来发生了什么。');
    else
        a = parent('A05', i, '把刚才的故事讲给家长听。', [], ['听完以后，先说故事里有哪些角色。', '按先后说三件关键的事。', '再说一说其中一件事为什么发生。'], ['记住主要角色', '关键事件顺序清楚', '能区分故事事实和自己的猜想']); return memory(a, [], story.audio); })),
    set('A06', '细心搜索员', nine((i, s, v) => { const n = 9 + s * 6, ts = Array.from({ length: n }, (_, k) => card(`c${k}`, `第${k + 1}张`, symbol((k + v) % 3, Math.floor(k / 3) % 3))); const expected = ts.flatMap((t, k) => (s === 0 ? (k + v) % 3 === v : s === 1 ? (k + v) % 3 === v && Math.floor(k / 3) % 3 === 1 : (k + v) % 3 !== v && Math.floor(k / 3) % 3 === 2) ? [t.id] : []); return selection('A06', i, s === 0 ? `找出所有${['圆形', '方形', '三角形'][v]}。` : s === 1 ? `找出所有蓝色${['圆形', '方形', '三角形'][v]}。` : `这次换规则：选黄色图卡，但跳过${['圆形', '方形', '三角形'][v]}。`, ts, expected, '一行一行检查，选过的再对照规则看一次。这里不比谁快。'); })),
    set('A07', '记规则再出手', nine((i, s, v) => { const shapes = ['圆形', '方形', '三角形'], ts = Array.from({ length: 9 }, (_, k) => card(`t${k}`, `${['红', '蓝', '黄'][Math.floor(k / 3)]}色${shapes[k % 3]}`, symbol(k % 3, Math.floor(k / 3)))); const expected = ts.flatMap((t, k) => (s === 0 ? k % 3 === v : s === 1 ? k % 3 === (v + 1) % 3 : Math.floor(k / 3) === v && k % 3 !== (v + 1) % 3) ? [t.id] : []); const cue = s === 0 ? `这次只选${shapes[v]}，其他形状先不动。` : s === 1 ? `原来选${shapes[v]}。现在换规则，只选${shapes[(v + 1) % 3]}。要按新的规则做。` : `先记住颜色是${['红', '蓝', '黄'][v]}色。但如果看到${shapes[(v + 1) % 3]}，就不能选。`; return memory(selection('A07', i, '听清这次的规则，再选择图卡。', ts, expected, '先回忆这次有效的规则，再检查有没有需要停手的情况。'), [], cue); })),
    set('A08', '声音排队', nine((i, s, v) => { if (s === 2 && v === 2) {
        const a = parent('A08', i, '听完节奏，用拍手把它模仿出来。', ['双手'], ['听完声音以后，用拍手或轻拍膝盖表示长短节奏。', '请家长比较先后、长短和停顿，不要求音色一样。', '交换角色，孩子编一个节奏，家长来模仿。'], ['能保持主要先后顺序', '能区分长短或停顿', '能自己编一个可重复的节奏']);
        return memory(a, [], undefined, soundSequence('rhythm-parent', [0, 1, 1, 0]));
    } const ts = [card('soft', '柔和长音', picture([text(160, 165, '长—', 60)], 320, 320)), card('bright', '清脆短音', picture([text(160, 165, '短·', 60)], 320, 320))]; ts[0].soundSrc = soundSequence('soft-example', [0]); ts[1].soundSrc = soundSequence('bright-example', [1]); const seq = Array.from({ length: 2 + s }, (_, k) => (k + v + (v === 2 && k === 1 ? 1 : 0)) % 2); const a = ordered('A08', i, '听声音的先后，再把声音卡排回来。', ts, seq.map(n => n ? 'bright' : 'soft'), '长短和音色都能帮助记住顺序。可以点声音卡再听它的声音。'); if (a.kind === 'orderedPlacement')
        a.tokenUse = 'unlimited'; return memory(a, [], undefined, soundSequence(`sequence-${i + 1}`, seq)); })),
    set('A09', '谁有几个', nine((i, s, v) => { const n = 2 + s, left = objects.slice(0, n), right = Array.from({ length: n }, (_, k) => card(`number${k}`, k + 2 + v, dots(k + 2 + v))); const a = matching('A09', i, '记住每位朋友的数量，再把朋友和数量配对。', left, right, left.map((t, k) => [t.id, `number${k}`]), '这次回忆的是朋友和数量的关系，不只是认出朋友。'); const preview = left.map((t, k) => card(`preview${k}`, `${t.label}有${k + 2 + v}个`, panels([{ title: t.label, drawing: dots(k + 2 + v) }]))); a.tokens.push(...preview); return memory(a, preview.map(t => t.id)); })),
];
for (const group of memorySets)
    for (const a of group.rounds)
        if (a.primaryFamilyId === 'A05' && a.stage === 1)
            a.tokens.forEach(t => { t.image = objects[Number(t.id.slice(1))].image; });
