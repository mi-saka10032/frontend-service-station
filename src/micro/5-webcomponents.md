---
title: WebComponents
order: 5
category: false
tag:
  - WebComponents
  - 最新微前端方案
---

微前端的几个基本要素：技术栈无关、应用隔离、独立开发

在[Single-SPA](./3-single-spa.html)中我们见识到了以 qiankun 为首的 single-SPA 框架体系煞费苦心加入了 CSS Module 和 JS 沙箱实现了应用隔离，而 HTML5 提供的 WebComponents 这个 API 实现的标签本身就是自带隔离的，所以本文主要讲讲 WebComponents

## 技术套件

WebComponents 天然具备三个强大的技术套件

1. **Template**：利用 Template 生成 DOM
2. **Shadow DOM**：利用 Shadow DOM 隔离 CSS 样式
3. **Custom Elements**：利用 Custom Elements 自定义元素，继承自 HTMLElement（DOM 类），继承该类就有了 html 的常见属性和 API，就能利用 Custom Elements 来自定义元素

## 生命周期

**connectedCallback**是 DOM 节点首次挂载时触发的生命周期钩子，只会调用一次，在这里我们从外部传入属性对组件进行修改

组件属性变化后会调用**attributeChangedCallback**，相当于组件更新的声明周期钩子

## 微前端应用

在了解 WebComponents 的能力之后，如何将它嵌入微前端呢？

在微前端的应用启动流程中：

- 路由劫持：基座应用的 router 库负责实现
- 加载器：一般是[SystemJS](https://www.npmjs.com/package/systemjs)或者[import-html-entry](https://www.npmjs.com/package/import-html-entry)获取资源包
- **包装器**：没错，WebComponents 这里正是取代了传统[single-SPA 包装器](./3-single-spa.html#路由注册（包装器）)的作用，自带生命周期钩子，为主应用提供加载器导入与卸载时机
- **应用隔离**：WebComponents 自带完美隔离，无论 js、css、dom
- 应用通信：基座应用的全局状态库分发订阅-监听

WebComponents 承担的包装器这一角色，自己就轻松实现了包装、隔离，相比传统的 single-SPA 协议省去了第三方包装、隔离，更加轻便快捷