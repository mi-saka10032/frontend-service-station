---
title: Vite
order: 5
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
