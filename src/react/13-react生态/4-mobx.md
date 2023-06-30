---
title: Mobx
order: 4

tag:
  - 全局状态管理
  - Mobx
---

## 介绍

原则：任何源自应用状态的东西都应该自动地获得

mobx 利用 getter 和 setter 收集组件的数据依赖关系，从而在数据发生变化时精确锁定组件，使界面更新粒度更加精细

其核心思想实际就是利用了`Object.defineProperty`和`Proxy`实现依赖收集与更新

![mobx流程](https://misaka10032.oss-cn-chengdu.aliyuncs.com/React/mobx.png)

## 与 redux 的区别

1. mobx 写法更偏向 OOP
2. 对一份数据直接进行修改操作，不需要始终返回新数据（内部使用了 immutable）
3. 并非单一 store，可以多 store
4. redux 默认以 js 原生对象存储数据，mobx 使用可观察对象（`Object.defineProperty`）

## 基本用法

### state

```js
import { observable } from "mobx";
//State，被观察者
const todos = observable([
  {
    title: "起床",
    completed: false,
  },
  {
    title: "穿⾐",
    completed: false,
  },
  {
    title: "洗漱",
    completed: false,
  },
]);
```

### computed

```js
import { computed } from "mobx";

//Computed values ,由 State 的更新触发
let uncompletedCount = computed(
  () => todos.filter((todo) => !todo.completed).length
);
```

### reactions

```js
import { autorun } from "mobx";

//Reactions， 由 State 和 Computed Values 的改变触发执⾏
autorun(() => {
  console.log(
    `剩余任务:${uncompletedCount}`,
    todos
      .filter((todo) => !todo.completed)
      .map((todo) => todo.title)
      .join(", ")
  );
});
```

### actions

```js
import { action } from "mobx";

const doTask = action(() => {
  todos.find((todo) => !todo.completed).completed = true;
});
doTask();
```

### 异步 actions

actions 默认是针对同步方法的，对于嵌套或 async/await 的异步方法往往会出现错误和陷阱

有两种简便写法：

1.runInAction

```js
// .bound bind(this)的语法糖，重定向this
@action.bound async getData() {
  this.test1 = 100
  const data = await getDataFromServer();
  runInAction(() => {
    this.test1 = 666
  })
}
```

2.flow

```js
getDataFlows = flow(function* () {
  let data = yield getDataFromServer();
  this.test1 = data + 100;
});
```

## 加入装饰器

mobx 支持在 React 项目中使用装饰器，需要对 babel 进行配置

1. npm install @babel/plugin-proposal-decorators
2. 修改 package.json， 找到 babel 字段， 添加`"plugins": [ "@babel/plugin-proposal-decorators" ]`

## 在类组件中使用

### store

```js
import { observable, action } from "mobx";
class AboutStore {
  @observable counter = 1;
  @action add() {
    this.counter++;
  }
}
export default new AboutStore();
```

### 入口文件

```jsx
import { Provider } from "mobx-react";
ReactDOM.render(
  <React.StrictMode>
    <Router>
      <Provider homeStore={homeStore} aboutStore={aboutStore}>
        <App />
      </Provider>
    </Router>
  </React.StrictMode>,
  document.getElementById("root")
);
```

### 视图组件

```jsx
import { observer, inject } from "mobx-react";
@inject("aboutStore")
@inject("homeStore")
@observer
class About extends Component {
  render() {
    return (
      <div>
        <h1>About</h1>
        <p>current counter : {this.props.aboutStore.counter}</p>
        <p>home counter: {this.props.homeStore.counter}</p>
        <Link to="/">去⾸⻚</Link>
      </div>
    );
  }
}
```

## 在函数组件中使用

### store

```js
import { observable, action, computed } from "mobx";
export class HomeStore {
  @observable counter = 1;
  @computed get doubleCounter() {
    return this.counter * 2;
  }
  @action add() {
    this.counter++;
  }
}
```

### context

React 创建 Context 对象

```js
import React from "react";
import { HomeStore } from "../stores/home";
import { AboutStore } from "../stores/about";
export const storesContext = React.createContext({
  homeStore: new HomeStore(),
  aboutStore: new AboutStore(),
});
```

### useContext

```js
import React, { Component } from 'react';
import { observer } from 'mobx-react';
import { storesContext } from '../storesContext';
const About = observer(() => {
 const { homeStore, aboutStore } = React.useContext;
 return (
 <div>
 <h1>About</h1>
 <p>current counter : {aboutStore.counter}</p>
 <p>home counter: {homeStore.counter}</p>
 </div>
 )
}
```
