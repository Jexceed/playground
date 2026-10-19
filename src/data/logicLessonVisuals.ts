import { imageGallery } from './imageGallery';
import { logicEvidenceDefinitions } from './logicEvidence';
import type { GameRound, RoundSceneImage } from '../types';
import type { LogicBridgeChoiceModel } from '../domain/logic-choice-picture';

export type LogicPicture = { image?: RoundSceneImage; images?: RoundSceneImage[]; diagram?: LogicBridgeChoiceModel; diagrams?: LogicBridgeChoiceModel[]; badge?: string; textOnly?: boolean; material?: "long" | "short" | "replace-short" | "keep-short" };
export type LogicFrame = LogicPicture & { label: string };
export type LogicLesson = { context: LogicFrame; evidence: LogicFrame[]; resolution: LogicFrame[]; choices: Record<string, LogicPicture>; kind: 'plan' | 'reason'; evidenceScene?: boolean };
const item = (key: string) => (imageGallery.items as Record<string, RoundSceneImage>)[key];
const scene = (key: string) => (imageGallery.scenes as Record<string, RoundSceneImage>)[key];
const p = (family: string, key: string): LogicPicture => ({image:item(`order045_${family}_${key}`)});
const n = (key: string): LogicPicture => ({image:item(`logic046Life_${key}`)});
export const dailyPicture = (key: string): LogicPicture => ({image:item(`logic046Daily_${key}`)});
const f = (label: string, picture: LogicPicture): LogicFrame => ({label,...picture});
const s = (family: string,key: string,label: string): LogicFrame => f(label,{image:scene(`order045_${family}_${key}`)});
const ns = (key: string,label: string): LogicFrame => f(label,{image:scene(`logic046Life_${key}`)});
const short: LogicPicture = {image:imageGallery.scenes.childBridgeGap};
const long: LogicPicture = {image:imageGallery.scenes.childBridgeCrossing};
const material = (kind: NonNullable<LogicPicture['material']>): LogicPicture => ({material:kind});
const textChoice: LogicPicture = {textOnly:true};
const red = s('traffic','red','行人红灯亮着');
const green = ns('trafficGreen','行人绿灯亮，路面已经安全');
const dirty = s('snack','dirty','手脏了，饼干还没拿');
const clean = s('snack','clean','手已洗好，盘子还没拿');
const mixed = s('sorting','mixed','两类玩具还混在一起');
const sorted = s('sorting','sorted','两类玩具已经分开，盒子还空着');
const river = s('bridge','carrot','桌面模型里，小河挡在玩具兔和胡萝卜之间');
const shortContext = f('木板还没搭到对岸',short);
const washPlan=[f('先洗手',p('snack','wash')),f('拿饼干',p('snack','take')),f('吃饼干',p('snack','eat'))];
const platePlan=[f('拿盘子',p('snack','plate')),f('把饼干盛到盘子里',dailyPicture('placeCookies')),f('从盘子里拿饼干吃',dailyPicture('eatFromPlate'))];
const washPlatePlan=[washPlan[0],...platePlan];
const sortPlan=[f('先分开两类',p('sorting','sort')),f('分开放进盒子',p('sorting','put')),f('分类装好',p('sorting','done'))];
const putPlan=sortPlan.slice(1);
const crossPlan=[f('先看行人灯',p('traffic','look')),f('绿灯亮，和大人确认安全',p('traffic','green')),f('和大人走过去',p('traffic','cross'))];
const bridgePlan=[f('先搭桥',p('bridge','build')),f('沿桥面走过去',p('bridge','cross')),f('到对岸拿胡萝卜',p('bridge','carrot'))];
const waitRed: LogicPicture={images:[item('order045_traffic_green'),item('order045_traffic_directCross')]};
const washChoices={wash:p('snack','wash'),'eat-now':p('snack','dirtyEat'),'plate-only':p('snack','dirtyPlate')};
const plateChoices={plate:p('snack','plate'),'wash-again':n('cleanWashAgain'),'eat-now':p('snack','eat')};
const sortChoices={sort:p('sorting','sort'),stuff:p('sorting','allOne'),one:p('sorting','one')};
const putChoices={box:p('sorting','put'),'sort-again':p('sorting','sortAgain'),one:p('sorting','one')};
const extendChoices={extend:material('long'),same:material('keep-short'),'same-short':material('replace-short')};
const bridgeChoices={bridge:p('bridge','build'),'walk-water':p('bridge','water'),'wait-bank':p('bridge','wait')};
function lesson(context:LogicFrame,evidence:LogicFrame[],resolution:LogicFrame[],choices:Record<string,LogicPicture>,kind:LogicLesson['kind']='plan'):LogicLesson{return{context,evidence,resolution,choices,kind};}
const life: Record<string,LogicLesson> = {
 'logic-condition-detective-1':lesson(dirty,[f('手还脏着',p('snack','dirty'))],washPlan,washChoices),
 'logic-condition-detective-2':lesson(red,[f('行人红灯',p('traffic','red'))],[f('和大人停下等',p('traffic','stop'))],{stop:p('traffic','stop'),go:p('traffic','directCross'),slow:n('slowRed')}),
 'logic-condition-detective-3':lesson(green,[f('绿灯亮，车辆已停',p('traffic','green'))],[f('和大人确认安全',p('traffic','green')),f('和大人走过去',p('traffic','cross'))],{walk:p('traffic','cross'),'keep-waiting':p('traffic','green'),'wait-red':waitRed}),
 'logic-condition-detective-4':lesson(shortContext,[shortContext],[f('还差一段，木板不够长',short)],{'not-enough':textChoice,enough:textChoice,none:textChoice},'reason'),
 'logic-condition-detective-5':lesson(clean,[f('手已经洗好了',{image:clean.image})],platePlan,plateChoices),
 'logic-condition-detective-6':lesson(mixed,[f('混在一起的两类玩具',p('sorting','mixed'))],sortPlan,sortChoices),
 'logic-condition-detective-7':lesson(river,[f('小河挡住了去路',p('bridge','river'))],bridgePlan,bridgeChoices),
 'logic-condition-detective-12':lesson(shortContext,[f('木板够不到另一岸',short)],[f('换成够长的木板',long)],extendChoices),
 'logic-fix-plan-1':lesson(ns('dirtyEating','泥手直接拿饼干吃了'),[f('手脏',p('snack','dirty')),f('直接拿饼干',p('snack','dirtyTake')),f('直接吃',p('snack','dirtyEat'))],washPlan,{'missing-wash':p('snack','wash'),'missing-plate':p('snack','dirtyPlate'),'missing-more-cookie':n('dirtyMoreCookies')}),
 'logic-fix-plan-2':lesson(ns('redAttempt','红灯时想迈步'),[f('行人红灯',p('traffic','red')),f('却想往前走',p('traffic','directCross'))],[f('先停下等',p('traffic','stop'))],{stop:p('traffic','stop'),'keep-walk':p('traffic','directCross'),'wait-red':waitRed}),
 'logic-fix-plan-3':lesson(green,[f('绿灯亮，仍停在路边',p('traffic','green'))],[f('确认路面安全',p('traffic','green')),f('和大人走过去',p('traffic','cross'))],{walk:p('traffic','cross'),'keep-waiting':p('traffic','green'),'wait-red':waitRed}),
 'logic-fix-plan-4':lesson(shortContext,[f('木板另一头没有到对岸',short)],[f('木板的长度不够',short)],{'too-short':textChoice,'too-long':textChoice,'too-narrow':textChoice},'reason'),
 'logic-fix-plan-5':lesson(clean,[f('已经洗好了',{image:clean.image}),f('还在重复洗手',n('cleanWashAgain'))],platePlan,plateChoices),
 'logic-fix-plan-6':lesson(ns('mixedBox','两类玩具混装在一个盒子里'),[f('混放的结果',p('sorting','allOne'))],[f('取出后先分类',n('takeOutSort')),...putPlan],{sort:n('takeOutSort'),stuff:p('sorting','allOne'),one:p('sorting','one')}),
 'logic-fix-plan-7':lesson(river,[f('一直站着等',p('bridge','wait')),f('岸边有够长的木板',{image:item('longPlank')})],bridgePlan,bridgeChoices),
 'logic-fix-plan-11':lesson(shortContext,[f('换来的还是同样短',short)],[f('长度没有变，仍然够不到',short)],{'not-fixed':textChoice,fixed:textChoice,'no-change':textChoice},'reason'),
 'logic-fix-plan-12':lesson(sorted,[f('已经分好的两类玩具',p('sorting','sorted'))],putPlan,putChoices),
 'logic-priority-choice-1':lesson(dirty,[f('先看手上的泥',p('snack','dirty')),f('点心准备好了',p('snack','cookies'))],washPlatePlan,{wash:p('snack','wash'),plate:p('snack','dirtyPlate'),cookie:p('snack','dirtyTake')}),
 'logic-priority-choice-2':lesson(red,[f('来到有行人灯的路口',p('traffic','junction'))],crossPlan,{'look-light':p('traffic','look'),walk:p('traffic','directCross'),'car-stop':p('traffic','carOnly')}),
 'logic-priority-choice-3':lesson(shortContext,[shortContext],[f('长木板搭到了两岸',long)],{long:material('long'),short:material('short'),stone:dailyPicture('stone')}),
 'logic-priority-choice-4':lesson(mixed,[f('盒子打开了，玩具还混着',p('sorting','mixed'))],sortPlan,sortChoices),
 'logic-priority-choice-5':lesson(river,[f('小河挡住去路',p('bridge','river')),f('胡萝卜在对岸',p('bridge','reachCarrot'))],bridgePlan,{bridge:p('bridge','build'),carrot:p('bridge','reachCarrot'),wait:p('bridge','wait')}),
 'logic-priority-choice-6':lesson(clean,[f('手洗好了，点心还没盛好',p('snack','cookies'))],platePlan,plateChoices),
 'logic-priority-choice-7':lesson(ns('redAttempt','车停了，行人灯仍然是红色'),[f('行人红灯',p('traffic','red')),f('有人想走',p('traffic','directCross'))],[f('先按红灯停下',p('traffic','stop'))],{'red-stop':p('traffic','stop'),'child-go':p('traffic','directCross'),'car-stop':p('traffic','carOnly')}),
 'logic-priority-choice-10':lesson(shortContext,[f('失败原因是长度不够',short)],[f('换成够长的木板',long)],extendChoices),
 'logic-priority-choice-11':lesson(sorted,[f('已经分好的两类玩具',p('sorting','sorted'))],putPlan,putChoices),
};

const riverLessonIds = new Set(['logic-condition-detective-4','logic-condition-detective-12','logic-fix-plan-4','logic-fix-plan-11','logic-priority-choice-3','logic-priority-choice-10']);
export function logicLessonFor(round: GameRound): LogicLesson | undefined {
 if(life[round.id])return riverLessonIds.has(round.id)?{...life[round.id],evidenceScene:true}:life[round.id];
 const definition=logicEvidenceDefinitions.find(entry=>entry.id===round.id);
 if(!definition)return undefined;
 const choices:Record<string,LogicPicture>={};
 for(const [value,key]of Object.entries(definition.choiceImages))if(key)choices[value]={image:item('logic046Evidence_'+key)};
 for(const [value,concept]of Object.entries(definition.conceptChoices)){
  if(!concept)continue;
  choices[value]=textChoice;
 }
 return {context:f('先看事情发生的地方',{image:scene('logic046Evidence_'+definition.scene)}),evidence:[],resolution:definition.evidenceFrames.map(key=>f(item('logic046Evidence_'+key).alt,{image:item('logic046Evidence_'+key)})),choices,kind:'reason',evidenceScene:true};
}

export type LogicTaskCue = { frames: LogicFrame[]; excluded?: LogicFrame; after?: LogicFrame };
const cue=(label:string,key:string):LogicTaskCue=>({frames:[f(label,dailyPicture(key))]});
const cues:Record<string,LogicTaskCue>={
 'school-day-book':cue('准备上课，找学习用品','studyCue'),
 'school-day-pencil-case':cue('铅笔散着，要收好','loosePencils'),
 'outdoor-hat':cue('去晒太阳，要戴在头上','sunnyChild'),
 'rainy-day-raincoat':cue('外面下雨，需要防雨','rainWindow'),
 'need-drink':cue('路上口渴，要能喝水','thirsty'),
 'lunch-box':{frames:[f('点心要带出门',p('snack','cookies'))]},
 'study-not-toy':{...cue('去上课，带学习用品','studyCue'),excluded:f('不要玩具',{image:item('toyCar'),badge:'不带'})},
 'outside-not-food':{...cue('去操场晒太阳','sunnyChild'),excluded:f('不带装点心的盒子',{image:item('lunchBox'),badge:'不带'})},
 'rain-and-wear':cue('要穿在身上，也要防雨','rainWindow'),
 'small-hard-safe':{...cue('铅笔要收好，不能散落','loosePencils'),after:f('合上笔袋，铅笔不会散落',dailyPicture('closedPencilCase'))},
 'rule-switch-drink':cue('现在换成补充水分','thirsty'),
 'rule-switch-no-toy':cue('去上课，这次选应该留下的','studyCue'),
 'two-true-one-better':{frames:[f('现在：已经口渴',dailyPicture('thirsty')),f('休息时：再吃点心',p('snack','cookies'))]},
 'exclude-almost-right':cue('下一节要翻开看故事','openStoryBook'),
};
export function logicTaskCueFor(gameId:string,round:GameRound){return gameId==='logic-rule-filter'?cues[round.id]:undefined;}
export function logicRelationFrames(round:GameRound):{example:LogicFrame[];target:LogicFrame[]}|undefined{
 if(round.id==='sun-raincoat-analogy')return{example:[f('太阳大',dailyPicture('sunnyChild')),f('戴帽子',{image:item('sunHat')})],target:[f('下雨了',dailyPicture('rainWindow'))]};
 if(round.id==='thirst-hungry')return{example:[f('口渴了',dailyPicture('thirsty')),f('水壶',{image:item('waterBottle')})],target:[f('饿了',dailyPicture('hungry'))]};
 if(round.id==='door-river-tool')return{example:[f('钥匙',{image:item('key')}),f('打开门',p('door','open'))],target:[f('桌面小河挡住去路',p('bridge','river'))]};
}
export function logicActionRules(round:GameRound){
 const number=Number(round.id.split('-').slice(-1)[0]);
 if(!round.id.startsWith('logic-stop-think-'))return undefined;
 return number<=2?[f('绿片拍手',dailyPicture('clap')),f('红片抱肩',dailyPicture('hugShoulders'))]:number<=4?[f('绿片抱肩',dailyPicture('hugShoulders')),f('红片拍手',dailyPicture('clap'))]:[f('绿片摸头',dailyPicture('touchHead')),f('红片抱肩',dailyPicture('hugShoulders'))];
}
export function logicSupportVoiceLines(gameId:string,round:GameRound){
 const lesson=logicLessonFor(round),cue=logicTaskCueFor(gameId,round),relation=logicRelationFrames(round),rules=logicActionRules(round);
 return [...(lesson?[lesson.context,...lesson.evidence,...lesson.resolution]:[]),...(cue?[...cue.frames,...cue.excluded?[cue.excluded]:[],...cue.after?[cue.after]:[]]:[]),...(relation?[...relation.example,...relation.target]:[]),...(rules??[])].map(frame=>frame.label);
}
