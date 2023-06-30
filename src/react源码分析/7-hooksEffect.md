---
title: Hooks-Effect
order: 7

tag:
  - useEffect
  - useLayoutEffect
  - 副作用函数
---

## 副作用的意义

![effectHook](https://misaka10032.oss-cn-chengdu.aliyuncs.com/React/effectHook.jpg)

在函数组件主体内（这里指在 React 渲染阶段）改变 DOM、添加订阅、设置定时器、记录日志以及执行其他包含副作用的操作都是不被允许的，因为这可能会产生莫名其妙的 bug 并破坏 UI 的一致性

使用 useEffect 完成副作用操作。赋值给 useEffect 的函数会在组件渲染到屏幕之后执行。你可以把 effect 看作从 React 的纯函数式世界通往命令式世界的逃生通道

useEffect 就是一个 Effect Hook，给函数组件增加了操作副作用的能力。它跟 class 组件中的 componentDidMount、componentDidUpdate 和 componentWillUnmount 具有相同的用途，只不过被合并成了一个 API

该 Hook 接收一个包含命令式、且可能有副作用代码的函数

注意：

1. 要避免在 useEffect 的副作用函数中操作 useEffect 绑定的依赖项，这会引起堆栈溢出异常
2. effectHook 提供了两种 hook，分为 useEffect 和 useLayoutEffect
3. useEffect 在浏览器渲染变更完成后非阻塞执行
4. useLayoutEffect 在浏览器渲染变更时阻塞执行

## useEffect

![useEffect流程图](https://misaka10032.oss-cn-chengdu.aliyuncs.com/React/flushPassiveEffects.jpg)

useEffect 和其他 hook 函数一样，beginWork 时为 Fiber 挂载 effectHook，二次触发时更新 effectHook，需要注意的是 effect 的 hook 链表和 state、reducer 不是同一个 hook 链表，为的是区分数据流和副作用流

### src\main.jsx

src\main.jsx

```jsx
import * as React from "react/index";
import { createRoot } from "react-dom/client";

function FunctionComponent() {
  console.log("FunctionComponent");
  const [number, setNumber] = React.useState(1);
  React.useEffect(() => {
    console.log("useEffect1");
    return () => {
      console.log("destroy useEffect1");
    };
  }, []);
  React.useEffect(() => {
    console.log("useEffect2");
    return () => {
      console.log("destroy useEffect2");
    };
  });
  React.useEffect(() => {
    console.log("useEffect3");
    return () => {
      console.log("destroy useEffect3");
    };
  });
  return <div onClick={() => setNumber(number + 1)}>{number}</div>;
}

const element = <FunctionComponent />;
const root = createRoot(document.getElementById("root"));
// 把element虚拟DOM挂载到容器中
root.render(element);
```

### react\index.js

src\react\index.js

```js
export {
  __SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED,
  useReducer,
  useState,
  useEffect,
} from "./src/React";
```

### React.js

src\react\src\React.js

```js
import { useReducer, useState, useEffect } from "./ReactHooks";
import ReactSharedInternals from "./ReactSharedInternals";

export {
  useReducer,
  useState,
  useEffect,
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
  return dispatcher.useReducer(reducer, initialArg, init);
}

export function useState(reducer, initialArg, init) {
  const dispatcher = resolveDispatcher();
  return dispatcher.useState(reducer, initialArg, init);
}

export function useEffect(create, deps) {
  const dispatcher = resolveDispatcher();
  return dispatcher.useEffect(create, deps);
}
```

### ReactHookEffectTags.js

src\react-reconciler\src\ReactHookEffectTags.js

```js
export const HasEffect = 0b0001; // 1
// 浏览器绘制之前执行的effect，UI绘制之前，类似微任务
export const Layout = 0b0100; // 4
// 浏览器绘制之后执行的effect，UI绘制之后，类似于宏任务
export const Passive = 0b1000; // 8
```

### ReactFiberFlags.js

src\react-reconciler\src\ReactFiberFlags.js

```js
// 如果函数组件里使用了useEffect，那么此函数组件对应的fiber上会有一个flags，为Passive
export const Passive = /*                      */ 0b00000000000000010000000000; // 1024
```

### ReactFiberHooks.js

src\react-reconciler\src\ReactFiberHooks.js

```js
import ReactSharedInternals from "shared/ReactSharedInternals";
import { enqueueConcurrentHookUpdate } from "./ReactFiberConcurrentUpdates";
import { scheduleUpdateOnFiber } from "./ReactFiberWorkLoop";
import is from "shared/objectIs";
import { Passive as PassiveEffect } from "./ReactFiberFlags";
import {
  HasEffect as HookHasEffect,
  Passive as HookPassive,
} from "./ReactHookEffectTags";

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

function dispatchSetState(fiber, queue, action) {
  const update = {
    action,
    hasEagerState: false, // 是否有急切的更新
    eagerState: null, // 急切的更新状态
    next: null,
  };
  // 派发动作后，立刻用上一次的状态和上一次的reducer计算新状态
  const { lastRenderedReducer, lastRenderedState } = queue;
  const eagerState = lastRenderedReducer(lastRenderedState, action);
  update.hasEagerState = true;
  update.eagerState = eagerState;
  if (is(eagerState, lastRenderedState)) {
    return;
  }
  // 入队更新，调度更新逻辑
  const root = enqueueConcurrentHookUpdate(fiber, queue, update);
  scheduleUpdateOnFiber(root);
}

const HooksDispatcherOnMountInDEV = {
  useReducer: mountReducer,
  useState: mountState,
  useEffect: mountEffect,
};

function updateEffect(create, deps) {
  return updateEffectImpl(PassiveEffect, HookPassive, create, deps);
}

function updateEffectImpl(fiberFlags, hookFlags, create, deps) {
  const hook = updateWorkInProgressHook();
  const nextDeps = deps === undefined ? null : deps;
  let destroy;
  // 上一个老hook
  if (currentHook !== null) {
    // 获取此useEffect这个Hook上老的effect对象
    const prevEffect = currentHook.memoizedState;
    destroy = prevEffect.destroy;
    if (nextDeps !== null) {
      const prevDeps = prevEffect.deps;
      // 用新数组和老数组进行对比，如果一样说明依赖项相同不需要执行
      if (areHookInputsEqual(nextDeps, prevDeps)) {
        // 不管要不要重新执行，都需要把新的effect组成完整的单循环链表放到fiber.updateQueue中
        hook.memoizedState = pushEffect(hookFlags, create, destroy, nextDeps);
        return;
      }
    }
  }
  // 如果要执行的话，需要修改fiber的flags
  currentlyRenderingFiber.flags |= fiberFlags;
  // 如果要执行的话，添加HookHasEffect flag。不是每个Passive都会执行，只有含有HookHasEffect的Passive才执行
  hook.memoizedState = pushEffect(
    HookHasEffect | hookFlags,
    create,
    destroy,
    nextDeps
  );
}

function areHookInputsEqual(nextDeps, prevDeps) {
  if (prevDeps === null) {
    return null;
  }
  for (let i = 0; i < prevDeps.length && i < nextDeps.length; i++) {
    if (is(nextDeps[i], prevDeps[i])) {
      continue;
    }
    return false;
  }
  return true;
}

function mountEffect(create, deps) {
  return mountEffectImpl(PassiveEffect, HookPassive, create, deps);
}

function mountEffectImpl(fiberFlags, hookFlags, create, deps) {
  const hook = mountWorkInProgressHook();
  const nextDeps = deps === undefined ? null : deps;
  // 给当前的函数组件fiber添加 effectFlags
  currentlyRenderingFiber.flags |= fiberFlags;
  hook.memoizedState = pushEffect(
    HookHasEffect | hookFlags,
    create,
    undefined,
    nextDeps
  );
}

/**
 * 添加effect链表
 * @param tag effect的标签
 * @param create 创建方法
 * @param destroy 销毁方法
 * @param deps 依赖数组
 */
function pushEffect(tag, create, destroy, deps) {
  const effect = {
    tag,
    create,
    destroy,
    deps,
    next: null,
  };
  let componentUpdateQueue = currentlyRenderingFiber.updateQueue;
  if (componentUpdateQueue === null) {
    componentUpdateQueue = createFunctionComponentUpdateQueue();
    currentlyRenderingFiber.updateQueue = componentUpdateQueue;
    componentUpdateQueue.lastEffect = effect.next = effect;
  } else {
    // effect单向环链
    const lastEffect = componentUpdateQueue.lastEffect;
    if (lastEffect === null) {
      componentUpdateQueue.lastEffect = effect.next = effect;
    } else {
      const firstEffect = lastEffect.next;
      lastEffect.next = effect;
      effect.next = firstEffect;
      componentUpdateQueue.lastEffect = effect;
    }
  }
  return effect;
}

function createFunctionComponentUpdateQueue() {
  return {
    lastEffect: null,
  };
}

function mountState(initialState) {
  const hook = mountWorkInProgressHook();
  hook.memoizedState = initialState;
  const queue = {
    pending: null,
    dispatch: null,
    lastRenderedReducer: baseStateReducer, // 上一个reducer
    lastRenderedState: initialState, // 上一个state
  };
  hook.queue = queue;
  const dispatch = (queue.dispatch = dispatchSetState.bind(
    null,
    currentlyRenderingFiber,
    queue
  ));
  return [hook.memoizedState, dispatch];
}

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
  useState: updateState,
  useEffect: updateEffect,
};

// useState就是一个内置了reducer的useReducer
function baseStateReducer(state, action) {
  return typeof action === "function" ? action(state) : action;
}

function updateState() {
  return updateReducer(baseStateReducer);
}

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
  // 每次渲染hook前需要清除更新队列
  workInProgress.updateQueue = null;
  workInProgress.memoizedState = null;
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

### ReactFiberWorkLoop.js

src\react-reconciler\src\ReactFiberWorkLoop.js

```js
import { scheduleCallback } from "scheduler/index";
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
      scheduleCallback(flushPassiveEffect);
    }
  }
  console.log("~~~~~~~~~~~~~~~~~~~");
  const subtreeHasEffects =
    (finishedWork.subtreeFlags && MutationMask) !== NoFlags;
  const rootHasEffect = (finishedWork.flags && MutationMask) !== NoFlags;
  if (subtreeHasEffects || rootHasEffect) {
    // 当DOM执行变更之后
    commitMutationEffectsOnFiber(finishedWork, root);
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

### ReactFiberCommitWork.js

src\react-reconciler\src\ReactFiberCommitWork.js

```js
import {
  appendChild,
  insertBefore,
  commitUpdate,
  removeChild,
} from "react-dom/src/client/ReactDOMHostConfig";
import {
  FunctionComponent,
  HostComponent,
  HostRoot,
  HostText,
} from "react-reconciler/src/ReactWorkTags";
import {
  MutationMask,
  Passive,
  Placement,
  Update,
} from "react-reconciler/src/ReactFiberFlags";
import {
  Passive as HookPassive,
  HasEffect as HookHasEffect,
} from "./ReactHookEffectTags";

let hostParent = null;

/**
 * 提交删除副作用
 * @param root 根节点
 * @param returnFiber 父fiber
 * @param deletedFiber 删除的fiber
 */
function commitDeletionEffects(root, returnFiber, deletedFiber) {
  let parent = returnFiber;
  // 一直向上查找直到找到真实DOM节点为止
  findParent: while (parent !== null) {
    switch (parent.tag) {
      case HostComponent: {
        hostParent = parent.stateNode;
        break findParent;
      }
      case HostRoot: {
        hostParent = parent.stateNode.containerInfo;
        break findParent;
      }
    }
    parent = parent.return;
  }
  commitDeletionEffectsOnFiber(root, returnFiber, deletedFiber);
  hostParent = null;
}

function commitDeletionEffectsOnFiber(
  finishedRoot,
  nearestMountedAncestor,
  deletedFiber
) {
  switch (deletedFiber.tag) {
    case HostComponent:
    case HostText: {
      // 递归处理子节点，当要删除一个节点的时候，要先删除它的子节点 不直接删除自己
      recursivelyTraverseDeletionEffects(
        finishedRoot,
        nearestMountedAncestor,
        deletedFiber
      );
      // 再把自己删除
      if (hostParent !== null) {
        removeChild(hostParent, deletedFiber.stateNode);
      }
      break;
    }
    default:
      break;
  }
}

function recursivelyTraverseDeletionEffects(
  finishedRoot,
  nearestMountedAncestor,
  parent
) {
  let child = parent.child;
  while (child !== null) {
    commitDeletionEffectsOnFiber(finishedRoot, nearestMountedAncestor, child);
    child = child.sibling;
  }
}

/**
 * 递归遍历处理变更的副作用
 * @param root 根节点
 * @param parentFiber 父Fiber
 */
function recursivelyTraverseMutationEffects(root, parentFiber) {
  // 先把父Fiber上该删除的节点都删除
  const deletions = parentFiber.deletions;
  if (deletions !== null) {
    for (let i = 0; i < deletions.length; i++) {
      const childToDelete = deletions[i];
      commitDeletionEffects(root, parentFiber, childToDelete);
    }
  }
  // 再去处理剩下的子节点
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

export function commitPassiveUnmountEffects(finishedWork) {
  commitPassiveUnmountOnFiber(finishedWork);
}

function commitPassiveUnmountOnFiber(finishedWork) {
  const flags = finishedWork.flags;
  switch (finishedWork.tag) {
    case HostRoot: {
      recursivelyTraversePassiveUnmountEffects(finishedWork);
      break;
    }
    case FunctionComponent: {
      recursivelyTraversePassiveUnmountEffects(finishedWork);
      if (flags & Passive) {
        commitHookPassiveUnmountEffects(
          finishedWork,
          HookPassive | HookHasEffect
        );
      }
      break;
    }
  }
}

function recursivelyTraversePassiveUnmountEffects(parentFiber) {
  if (parentFiber.subtreeFlags & Passive) {
    let child = parentFiber.child;
    while (child !== null) {
      commitPassiveUnmountOnFiber(child);
      child = child.sibling;
    }
  }
}

function commitHookPassiveUnmountEffects(finishedWork, hookFlags) {
  commitHookEffectListUnmount(hookFlags, finishedWork);
}

function commitHookEffectListUnmount(flags, finishedWork) {
  const updateQueue = finishedWork.updateQueue;
  const lastEffect = updateQueue !== null ? updateQueue.lastEffect : null;
  if (lastEffect !== null) {
    const firstEffect = lastEffect.next;
    let effect = firstEffect;
    do {
      if ((effect.tag & flags) === flags) {
        const destroy = effect.destroy;
        if (destroy !== undefined) {
          destroy();
        }
      }
      effect = effect.next;
    } while (effect !== firstEffect);
  }
}

export function commitPassiveMountEffects(root, finishedWork) {
  commitPassiveMountOnFiber(root, finishedWork);
}

function commitPassiveMountOnFiber(finishedRoot, finishedWork) {
  const flags = finishedWork.flags;
  switch (finishedWork.tag) {
    case HostRoot: {
      recursivelyTraversePassiveMountEffects(finishedRoot, finishedWork);
      break;
    }
    case FunctionComponent: {
      recursivelyTraversePassiveMountEffects(finishedRoot, finishedWork);
      if (flags & Passive) {
        commitHookPassiveMountEffects(
          finishedWork,
          HookPassive | HookHasEffect
        );
      }
      break;
    }
  }
}

function recursivelyTraversePassiveMountEffects(root, parentFiber) {
  if (parentFiber.subtreeFlags & Passive) {
    let child = parentFiber.child;
    while (child !== null) {
      commitPassiveMountOnFiber(root, child);
      child = child.sibling;
    }
  }
}

function commitHookPassiveMountEffects(finishedWork, hookFlags) {
  commitHookEffectListMount(hookFlags, finishedWork);
}

function commitHookEffectListMount(flags, finishedWork) {
  const updateQueue = finishedWork.updateQueue;
  const lastEffect = updateQueue !== null ? updateQueue.lastEffect : null;
  if (lastEffect !== null) {
    const firstEffect = lastEffect.next;
    let effect = firstEffect;
    do {
      if ((effect.tag & flags) === flags) {
        const create = effect.create;
        effect.destroy = create();
      }
      effect = effect.next;
    } while (effect !== firstEffect);
  }
}
```

## useLayoutEffect

![useLayoutEffect](https://misaka10032.oss-cn-chengdu.aliyuncs.com/React/useLayoutEffect.jpg)

![commitLayoutEffect](https://misaka10032.oss-cn-chengdu.aliyuncs.com/React/commitLayoutEffects.jpg)

- 其函数签名与 useEffect 相同，但它会在所有的 DOM 变更之后同步调用 effect
- useEffect 不会阻塞浏览器渲染，而 useLayoutEffect 会浏览器渲染
- useEffect 会在浏览器渲染结束后执行,useLayoutEffect 则是在 DOM 更新完成后,浏览器绘制之前执行

**相较于在 commit 阶段执行完毕后才执行的副作用 useEffect，useLayoutEffect 选择在 commitWork 执行 DOM 操作前就会先执行**

### src\main.jsx

src\main.jsx

```jsx
import * as React from "react/index";
import { createRoot } from "react-dom/client";

function FunctionComponent() {
  console.log("FunctionComponent");
  const [number, setNumber] = React.useState(1);
  React.useLayoutEffect(() => {
    console.log("useLayoutEffect1");
    return () => {
      console.log("destroy useLayoutEffect1");
    };
  });
  React.useEffect(() => {
    console.log("useEffect2");
    return () => {
      console.log("destroy useEffect2");
    };
  });
  React.useEffect(() => {
    console.log("useEffect3");
    console.log(number);
    return () => {
      console.log("destroy useEffect3");
    };
  });
  return <div onClick={() => setNumber(number + 1)}>{number}</div>;
}

const element = <FunctionComponent />;
const root = createRoot(document.getElementById("root"));
// 把element虚拟DOM挂载到容器中
root.render(element);
```

### react\index.js

src\react\index.js

```js
export {
  __SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED,
  useReducer,
  useState,
  useEffect,
  useLayoutEffect,
} from "./src/React";
```

### React.js

src\react\src\React.js

```js
import { useReducer, useState, useEffect, useLayoutEffect } from "./ReactHooks";
import ReactSharedInternals from "./ReactSharedInternals";

export {
  useReducer,
  useState,
  useEffect,
  useLayoutEffect,
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
  return dispatcher.useReducer(reducer, initialArg, init);
}

export function useState(reducer, initialArg, init) {
  const dispatcher = resolveDispatcher();
  return dispatcher.useState(reducer, initialArg, init);
}

export function useEffect(create, deps) {
  const dispatcher = resolveDispatcher();
  return dispatcher.useEffect(create, deps);
}

export function useLayoutEffect(create, deps) {
  const dispatcher = resolveDispatcher();
  return dispatcher.useLayoutEffect(create, deps);
}
```

### ReactHookEffectTags.js

src\react-reconciler\src\ReactHookEffectTags.js

```js
export const HasEffect = 0b0001; // 1
// 浏览器绘制之前执行的effect，UI绘制之前，类似微任务
export const Layout = 0b0100; // 4
// 浏览器绘制之后执行的effect，UI绘制之后，类似于宏任务
export const Passive = 0b1000; // 8
```

### ReactFiberFlags.js

src\react-reconciler\src\ReactFiberFlags.js

```js
// Don't change these two values. They're used by React Dev Tools.
export const NoFlags = /*                      */ 0b00000000000000000000000000;
export const PerformedWork = /*                */ 0b00000000000000000000000001;

// You can change the rest (and add more).
// Placement 插入
export const Placement = /*                    */ 0b00000000000000000000000010;
// Update 更新
export const Update = /*                       */ 0b00000000000000000000000100;
export const ChildDeletion = /*                     */ 0b00000000000000000000001000;

export const MutationMask = Placement | Update;
// 如果函数组件里使用了useEffect，那么此函数组件对应的fiber上会有一个flags，为Passive
export const Passive = /*                      */ 0b00000000000000010000000000; // 1024
export const LayoutMask = /*                      */ Update; // 4
```

### ReactFiberHooks.js

src\react-reconciler\src\ReactFiberHooks.js

```js
import {
  Passive as PassiveEffect,
  Update as UpdateEffect,
} from "./ReactFiberFlags";
import {
  HasEffect as HookHasEffect,
  Passive as HookPassive,
  Layout as HookLayout,
} from "./ReactHookEffectTags";

const HooksDispatcherOnMountInDEV = {
  useReducer: mountReducer,
  useState: mountState,
  useEffect: mountEffect,
  useLayoutEffect: mountLayoutEffect,
};

function mountLayoutEffect(create, deps) {
  return mountEffectImpl(UpdateEffect, HookLayout, create, deps);
}

function updateLayoutEffect(create, deps) {
  return updateEffectImpl(UpdateEffect, HookLayout, create, deps);
}

const HooksDispatcherOnUpdateInDEV = {
  useReducer: updateReducer,
  useState: updateState,
  useEffect: updateEffect,
  useLayoutEffect: updateLayoutEffect,
};
```

### ReactFiberWorkLoop.js

src\react-reconciler\src\ReactFiberWorkLoop.js

```js
import {
  commitMutationEffectsOnFiber,
  commitPassiveUnmountEffects,
  commitPassiveMountEffects,
  commitLayoutEffects,
} from "./ReactFiberCommitWork";

function commitRoot(root) {
  const { finishedWork } = root;
  // printFinishedWork(finishedWork);
  if (
    (finishedWork.subtreeFlags & Passive) !== NoFlags ||
    (finishedWork.flags & Passive) !== NoFlags
  ) {
    if (!rootDoesHavePassiveEffect) {
      rootDoesHavePassiveEffect = true;
      scheduleCallback(flushPassiveEffect);
    }
  }
  console.log("~~~~~~~~~~~~~~~~~~~");
  const subtreeHasEffects =
    (finishedWork.subtreeFlags && MutationMask) !== NoFlags;
  const rootHasEffect = (finishedWork.flags && MutationMask) !== NoFlags;
  if (subtreeHasEffects || rootHasEffect) {
    // 当DOM执行变更之后
    commitMutationEffectsOnFiber(finishedWork, root);
    // !!! UI渲染之前：同步执行layoutEffect
    commitLayoutEffects(finishedWork, root);
    if (rootDoesHavePassiveEffect) {
      rootDoesHavePassiveEffect = false;
      rootWithPendingPassiveEffects = root;
    }
  }
  // 等DOM变更后，就可以把root的current指向新Fiber树
  root.current = finishedWork;
}
```

### ReactFiberCommitWork.js

src\react-reconciler\src\ReactFiberCommitWork.js

```js
import {
  appendChild,
  insertBefore,
  commitUpdate,
  removeChild,
} from "react-dom/src/client/ReactDOMHostConfig";
import {
  FunctionComponent,
  HostComponent,
  HostRoot,
  HostText,
} from "react-reconciler/src/ReactWorkTags";
import {
  MutationMask,
  Passive,
  Placement,
  Update,
  LayoutMask,
} from "react-reconciler/src/ReactFiberFlags";
import {
  Passive as HookPassive,
  HasEffect as HookHasEffect,
  Layout as HookLayout,
} from "./ReactHookEffectTags";

let hostParent = null;

/**
 * 提交删除副作用
 * @param root 根节点
 * @param returnFiber 父fiber
 * @param deletedFiber 删除的fiber
 */
function commitDeletionEffects(root, returnFiber, deletedFiber) {
  let parent = returnFiber;
  // 一直向上查找直到找到真实DOM节点为止
  findParent: while (parent !== null) {
    switch (parent.tag) {
      case HostComponent: {
        hostParent = parent.stateNode;
        break findParent;
      }
      case HostRoot: {
        hostParent = parent.stateNode.containerInfo;
        break findParent;
      }
    }
    parent = parent.return;
  }
  commitDeletionEffectsOnFiber(root, returnFiber, deletedFiber);
  hostParent = null;
}

function commitDeletionEffectsOnFiber(
  finishedRoot,
  nearestMountedAncestor,
  deletedFiber
) {
  switch (deletedFiber.tag) {
    case HostComponent:
    case HostText: {
      // 递归处理子节点，当要删除一个节点的时候，要先删除它的子节点 不直接删除自己
      recursivelyTraverseDeletionEffects(
        finishedRoot,
        nearestMountedAncestor,
        deletedFiber
      );
      // 再把自己删除
      if (hostParent !== null) {
        removeChild(hostParent, deletedFiber.stateNode);
      }
      break;
    }
    default:
      break;
  }
}

function recursivelyTraverseDeletionEffects(
  finishedRoot,
  nearestMountedAncestor,
  parent
) {
  let child = parent.child;
  while (child !== null) {
    commitDeletionEffectsOnFiber(finishedRoot, nearestMountedAncestor, child);
    child = child.sibling;
  }
}

/**
 * 递归遍历处理变更的副作用
 * @param root 根节点
 * @param parentFiber 父Fiber
 */
function recursivelyTraverseMutationEffects(root, parentFiber) {
  // 先把父Fiber上该删除的节点都删除
  const deletions = parentFiber.deletions;
  if (deletions !== null) {
    for (let i = 0; i < deletions.length; i++) {
      const childToDelete = deletions[i];
      commitDeletionEffects(root, parentFiber, childToDelete);
    }
  }
  // 再去处理剩下的子节点
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
    case HostRoot:
    case FunctionComponent:
    case HostText: {
      // 遍历子节点，处理子节点上的副作用
      recursivelyTraverseMutationEffects(root, finishedWork);
      // 再处理自己身上的副作用
      commitReconciliationEffects(finishedWork);
      if (flags & Update) {
        commitHookEffectListUnmount(HookHasEffect | HookLayout, finishedWork);
      }
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
    default:
      break;
  }
}

export function commitPassiveUnmountEffects(finishedWork) {
  commitPassiveUnmountOnFiber(finishedWork);
}

function commitPassiveUnmountOnFiber(finishedWork) {
  const flags = finishedWork.flags;
  switch (finishedWork.tag) {
    case HostRoot: {
      recursivelyTraversePassiveUnmountEffects(finishedWork);
      break;
    }
    case FunctionComponent: {
      recursivelyTraversePassiveUnmountEffects(finishedWork);
      if (flags & Passive) {
        commitHookPassiveUnmountEffects(
          finishedWork,
          HookPassive | HookHasEffect
        );
      }
      break;
    }
  }
}

function recursivelyTraversePassiveUnmountEffects(parentFiber) {
  if (parentFiber.subtreeFlags & Passive) {
    let child = parentFiber.child;
    while (child !== null) {
      commitPassiveUnmountOnFiber(child);
      child = child.sibling;
    }
  }
}

function commitHookPassiveUnmountEffects(finishedWork, hookFlags) {
  commitHookEffectListUnmount(hookFlags, finishedWork);
}

function commitHookEffectListUnmount(flags, finishedWork) {
  const updateQueue = finishedWork.updateQueue;
  const lastEffect = updateQueue !== null ? updateQueue.lastEffect : null;
  if (lastEffect !== null) {
    const firstEffect = lastEffect.next;
    let effect = firstEffect;
    do {
      if ((effect.tag & flags) === flags) {
        const destroy = effect.destroy;
        if (destroy !== undefined) {
          destroy();
        }
      }
      effect = effect.next;
    } while (effect !== firstEffect);
  }
}

export function commitPassiveMountEffects(root, finishedWork) {
  commitPassiveMountOnFiber(root, finishedWork);
}

function commitPassiveMountOnFiber(finishedRoot, finishedWork) {
  const flags = finishedWork.flags;
  switch (finishedWork.tag) {
    case HostRoot: {
      recursivelyTraversePassiveMountEffects(finishedRoot, finishedWork);
      break;
    }
    case FunctionComponent: {
      recursivelyTraversePassiveMountEffects(finishedRoot, finishedWork);
      if (flags & Passive) {
        commitHookPassiveMountEffects(
          finishedWork,
          HookPassive | HookHasEffect
        );
      }
      break;
    }
  }
}

function recursivelyTraversePassiveMountEffects(root, parentFiber) {
  if (parentFiber.subtreeFlags & Passive) {
    let child = parentFiber.child;
    while (child !== null) {
      commitPassiveMountOnFiber(root, child);
      child = child.sibling;
    }
  }
}

function commitHookPassiveMountEffects(finishedWork, hookFlags) {
  commitHookEffectListMount(hookFlags, finishedWork);
}

function commitHookEffectListMount(flags, finishedWork) {
  const updateQueue = finishedWork.updateQueue;
  const lastEffect = updateQueue !== null ? updateQueue.lastEffect : null;
  if (lastEffect !== null) {
    const firstEffect = lastEffect.next;
    let effect = firstEffect;
    do {
      if ((effect.tag & flags) === flags) {
        const create = effect.create;
        effect.destroy = create();
      }
      effect = effect.next;
    } while (effect !== firstEffect);
  }
}

export function commitLayoutEffects(finishedWork, root) {
  // 老的根fiber
  const current = finishedWork.alternate;
  commitLayoutEffectOnFiber(root, current, finishedWork);
}

function commitLayoutEffectOnFiber(finishedRoot, current, finishedWork) {
  const flags = finishedWork.flags;
  switch (finishedWork.tag) {
    case HostRoot: {
      recursivelyTraverseLayoutEffects(finishedRoot, finishedWork);
      break;
    }
    case FunctionComponent: {
      recursivelyTraverseLayoutEffects(finishedRoot, finishedWork);
      if (flags & LayoutMask) {
        // 4 LayoutMask = Update = 4
        commitHookLayoutEffects(finishedWork, HookLayout | HookHasEffect);
      }
      break;
    }
  }
}

function recursivelyTraverseLayoutEffects(root, parentFiber) {
  if (parentFiber.subtreeFlags & LayoutMask) {
    let child = parentFiber.child;
    while (child !== null) {
      const current = child.alternate;
      commitLayoutEffectOnFiber(root, current, child);
      child = child.sibling;
    }
  }
}

function commitHookLayoutEffects(finishedWork, hookFlags) {
  commitHookEffectListMount(hookFlags, finishedWork);
}
```


## 手写源码仓库

https://github.com/mi-saka10032/mini-react/tree/master/packages/effect