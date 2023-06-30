---
title: 性能指标优化
order: 3

tag:
  - 性能指标
  - FCP
  - LCP
---

Web 页面的性能好坏直观判断可以通过性能监测工具来实现，现在以 Chrome 提供的 Lighthouse 为例，分析构成一个页面的各项性能指标参数

## 介绍

**Lighthouse 是什么**

Lighthouse 是一个开源的自动化工具，用来测试页面性能

**为什么要用 Lighthouse**

Web 性能可以直接影响业务指标，例如转化率和用户满意度

通过使用 Lighthouse，分析收集各种应用页面性能指标，并进行评估，以此我们可以根据评估结果进行针对性优化，不断提升用户体验

**使用方法**

官方提供了 4 种使用方式：

Chrome 开发者工具

Node CLi

Node Module

Chrome 扩展

### 开发者工具

1. 在 chrome 浏览器中打开你需要测试的网站，按 f12 进入开发者调试模式
2. 找到 Lighthouse-点击 generate report,它会对页面进行相关性能的检查，最终生成报告

### 使用 Node-Cli

1. 安装 node 8 或更高版本
2. 全局安装 lighthouse `npm install -g lighthouse`
3. 使用终端输入命令

```sh
npx lighthouse 你需要测试的url地址 --locale zh --quiet --chrome-flags="--headless"  --only-categories=performance  --preset=desktop
```

4. 等待一段时间后会在当前目录生成报告

### 性能报告图例

![性能报告图](https://misaka10032.oss-cn-chengdu.aliyuncs.com/performance/1676600558440.jpg)

## 指标详解

用户最关注、影响最大的是 FCP、FID，影响用户体验的是 CLS。这三个指标很重要

![性能指标进程图](https://misaka10032.oss-cn-chengdu.aliyuncs.com/performance/performance-flux.png)

### FP

FP（First Paint）：首次渲染

表示浏览器从开始请求网站到屏幕渲染第一个像素点的时间

### FCP

FCP（First Contentful Paint）：首次内容渲染

表示浏览器渲染出第一个内容的时间

这个内容可以是文本、图片或 SVG 等，不包括 iframe 和白色背景的 canvas

### SI

SP（Speed Index）：速度指数

表明网页内容的可见填充速度

SI 衡量页面加载期间内容的视觉显示速度

### LCP

LCP（Largest Contentful Paint）：最大内容绘制

标记了渲染出最大文本或图片的时间

LCP 是测量感知加载速度的一个以用户为中心的**重要指标**

### TTI

TTI（Time to Interactive）：可交互时间

指标测量页面从开始加载到主要子资源完成渲染，并能够快速、可靠地响应用户输入所需的时间

虽然 TTI 可以在实际情况进行测量，但是因为用户交互会影响网页的 TTI，从而导致报告存在误差。如果需要了解页面的实际交互，应该测量 FID

### TBT

TBT（Total Blocking Time）：总阻塞时间

指标测量 FCP 与 TTI 之间的总时间，这期间，主线程被阻塞的时间过长，无法作出输入响应

因为 TBT 指标涉及到 TTI，所以了解实际交互最好还是测量 FID

### FID

FID（First Input Delay）：首次输入延迟

首次输入延迟是一个测量加载响应度的以用户为中心的**重要指标**

FID 指标有助于衡量用户对网站交互性和响应度的第一印象，因为该项指标将用户尝试与无响应页面进行交互时的体验进行了量化，低 FID 会有助于让用户确信页面的有效度

FIC 测量从用户第一次与页面交互（例如当他们单击链接、点按按钮或使用 JS 控件）直到浏览器对交互作出响应，并实际能够开始处理事件处理程序所经过的时间

### CLS

CLS（Cumulative Layout Shift）：累积布局偏移

CLS 是测量视觉稳定性的一个以用户为中心的**重要指标**

CLS 测量整个页面生命周期内发生的所有意外布局偏移中最大一连串的布局偏移分数，通常指一些嵌入式广告、文本闪烁、动态注入的内容等

## 指标优化

性能瓶颈和指标参数的优化主要分析几个比较重要的参数，结合实际项目开发

### FCP 优化

FP 和 FCP 的优化相似

1. 所有初始化用不到的 js 文件全部走异步加载（defer 或 async），需要走 cdn 的第三方插件放到页面底部（防止页面对 html 和 css 解析阻塞）
2. js 拆包，打包工具将异步代码拆包，保证每个路由只加载当前路由对应的 js 代码
3. 优化文件大小，打包工具自动执行代码压缩
4. 优化项目结构，在保证可维护性的基础上，尽量减少初始化组件的加载数量
5. 网络协议层面的优化，gzip、cdn 等。gzip 可以由打包工具执行压缩，服务器开启配置即可
6. 应用层协议优化，采用域名分片技术突破 6 个 TCP 连接限制或采用 HTTP2

提高 FCP 的核心理念：减少初始化视图内容，减少初始化下载资源大小，避免 js 阻塞

### LCP 优化

图片、视频以及大量文本绘制完成后就会报告 LCP

1. 本地图片使用在线压缩工具进行压缩
2. 压缩图片、视频，转换格式，使用图像 CDN
3. 资源预加载，给予特定资源`<link rel="preload" href="img.png">`的标签来预先获取资源。注意这些资源优先级不能高于关键的 css、js 等资源
4. 图片懒加载

### SI 优化

只要提高 LCP 和 FCP，SI 的时间就会有显著提高

1. 压缩减小 js 的执行
2. 降低样式计算复杂度、避免复杂布局和扰动
3. 使用 web workers

其他指标参数的优化基本相似，都是围绕减小体积、减少执行时间、降低复杂度、减少请求数量等手段展开的
