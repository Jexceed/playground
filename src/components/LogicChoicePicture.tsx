import { visualMetaFor, visualParts, VisualGlyph } from "./VisualToken";
import { logicChoicePictureFor } from "../domain/logic-choice-picture";
import type { GameRound, RoundOption } from "../types";
import "./logic-choice-picture.css";

export { logicChoicePictureFor } from "../domain/logic-choice-picture";

/** Picture only: the caller keeps the choice label, speech and answer button. */
export function LogicChoicePicture({ gameId, round, choice }: { gameId: string; round: GameRound; choice: RoundOption }) {
  const model = logicChoicePictureFor(gameId, round, choice);
  if (!model) return null;
  if (model.kind === "quantity") {
    const meta = visualMetaFor(model.item);
    if (!meta) return null;
    return <span className="logic-choice-picture logic-choice-quantity" data-picture-count={model.count} aria-hidden="true">
      {Array.from({ length: model.count }, (_, index) => <VisualGlyph key={index} kind={meta.kind} />)}
    </span>;
  }
  if (model.kind === "height-profile") {
    const width = model.heights.length * 30 + 12;
    return <svg className="logic-choice-picture logic-choice-height" viewBox={`0 0 ${width} 94`} aria-hidden="true" data-profile={model.heights.join(",")}>
      <path d={`M4 72H${width - 4}`} stroke="#536a78" strokeWidth="2" />
      {model.heights.map((height, column) => <g key={column}>
        {Array.from({ length: height }, (_, level) => <rect key={level} x={8 + column * 30} y={52 - level * 20} width="20" height="20" fill="#83b5d2" stroke="#365e75" strokeWidth="1.5" />)}
        <text x={18 + column * 30} y="88" textAnchor="middle" fontSize="12" fill="#365e75">{height}</text>
      </g>)}
    </svg>;
  }
  if (model.kind === "ordered-card") {
    const metas = visualParts(model.value).map(visualMetaFor);
    if (metas.some(meta => !meta)) return null;
    return <span className="logic-choice-picture logic-choice-ordered" data-card-position={model.position} aria-hidden="true">
      {metas.map((meta, index) => <span className="logic-choice-slot" key={index}><VisualGlyph kind={meta!.kind} /></span>)}
    </span>;
  }
  return <span className="logic-choice-picture logic-choice-category" aria-hidden="true">
    <svg viewBox="0 0 64 64">
      {model.marker === "square"
        ? <rect x="12" y="12" width="40" height="40" fill="none" stroke="#3d4852" strokeWidth="4" />
        : model.marker === "circle" ? <circle cx="32" cy="32" r="22" fill="none" stroke="#3d4852" strokeWidth="4" />
        : <path d="M13 17Q9 7 25 10L48 12Q60 14 55 28L52 47Q50 57 35 53L15 51Q5 48 10 34Z" fill={model.marker === 'color' ? model.color : undefined} />}
    </svg>
  </span>;
}
