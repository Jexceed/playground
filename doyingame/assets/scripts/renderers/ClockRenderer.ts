import { Color, Graphics, Node } from "cc";
import type { ClockChallenge } from "../models/MathIslandModels";
import { label, palette, panel, sizedNode, verticalLayout } from "../ui/UiFactory";

export class ClockRenderer {
  render(parent: Node, clock: ClockChallenge, width: number) {
    const card = panel("Clock", width, 370, palette.paper, 24, parent);
    const face = sizedNode("ClockFace", 270, 270, card);
    face.setPosition(0, 30);
    const graphics = face.addComponent(Graphics);
    graphics.lineWidth = 7;
    graphics.strokeColor = palette.ink;
    graphics.fillColor = new Color(255, 252, 237, 255);
    graphics.circle(0, 0, 122); graphics.fill(); graphics.stroke();
    for (let value = 1; value <= 12; value += 1) {
      const angle = Math.PI / 2 - value * Math.PI / 6;
      const number = label(String(value), { size: 23, width: 42, height: 42, bold: true }, face);
      number.setPosition(Math.cos(angle) * 96, Math.sin(angle) * 96);
    }
    const minuteAngle = Math.PI / 2 - clock.minute * Math.PI / 30;
    const hourAngle = Math.PI / 2 - (clock.hour % 12 + clock.minute / 60) * Math.PI / 6;
    drawHand(graphics, hourAngle, 63, 10, palette.ink);
    drawHand(graphics, minuteAngle, 92, 7, palette.blue);
    graphics.fillColor = palette.coral; graphics.circle(0, 0, 9); graphics.fill();
    const caption = clock.activity ? `${clock.activity} · 短针看小时，长针看分钟` : "短针看小时，长针看分钟";
    label(caption, { size: 23, width: width - 40, height: 54, color: palette.muted }, card).setPosition(0, -142);
    return card;
  }
}

function drawHand(graphics: Graphics, angle: number, length: number, width: number, color: Color) {
  graphics.lineWidth = width;
  graphics.strokeColor = color;
  graphics.moveTo(0, 0);
  graphics.lineTo(Math.cos(angle) * length, Math.sin(angle) * length);
  graphics.stroke();
}
