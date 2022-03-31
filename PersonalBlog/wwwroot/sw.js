////"use strict";

importScripts('lib/localforage/localforage.min.js');

const cacheName = 'v1CacheBlog';
const blogCacheFiles = [
	'/',
	'/sw.js',
	'/lib/bootstrap/dist/css/bootstrap.css',
	'/css/site.css',
	'/lib/jquery/dist/jquery.js',
	'/lib/bootstrap/dist/js/bootstrap.js',
	'/lib/es6-promise/es6-promise.js',
	'/lib/fetch/fetch.js',
	'/lib/systemjs/system.js',
	'/lib/showdown/showdown.js',
	'/lib/localforage/localforage.min.js',
	'/lib/localforage/localforage-getitems.js',
	'/lib/localforage/localforage-setitems.js',
	'/manifest.json',
	'/favicon.ico',
	'/images/icon-192x192.png',
	'/images/icon-256x256.png',
	'/images/icon-384x384.png',
	'/images/icon-512x512.png',
	'/js/site.js',
	'/js/app.js',
	'/js/BlogService.js',
	'/js/SwRegister.js',
	'/js/ClienteStorage.js',
	'/js/Template.js',
	'/js/Localization.js',
	'/js/Gyroscope.js',
];

function timeout(ms, promise) {
	return new Promise((resolve, reject) => {
		setTimeout(() => {
			reject();
		}, ms);

		promise.then(resolve, reject);
	});
}

//Instaling
self.addEventListener("install", (event) => {
	console.log("SW: Evento de instalação");
	self.skipWaiting();

	event.waitUntil(caches.open(cacheName)
		.then((cache) => {
			return cache.addAll(blogCacheFiles);
		}));
});

//Activation
self.addEventListener("activate", (event) => {
	console.log("SW: Evento de ativação");
	self.clients.claim();

	event.waitUntil(caches.keys()
		.then((cacheKeys) => {
			const deletePromises = [];
			for (let i = 0; i < cacheKeys.length; i++) {
				deletePromises.push(caches.delete(cacheKeys[i]));
			}

			return Promise.all(deletePromises);
		}));
});

//Fetch
self.addEventListener("fetch", (event) => {
	console.log('SW: Evento de fetch: ' + event.request.url);
	if (event.request.url.toLowerCase().includes('/home')) {
		console.log('[ServiceWorker] online - get online: ', event.request.url);
		event.respondWith(fetch(event.request));
	} else {
		event.respondWith(
			timeout(500, fetch(event.request)
				.catch((error) => {
					console.log('[ServiceWorker] offline - get from cache: ', error);
					return caches.match(event.request);
				}))
		)
	}
});

self.addEventListener("backgroundfetchsuccess", (event) => {
	const bgFetch = event.registration;

	const loadEvent = async () => {

		const blogInstance = localforage.createInstance({ name: 'blog' });

		const records = await bgFetch.matchAll();
		const promises = records.map(async (record) => {
			const response = await record.responseReady;
			const text = await response.text();
			console.log('Texto recebido - guardando no IndexDB: ' + text);

			blogInstance.setItem("#" + bgFetch.id, text);
		});

		await Promise.all(promises);

		event.updateUI({ title: 'Done!' });
	}

	event.waitUntil(loadEvent());
});