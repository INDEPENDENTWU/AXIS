const CACHE='axis-v712-shell';
self.addEventListener('install',e=>e.waitUntil(self.skipWaiting()));
self.addEventListener('activate',e=>e.waitUntil(caches.keys().then(ks=>Promise.all(ks.filter(k=>k!==CACHE).map(k=>caches.delete(k)))).then(()=>self.clients.claim())));
self.addEventListener('fetch',e=>{
  if(e.request.method!=='GET')return;
  const u=new URL(e.request.url);
  if(u.origin!==self.location.origin||u.pathname.startsWith('/api/'))return;
  e.respondWith((async()=>{
    try{
      const r=await fetch(e.request);
      if(r&&r.ok){const x=r.clone();const c=await caches.open(CACHE);await c.put(e.request.mode==='navigate'?'/index.html':e.request,x)}
      return r;
    }catch(err){
      const c=await caches.open(CACHE);
      const hit=await c.match(e.request.mode==='navigate'?'/index.html':e.request);
      if(hit)return hit;
      throw err;
    }
  })());
});
