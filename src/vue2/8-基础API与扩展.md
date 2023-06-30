---
title: 基础API与扩展
order: 8

tag:
  - 单文件渲染
  - ref
  - props
---

## ref

1.作用：用于给节点打标识

2.应用在 html 标签上获取的是真实 DOM 元素，应用在组件标签上是组件实例对象

3.读取方式：`this.$refs.xxxxxx`

4.读取时机，组件或 DOM 元素成功渲染挂载后，一般是在 mounted 或挂载成功后的触发事件中

```vue
<template>
  <div>Hello</div>
</template>

<script>
export default {
  methods: {
    sayHello() {
      console.log("Hello");
    },
  },
};
</script>
```

```vue
<template>
  <div>
    <div ref="div">Hello</div>
    <Hello ref="hello" />
  </div>
</template>

<script>
import Hello from "./Hello";

export default {
  components: { Hello },
  mounted() {
    console.log(this.$refs.div.innerText);
    // 可以调用组件内部的methods或data属性等
    this.$refs.hello.sayHello();
  },
};
</script>
```

## props

1.作用：用于父组件给子组件传递数据

2.读取方式一: 只指定名称`props: ['name', 'age', 'setName']`

3.读取方式二: 指定名称和类型

```js
props: {
	name: String,
	age: Number,
	setName: Function
}
```

4.读取方式三: 指定名称/类型/必要性/默认值

```js
props: {
	name: {type: String, required: true, default:xxx},
}
```

注意：接收到的 props 是不能被自身修改的。

## 混入

提供了一种非常灵活的方式，来分发 Vue 组件中的可复用功能。一个混入对象可以包含任意组件选项。当组件使用混入对象时，所有混入对象的选项将被“混合”进入该组件本身的选项。

局部混入：`mixins: [ 'xxx' ]`

全局混入：`Vue.mixin(xxx)`

```js
// mixin.js
export const mixin = {
  methods: {
    showName() {
      alert(this.name);
    },
  },
};
```

```vue
<!-- Main.vue -->
<template>
  <!-- 因为mixins已经混入了methods，此处可直接使用showName方法 -->
  <div @click="showName">{{ name }}</div>
</template>

<script>
import { mixin } from "./mixin.js";

export default {
  name: "Main",
  data: () => ({
    name: "mainName",
  }),
  mixins: [mixin],
};
</script>
```

## 插件

1.Vue 插件是一个包含 install 方法的对象

2.通过 install 方法给 Vue 或 Vue 实例添加方法, 定义全局指令等

本质：包含 install 方法的一个对象，install 的第一个参数是 Vue，第二个以后的参数是插件使用者传递的数据。

定义插件：

```js
export default {
  install(Vue) {
    // 全局过滤器
    Vue.filter('mySlice', function(value) {
      return value.slice(0, 4)
    })
  }

  // 定义全局指令
  Vue.directive('fbind', {
    // ...
  })

  // 定义混入
  Vue.mixin({
    // ...
  })

  // 给Vue原型上添加一个方法，vm和vc均可使用
  Vue.prototype.hello = () => { alert('Hello') }
}
```

使用插件，`Vue.use()`

## 插槽

### 作用

让父组件可以向子组件指定位置插入 html 结构，也是一种组件间通信方式，适用于 父组件 ===> 子组件

### 分类

默认插槽、具名插槽、作用域插槽。

### 使用方式

1.默认插槽

```vue
<!-- 父组件 -->
<template>
  <Category>
    <div>html1结构1</div>
  </Category>
</template>

<!-- 子组件 -->
<template>
  <div>
    <!-- 定义插槽 -->
    <slot>插槽默认内容...如果父组件中写入了默认插槽，此处内容会被覆写</slot>
  </div>
</template>
```

2.具名插槽

```vue
<!-- 父组件 -->
<template>
  <Category>
    <template slot="center">
      <div>html结构1</div>
    </template>
    <template v-slot:footer>
      <div>html结构2</div>
    </template>
  </Category>
</template>

<!-- 子组件 -->
<template>
  <div>
    <!-- 定义插槽 -->
    <slot name="center">插槽默认内容...</slot>
    <slot name="footer">插槽默认内容...</slot>
  </div>
</template>
```

3.作用域插槽

理解：数据在组件的自身，但根据数据生成的结构需要组件使用者来决定。（真正 data 数据在子组件中，但使用数据所遍历出来的结构由父组件决定）

```vue
<!-- 父组件 -->
<template>
  <Category>
    <template scope="scope">
      <ul>
        <li v-for="item in scope.games" :key="item">{{ item }}</li>
      </ul>
    </template>
  </Category>

  <Category>
    <template slot-scope="{ games }">
      <ul>
        <li v-for="item in games" :key="item">{{ item }}</li>
      </ul>
    </template>
  </Category>
</template>

<!-- 子组件 -->
<template>
  <div>
    <!-- 定义插槽 -->
    <slot :games="games"></slot>
  </div>
</template>

<script>
export default {
  data() {
    return {
      games: ["1", "2", "3", "4"],
    };
  },
};
</script>
```

## nextTick

nextTick 就是设置一个回调，用于异步执行。

就是把你设置的回调放在 setTimeout 中执行，这样就算异步了，等待当时同步代码执行完毕再执行。

```js
this.$nextTick((_) => {
  this.$refs.saveTagInput.$refs.input.focus();
});
```

当页面上的元素被重新渲染之后，才会执行指定回调函数中的代码。

**实现原理**

- 存在 回调数组 里。每次调用 nextTick，便往数组里面 push 设置的回调
- 只注册一个 setTimeout，时间为 0，用于遍历 回调数组，然后逐个执行子项
- 同步代码执行完毕，setTimeout 自然会执行
- Vue 不止使用 setTimeout 实现 nextTick；会判断 promise 是否存在，选择任务类型。如果 promise 存在，就使用微任务。

**注意：Vue 在一个 tick 中多次更新数据页面只会更新一次**

即使在 Vue 中多么频繁地修改数据，最后 Vue 页面只会更新一次。

例如：
数据 name 被 页面引用，name 会收集到 页面的 watcher；
name 被修改时，会通知所有收集到的 watcher 进行更新（watcher.update）；
如果 name 一时间被修改三次时，按道理应该会通知三次 watcher 更新，那么页面会更新三次，但是最后只会更新一次。
这是因为：
当数据变化后，把 watcher.update 函数存放进 nextTick 的 回调数组中，并且会做过滤。
通过 watcher.id 来判断 回调数组 中是否已经存在这个 watcher 的更新函数不存在，才 push。
之后 nextTick 时 遍历回调数组，便会执行了更新。

所以当三次修改数据的时候，会 push 回调数组 三个 watcher.update，但是只有第一次是 push 成功的，其他的会被过滤掉，因为已经存在了。
所以，不管你修改多少次数据，nextTick 的回调数组中只存在唯一一个 watcher.update，从而页面只会更新一次。

## 过渡与动画

### 过渡

作用：在插入、更新或移除DOM元素时，在合适的时候给元素添加样式类名。

![Vue过渡动画](https://misaka10032.oss-cn-chengdu.aliyuncs.com/Vue/image-20211022155520996.png)

元素进入样式：

- 起点：v-enter
- 过程：v-enter-active
- 终点：v-enter-to

元素离开样式：

- 起点：v-leave
- 过程：v-leave-active
- 终点：v-leave-to

### 包裹

使用`<transition>`包裹要过渡的元素，并配置name属性

appear属性：给元素添加初始过渡效果

```vue
<template>
<transition name='hello' appear>
	<h1 v-show="isTrue">test</h2>
</transition>
</template>

<script>
export default {
  data: () => ({
    isTrue: true
  })
}
</script>
```

若有多个元素需要过渡，则需要`<transition-group>`，且每个元素都要指定key值