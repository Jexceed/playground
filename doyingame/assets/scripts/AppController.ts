import { _decorator, Component, UITransform, Vec3, view } from "cc";
import type { MathGame, MathIslandCatalog } from "./models/MathIslandModels";
import { completeGame, completeRound, saveLocation, type ProgressV1 } from "./models/Progress";
import { RoundController, type RoundResult } from "./controllers/RoundController";
import { CatalogService } from "./services/CatalogService";
import { createPlatformAdapter } from "./services/DouyinPlatformAdapter";
import type { PlatformAdapter } from "./services/PlatformAdapter";
import { ProgressService } from "./services/ProgressService";
import { VoiceService } from "./services/VoiceService";
import { GameView } from "./ui/GameView";
import { HomeView } from "./ui/HomeView";
import { ParentInfoView } from "./ui/ParentInfoView";
import { label, palette, panel } from "./ui/UiFactory";

const { ccclass } = _decorator;

@ccclass("AppController")
export class AppController extends Component {
  private catalog!: MathIslandCatalog;
  private platform!: PlatformAdapter;
  private progressService!: ProgressService;
  private progress!: ProgressV1;
  private voice!: VoiceService;
  private currentGame: MathGame | null = null;
  private roundIndex = 0;
  private roundController: RoundController | null = null;
  private feedback: RoundResult | null = null;
  private width = 750;
  private height = 1334;
  private sidebarSupported = false;
  private unsubscribers: Array<() => void> = [];

  protected async start() {
    this.platform = createPlatformAdapter();
    this.voice = new VoiceService(this.node);
    this.configureCanvas();
    this.showLoading();
    try {
      this.catalog = await new CatalogService().load();
      this.progressService = new ProgressService(this.platform, this.catalog);
      this.progress = this.progressService.read();
      this.sidebarSupported = await this.platform.checkSidebar();
      this.unsubscribers.push(this.platform.onHide(() => this.voice.stop()));
      this.unsubscribers.push(this.platform.onShow(() => this.voice.stop()));
      this.showHome();
    } catch (error) {
      this.platform.report("boot-failed", error);
      this.showError(error);
    }
  }

  protected onDestroy() { this.voice?.stop(); this.unsubscribers.forEach((unsubscribe) => unsubscribe()); }

  private configureCanvas() {
    const size = view.getVisibleSize();
    const viewport = this.platform.getViewport();
    const scaleX = size.width / Math.max(1, viewport.width);
    const scaleY = size.height / Math.max(1, viewport.height);
    const safeLeft = viewport.safeLeft * scaleX;
    const safeRight = viewport.safeRight * scaleX;
    const safeTop = viewport.safeTop * scaleY;
    const safeBottom = viewport.safeBottom * scaleY;
    this.width = Math.max(320, size.width - safeLeft - safeRight);
    this.height = Math.max(568, size.height - safeTop - safeBottom);
    const transform = this.node.getComponent(UITransform) ?? this.node.addComponent(UITransform);
    transform.setContentSize(this.width, this.height);
    this.node.setPosition(new Vec3((safeLeft - safeRight) / 2, (safeBottom - safeTop) / 2, 0));
  }

  private showLoading() {
    this.node.removeAllChildren();
    panel("Loading", this.width, this.height, palette.cream, 0, this.node);
    label("数字岛正在准备……", { size: 36, width: this.width - 80, height: 100, bold: true }, this.node);
  }

  private showError(error: unknown) {
    this.node.removeAllChildren();
    panel("Error", this.width, this.height, palette.cream, 0, this.node);
    label(`数字岛暂时没有准备好\n${error instanceof Error ? error.message : String(error)}`, { size: 30, width: this.width - 90, height: 220, color: palette.coral }, this.node);
  }

  private showHome() {
    this.voice.stop();
    this.currentGame = null;
    new HomeView(this.node, this.width, this.height).render(this.catalog, this.progress, {
      openGame: (game, index = 0) => this.openGame(game, index),
      openParentInfo: () => this.showParentInfo(),
      openSidebar: this.sidebarSupported ? () => void this.platform.navigateToSidebar() : undefined,
    });
  }

  private showParentInfo() { this.voice.stop(); new ParentInfoView(this.node, this.width, this.height).render(this.catalog, () => this.showHome()); }

  private openGame(game: MathGame, index = 0) {
    this.currentGame = game;
    this.roundIndex = Math.max(0, Math.min(index, game.rounds.length - 1));
    this.roundController = new RoundController(game.rounds[this.roundIndex]);
    this.feedback = null;
    this.persistLocation();
    this.renderRound();
    this.voice.play(this.roundController.round.voice.prompt);
  }

  private renderRound() {
    if (!this.currentGame || !this.roundController) return;
    new GameView(this.node, this.width, this.height).render(this.catalog, this.currentGame, this.roundIndex, this.roundController, this.feedback, {
      back: () => this.showHome(),
      restart: () => this.openGame(this.currentGame!, 0),
      hearPrompt: () => this.voice.play(this.roundController!.round.voice.prompt),
      select: (value) => { if (this.roundController!.select(value)) { this.voice.play(this.roundController!.round.voice.choices[value]); this.renderRound(); } },
      check: () => this.checkAnswer(),
      next: () => this.nextRound(),
      hearParent: () => this.voice.play(this.roundController!.round.voice.parent),
    });
  }

  private checkAnswer() {
    if (!this.roundController) return;
    const result = this.roundController.check();
    if (!result) return;
    this.feedback = result;
    this.voice.play(result.kind === "correct" ? this.roundController.round.voice.success : this.roundController.round.voice.retry);
    if (result.kind === "correct") {
      this.progress = completeRound(this.progress, this.roundController.round.id, this.roundController.round.abilityTags);
      this.progressService.write(this.progress);
    }
    this.renderRound();
  }

  private nextRound() {
    if (!this.currentGame || this.roundController?.state !== "correct") return;
    if (this.roundIndex >= this.currentGame.rounds.length - 1) {
      this.progress = completeGame(this.progress, this.currentGame.id, this.currentGame.abilityTags);
      this.progressService.write(this.progress);
      this.showHome();
      return;
    }
    this.roundIndex += 1;
    this.roundController.replaceRound(this.currentGame.rounds[this.roundIndex]);
    this.feedback = null;
    this.persistLocation();
    this.renderRound();
    this.voice.play(this.roundController.round.voice.prompt);
  }

  private persistLocation() {
    if (!this.currentGame) return;
    this.progress = saveLocation(this.progress, { gameId: this.currentGame.id, roundIndex: this.roundIndex });
    this.progressService.write(this.progress);
  }
}
