# Axios

[![](https://img.shields.io/badge/axios-v0.18.0-brightgreen.svg)](https://github.com/axios/axios/releases/tag/v0.18.0)

## 拦截器

> 示例文件 [demo](./demo.html)。

### 使用

```js
// Add a request interceptor
axios.interceptors.request.use(function (config) {
    // Do something before request is sent
    return config;
  }, function (error) {
    // Do something with request error
    return Promise.reject(error);
  });

// Add a response interceptor
axios.interceptors.response.use(function (response) {
    // Do something with response data
    return response;
  }, function (error) {
    // Do something with response error
    return Promise.reject(error);
  });
```

**几个注意点**：

* `request` 先添加的拦截器后执行，`response` 先添加的拦截器先执行。
* `request` 的 promise 链处理完后，调用 `axios` 内部的 `[dispatchRequest, undefined]`，然后处理 `response` 的 promise 链
* 在拦截器里 `return new Promise()` 会断开对应拦截器链后续的调用(如在 request 链里将不再处理后续 request 的拦截器，response 不受影响)，直接到请求定义的 `promise.then` 里
* `dispatchRequest` 才是真正发请求的地方


### 源码分析

```js
// lib/core/Axios.js
function Axios(instanceConfig) {
  this.defaults = instanceConfig;
  this.interceptors = {
    request: new InterceptorManager(),
    response: new InterceptorManager()
  };
}

=======================
// lib/core/InterceptorManager.js
InterceptorManager.prototype.use = function use(fulfilled, rejected) {
  this.handlers.push({
    fulfilled: fulfilled,
    rejected: rejected
  });
  return this.handlers.length - 1;
};


=======================
// lib/core/Axios.js
Axios.prototype.request = function request(config) {
  /*eslint no-param-reassign:0*/
  // Allow for axios('example/url'[, config]) a la fetch API
  if (typeof config === 'string') {
    config = utils.merge({
      url: arguments[0]
    }, arguments[1]);
  }

  config = utils.merge(defaults, {method: 'get'}, this.defaults, config);
  config.method = config.method.toLowerCase();

  // Hook up interceptors middleware
  var chain = [dispatchRequest, undefined];
  var promise = Promise.resolve(config);

  this.interceptors.request.forEach(function unshiftRequestInterceptors(interceptor) {
    chain.unshift(interceptor.fulfilled, interceptor.rejected);  // request：存 -> HEAD，这么取 <- HEAD，栈
  });

  this.interceptors.response.forEach(function pushResponseInterceptors(interceptor) {
    chain.push(interceptor.fulfilled, interceptor.rejected);  // response：存 TAIL <-，取 <- HEAD，队
  });

  while (chain.length) {
    promise = promise.then(chain.shift(), chain.shift());
  }

  return promise;
};

```