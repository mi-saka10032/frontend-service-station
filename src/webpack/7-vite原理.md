---
title: Vite原理
order: 7
category: false
tag:
  - Vite
  - 冷启动原理
  - 热更新原理
---

Vite 在 dev 模式下执行的是 ESBuild 编译，build 时使用 rollup 编译。除了 Vite 把 loader 概念同化为 plugin 之外，其运作流程与 Webpack 基本类似，详见[Webpack 原理](./4-webpack原理.html)

## 冷启动链路

现在分析执行 vite 命令后 vite 的启动流程

参考链接：https://blog.csdn.net/qq_40716795/article/details/122975260

### 命令解析

这部分代码在 src/node/cli.ts 里，主要内容是借助 minimist —— 一个轻量级的命令解析工具解析 npm scripts，解析的函数是 resolveOptions ，精简后的代码片段如下

```ts
function resolveOptions() {
  // command 可以是 dev/build/optimize
  if (argv._[0]) {
    argv.command = argv._[0];
  }
  return argv;
}
```

拿到 options 后，会根据 options.command 的值判断是执行在开发环境需要的 runServe 命令或生产环境需要的 runBuild 命令

```ts
if (!options.command || options.command === "serve") {
  runServe(options);
} else if (options.command === "build") {
  runBuild(options);
} else if (options.command === "optimize") {
  runOptimize(options);
}
```

在 runServe 方法中，执行 server 模块的创建开发服务器方法，同样在 runBuild 中执行 build 模块的构建方法

### runServe

这部分代码在 src/node/server/index.ts 里，主要暴露一个 createServer 方法。

vite 使用 koa 作 web server，使用 clmloader 创建了一个监听文件改动的 watcher，同时实现了一个插件机制，将 koa-app 和 watcher 以及其他必要工具组合成一个 context 对象注入到每个 plugin 中

![ViteContext](https://misaka10032.oss-cn-chengdu.aliyuncs.com/Webpack/vite-context.png)

### plugin

plugin 依次从 context 里获取上面这些组成部分，有的 plugin 在 koa 实例添加了几个 middleware，有的借助 watcher 实现对文件的改动监听，这种插件机制带来的好处是整个应用结构清晰，同时每个插件处理不同的事情，职责更分明

默认的 plugin 有：

- 用户注入的 plugins —— 自定义 plugin

- hmrPlugin —— 处理 hmr

- htmlRewritePlugin —— 重写 html 内的 script 内容

- moduleRewritePlugin —— 重写模块中的 import 导入

- moduleResolvePlugin ——获取模块内容

- vuePlugin —— 处理 vue 单文件组件

- esbuildPlugin —— 使用 esbuild 处理资源

- assetPathPlugin —— 处理静态资源

- serveStaticPlugin —— 托管静态资源

- cssPlugin —— 处理 css/less/sass 等引用

所以，plugin 在开发模式下的运行机制实际上就是 koa 的中间件；在生产模式下则略有不同，它们是作为 rollup 打包的 plugin

### ESM

Vite 借助浏览器对 ES Module 的支持，让浏览器直接引入模块化文件

打开运行中的 Vite 项目，访问 view-source 可以发现 html 里面的代码是这样的：

```html
<script type="module">
  import { createApp } from "/@modules/vue";
  import App from "/App.vue";
  createApp(App).mount("#app");
</script>
```

可获知的消息，浏览器环境从：

1. `/@modules/vue` 中获取 createApp 这个方法
2. `App.vue` 中获取应用组件入口
3. 使用 createApp 创建应用并挂载节点

而这样做达成的效果是：

1. 去掉了打包步骤
2. 实现按需加载模块文件

#### 去掉打包步骤

原本 Webpack 打包的概念是将各个模块集合在一起形成 bundle，以一定规则读取模块代码——以便在不支持模块化的浏览器中使用。在开发环境下，bundle 文件处在内存中，生产环境是静态的 js 文件

为了在浏览器里加载各个模块，Webpack 会使用 map 存放模块 id 和路径，使用`__webpack_require__`方法获取模块导出

Vite 利用浏览器支持 ESM 这一点，省略了这一步，自然就不需要生成 bundle，因此打包这一步就省略了

#### 实现按需打包

因为打包过程是静态的，不管某个模块的代码是否执行到，执行打包到这个模块的时候，都会打包进 bundle 中，因此项目越来越大 bundle 也会越来越大

而 Vite 直接使用 ESM，在上文提到的 runServer 中，通过 koa 服务器劫持本地资源内容返回到服务器，让浏览器按需获取模块内容

### 返回编译模块

在上面的 ESM 中，我们从浏览器引入了`/@modules/vue`这个 node_modules 中的 vue 依赖，以及`/App.vue`这个组件

下一步，在下一个 koa 的 middleware 中

1. 用正则匹配到路径上带有`@modules`的资源，再通过`require('xxx')`的形式拿到依赖的导出返回给浏览器
2. 匹配路径上带有`.vue`的资源，使用 vuePlugin 处理，执行模板编译后导出返回给浏览器

中间步骤暂时省略（详见[参考链接](https://blog.csdn.net/qq_40716795/article/details/122975260)），我们直接看最后导出的代码：

```js
import { updateStyle } from "/vite/hmr";
updateStyle("c44b8200-0", "/App.vue?type=style&index=0");
__script.__scopeId = "data-v-c44b8200";
import { render as __render } from "/App.vue?type=template";
__script.render = __render;
__script.__hmrId = "/App.vue";
__script.__file = "/Users/muou/work/playground/vite-app/App.vue";
export default __script;
```

所以一个 Vue 文件最后返回到浏览器的响应结果是分次返回的

![Vite浏览器导入App.vue](https://misaka10032.oss-cn-chengdu.aliyuncs.com/Webpack/vite-import-Appvue.png)

到这里，冷启动的步骤就算结束了。接下来，是浏览器结合之前导入的 vue.js 和分拆的 App.vue 的代码，执行 Vue 的实例化并挂载组件的时间了

## 热更新

一般来说，通用的热更新实现分四步：

1. 打通 web 框架，让模块支持 rerender/reload
2. 通过 watcher 监听文件改动
3. 通过 server 端编译资源，推送新模块内容给 client
4. client 收到新的模块内容，执行 rerender/reload

### client

在客户端，Vite 开启了 WebSocket 监听了一些更新的类型，然后分别处理，分别是：

- vue-reload —— vue 组件更新：通过 import 导入新的 vue 组件，然后执行 HMRRuntime.reload

- vue-rerender —— vue template 更新：通过 import 导入新的 template ，然后执行 HMRRuntime.rerender

- vue-style-update —— vue style 更新：直接插入新的 stylesheet

- style-update —— css 更新：document 插入新的 stylesheet

- style-remove —— css 移除：document 删除 stylesheet

- js-update —— js 更新：直接执行

- full-reload —— 页面 roload：使用 window.reload 刷新页面

### server

在 server 端，通过之前说过的已开启的 watcher 监听项目结构、内容改动，根据文件类型判断是 js Reload 还是 vue Reload

```js
watcher.on("change", async (file) => {
  const timestamp = Date.now();
  if (file.endsWith(".vue")) {
    handleVueReload(file, timestamp);
  } else if (
    file.endsWith(".module.css") ||
    !(file.endsWith(".css") || cssTransforms.some((t) => t.test(file, {})))
  ) {
    // everything except plain .css are considered HMR dependencies.
    // plain css has its own HMR logic in ./serverPluginCss.ts.
    handleJSReload(file, timestamp);
  }
});
```

在 handleVueReload 方法里，会使用解析器拿到当前文件的 template/script/style ，并且与缓存里的上一次解析的结果进行比较，如果 template 发生改变就执行 vue-rerender，如果 style 发生改变就执行 vue-style-update，简化后的逻辑如下

```js
async function handleVueReload(
    file
    timestamp,
    content
  ) {
    // 获取缓存
    const cacheEntry = vueCache.get(file)

    // 解析 vue 文件
    const descriptor = await parseSFC(root, file, content)
    if (!descriptor) {
      // read failed
      return
    }
    // 拿到上一次解析结果
    const prevDescriptor = cacheEntry && cacheEntry.descriptor

    // 设置刷新变量
    let needReload = false // script 改变标记
    let needCssModuleReload = false // css 改变标记
    let needRerender = false // template 改变标记

    // 判断 script 是否相同
    if (!isEqual(descriptor.script, prevDescriptor.script)) {
      needReload = true
    }

     // 判断 template 是否相同
    if (!isEqual(descriptor.template, prevDescriptor.template)) {
      needRerender = true
    }

    // 通过 send 发送 socket
    if (needRerender){
      send({
        type: 'vue-rerender',
        path: publicPath,
        timestamp
      })
    }
  }
```

handleJSReload 方法则是根据文件路径引用，判断被哪个 vue 组件所依赖，如果未找到 vue 组件依赖，则判断页面需要刷新，否则走组件更新逻辑
