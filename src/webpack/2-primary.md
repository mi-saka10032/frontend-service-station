---
title: webpack基础配置
order: 2
category: false
tag:
  - Webpack
  - 基础配置
---

## 开发准备

### 安装

```shell
npm install webpack webpack-cli -D
```

### 运行

```shell
# webpack详细打包信息
webpack --stats detailed
```

需要全局安装 webpack 使用，没有全局 webpack 时，使用`npx webpack`来执行

## 自定义配置

自定义配置文件名：`webpack.config.js`

![Webpack](https://misaka10032.oss-cn-chengdu.aliyuncs.com/Webpack/image-20220205193912353.png)

打包入口：entry

打包出口：output

打包模式：mode

插件：plugins

加载器：loader

注意：output 输出路径必须是绝对路径

```js
module.exports = {
  entry: "./src/index.js",

  output: {
    filename: "bundle.js",
    path: path.resolve(__dirname, "./dist"),
    clean: true, // 每次打包前清除dist内残留文件
  },

  mode: "none",
};
```

## plugins 插件

插件作为 webpack 核心功能之一，为 webpack 拓展各种各样不同的功能。

以 html-webpack-plugin 为例，该插件实现 webpack 的打包结果生成一个 html 文件到指定位置，用于静态服务器部署访问。

```
npm install html-webpack-plugin -D
```

```js
plugins: [
  new HtmlWebpackPlugin({
    template: "./index.html",
    filename: "app.html",
    inject: "body",
  }),
];
```

## mode 选项

### development

```js
mode: 'development',
```

### 使用 source map 定位错误的准确位置

```js
devtool: "inline-source-map";
```

### 使用 watch 实时打包最新修改的文件

控制台输出：

```shell
npx webpack --watch
```

### webpack-dev-server

开发模式静态打包目录

```js
devServer: {
  static: "./dist";
}
```

控制台输出

```shell
npm install webpack-dev-server -D
```

## 阶段性配置代码

```js
const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");

module.exports = {
  entry: "./src/index.js",

  output: {
    filename: "bundle.js",
    path: path.resolve(__dirname, "./dist"),
    clean: true,
  },

  mode: "development",

  devtool: "inline-source-map",

  plugins: [
    new HtmlWebpackPlugin({
      template: "./index.html",
      inject: "body",
    }),
  ],

  devServer: {
    static: "./dist",
  },
};
```

## 资源模块

### resource

配置图片资源的引入、打包、路径控制

```js
output: {
        filename: "bundle.js",
        path: path.resolve(__dirname, './dist'),
        clean: true,
        assetModuleFilename: "images/[contenthash][ext]"
}

module: {
    rules: [
        {
            test: /\.png$/,
            type: 'asset/resource',
            generator: {
                filename: 'images/[contenthash][ext]'
            }
        }
    ]
}
```

generator 优先级高于 assetModulFilename

### inline

```js
{
    test: /\.svg$/,
        type: 'asset/inline'
}
```

生成的 url 为 dataURL BASE64 格式

### source

```js
{
    test: /\.txt$/,
        type: '/asset/source'
}
```

导出源代码

### 5.4 asset

```js
{
    test: /\.jpg$/,
    type: "asset",
    parser: {
        dataUrlCondition: {
            maxSize: 4 * 1024 * 1024	//当jpg文件小于4M时自动生成base64，大于4M才生成资源文件
        }
    }
}
```

### 小结

在 webpack 5 之前，通常使用：

raw-loader 将文件导入为字符串

url-loader 将文件作为 data URI 内联到 bundle 中

file-loader 将文件发送到输出目录

webpack5 增加了资源模块类型(asset module type)，通过添加 4 种新的模块类型，来替换所有这些 loader：

asset/resource 发送一个单独的文件并导出 URL。之前通过使用 file-loader 实现。

asset/inline 导出一个资源的 data URI。之前通过使用 url-loader 实现。

asset/source 导出资源的源代码。之前通过使用 raw-loader 实现。

asset 在导出一个 data URI 和发送一个单独的文件之间自动选择。之前通过使用 url-loader，并且配置资源体积限制实现。

## loader 加载器

### css-loader

```shell
npm install style-loader css-loader less-loader -D
```

```js
{
    test: /\.(css|less)$/,
    use: ['style-loader', 'css-loader', 'less-loader']
}
```

use 数组逆序，链式调用（上述的 css-loader 调用顺序为 less-loader -> css-loader -> style-loader）

### 抽离和压缩 css

#### 抽离

**mini-css-extract-plugin：对于 webpack4 它是一个第三方插件，而 webpack5 直接默认导出这个插件对象了，写法略有不同**

webpack4，需要先安装再配置

```shell
npm install mini-css-extract-plugin -D
```

```js
const MiniCssExtractPlugin = require('mini-css-extract-plugin');

plugins: [
    new HtmlWebpackPlugin({
        template: './index.html',
        inject: 'body'
    }),
    new MiniCssExtractPlugin({
        filename: 'styles/[contenthash].css'
    })
],

module: {
    rules: [
        {
            test: /\.(css|less)$/,
            use: [MiniCssExtractPlugin.loader, 'css-loader']
        }
    ]
}
```

webpack5，直接引入无需安装

```js
const MiniCssExtractPlugin = require("mini-css-extract-plugin");

module.exports = {
  // ...
  module: {
    rules: [
      {
        test: /\.css$/,
        use: [MiniCssExtractPlugin.loader, "css-loader"],
      },
    ],
  },
  plugins: [
    new MiniCssExtractPlugin({
      filename: "style.css",
    }),
  ],
};
```

打包后生成独立的 css 文件

#### 压缩

```
npm install css-minimizer-webpack-plugin -D
```

```js
const CssMinimizerWebpackPlugin = require('css-minimizer-webpack-plugin');

mode: 'production',

optimization: {
    minimizer: [
        new CssMinimizerWebpackPlugin()
    ]
}
```

### 加载 images 图像

在 css 的 background 属性中按相对路径添加图片，自动生成相应的 dataURLbase64 图像数据

### 6.4 加载 font 字体

```js
{
    test: /\.(woff|woff2|eot|ttf|otf)$/i,
    type: 'asset/resource'
}
```

### 加载数据

```
npm install csv-loader xml-loader -D
```

```js
{
    test: /\.(scv|tsv)$/,
    use: 'csv-loader'
},
{
    test: /\.xml$/,
    use: 'xml-loader'
}
```

### 自定义 JSON 模块 parser

适用文件名：toml yaml json5

```
npm install toml yaml json5 -D
```

```js
{
    test: /\.toml$/,
    type: 'json',
    parser: {
    parse: toml.parse
}
},
{
    test: /\.yaml$/,
    type: 'json',
    parser: {
    parse: yaml.parse
}
},
{
    test: /\.json5$/,
    type: 'json',
    parser: {
    parse: json5.parse
}
}
```

### babel-loader

```shell
npm install babel-loader @babel/core @babel/preset-env -D
```

```js
{
    test: /\.js$/,
        exclude: /node_modules/,
    use: {
    loader: 'babel-loader',
        options: {
        presets: ['@babel/preset-env']
    }
}
}
```

注意：promise 语法需要安装 regeneratorRuntime ，否则 webpack-dev-server 运行报错

**regeneratorRuntime**：该插件用于兼容 async/await 的语法。

```
npm install @babel/runtime @babel/plugin-transform-runtime -D
```

```js
{
    test: /\.js$/,
        exclude: /node_modules/,
    use: {
    loader: 'babel-loader',
        options: {
        presets: ['@babel/preset-env'],
            plugins: [
            [
                '@babel/plugin-transform-runtime'
            ]
        ]
    }
}
}
```

### 代码分离方法

入口起点：使用 entry 配置手动地分离代码

防止重\*：使用 Entry dependencies 或者 SplitChunksPlugin 去重和分离代码

动态导入：通过模块的内联函数调用来分离代码

#### 1.入口起点

- 如果入口 chunks 之间包含重复的模块，那些重复模块都会被引入到各个 bundle 中

- 这种方法不够灵活，并且不能将核心应用程序逻辑进行动态拆分代码。

#### 2.防止重复

（1）配置 dependOn 选项，这样可以在多个 chunk 之间共享模块

```js
entry: {
    index: {
        import: './src/index.js',
        dependOn: 'shared'
    },
    another: {
        import: './src/another-module.js',
        dependOn: 'shared'
    },
    shared: 'lodash'
},
```

![image-20220208222845919](https://misaka10032.oss-cn-chengdu.aliyuncs.com/Webpack/image-20220208222845919.png)

（2）SplitChunksPlugin

```js
entry: {
    index: './src/index.js',
    another: './src/another-module.js'
},
optimization: {
        minimizer: [
            new CssMinimizerWebpackPlugin()
        ],
        splitChunks: {
            chunks: "all"
        }
    }
```

（3）使用 CommonsChunkPlugin

```js
const path = require("path");
const webpack = require("webpack");

module.exports = {
  entry: {
    index: "./src/index.js",
    another: "./src/page.js",
  },
  plugins: [
    new webpack.optimize.CommonChunkPlugin({
      name: "common", // 指定公共bundle的名称
    }),
  ],
  output: {
    filename: "[name].bundle.js",
    path: path.resolve(__dirname, "dist"),
  },
};
```

貌似是 webpack4 的语法，5 没有该方法

#### 3.动态导入，按需加载

`import('lodash') => { }`

```js
// src/index.js
function getComponent() {
  return import(/* webpackChunkName: 'lodash' */ "lodash")
    .then((_) => {
      var element = document.createElement("div");
      element.innerHTML = _.join(["Hello", "webpack"], " ");
      return element;
    })
    .catch((error) => "An error occurred while loading the component");
}

getComponent().then((component) => {
  document.body.appendChild(component);
});
```

应用：

魔法注释

/\* webpackChunkName: 'math' \*/

预获取（网络空闲时才去加载）

/\* webpackChunkName: 'math', webpackPrefetch: true \*/

预加载（与主模块并行加载）

/\* webpackChunkName: 'math', webpackPreload: true \*/

### 调整输出文件夹与文件名

#### 1.输出文件名，增加哈希实时缓存

```js
output: {
  filename: '[name].[contenthash].js',
  path: path.resolve(__dirname, './dist')
}
```

#### 2.缓存第三方库

```js
optimization: {
    minimizer: [
        new CssMinimizerWebpackPlugin()
    ],
    splitChunks: {
        cacheGroups: {
            vendor: {
                test: /[\\/]node_modules[\\/]/,
                name: 'vendors',
                chunks: 'all'
            }
        }
    }
}
```

#### 3.所有 js 文件放一个文件夹

```js
output: {
  filename: '[name].[contenthash].js',
  path: path.resolve(__dirname, './dist')
}
```

### 环境配置拆分

#### 1.公共路径 publicPath

更改资源引用的路径，默认为相对路径

```js
output: {
    filename: 'scripts/[name].[contenthash].js',
    path: path.resolve(__dirname, './dist'),
    clean: true,
    assetModuleFilename: "images/[contenthash][ext]"
    publicPath: 'http://localhost:8080/'
},
```

#### 2.环境变量

将 module.exports 写为箭头函数，参数为 env

```shell
npx webpack --env production --env goal=local
```

```js
module.exports = (env) => {
  console.log(env.goal)
  return {
    entry: {
      index: './src/index.js',
      another: './src/another-module.js'
    }
  },
  output: {
    filename: 'scripts/[name].[contenthash].js',
    path: path.resolve(__dirname, './dist'),
    clean: true,
    assetModuleFilename: "images/[contenthash][ext]",
  }
}
```

![终端展示](https://misaka10032.oss-cn-chengdu.aliyuncs.com/Webpack/image-20220209224522946.png)

#### 3.拆分配置文件

开发环境不需要的配置：文件名哈希值，publicPath、压缩

开发环境需要的配置：devTool、devServer

#### npm 脚本

package.json 文件：

```json
"scripts": {
  "start": "webpack serve -c ./config/webpack.config.dev.js",
  "build": "webpack -c ./config/webpack.config.prod.js"
}
```

## 最终配置

拆分与合并

config.common

```js
const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");

const toml = require("toml");
const yaml = require("yaml");
const json5 = require("json5");

module.exports = {
  entry: {
    // index: {
    //     import: './src/index.js',
    //     dependOn: 'shared'
    // },
    // another: {
    //     import: './src/another-module.js',
    //     dependOn: 'shared'
    // },
    // shared: 'lodash'
    index: "./src/index.js",
    another: "./src/another-module.js",
  },

  output: {
    path: path.resolve(__dirname, "../dist"),
    clean: true,
    assetModuleFilename: "images/[contenthash][ext]",
  },

  plugins: [
    new HtmlWebpackPlugin({
      template: "./index.html",
      inject: "body",
    }),
    new MiniCssExtractPlugin({
      filename: "styles/[contenthash].css",
    }),
  ],

  module: {
    rules: [
      {
        test: /\.png$/,
        type: "asset/resource",
        generator: {
          filename: "images/[contenthash][ext]",
        },
      },
      {
        test: /\.svg$/,
        type: "asset/inline",
      },
      {
        test: /\.txt$/,
        type: "/asset/source",
      },
      {
        test: /\.jpg$/,
        type: "asset",
        parser: {
          dataUrlCondition: {
            maxSize: 4 * 1024 * 1024, //当jpg文件小于4M时自动生成base64，大于4M才生成资源文件
          },
        },
      },
      {
        test: /\.(css|less)$/,
        use: [MiniCssExtractPlugin.loader, "css-loader", "less-loader"],
      },
      {
        test: /\.(woff|woff2|eot|ttf|otf)$/i,
        type: "asset/resource",
      },
      {
        test: /\.(scv|tsv)$/,
        use: "csv-loader",
      },
      {
        test: /\.xml$/,
        use: "xml-loader",
      },
      {
        test: /\.toml$/,
        type: "json",
        parser: {
          parse: toml.parse,
        },
      },
      {
        test: /\.yaml$/,
        type: "json",
        parser: {
          parse: yaml.parse,
        },
      },
      {
        test: /\.json5$/,
        type: "json",
        parser: {
          parse: json5.parse,
        },
      },
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: {
          loader: "babel-loader",
          options: {
            presets: ["@babel/preset-env"],
            plugins: [["@babel/plugin-transform-runtime"]],
          },
        },
      },
    ],
  },

  optimization: {
    splitChunks: {
      cacheGroups: {
        vendor: {
          test: /[\\/]node_modules[\\/]/,
          name: "vendors",
          chunks: "all",
        },
      },
    },
  },
};
```

config.dev

```js
module.exports = {
  output: {
    filename: "scripts/[name].js",
  },

  mode: "development",

  devtool: "inline-source-map",

  devServer: {
    static: "./dist",
  },
};
```

config.prod

```js
const CssMinimizerWebpackPlugin = require("css-minimizer-webpack-plugin");
const TerserPlugin = require("terser-webpack-plugin");

module.exports = {
  output: {
    filename: "scripts/[name].[contenthash].js",
    publicPath: "http://localhost:8080/",
  },

  mode: "production",

  optimization: {
    minimizer: [new CssMinimizerWebpackPlugin(), new TerserPlugin()],
  },

  performance: {
    hints: false,
  },
};
```
