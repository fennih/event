 if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('https://e-vent.tech/sw').then(function() { 
      console.log('Service Worker Registered'); 
    });
  }