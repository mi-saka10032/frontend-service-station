import{_ as n}from"./_plugin-vue_export-helper.cdc0426e.js";import{o as s,c as a,d as t}from"./app.acfbf946.js";const p={},e=t(`<p>Dva 是国人开发的 redux 库，API 数量降至 6 个，更进一步简化了 redux 操作</p><p>注意：Dva 近期已经没有维护了，建议使用 Umi</p><h2 id="介绍" tabindex="-1"><a class="header-anchor" href="#介绍" aria-hidden="true">#</a> 介绍</h2><p>dva 首先是一个基于 redux 和 redux-saga 的数据流方案，然后为了简化开发体验，dva 还内置了 react-router 和 fetch，算是一个轻量级的应用框架</p><p>dva = React-Router + Redux + Redux-saga</p><h2 id="最简结构" tabindex="-1"><a class="header-anchor" href="#最简结构" aria-hidden="true">#</a> 最简结构</h2><p>下面是附带了同步、异步 redux 操作、路由注册在内的最简 dva 结构</p><div class="language-jsx line-numbers-mode" data-ext="jsx"><pre class="language-jsx"><code><span class="token comment">// 创建应用</span>
<span class="token keyword">const</span> app <span class="token operator">=</span> <span class="token function">dva</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span>

<span class="token comment">// 注册 Model</span>
app<span class="token punctuation">.</span><span class="token function">model</span><span class="token punctuation">(</span><span class="token punctuation">{</span>
  <span class="token literal-property property">namespace</span><span class="token operator">:</span> <span class="token string">&quot;count&quot;</span><span class="token punctuation">,</span>
  <span class="token literal-property property">state</span><span class="token operator">:</span> <span class="token number">0</span><span class="token punctuation">,</span>
  <span class="token literal-property property">reducers</span><span class="token operator">:</span> <span class="token punctuation">{</span>
    <span class="token function">add</span><span class="token punctuation">(</span><span class="token parameter">state</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
      <span class="token keyword">return</span> state <span class="token operator">+</span> <span class="token number">1</span><span class="token punctuation">;</span>
    <span class="token punctuation">}</span><span class="token punctuation">,</span>
  <span class="token punctuation">}</span><span class="token punctuation">,</span>
  <span class="token literal-property property">effects</span><span class="token operator">:</span> <span class="token punctuation">{</span>
    <span class="token operator">*</span><span class="token function">addAfter1Second</span><span class="token punctuation">(</span><span class="token parameter">action<span class="token punctuation">,</span> <span class="token punctuation">{</span> call<span class="token punctuation">,</span> put <span class="token punctuation">}</span></span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
      <span class="token keyword">yield</span> <span class="token function">call</span><span class="token punctuation">(</span>delay<span class="token punctuation">,</span> <span class="token number">1000</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
      <span class="token keyword">yield</span> <span class="token function">put</span><span class="token punctuation">(</span><span class="token punctuation">{</span> <span class="token literal-property property">type</span><span class="token operator">:</span> <span class="token string">&quot;add&quot;</span> <span class="token punctuation">}</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
    <span class="token punctuation">}</span><span class="token punctuation">,</span>
  <span class="token punctuation">}</span><span class="token punctuation">,</span>
<span class="token punctuation">}</span><span class="token punctuation">)</span><span class="token punctuation">;</span>

<span class="token comment">// 注册视图</span>
app<span class="token punctuation">.</span><span class="token function">router</span><span class="token punctuation">(</span><span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token operator">=&gt;</span> <span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span><span class="token class-name">ConnectedApp</span></span> <span class="token punctuation">/&gt;</span></span><span class="token punctuation">)</span><span class="token punctuation">;</span>

<span class="token comment">// 启动应用</span>
app<span class="token punctuation">.</span><span class="token function">start</span><span class="token punctuation">(</span><span class="token string">&quot;#root&quot;</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h2 id="配置-antd" tabindex="-1"><a class="header-anchor" href="#配置-antd" aria-hidden="true">#</a> 配置 antd</h2><div class="language-txt line-numbers-mode" data-ext="txt"><pre class="language-txt"><code>1、安装
	cnpm install antd babel-plugin-import --save

2、在项目的.webpackrc文件添加
	{
	  &quot;extraBabelPlugins&quot;: [
	    [&quot;import&quot;, { &quot;libraryName&quot;: &quot;antd&quot;, &quot;libraryDirectory&quot;: &quot;es&quot;, &quot;style&quot;: &quot;css&quot; }]
	  ]
	}
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h2 id="dva-router" tabindex="-1"><a class="header-anchor" href="#dva-router" aria-hidden="true">#</a> dva/router</h2><p>以下是一个 dva 框架对路由的操作全流程</p><div class="language-txt line-numbers-mode" data-ext="txt"><pre class="language-txt"><code>1、引入
	import { Router, Route, Switch } from &#39;dva/router&#39;;

2、使用
	import React from &#39;react&#39;;
	import { Router, Route, Switch } from &#39;dva/router&#39;;
	import IndexPage from &#39;./routes/IndexPage/IndexPage&#39;;
	import ProductPage from &#39;./routes/ProductPage/index&#39;

	function RouterConfig({ history }) {
	  return (
	    &lt;Router history={history}&gt;
	      &lt;Switch&gt;
	        &lt;Route path=&quot;/&quot; exact component={IndexPage} /&gt;
	        &lt;Route path=&quot;/product&quot; exact component={ProductPage} /&gt;
	      &lt;/Switch&gt;
	    &lt;/Router&gt;
	  );
	}

	export default RouterConfig;

3、注册路由,在index.js中

	app.router(require(&#39;./router&#39;).default);   .default将路由的RouterConfig配置出来

4、若将Hash路由模式替换成BrowserHistory

	1、安装
		cnpm install --save history

	2、在主入口文件index.js中
		import { createBrowserHistory as createHistory } from &#39;history&#39;;

	3、改写初始化app
		const app = dva({
		    history: createHistory(),
		});

5、路由导航(除了routerRedux和引入方式,其余和react导航相同)

	声明式导航:
		import {Link,NavLink} from &#39;dva/router&#39;
		 &lt;Link to=&#39;/&#39;&gt;跳转&lt;/Link&gt;
		 &lt;NavLink to=&#39;/&#39;&gt;跳转&lt;/NavLink&gt;

	编程式导航:
		方式一:
			this.props.history.push(&#39;/url&#39;)

		方式二:
			import {routerRedux} from &#39;dva/router&#39;

			this.props.dispatch(routerRedux.push(&#39;/&#39;));
			 其中:
				此种方法不能连接model的方法
				即export default connect(mapStateToProps)(App),不能有mapDispatchToProps,否则dispatch会未定义
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h2 id="dva-model" tabindex="-1"><a class="header-anchor" href="#dva-model" aria-hidden="true">#</a> dva/model</h2><p>流程分析：</p><div class="language-txt line-numbers-mode" data-ext="txt"><pre class="language-txt"><code>1、在model文件夹下创建.js文件
	其中这些文件会识别为model文件
		src/models下的文件
		src/pages/models下的文件
		src/pages下所有model.ts文件

2、创建model(即reducer)

	export default{
	    namespace:&#39;model名称&#39;,
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
				yield put({type:&#39;同步方法名&#39;,数据})
			}
		},
	   subscriptions:{  订阅监听,在app.start()时被执行
		    xx({ history, dispatch }) {

		      监听路由
		      history.listen(({ pathname }) =&gt; {
		        if (pathname === &#39;/&#39;) {
		        	...
		          dispatch({ type: &#39;xx&#39; });
		        }
		      });

			 监听窗口变化
			 window.onresize=()=&gt;{...}

		}
	}

3、在主入口文件index.js中注册model
	app.model(require(&#39;./models/model文件&#39;).default);

4、组件连接model(和react-redux写法相同)
	import {connect} from &#39;dva&#39;

	import React,{Component} from &#39;react&#39;
	import {connect} from &#39;dva&#39;

	class App extends Component{
	    render()
	    {
	    	...
	    }
	}

	获取model中的状态
	const mapStateToProps=(state)=&gt;{
	    return {
	        productList:state.模块名
	    }
	}

	分发action(若添加了该参数,则this.props.dispatch无效,不添加可以获取)
	const mapDispatchToProps=(dispatch)=&gt;{
	    return {
	       x()
	       {
	           dispatch({
		            type:&#39;模块名/方法名&#39;,
		            数据
	        	})
	       }
	    }
	}

	this.props.名称调用

	export default connect(mapStateToProps,mapDispatchToProps)(App)

5、合并多个model
	(1)在models下创建index.js入口文件,并添加以下内容

		const context=require.context(&#39;./&#39;,false,/\\.js$/);
		export default context
		    .keys()
		    .filter(item=&gt;item!==&#39;./index.js&#39;)
		    .map(key=&gt;context(key));

	(2)在index主入口文件,修改app.model为
		require(&#39;./models&#39;).default.forEach(key=&gt;app.model(key.default));
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>使用案例：</p><div class="language-javascript line-numbers-mode" data-ext="js"><pre class="language-javascript"><code><span class="token comment">// model.js</span>
<span class="token keyword">import</span> <span class="token operator">*</span> <span class="token keyword">as</span> api <span class="token keyword">from</span> <span class="token string">&quot;../services/example&quot;</span><span class="token punctuation">;</span>

<span class="token keyword">export</span> <span class="token keyword">default</span> <span class="token punctuation">{</span>
  <span class="token literal-property property">namespace</span><span class="token operator">:</span> <span class="token string">&quot;product&quot;</span><span class="token punctuation">,</span>
  <span class="token literal-property property">state</span><span class="token operator">:</span> <span class="token punctuation">{</span>
    <span class="token literal-property property">productList</span><span class="token operator">:</span> <span class="token punctuation">[</span>
      <span class="token punctuation">{</span>
        <span class="token literal-property property">name</span><span class="token operator">:</span> <span class="token string">&quot;jeff&quot;</span><span class="token punctuation">,</span>
      <span class="token punctuation">}</span><span class="token punctuation">,</span>
      <span class="token punctuation">{</span> <span class="token literal-property property">name</span><span class="token operator">:</span> <span class="token string">&quot;jack&quot;</span> <span class="token punctuation">}</span><span class="token punctuation">,</span>
    <span class="token punctuation">]</span><span class="token punctuation">,</span>
  <span class="token punctuation">}</span><span class="token punctuation">,</span>
  <span class="token literal-property property">reducers</span><span class="token operator">:</span> <span class="token punctuation">{</span>
    <span class="token function">updateList</span><span class="token punctuation">(</span><span class="token parameter">state<span class="token punctuation">,</span> action</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
      <span class="token keyword">let</span> currenProductList <span class="token operator">=</span> <span class="token function">deepClone</span><span class="token punctuation">(</span>state<span class="token punctuation">)</span><span class="token punctuation">;</span>
      currenProductList<span class="token punctuation">.</span>productList<span class="token punctuation">.</span><span class="token function">push</span><span class="token punctuation">(</span>action<span class="token punctuation">.</span>payload<span class="token punctuation">)</span><span class="token punctuation">;</span>
      <span class="token keyword">return</span> currenProductList<span class="token punctuation">;</span>
    <span class="token punctuation">}</span><span class="token punctuation">,</span>
  <span class="token punctuation">}</span><span class="token punctuation">,</span>
  <span class="token literal-property property">effects</span><span class="token operator">:</span> <span class="token punctuation">{</span>
    <span class="token operator">*</span><span class="token function">asyncFun</span><span class="token punctuation">(</span><span class="token parameter"><span class="token punctuation">{</span> payload <span class="token punctuation">}</span><span class="token punctuation">,</span> <span class="token punctuation">{</span> call<span class="token punctuation">,</span> put <span class="token punctuation">}</span></span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
      <span class="token keyword">yield</span> <span class="token function">put</span><span class="token punctuation">(</span><span class="token punctuation">{</span> <span class="token literal-property property">type</span><span class="token operator">:</span> <span class="token string">&quot;updateList&quot;</span><span class="token punctuation">,</span> payload <span class="token punctuation">}</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
    <span class="token punctuation">}</span><span class="token punctuation">,</span>
    <span class="token operator">*</span><span class="token function">asyncPro</span><span class="token punctuation">(</span><span class="token parameter"><span class="token punctuation">{</span> payload <span class="token punctuation">}</span><span class="token punctuation">,</span> <span class="token punctuation">{</span> call<span class="token punctuation">,</span> put <span class="token punctuation">}</span></span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
      <span class="token keyword">const</span> res <span class="token operator">=</span> <span class="token keyword">yield</span> <span class="token function">call</span><span class="token punctuation">(</span>api<span class="token punctuation">.</span>getProduct<span class="token punctuation">,</span> payload<span class="token punctuation">)</span><span class="token punctuation">;</span>

      <span class="token keyword">yield</span> <span class="token function">put</span><span class="token punctuation">(</span><span class="token punctuation">{</span> <span class="token literal-property property">type</span><span class="token operator">:</span> <span class="token string">&quot;updateList&quot;</span><span class="token punctuation">,</span> <span class="token literal-property property">payload</span><span class="token operator">:</span> res<span class="token punctuation">.</span>data <span class="token punctuation">}</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
    <span class="token punctuation">}</span><span class="token punctuation">,</span>
  <span class="token punctuation">}</span><span class="token punctuation">,</span>
  <span class="token literal-property property">subscriptions</span><span class="token operator">:</span> <span class="token punctuation">{</span>
    <span class="token function">setup</span><span class="token punctuation">(</span><span class="token parameter"><span class="token punctuation">{</span> history<span class="token punctuation">,</span> dispatch <span class="token punctuation">}</span></span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
      <span class="token comment">// 监听 history 变化，当进入 \`/\` 时触发 \`load\` action</span>
      history<span class="token punctuation">.</span><span class="token function">listen</span><span class="token punctuation">(</span><span class="token punctuation">(</span><span class="token parameter"><span class="token punctuation">{</span> pathname <span class="token punctuation">}</span></span><span class="token punctuation">)</span> <span class="token operator">=&gt;</span> <span class="token punctuation">{</span>
        <span class="token keyword">if</span> <span class="token punctuation">(</span>pathname <span class="token operator">===</span> <span class="token string">&quot;/&quot;</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
          console<span class="token punctuation">.</span><span class="token function">log</span><span class="token punctuation">(</span><span class="token string">&quot;aa&quot;</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
          <span class="token comment">//   dispatch({ type: &#39;load&#39; });</span>
        <span class="token punctuation">}</span>
      <span class="token punctuation">}</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
    <span class="token punctuation">}</span><span class="token punctuation">,</span>
  <span class="token punctuation">}</span><span class="token punctuation">,</span>
<span class="token punctuation">}</span><span class="token punctuation">;</span>

<span class="token comment">//深拷贝方法</span>
<span class="token keyword">function</span> <span class="token function">deepClone</span><span class="token punctuation">(</span><span class="token parameter">arr</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
  <span class="token keyword">let</span> _obj <span class="token operator">=</span> <span class="token constant">JSON</span><span class="token punctuation">.</span><span class="token function">stringify</span><span class="token punctuation">(</span>arr<span class="token punctuation">)</span><span class="token punctuation">,</span>
    objClone <span class="token operator">=</span> <span class="token constant">JSON</span><span class="token punctuation">.</span><span class="token function">parse</span><span class="token punctuation">(</span>_obj<span class="token punctuation">)</span><span class="token punctuation">;</span>

  <span class="token keyword">return</span> objClone<span class="token punctuation">;</span>
<span class="token punctuation">}</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><div class="language-javascript line-numbers-mode" data-ext="js"><pre class="language-javascript"><code><span class="token comment">// view.js 视图组件</span>
<span class="token keyword">import</span> React<span class="token punctuation">,</span> <span class="token punctuation">{</span> Component <span class="token punctuation">}</span> <span class="token keyword">from</span> <span class="token string">&quot;react&quot;</span><span class="token punctuation">;</span>
<span class="token keyword">import</span> <span class="token punctuation">{</span> connect <span class="token punctuation">}</span> <span class="token keyword">from</span> <span class="token string">&quot;dva&quot;</span><span class="token punctuation">;</span>
<span class="token keyword">import</span> Product <span class="token keyword">from</span> <span class="token string">&quot;../../components/Product&quot;</span><span class="token punctuation">;</span>
<span class="token keyword">import</span> <span class="token punctuation">{</span> Link<span class="token punctuation">,</span> NavLink<span class="token punctuation">,</span> routerRedux <span class="token punctuation">}</span> <span class="token keyword">from</span> <span class="token string">&quot;dva/router&quot;</span><span class="token punctuation">;</span>

<span class="token keyword">class</span> <span class="token class-name">App</span> <span class="token keyword">extends</span> <span class="token class-name">Component</span> <span class="token punctuation">{</span>
  <span class="token function-variable function">go</span> <span class="token operator">=</span> <span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token operator">=&gt;</span> <span class="token punctuation">{</span>
    <span class="token keyword">this</span><span class="token punctuation">.</span>props<span class="token punctuation">.</span>history<span class="token punctuation">.</span><span class="token function">push</span><span class="token punctuation">(</span><span class="token string">&quot;/&quot;</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
  <span class="token punctuation">}</span><span class="token punctuation">;</span>

  <span class="token function-variable function">go2</span> <span class="token operator">=</span> <span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token operator">=&gt;</span> <span class="token punctuation">{</span>
    <span class="token keyword">this</span><span class="token punctuation">.</span>props<span class="token punctuation">.</span><span class="token function">dispatch</span><span class="token punctuation">(</span>routerRedux<span class="token punctuation">.</span><span class="token function">push</span><span class="token punctuation">(</span><span class="token string">&quot;/&quot;</span><span class="token punctuation">)</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
  <span class="token punctuation">}</span><span class="token punctuation">;</span>

  <span class="token function-variable function">go3</span> <span class="token operator">=</span> <span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token operator">=&gt;</span> <span class="token punctuation">{</span>
    <span class="token keyword">this</span><span class="token punctuation">.</span>props<span class="token punctuation">.</span><span class="token function">addAsync</span><span class="token punctuation">(</span><span class="token punctuation">{</span> <span class="token literal-property property">name</span><span class="token operator">:</span> <span class="token string">&quot;eason&quot;</span> <span class="token punctuation">}</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
  <span class="token punctuation">}</span><span class="token punctuation">;</span>

  <span class="token function">render</span><span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
    <span class="token keyword">const</span> <span class="token punctuation">{</span> productList<span class="token punctuation">,</span> dispatch <span class="token punctuation">}</span> <span class="token operator">=</span> <span class="token keyword">this</span><span class="token punctuation">.</span>props<span class="token punctuation">;</span>

    <span class="token keyword">return</span> <span class="token punctuation">(</span>
      <span class="token operator">&lt;</span>div<span class="token operator">&gt;</span>
        <span class="token operator">&lt;</span>Product dispatch<span class="token operator">=</span><span class="token punctuation">{</span>dispatch<span class="token punctuation">}</span> productList<span class="token operator">=</span><span class="token punctuation">{</span>productList<span class="token punctuation">}</span> <span class="token operator">/</span><span class="token operator">&gt;</span>
        <span class="token operator">&lt;</span>button
          onClick<span class="token operator">=</span><span class="token punctuation">{</span><span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token operator">=&gt;</span> <span class="token punctuation">{</span>
            <span class="token keyword">this</span><span class="token punctuation">.</span>props<span class="token punctuation">.</span><span class="token function">add</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
          <span class="token punctuation">}</span><span class="token punctuation">}</span>
        <span class="token operator">&gt;</span>
          添加<span class="token number">2</span>
        <span class="token operator">&lt;</span><span class="token operator">/</span>button<span class="token operator">&gt;</span>
        <span class="token operator">&lt;</span>Link to<span class="token operator">=</span><span class="token string">&quot;/&quot;</span><span class="token operator">&gt;</span>跳转<span class="token operator">&lt;</span><span class="token operator">/</span>Link<span class="token operator">&gt;</span>
        <span class="token operator">&lt;</span>NavLink to<span class="token operator">=</span><span class="token string">&quot;/&quot;</span><span class="token operator">&gt;</span>跳转<span class="token number">2</span><span class="token operator">&lt;</span><span class="token operator">/</span>NavLink<span class="token operator">&gt;</span>
        <span class="token operator">&lt;</span>button onClick<span class="token operator">=</span><span class="token punctuation">{</span><span class="token keyword">this</span><span class="token punctuation">.</span>go<span class="token punctuation">}</span><span class="token operator">&gt;</span>编程式跳转<span class="token operator">&lt;</span><span class="token operator">/</span>button<span class="token operator">&gt;</span>
        <span class="token operator">&lt;</span>button onClick<span class="token operator">=</span><span class="token punctuation">{</span><span class="token keyword">this</span><span class="token punctuation">.</span>go2<span class="token punctuation">}</span><span class="token operator">&gt;</span>router<span class="token operator">-</span>redux<span class="token operator">&lt;</span><span class="token operator">/</span>button<span class="token operator">&gt;</span>
        <span class="token operator">&lt;</span>button onClick<span class="token operator">=</span><span class="token punctuation">{</span><span class="token keyword">this</span><span class="token punctuation">.</span>go3<span class="token punctuation">}</span><span class="token operator">&gt;</span>异步<span class="token operator">&lt;</span><span class="token operator">/</span>button<span class="token operator">&gt;</span>
      <span class="token operator">&lt;</span><span class="token operator">/</span>div<span class="token operator">&gt;</span>
    <span class="token punctuation">)</span><span class="token punctuation">;</span>
  <span class="token punctuation">}</span>
<span class="token punctuation">}</span>

<span class="token keyword">const</span> <span class="token function-variable function">mapStateToProps</span> <span class="token operator">=</span> <span class="token punctuation">(</span><span class="token parameter">state</span><span class="token punctuation">)</span> <span class="token operator">=&gt;</span> <span class="token punctuation">{</span>
  <span class="token keyword">return</span> <span class="token punctuation">{</span>
    <span class="token literal-property property">productList</span><span class="token operator">:</span> state<span class="token punctuation">.</span>product<span class="token punctuation">,</span>
  <span class="token punctuation">}</span><span class="token punctuation">;</span>
<span class="token punctuation">}</span><span class="token punctuation">;</span>

<span class="token keyword">const</span> <span class="token function-variable function">mapDispatchToProps</span> <span class="token operator">=</span> <span class="token punctuation">(</span><span class="token parameter">dispatch</span><span class="token punctuation">)</span> <span class="token operator">=&gt;</span> <span class="token punctuation">{</span>
  <span class="token keyword">return</span> <span class="token punctuation">{</span>
    <span class="token function">add</span><span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
      <span class="token function">dispatch</span><span class="token punctuation">(</span><span class="token punctuation">{</span>
        <span class="token literal-property property">type</span><span class="token operator">:</span> <span class="token string">&quot;product/updateList&quot;</span><span class="token punctuation">,</span>
        <span class="token literal-property property">payload</span><span class="token operator">:</span> <span class="token punctuation">{</span> <span class="token literal-property property">name</span><span class="token operator">:</span> <span class="token string">&quot;tom&quot;</span> <span class="token punctuation">}</span><span class="token punctuation">,</span>
      <span class="token punctuation">}</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
    <span class="token punctuation">}</span><span class="token punctuation">,</span>
    <span class="token function">addAsync</span><span class="token punctuation">(</span><span class="token parameter">payload</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
      console<span class="token punctuation">.</span><span class="token function">log</span><span class="token punctuation">(</span>payload<span class="token punctuation">)</span><span class="token punctuation">;</span>
      <span class="token function">dispatch</span><span class="token punctuation">(</span><span class="token punctuation">{</span>
        <span class="token literal-property property">type</span><span class="token operator">:</span> <span class="token string">&quot;product/asyncFun&quot;</span><span class="token punctuation">,</span>
        <span class="token literal-property property">payload</span><span class="token operator">:</span> payload<span class="token punctuation">,</span>
      <span class="token punctuation">}</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
    <span class="token punctuation">}</span><span class="token punctuation">,</span>
  <span class="token punctuation">}</span><span class="token punctuation">;</span>
<span class="token punctuation">}</span><span class="token punctuation">;</span>

<span class="token keyword">export</span> <span class="token keyword">default</span> <span class="token function">connect</span><span class="token punctuation">(</span>mapStateToProps<span class="token punctuation">,</span> mapDispatchToProps<span class="token punctuation">)</span><span class="token punctuation">(</span>App<span class="token punctuation">)</span><span class="token punctuation">;</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><div class="language-javascript line-numbers-mode" data-ext="js"><pre class="language-javascript"><code><span class="token comment">// 入口文件</span>
<span class="token keyword">import</span> dva <span class="token keyword">from</span> <span class="token string">&quot;dva&quot;</span><span class="token punctuation">;</span>
<span class="token keyword">import</span> <span class="token string">&quot;./index.css&quot;</span><span class="token punctuation">;</span>
<span class="token comment">// import createHistory from &#39;history/createBrowserHistory&#39;;</span>
<span class="token keyword">import</span> <span class="token punctuation">{</span> createBrowserHistory <span class="token keyword">as</span> createHistory <span class="token punctuation">}</span> <span class="token keyword">from</span> <span class="token string">&quot;history&quot;</span><span class="token punctuation">;</span>

<span class="token comment">// 1. Initialize</span>
<span class="token keyword">const</span> app <span class="token operator">=</span> <span class="token function">dva</span><span class="token punctuation">(</span><span class="token punctuation">{</span>
  <span class="token literal-property property">history</span><span class="token operator">:</span> <span class="token function">createHistory</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">,</span>
<span class="token punctuation">}</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
<span class="token comment">// const app=dva();</span>

<span class="token comment">// 2. Plugins</span>
<span class="token comment">// app.use({});</span>

<span class="token comment">// 3. Model</span>
app<span class="token punctuation">.</span><span class="token function">model</span><span class="token punctuation">(</span><span class="token function">require</span><span class="token punctuation">(</span><span class="token string">&quot;./models/example&quot;</span><span class="token punctuation">)</span><span class="token punctuation">.</span>default<span class="token punctuation">)</span><span class="token punctuation">;</span>
app<span class="token punctuation">.</span><span class="token function">model</span><span class="token punctuation">(</span><span class="token function">require</span><span class="token punctuation">(</span><span class="token string">&quot;./models/product&quot;</span><span class="token punctuation">)</span><span class="token punctuation">.</span>default<span class="token punctuation">)</span><span class="token punctuation">;</span>

<span class="token comment">// 4. Router</span>
app<span class="token punctuation">.</span><span class="token function">router</span><span class="token punctuation">(</span><span class="token function">require</span><span class="token punctuation">(</span><span class="token string">&quot;./router&quot;</span><span class="token punctuation">)</span><span class="token punctuation">.</span>default<span class="token punctuation">)</span><span class="token punctuation">;</span>

<span class="token comment">// 5. Start</span>
app<span class="token punctuation">.</span><span class="token function">start</span><span class="token punctuation">(</span><span class="token string">&quot;#root&quot;</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div>`,20),o=[e];function i(c,l){return s(),a("div",null,o)}const d=n(p,[["render",i],["__file","6-dva.html.vue"]]);export{d as default};
