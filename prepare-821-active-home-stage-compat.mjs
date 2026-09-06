import fs from 'node:fs';

const FILE='v87-runtime.js';
const fail=m=>{throw new Error(`[AXIS 8.21 Active Home stage compat] ${m}`)};
let s=fs.readFileSync(FILE,'utf8');
const once=(from,to,label)=>{const n=s.split(from).length-1;if(n!==1)fail(`${label} expected once, found ${n}`);s=s.replace(from,to)};

/* Preserve inherited Active countdown/tone semantics inside the new stage.
   This is not a second timer: it derives from the same v87 elapsed/estimate
   values and only changes what the integrated Home stage presents. */
once(
 "rest=a.restStartedAt&&a.status==='active'?now()-a.restStartedAt:0,status=",
 "rest=a.restStartedAt&&a.status==='active'?now()-a.restStartedAt:0,remaining=Math.max(0,est-actual),status=",
 'remaining-time derivation'
);
once(
 "$('#axis821StageRest').textContent=rest?('休息 '+clock(rest)):a.status==='paused'?'计时暂停':planDone?'计划完成':' ';",
 "$('#axis821StageRest').textContent=rest?('休息 '+clock(rest)):remaining>0?`剩余 ${clock(remaining)}`:a.status==='paused'?'计时暂停':planDone?'计划完成':' ';",
 'visible inherited countdown'
);
once(
 "}else{host.dataset.primary='none';pri.style.display='none';add.style.display='none'}$('#v87Rest')",
 "}else{host.dataset.primary='none';pri.style.display='none';add.style.display='none'}add.style.visibility=planDone?'visible':'hidden';$('#v87Rest')",
 'stable add-set geometry compatibility'
);

try{new Function(s)}catch(e){fail(`v87 syntax ${e.message}`)}
fs.writeFileSync(FILE,s);
console.log('[AXIS 8.21 Active Home stage compat] PASS · inherited remaining countdown + zero-tone source retained · add-set visibility contract retained inside integrated stage');
