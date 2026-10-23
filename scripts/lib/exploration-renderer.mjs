const esc = value => String(value).replaceAll('&', '&amp;').replaceAll('<', '&lt;').replaceAll('>', '&gt;').replaceAll('"', '&quot;');
const same = (a, b) => Math.abs(a - b) < .001;
const distance = (line) => Math.hypot(line.x2 - line.x, line.y2 - line.y);

export function drawingFinish(drawing) {
  const circles = drawing.objects.filter(o => o.kind === 'circle');
  const quantity = circles.length > 0 && circles.every(o => o.r <= 20 && ['#548cb3', '#db675e', '#e8b64e', '#76a784'].includes(o.fill))
    && drawing.objects.every(o => ['circle', 'text'].includes(o.kind) || (o.kind === 'rect' && o.fill === '#fafbf5'));
  const clocks = circles.filter(c => c.r > 35 && c.fill === '#fffdf7'
    && drawing.objects.filter(o => o.kind === 'line' && same(o.x, c.x) && same(o.y, c.y) && distance(o) > c.r * .25).length === 2
    && drawing.objects.filter(o => o.kind === 'text' && /^(?:[1-9]|1[0-2])$/.test(o.text) && Math.hypot(o.x-c.x, o.y-c.y) < c.r * 1.1).length >= 12);
  const phonics = drawing.objects.filter(o => o.kind === 'text' && /^[\u4e00-\u9fff]\s+[a-zāáǎàēéěèīíǐìōóǒòūúǔùüǖǘǚǜ]+$/u.test(o.text));
  const wrapped = drawing.objects.filter(o => o.kind === 'text' && /^[\u4e00-\u9fff]{4,}$/u.test(o.text) && drawing.objects.some(r => r.kind === 'rect' && o.x > r.x && o.x < r.x+r.w && o.y > r.y && o.y < r.y+r.h));
  const facing = drawing.objects.length === 10 && drawing.objects[0].kind === 'polygon' && drawing.objects[0].fill === '#548cb3'
    && drawing.objects[8].kind === 'polygon' && drawing.objects[8].fill === '#40566a'
    && drawing.objects[9].kind === 'circle' && drawing.objects[9].r === 20;
  return {quantity, clocks, phonics, wrapped, facing};
}

function plainObject(o) {
  const stroke='stroke="#344555" stroke-width="2.2" stroke-linejoin="round"';
  switch(o.kind) {
    case 'circle': return `<circle cx="${o.x}" cy="${o.y}" r="${o.r}" fill="${o.fill}" ${stroke}/>`;
    case 'rect': return `<rect x="${o.x}" y="${o.y}" width="${o.w}" height="${o.h}" fill="${o.fill}" ${stroke} ${o.dash?'stroke-dasharray="8 6"':''}/>`;
    case 'line': return `<line x1="${o.x}" y1="${o.y}" x2="${o.x2}" y2="${o.y2}" ${o.color?stroke.replace('#344555',o.color):stroke} ${o.dash?'stroke-dasharray="8 6"':''}/>`;
    case 'polygon': return `<polygon points="${o.points.map(p=>p.join(',')).join(' ')}" fill="${o.fill}" ${stroke}/>`;
    case 'text': return `<text x="${o.x}" y="${o.y}" font-family="PingFang SC,Heiti SC,sans-serif" font-size="${o.size??28}" fill="${o.color??'#253243'}" text-anchor="middle">${esc(o.text)}</text>`;
    default: throw Error(o.kind);
  }
}

/** Finishes presentation only. The authored model, centres, counts and clock endpoints stay intact. */
export function renderExplorationSvg(drawing, {discUris = {}, personUri} = {}) {
  const finish = drawingFinish(drawing);
  let defs = '', prefix = '', suffix = '';
  const handStyles = new Map(), clockTicks = new Map();
  if (finish.quantity) for (const color of new Set(drawing.objects.filter(o=>o.kind==='circle').map(o=>o.fill))) {
    if (!discUris[color]) throw Error('Missing quantity sprite '+color);
    defs += `<symbol id="chip-${color.slice(1)}" viewBox="0 0 256 256"><image href="${discUris[color]}" width="256" height="256"/></symbol>`;
  }
  if (finish.clocks.length) {
    defs += '<linearGradient id="clock-rim" x2="0" y2="1"><stop stop-color="#f3dcaf"/><stop offset=".45" stop-color="#d9b779"/><stop offset="1" stop-color="#be9357"/></linearGradient>';
    for (const c of finish.clocks) {
      const scale=c.r/124;
      prefix += `<circle cx="${c.x}" cy="${c.y}" r="${c.r+10*scale}" fill="url(#clock-rim)" stroke="#c9a66d" stroke-width="${1.5*scale}"/>`;
      const hands=drawing.objects.filter(o=>o.kind==='line'&&same(o.x,c.x)&&same(o.y,c.y)&&distance(o)>c.r*.25).sort((a,b)=>distance(a)-distance(b));
      hands.forEach((hand,index)=>handStyles.set(hand,{width:(index?4.5:7)*scale,color:index?'#447b91':'#4d6052'}));
      drawing.objects.filter(o=>o.kind==='line'&&Math.hypot(o.x-c.x,o.y-c.y)>c.r*.8&&Math.hypot(o.x2-c.x,o.y2-c.y)<c.r*1.03)
        .forEach(tick=>clockTicks.set(tick,{width:(distance(tick)>10*scale?2.7:1.1)*scale,color:'#736b5d'}));
      suffix += `<circle cx="${c.x}" cy="${c.y}" r="${6*scale}" fill="#dbb770" stroke="#9d794b" stroke-width="${1.5*scale}"/>`;
    }
  }
  let body=drawing.objects.map((o,index)=>{
    if(finish.facing && index < 8) {
      if(index!==0)return '';
      if(!personUri)throw Error('Missing facing-person sprite');
      const arrow=drawing.objects[8],tip=arrow.points[4],angle=Math.atan2(tip[0]-160,160-tip[1])*180/Math.PI;
      return `<image data-role="facing-person" href="${personUri}" x="109" y="104" width="102" height="112" transform="rotate(${angle} 160 160)"/>`;
    }
    if(finish.quantity && o.kind==='circle') return `<use data-quantity-dot="true" href="#chip-${o.fill.slice(1)}" x="${o.x-o.r}" y="${o.y-o.r}" width="${o.r*2}" height="${o.r*2}"/>`;
    const style=handStyles.get(o)??clockTicks.get(o);
    if(style)return `<line data-role="${handStyles.has(o)?'clock-hand':'clock-tick'}" x1="${o.x}" y1="${o.y}" x2="${o.x2}" y2="${o.y2}" stroke="${style.color}" stroke-width="${style.width}" stroke-linecap="round"/>`;
    if(finish.phonics.includes(o)) {
      const cell=drawing.objects.find(r=>r.kind==='rect'&&o.x>r.x&&o.x<r.x+r.w&&o.y>r.y&&o.y<r.y+r.h);
      if(cell){const [han,pinyin]=o.text.split(/\s+/);return `<g data-role="phonics-pair"><text x="${o.x}" y="${cell.y+cell.h*.4}" text-anchor="middle" fill="#253243" font-family="PingFang SC,Heiti SC,sans-serif" font-size="${cell.h*.37}">${esc(han)}</text><text x="${o.x}" y="${cell.y+cell.h*.78}" text-anchor="middle" fill="#426b7d" font-family="PingFang SC,Heiti SC,sans-serif" font-size="${cell.h*.28}">${esc(pinyin)}</text></g>`;}
    }
    if(finish.wrapped.includes(o)) {
      const cell=drawing.objects.find(r=>r.kind==='rect'&&o.x>r.x&&o.x<r.x+r.w&&o.y>r.y&&o.y<r.y+r.h);
      let size=Math.min(24,o.size??28), columns, rows;
      do {columns=Math.max(1,Math.floor((cell.w-12)/size));rows=Math.ceil(Array.from(o.text).length/columns);if(rows*size*1.2<=cell.h-12)break;size-=1;} while(size>12);
      const chars=Array.from(o.text),firstY=cell.y+cell.h/2-(rows-1)*size*.6+size*.35;
      return `<text data-role="wrapped-cell-label" text-anchor="middle" fill="#253243" font-family="PingFang SC,Heiti SC,sans-serif" font-size="${size}">${Array.from({length:rows},(_,line)=>`<tspan x="${o.x}" y="${firstY+line*size*1.2}">${esc(chars.slice(line*columns,(line+1)*columns).join(''))}</tspan>`).join('')}</text>`;
    }
    return plainObject(o);
  }).join('');
  let viewBox=`0 0 ${drawing.width} ${drawing.height}`;
  // For a standalone quantity card, blank canvas has no task meaning. Tighten
  // it uniformly so two or three chips remain readable in a small matching card.
  // Comparisons, labels, grids and spatial evidence keep the authored viewport.
  if(finish.quantity && drawing.objects.every(o=>o.kind==='circle')) {
    const xs=drawing.objects.flatMap(o=>[o.x-o.r,o.x+o.r]),ys=drawing.objects.flatMap(o=>[o.y-o.r,o.y+o.r]);
    const left=Math.min(...xs),right=Math.max(...xs),top=Math.min(...ys),bottom=Math.max(...ys);
    const margin=Math.max(18,...drawing.objects.map(o=>o.r*1.2)),side=Math.max(right-left,bottom-top)+margin*2;
    viewBox=`${(left+right-side)/2} ${(top+bottom-side)/2} ${side} ${side}`;
  }
  if(finish.facing) {
    const arrow=drawing.objects[8],ball=drawing.objects[9],tip=arrow.points[4],angle=Math.atan2(tip[0]-160,160-tip[1]);
    const corners=[[-51,-56],[51,-56],[51,56],[-51,56]].map(([x,y])=>[160+x*Math.cos(angle)-y*Math.sin(angle),160+x*Math.sin(angle)+y*Math.cos(angle)]);
    const points=[...corners,...arrow.points,[ball.x-ball.r,ball.y-ball.r],[ball.x+ball.r,ball.y+ball.r]];
    const xs=points.map(p=>p[0]),ys=points.map(p=>p[1]),left=Math.min(...xs),right=Math.max(...xs),top=Math.min(...ys),bottom=Math.max(...ys),side=Math.max(right-left,bottom-top)+36;
    viewBox=[(left+right-side)/2,(top+bottom-side)/2,side,side].map(n=>Math.round(n*10000)/10000).join(' ');
  }
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${drawing.width}" height="${drawing.height}" viewBox="${viewBox}"><rect width="100%" height="100%" fill="#fffdf7"/>${defs?`<defs>${defs}</defs>`:''}${prefix}${body}${suffix}</svg>`;
}
