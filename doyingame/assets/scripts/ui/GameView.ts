import { Color, Node } from "cc";
import type { MathGame, MathIslandCatalog } from "../models/MathIslandModels";
import type { ProgressV1 } from "../models/Progress";
import type { RoundController, RoundResult } from "../controllers/RoundController";
import { ClockRenderer } from "../renderers/ClockRenderer";
import { SceneImageRenderer } from "../renderers/SceneImageRenderer";
import { VisualGroupRenderer } from "../renderers/VisualGroupRenderer";
import { label, loadSprite, outlinedPanel, palette, paperBackground, pill, place, sizedNode, touchButton } from "./UiFactory";

type GameActions = {
  openGame: (game: MathGame) => void;
  jump: (roundIndex: number) => void;
  restart: () => void;
  hearPrompt: () => void;
  select: (value: string) => void;
  check: () => void;
  next: () => void;
  hearParent: () => void;
  openParentInfo: () => void;
  openSidebar?: () => void;
};

const GAME_ICONS = ["①", "⚡", "↔", "✦", "+", "÷", "••", "◷"];

export class GameView {
  private readonly groupRenderer = new VisualGroupRenderer();
  private readonly sceneRenderer = new SceneImageRenderer();
  private readonly clockRenderer = new ClockRenderer();

  constructor(private readonly root: Node, private readonly width: number, private readonly height: number) {}

  render(catalog: MathIslandCatalog, game: MathGame, roundIndex: number, controller: RoundController, feedback: RoundResult | null, progress: ProgressV1, actions: GameActions) {
    this.root.removeAllChildren();
    paperBackground("ThinkingHouseGrid", this.width, this.height, this.root);

    const margin = 14;
    const gap = 14;
    const panelHeight = this.height - margin * 2;
    const leftWidth = clamp(this.width * 0.205, 236, 278);
    const rightWidth = clamp(this.width * 0.225, 266, 304);
    const centerWidth = this.width - margin * 2 - gap * 2 - leftWidth - rightWidth;
    const leftX = -this.width / 2 + margin + leftWidth / 2;
    const centerX = leftX + leftWidth / 2 + gap + centerWidth / 2;
    const rightX = centerX + centerWidth / 2 + gap + rightWidth / 2;

    const left = place(outlinedPanel("WorldNavigation", leftWidth, panelHeight, palette.paper, 10, this.root, palette.line, 2), leftX, 0);
    const center = place(outlinedPanel("GameStage", centerWidth, panelHeight, palette.paper, 10, this.root, palette.line, 2), centerX, 0);
    const right = place(sizedNode("SidePanel", rightWidth, panelHeight, this.root), rightX, 0);

    this.renderLeft(left, leftWidth, panelHeight, catalog, game, progress, actions);
    this.renderCenter(center, centerWidth, panelHeight, catalog, game, roundIndex, controller, feedback, actions);
    this.renderRight(right, rightWidth, panelHeight, game, roundIndex, controller, progress, actions);
  }

  private renderLeft(parent: Node, width: number, height: number, catalog: MathIslandCatalog, activeGame: MathGame, progress: ProgressV1, actions: GameActions) {
    const brand = sizedNode("Brand", width - 24, 94, parent);
    place(brand, 0, height / 2 - 55);
    loadSprite(catalog.brandImage, brand, () => label("小小思考屋", { size: 28, width: width - 36, height: 56, bold: true }, brand));

    const world = place(outlinedPanel("MathWorld", width - 24, 62, new Color(255, 244, 208, 255), 10, parent, palette.yellow, 2), 0, height / 2 - 137);
    label("数字岛", { size: 22, width: width - 116, height: 28, bold: true, align: "left" }, world).setPosition(-38, 12);
    label("数一数、比一比、说说为什么", { size: 14, width: width - 116, height: 22, color: palette.muted, align: "left" }, world).setPosition(-38, -13);
    pill(`${progress.completedRoundIds.length}/${catalog.world.roundCount}`, { width: 68, height: 30, size: 14, color: palette.paper, borderColor: palette.yellow }, world).setPosition(width / 2 - 54, 0);

    label("数字岛关卡", { size: 18, width: width - 48, height: 30, bold: true, align: "left" }, parent).setPosition(-10, height / 2 - 190);
    label(`${catalog.games.length} 个`, { size: 15, width: 52, height: 28, color: palette.muted }, parent).setPosition(width / 2 - 44, height / 2 - 190);

    const buttonHeight = Math.min(52, (height - 224 - 18 - 7 * 5) / 8);
    const startY = height / 2 - 232 - buttonHeight / 2;
    catalog.games.forEach((game, index) => {
      const completed = game.rounds.filter((round) => progress.completedRoundIds.includes(round.id)).length;
      const active = game.id === activeGame.id;
      const done = completed === game.rounds.length;
      const text = `${GAME_ICONS[index] ?? "•"}  ${game.title}    ${done ? "✓" : `${completed}/${game.rounds.length}`}`;
      const button = touchButton(text, {
        width: width - 24,
        height: buttonHeight,
        fontSize: 17,
        color: active ? palette.paleYellow : done ? palette.paleGreen : palette.paper,
        borderColor: active ? palette.yellow : done ? palette.mint : palette.line,
        borderWidth: active ? 2.5 : 1.5,
        align: "left",
        radius: 9,
        onTap: () => actions.openGame(game),
      }, parent);
      place(button, 0, startY - index * (buttonHeight + 5));
    });
  }

  private renderCenter(parent: Node, width: number, height: number, catalog: MathIslandCatalog, game: MathGame, roundIndex: number, controller: RoundController, feedback: RoundResult | null, actions: GameActions) {
    const round = controller.round;
    label(`第 ${roundIndex + 1}/${game.rounds.length} 题`, { size: 17, width: 130, height: 28, color: palette.muted, bold: true, align: "left" }, parent).setPosition(-width / 2 + 80, height / 2 - 28);
    pill(`难度 ${round.level}`, { width: 82, height: 28, size: 14, color: new Color(255, 248, 232, 255) }, parent).setPosition(-width / 2 + 182, height / 2 - 28);
    label(game.title, { size: 16, width: 150, height: 28, color: palette.blue, bold: true }, parent).setPosition(0, height / 2 - 28);
    touchButton("🔊 听题", { width: 112, height: 38, fontSize: 16, color: new Color(244, 251, 247, 255), borderColor: new Color(214, 227, 218, 255), radius: 9, onTap: actions.hearPrompt }, parent).setPosition(width / 2 - 72, height / 2 - 28);

    label(round.prompt, { size: 28, width: width - 34, height: 58, bold: true, align: "left" }, parent).setPosition(0, height / 2 - 78);
    label(round.instruction, { size: 17, width: width - 34, height: 36, color: palette.muted, align: "left" }, parent).setPosition(0, height / 2 - 120);

    const evidenceWidth = width - 28;
    const evidenceHeight = Math.min(258, height * 0.375);
    let evidence: Node;
    if (round.sceneImage) evidence = this.sceneRenderer.render(parent, round.sceneImage, evidenceWidth, evidenceHeight);
    else if (round.visualGroups) evidence = this.groupRenderer.render(parent, round.visualGroups, catalog.tokenRenderers, evidenceWidth, evidenceHeight);
    else if (round.clockChallenge) evidence = this.clockRenderer.render(parent, round.clockChallenge, evidenceWidth, evidenceHeight);
    else evidence = outlinedPanel("EmptyEvidence", evidenceWidth, evidenceHeight, palette.paleBlue, 12, parent, new Color(195, 219, 225, 255), 1.5);
    place(evidence, 0, height / 2 - 142 - evidenceHeight / 2);

    const choicesTitleY = height / 2 - 156 - evidenceHeight;
    label("选一个你觉得最合适的答案", { size: 15, width: width - 32, height: 24, color: palette.muted, align: "left" }, parent).setPosition(0, choicesTitleY);
    const choicesWidth = width - 32;
    const choiceGap = 10;
    const choiceWidth = (choicesWidth - choiceGap * Math.max(0, round.choices.length - 1)) / round.choices.length;
    const choiceY = choicesTitleY - 42;
    round.choices.forEach((choice, index) => {
      const selected = controller.selected === choice.value;
      const correct = controller.state === "correct" && choice.value === round.answer;
      const button = touchButton(choice.label, {
        width: choiceWidth,
        height: 58,
        fontSize: 22,
        color: correct ? palette.paleGreen : selected ? palette.paleYellow : palette.paper,
        borderColor: correct ? palette.mint : selected ? palette.yellow : palette.line,
        borderWidth: selected || correct ? 2.5 : 1.5,
        radius: 10,
        onTap: () => actions.select(choice.value),
      }, parent);
      const x = -choicesWidth / 2 + choiceWidth / 2 + index * (choiceWidth + choiceGap);
      place(button, x, choiceY);
    });

    const actionY = -height / 2 + 39;
    touchButton("↻  从头来", { width: 138, height: 52, fontSize: 17, color: palette.paper, borderColor: palette.line, radius: 9, onTap: actions.restart }, parent).setPosition(-width / 2 + 84, actionY);
    const primaryText = feedback?.kind === "correct" ? (roundIndex === game.rounds.length - 1 ? "完成并再玩一次" : "下一题  ›") : "看看对不对";
    touchButton(primaryText, {
      width: 204,
      height: 52,
      fontSize: 18,
      color: feedback?.kind === "correct" ? palette.green : controller.selected ? palette.yellow : new Color(232, 229, 219, 255),
      textColor: feedback?.kind === "correct" ? palette.white : controller.selected ? palette.ink : palette.muted,
      borderColor: feedback?.kind === "correct" ? palette.green : controller.selected ? palette.yellow : palette.line,
      disabled: !controller.selected && feedback?.kind !== "correct",
      radius: 9,
      onTap: feedback?.kind === "correct" ? actions.next : actions.check,
    }, parent).setPosition(width / 2 - 117, actionY);

    const feedbackWidth = Math.max(170, width - 402);
    const feedbackX = -18;
    if (feedback) {
      const box = outlinedPanel("Feedback", feedbackWidth, 52, feedback.kind === "correct" ? palette.paleGreen : palette.paleCoral, 9, parent, feedback.kind === "correct" ? palette.mint : new Color(235, 184, 157, 255), 1.5);
      label(feedback.message, { size: 16, width: feedbackWidth - 22, height: 42, color: feedback.kind === "correct" ? palette.green : palette.coral, bold: true }, box);
      place(box, feedbackX, actionY);
    } else {
      label("选好后，说说为什么，再来检查。", { size: 15, width: feedbackWidth, height: 40, color: palette.muted }, parent).setPosition(feedbackX, actionY);
    }
  }

  private renderRight(parent: Node, width: number, height: number, game: MathGame, roundIndex: number, controller: RoundController, progress: ProgressV1, actions: GameActions) {
    const navHeight = Math.min(268, height * 0.39);
    const nav = place(outlinedPanel("RoundNavigator", width, navHeight, new Color(255, 250, 240, 255), 10, parent, new Color(234, 223, 206, 255), 2), 0, height / 2 - navHeight / 2);
    const completedCount = game.rounds.filter((round) => progress.completedRoundIds.includes(round.id)).length;
    label("题目导航", { size: 18, width: width - 118, height: 32, bold: true, align: "left" }, nav).setPosition(-44, navHeight / 2 - 24);
    label(`${completedCount} / ${game.rounds.length} 已做`, { size: 14, width: 102, height: 28, color: palette.muted }, nav).setPosition(width / 2 - 60, navHeight / 2 - 24);
    const columns = 6;
    const rows = Math.ceil(game.rounds.length / columns);
    const buttonSize = Math.min(36, (navHeight - 62 - Math.max(0, rows - 1) * 5) / rows);
    const gridWidth = columns * buttonSize + (columns - 1) * 5;
    const topY = navHeight / 2 - 57 - buttonSize / 2;
    game.rounds.forEach((round, index) => {
      const done = progress.completedRoundIds.includes(round.id);
      const current = index === roundIndex;
      const button = touchButton(done ? `✓${index + 1}` : `${index + 1}`, {
        width: buttonSize,
        height: buttonSize,
        fontSize: buttonSize < 32 ? 11 : 13,
        color: current ? palette.paleYellow : done ? palette.paleGreen : palette.paper,
        borderColor: current ? palette.yellow : done ? palette.mint : palette.line,
        borderWidth: current ? 2 : 1.25,
        radius: 7,
        onTap: () => actions.jump(index),
      }, nav);
      const x = -gridWidth / 2 + buttonSize / 2 + (index % columns) * (buttonSize + 5);
      const y = topY - Math.floor(index / columns) * (buttonSize + 5);
      place(button, x, y);
    });

    const gap = 10;
    const parentHeight = 144;
    const promptY = height / 2 - navHeight - gap - parentHeight / 2;
    const prompt = place(outlinedPanel("ParentPrompt", width, parentHeight, palette.paper, 10, parent, palette.line, 2), 0, promptY);
    label("亲子提示卡", { size: 16, width: width - 102, height: 28, color: palette.coral, bold: true, align: "left" }, prompt).setPosition(-38, parentHeight / 2 - 22);
    touchButton("🔊 听", { width: 70, height: 32, fontSize: 14, color: new Color(255, 248, 232, 255), borderColor: new Color(228, 213, 189, 255), radius: 8, onTap: actions.hearParent }, prompt).setPosition(width / 2 - 47, parentHeight / 2 - 22);
    label(controller.round.parentPrompt, { size: 16, width: width - 24, height: 92, color: palette.ink, align: "left" }, prompt).setPosition(0, -13);

    const actionsHeight = 50;
    const progressHeight = height - navHeight - parentHeight - actionsHeight - gap * 3;
    const progressY = -height / 2 + actionsHeight + gap + progressHeight / 2;
    const growth = place(outlinedPanel("GrowthRecord", width, progressHeight, palette.paper, 10, parent, palette.line, 2), 0, progressY);
    label("成长记录", { size: 16, width: width - 24, height: 28, color: palette.green, bold: true, align: "left" }, growth).setPosition(0, progressHeight / 2 - 22);
    const tags = progress.abilityTags.slice(-6);
    if (!tags.length) {
      label("完成一个小任务后，\n这里会留下能力标签。", { size: 15, width: width - 28, height: 70, color: palette.muted, align: "left" }, growth).setPosition(0, -12);
    } else {
      const tagWidth = (width - 34) / 2;
      const startY = progressHeight / 2 - 58;
      tags.forEach((tag, index) => {
        const tagNode = pill(tag, { width: tagWidth, height: 30, size: 13, color: palette.paleGreen, textColor: palette.green, borderColor: palette.mint }, growth);
        place(tagNode, (index % 2 === 0 ? -1 : 1) * (tagWidth / 2 + 3), startY - Math.floor(index / 2) * 35);
      });
      if (progress.abilityTags.length > tags.length) label(`还有 ${progress.abilityTags.length - tags.length} 个`, { size: 13, width: width - 24, height: 24, color: palette.muted, align: "left" }, growth).setPosition(0, -progressHeight / 2 + 16);
    }

    const bottomY = -height / 2 + actionsHeight / 2;
    const actionGap = 8;
    const actionWidth = actions.openSidebar ? (width - actionGap) / 2 : width;
    touchButton("家长说明", { width: actionWidth, height: actionsHeight, fontSize: 16, color: new Color(239, 246, 249, 255), borderColor: new Color(204, 219, 226, 255), radius: 9, onTap: actions.openParentInfo }, parent).setPosition(actions.openSidebar ? -actionWidth / 2 - actionGap / 2 : 0, bottomY);
    if (actions.openSidebar) touchButton("侧边栏", { width: actionWidth, height: actionsHeight, fontSize: 16, color: palette.paleGreen, borderColor: palette.mint, radius: 9, onTap: actions.openSidebar }, parent).setPosition(actionWidth / 2 + actionGap / 2, bottomY);
  }
}

function clamp(value: number, minimum: number, maximum: number) { return Math.max(minimum, Math.min(maximum, value)); }
