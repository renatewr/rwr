'use strict';
// Set a name for the current cache
var cacheName = 'cows-v15'; 

// Default files to always cache
var cacheFiles = [
  '/api/rwr/kuer/preview',
  '/api/rwr/assets/ku/img/ku0.jpg',
  '/api/rwr/assets/ku/img/ku1.jpg',
  '/api/rwr/assets/ku/img/ku2.jpg',
  '/api/rwr/assets/cow.svg',
  '/api/rwr/assets/cow_head.svg',
  '/api/rwr/assets/plus.svg',
  '/api/rwr/assets/day.svg',  
  '/api/rwr/assets/bundles/kuer.03e89533d979b401e721fb87f72ec25b.js',
  '/api/rwr/assets/bundles/polyfills.f263a5dca5bc61098711212aaebee0b9.js',	  
  '/api/rwr/assets/bundles/kuer.166c1f50a39e70836b77063cf0b5417d.css',  
  '/api/rwr/assets/bundles/inline.3d6f6f0fadfde522a046103456acfc6f.css'
]


self.addEventListener('install', function(e) {  
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
        caches.keys().then(function(cacheNames) {
            return Promise.all(cacheNames.map(function(thisCacheName) {
                // If a cached item is saved under a previous cacheName
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