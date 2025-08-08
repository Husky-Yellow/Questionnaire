const CACHE_NAME = 'h5-project-v1'
const urlsToCache = [
  '/',
  '/index.html',
  '/src/main.ts',
  '/src/App.vue',
  // 添加其他需要缓存的资源
]

// 安装事件
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(urlsToCache)
    }),
  )
})

// 激活事件
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_NAME) {
            return caches.delete(cacheName)
          }
        }),
      )
    }),
  )
})

// 拦截请求
self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request).then((response) => {
      // 如果缓存中有响应，则返回缓存的版本
      if (response) {
        return response
      }

      // 否则发起网络请求
      return fetch(event.request).then((response) => {
        // 检查是否收到有效响应
        if (!response || response.status !== 200 || response.type !== 'basic') {
          return response
        }

        // 克隆响应
        const responseToCache = response.clone()

        caches.open(CACHE_NAME).then((cache) => {
          cache.put(event.request, responseToCache)
        })

        return response
      })
    }),
  )
})
