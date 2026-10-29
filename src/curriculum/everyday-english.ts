import { imageGallery, type GalleryImage } from '../data/imageGallery';
import type { Activity, ActivityBase, ActivitySet, ActivityToken } from '../domain/activity';
import { stableChoiceOrder } from './exploration/helpers';

type DialogueLine = { speaker: string; english: string; chinese: string };
type EverydayScene = {
  id: string;
  title: string;
  image: GalleryImage;
  prompt: string;
  answer: string;
  alternatives: [string, string];
  reason: string;
  hint: string;
  dialogue: DialogueLine[];
  materials: string[];
  steps: string[];
  parentPrompt: string;
};
type EverydayTopic = { id: string; title: string; goal: string; scenes: EverydayScene[] };

const topics: EverydayTopic[] = [
  {
    id: 'greetings', title: '见面与告别', goal: '听懂早晨问候和告别，和家长轮流说。',
    scenes: [
      {
        id: 'morning', title: '早上好', image: imageGallery.scenes.englishDailyMorning,
        prompt: '早上起床，孩子想向家长说“早上好”。选哪一句？',
        answer: 'Good morning.', alternatives: ['Good night.', 'Goodbye.'],
        reason: '这是早晨见面时的问候。说的时候，可以看看对方，挥挥手。',
        hint: '现在刚起床，是早晨。孩子想问好，还没有准备告别。',
        dialogue: [
          { speaker: '孩子', english: 'Good morning.', chinese: '早上好。' },
          { speaker: '家长', english: 'Good morning.', chinese: '早上好。' },
        ],
        materials: ['屏幕上的早晨图'],
        steps: ['看看窗外的阳光，听一听两个人怎样问好。', '一个人扮孩子，一个人扮家长，挥手说早上好。', '交换角色再说一次。明天起床时，也可以试着用上这句话。'],
        parentPrompt: '从哪里看出是早晨？晚上准备睡觉时，还会用同一句话吗？',
      },
      {
        id: 'farewell', title: '下次见', image: imageGallery.scenes.englishDailyFarewell,
        prompt: '幼儿园放学了，孩子想和老师说“再见”，再跟家长回家。选哪一句？',
        answer: 'Goodbye.', alternatives: ['Good morning.', 'Hello.'],
        reason: '放学要回家时，可以向老师说再见，再跟着家长走。',
        hint: '孩子背好书包，家长来接她了。她正在向教室门口的老师告别。',
        dialogue: [
          { speaker: '要回家的孩子', english: 'Goodbye.', chinese: '再见。' },
          { speaker: '老师', english: 'See you later.', chinese: '回头见。' },
        ],
        materials: ['屏幕上的告别图'],
        steps: ['指一指孩子、家长和教室门口的老师，听听孩子和老师的告别。', '一个人扮放学的孩子，一个人扮老师。孩子挥手告别，老师回应。', '交换角色再试一次。下次离开幼儿园时，也可以这样和老师说再见。'],
        parentPrompt: '家长来接了，老师还在门口挥手。离开前可以怎样和老师告别？',
      },
    ],
  },
  {
    id: 'kind-words', title: '谢谢与抱歉', goal: '看懂谁得到帮助、谁需要道歉，练习礼貌回应。',
    scenes: [
      {
        id: 'thanks', title: '谢谢你帮我', image: imageGallery.scenes.englishDailyThanks,
        prompt: '朋友把掉落的小熊递回来。接过小熊的孩子想说“谢谢”。选哪一句？',
        answer: 'Thank you.', alternatives: ["You're welcome.", "I'm sorry."],
        reason: '接过小熊的孩子得到了帮助，可以先说谢谢。帮忙的朋友可以回应不客气。',
        hint: '先找接过小熊的孩子：她得到了帮助，想感谢朋友。',
        dialogue: [
          { speaker: '接过小熊的孩子', english: 'Thank you.', chinese: '谢谢你。' },
          { speaker: '帮忙的朋友', english: "You're welcome.", chinese: '不客气。' },
        ],
        materials: ['一个小玩具'],
        steps: ['听听得到帮助的孩子和帮忙的朋友各说什么。', '一个人帮忙递回玩具，另一个人接过玩具说谢谢，再听朋友回应。', '交换角色；也可以换成帮忙递书，试着说同样的两句话。'],
        parentPrompt: '是谁得到了帮助？为什么先说谢谢的是接过小熊的孩子？',
      },
      {
        id: 'sorry', title: '不小心碰倒了', image: imageGallery.scenes.englishDailySorry,
        prompt: '孩子不小心碰倒朋友的积木，想先说“对不起”。选哪一句？',
        answer: "I'm sorry.", alternatives: ["That's OK.", "You're welcome."],
        reason: '碰倒积木的孩子可以先道歉，再问问朋友需不需要帮忙重搭。',
        hint: '是碰倒积木的孩子先说话。她想为刚才的事情道歉。',
        dialogue: [
          { speaker: '碰倒积木的孩子', english: "I'm sorry.", chinese: '对不起。' },
          { speaker: '朋友', english: "That's OK.", chinese: '没关系。' },
        ],
        materials: ['几块积木'],
        steps: ['听听道歉和回应。先商量好，一起演一次“不小心碰倒积木”。', '碰倒积木的人道歉，另一人可以照着示范回应，也可以说自己还难过。', '交换角色，再一起把积木搭好，想想道歉以后还能做什么。'],
        parentPrompt: '朋友还难过时，可以先听朋友说，不必催着回答没关系。除了道歉，我们还能怎样补救？',
      },
    ],
  },
  {
    id: 'asking', title: '我需要帮助', goal: '用简短英语说出需要，听懂对方的回应。',
    scenes: [
      {
        id: 'water', title: '我想喝点水', image: imageGallery.scenes.englishDailyWater,
        prompt: '孩子口渴了，想请家长给自己一点水。选哪一句？',
        answer: 'Can I have some water, please?', alternatives: ['Here you are.', 'No, thank you.'],
        reason: '想喝水时，可以礼貌地说出自己需要水。递水的人再回应“给你”。',
        hint: '孩子还没有拿到水。她现在想请求一点水。',
        dialogue: [
          { speaker: '孩子', english: 'Can I have some water, please?', chinese: '请给我一点水，好吗？' },
          { speaker: '家长', english: 'Here you are.', chinese: '给你。' },
        ],
        materials: ['一个杯子', '一点饮用水，也可以先假装递水'],
        steps: ['指着杯子听请求，再听递水的人怎样回应。', '孩子可以先跟着说关键词，再试着说整句；家长回应并递杯子。', '交换角色。喝水时先停下说话，喝完再谢谢对方。'],
        parentPrompt: '哪句话说出了需要什么？如果只伸手，对方一定知道你想要水吗？',
      },
      {
        id: 'help', title: '请帮帮我', image: imageGallery.scenes.englishDailyHelp,
        prompt: '孩子拉不上外套拉链，想请家长帮忙。选哪一句？',
        answer: 'Can you help me, please?', alternatives: ['Of course.', 'I can do it.'],
        reason: '遇到困难可以开口求助，再指一指需要帮忙的地方。家长愿意帮忙时可以回应“当然可以”。',
        hint: '拉链还没有拉好。孩子需要帮助，现在轮到她开口请求。',
        dialogue: [
          { speaker: '孩子', english: 'Can you help me, please?', chinese: '请帮帮我，好吗？' },
          { speaker: '家长', english: 'Of course.', chinese: '当然可以。' },
        ],
        materials: ['一件带拉链的外套，也可以指着图演'],
        steps: ['找一找孩子需要帮助的地方，逐句听听请求和回应。', '一个人指着拉链请求帮忙，另一个人回应，再一起完成。', '交换角色。换成拿不到书的情境，试试同一句求助。'],
        parentPrompt: '为什么这里要请求帮助？同一句求助还能用在哪件小事上？',
      },
    ],
  },
];

function base(topic: EverydayTopic, scene: EverydayScene, rolePlay: boolean): ActivityBase {
  return {
    id: `everyday-english-${scene.id}-${rolePlay ? 'talk' : 'choose'}`,
    schemaVersion: 1, revision: 1, primaryFamilyId: `original-english-${topic.id}`,
    level: rolePlay ? 'L3' : 'L2', stage: rolePlay ? 2 : 1,
    difficultyNote: rolePlay ? '听示范，借助动作轮流回应；可以由家长带说。' : '看一个生活情境，听三句话，选出符合说话人意图的一句。',
    prerequisites: '不需要先会读英语，可以请家长一起听和说。',
    prompt: rolePlay ? `${scene.title}：和家长换角色说一说。` : scene.prompt,
    instruction: rolePlay ? '点示范句听一听，再轮流说。需要时可以看图、做动作。' : '点句子听英语，再点“选好了，看看”。',
    clues: [], tokens: [], hints: [scene.hint, scene.reason],
    success: rolePlay ? '这次亲子对话已经记录。下次遇到这样的情境，再试着说一说。' : scene.reason,
    retry: '再想想现在是谁在说话，想表达什么。可以点句子再听听。',
    parentPrompt: scene.parentPrompt, abilityTags: ['日常英语', '情境表达', '轮流交流'],
    protocol: { kind: 'practice' },
    // Original supplement: this is its authoring specification, not a benchmark-source claim.
    sourceRefs: [{ sourceId: 'original-060', locator: 'specs/060-everyday-english/spec.md' }],
    illustration: scene.image, presentation: { dialogue: scene.dialogue },
    difficulty: {
      rules: 1, steps: rolePlay ? 2 : 1, memory: 0, representation: 'pictures', reading: 0, motor: 1,
      calibration: 'design-estimate', languageLocale: 'en-US',
      basis: '中文说明和逐句英语朗读支持情境理解；英语听说负荷需真实亲子试玩校准。',
    },
  };
}

function sceneActivities(topic: EverydayTopic, scene: EverydayScene): Activity[] {
  const options = [scene.answer, ...scene.alternatives].map((english, index): ActivityToken => ({
    id: `phrase-${index}`, label: english, speechText: english, speechLocale: 'en-US', textOnly: true,
    // ActivityToken requires a registered image; textOnly renders the phrase without this asset.
    image: imageGallery.items.book,
  }));
  return [
    { ...base(topic, scene, false), kind: 'singleChoice', answerId: 'phrase-0', tokens: stableChoiceOrder(options, `everyday-english:${scene.id}`) },
    {
      ...base(topic, scene, true), kind: 'parentObservation', materials: scene.materials, steps: scene.steps,
      observations: [
        { id: 'meaning', text: '能用指图、动作或说话表示这句话的意思' },
        { id: 'response', text: '能尝试跟说或用一句英语回应' },
        { id: 'turn-taking', text: '能等对方说完，再轮到自己说' },
      ],
    },
  ];
}

export const everydayEnglishSets: ActivitySet[] = topics.map(topic => ({
  id: `everyday-english-${topic.id}`, kind: 'activitySet', world: 'language', title: topic.title,
  subtitle: '英语日常说', goal: topic.goal,
  parentPrompt: '先听、指一指，再试着轮流说。可以跟说或用动作帮忙，不用纠结每个音是否完美。',
  abilityTags: ['日常英语', '情境表达', '轮流交流'], level: 'L2',
  interactionLabel: '看图与对话', rounds: topic.scenes.flatMap(scene => sceneActivities(topic, scene)),
}));
