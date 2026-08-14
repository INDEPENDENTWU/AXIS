import {spawn} from 'node:child_process';
const child=spawn(process.execPath,['scripts/axis-smoke.mjs'],{stdio:'inherit',env:process.env});
const timer=setTimeout(()=>{
  console.error('[AXIS smoke watchdog] renderer/test did not finish within 40s; terminating child');
  try{child.kill('SIGKILL')}catch{}
},40000);
child.on('exit',(code,signal)=>{clearTimeout(timer);if(signal){console.error('[AXIS smoke watchdog] child signal',signal);process.exit(124)}process.exit(code??1)});
