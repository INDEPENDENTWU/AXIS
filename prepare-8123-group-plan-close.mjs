import fs from 'node:fs';

const FILE='v8712-runtime.js';
const fail=m=>{throw new Error(`[AXIS 8.12.3 Group Plan close] ${m}`)};
let src=fs.readFileSync(FILE,'utf8');
if(src.includes('__AXIS_8123_GROUP_PLAN_CLOSE__'))fail('close guard already installed');

const old="if(e.target.closest('#v8712Apply')){applyPlan();return}";
const next="if(e.target.closest('#v8712Apply')){Promise.resolve(applyPlan()).finally(()=>$('#v875PlanSheet')?.classList.remove('show'));return}";
const n=src.split(old).length-1;if(n!==1)fail(`apply click boundary expected once, found ${n}`);
src=src.replace(old,next);

const end=src.lastIndexOf('})();');if(end<0)fail('runtime IIFE end missing');
src=src.slice(0,end)+"try{window.__AXIS_8123_GROUP_PLAN_CLOSE__={version:'8.12.3',owner:'v8712-apply-finalizer',afterApply:true,changesPlanLogic:false}}catch{}\n"+src.slice(end);
for(const needle of ['__AXIS_8123_GROUP_PLAN_CLOSE__',"Promise.resolve(applyPlan()).finally", "$('#v875PlanSheet')?.classList.remove('show')"])if(!src.includes(needle))fail(`missing ${needle}`);
try{new Function(src)}catch(e){fail(`v8712 syntax ${e.message}`)}
fs.writeFileSync(FILE,src);
console.log('[AXIS 8.12.3 Group Plan close] PASS · successful or completed apply always releases the planner overlay without changing plan calculation or recording ownership');
