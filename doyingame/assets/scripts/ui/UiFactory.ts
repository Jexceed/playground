import { Color, Graphics, Label, Layout, Mask, Node, ScrollView, Sprite, SpriteFrame, UITransform, Vec3, resources } from "cc";

export const palette = {
  ink: new Color(49, 65, 73, 255),
  muted: new Color(103, 119, 126, 255),
  paper: new Color(255, 253, 246, 255),
  cream: new Color(250, 244, 224, 255),
  yellow: new Color(246, 196, 67, 255),
  blue: new Color(84, 145, 187, 255),
  green: new Color(94, 165, 122, 255),
  coral: new Color(226, 119, 96, 255),
  white: new Color(255, 255, 255, 255),
};

export function clearNode(node: Node) { node.removeAllChildren(); }

export function sizedNode(name: string, width: number, height: number, parent?: Node) {
  const node = new Node(name);
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

export function label(text: string, options: {
  size?: number; color?: Color; width?: number; height?: number; bold?: boolean; align?: "left" | "center";
} = {}, parent?: Node) {
  const width = options.width ?? 620;
  const height = options.height ?? Math.max(58, (options.size ?? 32) * 2);
  const node = sizedNode(`Label:${text.slice(0, 8)}`, width, height, parent);
  const component = node.addComponent(Label);
  component.string = text;
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
  width?: number; height?: number; color?: Color; textColor?: Color; fontSize?: number; onTap: () => void;
}, parent?: Node) {
  const width = options.width ?? 280;
  const height = options.height ?? 94;
  const node = panel(`Button:${text}`, width, height, options.color ?? palette.yellow, 28, parent);
  label(text, { size: options.fontSize ?? 30, color: options.textColor ?? palette.ink, width: width - 32, height: height - 14, bold: true }, node);
  node.on(Node.EventType.TOUCH_END, () => options.onTap());
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
    const sprite = target.getComponent(Sprite) ?? target.addComponent(Sprite);
    sprite.spriteFrame = frame;
    sprite.sizeMode = Sprite.SizeMode.CUSTOM;
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
