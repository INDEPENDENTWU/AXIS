import fs from 'node:fs';

const FILE='v87-runtime.js';
const fail=m=>{throw new Error(`[AXIS 8.21 Active Home stage compat] ${m}`)};
let s=fs.readFileSync(FILE,'utf8');
const once=(from,to,label)=>{const n=s.split(from).length-1;if(n!==1)fail(`${label} expected once, found ${n}`);s=s.replace(from,to)};

/* Preserve inherited Active countdown/tone/rest semantics and resolve set
   controls from immutable Encounter execution truth. This is presentation-only:
   v87 remains the sole pause/resume/set/finish action owner. */
once(
 "rest=a.restStartedAt&&a.status==='active'?now()-a.restStartedAt:0,status=",
 "rest=a.status==='paused'?restElapsed(a):0,remaining=Math.max(0,est-actual),execution=String(e.executionModeSnapshot||''),setMode=execution==='sets'||(!execution&&e.kind==='strength'),status=",
 'pause-owned rest / remaining / execution derivation'
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

/* Preserve the inherited stable geometry signature. Timed/non-set execution
   already hides the add-set button through the execution-aware branch above. */
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

/* Inherited fixed-card CSS still contains stronger ID + !important geometry.
   Add one geometry-only supersede with greater specificity. It deliberately
   does not own display, so .show continues to control stage visibility. The
   parent #activeHome already sits on the exact 22px Home/capture-dock rail. */
once(
 'backdrop-filter:none;-webkit-backdrop-filter:none;isolation:isolate}',
 'backdrop-filter:none;-webkit-backdrop-filter:none;isolation:isolate}html body #v87Now.axis821ActiveStage{position:relative!important;left:auto!important;right:auto!important;bottom:auto!important;transform:none!important;width:100%!important;max-width:none!important;margin:2px 0 22px!important}html body #v87Now.axis821ActiveStage #v87Toggle,html body #v87Now.axis821ActiveStage #v87Primary,html body #v87Now.axis821ActiveStage #v87Add{height:60px!important;min-height:60px!important;width:100%!important;max-width:none!important}',
 'high-specificity integrated Home geometry'
);

try{new Function(s)}catch(e){fail(`v87 syntax ${e.message}`)}
fs.writeFileSync(FILE,s);
console.log('[AXIS 8.21 Active Home stage compat] PASS · inherited countdown/glyph/geometry + pause-owned rest · execution-aware set controls · standalone learning lifetime · high-specificity integrated Home rail');
