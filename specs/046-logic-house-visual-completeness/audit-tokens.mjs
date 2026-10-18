import ts from 'typescript';
import {readFileSync,writeFileSync} from 'node:fs';
import {loadGameData} from '../../scripts/lib/load-game-data.mjs';
import {loadTypeScriptModule} from '../../scripts/lib/load-ts-module.mjs';
const source=ts.createSourceFile('tokens.tsx',readFileSync('src/components/VisualToken.tsx','utf8'),ts.ScriptTarget.Latest,true,ts.ScriptKind.TSX);
const names=new Set(['tokenMap','phraseMap','clueRules','compoundParts','visualMetaFor','visualParts','rasterForKind']);
const nodes=source.statements.filter(n=>ts.isFunctionDeclaration(n)?names.has(n.name?.text):ts.isVariableStatement(n)&&n.declarationList.declarations.some(d=>names.has(d.name.getText(source))));
const code=ts.transpileModule(nodes.map(n=>n.getText(source)).join('\n'),{compilerOptions:{target:ts.ScriptTarget.ES2020,module:ts.ModuleKind.ES2020}}).outputText.replace(/^export /gm,'');
const{imageGallery}=await loadTypeScriptModule('src/data/imageGallery.ts');
const{visualMetaFor,visualParts,rasterForKind}=new Function('imageGallery',code+'\nreturn {visualMetaFor,visualParts,rasterForKind};')(imageGallery);
const{games}=await loadGameData();
const rows=games.filter(g=>g.world==='logic').map(g=>({id:g.id,title:g.title,rounds:g.rounds.map(r=>{const values=[...(r.sequence??[]),...(r.visualGroups??[]).flatMap(x=>x.items),...(r.grid?.cells??[]).flat(),...(r.matrix?.cells??[]).flat(),...(r.memory?.items??[]),...r.choices.map(c=>c.label)];return {id:r.id,prompt:r.prompt,values:[...new Set(values)].filter(Boolean).map(value=>{const meta=visualMetaFor(value);const parts=visualParts(value).map(visualMetaFor);return{value,kind:meta?.kind??null,raster:meta?rasterForKind(meta.kind)?.src??null:null,composite:parts.length>1&&parts.length<=6&&parts.every(Boolean),numeric:/^\d+$/.test(value)};})};})}));
writeFileSync('specs/046-logic-house-visual-completeness/verification/token-audit.json',JSON.stringify(rows,null,2)+'\n');
for(const g of rows){const values=g.rounds.flatMap(r=>r.values);console.log(g.title,JSON.stringify({text:[...new Set(values.filter(v=>!v.kind&&!v.composite&&!v.numeric).map(v=>v.value))],svg:[...new Set(values.filter(v=>v.kind&&!v.raster).map(v=>v.kind))]}));}
