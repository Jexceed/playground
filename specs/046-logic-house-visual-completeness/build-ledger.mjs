import{readFileSync,writeFileSync}from'node:fs';import{loadGameData}from'../../scripts/lib/load-game-data.mjs';import{loadTypeScriptModule}from'../../scripts/lib/load-ts-module.mjs';
const root='specs/046-logic-house-visual-completeness/',data=await loadGameData(),logic=data.games.filter(g=>g.world==='logic');
const v=await loadTypeScriptModule('src/data/logicLessonVisuals.ts'),c=await loadTypeScriptModule('src/domain/logic-choice-picture.ts');
const a=JSON.parse(readFileSync(root+'review-abstract.json')),d=JSON.parse(readFileSync(root+'review-daily.json')),e=JSON.parse(readFileSync(root+'review-evidence.json'));
const reviewed=new Map(a.groups.flatMap(g=>g.rounds.map(r=>[r.id,{reviewer:'abstract',issues:r.issue,noChangeReason:r.noChangeReason}])));
for(const r of d.rounds)reviewed.set(r.roundId,{reviewer:'daily',issues:r.issues,noChangeReason:r.existingEvidence});
for(const r of e.rounds)reviewed.set(r.id,{reviewer:'evidence',issues:r.issues,noChangeReason:r.noIssueReasons?.join(' ')});
const ledger=logic.flatMap(g=>g.rounds.map((r,index)=>{
 const lesson=v.logicLessonFor(r),cue=v.logicTaskCueFor(g.id,r),relation=v.logicRelationFrames(r),rules=v.logicActionRules(r);
 const options=r.choices.some(choice=>c.logicChoicePictureFor(g.id,r,choice)||(g.id==='logic-space-bridge'&&c.logicBridgeChoiceFor(r,choice)));
 const layout=(g.id==='logic-visual-match'&&[5,6,11,12].includes(index+1))||(g.id==='logic-mirror-fold'&&[3,4,7,8,9,10,11,12].includes(index+1))||(g.id==='logic-part-whole-puzzle'&&index<6);
 const serving=g.id==='logic-order-plan'&&[10,16].includes(index+1);
 const changed=!!(lesson||cue||relation||rules||options||layout||serving);
 const review=reviewed.get(r.id)??(g.id==='logic-order-plan'?{reviewer:'main',issues:serving?[{code:'missing-plated-cookie-state',detail:'明确先拿盘子，后续却仍从纸垫直接取食；替换为盛盘和从盘取食图。'}]:[],noChangeReason:'045已补齐场景/动作/选项/成功演示，本轮全初始页重新检查。'}:{reviewer:'main',issues:[{code:'life-context-action-incomplete',detail:'当前情境或动作缺图，错误/优先级流程须与正确改法分开。'}]});
 if((g.id==='logic-part-whole-puzzle'&&index<6)||(g.id==='logic-mirror-fold'&&index>=6)){review.initialReviewNoChangeReason=review.noChangeReason;review.noChangeReason=undefined;review.issues=[...(review.issues??[]),{code:'browser-card-overflow',detail:'全初始页实测卡片被五列布局挤压，图片/字幕越界；修复分组布局，并为镜像题建立真实镜轴与右侧位置。'}];}
 return{gameId:g.id,title:g.title,roundId:r.id,roundNumber:index+1,prompt:r.prompt,...review,disposition:changed?'fixed':'retain',implementation:{lesson:!!lesson,taskCue:!!cue,relationTarget:!!relation,actionRules:!!rules,exactChoices:options,layout,serving},verification:'pending-ui'};
}));
if(ledger.length!==319||new Set(ledger.map(r=>r.roundId)).size!==319)throw new Error('Incomplete review ledger');
writeFileSync(root+'verification/review-ledger.json',JSON.stringify(ledger,null,2)+'\n');
writeFileSync(root+'verification/ui-cases.json',JSON.stringify(logic.map(g=>({...g,rounds:g.rounds.map(r=>({...r,changed:ledger.find(l=>l.roundId===r.id).disposition==='fixed'}))})),null,2)+'\n');
console.log({groups:logic.length,rounds:ledger.length,fixed:ledger.filter(r=>r.disposition==='fixed').length,retained:ledger.filter(r=>r.disposition==='retain').length});
