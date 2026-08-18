import fs from 'node:fs';

const fail=m=>{throw new Error(`[AXIS 8.12.1 hotfix] ${m}`)};
const read=f=>{if(!fs.existsSync(f))fail(`missing ${f}`);return fs.readFileSync(f,'utf8')};
const write=(f,s)=>fs.writeFileSync(f,s);
const once=(src,from,to,label)=>{const n=src.split(from).length-1;if(n!==1)fail(`${label} expected once, found ${n}`);return src.replace(from,to)};

// P0: make Group Plan a real native button while preserving the legacy <b> value node
// and the existing canonical recording/applyPlan ownership chain.
{
  const f='v874-professional.js';
  let s=read(f);
  const old="function patchSetPlan(){const box=$('#v8SetEditor');if(!box)return;const count=$('.v8SetCount',box);if(!count)return;const n=$$('.v8SetRow',box).length||1,b=$('b',count);if(b){b.setAttribute('data-v874-plan','1');const html=`${n}组<small>规划</small>`;if(b.innerHTML!==html)b.innerHTML=html}if(!seedDone)seedSingleSet()}";
  const modern="function patchSetPlan(){const box=$('#v8SetEditor');if(!box)return;const count=$('.v8SetCount',box);if(!count)return;const n=$$('.v8SetRow',box).length||1;let trigger=$('.v8121PlanButton',count),value=$('b',count);if(!trigger){trigger=D.createElement('button');trigger.type='button';trigger.className='v875PlanEntry v8121PlanButton';trigger.dataset.v874Plan='1';trigger.setAttribute('aria-label','打开组计划');if(value){value.removeAttribute('data-v874-plan');value.replaceWith(trigger);trigger.appendChild(value)}else{value=D.createElement('b');trigger.appendChild(value);count.appendChild(trigger)}}else value=$('b',trigger)||value;if(value){const html=`${n}组<small>组计划</small>`;if(value.innerHTML!==html)value.innerHTML=html}trigger.dataset.v874Plan='1';trigger.disabled=false;if(!seedDone)seedSingleSet()}";
  s=once(s,old,modern,'native group-plan button');
  const oldCss='.v8SetCount b[data-v874-plan]{min-width:66px;display:flex;align-items:baseline;justify-content:center;gap:5px;cursor:pointer}.v8SetCount b[data-v874-plan] small{font-size:8.5px;color:var(--accent2);font-weight:620}';
  const newCss='.v8SetCount .v8121PlanButton{min-width:88px;min-height:44px;padding:0 10px;display:flex;align-items:center;justify-content:center;border-radius:12px;background:transparent;color:inherit;touch-action:manipulation;-webkit-tap-highlight-color:transparent}.v8SetCount .v8121PlanButton:active{background:var(--s2)}.v8SetCount .v8121PlanButton b{min-width:0;display:flex;align-items:baseline;justify-content:center;gap:6px;pointer-events:none}.v8SetCount .v8121PlanButton b small{font-size:10px;color:var(--accent2);font-weight:620;white-space:nowrap}';
  s=once(s,oldCss,newCss,'group-plan touch geometry');
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
 '#settingsSheet .v813SettingsGate>.settingLink>span{font-size:var(--axis-ui,15px)!important;font-weight:520!important;line-height:1.3!important}'+
 '#settingsSheet .v813SettingsGate>.settingLink>b{font-size:var(--axis-ui,15px)!important;font-weight:620!important;line-height:1.3!important;max-width:50vw!important}'+
 '#settingsSheet .v813SettingsGate>.settingLink>i{font-size:20px!important}'+
 '#settingsSheet .v813SettingsGate>.v8711Fold{padding:0 0 14px!important;border:0!important}'+
 '#settingsSheet #v810ConfigPanel,#settingsSheet #v811ServicePanel{position:static!important;display:block!important;width:100%!important;max-height:none!important;margin:0!important;padding:4px 0 10px!important;border:0!important;border-radius:0!important;background:transparent!important;box-shadow:none!important;overflow:visible!important}'+
 '#settingsSheet #v810ConfigHead,#settingsSheet #v811ServicePanel>.grabber,#settingsSheet #v811ServicePanel>.sheetHead{display:none!important}'+
 '#settingsSheet .v810ConfigIntro{margin:0 0 14px!important;font-size:13px!important;line-height:1.55!important;color:var(--muted)!important}'+
 '#settingsSheet .v810ConfigGroup,#settingsSheet .v811CoreGroup,#settingsSheet .v811ServiceGroup{margin:0!important;padding:14px 0!important;border:0!important}'+
 '#settingsSheet .v810ConfigGroup+.v810ConfigGroup,#settingsSheet .v811CoreGroup+.v811CoreGroup,#settingsSheet .v811ServiceGroup+.v811ServiceGroup{padding-top:16px!important}'+
 '#settingsSheet .v810ConfigGroup>span,#settingsSheet .v811CoreHead span,#settingsSheet .v811ServiceLabel{display:block!important;margin:0 0 10px!important;font-size:13px!important;line-height:1.35!important;color:var(--muted)!important;font-weight:520!important;letter-spacing:0!important}'+
 '#settingsSheet .v811CoreHead{min-height:0!important;margin:0 0 10px!important}'+
 '#settingsSheet .v811CoreHead b,#settingsSheet .v811ServiceState{font-size:12px!important;line-height:1.35!important;color:var(--dim)!important;font-weight:600!important}'+
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
 '#settingsSheet .v811ServiceInfo,#settingsSheet .v811ServiceDisclosure{margin:0!important;padding:12px 0!important;border:0!important}'+
 '#settingsSheet .v811ServiceInfo>div,#settingsSheet .v811ServiceDisclosure>div{min-height:46px!important;display:grid!important;grid-template-columns:minmax(0,1fr) auto!important;align-items:center!important;gap:16px!important;padding:0!important;border:0!important}'+
 '#settingsSheet .v811ServiceInfo span,#settingsSheet .v811ServiceDisclosure span,#settingsSheet .v811ServiceInfo b,#settingsSheet .v811ServiceDisclosure b{font-size:13px!important;line-height:1.4!important}'+
 '#settingsSheet .v811ServiceInfo span,#settingsSheet .v811ServiceDisclosure span{color:var(--muted)!important}'+
 '#settingsSheet .v811ServiceInfo b,#settingsSheet .v811ServiceDisclosure b{color:var(--text)!important;font-weight:600!important;text-align:right!important}'+
 '#settingsSheet [data-v811-service-disclosure]{min-height:46px!important;width:100%!important;padding:0!important;display:flex!important;align-items:center!important;justify-content:space-between!important;font-size:13px!important;color:var(--muted)!important}'+
 '#settingsSheet .v811ServiceSendRow{min-height:48px!important;display:grid!important;grid-template-columns:minmax(0,1fr) auto!important;align-items:center!important;gap:16px!important;padding:0!important;border:0!important;font-size:13px!important}'+
 '#settingsSheet .v811ServiceSendRow span,#settingsSheet .v811ServiceSendRow b{font-size:13px!important;line-height:1.4!important}'+
 '#settingsSheet .v811ServiceSendRow span{color:var(--muted)!important}'+
 '#settingsSheet .v811ServiceSendRow b{font-weight:600!important;text-align:right!important}'+
 '#settingsSheet .v811ServiceNote{margin:8px 0 0!important;font-size:12px!important;line-height:1.55!important;color:var(--muted)!important}'+
 '@media(max-width:380px){#settingsSheet #v810SpeakControls [data-v810-options],#settingsSheet .v811CoreOptions,#settingsSheet .v811ServiceOptions,#settingsSheet .v811ServiceSeg{gap:7px!important}#settingsSheet #v810SpeakControls [data-v810-options] button,#settingsSheet .v811CoreOptions button,#settingsSheet .v811ServiceOptions button,#settingsSheet .v811ServiceSeg button{padding:0 7px!important;font-size:12.5px!important}}';
 (document.head||document.documentElement).appendChild(st);
})();
window.__AXIS_8121_HOTFIX__={version:'8.12.1',settings:'native-rhythm',groupPlan:'native-button',recordingOwner:false};
`;
  s=s.slice(0,end)+block+s.slice(end);
  write(f,s);
}

console.log('[AXIS 8.12.1 hotfix] PASS · native Settings rhythm · no outer gate divider · native Group Plan button · canonical recording ownership preserved');
