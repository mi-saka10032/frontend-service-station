---
title: ReactRouter
order: 1
category: false
tag:
  - ReactRouter
  - url监听
  - SPA路由管理
---

本文记录 `ReactRouter`V6 版本的 API，V5 之前的 API 略过

## 概述

### 三个不同类型的 npm 包

1. react-router：路由核心库，提供组件、钩子
2. react-router-dom：包含 react-router 所有内容，并添加专用 DOM 组件
3. react-router-native：包含 react-router 所有内容，并添加 ReactNative 专用 API

### 与`5.X`版本的区别

1. 内置组件变化：移除`<Switch/>`，新增`<Routes/>`
2. 语法变化：`component={About}`变为`element={<About/>}`
3. 新增多个 hook：`useParams`、`useNavigate`、`useMatch`等
4. 官方明确推荐使用函数式组件

## 组件

一级路由组件

```jsx
// Router.jsx
import React from "react";
import { BrowserRouter, Route, Routes, Navigate } from "react-router-dom";
import Home from "../home/Home";
import Goods from "../goods/Goods";
import Customer from "../customer/Customer";

export default function Router() {
  {
    /* 所有的路由配置均在 BrowserRouter 内部 */
  }
  return (
    <BrowserRouter>
      {/* 使用 Routes 替换曾经的 Switch */}
      <Routes>
        <Route path="home" element={<Home />} />
        <Route path="goods" element={<Goods />} />
        <Route path="customer" element={<Customer />} />
        <Route path="/" element={<Navigate to="/home" />} />
      </Routes>
    </BrowserRouter>
  );
}
```

### `<BrowserRouter>`

`<BrowserRouter>`用于包裹整个应用。react-router-dom 相关组件只有在其内部才能使用

### `<HashRouter>`

作用与`<BrowserRouter>`一样，地址切换为 hash(#)模式

### `<Routes/>`与`<Route/>`

v6 版本移除了先前的`<Switch>`，替换为`<Routes>`

`<Routes/>`与`<Route/>`要配合使用，并且必须要用`<Routes>`包裹`<Route>`

`<Route>`相当于一个 if 语句，如果其路径与当前 url 匹配，则挂载对应组件

`<Route caseSensitive>`属性用于指定：匹配时是否区分大小写(默认 false)

当 url 发生变化时，`<Routes>`监听地址并查询匹配`<Route>`元素以匹配组件

`<Route>`可以嵌套使用，且可配合`useRoutes()`配置路由表，但需要通过`<Outlet>`组件渲染子路由

示例代码：

```jsx
<Routes>
  {/* path属性用于定义路径，element属性用于定义当前路径对应组件 */}
  <Route path="/login" element={<Login />} />

  {/* 定义嵌套路由，home是一级路由，对应路径 /home */}
  <Route path="home" element={<Home />}>
    {/* test1和test2是二级路由，对应路径/home/test1 /home/test2 */}
    <Route path="test1" element={<Test1 />} />
    <Route path="test2" element={<Test2 />} />
  </Route>

  {/* 不写element属性，仅表示嵌套路由，对应路径/users/xxx */}
  <Route path="users">
    {/* index属性，表明为默认子路由 */}
    <Route path="xxx" element={<Demo />} index />
  </Route>
</Routes>
```

### `<Link>`

作用：修改 url，且不发送网络请求（无刷新路由链接）

注意：必须在被`<BrowserRouter>`包裹的组件中使用

```jsx
import { Link } from 'react-router-dom

function Test() {
  return (
    <div>
      <Link to='/路径'>按钮</Link>
    </div>
  )
}
```

### `<NavLink>`

作用与`<Link>`类似，可实现导航的“高亮”效果

```jsx
// NavLink默认类名是active，下面是自定义class类名

<NavLink
  to="login"
  className={({ isActive }) => {
    console.log("home", isActive);
    return isActive ? "base one" : "base";
  }}
>
  login
</NavLink>

/*
  NavLink添加end属性，匹配成功不会有高亮效果
*/
<NavLink to="home" end>Home</NavLink>
```

### `<Navigate>`

作用：只要`<Navigate>`组件被渲染，就会修改路径，切换视图

replace 用于控制跳转模式，默认是 push

```jsx
import React, { useState } from "react";
import { Navigate } from "react-router-dom";

export default function Home() {
  const [sum, setSum] = useState(1);
  return (
    <>
      <h3>Home标题</h3>
      {sum === 1 ? (
        <h4>sum值为{sum}</h4>
      ) : (
        <Navigate to="/about" replace={true} />
      )}
      <button onClick={() => setSum(2)}>sum点击变2</button>
    </>
  );
}
```

### `<Outlet>`

当`<Route>`产生嵌套时，一级组件内部渲染后续子路由需要使用

作用类似于 Vue 中的`<router-view></router-view>`

## hooks

### useRoutes

作用：根据路由表，动态创建`<Routes>`和`<Route>`

类似于 Vue 中的`new VueRouter()`

### useNavigate

作用：返回一个函数用来实现编程式路由导航

语法：

```js
import { useNavigate } from "react-router-dom";

const navigate = useNavigate();
const handle = () => {
  /// 指定路径
  navigate("/login", {
    replace: false,
    state: { a: 1, b: 2 },
  });
  // 前进后退步数
  navigate(-1);
};
```

### useParams

作用：返回当前匹配路由的 params 参数

例如：声明 path 路径为`/users/:id`，跳转到该路由组件时，通过`const { id } = useParams()`接收

### useSearchParams

作用：读取和修改当前位置的 url 中的查询字符串

返回一个包含两个值的数组：当前的 search 参数、更新 search 的函数

```jsx
import React, { useEffect } from "react";
import { useParams, useSearchParams } from "react-router-dom";

export default function GoodsDetail() {
  // 获取动态路由的值
  const params = useParams();

  // 获取查询字符串的值
  const [searchParams, setSearchParams] = useSearchParams();

  useEffect(() => {
    // 一个对象，key 为动态字符串的 key
    console.log(params); // {id: '123'}

    // 一个对象，但是不可直接点出属性
    console.log(typeof searchParams); // object

    // 输入 http://localhost:3304/goods/123?name=nihao
    console.log(searchParams.get("name")); // nihao
  }, []);

  const handleAddParams = () => {
    // 修改 查询字符串 的数据
    setSearchParams({
      name: "xxx",
    });
  };

  return (
    <div>
      <h2 onClick={handleAddParams}>GoodsDetail Page</h2>
    </div>
  );
}
```

### useLocation

作用：获取当前 location 信息，对标原生 location 属性（精简版）

```jsx
const x = useLocation();
```

```
# x的参考属性
{
  hash: '',
  key: 'axga6sx',
  pathname: '/login',
  search: '?name=zhangsan&age=18',
  state: { a: 1, b: 2 }
}
```

### useMatch

作用：返回当前匹配信息，对标原生 match 属性（精简版）

```jsx
// useMatch需要传递url路径字符串
const match = useMatch('/login/:x/:y)
```

```
# match参考属性
{
  params: { x: '1', y: '10' },
  pathname: '/login/1/10',
  pathnameBase: '/login/1/10',
  pattern: {
    path: '/login/:x/:y',
    caseSensitive: false,
    end: false
  }
}
```

### useInRouterContext

判断当前组件是否在`<Router>`上下文中，是为 true 否为 false

### useNavigationType

返回当前的导航类型：

1. POP：在浏览器中直接打开这个路由组件，或刷新页面
2. PUSH：push 方式
3. REPLACE：replace 方式

### useOutlet

呈现当前组件中渲染的嵌套路由

### useResolvedPath

给定一个 url 值，解析其中的 path、search、hash 值

类似 Vue2 中的`this.$router.resolve`方法

## withRouter

v5 版本直接给我们提供了 withRouter 方法，用来包裹不在`<Route>`内的其他组件如`<Header>`、`<Footer>`等组件

v6 版本需要我们自己用 HOC 实现

```jsx
import { useLocation, useNavigate, useParams } from "react-router-dom";

const withRouter = (Component) => (props, ref) => {
  const location = useLocation();
  const navigate = useNavigate();
  const params = useParams();
  return (
    <Component {...props} ref={ref} history={{ location, navigate, params }} />
  );
};

export default withRouter;
```
