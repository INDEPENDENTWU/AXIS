import fs from 'node:fs';

const fail=m=>{throw new Error(`[AXIS 8.21 Flow user surface proof] ${m}`)};
const FILE='scripts/axis-821-recording-property-surface-smoke.mjs';
if(!fs.existsSync(FILE))fail(`missing ${FILE}`);
if(!fs.existsSync('scripts/axis-821-flow-user-surface-smoke.mjs'))fail('Flow user surface smoke missing');
if(!fs.existsSync('scripts/axis-821-flow-reality-smoke.mjs'))fail('Flow reality smoke missing');
let src=fs.readFileSync(FILE,'utf8');
const surface="await import('./axis-821-flow-user-surface-smoke.mjs');";
const reality="await import('./axis-821-flow-reality-smoke.mjs');";
if(src.includes(surface)||src.includes(reality))fail('Flow user-surface/reality proof duplicated');
src=src.trimEnd()+`\n\n/* AXIS 8.21 — continue the same Chromium/iPhone WebKit + Production lane into the user-visible Flow path, then the real-world detour path. */\n${surface}\n${reality}\n`;
fs.writeFileSync(FILE,src);
console.log('[AXIS 8.21 Flow user surface proof] PASS · recording-property physical proof continues into user-visible Flow composition/run + temporary-other reality proof');
