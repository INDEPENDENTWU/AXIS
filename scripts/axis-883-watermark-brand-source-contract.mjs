import fs from 'node:fs';

const fail=m=>{throw new Error(`[AXIS 8.8.3 watermark source contract] ${m}`)};
const read=f=>{if(!fs.existsSync(f))fail(`missing ${f}`);return fs.readFileSync(f,'utf8')};
const count=(s,x)=>s.split(x).length-1;

const owner=read('prepare-883-convergence.mjs');
const build=read('build-release.mjs');
const historicalBrand=read('prepare-883-inherited-brand-fix.mjs');
const historicalSwitchBridge=read('prepare-883-watermark-contract-bridge.mjs');
const finalVerify=read('verify-88-watermark.mjs');
const retirements=JSON.parse(read('governance/retirements.json'));

const canonical="c.fillText('AXIS',W/2,H*.48)";
const legacy="c.fillText('A X I S',W/2,H*.48)";

if(count(owner,canonical)!==2)fail('canonical centered AXIS brand must exist once in emitted stamp plus once in the source anti-regression guard');
if(count(owner,legacy)!==1)fail('legacy spaced brand may remain only in the source anti-regression guard');
if(!owner.includes(`if(!wm.includes("${canonical}"))fail('canonical centered AXIS brand missing')`))fail('canonical brand self-guard missing');
if(!owner.includes(`if(wm.includes("${legacy}"))fail('legacy spaced AXIS brand survived source owner')`))fail('legacy spaced-brand self-guard missing');
for(const token of ['locationSnapshot',"row.kind==='location'",'Math.max(.01,Math.min(1,p.opacity/100))','axis883TimelineSafe'])if(!owner.includes(token))fail(`inherited 8.8.3 behavior token missing: ${token}`);

const switchTokens=['if(p.name)rows.push','if(p.data&&data)rows.push','if(p.location&&p.place)rows.push','if(p.time)rows.push'];
for(const token of switchTokens)if(!owner.includes(token))fail(`four-switch row is not emitted by source owner: ${token}`);
if(!owner.includes('for(const row of rows)'))fail('source-owned watermark geometry does not consume rows directly');
if(count(owner,'const body=[]')!==1||count(owner,'body.push')!==1)fail('historical body-to-rows input may remain only inside the source anti-regression guard');

if(count(build,"'prepare-883-convergence.mjs'")!==1)fail('8.8.3 convergence source owner must remain exactly once in canonical release steps');
if(build.includes("'prepare-883-inherited-brand-fix.mjs'"))fail('retired inherited brand fix returned to canonical build reachability');
if(build.includes("'prepare-883-watermark-contract-bridge.mjs'"))fail('retired watermark four-switch bridge returned to canonical build reachability');
if(!historicalBrand.includes(`src=src.replace("${legacy}","${canonical}")`))fail('historical brand corrective provenance was unexpectedly rewritten');
for(const token of ["const body=[];if(p.name)body.push","const rows=[];if(p.name)rows.push","for(const row of body)","for(const row of rows)"])if(!historicalSwitchBridge.includes(token))fail(`historical four-switch bridge provenance missing: ${token}`);
for(const token of ['if\\(p\\.name\\)rows\\.push','if\\(p\\.data&&data\\)rows\\.push','if\\(p\\.location&&p\\.place\\)rows\\.push','if\\(p\\.time\\)rows\\.push'])if(!finalVerify.includes(token))fail(`final watermark verifier no longer enforces four-switch output: ${token}`);

for(const [id,label] of [['watermark-spaced-brand-fix-883','brand fix'],['watermark-four-switch-contract-bridge-883','four-switch bridge']]){
  const retirement=retirements.retirements?.find(x=>x.id===id);
  if(!retirement)fail(`${label} retirement registry entry missing`);
  if(retirement.status!=='retired-from-build-authority'||retirement.productionAuthorityAllowed!==false||retirement.compatibilityHookAllowed!==false)fail(`${label} retirement authority contract is not sealed`);
  if(!String(retirement.replacement||'').includes('prepare-883-convergence.mjs'))fail(`${label} retirement replacement does not name the source owner`);
}

console.log('[AXIS 8.8.3 watermark source contract] PASS · canonical AXIS brand and four persisted switch rows are source-owned · corrective brand/row prepares retired · final verifier preserved');
