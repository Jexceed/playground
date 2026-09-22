import { mkdir, writeFile } from "node:fs/promises";
import sharp from "sharp";

const root = "public/images/items/thinking-symbols";
await mkdir(root + "/source", { recursive: true });
const colors = { red: "#df6358", blue: "#4b95c3", yellow: "#eabb49" };
const shapes = {
  circle: '<circle cx="160" cy="160" r="106"/>',
  square: '<rect x="57" y="57" width="206" height="206" rx="9"/>',
  triangle: '<path d="M160 42 L281 258 L39 258 Z" stroke-linejoin="round"/>',
};
for (const [color, fill] of Object.entries(colors))
  for (const [shape, body] of Object.entries(shapes)) {
    await save(
      color + "-" + shape,
      `<g fill="${fill}" stroke="#354659" stroke-width="7">${body}</g>`,
    );
  }
await save(
  "blank-card",
  '<rect x="40" y="40" width="240" height="240" rx="22" fill="#fffdf7" stroke="#9b9b93" stroke-width="5" stroke-dasharray="13 10"/>',
);
async function save(name, body) {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="320" height="320" viewBox="0 0 320 320">${body}</svg>\n`;
  await writeFile(root + "/source/" + name + ".svg", svg);
  await sharp(Buffer.from(svg))
    .png()
    .toFile(root + "/" + name + ".png");
}
console.log(
  "Generated 10 deterministic thinking-symbol PNGs with SVG sources.",
);
