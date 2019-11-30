const self = this;

self.addEventListener('fetch', event => {
  console.log('触发请求');
  event.respondWith(
    caches.match(event.request).then(response => {
      console.log('缓存response', response);
      if (response) return response;

      const request = event.request.clone();
      return fetch(request).then(httpRes => {
        const response = httpRes.clone();

        if (httpRes.status === 200) {
          caches.open('pwa-demo').then(cache => {
            cache.put(event.request, response).then(() => {
              console.log('添加缓存成功');
            }).catch(() => {
              console.log('添加缓存失败')
            });
          })
        }

        return httpRes;
      });
    })
  )
});
