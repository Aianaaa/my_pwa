const CACHE_NAME = "tripboss-cache-v1";
const urlsToCache = [
  '/',
  '/index.html',
  '/about.html',
  '/contact.html',
  '/gallery.html',
  '/blog.html',
  '/css/style.css',
  '/css/normalize.css',
  '/css/utility.css',
  '/css/responsive.css',
  '/images/featured-reo-de-janeiro-brazil.jpg',
  '/images/featured-north-bondi-australia.jpg',
  '/images/featured-berlin-germany.jpg',
  '/images/featured-khwaeng-wat-arun-thailand.jpg',
  '/images/featured-rome-italy.jpg',
  '/images/featured-fuvahmulah-maldives.jpg',
  '/videos/video-section.mp4',
  '/js/script.js',
  '/fonts/fonts.css',
  '/offline.html' // Страница для оффлайн-режима
];

// Устанавливаем кэш
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(urlsToCache);
    })
  );
});

// Активация сервиса
self.addEventListener('activate', (event) => {
  const cacheWhitelist = [CACHE_NAME];
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (!cacheWhitelist.includes(cacheName)) {
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});

// Обработка запросов
self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request).then((cachedResponse) => {
      if (cachedResponse) {
        return cachedResponse; // Возвращаем кэшированную версию
      }

      return fetch(event.request).catch(() => {
        // Если сеть недоступна, показываем оффлайн-страницу
        return caches.match('/offline.html');
      });
    })
  );
});
