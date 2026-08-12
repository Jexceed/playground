import { Color, Graphics, Node } from "cc";
import type { TokenRenderer, VisualGroup } from "../models/MathIslandModels";
import { label, loadSprite, outlinedPanel, palette, place, sizedNode } from "../ui/UiFactory";

export class VisualGroupRenderer {
  render(parent: Node, groups: VisualGroup[], renderers: Record<string, TokenRenderer>, width: number, height = 258) {
    const board = outlinedPanel("VisualGroups", width, height, palette.paleBlue, 12, parent, new Color(195, 219, 225, 255), 1.5);
    const columns = groups.length <= 2 ? groups.length : Math.min(3, groups.length);
    const rows = Math.ceil(groups.length / Math.max(1, columns));
    const gap = 9;
    const cardWidth = (width - 22 - gap * Math.max(0, columns - 1)) / Math.max(1, columns);
    const cardHeight = (height - 22 - gap * Math.max(0, rows - 1)) / Math.max(1, rows);
    groups.forEach((group, index) => {
      const row = Math.floor(index / columns);
      const itemsInRow = Math.min(columns, groups.length - row * columns);
      const rowWidth = itemsInRow * cardWidth + Math.max(0, itemsInRow - 1) * gap;
      const column = index % columns;
      const x = -rowWidth / 2 + cardWidth / 2 + column * (cardWidth + gap);
      const y = height / 2 - 11 - cardHeight / 2 - row * (cardHeight + gap);
      place(this.renderGroup(board, group, renderers, cardWidth, cardHeight), x, y);
    });
    return board;
  }

  private renderGroup(parent: Node, group: VisualGroup, renderers: Record<string, TokenRenderer>, width: number, height: number) {
    const card = outlinedPanel(`Group:${group.label}`, width, height, palette.paper, 10, parent, new Color(220, 225, 214, 255), 1.25);
    label(group.label, { size: Math.min(17, height * 0.18), width: width - 16, height: 26, color: palette.muted }, card).setPosition(0, height / 2 - 18);
    const availableHeight = height - 40;
    const columns = Math.min(group.layout === "subitize" ? 3 : 5, Math.max(1, group.items.length));
    const rows = Math.ceil(group.items.length / columns);
    const cell = Math.max(22, Math.min(52, (width - 22) / columns - 6, availableHeight / rows - 5));
    const gridWidth = columns * cell + Math.max(0, columns - 1) * 5;
    const gridHeight = rows * cell + Math.max(0, rows - 1) * 4;
    group.items.forEach((token, index) => {
      const x = -gridWidth / 2 + cell / 2 + (index % columns) * (cell + 5);
      const y = gridHeight / 2 - cell / 2 - Math.floor(index / columns) * (cell + 4) - 13;
      this.renderToken(card, token, renderers[token], cell, x, y);
    });
    return card;
  }

  private renderToken(parent: Node, token: string, renderer: TokenRenderer | undefined, size: number, x: number, y: number) {
    const node = sizedNode(`Token:${token || "empty"}`, size, size, parent);
    node.setPosition(x, y);
    if (!renderer || renderer.kind === "empty") return;
    if (renderer.kind === "image") {
      loadSprite(renderer.src, node, () => label(renderer.label, { size: Math.max(12, size * 0.36), width: size, height: size }, node));
      return;
    }
    const graphics = node.addComponent(Graphics);
    graphics.fillColor = Color.fromHEX(new Color(), renderer.color);
    if (renderer.shape === "circle") graphics.circle(0, 0, size * 0.32);
    else graphics.roundRect(-size * 0.32, -size * 0.32, size * 0.64, size * 0.64, Math.max(4, size * 0.13));
    graphics.fill();
  }
}
