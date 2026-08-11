(()=>{'use strict';
const D=document,$=(s,r=D)=>r.querySelector(s),$$=(s,r=D)=>Array.from(r.querySelectorAll(s));
const META='axis_v8_meta',CORE='axis_v60_state';
let audioCtx=null,lastReminderKey='';
const readMeta=()=>{try{const m=JSON.parse(localStorage.getItem(META)||'null')||{};m.events=m.events||{};m.prefs=m.prefs||{};return m}catch{return{events:{},prefs:{}}}};
const writeMeta=m=>{try{localStorage.setItem(META,JSON.stringify(m));return true}catch{return false}};
const readCore=()=>{try{return JSON.parse(localStorage.getItem(CORE)||'null')||{active:null}}catch{return{active:null}}};

function restoreServiceWorker(){
  if(!('serviceWorker' in navigator))return;
  const sw=navigator.serviceWorker;
  try{delete sw.register}catch{}
  const proto=Object.getPrototypeOf(sw),reg=proto&&proto.register;
  if(typeof reg!=='function')return;
  reg.call(sw,'/sw.js?v=830',{scope:'/',updateViaCache:'none'}).catch(()=>{});
}

function ctx(){
  if(!audioCtx){const C=window.AudioContext||window.webkitAudioContext;if(!C)return null;audioCtx=new C()}
  return audioCtx;
}
async function unlockAudio(preview=false,mode='soft'){
  const c=ctx();if(!c)return false;
  try{if(c.state!=='running')await c.resume();if(preview)playTone(mode);return c.state==='running'}catch{return false}
}
function playTone(mode='soft'){
  const c=ctx();if(!c||c.state!=='running')return false;
  const t=c.currentTime+.015,g=c.createGain(),o1=c.createOscillator(),o2=c.createOscillator();
  g.connect(c.destination);o1.connect(g);o2.connect(g);
  o1.type='sine';o2.type='sine';
  o1.frequency.setValueAtTime(mode==='clear'?720:620,t);o2.frequency.setValueAtTime(mode==='clear'?1080:930,t);
  const peak=mode==='clear'?.06:.032;
  g.gain.setValueAtTime(.0001,t);g.gain.exponentialRampToValueAtTime(peak,t+.025);g.gain.exponentialRampToValueAtTime(.0001,t+.23);
  o1.start(t);o2.start(t+.035);o1.stop(t+.24);o2.stop(t+.20);
  return true;
}
function reminderThreshold(p){const v=String(p.reminderTiming||'auto');if(v==='90')return 90000;if(v==='180')return 180000;if(v==='120')return 120000;return 120000}
function activeRest(){
  const c=readCore(),m=readMeta();if(!c.active)return null;
  const x=(c.active.events||[]).map(e=>({e,a:m.events?.[e.id]?.activity})).filter(x=>x.a?.status==='active'&&x.a?.restStartedAt).sort((a,b)=>(b.a.restStartedAt||0)-(a.a.restStartedAt||0))[0];
  return x||null;
}
async function checkReminder(){
  const m=readMeta(),p=m.prefs||{},mode=p.reminderSound||'off';if(mode==='off')return;
  const x=activeRest();if(!x)return;
  const elapsed=Date.now()-x.a.restStartedAt,threshold=reminderThreshold(p);if(elapsed<threshold)return;
  const key=x.e.id+':'+x.a.restStartedAt;if(key===lastReminderKey||x.a.soundReminderFor===x.a.restStartedAt)return;
  if(D.visibilityState!=='visible')return;
  const ok=await unlockAudio(false,mode);if(!ok)return;
  playTone(mode);lastReminderKey=key;
  const mm=readMeta();if(mm.events?.[x.e.id]?.activity){mm.events[x.e.id].activity.soundReminderFor=x.a.restStartedAt;writeMeta(mm)}
}
function injectStyles(){if($('#v83ReminderStyle'))return;const s=D.createElement('style');s.id='v83ReminderStyle';s.textContent=`.v83Reminder{margin-top:1px}.v83Reminder .miniSeg{max-width:206px}.v83ReminderNote{min-height:42px;padding:10px 0 2px;color:var(--dim);font-size:11.5px;line-height:1.5}.v83ReminderTest{height:36px;padding:0 11px;border-radius:11px;background:var(--s2);color:var(--accent2);font-size:11.5px;font-weight:650}.v83AudioStatus{font-size:11.5px!important;color:var(--muted)!important}`;D.head.appendChild(s)}
function setSeg(host,value){$$('button',host).forEach(b=>b.classList.toggle('active',b.dataset.v===String(value)))}
function injectSettings(){
  injectStyles();const host=$('#settingsSheet .settingsList.second');if(!host||$('#v83Reminder'))return;
  const m=readMeta(),p=m.prefs||{};host.insertAdjacentHTML('beforeend',`<div id="v83Reminder" class="v83Reminder"><div class="settingPlain"><span>声音提醒</span><div class="miniSeg" id="v83Sound"><button data-v="off">关闭</button><button data-v="soft">轻声</button><button data-v="clear">清晰</button></div></div><div class="settingPlain"><span>提示时机</span><div class="miniSeg" id="v83Timing"><button data-v="auto">自动</button><button data-v="90">90秒</button><button data-v="120">2分</button><button data-v="180">3分</button></div></div><div class="settingPlain"><span>音频输出</span><b class="v83AudioStatus">跟随系统</b></div><div class="v83ReminderNote">耳机已连接时，提示音会跟随 iPhone 当前音频输出。默认只提醒一次，不循环催促。</div><button class="v83ReminderTest" id="v83TestSound">试听提示音</button></div>`);
  setSeg($('#v83Sound'),p.reminderSound||'off');setSeg($('#v83Timing'),p.reminderTiming||'auto');
  $('#v83Sound').onclick=async e=>{const b=e.target.closest('button');if(!b)return;const mm=readMeta();mm.prefs.reminderSound=b.dataset.v;writeMeta(mm);setSeg($('#v83Sound'),b.dataset.v);if(b.dataset.v!=='off')await unlockAudio(true,b.dataset.v)};
  $('#v83Timing').onclick=e=>{const b=e.target.closest('button');if(!b)return;const mm=readMeta();mm.prefs.reminderTiming=b.dataset.v;writeMeta(mm);setSeg($('#v83Timing'),b.dataset.v)};
  $('#v83TestSound').onclick=async()=>{const mode=readMeta().prefs.reminderSound||'soft';await unlockAudio(true,mode==='off'?'soft':mode)};
}
function boot(){restoreServiceWorker();setTimeout(injectSettings,60);setInterval(checkReminder,500);D.addEventListener('visibilitychange',()=>{if(!D.hidden){if(audioCtx&&audioCtx.state!=='running')audioCtx.resume().catch(()=>{});checkReminder()} });const settings=$('#settingsBtn');settings?.addEventListener('click',()=>setTimeout(injectSettings,80))}
if(D.readyState==='loading')D.addEventListener('DOMContentLoaded',boot,{once:true});else boot();
})();
