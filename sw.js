self.addEventListener('install', function(e) {
  console.log('ServiceWorker Install');
  e.waitUntil(
    caches.open('v2').then(function(cache) {
      return cache.addAll([
        'https://e-vent.tech/swinstaller',
        'https://e-vent.tech/offline.html',
        'https://e-vent.tech/oops.jpg',
        'https://e-vent.tech/favicon.ico',
        'https://e-vent.tech/manifest.json',
        'https://e-vent.tech/FormLogin.html'
      ]);
    })
  );
});

self.addEventListener('activate', function(e) {
  console.log('ServiceWorker Activate');
});

self.addEventListener('fetch', function(event) {

  event.respondWith(caches.match(event.request).then(function(response){

      if (response) {

        return response;
      }
      
      return fetch(event.request)

    }).catch(function(error) {

      return caches.match('https://e-vent.tech/offline.html');
    })
  );
});