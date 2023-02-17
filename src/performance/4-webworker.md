---
title: WebWorker
order: 4
category: false
tag:
  - WebWorker
  - 多线程JS
---

众所周知，JS 是单线程没有多线程，当 JS 在页面中运行用时较长的同步任务的时候就会导致页面阻塞，从而我们需要把这些阻塞任务放在任务队列中

而实际上异步任务队列中的任务也并非多线程进行的，多个异步线程池里的异步任务也是顺序执行的，只是对于客户端而言不存在阻塞

然而现在，HTML5 提供了这样一个 API：Web Workers，允许我们在浏览器中执行多个线程的任务

## 概述

Wob Worker 是 HTML5 标准的一部分，允许我们再 js 主线程之外开辟新的 Worker 线程，并将一段 js 脚本运行其中，它赋予了开发者利用 js 操作多线程的能力

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
