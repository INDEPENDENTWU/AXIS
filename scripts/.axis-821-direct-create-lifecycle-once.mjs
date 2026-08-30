import fs from 'node:fs';
const FILE='prepare-821-metric-control-system.mjs';
let s=fs.readFileSync(FILE,'utf8');
const once=(from,to,label)=>{const n=s.split(from).length-1;if(n!==1)throw new Error(`${label} expected once, found ${n}`);s=s.replace(from,to)};

once(
 "s=replaceFunction(s,'function loadEditorState()',`function loadEditorState(){",
 "s=replaceFunction(s,'function loadEditorState()',`let axis821EditorRefreshQueued=false;function axis821RefreshCustomEditor(){if(axis821EditorRefreshQueued)return;axis821EditorRefreshQueued=true;queueMicrotask(()=>{axis821EditorRefreshQueued=false;loadEditorState()})}\nfunction loadEditorState(){",
 'canonical editor refresh owner insertion'
);

const mountTail="renderTypeGrid();axis818MetricLoad()}`,'canonical Object editor completed-mount metric hydration');\n";
const mountNext=mountTail+
 " const loadTimerCount=s.split('setTimeout(loadEditorState,40)').length-1;if(loadTimerCount!==3)fail(`legacy custom-editor 40ms lifecycle hooks expected 3, found ${loadTimerCount}`);\n"+
 " s=s.split('setTimeout(loadEditorState,40)').join('axis821RefreshCustomEditor()');\n"+
 " const editorApi=\"window.__AXIS_CUSTOM_EDITOR__.metricSchema=()=>axis818MetricDraft.map(x=>({...x}));\";if((s.split(editorApi).length-1)!==1)fail('canonical custom-editor API anchor missing or duplicated');s=s.replace(editorApi,editorApi+\"window.__AXIS_CUSTOM_EDITOR__.refresh=axis821RefreshCustomEditor;\");\n";
once(mountTail,mountNext,'canonical editor deterministic lifecycle convergence');

const styleBlock="\n{\n const FILE='styles.css';let s=read(FILE),marker='/* AXIS 8.21 Metric Control System */';";
const directBlock=`
{
 const FILE='v873-smart-input.js';let s=read(FILE);
 s=replaceFunction(s,'function axis8124OpenCustomCreate(query)',\`function axis8124OpenCustomCreate(query){const q=String(query||'').trim(),existing=axis8124CustomDefinitions().find(x=>axis8124CustomNorm(x.name)===axis8124CustomNorm(q));if(existing){window.__AXIS_PICK_EQUIPMENT__?.(existing.id,true);window.__AXIS_EQUIPMENT_SEARCH_RESET__?.();return}axis8124PendingCreate={query:q};$('#addCustomEq')?.click();const input=$('#customName');if(input){input.value=q;input.focus();try{input.setSelectionRange(q.length,q.length)}catch{}}axis8124MetricPrepare(null);window.__AXIS_CUSTOM_EDITOR__?.refresh?.()}\`,'Smart Search direct-create canonical editor handoff');
 syntax(s,FILE);write(FILE,s);
}

{
 const FILE='styles.css';let s=read(FILE),marker='/* AXIS 8.21 Metric Control System */';`;
once(styleBlock,directBlock,'direct-create canonical owner block');

once(
 " ['v874-professional.js',['axis818MetricLoad','renderTypeGrid();axis818MetricLoad()']],\n ['styles.css'",
 " ['v874-professional.js',['axis818MetricLoad','renderTypeGrid();axis818MetricLoad()','axis821RefreshCustomEditor','__AXIS_CUSTOM_EDITOR__.refresh=axis821RefreshCustomEditor']],\n ['v873-smart-input.js',['axis8124OpenCustomCreate','__AXIS_CUSTOM_EDITOR__?.refresh?.()']],\n ['styles.css'",
 'source invariant coverage'
);

once(
 "{const v874=read('v874-professional.js');if(v874.includes('setTimeout(axis818MetricLoad,80)'))fail('legacy timed metric-editor hydration still present');if((v874.split('axis818MetricLoad()').length-1)!==2)fail('metric-editor hydrate declaration/canonical mount count drift')}",
 "{const v874=read('v874-professional.js');if(v874.includes('setTimeout(axis818MetricLoad,80)'))fail('legacy timed metric-editor hydration still present');if(v874.includes('setTimeout(loadEditorState,40)'))fail('legacy 40ms custom-editor lifecycle timing still present');if((v874.split('axis818MetricLoad()').length-1)!==2)fail('metric-editor hydrate declaration/canonical mount count drift');if((v874.split('__AXIS_CUSTOM_EDITOR__.refresh=axis821RefreshCustomEditor').length-1)!==1)fail('canonical custom-editor refresh API missing or duplicated')}\n{const v873=read('v873-smart-input.js'),start=v873.indexOf('function axis8124OpenCustomCreate(query)'),end=start<0?-1:v873.indexOf('\\n(function axis8124CustomStyle',start),direct=start>=0&&end>start?v873.slice(start,end):'';if(!direct)fail('canonical direct-create function missing');if(direct.includes('setTimeout('))fail('canonical direct-create still depends on post-open timer');if(!direct.includes('__AXIS_CUSTOM_EDITOR__?.refresh?.()'))fail('canonical direct-create refresh handoff missing');if((v873.split('__AXIS_CUSTOM_EDITOR__?.refresh?.()').length-1)!==1)fail('direct-create canonical refresh handoff duplicated')}",
 'lifecycle verifier upgrade'
);

fs.writeFileSync(FILE,s);
console.log('[AXIS repair] direct-create delegates deterministically to one canonical v874 editor refresh owner');
