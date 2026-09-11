import fs from 'node:fs';

const FILE='v822-evolution-replay.js';
const fail=m=>{throw new Error(`[AXIS 8.23 Replay Evidence explicit selection] ${m}`)};
let s=fs.readFileSync(FILE,'utf8');
const once=(from,to,label)=>{const n=s.split(from).length-1;if(n!==1)fail(`${label} expected once, found ${n}`);s=s.replace(from,to)};

/*
 * Replay 8.22 deliberately opens at its first factual Encounter while Media
 * Evidence deliberately opens at the latest visual Encounter. AXIS 8.23 must not
 * rewrite either inherited default merely by mounting the Object. The handoff
 * becomes authoritative only after an explicit Replay rail/previous/next action.
 */
once('function renderReplay(key){','function renderReplay(key,emitEvidenceSelection=false){','explicit-selection render parameter');
once("const evidence=$('#v815Evidence',root);root.insertBefore(section,evidence||null);emitSelection(bundle,x);return bundle;","const evidence=$('#v815Evidence',root);root.insertBefore(section,evidence||null);if(emitEvidenceSelection)emitSelection(bundle,x);return bundle;",'mount must not emit selection');
once('selectedIndex=Number(direct.dataset.v822Index)||0;renderReplay(currentKey);return','selectedIndex=Number(direct.dataset.v822Index)||0;renderReplay(currentKey,true);return','direct Replay navigation handoff');
once('selectedIndex+=Number(step.dataset.v822Step)||0;renderReplay(currentKey);return','selectedIndex+=Number(step.dataset.v822Step)||0;renderReplay(currentKey,true);return','step Replay navigation handoff');
once("selectionEvent:'axis:evolution-replay-selection',persistence:false","selectionEvent:'axis:evolution-replay-selection',selectionTrigger:'explicit-replay-navigation',persistence:false",'explicit selection metadata');

for(const token of ['renderReplay(key,emitEvidenceSelection=false)','if(emitEvidenceSelection)emitSelection(bundle,x)','renderReplay(currentKey,true)',"selectionTrigger:'explicit-replay-navigation'"])if(!s.includes(token))fail(`final Replay source missing ${token}`);
try{new Function(s)}catch(e){fail(`Replay syntax ${e.message}`)}
fs.writeFileSync(FILE,s);
console.log('[AXIS 8.23 Replay Evidence explicit selection] PASS · inherited Replay/Evidence defaults preserved on mount · exact Evidence re-anchor begins only on explicit Replay navigation');
