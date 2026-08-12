import { Color, Graphics, Label, Layout, Node, UITransform } from "cc";
import type { TokenRenderer, VisualGroup } from "../models/MathIslandModels";
import { horizontalLayout, label, loadSprite, palette, panel, sizedNode, verticalLayout } from "../ui/UiFactory";

export class VisualGroupRenderer {
  render(parent: Node, groups: VisualGroup[], renderers: Record<string, TokenRenderer>, width: number) {
    const board = sizedNode("VisualGroups", width, 10, parent);
    verticalLayout(board, 14, 12);
    for (const group of groups) this.renderGroup(board, group, renderers, width - 18);
    return board;
  }

  private renderGroup(parent: Node, group: VisualGroup, renderers: Record<string, TokenRenderer>, width: number) {
    const card = panel(`Group:${group.label}`, width, group.layout === "subitize" ? 330 : Math.max(180, Math.ceil(group.items.length / 5) * 104 + 80), palette.paper, 24, parent);
    label(group.label, { size: 24, width: width - 40, height: 48, color: palette.muted }, card).setPosition(0, card.getComponent(UITransform)!.height / 2 - 34);
    const grid = sizedNode("TokenGrid", width - 40, card.getComponent(UITransform)!.height - 70, card);
    grid.setPosition(0, -22);
    const columns = group.layout === "subitize" ? 3 : Math.min(5, Math.max(1, group.items.length));
    const cell = group.layout === "subitize" ? 78 : 82;
    group.items.forEach((token, index) => {
      const x = (index % columns - (columns - 1) / 2) * (cell + 14);
      const rows = Math.ceil(group.items.length / columns);
      const y = ((rows - 1) / 2 - Math.floor(index / columns)) * (cell + 12);
      this.renderToken(grid, token, renderers[token], cell, x, y);
    });
  }

  private renderToken(parent: Node, token: string, renderer: TokenRenderer | undefined, size: number, x: number, y: number) {
    const node = sizedNode(`Token:${token || "empty"}`, size, size, parent);
    node.setPosition(x, y);
    if (!renderer || renderer.kind === "empty") return;
    if (renderer.kind === "image") {
      loadSprite(renderer.src, node, () => label(renderer.label, { size: 20, width: size, height: size }, node));
      return;
    }
    const graphics = node.addComponent(Graphics);
    graphics.fillColor = Color.fromHEX(new Color(), renderer.color);
    if (renderer.shape === "circle") graphics.circle(0, 0, size * 0.32);
    else graphics.roundRect(-size * 0.32, -size * 0.32, size * 0.64, size * 0.64, 12);
    graphics.fill();
  }
}
