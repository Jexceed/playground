# Research: Graphic Workshop

## Decision: Use A Third World Instead Of Expanding Logic House

**Rationale**: The reference bundle contains many tasks where the child must process contour, occlusion, layer order, local detail, symbol coding, or visual closure. The refined implementation includes the families that can be represented as concrete drawn stems and drawn answer options: silhouette matching, occlusion recovery, local-detail-to-whole matching, transparent layer overlap, graphic coding, and visual closure. These operations differ from the existing 逻辑屋 visual-spatial clusters and justify a separate world without duplicating them.

**Alternatives considered**:
- Expand 逻辑屋 only: rejected because it increases redundancy with existing matrix, map, memory, and rotation clusters.
- Migrate all visual-spatial logic games immediately: rejected for this pass because it would be a broad content restructuring with higher regression risk.

## Decision: First Pass Uses Dedicated Graphic Surfaces

**Rationale**: The user's review made clear that abstract labels and generic token groups are below the source difficulty and do not behave like 上实-style graphic questions. The first pass now uses a dedicated `graphicChallenge` structure with SVG-rendered stem art and four drawn answer options. The audit intentionally rejects first-pass graphic rounds that reuse scene images, visual groups, grid, matrix, sequence, or memory surfaces owned by 逻辑屋.

**Alternatives considered**:
- Reuse `visualGroups`: rejected because it produces abstract token tasks rather than actual drawn question-and-option surfaces.
- Generate new scene images now: deferred because the first-pass task families can be represented locally with inline SVG figures, while richer raster scenes can be added in a future content pass.

## Decision: Cap Existing-World Reinforcement

**Rationale**: The source corpus contains many numeric and logic-adjacent variants. The user explicitly asked to avoid excessive repetition and redundancy. A cap of three reinforcement rounds keeps additions intentional.

**Alternatives considered**:
- Add all relevant source-inspired numeric/logic rounds: rejected because it would turn the app into a drill bank.
- Add no reinforcement: rejected because the user asked for distinct related content to strengthen existing worlds when appropriate.
