/** Author-provided known quantities only. Unknown quantities are never previewed. */
export type MathEvidence =
  | { kind: 'sharingModel'; mode: 'share'; total: number; people: number }
  | { kind: 'sharingModel'; mode: 'groups'; groups: number; each: number }
  | { kind: 'sharingModel'; mode: 'remainder'; total: number; capacity: number }
  | { kind: 'moneyExchange'; from: number; denomination: number }
  | { kind: 'clockModel'; clocks: { label: string; hour: number; minute: number }[] }
  | { kind: 'rulerModel'; start: number; end: number; maximum: number }
  | { kind: 'perimeterModel'; columns: number; rows: number }
  | { kind: 'placeValueModel'; tens: number; ones: number }
  | { kind: 'numberPattern'; values: (number | null)[]; columns: number }
  | { kind: 'shapeEquations'; relations: { shapes: ('circle' | 'triangle')[]; total: number | null }[] }
  | { kind: 'waterModel'; smallCups: number };

export const MATH_EVIDENCE_KINDS = new Set<string>([
  'sharingModel', 'moneyExchange', 'clockModel', 'rulerModel', 'perimeterModel',
  'placeValueModel', 'numberPattern', 'shapeEquations', 'waterModel',
]);
