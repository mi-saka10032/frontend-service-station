---
title: 交互优化
order: 2
category: false
tag:
  - 网络协议
  - URL解析过程
  - 页面加载优化
  - 界面交互优化
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

输入 URL 后，最先执行的是 DNS 解析，通过 DNS 将域名解析成 IP 地址。在解析过程中，按照 浏览器缓存、系统缓存、路由器缓存、DNS 缓存、根域名服务器、顶级域名服务器、主域名服务器的顺序，逐步读取缓存，直到拿到 IP 地址

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

![服务器处理请求](https://misaka10032.oss-cn-chengdu.aliyuncs.com/performance/server.jpg)

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

减少单纯的 repaint 的方法就是避免逐条修改 DOM 样式

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
