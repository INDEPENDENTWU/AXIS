import fs from 'node:fs';

const fail=m=>{throw new Error(`[AXIS 8.10 learning entry source contract] ${m}`)};
const read=f=>{if(!fs.existsSync(f))fail(`missing ${f}`);return fs.readFileSync(f,'utf8')};
const count=(s,x)=>s.split(x).length-1;

const settings=read('prepare-810-learning-settings.mjs');
const build=read('build-release.mjs');
const historical=read('prepare-810-learning-entry-fix.mjs');
const retirements=JSON.parse(read('governance/retirements.json'));

for(const token of [
  '#settingsSheet .v810ConfigEntry',
  "const host=$('#settingsSheet .settingsList:not(.second)')||$('#settingsSheet .settingsList')",
  "entry.className='settingLink v810ConfigEntry'",
  "const summary=$('#v810ConfigSummary')",
  "window.__AXIS_810_SETTINGS_ENTRY__={owner:'settings-primary-list',surface:'dedicated-config-panel'}"
])if(!settings.includes(token))fail(`source-owned final Settings entry token missing: ${token}`);

if(settings.includes('#v89SpeakSettings .v810ConfigEntry'))fail('source still styles the learning entry as an accessory-container child');
if(count(build,"'prepare-810-learning-settings.mjs'")!==1)fail('learning settings owner must remain exactly once in canonical release steps');
if(build.includes("'prepare-810-learning-entry-fix.mjs'"))fail('retired learning entry fix returned to canonical build reachability');
if(!historical.includes("owner:'settings-primary-list'")||!historical.includes('top-level visible Settings row'))fail('historical corrective provenance was unexpectedly rewritten');
if(/\bfetch\s*\(|indexedDB\b|axis_flow_/i.test(settings))fail('learning Settings source gained a forbidden network/database/Flow-storage owner');

const retirement=retirements.retirements?.find(x=>x.id==='learning-settings-entry-fix-810');
if(!retirement)fail('retirement registry entry missing');
if(retirement.status!=='retired-from-build-authority'||retirement.productionAuthorityAllowed!==false)fail('retirement authority contract is not sealed');
if(!String(retirement.replacement||'').includes('prepare-810-learning-settings.mjs'))fail('retirement replacement does not name the source owner');

console.log('[AXIS 8.10 learning entry source contract] PASS · top-level primary Settings entry is source-owned · corrective prepare retired · Deep Compatibility retains Chromium/WebKit behavior proof');
