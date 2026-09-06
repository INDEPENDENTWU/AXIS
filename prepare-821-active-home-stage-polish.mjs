import fs from 'node:fs';

const FILE='v87-runtime.js';
const fail=m=>{throw new Error(`[AXIS 8.21 Active Home stage polish] ${m}`)};
let src=fs.readFileSync(FILE,'utf8');
const tail="`; (D.head||D.documentElement).appendChild(st)}";
const hits=src.split(tail).length-1;
if(hits!==1)fail(`stage style tail expected once, found ${hits}`);

/*
 * Final ordinary-Active Home presentation: keep the proven v87 action/truth
 * owner, but make the execution surface share AXIS's native content rail.
 * This layer is CSS-only. It removes the duplicated legacy Home hero while the
 * integrated stage is visible, flattens the stage, gives Adjust its own row,
 * and limits motion to short transform/opacity transitions.
 */
const css=String.raw`
/* AXIS 8.21 Active Home Stage — flat native rail */
body.v87-now #activeHome>.liveHead,
body.v87-now #activeHome>.metricPair.compact{display:none!important}
html body #v87Now.axis821ActiveStage{
  position:relative!important;left:auto!important;right:auto!important;bottom:auto!important;transform:none!important;
  width:100%!important;max-width:none!important;min-height:0!important;margin:8px 0 24px!important;
  border:1px solid var(--line2)!important;border-radius:20px!important;padding:0!important;overflow:hidden!important;
  background:var(--s1)!important;box-shadow:none!important;backdrop-filter:none!important;-webkit-backdrop-filter:none!important;
  contain:layout paint;isolation:isolate
}
html body #v87Now.axis821ActiveStage:before{display:none!important}
html body #v87Now.axis821ActiveStage .v87Axis{height:2px!important;background:var(--line2)!important}
html body #v87Now.axis821ActiveStage .v87Axis i{transition:width .32s cubic-bezier(.2,.8,.2,1)!important}
html body #v87Now.axis821ActiveStage .axis821StageHeader{
  min-height:54px!important;padding:12px 16px 0!important;align-items:center!important
}
html body #v87Now.axis821ActiveStage .axis821StageStatus{gap:8px!important}
html body #v87Now.axis821ActiveStage .axis821StageStatus i{box-shadow:0 0 0 4px var(--soft)!important}
html body #v87Now.axis821ActiveStage .axis821StageFinish{
  height:38px!important;min-width:96px!important;padding:0 12px!important;border-radius:13px!important;
  background:transparent!important;box-shadow:inset 0 0 0 1px var(--line)!important;color:var(--muted)!important
}
html body #v87Now.axis821ActiveStage .axis821StageCore{
  min-height:158px!important;padding:12px 16px 16px!important;align-items:center!important;text-align:center!important
}
html body #v87Now.axis821ActiveStage .v87Name{
  width:100%!important;margin:0!important;text-align:center!important;font-size:19px!important;font-weight:680!important
}
html body #v87Now.axis821ActiveStage .axis821StageClock{
  margin-top:12px!important;font-size:clamp(54px,15vw,70px)!important;line-height:.94!important;font-weight:600!important;
  text-align:center!important;text-shadow:none!important;transition:opacity .18s ease,transform .2s cubic-bezier(.2,.8,.2,1)!important
}
html body #v87Now.axis821ActiveStage .v87Meta{
  width:100%!important;margin-top:11px!important;text-align:center!important;color:var(--dim)!important;font-size:11px!important;line-height:1.45!important
}
html body #v87Now.axis821ActiveStage .axis821StageFact{
  width:100%!important;max-width:none!important;margin-top:14px!important;padding-top:12px!important;
  border-top:1px solid var(--line2)!important;color:var(--muted)!important
}
html body #v87Now.axis821ActiveStage .axis821StageControls.v87Actions{
  display:grid!important;grid-template-columns:minmax(0,1fr) minmax(0,1.18fr)!important;grid-auto-rows:auto!important;
  gap:10px!important;align-items:stretch!important;padding:0 16px 14px!important;min-height:0!important
}
html body #v87Now.axis821ActiveStage #v87Toggle,
html body #v87Now.axis821ActiveStage #v87Primary,
html body #v87Now.axis821ActiveStage #v87Add{
  position:relative!important;width:100%!important;max-width:none!important;height:58px!important;min-height:58px!important;
  margin:0!important;border-radius:17px!important;transform:none;box-shadow:none!important
}
html body #v87Now.axis821ActiveStage #v87Toggle{
  grid-column:1!important;grid-row:1!important;background:var(--s2)!important;color:var(--text)!important
}
html body #v87Now.axis821ActiveStage #v87Primary,
html body #v87Now.axis821ActiveStage #v87Add{grid-column:2!important;grid-row:1!important}
html body #v87Now.axis821ActiveStage #v87Primary{
  background:var(--accent)!important;color:#fff!important;font-size:14px!important;font-weight:720!important
}
html body #v87Now.axis821ActiveStage #v87Add{
  background:var(--soft)!important;color:var(--accent2)!important;font-size:13px!important;font-weight:680!important
}
html body #v87Now.axis821ActiveStage[data-primary="none"] #v87Toggle{grid-column:1/-1!important}
html body #v87Now.axis821ActiveStage #v87AdjustBtn{
  position:static!important;grid-column:1/-1!important;grid-row:2!important;justify-self:stretch!important;
  width:100%!important;max-width:none!important;height:42px!important;min-height:42px!important;margin:0!important;padding:0 12px!important;
  border:1px solid var(--line2)!important;border-radius:14px!important;background:transparent!important;color:var(--muted)!important;
  box-shadow:none!important;font-size:11px!important;font-weight:620!important;z-index:auto!important
}
html body #v87Now.axis821ActiveStage .v87Rest{
  min-height:20px!important;padding:0 16px 11px!important;text-align:center!important;color:var(--dim)!important
}
html body #v87Now.axis821ActiveStage .v87Paused{padding:0 16px 14px!important}
html body #v87Now.axis821ActiveStage.show{animation:axis821StageIn .24s cubic-bezier(.2,.8,.2,1) both!important}
html body #v87Now.axis821ActiveStage.axis821-set-bump .axis821StageClock{animation:axis821SetBump .22s cubic-bezier(.2,.8,.2,1)!important}
html body #v87Now.axis821ActiveStage.axis821-state-shift .axis821StageCore{animation:axis821StateShift .18s cubic-bezier(.2,.8,.2,1)!important}
html body #v87Now.axis821ActiveStage button:active{transform:scale(.988)!important}
@media(max-width:420px){
  html body #v87Now.axis821ActiveStage{min-height:0!important;margin:8px 0 20px!important;border-radius:18px!important}
  html body #v87Now.axis821ActiveStage .axis821StageHeader{min-height:48px!important;padding:8px 14px 0!important}
  html body #v87Now.axis821ActiveStage .axis821StageCore{min-height:118px!important;padding:5px 14px 8px!important}
  html body #v87Now.axis821ActiveStage .axis821StageClock{margin-top:7px!important;font-size:clamp(52px,15vw,66px)!important}
  html body #v87Now.axis821ActiveStage .v87Meta{margin-top:7px!important}
  html body #v87Now.axis821ActiveStage .axis821StageFact{margin-top:7px!important;padding-top:7px!important}
  html body #v87Now.axis821ActiveStage .axis821StageControls.v87Actions{padding:0 14px 10px!important;gap:9px!important}
  html body #v87Now.axis821ActiveStage #v87Toggle,
  html body #v87Now.axis821ActiveStage #v87Primary,
  html body #v87Now.axis821ActiveStage #v87Add{height:56px!important;min-height:56px!important}
  html body #v87Now.axis821ActiveStage #v87AdjustBtn{height:40px!important;min-height:40px!important}
  html body #v87Now.axis821ActiveStage .v87Rest{min-height:16px!important;padding:0 14px 7px!important}
  html body #v87Now.axis821ActiveStage .v87Paused{padding-left:14px!important;padding-right:14px!important;padding-bottom:10px!important}
}
@media(prefers-reduced-motion:reduce){
  html body #v87Now.axis821ActiveStage.show,
  html body #v87Now.axis821ActiveStage.axis821-set-bump .axis821StageClock,
  html body #v87Now.axis821ActiveStage.axis821-state-shift .axis821StageCore{animation:none!important}
  html body #v87Now.axis821ActiveStage *,html body #v87Now.axis821ActiveStage{transition-duration:.01ms!important}
}
`;

src=src.replace(tail,css+'\n'+tail);
try{new Function(src)}catch(e){fail(`v87 syntax ${e.message}`)}
fs.writeFileSync(FILE,src);
console.log('[AXIS 8.21 Active Home stage polish] PASS · one flat native Home rail · duplicate legacy hero suppressed · Adjust owns a separate row · compact mobile dock clearance · bounded compositor-only motion · v87 ownership unchanged');
