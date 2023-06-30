---
title: Scheduler
order: 8

tag:
  - Scheduler
  - MessageChannel
  - 时间切片
  - 优先级
---

## MessageChannel

在上面的源码中，我们使用 requestIdleCallback 来实现浏览器帧渲染与 JS 优化，但是目前 requestIdleCallback 的浏览器兼容性比较差

所以目前 React 利用 MessageChannel 模拟了 requestIdleCallback，将回调延迟到绘制操作之后执行

MessageChannel API 允许我们创建一个新的消息通道，并通过它的两个 MessagePort 属性发送数据

MessageChannel 创建了一个通信的管道，这个管道有两个端口，每个端口都可以通过 postMessage 发送数据，而一个端口只要绑定了 onmessage 回调方法，就可以接收从另一个端口传过来的数据

MessageChannel 是一个宏任务

![MessageChannel](https://misaka10032.oss-cn-chengdu.aliyuncs.com/React/liu_lan_qi_zhen.jpg)

以下是一个 MessageChannel 的代码示例

```js
var channel = new MessageChannel();
var port1 = channel.port1;
var port2 = channel.port2;
port1.onmessage = function (event) {
  console.log("port1收到来自port2的数据：" + event.data);
};
port2.onmessage = function (event) {
  console.log("port2收到来自port1的数据：" + event.data);
};
port1.postMessage("发送给port2");
port2.postMessage("发送给port1");
```

## 最小堆

### 二叉树简介

二叉树：每个节点最多有两个子节点

满二叉树：除最后一层无任何子节点外，每一层上的所有节点都有两个子节点的二叉树

![满二叉树](https://misaka10032.oss-cn-chengdu.aliyuncs.com/React/manerchashu.jpg)

完全二叉树：

- 叶子节点只能出现在最下层和次下层
- 且最下层的叶子节点集中在树的左部

![完全二叉树](https://misaka10032.oss-cn-chengdu.aliyuncs.com/React/wanquanerchashu.jpg)

### 最小堆机制

- 最小堆是一种经过排序的完全二叉树
- 其中任一非终端节点的数据均不大于其左子节点和右子节点的值
- 根节点值是所有堆节点值中的最小值
- 编号关系：
  - 左子节点编号 = 父节点编号 x 2
  - 右子节点编号 = 左子节点编号 + 1
  - 父节点编号 = 子节点编号 / 2
- 索引关系
  - 左子节点索引 = (父节点索引 + 1) x 2 - 1
  - 右子节点索引 = 左子节点索引 + 1
  - 父节点索引 = (子节点索引 - 1) / 2

![最小堆](https://misaka10032.oss-cn-chengdu.aliyuncs.com/React/zui_xiao_dui_1_1643275468911.jpg)

使用最小堆的原因：

1. 设定任务队列，任务优先级越高，编号值越小
2. 使推入最小堆中的任务队列永远是优先级最高的任务对象拍在顶点，永远取出优先级最高的任务

### SchedulerMinHeap.js

方法简析

- peek：查看堆的顶点
- pop：弹出堆的顶点后需要调用 siftDown 函数向下调整堆
- push：添加新节点后需要调用 siftUp 函数向上调整堆
- siftDown：向下调整堆结构，保证最小堆
- siftUp：向上调整堆结构，保证最小堆

react\packages\scheduler\src\SchedulerMinHeap.js

```js
// 最小堆方法
export function push(heap, node) {
  const index = heap.length;
  heap.push(node);
  siftUp(heap, node, index);
}

export function peek(heap) {
  return heap.length === 0 ? null : heap[0];
}

export function pop(heap) {
  if (heap.length === 0) {
    return null;
  }
  const first = heap[0];
  const last = heap.pop();
  if (last !== first) {
    heap[0] = last;
    siftDown(heap, last, 0);
  }
  return first;
}

function siftUp(heap, node, i) {
  let index = i;
  while (index > 0) {
    const parentIndex = (index - 1) >>> 1;
    const parent = heap[parentIndex];
    if (compare(parent, node) > 0) {
      // The parent is larger. Swap positions.
      heap[parentIndex] = node;
      heap[index] = parent;
      index = parentIndex;
    } else {
      // The parent is smaller. Exit.
      return;
    }
  }
}

function siftDown(heap, node, i) {
  let index = i;
  const length = heap.length;
  const halfLength = length >>> 1;
  while (index < halfLength) {
    const leftIndex = (index + 1) * 2 - 1;
    const left = heap[leftIndex];
    const rightIndex = leftIndex + 1;
    const right = heap[rightIndex];

    // If the left or right node is smaller, swap with the smaller of those.
    if (compare(left, node) < 0) {
      if (rightIndex < length && compare(right, left) < 0) {
        heap[index] = right;
        heap[rightIndex] = node;
        index = rightIndex;
      } else {
        heap[index] = left;
        heap[leftIndex] = node;
        index = leftIndex;
      }
    } else if (rightIndex < length && compare(right, node) < 0) {
      heap[index] = right;
      heap[rightIndex] = node;
      index = rightIndex;
    } else {
      // Neither child is smaller. Exit.
      return;
    }
  }
}

function compare(a, b) {
  // Compare sort index first, then task id.
  const diff = a.sortIndex - b.sortIndex;
  return diff !== 0 ? diff : a.id - b.id;
}
```

## 时间调度与优先级

需要引入各类优先级常量，建立最小堆，管理队列任务，在[fiber-requestIdleCallback](./2-fiber.html#requestIdleCallback)中通过 requestIdleCallback 实现的方法重新实现

![时间切片](https://misaka10032.oss-cn-chengdu.aliyuncs.com/React/shi_jian_qie_pian_diao_du_1643278352662.jpg)

![多任务队列](https://misaka10032.oss-cn-chengdu.aliyuncs.com/React/duo_ge_ren_wu_1643279818108.jpg)

### SchedulerPriorities.js

src\scheduler\src\SchedulerPriorities.js

```js
export const NoPriority = 0;
export const ImmediatePriority = 1;
export const UserBlockingPriority = 2;
export const NormalPriority = 3;
export const LowPriority = 4;
export const IdlePriority = 5;
```

### Scheduler.js

src\scheduler\src\forks\Scheduler.js

```js
import { peek, pop, push } from "./SchedulerMinHeap";
import {
  NoPriority,
  ImmediatePriority,
  UserBlockingPriority,
  NormalPriority,
  LowPriority,
  IdlePriority,
} from "scheduler/src/forks/SchedulerPriorities";

// 后面再考虑实现优先队列
// export function scheduleCallback(callback) {
//     // 告诉浏览器在空余时间调用回调
//     requestIdleCallback(callback);
// }

function getCurrentTime() {
  return performance.now();
}

// Max 31 bit integer. The max integer size in V8 for 32-bit systems.
// Math.pow(2, 30) - 1
// 0b111111111111111111111111111111
const maxSigned31BitInt = 1073741823;

// Times out immediately
const IMMEDIATE_PRIORITY_TIMEOUT = -1;
// Eventually times out
const USER_BLOCKING_PRIORITY_TIMEOUT = 250;
const NORMAL_PRIORITY_TIMEOUT = 5000;
const LOW_PRIORITY_TIMEOUT = 10000;
// Never times out
const IDLE_PRIORITY_TIMEOUT = maxSigned31BitInt;

// 任务ID计数器
let taskIdCounter = 1;
// 任务最小堆
const taskQueue = [];
let scheduleHostCallback = null;
let startTime = null;
// 当前任务
let currentTask = null;
// 5ms 帧间隔时间；React每一帧向浏览器申请5ms用于自己任务执行
// 如果5ms内没有完成，react也会放弃控制权，把控制权交给浏览器
const frameInterval = 5;

const channel = new MessageChannel();
let port1 = channel.port1;
let port2 = channel.port2;
port1.onmessage = performWorkUntilDeadLine;

/**
 * 按优先级执行任务
 * @param priorityLevel
 * @param callback
 */
export function scheduleCallback(priorityLevel, callback) {
  // 获取当前时间
  const currentTime = getCurrentTime();
  // 此任务的开始时间
  const startTime = currentTime;
  // 超时时间
  let timeout;
  switch (priorityLevel) {
    case ImmediatePriority:
      timeout = IMMEDIATE_PRIORITY_TIMEOUT; // -1
      break;
    case UserBlockingPriority:
      timeout = USER_BLOCKING_PRIORITY_TIMEOUT; // 250ms
      break;
    case IdlePriority:
      timeout = IDLE_PRIORITY_TIMEOUT; // 1073741823ms
      break;
    case LowPriority:
      timeout = LOW_PRIORITY_TIMEOUT; // 10000ms
      break;
    case NormalPriority:
    default:
      timeout = NORMAL_PRIORITY_TIMEOUT; // 5000ms
      break;
  }
  // 计算此任务的过期时间
  const expirationTime = startTime + timeout;
  const newTask = {
    id: taskIdCounter++,
    callback, // 回调任务函数
    priorityLevel, // 优先级别
    startTime, // 任务的开始时间
    expirationTime, // 任务的过期时间
    sortIndex: expirationTime, // 排序依据
  };
  // 向任务最小堆里面添加任务，排序的依据是过期时间，时间最短的在队列头部
  push(taskQueue, newTask);
  // flushWork执行工作，刷新工作，执行任务
  requestHostCallback(flushWork);
  return newTask;
}

/**
 * 开始执行任务队列中的任务
 * @param startTime
 */
function flushWork(startTime) {
  return workLoop(startTime);
}

function shouldYieldToHost() {
  // 用当前时间减去开始的时间就是过去的时间
  const timeElapsed = getCurrentTime() - startTime;
  // 如果流逝或经过的时间小于5ms，那就不需要放弃执行
  return timeElapsed >= frameInterval;
}

function workLoop(startTime) {
  let currentTime = startTime;
  // 取出优先级最高的task
  currentTask = peek(taskQueue);
  while (currentTask !== null) {
    // 如果此任务的过期时间大于当前时间，也就是没有过期，并且需要放弃执行 时间片到期
    if (currentTask.expirationTime > currentTime && shouldYieldToHost()) {
      // 跳出工作循环
      break;
    }
    // 告诉浏览器要执行performConcurrentWorkOnRoot 在此触发更新
    const callback = currentTask.callback;
    if (typeof callback === "function") {
      currentTask.callback = null;
      const continuationCallback = callback();
      // 执行工作如果返回新的函数，表示当前工作未完成
      if (typeof continuationCallback === "function") {
        currentTask.callback = continuationCallback;
        return true; // 还有任务要执行
      }
      // 如果此任务已经完成，则不需要再继续执行，可以把此任务弹出
      if (currentTask === peek(taskQueue)) {
        pop(taskQueue);
      }
    } else {
      pop(taskQueue);
    }
    // 如果当前任务执行完了，或者当前任务不合法，取出下一个任务执行
    currentTask = peek(taskQueue);
  }
  // 如果循环结束还有未完成的任务，表示hasMoreWork = true
  return currentTask !== null;
}

function requestHostCallback(flushWork) {
  // 先缓存回调函数
  scheduleHostCallback = flushWork;
  // 执行工作直到截止时间
  schedulePerformWorkUntilDeadLine();
}

function schedulePerformWorkUntilDeadLine() {
  port2.postMessage(null);
}

function performWorkUntilDeadLine() {
  if (scheduleHostCallback) {
    // 先获取开始执行任务的时间
    // 表示时间片的开始
    startTime = getCurrentTime();
    // 是否有更多的工作要做
    let hasMoreWork = true;
    try {
      // 执行flushWork，并判断有没有返回值
      hasMoreWork = scheduleHostCallback(startTime);
    } finally {
      // 执行完以后说明还有更多工作要做
      if (hasMoreWork) {
        // 继续执行
        performWorkUntilDeadLine();
      } else {
        scheduleHostCallback = null;
      }
    }
  }
}

export {
  shouldYieldToHost as shouldYield,
  NoPriority,
  ImmediatePriority,
  UserBlockingPriority,
  NormalPriority,
  LowPriority,
  IdlePriority,
};
```

### ReactFiberWorkLoop.js

src\react-reconciler\src\ReactFiberWorkLoop.js

替换了原来的老 scheduleCallback 函数，更新了传入参数

加入 workLoopConcurrent 模式，与 workLoopSync 的区别是增加了判断 5ms 时间片逻辑

```js
import {
  scheduleCallback,
  NormalPriority as NormalSchedulePriority,
  shouldYield,
} from "scheduler/index";
import { createWorkInProgress } from "./ReactFiber";
import { beginWork } from "./ReactFiberBeginWork";
import { completeWork } from "./ReactFiberCompleteWork";
import {
  NoFlags,
  MutationMask,
  Placement,
  Update,
  ChildDeletion,
  Passive,
} from "react-reconciler/src/ReactFiberFlags";
import {
  commitMutationEffectsOnFiber,
  commitPassiveUnmountEffects,
  commitPassiveMountEffects,
  commitLayoutEffects,
} from "./ReactFiberCommitWork";
import { finishQueueingConcurrentUpdates } from "./ReactFiberConcurrentUpdates";
import {
  FunctionComponent,
  HostComponent,
  HostRoot,
  HostText,
} from "react-reconciler/src/ReactWorkTags";

let workInProgress = null;
let rootDoesHavePassiveEffect = false; // 此根节点上有没有useEffect类似的副作用
let rootWithPendingPassiveEffects = null; // 具有useEffect副作用的根节点 FiberRootNode，根fiber.stateNode

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
  scheduleCallback(
    NormalSchedulePriority,
    performConcurrentWorkOnRoot.bind(null, root)
  );
}

/**
 * 开始根据fiber构建fiber树，要创建真实的DOM节点，再把真实的DOM节点插入容器
 * @param {*} root
 */
function performConcurrentWorkOnRoot(root) {
  // 第一次渲染以同步的方式渲染根节点，初次渲染的时候，都是同步执行
  // 改成并发渲染
  // renderRootSync(root);
  renderRootConcurrent(root);
  // 开始进入提交阶段，就是执行副作用，修改真实DOM
  const finishedWork = root.current.alternate;
  root.finishedWork = finishedWork;
  commitRoot(root);
}

function flushPassiveEffect() {
  if (rootWithPendingPassiveEffects !== null) {
    const root = rootWithPendingPassiveEffects;
    // 执行卸载副作用 destroy
    commitPassiveUnmountEffects(root.current);
    // 执行挂载副作用 create
    commitPassiveMountEffects(root, root.current);
  }
}

function commitRoot(root) {
  const { finishedWork } = root;
  // printFinishedWork(finishedWork);
  if (
    (finishedWork.subtreeFlags & Passive) !== NoFlags ||
    (finishedWork.flags & Passive) !== NoFlags
  ) {
    if (!rootDoesHavePassiveEffect) {
      rootDoesHavePassiveEffect = true;
      scheduleCallback(NormalSchedulePriority, flushPassiveEffect);
    }
  }
  console.log("~~~~~~~~~~~~~~~~~~~");
  const subtreeHasEffects =
    (finishedWork.subtreeFlags && MutationMask) !== NoFlags;
  const rootHasEffect = (finishedWork.flags && MutationMask) !== NoFlags;
  if (subtreeHasEffects || rootHasEffect) {
    // 当DOM执行变更之后
    commitMutationEffectsOnFiber(finishedWork, root);
    // UI渲染之前：同步执行layoutEffect
    commitLayoutEffects(finishedWork, root);
    if (rootDoesHavePassiveEffect) {
      rootDoesHavePassiveEffect = false;
      rootWithPendingPassiveEffects = root;
    }
  }
  // 等DOM变更后，就可以把root的current指向新Fiber树
  root.current = finishedWork;
}

function prepareFreshStack(root) {
  workInProgress = createWorkInProgress(root.current, null);
  finishQueueingConcurrentUpdates();
}

function renderRootConcurrent(root) {
  prepareFreshStack(root);
  workLoopConcurrent();
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

function workLoopConcurrent() {
  // 如果有下一个要构建的fiber，并且时间片没有过期
  while (workInProgress !== null && !shouldYield()) {
    performUnitOfWork(workInProgress);
  }
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
    // 也就是说一个父fiber，它的所有子fiber全部完成了
    completedWork = returnFiber;
    workInProgress = completedWork;
    // 执行递归的 归阶段，当兄弟节点为空的时候执行while循环往上返回，直到根fiber时退出循环
  } while (completedWork !== null);
}

function printFinishedWork(fiber) {
  const { flags, deletions } = fiber;
  if ((flags & ChildDeletion) !== NoFlags) {
    fiber.flags &= ~ChildDeletion;
    for (let i = 0; i < deletions.length; i++) {
      console.log(
        "子节点有删除",
        deletions[i].type,
        deletions[i].memoizedProps
      );
    }
  }
  let child = fiber.child;
  while (child) {
    printFinishedWork(child);
    child = child.sibling;
  }
  if (fiber.flags !== NoFlags) {
    console.log(
      getFlags(fiber),
      getTag(fiber.tag),
      typeof fiber.type === "function" ? fiber.type.name : fiber.type,
      fiber.memoizedProps
    );
  }
}

function getFlags(fiber) {
  const { flags, deletions } = fiber;
  if (flags === Placement) {
    return "插入";
  }
  if (flags === Update) {
    return "更新";
  }
  return flags;
}

function getTag(tag) {
  switch (tag) {
    case FunctionComponent:
      return "FunctionComponent";
    case HostRoot:
      return "HostRoot";
    case HostComponent:
      return "HostComponent";
    case HostText:
      return "HostText";
    default:
      return tag;
  }
}
```

## 手写源码仓库

https://github.com/mi-saka10032/mini-react/tree/master/packages/messageChannel
