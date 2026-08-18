import fs from 'node:fs';

const fail=m=>{throw new Error(`[AXIS 8.12.3 Group Plan click route] ${m}`)};
const once=(src,from,to,label)=>{const n=src.split(from).length-1;if(n!==1)fail(`${label} expected once, found ${n}`);return src.replace(from,to)};

/* Existing set-bridge remains the planner owner; expose only its first-open API. */
{
 const FILE='v874-set-bridge.js';let src=fs.readFileSync(FILE,'utf8');
 src=once(src,'function hook(){',"try{window.__AXIS_GROUP_PLAN_OPEN__=()=>openPlan()}catch{}\nfunction hook(){",'set-bridge opener exposure');
 try{new Function(src)}catch(e){fail(`set bridge syntax ${e.message}`)}
 fs.writeFileSync(FILE,src)
}

/* Existing v8712 surface remains the visual enhancer and current-view renderer. */
{
 const FILE='v8712-runtime.js';let src=fs.readFileSync(FILE,'utf8');
 src=once(src,'function bind(){',"try{window.__AXIS_GROUP_PLAN_UPGRADE__=()=>upgradePlan()}catch{}\nfunction bind(){",'planner upgrade exposure');
 try{new Function(src)}catch(e){fail(`v8712 syntax ${e.message}`)}
 fs.writeFileSync(FILE,src)
}

/*
 * v61 is the canonical set-render owner and therefore the single launcher click
 * owner. First open uses the inherited set-bridge shell and immediately upgrades
 * it. After that upgrade, the legacy planner DOM no longer exists; repeat opens
 * must show the existing upgraded sheet and refresh it from current recording
 * rows instead of calling the retired legacy renderPlan() path again.
 */
{
 const FILE='v61.js';let src=fs.readFileSync(FILE,'utf8');
 const gate="if(b.dataset.axisStep)return;";
 const helper=`function axis8123OpenGroupPlan(){
 let tries=0;
 const upgrade=()=>{const f=window.__AXIS_GROUP_PLAN_UPGRADE__;if(f){f();return}if(tries++<80)setTimeout(upgrade,25)};
 const current=$('#v875PlanSheet');
 if(current?.querySelector('#v8712PlanBody')){current.classList.add('show');upgrade();return}
 const open=()=>{const f=window.__AXIS_GROUP_PLAN_OPEN__;if(f){f();tries=0;upgrade();return}if(tries++<80)setTimeout(open,25)};
 open()
}
`;
 const bindHead='function bind(){';
 src=once(src,bindHead,helper+bindHead,'upgrade-aware planner helper');
 const route="if(b.dataset.axisStep)return;if(b.dataset.v8123Plan){e.preventDefault();e.stopImmediatePropagation();axis8123OpenGroupPlan();return}";
 src=once(src,gate,route,'canonical launcher click route');
 const end=src.lastIndexOf('})();');if(end<0)fail('v61 IIFE end missing');
 src=src.slice(0,end)+"try{window.__AXIS_8123_GROUP_PLAN_CLICK_ROUTE__={version:'8.12.3',launcherOwner:'v61',plannerOwner:'v874-set-bridge-first-open',surfaceOwner:'v8712-runtime',loadOrderSafe:true,retryWindowMs:2000,repeatOpen:'upgraded-sheet',propagationStopped:true,scope:'canonical-launcher-only'}}catch{}\n"+src.slice(end);
 for(const needle of ['__AXIS_8123_GROUP_PLAN_CLICK_ROUTE__','__AXIS_GROUP_PLAN_OPEN__','__AXIS_GROUP_PLAN_UPGRADE__',"current?.querySelector('#v8712PlanBody')","repeatOpen:'upgraded-sheet'",'e.stopImmediatePropagation()'])if(!src.includes(needle))fail(`missing ${needle}`);
 try{new Function(src)}catch(e){fail(`v61 syntax ${e.message}`)}
 fs.writeFileSync(FILE,src)
}
console.log('[AXIS 8.12.3 Group Plan click route] PASS · first open uses inherited shell; repeat opens reuse and refresh the upgraded v8712 sheet without touching retired legacy DOM');
