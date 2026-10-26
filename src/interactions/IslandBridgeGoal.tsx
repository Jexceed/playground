import { Check, Volume2, X } from 'lucide-react';
import { bridgeQuota, ISLAND_BRIDGE_COPY } from '../domain/island-bridges';
import { imageGallery } from '../data/imageGallery';
import { speak } from '../speech';
import { ActivityImage } from './ActivityTokenArt';
import './island-bridges.css';

function BridgeChip() {
  return <svg className="island-bridge-chip" viewBox="0 0 26 22" aria-hidden="true">
    <rect x="2" y="1" width="22" height="20" rx="2" fill="#cce6e7" />
    <path d="M 0 1 H 4 V 21 H 0 Z M 22 1 H 26 V 21 H 22 Z" fill="#a9bb80" />
    <rect x="0" y="7" width="26" height="8" rx="1" className="island-chip-deck" />
    {[4, 8, 12, 16, 20, 24].map(x => <path key={x} d={`M ${x} 8 V 14`} className="island-chip-plank" />)}
    <path d="M 1 7 H 25 M 1 15 H 25" className="island-chip-rail" />
  </svg>;
}

function BridgeSlot({ filled, extra = false }: { filled: boolean; extra?: boolean }) {
  return <span className={`island-bridge-slot${filled ? ' is-filled' : ''}${extra ? ' is-extra' : ''}`}
    data-bridge-slot={extra ? 'extra' : filled ? 'filled' : 'empty'} aria-hidden="true">{filled && <BridgeChip />}</span>;
}

export function IslandBridgeGoal({ id, target, current }: { id: string; target: number; current: number }) {
  const quota = bridgeQuota(target, current);
  return <span className="island-bridge-goal" data-testid={`island-goal-${id}`} data-required={target} data-current={current} data-status={quota.state}>
    <span className="island-goal-total">要 <b>{target}</b> 座桥</span>
    <span className="island-goal-slots" aria-hidden="true">{Array.from({ length: target }, (_, i) => <BridgeSlot key={i} filled={i < quota.filled} />)}</span>
    {quota.extra > 0 && <span className="island-goal-extra" aria-hidden="true"><X size={12} />{Array.from({ length: quota.extra }, (_, i) => <BridgeSlot key={i} filled extra />)}</span>}
    <span className="island-goal-status">{quota.state === 'exact' && <Check size={14} />}{quota.label}</span>
  </span>;
}

export function IslandBridgeLegend() {
  return <div className="island-bridge-lesson">
    <div className="island-bridge-key"><strong>{ISLAND_BRIDGE_COPY.unit}</strong>
      <div><span><BridgeSlot filled={false} />还要搭</span><span><BridgeSlot filled />搭好了</span></div>
    </div>
    <figure className="island-bridge-example">
      <span className="island-demo-model" role="img" aria-label="同一座桥连接两个岛，两边各填一个桥格">
        <span className="island-demo-end"><ActivityImage image={imageGallery.items.art052Island} decorative /><BridgeSlot filled /></span>
        <span className="island-demo-crossing" aria-hidden="true" />
        <span className="island-demo-end"><ActivityImage image={imageGallery.items.art052Island} decorative /><BridgeSlot filled /></span>
      </span><figcaption>一座桥，<br />两边各算一座。</figcaption>
    </figure>
    <button type="button" className="island-bridge-listen" aria-label="听小岛的桥怎么算" onClick={() => void speak(ISLAND_BRIDGE_COPY.howToPlay)}><Volume2 size={21} /></button>
  </div>;
}
