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

### 路由

Umi 默认按页拆包，注意编写`src/loading.tsx`

path 只支持两种占位符配置，第一种是动态参数 :id 的形式，第二种是 \* 通配符，通配符只能出现路由字符串的最后

可配置的基础属性有：path、component、routes、redirect、wrappers、title

[配置方法](#pages)

wrappers：

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
