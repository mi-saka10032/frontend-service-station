---
title: VueRouter
order: 11
category: false
tag:
  - VueRouter
  - url监听
  - SPA路由管理
---

## 理解

### SPA

1.单页 web 应用。

2.整个应用只有一个完整页面。

3.点击页面中的导航链接不会刷新页面，只会做页面的局部更新。

4.数据需要通过 ajax 请求获取。

### 路由

1.一个路由就是一组映射关系(key - value)

2.key 为路径，value 可能是 function 或 component

### 分类

1.后端路由：

value 是 function，用于处理客户端提交的请求。

服务器收到一个请求时，根据请求路径找到匹配的函数来处理请求，返回响应数据。

2.前端路由：

value 是 component，用于展示页面内容。

当浏览器的路径改变时，对应的组件就会显示。

## 基本使用

1.`npm i vue-router`

2.应用插件 `Vue.use(VueRouter)`

3.编写 router 配置项并注入到 Vue 实例中

```js
// ./router/index.js
import VueRouter from "vue-router";
import About from "../components/About.vue";
import Home from "../components/Home.vue";

//创建并默认暴露一个路由器
export default new VueRouter({
  routes: [
    {
      path: "/about",
      component: About,
    },
    {
      path: "/home",
      component: Home,
    },
  ],
});
```

```js
// main.js
import router from "./router";

new Vue({
  router,
  render: (h) => h(App),
  beforeCreate() {
    Vue.prototype.$bus = this;
  },
}).$mount("#app");
```

4.实现切换 active-class 可配置高亮样式

```vue
<template>
  <router-link class="list-group-item" active-class="active" to="/about"
    >About
  </router-link>
</template>
```

5.指定展示位置

```vue
<template>
  <router-view></router-view>
</template>
```

### 注意点

1.路由组件通常放在 pages 文件夹，一般组件通常存放在 components 文件夹。

2.通过切换，隐藏了的路由组件，默认是被销毁掉的，需要的时候再去挂载。

3.每个组件都有自己的$route 属性，里面存储着自己的路由信息。

4.整个应用只有一个 router，可以通过组件的$router 属性获取到。

### 嵌套路由

1.配置路由规则，使用 children 配置项：

```js
routes: [
  {
    path: "/about",
    component: About,
  },
  {
    path: "/home",
    component: Home,
    children: [
      {
        path: "news", //此处一定不要写 /news
        component: News,
      },
      {
        path: "message", //此处一定不要写	/message
        component: Message,
      },
    ],
  },
];
```

2.跳转，要写完整路径：

```vue
<router-link
  class="list-group-item"
  active-class="active"
  to="/home/news"
>News</router-link>
```

### 路由命名

作用：简化路由的跳转，以及后续路由跳转也有用到。

```js
export default new VueRouter({
	routes: [{
			path: '/about',
			component: About
		},
		{
			path: '/home',
			component: Home,
			children: [{
					path: 'news',
					component: News
				},
				{
					path: 'message',
					component: Message,
					children: [
						{
							name: 'xiangqing'	//命名
							path: 'detail',
							component: Detail
						}
					]
				}
			]
		}
	]
})
```

简化跳转写法：

```vue
<template>
  <!-- 简化前，完整路径 -->
  <router-link to="/demo/test/welcome">跳转</router-link>

  <!-- 简化后，通过名字跳转 -->
  <router-link :to="{ name: 'hello' }">跳转</router-link>

  <!-- 简化写法配合传递参数 -->
  <router-link :to="{ name: 'hello', query: { id: 666, title: '你好' } }"
    >跳转</router-link
  >=
</template>
```

## 路由传参

### query

```vue
<template>
  <!-- 跳转并携带query参数，to的字符串写法 -->
  <router-link to="/home/message/detail?id=666&title=你好">跳转</router-link>

  <!-- 跳转并携带query参数，to的对象写法 -->
  <router-link
    :to="{ path: '/home/message/detail', query: { id: 666, title: '你好' } }"
    >跳转</router-link
  >=
</template>
```

在指向 /home/message/detail 路由的组件 component 中，调用 query 参数

`this.$route.query.id` `this.$route.query.title`

### params

1.配置路由，声明接收 params 参数

```js
export default new VueRouter({
	routes: [{
			path: '/about',
			component: About
		},
		{
			path: '/home',
			component: Home,
			children: [{
					path: 'news',
					component: News
				},
				{
					path: 'message',
					component: Message,
					children: [
						{
							name: 'xiangqing'	//命名
							path: 'detail/:id/:title',  // 使用占位符声明接收params参数
							component: Detail
						}
					]
				}
			]
		}
	]
})
```

```vue
<template>
  <!-- 跳转并携带params参数，to的字符串写法 -->
  <router-link to="/home/message/detail/666/你好">跳转</router-link>

  <!-- 跳转并携带params参数，to的对象写法，此处必须是name，不能是path -->
  <router-link :to="{ name: 'xiangqing', params: { id: 666, title: '你好' } }"
    >跳转</router-link
  >=
</template>
```

**特别注意 1**：路由携带 params 参数时，若使用 to 的对象写法，则不能使用 path 配置项，必须用 name 配置！

在指向 /home/message/detail/:id/:title 路由的组件 component 中，调用 params 参数

`this.$route.params.id` `this.$route.params.title`

**特别注意 2**：

- 在路由配置中不声明 id 和 title 占位符，依旧可以通过 to 的对象写法跳转到'xiangqing'路由组件，并且 params 参数可传递，但是页面刷新后 params 会消失
- 该路由配置方法适用于 url 跳转需要对参数保密的情景，为了避免页面刷新后丢失 params，可以在跳转的时候对 params 做持久化储存，后端处理、使用 localStorage、VueX-persist 均可解决。

### props

作用：让路由组件更方便地收到参数

```js
// ./router/index.js
{
  name: 'xiangqing',
  path: 'detail/:id',
  component: Detail,

  // 第一种写法，props值为对象，该对象中所有的key-value组合最终都通过props传给Detail组件
  props: { a: 900 }

  // 第二种写法：props为布尔值，布尔值为true，则把路由收到的所有params参数通过props传给Detail组件
  props: true

  // 第三种写法：props值为函数，该函数返回的对象中每一对key-value组合都会通过props传给Detail组件
  props(route) {
    return {
      id: route.params.id,
      title: route.query.title
    }
  }
}
```

## 编程式路由导航

1.作用：不借助`<router-link>`实现路由跳转，让路由跳转更加灵活

```js
// $router的两个API
// 跳转到目标路由，浏览器后退可退回当前url
this.$router.push({
  name: "xiangqing",
  params: {
    id: "xxx",
    title: "xxxx",
  },
});

// 替换当前url并跳转到目标路由，浏览器无法退回到当前url
this.$router.replace({
  name: "xiangqing",
  params: {
    id: "xxx",
    title: "xxxx",
  },
});

this.$router.forward(); // 前进
this.$router.back(); // 后退
this.$router.go(); // 前进或后退取决于go中的参数（需要为整数），正数为前进负数为后退
```

**replace 属性**

1.作用：控制路由跳转时操作浏览器历史记录的模式

2.浏览器的历史记录有两种写入方式：分别为 push 和 replace，push 是追加历史记录，replace 是替换当前历史记录，路由跳转默认 push

3.router-link 中如何开启 replace：`<router-link replace >News</router-link>`

## 缓存路由组件

1.作用：让不展示的路由组件保持挂载，不被销毁。

2.具体编码：

```vue
<keep-alive include="News">
	<router-view></router-view>
</keep-alive>
```

## 新生命周期钩子

1.作用：路由组件所独有的两个钩子，用于捕获路由组件的激活状态。

2.具体名字：

activated 路由组件被激活时触发

deactivated 路由组件失活时触发

```js
// 配合keep-alive使用，组件会在首次加载时触发mounted钩子，外部父路由卸载前触发beforeDestroy钩子，在父路由内部子路由之间相互切换，并不会触发挂载和卸载钩子，而是触发activated和deactivated
export default {
  mounted() {
    console.log("组件挂载");
  },
  activated() {
    console.log("路由组件激活");
  },
  deactivated() {
    console.log("路由组件失活");
  },
  beforeDestroy() {
    console.log("组件即将销毁");
  },
};
```

## 路由守卫

1.作用：对路由进行权限控制。

2.分类：全局守卫、独享守卫、组件内守卫

### 全局守卫

```js
// 全局前置守卫：初始化时执行，每次路由切换时执行
router.beforeEach((to, from, next) => {
  console.log("beforeEach", to, from);
  // 判断当前路由是否需要进行权限控制，在router配置项中对目标路由的meta属性对象中添加isAuth的布尔值
  if (to.meta.isAuth) {
    // 权限控制的具体规则
    if (localStorage.getItem("school") === "atguigu") {
      next(); // 放行
    } else {
      alert("暂无权限查看");
    }
  } else {
    next(); // 放行
  }
});

// 全局后置守卫，初始化时执行，每次路由切换后执行
router.afterEach((to, from) => {
  console.log("afterEach", to, from);
  if (to.meta.title) {
    document.title = to.meta.title; // 修改网页的title
  } else {
    document.title = "vue-test";
  }
});
```

### 独享守卫

写在 routes 的对象元素中，并且该守卫没有 afterEnter 后置守卫

```js
// ./router/index.js
{
  path: '/home',
  name: 'Home',
  component: Home,
  beforeEnter(to, from, next) {
    console.log('beforeEnter', to, from);
    if(to.meta.isAuth) {
      if(localStorage.getItem('school') === 'atguigu') {
        next()
      } else {
        alert('暂无权限查看')
      }
    } else {
      next()
    }
  }
}
```

### 组件内守卫

在组件内配置项书写

```vue
<script>
export default {
  // 进入守卫：通过路由规则，进入该组件时调用
  beforeRouteEnter(to, from, next) {
    // ...
  },
  // 离开守卫：通过路由规则，离开该组件时调用
  beforeRouteLeave(to, from, next) {
    // ...
  },
};
</script>
```

## 路由器两种工作模式

1.对于一个 url 来说，什么是 hash 值？——#及其后面的内容就是 hash 值。

2.hash 值不会包含在 http 请求中，即：hash 值不会带给服务器。

3.hash 模式：

-地址中永远带着#号，不美观。

-若以后将地址通过第三方手机 app 分享，若 app 校验严格，则地址会被标记为不合法。

- 兼容性较好。

  4.history 模式：

​ - 地址干净，美观。

​ - 兼容性和 hash 模式相比略差。

​ - 应用部署上线时需要后端人员支持，解决刷新页面服务端 404 的问题。

```js
export default new VueRouter({
  mode: 'hash' // or 'history'
  routes: {
    path: "/about",
    component: About,
  },
});
```

## history 模式在生产环境的问题

待定
