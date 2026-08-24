import fs from 'node:fs';

const FILE='v8131-evolution-field.js';
const fail=m=>{throw new Error(`[AXIS 8.19 inherited runtime repair] ${m}`)};
if(!fs.existsSync(FILE))fail(`missing ${FILE}`);
let src=fs.readFileSync(FILE,'utf8');

/*
 * Historical 8.13.1 source contained `return112`, which is valid JavaScript but
 * resolves as an identifier at runtime. It only throws when continuity() has no
 * factual interval/span pair. Repair the source before bundling, and keep the
 * final-runtime seal fail-closed so this class of concatenation typo cannot ship.
 */
const from='function yFor(s){const c=continuity(s);if(c===null)return112;return Math.round(142-clamp(c,.18,.95)*68)}';
const to='function yFor(s){const c=continuity(s);if(c===null)return 112;return Math.round(142-clamp(c,.18,.95)*68)}';
const hits=src.split(from).length-1;
if(hits!==1)fail(`8.13.1 yFor null-continuity defect expected once, found ${hits}`);
src=src.replace(from,to);
if(src.includes('return112'))fail('return112 survived source repair');
try{new Function(src)}catch(e){fail(`Evolution source syntax ${e.message}`)}
fs.writeFileSync(FILE,src);
console.log('[AXIS 8.19 inherited runtime repair] PASS · 8.13.1 null-continuity fallback is numeric 112 · no return112 identifier survives');
