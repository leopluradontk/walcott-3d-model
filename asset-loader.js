(() => {
  const files = new Map();
  const fetchOK = async path => {
    const response = await fetch(path);
    if (!response.ok) throw new Error(`${path}: HTTP ${response.status}`);
    return response;
  };
  let indexPromise;
  window.WalcottAssets = {
    async model() {
      const response = await fetchOK('assets/model.bin');
      return new Response(response.body.pipeThrough(new DecompressionStream('gzip'))).arrayBuffer();
    },
    async geometry(id, full) {
      indexPromise ||= fetchOK('assets/geometry-index.json').then(r => r.json()).catch(e => {indexPromise=null;throw e});
      const index = await indexPromise;
      const path = index[full ? 'full' : 'detail'][String(id)];
      if (!path) throw new Error(`Missing geometry ${id}`);
      if (!files.has(path)) {
        files.set(path, fetchOK(path).then(r => r.json()).catch(e => {files.delete(path);throw e}));
      }
      const data = (await files.get(path))[String(id)];
      if (!data) throw new Error(`Missing geometry ${id} in ${path}`);
      return data;
    }
  };
  const button = document.getElementById('saveOffline');
  const status = document.getElementById('offlineStatus');
  if (!('serviceWorker' in navigator) || !window.isSecureContext) {
    button.disabled=true;
    status.textContent='Offline saving requires the published HTTPS page.';
    return;
  }
  let activeWorker;
  const workerReady = navigator.serviceWorker.register('./sw.js').then(() => navigator.serviceWorker.ready).then(reg => {
    activeWorker=reg.active;
    if (!activeWorker) throw new Error('Offline worker is not active yet. Reload and try again.');
    activeWorker.postMessage({type:'CHECK_OFFLINE'});
    return activeWorker;
  });
  workerReady.catch(e => {status.textContent='Offline setup: '+e.message});
  navigator.serviceWorker.addEventListener('message', event => {
    const data=event.data || {};
    if (data.type==='OFFLINE_PROGRESS') status.textContent=`Saving offline: ${data.done}/${data.total} files. Keep this page open.`;
    if (data.type==='OFFLINE_READY') {button.disabled=false;button.textContent='Refresh offline copy';status.textContent='Complete model saved for offline use on this device.';}
    if (data.type==='OFFLINE_MISSING') status.textContent='Tap Save for offline to download all phase and hologram details.';
    if (data.type==='OFFLINE_ERROR') {button.disabled=false;status.textContent='Could not finish saving: '+data.message+'. Reconnect and try again.';}
  });
  button.onclick=async () => {
    button.disabled=true;status.textContent='Preparing offline download…';
    try {
      if(navigator.storage?.persist) await navigator.storage.persist();
      const worker=await workerReady;
      worker.postMessage({type:'SAVE_OFFLINE'});
    } catch(e) {button.disabled=false;status.textContent=e.message;}
  };
})();
