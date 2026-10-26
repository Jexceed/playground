import { useState } from 'react';
import { ArrowUpRight, Play, RotateCcw } from 'lucide-react';
import type { GameRound } from '../types';
import { BIRD_DEPARTURE_COPY, birdDepartureModel, birdFlightSpeech } from '../domain/bird-departure';
import { imageGallery } from '../data/imageGallery';
import { publicAsset } from '../publicAsset';
import { speak } from '../speech';
import './bird-departure.css';

export function BirdDepartureBoard({ round }: { round: GameRound }) {
  const [departed, setDeparted] = useState(false);
  const model = birdDepartureModel(round);
  return <section className="bird-departure-board" aria-label="小鸟飞离树枝">
    <div className="bird-departure-scene" data-departed={departed}>
      <span className="bird-branch-label">{BIRD_DEPARTURE_COPY.branch}</span>
      {departed && <span className="bird-away-label">{BIRD_DEPARTURE_COPY.away}<ArrowUpRight aria-hidden="true" /></span>}
      {(model.start <= 5 ? [66] : [51, 82]).map(y => <img key={y} className="bird-perch" style={{ top: `${y}%` }} src={publicAsset(imageGallery.items.birdBranch.src)} alt="" />)}
      {model.birds.map((bird, i) => {
        const flying = departed && bird.leaves;
        return <div className={`departure-bird${flying ? ' is-flying' : ''}`} data-location={flying ? 'away' : 'branch'} key={i}
          style={{ left: `${flying ? bird.toX : bird.x}%`, top: `${flying ? bird.toY : bird.y}%` }}>
          <img src={publicAsset(flying ? imageGallery.items.birdFlying.src : imageGallery.items.bird.src)} alt={flying ? '飞走的小鸟' : '树枝上的小鸟'} />
        </div>;
      })}
    </div>
    <div className="bird-departure-controls">
      <p aria-live="polite">{departed ? BIRD_DEPARTURE_COPY.countRemaining : `原来有 ${model.start} 只小鸟。`}</p>
      <button type="button" onClick={() => {
        setDeparted(!departed);
        void speak(departed ? BIRD_DEPARTURE_COPY.replay : birdFlightSpeech(model));
      }}>
        {departed ? <RotateCcw aria-hidden="true" size={22} /> : <Play aria-hidden="true" size={22} />}
        {departed ? BIRD_DEPARTURE_COPY.replay : `让 ${model.gone} 只小鸟飞走`}
      </button>
    </div>
  </section>;
}
