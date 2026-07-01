import type { AbilityLevel, GameConfig, GameRound, WorldId } from "../types";
import { imageGallery } from "./imageGallery";

type RoundInput = Omit<GameRound, "id"> & { id?: string };

type SetInput = Omit<GameConfig, "kind" | "rounds"> & {
  rounds: RoundInput[];
};

const foodTokens = ["🍓", "🍪", "🍎", "🍊"];
const toyTokens = ["🧱", "⭐", "🍬"];
const animalTokens = ["🐟", "🐦"];
const allCountTokens = [...foodTokens, ...toyTokens, ...animalTokens];
const countNames: Record<string, string> = {
  "🍓": "草莓",
  "🍪": "饼干",
  "🍎": "苹果",
  "🍊": "橘子",
  "🧱": "积木",
  "⭐": "星星",
  "🍬": "糖果",
  "🐟": "小鱼",
  "🐦": "小鸟",
};

const numberLabels = Array.from({ length: 12 }, (_, index) => String(index + 1));

export const games: GameConfig[] = [
  makeSet({
    id: "math-counting-cardinality",
    world: "math",
    title: "数一数",
    subtitle: "一边点图，一边数到最后，知道最后一个数就是总数。",
    goal: "建立一一对应、基数理解和 1-10 的数量感。",
    parentPrompt: "请她指着每一个物品数，问：最后数到几？所以一共有几个？",
    abilityTags: ["一一对应", "基数理解", "数数"],
    level: "L4",
    rounds: makeCountingRounds(),
  }),
  makeSet({
    id: "math-subitize-match",
    world: "math",
    title: "一眼看出来",
    subtitle: "看小圆点和小图案，练习不一个个数也能看出数量。",
    goal: "训练 2-6 的小数量辨认、数形连接和数量结构。",
    parentPrompt: "可以问：你是一眼看出来的，还是一个个数出来的？",
    abilityTags: ["小数量辨认", "数形配对", "数量结构"],
    level: "L4",
    rounds: makeSubitizeRounds(),
  }),
  makeSet({
    id: "math-compare-equalize",
    world: "math",
    title: "多一点，少一点",
    subtitle: "把两组东西对一对，看谁多、谁少、差几个。",
    goal: "理解多、少、一样多、多几个、少几个。",
    parentPrompt: "可以把物品一个对一个排起来，问：谁没有朋友配对？",
    abilityTags: ["比较数量", "一样多", "补齐"],
    level: "L5",
    rounds: makeCompareRounds(),
  }),
  makeSet({
    id: "math-compose-decompose",
    world: "math",
    title: "合起来，拆开来",
    subtitle: "把两小堆合成一堆，也把一个数拆成两部分。",
    goal: "建立数的合成分解，为加减法打底。",
    parentPrompt: "可以问：这一堆和那一堆合起来是几？还能怎么分？",
    abilityTags: ["合成分解", "数的结构", "接着数"],
    level: "L5",
    rounds: makeComposeRounds(),
  }),
  makeSet({
    id: "math-story-operations",
    world: "math",
    title: "来了，又走了",
    subtitle: "用小故事看懂变多和变少，不先背算式。",
    goal: "理解加法是变多，减法是拿走或变少。",
    parentPrompt: "请她复述：原来几个？发生了什么？现在几个？",
    abilityTags: ["加法理解", "减法理解", "变化推理"],
    level: "L5",
    rounds: makeOperationRounds(),
  }),
  makeSet({
    id: "math-fair-share",
    world: "math",
    title: "公平分一分",
    subtitle: "轮流分给每个人，看每份是不是一样多。",
    goal: "理解平均分、公平、每份一样多。",
    parentPrompt: "可以问：每个人是不是一样多？你怎么知道？",
    abilityTags: ["公平分配", "平均分", "早期除法直觉"],
    level: "L6",
    rounds: makeShareRounds(),
  }),
  makeSet({
    id: "math-group-counting",
    world: "math",
    title: "几个几个数",
    subtitle: "把一样多的小组放在一起，练习 2 个一组、3 个一组地数。",
    goal: "建立成组计数和早期乘法直觉。",
    parentPrompt: "可以问：每组几个？一共有几组？几个几个数到多少？",
    abilityTags: ["成组计数", "早期乘法直觉", "跳数"],
    level: "L5",
    rounds: makeGroupCountingRounds(),
  }),
  makeSet({
    id: "logic-pattern-train",
    world: "logic",
    title: "找规律火车",
    subtitle: "看一组一组怎么重复，猜下一个或补空位。",
    goal: "识别重复模式，预测下一个，补上缺失位置。",
    parentPrompt: "可以问：一组里有什么？它是不是一组一组重复？",
    abilityTags: ["模式识别", "预测", "规则表达"],
    level: "L5",
    rounds: makePatternRounds(),
  }),
  makeSet({
    id: "logic-sorter-switch",
    world: "logic",
    title: "会变规则的分类机",
    subtitle: "一会儿按颜色分，一会儿按形状分，也练习“不是”。",
    goal: "训练分类、规则切换和认知灵活性。",
    parentPrompt: "问她：刚才按什么分？现在规则换成什么？",
    abilityTags: ["分类", "规则切换", "认知灵活性"],
    level: "L5",
    rounds: makeSorterRounds(),
  }),
  makeSet({
    id: "logic-stop-think",
    world: "logic",
    title: "停一下再行动",
    subtitle: "先听规则，再决定走、停、慢慢走或拍手。",
    goal: "训练抑制控制和按规则行动。",
    parentPrompt: "问她：你刚才有没有想马上点？你怎么停下来的？",
    abilityTags: ["抑制控制", "规则执行", "反着来"],
    level: "L5",
    rounds: makeStopThinkRounds(),
  }),
  makeSet({
    id: "logic-order-plan",
    world: "logic",
    title: "先做什么",
    subtitle: "看先后顺序，想第一步做什么才合理。",
    goal: "训练顺序、因果和工作记忆。",
    parentPrompt: "可以问：如果顺序反了，会发生什么？",
    abilityTags: ["顺序推理", "因果理解", "两步计划"],
    level: "L6",
    rounds: makeOrderRounds(),
  }),
  makeSet({
    id: "logic-story-evidence",
    world: "logic",
    title: "故事和线索",
    subtitle: "看奶油、脚印、杯子这些线索，判断谁最可能。",
    goal: "训练证据推理、解释理由和简单排除法。",
    parentPrompt: "可以问：你看到什么线索？这个线索说明什么？",
    abilityTags: ["故事顺序", "证据推理", "排除法"],
    level: "L6",
    rounds: makeStoryEvidenceRounds(),
  }),
  makeSet({
    id: "logic-condition-detective",
    world: "logic",
    title: "条件小侦探",
    subtitle: "看目标和线索，判断现在能不能做、能不能确定，还缺哪一个条件。",
    goal: "训练必要条件、证据强弱和条件缺口判断。",
    parentPrompt: "问她：现在已经知道什么？还缺什么？有了这个条件，事情才能发生吗？",
    abilityTags: ["条件判断", "证据强弱", "必要条件"],
    level: "L6",
    rounds: makeConditionDetectiveRounds(),
  }),
  makeSet({
    id: "logic-fix-plan",
    world: "logic",
    title: "错了怎么改",
    subtitle: "看一个做错的流程，找出问题，再选一个更合适的修正办法。",
    goal: "训练错误诊断、修正计划和因果解释。",
    parentPrompt: "问她：错在条件不够、顺序不对，还是线索太弱？下一步怎么改才有用？",
    abilityTags: ["错误诊断", "修正计划", "因果解释"],
    level: "L6",
    rounds: makeFixPlanRounds(),
  }),
  makeSet({
    id: "logic-priority-choice",
    world: "logic",
    title: "先处理哪一个",
    subtitle: "遇到几个都相关的动作，先判断哪个最紧急、最关键、最能让后面顺利。",
    goal: "训练优先级判断、关键条件识别和生活场景决策。",
    parentPrompt: "问她：哪个问题最急？哪个动作做了以后，后面才更容易？如果先做别的会怎样？",
    abilityTags: ["优先级判断", "关键条件", "生活决策"],
    level: "L6",
    rounds: makePriorityChoiceRounds(),
  }),
  makeSet({
    id: "logic-rule-filter",
    world: "logic",
    title: "按规则装书包",
    subtitle: "先听清楚任务规则，再在相近物品里选真正符合条件的。",
    goal: "训练规则筛选、排除干扰和多条件判断。",
    parentPrompt: "问她：这次规则是什么？你排除了哪一个？如果规则换了，答案会不会变？",
    abilityTags: ["规则筛选", "多条件判断", "排除干扰"],
    level: "L6",
    rounds: makeRuleFilterRounds(),
  }),
  makeSet({
    id: "logic-relation-pairs",
    world: "logic",
    title: "谁和谁一对",
    subtitle: "看两个东西之间的关系，找用途、位置、需要和类比上的好搭档。",
    goal: "训练关系配对、类比迁移和排除相近干扰。",
    parentPrompt: "问她：它们为什么是一对？是用途关系、位置关系，还是谁需要谁？",
    abilityTags: ["关系配对", "类比推理", "相近干扰"],
    level: "L6",
    rounds: makeRelationPairRounds(),
  }),
  makeSet({
    id: "logic-space-bridge",
    world: "logic",
    title: "桥怎么搭",
    subtitle: "看河宽和木板长短，先预测，再调整计划。",
    goal: "训练空间判断、规划和试错调整。",
    parentPrompt: "可以问：这块够不够长？如果不够，下一步换什么？",
    abilityTags: ["空间判断", "规划", "试错调整"],
    level: "L6",
    rounds: makeBridgeRounds(),
  }),
  makeSet({
    id: "logic-same-kind-detective",
    world: "logic",
    title: "同类小侦探",
    subtitle: "从一组图片里看共同点，找同一类，也找最不一样的那个。",
    goal: "训练观察角度、类别归纳和排除法。",
    parentPrompt: "问她：你看的是颜色、形状、用途，还是它是什么东西？",
    abilityTags: ["观察角度", "类别归纳", "排除法"],
    level: "L5",
    rounds: makeSameKindRounds(),
  }),
  makeSet({
    id: "logic-number-pattern-trail",
    world: "logic",
    title: "数字规律小路",
    subtitle: "看数字怎么一步一步变大、变小或轮流出现。",
    goal: "把机考里的数列题改成可读、可数、可解释的规律游戏。",
    parentPrompt: "可以问：每次多几个？有没有隔一个看一次？",
    abilityTags: ["数列规律", "跳数", "单双观察"],
    level: "L6",
    rounds: makeNumberPatternRounds(),
  }),
  makeSet({
    id: "logic-address-map",
    world: "logic",
    title: "地图找宝物",
    subtitle: "看行和列组成的小地址，找到格子里的物品。",
    goal: "训练二维定位、行列对应和工作记忆。",
    parentPrompt: "请她先找字母行，再找数字列，最后说出交叉的格子。",
    abilityTags: ["二维定位", "行列对应", "位置表达"],
    level: "L6",
    rounds: makeAddressMapRounds(),
  }),
  makeSet({
    id: "logic-matrix-puzzle",
    world: "logic",
    title: "图形补一补",
    subtitle: "看每一行、每一列怎么组合，补上缺少的一格。",
    goal: "把二维矩阵规律降成孩子可解释的组合与轮换。",
    parentPrompt: "问她：这一行少了什么？这一列有没有同样的办法？",
    abilityTags: ["二维规律", "图形组合", "多特征观察"],
    level: "L6",
    rounds: makeMatrixPuzzleRounds(),
  }),
  makeSet({
    id: "logic-position-map",
    world: "logic",
    title: "方位小地图",
    subtitle: "看左边、右边、上面、下面、里面和外面，说清楚位置关系。",
    goal: "训练空间方位、相对位置和有序观察。",
    parentPrompt: "问她：你先找到谁？再看它的哪一边？",
    abilityTags: ["空间方位", "相对位置", "有序观察"],
    level: "L5",
    rounds: makePositionMapRounds(),
  }),
  makeSet({
    id: "logic-memory-camera",
    world: "logic",
    title: "记忆小相机",
    subtitle: "先看一组图片，遮住以后再回答刚才看到了什么。",
    goal: "训练图像记忆、顺序记忆和抗干扰选择。",
    parentPrompt: "请她先在心里说一遍，再遮住回答。",
    abilityTags: ["图像记忆", "工作记忆", "抗干扰"],
    level: "L6",
    rounds: makeMemoryCameraRounds(),
  }),
  makeSet({
    id: "logic-visual-match",
    world: "logic",
    title: "一模一样在哪里",
    subtitle: "看颜色、形状和顺序，找出完全一样的一张小卡。",
    goal: "训练细节观察、顺序比较和抗干扰。",
    parentPrompt: "问她：你是从左到右比，还是先看颜色再看形状？",
    abilityTags: ["细节观察", "顺序比较", "抗干扰"],
    level: "L5",
    rounds: makeVisualMatchRounds(),
  }),
  makeSet({
    id: "logic-difference-detective",
    world: "logic",
    title: "找不同侦探",
    subtitle: "比较左图和右图，看哪里变了、多了或少了。",
    goal: "训练有序观察、细节比较和变化表达。",
    parentPrompt: "请她按从左到右的顺序比较：第一个一样吗？第二个一样吗？",
    abilityTags: ["找不同", "细节比较", "有序观察"],
    level: "L5",
    rounds: makeDifferenceDetectiveRounds(),
  }),
  makeSet({
    id: "logic-rotation-direction",
    world: "logic",
    title: "转一转方向",
    subtitle: "看箭头按顺时针或逆时针转，猜下一张指向哪里。",
    goal: "训练旋转规律、方向顺序和工作记忆。",
    parentPrompt: "问她：它是往右边转，还是往左边转？下一步会到哪里？",
    abilityTags: ["旋转规律", "方向顺序", "工作记忆"],
    level: "L6",
    rounds: makeRotationDirectionRounds(),
  }),
  makeSet({
    id: "logic-part-whole-puzzle",
    world: "logic",
    title: "拼图少哪块",
    subtitle: "看完整图案和已经有的几块，找出还缺哪一块。",
    goal: "训练部分-整体、组合观察和排除法。",
    parentPrompt: "问她：完整图里有什么？已经有了什么？还少什么？",
    abilityTags: ["部分整体", "图形组合", "排除法"],
    level: "L6",
    rounds: makePartWholePuzzleRounds(),
  }),
  makeSet({
    id: "logic-balance-swap",
    world: "logic",
    title: "天平换一换",
    subtitle: "看两边一样重的关系，想一想可以换成几个。",
    goal: "训练等量代换、成组观察和早期推理。",
    parentPrompt: "问她：左边可以换成右边几个？如果有两个左边，要换几组右边？",
    abilityTags: ["等量代换", "成组观察", "早期推理"],
    level: "L6",
    rounds: makeBalanceSwapRounds(),
  }),
  makeSet({
    id: "logic-mirror-fold",
    world: "logic",
    title: "镜子折一折",
    subtitle: "看中线两边或上下能不能对上，也试着补出镜子里的另一半。",
    goal: "训练轴对称、左右反转和有序比较。",
    parentPrompt: "请她先找中线，再一格一格对照两边是不是一样。",
    abilityTags: ["轴对称", "左右反转", "有序比较"],
    level: "L6",
    rounds: makeMirrorFoldRounds(),
  }),
  makeSet({
    id: "logic-block-height-map",
    world: "logic",
    title: "积木楼层图",
    subtitle: "看俯视图里的数字，想每一列有几块积木，再合起来数。",
    goal: "训练立体计数、俯视图理解和分步求和。",
    parentPrompt: "问她：每个格子的数字表示几层？全部加起来是多少块？",
    abilityTags: ["立体计数", "俯视图", "分步求和"],
    level: "L6",
    rounds: makeBlockHeightMapRounds(),
  }),
  makeSet({
    id: "logic-three-view-blocks",
    world: "logic",
    title: "从哪边看",
    subtitle: "同一堆积木，从上面、前面、左边看，会看到不同的信息。",
    goal: "训练三视图、视角转换和最高层判断。",
    parentPrompt: "问她：这次是从上面看位置，还是从侧面看最高有几层？",
    abilityTags: ["三视图", "视角转换", "空间想象"],
    level: "L6",
    rounds: makeThreeViewBlockRounds(),
  }),
  makeSet({
    id: "logic-route-steps",
    world: "logic",
    title: "路线听指令",
    subtitle: "从起点出发，按上、下、左、右一步一步走到目标。",
    goal: "训练方向执行、两步工作记忆和路线规划。",
    parentPrompt: "请她边指边说：先往哪里，再往哪里？",
    abilityTags: ["方向执行", "工作记忆", "路线规划"],
    level: "L6",
    rounds: makeRouteStepRounds(),
  }),
];

export const worlds = [
  { id: "math", name: "数字岛", icon: "🧮", summary: "数数、比较、加减、分组" },
  { id: "logic", name: "逻辑屋", icon: "🗝️", summary: "规律、顺序、规则、计划" },
] as const;

function makeSet(input: SetInput): GameConfig {
  return {
    ...input,
    kind: "progressiveSet",
    rounds: input.rounds.map((round, index) => ({
      ...round,
      id: round.id ?? `${input.id}-${index + 1}`,
      difficultyNote: round.difficultyNote ?? defaultDifficultyNote(round),
    })),
  };
}

function defaultDifficultyNote(round: RoundInput) {
  const levelText: Record<AbilityLevel, string> = {
    L1: "入门：单一观察或 1-3 个数量，重点是看见和点数。",
    L2: "基础：需要稳定匹配图、数量或声音线索。",
    L3: "基础进阶：按一个明确规则判断，并说出观察依据。",
    L4: "中等：需要两步观察或简单比较，不能只看一个显眼线索。",
    L5: "较难：需要抗干扰、换角度或同时比较两个特征。",
    L6: "挑战：需要工作记忆、连续步骤或综合推理后再选择。",
  };
  const surface = visualSurfaceText(round);
  const tags = round.abilityTags.slice(0, 2).join("、");
  return `${levelText[round.level]} ${surface}${tags ? `主要训练${tags}。` : ""}`;
}

function visualSurfaceText(round: RoundInput) {
  if (round.sceneImage && round.sequence) return "先看场景图，再按顺序图卡核对关键线索。";
  if (round.sceneImage && round.visualGroups) return "先看场景图，再用分组图卡比较条件。";
  if (round.sceneImage) return "主要从生活场景图里找证据。";
  if (round.memory) return `先记住 ${round.memory.items.length} 张图卡，遮住后再排除干扰项。`;
  if (round.grid) return `在 ${round.grid.rows.length} 行 x ${round.grid.columns.length} 列小地图中定位。`;
  if (round.matrix) return `在 ${round.matrix.cells.length} 行图形表里横向找规律，再纵向检查。`;
  if (round.sequence) return `观察 ${round.sequence.length} 个连续位置，找重复或变化规则。`;
  if (round.visualGroups) return `比较 ${round.visualGroups.length} 组图卡，找共同点、差异或缺失项。`;
  return "结合题干和选项判断。";
}

function makeCountingRounds(): RoundInput[] {
  const rounds: RoundInput[] = [];
  for (let count = 1; count <= 10; count++) {
    const token = allCountTokens[(count - 1) % allCountTokens.length];
    rounds.push({
      level: count <= 3 ? "L1" : count <= 6 ? "L2" : "L3",
      prompt: `数一数有几${unitOf(token)}${countNames[token]}？`,
      instruction: count <= 5 ? "用手指点着数，再选答案。" : "数慢一点，每个只数一次。",
      visualGroups: [{ label: `数一数有几${unitOf(token)}${countNames[token]}`, items: repeat(token, count) }],
      choices: numberChoices(count, 1, 10),
      answer: String(count),
      success: `对，最后数到 ${count}，所以一共有 ${count} 个。`,
      retry: "从左到右，一个一个点着数，不要漏掉。",
      parentPrompt: "问她：你最后说的是几？那一共有几个？",
      abilityTags: ["一一对应", "基数理解"],
    });
  }
  for (let count = 3; count <= 10; count++) {
    const token = toyTokens[count % toyTokens.length];
    rounds.push({
      level: count <= 5 ? "L2" : "L3",
      prompt: `找出正好有 ${count} 个的那一组。`,
      instruction: "每一组都数一数，找到和数字配对的一组。",
      visualGroups: [
        { label: "A", items: repeat(token, Math.max(1, count - 1)) },
        { label: "B", items: repeat(token, count) },
        { label: "C", items: repeat(token, Math.min(10, count + 1)) },
      ],
      choices: [choice("A"), choice("B"), choice("C")],
      answer: "B",
      success: `B 组正好有 ${count} 个。`,
      retry: `找最后数到 ${count} 的那一组。`,
      parentPrompt: "问她：为什么不是 A？为什么不是 C？",
      abilityTags: ["数量配对"],
    });
  }
  return rounds;
}

function makeSubitizeRounds(): RoundInput[] {
  const layouts = [
    { count: 2, token: "🟡", variant: "diagonal", hint: "斜着两个" },
    { count: 3, token: "🟡", variant: "diagonal", hint: "斜线三个" },
    { count: 4, token: "🔵", variant: "corners", hint: "四个角" },
    { count: 5, token: "🟢", variant: "corners-center", hint: "四个角加中间一个" },
    { count: 6, token: "🟣", variant: "columns", hint: "左边三个，右边三个" },
    { count: 2, token: "🍓", variant: "diagonal", hint: "斜角两个" },
    { count: 3, token: "🍪", variant: "triangle", hint: "像一个小三角" },
    { count: 4, token: "🍎", variant: "corners", hint: "四个角" },
    { count: 5, token: "⭐", variant: "corners-center", hint: "四个角加中间一个" },
    { count: 6, token: "🍬", variant: "columns", hint: "两列，每列三个" },
    { count: 4, token: "🟦", variant: "square", hint: "像一个小方阵" },
    { count: 5, token: "🍊", variant: "x", hint: "像一个叉形" },
    { count: 6, token: "🐟", variant: "rows", hint: "上面三个，下面三个" },
    { count: 3, token: "🐦", variant: "triangle", hint: "像一个小三角" },
    { count: 4, token: "🧱", variant: "square", hint: "两行两列" },
  ];
  return layouts.map((layout) => ({
    level: layout.count <= 3 ? "L2" : layout.count <= 5 ? "L3" : "L4",
    prompt: "这一眼有几个？",
    instruction: "先看整体，不急着一个个点。",
    visualGroups: [{ label: "看一眼", items: subitizePattern(layout.count, layout.token, layout.variant), layout: "subitize" }],
    choices: numberChoices(layout.count, 1, 6),
    answer: String(layout.count),
    success: `是 ${layout.count} 个。你可以看成${layout.hint}。`,
    retry: `再看整体形状：${layout.hint}。`,
    parentPrompt: "问她：你看到了哪两小堆？它们合起来是几？",
    abilityTags: ["小数量辨认", "数量结构"],
  }));
}

function subitizePattern(count: number, token: string, variant: string) {
  const patterns: Record<string, number[]> = {
    diagonal: count === 2 ? [0, 8] : [0, 4, 8],
    triangle: [1, 6, 8],
    corners: [0, 2, 6, 8],
    "corners-center": [0, 2, 4, 6, 8],
    columns: [0, 2, 3, 5, 6, 8],
    square: [0, 1, 3, 4],
    x: [0, 2, 4, 6, 8],
    rows: [0, 1, 2, 6, 7, 8],
  };
  const filled = new Set(patterns[variant] ?? Array.from({ length: count }, (_, index) => index));
  return Array.from({ length: 9 }, (_, index) => (filled.has(index) ? token : ""));
}

function makeCompareRounds(): RoundInput[] {
  const rounds: RoundInput[] = [];
  const token = "🍎";
  const pairs = [
    [2, 1], [3, 2], [4, 2], [4, 3], [5, 3], [5, 4], [6, 4], [7, 5], [8, 6], [9, 7], [10, 8], [6, 6],
  ];
  pairs.forEach(([left, right], index) => {
    const answer = left === right ? "same" : left > right ? "left" : "right";
    rounds.push({
      level: index < 4 ? "L3" : index < 9 ? "L4" : "L5",
      prompt: "哪边更多？",
      instruction: "可以一个对一个配朋友。",
      visualGroups: [
        { label: "左边", items: repeat(token, left) },
        { label: "右边", items: repeat(token, right) },
      ],
      choices: [
        { label: "左边多", value: "left" },
        { label: "右边多", value: "right" },
        { label: "一样多", value: "same" },
      ],
      answer,
      success: answer === "same" ? `两边都是 ${left} 个，一样多。` : `${answer === "left" ? "左边" : "右边"}更多，多 ${Math.abs(left - right)} 个。`,
      retry: "把两边一个对一个配起来，看哪边还剩下。",
      parentPrompt: "问她：多出来的是哪几个？",
      abilityTags: ["比较数量"],
    });
  });
  const equalizePairs = [[1, 2], [2, 3], [2, 4], [3, 5], [4, 6], [5, 7], [6, 8], [7, 9], [8, 10], [3, 3]];
  equalizePairs.forEach(([left, right]) => {
    const diff = Math.abs(left - right);
    const answer = left === right ? "same" : left < right ? `add-left-${diff}` : `add-right-${diff}`;
    rounds.push({
      level: diff <= 1 ? "L4" : "L5",
      prompt: "怎样让两边一样多？",
      instruction: "先找哪边少，再想要补几个。",
      visualGroups: [
        { label: "左边", items: repeat("🧁", left) },
        { label: "右边", items: repeat("🧁", right) },
      ],
      choices: left === right ? [
        { label: "已经一样多", value: "same" },
        { label: "左边加 1 个", value: "add-left-1" },
        { label: "右边加 1 个", value: "add-right-1" },
      ] : [
        { label: `左边加 ${diff} 个`, value: `add-left-${diff}` },
        { label: `右边加 ${diff} 个`, value: `add-right-${diff}` },
        { label: "不用改变", value: "same" },
      ],
      answer,
      success: left === right ? "两边已经一样多。" : `少的一边补 ${diff} 个以后，两边就一样多。`,
      retry: "先看哪边少，少几个就补几个。",
      parentPrompt: "问她：如果补到多的一边，会不会更不一样？",
      abilityTags: ["一样多", "补齐"],
    });
  });
  return rounds;
}

function makeComposeRounds(): RoundInput[] {
  const rounds: RoundInput[] = [];
  for (let total = 3; total <= 10; total++) {
    for (let left = 1; left < total && rounds.length < 28; left++) {
      const right = total - left;
      if (right < 1 || right > 6 || left > 6) continue;
      rounds.push({
        level: total <= 5 ? "L4" : "L5",
        prompt: `${left} 个积木和 ${right} 个积木合起来是几个？`,
        instruction: "先看两堆，再合起来数。",
        visualGroups: [
          { label: "第一堆", items: repeat("🧱", left) },
          { label: "第二堆", items: repeat("🧱", right) },
        ],
        choices: numberChoices(total, 2, 10),
        answer: String(total),
        success: `${left} 和 ${right} 合起来是 ${total}。`,
        retry: "把两堆放在一起，从头数一遍。",
        parentPrompt: "问她：还能不能换一种分法，也合成这个数？",
        abilityTags: ["合成分解"],
      });
    }
  }
  return rounds;
}

function makeOperationRounds(): RoundInput[] {
  const rounds: RoundInput[] = [];
  const addStories = ["又来了", "又放上", "又拿来"];
  for (let start = 1; start <= 8; start++) {
    for (let add = 1; add <= 3; add++) {
      const total = start + add;
      if (total > 10) continue;
      rounds.push({
        level: total <= 5 ? "L4" : "L5",
        prompt: `原来有 ${start} 个橘子，${addStories[(start + add) % addStories.length]} ${add} 个，现在有几个？`,
        instruction: "来了以后，数量会变多。",
        visualGroups: [
          { label: "原来", items: repeat("🍊", start) },
          { label: "又来了", items: repeat("🍊", add) },
        ],
        choices: numberChoices(total, 1, 10),
        answer: String(total),
        success: `原来 ${start} 个，又来 ${add} 个，现在是 ${total} 个。`,
        retry: "把原来的和新来的合起来数。",
        parentPrompt: "请她说：原来几个？来了几个？现在几个？",
        abilityTags: ["加法理解"],
      });
    }
  }
  for (let start = 3; start <= 10; start++) {
    for (let gone = 1; gone <= 3; gone++) {
      const left = start - gone;
      if (left < 1) continue;
      rounds.push({
        level: start <= 6 ? "L4" : "L5",
        prompt: `树上有 ${start} 只小鸟，飞走 ${gone} 只，还剩几只？`,
        instruction: "飞走以后，数量会变少。",
        visualGroups: [
          { label: "原来", items: repeat("🐦", start) },
          { label: "飞走", items: repeat("🐦", gone) },
        ],
        choices: numberChoices(left, 1, 10),
        answer: String(left),
        success: `${start} 只飞走 ${gone} 只，还剩 ${left} 只。`,
        retry: "把飞走的先拿开，只数剩下的。",
        parentPrompt: "问她：这次是变多了还是变少了？",
        abilityTags: ["减法理解"],
      });
    }
  }
  return rounds.slice(0, 36);
}

function makeShareRounds(): RoundInput[] {
  const rounds: RoundInput[] = [];
  const shareCases = [
    [2, 2, "🐟", "🐱"], [4, 2, "🐟", "🐱"], [6, 2, "🍪", "🍽️"], [8, 2, "🍬", "🧒"], [6, 3, "🍬", "🧒"], [9, 3, "🍪", "🍽️"], [10, 5, "🍓", "🧒"], [12, 3, "🧱", "🧒"], [12, 4, "🍬", "🧒"],
  ] as const;
  shareCases.forEach(([items, people, itemToken, personToken], index) => {
    const each = items / people;
    rounds.push({
      level: index < 4 ? "L4" : index < 7 ? "L5" : "L6",
      prompt: `${countedItem(itemToken, items)}分给 ${people} 个小朋友，每人一样多，每人几个？`,
      instruction: "可以一个一个轮流分。",
      visualGroups: [
        { label: "要分的东西", items: repeat(itemToken, items) },
        { label: "朋友", items: repeat(personToken, people) },
      ],
      choices: numberChoices(each, 1, 6),
      answer: String(each),
      success: `${countedItem(itemToken, items)}分给 ${people} 个，每人 ${each} 个，正好一样多。`,
      retry: "轮流分：每个人先 1 个，再每个人 1 个。",
      parentPrompt: "请她用手指做轮流分的动作。",
      abilityTags: ["公平分配", "平均分"],
    });
  });
  const remainderCases = [[5, 2, 2, 1], [7, 3, 2, 1], [10, 3, 3, 1], [11, 5, 2, 1]];
  remainderCases.forEach(([items, people, each, rem]) => {
    rounds.push({
      level: "L6",
      prompt: `${items} 条小鱼分给 ${people} 只小猫，每只先一样多，最多每只几条？`,
      instruction: "先公平分，最后可能会剩下。",
      visualGroups: [
        { label: "小鱼", items: repeat("🐟", items) },
        { label: "小猫", items: repeat("🐱", people) },
      ],
      choices: numberChoices(each, 1, 4),
      answer: String(each),
      success: `每只 ${each} 条比较公平，还会剩下 ${rem} 条。`,
      retry: "先让每只小猫一样多，不急着处理剩下的。",
      parentPrompt: "问她：剩下的那一条怎么办才公平？",
      abilityTags: ["公平分配", "剩余直觉"],
    });
  });
  return rounds;
}

function makeGroupCountingRounds(): RoundInput[] {
  const cases = [
    { groups: 2, size: 2, token: "🍓" },
    { groups: 3, size: 2, token: "🍪" },
    { groups: 4, size: 2, token: "⭐" },
    { groups: 2, size: 3, token: "🍎" },
    { groups: 3, size: 3, token: "🍊" },
    { groups: 4, size: 3, token: "🧱" },
    { groups: 2, size: 4, token: "🍬" },
    { groups: 3, size: 4, token: "🐟" },
    { groups: 2, size: 5, token: "🐦" },
    { groups: 5, size: 2, token: "🍓" },
    { groups: 5, size: 3, token: "🧱" },
    { groups: 4, size: 4, token: "⭐" },
  ];

  return cases.map(({ groups, size, token }, index) => {
    const total = groups * size;
    const itemName = countNames[token] ?? "东西";
    return {
      level: total <= 8 ? "L4" as AbilityLevel : total <= 12 ? "L5" as AbilityLevel : "L6" as AbilityLevel,
      prompt: `每组放 ${countedItem(token, size)}，有 ${groups} 组，一共有多少${unitOf(token)}${itemName}？`,
      instruction: `${size} ${unitOf(token)}一组地数，也可以先看有几组。`,
      visualGroups: Array.from({ length: groups }, (_, groupIndex) => ({
        label: `第 ${groupIndex + 1} 组`,
        items: repeat(token, size),
      })),
      choices: numberChoices(total, 2, 20),
      answer: String(total),
      success: `${groups} 组，每组 ${countedItem(token, size)}，一共有 ${countedItem(token, total)}。`,
      retry: `先数一组是 ${countedItem(token, size)}，再数有 ${groups} 组。`,
      parentPrompt: "问她：每组几个？一共有几组？可以几个几个地数？",
      abilityTags: ["成组计数", index < 6 ? "跳数" : "早期乘法直觉"],
    };
  });
}

function makePatternRounds(): RoundInput[] {
  const patterns = [
    { unit: ["🔴", "🔵"], label: "红、蓝" },
    { unit: ["🟡", "🟢"], label: "黄、绿" },
    { unit: ["☀️", "🌙"], label: "太阳、月亮" },
    { unit: ["⬤", "•", "•"], label: "一大两小" },
    { unit: ["☀️", "🌙", "⭐"], label: "太阳、月亮、星星" },
    { unit: ["🍓", "🍪", "🍓"], label: "草莓、饼干、草莓" },
  ];
  const questionKinds = ["next", "middle", "front"] as const;
  const rounds: RoundInput[] = [];
  patterns.forEach((pattern, index) => {
    questionKinds.forEach((kind) => {
      const full = repeatPattern(pattern.unit, 7);
      const missingIndex = kind === "next" ? 5 : kind === "middle" ? 3 : 0;
      const answer = full[missingIndex];
      const sequence = full.slice(0, 6);
      sequence[missingIndex] = "?";
      rounds.push({
        level: index < 2 ? "L3" : index < 4 ? "L4" : "L5",
        prompt: kind === "next" ? "找规律，接下来是什么？" : "找规律，空格里是什么？",
        instruction: "先说出重复顺序，再选空格里的图。",
        sequence,
        choices: patternChoices(answer),
        answer,
        success: `规律是 ${pattern.label}，这里应该是${labelFor(answer)}。`,
        retry: "从头念一念，按同样的顺序找空格。",
        parentPrompt: "问她：这一组里有几个？它怎么重复？",
        abilityTags: ["模式识别", "预测"],
      });
    });
  });
  return rounds;
}

function makeSorterRounds(): RoundInput[] {
  const rounds: RoundInput[] = [];
  const colorCases = [
    ["红色", "🔴", "red"], ["蓝色", "🔵", "blue"], ["绿色", "🟢", "green"], ["黄色", "🟡", "yellow"],
  ] as const;
  const colorTokenByName: Record<string, string> = {
    红色: "🔴",
    蓝色: "🔵",
    绿色: "🟢",
    黄色: "🟡",
  };
  colorCases.forEach(([name, token, value]) => {
    const basketChoices = colorCases.filter(([candidateName]) => candidateName !== name).slice(0, 2);
    rounds.push({
      level: "L3",
      prompt: `按颜色分，${name}的应该放哪里？`,
      instruction: "这次只看颜色。",
      visualGroups: [{ label: "分类机", items: [token, "🟦", "🟢"] }],
      choices: [
        { label: `${name}篮子`, value },
        ...basketChoices.map(([candidateName, , candidateValue]) => ({ label: `${candidateName}篮子`, value: candidateValue })),
      ],
      answer: value,
      success: `规则是按颜色分，所以放进${name}篮子。`,
      retry: "先别看形状，这一题只看颜色。",
      parentPrompt: "问她：你刚才看的是颜色，还是形状？",
      abilityTags: ["分类"],
    });
  });
  const shapeCases = [
    ["圆形", "🔴", "circle"], ["方形", "🟦", "square"], ["小圆点", "🟡", "circle"], ["空位", "⬜", "square"],
  ] as const;
  shapeCases.forEach(([name, token, value]) => {
    rounds.push({
      level: "L4",
      prompt: `规则变了：按形状分。${name}放哪里？`,
      instruction: "不要被颜色带走，只看形状。",
      visualGroups: [{ label: "物品", items: [token, "🔵", "🟦"] }],
      choices: [
        { label: "圆形篮子", value: "circle" },
        { label: "方形篮子", value: "square" },
        { label: "三角形篮子", value: "triangle" },
      ],
      answer: value,
      success: `这次按形状分，${name}要看形状。`,
      retry: "规则换了，现在不是找颜色。",
      parentPrompt: "问她：同一个东西，为什么能按不同规则分？",
      abilityTags: ["规则切换"],
    });
  });

  const mixedRuleCases = [
    { rule: "先按颜色分", item: "🔴", answer: "red", choices: ["红色篮子", "圆形篮子", "方形篮子"], success: "这次先听颜色规则，所以红色圆片进红色篮子。" },
    { rule: "先按形状分", item: "🔴", answer: "circle", choices: ["圆形篮子", "红色篮子", "方形篮子"], success: "这次先听形状规则，所以红色圆片进圆形篮子。" },
    { rule: "先按颜色分", item: "🟦", answer: "blue", choices: ["蓝色篮子", "方形篮子", "圆形篮子"], success: "这次先听颜色规则，所以蓝色方块进蓝色篮子。" },
    { rule: "先按形状分", item: "🟦", answer: "square", choices: ["方形篮子", "蓝色篮子", "圆形篮子"], success: "这次先听形状规则，所以蓝色方块进方形篮子。" },
    { rule: "规则换成颜色", item: "🟡", answer: "yellow", choices: ["黄色篮子", "圆形篮子", "方形篮子"], success: "规则换成颜色，就先看黄色。" },
    { rule: "规则换成形状", item: "🟡", answer: "circle", choices: ["圆形篮子", "黄色篮子", "方形篮子"], success: "规则换成形状，就先看圆形。" },
    { rule: "规则换成颜色", item: "🟢", answer: "green", choices: ["绿色篮子", "圆形篮子", "方形篮子"], success: "规则换成颜色，就先看绿色。" },
    { rule: "规则换成形状", item: "⬜", answer: "square", choices: ["方形篮子", "圆形篮子", "黄色篮子"], success: "规则换成形状，空位这张是方形。" },
  ];
  mixedRuleCases.forEach((item, index) => {
    rounds.push({
      level: index < 4 ? "L4" : "L5",
      prompt: `${item.rule}，这张应该放哪里？`,
      instruction: "先听规则，再看这张图。",
      visualGroups: [{ label: "要分类的图", items: [item.item] }],
      choices: item.choices.map((label) => ({
        label,
        value: label.startsWith("红色") ? "red" : label.startsWith("蓝色") ? "blue" : label.startsWith("绿色") ? "green" : label.startsWith("黄色") ? "yellow" : label.startsWith("圆形") ? "circle" : "square",
      })),
      answer: item.answer,
      success: item.success,
      retry: "不要只看最显眼的地方，先把这次的规则说一遍。",
      parentPrompt: "问她：如果规则换了，同一张图会不会去不同篮子？",
      abilityTags: ["规则切换", "分类"],
    });
  });

  const twoConditionCases = [
    { prompt: "规则是红色，而且要圆形。选哪一个？", items: ["🔴", "🟦", "🟢"], answer: "🔴", success: "红色圆片同时满足红色和圆形。" },
    { prompt: "规则是蓝色，而且要方形。选哪一个？", items: ["🔵", "🟦", "🟡"], answer: "🟦", success: "蓝色方块同时满足蓝色和方形。" },
    { prompt: "规则是圆形，但不要红色。选哪一个？", items: ["🔴", "🔵", "🟦"], answer: "🔵", success: "蓝色圆片是圆形，也不是红色。" },
    { prompt: "规则是方形，但不要蓝色。选哪一个？", items: ["🟦", "⬜", "🟡"], answer: "⬜", success: "空位这张是方形，也不是蓝色。" },
  ];
  twoConditionCases.forEach((item) => {
    rounds.push({
      level: "L5",
      prompt: item.prompt,
      instruction: "两个条件都要满足，少一个都不行。",
      visualGroups: item.items.map((token, index) => ({ label: ["A", "B", "C"][index], items: [token] })),
      choices: [
        { label: "A", value: item.items[0] },
        { label: "B", value: item.items[1] },
        { label: "C", value: item.items[2] },
      ],
      answer: item.answer,
      success: item.success,
      retry: "先看第一个条件，再看第二个条件。",
      parentPrompt: "问她：它满足了哪两个条件？哪个选项只满足了一个？",
      abilityTags: ["多条件判断", "分类"],
    });
  });

  ["红色", "蓝色", "绿色", "黄色"].forEach((name, index) => {
    const tokens = ["🔴", "🔵", "🟢", "🟡"];
    const differentToken = tokens[(index + 1) % tokens.length];
    rounds.push({
      level: "L5",
      prompt: `A 和 C 都是${name}。哪一张颜色不一样？`,
      instruction: "先找到一样的两张，再找不一样的那张。",
      visualGroups: [
        { label: "A", items: [colorTokenByName[name]] },
        { label: "B", items: [differentToken] },
        { label: "C", items: [colorTokenByName[name]] },
      ],
      choices: [
        { label: "A", value: "A" },
        { label: "B", value: "B" },
        { label: "C", value: "C" },
      ],
      answer: "B",
      success: `B 的颜色不一样。A 和 C 都是${name}。`,
      retry: "先比 A 和 C，再看 B 的颜色是不是不同。",
      parentPrompt: "问她：哪两张颜色一样？哪一张不一样？",
      abilityTags: ["认知灵活性"],
    });
  });
  return rounds;
}

function makeStopThinkRounds(): RoundInput[] {
  const trafficScene = imageGallery.scenes.trafficCrosswalk;
  const rules = [
    { color: "绿灯", token: "🟢", mode: "按红绿灯走", prompt: "绿灯亮了，小兔应该怎么做？", answer: "go", action: "走", level: "L3" as AbilityLevel },
    { color: "红灯", token: "🔴", mode: "按红绿灯走", prompt: "红灯亮了，小兔应该怎么做？", answer: "stop", action: "停", level: "L3" as AbilityLevel },
    { color: "绿灯", token: "🟢", mode: "玩反口令", prompt: "现在玩反口令：绿灯亮了，小兔应该怎么做？", answer: "stop", action: "停", level: "L5" as AbilityLevel },
    { color: "红灯", token: "🔴", mode: "玩反口令", prompt: "现在玩反口令：红灯亮了，小兔应该怎么做？", answer: "go", action: "走", level: "L5" as AbilityLevel },
    { color: "绿灯", token: "🟢", mode: "慢慢走", prompt: "这次听到绿灯也要慢慢走，小兔应该怎么做？", answer: "slow", action: "慢慢走", level: "L6" as AbilityLevel },
    { color: "红灯", token: "🔴", mode: "先拍手", prompt: "这次红灯亮了要先拍手，小兔应该怎么做？", answer: "clap", action: "拍手", level: "L6" as AbilityLevel },
  ];
  return rules.map((rule, index) => ({
    level: rule.level,
    prompt: rule.prompt,
    instruction: index < 2 ? "看灯的颜色，再选动作。" : "玩法变了，先停一下再想。",
    sceneImage: trafficScene,
    sequence: [rule.mode, rule.token, "🐰", "?"],
    choices: [
      { label: "走", value: "go" },
      { label: "停", value: "stop" },
      { label: "慢慢走", value: "slow" },
      { label: "拍手", value: "clap" },
    ].slice(index < 4 ? 0 : 1, index < 4 ? 3 : 4),
    answer: rule.answer,
    success: `${rule.color}亮了，小兔要${rule.action}。`,
    retry: "先停一下，把这次的玩法再听一遍。",
    parentPrompt: "问她：这一次是按红绿灯走，还是玩法变了？",
    abilityTags: [index < 2 ? "规则执行" : index < 4 ? "反口令" : "工作记忆"],
  }));
}

function makeOrderRounds(): RoundInput[] {
  const orderScenes = imageGallery.scenes;
  const twoStep = [
    {
      prompt: "小兔口渴了，想喝水，先做什么？",
      seq: ["口渴", "?", "倒水", "喝水"],
      sceneImage: orderScenes.snackWashHands,
      answer: "cup",
      choices: [["先拿杯子", "cup"], ["先倒水", "pour"], ["直接喝水", "drink"]],
      success: "先拿杯子，才好倒水喝水。",
      note: "2 步直接因果：判断目标前必须先做的准备动作。",
    },
    {
      prompt: "门关着，要开门进去，先做什么？",
      seq: ["门关着", "?", "开门", "进屋"],
      sceneImage: orderScenes.keyDoorEntry,
      answer: "key",
      choices: [["先找钥匙", "key"], ["先推门", "push"], ["先敲门", "knock"]],
      success: "先找钥匙，才能开门进屋。",
      note: "2 步必要条件：找到开门工具，再完成目标。",
    },
    {
      prompt: "小鱼在岸上，需要回到水里，先做什么？",
      seq: ["小鱼在岸上", "?", "🌊"],
      sceneImage: orderScenes.animalHabitatPairs,
      answer: "carry",
      choices: [["轻轻放回水里", "carry"], ["继续看着", "watch"], ["拿杯子接水", "cup-water"]],
      success: "先轻轻放回水里，小鱼才安全。",
      note: "2 步生活常识：先处理最紧急的需要。",
    },
  ];

  const threeStep = [
    {
      prompt: "花盆是空的，想让花开出来，第一步做什么？",
      seq: ["空花盆", "?", "🌱", "🌼"],
      sceneImage: orderScenes.plantGrowthGarden,
      answer: "seed",
      choices: [["种下种子", "seed"], ["只给空土浇水", "water"], ["直接等开花", "wait-flower"]],
      success: "先种下种子，然后发芽，最后开花。",
      note: "3 步自然顺序：起点、变化、结果要连起来。",
    },
    {
      prompt: "吃饼干前，待补位置应该是什么？",
      seq: ["手脏", "?", "拿饼干", "吃"],
      sceneImage: orderScenes.snackWashHands,
      answer: "wash",
      choices: [["先洗手", "wash"], ["先拿饼干", "take-cookie"], ["先吃饼干", "eat-cookie"]],
      success: "手脏了先洗手，再拿饼干吃。",
      note: "3 步卫生场景：先解决前置条件，再做目标动作。",
    },
    {
      prompt: "积木倒了，要重新搭高，先做什么？",
      seq: ["🧱倒了", "?", "高塔"],
      sceneImage: orderScenes.blockTowerRebuild,
      answer: "pick",
      choices: [["先捡积木", "pick"], ["先搭高塔", "build"], ["先放进盒子", "box"]],
      success: "先捡积木，再一块一块搭高。",
      note: "3 步修复场景：先整理材料，再完成搭建。",
    },
  ];

  const fourStep = [
    {
      prompt: "玩具散了，想按种类收好，先做什么？",
      seq: ["玩具散了", "?", "放进盒子", "整齐"],
      sceneImage: orderScenes.tidyPlayroomBlocks,
      answer: "sort",
      choices: [["先分类", "sort"], ["随便塞进盒子", "box"], ["重新弄乱", "mess"]],
      success: "先分类，再放进盒子，最后变整齐。",
      note: "4 步整理流程：先按类别处理，再收纳到目标位置。",
    },
    {
      prompt: "过马路时，待补位置应该是什么？",
      seq: ["路口", "?", "绿灯", "走过去"],
      sceneImage: orderScenes.trafficCrosswalk,
      answer: "look",
      choices: [["先看灯", "look"], ["直接走过去", "walk"], ["等别人先走", "wait"]],
      success: "先看灯，等绿灯，再安全走过去。",
      note: "4 步安全流程：先观察信号，再决定行动。",
    },
    {
      prompt: "小猫要喝水，拿到杯子后还缺哪一步？",
      seq: ["🐱", "先拿杯子", "?", "喝水"],
      sceneImage: orderScenes.snackWashHands,
      answer: "pour",
      choices: [["先倒水", "pour"], ["再拿一个杯子", "cup-again"], ["端空杯子过去", "empty-cup"]],
      success: "先拿杯子，再倒水，小猫才能喝。",
      note: "4 步工具流程：先准备容器，再加入需要的东西。",
    },
  ];

  const fiveStep = [
    {
      prompt: "吃点心的流程里，待补位置应该是什么？",
      seq: ["手脏", "?", "拿盘子", "拿饼干", "吃"],
      sceneImage: orderScenes.snackWashHands,
      answer: "wash",
      choices: [["先洗手", "wash"], ["先拿盘子", "plate"], ["先吃饼干", "eat-cookie"]],
      success: "手脏了先洗手，再拿盘子和饼干，最后吃。",
      note: "5 步生活流程：要同时记住卫生、工具和目标动作。",
    },
    {
      prompt: "帮小兔拿胡萝卜，缺少哪一步？",
      seq: ["🐰", "🌊", "?", "走过去", "🥕"],
      sceneImage: orderScenes.bridgeRiverPlanks,
      answer: "bridge",
      choices: [["先搭桥", "bridge"], ["先走进水里", "walk-water"], ["先拿胡萝卜", "carrot"]],
      success: "有小河时先搭桥，走过去以后才能拿胡萝卜。",
      note: "5 步障碍流程：先处理障碍，再继续完成目标。",
    },
    {
      prompt: "收拾积木到整齐，待补位置应该是什么？",
      seq: ["🧱倒了", "先捡积木", "?", "高塔", "整齐"],
      sceneImage: orderScenes.blockTowerRebuild,
      answer: "sort",
      choices: [["先分类", "sort"], ["先搭高塔", "build"], ["先放进盒子", "box"]],
      success: "先捡起来，再分类，才能更容易搭好收整齐。",
      note: "5 步计划流程：不只是先后，还要选择能降低混乱的中间步骤。",
    },
  ];

  const dailyPlans = [
    {
      prompt: "上课要写字，先拿什么最合适？",
      seq: ["上课", "?", "写字"],
      sceneImage: orderScenes.schoolbagPacking,
      answer: "pencil",
      choices: [["铅笔", "pencil"], ["玩具车", "car"], ["帽子", "hat"]],
      success: "写字前先拿铅笔最合适。",
      note: "2 步用途判断：先找和目标动作最直接相关的工具。",
    },
    {
      prompt: "书要带去学校，应该先放进哪里？",
      seq: ["书本", "?", "去学校"],
      sceneImage: orderScenes.schoolbagPacking,
      answer: "bag",
      choices: [["书包", "bag"], ["饭盒", "lunch"], ["水壶", "bottle"]],
      success: "书本要先放进书包，才方便带去学校。",
      note: "2 步容器关系：先找能装目标物的地方。",
    },
    {
      prompt: "下雨要出门，先准备什么？",
      seq: ["下雨", "?", "出门"],
      sceneImage: orderScenes.schoolbagPacking,
      answer: "raincoat",
      choices: [["雨衣", "raincoat"], ["帽子", "hat"], ["足球", "ball"]],
      success: "下雨出门先准备雨衣，身体才不容易淋湿。",
      note: "2 步生活条件：根据天气先准备合适物品。",
    },
    {
      prompt: "桌上有饼干，想干净地吃，先拿什么？",
      seq: ["饼干", "?", "吃"],
      sceneImage: orderScenes.snackWashHands,
      answer: "plate",
      choices: [["拿盘子", "plate"], ["拿足球", "ball"], ["拿雨衣", "raincoat"]],
      success: "先拿盘子，再拿饼干吃更干净。",
      note: "3 步工具准备：先准备承接食物的工具。",
    },
    {
      prompt: "手上有泥，想拿点心，第一步是什么？",
      seq: ["手脏", "?", "拿饼干"],
      sceneImage: orderScenes.snackWashHands,
      answer: "wash",
      choices: [["先洗手", "wash"], ["先拿饼干", "cookie"], ["先吃饼干", "eat"]],
      success: "手脏了先洗手，再拿点心。",
      note: "3 步卫生流程：先满足卫生条件，再接触食物。",
    },
    {
      prompt: "杯子是空的，想喝水，先做什么？",
      seq: ["杯子", "?", "喝水"],
      sceneImage: orderScenes.snackWashHands,
      answer: "pour",
      choices: [["先倒水", "pour"], ["再拿一个杯子", "cup-again"], ["端空杯子过去", "empty-cup"]],
      success: "空杯子要先倒水，才能喝。",
      note: "3 步工具流程：容器准备好后，还要加入需要的东西。",
    },
    {
      prompt: "路口是红灯，想安全过马路，先做什么？",
      seq: ["路口", "🔴", "?"],
      sceneImage: orderScenes.trafficCrosswalk,
      answer: "stop",
      choices: [["停", "stop"], ["走", "go"], ["拍手", "clap"]],
      success: "红灯时先停，等能走的时候再过马路。",
      note: "3 步安全流程：先按信号停下，再等待条件变化。",
    },
    {
      prompt: "路口要过马路，第一步先看什么？",
      seq: ["路口", "?", "走过去"],
      sceneImage: orderScenes.trafficCrosswalk,
      answer: "look",
      choices: [["先看灯", "look"], ["直接走过去", "walk"], ["闭眼往前走", "blind"]],
      success: "过马路前先看灯，再决定能不能走。",
      note: "3 步安全流程：先观察，再行动。",
    },
    {
      prompt: "积木散在地上，想重新搭塔，先做什么？",
      seq: ["🧱倒了", "?", "高塔"],
      sceneImage: orderScenes.blockTowerRebuild,
      answer: "pick",
      choices: [["先捡积木", "pick"], ["直接搭高塔", "build"], ["重新弄乱", "mess"]],
      success: "先把积木捡起来，才好重新搭塔。",
      note: "3 步修复流程：先整理材料，再完成目标。",
    },
    {
      prompt: "小兔在河边，胡萝卜在对岸，先解决什么？",
      seq: ["🐰", "🌊", "?", "🥕"],
      sceneImage: orderScenes.bridgeRiverPlanks,
      answer: "bridge",
      choices: [["先搭桥", "bridge"], ["先拿胡萝卜", "carrot"], ["站在岸边等", "wait"]],
      success: "小河挡住了路，要先搭桥。",
      note: "4 步障碍流程：先处理挡路条件，再去拿目标物。",
    },
    {
      prompt: "花园里要照顾小芽，下一步做什么更合适？",
      seq: ["🌱", "?", "🌼"],
      sceneImage: orderScenes.plantGrowthGarden,
      answer: "water",
      choices: [["先浇水", "water"], ["先摘花", "pick"], ["直接等开花", "wait"]],
      success: "小芽需要照顾，浇水以后更可能长成花。",
      note: "3 步自然流程：已有小芽时，下一步是照顾它继续长。",
    },
    {
      prompt: "玩具已经分好类了，下一步做什么？",
      seq: ["先分类", "?", "整齐"],
      sceneImage: orderScenes.tidyPlayroomBlocks,
      answer: "box",
      choices: [["先放进盒子", "box"], ["重新弄乱", "mess"], ["先拿饼干", "cookie"]],
      success: "已经分类了，下一步放进盒子，房间就更整齐。",
      note: "4 步整理流程：保留已经完成的步骤，再做下一步。",
    },
  ];

  return [...twoStep, ...threeStep, ...fourStep, ...fiveStep, ...dailyPlans].map((scene, index) => {
    const stepCount = Number(scene.note.match(/^(\d+)/)?.[1] ?? scene.seq.length);
    const sceneImage = "sceneImage" in scene ? scene.sceneImage : undefined;
    return {
      level: index < 3 ? "L4" as AbilityLevel : index < 6 ? "L5" as AbilityLevel : "L6" as AbilityLevel,
      prompt: scene.prompt,
      instruction: stepCount <= 2 ? "先看目标，再想第一步。" : `这是 ${stepCount} 步流程，按顺序找缺少的一步。`,
      difficultyNote: scene.note,
      sceneImage,
      sequence: scene.seq,
      choices: scene.choices.map(([label, value]) => ({ label, value })),
      answer: scene.answer,
      success: scene.success,
      retry: "先从生活目标往前想：没有这一步，后面的事能不能发生？",
      parentPrompt: `请她用“先、然后、再、最后”复述这 ${stepCount} 步。`,
      abilityTags: ["顺序推理", stepCount >= 5 ? "多步计划" : stepCount >= 4 ? "生活流程" : "两步计划"],
    };
  });
}

function makeStoryEvidenceRounds(): RoundInput[] {
  const storyScenes = imageGallery.scenes;
  const stories: RoundInput[] = [
    {
      level: "L4",
      prompt: "桌上的蛋糕少了一块。谁最可能吃了？",
      instruction: "看嘴边的线索。",
      sceneImage: storyScenes.cakeEvidenceKitchen,
      choices: [{ label: "小猫", value: "cat" }, { label: "小狗", value: "dog" }, { label: "小兔", value: "rabbit" }],
      answer: "cat",
      success: "小猫嘴边有奶油，这是重要线索。",
      retry: "谁身上有和蛋糕有关的线索？",
      parentPrompt: "问她：嘴边有奶油说明什么？",
      abilityTags: ["证据推理"],
    },
    {
      level: "L5",
      prompt: "谁最不像拿走蛋糕的人？",
      instruction: "这次用排除法。",
      sceneImage: storyScenes.cakeEvidenceKitchen,
      choices: [{ label: "小猫", value: "cat" }, { label: "小狗", value: "dog" }, { label: "两个都一样", value: "same" }],
      answer: "dog",
      success: "小狗一直在睡觉，线索更少，所以最不像。",
      retry: "谁有更多线索指向它？谁线索更少？",
      parentPrompt: "问她：我们为什么先排除小狗？",
      abilityTags: ["排除法"],
    },
    {
      level: "L6",
      prompt: "只知道“小猫在厨房”，能确定是小猫吃了吗？",
      instruction: "有些线索不够强，不能马上确定。",
      sceneImage: storyScenes.catKitchenWeakClue,
      choices: [{ label: "一定是小猫", value: "cat-certain" }, { label: "还不能确定", value: "not-yet" }, { label: "一定不是小猫", value: "cat-not" }],
      answer: "not-yet",
      success: "只在厨房还不够，需要更多证据。",
      retry: "在厨房只是线索，还不是足够的证据。",
      parentPrompt: "问她：还需要看到什么，才能更确定？",
      abilityTags: ["解释理由"],
    },
  ];
  const extra: RoundInput[] = [
    {
      level: "L4",
      prompt: "谁刚刚玩过泥巴？",
      instruction: "看脚印和手上的线索。",
      sceneImage: storyScenes.muddyPawsYard,
      choices: [{ label: "小狗", value: "dog" }, { label: "小兔", value: "rabbit" }, { label: "小猫", value: "cat" }],
      answer: "dog",
      success: "小狗脚上有泥，这是强线索。",
      retry: "谁身上有泥巴的线索？",
      parentPrompt: "问她：脚上有泥说明可能去了哪里？",
      abilityTags: ["证据推理"],
    },
    {
      level: "L5",
      prompt: "谁最可能把水洒了？",
      instruction: "看水杯旁边的线索。",
      sceneImage: storyScenes.spilledWaterRoom,
      choices: [{ label: "小熊", value: "bear" }, { label: "小狗", value: "dog" }, { label: "小鸟", value: "bird" }],
      answer: "bear",
      success: "倒下的杯子在小熊旁边，所以小熊最可能碰到了。",
      retry: "谁离倒下的杯子最近？",
      parentPrompt: "问她：近的线索是不是比远的线索更有用？",
      abilityTags: ["证据推理"],
    },
    {
      level: "L5",
      prompt: "谁最不像摘花的人？",
      instruction: "用排除法看线索。",
      sceneImage: storyScenes.flowerEvidenceGarden,
      visualGroups: [{ label: "线索", items: ["小兔手里是胡萝卜", "小猫手上有花粉", "花旁边有猫脚印"] }],
      choices: [{ label: "小兔", value: "rabbit" }, { label: "小猫", value: "cat" }, { label: "都一样", value: "same" }],
      answer: "rabbit",
      success: "小兔拿的是胡萝卜，和花的线索更少。",
      retry: "谁和花的线索更少？",
      parentPrompt: "问她：为什么先排除小兔？",
      abilityTags: ["排除法"],
    },
    {
      level: "L6",
      prompt: "只知道“小狗在房间里”，能确定是小狗弄乱玩具吗？",
      instruction: "一个线索不一定够。",
      sceneImage: storyScenes.dogRoomWeakClue,
      choices: [{ label: "一定是小狗", value: "dog-certain" }, { label: "还不能确定", value: "not-yet" }, { label: "一定不是小狗", value: "dog-not" }],
      answer: "not-yet",
      success: "只在房间里还不够，需要更多线索。",
      retry: "在房间里只是线索，不是足够证据。",
      parentPrompt: "问她：还要看到什么线索，才更确定？",
      abilityTags: ["解释理由"],
    },
  ];
  return repeatTo([...stories, ...extra], 24);
}

function makeConditionDetectiveRounds(): RoundInput[] {
  const scenes = imageGallery.scenes;
  const rounds: RoundInput[] = [
    {
      level: "L4",
      prompt: "手脏了，能直接吃饼干吗？",
      instruction: "先看卫生条件够不够。",
      difficultyNote: "单一必要条件：目标前有一个必须先满足的条件。",
      sceneImage: scenes.snackWashHands,
      sequence: ["手脏", "?", "拿饼干", "吃"],
      choices: [{ label: "先洗手", value: "wash" }, { label: "直接吃", value: "eat-now" }, { label: "只拿盘子", value: "plate-only" }],
      answer: "wash",
      success: "手脏时先洗手，卫生条件够了才能吃点心。",
      retry: "先想：如果少了这一步，后面还能不能安全发生？",
      parentPrompt: "问她：洗手是可有可无，还是必须先做？",
      abilityTags: ["必要条件", "生活判断"],
    },
    {
      level: "L4",
      prompt: "红灯亮了，现在能走过去吗？",
      instruction: "先看安全条件够不够。",
      difficultyNote: "单一安全条件：看到信号，再决定能不能行动。",
      sceneImage: scenes.trafficCrosswalk,
      sequence: ["路口", "🔴", "?"],
      choices: [{ label: "停", value: "stop" }, { label: "走", value: "go" }, { label: "慢慢走", value: "slow" }],
      answer: "stop",
      success: "红灯时安全条件不够，要先停。",
      retry: "看清灯的颜色，再决定能不能走。",
      parentPrompt: "问她：绿灯和红灯分别告诉我们什么？",
      abilityTags: ["条件判断", "安全规则"],
    },
    {
      level: "L4",
      prompt: "绿灯亮了，下一步可以做什么？",
      instruction: "条件满足了，再选择行动。",
      difficultyNote: "单一条件满足：条件够了以后，选择对应动作。",
      sceneImage: scenes.trafficCrosswalk,
      sequence: ["路口", "🟢", "?"],
      choices: [{ label: "走过去", value: "walk" }, { label: "继续等着", value: "keep-waiting" }, { label: "等红灯再走", value: "wait-red" }],
      answer: "walk",
      success: "绿灯亮了，可以安全走过去。",
      retry: "绿灯表示可以走，但还是要看路。",
      parentPrompt: "问她：条件满足以后，动作会不会改变？",
      abilityTags: ["条件判断", "规则执行"],
    },
    {
      level: "L4",
      prompt: "宽河前只有短木板，够过河吗？",
      instruction: "看距离和材料是否匹配。",
      difficultyNote: "单一匹配条件：材料长度要和河宽匹配。",
      sceneImage: scenes.bridgeRiverPlanks,
      sequence: ["宽河", "短木板", "?"],
      choices: [{ label: "还不够", value: "not-enough" }, { label: "已经够了", value: "enough" }, { label: "不用木板", value: "none" }],
      answer: "not-enough",
      success: "宽河只用短木板还不够，要换更合适的材料。",
      retry: "先比一比河宽和木板长短。",
      parentPrompt: "问她：短木板为什么不够？还可以怎么改？",
      abilityTags: ["空间判断", "必要条件"],
    },
    {
      level: "L5",
      prompt: "想吃点心，已经洗手了，下一步还缺什么？",
      instruction: "条件会一个接一个出现。",
      difficultyNote: "连续条件：卫生条件满足后，还要准备工具。",
      sceneImage: scenes.snackWashHands,
      sequence: ["先洗手", "?", "拿饼干", "吃"],
      choices: [{ label: "拿盘子", value: "plate" }, { label: "再洗手", value: "wash-again" }, { label: "直接吃", value: "eat-now" }],
      answer: "plate",
      success: "洗手以后拿盘子，再拿饼干吃。",
      retry: "已经洗过手了，下一步看吃点心还需要什么工具。",
      parentPrompt: "问她：已经满足的条件，还要不要重复做？",
      abilityTags: ["多步计划", "条件判断"],
    },
    {
      level: "L5",
      prompt: "玩具散了，想变整齐，先随便塞进盒子够吗？",
      instruction: "先看这样做能不能让后面更顺。",
      difficultyNote: "整理条件：先分类会让收纳更容易，不只是随便动作。",
      sceneImage: scenes.tidyPlayroomBlocks,
      sequence: ["玩具散了", "?", "放进盒子", "整齐"],
      choices: [{ label: "先分类", value: "sort" }, { label: "随便塞", value: "stuff" }, { label: "只拿一个", value: "one" }],
      answer: "sort",
      success: "先分类，再放进盒子，才更容易变整齐。",
      retry: "想想哪一步能让后面的收拾更容易。",
      parentPrompt: "问她：分类以后，放进盒子会不会更快？",
      abilityTags: ["计划", "条件判断"],
    },
    {
      level: "L5",
      prompt: "小兔要拿对岸胡萝卜，看到小河后还缺什么？",
      instruction: "先处理障碍，再完成目标。",
      difficultyNote: "障碍条件：目标在对岸时，先补上过河条件。",
      sceneImage: scenes.bridgeRiverPlanks,
      sequence: ["🐰", "🌊", "?", "🥕"],
      choices: [{ label: "先搭桥", value: "bridge" }, { label: "直接走进水里", value: "walk-water" }, { label: "站在岸边等", value: "wait-bank" }],
      answer: "bridge",
      success: "有小河挡住时，先搭桥，才能到对岸拿胡萝卜。",
      retry: "目标还没法直接拿到，先看中间缺了什么条件。",
      parentPrompt: "问她：小河是目标，还是障碍？",
      abilityTags: ["障碍处理", "必要条件"],
    },
    {
      level: "L5",
      prompt: "小猫在厨房，蛋糕少了一块，够确定是小猫吃的吗？",
      instruction: "线索不够强时，不要急着下结论。",
      difficultyNote: "弱证据判断：出现地点不是直接证据。",
      sceneImage: scenes.catKitchenWeakClue,
      choices: [{ label: "还不能确定", value: "not-yet" }, { label: "一定是小猫", value: "cat" }, { label: "一定不是小猫", value: "not-cat" }],
      answer: "not-yet",
      success: "只知道在厨房还不够，还需要奶油、脚印这样的更强线索。",
      retry: "在同一个地方只是线索，不是足够证据。",
      parentPrompt: "问她：还要看到什么，才更像小猫吃了？",
      abilityTags: ["证据强弱", "解释理由"],
    },
    {
      level: "L6",
      prompt: "蛋糕少了，小猫嘴边有奶油，谁最可能吃了？",
      instruction: "把目标和强线索连起来。",
      difficultyNote: "强证据判断：线索直接指向目标行为。",
      sceneImage: scenes.cakeEvidenceKitchen,
      choices: [{ label: "小猫", value: "cat" }, { label: "小狗", value: "dog" }, { label: "小兔", value: "rabbit" }],
      answer: "cat",
      success: "奶油和蛋糕直接相关，所以小猫最可能。",
      retry: "谁身上有和蛋糕最相关的线索？",
      parentPrompt: "问她：奶油为什么比“在厨房”更有用？",
      abilityTags: ["证据强弱", "证据推理"],
    },
    {
      level: "L6",
      prompt: "水杯倒了，小熊就在旁边。哪条线索最关键？",
      instruction: "找最能说明事情的线索。",
      difficultyNote: "关键线索判断：比较近处线索和远处干扰。",
      sceneImage: scenes.spilledWaterRoom,
      choices: [{ label: "离杯子最近", value: "near-cup" }, { label: "小狗在远处", value: "far-dog" }, { label: "小鸟在窗边", value: "bird-window" }],
      answer: "near-cup",
      success: "谁离倒下的杯子最近，这条线索最关键。",
      retry: "先找和水杯、地上水最接近的线索。",
      parentPrompt: "问她：近的线索和远的线索，哪个更能说明问题？",
      abilityTags: ["关键线索", "证据强弱"],
    },
    {
      level: "L6",
      prompt: "只知道小狗在房间里，能确定它弄乱玩具吗？",
      instruction: "要分清“可能”和“确定”。",
      difficultyNote: "证据不足：只有地点线索，不能推出行为一定发生。",
      sceneImage: scenes.dogRoomWeakClue,
      choices: [{ label: "还不能确定", value: "not-yet" }, { label: "一定是小狗", value: "dog" }, { label: "一定不是小狗", value: "not-dog" }],
      answer: "not-yet",
      success: "小狗在房间里只是可能，还缺更直接的线索。",
      retry: "在房间里不等于一定弄乱了玩具。",
      parentPrompt: "问她：什么线索能更直接说明小狗弄乱了？",
      abilityTags: ["证据不足", "解释理由"],
    },
    {
      level: "L6",
      prompt: "短木板过不了宽河，下一步应该先改变什么？",
      instruction: "失败以后，先改最影响结果的条件。",
      difficultyNote: "条件调整：找出失败原因，再改关键条件。",
      sceneImage: scenes.bridgeRiverPlanks,
      sequence: ["宽河", "短木板", "太短", "?"],
      choices: [{ label: "把木板接长", value: "extend" }, { label: "继续用短木板", value: "same" }, { label: "换同样短木板", value: "same-short" }],
      answer: "extend",
      success: "失败原因是长度不够，所以先把木板接长。",
      retry: "先找失败原因，再改最关键的条件。",
      parentPrompt: "问她：失败是因为颜色，还是因为长度？",
      abilityTags: ["试错调整", "条件判断"],
    },
  ];

  return repeatTo(rounds, 24);
}

function makeFixPlanRounds(): RoundInput[] {
  const scenes = imageGallery.scenes;
  const rounds: RoundInput[] = [
    {
      level: "L4",
      prompt: "手脏了就拿饼干，错在哪里？",
      instruction: "先找少掉的必要步骤。",
      difficultyNote: "发现单一步骤错误：目标前缺少必要条件。",
      sceneImage: scenes.snackWashHands,
      sequence: ["手脏", "拿饼干", "吃"],
      choices: [{ label: "少了先洗手", value: "missing-wash" }, { label: "少了拿盘子", value: "missing-plate" }, { label: "少了多拿饼干", value: "missing-more-cookie" }],
      answer: "missing-wash",
      success: "错在手脏时直接拿饼干，少了先洗手。",
      retry: "看第一张图，手还脏着，吃东西前先要做什么？",
      parentPrompt: "问她：这个流程少了哪一步？为什么这一步重要？",
      abilityTags: ["错误诊断", "必要条件"],
    },
    {
      level: "L4",
      prompt: "红灯亮了却走过去，应该怎么改？",
      instruction: "先看哪个动作违反了规则。",
      difficultyNote: "安全规则修正：发现错误动作并换成规则动作。",
      sceneImage: scenes.trafficCrosswalk,
      sequence: ["路口", "🔴", "走过去"],
      choices: [{ label: "改成停", value: "stop" }, { label: "继续走", value: "keep-walk" }, { label: "等红灯再走", value: "wait-red" }],
      answer: "stop",
      success: "红灯亮了应该停，不能走过去。",
      retry: "红灯告诉我们停，不是走。",
      parentPrompt: "问她：如果这一步不改，会有什么危险？",
      abilityTags: ["错误诊断", "安全规则"],
    },
    {
      level: "L4",
      prompt: "绿灯亮了还一直等，哪里不合适？",
      instruction: "条件已经满足时，要改变动作。",
      difficultyNote: "条件满足后的行动修正：不只是停，也要在合适时行动。",
      sceneImage: scenes.trafficCrosswalk,
      sequence: ["路口", "🟢", "停"],
      choices: [{ label: "改成走过去", value: "walk" }, { label: "继续等着", value: "keep-waiting" }, { label: "等红灯再走", value: "wait-red" }],
      answer: "walk",
      success: "绿灯亮了，确认安全后可以走过去。",
      retry: "绿灯和红灯的动作不一样。",
      parentPrompt: "问她：什么时候要停？什么时候可以走？",
      abilityTags: ["规则执行", "修正计划"],
    },
    {
      level: "L4",
      prompt: "宽河只放短木板，为什么失败？",
      instruction: "先找失败原因，再想怎么改。",
      difficultyNote: "材料匹配错误：长度条件不满足。",
      sceneImage: scenes.bridgeRiverPlanks,
      sequence: ["宽河", "短木板", "太短"],
      choices: [{ label: "木板太短", value: "too-short" }, { label: "木板太长", value: "too-long" }, { label: "河太窄", value: "too-narrow" }],
      answer: "too-short",
      success: "失败原因是木板太短，长度不够。",
      retry: "搭桥看的是距离和长度，不是颜色。",
      parentPrompt: "问她：错的是材料长度，还是别的东西？",
      abilityTags: ["空间判断", "错误诊断"],
    },
    {
      level: "L5",
      prompt: "洗完手又一直洗，点心还没开始，下一步怎么改？",
      instruction: "已经完成的条件不用一直重复。",
      difficultyNote: "重复步骤修正：区分已经满足和还没满足的条件。",
      sceneImage: scenes.snackWashHands,
      sequence: ["先洗手", "先洗手", "?"],
      choices: [{ label: "拿盘子", value: "plate" }, { label: "继续洗手", value: "wash-again" }, { label: "直接吃", value: "eat-now" }],
      answer: "plate",
      success: "洗手已经完成了，下一步准备盘子和饼干。",
      retry: "已经满足的条件不用一直重复，想下一步还缺什么。",
      parentPrompt: "问她：哪一步已经做过？接下来缺什么？",
      abilityTags: ["条件判断", "修正计划"],
    },
    {
      level: "L5",
      prompt: "玩具散了就随便塞进盒子，哪里不够好？",
      instruction: "看这样做会不会让后面更乱。",
      difficultyNote: "低效计划修正：能做不等于最合适。",
      sceneImage: scenes.tidyPlayroomBlocks,
      sequence: ["玩具散了", "放进盒子", "整齐"],
      choices: [{ label: "先分类", value: "sort" }, { label: "继续随便塞", value: "stuff" }, { label: "只拿一个", value: "one" }],
      answer: "sort",
      success: "先分类再收进盒子，更容易整理整齐。",
      retry: "想一想哪一步能让后面的收拾更有顺序。",
      parentPrompt: "问她：随便塞和先分类，哪个更容易找东西？",
      abilityTags: ["计划", "修正计划"],
    },
    {
      level: "L5",
      prompt: "小兔看到小河就站着等，怎样改更有用？",
      instruction: "等待不能解决障碍，要处理障碍。",
      difficultyNote: "障碍修正：把无效等待改成解决障碍的动作。",
      sceneImage: scenes.bridgeRiverPlanks,
      sequence: ["🐰", "🌊", "?"],
      choices: [{ label: "先搭桥", value: "bridge" }, { label: "站在岸边等", value: "wait-bank" }, { label: "直接走进水里", value: "walk-water" }],
      answer: "bridge",
      success: "小河是障碍，先搭桥才有用。",
      retry: "站着等不会让小河变没，先想怎么过去。",
      parentPrompt: "问她：哪一个动作真的解决了小河这个问题？",
      abilityTags: ["障碍处理", "错误诊断"],
    },
    {
      level: "L5",
      prompt: "只看到小猫在厨房，就说一定是小猫吃了，哪里错？",
      instruction: "地点线索不等于强证据。",
      difficultyNote: "结论过早修正：从确定改成还不能确定。",
      sceneImage: scenes.catKitchenWeakClue,
      choices: [{ label: "还不能确定", value: "not-yet" }, { label: "一定是小猫", value: "cat" }, { label: "一定不是小猫", value: "not-cat" }],
      answer: "not-yet",
      success: "错在太早下结论，只在厨房还不能确定。",
      retry: "还缺奶油、脚印这样的更强线索。",
      parentPrompt: "问她：什么线索才更能说明小猫吃了？",
      abilityTags: ["证据强弱", "错误诊断"],
    },
    {
      level: "L6",
      prompt: "小猫嘴边有奶油，却说小狗最可能吃了，怎么改？",
      instruction: "强线索要和结论对应起来。",
      difficultyNote: "证据对应修正：把结论改到最相关的线索上。",
      sceneImage: scenes.cakeEvidenceKitchen,
      choices: [{ label: "改成小猫", value: "cat" }, { label: "坚持小狗", value: "dog" }, { label: "改成小兔", value: "rabbit" }],
      answer: "cat",
      success: "奶油在小猫嘴边，结论要改成小猫最可能。",
      retry: "谁身上的线索和蛋糕直接相关？",
      parentPrompt: "问她：这个结论应该跟哪条线索配上？",
      abilityTags: ["证据推理", "修正计划"],
    },
    {
      level: "L6",
      prompt: "水洒了，却只看远处的小狗，哪里不对？",
      instruction: "关键线索通常离事件更近。",
      difficultyNote: "注意焦点修正：从远处干扰改回关键线索。",
      sceneImage: scenes.spilledWaterRoom,
      choices: [{ label: "先看倒下的杯子旁边", value: "near-cup" }, { label: "只看远处小狗", value: "far-dog" }, { label: "只看窗边小鸟", value: "bird-window" }],
      answer: "near-cup",
      success: "要先看倒下杯子和水旁边，那里更关键。",
      retry: "先找离事情发生处最近的线索。",
      parentPrompt: "问她：什么线索离洒水这件事最近？",
      abilityTags: ["关键线索", "错误诊断"],
    },
    {
      level: "L6",
      prompt: "短木板失败后，又换一块同样短的，问题解决了吗？",
      instruction: "改法要针对失败原因。",
      difficultyNote: "无效修正识别：改了东西，但没有改关键条件。",
      sceneImage: scenes.bridgeRiverPlanks,
      sequence: ["宽河", "短木板", "太短", "短木板"],
      choices: [{ label: "还没解决", value: "not-fixed" }, { label: "已经解决", value: "fixed" }, { label: "不用改变", value: "no-change" }],
      answer: "not-fixed",
      success: "还是同样短，关键问题没有改，所以还没解决。",
      retry: "失败原因是太短，换同样短的还是不够。",
      parentPrompt: "问她：这次修改真的改变了失败原因吗？",
      abilityTags: ["试错调整", "因果解释"],
    },
    {
      level: "L6",
      prompt: "玩具已经分类了，却又全倒在地上，下一步怎么改？",
      instruction: "保留已经做好的部分，再继续完成。",
      difficultyNote: "保护成果修正：不要破坏已经完成的中间条件。",
      sceneImage: scenes.tidyPlayroomBlocks,
      sequence: ["玩具散了", "先分类", "玩具散了"],
      choices: [{ label: "放进盒子", value: "box" }, { label: "重新弄乱", value: "mess" }, { label: "只拿一个", value: "one" }],
      answer: "box",
      success: "已经分类了，接着放进盒子就好。",
      retry: "先保留已经做好的分类，再完成收纳。",
      parentPrompt: "问她：哪些事情已经做好了？下一步怎样保护它？",
      abilityTags: ["多步计划", "修正计划"],
    },
  ];

  return repeatTo(rounds, 24);
}

function makePriorityChoiceRounds(): RoundInput[] {
  const scenes = imageGallery.scenes;
  const rounds: RoundInput[] = [
    {
      level: "L4",
      prompt: "手脏了，桌上有盘子和饼干，先处理哪一个？",
      instruction: "先看哪个条件最影响后面能不能做。",
      difficultyNote: "单一优先级：先处理卫生条件，再处理工具和食物。",
      sceneImage: scenes.snackWashHands,
      sequence: ["手脏", "拿盘子", "拿饼干", "吃"],
      choices: [{ label: "先洗手", value: "wash" }, { label: "先拿盘子", value: "plate" }, { label: "先拿饼干", value: "cookie" }],
      answer: "wash",
      success: "手脏最先处理，洗手以后再拿盘子和饼干。",
      retry: "想想哪一件事不做，后面就不卫生。",
      parentPrompt: "问她：盘子和饼干都在，为什么还要先洗手？",
      abilityTags: ["优先级判断", "必要条件"],
    },
    {
      level: "L4",
      prompt: "路口到了，前面有斑马线和信号灯，先看什么？",
      instruction: "先找决定能不能走的信号。",
      difficultyNote: "安全优先：先看规则信号，再行动。",
      sceneImage: scenes.trafficCrosswalk,
      sequence: ["路口", "?", "走过去"],
      choices: [{ label: "先看灯", value: "look-light" }, { label: "先走过去", value: "walk" }, { label: "先看书包", value: "backpack" }],
      answer: "look-light",
      success: "先看灯，确定安全以后再走过去。",
      retry: "过马路先看能不能走，不是先走。",
      parentPrompt: "问她：什么信息能告诉我们现在能不能过马路？",
      abilityTags: ["安全规则", "优先级判断"],
    },
    {
      level: "L4",
      prompt: "宽河前有短木板和长木板，先选哪一个？",
      instruction: "先选最可能满足距离条件的材料。",
      difficultyNote: "关键材料优先：先选最可能解决问题的材料。",
      sceneImage: scenes.bridgeRiverPlanks,
      sequence: ["宽河", "短木板", "长木板", "🏁"],
      choices: [{ label: "先选长木板", value: "long" }, { label: "先选短木板", value: "short" }, { label: "先选小石头", value: "stone" }],
      answer: "long",
      success: "宽河要先选更可能够长的木板。",
      retry: "先比距离，宽河需要更长的材料。",
      parentPrompt: "问她：为什么不是先拿短木板试？",
      abilityTags: ["空间判断", "关键条件"],
    },
    {
      level: "L4",
      prompt: "玩具散了，盒子也打开了，先做什么更顺？",
      instruction: "先让后面的收纳更有顺序。",
      difficultyNote: "整理优先：先建立分类，再放进盒子。",
      sceneImage: scenes.tidyPlayroomBlocks,
      sequence: ["玩具散了", "放进盒子", "整齐"],
      choices: [{ label: "先分类", value: "sort" }, { label: "先随便塞", value: "stuff" }, { label: "先拿一个玩", value: "play-one" }],
      answer: "sort",
      success: "先分类，再放进盒子，整理会更顺。",
      retry: "想想哪一步能让后面少混乱。",
      parentPrompt: "问她：先分类以后，放进盒子会不会更容易？",
      abilityTags: ["整理计划", "优先级判断"],
    },
    {
      level: "L5",
      prompt: "小兔想拿胡萝卜，可是中间有小河，先处理什么？",
      instruction: "目标很清楚，但先要处理挡路的问题。",
      difficultyNote: "障碍优先：目标在后面，先处理阻碍目标的条件。",
      sceneImage: scenes.bridgeRiverPlanks,
      sequence: ["🐰", "🌊", "🥕"],
      choices: [{ label: "先搭桥", value: "bridge" }, { label: "先拿胡萝卜", value: "carrot" }, { label: "站在岸边等", value: "wait" }],
      answer: "bridge",
      success: "小河挡住了路，先搭桥才拿得到胡萝卜。",
      retry: "目标在对岸，先想怎么过去。",
      parentPrompt: "问她：胡萝卜是目标，小河是什么？",
      abilityTags: ["障碍处理", "关键条件"],
    },
    {
      level: "L5",
      prompt: "点心流程里，已经洗手了，盘子和饼干都在，先拿什么？",
      instruction: "已经满足的条件不用重复，接着看工具。",
      difficultyNote: "连续优先级：跳过已完成条件，选择下一关键步骤。",
      sceneImage: scenes.snackWashHands,
      sequence: ["先洗手", "?", "拿饼干", "吃"],
      choices: [{ label: "拿盘子", value: "plate" }, { label: "再洗手", value: "wash-again" }, { label: "直接吃", value: "eat-now" }],
      answer: "plate",
      success: "洗手已经完成，下一步先拿盘子。",
      retry: "先看哪些条件已经满足了，再找还缺哪一步。",
      parentPrompt: "问她：已经做过的步骤还要重复吗？",
      abilityTags: ["多步计划", "优先级判断"],
    },
    {
      level: "L5",
      prompt: "过马路时，小兔想走，车停着，但灯是红的，先听谁的？",
      instruction: "多个线索里，先看最明确的规则。",
      difficultyNote: "规则优先：有多个线索时，先按信号灯规则行动。",
      sceneImage: scenes.trafficCrosswalk,
      sequence: ["路口", "🔴", "走过去"],
      choices: [{ label: "先按红灯停", value: "red-stop" }, { label: "先跟小兔走", value: "rabbit-go" }, { label: "只看车停着", value: "car-stop" }],
      answer: "red-stop",
      success: "红灯是明确规则，要先停。",
      retry: "车停着也是线索，但红灯规则更关键。",
      parentPrompt: "问她：有几个线索时，哪个最能决定行动？",
      abilityTags: ["规则执行", "关键条件"],
    },
    {
      level: "L5",
      prompt: "蛋糕少了，小猫在厨房，小狗在睡觉，先看哪条线索？",
      instruction: "先看和蛋糕最直接相关的线索。",
      difficultyNote: "线索优先：先找强证据，再考虑弱线索。",
      sceneImage: scenes.cakeEvidenceKitchen,
      choices: [{ label: "先看奶油", value: "cream" }, { label: "先看谁在厨房", value: "kitchen" }, { label: "先看谁在远处", value: "far" }],
      answer: "cream",
      success: "奶油和蛋糕最直接相关，要优先看。",
      retry: "厨房是地点线索，奶油更能说明吃过蛋糕。",
      parentPrompt: "问她：哪条线索和蛋糕关系最近？",
      abilityTags: ["证据强弱", "优先级判断"],
    },
    {
      level: "L6",
      prompt: "水洒了，小熊近、小狗远、小鸟在窗边，先判断哪条线索？",
      instruction: "先找离事情发生处最近的线索。",
      difficultyNote: "关键线索优先：先排近处强线索，再看远处干扰。",
      sceneImage: scenes.spilledWaterRoom,
      choices: [{ label: "谁离杯子最近", value: "near-cup" }, { label: "谁在远处睡觉", value: "far-dog" }, { label: "谁在窗边", value: "window-bird" }],
      answer: "near-cup",
      success: "先看谁离倒下的杯子最近，这条线索最关键。",
      retry: "先找和洒水地点最接近的线索。",
      parentPrompt: "问她：远处线索和近处线索，哪个更重要？",
      abilityTags: ["关键线索", "证据推理"],
    },
    {
      level: "L6",
      prompt: "短木板失败后，有两种改法：换同样短的，或把木板接长，先选哪个？",
      instruction: "先改真正导致失败的条件。",
      difficultyNote: "失败原因优先：修正要针对关键失败原因。",
      sceneImage: scenes.bridgeRiverPlanks,
      sequence: ["宽河", "短木板", "太短", "?"],
      choices: [{ label: "把木板接长", value: "extend" }, { label: "换同样短木板", value: "same-short" }, { label: "继续用短木板", value: "same" }],
      answer: "extend",
      success: "失败原因是太短，所以先把木板接长。",
      retry: "没有改长度，问题就还在。",
      parentPrompt: "问她：哪一种改法真的改变了失败原因？",
      abilityTags: ["试错调整", "关键条件"],
    },
    {
      level: "L6",
      prompt: "玩具已经分类了，接下来有两个选择：放进盒子或重新分一遍，先做哪个？",
      instruction: "保留已经完成的成果，继续向目标走。",
      difficultyNote: "保护成果优先：不重复已经完成的中间步骤。",
      sceneImage: scenes.tidyPlayroomBlocks,
      sequence: ["玩具散了", "先分类", "?"],
      choices: [{ label: "放进盒子", value: "box" }, { label: "重新分类", value: "sort-again" }, { label: "重新弄乱", value: "mess" }],
      answer: "box",
      success: "已经分类了，先放进盒子，才能变整齐。",
      retry: "已经完成的步骤要保留，再做下一步。",
      parentPrompt: "问她：分类已经做好了，下一步怎样离整齐更近？",
      abilityTags: ["多步计划", "优先级判断"],
    },
    {
      level: "L6",
      prompt: "只知道小狗在房间里，玩具散了，先下结论还是先找更多线索？",
      instruction: "证据不够时，先补线索。",
      difficultyNote: "证据不足优先：先补证据，再下结论。",
      sceneImage: scenes.dogRoomWeakClue,
      choices: [{ label: "先找更多线索", value: "more-clues" }, { label: "直接说小狗弄乱", value: "dog-certain" }, { label: "直接说不是小狗", value: "not-dog" }],
      answer: "more-clues",
      success: "证据还不够，先找更多线索，再下结论。",
      retry: "在房间里只是可能，还不能直接确定。",
      parentPrompt: "问她：什么时候可以确定？什么时候应该继续找线索？",
      abilityTags: ["证据不足", "生活决策"],
    },
  ];

  return repeatTo(rounds, 24);
}

function makeRuleFilterRounds(): RoundInput[] {
  const scene = imageGallery.scenes.schoolbagPacking;
  const rounds: RoundInput[] = [
    {
      id: "school-day-book",
      level: "L4",
      prompt: "今天去上课，只能先装一样学习用品，选哪一个？",
      instruction: "先听规则：学习用品。",
      difficultyNote: "单条件筛选：只按用途判断，先排除玩具和衣物。",
      sceneImage: scene,
      visualGroups: [{ label: "桌上物品", items: ["书本", "玩具车", "雨衣"] }],
      choices: choiceSet(["书本", "玩具车", "雨衣"]),
      answer: "书本",
      success: "书本是学习用品，玩具车和雨衣不是这次要先装的学习用品。",
      retry: "先问自己：哪一个是上课会用的？",
      parentPrompt: "问她：你用的是“能不能学习”的规则，还是颜色规则？",
      abilityTags: ["规则筛选", "用途分类"],
    },
    {
      id: "school-day-pencil-case",
      level: "L4",
      prompt: "老师说先装能写字用的东西，选哪一个？",
      instruction: "先找和写字最直接相关的物品。",
      difficultyNote: "单条件筛选：在学习用品里继续按功能细分。",
      sceneImage: scene,
      visualGroups: [{ label: "桌上物品", items: ["文具盒", "书本", "帽子"] }],
      choices: choiceSet(["文具盒", "书本", "帽子"]),
      answer: "文具盒",
      success: "文具盒里放笔，和写字最直接相关。",
      retry: "书本也是学习用品，但这次规则是能写字用。",
      parentPrompt: "问她：书本为什么接近答案，但不是这题的答案？",
      abilityTags: ["功能判断", "排除干扰"],
    },
    {
      id: "outdoor-hat",
      level: "L4",
      prompt: "要去户外晒太阳，先选能戴在头上的东西，选哪一个？",
      instruction: "先听位置规则：戴在头上。",
      difficultyNote: "单条件筛选：按使用位置判断。",
      sceneImage: scene,
      visualGroups: [{ label: "桌上物品", items: ["帽子", "水壶", "书本"] }],
      choices: choiceSet(["帽子", "水壶", "书本"]),
      answer: "帽子",
      success: "帽子戴在头上，水壶和书本不戴在头上。",
      retry: "这次不是问能不能带出门，而是问戴在哪里。",
      parentPrompt: "问她：如果规则改成“能喝水用”，答案会变成什么？",
      abilityTags: ["规则筛选", "位置判断"],
    },
    {
      id: "rainy-day-raincoat",
      level: "L4",
      prompt: "外面下雨了，先装防雨用的东西，选哪一个？",
      instruction: "先按天气规则选。",
      difficultyNote: "生活场景筛选：把天气条件和物品用途连起来。",
      sceneImage: scene,
      visualGroups: [{ label: "桌上物品", items: ["雨衣", "帽子", "饭盒"] }],
      choices: choiceSet(["雨衣", "帽子", "饭盒"]),
      answer: "雨衣",
      success: "下雨时雨衣最能解决防雨问题。",
      retry: "帽子也能戴，但不如雨衣符合防雨规则。",
      parentPrompt: "问她：帽子为什么也有一点相关，但不是最好答案？",
      abilityTags: ["生活场景", "用途分类"],
    },
    {
      id: "need-drink",
      level: "L4",
      prompt: "路上会口渴，先装能喝水用的东西，选哪一个？",
      instruction: "先按需求找物品。",
      difficultyNote: "需求筛选：把身体需求和具体工具对应。",
      sceneImage: scene,
      visualGroups: [{ label: "桌上物品", items: ["水壶", "饭盒", "文具盒"] }],
      choices: choiceSet(["水壶", "饭盒", "文具盒"]),
      answer: "水壶",
      success: "水壶用来装水，最符合口渴这个需求。",
      retry: "饭盒也能带出门，但它不是主要用来喝水。",
      parentPrompt: "问她：这次规则是“能带出门”，还是“能喝水”？",
      abilityTags: ["需求匹配", "排除干扰"],
    },
    {
      id: "lunch-box",
      level: "L4",
      prompt: "中午要吃点心，先装能放食物的东西，选哪一个？",
      instruction: "先找和食物直接相关的物品。",
      difficultyNote: "功能筛选：从相近生活用品里选正确功能。",
      sceneImage: scene,
      visualGroups: [{ label: "桌上物品", items: ["饭盒", "水壶", "玩具车"] }],
      choices: choiceSet(["饭盒", "水壶", "玩具车"]),
      answer: "饭盒",
      success: "饭盒用来放食物，水壶主要用来装水。",
      retry: "水壶和饭盒都能装东西，但装的东西不一样。",
      parentPrompt: "问她：饭盒和水壶哪里像？哪里不一样？",
      abilityTags: ["功能判断", "细节比较"],
    },
    {
      id: "study-not-toy",
      level: "L5",
      prompt: "今天上课，规则是：要学习用品，不要玩具。选哪一个？",
      instruction: "先保留符合规则的，再排除玩具。",
      difficultyNote: "正反双规则：既要满足类别，又要避开排除项。",
      sceneImage: scene,
      visualGroups: [{ label: "桌上物品", items: ["文具盒", "玩具车", "饭盒"] }],
      choices: choiceSet(["文具盒", "玩具车", "饭盒"]),
      answer: "文具盒",
      success: "文具盒是学习用品，玩具车被规则排除了，饭盒不是学习用品。",
      retry: "先听完整规则：要学习用品，还不要玩具。",
      parentPrompt: "问她：哪个是被“不要玩具”排除掉的？",
      abilityTags: ["多条件判断", "排除干扰"],
    },
    {
      id: "outside-not-food",
      level: "L5",
      prompt: "要去操场，规则是：带户外用的，不带食物。选哪一个？",
      instruction: "先看是不是户外用，再看是不是食物类。",
      difficultyNote: "双条件筛选：在出门物品中排除食物干扰。",
      sceneImage: scene,
      visualGroups: [{ label: "桌上物品", items: ["帽子", "饭盒", "书本"] }],
      choices: choiceSet(["帽子", "饭盒", "书本"]),
      answer: "帽子",
      success: "帽子适合户外，饭盒和食物有关，书本不是户外优先物品。",
      retry: "不要只看能不能带走，要看是不是户外用。",
      parentPrompt: "问她：饭盒为什么相关，但被第二条规则排除了？",
      abilityTags: ["多条件判断", "生活场景"],
    },
    {
      id: "rain-and-wear",
      level: "L5",
      prompt: "下雨出门，规则是：能穿在身上，还能防雨。选哪一个？",
      instruction: "两个条件都要满足。",
      difficultyNote: "交集判断：同时满足穿戴和防雨两个条件。",
      sceneImage: scene,
      visualGroups: [{ label: "桌上物品", items: ["雨衣", "帽子", "水壶"] }],
      choices: choiceSet(["雨衣", "帽子", "水壶"]),
      answer: "雨衣",
      success: "雨衣能穿在身上，也能防雨，两个条件都满足。",
      retry: "帽子能戴，但防雨不够；水壶不能穿在身上。",
      parentPrompt: "问她：哪个只满足一个条件？哪个两个条件都满足？",
      abilityTags: ["交集判断", "生活场景"],
    },
    {
      id: "small-hard-safe",
      level: "L5",
      prompt: "书包空间小，规则是：小小的、硬硬的学习用品。选哪一个？",
      instruction: "先看学习用品，再看大小和形状。",
      difficultyNote: "多特征筛选：用途、大小和触感特征同时判断。",
      sceneImage: scene,
      visualGroups: [{ label: "桌上物品", items: ["文具盒", "书本", "雨衣"] }],
      choices: choiceSet(["文具盒", "书本", "雨衣"]),
      answer: "文具盒",
      success: "文具盒是学习用品，也比书本更小、更适合先放进小空间。",
      retry: "书本也是学习用品，但这次还有小小的、硬硬的条件。",
      parentPrompt: "问她：如果只说学习用品，书本可不可以？为什么这题不选它？",
      abilityTags: ["多特征观察", "规则筛选"],
    },
    {
      id: "rule-switch-drink",
      level: "L6",
      prompt: "刚才规则是学习用品，现在换成“能补充水分”。选哪一个？",
      instruction: "规则换了，答案也可能换。",
      difficultyNote: "规则切换：抑制旧规则，按新规则重新筛选。",
      sceneImage: scene,
      visualGroups: [{ label: "桌上物品", items: ["书本", "文具盒", "水壶"] }],
      choices: choiceSet(["水壶", "书本", "文具盒"]),
      answer: "水壶",
      success: "新规则是补充水分，所以水壶才符合。",
      retry: "不要停在刚才的学习用品规则，这次规则已经变了。",
      parentPrompt: "问她：规则换了以后，原来的答案还一定对吗？",
      abilityTags: ["认知灵活性", "规则切换"],
    },
    {
      id: "rule-switch-no-toy",
      level: "L6",
      prompt: "规则是：可以玩，但今天不能带去学校。谁应该留下？",
      instruction: "这次不是选要装的，而是选应该留下的。",
      difficultyNote: "反向筛选：根据禁止条件选出不该带的物品。",
      sceneImage: scene,
      visualGroups: [{ label: "桌上物品", items: ["玩具车", "书本", "水壶"] }],
      choices: choiceSet(["玩具车", "书本", "水壶"]),
      answer: "玩具车",
      success: "玩具车可以玩，但今天不能带去学校，所以应该留下。",
      retry: "注意题目问的是谁应该留下，不是谁要装进书包。",
      parentPrompt: "问她：这题的问题方向和前面一样吗？",
      abilityTags: ["反向思考", "抑制控制"],
    },
    {
      id: "two-true-one-better",
      level: "L6",
      prompt: "远足时口渴又要吃点心，书包只能先装一样，先装哪个更急？",
      instruction: "两个都相关时，先看更急的需求。",
      difficultyNote: "优先级筛选：多个相关选项里判断当前最关键需求。",
      sceneImage: scene,
      visualGroups: [{ label: "桌上物品", items: ["水壶", "饭盒", "玩具车"] }],
      choices: choiceSet(["水壶", "饭盒", "玩具车"]),
      answer: "水壶",
      success: "远足路上随时会口渴，水壶比饭盒更急，玩具车不符合任务。",
      retry: "饭盒也相关，但题目问只能先装一样，先处理更急的。",
      parentPrompt: "问她：水壶和饭盒都相关时，你怎么决定先后？",
      abilityTags: ["优先级判断", "多条件判断"],
    },
    {
      id: "exclude-almost-right",
      level: "L6",
      prompt: "规则是：装进书包后马上能在课堂上用。选哪一个？",
      instruction: "排除看起来能带、但课堂上不马上用的东西。",
      difficultyNote: "近似干扰筛选：错误项都能带出门，但不符合课堂即时用途。",
      sceneImage: scene,
      visualGroups: [{ label: "桌上物品", items: ["书本", "水壶", "帽子"] }],
      choices: choiceSet(["书本", "水壶", "帽子"]),
      answer: "书本",
      success: "书本能马上在课堂上用，水壶和帽子虽然能带，但不是课堂马上用的东西。",
      retry: "三个都能带出门，但只有一个符合课堂马上用。",
      parentPrompt: "问她：这三个哪里都相关？哪一个最符合完整规则？",
      abilityTags: ["近似干扰", "规则筛选"],
    },
  ];

  return repeatTo(rounds, 24);
}

function makeRelationPairRounds(): RoundInput[] {
  const scenes = imageGallery.scenes;
  const rounds: RoundInput[] = [
    {
      id: "bottle-water",
      level: "L4",
      prompt: "水壶和谁最容易配成一对？",
      instruction: "先想它主要用来装什么。",
      difficultyNote: "直接用途关系：从一个物品想到它最核心的用途。",
      sceneImage: scenes.schoolbagPacking,
      visualGroups: [
        { label: "目标", items: ["水壶"] },
        { label: "可选搭档", items: ["水", "饭盒", "铅笔"] },
      ],
      choices: choiceSet(["水", "饭盒", "铅笔"]),
      answer: "水",
      success: "水壶主要用来装水，所以水壶和水是一对。",
      retry: "饭盒也能装东西，但水壶最常装的是水。",
      parentPrompt: "问她：你是按颜色配，还是按用途配？",
      abilityTags: ["关系配对", "用途关系"],
    },
    {
      id: "pencil-case-pencil",
      level: "L4",
      prompt: "文具盒里最常放谁？",
      instruction: "先想这个东西里面通常装什么。",
      difficultyNote: "容器内容关系：把容器和常见内容配起来。",
      sceneImage: scenes.schoolbagPacking,
      visualGroups: [
        { label: "目标", items: ["文具盒"] },
        { label: "可选搭档", items: ["铅笔", "饼干", "雨衣"] },
      ],
      choices: choiceSet(["铅笔", "饼干", "雨衣"]),
      answer: "铅笔",
      success: "铅笔常放在文具盒里，它们是一对。",
      retry: "饼干和雨衣也能带出门，但不放在文具盒里。",
      parentPrompt: "问她：文具盒是装什么的？",
      abilityTags: ["容器关系", "关系配对"],
    },
    {
      id: "lunchbox-cookie",
      level: "L4",
      prompt: "饭盒和谁最容易配成一对？",
      instruction: "先想它主要用来装什么。",
      difficultyNote: "容器内容关系：在相近生活用品中找正确内容。",
      sceneImage: scenes.schoolbagPacking,
      visualGroups: [
        { label: "目标", items: ["饭盒"] },
        { label: "可选搭档", items: ["饼干", "水", "铅笔"] },
      ],
      choices: choiceSet(["饼干", "水", "铅笔"]),
      answer: "饼干",
      success: "饭盒常用来装食物，饼干是食物。",
      retry: "水更适合水壶，铅笔更适合文具盒。",
      parentPrompt: "问她：饭盒和水壶哪里像？分别装什么？",
      abilityTags: ["容器关系", "细节比较"],
    },
    {
      id: "fish-river",
      level: "L4",
      prompt: "小鱼最需要和谁配成一对？",
      instruction: "先想它应该生活在哪里。",
      difficultyNote: "生活位置关系：把动物和适合它的环境配起来。",
      sceneImage: scenes.animalHabitatPairs,
      visualGroups: [
        { label: "目标", items: ["小鱼"] },
        { label: "可选搭档", items: ["小河", "天空", "家"] },
      ],
      choices: choiceSet(["小河", "天空", "家"]),
      answer: "小河",
      success: "小鱼生活在水里，小河和小鱼是一对。",
      retry: "天空适合小鸟，不适合小鱼。",
      parentPrompt: "问她：小鱼离开水会怎样？",
      abilityTags: ["位置关系", "生活常识"],
    },
    {
      id: "bird-sky",
      level: "L4",
      prompt: "小鸟常和谁配成一对？",
      instruction: "先想它通常在哪里飞。",
      difficultyNote: "生活位置关系：把动物和活动空间配起来。",
      sceneImage: scenes.animalHabitatPairs,
      visualGroups: [
        { label: "目标", items: ["小鸟"] },
        { label: "可选搭档", items: ["天空", "小河", "盒子"] },
      ],
      choices: choiceSet(["天空", "小河", "盒子"]),
      answer: "天空",
      success: "小鸟在天空飞，所以小鸟和天空是一对。",
      retry: "小河更适合小鱼，盒子不是小鸟飞的地方。",
      parentPrompt: "问她：小鱼和小鸟的家一样吗？",
      abilityTags: ["位置关系", "关系配对"],
    },
    {
      id: "key-door",
      level: "L4",
      prompt: "钥匙和谁最容易配成一对？",
      instruction: "先想它能帮我们打开什么。",
      difficultyNote: "工具对象关系：工具和它作用的对象相配。",
      sceneImage: scenes.keyDoorEntry,
      visualGroups: [
        { label: "目标", items: ["钥匙"] },
        { label: "可选搭档", items: ["门", "饭盒", "足球"] },
      ],
      choices: choiceSet(["门", "饭盒", "足球"]),
      answer: "门",
      success: "钥匙用来开门，钥匙和门是一对。",
      retry: "饭盒和足球也能拿在手里，但钥匙最常用来开门。",
      parentPrompt: "问她：钥匙做了什么事？它帮谁打开？",
      abilityTags: ["工具关系", "关系配对"],
    },
    {
      id: "schoolbag-book-analogy",
      level: "L5",
      prompt: "书包配书本，像饭盒配什么？",
      instruction: "先看例子：一个容器配它装的东西。",
      difficultyNote: "简单类比：把同一种容器内容关系迁移到新物品。",
      sceneImage: scenes.schoolbagPacking,
      visualGroups: [
        { label: "例子", items: ["书包", "书本"] },
        { label: "新目标", items: ["饭盒"] },
        { label: "可选搭档", items: ["饼干", "水", "铅笔"] },
      ],
      choices: choiceSet(["饼干", "水", "铅笔"]),
      answer: "饼干",
      success: "书包装书本，饭盒装食物，所以饭盒配饼干。",
      retry: "先说例子里的关系：谁装着谁？再换到饭盒。",
      parentPrompt: "问她：这两对是不是都在说“装进去”？",
      abilityTags: ["类比推理", "容器关系"],
    },
    {
      id: "bottle-case-analogy",
      level: "L5",
      prompt: "水壶配水，像文具盒配什么？",
      instruction: "先找同一种关系：里面常装什么。",
      difficultyNote: "简单类比：容器内容关系从生活用品迁移到学习用品。",
      sceneImage: scenes.schoolbagPacking,
      visualGroups: [
        { label: "例子", items: ["水壶", "水"] },
        { label: "新目标", items: ["文具盒"] },
        { label: "可选搭档", items: ["铅笔", "饭盒", "雨衣"] },
      ],
      choices: choiceSet(["铅笔", "饭盒", "雨衣"]),
      answer: "铅笔",
      success: "水壶里常装水，文具盒里常放铅笔。",
      retry: "不要只看都能带出门，要看里面装什么。",
      parentPrompt: "问她：水壶和文具盒哪里像？",
      abilityTags: ["类比推理", "相近干扰"],
    },
    {
      id: "fish-bird-analogy",
      level: "L5",
      prompt: "小鱼配小河，像小鸟配什么？",
      instruction: "先看动物和活动地方的关系。",
      difficultyNote: "生活类比：把动物与环境关系迁移到另一个动物。",
      sceneImage: scenes.animalHabitatPairs,
      visualGroups: [
        { label: "例子", items: ["小鱼", "小河"] },
        { label: "新目标", items: ["小鸟"] },
        { label: "可选搭档", items: ["天空", "小河", "家"] },
      ],
      choices: choiceSet(["天空", "小河", "家"]),
      answer: "天空",
      success: "小鱼在小河里，小鸟在天空飞。",
      retry: "例子不是同类关系，而是动物和它活动的地方。",
      parentPrompt: "问她：如果换成小狗，它更配什么地方？",
      abilityTags: ["类比推理", "位置关系"],
    },
    {
      id: "sun-raincoat-analogy",
      level: "L5",
      prompt: "太阳大时配帽子，下雨时配什么？",
      instruction: "先想不同天气分别需要什么。",
      difficultyNote: "场景类比：天气条件变化时，选择对应保护用品。",
      sceneImage: scenes.schoolbagPacking,
      visualGroups: [
        { label: "例子", items: ["太阳", "帽子"] },
        { label: "可选搭档", items: ["雨衣", "水壶", "书本"] },
      ],
      choices: choiceSet(["雨衣", "水壶", "书本"]),
      answer: "雨衣",
      success: "太阳大时戴帽子，下雨时穿雨衣。",
      retry: "水壶和书本也能带出门，但它们不解决下雨的问题。",
      parentPrompt: "问她：帽子和雨衣都在保护我们，分别保护什么情况？",
      abilityTags: ["生活场景", "类比推理"],
    },
    {
      id: "thirst-hungry",
      level: "L5",
      prompt: "口渴配水壶，饿了配什么？",
      instruction: "先看需要，再找能解决需要的东西。",
      difficultyNote: "需求类比：把身体需求和解决工具对应起来。",
      sceneImage: scenes.schoolbagPacking,
      visualGroups: [
        { label: "例子", items: ["水壶", "水"] },
        { label: "可选搭档", items: ["饭盒", "帽子", "文具盒"] },
      ],
      choices: choiceSet(["饭盒", "帽子", "文具盒"]),
      answer: "饭盒",
      success: "口渴时需要喝水，饿了时需要食物，饭盒和食物关系最近。",
      retry: "帽子解决晒太阳，文具盒解决写字，不解决饿了。",
      parentPrompt: "问她：这题是按物品长相配，还是按需要配？",
      abilityTags: ["需求匹配", "类比推理"],
    },
    {
      id: "door-river-tool",
      level: "L6",
      prompt: "钥匙能帮我们过门，小河挡路时什么能帮我们过去？",
      instruction: "先找“解决障碍”的关系。",
      difficultyNote: "抽象关系迁移：从开门工具迁移到过河工具。",
      sceneImage: scenes.bridgeRiverPlanks,
      visualGroups: [
        { label: "例子", items: ["钥匙", "门"] },
        { label: "新问题", items: ["小河"] },
        { label: "可选工具", items: ["长木板", "帽子", "饭盒"] },
      ],
      choices: choiceSet(["长木板", "帽子", "饭盒"]),
      answer: "长木板",
      success: "钥匙帮我们过门，长木板能帮我们过小河。",
      retry: "这题不是找同类物品，而是找能解决障碍的工具。",
      parentPrompt: "问她：门和小河都挡住了路，分别用什么解决？",
      abilityTags: ["抽象关系", "类比推理"],
    },
    {
      id: "two-containers",
      level: "L6",
      prompt: "水壶和饭盒都能装东西，谁和饼干关系更近？",
      instruction: "先找内容是什么，再决定搭档。",
      difficultyNote: "相近干扰：两个选项都是容器，需要按内容细分。",
      sceneImage: scenes.schoolbagPacking,
      visualGroups: [
        { label: "内容", items: ["饼干"] },
        { label: "可选搭档", items: ["饭盒", "水壶", "书包"] },
      ],
      choices: choiceSet(["饭盒", "水壶", "书包"]),
      answer: "饭盒",
      success: "三个都能装东西，但饼干更适合放进饭盒。",
      retry: "水壶装水更合适，书包装书本文具更合适。",
      parentPrompt: "问她：为什么“都能装”还不够？还要看装什么？",
      abilityTags: ["相近干扰", "细节比较"],
    },
    {
      id: "not-same-kind",
      level: "L6",
      prompt: "书本和文具盒都是学习用品，但谁和文具盒是“装在里面”的关系？",
      instruction: "不要只看同类，要看题目问的关系。",
      difficultyNote: "关系优先：在同类干扰中排除不符合关系的选项。",
      sceneImage: scenes.schoolbagPacking,
      visualGroups: [
        { label: "目标", items: ["文具盒"] },
        { label: "可选搭档", items: ["铅笔", "书本", "书包"] },
      ],
      choices: choiceSet(["铅笔", "书本", "书包"]),
      answer: "铅笔",
      success: "书本也是学习用品，但铅笔更像是放进文具盒里的东西。",
      retry: "题目不是问谁也是学习用品，而是问谁装在文具盒里。",
      parentPrompt: "问她：同类关系和装进去的关系，有什么不一样？",
      abilityTags: ["关系辨别", "相近干扰"],
    },
    {
      id: "reverse-pair",
      level: "L6",
      prompt: "看到水，应该想到水壶；看到铅笔，应该想到谁？",
      instruction: "这次从内容反过来找容器。",
      difficultyNote: "反向关系：从内容倒推对应容器或收纳物。",
      sceneImage: scenes.schoolbagPacking,
      visualGroups: [
        { label: "例子", items: ["水", "水壶"] },
        { label: "新内容", items: ["铅笔"] },
        { label: "可选搭档", items: ["文具盒", "饭盒", "雨衣"] },
      ],
      choices: choiceSet(["文具盒", "饭盒", "雨衣"]),
      answer: "文具盒",
      success: "水想到水壶，铅笔可以想到文具盒。",
      retry: "这次是从里面的东西，反过来找装它的东西。",
      parentPrompt: "问她：顺着找和反着找，关系有没有变？",
      abilityTags: ["反向思考", "类比推理"],
    },
    {
      id: "best-reason",
      level: "L6",
      prompt: "小鸟、天空、风筝都在图里，小鸟和天空为什么更像一对？",
      instruction: "先找最稳定的生活关系。",
      difficultyNote: "解释型配对：相近选项都相关，需要说出更稳定的关系。",
      sceneImage: scenes.animalHabitatPairs,
      visualGroups: [
        { label: "观察", items: ["小鸟", "天空", "风筝"] },
        { label: "可选搭档", items: ["天空", "风筝", "小河"] },
      ],
      choices: choiceSet(["天空", "风筝", "小河"]),
      answer: "天空",
      success: "风筝也在天上，但小鸟和天空的关系更稳定：小鸟在天空飞。",
      retry: "不要只看谁靠得近或谁都在天上，要找最稳定的生活关系。",
      parentPrompt: "问她：风筝为什么也相关？为什么最后还是选天空？",
      abilityTags: ["证据解释", "相近干扰"],
    },
  ];

  return repeatTo(rounds, 24);
}

function makeBridgeRounds(): RoundInput[] {
  const bridgePlankScene = imageGallery.scenes.bridgeRiverPlanks;
  const bridgeNarrowScene = imageGallery.scenes.bridgeNarrowRiver;
  const bridgeWideScene = imageGallery.scenes.bridgeWideRiver;
  const bridgeTwoPlanksScene = imageGallery.scenes.bridgeTwoPlanks;
  const bridgeIslandScene = imageGallery.scenes.bridgeIslandStep;
  const rounds: RoundInput[] = [
    {
      level: "L3",
      prompt: "小熊要搭桥，先看什么再选木板？",
      instruction: "先看河有多宽，再判断木板够不够。",
      sceneImage: bridgeNarrowScene,
      sequence: ["🐻", "🌊", "长木板", "短木板", "🏁"],
      choices: [{ label: "河有多宽", value: "river-width" }, { label: "木板颜色", value: "plank-color" }, { label: "小旗颜色", value: "flag-color" }],
      answer: "river-width",
      success: "对，先看河有多宽，才知道哪块木板够长。",
      retry: "搭桥不是先看好不好看，要先看距离够不够。",
      parentPrompt: "问她：如果不看河宽，可能会选错什么？",
      abilityTags: ["空间判断"],
    },
    {
      level: "L5",
      prompt: "河变宽了，一块木板不够。怎么办？",
      instruction: "可以把两块木板接起来。",
      sceneImage: bridgeWideScene,
      sequence: ["🐻", "宽河", "?", "🏁"],
      choices: [{ label: "用两块木板", value: "two-planks" }, { label: "只用短木板", value: "short" }, { label: "不搭桥", value: "none" }],
      answer: "two-planks",
      success: "两块木板接起来，长度才够。",
      retry: "一块不够时，可以想怎么合起来。",
      parentPrompt: "问她：两块合起来会不会比一块更长？",
      abilityTags: ["规划"],
    },
    {
      level: "L6",
      prompt: "只能用 2 块木板，哪种计划更好？",
      instruction: "先选长的，再用短的补上。",
      sceneImage: bridgeTwoPlanksScene,
      visualGroups: [
        { label: "木板", items: ["长", "短", "太短"] },
        { label: "限制", items: ["只能用2块"] },
      ],
      choices: [{ label: "长 + 短", value: "long-short" }, { label: "短 + 太短", value: "short-tiny" }, { label: "太短 + 太短", value: "tiny-tiny" }],
      answer: "long-short",
      success: "长木板加短木板更可能够到对岸。",
      retry: "只能用两块，要先选更有用的木板。",
      parentPrompt: "问她：你是先随便试，还是先想哪个更可能成功？",
      abilityTags: ["试错调整"],
    },
  ];
  const variants = [
    {
      prompt: "小兔要过窄河，应该选哪块木板？",
      sceneImage: bridgeNarrowScene,
      animal: "🐰",
      seq: ["🐰", "🌊", "?", "🏁"],
      answer: "long",
      choices: [{ label: "长木板", value: "long" }, { label: "短木板", value: "short" }, { label: "太短木板", value: "tiny" }],
      success: "长木板能到对岸。",
    },
    {
      prompt: "小狗要过宽河，一块木板不够，怎么办？",
      sceneImage: bridgeWideScene,
      animal: "🐶",
      seq: ["🐶", "宽河", "?", "🏁"],
      answer: "two-planks",
      choices: [{ label: "用两块木板", value: "two-planks" }, { label: "只用长木板", value: "long-only" }, { label: "只用短木板", value: "short-only" }],
      success: "两块木板接起来才够。",
    },
    {
      prompt: "小猫只能拿两块木板，哪种更稳？",
      sceneImage: bridgeTwoPlanksScene,
      animal: "🐱",
      seq: ["🐱", "宽河", "只能用2块", "?", "🏁"],
      answer: "long-short",
      choices: [{ label: "长 + 短", value: "long-short" }, { label: "短 + 太短", value: "short-tiny" }, { label: "太短 + 太短", value: "tiny-tiny" }],
      success: "长木板加短木板更稳。",
    },
    {
      prompt: "小熊面前有石头和木板，过河用什么更好？",
      sceneImage: bridgeNarrowScene,
      animal: "🐻",
      seq: ["🐻", "🌊", "小石头", "?", "🏁"],
      answer: "long",
      choices: [{ label: "长木板", value: "long" }, { label: "小石头", value: "stone" }, { label: "不搭桥", value: "none" }],
      success: "木板能连到对岸，更适合过河。",
    },
    {
      prompt: "河中间有一个小岛，应该怎么搭？",
      sceneImage: bridgeIslandScene,
      animal: "🐰",
      seq: ["🐰", "🌊", "小岛", "?", "🏁"],
      answer: "two-planks",
      choices: [{ label: "用两块木板", value: "two-planks" }, { label: "只用长木板", value: "long-only" }, { label: "不搭桥", value: "none" }],
      success: "先到小岛，再到对岸，是两步计划。",
    },
  ].map((variant, index) => ({
    level: index < 2 ? "L4" as AbilityLevel : "L6" as AbilityLevel,
    prompt: variant.prompt,
    instruction: "先看距离，再选材料。",
    sceneImage: variant.sceneImage,
    sequence: variant.seq,
    choices: variant.choices,
    answer: variant.answer,
    success: variant.success,
    retry: "先想哪一种能到对岸，再动手试。",
    parentPrompt: "问她：你先预测了什么？如果失败，下一步怎么改？",
    abilityTags: ["空间判断", "规划"],
  }));
  return repeatTo([...rounds, ...variants], 24);
}

function makeSameKindRounds(): RoundInput[] {
  const sameKindCases = [
    {
      groupName: "水果",
      items: ["🍎", "🍊", "🍓"],
      answer: "葡萄",
      distractors: ["蛋糕", "糖果"],
      clue: "它们都能吃，都是水果。",
    },
    {
      groupName: "交通工具",
      items: ["小汽车", "公交车", "自行车"],
      answer: "飞机",
      distractors: ["风筝", "足球"],
      clue: "它们都能带我们去别的地方。",
    },
    {
      groupName: "学习用品",
      items: ["铅笔", "书包", "尺子"],
      answer: "书本",
      distractors: ["积木塔", "风筝"],
      clue: "它们常常在书桌或书包里。",
    },
    {
      groupName: "陆地小动物",
      items: ["🐱", "🐶", "🐰"],
      answer: "小熊",
      distractors: ["小鸟", "小鱼"],
      clue: "它们都是常在地上走的动物。",
    },
    {
      groupName: "圆圆的东西",
      items: ["⚽", "🍊", "🔴"],
      answer: "饼干",
      distractors: ["尺子", "长木板"],
      clue: "它们看起来都是圆圆的。",
    },
    {
      groupName: "可以吃的东西",
      items: ["🍪", "🍬", "葡萄"],
      answer: "蛋糕",
      distractors: ["杯子", "盘子"],
      clue: "这些都可以吃。",
    },
  ];

  const rounds: RoundInput[] = sameKindCases.map((item, index) => ({
    level: index < 3 ? "L4" : "L5",
    prompt: `这些是一家：${item.groupName}。谁也应该住进来？`,
    instruction: "先说共同点，再选同一类。",
    visualGroups: [{ label: "这一家", items: item.items }],
    choices: choiceSet([item.answer, ...item.distractors]),
    answer: item.answer,
    success: `${item.answer}也属于${item.groupName}。${item.clue}`,
    retry: "不要只看颜色，先想它们都是什么。",
    parentPrompt: "问她：这几个东西哪里一样？你用什么规则分的？",
    abilityTags: ["类别归纳", "观察角度"],
  }));

  const oddCases = [
    { items: ["🍎", "🍊", "葡萄", "小汽车"], answer: "小汽车", reason: "只有小汽车不是水果。" },
    { items: ["小汽车", "公交车", "飞机", "蛋糕"], answer: "蛋糕", reason: "蛋糕不能当交通工具。" },
    { items: ["铅笔", "书包", "尺子", "小鱼"], answer: "小鱼", reason: "小鱼不是学习用品。" },
    { items: ["🐱", "🐶", "🐰", "杯子"], answer: "杯子", reason: "杯子不是小动物。" },
    { items: ["⚽", "🍊", "饼干", "长木板"], answer: "长木板", reason: "长木板不是圆圆的。" },
    { items: ["小鸟", "飞机", "小鱼", "风筝"], answer: "小鱼", reason: "小鱼不会在天上飞。" },
  ].map((item, index) => ({
    level: index < 3 ? "L5" as AbilityLevel : "L6" as AbilityLevel,
    prompt: "哪一个和其他几个最不一样？",
    instruction: "用排除法，先找多数有什么共同点。",
    visualGroups: [{ label: "观察台", items: item.items }],
    choices: choiceSet(item.items),
    answer: item.answer,
    success: item.reason,
    retry: "先找三个很像的，再看剩下的那个。",
    parentPrompt: "问她：你先把哪三个放在一起？为什么剩下它？",
    abilityTags: ["排除法", "类别归纳"],
  }));

  return repeatTo([...rounds, ...oddCases], 24);
}

function makeNumberPatternRounds(): RoundInput[] {
  const cases = [
    { seq: ["1", "2", "3", "4", "?"], answer: "5", rule: "每次多 1。", level: "L4" },
    { seq: ["2", "4", "6", "8", "?"], answer: "10", rule: "每次跳 2 格。", level: "L5" },
    { seq: ["5", "4", "3", "2", "?"], answer: "1", rule: "每次少 1。", level: "L4" },
    { seq: ["1", "3", "5", "7", "?"], answer: "9", rule: "隔一个数看，是单数小路。", level: "L6" },
    { seq: ["0", "2", "4", "6", "?"], answer: "8", rule: "这些都是双数，每次多 2。", level: "L6" },
    { seq: ["1", "2", "1", "2", "?"], answer: "1", rule: "1 和 2 轮流出现。", level: "L4" },
    { seq: ["3", "3", "4", "4", "?"], answer: "5", rule: "每个数出现两次，再换下一个。", level: "L5" },
    { seq: ["1", "1", "2", "3", "3", "?"], answer: "4", rule: "先看颜色，再看数字往前走。", level: "L6" },
    { seq: ["10", "9", "8", "7", "?"], answer: "6", rule: "倒着走，每次少 1。", level: "L5" },
    { seq: ["2", "3", "4", "5", "?"], answer: "6", rule: "从 2 开始，每次多 1。", level: "L4" },
    { seq: ["1", "3", "1", "3", "?"], answer: "1", rule: "1 和 3 轮流出现。", level: "L4" },
    { seq: ["4", "6", "8", "10", "?"], answer: "12", rule: "每次多 2。", level: "L6" },
  ] as const;

  return cases.map((item) => ({
    level: item.level,
    prompt: "数字小路下一步走到哪里？",
    instruction: "从左到右读一读，找数字怎么变化。",
    sequence: [...item.seq],
    choices: numberChoices(Number(item.answer), 1, 12),
    answer: item.answer,
    success: item.rule,
    retry: "先看前两个数差多少，再看后面是不是一样。",
    parentPrompt: "问她：它是每次多一点、少一点，还是轮流出现？",
    abilityTags: ["数列规律", item.rule.includes("轮流") ? "重复模式" : "跳数"],
  }));
}

function makeAddressMapRounds(): RoundInput[] {
  const sceneImage = imageGallery.scenes.treasureMapGrid;
  const smallGrid = {
    columns: ["1", "2", "3"],
    rows: ["A", "B", "C"],
    cells: [
      ["小鸟", "小狗", "积木塔"],
      ["足球", "小猫", "铅笔"],
      ["书包", "小鱼", "葡萄"],
    ],
  };
  const bigGrid = {
    columns: ["1", "2", "3", "4"],
    rows: ["A", "B", "C", "D"],
    cells: [
      ["三角尺", "书包", "足球", "铅笔"],
      ["小狗", "小鸟", "积木塔", "葡萄"],
      ["饼干", "小鱼", "小汽车", "杯子"],
      ["公交车", "小熊", "蛋糕", "草莓"],
    ],
  };

  const findObject = [
    { grid: smallGrid, address: "A1", answer: "小鸟", level: "L4" },
    { grid: smallGrid, address: "A3", answer: "积木塔", level: "L4" },
    { grid: smallGrid, address: "B2", answer: "小猫", level: "L5" },
    { grid: smallGrid, address: "C1", answer: "书包", level: "L5" },
    { grid: bigGrid, address: "A4", answer: "铅笔", level: "L5" },
    { grid: bigGrid, address: "B3", answer: "积木塔", level: "L5" },
    { grid: bigGrid, address: "C2", answer: "小鱼", level: "L6" },
    { grid: bigGrid, address: "D4", answer: "草莓", level: "L6" },
  ].map((item) => ({
    level: item.level as AbilityLevel,
    prompt: `${item.address} 里藏着什么？`,
    instruction: "先找字母行，再找数字列。",
    sceneImage,
    grid: item.grid,
    choices: choiceSet([item.answer, ...gridDistractors(item.grid, item.answer)]),
    answer: item.answer,
    success: `${item.address} 的格子里是${item.answer}。`,
    retry: "先用手指找到字母，再横着找到数字。",
    parentPrompt: "请她说：我先找哪一行，再找哪一列。",
    abilityTags: ["二维定位", "行列对应"],
  }));

  const findAddress = [
    { grid: smallGrid, target: "小狗", answer: "A2", choices: ["A2", "B1", "C2"], level: "L5" },
    { grid: smallGrid, target: "葡萄", answer: "C3", choices: ["A3", "B3", "C3"], level: "L5" },
    { grid: bigGrid, target: "足球", answer: "A3", choices: ["A3", "B3", "C3"], level: "L6" },
    { grid: bigGrid, target: "蛋糕", answer: "D3", choices: ["C3", "D3", "D4"], level: "L6" },
  ].map((item) => ({
    level: item.level as AbilityLevel,
    prompt: `${item.target}住在哪个地址？`,
    instruction: "先找到物品，再读左边字母和上面数字。",
    sceneImage,
    grid: item.grid,
    choices: choiceSet(item.choices),
    answer: item.answer,
    success: `${item.target}住在 ${item.answer}。`,
    retry: "找到物品以后，先看这一行的字母，再看这一列的数字。",
    parentPrompt: "问她：这个地址为什么先说字母，再说数字？",
    abilityTags: ["位置表达", "二维定位"],
  }));

  return repeatTo([...findObject, ...findAddress], 24);
}

function makeMatrixPuzzleRounds(): RoundInput[] {
  const sceneImage = imageGallery.scenes.patternPuzzleBoard;
  const cases = [
    {
      cells: [["🔴", "🔵", "🔴🔵"], ["🟡", "🟢", "🟡🟢"], ["🟣", "🔴", "?"]],
      choices: ["🟣🔴", "🔴🔵", "🟡🟢"],
      answer: "🟣🔴",
      rule: "每一行的最后一格，是前两格合在一起。",
      level: "L5",
    },
    {
      cells: [["🍎", "🍊", "🍎"], ["小猫", "小狗", "小猫"], ["🔴", "🔵", "?"]],
      choices: ["🔴", "🔵", "🟡"],
      answer: "🔴",
      rule: "每一行都是第一个、第二个、再回到第一个。",
      level: "L5",
    },
    {
      cells: [["大圆", "小圆", "大圆"], ["大星", "小星", "大星"], ["大方块", "小方块", "?"]],
      choices: ["大方块", "小方块", "小星"],
      answer: "大方块",
      rule: "每一行都是大、小、大。",
      level: "L5",
    },
    {
      cells: [["🔴", "🟡", "🟢"], ["🟡", "🟢", "🔴"], ["🟢", "🔴", "?"]],
      choices: ["🟡", "🟢", "🔵"],
      answer: "🟡",
      rule: "每一行都轮流换位置，红黄绿都要出现一次。",
      level: "L6",
    },
    {
      cells: [["🍎", "1", "🍎"], ["🍊", "2", "🍊🍊"], ["🍓", "3", "?"]],
      choices: ["🍓🍓🍓", "🍓🍓", "🍊🍊🍊"],
      answer: "🍓🍓🍓",
      rule: "中间数字是几，右边就有几个一样的东西。",
      level: "L6",
    },
    {
      cells: [["小鸟", "天空", "小鸟天空"], ["小鱼", "小河", "小鱼小河"], ["小狗", "家", "?"]],
      choices: ["小狗家", "小河小狗", "天空家"],
      answer: "小狗家",
      rule: "每一行把前两个线索连成一个小故事。",
      level: "L6",
    },
  ] as const;

  return repeatTo(cases.map((item) => ({
    level: item.level,
    prompt: "待补位置这一格应该放什么？",
    instruction: "先横着看一行，再竖着检查一下。",
    sceneImage,
    matrix: { cells: item.cells.map((row) => [...row]) },
    choices: choiceSet(item.choices),
    answer: item.answer,
    success: item.rule,
    retry: "先看每一行前两格和最后一格有什么关系。",
    parentPrompt: "请她说：这一行是怎么变出来的？",
    abilityTags: ["二维规律", item.rule.includes("合") || item.rule.includes("连") ? "图形组合" : "多特征观察"],
  })), 18);
}

function makePositionMapRounds(): RoundInput[] {
  const sceneImage = imageGallery.scenes.positionPlayroom;
  const horizontalGrid = {
    columns: ["左", "中", "右"],
    rows: ["位置"],
    cells: [["小狗", "小猫", "小兔"]],
  };
  const verticalGrid = {
    columns: ["位置"],
    rows: ["上", "中", "下"],
    cells: [["小鸟"], ["书包"], ["小鱼"]],
  };
  const roomGrid = {
    columns: ["左", "中", "右"],
    rows: ["上", "中", "下"],
    cells: [
      ["小鸟", "风筝", "飞机"],
      ["小狗", "盒子", "小猫"],
      ["足球", "书包", "小鱼"],
    ],
  };

  const rounds: RoundInput[] = [
    {
      level: "L4",
      prompt: "谁在小猫的左边？",
      instruction: "先找到小猫，再看左边。",
      sceneImage,
      grid: horizontalGrid,
      choices: choiceSet(["小狗", "小兔", "小猫"]),
      answer: "小狗",
      success: "小狗在小猫的左边。",
      retry: "先用手指点小猫，再往左边看。",
      parentPrompt: "问她：如果从小狗看，小猫在它的哪边？",
      abilityTags: ["左右方位", "相对位置"],
    },
    {
      level: "L4",
      prompt: "谁在小猫的右边？",
      instruction: "先找到小猫，再看右边。",
      sceneImage,
      grid: horizontalGrid,
      choices: choiceSet(["小狗", "小兔", "小猫"]),
      answer: "小兔",
      success: "小兔在小猫的右边。",
      retry: "右边是小猫旁边的另一边。",
      parentPrompt: "问她：左边和右边是不是会跟着看的方向变？",
      abilityTags: ["左右方位", "相对位置"],
    },
    {
      level: "L4",
      prompt: "谁在书包的上面？",
      instruction: "先找到书包，再往上看。",
      sceneImage,
      grid: verticalGrid,
      choices: choiceSet(["小鸟", "小鱼", "书包"]),
      answer: "小鸟",
      success: "小鸟在书包的上面。",
      retry: "找到书包以后，往上一格看。",
      parentPrompt: "请她用手指从中间往上移动。",
      abilityTags: ["上下方位"],
    },
    {
      level: "L4",
      prompt: "谁在书包的下面？",
      instruction: "先找到书包，再往下看。",
      sceneImage,
      grid: verticalGrid,
      choices: choiceSet(["小鸟", "小鱼", "书包"]),
      answer: "小鱼",
      success: "小鱼在书包的下面。",
      retry: "下面是在书包往下的那一格。",
      parentPrompt: "问她：小鸟和小鱼分别在书包的哪边？",
      abilityTags: ["上下方位"],
    },
    {
      level: "L5",
      prompt: "盒子的左边是什么？",
      instruction: "先找到盒子，再看左边一格。",
      sceneImage,
      grid: roomGrid,
      choices: choiceSet(["小狗", "小猫", "书包"]),
      answer: "小狗",
      success: "盒子的左边是小狗。",
      retry: "盒子在中间，左边那格是小狗。",
      parentPrompt: "问她：如果看盒子的右边，会是谁？",
      abilityTags: ["二维定位", "左右方位"],
    },
    {
      level: "L5",
      prompt: "盒子的右边是什么？",
      instruction: "先找到盒子，再看右边一格。",
      sceneImage,
      grid: roomGrid,
      choices: choiceSet(["小狗", "小猫", "书包"]),
      answer: "小猫",
      success: "盒子的右边是小猫。",
      retry: "从盒子出发，往右边看。",
      parentPrompt: "问她：小猫在盒子的哪边？盒子在小猫的哪边？",
      abilityTags: ["二维定位", "相对位置"],
    },
    {
      level: "L5",
      prompt: "盒子的上面是什么？",
      instruction: "先找到盒子，再看上面一格。",
      sceneImage,
      grid: roomGrid,
      choices: choiceSet(["风筝", "足球", "小鱼"]),
      answer: "风筝",
      success: "风筝在盒子的上面。",
      retry: "盒子上方那格是风筝。",
      parentPrompt: "请她说出盒子的上、下、左、右各是什么。",
      abilityTags: ["二维定位", "上下方位"],
    },
    {
      level: "L5",
      prompt: "盒子的下面是什么？",
      instruction: "先找到盒子，再看下面一格。",
      sceneImage,
      grid: roomGrid,
      choices: choiceSet(["风筝", "书包", "飞机"]),
      answer: "书包",
      success: "书包在盒子的下面。",
      retry: "从盒子往下走一格。",
      parentPrompt: "问她：风筝和书包谁在上，谁在下？",
      abilityTags: ["二维定位", "上下方位"],
    },
  ];

  const insideOutside: RoundInput[] = [
    {
      level: "L5",
      prompt: "谁在盒子里面？",
      instruction: "看清楚里面和外面。",
      sceneImage,
      visualGroups: [
        { label: "盒子里面", items: ["小鱼"] },
        { label: "盒子外面", items: ["小猫", "小狗"] },
      ],
      choices: choiceSet(["小鱼", "小猫", "小狗"]),
      answer: "小鱼",
      success: "小鱼在盒子里面。",
      retry: "里面是被盒子装住的地方。",
      parentPrompt: "问她：外面有谁？里面有谁？",
      abilityTags: ["里外方位"],
    },
    {
      level: "L5",
      prompt: "谁在盒子外面？",
      instruction: "这次找没有被装进去的。",
      sceneImage,
      visualGroups: [
        { label: "盒子里面", items: ["足球", "书包"] },
        { label: "盒子外面", items: ["小兔"] },
      ],
      choices: choiceSet(["足球", "小兔", "书包"]),
      answer: "小兔",
      success: "小兔在盒子外面。",
      retry: "外面是没有被盒子装住的地方。",
      parentPrompt: "问她：足球在里面还是外面？小兔在里面还是外面？",
      abilityTags: ["里外方位", "抗干扰"],
    },
  ];

  const relative: RoundInput[] = [
    {
      level: "L6",
      prompt: "小狗看盒子，盒子在小狗的哪边？",
      instruction: "先找到小狗，再从小狗往盒子看。",
      sceneImage,
      grid: roomGrid,
      choices: choiceSet(["左边", "右边", "上面"]),
      answer: "右边",
      success: "从小狗看过去，盒子在右边。",
      retry: "不要从盒子开始看，这次从小狗开始。",
      parentPrompt: "问她：同一张图，从不同人出发，答案会不会变？",
      abilityTags: ["相对位置", "认知灵活性"],
    },
    {
      level: "L6",
      prompt: "小猫看盒子，盒子在小猫的哪边？",
      instruction: "先找到小猫，再从小猫往盒子看。",
      sceneImage,
      grid: roomGrid,
      choices: choiceSet(["左边", "右边", "下面"]),
      answer: "左边",
      success: "从小猫看过去，盒子在左边。",
      retry: "这次从小猫的位置出发。",
      parentPrompt: "请她比较：盒子看小猫，小猫看盒子，方向一样吗？",
      abilityTags: ["相对位置", "认知灵活性"],
    },
  ];

  return repeatTo([...rounds, ...insideOutside, ...relative], 18);
}

function makeMemoryCameraRounds(): RoundInput[] {
  const appearedCases = [
    { items: ["🍎", "🍊", "🍓"], answer: "苹果", choices: ["苹果", "葡萄", "蛋糕"] },
    { items: ["小汽车", "公交车", "飞机"], answer: "公交车", choices: ["公交车", "自行车", "风筝"] },
    { items: ["铅笔", "书包", "尺子"], answer: "尺子", choices: ["尺子", "书本", "三角尺"] },
    { items: ["🐱", "🐶", "🐰"], answer: "小兔", choices: ["小兔", "小熊", "小鸟"] },
  ].map((item, index) => ({
    level: index < 2 ? "L4" as AbilityLevel : "L5" as AbilityLevel,
    prompt: "刚才相机里出现过谁？",
    instruction: "先看图片，遮住以后再选。",
    memory: { items: item.items },
    choices: choiceSet(item.choices),
    answer: item.answer,
    success: `${item.answer}刚才出现过。`,
    retry: "先在心里念一遍，再遮住。",
    parentPrompt: "请她说说自己刚才用什么办法记住的。",
    abilityTags: ["图像记忆"],
  }));

  const absentCases = [
    { items: ["小鸟", "小鱼", "小狗"], answer: "小猫", choices: ["小鸟", "小狗", "小猫"] },
    { items: ["葡萄", "蛋糕", "饼干"], answer: "糖果", choices: ["蛋糕", "糖果", "葡萄"] },
    { items: ["足球", "风筝", "飞机"], answer: "小汽车", choices: ["飞机", "风筝", "小汽车"] },
    { items: ["杯子", "书包", "铅笔"], answer: "书本", choices: ["杯子", "书本", "书包"] },
  ].map((item) => ({
    level: "L5" as AbilityLevel,
    prompt: "哪一个刚才没有出现？",
    instruction: "遮住以后，找没看见过的。",
    memory: { items: item.items },
    choices: choiceSet(item.choices),
    answer: item.answer,
    success: `${item.answer}刚才没有出现。`,
    retry: "先回想相机里三个东西，再找多出来的选项。",
    parentPrompt: "问她：你排除了哪两个？为什么？",
    abilityTags: ["抗干扰", "排除法"],
  }));

  const orderCases = [
    { items: ["苹果", "小狗", "书包"], prompt: "刚才第一个是什么？", answer: "苹果", choices: ["苹果", "小狗", "书包"] },
    { items: ["小鱼", "足球", "飞机"], prompt: "刚才第二个是什么？", answer: "足球", choices: ["小鱼", "足球", "飞机"] },
    { items: ["铅笔", "葡萄", "公交车"], prompt: "刚才最后一个是什么？", answer: "公交车", choices: ["铅笔", "葡萄", "公交车"] },
    { items: ["小猫", "风筝", "蛋糕", "小鸟"], prompt: "刚才第三个是什么？", answer: "蛋糕", choices: ["风筝", "蛋糕", "小鸟"] },
  ].map((item, index) => ({
    level: index < 3 ? "L5" as AbilityLevel : "L6" as AbilityLevel,
    prompt: item.prompt,
    instruction: "不只记有什么，还要记顺序。",
    memory: { items: item.items },
    choices: choiceSet(item.choices),
    answer: item.answer,
    success: `${item.answer}在这个位置上。`,
    retry: "可以从左到右在心里排一排。",
    parentPrompt: "请她用“第一、第二、第三”复述一遍。",
    abilityTags: ["顺序记忆", "工作记忆"],
  }));

  return repeatTo([...appearedCases, ...absentCases, ...orderCases], 18);
}

function makeVisualMatchRounds(): RoundInput[] {
  const exactCases = [
    { target: "🔴🟦", choices: ["🔴🟦", "🟦🔴", "🔴🔴"], clue: "红色圆片在前，蓝色方块在后。" },
    { target: "🟡🟢", choices: ["🟢🟡", "🟡🟢", "🟡🔵"], clue: "黄色在前，绿色在后。" },
    { target: "🍎🍊", choices: ["🍊🍎", "🍎🍊", "🍎🍎"], clue: "先苹果，再橘子。" },
    { target: "🐱🐶", choices: ["🐱🐶", "🐶🐱", "🐱🐰"], clue: "先小猫，再小狗。" },
    { target: "🔴🟦⭐", choices: ["🔴🟦⭐", "🔴⭐🟦", "🟦🔴⭐"], clue: "红色、方块、星星的顺序都一样。" },
    { target: "🍓🍪🍬", choices: ["🍓🍪🍬", "🍪🍓🍬", "🍓🍬🍪"], clue: "草莓、饼干、糖果的顺序都一样。" },
  ];

  const exactRounds: RoundInput[] = exactCases.map((item, index) => ({
    level: index < 4 ? "L4" : "L5",
    prompt: "哪一张和上面完全一样？",
    instruction: "颜色、形状和顺序都要一样。",
    visualGroups: [{ label: "样板卡", items: [item.target] }],
    choices: choiceSet(item.choices),
    answer: item.target,
    success: `这一张完全一样。${item.clue}`,
    retry: "只差一点点也不算一样，要从左到右慢慢比。",
    parentPrompt: "问她：你发现哪张只是顺序不一样？",
    abilityTags: ["细节观察", "顺序比较"],
  }));

  const oddCases = [
    { items: ["🔴🟦", "🔴🟦", "🟦🔴"], answer: "🟦🔴", reason: "这一张顺序反了。" },
    { items: ["🟡🟢", "🟡🔵", "🟡🟢"], answer: "🟡🔵", reason: "这一张第二个颜色不一样。" },
    { items: ["🍎🍊", "🍎🍊", "🍊🍎"], answer: "🍊🍎", reason: "这一张水果顺序不一样。" },
    { items: ["🐱🐶", "🐱🐰", "🐱🐶"], answer: "🐱🐰", reason: "这一张第二个小动物不一样。" },
    { items: ["🔴🟦⭐", "🔴🟦⭐", "🔴⭐🟦"], answer: "🔴⭐🟦", reason: "后两块位置换了。" },
    { items: ["🍓🍪🍬", "🍓🍬🍪", "🍓🍪🍬"], answer: "🍓🍬🍪", reason: "饼干和糖果的位置换了。" },
  ].map((item, index) => ({
    level: index < 4 ? "L5" as AbilityLevel : "L6" as AbilityLevel,
    prompt: "哪一张和另外两张不一样？",
    instruction: "先找两张完全一样的，再看剩下的一张。",
    visualGroups: [{ label: "三张小卡", items: item.items }],
    choices: choiceSet(item.items),
    answer: item.answer,
    success: item.reason,
    retry: "找到两张一样的，剩下的就是不一样的。",
    parentPrompt: "问她：哪两张是一对？剩下那张哪里不同？",
    abilityTags: ["细节观察", "排除法"],
  }));

  return repeatTo([...exactRounds, ...oddCases], 18);
}

function makeDifferenceDetectiveRounds(): RoundInput[] {
  const changedCases = [
    { left: ["小猫", "苹果", "书包"], right: ["小猫", "橘子", "书包"], answer: "橘子", choices: ["橘子", "小猫", "书包"], success: "左图中间是苹果，右图中间变成橘子。" },
    { left: ["小狗", "足球", "飞机"], right: ["小狗", "风筝", "飞机"], answer: "风筝", choices: ["风筝", "足球", "飞机"], success: "右图把足球换成了风筝。" },
    { left: ["铅笔", "书包", "尺子"], right: ["铅笔", "书包", "书本"], answer: "书本", choices: ["书本", "书包", "尺子"], success: "最后一个从尺子变成了书本。" },
    { left: ["蛋糕", "草莓", "杯子"], right: ["蛋糕", "葡萄", "杯子"], answer: "葡萄", choices: ["葡萄", "草莓", "杯子"], success: "中间的草莓变成了葡萄。" },
    { left: ["小鸟", "天空", "小鱼"], right: ["小鸟", "小河", "小鱼"], answer: "小河", choices: ["小河", "天空", "小鱼"], success: "中间从天空变成了小河。" },
    { left: ["小汽车", "公交车", "自行车"], right: ["小汽车", "公交车", "飞机"], answer: "飞机", choices: ["飞机", "公交车", "自行车"], success: "最后一个从自行车变成了飞机。" },
  ].map((item, index) => ({
    level: index < 4 ? "L4" as AbilityLevel : "L5" as AbilityLevel,
    prompt: "右图里哪一个变了？",
    instruction: "左图和右图从左到右慢慢比。",
    visualGroups: [
      { label: "左图", items: item.left },
      { label: "右图", items: item.right },
    ],
    choices: choiceSet(item.choices),
    answer: item.answer,
    success: item.success,
    retry: "不要跳着看，先比第一个，再比第二个。",
    parentPrompt: "请她说完整句：左图是……右图变成了……",
    abilityTags: ["找不同", "细节比较"],
  }));

  const extraCases = [
    { left: ["小狗", "足球"], right: ["小狗", "足球", "风筝"], answer: "风筝", choices: ["风筝", "足球", "小狗"], success: "右图多了风筝。" },
    { left: ["苹果", "橘子"], right: ["苹果", "橘子", "草莓"], answer: "草莓", choices: ["草莓", "苹果", "橘子"], success: "右图多了草莓。" },
    { left: ["铅笔", "书包"], right: ["铅笔", "书包", "尺子"], answer: "尺子", choices: ["尺子", "铅笔", "书包"], success: "右图多了尺子。" },
  ].map((item) => ({
    level: "L5" as AbilityLevel,
    prompt: "右图比左图多了什么？",
    instruction: "先找左图里已经有的，剩下的就是多出来的。",
    visualGroups: [
      { label: "左图", items: item.left },
      { label: "右图", items: item.right },
    ],
    choices: choiceSet(item.choices),
    answer: item.answer,
    success: item.success,
    retry: "把左图里的东西在右图里一个个找到。",
    parentPrompt: "问她：左图里的两个都找到了吗？右图还剩什么？",
    abilityTags: ["找不同", "排除法"],
  }));

  const missingCases = [
    { left: ["蛋糕", "草莓", "杯子"], right: ["蛋糕", "杯子"], answer: "草莓", choices: ["草莓", "蛋糕", "杯子"], success: "右图少了草莓。" },
    { left: ["小猫", "小狗", "小兔"], right: ["小猫", "小兔"], answer: "小狗", choices: ["小狗", "小猫", "小兔"], success: "右图少了小狗。" },
    { left: ["书本", "铅笔", "尺子"], right: ["书本", "尺子"], answer: "铅笔", choices: ["铅笔", "书本", "尺子"], success: "右图少了铅笔。" },
  ].map((item) => ({
    level: "L5" as AbilityLevel,
    prompt: "右图比左图少了什么？",
    instruction: "看左图每一个东西，右图里哪个找不到？",
    visualGroups: [
      { label: "左图", items: item.left },
      { label: "右图", items: item.right },
    ],
    choices: choiceSet(item.choices),
    answer: item.answer,
    success: item.success,
    retry: "从左图第一个开始，在右图里找一找。",
    parentPrompt: "请她边指边说：这个有，这个有，哪一个没有？",
    abilityTags: ["找不同", "有序观察"],
  }));

  return repeatTo([...changedCases, ...extraCases, ...missingCases], 18);
}

function makeRotationDirectionRounds(): RoundInput[] {
  const sceneImage = imageGallery.scenes.rotationSpinner;
  const clockwise = [
    { sequence: ["上面", "右边", "下面", "?"], answer: "左边", success: "顺时针是上、右、下、左，所以下一个是左边。" },
    { sequence: ["右边", "下面", "左边", "?"], answer: "上面", success: "顺时针继续转，左边后面是上面。" },
    { sequence: ["下面", "左边", "上面", "?"], answer: "右边", success: "顺时针继续转，上面后面是右边。" },
    { sequence: ["左边", "上面", "右边", "?"], answer: "下面", success: "顺时针继续转，右边后面是下面。" },
  ].map((item, index) => ({
    level: index < 2 ? "L5" as AbilityLevel : "L6" as AbilityLevel,
    prompt: "箭头每次顺时针转一下，下一个指哪里？",
    instruction: "顺时针就是像钟表一样往右转。",
    sceneImage,
    sequence: item.sequence,
    choices: choiceSet(["上面", "右边", "下面", "左边"]),
    answer: item.answer,
    success: item.success,
    retry: "先按顺序念：上、右、下、左。",
    parentPrompt: "请她用手在空中转一转，再说下一步。",
    abilityTags: ["旋转规律", "方向顺序"],
  }));

  const counterClockwise = [
    { sequence: ["上面", "左边", "下面", "?"], answer: "右边", success: "逆时针是上、左、下、右，所以下一个是右边。" },
    { sequence: ["左边", "下面", "右边", "?"], answer: "上面", success: "逆时针继续转，右边后面是上面。" },
    { sequence: ["下面", "右边", "上面", "?"], answer: "左边", success: "逆时针继续转，上面后面是左边。" },
    { sequence: ["右边", "上面", "左边", "?"], answer: "下面", success: "逆时针继续转，左边后面是下面。" },
  ].map((item, index) => ({
    level: index < 2 ? "L5" as AbilityLevel : "L6" as AbilityLevel,
    prompt: "箭头每次逆时针转一下，下一个指哪里？",
    instruction: "逆时针就是往左边转。",
    sceneImage,
    sequence: item.sequence,
    choices: choiceSet(["上面", "右边", "下面", "左边"]),
    answer: item.answer,
    success: item.success,
    retry: "先看它是往左转还是往右转。",
    parentPrompt: "问她：这次和钟表方向一样吗？",
    abilityTags: ["旋转规律", "方向顺序"],
  }));

  const skipTurn = [
    { sequence: ["上面", "下面", "上面", "?"], answer: "下面", success: "这次每次转半圈，所以上面、下面轮流出现。" },
    { sequence: ["右边", "左边", "右边", "?"], answer: "左边", success: "右边和左边轮流出现，所以下一个是左边。" },
    { sequence: ["上面", "右边", "上面", "右边", "?"], answer: "上面", success: "这是上面、右边一组一组重复。" },
    { sequence: ["下面", "左边", "下面", "左边", "?"], answer: "下面", success: "这是下面、左边一组一组重复。" },
  ].map((item) => ({
    level: "L6" as AbilityLevel,
    prompt: "箭头按规律转，下一个指哪里？",
    instruction: "先看它是一个一个转，还是两个方向轮流出现。",
    sceneImage,
    sequence: item.sequence,
    choices: choiceSet(["上面", "右边", "下面", "左边"]),
    answer: item.answer,
    success: item.success,
    retry: "把前面的方向慢慢念出来，找重复的小组。",
    parentPrompt: "请她说：这是一格一格转，还是两个方向轮流？",
    abilityTags: ["旋转规律", "模式识别"],
  }));

  return repeatTo([...clockwise, ...counterClockwise, ...skipTurn], 18);
}

function makePartWholePuzzleRounds(): RoundInput[] {
  const missingCases = [
    { whole: "🔴🟦⭐", have: ["🔴", "🟦"], answer: "⭐", choices: ["⭐", "🟡", "🟢"], reason: "完整图里还少星星。" },
    { whole: "🍎🍊🍓", have: ["🍎", "🍊"], answer: "🍓", choices: ["🍓", "🍪", "🍬"], reason: "已经有苹果和橘子，还少草莓。" },
    { whole: "🐱🐶🐰", have: ["🐱", "🐶"], answer: "🐰", choices: ["🐰", "🐟", "🐦"], reason: "还少小兔。" },
    { whole: "🟡🟢🔵", have: ["🟡", "🔵"], answer: "🟢", choices: ["🟢", "🔴", "🟣"], reason: "中间还少绿色圆片。" },
    { whole: "🍪🍬⭐", have: ["🍬", "⭐"], answer: "🍪", choices: ["🍪", "🍎", "🍊"], reason: "还少饼干。" },
    { whole: "⚽✏️🎁", have: ["⚽", "🎁"], answer: "✏️", choices: ["✏️", "书本", "尺子"], reason: "还少铅笔。" },
  ];

  const missingRounds: RoundInput[] = missingCases.map((item, index) => ({
    level: index < 4 ? "L5" : "L6",
    prompt: "拼成完整图，还少哪一块？",
    instruction: "先看完整图，再看已经有的几块。",
    visualGroups: [
      { label: "完整图", items: [item.whole] },
      { label: "已经有", items: item.have },
    ],
    choices: choiceSet(item.choices),
    answer: item.answer,
    success: item.reason,
    retry: "把完整图里的东西一个一个划掉，看看还剩什么。",
    parentPrompt: "请她说：完整图有哪几块？现在已经有哪几块？",
    abilityTags: ["部分整体", "图形组合"],
  }));

  const extraCases = [
    { whole: "🔴🟦⭐", pieces: ["🔴", "🟦", "⭐", "🟡"], answer: "🟡", reason: "完整图里没有黄色圆片。" },
    { whole: "🍎🍊🍓", pieces: ["🍎", "🍊", "🍓", "🍪"], answer: "🍪", reason: "完整图里没有饼干。" },
    { whole: "🐱🐶🐰", pieces: ["🐱", "🐶", "🐰", "🐟"], answer: "🐟", reason: "完整图里没有小鱼。" },
    { whole: "🟡🟢🔵", pieces: ["🟡", "🟢", "🔵", "🔴"], answer: "🔴", reason: "完整图里没有红色圆片。" },
    { whole: "🍪🍬⭐", pieces: ["🍪", "🍬", "⭐", "🍎"], answer: "🍎", reason: "完整图里没有苹果。" },
    { whole: "⚽✏️🎁", pieces: ["⚽", "✏️", "🎁", "书本"], answer: "书本", reason: "完整图里没有书本。" },
  ].map((item, index) => ({
    level: index < 4 ? "L5" as AbilityLevel : "L6" as AbilityLevel,
    prompt: "哪一块是多余的？",
    instruction: "多出来的那块，不在完整图里。",
    visualGroups: [
      { label: "完整图", items: [item.whole] },
      { label: "可选小块", items: item.pieces },
    ],
    choices: choiceSet(item.pieces),
    answer: item.answer,
    success: item.reason,
    retry: "用完整图去对照每一块，找没有出现过的。",
    parentPrompt: "问她：哪些已经能在完整图里找到？哪一块找不到？",
    abilityTags: ["部分整体", "排除法"],
  }));

  return repeatTo([...missingRounds, ...extraCases], 18);
}

function makeBalanceSwapRounds(): RoundInput[] {
  const directCases = [
    { left: "🍎", right: ["🍓", "🍓"], prompt: "1 个苹果和几个草莓一样？", answer: "🍓🍓", choices: ["🍓", "🍓🍓", "🍓🍓🍓"], success: "1 个苹果可以换 2 个草莓。" },
    { left: "🍊", right: ["🍪", "🍪"], prompt: "1 个橘子和几个饼干一样？", answer: "🍪🍪", choices: ["🍪", "🍪🍪", "🍪🍪🍪"], success: "1 个橘子可以换 2 个饼干。" },
    { left: "🧁", right: ["🍬", "🍬", "🍬"], prompt: "1 个蛋糕和几个糖果一样？", answer: "🍬🍬🍬", choices: ["🍬🍬", "🍬🍬🍬", "🍬🍬🍬🍬"], success: "1 个蛋糕可以换 3 个糖果。" },
    { left: "⚽", right: ["⭐", "⭐"], prompt: "1 个足球和几颗星星一样？", answer: "⭐⭐", choices: ["⭐", "⭐⭐", "⭐⭐⭐"], success: "1 个足球可以换 2 颗星星。" },
  ].map((item, index) => ({
    level: index < 2 ? "L4" as AbilityLevel : "L5" as AbilityLevel,
    prompt: item.prompt,
    instruction: "天平两边一样，右边有几个就选几个。",
    visualGroups: [
      { label: "天平左边", items: [item.left] },
      { label: "天平右边", items: item.right },
    ],
    choices: choiceSet(item.choices),
    answer: item.answer,
    success: item.success,
    retry: "先数右边一共有几个，再选一样的那一组。",
    parentPrompt: "问她：为什么天平两边可以互相换？",
    abilityTags: ["等量代换", "数量对应"],
  }));

  const doubleCases = [
    { unit: "🍎", unitGroup: ["🍓", "🍓"], count: 2, answer: "🍓🍓🍓🍓", choices: ["🍓🍓", "🍓🍓🍓", "🍓🍓🍓🍓"], success: "两个苹果就是两组草莓，一共 4 个草莓。" },
    { unit: "🍊", unitGroup: ["🍪", "🍪"], count: 2, answer: "🍪🍪🍪🍪", choices: ["🍪🍪", "🍪🍪🍪", "🍪🍪🍪🍪"], success: "两个橘子可以换两组饼干，一共 4 个。" },
    { unit: "🧁", unitGroup: ["🍬", "🍬", "🍬"], count: 2, answer: "🍬🍬🍬🍬🍬🍬", choices: ["🍬🍬🍬", "🍬🍬🍬🍬", "🍬🍬🍬🍬🍬🍬"], success: "两个蛋糕是两组 3 个糖果，一共 6 个糖果。" },
    { unit: "⚽", unitGroup: ["⭐", "⭐"], count: 3, answer: "⭐⭐⭐⭐⭐⭐", choices: ["⭐⭐⭐⭐", "⭐⭐⭐⭐⭐", "⭐⭐⭐⭐⭐⭐"], success: "三个足球是三组 2 颗星星，一共 6 颗。" },
  ].map((item) => ({
    level: "L6" as AbilityLevel,
    prompt: `${item.count} 个${labelFor(item.unit)}可以换成几个${labelFor(item.unitGroup[0])}？`,
    instruction: "先看 1 个能换几，再想有几组。",
    visualGroups: [
      { label: "1 个可以换", items: [item.unit, "➡️", ...item.unitGroup] },
      { label: "现在有", items: repeat(item.unit, item.count) },
    ],
    choices: choiceSet(item.choices),
    answer: item.answer,
    success: item.success,
    retry: "不是只看一组，要看现在有几个左边的东西。",
    parentPrompt: "请她用“几组”来说：这里有几组右边的东西？",
    abilityTags: ["等量代换", "成组观察"],
  }));

  const compareCases = [
    {
      prompt: "哪边更重？",
      visualGroups: [
        { label: "规则", items: ["🍎", "➡️", "🍓", "🍓"] },
        { label: "左边", items: ["🍎"] },
        { label: "右边", items: ["🍓"] },
      ],
      answer: "左边",
      choices: ["左边", "右边", "一样重"],
      success: "1 个苹果等于 2 个草莓，所以 1 个苹果比 1 个草莓重。",
    },
    {
      prompt: "哪边一样重？",
      visualGroups: [
        { label: "规则", items: ["🍊", "➡️", "🍪", "🍪"] },
        { label: "左边", items: ["🍊"] },
        { label: "右边", items: ["🍪", "🍪"] },
      ],
      answer: "一样重",
      choices: ["左边", "右边", "一样重"],
      success: "1 个橘子正好等于 2 个饼干，两边一样重。",
    },
  ].map((item) => ({
    level: "L6" as AbilityLevel,
    prompt: item.prompt,
    instruction: "先看规则，再比较两边。",
    visualGroups: item.visualGroups,
    choices: choiceSet(item.choices),
    answer: item.answer,
    success: item.success,
    retry: "先把左边换成右边的样子，再比较。",
    parentPrompt: "问她：如果换一下，左边会变成几个？",
    abilityTags: ["等量代换", "比较推理"],
  }));

  return repeatTo([...directCases, ...doubleCases, ...compareCases], 18);
}

function makeMirrorFoldRounds(): RoundInput[] {
  const sceneImage = imageGallery.scenes.mirrorFoldPaper;
  const judgeCases = [
    {
      prompt: "沿着中间的竖线折起来，两边能重合吗？",
      cells: [
        ["🔴", "|", "🔴"],
        ["🔵", "|", "🔵"],
      ],
      answer: "左右能重合",
      choices: ["左右能重合", "上下能重合", "不能重合"],
      success: "竖线左边和右边一格一格都一样，所以左右能重合。",
    },
    {
      prompt: "沿着中间的竖线折起来，两边能重合吗？",
      cells: [
        ["⭐", "|", "⭐"],
        ["🟡", "|", "🟢"],
      ],
      answer: "不能重合",
      choices: ["左右能重合", "上下能重合", "不能重合"],
      success: "下面一行左边是黄色圆片，右边是绿色圆片，不能完全重合。",
    },
    {
      prompt: "沿着中间的横线折起来，上下能重合吗？",
      cells: [
        ["🍎", "🍊"],
        ["-", "-"],
        ["🍎", "🍊"],
      ],
      answer: "上下能重合",
      choices: ["上下能重合", "左右能重合", "不能重合"],
      success: "横线上面和下面对应的位置一样，所以上下能重合。",
    },
    {
      prompt: "沿着中间的横线折起来，上下能重合吗？",
      cells: [
        ["🐱", "🐶"],
        ["-", "-"],
        ["🐶", "🐱"],
      ],
      answer: "不能重合",
      choices: ["上下能重合", "左右能重合", "不能重合"],
      success: "上下两行顺序反了，对应的位置不一样，不能重合。",
    },
    {
      prompt: "这张小卡是不是左右对称？",
      cells: [
        ["🟦", "|", "🟦"],
        ["⭐", "|", "⭐"],
        ["🟦", "|", "🟦"],
      ],
      answer: "左右能重合",
      choices: ["左右能重合", "上下能重合", "不能重合"],
      success: "每一行的左边和右边都一样，是左右对称。",
    },
    {
      prompt: "这张小卡是不是左右对称？",
      cells: [
        ["🔴", "|", "🔴"],
        ["⭐", "|", "🟡"],
        ["🔵", "|", "🔵"],
      ],
      answer: "不能重合",
      choices: ["左右能重合", "上下能重合", "不能重合"],
      success: "中间一行左边是星星，右边是黄色圆片，不是左右对称。",
    },
  ].map((item, index) => ({
    level: index < 4 ? "L5" as AbilityLevel : "L6" as AbilityLevel,
    prompt: item.prompt,
    instruction: "先找到中线，再看对应位置是不是一样。",
    sceneImage,
    matrix: { cells: item.cells },
    choices: choiceSet(item.choices),
    answer: item.answer,
    success: item.success,
    retry: "不要只看数量，要一格一格对照位置。",
    parentPrompt: "请她用手指连一连对应的两格，说它们是不是一样。",
    abilityTags: ["轴对称", "有序比较"],
  }));

  const mirrorFillCases = [
    { left: ["🔴", "⭐"], answer: "⭐🔴", choices: ["⭐🔴", "🔴⭐", "🔵⭐"], success: "镜子里顺序要反过来，红色圆片、星星的另一边是星星、红色圆片。" },
    { left: ["🍎", "🍊"], answer: "🍊🍎", choices: ["🍊🍎", "🍎🍊", "🍓🍎"], success: "镜子另一边要从靠近镜子的橘子开始，再到苹果。" },
    { left: ["🐱", "🐶"], answer: "🐶🐱", choices: ["🐶🐱", "🐱🐶", "🐰🐱"], success: "左右折起来时，小狗要靠近镜子，小猫在外面。" },
    { left: ["🟦", "⭐", "🔴"], answer: "🔴⭐🟦", choices: ["🔴⭐🟦", "🟦⭐🔴", "⭐🔴🟦"], success: "三个也要倒着补，靠近镜子的红色圆片先出现。" },
    { left: ["🍓", "🍪", "🍬"], answer: "🍬🍪🍓", choices: ["🍬🍪🍓", "🍓🍪🍬", "🍪🍬🍓"], success: "镜子另一边是糖果、饼干、草莓，顺序反过来。" },
    { left: ["🔵", "🟡", "⭐"], answer: "⭐🟡🔵", choices: ["⭐🟡🔵", "🔵🟡⭐", "🟡⭐🔵"], success: "要从靠近镜子的星星开始补，再到黄色圆片和蓝色圆片。" },
  ].map((item, index) => ({
    level: index < 3 ? "L5" as AbilityLevel : "L6" as AbilityLevel,
    prompt: "镜子右边应该是什么？",
    instruction: "左边靠近镜子的那个，到了右边也要靠近镜子。",
    sceneImage,
    visualGroups: [
      { label: "镜子左边", items: item.left },
      { label: "镜子", items: ["|"] },
    ],
    choices: choiceSet(item.choices),
    answer: item.answer,
    success: item.success,
    retry: "先找最靠近镜子的那一个，它在答案里也要最靠近镜子。",
    parentPrompt: "请她从镜子旁边开始读：靠近镜子的是谁？外面的是谁？",
    abilityTags: ["左右反转", "顺序比较"],
  }));

  return repeatTo([...judgeCases, ...mirrorFillCases], 18);
}

function makeBlockHeightMapRounds(): RoundInput[] {
  const cases = [
    { cells: [["1", "1"], ["1", "0"]], answer: 3, explain: "1 加 1 加 1，再加 0，一共 3 块。" },
    { cells: [["2", "1"], ["1", "0"]], answer: 4, explain: "这一张是 2、1、1、0，合起来 4 块。" },
    { cells: [["2", "2"], ["1", "1"]], answer: 6, explain: "上面两列各 2 块，下面两列各 1 块，一共 6 块。" },
    { cells: [["3", "1"], ["0", "2"]], answer: 6, explain: "3 块、1 块、0 块、2 块，合起来 6 块。" },
    { cells: [["1", "2", "1"], ["0", "1", "0"]], answer: 5, explain: "第一行 4 块，第二行 1 块，一共 5 块。" },
    { cells: [["2", "1", "2"], ["1", "0", "1"]], answer: 7, explain: "2、1、2、1、0、1 合起来是 7 块。" },
    { cells: [["3", "0", "1"], ["1", "2", "0"]], answer: 7, explain: "3、0、1、1、2、0 合起来是 7 块。" },
    { cells: [["1", "2", "1"], ["2", "0", "2"], ["1", "0", "1"]], answer: 10, explain: "按行数：第一行 4 块，第二行 4 块，第三行 2 块，一共 10 块。" },
    { cells: [["2", "2", "0"], ["1", "3", "1"], ["0", "1", "0"]], answer: 10, explain: "按行数：4 块、5 块、1 块，一共 10 块。" },
  ].map((item, index) => {
    const rows = ["A", "B", "C"].slice(0, item.cells.length);
    const columns = ["1", "2", "3"].slice(0, item.cells[0].length);
    return {
      level: index < 3 ? "L5" as AbilityLevel : "L6" as AbilityLevel,
      prompt: "这张积木楼层图一共有几块积木？",
      instruction: "每个格子的数字表示这一列有几层，0 表示没有积木。",
      grid: { columns, rows, cells: item.cells },
      choices: numberChoices(item.answer, Math.max(1, item.answer - 2), Math.min(12, item.answer + 2)),
      answer: String(item.answer),
      success: item.explain,
      retry: "不要只数格子，要把每个格子里的数字合起来。",
      parentPrompt: "请她按行读数字，再说这一行一共有几块。",
      abilityTags: ["立体计数", "俯视图"],
    };
  });

  const compareCases = [
    {
      left: [["2", "1"], ["1", "0"]],
      right: [["1", "1"], ["1", "1"]],
      answer: "一样多",
      success: "左边是 4 块，右边也是 4 块，所以一样多。",
    },
    {
      left: [["3", "1"], ["0", "1"]],
      right: [["2", "2"], ["1", "1"]],
      answer: "右边",
      success: "左边 5 块，右边 6 块，右边更多。",
    },
    {
      left: [["2", "2"], ["2", "0"]],
      right: [["3", "1"], ["0", "1"]],
      answer: "左边",
      success: "左边 6 块，右边 5 块，左边更多。",
    },
  ].map((item) => ({
    level: "L6" as AbilityLevel,
    prompt: "哪张积木楼层图的积木更多？",
    instruction: "先分别合起来，再比较总数。",
    visualGroups: [
      { label: "左图", items: item.left.flat() },
      { label: "右图", items: item.right.flat() },
    ],
    choices: choiceSet(["左边", "右边", "一样多"]),
    answer: item.answer,
    success: item.success,
    retry: "先算左图有几块，再算右图有几块。",
    parentPrompt: "问她：左边总数是多少？右边总数是多少？",
    abilityTags: ["立体计数", "比较推理"],
  }));

  return repeatTo([...cases, ...compareCases], 18);
}

function makeThreeViewBlockRounds(): RoundInput[] {
  const maps = [
    {
      cells: [["1", "0"], ["2", "1"]],
      topCount: 3,
      front: "2和1",
      left: "1和2",
      frontExplain: "从前面看，第一列最高 2 层，第二列最高 1 层。",
      leftExplain: "从左边看，第一排最高 1 层，第二排最高 2 层。",
    },
    {
      cells: [["2", "1"], ["0", "3"]],
      topCount: 3,
      front: "2和3",
      left: "2和3",
      frontExplain: "从前面看，两列最高分别是 2 层和 3 层。",
      leftExplain: "从左边看，两排最高分别是 2 层和 3 层。",
    },
    {
      cells: [["1", "2", "0"], ["0", "1", "1"]],
      topCount: 4,
      front: "1、2、1",
      left: "2和1",
      frontExplain: "从前面看，三列最高是 1 层、2 层、1 层。",
      leftExplain: "从左边看，第一排最高 2 层，第二排最高 1 层。",
    },
    {
      cells: [["3", "0", "1"], ["1", "2", "0"]],
      topCount: 4,
      front: "3、2、1",
      left: "3和2",
      frontExplain: "从前面看，三列最高是 3 层、2 层、1 层。",
      leftExplain: "从左边看，两排最高分别是 3 层和 2 层。",
    },
    {
      cells: [["1", "2", "1"], ["2", "0", "2"], ["1", "0", "1"]],
      topCount: 7,
      front: "2、2、2",
      left: "2、2、1",
      frontExplain: "从前面看，三列最高都是 2 层。",
      leftExplain: "从左边看，三排最高是 2 层、2 层、1 层。",
    },
    {
      cells: [["2", "0", "1"], ["0", "3", "1"], ["1", "1", "0"]],
      topCount: 6,
      front: "2、3、1",
      left: "2、3、1",
      frontExplain: "从前面看，三列最高是 2 层、3 层、1 层。",
      leftExplain: "从左边看，三排最高是 2 层、3 层、1 层。",
    },
  ];

  const topRounds: RoundInput[] = maps.map((item, index) => {
    const rows = ["A", "B", "C"].slice(0, item.cells.length);
    const columns = ["1", "2", "3"].slice(0, item.cells[0].length);
    return {
      level: index < 2 ? "L5" as AbilityLevel : "L6" as AbilityLevel,
      prompt: "从上面看，有几个位置放了积木？",
      instruction: "从上面看只看有没有积木，不管它有几层。",
      grid: { columns, rows, cells: item.cells },
      choices: numberChoices(item.topCount, Math.max(1, item.topCount - 1), Math.min(9, item.topCount + 1)),
      answer: String(item.topCount),
      success: `0 是空位，其他格子都有积木，所以从上面看有 ${item.topCount} 个位置。`,
      retry: "只数不是 0 的格子，不要把层数加起来。",
      parentPrompt: "请她把不是 0 的格子点出来，说这些地方从上面能看到。",
      abilityTags: ["俯视图", "视角转换"],
    };
  });

  const frontRounds: RoundInput[] = maps.map((item, index) => {
    const rows = ["A", "B", "C"].slice(0, item.cells.length);
    const columns = ["1", "2", "3"].slice(0, item.cells[0].length);
    return {
      level: index < 2 ? "L5" as AbilityLevel : "L6" as AbilityLevel,
      prompt: "从前面看，每一列最高会看到几层？",
      instruction: "一列一列看，只记这一列最高的那一层。",
      grid: { columns, rows, cells: item.cells },
      choices: threeViewChoices(item.front),
      answer: item.front,
      success: item.frontExplain,
      retry: "不要把一列里的数字相加，只找这一列最大的数字。",
      parentPrompt: "请她用手指竖着看一列，说这一列最高是几层。",
      abilityTags: ["三视图", "最高层判断"],
    };
  });

  const leftRounds: RoundInput[] = maps.map((item, index) => {
    const rows = ["A", "B", "C"].slice(0, item.cells.length);
    const columns = ["1", "2", "3"].slice(0, item.cells[0].length);
    return {
      level: index < 2 ? "L5" as AbilityLevel : "L6" as AbilityLevel,
      prompt: "从左边看，每一排最高会看到几层？",
      instruction: "一排一排看，只记这一排最高的那一层。",
      grid: { columns, rows, cells: item.cells },
      choices: threeViewChoices(item.left),
      answer: item.left,
      success: item.leftExplain,
      retry: "横着看一排，找这一排里最大的数字。",
      parentPrompt: "请她横着读一排数字，再说最高是几层。",
      abilityTags: ["三视图", "视角转换"],
    };
  });

  return repeatTo([...topRounds, ...frontRounds, ...leftRounds], 18);
}

function makeRouteStepRounds(): RoundInput[] {
  const sceneImage = imageGallery.scenes.treasureMapGrid;
  const routeGrid = {
    columns: ["1", "2", "3"],
    rows: ["A", "B", "C"],
    cells: [
      ["小狗", "苹果", "小鸟"],
      ["足球", "盒子", "书包"],
      ["小鱼", "蛋糕", "终点"],
    ],
  };
  const parkGrid = {
    columns: ["1", "2", "3", "4"],
    rows: ["A", "B", "C"],
    cells: [
      ["起点", "小猫", "风筝", "小鸟"],
      ["足球", "盒子", "书包", "飞机"],
      ["小鱼", "蛋糕", "小狗", "终点"],
    ],
  };

  const oneStep = [
    { start: "小狗", move: "往右一步", answer: "苹果", choices: ["苹果", "足球", "小鸟"], success: "从小狗往右一步到苹果。" },
    { start: "盒子", move: "往上一步", answer: "苹果", choices: ["苹果", "足球", "蛋糕"], success: "盒子上面是苹果。" },
    { start: "盒子", move: "往下一步", answer: "蛋糕", choices: ["苹果", "蛋糕", "书包"], success: "盒子下面是蛋糕。" },
    { start: "书包", move: "往左一步", answer: "盒子", choices: ["盒子", "小鸟", "终点"], success: "书包左边是盒子。" },
  ].map((item) => ({
    level: "L4" as AbilityLevel,
    prompt: `从${item.start}出发，${item.move}到哪里？`,
    instruction: "先找到起点，再走一步。",
    sceneImage,
    grid: routeGrid,
    choices: choiceSet(item.choices),
    answer: item.answer,
    success: item.success,
    retry: "先别跳格子，只走一步。",
    parentPrompt: "请她用手指从起点移动一步。",
    abilityTags: ["方向执行", "一步路线"],
  }));

  const twoStep = [
    { start: "起点", moves: "先往右一步，再往下一步", answer: "盒子", choices: ["小猫", "盒子", "足球"], success: "从起点先到小猫，再往下到盒子。" },
    { start: "小猫", moves: "先往右一步，再往右一步", answer: "小鸟", choices: ["风筝", "小鸟", "飞机"], success: "从小猫往右到风筝，再往右到小鸟。" },
    { start: "盒子", moves: "先往右一步，再往下一步", answer: "小狗", choices: ["书包", "小狗", "飞机"], success: "从盒子到书包，再往下到小狗。" },
    { start: "书包", moves: "先往右一步，再往下一步", answer: "终点", choices: ["终点", "飞机", "小狗"], success: "从书包到飞机，再往下到终点。" },
    { start: "蛋糕", moves: "先往右一步，再往右一步", answer: "终点", choices: ["小狗", "终点", "盒子"], success: "从蛋糕到小狗，再到终点。" },
    { start: "足球", moves: "先往右一步，再往上一步", answer: "小猫", choices: ["盒子", "小猫", "起点"], success: "从足球到盒子，再往上到小猫。" },
  ].map((item, index) => ({
    level: index < 3 ? "L5" as AbilityLevel : "L6" as AbilityLevel,
    prompt: `从${item.start}出发，${item.moves}，到哪里？`,
    instruction: "把两步都记住，按顺序走。",
    sceneImage,
    grid: parkGrid,
    choices: choiceSet(item.choices),
    answer: item.answer,
    success: item.success,
    retry: "先做第一步，再做第二步，不要一下子猜。",
    parentPrompt: "问她：第一步到了哪里？第二步又到了哪里？",
    abilityTags: ["两步路线", "工作记忆"],
  }));

  return repeatTo([...oneStep, ...twoStep], 18);
}

function numberChoices(answer: number, min: number, max: number) {
  const values = new Set<number>([answer]);
  if (answer > min) values.add(answer - 1);
  if (answer < max) values.add(answer + 1);
  let cursor = min;
  while (values.size < 3) values.add(cursor++);
  return Array.from(values).sort((a, b) => a - b).slice(0, 3).map((value) => ({ label: String(value), value: String(value) }));
}

function patternChoices(answer: string) {
  const pool = ["🔴", "🔵", "🟡", "🟢", "☀️", "🌙", "⭐", "⬤", "•"];
  const values = [answer, ...pool.filter((item) => item !== answer)].slice(0, 3);
  return values.map((value) => ({ label: labelFor(value), value }));
}

function labelFor(token: string) {
  return countNames[token] ?? ({
    "🔴": "红色圆片",
    "🔵": "蓝色圆片",
    "🟡": "黄色圆片",
    "🟢": "绿色圆片",
    "🟣": "紫色圆片",
    "🟦": "蓝色方块",
    "☀️": "太阳",
    "🌙": "月亮",
    "⭐": "星星",
    "⬤": "大圆",
    "•": "小圆",
    "🧁": "蛋糕",
    "⚽": "足球",
    "🎁": "魔法盒",
    "✏️": "铅笔",
    "✏": "铅笔",
  }[token] ?? token);
}

function repeat(token: string, count: number) {
  return Array.from({ length: count }, () => token);
}

function repeatPattern<T>(unit: T[], count: number) {
  return Array.from({ length: count }, (_, index) => unit[index % unit.length]);
}

function repeatTo(rounds: RoundInput[], target: number) {
  const output: RoundInput[] = [];
  const seen = new Set<string>();
  for (const round of rounds) {
    const signature = roundSignature(round);
    if (seen.has(signature)) continue;
    seen.add(signature);
    output.push(round);
    if (output.length >= target) break;
  }
  return output;
}

function roundSignature(round: RoundInput) {
  return JSON.stringify([
    round.prompt,
    round.instruction,
    round.sequence,
    round.visualGroups,
    round.grid,
    round.matrix,
    round.memory,
    round.choices.map((choice) => choice.label),
    round.answer,
  ]);
}

function choice(value: string) {
  return { label: value, value };
}

function choiceSet(values: readonly string[]) {
  return values.map((value) => ({ label: value, value }));
}

function threeViewChoices(answer: string) {
  const values = [answer];
  for (const candidate of ["1和2", "2和1", "2和3", "3和2", "1、2、1", "3、2、1", "2、2、2", "2、2、1", "2、3、1"]) {
    if (!values.includes(candidate)) values.push(candidate);
    if (values.length === 3) break;
  }
  return choiceSet(values);
}

function gridDistractors(grid: { cells: string[][] }, answer: string) {
  return grid.cells.flat().filter((item) => item !== answer).slice(0, 2);
}

function unitOf(token: string) {
  if (token === "🐟") return "条";
  if (token === "🐦") return "只";
  if (token === "⭐") return "颗";
  return "个";
}

function countedItem(token: string, count: number) {
  return `${count} ${unitOf(token)}${countNames[token] ?? "东西"}`;
}
