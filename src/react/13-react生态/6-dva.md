---
title: Dva
order: 6
category: false
tag:
  - Dva
  - 全局状态管理
  - 请求统一管理
---

Dva 是国人开发的 redux 库，API 数量降至 6 个，更进一步简化了 redux 操作

注意：Dva 近期已经没有维护了，建议使用 Umi

## 介绍

dva 首先是一个基于 redux 和 redux-saga 的数据流方案，然后为了简化开发体验，dva 还内置了 react-router 和 fetch，算是一个轻量级的应用框架

dva = React-Router + Redux + Redux-saga

## 最简结构

下面是附带了同步、异步 redux 操作、路由注册在内的最简 dva 结构

```jsx
// 创建应用
const app = dva();

// 注册 Model
app.model({
  namespace: "count",
  state: 0,
  reducers: {
    add(state) {
      return state + 1;
    },
  },
  effects: {
    *addAfter1Second(action, { call, put }) {
      yield call(delay, 1000);
      yield put({ type: "add" });
    },
  },
});

// 注册视图
app.router(() => <ConnectedApp />);

// 启动应用
app.start("#root");
```

## 配置 antd

```txt
1、安装
	cnpm install antd babel-plugin-import --save

2、在项目的.webpackrc文件添加
	{
	  "extraBabelPlugins": [
	    ["import", { "libraryName": "antd", "libraryDirectory": "es", "style": "css" }]
	  ]
	}
```

## dva/router

以下是一个 dva 框架对路由的操作全流程

```txt
1、引入
	import { Router, Route, Switch } from 'dva/router';

2、使用
	import React from 'react';
	import { Router, Route, Switch } from 'dva/router';
	import IndexPage from './routes/IndexPage/IndexPage';
	import ProductPage from './routes/ProductPage/index'

	function RouterConfig({ history }) {
	  return (
	    <Router history={history}>
	      <Switch>
	        <Route path="/" exact component={IndexPage} />
	        <Route path="/product" exact component={ProductPage} />
	      </Switch>
	    </Router>
	  );
	}

	export default RouterConfig;

3、注册路由,在index.js中

	app.router(require('./router').default);   .default将路由的RouterConfig配置出来

4、若将Hash路由模式替换成BrowserHistory

	1、安装
		cnpm install --save history

	2、在主入口文件index.js中
		import { createBrowserHistory as createHistory } from 'history';

	3、改写初始化app
		const app = dva({
		    history: createHistory(),
		});

5、路由导航(除了routerRedux和引入方式,其余和react导航相同)

	声明式导航:
		import {Link,NavLink} from 'dva/router'
		 <Link to='/'>跳转</Link>
		 <NavLink to='/'>跳转</NavLink>

	编程式导航:
		方式一:
			this.props.history.push('/url')

		方式二:
			import {routerRedux} from 'dva/router'

			this.props.dispatch(routerRedux.push('/'));
			 其中:
				此种方法不能连接model的方法
				即export default connect(mapStateToProps)(App),不能有mapDispatchToProps,否则dispatch会未定义
```

## dva/model

流程分析：

```txt
1、在model文件夹下创建.js文件
	其中这些文件会识别为model文件
		src/models下的文件
		src/pages/models下的文件
		src/pages下所有model.ts文件

2、创建model(即reducer)

	export default{
	    namespace:'model名称',
	    state:数据初始值,
	    	其中:
	    		优先级低于app中设置的初始值
    			const app = dva({
				  initialState: { count: 1 },
				});
	    reducers:{  同步方法
	        xx(state,action){
	        	改变state的方法
	        },
	        xxx(state,action){
	        	改变state的方法
	        }
	    },
	   effects:{  异步方法
			*xx({获取参数名1,获取参数名2,...},{call,put})
			{
				const res=yield call(异步方法,参数1,参数2,...);
				异步请求数据后,调用同步方法改变model中的数据
				yield put({type:'同步方法名',数据})
			}
		},
	   subscriptions:{  订阅监听,在app.start()时被执行
		    xx({ history, dispatch }) {

		      监听路由
		      history.listen(({ pathname }) => {
		        if (pathname === '/') {
		        	...
		          dispatch({ type: 'xx' });
		        }
		      });

			 监听窗口变化
			 window.onresize=()=>{...}

		}
	}

3、在主入口文件index.js中注册model
	app.model(require('./models/model文件').default);

4、组件连接model(和react-redux写法相同)
	import {connect} from 'dva'

	import React,{Component} from 'react'
	import {connect} from 'dva'

	class App extends Component{
	    render()
	    {
	    	...
	    }
	}

	获取model中的状态
	const mapStateToProps=(state)=>{
	    return {
	        productList:state.模块名
	    }
	}

	分发action(若添加了该参数,则this.props.dispatch无效,不添加可以获取)
	const mapDispatchToProps=(dispatch)=>{
	    return {
	       x()
	       {
	           dispatch({
		            type:'模块名/方法名',
		            数据
	        	})
	       }
	    }
	}

	this.props.名称调用

	export default connect(mapStateToProps,mapDispatchToProps)(App)

5、合并多个model
	(1)在models下创建index.js入口文件,并添加以下内容

		const context=require.context('./',false,/\.js$/);
		export default context
		    .keys()
		    .filter(item=>item!=='./index.js')
		    .map(key=>context(key));

	(2)在index主入口文件,修改app.model为
		require('./models').default.forEach(key=>app.model(key.default));
```

使用案例：

```js
// model.js
import * as api from "../services/example";

export default {
  namespace: "product",
  state: {
    productList: [
      {
        name: "jeff",
      },
      { name: "jack" },
    ],
  },
  reducers: {
    updateList(state, action) {
      let currenProductList = deepClone(state);
      currenProductList.productList.push(action.payload);
      return currenProductList;
    },
  },
  effects: {
    *asyncFun({ payload }, { call, put }) {
      yield put({ type: "updateList", payload });
    },
    *asyncPro({ payload }, { call, put }) {
      const res = yield call(api.getProduct, payload);

      yield put({ type: "updateList", payload: res.data });
    },
  },
  subscriptions: {
    setup({ history, dispatch }) {
      // 监听 history 变化，当进入 `/` 时触发 `load` action
      history.listen(({ pathname }) => {
        if (pathname === "/") {
          console.log("aa");
          //   dispatch({ type: 'load' });
        }
      });
    },
  },
};

//深拷贝方法
function deepClone(arr) {
  let _obj = JSON.stringify(arr),
    objClone = JSON.parse(_obj);

  return objClone;
}
```

```js
// view.js 视图组件
import React, { Component } from "react";
import { connect } from "dva";
import Product from "../../components/Product";
import { Link, NavLink, routerRedux } from "dva/router";

class App extends Component {
  go = () => {
    this.props.history.push("/");
  };

  go2 = () => {
    this.props.dispatch(routerRedux.push("/"));
  };

  go3 = () => {
    this.props.addAsync({ name: "eason" });
  };

  render() {
    const { productList, dispatch } = this.props;

    return (
      <div>
        <Product dispatch={dispatch} productList={productList} />
        <button
          onClick={() => {
            this.props.add();
          }}
        >
          添加2
        </button>
        <Link to="/">跳转</Link>
        <NavLink to="/">跳转2</NavLink>
        <button onClick={this.go}>编程式跳转</button>
        <button onClick={this.go2}>router-redux</button>
        <button onClick={this.go3}>异步</button>
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    productList: state.product,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    add() {
      dispatch({
        type: "product/updateList",
        payload: { name: "tom" },
      });
    },
    addAsync(payload) {
      console.log(payload);
      dispatch({
        type: "product/asyncFun",
        payload: payload,
      });
    },
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(App);
```

```js
// 入口文件
import dva from "dva";
import "./index.css";
// import createHistory from 'history/createBrowserHistory';
import { createBrowserHistory as createHistory } from "history";

// 1. Initialize
const app = dva({
  history: createHistory(),
});
// const app=dva();

// 2. Plugins
// app.use({});

// 3. Model
app.model(require("./models/example").default);
app.model(require("./models/product").default);

// 4. Router
app.router(require("./router").default);

// 5. Start
app.start("#root");
```
