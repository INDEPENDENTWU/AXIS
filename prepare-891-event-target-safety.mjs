import fs from 'node:fs';

const fail=m=>{throw new Error(`[AXIS 8.9.1 event target] ${m}`)};
const modules=[
  'app.js','v61.js','v82-runtime.js','v83-reminders.js','v84-runtime.js','v85-runtime.js','v85-canvas-fix.js','v86-runtime.js','v86-gesture.js','v87-runtime.js','v87-fix.js','v871-fix.js','v872-fix.js',
  'v873-exercise-library.js','v873-smart-input.js','v874-professional.js','v874-set-bridge.js','v875-polish.js','v876-runtime.js','v877-runtime.js','v878-stability.js','v879-runtime.js',
  'v8710-live-catalog.js','v8710-sonic-core.js','v8710-sonic-motifs.js','v8710-sound-ui.js','v8710-report.js','v8710-watermark.js','v8711-runtime.js'
];
let total=0,files=0;
for(const file of modules){
 if(!fs.existsSync(file))fail(`missing runtime module ${file}`);
 let src=fs.readFileSync(file,'utf8'),n=0;
 src=src.replace(/\b([A-Za-z_$][\w$]*)\.target\.closest\(/g,(m,eventName)=>{n++;return `${eventName}.target?.closest?.(`});
 if(n){
  try{new Function(src)}catch(e){fail(`${file} syntax after target hardening: ${e.message}`)}
  fs.writeFileSync(file,src);total+=n;files++;
 }
}
if(total<1)fail('no event-target closest callsites found to harden');
for(const file of modules){
 const src=fs.readFileSync(file,'utf8');
 if(/\b[A-Za-z_$][\w$]*\.target\.closest\(/.test(src))fail(`unguarded event target closest survived in ${file}`);
}
console.log(`[AXIS 8.9.1 event target] PASS · ${total} delegated closest callsites hardened across ${files} runtime modules · real element events unchanged`);
