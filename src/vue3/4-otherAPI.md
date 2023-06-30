---
title: 其他API
order: 4

tag:
  - 响应式数据转化
  - 其他API
---

## 响应式数据转化 API

### toRef

作用：创建一个 ref 对象，其 value 值指向另一个对象中的某个属性。

语法：`const name = toRef(person,'name')`

应用: 要将响应式对象中的某个属性单独提供给外部使用时。

toRefs 与 toRef 功能一致，但可以批量创建多个 ref 对象，语法：`toRefs(person)`

### shallowReactive 与 shallowRef

- shallowReactive：只处理对象最外层属性的响应式（浅响应式）。
- shallowRef：只处理基本数据类型的响应式, 不进行对象的响应式处理。
- 什么时候使用?
  - 如果有一个对象数据，结构比较深, 但变化时只是外层属性变化 ===> shallowReactive。
  - 如果有一个对象数据，后续功能不会修改该对象中的属性，而是生新的对象来替换 ===> shallowRef。

### readonly 与 shallowReadonly

- readonly: 让一个响应式数据变为只读的（深只读）。
- shallowReadonly：让一个响应式数据变为只读的（浅只读）。
- 应用场景: 不希望数据被修改时。

### toRaw 与 markRaw

- toRaw：
  - 作用：将一个由`reactive`生成的响应式对象转为普通对象。
  - 使用场景：用于读取响应式对象对应的普通对象，对这个普通对象的所有操作，不会引起页面更新。
- markRaw：
  - 作用：标记一个对象，使其永远不会再成为响应式对象。
  - 应用场景:
    1. 有些值不应被设置为响应式的，例如复杂的第三方类库等。
    2. 当渲染具有不可变数据源的大列表时，跳过响应式转换可以提高性能。

### customRef

作用：创建一个自定义的 ref，并对其依赖项跟踪和更新触发进行显式控制。

示例：创建一个实现了防抖效果的响应式数据

```vue
<template>
  <input type="text" v-model="keyword" />
  <h3>{{ keyword }}</h3>
</template>

<script>
import { ref, customRef } from "vue";
export default {
  name: "Demo",
  setup() {
    // let keyword = ref('hello') //使用Vue准备好的内置ref
    //自定义一个myRef
    function myRef(value, delay) {
      let timer;
      //通过customRef去实现自定义
      return customRef((track, trigger) => {
        return {
          get() {
            track(); //告诉Vue这个value值是需要被“追踪”的
            return value;
          },
          set(newValue) {
            clearTimeout(timer);
            timer = setTimeout(() => {
              value = newValue;
              trigger(); //告诉Vue去更新界面
            }, delay);
          },
        };
      });
    }
    let keyword = myRef("hello", 500); //使用程序员自定义的ref
    return {
      keyword,
    };
  },
};
</script>
```

### 响应式数据判断

- isRef: 检查一个值是否为一个 ref 对象
- isReactive: 检查一个对象是否是由 `reactive` 创建的响应式代理
- isReadonly: 检查一个对象是否是由 `readonly` 创建的只读代理
- isProxy: 检查一个对象是否是由 `reactive` 或者 `readonly` 方法创建的代理
- 以上返回值均为 boolean

## Other API

### provide 与 inject

- provide 和 inject 提供依赖注入，功能类似 2.x 的 provide/inject

示例：实现跨层级祖孙组件通信

```vue
<template>
  <h1>父组件</h1>
  <p>当前颜色: {{ color }}</p>
  <button @click="color = 'red'">红</button>
  <button @click="color = 'yellow'">黄</button>
  <button @click="color = 'blue'">蓝</button>

  <hr />
  <Son />
</template>

<script lang="ts">
import { provide, ref } from "vue";
/* 
- provide` 和 `inject` 提供依赖注入，功能类似 2.x 的 `provide/inject
- 实现跨层级组件(祖孙)间通信
*/

import Son from "./Son.vue";
export default {
  name: "ProvideInject",
  components: {
    Son,
  },
  setup() {
    const color = ref("red");

    provide("color", color);

    return {
      color,
    };
  },
};
</script>
```

```vue
<template>
  <div>
    <h2>子组件</h2>
    <hr />
    <GrandSon />
  </div>
</template>

<script lang="ts">
import GrandSon from "./GrandSon.vue";
export default {
  components: {
    GrandSon,
  },
};
</script>
```

```vue
<template>
  <h3 :style="{ color }">孙子组件: {{ color }}</h3>
</template>

<script lang="ts">
import { inject } from "vue";
export default {
  setup() {
    const color = inject("color");

    return {
      color,
    };
  },
};
</script>
```

### 全局 API 的转移

Vue2 有许多全局 API 和配置,例如：注册全局组件、注册全局指令等。

```js
//注册全局组件
Vue.component('MyButton', {
  data: () => ({
    count: 0
  }),
  template: '<button @click="count++">Clicked {{ count }} times.</button>'
})

//注册全局指令
Vue.directive('focus', {
  inserted: el => el.focus()
}
```

Vue3 对这些 API 做出了调整：

将全局的 API，即：`Vue.xxx`调整到应用实例（`app`）上

| 2.x 全局 API（`Vue`）    | 3.x 实例 API (`app`)        |
| ------------------------ | --------------------------- |
| Vue.config.xxxx          | app.config.xxxx             |
| Vue.config.productionTip | **移除**                    |
| Vue.component            | app.component               |
| Vue.directive            | app.directive               |
| Vue.mixin                | app.mixin                   |
| Vue.use                  | app.use                     |
| Vue.prototype            | app.config.globalProperties |

### 过渡类名更改

Vue2 写法

```css
.v-enter,
.v-leave-to {
  opacity: 0;
}

.v-leave,
.v-enter-to {
  opacity: 1;
}
```

Vue3 写法

```css
.v-enter-from,
.v-leave-to {
  opacity: 0;
}

.v-leave-from,
.v-enter-to {
  opacity: 1;
}
```

### 事件处理

- 移除 **keyCode** 作为 v-on 的修饰符，同时也不再支持 config.keyCodes

- 移除 v-on.native 修饰符

- emits 声明

```vue
<!-- 父组件 -->
<my-component @close="handleComponentEvent" @click="handleNativeClickEvent" />
```

```vue
<!-- 子组件中需要声明emits事件之后才能在setup中使用 -->
<script>
export default {
  emits: ["close"],
};
</script>
```

### 移除过滤器

过滤器虽然这看起来很方便，但它需要一个自定义语法，打破大括号内表达式是 “只是 JavaScript” 的假设，这不仅有学习成本，而且有实现成本！建议用方法调用或计算属性去替换过滤器。
