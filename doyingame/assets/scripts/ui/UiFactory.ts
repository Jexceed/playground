import { Color, Graphics, Label, Layout, Mask, Node, ScrollView, Sprite, SpriteFrame, UITransform, Vec3, resources } from "cc";

export const palette = {
  ink: new Color(37, 50, 67, 255),
  muted: new Color(101, 113, 132, 255),
  paper: new Color(255, 253, 247, 255),
  cream: new Color(244, 239, 228, 255),
  panel: new Color(248, 241, 230, 255),
  line: new Color(216, 208, 194, 255),
  yellow: new Color(233, 180, 76, 255),
  paleYellow: new Color(255, 240, 200, 255),
  blue: new Color(99, 159, 199, 255),
  paleBlue: new Color(226, 242, 249, 255),
  green: new Color(57, 125, 97, 255),
  mint: new Color(147, 213, 181, 255),
  paleGreen: new Color(222, 243, 231, 255),
  coral: new Color(217, 99, 79, 255),
  paleCoral: new Color(253, 235, 224, 255),
  white: new Color(255, 255, 255, 255),
};

export function clearNode(node: Node) { node.removeAllChildren(); }

export function sizedNode(name: string, width: number, height: number, parent?: Node) {
  const node = new Node(name);
  // Nodes created at runtime default to the DEFAULT layer. The Math Island
  // camera renders UI_2D only, so every generated UI node must inherit the
  // parent layer before it is attached or the app runs invisibly.
  if (parent) node.layer = parent.layer;
  node.addComponent(UITransform).setContentSize(width, height);
  parent?.addChild(node);
  return node;
}

export function panel(name: string, width: number, height: number, color = palette.paper, radius = 26, parent?: Node) {
  const node = sizedNode(name, width, height, parent);
  const graphics = node.addComponent(Graphics);
  graphics.fillColor = color;
  graphics.roundRect(-width / 2, -height / 2, width, height, radius);
  graphics.fill();
  return node;
}

export function outlinedPanel(name: string, width: number, height: number, color = palette.paper, radius = 18, parent?: Node, stroke = palette.line, lineWidth = 2) {
  const node = sizedNode(name, width, height, parent);
  const graphics = node.addComponent(Graphics);
  graphics.fillColor = color;
  graphics.strokeColor = stroke;
  graphics.lineWidth = lineWidth;
  graphics.roundRect(-width / 2, -height / 2, width, height, radius);
  graphics.fill();
  graphics.stroke();
  return node;
}

export function paperBackground(name: string, width: number, height: number, parent?: Node) {
  const node = sizedNode(name, width, height, parent);
  const graphics = node.addComponent(Graphics);
  graphics.fillColor = palette.cream;
  graphics.rect(-width / 2, -height / 2, width, height);
  graphics.fill();
  graphics.lineWidth = 1;
  graphics.strokeColor = new Color(255, 255, 255, 74);
  for (let x = -width / 2; x <= width / 2; x += 32) {
    graphics.moveTo(x, -height / 2);
    graphics.lineTo(x, height / 2);
  }
  for (let y = -height / 2; y <= height / 2; y += 32) {
    graphics.moveTo(-width / 2, y);
    graphics.lineTo(width / 2, y);
  }
  graphics.stroke();
  graphics.fillColor = new Color(147, 213, 181, 35);
  graphics.circle(width * 0.31, height * 0.32, Math.min(width, height) * 0.32);
  graphics.fill();
  graphics.fillColor = new Color(157, 201, 232, 34);
  graphics.circle(-width * 0.37, -height * 0.3, Math.min(width, height) * 0.28);
  graphics.fill();
  return node;
}

export function label(text: string | number, options: {
  size?: number; color?: Color; width?: number; height?: number; bold?: boolean; align?: "left" | "center";
} = {}, parent?: Node) {
  const width = options.width ?? 620;
  const height = options.height ?? Math.max(58, (options.size ?? 32) * 2);
  const content = String(text ?? "");
  const node = sizedNode(`Label:${content.slice(0, 8)}`, width, height, parent);
  const component = node.addComponent(Label);
  component.string = content;
  component.fontSize = options.size ?? 32;
  component.lineHeight = Math.round((options.size ?? 32) * 1.35);
  component.color = options.color ?? palette.ink;
  component.overflow = Label.Overflow.SHRINK;
  component.enableWrapText = true;
  component.horizontalAlign = options.align === "left" ? Label.HorizontalAlign.LEFT : Label.HorizontalAlign.CENTER;
  component.verticalAlign = Label.VerticalAlign.CENTER;
  return node;
}

export function touchButton(text: string, options: {
  width?: number; height?: number; color?: Color; textColor?: Color; fontSize?: number; radius?: number;
  borderColor?: Color; borderWidth?: number; align?: "left" | "center"; disabled?: boolean; onTap: () => void;
}, parent?: Node) {
  const width = options.width ?? 280;
  const height = options.height ?? 94;
  const node = outlinedPanel(`Button:${text}`, width, height, options.color ?? palette.yellow, options.radius ?? 14, parent, options.borderColor ?? palette.line, options.borderWidth ?? 2);
  const textNode = label(text, { size: options.fontSize ?? 30, color: options.textColor ?? palette.ink, width: width - 28, height: height - 12, bold: true, align: options.align }, node);
  if (options.align === "left") textNode.setPosition(-2, 0);
  if (!options.disabled) node.on(Node.EventType.TOUCH_END, () => options.onTap());
  return node;
}

export function pill(text: string, options: { width: number; height?: number; size?: number; color?: Color; textColor?: Color; borderColor?: Color }, parent?: Node) {
  const height = options.height ?? 34;
  const node = outlinedPanel(`Pill:${text}`, options.width, height, options.color ?? palette.panel, height / 2, parent, options.borderColor ?? palette.line, 1.5);
  label(text, { size: options.size ?? 17, color: options.textColor ?? palette.ink, width: options.width - 16, height: height - 4, bold: true }, node);
  return node;
}

export function verticalLayout(node: Node, spacing = 20, padding = 0, resizeContainer = true) {
  const layout = node.addComponent(Layout);
  layout.type = Layout.Type.VERTICAL;
  layout.resizeMode = resizeContainer ? Layout.ResizeMode.CONTAINER : Layout.ResizeMode.NONE;
  layout.spacingY = spacing;
  layout.paddingTop = padding;
  layout.paddingBottom = padding;
  return layout;
}

export function horizontalLayout(node: Node, spacing = 16, padding = 0, resizeContainer = true) {
  const layout = node.addComponent(Layout);
  layout.type = Layout.Type.HORIZONTAL;
  layout.resizeMode = resizeContainer ? Layout.ResizeMode.CONTAINER : Layout.ResizeMode.NONE;
  layout.spacingX = spacing;
  layout.paddingLeft = padding;
  layout.paddingRight = padding;
  return layout;
}

export function scrollColumn(width: number, height: number, parent: Node) {
  const root = sizedNode("ScrollView", width, height, parent);
  const view = sizedNode("View", width, height, root);
  view.addComponent(Mask).type = Mask.Type.GRAPHICS_RECT;
  const content = sizedNode("Content", width, height, view);
  const transform = content.getComponent(UITransform)!;
  transform.setAnchorPoint(0.5, 1);
  content.setPosition(0, height / 2);
  verticalLayout(content, 20, 20);
  const scroll = root.addComponent(ScrollView);
  scroll.content = content;
  scroll.vertical = true;
  scroll.horizontal = false;
  scroll.inertia = true;
  scroll.brake = 0.65;
  return { root, content, scroll };
}

export function loadSprite(runtimePath: string, target: Node, onFailure?: () => void) {
  const base = `math-island/${runtimePath.replace(/\.[^.]+$/, "")}`;
  const apply = (frame: SpriteFrame) => {
    const transform = target.getComponent(UITransform) ?? target.addComponent(UITransform);
    const width = transform.width;
    const height = transform.height;
    const sprite = target.getComponent(Sprite) ?? target.addComponent(Sprite);
    sprite.sizeMode = Sprite.SizeMode.CUSTOM;
    sprite.spriteFrame = frame;
    transform.setContentSize(width, height);
  };
  resources.load(`${base}/spriteFrame`, SpriteFrame, (error, frame) => {
    if (!error && frame) return apply(frame);
    resources.load(base, SpriteFrame, (fallbackError, fallback) => {
      if (!fallbackError && fallback) apply(fallback);
      else onFailure?.();
    });
  });
}

export function place(node: Node, x: number, y: number) { node.setPosition(new Vec3(x, y, 0)); return node; }
