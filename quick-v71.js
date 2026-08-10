(()=>{'use strict';
const D=document,$=s=>D.querySelector(s),$$=s=>Array.from(D.querySelectorAll(s));
const CORE='axis_v60_state';
const BASE=[
 ['cable','多功能龙门架','strength',['背部','胸肌','肩部']],['lat','高位下拉','strength',['背部','肱二头肌']],['row','坐姿 / 胸托划船','strength',['背部','肱二头肌']],['pec','飞鸟 / 后三角','strength',['胸肌','肩部']],['chest','胸推','strength',['胸肌','肱三头肌']],['shoulder','肩推','strength',['肩部','肱三头肌']],['dip','双杠 / 抬腿','strength',['胸肌','肱三头肌','核心']],['arms','手臂','strength',['肱二头肌','肱三头肌']],['legpress','坐姿腿推','strength',['股四头肌','臀部']],['hack','哈克 / 斜腿推','strength',['股四头肌','臀部']],['legext','腿屈伸','strength',['股四头肌']],['legcurl','腿弯举','strength',['腘绳肌']],['calf','小腿','strength',['小腿']],['dumbbell','哑铃','strength',['胸肌','背部','肩部']],['barbell','杠铃','strength',['背部','臀部','股四头肌']],['bodyweight','徒手','strength',['核心','胸肌','股四头肌']],['elliptical','椭圆机','cardio',['心肺','股四头肌','臀部']],['rower','划船机','cardio',['心肺','背部','股四头肌']],['treadmill','跑步机 / 跑步','cardio',['心肺','股四头肌','臀部']],['walk','步行','cardio',['心肺','股四头肌']]
].map(x=>({id:x[0],name:x[1],type:x[2],muscles:x[3]}));
const CURATED=['chest','lat','legpress','row','dumbbell','treadmill'];
let choosingFromQuick=false,returnAfterCustom=false;
function core(){try{return JSON.parse(localStorage.getItem(CORE)||'null')||{sessions:[],active:null,profile:{customEq:[]}}}catch{return{sessions:[],active:null,profile:{customEq:[]}}}}
function eqAll(){const c=core(),custom=(c.profile?.customEq||[]).map(e=>({id:e.id,name:e.name,type:e.type,muscles:e.muscles||[],custom:true}));return BASE.concat(custom)}
function esc(s){return String(s??'').replace(/[&<>"']/g,m=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[m]))}
function meta(e){return e?.kind==='cardio'?`${Number(e.duration)||0}分钟 · 强度${Number(e.intensity)||0}`:`${fmt(e?.weight)}kg · ${Number(e?.reps)||0}次 · ${Number(e?.sets)||0}组`}
function fmt(n){n=Number(n)||0;return n%1?n.toFixed(1):String(n)}
function allEvents(){const c=core(),ss=(c.active?[c.active]:[]).concat(c.sessions||[]);return ss.flatMap(s=>Array.isArray(s.events)?s.events:[])}
function usageMap(){const m=new Map();for(const e of allEvents()){const x=m.get(e.equipmentId)||{n:0,last:0,event:null};x.n++;if((e.time||0)>=x.last){x.last=e.time||0;x.event=e}m.set(e.equipmentId,x)}return m}
function inject(){
 const dock=$('#dock'),scan=$('#scanBtn');if(!dock||!scan||$('#quickRecordBtn'))return;
 dock.classList.add('v71-dual');const label=scan.querySelector('span');if(label)label.textContent='拍摄记录';
 scan.insertAdjacentHTML('afterend','<button class="quickRecordBtn" id="quickRecordBtn" aria-label="快速记录"><span class="quickPlus">＋</span><span>快速记录</span></button>');
 D.body.insertAdjacentHTML('beforeend',`<div class="sheetWrap" id="quickRecordSheet"><div class="sheet quickRecordSheet"><div class="grabber"></div><div class="sheetHead"><b>快速记录</b><button class="closeBtn" data-v71-close="quickRecordSheet">×</button></div><div id="quickRecentBlock"><div class="quickSectionHead"><b>最近</b></div><div class="quickRecordList" id="quickRecentList"></div></div><div id="quickMineBlock"><div class="quickSectionHead"><b>我的器械</b></div><div class="quickRecordList" id="quickMineList"></div></div><button class="quickOther" id="quickOther"><span>其他器械 / 运动</span><i>›</i></button><button class="quickNew" id="quickNew">＋ 新建自定义</button></div></div>`);
 $('[data-v71-close="quickRecordSheet"]').onclick=()=>$('#quickRecordSheet').classList.remove('show');
 $('#quickRecordBtn').onclick=openQuick;
 $('#quickOther').onclick=chooseOther;
 $('#quickNew').onclick=()=>{returnAfterCustom=true;$('#quickRecordSheet').classList.remove('show');$('#addCustomEq')?.click()};
 D.addEventListener('click',onClick,true);
 setCaptureCopy();renameSettings();restoreQuickAfterReload();
}
function renameSettings(){
 const label=$$('#settingsSheet .settingPlain>span').find(x=>x.textContent.trim()==='默认扫描');if(label)label.textContent='拍摄时长';
 const version=$('.versionLine');if(version)version.textContent='版本 7.1';
}
function setCaptureCopy(){
 const head=$('#scanSheet .sheetHead>b');if(head&&!$('#scanSheet').classList.contains('quick-record-mode'))head.textContent='拍摄记录';
 $$('#captureModes [data-mode]').forEach(b=>b.textContent=b.dataset.mode==='photo'?'单张':`${b.dataset.mode}秒`);
 const active=$('#captureModes .active'),now=$('#captureNow');if(now&&active){now.textContent=active.dataset.mode==='photo'?'拍一张':`拍摄 ${active.dataset.mode} 秒`}
 const scanLabel=$('#scanBtn span');if(scanLabel)scanLabel.textContent='拍摄记录';
}
function renderQuick(){
 const all=eqAll(),byId=new Map(all.map(e=>[e.id,e])),u=usageMap();
 const recent=[...u.entries()].sort((a,b)=>b[1].last-a[1].last).map(([id,x])=>({eq:byId.get(id),u:x})).filter(x=>x.eq).slice(0,5);
 const used=[...u.entries()].sort((a,b)=>b[1].n-a[1].n||b[1].last-a[1].last).map(([id,x])=>({eq:byId.get(id),u:x})).filter(x=>x.eq);
 const custom=all.filter(e=>e.custom).map(eq=>({eq,u:u.get(eq.id)||{n:0,last:0,event:null}}));
 let mine=[];for(const x of used.concat(custom)){if(!mine.some(y=>y.eq.id===x.eq.id)&&!recent.some(y=>y.eq.id===x.eq.id))mine.push(x);if(mine.length>=5)break}
 if(!recent.length)recent=CURATED.map(id=>({eq:byId.get(id),u:{n:0,event:null}})).filter(x=>x.eq);
 const row=x=>`<button class="quickItem" data-v71-eq="${esc(x.eq.id)}"><span><b>${esc(x.eq.name)}</b><small>${x.u.event?esc(meta(x.u.event)):esc((x.eq.muscles||[]).slice(0,2).join(' · '))}</small></span>${x.u.event?'<em>上次</em>':'<i>›</i>'}</button>`;
 $('#quickRecentList').innerHTML=recent.map(row).join('');
 $('#quickMineBlock').classList.toggle('hidden',!mine.length);$('#quickMineList').innerHTML=mine.map(row).join('');
}
function openQuick(){
 const film=$('#film');if(film?.querySelector('img')){sessionStorage.setItem('axis_v71_reopen_quick','1');location.reload();return}
 renderQuick();$('#quickRecordSheet').classList.add('show');window.AXISPlatform?.haptic?.('light');
}
function restoreQuickAfterReload(){if(sessionStorage.getItem('axis_v71_reopen_quick')==='1'){sessionStorage.removeItem('axis_v71_reopen_quick');setTimeout(openQuick,160)}}
function selectCoreEq(id){
 $('#equipmentRow')?.click();const items=$$('#eqSheet [data-eq]'),target=items.find(b=>b.dataset.eq===id);if(!target){$('#eqSheet')?.classList.remove('show');return false}target.click();return true;
}
function showQuickEditor(id){
 $('#quickRecordSheet')?.classList.remove('show');if(!selectCoreEq(id))return;
 const s=$('#scanSheet');s.classList.add('quick-record-mode');$('#captureStage')?.classList.add('hidden');$('#reviewStage')?.classList.remove('hidden');if($('#film'))$('#film').innerHTML='';const h=$('#scanSheet .sheetHead>b');if(h)h.textContent='快速记录';s.classList.add('show');window.AXISPlatform?.haptic?.('light');
}
function chooseOther(){
 $('#quickRecordSheet').classList.remove('show');choosingFromQuick=true;$('#equipmentRow')?.click();
}
function showQuickShellAfterCoreSelection(){const s=$('#scanSheet');s.classList.add('quick-record-mode');$('#captureStage')?.classList.add('hidden');$('#reviewStage')?.classList.remove('hidden');if($('#film'))$('#film').innerHTML='';const h=$('#scanSheet .sheetHead>b');if(h)h.textContent='快速记录';s.classList.add('show')}
function onClick(e){
 const t=e.target.closest('button');if(!t)return;
 if(t.dataset.v71Eq){e.preventDefault();e.stopPropagation();showQuickEditor(t.dataset.v71Eq);return}
 if(t.closest('#captureModes'))setTimeout(setCaptureCopy,0);
 if(t.id==='scanBtn')setTimeout(()=>{$('#scanSheet')?.classList.remove('quick-record-mode');setCaptureCopy()},0);
 if(choosingFromQuick&&t.matches('#eqSheet [data-eq]')){choosingFromQuick=false;setTimeout(showQuickShellAfterCoreSelection,0)}
 if(t.id==='addCustomEq'&&$('#scanSheet')?.classList.contains('quick-record-mode')){$('#scanSheet').classList.remove('show');returnAfterCustom=true}
 if(t.id==='saveCustomEq'&&returnAfterCustom){returnAfterCustom=false;setTimeout(()=>{renderQuick();$('#quickRecordSheet').classList.add('show')},80)}
}
const mo=new MutationObserver(ms=>{for(const m of ms){if(m.target?.id==='scanSheet'&&m.attributeName==='class'&&!m.target.classList.contains('show')){m.target.classList.remove('quick-record-mode');setCaptureCopy()}if(m.target?.id==='nextCard'&&m.type==='childList'){m.target.innerHTML=m.target.innerHTML.replace(/扫一下/g,'拍摄记录')}}});
function boot(){inject();const s=$('#scanSheet');if(s)mo.observe(s,{attributes:true,attributeFilter:['class']});const n=$('#nextCard');if(n)mo.observe(n,{childList:true,subtree:true});setCaptureCopy()}
if(D.readyState==='loading')D.addEventListener('DOMContentLoaded',boot);else boot();
})();