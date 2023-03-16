---
title: webpack进阶配置
order: 3
category: false
tag:
  - Webpack
  - 进阶配置
---

## source-map

| 模式                    | 解释                                                                                                          |
| :---------------------- | :------------------------------------------------------------------------------------------------------------ |
| eval                    | 每个 module 会封装到 eval 里包裹起来执行，并且会在末尾追加注释 //@ sourceURL                                  |
| source-map              | 生成一个 SourceMap 文件                                                                                       |
| hidden-source-map       | 和 source-map 一样，但不会在 bundle 末尾追加注释                                                              |
| inline-source-map       | 生成一个 DataUrl 形式的 SourceMap 文件                                                                        |
| eval-source-map         | 每个 module 会通过 eval()来执行，并且生成一个 DataUrl 形式的 SourceMap                                        |
| cheap-source-map        | 生成一个没有列信息（column-mappings）的 SourceMap 文件，不包含 loader 的 sourcemap（譬如 babel 的 sourcemap） |
| cheap-module-source-map | 生成一个没有列信息（column-mappings）的 SourceMap 文件，同时 loader 的 sourcemap 也被简化为只包含对应行的     |

eval：当 webpack.config 配置不定义 devtool 时，sourcemap 默认为 eval

一般最推荐的是 cheap-module-source-map，在 babel 支持下依然可以锁定行，但也简化了列

注意：

1. 生产环境一般不会开起 sourcemap 功能

2. 通过 bundle 和 sourcemap 文件，可以反编译源码，存在暴露风险。

3. sourcemap 文件的体积相对巨大，跟生产环境追求更小更轻的 bundle 理念相悖。

## dev-server

static：指向当前服务的物理路径

compress：true 文件采用 gzip 压缩传输，增加 Content-Encoding：gzip

port：端口号

headers：配置任何想要的头部信息

proxy：开启代理

https：true 开启 https 服务，使用默认证书，浏览器报不安全

http2：true 与 https 同理，默认自带 https 自签名证书

historyApiFallback：true 解决 SPA 页面刷新报错，配合 publicPath：'/' 解决相对路径问题

host：'0.0.0.0'，局域网内其他同事可通过局域网 ip 访问你的服务

**不想在页面上显示报错覆盖**

```js
devServer: {
  client: {
    overlay: false;
  }
}
```

## 模块热替换与热加载

hot module replacement 功能会在应用程序运行过程中，替换、添加、删除模块，无需重新加载整个页面。

hot：true

热加载指的是文件更新时，自动刷新服务和页面，新版 webpack-dev-server 默认开启了热加载功能，参数

liveReload：true

关闭时两者需同时关闭

## eslint

```shell
npm install eslint -D
eslint --init
```

控制台 lint 示例

![lint结果示例](https://misaka10032.oss-cn-chengdu.aliyuncs.com/Webpack/image-20220212192348030.png)

最后会生成一个配置文件 .eslintrc.json ，这样就完成了 eslint 的基本规则配置。

1. env：指定脚本的运行环境。每种环境都有一组特定的预定义全局变量，此处使用的 browser 预定义了浏览器环境中的全局变量，es6 启用除了 modules 以外的所有 ES6 特性。

2. globals：脚本执行期间访问的额外全局变量，即 env 中未预定义，但又需要使用的全局变量。

3. extends：检测中使用的预定义的规则集合。

4. rules：启用的规则及其各自的错误类别。会合并 extends 中的同名规则，定义冲突时优先级更高。

5. parserOptions：允许你指定你想要支持的 JS 语言选项。

## git-hooks 与 husky

设置 pre-commit 这个 git-hooks，在 commit 前进行 eslint 检查

```bash
# 设置githooks的文件夹配置路径
git config core.hooksPath *****
```

## 模块与依赖

![模块导入](https://misaka10032.oss-cn-chengdu.aliyuncs.com/Webpack/image-20220212204500370.png)

![模块依赖](https://misaka10032.oss-cn-chengdu.aliyuncs.com/Webpack/image-20220212204713542.png)

模块都通过 compiler→resolvers→enhanced-resolve 这个解析器来解析

webpack 通过 Resolvers 实现了模块之间的依赖和引用，所引用的模块可以是来自应用程序的代码，也可以是第三方库，Resolver 帮助 webpack 从每个 require/import 语句中，找到需要引入到 bundle 中的模块代码，当打包模块时，webpack 使用 enhanced-resolve 来解析文件路径（webpack_resolver 的代码实现很有思想，webpack 基于此进行 tree-shaking）。

### 模块路径解析规则

通过内置的 enhanced-resolve，webpack 能解析三种文件路径：

绝对路径、相对路径、模块路径

相对路径会根据给定的相对路径，用 path.resolve 拼接生成模块的绝对路径

```js
resolve: {
	alias: {
		'@': path.resolve(__dirname, './src')	//一般指向项目根目录下的src文件夹
	},

    extensions: []	//扩展名优先级
}
```

### 外部扩展 externals

```js
externalsType: 'script',
externals: {
  jquery: [
    'https://cdn.bootcdn.net/ajax/libs/jquery/3.6.0/jquery.js',
    '$'
  ]
}
```

通过将部分核心 js 依赖抽离到 externals 中，从外部 cdn 导入，实现压缩本地依赖大小的效果。

### 依赖图 dependency graph

每当一个文件依赖另一个文件时，webpack 会直接将文件视为存在依赖关系。这使得 webpack 可以获取非代码资源，如 images 或 web 字体等。并会把它们作为依赖提供给应用程序。当 webpack 开始工作时，它会根据我们写好的配置，从入口（entry）开始，webpack 会递归地构建一个依赖关系图，这个依赖图包含应用程序中所需的每个模块，然后将所有模块打包为 bundle（output 的配置项）。

单纯讲似乎很抽象，我们更期望能够可视化打包产物的依赖图，下边列示了一些 bundle 分析工具。

webpack-chart：webpack stats 可交互饼图

webpack-visualizer：可视化并分析你的 bundle，检查哪些模块占空间，哪些可能是重复使用的。

webpack-bundle-analyzer：一个 plugin 和 CLI 工具，它将 bundle 内容展示为一个便捷的、交互式、可缩放的树状图形式。

webpack-bundle-optimize-helper：这个工具会分析你的 bundle，并提供可操作性的改进措施，以减少 bundle 的大小。

bundle-stats：生成一个 bundle 报告（bundle 大小、资源、模块），并比较不同构建之间的结果。

```js
const { BundleAnalyzerPlugin } = require("webpack-bundle-analyzer");

// 一般搭配npm run build执行生产环境的bundle检查
plugins: [new HtmlWebpackPlugin(), new BundleAnalyzerPlugin()];
```

## 扩展功能

### PostCSS 与 CSS 模块

PostCSS：是一个用 JS 工具和插件转换 CSS 代码的工具，可以使用其中的 Autoprefixer 插件自动获取浏览器的流行度和能够支持的属性，并根据这些数据帮我们自动的为 CSS 规则添加前缀，将最新的 CSS 语法转换成大多数浏览器都能理解的语法

CSS 模块：能让你永远不用担心命名大众化而造成冲突，只要用最有意义的名字就行了

autoprefixer：为低版本浏览器提供 CSS3 属性兼容支持

![autoprefixer](https://misaka10032.oss-cn-chengdu.aliyuncs.com/Webpack/image-20220213124026740.png)

```js
module: {
  rules: [
    {
      test: /\.css$/,
      use: ["style-loader", "css-loader", "postcss-loader"],
    },
  ];
}
```

postcss-nested：在 CSS 文件中提供样式嵌套

![postcss-nested](https://misaka10032.oss-cn-chengdu.aliyuncs.com/Webpack/image-20220213124733896.png)

css-loader 开启模块化：

```js
module: {
  rules: [
    {
      test: /\.css$/,
      use: [
        "style-loader",
        {
          loader: "css-loader",
          options: {
            modules: true,
          },
        },
        "postcss-loader",
      ],
    },
  ];
}
```

从此 css 可通过 import 方式在其他模块文件中调用，以下是示例代码

```js
import style from "./app.css";
console.log(style);

const div = document.createElement("div");
div.textContent = "hello postcss";
div.classList.add(style.box);
document.body.appendChild(div);
```

### Web Worker

webpack4 引入 web-worker 实现，webpack5 内置该模块

web worker 的本质是支持我们把数据刷新与页面渲染两个动作拆开执行，web worker 在其他线程单独执行，不影响主线程的 js 执行和页面渲染（不使用 web worker 的话这两个动作在主线程中是线性执行的）

```js
// worker部分 work.js
self.onmessage = (message) => {
  self.postMessage({
    answer: 1111,
  });
};
```

```js
// 主进程部分
const worker = new Worker("./work.js", import.meta.url);

worker.postMessage({
  question: "hi，那边的worker线程，请告诉我今天的幸运数字是多少？",
});

worker.onmessage = (message) => {
  console.log(message);
};
```

### TypeScript

ts 可以添加配置文件：tsconfig.json

```shell
tsc --init
```

最终打包结果还是生成 js 文件，只是读取入口和 resolve 支持 ts 文件

```js
module.exports = {
  mode: "development",
  entry: "./src/app.ts",
  devtool: "inline-source-map",
  module: {
    rules: [
      {
        test: /\.ts$/,
        use: "ts-loader",
        exclude: /node_modules/,
      },
    ],
  },
  resolve: {
    extensions: [".ts", ".js"],
  },
  output: {
    filename: "bundle.js",
    path: path.resolve(__dirname, "./dist"),
  },
  plugins: [new HtmlWebpackPlugin()],
};
```

## 多页面配置

通过加入多个 html-webpack-plugin 的模板 html 文件，实现不同入口文件的不同引入，减轻不同 html 的依赖体积

```js
new HtmlWebpackPlugin({
  title: '多页面应用',
  template: './index.html',
  inject: 'body',
  filename: 'chanel1/index.html',
  chunks: ['main', 'lodash'],
  publicPath: 'http://www.b.com/'
}),

new HtmlWebpackPlugin({
  template: './index2.html',
  inject: 'body',
  filename: 'chanel2/index2.html',
  chunks: ['main2', 'lodash'],
  publicPath: 'http://www.a.com/'
}),
```

```js
// 入口文件
entry: {
  main: {
    import: ['./src/app2.js', './src/app.js'],
    dependOn: 'lodash',
    filename: 'chanel1/[name].js'
  },
  main2: {
    import: './src/app3.js',
    dependOn: 'lodash',
    filename: 'chanel2/[name].js'
  },
  lodash: {
    import: 'lodash',
    filename: 'common/[name].js'
  }
}
```

## Tree Shaking（重要）

[tree-shaking 实战](https://www.jianshu.com/p/7994b1fc6dfe)

[tree-shaking 实际作用分析](https://zhuanlan.zhihu.com/p/32831172)

webpack5 新增属性 **sideEffects**

package.json 中添加 sideEffects: false，可移除引入了但未使用的 css 文件等

sideEffects: [' \*.css ', ' \*.global.js ']，数组内的相关格式文件在引入后均不会删除

## 渐进式网络应用程序 PWA

PWA 主要作用是

安装必需插件并配置

```shell
npm install workbox-webpack-plugin -D
```

```js
const WorkboxPlugin = require('workbox-webpack-plugin');
plugins: [
        new HtmlWebpackPlugin(),
        new WorkboxPlugin.GenerateSW({
            clientsClaim: true,
            skipWaiting: true
        })
    ],
```

```js
// index.js
if ("serviceWorker" in navigator) {
  window.addEventListener("load", () => {
    navigator.serviceWorker
      .register("/service-worker.js")
      .then((registration) => {
        console.log("SW 注册成功", registration);
      })
      .catch((registrationError) => {
        console.log("SW 注册失败", registrationError);
      });
  });
} else console.log("浏览器不支持serviceWorker!");
```

该技术适用于手机离线状态下的显示，会默认显示先前已显示的内容缓存不至于一片空白，但兼容性并不好目前主要在 Chrome 及其相关内核浏览器上可运行。

更多内容详见[PWAs](https://developer.mozilla.org/en-US/docs/Web/Progressive_web_apps)

## Shimming 预置依赖

### Shimming 预置全局变量

```js
const HtmlWebpackPlugin = require("html-webpack-plugin");
const webpack = require("webpack");
module.exports = {
  mode: "development",
  entry: "./src/index.js",
  plugins: [
    new HtmlWebpackPlugin(),
    // 提供全局变量
    new webpack.ProvidePlugin({
      _: "lodash",
    }),
  ],
};
```

### 细粒度 Shimming

一些遗留模块依赖的 this 指向的是 window 对象

当模块运行在 CJS 上下文中，此时的 module.exports 指向的是 module.exports

通过 imports-loader 覆盖 this 指向，其实就是变量注入

```shell
npm install imports-loader -D
```

```js
module: {
  rules: [
    {
      test: require.resolve("./src/index.js"),
      use: "imports-loader?wrapper=window",
    },
    {
      test: /\.js$/,
      exclude: /node_modules/,
      use: [
        {
          loader: "babel-loader",
          options: {
            presets: ["@babel/preset-env"],
          },
        },
      ],
    },
  ];
}
```

### 全局 exports

当一些文件或变量没有默认的 module.exports 时，同样也能通过 exports-loader 实现文件/变量的导出

```shell
npm install exports-loader -D
```

```shell
npm install exports-loader -D
```

```js
{
    test: require.resole('./src/global.js'),
    use: 'exports-loader?type=commonjs&exports=file,multiple|helpers.parse|parse'
},
```

### Polyfills

将高版本 ES6 转为低版本 ES5 语法

1.全局引入

在主 bundle 文件引入

```shell
npm install --save @babel/polyfill
```

```js
import "@babel/polyfill";
```

2.按需引入

```js
{
  test: /\.js$/,
  exclude: /node_modules/,
  use: [
    {
      loader: "babel-loader",
      options: {
        presets: [
          [
            '@babel/preset-env',
            {
              targets: [
                'last 1 version',
                '> 1%'
              ],
              corejs: '3',
              useBuiltIns: 'usage'
            }
          ]
        ]
      }
    }
  ]
]
```

## library 轮子

普通 webpack 打包后的 js 文件只能通过被 script 标签引用而发挥作用，不能在其他环境中运行。因此需要更新 output 中的 library 配置项，保证能够在其他环境中也能正常调用。

```js
output: {
	path: path.resolve(__dirname, 'dist'),
	filename: 'mylib.js',
	library: {
		name: 'mylib',
		type: 'window'	// 'commonjs' 'module'
	}
}
```

module 类型需要引入新的配置对象

```js
experiments: {
	outputModule: true
},
output: {
	path: path.resolve(__dirname, 'dist'),
	filename: 'mylib.js',
	library: {
		name: 'mylib',
		type: 'module'
	}
}
```

## npm 发布

1. npm 仓库源检查

```shell
npm config get registry
// 确保registry仓库是npm官网仓库，不是淘宝镜像
```

2. 打包文件检查

npm 包名必须是全球唯一的，name 和 version 在 package.json 中设置。

发布的 npm 包以最终打包路径中的文件为准，需要调整 main 的路径

```json
"main": "dist/index.js"	//注意：设置打包后路径
```

## 模块联邦 Module Federation

以下是常见的模块化方式共享模块的概念，模块联邦实际上很类似微前端方式的概念

![npm方式共享模块](https://misaka10032.oss-cn-chengdu.aliyuncs.com/Webpack/image-20220213214659805.png)

![umd方式共享模块](https://misaka10032.oss-cn-chengdu.aliyuncs.com/Webpack/image-20220213214731528.png)

![微前端方式共享模块](https://misaka10032.oss-cn-chengdu.aliyuncs.com/Webpack/image-20220213214820666.png)

![模块联邦方式共享模块](https://misaka10032.oss-cn-chengdu.aliyuncs.com/Webpack/image-20220213214859207.png)

配置写法

Nav 部分

```js
const { ModuleFederationPlugin } = require("webpack").container;

plugins: [
  new HtmlWebpackPlugin(),

  new ModuleFederationPlugin({
    name: "nav",
    filename: "remoteEntry.js",
    remotes: {},
    exposes: {
      "./Header": "./src/Header.js",
    },
    shared: {},
  }),
];
```

Home 部分

```js
const { ModuleFederationPlugin } = require("webpack").container;

plugins: [
  new HtmlWebpackPlugin(),

  new ModuleFederationPlugin({
    name: "home",
    filename: "remoteEntry.js",
    remotes: {
      nav: "nav@http://localhost:8080/remoteEntry.js",
    },
    exposes: {
      homeList: "homeList@http://localhost:8081/remoteEntry.js",
    },
    shared: {},
  }),
];
```

```js
import("nav/Header").then(() => {});
```

## 八个通用构建优化

### 1.更新到最新版本

webpack v5.61.0 Node.js v16.13.0

### 2.将 loader 应用于最少数量的必要模块

提供 include 和 exclude，尽量少 loader 模块

### 3.引导 bootstrap

每个额外的 loader/plugin 都有启动时间。尽量少使用

### 4.解析

以下步骤可以提高解析速度：

- 减少 resolve.modules, resolve.extensions, resolve.mainFiles, resolve.descriptionFiles 中条目数量，因为它们会增加文件系统调用次数

- 如果你不适用 symlinks(例如 npm link 或者 yarn link)，可以设置 resolve.symlinks: false（实际上就是取消软连接）

- 如果你使用自定义 resolve plugin 规则，并且没有指定 context 上下文，可以设置 resolve.cacheWithContext: false

### 5.小即是快 smaller = faster

减少编译结果的整体大小，以提高构建性能。尽量保持 chunk 体积小。

- 使用数量更少/体积更小的 library。
- 在多页面应用中使用 SplitChunksPlugin。
- 在多页面应用中使用 SplitChunksPlugin，并开启 async 模式。
- 移除未引用代码。
- 只编译你当前正在开发的那些代码。

### 6.持久化缓存

在 webpack 配置中使用 cache 选项。使用 package.json 中的 postinstall 清除缓存目录。

将 cache 类型设置为内存或者文件系统。memory 选项告诉 webpack 在内存中存储缓存，不允许额外的配置。

```js
module.exports = {
	...
	cache: {
		type: 'memory'
	}
}
```

### 7.自定义 plugin/loader

对它们进行概要分析，以免在此处引入性能问题。

### 8.progress plugin

将 ProgressPlugin 从 webpack 中删除，可以缩短构建时间。该插件不会为快速构建提供太多价值，请权衡利弊再使用。

## DLL

使用 DllPlugin 为更改不频繁的代码生成单独的编译结果。可以提高应用程序的编译速度，尽管它增加了构建过程的复杂度。

通常编译的代码为项目的核心编译框架 orUI 框架代码

```js
// webpack.dll.config.js
const path = require("path");
const webpack = require("webpack");

module.exports = {
  mode: "production",

  entry: {
    lodash: ["lodash"],
  },
  output: {
    filename: "[name].js",
    path: path.resolve(__dirname, "dll"),
    library: "[name]_[hash]",
  },
  plugins: [
    new webpack.DllPlugin({
      name: "[name]_[hash]",
      path: path.resolve(__dirname, "dll/manifest.json"),
    }),
  ],
};
```

```json
// package.json
"scripts": {
    "start": "http-server dist",
    "dev": "webpack serve",
    "dll": "webpack --config ./webpack.dll.config.js"
  },
```

执行结果：

![dll执行结果](https://misaka10032.oss-cn-chengdu.aliyuncs.com/Webpack/image-20220214235807888.png)

```js
// webpack.config.js dll加入到项目中
const AddAssetHtmlPlugin = require('add-asset-html-webpack-plugin')

plugins: [
    new HtmlWebpackPlugin(),
    new webpack.DllReferencePlugin({
        manifest: path.resolve(__dirname, './dll/manifest.json')
    }),
    new AddAssetHtmlPlugin({
        filepath: path.resolve(__dirname, './dll/lodash.js'),
        publicPath: './'
    })
],
```

注意，其本质就是提前将大型静态组件打包，导出 hash 值，项目打包时引入 hash 值直接导入已打包好的代码，加快打包速度。

## worker 池(worker pool)

thread-loader 可以将非常消耗资源的 loader 分流给一个 worker pool

不要使用太多的 worker，因为 Nodejs 的 runtime 和 loader 都有启动开销，最小化 worker 和 main process（主进程）之间的模块传输，进程间通讯(IPC)是非常消耗资源的。

## 开发环境构建性能

### 增量编译

使用 webpack 的 watch mode（监听模式），而不使用其他工具来 watch 文件和调用 webpack。内置的 watch mode 会记录时间戳并将此信息传递给 compilation 以使缓存失效。

在某些配置环境中，watch mode 会回退到 poll mode（轮询模式）。监听许多文件会导致 CPU 大量负载。在这些情况下，可以使用 watchOptions.poll 来增加轮询的间隔时间。

### 内存中编译

下面几个工具通过在内存中（而不是写入磁盘）编译和 serve 资源来提高性能：

- webpack-dev-server

- webpack-hot-middleware

- webpack-dev-middleware

### stats.toJson 加速

webpack4 默认使用 stats.toJson()输出大量数据。除非在增量步骤中做必要的统计，否则请避免获取 stats 对象的部分内容。

webpack-dev-server 在 v3.1.3 以后的版本，包含一个重要的性能修复，即最小化每个增量构建步骤中，从 stats 对象获取的数据量。

### devtool

需要注意的是不同的 devtool 设置，会导致性能差异。

- eval 具有最好的性能，但并不能帮助你转译代码。

- 如果你能接受稍差一些的 map 质量，可以使用 cheap-source-map 变体配置来提高性能。

- 使用 eval-source-map 变体配置进行增量编译。

在大多数情况下，最佳选择是 eval-cheap-module-source-map

### 避免在生产环境使用 dev 工具

某些 utility, plugin 和 loader 都只用于生产环境，在开发环境下，应该排除以下工具：

- TerserPlugin
- `[fullhash]/[chunkhash]/[contenthash]`
- AggressiveSplittingPlugin
- AggressiveMergingPlugin
- ModuleConcatenationPlugin

### 最小化 entry chunk

webpack 只会在文件系统中输出已经更新的 chunk。某些配置选项（HMR, output.chunkFileName 的 `[fullhash]/[chunkhash]/[contenthash]`, `[fullhash]`来说，除了对已经更新的 chunk 无效之外，对于 entry chunk 也不会生效）

确保在生成 entry chunk 时，尽量减少其体积以提高性能，下面的配置为运行时代码创建了一个额外的 chunk，所以它的生成代价较低：

```js
module.exports = {
  // ...
  optimization: {
    runtimeChunk: true,
  },
};
```

### 避免额外的优化步骤

webpack 通过执行额外的算法任务，来优化输出结果的体积和加载性能。这些优化适用于小型代码库，但是在大型代码库中却非常耗费性能

```js
modules.exports = {
  // ...
  optimization: {
    removeAvailableModules: false,
    removeEmptyChunks: false,
    splitChunks: false,
  },
};
```

### 输出结果不携带路径信息

webpack 会在输出的 bundle 中生成路径信息，然而在打包数千个模块的项目中，会导致垃圾回收性能压力。在 options.output.pathinfo 设置中关闭

```js
module.exports = {
  // ...
  output: {
    pathinfo: false,
  },
};
```

### Node.js 版本 8.9.10 - 9.11.1

Node.js v8.9.10 - v9.11.1 中的 ES2015 Map 和 Set 实现，存在性能回退。webpack 大量地使用这些数据结构，因此这次回退也会影响编译时间。之前和之后的 Node.js 版本不受影响。

### TypeScript Loader

你可以为 loader 传入 transpileOnly 选项，以缩短使用 ts-loader 时的构建时间。使用此选项，会关闭类型检查。如果要再次开启类型检查，请使用 ForkTsCheckerWebpackPlugin。使用此插件会将检查过程转移至单独的进程，可以加快 TypeScript 的类型检查和 ESLint 插入的速度。

```js
module.exports = {
  // ...
  test: /\.tsx?$/,
  use: [
    {
      loader: "ts-loader",
      options: {
        transpileOnly: true,
      },
    },
  ],
};
```

生产环境优化构建性能主要考虑关闭 source-map。

## 构建优化简单一图流

![webpack构建优化一图流](https://misaka10032.oss-cn-chengdu.aliyuncs.com/Webpack/webpack-optimize.png)