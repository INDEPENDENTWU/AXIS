(()=>{'use strict';
const nativeFetch=window.fetch.bind(window);
window.fetch=(input,init={})=>{
  const url=typeof input==='string'?input:(input?.url||'');
  const method=String(init?.method||'GET').toUpperCase();
  if(method==='GET'&&/\/api\/analyze(?:\?|$)/.test(url)){
    return Promise.resolve(new Response(JSON.stringify({available:false,boot:true}),{
      status:200,
      headers:{'Content-Type':'application/json','Cache-Control':'no-store'}
    }));
  }
  return nativeFetch(input,init);
};
if('serviceWorker' in navigator){
  const sw=navigator.serviceWorker;
  try{Object.defineProperty(sw,'register',{configurable:true,value:()=>Promise.resolve(null)})}
  catch{try{sw.register=()=>Promise.resolve(null)}catch{}}
  const clear=()=>sw.getRegistrations?.().then(rs=>Promise.all(rs.map(r=>r.unregister()))).catch(()=>{});
  clear();
  window.addEventListener('load',()=>setTimeout(clear,0),{once:true});
}
window.__AXIS_BOOT_READY__=true;

const loadExperience=()=>{
  if(window.__AXIS_82_LOADING__||window.__AXIS_82_LOADED__)return;
  window.__AXIS_82_LOADING__=true;
  const s=document.createElement('script');
  s.src='/v82-runtime.js?v=824';
  s.async=true;
  s.onload=()=>{window.__AXIS_82_LOADING__=false;window.__AXIS_82_LOADED__=true};
  s.onerror=()=>{window.__AXIS_82_LOADING__=false};
  (document.head||document.documentElement).appendChild(s);
};
if(document.readyState==='complete')setTimeout(loadExperience,0);
else window.addEventListener('load',()=>setTimeout(loadExperience,0),{once:true});
})();