---
title: Redux异步中间件
order: 3
category: false
tag:
  - Redux
  - 异步中间件
  - Promise
  - Generator
  - flow
---

redux 自身的 action 函数只支持同步方法，无法识别异步方法并有效执行，因此出现了异步中间件用来增强 redux 功能

工作流程：识别 action 的类型，函数类型执行异步中间件；非函数类型执行同步操作：返回类型值操作 Reducers

## redux-thunk

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

## redux-promise

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

`redux-promise`算是``redux-thunk`进一步优化与完善

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

## redux-saga

`redux-saga`是用于代替`redux-thunk`的异步操作管理中间件。它创建 Sagas 将所有异步操作逻辑存放在一个地方集中处理，以此将同步与异步操作分开维护

### 特点

`redux-saga`算是`redux-promise`与 Action 订阅发布系统的集成化管理应用

1. 复杂异步
2. 可以使用 takeEvery 打印 logger，便于测试
3. 提供 takeLatest/takeEvery/throttle 方法，便于实现事件监测与节流
4. 提供 cancel/delay 方法，可以取消或延迟异步请求
5. 提供`race(effects), [...effects]`，支持竞态和并行
6. 提供 channel 机制支持外部事件

### 运行流程图

![redux-saga](https://misaka10032.oss-cn-chengdu.aliyuncs.com/React/redux-saga.png)

saga 的作用：

- 监听用户发出的 Action
- 发现用户发出的 Action 是自己当前的 Action，然后做一些副作用（派发新任务）
- store 接收到新的任务，返回新的 State

### 示例代码

```jsx
import React from "react";
import ReactDOM from "react-dom";
import App from "./App";
import { createStore, applyMiddleware, combineReducers } from "redux";
import rootReducer from "./reducers";
/// 开启DevTools工具监听saga
import { composeWithDevTools } from "redux-devtools-extension";
import createSagaMiddleware from "redux-saga";
import { Provider } from "react-redux";
import { watchIncrementAsync } from "./sagas/counter";

function* helloSaga() {
  console.log('Hello Sagas!);
}

//====1 创建一个saga中间件
const sagaMiddleware = createSagaMiddleware();

//====2 创建store
const store = createStore(
  rootReducer,
  composeWithDevTools(applyMiddleware(sagaMiddleware))
);
//==== 3动态执行saga，注意：run函数只能在store创建好之后调用
// 运行成功后，控制台打印'Hello Sagas!'
sagaMiddleware.run(helloSaga);

ReactDOM.render(
  <Provider store={store}>
    <App />
  </Provider>,
  document.getElementById("root")
);
```

### 核心 API

#### 1.tackEvery

```js
import { takeEvery } from "redux-saga";

function* incrementAsync() {
  // 延迟1s
  yield delay(1000);

  yield put({
    type: "increment",
  });
}

// 监听到Action为incrementAsync就会出发incrementAsync函数
function* watchIncrementAsync() {
  yield takeEvery("incrementAsync", incrementAsync);
}

// 注意watchIncrementAsync这个函数必须在主入口index中运行sagaMiddleware.run(watchIncrementAsync);
```

#### 2.takeLatest

作用同 takeEvery 一样，唯一的区别是它只关注最后，也就是最近一次发起的异步请求，如果上次请求还未返回，则会被取消。可以理解为异步请求防抖，对同步方法无效

```js
function* watchIncrementAsync() {
  yield takeLatest("incrementAsync", fetchData);
}
```

#### 3.call

异步阻塞调用

用来调用异步函数，将异步函数和函数参数作为 call 函数的参数传入，返回一个 js 对象。saga 引入他的主要作用是方便测试，同时也能让我们的代码更加规范化。

```js
const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

function* fetchData() {
  // 2秒后打印saga（阻塞）
  // 等同于：yield delay(2000);
  yield call(delay, 2000);
  console.log("saga");
}

// 加了call和不加效果是一样的，saga引入他的主要作用是方便测试，同时也能让我们的代码更加规范化。
```

#### 4.fork

异步非阻塞调用，无阻塞的执行 fn，执行 fn 时，不会暂停 Generator

非阻塞任务调用机制：上面我们介绍过 call 可以用来发起异步操作，但是相对于 generator 函数来说，call 操作是阻塞的，只有等 promise 回来后才能继续执行，而 fork 是非阻塞的 ，当调用 fork 启动一个任务时，该任务在后台继续执行，从而使得我们的执行流能继续往下执行而不必一定要等待返回

```js
const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

function* fetchData() {
  // 不用等待2秒，直接可以打印出saga，并发执行
  yield fork(delay, 2000);
  console.log("saga");
}
```

#### 5.put

相当于 dispatch，分发一个 action

```js
yield put({ type: 'incrementAsync'})
```

#### 6.select

相当于 getState，用于获取 store 中相应部分的 state

```js
function* incrementAsync(action) {
  let state = yield select((state) => console.log("-----", state));
}
```

#### 7.tack

监听 action，暂停 Generator，匹配的 action 被发起时，恢复执行

```js
export function* watchIncrementAsync() {
  while (true) {
    yield take("INCREMENT_ASYNC"); // 监听
    yield fork(incrementAsync);
  }
  // yield takeLatest(INCREMENT_ASYNC, incrementAsync); //takeLatest
}
```

#### 8.cancel

创建一个 Effect 描述信息，针对 fork 方法返回的 task ，可以进行取消关闭。cancel(task)

#### `9.race([...effects])`

创建一个 Effect 描述信息，指示 middleware 在多个 Effect 之间运行一个 race(与 Promise.race([...]) 的行为类似)。

race 可以取到最快完成的那个结果，常用于请求超时

```js
import { race, take, call } from 'redux-saga/effects'

function* backgroundTask() {
  while (true) { ... }
}

function* watchStartBackgroundTask() {
  while (true) {
    yield take('START_BACKGROUND_TASK')
    yield race({
      task: call(backgroundTask),
      cancel: take('CANCEL_TASK')
    })
  }
}
```

#### `10.all([]...effects)`

创建一个 Effect 描述信息，指示 middleware 并行运行多个 Effect，并等待它们全部完成。这是与标准的`Promise.all`相对应的 API

```js
import { call } from "redux-saga/effects";

// 正确写法, effects 将会同步执行
const [userInfo, repos] = yield[(call(fetch, "/users"), call(fetch, "/repos"))];

// 这两个请求是并行的
```

### 使用案例

#### `index.js入口文件`

```jsx
import React from "react";
import ReactDOM from "react-dom";
import App from "./App";
import { createStore, applyMiddleware, combineReducers } from "redux";
import rootReducer from "./reducers";
import { composeWithDevTools } from "redux-devtools-extension";
import createSagaMiddleware from "redux-saga";
import { Provider } from "react-redux";
import rootSaga from "./sagas";

//====1 创建一个saga中间件
const sagaMiddleware = createSagaMiddleware();

//====2 创建store
const store = createStore(
  rootReducer,
  composeWithDevTools(applyMiddleware(sagaMiddleware))
);
//==== 3动态执行saga，注意：run函数只能在store创建好之后调用
sagaMiddleware.run(rootSaga);

ReactDOM.render(
  <Provider store={store}>
    <App />
  </Provider>,
  document.getElementById("root")
);
```

#### `App.js入口组件`

```jsx
import React, { Component } from "react";
import { connect } from "react-redux";
import { increment, incrementAsync, decrement } from "./actions/counter";
import "./app.css";
import { get_user } from "./actions/user";
class App extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    const { message } = this.props.user;
    return (
      <div className="App">
        <span className="count">{this.props.counter}</span>
        <br />
        <button onClick={this.props.increment}>同步+1</button>
        <button onClick={this.props.decrement}>同步-1</button>
        <button onClick={this.props.incrementAsync}>异步</button>
        <button onClick={this.props.get_user}>网络请求</button>
        <h1>{message}</h1>
      </div>
    );
  }
}

//映射组件props的数据部分
const mapStateToProps = (state) => {
  return {
    counter: state.counter,
    user: state.user,
  };
};
//映射组件props的函数部分
// const  mapDispatchToProps = (dispatch) => {
//   return {
//     increment:(dispatch)=>{dispatch(increment)}
//   }
// };

export default connect(mapStateToProps, {
  increment,
  incrementAsync,
  decrement,
  get_user,
})(App);
```

#### `actions文件`

```js
// actions/counter.js
export const INCREMENT = "INCREMENT";
export const INCREMENT_ASYNC = "INCREMENT_ASYNC";
export const DECREMENT = "DECREMENT";

//count+1
export const increment = () => {
  return {
    type: INCREMENT,
  };
};

//count-1
export const decrement = () => {
  return {
    type: DECREMENT,
  };
};

//异步增加
export const incrementAsync = () => {
  return {
    type: INCREMENT_ASYNC,
  };
};
```

```js
// actions/user.js
export const get_user = () => {
  return {
    type: "FETCH_REQUEST",
  };
};
```

#### `reducers文件`

```js
import { combineReducers } from "redux";

import counter from "./counter";
import user from "./user";

// 合并所有的reduces
export default combineReducers({
  counter,
  user,
});
```

```js
import { INCREMENT, DECREMENT } from "../actions/counter";

const counter = (state = 1, action) => {
  switch (action.type) {
    case INCREMENT:
      return state + 1;
    case DECREMENT: {
      return state - 1;
    }
    default:
      return state;
  }
};

export default counter;
```

```js
const initialState = {
  message: "等待",
  age: "20",
};

const user = (state = initialState, action) => {
  switch (action.type) {
    case "FETCH_REQUEST":
      return {
        ...state,
        message: "请求中",
      };
    case "FETCH_SUCCEEDED":
      return {
        ...state,
        message: "詹姆斯",
      };
    case "FETCH_FAILURE":
      return {
        ...state,
        message: "请求失败",
      };
    default:
      return state;
  }
};

export default user;
```

#### `sagas文件`

```js
// saga入口文件index.js
import { all } from "redux-saga/effects";

import { counterSagas } from "./counter";
import { userSagas } from "./user";

// 合并所有需要监听的saga
export default function* rootSaga() {
  yield all([...counterSagas, ...userSagas]);
}
```

```js
// 监听counter的actions的saga文件 sagas/counter.js
//import { delay } from 'redux-saga';
import {
  takeEvery,
  call,
  put,
  take,
  fork,
  takeLatest,
  select,
  all,
} from "redux-saga/effects";
import { INCREMENT_ASYNC, INCREMENT_TAKE, DECREMENT } from "../actions/counter";

const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

function* incrementAsync(action) {
  let state = yield select((state) => console.log(state));

  //yield fork(delay,2000);
  //yield delay(2000);
  yield call(delay, 2000);
  yield put({ type: "INCREMENT" });
  //yield fork(()=>{return put({ type: 'INCREMENT' })});

  // yield all([
  //   //call(delay,2000),
  //   yield put({ type: 'INCREMENT',data:'9898' }),
  //   yield put({ type: 'INCREMENT--' ,data:'000'}),
  //   yield put({ type: 'INCREMENT----' })
  // ])
  //同步的方式来写异步代码
  // yield put({ type: 'INCREMENT' });
}

export function* watchIncrementAsync() {
  while (true) {
    yield take("INCREMENT_ASYNC");
    yield fork(incrementAsync);
    yield fork(() => {
      console.log("--------");
    });
    yield fork(() => {
      console.log("--------");
    });
  }
  yield takeLatest(INCREMENT_ASYNC, incrementAsync); //takeLatest
}

export const counterSagas = [
  //fork(()=>{console.log('---------')}),
  watchIncrementAsync(),
  watchIncrementAsync(),
  watchIncrementAsync(),
];
```

```js
// 监听user的actions的saga文件 sagas/user.js
import { takeEvery, call, put, all } from "redux-saga/effects";
import axios from "axios";
const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
function* fetchUser() {
  try {
    //axios.get('https://jsonplaceholder.typicode.com/users')
    const user = yield call(
      axios.get,
      "https://jsonplaceholder.typicode.com/users"
    );
    yield put({ type: "FETCH_SUCCEEDED" });
  } catch (e) {
    yield put({ type: "FETCH_FAILURE" });
  }
}

function* watchFetchUser() {
  yield all([
    takeEvery("FETCH_REQUEST", fetchUser), // 监听发出Action为FETCH_REQUEST，然后出发请求函数fetchUser
  ]);
}

export const userSagas = [watchFetchUser()];
```

### 案例效果图

![redux-saga-result](https://misaka10032.oss-cn-chengdu.aliyuncs.com/React/redux-saga-result.image)

### 总结

- `redux-saga`作为 redux 的中间件，用于更优雅地管理异步
- 可利用同步的方式处理异步逻辑，便于捕获异常，易于测试

优点：

1. 副作用转移到单独的`saga.js`中，保持 action 的简单纯粹，使得异步操作集中处理
2. 提供更丰富的 Effects，以及 sagas 的机制（所有的 saga 都可以被中断），处理复杂的异步问题时更方便
3. 每一个 saga 都是一个`generator function`，代码可以采用同步书写方式处理异步逻辑，代码易读性提高
4. 受益于`generator function`的 saga 实现，代码异常/请求失败都可以直接通过`try/catch`语法直接捕获处理

缺点：

1. `generator`的调试环境比较糟糕，babel 的`source-map`经常错位，经常要手动 debugger
2. `redux-saga`不强迫捕获异常，没有异常捕获时，出错之后异常难以识别

## redux-observable

`redux-observable`是基于 RxJs 的实现了 redux 的异步操作管理、比`redux-saga`学习成本更低的异步中间件。它使用 RxJs 驱动 action 副作用，也不再需要`redux-thunk`这种异步中间件专门处理异步 action

### 核心概念 Epic

Epic 是`redux-observable`的核心概念和基础模型

它接收一个`action stream`，输出新的`action stream`

当一个 action 被 dispatch，历经某个同步或者异步任务，将 dispatch 一个新的 action，携带着它的负载（payload）到 真正的 reducer

Epic 重新定义了 action 的因果关系

```ts
function (action$: Observable<Action>, state$: StateObservable<State>): Observable<Action>
```

### 特点

1. 竞态处理
2. 声明式任务处理
3. 测试友好
4. 组件自治

### 响应用例

#### 安装依赖

```shell
npm install --save rxjs rxjs-compat redux-observable
```

#### `index.js入口文件`

```jsx
import React from "react";
import ReactDOM from "react-dom";
import "./index.css";
import App from "./App";

import { createStore, applyMiddleware } from "redux";
import { createEpicMiddleware } from "redux-observable";
import { Provider } from "react-redux";

import rootReducer from "./reducers/root";
import { rootEpic } from "./epics";

const epicMiddleware = createEpicMiddleware(rootEpic);

const store = createStore(rootReducer, applyMiddleware(epicMiddleware));

const appWithProvider = (
  <Provider store={store}>
    <App />
  </Provider>
);

ReactDOM.render(appWithProvider, document.getElementById("root"));
```

#### `actions.js文件`

三种 action 对应三种状态，获取、获取成功、获取失败

```js
export const FETCH_WHISKIES = "FETCH_WHISKYS";
export const FETCH_WHISKIES_SUCCESS = "FETCH_WHISKYS_SUCCESS";
export const FETCH_WHISKIES_FAILURE = "FETCH_WHISKYS_FAILURE";

export const fetchWhiskies = () => ({
  type: FETCH_WHISKIES,
});

export const fetchWhiskiesSuccess = (whiskies) => ({
  type: FETCH_WHISKIES_SUCCESS,
  payload: whiskies,
});

export const fetchWhiskiesFailure = (message) => ({
  type: FETCH_WHISKIES_FAILURE,
  payload: message,
});
```

#### `rootReducer.js文件`

action 的最终执行流向，也对应三种执行状态与默认的初始状态

```js
import {
  FETCH_WHISKIES,
  FETCH_WHISKIES_FAILURE,
  FETCH_WHISKIES_SUCCESS,
} from "../actions";

const initialState = {
  whiskies: [],
  isLoading: false,
  error: null,
};

export default function rootReducer(state = initialState, action) {
  switch (action.type) {
    case FETCH_WHISKIES:
      return {
        ...state,
        // whenever we want to fetch the whiskies, set isLoading to true to show a spinner
        isLoading: true,
        error: null,
      };
    case FETCH_WHISKIES_SUCCESS:
      return {
        whiskies: [...action.payload],
        // whenever the fetching finishes, we stop showing the spinner and then show the data
        isLoading: false,
        error: null,
      };
    case FETCH_WHISKIES_FAILURE:
      return {
        whiskies: [],
        isLoading: false,
        // same as FETCH_WHISKIES_SUCCESS, but instead of data we will show an error message
        error: action.payload,
      };
    default:
      return state;
  }
}
```

#### `rootEpic.js文件`

```js
import { combineEpics } from "redux-observable";

// Observable基础类型
import { Observable } from "rxjs";
// 只获取最新的action结果，取消之前的结果
import "rxjs/add/operator/switchMap";
// 遍历流中每个项目执行函数，返回新流Observable
import "rxjs/add/operator/map";
// 从非Observable值创建一个Observable/stream
import "rxjs/add/observable/of";
// 错误捕获
import "rxjs/add/operator/catch";
// ajax模块
import { ajax } from "rxjs/observable/dom/ajax";

import {
  FETCH_WHISKIES,
  fetchWhiskiesFailure,
  fetchWhiskiesSuccess,
} from "../actions";

// 示例请求url地址
const url = "https://evening-citadel-85778.herokuapp.com/whiskey/";

// 相应结果
// {
//   "count": number,
//   "next": "url to next page",
//   "previous": "url to previous page",
//   "results: array of whiskies
// }

function fetchWhiskiesEpic(action$, state$) {
  return action$
    .ofType(FETCH_WHISKIES)
    .switchMap(() => {
      return ajax
        .getJSON(url)
        .map((data) => data.results)
        .map((whiskies) =>
          whiskies.map((whisky) => ({
            id: whisky.id,
            title: "whisky.title",
            imageUrl: whisky.img_url,
          }))
        )
        .map((whiskies) => whiskies.filter((whisky) => !!whisky.imageUrl));
    })
    .map((whiskies) => fetchWhiskiesSuccess(whiskies))
    .catch((error) => Observable.of(fetchWhiskiesFailure(error.message)));
}

export const rootEpic = combineEpics(fetchWhiskiesEpic);
```

小结：监听进入 Epic 函数，监听通过 -> 请求数据 -> 数据转换与筛选 -> 最终数据进入成功的 action / 异常捕获数据创建新的 Observable 流手动调用失败的 action

#### `视图组件`

网格组件

```jsx
import React from "react";

import Whisky from "./Whisky";

const WhiskyGrid = ({ whiskies }) => (
  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr" }}>
    {whiskies.map((whisky) => (
      <Whisky key={whisky.id} whisky={whisky} />
    ))}
  </div>
);

export default WhiskyGrid;
```

根组件

```jsx
import React, { Component } from "react";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import "./App.css";

import { fetchWhiskies } from "./actions";

import WhiskyGrid from "./components/WhiskyGrid";

class App extends Component {
  render() {
    const { fetchWhiskies, isLoading, error, whiskies } = this.props;

    return (
      <div class>
        <button onClick={fetchWhiskies}>Fetch whiskies</button>
        {isLoading && <h1>Fetching data</h1>}
        {!isLoading && !error && <WhiskyGrid whiskies={whiskies} />}
        {error && <h1>{error}</h1>}
      </div>
    );
  }
}

const mapStateToProps = (state) => ({ ...state });

const mapDispatchToProps = (dispatch) =>
  bindActionCreators(
    {
      fetchWhiskies,
    },
    dispatch
  );

export default connect(mapStateToProps, mapDispatchToProps)(App);
```

### 总结

1. 自动响应 redux 的 dispatch，每次触发都会执行我们定义的 Epics 函数
2. 把拉取数据等业务逻辑代码分离到 Epics 函数中，降低代码耦合度，提升维护度
3. action 都是纯净的对象字面量，不再需要引入`redux-thunk`
4. 实现 action 的流式传递，action 既是 observable 也是 observer（订阅者与发布者），它是数据流的中转站，既可以订阅上游数据，也能被一个或多个下游订阅

更完整的参考链接详见：https://blog.csdn.net/melxy1997/article/details/118940398

RxJs 官方文档详见：https://cn.rx.js.org/
