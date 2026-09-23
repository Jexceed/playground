import type { GalleryImage } from "./imageGallery";
export type Primitive = {
    kind: "circle";
    x: number;
    y: number;
    r: number;
    fill: string;
} | {
    kind: "rect";
    x: number;
    y: number;
    w: number;
    h: number;
    fill: string;
    dash?: boolean;
} | {
    kind: "line";
    x: number;
    y: number;
    x2: number;
    y2: number;
    color?: string;
    dash?: boolean;
} | {
    kind: "polygon";
    points: [
        number,
        number
    ][];
    fill: string;
} | {
    kind: "text";
    x: number;
    y: number;
    text: string;
    size?: number;
    color?: string;
};
export type Drawing = {
    width: number;
    height: number;
    objects: Primitive[];
};
export const explorationImages: Record<string, GalleryImage> = {};
export const explorationDrawings: Record<string, Drawing> = {};
export function registerExplorationImage(drawing: Drawing, alt: string): GalleryImage {
    // WebKit and V8 can differ at the last bit of sin/cos. Asset identity uses
    // sub-pixel canonical coordinates, never raw floating-point serialization.
    const json = JSON.stringify(drawing, (_key, value) => typeof value === 'number' ? Math.round(value * 10000) / 10000 : value);
    drawing = JSON.parse(json) as Drawing;
    let hash = 2166136261;
    for (let i = 0; i < json.length; i++)
        hash = Math.imul(hash ^ json.charCodeAt(i), 16777619);
    const id = `diagram-${(hash >>> 0).toString(16)}`;
    if (explorationDrawings[id] && JSON.stringify(explorationDrawings[id]) !== json)
        throw Error(`Image hash collision: ${id}`);
    explorationDrawings[id] = drawing;
    explorationImages[id] = { src: `/images/items/exploration/${id}.png`, alt, width: drawing.width, height: drawing.height };
    return { ...explorationImages[id] };
}
