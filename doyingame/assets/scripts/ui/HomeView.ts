import { Color, Layout, Node, UITransform } from "cc";
import type { MathGame, MathIslandCatalog } from "../models/MathIslandModels";
import type { ProgressV1 } from "../models/Progress";
import { horizontalLayout, label, loadSprite, palette, panel, scrollColumn, sizedNode, touchButton, verticalLayout } from "./UiFactory";

export class HomeView {
  constructor(private readonly root: Node, private readonly width: number, private readonly height: number) {}

  render(catalog: MathIslandCatalog, progress: ProgressV1, actions: {
    openGame: (game: MathGame, roundIndex?: number) => void;
    openParentInfo: () => void;
    openSidebar?: () => void;
  }) {
    this.root.removeAllChildren();
    const background = panel("WarmPaper", this.width, this.height, palette.cream, 0, this.root);
    const { content } = scrollColumn(this.width, this.height, background);

    const brand = sizedNode("Brand", Math.min(560, this.width - 70), 260, content);
    loadSprite(catalog.brandImage, brand, () => {
      label("小小思考屋", { size: 54, width: 520, height: 110, bold: true }, brand);
    });
    label("数字岛", { size: 52, width: this.width - 70, height: 80, color: palette.blue, bold: true }, content);
    label("一起数一数、比一比，也说说为什么。", { size: 28, width: this.width - 80, height: 70, color: palette.muted }, content);

    if (progress.lastLocation) {
      const game = catalog.games.find((item) => item.id === progress.lastLocation!.gameId);
      if (game) touchButton(`继续：${game.title} · 第 ${progress.lastLocation.roundIndex + 1} 题`, {
        width: this.width - 90, color: palette.yellow, onTap: () => actions.openGame(game, progress.lastLocation!.roundIndex),
      }, content);
    }

    for (const game of catalog.games) {
      const complete = progress.completedGameIds.includes(game.id);
      const card = panel(`GameCard:${game.id}`, this.width - 70, 244, palette.paper, 28, content);
      verticalLayout(card, 4, 18, false);
      label(`${complete ? "✓ " : ""}${game.title}`, { size: 36, width: this.width - 120, height: 54, color: complete ? palette.green : palette.ink, bold: true }, card);
      label(game.subtitle, { size: 25, width: this.width - 130, height: 76, color: palette.muted }, card);
      touchButton(complete ? "再玩一次" : "开始", { width: 220, height: 68, fontSize: 26, color: complete ? new Color(220, 239, 225, 255) : palette.yellow, onTap: () => actions.openGame(game) }, card);
    }

    const footer = sizedNode("ParentActions", this.width - 80, 100, content);
    horizontalLayout(footer, 18, 0, false);
    touchButton("家长说明", { width: 250, height: 76, fontSize: 26, color: new Color(229, 239, 245, 255), onTap: actions.openParentInfo }, footer);
    if (actions.openSidebar) touchButton("下次从侧边栏回来", { width: 360, height: 76, fontSize: 24, color: new Color(231, 241, 224, 255), onTap: actions.openSidebar }, footer);
    label(`共 ${catalog.world.gameCount} 个游戏 · ${catalog.world.roundCount} 道亲子思考题`, { size: 22, width: this.width - 80, height: 60, color: palette.muted }, content);
  }
}
