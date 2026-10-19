import { imageGallery } from "../data/imageGallery";
import { logicBridgeChoiceFor, logicBridgeDiagramLayout, type LogicBridgeChoiceModel } from "../domain/logic-choice-picture";
import { publicAsset } from "../publicAsset";
import type { GameRound, RoundOption } from "../types";
import "./logic-choice-picture.css";

export { logicBridgeChoiceFor, logicBridgeDiagramLayout, LOGIC_BRIDGE_UNIT } from "../domain/logic-choice-picture";
export type { LogicBridgeChoiceModel } from "../domain/logic-choice-picture";

/** Exact unit geometry; this diagram intentionally leaves incorrect plans wrong. */
export function LogicBridgeChoice({ gameId, round, choice }: { gameId: string; round: GameRound; choice: RoundOption }) {
  const model = gameId === "logic-space-bridge" ? logicBridgeChoiceFor(round, choice) : null;
  if (!model) return null;
  return <LogicBridgeDiagram model={model} compact />;
}

/** The same geometry can also illustrate a stated gap and available plank. */
export function LogicBridgeDiagram({ model, compact = false }: { model: LogicBridgeChoiceModel; compact?: boolean }) {
  const layout = logicBridgeDiagramLayout(model);
  const { unit, left, right } = layout;
  const bear = { x: left - 26, y: 68 };
  const plank = { x: left + 20, y: 130 };
  const flag = { x: right + 24, y: 63 };
  const endpoints = model.measure === "banks" ? [{ x: left, y: 67 }, { x: right, y: 67 }]
    : model.measure === "bear-plank" ? [bear, plank] : [plank, flag];
  return <svg className="logic-choice-picture logic-choice-bridge" viewBox={compact?`0 18 ${layout.width} ${model.measure?140:110}`:`0 0 ${layout.width} ${layout.height}`} aria-hidden="true" data-river-units={model.width}>
    <rect x="4" y="24" width="312" height="82" rx="10" fill="#d8e8bd" />
    <rect x={left} y="24" width={model.width * unit} height="82" fill="#99cfdf" />
    {Array.from({ length: model.width + 1 }, (_, index) => <path key={index} d={`M${left + index * unit} 24V106`} stroke="#e8f5f7" strokeWidth="1" />)}
    {model.supports.map(point => <rect key={point} x={left + point * unit - 6} y="29" width="12" height="72" rx="4" fill="#a3c87f" stroke="#60824c" />)}
    <>
      <image href={publicAsset(imageGallery.characters.bear.src)} x={bear.x - 14} y={bear.y - 18} width="28" height="30" />
      <path d={`M${flag.x} 83V43l18 7-18 7`} fill="#e39751" stroke="#725a3c" strokeWidth="2" />
    </>
    {layout.planks.map((piece, index) => {
      const { x, y } = piece;
      return <g key={index} data-plank-units={piece.length}>
        <rect x={x} y={y} width={piece.width} height={piece.height} rx="2" fill={index % 2 ? "#d59a54" : "#e7bb79"} stroke="#795b34" strokeWidth="1.5" />
        {Array.from({ length: piece.length - 1 }, (_, tick) => <path key={tick} d={`M${x + (tick + 1) * unit} ${y}V${y + 18}`} stroke="#916a3e" strokeWidth="1" />)}
        <text x={x + piece.length * unit / 2} y={y + 30} fontSize={compact ? 20 : 12} textAnchor="middle" fill="#4c4b3c">{piece.length} 格</text>
      </g>;
    })}
    {model.measure && <g stroke="#314956" fill="#314956" strokeWidth="2.5">
      <path d={`M${endpoints[0].x} ${endpoints[0].y}L${endpoints[1].x} ${endpoints[1].y}`} strokeDasharray="5 3" />
      {endpoints.map((point, index) => <circle key={index} cx={point.x} cy={point.y} r="3" />)}
    </g>}
    {!compact&&<text x="160" y="164" textAnchor="middle" fill="#526876" fontSize="12">每一小格一样长</text>}
    {layout.inventory.map((piece, index) => <g key={`inventory-${index}`} data-inventory-units={piece.length}>
      <text x="22" y={piece.y + 13} fontSize="12" fill="#4c4b3c">{piece.length} 格木板</text>
      <rect x={piece.x} y={piece.y} width={piece.width} height={piece.height} rx="2" fill="#e7bb79" stroke="#795b34" strokeWidth="1.5" />
      {Array.from({ length: piece.length - 1 }, (_, tick) => <path key={tick} d={`M${piece.x + (tick + 1) * unit} ${piece.y}V${piece.y + piece.height}`} stroke="#916a3e" strokeWidth="1" />)}
    </g>)}
  </svg>;
}
