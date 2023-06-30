---
title: Redux-toolkit
order: 5

tag:
  - 全局状态管理
  - Redux-toolkit
---

`redux-toolkit`是目前 redux 官方推荐的编写 redux 逻辑的方法，针对 redux 本身创建 store 繁琐、样板代码过多、依赖外部库等问题进行了优化，调用 API 更加简单快捷

redux 最新版本也已经标记 createStore 方法为弃用，推荐使用 redux-toolkit

```shell
yarn add @reduxjs/toolkit react-redux
```

## 入口文件

没有变化

```jsx
import React from 'react';
import { createRoot } from 'react-dom/client';
import { Provider } from 'react-redux';
import { store } from './app/store';
import App from './App';
import './index.css';

const container = document.getElementById('root')!;
const root = createRoot(container);

root.render(
  <Provider store={store}>
    <App />
  </Provider>
);
```

## store.js

```js
/* app/store.ts */
import { configureStore } from "@reduxjs/toolkit";
import counterReducer from "../features/counter/counterSlice";
import todoReducer from "../features/todo/todoSlice";

export const store = configureStore({
  reducer: {
    counter: counterReducer,
    todo: todoReducer,
  },
});
```

configureStore 集成了 redux 之前的各种扩展，以对象形式传入，并默认支持`redux-DevTools`

参数选项表

| 参数 key 值 | 说明 |
| reducer | 创建 reducer，传递给 combineReducers 使用 |
| middleware | 中间件，传递给 applyMiddleware 使用 |
| devTools | 扩展工具，默认为 true |
| preloadedState | 初始 state 值，传递给 createStore |
| enhancers | 增强 store，传递给 createStore |

## actions&reducers

`redux-toolkit`加入了 slice，对 action 和 reducer 实现了整合

```js
import { createSlice } from "@reduxjs/toolkit";

export const counterSlice = createSlice({
  name: "counter",
  initialState: {
    count: 1,
  },
  reducers: {
    increment(state, { payload }) {
      state.count = state.count + payload.step;
    },
    decrement(state) {
      state.count -= 1;
    },
  },
});

export const { increment, decrement } = counterSlice.actions;

export const asyncIncrement = (payload) => (dispatch) => {
  setTimeout(() => {
    dispatch(increment(payload));
  }, 2000);
};

export default counterSlice.reducer;
```

- reducers 参数既定义了 reducers，也创建了关联的 actions，最终返回的是一个包含了 actions 和 reducers 的对象
- 这里直接对 state 进行了修改，因为引用了 immer 的库，底层也是响应式的，总是会返回一个安全不可变的更新值，简化了 reducer 的写法。注意该方式只能在 createSlice 和 createReducer 中编写
- 异步方法最直接的写法就是采用`redux-thunk`的方式书写，因为内部已经默认集成了该异步中间件

## 视图组件调用

```jsx
import { useSelector, useDispatch } from "react-redux";

import {
  increment,
  asyncIncrement,
} from "../toolkit-store/features/counterSlice";

function App() {
  const { count } = useSelector((state) => state.counter);
  const dispatch = useDispatch();
  return (
    <div className="App">
      <button
        onClick={() => {
          dispatch(increment({ step: 2 }));
        }}
      >
        {count}
      </button>
      <hr />
      <button
        onClick={() => {
          dispatch(asyncIncrement({ step: 1 }));
        }}
      >
        {count}
      </button>
    </div>
  );
}

export default App;
```

这里可以理解为：

- 任意组件都能从`redux store`中读取任意数据
- 任意组件都能通过`dispatch actions`引发状态更新（state updates）

## `进阶1：副作用处理`

createAsyncThunk 支持 thunk，这也是 redux 推荐的方式

下面是推荐写法

```js
export const incrementAsync = createAsyncThunk(
  "counter/fetchCount",
  async (amount: number) => {
    const response = await fetchCount(amount);
    return response.data;
  }
);

export const counterSlice = createSlice({
  name: "counter",
  initialState,
  extraReducers: (builder) => {
    builder
      .addCase(incrementAsync.pending, (state) => {
        state.status = "loading";
      })
      .addCase(incrementAsync.fulfilled, (state, action) => {
        state.status = "idle";
        state.value += action.payload;
      })
      .addCase(incrementAsync.rejected, (state) => {
        state.status = "failed";
      });
  },
});
```

## `进阶2：使用 selector 缓存`

当 useSelector 方法涉及到复杂逻辑运算时，且返回一个对象的时候，每次运行都返回了一个新的引用值，会使组件重新渲染，即使返回的数据内容并没有改变，如下带有过滤的 todoList 所示

其原因是复杂数据类型栈地址的变化引发更新机制

```ts
const list = useSelector((state: RootState) => {
  const { todo, visibilityFilter } = state;
  switch (visibilityFilter) {
    case VisibilityFilters.SHOW_ALL:
      return todo;
    case VisibilityFilters.SHOW_COMPLETED:
      return todo.filter((t: TodoState) => t.completed);
    case VisibilityFilters.SHOW_ACTIVE:
      return todo.filter((t: TodoState) => !t.completed);
    default:
      throw new Error("Unknown filter: " + visibilityFilter);
  }
});
```

解决办法是使用 createSelector 函数创建记忆化的 state

```ts
const selectTodos = (state: RootState) => state.todo;
const selectFilter = (state: RootState) => state.visibilityFilter;

// 创建记忆化selector
const selectList = createSelector(selectTodos, selectFilter, (todo, filter) => {
  switch (filter) {
    case VisibilityFilters.SHOW_ALL:
      return todo;
    case VisibilityFilters.SHOW_COMPLETED:
      return todo.filter((t: TodoState) => t.completed);
    case VisibilityFilters.SHOW_ACTIVE:
      return todo.filter((t: TodoState) => !t.completed);
    default:
      throw new Error("Unknown filter: " + filter);
  }
});

// 使用记忆化selector list可在视图中实现缓存
const list = useSelector((state: RootState) => selectList(state));
```

## `进阶3：范式化state`

范式化 state 指的是：

- state 中每个特定数据只有一个副本，不存在重复
- 已范式化的数据保存在表中，项目 ID 是键，项本身是值
- 也可能有一个特定想用于保存所有 ID 的数组

以上的标准决定了 state 的结构形式为：

```js
{
  ids: ["user1", "user2", "user3"],
  entities: {
    "user1": {id: "user1", firstName, lastName},
    "user2": {id: "user2", firstName, lastName},
    "user3": {id: "user3", firstName, lastName},
  }
}
```

createEntityAdapter 实现了对范式化结构的存储的一系列标准操作

```ts
import {
  createSlice,
  PayloadAction,
  createEntityAdapter,
  nanoid,
  EntityState,
} from "@reduxjs/toolkit";
import { RootState } from "../../app/store";

export interface TodoPayload {
  todoId: string;
  text: string;
  completed?: boolean;
  createdTimestamp: number;
}

/* 创建EntityAdapter */
const todoAdapter = createEntityAdapter<TodoPayload>({
  /* 默认值为id */
  selectId: (todo) => todo.todoId,
  /* 对ids进行排序，方法与Array.sort相同，如果不提供，不能保证ids顺序 */
  sortComparer: (a, b) => a.createdTimestamp - b.createdTimestamp,
});

const todosSlice = createSlice({
  name: "todosEntity",
  initialState: todoAdapter.getInitialState(),
  reducers: {
    /* 增 */
    addTodo: {
      reducer(
        state: EntityState<TodoPayload>,
        action: PayloadAction<TodoPayload>
      ) {
        todoAdapter.addOne(state, action.payload);
      },
      prepare(text: string) {
        return {
          payload: {
            text,
            todoId: nanoid(),
            createdTimestamp: Date.now(),
          },
        };
      },
    },
    /* 删 */
    removeTodo(state: EntityState<TodoPayload>, action: PayloadAction<string>) {
      todoAdapter.removeOne(state, action.payload);
    },
    /* 改 */
    toggleTodo(state: EntityState<TodoPayload>, action: PayloadAction<string>) {
      const todo = state.entities[action.payload];
      if (todo) {
        todo.completed = !todo.completed;
      }
    },
  },
});

/* 查 */
export const { selectAll: selectAllTodos } = todoAdapter.getSelectors(
  (state: RootState) => state.todoEntity
);

/* action */
export const { actions: todoActions } = todosSlice;
/* reducer */
export default todosSlice.reducer;
```

## 总结

`redux-toolkit`仍是以 redux 结构为原型开发的状态管理库，它对 redux 和 react-redux 原本代码冗余、创建复杂的步骤进行了优化，并加入了多种异步解决方案、范式化修改、数据缓存等功能，并提供了 hooks 函数供任意组件使用，是 redux 目前最推荐使用的库
