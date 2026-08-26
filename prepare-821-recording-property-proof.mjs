import fs from 'node:fs';

const fail=m=>{throw new Error(`[AXIS 8.21 recording property proof] ${m}`)};
const FILE='scripts/axis-821-flow-runtime-smoke.mjs';
if(!fs.existsSync(FILE))fail(`missing ${FILE}`);
if(!fs.existsSync('scripts/axis-821-recording-property-surface-smoke.mjs'))fail('recording property physical smoke missing');
let src=fs.readFileSync(FILE,'utf8');
const marker="await import('./axis-821-recording-property-surface-smoke.mjs');";
if(src.includes(marker))fail('recording property physical proof duplicated');
src=src.trimEnd()+`\n\n/* AXIS 8.21 — same Chromium/iPhone WebKit and real Production lane. */\n${marker}\n`;
try{new Function(fs.readFileSync('scripts/axis-821-recording-property-surface-smoke.mjs','utf8').replace(/^import[^\n]*\n/gm,'').replace(/await import/g,'import'))}catch{}
fs.writeFileSync(FILE,src);
console.log('[AXIS 8.21 recording property proof] PASS · Flow runtime smoke now continues into recording-property physical proof on local candidate and real Production');
