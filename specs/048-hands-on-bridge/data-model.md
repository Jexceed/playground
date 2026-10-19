# Data model
BridgeModel沿用enlightenmentBridgeModels。Placement为每段woodIndex|null；同一woodIndex最多一次。BridgeAttempt包含ready/valid/feedback；任何非法索引、重复、未满、短板均无效。测量点为bear/left-bank/right-bank/plank/flag，只有两岸组合有效。GameRound仅8题文案修改，模型/ID/answers/options/排序保持。
