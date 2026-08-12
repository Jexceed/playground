import { Color, Graphics, Node } from "cc";
import type { ClockChallenge } from "../models/MathIslandModels";
import { label, outlinedPanel, palette, sizedNode } from "../ui/UiFactory";

export class ClockRenderer {
  render(parent: Node, clock: ClockChallenge, width: number, height = 258) {
    const card = outlinedPanel("Clock", width, height, palette.paleBlue, 12, parent, new Color(195, 219, 225, 255), 1.5);
    const diameter = Math.min(190, height - 42);
    const face = sizedNode("ClockFace", diameter, diameter, card);
    face.setPosition(-Math.min(width * 0.18, 130), 8);
    const graphics = face.addComponent(Graphics);
    const radius = diameter * 0.43;
    graphics.lineWidth = 5;
    graphics.strokeColor = palette.ink;
    graphics.fillColor = new Color(255, 252, 237, 255);
    graphics.circle(0, 0, radius); graphics.fill(); graphics.stroke();
    for (let value = 1; value <= 12; value += 1) {
      const angle = Math.PI / 2 - value * Math.PI / 6;
      const number = label(String(value), { size: 15, width: 26, height: 26, bold: true }, face);
      number.setPosition(Math.cos(angle) * radius * 0.78, Math.sin(angle) * radius * 0.78);
    }
    const minuteAngle = Math.PI / 2 - clock.minute * Math.PI / 30;
    const hourAngle = Math.PI / 2 - (clock.hour % 12 + clock.minute / 60) * Math.PI / 6;
    drawHand(graphics, hourAngle, radius * 0.52, 8, palette.ink);
    drawHand(graphics, minuteAngle, radius * 0.76, 5, palette.blue);
    graphics.fillColor = palette.coral; graphics.circle(0, 0, 7); graphics.fill();
    label(clock.label, { size: 26, width: width * 0.44, height: 66, bold: true }, card).setPosition(width * 0.22, 35);
    const caption = clock.activity ? `${clock.activity}\n短针看小时，长针看分钟` : "短针看小时\n长针看分钟";
    label(caption, { size: 17, width: width * 0.44, height: 82, color: palette.muted }, card).setPosition(width * 0.22, -38);
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
