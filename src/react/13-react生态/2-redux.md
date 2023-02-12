---
title: Redux
order: 2
category: false
tag:
  - 全局状态管理
  - Redux
  - Flux模型
  - 异步中间件
  - 事务监听
---

本章记录基于 Flux 思想在内的多数常用状态管理库，不局限于 Redux

## `Flux`架构

Flux 是一种架构思想，解决软件的结构问题，它跟 MVC 架构是同一类东西，但是更加简单和清晰

Facebook Flux 的应用架构利用**单向数据流**组合 React 中的视图组件，具体流程是：

1. 用户访问 View
2. View 发出用户的 Action
3. Dispatcher 收到 Action，要求 Store 进行相应更新
4. Store 更新后，发出一个'change'事件
5. View 收到'change'事件后，更新页面

## `Redux`

Redux 作为应用全局状态管理机而存在，用一个单独的常量状态树（state 对象）保存这一整个应用状态，并且对象不能直接被改变，当数据发生变化，一个新的对象就会被创建（使用 actions 和 reducers），再进行数据跟踪，实现时光旅行

### `Redux`使用三原则

1. state 以单一对象存储在 store 对象中
2. state 只读（每次都返回一个新对象）
3. 使用纯函数 reducer 执行 state 更新

### `Redux`工作流

![Redux工作流](https://misaka10032.oss-cn-chengdu.aliyuncs.com/React/redux-workflow.jfif)

### Store

redux 中只有一个 Store，整个应用需要管理的数据都在这个 Store 里面，这个 Store 我们不能直接去改变，只能通过返回新的 Store 去更改它

```js
import { createStore } from "redux";
const store = createStore(reducer);
```

### Action

这个 action 指的是视图层发起的一个操作，告诉 Store 我们需要改变。比如用户点击了按钮，我们就要去请求列表，列表的数据就会变更。每个 action 必须有一个 type 属性，这表示 action 的名称，然后还可以有一个 payload 属性，这个属性可以带一些参数，用作 Store 变更

Action 是消息的载体，只能被别人操作自己不进行操作

```js
const action = {
  type: "ADD_ITEM",
  payload: "new item", // 可选属性
};
```

### Reducer

`store.dispatch()`是 View 发出 Action 的唯一方法，发起 Action 之后会到达 Reducer

Reducer 接收两个参数：当前的 state 和接收到的 action，经过计算，返回一个新的 state

reducer 是一个纯函数，即对于相同的输入，只会有相同的输出，不影响外部的值

### 示例代码

store.js

```js
//引入creacteStore,专门用于创建redux中最核心的store对象
import { legacy_createStore as createStore } from "redux";
//引入为Count组件服务的reducer
import countRedux from "./reducers";
const store = createStore(countRedux);
//暴露出去
export default store;
```

reducers.js

```js
//接收两个参数 之前的状态preState,和动作对象action
//const init=0
export default function countRedux(preState, action) {
  // 从action对象中拿出：type,data
  console.log(preState, action);

  const { type, data } = action;
  // 根据传进来的type判断要进行的操作
  switch (type) {
    // 如果类型是加，用传进来之前的值+action中的值，返回出去
    case "add1":
      return preState + data;
    case "add2":
      return preState - data;

    default:
      //返回初始化数据
      return 0;
  }
}
```

视图 view：count.jsx

```jsx
import React, { Component } from "react";
// 引入状态
import store from "./redux/store.js";
class count extends Component {
  state = {};
  // 组件挂载时调用
  componentDidMount() {
    // 当Redux状态变化时，强制更新render,让页面进行渲染
    store.subscribe(() => {
      this.setState({});
    });
  }
  // 加法
  add1 = () => {
    const { value } = this.select;
    store.dispatch({ type: "add1", data: value * 1 });
  };
  add2 = () => {
    const { value } = this.select;
    //console.log(typeof value)//string
    store.dispatch({ type: "add2", data: value * 1 });
  };
  add3 = () => {
    const { value } = this.select;
    //console.log(typeof value)//string
    const count = store.getState();
    //string+number=string 所以要把string转number
    if (count % 2 !== 0) {
      store.dispatch({ type: "add1", data: value * 1 });
    } else {
      alert("不符合奇数要求");
    }
  };
  add4 = () => {
    const { value } = this.select;
    //console.log(typeof value)//string

    //string+number=string 所以要把string转number
    setInterval(() => {
      store.dispatch({ type: "add1", data: value * 1 });
    }, 2000);
  };
  render() {
    return (
      <div>
        {/* 获取状态 */}
        <h4>{store.getState()}</h4>
        <select
          ref={(c) => {
            this.select = c;
          }}
        >
          <option value="1">1</option>
          <option value="2">2</option>
          <option value="3">3</option>
          <option value="4">4</option>
        </select>
        &nbsp;
        <button onClick={this.add1}>+</button>&nbsp;
        <button onClick={this.add2}>-</button>&nbsp;
        <button onClick={this.add3}>当前求和为奇数再加</button>&nbsp;
        <button onClick={this.add4}>异步加</button>
      </div>
    );
  }
}

export default count;
```

### `Reducer`命名空间

不同的 actions 所处理的属性之间没有联系的，可以把 Reducer 函数拆分，不同函数分管不同属性最终合并 Store

先使用 combineReducers 合并 reducers，在 createStore

```js
import { combineReducers, createStore } from "redux";
const reducers = combineReducers({
  a: functionA,
  b: functionB,
  c: functionC,
});
const store = createStore(reducers);
```

访问：

```js
(state) => ({
  newState: state.a（不同的命名空间）
})
```

## react-redux

`react-redux`简化了 redux 的书写流程，使 redux 能更简洁地嵌入到 React 组件中，比如无需组件添加与取消订阅，属性自动获取等

### 容器组件与 UI 组件

UI 组件：

- 只负责 UI 呈现，不带有任何业务逻辑
- 没有状态，即不使用 state 状态管理
- 所有数据都由参数 props 提供
- 不使用任何 redux 的 API

容器组件：

- 负责管理数据和业务逻辑，不负责 UI 的呈现
- 带有内部状态

### `react-redux`流程

![react-redux流程](https://misaka10032.oss-cn-chengdu.aliyuncs.com/React/react-redux.png)

简化的流程有：

1. store -> reducers -> combineReducers：reducer 合并
2. store -> mapStateToProps：状态转 props 属性
3. actions -> mapDispatchToProps：方法转属性
4. 最终容器组件 = connect(mapStateToProps, mapDispatchToProps：方法转属性)(视图组件)：属性与方法注入
5. 提供者 Provider：提供全局 store

总的来说，`react-redux`是为了简化 redux 的操作步骤，对视图组件执行 props 属性的按需注入，通过属性直接操作 state 与 action，进一步分离了 redux 与 view 之间的联系，view 组建中不会调用 redux 中的任何 api

从代码风格上来看，`react-redux`跟`vueX`风格类似

示例代码详见[redux-saga 代码示例](#使用案例)引用了`react-redux`的案例
