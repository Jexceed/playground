import { Color, Node, UITransform } from "cc";
import type { MathGame, MathIslandCatalog, MathRound } from "../models/MathIslandModels";
import type { RoundController, RoundResult } from "../controllers/RoundController";
import { ClockRenderer } from "../renderers/ClockRenderer";
import { SceneImageRenderer } from "../renderers/SceneImageRenderer";
import { VisualGroupRenderer } from "../renderers/VisualGroupRenderer";
import { horizontalLayout, label, palette, panel, scrollColumn, sizedNode, touchButton, verticalLayout } from "./UiFactory";

export class GameView {
  private readonly groupRenderer = new VisualGroupRenderer();
  private readonly sceneRenderer = new SceneImageRenderer();
  private readonly clockRenderer = new ClockRenderer();

  constructor(private readonly root: Node, private readonly width: number, private readonly height: number) {}

  render(catalog: MathIslandCatalog, game: MathGame, roundIndex: number, controller: RoundController, feedback: RoundResult | null, actions: {
    back: () => void; restart: () => void; hearPrompt: () => void; select: (value: string) => void; check: () => void; next: () => void; hearParent: () => void;
  }) {
    this.root.removeAllChildren();
    const background = panel("GamePaper", this.width, this.height, palette.cream, 0, this.root);
    const { content } = scrollColumn(this.width, this.height, background);

    const nav = sizedNode("Navigation", this.width - 50, 78, content);
    horizontalLayout(nav, 16, 0, false);
    touchButton("‹ 返回", { width: 160, height: 68, fontSize: 25, color: new Color(230, 239, 245, 255), onTap: actions.back }, nav);
    label(`${game.title} · ${roundIndex + 1}/${game.rounds.length}`, { size: 27, width: this.width - 390, height: 66, bold: true }, nav);
    touchButton("从头来", { width: 170, height: 68, fontSize: 24, color: new Color(239, 233, 218, 255), onTap: actions.restart }, nav);

    const round = controller.round;
    const header = panel("Question", this.width - 56, 250, palette.paper, 28, content);
    verticalLayout(header, 4, 16, false);
    label(`难度 ${round.level}`, { size: 21, width: this.width - 100, height: 38, color: palette.blue, bold: true }, header);
    label(round.prompt, { size: 36, width: this.width - 105, height: 94, bold: true }, header);
    label(round.instruction, { size: 25, width: this.width - 110, height: 68, color: palette.muted }, header);
    touchButton("🔊 再听一遍", { width: 240, height: 66, fontSize: 23, color: new Color(230, 241, 228, 255), onTap: actions.hearPrompt }, content);

    if (round.sceneImage) this.sceneRenderer.render(content, round.sceneImage, this.width - 70);
    if (round.visualGroups) this.groupRenderer.render(content, round.visualGroups, catalog.tokenRenderers, this.width - 70);
    if (round.clockChallenge) this.clockRenderer.render(content, round.clockChallenge, this.width - 70);

    label("选一个你觉得最合适的答案", { size: 25, width: this.width - 80, height: 54, color: palette.muted }, content);
    for (const choice of round.choices) {
      const selected = controller.selected === choice.value;
      const correct = controller.state === "correct" && choice.value === round.answer;
      const color = correct ? new Color(207, 236, 213, 255) : selected ? new Color(255, 227, 137, 255) : palette.paper;
      touchButton(choice.label, { width: this.width - 80, height: 92, fontSize: 31, color, onTap: () => actions.select(choice.value) }, content);
    }

    if (!feedback || feedback.kind === "retry") {
      touchButton("看看对不对", { width: this.width - 120, height: 88, color: controller.selected ? palette.yellow : new Color(223, 221, 210, 255), onTap: actions.check }, content);
    } else {
      touchButton(roundIndex === game.rounds.length - 1 ? "完成这个游戏" : "下一题 ›", { width: this.width - 120, height: 88, color: palette.green, textColor: palette.white, onTap: actions.next }, content);
    }

    if (feedback) {
      const box = panel("Feedback", this.width - 70, feedback.kind === "correct" ? 230 : 150, feedback.kind === "correct" ? new Color(230, 244, 231, 255) : new Color(252, 235, 218, 255), 24, content);
      verticalLayout(box, 8, 18, false);
      label(feedback.message, { size: 27, width: this.width - 120, height: 100, color: feedback.kind === "correct" ? palette.green : palette.coral, bold: true }, box);
      if (feedback.kind === "correct") touchButton("👪 家长问一问", { width: 290, height: 64, fontSize: 23, color: palette.paper, onTap: actions.hearParent }, box);
    }
  }
}
