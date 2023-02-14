---
title: Nuxt
order: 2
category: false
tag:
  - Vue
  - Nuxt
  - SSR
  - 服务端渲染框架
---

本章主要记录面向 Vue2 的 Nuxt2 的框架结构与重构要点

## 项目结构

pages：存放页面 对标 vue-cli 的 src/views

components：存放组件 对标 vue-cli 的 src/components

static：存放静态资源 对标 vue-cli 的 src/assets

store：vuex 状态树 对标 vue-cli 的 src/store

nuxt.config.js：配置文件 对标 vue.config.js

## 服务端生命周期

![Nuxt生命周期](https://misaka10032.oss-cn-chengdu.aliyuncs.com/renderMode/image-20220327180649868.png)

### nuxtServerInit

`nuxtServerInit( store, context) {  }`

参数 1：VueX 的上下文对象

参数 2：Nuxt 的上下文对象

基本是两者的全局对象，很少使用

### middleware

`middleware({store, route, redirect, params, query, req, res}) { }`

执行 nuxt 项目中引入的中间件文件

作用：代替路由守卫，在服务端处理请求时及时响应处理而不是到客户端触发路由守卫才开始调用逻辑

#### 全局中间件

1. 配置文件更新

```js
// nuxt.config.js
router: {
  middleware: "名称";
}
```

2. 新建 middleware 目录 => 新建文件.js

#### 局部中间件

不需要新建文件

```vue
<script>
export default {
  middleware: "名称",
};
</script>
// 或者
<script>
export default {
  middleware() {
    // 不需要新建文件
  },
};
</script>
```

### validate

`validate({params, query}) {  }`

一般用于判断参数中的 params 和 query，在页面中调用

作用：一般用于校验 url 参数

```js
<script>
export default {
  validate({params, query}) {
    console.log(params);
    console.log(query);
    return true;
  }
}
</script>
```

### asyncData

`asyncData({store, params}) {  }`

只能在 pages 中使用

作用：pages 页面请求数据

### fetch

`fetch({app, store, params}) {  }`

可以在 pages 和 components 中使用

作用：填充状态树 store

## 服务端和客户端共有生命周期

beforeCreate 和 created 是双端共有生命周期，就是 Vue 原本的生命周期

## 客户端生命周期

客户端自有的生命周期有：

- beforeMount

- mounted

- beforeUpdate

- updated

- beforeDestroy

- destroyed

## Nuxt 路由

### 标签变动

VueRouter 原来的`<router-link>`需要改为`<nuxt-link>`，其余参数、编程式导航均一致

VueRouter 原来提供的`<router-view>`路由容器标签需要改为`<nuxt-child>`

### 基础路由

假设 `pages` 的目录结构如下：

```bash
pages/
--| user/
-----| index.vue
-----| one.vue
--| index.vue
```

那么，Nuxt.js 自动生成的路由配置如下：

```js
router: {
  routes: [
    {
      name: "index",
      path: "/",
      component: "pages/index.vue",
    },
    {
      name: "user",
      path: "/user",
      component: "pages/user/index.vue",
    },
    {
      name: "user-one",
      path: "/user/one",
      component: "pages/user/one.vue",
    },
  ];
}
```

### 动态路由

在 Nuxt.js 里面定义带参数的动态路由，需要创建对应的**以下划线作为前缀**的 Vue 文件 或 目录。

以下目录结构：

```bash
pages/
--| _slug/
-----| comments.vue
-----| index.vue
--| users/
-----| _id.vue
--| index.vue
```

Nuxt.js 生成对应的路由配置表为：

```js
router: {
  routes: [
    {
      name: "index",
      path: "/",
      component: "pages/index.vue",
    },
    {
      name: "users-id",
      path: "/users/:id?",
      component: "pages/users/_id.vue",
    },
    {
      name: "slug",
      path: "/:slug",
      component: "pages/_slug/index.vue",
    },
    {
      name: "slug-comments",
      path: "/:slug/comments",
      component: "pages/_slug/comments.vue",
    },
  ];
}
```

你会发现名称为 `users-id` 的路由路径带有 `:id?` 参数，表示该路由是可选的。如果你想将它设置为必选的路由，需要在 `users/_id` 目录内创建一个 `index.vue` 文件

### 嵌套路由

你可以通过 vue-router 的子路由创建 Nuxt.js 应用的嵌套路由。

创建内嵌子路由，你需要添加一个 Vue 文件，同时添加一个**与该文件同名**的目录用来存放子视图组件。

**Warning:** 别忘了在父组件(`.vue`文件) 内增加 `<nuxt-child/>` 用于显示子视图内容。

假设文件结构如：

```bash
pages/
--| users/
-----| _id.vue
-----| index.vue
--| users.vue
```

Nuxt.js 自动生成的路由配置如下：

```js
router: {
  routes: [
    {
      path: "/users",
      component: "pages/users.vue",
      children: [
        {
          path: "",
          component: "pages/users/index.vue",
          name: "users",
        },
        {
          path: ":id",
          component: "pages/users/_id.vue",
          name: "users-id",
        },
      ],
    },
  ];
}
```

## 使用原生 VueRouter

要使用原本的 VueRouter 和路由表来控制路由结构，需要以下步骤：

1. 下载`@nuxt-js/router`

```shell
npm install @nuxtjs/router -D
yarn add @nuxtjs/router -D
```

2. nuxt.config.js 的 modules 配置

```js
modules: ["@nuxtjs/router"];
```

3. 复制或新建`router.js`文件放入 nuxt 项目根目录

注意：

**文件名必须是 router.js**

**不能做懒加载，也不需要做懒加载**

注意写法差异

```js
import Router from "vue-router";

import MyPage from "~/components/my-page";

Vue.use(Router);

export function createRouter() {
  return new Router({
    mode: "history",
    routes: [
      {
        path: "/",
        component: MyPage,
      },
    ],
  });
}
```

## 使用导航守卫

有三种导航守卫的使用方法

### `@nuxt-js/router`

通过加入原生 VueRouter，在其内部声明前置 or 后置路由守卫

注意：在 router.js 中，不能使用 window 的全局 API，如 cookie、localStorage 等

### 使用 middleware 中间件

此种方法在上面介绍服务端生命周期时已经记录过，不再赘述

### plugins

通过配置 plugins 的 js 文件来实现

```js
// nuxt.config.js
plugins: ["@/plugins/router.js"]; //全局
```

plugins/router.js 中的文件

```
export default ({app}) => {
	app.router.beforeEach((to, from, next) => {
		/***********/
		next();
	})
}
```

## 服务端解决本地存储问题方案

```shell
npm i cookie-universal-nuxt --save
```

```
plugins: [
	'cookie-universal-nuxt'
]
```

在 store 中可以直接使用 this.$cookie 来调用 cookie 相关方法

## Nuxt 配置

### head

在 nuxt.config.js 中通过设置 head 对象影响全局 head 标签，在 page 组件中为局部 head 函数

```js
head() {
  return {
    title: '关于我们',
    meta: [
      { charset: 'utf-8' },
      {
        name: 'viewport',
        content: 'width=device-width, initial-scale=1'
      },
      {
        hid: 'description',
        name: 'description',
        content: '此处是网站描述'
      },
      {
        hid: 'keywords',
        name: 'keywords',
        content: '此处是网站关键词'
      },
    ],
    link: [
      {
        rel: 'icon',
        type: 'image/x-icon',
        href: '/favicon.ico'
      }
    ]
  }
}
```

页面的单独个性化定制可以引入 `vue-meta-info`

### css

全局样式：

```js
// nuxt.config.js
css: ["@/static/reset.css"];
```

组件样式：

page 内组件默认开启 style scoped，components 需要自行开启 style scoped

### plugins

全局运行的 js 文件，在 render page 之前

可引入 axios 二次封装、element-ui、自定义插件

### modules

modules 是 nuxt 扩展，可以扩展它的核心功能并添加无限的集成

#### axios 扩展

@nuxtjs/axios

```shell
npm install @nuxtjs/axios -S
```

```js
modules: ["@nuxtjs/axios"];
```

拦截器：

放在 plugins 文件夹中作为插件调用

```
export default ( { $axios } ) => {
	$axios.onRequest((config)=>{
		// 设置token
		return config;
	})
	$axios.onResponse((config)=>{
		return config;
	})
}
```

#### asyncData 数据处理

axios 请求方法放在 asyncData 生命周期中调用

pages 目录中的页面组件限用，components 不可用

```js
async asyncData( { $axios } ){
	let res = await $axios.get('****************.url');
    console.log(res);
    return {
        res
    }
}
```

asyncData 中没有 this，需要将 data 返回

#### fetch 数据处理

fetch 主要在页面渲染前填充 store 的数据，不同的是它不会设置组件数据

fetch 支持 async 异步方法

**在 components 中使用时，fetch 的 this 指向组件 this**

## Nuxt 代理

```shell
npm install @nuxtjs/proxy -S
```

nuxt.config.js 配置

```js
modules: [
	'@nuxtjs/axios',
	'@nuxtjs/proxy'
],
axios: {
    proxy: true,
    retry: { retries: 3 },
    baseUrl: process.env._ENV === 'production' ? 'xxx' : 'yyy'
},
proxy: {
    '/api': {
        target: 'http://localhost:4000',
        pathRewrite: {
            '^/api': ''
        }
    }
}
```

## loading

### 默认配置

```js
// nuxt.config.js
loading: false; // 关闭nuxt自带的loading加载效果
```

### 个性化 loading

![个性化loading配置](https://misaka10032.oss-cn-chengdu.aliyuncs.com/renderMode/image-20220331232346390.png)

### 自定义 loading

你可以新建一个加载组件替代 Nuxt.js 默认的。使用自己的加载组件，需要在 loading 配置项里指定组件路径，Nuxt.js 会自动调用该组件

自定义组件需要考虑实现以下接口方法：

| 方法          | 是否必须 | 描述                                                           |
| :------------ | :------- | :------------------------------------------------------------- |
| start()       | 是       | 路由更新（即浏览器地址变化）时调用，请在该方法内显示组件       |
| finish()      | 是       | 路由更新完毕（即 asyncData）方法调用完成，请在该方法内隐藏组件 |
| fail(error)   | 否       | 路由更新失败时调用（如 asyncData 方法返回异常）                |
| increase(num) | 否       | 页面加载过程中调用，num 是小于 100 的整数                      |

我们可以在 components 目录下创建自定义的加载组件，如`components/loading.vue`

```js
// nuxt.config.js
module.exports = {
  loading: "~/components/loading.vue",
};
```

## 重构要点

接下来记录常规 vue-cli 项目转移重构 nuxt 项目的要点

### 配置路由

```shell
npm install @nuxtjs/router -S
```

nuxt.config.js 配置

```js
modules: ["@nuxtjs/router"];
```

把 vue-cli 中的 router 文件拷贝到 nuxt 项目根目录

修改最后的返回函数

```js
export function createRouter({
	return new Router({
		mode: 'history',
		routes
	})
})
```

### 请求接口

先解决跨域问题，并且安装 axios

```shell
npm install @nuxtjs/aioxs @nuxtjs/proxy -S
```

nuxt.config.js 配置

```js
plugins: [
    '@/plugins/axios.js',
    '@/plugins/api.js'
],
modules: [
    "@nuxtjs/router",
    "@nuxtjs/axios",
    "@nuxtjs/proxy"
],
axios: {
    baseUrl: '',
    proxy: true
},
proxy: {
    '/api': {
        target: 'http://localhost:8000'
    }
}
```

plugins/axios.js 文件 拦截器与基础配置

```js
export default ({ $axios }) => {
  $axios.onRequest((config) => {});
  $axios.onRequestError((error) => {});
  $axios.onResponse((config) => {});
  $axios.onResponseError((error) => {});
};
```

plugins/api.js api 接口维护

```js
export default ({ $axios }, inject) => {
  inject("param1", (param) =>
    $axios({
      url: "************",
      method: "GET",
      params: params,
    })
  );
  inject("param2", () =>
    $axios({
      url: "************",
      method: "POST",
    })
  );
};
```

app 调用：

```js
app.$param1(param);
```

### 组件重构

1. 注意 import 和 require 的路径更换
2. 注意将需要渲染的 ajax 请求放到当前组件的 asyncData 或者 fetch 中，或者是父组件中进行父传子
3. window 方法不能放到 beforeMount 生命周期之前调用
4. 最后：有错误慢慢调

### 配置 store

```js
const store = () =>
  new VueX.Store({
    modules: {
      user,
      information,
      others,
    },
  });
```

### 导航守卫

放到 middleware 中间件文件夹中，读取 token

### 打包上线

1. 执行：`npm run build`

2. 将打包好的`.nuxt static nuxt.config.js package.json`以上文件丢到服务器某个文件夹中，并且在服务器安装 node 环境

3. 在服务器上执行 `npm install`

4. 在服务器运行项目 `npm run start`

打开的也是 `localhost:3000`

我们需要使用 nginx 做代理，代理域名

```nginx

#user  nobody;
worker_processes  1;

#error_log  logs/error.log;
#error_log  logs/error.log  notice;
#error_log  logs/error.log  info;
#error_log log/error.log debug;

#pid        logs/nginx.pid;


events {
    accept_mutex on;
    multi_accept on;
    worker_connections  1024;
}


http {
    include       mime.types;
    default_type  application/octet-stream;
    #access_log off;
    #log_format myFormat '$remote_addr?C$remote_user [$time_local] $request $status $body_bytes_sent $http_referer $http_user_agent $http_x_forwarded_for';
    #access_log log/access.log myFormat;
    sendfile on;
    sendfile_max_chunk 100k;
    keepalive_timeout 65;

    #gzip  on;
    upstream vue3000 {
    	server localhost:3000;
    }

	server {
		listen 80;
		server_name test.domain.com;

		add_header Cache-Control no-cache;
		add_header Pragma no-cache;
		add_header Expires 0;
		#charset koi8-r;

		#access_log  logs/host.access.log  main;
		location / {
			proxy_pass  http://vue3000/;
			index  index.html index.htm;
		}

  }

	client_max_body_size 10m;
}
```
