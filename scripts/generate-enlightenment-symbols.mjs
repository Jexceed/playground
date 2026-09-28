import { mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import sharp from 'sharp';
const wrap = body => `<svg xmlns="http://www.w3.org/2000/svg" width="384" height="384" viewBox="0 0 96 96"><g stroke="#544b40" stroke-width="3" stroke-linejoin="round" stroke-linecap="round">${body}</g></svg>`;
const child = `<path d="M30 88l4-36h28l4 36" fill="#83bca4"/><circle cx="48" cy="30" r="18" fill="#f7cfaa"/><path d="M31 23q3-16 18-13 14 0 17 14-12 0-17-8-6 9-18 7" fill="#7c553c"/><circle cx="42" cy="30" r="1"/><circle cx="55" cy="30" r="1"/><path d="M43 39q5 4 10 0" fill="none"/>`;
const fish = readFileSync('public/images/items/fish.png').toString('base64');
const drawings = {
  'open-door': `<path d="M22 12h53v76H22Z" fill="#a9d5dc"/><path d="M32 19l44-11v76l-44-9Z" fill="#b47c4f"/><circle cx="65" cy="48" r="3" fill="#f3cf6c"/>`,
  'set-square': `<path d="M16 13V83H85ZM29 43V69H55Z" fill="#efca70" fill-rule="evenodd"/><path d="M18 28h6M18 40h5M18 52h6M18 64h5M31 81v-6M43 81v-5M55 81v-6M67 81v-5" fill="none" stroke-width="2"/>`,
  'soil-pot': `<path d="M23 34h50l-6 48H30Z" fill="#d99863"/><ellipse cx="48" cy="34" rx="28" ry="11" fill="#a7734c"/><ellipse cx="48" cy="33" rx="24" ry="7" fill="#5e4736"/><circle cx="37" cy="31" r="1" stroke="#a27e5c"/><circle cx="52" cy="35" r="1" stroke="#a27e5c"/><circle cx="60" cy="30" r="1" stroke="#a27e5c"/>`,
  'hug-shoulders': `${child}<path d="M33 55Q17 77 54 60M63 55Q79 78 42 60" fill="none" stroke="#f7cfaa" stroke-width="11"/><path d="M33 55Q17 77 54 60M63 55Q79 78 42 60" fill="none" stroke-width="2"/>`,
  'touch-head': `${child}<path d="M33 57Q10 32 37 15M63 57Q87 32 60 15" fill="none" stroke="#f7cfaa" stroke-width="11"/><path d="M33 57Q10 32 37 15M63 57Q87 32 60 15" fill="none" stroke-width="2"/>`,
  'fish-on-shore': `<path d="M3 71q31-11 54 0v21H3Z" fill="#d6b481"/><path d="M57 66q20-8 36-1v27H57Z" fill="#88c8e0"/><image href="data:image/png;base64,${fish}" x="1" y="20" width="64" height="56"/>`,
};
mkdirSync('public/images/items/enlightenment/source', { recursive: true });
for (const [name, body] of Object.entries(drawings)) {
  const svg=wrap(body);
  writeFileSync(`public/images/items/enlightenment/source/${name}.svg`,svg);
  await sharp(Buffer.from(svg)).png().toFile(`public/images/items/enlightenment/${name}.png`);
}
console.log(`Generated ${Object.keys(drawings).length} enlightenment symbols.`);
