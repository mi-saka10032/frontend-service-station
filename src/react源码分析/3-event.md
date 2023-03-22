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

事件注册阶段，将事件名 Set 中全部需注册的原生事件遍历一遍，并结合对应的 React 事件名生成映射关系 Map，最终将注册事件名称添加到 allNativeEvents 的 Set 中

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
