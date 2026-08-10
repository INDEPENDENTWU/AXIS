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

function css(href,key){if(D.querySelector(`link[data-${key}]`))return;const l=D.createElement('link');l.rel='stylesheet';l.href=href;l.setAttribute(`data-${key}`,'1');l.media='all';D.head.appendChild(l)}
function orderedScript(src,key){if(D.querySelector(`script[data-${key}]`))return;const s=D.createElement('script');s.src=src;s.async=false;s.setAttribute(`data-${key}`,'1');s.onerror=()=>console.warn('AXIS optional asset unavailable',src);D.head.appendChild(s)}

// The entire record interaction path is available immediately.
css('/styles-v71.css?v=716','axis-v71');
orderedScript('/platform-v7.js?v=716','axis-platform');
orderedScript('/quick-v71.js?v=716','axis-quick');

// AI, branded reports and secondary intelligence must never hold the browser's
// initial loading state open. Attach them only after the page has fully loaded.
let slowLoaded=false;
function loadSlow(){if(slowLoaded)return;slowLoaded=true;css('/styles-v7.css?v=716','axis-v7');css('/intelligence-v7.css?v=716','axis-intel');orderedScript('/enhance-v7.js?v=716','axis-enhance');orderedScript('/intelligence-v7.js?v=716','axis-intelligence')}
function afterLoad(){setTimeout(loadSlow,80)}
if(D.readyState==='complete')afterLoad();else window.addEventListener('load',afterLoad,{once:true});
})();