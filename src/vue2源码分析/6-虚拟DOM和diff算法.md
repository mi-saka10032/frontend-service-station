---
title: 虚拟DOM和diff算法
order: 6
category: false
tag:
  - 虚拟DOM
  - diff算法
---

本章节内容参考自

[【尚硅谷】Vue 源码解析之虚拟 DOM 和 diff 算法](https://www.bilibili.com/video/BV1v5411H7gZ/?spm_id_from=333.1007.top_right_bar_window_custom_collection.content.click&vd_source=3880930731e557c1143e443a69da8ab3)

[【Vue 源码】图解 diff 算法 与 虚拟 DOM-snabbdom-最小量更新原理解析-手写源码-updateChildren](https://blog.csdn.net/weixin_44972008/article/details/115620198)

补充并完善了里面的一些 bug 和细节

注：本章节只讨论虚拟 DOM 和 diff 算法的核心逻辑，其他的内部属性挂载如`{ props: 'xxx', href: 'xxxx' }`挂载上树的实现方法不进行讨论

## 源头-snabbdom

snabbdom 是著名的虚拟 DOM 库，是 diff 算法的鼻祖，Vue 源码借鉴了 snabbdom

snabbdom 源码用 TS 编写，npm 上提供 build 构建后的 JS 源码 `npm i -D snabbdom`

外链：https://github.com/snabbdom/snabbdom

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

### diff 触发时机

新虚拟 DOM 和老虚拟 DOM 进行 diff（精细化比较），算出应该如何最小量更新，最后反映到真实 DOM 上

![真实虚拟DOM比较](https://misaka10032.oss-cn-chengdu.aliyuncs.com/Vue/1673315780304.jpg)

### diff 核心逻辑

- diff 算法的核心是最小量更新，最重要的属性是 key。key 是这个节点的唯一标识，告诉 diff 算法，在更改前它们是同一个 DOM 节点。
- **只有是同一个虚拟节点，才进行精细化比较**。否则就是暴力删除旧节点再插入新节点。（如何定义是同一个虚拟节点？选择器相同且 key 相同）
- **只进行同层比较，不进行跨层比较**。即使是同一片虚拟节点，但是跨层了，对不起，diff 不触发精细化比较，还是暴力替换。
  - 由于 diff 算法同层比较的特性，对于父节点发生变化的场景（比如父节点由`<ul>`编程了`<ol>`，其内部的节点不再精细化比较而是直接暴力替换）
  - 但是实际 Vue 开发中，极少有这种情况，大多数还是同一节点下的数据更换，所以这是**合理的优化机制**

## 简易源码实现

现在参考 snabbdom 库的实现源码，手写一个简易的虚拟 DOM 和 diff 算法库

### 基础-`h`函数

h 函数是基础，把需要渲染的文本、对象渲染为虚拟 vnode

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
// vnode.js
const vnode = (sel, data, children, text, elm) => ({
  sel,
  data,
  children,
  text,
  elm,
});
export default vnode;
```

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

### 递归-遍历生成 DOM 对象

第一阶段：生成 DOM 对象：经历 h 函数生成 vnode 之后，patch 函数调用 createElement 函数递归生成完整的 DOM 对象，最后在 patch 函数中统一挂载 DOM

![diff执行步骤](https://misaka10032.oss-cn-chengdu.aliyuncs.com/Vue/1673414374313.jpg)

当前阶段代码只实现新旧节点不同时的暴力替换

```js
// createElement.js
// 创建真正节点，将vnode创建为完整的DOM对象并返回
export default function createElement(vnode) {
  // const fragment = document.createDocumentFragment();
  const domNode = document.createElement(vnode.sel);
  // 有子节点还是有文本，需要判断
  if (
    vnode.text !== "" &&
    (vnode.children === undefined || vnode.children.length === 0)
  ) {
    // 内部是文本文字
    domNode.innerText = vnode.text;
  } else if (Array.isArray(vnode.children) && vnode.children.length > 0) {
    // 内部是子节点，需要遍历 - 递归创建节点
    for (let i = 0; i < vnode.children.length; i++) {
      // 函数的递归会在 ch 节点不存在children时进入第一个if判断而停止
      // 最终所有创建的子节点会逆序挂载上父节点vnode.elm，向外抛出一个层次分明的完整DOM
      // 由于dom对象之间浅拷贝相互引用，外部的newVNode对象的elm就是完整的DOM对象
      const ch = vnode.children[i];
      const chDOM = createElement(ch);
      domNode.appendChild(chDOM);
    }
  }
  // 插入vnode.elm
  vnode.elm = domNode;
  // 返回dom对象
  return vnode.elm;
}
```

```js
// patch.js
import vnode from "./vnode.js";
import createElement from "./createElement.js";

// oldVNode可以传入真实DOM，也可以传入h函数生成的vnode，newVNode必须是vnode
// 在页面初始化之时，oldVNode必定为真实DOM（作为承载容器）
export default function patch(oldVNode, newVNode) {
  // 判断传入的第一个参数，是DOM节点还是虚拟节点？
  if (oldVNode instanceof HTMLElement) {
    // 传入的第一个参数 oldVNode 是DOM节点，需要包装虚拟节点
    oldVNode = vnode(
      oldVNode.tagName.toLowerCase(),
      {},
      [],
      undefined,
      oldVNode
    );
  }
  // 判断oldVNode和newVNode是不是同一个节点
  if (oldVNode.key === newVNode.key && oldVNode.sel === newVNode.sel) {
    console.log("是同一节点，需要精细化比较");
  } else {
    console.log("不是同一个节点，暴力替换");
    // 递归创建dom对象，并且newVNode中的elm属性从父到子均挂载了匹配的dom对象
    const newVNodeElm = createElement(newVNode);
    const oldVNodeElm = oldVNode.elm;
    if (oldVNodeElm.parentNode && newVNodeElm) {
      // 旧节点的父节点真实存在，且新节点已创建为dom对象，直接调用DOM方法替换
      oldVNodeElm.parentNode.replaceChild(newVNodeElm, oldVNodeElm);
    }
  }
}
```

```js
// index.js
// 在index.html中创建 div#container 和 button#btn即可运行
import h from "./h.js";
import patch from "./patch.js";

const vdom1 = h("ul", {}, [
  h("li", {}, "A"),
  h("li", {}, "B"),
  h("li", {}, [h("span", {}, "哼?"), h("span", {}, "哈!")]),
  h("li", {}, "D"),
]);
const container = document.getElementById("container");
patch(container, vdom1);

const vdom2 = h("section", {}, [h("h1", {}, "新h1"), h("h2", {}, "新h2")]);

const btn = document.getElementById("btn");
btn.onclick = patch.bind(this, vdom1, vdom2);
```

### 比较-同一节点的更新策略(逻辑)

此处是整个章节中最复杂的地方，当前新旧节点为同一节点时，需要执行 diff 算法精细化比较并最小量更新

请先试想一下，新旧节点的更新是否有以下情况：

1. 新节点的增加，可能在旧节点之前、之间、之后

```js
const vdom1 = h("ul", {}, [
  h("li", { key: "A" }, "A"),
  h("li", { key: "B" }, "B"),
  h("li", { key: "C" }, "C"),
]);

const vdom2 = h("ul", {}, [
  h("li", { key: "Z" }, "Z"), // 旧节点之前追加
  h("li", { key: "A" }, "A"),
  h("li", { key: "B" }, "B"),
  h("li", { key: "D" }, "D"), // 旧节点中间追加
  h("li", { key: "C" }, "C"),
  h("li", { key: "M" }, "M"), // 旧节点之后追加
]);
```

2. 旧节点删除

```js
const vdom1 = h("ul", {}, [
  h("li", { key: "A" }, "A"),
  h("li", { key: "B" }, "B"),
  h("li", { key: "C" }, "C"),
]);

const vdom2 = h("ul", {}, [
  h("li", { key: "A" }, "A"),
  h("li", { key: "C" }, "C"),
]);
```

3. 旧节点移位

```js
const vdom1 = h("ul", {}, [
  h("li", { key: "A" }, "A"),
  h("li", { key: "B" }, "B"),
  h("li", { key: "C" }, "C"),
]);

const vdom2 = h("ul", {}, [
  h("li", { key: "C" }, "C"),
  h("li", { key: "B" }, "B"),
  h("li", { key: "A" }, "A"),
]);
```

4. 以上 3 种情况的随机排列组合...

可以看出，精细化比较与最小量更新的情况非常复杂，如果仍采用之前单纯的新旧 children 循环、递归的方法

- 因为新节点存在随机插入、旧节点存在随机删除 or 移动的情况，整体结构非常混乱，所以我们需要开辟额外的内存空间用来储存临时结构
- 新旧 children 之间需要采用双指针与双层循环，外部循环新节点 children，内部循环旧节点 children，判断节点是否需要更新，循环完之后还要判断并过滤掉已经被删除的旧节点
- 时间复杂度至少为 O(mxn)，这还是没考虑节点 children 内部嵌套 children 的情况

因此，普通的循环-递归方法非常复杂，时间和空间的开销都非常高

<br>

直接给出结论：snabbdom 采用了一种经典的 diff 算法优化策略：**四指针命中查找（双端比较）**

![四指针命中查找](https://misaka10032.oss-cn-chengdu.aliyuncs.com/Vue/20210414191540816.png)

按判断的先后顺序，分别是

1. 新前（newBefore）与旧前（oldBefore）
2. 新后（newAfter）与旧后（oldAfter）
3. 新后（newAfter）与旧前（oldBefore）
4. 新前（newBefore）与旧后（oldAfter）

循环结构分析：

- 新前和旧前的指针分别指向新节点和旧节点 children 的头部
- 新后和旧后的指针分别指向新节点和旧节点 children 的尾部
- 循环的持续条件是：旧前指针<=旧后指针 && 新前指针<=新后指针
- 循环退出后，如果旧后指针>旧前指针，则属于旧节点的指针范围内的子节点对象全部删除；如果新后指针>新前指针，则属于新节点的指针范围内的子节点全部 append 到旧节点的子节点末尾（或者追加到旧节点的子节点头部）

循环内部逻辑分析：

- 以上条件在循环中按照 1 -> 2 -> 3 -> 4 的顺序依次判断，判断指针对应的对象的 sel 和 key 值是否相同
- 当其中任意一种判断通过就不再进行后续判断了，满足条件的指针，前指针（新前 or 旧前）右移一位，后指针（新后 or 旧后）左移一位
- 当情况 3（新后与旧前）发生，那么新后指向的节点（也是旧前节点），需要移动到旧后指向的旧节点之后，旧前节点清除
- 当情况 4（新前与旧后）发生，那么新前指向的节点（也是旧后节点），需要移动到旧前指向的旧节点之前，旧后节点清除
- 如果都没有命中判断通过，再使用遍历循环来查找节点，查找成功后，按照上面的情况 4 执行节点插入，新前指针右移一位

![第一个demo图例](https://misaka10032.oss-cn-chengdu.aliyuncs.com/Vue/20210415144029858.png)

为了便于理解，现给出多种情况来分析这四种情况

#### 新前 newStart 与旧前 oldStart

如果命中 ① 了，patch 之后就移动头指针 newStart++ oldStart++

![新前与旧前](https://misaka10032.oss-cn-chengdu.aliyuncs.com/Vue/20210415165044761.png)

如果没命中就接着比较下一种情况

#### 新后 newEnd 与旧后 oldEnd

如果命中 ② 了，patch 后就移动尾指针 newEnd-- oldEnd–

![新后与旧后](https://misaka10032.oss-cn-chengdu.aliyuncs.com/Vue/20210415165115541.png)

如果没命中就接着比较下一种情况

#### 新后 newEnd 与旧前 oldStart

![新后与旧前](https://misaka10032.oss-cn-chengdu.aliyuncs.com/Vue/20210415175903445.png)

**命中 ③ 复杂情况举例——倒序**

![命中3倒序](https://misaka10032.oss-cn-chengdu.aliyuncs.com/Vue/202104151801013.png)

如果没命中就接着比较下一种情况

#### 新前 newStart 与旧后 oldEnd

如果命中 ④ 了，将 新前 newStart 指向的节点，移动到 旧前 oldStart 之前

![新前与旧后](https://misaka10032.oss-cn-chengdu.aliyuncs.com/Vue/20210415165916702.png)

如果没命中就表示四种情况都没有命中

#### 四种都没命中-遍历旧节点

遍历旧节点中的 key 值，找到了就将旧节点移动到旧前指针 oldStart 之前

![四种都没命中](https://misaka10032.oss-cn-chengdu.aliyuncs.com/Vue/20210415172642236.png)

没找到的就是新节点，创建生成新的 DOM 之后也直接插入到旧前指针 oldStart 之前

#### 循环结束之后

结束后

1.newVnode 中还有剩余

新节点中剩余的都 插入 旧节点 oldEnd 后面 或 oldStart 之前

![后面新增](https://misaka10032.oss-cn-chengdu.aliyuncs.com/Vue/20210415164815345.png)

![前面新增](https://misaka10032.oss-cn-chengdu.aliyuncs.com/Vue/20210415165004148.png)

2.oldVnode 中还有剩余节点

![后面删除](https://misaka10032.oss-cn-chengdu.aliyuncs.com/Vue/2021041516485799.png)

![前面删除](https://misaka10032.oss-cn-chengdu.aliyuncs.com/Vue/20210415164931952.png)

![最终循环结束](https://misaka10032.oss-cn-chengdu.aliyuncs.com/Vue/2021041516472238.png)

完整流程图如下：

![完整流程图](https://misaka10032.oss-cn-chengdu.aliyuncs.com/Vue/20210415222737884.png)

### 比较-同一节点的更新策略(代码)

根据上面的四指针命中查找法，实现 diff 算法代码

```js
// patch.js 增加精细化比较时的最小量更新
import vnode from "./vnode.js";
import createElement from "./createElement.js";
import patchVNode from "./patchVNode.js";

export default function patch(oldVNode, newVNode) {
  // 判断传入的第一个参数，是DOM节点还是虚拟节点？
  if (oldVNode instanceof HTMLElement) {
    // 传入的第一个参数 oldVNode 是DOM节点，需要包装虚拟节点
    oldVNode = vnode(
      oldVNode.tagName.toLowerCase(),
      {},
      [],
      undefined,
      oldVNode
    );
  }
  // 判断oldVNode和newVNode是不是同一个节点
  if (oldVNode.key === newVNode.key && oldVNode.sel === newVNode.sel) {
    console.log("是同一节点，需要精细化比较");
    // 改动
    patchVNode(oldVNode, newVNode);
  } else {
    console.log("不是同一个节点，暴力替换");
    // 递归创建dom对象，并且newVNode中的elm属性从父到子均挂载了匹配的dom对象
    const newVNodeElm = createElement(newVNode);
    const oldVNodeElm = oldVNode.elm;
    if (oldVNodeElm.parentNode && newVNodeElm) {
      // 旧节点的父节点真实存在，且新节点已创建为dom对象，直接调用DOM方法替换
      oldVNodeElm.parentNode.replaceChild(newVNodeElm, oldVNodeElm);
    }
  }
}
```

```js
// patchVNode.js 精细化比较时待处理的
import createElement from "./createElement.js";
import updateChildren from "./updateChildren.js";

export default function patchVNode(oldVNode, newVNode) {
  // 新旧节点elm赋值，便于DOM操作
  const elm = (newVNode.elm = oldVNode.elm);
  // 判断新旧vnode是否是同一个对象（引用地址相同）
  if (oldVNode === newVNode) return;
  // 判断新vnode有无text属性
  if (newVNode.text !== undefined && !newVNode.children?.length) {
    console.log("新vnode有text属性");
    if (newVNode.text !== oldVNode.text) {
      // 新旧vnode的text不同，直接让新text替换DOM中的内容，children直接消失
      elm.innerText = newVNode.text;
    }
  } else {
    console.log("新vnode没有text属性");
    // 判断旧vnode有没有children
    const fragment = document.createDocumentFragment();
    if (oldVNode.children?.length) {
      // oldVNode和newVNode均有children，最复杂的情况
      updateChildren(elm, oldVNode.children, newVNode.children);
    } else {
      // 旧vnode只有text，没有children，新vnode有children
      elm.innerHTML = "";
      // 遍历新vnode的子节点，创建dom上树
      for (let i = 0; i < newVNode.children.length; i++) {
        fragment.appendChild(createElement(newVNode.children[i]));
      }
      elm.appendChild(fragment);
    }
  }
}
```

```js
import patchVNode from "./patchVNode.js";
import createElement from "./createElement.js";

function checkSameVNode(a, b) {
  return a.sel === b.sel && a.key === b.key;
}

export default function updateChildren(parentElm, oldCh, newCh) {
  // 旧前指针
  let oldStartIndex = 0;
  // 新前指针
  let newStartIndex = 0;
  // 旧后指针
  let oldEndIndex = oldCh.length - 1;
  // 新后指针
  let newEndIndex = newCh.length - 1;
  // 旧前节点
  let oldStartVNode = oldCh[0];
  // 新前节点
  let newStartVNode = newCh[0];
  // 旧后节点
  let oldEndVNode = oldCh[oldEndIndex];
  // 新后节点
  let newEndVNode = newCh[newEndIndex];
  // keySet
  const keyMap = new Map();
  // 四指针命中查找法，循环进行条件：旧前<=旧后 && 新前<=新后
  while (oldStartIndex <= oldEndIndex && newStartIndex <= newEndIndex) {
    // 首先不是判断四种命中，而是先略过已经加了undefined标记的节点项
    if (oldStartVNode === null || oldCh[oldStartIndex] === undefined) {
      oldStartVNode = oldCh[++oldStartIndex];
    } else if (oldEndVNode === null || oldCh[oldEndIndex] === undefined) {
      oldEndVNode = oldCh[--oldEndIndex];
    } else if (newStartVNode === null || newCh[newStartIndex] === undefined) {
      newStartVNode = newCh[++newStartIndex];
    } else if (newEndVNode === null || newCh[newEndIndex] === undefined) {
      newEndVNode = newCh[--newEndIndex];
    } else if (checkSameVNode(oldStartVNode, newStartVNode)) {
      // 1.新前vs旧前
      // 再调用patchNode进入子节点内部判断其内部children再度判断
      patchVNode(oldStartVNode, newStartVNode);
      oldStartVNode = oldCh[++oldStartIndex];
      newStartVNode = newCh[++newStartIndex];
    } else if (checkSameVNode(oldEndVNode, newEndVNode)) {
      // 2.新后vs旧后
      patchVNode(oldEndVNode, newEndVNode);
      oldEndVNode = oldCh[--oldEndIndex];
      newEndVNode = newCh[--newEndIndex];
    } else if (checkSameVNode(oldStartVNode, newEndVNode)) {
      // 3.新后vs旧前
      patchVNode(oldStartVNode, newEndVNode);
      // 移动旧前节点到旧后节点后面
      parentElm.insertBefore(
        oldStartVNode.elm,
        oldEndVNode.elm.nextElementSibling
      );
      oldStartVNode = oldCh[++oldStartIndex];
      newEndVNode = newCh[--newEndIndex];
    } else if (checkSameVNode(oldEndVNode, newStartVNode)) {
      // 4.新前vs旧后
      patchVNode(oldEndVNode, newStartVNode);
      // 移动旧后节点到旧前节点前面
      parentElm.insertBefore(oldEndVNode.elm, oldStartVNode.elm);
      oldEndVNode = oldCh[--oldEndIndex];
      newStartVNode = newCh[++newStartIndex];
    } else {
      // 都没有匹配到的情况
      console.log("都没有匹配到");
      keyMap.clear();
      for (let i = oldStartIndex; i <= oldEndIndex; i++) {
        const key = oldCh[i]?.key;
        if (key !== undefined) {
          keyMap.set(key, i);
        }
      }
      // 寻找新前指针节点的key在keyMap中映射的位置序号
      const indexInOld = keyMap.get(newStartVNode.key);
      if (indexInOld) {
        // 如果非undefined，则不是新项目
        // patch本项
        const elmToMove = oldCh[indexInOld];
        patchVNode(elmToMove, newStartVNode);
        // 处理完之后当前项设为undefined
        oldCh[indexInOld] = undefined;
        // 将indexInOld指向的原旧节点移动到旧前指针之前
        parentElm.insertBefore(elmToMove.elm, oldStartVNode.elm);
      } else {
        // 如果undefined，则说明是新项，需要插入到旧前指针之前
        parentElm.insertBefore(createElement(newStartVNode), oldStartVNode.elm);
      }
      newStartVNode = newCh[++newStartIndex];
    }
  }
  // 循环结束后，新后>=新前，表明剩余待新增节点
  if (newEndIndex >= newStartIndex) {
    // 此处待新增的节点可能需要追加到待处理新前节点末尾，也可能是在节点头部
    for (let i = newStartIndex; i <= newEndIndex; i++) {
      // beforeElm为null则执行appendChild操作，不为null说明在头部执行新增插入
      const beforeElm = newCh[newEndIndex + 1]
        ? newCh[newEndIndex + 1].elm
        : null;
      parentElm.insertBefore(createElement(newCh[i]), beforeElm);
    }
  }
  // 循环结束后，旧后>=旧前，表明剩余待删除节点
  if (oldEndIndex >= oldStartIndex) {
    for (let i = oldStartIndex; i <= oldEndIndex; i++) {
      if (oldCh[i]) {
        parentElm.removeChild(oldCh[i].elm);
      }
    }
  }
}
```

## 最终完整源码

现附上完整源码，从 index.js 到最底层的 updateChildren.js

### index.js

```js
import h from "./h.js";
import patch from "./patch.js";

const vdom1 = h("ul", {}, [
  h("li", { key: "A" }, "A"),
  h("li", { key: "B" }, "B"),
  h("li", { key: "C" }, "C"),
  h("li", { key: "D" }, "D"),
  h("li", { key: "E" }, "E"),
]);
const container = document.getElementById("container");
patch(container, vdom1);

const vdom2 = h("ul", {}, [
  h("li", { key: "E" }, "E"),
  h("li", { key: "Q" }, "Q"),
  h("li", { key: "D" }, "D"),
  h("li", { key: "C" }, "C"),
  h("li", { key: "B" }, "B"),
  h("li", { key: "A" }, "A"),
]);

const vdom3 = h("ul", {}, [
  h("li", { key: "Q" }, "Q"),
  h("li", { key: "T" }, "T"),
  h("li", { key: "E" }, "E"),
  h("li", { key: "B" }, "B"),
  h("li", { key: "A" }, "A"),
  h("li", { key: "D" }, "D"),
  h("li", { key: "C" }, "C"),
  h("li", { key: "V" }, "V"),
]);

const btn = document.getElementById("btn");
btn.onclick = patch.bind(this, vdom1, vdom2);

const btn2 = document.getElementById("btn2");
btn2.onclick = patch.bind(this, vdom2, vdom3);
```

### h.js

```js
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

### vnode.js

```js
const vnode = (sel, data, children, text, elm) => ({
  sel,
  data,
  children,
  text,
  elm,
  key: data?.key,
});
export default vnode;
```

### patch.js

```js
import vnode from "./vnode.js";
import createElement from "./createElement.js";
import patchVNode from "./patchVNode.js";

export default function patch(oldVNode, newVNode) {
  // 判断传入的第一个参数，是DOM节点还是虚拟节点？
  if (oldVNode instanceof HTMLElement) {
    // 传入的第一个参数 oldVNode 是DOM节点，需要包装虚拟节点
    oldVNode = vnode(
      oldVNode.tagName.toLowerCase(),
      {},
      [],
      undefined,
      oldVNode
    );
  }
  // 判断oldVNode和newVNode是不是同一个节点
  if (oldVNode.key === newVNode.key && oldVNode.sel === newVNode.sel) {
    console.log("是同一节点，需要精细化比较");
    patchVNode(oldVNode, newVNode);
  } else {
    console.log("不是同一个节点，暴力替换");
    // 递归创建dom对象，并且newVNode中的elm属性从父到子均挂载了匹配的dom对象
    const newVNodeElm = createElement(newVNode);
    const oldVNodeElm = oldVNode.elm;
    if (oldVNodeElm.parentNode && newVNodeElm) {
      // 旧节点的父节点真实存在，且新节点已创建为dom对象，直接调用DOM方法替换
      oldVNodeElm.parentNode.replaceChild(newVNodeElm, oldVNodeElm);
    }
  }
}
```

### createElement.js

```js
// 创建真正节点，将vnode创建为完整的DOM对象并返回
export default function createElement(vnode) {
  // const fragment = document.createDocumentFragment();
  const domNode = document.createElement(vnode.sel);
  // 有子节点还是有文本，需要判断
  if (
    vnode.text !== "" &&
    (vnode.children === undefined || vnode.children.length === 0)
  ) {
    // 内部是文本文字
    domNode.innerText = vnode.text;
  } else if (Array.isArray(vnode.children) && vnode.children.length > 0) {
    // 内部是子节点，需要遍历 - 递归创建节点
    for (let i = 0; i < vnode.children.length; i++) {
      // 函数的递归会在 ch 节点不存在children时进入第一个if判断而停止
      // 最终所有创建的子节点会逆序挂载上父节点vnode.elm，向外抛出一个层次分明的完整DOM
      // 由于dom对象之间浅拷贝相互引用，外部的newVNode对象的elm就是完整的DOM对象
      const ch = vnode.children[i];
      const chDOM = createElement(ch);
      domNode.appendChild(chDOM);
    }
  }
  // 插入vnode.elm
  vnode.elm = domNode;
  // 返回dom对象
  return vnode.elm;
}
```

### patchVNode.js

```js
import createElement from "./createElement.js";
import updateChildren from "./updateChildren.js";

export default function patchVNode(oldVNode, newVNode) {
  // 新旧节点elm赋值，便于DOM操作
  const elm = (newVNode.elm = oldVNode.elm);
  // 判断新旧vnode是否是同一个对象（引用地址相同）
  if (oldVNode === newVNode) return;
  // 判断新vnode有无text属性
  if (newVNode.text !== undefined && !newVNode.children?.length) {
    console.log("新vnode有text属性");
    if (newVNode.text !== oldVNode.text) {
      // 新旧vnode的text不同，直接让新text替换DOM中的内容，children直接消失
      elm.innerText = newVNode.text;
    }
  } else {
    console.log("新vnode没有text属性");
    // 判断旧vnode有没有children
    const fragment = document.createDocumentFragment();
    if (oldVNode.children?.length) {
      // oldVNode和newVNode均有children，最复杂的情况
      updateChildren(elm, oldVNode.children, newVNode.children);
    } else {
      // 旧vnode只有text，没有children，新vnode有children
      elm.innerHTML = "";
      // 遍历新vnode的子节点，创建dom上树
      for (let i = 0; i < newVNode.children.length; i++) {
        fragment.appendChild(createElement(newVNode.children[i]));
      }
      elm.appendChild(fragment);
    }
  }
}
```

### updateChildren.js

```js
import patchVNode from "./patchVNode.js";
import createElement from "./createElement.js";

function checkSameVNode(a, b) {
  return a.sel === b.sel && a.key === b.key;
}

export default function updateChildren(parentElm, oldCh, newCh) {
  // 旧前指针
  let oldStartIndex = 0;
  // 新前指针
  let newStartIndex = 0;
  // 旧后指针
  let oldEndIndex = oldCh.length - 1;
  // 新后指针
  let newEndIndex = newCh.length - 1;
  // 旧前节点
  let oldStartVNode = oldCh[0];
  // 新前节点
  let newStartVNode = newCh[0];
  // 旧后节点
  let oldEndVNode = oldCh[oldEndIndex];
  // 新后节点
  let newEndVNode = newCh[newEndIndex];
  // keySet
  const keyMap = new Map();
  // 四指针命中查找法，循环进行条件：旧前<=旧后 && 新前<=新后
  while (oldStartIndex <= oldEndIndex && newStartIndex <= newEndIndex) {
    // 首先不是判断四种命中，而是先略过已经加了undefined标记的节点项
    if (oldStartVNode === null || oldCh[oldStartIndex] === undefined) {
      oldStartVNode = oldCh[++oldStartIndex];
    } else if (oldEndVNode === null || oldCh[oldEndIndex] === undefined) {
      oldEndVNode = oldCh[--oldEndIndex];
    } else if (newStartVNode === null || newCh[newStartIndex] === undefined) {
      newStartVNode = newCh[++newStartIndex];
    } else if (newEndVNode === null || newCh[newEndIndex] === undefined) {
      newEndVNode = newCh[--newEndIndex];
    } else if (checkSameVNode(oldStartVNode, newStartVNode)) {
      // 1.新前vs旧前
      // 再调用patchNode进入子节点内部判断其内部children再度判断
      patchVNode(oldStartVNode, newStartVNode);
      oldStartVNode = oldCh[++oldStartIndex];
      newStartVNode = newCh[++newStartIndex];
    } else if (checkSameVNode(oldEndVNode, newEndVNode)) {
      // 2.新后vs旧后
      patchVNode(oldEndVNode, newEndVNode);
      oldEndVNode = oldCh[--oldEndIndex];
      newEndVNode = newCh[--newEndIndex];
    } else if (checkSameVNode(oldStartVNode, newEndVNode)) {
      // 3.新后vs旧前
      patchVNode(oldStartVNode, newEndVNode);
      // 移动旧前节点到旧后节点后面
      parentElm.insertBefore(
        oldStartVNode.elm,
        oldEndVNode.elm.nextElementSibling
      );
      oldStartVNode = oldCh[++oldStartIndex];
      newEndVNode = newCh[--newEndIndex];
    } else if (checkSameVNode(oldEndVNode, newStartVNode)) {
      // 4.新前vs旧后
      patchVNode(oldEndVNode, newStartVNode);
      // 移动旧后节点到旧前节点前面
      parentElm.insertBefore(oldEndVNode.elm, oldStartVNode.elm);
      oldEndVNode = oldCh[--oldEndIndex];
      newStartVNode = newCh[++newStartIndex];
    } else {
      // 都没有匹配到的情况
      console.log("都没有匹配到");
      keyMap.clear();
      for (let i = oldStartIndex; i <= oldEndIndex; i++) {
        const key = oldCh[i]?.key;
        if (key !== undefined) {
          keyMap.set(key, i);
        }
      }
      // 寻找新前指针节点的key在keyMap中映射的位置序号
      const indexInOld = keyMap.get(newStartVNode.key);
      if (indexInOld) {
        // 如果非undefined，则不是新项目
        // patch本项
        const elmToMove = oldCh[indexInOld];
        patchVNode(elmToMove, newStartVNode);
        // 处理完之后当前项设为undefined
        oldCh[indexInOld] = undefined;
        // 将indexInOld指向的原旧节点移动到旧前指针之前
        parentElm.insertBefore(elmToMove.elm, oldStartVNode.elm);
      } else {
        // 如果undefined，则说明是新项，需要插入到旧前指针之前
        parentElm.insertBefore(createElement(newStartVNode), oldStartVNode.elm);
      }
      newStartVNode = newCh[++newStartIndex];
    }
  }
  // 循环结束后，新后>=新前，表明剩余待新增节点
  if (newEndIndex >= newStartIndex) {
    // 此处待新增的节点可能需要追加到待处理新前节点末尾，也可能是在节点头部
    for (let i = newStartIndex; i <= newEndIndex; i++) {
      // beforeElm为null则执行appendChild操作，不为null说明在头部执行新增插入
      const beforeElm = newCh[newEndIndex + 1]
        ? newCh[newEndIndex + 1].elm
        : null;
      parentElm.insertBefore(createElement(newCh[i]), beforeElm);
    }
  }
  // 循环结束后，旧后>=旧前，表明剩余待删除节点
  if (oldEndIndex >= oldStartIndex) {
    for (let i = oldStartIndex; i <= oldEndIndex; i++) {
      if (oldCh[i]) {
        parentElm.removeChild(oldCh[i].elm);
      }
    }
  }
}
```

## 太长不看-总结

1. Vue2 的 VDOM 系统由虚拟节点对象创建函数(h) 和 打包函数(patch)构成
2. 虚拟节点创建函数(h)的主要作用是接收 vue 实例对象，难点在于函数重载（参数排列组合数量很多），将对象属性拆解，最终输出为格式规范的虚拟节点 VNode 对象`{ sel, data: { href, src, class, style }, children, text, elm, key: data?.key,}`。VNode 最关键的特点是
   1. 每个节点内部都含有属性 key
   2. 节点内部的children数组内元素可以嵌套调用 h 函数，生成嵌套模式的 VNode
3. 打包函数(patch)主要作用有 2 点：
   1. 将 VNode 中含有 class、props、style、event 等属性的内容，在不同的生命周期或patch阶段(create、update、destroy 等)调用对应的阶段函数进行迭代，实现属性值的更新
   2. 在patch阶段中有两种情况，新旧节点的key值和挂载目标元素sel值相同，需要实现在精细化比较函数(patchVNode)对比新旧节点oldVNode和newVNode；新旧节点key值不同或sel值不同时，执行暴力替换新旧DOM元素
4. 在精细化比较函数(patchVNode)中，亦存在两种经典情况，即新节点newVNode中有无子节点的情况，其中当属newVNode和oldVNode都存在子节点(children)的情况最为复杂
5. 在新旧节点均存在children时，会执行四指针命中查找法（以下称双端比较法），在双端比较方法中，新旧子节点数组会分别从两套数组的头部和尾部开始收缩比较，经历四种命中比较方法（新前vs旧前、新后vs旧后、新后vs旧前、新前vs旧后）以及缺省的遍历查找方法（new Map，记录key <--> index映射表以查询乱序节点）更新之后，移动key值相同的节点、增加新节点、删除旧节点，执行DOM元素的最小量更新
6. Vue2的diff算法，因为只在同层级进行比较，不跨层级比较，所以是广度优先算法，时间复杂度`O(n)`，极大优化了DOM更新速度。

![patch流程图二览](https://misaka10032.oss-cn-chengdu.aliyuncs.com/Vue/20210415222737884.png)

可运行项目 demo 详见：

https://github.com/mi-saka10032/vdom-diff