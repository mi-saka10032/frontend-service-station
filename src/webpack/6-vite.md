---
title: Vite
order: 6
category: false
tag:
  - Vite
  - 结构分析
---

Vite 是一个由 ESBuild 搭建的快速开发服务器与一套 Rollup 打包器构成的前端构建工具

它基于原生 ES 模块提供了极快的冷启动与模块热更新

基于 Rollup 的预配置，可输出用于生产环境的高度优化过的静态资源

Vite 与 VueCli 和 Webpack 的对比详见[Vite 冷启动](../vue3/2-创建工程.html#优秀的冷启动)

## 安装与创建

### 安装包

注意：Vite 需要 Node 版本 14.18+，16+；并且不支持 IE 和其他不支持原生 ESM 的浏览器版本

::: code-tabs#shell

@tab npm

```sh
npm i -g vite
```

@tab yarn

```sh
yarn i -g vite
```

@tab pnpm

```sh
pnpm i -g vite
```

:::

### 创建新项目

```sh
npm create vite
```

根据自己的情况选用技术栈

![ViteCli](https://misaka10032.oss-cn-chengdu.aliyuncs.com/Webpack/vue-cli.png)

## 目录结构

![ViteStructure](https://misaka10032.oss-cn-chengdu.aliyuncs.com/Webpack/vite-structure.jpg)

除了项目根目录新增的一些 ts 配置文件和其他插件配置文件之外，Vite 的项目结构大体与 VueCli 相同

有一处例外，index.html 的存放路径变更为根目录

其他文件夹的作用详见[VueCli 目录结构](./vuecli.html#目录结构)

## 静态资源

注意：index.html 位置现在在项目根路径上

### 静态资源路径

- 如果 URL 是一个绝对路径，那么编译时会从项目根目录开始寻找
- 如果 URL 以 `.` 开头，选择相对路径从当前模块的路径开始，基于文件系统中的目录进行解析

以一个 demo 为例，假设当前项目有一个位于`src/component/Demo.vue`的文件，一个`src/assets/vue.svg`的图片

::: code-tabs:js

@tab 相对路径

```js
import img from "../assets/vue.svg";
```

@tab 绝对路径

```js
import img from "/assets/vue.svg";
```

:::

以上两种写法均能正确编译

下面是一些其他路径的导入方式

#### 显式 URL 引入

未包含在引入资源内的其他资源，可以使用`?url`后缀显式导入为一个 url，表示是从外部链接导入的内容

```js
import workletURL from "extra-scalloped-border/worklet.js?url";
CSS.paintWorklet.addModule(workletURL);
```

#### 将资源引入为字符串

资源可以使用 ?raw 后缀声明作为字符串引入。

```js
import shaderString from "./shader.glsl?raw";
```

#### 导入脚本作为 Worker

脚本可以通过`?worker`或`?sharedworker`后缀导入为 web worker

```js
// 在生产构建中将会分离出 chunk
import Worker from "./shader.js?worker";
const worker = new Worker();
```

```js
// sharedworker
import SharedWorker from "./shader.js?sharedworker";
const sharedWorker = new SharedWorker();
```

```js
// 内联为 base64 字符串
import InlineWorker from "./shader.js?worker&inline";
```

### public

该 public 的功能跟 VueCli 中的 public 别无二致，大多都是用来存储

- 不会被源码引用
- 必须保持原有文件名（没有 hash）
- 不想引入该资源，只想得到 URL

这些情况下的资源可以考虑放在 public 中，并且在开发时直接通过 `/` 根路径访问到，打包时能完整复制到目标目录的根目录下

注意：

1. 开发时在代码中使用的 `/` 根路径为编译时根目录，指向项目根目录
2. 在项目运行时，代码执行 `/` 根路径查找时是运行时根目录，与 public 目录同一指向，刚才提到的资源可以调取

### `new URL`

import.meta.url 是一个 ESM 的原生功能，会暴露当前模块的 URL。将它与原生的 URL 构造器 组合使用，在一个 JavaScript 模块中，通过相对路径我们就能得到一个被完整解析的静态资源 URL：

```js
const imgUrl = new URL("./img.png", import.meta.url).href;

document.getElementById("hero-img").src = imgUrl;
```

在生产构建时，Vite 才会进行必要的转换保证 URL 在打包和资源哈希后仍指向正确的地址。然而，这个 URL 字符串必须是静态的，这样才好分析。否则代码将被原样保留、因而在 build.target 不支持 import.meta.url 时会导致运行时错误。

```js
// Vite 不会转换这个
const imgUrl = new URL(imagePath, import.meta.url).href;
```

## css 相关

Vite 的 css，包括与编译器在内，也都支持自动导入与 HMR

### PostCSS

如果项目包含有效的 PostCSS 配置 (任何受 postcss-load-config 支持的格式，例如 postcss.config.js)，它将会自动应用于所有已导入的 CSS。

请注意，CSS 最小化压缩将在 PostCSS 之后运行，并会使用 build.cssTarget 选项。

### Modules

任何以 .module.css 为后缀名的 CSS 文件都被认为是一个 CSS modules 文件。导入这样的文件会返回一个相应的模块对象：

```css
/* example.module.css */
.red {
  color: red;
}
```

```js
import classes from "./example.module.css";
document.getElementById("foo").className = classes.red;
```

### 全局变量

指定传递给 CSS 预处理器的选项。文件扩展名用作选项的键，例如：

```js
export default defineConfig({
  css: {
    preprocessorOptions: {
      scss: {
        // 全局引入变量// 给导入的路径最后加上 ;
        additionalData: `@import '@/assets/css/variable.scss';`,
      },
    },
  },
});
```

## 模式和环境变量

### 模式

默认情况下，开发服务器运行在 development 模式，而 build 运行在 production 模式，这一点沿用 webpack 设定

这意味着当执行 vite build 时，它会自动加载 .env.production 中可能存在的环境变量：

```env
# .env.production
VITE_APP_TITLE=My App
```

在你的应用中，你可以使用 import.meta.env.VITE_APP_TITLE 渲染标题。

在某些情况下，若想在 vite build 时运行不同的模式来渲染不同的标题，你可以通过传递 --mode 选项标志来覆盖命令使用的默认模式。例如，如果你想在 staging （预发布）模式下构建应用

```bash
vite build --mode staging
```

还需要新建一个 .env.staging 文件：

```env
# .env.staging
VITE_APP_TITLE=My App (staging)
```

由于 vite build 默认运行生产模式构建，你也可以通过使用不同的模式和对应的 .env 文件配置来改变它，用以运行开发模式的构建：

```env
# .env.testing
NODE_ENV=development
```

模式切换逻辑 Vite 整体和 Webpack 一样

### 环境变量

Vite 在一个特殊的 import.meta.env 对象上暴露环境变量。这里有一些在所有情况下都可以使用的内建变量：

- import.meta.env.MODE: {string} 应用运行的模式。

- import.meta.env.BASE_URL: {string} 部署应用时的基本 URL。他由 base 配置项决定。

- import.meta.env.PROD: {boolean} 应用是否运行在生产环境。

- import.meta.env.DEV: {boolean} 应用是否运行在开发环境 (永远与 import.meta.env.PROD 相反)。

- import.meta.env.SSR: {boolean} 应用是否运行在 server 上。

在生产环境中，这些环境变量会在构建时被静态替换，因此，在引用它们时请使用完全静态的字符串。动态的 key 将无法生效。例如，动态 key 取值 `import.meta.env[key]` 是无效的。

### `.env`文件

同样的，Vite 使用[dotenv](https://github.com/motdotla/dotenv)从环境目录中的下列文件加载额外的环境变量

```sh
.env                # 所有情况下都会加载
.env.local          # 所有情况下都会加载，但会被 git 忽略
.env.[mode]         # 只在指定模式下加载
.env.[mode].local   # 只在指定模式下加载，但会被 git 忽略
```

加载的环境变量也会通过 import.meta.env 以字符串形式暴露给客户端源码。

为了防止意外地将一些环境变量泄漏到客户端，只有以 VITE\_ 为前缀的变量才会暴露给经过 vite 处理的代码

## 构建优化

### 按需导入

首先需要明确一点，Vite 基于 rollup 的 tree-shaking 打包，天生支持 ESM 的按需加载，所以使用依赖时要注意第三方依赖是不是支持 ESM

比如`lodash`就是默认 CJS 的依赖，即使引入到 Vite 项目中打包后还是很大，这时候就需要使用它的 ESM 版本了`lodash-es`，使用这个版本的 lodash 库就能正确按需导入了

### 分包策略

注意 1：Vite2.9 开始需要先引入 splitVendorChunkPlugin 再使用分包配置

```js
// vite.config.js
import { splitVendorChunkPlugin } from "vite";
module.exports = defineConfig({
  plugins: [splitVendorChunkPlugin()],
});
```

注意 2：Vite 中同样也有代码分割配置，但有点不同的是，如果用户配置了手动分包，就会默认覆盖 Vite 原来提供的 vendor 分包逻辑，会导致打包出现大量的代码碎片

借用源码中原有的 vendor 逻辑，再结合实际情况，以下分包策略代码仅供参考。参考链接：https://www.jianshu.com/p/a0845aa1ff07

```js
// vite.config.ts
module.exports = {
  // ...
  rollupOptions: {
    output: {
      manualChunks(id: any, { getModuleInfo }) {
        const cssLangs = `\\.(css|less|sass|scss|styl|stylus|pcss|postcss)($|\\?)`;
        const cssLangRE = new RegExp(cssLangs);
        const cache = new SplitVendorChunkCache();
        const isCSSRequest = (request: string): boolean =>
          cssLangRE.test(request);
        // 分vendor包
        if (
          id.includes("node_modules") &&
          !isCSSRequest(id) &&
          staticImportedByEntry(id, getModuleInfo, cache.cache)
        ) {
          return "vendor";
        } else if (
          // 分manifest包，解决chunk碎片问题
          getModuleInfo(id).importers.length +
            getModuleInfo(id).dynamicImporters.length >
            1 &&
          id.includes("src")
        ) {
          return "manifest";
        }
      },
    },
  },
};

export class SplitVendorChunkCache {
  constructor() {
    this.cache = new Map();
  }
  reset() {
    this.cache = new Map();
  }
}
export function staticImportedByEntry(
  id,
  getModuleInfo,
  cache,
  importStack = []
) {
  if (cache.has(id)) {
    return !!cache.get(id);
  }
  if (importStack.includes(id)) {
    cache.set(id, false);
    return false;
  }
  const mod = getModuleInfo(id);
  if (!mod) {
    cache.set(id, false);
    return false;
  }
  if (mod.isEntry) {
    cache.set(id, true);
    return true;
  }
  const someImporterIs = mod.importers.some((importer) =>
    staticImportedByEntry(
      importer,
      getModuleInfo,
      cache,
      importStack.concat(id)
    )
  );
  cache.set(id, someImporterIs);
  return someImporterIs;
}
```

### 静态资源

```js
module.exports = {
  build: {
    rollupOptions: {
      output: {
        chunkFileNames: "js/[name]-[hash].js", // 引入文件名的名称
        entryFileNames: "js/[name]-[hash].js", // 包的入口文件名称
        assetFileNames: "[ext]/[name]-[hash].[ext]", // 资源文件像 字体，图片等
      },
    },
  },
};
```

### 关闭配置项

这里包含了删除调试和控制台代码

```js
module.exports = {
  build: {
    terserOptions: {
      compress: {
        //生产环境时移除console
        drop_console: true,
        drop_debugger: true,
      },
    },
    //   关闭文件计算
    reportCompressedSize: false,
    //   关闭生成map文件 可以达到缩小打包体积
    sourcemap: false, // 这个生产环境一定要关闭，不然打包的产物会很大
  },
};
```

### 低版本浏览器兼容

首先需要安装插件`npm i @vitejs/plugin-legacy -D`

```js
import legacyPlugin from '@vitejs/plugin-legacy'

module.exports = {
    legacyPlugin({
      targets: ['chrome 52', 'Android &gt; 39', 'iOS &gt;= 10.3', 'iOS &gt;= 10.3'], // 需要兼容的目标列表，可以设置多个
      additionalLegacyPolyfills: ['regenerator-runtime/runtime'] // 面向IE11时需要此插件
    })
}
```

### 启用 gzip 压缩

安装插件 `npm install vite-plugin-compression -D`

参数：

- filter：过滤器，对哪些类型的文件进行压缩，默认为/.(js|mjs|json|css|html)$/i
- verbose: true：是否在控制台输出压缩结果，默认为 true
- threshold ：启用压缩的文件大小限制，单位是字节，默认为 0
- disable : false：是否禁用压缩，默认为 false
- deleteOriginFile ：压缩后是否删除原文件，默认为 false
- algorithm ：采用的压缩算法，默认是 gzip
- ext ：生成的压缩包后缀

```js
viteCompression({
  verbose: true,
  disable: false,
  threshold: 10240,
  algorithm: "gzip",
  ext: ".gz",
});
```

这里是 nginx.conf 的配置参考

```conf
server{
    #gzip
    #开启gzip功能
    gzip on;
    #开启gzip静态压缩功能
    gzip_static on;
    #gzip缓存大小
    gzip_buffers 4 16k;
    #gzip http版本
    gzip_http_version 1.1;
    #gzip 压缩级别 1-10
    gzip_comp_level 5;
    #gzip 压缩类型
    gzip_types text/plain application/javascript text/css application/xml text/javascript application/x-httpd-php image/jpeg image/gif image/png;
    gzip_vary on;
}
```

最终代码：

```js
import compressPlugin from 'vite-plugin-compression'

// compress: 'gzip' | 'brotli' | 'none'
function configCompressPlugin(isBuild, compress) {
  const plugins = [];
  if (!isBuild) return plugins;
  const compressList = compress.split(",");
  if (compressList.includes("gzip")) {
    plugins.push(
      compressPlugin({
        verbose: true,
        disable: false,
        threshold: 10240,
        algorithm: "gzip",
        ext: ".gz",
      })
    );
  }
  if (compressList.includes("brotli")) {
    plugins.push(
      compressPlugin({
        verbose: true,
        disable: false,
        threshold: 10240,
        algorithm: "brotliCompress",
        ext: ".br",
      })
    );
  }
  return plugins;
}
module.exports = {
  const isBuild = mode === 'production' // mode == production
  plugins: [
    ...configCompressPlugin(isBuild, 'gzip')
  ]
};
```

### 配置 CDN

一般这个功能，仅适用于公司有自己的 cdn 库，否则使用第三方的 cdn 稳定性很难保证

`npm install vite-plugin-cdn-import --save-dev`

```js
// vite.config.js
import { defineConfig } from "vite";
import ViteCDNPlugin from "vite-plugin-cdn-import";

export default defineConfig({
  plugins: [
    ViteCDNPlugin({
      modules: [
        {
          name: "lodash", // 包名
          var: "_", // 对应cdn包导出的变量，如jQuery导出的是$
          path: "https://cdn.jsdelivr.net/npm/lodash@4.17.21/lodash.min.js",
        },
      ],
    }),
  ],
});
```
