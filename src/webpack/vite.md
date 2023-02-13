---
title: Vite
order: 5
category: false
tag:
  - Vite
  - 结构分析
  - 运行机制
---

Vite 是一个由 ESBuild 搭建的快速开发服务器与一套 Rollup 打包器构成的前端构建工具

它基于原生 ES 模块提供了极快的冷启动与模块热更新

基于 Rollup 的预配置，可输出用于生产环境的高度优化过的静态资源

Vite 与 VueCli 和 Webpack 的对比详见[Vite 冷启动](../vue3/2-创建工程.html#优秀的冷启动)

## 冷启动链路

现在分析执行 vite 命令后 vite 的启动流程。参考链接：https://blog.csdn.net/qq_40716795/article/details/122975260

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

