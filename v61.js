(()=>{'use strict';
const D=document,$=s=>D.querySelector(s),$$=s=>Array.from(D.querySelectorAll(s));
let saving=false,saveFallback=null,lastEventCount='';
const childFromSettings=new Set(['profileBtn','myEqBtn','watermarkBtn','storageBtn','reportBtn']);
function visibleSheet(){return $$('.sheetWrap.show').some(x=>x.id!=='finishSheet')}
function todayActive(){return $('#todayView')?.classList.contains('active')}
function syncDock(){const dock=$('#dock');if(!dock)return;dock.classList.toggle('v61-hidden',!todayActive()||visibleSheet()||saving)}
function removeShow(id){$('#'+id)?.classList.remove('show')}
function posName(p){return({tl:'左上',tr:'右上',bl:'左下',br:'右下'})[p]||'左下'}
function ensureWatermarkHint(){const preview=$('#watermarkPreview');if(!preview)return;let hint=$('.watermarkHint');if(!hint){hint=D.createElement('div');hint.className='watermarkHint';hint.innerHTML='<b>水印位置</b><span id="wmPositionText"></span>';preview.parentNode.insertBefore(hint,preview)}syncWatermarkPosition()}
function syncWatermarkPosition(){const chip=$('#wmChip'),preview=$('#watermarkPreview');if(!chip||!preview)return;const p=chip.getAttribute('data-pos')||'bl';$$('#watermarkPreview [data-pos]').forEach(b=>b.dataset.selected=String(b.dataset.pos===p));const t=$('#wmPositionText');if(t)t.textContent=`${posName(p)} · 点击画面四角切换`}
function stopPreviewCamera(){const v=$('#cameraVideo'),s=v?.srcObject;if(s?.getTracks)s.getTracks().forEach(t=>{try{t.stop()}catch{}})}
function pulse(text='已记下'){let p=$('.v61-savingPulse');if(!p){p=D.createElement('div');p.className='v61-savingPulse';D.body.appendChild(p)}p.textContent=text;clearTimeout(p._t);p._t=setTimeout(()=>p.remove(),1200)}
function beginCommit(){if(saving)return;const name=$('#equipmentName')?.textContent?.trim();if(!name||name==='待确认')return;saving=true;const btn=$('#saveScan');if(btn){btn.classList.add('v61-committing');btn.textContent='已记下'};pulse('已记下');requestAnimationFrame(()=>{removeShow('scanSheet');stopPreviewCamera();syncDock()});clearTimeout(saveFallback);saveFallback=setTimeout(()=>finishCommit(),10000)}
function finishCommit(){if(!saving)return;saving=false;clearTimeout(saveFallback);const btn=$('#saveScan');if(btn){btn.classList.remove('v61-committing');btn.textContent='记下'}syncDock()}
D.addEventListener('click',e=>{
 const t=e.target.closest('button,[data-edit-eq]');if(!t)return;
 if(childFromSettings.has(t.id))removeShow('settingsSheet');
 if(t.id==='newCustomEq'||t.matches('[data-edit-eq]'))removeShow('myEqSheet');
 if(t.id==='saveScan')beginCommit();
 if(t.closest('#watermarkPreview')&&t.dataset.pos)requestAnimationFrame(syncWatermarkPosition);
 requestAnimationFrame(syncDock);
},true);
D.addEventListener('click',e=>{if(e.target.closest('.nav button'))requestAnimationFrame(syncDock)},false);
const observer=new MutationObserver(muts=>{
 let dockDirty=false,wmDirty=false;
 for(const m of muts){if(m.type==='attributes'&&m.attributeName==='class')dockDirty=true;if(m.target?.id==='wmChip'&&m.attributeName==='data-pos')wmDirty=true}
 if(wmDirty)syncWatermarkPosition();if(dockDirty)syncDock();
});
observer.observe(D.documentElement,{subtree:true,attributes:true,attributeFilter:['class','data-pos']});
const list=$('#eventList');if(list){lastEventCount=$('#eventCount')?.textContent||'';new MutationObserver(()=>{const now=$('#eventCount')?.textContent||'';if(saving&&now!==lastEventCount)finishCommit();lastEventCount=now}).observe(list,{childList:true,subtree:true})}
ensureWatermarkHint();syncDock();
window.addEventListener('pageshow',()=>{ensureWatermarkHint();syncDock()});
function loadV7(){
 if(!D.querySelector('link[data-axis-v7]')){const l=D.createElement('link');l.rel='stylesheet';l.href='/styles-v7.css?v=700';l.dataset.axisV7='1';D.head.appendChild(l)}
 const p=D.createElement('script');p.src='/platform-v7.js?v=700';p.onload=()=>{const e=D.createElement('script');e.src='/enhance-v7.js?v=700';D.head.appendChild(e)};D.head.appendChild(p);
}
loadV7();
})();