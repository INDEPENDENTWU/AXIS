import fs from 'node:fs';

const FILE='v87-runtime.js';
const fail=m=>{throw new Error(`[AXIS 8.13 settings owner seal] ${m}`)};
let src=fs.readFileSync(FILE,'utf8');
if(!src.includes('canonical-settings-inline'))fail('settings convergence must run first');
const end=src.lastIndexOf('})();');
if(end<0)fail('runtime IIFE end not found');

const block=String.raw`
/* AXIS 8.13 — final Settings entry single-owner seal. */
function axis813KeepUniqueSettingEntry(id,gateId){
 const nodes=[...D.querySelectorAll('#'+id)],gate=$('#'+gateId);
 const keep=gate?.querySelector(':scope > #'+id)||nodes.find(n=>$('#settingsSheet')?.contains(n))||nodes[0]||null;
 for(const node of nodes)if(node!==keep)node.remove();
 if(keep)keep.dataset.axisSettingsOwner='v813-inline';
 return keep
}
function axis813SealSettingEntryOwners(){
 const learning=axis813KeepUniqueSettingEntry('v810ConfigEntry','v813LearningGate');
 const service=axis813KeepUniqueSettingEntry('v811ServiceEntry','v813ServiceGate');
 const state={learningEntryCount:D.querySelectorAll('#v810ConfigEntry').length,serviceEntryCount:D.querySelectorAll('#v811ServiceEntry').length};
 if(window.__AXIS_813_SETTINGS__)Object.assign(window.__AXIS_813_SETTINGS__,{singleLearningEntry:state.learningEntryCount===1,singleServiceEntry:state.serviceEntryCount===1});
 return {learning,service,...state}
}
const axis813ConvergeSettingsBeforeOwnerSeal=axis813ConvergeSettings;
axis813ConvergeSettings=function(){const result=axis813ConvergeSettingsBeforeOwnerSeal();axis813SealSettingEntryOwners();return result};
const axis813RenderLearningBeforeOwnerSeal=axis810RenderSettings;
axis810RenderSettings=function(){const result=axis813RenderLearningBeforeOwnerSeal();axis813SealSettingEntryOwners();return result};
axis813SealSettingEntryOwners();
`;

src=src.slice(0,end)+block+'\n'+src.slice(end);
try{new Function(src)}catch(e){fail(`runtime syntax ${e.message}`)}
fs.writeFileSync(FILE,src);
console.log('[AXIS 8.13 settings owner seal] PASS · one Learning entry · one Cloud/AI entry · canonical inline gates win over legacy remounts');
