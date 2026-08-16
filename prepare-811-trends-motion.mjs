import fs from 'node:fs';

const FILE='v87-runtime.js';
const fail=m=>{throw new Error(`[AXIS 8.11 trend motion] ${m}`)};
let src=fs.readFileSync(FILE,'utf8');
const end=src.lastIndexOf('})();');
if(end<0||!src.includes('function axis811RenderTrends()'))fail('State Field runtime missing');
const block=String.raw`
/* AXIS 8.11 — State Field motion. One-shot SVG paint only; no timer or observer owner. */
function axis811TrendMotionStyle(){
 if($('#v811TrendMotionStyle'))return;
 const s=D.createElement('style');s.id='v811TrendMotionStyle';s.textContent=
 '@keyframes axis811TraceIn{0%{stroke-dashoffset:180;opacity:.15}100%{stroke-dashoffset:0;opacity:1}}'+
 '@keyframes axis811NodeIn{0%{opacity:0;transform:scale(.72)}100%{opacity:1;transform:scale(1)}}'+
 '@keyframes axis811Halo{0%{opacity:0;transform:scale(.72)}45%{opacity:.8}100%{opacity:.22;transform:scale(1.28)}}'+
 '.v811Trajectory .trail{stroke-dasharray:180;stroke-dashoffset:180;animation:axis811TraceIn .72s cubic-bezier(.22,.72,.18,1) forwards}'+
 '.v811Trajectory .node{transform-box:fill-box;transform-origin:center;animation:axis811NodeIn .34s ease-out both}.v811Trajectory .node:nth-of-type(2n){animation-delay:.05s}.v811Trajectory .node:nth-of-type(3n){animation-delay:.09s}'+
 '.v811Trajectory .halo{transform-box:fill-box;transform-origin:center;animation:axis811Halo .78s cubic-bezier(.2,.72,.2,1) both}'+
 '@media(prefers-reduced-motion:reduce){.v811Trajectory .trail,.v811Trajectory .node,.v811Trajectory .halo{animation:none!important;stroke-dashoffset:0!important}}';
 D.head.appendChild(s)
}
axis811TrendMotionStyle();
try{window.__AXIS_811_TREND_MOTION__={version:'8.11-candidate',oneShot:true,persistentTimer:false,persistentObserver:false,reducedMotion:true}}catch{}
`;
src=src.slice(0,end)+block+'\n'+src.slice(end);
try{new Function(src)}catch(e){fail(`runtime syntax ${e.message}`)}
fs.writeFileSync(FILE,src);
console.log('[AXIS 8.11 trend motion] PASS · one-shot trajectory draw + latest-node pulse · reduced-motion safe');
