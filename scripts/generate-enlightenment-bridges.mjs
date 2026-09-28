import { mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import sharp from 'sharp';
import { loadTypeScriptModule } from './lib/load-ts-module.mjs';
const { enlightenmentBridgeModels } = await loadTypeScriptModule('src/data/enlightenmentBridges.ts');
const { imageGallery } = await loadTypeScriptModule('src/data/imageGallery.ts');
const bear = readFileSync('public' + imageGallery.characters.bear.src).toString('base64');
mkdirSync('public/images/scenes/source', { recursive: true });
for (const [index, model] of enlightenmentBridgeModels.entries()) {
  const unit = 90, left = 250, riverEnd = left + model.width * unit;
  const stops = [0, ...model.supports, model.width];
  const text = (x, y, value, size = 32, anchor = 'middle') => `<text x="${x}" y="${y}" font-size="${size}" text-anchor="${anchor}" fill="#293f45">${value}</text>`;
  const dimensions = stops.slice(1).map((stop, i) => {
    const x1 = left + stops[i] * unit, x2 = left + stop * unit;
    return `<path d="M${x1} 150V115H${x2}V150" fill="none" stroke="#526876" stroke-width="3"/>${text((x1+x2)/2,97,`${stop-stops[i]} 格`,38)}`;
  }).join('');
  const lines = Array.from({ length: model.width + 1 }, (_, i) => `<path d="M${left+i*unit} 155V330" stroke="#e2f0f3" stroke-width="2"/>`).join('');
  const islands = model.supports.map(point => `<rect x="${left+point*unit-28}" y="165" width="56" height="155" rx="18" fill="#a3c87f" stroke="#689556" stroke-width="3"/>${text(left+point*unit,355,'小岛',27)}`).join('');
  const planks = model.lengths.map((length,i) => {
    const y = 415+i*72, name = model.lengths[0] === model.lengths[1] ? ['木板甲','木板乙','短木板'][i] : ['长木板','短木板','最短板'][i];
    const ticks = Array.from({length:length-1},(_,j)=>`<path d="M${320+(j+1)*unit} ${y}V${y+40}" stroke="#ae783b" stroke-width="2"/>`).join('');
    return `${text(190,y+30,`${name} ${length} 格`,30)}<rect x="320" y="${y}" width="${length*unit}" height="40" rx="5" fill="#e4b570" stroke="#8e663c" stroke-width="3"/>${ticks}`;
  }).join('');
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="1200" height="675" viewBox="0 0 1200 675"><rect width="1200" height="675" rx="22" fill="#fffaf0"/><g font-family="PingFang SC, Arial, sans-serif" font-weight="600">${text(600,45,'桌面模型 · 看距离和支点',30)}<rect x="55" y="155" width="1090" height="175" rx="25" fill="#cde2af"/><rect x="${left}" y="155" width="${model.width*unit}" height="175" fill="#83c5dd"/>${lines}${dimensions}${islands}<image href="data:image/png;base64,${bear}" x="75" y="165" width="135" height="145"/><path d="M${riverEnd+80} 285V185l60 15-60 15" fill="#e78f4e" stroke="#725a3c" stroke-width="5"/>${text(600,385,'木板两头要搭在河岸或小岛上',28)}${planks}${text(600,650,'每一小格一样长；可先用手指比一比',27)}</g></svg>`;
  const source = `public/images/scenes/source/enlightenment-bridge-${index+1}.svg`;
  writeFileSync(source, svg);
  await sharp(Buffer.from(svg)).png().toFile(`public/images/scenes/enlightenment-bridge-${index+1}.png`);
}
console.log(`Generated ${enlightenmentBridgeModels.length} exact model diagrams with registered local character art.`);
