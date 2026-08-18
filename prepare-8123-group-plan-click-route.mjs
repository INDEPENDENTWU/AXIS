import fs from 'node:fs';

const fail=m=>{throw new Error(`[AXIS 8.12.3 Group Plan click route] ${m}`)};
const once=(src,from,to,label)=>{const n=src.split(from).length-1;if(n!==1)fail(`${label} expected once, found ${n}`);return src.replace(from,to)};

/* Existing set-bridge remains the planner owner; expose only its opener. */
{
 const FILE='v874-set-bridge.js';let src=fs.readFileSync(FILE,'utf8');
 src=once(src,'function hook(){',"try{window.__AXIS_GROUP_PLAN_OPEN__=()=>openPlan()}catch{}\nfunction hook(){",'set-bridge opener exposure');
 try{new Function(src)}catch(e){fail(`set bridge syntax ${e.message}`)}
 fs.writeFileSync(FILE,src)
}

/* Existing v8712 surface remains the visual enhancer; expose its upgrade call. */
{
 const FILE='v8712-runtime.js';let src=fs.readFileSync(FILE,'utf8');
 src=once(src,'function bind(){',"try{window.__AXIS_GROUP_PLAN_UPGRADE__=()=>upgradePlan()}catch{}\nfunction bind(){",'planner upgrade exposure');
 try{new Function(src)}catch(e){fail(`v8712 syntax ${e.message}`)}
 fs.writeFileSync(FILE,src)
}

/*
 * v61 is already the canonical set-render owner. Route its own launcher click
 * to the existing planner before other delegated listeners run. Returning from
 * this handler does not stop propagation, so inherited listeners remain valid.
 */
{
 const FILE='v61.js';let src=fs.readFileSync(FILE,'utf8');
 const gate="if(b.dataset.axisStep)return;";
 const route="if(b.dataset.axisStep)return;if(b.dataset.v8123Plan){window.__AXIS_GROUP_PLAN_OPEN__?.();setTimeout(()=>window.__AXIS_GROUP_PLAN_UPGRADE__?.(),0);return}";
 src=once(src,gate,route,'canonical launcher click route');
 const end=src.lastIndexOf('})();');if(end<0)fail('v61 IIFE end missing');
 src=src.slice(0,end)+"try{window.__AXIS_8123_GROUP_PLAN_CLICK_ROUTE__={version:'8.12.3',launcherOwner:'v61',plannerOwner:'v874-set-bridge',surfaceOwner:'v8712-runtime',propagationStopped:false}}catch{}\n"+src.slice(end);
 for(const needle of ['__AXIS_8123_GROUP_PLAN_CLICK_ROUTE__','__AXIS_GROUP_PLAN_OPEN__','__AXIS_GROUP_PLAN_UPGRADE__','b.dataset.v8123Plan'])if(!src.includes(needle))fail(`missing ${needle}`);
 try{new Function(src)}catch(e){fail(`v61 syntax ${e.message}`)}
 fs.writeFileSync(FILE,src)
}
console.log('[AXIS 8.12.3 Group Plan click route] PASS · v61 launcher explicitly opens the existing set-bridge planner and schedules the existing v8712 surface upgrade');
