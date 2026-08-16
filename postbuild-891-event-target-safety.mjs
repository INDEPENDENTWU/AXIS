import fs from 'node:fs';

const fail=m=>{throw new Error(`[AXIS 8.9.1 event target] ${m}`)};
const file='axis-core.js';
if(!fs.existsSync(file))fail(`missing ${file}`);
let src=fs.readFileSync(file,'utf8'),count=0;
src=src.replace(/\b([A-Za-z_$][\w$]*)\.target\.closest\(/g,(m,eventName)=>{count++;return `${eventName}.target?.closest?.(`});
if(count<1)fail('no canonical delegated closest callsites found to harden');
if(/\b[A-Za-z_$][\w$]*\.target\.closest\(/.test(src))fail('unguarded event target closest survived canonical hardening');
try{new Function(src)}catch(e){fail(`canonical runtime syntax after target hardening: ${e.message}`)}
fs.writeFileSync(file,src);
console.log(`[AXIS 8.9.1 event target] PASS · ${count} canonical delegated closest callsites hardened after owner retirement · real element events unchanged`);
