---
title: Node引擎
order: 1
category: false
tag:
  - Node
  - 引擎
  - 执行机制
---

## Node 与浏览器引擎

### 浏览器引擎

浏览器内核通常指的是浏览器的**排版引擎**（浏览器引擎、页面渲染引擎、样板引擎，多种称呼）

HTML 解析时遇到 JavaScript 标签，会停止当前解析，转而加载执行 JavaScript 代码。

![浏览器引擎](https://misaka10032.oss-cn-chengdu.aliyuncs.com/Node/01-%E6%B5%8F%E8%A7%88%E5%99%A8%E5%BC%95%E6%93%8E/image-20211008113021559-16336638230261.png)

### 为什么需要 Javascript 引擎

事实上我们编写的 Javascript 无论交给浏览器或者 Node 执行，最后都是需要被 CPU 执行的；

但是 CPU 只认识自己的指令集，实际上是机器语言，才能被 CPU 执行；

所以我们需要 Javascript 引擎帮助我们将 Javascript 代码翻译成 CPU 指令来执行；

### 常见的 Javascript 引擎

SpiderMonkey：第一款 Javascript 引擎，由 Brendan Eich 开发（Javascript 作者）；

Chakra：微软开发，用于 IE 浏览器；

JavascriptCore：Webkit 中的 Javascript 引擎，Apple 公司开发；

V8：Google 开发的强大 Javascript 引擎，帮助 Chrome 从众多浏览器中脱颖而出；

### V8 引擎

V8 是用 C++编写的 Google 开源高性能 Javascript 和 WebAssembly 引擎，它用于 Chrome 和 Node.js 等。

它实现 ECMAScript 和 WebAssembly，并在 Windows 7 或更高版本，macOS 10.12+和使用 x64，IA-32，ARM 或 MIPS 处理器的 Linux 系统上运行。

V8 可以独立运行，也可以嵌入到任何 C++应用程序中。

运行机制流程图：

![V8引擎流程图](https://misaka10032.oss-cn-chengdu.aliyuncs.com/Node/01-%E6%B5%8F%E8%A7%88%E5%99%A8%E5%BC%95%E6%93%8E/image-20211008113355039.png)

![V8引擎流程说明](https://misaka10032.oss-cn-chengdu.aliyuncs.com/Node/01-%E6%B5%8F%E8%A7%88%E5%99%A8%E5%BC%95%E6%93%8E/image-20211008142351389.png)

## Node.js

### 定义

Node.js 基于 V8 引擎来执行 JavaScript 的代码，但是不仅仅只有 V8 引擎。

![浏览器与Node差异](https://misaka10032.oss-cn-chengdu.aliyuncs.com/Node/01-%E6%B5%8F%E8%A7%88%E5%99%A8%E5%BC%95%E6%93%8E/image-20211008143535345.png)

### 架构

![Node.js架构](https://misaka10032.oss-cn-chengdu.aliyuncs.com/Node/01-%E6%B5%8F%E8%A7%88%E5%99%A8%E5%BC%95%E6%93%8E/image-20211008150748415.png)

### 版本控制工具

nvm：Node Version Manager

Interactively Manage Your Node.js Versions（交互式管理你的 Node.js 版本）

nvm 的版本切换：

`nvm ls` 查看所有已经安装的版本

`nvm list available` 查看网络上可以安装的版本

如果不知道有现在还有哪些可以供安装的 node 版本，可以先运行 nvm list available 命令进行查看。

其中 LTS 表示长期稳定版本。

`nvm install 14.16.1` 下载版本号为 14.16.1 的 node

`nvm uninstall 14.16.1` 卸载版本号为 14.16.1 的 node

`nvm root [path]` 设置和查看 root 路径

`nvm use 14.16.1` 切换到版本号为 14.16.1 的 node

### Javascript 代码执行

#### 浏览器执行

浏览器加载、解析 html 代码，需要先创建 html 文件

当 html 通过 script 标签，引入 js 文件

当浏览器遇到 script 标签，根据 src 加载，执行 js 代码

#### node 执行

电脑上安装 node 环境，配置环境变量

通过终端命令 node js 文件的方式来载入和执行对应的 js 文件

### Node 的 REPL

REPL 是 Read-Eval-Print-Loop 的简称，读取-求值-输出-循环

REPL 是一个简单的、交互式的变成环境。

浏览器的 console 就可以看成一个 REPL

### Node 程序传参 process

程序中传递的参数在 process 的内置对象中

如果我们直接打印这个内置对象，它里面包含特别的信息

argc：argument counter 的缩写，传递参数的个数；

argv：argument vector 的缩写，传入的具体参数。

### 常见的全局对象

Node 中给我们提供了一些全局对象，方便我们进行一些操作

![Node全局对象](https://misaka10032.oss-cn-chengdu.aliyuncs.com/Node/01-%E6%B5%8F%E8%A7%88%E5%99%A8%E5%BC%95%E6%93%8E/image-20211008162007211.png)

process：提供了 Node 进程中相关的信息，比如 Node 的运行环境、参数信息等；

console：提供了简单的调试控制台。

定时器函数：

![定时器函数](https://misaka10032.oss-cn-chengdu.aliyuncs.com/Node/01-%E6%B5%8F%E8%A7%88%E5%99%A8%E5%BC%95%E6%93%8E/image-20211008163033129.png)

global 是一个全局对象，事实上前面提到的 process、console、setTimeout 等都被放到 global 中

### 特殊的全局对象

可以在模块中任意使用，但是在命令行交互中不可以使用

包括：

- `__dirname` 获取当前文件所在路径，不包括后面文件名

- `__filename` 获取当前文件所在路径和文件名称，包括后面的文件名称

- `exports` 文件模块导出

- `require()` 文件模块导入

### global 和 window

浏览器中在定级范围内通过 var 声明的变量，默认添加到 window 对象上。

Node 中通过 var 声明的变量，不会放到 global 上。
