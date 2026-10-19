import { useEffect, useState } from 'react';
import type { CSSProperties } from 'react';
import { RotateCcw, Play } from 'lucide-react';
import { imageGallery } from '../data/imageGallery';
import { publicAsset } from '../publicAsset';
import { speak, playTone } from '../speech';
import {
  BRIDGE_PLAY_UNIT, bridgePlayCopy, bridgePlayLayout, bridgeMaterialLabel, bridgeGapLabel,
  bridgeModelFor, emptyBridge, placeBridgeWood, placedBridgeShape, bridgePlacementAttempt,
  chooseMeasurePoint, measureBridgeAttempt, measurePointLabels,
  type BridgeAttempt, type BridgePlacement, type MeasurePoint,
} from '../domain/bridge-play';
import './bridge-play.css';

function Wood({x,y,length,tone=0}:{x:number;y:number;length:number;tone?:number}) {
  return <g className="bridge-wood-shape" data-wood-length={length}>
    <rect x={x} y={y} width={length*BRIDGE_PLAY_UNIT} height="32" rx="5" fill={['#dca65d','#f0ca85','#bf8c53'][tone]} stroke="#856039" strokeWidth="2.5"/>
    <path d={`M${x+5} ${y+8}H${x+length*BRIDGE_PLAY_UNIT-5}`} stroke="#f6cf8f" strokeWidth="3"/>
    {Array.from({length:length-1},(_,i)=><path key={i} d={`M${x+(i+1)*BRIDGE_PLAY_UNIT} ${y+2}v28`} stroke="#9d713d" strokeWidth="2"/>)}
  </g>;
}

export function BridgePlayBoard({roundId,solved,showErrors,onChange,onReset}:{
  roundId:string;solved:boolean;showErrors:boolean;onChange:(attempt:BridgeAttempt)=>void;onReset:()=>void;
}) {
  const model=bridgeModelFor(roundId)!;
  const measuring=roundId==='logic-space-bridge-1';
  const layout=bridgePlayLayout(model);
  const [placements,setPlacements]=useState<BridgePlacement>(()=>emptyBridge(model));
  const [armed,setArmed]=useState<number|null>(null);
  const [points,setPoints]=useState<MeasurePoint[]>([]);
  const [walkRun,setWalkRun]=useState(0);
  useEffect(()=>{onChange(measuring?measureBridgeAttempt(points):bridgePlacementAttempt(model,placements));},[model,measuring,placements,points,onChange]);
  const anchors:Record<MeasurePoint,{x:number;y:number}>={
    bear:{x:83,y:122},'left-bank':{x:layout.left,y:122},'right-bank':{x:layout.right,y:122},
    plank:{x:252,y:244},flag:{x:637,y:122},
  };
  const sceneHeight=measuring?306:220;
  function selectPoint(point:MeasurePoint){if(solved)return;setPoints(previous=>chooseMeasurePoint(previous,point));playTone('tap');speak(measurePointLabels[point]);}
  function selectMaterial(index:number){if(solved)return;setArmed(previous=>previous===index?null:index);playTone('tap');speak(bridgeMaterialLabel(model,index));}
  function place(gap:number){
    if(solved)return;
    if(armed!==null){setPlacements(previous=>placeBridgeWood(model,previous,gap,armed));setArmed(null);playTone('tap');return;}
    if(placements[gap]!==null){setArmed(placements[gap]);setPlacements(previous=>previous.map((value,index)=>index===gap?null:value));playTone('tap');return;}
    speak(bridgePlayCopy.choose);
  }
  const status=solved?(measuring?'量的是两岸之间':'小熊可以过河了')
    :measuring?(points.length===1?bridgePlayCopy.secondPoint:points.length===2?bridgePlayCopy.measureReady:'点两个地方，量一量')
    :armed!==null?`选好了 ${bridgeMaterialLabel(model,armed)}，点河上的空位`
    :placements.every(value=>value!==null)?bridgePlayCopy.ready:bridgePlayCopy.sameUnit;
  return <section className="bridge-play" aria-label={measuring?'动手量距离':'动手搭桥'} data-mode={measuring?'measure':'build'}>
    <div className="bridge-play-toolbar"><strong aria-live="polite">{status}</strong><div>
      {solved&&!measuring&&<button type="button" onClick={()=>setWalkRun(value=>value+1)}><Play size={16}/>{bridgePlayCopy.replay}</button>}
      <button type="button" onClick={onReset}><RotateCcw size={16}/>{measuring?bridgePlayCopy.remeasure:solved?bridgePlayCopy.redo:bridgePlayCopy.clear}</button>
    </div></div>
    <div className={`bridge-play-stage ${measuring?'bridge-play-measure':''}`}>
      <svg viewBox={`0 0 720 ${sceneHeight}`} aria-hidden="true">
        <rect x="0" y="0" width="720" height={sceneHeight} rx="14" fill="#f5f8e9"/>
        <rect x="14" y="64" width="692" height="122" rx="16" fill="#c9dfa6"/>
        <rect x={layout.left} y="64" width={model.width*layout.unit} height="122" fill="#86c9df" data-river-width={model.width}/>
        {Array.from({length:model.width+1},(_,i)=><path key={i} d={`M${layout.left+i*layout.unit} 64V186`} stroke="#d9f0f6" strokeWidth="2"/>)}
        {Array.from({length:model.width},(_,i)=><path key={i} d={`M${layout.left+i*layout.unit+12} 164q6 7 12 0t12 0`} fill="none" stroke="#5bafcf" strokeWidth="2"/>)}
        {model.supports.map(point=><rect key={point} x={layout.left+point*layout.unit-12} y="57" width="24" height="136" rx="10" fill="#a8ce78" stroke="#718c4c" strokeWidth="2"/>)}
        {layout.gaps.map((gap,i)=><g key={i}><path d={`M${gap.x} 51v-11h${gap.pixels}v11`} fill="none" stroke="#667968" strokeWidth="2"/><text x={gap.x+gap.pixels/2} y="29" textAnchor="middle" fontSize="24" fill="#374d45">{gap.width} 格</text></g>)}
        <path d="M637 149V84l32 12-32 12" stroke="#775333" strokeWidth="4" fill="#e8994f"/>
        {measuring?<Wood x={252} y={225} length={model.lengths[0]}/>:placements.map((wood,gap)=>{
          if(wood===null)return null;const shape=placedBridgeShape(model,gap,wood);
          return <Wood key={gap} x={shape.x} y={112} length={shape.length} tone={wood}/>;
        })}
        {measuring&&points.length===2&&<path data-measure-line="true" d={`M${anchors[points[0]].x} ${anchors[points[0]].y}L${anchors[points[1]].x} ${anchors[points[1]].y}`} stroke={showErrors?'#c66b4f':'#367b61'} strokeWidth="6" strokeDasharray="10 6"/>}
      </svg>
      <img key={walkRun} className={`bridge-play-bear ${solved&&!measuring?'bridge-bear-crossing':''}`} src={publicAsset(imageGallery.characters.bear.src)} alt="小熊" style={{'--bear-start':'7%','--bear-end':'85%',top:`${(measuring?85:67)/sceneHeight*100}%` } as CSSProperties}/>
      {measuring?(Object.keys(anchors) as MeasurePoint[]).map(point=><button key={point} type="button" className={`bridge-measure-point ${points.includes(point)?'selected':''}`} style={{left:`${anchors[point].x/720*100}%`,top:`${anchors[point].y/sceneHeight*100}%`}} aria-label={`量距离：${measurePointLabels[point]}`} aria-pressed={points.includes(point)} disabled={solved} onClick={()=>selectPoint(point)}><span className="bridge-point-dot"/><span>{measurePointLabels[point]}</span></button>)
        :layout.gaps.map((gap,index)=>{const wood=placements[index],tooShort=wood!==null&&model.lengths[wood]<gap.width;return <button key={index} type="button" className={`bridge-place-target ${wood!==null?'filled':''} ${armed!==null?'armed':''} ${showErrors&&(wood===null||tooShort)?'problem':''}`} style={{left:`${gap.x/720*100}%`,width:`${gap.pixels/720*100}%`}} disabled={solved} aria-label={`${bridgeGapLabel(model,index)}河段，${wood===null?'空着':`已放${bridgeMaterialLabel(model,wood)}，点一下拿回`}`} onClick={()=>place(index)}><span>{wood===null?'点这里放':'点一下拿回'}</span></button>;})}
    </div>
    {!measuring&&<div className="bridge-materials" aria-label="可用木板">{model.lengths.map((length,index)=>{
      const used=placements.indexOf(index),selected=armed===index;
      return <button type="button" key={index} className={`bridge-material ${selected?'selected':''} ${used>=0?'placed':''}`} aria-label={`选${bridgeMaterialLabel(model,index)}`} aria-pressed={selected} disabled={solved} onClick={()=>selectMaterial(index)}>
        <svg viewBox="0 0 720 56" aria-hidden="true"><text x="20" y="35" fontSize="21" fill="#354c46">{bridgeMaterialLabel(model,index)}</text><Wood x={220} y={12} length={length} tone={index}/><text x="700" y="35" fontSize="19" textAnchor="end" fill="#466954">{selected?'已选':used>=0?'已放到'+bridgeGapLabel(model,used):'点选'}</text></svg>
      </button>;
    })}</div>}
  </section>;
}
