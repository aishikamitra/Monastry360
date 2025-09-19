// Service Worker for Monastery360
// Provides offline functionality and caching

const CACHE_NAME = 'monastery360-v1.2.0';
const STATIC_CACHE = 'monastery360-static-v1.2.0';
const DYNAMIC_CACHE = 'monastery360-dynamic-v1.2.0';

// Assets to cache immediately
const STATIC_ASSETS = [
  '/',
  '/index.html',
  '/monasteries.html',
  '/assets/css/modern.css',
  '/assets/css/chatbot.css',
  '/assets/js/chatbot.js',
  '/assets/js/performance.js',
  '/assets/images/chatbox-icon.svg',
  'https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&family=Playfair+Display:wght@400;600;700&display=swap',
  'https://cdn.jsdelivr.net/npm/ol@v7.5.0/ol.css',
  'https://cdn.jsdelivr.net/npm/ol@v7.5.0/dist/ol.js'
];

// Assets to cache dynamically
const DYNAMIC_ASSETS = [
  '/predict',
  '/audio-guide.html',
  '/tourism.html'
];

// Network timeout for dynamic requests
const NETWORK_TIMEOUT = 3000;

// Install event - cache static assets
self.addEventListener('install', event => {
  console.log('🔧 Service Worker installing...');
  
  event.waitUntil(
    caches.open(STATIC_CACHE)
      .then(cache => {
        console.log('📦 Caching static assets...');
        return cache.addAll(STATIC_ASSETS);
      })
      .then(() => {
        console.log('✅ Static assets cached successfully');
        return self.skipWaiting();
      })
      .catch(error => {
        console.error('❌ Failed to cache static assets:', error);
      })
  );
});

// Activate event - clean up old caches
self.addEventListener('activate', event => {
  console.log('🚀 Service Worker activating...');
  
  event.waitUntil(
    caches.keys()
      .then(cacheNames => {
        return Promise.all(
          cacheNames
            .filter(cacheName => {
              return cacheName !== STATIC_CACHE && 
                     cacheName !== DYNAMIC_CACHE &&
                     cacheName.startsWith('monastery360-');
            })
            .map(cacheName => {
              console.log('🗑️ Deleting old cache:', cacheName);
              return caches.delete(cacheName);
            })
        );
      })
      .then(() => {
        console.log('✅ Service Worker activated');
        return self.clients.claim();
      })
  );
});

// Fetch event - handle requests with caching strategies
self.addEventListener('fetch', event => {
  const request = event.request;
  const url = new URL(request.url);

  // Skip non-HTTP requests
  if (!request.url.startsWith('http')) return;

  // Skip API requests that should always be fresh
  if (url.pathname === '/predict') {
    event.respondWith(handleApiRequest(request));
    return;
  }

  // Handle static assets
  if (STATIC_ASSETS.some(asset => request.url.includes(asset))) {
    event.respondWith(handleStaticAsset(request));
    return;
  }

  // Handle images with cache-first strategy
  if (request.destination === 'image') {
    event.respondWith(handleImageRequest(request));
    return;
  }

  // Handle HTML pages with network-first strategy
  if (request.mode === 'navigate' || 
      (request.method === 'GET' && request.headers.get('accept').includes('text/html'))) {
    event.respondWith(handlePageRequest(request));
    return;
  }

  // Default strategy for other requests
  event.respondWith(handleDefaultRequest(request));
});

// Cache-first strategy for static assets
async function handleStaticAsset(request) {
  try {
    const cache = await caches.open(STATIC_CACHE);
    const cachedResponse = await cache.match(request);
    
    if (cachedResponse) {
      // Update cache in background
      fetch(request)
        .then(response => {
          if (response.ok) {
            cache.put(request, response.clone());
          }
        })
        .catch(() => {}); // Ignore network errors
      
      return cachedResponse;
    }

    // Fallback to network
    const networkResponse = await fetch(request);
    if (networkResponse.ok) {
      cache.put(request, networkResponse.clone());
    }
    return networkResponse;

  } catch (error) {
    console.error('❌ Error handling static asset:', error);
    return new Response('Asset not available offline', { status: 503 });
  }
}

// Network-first strategy for API requests
async function handleApiRequest(request) {
  try {
    // Try network first with timeout
    const networkResponse = await Promise.race([
      fetch(request),
      new Promise((_, reject) => 
        setTimeout(() => reject(new Error('Network timeout')), NETWORK_TIMEOUT)
      )
    ]);

    if (networkResponse.ok) {
      // Cache successful API responses briefly
      const cache = await caches.open(DYNAMIC_CACHE);
      cache.put(request, networkResponse.clone());
    }
    
    return networkResponse;

  } catch (error) {
    console.log('🔄 Network failed, trying cache for API request');
    
    // Fallback to cache
    const cache = await caches.open(DYNAMIC_CACHE);
    const cachedResponse = await cache.match(request);
    
    if (cachedResponse) {
      return cachedResponse;
    }

    // Return offline message for chatbot
    return new Response(
      JSON.stringify({ 
        answer: "I'm currently offline. Please check your internet connection and try again." 
      }), 
      {
        headers: { 'Content-Type': 'application/json' },
        status: 503
      }
    );
  }
}

// Cache-first strategy for images
async function handleImageRequest(request) {
  try {
    const cache = await caches.open(DYNAMIC_CACHE);
    const cachedResponse = await cache.match(request);
    
    if (cachedResponse) {
      return cachedResponse;
    }

    const networkResponse = await fetch(request);
    if (networkResponse.ok) {
      cache.put(request, networkResponse.clone());
    }
    return networkResponse;

  } catch (error) {
    // Return placeholder image for failed image requests
    return new Response(
      `<svg width="300" height="200" xmlns="http://www.w3.org/2000/svg">
        <rect width="100%" height="100%" fill="#f1f5f9"/>
        <text x="50%" y="50%" text-anchor="middle" dy=".3em" fill="#64748b">
          Image unavailable offline
        </text>
      </svg>`,
      { headers: { 'Content-Type': 'image/svg+xml' } }
    );
  }
}

// Network-first strategy for pages
async function handlePageRequest(request) {
  try {
    const networkResponse = await fetch(request);
    
    if (networkResponse.ok) {
      const cache = await caches.open(DYNAMIC_CACHE);
      cache.put(request, networkResponse.clone());
    }
    
    return networkResponse;

  } catch (error) {
    console.log('🔄 Network failed, trying cache for page request');
    
    const cache = await caches.open(DYNAMIC_CACHE);
    const cachedResponse = await cache.match(request);
    
    if (cachedResponse) {
      return cachedResponse;
    }

    // Return offline page
    return new Response(
      `<!DOCTYPE html>
      <html>
      <head>
        <title>Monastery360 - Offline</title>
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <style>
          body { 
            font-family: system-ui, sans-serif; 
            text-align: center; 
            padding: 2rem; 
            background: #f8fafc;
            color: #334155;
          }
          .container { max-width: 500px; margin: 0 auto; }
          h1 { color: #f97316; margin-bottom: 1rem; }
          p { margin-bottom: 1rem; line-height: 1.6; }
          .btn { 
            background: #f97316; 
            color: white; 
            padding: 0.75rem 1.5rem; 
            border: none; 
            border-radius: 0.5rem; 
            cursor: pointer; 
            text-decoration: none;
            display: inline-block;
          }
        </style>
      </head>
      <body>
        <div class="container">
          <h1>🏛️ Monastery360</h1>
          <h2>You're offline</h2>
          <p>Please check your internet connection to access the latest monastery information and chatbot features.</p>
          <p>Some content may be available from your cache.</p>
          <button class="btn" onclick="window.location.reload()">Try Again</button>
        </div>
      </body>
      </html>`,
      { 
        headers: { 'Content-Type': 'text/html' },
        status: 503
      }
    );
  }
}

// Default strategy for other requests
async function handleDefaultRequest(request) {
  try {
    return await fetch(request);
  } catch (error) {
    const cache = await caches.open(DYNAMIC_CACHE);
    const cachedResponse = await cache.match(request);
    return cachedResponse || new Response('Service unavailable', { status: 503 });
  }
}

// Background sync for offline actions
self.addEventListener('sync', event => {
  if (event.tag === 'background-sync') {
    console.log('🔄 Background sync triggered');
    event.waitUntil(handleBackgroundSync());
  }
});

async function handleBackgroundSync() {
  // Handle any pending offline actions
  // This could include chat messages, form submissions, etc.
  console.log('📡 Performing background sync...');
}

// Push notification handling (for future use)
self.addEventListener('push', event => {
  if (event.data) {
    const data = event.data.json();
    const options = {
      body: data.body,
      icon: '/assets/images/chatbox-icon.svg',
      badge: '/assets/images/chatbox-icon.svg',
      tag: 'monastery-notification',
      renotify: true
    };

    event.waitUntil(
      self.registration.showNotification(data.title, options)
    );
  }
});

// Notification click handling
self.addEventListener('notificationclick', event => {
  event.notification.close();
  
  event.waitUntil(
    self.clients.openWindow('/')
  );
});

// Message handling for communication with main thread
self.addEventListener('message', event => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
});

console.log('🚀 Service Worker script loaded successfully');