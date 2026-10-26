import { Check, Hand, Plus, RotateCcw, Volume2 } from 'lucide-react';
import { useEffect, useState, type CSSProperties } from 'react';
import type { ActivityResponse, BoardMoveEvidence } from '../domain/activity';
import { BOARD_MOVE_COPY as copy } from '../domain/board-move';
import { speak } from '../speech';
import './board-move.css';

function Stone({ color = 'black', trial = false, example = false }: { color?: 'black' | 'white'; trial?: boolean; example?: boolean }) {
  return <span className={`board-move-stone is-${color}${trial ? ' is-trial' : ''}`} data-stone-role={example ? 'example' : trial ? 'trial' : 'fixed'} aria-hidden="true" />;
}

function RulePicture({ goal }: { goal: BoardMoveEvidence['goal'] }) {
  return <div className="board-move-rule-picture">
    <h3>{goal === 'line3' ? '三颗连成一条线' : '两头黑，中间白'}</h3>
    {goal === 'line3' ? <div className="board-move-line-examples">
      {['横着', '竖着', '斜着'].map((label, index) => <figure key={label}>
        <div className="board-move-mini-grid" role="img" aria-label={`${label}三颗黑子连成一线`}>
          {[0, 1, 2].map(i => <span style={{ gridColumn: index === 1 ? 2 : i + 1, gridRow: index === 0 ? 2 : i + 1 }} key={i}><Stone example trial={i === 2} /></span>)}
        </div><figcaption>{label}</figcaption>
      </figure>)}
    </div> : <>
      <div className="board-move-capture-example" role="img" aria-label="一颗新黑子和一颗原有黑子夹住中间连续的白子">
        <Stone example /><Stone color="white" example /><Stone color="white" example /><Stone example trial />
      </div>
      <p>白子连着，两头都是黑子。<br />横、竖、斜着都找一找。</p>
    </>}
  </div>;
}

/** Trial placement never changes the answer; selected cells are independent moves. */
export function BoardMoveBoard({ model, response, disabled, onToggle, resetKey = 0 }: {
  model: BoardMoveEvidence; response: ActivityResponse; disabled: boolean; onToggle: (tokenId: string) => void; resetKey?: number;
}) {
  const [preview, setPreview] = useState<number | null>(null);
  useEffect(() => { setPreview(null); }, [model, response, disabled, resetKey]);
  if (response.kind !== 'multiSelect') return null;
  const selected = new Set(response.tokenIds);
  const candidate = model.candidates.find(item => item.cell === preview);
  const previewSelected = !!candidate && selected.has(candidate.tokenId);
  const coordinate = (index: number) => `第${Math.floor(index / model.columns) + 1}行第${index % model.columns + 1}列`;
  return <section className="board-move" data-testid="board-move" aria-label="在空格里试放一颗棋子">
    <div className="board-move-legend">
      <span><i><Stone /></i>原有棋子</span>
      <span><i className="board-move-empty-symbol"><Plus size={17} /></i>点圈内试放</span>
      <span><i><Stone trial /></i>新补的一颗</span>
      <button type="button" className="board-move-listen" aria-label="听棋盘怎么玩" onClick={() => void speak(copy.howToPlay)}><Volume2 size={21} /></button>
    </div>
    <div className="board-move-layout">
      <div className="board-move-surface" style={{ '--chess-columns': model.columns } as CSSProperties} aria-label="原棋盘与一颗试放棋子" data-testid="board-move-surface">
        {model.cells.map((piece, index) => {
          const option = model.candidates.find(item => item.cell === index);
          const checked = !!option && selected.has(option.tokenId);
          const trying = candidate?.cell === index && !disabled;
          const content = <>
            {piece ? <Stone color={piece} /> : trying ? <><Stone trial /><span className="board-move-trial-tag">试放</span></> : option ? <span className="board-move-empty-ring"><Plus size={26} /></span> : null}
            {checked && <span className="board-move-check" aria-hidden="true"><Check size={18} /></span>}
          </>;
          return option && !piece ? <button type="button" className="board-move-cell" key={index} data-testid={`board-move-cell-${index}`}
            data-selected={checked || undefined} data-trial={trying || undefined} disabled={disabled}
            aria-label={`${coordinate(index)}，空格${checked ? '，已选' : ''}${trying ? '，正在试放' : '，点这里试放'}`} onClick={() => setPreview(index)}>{content}</button>
            : <div className="board-move-cell is-fixed" key={index} data-testid={`board-move-fixed-${index}`} role="img"
              aria-label={`${coordinate(index)}，${piece === 'black' ? '原有黑子' : piece === 'white' ? '原有白子' : '空格，本题没有试放圈'}`}>{content}</div>;
        })}
      </div>
      <aside className="board-move-guide">
        <RulePicture goal={model.goal} />
        <div className="board-move-trial-controls" aria-live="polite">
          <div className="board-move-trial-heading"><Hand size={21} /><strong>{candidate && !disabled ? copy.trial : disabled ? '选好的位置在棋盘上' : copy.empty}</strong></div>
          <p>{candidate && !disabled ? model.goal === 'line3' ? '现在能连成三颗黑子吗？' : '这一步能夹住多少白子？' : '换一个空格，上一颗会收回。'}</p>
          <button type="button" className="activity-secondary board-move-select" data-testid="board-move-select" disabled={disabled || !candidate}
            onClick={() => { if (!disabled && candidate) { onToggle(candidate.tokenId); setPreview(null); } }}>
            <Check size={20} />{previewSelected ? copy.unchoose : copy.choose}
          </button>
          <button type="button" className="board-move-take-back" disabled={disabled || !candidate} onClick={() => setPreview(null)}><RotateCcw size={16} />{copy.takeBack}</button>
        </div>
      </aside>
    </div>
    <div className="board-move-selection-note"><span><Check size={17} />已选 <b>{selected.size}</b> 个位置</span><p>{copy.separate}</p></div>
  </section>;
}
