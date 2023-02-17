---
title: WebWorker
order: 4
category: false
tag:
  - WebWorker
  - 多线程JS
  - SharedWorker
  - ServiceWorker
---

众所周知，JS 是单线程没有多线程，当 JS 在页面中运行用时较长的同步任务的时候就会导致页面阻塞，从而我们需要把这些阻塞任务放在任务队列中

而实际上异步任务队列中的任务也并非多线程进行的，多个异步线程池里的异步任务也是顺序执行的，只是对于客户端而言不存在阻塞

然而现在，HTML5 提供了这样一个 API：Web Workers，允许我们在浏览器中执行多个线程的任务

注意：WebWorker 对新版浏览器兼容性都很好，旧浏览器基本不兼容

## 概述

Wob Worker 是 HTML5 标准的一部分，允许我们再 js 主线程之外开辟新的 Worker 线程，并将一段 js 脚本运行其中，它赋予了开发者利用 js 操作多线程的能力

值得注意的是，规范中有三种类型的 Web Workers：

1. **Dedicated Web Workers** 是由主进程实例化并且只能与之进行通信
2. **Shared workers** 可以被运行在同源的所有进程访问(不同的浏览的选项卡，内联框架及其它 shared workers)
3. **Service Worker** 是一个由事件驱动的 worker，它由源和路径组成

下面将着重介绍第一种专用 Worker，另外两种放在最后写

因为是独立的线程，Worker 线程与 js 主线程能够同时运行，互不阻塞。所以，在我们有大量运算任务时，可以把运算任务交给 Worker 线程去处理，当 Worker 线程计算完成，再把结果返回给 js 主线程。这样，js 主线程只用专注处理业务逻辑，不用耗费过多时间去处理大量复杂计算，从而减少了阻塞时间，也提高了运行效率，页面流畅度和用户体验自然而然也提高了。

## 使用

### 使用限制

worker 线程的使用有如下注意点：

- 同源限制：执行的脚本文件路径不能跨域
- 文件限制：无法读取本地文件，加载的脚本必须来自网络
- DOM 操作限制：worker 线程与主线程的 window 在不同的另一个全局上下文中运行，其中无法读取主线程的 DOM，也不能获取 document、window 等对象，但是可以获取 navigator、location、XMLHttpRequest、setTimeout 等浏览器 API
- 通信限制：双方线程不在同一个上下文，不能直接通信，需要通过 postMessage 方法通信
- 脚本限制：worker 线程不能执行 alert、confirm，但可以使用 XMLHttpRequest 对象发出 ajax 请求

### 语法

```js
const worker = new Worker(path, options);
```

| 参数                | 说明                                                                                                                                   |
| :------------------ | :------------------------------------------------------------------------------------------------------------------------------------- |
| path                | 有效的 js 脚本的地址，必须遵守同源策略。无效的 js 地址或者违反同源策略，会抛出 SECURITY_ERR 类型错误                                   |
| options.type        | 可选，用以指定 worker 类型。该值可以是 classic 或 module。 如未指定，将使用默认值 classic                                              |
| options.credentials | 可选，用以指定 worker 凭证。该值可以是 omit, same-origin，或 include。如果未指定，或者 type 是 classic，将使用默认值 omit (不要求凭证) |
| options.name        | 可选，在 DedicatedWorkerGlobalScope 的情况下，用来表示 worker 的 scope 的一个 DOMString 值，主要用于调试目的。                         |

### API

- worker.postMessage: 主线程往 worker 线程发消息，消息可以是任意类型数据，包括二进制数据
- worker.terminate: 主线程关闭 worker 线程。主线程关闭后，连接立刻停止，主线程不再接收消息
- worker.onmessage: 指定 worker 线程发消息时的回调，也可以通过 worker.addEventListener('message',cb)的方式
- worker.onerror: 指定 worker 线程发生错误时的回调，也可以 worker.addEventListener('error',cb)
- Worker 线程中全局对象为 self，代表子线程自身，这时 this 指向 self，其上有一些 api：

Worker 线程中全局对象为 self，代表子线程自身，这时 this 指向 self，其上有一些 api：

- self.postMessage: worker 线程往主线程发消息，消息可以是任意类型数据，包括二进制数据
- self.close: worker 线程关闭自己。不会直接断开与主线程连接，会等内部的 Event Loop 所有任务执行完后再关闭
- self.onmessage: 指定主线程发 worker 线程消息时的回调，也可以 self.- addEventListener('message',cb)
- self.onerror: 指定 worker 线程发生错误时的回调，也可以 self.addEventListener('error',cb)

### 通信数据

postMessage(message, transferList)方法接收两个参数，message 可以传递任何类型数据，包括对象，通信为拷贝关系，即是传值而非传址

Worker 对通信内容的修改也不会影响主线程，事实上浏览器内部的运行机制为，先将通信内容串行化，然后把串行化后的字符串发给 Worker 再还原

第二个参数 transferList，是一个可选数组，用于传递所有权。如果一个对象的所有权被转移，在发送它的上下文中将变为不可用。这个参数很少用

## 引用 js

worker 线程中支持 importScripts() 方法加载我们需要的 js 文件，而且，通过此方法加载的 js 文件不受同源策略约束

```js
// utils.js
const add = (a, b) => a + b;
```

```js
// worker.js
importScripts('./utils.js)

console.log(add(1, 2));  // 3
```

## ESM 模式

开启 module 模式后，让 worker.js 支持 ESM 文件导入

```js
// main.js（主线程）
const worker = new Worker("/worker.js", {
  type: "module", // 指定 worker.js 的类型
});
```

```js
// utils.js
export default add = (a, b) => a + b;
```

```js
// worker.js（worker线程）
import add from "./utils.js"; // 导入外部js

self.addEventListener("message", (e) => {
  postMessage(e.data);
});

add(1, 2); // log 3

export default self; // 只需把顶级对象self暴露出去即可
```

## 数据类型

可传递的数据类型都基于结构化克隆算法，包括基本数据类型、复杂数据类型、文件类型、二进制类型等

不可传递的数据类型：Error、Function、DOM 节点、原型链属性等

## 适用场景

- 加密数据：有些加解密的算法比较复杂，或者在加解密很多数据的时候，这会非常耗费计算资源，导致 UI 线程无响应，因此这是使用 Web Worker 的好时机，使用 Worker 线程可以让用户更加无缝的操作 UI。
- 预取数据：有时候为了提升数据加载速度，可以提前使用 Worker 线程获取数据，因为 Worker 线程是可以是用 XMLHttpRequest 的。
- 预渲染：在某些渲染场景下，比如渲染复杂的 canvas 的时候需要计算的效果比如反射、折射、光影、材料等，这些计算的逻辑可以使用 Worker 线程来执行，也可以使用多个 Worker 线程，这里有个射线追踪的示例。
- 复杂数据处理：某些检索、排序、过滤、分析会非常耗费时间，这时可以使用 Web Worker 来进行，不占用主线程。
- 预加载图片：有时候一个页面有很多图片，或者有几个很大的图片的时候，如果业务限制不考虑懒加载，也可以使用 Web Worker 来加载图片，可以参考一下这篇文章的探索，这里简单提要一下。

## SharedWorker

SharedWorker 是一种特殊的 WebWorker，可有支持多个浏览器上下文的通信功能，例如多个窗口、iframe。

**注意：如果要使 SharedWorker 连接到多个不同的页面，这些页面必须是同源的（相同的协议、host 以及端口）**

### 使用

- SharedWorker 需要提供一个 js 静态资源文件。该文件用于让**多个页签**项目加载
- 同一个 js 脚本会创建一个 sharedWorker，其他页面再使用同样的脚本创建 sharedWorker，会复用已创建的 worker，这个 worker 由几个页面共享
- sharedWorker 通过 port 来发送和接收消息

```js
// 页面 window.onbeforeunload = () => { myWorker.port.postMessage('CLOSE'); };

// worker js
const portPool = [];
onconnect= function(e) {
	const port = e.ports[0];
	// 在connect时将 port添加到 portPool中
	portPool.push(port);
	port.postMessage('发送'）
	port.onmessage = (e) => {
		console.log(e.data);
    if (e.data === 'CLOSE'){
      const index = ports.findIndex(p => p === port);
      portPool.splice(index, 1);
    }
	}
}

function boardCast(message) {
	portPool.forEach(port => {
		port.portMessage(port);
	})
}
```

### 适用场景

- WebWorker 单开线程跑计算量大、耗时的任务，不影响主线程 ui 渲染
- 页面之间登录状态通知（如：github 的登录状态）
- 后台 spa 项目中，多个浏览器页签 tab 页面数据通信

## ServiceWorker

ServiceWorker 是一个介于客户端和服务器之间的一个代理服务器。在 Service Worker 中我们可以做很多事情，比如拦截客户端的请求、向客户端发送消息、向服务器发起请求等等，其中最重要的作用之一就是离线资源缓存，大大提高浏览体验（下面部分简称为 SW）

参考链接 1：https://juejin.cn/post/6844903613270081543#heading-2

参考链接 2：https://mp.weixin.qq.com/s/3Ep5pJULvP7WHJvVJNDV-g

### 最特殊的 WebWorker

ServiceWorker 跟上面的常规 WebWorker 相比，有相同点也有差异很大的地方

相同点：

- 无法操作 DOM
- 通过 postMessage 发送到其他线程
- 非阻塞运行

不同的地方在于，ServiceWorker 是一个浏览器中的进程而不是浏览器内核下的线程，因此它在被注册安装之后，能够在多个页面中使用，也不会因为页面的关闭而被销毁。因此，ServiceWorker 很适合被用与多个页面需要使用的复杂数据的计算——购买一次，全家“收益”

### 使用条件

ServiceWorker 是基于 https 的，因为 ServiceWorker 中涉及到请求拦截，所以必须使用 https 协议来保障安全。如果是本地调试的话，localhost 是可以的

### 生命周期

![SW生命周期](https://misaka10032.oss-cn-chengdu.aliyuncs.com/performance/service-worker.png)

#### 1.注册

要使用 Service Worker，首先需要注册一个 sw，通知浏览器为该页面分配一块内存，然后 sw 就会进入安装阶段

```js
(function () {
  if ("serviceWorker" in navigator) {
    navigator.serviceWorker.register("./sw.js");
  }
})();
```

比较完整全面的注册方式是这样的：

```js
"serviceWorker" in navigator &&
  window.addEventListener("load", function () {
    var e =
      location.pathname.match(/\/news\/[a-z]{1,}\//)[0] +
      "article-sw.js?v=08494f887a520e6455fa";
    navigator.serviceWorker
      .register(e)
      .then(function (n) {
        n.onupdatefound = function () {
          var e = n.installing;
          e.onstatechange = function () {
            switch (e.state) {
              case "installed":
                navigator.serviceWorker.controller
                  ? console.log("New or updated content is available.")
                  : console.log("Content is now available offline!");
                break;
              case "redundant":
                console.error(
                  "The installing service worker became redundant."
                );
            }
          };
        };
      })
      .catch(function (e) {
        console.error("Error during service worker registration:", e);
      });
  });
```

register 方法接收两个参数

第一个是文件路径，注意是 Origin 路径下的，所以一般我们的 SW 文件都放在根目录下和 index.html 同级

第二个是配置项，可选填，比较重要的是`{ scope }`属性，默认是`{ scope: './' }`表示接管当前服务器中全部的 url

#### 2.installing

我们注册后，浏览器就会开始安装 sw，可以通过事件监听

```js
//service worker安装成功后开始缓存所需的资源
var CACHE_PREFIX = "cms-sw-cache";
var CACHE_VERSION = "0.0.20";
var CACHE_NAME = CACHE_PREFIX + "-" + CACHE_VERSION;
var allAssets = ["./main.css"];
self.addEventListener("install", function (event) {
  //调试时跳过等待过程
  self.skipWaiting();

  // Perform install steps
  //首先 event.waitUntil 你可以理解为 new Promise，
  //它接受的实际参数只能是一个 promise，因为,caches 和 cache.addAll 返回的都是 Promise，
  //这里就是一个串行的异步加载，当所有加载都成功时，那么 SW 就可以下一步。
  //另外，event.waitUntil 还有另外一个重要好处，它可以用来延长一个事件作用的时间，
  //这里特别针对于我们 SW 来说，比如我们使用 caches.open 是用来打开指定的缓存，但开启的时候，
  //并不是一下就能调用成功，也有可能有一定延迟，由于系统会随时睡眠 SW，所以，为了防止执行中断，
  //就需要使用 event.waitUntil 进行捕获。另外，event.waitUntil 会监听所有的异步 promise
  //如果其中一个 promise 是 reject 状态，那么该次 event 是失败的。这就导致，我们的 SW 开启失败。
  event.waitUntil(
    caches.open(CACHE_NAME).then(function (cache) {
      console.log("[SW]: Opened cache");
      return cache.addAll(allAssets);
    })
  );
});
```

安装时，sw 就开始缓存文件了，会检查所有文件的缓存状态，如果都已经缓存了，则安装成功，进入下一阶段

#### 3.activated

如果是第一次加载 sw，在安装后，会直接进入 activated 阶段，而如果 sw 进行更新，情况就会显得复杂一些

1. 首先老的 sw 为 A，新的 sw 版本为 B
2. B 进入 install 阶段，而 A 还处于工作状态，所以 B 进入 waiting 阶段。只有等到 A 被 terminated 后，B 才能正常替换 A 的工作

这个 terminated 的时机有如下几种方式：

1. 关闭浏览器一段时间；
2. 手动清除 Service Worker；
3. 在 sw 安装时直接跳过 waiting 阶段.

```js
//service worker安装成功后开始缓存所需的资源
self.addEventListener("install", function (event) {
  //跳过等待过程
  self.skipWaiting();
});
```

然后就进入了 activated 阶段，激活 sw 工作。
activated 阶段可以做很多有意义的事情，比如更新存储在 Cache 中的 key 和 value

```js
var CACHE_PREFIX = "cms-sw-cache";
var CACHE_VERSION = "0.0.20";
/**
 * 找出对应的其他key并进行删除操作
 * @returns {*}
 */
function deleteOldCaches() {
  return caches.keys().then(function (keys) {
    var all = keys.map(function (key) {
      if (
        key.indexOf(CACHE_PREFIX) !== -1 &&
        key.indexOf(CACHE_VERSION) === -1
      ) {
        console.log("[SW]: Delete cache:" + key);
        return caches.delete(key);
      }
    });
    return Promise.all(all);
  });
}
//sw激活阶段,说明上一sw已失效
self.addEventListener("activate", function (event) {
  event.waitUntil(
    // 遍历 caches 里所有缓存的 keys 值
    caches.keys().then(deleteOldCaches)
  );
});
```

#### 4.idle

这个空闲状态一般是不可见的，这种一般说明 sw 的事情都处理完毕了，然后处于闲置状态了。
浏览器会周期性的轮询，去释放处于 idle 的 sw 占用的资源

#### 5.fetch

该阶段是 sw 最为关键的一个阶段，用于拦截代理所有指定的请求，并进行对应的操作。

所有的缓存部分，都是在该阶段

```js
//监听浏览器的所有fetch请求，对已经缓存的资源使用本地缓存回复
self.addEventListener("fetch", function (event) {
  event.respondWith(
    caches.match(event.request).then(function (response) {
      //该fetch请求已经缓存
      if (response) {
        return response;
      }
      return fetch(event.request);
    })
  );
});
```

#### 6.terminated

sw 进程中止，一般不会手动发起，而是由新版本的 sw 安装后，老版本 sw 自动终止被替换

### 信息通讯

生命周期里我们提到了 SW 的注册、安装、更新与拦截，这里再说一说 SW 的信息通讯手段

#### 页面到 SW

```js
// index.js
if ("serviceWorker" in window.navigator) {
  navigator.serviceWorker
    .register("./sw.js", { scope: "./" })
    .then(function (reg) {
      console.log("success", reg);
      navigator.serviceWorker.controller &&
        navigator.serviceWorker.controller.postMessage(
          "this message is from page"
        );
    });
}
```

为了保证 Service Worker 能够接收到信息，我们在它被注册完成之后再发送信息，和普通的 window.postMessage 的使用方法不同，为了向 Service Worker 发送信息，我们要在 ServiceWorker 实例上调用 postMessage 方法，这里我们使用到的是 navigator.serviceWorker.controller

```js
// sw.js
self.addEventListener("message", function (event) {
  console.log(event.data); // this message is from page
});
```

#### SW 到页面

而最简单的方法就是从页面发送过来的消息中获取 WindowClient 实例，使用的是 event.source ，不过这种方法只能向消息的来源页面发送信息

```js
// sw.js
this.addEventListener("message", function (event) {
  event.source.postMessage("this message is from sw.js, to page");
});

// index.js
navigator.serviceWorker.addEventListener("message", function (e) {
  console.log(e.data); // this message is from sw.js, to page
});
```

如果不想受到这个限制，则可以在 SW 文件中使用 this.clients 来获取其他的页面，并发送消息，实现多页签页面信息同步

```js
// sw.js
this.clients.matchAll().then((client) => {
  client[0].postMessage("this message is from sw.js, to page");
});
```

#### MessageChannel

另外一种比较好用的通信方式是使用 Message Channel

```js
// index.js
navigator.serviceWorker
  .register("./sw.js", { scope: "./" })
  .then(function (reg) {
    const messageChannel = new MessageChannel();
    messageChannel.port1.onmessage = (e) => {
      console.log(e.data); // this message is from sw.js, to page
    };
    reg.active.postMessage("this message is from page, to sw", [
      messageChannel.por2,
    ]);
  });

// sw.js
this.addEventListener("message", function (event) {
  console.log(event.data); // this message is from page, to sw
  event.ports[0].postMessage("this message is from sw.js, to page");
});
```

使用这种方式能够使得通道两端之间可以相互通信，而不是只能向消息源发送信息

### 静态资源缓存

接下来就是重头戏，也是 ServiceWorker 能够实现的最主要的功能——静态资源缓存

我们可以使用 ServiceWorker 配合 CacheStorage 来实现对静态资源的缓存

#### 缓存指定静态资源

```js
// sw.js
this.addEventListener("install", function (event) {
  console.log("install");
  event.waitUntil(
    caches.open("sw_demo").then(function (cache) {
      return cache.addAll(["/style.css", "/panda.jpg", "./main.js"]);
    })
  );
});
```

当 ServiceWorker 在被安装的时候，我们能够对制定路径的资源进行缓存。CacheStorage 在浏览器中的接口名是 caches ，我们使用 caches.open 方法新建或打开一个已存在的缓存；cache.addAll 方法的作用是请求指定链接的资源并把它们存储到之前打开的缓存中。由于资源的下载、缓存是异步行为，所以我们要使用事件对象提供的 event.waitUntil 方法，它能够保证资源被缓存完成前 Service Worker 不会被安装完成，避免发生错误

从 Chrome 开发工具中的 Application 的 CacheStorage 中可以看到我们缓存的资源

#### 动态缓存静态资源

我们需要监听 fetch 事件，每当用户向服务器发起请求的时候这个事件就会被触发。有一点需要注意，页面的路径不能大于 Service Worker 的 scope，不然 fetch 事件是无法被触发的

上面已经提到过了，在生命周期的 fetch 阶段，可执行所有 scope 路径下的请求拦截

```js
this.addEventListener("fetch", function (event) {
  console.log(event.request.url);
  event.respondWith(
    caches.match(event.request).then((res) => {
      return (
        res ||
        fetch(event.request)
          .then((response) => {
            const responseClone = response.clone();
            caches.open("sw_demo").then((cache) => {
              cache.put(event.request, responseClone);
            });
            return response;
          })
          .catch((err) => {
            console.log(err);
          })
      );
    })
  );
});
```

几个注意点：

1. 当用户第一次访问页面的时候，资源的请求是早于 ServiceWorker 的安装的，所以静态资源是无法缓存的；只有当 ServiceWorker 安装完毕，用户第二次访问页面的时候，这些资源才会被缓存起来
2. CacheStorage 只能缓存静态资源，所以它只能缓存用户的 GET 请求
3. CacheStorage 中的缓存不会过期，但是浏览器对它的大小是有限制的，所以需要我们定期进行清理

#### 更新 CacheStorage

前面提到过，当有新的 ServiceWorker 文件存在的时候，他会被注册和安装，等待使用旧版本的页面全部被关闭后，才会被激活。这时候，我们就需要清理下我们的 CacheStorage 了，删除旧版本的 CacheStorage

```js
this.addEventListener("install", function (event) {
  console.log("install");
  event.waitUntil(
    caches.open("sw_demo_v2").then(function (cache) {
      // 更换 CacheStorage
      return cache.addAll(["/style.css", "/panda.jpg", "./main.js"]);
    })
  );
});

const cacheNames = ["sw_demo_v2"]; // CacheStorage 白名单

this.addEventListener("activate", function (event) {
  event.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all[
        keys.map((key) => {
          if (!cacheNames.includes(key)) {
            console.log(key);
            return caches.delete(key); // 删除不在白名单中的 CacheStorage
          }
        })
      ];
    })
  );
});
```

