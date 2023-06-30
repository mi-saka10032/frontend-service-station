---
title: axios
order: 2

tag:
  - Ajax库
  - 请求拦截
  - 请求修饰
---

**Promise** based HTTP client for the browser and node.js

特点：

拦截请求和响应 （就是有 interceptor）

转换请求数据和响应数据

取消请求

自动转换 JSON 数据

客户端支持防御 XSRF 攻击

## 发送请求

为方便起见，为所有支持的请求方法提供了别名

axios.request(config)

axios.get(url[, config])

axios.delete(url[, config])

axios.head(url[, config])

axios.options(url[, config])

axios.post(url[, data[ ,config]])

axios.put(url[, data[ ,config]])

axios.patch(url[, data[ ,config]])

注意：在使用别名方法时，url、method、data 这些属性都不必在配置中指定。

## 响应结构

### 1.config

axios 的配置对象，method、url、timeout、data 之类。

### 2.data

响应体数据

### 3.headers

响应头信息

### 4.request

当前 axios 请求创建的原生 XMLHttpRequest 对象

### 5.status

响应状态码

### 6.statusText

响应状态字符串

## 配置对象

### 1.url

请求地址

### 2.method

请求方法

### 3.baseURL

url 的基础结构，通常包含协议+基础域名

### 4.transformRequest

允许在向服务器发送前，修改请求数据

只能用在 'PUT', 'POST' 和 'PATCH' 这几个请求方法

后面数组中的函数必须返回一个字符串，或 ArrayBuffer，或 Stream

```javascript
transformRequest: [function (data, headers) {
    // 对 data 进行任意转换处理
    return data;
  }],
```

### 5.transformResponse

在传递给 then/catch 前，允许修改响应数据

```javascript
 transformResponse: [function (data) {
    // 对 data 进行任意转换处理
    return data;
  }],
```

### 6.headers

是即将被发送的自定义请求头

```javascript
headers: {'X-Requested-With': 'XMLHttpRequest'},
```

### 7.params

params 是即将与请求一起发送的 URL 参数
必须是一个无格式对象(plain object)或 URLSearchParams 对象

```javascript
params: {
	ID: 12345
},
```

### 8.paramsSerializer

paramsSerializer 是一个负责 params 序列化的函数

需要 qs 组件进行序列化？

```javascript
 paramsSerializer: function(params) {
    return Qs.stringify(params, {arrayFormat: 'brackets'})
  },
```

### 9.data

作为请求主体被发送的数据

只适用于 PUT POST PATCH

在没有设置 transformRequest 时，必须是以下类型之一：

string, plain object, ArrayBuffer, ArrayBufferView, URLSearchParams

浏览器专属：FormData File Blob

Node 专属：Stream

### 10.timeout

指定请求超时的毫秒数(0 表示无超时时间)

如果请求花费了超过 `timeout` 的时间，请求将被中断

### 11.withCredentials

表示跨域请求时是否需要使用凭证

默认为 false

### 12.adapter

允许自定义处理请求，以使测试更轻松

返回一个 promise 并应用一个有效的响应

### 13.auth

表示应该使用 HTTP 基础验证，并提供凭据

这将设置一个 `Authorization` 头，覆写掉现有的任意使用 `headers` 设置的自定义 `Authorization`头

### 14.responseType

表示服务器响应的数据类型，可以是 'arraybuffer', 'blob', 'document', 'json', 'text', 'stream'

默认 json

### 15.responseEncoding

响应结果编码，默认 utf-8

### 16.xsrfCookieName

用作 xsrf token 的值的 cookie 的名称

跨站请求的 cookie 名称设置

默认 XSRF-TOKEN

### 17.xsrfHeaderName

http 请求头的 token 值设置

默认 X-XSRF-TOKEN

### 18.onUploadProgress

允许为上传处理进度事件

### 19.onDownloadProgress

允许为下载处理进度事件

### 20.maxContentLength

定义允许的响应内容的最大尺寸

### 21.validateStatus

定义对于给定的 HTTP 响应状态码是 resolve 或 reject promise 。如果 `validateStatus` 返回 `true` (或者设置为 `null` 或 `undefined`)，promise 将被 resolve; 否则，promise 将被 rejected

默认值 return status >= 200 && status < 300;

### 22.maxRedirects

定义在 node.js 中 follow 的最大重定向数目（请求跳转的最大次数）
如果设置为 0，将不会 follow 任何重定向

默认为 5

### 23.socketPath

与 proxy 代理类似，做数据转发代理。如果和 proxy 都设置了，那么优先使用 socketPath

### 24.httpAgent httpsAgent

分别在 node.js 中用于定义在执行 http 和 https 时使用的自定义代理

{ keepAlive: true } 默认没有启用

### 25.proxy

定义代理服务器的主机名称和端口

auth 表示 HTTP 基础验证应当用于连接代理，并提供凭据。

这将会设置一个 `Proxy-Authorization` 头，覆写掉已有的通过使用 `header` 设置的自定义 `Proxy-Authorization` 头。

### 26.cancelToken

指定用于取消请求的 cancel token

## 创建实例对象

```javascript
const obj = axios.create();
```

可借助于 get post 等方法来发送请求获取 Promise 对象

## Interceptors 拦截器

在请求或响应被 `then` 或 `catch` 处理前拦截它们。

示例：

```javascript
// 添加请求拦截器
axios.interceptors.request.use(
  function (config) {
    // 在发送请求之前做些什么
    return config;
  },
  function (error) {
    // 对请求错误做些什么
    return Promise.reject(error);
  }
);

// 添加响应拦截器
axios.interceptors.response.use(
  function (response) {
    // 对响应数据做点什么
    return response;
  },
  function (error) {
    // 对响应错误做点什么
    return Promise.reject(error);
  }
);
```

**多个拦截器设置，执行顺序：请求拦截器后进先出，响应拦截器先进先出。**

请求拦截器函数参数 config：对请求方法 config 各项参数做配置，最终返回 config

响应拦截器函数参数 response：对响应数据进行修改限制，如只返回响应体数据，不返回状态码等

## 取消请求

```javascript
const CancelToken = axios.CancelToken;
const source = CancelToken.source();

axios
  .get("/user/12345", {
    cancelToken: source.token,
  })
  .catch(function (thrown) {
    if (axios.isCancel(thrown)) {
      console.log("Request canceled", thrown.message);
    } else {
      // 处理错误
    }
  });

axios.post(
  "/user/12345",
  {
    name: "new name",
  },
  {
    cancelToken: source.token,
  }
);

// 取消请求（message 参数是可选的）
source.cancel("Operation canceled by the user.");
```

还可以通过传递一个 executor 函数到 `CancelToken` 的构造函数来创建 cancel token：

```javascript
const CancelToken = axios.CancelToken;
let cancel;

axios.get("/user/12345", {
  cancelToken: new CancelToken(function executor(c) {
    // executor 函数接收一个 cancel 函数作为参数
    cancel = c;
  }),
});

// cancel the request
cancel();
```

对 cancel 的判断以及 cancel()设置可以实现 axios 防抖。

## 发送请求工作原理

Axios.prototype.request：判断传入参数

config：mergeConfig（this.defaults, config）：合并默认配置与 config

Set config method

创建拦截器中间件 chain ：dispatchRequest，调适配器 adapter 与 HTTP

创建一个成功的 promise，成功的值为合并后的请求 config

遍历请求拦截器与响应拦截器

依次取出 chain 的元素进行 promise 回调

dispatchRequst：

判断请求是否取消，抛出错误

确保头信息存在

对请求数据进行初始化转化

合并一切其他头信息的配置项

将配置项中关于方法的配置项全部删除

获取适配器对象

通过 adapter 适配器方法发送请求，返回 promise 对象

对响应结果进行转换处理

转换处理的 promise 对象返回给 axios 方法

## 发送请求模拟实现

```html
<script>
  function Axios(config) {
    this.config = config;
  }

  //request原型方法，返回最终结果
  Axios.prototype.request = function (config) {
    let promise = Promise.resolve(config);
    let chains = [dispatchRequest, undefined];
    let result = promise.then(chains[0], chains[1]);
    return result;
  };
  const context = new Axios({});
  const axios = Axios.prototype.request.bind(context);

  //被request调用，返回响应数据或报错
  function dispatchRequest(config) {
    return xhrAdapter(config).then(
      (response) => {
        /*
            此处转换处理略
            * */
        return response;
      },
      (error) => {
        throw error;
      }
    );
  }

  //被dispatchRequest调用，发起ajax请求，返回带响应数据的promise或失败值的promise
  function xhrAdapter(config) {
    return new Promise((resolve, reject) => {
      let xhr = new XMLHttpRequest();
      //初始化
      xhr.open(config.method, config.url);
      //发送
      xhr.send();
      //绑定事件
      xhr.onreadystatechange = function () {
        //判断条件
        if (xhr.readyState === 4) {
          if (xhr.status >= 200 && xhr.status < 300) {
            resolve({
              config: config,
              data: xhr.response,
              headers: xhr.getAllResponseHeaders(),
              request: xhr,
              status: xhr.status,
              statusText: xhr.statusText,
            });
          } else {
            reject(new Error("请求失败 失败状态码为" + xhr.status));
          }
        }
      };
    });
  }

  axios({
    method: "GET",
    url: "http://localhost:3000/posts",
  }).then((response) => {
    console.log(response);
  });
</script>
```

## 拦截器模拟实现

```html
<script>
  //构造函数
  function Axios(config) {
    this.config = config;
    this.interceptors = {
      request: new InterceptorManager(),
      response: new InterceptorManager(),
    };
  }

  //发送一个简单请求
  Axios.prototype.request = function (config) {
    //核心1：创建一个resolve返回的promise对象
    let promise = Promise.resolve(config);
    //核心2：创建链条数组
    const chains = [dispatchRequest, undefined];
    //核心3：处理拦截器，unshift push
    this.interceptors.request.handlers.forEach((item) => {
      chains.unshift(item.fulfilled, item.rejected);
    });
    this.interceptors.response.handlers.forEach((item) => {
      chains.push(item.fulfilled, item.rejected);
    });
    while (chains.length) {
      promise = promise.then(chains.shift(), chains.shift());
    }
    return promise;
  };

  function dispatchRequest() {
    return new Promise((resolve, reject) => {
      resolve({
        status: 200,
        statusText: "OK",
      });
    });
  }

  //创建实例
  let context = new Axios({});
  //创建axios函数
  let axios = Axios.prototype.request.bind(context);
  //将context属性config interceptors添加到axios函数身上
  Object.keys(context).forEach((key) => {
    axios[key] = context[key];
  });

  //拦截管理器构造函数
  function InterceptorManager() {
    this.handlers = [];
  }

  InterceptorManager.prototype.use = function (fulfilled, rejected) {
    this.handlers.push({
      fulfilled,
      rejected,
    });
  };

  axios.interceptors.request.use(
    function one(config) {
      console.log("请求拦截器1");
      return config;
    },
    function one(error) {
      console.log("请求拦截器1失败");
      return Promise.reject(error);
    }
  );
  axios.interceptors.request.use(
    function two(config) {
      console.log("请求拦截器2");
      return config;
    },
    function two(error) {
      console.log("请求拦截器2失败");
      return Promise.reject(error);
    }
  );
  axios.interceptors.response.use(
    function one(config) {
      console.log("响应拦截器1");
      return config;
    },
    function one(error) {
      console.log("请求拦截器1失败");
      return Promise.reject(error);
    }
  );
  axios.interceptors.response.use(
    function two(config) {
      console.log("响应拦截器2");
      return config;
    },
    function two(error) {
      console.log("请求拦截器2失败");
      return Promise.reject(error);
    }
  );

  axios({
    method: "GET",
    url: "http://localhost:3000/posts",
  }).then((response) => {
    console.log(response);
  });
</script>
```

## 取消请求工作原理

创建 cancelToken 的值

cancelToken 的执行器参数必须是一个函数

核心：声明一个变量 resolvePromise，同时声明 this.promise 为 promise 对象，将 this.resolvePromise 赋值为成功的 Promise resolve 值返回给 this.promise

token 指向当前的 this 对象

调用执行器参数函数，函数的参数也是一个函数：如果 token.reason 不存在则将 token.reason 赋值为

new Cancel(message)，同时调用 this.resolvePromise(token.reason)使上面的 promise 返回 resolve 的 promise 对象

返回到 axios 方法中，如果方法中声明了一个属性名 cancelToken，则会去调用该属性的 this.promise 方法，

如果上面通过调用执行器函数的参数函数，调用了 resolvePromise 函数，则 this.promise 会返回成功的 promise 对象，通过 then 方法去调用 request.abort()来取消 ajax 请求

简单总结：将取消请求的 abort 方法放在了成功的 promise 对象的 then 方法中，promise 对象返回成功的时机取决于何时去调用方法实现。

## 取消请求模拟实现

```html
<body>
  <button id="send">发送请求</button>
  <button id="cancel">取消请求</button>
  <script>
    function Axios(config) {
      this.config = config;
    }

    Axios.prototype.request = function (config) {
      return dispatchRequest(config);
    };

    function dispatchRequest(config) {
      return xhrAdapter(config).then(
        (response) => {
          /*
            此处转换处理略
            * */
          return response;
        },
        (error) => {
          return error;
        }
      );
    }

    //CancelToken构造函数
    function CancelToken(executor) {
      let resolvePromise;
      this.promise = new Promise((resolve) => {
        //关键！将resolve赋值给resolvePromise
        resolvePromise = resolve;
      });
      //调用executor函数
      executor(function () {
        //执行resolvePromise函数
        resolvePromise();
      });
    }

    function xhrAdapter(config) {
      return new Promise((resolve, reject) => {
        let xhr = new XMLHttpRequest();
        //初始化
        xhr.open(config.method, config.url);
        //发送
        xhr.send();
        //绑定事件
        xhr.onreadystatechange = function () {
          //判断条件
          if (xhr.readyState === 4) {
            if (xhr.status >= 200 && xhr.status < 300) {
              resolve({
                config: config,
                data: xhr.response,
                headers: xhr.getAllResponseHeaders(),
                request: xhr,
                status: xhr.status,
                statusText: xhr.statusText,
              });
            } else {
              reject(new Error("请求失败 失败状态码为" + xhr.status));
            }
          }
        };

        //取消请求的处理
        if (config.cancelToken) {
          config.cancelToken.promise.then((response) => {
            xhr.abort();
            reject(new Error("请求取消"));
          });
        }
      });
    }

    const context = new Axios({});
    const axios = Axios.prototype.request.bind(context);

    const btn1 = document.querySelector("#send");
    const btn2 = document.querySelector("#cancel");
    //取消请求的变量cancel
    let cancel = null;
    btn1.onclick = function () {
      if (cancel !== null) {
        cancel();
      }
      let cancelToken = new CancelToken(function (c) {
        cancel = c;
      });
      axios({
        method: "GET",
        url: "http://localhost:3000/posts",
        cancelToken: cancelToken,
      }).then((response) => {
        console.log(response);
        cancel = null;
      });
    };

    btn2.onclick = function () {
      cancel && cancel();
    };
  </script>
</body>
```

## axios 源码总结

### 1.axios 和 Axios 的关系

从语法上来说：axios 不是 Axios 的实例

从功能上来说：axios 是 Axios 的实例

axios 是 Axios.prototype.request 函数 bind()返回的函数

axios 作为对象有 Axios 原型对象上的所有方法，有 Axios 对象上所有属性

### 2.instance（axios.create 创建的对象 ）与 axios 的区别

相同点：

​- 都是一个能发任意请求的函数：request(config)

​- 都有发特定请求的各种方法：get post put delete

​- 都有默认配置和拦截器的属性：defaults interceptors

不同点：

​- 默认配置很可能不一样

​- instance 没有 axios 后面添加的一些方法：create CancelToken all
