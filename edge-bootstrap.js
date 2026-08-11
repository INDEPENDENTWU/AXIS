(()=>{'use strict';
const nativeFetch=window.fetch.bind(window);
window.fetch=(input,init={})=>{
  const url=typeof input==='string'?input:(input?.url||'');
  const method=String(init?.method||'GET').toUpperCase();
  // The legacy core only uses GET /api/analyze as a boot-time health probe.
  // Never let that network request delay page readiness on any host.
  if(method==='GET'&&/\/api\/analyze(?:\?|$)/.test(url)){
    return Promise.resolve(new Response(JSON.stringify({available:false,boot:true}),{
      status:200,
      headers:{'Content-Type':'application/json','Cache-Control':'no-store'}
    }));
  }
  return nativeFetch(input,init);
};

// Keep startup deterministic: legacy Service Workers must never own navigation.
if('serviceWorker' in navigator){
  const sw=navigator.serviceWorker;
  try{Object.defineProperty(sw,'register',{configurable:true,value:()=>Promise.resolve(null)})}
  catch{try{sw.register=()=>Promise.resolve(null)}catch{}}
  const clear=()=>sw.getRegistrations?.().then(rs=>Promise.all(rs.map(r=>r.unregister()))).catch(()=>{});
  clear();
  window.addEventListener('load',()=>setTimeout(clear,0),{once:true});
}
window.__AXIS_BOOT_READY__=true;

// 8.1 already owns the broad body-level UI observation. The original 8.2
// enhancement added a second body-wide observer which can cause a mutation
// feedback storm on WebKit. While 8.2 is being constructed, replace only the
// MutationObserver constructor it sees with a coalesced/scoped adapter. Existing
// core observers are untouched. After the script has executed, restore the
// browser-native constructor immediately.
function installObserverSandbox(){
  const Native=window.MutationObserver;
  if(!Native)return()=>{};
  class AxisScopedObserver{
    constructor(callback){
      this.callback=callback;
      this.queue=[];
      this.timer=0;
      this.native=new Native((records)=>{
        this.queue.push(...records);
        if(this.timer)return;
        this.timer=setTimeout(()=>{
          this.timer=0;
          const batch=this.queue.splice(0);
          try{this.callback(batch,this)}catch(e){console.warn('[AXIS] enhancement observer skipped',e)}
        },48);
      });
    }
    observe(target,options={}){
      // The dangerous observer is exactly: body + subtree + class attributes.
      // Replace it with a handful of UI surfaces that 8.2 actually needs.
      if(target===document.body&&options.subtree&&options.attributes){
        const specs=[
          ['#scanSheet',{attributes:true,attributeFilter:['class'],childList:true,subtree:true}],
          ['#reviewStage',{attributes:true,attributeFilter:['class'],childList:true,subtree:true}],
          ['#settingsSheet',{attributes:true,attributeFilter:['class'],childList:true,subtree:true}],
          ['#finishSheet',{attributes:true,attributeFilter:['class'],childList:true,subtree:true}],
          ['#todayView',{attributes:true,attributeFilter:['class']}],
          ['#activeHome',{attributes:true,attributeFilter:['class']}]
        ];
        let attached=false;
        for(const [sel,opts] of specs){const node=document.querySelector(sel);if(node){this.native.observe(node,opts);attached=true}}
        // If markup ever changes, observe body child insertion only; never all
        // subtree class mutations. This keeps the enhancement fail-soft.
        if(!attached)this.native.observe(document.body,{childList:true});
        return;
      }
      this.native.observe(target,options);
    }
    disconnect(){clearTimeout(this.timer);this.timer=0;this.queue.length=0;this.native.disconnect()}
    takeRecords(){return this.native.takeRecords()}
  }
  window.MutationObserver=AxisScopedObserver;
  return()=>{window.MutationObserver=Native};
}

// Latest product layers are deliberately non-critical. AXIS core becomes usable
// first; enhancements load only after the window load event and can never block boot.
const loadLatest=()=>{
  if(window.__AXIS_LATEST_LOADING__)return;
  window.__AXIS_LATEST_LOADING__=true;
  const load=(src,done)=>{
    const s=document.createElement('script');
    s.src=src;s.async=true;
    s.onload=()=>done?.(true);
    s.onerror=()=>done?.(false);
    (document.head||document.documentElement).appendChild(s);
  };
  const restoreObserver=installObserverSandbox();
  load('/v82-runtime.js?v=835',ok=>{
    restoreObserver();
    if(!ok){window.__AXIS_LATEST_LOADING__=false;return}
    window.__AXIS_82_READY__=true;
    load('/v83-reminders.js?v=835',()=>{window.__AXIS_LATEST_LOADING__=false;window.__AXIS_LATEST_READY__=true});
  });
};
if(document.readyState==='complete')setTimeout(loadLatest,120);
else window.addEventListener('load',()=>setTimeout(loadLatest,120),{once:true});
})();