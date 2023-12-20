---
title: 原子化CSS
order: 10

tag:
  - 现代化高阶CSS架构方案
  - AtomicCSS
---

本篇文稿主要节选自：

[重新构想原子化 CSS](https://antfu.me/posts/reimagine-atomic-css-zh)

[Facebook 重构：抛弃 Sass / Less ，迎接原子化 CSS 时代](https://juejin.cn/post/6917073600474415117)

[快速掌握 Tailwind](https://zhuanlan.zhihu.com/p/628433321)

[使用 Tailwind CSS 一年后，我的一些感受](https://juejin.cn/post/6951300894684577823)

**注意：原子化 CSS 方案是面向项目开发的架构方案，非 CSS 基础知识**

## 什么是原子化 CSS

原子化 CSS（Atomic CSS）是一种 CSS 架构方式，它倾向于小巧且用途单一的 class，并且会以视觉效果进行命名。

有些人可能会称其为函数式 CSS，或者 CSS 实用工具。本质上，你可以将原子化的 CSS 框架理解为这类 CSS 的统称：

```css
.m-0 {
  margin: 0;
}
.text-red {
  color: red;
}
/* ... */
```

## 发展历程

纵观 CSS 方案发展，大致分为三个阶段：

1. 原始方案
2. 传统预编译方案
3. 原子化方案

### 原始方案

原始阶段也就是 web 最早期的模样，HTML、CSS、JS 一把梭的刀耕火种阶段。现代项目开发已不再使用这种方案

```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Document</title>
    <style>
      .d1 {
        width: 200px;
        height: 200px;
        background-color: red;
      }
    </style>
  </head>
  <body>
    <div class="d1"></div>
  </body>
</html>
```

### 传统方案

传统的预编译方案，也就是使用预处理器来生成开发所需代码，这种方案至今在大多数项目中仍广泛使用

```less
.parent {
  width: 200px;
  height: 200px;

  .child {
    width: 100px;
    height: 100px;
  }
}
```

这就是一个典型的 「Semantic CSS」 命名方式：为不同的 html 标签定义语义化的 class 名字，然后每个 class 中包含应用到对应 html 标签上的所有 css 样式。

但是，随着项目的开发过程， 这种 css 规范会让 css 的维护成本越来越高：

1. 命名困难。越来越多的相似语义化场景，会导致越来越多类似 aa-title、bb-title、bb-b1-title、aa-content、bb-content 这样的 class 命名。开发人员一边需要保证 aa、bb、bb-b1 这样的名称能准确表达语义，一边需要小心翼翼地避免 css 全局作用域带来的冲突问题（例如，不同的 UI 区域都定义了 aa-title 导致的样式冲突；aa-content、 bb-content 无意识地嵌套使用，导致内层 class 继承了外层 class 预期之外的样式）。这给开发人员带来了很大的心智负担。
2. 难以复用。css 样式很难通过语义化命名的 class 进行复用，因为一个 class 中包含了多条 css 样式，而多条 css 样式即使在同一语义环境下，也会因受到更大的上下文的影响，导致部分样式的差异化而无法直接复用 class。例如，企图通过 title、header-title 这类 class 命名来实现 「标题」语义下的 css 复用肯定是行不通的。继续沿着这条路走下去，势必又会导致更多的类似名称的 class 的出现：nav-title、nav-min-title、sider-title ... 而这些 class 很可能只是其中一条 css 规则不同，例如 font-size。
3. 重构成本高。不一定是整体样式的大重构，即使是将所有字号增加 2px 这类需求，在「Semantic CSS」规范下，都需要修改大量文件才能实现。
4. css 文件大小膨胀。每个 class 都包含大量重复的 css 样式，无法解决复用性，这些问题都会导致随着项目需求的增加， css 文件变得越来越大，而且很可能 css 文件膨胀的速度是大于代码仓库整体体积的增长速度的。

### 原子化方案

使用实用工具/原子 CSS，我们可以把结构层和表示层结合起来:当我们需要改变按钮颜色时，我们直接修改 HTML，而不是 CSS。

```html
<div
  class="p-6 max-w-sm mx-auto bg-white rounded-xl shadow-md flex items-center space-x-4"
>
  <div class="flex-shrink-0">
    <img class="h-12 w-12" src="/img/logo.svg" alt="ChitChat Logo" />
  </div>
  <div>
    <div class="text-xl font-medium text-black">ChitChat</div>
    <p class="text-gray-500">You have a new message!</p>
  </div>
</div>
```

这个实现版本，对比上面的方案，有以下区别：

1. 我们没有自定义任何的 css class，使用的所有的 css class 都直接来源于 Tailwind CSS，这样就没有了命名的困扰问题，同时也解决了 css 膨胀的问题。当然 html 体积也变大了，但是因为 class 中使用的是有限集合内的、高度重复的 class 名称，在 Gzip、Brotli 这些压缩算法的作用下，是可以基本忽略的。
2. 每一个 class 一般只对应一条 css 规则，如 p-6 对应 padding: 1.5rem，h-12 对应 height: 3rem，原子性的 class 颗粒度自然更容易在其他地方复用，而且原子化的 css 规范/思想，强制开发人员在为 html 标签定义样式时，写全所有需要的 class ，大大减少了不同 html 标签的 class 之间的相互影响。
3. Atomic CSS 的使用，让样式重构/整体修改变得更加容易。我们可以通过覆盖原子颗粒度的 class ，变更应用的整体样式，例如，覆盖 text-xl 为 2rem，这样所以使用到 text-xl class 的字体大小都会变成 2rem。

此外，我们现在通过 html 标签来添加样式，发现了一些有趣的事儿：

- 我们增加新功能的时候，样式表的增长减缓了。
- 我们可以到处移动 html 标签，并且能确保样式也同样生效。
- 我们可以删除新特性，并且确保样式也同时被删掉了。

可以肯定的缺点是，html 有点臃肿。对于服务器渲染的 web 应用程序来说可能是个缺点，但是类名中的高冗余使得 css 得以集成，碎片化文件数量有效减少， gzip 可以压缩得很好。同时它可以很好地处理之前重复的 css 规则。

一旦你的实用工具/原子 CSS 准备好了，它将不会有太大的变化或增长。可以更有效地缓存它(你可以将它附加到 vendor.css 中，重新部署的时候它也不会失效)。它还具有相当好的可移植性，可以在任意其他应用程序中使用。

## 方案实现

TailwindCSS 堪称目前以 Atomic CSS 为基础的相对最完整的设计系统方案。

### 安装与配置

注意，tailwind 属于 postcss 插件，postcss 也是必要依赖项。

```bash
pnpm install postcss -D
pnpm install tailwindcss -D
// 压缩css代码用插件
pnpm install cssnano -D
```

编写 postcss 配置文件

```js
// postcss.config.js
module.exports = {
  plugins: {
    "postcss-import": {},
    "tailwindcss/nesting": {},
    tailwindcss: {},
    autoprefixer: {},
    ...(process.env.NODE_ENV === "production" ? { cssnano: {} } : {}),
  },
};
```

编写 tailwind 配置文件

```js
// tailwind.config.js
/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: "class",
  corePlugins: {
    preflight: false,
  },
  content: ["./index.html", "./src/**/*.{vue,js,ts,jsx,tsx}"],
  theme: {}, // 用于定制化主题与扩展class
};
```

导入入口样式

```ts
// main.ts
// 一定要在main.ts中导入tailwind.css，防止vite每次hmr都会请求src/style/index.scss整体css文件导致热更新慢的问题
import "./style/tailwind.css";
```

需要在入口样式文件加上这三行代码：

```css
// src/style/tailwind.css
@tailwind base;
@tailwind components;
@tailwind utilities;
```

接下来，你就可以使用 tailwind 来开发项目了

### 反对的声音

社区的反对声音也不少，这里节选两个比较有代表性的：

**一堆 class，可读性、可维护性差**

个人认为，这种把 css 放在 html 里的方式应该更高效才对，这种方式不仅能提高可读性，而且节省了发明自定义类名的时间。

这里顺便推荐下 VsCode 支持的插件 [Tailwind CSS IntelliSense](https://marketplace.visualstudio.com/items?itemName=bradlc.vscode-tailwindcss)，支持智能提示 tailwind 的样式命名，节省了翻阅文档的时间

**类型太长了而且重复多次**

tailwind 现在的版本 v3 早已提供了对自定义类名规则的预设，使用`@layer components`配合`@apply`实现，以我自己一个项目的 tailwind.css 文件为例

```css
// src/style/tailwind.css
@tailwind base;
@tailwind components;
@tailwind utilities;

@layer components {
  .flex-c {
    @apply flex justify-center items-center;
  }

  .flex-ac {
    @apply flex justify-around items-center;
  }

  .flex-bc {
    @apply flex justify-between items-center;
  }

  .navbar-bg-hover {
    @apply dark:text-white dark:hover:!bg-[#242424];
  }
}
```

```vue
<template>
  <div class="flex-c">
    <div class="navbar-bg-hover"></div>
  </div>
</template>
```

通过以上的自定义规则，可以轻松复用复数量级的样式属性

### 本质

tailwind 本质上就是个 postcss 插件。

postcss 是一个 css 编译器，它是 parse、transform、generate 的流程。

![CSS-AST](https://misaka10032.oss-cn-chengdu.aliyuncs.com/CSS/css-ast.png)

而 postcss 就是通过 AST 来拿到 @tailwind、@layer、@apply 这些它扩展的指令，分别作相应的处理，也就是对 AST 的增删改查。

所以说，tailwind 就是基于 postcss 的 AST 实现的 css 代码生成工具，并且做了通过 extractor 正则匹配 提取 js、html 中 class 的功能。

## JIT

在 tailwindCSS 的早期版本，tailwind 提供的 CSS 文件是包含所有完整预设命名规则的，没有做任何切割，因此早期的 tailwind 打包产物基本都是几 M 起步，对于中小型项目而言，反而增加了打包成本。

tailwind 在 v2.1 版本中引入了 Just-In-Time Mode，支持在构建过程中按需生成样式，而不是预先生成整个样式库。该模式在 v3.0 中成为默认模式。JIT 模式的引入极大地改善了开发体验和构建性能。

JIT 工作原理大致如下：

1. 按需生成：JIT 模式会监视你的项目文件（HTML、JSX、模板等），并且只为你实际使用的类生成对应的样式。这意味着最终的 CSS 文件只包含必要的样式，从而大幅减小了文件大小。
2. 快速构建：由于只生成必要的样式，构建过程变得更快。这对于开发过程中的热重载（hot-reloading）特别有益，因为它可以实现几乎实时的样式更新。
3. 动态样式：JIT 模式支持动态样式的生成，例如根据变量或状态生成的类名。这使得开发者可以在类名中使用任意值，例如 bg-[#1a1a1a] 或 text-[var(--main-color)]，而不需要在配置文件中预先定义。
4. 扩展性：JIT 模式使得扩展 Tailwind CSS 变得更加灵活，因为它可以在运行时生成新的实用工具类，而不需要重新编译整个样式库。
5. 更好的错误反馈：在 JIT 模式下，如果你使用了不存在的 Tailwind 类，你会在构建时得到更直接的反馈，而不是在浏览器中查看没有效果的样式。

因此，在 tailwindCSS v3 版本之后，我们无需再担忧最终打包 CSS 文件过大的问题了

## 后起之秀

### WindiCSS

WindiCSS 是另一款 tailwindCSS 的替代方案，它的零依赖，也不要求用户安装 PostCSS 和 Autoprefixer。更为重要的是，它同样支持 JIT 按需生成，并且算法更加高效，生成速度更快。

相对的，更快速度的代价则是 WindiCSS 的默认预设更加精简，也就是说我们或许需要针对自定义规则做出更多配置。

遗憾的是，截至 2023 年，WindiCSS 已经不再更新迭代，取而代之的替代方案则是 UnoCSS

### UnoCSS

在 WindiCSS 的基础上，他们的团队开发尝试了 UnoCSS，一款完全 AtomicCSS 的 CSS 引擎

简单来说，UnoCSS 是一个引擎，而非一款框架，因为它并未提供核心工具类，所有功能可以通过预设和内联配置提供，除了 plugin 插件能提供的默认配置以外，其他的无论是静态规则还是动态规则均可自行实现。

```js
import UnocssPlugin from "@unocss/vite";

// 以下预设目前还不存在，
// 欢迎大家踊跃贡献！
import PresetTachyons from "@unocss/preset-tachyons";
import PresetBootstrap from "@unocss/preset-bootstrap";
import PresetTailwind from "@unocss/preset-tailwind";
import PresetWindi from "@unocss/preset-windi";
import PresetAntfu from "@antfu/oh-my-cool-unocss-preset";

export default {
  plugins: [
    UnocssPlugin({
      presets: [
        // PresetTachyons,
        PresetBootstrap,
        // PresetTailwind,
        // PresetWindi,
        // PresetAntfu
        // 选择其中一个...或多个！
      ],
    }),
  ],
};
```

```js
rules: [["m-1", { margin: "0.25rem" }]];
```

检测结果：

```css
.m-1 {
  margin: 0.25rem;
}
```

```js
rules: [
  [/^m-(\d+)$/, ([, d]) => ({ margin: `${d / 4}rem` })],
  [/^p-(\d+)$/, (match) => ({ padding: `${match[1] / 4}rem` })],
];
```

检测结果：

```html
<div class="m-100">
  <button class="m-3">
    <icon class="p-5" />
    My Button
  </button>
</div>
```

```css
.m-100 {
  margin: 25rem;
}
.m-3 {
  margin: 0.75rem;
}
.p-5 {
  padding: 1.25rem;
}
```

得益于零框架和高度灵活性的优势，UnoCSS 的 HMR 速度和打包体积优势会更大，并且从内部实现上来看，Tailwind 依赖于 PostCSS 的 AST 进行修改，而 Windi 则是编写了一个自定义解析器和 AST。考虑到在开发过程中，这些工具 CSS 的并不经常变化，UnoCSS 通过非常高效的字符串拼接来直接生成对应的 CSS 而非引入整个编译过程。同时，UnoCSS 对类名和生成的 CSS 字符串进行了缓存，当再次遇到相同的实用工具类时，它可以绕过整个匹配和生成的过程。

### 简单总结

就个人使用体验而言：

- 如果你的项目是公司或部门研发的多人协作项目，要求遵守统一的 CSS 规则，并且需要一定的定制化自由度，那么我非常推荐使用 TailwindCSS，因为它提供了一整套完整的 CSS 设计系统，预设规则也非常完整，遵循开箱即用原则，仅需一定的文档阅读成本即可投入使用。
- 如果你正在开发属于个人的项目、项目体量并不大，同时追求极致的速度与高自由度，那么 UnoCSS 是不错的选择，你可以任意配置预设规则，同时享受更快的开发体验。相对的，因为它基本与Vite高度绑定，并且出现时间较晚，在投入中大型项目使用时需要慎重考虑。