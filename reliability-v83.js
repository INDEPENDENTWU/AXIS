(()=>{'use strict';
const D=document,$=(s,r=D)=>r.querySelector(s),$$=(s,r=D)=>Array.from(r.querySelectorAll(s));
const META='axis_v8_meta',CORE='axis_v60_state';
let audioCtx=null,lastReminderKey='',audioPrimed=false;
const readMeta=()=>{try{const m=JSON.parse(localStorage.getItem(META)||'null')||{};m.events=m.events||{};m.prefs=m.prefs||{};return m}catch{return{events:{},prefs:{}}}};
const writeMeta=m=>{try{localStorage.setItem(META,JSON.stringify(m));return true}catch{return false}};
const readCore=()=>{try{return JSON.parse(localStorage.getItem(CORE)||'null')||{active:null,sessions:[]}}catch{return{active:null,sessions:[]}}};

function restoreServiceWorker(){
  if(!('serviceWorker' in navigator))return;
  const sw=navigator.serviceWorker;
  try{delete sw.register}catch{}
  const proto=Object.getPrototypeOf(sw),reg=proto&&proto.register;
  if(typeof reg!=='function')return;
  reg.call(sw,'/sw.js?v=831',{scope:'/',updateViaCache:'none'}).catch(()=>{});
}
function scheduleServiceWorker(){
  const run=()=>setTimeout(restoreServiceWorker,80);
  if(D.readyState==='complete')run();else window.addEventListener('load',run,{once:true});
}

function ctx(){
  if(!audioCtx){const C=window.AudioContext||window.webkitAudioContext;if(!C)return null;audioCtx=new C()}
  return audioCtx;
}
function primeAudio(){
  const c=ctx();if(!c||audioPrimed)return;
  try{const b=c.createBuffer(1,1,22050),s=c.createBufferSource(),g=c.createGain();g.gain.value=0;s.buffer=b;s.connect(g);g.connect(c.destination);s.start(0);audioPrimed=true}catch{}
}
async function unlockAudio(preview=false,mode='soft'){
  const c=ctx();if(!c)return false;
  try{if(c.state!=='running')await c.resume();primeAudio();if(preview)playTone(mode);return c.state==='running'}catch{return false}
}
function silentUnlock(){
  const mode=readMeta().prefs?.reminderSound||'off';if(mode==='off')return;
  unlockAudio(false,mode).catch(()=>{});
}
function installSilentUnlock(){
  const fn=()=>{silentUnlock();if(audioPrimed){D.removeEventListener('pointerdown',fn,true);D.removeEventListener('touchend',fn,true);D.removeEventListener('keydown',fn,true)}};
  D.addEventListener('pointerdown',fn,true);D.addEventListener('touchend',fn,true);D.addEventListener('keydown',fn,true);
}
function playTone(mode='soft'){
  const c=ctx();if(!c||c.state!=='running')return false;
  const t=c.currentTime+.015,g=c.createGain(),o1=c.createOscillator(),o2=c.createOscillator();
  g.connect(c.destination);o1.connect(g);o2.connect(g);
  o1.type='sine';o2.type='sine';
  o1.frequency.setValueAtTime(mode==='clear'?720:620,t);o2.frequency.setValueAtTime(mode==='clear'?1080:930,t);
  const peak=mode==='clear'?.055:.028;
  g.gain.setValueAtTime(.0001,t);g.gain.exponentialRampToValueAtTime(peak,t+.025);g.gain.exponentialRampToValueAtTime(.0001,t+.22);
  o1.start(t);o2.start(t+.032);o1.stop(t+.23);o2.stop(t+.19);
  return true;
}
function historicalRestMs(e){
  if(!e?.equipmentId)return 0;const c=readCore(),m=readMeta(),vals=[];
  const all=(c.active?[c.active]:[]).concat(c.sessions||[]).flatMap(s=>s.events||[]).filter(x=>x.equipmentId===e.equipmentId&&x.id!==e.id).sort((a,b)=>(b.time||0)-(a.time||0)).slice(0,8);
  for(const h of all){const sets=m.events?.[h.id]?.sets||[],times=sets.map(s=>Number(s.doneAt)||0).filter(Boolean).sort((a,b)=>a-b);for(let i=1;i<times.length;i++){const rest=times[i]-times[i-1]-45000;if(rest>=45000&&rest<=360000)vals.push(rest)}}
  if(vals.length<2)return 0;vals.sort((a,b)=>a-b);const mid=Math.floor(vals.length/2),med=vals.length%2?vals[mid]:(vals[mid-1]+vals[mid])/2;return Math.max(75000,Math.min(240000,Math.round(med/5000)*5000));
}
function reminderThreshold(p,e){const v=String(p.reminderTiming||'auto');if(v==='90')return 90000;if(v==='180')return 180000;if(v==='120')return 120000;return historicalRestMs(e)||120000}
function activeRest(){
  const c=readCore(),m=readMeta();if(!c.active)return null;
  return (c.active.events||[]).map(e=>({e,a:m.events?.[e.id]?.activity})).filter(x=>x.a?.status==='active'&&x.a?.restStartedAt).sort((a,b)=>(b.a.restStartedAt||0)-(a.a.restStartedAt||0))[0]||null;
}
async function checkReminder(){
  const m=readMeta(),p=m.prefs||{},mode=p.reminderSound||'off';if(mode==='off')return;
  const x=activeRest();if(!x)return;
  const elapsed=Date.now()-x.a.restStartedAt,threshold=reminderThreshold(p,x.e);if(elapsed<threshold)return;
  const key=x.e.id+':'+x.a.restStartedAt;if(key===lastReminderKey||x.a.soundReminderFor===x.a.restStartedAt)return;
  if(D.visibilityState!=='visible')return;
  const ok=await unlockAudio(false,mode);if(!ok)return;
  playTone(mode);lastReminderKey=key;
  const mm=readMeta();if(mm.events?.[x.e.id]?.activity){mm.events[x.e.id].activity.soundReminderFor=x.a.restStartedAt;writeMeta(mm)}
}
function injectStyles(){if($('#v83ReminderStyle'))return;const s=D.createElement('style');s.id='v83ReminderStyle';s.textContent=`.v83Reminder{margin-top:1px}.v83Reminder .miniSeg{max-width:214px}.v83ReminderNote{min-height:42px;padding:10px 0 2px;color:var(--dim);font-size:11.5px;line-height:1.5}.v83ReminderTest{height:36px;padding:0 11px;border-radius:11px;background:var(--s2);color:var(--accent2);font-size:11.5px;font-weight:650}.v83AudioStatus{font-size:11.5px!important;color:var(--muted)!important}`;D.head.appendChild(s)}
function setSeg(host,value){if(!host)return;$$('button',host).forEach(b=>b.classList.toggle('active',b.dataset.v===String(value)))}
function injectSettings(){
  injectStyles();const host=$('#settingsSheet .settingsList.second');if(!host||$('#v83Reminder'))return;
  const p=readMeta().prefs||{};host.insertAdjacentHTML('beforeend',`<div id="v83Reminder" class="v83Reminder"><div class="settingPlain"><span>声音提醒</span><div class="miniSeg" id="v83Sound"><button data-v="off">关闭</button><button data-v="soft">轻声</button><button data-v="clear">清晰</button></div></div><div class="settingPlain"><span>提示时机</span><div class="miniSeg" id="v83Timing"><button data-v="auto">自动</button><button data-v="90">90秒</button><button data-v="120">2分</button><button data-v="180">3分</button></div></div><div class="settingPlain"><span>音频输出</span><b class="v83AudioStatus">跟随系统</b></div><div class="v83ReminderNote">耳机已连接时，提示音跟随 iPhone 当前音频输出。自动会优先参考你在同一项目的历史组间节奏；每次休息最多提醒一次。</div><button class="v83ReminderTest" id="v83TestSound">试听提示音</button></div>`);
  setSeg($('#v83Sound'),p.reminderSound||'off');setSeg($('#v83Timing'),p.reminderTiming||'auto');
  $('#v83Sound').onclick=async e=>{const b=e.target.closest('button');if(!b)return;const mm=readMeta();mm.prefs.reminderSound=b.dataset.v;writeMeta(mm);setSeg($('#v83Sound'),b.dataset.v);if(b.dataset.v!=='off'){await unlockAudio(true,b.dataset.v);installSilentUnlock()}};
  $('#v83Timing').onclick=e=>{const b=e.target.closest('button');if(!b)return;const mm=readMeta();mm.prefs.reminderTiming=b.dataset.v;writeMeta(mm);setSeg($('#v83Timing'),b.dataset.v)};
  $('#v83TestSound').onclick=async()=>{const mode=readMeta().prefs.reminderSound||'soft';await unlockAudio(true,mode==='off'?'soft':mode)};
}
function boot(){
  scheduleServiceWorker();installSilentUnlock();setTimeout(injectSettings,60);setInterval(checkReminder,500);
  D.addEventListener('visibilitychange',()=>{if(!D.hidden){checkReminder();if((readMeta().prefs?.reminderSound||'off')!=='off')installSilentUnlock()}});
  $('#settingsBtn')?.addEventListener('click',()=>setTimeout(injectSettings,80));
  const v=$('.versionLine');if(v)v.textContent='版本 8.3';
}
if(D.readyState==='loading')D.addEventListener('DOMContentLoaded',boot,{once:true});else boot();
})();
