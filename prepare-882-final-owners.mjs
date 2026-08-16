import fs from 'node:fs';

const fail=m=>{throw new Error(`AXIS 8.8.2 final owners: ${m}`)};
const read=f=>{if(!fs.existsSync(f))fail(`missing ${f}`);return fs.readFileSync(f,'utf8')};
const write=(f,s)=>fs.writeFileSync(f,s);
const once=(src,from,to,label)=>{const n=src.split(from).length-1;if(n!==1)fail(`${label} expected once, found ${n}`);return src.replace(from,to)};
const regexOnce=(src,re,to,label)=>{const flags=re.flags.includes('g')?re.flags:re.flags+'g',n=(src.match(new RegExp(re.source,flags))||[]).length;if(n!==1)fail(`${label} expected once, found ${n}`);return src.replace(re,()=>to)};
const syntax=(src,label)=>{const f=`.axis-882-owner-${label}.js`;fs.writeFileSync(f,src);try{new Function(src)}catch(e){fail(`${label} syntax ${e.message}`)}finally{try{fs.unlinkSync(f)}catch{}}};

/* First-paint may own the Quick Record button node; v61 always owns interactive mounting. */
{
  const FILE='v61.js';let src=read(FILE);
  src=regexOnce(src,/function injectQuick\(\)\{[\s\S]*?\}\nfunction recentDistinct/,
`function injectQuick(){let b=$('#quickRecordBtn');const d=$('#dock');if(!d)return;d.classList.add('v8-dual');if(!b){d.insertAdjacentHTML('beforeend','<button id="quickRecordBtn" class="v8QuickBtn"><span>＋</span><b>快速记录</b></button>');b=$('#quickRecordBtn')}if(!$('#quickRecordSheet'))D.body.insertAdjacentHTML('beforeend','<div class="sheetWrap" id="quickRecordSheet"><div class="sheet v8QuickSheet"><div class="grabber"></div><div class="sheetHead"><b>快速记录</b><button class="closeBtn" id="quickClose">×</button></div><div class="v8Block"><span>最近</span><div id="v8Recent"></div></div><div class="v8Block v882QuickMine hidden" id="v882QuickMine"><span>我的</span><div id="v882QuickCustom"></div></div><button class="v8Other" id="v8Other">其他器械 / 运动 <i>›</i></button><button class="v8New" id="v8New">＋ 新建自定义</button></div></div>');else if(!$('#v882QuickMine')){const recent=$('#v8Recent')?.closest('.v8Block');recent?.insertAdjacentHTML('afterend','<div class="v8Block v882QuickMine hidden" id="v882QuickMine"><span>我的</span><div id="v882QuickCustom"></div></div>')}b.onclick=openQuick;const close=$('#quickClose');if(close)close.onclick=()=>{$('#quickRecordSheet')?.classList.remove('show');syncDock()};const recent=$('#v8Recent');if(recent)recent.onclick=e=>{const q=e.target.closest('[data-qid]');if(q)chooseQuick(q.dataset.qid)};const mine=$('#v882QuickCustom');if(mine)mine.onclick=e=>{const q=e.target.closest('[data-qid]');if(q)chooseQuick(q.dataset.qid)};const other=$('#v8Other');if(other)other.onclick=()=>{quickOther=true;$('#quickRecordSheet')?.classList.remove('show');$('#equipmentRow')?.click()};const add=$('#v8New');if(add)add.onclick=()=>{$('#quickRecordSheet')?.classList.remove('show');$('#addCustomEq')?.click()}}
function recentDistinct`,'v61 idempotent Quick Record interactive mount');
  if(src.includes("function injectQuick(){if($('#quickRecordBtn'))return"))fail('Quick Record still treats first-paint button existence as interactive readiness');
  if(!src.includes("b.onclick=openQuick")||!src.includes("id=\"v882QuickMine\""))fail('v61 Quick Record owner did not mount handler/custom section');
  syntax(src,'v61');write(FILE,src);
}

/* v83 is a historical rest-sound owner. Keep its old settings compatibility but retire automatic checks. */
{
  const FILE='v83-reminders.js';let src=read(FILE);
  src=regexOnce(src,/async function check\(\)\{[\s\S]*?\}\nfunction setSeg\(/,
`async function check(){return false}
function setSeg(`,'retire v83 automatic reminder function');
  src=once(src,'setInterval(check,500);','', 'retire v83 reminder interval');
  src=once(src,"D.addEventListener('visibilitychange',()=>{if(!D.hidden){check();installUnlock()}})","D.addEventListener('visibilitychange',()=>{if(!D.hidden)installUnlock()})",'retire v83 visibility reminder call');
  if(!/async function check\(\)\{return false\}/.test(src)||/setInterval\(check|\{check\(\);installUnlock/.test(src))fail('v83 automatic reminder path survived');
  syntax(src,'v83');write(FILE,src);
}

/* v84-v87 are historical reminder/audio layers. They retain non-sound product behavior only. */
{
  const FILE='v84-runtime.js';let src=read(FILE);
  src=regexOnce(src,/async function reminderTick\(\)\{[\s\S]*?\}\nfunction migrateSound\(/,
`async function reminderTick(){return false}
function migrateSound(`,'retire v84 automatic reminder function');
  src=once(src,'setInterval(reminderTick,1000);','', 'retire v84 reminder interval');
  if(!/async function reminderTick\(\)\{return false\}/.test(src)||/setInterval\(reminderTick/.test(src))fail('v84 automatic reminder path survived');
  syntax(src,'v84');write(FILE,src);
}
{
  const FILE='v85-runtime.js';let src=read(FILE);
  src=regexOnce(src,/async function reminderTick\(\)\{[\s\S]*?\}\nfunction migratePrefs\(/,
`async function reminderTick(){return false}
function migratePrefs(`,'retire v85 automatic reminder function');
  src=once(src,'setInterval(reminderTick,1000);','', 'retire v85 reminder interval');
  if(!/async function reminderTick\(\)\{return false\}/.test(src)||/setInterval\(reminderTick/.test(src))fail('v85 automatic reminder path survived');
  syntax(src,'v85');write(FILE,src);
}
{
  const FILE='v86-runtime.js';let src=read(FILE);
  src=regexOnce(src,/async function reminderTick\(\)\{[\s\S]*?\}\nfunction syncSeg\(/,
`async function reminderTick(){return false}
function syncSeg(`,'retire v86 automatic reminder function');
  src=once(src,"tickTimer=setInterval(()=>{if(D.visibilityState==='visible'){renderCurrent();renderTimeline();reminderTick()}},1000)","tickTimer=setInterval(()=>{if(D.visibilityState==='visible'){renderCurrent();renderTimeline()}},1000)",'retire v86 reminder polling call');
  if(!/async function reminderTick\(\)\{return false\}/.test(src)||/renderTimeline\(\);reminderTick\(\)/.test(src))fail('v86 automatic reminder path survived');
  syntax(src,'v86');write(FILE,src);
}
{
  const FILE='v87-runtime.js';let src=read(FILE);
  src=regexOnce(src,/async function reminderTick\(\)\{[\s\S]*?\}\nfunction installEvents\(\)\{/,
`async function reminderTick(){return false}
function installEvents(){`,'retire v87 automatic reminder function');
  src=once(src,"timer=setInterval(()=>{if(D.visibilityState==='visible'){renderNow();renderTimeline();reminderTick()}},500)","timer=setInterval(()=>{if(D.visibilityState==='visible'){renderNow();renderTimeline()}},500)",'retire v87 reminder polling call');
  if(!/async function reminderTick\(\)\{return false\}/.test(src)||/renderTimeline\(\);reminderTick\(\)/.test(src))fail('v87 automatic reminder path survived');
  syntax(src,'v87');write(FILE,src);
}

/* v876 keeps timeline/capture/watermark compatibility but loses its historical automatic audio poller. */
{
  const FILE='v876-runtime.js';let src=read(FILE);
  src=regexOnce(src,/async function reminderTick\(\)\{[\s\S]*?\}\nfunction setPref\(/,
`async function reminderTick(){return false}
function setPref(`,'retire v876 automatic reminder function');
  src=once(src,"timelineTimer=setInterval(()=>{renderTimeline();reminderTick()},1000)","timelineTimer=setInterval(()=>{renderTimeline()},1000)",'retire v876 reminder polling call');
  if(!/async function reminderTick\(\)\{return false\}/.test(src)||/renderTimeline\(\);reminderTick\(\)/.test(src))fail('v876 automatic reminder path survived');
  syntax(src,'v876');write(FILE,src);
}

/* v8710 is the one automatic sound owner; only a natural active-item countdown zero may cue. */
{
  const FILE='v8710-sound-ui.js';let src=read(FILE);
  src=once(src,
    "if(p.item&&due&&elapsed(a)>=due){const k=e.id+':'+a.startedAt;if(!itemSeen.has(k)){itemSeen.add(k);cue('item')}}",
    "if(p.item&&due&&elapsed(a)>=due&&!D.querySelector('#v87Hold.show')){const k=e.id+':'+a.startedAt;if(!itemSeen.has(k)){itemSeen.add(k);cue('item')}}",
    'long-press countdown suppression');
  if(/cue\('(set|rest|session)'\)/.test(src))fail('non-countdown automatic cue survived in v8710');
  if(/status==='finished'[^\n]{0,160}cue\('item'\)/.test(src))fail('manual item-finish cue survived in v8710');
  if(!src.includes("elapsed(a)>=due&&!D.querySelector('#v87Hold.show')"))fail('single countdown trigger / hold suppression missing');
  syntax(src,'v8710-sound');write(FILE,src);
}

console.log('[AXIS 8.8.2 owners] PASS · v61 Quick Record idempotent mount · v83/v84/v85/v86/v87/v876 automatic sound retired · v8710 sole automatic sound · countdown zero only');
