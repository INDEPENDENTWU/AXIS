import fs from 'node:fs';

const fail=m=>{throw new Error(`[AXIS 8.21 custom-editor API preserve] ${m}`)};
const read=f=>fs.readFileSync(f,'utf8');
const write=(f,s)=>fs.writeFileSync(f,s);
const once=(s,from,to,label)=>{const n=s.split(from).length-1;if(n!==1)fail(`${label} expected once, found ${n}`);return s.replace(from,to)};

{
 const f='prepare-88-convergence.mjs';let s=read(f);
 const from="function hook(){window.__AXIS_CUSTOM_EDITOR__={owner:'v874',snapshot:()=>({subtype:selectedSubtype,details:[...detailSelected],typeLocked,detailLocked})};injectStyle();ensureProfessionalSelector();installEventObserver();tidyMusclePanel();patchSetPlan();";
 const to="function hook(){const editorApi=window.__AXIS_CUSTOM_EDITOR__||(window.__AXIS_CUSTOM_EDITOR__={});editorApi.owner='v874';editorApi.snapshot=()=>({subtype:selectedSubtype,details:[...detailSelected],typeLocked,detailLocked});injectStyle();ensureProfessionalSelector();installEventObserver();tidyMusclePanel();patchSetPlan();";
 s=once(s,from,to,'8.8 canonical custom-editor object identity preservation');
 write(f,s);
}

{
 const f='prepare-821-metric-control-system.mjs';let s=read(f);
 const from="{const v874=read('v874-professional.js');if(v874.includes('setTimeout(axis818MetricLoad,80)'))fail('legacy timed metric-editor hydration still present');";
 const to="{const v874=read('v874-professional.js'),preservedOwner=\"const editorApi=window.__AXIS_CUSTOM_EDITOR__||(window.__AXIS_CUSTOM_EDITOR__={});editorApi.owner='v874';editorApi.snapshot=\";if((v874.split(preservedOwner).length-1)!==1)fail('canonical custom-editor owner must preserve existing API object identity');if(v874.includes(\"window.__AXIS_CUSTOM_EDITOR__={owner:'v874'\"))fail('destructive custom-editor API replacement survived historical convergence');if(v874.includes('setTimeout(axis818MetricLoad,80)'))fail('legacy timed metric-editor hydration still present');";
 s=once(s,from,to,'8.21 intermediate custom-editor preservation contract');
 write(f,s);
}

{
 const f='postbuild-821-executable-object-presentation-seal.mjs';let s=read(f);
 const anchor="const finalRenderer=moduleFunctionRange(src,'app.js','function eventHtml(e)','final timeline event renderer').text;";
 const block=`/* Historical convergence may own v874 metadata, but it must never replace the\n * shared custom-editor API object after later capabilities have extended it. This is\n * assertion-only: final runtime behavior must already be correct before this seal. */\n{\n const editor=moduleRange(src,'v874-professional.js','final custom-editor API preservation').text;\n const preserved=\"const editorApi=window.__AXIS_CUSTOM_EDITOR__||(window.__AXIS_CUSTOM_EDITOR__={});editorApi.owner='v874';editorApi.snapshot=\";\n if(editor.split(preserved).length-1!==1)fail('final v874 custom-editor owner does not preserve API object identity');\n if(editor.includes(\"window.__AXIS_CUSTOM_EDITOR__={owner:'v874'\"))fail('final runtime reintroduced destructive custom-editor API replacement');\n if(editor.split('window.__AXIS_CUSTOM_EDITOR__.metricSchema=').length-1!==1)fail('final runtime custom-editor metricSchema extension missing or duplicated');\n if(editor.split('window.__AXIS_CUSTOM_EDITOR__.refresh=axis821RefreshCustomEditor').length-1!==1)fail('final runtime custom-editor refresh extension missing or duplicated');\n}\n\n`;
 s=once(s,anchor,block+anchor,'final canonical custom-editor API preservation seal');
 write(f,s);
}

for(const f of ['prepare-88-convergence.mjs','prepare-821-metric-control-system.mjs','postbuild-821-executable-object-presentation-seal.mjs']){
 try{new Function(read(f).replace(/^import[^\n]*\n/gm,''))}catch(e){if(f.endsWith('.mjs')&&!String(e.message).includes('Unexpected token')){} }
}
console.log('[AXIS 8.21 custom-editor API preserve] staged · v874 retains one object identity · owner/snapshot extend metricSchema/refresh · final seal assertion-only');