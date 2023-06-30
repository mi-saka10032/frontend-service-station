---
title: Koa
order: 8

tag:
  - Node
  - koa
  - 服务器框架
---

koa：node.js 的下一代 web 框架

koa 旨在为 Web 应用程序和 API 提供更小、更丰富和更强大的能力

相对于 express 具有更强的异步处理能力（后续我们再对比）

koa 的核心代码只有 1600+行，是一个更加轻量级的框架，我们可以根据需要安装和使用中间件

事实上学习了 express 之后，学习 koa 的过程是很简单的

## 基础

koa 注册的中间件提供了两个参数：

ctx：上下文 Context 对象，ctx.request 请求对象，ctx.response 响应对象。

next：本质上是一个 dispatch，类似于之前的 next。

```js
const Koa = require("koa");

const app = new Koa();

app.use((ctx, next) => {
  console.log("middleware 01");
  next();
});

app.use((ctx, next) => {
  console.log("middleware 02");
  ctx.response.body = "Hello World";
});

app.listen(8000, () => {
  console.log("服务器启动成功");
});
```

## koa 中间件与路由

koa 通过创建的 app 对象，注册中间件只能通过 use 方法

koa 并没有提供 methods 的方式来注册中间件

也没有提供 path 中间件来匹配路径

真实开发时实现路径和 methods 分离：根据 request 自己来判断、使用第三方路由中间件。

**路由使用 koa-router**

```javascript
const Router = require("koa-router");

const userRouter = new Router({ prefix: "/users" });

userRouter.get("/", (ctx, next) => {
  ctx.response.body = "get!";
});

userRouter.post("/", (ctx, next) => {
  ctx.response.body = "post!";
});

module.exports = userRouter;
```

```javascript
const userRouter = require("./userroute");
app.use(userRouter.routes());
app.use(userRouter.allowedMethods());
```

## 参数解析

### params

请求地址 `http://localhost:8000/users/123`

```js
const userRouter = new Router({ prefix: "/users" });

userRouter.get("/:id", (ctx, next) => {
  console.log(ctx.params.id);
  ctx.body = "Hello World";
});
```

### query

请求地址 `http://localhost:8000/login?username=why&password=123`

```js
app.use((ctx, next) => {
  console.log(ctx.request.query);
  ctx.body = "Hello World";
});
```

### json

请求地址 `http://localhost:8000/login`

body 是 json 格式

`{ "username": "why", "password": "123" }`

获取 json 数据：

1. 安装依赖：npm install koa-bodyparser

2. 使用 koa-bodyparser 中间件

```js
app.use(bodyParser());

app.use((ctx, next) => {
  console.log(ctx.request.body);
  ctx.body = "Hello World";
});
```

### x-www-form-urlencoded

body 是 x-www-form-urlencoded 格式，获取方法和 json 相同，需要安装并使用 koa-bodyparser

### form-data

1.普通数据

FormData 格式对象：

`{ username: 'lilei', password: '8888' }`

解析 body 中的数据，需要使用 multer

1. 安装依赖：npm install koa-multer

2. 使用 multer 中间件

```js
const upload = multer({});

app.use(upload.any());

app.use((ctx, next) => {
  console.log(ctx.req.body);
  ctx.body = "Hello World";
});
```

2.上传文件

```js
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "./uploads/");
  },
  fileName: (req, file, cb) => {
    cb(nul, Date.now() + path.extname(file.originalname));
  },
});

const upload = multer({ storage });

const fileRouter = new Router();

fileRouter.post("/upload", upload.single("avatar"), (ctx, next) => {
  console.log(ctx.req.file);
});
```

## 数据响应

输出结果：body 将响应主题设置为以下之一：

string ：字符串数据

Buffer ：Buffer 数据

Stream ：流数据

Object || Array：对象或者数组

null ：不输出任何内容

```js
ctx.response.body = "Hello World";

ctx.body = {
  name: "why",
  age: 18,
  height: 1.88,
};

ctx.body = ["abc", "cba", "nba"];
```

请求状态：status

如果 response.status 尚未设置，Koa 会自动将状态设置为 200 或 204

```js
ctx.status = 201;

ctx.response.status = 404;
```

## 静态服务器

koa 没有内置部署相关功能，需要使用第三方库：npm install koa-static

```js
const Koa = require("koa");
const static = require("koa-static");

const app = new Koa();

app.use(static("./build"));

app.listen(8000, () => {
  console.log("静态服务器启动成功");
});
```

## 错误处理

由于 koa 最新版采用 async/await 处理回调函数，路由中的错误信息可以全部抛出到最上级 app 通过错误事件监听器统一处理

```js
const Koa = require("koa");

const app = new Koa();

app.use((ctx, next) => {
  ctx.app.emit("error", new Error("哈哈哈"), ctx);
});

app.on("error", (err, ctx) => {
  console.log(err.message);
  ctx.response.body = "哈哈哈";
});

app.listen(8000, () => {
  console.log("错误处理服务器启动成功");
});
```

## 对比express

**从架构设计上相比**

express是完整和强大的，其中帮助我们内置了非常多好用的功能

koa是简洁和自由的，它只包含最核心的功能，并不会对我们使用其他中间件进行任何的限制

- 甚至是在app中连最基本的get、post都没有给我们提供
- 我们需要通过自己或者路由来判断请求方式或者其他功能

express和koa框架他们的核心其实都是中间件

但是他们的中间件事实上，它们的中间件的执行机制是不同的，特别是针对某个中间件中包含**异步操作**时。

await next()：koa可实现异步等待。express不可实现。