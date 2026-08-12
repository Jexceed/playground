import { Color, Node } from "cc";
import type { SceneImage } from "../models/MathIslandModels";
import { label, loadSprite, palette, outlinedPanel, sizedNode } from "../ui/UiFactory";

export class SceneImageRenderer {
  render(parent: Node, scene: SceneImage, width: number, height = Math.round(width * 9 / 16)) {
    const frame = outlinedPanel("SceneImage", width, height, new Color(239, 246, 239, 255), 12, parent, new Color(205, 222, 211, 255), 1.5);
    const image = sizedNode(scene.alt, width - 12, height - 12, frame);
    loadSprite(scene.src, image, () => {
      label(`图片暂时没有加载好\n${scene.alt}`, { size: 20, width: width - 40, height: height - 32, color: palette.muted }, frame);
    });
    return frame;
  }
}
