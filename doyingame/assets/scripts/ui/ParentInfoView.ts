import { Color, Node, UITransform } from "cc";
import type { MathIslandCatalog } from "../models/MathIslandModels";
import { label, outlinedPanel, palette, paperBackground, place, touchButton } from "./UiFactory";

export class ParentInfoView {
  constructor(private readonly root: Node, private readonly width: number, private readonly height: number) {}

  render(catalog: MathIslandCatalog, back: () => void) {
    this.root.removeAllChildren();
    paperBackground("ParentPaper", this.width, this.height, this.root);
    const margin = 18;
    const contentWidth = this.width - margin * 2;
    const contentHeight = this.height - margin * 2;
    const page = outlinedPanel("ParentGuide", contentWidth, contentHeight, palette.paper, 12, this.root, palette.line, 2);

    touchButton("‹ 回到刚才的题", { width: 190, height: 46, fontSize: 17, color: new Color(239, 246, 249, 255), borderColor: new Color(204, 219, 226, 255), radius: 9, onTap: back }, page).setPosition(-contentWidth / 2 + 112, contentHeight / 2 - 36);
    label("给家长的话", { size: 30, width: 250, height: 48, bold: true }, page).setPosition(0, contentHeight / 2 - 36);
    label("这不是计时刷题。请让孩子先看图、动手点一点击，再问：你为什么这样想？", { size: 17, width: contentWidth - 480, height: 48, color: palette.muted }, page).setPosition(contentWidth / 2 - (contentWidth - 480) / 2 - 22, contentHeight / 2 - 36);

    const gap = 10;
    const cardWidth = (contentWidth - 42 - gap) / 2;
    const cardHeight = 104;
    const startY = contentHeight / 2 - 106 - cardHeight / 2;
    catalog.games.forEach((game, index) => {
      const card = outlinedPanel(`Parent:${game.id}`, cardWidth, cardHeight, index % 2 === 0 ? new Color(255, 251, 239, 255) : new Color(242, 249, 245, 255), 10, page, palette.line, 1.5);
      const x = (index % 2 === 0 ? -1 : 1) * (cardWidth / 2 + gap / 2);
      const y = startY - Math.floor(index / 2) * (cardHeight + gap);
      place(card, x, y);
      label(game.title, { size: 20, width: cardWidth - 24, height: 30, bold: true, color: palette.blue, align: "left" }, card).setPosition(0, 31);
      label(`练习：${game.goal}`, { size: 15, width: cardWidth - 24, height: 32, color: palette.ink, align: "left" }, card).setPosition(0, 3);
      label(`追问：${game.parentPrompt}`, { size: 14, width: cardWidth - 24, height: 38, color: palette.green, align: "left" }, card).setPosition(0, -29);
    });

    const noticeY = -contentHeight / 2 + 42;
    const notice = outlinedPanel("PrivacyAge", contentWidth - 42, 64, new Color(238, 242, 231, 255), 9, page, new Color(205, 218, 199, 255), 1.5);
    place(notice, 0, noticeY);
    label("适龄与隐私", { size: 17, width: 110, height: 34, bold: true, align: "left" }, notice).setPosition(-notice.getComponent(UITransform)!.width / 2 + 67, 0);
    label("面向家长陪同的低龄亲子共玩；不含陌生人交流、广告、内购、排行榜或自由输入。进度只保存在当前设备。", { size: 14, width: contentWidth - 190, height: 46, color: palette.muted, align: "left" }, notice).setPosition(55, 0);
  }
}
