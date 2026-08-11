const CACHE='axis-shell-v831';
const SHELL_KEY='/';

self.addEventListener('install',event=>{
  event.waitUntil((async()=>{
    const cache=await caches.open(CACHE);
    try{
      const response=await fetch('/?axis_shell=831',{cache:'reload'});
      if(response.ok)await cache.put(SHELL_KEY,response.clone());
    }catch{}
    await self.skipWaiting();
  })());
});

self.addEventListener('activate',event=>{
  event.waitUntil((async()=>{
    const keys=await caches.keys();
    await Promise.all(keys.filter(k=>k.startsWith('axis-shell-')&&k!==CACHE).map(k=>caches.delete(k)));
    await self.clients.claim();
  })());
});

self.addEventListener('fetch',event=>{
  const req=event.request;
  if(req.method!=='GET')return;
  const url=new URL(req.url);
  if(url.origin!==self.location.origin)return;
  if(url.pathname.startsWith('/api/')||url.pathname==='/owner'||url.pathname==='/owner.html'||url.pathname==='/sw.js')return;
  if(req.mode!=='navigate'||url.pathname!=='/')return;

  event.respondWith((async()=>{
    const cache=await caches.open(CACHE);
    const cached=await cache.match(SHELL_KEY);
    const refresh=fetch(req,{cache:'no-cache'}).then(async response=>{
      if(response&&response.ok)await cache.put(SHELL_KEY,response.clone());
      return response;
    }).catch(()=>null);

    if(cached){event.waitUntil(refresh);return cached}
    const live=await refresh;
    if(live)return live;
    return new Response('<!doctype html><meta name="viewport" content="width=device-width,initial-scale=1"><meta name="theme-color" content="#08090b"><style>html,body{margin:0;background:#08090b;color:#f4f3ef;font-family:-apple-system,BlinkMacSystemFont,sans-serif}main{min-height:100dvh;display:grid;place-items:center;padding:24px}b{font-size:15px;letter-spacing:.16em}span{display:block;margin-top:10px;color:#9da4af;font-size:12px}</style><main><div><b>AXIS</b><span>当前网络不可用，请稍后重试。</span></div></main>',{status:503,headers:{'Content-Type':'text/html; charset=utf-8','Cache-Control':'no-store'}});
  })());
});
