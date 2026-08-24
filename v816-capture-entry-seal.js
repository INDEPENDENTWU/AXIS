(()=>{'use strict';
const D=document;
function open(){const c=window.__AXIS_CAPTURE__;if(!c||typeof c.openCanonicalCamera!=='function')return false;return c.openCanonicalCamera('photo',null,false)}
function bind(){const b=D.querySelector('#scanBtn');if(!b)return false;b.onclick=open;b.dataset.axisCaptureEntryOwner='v816-capture-entry-seal';return true}
function normalizeQuickPresentation(){const s=D.querySelector('#scanSheet');if(!s||s.dataset.captureIntent!=='quick-media')return;s.classList.add('show','v882-quick-media');s.classList.remove('v8-quick');D.querySelector('#captureStage')?.classList.remove('hidden');D.querySelector('#reviewStage')?.classList.add('hidden');const h=s.querySelector('.sheetHead>b');if(h)h.textContent='拍摄记录'}
bind();
D.addEventListener('click',e=>{if(!e.target?.closest?.('#v882QuickMedia [data-v882-media]'))return;queueMicrotask(normalizeQuickPresentation)},{passive:true});
window.addEventListener('pageshow',bind,{passive:true});
window.__AXIS_816_CAPTURE_ENTRY__={version:'8.16',owner:'v816-capture-entry-seal',delegatesTo:'app.js',cameraOwner:false,recorderOwner:false,persistence:false,network:false,quickPresentation:'post-handoff-normalize',defaultResolution:'canonical-8.18-preference'};
window.__AXIS_816_CAPTURE_ENTRY_READY__=true;
})();
