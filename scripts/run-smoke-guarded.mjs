import {spawn} from 'node:child_process';
const child=spawn(process.execPath,['scripts/axis-smoke.mjs'],{stdio:'inherit',env:process.env});
const WATCHDOG_MS=75000;
const timer=setTimeout(()=>{
  console.error(`[AXIS smoke watchdog] renderer/test did not finish within ${Math.round(WATCHDOG_MS/1000)}s; terminating child`);
  try{child.kill('SIGKILL')}catch{}
},WATCHDOG_MS);
child.on('exit',(code,signal)=>{clearTimeout(timer);if(signal){console.error('[AXIS smoke watchdog] child signal',signal);process.exit(124)}process.exit(code??1)});
