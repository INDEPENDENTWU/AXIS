(()=>{'use strict';
const D=document;
function preferred(){const p=String(window.__AXIS_CAPTURE_PREF__?.get?.()||'');return ['photo','3','5'].includes(p)?p:'3'}
function open(){const c=window.__AXIS_CAPTURE__;if(!c||typeof c.openCanonicalCamera!=='function')return false;return c.openCanonicalCamera(preferred(),null,false)}
function bind(){const b=D.querySelector('#scanBtn');if(!b)return false;b.onclick=open;b.dataset.axisCaptureEntryOwner='v816-capture-entry-seal';return true}
bind();
window.addEventListener('pageshow',bind,{passive:true});
window.__AXIS_816_CAPTURE_ENTRY__={version:'8.16',owner:'v816-capture-entry-seal',delegatesTo:'app.js',cameraOwner:false,recorderOwner:false,persistence:false,network:false};
window.__AXIS_816_CAPTURE_ENTRY_READY__=true;
})();
