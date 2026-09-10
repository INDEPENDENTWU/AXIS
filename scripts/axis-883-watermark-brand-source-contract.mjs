import fs from 'node:fs';

const fail=m=>{throw new Error(`[AXIS 8.8.3 watermark brand source contract] ${m}`)};
const read=f=>{if(!fs.existsSync(f))fail(`missing ${f}`);return fs.readFileSync(f,'utf8')};
const count=(s,x)=>s.split(x).length-1;

const owner=read('prepare-883-convergence.mjs');
const build=read('build-release.mjs');
const historical=read('prepare-883-inherited-brand-fix.mjs');
const retirements=JSON.parse(read('governance/retirements.json'));

const canonical="c.fillText('AXIS',W/2,H*.48)";
const legacy="c.fillText('A X I S',W/2,H*.48)";

if(count(owner,canonical)!==2)fail('canonical centered AXIS brand must exist once in emitted stamp plus once in the source anti-regression guard');
if(count(owner,legacy)!==1)fail('legacy spaced brand may remain only in the source anti-regression guard');
if(!owner.includes(`if(!wm.includes("${canonical}"))fail('canonical centered AXIS brand missing')`))fail('canonical brand self-guard missing');
if(!owner.includes(`if(wm.includes("${legacy}"))fail('legacy spaced AXIS brand survived source owner')`))fail('legacy spaced-brand self-guard missing');
for(const token of ['locationSnapshot',"row.kind==='location'",'Math.max(.01,Math.min(1,p.opacity/100))','axis883TimelineSafe'])if(!owner.includes(token))fail(`inherited 8.8.3 behavior token missing: ${token}`);

if(count(build,"'prepare-883-convergence.mjs'")!==1)fail('8.8.3 convergence source owner must remain exactly once in canonical release steps');
if(build.includes("'prepare-883-inherited-brand-fix.mjs'"))fail('retired inherited brand fix returned to canonical build reachability');
if(!historical.includes(`src=src.replace("${legacy}","${canonical}")`))fail('historical corrective provenance was unexpectedly rewritten');

const retirement=retirements.retirements?.find(x=>x.id==='watermark-spaced-brand-fix-883');
if(!retirement)fail('retirement registry entry missing');
if(retirement.status!=='retired-from-build-authority'||retirement.productionAuthorityAllowed!==false||retirement.compatibilityHookAllowed!==false)fail('retirement authority contract is not sealed');
if(!String(retirement.replacement||'').includes('prepare-883-convergence.mjs'))fail('retirement replacement does not name the source owner');

console.log('[AXIS 8.8.3 watermark brand source contract] PASS · canonical centered AXIS brand is emitted by source owner · corrective prepare retired · inherited watermark semantics preserved');
