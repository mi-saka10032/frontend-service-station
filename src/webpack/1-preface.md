---
title: 前言
order: 1
category: false
tag:
  - 打包器由来
  - 摘要
---

## 前言

js 打包器的产生由来：

### 解决作用域问题

早先：grunt gulp，任务执行器，拼接项目文件

利用立即调用函数 IIFE(Immediately invoked function expressions)

```js
(function () {
  var myName = "前端加油站";
})();

console.log(myName);

var result = function () {
  var myName = "前端加油站";
  return myName;
};

console.log(result);
```

### 解决代码拆分问题

node.js：require 模块，但浏览器并不支持

ES Modules：浏览器原生支持，Node 新版本已支持。目前 Vite 采用的拆分方式就它

### 让浏览器支持模块化

早期：browserify requirejs 打包工具

requirejs：define 方法

ES6：import export

## 学习构建工具的意义

本章节中主要讲述的是以 webpack 为基础，基于底层资源和文件的执行原理和步骤顺序、加载打包优化方法等，正式开发的项目都是基于各种框架的脚手架高度封装的 webpack，由于版本差异或封装程度差异，配置项不一定完全适用。
