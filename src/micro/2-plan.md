---
title: 微前端方案
order: 2
category: false
tag:
  - 微前端方案
---

参考链接 1：https://juejin.cn/post/6844904162509979662

参考链接 2：https://blog.csdn.net/weixin_43522687/article/details/106750074

## 实现方案

单纯根据对概念的理解，很容易想到实现微前端的重要思想就是将应用进行拆解和整合，通常是一个父应用加上一些子应用，那么使用类似 Nginx 配置不同应用的转发，或是采用 iframe 来将多个应用整合到一起等等这些其实都属于微前端的实现方案，也是微前端概念出现前 web 应用之间的整合方案。除此之外，也有真正全新的实现方案：

**Nginx 路由转发**：通过 Nginx 配置反向代理来实现不同路径映射到不同应用，例如：`www.xxx.com/app1`映射 app1，`www.xxx.com/app2`映射到 app2，这种**整合方案**并不属于前端层面的改造，更多的是运维的配置

**iframe 嵌套**：父应用单独是一个页面，每个子应用嵌套一个 iframe，父子通信可采用 postMessage 或者 contentWindow 等方式

**Web Components**：全新的开发模式，每个子应用需要采用纯 Web Components 技术编写组件。每个子应用都拥有单独的 js 和 css，支持单独部署

**组合式应用路由分发**：每个子应用独立构建和部署，运行时由父应用来进行路由管理，应用加载、启动、卸载以及通信等

| 方案               | 优点                                               | 缺点                                                                                               |
| :----------------- | :------------------------------------------------- | :------------------------------------------------------------------------------------------------- |
| Nginx 转发         | 简单，快速，易配置                                 | 在切换应用时会触发浏览器刷新，影响体验                                                             |
| iframe 嵌套        | 实现简单，子应用之间自带沙箱，天然隔离，互不影响   | iframe 的样式显示、兼容性都很局限；太过简单而显得 low                                              |
| Web Components     | 每个子应用拥有独立的 script 和 css，也可单独部署   | 对于历史系统，改造成本高，子应用通信较为复杂，易踩坑                                               |
| 组合式应用路由分发 | 纯前端改造，体验良好，可无感知切换，子应用相互隔离 | 需要设计和开发，由于父子应用处于同一页面运行，需要解决子应用的样式冲突、变量污染、通信机制等技术点 |

上述方案中，每种都有自己的优劣，最原始的 Nginx 配置反向代理是从接入层的角度来将系统进行分离，但是需要运维配置，而 iframe 嵌套是最简单和最快速的方案，但是 iframe 的弊端也是无法避免的，而 Web Components 的方案则需要大量的改造成本，最后的组合式应用路由分发方案改造成本中等并且能满足大部分需求，也不影响各前端应用的体验，**是当下各个业务普遍采用的一种方案**

下面，围绕组合式应用路由分发方案，分析一下这个方案的五脏六腑

## 模块组成

组合式应用路由分发方案的核心是“主从思想”，即一个基座（MaiApp）和若干个微应用（MicroApp）

基座应用大多数是一个前端 SPA 项目，主要负责应用注册、路由映射、消息下发等

微应用是独立前端项目，这些项目不限于采用 React、Vue、Angular 甚至 JQuery 开发。每个微应用注册到基座应用中，由基座进行管理，但是如果脱离基座也可以单独访问

![微前端模块图](https://misaka10032.oss-cn-chengdu.aliyuncs.com/MicroApp/microapp-module.png)

当整个微前端框架运行之后，给用户的体验就是类似下图所示：

![微前端运行效果](https://misaka10032.oss-cn-chengdu.aliyuncs.com/MicroApp/microapp-runtime.png)

简而言之，就是基座应用中有一些菜单项，每个菜单项可以展示对应的微应用，这些应用的切换对用户而言是无感知的，就用户体验来说是很好的。而为了实现多应用正常运行，基座应用有以下问题亟待解决：

1. 路由切换如何准确分发
2. 主微应用的全局环境如何隔离
3. 通信问题

## 路由分发

![微前端运行效果](https://misaka10032.oss-cn-chengdu.aliyuncs.com/MicroApp/microapp-route.png)

从上图可知，子应用在加载前会创建基于自身的生命周期实例和路由，然后注册到主工程中，当页面 URL 跳转时，通过路由管理器和应用管理器匹配子应用，在加载子应用的过程中，有三个生命周期，bootstrap 是初始化，这个时候页面显示 loading，也就是正在加载中，然后走到 mount，开始加载页面，不需要显示当前子应用时，通过 unmount 卸载子应用

实现基座应用获取子应用的核心是 systemJS 和 Single-SPA

![微前端远程技术](https://misaka10032.oss-cn-chengdu.aliyuncs.com/MicroApp/microapp-remoteTool.png)

- systemJS：提供通用的模块导入途经，支持传统模块和 ES6 的模块，相当于加载器，主要用于调度子应用，决定何时展示哪个子应用
- Single-SPA：把现有的应用进行包装，使加载器可以使用它们

### 远程拉取

SystemJS 的本质就是 jsonp 跨域脚本获取资源

```js
// 外层包裹promise
const script = document.createElement("script");
script.charset = "utf-8";
script.async = true;
script.crossorigin = "anonymous";
script.addEventListener("error", function () {
  window.removeEventListener("error", windowErrorListener);
  reject(
    Error(
      "Error loading" + url + (firstParentUrl ? "from " + firstParentUrl : "")
    )
  );
});
script.addEventListener("load", function () {
  window.removeEventListener("error", windowErrorListener);
  document.head.removeChild(script);
  if (err) {
    reject(err);
  } else {
    resolve(loader.getRegister());
  }
});
script.src = url;
document.head.appendChild(script); // 挂载script加载远程资源
```

### 路由注册

Single-SPA 主要做两件事：注册路由以及应用；注册的应用按照 ES Module 模块载入规范导出

```js
return Promise.resolve().then(() => {
  const loadPromises = getAppsToLoad().map(toLoadPromise);

  if (loadPromises.length > 0) {
    wasNoOp = false;
  }

  return Promise.all(loadPromises)
    .then(finishUpAndReturn)
    .catch((err) => {
      callAllEventListeners();
      throw err;
    });
});
```
