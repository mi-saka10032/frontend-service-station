---
title: Single-SPA协议
order: 3
category: false
tag:
  - 微前端方案
  - single-SPA
  - 路由分发
  - 应用隔离
  - 消息通信
---

在[微前端方案](./2-plan.html)中，我们讨论了多种微前端方案，这里主要围绕 single-SPA 协议的微前端（qiankun）实现，分析一下底层原理

参考链接 1：https://juejin.cn/post/6844904162509979662

参考链接 2：https://blog.csdn.net/weixin_43522687/article/details/106750074

参考链接 3：https://blog.csdn.net/wanghe1111_/article/details/123816165

## 模块组成

微前端的核心是“主从思想”，即一个基座（MaiApp）和若干个微应用（MicroApp）

基座应用大多数是一个前端 SPA 项目，主要负责应用注册、路由映射、消息下发等

微应用是独立前端项目，这些项目不限于采用 React、Vue、Angular 甚至 JQuery 开发。每个微应用注册到基座应用中，由基座进行管理，但是如果脱离基座也可以单独访问

![微前端模块图](https://misaka10032.oss-cn-chengdu.aliyuncs.com/MicroApp/microapp-module.png)

当整个微前端框架运行之后，给用户的体验就是类似下图所示：

![微前端运行效果](https://misaka10032.oss-cn-chengdu.aliyuncs.com/MicroApp/microapp-runtime.png)

简而言之，就是基座应用中有一些菜单项，每个菜单项可以展示对应的微应用，这些应用的切换对用户而言是无感知的，就用户体验来说是很好的。而为了实现多应用正常运行，基座应用有以下问题亟待解决：

1. 路由切换如何准确分发
2. 主微应用的全局环境如何隔离
3. 通信问题

## 路由分发

![微前端运行效果](https://misaka10032.oss-cn-chengdu.aliyuncs.com/MicroApp/microapp-route.png)

从上图可知，子应用在加载前会创建基于自身的生命周期实例和路由，然后注册到主工程中，当页面 URL 跳转时，通过路由管理器和应用管理器匹配子应用，在加载子应用的过程中，有三个生命周期，bootstrap 是初始化，这个时候页面显示 loading，也就是正在加载中，然后走到 mount，开始加载页面，不需要显示当前子应用时，通过 unmount 卸载子应用

实现基座应用**路由分发**子应用的核心是 systemJS 和 Single-SPA

![微前端远程技术](https://misaka10032.oss-cn-chengdu.aliyuncs.com/MicroApp/microapp-remoteTool.png)

- systemJS：提供通用的模块导入途经，支持传统模块、ES6、CJS、UMD 等模块，相当于加载器，主要用于调度子应用，决定何时展示哪个子应用
- Single-SPA：把现有的应用进行包装，使加载器可以使用它们

### 远程拉取（加载器）

远程拉取可以参考两套 npm 库：[import-html-entry](https://www.npmjs.com/package/import-html-entry)和[SystemJS](https://www.npmjs.com/package/systemjs)，它们底层是通过 fetch API 获取目标 url 的 HTML 内容，然后通过解析将微应用的 JavaScript 和 CSS 进行抽离，采用 eval 方法来运行 JavaScript，并将 CSS 和 HTML 内容 append 到基座应用中留给微应用的展示区域，当微应用切换走时，同步卸载这些内容，这就构成的当前应用的展示流程

```js
// 用于解析出html代码中的script脚本的方法
// 其实qiankun框架里面有用一个库即import-html-entry，其封装了一些从html文件中提取script标签，并动态执行script脚本的方法，而且这个库中也封装了沙箱机制

import { fetchResource } from "./fetch-resource";

// 这里我们仿造import-html-entry库，然后自己手写几个类似的方法
export const importHTML = async function (url) {
  // 加载子应用就是请求获取app的entry资源，资源有很多种，有HTML、css、js，所以我们要一个个来处理
  const html = await fetchResource(url);
  // 先来请求html资源,可以使用很多异步请求方式：ajax、aiox、fetch
  const template = document.createElement("div");
  template.innerHTML = html;
  // 获取template的dom下的所有script脚本
  const scripts = template.querySelectorAll("script");
  // 获取所有script标签脚本代码，最后返回一个数组的形式
  const getExternalScripts = function () {
    console.log(scripts);
    // promise.all的返回值是一个promise数组
    return Promise.all(
      Array.from(scripts).map((script) => {
        const src = script.getAttribute("src");
        if (!src) {
          //如果script脚本没有src，那么就是普通的script标签里面的script代码
          // 那么就只返回script里面的代码，并封装成promise对象
          return Promise.resolve(script.innerHTML);
        } else {
          //表示此script脚本是外链的资源，资源在src中
          return fetchResource(
            //需要判断src是以http开头比如http://www.nativejs.com，则资源是http外网资源;
            // 如果是一种相对路径资源比如：/src/res则需要手动加上子应用的域名
            src.startsWith("http") ? src : url + src
          ); //直接发送异步请求
        }
      })
    );
  };
  // 获取并执行所有的script脚本代码
  const execScripts = async function () {
    // 拿到html中的scripts脚，它是一个script代码字符串构成的数组
    const scripts = await getExternalScripts();

    // 手动的构造一个commonJs环境，commonJs规则，里面有一个module对象，还有一个exports对象并且指向module.exports对象
    const module = { exports: {} };
    const exports = module.exports;

    console.log(scripts);
    // 执行scripts数组中的script字符串代码，这里依然是使用eval函数来执行字符串代码
    scripts.forEach((script) => {
      // eval执行的代码可以访问外部代码
      eval(script);
    });
    // 由于子模块到出的库格式为umd库，并且将返回的数据挂载到了window对象上，
    // 所以我们可以在window对象上拿到子应用的生命周期钩子函数，需要注意的是生命周期钩子必须写在子应用的入口文件main.js，然后webpack打包的时候首先进入入口文件，然后再递归查找依赖的文件进行打包
    // 因为我们自己构造了commonJs环境，那么我就能够通过module.exports拿到回调函数factory()返回的结果
    console.log(module.exports);
    return module.exports;
  };

  return {
    template, //teplate为处理之后的html模板字符串
    getExternalScripts, //调用它会得到所有的script脚本
    execScripts, //用来执行文档中所有的script脚本
  };
};
```

### 路由注册（包装器）

Single-SPA 主要做的是：

1. 注册路由以及应用
2. 注册的应用按照 ES Module 模块载入规范导出
3. 根据路由匹配情况，发起一个路由匹配应用事件（single-spa:routing-event），在结合 SystemJS.import 方法去加载文件

更具体的分析链接：https://zhuanlan.zhihu.com/p/378346507

```js
// 注册路由
return Promise.resolve().then(() => {
  const loadPromises = getAppsToLoad().map(toLoadPromise);

  if (loadPromises.length > 0) {
    wasNoOp = false;
  }

  return Promise.all(loadPromises)
    .then(finishUpAndReturn)
    .catch((err) => {
      callAllEventListeners();
      throw err;
    });
});
```

### 分发步骤

所以路由分发指的其实是在主应用项目中，url 变化激活路由分发，路由管理器（SPA）找到 app1 对应的子应用名称，再去应用管理器里找到这个子应用，加载（SystemJS）到主应用，具体步骤是：

1. 子应用使用 single-SPA 创建实例，将加载前、加载后、卸载时的钩子函数、全局唯一的路由地址暴露到全局，以便主应用获取子应用的配置
2. 主应用通过 SystemJS 加载子应用的入口 JS 文件，通过 singleSpa.registerApplication 注册路由和应用
3. 当 url 变化时，触发 hashchange 或者 popstate 事件监听，获取到路由切换的时机
4. 接收到路由变化的主应用 router，通过查询注册信息以获取匹配的子应用，最后加载子应用，并且子应用也同步开启路由监听

```html
<script type="systemjs-importmap">
  {
    "imports": {
      "navbar": "http://localhost:8080/app.js",
      "app1": "http://localhost:8081/app.js",
      "single-spa": "http://cdnjs.cloudflare.com/ajax/libs/single-spa/4.3.7/system/single-spa.min.js",
      "vue": "https://cdn.jsdeliver.net/npm/vue@2.6.10/dist/vue.js",
      "vue-router": "https://cdn.jsdeliver.net/npm/vue-router@3.0.7/dist/vue-router.min.js"
    }
  }
</script>
```

```js
// 注册应用
singleSPA.registerApplication(
  "app1",
  () => System.import("app1"),
  // 当url前缀为 /app1 的时候，返回true（底层路由）
  (location) => location.pathname.startWith("/app1")
);

singleSPA.start();
```

### 公共依赖加载

再来说说公共依赖加载的问题

公共依赖是指子应用和主框架可以共用的依赖，像 vue、vue-router、webpack 等

这些公共依赖放在主框架中，子应用在 vue.config.js 文件通过 config.externals 配置共用依赖，这样需要时，就从主框架加载

主框架通过 systemjs-importmap 把需要的公用依赖文件导入进来，通过 System.import 使用依赖

## 应用隔离

应用隔离问题主要分为主应用和微应用，微应用和微应用之间的 JavaScript 执行环境隔离，CSS 样式隔离，我们先来说下 CSS 的隔离

### CSS 隔离

主应用和微应用同屏渲染时，就可能会有一些样式会相互污染，如果要彻底隔离 CSS 污染

**第一种**方法是 BEM（Block Element Modifier）：约定项目前缀

**第二种**方法是设置`selector module`，即采用 CSS Module 或者命名空间的方式，给每个微应用模块以特定前缀，即可保证不会互相干扰，可以采用 webpack 的 postcss 插件，在打包时添加特定的前缀

前两种方法大同小异

**第三种**方法是 css-in-js，让 js 去手动添加 css（不推荐）

**第四种**方法是使用`shadow DOM`，是 DOM 的 API，会把子应用所有内容放到 shadowDOM 里面，内部样式不会影响外部样式。html 中的 audio、video 标签都是 shadowDOM 的实际应用（强烈推荐）

shadow 使用 `HTMLElement.attachShadow({ mode: “open” })` 创建。之后再在里面添加子元素或者 innerHTML。

::: normal-demo shadowDOM 演示

```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta http-equiv="X-UA-Compatible" content="IE=edge" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Document</title>
  </head>
  <style>
    p {
      color: red;
    }
  </style>

  <body>
    <!-- 现在我将使用shadow dom来使得子应用和主应用之间的样式不会发生冲突 -->
    <p>wh</p>
    <!-- 子应用内容 -->
    <div id="subApp">
      <p>子应用wh</p>
    </div>
  </body>
</html>
```

```js
let subApp = document.querySelector("#subApp");
// shadow dom就相当于一个普通的dom，你可以拿到并操作它，并且不会有样式冲突
const shadow = subApp.attachShadow({ mode: "open" }); //创建shadow dom，mode指是否可以通过js拿到子应用的dom
shadow.innerHTML = `
  <p>这是通过shadow dom添加的内容</p>
  <style>
    p {
      color: green;
    }
  </style>
`;
```

:::

### JS 隔离

每当微应用的 JavaScript 被加载并运行时，它的核心实际上是对全局对象 Window 的修改以及一些全局事件的改变，例如 jQuery 这个 js 运行后，会在 Window 上挂载一个 window.$对象，对于其他库 React，Vue 也不例外。为此，需要在加载和卸载每个微应用的同时，尽可能消除这种冲突和影响，最普遍的做法是采用**沙箱机制（SandBox）**

js 沙箱隔离主要分为三种，snapshot sandbox（快照沙箱）、Proxy sandbox(代理沙箱)、legacy sandBox(遗留沙箱)

#### snapshot 沙箱

快照沙箱的核心思想：即在子应用挂载前对当前主应用的全局变量保存，然后恢复之前的子应用环境，在子应用运行期间正常 get 和 set，在子应用卸载时保存当前变量恢复主应用变量，整个过程类似于中断和中断恢复。

![快照沙箱](https://misaka10032.oss-cn-chengdu.aliyuncs.com/MicroApp/snapshot-sandbox.png)

```js
const iter = (window, callback) => {
  for (const prop in window) {
    if (window.hasOwnProperty(prop)) {
      callback(prop);
    }
  }
};
class SnapshotSandbox {
  constructor() {
    this.proxy = window;
    this.modifyPropsMap = {};
  }
  // 激活沙箱
  active() {
    // 缓存active状态的window
    this.windowSnapshot = {};
    iter(window, (prop) => {
      this.windowSnapshot[prop] = window[prop];
    });
    Object.keys(this.modifyPropsMap).forEach((p) => {
      window[p] = this.modifyPropsMap[p];
    });
  }
  // 退出沙箱
  inactive() {
    iter(window, (prop) => {
      if (this.windowSnapshot[prop] !== window[prop]) {
        // 记录变更
        this.modifyPropsMap[prop] = window[prop];
        // 还原window
        window[prop] = this.windowSnapshot[prop];
      }
    });
  }
}
```

原理就是在子应用激活 / 卸载时分别去经过快照的形式记录/还原状态来实现沙箱，总结起来，对当前的 window 和记录的快照作 diff 来实现沙箱。

优点：兼容性好

缺点：

1. 每次切换时需要遍历 window，时间消耗大
2. 多个子应用同时存在时仍然存在变量交叉污染的风险

#### legacy 沙箱

legacySandbox 利用 Proxy 的响应式原理，设置了三个参数来记录全局变量,分别是记录沙箱新增的全局变量 addedPropsMapInSandbox、记录沙箱更新的全局变量 modifiedPropsOriginalValueMapInSandbox、持续记录更新的(新增和修改的)全局变量，用于在任意时刻做 snapshot 的 currentUpdatedPropsValueMap

```js
class LegacySandbox {
    // 持续记录新增和修改的全局变量
    currentUpdatePropsValueMap = new Map()
    // 沙箱期间更新的全局变量
    modifiedPropsOriginalValueMapInSandbox = new Map()
    // 沙箱期间新增的全局变量
    addedPropsMapInSandbox = new Map()
    propsWindow = {}
​
    // 核心逻辑
    constructor() {
        const fakeWindow = Object.create(null)
        // 设置值或者获取值
        this.propsWindow = new Proxy(fakeWindow, {
            set: (target, prop, value, receiver) => {
                const originValue = window[prop]
                if (!window.hasOwnProperty(prop)) {
                    this.addedPropsMapInSandbox.set(prop, value)
                } else if(!this.modifiedPropsOriginalValueMapInSandbox.has(prop)){
                    this.modifiedPropsOriginalValueMapInSandbox.set(prop, originValue)
                }
                this.currentUpdatePropsValueMap.set(prop,value)
                window[prop]= value
            },
            get: (target, prop, receiver) => {
                return window[prop]
            }
        })
​
    }
    setWindowProp(prop, value, isToDelete) {
        if (value === undefined && isToDelete) {
            delete window[prop]
        } else {
            window[prop] = value
        }
​
    }
​
    active() {
        // 恢复上一次该微应用处于运行状态时，对window 上做的所有应用的修改
        this.currentUpdatePropsValueMap.forEach((value, prop) => {
            this.setWindowProp(prop, value)
        })
    }
    // 失活
    inactive() {
        // 还原window上的属性
        this.modifiedPropsOriginalValueMapInSandbox.forEach((value, prop) => {
            this.setWindowProp(prop, value)
        })
        // 删除在微应用运行期间 window 新增的属性
        this.addedPropsMapInSandbox.forEach((_, prop) => {
            this.setWindowProp(prop, undefined, true)
        })
    }
}
window.city="beijing"
let LegacySandbox01  = new LegacySandbox()
console.log('11111',window.city)
LegacySandbox01.active()
LegacySandbox01.propsWindow.city ="shanghai"
console.log('2222',window.city)
LegacySandbox01.inactive()
console.log('3333',window.city)
```

#### proxy 沙箱

激活沙箱后，每次对 window 取值的时候，先从自己沙箱环境的 fakeWindow 里面找，如果不存在，就从 rawWindow(主 window)里去找；当对沙箱内部 window 对象赋值的时候，会直接操作 fakeWindow，而不会影响到 rawWindow（主 window）

这里还用到了一个关键字：with，使用这个关键字可以阻断沙箱内对 window 全局变量的访问和修改，使子应用优先执行代理沙箱的 window 对象

```js
class ProxySandbox {
    proxyWindow
    isRunning = false
    active() {
        this.isRunning = true
    }
    inactive() {
        this.isRunning = false
    }
    constructor() {
        const fakeWindow = Object.create(null)
        this.proxyWindow = new Proxy(fakeWindow, {
            set: (target, prop, value, receiver) => {
                if(this.isRunning){
                    target[prop] = value
                }
            },
            get: (target, prop, receiver) => {
                return prop in target ? target[prop] : window[prop];
​
            }
        })
    }
}
window.city="beijing"
let proxySandbox01 = new ProxySandbox()
let proxySandbox02 = new ProxySandbox()
proxySandbox01.active()
proxySandbox02.active()
proxySandbox01.proxyWindow.city = 'shanghai'
proxySandbox02.proxyWindow.city = 'chengdu'
console.log("111111",window.city)
console.log("222222",proxySandbox01.proxyWindow.city)
console.log("333333",proxySandbox01.proxyWindow.city)
proxySandbox01.inactive()
proxySandbox02.inactive()
​
console.log("111111",window.city)
console.log("222222",proxySandbox01.proxyWindow.city)
console.log("333333",proxySandbox01.proxyWindow.city)
```

## 应用通信

最适用的还是消息订阅（pub/sub）模式的通信机制，基座应用定义事件中心 Event，每个微应用注册事件，当被触发事件时由事件中心统一分发，由此构成基本的通信机制

![微前端应用通信](https://misaka10032.oss-cn-chengdu.aliyuncs.com/MicroApp/microapp-contact.awebp)

以 qiankun 为例，qiankun 官方提供了 actions 通信，内部使用 initGlobalState(state)定义全局状态，该方法执行后返回一个 MicroAppStateActions 实例，实例中包含三个方法，分别是 onGlobalStateChange、setGlobalState、offGlobalStateChange。

```js
MicroAppStateActions
onGlobalStateChange: (callback: OnGlobalStateChangeCallback, fireImmediately?: boolean) => void //在当前应用监听全局状态，有变更触发 callback，fireImmediately = true 立即触发 callback
setGlobalState: (state: Record<string, any>) => boolean， //按一级属性设置全局状态，微应用中只能修改已存在的一级属性（就是用来修改全局状态的
offGlobalStateChange: () => boolean  //移除当前应用的状态监听，微应用 umount 时会默认调用
```

### 1.初始化全局状态

```js
// src/action.js
// 此action文件为定义微应用之间全局状态
// 引入qiankun的应用间通信方法initGlobalState
import { initGlobalState, MicroAppStateActions } from "qiankun";

const initialState = {
  // 这里可以写初始化数据
};
const actions = initGlobalState(initialState); //初始化state

// 监听actions全局公共状态数据的变化
actions.onGlobalStateChange((state, prevState) => {
  console.log("主应用变更前：", prevState);
  console.log("主应用变更后：", state);
  this.$store.commit("setProject", state); //将获取的最新的公共状态保存到vuex中，对于React等框架也一样，交给全局状态管理库执行
});

export default actions;
```

### 2.状态透传

```js
// main.js
// 注册的应用列表
const apps = [
  // 子应用vue应用
  {
    name: "vueApp", //应用名字
    // 默认请求的url，并解析里面的js，因为此时父应用请求了子应用里面的资源，所以子应用必须支持跨域
    entry: "http://localhost:8001",
    //容器名，子应用挂载到哪个元素
    container: "#container",
    //路由匹配激活规则，当路由匹配到activeRule时，就会请求获取entry资源，然后渲染到container容器中
    activeRule: "/vue",
    // 通过props实现通信传递值
    props: { actions, msg: "w" }, //向子应用传递创建的全局状态
  },
];
```

### 3.主应用状态修改

```vue
<template>
  <div class="home">
    <button @click="handle1">点击向子应用发送消息</button>
    <button @click="handle2">点击向子应用发送消息</button>
    <p>当前显示的项目：{{ project }}</p>
  </div>
</template>

<script>
import HelloWorld from "@/components/HelloWorld.vue"; //引入的HelloWorld组件
import actions from "../action";

export default {
  name: "Home",
  data() {
    return {
      mes1: {
        project_id: "项目1",
      },
      mes2: {
        project_id: "项目2",
      },
    };
  },
  computed: {
    project() {
      return this.$store.state.project_id;
    },
  },
  mounted() {
    // 需要在mounted钩子函数中注册qiankun的观察者函数
    // 注册一个观察者函数
    // 一旦修改actions的内容就会触发这个onGlobalStateChange监听函数
    actions.onGlobalStateChange((state, prevState) => {
      // state为变更后的状态，prevState为变更前的状态
      console.log("主应用观察者，改变前的state为：", prevState);
      console.log("主应用观察者，改变后的state为：", state);
    });
  },
  methods: {
    handle1() {
      actions.setGlobalState(this.mes1); //修改全局的actions
      this.$router.push("/vue"); //跳转到vue子应用中
    },
    handle2() {
      actions.setGlobalState(this.mes2); //修改全局的actions
      this.$router.push("/vue"); //跳转到vue子应用中
    },
  },

  components: {
    HelloWorld, //注册组件
  },
};
</script>
```

### 4.子应用状态修改

先在子应用中配置一个空的 actions 实例为以后重新赋值从主应用中传递过来的 actions

```js
// action.js
function emptyAction() {
  // 警告：提示当前使用的是空 Action
  console.warn("Current execute action is empty!");
}

// 我们首先设置一个用于通信的Actions类

class Actions {
  actions = {
    onGlobalStateChange: emptyAction,
    setGlobalState: emptyAction,
  };
  constructor() {}
  // 默认值为空Action

  // 设置actions
  setActions(actions) {
    this.actions = actions;
  }

  // 映射
  onGlobalStateChange(...args) {
    return this.actions.onGlobalStateChange(...args);
  }
  // 映射
  setGlobalState(...args) {
    return this.actions.setGlobalState(...args);
  }
}

const actions = new Actions();
export default actions;
```

然后在 mounted 的生命周期里注入 actions 实例

```js
// main.js
function render(props) {
  if (props) {
    actions.setActions(props);
  }
  const { container } = props;
  // 渲染的时候赋值
  instance = new Vue({
    router,
    store,
    render: (h) => h(App),
  }).$mount(container ? container.querySelector("#app") : "#app"); //这里是挂载到自己的html中，基座会拿到这个挂载后的html，将其插入进去
}
```

最后是子应用修改数据状态，主应用可以监听

```vue
<template>
  <div class="home">
    <button @click="handle">快点我向父应用发送数据</button>
    <p>{{ msg }}</p>
    <img alt="Vue logo" src="../assets/logo.png" />
    <HelloWorld msg="Welcome to Your Vue.js App" />
  </div>
</template>

<script>
// @ is an alias to /src
import HelloWorld from "@/components/HelloWorld.vue";
import actions from "../actions";
export default {
  name: "Home",
  data() {
    return {
      msg: "2",
    };
  },
  mounted() {
    // console.log("cccc");
    // console.log(actions);
    actions.onGlobalStateChange((state) => {
      console.log("我是子应用，我检测到数据了：", state);
      this.msg = state;
    }, true); //onGlobalStateChange的第二个参数设置为true，则会立即触发一次观察者函数
  },
  methods: {
    handle() {
      actions.setGlobalState({ project_id: "项目520" });
    },
  },

  components: {
    HelloWorld,
  },
};
</script>
```

## 总结

我们以 qiankun 为例，分析了 single-SPA 作为微前端方案时的所需要解决的三大问题：路由切换分发与加载问题；主微应用环境隔离问题；主微应用通信问题

最后，再次结合一个微前端应用的生命周期，总结一次微前端项目的实现原理：

1. 基座应用启动
   1. 启动子应用管理器
   2. 提供全局的公共依赖
   3. 开启全局的 actions 事件模型，全局挂载 state
2. 子应用使用包装器后包装后启动，子应用向外暴露钩子函数与远程地址
3. 主页面路由跳转，监听匹配到对应子应用地址，启动模块加载器，分 HTML、CSS、JS 加载子应用模块资源
   1. 加载 CSS，对子应用的 CSS 启用 CSS Module 或者使用 shadowDOM
   2. 加载 JS，使用 Proxy Sandbox 开启多实例沙箱
   3. 子应用隔离出来的公共依赖，在沙箱中寻找外部 window 作用域获取来自基座应用的公共依赖
4. 模块资源加载完成后，子应用挂载，接收基座应用的 actions，在自己内部实现全局事件模型的派发和监听
