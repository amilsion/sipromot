'use strict';
const MANIFEST = 'flutter-app-manifest';
const TEMP = 'flutter-temp-cache';
const CACHE_NAME = 'flutter-app-cache';
const RESOURCES = {
  "version.json": "5f029b3d3f16b9bab73b28c1f25fb0ca",
"favicon.ico": "eb3f3f000ea55f7ae8f05f7b94d84a0b",
"index.html": "b719f09424ee33715f9ba72079e17851",
"/": "b719f09424ee33715f9ba72079e17851",
"main.dart.js": "87c9f8df6c80a674e45d34bbcc8feaa9",
"favicon.png": "9415881355549cc7b43df300b7f8cf9b",
"icons/favicon-16x16.png": "a84472a32554eac9c576b182482af817",
"icons/favicon.ico": "eb3f3f000ea55f7ae8f05f7b94d84a0b",
"icons/apple-icon.png": "b52c3537d08f97108f9cc69b22ace956",
"icons/apple-icon-144x144.png": "ba77013670ee8c98c00cf7ec5e751c7b",
"icons/android-icon-192x192.png": "f0a509281745f1c24aad4025d3162e6b",
"icons/apple-icon-precomposed.png": "b52c3537d08f97108f9cc69b22ace956",
"icons/apple-icon-114x114.png": "b121a8a971c05b6d380e94423509ec87",
"icons/ms-icon-310x310.png": "1040719b105052fb1a3bfc0220450c8d",
"icons/Icon-192.png": "429ff57f506e9f806c2001b22617b130",
"icons/Icon-maskable-192.png": "429ff57f506e9f806c2001b22617b130",
"icons/ms-icon-144x144.png": "ba77013670ee8c98c00cf7ec5e751c7b",
"icons/apple-icon-57x57.png": "d0d031d7c65719bdc51ef8b99597daa2",
"icons/apple-icon-152x152.png": "6ad73d1cea959be5b73a406050f4b75b",
"icons/ms-icon-150x150.png": "6baa8df7ddcb882aebca09c3c7506ad0",
"icons/android-icon-72x72.png": "3557d846a973dc3b908a652707268d4b",
"icons/android-icon-96x96.png": "2ecadfba35ac2fdbe61298d7ec809768",
"icons/android-icon-36x36.png": "26da18daa1097519f2a9e020daa22b4f",
"icons/apple-icon-180x180.png": "5e015c8de570bb61fc349fc4679f0640",
"icons/favicon-96x96.png": "2ecadfba35ac2fdbe61298d7ec809768",
"icons/android-icon-48x48.png": "5b5b11d116ba50ed15bc79f0d6305709",
"icons/apple-icon-76x76.png": "f3291ce8da01af4e7f330545b6d009b5",
"icons/apple-icon-60x60.png": "4f109514aac8dd49aaa2c5845546875d",
"icons/Icon-maskable-512.png": "1f545173fa8cdde11c6798835fa194d1",
"icons/browserconfig.xml": "653d077300a12f09a69caeea7a8947f8",
"icons/android-icon-144x144.png": "ba77013670ee8c98c00cf7ec5e751c7b",
"icons/apple-icon-72x72.png": "3557d846a973dc3b908a652707268d4b",
"icons/apple-icon-120x120.png": "9ae5f7eca797e4bed2dba4c6c7c11586",
"icons/Icon-512.png": "1f545173fa8cdde11c6798835fa194d1",
"icons/favicon-32x32.png": "9d8aa8efb35f40a72bd8fe0f10dd38cb",
"icons/ms-icon-70x70.png": "d7c2a3f5996fc89dfcf26f6c24ee69de",
"manifest.json": "abde15872d02ccfc9ac9b7c3fbacba6f",
"assets/AssetManifest.json": "4d500895dbb23f2d65dfc82d02253785",
"assets/NOTICES": "65d4e4ec8c8cc1a57cd99be2c21faac9",
"assets/FontManifest.json": "dc3d03800ccca4601324923c0b1d6d57",
"assets/packages/cupertino_icons/assets/CupertinoIcons.ttf": "6d342eb68f170c97609e9da345464e5e",
"assets/fonts/MaterialIcons-Regular.otf": "e7069dfd19b331be16bed984668fe080",
"assets/assets/new-logo.png": "e0c904d3bceac067e82d6bfd91f6fe0e",
"assets/assets/pin.png": "81e3657445fd2cc8a51af35f32182e80",
"assets/assets/logo-tw.png": "a4d972d3629a86164ee7a13359512940",
"assets/assets/bike.png": "a0650b206b2fff480eda6a050ce73ef1",
"assets/assets/logo-tb.png": "ec373e8589a827856a8e51ae8cc65393",
"assets/assets/logo.png": "004d7fdaf43a395589c61879f0d8caee",
"assets/assets/logo2.png": "6d6a17fa37fa5b88afb129e04ce889d0",
"assets/assets/car.png": "015b7542e0a8d3dee08de9534c0c7761"
};

// The application shell files that are downloaded before a service worker can
// start.
const CORE = [
  "main.dart.js",
"index.html",
"assets/AssetManifest.json",
"assets/FontManifest.json"];
// During install, the TEMP cache is populated with the application shell files.
self.addEventListener("install", (event) => {
  self.skipWaiting();
  return event.waitUntil(
    caches.open(TEMP).then((cache) => {
      return cache.addAll(
        CORE.map((value) => new Request(value, {'cache': 'reload'})));
    })
  );
});

// During activate, the cache is populated with the temp files downloaded in
// install. If this service worker is upgrading from one with a saved
// MANIFEST, then use this to retain unchanged resource files.
self.addEventListener("activate", function(event) {
  return event.waitUntil(async function() {
    try {
      var contentCache = await caches.open(CACHE_NAME);
      var tempCache = await caches.open(TEMP);
      var manifestCache = await caches.open(MANIFEST);
      var manifest = await manifestCache.match('manifest');
      // When there is no prior manifest, clear the entire cache.
      if (!manifest) {
        await caches.delete(CACHE_NAME);
        contentCache = await caches.open(CACHE_NAME);
        for (var request of await tempCache.keys()) {
          var response = await tempCache.match(request);
          await contentCache.put(request, response);
        }
        await caches.delete(TEMP);
        // Save the manifest to make future upgrades efficient.
        await manifestCache.put('manifest', new Response(JSON.stringify(RESOURCES)));
        return;
      }
      var oldManifest = await manifest.json();
      var origin = self.location.origin;
      for (var request of await contentCache.keys()) {
        var key = request.url.substring(origin.length + 1);
        if (key == "") {
          key = "/";
        }
        // If a resource from the old manifest is not in the new cache, or if
        // the MD5 sum has changed, delete it. Otherwise the resource is left
        // in the cache and can be reused by the new service worker.
        if (!RESOURCES[key] || RESOURCES[key] != oldManifest[key]) {
          await contentCache.delete(request);
        }
      }
      // Populate the cache with the app shell TEMP files, potentially overwriting
      // cache files preserved above.
      for (var request of await tempCache.keys()) {
        var response = await tempCache.match(request);
        await contentCache.put(request, response);
      }
      await caches.delete(TEMP);
      // Save the manifest to make future upgrades efficient.
      await manifestCache.put('manifest', new Response(JSON.stringify(RESOURCES)));
      return;
    } catch (err) {
      // On an unhandled exception the state of the cache cannot be guaranteed.
      console.error('Failed to upgrade service worker: ' + err);
      await caches.delete(CACHE_NAME);
      await caches.delete(TEMP);
      await caches.delete(MANIFEST);
    }
  }());
});

// The fetch handler redirects requests for RESOURCE files to the service
// worker cache.
self.addEventListener("fetch", (event) => {
  if (event.request.method !== 'GET') {
    return;
  }
  var origin = self.location.origin;
  var key = event.request.url.substring(origin.length + 1);
  // Redirect URLs to the index.html
  if (key.indexOf('?v=') != -1) {
    key = key.split('?v=')[0];
  }
  if (event.request.url == origin || event.request.url.startsWith(origin + '/#') || key == '') {
    key = '/';
  }
  // If the URL is not the RESOURCE list then return to signal that the
  // browser should take over.
  if (!RESOURCES[key]) {
    return;
  }
  // If the URL is the index.html, perform an online-first request.
  if (key == '/') {
    return onlineFirst(event);
  }
  event.respondWith(caches.open(CACHE_NAME)
    .then((cache) =>  {
      return cache.match(event.request).then((response) => {
        // Either respond with the cached resource, or perform a fetch and
        // lazily populate the cache only if the resource was successfully fetched.
        return response || fetch(event.request).then((response) => {
          if (response && Boolean(response.ok)) {
            cache.put(event.request, response.clone());
          }
          return response;
        });
      })
    })
  );
});

self.addEventListener('message', (event) => {
  // SkipWaiting can be used to immediately activate a waiting service worker.
  // This will also require a page refresh triggered by the main worker.
  if (event.data === 'skipWaiting') {
    self.skipWaiting();
    return;
  }
  if (event.data === 'downloadOffline') {
    downloadOffline();
    return;
  }
});

// Download offline will check the RESOURCES for all files not in the cache
// and populate them.
async function downloadOffline() {
  var resources = [];
  var contentCache = await caches.open(CACHE_NAME);
  var currentContent = {};
  for (var request of await contentCache.keys()) {
    var key = request.url.substring(origin.length + 1);
    if (key == "") {
      key = "/";
    }
    currentContent[key] = true;
  }
  for (var resourceKey of Object.keys(RESOURCES)) {
    if (!currentContent[resourceKey]) {
      resources.push(resourceKey);
    }
  }
  return contentCache.addAll(resources);
}

// Attempt to download the resource online before falling back to
// the offline cache.
function onlineFirst(event) {
  return event.respondWith(
    fetch(event.request).then((response) => {
      return caches.open(CACHE_NAME).then((cache) => {
        cache.put(event.request, response.clone());
        return response;
      });
    }).catch((error) => {
      return caches.open(CACHE_NAME).then((cache) => {
        return cache.match(event.request).then((response) => {
          if (response != null) {
            return response;
          }
          throw error;
        });
      });
    })
  );
}
