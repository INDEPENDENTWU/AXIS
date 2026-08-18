import fs from 'node:fs';

const fail=m=>{throw new Error(`[AXIS 8.12.1 hotfix] ${m}`)};
const read=f=>{if(!fs.existsSync(f))fail(`missing ${f}`);return fs.readFileSync(f,'utf8')};
const write=(f,s)=>fs.writeFileSync(f,s);
const once=(src,from,to,label)=>{const n=src.split(from).length-1;if(n!==1)fail(`${label} expected once, found ${n}`);return src.replace(from,to)};

// P0: harden the existing canonical Group Plan entry instead of introducing a
// second planner owner. v874-set-bridge continues to own plan UI and commits.
{
  const f='v874-set-bridge.js';
  let s=read(f);
  s=once(s,"let planN=1,planMode='same',planBase=null,lastPlanLabel='';","let planN=1,planMode='same',planBase=null,lastPlanLabel='',planTouchAt=0;",'group-plan touch state');
  const oldEnsure="function ensurePlanEntry(){const h=host(),head=$('.v8SetHead',h);if(!h||!head)return;let entry=$('.v875PlanEntry',h);if(!entry){entry=D.createElement('button');entry.className='v875PlanEntry';entry.dataset.v875Plan='1';const reset=$('#resetPrevious8',h);(reset||head).insertAdjacentElement('afterend',entry)}const n=rows().length||1;entry.innerHTML=`<span><b>组计划</b><small>${lastPlanLabel||'批量设置重量与次数'}</small></span><strong>${n}组</strong><i>›</i>`}";
  const modernEnsure="function ensurePlanEntry(){const h=host(),head=$('.v8SetHead',h);if(!h||!head)return;let entry=$('.v875PlanEntry',h);if(!entry){entry=D.createElement('button');entry.type='button';entry.className='v875PlanEntry v8121PlanButton';entry.dataset.v875Plan='1';entry.setAttribute('aria-label','打开组计划');const reset=$('#resetPrevious8',h);(reset||head).insertAdjacentElement('afterend',entry)}else{entry.type='button';entry.classList.add('v8121PlanButton');entry.dataset.v875Plan='1';entry.setAttribute('aria-label','打开组计划')}const n=rows().length||1;entry.innerHTML=`<span><b>组计划</b><small>${lastPlanLabel||'批量设置重量与次数'}</small></span><strong>${n}组</strong><i>›</i>`}";
  s=once(s,oldEnsure,modernEnsure,'canonical native group-plan button');
  const oldClick="D.addEventListener('click',e=>{const plan=e.target.closest('[data-v875-plan]');if(plan){openPlan();return}";
  const modernClick="D.addEventListener('pointerup',e=>{const plan=e.target.closest?.('[data-v875-plan]');if(!plan||e.pointerType!=='touch')return;e.preventDefault();planTouchAt=Date.now();openPlan()},true);D.addEventListener('click',e=>{const plan=e.target.closest('[data-v875-plan]');if(plan){if(Date.now()-planTouchAt<650)return;openPlan();return}";
  s=once(s,oldClick,modernClick,'touch-safe canonical group-plan activation');
  write(f,s);
}

// Visual convergence: keep Learning / Cloud+AI inside the canonical Settings surface,
// but use AXIS native typography/touch geometry rather than the prior micro-UI scale.
{
  const f='v87-runtime.js';
  let s=read(f);
  if(s.includes('__AXIS_8121_HOTFIX__'))fail('hotfix already installed');
  const end=s.lastIndexOf('})();');
  if(end<0)fail('v87 runtime IIFE end missing');
  const block=String.raw`
/* AXIS 8.12.1 — field hotfix: native Settings rhythm + reliable Group Plan touch target. */
(function axis8121InstallHotfixStyle(){
 if(document.querySelector('#v8121HotfixStyle'))return;
 const st=document.createElement('style');st.id='v8121HotfixStyle';st.textContent=
 '#settingsSheet .v813SettingsGate{margin-top:0!important;border-top:0!important}'+
 '#settingsSheet .v813SettingsGate>.settingLink{height:60px!important;min-height:60px!important;padding:0!important;grid-template-columns:minmax(0,1fr) auto 15px!important;gap:10px!important;border-top:0!important;border-bottom:1px solid var(--line2)!important}'+
 '#settingsSheet .v813SettingsGate.open>.settingLink{border-bottom:0!important}'+
 '#settingsSheet .v813SettingsGate>.settingLink>span{font-size:13px!important;font-weight:520!important;line-height:1.3!important}'+
 '#settingsSheet .v813SettingsGate>.settingLink>b{font-size:12px!important;font-weight:620!important;line-height:1.3!important;max-width:50vw!important}'+
 '#settingsSheet .v813SettingsGate>.settingLink>i{font-size:20px!important}'+
 '#settingsSheet .v813SettingsGate>.v8711Fold{padding:0 0 14px!important;border:0!important}'+
 '#settingsSheet #v810ConfigPanel,#settingsSheet #v811ServicePanel{position:static!important;display:block!important;width:100%!important;max-height:none!important;margin:0!important;padding:4px 0 10px!important;border:0!important;border-radius:0!important;background:transparent!important;box-shadow:none!important;overflow:visible!important}'+
 '#settingsSheet #v810ConfigHead,#settingsSheet #v811ServicePanel>.grabber,#settingsSheet #v811ServicePanel>.sheetHead{display:none!important}'+
 '#settingsSheet .v810ConfigIntro{margin:0 0 14px!important;font-size:13px!important;line-height:1.55!important;color:var(--muted)!important}'+
 '#settingsSheet .v810ConfigGroup,#settingsSheet .v811CoreGroup,#settingsSheet .v811ServiceGroup{margin:0!important;padding:14px 0!important;border:0!important}'+
 '#settingsSheet .v810ConfigGroup+.v810ConfigGroup,#settingsSheet .v811CoreGroup+.v811CoreGroup,#settingsSheet .v811ServiceGroup+.v811ServiceGroup{padding-top:16px!important}'+
 '#settingsSheet .v810ConfigGroup>span,#settingsSheet .v811CoreHead span,#settingsSheet .v813ServiceHead span{display:block!important;margin:0 0 10px!important;font-size:13px!important;line-height:1.35!important;color:var(--muted)!important;font-weight:520!important;letter-spacing:0!important}'+
 '#settingsSheet .v811CoreHead,#settingsSheet .v813ServiceHead{min-height:0!important;margin:0 0 10px!important}'+
 '#settingsSheet .v811CoreHead b,#settingsSheet .v813ServiceHead b{font-size:12px!important;line-height:1.35!important;color:var(--dim)!important;font-weight:600!important}'+
 '#settingsSheet #v810SpeakControls [data-v810-options],#settingsSheet .v811CoreOptions,#settingsSheet .v811ServiceOptions,#settingsSheet .v811ServiceSeg{display:grid!important;grid-template-columns:repeat(3,minmax(0,1fr))!important;gap:8px!important}'+
 '#settingsSheet #v810SpeakControls [data-v810-options] button,#settingsSheet .v811CoreOptions button,#settingsSheet .v811ServiceOptions button,#settingsSheet .v811ServiceSeg button{min-width:0!important;min-height:42px!important;height:42px!important;padding:0 10px!important;border-radius:12px!important;font-size:13px!important;line-height:1.15!important;font-weight:560!important;white-space:nowrap!important;overflow:hidden!important;text-overflow:ellipsis!important;touch-action:manipulation!important}'+
 '#settingsSheet #v810SpeakControls [data-v810-options] button.active,#settingsSheet .v811CoreOptions button.active,#settingsSheet .v811ServiceOptions button.active,#settingsSheet .v811ServiceSeg button.active{font-weight:660!important}'+
 '#settingsSheet #v811FineTune{margin:6px 0 0!important;border:0!important}'+
 '#settingsSheet #v811FineTune>summary{min-height:48px!important;padding:0!important;display:flex!important;align-items:center!important;justify-content:space-between!important;font-size:13px!important;line-height:1.35!important;color:var(--muted)!important}'+
 '#settingsSheet #v811FineTuneState{font-size:12px!important;color:var(--text)!important}'+
 '#settingsSheet .v810Recap{margin-top:8px!important;padding:14px 0 0!important;border:0!important}'+
 '#settingsSheet .v810Recap span,#settingsSheet .v810Recap small{font-size:12px!important;line-height:1.45!important;color:var(--muted)!important}'+
 '#settingsSheet .v810Recap b{font-size:14px!important;line-height:1.4!important}'+
 '#settingsSheet [data-v810-standalone-start],#settingsSheet [data-v810-recap]{min-height:44px!important;font-size:13px!important}'+
 '#settingsSheet .v813ServiceBlock{padding:14px 0!important;border:0!important}'+
 '#settingsSheet .v813ServiceDetails{margin:0!important;border:0!important}'+
 '#settingsSheet .v813ServiceDetails>summary{min-height:48px!important;padding:0!important;font-size:13px!important;line-height:1.35!important;color:var(--muted)!important}'+
 '#settingsSheet .v811ServiceFacts{margin:0!important}'+
 '#settingsSheet .v811ServiceFact{min-height:46px!important;padding:0!important;border:0!important;font-size:13px!important}'+
 '#settingsSheet .v811ServiceFact span,#settingsSheet .v811ServiceFact b{font-size:13px!important;line-height:1.4!important}'+
 '#settingsSheet .v811ServiceFact span{color:var(--muted)!important}'+
 '#settingsSheet .v811ServiceFact b{color:var(--text)!important;font-weight:600!important;text-align:right!important}'+
 '#settingsSheet .v811PrivacyRow{min-height:48px!important;padding:0!important;border:0!important}'+
 '#settingsSheet .v811PrivacyRow span{font-size:13px!important;line-height:1.4!important;color:var(--muted)!important}'+
 '#settingsSheet .v811PrivacyRow button{min-width:72px!important;height:40px!important;padding:0 12px!important;border-radius:12px!important;font-size:12.5px!important;font-weight:600!important;touch-action:manipulation!important}'+
 '#settingsSheet .v811ServiceNote{margin:8px 0 0!important;font-size:12px!important;line-height:1.55!important;color:var(--muted)!important}'+
 '.v875PlanEntry.v8121PlanButton{position:relative!important;z-index:8!important;pointer-events:auto!important;touch-action:manipulation!important;-webkit-tap-highlight-color:transparent!important;min-height:56px!important}'+
 '.v875PlanEntry.v8121PlanButton:active{background:rgba(255,255,255,.035)!important}'+
 '@media(max-width:380px){#settingsSheet #v810SpeakControls [data-v810-options],#settingsSheet .v811CoreOptions,#settingsSheet .v811ServiceOptions,#settingsSheet .v811ServiceSeg{gap:7px!important}#settingsSheet #v810SpeakControls [data-v810-options] button,#settingsSheet .v811CoreOptions button,#settingsSheet .v811ServiceOptions button,#settingsSheet .v811ServiceSeg button{padding:0 7px!important;font-size:12.5px!important}}';
 (document.head||document.documentElement).appendChild(st);
})();
window.__AXIS_8121_HOTFIX__={version:'8.12.1',settings:'native-rhythm',groupPlan:'canonical-native-button-touch',recordingOwner:false};
`;
  s=s.slice(0,end)+block+s.slice(end);
  write(f,s);
}

console.log('[AXIS 8.12.1 hotfix] PASS · native Settings rhythm · no outer gate divider · touch-safe canonical Group Plan button · recording ownership preserved');
