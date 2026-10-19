import { useEffect, useState } from 'react';
import { ArrowLeft, ArrowRight, Pause, Play, RotateCcw, Volume2 } from 'lucide-react';
import { LogicBridgeDiagram } from './LogicBridgeChoice';
import { imageGallery } from '../data/imageGallery';
import { logicActionRules, logicRelationFrames, logicTaskCueFor, type LogicFrame, type LogicLesson, type LogicPicture as Picture } from '../data/logicLessonVisuals';
import { publicAsset } from '../publicAsset';
import { speak } from '../speech';
import type { GameRound } from '../types';
import './logic-lesson.css';

export function LogicPicture({picture}:{picture:Picture}) {
 if(picture.textOnly)return null;
 if(picture.material){
  const long=picture.material==='long';
  const board=<img className={long?'logic-material-long':'logic-material-short'} src={publicAsset((long?imageGallery.items.longPlank:imageGallery.items.shortPlank).src)} alt=""/>;
  return <span className={`logic-picture logic-material ${picture.material==='replace-short'?'logic-material-swap':''}`} aria-hidden="true">{board}{picture.material==='replace-short'&&<><ArrowRight size={22}/>{board}</>}</span>;
 }
 const images=picture.images??(picture.image?[picture.image]:[]);
 return <span className={`logic-picture ${picture.diagram?'logic-picture-diagram':''} ${images.length>1?'logic-picture-pair':''} ${picture.diagrams?'logic-picture-diagram-pair':''}`}>
   {images.map((image,index)=><img key={index} src={publicAsset(image.src)} alt={image.alt}/>)}
   {picture.diagram&&<LogicBridgeDiagram model={picture.diagram}/>}
   {picture.diagrams?.map((model,index)=><LogicBridgeDiagram key={index} model={model}/>)}
   {picture.badge&&<span className="logic-picture-badge">{picture.badge}</span>}
 </span>;
}
export function hasLogicPicture(picture:Picture){return !picture.textOnly&&Boolean(picture.image||picture.images?.length||picture.diagram||picture.diagrams?.length||picture.material);}
function FrameCard({frame,onClick,active=false}:{frame:LogicFrame;onClick?:()=>void;active?:boolean}){
 return <button type="button" className={`logic-frame ${active?'logic-frame-active':''}`} onClick={()=>{onClick?.();speak(frame.label);}} aria-label={frame.label}><LogicPicture picture={frame}/><span className="logic-frame-caption">{frame.label}<Volume2 size={13}/></span></button>;
}
export function LogicLessonBoard({lesson,roundId,solved,showScene,onStart,onScene}:{lesson:LogicLesson;roundId:string;solved:boolean;showScene:boolean;onStart:()=>void;onScene:()=>void}){
 const [active,setActive]=useState(0),[playing,setPlaying]=useState(false);
 const [reduced,setReduced]=useState(()=>window.matchMedia('(prefers-reduced-motion: reduce)').matches);
 useEffect(()=>{const query=window.matchMedia('(prefers-reduced-motion: reduce)');const change=()=>setReduced(query.matches);query.addEventListener('change',change);return()=>query.removeEventListener('change',change);},[]);
 useEffect(()=>{setActive(0);setPlaying(solved&&!showScene&&!reduced&&lesson.kind==='plan'&&lesson.resolution.length>1);},[solved,roundId,showScene,reduced,lesson.kind,lesson.resolution.length]);
 useEffect(()=>{if(!playing)return;const timer=window.setTimeout(()=>{if(active>=lesson.resolution.length-1)setPlaying(false);else setActive(x=>x+1);},2400);return()=>window.clearTimeout(timer);},[playing,active,lesson.resolution.length]);
 useEffect(()=>{const pause=()=>setPlaying(false);window.addEventListener('blur',pause);return()=>window.removeEventListener('blur',pause);},[]);
 if(showScene)return <section className="logic-lesson logic-lesson-intro" aria-label="故事情境"><LogicPicture picture={lesson.context}/><div className="logic-lesson-toolbar"><span>{lesson.context.label}</span><button className="primary" type="button" onClick={onStart}>{solved?'回到解释':'开始想一想'}<ArrowRight size={18}/></button></div></section>;
 return <section className={`logic-lesson ${solved?'logic-lesson-solved':''}`} aria-label={solved?'正确后的解释':'当前题目证据'}>
   <div className="logic-lesson-toolbar"><strong>{solved?(lesson.kind==='plan'?'可以这样做':'根据这些线索判断'):'先看现在的情况'}</strong><button type="button" onClick={onScene}>再看场景</button></div>
   {!solved&&(lesson.evidenceScene?<LogicPicture picture={lesson.context}/>:<div className="logic-evidence-frames">{lesson.evidence.map((frame,index)=><FrameCard key={index} frame={frame}/>)}</div>)}
   {solved&&<>
    <div className={`logic-result-focus ${lesson.resolution.length===1&&lesson.resolution[active].image?.src.includes('/scenes/')?'logic-result-scene':''}`}><LogicPicture picture={lesson.resolution[active]}/><div><strong className="logic-result-caption">{lesson.resolution[active].label}</strong>{lesson.resolution.length>1&&<div className="logic-result-controls"><button type="button" aria-label="上一张" disabled={active===0} onClick={()=>{setPlaying(false);setActive(i=>i-1);}}><ArrowLeft size={17}/></button>{!reduced&&lesson.kind==='plan'&&<button type="button" onClick={()=>{if(!playing&&active===lesson.resolution.length-1)setActive(0);setPlaying(x=>!x);}}>{playing?<Pause size={17}/>:<Play size={17}/>} {playing?'暂停':'播放'}</button>}<button type="button" aria-label="下一张" disabled={active===lesson.resolution.length-1} onClick={()=>{setPlaying(false);setActive(i=>i+1);}}><ArrowRight size={17}/></button><button type="button" onClick={()=>{setActive(0);setPlaying(!reduced&&lesson.kind==='plan');}}><RotateCcw size={16}/>从第一张看</button></div>}</div></div>
    {lesson.resolution.length>1&&<div className="logic-result-strip">{lesson.resolution.map((frame,index)=><FrameCard key={index} frame={frame} active={active===index} onClick={()=>{setPlaying(false);setActive(index);}}/>)}</div>}
   </>}
 </section>;
}
export function LogicTaskCue({gameId,round,solved}:{gameId:string;round:GameRound;solved:boolean}){
 const cue=logicTaskCueFor(gameId,round),rules=logicActionRules(round);
 if(rules)return <div className="logic-action-rules" aria-label="本轮颜色动作规则">{rules.map((frame,index)=><div className="logic-action-rule" key={index}><img src={publicAsset((index===0?imageGallery.items.patternGreenDisc:imageGallery.items.patternRedDisc).src)} alt={index===0?'绿色圆片':'红色圆片'}/><ArrowRight size={18}/><FrameCard frame={frame}/></div>)}</div>;
 if(!cue)return null;
 return <div className="logic-task-cues" aria-label="本题任务条件">{(solved&&cue.after?[cue.after]:cue.frames).map((frame,index)=><FrameCard frame={frame} key={index}/>)}{cue.excluded&&<FrameCard frame={cue.excluded}/>}</div>;
}
export function LogicRelationBoard({round}:{round:GameRound}){
 const frames=logicRelationFrames(round);if(!frames)return null;
 return <section className="logic-relation-board" aria-label="例子与新问题"><div><strong>例子</strong><div className="logic-relation-pair">{frames.example.map((frame,index)=><FrameCard key={index} frame={frame}/>)}</div></div><ArrowRight size={24}/><div><strong>这次要配什么？</strong><div className="logic-relation-pair">{frames.target.map((frame,index)=><FrameCard key={index} frame={frame}/>)}<span className="logic-relation-unknown">?</span></div></div></section>;
}
