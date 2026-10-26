import fs from'node:fs';import sharp from'sharp';
const base='specs/059-chapter-readability/verification/';const dir=base+'first-pass/';const ledger=JSON.parse(fs.readFileSync('specs/059-chapter-readability/reviews/chapter-ledger.json'));fs.mkdirSync(base+'sheets',{recursive:true});
for(let page=0;page<Math.ceil(ledger.length/6);page++){
 const batch=ledger.slice(page*6,page*6+6);if(batch.some(g=>!fs.existsSync(dir+g.gameId+'.png')))continue;const inputs=[];
 for(let i=0;i<batch.length;i++){const g=batch[i],r=JSON.parse(fs.readFileSync(dir+g.gameId+'.json')).stage;const meta=await sharp(dir+g.gameId+'.png').metadata();const box={left:Math.round(r.x),top:Math.round(r.y),width:Math.min(Math.floor(r.width),meta.width-Math.round(r.x)),height:Math.min(Math.floor(r.height),meta.height-Math.round(r.y))};const img=await sharp(dir+g.gameId+'.png').extract(box).resize(640,860,{fit:'contain',background:'#eee8dc'}).png().toBuffer();inputs.push({input:img,left:(i%3)*650,top:Math.floor(i/3)*900+35});const label=Buffer.from(`<svg width="640" height="35"><rect width="640" height="35" fill="#eee8dc"/><text x="15" y="25" font-size="22" font-family="PingFang SC" fill="#293746">${page*6+i+1}. ${g.title}</text></svg>`);inputs.push({input:label,left:(i%3)*650,top:Math.floor(i/3)*900});}
 await sharp({create:{width:1950,height:1800,channels:3,background:'#eee8dc'}}).composite(inputs).png().toFile(base+`sheets/first-${page+1}.png`);
}
console.log('Available sheets rendered');
