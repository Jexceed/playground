import { visualMetaFor, visualParts, VisualGlyph } from "./VisualToken";
import { imageGallery } from "../data/imageGallery";
import { logicChoicePictureFor } from "../domain/logic-choice-picture";
import { publicAsset } from "../publicAsset";
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
  return <span className="logic-choice-picture logic-choice-basket" aria-hidden="true">
    <img src={publicAsset(imageGallery.items.logic046Daily_emptyBasket.src)} alt="" />
    <svg className="logic-basket-marker" viewBox="0 0 40 40">
      {model.marker === "square"
        ? <rect x="8" y="8" width="24" height="24" fill="#fffaf0" stroke="#3d4852" strokeWidth="3" />
        : <circle cx="20" cy="20" r="13" fill={model.marker === "color" ? model.color : "#fffaf0"} stroke="#3d4852" strokeWidth="3" />}
    </svg>
  </span>;
}
