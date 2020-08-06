const CACHE_NAME = 'hackernews';

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => {
      return cache.addAll([
        '/',
        '/index.html',
        // CSS and JS assets are hashed, so it is complicated to add them here.
        // Their caching is handled in the 'fetch' listener below.
      ]);
    })
  );
});

self.addEventListener('fetch', async (event) => {
  const url = event.request.url;

  // Skip if request is not using HTTP, e.g. for compatibility with web extensions.
  // Don't try to cache non-GET requests.
  if (!url.startsWith('http') || event.request.method !== 'GET') {
    console.debug('Returning undefined because non-GET.');
    return;
  }

  // We want 'newstories' to always be as fresh as possible,
  // and we expect the API response to change often.
  const favorsNetworkCall = url.includes('/newstories.json');

  event.respondWith((async () => {
    const cache = await caches.open(CACHE_NAME);

    const cacheResponse = await cache.match(event.request);

    // Return from cache and update cache as long as the request
    // does not favor network responses over the cache.
    // This is the ideal behavior for things that we don't expect
    // to change much, if at all, for the same request.
    if (cacheResponse && !favorsNetworkCall) {
      console.debug(`Hit cache for ${url}`);
 
      // Update the cache in the background.
      event.waitUntil(cache.add(event.request));
      return cacheResponse;
    }

    let response;
    try {
      response = await fetch(event.request);
      if(!response.ok) {
        throw new Error('Non-ok response.');
      }
    } catch(error) {
      console.error(`Fetch failed for ${url}`, error);
      // If we favor the network, but the fetch fails, return from the cache.
      if (favorsNetworkCall && cacheResponse) {
        return cacheResponse;
      }
    }

    if (response) {
      console.debug(`[Service Worker] Caching URL: ${url}`);
      await cache.put(event.request, response.clone());
      return response;
    } else {
      throw new Error('Unable to fetch: no response.');
    }
  })());
});
