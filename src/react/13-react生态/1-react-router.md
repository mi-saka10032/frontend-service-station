---
title: ReactRouter
order: 1

tag:
  - ReactRouter
  - url监听
  - SPA路由管理
  - 动态路由
  - 路由守卫
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

## 动态添加路由

React 和 Vue 的动态添加路由原理都一样，现假设用户已登录成功：

用户登录成功 => 获取用户权限列表 => 获取用户导航菜单列表 => 根据权限和导航生成路由表

### 默认路由表

router/index.ts 默认路由

提供组件懒加载导入函数、鉴权组件、路由表等

```tsx
import { lazy } from "react";
import { Navigate } from "react-router-dom";

// React 组件懒加载

// 快速导入工具函数
const lazyLoad = (moduleName: string) => {
  const Module = lazy(() => import(`views/${moduleName}`));
  return <Module />;
};
// 路由鉴权组件
const Appraisal = ({ children }: any) => {
  const token = localStorage.getItem("token");
  return token ? children : <Navigate to="/login" />;
};

interface Router {
  name?: string;
  path: string;
  children?: Array<Router>;
  element: any;
}

const routes: Array<Router> = [
  {
    path: "/login",
    element: lazyLoad("login"),
  },
  {
    path: "/",
    element: <Appraisal>{lazyLoad("sand-box")}</Appraisal>,
    children: [
      {
        path: "",
        element: <Navigate to="home" />,
      },
      {
        path: "*",
        element: lazyLoad("sand-box/nopermission"),
      },
    ],
  },
  {
    path: "*",
    element: lazyLoad("not-found"),
  },
];

export default routes;
```

### Store

redux login/action.ts

Redux 提供的 store 中存储登录相关异步请求的方法

登录 => 获取菜单列表 => 格式化转换 => 更新路由表

```tsx
import { INITSIDEMENUS, UPDATUSERS, LOGINOUT, UPDATROUTES } from "./contant";
import { getSideMenus } from "services/home";
import { loginUser } from "services/login";
import { patchRights } from "services/right-list";
import { handleSideMenu } from "@/utils/devUtils";
import { handelFilterRouter } from "@/utils/routersFilter";
import { message } from "antd";

// 获取导航菜单列表
export const getSideMenusAction = (): any => {
  return (dispatch: any, state: any) => {
    getSideMenus().then((res: any) => {
      const rights = state().login.users.role.rights;
      const newMenus = handleSideMenu(res, rights);
      dispatch({ type: INITSIDEMENUS, menus: newMenus });
      dispatch(updateRoutesAction()); //import!
    });
  };
};

// 退出登录
export const loginOutAction = (): any => ({ type: LOGINOUT });

// 更新导航菜单
export const updateMenusAction = (item: any): any => {
  return (dispatch: any) => {
    patchRights(item).then((res: any) => {
      dispatch(getSideMenusAction());
    });
  };
};

// 路由更新 //import!
export const updateRoutesAction = (): any => {
  return (dispatch: any, state: any) => {
    const rights = state().login.users.role.rights;
    const menus = state().login.menus;
    const routes = handelFilterRouter(rights, menus); //import!
    dispatch({ type: UPDATROUTES, routes });
  };
};

// 登录
export const loginUserAction = (item: any, navigate: any): any => {
  return (dispatch: any) => {
    loginUser(item).then((res: any) => {
      if (res.length === 0) {
        message.error("用户名或密码错误");
      } else {
        localStorage.setItem("token", res[0].username);
        dispatch({ type: UPDATUSERS, users: res[0] });
        dispatch(getSideMenusAction());
        navigate("/home");
      }
    });
  };
};
```

路由菜单转换函数 permission.ts

```ts
// 权限列表 和 导航菜单 得出路由表 element暂用字符串表示 后面渲染前再映射
export const handelFilterRouter = (
  rights: any,
  menus: any,
  routes: any = []
) => {
  for (const menu of menus) {
    if (menu.pagepermisson) {
      let index = rights.findIndex((item: any) => item === menu.key) + 1;
      if (!menu.children) {
        if (index) {
          const obj = {
            path: menu.key,
            element: `sand-box${menu.key}`,
          };
          routes.push(obj);
        }
      } else {
        handelFilterRouter(rights, menu.children, routes);
      }
    }
  }
  return routes;
};

// 返回最终路由表
export const handelEnd = (routes: any) => {
  defaulyRoutes[1].children = [...routes, ...defaulyRoutes[1].children];
  return defaulyRoutes;
};

// 映射element 成对应组件
export const handelFilterElement = (routes: any) => {
  return routes.map((route: any) => {
    route.element = lazyLoad(route.element);
    return route;
  });
};
```

### 开启监听入口

入口组件 App.tsx

在路由入口处开启 routes 监听，依赖更新后重设 useRoutes，组件结构响应式重构

```tsx
import routes from "./router";
import { useRoutes } from "react-router-dom";
import { shallowEqual, useSelector } from "react-redux";
import { useState, useEffect } from "react";
import { handelFilterElement, handelEnd } from "@/utils/routersFilter";
import { deepCopy } from "@/utils/devUtils";

function App() {
  console.log("first");
  const [rout, setrout] = useState(routes);
  const { routs } = useSelector(
    (state: any) => ({ routs: state.login.routes }),
    shallowEqual
  );

  const element = useRoutes(rout);
  // 监听路由表改变重新渲染
  useEffect(() => {
    // deepCopy 深拷贝state数据 不能影响到store里的数据！
    // handelFilterElement 映射对应组件
    // handelEnd 将路由表嵌入默认路由表得到完整路由表
    const end = handelEnd(handelFilterElement(deepCopy(routs)));
    setrout(end);
  }, [routs]);

  return <div className="height-all">{element}</div>;
}

export default App;
```

最终总结：

1. 在外部 App 组件中引入路由表数据开启 state 管理
2. 使用 useEffect 监听拷贝路由表中的数据，将默认路由表转换成格式完整的路由表后重设路由表
3. 路由表 state 状态变动，引发函数内重新调用 useRoutes，生成新的路由结构嵌入 jsx 中

## 路由拦截

路由拦截又称路由守卫，在 Vue 中`vue-router`提供便捷的 beforeEach、afterEach 来统一管理路由入口与出口，在 React 中我们需要手动实现

现在简化一下场景，路由表配置入口、登录、404 三个组件，对登录状态判断来进行拦截/放行

### 路由配置

```jsx
import Index from "@/views/index/index";
import Login from "@/views/login/index";
import Page404 from "@/views/test/page404";

const routes = [
  {
    path: "/index",
    element: <Index />,
  },
  {
    path: "/login",
    element: <Login />,
  },
  {
    path: "*",
    element: <Page404 />,
  },
];

export { routes };
```

### 入口配置

App.jsx

```jsx
import { useRoutes } from "react-router-dom";
import { routes } from "@/router";

function App() {
  const elements = useRoutes(routes);
  return elements;
}

export default App;
```

index.js

```jsx
import React from "react";
import ReactDOM from "react-dom";
import App from "./App";
import { BrowserRouter } from "react-router-dom";

ReactDOM.render(
  <React.StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </React.StrictMode>,
  document.getElementById("root")
);
```

### 全局路由拦截

实现思路：控制路由配置的 element 属性，动态调整

#### 1.封装工具函数

几个工具函数的作用：

- `setRouteBefore`：从外部获取路由守卫函数
- `lazyLoad`：懒加载导入组件，传入导入路径和元信息 meta，把懒加载组件、元信息、路由守卫函数封装进`<Guard>`组件
- `transformRoutes`：路由配置转化函数，将来自后端的路由数据进行格式化转换，转换为符合`react-router`路由表格式的数据

```jsx
import React from "react";
import { Navigate } from "react-router-dom";
import Guard from "./guard";

let handleRouteBefore = null;

// 设置路由导航守卫函数
function setRouteBefore(fn) {
  handleRouteBefore = fn;
}

// 路由懒加载
function lazyLoad(importFn, meta) {
  meta = meta || {}
  const Element = React.lazy(importFn)
  const lazyElement = (
    // fallback提供路由切换时的loading组件，如noprogress这种组件
    <React.Suspense fallback={<div><div/>}>
      <Element _meta={meta}/>
    </React.Suspense>
  )
  return (
    <Guard
      element={lazyElement}
      meta={meta}
      handleRouteBefore={handleRouteBefore}
    />
  )
}

// 路由配置列表数据转换
function transformRoutes(routes) {
  const list = [];
  routes.forEach((route) => {
    const obj = { ...route };
    if (obj.redirect) {
      obj.element = <Navigate to={obj.redirect} replace={true} />;
    }
    if (obj.component) {
      obj.element = lazyLoad(obj.component, obj.meta);
    }
    delete obj.redirect;
    delete obj.component;
    delete obj.meta;
    if (obj.children) {
      obj.children = transformRoutes(obj.children);
    }
    list.push(obj);
  });
  return list;
}

export { setRouteBefore, transformRoutes };
```

#### 2.路由容器组件`<Guard>`

路由容器组件对路由做了一个包裹，在路由渲染的时候会先执行内部逻辑，调用路由拦截，做统一的路由前置钩子，既能统一处理也能控制拦截跳转

```jsx
import { Navigate, useLocation, useNavigate } from "react-router-dom";

let temp = null;

function Guard({ element, meta, handleRouteBefore }) {
  meta = meta || {};

  const location = useLocation();
  const { pathname } = location;

  const navigate = useNavigate();

  if (handleRouteBefore) {
    if (temp === element) {
      return element;
    }
    const pathRes = handleRouteBefore({ pathname, meta });
    const pathResType = Object.prototype.toString
      .call(pathRes)
      .match(/s(w+)]/)[1];
    if (pathResType === "Promise") {
      pathRes.then((res) => {
        if (res && res !== pathname) {
          navigate(res, { replace: true });
        }
      });
    } else {
      if (pathRes && pathRes !== pathname) {
        element = <Navigate to={pathRes} replace={true} />;
      }
    }
  }
  // StrictMode下组件会渲染两次，所以这里用temp变量处理了一下。
  temp = element;
  return element;
}

export default Guard;
```

#### 3.配置文件

结合上面的[路由配置](#路由配置)，加入路由守卫函数

```jsx
// 全局路由配置
const routes = [
  {
    path: "/",
    redirect: "/index",
  },
  {
    path: "/index",
    component: () =>
      import(/* webpackChunkName: "index" */ "@/views/index/index"),
    meta: {
      title: "首页",
      needLogin: true,
    },
  },
  {
    path: "/login",
    component: () =>
      import(/* webpackChunkName: "login" */ "@/views/login/index"),
    meta: {
      title: "登录",
    },
  },
  {
    path: "*",
    component: () =>
      import(/* webpackChunkName: "404" */ "@/views/test/page404"),
    meta: {
      title: "404",
    },
  },
];

/**
 * @description: 全局路由拦截
 * @param {string} pathname 当前路由路径
 * @param {object} meta 当前路由自定义meta字段
 * @return {string} 需要跳转到其他页时，就返回一个该页的path路径，或返回resolve该路径的promise对象
 */
const onRouteBefore = ({ pathname, meta }) => {
  // 动态修改页面title
  if (meta.title !== undefined) {
    document.title = meta.title;
  }
  // 判断未登录跳转登录页
  if (meta.needLogin) {
    if (!isLogin) {
      return "/login";
    }
  }
};

export { routes, onRouteBefore };
```

- 只对 component 属性配置的组件处理为懒加载，不想用懒加载的直接使用 element 属性配置
- 自定义的 meta 数据也会以`_meta`字段名作为属性传给了每个对应路由组件
- routes 是原始路由配置数据，后台管理系统中根据后端数据动态生成导航菜单，配置动态路由权限
- 拦截函数`onRouteBefore`会传入到每一个路由容器`<Guard>`中，对于其返回值，如果存在异步的判断处理，可以 return 一个 promise 对象再 resolve 路径

#### 4.最后引入守卫函数

```jsx
import { useRoutes } from "react-router-dom";
import { routes, onRouteBefore } from "@/router";
import { transformRoutes, setRouteBefore } from "@/components/RouterGuard/fn";

function App() {
  setRouteBefore(onRouteBefore);
  const elements = useRoutes(transformRoutes(routes));
  return elements;
}

export default App;
```

最终总结：

1. 在外部 App 组件中引入路由守卫函数，该函数进入闭包引用位置 A
2. 先使用`transformRoutes`格式化路由表，转换为符合`react-router`格式规范的路由表，并且路由表中的每一个 element 组件都是包裹了正确路径组件的`<Guard>`组件
3. 每个`<Guard>`组件都传入了闭包位置 A 处的路由守卫函数，在正式返回正确的 element 组件前，触发路由守卫函数判断，通过者再正确渲染组件
4. 这部分正确的路由表最后会挂载至 JSX 节点生成 Router 树
