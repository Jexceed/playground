import type {
  Activity,
  ActivityBase,
  ActivitySet,
  GridActivity,
  OrderedActivity,
  OrderRule,
} from "../../domain/activity";
import { pilotTokens, tokens } from "./tokens";

function base(
  id: string,
  family: string,
  prompt: string,
  instruction: string,
  ids: string[],
  overrides: Partial<ActivityBase> = {},
): ActivityBase {
  return {
    id,
    schemaVersion: 1,
    revision: 1,
    primaryFamilyId: family,
    level: "L5",
    difficultyNote: "先看清线索，再一步一步检查。",
    prompt,
    instruction,
    clues: [],
    tokens: tokens(...ids),
    hints: [
      "先找到一条最确定的线索，再看看其他线索。",
      "把已经确定的部分摆好，再检查剩下的部分。",
    ],
    success: "摆好了！说一说，你先找到了哪条线索？",
    retry: "还差一点。把每条线索都检查一遍。",
    parentPrompt: "请孩子指出用到的线索，再解释为什么这样选或这样摆。",
    abilityTags: [family],
    protocol: { kind: "practice" },
    sourceRefs: [{ sourceId: "S002", locator: "PDF p4–5" }],
    ...overrides,
  };
}

export const selectionActivities: Activity[] = [
  {
    ...base(
      "rules-red-round-triangle",
      "L01",
      "帮小兔收图卡",
      "把同时符合两条线索的图卡都选出来。",
      [
        "blue-circle",
        "red-square",
        "red-triangle",
        "yellow-square",
        "red-circle",
        "blue-triangle",
      ],
      {
        clues: ["颜色是红色。", "形状是圆形或三角形。"],
        difficultyNote: "同时检查颜色和形状。",
        hints: [
          "先把红色的图卡找出来。",
          "再看红色图卡的形状，方形先留在桌上。",
        ],
        success: "对了！红色圆形和红色三角形同时符合两条线索。",
        retry: "选好颜色以后，还要再看看形状。",
        parentPrompt: "红色方形为什么没有收进去？蓝色圆形又少了哪个条件？",
        abilityTags: ["多条件分类", "集合选择"],
      },
    ),
    kind: "multiSelect",
    expectedTokenIds: ["red-circle", "red-triangle"],
  },
  {
    ...base(
      "rules-blue-or-triangle",
      "L01",
      "把两类图卡收好",
      "蓝色图形都要，三角形也都要。符合其中一条就选。",
      [
        "yellow-triangle",
        "red-square",
        "blue-circle",
        "yellow-square",
        "red-triangle",
        "blue-square",
      ],
      {
        clues: ["收好所有蓝色图形。", "也收好所有三角形。"],
        difficultyNote: "两种要求，符合其中一种就可以。",
        hints: ["先选好蓝色的图卡。", "再找三角形，看看有没有还没选到的。"],
        success: "找齐了！蓝色图形和三角形都收好了。",
        retry: "这次只要符合其中一个要求，就可以收进去。",
        parentPrompt: "黄色三角形不是蓝色，为什么也要收？",
        abilityTags: ["分类规则", "条件组合"],
      },
    ),
    kind: "multiSelect",
    expectedTokenIds: [
      "yellow-triangle",
      "blue-circle",
      "red-triangle",
      "blue-square",
    ],
  },
  {
    ...base(
      "rules-yellow-two-shapes",
      "L01",
      "给小熊挑图卡",
      "黄色的图卡里面，只挑圆形和方形。",
      [
        "yellow-triangle",
        "blue-square",
        "yellow-circle",
        "red-circle",
        "red-square",
        "yellow-square",
      ],
      {
        clues: ["先看黄色的图卡。", "只收圆形和方形。"],
        hints: [
          "颜色和形状要分两步看。",
          "黄色三角形虽然颜色对了，形状还不符合。",
        ],
        success: "对了！黄色圆形和黄色方形都符合要求。",
        retry: "再看看颜色和形状，有没有只符合一条的图卡。",
        parentPrompt: "请孩子换一个检查顺序，先看形状再看颜色，结果一样吗？",
        abilityTags: ["多条件分类", "检查顺序"],
      },
    ),
    kind: "multiSelect",
    expectedTokenIds: ["yellow-circle", "yellow-square"],
  },
  {
    ...base(
      "rules-circles-put-red-back",
      "L01",
      "先挑，再放回",
      "先挑出所有圆形，再把红色圆形放回桌上。最后应该留下哪些？",
      [
        "red-circle",
        "blue-square",
        "yellow-circle",
        "red-triangle",
        "blue-circle",
        "yellow-triangle",
      ],
      {
        clues: ["先挑出所有圆形。", "红色圆形放回去。"],
        difficultyNote: "记住前后两个操作。",
        hints: ["先只看形状，找到所有圆形。", "想一想，哪种圆形需要放回去？"],
        success: "对了！留下蓝色圆形和黄色圆形，红色圆形已经放回去了。",
        retry: "先挑圆形，再做放回这一步。",
        parentPrompt:
          "可以先用手指演一遍挑出和放回，最后剩下的为什么是这两张？",
        abilityTags: ["顺序规则", "集合变化"],
      },
    ),
    kind: "multiSelect",
    expectedTokenIds: ["yellow-circle", "blue-circle"],
  },
  {
    ...base(
      "rules-two-color-shape-pairs",
      "L01",
      "照着清单收图卡",
      "清单上有红色方形和蓝色三角形，把它们都找出来。",
      [
        "blue-square",
        "red-triangle",
        "yellow-triangle",
        "red-square",
        "yellow-square",
        "blue-triangle",
        "red-circle",
      ],
      {
        clues: ["红色要配方形。", "蓝色要配三角形。"],
        difficultyNote: "两组颜色和形状不能混在一起。",
        hints: [
          "先找红色方形，再找蓝色三角形。",
          "蓝色方形和红色三角形虽然看着相近，却不在清单里。",
        ],
        success: "清单上的两张都找到了：红色方形和蓝色三角形。",
        retry: "颜色和形状要按清单配成一组。",
        parentPrompt: "如果把清单里的两种形状交换一下，答案会怎样变？",
        abilityTags: ["条件配对", "抗干扰"],
      },
    ),
    kind: "multiSelect",
    expectedTokenIds: ["red-square", "blue-triangle"],
  },
  {
    ...base(
      "rules-exactly-one-shared-feature",
      "L01",
      "找一个共同点",
      "和这张红色圆形比，只能颜色一样，或者只能形状一样。",
      [
        "blue-circle",
        "red-circle",
        "red-square",
        "yellow-triangle",
        "yellow-circle",
        "blue-triangle",
        "red-triangle",
      ],
      {
        clues: ["比较颜色和形状。", "只能有一个共同点。"],
        level: "L6",
        difficultyNote: "分清一个共同点、两个共同点和没有共同点。",
        hints: [
          "先说每张卡和红色圆形有几个共同点。",
          "红色圆形有两个共同点，这次不能选；黄色三角形一个都没有。",
        ],
        success: "对了！选中的图卡都只和样例有一个共同点。",
        retry: "每张卡都数一数：颜色、形状，到底有几个相同？",
        parentPrompt: "让孩子分别指出一张有一个、两个和零个共同点的图卡。",
        abilityTags: ["属性比较", "排除与解释"],
      },
    ),
    kind: "multiSelect",
    expectedTokenIds: [
      "blue-circle",
      "red-square",
      "yellow-circle",
      "red-triangle",
    ],
    example: pilotTokens["red-circle"],
  },
];

function before(first: string, second: string, text: string): OrderRule {
  return { type: "before", first, second, text };
}
function position(
  tokenId: string,
  positions: number[],
  text: string,
): OrderRule {
  return { type: "position", tokenId, positions, text };
}
function nextTo(first: string, second: string, text: string): OrderRule {
  return { type: "immediatelyBefore", first, second, text };
}
function order(
  id: string,
  rules: OrderRule[],
  parentPrompt: string,
  ids = ["cat", "bear", "rabbit", "dog"],
): OrderedActivity {
  return {
    ...base(
      id,
      "L03",
      "小动物排队啦",
      "听清每条线索，把小动物从左到右排好。",
      ids,
      {
        clues: rules.map((r) => r.text),
        difficultyNote: `${rules.length}条线索一起检查。`,
        hints: [
          "先找能确定位置的小动物。",
          "把已经摆好的队伍，按每条线索检查一遍。",
        ],
        success: "这支队伍符合所有线索！说说你是怎么排出来的。",
        retry: "还有一条线索没对上，试着换换位置。",
        parentPrompt,
        abilityTags: ["关系排序", "条件推理"],
        sourceRefs: [
          { sourceId: "S105", locator: "slide7–8" },
          { sourceId: "S112", locator: "PDF p2–4" },
        ],
      },
    ),
    kind: "orderedPlacement",
    slotCount: ids.length,
    tokenUse: "once",
    evaluation: { kind: "constraints", rules },
  };
}
export const orderingActivities: Activity[] = [
  order(
    "lineup-three-in-order",
    [
      before("rabbit", "cat", "小兔在小猫前面。"),
      before("cat", "dog", "小猫在小狗前面。"),
    ],
    "没有直接说小兔和小狗的关系，为什么也能知道谁在前？",
    ["cat", "dog", "rabbit"],
  ),
  order(
    "lineup-four-chain",
    [
      before("bear", "cat", "小熊在小猫前面。"),
      before("cat", "dog", "小猫在小狗前面。"),
      before("dog", "rabbit", "小狗在小兔前面。"),
    ],
    "从队伍中间开始检查，能不能同样推出两头是谁？",
  ),
  order(
    "lineup-fixed-ends",
    [
      position("rabbit", [0], "小兔站第一个。"),
      position("bear", [3], "小熊站最后一个。"),
      before("cat", "dog", "小猫在小狗前面。"),
    ],
    "先确定两头以后，还剩几种摆法？",
  ),
  order(
    "lineup-immediate-neighbor",
    [
      position("bear", [0], "小熊站第一个。"),
      nextTo("rabbit", "dog", "小狗紧跟在小兔后面。"),
      before("cat", "rabbit", "小猫在小兔前面。"),
    ],
    "“在后面”和“紧跟在后面”有什么不同？",
  ),
  order(
    "lineup-two-valid-pairs",
    [
      before("rabbit", "cat", "小兔在小猫前面。"),
      before("dog", "bear", "小狗在小熊前面。"),
    ],
    "这题有不止一种排法。能不能换一支队伍，仍然符合两条线索？",
  ),
  order(
    "lineup-middle-and-neighbor",
    [
      position("bear", [1, 2], "小熊站第二个或第三个。"),
      nextTo("cat", "dog", "小狗紧跟在小猫后面。"),
      before("rabbit", "bear", "小兔在小熊前面。"),
    ],
    "试着让小熊站第三个，会遇到什么问题？",
  ),
];

function grid(
  id: string,
  cells: (string | null)[],
  tokenIds: string[],
  evaluation: GridActivity["evaluation"],
  overrides: Partial<ActivityBase> = {},
): GridActivity {
  return {
    ...base(
      id,
      "G03",
      "把图形盘补完整",
      "选一张图卡，再点问号格放进去。图卡可以重复用。",
      [
        ...new Set([
          ...tokenIds,
          ...cells.filter((id): id is string => id !== null),
        ]),
      ],
      {
        clues: [
          "每一行，三种图卡各出现一次。",
          "每一列，三种图卡也各出现一次。",
        ],
        difficultyNote: "横着看，再竖着看。",
        hints: [
          "先找只差一个空位的那一行或那一列。",
          "放好一张以后，再检查它所在的行和列。",
        ],
        success: "每一行和每一列都符合规则了！",
        retry: "看一看新放的图卡，会不会让同一行或同一列重复？",
        parentPrompt:
          "请孩子指出最先确定的空位，以及用的是哪一行、哪一列的线索。",
        abilityTags: ["行列约束", "图形推理"],
        sourceRefs: [
          { sourceId: "S002", locator: "PDF p14–23" },
          { sourceId: "S070", locator: "PDF p43" },
        ],
        ...overrides,
      },
    ),
    kind: "gridPlacement",
    columns: 3,
    cells,
    tokenUse: "unlimited",
    evaluation,
  };
}
const blue = ["blue-circle", "blue-square", "blue-triangle"];
export const gridActivities: Activity[] = [
  grid(
    "grid-color-and-shape",
    ["red-circle", "red-square", null, "blue-circle", null, "blue-triangle"],
    ["blue-circle", "red-triangle", "blue-square", "red-square"],
    {
      kind: "exact",
      cells: { "cell-2": "red-triangle", "cell-4": "blue-square" },
    },
    {
      clues: ["每一行都是同一种颜色。", "从左到右，都是圆形、方形、三角形。"],
      difficultyNote: "把颜色和形状两条线索合起来。",
      hints: [
        "先看问号和哪种颜色在同一行。",
        "再看问号在第几列，需要哪种形状。",
      ],
      success: "两格都补对了！颜色和形状都接上了。",
      retry: "颜色看同一行，形状再从左到右检查。",
    },
  ),
  grid(
    "grid-one-missing-rule",
    [
      "blue-circle",
      "blue-square",
      "blue-triangle",
      "blue-square",
      null,
      null,
      null,
      null,
      "blue-square",
    ],
    blue,
    { kind: "latin", tokenIds: blue },
  ),
  grid(
    "grid-diagonal-clues",
    [
      "blue-circle",
      null,
      null,
      null,
      "blue-circle",
      null,
      null,
      null,
      "blue-circle",
    ],
    blue,
    { kind: "latin", tokenIds: blue },
    {
      level: "L6",
      hints: [
        "先试着补好一整行。",
        "下面的行既要自己不重复，也要和上面的列对上。",
      ],
      parentPrompt:
        "这题可以有不同的完整图案。请逐行、逐列验证，而不是只认一种样子。",
    },
  ),
  grid(
    "grid-two-attributes",
    [
      "red-circle",
      null,
      "red-triangle",
      null,
      "blue-square",
      null,
      "yellow-circle",
      null,
      "yellow-triangle",
    ],
    [
      "blue-triangle",
      "yellow-square",
      "red-circle",
      "blue-square",
      "red-square",
      "yellow-triangle",
      "blue-circle",
      "yellow-circle",
      "red-triangle",
    ],
    {
      kind: "exact",
      cells: {
        "cell-1": "red-square",
        "cell-3": "blue-circle",
        "cell-5": "blue-triangle",
        "cell-7": "yellow-square",
      },
    },
    {
      clues: ["每一行的颜色相同。", "每一列的形状相同。"],
      level: "L6",
      difficultyNote: "同时追踪行的颜色和列的形状。",
      hints: [
        "从一行里已经有的图卡看颜色。",
        "再从同一列里看形状，把两个特点合起来。",
      ],
      success: "补齐了！每行的颜色相同，每列的形状也相同。",
      retry: "每个问号都要同时对上行的颜色和列的形状。",
    },
  ),
  grid(
    "grid-build-your-own",
    [null, null, null, null, "blue-square", null, null, null, null],
    blue,
    { kind: "latin", tokenIds: blue },
    {
      prompt: "自己搭一个图形盘",
      level: "L6",
      difficultyNote: "自己安排，再用行列规则验证。",
      hints: [
        "先把三种图形放进第一行。",
        "下一行可以换个顺序，避开上面同一列的图形。",
      ],
      parentPrompt: "这题有多种解。先让孩子解释当前摆法，再尝试换一种排列。",
    },
  ),
  grid(
    "grid-blank-is-a-card",
    [
      "blue-circle",
      null,
      "blank-card",
      null,
      "blank-card",
      null,
      "blank-card",
      null,
      "blue-square",
    ],
    ["blue-square", "blank-card", "blue-circle"],
    { kind: "latin", tokenIds: ["blue-circle", "blue-square", "blank-card"] },
    {
      clues: [
        "每行都有一个圆形、一个方形和一张空白卡。",
        "每列也要把这三种卡各放一次。",
      ],
      instruction: "空白卡也是一张图卡。每个问号都要放好，再点看看。",
      difficultyNote: "空白卡和没填的格子不一样。",
      success: "对了！空白卡也放在了合适的位置。",
      parentPrompt: "哪一格是放好了空白卡，哪一格是还没有放？请孩子说出区别。",
    },
  ),
];

function memory(
  id: string,
  preview: string[],
  ids: string[],
  options: {
    columns?: number;
    reverse?: boolean;
    hint?: string;
    observeMs?: number;
  } = {},
): Activity {
  const common = base(
    id,
    options.columns ? "A02" : "A03",
    options.reverse
      ? "倒着摆回来"
      : options.columns
        ? "记住每一格"
        : "记住这支小队伍",
    options.reverse
      ? "先看清顺序。遮住以后，从最后一张开始，倒着摆回来。"
      : options.columns
        ? "看清每个位置。遮住以后，把图卡放回原来的格子。"
        : "先看清从左到右的顺序。遮住以后，照着原来的顺序摆回来。",
    ids,
    {
      clues: [],
      level: preview.length >= 5 ? "L6" : "L5",
      difficultyNote: options.reverse
        ? "记住以后，再把顺序倒过来。"
        : options.columns
          ? "不仅记住有什么，还要记住在哪里。"
          : "可以把相邻的图卡连成小组来记。",
      hints: [
        options.hint ?? "先想一想，最容易记住的是哪一张？",
        "把记得清楚的先放好，再回想旁边是什么。",
      ],
      success: options.reverse
        ? "对了！你把刚才的顺序倒过来摆好了。"
        : "记住了！说说你用了什么办法。",
      retry: options.columns
        ? "位置还差一点，想想每张图卡刚才住在哪一格。"
        : "顺序还差一点，试着在脑海里把刚才的队伍过一遍。",
      parentPrompt: options.reverse
        ? "先问孩子原顺序是什么，再问倒着回忆是从哪一张开始。"
        : "可以问：你是逐张记的，还是分成小组、编成小故事来记的？",
      abilityTags: [
        options.columns ? "位置记忆" : "顺序记忆",
        options.reverse ? "逆序回忆" : "主动重现",
      ],
      protocol: {
        kind: "memory",
        observeMs: options.observeMs ?? 10000,
        retainMs: 1000,
        preview,
      },
      sourceRefs: [
        { sourceId: "S002", locator: "PDF p6–13" },
        { sourceId: "S005", locator: "PDF p29" },
      ],
    },
  );
  if (preview.includes("blank-card"))
    common.instruction += "空白卡也要放回原位。";
  if (options.columns)
    return {
      ...common,
      kind: "gridPlacement",
      columns: options.columns,
      cells: preview.map(() => null),
      tokenUse: "unlimited",
      evaluation: {
        kind: "exact",
        cells: Object.fromEntries(preview.map((id, i) => [`cell-${i}`, id])),
      },
    };
  return {
    ...common,
    kind: "orderedPlacement",
    slotCount: preview.length,
    tokenUse: "unlimited",
    evaluation: {
      kind: "sequence",
      tokenIds: options.reverse ? [...preview].reverse() : preview,
    },
  };
}
export const memoryActivities: Activity[] = [
  memory(
    "memory-animal-line",
    ["rabbit", "cat", "bear", "dog"],
    ["dog", "rabbit", "bear", "cat"],
  ),
  memory(
    "memory-repeated-fruit",
    ["apple", "strawberry", "apple", "cookie", "strawberry"],
    ["strawberry", "orange", "cookie", "apple"],
    { hint: "有些水果出现了不止一次，想想它们分别在哪。", observeMs: 12000 },
  ),
  memory(
    "memory-six-positions",
    ["apple", "bear", "cat", "rabbit", "dog", "cookie"],
    ["dog", "cookie", "apple", "cat", "bear", "rabbit"],
    { columns: 3, observeMs: 12000 },
  ),
  memory(
    "memory-two-groups",
    [
      "red-circle",
      "blue-square",
      "yellow-triangle",
      "red-circle",
      "blue-square",
      "yellow-triangle",
    ],
    ["blue-square", "red-triangle", "yellow-triangle", "red-circle"],
    { hint: "看看能不能把相邻的三个图形当作一组。", observeMs: 12000 },
  ),
  memory(
    "memory-blank-positions",
    ["rabbit", "blank-card", "dog", "blank-card", "bear", "cat"],
    ["cat", "blank-card", "dog", "rabbit", "bear"],
    {
      columns: 3,
      hint: "空白卡也占一个位置，想想刚才哪两格是空白卡。",
      observeMs: 12000,
    },
  ),
  memory(
    "memory-reverse-five",
    [
      "red-circle",
      "blue-square",
      "yellow-triangle",
      "blue-circle",
      "red-square",
    ],
    [
      "yellow-circle",
      "red-square",
      "blue-circle",
      "red-circle",
      "yellow-triangle",
      "blue-square",
    ],
    {
      reverse: true,
      hint: "先想起最后看到的那张，再往前一张一张找。",
      observeMs: 12000,
    },
  ),
];

function set(
  id: string,
  title: string,
  world: ActivitySet["world"],
  label: string,
  rounds: Activity[],
  goal: string,
): ActivitySet {
  return {
    id,
    kind: "activitySet",
    title,
    world,
    interactionLabel: label,
    subtitle: goal,
    goal,
    parentPrompt: "先让孩子自己试，再请他指出线索、说说理由。",
    abilityTags: [...new Set(rounds.flatMap((r) => r.abilityTags))],
    level: "L6",
    rounds,
  };
}
export const activitySets: ActivitySet[] = [
  set(
    "logic-rule-workshop",
    "规则收纳盒",
    "logic",
    "多选",
    selectionActivities,
    "用颜色和形状的不同条件，挑出所有符合要求的图卡。",
  ),
  set(
    "logic-lineup-challenge",
    "线索排排队",
    "logic",
    "摆顺序",
    orderingActivities,
    "根据几条关系线索，把小动物排成符合条件的队伍。",
  ),
  set(
    "graphic-rule-grid",
    "图形推理盘",
    "graphic",
    "填图形",
    gridActivities,
    "横着看、竖着看，把每个问号补成符合规则的图形盘。",
  ),
  set(
    "logic-memory-placement",
    "记忆摆一摆",
    "logic",
    "看后回忆",
    memoryActivities,
    "记住图卡的顺序和位置，遮住以后自己摆回来。",
  ),
];
