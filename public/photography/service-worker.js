/*
 Copyright 2016 Google Inc. All Rights Reserved.
 Licensed under the Apache License, Version 2.0 (the "License");
 you may not use this file except in compliance with the License.
 You may obtain a copy of the License at
     http://www.apache.org/licenses/LICENSE-2.0
 Unless required by applicable law or agreed to in writing, software
 distributed under the License is distributed on an "AS IS" BASIS,
 WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 See the License for the specific language governing permissions and
 limitations under the License.
*/

// Names of the two caches used in this version of the service worker.
// Change to v2, etc. when you update any of the local resources, which will
// in turn trigger the install event again.
importScripts('idb-keyval.js');
importScripts('serialize.js');
const PRECACHE = 'precache-v1';
const RUNTIME = 'runtime';

// A list of local resources we always want to be cached.
const PRECACHE_URLS = [
  'index.html',
  './', // Alias for index.html
  'elements/img-creator.js',
  'fonts/steelfish.ttf',
  'images/rotated-llr-logo-vert-jm.png',
  'images/shutter-icon.png',
  'idb-keyval.js',
  'serialize.js'
];

// The install handler takes care of precaching the resources we always need.
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(PRECACHE)
    .then(cache => cache.addAll(PRECACHE_URLS))
    .then(self.skipWaiting())
  );
});

// The activate handler takes care of cleaning up old caches.
self.addEventListener('activate', event => {
  const currentCaches = [PRECACHE, RUNTIME];
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return cacheNames.filter(cacheName => !currentCaches.includes(cacheName));
    }).then(cachesToDelete => {
      return Promise.all(cachesToDelete.map(cacheToDelete => {
        return caches.delete(cacheToDelete);
      }));
    }).then(() => self.clients.claim())
  );
});

// The fetch handler serves responses for same-origin resources from a cache.
// If no response is found, it populates the runtime cache with the response
// from the network before returning it to the page.
self.addEventListener('fetch', event => {
  // Skip cross-origin requests, like those for Google Analytics.
  if (event.request.url.startsWith(self.location.origin)) {
    // if (event.request.url.includes('mysql-api/creator')) {
    //   if(navigator.onLine) {
    //     console.log('online');
    //     idbKeyval.get('photo-queue').then(queue => {
    //       if(!queue) return;
    //       const request = JSON.parse(queue);
    //       deserialize(request).then(deserialized => {
    //         fetch(deserialized);
    //       });
    //     });
    //     return event.respondWith(fetch(event.request)).then(response => response);
    //   }
    //   serialize(event.request).then(serialized => {
    //     var idb = idbKeyval.set("photo-queue", JSON.stringify(serialized));
    //   });
    //   return event.respondWith(new Response(
    //     JSON.stringify([{
    //       text: 'You are offline and I know it well.',
    //       author: 'The Service Worker Cookbook',
    //       id: 1,
    //       isSticky: true
    //     }]),
    //     { headers: { 'Content-Type': 'application/json' } }
    //   ));
    // }
    event.respondWith(
      caches.match(event.request).then(cachedResponse => {
        if (cachedResponse) {
          return cachedResponse;
        }

        return caches.open(RUNTIME).then(cache => {
          return fetch(event.request).then(response => {
            // Put a copy of the response in the runtime cache.
            return cache.put(event.request, response.clone()).then(() => {
              return response;
            });
          });
        });
      })
    );
  }
});


function serialize(request) {
  var headers = {};

  for (var entry of request.headers.entries()) {
    headers[entry[0]] = entry[1];
  }
  var serialized = {
    url: request.url,
    headers: headers,
    method: request.method,
    mode: request.mode,
    credentials: request.credentials,
    cache: request.cache,
    redirect: request.redirect,
    referrer: request.referrer
  };

 
  if (request.method !== 'GET' && request.method !== 'HEAD') {
    return request.clone().formData().then(function(body) {
      let serializedBody = {};
      for(let pair of body.entries()) {
        serializedBody[pair[0]] = pair[1];
      }
      serialized.body = serializedBody;
      return Promise.resolve(serialized);
    });
  }
  return Promise.resolve(serialized);
}

 
function deserialize(data) {
  let formData = new FormData();
  for (let key in data.body)
    if(data.body.hasOwnProperty(key))
      formData.append(key, data.body[key]);
  return Promise.resolve(new Request(data.url, data));
}