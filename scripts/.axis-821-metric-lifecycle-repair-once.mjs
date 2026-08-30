import fs from 'node:fs';

const FILE='prepare-821-metric-control-system.mjs';
let s=fs.readFileSync(FILE,'utf8');
const old=`/* v874 remains the sole Object schema editor. Every supported create/edit entry
 * must hydrate that same editor; Smart Search direct-create is not a second owner. */
{
 const FILE='v874-professional.js';let s=read(FILE);
 const from="if(e.target.closest('#addCustomEq,#v8New,#newCustomEq,[data-edit-eq]'))setTimeout(axis818MetricLoad,80);";
 const to="if(e.target.closest('#addCustomEq,#v8New,#newCustomEq,[data-edit-eq],[data-axis-create-custom]'))setTimeout(axis818MetricLoad,80);";
 s=once(s,from,to,'direct Object create metric-editor hydration');
 syntax(s,FILE);write(FILE,s);
}`;
const next=`/* v874 remains the sole Object schema editor. Metric-schema hydration belongs to
 * the completed canonical editor mount, not to a click selector or timing guess. */
{
 const FILE='v874-professional.js';let s=read(FILE);
 const timed="if(e.target.closest('#addCustomEq,#v8New,#newCustomEq,[data-edit-eq]'))setTimeout(axis818MetricLoad,80);";
 const timed821="if(e.target.closest('#addCustomEq,#v8New,#newCustomEq,[data-edit-eq],[data-axis-create-custom]'))setTimeout(axis818MetricLoad,80);";
 const timedCount=(s.split(timed).length-1)+(s.split(timed821).length-1);if(timedCount!==1)fail('legacy metric-editor timing hook missing or duplicated');
 s=s.replace(s.includes(timed821)?timed821:timed,'');
 s=replaceFunction(s,'function loadEditorState()',\`function loadEditorState(){ensureProfessionalSelector();const name=$('#customName')?.value.trim()||'',c=readCore(),eq=editId?(c.profile?.customEq||[]).find(x=>x.id===editId):(c.profile?.customEq||[]).find(x=>x.name===name);detailLocked=!!eq;typeLocked=!!eq;selectedSubtype=eq?.subtype||inferSubtype(name,eq?.type||typeFromHidden());const ds=eq?.detailMuscles?.length?eq.detailMuscles:inferDetails(name);setDetails(ds,false);if(!detailSelected.size){const cores=$$('#customMuscles .active').map(b=>b.dataset.muscle);setDetails(cores.flatMap(x=>CORE_DEFAULT[x]||[]),false)}renderTypeGrid();axis818MetricLoad()}\`,'canonical Object editor completed-mount metric hydration');
 if((s.split('axis818MetricLoad()').length-1)!==2)fail('metric hydrate must have one declaration and one canonical mount call');
 syntax(s,FILE);write(FILE,s);
}`;
const n=s.split(old).length-1;
if(n!==1)throw new Error(`expected old lifecycle block once, found ${n}`);
s=s.replace(old,next);
fs.writeFileSync(FILE,s);
console.log('[AXIS repair] metric editor hydration moved to canonical completed mount');
