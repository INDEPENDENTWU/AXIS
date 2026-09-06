import fs from 'node:fs';

const FILE='v87-runtime.js';
const fail=m=>{throw new Error(`[AXIS 8.21 Active Home stage compat] ${m}`)};
let s=fs.readFileSync(FILE,'utf8');
const once=(from,to,label)=>{const n=s.split(from).length-1;if(n!==1)fail(`${label} expected once, found ${n}`);s=s.replace(from,to)};

/* Preserve inherited Active countdown/tone semantics and resolve set controls
   from immutable Encounter execution truth. This is presentation-only: v87
   remains the sole pause/resume/set/finish action owner. */
once(
 "rest=a.restStartedAt&&a.status==='active'?now()-a.restStartedAt:0,status=",
 "rest=a.restStartedAt&&a.status==='active'?now()-a.restStartedAt:0,remaining=Math.max(0,est-actual),execution=String(e.executionModeSnapshot||''),setMode=execution==='sets'||(!execution&&e.kind==='strength'),status=",
 'remaining/execution derivation'
);
once(
 "$('#v87Meta').textContent='预计 '+clock(est)+(e.kind==='strength'?' · '+(tracked?(done+'/'+total+' 组'):('计划 '+total+' 组')):'');",
 "$('#v87Meta').textContent=`剩余 ${clock(remaining)} · 预计 ${clock(est)}${setMode?' · '+(tracked?(done+'/'+total+' 组'):('计划 '+total+' 组')):''}`;",
 'legacy countdown plus estimate presentation'
);
once(
 "$('#axis821StageProgressText').textContent=e.kind==='strength'?",
 "$('#axis821StageProgressText').textContent=setMode?",
 'execution-aware progress presentation'
);
once(
 "if(e.kind==='strength'&&a.status==='active')",
 "if(setMode&&a.status==='active')",
 'execution-aware set controls'
);

/* The large control keeps a visible 暂停/继续 label while the button's DOM
   innerText remains the inherited canonical glyph (Ⅱ / ▶). That preserves
   long-standing browser contracts without duplicating the action owner. */
once(
 ".axis821StageToggleGlyph{display:inline-flex;width:18px;height:18px;align-items:center;justify-content:center;color:var(--muted);font-size:13px}.axis821StageToggleLabel{font-size:13px}",
 ".axis821StageToggleGlyph{display:inline-flex;width:18px;height:18px;align-items:center;justify-content:center;color:var(--muted);font-size:13px}.axis821StageToggleLabel{display:none}.v87Now.axis821ActiveStage #v87Toggle::after{content:attr(data-label);font-size:13px;font-weight:660}",
 'visible label with inherited glyph contract'
);
once(
 "$('#axis821StageToggleLabel').textContent=a.status==='active'?'暂停':'继续';$('#v87Toggle').dataset.id=e.id;",
 "$('#axis821StageToggleLabel').textContent=a.status==='active'?'暂停':'继续';$('#v87Toggle').dataset.label=a.status==='active'?'暂停':'继续';$('#v87Toggle').dataset.id=e.id;",
 'toggle visual label state'
);

/* Keep rest/pause feedback separate from the inherited #v87Meta countdown. */
once(
 "$('#axis821StageRest').textContent=rest?('休息 '+clock(rest)):a.status==='paused'?'计时暂停':planDone?'计划完成':' ';",
 "$('#axis821StageRest').textContent=rest?('休息 '+clock(rest)):a.status==='paused'?'计时暂停':planDone?'计划完成':' ';",
 'stage fact feedback anchor'
);
once(
 "}else{host.dataset.primary='none';pri.style.display='none';add.style.display='none'}$('#v87Rest')",
 "}else{host.dataset.primary='none';pri.style.display='none';add.style.display='none'}add.style.visibility=planDone&&setMode?'visible':'hidden';$('#v87Rest')",
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

/* activeHome itself sits 22px inside the established Home/dock rail on each
   side. Expand the integrated stage by 88px and offset 22px left so the stage
   lands exactly on the same 22px viewport rail in both 390px and 430px proofs. */
once(
 '.v87Now.axis821ActiveStage{display:none;position:relative;left:auto;bottom:auto;transform:none;width:100%;max-width:none;z-index:auto;min-height:338px;margin:2px 0 22px;',
 '.v87Now.axis821ActiveStage{display:none;position:relative;left:auto;bottom:auto;transform:none;width:calc(100% + 88px);max-width:none;z-index:auto;min-height:338px;margin:2px 0 22px -22px;',
 'Home/dock rail alignment'
);

try{new Function(s)}catch(e){fail(`v87 syntax ${e.message}`)}
fs.writeFileSync(FILE,s);
console.log('[AXIS 8.21 Active Home stage compat] PASS · inherited countdown/glyph contract · execution-aware set controls · standalone learning lifetime · exact Home/dock rail alignment');
