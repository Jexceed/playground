import { useState, type CSSProperties } from "react";
import type { ActivityResponse } from "../domain/activity";
import { placedCells, type AdvancedActivity, type AdvancedResponse } from "../domain/advanced-activity";
import { speak, playRequiredAudio } from "../speech";
import { MatchingInteraction } from "./MatchingInteraction";
import { GraphInteraction } from "./GraphInteraction";
import { ParentActivity } from "./ParentActivity";
import { ActivityTokenArt } from "./ActivityTokenArt";
export function AdvancedInteraction({ activity, response, disabled, onChange }: {
    activity: AdvancedActivity;
    response: ActivityResponse;
    disabled: boolean;
    onChange: (r: AdvancedResponse) => void;
}) {
    const [selected, setSelected] = useState<string | null>(null);
    const [rotation, setRotation] = useState(0);
    const [layer, setLayer] = useState(0);
    const token = (id: string) => activity.tokens.find(t => t.id === id)!;
    const tokenArt = (id: string) => <ActivityTokenArt token={token(id)} label />;
    if (activity.kind === "singleChoice" && response.kind === "singleChoice")
        return <div className={`activity-choice-grid single-choice ${activity.tokens.some(t => (t.image.width ?? 1) / (t.image.height ?? 1) > 1.4) ? "has-wide-options" : ""}`} style={{ "--choice-columns": Math.min(4, activity.tokens.length) } as CSSProperties} aria-label="选择一个答案">{activity.tokens.map(t => <button type="button" className={`activity-token ${response.tokenId === t.id ? 'is-selected' : ''}`} key={t.id} aria-pressed={response.tokenId === t.id} aria-label={t.label} disabled={disabled} onClick={() => { onChange({ kind: "singleChoice", tokenId: t.id }); if (t.soundSrc)
            void playRequiredAudio({ src: t.soundSrc });
        else
            void speak(t.speechText ?? t.label); }}>{/^\d+$/.test(t.label) ? <span className="numeric-answer">{t.label}</span> : tokenArt(t.id)}</button>)}</div>;
    if (activity.kind === "matching" && response.kind === "matching")
        return <MatchingInteraction activity={activity} response={response} disabled={disabled} onChange={onChange} />;
    if (activity.kind === "network" && response.kind === "network")
        return <GraphInteraction activity={activity} response={response} disabled={disabled} onChange={onChange} />;
    if (activity.kind === "route" && response.kind === "route")
        return <GraphInteraction activity={activity} response={response} disabled={disabled} onChange={onChange} />;
    if (activity.kind === "construction" && response.kind === "construction") {
        const cells = response.placements.flatMap(p => { const piece = activity.pieces.find(item => item.id === p.pieceId); return piece ? placedCells(piece, p).map(c => ({ cell: c, piece })) : []; });
        const piece = activity.pieces.find(p => p.id === selected);
        return <div className="construction-workspace"><div className="construction-tools">{activity.pieces.map(p => {
            const preview = placedCells(p, { pieceId: p.id, x: 0, y: 0, z: 0, rotation: selected === p.id ? rotation : 0 });
            const columns = Math.max(...preview.map(c => c[0])) + 1;
            const rows = Math.max(...preview.map(c => c[1])) + 1;
            return <button type="button" key={p.id} disabled={disabled} aria-pressed={selected === p.id} onClick={() => { setSelected(p.id); setRotation(0); }} style={{ borderColor: p.color }}>{p.label}{response.placements.some(q => q.pieceId === p.id) ? ' · 已放' : ''}<span className="piece-preview" style={{ gridTemplateColumns: `repeat(${columns},10px)` }}>{Array.from({ length: columns * rows }, (_, i) => <i key={i} style={{ background: preview.some(([x, y]) => i === y * columns + x) ? p.color : 'transparent' }}/>)}</span></button>;
        })}</div>
      <div className="construction-tools">{activity.allowRotate && <button type="button" disabled={disabled || !piece} onClick={() => setRotation((rotation + 1) % 4)}>转四分之一圈 · {rotation * 90}°</button>}{activity.layers > 1 && <label>摆放层<select value={layer} onChange={e => setLayer(Number(e.target.value))}>{Array.from({ length: activity.layers }, (_, i) => <option key={i} value={i}>第{i + 1}层</option>)}</select></label>}</div>
      <p>{piece ? `已选${piece.label}。点方格作为部件左上角。` : '先选一个部件，再点方格。'} 阴影格是需要盖住的位置。</p>
      <div className="construction-board" style={{ gridTemplateColumns: `repeat(${activity.columns},minmax(0,1fr))` }}>{Array.from({ length: activity.rows * activity.columns }, (_, i) => { const x = i % activity.columns, y = Math.floor(i / activity.columns); const placed = cells.filter(c => c.cell[0] === x && c.cell[1] === y && c.cell[2] === layer); const target = activity.target.some(c => c[0] === x && c[1] === y && c[2] === layer); return <button type="button" key={i} disabled={disabled || !piece} aria-label={`第${layer + 1}层第${y + 1}行第${x + 1}格${placed.length ? '，已放部件' : ''}`} className={target ? 'target-cell' : ''} style={placed.length ? { background: placed.length > 1 ? '#ec8c8c' : placed[0].piece.color } : undefined} onClick={() => onChange({ kind: 'construction', placements: [...response.placements.filter(p => p.pieceId !== selected), { pieceId: selected!, x, y, z: layer, rotation }] })}>{placed.length > 1 ? '重叠' : placed[0]?.piece.label ?? ''}</button>; })}</div>
      <div className="construction-tools">{response.placements.map(p => <button type="button" key={p.pieceId} disabled={disabled} onClick={() => onChange({ kind: 'construction', placements: response.placements.filter(q => q.pieceId !== p.pieceId) })}>取下{activity.pieces.find(q => q.id === p.pieceId)?.label}</button>)}</div>
    </div>;
    }
    if (activity.kind === "parentObservation" && response.kind === "parentObservation")
        return <ParentActivity activity={activity} response={response} disabled={disabled} onChange={onChange} />;
    return null;
}
