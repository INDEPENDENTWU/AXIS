import fs from 'node:fs';

const FILE='v873-smart-input.js';
const fail=m=>{throw new Error(`[AXIS 8.12.4 custom profile persistence] ${m}`)};
let src=fs.readFileSync(FILE,'utf8');
if(!src.includes('__AXIS_8124_CUSTOM_SAFE__'))fail('safe custom extension must run first');
const head="const AXIS8124_CUSTOM_CORE='axis_v60_state',AXIS8124_CUSTOM_METRICS=['weight','reps','duration','intensity','level'];";
const headNext="const AXIS8124_CUSTOM_CORE='axis_v60_state',AXIS8124_CUSTOM_PROFILE='axis_v8124_custom_profiles',AXIS8124_CUSTOM_METRICS=['weight','reps','duration','intensity','level'];";
const defs="function axis8124CustomDefinitions(){const c=axis8124CustomRead();return Array.isArray(c.profile?.customEq)?c.profile.customEq:[]}";
const defsNext="function axis8124CustomProfileRead(){try{return JSON.parse(localStorage.getItem(AXIS8124_CUSTOM_PROFILE)||'null')||{version:1,items:{}}}catch{return{version:1,items:{}}}}\nfunction axis8124CustomProfileSet(id,metrics){if(!id)return;const p=axis8124CustomProfileRead();p.version=1;p.items=p.items||{};p.items[id]={version:1,metrics:[...new Set((metrics||[]).filter(x=>AXIS8124_CUSTOM_METRICS.includes(x)))]};try{localStorage.setItem(AXIS8124_CUSTOM_PROFILE,JSON.stringify(p))}catch{}}\nfunction axis8124CustomDefinitions(){const c=axis8124CustomRead(),p=axis8124CustomProfileRead().items||{},list=Array.isArray(c.profile?.customEq)?c.profile.customEq:[];return list.map(x=>({...x,recording:p[x.id]||x.recording||null}))}";
const save="item.recording={version:1,metrics:[...new Set(metrics)]};item.custom=true;axis8124CustomWrite(c);";
const saveNext="axis8124CustomProfileSet(item.id,metrics);item.recording={version:1,metrics:[...new Set(metrics)]};item.custom=true;axis8124CustomWrite(c);";
for(const [from,label] of [[head,'profile storage head'],[defs,'custom definition projection'],[save,'custom save persistence']])if(src.split(from).length-1!==1)fail(`${label} boundary missing`);
src=src.replace(head,headNext).replace(defs,defsNext).replace(save,saveNext);
try{new Function(src)}catch(e){fail(`runtime syntax ${e.message}`)}
fs.writeFileSync(FILE,src);
console.log('[AXIS 8.12.4 custom profile persistence] PASS · profile metadata survives every legacy axis_v60_state save while core identity remains canonical');
