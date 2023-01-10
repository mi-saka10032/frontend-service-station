---
title: 虚拟DOM和diff算法
order: 4
category: false
tag:
  - 虚拟DOM
  - diff算法
---

## 源头-snabbdom

snabbdom 是著名的虚拟 DOM 库，是 diff 算法的鼻祖，Vue 源码借鉴了 snabbdom

snabbdom 源码用 TS 编写，npm 上提供 build 构建后的 JS 源码 `npm i -D snabbdom`

## 虚拟 DOM

### 真实 DOM 与虚拟 DOM

真实 DOM：就是 HTML 中的 DOM 结构

```html
<div class="box">
  <h3>我是一个标题</h3>
  <ul>
    <li>牛奶</li>
    <li>咖啡</li>
    <li>可乐</li>
  </ul>
</div>
```

虚拟 DOM：用 JS 对象描述 DOM 的层次结构，DOM 中的一切属性在虚拟 DOM 中有对应的属性

```json
{
  "sel": "div",
  "data": {
    "class": { "box": true }
  },
  "children": [
    {
      "sel": "h3",
      "text": "我是一个标题"
    },
    {
      "sel": "ul",
      "children": [
        { "sel": "li", "text": "牛奶" },
        { "sel": "li", "text": "咖啡" },
        { "sel": "li", "text": "可乐" }
      ]
    }
  ]
}
```

### diff 是发生在虚拟 DOM 上的

新虚拟 DOM 和老虚拟 DOM 进行 diff（精细化比较），算出应该如何最小量更新，最后反映到真实 DOM 上

![真实虚拟DOM比较](https://misaka10032.oss-cn-chengdu.aliyuncs.com/Vue/1673315780304.jpg)

### 构建函数 h

h 函数用来产生虚拟节点 VNode

调用：

`h('a', { props: { href: 'https://www.baidu.com' }}, '百度')`

生成：

`{ "sel": "a", "data": { "props": { "href": "https://www.baidu.com" } }, "text": "百度" }`

它表示真正的 DOM 节点：

`<a href="https://www.baidu.com">百度</a>`

#### 创建虚拟节点 VNode

```js
import {
  init,
  classModule,
  propsModule,
  styleModule,
  eventListenersModule,
  h,
} from "snabbdom";

// 创建出patch函数
const patch = init([
  classModule,
  propsModule,
  styleModule,
  eventListenersModule,
]);

// 创建虚拟节点
const myVNode1 = h("a", { props: { href: "https://www.baidu.com" } }, "百度");
console.log(myVNode1);
```

![VNode输出结果](https://misaka10032.oss-cn-chengdu.aliyuncs.com/Vue/1673319184885.jpg)

#### 虚拟节点上树

```js
import {
  init,
  classModule,
  propsModule,
  styleModule,
  eventListenersModule,
  h,
} from "snabbdom";

// 创建出patch函数
const patch = init([
  classModule,
  propsModule,
  styleModule,
  eventListenersModule,
]);

// 创建虚拟节点
const myVNode1 = h(
  "a",
  {
    props: {
      href: "https://www.baidu.com",
      target: "_blank",
    },
  },
  "百度"
);
console.log(myVNode1);

// 虚拟节点上树
const container = document.getElementById("container");
patch(container, myVNode1);
```

#### h 函数嵌套

```js
h("ul", {}, [h("li", {}, "牛奶"), h("li", {}, "咖啡"), h("li", {}, "可乐")]);
```

虚拟 DOM：

```json
{
  "sel": "ul",
  "data": {},
  "children": [
    { "sel": "li", "text": "牛奶" },
    { "sel": "li", "text": "咖啡" },
    { "sel": "li", "text": "可乐" }
  ]
}
```

#### 手写 h 函数

1.函数重载

参数有多种情况

```js
h("div");
h("div", "文字");
h("div", []);
h("div", h());
h("div", {}, []);
h("div", {}, "文字");
h("div", {}, h());
// ...
```
