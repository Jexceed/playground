import { set, nine, three, choice, ordered, matching, parent, card } from './helpers';
import { picture, text, rect, circle, line, grid, dots, symbol, panels, palette } from './draw';
import { tokens as familiar } from '../pilot/tokens';
import type { Activity } from '../../domain/activity';
const listen = (a: Activity, audioText: string, locale: 'zh-CN' | 'en-US' = 'zh-CN') => { a.protocol = { kind: 'memory', observeMs: 10000, retainMs: 500, preview: [], audioText, audioLocale: locale }; return a; };
const position = (above: boolean, n: number) => picture([...dots(n, n).objects.map(o => o.kind === 'circle' ? { ...o, y: above ? 90 : 235 } : o), rect(105, above ? 190 : 50, 110, 75, palette[0])], 320, 320);
export const languageSets = [
    set('E01', '词语有朋友', nine((i, s, v) => { const pairs = [['高', '低'], ['开', '关'], ['上', '下'], ['长', '短'], ['多', '少']]; if (s === 2)
        return parent('E01', i, ['用动作说开和关', '用实物说长和短', '同一个词换个情境'][v], ['两个盒子或两条纸带'], ['家长说一个词，孩子用动作或实物表示。', '交换角色，孩子说词，家长操作。', '把这个词放进一个完整句子，说明哪里看出来。'], ['能把词和实际意义对应', '能找到相反或相关的词', '能在新情境里使用这个词']); const chosen = pairs.slice(v, v + 2 + s); return matching('E01', i, '把意思相反的词配成朋友。', chosen.map(([a], k) => card(`a${k}`, a)), chosen.map(([, b], k) => card(`b${k}`, b)), chosen.map((_, k) => [`a${k}`, `b${k}`]), '可以先做一个动作或摆出实物，再比较两个词的意思。'); })),
    set('E02', '把位置说清楚', three(i => parent('E02', i, ['给家长指路', '换个位置描述', '比较两种说法'][i], ['小玩具', '杯子', '盒子'], i === 0 ? ['把玩具放在盒子旁边，用完整句子告诉家长在哪里。', '家长只听你的话寻找玩具。', '加入一个更清楚的参照物，再说一遍。'] : i === 1 ? ['家长和孩子面对面坐，放好玩具和杯子。', '分别从自己的方向说玩具在杯子的哪边。', '换到同一方向，再比较说法为什么改变。'] : ['家长先说“那个在那里”。', '孩子指出这句话缺少哪些信息。', '补充对象、参照物和位置，让另一个人可以找到。'], ['说清对象', '说清参照物和关系', '能根据听者的疑问补充信息']))),
    set('E03', '故事接起来', nine((i, s, v) => { const stories = [['天上积起乌云', '开始下雨', '地面留下水洼', '小朋友穿雨靴出门'], ['小熊准备木块', '小熊搭起高塔', '球碰倒了高塔', '小熊换宽底座重搭'], ['小猫收到种子', '把种子种进土里', '按记录照顾小苗', '小猫观察新叶片']]; if (s === 2)
        return parent('E03', i, '先讲清故事，再想一个不同的结局。', ['四张写着事件的卡片'], [...stories[v].map((t, k) => `第${k + 1}张：${t}。`), '按原先顺序复述一次。', '改变最后一件事，再解释为什么也说得通。'], ['事件先后清楚', '能用因为或所以连接理由', '不同结局和前面的事情有关']); const seq = stories[v].slice(0, 3 + s); return ordered('E03', i, '按这个故事的先后，把事件排好。', seq.map((t, k) => card(`e${k}`, t)), seq.map((_, k) => `e${k}`), '按题目给定的事件关系连接，再用自己的话讲出来。', seq.slice(1).map((t, k) => `${seq[k]}以后，才${t}。`)); })),
    set('E04', '我的解释和办法', three(i => parent('E04', i, ['给图卡编故事', '比较两个办法', '证据够不够'][i], ['三张喜欢的图卡', '纸和笔'], i === 0 ? ['选三张图卡，说出角色和地点。', '讲一件把三张图卡连起来的事。', '家长改变其中一张，孩子调整故事使它仍然连贯。'] : i === 1 ? ['用积木想两种让玩具过河的办法。', '分别说需要哪些材料，哪里可能失败。', '选一种试做，再用观察到的结果解释选择。'] : ['家长说“地上有水，所以一定是小狗打翻了杯子”。', '孩子找出这句话里哪些是看到的，哪些是猜的。', '提出另一种可能，并说还想看什么线索。'], ['观点能和线索对应', '能说明一个理由', '能接受或提出另一种合理解释']))),
    set('E05', '字音小花园', nine((i, s, v) => { const chars = [['木', '本', '未'], ['日', '目', '田'], ['人', '入', '大']]; if (s === 0)
        return choice('E05', i, '哪张字卡和上面的字完全一样？', chars[v], 0, '看清每一笔的位置，不能只看整体有点像。', picture([text(160, 175, chars[v][0], 100)], 320, 320)); if (s === 1) {
        const words = ['妈妈', '小猫', '大米'], answers = [['妈', '马', '木'], ['猫', '苗', '毛'], ['米', '木', '来']];
        return listen(choice('E05', i, '听词语，选出其中要找的字。', answers[v], 0, `这次听到的词语是${words[v]}，要找的是${answers[v][0]}。`), `${words[v]}。请找${answers[v][0]}。`);
    } const pairs = [[['妈', 'mā'], ['马', 'mǎ'], ['米', 'mǐ']], [['八', 'bā'], ['爸', 'bà'], ['比', 'bǐ']], [['大', 'dà'], ['打', 'dǎ'], ['地', 'dì']]][v]; return matching('E05', i, '根据对照表，把汉字和拼音配起来。', pairs.map(([a], k) => card(`h${k}`, a)), pairs.map(([, b], k) => card(`p${k}`, b)), pairs.map((_, k) => [`h${k}`, `p${k}`]), '字母和声调都要核对。识读不熟时，可以先由家长带着看对照表。', grid(pairs.map(([a, b]) => `${a} ${b}`), 3)); })),
    set('E06', '英语听一听', nine((i, s, v) => { const animals = familiar('rabbit', 'cat', 'dog'); if (s === 0)
        return listen(choice('E06', i, '听英语，选出对应的小动物。', animals.map(t => ({ label: t.label, drawing: picture([text(160, 160, t.label, 50)], 320, 320) })), v, '把听到的英语词和对应的小动物连起来。'), ['rabbit', 'cat', 'dog'][v], 'en-US'); if (s === 1) {
        const shapes = ['circle', 'square', 'triangle'], colors = ['red', 'blue', 'yellow'];
        return listen(choice('E06', i, '听英语短句，把颜色和形状都对上。', [{ label: '图1', drawing: symbol(v, v) }, { label: '图2', drawing: symbol((v + 1) % 3, v) }, { label: '图3', drawing: symbol(v, (v + 1) % 3) }], 0, '要同时听到颜色和形状，不能只对上一项。'), `Choose the ${colors[v]} ${shapes[v]}.`, 'en-US');
    } const correct = panels([{ title: '', drawing: symbol(v, 0) }, { title: '', drawing: symbol((v + 1) % 3, 1) }]); return listen(choice('E06', i, '听英语，找到位置关系相符的图。', [{ label: '图A', drawing: correct }, { label: '图B', drawing: panels([{ title: '', drawing: symbol((v + 1) % 3, 1) }, { title: '', drawing: symbol(v, 0) }]) }, { label: '图C', drawing: panels([{ title: '', drawing: symbol(v, 1) }, { title: '', drawing: symbol((v + 1) % 3, 0) }]) }], 0, '两个对象、颜色和左右关系都要对应。'), `The red ${['circle', 'square', 'triangle'][v]} is on the left of the blue ${['circle', 'square', 'triangle'][(v + 1) % 3]}.`, 'en-US'); })),
    set('E07', '英语里的数量位置', nine((i, s, v) => { if (s === 0)
        return listen(choice('E07', i, '听英语，选择相同数量的图。', [1, 2, 3].map(n => ({ label: `图${n}`, drawing: dots(n) })), v, '数量对应以后，再指着图卡核对一次。'), `There ${v === 0 ? 'is one circle' : `are ${['one', 'two', 'three'][v]} circles`}.`, 'en-US'); const n = v + 1; if (s === 1)
        return listen(choice('E07', i, '听英语，找出对象和位置都对应的图。', [{ label: '图A', drawing: position(true, n) }, { label: '图B', drawing: position(false, n) }, { label: '图C', drawing: position(true, n + 1) }], 0, '听清数量，再听对象在上面还是下面。'), `There ${n === 1 ? 'is one circle' : `are ${['', 'one', 'two', 'three'][n]} circles`} above the red square.`, 'en-US'); const lengths = [80 + v * 20, 145 + v * 20, 210 + v * 20]; const art = (order: number[]) => picture(order.map((k, j) => rect(45, 40 + j * 90, lengths[k], 36, palette[j])), 320, 320); return listen(choice('E07', i, '听英语比较，选出符合所有关系的图。', [{ label: '图A', drawing: art([2, 1, 0]) }, { label: '图B', drawing: art([0, 1, 2]) }, { label: '图C', drawing: art([1, 2, 0]) }], 0, '要让红条比蓝条长，蓝条又比黄条长，两条比较都成立。'), `The red bar is longer than the blue bar. The blue bar is longer than the yellow bar.`, 'en-US'); })),
    set('E08', '把自己的想法说出来', three(i => parent('E08', i, ['说明一个选择', '回答追问', '轮流问和听'][i], ['两件孩子熟悉的玩具'], i === 0 ? ['从两件玩具里选一件。', '说清楚选的是什么、想怎样玩。', '家长追问一个原因，孩子补充说明。'] : i === 1 ? ['描述一次想再去的活动，不必说姓名或住址。', '家长问“那里有什么吸引你”。', '孩子用具体经历回答，再补充一个细节。'] : ['家长先描述自己喜欢的一种玩法。', '孩子听完后问一个和内容有关的问题。', '交换角色，练习等对方说完再回答。'], ['回应的问题和话题相关', '能说出具体原因或细节', '能听完追问再补充']))),
];
// Listen-and-identify uses pictures, not written translations as the answer surface.
for (const group of languageSets)
    for (const a of group.rounds) {
        if (a.primaryFamilyId === 'E06' && a.stage === 1) {
            const animals = familiar('rabbit', 'cat', 'dog');
            a.tokens.forEach(t => { t.image = animals[Number(t.id.slice(1))].image; });
        }
        if (a.primaryFamilyId === 'E05' && a.kind === 'matching')
            for (const [left, right] of a.expectedPairs) {
                a.tokens.find(t => t.id === right)!.speechText = a.tokens.find(t => t.id === left)!.label;
            }
    }
