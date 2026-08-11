(()=>{'use strict';
const nativeFetch=window.fetch.bind(window);
window.fetch=(input,init={})=>{
  const url=typeof input==='string'?input:(input?.url||'');
  const method=String(init?.method||'GET').toUpperCase();
  if(method==='GET'&&/\/api\/analyze(?:\?|$)/.test(url)){
    return Promise.resolve(new Response(JSON.stringify({available:false,boot:true}),{
      status:200,headers:{'Content-Type':'application/json','Cache-Control':'no-store'}
    }));
  }
  return nativeFetch(input,init);
};
if('serviceWorker' in navigator){
  const sw=navigator.serviceWorker;
  try{Object.defineProperty(sw,'register',{configurable:true,value:()=>Promise.resolve(null)})}
  catch{try{sw.register=()=>Promise.resolve(null)}catch{}}
  const clear=()=>sw.getRegistrations?.().then(rs=>Promise.all(rs.map(r=>r.unregister()))).catch(()=>{});
  clear();window.addEventListener('load',()=>setTimeout(clear,0),{once:true});
}
window.__AXIS_BOOT_READY__=true;
function installRuntimeSandbox(){
  const NativeMO=window.MutationObserver;
  const nativeSetInterval=window.setInterval.bind(window);
  let restored=false;
  if(NativeMO){
    class AxisScopedObserver{
      constructor(callback){this.callback=callback;this.queue=[];this.timer=0;this.observers=[]}
      _make(target,options){const o=new NativeMO(records=>{this.queue.push(...records);if(this.timer)return;this.timer=setTimeout(()=>{this.timer=0;const batch=this.queue.splice(0);try{this.callback(batch,this)}catch(e){console.warn('[AXIS] scoped observer skipped',e)}},48)});o.observe(target,options);this.observers.push(o)}
      observe(target,options={}){if(target===document.body&&options.subtree&&options.attributes){const specs=[['#scanSheet',{attributes:true,attributeFilter:['class'],childList:true,subtree:true}],['#reviewStage',{attributes:true,attributeFilter:['class'],childList:true,subtree:true}],['#settingsSheet',{attributes:true,attributeFilter:['class'],childList:true,subtree:true}],['#finishSheet',{attributes:true,attributeFilter:['class'],childList:true,subtree:true}],['#todayView',{attributes:true,attributeFilter:['class']}],['#activeHome',{attributes:true,attributeFilter:['class']}]];let n=0;for(const [sel,opts] of specs){const el=document.querySelector(sel);if(el){this._make(el,opts);n++}}if(!n)this._make(document.body,{childList:true});return}this._make(target,options)}
      disconnect(){clearTimeout(this.timer);this.timer=0;this.queue.length=0;this.observers.forEach(o=>o.disconnect());this.observers=[]}
      takeRecords(){return this.observers.flatMap(o=>o.takeRecords())}
    }
    window.MutationObserver=AxisScopedObserver;
  }
  window.setInterval=(fn,delay,...args)=>nativeSetInterval(fn,Math.max(100,Number(delay)||0),...args);
  return()=>{if(restored)return;restored=true;if(NativeMO)window.MutationObserver=NativeMO;window.setInterval=nativeSetInterval};
}
const loadScript=(src,done)=>{const s=document.createElement('script');s.src=src;s.async=true;s.onload=()=>done?.(true);s.onerror=()=>done?.(false);(document.head||document.documentElement).appendChild(s)};
const loadLatest=()=>{
  if(window.__AXIS_LATEST_LOADING__||window.__AXIS_LATEST_READY__)return;
  window.__AXIS_LATEST_LOADING__=true;
  const restore=installRuntimeSandbox();
  loadScript('/v82-runtime.js?v=836',ok=>{
    if(!ok){restore();window.__AXIS_LATEST_LOADING__=false;return}
    setTimeout(()=>{
      restore();window.__AXIS_82_READY__=true;
      loadScript('/v83-reminders.js?v=836',()=>{
        window.__AXIS_83_READY__=true;
        loadScript('/v84-runtime.js?v=840',()=>{
          window.__AXIS_84_READY__=true;
          if(window.CanvasRenderingContext2D&&!window.__AXIS_NATIVE_DRAWIMAGE__)window.__AXIS_NATIVE_DRAWIMAGE__=CanvasRenderingContext2D.prototype.drawImage;
          loadScript('/v85-runtime.js?v=850',ok85=>{
            if(!ok85){window.__AXIS_LATEST_LOADING__=false;window.__AXIS_LATEST_READY__=true;return}
            window.__AXIS_85_READY__=true;
            loadScript('/v85-canvas-fix.js?v=850',()=>{
              loadScript('/v86-runtime.js?v=860',ok86=>{
                window.__AXIS_86_READY__=!!ok86;
                if(!ok86){window.__AXIS_LATEST_LOADING__=false;window.__AXIS_LATEST_READY__=true;return}
                loadScript('/v86-gesture.js?v=860',()=>{
                  loadScript('/v87-runtime.js?v=870',ok87=>{
                    window.__AXIS_87_READY__=!!ok87;
                    if(!ok87){window.__AXIS_LATEST_LOADING__=false;window.__AXIS_LATEST_READY__=true;return}
                    loadScript('/v87-fix.js?v=870',()=>{
                      window.__AXIS_LATEST_LOADING__=false;
                      window.__AXIS_LATEST_READY__=true;
                    });
                  });
                });
              });
            });
          });
        });
      });
    },900);
  });
};
if(document.readyState==='complete')setTimeout(loadLatest,350);
else window.addEventListener('load',()=>setTimeout(loadLatest,350),{once:true});
})();