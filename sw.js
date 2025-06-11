/**
 * Service Worker for Dr. Mahmoud Basseem's Academic Website
 * Provides offline functionality and performance optimizations
 */

const CACHE_NAME = 'dr-basseem-v1.0';
const STATIC_CACHE = 'dr-basseem-static-v1.0';
const DYNAMIC_CACHE = 'dr-basseem-dynamic-v1.0';

// Files to cache immediately
const STATIC_FILES = [
    '/',
    '/index.html',
    '/about.html',
    '/research.html',
    '/publications.html',
    '/teaching.html',
    '/contact.html',
    '/css/style.css',
    '/js/main-modern.js',
    '/js/theme-accessibility.js',
    '/js/enhanced-image-loader.js',
    '/assets/img/dr-mahmoud.jpg',
    'https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css',
    'https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/js/bootstrap.bundle.min.js',
    'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css',
    'https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&display=swap'
];

// Install event - cache static files
self.addEventListener('install', event => {
    console.log('Service Worker: Installing...');
    
    event.waitUntil(
        caches.open(STATIC_CACHE)
            .then(cache => {
                console.log('Service Worker: Caching static files');
                return cache.addAll(STATIC_FILES);
            })
            .then(() => {
                console.log('Service Worker: Static files cached successfully');
                return self.skipWaiting();
            })
            .catch(error => {
                console.error('Service Worker: Failed to cache static files', error);
            })
    );
});

// Activate event - clean up old caches
self.addEventListener('activate', event => {
    console.log('Service Worker: Activating...');
    
    event.waitUntil(
        caches.keys()
            .then(cacheNames => {
                return Promise.all(
                    cacheNames.map(cache => {
                        if (cache !== STATIC_CACHE && cache !== DYNAMIC_CACHE) {
                            console.log('Service Worker: Deleting old cache', cache);
                            return caches.delete(cache);
                        }
                    })
                );
            })
            .then(() => {
                console.log('Service Worker: Activated successfully');
                return self.clients.claim();
            })
    );
});

// Fetch event - serve from cache with network fallback
self.addEventListener('fetch', event => {
    const { request } = event;
    
    // Skip non-GET requests
    if (request.method !== 'GET') {
        return;
    }
    
    // Skip Chrome extensions and DevTools
    if (request.url.startsWith('chrome-extension://') || 
        request.url.startsWith('devtools://')) {
        return;
    }
    
    event.respondWith(
        caches.match(request)
            .then(cachedResponse => {
                // Return cached version if available
                if (cachedResponse) {
                    console.log('Service Worker: Serving from cache', request.url);
                    
                    // Update cache in background for next time
                    updateCache(request);
                    
                    return cachedResponse;
                }
                
                // If not in cache, fetch from network
                return fetchAndCache(request);
            })
            .catch(error => {
                console.error('Service Worker: Fetch failed', error);
                
                // Return offline page for navigation requests
                if (request.mode === 'navigate') {
                    return caches.match('/offline.html') || 
                           createOfflineResponse();
                }
                
                // Return offline fallback for other requests
                return createOfflineResponse();
            })
    );
});

// Fetch from network and cache the response
async function fetchAndCache(request) {
    try {
        const response = await fetch(request);
        
        // Only cache successful responses
        if (response.status === 200) {
            const responseClone = response.clone();
            
            // Determine which cache to use
            const cacheName = isStaticFile(request.url) ? STATIC_CACHE : DYNAMIC_CACHE;
            
            // Cache the response
            caches.open(cacheName)
                .then(cache => {
                    cache.put(request, responseClone);
                })
                .catch(error => {
                    console.warn('Service Worker: Failed to cache response', error);
                });
        }
        
        return response;
    } catch (error) {
        console.error('Service Worker: Network fetch failed', error);
        throw error;
    }
}

// Update cache in background
function updateCache(request) {
    fetch(request)
        .then(response => {
            if (response.status === 200) {
                const cacheName = isStaticFile(request.url) ? STATIC_CACHE : DYNAMIC_CACHE;
                
                caches.open(cacheName)
                    .then(cache => {
                        cache.put(request, response);
                    });
            }
        })
        .catch(error => {
            console.warn('Service Worker: Background update failed', error);
        });
}

// Check if URL is a static file
function isStaticFile(url) {
    const staticExtensions = ['.css', '.js', '.jpg', '.jpeg', '.png', '.gif', '.svg', '.woff', '.woff2'];
    const staticDomains = ['fonts.googleapis.com', 'cdn.jsdelivr.net', 'cdnjs.cloudflare.com'];
    
    return staticExtensions.some(ext => url.includes(ext)) ||
           staticDomains.some(domain => url.includes(domain));
}

// Create offline response
function createOfflineResponse() {
    const offlineHTML = `
        <!DOCTYPE html>
        <html lang="en">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Offline - Dr. Mahmoud Basseem</title>
            <style>
                body {
                    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', system-ui, sans-serif;
                    margin: 0;
                    padding: 0;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    min-height: 100vh;
                    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                    color: white;
                    text-align: center;
                }
                .offline-container {
                    max-width: 400px;
                    padding: 2rem;
                }
                .offline-icon {
                    font-size: 4rem;
                    margin-bottom: 1rem;
                }
                h1 {
                    font-size: 1.5rem;
                    margin-bottom: 1rem;
                }
                p {
                    margin-bottom: 1.5rem;
                    opacity: 0.9;
                }
                .retry-btn {
                    background: rgba(255, 255, 255, 0.2);
                    border: 2px solid white;
                    color: white;
                    padding: 0.75rem 1.5rem;
                    border-radius: 25px;
                    cursor: pointer;
                    text-decoration: none;
                    display: inline-block;
                    transition: all 0.3s ease;
                }
                .retry-btn:hover {
                    background: rgba(255, 255, 255, 0.3);
                    transform: translateY(-2px);
                }
            </style>
        </head>
        <body>
            <div class="offline-container">
                <div class="offline-icon">📡</div>
                <h1>You're Offline</h1>
                <p>It looks like you're not connected to the internet. Some content may not be available.</p>
                <a href="javascript:window.location.reload()" class="retry-btn">Try Again</a>
            </div>
        </body>
        </html>
    `;
    
    return new Response(offlineHTML, {
        status: 200,
        statusText: 'OK',
        headers: {
            'Content-Type': 'text/html; charset=utf-8',
        }
    });
}

// Handle messages from main thread
self.addEventListener('message', event => {
    if (event.data && event.data.type === 'SKIP_WAITING') {
        self.skipWaiting();
    }
    
    if (event.data && event.data.type === 'GET_VERSION') {
        event.ports[0].postMessage(CACHE_NAME);
    }
});

// Background sync for form submissions
self.addEventListener('sync', event => {
    if (event.tag === 'contact-form') {
        event.waitUntil(syncContactForm());
    }
});

// Sync contact form submissions when back online
async function syncContactForm() {
    try {
        const db = await openDB();
        const tx = db.transaction(['pending-forms'], 'readonly');
        const store = tx.objectStore('pending-forms');
        const forms = await store.getAll();
        
        for (const form of forms) {
            try {
                const response = await fetch('/contact', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(form.data)
                });
                
                if (response.ok) {
                    // Remove from pending forms
                    const deleteTx = db.transaction(['pending-forms'], 'readwrite');
                    const deleteStore = deleteTx.objectStore('pending-forms');
                    await deleteStore.delete(form.id);
                }
            } catch (error) {
                console.warn('Failed to sync form:', error);
            }
        }
    } catch (error) {
        console.error('Background sync failed:', error);
    }
}

// Open IndexedDB for offline form storage
function openDB() {
    return new Promise((resolve, reject) => {
        const request = indexedDB.open('dr-basseem-db', 1);
        
        request.onerror = () => reject(request.error);
        request.onsuccess = () => resolve(request.result);
        
        request.onupgradeneeded = (event) => {
            const db = event.target.result;
            
            if (!db.objectStoreNames.contains('pending-forms')) {
                const store = db.createObjectStore('pending-forms', { keyPath: 'id' });
                store.createIndex('timestamp', 'timestamp', { unique: false });
            }
        };
    });
}
