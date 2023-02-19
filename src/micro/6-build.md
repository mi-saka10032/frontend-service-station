---
title: 微前端部署
order: 6
category: false
tag:
  - 微前端部署
---

注意：主应用和微应用都是独立开发和部署，即它们都属于不同的仓库和服务

参考链接：https://qiankun.umijs.org/zh/cookbook

## 主微应用同一服务器部署

如果服务器数量有限，或不能跨域等原因需要把主应用和微应用部署到一起

### 通常做法

主应用部署一级目录，微应用部署二/三极目录

微应用想部署在非根目录，打包前需要执行：

1. history 路由的微应用需要设置 base ，值为目录名称，用于独立访问时使用
2. 必须配置 webpack 构建时的 publicPath 为目录名称

### 部署后

1. 微应用的真实访问路径就是微应用的 entry，entry 可以为相对路径
2. 微应用的 entry 路径最后面的 / 不可省略，否则 publicPath 会设置错误，例如子项的访问路径是 `http://localhost:8080/app1`,那么 entry 就是 `http://localhost:8080/app1/`

### 建议方案一

微应用都放在在一个特殊名称（不会和微应用重名）的文件夹下（建议使用）

假设我们有一个主应用和 6 个微应用（分别为 vue-hash、vue-history、react-hash、react-history、angular-hash、angular-history ），打包后如下放置：

```sh
└── html/                     # 根文件夹
    |
    ├── child/                # 存放所有微应用的文件夹
    |   ├── vue-hash/         # 存放微应用 vue-hash 的文件夹
    |   ├── vue-history/      # 存放微应用 vue-history 的文件夹
    |   ├── react-hash/       # 存放微应用 react-hash 的文件夹
    |   ├── react-history/    # 存放微应用 react-history 的文件夹
    |   ├── angular-hash/     # 存放微应用 angular-hash 的文件夹
    |   ├── angular-history/  # 存放微应用 angular-history 的文件夹
    ├── index.html            # 主应用的index.html
    ├── css/                  # 主应用的css文件夹
    ├── js/                   # 主应用的js文件夹
```

此时需要设置微应用构建时的 publicPath 和 history 模式的路由 base，然后才能打包放到对应的目录里。

| 项目            | 路由 base                 | publicPath              | 真实访问路径                                 |
| :-------------- | :------------------------ | :---------------------- | :------------------------------------------- |
| vue-hash        | 无                        | /child/vue-hash/        | `http://localhost:8080/child/vue-hash/`      |
| vue-history     | /child/vue-history/       | /child/vue-history/     | `http://localhost:8080/child/vue-history/`   |
| react-hash      | 无                        | /child/react-hash/      | `http://localhost:8080/child/react-hash/`    |
| react-history   | /child/react-history/     | /child/react-history/   | `http://localhost:8080/child/react-history/` |
| angular-hash    | 无                        | /child/angular-hash/    | `http://localhost:8080/child/vue-hash/`      |
| angular-history | 无/child/angular-history/ | /child/angular-history/ | `http://localhost:8080/child/vue-history/`   |

注意给应用启用 history 模式的配置 nginx：`try_files $uri $uri/ /child/vue-history/index.html;`用以回退页面

### 建议方案二

微应用直接放在二级目录，但是设置特殊的路径匹配规则

```sh
└── html/                     # 根文件夹
    |
    ├── vue-hash/             # 存放微应用 vue-hash 的文件夹
    ├── vue-history/          # 存放微应用 vue-history 的文件夹
    ├── react-hash/           # 存放微应用 react-hash 的文件夹
    ├── react-history/        # 存放微应用 react-history 的文件夹
    ├── angular-hash/         # 存放微应用 angular-hash 的文件夹
    ├── angular-history/      # 存放微应用 angular-history 的文件夹
    ├── index.html            # 主应用的index.html
    ├── css/                  # 主应用的css文件夹
    ├── js/                   # 主应用的js文件夹
```

基本操作和上面是一样的，只要**保证路径匹配规则和微应用的存放路径名不一样**即可。

## 主微应用在不同服务器

一般这么做是因为不允许主应用跨域访问微应用，做法就是将主应用服务器上一个特殊路径的请求全部转发到微应用的服务器上，即通过代理实现“微应用部署在主应用服务器上”的效果。

例如，主应用在 A 服务器，微应用在 B 服务器，使用路径 /app1 来区分微应用，即 A 服务器上所有 /app1 开头的请求都转发到 B 服务器上

```conf
/app1/ {
  proxy_pass http://www.b.com/app1/;
  proxy_set_header Host $host:$server_port;
}
```

主应用注册微应用时，entry 可以为相对路径，路径匹配规则不可以和 entry 一样（否则主应用页面刷新就变成微应用）

```js
registerMicroApps([
  {
    name: 'app1',
    entry: '/app1/', // http://localhost:8080/app1/
    container: '#container',
    activeRule: '/child-app1',
  },
],
```

注意微应用打包的 publicPath 还是要带上，否则无法正常独立访问