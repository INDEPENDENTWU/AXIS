import fs from 'node:fs';
const read=p=>fs.readFileSync(p,'utf8');
const write=(p,v)=>fs.writeFileSync(p,v);
let app=read('app.js'),css=read('styles.css');
const fail=s=>{throw Error('[AXIS strength P2 integration] '+s)};
const anchor='function axis832StartObject(id){';
if(app.split(anchor).length!==2)fail('Object entry owner drift');
const pure=read('lib/axis-live-strength.mjs').replace(/^export /gm,'');
const frontend=read('runtime/axis-live-strength.js');
if(/^\s*(export|import)\s/m.test(pure)||/^\s*(export|import)\s/m.test(frontend))fail('Unexpected browser module imports');
const hook="const strengthEq=axis831ExactFlowEq(id);if(strengthEq?.type==='strength')return axisLiveStrengthStart(id);";
app=app.replace(anchor,anchor+hook);
const marker='function axis832StartFlow(id){';
if(app.split(marker).length!==2)fail('Flow owner boundary drift');
const addition='\n/* AXIS PLAY THIS strength: separate prospective run, one existing canonical fact writer */\n'+pure+'\n'+frontend+'\n';
app=app.replace(marker,addition+marker);
// Existing Flow cannot silently replace this Object while live.
app=app.replace(marker,marker+"if(axisStrengthRead()){toast(axisStrengthLabel('conflict'));return false;}");
const canonical='function axis821CommitEncounter(e,eq){';
if(app.split(canonical).length!==2)fail('Canonical writer must exist exactly once');
if(app.split('axis821FlowAfterCanonicalCommit(e,intent)').length<2)fail('Canonical post-commit callback missing');
if(app.includes('AXIS_STRENGTH_KEY')!==true)fail('Strength runtime injection absent');
// Keep the original legacy summary for old facts, while making this event's
// final-set summary explicit (full actual-set list stays in e.playThis).
const summary='function eventMeta(e){';
if(app.split(summary).length!==2)fail('Original event summary owner missing');
app=app.replace(summary,summary+"if(e?.playThis?.actualSets?.length){const a=e.playThis.actualSets,last=a[a.length-1];return a.length+'组 · 最后一组 '+numFmt(last.weight)+'kg × '+last.reps+'次'}");
try{new Function(app)}catch(e){fail('Final runtime JS syntax: '+e.message)}
write('app.js',app);
const id='/* AXIS PLAY THIS Strength · scoped, semantic surfaces';
if(css.includes(id))fail('Strength styles duplicated');
css+='\n'+read('styles/axis-833-live-strength.css');
write('styles.css',css);
console.log('[AXIS strength P2] PASS · strength uses direct live execution and in-place canonical commit; retrospective Quick Record and Flow retained');
