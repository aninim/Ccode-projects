// Service Worker — offline-first cache for Learn With Me
// Cache everything on install; serve from cache first.

const CACHE_NAME = 'ylmd-v2';

// All files to pre-cache on install
const PRECACHE = [
  './index.html',
  './i18n/he.js',
  './i18n/en.js',
  './engine/lang.js',
  './engine/speech.js',
  './engine/progress.js',
  './engine/input.js',
  './engine/adaptive.js',
  './engine/claude.js',
  './engine/theme.js',
  './modules/letters.js',
  './modules/numbers.js',
  './modules/shapes.js',
  './modules/colors.js',
  './modules/math.js',
  './modules/engineering.js',
  './modules/memory.js',
  './modules/voice.js',
  './icon.svg',
  './manifest.json',
  'https://fonts.googleapis.com/css2?family=Rubik:wght@400;700&family=Varela+Round&display=swap',
];

// Install: pre-cache all app files
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => cache.addAll(PRECACHE))
      .then(() => self.skipWaiting())
  );
});

// Activate: delete old caches
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(keys =>
      Promise.all(keys.filter(k => k !== CACHE_NAME).map(k => caches.delete(k)))
    ).then(() => self.clients.claim())
  );
});

// Fetch: cache-first strategy
self.addEventListener('fetch', event => {
  // Skip non-GET and cross-origin API calls (Claude API must go to network)
  if (event.request.method !== 'GET') return;
  if (event.request.url.includes('api.anthropic.com')) return;

  event.respondWith(
    caches.match(event.request).then(cached => {
      if (cached) return cached;
      return fetch(event.request).then(response => {
        // Cache valid responses (not errors)
        if (!response || response.status !== 200 || response.type === 'error') {
          return response;
        }
        const clone = response.clone();
        caches.open(CACHE_NAME).then(cache => cache.put(event.request, clone));
        return response;
      }).catch(() => {
        // Offline fallback: serve index.html for navigation requests
        if (event.request.mode === 'navigate') {
          return caches.match('./index.html');
        }
      });
    })
  );
});
