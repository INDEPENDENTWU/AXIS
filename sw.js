const CACHE='axis-v50-shell';
const CORE=['/','/index.html','/styles.css','/app.js','/manifest.webmanifest'];
self.addEventListener('install',e=>e.waitUntil(caches.open(CACHE).then(c=>c.addAll(CORE)).then(()=>self.skipWaiting())));
self.addEventListener('activate',e=>e.waitUntil(caches.keys().then(ks=>Promise.all(ks.filter(k=>k!==CACHE).map(k=>caches.delete(k)))).then(()=>self.clients.claim())));
self.addEventListener('fetch',e=>{if(e.request.method!=='GET')return;const u=new URL(e.request.url);if(u.origin!==self.location.origin||u.pathname.startsWith('/api/'))return;if(e.request.mode==='navigate'){e.respondWith(fetch(e.request).then(r=>{const x=r.clone();caches.open(CACHE).then(c=>c.put('/index.html',x));return r}).catch(()=>caches.match('/index.html')));return}e.respondWith(caches.match(e.request).then(x=>x||fetch(e.request).then(r=>{if(r.ok){const y=r.clone();caches.open(CACHE).then(c=>c.put(e.request,y))}return r})))});
