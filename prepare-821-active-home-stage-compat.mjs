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

/* 8.10.2 standalone learning intentionally survives an idle-Home repaint.
   The large stage still hides when there is no Active item, but it must not
   close an explicitly opened standalone learning panel as a side effect. */
once(
 "if(!target||!today||!activeHome||sheet){host.classList.remove('show','axis821-set-bump','axis821-state-shift');D.body.classList.remove('v87-now');return}",
 "if(!target||!today||!activeHome||sheet){const keepStandalone=!sheet&&axis8102PanelSource()==='standalone';if(!keepStandalone)axis891CloseSpeak();host.classList.remove('show','axis821-set-bump','axis821-state-shift');D.body.classList.remove('v87-now');return}",
 'standalone learning lifetime'
);

/* The old floating card matched the bottom dock rails. The integrated stage
   lives inside activeHome, whose content rail is 22px narrower on each side.
   Expand only the stage back to the established Home/dock rail so it reads as
   a real execution surface rather than a card nested inside another card. */
once(
 '.v87Now.axis821ActiveStage{display:none;position:relative;left:auto;bottom:auto;transform:none;width:100%;max-width:none;z-index:auto;min-height:338px;margin:2px 0 22px;',
 '.v87Now.axis821ActiveStage{display:none;position:relative;left:auto;bottom:auto;transform:none;width:calc(100% + 44px);max-width:none;z-index:auto;min-height:338px;margin:2px 0 22px -22px;',
 'Home/dock rail alignment'
);

try{new Function(s)}catch(e){fail(`v87 syntax ${e.message}`)}
fs.writeFileSync(FILE,s);
console.log('[AXIS 8.21 Active Home stage compat] PASS · inherited countdown/tone + add-set geometry + standalone learning lifetime retained · integrated stage aligned to Home/dock rails');
