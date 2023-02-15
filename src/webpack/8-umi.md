---
title: Umi
order: 8
category: false
tag:
  - Umi
  - React
  - 结构分析
---

Umi 是由蚂蚁集团推出的一款主要面向 React 的底层前端框架，有很多有意思的特性：

1. 企业级，在安全性、稳定性、最佳实践、约束能力方面会考虑更多
2. 插件化，啥都能改，Umi 本身也是由插件构成
3. MFSU，**比 Vite 还快的 Webpack 打包方案**
4. 基于 React Router 6 的完备路由
5. 默认最快的请求
6. SSR & SSG
7. 稳定白盒性能好的 ESLint 和 Jest
8. React 18 的框架级接入
9. Monorepo 最佳实践

Umi 主要依靠 Webpack 实现高度封装与集成，因此关于构建优化的内容可以参照[VueCli 构建优化](./5-vuecli#构建优化)

## 安装与创建

### 安装包

::: code-tabs#shell

@tab npm

```sh
npm install -g create-umi
```

@tab yarn

```sh
yarn install -g create-umi
```

@tab pnpm

```sh
pnpm install -g create-umi
```

:::

### 创建新项目

::: code-tabs@shell

@tab npm

```sh
npx create-umi@latest umi-demo
```

@tab yarn

```sh
yarn create umi umi-demo
```

@tab pnpm

```sh
pnpm dlx create-umi@latest umi-demo
```

:::

这里我们选择`Ant Design pro`，以获得完整的项目结构

国内建议选 pnpm + taobao 源，速度提升明显。这一步会自动安装依赖，同时安装成功后会自动执行 umi setup 做一些文件预处理等工作

## 目录结构

这是 Umi 官方约定（推荐）的目录结构，开发时需按约定组织代码

```bash
.
├── config
│   └── config.ts
├── dist
├── mock
│   └── app.ts｜tsx
├── src
│   ├── .umi
│   ├── .umi-production
│   ├── layouts
│   │   ├── BasicLayout.tsx
│   │   ├── index.less
│   ├── models
│   │   ├── global.ts
│   │   └── index.ts
│   ├── pages
│   │   ├── index.less
│   │   └── index.tsx
│   ├── utils // 推荐目录
│   │   └── index.ts
│   ├── services // 推荐目录
│   │   └── api.ts
│   ├── app.(ts|tsx)
│   ├── global.ts
│   ├── global.(css|less|sass|scss)
│   ├── overrides.(css|less|sass|scss)
│   ├── favicon.(ico|gif|png|jpg|jpeg|svg|avif|webp)
│   └── loading.(tsx|jsx)
├── node_modules
│   └── .cache
│       ├── bundler-webpack
│       ├── mfsu
│       └── mfsu-deps
├── .env
├── plugin.ts
├── .umirc.ts // 与 config/config 文件 2 选一
├── package.json
├── tsconfig.json
└── typings.d.ts
```

下面介绍一些重要目录与文件

### .umirc.ts

与 `config/config.ts` 文件功能相同，2 选 1 。`.umirc.ts` 文件优先级较高

配置文件，包含 Umi 所有非运行时配置（运行时配置一般定义于 app.ts）。

若你需要在不同环境中加载不同配置，这在 Umi 中是根据 UMI_ENV 来实现的，一个不同环境启动的例子

```json
// package.json
{
  "scripts": {
    "dev": "umi dev",
    "dev:pre": "cross-env UMI_ENV=pre umi dev"
  }
}
```

### mock

存放 mock 文件，此目录下所有 `.ts / .js` 文件会被 mock 服务加载，从而提供模拟数据

### public

存放固定的静态资源，如存放 public/image.png ，则开发时可以通过 **/image.png** 访问到，构建后会被拷贝到输出文件夹

注意：`/`开头表示 public 的绝对路径；`.`开头表示当前文件的相对路径

对于 svg 资源，Umi 支持 svgr ，可以直接导入作为组件使用：

```tsx
import SmileUrl, { ReactComponent as SvgSmile } from "./smile.svg";
<SvgSmile />;
```

```tsx
import imgUrl from "./image.png";
<img src={imgUrl} />;
```

### src

#### .umi

不要提交 .umi 临时文件到 git 仓库，默认已在 .gitignore 被忽略

dev 时的临时文件目录，比如入口文件、路由等，都会被临时生成到这里

#### .umi-production

不要提交 .umi-production 临时文件到 git 仓库，默认已在 .gitignore 被忽略

build 时的临时文件目录，比如入口文件、路由等，都会被临时生成到这里

#### app.ts

运行时配置 文件，可以在这里扩展运行时的能力，比如修改路由、修改 render 方法等

运行时配置带来的逻辑会在浏览器中运行，因此当有远程配置、动态内容时，这些我们在本地开发时还不确定，不能写死，所以需要在浏览器实际运行项目时动态获取他们

适合场景：角色鉴权、动态添加路由等

#### layouts/index.tsx

公共组件布局，新建组件后，会默认渗透到每一级 pages 组件作为它们的公共组件。注意需要添加`<Outlet>`渲染嵌套路由

当你需要关闭 layout 时可以使用 layout: false ，当你需要更多层 layout 时，可以考虑使用 wrappers ，仅在配置式路由可用：

```ts
routes: [
  { path: "/", component: "./index", layout: false },
  {
    path: "/users",
    component: "./users",
    wrappers: ["@/wrappers/auth"],
  },
];
```

#### pages

约定式路由默认以 pages/\* 文件夹的文件层级结构来生成路由表。

在配置式路由中，component 若写为相对路径，将从该文件夹为起点开始寻找文件：

```ts
routes: [
  // `./index` === `@/pages/index`
  { path: "/", component: "./index" },
];
```

1. 基础路由

```bash
+ pages/
  + users/
    - index.tsx
  - index.tsx
```

对应的自动生成路由：

```ts
[
  { path: "/", component: "@/pages/index.tsx" },
  { path: "/users/", component: "@/pages/users/index.tsx" },
];
```

2. 动态路由

这里的动态路由指的是 url 中携带 params 参数的路由

```bash
+ pages/
  + foo/
    - $slug.tsx
  + $bar/
    - $.tsx
  - index.tsx
```

会生成路由配置如下：

```ts
[
  { path: "/", component: "@/pages/index.tsx" },
  { path: "/foo/:slug", component: "@/pages/foo/$slug.tsx" },
  { path: "/:bar/*", component: "@/pages/$bar/$.tsx" },
];
```

3. 404

编写路径须是`pages/404.tsx`

结构约定式路由自动注册 404 兜底。配置式路由需要手动配置兜底

```ts
routes: [
  // other routes ...
  { path: "/*", component: "@/pages/404.tsx" },
];
```

#### global.ts

全局前置脚本文件。与 App.ts 的区别在于：

global.ts 为应用前置、全局运行；App.ts 是对全局 Context、应用运行时做修改

#### global.less

全局样式文件

#### overrides.less

高优先级的全局样式文件，用于覆盖第三方库样式

#### loading.tsx

全局加载组件

## 生命周期

![Umi生命周期](https://misaka10032.oss-cn-chengdu.aliyuncs.com/Webpack/umi-lifecycle.png)

- init stage: 该阶段 Umi 将加载各类配置信息。包括：加载 .env 文件； require package.json ；加载用户的配置信息； resolve 所有的插件（内置插件、环境变量、用户配置依次进行）。
- initPresets stage: 该阶段 Umi 将注册 presets。presets 在注册的时候可以通过 return { presets, plugins } 来添加额外的插件。其中 presets 将添加到 presets 队列的队首，而 plugins 将被添加到 plugins 队列的队尾。
- initPlugins stage: 该阶段 Umi 将注册 plugins。这里的 plugins 包括上个阶段由 presets 添加的额外的 plugins， 一个值得注意的点在于： 尽管 plugins 也可以 return { presets, plugins } ，但是 Umi 不会对其进行任何操作。插件的 init 其实就是执行插件的代码（但是插件的代码本质其实只是调用 api 进行各种 hook 的注册，而 hook 的执行并非在此阶段执行，因此这里叫插件的注册）。
- resolveConfig stage: 该阶段 Umi 将整理各个插件中对于 config schema 的定义，然后执行插件的 modifyConfig 、modifyDefaultConfig、 modifyPaths 等 hook，进行配置的收集。
- collectionAppData stage: 该阶段 Umi 执行 modifyAppData hook，来维护 App 的元数据。（ AppData 是 umi@4 新增的 api ）
- onCheck stage: 该阶段 Umi 执行 onCheck hook。
- onStart stage: 该阶段 Umi 执行 onStart hook
- runCommand stage: 该阶段 Umi 运行当前 cli 要执行的 command，（例如 umi dev, 这里就会执行 dev command）Umi 的各种核心功能都在 command 中实现。包括我们的插件调用 api 注册的绝大多数 hook。

更详细内容详见[UmiJS 生命周期](https://umijs.org/docs/guides/plugins#%E7%94%9F%E5%91%BD%E5%91%A8%E6%9C%9F)

## 路由

Umi 默认按页拆包，注意编写`src/loading.tsx`

path 只支持两种占位符配置，第一种是动态参数 :id 的形式，第二种是 \* 通配符，通配符只能出现路由字符串的最后

[配置方法](#pages)

可配置的基础属性有：path、component、routes、redirect、wrappers、title。这里主要说 wrappers

### wrappers

配置路由组件的包装组件，通过包装组件可以为当前的路由组件组合进更多的功能。 比如，可以用于路由级别的权限校验：

```ts
export default {
  routes: [
    { path: "/user", component: "user", wrappers: ["@/wrappers/auth"] },
    { path: "/login", component: "login" },
  ],
};
```

```tsx
import { Navigate, Outlet } from "umi";

export default (props) => {
  const { isLogin } = useAuth();
  if (isLogin) {
    return <Outlet />;
  } else {
    return <Navigate to="/login" />;
  }
};
```

这样，访问 /user，就通过 auth 组件做权限校验，如果通过，渲染 src/pages/user，否则跳转到 /login。

注意：wrappers 包装组件的本质是[HOC](../react//9-进阶技巧.html#高阶组件)，通过中间属性控制实现**路由守卫**控制

其余的路由跳转、路由 hooks 函数和 React 原生一样

## 插件

Umi 默认不附带插件，涵盖完整插件的项目详见[Ant Design Pro](https://pro.ant.design/zh-CN)

## 样式

为避免单个组件引入的样式文件影响全局，建议还是以 CSS Modules 的形式编写 CSS 文件

```jsx
// src/pages/index.tsx

import styles from "./index.css";

export default function () {
  return <div className={styles.title}>Hello World</div>;
}
```

Umi 同样也支持各种 CSS 预编译器，Sass 需要单独安装`pnpm add sass -D`

## 路由与请求并行加载

开启：

```ts
// .umirc.ts

export default {
  clientLoader: {},
};
```

考虑一个三层嵌套路由的场景：

1. 我们需要先等第一层路由的组件加载完成，然后第一层路由的组件发起数据请求
2. 第一层路由的数据请求完成后，开始请求第二层路由的组件，第二层路由的组件加载好以后请求第二层路由需要的数据
3. 第二层路由的数据请求完成后，开始请求第三层路由的组件，第三层路由的组件加载好以后请求第三层路由需要的数据
4. 第三层路由的数据请求完成后，整个页面才完成渲染

使用：

在路由文件中，除了默认导出的页面组件外，再导出一个 clientLoader 函数，并且在该函数内完成路由数据加载的逻辑

```tsx
// pages/.../some_page.tsx

import { useClientLoaderData } from "umi";

export default function SomePage() {
  const { data } = useClientLoaderData();
  return <div>{data}</div>;
}

export async function clientLoader() {
  const data = await fetch("/api/data");
  return data;
}
```

## 环境变量

Umi 可以通过环境变量来完成一些特殊的配置和功能。支持变量写法

```env
# file .env.local
FOO=foo
BAR=bar

CONCAT=$FOO$BAR # CONCAT=foobar
```

环境变量的功能与其他脚手架别无二致，自带的环境变量列表详见：https://umijs.org/docs/guides/env-variables#%E7%8E%AF%E5%A2%83%E5%8F%98%E9%87%8F%E5%88%97%E8%A1%A8

## 布局

注意：这里的布局指的是整个页面的全局布局配置，之前的`layouts/index.tsx`只是提供给子路由的公共布局组件

```ts
// config/config.ts
import { defineConfig } from "umi";

export default defineConfig({
  layout: {
    title: "your app title",
    locale: false, // 默认开启，如无需菜单国际化可关闭
    logo: 'https://img.alicdn.com/tfs/TB1YHEpwUT1gK0jSZFhXXaAtVXa-28-27.svg',
    // 默认布局调整
    rightContentRender: () => <RightContent />,
    footerRender: () => <Footer />,
    menuHeaderRender: undefined,  // 是否展示菜单顶栏的title和logo
    logout: () => <Logout />  // 设置退出的处理逻辑，默认不作处理并隐藏退出键
    rightRender: 'Default: 展示用户名、头像、退出登录相关组件',
    onError: () => { /* ... */ },  // 发生错误后的回调
    ErrorComponent: <ErrorBoundary />, // 错误边界组件

  },
});
```

由此，配置路由表中野扩展了一些全局的属性：

```ts
// config/route.ts
export const routes: IBestAFSRoute[] = [
  {
    path: "/welcome",
    component: "IndexPage",
    name: "欢迎", // 兼容此写法
    icon: "testicon",
    // 更多功能查看
    // https://beta-pro.ant.design/docs/advanced-menu
    // ---
    // 新页面打开
    target: "_blank",
    // 不展示顶栏
    headerRender: false,
    // 不展示页脚
    footerRender: false,
    // 不展示菜单
    menuRender: false,
    // 不展示菜单顶栏
    menuHeaderRender: false,
    // 权限配置，需要与 plugin-access 插件配合使用
    access: "canRead",
    // 隐藏子菜单
    hideChildrenInMenu: true,
    // 隐藏自己和子菜单
    hideInMenu: true,
    // 在面包屑中隐藏
    hideInBreadcrumb: true,
    // 子项往上提，仍旧展示,
    flatMenu: true,
  },
];
```

## 数据流

### 命名空间

| 路径                                  | 命名空间          | 说明                                       |
| :------------------------------------ | :---------------- | :----------------------------------------- |
| src/models/count.ts                   | count             | src/models 目录下不支持目录嵌套定义 model  |
| src/pages/pageA/model.ts              | pageA.model       |                                            |
| src/pages/pageB/models/product.ts     | pageB.product     |                                            |
| src/pages/pageB/models/fruit/apple.ts | pageB.fruit.apple | pages/xxx/models 下 model 定义支持嵌套定义 |

```ts
// src/models/userModel.ts
export default () => {
  const user = {
    username: "umi",
  };

  return { user };
};
```

现在 user 这个字段就变为了全局数据，我们可以在任意 pages 组件中通过

### 简单应用

通过 useModel 我们可以在任一组件里调用全局 model。以一个 userModel 为例

```ts
// src/models/userModel.ts
import { useRequest } from "ahooks";
import { getUser } from "@/services/user";

export default () => {
  const { data: user, loading: loading } = useRequest(async () => {
    const res = await getUser();
    if (res) {
      return res;
    }
    return {};
  });

  return {
    user,
    loading,
  };
};
```

```tsx
// src/components/Username/index.tsx
import { useModel } from 'umi';

export default () => {
  const { user, loading } = useModel('userModel');

  return (
    {loading ? <></>: <div>{user.username}</div>}
  );
}
```

### model 优化

useModel() 方法可以接受可选的第二个参数，当组件只需要使用 Model 中的部分参数，而对其它参数的变化不感兴趣时，可以传入一个函数进行过滤。以实现计数器的操作按钮为例

```tsx
// src/components/CounterActions/index.tsx
import { useModel } from "umi";

export default () => {
  const { add, minus } = useModel("counterModel", (model) => ({
    add: model.increment,
    minus: model.decrement,
  }));

  return (
    <div>
      <button onClick={add}>add by 1</button>
      <button onClick={minus}>minus by 1</button>
    </div>
  );
};
```

### 初始状态值

全局初始状态在整个 Umi 项目的最开始创建。编写 src/app.ts 的导出方法 getInitialState()，其返回值将成为全局初始状态。可以理解为 Vue 中路由守卫里预获取菜单列表、用户登录信息等全局数据的前置方法

```ts
// src/app.ts
import { fetchInitialData } from "@/services/initial";

export async function getInitialState() {
  const initialData = await fetchInitialData();
  return initialData;
}
```

现在，各种插件和您定义的组件都可以通过 useModel('@@initialState') 直接获取到这份全局的初始状态

```tsx
import { useModel } from "umi";

export default () => {
  const { initialState, loading, error, refresh, setInitialState } =
    useModel("@@initialState");
  return <>{initialState}</>;
};
```

| 对象属性        | 类型                 | 介绍                                                                                                    |
| :-------------- | :------------------- | :------------------------------------------------------------------------------------------------------ |
| initialState    | any                  | 导出的 getInitialState() 方法的返回值                                                                   |
| loading         | boolean              | getInitialState() 或 refresh() 方法是否正在进行中。在首次获取到初始状态前，页面其他部分的渲染都会被阻止 |
| error           | Error                | 如果导出的 getInitialState() 方法运行时报错，报错的错误信息                                             |
| setInitialState | (state: any) => void | 手动设置 initialState 的值，手动设置完毕会将 loading 置为 false                                         |

## 请求

Umi 内置了请求插件

```ts
import { request, useRequest } from "umi";

request;
useRequest;
```

### 构建配置

```ts
export default {
  request: {
    dataField: "data",
  },
};
```

构建时配置 data，则消费数据时从后端获取到的数据默认取 data 字段内的数据

如数据格式`{ success: true, data: 123, code: 1 }`，useRequest 默认获取到值就是 123

### 运行配置

在 src/app.ts 中你可以通过配置 request 项，来为你的项目进行统一的个性化的请求设定

```ts
import type { RequestConfig } from "umi";

export const request: RequestConfig = {
  timeout: 1000,
  // other axios options you want
  errorConfig: {
    errorHandler() {},
    errorThrower() {},
  },
  requestInterceptors: [],
  responseInterceptors: [],
};
```

这里提供了异常处理、异常抛出、请求拦截、响应拦截，都是基于 axios 的配置，全局有效

以下是一个运行时配置示例

```ts
import { RequestConfig } from "./request";

// 错误处理方案： 错误类型
enum ErrorShowType {
  SILENT = 0,
  WARN_MESSAGE = 1,
  ERROR_MESSAGE = 2,
  NOTIFICATION = 3,
  REDIRECT = 9,
}
// 与后端约定的响应数据格式
interface ResponseStructure {
  success: boolean;
  data: any;
  errorCode?: number;
  errorMessage?: string;
  showType?: ErrorShowType;
}

// 运行时配置
export const request: RequestConfig = {
  // 统一的请求设定
  timeout: 1000,
  headers: { "X-Requested-With": "XMLHttpRequest" },

  // 错误处理： umi@3 的错误处理方案。
  errorConfig: {
    // 错误抛出
    errorThrower: (res: ResponseStructure) => {
      const { success, data, errorCode, errorMessage, showType } = res;
      if (!success) {
        const error: any = new Error(errorMessage);
        error.name = "BizError";
        error.info = { errorCode, errorMessage, showType, data };
        throw error; // 抛出自制的错误
      }
    },
    // 错误接收及处理
    errorHandler: (error: any, opts: any) => {
      if (opts?.skipErrorHandler) throw error;
      // 我们的 errorThrower 抛出的错误。
      if (error.name === "BizError") {
        const errorInfo: ResponseStructure | undefined = error.info;
        if (errorInfo) {
          const { errorMessage, errorCode } = errorInfo;
          switch (errorInfo.showType) {
            case ErrorShowType.SILENT:
              // do nothing
              break;
            case ErrorShowType.WARN_MESSAGE:
              message.warn(errorMessage);
              break;
            case ErrorShowType.ERROR_MESSAGE:
              message.error(errorMessage);
              break;
            case ErrorShowType.NOTIFICATION:
              notification.open({
                description: errorMessage,
                message: errorCode,
              });
              break;
            case ErrorShowType.REDIRECT:
              // TODO: redirect
              break;
            default:
              message.error(errorMessage);
          }
        }
      } else if (error.response) {
        // Axios 的错误
        // 请求成功发出且服务器也响应了状态码，但状态代码超出了 2xx 的范围
        message.error(`Response status:${error.response.status}`);
      } else if (error.request) {
        // 请求已经成功发起，但没有收到响应
        // \`error.request\` 在浏览器中是 XMLHttpRequest 的实例，
        // 而在node.js中是 http.ClientRequest 的实例
        message.error("None response! Please retry.");
      } else {
        // 发送请求时出了点问题
        message.error("Request error, please retry.");
      }
    },
  },

  // 请求拦截器
  requestInterceptors: [
    (config) => {
      // 拦截请求配置，进行个性化处理。
      const url = config.url.concat("?token = 123");
      return { ...config, url };
    },
  ],

  // 响应拦截器
  responseInterceptors: [
    (response) => {
      // 拦截响应数据，进行个性化处理
      const { data } = response;
      if (!data.success) {
        message.error("请求失败！");
      }
      return response;
    },
  ],
};
```

## 权限

access 的控制粒度为组件级。如果要判断组件页面是否具备权限，请在路由表里使用 wrappers 包装组件控制

### 启用权限

配置开启。同时需要 src/access.ts 提供权限配置。

```ts
export default {
  access: {},
  // access 插件依赖 initial State 所以需要同时开启
  initialState: {},
};
```

我们约定了 src/access.ts 为我们的权限定义文件，该文件需要默认导出一个方法，导出的方法会在项目初始化时被执行。该方法需要返回一个对象，对象的每一个值就对应定义了一条权限

```ts
// src/access.ts
export default function (initialState) {
  const { userId, role } = initialState;

  return {
    canReadFoo: true,
    canUpdateFoo: role === "admin",
    canDeleteFoo: (foo) => {
      return foo.ownerId === userId;
    },
  };
}
```

其中 initialState 是通过初始化状态插件 initial-state 提供的数据，你可以使用该数据来初始化你的用户权限。当然也可以通过`const { setInitialState } = useModel('@@initialState')`获取到的 setInitialState 方法来重设 initialState

### 配置

路由配置：

```ts
export const routes = [
  {
    path: "/pageA",
    component: "PageA",
    access: "canReadPageA", // 权限定义返回值的某个 key
  },
];
```

页面配置：

```tsx
import React from "react";
import { useAccess, Access } from "umi";

const PageA = (props) => {
  const { foo } = props;
  const access = useAccess(); // access 的成员: canReadFoo, canUpdateFoo, canDeleteFoo

  if (access.canReadFoo) {
    // 如果可以读取 Foo，则...
  }

  return (
    <div>
      <Access
        accessible={access.canReadFoo}
        fallback={<div>Can not read foo content.</div>}
      >
        Foo content.
      </Access>
      <Access
        accessible={access.canUpdateFoo}
        fallback={<div>Can not update foo.</div>}
      >
        Update foo.
      </Access>
      <Access
        accessible={access.canDeleteFoo(foo)}
        fallback={<div>Can not delete foo.</div>}
      >
        Delete foo.
      </Access>
    </div>
  );
};
```

- useAccess() 的返回值 access 就是 src/access.ts 中定义的权限集合，可以利用它进行组件内代码执行流的控制
- `<Access>` 组件拥有 accessible 和 fallback 两个属性，当 accessible 为 true 时会渲染子组件，当 accessible 为 false 会渲染 fallback 属性对应的 ReactNode。
