const cacheName = 'travelboss-cache-v1';

//Install SW
self.addEventListener('install', (event) => {
    console.log('ServiceWorker installed')
});

self.addEventListener('activate', (event) => {
    console.log('ServiceWorker activated');

    event.waitUntil(
        caches.keys().then((cacheNames) => {
            return Promise.all(
                cacheNames.filter((name) => name !== cacheName).map((name) =>caches.delete(name))        
        )
    })
)
})

//Network First
self.addEventListener('fetch', (event) => {
    event.respondWith(
        fetch(event.request)
        .then((response) => {
            return caches.open(cacheName).then((cache) => {
                cache.put(event.request, response.clone());
                return response;
            })
        }).catch(() => {
            return caches.match(event.request)
        })
    )
})

// 1. Cache First (cache falling back to network)

self.addEventListener('fetch', (event) => {
    event.respondWith(
        caches.match(event.request)
        .then((cachedResponse) => {
            if (cachedResponse) {
                return cachedResponse;
            }

            return fetch(event.request)
            .then((networkResponse) => {
                return caches.open(cacheName)
                .then((cache) => {
                    cache.put(event.request, networkResponse.clone());
                    return networkResponse;
                });
            });
        })
    );
});

//2.Network First

self.addEventListener('fetch', (event) => {
    event.respondWith(
        fetch(event.request)
        .then((response) => {
            return caches.open(cacheName).then((cache) => {
                cache.put(event.request, response.clone());
                return response;
            });
        })
        .catch(() => {
            return caches.match(event.request);
        })
    );
});

// 3.Cache only

self.addEventListener('fetch', (event) => {
    event.respondWith(
        caches.match(event.request)
    );
});

//4.Network only

self.addEventListener('fetch', (event) => {
    event.respondWith(
        fetch(event.request)
    );
});

//5. Stale while revalidate

self.addEventListener('fetch', (event) => {
    event.respondWith(
        caches.open(cacheName).then((cache) => {
            return cache.match(event.request).then((cachedResponse) => {
                const fetchPromise = fetch(event.request).then((networkResponse) => {
                    cache.put(event.request, networkResponse.clone());
                    return networkResponse;
                });
                return cachedResponse || fetchPromise;
            });
        })
    );
});

//6.Offline Fallback

self.addEventListener('fetch', (event) => {
    event.respondWith(
        fetch(event.request).catch(() => {
            return caches.match('/offline.html');
        })
    );
});

//7.Custom Strategy

self.addEventListener('fetch', (event) => {
    const url = new URL(event.request.url);
    if (url.origin === location.origin) {
        event.respondWith(
            caches.match(event.request).then((response) => {
                return response || fetch(event.request);
            })
        );
    } else {
        event.respondWith(
            fetch(event.request)
            .then((response) => {
                return caches.open(cacheName).then((cache) => {
                    cache.put(event.request, response.clone());
                    return response;
                });
            })
            .catch(() => {
                return caches.match(event.request);
            })
        );
    }
});
