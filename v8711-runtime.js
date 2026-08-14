(()=>{'use strict';
const D=document,$=(s,r=D)=>r.querySelector(s),$$=(s,r=D)=>Array.from(r.querySelectorAll(s));
const VERSION='8.7.11',CORE='axis_v60_state',META='axis_v8_meta',LIB=window.__AXIS_873_LIBRARY__||[];
let wakeLock=null,patchQueued=false;
const read=k=>{try{return JSON.parse(localStorage.getItem(k)||'null')||{}}catch{return{}}};
const write=(k,v)=>{try{localStorage.setItem(k,JSON.stringify(v));return true}catch{return false}};
const core=()=>{const c=read(CORE);c.profile=c.profile||{};return c};
const meta=()=>{const m=read(META);m.prefs=m.prefs||{};return m};
const norm=s=>String(s||'').toLowerCase().normalize('NFKD').replace(/[\u0300-\u036f]/g,'').replace(/[\s\-_/·.,，。()（）[\]【】:+]+/g,'');
function style(){if($('#v8711Style'))return;const s=D.createElement('style');s.id='v8711Style';s.textContent=`
:root{--axis-ui:15px;--axis-display:22px;--axis-pad:clamp(20px,5.3vw,28px)}
#v8Sets .v8SetRows{border-top:1px solid var(--line2)!important}
#v8Sets .v8SetRow{min-height:82px!important;display:grid!important;grid-template-columns:44px minmax(94px,1fr) minmax(94px,1fr) 58px!important;column-gap:8px!important;align-items:center!important;padding:0 12px!important;margin:0!important;border-bottom:1px solid var(--line2)!important;box-sizing:border-box!important;overflow:hidden!important;transition:none!important;-webkit-tap-highlight-color:transparent!important}
#v8Sets .v8SetRow.active{background:linear-gradient(90deg,rgba(115,124,255,.105),rgba(115,124,255,.028) 72%,transparent)!important}
#v8Sets .v8SetRow>i{width:100%!important;height:36px!important;display:grid!important;place-items:center!important;padding:0!important;margin:0!important;color:var(--dim)!important;font-size:var(--axis-ui)!important;line-height:1!important;font-style:normal!important;font-variant-numeric:tabular-nums!important;letter-spacing:.04em!important}
#v8Sets .v8SetRow>span{min-width:0!important;height:56px!important;display:flex!important;align-items:center!important;justify-content:center!important;gap:6px!important;padding:0!important;margin:0!important;white-space:nowrap!important}
#v8Sets .v8SetRow>span b{font-size:var(--axis-display)!important;line-height:1!important;font-weight:650!important;letter-spacing:-.018em!important;font-variant-numeric:tabular-nums!important}
#v8Sets .v8SetRow>span small{font-size:var(--axis-ui)!important;line-height:1!important;color:var(--muted)!important;margin:0!important}
#v8Sets .v8SetRow>em{width:52px!important;min-width:52px!important;max-width:52px!important;height:38px!important;display:grid!important;place-items:center!important;justify-self:end!important;padding:0!important;margin:0!important;border-radius:12px!important;font-size:var(--axis-ui)!important;line-height:1!important;font-style:normal!important;white-space:nowrap!important}
#v8Sets,#v8Sets *{animation:none!important}
#v8Sets :is(button,input){-webkit-tap-highlight-color:transparent!important}
#liveTimer{min-width:7.2ch!important;text-align:left!important;font-variant-numeric:tabular-nums!important;font-feature-settings:"tnum" 1!important;letter-spacing:-.025em!important;transform:translateZ(0);backface-visibility:hidden;contain:paint}
#activeHome .metricPair b,#activeHome .eventTime{font-variant-numeric:tabular-nums!important;font-feature-settings:"tnum" 1!important}
.v8711SettingGate{border-top:1px solid var(--line);margin-top:10px}
.v8711SettingGate>.settingLink{width:100%;height:58px;border-bottom:1px solid var(--line2)!important}
.v8711SettingGate>.settingLink span,.v8711SettingGate>.settingLink b{font-size:var(--axis-ui)!important}
.v8711SettingGate>.settingLink i{transition:transform .18s ease}
.v8711SettingGate.open>.settingLink i{transform:rotate(90deg)}
.v8711Fold{display:none;padding:0 0 4px}.v8711SettingGate.open>.v8711Fold{display:block}
.v8711Fold>.settingsList,.v8711Fold>.v8710Audio{border-top:0!important;margin-top:0!important}
.v8711Wake{width:100%;height:52px;display:flex;align-items:center;justify-content:space-between;border-bottom:1px solid var(--line2)}
.v8711Wake span,.v8711Wake b{font-size:var(--axis-ui);line-height:1.3}.v8711Wake span{color:var(--muted)}.v8711Wake b{color:var(--text)}
#reportBtn.v8711ReportEntry{height:58px!important;margin:10px 0 0!important;padding:0!important;border-radius:0!important;background:transparent!important;color:var(--text)!important;text-align:left!important;font-size:var(--axis-ui)!important;border-top:1px solid var(--line)!important;border-bottom:1px solid var(--line2)!important}
#reportBtn.v8711ReportEntry:after{content:'›';float:right;color:var(--dim);font-size:var(--axis-display)}
#watermarkPreview{isolation:isolate}
.v8711Corners{position:absolute;inset:0;pointer-events:none;z-index:8}
.v8711Corners button{position:absolute;width:46px;height:46px;border:1px solid rgba(255,255,255,.28);border-radius:13px;background:rgba(8,10,14,.22);pointer-events:auto}
.v8711Corners button.active{border-color:#737cff;background:rgba(115,124,255,.16);box-shadow:0 0 0 1px rgba(115,124,255,.15) inset}
.v8711Corners [data-p="tl"]{left:16px;top:16px}.v8711Corners [data-p="tr"]{right:16px;top:16px}.v8711Corners [data-p="bl"]{left:16px;bottom:16px}.v8711Corners [data-p="br"]{right:16px;bottom:16px}
#v8710WmPreview .v8710WmRail{max-width:82%!important;bottom:auto!important;left:auto!important;right:auto!important;top:auto!important}
#v8710WmPreview .v8710WmRail[data-pos="tl"]{left:5%!important;top:6%!important}
#v8710WmPreview .v8710WmRail[data-pos="tr"]{right:5%!important;top:6%!important;text-align:right!important;border-left:0!important;border-right:3px solid #737cff!important}
#v8710WmPreview .v8710WmRail[data-pos="bl"]{left:5%!important;bottom:6%!important}
#v8710WmPreview .v8710WmRail[data-pos="br"]{right:5%!important;bottom:6%!important;text-align:right!important;border-left:0!important;border-right:3px solid #737cff!important}
.v8711PlaceMode{margin-top:10px;color:var(--dim);font-size:var(--axis-ui);line-height:1.4}
@media(max-width:390px){#v8Sets .v8SetRow{grid-template-columns:40px minmax(82px,1fr) minmax(82px,1fr) 52px!important;column-gap:5px!important;padding:0 8px!important}#v8Sets .v8SetRow>em{width:48px!important;min-width:48px!important;max-width:48px!important}}
`;(D.head||D.documentElement).appendChild(s)}
function addExercise(x){if(!x?.name)return;const k=norm(x.name),same=LIB.find(i=>norm(i.name)===k||(i.aliases||[]).some(a=>norm(a)===k));if(same){const a=new Set([...(same.aliases||[]),...(x.aliases||[])]);same.aliases=[...a];same.muscles=[...new Set([...(same.muscles||[]),...(x.muscles||[])])];return}LIB.push(x)}
function extendLibrary(){
const xs=[
{id:'smith-squat',name:'史密斯深蹲',aliases:['Smith 深蹲','史密夫深蹲','smith squat','史密斯机深蹲'],type:'strength',muscles:['股四头肌','臀部']},
{id:'smith-bench',name:'史密斯卧推',aliases:['史密斯胸推','smith bench press','smith chest press'],type:'strength',muscles:['胸肌','肱三头肌']},
{id:'smith-shoulder',name:'史密斯肩推',aliases:['史密斯推举','smith shoulder press'],type:'strength',muscles:['肩部','肱三头肌']},
{id:'leg-press',name:'腿举',aliases:['腿推','倒蹬','坐姿腿推','leg press','45度腿举'],type:'strength',muscles:['股四头肌','臀部']},
{id:'hack-squat',name:'哈克深蹲',aliases:['哈克机','哈克腿推','hack squat','hack press'],type:'strength',muscles:['股四头肌','臀部']},
{id:'leg-extension',name:'腿屈伸',aliases:['腿伸展','坐姿腿屈伸','leg extension','股四头肌机'],type:'strength',muscles:['股四头肌']},
{id:'seated-leg-curl',name:'坐姿腿弯举',aliases:['坐姿腿弯曲','seated leg curl','腿后侧弯举'],type:'strength',muscles:['腘绳肌']},
{id:'lying-leg-curl',name:'俯卧腿弯举',aliases:['卧式腿弯举','lying leg curl','prone leg curl'],type:'strength',muscles:['腘绳肌']},
{id:'hip-abductor',name:'髋外展',aliases:['髋外展机','臀外展','hip abductor','外展机'],type:'strength',muscles:['臀部']},
{id:'hip-adductor',name:'髋内收',aliases:['髋内收机','大腿内收','hip adductor','内收机'],type:'strength',muscles:['臀腿']},
{id:'glute-kickback',name:'臀部后踢',aliases:['臀推机后踢','glute kickback','kickback machine'],type:'strength',muscles:['臀部']},
{id:'assisted-pullup',name:'辅助引体',aliases:['辅助引体向上','assisted pull up','引体辅助机'],type:'strength',muscles:['背部','肱二头肌']},
{id:'assisted-dip',name:'辅助双杠臂屈伸',aliases:['辅助双杠','assisted dip','双杠辅助机'],type:'strength',muscles:['胸肌','肱三头肌']},
{id:'tbar-row',name:'T杠划船',aliases:['T杆划船','t bar row','胸托T杠划船'],type:'strength',muscles:['背部','肱二头肌']},
{id:'chest-row',name:'胸托划船',aliases:['胸托划船机','chest supported row','坐姿胸托划船'],type:'strength',muscles:['背部','肱二头肌']},
{id:'reverse-pecdeck',name:'反向飞鸟',aliases:['反向蝴蝶机','后束飞鸟','reverse pec deck','rear delt fly'],type:'strength',muscles:['肩部','背部']},
{id:'preacher-curl',name:'牧师凳弯举',aliases:['牧师椅弯举','preacher curl','二头弯举机'],type:'strength',muscles:['肱二头肌']},
{id:'cable-pushdown',name:'绳索下压',aliases:['三头下压','cable pushdown','triceps pushdown','龙门架下压'],type:'strength',muscles:['肱三头肌']},
{id:'overhead-extension',name:'过顶臂屈伸',aliases:['绳索过顶臂屈伸','overhead triceps extension'],type:'strength',muscles:['肱三头肌']},
{id:'cable-curl',name:'绳索弯举',aliases:['龙门架弯举','cable curl','二头绳索弯举'],type:'strength',muscles:['肱二头肌']},
{id:'machine-lateral',name:'侧平举机',aliases:['肩侧平举机','lateral raise machine','三角肌中束机'],type:'strength',muscles:['肩部']},
{id:'machine-press',name:'肩推机',aliases:['坐姿肩推','shoulder press machine','推肩机'],type:'strength',muscles:['肩部','肱三头肌']},
{id:'stair-climber',name:'登阶机',aliases:['楼梯机','爬楼机','stair climber','stairmaster'],type:'cardio',muscles:['心肺','臀部','股四头肌']},
{id:'spin-bike',name:'动感单车',aliases:['纺车','室内单车','spin bike','indoor bike'],type:'cardio',muscles:['心肺','股四头肌']},
{id:'row-erg',name:'划船机',aliases:['风阻划船机','rowing machine','rower','erg'],type:'cardio',muscles:['心肺','背部']},
{id:'ski-erg',name:'滑雪机',aliases:['SkiErg','滑雪训练器','ski erg'],type:'cardio',muscles:['心肺','背部']},
{id:'sled-push',name:'雪橇推',aliases:['推雪橇','sled push','prowler push'],type:'strength',muscles:['全身','臀腿']},
{id:'sled-pull',name:'雪橇拉',aliases:['拉雪橇','sled pull'],type:'strength',muscles:['全身','背部']},
{id:'farmer-carry',name:'农夫行走',aliases:['农夫走','farmer carry','farmers walk'],type:'strength',muscles:['全身','核心']},
{id:'kettlebell-swing',name:'壶铃摆动',aliases:['壶铃摇摆','kettlebell swing','KB swing'],type:'strength',muscles:['臀部','核心','心肺']},
{id:'battle-rope',name:'战绳',aliases:['甩绳','battle rope','战绳训练'],type:'cardio',muscles:['心肺','肩部','核心']},
{id:'trx-row',name:'悬挂划船',aliases:['TRX 划船','suspension row','trx row'],type:'strength',muscles:['背部','肱二头肌']},
{id:'band-row',name:'弹力带划船',aliases:['阻力带划船','resistance band row'],type:'strength',muscles:['背部','肱二头肌']},
{id:'pull-up',name:'引体向上',aliases:['引体','pull up','chin up','单杠引体'],type:'strength',muscles:['背部','肱二头肌']},
{id:'dip',name:'双杠臂屈伸',aliases:['双杠','dip','parallel bar dip'],type:'strength',muscles:['胸肌','肱三头肌']},
{id:'bulgarian-split',name:'保加利亚分腿蹲',aliases:['保加利亚蹲','Bulgarian split squat'],type:'strength',muscles:['股四头肌','臀部']},
{id:'rdl',name:'罗马尼亚硬拉',aliases:['RDL','romanian deadlift','直腿硬拉'],type:'strength',muscles:['腘绳肌','臀部','背部']},
{id:'hip-thrust',name:'臀推',aliases:['杠铃臀推','hip thrust','臀桥机'],type:'strength',muscles:['臀部']},
{id:'calf-raise',name:'提踵',aliases:['小腿提踵','calf raise','站姿提踵','坐姿提踵'],type:'strength',muscles:['小腿']}
];xs.forEach(addExercise);
const alias={
'椭圆机':['椭圆仪','太空漫步机','cross trainer','elliptical trainer'],
'多功能龙门架':['龙门架','综合训练器','functional trainer','cable machine','cross cable'],
'高位下拉':['下拉机','lat pulldown','高拉背'],
'坐姿划船':['低位划船','seated row','坐姿拉背'],
'蝴蝶机夹胸':['夹胸机','pec deck','butterfly machine'],
'杠铃卧推':['平板卧推','bench press','barbell bench press'],
'哑铃卧推':['dumbbell bench press','哑铃胸推'],
'跑步机':['treadmill','跑台','走步机']
};for(const [name,arr] of Object.entries(alias)){const x=LIB.find(i=>norm(i.name)===norm(name));if(x)x.aliases=[...new Set([...(x.aliases||[]),...arr])]}
}
function polishRows(){const rs=$$('#v8Sets .v8SetRow');rs.forEach((r,i)=>{r.dataset.axisRow='1';const idx=r.querySelector(':scope>i');if(idx)idx.textContent=String(i+1).padStart(2,'0')})}
function ensureSettings(){
const sheet=$('#settingsSheet .sheet');if(!sheet)return;
const second=$('#settingsSheet .settingsList.second');
let rec=$('#v8711RecordGate');if(second&&!rec){rec=D.createElement('div');rec.id='v8711RecordGate';rec.className='v8711SettingGate';rec.innerHTML='<button type="button" class="settingLink" data-v8711-fold="record"><span>记录偏好</span><b>常用</b><i>›</i></button><div class="v8711Fold" data-v8711-body="record"></div>';second.before(rec);rec.querySelector('.v8711Fold').appendChild(second)}
if(rec&&!$('#v8711Wake')){const b=D.createElement('button');b.id='v8711Wake';b.className='v8711Wake';b.innerHTML='<span>训练时保持屏幕唤醒</span><b></b>';rec.querySelector('.v8711Fold')?.appendChild(b)}
const audio=$('#v8710Audio');let ag=$('#v8711AudioGate');if(audio&&!ag){ag=D.createElement('div');ag.id='v8711AudioGate';ag.className='v8711SettingGate';ag.innerHTML='<button type="button" class="settingLink" data-v8711-fold="audio"><span>提醒与声音</span><b>AXIS</b><i>›</i></button><div class="v8711Fold" data-v8711-body="audio"></div>';rec?.after(ag);ag.querySelector('.v8711Fold').appendChild(audio)}
const rb=$('#reportBtn');if(rb){rb.classList.add('v8711ReportEntry');rb.textContent='训练报告'}
syncWakeLabel()
}
function wakeEnabled(){return meta().prefs.v8711WakeLock!==false}
function syncWakeLabel(){const b=$('#v8711Wake b');if(b)b.textContent=wakeEnabled()?'开启':'关闭'}
async function releaseWake(){try{await wakeLock?.release?.()}catch{}wakeLock=null}
async function syncWake(){
const c=core(),active=!!c.active&&!c.active.end,need=wakeEnabled()&&active&&D.visibilityState==='visible';
if(!need){await releaseWake();return}
if(!('wakeLock'in navigator)||wakeLock)return;
try{wakeLock=await navigator.wakeLock.request('screen');wakeLock.addEventListener?.('release',()=>wakeLock=null,{once:true})}catch{}
}
function toggleFold(k){const g=$(`#v8711${k==='record'?'Record':'Audio'}Gate`);if(!g)return;g.classList.toggle('open');g.querySelector(':scope>.settingLink')?.setAttribute('aria-expanded',g.classList.contains('open')?'true':'false')}
function ensureCorners(){
const pv=$('#watermarkPreview');if(!pv)return;let c=$('#v8711Corners');if(!c){c=D.createElement('div');c.id='v8711Corners';c.className='v8711Corners';c.innerHTML='<button type="button" data-p="tl" aria-label="左上"></button><button type="button" data-p="tr" aria-label="右上"></button><button type="button" data-p="bl" aria-label="左下"></button><button type="button" data-p="br" aria-label="右下"></button>';pv.appendChild(c)}
syncCorners()
}
function pos(){return meta().prefs.v85WmPos||'br'}
function syncCorners(){const p=pos();$$('#v8711Corners [data-p]').forEach(b=>b.classList.toggle('active',b.dataset.p===p));const rail=$('#v8710WmPreview .v8710WmRail');if(rail)rail.dataset.pos=p}
function setPos(p){const m=meta();m.prefs.v85WmPos=p;write(META,m);syncCorners()}
function version(){window.__AXIS_RELEASE__=VERSION;window.__AXIS_VERSION__=VERSION;const v=$('.versionLine');if(v){v.textContent=`版本 ${VERSION}`;v.dataset.axisVersion=VERSION;v.style.visibility='visible'}}
function patch(){polishRows();ensureSettings();ensureCorners();version()}
function queue(){if(patchQueued)return;patchQueued=true;requestAnimationFrame(()=>{patchQueued=false;patch()})}
function bind(){
style();extendLibrary();patch();syncWake();
D.addEventListener('click',e=>{
const f=e.target.closest('[data-v8711-fold]');if(f){toggleFold(f.dataset.v8711Fold);return}
if(e.target.closest('#v8711Wake')){const m=meta();m.prefs.v8711WakeLock=!wakeEnabled();write(META,m);syncWakeLabel();syncWake();return}
const p=e.target.closest('#v8711Corners [data-p]');if(p){setPos(p.dataset.p);return}
if(e.target.closest('#settingsBtn'))setTimeout(()=>{ensureSettings();version()},100);
if(e.target.closest('#watermarkBtn'))setTimeout(()=>{ensureCorners();syncCorners()},140);
if(e.target.closest('#startBtn,#finishDone,#finishHold,#saveScan'))setTimeout(syncWake,260);
if(e.target.closest('#eqSheet .closeBtn,#equipmentRow'))setTimeout(()=>{extendLibrary();$('#eqSearch')?.dispatchEvent(new Event('input',{bubbles:true}))},90);
requestAnimationFrame(queue)
},true);
D.addEventListener('visibilitychange',()=>{if(D.visibilityState==='visible')syncWake();else releaseWake()});
window.addEventListener('pageshow',()=>{patch();syncWake()});
window.addEventListener('pagehide',releaseWake);
const sets=$('#v8Sets');if(sets){const MO=window.__AXIS_NATIVE_MUTATION_OBSERVER__||MutationObserver;new MO(queue).observe(sets,{childList:true,subtree:false})}
const wm=$('#watermarkSheet');if(wm){const MO=window.__AXIS_NATIVE_MUTATION_OBSERVER__||MutationObserver;new MO(()=>{if(wm.classList.contains('show'))setTimeout(()=>{ensureCorners();syncCorners()},60)}).observe(wm,{attributes:true,attributeFilter:['class']})}
}
if(D.readyState==='loading')D.addEventListener('DOMContentLoaded',bind,{once:true});else bind();
window.__AXIS_8711_READY__=true;
})();