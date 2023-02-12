---
title: VueCli服务端渲染指南
order: 3
category: false
tag:
  - VueCli
  - 服务端渲染
---

这份是 VueCli 官方提供的服务端渲染指南

## 什么是服务端渲染

Vue.js 是一个构建客户端应用的框架。默认情况下，作为其输出，Vue 组件会在浏览器中生产并封装 DOM。然而，我们也可以在服务器端把同样的组件渲染成 HTML 字符串，然后直接将其发送给浏览器，并最终将静态标记“激活”为完整的、可交互的客户端应用。

一个服务端渲染的 Vue.js 应用也可以被认为是“同构的”或“通用的”。这意味着应用代码的主体可以同时运行在“服务端”和“客户端”。

### 为什么选择 SSR

较之于一个传统的 SPA (单页面应用)，SSR 主要的好处是：

- 更好的搜索引擎优化 (SEO)。因为搜索引擎爬虫会直接读取完整的渲染出来的页面。

  注意，目前 Google 和 Bing 已经可以很好地为同步加载的 JavaScript 应用建立索引。在这里同步加载是关键。如果应用起始状态只是一个加载中的效果，而通过 API 调用获取内容，则爬虫不会等待页面加载完成。这意味着如果你的页面有异步加载的内容且 SEO 很重要，那么你可能需要 SSR。

- 更快的内容呈现，尤其是网络连接缓慢或设备运行速度缓慢的时候。服务端标记不需要等待所有的 JavaScript 都被下载并执行之后才显示，所以用户可以更快看到完整的渲染好的内容。这通常会带来更好的用户体验，同时对于内容呈现时间和转化率呈正相关的应用来说尤为关键。

这里有一些是否选用 SSR 的取舍因素：

- **开发一致性**。浏览器特有的代码只能在特定的生命周期钩子中使用；一些外部的库在服务端渲染应用中可能需要经过特殊处理。
- **需要更多的构建设定和部署要求**。不同于一个完全静态的 SPA 可以部署在任意的静态文件服务器，服务端渲染应用需要一个能够运行 Node.js 服务器的环境。
- **更多的服务端负载**。在 Node.js 中渲染一个完整的应用会比仅供应静态文件产生更密集的 CPU 运算。所以如果流量很高，请务必准备好与其负载相对应的服务器并采取明智的缓存策略。

在应用中使用 SSR 之前，你需要问自己的第一个问题是：你是否真的需要它？它通常是由内容呈现时间对应用的重要程度决定的。例如，如果你正在搭建一个内部管理系统，几百毫秒的初始化加载时间对它来说无关紧要，这种情况下就没有必要使用 SSR。然而，如果内容呈现时间非常关键，SSR 可以助你实现**最佳的初始加载性能**。

### SSR vs SPR

如果你仅希望通过 SSR 来改善一些推广页面 (例如 `/`、`/about`、`/contact` 等) 的 SEO，那么**预渲染**也许会更合适。和使用动态编译 HTML 的 web 服务器相比，预渲染可以在构建时为指定的路由生成静态 HTML 文件。它的优势在于预渲染的设置更加简单，且允许将前端保持为一个完全静态的站点。

如果你正在使用 [webpack](https://webpack.js.org/)，你可以通过 [prerender-spa-plugin](https://github.com/chrisvfritz/prerender-spa-plugin) 来支持预渲染。该插件已经被大量的 Vue 应用检验过。

### 关于该指南

该指南会非常深入，且假设你已经熟悉了 Vue.js 本身，且具有一定的 Node.js 和 webpack 知识和经验。

如果你更倾向于高层级的、提供顺滑的开箱即用体验的解决方案，也许可以试试 [Nuxt.js](https://nuxtjs.org/)。它使用相同的 Vue 技术栈构建，但将许多引用抽象化了，且提供了一些额外的特性，例如静态站点生成。然而，如果你需要对应用的结构有更直接的控制，它也许就不适合了。无论如何，通读本指南，更好地理解事物之间是如何协同工作的，仍然是有益的。

最后，注意该指南的方案并不是最终方案——我们觉得它已经适合我们，但不意味着没有改进空间。它们将来也可能被修订——欢迎大家通过 pull request 来参与贡献！

## 起步

### 安装

需要额外安装

```shell
npm install @vue/server-renderer
yarn add @vue/server-renderer
```

**注意**

- 推荐使用的 Node.js 版本是 12+。
- `@vue/server-renderer` 和 `vue` 的版本号必须匹配。
- `@vue/server-renderer` 依赖一些 Node.js 的原生模块，因此只能在 Node.js 中使用。我们未来可能会提供一个更简单的、可运行在其它 JavaScript 运行时中的构建版本。

### 渲染一个 Vue 应用

```js
const { createSSRApp } = require("vue");

const app = createSSRApp({
  data() {
    return {
      user: "John Doe",
    };
  },
  template: `<div>Current user is: {{ user }}</div>`,
});
```

使用 `renderToString` 函数将我们的应用实例渲染为一个字符串。此函数返回一个 Promise 来解析渲染出的 HTML

```js
const { createSSRApp } = require("vue");
const { renderToString } = require("@vue/server-renderer");

const app = createSSRApp({
  data() {
    return {
      user: "John Doe",
    };
  },
  template: `<div>Current user is: {{ user }}</div>`,
});

const appContent = await renderToString(app);
```

### 服务器集成

使用 express 运行应用

```shell
npm install express
yarn add express
```

server.js

```js
const { createSSRApp } = require("vue");
const { renderToString } = require("@vue/server-renderer");
const server = require("express")();

server.get("*", async (req, res) => {
  const app = createSSRApp({
    data() {
      return {
        user: "John Doe",
      };
    },
    template: `<div>Current user is: {{ user }}</div>`,
  });

  const appContent = await renderToString(app);
  const html = `
  <html>
    <body>
      <h1>My First Heading</h1>
      <div id="app">${appContent}</div>
    </body>
  </html>
  `;

  res.end(html);
});

server.listen(8080);
```

现在，当运行这段 Node.js 脚本的时候，我们可以在 `localhost:8080` 看到一个静态的 HTML 页面。然而，这段代码是未激活的：Vue 还没有将这段发送自服务器的静态 HTML 转换为能够响应客户端数据变化的动态 DOM。这部分会在[客户端激活](https://v3.cn.vuejs.org/guide/ssr/hydration.html) 章节中涵盖。

## 编写通用代码

——同时运行在服务端和客户端的代码，因为用例及平台 API 的不同，运行于不同环境下的代码行为也会不尽相同。

### 服务端的数据响应性

在仅针对客户端的应用中，每个用户都在各自的浏览器中使用一个干净的应用实例。对于服务端渲染来说我们也希望如此：每个请求应该拥有一个干净的、相互隔离的应用实例，以避免跨请求的状态污染。

因为实际的渲染过程需要确定性，我们也会从服务器“预获取”数据——这意味着应用状态在我们开始渲染之前已经被解析好了。这也意味着**数据响应性在服务端不是必要的**，因此**它默认是不开启的**。**禁用数据响应性**也**避免**了将数据转换为响应式对象的**性能损耗**。

### 组件声明周期钩子

因为这里没有动态更新，唯一会在 SSR 过程中被调用的[生命周期钩子](https://v3.cn.vuejs.org/guide/instance.html#生命周期钩子)是 `beforeCreate` 和 `created`。这意味着其它生命周期钩子 (如 `beforeMount` 或 `mounted`) 中的任何代码将只会在客户端执行。

另一个值得注意的是你应该避免代码在 `beforeCreate` 或 `created` 中产生全局的副作用，例如通过 `setInterval` 设置定时器。在仅针对客户端的代码中，我们可以设置定时器，然后在 `beforeUnmount` 或 `unmounted` 时撤掉。然而，因为销毁相关的钩子在 SSR 过程中不会被调用，这些定时器就会永久地保留下来。为了避免这种情况，请把副作用代码移至 `beforeMount` 或 `mounted` 以代之。

### 访问特定平台的 API

通用的代码不能假设能够访问特定平台的 API，因此，如果你的代码直接使用了只存在于浏览器中的全局变量，例如 `window` 或 `document`，它们在 Node.js 中执行的时候将抛出错误。反之亦然。

对共享于服务端和客户端之间但使用不同平台 API 的任务来说，我们推荐把这些特定平台的实现包裹在一个通用的 API 里，或使用现有的库来替你做这件事。例如 [axios](https://github.com/axios/axios) 是一个在服务端和客户端暴露相同 API 的 HTTP 客户端。

对于只存在于浏览器中的 API 来说，通常的建议是晚些时候在针对客户端的生命周期钩子中访问。

### 自定义指令

大多数[自定义指令](https://v3.cn.vuejs.org/guide/custom-directive.html#自定义指令)都会直接操作 DOM，这会导致 SSR 过程发生错误。所以我们推荐使用组件这种抽象机制替代指令。

## 源码结构

### 避免有状态的单例模式

当编写仅针对客户端的代码时，我们可以假设代码每次都会运行在一个干净的上下文中。然而，Node.js 服务器是长期运行的进程。当代码第一次被导入进程时，它会被执行一次然后保留在内存里。也就是说如果你创建了一个单例对象，它将共享于每次发来的请求之间，并带有跨请求的状态污染风险。

```js
// 反面例子
import app from "./app.js";

server.get("*", async (req, res) => {
  // 应用现在是在所有用户之间共享的
  const result = await renderToString(app);
  // ...
});
```

```js
// 正面例子
function createApp() {
  return createSSRApp(/* ... */);
}

server.get("*", async (req, res) => {
  // 每个用户拥有自己的应用
  const app = createApp();
  const result = await renderToString(app);
  // ...
});
```

因此，我们需要**为每个请求创建一个新的 Vue 根实例**。为了做到这一点，我们需要编写一个工厂函数来重复地执行，并为每个请求创建干净的应用实例。

```js
// server.js
const { createSSRApp } = require("vue");
const { renderToString } = require("@vue/server-renderer");
const express = require("express");

const server = express();

function createApp() {
  return createSSRApp({
    data() {
      return {
        user: "John Doe",
      };
    },
    template: `<div>Current user is: {{ user }}</div>`,
  });
}

server.get("*", async (req, res) => {
  const app = createApp();

  const appContent = await renderToString(app);
  const html = `
  <html>
    <body>
      <h1>My First Heading</h1>
      <div id="app">${appContent}</div>
    </body>
  </html>
  `;

  res.end(html);
});

server.listen(8080);
```

同理其它实例 (诸如**router**或 **store**) 也是一样的。不要从一个模块直接导出路由器或 store 并将它们导入应用，取而代之的是，每次有新的请求发起时都在 `createApp` 中创建一个干净的实例并从这个 Vue 根实例注入它

### 介绍构建步骤

基本的想法是，使用 webpack 同时打包客户端和服务端应用。服务端的包会被引入到服务端用来渲染 HTML，同时客户端的包会被送到浏览器用于激活静态标记。

### 使用 webpack 的目录结构

#### 简单的项目结构

```sh
src
├── components
│   ├── MyUser.vue
│   └── MyTable.vue
├── App.vue # 应用的根节点
├── entry-client.js # 只在浏览器中运行
└── entry-server.js # 只在服务器运行
```

#### App.vue

不再赘述

#### entry-client.js

此客户端入口会使用 `App.vue` 创建应用并挂载到 DOM

```js
import { createSSRApp } from "vue";
import App from "./App.vue";

// 针对客户端的启动逻辑......

const app = createSSRApp(App);

// 这里假设 App.vue 模板的根元素有 `id="app"`
app.mount("#app");
```

#### entry-server.js

服务端入口使用了一个默认导出，它是一个可以在每次渲染的过程中重复调用的函数。目前，除了返回应用实例，它并不会做其它事情——但稍后我们会在这里处理服务端路由匹配和数据预获取逻辑。

```js
import { createSSRApp } from "vue";
import App from "./App.vue";

export default function () {
  const app = createSSRApp(App);

  return {
    app,
  };
}
```

## 构建配置

### 和客户端构建版本的关键不同

1. 我们需要为服务端代码创建一个 [webpack manifest](https://webpack.js.org/concepts/manifest/)。这是一个让 webpack 追踪所有的模块如何对应到生成的包中的 JSON 文件。
2. 我们应该[将应用依赖变为外部扩展](https://webpack.js.org/configuration/externals/)。这使得服务端构建版本更加快速并生成更小的包文件。做这件事的时候，我们需要把交给 webpack 处理的依赖 (如 `.css` 或 `.vue` 文件) 排除在外。
3. 我们需要将 webpack 的[目标](https://webpack.js.org/concepts/targets/)改为 Node.js。这会允许 webpack 以适合于 Node 的方式处理动态导入，同时也告诉 `vue-loader` 在编译 Vue 组件的时候抛出面向服务端的代码。
4. 当构建一个服务端入口时，我们需要定义一个环境变量来指明当前的工作是服务端渲染。在工程的 `package.json` 中加入一些 `scripts` 会很有帮助。

```json
"scripts": {
  "build:client": "vue-cli-service build --dest dist/client",
  "build:server": "SSR=1 vue-cli-service build --dest dist/server",
  "build": "npm run build:client && npm run build:server",
}
```

### 配置示例

以下是一个 `vue.config.js` 的例子，这个例子向一个 Vue CLI 工程加入了服务端渲染，但这也可以适配于任何 webpack 构建版本。

```js
const { WebpackManifestPlugin } = require("webpack-manifest-plugin");
const nodeExternals = require("webpack-node-externals");
const webpack = require("webpack");

module.exports = {
  chainWebpack: (webpackConfig) => {
    // 我们需要禁用 cache loader，否则客户端构建版本会从服务端构建版本使用缓存过的组件
    webpackConfig.module.rule("vue").uses.delete("cache-loader");
    webpackConfig.module.rule("js").uses.delete("cache-loader");
    webpackConfig.module.rule("ts").uses.delete("cache-loader");
    webpackConfig.module.rule("tsx").uses.delete("cache-loader");

    if (!process.env.SSR) {
      // 将入口指向应用的客户端入口文件
      webpackConfig.entry("app").clear().add("./src/entry-client.js");
      return;
    }

    // 将入口指向应用的服务端入口文件
    webpackConfig.entry("app").clear().add("./src/entry-server.js");

    // 这允许 webpack 以适合于 Node 的方式处理动态导入，
    // 同时也告诉 `vue-loader` 在编译 Vue 组件的时候抛出面向服务端的代码。
    webpackConfig.target("node");
    // 这会告诉服务端的包使用 Node 风格的导出
    webpackConfig.output.libraryTarget("commonjs2");

    webpackConfig
      .plugin("manifest")
      .use(new WebpackManifestPlugin({ fileName: "ssr-manifest.json" }));

    // https://webpack.js.org/configuration/externals/#function
    // https://github.com/liady/webpack-node-externals
    // 将应用依赖变为外部扩展。
    // 这使得服务端构建更加快速并生成更小的包文件。

    // 不要将需要被 webpack 处理的依赖变为外部扩展
    // 也应该把修改 `global` 的依赖 (例如各种 polyfill) 整理成一个白名单
    webpackConfig.externals(nodeExternals({ allowlist: /\.(css|vue)$/ }));

    webpackConfig.optimization.splitChunks(false).minimize(false);

    webpackConfig.plugins.delete("preload");
    webpackConfig.plugins.delete("prefetch");
    webpackConfig.plugins.delete("progress");
    webpackConfig.plugins.delete("friendly-errors");

    webpackConfig.plugin("limit").use(
      new webpack.optimize.LimitChunkCountPlugin({
        maxChunks: 1,
      })
    );
  },
};
```

### 关于外部依赖的注意事项

注意在 `externals` 选项中我们将 CSS 文件列入了白名单。这是因为从依赖导入的 CSS 应该被 webpack 处理。如果你导入其它同样需要 webpack 的类型文件 (如 `*.vue`、`*.sass`)，你应该把它们也加入到白名单中。

如果你使用了 `runInNewContext: 'once'` 或 `runInNewContext: true`，那么你也需要把修改 `global` 的 polyfill (如 `babel-polyfill`) 也加入这个白名单。这是因为在使用新上下文模式时，**服务端构建内的代码有其自己的 `global` 对象。**但由于服务端并不真的需要它，所以它从客户端入口被引入更加容易。

### 生成`clientManifest`

对于服务端的包，我们还额外生成一个客户端构建单 (manifest)。有了这个客户端构建单和服务端的包，渲染器现在就同时有了服务端和客户端构建版本的信息。这样它就可以自动推断并向渲染出来的 HTML 中注入 [preload / prefetch 指令](https://css-tricks.com/prefetching-preloading-prebrowsing/)、`<link>` 和 `<script>` 标签。

## 服务器配置

除了介绍过的[代码结构](https://v3.cn.vuejs.org/guide/ssr/structure.html)和 [webpack 配置](https://v3.cn.vuejs.org/guide/ssr/build-config.html)，我们的 Express 服务端代码同样需要改动。

我们需要通过一个构建好的包里的 `entry-server.js` 创建一个应用。在 webpack manifest 里可以找到其路径：

```js
// server.js
const path = require("path");
const manifest = require("./dist/server/ssr-manifest.json");

// 'app.js' 是以入口的名字加上 `.js` 后缀命名的
const appPath = path.join(__dirname, "./dist", "server", manifest["app.js"]);
const createApp = require(appPath).default;
```

我们需要为所有资源定义正确的路径：

```js
// server.js
server.use(
  "/img",
  express.static(path.join(__dirname, "./dist/client", "img"))
);
server.use("/js", express.static(path.join(__dirname, "./dist/client", "js")));
server.use(
  "/css",
  express.static(path.join(__dirname, "./dist/client", "css"))
);
server.use(
  "/favicon.ico",
  express.static(path.join(__dirname, "./dist/client", "favicon.ico"))
);
```

我们需要把 `index.html` 的内容替换为服务端渲染出来的应用内容：

```js
// server.js
const indexTemplate = fs.readFileSync(
  path.join(__dirname, "/dist/client/index.html"),
  "utf-8"
);

server.get("*", async (req, res) => {
  const { app } = createApp();

  const appContent = await renderToString(app);

  const html = indexTemplate
    .toString()
    .replace('<div id="app">', `<div id="app">${appContent}`);

  res.setHeader("Content-Type", "text/html");
  res.send(html);
});
```

**Express 服务器的完整代码**

```js
const path = require("path");
const express = require("express");
const fs = require("fs");
const { renderToString } = require("@vue/server-renderer");
const manifest = require("./dist/server/ssr-manifest.json");

const server = express();

const appPath = path.join(__dirname, "./dist", "server", manifest["app.js"]);
const createApp = require(appPath).default;

server.use(
  "/img",
  express.static(path.join(__dirname, "./dist/client", "img"))
);
server.use("/js", express.static(path.join(__dirname, "./dist/client", "js")));
server.use(
  "/css",
  express.static(path.join(__dirname, "./dist/client", "css"))
);
server.use(
  "/favicon.ico",
  express.static(path.join(__dirname, "./dist/client", "favicon.ico"))
);

server.get("*", async (req, res) => {
  const { app } = createApp();

  const appContent = await renderToString(app);

  fs.readFile(path.join(__dirname, "/dist/client/index.html"), (err, html) => {
    if (err) {
      throw err;
    }

    html = html
      .toString()
      .replace('<div id="app">', `<div id="app">${appContent}`);
    res.setHeader("Content-Type", "text/html");
    res.send(html);
  });
});

console.log("You can navigate to http://localhost:8080");

server.listen(8080);
```

## 路由和代码分离

### 基于`vue-router`的路由

我们的服务端代码使用了一个 `*` 处理函数来接收任意 URL。这允许我们将被访问的 URL 传递给 Vue 应用，并在客户端和服务端之间复用相同的路由配置！

这里推荐使用官方的 [vue-router](https://github.com/vuejs/vue-router-next)。让我们先创建一个路由文件。注意和应用实例类似，每个请求都需要有一个干净的路由实例，因此该文件应该导出一个 `createRouter` 函数

```js
// entry-client.js
import { createSSRApp } from "vue";
import { createWebHistory } from "vue-router";
import createRouter from "./router.js";
import App from "./App.vue";

// ...

const app = createSSRApp(App);

const router = createRouter(createWebHistory());

app.use(router);

// ...
```

```js
// entry-server.js
import { createSSRApp } from "vue";
// 服务器端路由与客户端使用不同的历史记录
import { createMemoryHistory } from "vue-router";
import createRouter from "./router.js";
import App from "./App.vue";

export default function () {
  const app = createSSRApp(App);
  const router = createRouter(createMemoryHistory());

  app.use(router);

  return {
    app,
    router,
  };
}
```

### 代码分离

代码分离、或懒加载部分应用，可以帮助缩减浏览器初始化渲染所需下载的资源的尺寸，并大幅优化大型应用的 TTI (time-to-interactive，可交互时间)。其关键是在初始化首屏的时候“按需加载”。

Vue Router 提供了[懒加载支持](https://next.router.vuejs.org/zh/guide/advanced/lazy-loading.html)，允许 [webpack 在此进行代码分离](https://webpack.js.org/guides/code-splitting-async/)。你仅需要

```js
// 将此处修改……
import MyUser from "./components/MyUser.vue";
const routes = [{ path: "/user", component: MyUser }];

// 成为：
const routes = [
  { path: "/user", component: () => import("./components/MyUser.vue") },
];
```

在客户端和服务端我们都需要等待路由器先解析异步路由组件以合理地调用组件内的钩子。为此我们会使用 [router.isReady](https://next.router.vuejs.org/zh/api/#isready) 方法。让我们来更新客户端入口

```js
// entry-client.js
import { createSSRApp } from "vue";
import { createWebHistory } from "vue-router";
import createRouter from "./router.js";
import App from "./App.vue";

const app = createSSRApp(App);

const router = createRouter(createWebHistory());

app.use(router);

router.isReady().then(() => {
  app.mount("#app");
});
```

我们还需要更新 `server.js` 脚本

```js
// server.js
const path = require("path");

const appPath = path.join(__dirname, "./dist", "server", manifest["app.js"]);
const createApp = require(appPath).default;

server.get("*", async (req, res) => {
  const { app, router } = createApp();

  await router.push(req.url);
  await router.isReady();

  const appContent = await renderToString(app);

  fs.readFile(path.join(__dirname, "/dist/client/index.html"), (err, html) => {
    if (err) {
      throw err;
    }

    html = html
      .toString()
      .replace('<div id="app">', `<div id="app">${appContent}`);
    res.setHeader("Content-Type", "text/html");
    res.send(html);
  });
});
```

## 客户端激活

所谓激活，指的是 Vue 接管由服务端发送的静态 HTML，并使其变为可以响应客户端数据变化的动态 DOM 的过程。

在 `entry-client.js` 中，我们简单地通过这行代码挂载应用

```js
app.mount("#app");
```

Vue 提供了一个 `createSSRApp` 方法用来在客户端代码 (在这个例子中是 `entry-client.js`) 中告诉 Vue 激活现有的静态 HTML，而不是重新创建所有的 DOM 元素。

### 关于激活的注意事项

Vue 会断言客户端生成的虚拟 DOM 树与从服务器渲染出来的 DOM 结构是相匹配的。如果不匹配，则它会放弃激活的过程，抛弃已生成的 DOM 并从头开始渲染。这会在浏览器控制台产生一个警告，但网站还是能正常工作。

### 第一个关键

确保 SSR 工作的第一个关键是确保应用的状态在客户端和服务端一致。密切留意不要依赖浏览器特有的 API (如窗口宽度、设备能力或 localStorage) 或服务器特有的 API (如 Node 内置的)，且留意在不同环境下将输出不同结果的代码 (诸如时区、时间戳、规范化 URL 或生成随机数字)。

### 第二个关键

第二个关键是留意 SSR + 客户端激活时 HTML 的有效性会因浏览器不同而不同。例如在 Vue 模板中编写：

```html
<table>
  <tr>
    <td>hi</td>
  </tr>
</table>
```

浏览器会在 `<table>` 内自动注入 `<tbody>`，然而通过 Vue 生成的虚拟 DOM 并不会包含 `<tbody>`，因此会导致不匹配。为了确保匹配正确，请确保模板中编写的 HTML 是有效的。

**你可以考虑在模板的研发过程中使用诸如 [W3C 标记校验服务](https://validator.w3.org/) 或 [HTML-validate](https://html-validate.org/) 的 HTML 验证器。**
