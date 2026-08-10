(()=>{'use strict';
const isEdgePreview=/\.edgeone\.cool$/i.test(location.hostname);
const nativeFetch=window.fetch.bind(window);
window.fetch=(input,init={})=>{
  const url=typeof input==='string'?input:(input?.url||'');
  const method=String(init?.method||'GET').toUpperCase();
  if(isEdgePreview&&method==='GET'&&(url==='/api/analyze'||url==='/api/ai-status')){
    const controller=new AbortController();
    const timer=setTimeout(()=>controller.abort(),2200);
    return nativeFetch(input,{...init,signal:controller.signal}).finally(()=>clearTimeout(timer));
  }
  return nativeFetch(input,init);
};
if(isEdgePreview&&'serviceWorker' in navigator){
  try{navigator.serviceWorker.getRegistrations?.().then(rs=>rs.forEach(r=>r.unregister())).catch(()=>{})}catch{}
  try{navigator.serviceWorker.register=()=>Promise.resolve(null)}catch{}
}
window.__AXIS_EDGE_PREVIEW__=isEdgePreview;
})();
