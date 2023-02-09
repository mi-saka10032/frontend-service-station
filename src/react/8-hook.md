---
title: Hook
order: 8
category: false
tag:
  - Hook
  - 函数式组件
  - 逻辑复用
---

随着 React 16.8 的更新，函数式组件终于迎来了春天，大量 Hook API 的引入，让函数式组件能以更简洁、复用性更高的代码实现组件功能

## 简介

### 特点

1. 可在函数组件中使用 state 以及其他 React 特性
2. 完全可选的。 你无需重写任何已有代码就可以在一些组件中尝试 Hook。但是如果你不想，你不必现在就去学习或使用 Hook
3. 100% 向后兼容的。 Hook 不包含任何破坏性改动

### 动机

1. React 需要为共享状态逻辑提供更好的原生途径
2. Hook 可以在无需修改组件结构的情况下复用状态逻辑
3. 常规的类式组件愈发臃肿，Hook 可以将组件中相互关联的部分拆分成更小的函数（比如设置订阅或请求数据）

### 使用规则

Hook 就是 JavaScript 函数，但使用它们有两个额外规则：

1. 只能在函数最外层调用 Hook。不要在循环、条件判断或者子函数中调用。
2. 只能在 React 的函数组件中调用 Hook。不要在其他 JavaScript 函数中调用。（还有一个地方可以调用 Hook —— 就是自定义的 Hook 中，我们稍后会学习到。）

## 状态机 Hook `State Hook`

State Hook 让函数组件也可以有 state 状态，并进行状态数据的读写操作

### 语法

`const [xxx, setXxx] = React.useState(initialValue)`

### 说明

- 参数：第一次初始化指定的值创建闭包变量缓存
- 返回值：包含 2 个元素的数组，第 1 个为内部当前状态值，第 2 个为更新状态值的函数

### 写法

1. `setXxx(newValue[, callback])`：参数为非函数值，直接指定新的状态值，内部用其覆盖原来的状态值
2. `setXxx(value => newValue[, callback])`：参数为函数，接收原本的状态值，返回新的状态值，内部用其覆盖原来的状态值

案例：

```jsx
import React, { useState } from "react";

function Example() {
  // 声明一个叫 "count" 的 state 变量
  const [count, setCount] = useState(0);

  return (
    <div>
      <p>You clicked {count} times</p>
      <button onClick={() => setCount(count + 1)}>Click me</button>
    </div>
  );
}
```

## 副作用监听 Hook `Effect Hook`

### 副作用与操作

副作用：如果在 React 组件中有执行过数据获取、订阅或者手动修改过 DOM 的操作，我们统一把这些操作称为“副作用”，或者简称为“作用”。

React 中常见的副作用操作：

- 发送 ajax 请求数据获取
- 设置订阅 / 启动定时器
- 手动更改真实 DOM

`Effect Hook`允许函数组件能执行副作用操作，类似于模拟类式组件中的生命周期钩子，也与[Vue3 的 watch 和 watchEffect](../vue3/3-compositionAPI.html#watch)作用相近

### 语法

```js
useEffect(() => {
  // 在此可以执行任何带副作用操作
  return () => {
    // 组件卸载前执行
    // 可以执行收尾工作，例如清除定时器 / 取消订阅等
  };
}, [stateValue]); // 如果指定的是[]，回调函数仅在第一次render执行
```

### 说明

- 第二个参数传入数组形式的值，数组内部的变量应是`const [stateValue, setStateValue] = useState(initialValue)`中的 stateValue。仅当数组中指定的 state 状态值发生变化时，才会触发回调函数
- 如果第二个参数传入空数组，则整个回调函数仅在第一次 render 执行，相当于 componentDidMount 钩子函数
- 返回值会在组件卸载前执行，相当于 componentWillUnmount 钩子函数
- 可以把`useEffect Hook`看作如下三个函数与**render**(render 时会执行一次)的组合：
  - componentDidMount
  - componentDidUpdate
  - componentWillUnMount

### 额外的 Hook `useLayoutEffect`

函数功能与`useEffect`相同，但会在 DOM 变更之后同步调用 effect，用于 DOM 同步触发渲染

开发中尽可能使用`useEffect`以避免阻塞视觉更新

## 引用容器 Hook `Ref Hook`

`Ref Hook`可以在函数组件中存储/查找组件内的标签或任意其他数据

### 语法

```jsx
function TextInputWithFocusButton() {
  const inputEl = useRef(null);
  const onButtonClick = () => {
    // `current` 指向已挂载到 DOM 上的文本输入元素
    inputEl.current.focus();
  };
  return (
    <>
      <input ref={inputEl} type="text" />
      <button onClick={onButtonClick}>Focus the input</button>
    </>
  );
}
```

### 作用

保存标签对象，功能与 React.createRef()一样

### 额外的 Hook `useImperativeHandle`

useImperativeHandle 可以让你在使用 ref 时自定义暴露给父组件的实例值或 DOM 元素

useImperativeHandle 应当与 forwardRef 一起使用：

```jsx
function FancyInput(props, ref) {
  const inputRef = useRef();
  useImperativeHandle(ref, () => ({
    focus: () => {
      inputRef.current.focus();
    }
  }));
  return <input ref={inputRef} ... />;
}
FancyInput = forwardRef(FancyInput);
```

渲染 `<FancyInput ref={inputRef} />` 的父组件可以调用 `inputRef.current.focus()`

该 API 通常用于组件库组件向外暴露可用方法，或项目开发中对封装组件保留内部可操作方法

## 祖孙环境 Hook`Context Hook`

`Context Hook`实现了祖孙组件通信，接收一个 context 对象（React.createContext 的返回值）并返回该 context 的当前值。当前的 context 值由上层组件中距离当前组件最近（祖先组件）的 `<MyContext.Provider> `的 value prop 决定

以下是祖孙组件通信切换 button 颜色的 demo：

```jsx
import { createContext, useContext, useState } from "react";

const themes = {
  light: {
    foreground: "#000000",
    background: "#eeeeee",
  },
  dark: {
    foreground: "#ffffff",
    background: "#222222",
  },
};

const ThemeContext = createContext({
  theme: themes.light,
  changeTheme: () => {},
});

function ContextApp() {
  const [themeSwitch, setThemeSwitch] = useState("dark");

  const changeTheme = () => {
    setThemeSwitch((value) => (value === "light" ? "dark" : "light"));
  };

  return (
    <ThemeContext.Provider value={{ theme: themes[themeSwitch], changeTheme }}>
      <Toolbar />
    </ThemeContext.Provider>
  );
}

function Toolbar(props) {
  return (
    <>
      <ThemedButton />
    </>
  );
}

function ThemedButton() {
  const { theme, changeTheme } = useContext(ThemeContext);
  return (
    <button
      style={{ background: theme.background, color: theme.foreground }}
      onClick={changeTheme}
    >
      I am styled by theme context!
    </button>
  );
}

export default ContextApp;
```

更详细的 Context API 分析，详见[进阶技巧-Context](./9-进阶技巧.html#Context)

## 惰性取值 Hook `useMemo`

useMemo 会返回一个惰性的变量值，作用类似于[Vue3-computed](../vue3/3-compositionAPI.html#computed)

### 语法

```jsx
function App() {
  const [a, setA] = useState(0);
  const [b, setB] = useState(0);
  const memoizedSum = useMemo(() => {
    // 虽然render渲染调用了三次memo返回值，但是函数体仅调用一次，只有一次log
    console.log('sum');
    return a + b;
  }, [a, b]);

  return (
    <div>a: {a}</div>
    <div>b: {b}</div>
    <div>sum: {memoizedSum}</div>
    <div>sum: {memoizedSum}</div>
    <div>sum: {memoizedSum}</div>
  )
}
```

### 说明

- useMemo 会依赖于某个`useState`的依赖项发生变化而变化，对变量重新赋值
- 当依赖项不变时，变量值的多次重复使用不会重新调用计算函数执行计算，而是直接返回缓存的变量值
- 当其内部依赖项发生变化时，会再次调用计算函数执行计算后返回新值赋给变量

## 惰性函数 Hook `useCallback`

useCallback 会返回一个惰性的函数，类似于 useMemo，不同的是 useCallback 返回的是回调函数，只有依赖项更新时回调函数才会更新

| 何时生成新函数                     | 第二个参数                  |
| :--------------------------------- | :-------------------------- |
| 组件首次执行及更新都会生成新函数   | 空                          |
| 组件首次执行生成，之后不变         | []                          |
| 组件首次执行、依赖变化时生成新函数 | [state, ref.current] 这两类 |

### 语法

```jsx
import { useCallback, useState } from "react";

export default function MemoizedCallback() {
  const [a, setA] = useState(0);
  const [b, setB] = useState(0);

  const memoFn = useCallback(() => {
    console.log("执行callback");
    return a + b;
  }, [a]);

  return (
    <>
      <button onClick={() => setA(a + 1)}>a: {a}</button>
      <button onClick={() => setB(b + 1)}>b: {b}</button>
      <div>sum: {memoFn()}</div>
    </>
  );
}
```

在上面的 demo 中，因为 memoFn 回调只依赖于 a，所以当 button b 点击增加时，`<div>sum: {memoFn()}</div>`中的值不会正确变化，当然，函数体内的 console 还是会正常打印的。只有当 button a 点击后，才会重新更新函数，调用正确的 a 和 b 的值进行计算

因此，useCallback 实际的作用是：

1. 避免子组件对于函数不必要的 reRender
2. 当父子组件通信，父组件传递内部函数给子组件时，适合使用 useCallback

## 自定义 Hook

自定义 Hook 就是基于 Hook 函数的性质，开发者自行封装、实现其他功能的 hook 函数

这里列举一些与常见的、非业务型、功能性自定义 Hook

### usePrevious

类组件在 componentDidUpdate 可以获取 prevProps，函数式组件中我们使用 useRef 自定义 hook 来实现

```jsx
import { useEffect, useRef } from "react";

function usePrevious(value) {
  const ref = useRef();
  useEffect(() => {
    ref.current = value;
  });
  return ref.current;
}
```

### useInterval

用 delay 动态控制定时器，delay 为 null 时不创建定时器，同样利用了 useRef 来存储新的回调

```jsx
import { useEffect, useRef } from "react";

export default function useInterval(callback, delay) {
  const savedCallback = useRef();

  // 保存新回调
  useEffect(() => {
    savedCallback.current = callback;
  });

  // 建立 interval
  useEffect(() => {
    function tick() {
      savedCallback.current();
    }
    if (delay !== null) {
      let id = setInterval(tick, delay);
      return () => clearInterval(id);
    }
  }, [delay]);
}
```