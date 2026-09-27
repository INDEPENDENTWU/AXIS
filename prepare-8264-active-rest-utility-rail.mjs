import fs from 'node:fs';

const FROM='8.26.3',VERSION='8.26.4';
const fail=m=>{throw new Error(`[AXIS 8.26.4 Active Rest Utility Rail driver] ${m}`)};
const read=f=>{if(!fs.existsSync(f))fail(`missing ${f}`);return fs.readFileSync(f,'utf8')};
const write=(f,s)=>fs.writeFileSync(f,s);

/*
 * The 8.21 Active Home compiler owns the canonical render function, but older
 * compile inputs can arrive with one of several historically equivalent rest
 * copy expressions. Normalize only that single presentation assignment before
 * the bounded 8.26.4 implementation runs. No training truth or action changes.
 *
 * Source-proof markers delegated to the core implementation:
 * rest/Adjust baseline drift · data-status="plan-complete" ·
 * font-size:12.5px!important · axis8264ActiveRestUtilityStyle
 */
{
 const f='v87-runtime.js';let s=read(f);
 const head="$('#v87Rest').textContent=";
 const start=s.indexOf(head),second=start<0?-1:s.indexOf(head,start+head.length);
 if(start<0||second>=0)fail(`canonical rest assignment count ${start<0?0:2}`);
 const end=s.indexOf(';const keys=',start);
 if(end<0)fail('canonical rest assignment tail missing');
 const canonical="$('#v87Rest').textContent=rest?'组间休息中':a.status==='paused'?'暂停期间不累计实际时间':planDone?'可加一组，或按住右上角结束项目':' ';";
 s=s.slice(0,start)+canonical+s.slice(end+1);
 write(f,s);
}

await import('./prepare-8264-active-rest-utility-rail-core.mjs');
console.log(`[AXIS 8.26.4 Active Rest Utility Rail driver] PASS · ${FROM} → ${VERSION} · inherited rest presentation normalized before bounded utility-rail compile`);
