import fs from 'node:fs';

const FROM='8.26.3',VERSION='8.26.4';
const fail=m=>{throw new Error(`[AXIS 8.26.4 Active Rest Utility Rail driver] ${m}`)};
const read=f=>{if(!fs.existsSync(f))fail(`missing ${f}`);return fs.readFileSync(f,'utf8')};
const write=(f,s)=>fs.writeFileSync(f,s);
const once=(src,from,to,label)=>{const n=src.split(from).length-1;if(n!==1)fail(`${label} expected once, found ${n}`);return src.replace(from,to)};

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

/* The canonical rest node is also touched by inherited learning presentation.
   Bind visibility directly to the already-derived Active status at render time
   so a later accessory stylesheet can never resurrect running/complete geometry.
   This is presentation-only; v87 remains the pause/timer truth owner. */
{
 const f='v87-runtime.js';let s=read(f);
 const rest="$('#v87Rest').textContent=planDone?'':rest?'组间休息中':a.status==='paused'?'暂停期间不累计实际时间':' ';";
 const guarded=rest+"const axis8264RestNode=$('#v87Rest');if(axis8264RestNode)axis8264RestNode.style.setProperty('display',status==='paused'?'flex':'none','important');";
 s=once(s,rest,guarded,'render-time rest visibility guard');
 write(f,s);
}

/* Historical Report PDF continuity follows the governed current candidate. The
   Report feature itself is unchanged; only its moving successor assertion is
   advanced deterministically instead of pinning a previous patch version. */
{
 const f='scripts/axis-821-report-pdf-export-contract.mjs';let s=read(f);
 const old="assert.ok(/AXIS \\*\\*8\\.26\\.3/.test(current)||current.includes('AXIS 8.26.3'),'CURRENT_WORK does not identify the governed current successor');\nassert.equal(project?.engineering?.baselineRelease,'8.26.3','project-state current release drifted from PDF continuity context');";
 const next="const governedCurrent=String(project?.engineering?.baselineRelease||project?.product?.productionRelease||'');\nassert.equal(governedCurrent,String(project?.product?.productionRelease||''),'project-state current release fields disagree in PDF continuity context');\nassert.ok(current.includes(`AXIS **${governedCurrent}`)||current.includes(`AXIS ${governedCurrent}`),'CURRENT_WORK does not identify the governed current successor');";
 s=once(s,old,next,'Report PDF moving successor continuity');
 write(f,s);
}

console.log(`[AXIS 8.26.4 Active Rest Utility Rail driver] PASS · ${FROM} → ${VERSION} · inherited rest presentation normalized · render visibility fail-closed · moving Report PDF continuity advanced`);
