const OFFLINE_QUEUE_KEY = 'edubridge_offline_queue';

function isOnline() {
  return navigator.onLine;
}

function initOfflineIndicator() {
  const pill = document.getElementById('status-pill');
  const banner = document.getElementById('offline-banner');
  if (!pill) return;

  const dot = pill.querySelector('.status-pill__dot');
  const label = pill.querySelector('.status-pill__label');

  function update() {
    const online = isOnline();
    pill.classList.toggle('status-pill--offline', !online);
    if (label) label.textContent = online ? 'Online' : 'Offline';
    if (dot) dot.title = online ? 'Connected' : 'No connection';
    if (banner) banner.classList.toggle('visible', !online);
  }

  window.addEventListener('online', () => {
    update();
    processOfflineQueue();
    window.dispatchEvent(new CustomEvent('edubridge:online'));
  });

  window.addEventListener('offline', () => {
    update();
    window.dispatchEvent(new CustomEvent('edubridge:offline'));
  });

  update();
}

function getOfflineQueue() {
  const raw = localStorage.getItem(OFFLINE_QUEUE_KEY);
  return raw ? JSON.parse(raw) : [];
}

function saveOfflineQueue(queue) {
  localStorage.setItem(OFFLINE_QUEUE_KEY, JSON.stringify(queue));
}

function queueOfflineRequest(item) {
  const queue = getOfflineQueue();
  queue.push({ ...item, queuedAt: Date.now() });
  saveOfflineQueue(queue);
}

async function processOfflineQueue() {
  if (!isOnline() || typeof apiFetch !== 'function') return;

  const queue = getOfflineQueue();
  if (!queue.length) return;

  const remaining = [];
  const synced = [];
  for (const item of queue) {
    try {
      if (item.type === 'create_request') {
        const result = await apiFetch('/api/requests', {
          method: 'POST',
          body: JSON.stringify(item.payload),
        });
        synced.push({ type: item.type, result, payload: item.payload });
      }
    } catch {
      remaining.push(item);
    }
  }
  saveOfflineQueue(remaining);

  if (synced.length) {
    window.dispatchEvent(new CustomEvent('edubridge:queue-synced', { detail: synced }));
  }
}

function onOnline(callback) {
  window.addEventListener('edubridge:online', callback);
  window.addEventListener('online', callback);
}

function onOffline(callback) {
  window.addEventListener('edubridge:offline', callback);
  window.addEventListener('offline', callback);
}

function cacheData(key, data) {
  localStorage.setItem(key, JSON.stringify({ data, cachedAt: Date.now() }));
}

function getCachedData(key) {
  const raw = localStorage.getItem(key);
  if (!raw) return null;
  try {
    return JSON.parse(raw).data;
  } catch {
    return null;
  }
}

document.addEventListener('DOMContentLoaded', () => {
  initOfflineIndicator();
  if (isOnline()) processOfflineQueue();
});
