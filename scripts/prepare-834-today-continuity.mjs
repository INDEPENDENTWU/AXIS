import fs from 'node:fs';
const path='app.js',style='styles.css';
const read=p=>fs.readFileSync(p,'utf8'),write=(p,s)=>fs.writeFileSync(p,s);
const fail=m=>{throw Error('[AXIS Today continuity] '+m)};
let app=read(path);
const subst=(a,b)=>{
 if(app.split(a).length!==2)fail('exact code owner drift '+a.slice(0,100));
 app=app.replace(a,b);
};
const pure=read('lib/axis-continuity-run.mjs').replace(/^export /gm,'');
const runtime=read('runtime/axis-today-continuity.js');
if(/^\s*(import|export)\s/m.test(pure)||/^\s*(import|export)\s/m.test(runtime))
 fail('Unexpected browser modules in canonical closure');
// Hook after the fully-built 8.32 + strength P2 runtime.
const owner='function axis832StartFlow(id){';
subst(owner,'\n/* AXIS Today → Run → Continue */\n'+pure+'\n'+runtime+'\n'+owner);
subst("if(!p){$('#axisStrengthSheet')?.classList.remove('show');return}",
 "if(!p){if(axisContinuityRenderStage())return;$('#axisStrengthSheet')?.classList.remove('show');return}");
subst("$('#axisStrengthContent').innerHTML=markup;\n const setButton=",
 "$('#axisStrengthContent').innerHTML=markup;\n axisContinuityDecorateStrength(p);\n const setButton=");
subst("  // Do NOT use old saveScan or introduce another Encounter writer.\n  const committed=axis821CommitEncounter(e,eq);",
 "  // Tag only the matching run step. The Encounter owner remains unchanged.\n  axisContinuityTagEvent(e);\n  // Do NOT use old saveScan or introduce another Encounter writer.\n  const committed=axis821CommitEncounter(e,eq);");
subst("  localStorage.removeItem(AXIS_STRENGTH_KEY);\n  axisStrengthRender();render();toast(axisStrengthLabel('success'));",
 "  axisContinuityAfterSaved(e);\n  localStorage.removeItem(AXIS_STRENGTH_KEY);\n  axisStrengthRender();render();toast(axisStrengthLabel('success'));");
if(app.split('function axis821CommitEncounter(e,eq){').length!==2)
 fail('canonical Encounter writer disappeared');
try{new Function(app)}catch(e){fail('assembled runtime syntax '+e.message)}
write(path,app);
let css=read(style);
if(css.includes('AXIS Today / Continuity v1'))fail('duplicate Today styles');
css+='\n'+read('styles/axis-834-continuity.css');
write(style,css);
console.log('[AXIS Today] injected coherent Today → strength run → actual facts → next → same-sheet finish; original Recorder/Flow/Encounter owners remain');
