---
title: React-query
order: 7

tag:
  - ReactQuery
  - 异步状态数据管理
  - 异步高度操纵
---

`react-query`是 React 的数据获取库，也是一个 hooks 库，使用很少量的代码完成对服务端的状态管理，且大多数情况下使用查询 useQuery 和修改 useMutation 就可以了

## redux 未能做到的事

redux 可以轻松管理客户端状态，但并不适合处理异步和服务端状态，异步的问题已经由`redux-thunk`等异步中间件解决了，还剩下服务端状态未能解决

服务端状态有以下几点比较复杂：

1. 缓存（数据未变化时不去请求）
2. 知道数据何时“过时”
3. 在后台更新“过时”的数据
4. 分页、延迟加载等性能优化
5. 结构化共享并存储查询结果

`react-query`因此出现了，它可以方便地管理服务端的状态

## 入口组件

```tsx
import "./App.css";
import { QueryClient, QueryClientProvider } from "react-query";
import { ReactQueryDevtools } from "react-query/devtools";
import Demo1 from "./components/Demo1";

// 创建一个全局client实例
const queryClient = new QueryClient();
function App() {
  return (
    // 提供clientProvider
    <QueryClientProvider client={queryClient}>
      {/* 添加devtools */}
      {process.env.NODE_ENV === "development" ? (
        <ReactQueryDevtools initialIsOpen={false} position="bottom-right" />
      ) : (
        ""
      )}
      <Demo1 />
    </QueryClientProvider>
  );
}

export default App;
```

## 视图组件

视图组件中使用 useQuery 和 useMutation，通过 useQueryClient 获取全局 QueryClient 实例，调用 api 管理 react-query 的请求

```tsx
import axios from "axios";
import { useMutation, useQuery, useQueryClient } from "react-query";

type dataType = {
  id: string;
  title: string;
};
const Demo1 = () => {
  // 访问App QueryClientProvider提供的client
  const queryClient = useQueryClient();
  const query = useQuery("posts", () =>
    axios.get("https://jsonplaceholder.typicode.com/posts")
  );
  console.log(query);
  const { data, isLoading, isError } = query;

  const { mutate } = useMutation(
    () => axios.delete("https://jsonplaceholder.typicode.com/posts/1"),
    {
      onSuccess: () => {
        // 错误处理和刷新 清除缓存信息
        queryClient.invalidateQueries("posts");
      },
    }
  );

  if (isError) {
    return <div>error</div>;
  }
  if (isLoading) {
    return <div>loading</div>;
  }

  return (
    <>
      <button
        onClick={() => {
          mutate();
        }}
      >
        Delete
      </button>
      <ul>
        {(data?.data as unknown as dataType[])?.map((d) => (
          <li key={d.id}>{d.title}</li>
        ))}
      </ul>
    </>
  );
};

export default Demo1;
```

## useQuery

![useQuery控制台输出](https://misaka10032.oss-cn-chengdu.aliyuncs.com/React/useQuery.webp)

useQuery 接收一个唯一键和一个返回 Promise 的函数以及 config`[queryKey, queryFn, config]`，可用于在整个程序中重新获取数据、缓存、共享查询等

### 状态值

- `isFetching || status === 'fetching'`：类似于 isLoading，不过每次请求时都为 true，所以使用 isFetching 作为 loading 态更好
- `isLoading || status === 'loading'`：查询没有数据，正在获取结果中，只有“硬加载”时才为 true，只要请求在 cacheTime 设定时间内，再次请求就会直接使用 cache，即"isLoading = isFetching + no cached data"
- `isError || status === 'error'`：查询遇到一个错误，此时可以通过 error 获取到错误
- `isSuccess || status === 'success'`：查询成功，并且数据可用，通过 data 获取数据
- `isIdle || status === 'idle'`：查询处于禁用状态

### 参数

1.query-keys：作为查询键，指向全局唯一的 useQuery 返回值；可以是字符串，也可以是数组

```js
 // A list of todos
 useQuery('todos', ...) // queryKey === ['todos']

 // Something else, whatever!
 useQuery('somethingSpecial', ...) // queryKey === ['somethingSpecial']

  // An individual todo
 useQuery(['todo', 5], ...)
 // queryKey === ['todo', 5]

 // An individual todo in a "preview" format
 useQuery(['todo', 5, { preview: true }], ...)
 // queryKey === ['todo', 5, { preview: true }]

 // A list of todos that are "done"
 useQuery(['todos', { type: 'done' }], ...)
 // queryKey === ['todos', { type: 'done' }]
```

2.query-functions：任何一个返回 Promise 的函数即可

注意：要让 react-query 确定查询出错，查询函数必须抛出异常

```js
const { error } = useQuery(["todos", todoId], async () => {
  if (somethingGoesWrong) {
    throw new Error("Oh no!");
  }

  return data;
});
```

### 并行查询

指并发执行查询，以提高并发性能

```js
 function App () {
   // The following queries will execute in parallel
   const usersQuery = useQuery('users', fetchUsers)
   const teamsQuery = useQuery('teams', fetchTeams)
   const projectsQuery = useQuery('projects', fetchProjects)
   ...
 }
```

下面是更推荐的写法，使用 useQueries 实现

```js
function App({ users }) {
  const userQueries = useQueries(
    users.map((user) => {
      return {
        queryKey: ["user", user.id],
        queryFn: () => fetchUserById(user.id),
      };
    })
  );
}
```

### 依赖查询

依赖（串行）查询依赖于前面的查询才能执行，在 config 中使用 enabled 属性实现

```js
const { data: user } = useQuery(["user", email], getUserByEmail);

const userId = user?.id;

const { isIdle, data: projects } = useQuery(
  ["projects", userId],
  getProjectsByUser,
  {
    enabled: !!userId,
  }
);
```

## useMutation

useMutation 用于在执行异步函数之后做下一步操作，并提供了各种执行的生命周期用以修饰执行过程

`useMutation(mutationFn, config)`

### 状态值

与 useQuery 基本相同

### 参数

1.mutationFn

执行异步任务并返回 promise 的函数

2.config

onMutate：在触发执行函数之前触发，并传递给执行函数相同的变量。用于回滚乐观更新

onSuccess：执行函数成功后触发，传递成功结果

onSettled：成功或失败都将触发

onError：失败后触发，传递错误

## 缓存

react-query 中管理的异步数据均存在缓存

默认情况下， 通过或默认查询实例会将缓存的数据视为过时

- 查询装载的新实例
- 窗口重新聚焦
- 网络已重新连接
- 可以选择为查询配置重新设置时间间隔

**非活跃状态的查询结果默认在 5 分钟后执行垃圾回收**

**失败的查询将以静默方式默认重试 3 次**

**通常情况下，通过 queryClient 调取客户端实例来查询缓存**

`queryClient.getQueryCache`：该方法返回此客户端连接到的查询缓存

`queryClient.getMutationCache`：该方法返回此客户端连接到的执行缓存

`queryClient.invalidateQueries`：所有匹配的查询都会立即标记为无效，活动查询会在后台重新获取

`queryClient.clear`：该方法清除所有连接的缓存

## 窗口聚焦自动查询

refetchOnWindowFocus 默认为 true，用户短暂离开再返回应用页时，数据就会被标记为过时，这时 react-query 会在后台自动请求新的数据，通过设置 refetchOnWindowFocus 为 false 禁用

```js
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
    },
  },
});
```

## 模型分析

Query 是 react-query 的底层核心类，主要负责网络数据请求、状态变化处理、内存回收等工作

### 网络请求

Query 的网络请求底层通过 Retryer 重试器（Promise）类实现

Query 给 Retryer 指定 fn（请求函数主体）、retry（重试次数）、retryDelay（重试延迟时间），以及一系列状态变化回调函数（比如 onSuccess、onPause 等）

### 状态变化

Query 有四种状态，网络请求过程中，Query 的状态会发生变化

`export type QueryStatus = 'idle' | 'loading' | 'error' | 'success'`

- 当初始化 Query 时，选项 enabled 设置 false，此时 Query 的状态即为 idle 状态；
- loading 状态表示 Query 没有缓存数据，同时正处于请求网络中；
- error 状态表示网络请求遇到了异常，可以通过 error 属性获取异常对象；
- success 状态表示网络请求正常获得结果，可以通过 data 属性获取响应结果。

**Query 使用经典的 reducer 模式处理状态变化。reducer 模式，其实我们并不陌生，Vuex、Redux 等数据状态管理库都是通过 reducer 模式处理数据状态变化的**

Query 会在不同的状态变化回调函数中，调用 Dispatch 分发对应的 Action，Dispatch 最终会调用 Reducer 处理状态的变化

Reducer 函数，接受当前状态对象和 Action 对象，经过 Switch 结构处理后，返回新的状态

```ts
fetch(
    options?: QueryOptions,
    fetchOptions?: FetchOptions
  ): Promise {

    this.retryer = new Retryer({
      ...
      onFail: () => {
        this.dispatch({ type: 'failed' })
      },
      onPause: () => {
        this.dispatch({ type: 'pause' })
      },
      onContinue: () => {
        this.dispatch({ type: 'continue' })
      },
    })

    ...
}


private dispatch(action: Action<TData, TError>): void {
    this.state = this.reducer(this.state, action)
}


protected reducer(
    state: QueryState,
    action: Action
  ): QueryState {
    switch (action.type) {
      case 'fetch':
        return {
          ...state,
          status: 'loading',
          }),
        }
      case 'success':
        return {
          ...state,
          status: 'success',
        }
      case 'error':
        return {
          ...state,
          status: 'error',
        }
      default:
        return state
    }
  }
```

### 中止请求

Query 实现中止网络请求利用了 AbortController 这个 API

AbortController 表示一个控制器对象，允许你根据需要中止一个或多个 Web 请求。使用 AbortController 中止网络请求的基本过程如下：

1. 调用 new AbortController()，构造 AbortController 实例
2. 把 AbortController 实例的 signal 传递给请求方法，使得 AbortController 和请求对象绑定在一起
3. 如果想中止与 AbortController 关联的网络请求时，调用该 AbortController 实例的 abort 方法即可。

Query 也是通过 AbortController 实现中止网络请求。

每次调用 Query 的 fetch 方法时，都会实例化一个 AbortController 对象，并且会把 AbortController.signal 放在 queryFnContext 参数中传递给请求主体 queryFn，开发者可以在请求主体方法 queryFn 手动的绑定 signal。

如果我们想中止 Query 的网络请求，需要调用 Query.cancel，Query.cancel 会调用 Retryer.cancel，不过最终 Retryer 还是会调用 AbortController.abort

### 观察者管理

所有使用 Query 的观察者，都要被添加到 Query.observers 数组中。通过 Query.observers 元素长度，可以判断 Query 是否处于活跃状态，当 Query.observers.length === 0 表示没有任何 Observer 在使用 Query 对象，那么，Query 就被视作不活跃的状态，已经具备被垃圾回收的之一条件

一旦 Observer 观察 Query 对象，必须调用 Query.addObserver 方法，把 Observer 添加到 Query.observers 数组中。除此之外，还会停止垃圾回收机制

```ts
addObserver(observer: QueryObserver): void {
	if (this.observers.indexOf(observer) === -1) {
		this.observers.push(observer)
		this.hadObservers = true

		// Stop the query from being garbage collected
		this.clearGcTimeout()
	}
}
```

与 Query.addObserver 相反，Query.removeObserver 负责把 observer 从 Query.observers 中移除，同时调度垃圾回收机制，回收 Query 占用的内存

```ts
removeObserver(observer: QueryObserver<any, any, any, any, any>): void {
  if (this.observers.indexOf(observer) !== -1) {
		this.observers = this.observers.filter(x => x !== observer)

		if (!this.observers.length) {
			if (this.cacheTime) {
				this.scheduleGc()
			} else {
				this.cache.remove(this)
			}
		}
	}
}
```

### 垃圾回收

react-query 通过 QueryCache 管理所有的 Query 对象，QueryCache 可以看成 Map 结构，key 是 Query 对象的 queryHash 属性（全局唯一的），value 是 Query 对象。一旦 Query 处于无用状态，如果不及时释放其对应的内存，易造成 OOM（内存溢出）

Query 的垃圾回收是通过 Query.scheduleGc 实现的。本质上，就是等待 Query.cacheTime 指定的毫秒时间之后，如果当前 Query 处于不活跃状态，把 Query 从缓存中移除

```ts
private scheduleGc(): void {
	this.clearGcTimeout()

	if (isValidTimeout(this.cacheTime)) {
		this.gcTimeout = setTimeout(() => {
			this.optionalRemove()
		}, this.cacheTime)
	}
}

private optionalRemove() {
	if (!this.observers.length) {
		if (this.state.isFetching) {
			if (this.hadObservers) {
				this.scheduleGc()
			}
		} else {
			this.cache.remove(this)
		}
	}
}

private clearGcTimeout() {
	clearTimeout(this.gcTimeout)
	this.gcTimeout = undefined
}
```

调用 Query.scheduleGc 的时机有两处：

1. 观察者取消观察 Query，触发调用 Query.removeObserver 方法，此时如果没有任何观察者使用 Query 了，会开启垃圾回收

```ts
removeObserver(observer: QueryObserver<any, any, any, any, any>): void {
  if (this.observers.indexOf(observer) !== -1) {
		this.observers = this.observers.filter(x => x !== observer)

		if (!this.observers.length) {
			if (this.cacheTime) {
				this.scheduleGc()
			} else {
				this.cache.remove(this)
			}
		}
	}
}
```

2. 在 react-query 中，除了 Observer 可以实例化一个 Query，也可以通过 QueryClient.prefetchQuery（预请求）创建一个 Query。假若 Query 从未被 Observer 使用的话，该 Query 的内存就会变成僵尸内存。因此，为了确保预请求的 Query 在 cacheTime 时间到了，内存也能被及时释放。Query 的构造函数也会调用 Query.scheduleGc

## 原理与本质

### 场景假设

试想这样一个场景，假设页面上有三个子组件 A, B, C，都需要用到同一个接口的 todo 数据

![react-query原理图1](https://misaka10032.oss-cn-chengdu.aliyuncs.com/React/react-query-todo.awebp)

如果直接调用 useQuery，那么三次 useQuery 会发送 3 个相同请求

```js
// compA
const { data, isLoading } = useQuery("todos", fetchTodos);

// compB
const { data, isLoading } = useQuery("todos", fetchTodos);

// compC
const { data, isLoading } = useQuery("todos", fetchTodos);
```

![react-query原理图2](https://misaka10032.oss-cn-chengdu.aliyuncs.com/React/react-query-todo-unique.awebp)

但实际上请求只会发出一次，因为三个 useQuery，我们都定义了同一个值为 'todos' 的 queryKey，它代表请求唯一标识

### 探讨本质

#### 唯一标识

在 react-query 中，代表请求唯一标识的并不是请求的路径 path，而是 queryKey，它作为 useQuery 必传的第一个参数，接收字符串、数组、对象等一切可被序列化的值

上面声明的 queryKey 都为 'todos'，接收到 queryKey 后，useQuery 会在内部找到或者创建与之对应的 Query 实例，Query 实例包含 isLoading，data 等状态，queryKey 与 Query 实例一一对应

于是，三个基本同时发出的请求也都收敛到了 Query 实例内部发出，直接与服务端交互。3 个 queryKey 对应 1 个 Query 实例，所以只会有一次请求

#### 缓存管理

全局实例化的 QueryClient，会在内部存储所有未过期的 Query，作为一个外部的 store 管理起来。Query 以 map 键值对的方式保存在 store 中，key 为 queryHash，value 为 Query

因此，react-query 本质就是一个外部的状态管理库

![react-query原理图3](https://misaka10032.oss-cn-chengdu.aliyuncs.com/React/react-query-store.awebp)

### 触发更新渲染

触发更新渲染的内容比较复杂，简而言之，是在观察者观测到状态变化时，通过调用 React 提供的 API 触发 React 强制更新

更详细的内容详见：https://juejin.cn/post/7169515109172609032#heading-1
