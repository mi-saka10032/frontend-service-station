---
title: 基础入门
order: 1
category: false
tag:
  - 环境构建
  - 基础
---

## 简介

TypeScript 是 JavaScript 的超集。

它对 JS 进行了扩展，向 JS 中引入了类型的概念，并添加了许多新特性。

TS 代码需要通过编译器编译为 JS，然后再交由 JS 解析器执行。

TS 完全兼容 JS，换言之，任何的 JS 代码都可以直接当成 JS 使用。

相较于 JS 而言，TS 拥有了静态类型，更加严格的语法，更强大的功能；TS 可以在代码执行前就完成代码检查，减小了运行时异常出现的几率；TS 代码可以编译为任意版本的 JS 代码，可有效解决不同 JS 运行环境的兼容问题；同样的功能，TS 的代码量要大于 JS，但由于 TS 的代码结构更加清晰，变量类型更加明确，在后期代码的维护中 TS 远远胜于 JS。

## TypeScript 开发环境构建

1. 下载 Node.js

   - 64 位：https://nodejs.org/dist/v14.15.1/node-v14.15.1-x64.msi
   - 32 位：https://nodejs.org/dist/v14.15.1/node-v14.15.1-x86.msi

2. 安装 Node.js

3. 使用 npm 全局安装 typescript

   - 进入命令行
   - 输入：npm i -g typescript

4. 创建一个 ts 文件

5. 使用 tsc 对 ts 文件进行编译

   - 进入命令行

   - 进入 ts 文件所在目录

   - 执行命令：tsc xxx.ts

## 基本类型

### 类型声明

- 类型声明是 TS 非常重要的一个特点
- 通过类型声明可以指定 TS 中变量（参数、形参）的类型
- 指定类型后，当为变量赋值时，TS 编译器会自动检查值是否符合类型声明，符合则赋值，否则报错
- 简而言之，类型声明给变量设置了类型，使得变量只能存储某种类型的值。

语法：

```ts
let 变量: 类型;

let 变量: 类型 = 值;

function fn(参数: 类型, 参数: 类型): 类型{
  ...
}
```

### 自动类型判断

- TS 拥有自动的类型判断机制
- 当对变量的声明和赋值时同时进行的时候，TS 编译器会自动判断变量类型
- 所以如果变量的声明和赋值同时进行，可以省略掉类型声明

```ts
let n = 1; // n为number类型
let s = "Hello"; // s为string类型
let b = false; // b为boolean类型
let u; // u为undefined类型
```

### 基础类型

|  类型   |       例子        |              描述               |
| :-----: | :---------------: | :-----------------------------: |
| number  |    1, -33, 2.5    |            任意数字             |
| string  | 'hi', "hi", `hi`  |           任意字符串            |
| boolean |    true、false    |      布尔值 true 或 false       |
| 字面量  |      其本身       |  限制变量的值就是该字面量的值   |
|   any   |       `\*`        |            任意类型             |
| unknown |       `\*`        |         类型安全的 any          |
|  void   | 空值（undefined） |     没有值（或 undefined）      |
|  never  |      没有值       |          不能是任何值           |
| object  | `{name:'孙悟空'}` |         任意的 JS 对象          |
|  array  |     `[1,2,3]`     |          任意 JS 数组           |
|  tuple  |      `[4,5]`      | 元素，TS 新增类型，固定长度数组 |
|  enum   |   `enum{A, B}`    |       枚举，TS 中新增类型       |

#### number

```ts
let decimal: number = 6;
let hex: number = 0xf00d;
let binary: number = 0b1010;
let octal: number = 0o744;
let big: bigint = 100n;
```

#### boolean

```ts
let isDone: boolean = false;
```

#### string

```ts
let color: string = "blue";
color = "red";

let fullName: string = `Bob Bobbington`;
let age: number = 37;
let sentence: string = `Hello, my name is ${fullName}.
I'll be ${age + 1} years old next month.`;
```

#### 字面量

也可以使用字面量去指定变量的类型，通过字面量可以确定变量的取值范围

```ts
let color: "red" | "blue" | "black";
let num: 1 | 2 | 3 | 4 | 5;
```

#### any

有时候，我们会想要为那些在编程阶段还不清楚类型的变量指定一个类型。 这些值可能来自于动态的内容，比如来自用户输入或第三方代码库。 这种情况下，我们不希望类型检查器对这些值进行检查而是直接让它们通过编译阶段的检查。 那么我们可以使用 any 类型来标记这些变量：

```ts
let d: any = 4;
d = "hello";
d = true;
```

#### unknown

unknown 类型是 any 的类型安全版本。每当你想使用 any 时，应该先试着用 unknown。

在 any 允许我们做任何事的地方，unknown 的限制则大得多

```ts
let notSure: unknown = 4;
notSure = "hello";
```

#### void

某种程度上来说，void 类型像是与 any 类型相反，它表示没有任何类型。 当一个函数没有返回值时，你通常会见到其返回值类型是 void

```ts
let unusable: void = undefined;

function warnUser(): void {
  console.log("This is my warning message");
}
```

#### never

never 类型表示的是那些永不存在的值的类型。 例如， never 类型是那些总是会抛出异常或根本就不会有返回值的函数表达式或箭头函数表达式的返回值类型；变量也可能是 never 类型，当它们被永不为真的类型保护所约束时。

never 类型是任何类型的子类型，也可以赋值给任何类型；然而，没有类型是 never 的子类型或可以赋值给 never 类型（除了 never 本身之外）。 即使 any 也不可以赋值给 never。

```ts
// 返回never的函数必须存在无法达到的终点
function error(message: string): never {
  throw new Error(message);
}

// 推断的返回值类型为never
function fail() {
  return error("Something failed");
}

// 返回never的函数必须存在无法达到的终点
function infiniteLoop(): never {
  while (true) {}
}
```

#### object

object 表示非原始类型，也就是除 number，string，boolean，symbol，null 或 undefined 之外的类型。

使用 object 类型，就可以更好的表示像 Object.create 这样的 API。例如：

```ts
declare function create(o: object | null): void;

create({ prop: 0 }); // OK
create(null); // OK

create(42); // Error
create("string"); // Error
create(false); // Error
create(undefined); // Error
```

#### array

有两种方法可以定义数组。第一种，可以在元素类型后面接上[]，表示由此类型元素组成的一个数组

```ts
let list: number[] = [1, 2, 3];
```

第二种，使用数组泛型

```ts
let list: Array<number> = [1, 2, 3];
```

#### tuple

元组类型允许表示一个已知元素数量和类型的数组，各元素的类型不必相同。 比如，你可以定义一对值分别为 string 和 number 类型的元组。

```ts
// Declare a tuple type
let x: [string, number];
// Initialize it
x = ["hello", 10]; // OK
// Initialize it incorrectly
x = [10, "hello"]; // Error
```

#### enum

enum 类型是对 JavaScript 标准数据类型的一个补充。 像 C#等其它语言一样，使用枚举类型可以为一组数值赋予友好的名字。

```ts
enum Color {
  Red,
  Green,
  Blue,
}
let c: Color = Color.Green;
```

默认情况下，从 0 开始为元素编号。 你也可以手动的指定成员的数值。 例如，我们将上面的例子改成从 1 开始编号：

```ts
enum Color {
  Red = 1,
  Green,
  Blue,
}
let c: Color = Color.Green;
```

或者，全部都采用手动赋值：

```ts
enum Color {
  Red = 1,
  Green = 2,
  Blue = 4,
}
let c: Color = Color.Green;
```

枚举类型提供的一个便利是你可以由枚举的值得到它的名字。 例如，我们知道数值为 2，但是不确定它映射到 Color 里的哪个名字，我们可以查找相应的名字：

```ts
enum Color {
  Red = 1,
  Green,
  Blue,
}
let colorName: string = Color[2];

console.log(colorName); // 显示'Green'因为上面代码里它的值是2
```

### 类型断言

有些情况下，变量的类型对于我们来说是很明确，但是 TS 编译器却并不清楚，此时，可以通过类型断言来告诉编译器变量的类型，断言有两种形式：

第一种：

```ts
let someValue: unknown = "this is a string";
let strLength: number = (someValue as string).length;
```

```ts
let someValue: unknown = "this is a string";
let strLength: number = (<string>someValue).length;
```

## 编译选项

### 自动编译文件

编译文件时，使用 -w 指令后，TS 编译器会自动监视文件的变化，并在文件发生变化时对文件进行重新编译。

```shell
tsc xxx.ts -w
```

### 自动编译整个项目

如果直接使用 tsc 指令，则可以自动将当前项目下的所有 ts 文件编译为 js 文件

但是能直接使用 tsc 命令的前提时，要先在项目根目录下创建一个 ts 的配置文件 tsconfig.json

tsconfig.json 是一个 JSON 文件，添加配置文件后，只需只需 tsc 命令即可完成对整个项目的编译

JSON 配置项：

- include

定义希望被编译文件所在的目录

默认值：`["\*\*/\*"]`

```json
"include":["src/**/*", "tests/**/*"]
```

上述示例中，所有 src 目录和 tests 目录下的文件都会被编译

- exclude

定义需要排除在外的目录

默认值：`["node_modules", "bower_components", "jspm_packages"]`

```json
"exclude": ["./src/hello/**/*"]
```

上述示例中，src 下 hello 目录下的文件都不会被编译

- extends

定义被继承的配置文件

```json
"extends": "./configs/base"
```

上述示例中，当前配置文件中会自动包含 config 目录下 base.json 中的所有配置信息

- files

指定被编译文件的列表，只有需要编译的文件少时才会用到

```json
"files": [
  "core.ts",
  "sys.ts",
  "types.ts",
  "scanner.ts",
  "parser.ts",
  "utilities.ts",
  "binder.ts",
  "checker.ts",
  "tsc.ts"
]
```

列表中的文件都会被 TS 编译器所编译

- compilerOptions

**编译选项是配置文件中非常重要也比较复杂的配置选项**

在 compilerOptions 中包含多个子选项，用来完成对编译的配置

- 项目选项

  - target

  设置 TS 代码编译的目标版本

  可选值：ES3（默认）、ES5、ES6/ES2015、ES7/ES2016、ES2017、ES2018、ES2019、ES2020、ESNext

  ```json
  "compilerOptions": {
    "target": "ES6"
  }
  ```

  如上设置，我们所编写的 ts 代码将会被编译为 ES6 版本的 js 代码

  - lib

  指定代码运行时所包含的库（宿主环境）

  可选值：ES5、ES6/ES2015、ES7/ES2016、ES2017、ES2018、ES2019、ES2020、ESNext、DOM、WebWorker、ScriptHost ......

  ```json
  "compilerOptions": {
    "target": "ES6",
    "lib": ["ES6", "DOM"],
    "outDir": "dist",
    "outFile": "dist/aa.js"
  }
  ```

  - module

  设置编译后代码使用的模块化系统

  可选值：CommonJS、UMD、AMD、System、ES2020、ESNext、None

  ```json
  "compilerOptions": {
    "module": "CommonJS"
  }
  ```

  - outDir

  编译后文件的所在目录

  默认情况下，编译后的 js 文件会和 ts 文件位于相同的目录，设置 outDir 后可以改变编译后文件的位置

  ```json
  "compilerOptions": {
    "outDir": "dist"
  }
  ```

  设置后编译后的 js 文件将会生成到 dist 目录

  - outFile

  将所有的文件编译为一个 js 文件

  默认会将所有的编写在全局作用域中的代码合并为一个 js 文件，如果 module 制定了 None、System 或 AMD 则会将模块一起合并到文件之中

  ```json
  "compilerOptions": {
    "outFile": "dist/app.js"
  }
  ```

  - rootDir

  指定代码的根目录，默认情况下编译后文件的目录结构会以最长的公共目录为根目录，通过 rootDir 可以手动指定根目录

  ```json
  "compilerOptions": {
    "rootDir": "./src"
  }
  ```

  - allowJs

  是否对 js 文件编译

  - checkJs

  是否对 js 文件进行检查

  ```json
  "compilerOptions": {
    "allowJs": true,
    "checkJs": true
  }
  ```

  - removeComments

  是否删除注释

  默认值：false

  - noEmit

  不对代码进行编译

  默认值：false

  - sourceMap

  是否生成 sourceMap

  默认值：false

- 严格检查

  - strict

  启用所有的严格检查，默认值为 true，设置后相当于开启了所有的严格检查

  - alwaysStrict

  总是以严格模式对代码进行编译

  - noImplicitAny

  禁止隐式的 any 类型

  - noImplicitThis

  禁止类型不明确的 this

  - strictBindCallApply

  严格检查 bind、call 和 apply 的参数列表

  - strictFunctionTypes

  严格检查函数的类型

  - strictNullChecks

  严格的空值检查

  - strictPropertyInitialization

  严格检查属性是否初始化

- 额外检查

  - noFallthroughCasesInSwitch

  检查 switch 语句包含正确的 break

  - noImplicitReturns

  检查函数没有隐式的返回值

  - noUnusedLocals

  检查未使用的局部变量

  - noUnusedParameters

  检查未使用的参数

- 高级

  - allowUnreachableCode

  检查不可达代码

  可选值：true，忽略不可达代码；false，不可达代码将引起错误

  - noEmitOnError

  有错误的情况下不进行编译

  默认值：false

## webpack

通常情况下，实际开发中我们都需要使用构建工具对代码进行打包，TS 同样也可以结合构建工具一起使用，下边以 [webpack](../webpack/primary.html) 为例介绍一下如何结合构建工具使用 TS。

以下是创建步骤

### 初始化项目

进入项目根目录，执行命令 `npm init -y`

主要作用：创建 package.json 文件

### 下载构建工具

`npm i -D webpack webpack-cli webpack-dev-server typescript ts-loader clean-webpack-plugin`

共安装了 7 个包

- webpack：构建工具 webpack
- webpack-cli：webpack 的命令行工具
- webpack-dev-server：webpack 的开发服务器
- typescript：ts 编译器
- ts-loader：ts 加载器，用于在 webpack 中编译 ts 文件
- html-webpack-plugin：webpack 中 html 插件，用来自动创建 html 文件
- clean-webpack-plugin：webpack 中的清除插件，每次构建都会先清除目录

### 创建配置文件

根目录下创建 webpack 的配置文件 webpack.config.js（因为 webpack 是基于[CJS](../node/模块化.html#cjs)开发的，所以需要写 js 文件而不是 ts 文件）

```js
const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const { CleanWebpackPlugin } = require("clean-webpack-plugin");

module.exports = {
  optimization: {
    minimize: false, // 关闭代码压缩，可选
  },

  entry: "./src/index.ts",

  devtool: "inline-source-map",

  devServer: {
    contentBase: "./dist",
  },

  output: {
    path: path.resolve(__dirname, "dist"),
    filename: "bundle.js",
    environment: {
      arrowFunction: false, // 关闭webpack的箭头函数，可选
    },
  },

  resolve: {
    extensions: [".ts", ".js"],
  },

  module: {
    rules: [
      {
        test: /\.ts$/,
        use: {
          loader: "ts-loader",
        },
        exclude: /node_modules/,
      },
    ],
  },

  plugins: [
    new CleanWebpackPlugin(),
    new HtmlWebpackPlugin({
      title: "TS测试",
    }),
  ],
};
```

### 创建 tsconfig.json

根目录下创建 tsconfig.json，配置可以根据自己需要

```json
{
  "compilerOptions": {
    "target": "ES2015",
    "module": "ES2015",
    "strict": true
  }
}
```

### 修改 package.json

修改 package.json 添加如下配置

```json
{
  // ...
  "scripts": {
    "test": "echo \"Error: no test specified\" && exit 1",
    "build": "webpack",
    "start": "webpack serve --open chrome.exe"
  }
  /// ...
}
```

### 启动服务器

在 src 下创建 ts 文件，并在并命令行执行`npm run build`对代码进行编译，或者执行`npm start`来启动开发服务器

## Babel

经过一系列的配置，使得 TS 和 webpack 已经结合到了一起，除了 webpack，开发中还经常需要结合 babel 来对代码进行转换以使其可以兼容到更多的浏览器，在上述步骤的基础上，通过以下步骤再将 babel 引入到项目中。

### 安装依赖

`npm i -D @babel/core @babel/preset-env babel-loader core-js`

共安装了 4 个包

- @babel/core：babel 的核心工具
- @babel/preset-env：babel 的预定义环境
- @babel-loader：babel 在 webpack 中的加载器
- core-js：core-js 用来使老版本的浏览器支持新版 ES 语法

### 修改 webpack.config.js 配置文件

```js
// ...
module: {
  rules: [
    {
      test: /\.ts$/,
      use: [
        {
          loader: "babel-loader",
          options: {
            presets: [
              [
                "@babel/preset-env",
                {
                  targets: {
                    chrome: "58",
                    ie: "11",
                  },
                  corejs: "3",
                  useBuiltIns: "usage",
                },
              ],
            ],
          },
        },
        {
          loader: "ts-loader",
        },
      ],
      exclude: /node_modules/,
    },
  ];
}
// ...
```

如此一来，使用 ts 编译后的文件将会再次被 babel 处理，使得代码可以在大部分浏览器中直接使用，可以在配置选项的 targets 中指定要兼容的浏览器版本。
