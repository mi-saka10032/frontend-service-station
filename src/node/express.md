---
title: Express
order: 7
category: false
tag:
  - Node
  - express
  - 服务器框架
---

## 使用方式

### 初始化

安装 express-generator

npm install -g express-generator

express express-demo

npm install

node bin/www

### 基本使用

```js
const express = require("express");

// 创建服务器
const app = express();

// /home的get请求处理
app.get("/home", (req, res) => {
  res.end("Hello Home");
});

// /login的post请求处理
app.post("/login", (req, res) => {
  res.end("Hello Login");
});

// 开启监听
app.listen(8000, () => {
  console.log("服务器8000端口启动成功");
});
```

## 中间件

Express 是一个路由和中间件的 Web 框架，它本身的功能非常少

Express 应用程序本质上是一系列中间件函数的调用。

### 本质

中间件的本质是传递给 express 的一个回调函数；

接收三个参数：

请求对象（request）、响应对象（response）、next 函数（在 express 中定义的用于执行下一个中间件的函数）

### 执行任务

可执行任务：执行任何代码、更改请求（request）和响应（response）对象、结束请求-响应周期（返回数据）、调用栈中的下一个中间件。

如果当前中间件功能没有结束请求-响应周期，则必须调用 next()将控制权传递给下一个中间件功能，否则，请求将被挂起。

![express执行任务](https://misaka10032.oss-cn-chengdu.aliyuncs.com/Node/10-express/image-20211013234438853.png)

### 应用中间件

express 主要提供了两种方式：app/router.use 和 app/router.methods，可以是 app，也可以是 router

methods 指的是常用的请求方式，比如： app.get 或 app.post 等

#### 1.body-parser

express 有内置一些帮助我们完成对 request 解析的中间件

registry 仓库中也有很多可以辅助我们开发的中间件，此处简要手写一个 json 中间件作为示例，实际开发中直接`npm install body-parser -D`作为中间件引入后使用即可

```js
app.use((req, res, next) => {
  if (req.headers["content-type"] === "application/json") {
    req.on("data", (data) => {
      req.body = JSON.parse(data.toString());
    });
    req.on("end", () => next);
  } else {
    next();
  }
});

app.post("/login", (req, res, next) => {
  console.log(req.body);
  res.end("登录成功");
});
```

#### 2.morgan

morgan 记录日志文件

关键点：调用 morgan 中间件，设置格式 combined，选项 stream fs 可写流

```js
const fs = require("fs");
const express = require("express");
const morgan = require("morgan");
const app = express();

const loggerWirter = fs.createWriteStream("./log/access.log", {
  flags: "a+",
});
app.use(morgan("combined", { stream: loggerWirter }));

app.get("/home", (req, res, next) => {
  res.end("你好日志");
});

app.listen(8000, () => {
  console.log("日志记录服务器");
});
```

#### 3.multer

multer 解析 form-data 普通数据，

```js
const { upload } = require("multer");

app.use(upload.any());

app.use("/login", (req, res, next) => {
  console.log(req.body);
});
```

#### 4.客户端发送请求的方式

1. 通过 get 请求中的 URL 的 params：

请求地址：`http://localhost:8000/login/abc/why`

获取参数：

```js
app.use("/login/:id/:name", (req, res, next) => {
  console.log(req.params);
  res.json("请求成功");
});
```

2. 通过 get 请求中的 URL 的 query：

请求地址：`http://localhost:8000/login?username=why&password=123`

获取参数：

```js
app.use("/login", (req, res, next) => {
  console.log(req.query);
  res.json("请求成功");
});
```

3. 通过 post 请求中的 body 的 json 格式(express.json())

4. 通过 post 请求中的 body 的 x-www-form-urlencoded 格式（express.urlencoded({extended: true})）

5. 通过 post 请求中的 form-data 格式（multer，分普通 text 和 file 类型）

#### 5.响应数据

- end 方法

类似于 http 中的 response.end 方法，用法是一致的

- json 方法

json 方法中可以传入很多的类型：object、array、string、boolean、number、null 等，它们会被转换成 json 格式返回；

- status 方法

用于设置状态码

### express 路由

通过把有些处理逻辑包装为一个整体，创建一个路由统一处理。

一个 Router 实例拥有完整的中间件和路由系统，它也被称为 迷你应用程序（mini-app）。

```js
const userRouter = express.Router();

userRouter.get("/", (req, res, next) => {
  res.end("用户列表");
});

userRouter.post("/", (req, res, next) => {
  res.end("创建用户");
});

userRouter.delete("/", (req, res, next) => {
  res.end("删除用户");
});

app.use("/users", userRouter);
```

## 静态资源服务器

Node 也可以作为静态资源服务器，并且 express 给我们提供了方便部署静态资源的方法

```js
const express = require("express");

const app = express();

app.use(express.static("./build"));

app.listen(8000, () => {
  console.log("静态服务器启动成功");
});
```

如果当前目录下的 build 文件夹中存在 index.html 文件，那么可以直接通过地址栏 `http://localhost:8000/index.html` 加载出这个文件中的内容


## 错误统一处理

在中间件或路由中通过 `next(new Error('message信息'))`向外抛出异常

```js
app.use((err, req, res, next) => {
  const message = err.message;

  switch(message) {
    case 'USER DOES NOT EXISTS':
      res.stats(400).json({ message })
  }

  res.status(500)
})
```