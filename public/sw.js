const CACHE_NAME = "watchway-cache-v1";

self.addEventListener("install", (event) => {
	self.skipWaiting();
});

self.addEventListener("activate", (event) => {
	event.waitUntil(
		caches.keys().then((keyList) => {
			return Promise.all(
				keyList.map((key) => {
					if (key !== CACHE_NAME) {
						return caches.delete(key);
					}
				}),
			);
		}),
	);
	return self.clients.claim();
});

self.addEventListener("fetch", (event) => {
	// Let the browser do its default thing for all requests,
	// but having this fetch listener satisfies the PWA installability requirements
	event.respondWith(
		fetch(event.request).catch(() => {
			// If network fails (offline), we could serve a fallback here
			return new Response(
				"Network error and no cache fallback available.",
				{
					status: 408,
					headers: { "Content-Type": "text/plain" },
				},
			);
		}),
	);
});
