import fs from 'node:fs';

const FILE='v87-runtime.js';
const fail=m=>{throw new Error(`[AXIS 8.21 Active Home WebKit compat] ${m}`)};
let s=fs.readFileSync(FILE,'utf8');
const once=(from,to,label)=>{const n=s.split(from).length-1;if(n!==1)fail(`${label} expected once, found ${n}`);s=s.replace(from,to)};

/*
 * The inherited Rest Speak panel used the old fixed mini-card's top edge as
 * its viewport anchor. Active Home Stage is now an in-flow Home surface, so on
 * iPhone WebKit that old formula can place the entire fixed learning panel
 * above the viewport. Keep the existing learning panel and action owners; only
 * change its presentation anchor while it is opened from the integrated stage.
 */
once(
 "if(rect){panel.style.bottom=Math.max(12,window.innerHeight-rect.top+8)+'px';panel.style.maxHeight=Math.max(180,Math.floor(rect.top-22))+'px'}",
 "if(rect){const integrated=host?.classList?.contains('axis821ActiveStage');if(integrated){const bottom=Math.max(88,Math.min(112,Math.round(window.innerHeight*.11)));panel.style.bottom=bottom+'px';panel.style.maxHeight=Math.max(260,Math.floor(window.innerHeight-bottom-40))+'px';panel.dataset.axis821StageAnchor='safe-viewport'}else{delete panel.dataset.axis821StageAnchor;panel.style.bottom=Math.max(12,window.innerHeight-rect.top+8)+'px';panel.style.maxHeight=Math.max(180,Math.floor(rect.top-22))+'px'}}",
 'Rest Speak integrated-stage viewport anchor'
);

try{new Function(s)}catch(e){fail(`v87 syntax ${e.message}`)}
fs.writeFileSync(FILE,s);
console.log('[AXIS 8.21 Active Home WebKit compat] PASS · integrated Rest Speak stays inside viewport · inherited learning/action owners unchanged');
