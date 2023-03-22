---
title: JSX结构
order: 1
category: false
tag:
  - JSX
  - babel
---

## babel

JSX 是一个 JS 的语法扩展，能更好地描述 UI 应该呈现出它应有交互的本质形式

`astexplorer`可以把 JSX 代码转换成 AST 语法树

`react/jsx-runtime`和`react/jsx-dev-runtime`中的函数只能由编译器转换使用。如果需要在代码中手动创建元素，可以使用`React.createElement`

这里我们借助 babel 插件，简便地实现模板 JSX 代码转换

```sh
pnpm i -D @babel/core @babel/plugin-transform-react-jsx
```

```js
// oldjsx.js 在React17以前的老式babel转换写法
const babel = require("@babel/core");
const sourceCode = `
<h1>
  hello<span style={{ color: 'red' }}>world</span>
</h1>
`;

const result = babel.transform(sourceCode, {
  plugins: [["@babel/plugin-transform-react-jsx", { runtime: "classic" }]],
});

console.log(result.code);
```

```console
/*#__PURE__*/React.createElement("h1", null, "hello", /*#__PURE__*/React.createElement("span", {
  style: {
    color: 'red'
  }
}, "world"));
```

```js
// React18新jsx转换写法
const babel = require("@babel/core");
const React = require("react");
const sourceCode = `
<h1>
  hello<span style={{ color: 'red' }}>world</span>
</h1>
`;

const result = babel.transform(sourceCode, {
  plugins: [
    ["@babel/plugin-transform-react-jsx", { runtime: "automatic" }], // automatic
  ],
});

console.log(result.code);
```

```console
import { jsx } from "react/jsx-runtime";
import { jsxs } from "react/jsx-runtime";
/*#__PURE__*/_jsxs("h1", {
    children: ["hello", /*#__PURE__*/_jsx("span", {
        style: {
            color: 'red'
        },
        children: "world"
    })]
});
```

## 转译过程

![ReactJSX 转译过程](https://misaka10032.oss-cn-chengdu.aliyuncs.com/React/react-jsx.png)

React18 的 babel 转译 JSX 的实质为：

1. 执行 babel 转换，将 JSX 文件内函数的返回值转换为形似 `{"h1", { children: []}}`的 AST 语法树
2. 输出一个字符串，携带内容包括
   1. import 导入 react/jsx-runtime 的转换方法`jsx`、`jsxs`
   2. 传入 AST 语法树，调用转换方法`jsxs`
3. 默认对上述的代码块字符串内容执行 eval，最终输出虚拟 DOM 对象

- 这里由于我们处在开发环境，所以代码块中`import { jsx } from "react/jsx-runtime";`实际上会变成`import { jsxDEV } from "react/jsx-dev-runtime";`

- 在`src/react`文件夹下手写实现`jsx-dev-runtime`，实现 dev 环境下的 jsx 转换

- 代码块中导入路径`react/jsx-dev-runtime`通过在`vite.config.js`中覆写`resolve.alias`配置来实现路径劫持

![JSX项目路径](https://misaka10032.oss-cn-chengdu.aliyuncs.com/React/jsx-path.png)

vite.config.js

```js
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      react: path.resolve("src/react"),
      "react-dom": path.resolve("src/react-dom"),
      "react-reconciler": path.resolve("src/react-reconciler"),
      scheduler: path.resolve("src/scheduler"),
      shared: path.resolve("src/shared"),
    },
  },
});
```

jsconfig.json

```json
{
  "compilerOptions": {
    "baseUrl": "./",
    "paths": {
      "react/*": ["src/react/*"],
      "react-dom/*": ["src/react-dom/*"],
      "react-reconciler/*": ["src/react-reconciler/*"],
      "scheduler/*": ["src/scheduler/*"],
      "shared/*": ["src/shared/*"]
    }
  },
  "exclude": ["node_modules", "dist"]
}
```

## 源码

手动实现 JSX-VDOM 的源码

**注意：模板字符串 JSX 转换为 AST 语法树的步骤已经交由 babel 自动执行，children 元素嵌套编译，此处仅为 VDOM 的输出方法代码**

### jsx-dev-runtime.js

```js
export { jsxDEV } from "react/ReactJSXElement";
```

### ReactJSXElement.js

```js
// 从react源码中获取工具方法和变量
import hasOwnProperty from "shared/hasOwnProperty.js";
import { REACT_ELEMENT_TYPE } from "shared/ReactSymbols";

const RESERVED_PROPS = {
  key: true,
  ref: true,
  __self: true,
  __source: true,
};

function hasValidKey(config) {
  return config.key !== undefined;
}

function hasValidRef(config) {
  return config.ref !== undefined;
}

function ReactElement(type, key, ref, props) {
  return {
    // React元素，也称为虚拟DOM
    $$typeof: REACT_ELEMENT_TYPE,
    type, // h1 span
    key, // 唯一标识
    ref, // 获取真实DOM
    props, // 属性：children,style,id等
  };
}

export function jsxDEV(type, config) {
  debugger;
  let propName; // 属性名
  const props = {}; // 属性对象
  let key = null; // 可选key，区分父节点下不同子节点
  let ref = null; // 引入，可通过ref获取真实DOM的需求
  if (hasValidKey(config)) {
    key = config.key;
  }
  if (hasValidRef(config)) {
    ref = config.ref;
  }
  for (propName in config) {
    if (
      hasOwnProperty.call(config, propName) &&
      !hasOwnProperty.call(RESERVED_PROPS, propName)
    ) {
      props[propName] = config[propName];
    }
  }
  return ReactElement(type, key, ref, props); // 输出虚拟DOM
}
```

### main.jsx

```jsx
const element = (
  <h1>
    hello<span style={{ color: "red" }}>world</span>
  </h1>
);

console.log(element);
```

### 输出结果

![JSX输出结果](https://misaka10032.oss-cn-chengdu.aliyuncs.com/React/jsx-result.png)

手写源码仓库：

https://github.com/mi-saka10032/mini-react/tree/master/packages/jsx