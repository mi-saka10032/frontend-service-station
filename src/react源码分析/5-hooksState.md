---
title: Hooks-State
order: 5
category: false
tag:
  - useState
  - 派发与更新
  - 不可变数据
---

useState 绝大部分源码和流程都与 useReducer 相同，可以理解为 useState 就是一个设置了基础 reducer 函数(baseStateReducer)与不可变数据判断的 useReducer

源码改动主要围绕 React 的 useState 属性添加声明与 ReactFiberHooks 内的 mountState 和 updateState 进行，其余源码详见 useReducer 源码不分不再记录

## src\main.jsx

src\main.jsx

```jsx
import * as React from "react/index";
import { createRoot } from "react-dom/client";

function FunctionComponent() {
  const [number, setNumber] = React.useState(0);
  let attrs = { id: "btn1" };
  if (number === 3) {
    delete attrs.id;
    attrs.style = { color: "red" };
  }
  // 如果使用的是useState，调用setNumber的时候传入的是老状态，则不需要更新
  return (
    <button {...attrs} onClick={() => setNumber(number + 1)}>
      {number}
    </button>
  );
}

const element = <FunctionComponent />;
const root = createRoot(document.getElementById("root"));
// 把element虚拟DOM挂载到容器中
root.render(element);
```

## react\index.js

src\react\index.js

```js
export {
  __SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED,
  useReducer,
  useState,
} from "./src/React";
```

## React.js

src\react\src\React.js

```js
import { useReducer, useState } from "./ReactHooks";
import ReactSharedInternals from "./ReactSharedInternals";

export {
  useReducer,
  useState,
  ReactSharedInternals as __SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED,
};
```

## ReactHooks.js

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
```

## objectIs.js

src\shared\objectIs.js

```js
const objectIs = Object.is;
export default objectIs;
```

## ReactFiberHooks.js

src\react-reconciler\src\ReactFiberHooks.js

```js
import ReactSharedInternals from "shared/ReactSharedInternals";
import { enqueueConcurrentHookUpdate } from "./ReactFiberConcurrentUpdates";
import { scheduleUpdateOnFiber } from "./ReactFiberWorkLoop";
import is from "shared/objectIs";

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
};

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

## useState 源码小结

1. useState 的执行流程与 useReducer 基本相同，同样地需要根据是否首次执行来动态切换 mountState 和 updateState 函数
2. updateState 的过程与 updateReducer 几乎一行，实际上 React 内部设置了一个默认的执行函数 baseStateReducer，state 中的值会通过这个函数执行返回值重新为 memoizedState 赋值。所以 updateState 就变成了绑定了 baseStateReducer 执行函数的 updateReducer 函数调用
3. mountState 相比 mountReducer，在初始化 queue 对象时额外声明了 lastRenderedReducer 和 lastRenderedState 函数，同时设置的派发函数 dispatchSetState 会在执行调度更新前，先获取 queue 中的 lastRenderedReducer, lastRenderedState 预先执行一次赋值返回，通过`Object.is`浅比较判断值是否改变，如果没有改变则直接退出，一定程度上优化了 useState 的使用
4. 需要注意的是，**当前没有加入异步调度的源码，因此一次 button 按钮点击同时调用多次 setNumber 触发多次更新情况时，只会执行最后一个调度任务**

## 手写源码仓库

https://github.com/mi-saka10032/mini-react/tree/master/packages/state
