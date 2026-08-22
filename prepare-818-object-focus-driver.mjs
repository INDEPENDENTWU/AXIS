import fs from 'node:fs';
import {execFileSync} from 'node:child_process';

const SOURCE='prepare-818-object-focus-foundation.mjs',TMP='.axis-818-object-focus.generated.mjs';
let src=fs.readFileSync(SOURCE,'utf8');
const brittle=` s=s.replace("host.classList.add('show');D.body.classList.add('v87-now')}","host.classList.add('show');D.body.classList.add('v87-now');axis818FocusSync()}");\n`;
const n=src.split(brittle).length-1;if(n!==1)throw new Error(`[AXIS 8.18 driver] v87 render-tail mutation expected once, found ${n}`);
src=src.replace(brittle,'');
const marker="window.__AXIS_818_FOCUS__={version:'8.18',owner:'presentation-only',open:axis818FocusOpen,close:axis818FocusClose,completionOwner:'v87-direct-884',automatic:false};";
const replacement="setInterval(axis818FocusSync,250);\n"+marker;
const m=src.split(marker).length-1;if(m!==1)throw new Error(`[AXIS 8.18 driver] Focus marker expected once, found ${m}`);
src=src.replace(marker,replacement);
fs.writeFileSync(TMP,src);
try{execFileSync(process.execPath,[TMP],{stdio:'inherit'})}finally{try{fs.unlinkSync(TMP)}catch{}}
await import('./prepare-818-foundation-hardening.mjs');
await import('./prepare-818-media-store-seal.mjs');
console.log('[AXIS 8.18 driver] PASS · v87 canonical render signature preserved · Focus mirrors presentation only · final truth hardening + WebKit-safe media seal applied');
