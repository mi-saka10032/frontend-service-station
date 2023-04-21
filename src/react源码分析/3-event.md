---
title: 事件系统
order: 3
category: false
tag:
  - 事件系统
  - 事件委派
  - 合成事件
---

## 原理简述

React 提供了有别于原生 DOM 事件系统(onclick)的完整的可插入式合成事件系统(onClick)，其原理是将全部的派发事件全部代理到根节点，然后遵循事件捕获和事件冒泡的顺序执行合成事件

1. 首先将 React 所定义的全部 DOM 事件名称转化为合成事件名称，这一步称为事件注册
2. 根节点 Fiber 初始化完成(createContainer)之后，对根节点 DOM 开启已注册事件的代理监听。这一步会将之前已注册的合成事件名进行原生事件名转化，向根节点 DOM 添加事件监听器
3. 每个原生事件注册的监听函数以事件派发(dispatchEvent)的形式触发，会自底向上地推入回调函数队列，按照事件捕获 => 事件冒泡的顺序触发这一系列合成事件

下面将分阶段介绍事件系统的实现

## 事件注册

事件注册阶段，将事件名 Set 中全部需注册的原生事件遍历一遍，并结合对应的 React 事件名生成映射关系 Map，最终将注册事件名称添加到 **allNativeEvents** 的 Set 中

### DOMPluginEventSystem.js

```js
import * as SimpleEventPlugin from "./plugins/SimpleEventPlugin";

SimpleEventPlugin.registerEvents();
```

### SimpleEventPlugin.js

```js
import { registerSimpleEvents } from "../DOMEventProperties";

export { registerSimpleEvents as registerEvents };
```

### DOMEventProperties.js

```js
import { registerTwoPhaseEvent } from "react-dom/src/events/EventRegistry";
// 只注册click事件，其他需要注册的事件往里面添加就可以
const simpleEventPluginEvents = ["click"];
// 存储原生事件名和React事件名的映射关系
export const topLevelEventsTOReactNames = new Map();
function registerSimpleEvent(domEventName, reactName) {
  // 把原生事件名和处理函数的名字进行映射或绑定，click => onClick
  topLevelEventsTOReactNames.set(domEventName, reactName);
  registerTwoPhaseEvent(reactName, [domEventName]);
}

export function registerSimpleEvents() {
  for (let i = 0; i < simpleEventPluginEvents.length; i++) {
    const eventName = simpleEventPluginEvents[i]; // click
    const domEventName = eventName.toLowerCase(); // click
    const capitalizeEvent = eventName[0].toUpperCase() + eventName.slice(1); // Click
    registerSimpleEvent(domEventName, `on${capitalizeEvent}`); // click onClick
  }
}
```

### EventRegistry.js

```js
export const allNativeEvents = new Set();

/**
 * 注册两个阶段的事件名
 * 当页面中触发事件的时候，会走事件处理函数
 * 事件处理函数需要找到DOM元素对应要执行的React事件，onClick、onClickCapture等
 * @param registrationName React事件名
 * @param dependencies 原生事件数组[click]
 */
export function registerTwoPhaseEvent(registrationName, dependencies) {
  // 注册冒泡事件关系
  registerDirectEvent(registrationName, dependencies);
  // 注册捕获事件关系
  registerDirectEvent(registrationName + "Capture", dependencies);
}

export function registerDirectEvent(registrationName, dependencies) {
  for (let i = 0; i < dependencies.length; i++) {
    allNativeEvents.add(dependencies[i]); // click
  }
}
```

## 事件监听

createRoot 阶段，创建完根节点 Fiber 后，遍历**allNativeEvents**，开启对所有已注册事件的监听

注意监听器只针对根容器，且只会监听一次不会重复监听

### ReactDOMRoot.js

```js
export function createRoot(container) {
  // div#root
  const root = createContainer(container);
  listenToAllSupportedEvents(container);
  return new ReactDOMRoot(root);
}
```

### EventSystemFlags.js

```js
export const IS_CAPTURE_PHASE = 1 << 2;
// 0b0100
```

### DOMPluginEventSystem.js

```js
import { allNativeEvents } from "./EventRegistry";
import { IS_CAPTURE_PHASE } from "./EventSystemFlags";

const listeningMarker = `_reactListening` + Math.random().toString(36).slice(2);

export function listenToAllSupportedEvents(rootContainerElement) {
  // 监听根容器div#root，只监听执行一次
  if (!rootContainerElement[listeningMarker]) {
    rootContainerElement[listeningMarker] = true;
    allNativeEvents.forEach((domEventName) => {
      listenToNativeEvent(domEventName, true, rootContainerElement);
      listenToNativeEvent(domEventName, false, rootContainerElement);
    });
  }
}

/**
 * 注册原生事件
 * @param domEventName 原生事件
 * @param isCapturePhaseListener 是否是捕获节点
 * @param target 目标DOM节点 div#root 容器节点
 */
export function listenToNativeEvent(
  domEventName,
  isCapturePhaseListener,
  target
) {
  let eventSystemFlags = 0; // 默认是0，冒泡 4是捕获
  if (isCapturePhaseListener) {
    eventSystemFlags |= IS_CAPTURE_PHASE;
  }
  addTrappedEventListener(
    target,
    domEventName,
    eventSystemFlags,
    isCapturePhaseListener
  );
}

function addTrappedEventListener(
  targetContainer,
  domEventName,
  eventSystemFlags,
  isCapturePhaseListener
) {
  // 创建基于优先级的监听函数回调
  const listener = createEventListenerWrapperWithPriority(
    targetContainer,
    domEventName,
    eventSystemFlags
  );
  if (isCapturePhaseListener) {
    addEventCaptureListener(targetContainer, domEventName, listener);
  } else {
    addEventBubbleListener(targetContainer, domEventName, listener);
  }
}

// EventListener.js
export function addEventCaptureListener(target, eventType, listener) {
  target.addEventListener(eventType, listener, true);
  return listener;
}

export function addEventBubbleListener(target, eventType, listener) {
  target.addEventListener(eventType, listener, false);
  return listener;
}
```

## 事件派发

上面的事件监听，对监听函数 listener 实例函数进行了特殊处理，使得每个监听回调函数能自动执行事件派发功能，这里用到的关键函数就是**createEventListenerWrapperWithPriority**

注意事件派发中事件捕获和冒泡累加回调函数的关键函数是 accumulateSinglePhaseListeners，通过不断执行 Fiber 的 return 循环，判断符合条件的 React 事件，将回调推入 listeners 回调数组，并加入到执行队列 dispatchQueue 中

### ReactDOMEventListener.js

```js
import { getEventTarget } from "./getEventTarget";
import { getClosestInstanceFromNode } from "../client/ReactDOMComponentTree";
import { dispatchEventForPluginEventSystem } from "./DOMPluginEventSystem";

export function createEventListenerWrapperWithPriority(
  targetContainer,
  domEventName,
  eventSystemFlags
) {
  const listenerWrapper = dispatchDiscreteEvent;
  return listenerWrapper.bind(
    null,
    domEventName,
    eventSystemFlags,
    targetContainer
  );
}

/**
 * 派发离散事件的监听函数
 * @param domEventName 事件名
 * @param eventSystemFlags 阶段 0冒泡 4捕获
 * @param container 容器div#root
 * @param nativeEvent 原生事件
 */
function dispatchDiscreteEvent(
  domEventName,
  eventSystemFlags,
  container,
  nativeEvent
) {
  dispatchEvent(domEventName, eventSystemFlags, container, nativeEvent);
}

/**
 * 此方法就是委托给容器的回调，当容器#root在捕获或者说冒泡阶段处理事件的时候执行此函数
 * @param domEventName
 * @param eventSystemFlags
 * @param targetContainer
 * @param nativeEvent
 */
export function dispatchEvent(
  domEventName,
  eventSystemFlags,
  targetContainer,
  nativeEvent
) {
  // 获取事件源，它应该是一个真实DOM
  const nativeEventTarget = getEventTarget(nativeEvent);
  const targetInst = getClosestInstanceFromNode(nativeEventTarget);
  dispatchEventForPluginEventSystem(
    domEventName, // click
    eventSystemFlags, // 0 4
    nativeEvent, // 原生事件
    targetInst, // 此真实DOM对应的fiber
    targetContainer // 目标容器
  );
}

// getEventTarget.js
export function getEventTarget(nativeEvent) {
  const target = nativeEvent.target || nativeEvent.srcElement || window;
  return target;
}
```

### ReactDOMComponentTree.js

```js
const randomKey = Math.random().toString(36).slice(2);
const internalInstanceKey = "__reactFiber$" + randomKey;
const internalPropsKey = "__reactProps$" + randomKey;

/**
 * 从真实的DOM节点上获取它对应的Fiber节点
 * @param targetNode
 */
export function getClosestInstanceFromNode(targetNode) {
  const targetInst = targetNode[internalInstanceKey];
  return targetInst;
}

/**
 * 提前缓存Fiber节点的实例到DOM节点上
 * @param hostInst fiber实例
 * @param node 真实DOM
 */
export function precacheFiberNode(hostInst, node) {
  node[internalInstanceKey] = hostInst;
}

export function updateFiberProps(node, props) {
  node[internalPropsKey] = props;
}

export function getFiberCurrentPropsFromNode(node) {
  return node[internalPropsKey] || null;
}
```

### DOMPluginEventSystem.js

再次回到 DOMPluginEventSystem，派发事件函数还是在这里进行声明

```js
export function dispatchEventForPluginEventSystem(
  domEventName,
  eventSystemFlags,
  nativeEvent,
  targetInst,
  targetContainer
) {
  dispatchEventForPlugins(
    domEventName,
    eventSystemFlags,
    nativeEvent,
    targetInst,
    targetContainer
  );
}

function dispatchEventForPlugins(
  domEventName,
  eventSystemFlags,
  nativeEvent,
  targetInst,
  targetContainer
) {
  const nativeEventTarget = getEventTarget(nativeEvent);
  // 派发事件的数组
  const dispatchQueue = [];
  extractEvents(
    dispatchQueue,
    domEventName,
    targetInst,
    nativeEvent,
    nativeEventTarget,
    eventSystemFlags,
    targetContainer
  );
}

function extractEvents(
  dispatchQueue,
  domEventName,
  targetInst,
  nativeEvent,
  nativeEventTarget,
  eventSystemFlags,
  targetContainer
) {
  SimpleEventPlugin.extractEvents(
    dispatchQueue,
    domEventName,
    targetInst,
    nativeEvent,
    nativeEventTarget,
    eventSystemFlags,
    targetContainer
  );
}

export function accumulateSinglePhaseListeners(
  targetFiber,
  reactName,
  nativeEventType,
  isCapturePhase
) {
  const captureName = reactName + "Capture";
  const reactEventName = isCapturePhase ? captureName : reactName;
  const listeners = [];
  let instance = targetFiber;
  while (instance !== null) {
    const { stateNode, tag } = instance;
    if (tag === HostComponent && stateNode !== null) {
      const listener = getListener(instance, reactEventName);
      if (listener) {
        listeners.push(createDispatchListener(instance, listener, stateNode));
      }
    }
    instance = instance.return;
  }
  return listeners;
}

function createDispatchListener(instance, listener, currentTarget) {
  return { instance, listener, currentTarget };
}
```

### getListener.js

```js
import { getFiberCurrentPropsFromNode } from "react-dom/src/client/ReactDOMComponentTree";

/**
 * 获取此fiber上对应的回调函数
 * @param inst
 * @param registrationName
 */

export default function getListener(inst, registrationName) {
  const { stateNode } = inst;
  if (stateNode === null) {
    return null;
  }
  const props = getFiberCurrentPropsFromNode(stateNode);
  if (props === null) {
    return null;
  }
  const listener = props[registrationName]; // props.onClick
  return listener;
}
```

### SimpleEventPlugin.js

```js
import {
  registerSimpleEvents,
  topLevelEventsTOReactNames,
} from "../DOMEventProperties";
import { IS_CAPTURE_PHASE } from "react-dom/src/events/EventSystemFlags";
import { SyntheticMouseEvent } from "../SyntheticEvent";

/**
 * 把要执行的回调函数添加到派发队列中
 * @param dispatchQueue 派发队列，里面放置监听函数
 * @param domEventName DOM事件名，click
 * @param targetInst 目标fiber
 * @param nativeEvent 原生事件
 * @param nativeEventTarget 原生事件源
 * @param eventSystemFlags 事件系统标识 0冒泡 4捕获
 * @param targetContainer 目标容器 div#root
 */
function extractEvents(
  dispatchQueue,
  domEventName,
  targetInst,
  nativeEvent,
  nativeEventTarget, // click => onClick
  eventSystemFlags,
  targetContainer
) {
  const reactName = topLevelEventsTOReactNames.get(domEventName); // click => onClick
  let SyntheticEventCtor; // 合成事件的构造函数
  switch (domEventName) {
    case "click":
      SyntheticEventCtor = SyntheticMouseEvent;
      break;
    default:
      break;
  }
  // 检查是否捕获阶段
  const inCapturePhase = (eventSystemFlags & IS_CAPTURE_PHASE) !== 0; // 是否是捕获阶段
  // 累加单个阶段的监听
  const listeners = accumulateSinglePhaseListeners(
    targetInst,
    reactName,
    nativeEvent.type,
    inCapturePhase
  );
  // 如果有要执行的监听函数[onClickCapture, onClickCapture] = [ChildCapture, ParentCapture]
  if (listeners.length > 0) {
    const event = new SyntheticEventCtor(
      reactName,
      domEventName,
      null,
      nativeEvent,
      nativeEventTarget
    );
    dispatchQueue.push({
      event, // 合成事件实例
      listeners, // 监听函数数组
    });
  }
}

export { registerSimpleEvents as registerEvents, extractEvents };
```

### SyntheticEvent.js

这个方法的主要作用是融合 React 事件的 Event 和原生事件的 Event

```js
import hasOwnProperty from "shared/hasOwnProperty";
import assign from "shared/assign";

function functionThatReturnsTrue() {
  return true;
}

function functionThatReturnsFalse() {
  return false;
}

const MouseEventInterface = {
  clientX: 0,
  clientY: 0,
};

function createSyntheticEvent(inter) {
  /**
   * 合成事件的基类
   * @param reactName react的属性名 onClick
   * @param reactEventType react时间类型 click
   * @param targetInst 事件源对应的fiber实例
   * @param nativeEvent 原生事件对象
   * @param nativeEventTarget 原生事件源 真实DOM
   * @constructor
   */
  function SyntheticBaseEvent(
    reactName,
    reactEventType,
    targetInst,
    nativeEvent,
    nativeEventTarget
  ) {
    this._reactName = reactName;
    this.type = reactEventType;
    this._targetInst = targetInst;
    this.nativeEvent = nativeEvent;
    this.target = nativeEventTarget;
    // 把此接口上对应的属性从原生事件上拷贝到合成事件实例上
    for (const propName in inter) {
      if (!hasOwnProperty.call(inter, propName)) {
        continue;
      }
      this[propName] = nativeEvent[propName];
    }
    // 是否已阻止默认事件
    this.isDefaultPrevented = functionThatReturnsFalse;
    // 是否已阻止继续传播
    this.isPropagationStopped = functionThatReturnsFalse;
    return this;
  }
  assign(SyntheticBaseEvent.prototype, {
    preventDefault() {
      const event = this.nativeEvent;
      if (event.preventDefault) {
        event.preventDefault();
      } else {
        event.returnValue = false;
      }
      this.isDefaultPrevented = functionThatReturnsTrue;
    },
    stopPropagation() {
      const event = this.nativeEvent;
      if (event.stopPropagation) {
        event.stopPropagation();
      } else {
        event.cancelBubble = true;
      }
      this.isPropagationStopped = functionThatReturnsTrue;
    },
  });
  return SyntheticBaseEvent;
}

export const SyntheticMouseEvent = createSyntheticEvent(MouseEventInterface);
```

## 事件处理

在回调函数执行完成 extractEvents 之后，实际上 dispatchQueue 就已经成功储存到所有基于事件捕获和事件冒泡的两套回调函数的数组了，接下来需要根据捕获顺序和冒泡顺序处理派发事件 processDispatchQueue

### DOMPluginEventSystem.js

```js
function dispatchEventForPlugins(
  domEventName,
  eventSystemFlags,
  nativeEvent,
  targetInst,
  targetContainer
) {
  const nativeEventTarget = getEventTarget(nativeEvent);
  // 派发事件的数组
  const dispatchQueue = [];
  extractEvents(
    dispatchQueue,
    domEventName,
    targetInst,
    nativeEvent,
    nativeEventTarget,
    eventSystemFlags,
    targetContainer
  );
  // processDispatchQueue 处理派发事件
  processDispatchQueue(dispatchQueue, eventSystemFlags);
}

function processDispatchQueue(dispatchQueue, eventSystemFlags) {
  // 判断是否捕获阶段
  const inCapturePhase = (eventSystemFlags & IS_CAPTURE_PHASE) !== 0;
  // 循环派发队列
  for (let i = 0; i <= dispatchQueue.length - 1; i++) {
    const { event, listeners } = dispatchQueue[i];
    processDispatchQueueItemsInOrder(event, listeners, inCapturePhase);
  }
}

/**
 * 合成事件的实例currentTarget是在不断变化的
 * event nativeEventTarget指的是原始事件源，永远不变
 * event currentTarget 当前的事件源，会随着事件回调执行不断变化
 * @param listener
 * @param event
 * @param currentTarget
 */
function executeDispatch(listener, event, currentTarget) {
  event.currentTarget = currentTarget;
  listener(event);
}

function processDispatchQueueItemsInOrder(
  event,
  dispatchListeners,
  inCapturePhase
) {
  if (inCapturePhase) {
    // dispatchListeners[子，父]
    for (let i = dispatchListeners.length - 1; i >= 0; i--) {
      const { listener, currentTarget } = dispatchListeners[i];
      if (event.isPropagationStopped()) {
        return;
      }
      executeDispatch(listener, event, currentTarget);
    }
  } else {
    // dispatchListeners[父，子]
    for (let i = 0; i <= dispatchListeners.length - 1; i++) {
      const { listener, currentTarget } = dispatchListeners[i];
      if (event.isPropagationStopped()) {
        return;
      }
      executeDispatch(listener, event, currentTarget);
    }
  }
}
```

## 容易忽略的点

在 accumulateSinglePhaseListeners 累加回调函数阶段

1. 我们对当前 Fiber 节点进行 return 循环，逐步获取上级 Fiber 的节点和 DOM 元素
2. 我们从 getListener 中获取到了匹配 React 合成事件名的回调函数，加入回调数组

但是

1. 如何获取当前最近的 Fiber 节点？
2. 从何获取 JSX 上绑定的事件回调函数？

实际上，我们需要对 Fiber 方法中的创建实例的函数进行修改，让 Fiber 对应的 DOM 元素绑定预存 Fiber 节点和 props

### ReactDOMHostConfig.js

```js
export function createInstance(type, props, internalInstanceHandle) {
  const domElement = document.createElement(type);
  // 预先缓存fiber节点到DOM节点上
  precacheFiberNode(internalInstanceHandle, domElement);
  // 属性的添加TODO
  updateFiberProps(domElement, props);
  return domElement;
}
```

这样，便可以在 dispatchEvent 派发事件函数中获取到 target 目标 DOM 上最近的那一个 Fiber 节点

```js
export function dispatchEvent(
  domEventName,
  eventSystemFlags,
  targetContainer,
  nativeEvent
) {
  // 获取事件源，它应该是一个真实DOM
  const nativeEventTarget = getEventTarget(nativeEvent);
  const targetInst = getClosestInstanceFromNode(nativeEventTarget);
  dispatchEventForPluginEventSystem(
    domEventName, // click
    eventSystemFlags, // 0 4
    nativeEvent, // 原生事件
    targetInst, // 此真实DOM对应的fiber
    targetContainer // 目标容器
  );
}
```

### accumulateSinglePhaseListeners.js

累加回调也能通过上面透传的 targetInst(targetFiber)，执行 return 循环查找

```js
export function accumulateSinglePhaseListeners(
  targetFiber,
  reactName,
  nativeEventType,
  isCapturePhase
) {
  const captureName = reactName + "Capture";
  const reactEventName = isCapturePhase ? captureName : reactName;
  const listeners = [];
  let instance = targetFiber;
  while (instance !== null) {
    const { stateNode, tag } = instance;
    if (tag === HostComponent && stateNode !== null) {
      const listener = getListener(instance, reactEventName);
      if (listener) {
        listeners.push(createDispatchListener(instance, listener, stateNode));
      }
    }
    instance = instance.return;
  }
  return listeners;
}
```

### getListener.js

同理，在上面需要获取 listener 回调函数的时候，也是能获取到函数的

```js
export default function getListener(inst, registrationName) {
  const { stateNode } = inst;
  if (stateNode === null) {
    return null;
  }
  const props = getFiberCurrentPropsFromNode(stateNode);
  if (props === null) {
    return null;
  }
  const listener = props[registrationName]; // props.onClick
  return listener;
}
```

## 流程图

事件监听流程图

![DOMPluginEventSystem](https://misaka10032.oss-cn-chengdu.aliyuncs.com/React/DOMPluginEventSystem.jpg)

事件派发流程图

![extractEvents](https://misaka10032.oss-cn-chengdu.aliyuncs.com/React/extractEvents.jpg)

事件处理流程图

![processDispatchQueue](https://misaka10032.oss-cn-chengdu.aliyuncs.com/React/processDispatchQueue.jpg)

## 最终输出结果

main.jsx

```js
import { createRoot } from "react-dom/client";

function FunctionComponent() {
  const parentBubble = () => {
    console.log("父冒泡");
  };
  const parentCapture = () => {
    console.log("父捕获");
  };
  const childBubble = () => {
    console.log("子冒泡");
  };
  const childCapture = () => {
    console.log("子捕获");
  };
  return (
    <h1 id="container" onClick={parentBubble} onClickCapture={parentCapture}>
      hello
      <span
        style={{ color: "red" }}
        onClick={childBubble}
        onClickCapture={childCapture}
      >
        world
      </span>
    </h1>
  );
}
const element = <FunctionComponent />;
const root = createRoot(document.getElementById("root"));
// 把element虚拟DOM挂载到容器中
root.render(element);
```

点击 world 之后控制台打印结果：

![eventSystemResult](https://misaka10032.oss-cn-chengdu.aliyuncs.com/React/eventSystem-result.png)

## 手写源码仓库

https://github.com/mi-saka10032/mini-react/tree/master/packages/events