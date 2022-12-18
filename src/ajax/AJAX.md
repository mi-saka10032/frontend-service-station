---
title: AJAX
order: 1
category: false
tag:
  - Ajax
  - HTTP协议
  - 跨域
---

全称：Asynchronous JavaScript and XML（异步的 JavaScript 和 XML）

## 简介

AJAX 是一种在无需重新加载整个网页的情况下，能够更新部分页面内容的新方法。

局部刷新技术：

1.JavaScript

2.DOM

3.CSS

4.servlet

5.json，之前是 xml。

上面技术的综合使用叫做 AJAX

### 核心

Ajax 核心是 javascript 和 xml（json）：使用 JS 操作异步对象 XMLHttpRequest，和服务器交换使用 json 数据格式，使用 Ajax 实现局部更新。

### 优点

1）可以无需刷新页面与服务器端进行通信。

2）允许你根据用户事件来更新部分页面内容。

### 缺点

1）没有浏览历史，不能回退

2）存在跨域问题（同源）

3）SEO 不友好

## HTTP 协议

Hypertext transport protocol 协议（超文本传输协议），协议详细规定了浏览器和万维网服务器之间互相通信的规则。

### 请求报文

| 结构 | 描述                                                                                                                      |
| :--- | :------------------------------------------------------------------------------------------------------------------------ |
| 行   | 请求方式（GET/POST）<br>url 路径 协议版本 HTTP/1.1                                                                        |
| 头   | Host：atguigu.com<br>Cookie：name=guigu<br>Content-type：application/x-www-form-urlencoded<br>User-Agent：chrome 83<br>…… |
| 空行 |                                                                                                                           |
| 体   | 请求数据 data（?id=xxx&name=xxx）                                                                                         |

### 响应报文

| 结构 | 描述                                                                                          |
| :--- | :-------------------------------------------------------------------------------------------- |
| 行   | HTTP/1.1 200 OK                                                                               |
| 头   | Content-Type：text/html;charset=utf-8<br>Content-length：2048<br>Content-encoding：gzip<br>…… |
| 空行 |
| 体   | `<html><head>****xxx</html>`                                                                  |

## AJAX 基本操作（原生）

```html
<div id="result"></div>
<button id="btn">点点点</button>
<script>
  const res = document.getElementById("result");
  const btn = document.getElementById("btn");
  btn.onclick = function () {
    //1.创建对象
    const xhr = new XMLHttpRequest();
    //2.初始化，设置请求方法和url
    xhr.open("GET", "http://127.0.0.1:6060/server");
    //3.发送
    xhr.send();
    //4.事件绑定 处理服务端返回的结果
    //readystate 是xhr对象中的属性，状态0 1 2 3 4
    xhr.onreadystatechange = function () {
      //判断 服务端返回了所有的结果 状态4
      if (xhr.readyState === 4) {
        //判断响应状态码 200 404 403 401 500
        //2xx 表示成功
        if (xhr.status >= 200 && xhr.status <= 300) {
          //处理结果 行 头 空行 体
          //1.响应行
          console.log(xhr.status); //状态码
          console.log(xhr.statusText); //状态字符串
          console.log(xhr.getAllResponseHeaders()); //所有响应头
          console.log(xhr.response); //响应体

          //设置res的文本
          res.innerHTML = xhr.response;
        }
      }
    };
  };
</script>
```

### 设置 query 参数的方式

url 后面添加 "?" + "key=value" & "key=value"，以此类推。

### POST 设置请求体的方式

```javascript
xhr.send("a=100&b=200&c=300");
```

### 设置请求头信息

```javascript
xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
```

自定义请求头信息，需要服务端配置 all 请求方式，以及

```javascript
response.setHeader("Access-Control-Allow-Headers", "*");
```

### 服务端响应 JSON 数据

```javascript
xhr.responseType = "json";
```

### get 请求 ajax 不会自动刷新

请求行 url 后缀加上 Date.now() 添加时间戳，保证 url 不重复

### 超时设置

xhr.timeout = 2000;

2s 后若没有无响应数据返回，则 Status 变为 canceled

xhr.onTimeout 超时响应事件

### 取消请求

xhr.abort();

## jQuery 的 AJAX 方法

通用型

```javascript
$("#btn").click(function () {
  $.ajax({
    //url
    url: "http://127.0.0.1:6060/delay",
    //参数
    data: { a: 100, b: 200 },
    //请求类型
    type: "GET",
    //响应数据类型
    dataType: "json",
    //成功的回调
    success: function (data) {
      console.log(data.name);
    },
    error: function (err) {
      console.log(err);
    },
    headers: {
      a: 200,
      b: 300,
    },
  });
});
```

常用方法见上。

## axios 的 AJAX 方法

### express 服务端

```javascript
app.all("/axios-server", (request, response) => {
  //允许跨域
  response.setHeader("Access-Control-Allow-Origin", "*");
  response.setHeader("Access-Control-Allow-Headers", "*");
  //设置响应体
  response.send({ name: "axios 欢迎" });
});

//4.监听端口启动服务
app.listen(6060, () => {
  console.log("服务已启动");
});
```

### 客户端

```javascript
<body>
<button>GET</button>
<button>POST</button>
<button>AJAX</button>
<script>
    const btns = document.getElementsByTagName("button");
    //配置baseURL
    axios.defaults.baseURL = 'http://127.0.0.1:6060';
    btns[0].onclick = function () {
        axios.get('/axios-server', {
            //参数
            params: {
                id: 100,
                vip: 7
            },
            //请求头
            headers: {
                name: "YZH",
                age: 18
            }
            //then方法返回响应体
        }).then(value => {
            console.log(value.data);
        });
    };
    btns[1].onclick = function () {
        axios.post('/axios-server', {
            username: 'admin',
            password: 'admin'
        }, {
            //参数
            params: {
                id: 100,
                vip: 7
            },
            //请求头
            headers: {
                name: "YZH",
                age: 18
            }
            //then方法返回响应体
        }).then(value => {
            console.log(value.data);
        });
    };
</script>
</body>
```

### 通用型方法

```javascript
btns[2].onclick = function () {
  axios({
    method: "POST",
    url: "/axios-server",
    params: {
      vip: 10,
      level: 30,
    },
    headers: {
      a: 100,
      b: 200,
    },
    data: {
      username: "admin",
      password: "admin",
    },
  }).then((response) => {
    console.log(response);
    //响应状态码
    console.log(response.status);
    //响应状态字符串
    console.log(response.statusText);
    //响应头信息
    console.log(response.headers);
    //响应体
    console.log(response.data);
  });
};
```

## fetch 函数

```javascript
<body>
  <button>AJAX请求</button>
  <script>
    const btn = document.querySelector("button"); btn.onclick = function (){" "}
    {fetch("http://127.0.0.1:6060/fetch-server", {
      //方法
      method: "POST",
      //请求头
      headers: {
        name: "YZH",
      },
      body: "username=admin&password=admin",
    })
      .then((response) => {
        return response.json();
      })
      .then((response) => {
        console.log(response);
      })}
    ;
  </script>
</body>
```

需要注意的是 fetch()请求方法和 response.json()返回值均为 Promise 对象。

## 跨域（重要）

### 同源策略

同源策略（Same-Origin Policy）最早由 Netscape 公司提出，是浏览器的一种安全策略。

同源：协议、域名、端口号 必须完全相同。

违背同源策略就是跨域。

### 如何解决跨域

#### JSONP

JSON with Padding，是一个非官方的跨域解决方案，只支持 get 请求。

1. 工作原理

网页中一些标签天生具有跨域能力，如 img link iframe script

​JSONP 是利用 script 标签的跨域能力来发送请求的。

2. 使用

- 动态创建一个 script 标签

​- 设置 script 的 src，设置回调函数

​- JSONP 返回结果的形式是函数调用，函数的参数就是服务器给客户端返回的响应数据，函数需要提前声明（原生写法）

3. 代码

客户端

```javascript
<body>
<input type="text">
<p></p>
<script>
    const input = document.querySelector("input");
    const p = document.querySelector("p");

    function handle(data) {
        input.style.border = '1px solid #f00';
        p.innerHTML = data.msg;
    }

    input.onblur = function () {
        let username = this.value;
        const script = document.createElement("script");
        script.src = 'http://127.0.0.1:6060/check-username';
        document.body.appendChild(script);
    };
</script>
</body>
```

服务端

```javascript
app.all("/check-username", (request, response) => {
  const data = {
    exist: 1,
    msg: "用户名已存在",
  };
  const str = JSON.stringify(data);
  response.send(`handle(${str})`);
});
```

4. jQuery 的 JSONP 写法

客户端

```javascript
<script src="./jQuery-3.6.0.js"></script>
<body>
<button>jQuery的jsonp</button>
<p id="name"></p>
<p id="msg"></p>
<script>
    $("button").click(function () {
        $.getJSON('http://127.0.0.1:6060/jquery-jsonp-server?callback=?', function (data) {
            $("#name").html(data.name);
            $("#msg").html(data.msg);
        });
    });
</script>
</body>
```

注意：url 最后必须加上 ?callback=? 的后缀，服务端需要识别并提取该回调函数的字符串值，用于传回客户端。

服务端

```javascript
app.all("/jquery-jsonp-server", (request, response) => {
  const data = {
    name: "YZH",
    msg: "欢迎",
  };
  const callBack = request.query.callback; //提取query字符串的回调函数字符串编码
  const str = JSON.stringify(data);
  response.send(`${callBack}(${str})`);
});
```

#### CORS

Cross-Origin Resource Sharing，跨域资源共享。CORS是官方的跨域解决方案，它的特点是不需要在客户端做任何特殊的操作，完全在服务器中进行处理，支持get和post请求。跨域资源共享标准新增了一组HTTP首部字段，允许服务器声明哪些源站通过浏览器有权限访问哪些资源

CORS是通过设置一个响应头来告诉浏览器，该请求允许跨域，浏览器收到该响应后对响应放行。

服务端设置：

```javascript
response.setHeader('Access-Control-Allow-Origin', '*');
response.setHeader('Access-Control-Allow-Headers', '*');
response.setHeader('Access-Control-Allow-Method', '*');
```

#### 反向代理（重要）

实际项目中常用web服务器(tomcat、nginx)的反向代理实现跨域

![nginx代理](https://misaka10032.oss-cn-chengdu.aliyuncs.com/AJAX/nginx%E4%BB%A3%E7%90%86.webp)

首先我们用nginx作为代理服务器和用户交互，这样用户就只需要在80端口上进行交互就可以了，这样就避免了跨域问题，因为我们都是在80端口上进行交互的

```nginx
server {

        listen      80; #监听80端口，可以改成其他端口

        server_name  localhost; # 当前服务的域名

        #charset koi8-r;

        #access_log  logs/host.access.log  main;

        location / {

            proxy_pass http://localhost:81;

            proxy_redirect default;

        }

location /apis { #添加访问目录为/apis的代理配置

rewrite  ^/apis/(.*)$ /$1 break;

proxy_pass  http://localhost:82;

      }

#以下配置省略
```

1.当用户发送localhost:80/时会被nginx转发到http://localhost:81服务；

2.当界面请求接口数据时，只要以/apis 为开头，就会被nginx转发到后端接口服务器上；

总结：nginx实现跨域的原理，实际就是把web项目和后端接口项目放到一个域中，这样就不存在跨域问题，然后根据请求地址去请求不同服务器（真正干活的服务器）；