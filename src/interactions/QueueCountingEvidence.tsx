import type { CSSProperties } from 'react';
import { ArrowLeft, ArrowRight, Volume2 } from 'lucide-react';
import { imageGallery } from '../data/imageGallery';
import { queueCountingModel, type QueueEvidence } from '../domain/queue-counting';
import { speak } from '../speech';
import { ActivityImage } from './ActivityTokenArt';
import './queue-counting.css';

function CountRail({ counts, label, direction, side }: {
  counts: (number | null)[]; label: string; direction: 'left' | 'right'; side: 'first' | 'second';
}) {
  const start = counts.findIndex(n => n !== null) + 1;
  const length = counts.filter(n => n !== null).length;
  const span = `${start} / span ${length}`;
  const countRow = side === 'first' ? 2 : 1;
  return <div className={`queue-count-rail is-${side}`} role="group" aria-label={label}>
    <div className="queue-rail-label" style={{ gridColumn: span, gridRow: side === 'first' ? 1 : 2 }}>
      {direction === 'left' && <ArrowLeft aria-hidden="true" size={20} />}
      <span>{label}</span>
      {direction === 'right' && <ArrowRight aria-hidden="true" size={20} />}
    </div>
    <div className={`queue-count-line to-${direction}`} style={{ gridColumn: span, gridRow: countRow }} aria-hidden="true" />
    {counts.map((number, index) => number === null ? null : <span className="queue-count-number" key={index}
      data-position={index + 1} style={{ gridColumn: index + 1, gridRow: countRow }}>{number}</span>)}
  </div>;
}

export function QueueCountingEvidence({ evidence }: { evidence: QueueEvidence }) {
  const model = queueCountingModel(evidence);
  return <div className="queue-counting-evidence">
    <div className="queue-diagram-scroll" role="region" aria-label="朋友排队和两次计数" tabIndex={0}>
      <div className="queue-counting-diagram" style={{ '--queue-size': model.total } as CSSProperties}>
        <CountRail counts={model.leftCounts} label={model.leftLabel} direction="right" side="first" />
        <ol className="queue-friends" aria-label="完整的朋友队伍">
          {model.friends.map(friend => <li key={friend.position} data-position={friend.position}
            className={`queue-friend${friend.character === 'rabbit' ? ' is-rabbit' : ''}`}>
            <span className="queue-portrait">
              <ActivityImage image={{ ...imageGallery.characters[friend.imageKey], alt: `队伍第${friend.position}位：${friend.name}` }} />
              {friend.character === 'rabbit' && <span className="queue-rabbit-label">小兔</span>}
            </span>
          </li>)}
        </ol>
        <CountRail counts={model.rightCounts} label={model.rightLabel} direction={model.sharedRabbit ? 'left' : 'right'} side="second" />
      </div>
    </div>
    <div className="queue-explanation">
      <div><strong className="queue-equation">{model.equation}</strong><p>{model.explanation}</p></div>
      <button type="button" className="queue-listen" onClick={() => void speak(model.speech)}><Volume2 size={20} aria-hidden="true" />听图解</button>
    </div>
  </div>;
}
