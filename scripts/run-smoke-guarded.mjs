import {spawn} from 'node:child_process';

const child=spawn(process.execPath,['scripts/axis-smoke.mjs'],{stdio:['ignore','pipe','pipe'],env:process.env});
let tail='';
const keep=s=>{tail=(tail+s).slice(-12000)};
child.stdout.on('data',b=>{const s=String(b);process.stdout.write(s);keep(s)});
child.stderr.on('data',b=>{const s=String(b);process.stderr.write(s);keep(s)});
const annotation=s=>String(s||'AXIS smoke failed').replace(/%/g,'%25').replace(/\r?\n/g,'%0A');
const timer=setTimeout(()=>{
  const msg='full browser matrix did not finish within 65s';
  console.error('[AXIS smoke watchdog]',msg);
  console.error(`::error title=AXIS browser smoke::${annotation(msg+'\n'+tail)}`);
  try{child.kill('SIGKILL')}catch{}
},65000);
child.on('exit',(code,signal)=>{
  clearTimeout(timer);
  if(signal){console.error('[AXIS smoke watchdog] child signal',signal);console.error(`::error title=AXIS browser smoke::${annotation('child signal '+signal+'\n'+tail)}`);process.exit(124)}
  if((code??1)!==0)console.error(`::error title=AXIS browser smoke::${annotation(tail)}`);
  process.exit(code??1);
});
