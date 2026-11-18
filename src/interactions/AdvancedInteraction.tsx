import { Maximize2 } from "lucide-react";
import { useState, type CSSProperties } from "react";
import { ACTIVITY_COPY, type ActivityResponse } from "../domain/activity";
import { placedCells, type AdvancedActivity, type AdvancedResponse } from "../domain/advanced-activity";
import { playTone, speak, playRequiredAudio } from "../speech";
import { MatchingInteraction } from "./MatchingInteraction";
import { GraphInteraction } from "./GraphInteraction";
import { ParentActivity, type ParentMode } from "./ParentActivity";
import { ActivityTokenArt } from "./ActivityTokenArt";
import { CountingDiscs } from "./RulePlayBoards";
import { canPreviewChoiceImage } from "./presentation-state";
export function AdvancedInteraction({ activity, response, disabled, onChange, parentMode = 'play', onParentModeChange = () => {}, onPreviewToken }: {
    activity: AdvancedActivity;
    response: ActivityResponse;
    disabled: boolean;
    onChange: (r: AdvancedResponse) => void;
    parentMode?: ParentMode;
    onParentModeChange?: (mode: ParentMode) => void;
    onPreviewToken?: (tokenId: string) => void;
}) {
    const [selected, setSelected] = useState<string | null>(null);
    const [rotation, setRotation] = useState(0);
    const [layer, setLayer] = useState(0);
    if (activity.kind === "singleChoice" && response.kind === "singleChoice") {
        const listeningForCharacter = activity.primaryFamilyId === "E05" && activity.protocol.kind === "memory";
        const wide = activity.tokens.some(token => (token.image.width ?? 1) / (token.image.height ?? 1) > 1.4);
        return <div className={`activity-choice-grid single-choice ${wide ? "has-wide-options" : ""}`}
            style={{ "--choice-columns": Math.min(4, activity.tokens.length) } as CSSProperties} aria-label="选择一个答案">
          {activity.tokens.map((token, index) => {
            const isSelected = response.tokenId === token.id;
            function select() {
                onChange({ kind: "singleChoice", tokenId: token.id });
                playTone("tap");
                if (token.soundSrc) void playRequiredAudio({ src: token.soundSrc });
                else if (!listeningForCharacter) void speak(token.speechText ?? token.label, token.speechLocale);
            }
            const button = <button type="button" key={token.id} className={`activity-token${isSelected ? " is-selected" : ""}`}
                aria-pressed={isSelected} aria-label={listeningForCharacter ? `第 ${index + 1} 张字卡` : token.label}
                disabled={disabled} onClick={select}>
                {activity.presentation?.evidence?.kind === 'ruleMachine' && <CountingDiscs count={Number(token.label)} />}
                {token.textOnly && /^\d+$/.test(token.label)
                    ? <span className="numeric-answer">{token.label}</span>
                    : <ActivityTokenArt token={token} label />}
            </button>;
            if (!onPreviewToken || !canPreviewChoiceImage(activity, token)) return button;
            return <div className="previewable-choice" key={token.id}>
                {button}
                <button type="button" className="picture-peek" title={ACTIVITY_COPY.viewPicture}
                    aria-label={`看大图：${token.label}`} onClick={() => onPreviewToken(token.id)}><Maximize2 size={15} /></button>
            </div>;
          })}
        </div>;
    }
    if (activity.kind === "matching" && response.kind === "matching")
        return <MatchingInteraction activity={activity} response={response} disabled={disabled} onChange={onChange} />;
    if (activity.kind === "network" && response.kind === "network")
        return <GraphInteraction activity={activity} response={response} disabled={disabled} onChange={onChange} />;
    if (activity.kind === "route" && response.kind === "route")
        return <GraphInteraction activity={activity} response={response} disabled={disabled} onChange={onChange} />;
    if (activity.kind === "construction" && response.kind === "construction") {
        const cells = response.placements.flatMap(p => { const piece = activity.pieces.find(item => item.id === p.pieceId); return piece ? placedCells(piece, p).map(c => ({ cell: c, piece })) : []; });
        const piece = activity.pieces.find(p => p.id === selected);
        const placeOnCell = (clickX: number, clickY: number) => {
            if (!piece) {
                const hit = cells.find(c => c.cell[0] === clickX && c.cell[1] === clickY && c.cell[2] === layer);
                if (hit) {
                    playTone("tap");
                    setSelected(hit.piece.id);
                    const existing = response.placements.find(p => p.pieceId === hit.piece.id);
                    setRotation(existing?.rotation ?? 0);
                    onChange({ kind: 'construction', placements: response.placements.filter(p => p.pieceId !== hit.piece.id) });
                }
                return;
            }
            const shape = placedCells(piece, { pieceId: piece.id, x: 0, y: 0, z: 0, rotation });
            const topY = Math.min(...shape.map(c => c[1]));
            const anchorX = Math.min(...shape.filter(c => c[1] === topY).map(c => c[0]));
            const width = Math.max(...shape.map(c => c[0])) + 1;
            const height = Math.max(...shape.map(c => c[1])) + 1;
            const px = Math.max(0, Math.min(activity.columns - width, clickX - anchorX));
            const py = Math.max(0, Math.min(activity.rows - height, clickY - topY));
            playTone("tap");
            onChange({ kind: 'construction', placements: [...response.placements.filter(p => p.pieceId !== piece.id), { pieceId: piece.id, x: px, y: py, z: layer, rotation }] });
            setSelected(null);
            setRotation(0);
        };
        return <div className="construction-workspace"><div className="construction-tools">{activity.pieces.map((p, index) => {
            const preview = placedCells(p, { pieceId: p.id, x: 0, y: 0, z: 0, rotation: selected === p.id ? rotation : 0 });
            const columns = Math.max(...preview.map(c => c[0])) + 1;
            const rows = Math.max(...preview.map(c => c[1])) + 1;
            return <button type="button" key={p.id} disabled={disabled} aria-pressed={selected === p.id} onClick={() => { playTone("tap"); setSelected(p.id); setRotation(0); }} style={{ borderColor: p.color }}>{index + 1}号 · {p.label}{response.placements.some(q => q.pieceId === p.id) ? ' · 已放' : ''}<span className="piece-preview" style={{ gridTemplateColumns: `repeat(${columns},10px)` }}>{Array.from({ length: columns * rows }, (_, i) => <i key={i} style={{ background: preview.some(([x, y]) => i === y * columns + x) ? p.color : 'transparent' }}/>)}</span></button>;
        })}</div>
      <div className="construction-tools">{activity.allowRotate && <button type="button" disabled={disabled || !piece} onClick={() => { playTone("tap"); setRotation((rotation + 1) % 4); }}>转一下方向 · {rotation * 90}°</button>}{activity.layers > 1 && <label>摆放层<select value={layer} onChange={e => setLayer(Number(e.target.value))}>{Array.from({ length: activity.layers }, (_, i) => <option key={i} value={i}>第{i + 1}层</option>)}</select></label>}</div>
      <p>{piece ? `已选 ${piece.label}。点目标格就会自动对齐摆进去。` : '先选上面一块拼板，再点阴影格；点已放好的拼板可以拿起来重摆。'}</p>
      <div className="construction-board" style={{ gridTemplateColumns: `repeat(${activity.columns},minmax(0,1fr))` }}>{Array.from({ length: activity.rows * activity.columns }, (_, i) => { const x = i % activity.columns, y = Math.floor(i / activity.columns); const placed = cells.filter(c => c.cell[0] === x && c.cell[1] === y && c.cell[2] === layer); const target = activity.target.some(c => c[0] === x && c[1] === y && c[2] === layer); const pieceNumber = placed.length === 1 ? activity.pieces.findIndex(item => item.id === placed[0].piece.id) + 1 : 0; return <button type="button" key={i} disabled={disabled || (!piece && placed.length === 0)} aria-label={`第${layer + 1}层第${y + 1}行第${x + 1}格${placed.length ? `，已放${placed[0].piece.label}` : ''}`} className={target ? 'target-cell' : ''} style={placed.length ? { background: placed.length > 1 ? '#ec8c8c' : placed[0].piece.color } : undefined} onClick={() => placeOnCell(x, y)}>{placed.length > 1 ? '重叠' : pieceNumber > 0 ? `${pieceNumber}` : ''}</button>; })}</div>
      <div className="construction-tools">{response.placements.map(p => <button type="button" key={p.pieceId} disabled={disabled} onClick={() => { playTone("tap"); onChange({ kind: 'construction', placements: response.placements.filter(q => q.pieceId !== p.pieceId) }); }}>取下 {activity.pieces.find(q => q.id === p.pieceId)?.label}</button>)}</div>
    </div>;
    }
    if (activity.kind === "parentObservation" && response.kind === "parentObservation")
        return <ParentActivity activity={activity} response={response} disabled={disabled} onChange={onChange} mode={parentMode} onModeChange={onParentModeChange} />;
    return null;
}
