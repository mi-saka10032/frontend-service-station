---
title: Vue3+TS+Vite
order: 6
category: false
tag:
  - Vue3
  - TypeScript
  - Vite
  - 项目结构
  - 踩坑
---

## 创建项目

```shell
# npm 6.x
npm create vite@latest my-vue-app --template vue

# npm 7+, extra double-dash is needed:
npm create vite@latest my-vue-app -- --template vue

cd my-vue-app

npm install
npm run dev
```

### vite 配置

功能一致的配置大多跟 vue-cli 配置大同小异，不过多赘述

#### resolve

resolve.alias：当使用文件系统路径的别名时，请始终使用绝对路径。相对路径的别名值会原封不动地被使用，因此无法被正常解析。

```ts
/* vite.config.ts */
resolve: {
   //文件系统路径的别名, 绝对路径
   alias: {
     "@": path.resolve(__dirname, "src"),
   }
}
```

#### sass 配置

安装 sass 依赖和配置 vite.config.ts 预定义全局变量

```shell
npm i sass -D
```

```ts
/* vite.config.ts */
css: {
  preprocessorOptions: {
    scss: {
      additionalData: '@import "./src/assets/scss/var.scss";';
    }
  }
}
```

#### 开启服务

开启 http 服务

```ts
/* vite.config.ts */
server:{
    host: 'dev.front.cn',
    port: 3000
}
```

开启 https 服务

```ts
/* vite.config.ts */
let httpsConfig = {
  key: fs.readFileSync("C:/Users/ca/wps.cn/_wildcard.wps.cn+3-key.pem"),
  cert: fs.readFileSync("C:/Users/ca/wps.cn/_wildcard.wps.cn+3.pem")
};

server:{
    https: httpsConfig,
    host: 'dev.front.cn',
    port: 443,
    open: true
}
```

### 预构建依赖优化

默认情况下，Vite 会抓取你的 index.html 来检测需要预构建的依赖项。如果指定了 build.rollupOptions.input，Vite 将转而去抓取这些入口点。

#### optimizeDeps.include

默认情况下，不在 node_modules 中的，链接的包不会被预构建。使用此选项可强制预构建链接的包。

```ts
/* vite.config.ts */
optimizeDeps: {
  include: ['axios'],
},
```

#### optimizeDeps.exclude

在预构建中强制排除的依赖项。

### eslint 配置

- plugin:vue/vue3-recommended，plugin:vue/vue3-essential：识别 vue 的变量 如'Page'，选其一即可
- @vue/typescript/recommended：识别 ts 关键字，如 interface 等，该模块在 @vue/eslint-config-typescript 中
- prettier, @vue/prettier：格式化代码
- eslint-plugin-vue：允许 eslint 对 vue 文件进行校验

安装开发依赖

```shell
npm i -D eslint prettier @vue/eslint-config-typescript @vue/eslint-config-prettier eslint-plugin-vue
```

.eslintrc.cjs 如下

- 文件格式要改为 cjs，因为里面使用了 module.exports 的 CJS 语法，否则 eslint 无法识别项目中的 rc 文件
- 若要文件格式保留 js，则需要将 package.json 中的`"type": "module"`删除

```js
module.exports = {
  root: true,
  env: {
    node: true,
  },
  extends: [
    "plugin:vue/vue3-essential",
    "@vue/typescript/recommended",
    "prettier",
    "@vue/prettier",
  ],
  plugins: ["@typescript-eslint", "prettier"],
  parserOptions: {
    ecmaVersion: 2017,
  },
  rules: {
    "prettier/prettier": "error",
    "@typescript-eslint/no-unused-vars": ["error"],
  },
  globals: {
    defineProps: "readonly",
  },
};
```

注意事项：

- eslint:recommended 会误判一些 vue 的 ts 全局变量，如 withDefaults，defineEmits
- eslint 的 rules 配置 no-unused-vars 会误判一些变量，如 e，visible，所以需要 ts 变量配置 @typescript-eslint/no-unused-vars

## TypeScript

### 类型/接口/泛型

- 类型：类型（type）不是定义一个新类型，而是一个类型别名，使类型更具体化
- 接口：接口（interface）则是描述一个对象的形状，对值所具有的结构进行类型检查。接口的作用类似于抽象类，不同点在于接口中的所有方法和属性都是没有实值的，换句话说接口中的所有方法都是抽象方法。接口主要负责定义一个类的结构，接口可以去限制一个对象的接口，对象只有包含接口中定义的所有属性和方法时才能匹配接口。同时，可以让一个类去实现接口，实现接口时类中要保护接口中的所有属性。
- 泛型：支持多种数据结构，有函数泛型，类泛型，接口泛型等。
- **可以使用接口就尽量使用接口，因为接口更灵活，更容易处理**

很多时候 interface 和 type 是相同的，但有一个明显区别在于 interface 可以重复定义，类型注解会累加，而 type 重复定义会报错

### 类型声明

类型声明（Type Declaration） 或者类型定义（Type Definition） 文件是一个以.d.ts 作为文件后缀名的 TypeScript 文件。文件中只包含与类型相关的代码，不包含逻辑代码，它们的作用旨在为开发者提供类型信息，所以它们只在开发阶段起作用。

- typescript 编译后会将类型信息移除，类型信息仅在开发阶段起作用。

此处以全局类型/变量声明为例创建示例文件

先在项目 src 目录中新建 global.d.ts 文件

#### 全局类型声明

项目的根目录有 tsconfig.json 可以配置 TypeScript，include 属性包含了需要校验 ts 的文件。ts 默认会将 xx.d.ts 类型文件中的类型注册成全局的，下面举个栗子：

```ts
// global.d.ts
type T1 = number;
```

```vue
// 组件内
<script lang="ts">
let num1: T1 = 1;
</script>
```

#### 全局变量声明

- 使用 window

```ts
// global.d.ts
// 若想不带window使用userId，但需重复声明
declare let userId: string;

interface Window {
  userId: string;
}
```

注：不声明且不带 window 使用开发模式不会报错，但打包时会报错

```ts
// 组件内
window.userId = "1";
console.log(userId);
```

- 使用 global 配合 window 或 var，需加 export，否则会打包报错

```ts
// global.d.ts
export {};

declare global {
  interface Window {
    // 使用foo全局变量时得带window，否则打包会报错
    foo: string;
  }
  var age: number;
}
```

```ts
// 组件内
globalThis.age = 18;
window.foo = "1";
console.log(age, window.foo);
```

注：加上 export 后其他声明会失效，其他声明可另起 \*.d.ts 文件定义

- 使用 var

```ts
// global.d.ts
declare var age: number;
```

```ts
// 组件内
globalThis.age = 18;
console.log(age);
```

**每种方式各有利弊，自行选择**

## 语法糖

一个组件选项，在组件被创建之前，props  被解析之后执行。它是组合式 API 的入口。
`<script setup>`  是在单文件组件 (SFC) 中使用组合式 API  的编译时语法糖。相比于普通的  `<script>`  语法，它具有更多优势：

- 更少的样板内容，更简洁的代码。
- 能够使用纯 Typescript 声明 props 和抛出事件。
- 更好的运行时性能 (其模板会被编译成与其同一作用域的渲染函数，没有任何的中间代理)。
- 更好的 IDE 类型推断性能 (减少语言服务器从代码中抽离类型的工作)。

使用这个语法，需要将  setup attribute 添加到  `<script>`  代码块上：

```vue
<script setup lang="ts"></script>
```

里面的代码会被编译成组件 setup()  函数的内容，声明的变量、函数可以被 `<template>` 模板直接插值使用，无需 export 抛出。这意味着与普通的 `<script>`  只在组件被首次引入的时候执行一次不同，`<script setup>`  中的代码会在每次组件实例被创建的时候执行。

setup  函数在生命周期方面，它是在 beforeCreate  钩子之前调用的。

### 生命周期

选项式 API 的生命周期选项和组合式 API 之间的映射

- <del>beforeCreate</del> -> 使用  setup()
- <del>created</del> -> 使用  setup()
- beforeMount -> onBeforeMount
- mounted -> onMounted
- beforeUpdate -> onBeforeUpdate
- updated -> onUpdated
- beforeUnmount -> onBeforeUnmount
- unmounted -> onUnmounted
- errorCaptured -> onErrorCaptured
- renderTracked -> onRenderTracked
- renderTriggered -> onRenderTriggered
- activated -> onActivated
- deactivated -> onDeactivated

因为 setup 是围绕 beforeCreate 和 created 生命周期钩子运行的，所以不需要显式地定义它们。换句话说，在这些钩子中编写的任何代码都应该直接在 setup 函数中编写。

### 响应式 ref

接受一个内部值并返回一个响应式且可变的 ref 对象。ref 对象仅有一个  .value property，指向该内部值。和从  setup()  函数中返回值一样，ref 值在模板中使用的时候会自动解包。

可以在调用  ref  时传递一个泛型参数以覆盖默认推断

```ts
import { ref } from "vue";

let str = ref<string>("test");
```

指定复杂类型

```ts
const foo = ref<string | number>("foo"); // foo 的类型：Ref<string | number>

foo.value = 123; // ok!
```

### props/emit

- 仅限类型的 props/emit 声明

```ts
defineProps<{ title: string }>();

const emit = defineEmits<{
  (e: "change", id: number): void;
  (e: "update", value: string): void;
}>();
```

- props 有两种方式设置默认值：

  - 使用运行时声明

  运行时声明 的方式只能设置参数类型、默认值、是否必传、自定义验证。报错为控制台 warn 警告。 若想设置 `[ 编辑器报错、编辑器语法提示 ]`则需要使用类型声明的方式。

  - 使用类型声明时的默认 props 值

  仅限类型的 defineProps 声明的不足之处在于，它不能给 props 定义默认值。需配合 withDefaults 编译器宏解决：

```ts
interface Props {
  title?: string;
  msg?: string;
}

withDefaults(defineProps<Props>(), {
  title: "提示",
  msg: "是否跳转到app?",
});
```

defineProps、withDefaults 是只在 `<script setup>` 语法糖中才能使用的编译器宏。他不需要导入且会随着 `<script setup>` 处理过程一同被编译掉。

### v-model 双向绑定

vue2 中的 v-model 的使用是通过传递 value 属性和接收 input 事件实现，vue3 则换成了 modelValue 属性，接收的方法是 update:modelValue。

以下弹窗例子以 Page.vue 为父组件，Dialog.vue 为子组件，关键代码如下：

```vue
/* Page.vue */
<template>
  <Dialog v-model="dialogVisible"></Dialog>
  <div class="bottom-btn" @click="onTap">点击按钮</div>
</template>

<script setup lang="ts">
import { ref } from "vue";
import Dialog from "./Dialog.vue";

let dialogVisible = ref<boolean>(false);
function onTap() {
  dialogVisible.value = true;
}
<script>
```

```vue
/* Dialog.vue */
<template>
  <div class="dialog" v-show="modelValue">
      <span class="dialog-content-btn" @click="onConfirm">确定</span>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";

interface Props {
  modelValue?: boolean;
}
let props = withDefaults(defineProps<Props>(), {
  modelValue: false // v-model绑定的属性值
});

// 传递的方法
const emit = defineEmits<{
  (e: "update:modelValue", visible: boolean): boolean;
}>();

function onConfirm() {
    emit("update:modelValue", false);
}
<script>
```

## 可能遇到的报错/警告

### vite 打包 charset 警告

`"@charset" must be the first rule in the file }@charset "UTF-8";`

原因：使用了 scss 类库 sass，scss 编译的时候，因为被编译的文件里可能有中文导致

解决：在 vite.config.js 里面，加一个 sass 的配置，把 charset 关掉就行了

```ts
export default defineConfig({
  css: {
    preprocessorOptions: {
      scss: {
        charset: false,
      },
    },
  },
});
```

### 去除 Typescript 全局变量的 eslint 报错

1. 使用 var 定义全局变量

var 相关声明下会带下划线，并报错

`Unexpected var, use let or const instead.`

解决：在 .eslintrc 配置文件中增加规则

```
rules: {
    // 全局变量允许使用 var
    'no-var': 'off',
}
```

2. 使用 global 定义全局变量

global 相关声明下会带下划线，并报错

`Augmentations for the global scope can only be directly nested in external modules or ambient module declarations.`

解决：在 global.d.ts 声明文件中添加一行代码

```ts
// global.d.ts
export {}
```

注：新增后会导致该文件中的其他变量/类型等声明失效，其他声明可另起 *.d.ts 文件定义