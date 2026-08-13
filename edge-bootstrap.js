(()=>{'use strict';
const BOOT='878';
const nativeFetch=window.fetch.bind(window);
const rootPath=location.pathname==='/'||location.pathname==='/index.html';
try{
  const u=new URL(location.href);
  if(rootPath&&!u.searchParams.has('axisboot')){
    u.searchParams.set('axisboot',BOOT);
    u.searchParams.set('v',BOOT);
    location.replace(u.pathname+'?'+u.searchParams.toString());
    return;
  }
}catch{}
window.fetch=(input,init={})=>{
  const url=typeof input==='string'?input:(input?.url||'');
  const method=String(init?.method||'GET').toUpperCase();
  if(method==='GET'&&/\/api\/analyze(?:\?|$)/.test(url)){
    return Promise.resolve(new Response(JSON.stringify({available:false,boot:true}),{status:200,headers:{'Content-Type':'application/json','Cache-Control':'no-store'}}));
  }
  return nativeFetch(input,init);
};
function clearLegacy(){
  if(!('serviceWorker'in navigator))return Promise.resolve();
  const sw=navigator.serviceWorker;
  try{Object.defineProperty(sw,'register',{configurable:true,value:()=>Promise.resolve(null)})}
  catch{try{sw.register=()=>Promise.resolve(null)}catch{}}
  return sw.getRegistrations?.().then(rs=>Promise.all(rs.map(r=>r.unregister()))).catch(()=>{});
}
clearLegacy();
window.addEventListener('load',()=>setTimeout(clearLegacy,0),{once:true});
window.__AXIS_BOOT_READY__=true;
if(!document.getElementById('axisVersionBootStyle')){
  const s=document.createElement('style');s.id='axisVersionBootStyle';s.textContent='.versionLine{visibility:hidden!important}';(document.head||document.documentElement).appendChild(s);
}
const reveal=()=>document.getElementById('axisVersionBootStyle')?.remove();
const hardWatch=setTimeout(()=>{window.__AXIS_BOOT_WATCHDOG__='fail-open';window.__AXIS_LATEST_LOADING__=false;reveal()},12000);
function installRuntimeSandbox(){
  const NativeMO=window.MutationObserver;
  const nativeSetInterval=window.setInterval.bind(window);
  let restored=false;
  if(NativeMO){
    class AxisScopedObserver{
      constructor(callback){this.callback=callback;this.queue=[];this.timer=0;this.observers=[]}
      _make(target,options){const o=new NativeMO(records=>{this.queue.push(...records);if(this.timer)return;this.timer=setTimeout(()=>{this.timer=0;const batch=this.queue.splice(0);try{this.callback(batch,this)}catch(e){console.warn('[AXIS] observer skipped',e)}},48)});o.observe(target,options);this.observers.push(o)}
      observe(target,options={}){
        if(target===document.body&&options.subtree&&options.attributes){
          const specs=[['#scanSheet',{attributes:true,attributeFilter:['class'],childList:true,subtree:true}],['#reviewStage',{attributes:true,attributeFilter:['class'],childList:true,subtree:true}],['#settingsSheet',{attributes:true,attributeFilter:['class'],childList:true,subtree:true}],['#finishSheet',{attributes:true,attributeFilter:['class'],childList:true,subtree:true}],['#todayView',{attributes:true,attributeFilter:['class']}],['#activeHome',{attributes:true,attributeFilter:['class']}]];
          let n=0;for(const [sel,opts] of specs){const el=document.querySelector(sel);if(el){this._make(el,opts);n++}}if(!n)this._make(document.body,{childList:true});return;
        }
        this._make(target,options);
      }
      disconnect(){clearTimeout(this.timer);this.timer=0;this.queue.length=0;this.observers.forEach(o=>o.disconnect());this.observers=[]}
      takeRecords(){return this.observers.flatMap(o=>o.takeRecords())}
    }
    window.MutationObserver=AxisScopedObserver;
  }
  window.setInterval=(fn,delay,...args)=>nativeSetInterval(fn,Math.max(100,Number(delay)||0),...args);
  return()=>{if(restored)return;restored=true;if(NativeMO)window.MutationObserver=NativeMO;window.setInterval=nativeSetInterval};
}
function loadScript(path,timeout=3200){
  return new Promise(resolve=>{
    const s=document.createElement('script');let done=false;
    const finish=ok=>{if(done)return;done=true;clearTimeout(timer);s.onload=s.onerror=null;if(!ok)try{s.remove()}catch{}resolve(ok)};
    const timer=setTimeout(()=>finish(false),timeout);
    s.src=path+(path.includes('?')?'&':'?')+'boot='+BOOT;
    s.async=true;
    s.onload=()=>finish(true);
    s.onerror=()=>finish(false);
    (document.head||document.documentElement).appendChild(s);
  });
}
function mark(flag,ok){window[flag]=!!ok;return ok}
async function loadLatest(){
  if(window.__AXIS_LATEST_LOADING__||window.__AXIS_LATEST_READY__)return;
  window.__AXIS_LATEST_LOADING__=true;
  window.__AXIS_BOOT_WATCHDOG__='loading';
  const deadline=performance.now()+11000;
  const left=()=>Math.max(900,Math.min(3200,deadline-performance.now()));
  let restore=installRuntimeSandbox(),ok=false;
  try{
    ok=await loadScript('/v82-runtime.js?v=878',left());
    mark('__AXIS_82_READY__',ok);
    if(!ok)throw new Error('v82');
    await new Promise(r=>setTimeout(r,620));
  }finally{restore();restore=null}
  const stages=[
    ['/v83-reminders.js?v=878','__AXIS_83_READY__'],
    ['/v84-runtime.js?v=878','__AXIS_84_READY__'],
    ['/v85-runtime.js?v=878','__AXIS_85_READY__'],
    ['/v85-canvas-fix.js?v=878','__AXIS_85_CANVAS_READY__'],
    ['/v86-runtime.js?v=878','__AXIS_86_READY__'],
    ['/v86-gesture.js?v=878','__AXIS_86_GESTURE_READY__'],
    ['/v87-runtime.js?v=878','__AXIS_87_READY__'],
    ['/v87-fix.js?v=878','__AXIS_87_FIX_READY__'],
    ['/v871-fix.js?v=878','__AXIS_871_READY__'],
    ['/v872-fix.js?v=878','__AXIS_872_READY__'],
    ['/v873-exercise-library.js?v=878','__AXIS_873_LIBRARY_READY__'],
    ['/v873-smart-input.js?v=878','__AXIS_873_READY__'],
    ['/v874-professional.js?v=878','__AXIS_874_READY__'],
    ['/v874-set-bridge.js?v=878','__AXIS_874_SET_READY__'],
    ['/v875-polish.js?v=878','__AXIS_875_READY__'],
    ['/v876-runtime.js?v=878','__AXIS_876_READY__'],
    ['/v877-runtime.js?v=878','__AXIS_877_READY__'],
    ['/v878-stability.js?v=878','__AXIS_878_READY__']
  ];
  for(const [src,flag] of stages){
    if(performance.now()>=deadline)throw new Error('deadline');
    if(src.includes('/v85-runtime.js')){
      if(window.CanvasRenderingContext2D&&!window.__AXIS_NATIVE_DRAWIMAGE__)window.__AXIS_NATIVE_DRAWIMAGE__=CanvasRenderingContext2D.prototype.drawImage;
      if(window.HTMLCanvasElement&&!window.__AXIS_NATIVE_TOBLOB__)window.__AXIS_NATIVE_TOBLOB__=HTMLCanvasElement.prototype.toBlob;
    }
    ok=await loadScript(src,left());mark(flag,ok);if(!ok)throw new Error(src);
  }
  window.__AXIS_LATEST_READY__=true;
  window.__AXIS_BOOT_WATCHDOG__='ready';
}
function start(){
  loadLatest().catch(err=>{console.warn('[AXIS] boot fail-open',err);window.__AXIS_BOOT_WATCHDOG__='degraded';window.__AXIS_LATEST_READY__=false}).finally(()=>{window.__AXIS_LATEST_LOADING__=false;clearTimeout(hardWatch);reveal()});
}
window.addEventListener('pageshow',e=>{if(e.persisted&&!window.__AXIS_LATEST_READY__&&!window.__AXIS_LATEST_LOADING__)setTimeout(start,0)});
if(document.readyState==='complete')setTimeout(start,120);
else window.addEventListener('load',()=>setTimeout(start,120),{once:true});
})();