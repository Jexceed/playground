import type { Activity, ActivityBase, ActivitySet, ActivityToken, ActivityResponse } from "../../domain/activity";
import type { Drawing } from "./draw";
import { image, label } from "./draw";
import { families } from "./families";
export type FamilyId = keyof typeof families;
export const authoringSolutions: Record<string, ActivityResponse> = {};
export const authoringNotes: Record<string, {
    reason: string;
    oracle?: {
        operation: string;
        values: number[];
        answer: number;
    };
}> = {};
export function base(family: FamilyId, index: number, prompt: string, instruction: string, reason: string): ActivityBase {
    const f = families[family], stage = (Math.floor(index / 3) + 1) as 1 | 2 | 3;
    const id = `explore-${f.slug}-${index + 1}`;
    authoringNotes[id] = { reason };
    return { id, schemaVersion: 1, revision: 1, primaryFamilyId: family, level: stage === 1 ? 'L2' : stage === 2 ? 'L3' : 'L4', stage,
        difficultyNote: f.stages[stage - 1] ?? f.stages[0], prerequisites: stage === 1 ? '可以先和家长一起试' : stage === 2 ? '先熟悉前面的玩法' : '把前面学到的线索合起来',
        prompt, instruction, clues: [], tokens: [],
        hints: ['先指一指题目里已经知道的线索。', '把每个条件分开试一试，最后再一起检查。'], success: reason, retry: '再对照图和题目的条件，一步一步检查。',
        parentPrompt: '你先用了哪条线索？能换一种方法检查吗？', abilityTags: [f.title], protocol: { kind: 'practice' }, sourceRefs: f.refs.map(r => ({ ...r })) };
}
export function card(id: string, value: string | number, drawing?: Drawing): ActivityToken { return { id, label: String(value), speechText: ({ "○": "圆形", "□": "方形", "△": "三角形" } as Record<string, string>)[String(value)], image: image(drawing ?? label(value), String(value)), textOnly: !drawing }; }
export function rotate<T>(values: T[], shift: number): T[] { const n = shift % values.length; return [...values.slice(n), ...values.slice(0, n)]; }
/** Stable across runtimes/reloads, without a shared question-number answer-position cycle. */
export function stableChoiceOrder<T>(values: T[], key: string): T[] {
    const result = [...values];
    let seed = 2166136261;
    for (let i = 0; i < key.length; i++) seed = Math.imul(seed ^ key.charCodeAt(i), 16777619);
    for (let i = result.length - 1; i > 0; i--) {
        seed ^= seed << 13; seed ^= seed >>> 17; seed ^= seed << 5;
        const j = (seed >>> 0) % (i + 1);
        [result[i], result[j]] = [result[j], result[i]];
    }
    return result;
}
export function labelDisplayedChoices(tokens: ActivityToken[]): ActivityToken[] {
    const marker = /^(图|方案|搭法|选项)([A-Za-z]|\d+)$/;
    if (!tokens.every(t => marker.test(t.label))) return tokens;
    return tokens.map((token, index) => {
        const [, prefix, suffix] = token.label.match(marker)!;
        const label = prefix + (/^\d+$/.test(suffix) ? index + 1 : String.fromCharCode(65 + index));
        return { ...token, label, image: { ...token.image, alt: label } };
    });
}
export function choice(family: FamilyId, index: number, prompt: string, options: (string | number | {
    label: string;
    drawing: Drawing;
})[], answerIndex: number, reason: string, illustration?: Drawing, clues: string[] = []): Activity {
    const a = { ...base(family, index, prompt, '选出符合条件的一张图卡。', reason), kind: 'singleChoice' as const,
        tokens: labelDisplayedChoices(stableChoiceOrder(options.map((o, j) => typeof o === 'object' ? card(`o${j}`, o.label, o.drawing) : card(`o${j}`, o)), `${family}:choice:${index}`)), answerId: `o${answerIndex}`, clues,
        illustration: illustration ? image(illustration, prompt) : undefined };
    a.hints = [clues[0] ?? '先找到图里和问题有关的部分。', reason];
    authoringSolutions[a.id] = { kind: 'singleChoice', tokenId: a.answerId };
    return a;
}
export function numeric(family: FamilyId, index: number, prompt: string, answer: number, distractors: number[], reason: string, illustration: Drawing, oracle?: {
    operation: string;
    values: number[];
}, clues: string[] = []): Activity {
    const options = [answer, ...distractors.filter((n, i, a) => n !== answer && a.indexOf(n) === i)];
    for (let n = answer + 1; options.length < 3; n++)
        if (!options.includes(n))
            options.push(n);
    const a = choice(family, index, prompt, options.slice(0, 4), 0, reason, illustration, clues);
    if (oracle)
        authoringNotes[a.id].oracle = { ...oracle, answer };
    return a;
}
export function selection(family: FamilyId, index: number, prompt: string, tokens: ActivityToken[], expected: string[], reason: string, illustration?: Drawing, clues: string[] = []): Activity {
    const a = { ...base(family, index, prompt, '把所有符合条件的图卡选出来，再检查一次。', reason), kind: 'multiSelect' as const, tokens, expectedTokenIds: expected, clues, illustration: illustration ? image(illustration, prompt) : undefined };
    a.hints = [clues[0] ?? '先按一个条件逐张比较。', reason];
    authoringSolutions[a.id] = { kind: 'multiSelect', tokenIds: expected };
    return a;
}
export function ordered(family: FamilyId, index: number, prompt: string, tokens: ActivityToken[], sequence: string[], reason: string, clues: string[] = [], illustration?: Drawing): Activity {
    const a = { ...base(family, index, prompt, '先选图卡，再按位置编号排好。也可以拖过去。', reason), kind: 'orderedPlacement' as const, tokens: rotate(tokens, index + 1), slotCount: sequence.length, tokenUse: 'once' as const, evaluation: { kind: 'sequence' as const, tokenIds: sequence }, clues, illustration: illustration ? image(illustration, prompt) : undefined };
    a.hints = [clues[0] ?? '先找可以确定的第一个位置。', reason];
    authoringSolutions[a.id] = { kind: 'orderedPlacement', slots: sequence.map(tokenId => ({ state: 'filled', tokenId })) };
    return a;
}
export function fillGrid(family: FamilyId, index: number, prompt: string, tokens: ActivityToken[], columns: number, solution: string[], blanks: number[], reason: string, clues: string[] = [], illustration?: Drawing): Activity {
    const answers = Object.fromEntries(blanks.map(i => [`cell-${i}`, solution[i]]));
    const a = { ...base(family, index, prompt, '选图卡，点问号格放进去。图卡可以重复用。', reason), kind: 'gridPlacement' as const, tokens: rotate(tokens, index + 1), columns, cells: solution.map((id, i) => blanks.includes(i) ? null : id), tokenUse: 'unlimited' as const, evaluation: { kind: 'exact' as const, cells: answers }, clues, illustration: illustration ? image(illustration, prompt) : undefined };
    a.hints = [clues[0] ?? '先找一个线索最多的空位。', reason];
    authoringSolutions[a.id] = { kind: 'gridPlacement', cells: Object.fromEntries(Object.entries(answers).map(([id, tokenId]) => [id, { state: 'filled', tokenId }])) };
    return a;
}
export function matching(family: FamilyId, index: number, prompt: string, left: ActivityToken[], right: ActivityToken[], pairs: [
    string,
    string
][], reason: string, illustration?: Drawing): Activity {
    const a = { ...base(family, index, prompt, '把两边有关的图卡连起来。可以拖过去，也可以两边各点一下。', reason), kind: 'matching' as const, tokens: [...left, ...right], leftIds: left.map(t => t.id), rightIds: stableChoiceOrder(right, `${family}:matching:${index}`).map(t => t.id), expectedPairs: pairs, illustration: illustration ? image(illustration, prompt) : undefined };
    a.hints = ['先说说左边这张图卡的特点，再找对应关系。', reason];
    authoringSolutions[a.id] = { kind: 'matching', pairs };
    return a;
}
export function parent(family: FamilyId, index: number, prompt: string, materials: string[], steps: string[], observations: string[], illustration?: Drawing): Activity {
    const a = { ...base(family, index, prompt, '和家长一起操作、说一说，再记录这次的发现。', '这次亲子活动已经记录。下次可以换个条件再试试。'), kind: 'parentObservation' as const, materials, steps, observations: observations.map((text, i) => ({ id: `observe-${i}`, text })), illustration: illustration ? image(illustration, prompt) : undefined };
    a.hints = [steps[0], steps[Math.min(1, steps.length - 1)]];
    a.parentPrompt = observations.join('；');
    authoringSolutions[a.id] = { kind: 'parentObservation', observations: Object.fromEntries(a.observations.map(o => [o.id, 'supported' as const])) };
    return a;
}
export const nine = (make: (index: number, stage: number, variant: number) => Activity) => Array.from({ length: 9 }, (_, i) => make(i, Math.floor(i / 3), i % 3));
export const three = (make: (index: number) => Activity) => Array.from({ length: 3 }, (_, i) => make(i));
export function set(family: FamilyId, title: string, rounds: Activity[]): ActivitySet {
    const f = families[family];
    return { id: `explore-${f.slug}`, kind: 'activitySet', world: f.world, title, subtitle: f.title, goal: f.stages.join(' → '), parentPrompt: '先让孩子操作和解释，再按需要给一点提示。', abilityTags: [f.title], level: 'L3', rounds, interactionLabel: f.targetCount === 3 ? '亲子活动' : '探索练习' };
}
