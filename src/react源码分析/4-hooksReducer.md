---
title: Hooks-Reducer
order: 4

tag:
  - useReducer
  - 派发与更新
---

React 提供的 hooks 函数中，useReducer 提供了类似 redux 的数据状态管理功能，其底层原理大体分为三步：mountReducer -> updateReducer -> commitReducer，分别代表挂载、更新、提交更改的全过程

## mountReducer

![mountReducer](https://misaka10032.oss-cn-chengdu.aliyuncs.com/React/mountReducer.png)

### main.jsx

src\main.jsx

```jsx
import * as React from "react/index";
import { createRoot } from "react-dom/client";

const reducer = (state, action) => {
  if (action.type === "add") return state + 1;
  return state;
};

function FunctionComponent() {
  const [number, setNumber] = React.useReducer(reducer, 0);
  return <button onClick={() => setNumber({ type: "add" })}>{number}</button>;
}

const element = <FunctionComponent />;
const root = createRoot(document.getElementById("root"));
// 把element虚拟DOM挂载到容器中
root.render(element);
```

### ReactFiberHooks.js

src\react-reconciler\src\ReactFiberHooks.js

```js
import ReactSharedInternals from "shared/ReactSharedInternals";

// 全局共享对象 ReactCurrentDispatcher
const { ReactCurrentDispatcher } = ReactSharedInternals;
let currentlyRenderingFiber = null;
let workInProgressHook = null;

// 挂载hook链表
function mountWorkInProgressHook() {
  const hook = {
    memoizedState: null,
    queue: null,
    next: null,
  };
  if (workInProgressHook === null) {
    // 挂载到当前fiber的memoizedState上
    currentlyRenderingFiber.memoizedState = workInProgressHook = hook;
  } else {
    // hook环链
    workInProgressHook = workInProgressHook.next = hook;
  }
  return workInProgressHook;
}

function dispatchReducerAction(fiber, queue, action) {
  console.log("dispatchReducerAction", action);
}

const HooksDispatcherOnMountInDEV = {
  useReducer: mountReducer,
};

// 为当前的hook对象挂载初始值、更新队列、派发函数
function mountReducer(reducer, initialArg) {
  const hook = mountWorkInProgressHook();
  hook.memoizedState = initialArg;
  const queue = {
    pending: null,
    dispatch: null,
  };
  hook.queue = queue;
  const dispatch = (queue.dispatch = dispatchReducerAction.bind(
    null,
    currentlyRenderingFiber,
    queue
  ));
  return [hook.memoizedState, dispatch];
}

/**
 * 渲染函数组件
 * @param current 老fiber
 * @param workInProgress 新fiber
 * @param Component 组件定义
 * @param props 组件属性
 * @returns 虚拟DOM或者React元素
 */
export function renderWithHooks(current, workInProgress, Component, props) {
  currentlyRenderingFiber = workInProgress;
  if (current !== null && current.memoizedState !== null) {
    // TODO updateReducer
  } else {
    ReactCurrentDispatcher.current = HooksDispatcherOnMountInDEV;
  }
  const children = Component(props);
  currentlyRenderingFiber = null;
  return children;
}
```

### react\index.js

src\react\index.js

```js
export {
  __SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED,
  useReducer,
} from "./src/React";
```

### React.js

src\react\src\React.js

```js
import { useReducer } from "./ReactHooks";
import ReactSharedInternals from "./ReactSharedInternals";

export {
  useReducer,
  ReactSharedInternals as __SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED,
};
```

### ReactHooks.js

src\react\src\ReactHooks.js

```js
import ReactCurrentDispatcher from "./ReactCurrentDispatcher";

function resolveDispatcher() {
  const dispatcher = ReactCurrentDispatcher.current;
  return dispatcher;
}

export function useReducer(reducer, initialArg, init) {
  const dispatcher = resolveDispatcher();
  // dispatcher.useReducer这个方法，通过renderWithHooks中对全局对象ReactCurrentDispatcher.current设置以获得
  return dispatcher.useReducer(reducer, initialArg, init);
}
```

### ReactCurrentDispatcher.js

src\react\src\ReactCurrentDispatcher.js

```js
const ReactCurrentDispatcher = {
  current: null,
};
export default ReactCurrentDispatcher;
```

### ReactSharedInternals.js

src\react\src\ReactSharedInternals.js

```js
import ReactCurrentDispatcher from "./ReactCurrentDispatcher";

const ReactSharedInternals = {
  ReactCurrentDispatcher,
};
export default ReactSharedInternals;
```

### ReactSharedInternals.js

src\shared\ReactSharedInternals.js

```js
import * as React from "react/index";

const ReactSharedInternals =
  React.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED;
export default ReactSharedInternals;
```

### mountReducer 小结

1. 整个 mountReducer 围绕存储于 ReactCurrentDispatcher.js 中的 ReactCurrentDispatcher 对象，向外 export 相同栈地址的浅拷贝对象
2. 在`React.useReducer`中为 ReactCurrentDispatcher.current 对象的 useReducer 赋值，初始化并为当前的 Fiber.memoizedState 挂载一个包含了缓存值、更新队列、派发函数的 hook 单向环形链表
3. useReducer 最后返回一个长度为 2 的数组，对应 hook 的缓存值和派发函数

mountReducer 点击 button 的控制台输出结果：

![mountReducerResult](https://misaka10032.oss-cn-chengdu.aliyuncs.com/React/mounteReducerResult.jpg)

## updateReducer

![updateReducer](https://misaka10032.oss-cn-chengdu.aliyuncs.com/React/updateReducer.png)

### ReactFiberHooks.js

src\react-reconciler\src\ReactFiberHooks.js

```js
import ReactSharedInternals from "shared/ReactSharedInternals";
import { enqueueConcurrentHookUpdate } from "./ReactFiberConcurrentUpdates";
import { scheduleUpdateOnFiber } from "./ReactFiberWorkLoop";

const { ReactCurrentDispatcher } = ReactSharedInternals;
let currentlyRenderingFiber = null;
let workInProgressHook = null;
let currentHook = null;

function mountWorkInProgressHook() {
  const hook = {
    memoizedState: null,
    queue: null,
    next: null,
  };
  if (workInProgressHook === null) {
    currentlyRenderingFiber.memoizedState = workInProgressHook = hook;
  } else {
    workInProgressHook = workInProgressHook.next = hook;
  }
  return workInProgressHook;
}

function dispatchReducerAction(fiber, queue, action) {
  const update = {
    action,
    next: null,
  };
  const root = enqueueConcurrentHookUpdate(fiber, queue, update);
  scheduleUpdateOnFiber(root);
}

const HooksDispatcherOnMountInDEV = {
  useReducer: mountReducer,
};

function mountReducer(reducer, initialArg) {
  const hook = mountWorkInProgressHook();
  hook.memoizedState = initialArg;
  const queue = {
    pending: null,
    dispatch: null,
  };
  hook.queue = queue;
  const dispatch = (queue.dispatch = dispatchReducerAction.bind(
    null,
    currentlyRenderingFiber,
    queue
  ));
  return [hook.memoizedState, dispatch];
}

// 更新当前fiber的hook链表
function updateWorkInProgressHook() {
  if (currentHook === null) {
    const current = currentlyRenderingFiber.alternate;
    currentHook = current.memoizedState;
  } else {
    currentHook = currentHook.next;
  }
  const newHook = {
    memoizedState: currentHook.memoizedState,
    queue: currentHook.queue,
    next: null,
  };
  if (workInProgressHook === null) {
    currentlyRenderingFiber.memoizedState = workInProgressHook = newHook;
  } else {
    workInProgressHook = workInProgressHook.next = newHook;
  }
  return workInProgressHook;
}

const HooksDispatcherOnUpdateInDEV = {
  useReducer: updateReducer,
};

function updateReducer(reducer) {
  const hook = updateWorkInProgressHook();
  const queue = hook.queue;
  queue.lastRenderedReducer = reducer;
  const current = currentHook;
  const pendingQueue = queue.pending;
  let newState = current.memoizedState;
  if (pendingQueue !== null) {
    queue.pending = null;
    const first = pendingQueue.next;
    let update = first;
    do {
      if (update.hasEagerState) {
        newState = update.eagerState;
      } else {
        const action = update.action;
        newState = reducer(newState, action);
      }
      update = update.next;
    } while (update !== null && update !== first);
  }
  hook.memoizedState = queue.lastRenderedState = newState;
  return [hook.memoizedState, queue.dispatch];
}

/**
 * 渲染函数组件
 * @param current 老fiber
 * @param workInProgress 新fiber
 * @param Component 组件定义
 * @param props 组件属性
 * @returns 虚拟DOM或者React元素
 */
export function renderWithHooks(current, workInProgress, Component, props) {
  currentlyRenderingFiber = workInProgress;
  if (current !== null && current.memoizedState !== null) {
    ReactCurrentDispatcher.current = HooksDispatcherOnUpdateInDEV;
  } else {
    ReactCurrentDispatcher.current = HooksDispatcherOnMountInDEV;
  }
  const children = Component(props);
  workInProgressHook = null;
  currentHook = null;
  currentlyRenderingFiber = null;
  return children;
}
```

### ReactFiberConcurrentUpdates.js

src\react-reconciler\src\ReactFiberConcurrentUpdates.js

```js
/**
 * 此文件本来还需要考虑处理优先级问题
 * 现在只实现找到根节点的功能
 */
import { HostRoot } from "react-reconciler/src/ReactWorkTags";

const concurrentQueues = [];
let concurrentQueuesIndex = 0;

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

export function enqueueConcurrentHookUpdate(fiber, queue, update) {
  enqueueUpdate(fiber, queue, update);
  return getRootForUpdatedFiber(fiber);
}

function enqueueUpdate(fiber, queue, update) {
  concurrentQueues[concurrentQueuesIndex++] = fiber;
  concurrentQueues[concurrentQueuesIndex++] = queue;
  concurrentQueues[concurrentQueuesIndex++] = update;
}

function getRootForUpdatedFiber(sourceFiber) {
  let node = sourceFiber;
  let parent = node.return;
  while (parent !== null) {
    node = parent;
    parent = node.return;
  }
  return node.tag === HostRoot ? node.stateNode : null;
}

export function finishQueueingConcurrentUpdates() {
  const endIndex = concurrentQueuesIndex;
  concurrentQueuesIndex = 0;
  let i = 0;
  while (i < endIndex) {
    const fiber = concurrentQueues[i++];
    const queue = concurrentQueues[i++];
    const update = concurrentQueues[i++];
    if (queue !== null && update !== null) {
      const pending = queue.pending;
      if (pending === null) {
        update.next = update;
      } else {
        update.next = pending.next;
        pending.next = update;
      }
      queue.pending = update;
    }
  }
}
```

### ReactFiberWorkLoop.js

src\react-reconciler\src\ReactFiberWorkLoop.js

```js
import { scheduleCallback } from "scheduler/index";
import { createWorkInProgress } from "./ReactFiber";
import { beginWork } from "./ReactFiberBeginWork";
import { completeWork } from "./ReactFiberCompleteWork";
import { NoFlags, MutationMask } from "react-reconciler/src/ReactFiberFlags";
import { commitMutationEffectsOnFiber } from "./ReactFiberCommitWork";
import { finishQueueingConcurrentUpdates } from "./ReactFiberConcurrentUpdates";

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
  // 开始进入提交阶段，就是执行副作用，修改真实DOM
  const finishedWork = root.current.alternate;
  root.finishedWork = finishedWork;
  commitRoot(root);
}

function commitRoot(root) {
  const { finishedWork } = root;
  const subtreeHasEffects =
    (finishedWork.subtreeFlags && MutationMask) !== NoFlags;
  const rootHasEffect = (finishedWork.flags && MutationMask) !== NoFlags;
  if (subtreeHasEffects || rootHasEffect) {
    commitMutationEffectsOnFiber(finishedWork, root);
  }
  // 等DOM变更后，就可以把root的current指向新Fiber树
  root.current = finishedWork;
}

function prepareFreshStack(root) {
  workInProgress = createWorkInProgress(root.current, null);
  finishQueueingConcurrentUpdates();
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
```

### ReactFiberBeginWork.js

src\react-reconciler\src\ReactFiberBeginWork.js

```js
import logger, { indent } from "shared/logger";
import {
  FunctionComponent,
  HostComponent,
  HostRoot,
  HostText,
  IndeterminateComponent,
} from "react-reconciler/src/ReactWorkTags";
import { processUpdateQueue } from "./ReactFiberClassUpdateQueue";
import { mountChildFibers, reconcileChildFibers } from "./ReactChildFiber";
import { shouldSetTextContent } from "react-dom/src/client/ReactDOMHostConfig";
import { renderWithHooks } from "react-reconciler/src/ReactFiberHooks";

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
 * 挂载函数组件
 * @param current 老fiber
 * @param workInProgress 新fiber
 * @param Component 组件类型，函数组件的定义
 */
export function mountIndeterminateComponent(
  current,
  workInProgress,
  Component
) {
  const props = workInProgress.pendingProps;
  // 执行函数拿到返回值
  // const value = Component(props);
  const value = renderWithHooks(current, workInProgress, Component, props);
  workInProgress.tag = FunctionComponent;
  reconcileChildren(null, workInProgress, value);
  return workInProgress.child;
}

function updateFunctionComponent(
  current,
  workInProgress,
  Component,
  nextProps
) {
  const nextChildren = renderWithHooks(
    current,
    workInProgress,
    Component,
    nextProps
  );
  reconcileChildren(current, workInProgress, nextChildren);
  return workInProgress.child;
}

/**
 * 目标是根据虚拟DOM构建新的fiber子链表
 * @param current 老fiber
 * @param workInProgress 新fiber
 */
export function beginWork(current, workInProgress) {
  logger(" ".repeat(indent.number) + "beginWork", workInProgress);
  indent.number += 2;
  switch (workInProgress.tag) {
    case IndeterminateComponent:
      return mountIndeterminateComponent(
        current,
        workInProgress,
        workInProgress.type
      );
    case FunctionComponent: {
      const Component = workInProgress.type;
      const resolvedProps = workInProgress.pendingProps;
      return updateFunctionComponent(
        current,
        workInProgress,
        Component,
        resolvedProps
      );
    }
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

### ReactChildFiber.js

src\react-reconciler\src\ReactChildFiber.js

```js
/**
 * @param shouldTracksSideEffects 是否跟踪副作用
 */
import { REACT_ELEMENT_TYPE } from "shared/ReactSymbols";
import {
  createFiberFromElement,
  createFiberFromText,
  createWorkInProgress,
  FiberNode,
} from "./ReactFiber";
import { Placement, ChildDeletion } from "./ReactFiberFlags";
import isArray from "shared/isArray";
import { HostText } from "react-reconciler/src/ReactWorkTags";

function createChildReconciler(shouldTracksSideEffects) {
  function useFiber(fiber, pendingProps) {
    const clone = createWorkInProgress(fiber, pendingProps);
    clone.index = 0;
    clone.sibling = null;
    return clone;
  }

  function deleteChild(returnFiber, childToDelete) {
    if (!shouldTracksSideEffects) {
      return;
    }
    const deletions = returnFiber.deletions;
    if (deletions === null) {
      returnFiber.deletions = [childToDelete];
      returnFiber.flags |= ChildDeletion;
    } else {
      deletions.push(childToDelete);
    }
  }

  function reconcileSingleElement(returnFiber, currentFirstChild, element) {
    const key = element.key;
    let child = currentFirstChild;
    while (child !== null) {
      if (child.key === key) {
        const elementType = element.type;
        if (child.type === elementType) {
          const existing = useFiber(child, element.props);
          existing.return = returnFiber;
          return existing;
        }
      } else {
        deleteChild(returnFiber, child);
      }
      child = child.sibling;
    }

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
    if (shouldTracksSideEffects && newFiber.alternate === null) {
      // 副作用标识：插入DOM节点，在最后的提交阶段插入此节点
      // React的渲染分渲染（创建Fiber树）和提交（更新真实DOM）两个阶段
      newFiber.flags |= Placement;
    }
    return newFiber;
  }

  function reconcileSingleTextNode(returnFiber, currentFirstChild, content) {
    const created = new FiberNode(HostText, { content }, null);
    created.return = returnFiber;
    return created;
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

  function reconcileChildrenArray(returnFiber, currentFirstFiber, newChildren) {
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
   * @param currentFirstChild current一般来说指老fiber的第一个子fiber
   * @param newChild 新的子虚拟DOM
   */
  function reconcileChildFibers(returnFiber, currentFirstChild, newChild) {
    // 现在暂时只考虑新节点只有一个的情况
    if (typeof newChild === "object" && newChild !== null) {
      switch (newChild.$$typeof) {
        case REACT_ELEMENT_TYPE:
          return placeSingleChild(
            reconcileSingleElement(returnFiber, currentFirstChild, newChild)
          );
        default:
          break;
      }
      // newChild [文本节点， span虚拟元素]
      if (isArray(newChild)) {
        return reconcileChildrenArray(returnFiber, currentFirstChild, newChild);
      }
    }
    if (typeof newChild === "string") {
      return placeSingleChild(
        reconcileSingleTextNode(returnFiber, currentFirstChild, newChild)
      );
    }
    return null;
  }
  return reconcileChildFibers;
}

// 虚拟DOM初次挂载
export const mountChildFibers = createChildReconciler(false);
//老fiber更新
export const reconcileChildFibers = createChildReconciler(true);
```

### ReactFiberCompleteWork.js

src\react-reconciler\src\ReactFiberCompleteWork.js

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
  prepareUpdate,
} from "react-dom/src/client/ReactDOMHostConfig";
import { NoFlags, Update } from "react-reconciler/src/ReactFiberFlags";

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

function markUpdate(workInProgress) {
  workInProgress.flags |= Update;
}

function updateHostComponent(current, workInProgress, type, newProps) {
  const oldProps = current.memoizedProps;
  const instance = workInProgress.stateNode;
  const updatePayload = prepareUpdate(instance, type, oldProps, newProps);
  workInProgress.updateQueue = updatePayload;
  if (updatePayload) {
    markUpdate(workInProgress);
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
    case HostComponent: {
      const { type } = workInProgress;
      if (current !== null && workInProgress.stateNode !== null) {
        updateHostComponent(current, workInProgress, type, newProps);
        console.log("updatePayload", workInProgress.updateQueue);
      } else {
        // 暂时只处理初次创建或挂载的新节点逻辑
        // 创建真实的DOM节点
        const instance = createInstance(type, newProps, workInProgress);
        // 把自己所有的儿子都添加到自己身上
        appendAllChildren(instance, workInProgress);
        workInProgress.stateNode = instance;
        finalizeInitialChildren(instance, type, newProps);
      }
      bubbleProperties(workInProgress);
      break;
    }
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
```

### ReactDOMHostConfig.js

src\react-dom-bindings\src\client\ReactDOMHostConfig.js

```js
import { setInitialProperties, diffProperties } from "./ReactDOMComponent";

export function prepareUpdate(domElement, type, oldProps, newProps) {
  return diffProperties(domElement, type, oldProps, newProps);
}
```

### ReactDOMComponent.js

src\react-dom-bindings\src\client\ReactDOMComponent.js

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

export function diffProperties(domElement, tag, lastProps, nextProps) {
  let updatePayload = null;
  let propKey;
  let styleName;
  let styleUpdates = null;
  for (propKey in lastProps) {
    if (
      nextProps.hasOwnProperty(propKey) ||
      !lastProps.hasOwnProperty(propKey) ||
      lastProps[propKey] == null
    ) {
      continue;
    }
    if (propKey === STYLE) {
      const lastStyle = lastProps[propKey];
      for (styleName in lastStyle) {
        if (lastStyle.hasOwnProperty(styleName)) {
          if (!styleUpdates) {
            styleUpdates = {};
          }
          styleUpdates[styleName] = "";
        }
      }
    } else {
      (updatePayload = updatePayload || []).push(propKey, null);
    }
  }
  for (propKey in nextProps) {
    const nextProp = nextProps[propKey];
    const lastProp = lastProps != null ? lastProps[propKey] : undefined;
    if (
      !nextProps.hasOwnProperty(propKey) ||
      nextProp === lastProp ||
      (nextProp == null && lastProp == null)
    ) {
      continue;
    }
    if (propKey === STYLE) {
      if (lastProp) {
        for (styleName in lastProp) {
          if (
            lastProp.hasOwnProperty(styleName) &&
            (!nextProp || !nextProp.hasOwnProperty(styleName))
          ) {
            if (!styleUpdates) {
              styleUpdates = {};
            }
            styleUpdates[styleName] = "";
          }
        }
        for (styleName in nextProp) {
          if (
            nextProp.hasOwnProperty(styleName) &&
            lastProp[styleName] !== nextProp[styleName]
          ) {
            if (!styleUpdates) {
              styleUpdates = {};
            }
            styleUpdates[styleName] = nextProp[styleName];
          }
        }
      } else {
        if (!styleUpdates) {
          if (!updatePayload) {
            updatePayload = [];
          }
          updatePayload.push(propKey, styleUpdates);
        }
        styleUpdates = nextProp;
      }
    } else if (propKey === CHILDREN) {
      if (typeof nextProp === "string" || typeof nextProp === "number") {
        (updatePayload = updatePayload || []).push(propKey, "" + nextProp);
      }
    } else {
      (updatePayload = updatePayload || []).push(propKey, nextProp);
    }
  }
  if (styleUpdates) {
    (updatePayload = updatePayload || []).push(STYLE, styleUpdates);
  }
  return updatePayload;
}
```

### updateReducer 小结

1. 在派发函数 dispatchReducerAction 中，基于当前 Fiber、更新队列和 action 对象，生成一个长度为 3n 的数组 concurrentQueues，每三个索引分别存储渲染对象 fiber、更新队列 queue、更新内容 update。最后回归到 HostRoot 根节点开启调度计划更新 scheduleUpdateOnFiber
2. 在调度计划中，函数调用至 prepareFreshStack，开始串起更新任务，调用 finishQueueingConcurrentUpdates。将 concurrentQueues 每三个一组，将更新队列 queue 中的 pending 负载以链表形式环链，queue.pending 永远指向最后一个更新，queue.pending.next 指向第一个更新
3. prepareFreshStack 结束，进入 workLoopSync，执行工作单元调度 performUnitOfWork，首先执行 beginWork
   1. beginWork 阶段，由于 IndeterminateComponent 类型的组件在执行挂载的时候，tag 统一转为 FunctionComponent 类型组件，因此 FunctionComponent 更新时另起一个`case FunctionComponent`，用于更新函数组件
   2. 更新函数 updateFunctionComponent 包含两大步骤，重渲染 hooks(renderWithHooks) 和 协调 DIFF 子节点(reconcileChildren)
   3. 以下是 renderWithHooks 的过程：
      1. 通过判断老 Fiber 是否为空且老 Fiber 的 memoizedState 是否为空来判断给 ReactCurrentDispatcher.current 中 useReducer 属性赋予为 mountReducer 或 updateReducer。此处函数更新，老 Fiber 不为空且 Fiber.memoizedState 为已创建的 hook 对象，所以函数组件如果重新执行渲染，原先的 useReducer 函数由挂载函数变更为更新函数，进入 updateReducer 调用
      2. updateReducer 阶段，根据当前 Fiber 和当前 Hooks 依序进行更新操作，获取老 Fiber.alternate 的已有的 fiberHook 链表，顺序取出当前需要执行的 currentHook
      3. 由于 queue.pending 在 finishQueueingConcurrentUpdates 时已完成链接，所以从头开始循环 currentHook.queue.pending，顺序执行调用 useReducer 中存储的 reducer 方法，退出循环时将最新的状态值 newState 赋给 hook.memoizedState
      4. 返回最新的 hook.memoizedState 和 dispatch 派发函数组成的数组，等待函数组件执行渲染，并清除 FiberHooks 工作栈中的 hook 和 fiber 等
   4. 以下是 reconcileChildren 的过程：
      1. 由于老 fiber(workInProgress.alternate)不为 null，所以开始进行新老 child 的 diff 比较
      2. 暂时还是以单元素节点协调 reconcileSingleElement 为例，比较判断单节点的 key 和 type 是否相同，如果相同则基于老 Fiber 属性对老 child 拷贝一个新 Fiber(createWorkInProgress && useFiber 克隆)并直接返回。此处比较关键的是新 Fiber 继承了老 Fiber 的 memoizedState、memoizedProps、StateNode 等属性，无需再次初始化
   5. beginWork 执行完毕，进入 completeWork 执行
      1. 对于需要完成更新的原生标签组件，判断老的 Fiber 节点 fiber.alternate 和新 Fiber 的 DOM 元素 workInProgress.stateNode 是否不为 null，如果成立则执行原生组件更新 updateHostComponent
      2. 对新 Fiber.pendingProps 和老 Fiber.memoizedProps 进行全属性比较与遍历，生成一个长度为 2n 的数组 updatePayload，偶数索引(0.2.4.6.8)元素代表属性名 propKey，奇数索引(1.3.5.7.9)元素代表属性值 propValue。注意对不同属性的 propKey 需要执行不同的生成策略，如 style 属性、children 属性等
      3. 最后为新 Fiber(workInProgress)的 updateQueue 挂载 updatePayload，并标记更新副作用，让最终的 workInProgress.flags 变更为 MutationMask(插入 | 更新)
4. 现阶段最后挂载的 workInProgress.updateQueue，就是 updateReducer 阶段的最终产物了

updateReducer 点击 button 的控制台输出结果：

![updateReducerResult](https://misaka10032.oss-cn-chengdu.aliyuncs.com/React/updateReducerResult.jpg)

## commitReducer

### ReactFiberCompleteWork.js

src\react-reconciler\src\ReactFiberCompleteWork.js

执行函数组件副作用冒泡

```js
import logger, { indent } from "shared/logger";
import {
  FunctionComponent,
  HostComponent,
  HostRoot,
  HostText,
} from "react-reconciler/src/ReactWorkTags";
import {
  createInstance,
  createTextInstance,
  appendInitialChild,
  finalizeInitialChildren,
  prepareUpdate,
} from "react-dom/src/client/ReactDOMHostConfig";
import { NoFlags, Update } from "react-reconciler/src/ReactFiberFlags";

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

function markUpdate(workInProgress) {
  workInProgress.flags |= Update;
}

function updateHostComponent(current, workInProgress, type, newProps) {
  const oldProps = current.memoizedProps;
  const instance = workInProgress.stateNode;
  const updatePayload = prepareUpdate(instance, type, oldProps, newProps);
  workInProgress.updateQueue = updatePayload;
  if (updatePayload) {
    markUpdate(workInProgress);
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
    case HostComponent: {
      const { type } = workInProgress;
      if (current !== null && workInProgress.stateNode !== null) {
        updateHostComponent(current, workInProgress, type, newProps);
        console.log("updatePayload", workInProgress.updateQueue);
      } else {
        // 暂时只处理初次创建或挂载的新节点逻辑
        // 创建真实的DOM节点
        const instance = createInstance(type, newProps, workInProgress);
        // 把自己所有的儿子都添加到自己身上
        appendAllChildren(instance, workInProgress);
        workInProgress.stateNode = instance;
        finalizeInitialChildren(instance, type, newProps);
      }
      bubbleProperties(workInProgress);
      break;
    }
    case FunctionComponent: {
      bubbleProperties(workInProgress);
      break;
    }
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
```

### ReactFiberCommitWork.js

src\react-reconciler\src\ReactFiberCommitWork.js

```js
import {
  appendChild,
  insertBefore,
  commitUpdate,
} from "react-dom/src/client/ReactDOMHostConfig";
import {
  FunctionComponent,
  HostComponent,
  HostRoot,
  HostText,
} from "react-reconciler/src/ReactWorkTags";
import {
  MutationMask,
  Placement,
  Update,
} from "react-reconciler/src/ReactFiberFlags";

function recursivelyTraverseMutationEffects(root, parentFiber) {
  if (parentFiber.subtreeFlags & MutationMask) {
    let { child } = parentFiber;
    while (child !== null) {
      commitMutationEffectsOnFiber(child, root);
      child = child.sibling;
    }
  }
}

function commitReconciliationEffects(finishedWork) {
  const { flags } = finishedWork;
  if (flags && Placement) {
    // 进行插入操作，也就是把此fiber对应的真实DOM节点添加到父真实DOM上
    commitPlacement(finishedWork);
    // 把flags里的Placement删除
    finishedWork.flags &= ~Placement;
  }
}

function isHostParent(fiber) {
  return fiber.tag === HostComponent || fiber.tag === HostRoot; //只有根fiber或根组件节点才能作为父fiber
}

function getHostParentFiber(fiber) {
  let parent = fiber.return;
  while (parent !== null) {
    if (isHostParent(parent)) {
      return parent;
    }
    parent = parent.return;
  }
}

/**
 * 把子节点对应的真实DOM插入到父节点DOM中
 * @param node 将要插入的fiber节点
 * @param before 待insertBefore的DOM节点
 * @param parent 父真实DOM节点
 */
function insertOrAppendPlacementNode(node, before, parent) {
  const { tag } = node;
  // 判断此fiber对应的节点是不是真实DOM节点
  const isHost = tag === HostComponent || tag === HostText;
  if (isHost) {
    // 如果是的话就直接插入
    const { stateNode } = node;
    if (before) {
      insertBefore(parent, stateNode, before);
    } else {
      appendChild(parent, stateNode);
    }
  } else {
    // 如果node不是真实DOM节点，获取它的child
    const { child } = node;
    if (child !== null) {
      insertOrAppendPlacementNode(child, before, parent);
      let { sibling } = child;
      while (sibling !== null) {
        insertOrAppendPlacementNode(sibling, before, parent);
        sibling = sibling.sibling;
      }
    }
  }
}

/**
 * 找到要插入的锚点
 * 找到可以插在它前面的那个fiber对应的真实DOM
 * @param fiber
 */
function getHostSibling(fiber) {
  let node = fiber;
  siblings: while (true) {
    while (node.sibling === null) {
      if (node.return === null || isHostParent(node.return)) {
        return null;
      }
      node = node.return;
    }
    node = node.sibling;
    // 如果弟弟不是原生节点or文本节点，不是要插入的节点，需要寻找弟弟或儿子
    while (node.tag !== HostComponent || node.tag !== HostText) {
      // 如果此节点是一个将要插入的新节点，找它的弟弟，否则找儿子
      if (node.flags && Placement) {
        continue siblings;
      } else {
        node = node.child;
      }
    }
    if (!(node.flags && Placement)) {
      return node.stateNode;
    }
  }
}

/**
 * 把此fiber的真实DOM插入到父DOM里
 * @param finishedWork
 */
function commitPlacement(finishedWork) {
  const parentFiber = getHostParentFiber(finishedWork);
  switch (parentFiber.tag) {
    case HostRoot: {
      const parent = parentFiber.stateNode.containerInfo;
      // 获取最近的真实DOM节点
      const before = getHostSibling(finishedWork); // 获取最近的真实DOM节点
      insertOrAppendPlacementNode(finishedWork, before, parent);
      break;
    }
    case HostComponent: {
      const parent = parentFiber.stateNode;
      // 获取最近的真实DOM节点
      const before = getHostSibling(finishedWork); // 获取最近的真实DOM节点
      insertOrAppendPlacementNode(finishedWork, before, parent);
      break;
    }
  }
}

/**
 * 遍历Fiber树，执行fiber上的副作用
 * @param finishedWork fiberJ节点
 * @param root 根节点
 */
export function commitMutationEffectsOnFiber(finishedWork, root) {
  const current = finishedWork.alternate;
  const flags = finishedWork.flags;
  switch (finishedWork.tag) {
    case HostRoot: {
      recursivelyTraverseMutationEffects(root, finishedWork);
      commitReconciliationEffects(finishedWork);
      break;
    }
    case FunctionComponent: {
      recursivelyTraverseMutationEffects(root, finishedWork);
      commitReconciliationEffects(finishedWork);
      break;
    }
    case HostComponent: {
      recursivelyTraverseMutationEffects(root, finishedWork);
      commitReconciliationEffects(finishedWork);
      // 识别更新副作用标识，判断执行更新
      if (flags & Update) {
        const instance = finishedWork.stateNode;
        if (instance !== null) {
          const newProps = finishedWork.memoizedProps;
          const oldProps = current !== null ? current.memoizedProps : newProps;
          const type = finishedWork.type;
          const updatePayload = finishedWork.updateQueue;
          finishedWork.updateQueue = null;
          if (updatePayload !== null) {
            commitUpdate(
              instance,
              updatePayload,
              type,
              oldProps,
              newProps,
              finishedWork
            );
          }
        }
      }
      break;
    }
    case HostText:
      // 遍历子节点，处理子节点上的副作用
      recursivelyTraverseMutationEffects(root, finishedWork);
      // 再处理自己身上的副作用
      commitReconciliationEffects(finishedWork);
      break;
    default:
      break;
  }
}
```

### ReactDOMHostConfig.js

src\react-dom-bindings\src\client\ReactDOMHostConfig.js

```js
import {
  setInitialProperties,
  diffProperties,
  updateProperties,
} from "react-dom/src/client/ReactDOMComponent";
import {
  precacheFiberNode,
  updateFiberProps,
} from "react-dom/src/client/ReactDOMComponentTree";

export function shouldSetTextContent(type, props) {
  return (
    typeof props.children === "string" || typeof props.children === "number"
  );
}

export function createTextInstance(newText) {
  return document.createTextNode(newText);
}

/**
 * 在原生组件初次挂载的时候，会通过此方法创建真实DOM
 * @param type 类型props
 * @param props 属性
 * @param internalInstanceHandle 对应的fiber
 * @returns {*}
 */
export function createInstance(type, props, internalInstanceHandle) {
  const domElement = document.createElement(type);
  // 预先缓存fiber节点到DOM节点上
  precacheFiberNode(internalInstanceHandle, domElement);
  // 属性的添加TODO
  updateFiberProps(domElement, props);
  return domElement;
}

export function appendInitialChild(parent, child) {
  parent.appendChild(child);
}

export function finalizeInitialChildren(domElement, type, props, hostContext) {
  setInitialProperties(domElement, type, props);
}

export function appendChild(parent, child) {
  parent.appendChild(child);
}

export function insertBefore(parentInstance, child, beforeChild) {
  parentInstance.insertBefore(child, beforeChild);
}

export function prepareUpdate(domElement, type, oldProps, newProps) {
  return diffProperties(domElement, type, oldProps, newProps);
}

export function commitUpdate(
  domElement,
  updatePayload,
  type,
  oldProps,
  newProps
) {
  updateProperties(domElement, updatePayload, type, oldProps, newProps);
  updateFiberProps(domElement, newProps);
}
```

### ReactDOMComponent.js

src\react-dom-bindings\src\client\ReactDOMComponent.js

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

export function diffProperties(domElement, tag, lastProps, nextProps) {
  let updatePayload = null;
  let propKey;
  let styleName;
  let styleUpdates = null;
  for (propKey in lastProps) {
    if (
      nextProps.hasOwnProperty(propKey) ||
      !lastProps.hasOwnProperty(propKey) ||
      lastProps[propKey] == null
    ) {
      continue;
    }
    if (propKey === STYLE) {
      const lastStyle = lastProps[propKey];
      for (styleName in lastStyle) {
        if (lastStyle.hasOwnProperty(styleName)) {
          if (!styleUpdates) {
            styleUpdates = {};
          }
          styleUpdates[styleName] = "";
        }
      }
    } else {
      (updatePayload = updatePayload || []).push(propKey, null);
    }
  }
  for (propKey in nextProps) {
    const nextProp = nextProps[propKey];
    const lastProp = lastProps != null ? lastProps[propKey] : undefined;
    if (
      !nextProps.hasOwnProperty(propKey) ||
      nextProp === lastProp ||
      (nextProp == null && lastProp == null)
    ) {
      continue;
    }
    if (propKey === STYLE) {
      if (lastProp) {
        for (styleName in lastProp) {
          if (
            lastProp.hasOwnProperty(styleName) &&
            (!nextProp || !nextProp.hasOwnProperty(styleName))
          ) {
            if (!styleUpdates) {
              styleUpdates = {};
            }
            styleUpdates[styleName] = "";
          }
        }
        for (styleName in nextProp) {
          if (
            nextProp.hasOwnProperty(styleName) &&
            lastProp[styleName] !== nextProp[styleName]
          ) {
            if (!styleUpdates) {
              styleUpdates = {};
            }
            styleUpdates[styleName] = nextProp[styleName];
          }
        }
      } else {
        if (!styleUpdates) {
          if (!updatePayload) {
            updatePayload = [];
          }
          updatePayload.push(propKey, styleUpdates);
        }
        styleUpdates = nextProp;
      }
    } else if (propKey === CHILDREN) {
      if (typeof nextProp === "string" || typeof nextProp === "number") {
        (updatePayload = updatePayload || []).push(propKey, "" + nextProp);
      }
    } else {
      (updatePayload = updatePayload || []).push(propKey, nextProp);
    }
  }
  if (styleUpdates) {
    (updatePayload = updatePayload || []).push(STYLE, styleUpdates);
  }
  return updatePayload;
}

export function updateProperties(domElement, updatePayload) {
  updateDOMProperties(domElement, updatePayload);
}

function updateDOMProperties(domElement, updatePayload) {
  console.log(updatePayload);
  for (let i = 0; i < updatePayload.length; i += 2) {
    const propKey = updatePayload[i];
    const propValue = updatePayload[i + 1];
    if (propKey === STYLE) {
      setValueForStyles(domElement, propValue);
    } else if (propKey === CHILDREN) {
      setTextContent(domElement, propValue);
    } else {
      setValueForProperty(domElement, propKey, propValue);
    }
  }
}
```

### main.jsx 更新

```jsx
import * as React from "react/index";
import { createRoot } from "react-dom/client";

const reducer = (state, action) => {
  if (action.type === "add") return state + action.payload;
  return state;
};

function FunctionComponent() {
  const [number, setNumber] = React.useReducer(reducer, 0);
  let attrs = { id: "btn1" };
  if (number === 6) {
    delete attrs.id;
    attrs.style = { color: "red" };
  }
  return (
    <button {...attrs} onClick={() => setNumber({ type: "add", payload: 3 })}>
      {number}
    </button>
  );
}

const element = <FunctionComponent />;
const root = createRoot(document.getElementById("root"));
// 把element虚拟DOM挂载到容器中
root.render(element);
```

### commitReducer 小结

commit 提交更新阶段相对简单一点，在 commitMutationEffectsOnFiber 这个提交副作用函数中，还是针对原生标签组件 HostComponent：

1. 如果更新副作用存在 Update 更新标识并且 updateQueue 不为 null，执行 commitUpdate 更新
2. commitUpdate 中调用两个方法：DOM 属性更新 updateProperties 和 Fiber 属性更新 updateFiberProps。updateFiberProps 主要是将属性挂载到原生 DOM 节点上，不再赘述
3. updateProperties 的主要作用就是循环 updateQueue 中的元素，两两一对进行确认，对原生的 DOM 节点，执行诸如 style、class、id、内部文本等内容更新

commitReducer 点击 button 两次后的控制台输出结果：

![commitReducerResult](https://misaka10032.oss-cn-chengdu.aliyuncs.com/React/commitReducerResult.jpg)

## 手写源码仓库

https://github.com/mi-saka10032/mini-react/tree/master/packages/reducer
