---
title: Fiber
order: 2
category: false
tag:
  - Fiber
  - 单向链表
  - 深度优先
  - 屏幕刷新率
  - 让渡执行权
---

## React 与 Vue 的区别

首先，我们需要明确一点，就是 React 跟 Vue 存在一个很大差别的地方：

**Vue 的更新粒度是组件级别的，得益于响应式原理，Vue 能快速地识别出当前更新来源于哪个组件，并只针对于该组件以及受该组件 props 影响的子组件进行定向更新，所以更新速度相对较快**

**React 没有响应式更新！！！是基于单向 state 数据流的自顶向下的全节点判断比较式更新，通过 diff 算法比较得出存在 state 或 props 变化的组件，默认对该组件及其子组件进行更新**

**在 React 的 v16 版本之前，React 的 diff 更新策略为深度嵌套的虚拟 DOM 树，每次更新都会触发 diff 算法进行循环递归式节点判断，并且这个步骤是同步不可中断的，这就导致了当项目中的内容或节点数量极其庞大时，每次更新都会牵一发而动全身，引发用时较长的更新判断，非常影响用户体验**

## 帧率与优化

### 性能瓶颈

再延续上面更新用时的话题，详细讨论一下 React16 之前存在的问题：JS 执行时间问题

浏览器刷新频率为 60Hz，大概 16.6 毫秒渲染一次，而 JS 线程和渲染线程是互斥的，所以如果 JS 线程执行任务时间超过 16.6ms 的话，就会导致掉帧卡顿，解决方案就是 React 利用空闲时间进行更新，不影响渲染进程渲染

React 团队针对这个问题给出的解决方案就是：把一个耗时任务切分成一个个小任务，分布在每一帧里，也称为时间切片

### 屏幕刷新率

目前大多数设备的屏幕刷新率为 60 次/秒

浏览器渲染动画或页面的每一帧的速率也需要跟设备屏幕的刷新率保持一致

页面是一帧一帧绘制出来的，当每秒绘制的帧数（FPS）达到 60 时，页面是流畅的。小于这个值时，用户会感觉到卡顿

每个帧的预算时间是 16.66 毫秒（1 秒/60）

1s60 帧，所以每一帧分到的时间就是 1000/60 ≈ 16ms，所以我们书写代码时力求不让一帧的工作量超过 16ms

### 帧

每个帧的开头包括样式计算、布局和绘制

JS 执行 JS 引擎和页面渲染引擎在同一个渲染线程，GUI 渲染和 JS 执行两者互斥

如果某个任务执行时间过长，浏览器会推迟渲染

![帧执行过程](https://misaka10032.oss-cn-chengdu.aliyuncs.com/React/lifeofframe.jpg)

### requestIdleCallback

我们希望快速响应用户，让用户觉得够快，不能阻塞用户的交互

requestIdleCallback 使开发者能够在主事件循环上执行后台和低优先级工作，而不会影响延迟关键事件，如动画和输入响应

正常帧任务完成后没超过 16ms，说明时间有富余，此时就会执行 requestIdleCallback 里注册的任务

![requestIdleCallback流程](https://misaka10032.oss-cn-chengdu.aliyuncs.com/React/cooperativescheduling.jpg)

以下是一个实现了 requestIdleCallback 的 demo，可以打开控制台查看按钮点击后的结果

::: normal-demo requestIdleCallback

```html
<button id="btn">点击开始验证requestIdleCallback</button>
```

```js
function sleep(duration) {
  for (let t = Date.now(); Date.now() - t <= duration; ) {}
}
const works = [
  () => {
    console.log("第一个任务开始");
    sleep(1000);
    console.log("第一个任务结束");
  },
  () => {
    console.log("第二个任务开始");
    sleep(500);
    console.log("第二个任务结束");
  },
  () => {
    console.log("第三个任务开始");
    sleep(100);
    console.log("第三个任务结束");
  },
];
function performUnitOfWork() {
  let work = works.shift();
  work();
}
function workLoop(deadline) {
  // 一帧是16.6ms，浏览器执行完高优先级之后，如果还有时间，会执行workLoop
  console.log("本帧的剩余时间是", deadline.timeRemaining());
  // 如果有剩余时间并且还有剩余任务就进入循环调用任务
  while (deadline.timeRemaining() > 1 && works.length > 0) {
    performUnitOfWork();
  }
  // 如果没有剩余时间就会跳出循环，要判断是否还有剩余任务
  if (works.length > 0) {
    console.log(
      `只剩下${deadline.timeRemaining()}ms，时间不足，等待浏览器下次空闲时调用`
    );
    requestIdleCallback(workLoop);
  }
}
const btn = document.querySelector("#btn");
btn.onclick = () => {
  requestIdleCallback(workLoop);
  btn.onclick = null;
};
```

:::

**注意：因为浏览器提供的 requestIdleCallback 这个 API 存在*版本兼容性*和一些*稳定性问题*，React 团队自行实现了 requestIdleCallback 的实际效果，在这里我们直接用这个 API 来实现源码效果**

## Fiber 架构

从原有性能瓶颈出发，根据屏幕刷新率和 requestIdleCallback 的思路，在 React16 版本及以后，React 团队为我们带来了全新的 Fiber 架构

- Fiber：纤程，意为比线程更为纤细的执行单元
- 我们可以通过某些调度策略合理分配 CPU 资源，从而提高用户的响应速度
- 通过 Fiber 架构，让自己的调和过程变成可被中断，适时地让出 CPU 执行权，可以让浏览器及时地响应用户的交互

### 1.Fiber 是一个执行单元

Fiber 是一个执行单元，每次执行完一个执行单元，React 就会检查现在还剩多少时间，如果没有时间就将控制权让出去

![FiberUnit](https://misaka10032.oss-cn-chengdu.aliyuncs.com/React/fiber-unit.jpg)

### 2.Fiber 是一种数据结构

React 目前的做法是使用链表，每个虚拟节点内部表示为一个 Fiber

1. 从顶点开始遍历
2. 如果有第一个儿子，先遍历第一个儿子
3. 如果没有第一个儿子，标志着此节点遍历完成
4. 如果有弟弟遍历弟弟
5. 如果没有下一个弟弟，返回父节点标识完成父节点遍历，如果有叔叔遍历叔叔
6. 没有父节点则遍历结束

![FiberChain](https://misaka10032.oss-cn-chengdu.aliyuncs.com/React/fiber-chain.jpg)

### 3.树的遍历

对于树形结构的遍历，有两种遍历方法：

1. 深度优先（DFS）

深度优先搜索：Depth First Search

其过程简要来说是对每一个可能的分支路径深入到不能再深入为止，而且每个节点只能访问一次

应用场景有：React 虚拟 DOM 的构建；React 的 Fiber 树构建

2. 广度优先（BFS）

广度优先搜索：Breadth First Search

算法首先搜索距离为 k 的所有顶点，然后再去搜索距离为 k+1 的其他顶点

### 4.递归构建 Fiber 树

![递归构建Fiber树](https://misaka10032.oss-cn-chengdu.aliyuncs.com/React/digui-fiberTree.jpg)

## Fiber 源码

实现以上 Fiber 结构逻辑的关键点在于虚拟 DOM 树向单向链表的转化，这个链表的数据类型就是 FiberNode

### FiberRootNode

createRoot

```js
// ReactDOMRoot.js
import { createContainer } from "react-reconciler/src/ReactFiberReconciler";

function ReactDOMRoot(internalRoot) {
  this._internalRoot = internalRoot;
}

export function createRoot(container) {
  // div#root
  const root = createContainer(container);
  return new ReactDOMRoot(root);
}
```

createContainer

```js
// ReactFiberReconciler.js
import { createFiberRoot } from "./ReactFiberRoot";

export function createContainer(containerInfo) {
  return createFiberRoot(containerInfo);
}
```

createFiberRoot

```js
// ReactFiberRoot.js
function FiberRootNode(containerInfo) {
  this.containerInfo = containerInfo;
}

export function createFiberRoot(containerInfo) {
  const root = new FiberRootNode(containerInfo);
  return root;
}
```

创建结果：FiberRootNode。containerInfo 属性，本质就是真实 DOM 节点（`div#root`）

![FiberRootNode](https://misaka10032.oss-cn-chengdu.aliyuncs.com/React/FiberRootNode.jpg)

main.jsx

```jsx
import { createRoot } from "react-dom/client";

const element = (
  <h1>
    hello<span style={{ color: "red" }}>world</span>
  </h1>
);

const root = createRoot(document.getElementById("root"));
console.log(root);
```

输出结果：

![FiberRootNode输出结果](https://misaka10032.oss-cn-chengdu.aliyuncs.com/React/FiberRootNode-result.png)

### FiberNode

为 FiberRootNode.current 创建 FiberNode 节点

FiberNode 是真正与所有节点相关联的节点属性，包含大量属性值

```js
import { createHostRootFiber } from "./ReactFiber";

function FiberRootNode(containerInfo) {
  this.containerInfo = containerInfo;
}

export function createFiberRoot(containerInfo) {
  const root = new FiberRootNode(containerInfo);
  // HostRoot指的是根节点div#root
  const uninitializedFiber = createHostRootFiber();
  // 根容器的current指向当前的根fiber
  root.current = uninitializedFiber;
  // 根fiber的stateNode，真实DOM节点指向FiberRootNode
  uninitializedFiber.stateNode = root;
  return root;
}
```

createHostRootFiber

```js
import { HostRoot } from "./ReactWorkTags";
import { NoFlags } from "./ReactFiberFlags";

/**
 *
 * @param tag fiber类型，函数组件0、类组件1、原生组件5、根元素3
 * @param pendingProps 新属性，等待处理或者生效的属性
 * @param key 唯一标识
 * @constructor
 */
export function FiberNode(tag, pendingProps, key) {
  this.tag = tag;
  this.key = key;
  this.type = null; // fiber类型，来自于虚拟DOM节点的type span div a
  this.stateNode = null; // 对应真实的DOM节点

  this.return = null; // 指向父节点
  this.child = null; // 指向第一个子节点
  this.sibling = null; // 指向弟节点

  // 虚拟DOM提供pendingProps用于创建fiber节点的属性
  this.pendingProps = pendingProps; // 等待生效的属性
  this.memoizedProps = null; // 已经生效的属性

  // 每个fiber会有自己的状态，每一种fiber状态存的类型不一样
  // 类组件对应的fiber存的是类实例状态，HostRoot存的是待渲染元素
  this.memoizedState = null;
  // 每个fiber身上可能还有更新队列
  this.updateQueue = null;
  // 副作用的标识，表示要针对此Fiber节点进行何种操作
  this.flags = NoFlags;
  // 子节点对应的副作用标识
  this.subtreeFlags = NoFlags;
  // 轮替节点
  this.alternate = null;
  // We use a double buffering pooling technique because we know that we'll
  // only ever need at most two versions of a tree. We pool the "other" unused
  // node that we're free to reuse.

  // This is lazily created to avoid allocating
  // extra objects for things that are never updated. It also allows us to
  // reclaim the extra memory if needed.
}

export function createFiber(tag, pendingProps, key) {
  return new FiberNode(tag, pendingProps, key);
}

export function createHostRootFiber() {
  return createFiber(HostRoot, null, null);
}
```

输出结果：

![FiberNode输出结果](https://misaka10032.oss-cn-chengdu.aliyuncs.com/React/fiberNode-result.png)

**注意**

- 到此为止，仅仅是 div#root 创建了一个根节点处的 Fiber 节点
- 正常来说，先有虚拟 DOM -> Fiber 节点 -> 真实 DOM
- 根节点在一开始就已经存在了 div#root，所以对于根节点只需要创建 Fiber 节点即可
- current 是有特殊含义的，代表当前节点对应的 Fiber，在 render 阶段会根据组件树的结构来构建 Fiber 节点链
