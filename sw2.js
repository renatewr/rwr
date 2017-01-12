
  /* eslint-disable */
'use strict';
// Set a name for the current cache
const cacheName = 'cows-v20';

// Default files to always cache
const cacheFiles = [
  '/api/rwr/kuer/preview',
  '/api/rwr/assets/ku/img/ku0.jpg',
  '/api/rwr/assets/ku/img/ku1.jpg',
  '/api/rwr/assets/ku/img/ku2.jpg',
  '/api/rwr/assets/cow.svg',
  '/api/rwr/assets/cow_head.svg',
  '/api/rwr/assets/plus.svg',
  '/api/rwr/assets/day.svg',
  '/api/rwr/assets/bundles/polyfills.022e7fc403645c7756d832780e89bb47.js',
  '/api/rwr/assets/bundles/kuer.8f5c07810d230eb3f549763563aaa8b4.css',
  '/api/rwr/assets/bundles/kuer.1f465f5f8667f2c7d54b7ec5e64cdc69.js',
  '/api/rwr/assets/bundles/inline.e58bbc20d207aeb636224cbb4f93ec89.css',
  '/api/rwr/sw2.js'
];


self.addEventListener('install', function(e){
  e.waitUntil(
        // Open the cache
        caches.open(cacheName).then(function(cache) {
            // Add all the default files to the cache
          console.log('[ServiceWorker] Caching cacheFiles');
          return cache.addAll(cacheFiles);
        })
    );
});

self.addEventListener('activate', function(e) {
  console.log('[ServiceWorker] Activate');
  e.waitUntil(
        // Get all the cache keys (cacheName)
        caches.keys().then(function(cacheNames){
          return Promise.all(cacheNames.map(function(thisCacheName) {
            if (thisCacheName !== cacheName) {
                      // Delete that cached file
              console.log('[ServiceWorker] Removing Cached Files from Cache - ', thisCacheName);
              return caches.delete(thisCacheName);
            }
          }));
        })
  );
});

self.addEventListener('fetch', (event) => {  
    // Respond to the document with what is returned from  
    event.respondWith(

        // 1. Check the cache if a file matching that request is available 
        caches.match(event.request).then((response) => {

            // 2. If it is, respond to the document with the file from the cache        
            if ( response ) return response 

            // 3. If it isn’t, fetch the file from the network and respond to the document with the fetched file
            return  fetch(event.request)

        })
     ); 
});

  /* eslint-enable */
