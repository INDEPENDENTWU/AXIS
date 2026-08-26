import fs from 'node:fs';

const fail=m=>{throw new Error(`[AXIS 8.21 Flow user surface proof] ${m}`)};
const FILE='scripts/axis-821-recording-property-surface-smoke.mjs';
if(!fs.existsSync(FILE))fail(`missing ${FILE}`);
if(!fs.existsSync('scripts/axis-821-flow-user-surface-smoke.mjs'))fail('Flow user surface smoke missing');
let src=fs.readFileSync(FILE,'utf8');
const marker="await import('./axis-821-flow-user-surface-smoke.mjs');";
if(src.includes(marker))fail('Flow user surface proof duplicated');
src=src.trimEnd()+`\n\n/* AXIS 8.21 — continue the same Chromium/iPhone WebKit + Production lane into the user-visible Flow path. */\n${marker}\n`;
fs.writeFileSync(FILE,src);
console.log('[AXIS 8.21 Flow user surface proof] PASS · recording-property physical proof now continues into user-visible Flow composition/run proof');
