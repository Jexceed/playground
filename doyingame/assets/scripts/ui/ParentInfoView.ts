import { Color, Node } from "cc";
import type { MathIslandCatalog } from "../models/MathIslandModels";
import { label, palette, panel, scrollColumn, touchButton, verticalLayout } from "./UiFactory";

export class ParentInfoView {
  constructor(private readonly root: Node, private readonly width: number, private readonly height: number) {}
  render(catalog: MathIslandCatalog, back: () => void) {
    this.root.removeAllChildren();
    const background = panel("ParentPaper", this.width, this.height, palette.cream, 0, this.root);
    const { content } = scrollColumn(this.width, this.height, background);
    touchButton("‹ 回到数字岛", { width: 250, height: 72, fontSize: 25, color: new Color(230, 239, 245, 255), onTap: back }, content);
    label("给家长的话", { size: 46, width: this.width - 80, height: 80, bold: true }, content);
    label("这不是计时刷题。请让孩子先看图、动手点一点击，再问：你为什么这样想？", { size: 28, width: this.width - 90, height: 125, color: palette.muted }, content);
    for (const game of catalog.games) {
      const card = panel(`Parent:${game.id}`, this.width - 70, 252, palette.paper, 24, content);
      verticalLayout(card, 5, 16, false);
      label(game.title, { size: 32, width: this.width - 120, height: 50, bold: true, color: palette.blue }, card);
      label(`练习目标：${game.goal}`, { size: 24, width: this.width - 120, height: 78, color: palette.ink }, card);
      label(`可以追问：${game.parentPrompt}`, { size: 24, width: this.width - 120, height: 78, color: palette.green }, card);
    }
    const notice = panel("PrivacyAge", this.width - 70, 310, new Color(238, 242, 231, 255), 24, content);
    verticalLayout(notice, 5, 18, false);
    label("适龄与隐私", { size: 30, width: this.width - 120, height: 54, bold: true }, notice);
    label("本首发版面向家长陪同的低龄亲子共玩，不含陌生人交流、广告、内购、排行榜或自由输入。进度只保存在当前设备。平台最终适龄说明与隐私内容由发布主体在提审前确认。", { size: 24, width: this.width - 120, height: 210, color: palette.muted }, notice);
  }
}
