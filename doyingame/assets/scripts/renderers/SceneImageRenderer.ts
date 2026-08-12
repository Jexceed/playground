import { Color, Node } from "cc";
import type { SceneImage } from "../models/MathIslandModels";
import { label, loadSprite, palette, panel, sizedNode } from "../ui/UiFactory";

export class SceneImageRenderer {
  render(parent: Node, scene: SceneImage, width: number) {
    const height = Math.round(width * 9 / 16);
    const frame = panel("SceneImage", width, height, new Color(239, 243, 232, 255), 24, parent);
    const image = sizedNode(scene.alt, width - 16, height - 16, frame);
    loadSprite(scene.src, image, () => {
      label(`图片暂时没有加载好\n${scene.alt}`, { size: 24, width: width - 50, height: height - 40, color: palette.muted }, frame);
    });
    return frame;
  }
}
