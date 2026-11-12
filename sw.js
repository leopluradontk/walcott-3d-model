const CACHE='walcott-r05-github-1';
const CORE=["./", "index.html", "app.js", "asset-loader.js", "manifest.webmanifest", "INSTALL.html", "assets/tk-logo.png", "assets/icon-192.png", "assets/icon-512.png", "assets/model.bin", "assets/geometry-index.json"];
let saving;
self.addEventListener('install',event=>event.waitUntil((async()=>{const c=await caches.open(CACHE);await c.addAll(CORE);await self.skipWaiting()})()));
self.addEventListener('activate',event=>event.waitUntil((async()=>{for(const key of await caches.keys())if(key.startsWith('walcott-')&&key!==CACHE)await caches.delete(key);await self.clients.claim()})()));
self.addEventListener('fetch',event=>{
  if(event.request.method!=='GET'||new URL(event.request.url).origin!==self.location.origin)return;
  event.respondWith((async()=>{const c=await caches.open(CACHE);const hit=await c.match(event.request);if(hit)return hit;const r=await fetch(event.request);if(r.ok){await c.put(event.request,r.clone());}return r})());
});
async function offlineList(){const c=await caches.open(CACHE);const url=new URL('offline-files.json',self.location);let r=await c.match(url);if(!r){r=await fetch(url);if(!r.ok)throw new Error('Offline file list is unavailable');await c.put(url,r.clone())}return r.json()}
async function notify(message){for(const client of await self.clients.matchAll({includeUncontrolled:true}))client.postMessage(message)}
self.addEventListener('message',event=>{
  if(event.data?.type==='CHECK_OFFLINE')event.waitUntil((async()=>{try{const c=await caches.open(CACHE);const files=await offlineList();for(const path of files)if(!await c.match(new URL(path,self.location))){event.source?.postMessage({type:'OFFLINE_MISSING'});return}event.source?.postMessage({type:'OFFLINE_READY'})}catch(e){event.source?.postMessage({type:'OFFLINE_ERROR',message:e.message})}})());
  if(event.data?.type==='SAVE_OFFLINE'){
    if(!saving)saving=(async()=>{try{
      const c=await caches.open(CACHE),files=await offlineList();let done=0,next=0;
      const worker=async()=>{while(next<files.length){const path=files[next++],url=new URL(path,self.location);if(!await c.match(url)){const r=await fetch(url);if(!r.ok)throw new Error(path+' HTTP '+r.status);await c.put(url,r)}done++;await notify({type:'OFFLINE_PROGRESS',done,total:files.length})}};
      await Promise.all(Array.from({length:3},worker));await notify({type:'OFFLINE_READY'});
    }catch(e){await notify({type:'OFFLINE_ERROR',message:e.message})}finally{saving=null}})();
    event.waitUntil(saving);
  }
});
