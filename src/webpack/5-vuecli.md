---
title: VueCli
order: 5
category: false
tag:
  - VueCli
  - 结构分析
  - 运行机制
---

CLI：Command-Line Interface，命令行界面，俗称脚手架

VueCli 是一个官方发布的 Vue 项目脚手架

使用 VueCli 可以快速搭建 Vue 开发环境以及对应的 webpack 配置

## 安装与创建

### 安装包

默认情况下自动安装 Node 和 NPM Node 环境要求 8.9 以上或者更高版本

最新的 VueCli5 已经将底层 webpack 版本升到了 v5，现在市场上主流的版本 v4 和 v5 都有

最重要的一点：弃用了非常坑爹的 node-sass

::: code-tabs#shell

@tab npm

```sh
npm i -g @vue-cli
```

@tab yarn

```sh
yarn i -g @vue-cli
```

@tab pnpm

```sh
pnpm i -g @vue-cli
```

:::

### 创建新项目

```sh
vue create <app-name>
```

Enter 后，根据自己的实际情况动态选择所需的技术栈

![VueCliOption](https://misaka10032.oss-cn-chengdu.aliyuncs.com/Webpack/vue-cli.png)

## 目录结构

![VueCliStructure](https://misaka10032.oss-cn-chengdu.aliyuncs.com/Webpack/vue-cli-structure.png)

注意区分 public 文件夹和 src 文件夹：

src 文件夹：代码编译时的根目录，编写业务代码的根路径，在其他地方禁止编写业务代码

public 文件夹：可以理解为代码运行时的根目录（只是理解，真正打包后会新增打包内容），一般只有一些需要**页面加载完成**后才能继续加载的内容如图片、css 文件、js 文件才会放到这里，否则禁止在这里存放文件，静态文件大多数情况会存放在 src 文件夹下的 assets 目录下，VueCli 打包时会帮我们自动打包并压缩静态文件

src 存放的是项目业务代码的目录

main.js：项目的入口文件，需要页面加载前执行的功能文件都需要引入在这

App.vue：项目的入口组件，也称为根组件，是组件树的最顶层组件

components：存放公共组件

assets：存放静态资源，如图片、css、公共 js、json 等

view：页面组件目录，项目需求拆分页面后在这里编写页面代码

vue.config.js：VueCli 的打包配置文件，很重要，涉及开发优化和打包优化

其他在项目根目录下的基本都是不同依赖的配置文件（ESLint、jest、babel、postCSS 等）

## 静态资源

### public/index.html

`public/index.html`：这个目录下的文件是会被`html-webpack-plugin`处理的模板，在开发或生产构建中，所有相关的 css、js、其他图片等资源都会自动注入到这里，展示出页面

#### 插值

这里的插值语法可以参考[EJS](https://ejs.bootcss.com/)

- `<%= VALUE %>`：做不转义插值，VALUE 是多少这里就插多少
- `<%- VALUE %>`：做 HTML 转义插值，最终是 html 元素
- `<%= expression %>`：描述 JS 流程控制，expression 里面可以是代码块或表达式

下面是使用了[环境变量](#环境变量)的插值语句判断表达式

```env
NODE_ENV='development'

VUE_APP_MAIN_PAGE='http://dev.xxx.com'
```

```env
NODE_ENV='production'

VUE_APP_MAIN_PAGE='https://www.xxx.com'
```

```html
<body>
  <div id="app"></div>
  <% if(NODE_ENV === "production") {%>
  <script src="xxx.min.js"></script>
  <% } else if(NODE_ENV === 'development') { %>
  <script src="xxx.js"></script>
  <% } %>
</body>
```

这里表示，当前环境处于生产环境时，引入`xxx.min.js`文件，而处于开发环境时，引入`xxx.js`文件，不同环境不同的 cdn 文件引入

#### preload

`<link rel="preload">` 是一种 resource hint，用来指定页面加载后很快会被用到的资源，所以在页面加载的过程中，我们希望在浏览器开始主体渲染之前尽早 preload。

默认情况下，一个 VueCli 应用会为所有初始化渲染需要的文件自动生成 preload 提示。

#### prefetch

<link rel="prefetch"> 是一种 resource hint，用来告诉浏览器在页面加载完成后，利用空闲时间提前获取用户未来可能会访问的内容。

默认情况下，一个 VueCli 应用会为所有作为 async chunk 生成的 JavaScript 文件 (通过动态 import) 自动生成 prefetch 提示。

### 静态资源路径

- 如果 URL 是一个绝对路径 (例如 /images/foo.png)，它将会被保留不变。
- 如果 URL 以 `.` 开头，它会作为一个相对模块请求被解释且基于你的文件系统中的目录结构进行解析。
- 如果 URL 以 `~` 开头，其后的任何内容都会作为一个模块请求被解析。这意味着你甚至可以引用 Node 模块中的资源：

```html
<img src="~some-npm-package/foo.png" />
```

- 如果 URL 以 `@` 开头，它也会作为一个模块请求被解析。它的用处在于 Vue CLI 默认会设置一个指向 `项目根目录/src` 的别名 @。(仅作用于模版中)

### 还是那个 public

现在继续来谈 public 文件夹

上面已经提到了，可以将 public 文件夹理解成运行时环境。其实是因为 public 文件夹中的全部资源都会直接复制到最终打包产物中，不经过 webpack，所以`public/index.html`的相对位置其实就跟打包后 index.html 的相对位置基本没有区别了

注意：public 目录提供的是一种应急手段，使用 public 文件夹的场景如下：

- 你需要在打包产物中指定一个文件的名字时
- 你又上千张图片、需要动态引用它们的路径
- 部分需要在页面运行时加载的库，如一些 UI 库的国际化、CSS 文件，需要放在 public 中等待运行后读取

## css 相关

### 自动导入

VueCli 自动支持各种预编译 CSS 语言，安装即用

```sh
# Sass
npm install -D sass-loader sass

# Less
npm install -D less-loader less

# Stylus
npm install -D stylus-loader stylus
```

比如安装好 sass-loader 后，就可以在 vue 文件中这样写：

```vue
<style lang="scss">
$color: red;
</style>
```

### PostCSS

你可以通过 .postcssrc 或任何[postcss-load-config](https://github.com/postcss/postcss-load-config)支持的配置源来配置 PostCSS。也可以通过 vue.config.js 中的 css.loaderOptions.postcss 配置 postcss-loader。

PostCSS 主要作用是：在项目编译时提前对 CSS 做预处理，最常见的是将全部的固定 px 转化为动态的 rem，实现响应式布局

### Modules

VueCli 支持在 vue 或 js 文件中以变量形式引入`xxx.module.css`文件

```vue
import styles from "./foo.module.css"; // 所有支持的预处理器都一样工作 import
sassStyles from "./foo.module.scss";
<script>
export default {
  computed: {
    localClass() {
      return {
        className: styles.foo,
      };
    },
  },
};
</script>
```

如果你想去掉文件名中的 .module，可以设置 vue.config.js 中的 css.requireModuleExtension 为 false：

```js
// vue.config.js
module.exports = {
  css: {
    requireModuleExtension: false,
  },
};
```

### 全局变量

通过在 vue.config.js 中的 css.loaderOptions 选项中导入 sass 文件的变量，我们能够在所有 sass 样式，包括`<style lang="sass">`的 vue 文件中注入共享的全局变量

```js
// vue.config.js
module.exports = {
  css: {
    loaderOptions: {
      // 给 sass-loader 传递选项
      sass: {
        // @/ 是 src/ 的别名
        // 所以这里假设你有 `src/variables.sass` 这个文件
        // 注意：在 sass-loader v8 中，这个选项名是 "prependData"
        additionalData: `@import "~@/variables.sass"`,
      },
      // 默认情况下 `sass` 选项会同时对 `sass` 和 `scss` 语法同时生效
      // 因为 `scss` 语法在内部也是由 sass-loader 处理的
      // 但是在配置 `prependData` 选项的时候
      // `scss` 语法会要求语句结尾必须有分号，`sass` 则要求必须没有分号
      // 在这种情况下，我们可以使用 `scss` 选项，对 `scss` 语法进行单独配置
      scss: {
        additionalData: `@import "~@/variables.scss";`,
      },
      // 给 less-loader 传递 Less.js 相关选项
      less: {
        // http://lesscss.org/usage/#less-options-strict-units `Global Variables`
        // `primary` is global variables fields name
        globalVars: {
          primary: "#fff",
        },
      },
    },
  },
};
```

## 模式和环境变量

### 模式

模式是 VueCli 项目中的重要概念，VueCli 默认有三个模式

- development：开发模式，用于启动服务`vue-cli-service serve`
- test：测试模式，用于单元测试`vue-cli-service test:unit`
- production：生产模式，用于项目打包`vue-cli-service build`

你可以在 package.json 文件中的 scripts 字段内覆写命令行执行时的模式，比如，在生产打包时使用开发模式（实际开发中我们一般并不这样做）

```json
{
  "scripts": {
    "build": "vue-cli-service build --mode development"
  }
}
```

运行`vue-cli-service`命令时，所有环境变量都从对应的环境文件中载入，如果文件内部不包含 NODE_ENV 变量，它的值就是模式的值（这里就是 development）

`NODE_ENV=development`创建的产物，会默认自用[热更新 HMR](./senior.html#模块热替换与热加载)，并且不会对资源进行 hash 也不会打出`vendor bundles`，目的是为了加快开发的构建速度

`NODE_ENV=production`创建的产物，会执行 VueCli 默认的打包优化，对资源进行压缩，同时 Vue 将启用生产环境文件，控制台将不会出现 Vue 的警告和提示

当然，为了配合实际项目的具体情况，你也可以命名其他的模式，比如这里会针对开发、测试、生产三台服务器执行三种不同模式的打包

```json
{
  "scripts": {
    "build:dev": "vue-cli-service build --mode development",
    "build:release": "vue-cli-service build --mode release",
    "build:prod": "vue-cli-service build --mode production"
  }
}
```

### 环境变量

你可以在你的项目根目录中放置下列文件来指定环境变量：

```sh
.env                # 在所有的环境中被载入
.env.local          # 在所有的环境中被载入，但会被 git 忽略
.env.[mode]         # 只在指定的模式中被载入
.env.[mode].local   # 只在指定的模式中被载入，但会被 git 忽略
```

一个环境文件只包含环境变量的“键=值”对

```env
FOO=bar
VUE_APP_NOT_SECRET_CODE=some_value
```

**注意：不要在你的应用程序中存储任何机密信息（例如私有 API 密钥）！**

请注意，只有 `NODE_ENV`，`BASE_URL` 和以 `VUE_APP_` 开头的变量将通过 webpack.DefinePlugin 静态地嵌入到客户端侧的代码中。这是为了避免意外公开机器上可能具有相同名称的私钥

VueCli 底层参考[dotenv](https://github.com/motdotla/dotenv-expand)实现的变量扩展

在客户端使用环境变量时，需要以`process.env.XXX`来编写

下面是一个环境变量在代码中的使用案例

::: code-tabs#shell

@tab development

```env
VUE_APP_BASE_API='/dev-api'
```

@tab staging

```env
VUE_APP_BASE_API='/test-api'
```

@tab production

```env
VUE_APP_BASE_API='/api'
```

:::

```vue
<script>
export default {
  methods: {
    // 返回一个可预览图片的url路径
    previewImage(suffix) {
      // 不同的环境下会以不同的api前缀返回路径，以确保不同环境的路径正确性
      return process.env.VUE_APP_BASE_API + "/" + suffix;
    },
  },
};
</script>
```

## 构建优化

VueCli 提供了[chainWebpack](https://cli.vuejs.org/zh/guide/webpack.html#%E9%93%BE%E5%BC%8F%E6%93%8D%E4%BD%9C-%E9%AB%98%E7%BA%A7)来增强甚至覆盖底层 Webpack 的功能

当然一些常规配置能直接在[configureWebpack](https://cli.vuejs.org/zh/guide/webpack.html)上进行操作

### 本地开发取消按需加载

本地开发并不需要按需加载，可以加入`dynamic-import-node`将全部文件合并为一个大的 bundle 文件，加快本地开发速度

### 删除调试代码

一般我们在生产环境中需要删除`console.log`和`debugger`的代码，通过下面的配置来执行

```js
// vue.config.js
module.exports = {
  // ...
  chainWebpack: (config) => {
    config.when(process.env.NODE_ENV === "production", (config) => {
      // drop console & debugger
      config.optimization.minimizer("terser").tap((args) => {
        args[0].parallel = 4;
        args[0].terserOptions.compress.warnings = true;
        args[0].terserOptions.compress.drop_debugger = true;
        args[0].terserOptions.compress.drop_console = true;
        return args;
      });
    });
  };
}
```

### 启用 gzip 压缩

使用 gzip 的压缩效果非常显著，能大幅提升客户端浏览器与服务器之间的传输效率。如果我们前端已经使用了 gzip 压缩，服务端就能直接使用压缩好的代码传输给客户端，使得网络压力更小

```js
// vue.config.js
const CompressionWebpackPlugin = require("compression-webpack-plugin");
module.exports = {
  // ...
  configureWebpack: {
    plugins: [
      new CompressionWebpackPlugin({
        filename: "[path].gz[query]",
        algorithm: "gzip",
        test: productionGzipExtensions,
        threshold: 10240,
        minRatio: 0.8,
        deleteOriginalAssets: false, // 是否删除原始文件
      }),
    ],
  },
};
```

### 代码分割

UI 库、大型库、引入次数很多的库，按需打包（Tree-shaking）非常困难，并且这些第三方库往往都是不变的代码，单独分割出来让浏览器并行加载，能提升加载速度

```js
// vue.config.js
module.exports = {
  // ...

  chainWebpack: (config) => {
    config.when(
      process.env.NODE_ENV === "production", // 配置生产环境生效
      (config) => {
        config.optimization.splitChunks({
          chunks: "all", // 将对什么类型的代码进行分割，三种值：all: 全部 ｜ async: 异步，按需加载的代码 ｜ initial: 入口代码块
          cacheGroups: {
            // 缓存组
            // 项目使用 element-ui 组件开发的，定义 element-ui 缓存组，用于分割 element-ui 代码
            elementUI: {
              name: "chunk-elementUI",
              priority: 20, // 优先级 20，命中 element-ui 代码时，优先分割到此组里
              test: /[\\/]node_modules[\\/]_?element-ui(.*)/, // 匹配 element-ui 代码
            },
            // 定义 libs 缓存组，分割从 node_modules 中引入的代码
            libs: {
              name: "chunk-libs", // 分割成的文件名
              test: /[\\/]node_modules[\\/]/, // 匹配 node_modules 中模块
              priority: 10, // 优先级，当模块同时命中多个缓存组的规则时，分配到优先级高的缓存组
              chunks: "initial", // 这里覆盖上面的 chunks: 'all'，仅打包最初依赖的第三方库
            },
          },
        });
      }
    );
  },

  // ...
};
```

### 配置 CDN

一般这个功能，仅适用于公司有自己的 cdn 库，否则使用第三方的 cdn 稳定性很难保证

```js
// vue.config.js
const buildEnv = process.env.VUE_APP_BUILD_ENV
const cdn = {
  js: [
    `${buildEnv}/publicPath/vue.min.js`,
    `${buildEnv}/publicPath/element-ui.js`,
    `${buildEnv}/publicPath/tinymce.min.js`,
    `${buildEnv}/publicPath/echarts.min.js`
  ]
}

module.exports = {
  // ...
  chainWebpack: (config) => {
    config.when(process.env.NODE_ENV === "production", (config) => {
      config.set('externals', {
          // 将Vue、ElementUI、tinyMce、Echarts全部从本地打包产物中移除
          'vue': 'Vue',
          'element-ui': 'ELEMENT',
          'tinymce/tinymce': 'tinymce'
          'echarts': 'echarts'
        })
        config.plugin('html').tap(args => {
          args[0].cdn = cdn
          return args
        })
    });
  };
}
```
