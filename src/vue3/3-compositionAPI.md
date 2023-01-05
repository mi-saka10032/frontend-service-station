---
title: 组合式API
order: 3
category: false
tag:
  - 组合式API
  - 响应式原理
---

## Composition API（组合式 API）

### setup

Vue3.0 中一个新的配置项，值为一个函数。

setup 是所有 Composition API（组合 API）“表演的舞台”

组件中所用到的：数据、方法等等，均要配置在 setup 中。

setup 函数的两种返回值：

1. 若返回一个对象，则对象中的属性、方法, 在模板中均可以直接使用。（重点关注）
2. 若返回一个渲染函数：则可以自定义渲染内容。（了解）

```vue
<script>
export default {
  setup() {
    const name = "1";
    const age = 18;
    const sayHello = () => {
      console.log("Hello");
    };

    return {
      name,
      age,
      sayHello,
    };

    // 返回一个函数（渲染函数）
    // return () => h('h1', 'Hello你好')
  },
};
</script>
```

注意点：

1. 尽量不要与 Vue2.x 配置混用

Vue2.x 配置（data、methods、computed）可以访问到 setup 中的属性或方法，但在 setup 中不能访问到 Vue2.x 的配置。如果两者配置重名，以 setup 优先。

2. setup 不能是一个 async 函数，因为返回值不再是 return 的对象, 而是 promise, 模板看不到 return 对象中的属性。（后期也可以返回一个 Promise 实例，但需要 Suspense 和异步组件的配合）

### setup 执行时机

在 beforeCreate 之前执行一次，this 是 undefined

setup 的参数：

- props：值为对象，包含组件外部传递进来，且组件内部声明接收了的属性
- context：上下文对象，包含属性
  - attrs：值为对象，包含组件外部传递过来，但没有在 props 配置中声明的属性，相当于`this.$attrs`
  - slots：收到的插槽内容，相当于`this.$slots`
  - emit：分发自定义事件的函数，相当于`this.$emit`

### ref 函数

作用：定义一个响应式数据

语法：`const xx = ref(initValue)`

- 创建一个包含响应式数据的引用对象（reference 对象，简称 ref 对象）
- 在 js 中操作数据：`xx.value = xxxxx`
- 模板中读取数据：不需要`.value`，直接写入插值语句`<div>{{ xx }}</div>`
- 接收的数据可以是基本类型，也可以是对象类型（最好是基本类型）
- 基本类型的数据：响应式依然是靠`Object.defineProperty()`的 get 与 set 完成的
- 对象类型的数据：内部借助 Vue3 的 reactive 函数

### reactive 函数

作用：定义一个对象类型的响应式数据（基本类型只使用 ref 函数）

语法：`const obj = reactive({ name: '123' })`

- 接收一个对象（或数组》，返回一个代理对象（Proxy 的实例对象，简称 proxy 对象）
- reactive 定义的响应式数据是深层次的
- 内部基于 ES6 的 Proxy 实现，通过代理对象操作源对象内部数据进行操作

### 计算与监视属性

#### computed

与 Vue2.x 中 computed 配置功能一致

```js
import {computed} from 'vue'

export default {
  setup(){
      ...
  	//计算属性——简写
      let fullName = computed(()=>{
          return person.firstName + '-' + person.lastName
      })
      //计算属性——完整
      let fullName = computed({
          get(){
              return person.firstName + '-' + person.lastName
          },
          set(value){
              const nameArr = value.split('-')
              person.firstName = nameArr[0]
              person.lastName = nameArr[1]
          }
      })
  }
}
```

#### watch

与 Vue2.x 中 watch 配置功能一致

```js
//情况一：监视ref定义的响应式数据
watch(
  sum,
  (newValue, oldValue) => {
    console.log("sum变化了", newValue, oldValue);
  },
  { immediate: true }
);

//情况二：监视多个ref定义的响应式数据
watch([sum, msg], (newValue, oldValue) => {
  console.log("sum或msg变化了", newValue, oldValue);
});

/* 情况三：监视reactive定义的响应式数据
  			若watch监视的是reactive定义的响应式数据，则无法正确获得oldValue！！
  			若watch监视的是reactive定义的响应式数据，则强制开启了深度监视 
  */
watch(
  person,
  (newValue, oldValue) => {
    console.log("person变化了", newValue, oldValue);
  },
  { immediate: true, deep: false }
); //此处的deep配置不再奏效

//情况四：监视reactive定义的响应式数据中的某个属性
watch(
  () => person.job,
  (newValue, oldValue) => {
    console.log("person的job变化了", newValue, oldValue);
  },
  { immediate: true, deep: true }
);

//情况五：监视reactive定义的响应式数据中的某些属性
watch(
  [() => person.job, () => person.name],
  (newValue, oldValue) => {
    console.log("person的job变化了", newValue, oldValue);
  },
  { immediate: true, deep: true }
);

//特殊情况
watch(
  () => person.job,
  (newValue, oldValue) => {
    console.log("person的job变化了", newValue, oldValue);
  },
  { deep: true }
); //此处由于监视的是reactive素定义的对象中的某个属性，所以deep配置有效
```

#### watchEffect

watch 既要指明监视的属性，也要指明监视的回调。

watchEffect 不用指明监视哪个属性，监视的回调中用到哪个属性，就监视哪个属性。

watchEffect 有点像 computed：

- 但 computed 注重计算出来的值（回调函数的返回值），所以必须要谢返回值
- 而 watchEffect 更注重过程（回调函数的函数体），所以不用写返回值

```js
//watchEffect所指定的回调中用到的数据只要发生变化，则直接重新执行回调。
watchEffect(() => {
  const x1 = sum.value;
  const x2 = person.age;
  console.log("watchEffect配置的回调执行了");
});
```

### 生命周期

以下是 vue3 的生命周期图示

![Vue3生命周期](https://misaka10032.oss-cn-chengdu.aliyuncs.com/Vue3/lifecycle.16e4c08e.png)

Vue3 中可以继续使用 Vue2 的生命周期钩子，但有两个更名：

`beforeDestroy`改名为 `beforeUnmount`

`destroyed`改名为 `unmounted`

Vue3 也提供了 Composition API 形式的生命周期钩子，与 Vue2 中钩子对应关系如下

- `beforeCreate`===>`setup()`
- `created`=======>`setup()`
- `beforeMount` ===>`onBeforeMount`
- `mounted`=======>`onMounted`
- `beforeUpdate`===>`onBeforeUpdate`
- `updated` =======>`onUpdated`
- `beforeUnmount` ==>`onBeforeUnmount`
- `unmounted` =====>`onUnmounted`

### 自定义 hook 函数

什么是 hook？—— 本质是一个函数，把 setup 函数中使用的 Composition API 进行了封装。

类似于 vue2.x 中的 mixin。

自定义 hook 的优势: 复用代码, 让 setup 中的逻辑更清楚易懂。

以下是一个暴露响应式宽高数据和获取窗口宽高方法的 hooks 函数

```js
import { reactive } from "vue";

export default function () {
  // 导出一个默认方法

  // 创建一个对象，保存宽度和高度值
  const screen = reactive({
    width: 0,
    height: 0,
  });

  // 创建一个方法，获取可视化界面的宽度和高度值
  const getWH = () => {
    screen.width = document.documentElement.clientWidth;
    screen.height = document.documentElement.clientHeight;
  };

  return { screen, getWH }; // 方法返回宽高值
}
```

### 组合式 API 的优势

#### Options API 存在的问题

使用传统 OptionsAPI 中，新增或者修改一个需求，就需要分别在 data，methods，computed 里修改。

![OptionsAPI](https://misaka10032.oss-cn-chengdu.aliyuncs.com/Vue3/optionsAPI.image)

#### Composition API 的优势

我们可以更加优雅的组织我们的代码，函数。让相关功能的代码更加有序的组织在一起。

![CompositionAPI](https://misaka10032.oss-cn-chengdu.aliyuncs.com/Vue3/compositionAPI.image)

## 响应式原理

### Vue2 响应式

实现原理：

- 对象类型：通过`Object.defineProperty()`对属性的读取、修改进行拦截（数据劫持）
- 数组类型：通过重写更新数组的一系列方法实现拦截（对数组的变更方法进行了包裹）
- 存在问题：新增属性、删除属性，界面不更新；直接通过下标修改数组，界面不更新

```js
Object.defineProperty(data, "count", {
  get() {},
  set() {},
});
```

### Vue3 响应式

实现原理：

- 通过 Proxy 代理：拦截对象中任意属性的变化，包括：属性值的读写、属性的添加、属性的删除等。
- 通过 Reflect 反射：对源对象的属性进行操作。
- MDN 文档中描述的 Proxy 和 Reflect：
- Proxy：https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Proxy
- Reflect：https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Reflect

```js
new Proxy(data, {
  // 拦截读取属性值
  get(target, prop) {
    return Reflect.get(target, prop);
  },
  // 拦截设置属性值或添加新属性
  set(target, prop, value) {
    return Reflect.set(target, prop, value);
  },
  // 拦截删除属性
  deleteProperty(target, prop) {
    return Reflect.deleteProperty(target, prop);
  },
});

proxy.name = "tom";
```

### ref 与 reactive 对比

- 从定义数据角度对比：

ref 用来定义基本类型数据

reactive 定义复杂类型数据

注：ref 也可定义复杂类型，它内部实际上自动通过 reactive 转为代理对象

- 从原理角度对比：

ref 通过`Object.defineProperty()`实现响应式（数据劫持）

reactive 通过使用 Proxy 实现响应式（数据代理），并通过 Reflect 操作原对象内部数据

- 从使用角度对比：

ref 定义的数据：操作数据需要`.value`去读写数据，模板读取时直接读取，不需要`.value`

reactive 定义的数据：操作数据与模板读取数据均不需要`.value`
