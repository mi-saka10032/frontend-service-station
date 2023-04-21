---
title: Diff
order: 6
category: false
tag:
  - ReactDiff
  - 单节点diff
  - 多节点diff
---

React 的核心设计之一就是基于虚拟 DOM 的 diff 算法，最大化地降低了 DOM 渲染压力。diff 算法主要分为两类：单节点 diff(SingleDiff)和多节点 diff(MultipleDiff)

## 单节点 Diff

![单节点diff流程图](https://misaka10032.oss-cn-chengdu.aliyuncs.com/React/dan_jie_dian_diff.png)

React 存在单节点的情况，除了单个的原生节点(div、span 等)、文本节点之外，还有我们熟悉的单个类组件、函数组件，这些都属于单节点 diff 的范畴

现在以单节点 diff 存在的三种情况来分别讲解单节点 diff 策略

### key 不同 type 相同

单节点 key 不同，类型相同：删除老节点，添加新节点

#### main.jsx

src\main.jsx

```jsx
import * as React from "react";
import { createRoot } from "react-dom/client";

function FunctionComponent() {
  const [number, setNumber] = React.useState(0);
  return number === 0 ? (
    <div onClick={() => setNumber(number + 1)} key="title1" id="title">
      title
    </div>
  ) : (
    <div onClick={() => setNumber(number + 1)} key="title2" id="title2">
      title2
    </div>
  );
}
let element = <FunctionComponent />;
const root = createRoot(document.getElementById("root"));
root.render(element);
```

#### ReactFiberFlags.js

src\react-reconciler\src\ReactFiberFlags.js

```js
export const NoFlags = 0b00000000000000000000000000;
export const Placement = 0b00000000000000000000000010;
export const Update = 0b00000000000000000000000100;
export const ChildDeletion = 0b00000000000000000000001000;
export const MutationMask = Placement | Update;
```

#### ReactFiber.js

src\react-reconciler\src\ReactFiber.js

```js
export function FiberNode(tag, pendingProps, key) {
  this.tag = tag;
  this.key = key;
  this.type = null;
  this.stateNode = null;

  this.return = null;
  this.child = null;
  this.sibling = null;

  this.pendingProps = pendingProps;
  this.memoizedProps = null;
  this.updateQueue = null;
  this.memoizedState = null;

  this.flags = NoFlags;
  this.subtreeFlags = NoFlags;
  // 存放将要删除的子Fiber
  this.deletions = null;
  this.alternate = null;
}
```

#### ReactDOMHostConfig.js

```js
export function removeChild(parentInstance, child) {
  parentInstance.removeChild(child);
}
```

#### ReactChildFiber.js

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

  // 向fiber上推入需要删除的子节点
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
        // key不同，删除老fiber.child
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

#### ReactFiberCommitWork.js

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
  Placement,
  Update,
} from "react-reconciler/src/ReactFiberFlags";

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
```

### key 相同 type 不同

这种情况其实跟 key 不同 type 相同一样，删除老节点添加新节点，对 ReactChildFiber 中的 reconcileSingleElement 方法做补充

#### main.jsx

src\main.jsx

```jsx
import * as React from "react";
import { createRoot } from "react-dom/client";

function FunctionComponent() {
  const [number, setNumber] = React.useState(0);
  return number === 0 ? (
    <div onClick={() => setNumber(number + 1)} key="title1" id="title1">
      title1
    </div>
  ) : (
    <p onClick={() => setNumber(number + 1)} key="title1" id="title1">
      title1
    </p>
  );
}
let element = <FunctionComponent />;
const root = createRoot(document.getElementById("root"));
root.render(element);
```

#### ReactChildFiber.js

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

  // 删除从currentFirstChild之后的所有fiber节点
  function deleteRemainingChildren(returnFiber, currentFirstChild) {
    if (!shouldTracksSideEffects) {
      return null;
    }
    let childToDelete = currentFirstChild;
    while (childToDelete !== null) {
      deleteChild(returnFiber, childToDelete);
      childToDelete = childToDelete.sibling;
    }
    return null;
  }

  function reconcileSingleElement(returnFiber, currentFirstChild, element) {
    const key = element.key;
    let child = currentFirstChild;
    while (child !== null) {
      if (child.key === key) {
        const elementType = element.type;
        if (child.type === elementType) {
          // key相同且元素类型相同，fiber复用
          deleteRemainingChildren(returnFiber, child.sibling);
          const existing = useFiber(child, element.props);
          existing.return = returnFiber;
          return existing;
        } else {
          // key相同但是类型不同，删除剩下的全部fiber.child
          deleteRemainingChildren(returnFiber, child);
        }
      } else {
        // key不同，删除老fiber.child
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

### 多节点剩一个节点

此种情况在上一个情况中的 ReactChildFiber.js 的 deleteRemainingChildren 方法中已经实现，多节点下的单节点可复用时，其他节点尽数删除

```jsx
import * as React from "react";
import { createRoot } from "react-dom/client";

function FunctionComponent() {
  const [number, setNumber] = React.useState(0);
  return number === 0 ? (
    <ul key="container" onClick={() => setNumber(number + 1)}>
      <li key="A">A</li>
      <li key="B" id="B">
        B
      </li>
      <li key="C">C</li>
    </ul>
  ) : (
    <ul key="container" onClick={() => setNumber(number + 1)}>
      <li key="B" id="B2">
        B2
      </li>
    </ul>
  );
}
let element = <FunctionComponent />;
const root = createRoot(document.getElementById("root"));
root.render(element);
```

## 多节点 Diff

React 最复杂的正是多节点的 Diff 分辨与遍历规则

Diff 规则有三：

1. 只对同级元素进行比较，不同层级不对比
2. 不同的类型对应不同的元素
3. 可以通过 key 来标识同一个节点

遍历顺序有三：

1. 第一轮遍历

   - 如果 key 不同则直接结束本轮循环
   - newChildren 或 oldFiber 遍历完，结束本轮循环
   - key 相同而 type 也相同，则可以复用老节 oldFiber 节点，继续循环

2. 第二轮遍历

   - newChildren 遍历完而 oldFiber 还有，遍历剩下所有的 oldFiber 标记为删除，DIFF 结束
   - oldFiber 遍历完了，而 newChildren 还有，将剩下的 newChildren 标记为插入，DIFF 结束
   - newChildren 和 oldFiber 都同时遍历完成，diff 结束
   - newChildren 和 oldFiber 都没有完成，则进行节点移动的逻辑，进入下一轮遍历

3. 第三轮遍历
   - 处理节点移动的情况

### 前两轮遍历

这里列举前两轮遍历的一种理想情况，新旧节点的数量相同，key 相同，有的 type 不同

这种情况下，第一轮遍历会在 updateElement 函数中对这些 key 都相同的节点进行 type 比较，不同的老节点推入 deletion，新节点创建新 fiber

![多节点diff第一轮循环](https://misaka10032.oss-cn-chengdu.aliyuncs.com/React/duo_jie_dian_diff.png)

#### src\main.jsx

src\main.jsx

```jsx
import * as React from "react";
import { createRoot } from "react-dom/client";

function FunctionComponent() {
  console.log("FunctionComponent");
  const [number, setNumber] = React.useState(0);
  return number === 0 ? (
    <ul key="container" onClick={() => setNumber(number + 1)}>
      <li key="A">A</li>
      <li key="B" id="B">
        B
      </li>
      <li key="C" id="C">
        C
      </li>
    </ul>
  ) : (
    <ul key="container" onClick={() => setNumber(number + 1)}>
      <li key="A">A2</li>
      <p key="B" id="B2">
        B2
      </p>
      <li key="C" id="C2">
        C2
      </li>
    </ul>
  );
}
let element = <FunctionComponent />;
const root = createRoot(document.getElementById("root"));
root.render(element);
```

#### ReactChildFiber.jS

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

  // 删除从currentFirstChild之后的所有fiber节点
  function deleteRemainingChildren(returnFiber, currentFirstChild) {
    if (!shouldTracksSideEffects) {
      return null;
    }
    let childToDelete = currentFirstChild;
    while (childToDelete !== null) {
      deleteChild(returnFiber, childToDelete);
      childToDelete = childToDelete.sibling;
    }
    return null;
  }

  function reconcileSingleElement(returnFiber, currentFirstChild, element) {
    const key = element.key;
    let child = currentFirstChild;
    while (child !== null) {
      if (child.key === key) {
        const elementType = element.type;
        if (child.type === elementType) {
          // key相同且元素类型相同，fiber复用
          deleteRemainingChildren(returnFiber, child.sibling);
          const existing = useFiber(child, element.props);
          existing.return = returnFiber;
          return existing;
        } else {
          // key相同但是类型不同，删除剩下的全部fiber.child
          deleteRemainingChildren(returnFiber, child);
        }
      } else {
        // key不同，删除老fiber.child
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
      const current = newFiber.alternate;
      if (current === null) {
        // 新节点，需要插入
        newFiber.flags |= Placement;
      }
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

  function updateElement(returnFiber, current, element) {
    const elementType = element.type;
    if (current !== null) {
      // key和type都相同
      if (current.type === elementType) {
        const existing = useFiber(current, element.props);
        existing.return = returnFiber;
        return existing;
      }
    }
    const created = createFiberFromElement(element);
    created.return = returnFiber;
    return created;
  }

  function updateSlot(returnFiber, oldFiber, newChild) {
    const key = oldFiber !== null ? oldFiber.key : null;
    if (newChild !== null && typeof newChild === "object") {
      switch (newChild.$$typeof) {
        case REACT_ELEMENT_TYPE: {
          if (newChild.key === key) {
            return updateElement(returnFiber, oldFiber, newChild);
          }
        }
        default:
          return null;
      }
    }
  }

  function reconcileChildrenArray(returnFiber, currentFirstChild, newChildren) {
    let resultingFirstChild = null; // 返回的第一个新儿子
    let previousNewFiber = null; // 之前的新fiber
    let newIdx = 0; // 遍历新虚拟DOM的索引
    let oldFiber = currentFirstChild; // 第一个老fiber
    let nextOldFiber = null; // 下一个老fiber
    // 开始第一轮循环 如果老fiber有值，新的虚拟DOM也有值
    for (; oldFiber !== null && newIdx < newChildren.length; newIdx++) {
      // 暂存下一个老fiber
      nextOldFiber = oldFiber.sibling;
      // 试图更新或者试图复用老的fiber
      const newFiber = updateSlot(returnFiber, oldFiber, newChildren[newIdx]);
      if (newFiber === null) {
        break;
      }
      if (shouldTracksSideEffects) {
        // 有老fiber，但是新的fiber并没有成功复用老fiber和老的真实DOM，删除老fiber，提交阶段删除真实DOM
        if (oldFiber && newFiber.alternate === null) {
          deleteChild(returnFiber, oldFiber);
        }
      }
      // 指定新fiber的位置
      placeChild(newFiber, newIdx);
      if (previousNewFiber === null) {
        resultingFirstChild = newFiber;
      } else {
        previousNewFiber.sibling = newFiber;
      }
      previousNewFiber = newFiber;
      oldFiber = nextOldFiber;
    }
    // 新的虚拟DOM已经循环完毕
    if (newIdx === newChildren.length) {
      // 第二轮循环情况1 删除剩下的老fiber
      deleteRemainingChildren(returnFiber, oldFiber);
      return resultingFirstChild;
    }
    if (oldFiber === null) {
      // 第二轮循环情况2 老fiber已经没有了，新的虚拟DOM还在，进入插入新节点的逻辑
      for (; newIdx < newChildren.length; newIdx++) {
        const newFiber = createChild(returnFiber, newChildren[newIdx]);
        if (newFiber === null) continue;
        // 把新fiber放到索引位置
        placeChild(newFiber, newIdx);
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

因为第二轮遍历也相对简单，主要是对第一轮遍历彻底完成后残留的新旧节点做处理，因此上面的 ReactChildFiber.js 已经补全了这部分逻辑

### 第三轮遍历

接下来讨论情况最复杂的第三轮遍历，前两轮遍历已经对头部 key 相同的节点进行了处理，最后进入第三轮遍历前，新旧节点依然存在数量相等或不等的乱序节点，key 和 type 也不尽相同

以下面这张节点图为例，描述具体的第三轮遍历 diff 规则：

![多节点diff第三轮循环](https://misaka10032.oss-cn-chengdu.aliyuncs.com/React/duo_ge_jie_dian_shu_liang_bu_tong_key_bu_tong.jpg)

其实第三轮遍历的关键在于对于剩余 oldFiber 的 map 映射表建立，以及剩余 newChildren 遍历过程中对 lastPlacedIndex 这个索引的判断来进行增加、更新、删除等操作

#### src\main.jsx

src\main.jsx

```jsx
import * as React from "react/index";
import { createRoot } from "react-dom/client";

function FunctionComponent() {
  console.log("FunctionComponent");
  const [number, setNumber] = React.useState(0);
  return number === 0 ? (
    <ul key="container" onClick={() => setNumber(number + 1)}>
      <li key="A">A</li>
      <li key="B" id="b">
        B
      </li>
      <li key="C">C</li>
      <li key="D">D</li>
      <li key="E">E</li>
      <li key="F">F</li>
    </ul>
  ) : (
    <ul key="container" onClick={() => setNumber(number + 1)}>
      <li key="A">A2</li>
      <li key="C">C2</li>
      <li key="E">E2</li>
      <li key="B" id="b2">
        B2
      </li>
      <li key="G">G</li>
      <li key="D">D2</li>
    </ul>
  );
}

const element = <FunctionComponent />;
const root = createRoot(document.getElementById("root"));
// 把element虚拟DOM挂载到容器中
root.render(element);
```

#### ReactFiberWorkLoop.js

src\react-reconciler\src\ReactFiberWorkLoop.js

这里引入一下打印日志函数，便于查看 diff 细节

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
} from "react-reconciler/src/ReactFiberFlags";
import { commitMutationEffectsOnFiber } from "./ReactFiberCommitWork";
import { finishQueueingConcurrentUpdates } from "./ReactFiberConcurrentUpdates";
import {
  FunctionComponent,
  HostComponent,
  HostRoot,
  HostText,
} from "react-reconciler/src/ReactWorkTags";

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
  printFinishedWork(finishedWork);
  console.log("~~~~~~~~~~~~~~~~~~~");
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

#### ReactChildFiber.js

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

  // 删除从currentFirstChild之后的所有fiber节点
  function deleteRemainingChildren(returnFiber, currentFirstChild) {
    if (!shouldTracksSideEffects) {
      return null;
    }
    let childToDelete = currentFirstChild;
    while (childToDelete !== null) {
      deleteChild(returnFiber, childToDelete);
      childToDelete = childToDelete.sibling;
    }
    return null;
  }

  function reconcileSingleElement(returnFiber, currentFirstChild, element) {
    const key = element.key;
    let child = currentFirstChild;
    while (child !== null) {
      if (child.key === key) {
        const elementType = element.type;
        if (child.type === elementType) {
          // key相同且元素类型相同，fiber复用
          deleteRemainingChildren(returnFiber, child.sibling);
          const existing = useFiber(child, element.props);
          existing.return = returnFiber;
          return existing;
        } else {
          // key相同但是类型不同，删除剩下的全部fiber.child
          deleteRemainingChildren(returnFiber, child);
        }
      } else {
        // key不同，删除老fiber.child
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

  function placeChild(newFiber, lastPlacedIndex, newIndex) {
    newFiber.index = newIndex;
    // 如果不需要跟踪副作用
    if (!shouldTracksSideEffects) {
      return lastPlacedIndex;
    }
    // 如果一个fiber的flags上有placement，说明此节点需要创建真实DOM，插入到父容器中
    // 如果父fiber初次挂载，shouldTracksSideEffects为false，不需要添加flags
    // 这种情况下会在完成阶段把所有子阶段全部添加到自己身上
    const current = newFiber.alternate;
    if (current === null) {
      // 新节点，需要插入
      newFiber.flags |= Placement;
      return lastPlacedIndex;
    } else {
      const oldIndex = current.index;
      // 如果老fiber的索引比lastPlacedIndex要小，则老fiber对应的DOM节点需要移动
      if (oldIndex < lastPlacedIndex) {
        newFiber.flags |= Placement;
        return lastPlacedIndex;
      } else {
        return oldIndex;
      }
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

  function updateElement(returnFiber, current, element) {
    const elementType = element.type;
    if (current !== null) {
      // key和type都相同
      if (current.type === elementType) {
        const existing = useFiber(current, element.props);
        existing.return = returnFiber;
        return existing;
      }
    }
    const created = createFiberFromElement(element);
    created.return = returnFiber;
    return created;
  }

  function updateSlot(returnFiber, oldFiber, newChild) {
    const key = oldFiber !== null ? oldFiber.key : null;
    if (newChild !== null && typeof newChild === "object") {
      switch (newChild.$$typeof) {
        case REACT_ELEMENT_TYPE: {
          if (newChild.key === key) {
            return updateElement(returnFiber, oldFiber, newChild);
          }
        }
        default:
          return null;
      }
    }
  }

  function mapRemainingChildren(returnFiber, currentFirstChild) {
    const existingChildren = new Map();
    let existingChild = currentFirstChild;
    while (existingChild !== null) {
      // 有key用key，无key用index
      if (existingChild.key !== null) {
        existingChildren.set(existingChild.key, existingChild);
      } else {
        existingChildren.set(existingChild.index, existingChild);
      }
      existingChild = existingChild.sibling;
    }
    return existingChildren;
  }

  function updateTextNode(returnFiber, current, textContent) {
    if (current === null || current.tag !== HostText) {
      const created = createFiberFromText(textContent);
      created.return = returnFiber;
      return created;
    } else {
      const existing = useFiber(current, textContent);
      existing.return = returnFiber;
      return existing;
    }
  }

  function updateFromMap(existingChildren, returnFiber, newIdx, newChild) {
    if (
      (typeof newChild === "string" && newChild !== "") ||
      typeof newChild === "number"
    ) {
      const matchedFiber = existingChildren.get(newIdx) || null;
      return updateTextNode(returnFiber, matchedFiber, "" + newChild);
    }
    if (typeof newChild === "object" && newChild !== null) {
      switch (newChild.$$typeof) {
        case REACT_ELEMENT_TYPE: {
          const matchedFiber =
            existingChildren.get(
              newChild.key === null ? newIdx : newChild.key
            ) || null;
          return updateElement(returnFiber, matchedFiber, newChild);
        }
      }
    }
  }

  function reconcileChildrenArray(returnFiber, currentFirstChild, newChildren) {
    let resultingFirstChild = null; // 返回的第一个新儿子
    let previousNewFiber = null; // 之前的新fiber
    let newIdx = 0; // 遍历新虚拟DOM的索引
    let oldFiber = currentFirstChild; // 第一个老fiber
    let nextOldFiber = null; // 下一个老fiber
    let lastPlacedIndex = 0; // 上一个不需要移动的老节点的索引
    // 开始第一轮循环 如果老fiber有值，新的虚拟DOM也有值
    for (; oldFiber !== null && newIdx < newChildren.length; newIdx++) {
      // 暂存下一个老fiber
      nextOldFiber = oldFiber.sibling;
      // 试图更新或者试图复用老的fiber
      const newFiber = updateSlot(returnFiber, oldFiber, newChildren[newIdx]);
      if (newFiber === null) {
        break;
      }
      if (shouldTracksSideEffects) {
        // 有老fiber，但是新的fiber并没有成功复用老fiber和老的真实DOM，删除老fiber，提交阶段删除真实DOM
        if (oldFiber && newFiber.alternate === null) {
          deleteChild(returnFiber, oldFiber);
        }
      }
      // 指定新fiber的位置
      lastPlacedIndex = placeChild(newFiber, lastPlacedIndex, newIdx);
      if (previousNewFiber === null) {
        resultingFirstChild = newFiber;
      } else {
        previousNewFiber.sibling = newFiber;
      }
      previousNewFiber = newFiber;
      oldFiber = nextOldFiber;
    }
    // 新的虚拟DOM已经循环完毕
    if (newIdx === newChildren.length) {
      // 第二轮循环情况1 删除剩下的老fiber
      deleteRemainingChildren(returnFiber, oldFiber);
      return resultingFirstChild;
    }
    if (oldFiber === null) {
      // 第二轮循环情况2 老fiber已经没有了，新的虚拟DOM还在，进入插入新节点的逻辑
      for (; newIdx < newChildren.length; newIdx++) {
        const newFiber = createChild(returnFiber, newChildren[newIdx]);
        if (newFiber === null) continue;
        // 把新fiber放到索引位置
        lastPlacedIndex = placeChild(newFiber, lastPlacedIndex, newIdx);
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
    }
    // 第三轮循环 开始处理移动的情况
    const existingChildren = mapRemainingChildren(returnFiber, oldFiber);
    // 开始遍历剩下的虚拟DOM子节点
    for (; newIdx < newChildren.length; newIdx++) {
      const newFiber = updateFromMap(
        existingChildren,
        returnFiber,
        newIdx,
        newChildren[newIdx]
      );
      if (newFiber !== null) {
        if (shouldTracksSideEffects) {
          // 需要跟踪副作用且存在的老fiber
          if (newFiber.alternate !== null) {
            existingChildren.delete(
              newFiber.key === null ? newIdx : newFiber.key
            );
          }
        }
        // 指定新fiber的存放位置，并且给lastPlacedIndex赋值
        lastPlacedIndex = placeChild(newFiber, lastPlacedIndex, newIdx);
        if (previousNewFiber === null) {
          resultingFirstChild = newFiber; // 这个newFiber就是大儿子
        } else {
          // 否则说明不是大儿子，把这个newFiber添加上一个子节点后面
          previousNewFiber.sibling = newFiber;
        }
        // 让newFiber成为最后一个或上一个子Fiber
        previousNewFiber = newFiber;
      }
    }
    if (shouldTracksSideEffects) {
      // 全部处理完之后，删除map中所有剩下的老fiber
      existingChildren.forEach((child) => deleteChild(returnFiber, child));
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

#### 控制台打印结果

![多节点diff复杂遍历打印结果](https://misaka10032.oss-cn-chengdu.aliyuncs.com/React/duo_jie_dian_diff_result.jpg)

## 手写源码仓库

https://github.com/mi-saka10032/mini-react/tree/master/packages/singledomdiff

https://github.com/mi-saka10032/mini-react/tree/master/packages/multipledomdiff