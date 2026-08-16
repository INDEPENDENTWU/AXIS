import fs from 'node:fs';

const fail=m=>{throw new Error(`[AXIS 8.10 learning budget] ${m}`)};
const FILE='v87-runtime.js';
if(!fs.existsSync(FILE))fail(`missing ${FILE}`);
let src=fs.readFileSync(FILE,'utf8');
const replaceOnce=(from,to,label)=>{
 const n=src.split(from).length-1;
 if(n!==1)fail(`${label} expected once, found ${n}`);
 src=src.replace(from,to);
};

replaceOnce(
 'if(Number(d.count)||0>=axis810DailyTarget(p))return false;',
 'if((Number(d.count)||0)>=axis810DailyTarget(p))return false;',
 'daily exposure budget comparison'
);
replaceOnce(
 'if(Number(q.count)||0>=axis810SessionCap(p))return false;',
 'if((Number(q.count)||0)>=axis810SessionCap(p))return false;',
 'session exposure budget comparison'
);

if(src.includes('if(Number(d.count)||0>=axis810DailyTarget(p))')||src.includes('if(Number(q.count)||0>=axis810SessionCap(p))'))fail('ambiguous budget precedence remains');
try{new Function(src)}catch(e){fail(`runtime syntax ${e.message}`)}
fs.writeFileSync(FILE,src);
console.log('[AXIS 8.10 learning budget] PASS · daily/session limits compare numeric counts instead of short-circuiting after first exposure');
