const CACHE_NAME = 'travelboss-cache-v1';
const FILES_TO_CACHE = [
  '/',
  '/index.html',
  '/offline.html',
  '/about.html',
  '/contact.html',
  '/gallery.html',
  '/css/style.css',
  '/css/responsive.css',
  '/css/utility.css',
  '/css/normalize.css',
  'assets/font/fonts.css',
  '/js/script.js',
  'assets/icons/app-icon-96-96.png',
  'assets/icons/app-icon-144-144.png',
  'assets/icons/app-icon-256-256.png',
  'assets/icons/app-icon-512-512.png',
  'assets/videos/video-section.mp4',
  'assets/images/about-img.jpg',
  '/manifest.json',
];

// Installing the Service Worker and pre-caching files
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      console.log('Caching files...');
      return cache.addAll(FILES_TO_CACHE);
    })
  );
  self.skipWaiting(); // Immediately activate the new Service Worker
});

// Activating the Service Worker and removing outdated caches
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) =>
      Promise.all(
        cacheNames
          .filter((name) => name !== CACHE_NAME) // Identify old caches
          .map((name) => caches.delete(name)) // Delete old caches
      )
    )
  );
  self.clients.claim(); // Make the new Service Worker active for all clients
});

// Handling fetch events
self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request).then((cachedResponse) => {
      // If the request is found in the cache, return it
      if (cachedResponse) {
        return cachedResponse;
      }

      // If not found in the cache, attempt to fetch it from the network
      return fetch(event.request)
        .then((networkResponse) => {
          // Cache the new resource and return it
          return caches.open(CACHE_NAME).then((cache) => {
            cache.put(event.request, networkResponse.clone());
            return networkResponse;
          });
        })
        .catch(() => {
          // If the network request fails, return the offline page for navigation requests
          if (event.request.mode === 'navigate') {
            return caches.match('/offline.html');
          }
        });
    })
  );
});
