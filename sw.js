const CACHE_NAME = 'tripboss-cache-v1';
const urlsToCache = [
  '/',
  '/index.html',
  '/gallery.html',
  '/blog.html',
  '/about.html',
  '/contact.html',
  '/offline.html', // Страница для отображения, если офлайн
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
  '/fonts/fonts.css'
];

// Install Service Worker
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(urlsToCache);
    })
  );
});

// Activate Service Worker
self.addEventListener('activate', (event) => {
  const cacheWhitelist = [CACHE_NAME];
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (!cacheWhitelist.includes(cacheName)) {
            return caches.delete(cacheName);  // Удаляем старые кэши
          }
        })
      );
    })
  );
});

// Fetch Event - служит для обработки запросов, когда приложение работает офлайн
self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request).then((cachedResponse) => {
      if (cachedResponse) {
        return cachedResponse; // Возвращаем кэшированный ресурс
      }

      // Если ресурса нет в кэше, пытаемся загрузить его из сети
      return fetch(event.request).catch(() => {
        // В случае отсутствия интернета, показываем офлайн-страницу
        if (event.request.url.includes('.html')) {
          return caches.match('/offline.html');
        }
        return new Response('You are offline', {
          headers: { 'Content-Type': 'text/plain' }
        });
      });
    })
  );
});
