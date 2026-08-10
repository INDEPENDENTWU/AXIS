(()=>{'use strict';
const isEdgePreview=/\.edgeone\.cool$/i.test(location.hostname);
const nativeFetch=window.fetch.bind(window);
window.fetch=(input,init={})=>{
  const url=typeof input==='string'?input:(input?.url||'');
  const method=String(init?.method||'GET').toUpperCase();
  // Core app still performs a legacy GET /api/analyze health check at boot.
  // On EdgeOne preview this request is unnecessary and can keep Safari busy,
  // so answer it locally. Real POST recognition and /api/ai-status remain live.
  if(isEdgePreview&&method==='GET'&&url==='/api/analyze'){
    return Promise.resolve(new Response(JSON.stringify({available:false,preview:true}),{
      status:200,headers:{'Content-Type':'application/json','Cache-Control':'no-store'}
    }));
  }
  return nativeFetch(input,init);
};
if(isEdgePreview&&'serviceWorker' in navigator){
  try{navigator.serviceWorker.getRegistrations?.().then(rs=>rs.forEach(r=>r.unregister())).catch(()=>{})}catch{}
  try{navigator.serviceWorker.register=()=>Promise.resolve(null)}catch{}
}
window.__AXIS_EDGE_PREVIEW__=isEdgePreview;
})();