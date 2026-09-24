import {loadTypeScriptModule} from './lib/load-ts-module.mjs';
import {writeFileSync} from 'node:fs';
const outputIndex=process.argv.indexOf('--output');
const output=outputIndex>=0?process.argv[outputIndex+1]:'specs/029-curriculum-benchmark/authoring/full-answer-audit.json';
if(!output)throw new Error('--output requires a path');
const {explorationSets,authoringSolutions,authoringNotes}=await loadTypeScriptModule('src/curriculum/exploration/index.ts');
const {evaluateActivity}=await loadTypeScriptModule('src/domain/activity-evaluation.ts');
const problems=[],duplicates=[],seen=new Map(),outcomes=[];
for(const group of explorationSets)for(const a of group.rounds){
 const result=evaluateActivity(a,authoringSolutions[a.id]);
 if(!['correct','needsParentObservation'].includes(result.status))problems.push({id:a.id,result});
 const signature=JSON.stringify({family:a.primaryFamilyId,prompt:a.prompt,instruction:a.instruction,clues:a.clues,tokens:a.tokens.map(t=>[t.id,/^(图|方案|搭法|选项)([A-Za-z]|\d+)$/.test(t.label)?'candidate':t.label,t.image.src]).sort(),art:a.illustration?.src,protocol:a.protocol,kind:a.kind,cells:a.cells,graph:a.graph,pieces:a.pieces,target:a.target,steps:a.steps});
 if(seen.has(signature))duplicates.push([seen.get(signature),a.id]);else seen.set(signature,a.id);
 const oracle=authoringNotes[a.id]?.oracle;
 if(oracle){const [x,y,z]=oracle.values;const expected=({identity:()=>x,add:()=>oracle.values.reduce((a,b)=>a+b,0),subtract:()=>x-y,difference:()=>x-y,halfDifference:()=>(x-y)/2,divide:()=>x/y,multiply:()=>x*y,remainder:()=>x%y,overlap:()=>x+y-z,placeValue:()=>x*10+y,perimeter:()=>2*x+2*y,affine:()=>(x+y)*z})[oracle.operation]();if(expected!==oracle.answer)problems.push({id:a.id,oracle,expected});}
 outcomes.push({id:a.id,revision:a.revision,difficulty:a.difficulty,prerequisites:a.prerequisites,family:a.primaryFamilyId,stage:a.stage,kind:a.kind,status:result.status,solution:authoringSolutions[a.id],reason:authoringNotes[a.id]?.reason,oracle:oracle??null});
}
const report={verificationLevel:'authored-solutions-and-surface-duplicates',claimsSourceTaskEquivalence:false,groups:explorationSets.length,activities:outcomes.length,problems,duplicates,outcomes};
writeFileSync(output,JSON.stringify(report,null,2)+'\n');
console.log(JSON.stringify({...report,outcomes:undefined},null,2));
if(problems.length||duplicates.length)process.exitCode=1;
