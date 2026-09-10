import fs from 'node:fs';

const fail=m=>{throw new Error(`[AXIS 8.10 learning budget source contract] ${m}`)};
const read=f=>{if(!fs.existsSync(f))fail(`missing ${f}`);return fs.readFileSync(f,'utf8')};
const count=(s,x)=>s.split(x).length-1;

const engine=read('prepare-810-learning-engine.mjs');
const build=read('build-release.mjs');
const historical=read('prepare-810-learning-budget-fix.mjs');
const retirements=JSON.parse(read('governance/retirements.json'));

const daily="if((Number(d.count)||0)>=axis810DailyTarget(p))return false;";
const session="if((Number(q.count)||0)>=axis810SessionCap(p))return false;";
const oldDaily='if(Number(d.count)||0>=axis810DailyTarget(p))return false;';
const oldSession='if(Number(q.count)||0>=axis810SessionCap(p))return false;';

if(count(engine,daily)!==1)fail('learning engine must source-own the exact daily exposure budget comparison once');
if(count(engine,session)!==1)fail('learning engine must source-own the exact session exposure budget comparison once');
if(engine.includes(oldDaily)||engine.includes(oldSession))fail('ambiguous pre-fix budget precedence returned to the engine source');
if(count(build,"'prepare-810-learning-engine.mjs'")!==1)fail('learning engine must remain exactly once in canonical release steps');
if(build.includes("'prepare-810-learning-budget-fix.mjs'"))fail('retired learning budget fix returned to canonical build reachability');
if(!historical.includes('daily exposure budget comparison')||!historical.includes('session exposure budget comparison'))fail('historical corrective provenance was unexpectedly rewritten');
if(/\bfetch\s*\(|indexedDB\b|axis_flow_/i.test(engine))fail('learning engine gained a forbidden network/database/Flow-storage owner');

const retirement=retirements.retirements?.find(x=>x.id==='learning-budget-precedence-fix-810');
if(!retirement)fail('retirement registry entry missing');
if(retirement.status!=='retired-from-build-authority'||retirement.productionAuthorityAllowed!==false)fail('retirement authority contract is not sealed');
if(!String(retirement.replacement||'').includes('prepare-810-learning-engine.mjs'))fail('retirement replacement does not name the source owner');

console.log('[AXIS 8.10 learning budget source contract] PASS · budget precedence is engine-source-owned · corrective prepare retired from canonical build · behavior remains covered by Deep Compatibility Chromium/WebKit');
