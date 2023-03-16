---
title: Fiber
order: 2
category: false
tag:
  - Fiber
  - 链表
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

为 FiberRootNode.current 创建 FiberNode 节点，根节点的 FiberNode 也称为 HostRootFiber

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

### UpdateQueue

创建完根 FiberNode 节点后，新建更新队列

更新队列为单向循环链表，头尾相连

注：更新队列采取单循环链表的原因，个人猜测应该是为了无需遍历更新队列，直接获取头部节点和尾部节点，并完成快速地新老更新队列拼接

prototype.render && updateContainer

```js
import {
  createContainer,
  updateContainer,
} from "react-reconciler/src/ReactFiberReconciler";

function ReactDOMRoot(internalRoot) {
  this._internalRoote = internalRoot;
}

ReactDOMRoot.prototype.render = function (children) {
  const root = this._internalRoote;
  updateContainer(children, root);
};

export function createRoot(container) {
  // div#root
  const root = createContainer(container);
  return new ReactDOMRoot(root);
}
```

initialUpdateQueue

```js
import { createHostRootFiber } from "./ReactFiber";
import { initialUpdateQueue } from "./ReactFiberClassUpdateQueue";

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
  initialUpdateQueue(uninitializedFiber);
  return root;
}
```

updateContainer

```js
import { createFiberRoot } from "./ReactFiberRoot";
import { createUpdate, enqueueUpdate } from "./ReactFiberClassUpdateQueue";

export function createContainer(containerInfo) {
  return createFiberRoot(containerInfo);
}

/**
 * 更新容易，把虚拟DOM Element变成真实DOM插入到container容器中
 * @param element 虚拟DOM
 * @param container DOM容器 FiberRootNode containerInfo div#root
 */
export function updateContainer(element, container) {
  // 获取当前的根fiber
  const current = container.current;
  // 创建更新
  const update = createUpdate();
  // 要更新的虚拟DOM
  update.payload = { element };
  // 添加至current根Fiber的更新队列
  const root = enqueueUpdate(current, update);
}
```

Update

```js
import { markUpdateLaneFromFiberToRoot } from "react-reconciler/src/ReactFiberConcurrentUpdate";

export function initialUpdateQueue(fiber) {
  // 创建一个新的更新队列
  const queue = {
    shared: {
      // pending是一个循环链表
      pending: null,
    },
  };
  fiber.updateQueue = queue;
}

export function createUpdate() {
  const update = {};
  return update;
}

export function enqueueUpdate(fiber, update) {
  const updateQueue = fiber.updateQueue;
  // 取出fiber上已有的老的更新链表pending
  const pending = updateQueue.shared.pending;
  if (pending === null) {
    // pending不存在则直接将新的更新链表挂载上去
    update.next = update;
  } else {
    // pending存在，注意pending为循环链表
    // 新链表update的尾部next指向老pending链表的头部（尾部的next即指向头部）
    update.next = pending.next;
    // 老pending链表尾部next指向新链表update的头部
    pending.next = update;
  }
  // 最终结果：pending要指向最后一个更新，最后一个更新next指向第一个更新，构成单向循环链表
  updateQueue.shared.pending = update;
  // 返回根节点 从当前的fiber到根节点（涉及到优先级队列，此处暂时不考虑优先级）
  return markUpdateLaneFromFiberToRoot(fiber);
}
```

markUpdateLaneFromFiberToRoot

```js
/**
 * 此文件本来还需要考虑处理优先级问题
 * 现在只实现找到根节点的功能
 */
import { HostRoot } from "react-reconciler/src/ReactWorkTags";

export function markUpdateLaneFromFiberToRoot(sourceFiber) {
  let node = sourceFiber; // 当前fiber
  let parent = sourceFiber.return; // 当前fiber的父fiber
  while (parent !== null) {
    node = parent;
    parent = parent.return;
  }
  // 一直找到parent为null：根节点Fiber(HostRootFiber)
  if (node.tag === HostRoot) {
    // 返回根节点的stateNode: FiberRootNode
    return node.stateNode;
  }
  return null;
}
```

main.jsx

```jsx
import { createRoot } from "react-dom/client";

const element = (
  <h1>
    hello<span style={{ color: "red" }}>world</span>
  </h1>
);

const root = createRoot(document.getElementById("root"));
// 把element虚拟DOM挂载到容器中
root.render(element);
```

![UpdateQueueResult](https://misaka10032.oss-cn-chengdu.aliyuncs.com/React/updateQueue.png)

### BeginWork

建立好更新队列后，开始创建后台节点链表 WorkInProgress，同时启动 beginWork 任务扫描虚拟 DOM（递归的递阶段），beginWork 会在子节点没有 child 时结束

首先派发更新计划

```js
import { createFiberRoot } from "./ReactFiberRoot";
import { createUpdate, enqueueUpdate } from "./ReactFiberClassUpdateQueue";
import { scheduleUpdateOnFiber } from "./ReactFiberWorkLoop";

export function createContainer(containerInfo) {
  return createFiberRoot(containerInfo);
}

/**
 * 更新容易，把虚拟DOM Element变成真实DOM插入到container容器中
 * @param element 虚拟DOM
 * @param container DOM容器 FiberRootNode containerInfo div#root
 */
export function updateContainer(element, container) {
  // 获取当前的根fiber
  const current = container.current;
  // 创建更新
  const update = createUpdate();
  // 要更新的虚拟DOM
  update.payload = { element };
  // 添加至current根Fiber的更新队列
  const root = enqueueUpdate(current, update);
  // 派发更新计划
  scheduleUpdateOnFiber(root);
}
```

第二步：首次渲染执行根节点同步渲染，做两件事：1、创建后台进程节点 workInProgress；2、调用浏览器 requestIdleCallback 开启闲时 Fiber 树重构

第三步：开启浏览器空闲时间碎片化加载的功能之后，将会循环调用 performUnitOfWork（工作单元执行方法），碎片化地执行 beginWork 方法，当然了，beginWork 方法之中藏有结束循环的条件，那就是后台进程节点 workInProgress 为 null 的时候，没有剩余的工作单元，也就结束了整个 Fiber 树的构建

```js
import { scheduleCallback } from "scheduler/index";
import { createWorkInProgress } from "./ReactFiber";
import { beginWork } from "./ReactFiberBeginWork";
// import { completeWork } from './ReactFiberCompleteWork';

let workInProgress = null;

/**
 * 计划更新root
 * 源码中此处有一个调度任务的功能
 * @param {*}root
 */
export function scheduleUpdateOnFiber(root) {
  // 确保调度执行root上的更新
  ensureRootIsScheduled(root);
}

function ensureRootIsScheduled(root) {
  // 告诉浏览器要执行performConcurrentWorkOnRoot函数，参数为root
  scheduleCallback(performConcurrentWorkOnRoot.bind(null, root));
}

/**
 * 开始根据fiber构建fiber树，要创建真实的DOM节点，再把真实的DOM节点插入容器
 * @param {*} root
 */
function performConcurrentWorkOnRoot(root) {
  // 第一次渲染以同步的方式渲染根节点，初次渲染的时候，都是同步执行
  renderRootSync(root);
}

function prepareFreshStack(root) {
  workInProgress = createWorkInProgress(root.current, null);
}

function renderRootSync(root) {
  // 开始构建fiber树
  // 双缓冲技术，页面显示区域为current映射，对应真实DOM，代表当前已经渲染完成的Fiber
  // 内存中的Fiber构建、比较、更新为workInProgress映射，表示还未生效，没有更新的DOM上的Fiber树
  // 1. current的HostRootFiber在构建过程中不作变化
  // 2. workInProgress在内存中顺序构建Fiber树
  prepareFreshStack(root);
  workLoopSync();
}

function workLoopSync() {
  while (workInProgress !== null) {
    performUnitOfWork(workInProgress);
  }
}

/**
 * 执行一个工作单元
 * @param unitOfWork
 */
function performUnitOfWork(unitOfWork) {
  // 获取新fiber对应的老fiber，是页面上显示的current的fiber
  const current = unitOfWork.alternate;
  // 完成当前fiber的子fiber链表构建
  const next = beginWork(current, unitOfWork);
  // 同步工作单元中的props
  unitOfWork.memoizedProps = unitOfWork.pendingProps;
  // 没有子节点，表示工作单元递归的 递 阶段已结束，需要return执行completeWork
  if (next === null) {
    workInProgress = null;
    // 没有子节点，表示当前fiber的beginWork已经完成，执行completeWork
  } else {
    workInProgress = next;
  }
}
```

createWorkInProgress 后台节点创建

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
  this.index = 0; // 索引初始为0

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

/**
 * 基于老fiber和新属性创建新的fiber
 * @param current 老fiber
 * @param pendingProps 新属性
 */
export function createWorkInProgress(current, pendingProps) {
  let workInProgress = current.alternate;
  // 首次渲染时为null
  if (workInProgress === null) {
    workInProgress = createFiber(current.tag, pendingProps, current.key);
    workInProgress.type = current.type;
    workInProgress.stateNode = current.stateNode;
    // 双向指针
    workInProgress.alternate = current;
    current.alternate = workInProgress;
  } else {
    workInProgress.pendingProps = pendingProps;
    workInProgress.type = current.type;
    // 副作用清空
    workInProgress.flags = NoFlags;
    workInProgress.subtreeFlags = NoFlags;
  }
  workInProgress.child = current.child;
  workInProgress.sibling = current.sibling;
  workInProgress.index = current.index;
  workInProgress.memoizedProps = current.memoizedProps;
  workInProgress.memoizedState = current.memoizedState;
  workInProgress.updateQueue = current.updateQueue;
  return workInProgress;
}
```

闲时加载

```js
// 后面再考虑实现优先队列
export function scheduleCallback(callback) {
  // 告诉浏览器在空余时间调用回调
  requestIdleCallback(callback);
}
```

然后是关键任务 beginWork，对虚拟 DOM 启动 tag 判断，不同类型的 tag 执行不同情况的 update 更新，对于当前的简单 JSX 模型，我们只判断 JSX 根组件(HostRoot--updateHostRoot)和原生标签组件(HostComponent--updateHostComponent)的情况执行更新

```js
import logger from "shared/logger";
import {
  HostComponent,
  HostRoot,
  HostText,
} from "react-reconciler/src/ReactWorkTags";
import { processUpdateQueue } from "./ReactFiberClassUpdateQueue";
import { mountChildFibers, reconcileChildFibers } from "./ReactChildFiber";
import { shouldSetTextContent } from "react-dom/src/client/ReactDOMHostConfig";

/**
 * 根据新的虚拟DOM生成新的Fiber链表
 * @param current 老的父Fiber
 * @param workInProgress 新的父Fiber
 * @param nextChildren 新的子虚拟DOM
 */
function reconcileChildren(current, workInProgress, nextChildren) {
  if (current === null) {
    // 新fiber没有老fiber，说明为首次创建挂载
    // 虚拟DOM首次创建时走这里
    workInProgress.child = mountChildFibers(workInProgress, null, nextChildren);
  } else {
    // 有老Fiber，需要做DOM-DIFF，拿老的子fiber链表和新的子虚拟DOM进行最小量更新
    // root节点首次创建时走这里
    workInProgress.child = reconcileChildFibers(
      workInProgress,
      current.child,
      nextChildren
    );
  }
}

function updateHostRoot(current, workInProgress) {
  // 需要知道的它的子虚拟DOM，知道它儿子的虚拟DOM信息
  processUpdateQueue(workInProgress); // workInProgress.memoizedState = { element  }
  const nextState = workInProgress.memoizedState;
  const nextChildren = nextState.element;
  // 协调子节点，diff算法
  // 根据新的虚拟DOM生成子fiber链表
  reconcileChildren(current, workInProgress, nextChildren);
  return workInProgress.child;
}

/**
 * 构建原生组件的子fiber链表
 * @param current 老fiber
 * @param workInProgress 新fiber
 */
function updateHostComponent(current, workInProgress) {
  const { type, pendingProps: nextProps } = workInProgress;
  let nextChildren = nextProps.children;
  // 是否直接设置文本节点，如果是则直接启动优化，不再判断children
  const isDirectTextChildren = shouldSetTextContent(type, nextProps);
  if (isDirectTextChildren) {
    nextChildren = null;
  }
  reconcileChildren(current, workInProgress, nextChildren);
  return workInProgress.child;
}

/**
 * 目标是根据虚拟DOM构建新的fiber子链表
 * @param current 老fiber
 * @param workInProgress 新fiber
 */
export function beginWork(current, workInProgress) {
  logger("beginWork", workInProgress);
  debugger;
  switch (workInProgress.tag) {
    case HostRoot:
      return updateHostRoot(current, workInProgress);
    case HostComponent:
      return updateHostComponent(current, workInProgress);
    case HostText:
      return null;
    default:
      return null;
  }
}
```

```js
export function shouldSetTextContent(type, props) {
  return (
    typeof props.children === "string" || typeof props.children === "number"
  );
}
```

对于 HostRoot，我们需要补充更新队列（考虑到下一次更新时原来的更新队列中任务可能还没执行完）

这里单向循环链表正式发挥作用，我们可以迅速地找到首尾更新节点，然后剪开变成单向链表，遍历老的单向链表更新拼接到新更新队列中，生成最新状态（仅概念层面理论，首次渲染还是不会生效）

```js
import { markUpdateLaneFromFiberToRoot } from "react-reconciler/src/ReactFiberConcurrentUpdate";
import assign from "shared/assign";

export const UpdateState = 0;

export function initialUpdateQueue(fiber) {
  // 创建一个新的更新队列
  const queue = {
    shared: {
      // pending是一个循环链表
      pending: null,
    },
  };
  fiber.updateQueue = queue;
}

export function createUpdate() {
  const update = { tag: UpdateState };
  return update;
}

export function enqueueUpdate(fiber, update) {
  const updateQueue = fiber.updateQueue;
  // 取出fiber上已有的老的更新链表pending
  const pending = updateQueue.shared.pending;
  if (pending === null) {
    // pending不存在则直接将新的更新链表挂载上去
    update.next = update;
  } else {
    // pending存在，注意pending为循环链表
    // 新链表update的尾部next指向老pending链表的头部（尾部的next即指向头部）
    update.next = pending.next;
    // 老pending链表尾部next指向新链表update的头部
    pending.next = update;
  }
  // 最终结果：pending要指向最后一个更新，最后一个更新next指向第一个更新，构成单向循环链表
  updateQueue.shared.pending = update;
  // 返回根节点 从当前的fiber到根节点（涉及到优先级队列，此处暂时不考虑优先级）
  return markUpdateLaneFromFiberToRoot(fiber);
}

/**
 * 根据老状态和更新队列中的更新计算最新状态
 * @param workInProgress 要计算的fiber
 */
export function processUpdateQueue(workInProgress) {
  const queue = workInProgress.updateQueue;
  const pendingQueue = queue.shared.pending;
  // 如果有更新，或者更新队列里有内容
  if (pendingQueue !== null) {
    // 清除等待生效的更新
    queue.shared.pending = null;
    // 拿到最后一个等待生效的更新 update = { payload: { element: 'h1' } }
    const lastPendingUpdate = pendingQueue;
    // 指向第一个更新
    const firstPendingUpdate = lastPendingUpdate.next;
    // 剪开更新链表，变成单链表
    lastPendingUpdate.next = null;
    // 获取老状态 null
    let newState = workInProgress.memoizedState;
    let update = firstPendingUpdate;
    while (update) {
      // 根据老状态和更新，计算新状态
      newState = getStateFromUpdate(update, newState);
      update = update.next;
    }
    // 把最终计算到的状态赋值给memoizedState
    workInProgress.memoizedState = newState;
  }
}

/**
 * 根据老状态和更新计算新状态
 * @param update 更新时的对象，含多种类型
 * @param prevState
 */
function getStateFromUpdate(update, prevState) {
  switch (update.tag) {
    case UpdateState:
      const { payload } = update;
      return assign({}, prevState, payload);
  }
}
```

接下来是执行更新时调用 reconcileChildren 协调子节点的函数，这里需要判断 current 是否为 null 的情况，存在两种情况：

1. 新 fiber 没有老 fiber，虚拟 DOM 中的节点首次挂载时执行 mountChildFibers
2. 存在老 fiber 需要执行 DOM-DIFF，后续的虚拟 DOM 更新会从这里执行，root 节点首次创建后协调虚拟 DOM 的根节点时也会执行 reconcileChildFibers

- 两种方法最终收束为同一个函数 createChildReconciler 的返回值，通过 shouldTracksSideEffects 副作用标识来区分
- 在分辨出首次挂载或更新的情况后，开始创建子协调器 Fiber，目前暂时只判断虚拟 DOM 的`$$typeof`为原生组件类型(REACT_ELEMENT_TYPE)，或者组件存在 children 数组的虚拟 DOM 的情况
- 完成了 reconcileChildFibers 创建完成子 Fiber 后，将子 Fiber 返回给当前后台节点 workInProgress 的 child，这里如果父 Fiber 只有一个子节点那么这个子节点就是 child，如果父 Fiber 下存在子节点数组（虚拟 DOM 的 props:children 数组），那么 children 中的第一个子节点会作为父 Fiber 的 child
- child 作为 beginWork 的返回值将结束 beginWork 的调用，这里我们称其为 next。当 next 不为空，也就是仍存在 child 的情况下，next 会继续指向给后台节点 workInProgress，继续向下查找节点 child（深度优先 DFS），直到不存在更深层次的 child，next 为 null，此时 workInProgress 设为 null，结束工作单元调用，beginWork 正式结束

注意：此处更新的情况只考虑新节点插入(Placement)的情况

```js
/**
 * @param shouldTracksSideEffects 是否跟踪副作用
 */
import { REACT_ELEMENT_TYPE } from "shared/ReactSymbols";
import { createFiberFromElement, createFiberFromText } from "./ReactFiber";
import { Placement } from "react-reconciler/src/ReactFiberFlags";
import isArray from "shared/isArray";

function createChildReconciler(shouldTracksSideEffects) {
  function reconcileSingleElement(returnFiber, currentFirstFiber, element) {
    // 初次挂载 currentFirstFiber为null，可以直接根据虚拟DOM创建新的Fiber节点
    const created = createFiberFromElement(element);
    created.return = returnFiber;
    return created;
  }

  /**
   * 设置副作用
   * @param newFiber
   * @param newIndex
   */
  function placeSingleChild(newFiber, newIndex) {
    // 如果为true，说明要添加副作用
    if (shouldTracksSideEffects) {
      // 副作用标识：插入DOM节点，在最后的提交阶段插入此节点
      // React的渲染分渲染（创建Fiber树）和提交（更新真实DOM）两个阶段
      newFiber.flags |= Placement;
    }
    return newFiber;
  }

  function placeChild(newFiber, newIndex) {
    newFiber.index = newIndex;
    if (shouldTracksSideEffects) {
      // 如果一个fiber的flags上有placement，说明此节点需要创建真实DOM，插入到父容器中
      // 如果父fiber初次挂载，shouldTracksSideEffects为false，不需要添加flags
      // 这种情况下会在完成阶段把所有子阶段全部添加到自己身上
      newFiber.flags |= Placement;
    }
  }

  function createChild(returnFiber, newChild) {
    if (
      (typeof newChild === "string" && newChild !== "") ||
      typeof newChild === "number"
    ) {
      // 创建虚拟DOM文本节点
      const created = createFiberFromText(`${newChild}`);
      created.return = returnFiber;
      return created;
    } else if (typeof newChild === "object" && newChild !== null) {
      switch (newChild.$$typeof) {
        case REACT_ELEMENT_TYPE: {
          const created = createFiberFromElement(newChild);
          created.return = returnFiber;
          return created;
        }
        default:
          break;
      }
    }
    return null;
  }

  function reconcilerChildrenArray(
    returnFiber,
    currentFirstFiber,
    newChildren
  ) {
    let resultingFirstChild = null; // 返回的第一个新儿子
    let previousNewFiber = null; // 之前的新fiber
    let newIndex = 0;
    // 遍历虚拟DOM根节点内的首层newChildren类型并生成不同fiber
    for (; newIndex < newChildren.length; newIndex++) {
      const newFiber = createChild(returnFiber, newChildren[newIndex]);
      if (newFiber === null) continue;
      // 把新fiber放到索引位置
      placeChild(newFiber, newIndex);
      if (previousNewFiber === null) {
        // 这是第一个newFiber
        resultingFirstChild = newFiber;
      } else {
        // 不是第一个newFiber
        previousNewFiber.sibling = newFiber;
      }
      // 让newFiber成为上一个子Fiber
      previousNewFiber = newFiber;
    }
    return resultingFirstChild;
  }

  /**
   * 比较协调子fibers DOM-DIFF：用老的子fiber链表和新的虚拟DOM进行比较的过程
   * @param returnFiber 新的父fiber
   * @param currentFirstFiber current一般来说指老fiber的第一个子fiber
   * @param newChild 新的子虚拟DOM
   */
  function reconcileChildFibers(returnFiber, currentFirstFiber, newChild) {
    // 现在暂时只考虑新节点只有一个的情况
    if (typeof newChild === "object" && newChild !== null) {
      switch (newChild.$$typeof) {
        case REACT_ELEMENT_TYPE:
          return placeSingleChild(
            reconcileSingleElement(returnFiber, currentFirstFiber, newChild)
          );
        default:
          break;
      }
    }
    // newChild [文本节点， span虚拟元素]
    if (isArray(newChild)) {
      return reconcilerChildrenArray(returnFiber, currentFirstFiber, newChild);
    }
    return null;
  }

  return reconcileChildFibers;
}

// 虚拟DOM初次挂载
export const mountChildFibers = createChildReconciler(false);
//老fiber更新
export const reconcileChildFibers = createChildReconciler(true);

/**
 * 根据虚拟DOM，创建Fiber节点
 * @param element
 */
export function createFiberFromElement(element) {
  const { type, key, props: pendingProps } = element;
  return createFiberFromTypeAndProps(type, key, pendingProps);
}

function createFiberFromTypeAndProps(type, key, pendingProps) {
  let tag = IndeterminateComponent;
  if (typeof type === "string") {
    // type为字符串，说明是原生组件，div p span
    tag = HostComponent;
  }
  const fiber = createFiber(tag, pendingProps, key);
  fiber.type = type;
  return fiber;
}

export function createFiberFromText(content) {
  return createFiber(HostText, content, null);
}
```

关于 logger

为了能清楚看到 beginWork 的调用顺序，我们在 beginWork 方法开始的时候加入了 logger 打印日志方法，以便我们能看到 workInProgress 深度遍历的子节点情况

```js
import * as ReactWorkTags from "react-reconciler/src/ReactWorkTags";

const ReactWorkTagsMap = new Map();
for (const tag in ReactWorkTags) {
  ReactWorkTagsMap.set(ReactWorkTags[tag], tag);
}

export default function (prefix, workInProgress) {
  let tagValue = workInProgress.tag;
  let tagName = ReactWorkTagsMap.get(tagValue);
  let str = ` ${tagName} `;
  if (tagName === "HostComponent") {
    str += ` ${workInProgress.type} `;
  } else if (tagName === "HostText") {
    str += ` ${workInProgress.pendingProps} `;
  }
  console.log(`${prefix} ${str}`);
}
```

main.jsx

```jsx
import { createRoot } from "react-dom/client";

const element = (
  <h1>
    hello<span style={{ color: "red" }}>world</span>
  </h1>
);

const root = createRoot(document.getElementById("root"));
// 把element虚拟DOM挂载到容器中
root.render(element);
```

beginWork 输出结果，注意结合[递归创建 Fiber 树](#_4-递归构建-fiber-树)查看，整个 beginWork 的循环 会在最后一个 child，也就是文本节点 hello 这个地方结束

![beginWorkResult](https://misaka10032.oss-cn-chengdu.aliyuncs.com/React/beginWork-result.jpg)

### CompleteWork

completeWork 的任务执行时间节点发生在 beginWork 的返回值为 null 的时候

在这之前我们已经了解到，beginWork 执行的是深度优先的子 Fiber 查找策略，在未能获取到下一级子 Fiber 时，beginWork 结束返回 null，执行 complete 任务更新 DOM（递归的归阶段）

此处暂时只考虑虚拟 DOM 的挂载添加操作，其余 DOM 的更新、移动、删除等操作暂不实现，因此也不存在更新副作用

首先在工作单元函数中更新 completeUnitOfWork

```js
/**
 * 执行一个工作单元
 * @param unitOfWork
 */
function performUnitOfWork(unitOfWork) {
  // 获取新fiber对应的老fiber，是页面上显示的current的fiber
  const current = unitOfWork.alternate;
  // 完成当前fiber的子fiber链表构建
  const next = beginWork(current, unitOfWork);
  // 同步工作单元中的props
  unitOfWork.memoizedProps = unitOfWork.pendingProps;
  // 没有子节点，表示工作单元递归的 递 阶段已结束，需要return执行completeWork
  if (next === null) {
    // 没有子节点，表示当前fiber的beginWork已经完成，执行completeWork
    completeUnitOfWork(unitOfWork);
  } else {
    workInProgress = next;
  }
}

function completeUnitOfWork(unitOfWork) {
  let completedWork = unitOfWork;
  do {
    // 替代fiber
    const current = completedWork.alternate;
    // 父fiber
    const returnFiber = completedWork.return;
    // 执行此fiber的完成工作
    // 如果是原生组件，就是创建真实DOM节点
    completeWork(current, completedWork);
    // 如果有弟弟，构建弟弟对应的fiber子链表
    const siblingFiber = completedWork.sibling;
    if (siblingFiber !== null) {
      // 如果存在兄弟节点，则workInProgress赋值兄弟节点，循环退出，等待下一次工作单元执行beginWork
      workInProgress = siblingFiber;
      return;
    }
    // 如果没有弟弟，说明这当前完成的就是父fiber的最后一个节点
    // 也就是说一个父fiber，所有的子fiber全部完成了
    completedWork = returnFiber;
    workInProgress = completedWork;
    // 执行递归的 归阶段，当兄弟节点为空的时候执行while循环往上返回，直到根fiber时退出循环
  } while (completedWork !== null);
}
```

然后是关键任务 completeWork，同样也是 tag 判断，对不同类型的 tag 对应的不同组件执行不同情况的 update 更新，这里暂时只实现 create 新建挂载操作

在 completeWork 中，会对虚拟 DOM 执行真实 DOM 的创建与 append 操作，并且最后会有一个向上冒泡的方法 bubbleProperties，旨在将子节点的更新副作用不断向上传递汇聚

```js
import logger, { indent } from "shared/logger";
import {
  HostComponent,
  HostRoot,
  HostText,
} from "react-reconciler/src/ReactWorkTags";
import {
  createInstance,
  createTextInstance,
  appendInitialChild,
  finalizeInitialChildren,
} from "react-dom/src/client/ReactDOMHostConfig";
import { NoFlags } from "react-reconciler/src/ReactFiberFlags";

/**
 * 把当前完成的fiber所有子节点对应真实DOM都挂在到父parent真实DOM节点上
 * @param parent 当前完成的fiber真实DOM节点
 * @param workInProgress 完成的fiber
 */
function appendAllChildren(parent, workInProgress) {
  let node = workInProgress.child;
  while (node) {
    if (node.tag === HostComponent || node.tag === HostText) {
      // 如果子节点是原生节点或文本节点
      appendInitialChild(parent, node.stateNode);
    } else if (node.child !== null) {
      // 如果第一个儿子不是原生节点，说明它可能是一个函数组件节点
      node = node.child;
      continue;
    }
    // 如果当前的节点没有弟弟
    while (node.sibling === null) {
      if (node.return === null || node.return === workInProgress) {
        return;
      }
      // 回到父节点
      node = node.return;
    }
    node = node.sibling;
  }
}

/**
 * 完成一个fiber节点
 * @param current 老fiber
 * @param workInProgress 新的构建fiber
 */
export function completeWork(current, workInProgress) {
  logger(" ".repeat(indent.number) + "completeWork", workInProgress);
  indent.number -= 2;
  const newProps = workInProgress.pendingProps;
  switch (workInProgress.tag) {
    case HostRoot:
      bubbleProperties(workInProgress);
      break;
    case HostComponent:
      // 暂时只处理初次创建或挂载的新节点逻辑
      // 创建真实的DOM节点
      const { type } = workInProgress;
      const instance = createInstance(type, newProps, workInProgress);
      // 把自己所有的儿子都添加到自己身上
      appendAllChildren(instance, workInProgress);
      workInProgress.stateNode = instance;
      finalizeInitialChildren(instance, type, newProps);
      bubbleProperties(workInProgress);
      break;
    case HostText:
      // 文本节点的props就是文本内容，直接创建真实的文本节点
      const newText = newProps;
      // 创建真实的DOM节点，并传入stateNode
      workInProgress.stateNode = createTextInstance(newText);
      // 向上冒泡属性
      bubbleProperties(workInProgress);
      break;
  }
}

/**
 * 属性冒泡，旨在向上收集子孙节点的更新副作用，当子节点不存在副作用时说明无需更新，便于diff优化
 * @param completedWork
 */
function bubbleProperties(completedWork) {
  let subtreeFlags = NoFlags;
  let child = completedWork.child;
  // 遍历当前fiber的所有子节点，把所有子节点的副作用及子节点的子节点副作用合并收集起来
  while (child !== null) {
    subtreeFlags |= child.subtreeFlags;
    subtreeFlags |= child.flags;
    child = child.sibling;
  }
  // 收集子节点的副作用，注意flags才是节点自己的副作用
  completedWork.subtreeFlags = subtreeFlags;
}
```

下面是初始化 DOM 实例和设置 prop 的方法

```js
import { setInitialProperties } from "react-dom/src/client/ReactDOMComponent";

export function shouldSetTextContent(type, props) {
  return (
    typeof props.children === "string" || typeof props.children === "number"
  );
}

export function createTextInstance(newText) {
  return document.createTextNode(newText);
}

export function createInstance(type, newProps, workInProgress) {
  const domElement = document.createElement(type);
  // 属性的添加TODO updateFiberProps(domElement, props);
  return domElement;
}

export function appendInitialChild(parent, child) {
  parent.appendChild(child);
}

export function finalizeInitialChildren(domElement, type, props, hostContext) {
  setInitialProperties(domElement, type, props);
}
```

```js
import { setValueForStyles } from "react-dom/src/client/CSSPropertyOperations";
import setTextContent from "react-dom/src/client/setTextContent";
import { setValueForProperty } from "react-dom/src/client/DOMPropertyOperations";

const STYLE = "style";
const CHILDREN = "children";

function setInitialDOMProperties(tag, domElement, nextProps) {
  for (const propKey in nextProps) {
    if (nextProps.hasOwnProperty(propKey)) {
      const nextProp = nextProps[propKey];
      if (propKey === STYLE) {
        setValueForStyles(domElement, nextProp);
      } else if (propKey === CHILDREN) {
        if (typeof nextProp === "string") {
          setTextContent(domElement, nextProp);
        } else if (typeof nextProp === "number") {
          setTextContent(domElement, nextProp + "");
        }
      } else if (nextProp !== null) {
        setValueForProperty(domElement, propKey, nextProp);
      }
    }
  }
}

export function setInitialProperties(domElement, tag, props) {
  setInitialDOMProperties(tag, domElement, props);
}
```

completeWork输出结果，除了完整的child和sibling关系之外，注意每个Fiber的stateNode均已完成DOM元素挂载（原生元素节点、文本节点）

![completeWorkResult](https://misaka10032.oss-cn-chengdu.aliyuncs.com/React/completeWork-result.jpg)

