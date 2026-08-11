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
  load('/v82-runtime.js?v=833',ok=>{
    if(!ok){window.__AXIS_LATEST_LOADING__=false;return}
    window.__AXIS_82_READY__=true;
    load('/v83-reminders.js?v=833',()=>{window.__AXIS_LATEST_LOADING__=false;window.__AXIS_LATEST_READY__=true});
  });
};
if(document.readyState==='complete')setTimeout(loadLatest,80);
else window.addEventListener('load',()=>setTimeout(loadLatest,80),{once:true});
})();