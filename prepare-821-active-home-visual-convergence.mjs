import fs from 'node:fs';

const FILE='v87-runtime.js';
const fail=m=>{throw new Error(`[AXIS 8.21 Active Home visual convergence] ${m}`)};
let s=fs.readFileSync(FILE,'utf8');
const once=(from,to,label)=>{const n=s.split(from).length-1;if(n!==1)fail(`${label} expected once, found ${n}`);s=s.replace(from,to)};

/*
 * Product-only convergence for the integrated ordinary Active stage.
 * This pass deliberately owns no state, timing, persistence, set completion,
 * finish behavior, recorder behavior or Flow behavior. It only resolves the
 * visual system around the already-proven v87 controls, including one visible
 * rest clock and a branded hold affordance that still delegates to v87.
 */
const ensureSig='function ensureUI()';
if(s.includes('function axis821ActiveStageRefineStyle()'))fail('refine style duplicated');
const styleBlock=`
function axis821ActiveStageRefineStyle(){if($('#axis821ActiveStageRefineStyle'))return;const st=D.createElement('style');st.id='axis821ActiveStageRefineStyle';st.textContent=\`
html body #v87Now.axis821ActiveStage{position:relative!important;left:auto!important;right:auto!important;bottom:auto!important;transform:none!important;width:100%!important;max-width:none!important;min-height:0!important;margin:0 0 28px!important;padding:0!important;border-radius:0!important;border-top:1px solid var(--line2)!important;border-bottom:1px solid var(--line2)!important;background:transparent!important;box-shadow:none!important;overflow:visible!important;isolation:auto!important}
html body #v87Now.axis821ActiveStage:before{display:none!important}
html body #v87Now.axis821ActiveStage .v87Axis{height:1px!important;background:var(--line2)!important}
html body #v87Now.axis821ActiveStage .v87Axis i{background:var(--accent)!important}
html body #v87Now.axis821ActiveStage .axis821StageHeader{min-height:50px!important;padding:15px 0 0!important;gap:12px!important}
html body #v87Now.axis821ActiveStage .axis821StageStatus{gap:8px!important}
html body #v87Now.axis821ActiveStage .axis821StageStatus i{width:6px!important;height:6px!important;box-shadow:none!important;background:var(--accent)!important}
html body #v87Now.axis821ActiveStage[data-status="paused"] .axis821StageStatus i{background:var(--dim)!important}
html body #v87Now.axis821ActiveStage .axis821StageStatus .v87State{font-size:11px!important;font-weight:620!important;letter-spacing:0!important;color:var(--muted)!important}
html body #v87Now.axis821ActiveStage .axis821StageFinish{height:38px!important;min-width:96px!important;padding:0 13px!important;border:1px solid rgba(115,124,255,.24)!important;border-radius:13px!important;background:linear-gradient(180deg,rgba(24,27,36,.96),rgba(14,17,23,.96))!important;color:#aeb4c6!important;font-size:10.5px!important;font-weight:650!important;letter-spacing:.01em!important;box-shadow:inset 0 1px 0 rgba(255,255,255,.045),0 4px 14px rgba(0,0,0,.14)!important;-webkit-tap-highlight-color:transparent!important;transition:transform .12s ease,background .18s ease,border-color .18s ease,color .18s ease!important}
html body #v87Now.axis821ActiveStage .axis821StageFinish:before{inset:0!important;border-radius:12px!important;background:conic-gradient(from -90deg,var(--accent) var(--p,0deg),rgba(115,124,255,.08) 0)!important}
html body #v87Now.axis821ActiveStage .axis821StageFinish i{width:8px!important;height:8px!important;border:1px solid rgba(142,150,255,.72)!important;border-radius:2px!important;background:rgba(115,124,255,.12)!important;box-shadow:0 0 0 3px rgba(115,124,255,.055)!important;transform:rotate(45deg)!important;opacity:1!important}
html body #v87Now.axis821ActiveStage .axis821StageFinish:active{transform:translateY(1px) scale(.975)!important;background:linear-gradient(180deg,rgba(29,32,43,.98),rgba(16,19,26,.98))!important;border-color:rgba(142,150,255,.42)!important;color:#d8dbea!important}
html body #v87Now.axis821ActiveStage .axis821StageFinish:focus-visible{outline:2px solid rgba(142,150,255,.55)!important;outline-offset:2px!important}
html body #v87Now.axis821ActiveStage .axis821StageCore{min-height:176px!important;padding:17px 0 19px!important;text-align:center!important;align-items:center!important;justify-content:center!important}
html body #v87Now.axis821ActiveStage .v87Name{width:100%!important;max-width:100%!important;margin:0!important;padding:0 4px!important;text-align:center!important;font-size:18px!important;font-weight:660!important;letter-spacing:-.02em!important}
html body #v87Now.axis821ActiveStage .axis821StageClock{width:100%!important;margin-top:14px!important;text-align:center!important;font-size:clamp(58px,15vw,74px)!important;line-height:.94!important;font-weight:590!important;letter-spacing:-.055em!important;text-shadow:none!important}
html body #v87Now.axis821ActiveStage .v87Meta{width:100%!important;margin-top:12px!important;text-align:center!important;color:var(--dim)!important;font-size:11px!important;line-height:1.45!important}
html body #v87Now.axis821ActiveStage .axis821StageFact{width:100%!important;display:grid!important;grid-template-columns:minmax(0,1fr) minmax(0,1fr)!important;align-items:center!important;gap:16px!important;margin-top:17px!important;padding-top:12px!important;border-top:1px solid var(--line2)!important;font-size:10.5px!important;color:var(--dim)!important}
html body #v87Now.axis821ActiveStage .axis821StageFact span:first-child{text-align:left!important;min-width:0!important;white-space:nowrap!important;overflow:hidden!important;text-overflow:ellipsis!important}
html body #v87Now.axis821ActiveStage .axis821StageFact span:last-child{text-align:right!important;min-width:0!important;white-space:nowrap!important;overflow:hidden!important;text-overflow:ellipsis!important}
html body #v87Now.axis821ActiveStage .axis821StageControls{display:grid!important;grid-template-columns:minmax(0,1fr) minmax(0,1fr)!important;grid-auto-rows:auto!important;align-items:start!important;gap:10px!important;padding:0!important;margin:0!important}
html body #v87Now.axis821ActiveStage .axis821StageControls>button{box-sizing:border-box!important}
html body #v87Now.axis821ActiveStage #v87Toggle,html body #v87Now.axis821ActiveStage #v87Primary,html body #v87Now.axis821ActiveStage #v87Add{height:58px!important;min-height:58px!important;width:100%!important;max-width:none!important;border-radius:16px!important;box-shadow:none!important}
html body #v87Now.axis821ActiveStage #v87Toggle{grid-column:1!important;grid-row:1!important;border:1px solid var(--line2)!important;background:var(--s1)!important;color:var(--text)!important}
html body #v87Now.axis821ActiveStage #v87Primary,html body #v87Now.axis821ActiveStage #v87Add{grid-column:2!important;grid-row:1!important}
html body #v87Now.axis821ActiveStage #v87Primary{background:var(--accent)!important;color:#fff!important;font-size:14px!important;font-weight:700!important}
html body #v87Now.axis821ActiveStage #v87Add{background:var(--soft)!important;color:var(--accent2)!important;font-size:13px!important;font-weight:670!important}
html body #v87Now.axis821ActiveStage[data-primary="none"] .axis821StageControls{grid-template-columns:minmax(0,1fr)!important}
html body #v87Now.axis821ActiveStage[data-primary="none"] #v87Toggle{grid-column:1!important;width:100%!important}
html body #v87Now.axis821ActiveStage #v87AdjustBtn{position:static!important;top:auto!important;right:auto!important;bottom:auto!important;left:auto!important;grid-column:1/-1!important;grid-row:2!important;justify-self:end!important;width:auto!important;max-width:none!important;min-width:0!important;height:34px!important;min-height:34px!important;margin:5px 0 10px!important;padding:0 2px 0 12px!important;border:0!important;border-radius:10px!important;background:transparent!important;color:var(--dim)!important;font-size:11px!important;font-weight:600!important;box-shadow:none!important;z-index:auto!important}
html body #v87Now.axis821ActiveStage #v87AdjustBtn:active{background:var(--s1)!important;color:var(--muted)!important}
html body #v87Now.axis821ActiveStage .v87Rest{box-sizing:border-box!important;height:auto!important;min-height:0!important;margin:0!important;padding:0 0 12px!important;text-align:left!important;color:var(--dim)!important;font-size:10.5px!important;line-height:1.5!important}
html body #v87Now.axis821ActiveStage .v87Rest:empty{display:none!important}
html body #v87Now.axis821ActiveStage .v87Paused{gap:7px!important;padding:0 0 14px!important}
html body #v87Now.axis821ActiveStage .v87Paused button{height:34px!important;border:1px solid var(--line2)!important;border-radius:11px!important;background:transparent!important}
@media(max-width:420px){html body #v87Now.axis821ActiveStage{min-height:0!important;margin:0 0 24px!important}html body #v87Now.axis821ActiveStage .axis821StageHeader{min-height:46px!important;padding-top:12px!important}html body #v87Now.axis821ActiveStage .axis821StageCore{min-height:158px!important;padding:13px 0 16px!important}html body #v87Now.axis821ActiveStage .axis821StageClock{margin-top:11px!important;font-size:clamp(56px,16vw,68px)!important}html body #v87Now.axis821ActiveStage .v87Meta{margin-top:9px!important}html body #v87Now.axis821ActiveStage .axis821StageFact{margin-top:14px!important;padding-top:10px!important;gap:12px!important}html body #v87Now.axis821ActiveStage .axis821StageControls{gap:8px!important}html body #v87Now.axis821ActiveStage #v87Toggle,html body #v87Now.axis821ActiveStage #v87Primary,html body #v87Now.axis821ActiveStage #v87Add{height:56px!important;min-height:56px!important;border-radius:15px!important}html body #v87Now.axis821ActiveStage #v87AdjustBtn{height:32px!important;min-height:32px!important;margin:5px 0 9px!important}html body #v87Now.axis821ActiveStage .axis821StageFinish{height:36px!important;min-width:92px!important}html body #v87Now.axis821ActiveStage .v87Rest{padding-bottom:10px!important}}
@media(prefers-reduced-motion:reduce){html body #v87Now.axis821ActiveStage #v87AdjustBtn,html body #v87Now.axis821ActiveStage .axis821StageFinish{transition:none!important}}
\`; (D.head||D.documentElement).appendChild(st)}
`;
once(ensureSig,styleBlock+ensureSig,'refine style insertion');
once(
 'function renderNow(force=false){ensureUI();axis821ActiveStageStyle();',
 'function renderNow(force=false){ensureUI();axis821ActiveStageStyle();axis821ActiveStageRefineStyle();',
 'refine style activation'
);
once(
 "$('#axis821StageRest').textContent=rest?('休息 '+clock(rest)):a.status==='paused'?'计时暂停':planDone?'计划完成':' ';",
 "$('#axis821StageRest').textContent=rest?'组间休息':a.status==='paused'?'计时暂停':planDone?'计划完成':' ';",
 'single visible rest clock'
);

if(s.includes('__AXIS_821_ACTIVE_HOME_VISUAL__'))fail('visual marker duplicated');
s+=`\nwindow.__AXIS_821_ACTIVE_HOME_VISUAL__={version:'8.21',surface:'flat-integrated-home',clock:'centered',controls:'balanced-two-column',adjust:'separate-tertiary-row',rest:'single-visible-clock',finish:'tactile-brand-hold',stateOwner:'v87',newStorage:false,newWriter:false,newActionOwner:false};\n`;
try{new Function(s)}catch(e){fail(`v87 syntax ${e.message}`)}
fs.writeFileSync(FILE,s);
console.log('[AXIS 8.21 Active Home visual convergence] PASS · flat Home-integrated surface · centered execution clock · balanced controls · branded tactile hold · single visible rest clock · isolated Adjust row · v87 ownership unchanged');
