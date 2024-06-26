const CACHE_NAME = 'my-nextjs-pwa-cache-v9';
const urlsToCache = [
  '/',
  '/photography',
  '/newsletter',
  '/project/jigsaw-presents',
  '/project/jigsaw-academy',
  '/blog/page/1',
  '/blog/page/2',
  '/manifest.json',
  '/images/favicon.ico',
  // Add more routes as necessary
];

// Check if the environment is production based on the domain
const isProduction = self.location.hostname === 'patrickprunty.com' || self.location.hostname === "https://patrickprunty.com";

// Cache static assets during the install phase
self.addEventListener('install', (event) => {
  if (isProduction) {
    console.log('Service Worker: Installing and caching assets...');
    event.waitUntil(
      caches.open(CACHE_NAME).then((cache) => {
        return Promise.all(
          urlsToCache.map((url) => {
            return cache.add(url).catch((error) => {
              console.error(`Service Worker: Failed to cache ${url}:`, error);
            });
          })
        );
      }).then(() => {
        console.log('Service Worker: Caching completed successfully.');
        self.skipWaiting();
      }).catch((error) => {
        console.error('Service Worker: Caching failed during install:', error);
      })
    );
  } else {
    console.log('Service Worker: Skipping caching since environment is not production.');
  }
});

// Clean up old caches during the activate phase
self.addEventListener('activate', (event) => {
  console.log('Service Worker: Activating and cleaning up old caches...');
  const cacheWhitelist = [CACHE_NAME];
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (!cacheWhitelist.includes(cacheName)) {
            console.log(`Service Worker: Deleting cache: ${cacheName}`);
            return caches.delete(cacheName);
          }
        })
      );
    }).then(() => {
      console.log('Service Worker: Activation and cleanup completed.');
      return self.clients.claim();
    }).catch((error) => {
      console.error('Service Worker: Activation failed:', error);
    })
  );
});

// Fetch handler to serve cached content
self.addEventListener('fetch', (event) => {
  if (event.request.method !== 'GET') {
    return;
  }

  event.respondWith(
    fetch(event.request).then((fetchResponse) => {
      // Check if we received a valid response
      if (!fetchResponse || fetchResponse.status !== 200 || fetchResponse.type !== 'basic') {
        return fetchResponse;
      }

      // Clone the response
      const responseToCache = fetchResponse.clone();

      caches.open(CACHE_NAME).then((cache) => {
        cache.put(event.request, responseToCache).catch((error) => {
          console.error('Service Worker: Caching failed during fetch:', error);
        });
      });

      return fetchResponse;
    }).catch(() => {
      // If fetch fails, try to get from cache
      return caches.match(event.request).then((response) => {
        if (response) {
          return response;
        }
        // Fallback for offline use if both cache and network fail
        return caches.match('/').then((fallbackResponse) => {
          if (fallbackResponse) {
            console.log('Service Worker: Serving fallback content for offline use.');
          } else {
            console.error('Service Worker: No fallback content available.');
          }
          return fallbackResponse;
        });
      });
    })
  );
});

self.addEventListener('controllerchange', () => {
  console.log('Service Worker: Controller changed. A new service worker has taken control.');
  self.clients.matchAll().then(clients => {
    clients.forEach(client => client.postMessage({ type: 'NEW_SW_AVAILABLE' }));
  });
});
