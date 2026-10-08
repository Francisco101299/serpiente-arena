const C='sa-v21',F=['./','index.html','manifest.json','icon-192.png','icon-512.png','icon-maskable-512.png','privacy.html'];
self.addEventListener('install',e=>{e.waitUntil(caches.open(C).then(c=>Promise.all(F.map(u=>c.add(u).catch(()=>{})))));self.skipWaiting()});
self.addEventListener('activate',e=>{e.waitUntil(caches.keys().then(k=>Promise.all(k.filter(x=>x!==C).map(x=>caches.delete(x)))));self.clients.claim()});
self.addEventListener('fetch',e=>{
  const r=e.request;if(r.method!=='GET')return;
  if(new URL(r.url).origin!==location.origin)return;
  e.respondWith(caches.match(r,{ignoreSearch:true}).then(c=>{
    const n=fetch(r).then(res=>{if(res.ok){const cl=res.clone();caches.open(C).then(x=>x.put(r,cl))}return res}).catch(()=>null);
    return c||n.then(res=>res||(r.mode==='navigate'?caches.match('index.html'):Response.error()));
  }));
});
