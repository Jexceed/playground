import { Volume2 } from "lucide-react";
import { imageGallery } from "../data/imageGallery";
import { speak } from "../speech";

type TokenMeta = {
  label: string;
  kind: string;
  compact?: boolean;
};

const tokenMap: Record<string, TokenMeta> = {
  "🍓": { label: "草莓", kind: "strawberry" },
  "🍪": { label: "饼干", kind: "cookie" },
  "⭐": { label: "星星", kind: "star" },
  "🟡": { label: "黄色圆片", kind: "yellowDot" },
  "🟢": { label: "绿色圆片", kind: "greenDot" },
  "🔵": { label: "蓝色圆片", kind: "blueDot" },
  "🔴": { label: "红色圆片", kind: "redDot" },
  "🟣": { label: "紫色圆片", kind: "purpleDot" },
  "⬜": { label: "空位", kind: "emptyBox" },
  "🟦": { label: "蓝色方块", kind: "blueSquare" },
  "🍎": { label: "苹果", kind: "apple" },
  "🧁": { label: "纸杯蛋糕", kind: "cupcake" },
  "🍊": { label: "橘子", kind: "orange" },
  "🧱": { label: "积木", kind: "block" },
  "🐦": { label: "小鸟", kind: "bird" },
  "🐟": { label: "小鱼", kind: "fish" },
  "🐱": { label: "小猫", kind: "cat" },
  "😺": { label: "小橘猫", kind: "orangeCat" },
  "⚽": { label: "足球", kind: "soccer" },
  "✏": { label: "铅笔", kind: "pencil" },
  "✏️": { label: "铅笔", kind: "pencil" },
  "🍽️": { label: "盘子", kind: "plate" },
  "🍬": { label: "糖果", kind: "candy" },
  "🧒": { label: "小朋友", kind: "child" },
  "👧": { label: "小女孩", kind: "childGirl" },
  "👦": { label: "小男孩", kind: "childBoy" },
  "☀️": { label: "太阳", kind: "sun" },
  "🌙": { label: "月亮", kind: "moon" },
  "🥤": { label: "杯子", kind: "cup" },
  "💧": { label: "水", kind: "water" },
  "🎁": { label: "魔法盒", kind: "magicBox" },
  "➡️": { label: "箭头", kind: "arrow", compact: true },
  "🐰": { label: "小兔", kind: "rabbit" },
  "🥕": { label: "胡萝卜", kind: "carrot" },
  "🐶": { label: "小狗", kind: "dog" },
  "🌱": { label: "发芽", kind: "sprout" },
  "🌼": { label: "花", kind: "flower" },
  "🏃": { label: "跑步", kind: "run" },
  "🐻": { label: "小熊", kind: "bear" },
  "🍯": { label: "蜂蜜", kind: "honey" },
  "🌊": { label: "小河", kind: "river" },
  "🏁": { label: "终点", kind: "goal" },
  "?": { label: "待补位置", kind: "missingSlot", compact: true },
  "|": { label: "竖中线", kind: "verticalFold", compact: true },
  "-": { label: "横中线", kind: "horizontalFold", compact: true },
  "⬤": { label: "大圆", kind: "bigDot" },
  "●": { label: "中圆", kind: "mediumDot" },
  "•": { label: "小圆", kind: "smallDot", compact: true },
};

const phraseMap: Record<string, TokenMeta> = {
  "小猫": { label: "小猫", kind: "cat" },
  "小狗": { label: "小狗", kind: "dog" },
  "小兔": { label: "小兔", kind: "rabbit" },
  "小熊": { label: "小熊", kind: "bear" },
  "小鸟": { label: "小鸟", kind: "bird" },
  "小鱼": { label: "小鱼", kind: "fish" },
  "小朋友": { label: "小朋友", kind: "child" },
  "小河": { label: "小河", kind: "river" },
  "苹果": { label: "苹果", kind: "apple" },
  "橘子": { label: "橘子", kind: "orange" },
  "草莓": { label: "草莓", kind: "strawberry" },
  "葡萄": { label: "葡萄", kind: "grape" },
  "饼干": { label: "饼干", kind: "cookie" },
  "糖果": { label: "糖果", kind: "candy" },
  "蛋糕": { label: "蛋糕", kind: "cake" },
  "杯子": { label: "杯子", kind: "cup" },
  "盘子": { label: "盘子", kind: "plate" },
  "盒子": { label: "盒子", kind: "box" },
  "小汽车": { label: "小汽车", kind: "car" },
  "玩具车": { label: "玩具车", kind: "car" },
  "公交车": { label: "公交车", kind: "bus" },
  "自行车": { label: "自行车", kind: "bike" },
  "飞机": { label: "飞机", kind: "plane" },
  "风筝": { label: "风筝", kind: "kite" },
  "铅笔": { label: "铅笔", kind: "pencil" },
  "文具盒": { label: "文具盒", kind: "pencilCase" },
  "书包": { label: "书包", kind: "backpack" },
  "尺子": { label: "尺子", kind: "ruler" },
  "三角尺": { label: "三角尺", kind: "setSquare" },
  "书本": { label: "书本", kind: "book" },
  "水壶": { label: "水壶", kind: "waterBottle" },
  "水": { label: "水", kind: "water" },
  "饭盒": { label: "饭盒", kind: "lunchBox" },
  "帽子": { label: "帽子", kind: "sunHat" },
  "雨衣": { label: "雨衣", kind: "raincoat" },
  "足球": { label: "足球", kind: "soccer" },
  "积木塔": { label: "积木塔", kind: "tower" },
  "大圆": { label: "大圆", kind: "bigDot" },
  "中圆": { label: "中圆", kind: "mediumDot" },
  "小圆": { label: "小圆", kind: "smallDot" },
  "红色圆片": { label: "红色圆片", kind: "redDot" },
  "黄色圆片": { label: "黄色圆片", kind: "yellowDot" },
  "绿色圆片": { label: "绿色圆片", kind: "greenDot" },
  "蓝色圆片": { label: "蓝色圆片", kind: "blueDot" },
  "紫色圆片": { label: "紫色圆片", kind: "purpleDot" },
  "蓝色方块": { label: "蓝色方块", kind: "blueSquare" },
  "大星": { label: "大星", kind: "star" },
  "小星": { label: "小星", kind: "smallStar" },
  "星星": { label: "星星", kind: "star" },
  "大方块": { label: "大方块", kind: "bigSquare" },
  "小方块": { label: "小方块", kind: "smallSquare" },
  "太阳": { label: "太阳", kind: "sun" },
  "月亮": { label: "月亮", kind: "moon" },
  "天空": { label: "天空", kind: "sky" },
  "家": { label: "家", kind: "home" },
  "门": { label: "门", kind: "door" },
  "钥匙": { label: "钥匙", kind: "key" },
  "起点": { label: "起点", kind: "startFlag" },
  "终点": { label: "终点", kind: "goal" },
  "遮住了": { label: "遮住了", kind: "coveredCard" },
  "小鸟天空": { label: "小鸟和天空", kind: "birdSky" },
  "小鱼小河": { label: "小鱼和小河", kind: "fishWater" },
  "小狗家": { label: "小狗和家", kind: "dogHome" },
  "左边": { label: "左边", kind: "leftArrow" },
  "右边": { label: "右边", kind: "rightArrow" },
  "上面": { label: "上面", kind: "upArrow" },
  "下面": { label: "下面", kind: "downArrow" },
  "绿灯": { label: "绿灯", kind: "greenDot" },
  "红灯": { label: "红灯", kind: "redDot" },
  "红色": { label: "红色", kind: "redDot" },
  "蓝色": { label: "蓝色", kind: "blueDot" },
  "绿色": { label: "绿色", kind: "greenDot" },
  "黄色": { label: "黄色", kind: "yellowDot" },
  "红色篮子": { label: "红色篮子", kind: "redDot" },
  "蓝色篮子": { label: "蓝色篮子", kind: "blueDot" },
  "绿色篮子": { label: "绿色篮子", kind: "greenDot" },
  "黄色篮子": { label: "黄色篮子", kind: "yellowDot" },
  "圆形篮子": { label: "圆形篮子", kind: "bigDot" },
  "方形篮子": { label: "方形篮子", kind: "bigSquare" },
  "按红绿灯走": { label: "按红绿灯走", kind: "normalRule" },
  "玩反口令": { label: "玩反口令", kind: "reverseRule" },
  "反着来": { label: "反着来", kind: "reverseRule" },
  "慢慢来": { label: "慢慢来", kind: "slowRule" },
  "绿灯慢慢走": { label: "绿灯慢慢走", kind: "slowRule" },
  "红灯先拍手": { label: "红灯先拍手", kind: "clap" },
  "先拍手": { label: "先拍手", kind: "clap" },
  "走": { label: "走", kind: "walk" },
  "停": { label: "停", kind: "stopSign" },
  "慢慢走": { label: "慢慢走", kind: "slowRule" },
  "拍手": { label: "拍手", kind: "clap" },
  "停下等": { label: "停下等", kind: "stopSign" },
  "看到门": { label: "看到门", kind: "door" },
  "门关着": { label: "门关着", kind: "door" },
  "开门": { label: "开门", kind: "openDoor" },
  "进屋": { label: "进屋", kind: "home" },
  "口渴": { label: "口渴", kind: "cup" },
  "上课": { label: "上课", kind: "book" },
  "写字": { label: "写字", kind: "pencil" },
  "去学校": { label: "去学校", kind: "backpack" },
  "下雨": { label: "下雨", kind: "raincoat" },
  "出门": { label: "出门", kind: "walk" },
  "倒水": { label: "倒水", kind: "pourWater" },
  "喝水": { label: "喝水", kind: "cup" },
  "空花盆": { label: "空花盆", kind: "seed" },
  "小鱼在岸上": { label: "小鱼在岸上", kind: "fishWater" },
  "小岛": { label: "小岛", kind: "stone" },
  "先拿杯子": { label: "先拿杯子", kind: "cup" },
  "先找钥匙": { label: "先找钥匙", kind: "key" },
  "先搭桥": { label: "先搭桥", kind: "bridge" },
  "种下种子": { label: "种下种子", kind: "seed" },
  "先浇水": { label: "先浇水", kind: "pourWater" },
  "先摘花": { label: "先摘花", kind: "flower" },
  "先洗手": { label: "先洗手", kind: "washHands" },
  "少了先洗手": { label: "少了先洗手", kind: "washHands" },
  "先捡积木": { label: "先捡积木", kind: "pickBlocks" },
  "先飞回去": { label: "先飞回去", kind: "flyHome" },
  "轻轻放回水里": { label: "放回水里", kind: "fishWater" },
  "先分类": { label: "先分类", kind: "sortToys" },
  "先倒水": { label: "先倒水", kind: "pourWater" },
  "拿杯子接水": { label: "拿杯子接水", kind: "pourWater" },
  "端空杯子过去": { label: "端空杯子过去", kind: "cup" },
  "再拿一个杯子": { label: "再拿一个杯子", kind: "cup" },
  "继续看着": { label: "继续看着", kind: "notYet" },
  "只给空土浇水": { label: "只给空土浇水", kind: "pourWater" },
  "直接等开花": { label: "直接等开花", kind: "flower" },
  "先看灯": { label: "先看灯", kind: "trafficLook" },
  "拿盘子": { label: "拿盘子", kind: "plate" },
  "拿饼干": { label: "拿饼干", kind: "cookie" },
  "放进盒子": { label: "放进盒子", kind: "tidyBox" },
  "先放进盒子": { label: "先放进盒子", kind: "tidyBox" },
  "先拿饼干": { label: "先拿饼干", kind: "cookie" },
  "先吃饼干": { label: "先吃饼干", kind: "eat" },
  "直接吃": { label: "直接吃", kind: "eat" },
  "先拿盘子": { label: "先拿盘子", kind: "plate" },
  "只拿盘子": { label: "只拿盘子", kind: "plate" },
  "少了拿盘子": { label: "少了拿盘子", kind: "plate" },
  "少了多拿饼干": { label: "少了多拿饼干", kind: "cookie" },
  "先拿胡萝卜": { label: "先拿胡萝卜", kind: "carrot" },
  "先搭高塔": { label: "先搭高塔", kind: "tower" },
  "直接搭高塔": { label: "直接搭高塔", kind: "tower" },
  "等红灯再走": { label: "等红灯再走", kind: "stopSign" },
  "继续等着": { label: "继续等着", kind: "slowRule" },
  "闭眼往前走": { label: "闭眼往前走", kind: "walk" },
  "站在岸边等": { label: "站在岸边等", kind: "noBridge" },
  "再洗手": { label: "再洗手", kind: "washHands" },
  "继续洗手": { label: "继续洗手", kind: "washHands" },
  "直接走进水里": { label: "直接走进水里", kind: "river" },
  "把木板接长": { label: "把木板接长", kind: "twoPlanks" },
  "继续用短木板": { label: "继续用短木板", kind: "shortPlank" },
  "换同样短木板": { label: "换同样短木板", kind: "shortPlank" },
  "重新弄乱": { label: "重新弄乱", kind: "toysMess" },
  "随便塞进盒子": { label: "随便塞进盒子", kind: "toysMess" },
  "吃": { label: "吃", kind: "eat" },
  "🧱倒了": { label: "积木倒了", kind: "fallenBlocks" },
  "高塔": { label: "高塔", kind: "tower" },
  "鸟窝": { label: "鸟窝", kind: "nest" },
  "手脏": { label: "手脏", kind: "dirtyHands" },
  "路口": { label: "路口", kind: "crosswalk" },
  "走过去": { label: "走过去", kind: "walk" },
  "玩具散了": { label: "玩具散了", kind: "toysMess" },
  "整齐": { label: "整齐", kind: "tidyBox" },
  "宽河": { label: "宽河", kind: "wideRiver" },
  "河有多宽": { label: "河有多宽", kind: "wideRiver" },
  "木板颜色": { label: "木板颜色", kind: "longPlank" },
  "小旗颜色": { label: "小旗颜色", kind: "goal" },
  "长": { label: "长木板", kind: "longPlank" },
  "短": { label: "短木板", kind: "shortPlank" },
  "太短": { label: "太短木板", kind: "tinyPlank" },
  "只能用2块": { label: "只能用两块", kind: "twoLimit" },
  "长木板": { label: "长木板", kind: "longPlank" },
  "短木板": { label: "短木板", kind: "shortPlank" },
  "太短木板": { label: "太短木板", kind: "tinyPlank" },
  "只用长木板": { label: "只用长木板", kind: "longPlank" },
  "只用短木板": { label: "只用短木板", kind: "shortPlank" },
  "用两块木板": { label: "用两块木板", kind: "twoPlanks" },
  "长 + 短": { label: "长加短", kind: "longShort" },
  "短 + 太短": { label: "短加太短", kind: "shortTiny" },
  "太短 + 太短": { label: "太短加太短", kind: "tinyTiny" },
  "小石头": { label: "小石头", kind: "stone" },
  "不搭桥": { label: "不搭桥", kind: "noBridge" },
  "都不要": { label: "都不要", kind: "none" },
  "两个都一样": { label: "两个都一样", kind: "same" },
  "都一样": { label: "都一样", kind: "same" },
  "一样多": { label: "一样多", kind: "same" },
  "左右能重合": { label: "左右能重合", kind: "verticalFold" },
  "上下能重合": { label: "上下能重合", kind: "horizontalFold" },
  "不能重合": { label: "不能重合", kind: "none" },
  "能确定": { label: "能确定", kind: "certain" },
  "还不能确定": { label: "还不能确定", kind: "notYet" },
  "证据已经够了": { label: "证据已经够了", kind: "certain" },
  "还需要更多线索": { label: "还需要更多线索", kind: "notYet" },
  "不用再看线索": { label: "不用再看线索", kind: "none" },
  "不用再找线索": { label: "不用再找线索", kind: "none" },
  "一定是小狗": { label: "一定是小狗", kind: "dog" },
  "一定是小猫": { label: "一定是小猫", kind: "cat" },
  "小猫肯定没偷吃": { label: "小猫肯定没偷吃", kind: "cleanCat" },
  "小狗肯定没弄乱": { label: "小狗肯定没弄乱", kind: "dogSleep" },
};

const clueRules: Array<[RegExp, TokenMeta]> = [
  [/小猫.*奶油|猫.*奶油/, { label: "小猫嘴边有奶油", kind: "catCream" }],
  [/小狗.*睡觉/, { label: "小狗在睡觉", kind: "dogSleep" }],
  [/小兔.*胡萝卜/, { label: "小兔拿着胡萝卜", kind: "rabbitCarrot" }],
  [/猫脚印/, { label: "猫脚印", kind: "pawPrints" }],
  [/小猫在厨房/, { label: "小猫在厨房", kind: "catKitchen" }],
  [/蛋糕少了一块/, { label: "蛋糕少了一块", kind: "cakeMissing" }],
  [/小狗脚上有泥/, { label: "小狗脚上有泥", kind: "dogMud" }],
  [/小猫身上很干净/, { label: "小猫很干净", kind: "cleanCat" }],
  [/倒下的杯子/, { label: "倒下的杯子", kind: "fallenCup" }],
  [/地上有水/, { label: "地上有水", kind: "waterPuddle" }],
  [/花粉/, { label: "手上有花粉", kind: "pollenPaw" }],
  [/小狗在房间里/, { label: "小狗在房间里", kind: "dogRoom" }],
  [/小鸟在窗边/, { label: "小鸟在窗边", kind: "birdSky" }],
];

export function VisualToken({ value }: { value: string }) {
  const exact = visualMetaFor(value);
  if (exact) {
    return <TokenButton label={exact.label} compact={exact.compact} kind={exact.kind} />;
  }

  const parts = visualParts(value);
  const repeatedVisuals = parts.length > 1 && parts.length <= 6 && parts.every((part) => tokenMap[part]);
  if (repeatedVisuals) {
    const label = parts.map((part) => tokenMap[part].label).join("、");
    return (
      <button className="visual-token visual-token-multi" type="button" onClick={() => speak(label)} aria-label={label}>
        <span className="mini-token-grid" aria-hidden="true">
          {parts.map((part, index) => (
            <Illustration kind={tokenMap[part].kind} key={`${part}-${index}`} small />
          ))}
        </span>
        <small>{label}</small>
        <Volume2 className="token-audio" size={13} aria-hidden="true" />
      </button>
    );
  }

  return (
    <button className={`visual-token ${value.length > 3 ? "visual-token-text" : "visual-token-short"}`} type="button" onClick={() => speak(value)}>
      <span>{value}</span>
      <Volume2 className="token-audio" size={13} aria-hidden="true" />
    </button>
  );
}

export function visualParts(value: string) {
  return Array.from(value).filter((part) => part !== "\uFE0F");
}

export function visualMetaFor(value: string): TokenMeta | null {
  const exact = tokenMap[value] ?? phraseMap[value];
  if (exact) return exact;
  return clueRules.find(([pattern]) => pattern.test(value))?.[1] ?? null;
}

export function VisualGlyph({ kind, small = false }: { kind: string; small?: boolean }) {
  return <Illustration kind={kind} small={small} />;
}

function TokenButton({ compact, label, kind }: { compact?: boolean; label: string; kind: string }) {
  return (
    <button className={`visual-token ${compact ? "visual-token-compact" : ""}`} type="button" onClick={() => speak(label)} aria-label={label}>
      <Illustration kind={kind} />
      <small>{label}</small>
      <Volume2 className="token-audio" size={13} aria-hidden="true" />
    </button>
  );
}

function Illustration({ kind, small = false }: { kind: string; small?: boolean }) {
  const raster = rasterForKind(kind);
  if (raster) {
    return <img className={`kid-illustration kid-avatar ${small ? "small" : ""}`} src={raster.src} alt="" aria-hidden="true" />;
  }

  return (
    <svg className={`kid-illustration ${small ? "small" : ""}`} viewBox="0 0 96 96" role="img" aria-hidden="true">
      <CrayonTexture />
      {draw(kind)}
    </svg>
  );
}

function rasterForKind(kind: string) {
  if (kind === "cat" || kind === "orangeCat") return imageGallery.characters.cat;
  if (kind === "dog") return imageGallery.characters.dog;
  if (kind === "rabbit") return imageGallery.characters.rabbit;
  if (kind === "bear") return imageGallery.characters.bear;
  if (kind === "strawberry") return imageGallery.items.strawberry;
  if (kind === "apple") return imageGallery.items.apple;
  if (kind === "orange") return imageGallery.items.orange;
  if (kind === "grape") return imageGallery.items.grape;
  if (kind === "cookie") return imageGallery.items.cookie;
  if (kind === "dirtyHands") return imageGallery.items.dirtyHands;
  if (kind === "washHands") return imageGallery.items.washHands;
  if (kind === "plate") return imageGallery.items.plate;
  if (kind === "eat") return imageGallery.items.eatCookie;
  if (kind === "trafficLook") return imageGallery.items.trafficLook;
  if (kind === "stopSign") return imageGallery.items.stopWait;
  if (kind === "walk") return imageGallery.items.walkCrosswalk;
  if (kind === "toysMess") return imageGallery.items.toysMess;
  if (kind === "sortToys") return imageGallery.items.sortToys;
  if (kind === "tidyBox") return imageGallery.items.tidyBox;
  if (kind === "river" || kind === "wideRiver") return imageGallery.items.river;
  if (kind === "bridge") return imageGallery.items.bridge;
  if (kind === "longPlank") return imageGallery.items.longPlank;
  if (kind === "shortPlank") return imageGallery.items.shortPlank;
  if (kind === "tinyPlank") return imageGallery.items.tinyPlank;
  if (kind === "twoPlanks") return imageGallery.items.twoPlanks;
  if (kind === "backpack") return imageGallery.items.backpack;
  if (kind === "book") return imageGallery.items.book;
  if (kind === "pencil") return imageGallery.items.pencil;
  if (kind === "ruler" || kind === "setSquare") return imageGallery.items.ruler;
  if (kind === "pencilCase") return imageGallery.items.pencilCase;
  if (kind === "waterBottle") return imageGallery.items.waterBottle;
  if (kind === "lunchBox") return imageGallery.items.lunchBox;
  if (kind === "raincoat") return imageGallery.items.raincoat;
  if (kind === "sunHat") return imageGallery.items.sunHat;
  if (kind === "car") return imageGallery.items.toyCar;
  if (kind === "bus") return imageGallery.items.bus;
  if (kind === "bike") return imageGallery.items.bike;
  if (kind === "plane") return imageGallery.items.plane;
  if (kind === "water") return imageGallery.items.water;
  if (kind === "cup") return imageGallery.items.cup;
  if (kind === "key") return imageGallery.items.key;
  if (kind === "door" || kind === "openDoor") return imageGallery.items.door;
  if (kind === "box") return imageGallery.items.box;
  if (kind === "soccer") return imageGallery.items.soccer;
  if (kind === "kite") return imageGallery.items.kite;
  if (kind === "sky") return imageGallery.items.sky;
  if (kind === "cupcake" || kind === "cake" || kind === "cakeMissing") return imageGallery.items.cupcake;
  if (kind === "child" || kind === "childGirl" || kind === "childBoy") return imageGallery.items.child;
  if (kind === "candy") return imageGallery.items.candy;
  if (kind === "block") return imageGallery.items.block;
  if (kind === "tower") return imageGallery.items.blockTower;
  if (kind === "star" || kind === "smallStar") return imageGallery.items.star;
  if (kind === "fish") return imageGallery.items.fish;
  if (kind === "bird") return imageGallery.items.bird;
  return null;
}

function CrayonTexture() {
  return (
    <defs>
      <filter id="crayonNoise" x="-10%" y="-10%" width="120%" height="120%">
        <feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="2" seed="4" result="noise" />
        <feDisplacementMap in="SourceGraphic" in2="noise" scale="0.8" />
      </filter>
    </defs>
  );
}

function draw(kind: string) {
  switch (kind) {
    case "strawberry":
      return <><path className="stroke fill-red" d="M48 82C29 67 20 50 26 36c6-13 19-10 22-3 4-7 17-10 22 3 7 14-3 31-22 46Z" /><path className="fill-leaf" d="M36 28l6-12 6 11 8-11 3 14-12 5Z" /><circle cx="40" cy="50" r="2" /><circle cx="53" cy="57" r="2" /><circle cx="47" cy="43" r="2" /></>;
    case "apple":
      return <><path className="stroke fill-red" d="M48 80c-20 0-28-17-25-33 3-17 18-20 25-10 7-10 22-7 25 10 3 16-5 33-25 33Z" /><path className="stroke fill-leaf" d="M50 29c8-13 17-11 22-9-7 8-14 12-22 9Z" /><path className="stroke" d="M48 35c1-8 2-12 6-17" /></>;
    case "orange":
      return <><circle className="stroke fill-orange" cx="48" cy="51" r="28" /><path className="stroke fill-leaf" d="M47 25c7-10 16-8 21-4-7 5-13 7-21 4Z" /></>;
    case "cookie":
      return <><circle className="stroke fill-cookie" cx="48" cy="50" r="29" /><circle cx="39" cy="43" r="3" /><circle cx="57" cy="49" r="3" /><circle cx="47" cy="62" r="3" /></>;
    case "cupcake":
      return <><path className="stroke fill-pink" d="M24 44c2-15 16-23 24-11 9-12 24-4 24 11Z" /><path className="stroke fill-gold" d="M29 45h38l-5 33H34Z" /><path className="stroke" d="M38 51l2 22M48 51v23M58 51l-2 22" /></>;
    case "star":
      return <path className="stroke fill-gold" d="M48 14l10 22 24 3-18 16 5 24-21-12-21 12 5-24-18-16 24-3Z" />;
    case "block":
      return <><path className="stroke fill-coral" d="M24 34h44v36H24Z" /><path className="stroke fill-gold" d="M34 24h44v36H68V34H34Z" /><path className="stroke" d="M68 34l10-10M68 70l10-10" /></>;
    case "fish":
      return <><path className="stroke fill-sky" d="M22 50c16-21 39-21 52 0-13 21-36 21-52 0Z" /><path className="stroke fill-blue" d="M72 50l14-14v28Z" /><circle cx="38" cy="45" r="3" /></>;
    case "bird":
      return <><path className="stroke fill-sky" d="M25 53c4-18 25-27 42-12 14 13 4 35-19 35-15 0-26-8-23-23Z" /><path className="stroke fill-gold" d="M66 45l16 7-16 7Z" /><circle cx="46" cy="43" r="3" /></>;
    case "cat":
    case "orangeCat":
      return <><path className={`stroke ${kind === "cat" ? "fill-gold" : "fill-orange"}`} d="M24 72V35l10-17 14 15 14-15 10 17v37Z" /><circle cx="40" cy="49" r="3" /><circle cx="58" cy="49" r="3" /><path className="stroke" d="M44 60c3 3 6 3 9 0M48 53l-4 4h8Z" /></>;
    case "plate":
      return <><ellipse className="stroke fill-white" cx="48" cy="52" rx="34" ry="22" /><ellipse className="stroke fill-sky-soft" cx="48" cy="52" rx="22" ry="11" /></>;
    case "candy":
      return <><path className="stroke fill-pink" d="M30 38h36v20H30Z" /><path className="stroke fill-coral" d="M30 48L12 34v28Z" /><path className="stroke fill-coral" d="M66 48l18-14v28Z" /></>;
    case "grape":
      return <><circle className="stroke fill-purple" cx="39" cy="36" r="10" /><circle className="stroke fill-purple" cx="55" cy="36" r="10" /><circle className="stroke fill-purple" cx="31" cy="52" r="10" /><circle className="stroke fill-purple" cx="48" cy="52" r="10" /><circle className="stroke fill-purple" cx="64" cy="52" r="10" /><circle className="stroke fill-purple" cx="41" cy="68" r="10" /><circle className="stroke fill-purple" cx="57" cy="68" r="10" /><path className="stroke fill-leaf" d="M49 25c8-12 17-10 23-5-7 6-14 8-23 5Z" /></>;
    case "cake":
      return <><path className="stroke fill-pink" d="M22 42c4-14 17-22 29-17 11 4 21 13 23 29H22Z" /><path className="stroke fill-gold" d="M27 53h42l-5 25H32Z" /><circle className="fill-red" cx="52" cy="29" r="5" /><path className="stroke" d="M36 61h23" /></>;
    case "car":
      return <><path className="stroke fill-coral" d="M18 54h60v20H18Z" /><path className="stroke fill-sky-soft" d="M31 38h29l10 16H24Z" /><circle className="stroke fill-ink" cx="32" cy="75" r="7" /><circle className="stroke fill-ink" cx="64" cy="75" r="7" /></>;
    case "bus":
      return <><rect className="stroke fill-gold" x="17" y="31" width="62" height="42" rx="8" /><path className="stroke fill-sky-soft" d="M26 40h14v15H26Zm21 0h14v15H47Z" /><circle className="stroke fill-ink" cx="31" cy="74" r="6" /><circle className="stroke fill-ink" cx="65" cy="74" r="6" /></>;
    case "bike":
      return <><circle className="stroke fill-white" cx="27" cy="67" r="15" /><circle className="stroke fill-white" cx="69" cy="67" r="15" /><path className="stroke" d="M27 67l16-24h16l10 24M43 43l8 24H27m24 0l18-24M48 31h15M39 31h-9" /></>;
    case "plane":
      return <><path className="stroke fill-sky" d="M12 52l72-27-18 27 18 27Z" /><path className="stroke fill-blue" d="M36 54L22 75l28-11M36 50L22 29l28 11" /></>;
    case "kite":
      return <><path className="stroke fill-coral" d="M48 13l25 28-25 36-25-36Z" /><path className="stroke" d="M48 13v64M23 41h50M48 77c-5 6-9 10-13 13" /></>;
    case "pencil":
      return <><path className="stroke fill-gold" d="M24 68l38-43 12 12-38 43Z" /><path className="stroke fill-pink" d="M62 25l7-8 12 12-7 8Z" /><path className="stroke fill-brown" d="M24 68l-6 16 18-4Z" /></>;
    case "pencilCase":
      return <><rect className="stroke fill-blue" x="17" y="33" width="62" height="34" rx="10" /><path className="stroke fill-gold" d="M25 45h46" /><circle className="stroke fill-white" cx="69" cy="45" r="4" /><path className="stroke fill-pink" d="M30 57h24" /><path className="stroke fill-white" d="M37 33v34" /></>;
    case "backpack":
      return <><path className="stroke fill-coral" d="M28 35c1-16 39-16 40 0v43H28Z" /><path className="stroke fill-sky-soft" d="M37 51h22v22H37Z" /><path className="stroke" d="M36 34c2-11 22-11 24 0M28 46H17M68 46h11" /></>;
    case "waterBottle":
      return <><path className="stroke fill-blue" d="M36 29h24l5 13v37H31V42Z" /><path className="stroke fill-sky-soft" d="M39 16h18v13H39Z" /><path className="stroke fill-white" d="M38 50h20v17H38Z" /><path className="stroke fill-blue" d="M48 52c6 8 9 12 9 17 0 5-4 9-9 9s-9-4-9-9c0-5 3-9 9-17Z" /></>;
    case "lunchBox":
      return <><rect className="stroke fill-leaf" x="20" y="38" width="56" height="35" rx="9" /><path className="stroke fill-sky-soft" d="M26 31h44v15H26Z" /><rect className="stroke fill-orange" x="39" y="50" width="18" height="10" rx="3" /><path className="stroke" d="M32 38c2-8 30-8 32 0" /></>;
    case "sunHat":
      return <><path className="stroke fill-blue" d="M20 66c8-10 48-10 56 0 4 5-3 10-28 10S16 71 20 66Z" /><path className="stroke fill-sky" d="M30 61c2-20 34-20 36 0Z" /><path className="stroke fill-gold" d="M31 61h34v8H31Z" /></>;
    case "raincoat":
      return <><path className="stroke fill-gold" d="M28 82V38c5-17 35-17 40 0v44Z" /><path className="stroke fill-yellow" d="M36 39c3-13 21-13 24 0Z" /><path className="stroke" d="M48 40v42M37 59h8M55 59h8" /><path className="stroke fill-gold" d="M28 43L15 59l12 8M68 43l13 16-12 8" /></>;
    case "ruler":
      return <><path className="stroke fill-gold" d="M17 63l51-42 11 13-51 42Z" /><path className="stroke" d="M33 57l-5-6M44 48l-4-6M55 39l-5-6M66 30l-4-6" /></>;
    case "setSquare":
      return <><path className="stroke fill-leaf" d="M20 76h56L20 20Z" /><path className="stroke fill-white" d="M35 63h20L35 43Z" /></>;
    case "book":
      return <><path className="stroke fill-blue" d="M18 27h29c8 0 12 5 12 12v42c0-7-4-11-12-11H18Z" /><path className="stroke fill-leaf" d="M78 27H59c-8 0-12 5-12 12v42c0-7 4-11 12-11h19Z" /><path className="stroke" d="M48 33v46" /></>;
    case "soccer":
      return <><circle className="stroke fill-white" cx="48" cy="48" r="31" /><path className="fill-ink" d="M48 31l13 9-5 15H40l-5-15Z" /><path className="stroke" d="M35 40l-14-2M61 40l14-2M40 55l-9 14M56 55l9 14" /></>;
    case "smallStar":
      return <path className="stroke fill-gold" d="M48 25l7 15 16 2-12 11 3 16-14-8-14 8 3-16-12-11 16-2Z" />;
    case "bigSquare":
      return <rect className="stroke fill-blue" x="20" y="20" width="56" height="56" rx="8" />;
    case "smallSquare":
      return <rect className="stroke fill-blue" x="32" y="32" width="32" height="32" rx="7" />;
    case "sky":
      return <><circle className="stroke fill-gold" cx="62" cy="31" r="13" /><path className="stroke fill-sky-soft" d="M24 57c6-13 23-14 30-3 10-8 26-4 29 10H18c0-4 2-6 6-7Z" /></>;
    case "home":
      return <><path className="stroke fill-coral" d="M20 43l28-25 28 25v35H20Z" /><path className="stroke fill-brown" d="M37 78V55h22v23" /><path className="stroke fill-sky-soft" d="M25 43h46" /></>;
    case "birdSky":
      return <><circle className="stroke fill-gold" cx="67" cy="24" r="10" /><path className="stroke fill-sky" d="M18 55c13-15 30-15 43-1 10 11 3 23-13 23-15 0-26-7-30-22Z" /><path className="stroke fill-gold" d="M61 54l13 6-13 6Z" /></>;
    case "dogHome":
      return <><path className="stroke fill-coral" d="M18 45l30-24 30 24v33H18Z" /><path className="stroke fill-cookie" d="M32 58c5-12 28-12 33 0v20H32Z" /></>;
    case "child":
    case "childGirl":
    case "childBoy":
      return <><circle className="stroke fill-skin" cx="48" cy="31" r="15" /><path className={`stroke ${kind === "childGirl" ? "fill-pink" : kind === "childBoy" ? "fill-blue" : "fill-leaf"}`} d="M28 82c2-22 11-34 20-34s18 12 20 34Z" /><path className="stroke" d="M39 31h1M56 31h1M42 39c4 4 8 4 12 0" /></>;
    case "sun":
      return <><circle className="stroke fill-gold" cx="48" cy="48" r="21" /><path className="stroke" d="M48 10v14M48 72v14M10 48h14M72 48h14M21 21l10 10M65 65l10 10M75 21L65 31M31 65L21 75" /></>;
    case "moon":
      return <path className="stroke fill-moon" d="M61 18c-20 6-31 22-27 40 4 17 19 26 36 21-9 8-22 11-35 6-18-8-27-28-19-46 8-19 27-27 45-21Z" />;
    case "cup":
      return <><path className="stroke fill-sky" d="M27 29h38l-5 44H32Z" /><path className="stroke" d="M65 39h9c8 0 8 15 0 15h-9" /></>;
    case "water":
      return <path className="stroke fill-blue" d="M48 14c17 23 25 36 25 48 0 14-11 24-25 24S23 76 23 62c0-12 8-25 25-48Z" />;
    case "magicBox":
      return <><path className="stroke fill-gold" d="M22 39h52v37H22Z" /><path className="stroke fill-coral" d="M18 28h60v15H18Z" /><path className="stroke fill-white" d="M43 28h10v48H43Z" /><path className="stroke" d="M30 22c-10-12 20-16 18 6M66 22c10-12-20-16-18 6" /></>;
    case "box":
      return <><path className="stroke fill-gold" d="M20 39h56v38H20Z" /><path className="stroke fill-cookie" d="M28 27h40l8 12H20Z" /><path className="stroke" d="M48 39v38M20 39l8-12M76 39l-8-12" /></>;
    case "arrow":
      return <path className="stroke fill-leaf" d="M16 40h42V24l24 24-24 24V56H16Z" />;
    case "leftArrow":
      return <path className="stroke fill-leaf" d="M80 40H38V24L14 48l24 24V56h42Z" />;
    case "rightArrow":
      return <path className="stroke fill-leaf" d="M16 40h42V24l24 24-24 24V56H16Z" />;
    case "upArrow":
      return <path className="stroke fill-leaf" d="M40 82V40H24l24-24 24 24H56v42Z" />;
    case "downArrow":
      return <path className="stroke fill-leaf" d="M40 14v42H24l24 24 24-24H56V14Z" />;
    case "rabbit":
      return <><ellipse className="stroke fill-white" cx="37" cy="27" rx="8" ry="22" transform="rotate(-12 37 27)" /><ellipse className="stroke fill-white" cx="59" cy="27" rx="8" ry="22" transform="rotate(12 59 27)" /><circle className="stroke fill-white" cx="48" cy="56" r="27" /><circle cx="39" cy="52" r="3" /><circle cx="57" cy="52" r="3" /><path className="stroke" d="M45 61l3 3 3-3M48 64v6" /></>;
    case "carrot":
      return <><path className="stroke fill-orange" d="M44 84L28 32h40L52 84Z" /><path className="stroke fill-leaf" d="M48 32C37 21 30 17 23 16c8 10 13 15 25 16Zm1 0c10-13 18-18 27-17-7 12-14 17-27 17Z" /></>;
    case "dog":
      return <><path className="stroke fill-cookie" d="M25 37c7-23 39-23 46 0v38H25Z" /><path className="stroke fill-brown" d="M25 37L11 51c1 13 13 14 18 5ZM71 37l14 14c-1 13-13 14-18 5Z" /><circle cx="40" cy="51" r="3" /><circle cx="57" cy="51" r="3" /><path className="stroke" d="M47 57l-4 5h9Z" /></>;
    case "sprout":
      return <><path className="stroke" d="M48 82V39" /><path className="stroke fill-leaf" d="M48 48C28 45 23 29 24 20c15 2 24 10 24 28Z" /><path className="stroke fill-leaf" d="M49 47c20-2 27-16 26-27-15 2-26 10-26 27Z" /></>;
    case "flower":
      return <><path className="stroke" d="M48 82V55" /><circle className="stroke fill-gold" cx="48" cy="42" r="9" /><circle className="stroke fill-pink" cx="48" cy="21" r="12" /><circle className="stroke fill-pink" cx="67" cy="42" r="12" /><circle className="stroke fill-pink" cx="48" cy="63" r="12" /><circle className="stroke fill-pink" cx="29" cy="42" r="12" /></>;
    case "run":
      return <><circle className="stroke fill-skin" cx="48" cy="22" r="12" /><path className="stroke fill-blue" d="M41 36l19 8-12 17-19-9Z" /><path className="stroke" d="M38 52L22 68M54 58l15 16M57 44l20-6M39 41L22 34" /></>;
    case "bear":
      return <><circle className="stroke fill-brown" cx="30" cy="29" r="11" /><circle className="stroke fill-brown" cx="66" cy="29" r="11" /><circle className="stroke fill-cookie" cx="48" cy="53" r="31" /><circle cx="38" cy="48" r="3" /><circle cx="58" cy="48" r="3" /><path className="stroke fill-white" d="M39 58c5-5 13-5 18 0-2 8-16 8-18 0Z" /></>;
    case "honey":
      return <><path className="stroke fill-gold" d="M29 34h38l-5 42H34Z" /><path className="stroke fill-yellow" d="M34 27h28v12H34Z" /><path className="stroke" d="M39 48h18" /></>;
    case "river":
      return <><path className="stroke fill-sky" d="M10 37c17-16 31 16 48 0 10-9 19-5 28 2v24c-17-15-31 16-48 0-11-10-20-5-28 2Z" /><path className="stroke" d="M17 50c15-8 23 9 36 0 8-5 16-4 25 1" /></>;
    case "goal":
      return <><path className="stroke" d="M30 84V18" /><path className="stroke fill-white" d="M30 18h42v36H30Z" /><path className="fill-ink" d="M30 18h14v12H30Zm28 0h14v12H58ZM44 30h14v12H44ZM30 42h14v12H30Zm28 0h14v12H58Z" /></>;
    case "startFlag":
      return <><path className="stroke" d="M28 84V18" /><path className="stroke fill-leaf" d="M28 18h44l-8 15 8 15H28Z" /><circle className="stroke fill-gold" cx="29" cy="84" r="6" /></>;
    case "normalRule":
      return <><rect className="stroke fill-white" x="21" y="18" width="54" height="60" rx="10" /><circle className="stroke fill-leaf" cx="48" cy="38" r="12" /><path className="stroke" d="M35 61h26M42 52l6 8 9-14" /></>;
    case "reverseRule":
      return <><path className="stroke fill-purple" d="M27 32h31V20l20 20-20 20V47H27Z" /><path className="stroke fill-coral" d="M69 66H38v10L18 56l20-20v13h31Z" /></>;
    case "slowRule":
      return <><circle className="stroke fill-leaf" cx="48" cy="56" r="25" /><path className="stroke fill-sky-soft" d="M30 56c2-15 13-25 31-27 6 7 8 16 7 27Z" /><circle cx="57" cy="44" r="3" /><path className="stroke" d="M18 76h60M23 21l10 8M48 14v14M73 21l-10 8" /></>;
    case "clap":
      return <><path className="stroke fill-skin" d="M27 64l10-35c4-8 15-4 13 5l-6 25Z" /><path className="stroke fill-skin" d="M69 64L59 29c-4-8-15-4-13 5l6 25Z" /><path className="stroke" d="M18 28l10 8M78 28l-10 8M48 13v12" /></>;
    case "walk":
      return <><circle className="stroke fill-skin" cx="47" cy="22" r="11" /><path className="stroke fill-leaf" d="M39 36h18l5 26H34Z" /><path className="stroke" d="M39 61L27 78M56 61l14 16M36 42l-15 9M60 43l16 7" /></>;
    case "stopSign":
      return <><path className="stroke fill-red" d="M34 16h28l18 18v28L62 80H34L16 62V34Z" /><path className="stroke fill-white" d="M31 48h34" /></>;
    case "door":
      return <><path className="stroke fill-brown" d="M27 18h42v64H27Z" /><circle className="fill-gold" cx="59" cy="51" r="4" /><path className="stroke fill-sky-soft" d="M34 26h18v19H34Z" /></>;
    case "openDoor":
      return <><path className="stroke fill-sky-soft" d="M24 19h45v64H24Z" /><path className="stroke fill-brown" d="M36 25l35-9v64l-35-8Z" /><circle className="fill-gold" cx="61" cy="51" r="4" /></>;
    case "key":
      return <><circle className="stroke fill-gold" cx="31" cy="47" r="15" /><circle className="fill-white" cx="31" cy="47" r="6" /><path className="stroke fill-gold" d="M44 47h36v10H68v9H57v-9H44Z" /></>;
    case "bridge":
      return <><path className="stroke fill-sky" d="M10 59c16-10 25 8 38 0 14-8 24 9 38-1v20H10Z" /><path className="stroke fill-cookie" d="M16 48h64v12H16Z" /><path className="stroke" d="M28 48v12M48 48v12M68 48v12" /></>;
    case "seed":
      return <><ellipse className="stroke fill-brown" cx="48" cy="59" rx="19" ry="25" transform="rotate(20 48 59)" /><path className="stroke fill-leaf" d="M48 39c-11-10-17-16-25-17 5 12 13 18 25 17Z" /></>;
    case "washHands":
      return <><path className="stroke fill-skin" d="M24 63c8-19 14-29 24-29 13 0 20 10 25 29Z" /><path className="stroke fill-blue" d="M61 15c12 15 18 24 18 32 0 9-7 16-18 16s-18-7-18-16c0-8 6-17 18-32Z" /><path className="stroke" d="M25 76h48" /></>;
    case "pickBlocks":
      return <><rect className="stroke fill-blue" x="19" y="54" width="22" height="22" rx="4" /><rect className="stroke fill-coral" x="52" y="49" width="24" height="24" rx="4" /><path className="stroke fill-skin" d="M30 30c10 5 18 11 24 20l-9 9c-6-9-13-16-22-21Z" /></>;
    case "flyHome":
      return <><path className="stroke fill-sky" d="M18 47c17-19 34-17 48-2 12 13 4 29-16 29-17 0-29-8-32-27Z" /><path className="stroke fill-gold" d="M65 46l16 7-16 7Z" /><path className="stroke fill-brown" d="M22 80c12-18 40-18 52 0Z" /></>;
    case "fishWater":
      return <><path className="stroke fill-sky" d="M10 60c17-13 30 11 45 0 12-8 22-4 31 1v18H10Z" /><path className="stroke fill-blue" d="M22 39c14-15 32-15 43 0-11 16-29 16-43 0Z" /><circle cx="35" cy="36" r="3" /></>;
    case "sortToys":
      return <><rect className="stroke fill-white" x="21" y="45" width="54" height="32" rx="6" /><circle className="stroke fill-red" cx="32" cy="34" r="9" /><rect className="stroke fill-blue" x="47" y="25" width="17" height="17" rx="4" /><path className="stroke fill-gold" d="M67 27l8 16H59Z" /></>;
    case "pourWater":
      return <><path className="stroke fill-sky" d="M20 50h32l-4 28H24Z" /><path className="stroke fill-blue" d="M66 18c11 13 16 21 16 28 0 8-6 13-16 13s-16-5-16-13c0-7 5-15 16-28Z" /><path className="stroke" d="M52 41l-15 14" /></>;
    case "trafficLook":
      return <><rect className="stroke fill-ink" x="34" y="13" width="28" height="58" rx="8" /><circle className="fill-red" cx="48" cy="28" r="7" /><circle className="fill-gold" cx="48" cy="43" r="7" /><circle className="fill-leaf" cx="48" cy="58" r="7" /><path className="stroke" d="M20 80h56" /></>;
    case "eat":
      return <><circle className="stroke fill-skin" cx="48" cy="42" r="24" /><path className="stroke" d="M38 42h1M58 42h1M38 56c8 6 15 6 22 0" /><path className="stroke fill-cookie" d="M64 66c9-2 17 4 17 13H52c0-7 5-12 12-13Z" /></>;
    case "fallenBlocks":
      return <><rect className="stroke fill-blue" x="18" y="60" width="22" height="22" rx="4" transform="rotate(-12 29 71)" /><rect className="stroke fill-gold" x="42" y="54" width="22" height="22" rx="4" transform="rotate(16 53 65)" /><rect className="stroke fill-coral" x="60" y="37" width="22" height="22" rx="4" transform="rotate(31 71 48)" /></>;
    case "tower":
      return <><rect className="stroke fill-blue" x="35" y="62" width="26" height="18" rx="4" /><rect className="stroke fill-gold" x="35" y="42" width="26" height="18" rx="4" /><rect className="stroke fill-coral" x="35" y="22" width="26" height="18" rx="4" /></>;
    case "nest":
      return <><path className="stroke fill-brown" d="M23 63c8-19 42-19 50 0 0 13-50 13-50 0Z" /><path className="stroke" d="M26 64c15-8 29 7 45-1M31 56c12 6 23-8 34 0" /><circle className="stroke fill-sky-soft" cx="44" cy="48" r="8" /><circle className="stroke fill-sky-soft" cx="56" cy="48" r="8" /></>;
    case "dirtyHands":
      return <><path className="stroke fill-skin" d="M27 70c5-23 13-37 24-37s18 14 22 37Z" /><circle className="fill-brown" cx="40" cy="56" r="4" /><circle className="fill-brown" cx="55" cy="48" r="4" /><circle className="fill-brown" cx="60" cy="65" r="3" /></>;
    case "crosswalk":
      return <><path className="stroke fill-ink" d="M18 19h60v60H18Z" /><path className="stroke fill-white" d="M25 30h46M25 45h46M25 60h46" /></>;
    case "toysMess":
      return <><circle className="stroke fill-red" cx="30" cy="38" r="10" /><rect className="stroke fill-blue" x="54" y="29" width="20" height="20" rx="4" transform="rotate(20 64 39)" /><path className="stroke fill-gold" d="M45 63l10 18H35Z" /><rect className="stroke fill-leaf" x="19" y="66" width="18" height="14" rx="4" /></>;
    case "tidyBox":
      return <><rect className="stroke fill-white" x="21" y="37" width="54" height="37" rx="6" /><rect className="stroke fill-blue" x="30" y="24" width="16" height="16" rx="3" /><rect className="stroke fill-coral" x="51" y="24" width="16" height="16" rx="3" /><path className="stroke" d="M28 54h40" /></>;
    case "wideRiver":
      return <><path className="stroke fill-sky" d="M5 25c18-13 32 13 50 0 13-9 24-4 36 4v43c-18-14-32 14-50 0-13-9-25-4-36 4Z" /><path className="stroke" d="M12 45c18-10 30 9 45 0 10-6 19-5 29 1" /></>;
    case "longPlank":
      return <path className="stroke fill-cookie" d="M13 43h70v17H13Z" />;
    case "shortPlank":
      return <path className="stroke fill-cookie" d="M26 43h44v17H26Z" />;
    case "tinyPlank":
      return <path className="stroke fill-cookie" d="M36 43h24v17H36Z" />;
    case "twoLimit":
      return <><path className="stroke fill-cookie" d="M18 36h60v11H18Z" /><path className="stroke fill-cookie" d="M18 56h60v11H18Z" /><text x="48" y="32" textAnchor="middle" className="svg-mini-number">2</text></>;
    case "twoPlanks":
      return <><path className="stroke fill-cookie" d="M13 36h45v12H13Z" /><path className="stroke fill-cookie" d="M38 52h45v12H38Z" /></>;
    case "longShort":
      return <><path className="stroke fill-cookie" d="M10 34h72v13H10Z" /><path className="stroke fill-gold" d="M28 55h45v13H28Z" /></>;
    case "shortTiny":
      return <><path className="stroke fill-cookie" d="M20 36h45v13H20Z" /><path className="stroke fill-gold" d="M51 55h25v13H51Z" /></>;
    case "tinyTiny":
      return <><path className="stroke fill-cookie" d="M26 36h25v13H26Z" /><path className="stroke fill-gold" d="M47 55h25v13H47Z" /></>;
    case "stone":
      return <path className="stroke fill-sky-soft" d="M24 68c3-20 16-32 34-28 14 3 24 12 22 28Z" />;
    case "noBridge":
      return <><path className="stroke fill-sky" d="M11 49c17-12 28 11 42 0 12-9 22-4 32 2v25H11Z" /><path className="stroke fill-red" d="M24 21l48 52M72 21L24 73" /></>;
    case "none":
      return <><circle className="stroke fill-white" cx="48" cy="48" r="31" /><path className="stroke fill-red" d="M27 27l42 42" /></>;
    case "same":
      return <><circle className="stroke fill-gold" cx="35" cy="48" r="18" /><circle className="stroke fill-gold" cx="61" cy="48" r="18" /><path className="stroke" d="M24 78h48" /></>;
    case "certain":
      return <><circle className="stroke fill-leaf" cx="48" cy="48" r="31" /><path className="stroke fill-white" d="M31 49l12 13 23-27" /></>;
    case "notYet":
      return <><circle className="stroke fill-gold" cx="48" cy="48" r="31" /><text x="48" y="64" textAnchor="middle" className="svg-question">?</text></>;
    case "catCream":
      return <><path className="stroke fill-gold" d="M24 72V35l10-17 14 15 14-15 10 17v37Z" /><circle cx="40" cy="49" r="3" /><circle cx="58" cy="49" r="3" /><path className="stroke fill-white" d="M38 61c7 7 17 7 24 0-3 13-21 13-24 0Z" /></>;
    case "dogSleep":
      return <><path className="stroke fill-cookie" d="M22 59c8-18 38-19 52 0v17H22Z" /><circle cx="41" cy="57" r="3" /><path className="stroke" d="M54 55h12M66 27h14l-14 16h14" /></>;
    case "rabbitCarrot":
      return <><circle className="stroke fill-white" cx="38" cy="52" r="24" /><ellipse className="stroke fill-white" cx="29" cy="24" rx="7" ry="18" transform="rotate(-12 29 24)" /><ellipse className="stroke fill-white" cx="47" cy="24" rx="7" ry="18" transform="rotate(12 47 24)" /><path className="stroke fill-orange" d="M63 79L52 43h28L69 79Z" /><path className="stroke fill-leaf" d="M66 43c-8-8-14-11-20-12 5 8 11 12 20 12Z" /></>;
    case "pawPrints":
      return <><circle className="fill-brown" cx="34" cy="52" r="8" /><circle className="fill-brown" cx="25" cy="39" r="4" /><circle className="fill-brown" cx="34" cy="35" r="4" /><circle className="fill-brown" cx="43" cy="39" r="4" /><circle className="fill-brown" cx="62" cy="62" r="8" /><circle className="fill-brown" cx="53" cy="49" r="4" /><circle className="fill-brown" cx="62" cy="45" r="4" /><circle className="fill-brown" cx="71" cy="49" r="4" /></>;
    case "catKitchen":
      return <><path className="stroke fill-sky-soft" d="M18 26h60v50H18Z" /><path className="stroke fill-gold" d="M31 70V44l7-10 10 9 10-9 7 10v26Z" /></>;
    case "cakeMissing":
      return <><path className="stroke fill-pink" d="M23 55c3-18 16-29 32-24 10 3 18 12 18 24Z" /><path className="stroke fill-gold" d="M27 55h42l-6 23H33Z" /><path className="fill-white" d="M58 32c9 5 13 11 14 21-8-1-16-6-19-15Z" /></>;
    case "dogMud":
      return <><path className="stroke fill-cookie" d="M25 37c7-23 39-23 46 0v38H25Z" /><circle cx="40" cy="51" r="3" /><circle cx="57" cy="51" r="3" /><circle className="fill-brown" cx="35" cy="75" r="5" /><circle className="fill-brown" cx="60" cy="75" r="5" /></>;
    case "cleanCat":
      return <><path className="stroke fill-gold" d="M24 72V35l10-17 14 15 14-15 10 17v37Z" /><path className="stroke fill-white" d="M29 26l-8-8M69 26l8-8M48 18V8" /><circle cx="40" cy="49" r="3" /><circle cx="58" cy="49" r="3" /></>;
    case "fallenCup":
      return <><path className="stroke fill-sky" d="M31 34l34 11-12 36-34-11Z" /><path className="stroke fill-blue" d="M55 67c10 2 18 5 24 11H42c2-6 6-10 13-11Z" /></>;
    case "waterPuddle":
      return <path className="stroke fill-blue" d="M17 65c10-17 20-16 29-7 8-12 23-13 33 5 7 14-6 24-31 24-23 0-38-8-31-22Z" />;
    case "pollenPaw":
      return <><circle className="stroke fill-gold" cx="34" cy="47" r="10" /><circle className="stroke fill-gold" cx="62" cy="47" r="10" /><circle className="stroke fill-pink" cx="48" cy="30" r="8" /><circle className="stroke fill-pink" cx="65" cy="30" r="8" /><circle className="stroke fill-pink" cx="31" cy="30" r="8" /><circle className="fill-brown" cx="48" cy="67" r="7" /></>;
    case "dogRoom":
      return <><path className="stroke fill-sky-soft" d="M17 28h62v49H17Z" /><path className="stroke fill-cookie" d="M29 45c6-16 33-16 39 0v24H29Z" /><path className="stroke" d="M17 28l31-18 31 18" /></>;
    case "redDot":
      return <circle className="stroke fill-red" cx="48" cy="48" r="27" />;
    case "yellowDot":
      return <circle className="stroke fill-gold" cx="48" cy="48" r="27" />;
    case "greenDot":
      return <circle className="stroke fill-leaf" cx="48" cy="48" r="27" />;
    case "blueDot":
      return <circle className="stroke fill-blue" cx="48" cy="48" r="27" />;
    case "purpleDot":
      return <circle className="stroke fill-purple" cx="48" cy="48" r="27" />;
    case "bigDot":
      return <circle className="stroke fill-purple" cx="48" cy="48" r="29" />;
    case "mediumDot":
      return <circle className="stroke fill-purple" cx="48" cy="48" r="22" />;
    case "smallDot":
      return <circle className="stroke fill-purple" cx="48" cy="48" r="16" />;
    case "blueSquare":
      return <rect className="stroke fill-blue" x="23" y="23" width="50" height="50" rx="8" />;
    case "emptyBox":
      return <rect className="stroke fill-white" x="24" y="24" width="48" height="48" rx="8" strokeDasharray="7 6" />;
    case "missingSlot":
      return <><rect className="stroke fill-white" x="23" y="23" width="50" height="50" rx="9" strokeDasharray="7 6" /><path className="stroke fill-gold" d="M35 48h26M48 35v26" /></>;
    case "coveredCard":
      return <><rect className="stroke fill-sky-soft" x="22" y="20" width="52" height="58" rx="10" /><path className="stroke" d="M31 35h34M31 48h34M31 61h22" /></>;
    case "verticalFold":
      return <><path className="stroke" d="M48 13v70" strokeDasharray="7 7" /><path className="stroke fill-sky-soft" d="M32 25l16-12 16 12M32 71l16 12 16-12" /></>;
    case "horizontalFold":
      return <><path className="stroke" d="M13 48h70" strokeDasharray="7 7" /><path className="stroke fill-sky-soft" d="M25 32L13 48l12 16M71 32l12 16-12 16" /></>;
    default:
      return <circle className="stroke fill-sky" cx="48" cy="48" r="26" />;
  }
}
