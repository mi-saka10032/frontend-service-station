---
title: 交互优化
order: 2
category: false
tag:
  - 网络协议
  - URL解析过程
  - 页面加载优化
  - 资源预加载
---

交互优化，我个人的理解是：包含从输入网址访问、页面渲染到用户操作界面交互整个人机交互的优化过程

## URL 页面加载全过程

回顾一遍从输入 URL 到页面加载的全过程

参考链接 1：https://blog.csdn.net/feng8403000/article/details/114419417

参考链接 2：https://www.cnblogs.com/xiaohuochai/p/9193083.html

### TCP/IP 七层协议

自底向上为：

物理层：确保原始的数据可在各种物理媒体上传输

数据链路层：建立逻辑连接、进行硬件地址寻址、差错校验等功能。（由底层网络定义协议）。将比特组合成字节进而组合成帧，用 MAC 地址访问介质，错误发现但不能纠正

网络层：进行逻辑地址寻址，实现不同网络之间的路径选择。协议有：ICMP IGMP IP（IPV4 IPV6） ARP RARP

传输层：定义传输数据的协议端口号，以及流控和差错校验。协议有：TCP UDP，数据包一旦离开网卡即进入网络传输层

会话层：建立、管理、终止会话。（在五层模型里面已经合并到了应用层）。对应主机进程，指本地主机与远程主机正在进行的会话

表示层：数据的表示、安全、压缩。（在五层模型里面已经合并到了应用层）。格式有，JPEG、ASCll、DECOIC、加密格式等

应用层：网络服务与最终用户的一个接口。协议有：HTTP FTP TFTP SMTP SNMP DNS TELNET HTTPS POP3 DHCP

了解完七层网络协议后，我们开始谈 URL 的加载全流程

### 1.应用层进行 DNS 解析

输入 URL 后，最先执行的是 DNS 解析，通过 DNS 将域名解析成 IP 地址。在解析过程中，按照 浏览器缓存、系统缓存、路由器缓存、DNS 缓存、根域名服务器、顶级域名服务器、主域名服务器（域名采取递归查询）的顺序，逐步读取缓存，直到拿到 IP 地址

### 2.传输层建立 TCP 连接

传输层传输协议分为 UDP 和 TCP 两种

UDP 是无连接的协议，而 TCP 是可靠的有连接的协议,主要表现在：

- 接收方会对收到的数据进行确认
- 发送方会重传接收方未确认的数据
- 接收方会将接收到数据按正确的顺序重新排序，并删除重复的数据
- 提供了控制拥挤的机制

HTTP 协议是使用 TCP 协议作为其传输层协议的，在拿到服务器的 IP 地址后，浏览器客户端会与
服务器建立 TCP 连接。该过程包括三次握手

![TCP三次握手](https://misaka10032.oss-cn-chengdu.aliyuncs.com/performance/tcp-three.png)

第一次握手：建立连接时，客户端向服务端发送请求报文

第二次握手：服务器收到请求报文后，如同意连接，则向客户端发送确认报文

第三次握手：客户端收到服务器的确认后，再次向服务器给出确认报文，完成连接

三次握手主要是为了防止已经失效的请求报文字段发送给服务器，浪费资源

### 3.应用层生成 HTTP 请求报文

接着，应用层生成针对目标 WEB 服务器的 HTTP 请求报文，HTTP 请求报文包括起始行、首部和主体部分

首部包括域名 host、keep-alive、User-Agent、Accept-Encoding、Accept-Language、Cookie 等信息

```txt
Host: www.google.com
Connection: keep-alive
Upgrade-Insecure-Requests: 1
User-Agent: Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/65.0.3325.181 Safari/537.36
Accept: text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8
X-Client-Data: CKm1yQEIhbbJAQijtskBCMG2yQEIqZ3KAQioo8oB
Accept-Encoding: gzip, deflate, br
Accept-Language: zh-CN,zh;q=0.9,en;q=0.8
```

首部和主体内容之间有一个回车换行(CRLF)，主体内容即要传输的内容。如果是 get 请求，则主体内容为空

### 4.服务器处理请求

服务器端收到请求后的由 web 服务器（准确说应该是 http 服务器）处理请求，诸如 Apache、Nginx、IIS 等。web 服务器解析用户请求，知道了需要调度哪些资源文件，再通过相应的这些资源文件处理
用户请求和参数，并调用数据库信息，最后将结果通过 web 服务器返回给浏览器客户端。

![服务器处理请求](https://misaka10032.oss-cn-chengdu.aliyuncs.com/performance/server.png)

服务器处理 http 请求，并返回响应报文。响应报文包括三个部分：状态码、响应头、响应体（响应正文）

### 5.关闭 TCP 连接

为了避免服务器与客户端双方的资源占用和损耗，当双方没有请求或响应传递时，任意一方都可以发起关闭请求。

建立一个连接需要三次握手，而终止一个连接要经过四次挥手，这是由 TCP 的半关闭（half-close）造成的

![TCP四次挥手](https://misaka10032.oss-cn-chengdu.aliyuncs.com/performance/tcp-four.png)

第一次挥手：客户端想分手，发送消息给服务器

第二次挥手：服务器通知客户端已经接受到分手请求，但还没做好分手准备

第三次挥手：服务器已经做好分手准备，通知客户端

第四次挥手：客户端发送消息给服务器，确定分手，服务器关闭连接

### 6.浏览器解析 HTML

浏览器接受到 http 服务器发送过来的响应报文，并开始解析 html 文档，渲染页面。

准确地说，浏览器需要加载解析的不仅仅是 HTML，还包括 CSS、JS。以及还要加载图片、视频等其他媒体资源。

具体的渲染过程包括：构建 DOM 树、构建渲染树、定位页面元素、绘制页面元素等

浏览器通过解析 HTML，生成 DOM 树，解析 CSS，生成 CSS 规则树，然后通过 DOM 树和 CSS 规则树生成渲染树。渲染树与 DOM 树不同，渲染树中并没有 head、display 为 none 等不必显示的节点

要注意的是，浏览器的解析过程并非是串连进行的，比如在解析 CSS 的同时，可以继续加载解析 HTML，但在解析执行 JS 脚本时，会停止解析后续 HTML，就会出现阻塞问题

![HTML-Render](https://misaka10032.oss-cn-chengdu.aliyuncs.com/performance/html-render.png)

### 7.浏览器布局渲染

根据渲染树布局，计算 CSS 样式，即每个节点在页面中的大小和位置等几何信息

HTML 默认是流式布局的，CSS 和 js 会打破这种布局，改变 DOM 的外观样式以及大小和位置。这时就要提到两个重要概念：repaint 和 reflow

- repaint：重绘，屏幕的一部分重画，不影响整体布局，比如某个 CSS 的背景色变了，但元素的几何尺寸和位置不变
- reflow：重排，意味着元件的几何尺寸变了，我们需要重新验证并计算渲染树。是渲染树的一部分或全部发生了变化

注意：

重排发生在渲染树，重绘发生在渲染层，先有重排后有重绘

常说的脱离文档流，指的是脱离渲染树

### 8.浏览器发送嵌入请求

随着浏览器渲染 HTML，浏览器会注意到有些标签需要请求其他 URLs 的资源，浏览器将会发送一个 GET 请求来重新获取每个文件 。比如 js 文件，css 文件，图片资源等。每个 URLs 会像获取 HTML 页面的过程一样获取相应资源。所以，浏览器会在 DNS 中查询域名，并向 URL 发送请求，进行重定向

### 9.浏览器发送异步请求

到浏览器的内容已经加载完毕后，即触发 window.onload 后，一般会触发代码中 ajax 请求的逻辑，这时客户端会再次向服务端发起一次通信

## URL 加载优化阶段总结

总结上面的加载全过程：

1. 从 DNS 解析 -> 建立 TCP 连接 -> 生成请求报文，速度或效率取决于客户端-服务端的网络速度
2. 服务端处理请求生成响应数据的速度，取决于服务器的响应速度
3. 服务器通过 TCP 连接返回给客户端信息 -> 关闭 TCP 连接，速度或效率取决于服务端-客户端的网络速度
4. 浏览器解析 HTML 文档 -> 同步解析 HTML 树和 CSS 树 -> HTML 树解析阻塞 JS 脚本生成 DOM 树 -> 生成渲染树 -> 生成渲染层
5. HTML 页面内部的嵌入标签、脚本发送 GET 请求获取文件资源
6. 浏览器发送异步 AJAX 请求

除了 1 和 3 受网速影响外，2、4、5、6 均有可优化之处

### 服务器响应

以常用的 web 服务器 nginx 为例，提高响应速度可以采取负载均衡的方法。详细介绍暂时略过

### 浏览器解析

浏览器解析 HTML 文档时，JS 脚本的执行会严重阻塞渲染的执行，因此需要遵循下面两个原则：

- CSS 优先：引入顺序上，CSS 资源先于 JS 资源
- JS 置后：JS 通常放到页面底部，且**JS 尽量少影响 DOM 构建**

另外注意：DOM 树与 CSS 树合并构建时，CSS 查找匹配的效率为 id > class > tag，因此尽量少用标签选择器

### 浏览器布局

浏览器首次加载布局时，生成渲染树和渲染层时，必定会经历重绘(repaint)和重排(reflow)，这些过程是非常消耗性能的，尤其在移动设备上，它会造成用户体验，有时会造成页面卡顿，所以我们应尽可能减少 reflow 和 repaint

#### 减少 reflow

reflow 是不可避免的，只能将 reflow 对性能的影响见到最小

1. 减少不必要的 DOM 层级
2. 避免使用 table 布局，因为 table 内的细微改动会触发 table 的 reflow
3. 尽量让动画效果元素的 position 属性脱离文档流（脱离渲染树）
4. 避免逐条修改 DOM 样式，最好预定义好 class，修改对应节点的 className
5. 避免逐条操作 DOM 节点，可以这样做：
   - 使用 documentFragment 在内存中操作 DOM
   - 操作 DOM 为`display: none`，做完所有修改后再回显
   - clone 一个 DOM 节点到内存中，做完修改再交换
6. 请求如下值：offsetTop, offsetLeft, offsetWidth, offsetHeight，scrollTop/Left/Width/Height，clientTop/Left/Width/Height，这些 layout 属性会让浏览器 reflow，建议合并到一起执行操作，减少 reflow 次数

#### 减少 repaint

repaint 发生在元素的可见性发生变化时如背景色、前景色等，所以引发 repaint 不一定引发 reflow，repaint 对浏览器执行渲染的影响相对小一点

减少 reflow 的次数其实也就是减少了 repaint 的次数

减少单纯的 repaint 的方法就是避免逐条修改 DOM 样式，多采用预定义 class 最后修改根节点的 className 的方式

### 嵌入式静态资源

浏览器 HTML 文档内需要获取资源的标签会让浏览器发送 GET 请求去获取资源。这里不考虑获取 JS 资源的情况，仅讨论静态资源

虽然静态资源从获取、返回到展示到标签元素中这个过程并不影响其他元素的展示，但如果等到 HTML 内容都加载完了，图片、视频资源还迟迟没有加载出来，用户体验也是很糟糕的

处理方案分三点：加快下载速度、减小文件体积、减少请求数量，具体实现可以有以下几点：

1. 代码压缩：减小资源体积
2. 文件合并：减少请求次数
3. 雪碧图：合并细碎图片，background 属性偏移获取，减少请求次数
4. 替换图片格式：多采用 webp、svg 等格式，少用 png、jpg，减小资源体积
5. gzip：在打包工具中压缩静态文件，减小资源体积
6. cdn：固定的图片、视频、第三方库 js 等从 cdn 网络获取，提升响应速度
7. 资源 lazy-load：对于带滚动条的首页，设置监听滚动条的事件，用户向下滑动时实时监听元素可视性再去获取资源，减少请求次数

### 异步请求时机

ajax 请求虽然是异步的，但返回值回填 html 触发 reflow 和 repaint 是不可避免的

如果页面加载尚未完成就发送请求，请求返回后如果页面如果还没加载完成，势必会再次 reflow，滞后页面加载完成时间

所以应该尽量确保页面加载渲染完成后再发送请求

对于大部分前端框架而言，应采取的方案是：在组件生命周期 mounted 中调用 ajax 请求

## 交互优化之防抖节流

防抖和节流的方案是为了解决短时间内大量触发某函数而导致的性能问题，比如触发频率过高导致响应速度跟不上触发频率，出现延迟、假死或卡顿的现象

### Debounce 防抖

定义：在事件被触发 N 秒后再执行回调函数，如果在这 N 秒内又被触发，则重新计时。简单来说就是在限定时间内多次触发的事件，只有最后一次会生效

适用场景：限制用户高频操作、重复请求

以下是鼠标点击防抖的 demo

::: normal-demo 鼠标点击防抖

```css
.box {
  width: 100px;
  min-height: 100px;
  border: 1px solid #000;
}
```

```html
<button class="btn">点我</button>
<div class="box">1</div>
```

```js
function debounce(fn, delay) {
  let timer = null;
  return (args) => {
    clearTimeout(timer);
    timer = setTimeout(fn.bind(this, args), delay);
  };
}

function add() {
  const box = document.querySelector(".box");
  box.innerText++;
}

const debounceAdd = debounce(add, 1000);
const btn = document.querySelector(".btn");
btn.onclick = debounceAdd;
```

:::

### Throttle 节流

定义：在一个限定时间内，只能有一次触发事件的回调函数执行。简单来说就是限定时间多次触发事件，只有第一次会生效

适用场景：使交互操作频率固定、虚拟滚动监听、搜索联想

以下是鼠标点击节流的 demo

::: normal-demo 鼠标点击节流

```css
.box {
  width: 100px;
  min-height: 100px;
  border: 1px solid #000;
}
```

```html
<button class="btn">点我</button>
<div class="box">1</div>
```

```js
function throttle(fn, delay) {
  let timer = null;
  return (args) => {
    if (timer) return;
    timer = setTimeout(() => {
      fn.apply(this, args);
      timer = null;
    }, delay);
  };
}

function add() {
  const box = document.querySelector(".box");
  box.innerText++;
}

const throttleAdd = throttle(add, 1000);
const btn = document.querySelector(".btn");
btn.onclick = throttleAdd;
```

:::

### 防抖节流结合

防抖和节流也可以结合起来使用，创造一个限定单位时间内，只有第一次和最后一次操作生效的场景

::: normal-demo 防抖节流结合

```css
.box {
  width: 100px;
  min-height: 100px;
  border: 1px solid #000;
}
```

```html
<button class="btn">点我</button>
<div class="box">1</div>
```

```js
function mixin(fn, delay) {
  let last = null;
  let timer = null;
  return (args) => {
    // now为第一次点击时生成的当前时间，随后每次点击都是最新时间
    let now = Date.now();
    if (last && last + delay >= now) {
      // last时间 + 延时 的时间量大于当前时间，说明已经执行过一次fn了，设置防抖
      clearTimeout(timer);
      timer = setTimeout(() => {
        // 执行完单位时间内最后一次fn，将最后执行时间置为首次点击的now时间，作为一次生效的时间刻度点
        last = now;
        fn.apply(this, args);
      }, delay);
    } else {
      // 第一次点击或后续delay时间外的点击才会进入else，将最后执行时间只为now，手动调用fn
      last = now;
      fn.apply(this, args);
    }
  };
}

function add() {
  const box = document.querySelector(".box");
  box.innerText++;
}

const mixinAdd = mixin(add, 2000);
const btn = document.querySelector(".btn");
btn.onclick = mixinAdd;
```

:::

这里创建两处闭包，last 和 timer 是外层闭包变量，now 是内层 setTimeout 内的闭包变量

将整个时间看成一个数组维度，now 是时间数组的快指针，last 是时间数组的慢指针，事件的触发就是 last 带着一个延伸长度的 delay 不断追赶 now 的位置，这样比较好理解

## 资源预加载

注意，下述属性都是基于`<link>`标签谈论的加载手段

### preload

preload 是浏览器的一种高优先级预加载资源模式，它的作用是将资源率先加载，然后等到需要的时候再去使用，是一种资源的加载和解析解耦的方法。它有如下特点：

1. 具有优先级，但是并不会阻塞 onload 事件：preload 在网页中具有强制加载的功能，所以它的加载具有优先级，但并不会执行，最后还是需要 script 进行加载
2. 它设计的目的是为当前页面的资源进行预加载，跳转页面的时候不会用到
3. 使用 as 字段来进行设定优先级，优先级顺序为：HTML/CSS > Images > JS

```html
<!-- 资源预加载 -->
<link rel="preload" href="image.png" />
<!-- img标签获取图片资源 -->
<img src="image.png" />
```

```html
<!-- Via markup -->
<link rel="preload" href="/css/mystyles.css" as="style" />
<!-- Via JavaScript -->
<script>
  var res = document.createElement("link");
  res.rel = "preload";
  res.as = "style";
  res.href = "css/mystyles.css";
  document.head.appendChild(res);
</script>
```

### prefetch

prefetch 是一个低优先级的资源模式，它允许浏览器在后台（空闲时间）提取以后可能需要的资源，并将其存储在浏览器的缓存中。它更关注的是网页初始化完毕后进行加载的资源，或者打开另外一个网页的时候加载的资源。注意 prefetch 加载跨域资源的时候需要附加 crossorigin 字段。它的特点有：

- 它可能是一件坏事，因为加载的内容可能并不会用到
- 利用空闲时间进行加载
- 实现加载和解析相反的功能

```html
<link rel="prefetch" href="/uploads/images/pic.png" />
<link rel="dns-prefetch" href="//fonts.googleapis.com" />
```

相比于 preload，prefetch 可能并不是一个好的选择。在大多数 SPA 项目中，我们通常都会删除掉 prefetch 配置

```js
// vue.config.js
module.exports = {
  chainWebpack: (config) => {
    // when there are many pages, it will cause too many meaningless requests
    config.plugins.delete("prefetch");
  },
};
```

### preload 与 prefetch 对比

这两个概念容易混淆，中场做个对比：

- prefetch 是低优先级的预加载，是对用户接下来可能使用到的资源预先进行下载
- preload 是高优先级的预加载，或者说是预下载，本质上是影响资源的加载顺序，把页面中可能后置下载的资源前置下载，后面需要调取资源的时候就免去了下载步骤

### dns-prefetch

dns-prefetch 允许浏览器在用户浏览时在后台执行 DNS 查找，这最大限度地减少了延迟，预先省去了 DNS 解析的时间，同时也可用于重定向背后的资源

注意：DNS 请求在带宽方面非常小，但延迟可能会相当高，尤其是在移动网络上。因此 prefetch
非常适合在手机端使用

### prerender

prerender 顾名思义，就是提前渲染。这是一个非常“重”的操作，浏览器会预先完成资源加载、执行并渲染，在需要时立刻调出

主要应用场景在预渲染下一个 html 导航目标，即其他 html 页面内容的快速切换展示

由于非常消耗资源和算力，在大部分项目尤其是 SPA 下，基本没有应用场景

### preconnect

preconnect 可以提前建立连接，其实也就是比 dns-prefetch 多走了两步，除了完成 dns 解析域名之外，还完成了 TCP 三次握手、TLS 握手（https 协议下），相比 dns-prefetch 更进一步减少了延迟时间

使用场景基本同 dns-prefetch

## 脚本解析

注意

- 下述属性都是基于`<script>`标签谈论的解析手段
- async 和 defer 属性仅对带 src 的 script 外链有效，内联脚本无效

![script解析顺序](https://misaka10032.oss-cn-chengdu.aliyuncs.com/performance/script-loader.png)

```html
<script src="script.js"></script>
<script async src="script.js"></script>
<script defer src="myscript.js"></script>
```

默认情况下的 script 加载就不必说了，整个加载和执行都会阻塞主进程，执行完毕后解析过程才会继续

### async

script 资源携带 async，资源加载和 html 渲染并行进行，等到异步 js 资源加载完毕后执行 js 阻塞渲染步骤，等到 js 执行完毕后未完成的渲染步骤才继续进行

它的作用是能够异步的加载和执行脚本，不因为加载脚本而阻塞页面的加载。一旦加载到就会立刻执行

适用场景：与其他 js 不相关、与 dom 渲染无耦合的文件，比如`iconfont.js`

### defer

script 资源携带 defer，资源加载和 html 渲染并行进行，但资源加载完成后不会立刻执行，等到所有元素解析完成后，DOMContentLoaded 事件触发之前执行脚本

它的作用是即使 script 放在 head 里面，它也会在 html 页面解析完毕之后再去执行，也就是类似于把这个 script 放在了页面底部

适用场景：与其他 js 不相关，需要 dom 节点渲染完成后执行的文件，如数据埋点、DOM 渲染脚本

### 相同点

- 加载文件时不阻塞页面渲染
- 对于 inline 的 script 无效
- 使用这两个属性的脚本中不能调用 document.write 方法
- 在 DOMContentLoaded 出发前执行，所以脚本中可以存在 onload 的事件回调

### 不同点

async：异步加载，执行时阻塞 DOM 解析，且执行顺序是无序的，谁先加载完谁先执行。可能在 DOMContentLoaded 事件之前也可能在其之后，但一定在 onload 事件之前执行

defer：异步加载，在页面解析完成，DOMContentLoaded 事件触发前执行，执行时不阻塞 DOM 解析

### 事件补充

DOMContentLoaded 和 onload 事件

- 当 onload 事件触发时，页面全部加载完成包括图片
- 当 DOMContentLoaded 事件触发时，仅 DOM 渲染完成，图片视频可能还没加载完
