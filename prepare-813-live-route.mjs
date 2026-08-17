import fs from 'node:fs';

const fail=m=>{throw new Error(`[AXIS 8.13 live route prepare] ${m}`)};
const read=f=>{if(!fs.existsSync(f))fail(`missing ${f}`);return fs.readFileSync(f,'utf8')};
const write=(f,s)=>fs.writeFileSync(f,s);
const stripExports=src=>src.replace(/^export\s+/gm,'');
const syntax=(src,label)=>{try{new Function(src)}catch(e){fail(`${label} syntax ${e.message}`)}};

const runtimeSource=stripExports(read('runtime/axis-runtime.mjs'));
const adapterSource=stripExports(read('runtime/compat/axis-812-adapter.mjs'));
const presenter=read('runtime/browser/axis-live-route-presenter.js');

for(const [name,source] of [['runtime',runtimeSource],['adapter',adapterSource]]){
 if(/\b(window|document|localStorage|sessionStorage|indexedDB|fetch|XMLHttpRequest|navigator|MutationObserver)\b/.test(source))fail(`${name} gained browser/storage/network ownership`)
}
if(/localStorage\.setItem|sessionStorage\.setItem|indexedDB|\bfetch\s*\(|XMLHttpRequest|WebSocket|EventSource/.test(presenter))fail('presenter gained persistent/network ownership');
for(const selector of ['#v87Primary','#v87Toggle','#v87Finish'])if(presenter.includes(`closest('${selector}`)||presenter.includes(`onclick`)&&presenter.includes(selector))fail(`presenter gained training control route ${selector}`);

const runtimeModule=`const AxisRuntime=(()=>{'use strict';\n${runtimeSource}\nreturn{AXIS_RUNTIME_SCHEMA,normalizeRuntimeInput,projectWorkout};\n})();`;
const adapterModule=`const Axis812Adapter=(()=>{'use strict';\n${adapterSource}\nreturn{AXIS_812_ADAPTER_SCHEMA,adaptAxis812Snapshot};\n})();`;
const generated=`(()=>{'use strict';\n/* AXIS 8.13 Stage 3 — generated pure Runtime + read-only Live Route presentation */\n${runtimeModule}\n${adapterModule}\n${presenter}\n})();\n`;
syntax(generated,'generated v813-live-route.js');
write('v813-live-route.js',generated);

const STYLE_MARK='/* AXIS 8.13 Stage 3 — Live Route */';
let styles=read('styles.css');
if(!styles.includes(STYLE_MARK))styles+=`\n${STYLE_MARK}\n.axis813Route{margin-top:30px}.axis813RouteHead{min-height:28px}.axis813RouteHead>b{font-size:15px!important;font-weight:680!important}.axis813RouteHead>span{font-size:11.5px!important;font-variant-numeric:tabular-nums}.axis813RouteBody{margin-top:8px;border-top:1px solid var(--line2);border-bottom:1px solid var(--line2)}.axis813RouteLead{min-height:72px;display:grid;grid-template-columns:30px minmax(0,1fr);gap:10px;align-items:center}.axis813RouteIndex,.axis813RouteTrail>div>span{font-size:9.5px;color:var(--dim);font-variant-numeric:tabular-nums;letter-spacing:.04em}.axis813RouteLead strong{display:block;font-size:16px;font-weight:670;letter-spacing:-.015em}.axis813RouteLead small{display:block;margin-top:5px;font-size:11.5px;color:var(--muted)}.axis813RouteTrail{border-top:1px solid var(--line2)}.axis813RouteTrail>div{min-height:48px;display:grid;grid-template-columns:30px minmax(0,1fr) auto;gap:10px;align-items:center}.axis813RouteTrail>div+div{border-top:1px solid rgba(255,255,255,.035)}.axis813RouteTrail b{min-width:0;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;font-size:12.5px;font-weight:620}.axis813RouteTrail small{font-size:10.5px;color:var(--dim);white-space:nowrap}.axis813RouteAlt{min-height:44px;border-top:1px solid var(--line2);display:grid;grid-template-columns:42px minmax(0,1fr) auto;gap:9px;align-items:center}.axis813RouteAlt>span{font-size:10px;color:var(--dim)}.axis813RouteAlt>b{min-width:0;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;font-size:11.5px;font-weight:610;color:var(--muted)}.axis813RouteAlt>small{font-size:10px;color:var(--dim);white-space:nowrap}@media(max-width:380px){.axis813RouteTrail>div,.axis813RouteAlt{grid-template-columns:26px minmax(0,1fr)}.axis813RouteTrail small,.axis813RouteAlt small{grid-column:2;justify-self:start;margin-top:-7px;padding-bottom:8px}.axis813RouteAlt{grid-template-columns:38px minmax(0,1fr)}}\n`;
write('styles.css',styles);

console.log('[AXIS 8.13 live route prepare] PASS · pure Runtime source reused · one read-only presenter · static route CSS · zero training/storage/network ownership');
