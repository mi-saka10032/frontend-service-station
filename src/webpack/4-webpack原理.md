---
title: Webpack原理
order: 4
category: false
tag:
  - Webpack
  - 运行流程
  - 编译阶段
  - 输出阶段
  - 内存贮存
  - 双工通信
---

主要围绕 Webpack 从初始化 -> 编译 -> 输出到结束的整个生命周期阶段简单分析，其中再着重分析一下内存打包、HMR、Tree-shaking

参考链接 1：https://juejin.cn/post/6844903614469636103

参考链接 2：https://blog.csdn.net/major_zhang/article/details/84557665

参考链接 3：https://zhuanlan.zhihu.com/p/30669007

参考链接 4：https://www.51cto.com/article/681949.html

## 基本概念

Webpack 五个核心概念：

1. Entry：入口。Webpack 执行构建的第一步将从 Entry 开始，可抽象成输入
2. Module：模块。在 Webpack 里一切皆模块，一个模块对应着一个文件。Webpack 会从配置的 Entry 开始递归找出所有依赖的模块
3. Chunk：代码块。一个 Chunk 由多个模块组合而成，用于代码合并与分割
4. Loader：模块转换器。用于把模块原内容按照需求转换成新内容
5. Plugin：扩展插件，在 Webpack 构建流程中的特定时机会广播对应的事件，插件可以监听这些事件的发生，在特定时机做对应的事情

## 流程概括

Webpack 的运行流程是一个串行的过程，从启动到结束会依次执行以下流程

1. 初始化参数：从配置文件和 Shell 语句中读取与合并参数，得出最终的参数；
2. 开始编译：用上一步得到的参数初始化 Compiler 对象，加载所有配置的插件，执行对象的 run 方法开始执行编译；
3. 确定入口：根据配置中的 entry 找出所有的入口文件；
4. 编译模块：从入口文件出发，调用所有配置的 Loader 对模块进行翻译，再找出该模块依赖的模块，再递归本步骤直到所有入口依赖的文件都经过了本步骤的处理；
5. 完成模块编译：在经过第 4 步使用 Loader 翻译完所有模块后，得到了每个模块被翻译后的最终内容以及它们之间的依赖关系；
6. 输出资源：根据入口和模块之间的依赖关系，组装成一个个包含多个模块的 Chunk，再把每个 Chunk 转换成一个单独的文件加入到输出列表，这步是可以修改输出内容的最后机会；
7. 输出完成：在确定好输出内容后，根据配置确定输出的路径和文件名，把文件内容写入到文件系统。

在以上过程中，Webpack 会在特定的时间点广播出特定的事件，插件在监听到感兴趣的事件后会执行特定的逻辑，并且插件可以调用 Webpack 提供的 API 改变 Webpack 的运行结果。

## 流程细节

Webpack 的构建流程可以分为以下三大阶段：

1. 初始化：启动构建，读取与合并配置参数，加载 Plugin，实例化 Compiler。
2. 编译：从 Entry 发出，针对每个 Module 串行调用对应的 Loader 去翻译文件内容，再找到该 Module 依赖的 Module，递归地进行编译处理。
3. 输出：对编译后的 Module 组合成 Chunk，把 Chunk 转换成文件，输出到文件系统。

如果只执行一次构建，以上阶段将会按照顺序各执行一次。但在开启监听模式下，流程将变为如下：

在每个大阶段中又会发生很多事件，Webpack 会把这些事件广播出来供给 Plugin 使用，下面来一一介绍。

## 初始化阶段

| 事件名          | 注释                                                                                                                                             |
| :-------------- | :----------------------------------------------------------------------------------------------------------------------------------------------- |
| 初始化参数      | 从配置文件和 Shell 语句中读取与合并参数，得出最终的参数。这个过程中还会执行配置文件中的插件实例化语句`new Plugin()`                              |
| 实例化 Compiler | 用上一步得到的参数初始化 Compiler 实例，Compiler 负责文件监听和启动编译。Compiler 实例中包含了完整的 Webpack 配置，全局只有一个 Compiler 实例    |
| 加载插件        | 依次调用插件的 apply 方法，让插件可以监听后续的所有事件节点，同时给插件传入 compiler 实例的引用，以方便插件通过 compiler 调用 Webpack 提供的 API |
| environment     | 开始应用 Node.js 风格的文件系统到 compiler 对象，以便后续的文件寻找和读取                                                                        |
| entry-option    | 读取配置的 Entrys，为每个 Entry 实例化一个对应的 EntryPlugin，为后面该 Entry 的递归解析工作做准备                                                |
| after-plugins   | 调用完所有内置和配置的插件的 apply 方法                                                                                                          |
| after-resolvers | 根据配置初始化完 resolver，resolver 负责在文件系统中寻找指定路径的文件                                                                           |

## 编译阶段

| 事件名        | 注释                                                                                                                                                                                                  |
| :------------ | :---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| run           | 启动一次新的编译                                                                                                                                                                                      |
| watch-run     | 和 run 类似，区别在于它是在监听模式下启动的编译，在这个事件中可以获取到是哪些文件发生了变化导致需要重新启动一次新的编译                                                                               |
| compile       | 该事件是为了告诉插件一次新的编译将要启动，同时会给插件带上 compiler 对象                                                                                                                              |
| compilation   | 当 Webpack 以开发模式运行时，每当检测到文件变化，一次新的 Compilation 将被创建。一个 Compilation 对象包含了当前的模块资源、编译生成资源、变化的文件等。Compilation 对象也提供了很多事件回调供插件扩展 |
| make          | 一个新的 Compilation 创建完毕，即将从 Entry 开始读取文件，根据文件类型和配置的 Loader 对文件进行编译，编译完后再找出该文件依赖的文件，递归地编译和解析                                                |
| after-compile | 一次 Compilation 执行完成                                                                                                                                                                             |
| invalid       | 当遇到文件不存在、文件编译错误等异常时会触发该事件，该事件不会导致 Webpack 退出                                                                                                                       |

在编译阶段中，最重要的要数 compilation 事件了，因为在 compilation 阶段调用了 Loader 完成了每个模块的转换操作，在 compilation 阶段又包括很多小的事件，它们分别是：

| 事件名               | 解释                                                                                                                                                            |
| :------------------- | :-------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| build-module         | 使用对应的 Loader 去转换一个模块                                                                                                                                |
| normal-module-loader | 使用 Loader 对一个模块转换完后，使用 acorn 解析转换后的内容，输出对应的抽象语法树(AST)，以方便 Webpack 后面对代码的分析                                         |
| program              | 从配置的入口模块开始，分析其 AST，当遇到 require 等导入其他模块语句时，便将其加入到依赖的模块列表，同时对新找出的依赖模块递归分析，最终搞清楚所有模块的依赖关系 |
| seal                 | 所有模块及其依赖的模块都通过 Loader 转换完成后，根据依赖关系开始生成 Chunk                                                                                      |

## 输出阶段

| 事件名      | 解释                                                                                                            |
| :---------- | :-------------------------------------------------------------------------------------------------------------- |
| should-emit | 所有需要输出的文件已经生成完毕，询问插件哪些文件需要输出，哪些不需要                                            |
| emit        | 确定好要输出哪些文件后，执行文件输出，可以在这里获取和修改输出内容                                              |
| after-emit  | 文件输出完毕                                                                                                    |
| done        | 成功完成一次完成的编译和输出流程                                                                                |
| failed      | 如果在编译和输出流程中遇到异常导致 Webpack 退出时，就会直接跳转到本步骤，插件可以在本事件中获取到具体的错误原因 |

在输出阶段已经得到了各个模块经过转换后的结果和其依赖关系，并且把相关模块组合在一起形成一个个 Chunk。 在输出阶段会根据 Chunk 的类型，使用对应的模版生成最终要要输出的文件内容。

## 输出文件分析

虽然在前面的章节中你学会了如何使用 Webpack ，也大致知道其工作原理，可是你想过 Webpack 输出的 bundle.js 是什么样子的吗？ 为什么原来一个个的模块文件被合并成了一个单独的文件？为什么 bundle.js 能直接运行在浏览器中？ 本节将解释清楚以上问题。

先来看看由 安装与使用 中最简单的项目构建出的 bundle.js 文件内容，代码如下：

```js
// webpackBootstrap 启动函数
// modules 即为存放所有模块的数组，数组中的每一个元素都是一个函数
(function (modules) {
  // 安装过的模块都存放在这里面
  // 作用是把已经加载过的模块缓存在内存中，提升性能
  var installedModules = {};

  // 去数组中加载一个模块，moduleId 为要加载模块在数组中的 index
  // 作用和 Node.js 中 require 语句相似
  function __webpack_require__(moduleId) {
    // 如果需要加载的模块已经被加载过，就直接从内存缓存中返回
    if (installedModules[moduleId]) {
      return installedModules[moduleId].exports;
    }

    // 如果缓存中不存在需要加载的模块，就新建一个模块，并把它存在缓存中
    var module = (installedModules[moduleId] = {
      // 模块在数组中的 index
      i: moduleId,
      // 该模块是否已经加载完毕
      l: false,
      // 该模块的导出值
      exports: {},
    });

    // 从 modules 中获取 index 为 moduleId 的模块对应的函数
    // 再调用这个函数，同时把函数需要的参数传入
    modules[moduleId].call(
      module.exports,
      module,
      module.exports,
      __webpack_require__
    );
    // 把这个模块标记为已加载
    module.l = true;
    // 返回这个模块的导出值
    return module.exports;
  }

  // Webpack 配置中的 publicPath，用于加载被分割出去的异步代码
  __webpack_require__.p = "";

  // 使用 __webpack_require__ 去加载 index 为 0 的模块，并且返回该模块导出的内容
  // index 为 0 的模块就是 main.js 对应的文件，也就是执行入口模块
  // __webpack_require__.s 的含义是启动模块对应的 index
  return __webpack_require__((__webpack_require__.s = 0));
})(
  // 所有的模块都存放在了一个数组里，根据每个模块在数组的 index 来区分和定位模块
  [
    /* 0 */
    function (module, exports, __webpack_require__) {
      // 通过 __webpack_require__ 规范导入 show 函数，show.js 对应的模块 index 为 1
      const show = __webpack_require__(1);
      // 执行 show 函数
      show("Webpack");
    },
    /* 1 */
    function (module, exports) {
      function show(content) {
        window.document.getElementById("app").innerText = "Hello," + content;
      }
      // 通过 CommonJS 规范导出 show 函数
      module.exports = show;
    },
  ]
);
```

以上看上去复杂的代码其实是一个立即执行函数，可以简写为如下：

```js
(function (modules) {
  // 模拟 require 语句
  function __webpack_require__() {}

  // 执行存放所有模块数组中的第0个模块
  __webpack_require__(0);
})([
  /*存放所有模块的数组*/
]);
```

bundle.js 能直接运行在浏览器中的原因在于输出的文件中通过 `__webpack_require__` 函数定义了一个可以在浏览器中执行的加载函数来模拟 Node.js 中的 require 语句。

原来一个个独立的模块文件被合并到了一个单独的 bundle.js 的原因在于浏览器不能像 Node.js 那样快速地去本地加载一个个模块文件，而必须通过网络请求去加载还未得到的文件。 如果模块数量很多，加载时间会很长，因此把所有模块都存放在了数组中，执行一次网络加载。

如果仔细分析 `__webpack_require__` 函数的实现，你还有发现 Webpack 做了缓存优化： 执行加载过的模块不会再执行第二次，执行结果会缓存在内存中，当某个模块第二次被访问时会直接去内存中读取被缓存的返回值。

## 分割代码时的输出

例如把源码中的 main.js 修改为如下：

```js
// 异步加载 show.js
import("./show").then((show) => {
  // 执行 show 函数
  show("Webpack");
});
```

重新构建后会输出两个文件，分别是执行入口文件 bundle.js 和 异步加载文件 0.bundle.js。

其中 0.bundle.js 内容如下：

```js
// 加载在本文件(0.bundle.js)中包含的模块
webpackJsonp(
  // 在其它文件中存放着的模块的 ID
  [0],
  // 本文件所包含的模块
  [
    // show.js 所对应的模块
    function (module, exports) {
      function show(content) {
        window.document.getElementById("app").innerText = "Hello," + content;
      }

      module.exports = show;
    },
  ]
);
```

bundle.js 内容如下：

```js
(function (modules) {
  /***
   * webpackJsonp 用于从异步加载的文件中安装模块。
   * 把 webpackJsonp 挂载到全局是为了方便在其它文件中调用。
   *
   * @param chunkIds 异步加载的文件中存放的需要安装的模块对应的 Chunk ID
   * @param moreModules 异步加载的文件中存放的需要安装的模块列表
   * @param executeModules 在异步加载的文件中存放的需要安装的模块都安装成功后，需要执行的模块对应的 index
   */
  window["webpackJsonp"] = function webpackJsonpCallback(
    chunkIds,
    moreModules,
    executeModules
  ) {
    // 把 moreModules 添加到 modules 对象中
    // 把所有 chunkIds 对应的模块都标记成已经加载成功
    var moduleId,
      chunkId,
      i = 0,
      resolves = [],
      result;
    for (; i < chunkIds.length; i++) {
      chunkId = chunkIds[i];
      if (installedChunks[chunkId]) {
        resolves.push(installedChunks[chunkId][0]);
      }
      installedChunks[chunkId] = 0;
    }
    for (moduleId in moreModules) {
      if (Object.prototype.hasOwnProperty.call(moreModules, moduleId)) {
        modules[moduleId] = moreModules[moduleId];
      }
    }
    while (resolves.length) {
      resolves.shift()();
    }
  };

  // 缓存已经安装的模块
  var installedModules = {};

  // 存储每个 Chunk 的加载状态；
  // 键为 Chunk 的 ID，值为0代表已经加载成功
  var installedChunks = {
    1: 0,
  };

  // 模拟 require 语句，和上面介绍的一致
  function __webpack_require__(moduleId) {
    // ... 省略和上面一样的内容
  }

  /**
   * 用于加载被分割出去的，需要异步加载的 Chunk 对应的文件
   * @param chunkId 需要异步加载的 Chunk 对应的 ID
   * @returns {Promise}
   */
  __webpack_require__.e = function requireEnsure(chunkId) {
    // 从上面定义的 installedChunks 中获取 chunkId 对应的 Chunk 的加载状态
    var installedChunkData = installedChunks[chunkId];
    // 如果加载状态为0表示该 Chunk 已经加载成功了，直接返回 resolve Promise
    if (installedChunkData === 0) {
      return new Promise(function (resolve) {
        resolve();
      });
    }

    // installedChunkData 不为空且不为0表示该 Chunk 正在网络加载中
    if (installedChunkData) {
      // 返回存放在 installedChunkData 数组中的 Promise 对象
      return installedChunkData[2];
    }

    // installedChunkData 为空，表示该 Chunk 还没有加载过，去加载该 Chunk 对应的文件
    var promise = new Promise(function (resolve, reject) {
      installedChunkData = installedChunks[chunkId] = [resolve, reject];
    });
    installedChunkData[2] = promise;

    // 通过 DOM 操作，往 HTML head 中插入一个 script 标签去异步加载 Chunk 对应的 JavaScript 文件
    var head = document.getElementsByTagName("head")[0];
    var script = document.createElement("script");
    script.type = "text/javascript";
    script.charset = "utf-8";
    script.async = true;
    script.timeout = 120000;

    // 文件的路径为配置的 publicPath、chunkId 拼接而成
    script.src = __webpack_require__.p + "" + chunkId + ".bundle.js";

    // 设置异步加载的最长超时时间
    var timeout = setTimeout(onScriptComplete, 120000);
    script.onerror = script.onload = onScriptComplete;

    // 在 script 加载和执行完成时回调
    function onScriptComplete() {
      // 防止内存泄露
      script.onerror = script.onload = null;
      clearTimeout(timeout);

      // 去检查 chunkId 对应的 Chunk 是否安装成功，安装成功时才会存在于 installedChunks 中
      var chunk = installedChunks[chunkId];
      if (chunk !== 0) {
        if (chunk) {
          chunk[1](new Error("Loading chunk " + chunkId + " failed."));
        }
        installedChunks[chunkId] = undefined;
      }
    }
    head.appendChild(script);

    return promise;
  };

  // 加载并执行入口模块，和上面介绍的一致
  return __webpack_require__((__webpack_require__.s = 0));
})(
  // 存放所有没有经过异步加载的，随着执行入口文件加载的模块
  [
    // main.js 对应的模块
    function (module, exports, __webpack_require__) {
      // 通过 __webpack_require__.e 去异步加载 show.js 对应的 Chunk
      __webpack_require__
        .e(0)
        .then(__webpack_require__.bind(null, 1))
        .then((show) => {
          // 执行 show 函数
          show("Webpack");
        });
    },
  ]
);
```

这里的 bundle.js 和上面所讲的 bundle.js 非常相似，区别在于

- 多了一个 `__webpack_require__.e` 用于加载被分割出去的，需要异步加载的 Chunk 对应的文件;
- 多了一个 webpackJsonp 函数用于从异步加载的文件中安装模块。

在使用了 CommonsChunkPlugin 去提取公共代码时输出的文件和使用了异步加载时输出的文件是一样的，都会有 `__webpack_require__.e` 和 webpackJsonp。 原因在于提取公共代码和异步加载本质上都是代码分割

## 简析 Loader

Loader 就像是一个翻译员，能把源文件经过转化后输出新的结果，并且一个文件还可以链式的经过多个翻译员翻译

以处理 SCSS 文件为例：

- SCSS 源代码会先交给 sass-loader 把 SCSS 转换成 CSS；
- 把 sass-loader 输出的 CSS 交给 css-loader 处理，找出 CSS 中依赖的资源、压缩 CSS 等；
- 把 css-loader 输出的 CSS 交给 style-loader 处理，转换成通过脚本加载的 JavaScript 代码；

可以看出以上的处理过程需要有顺序的链式执行，先 sass-loader 再 css-loader 再 style-loader

```js
module.exports = {
  module: {
    rules: [
      {
        // 增加对 SCSS 文件的支持
        test: /\.scss/,
        // SCSS 文件的处理顺序为先 sass-loader 再 css-loader 再 style-loader
        use: [
          "style-loader",
          {
            loader: "css-loader",
            // 给 css-loader 传入配置项
            options: {
              minimize: true,
            },
          },
          "sass-loader",
        ],
      },
    ],
  },
};
```

所以不难看出，一个 loader 的职责是单一的，只需要完成一种转换。 如果一个源文件需要经历多步转换才能正常使用，就通过多个 Loader 去转换。 在调用多个 Loader 去转换一个文件时，每个 Loader 会链式的顺序执行， 第一个 Loader 将会拿到需处理的原内容，上一个 Loader 处理后的结果会传给下一个接着处理，最后的 Loader 将处理后的最终结果返回给 Webpack。

## Plugin

Webpack 通过 Plugin 机制让其更加灵活，以适应各种应用场景。 在 Webpack 运行的生命周期中会广播出许多事件，Plugin 可以监听这些事件，在合适的时机通过 Webpack 提供的 API 改变输出结果

一个最基础的 Plugin 的代码是这样的

```js
class BasicPlugin {
  // 在构造函数中获取用户给该插件传入的配置
  constructor(options) {}

  // Webpack 会调用 BasicPlugin 实例的 apply 方法给插件实例传入 compiler 对象
  apply(compiler) {
    compiler.plugin("compilation", function (compilation) {});
  }
}

// 导出 Plugin
module.exports = BasicPlugin;
```

```js
const BasicPlugin = require("./BasicPlugin.js");
module.export = {
  plugins: [new BasicPlugin(options)],
};
```

Webpack 启动后，在读取配置的过程中会先执行 new BasicPlugin(options) 初始化一个 BasicPlugin 获得其实例。 在初始化 compiler 对象后，再调用 basicPlugin.apply(compiler) 给插件实例传入 compiler 对象。 插件实例在获取到 compiler 对象后，就可以通过 compiler.plugin(事件名称, 回调函数) 监听到 Webpack 广播出来的事件。 并且可以通过 compiler 对象去操作 Webpack。

## Complier 和 Compilation

在开发 Plugin 时最常用的两个对象就是 Compiler 和 Compilation，它们是 Plugin 和 Webpack 之间的桥梁。 Compiler 和 Compilation 的含义如下：

- Compiler 对象包含了 Webpack 环境所有的的配置信息，包含 options，loaders，plugins 这些信息，这个对象在 Webpack 启动时候被实例化，它是全局唯一的，可以简单地把它理解为 Webpack 实例；
- Compilation 对象包含了当前的模块资源、编译生成资源、变化的文件等。当 Webpack 以开发模式运行时，每当检测到一个文件变化，一次新的 Compilation 将被创建。Compilation 对象也提供了很多事件回调供插件做扩展。通过 Compilation 也能读取到 Compiler 对象。

Compiler 和 Compilation 的区别在于：Compiler 代表了整个 Webpack 从启动到关闭的生命周期，而 Compilation 只是代表了一次新的编译。

## 事件流

Webpack 就像一条生产线，要经过一系列处理流程后才能将源文件转换成输出结果。 这条生产线上的每个处理流程的职责都是单一的，多个流程之间有存在依赖关系，只有完成当前处理后才能交给下一个流程去处理。 插件就像是一个插入到生产线中的一个功能，在特定的时机对生产线上的资源做处理。

Webpack 通过 Tapable 来组织这条复杂的生产线。 Webpack 在运行过程中会广播事件，插件只需要监听它所关心的事件，就能加入到这条生产线中，去改变生产线的运作。 Webpack 的事件流机制保证了插件的有序性，使得整个系统扩展性很好。

Webpack 的事件流机制应用了观察者模式，和 Node.js 中的 EventEmitter 非常相似。Compiler 和 Compilation 都继承自 Tapable，可以直接在 Compiler 和 Compilation 对象上广播和监听事件，方法如下：

```js
/**
 * 广播出事件
 * event-name 为事件名称，注意不要和现有的事件重名
 * params 为附带的参数
 */
compiler.apply("event-name", params);

/**
 * 监听名称为 event-name 的事件，当 event-name 事件发生时，函数就会被执行。
 * 同时函数中的 params 参数为广播事件时附带的参数。
 */
compiler.plugin("event-name", function (params) {});
```

同理，compilation.apply 和 compilation.plugin 使用方法和上面一致。

在开发插件时，还需要注意以下三点：

- 只要能拿到 Compiler 或 Compilation 对象，就能广播出新的事件，所以在新开发的插件中也能广播出事件，给其它插件监听使用。
- 传给每个插件的 Compiler 和 Compilation 对象都是同一个引用。也就是说在一个插件中修改了 Compiler 或 Compilation 对象上的属性，会影响到后面的插件。
- 有些事件是异步的，这些异步的事件会附带两个参数，第二个参数为回调函数，在插件处理完任务时需要调用回调函数通知 Webpack，才会进入下一处理流程。例如：

```js
compiler.plugin("emit", function (compilation, callback) {
  // 支持处理逻辑

  // 处理完毕后执行 callback 以通知 Webpack
  // 如果不执行 callback，运行流程将会一直卡在这不往下执行
  callback();
});
```

## 修改输出资源

有些场景下插件需要修改、增加、删除输出的资源，要做到这点需要监听 emit 事件，因为发生 emit 事件时所有模块的转换和代码块对应的文件已经生成好， 需要输出的资源即将输出，因此 emit 事件是修改 Webpack 输出资源的最后时机。

所有需要输出的资源会存放在 compilation.assets 中，compilation.assets 是一个键值对，键为需要输出的文件名称，值为文件对应的内容。

设置 compilation.assets 的代码如下：

```js
compiler.plugin("emit", (compilation, callback) => {
  // 设置名称为 fileName 的输出资源
  compilation.assets[fileName] = {
    // 返回文件内容
    source: () => {
      // fileContent 既可以是代表文本文件的字符串，也可以是代表二进制文件的 Buffer
      return fileContent;
    },
    // 返回文件大小
    size: () => {
      return Buffer.byteLength(fileContent, "utf8");
    },
  };
  callback();
});
```

读取 compilation.assets 的代码如下：

```js
compiler.plugin("emit", (compilation, callback) => {
  // 读取名称为 fileName 的输出资源
  const asset = compilation.assets[fileName];
  // 获取输出资源的内容
  asset.source();
  // 获取输出资源的文件大小
  asset.size();
  callback();
});
```

## 内存系统打包

Webpack 在 dev 模式下打包文件是临时贮存在内存中的，其主要借助 memory-fs 内存文件系统实现

### memory-fs

memory-fs 是 NodeJS 原生 fs 模块内存版(in-memory)的完整功能实现。相比于从磁盘读写数据，memory-fs 是内存缓存和快速数据处理的完美替代方案

webpack 通过自己实现的 memory-fs 将 bundle.js 文件打包到了内存中，访问内存中的代码文件也就更快，也减少了代码写入文件的开销

memory-fs 是 webpack-dev-middleware 的一个依赖库，webpack-dev-middleware 将 webpack 原本的 outputFileSystem (node 的 fs 系统)替换成了 MemoryFileSystem 实例，这样代码就将输出到内存中。webpack-dev-middleware 中该部分源码如下：

```js
// webpack-dev-middleware/lib/Shared.js
var isMemoryFs =
  !compiler.compilers && compiler.outputFileSystem instanceof MemoryFileSystem;
if (isMemoryFs) {
  fs = compiler.outputFileSystem;
} else {
  fs = compiler.outputFileSystem = new MemoryFileSystem();
}
```

### 简单实现

```js
// 通过键值对形式存储进new MemoryFileSystem().data对象中
var MemoryFileSystem = require("./MemoryFileSystem");
var fs = new MemoryFileSystem(); // Optionally pass a javascript object
const fs2 = require("fs");

//创建 /tmp/a/apple 目录，不管 `/tmp` 和 /tmp/a 目录是否存在。 node v10的版本才有
fs2.mkdir("/tmp/a/apple", { recursive: true }, (err) => {
  if (err) throw err;
});

fs.mkdirpSync("/a/test/dir");
fs.writeFileSync("/a/test/dir/file2.txt", "Hello World2");
console.log(fs.readFileSync("/a/test/dir/file2.txt", "utf-8")); // returns Buffer("Hello World"))
// fs.readFileSync("/a/test/dir/file2.txt",function(err,data) {
//     console.log(data);
// })

fs2.mkdir("ass/dasdsa", { recursive: true }, (err) => {
  if (err) throw err;
});
```

## HMR

在 HMR 之前，应用的加载、更新是一种页面级别的原子操作，即使只是单个代码文件发生变更都需要刷新整个页面才能最新代码映射到浏览器上，这会丢失之前在页面执行过的所有交互与状态，例如：

对于复杂表单场景，这意味着你可能需要重新填充非常多字段信息

弹框消失，你必须重新执行交互动作才会重新弹出

再小的改动，例如更新字体大小，改变备注信息都会需要整个页面重新加载执行，影响开发体验。引入 HMR 后，虽然无法覆盖所有场景，但大多数小改动都可以实时热更新到页面上，从而确保连续、顺畅的开发调试体验，对开发效率有较大增益效果。

### HMR 配置

```js
// webpack.config.js
module.exports = {
  // ...
  devServer: {
    // 必须设置 devServer.hot = true，启动 HMR 功能
    hot: true,
  },
};
```

### 工作原理图解

![webpack-hmr](https://misaka10032.oss-cn-chengdu.aliyuncs.com/Webpack/webpack-hmr.webp)

上图是 webpack 配合 webpack-dev-server 进行应用开发的模块热更新流程图

- 上图底部红色框内是服务端，而上面的橙色框是浏览器端。
- 绿色的方框是 webpack 代码控制的区域。蓝色方框是 webpack-dev-server 代码控制的区域，洋红色的方框是文件系统，文件修改后的变化就发生在这，而青色的方框是应用本身。

上图显示了我们修改代码到模块热更新完成的一个周期，通过深绿色的阿拉伯数字符号已经将 HMR 的整个过程标识了出来

1. 第一步，在 webpack 的 watch 模式下，文件系统中某一个文件发生修改，webpack 监听到文件变化，根据配置文件对模块重新编译打包，并将打包后的代码通过简单的 JavaScript 对象保存在内存中。
2. 第二步是 webpack-dev-server 和 webpack 之间的接口交互，而在这一步，主要是 dev-server 的中间件 webpack-dev-middleware 和 webpack 之间的交互，webpack-dev-middleware 调用 webpack 暴露的 API 对代码变化进行监控，并且告诉 webpack，将代码打包到内存中。
3. 第三步是 webpack-dev-server 对文件变化的一个监控，这一步不同于第一步，并不是监控代码变化重新打包。当我们在配置文件中配置了 devServer.watchContentBase 为 true 的时候，Server 会监听这些配置文件夹中静态文件的变化，变化后会通知浏览器端对应用进行 live reload。注意，这儿是浏览器刷新，和 HMR 是两个概念。
4. 第四步也是 webpack-dev-server 代码的工作，该步骤主要是通过 sockjs（webpack-dev-server 的依赖）在浏览器端和服务端之间建立一个 websocket 长连接，将 webpack 编译打包的各个阶段的状态信息告知浏览器端，同时也包括第三步中 Server 监听静态文件变化的信息。浏览器端根据这些 socket 消息进行不同的操作。当然服务端传递的最主要信息还是新模块的 hash 值，后面的步骤根据这一 hash 值来进行模块热替换。
5. webpack-dev-server/client 端并不能够请求更新的代码，也不会执行热更模块操作，而把这些工作又交回给了 webpack，webpack/hot/dev-server 的工作就是根据 webpack-dev-server/client 传给它的信息以及 dev-server 的配置决定是刷新浏览器呢还是进行模块热更新。当然如果仅仅是刷新浏览器，也就没有后面那些步骤了。
6. HotModuleReplacement.runtime 是客户端 HMR 的中枢，它接收到上一步传递给他的新模块的 hash 值，它通过 JsonpMainTemplate.runtime 向 server 端发送 Ajax 请求，服务端返回一个 json，该 json 包含了所有要更新的模块的 hash 值，获取到更新列表后，该模块再次通过 jsonp 请求，获取到最新的模块代码。这就是上图中 7、8、9 步骤。
7. 而第 10 步是决定 HMR 成功与否的关键步骤，在该步骤中，HotModulePlugin 将会对新旧模块进行对比，决定是否更新模块，在决定更新模块后，检查模块之间的依赖关系，更新模块的同时更新模块间的依赖引用。
8. 最后一步，当 HMR 失败后，回退到 live reload 操作，也就是进行浏览器刷新来获取最新打包代码。

接下来，分六步对上述过程进行详解

### 第一步：文件系统监听并打包

webpack-dev-middleware 调用 webpack 的 api 对文件系统 watch，当 hello.js 文件发生改变后，webpack 重新对文件进行编译打包，然后保存到内存中

```js
// webpack-dev-middleware/lib/Shared.js
if (!options.lazy) {
  var watching = compiler.watch(
    options.watchOptions,
    share.handleCompilerCallback
  );
  context.watching = watching;
}
```

文件内存系统的分析详见[文件内存系统](#内存系统打包)

实现该功能后，浏览器请求 bundle.js 文件的实质就变成了向 devServer 请求 js 对象，返回给浏览器端

### 第二步：文件内容改变

这一阶段，sockjs 是服务端和客户端的桥梁，启动 devServer 的时候，sockjs 在服务端和客户端建立了一个 webSocket 长连接，以便将编译和打包各阶段状态告知客户端，最关键的步骤还是 webpack-dev-server 调用 webpack api 监听 compile 的 done 事件，当 compile 完成后，webpack-dev-server 通过 `_sendStatus` 方法将编译打包后的**新模块 hash 值**发送到浏览器端

```js
// webpack-dev-server/lib/Server.js
compiler.plugin('done', (stats) => {
  // stats.hash 是最新打包文件的 hash 值
  this._sendStats(this.sockets, stats.toJson(clientStats));
  this._stats = stats;
});
...
Server.prototype._sendStats = function (sockets, stats, force) {
  if (!force && stats &&
  (!stats.errors || stats.errors.length === 0) && stats.assets &&
  stats.assets.every(asset => !asset.emitted)
  ) { return this.sockWrite(sockets, 'still-ok'); }
  // 调用 sockWrite 方法将 hash 值通过 websocket 发送到浏览器端
  this.sockWrite(sockets, 'hash', stats.hash);
  if (stats.errors.length > 0) { this.sockWrite(sockets, 'errors', stats.errors); }
  else if (stats.warnings.length > 0) { this.sockWrite(sockets, 'warnings', stats.warnings); }      else { this.sockWrite(sockets, 'ok'); }
};
```

### 第三步：客户端接收并响应

客户端能接受 websocket 消息的原理是：webpack-dev-server 修改了 webpack 配置中的 entry 属性，在里面添加了 webpack-dev-client 的代码，这样在最后的 bundle.js 文件中就会有接收 websocket 消息的代码了。注入的 HMR Runtime 包括：

- 用于建立 Websocket 连接，处理 hash 等消息的运行时代码
- 用于加载热更新资源的 RuntimeGlobals.hmrDownloadManifest 与 RuntimeGlobals.hmrDownloadUpdateHandlers 接口
- 用于处理模块更新策略的 module.hot.accept 接口
- ……

webpack-dev-server/client 当接收到 type 为 hash 消息后会将 hash 值暂存起来，当接收到 type 为 ok 的消息后对应用执行 reload 操作

在 reload 操作中，webpack-dev-server/client 会根据 hot 配置决定是刷新浏览器还是对代码进行热更新（HMR）

```js
// webpack-dev-server/client/index.js
hash: function msgHash(hash) {
    currentHash = hash;
},
ok: function msgOk() {
    // ...
    reloadApp();
},
// ...
function reloadApp() {
  // ...
  if (hot) {
    log.info('[WDS] App hot update...');
    const hotEmitter = require('webpack/hot/emitter');
    hotEmitter.emit('webpackHotUpdate', currentHash);
    // ...
  } else {
    log.info('[WDS] App updated. Reloading...');
    self.location.reload();
  }
}
```

如上面代码所示，首先将 hash 值暂存到 currentHash 变量，当接收到 ok 消息后，对 App 进行 reload。如果配置了模块热更新，就调用 webpack/hot/emitter 将最新 hash 值发送给 webpack，然后将控制权交给 webpack 客户端代码。如果没有配置模块热更新，就直接调用 location.reload 方法刷新页面

### 第四步：hash 验证及请求代码

在这一步，其实是 webpack 中三个模块（三个文件，后面英文名对应文件路径）之间配合的结果

![websocket-hmr时序图](https://misaka10032.oss-cn-chengdu.aliyuncs.com/Webpack/websocket-hmr.png)

首先是 webpack/hot/dev-server（以下简称 dev-server） 监听第三步 webpack-dev-server/client 发送的 webpackHotUpdate 消息

调用 webpack/lib/HotModuleReplacement.runtime（简称 HMR runtime）中的 check 方法，检测是否有新的更新

在 check 过程中会利用 webpack/lib/JsonpMainTemplate.runtime（简称 jsonp runtime）中的两个方法 hotDownloadUpdateChunk 和 hotDownloadManifest

第二个方法是调用 AJAX 向服务端请求是否有更新的文件，如果有将发更新的文件列表返回客户端

而第一个方法是通过 jsonp 请求最新的模块代码，然后将代码返回给 HMR runtime，HMR runtime 会根据返回的新模块代码做进一步处理，可能是刷新页面，也可能是对模块进行热更新

值得注意的是，两次请求的都是使用上一次的 hash 值拼接的请求文件名，hotDownloadManifest 方法返回的是最新的 hash 值，hotDownloadUpdateChunk 方法返回的就是最新 hash 值对应的代码块。然后将新的代码块返回给 HMR runtime，进行模块热更新

注意，在这里各方功能实现了解耦

1. websocket 实现的是 webpack-dev-server 的客户端和服务端的通信，它们之间传递的是更新文件的 hash 值而不是代码信息
2. webpack/hot/dev-server 负责监听 websocket 信息变化
3. webpack/lib/HotModuleReplacement.runtime 调用更新检测
4. webpack/lib/JsonpMainTemplate.runtime 调用请求获取更新的文件 or 模块代码

### 第五步：模块热更新

```js
// webpack/lib/HotModuleReplacement.runtime
function hotApply() {
  // ...
  var idx;
  var queue = outdatedModules.slice();
  while (queue.length > 0) {
    moduleId = queue.pop();
    module = installedModules[moduleId];
    // ...
    // remove module from cache
    delete installedModules[moduleId];
    // when disposing there is no need to call dispose handler
    delete outdatedDependencies[moduleId];
    // remove "parents" references from all children
    for (j = 0; j < module.children.length; j++) {
      var child = installedModules[module.children[j]];
      if (!child) continue;
      idx = child.parents.indexOf(moduleId);
      if (idx >= 0) {
        child.parents.splice(idx, 1);
      }
    }
  }
  // ...
  // insert new code
  for (moduleId in appliedUpdate) {
    if (Object.prototype.hasOwnProperty.call(appliedUpdate, moduleId)) {
      modules[moduleId] = appliedUpdate[moduleId];
    }
  }
  // ...
}
```

从上面 hotApply 方法可以看出，模块热替换主要分三个阶段

第一个阶段是找出 outdatedModules 和 outdatedDependencies

第二个阶段从缓存中删除过期的模块和依赖

第三个阶段是将新的模块添加到 modules 中，当下次调用 `__webpack_require__` (webpack 重写的 require 方法)方法的时候，就是获取到了新的模块代码了

模块热更新的错误处理，如果在热更新过程中出现错误，热更新将回退到刷新浏览器，这部分代码在 dev-server 代码中，作为 HMR 的失败兜底策略

dev-server 先验证是否有更新，没有代码更新的话，重载浏览器。如果在 hotApply 的过程中出现 abort 或者 fail 错误，也进行重载浏览器

### 第六步：业务代码执行

当用新的模块代码替换老的模块后，但是我们的业务代码并不能知道代码已经发生变化，也就是说，当 hello.js 文件修改后，我们需要在 index.js 文件中调用 HMR 的 accept 方法，添加模块更新后的处理函数，及时将 hello 方法的返回值插入到页面中。代码如下：

```js
// index.js
if (module.hot) {
  module.hot.accept("./hello.js", function () {
    div.innerHTML = hello();
  });
}
```

注意：在 Webpack HMR 框架中，module.hot.accept 函数只能捕获当前模块对应子孙模块的更新事件，不支持反向 or 跨子树传递，与事件冒泡过程基本相似

### 总结

最后再回顾一下，Webpack 的 HMR 特性有两个重点，一是监听文件变化并通过 WebSocket 发送变更消息;二是需要客户端提供配合，通过 module.hot.accept 接口明确告知 Webpack 如何执行代码替换

## Tree Shaking

Webpack 在 v5 版本之后已经开始广泛使用 Tree Shaking 这一技术

Tree-Shaking 是一种基于 ES Module 规范的 Dead Code Elimination 技术，它会在运行过程中静态分析模块之间的导入导出，确定 ESM 模块中哪些导出值未被其它模块使用，并将其删除，以此实现打包产物的优化

参考链接 1：https://zhuanlan.zhihu.com/p/472733451

参考链接 2：https://blog.csdn.net/qiwoo_weekly/article/details/120072705

### Dead Code

Tree Shaking 的本质实际上是为了消除无用的 js 代码（Dead Code），减少加载文件体积，使其整体执行时间更短

Dead Code 的定义如下：

- 代码不可到达，不会执行
- 代码执行的结果不会被用到
- 代码中某变量只有写，没有读操作

### 实现前提

Webpack 实现 Tree Shaking 是有前提的：

- Tree Shaking 的执行环境宿主一般是 Node 而不是浏览器
- 若 JavaScript 是模块化的，那么必须遵循 ES6 Module 规范，而不是 CommonJS 或其他，主要是因为 ES6 Module 可以静态分析的，而在 CommonJs、AMD、CMD 等旧版本的 JavaScript 模块化方案中，导入导出行为是高度动态，难以预测的
- 通过作用域分析，分析出代码里变量所属的作用域以及他们之间的引用关系，进而可以推导出变量和导入依赖变量的引用关系
- 将 mode 选项为"production"，以启用 tree shaking 和 minification （代码压缩）
- 确保没有把 compiler 将 es6 模块语法转换为 CommonJS 模块。这一块很重要，在你使用 babel-loader 或者 ts-loader 编译代码时，一定要保留 import 和 export

### 实现原理

首先，Tree-Shaking 分两大步：

1. 「标记」出模块导出值，看哪些没有被使用过
2. 使用 Terser「删除」掉没有用到的导出语句

第一步又分三个步骤：

1. Make 阶段，收集导出变量并记录到模块依赖图 ModuleGraph 变量中
2. Seal 阶段，遍历 ModuleGraph 标记模块导出变量有没有被使用
3. 生成产物时，若变量没有被其他模块使用时则删除对应的导出语句

### 标记效果

webpack 负责对代码进行标记，把 import & export 标记为 3 类：

- 所有 import 标记为 `/* harmony import */`
- 被使用过的 export 标记为`/* harm export([type])*/` ，其中`[type]` 和 webpack 内部相关，可能是 binding，immutable 等等。
- 未被使用过的 import 标记为 `/* unused harmony export [FuncName] */`，其中`[FuncName]` 为 export 的方法名称

[实例说明](https://misaka10032.oss-cn-chengdu.aliyuncs.com/Webpack/tree-shaking.jpg)

以上图为例：

bye 没有被使用，被标记为 `/* unused harmony export bye*/`

hello 被使用为正常的 `/*harmony export(imutable) */`

标记完成后，使用 Terser 直接清除并压缩代码

### 副作用

副作用是函数式编程的一个概念，是指当调用函数时，除了返回函数值之外，还会对调用函数产生附加的影响

```js
const setTitle = () => {
  //
  document.title = "xxx";
};
const a = setTitle();
```

以上可知，虽然 a 变量没有被其他地方使用，但由于副作用，如果将其删除。

会导致 document.title 没有成功被设置导致出现 bug。

造成这一结果，浅层原因是 Webpack 的 Tree Shaking 逻辑停留在代码静态分析层面，只是浅显地判断：

- 模块导出变量是否被其它模块引用
- 引用模块的主体代码中有没有出现这个变量

没有进一步，从语义上分析模块导出值是不是真的被有效使用。

更深层次的原因则是 JavaScript 的赋值语句并不「纯」，视具体场景有可能产生意料之外的副作用，例如：

```js
import { bar, foo } from "./bar";

let count = 0;

const mock = {};

Object.defineProperty(mock, "f", {
  set(v) {
    mock._f = v;
    count += 1;
  },
});

mock.f = foo;

console.log(count);
```

示例中，对 mock 对象施加的 Object.defineProperty 调用，导致 mock.f = foo 赋值语句对 count 变量产生了副作用，这种场景下即使用复杂的动态语义分析也很难在确保正确副作用的前提下，完美地 Shaking 掉所有无用的代码枝叶。

因此，在使用 Webpack 时开发者需要有意识地规避这些无意义的重复赋值操作

### 副作用规避

1. 使用`#pure`标注纯函数调用

与赋值语句类似，JavaScript 中的函数调用语句也可能产生副作用，因此默认情况下 Webpack 并不会对函数调用做 Tree Shaking 操作。不过，开发者可以在调用语句前添加 /_#**PURE**_/ 备注，明确告诉 Webpack 该次函数调用并不会对上下文环境产生副作用，例如：

![副作用规避1](https://misaka10032.oss-cn-chengdu.aliyuncs.com/Webpack/sideEffect-1.png)

示例中，foo('be retained') 调用没有带上 /_#**PURE**_/ 备注，代码被保留；作为对比，foo('be removed') 带上 Pure 声明后则被 Tree Shaking 删除

2. 禁止 Babel 转译模块导入导出语句

Babel 是一个非常流行的 JS 代码转换器，允许将 ES6+的代码优雅降级为 ES5，但它提供的部分功能会使 Tree Shaking 失效，比如 Babel 将 ESM 风格语句转译为 CJS 风格语句，就会导致静态分析失效

因此，在 Webpack 中使用 babel-loader 时，建议将 babel-preset-env 的 modules 设置为 false，关闭模块导入导出语句的转译

3. 优化导出值的粒度

Tree Shaking 逻辑作用在 ESM 的 export 语句上，因此对于下面这种导出场景：

```js
export default {
  bar: "bar",
  foo: "foo",
};
```

即使实际上只用到 default 导出值的其中一个属性，整个 default 对象依然会被完整保留。所以实际开发中，应该尽量保持导出值颗粒度和原子性，上例代码的优化版本：

```js
const bar = "bar";
const foo = "foo";

export { bar, foo };
```

4. 使用支持 TreeShaking 的包

如果可以的话，应尽量使用支持 Tree Shaking 的 npm 包

例如，使用 lodash-es 替代 lodash，或者使用 babel-plugin-lodash 实现类似效果
