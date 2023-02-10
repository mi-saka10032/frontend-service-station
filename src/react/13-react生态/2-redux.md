---
title: Redux
order: 2
category: false
tag:
  - 全局状态管理
  - Redux
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

### 异步中间件

机制：识别 action 的类型，函数类型执行异步中间件；非函数类型执行同步操作：返回类型值操作 Reducers

#### `redux-thunk`

原理：

```js
function createThunkMiddleware(extraArgument) {
  return ({ dispatch, getState }) =>
    (next) =>
    (action) => {
      if (typeof action === "function") {
        return action(dispatch, getState, extraArgument);
      }
      return next(action);
    };
}
const thunk = createThunkMiddleware();
thunk.withExtraArgument = createThunkMiddleware;
export default thunk;
```

store.js

```js
import thunk from "redux-thunk";
import { applyMiddleware } from "redux";
const store = createStore(reducers, applyMiddleware(thunk));
```

actions.js

```js
function getWeather(url, params) {
  return (dispatch, getState) => {
    axios(url, params)
      .then((result) => {
        dispatch({ type: "GET_WEATHER_SUCCESS", payload: result });
      })
      .catch((err) => {
        dispatch({ type: "GET_WEATHER_ERROR", error: err });
      });
  };
}
```

view.jsx

```jsx
useEffect(() => {
  store.dispatch(getAsyncList());
}, []);
```

dispatch 更改为函数，将 dispatch 作为函数的第一个函数传递进去，在函数内异步操作即可

#### `redux-promise`

`redux-thunk`适合简单 API 请求场景，`redux-promise`更适合输入输出操作

源码：

```js
import { isFSA } from "flux-standard-action";
function isPromise(val) {
  return val && typeof val.then === "function";
}
export default function promiseMiddleware({ dispatch }) {
  return (next) => (action) => {
    if (!isFSA(action)) {
      return isPromise(action) ? action.then(dispatch) : next(action);
    }
    return isPromise(action.payload)
      ? action.payload.then(
          (result) => dispatch({ ...action, payload: result }),
          (error) => {
            dispatch({ ...action, payload: error, error: true });
            return Promise.reject(error);
          }
        )
      : next(action);
  };
}
```

其实跟`redux-thunk`大差不差

1. 先判断是不是标准 flux action
2. 如果不是则判断是否 promise，是的话执行`action.then(dispatch)`，否则执行`next(action)`
3. 如果是，就判断 payload 是否是 promise，是就 payload.then 获取数据，然后 dispatch 最终的结果，不是则执行 next(action)

简化 actions 写法

```js
const fetchData = (url, params) => fetch(url, params);

async function getWeather(url, params) {
  const result = await fetchData(url, params);
  if (result.error) {
    return { type: "GET_WEATHER_ERROR", error: result.error };
  }
  return { type: "GET_WEATHER_SUCCESS", payload: result };
}
```

#### `redux-saga`

`redux-saga`是用于代替`redux-thunk`的异步操作管理中间件。它创建 Sagas 将所有异步操作逻辑存放在一个地方集中处理，以此将同步与异步操作分开维护

![redux-saga](https://misaka10032.oss-cn-chengdu.aliyuncs.com/React/redux-saga.png)

特点：

1. 复杂异步
2. 可以使用 takeEvery 打印 logger，便于测试
3. 提供 takeLatest/takeEvery/throttle 方法，便于实现事件监测与节流
4. 提供 cancel/delay 方法，可以取消或延迟异步请求
5. 提供`race(effects), [...effects]`，支持竞态和并行
6. 提供 channel 机制支持外部事件