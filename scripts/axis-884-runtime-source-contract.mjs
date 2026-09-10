import fs from 'node:fs';

const fail=m=>{throw new Error(`[AXIS 8.8.4 runtime source contract] ${m}`)};
const read=f=>{if(!fs.existsSync(f))fail(`missing ${f}`);return fs.readFileSync(f,'utf8')};
const count=(s,x)=>s.split(x).length-1;

const owner=read('prepare-884-field-fix.mjs');
const build=read('build-release.mjs');
const historical=read('prepare-884-runtime-followup.mjs');
const retirements=JSON.parse(read('governance/retirements.json'));

if(count(build,"'prepare-884-field-fix.mjs'")!==1)fail('8.8.4 source owner must remain exactly once in canonical release steps');
if(build.includes("'prepare-884-runtime-followup.mjs'"))fail('retired 8.8.4 runtime follow-up returned to canonical build reachability');
if(owner.includes("import './prepare-884-runtime-followup.mjs'")||owner.includes('prepare-884-runtime-followup.mjs\');'))fail('source owner delegates back to retired follow-up');

for(const token of [
  'Source-owned final convergence formerly applied by prepare-884-runtime-followup.mjs.',
  "l.classList.remove('v879Compact')",
  "window.__AXIS_883_SAFE_ZONE__='retired-884'",
  "section?.querySelector('.sectionHead')",
  'axis884Prepaint',
  'AXIS 8.8.4 timeline convergence — one passive rail, natural page scroll, no hit-test overlay.',
  "v879.includes(\"classList.add('v879Hide')\")",
  "v8712.includes('axis883TimelineSafe')"
])if(!owner.includes(token))fail(`final 8.8.4 source-owned behavior token missing: ${token}`);

for(const token of [
  'One timeline owner only: keep the compact v876 training rail, retire v879 row folding.',
  "window.__AXIS_883_SAFE_ZONE__='retired-884'",
  "section?.querySelector('.sectionHead')",
  'axis884Prepaint',
  '[AXIS 8.8.4 follow-up] PASS'
])if(!historical.includes(token))fail(`historical follow-up provenance unexpectedly changed: ${token}`);

const retirement=retirements.retirements?.find(x=>x.id==='runtime-followup-884');
if(!retirement)fail('8.8.4 runtime follow-up retirement registry entry missing');
if(retirement.status!=='retired-from-build-authority'||retirement.productionAuthorityAllowed!==false||retirement.compatibilityHookAllowed!==false)fail('8.8.4 runtime follow-up retirement authority contract is not sealed');
if(!String(retirement.replacement||'').includes('prepare-884-field-fix.mjs'))fail('8.8.4 follow-up retirement replacement does not name the source owner');

console.log('[AXIS 8.8.4 runtime source contract] PASS · final timeline/archive/detail behavior is source-owned · late runtime follow-up retired from canonical build authority');
