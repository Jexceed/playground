/** The unit grid is shared by the model river and the available planks. */
export const enlightenmentBridgeModels = [
  { key: "enlightenmentBridge1", width: 5, supports: [], lengths: [6, 4, 2] },
  { key: "enlightenmentBridge2", width: 6, supports: [3], lengths: [4, 4, 2] },
  { key: "enlightenmentBridge3", width: 6, supports: [4], lengths: [5, 3, 1] },
  { key: "enlightenmentBridge4", width: 3, supports: [], lengths: [4, 2, 1] },
  { key: "enlightenmentBridge5", width: 7, supports: [3], lengths: [5, 4, 2] },
  { key: "enlightenmentBridge6", width: 8, supports: [5], lengths: [6, 4, 2] },
  { key: "enlightenmentBridge7", width: 4, supports: [], lengths: [5, 2, 1] },
  { key: "enlightenmentBridge8", width: 8, supports: [3], lengths: [6, 4, 2] },
] as const;
