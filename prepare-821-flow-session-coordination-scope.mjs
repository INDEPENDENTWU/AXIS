import fs from 'node:fs';

const FILE='app.js';
const fail=m=>{throw new Error(`[AXIS 8.21 Flow Session coordination scope] ${m}`)};
if(!fs.existsSync(FILE))fail(`missing ${FILE}`);
let s=fs.readFileSync(FILE,'utf8');

/*
 * The coordination pass publishes an additive v82 `axis:active-started` event.
 * Its consumer uses private Flow helpers and therefore must live in the same app
 * lexical region as those helpers. A global tail listener compiles but fails at
 * runtime after canonical concatenation. Relocate it beside the private Flow
 * helper block instead of exporting private state or weakening the lifecycle.
 */
const listener="window.addEventListener('axis:active-started',e=>axis821FlowOnActiveStarted(e?.detail));";
const hits=s.split(listener).length-1;
if(hits!==1)fail(`active-started listener expected once, found ${hits}`);
s=s.replace(listener,'');

const helper='function axis821FlowOnActiveStarted(detail)';
const anchor='function axis821BeginCurrentItem()';
const helperAt=s.indexOf(helper),anchorAt=s.indexOf(anchor);
if(helperAt<0)fail('private active-started helper missing');
if(anchorAt<0)fail('Flow begin-current anchor missing');
if(helperAt>=anchorAt)fail('private active-started helper is outside Flow item lexical region');
s=s.slice(0,anchorAt)+listener+'\n'+s.slice(anchorAt);

const newListenerAt=s.indexOf(listener),newAnchorAt=s.indexOf(anchor);
if(!(helperAt<newListenerAt&&newListenerAt<newAnchorAt))fail('active-started listener was not co-located with private helper');
if((s.split(listener).length-1)!==1)fail('active-started listener duplication after relocation');
if(s.includes('window.axis821FlowOnActiveStarted=')||s.includes("window['axis821FlowOnActiveStarted']"))fail('private Flow helper must not be exported');
if((s.match(/state\.active\.events\.push\(/g)||[]).length!==1)fail('Encounter append ownership drift');

const marker="expectedDurationPlanning:true,flowActiveProjection:true";
if(!s.includes(marker))fail('Flow Session coordination capability marker missing');
s=s.replace(marker,"expectedDurationPlanning:true,flowActiveProjection:true,bootScopedActiveStarted:true");

try{new Function(s)}catch(e){fail(`app syntax ${e.message}`)}
fs.writeFileSync(FILE,s);
console.log('[AXIS 8.21 Flow Session coordination scope] PASS · active-started consumer shares private Flow lexical region · no private export · one Encounter append');
