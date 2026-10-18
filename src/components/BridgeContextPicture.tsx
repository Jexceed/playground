import { useState } from 'react';
import { Maximize2 } from 'lucide-react';
import { ImageViewer } from '../interactions/ImageViewer';
import { publicAsset } from '../publicAsset';
import type { RoundSceneImage } from '../types';
export function BridgeContextPicture({image}:{image:RoundSceneImage}){
 const[index,setIndex]=useState<number|null>(null);
 return <><figure className="scene-image-card bridge-context-picture"><button type="button" aria-label="放大看模型" onClick={()=>setIndex(0)}><img src={publicAsset(image.src)} alt={image.alt}/><span><Maximize2 size={14}/>放大看模型</span></button></figure><ImageViewer images={[image]} index={index} onIndexChange={setIndex} onClose={()=>setIndex(null)}/></>;
}
