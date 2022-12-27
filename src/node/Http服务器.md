---
title: Http服务器
order: 6
category: false
tag:
  - Node
  - http
  - 原生服务器
---

## web 服务器

当应用程序（客户端）需要某一个资源时，可以向一台服务器，通过 Http 请求获取到这个资源，提供服务器的这个服务器就是一个 Web 服务器。

开源的 Web 服务器：Nginx、Apache（静态）、Apache Tomcat（静态、动态）、Node.js

![web服务器](https://misaka10032.oss-cn-chengdu.aliyuncs.com/Node/09-http/image-20211013152727709.png)

## 创建服务器

通过 createServer 完成

```javascript
const http = require("http");
const server = http.createServer((req, res) => {
  res.end("Hello World");
});
```

底层其实直接使用 new Server 对象

等同于

```javascript
const http = require("http");
const server2 = new http.Server((req, res) => {
  res.end("Hello World");
});
```

## 监听主机和端口号

Server 通过 listen 方法开启服务器，并且在某一个主机和端口上监听网络请求

listen 三个参数：

- 端口 port：可以不传，系统默认分配端，后续项目写到环境变量中。

- 主机 host：通常可以传入 localhost、ip 地址 127.0.0.1、或者 0.0.0.0，默认 0.0.0.0。

  ​ localhost：本质上是一个域名，通常被解析为 127.0.0.1；

  ​ 127.0.0.1：回环地址(Loop Back Address)，表达的意思是我们主机自己发出去的包，直接被自己接收；

  ​ 正常的数据库包为 应用层——传输层——网络层——数据链路层——物理层；

  ​ 而回环地址，是在网络层直接就被获取到了，不会进入数据链路层和物理层；

  ​ 比如我们监听 127.0.0.1 时，在同一个网段下的主机中，通过 ip 地址是不能访问的。

  ​ 0.0.0.0：监听 IPV4 上所有的地址，再根据端口找到不同的应用程序；

  ​ 监听 0.0.0.0 时，在同一个网段下的主机中，通过 ip 地址是可以访问的。

- 回调函数：服务器启动成功时的回调函数。

## request 对象

服务器发送请求携带信息：

URL、请求方式、headers 请求头

Node 将其封装到一个 request 的对象中，我们可以直接来处理这个 request 对象。

### URL 处理

url 携带额外参数处理，使用内置模块 url

const parseInfo = url.parse(req,url);

### method 处理

Restful 规范中，对于数据的增删改查应通过不同请求方式，应通过判断不同的请求方式进行不同的处理

GET POST PATCH DELETE ......

### headers 属性

#### 1.content-type

请求携带的数据类型

application/json json 类型

text/plain 文本类型

application/xml xml 类型

multipart/form-data 上传文件（即使如此，服务器解析起来也很麻烦）

#### 2.content-length

文件大小和长度

#### 3.keep-alive

http 是基于 TCP 协议的，但是通常在进行一次请求和响应结束后会立刻中断

在 http1.0 中，如果想要继续保持连接：

​- 浏览器需要在请求头中添加 connection: keep-alive

- 服务器需要在响应头中添加 connection:keey-alive

​- 当客户端再次放请求时，就会使用同一个连接，直接一方中断连接

在 http1.1 中，所有连接默认是 connection: keep-alive 的不同的 Web 服务器会有不同的保持 keep-alive 的时间。Node 中默认是**5s**

#### 4.accept-encoding

告知服务器，客户端支持的文件压缩格式，比如 js 文件可以使用 gzip 编码，对应.gz 文件；

##### 5.accept

告知服务器，客户端可接受文件的格式类型；

#### 6.user-agent

客户端相关的信息

## response 对象

write 方法：直接写出数据，但是并没有关闭流；

end 方法：这种方式是写出最后的数据，并且写出后关闭流。

如果没有调用 end 和 close，客户端将会一直等待结果：所以客户端在发送网络请求时，都会设置超时时间。

### 返回状态码

![返回状态码](https://misaka10032.oss-cn-chengdu.aliyuncs.com/Node/09-http/image-20211013163310423.png)

```js
// 设置状态码的两种常见方式
res.statusCode = 400;
res.writeHead(200);
```

### 响应头文件

返回头部信息，主要有两种方式：

res.setHeader：一次写入一个头部信息

res.writeHead：同时写入 header 和 status

```js
res.setHeader("Content-Type", "application/json;charset=utf8");

res.writeHead(200, {
  "Content-Type": "application/json;charset=utf8",
});
```

Header 设置 Content-Type 的作用：默认客户端接收到的是字符串，客户端会按照自己默认的方式进行处理

## http 原生请求

以 GET & POST 为例

```js
http.get("http://localhost:8000", (res) => {
  res.on("data", (data) => {
    console.log(data.toString());
    console.log(JSON.parse(data.toString()));
  });
});
```

```js
const req = http.request(
  {
    method: "POST",
    hostname: "localhost",
    port: 8000,
  },
  (res) => {
    res.on("data", (data) => {
      console.log(data.toString());
      console.log(JSON.parse(data.toString()));
    });
  }
);
```

## 文件上传

请求数据设为二进制，上传的文件 req 请求数据，需要做字符串正则切割

要点：

1、req 设置 encoding，fs.write 是设置 encoding，均为 binary

2、字符串正则切割，图片二进制数据必定位于 Content-Type: image/jpg 之后，截取出来后清除头部多余空格，清除尾部 --boundary--

3、boundary 通过请求头来确定。

4、该方法仅适用于 content-type 为 form-data 时使用。

```js
const http = require("http");
const fs = require("fs");
const qs = require("querystring");
const PORT = 8000;

const server = http.createServer((req, res) => {
    if (req.url === '/upload' && req.method === "POST") {
        req.setEncoding('binary');
        const boundary = req.headers["content-type"].split(';')[1].split('=')[1];
        const fileSize = req.headers["content-length"];

        let body = '';
        let curSize = 0;
        req.on("data", data => {
            body += data;
            curSize += data.length;
            res.write(`文件上传进度：${Math.round(curSize / fileSize * 100)}%\n`);
        });
        req.on("end", () => {
            const payLoad = qs.parse(body, '\r\n', ': ');
            //获取image/jpg的位置
            const type = payLoad["Content-Type"];

            //从image/jpg开始位置截取
            const typeIndex = body.indexOf(type);
            const typeLength = type.length;
            let imageData = body.substring(typeIndex + typeLength);

            //将中间的两个空格去掉
            imageData = imageData.replace(/^\s\s*/, '').replace(`--${boundary}--`, '');
            const fw = fs.createWriteStream("./boo.jpg",{
                encoding: 'binary'
            });
            fw.write(imageData, err => {
                res.end("文件上传完成");
            });
        });
    }
});

server.listen(PORT, () => {
    console.log(`服务器在${PORT}端口启动`);
});
```