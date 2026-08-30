import fs from 'node:fs';
const FILE='prepare-821-metric-control-system.mjs';
let s=fs.readFileSync(FILE,'utf8');
const once=(from,to,label)=>{const n=s.split(from).length-1;if(n!==1)throw new Error(`${label} expected once, found ${n}`);s=s.replace(from,to)};

const apiLine=` const editorApi="window.__AXIS_CUSTOM_EDITOR__.metricSchema=()=>axis818MetricDraft.map(x=>({...x}));";if((s.split(editorApi).length-1)!==1)fail('canonical custom-editor API anchor missing or duplicated');s=s.replace(editorApi,editorApi+"window.__AXIS_CUSTOM_EDITOR__.refresh=axis821RefreshCustomEditor;");\n`;
const apiNext=apiLine+` const hookBoundary="function hook(){";if((s.split(hookBoundary).length-1)!==1)fail('canonical v874 hook boundary missing or duplicated');s=s.replace(hookBoundary,hookBoundary+"if($('#customEqSheet')?.classList.contains('show'))axis821RefreshCustomEditor();");\n`;
once(apiLine,apiNext,'v874 late-ready open-sheet catch-up');

once(
 ` ['v874-professional.js',['axis818MetricLoad','renderTypeGrid();axis818MetricLoad()','axis821RefreshCustomEditor','__AXIS_CUSTOM_EDITOR__.refresh=axis821RefreshCustomEditor']],`,
 ` ['v874-professional.js',['axis818MetricLoad','renderTypeGrid();axis818MetricLoad()','axis821RefreshCustomEditor','__AXIS_CUSTOM_EDITOR__.refresh=axis821RefreshCustomEditor',"if($('#customEqSheet')?.classList.contains('show'))axis821RefreshCustomEditor()"]],`,
 'v874 source invariant coverage'
);

once(
 `{const v874=read('v874-professional.js');if(v874.includes('setTimeout(axis818MetricLoad,80)'))fail('legacy timed metric-editor hydration still present');if(v874.includes('setTimeout(loadEditorState,40)'))fail('legacy 40ms custom-editor lifecycle timing still present');if((v874.split('axis818MetricLoad()').length-1)!==2)fail('metric-editor hydrate declaration/canonical mount count drift');if((v874.split('__AXIS_CUSTOM_EDITOR__.refresh=axis821RefreshCustomEditor').length-1)!==1)fail('canonical custom-editor refresh API missing or duplicated')}`,
 `{const v874=read('v874-professional.js');if(v874.includes('setTimeout(axis818MetricLoad,80)'))fail('legacy timed metric-editor hydration still present');if(v874.includes('setTimeout(loadEditorState,40)'))fail('legacy 40ms custom-editor lifecycle timing still present');if((v874.split('axis818MetricLoad()').length-1)!==2)fail('metric-editor hydrate declaration/canonical mount count drift');if((v874.split('__AXIS_CUSTOM_EDITOR__.refresh=axis821RefreshCustomEditor').length-1)!==1)fail('canonical custom-editor refresh API missing or duplicated');if((v874.split("if($('#customEqSheet')?.classList.contains('show'))axis821RefreshCustomEditor()").length-1)!==1)fail('late-ready open-sheet catch-up missing or duplicated')}`,
 'late-ready verifier'
);

fs.writeFileSync(FILE,s);
console.log('[AXIS repair] v874 boot catches up any custom sheet opened before editor API readiness');
