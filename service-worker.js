const CACHE_NAME = 'dict-explore-v2'; // version updated
const urlsToCache = [
    '/',
    '/index.html',
    '/style.css',
    '/app.js',
    '/manifest.json',
    '/icons/icon-192x192.png',
    '/icons/icon-512x512.png'
];

// Install service worker and cache assets
self.addEventListener('install', (event) => {
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then((cache) => {
                console.log('Service Worker: Caching essential files');
                return cache.addAll(urlsToCache);
            })
    );
});

// Cache API response dynamically if needed (Note: Caching the API results directly can be complex; we're caching static files)
self.addEventListener('fetch', (event) => {
    // Skip caching for API requests since the responses are dynamic
    if (event.request.url.includes('https://api.dictionaryapi.dev/')) {
        return fetch(event.request);
    }

    event.respondWith(
        caches.match(event.request)
            .then((cachedResponse) => {
                // Return cached assets if available, otherwise fetch them from network
                return cachedResponse || fetch(event.request);
            })
    );
});

// Clear old caches when a new version of the service worker is activated
self.addEventListener('activate', (event) => {
    const cacheWhitelist = [CACHE_NAME];
    event.waitUntil(
        caches.keys()
            .then((cacheNames) => {
                return Promise.all(
                    cacheNames.map((cacheName) => {
                        if (!cacheWhitelist.includes(cacheName)) {
                            return caches.delete(cacheName); // Delete old caches
                        }
                    })
                );
            })
    );
});
