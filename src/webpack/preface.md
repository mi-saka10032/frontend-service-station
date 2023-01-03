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

node.js：require模块，但浏览器并不支持


### 让浏览器支持模块化

早期：browserify	requirejs打包工具

requirejs：define方法

ES6：import export