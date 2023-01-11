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

外链：https://github.com/snabbdom/snabbdom

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

### snabbdom 库实现

h 函数用来产生虚拟节点 VNode

调用：

`h('a', { props: { href: 'https://www.baidu.com' }}, '百度')`

生成：

`{ "sel": "a", "data": { "props": { "href": "https://www.baidu.com" } }, "text": "百度" }`

它表示真正的 DOM 节点：

`<a href="https://www.baidu.com">百度</a>`

**以下是 snabbdom 的虚拟节点从创建到上树的过程**

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

### 手写 h 函数实现

手写 h 函数需要关注两点：

1. 函数重载与参数判断
2. 函数嵌套调用

参数可能有多种情况

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

这里我们默认参数为 3 个，只判断参数有 3 个的情况

```js
// h.js
import vnode from "./vnode.js";

// 编写一个低配版h函数，这个函数必须接收3个参数，缺一不可
// 弱化了重载功能，仅判断三种形态
// 1.h('div', {}, '文字')
// 2.h('div', {}, [])
// 3.h('div', {}, h())
export default function h(sel, data, c) {
  // 检查参数个数
  if (arguments.length !== 3) {
    throw new Error("h函数必须传入3个参数");
  }
  // 检查参数c的类型
  if (typeof c === "string" || typeof c === "number") {
    // 形态1
    return vnode(sel, data, undefined, c, undefined);
  } else if (Array.isArray(c)) {
    // 形态2
    const children = [];
    for (let i = 0; i < c.length; i++) {
      // 检查c[i]必须是一个对象
      if (!(typeof c[i] === "object" && c[i].hasOwnProperty("sel"))) {
        throw new Error("传入的数组参数中有项不是h函数");
      }
      children.push(c[i]);
    }
    return vnode(sel, data, children, undefined, undefined);
  } else if (typeof c === "object" && c.hasOwnProperty("sel")) {
    // 形态3 传入的c是唯一的children
    const children = [c];
    return vnode(sel, data, children, undefined, undefined);
  } else {
    throw new Error("传入的第三个参数类型有误");
  }
}
```

```js
// index.js
import h from "./h.js";

h("div", {}, "文字");
// 函数嵌套调用
h("div", {}, [
  h("p", {}, "嘻嘻"),
  h("p", {}, "哈哈"),
  h("p", {}, "呵呵"),
  h("p", {}, h("span", {}, "嘎嘎")),
]);
h("div", {}, h("span", {}, "测试对象"));
```

注意：上面的`index.js`中第二种生成方法，并非函数递归，而是 h 函数的嵌套调用，第三个参数中每个元素都是 h 函数调用后返回的数组，再继续往内部嵌套也是如此

## diff 算法

### diff 触发时机

新虚拟 DOM 和老虚拟 DOM 进行 diff（精细化比较），算出应该如何最小量更新，最后反映到真实 DOM 上

![真实虚拟DOM比较](https://misaka10032.oss-cn-chengdu.aliyuncs.com/Vue/1673315780304.jpg)

### diff 核心

- diff 算法的核心是最小量更新，最重要的属性是 key。key 是这个节点的唯一标识，告诉 diff 算法，在更改前它们是同一个 DOM 节点。
- **只有是同一个虚拟节点，才进行精细化比较**。否则就是暴力删除旧节点再插入新节点。（如何定义是同一个虚拟节点？选择器相同且 key 相同）
- **只进行同层比较，不进行跨层比较**。即使是同一片虚拟节点，但是跨层了，对不起，diff 不触发精细化比较，还是暴力替换。
  - 由于 diff 算法同层比较的特性，对于父节点发生变化的场景（比如父节点由`<ul>`编程了`<ol>`，其内部的节点不再精细化比较而是直接暴力替换）
  - 但是实际 Vue 开发中，极少有这种情况，大多数还是同一节点下的数据更换，所以这是**合理的优化机制**

### diff 执行步骤

![diff执行步骤](https://misaka10032.oss-cn-chengdu.aliyuncs.com/Vue/1673414374313.jpg)

- 同一个节点的判断

旧节点的 key 要和新节点的 key 相同，而且旧节点的选择器要和新节点的选择器相同
