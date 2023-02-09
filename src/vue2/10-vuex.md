---
title: VueX
order: 10
category: false
tag:
  - VueX
  - 全局状态管理
  - 全局组件通信
---

## 理解

概念：专门在 Vue 中实现集中式状态（数据）管理的一个 Vue 插件，对 vue 应用中多个组件的共享状态进行集中式的管理（读/写），也是一种组件间通信的方式，且适用于任意组件间通信。

什么时候使用？

1.多个组件依赖于同一状态

2.来自不同组件的行为需要变更同一状态

![VueX状态](https://misaka10032.oss-cn-chengdu.aliyuncs.com/Vue/vuex-16349798007261.png)

## 搭建 VueX 环境

```js
// ./store/index.js VueX根文件
import Vue from "vue";

import VueX from "vuex";

Vue.use(VueX);

//准备动作actions
const actions = {
  increment(context, value) {
    context.commit("INCREMENT", value);
  },
  decrement(context, value) {
    context.commit("DECREMENT", value);
  },
  incrementOdd(context, value) {
    if (context.state.num % 2) context.commit("INCREMENT", value);
  },
  incrementAysnc(context, value) {
    setTimeout(() => {
      context.commit("INCREMENT", value);
    }, 1000);
  },
};

//准备变化mutations
const mutations = {
  INCREMENT(state, value) {
    state.num += value;
  },
  DECREMENT(state, value) {
    state.num -= value;
  },
};

//准备数据状态state
const state = {
  num: 0,
};

const getters = {
  tenTime() {
    return state.num * 10;
  },
};

export default new VueX.Store({
  actions,
  mutations,
  state,
  getters,
});
```

```js
// main.js
import store from './store'

new Vue({
  store,
  render: (h) => h(App),
  beforeCreate() {
    Vue.prototype.$bus = this;
  },
}).$mount("#app");
```

## 核心属性

### state

1.VueX 管理的状态对象

2.它应该是唯一的

3.示例代码：

```js
const state = {
  xxx: initValue,
};
```

### actions

1.值为一个对象，包含多个响应用户动作的回调函数

2.通过 commit() 来触发 mutation 中函数的调用，间接更新 state

3.如何触发 actions 中的回调

​ 在组件中使用 `$store.dispatch('对应的 action 回调名')`触发

4.可以包含异步代码（定时器，ajax）

5.示例代码：

```js
const actions = {
  zzz({ commit, state }, data1) {
    commit("yyy", { data });
  },
};
```

### mutations

1.值是一个对象，包含多个直接更新 state 的方法。

2.谁能调用 mutation 中的方法，如何调用？

在 action 中：commit("对应的 mutation 方法名")触发

3.mutations 中方法的特点：不能写异步代码、只能单纯操作 state

在组件仅进行简单操作时，可越过 actions 直接对 mutations 操作，`this.$store.commit(xxx)`

4.示例代码：

```js
const mutations = {
  yyy(state, { data1 }) {
    //更新state某属性
  },
};
```

### getters

1.值为一个对象，包含多个用于返回数据的函数

2.如何使用？ `$store.getters.xxx`

3.示例代码：

```js
const getters = {
  mmm(state) {
    return state.msg + "!";
  },
};
```

## Map 方法

### mapState

映射 state 中的数据为计算属性。

```js
import { mapState } from "vuex";

export default {
  computed: {
    // 借助mapState生成计算属性：sum、school、subject（对象写法）
    ...mapState({ sum: "sum", school: "school", subject: "subject" }),
    // 借助mapState生成计算属性：sum、school、subject（数组写法）
    ...mapState(["sum", "school", "subject"]),
  },
};
```

### mapGetters

映射 getters 中的数据为计算属性。

```js
import { mapGetters } from "vuex";

export default {
  computed: {
    // 借助mapGetters生成计算属性：bigSum（对象写法）
    ...mapGetters({ bigSum: "bigSum" }),
    // 借助mapGetters生成计算属性：bigSum（数组写法）
    ...mapGetters(["bigSum"]),
  },
};
```

### mapActions

生成与 actions 对话的方法，即包含`$store.dispatch(xxx)`的函数

```js
import { mapActions } from "vuex";

export default {
  methods: {
    // 借助mapActions生成：incrementOdd、incrementWait（对象写法）
    ...mapActions({ incrementOdd: "jiaOdd", incrementWait: "jiaWait" }),
    // 借助mapActions生成：jiaOdd、jiaWait（数组写法）
    ...mapActions(["jiaOdd", "jiaWait"]),
  },
};
```

### mapMutations

生成与 mutations 对话的方法，即包含`$store.commit(yyy)`的函数

```js
import { mapMutations } from "vuex";

export default {
  methods: {
    // 借助mapMutations生成：increment、decrement（对象写法）
    ...mapMutations({ increment: "JIA", decrement: "JIAN" }),
    // 借助mapMutations生成：JIA、JIAN（数组写法）
    ...mapMutations(["JIA", "JIAN"]),
  },
};
```

备注：mapActions 与 mapMutations 使用时，若需要传递参数需要：在模板中绑定事件时传递好参数，否则参数是事件对象。

## module 命名空间

1. 包含多个 module
2. 一个 module 是一个 store 的配置对象
3. 与一个组件（包含有共享数据）对应

步骤：

1.修改 store.js

```js
const countAbout = {
	namespaced: true,	//开启命名空间
	state: {x: 1},
	mutations: { …… },
	actions: { …… }，
	getters: {
    	bigSum(state){
    		return state.sum * 10
    	}
    },
}

const personAbout = {
	namespaced: true,
	state = { …… },
	mutations: { …… }，
	actions: { …… }
}

const store = new Vuex.Store({
	modules: {
		countAbout,
		personAbout
	}
})
```

2.开启命名空间后，组件中读取 state 数据

方式一：直接读取

```js
this.$store.state.personAbout.list;
```

方式二：借助 mapState 读取

```js
...mapState('countAbout',['sum','school','subject'])
```

3.开启命名空间后，组件中读取 getters 数据

方式一：直接读取

```js
this.$store.getters["personAbout/firstPersonName"];
```

方式二：借助 mapGetters 读取

```js
...mapGetters('countAbout',['bigSum'])
```

4.开启命名空间后，组件中调用 dispatch

方式一：直接 dispatch

```js
this.$store.dispatch("personAbout/addPersonWang", person);
```

方式二：借助 mapActions

```js
...mapActions('countAbout',['incrementOdd','incrementAsync'])
```

5.开启命名空间后，组件中调用 commit

方式一：直接 commit

```js
this.$store.commit("personAbout/ADD_PERSON", person);
```

方式二：借助 mapMutations

```js
...mapMutations('countAbout',['increment','decrement'])
```
