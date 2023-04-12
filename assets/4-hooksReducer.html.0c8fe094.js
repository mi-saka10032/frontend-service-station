import{_ as a}from"./_plugin-vue_export-helper.cdc0426e.js";import{o as t,c as p,a as n,b as e,e as o,d as c,r as i}from"./app.8160751a.js";const l={},u=c(`<p>React 提供的 hooks 函数中，useReducer 提供了类似 redux 的数据状态管理功能，其底层原理大体分为三步：mountReducer -&gt; updateReducer -&gt; commitReducer，分别代表挂载、更新、提交更改的全过程</p><h2 id="mountreducer" tabindex="-1"><a class="header-anchor" href="#mountreducer" aria-hidden="true">#</a> mountReducer</h2><p><img src="https://misaka10032.oss-cn-chengdu.aliyuncs.com/React/mountReducer.png" alt="mountReducer" loading="lazy"></p><h3 id="main-jsx" tabindex="-1"><a class="header-anchor" href="#main-jsx" aria-hidden="true">#</a> main.jsx</h3><p>src\\main.jsx</p><div class="language-jsx line-numbers-mode" data-ext="jsx"><pre class="language-jsx"><code><span class="token keyword">import</span> <span class="token operator">*</span> <span class="token keyword">as</span> React <span class="token keyword">from</span> <span class="token string">&quot;react/index&quot;</span><span class="token punctuation">;</span>
<span class="token keyword">import</span> <span class="token punctuation">{</span> createRoot <span class="token punctuation">}</span> <span class="token keyword">from</span> <span class="token string">&quot;react-dom/client&quot;</span><span class="token punctuation">;</span>

<span class="token keyword">const</span> <span class="token function-variable function">reducer</span> <span class="token operator">=</span> <span class="token punctuation">(</span><span class="token parameter">state<span class="token punctuation">,</span> action</span><span class="token punctuation">)</span> <span class="token operator">=&gt;</span> <span class="token punctuation">{</span>
  <span class="token keyword">if</span> <span class="token punctuation">(</span>action<span class="token punctuation">.</span>type <span class="token operator">===</span> <span class="token string">&quot;add&quot;</span><span class="token punctuation">)</span> <span class="token keyword">return</span> state <span class="token operator">+</span> <span class="token number">1</span><span class="token punctuation">;</span>
  <span class="token keyword">return</span> state<span class="token punctuation">;</span>
<span class="token punctuation">}</span><span class="token punctuation">;</span>

<span class="token keyword">function</span> <span class="token function">FunctionComponent</span><span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
  <span class="token keyword">const</span> <span class="token punctuation">[</span>number<span class="token punctuation">,</span> setNumber<span class="token punctuation">]</span> <span class="token operator">=</span> React<span class="token punctuation">.</span><span class="token function">useReducer</span><span class="token punctuation">(</span>reducer<span class="token punctuation">,</span> <span class="token number">0</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
  <span class="token keyword">return</span> <span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span>button</span> <span class="token attr-name">onClick</span><span class="token script language-javascript"><span class="token script-punctuation punctuation">=</span><span class="token punctuation">{</span><span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token operator">=&gt;</span> <span class="token function">setNumber</span><span class="token punctuation">(</span><span class="token punctuation">{</span> <span class="token literal-property property">type</span><span class="token operator">:</span> <span class="token string">&quot;add&quot;</span> <span class="token punctuation">}</span><span class="token punctuation">)</span><span class="token punctuation">}</span></span><span class="token punctuation">&gt;</span></span><span class="token punctuation">{</span>number<span class="token punctuation">}</span><span class="token tag"><span class="token tag"><span class="token punctuation">&lt;/</span>button</span><span class="token punctuation">&gt;</span></span><span class="token punctuation">;</span>
<span class="token punctuation">}</span>

<span class="token keyword">const</span> element <span class="token operator">=</span> <span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span><span class="token class-name">FunctionComponent</span></span> <span class="token punctuation">/&gt;</span></span><span class="token punctuation">;</span>
<span class="token keyword">const</span> root <span class="token operator">=</span> <span class="token function">createRoot</span><span class="token punctuation">(</span>document<span class="token punctuation">.</span><span class="token function">getElementById</span><span class="token punctuation">(</span><span class="token string">&quot;root&quot;</span><span class="token punctuation">)</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
<span class="token comment">// 把element虚拟DOM挂载到容器中</span>
root<span class="token punctuation">.</span><span class="token function">render</span><span class="token punctuation">(</span>element<span class="token punctuation">)</span><span class="token punctuation">;</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="reactfiberhooks-js" tabindex="-1"><a class="header-anchor" href="#reactfiberhooks-js" aria-hidden="true">#</a> ReactFiberHooks.js</h3><p>src\\react-reconciler\\src\\ReactFiberHooks.js</p><div class="language-javascript line-numbers-mode" data-ext="js"><pre class="language-javascript"><code><span class="token keyword">import</span> ReactSharedInternals <span class="token keyword">from</span> <span class="token string">&quot;shared/ReactSharedInternals&quot;</span><span class="token punctuation">;</span>

<span class="token comment">// 全局共享对象 ReactCurrentDispatcher</span>
<span class="token keyword">const</span> <span class="token punctuation">{</span> ReactCurrentDispatcher <span class="token punctuation">}</span> <span class="token operator">=</span> ReactSharedInternals<span class="token punctuation">;</span>
<span class="token keyword">let</span> currentlyRenderingFiber <span class="token operator">=</span> <span class="token keyword">null</span><span class="token punctuation">;</span>
<span class="token keyword">let</span> workInProgressHook <span class="token operator">=</span> <span class="token keyword">null</span><span class="token punctuation">;</span>

<span class="token comment">// 挂载hook链表</span>
<span class="token keyword">function</span> <span class="token function">mountWorkInProgressHook</span><span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
  <span class="token keyword">const</span> hook <span class="token operator">=</span> <span class="token punctuation">{</span>
    <span class="token literal-property property">memoizedState</span><span class="token operator">:</span> <span class="token keyword">null</span><span class="token punctuation">,</span>
    <span class="token literal-property property">queue</span><span class="token operator">:</span> <span class="token keyword">null</span><span class="token punctuation">,</span>
    <span class="token literal-property property">next</span><span class="token operator">:</span> <span class="token keyword">null</span><span class="token punctuation">,</span>
  <span class="token punctuation">}</span><span class="token punctuation">;</span>
  <span class="token keyword">if</span> <span class="token punctuation">(</span>workInProgressHook <span class="token operator">===</span> <span class="token keyword">null</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
    <span class="token comment">// 挂载到当前fiber的memoizedState上</span>
    currentlyRenderingFiber<span class="token punctuation">.</span>memoizedState <span class="token operator">=</span> workInProgressHook <span class="token operator">=</span> hook<span class="token punctuation">;</span>
  <span class="token punctuation">}</span> <span class="token keyword">else</span> <span class="token punctuation">{</span>
    <span class="token comment">// hook环链</span>
    workInProgressHook <span class="token operator">=</span> workInProgressHook<span class="token punctuation">.</span>next <span class="token operator">=</span> hook<span class="token punctuation">;</span>
  <span class="token punctuation">}</span>
  <span class="token keyword">return</span> workInProgressHook<span class="token punctuation">;</span>
<span class="token punctuation">}</span>

<span class="token keyword">function</span> <span class="token function">dispatchReducerAction</span><span class="token punctuation">(</span><span class="token parameter">fiber<span class="token punctuation">,</span> queue<span class="token punctuation">,</span> action</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
  console<span class="token punctuation">.</span><span class="token function">log</span><span class="token punctuation">(</span><span class="token string">&quot;dispatchReducerAction&quot;</span><span class="token punctuation">,</span> action<span class="token punctuation">)</span><span class="token punctuation">;</span>
<span class="token punctuation">}</span>

<span class="token keyword">const</span> HooksDispatcherOnMountInDEV <span class="token operator">=</span> <span class="token punctuation">{</span>
  <span class="token literal-property property">useReducer</span><span class="token operator">:</span> mountReducer<span class="token punctuation">,</span>
<span class="token punctuation">}</span><span class="token punctuation">;</span>

<span class="token comment">// 为当前的hook对象挂载初始值、更新队列、派发函数</span>
<span class="token keyword">function</span> <span class="token function">mountReducer</span><span class="token punctuation">(</span><span class="token parameter">reducer<span class="token punctuation">,</span> initialArg</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
  <span class="token keyword">const</span> hook <span class="token operator">=</span> <span class="token function">mountWorkInProgressHook</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
  hook<span class="token punctuation">.</span>memoizedState <span class="token operator">=</span> initialArg<span class="token punctuation">;</span>
  <span class="token keyword">const</span> queue <span class="token operator">=</span> <span class="token punctuation">{</span>
    <span class="token literal-property property">pending</span><span class="token operator">:</span> <span class="token keyword">null</span><span class="token punctuation">,</span>
    <span class="token literal-property property">dispatch</span><span class="token operator">:</span> <span class="token keyword">null</span><span class="token punctuation">,</span>
  <span class="token punctuation">}</span><span class="token punctuation">;</span>
  hook<span class="token punctuation">.</span>queue <span class="token operator">=</span> queue<span class="token punctuation">;</span>
  <span class="token keyword">const</span> dispatch <span class="token operator">=</span> <span class="token punctuation">(</span>queue<span class="token punctuation">.</span>dispatch <span class="token operator">=</span> <span class="token function">dispatchReducerAction</span><span class="token punctuation">.</span><span class="token function">bind</span><span class="token punctuation">(</span>
    <span class="token keyword">null</span><span class="token punctuation">,</span>
    currentlyRenderingFiber<span class="token punctuation">,</span>
    queue
  <span class="token punctuation">)</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
  <span class="token keyword">return</span> <span class="token punctuation">[</span>hook<span class="token punctuation">.</span>memoizedState<span class="token punctuation">,</span> dispatch<span class="token punctuation">]</span><span class="token punctuation">;</span>
<span class="token punctuation">}</span>

<span class="token doc-comment comment">/**
 * 渲染函数组件
 * <span class="token keyword">@param</span> <span class="token parameter">current</span> 老fiber
 * <span class="token keyword">@param</span> <span class="token parameter">workInProgress</span> 新fiber
 * <span class="token keyword">@param</span> <span class="token parameter">Component</span> 组件定义
 * <span class="token keyword">@param</span> <span class="token parameter">props</span> 组件属性
 * <span class="token keyword">@returns</span> 虚拟DOM或者React元素
 */</span>
<span class="token keyword">export</span> <span class="token keyword">function</span> <span class="token function">renderWithHooks</span><span class="token punctuation">(</span><span class="token parameter">current<span class="token punctuation">,</span> workInProgress<span class="token punctuation">,</span> Component<span class="token punctuation">,</span> props</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
  currentlyRenderingFiber <span class="token operator">=</span> workInProgress<span class="token punctuation">;</span>
  <span class="token keyword">if</span> <span class="token punctuation">(</span>current <span class="token operator">!==</span> <span class="token keyword">null</span> <span class="token operator">&amp;&amp;</span> current<span class="token punctuation">.</span>memoizedState <span class="token operator">!==</span> <span class="token keyword">null</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
    <span class="token comment">// TODO updateReducer</span>
  <span class="token punctuation">}</span> <span class="token keyword">else</span> <span class="token punctuation">{</span>
    ReactCurrentDispatcher<span class="token punctuation">.</span>current <span class="token operator">=</span> HooksDispatcherOnMountInDEV<span class="token punctuation">;</span>
  <span class="token punctuation">}</span>
  <span class="token keyword">const</span> children <span class="token operator">=</span> <span class="token function">Component</span><span class="token punctuation">(</span>props<span class="token punctuation">)</span><span class="token punctuation">;</span>
  currentlyRenderingFiber <span class="token operator">=</span> <span class="token keyword">null</span><span class="token punctuation">;</span>
  <span class="token keyword">return</span> children<span class="token punctuation">;</span>
<span class="token punctuation">}</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="react-index-js" tabindex="-1"><a class="header-anchor" href="#react-index-js" aria-hidden="true">#</a> react\\index.js</h3><p>src\\react\\index.js</p><div class="language-javascript line-numbers-mode" data-ext="js"><pre class="language-javascript"><code><span class="token keyword">export</span> <span class="token punctuation">{</span>
  __SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED<span class="token punctuation">,</span>
  useReducer<span class="token punctuation">,</span>
<span class="token punctuation">}</span> <span class="token keyword">from</span> <span class="token string">&quot;./src/React&quot;</span><span class="token punctuation">;</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="react-js" tabindex="-1"><a class="header-anchor" href="#react-js" aria-hidden="true">#</a> React.js</h3><p>src\\react\\src\\React.js</p><div class="language-javascript line-numbers-mode" data-ext="js"><pre class="language-javascript"><code><span class="token keyword">import</span> <span class="token punctuation">{</span> useReducer <span class="token punctuation">}</span> <span class="token keyword">from</span> <span class="token string">&quot;./ReactHooks&quot;</span><span class="token punctuation">;</span>
<span class="token keyword">import</span> ReactSharedInternals <span class="token keyword">from</span> <span class="token string">&quot;./ReactSharedInternals&quot;</span><span class="token punctuation">;</span>

<span class="token keyword">export</span> <span class="token punctuation">{</span>
  useReducer<span class="token punctuation">,</span>
  ReactSharedInternals <span class="token keyword">as</span> __SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED<span class="token punctuation">,</span>
<span class="token punctuation">}</span><span class="token punctuation">;</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="reacthooks-js" tabindex="-1"><a class="header-anchor" href="#reacthooks-js" aria-hidden="true">#</a> ReactHooks.js</h3><p>src\\react\\src\\ReactHooks.js</p><div class="language-javascript line-numbers-mode" data-ext="js"><pre class="language-javascript"><code><span class="token keyword">import</span> ReactCurrentDispatcher <span class="token keyword">from</span> <span class="token string">&quot;./ReactCurrentDispatcher&quot;</span><span class="token punctuation">;</span>

<span class="token keyword">function</span> <span class="token function">resolveDispatcher</span><span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
  <span class="token keyword">const</span> dispatcher <span class="token operator">=</span> ReactCurrentDispatcher<span class="token punctuation">.</span>current<span class="token punctuation">;</span>
  <span class="token keyword">return</span> dispatcher<span class="token punctuation">;</span>
<span class="token punctuation">}</span>

<span class="token keyword">export</span> <span class="token keyword">function</span> <span class="token function">useReducer</span><span class="token punctuation">(</span><span class="token parameter">reducer<span class="token punctuation">,</span> initialArg<span class="token punctuation">,</span> init</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
  <span class="token keyword">const</span> dispatcher <span class="token operator">=</span> <span class="token function">resolveDispatcher</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
  <span class="token comment">// dispatcher.useReducer这个方法，通过renderWithHooks中对全局对象ReactCurrentDispatcher.current设置以获得</span>
  <span class="token keyword">return</span> dispatcher<span class="token punctuation">.</span><span class="token function">useReducer</span><span class="token punctuation">(</span>reducer<span class="token punctuation">,</span> initialArg<span class="token punctuation">,</span> init<span class="token punctuation">)</span><span class="token punctuation">;</span>
<span class="token punctuation">}</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="reactcurrentdispatcher-js" tabindex="-1"><a class="header-anchor" href="#reactcurrentdispatcher-js" aria-hidden="true">#</a> ReactCurrentDispatcher.js</h3><p>src\\react\\src\\ReactCurrentDispatcher.js</p><div class="language-javascript line-numbers-mode" data-ext="js"><pre class="language-javascript"><code><span class="token keyword">const</span> ReactCurrentDispatcher <span class="token operator">=</span> <span class="token punctuation">{</span>
  <span class="token literal-property property">current</span><span class="token operator">:</span> <span class="token keyword">null</span><span class="token punctuation">,</span>
<span class="token punctuation">}</span><span class="token punctuation">;</span>
<span class="token keyword">export</span> <span class="token keyword">default</span> ReactCurrentDispatcher<span class="token punctuation">;</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="reactsharedinternals-js" tabindex="-1"><a class="header-anchor" href="#reactsharedinternals-js" aria-hidden="true">#</a> ReactSharedInternals.js</h3><p>src\\react\\src\\ReactSharedInternals.js</p><div class="language-javascript line-numbers-mode" data-ext="js"><pre class="language-javascript"><code><span class="token keyword">import</span> ReactCurrentDispatcher <span class="token keyword">from</span> <span class="token string">&quot;./ReactCurrentDispatcher&quot;</span><span class="token punctuation">;</span>

<span class="token keyword">const</span> ReactSharedInternals <span class="token operator">=</span> <span class="token punctuation">{</span>
  ReactCurrentDispatcher<span class="token punctuation">,</span>
<span class="token punctuation">}</span><span class="token punctuation">;</span>
<span class="token keyword">export</span> <span class="token keyword">default</span> ReactSharedInternals<span class="token punctuation">;</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="reactsharedinternals-js-1" tabindex="-1"><a class="header-anchor" href="#reactsharedinternals-js-1" aria-hidden="true">#</a> ReactSharedInternals.js</h3><p>src\\shared\\ReactSharedInternals.js</p><div class="language-javascript line-numbers-mode" data-ext="js"><pre class="language-javascript"><code><span class="token keyword">import</span> <span class="token operator">*</span> <span class="token keyword">as</span> React <span class="token keyword">from</span> <span class="token string">&quot;react/index&quot;</span><span class="token punctuation">;</span>

<span class="token keyword">const</span> ReactSharedInternals <span class="token operator">=</span>
  React<span class="token punctuation">.</span>__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED<span class="token punctuation">;</span>
<span class="token keyword">export</span> <span class="token keyword">default</span> ReactSharedInternals<span class="token punctuation">;</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="mountreducer-小结" tabindex="-1"><a class="header-anchor" href="#mountreducer-小结" aria-hidden="true">#</a> mountReducer 小结</h3><ol><li>整个 mountReducer 围绕存储于 ReactCurrentDispatcher.js 中的 ReactCurrentDispatcher 对象，向外 export 相同栈地址的浅拷贝对象</li><li>在<code>React.useReducer</code>中为 ReactCurrentDispatcher.current 对象的 useReducer 赋值，初始化并为当前的 Fiber.memoizedState 挂载一个包含了缓存值、更新队列、派发函数的 hook 单向环形链表</li><li>useReducer 最后返回一个长度为 2 的数组，对应 hook 的缓存值和派发函数</li></ol><p>mountReducer 点击 button 的控制台输出结果：</p><p><img src="https://misaka10032.oss-cn-chengdu.aliyuncs.com/React/mounteReducerResult.jpg" alt="mountReducerResult" loading="lazy"></p><h2 id="updatereducer" tabindex="-1"><a class="header-anchor" href="#updatereducer" aria-hidden="true">#</a> updateReducer</h2><p><img src="https://misaka10032.oss-cn-chengdu.aliyuncs.com/React/updateReducer.png" alt="updateReducer" loading="lazy"></p><h3 id="reactfiberhooks-js-1" tabindex="-1"><a class="header-anchor" href="#reactfiberhooks-js-1" aria-hidden="true">#</a> ReactFiberHooks.js</h3><p>src\\react-reconciler\\src\\ReactFiberHooks.js</p><div class="language-javascript line-numbers-mode" data-ext="js"><pre class="language-javascript"><code><span class="token keyword">import</span> ReactSharedInternals <span class="token keyword">from</span> <span class="token string">&quot;shared/ReactSharedInternals&quot;</span><span class="token punctuation">;</span>
<span class="token keyword">import</span> <span class="token punctuation">{</span> enqueueConcurrentHookUpdate <span class="token punctuation">}</span> <span class="token keyword">from</span> <span class="token string">&quot;./ReactFiberConcurrentUpdates&quot;</span><span class="token punctuation">;</span>
<span class="token keyword">import</span> <span class="token punctuation">{</span> scheduleUpdateOnFiber <span class="token punctuation">}</span> <span class="token keyword">from</span> <span class="token string">&quot;./ReactFiberWorkLoop&quot;</span><span class="token punctuation">;</span>

<span class="token keyword">const</span> <span class="token punctuation">{</span> ReactCurrentDispatcher <span class="token punctuation">}</span> <span class="token operator">=</span> ReactSharedInternals<span class="token punctuation">;</span>
<span class="token keyword">let</span> currentlyRenderingFiber <span class="token operator">=</span> <span class="token keyword">null</span><span class="token punctuation">;</span>
<span class="token keyword">let</span> workInProgressHook <span class="token operator">=</span> <span class="token keyword">null</span><span class="token punctuation">;</span>
<span class="token keyword">let</span> currentHook <span class="token operator">=</span> <span class="token keyword">null</span><span class="token punctuation">;</span>

<span class="token keyword">function</span> <span class="token function">mountWorkInProgressHook</span><span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
  <span class="token keyword">const</span> hook <span class="token operator">=</span> <span class="token punctuation">{</span>
    <span class="token literal-property property">memoizedState</span><span class="token operator">:</span> <span class="token keyword">null</span><span class="token punctuation">,</span>
    <span class="token literal-property property">queue</span><span class="token operator">:</span> <span class="token keyword">null</span><span class="token punctuation">,</span>
    <span class="token literal-property property">next</span><span class="token operator">:</span> <span class="token keyword">null</span><span class="token punctuation">,</span>
  <span class="token punctuation">}</span><span class="token punctuation">;</span>
  <span class="token keyword">if</span> <span class="token punctuation">(</span>workInProgressHook <span class="token operator">===</span> <span class="token keyword">null</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
    currentlyRenderingFiber<span class="token punctuation">.</span>memoizedState <span class="token operator">=</span> workInProgressHook <span class="token operator">=</span> hook<span class="token punctuation">;</span>
  <span class="token punctuation">}</span> <span class="token keyword">else</span> <span class="token punctuation">{</span>
    workInProgressHook <span class="token operator">=</span> workInProgressHook<span class="token punctuation">.</span>next <span class="token operator">=</span> hook<span class="token punctuation">;</span>
  <span class="token punctuation">}</span>
  <span class="token keyword">return</span> workInProgressHook<span class="token punctuation">;</span>
<span class="token punctuation">}</span>

<span class="token keyword">function</span> <span class="token function">dispatchReducerAction</span><span class="token punctuation">(</span><span class="token parameter">fiber<span class="token punctuation">,</span> queue<span class="token punctuation">,</span> action</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
  <span class="token keyword">const</span> update <span class="token operator">=</span> <span class="token punctuation">{</span>
    action<span class="token punctuation">,</span>
    <span class="token literal-property property">next</span><span class="token operator">:</span> <span class="token keyword">null</span><span class="token punctuation">,</span>
  <span class="token punctuation">}</span><span class="token punctuation">;</span>
  <span class="token keyword">const</span> root <span class="token operator">=</span> <span class="token function">enqueueConcurrentHookUpdate</span><span class="token punctuation">(</span>fiber<span class="token punctuation">,</span> queue<span class="token punctuation">,</span> update<span class="token punctuation">)</span><span class="token punctuation">;</span>
  <span class="token function">scheduleUpdateOnFiber</span><span class="token punctuation">(</span>root<span class="token punctuation">)</span><span class="token punctuation">;</span>
<span class="token punctuation">}</span>

<span class="token keyword">const</span> HooksDispatcherOnMountInDEV <span class="token operator">=</span> <span class="token punctuation">{</span>
  <span class="token literal-property property">useReducer</span><span class="token operator">:</span> mountReducer<span class="token punctuation">,</span>
<span class="token punctuation">}</span><span class="token punctuation">;</span>

<span class="token keyword">function</span> <span class="token function">mountReducer</span><span class="token punctuation">(</span><span class="token parameter">reducer<span class="token punctuation">,</span> initialArg</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
  <span class="token keyword">const</span> hook <span class="token operator">=</span> <span class="token function">mountWorkInProgressHook</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
  hook<span class="token punctuation">.</span>memoizedState <span class="token operator">=</span> initialArg<span class="token punctuation">;</span>
  <span class="token keyword">const</span> queue <span class="token operator">=</span> <span class="token punctuation">{</span>
    <span class="token literal-property property">pending</span><span class="token operator">:</span> <span class="token keyword">null</span><span class="token punctuation">,</span>
    <span class="token literal-property property">dispatch</span><span class="token operator">:</span> <span class="token keyword">null</span><span class="token punctuation">,</span>
  <span class="token punctuation">}</span><span class="token punctuation">;</span>
  hook<span class="token punctuation">.</span>queue <span class="token operator">=</span> queue<span class="token punctuation">;</span>
  <span class="token keyword">const</span> dispatch <span class="token operator">=</span> <span class="token punctuation">(</span>queue<span class="token punctuation">.</span>dispatch <span class="token operator">=</span> <span class="token function">dispatchReducerAction</span><span class="token punctuation">.</span><span class="token function">bind</span><span class="token punctuation">(</span>
    <span class="token keyword">null</span><span class="token punctuation">,</span>
    currentlyRenderingFiber<span class="token punctuation">,</span>
    queue
  <span class="token punctuation">)</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
  <span class="token keyword">return</span> <span class="token punctuation">[</span>hook<span class="token punctuation">.</span>memoizedState<span class="token punctuation">,</span> dispatch<span class="token punctuation">]</span><span class="token punctuation">;</span>
<span class="token punctuation">}</span>

<span class="token comment">// 更新当前fiber的hook链表</span>
<span class="token keyword">function</span> <span class="token function">updateWorkInProgressHook</span><span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
  <span class="token keyword">if</span> <span class="token punctuation">(</span>currentHook <span class="token operator">===</span> <span class="token keyword">null</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
    <span class="token keyword">const</span> current <span class="token operator">=</span> currentlyRenderingFiber<span class="token punctuation">.</span>alternate<span class="token punctuation">;</span>
    currentHook <span class="token operator">=</span> current<span class="token punctuation">.</span>memoizedState<span class="token punctuation">;</span>
  <span class="token punctuation">}</span> <span class="token keyword">else</span> <span class="token punctuation">{</span>
    currentHook <span class="token operator">=</span> currentHook<span class="token punctuation">.</span>next<span class="token punctuation">;</span>
  <span class="token punctuation">}</span>
  <span class="token keyword">const</span> newHook <span class="token operator">=</span> <span class="token punctuation">{</span>
    <span class="token literal-property property">memoizedState</span><span class="token operator">:</span> currentHook<span class="token punctuation">.</span>memoizedState<span class="token punctuation">,</span>
    <span class="token literal-property property">queue</span><span class="token operator">:</span> currentHook<span class="token punctuation">.</span>queue<span class="token punctuation">,</span>
    <span class="token literal-property property">next</span><span class="token operator">:</span> <span class="token keyword">null</span><span class="token punctuation">,</span>
  <span class="token punctuation">}</span><span class="token punctuation">;</span>
  <span class="token keyword">if</span> <span class="token punctuation">(</span>workInProgressHook <span class="token operator">===</span> <span class="token keyword">null</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
    currentlyRenderingFiber<span class="token punctuation">.</span>memoizedState <span class="token operator">=</span> workInProgressHook <span class="token operator">=</span> newHook<span class="token punctuation">;</span>
  <span class="token punctuation">}</span> <span class="token keyword">else</span> <span class="token punctuation">{</span>
    workInProgressHook <span class="token operator">=</span> workInProgressHook<span class="token punctuation">.</span>next <span class="token operator">=</span> newHook<span class="token punctuation">;</span>
  <span class="token punctuation">}</span>
  <span class="token keyword">return</span> workInProgressHook<span class="token punctuation">;</span>
<span class="token punctuation">}</span>

<span class="token keyword">const</span> HooksDispatcherOnUpdateInDEV <span class="token operator">=</span> <span class="token punctuation">{</span>
  <span class="token literal-property property">useReducer</span><span class="token operator">:</span> updateReducer<span class="token punctuation">,</span>
<span class="token punctuation">}</span><span class="token punctuation">;</span>

<span class="token keyword">function</span> <span class="token function">updateReducer</span><span class="token punctuation">(</span><span class="token parameter">reducer</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
  <span class="token keyword">const</span> hook <span class="token operator">=</span> <span class="token function">updateWorkInProgressHook</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
  <span class="token keyword">const</span> queue <span class="token operator">=</span> hook<span class="token punctuation">.</span>queue<span class="token punctuation">;</span>
  queue<span class="token punctuation">.</span>lastRenderedReducer <span class="token operator">=</span> reducer<span class="token punctuation">;</span>
  <span class="token keyword">const</span> current <span class="token operator">=</span> currentHook<span class="token punctuation">;</span>
  <span class="token keyword">const</span> pendingQueue <span class="token operator">=</span> queue<span class="token punctuation">.</span>pending<span class="token punctuation">;</span>
  <span class="token keyword">let</span> newState <span class="token operator">=</span> current<span class="token punctuation">.</span>memoizedState<span class="token punctuation">;</span>
  <span class="token keyword">if</span> <span class="token punctuation">(</span>pendingQueue <span class="token operator">!==</span> <span class="token keyword">null</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
    queue<span class="token punctuation">.</span>pending <span class="token operator">=</span> <span class="token keyword">null</span><span class="token punctuation">;</span>
    <span class="token keyword">const</span> first <span class="token operator">=</span> pendingQueue<span class="token punctuation">.</span>next<span class="token punctuation">;</span>
    <span class="token keyword">let</span> update <span class="token operator">=</span> first<span class="token punctuation">;</span>
    <span class="token keyword">do</span> <span class="token punctuation">{</span>
      <span class="token keyword">if</span> <span class="token punctuation">(</span>update<span class="token punctuation">.</span>hasEagerState<span class="token punctuation">)</span> <span class="token punctuation">{</span>
        newState <span class="token operator">=</span> update<span class="token punctuation">.</span>eagerState<span class="token punctuation">;</span>
      <span class="token punctuation">}</span> <span class="token keyword">else</span> <span class="token punctuation">{</span>
        <span class="token keyword">const</span> action <span class="token operator">=</span> update<span class="token punctuation">.</span>action<span class="token punctuation">;</span>
        newState <span class="token operator">=</span> <span class="token function">reducer</span><span class="token punctuation">(</span>newState<span class="token punctuation">,</span> action<span class="token punctuation">)</span><span class="token punctuation">;</span>
      <span class="token punctuation">}</span>
      update <span class="token operator">=</span> update<span class="token punctuation">.</span>next<span class="token punctuation">;</span>
    <span class="token punctuation">}</span> <span class="token keyword">while</span> <span class="token punctuation">(</span>update <span class="token operator">!==</span> <span class="token keyword">null</span> <span class="token operator">&amp;&amp;</span> update <span class="token operator">!==</span> first<span class="token punctuation">)</span><span class="token punctuation">;</span>
  <span class="token punctuation">}</span>
  hook<span class="token punctuation">.</span>memoizedState <span class="token operator">=</span> queue<span class="token punctuation">.</span>lastRenderedState <span class="token operator">=</span> newState<span class="token punctuation">;</span>
  <span class="token keyword">return</span> <span class="token punctuation">[</span>hook<span class="token punctuation">.</span>memoizedState<span class="token punctuation">,</span> queue<span class="token punctuation">.</span>dispatch<span class="token punctuation">]</span><span class="token punctuation">;</span>
<span class="token punctuation">}</span>

<span class="token doc-comment comment">/**
 * 渲染函数组件
 * <span class="token keyword">@param</span> <span class="token parameter">current</span> 老fiber
 * <span class="token keyword">@param</span> <span class="token parameter">workInProgress</span> 新fiber
 * <span class="token keyword">@param</span> <span class="token parameter">Component</span> 组件定义
 * <span class="token keyword">@param</span> <span class="token parameter">props</span> 组件属性
 * <span class="token keyword">@returns</span> 虚拟DOM或者React元素
 */</span>
<span class="token keyword">export</span> <span class="token keyword">function</span> <span class="token function">renderWithHooks</span><span class="token punctuation">(</span><span class="token parameter">current<span class="token punctuation">,</span> workInProgress<span class="token punctuation">,</span> Component<span class="token punctuation">,</span> props</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
  currentlyRenderingFiber <span class="token operator">=</span> workInProgress<span class="token punctuation">;</span>
  <span class="token keyword">if</span> <span class="token punctuation">(</span>current <span class="token operator">!==</span> <span class="token keyword">null</span> <span class="token operator">&amp;&amp;</span> current<span class="token punctuation">.</span>memoizedState <span class="token operator">!==</span> <span class="token keyword">null</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
    ReactCurrentDispatcher<span class="token punctuation">.</span>current <span class="token operator">=</span> HooksDispatcherOnUpdateInDEV<span class="token punctuation">;</span>
  <span class="token punctuation">}</span> <span class="token keyword">else</span> <span class="token punctuation">{</span>
    ReactCurrentDispatcher<span class="token punctuation">.</span>current <span class="token operator">=</span> HooksDispatcherOnMountInDEV<span class="token punctuation">;</span>
  <span class="token punctuation">}</span>
  <span class="token keyword">const</span> children <span class="token operator">=</span> <span class="token function">Component</span><span class="token punctuation">(</span>props<span class="token punctuation">)</span><span class="token punctuation">;</span>
  workInProgressHook <span class="token operator">=</span> <span class="token keyword">null</span><span class="token punctuation">;</span>
  currentHook <span class="token operator">=</span> <span class="token keyword">null</span><span class="token punctuation">;</span>
  currentlyRenderingFiber <span class="token operator">=</span> <span class="token keyword">null</span><span class="token punctuation">;</span>
  <span class="token keyword">return</span> children<span class="token punctuation">;</span>
<span class="token punctuation">}</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="reactfiberconcurrentupdates-js" tabindex="-1"><a class="header-anchor" href="#reactfiberconcurrentupdates-js" aria-hidden="true">#</a> ReactFiberConcurrentUpdates.js</h3><p>src\\react-reconciler\\src\\ReactFiberConcurrentUpdates.js</p><div class="language-javascript line-numbers-mode" data-ext="js"><pre class="language-javascript"><code><span class="token doc-comment comment">/**
 * 此文件本来还需要考虑处理优先级问题
 * 现在只实现找到根节点的功能
 */</span>
<span class="token keyword">import</span> <span class="token punctuation">{</span> HostRoot <span class="token punctuation">}</span> <span class="token keyword">from</span> <span class="token string">&quot;react-reconciler/src/ReactWorkTags&quot;</span><span class="token punctuation">;</span>

<span class="token keyword">const</span> concurrentQueues <span class="token operator">=</span> <span class="token punctuation">[</span><span class="token punctuation">]</span><span class="token punctuation">;</span>
<span class="token keyword">let</span> concurrentQueuesIndex <span class="token operator">=</span> <span class="token number">0</span><span class="token punctuation">;</span>

<span class="token keyword">export</span> <span class="token keyword">function</span> <span class="token function">markUpdateLaneFromFiberToRoot</span><span class="token punctuation">(</span><span class="token parameter">sourceFiber</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
  <span class="token keyword">let</span> node <span class="token operator">=</span> sourceFiber<span class="token punctuation">;</span> <span class="token comment">// 当前fiber</span>
  <span class="token keyword">let</span> parent <span class="token operator">=</span> sourceFiber<span class="token punctuation">.</span>return<span class="token punctuation">;</span> <span class="token comment">// 当前fiber的父fiber</span>
  <span class="token keyword">while</span> <span class="token punctuation">(</span>parent <span class="token operator">!==</span> <span class="token keyword">null</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
    node <span class="token operator">=</span> parent<span class="token punctuation">;</span>
    parent <span class="token operator">=</span> parent<span class="token punctuation">.</span>return<span class="token punctuation">;</span>
  <span class="token punctuation">}</span>
  <span class="token comment">// 一直找到parent为null：根节点Fiber(HostRootFiber)</span>
  <span class="token keyword">if</span> <span class="token punctuation">(</span>node<span class="token punctuation">.</span>tag <span class="token operator">===</span> HostRoot<span class="token punctuation">)</span> <span class="token punctuation">{</span>
    <span class="token comment">// 返回根节点的stateNode: FiberRootNode</span>
    <span class="token keyword">return</span> node<span class="token punctuation">.</span>stateNode<span class="token punctuation">;</span>
  <span class="token punctuation">}</span>
  <span class="token keyword">return</span> <span class="token keyword">null</span><span class="token punctuation">;</span>
<span class="token punctuation">}</span>

<span class="token keyword">export</span> <span class="token keyword">function</span> <span class="token function">enqueueConcurrentHookUpdate</span><span class="token punctuation">(</span><span class="token parameter">fiber<span class="token punctuation">,</span> queue<span class="token punctuation">,</span> update</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
  <span class="token function">enqueueUpdate</span><span class="token punctuation">(</span>fiber<span class="token punctuation">,</span> queue<span class="token punctuation">,</span> update<span class="token punctuation">)</span><span class="token punctuation">;</span>
  <span class="token keyword">return</span> <span class="token function">getRootForUpdatedFiber</span><span class="token punctuation">(</span>fiber<span class="token punctuation">)</span><span class="token punctuation">;</span>
<span class="token punctuation">}</span>

<span class="token keyword">function</span> <span class="token function">enqueueUpdate</span><span class="token punctuation">(</span><span class="token parameter">fiber<span class="token punctuation">,</span> queue<span class="token punctuation">,</span> update</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
  concurrentQueues<span class="token punctuation">[</span>concurrentQueuesIndex<span class="token operator">++</span><span class="token punctuation">]</span> <span class="token operator">=</span> fiber<span class="token punctuation">;</span>
  concurrentQueues<span class="token punctuation">[</span>concurrentQueuesIndex<span class="token operator">++</span><span class="token punctuation">]</span> <span class="token operator">=</span> queue<span class="token punctuation">;</span>
  concurrentQueues<span class="token punctuation">[</span>concurrentQueuesIndex<span class="token operator">++</span><span class="token punctuation">]</span> <span class="token operator">=</span> update<span class="token punctuation">;</span>
<span class="token punctuation">}</span>

<span class="token keyword">function</span> <span class="token function">getRootForUpdatedFiber</span><span class="token punctuation">(</span><span class="token parameter">sourceFiber</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
  <span class="token keyword">let</span> node <span class="token operator">=</span> sourceFiber<span class="token punctuation">;</span>
  <span class="token keyword">let</span> parent <span class="token operator">=</span> node<span class="token punctuation">.</span>return<span class="token punctuation">;</span>
  <span class="token keyword">while</span> <span class="token punctuation">(</span>parent <span class="token operator">!==</span> <span class="token keyword">null</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
    node <span class="token operator">=</span> parent<span class="token punctuation">;</span>
    parent <span class="token operator">=</span> node<span class="token punctuation">.</span>return<span class="token punctuation">;</span>
  <span class="token punctuation">}</span>
  <span class="token keyword">return</span> node<span class="token punctuation">.</span>tag <span class="token operator">===</span> HostRoot <span class="token operator">?</span> node<span class="token punctuation">.</span>stateNode <span class="token operator">:</span> <span class="token keyword">null</span><span class="token punctuation">;</span>
<span class="token punctuation">}</span>

<span class="token keyword">export</span> <span class="token keyword">function</span> <span class="token function">finishQueueingConcurrentUpdates</span><span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
  <span class="token keyword">const</span> endIndex <span class="token operator">=</span> concurrentQueuesIndex<span class="token punctuation">;</span>
  concurrentQueuesIndex <span class="token operator">=</span> <span class="token number">0</span><span class="token punctuation">;</span>
  <span class="token keyword">let</span> i <span class="token operator">=</span> <span class="token number">0</span><span class="token punctuation">;</span>
  <span class="token keyword">while</span> <span class="token punctuation">(</span>i <span class="token operator">&lt;</span> endIndex<span class="token punctuation">)</span> <span class="token punctuation">{</span>
    <span class="token keyword">const</span> fiber <span class="token operator">=</span> concurrentQueues<span class="token punctuation">[</span>i<span class="token operator">++</span><span class="token punctuation">]</span><span class="token punctuation">;</span>
    <span class="token keyword">const</span> queue <span class="token operator">=</span> concurrentQueues<span class="token punctuation">[</span>i<span class="token operator">++</span><span class="token punctuation">]</span><span class="token punctuation">;</span>
    <span class="token keyword">const</span> update <span class="token operator">=</span> concurrentQueues<span class="token punctuation">[</span>i<span class="token operator">++</span><span class="token punctuation">]</span><span class="token punctuation">;</span>
    <span class="token keyword">if</span> <span class="token punctuation">(</span>queue <span class="token operator">!==</span> <span class="token keyword">null</span> <span class="token operator">&amp;&amp;</span> update <span class="token operator">!==</span> <span class="token keyword">null</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
      <span class="token keyword">const</span> pending <span class="token operator">=</span> queue<span class="token punctuation">.</span>pending<span class="token punctuation">;</span>
      <span class="token keyword">if</span> <span class="token punctuation">(</span>pending <span class="token operator">===</span> <span class="token keyword">null</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
        update<span class="token punctuation">.</span>next <span class="token operator">=</span> update<span class="token punctuation">;</span>
      <span class="token punctuation">}</span> <span class="token keyword">else</span> <span class="token punctuation">{</span>
        update<span class="token punctuation">.</span>next <span class="token operator">=</span> pending<span class="token punctuation">.</span>next<span class="token punctuation">;</span>
        pending<span class="token punctuation">.</span>next <span class="token operator">=</span> update<span class="token punctuation">;</span>
      <span class="token punctuation">}</span>
      queue<span class="token punctuation">.</span>pending <span class="token operator">=</span> update<span class="token punctuation">;</span>
    <span class="token punctuation">}</span>
  <span class="token punctuation">}</span>
<span class="token punctuation">}</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="reactfiberworkloop-js" tabindex="-1"><a class="header-anchor" href="#reactfiberworkloop-js" aria-hidden="true">#</a> ReactFiberWorkLoop.js</h3><p>src\\react-reconciler\\src\\ReactFiberWorkLoop.js</p><div class="language-javascript line-numbers-mode" data-ext="js"><pre class="language-javascript"><code><span class="token keyword">import</span> <span class="token punctuation">{</span> scheduleCallback <span class="token punctuation">}</span> <span class="token keyword">from</span> <span class="token string">&quot;scheduler/index&quot;</span><span class="token punctuation">;</span>
<span class="token keyword">import</span> <span class="token punctuation">{</span> createWorkInProgress <span class="token punctuation">}</span> <span class="token keyword">from</span> <span class="token string">&quot;./ReactFiber&quot;</span><span class="token punctuation">;</span>
<span class="token keyword">import</span> <span class="token punctuation">{</span> beginWork <span class="token punctuation">}</span> <span class="token keyword">from</span> <span class="token string">&quot;./ReactFiberBeginWork&quot;</span><span class="token punctuation">;</span>
<span class="token keyword">import</span> <span class="token punctuation">{</span> completeWork <span class="token punctuation">}</span> <span class="token keyword">from</span> <span class="token string">&quot;./ReactFiberCompleteWork&quot;</span><span class="token punctuation">;</span>
<span class="token keyword">import</span> <span class="token punctuation">{</span> NoFlags<span class="token punctuation">,</span> MutationMask <span class="token punctuation">}</span> <span class="token keyword">from</span> <span class="token string">&quot;react-reconciler/src/ReactFiberFlags&quot;</span><span class="token punctuation">;</span>
<span class="token keyword">import</span> <span class="token punctuation">{</span> commitMutationEffectsOnFiber <span class="token punctuation">}</span> <span class="token keyword">from</span> <span class="token string">&quot;./ReactFiberCommitWork&quot;</span><span class="token punctuation">;</span>
<span class="token keyword">import</span> <span class="token punctuation">{</span> finishQueueingConcurrentUpdates <span class="token punctuation">}</span> <span class="token keyword">from</span> <span class="token string">&quot;./ReactFiberConcurrentUpdates&quot;</span><span class="token punctuation">;</span>

<span class="token keyword">let</span> workInProgress <span class="token operator">=</span> <span class="token keyword">null</span><span class="token punctuation">;</span>

<span class="token doc-comment comment">/**
 * 计划更新root
 * 源码中此处有一个调度任务的功能
 * <span class="token keyword">@param</span> <span class="token class-name"><span class="token punctuation">{</span><span class="token operator">*</span><span class="token punctuation">}</span></span>root
 */</span>
<span class="token keyword">export</span> <span class="token keyword">function</span> <span class="token function">scheduleUpdateOnFiber</span><span class="token punctuation">(</span><span class="token parameter">root</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
  <span class="token comment">// 确保调度执行root上的更新</span>
  <span class="token function">ensureRootIsScheduled</span><span class="token punctuation">(</span>root<span class="token punctuation">)</span><span class="token punctuation">;</span>
<span class="token punctuation">}</span>

<span class="token keyword">function</span> <span class="token function">ensureRootIsScheduled</span><span class="token punctuation">(</span><span class="token parameter">root</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
  <span class="token comment">// 告诉浏览器要执行performConcurrentWorkOnRoot函数，参数为root</span>
  <span class="token function">scheduleCallback</span><span class="token punctuation">(</span><span class="token function">performConcurrentWorkOnRoot</span><span class="token punctuation">.</span><span class="token function">bind</span><span class="token punctuation">(</span><span class="token keyword">null</span><span class="token punctuation">,</span> root<span class="token punctuation">)</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
<span class="token punctuation">}</span>

<span class="token doc-comment comment">/**
 * 开始根据fiber构建fiber树，要创建真实的DOM节点，再把真实的DOM节点插入容器
 * <span class="token keyword">@param</span> <span class="token class-name"><span class="token punctuation">{</span><span class="token operator">*</span><span class="token punctuation">}</span></span> <span class="token parameter">root</span>
 */</span>
<span class="token keyword">function</span> <span class="token function">performConcurrentWorkOnRoot</span><span class="token punctuation">(</span><span class="token parameter">root</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
  <span class="token comment">// 第一次渲染以同步的方式渲染根节点，初次渲染的时候，都是同步执行</span>
  <span class="token function">renderRootSync</span><span class="token punctuation">(</span>root<span class="token punctuation">)</span><span class="token punctuation">;</span>
  <span class="token comment">// 开始进入提交阶段，就是执行副作用，修改真实DOM</span>
  <span class="token keyword">const</span> finishedWork <span class="token operator">=</span> root<span class="token punctuation">.</span>current<span class="token punctuation">.</span>alternate<span class="token punctuation">;</span>
  root<span class="token punctuation">.</span>finishedWork <span class="token operator">=</span> finishedWork<span class="token punctuation">;</span>
  <span class="token function">commitRoot</span><span class="token punctuation">(</span>root<span class="token punctuation">)</span><span class="token punctuation">;</span>
<span class="token punctuation">}</span>

<span class="token keyword">function</span> <span class="token function">commitRoot</span><span class="token punctuation">(</span><span class="token parameter">root</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
  <span class="token keyword">const</span> <span class="token punctuation">{</span> finishedWork <span class="token punctuation">}</span> <span class="token operator">=</span> root<span class="token punctuation">;</span>
  <span class="token keyword">const</span> subtreeHasEffects <span class="token operator">=</span>
    <span class="token punctuation">(</span>finishedWork<span class="token punctuation">.</span>subtreeFlags <span class="token operator">&amp;&amp;</span> MutationMask<span class="token punctuation">)</span> <span class="token operator">!==</span> NoFlags<span class="token punctuation">;</span>
  <span class="token keyword">const</span> rootHasEffect <span class="token operator">=</span> <span class="token punctuation">(</span>finishedWork<span class="token punctuation">.</span>flags <span class="token operator">&amp;&amp;</span> MutationMask<span class="token punctuation">)</span> <span class="token operator">!==</span> NoFlags<span class="token punctuation">;</span>
  <span class="token keyword">if</span> <span class="token punctuation">(</span>subtreeHasEffects <span class="token operator">||</span> rootHasEffect<span class="token punctuation">)</span> <span class="token punctuation">{</span>
    <span class="token function">commitMutationEffectsOnFiber</span><span class="token punctuation">(</span>finishedWork<span class="token punctuation">,</span> root<span class="token punctuation">)</span><span class="token punctuation">;</span>
  <span class="token punctuation">}</span>
  <span class="token comment">// 等DOM变更后，就可以把root的current指向新Fiber树</span>
  root<span class="token punctuation">.</span>current <span class="token operator">=</span> finishedWork<span class="token punctuation">;</span>
<span class="token punctuation">}</span>

<span class="token keyword">function</span> <span class="token function">prepareFreshStack</span><span class="token punctuation">(</span><span class="token parameter">root</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
  workInProgress <span class="token operator">=</span> <span class="token function">createWorkInProgress</span><span class="token punctuation">(</span>root<span class="token punctuation">.</span>current<span class="token punctuation">,</span> <span class="token keyword">null</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
  <span class="token function">finishQueueingConcurrentUpdates</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
<span class="token punctuation">}</span>

<span class="token keyword">function</span> <span class="token function">renderRootSync</span><span class="token punctuation">(</span><span class="token parameter">root</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
  <span class="token comment">// 开始构建fiber树</span>
  <span class="token comment">// 双缓冲技术，页面显示区域为current映射，对应真实DOM，代表当前已经渲染完成的Fiber</span>
  <span class="token comment">// 内存中的Fiber构建、比较、更新为workInProgress映射，表示还未生效，没有更新的DOM上的Fiber树</span>
  <span class="token comment">// 1. current的HostRootFiber在构建过程中不作变化</span>
  <span class="token comment">// 2. workInProgress在内存中顺序构建Fiber树</span>
  <span class="token function">prepareFreshStack</span><span class="token punctuation">(</span>root<span class="token punctuation">)</span><span class="token punctuation">;</span>
  <span class="token function">workLoopSync</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
<span class="token punctuation">}</span>

<span class="token keyword">function</span> <span class="token function">workLoopSync</span><span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
  <span class="token keyword">while</span> <span class="token punctuation">(</span>workInProgress <span class="token operator">!==</span> <span class="token keyword">null</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
    <span class="token function">performUnitOfWork</span><span class="token punctuation">(</span>workInProgress<span class="token punctuation">)</span><span class="token punctuation">;</span>
  <span class="token punctuation">}</span>
<span class="token punctuation">}</span>

<span class="token doc-comment comment">/**
 * 执行一个工作单元
 * <span class="token keyword">@param</span> <span class="token parameter">unitOfWork</span>
 */</span>
<span class="token keyword">function</span> <span class="token function">performUnitOfWork</span><span class="token punctuation">(</span><span class="token parameter">unitOfWork</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
  <span class="token comment">// 获取新fiber对应的老fiber，是页面上显示的current的fiber</span>
  <span class="token keyword">const</span> current <span class="token operator">=</span> unitOfWork<span class="token punctuation">.</span>alternate<span class="token punctuation">;</span>
  <span class="token comment">// 完成当前fiber的子fiber链表构建</span>
  <span class="token keyword">const</span> next <span class="token operator">=</span> <span class="token function">beginWork</span><span class="token punctuation">(</span>current<span class="token punctuation">,</span> unitOfWork<span class="token punctuation">)</span><span class="token punctuation">;</span>
  <span class="token comment">// 同步工作单元中的props</span>
  unitOfWork<span class="token punctuation">.</span>memoizedProps <span class="token operator">=</span> unitOfWork<span class="token punctuation">.</span>pendingProps<span class="token punctuation">;</span>
  <span class="token comment">// 没有子节点，表示工作单元递归的 递 阶段已结束，需要return执行completeWork</span>
  <span class="token keyword">if</span> <span class="token punctuation">(</span>next <span class="token operator">===</span> <span class="token keyword">null</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
    <span class="token comment">// 没有子节点，表示当前fiber的beginWork已经完成，执行completeWork</span>
    <span class="token function">completeUnitOfWork</span><span class="token punctuation">(</span>unitOfWork<span class="token punctuation">)</span><span class="token punctuation">;</span>
  <span class="token punctuation">}</span> <span class="token keyword">else</span> <span class="token punctuation">{</span>
    workInProgress <span class="token operator">=</span> next<span class="token punctuation">;</span>
  <span class="token punctuation">}</span>
<span class="token punctuation">}</span>

<span class="token keyword">function</span> <span class="token function">completeUnitOfWork</span><span class="token punctuation">(</span><span class="token parameter">unitOfWork</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
  <span class="token keyword">let</span> completedWork <span class="token operator">=</span> unitOfWork<span class="token punctuation">;</span>
  <span class="token keyword">do</span> <span class="token punctuation">{</span>
    <span class="token comment">// 替代fiber</span>
    <span class="token keyword">const</span> current <span class="token operator">=</span> completedWork<span class="token punctuation">.</span>alternate<span class="token punctuation">;</span>
    <span class="token comment">// 父fiber</span>
    <span class="token keyword">const</span> returnFiber <span class="token operator">=</span> completedWork<span class="token punctuation">.</span>return<span class="token punctuation">;</span>
    <span class="token comment">// 执行此fiber的完成工作</span>
    <span class="token comment">// 如果是原生组件，就是创建真实DOM节点</span>
    <span class="token function">completeWork</span><span class="token punctuation">(</span>current<span class="token punctuation">,</span> completedWork<span class="token punctuation">)</span><span class="token punctuation">;</span>
    <span class="token comment">// 如果有弟弟，构建弟弟对应的fiber子链表</span>
    <span class="token keyword">const</span> siblingFiber <span class="token operator">=</span> completedWork<span class="token punctuation">.</span>sibling<span class="token punctuation">;</span>
    <span class="token keyword">if</span> <span class="token punctuation">(</span>siblingFiber <span class="token operator">!==</span> <span class="token keyword">null</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
      <span class="token comment">// 如果存在兄弟节点，则workInProgress赋值兄弟节点，循环退出，等待下一次工作单元执行beginWork</span>
      workInProgress <span class="token operator">=</span> siblingFiber<span class="token punctuation">;</span>
      <span class="token keyword">return</span><span class="token punctuation">;</span>
    <span class="token punctuation">}</span>
    <span class="token comment">// 如果没有弟弟，说明这当前完成的就是父fiber的最后一个节点</span>
    <span class="token comment">// 也就是说一个父fiber，它的所有子fiber全部完成了</span>
    completedWork <span class="token operator">=</span> returnFiber<span class="token punctuation">;</span>
    workInProgress <span class="token operator">=</span> completedWork<span class="token punctuation">;</span>
    <span class="token comment">// 执行递归的 归阶段，当兄弟节点为空的时候执行while循环往上返回，直到根fiber时退出循环</span>
  <span class="token punctuation">}</span> <span class="token keyword">while</span> <span class="token punctuation">(</span>completedWork <span class="token operator">!==</span> <span class="token keyword">null</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
<span class="token punctuation">}</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="reactfiberbeginwork-js" tabindex="-1"><a class="header-anchor" href="#reactfiberbeginwork-js" aria-hidden="true">#</a> ReactFiberBeginWork.js</h3><p>src\\react-reconciler\\src\\ReactFiberBeginWork.js</p><div class="language-javascript line-numbers-mode" data-ext="js"><pre class="language-javascript"><code><span class="token keyword">import</span> logger<span class="token punctuation">,</span> <span class="token punctuation">{</span> indent <span class="token punctuation">}</span> <span class="token keyword">from</span> <span class="token string">&quot;shared/logger&quot;</span><span class="token punctuation">;</span>
<span class="token keyword">import</span> <span class="token punctuation">{</span>
  FunctionComponent<span class="token punctuation">,</span>
  HostComponent<span class="token punctuation">,</span>
  HostRoot<span class="token punctuation">,</span>
  HostText<span class="token punctuation">,</span>
  IndeterminateComponent<span class="token punctuation">,</span>
<span class="token punctuation">}</span> <span class="token keyword">from</span> <span class="token string">&quot;react-reconciler/src/ReactWorkTags&quot;</span><span class="token punctuation">;</span>
<span class="token keyword">import</span> <span class="token punctuation">{</span> processUpdateQueue <span class="token punctuation">}</span> <span class="token keyword">from</span> <span class="token string">&quot;./ReactFiberClassUpdateQueue&quot;</span><span class="token punctuation">;</span>
<span class="token keyword">import</span> <span class="token punctuation">{</span> mountChildFibers<span class="token punctuation">,</span> reconcileChildFibers <span class="token punctuation">}</span> <span class="token keyword">from</span> <span class="token string">&quot;./ReactChildFiber&quot;</span><span class="token punctuation">;</span>
<span class="token keyword">import</span> <span class="token punctuation">{</span> shouldSetTextContent <span class="token punctuation">}</span> <span class="token keyword">from</span> <span class="token string">&quot;react-dom/src/client/ReactDOMHostConfig&quot;</span><span class="token punctuation">;</span>
<span class="token keyword">import</span> <span class="token punctuation">{</span> renderWithHooks <span class="token punctuation">}</span> <span class="token keyword">from</span> <span class="token string">&quot;react-reconciler/src/ReactFiberHooks&quot;</span><span class="token punctuation">;</span>

<span class="token doc-comment comment">/**
 * 根据新的虚拟DOM生成新的Fiber链表
 * <span class="token keyword">@param</span> <span class="token parameter">current</span> 老的父Fiber
 * <span class="token keyword">@param</span> <span class="token parameter">workInProgress</span> 新的父Fiber
 * <span class="token keyword">@param</span> <span class="token parameter">nextChildren</span> 新的子虚拟DOM
 */</span>
<span class="token keyword">function</span> <span class="token function">reconcileChildren</span><span class="token punctuation">(</span><span class="token parameter">current<span class="token punctuation">,</span> workInProgress<span class="token punctuation">,</span> nextChildren</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
  <span class="token keyword">if</span> <span class="token punctuation">(</span>current <span class="token operator">===</span> <span class="token keyword">null</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
    <span class="token comment">// 新fiber没有老fiber，说明为首次创建挂载</span>
    <span class="token comment">// 虚拟DOM首次创建时走这里</span>
    workInProgress<span class="token punctuation">.</span>child <span class="token operator">=</span> <span class="token function">mountChildFibers</span><span class="token punctuation">(</span>workInProgress<span class="token punctuation">,</span> <span class="token keyword">null</span><span class="token punctuation">,</span> nextChildren<span class="token punctuation">)</span><span class="token punctuation">;</span>
  <span class="token punctuation">}</span> <span class="token keyword">else</span> <span class="token punctuation">{</span>
    <span class="token comment">// 有老Fiber，需要做DOM-DIFF，拿老的子fiber链表和新的子虚拟DOM进行最小量更新</span>
    <span class="token comment">// root节点首次创建时走这里</span>
    workInProgress<span class="token punctuation">.</span>child <span class="token operator">=</span> <span class="token function">reconcileChildFibers</span><span class="token punctuation">(</span>
      workInProgress<span class="token punctuation">,</span>
      current<span class="token punctuation">.</span>child<span class="token punctuation">,</span>
      nextChildren
    <span class="token punctuation">)</span><span class="token punctuation">;</span>
  <span class="token punctuation">}</span>
<span class="token punctuation">}</span>

<span class="token keyword">function</span> <span class="token function">updateHostRoot</span><span class="token punctuation">(</span><span class="token parameter">current<span class="token punctuation">,</span> workInProgress</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
  <span class="token comment">// 需要知道的它的子虚拟DOM，知道它儿子的虚拟DOM信息</span>
  <span class="token function">processUpdateQueue</span><span class="token punctuation">(</span>workInProgress<span class="token punctuation">)</span><span class="token punctuation">;</span> <span class="token comment">// workInProgress.memoizedState = { element  }</span>
  <span class="token keyword">const</span> nextState <span class="token operator">=</span> workInProgress<span class="token punctuation">.</span>memoizedState<span class="token punctuation">;</span>
  <span class="token keyword">const</span> nextChildren <span class="token operator">=</span> nextState<span class="token punctuation">.</span>element<span class="token punctuation">;</span>
  <span class="token comment">// 协调子节点，diff算法</span>
  <span class="token comment">// 根据新的虚拟DOM生成子fiber链表</span>
  <span class="token function">reconcileChildren</span><span class="token punctuation">(</span>current<span class="token punctuation">,</span> workInProgress<span class="token punctuation">,</span> nextChildren<span class="token punctuation">)</span><span class="token punctuation">;</span>
  <span class="token keyword">return</span> workInProgress<span class="token punctuation">.</span>child<span class="token punctuation">;</span>
<span class="token punctuation">}</span>

<span class="token doc-comment comment">/**
 * 构建原生组件的子fiber链表
 * <span class="token keyword">@param</span> <span class="token parameter">current</span> 老fiber
 * <span class="token keyword">@param</span> <span class="token parameter">workInProgress</span> 新fiber
 */</span>
<span class="token keyword">function</span> <span class="token function">updateHostComponent</span><span class="token punctuation">(</span><span class="token parameter">current<span class="token punctuation">,</span> workInProgress</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
  <span class="token keyword">const</span> <span class="token punctuation">{</span> type<span class="token punctuation">,</span> <span class="token literal-property property">pendingProps</span><span class="token operator">:</span> nextProps <span class="token punctuation">}</span> <span class="token operator">=</span> workInProgress<span class="token punctuation">;</span>
  <span class="token keyword">let</span> nextChildren <span class="token operator">=</span> nextProps<span class="token punctuation">.</span>children<span class="token punctuation">;</span>
  <span class="token comment">// 是否直接设置文本节点，如果是则直接启动优化，不再判断children</span>
  <span class="token keyword">const</span> isDirectTextChildren <span class="token operator">=</span> <span class="token function">shouldSetTextContent</span><span class="token punctuation">(</span>type<span class="token punctuation">,</span> nextProps<span class="token punctuation">)</span><span class="token punctuation">;</span>
  <span class="token keyword">if</span> <span class="token punctuation">(</span>isDirectTextChildren<span class="token punctuation">)</span> <span class="token punctuation">{</span>
    nextChildren <span class="token operator">=</span> <span class="token keyword">null</span><span class="token punctuation">;</span>
  <span class="token punctuation">}</span>
  <span class="token function">reconcileChildren</span><span class="token punctuation">(</span>current<span class="token punctuation">,</span> workInProgress<span class="token punctuation">,</span> nextChildren<span class="token punctuation">)</span><span class="token punctuation">;</span>
  <span class="token keyword">return</span> workInProgress<span class="token punctuation">.</span>child<span class="token punctuation">;</span>
<span class="token punctuation">}</span>

<span class="token doc-comment comment">/**
 * 挂载函数组件
 * <span class="token keyword">@param</span> <span class="token parameter">current</span> 老fiber
 * <span class="token keyword">@param</span> <span class="token parameter">workInProgress</span> 新fiber
 * <span class="token keyword">@param</span> <span class="token parameter">Component</span> 组件类型，函数组件的定义
 */</span>
<span class="token keyword">export</span> <span class="token keyword">function</span> <span class="token function">mountIndeterminateComponent</span><span class="token punctuation">(</span>
  <span class="token parameter">current<span class="token punctuation">,</span>
  workInProgress<span class="token punctuation">,</span>
  Component</span>
<span class="token punctuation">)</span> <span class="token punctuation">{</span>
  <span class="token keyword">const</span> props <span class="token operator">=</span> workInProgress<span class="token punctuation">.</span>pendingProps<span class="token punctuation">;</span>
  <span class="token comment">// 执行函数拿到返回值</span>
  <span class="token comment">// const value = Component(props);</span>
  <span class="token keyword">const</span> value <span class="token operator">=</span> <span class="token function">renderWithHooks</span><span class="token punctuation">(</span>current<span class="token punctuation">,</span> workInProgress<span class="token punctuation">,</span> Component<span class="token punctuation">,</span> props<span class="token punctuation">)</span><span class="token punctuation">;</span>
  workInProgress<span class="token punctuation">.</span>tag <span class="token operator">=</span> FunctionComponent<span class="token punctuation">;</span>
  <span class="token function">reconcileChildren</span><span class="token punctuation">(</span><span class="token keyword">null</span><span class="token punctuation">,</span> workInProgress<span class="token punctuation">,</span> value<span class="token punctuation">)</span><span class="token punctuation">;</span>
  <span class="token keyword">return</span> workInProgress<span class="token punctuation">.</span>child<span class="token punctuation">;</span>
<span class="token punctuation">}</span>

<span class="token keyword">function</span> <span class="token function">updateFunctionComponent</span><span class="token punctuation">(</span>
  <span class="token parameter">current<span class="token punctuation">,</span>
  workInProgress<span class="token punctuation">,</span>
  Component<span class="token punctuation">,</span>
  nextProps</span>
<span class="token punctuation">)</span> <span class="token punctuation">{</span>
  <span class="token keyword">const</span> nextChildren <span class="token operator">=</span> <span class="token function">renderWithHooks</span><span class="token punctuation">(</span>
    current<span class="token punctuation">,</span>
    workInProgress<span class="token punctuation">,</span>
    Component<span class="token punctuation">,</span>
    nextProps
  <span class="token punctuation">)</span><span class="token punctuation">;</span>
  <span class="token function">reconcileChildren</span><span class="token punctuation">(</span>current<span class="token punctuation">,</span> workInProgress<span class="token punctuation">,</span> nextChildren<span class="token punctuation">)</span><span class="token punctuation">;</span>
  <span class="token keyword">return</span> workInProgress<span class="token punctuation">.</span>child<span class="token punctuation">;</span>
<span class="token punctuation">}</span>

<span class="token doc-comment comment">/**
 * 目标是根据虚拟DOM构建新的fiber子链表
 * <span class="token keyword">@param</span> <span class="token parameter">current</span> 老fiber
 * <span class="token keyword">@param</span> <span class="token parameter">workInProgress</span> 新fiber
 */</span>
<span class="token keyword">export</span> <span class="token keyword">function</span> <span class="token function">beginWork</span><span class="token punctuation">(</span><span class="token parameter">current<span class="token punctuation">,</span> workInProgress</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
  <span class="token function">logger</span><span class="token punctuation">(</span><span class="token string">&quot; &quot;</span><span class="token punctuation">.</span><span class="token function">repeat</span><span class="token punctuation">(</span>indent<span class="token punctuation">.</span>number<span class="token punctuation">)</span> <span class="token operator">+</span> <span class="token string">&quot;beginWork&quot;</span><span class="token punctuation">,</span> workInProgress<span class="token punctuation">)</span><span class="token punctuation">;</span>
  indent<span class="token punctuation">.</span>number <span class="token operator">+=</span> <span class="token number">2</span><span class="token punctuation">;</span>
  <span class="token keyword">switch</span> <span class="token punctuation">(</span>workInProgress<span class="token punctuation">.</span>tag<span class="token punctuation">)</span> <span class="token punctuation">{</span>
    <span class="token keyword">case</span> <span class="token literal-property property">IndeterminateComponent</span><span class="token operator">:</span>
      <span class="token keyword">return</span> <span class="token function">mountIndeterminateComponent</span><span class="token punctuation">(</span>
        current<span class="token punctuation">,</span>
        workInProgress<span class="token punctuation">,</span>
        workInProgress<span class="token punctuation">.</span>type
      <span class="token punctuation">)</span><span class="token punctuation">;</span>
    <span class="token keyword">case</span> <span class="token literal-property property">FunctionComponent</span><span class="token operator">:</span> <span class="token punctuation">{</span>
      <span class="token keyword">const</span> Component <span class="token operator">=</span> workInProgress<span class="token punctuation">.</span>type<span class="token punctuation">;</span>
      <span class="token keyword">const</span> resolvedProps <span class="token operator">=</span> workInProgress<span class="token punctuation">.</span>pendingProps<span class="token punctuation">;</span>
      <span class="token keyword">return</span> <span class="token function">updateFunctionComponent</span><span class="token punctuation">(</span>
        current<span class="token punctuation">,</span>
        workInProgress<span class="token punctuation">,</span>
        Component<span class="token punctuation">,</span>
        resolvedProps
      <span class="token punctuation">)</span><span class="token punctuation">;</span>
    <span class="token punctuation">}</span>
    <span class="token keyword">case</span> <span class="token literal-property property">HostRoot</span><span class="token operator">:</span>
      <span class="token keyword">return</span> <span class="token function">updateHostRoot</span><span class="token punctuation">(</span>current<span class="token punctuation">,</span> workInProgress<span class="token punctuation">)</span><span class="token punctuation">;</span>
    <span class="token keyword">case</span> <span class="token literal-property property">HostComponent</span><span class="token operator">:</span>
      <span class="token keyword">return</span> <span class="token function">updateHostComponent</span><span class="token punctuation">(</span>current<span class="token punctuation">,</span> workInProgress<span class="token punctuation">)</span><span class="token punctuation">;</span>
    <span class="token keyword">case</span> <span class="token literal-property property">HostText</span><span class="token operator">:</span>
      <span class="token keyword">return</span> <span class="token keyword">null</span><span class="token punctuation">;</span>
    <span class="token keyword">default</span><span class="token operator">:</span>
      <span class="token keyword">return</span> <span class="token keyword">null</span><span class="token punctuation">;</span>
  <span class="token punctuation">}</span>
<span class="token punctuation">}</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="reactchildfiber-js" tabindex="-1"><a class="header-anchor" href="#reactchildfiber-js" aria-hidden="true">#</a> ReactChildFiber.js</h3><p>src\\react-reconciler\\src\\ReactChildFiber.js</p><div class="language-javascript line-numbers-mode" data-ext="js"><pre class="language-javascript"><code><span class="token doc-comment comment">/**
 * <span class="token keyword">@param</span> <span class="token parameter">shouldTracksSideEffects</span> 是否跟踪副作用
 */</span>
<span class="token keyword">import</span> <span class="token punctuation">{</span> <span class="token constant">REACT_ELEMENT_TYPE</span> <span class="token punctuation">}</span> <span class="token keyword">from</span> <span class="token string">&quot;shared/ReactSymbols&quot;</span><span class="token punctuation">;</span>
<span class="token keyword">import</span> <span class="token punctuation">{</span>
  createFiberFromElement<span class="token punctuation">,</span>
  createFiberFromText<span class="token punctuation">,</span>
  createWorkInProgress<span class="token punctuation">,</span>
  FiberNode<span class="token punctuation">,</span>
<span class="token punctuation">}</span> <span class="token keyword">from</span> <span class="token string">&quot;./ReactFiber&quot;</span><span class="token punctuation">;</span>
<span class="token keyword">import</span> <span class="token punctuation">{</span> Placement<span class="token punctuation">,</span> ChildDeletion <span class="token punctuation">}</span> <span class="token keyword">from</span> <span class="token string">&quot;./ReactFiberFlags&quot;</span><span class="token punctuation">;</span>
<span class="token keyword">import</span> isArray <span class="token keyword">from</span> <span class="token string">&quot;shared/isArray&quot;</span><span class="token punctuation">;</span>
<span class="token keyword">import</span> <span class="token punctuation">{</span> HostText <span class="token punctuation">}</span> <span class="token keyword">from</span> <span class="token string">&quot;react-reconciler/src/ReactWorkTags&quot;</span><span class="token punctuation">;</span>

<span class="token keyword">function</span> <span class="token function">createChildReconciler</span><span class="token punctuation">(</span><span class="token parameter">shouldTracksSideEffects</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
  <span class="token keyword">function</span> <span class="token function">useFiber</span><span class="token punctuation">(</span><span class="token parameter">fiber<span class="token punctuation">,</span> pendingProps</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
    <span class="token keyword">const</span> clone <span class="token operator">=</span> <span class="token function">createWorkInProgress</span><span class="token punctuation">(</span>fiber<span class="token punctuation">,</span> pendingProps<span class="token punctuation">)</span><span class="token punctuation">;</span>
    clone<span class="token punctuation">.</span>index <span class="token operator">=</span> <span class="token number">0</span><span class="token punctuation">;</span>
    clone<span class="token punctuation">.</span>sibling <span class="token operator">=</span> <span class="token keyword">null</span><span class="token punctuation">;</span>
    <span class="token keyword">return</span> clone<span class="token punctuation">;</span>
  <span class="token punctuation">}</span>

  <span class="token keyword">function</span> <span class="token function">deleteChild</span><span class="token punctuation">(</span><span class="token parameter">returnFiber<span class="token punctuation">,</span> childToDelete</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
    <span class="token keyword">if</span> <span class="token punctuation">(</span><span class="token operator">!</span>shouldTracksSideEffects<span class="token punctuation">)</span> <span class="token punctuation">{</span>
      <span class="token keyword">return</span><span class="token punctuation">;</span>
    <span class="token punctuation">}</span>
    <span class="token keyword">const</span> deletions <span class="token operator">=</span> returnFiber<span class="token punctuation">.</span>deletions<span class="token punctuation">;</span>
    <span class="token keyword">if</span> <span class="token punctuation">(</span>deletions <span class="token operator">===</span> <span class="token keyword">null</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
      returnFiber<span class="token punctuation">.</span>deletions <span class="token operator">=</span> <span class="token punctuation">[</span>childToDelete<span class="token punctuation">]</span><span class="token punctuation">;</span>
      returnFiber<span class="token punctuation">.</span>flags <span class="token operator">|=</span> ChildDeletion<span class="token punctuation">;</span>
    <span class="token punctuation">}</span> <span class="token keyword">else</span> <span class="token punctuation">{</span>
      deletions<span class="token punctuation">.</span><span class="token function">push</span><span class="token punctuation">(</span>childToDelete<span class="token punctuation">)</span><span class="token punctuation">;</span>
    <span class="token punctuation">}</span>
  <span class="token punctuation">}</span>

  <span class="token keyword">function</span> <span class="token function">reconcileSingleElement</span><span class="token punctuation">(</span><span class="token parameter">returnFiber<span class="token punctuation">,</span> currentFirstChild<span class="token punctuation">,</span> element</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
    <span class="token keyword">const</span> key <span class="token operator">=</span> element<span class="token punctuation">.</span>key<span class="token punctuation">;</span>
    <span class="token keyword">let</span> child <span class="token operator">=</span> currentFirstChild<span class="token punctuation">;</span>
    <span class="token keyword">while</span> <span class="token punctuation">(</span>child <span class="token operator">!==</span> <span class="token keyword">null</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
      <span class="token keyword">if</span> <span class="token punctuation">(</span>child<span class="token punctuation">.</span>key <span class="token operator">===</span> key<span class="token punctuation">)</span> <span class="token punctuation">{</span>
        <span class="token keyword">const</span> elementType <span class="token operator">=</span> element<span class="token punctuation">.</span>type<span class="token punctuation">;</span>
        <span class="token keyword">if</span> <span class="token punctuation">(</span>child<span class="token punctuation">.</span>type <span class="token operator">===</span> elementType<span class="token punctuation">)</span> <span class="token punctuation">{</span>
          <span class="token keyword">const</span> existing <span class="token operator">=</span> <span class="token function">useFiber</span><span class="token punctuation">(</span>child<span class="token punctuation">,</span> element<span class="token punctuation">.</span>props<span class="token punctuation">)</span><span class="token punctuation">;</span>
          existing<span class="token punctuation">.</span>return <span class="token operator">=</span> returnFiber<span class="token punctuation">;</span>
          <span class="token keyword">return</span> existing<span class="token punctuation">;</span>
        <span class="token punctuation">}</span>
      <span class="token punctuation">}</span> <span class="token keyword">else</span> <span class="token punctuation">{</span>
        <span class="token function">deleteChild</span><span class="token punctuation">(</span>returnFiber<span class="token punctuation">,</span> child<span class="token punctuation">)</span><span class="token punctuation">;</span>
      <span class="token punctuation">}</span>
      child <span class="token operator">=</span> child<span class="token punctuation">.</span>sibling<span class="token punctuation">;</span>
    <span class="token punctuation">}</span>

    <span class="token comment">// 初次挂载 currentFirstFiber为null，可以直接根据虚拟DOM创建新的Fiber节点</span>
    <span class="token keyword">const</span> created <span class="token operator">=</span> <span class="token function">createFiberFromElement</span><span class="token punctuation">(</span>element<span class="token punctuation">)</span><span class="token punctuation">;</span>
    created<span class="token punctuation">.</span>return <span class="token operator">=</span> returnFiber<span class="token punctuation">;</span>
    <span class="token keyword">return</span> created<span class="token punctuation">;</span>
  <span class="token punctuation">}</span>

  <span class="token doc-comment comment">/**
   * 设置副作用
   * <span class="token keyword">@param</span> <span class="token parameter">newFiber</span>
   * <span class="token keyword">@param</span> <span class="token parameter">newIndex</span>
   */</span>
  <span class="token keyword">function</span> <span class="token function">placeSingleChild</span><span class="token punctuation">(</span><span class="token parameter">newFiber<span class="token punctuation">,</span> newIndex</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
    <span class="token comment">// 如果为true，说明要添加副作用</span>
    <span class="token keyword">if</span> <span class="token punctuation">(</span>shouldTracksSideEffects <span class="token operator">&amp;&amp;</span> newFiber<span class="token punctuation">.</span>alternate <span class="token operator">===</span> <span class="token keyword">null</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
      <span class="token comment">// 副作用标识：插入DOM节点，在最后的提交阶段插入此节点</span>
      <span class="token comment">// React的渲染分渲染（创建Fiber树）和提交（更新真实DOM）两个阶段</span>
      newFiber<span class="token punctuation">.</span>flags <span class="token operator">|=</span> Placement<span class="token punctuation">;</span>
    <span class="token punctuation">}</span>
    <span class="token keyword">return</span> newFiber<span class="token punctuation">;</span>
  <span class="token punctuation">}</span>

  <span class="token keyword">function</span> <span class="token function">reconcileSingleTextNode</span><span class="token punctuation">(</span><span class="token parameter">returnFiber<span class="token punctuation">,</span> currentFirstChild<span class="token punctuation">,</span> content</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
    <span class="token keyword">const</span> created <span class="token operator">=</span> <span class="token keyword">new</span> <span class="token class-name">FiberNode</span><span class="token punctuation">(</span>HostText<span class="token punctuation">,</span> <span class="token punctuation">{</span> content <span class="token punctuation">}</span><span class="token punctuation">,</span> <span class="token keyword">null</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
    created<span class="token punctuation">.</span>return <span class="token operator">=</span> returnFiber<span class="token punctuation">;</span>
    <span class="token keyword">return</span> created<span class="token punctuation">;</span>
  <span class="token punctuation">}</span>

  <span class="token keyword">function</span> <span class="token function">placeChild</span><span class="token punctuation">(</span><span class="token parameter">newFiber<span class="token punctuation">,</span> newIndex</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
    newFiber<span class="token punctuation">.</span>index <span class="token operator">=</span> newIndex<span class="token punctuation">;</span>
    <span class="token keyword">if</span> <span class="token punctuation">(</span>shouldTracksSideEffects<span class="token punctuation">)</span> <span class="token punctuation">{</span>
      <span class="token comment">// 如果一个fiber的flags上有placement，说明此节点需要创建真实DOM，插入到父容器中</span>
      <span class="token comment">// 如果父fiber初次挂载，shouldTracksSideEffects为false，不需要添加flags</span>
      <span class="token comment">// 这种情况下会在完成阶段把所有子阶段全部添加到自己身上</span>
      newFiber<span class="token punctuation">.</span>flags <span class="token operator">|=</span> Placement<span class="token punctuation">;</span>
    <span class="token punctuation">}</span>
  <span class="token punctuation">}</span>

  <span class="token keyword">function</span> <span class="token function">createChild</span><span class="token punctuation">(</span><span class="token parameter">returnFiber<span class="token punctuation">,</span> newChild</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
    <span class="token keyword">if</span> <span class="token punctuation">(</span>
      <span class="token punctuation">(</span><span class="token keyword">typeof</span> newChild <span class="token operator">===</span> <span class="token string">&quot;string&quot;</span> <span class="token operator">&amp;&amp;</span> newChild <span class="token operator">!==</span> <span class="token string">&quot;&quot;</span><span class="token punctuation">)</span> <span class="token operator">||</span>
      <span class="token keyword">typeof</span> newChild <span class="token operator">===</span> <span class="token string">&quot;number&quot;</span>
    <span class="token punctuation">)</span> <span class="token punctuation">{</span>
      <span class="token comment">// 创建虚拟DOM文本节点</span>
      <span class="token keyword">const</span> created <span class="token operator">=</span> <span class="token function">createFiberFromText</span><span class="token punctuation">(</span><span class="token template-string"><span class="token template-punctuation string">\`</span><span class="token interpolation"><span class="token interpolation-punctuation punctuation">\${</span>newChild<span class="token interpolation-punctuation punctuation">}</span></span><span class="token template-punctuation string">\`</span></span><span class="token punctuation">)</span><span class="token punctuation">;</span>
      created<span class="token punctuation">.</span>return <span class="token operator">=</span> returnFiber<span class="token punctuation">;</span>
      <span class="token keyword">return</span> created<span class="token punctuation">;</span>
    <span class="token punctuation">}</span> <span class="token keyword">else</span> <span class="token keyword">if</span> <span class="token punctuation">(</span><span class="token keyword">typeof</span> newChild <span class="token operator">===</span> <span class="token string">&quot;object&quot;</span> <span class="token operator">&amp;&amp;</span> newChild <span class="token operator">!==</span> <span class="token keyword">null</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
      <span class="token keyword">switch</span> <span class="token punctuation">(</span>newChild<span class="token punctuation">.</span>$$<span class="token keyword">typeof</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
        <span class="token keyword">case</span> <span class="token constant">REACT_ELEMENT_TYPE</span><span class="token operator">:</span> <span class="token punctuation">{</span>
          <span class="token keyword">const</span> created <span class="token operator">=</span> <span class="token function">createFiberFromElement</span><span class="token punctuation">(</span>newChild<span class="token punctuation">)</span><span class="token punctuation">;</span>
          created<span class="token punctuation">.</span>return <span class="token operator">=</span> returnFiber<span class="token punctuation">;</span>
          <span class="token keyword">return</span> created<span class="token punctuation">;</span>
        <span class="token punctuation">}</span>
        <span class="token keyword">default</span><span class="token operator">:</span>
          <span class="token keyword">break</span><span class="token punctuation">;</span>
      <span class="token punctuation">}</span>
    <span class="token punctuation">}</span>
    <span class="token keyword">return</span> <span class="token keyword">null</span><span class="token punctuation">;</span>
  <span class="token punctuation">}</span>

  <span class="token keyword">function</span> <span class="token function">reconcileChildrenArray</span><span class="token punctuation">(</span><span class="token parameter">returnFiber<span class="token punctuation">,</span> currentFirstFiber<span class="token punctuation">,</span> newChildren</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
    <span class="token keyword">let</span> resultingFirstChild <span class="token operator">=</span> <span class="token keyword">null</span><span class="token punctuation">;</span> <span class="token comment">// 返回的第一个新儿子</span>
    <span class="token keyword">let</span> previousNewFiber <span class="token operator">=</span> <span class="token keyword">null</span><span class="token punctuation">;</span> <span class="token comment">// 之前的新fiber</span>
    <span class="token keyword">let</span> newIndex <span class="token operator">=</span> <span class="token number">0</span><span class="token punctuation">;</span>
    <span class="token comment">// 遍历虚拟DOM根节点内的首层newChildren类型并生成不同fiber</span>
    <span class="token keyword">for</span> <span class="token punctuation">(</span><span class="token punctuation">;</span> newIndex <span class="token operator">&lt;</span> newChildren<span class="token punctuation">.</span>length<span class="token punctuation">;</span> newIndex<span class="token operator">++</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
      <span class="token keyword">const</span> newFiber <span class="token operator">=</span> <span class="token function">createChild</span><span class="token punctuation">(</span>returnFiber<span class="token punctuation">,</span> newChildren<span class="token punctuation">[</span>newIndex<span class="token punctuation">]</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
      <span class="token keyword">if</span> <span class="token punctuation">(</span>newFiber <span class="token operator">===</span> <span class="token keyword">null</span><span class="token punctuation">)</span> <span class="token keyword">continue</span><span class="token punctuation">;</span>
      <span class="token comment">// 把新fiber放到索引位置</span>
      <span class="token function">placeChild</span><span class="token punctuation">(</span>newFiber<span class="token punctuation">,</span> newIndex<span class="token punctuation">)</span><span class="token punctuation">;</span>
      <span class="token keyword">if</span> <span class="token punctuation">(</span>previousNewFiber <span class="token operator">===</span> <span class="token keyword">null</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
        <span class="token comment">// 这是第一个newFiber</span>
        resultingFirstChild <span class="token operator">=</span> newFiber<span class="token punctuation">;</span>
      <span class="token punctuation">}</span> <span class="token keyword">else</span> <span class="token punctuation">{</span>
        <span class="token comment">// 不是第一个newFiber</span>
        previousNewFiber<span class="token punctuation">.</span>sibling <span class="token operator">=</span> newFiber<span class="token punctuation">;</span>
      <span class="token punctuation">}</span>
      <span class="token comment">// 让newFiber成为上一个子Fiber</span>
      previousNewFiber <span class="token operator">=</span> newFiber<span class="token punctuation">;</span>
    <span class="token punctuation">}</span>
    <span class="token keyword">return</span> resultingFirstChild<span class="token punctuation">;</span>
  <span class="token punctuation">}</span>

  <span class="token doc-comment comment">/**
   * 比较协调子fibers DOM-DIFF：用老的子fiber链表和新的虚拟DOM进行比较的过程
   * <span class="token keyword">@param</span> <span class="token parameter">returnFiber</span> 新的父fiber
   * <span class="token keyword">@param</span> <span class="token parameter">currentFirstChild</span> current一般来说指老fiber的第一个子fiber
   * <span class="token keyword">@param</span> <span class="token parameter">newChild</span> 新的子虚拟DOM
   */</span>
  <span class="token keyword">function</span> <span class="token function">reconcileChildFibers</span><span class="token punctuation">(</span><span class="token parameter">returnFiber<span class="token punctuation">,</span> currentFirstChild<span class="token punctuation">,</span> newChild</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
    <span class="token comment">// 现在暂时只考虑新节点只有一个的情况</span>
    <span class="token keyword">if</span> <span class="token punctuation">(</span><span class="token keyword">typeof</span> newChild <span class="token operator">===</span> <span class="token string">&quot;object&quot;</span> <span class="token operator">&amp;&amp;</span> newChild <span class="token operator">!==</span> <span class="token keyword">null</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
      <span class="token keyword">switch</span> <span class="token punctuation">(</span>newChild<span class="token punctuation">.</span>$$<span class="token keyword">typeof</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
        <span class="token keyword">case</span> <span class="token constant">REACT_ELEMENT_TYPE</span><span class="token operator">:</span>
          <span class="token keyword">return</span> <span class="token function">placeSingleChild</span><span class="token punctuation">(</span>
            <span class="token function">reconcileSingleElement</span><span class="token punctuation">(</span>returnFiber<span class="token punctuation">,</span> currentFirstChild<span class="token punctuation">,</span> newChild<span class="token punctuation">)</span>
          <span class="token punctuation">)</span><span class="token punctuation">;</span>
        <span class="token keyword">default</span><span class="token operator">:</span>
          <span class="token keyword">break</span><span class="token punctuation">;</span>
      <span class="token punctuation">}</span>
      <span class="token comment">// newChild [文本节点， span虚拟元素]</span>
      <span class="token keyword">if</span> <span class="token punctuation">(</span><span class="token function">isArray</span><span class="token punctuation">(</span>newChild<span class="token punctuation">)</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
        <span class="token keyword">return</span> <span class="token function">reconcileChildrenArray</span><span class="token punctuation">(</span>returnFiber<span class="token punctuation">,</span> currentFirstChild<span class="token punctuation">,</span> newChild<span class="token punctuation">)</span><span class="token punctuation">;</span>
      <span class="token punctuation">}</span>
    <span class="token punctuation">}</span>
    <span class="token keyword">if</span> <span class="token punctuation">(</span><span class="token keyword">typeof</span> newChild <span class="token operator">===</span> <span class="token string">&quot;string&quot;</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
      <span class="token keyword">return</span> <span class="token function">placeSingleChild</span><span class="token punctuation">(</span>
        <span class="token function">reconcileSingleTextNode</span><span class="token punctuation">(</span>returnFiber<span class="token punctuation">,</span> currentFirstChild<span class="token punctuation">,</span> newChild<span class="token punctuation">)</span>
      <span class="token punctuation">)</span><span class="token punctuation">;</span>
    <span class="token punctuation">}</span>
    <span class="token keyword">return</span> <span class="token keyword">null</span><span class="token punctuation">;</span>
  <span class="token punctuation">}</span>
  <span class="token keyword">return</span> reconcileChildFibers<span class="token punctuation">;</span>
<span class="token punctuation">}</span>

<span class="token comment">// 虚拟DOM初次挂载</span>
<span class="token keyword">export</span> <span class="token keyword">const</span> mountChildFibers <span class="token operator">=</span> <span class="token function">createChildReconciler</span><span class="token punctuation">(</span><span class="token boolean">false</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
<span class="token comment">//老fiber更新</span>
<span class="token keyword">export</span> <span class="token keyword">const</span> reconcileChildFibers <span class="token operator">=</span> <span class="token function">createChildReconciler</span><span class="token punctuation">(</span><span class="token boolean">true</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="reactfibercompletework-js" tabindex="-1"><a class="header-anchor" href="#reactfibercompletework-js" aria-hidden="true">#</a> ReactFiberCompleteWork.js</h3><p>src\\react-reconciler\\src\\ReactFiberCompleteWork.js</p><div class="language-javascript line-numbers-mode" data-ext="js"><pre class="language-javascript"><code><span class="token keyword">import</span> logger<span class="token punctuation">,</span> <span class="token punctuation">{</span> indent <span class="token punctuation">}</span> <span class="token keyword">from</span> <span class="token string">&quot;shared/logger&quot;</span><span class="token punctuation">;</span>
<span class="token keyword">import</span> <span class="token punctuation">{</span>
  HostComponent<span class="token punctuation">,</span>
  HostRoot<span class="token punctuation">,</span>
  HostText<span class="token punctuation">,</span>
<span class="token punctuation">}</span> <span class="token keyword">from</span> <span class="token string">&quot;react-reconciler/src/ReactWorkTags&quot;</span><span class="token punctuation">;</span>
<span class="token keyword">import</span> <span class="token punctuation">{</span>
  createInstance<span class="token punctuation">,</span>
  createTextInstance<span class="token punctuation">,</span>
  appendInitialChild<span class="token punctuation">,</span>
  finalizeInitialChildren<span class="token punctuation">,</span>
  prepareUpdate<span class="token punctuation">,</span>
<span class="token punctuation">}</span> <span class="token keyword">from</span> <span class="token string">&quot;react-dom/src/client/ReactDOMHostConfig&quot;</span><span class="token punctuation">;</span>
<span class="token keyword">import</span> <span class="token punctuation">{</span> NoFlags<span class="token punctuation">,</span> Update <span class="token punctuation">}</span> <span class="token keyword">from</span> <span class="token string">&quot;react-reconciler/src/ReactFiberFlags&quot;</span><span class="token punctuation">;</span>

<span class="token doc-comment comment">/**
 * 属性冒泡，旨在向上收集子孙节点的更新副作用，当子节点不存在副作用时说明无需更新，便于diff优化
 * <span class="token keyword">@param</span> <span class="token parameter">completedWork</span>
 */</span>
<span class="token keyword">function</span> <span class="token function">bubbleProperties</span><span class="token punctuation">(</span><span class="token parameter">completedWork</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
  <span class="token keyword">let</span> subtreeFlags <span class="token operator">=</span> NoFlags<span class="token punctuation">;</span>
  <span class="token keyword">let</span> child <span class="token operator">=</span> completedWork<span class="token punctuation">.</span>child<span class="token punctuation">;</span>
  <span class="token comment">// 遍历当前fiber的所有子节点，把所有子节点的副作用及子节点的子节点副作用合并收集起来</span>
  <span class="token keyword">while</span> <span class="token punctuation">(</span>child <span class="token operator">!==</span> <span class="token keyword">null</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
    subtreeFlags <span class="token operator">|=</span> child<span class="token punctuation">.</span>subtreeFlags<span class="token punctuation">;</span>
    subtreeFlags <span class="token operator">|=</span> child<span class="token punctuation">.</span>flags<span class="token punctuation">;</span>
    child <span class="token operator">=</span> child<span class="token punctuation">.</span>sibling<span class="token punctuation">;</span>
  <span class="token punctuation">}</span>
  <span class="token comment">// 收集子节点的副作用，注意flags才是节点自己的副作用</span>
  completedWork<span class="token punctuation">.</span>subtreeFlags <span class="token operator">=</span> subtreeFlags<span class="token punctuation">;</span>
<span class="token punctuation">}</span>

<span class="token doc-comment comment">/**
 * 把当前完成的fiber所有子节点对应真实DOM都挂在到父parent真实DOM节点上
 * <span class="token keyword">@param</span> <span class="token parameter">parent</span> 当前完成的fiber真实DOM节点
 * <span class="token keyword">@param</span> <span class="token parameter">workInProgress</span> 完成的fiber
 */</span>
<span class="token keyword">function</span> <span class="token function">appendAllChildren</span><span class="token punctuation">(</span><span class="token parameter">parent<span class="token punctuation">,</span> workInProgress</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
  <span class="token keyword">let</span> node <span class="token operator">=</span> workInProgress<span class="token punctuation">.</span>child<span class="token punctuation">;</span>
  <span class="token keyword">while</span> <span class="token punctuation">(</span>node<span class="token punctuation">)</span> <span class="token punctuation">{</span>
    <span class="token keyword">if</span> <span class="token punctuation">(</span>node<span class="token punctuation">.</span>tag <span class="token operator">===</span> HostComponent <span class="token operator">||</span> node<span class="token punctuation">.</span>tag <span class="token operator">===</span> HostText<span class="token punctuation">)</span> <span class="token punctuation">{</span>
      <span class="token comment">// 如果子节点是原生节点或文本节点</span>
      <span class="token function">appendInitialChild</span><span class="token punctuation">(</span>parent<span class="token punctuation">,</span> node<span class="token punctuation">.</span>stateNode<span class="token punctuation">)</span><span class="token punctuation">;</span>
    <span class="token punctuation">}</span> <span class="token keyword">else</span> <span class="token keyword">if</span> <span class="token punctuation">(</span>node<span class="token punctuation">.</span>child <span class="token operator">!==</span> <span class="token keyword">null</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
      <span class="token comment">// 如果第一个儿子不是原生节点，说明它可能是一个函数组件节点</span>
      node <span class="token operator">=</span> node<span class="token punctuation">.</span>child<span class="token punctuation">;</span>
      <span class="token keyword">continue</span><span class="token punctuation">;</span>
    <span class="token punctuation">}</span>
    <span class="token comment">// 如果当前的节点没有弟弟</span>
    <span class="token keyword">while</span> <span class="token punctuation">(</span>node<span class="token punctuation">.</span>sibling <span class="token operator">===</span> <span class="token keyword">null</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
      <span class="token keyword">if</span> <span class="token punctuation">(</span>node<span class="token punctuation">.</span>return <span class="token operator">===</span> <span class="token keyword">null</span> <span class="token operator">||</span> node<span class="token punctuation">.</span>return <span class="token operator">===</span> workInProgress<span class="token punctuation">)</span> <span class="token punctuation">{</span>
        <span class="token keyword">return</span><span class="token punctuation">;</span>
      <span class="token punctuation">}</span>
      <span class="token comment">// 回到父节点</span>
      node <span class="token operator">=</span> node<span class="token punctuation">.</span>return<span class="token punctuation">;</span>
    <span class="token punctuation">}</span>
    node <span class="token operator">=</span> node<span class="token punctuation">.</span>sibling<span class="token punctuation">;</span>
  <span class="token punctuation">}</span>
<span class="token punctuation">}</span>

<span class="token keyword">function</span> <span class="token function">markUpdate</span><span class="token punctuation">(</span><span class="token parameter">workInProgress</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
  workInProgress<span class="token punctuation">.</span>flags <span class="token operator">|=</span> Update<span class="token punctuation">;</span>
<span class="token punctuation">}</span>

<span class="token keyword">function</span> <span class="token function">updateHostComponent</span><span class="token punctuation">(</span><span class="token parameter">current<span class="token punctuation">,</span> workInProgress<span class="token punctuation">,</span> type<span class="token punctuation">,</span> newProps</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
  <span class="token keyword">const</span> oldProps <span class="token operator">=</span> current<span class="token punctuation">.</span>memoizedProps<span class="token punctuation">;</span>
  <span class="token keyword">const</span> instance <span class="token operator">=</span> workInProgress<span class="token punctuation">.</span>stateNode<span class="token punctuation">;</span>
  <span class="token keyword">const</span> updatePayload <span class="token operator">=</span> <span class="token function">prepareUpdate</span><span class="token punctuation">(</span>instance<span class="token punctuation">,</span> type<span class="token punctuation">,</span> oldProps<span class="token punctuation">,</span> newProps<span class="token punctuation">)</span><span class="token punctuation">;</span>
  workInProgress<span class="token punctuation">.</span>updateQueue <span class="token operator">=</span> updatePayload<span class="token punctuation">;</span>
  <span class="token keyword">if</span> <span class="token punctuation">(</span>updatePayload<span class="token punctuation">)</span> <span class="token punctuation">{</span>
    <span class="token function">markUpdate</span><span class="token punctuation">(</span>workInProgress<span class="token punctuation">)</span><span class="token punctuation">;</span>
  <span class="token punctuation">}</span>
<span class="token punctuation">}</span>

<span class="token doc-comment comment">/**
 * 完成一个fiber节点
 * <span class="token keyword">@param</span> <span class="token parameter">current</span> 老fiber
 * <span class="token keyword">@param</span> <span class="token parameter">workInProgress</span> 新的构建fiber
 */</span>
<span class="token keyword">export</span> <span class="token keyword">function</span> <span class="token function">completeWork</span><span class="token punctuation">(</span><span class="token parameter">current<span class="token punctuation">,</span> workInProgress</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
  <span class="token function">logger</span><span class="token punctuation">(</span><span class="token string">&quot; &quot;</span><span class="token punctuation">.</span><span class="token function">repeat</span><span class="token punctuation">(</span>indent<span class="token punctuation">.</span>number<span class="token punctuation">)</span> <span class="token operator">+</span> <span class="token string">&quot;completeWork&quot;</span><span class="token punctuation">,</span> workInProgress<span class="token punctuation">)</span><span class="token punctuation">;</span>
  indent<span class="token punctuation">.</span>number <span class="token operator">-=</span> <span class="token number">2</span><span class="token punctuation">;</span>
  <span class="token keyword">const</span> newProps <span class="token operator">=</span> workInProgress<span class="token punctuation">.</span>pendingProps<span class="token punctuation">;</span>
  <span class="token keyword">switch</span> <span class="token punctuation">(</span>workInProgress<span class="token punctuation">.</span>tag<span class="token punctuation">)</span> <span class="token punctuation">{</span>
    <span class="token keyword">case</span> <span class="token literal-property property">HostRoot</span><span class="token operator">:</span>
      <span class="token function">bubbleProperties</span><span class="token punctuation">(</span>workInProgress<span class="token punctuation">)</span><span class="token punctuation">;</span>
      <span class="token keyword">break</span><span class="token punctuation">;</span>
    <span class="token keyword">case</span> <span class="token literal-property property">HostComponent</span><span class="token operator">:</span> <span class="token punctuation">{</span>
      <span class="token keyword">const</span> <span class="token punctuation">{</span> type <span class="token punctuation">}</span> <span class="token operator">=</span> workInProgress<span class="token punctuation">;</span>
      <span class="token keyword">if</span> <span class="token punctuation">(</span>current <span class="token operator">!==</span> <span class="token keyword">null</span> <span class="token operator">&amp;&amp;</span> workInProgress<span class="token punctuation">.</span>stateNode <span class="token operator">!==</span> <span class="token keyword">null</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
        <span class="token function">updateHostComponent</span><span class="token punctuation">(</span>current<span class="token punctuation">,</span> workInProgress<span class="token punctuation">,</span> type<span class="token punctuation">,</span> newProps<span class="token punctuation">)</span><span class="token punctuation">;</span>
        console<span class="token punctuation">.</span><span class="token function">log</span><span class="token punctuation">(</span><span class="token string">&quot;updatePayload&quot;</span><span class="token punctuation">,</span> workInProgress<span class="token punctuation">.</span>updateQueue<span class="token punctuation">)</span><span class="token punctuation">;</span>
      <span class="token punctuation">}</span> <span class="token keyword">else</span> <span class="token punctuation">{</span>
        <span class="token comment">// 暂时只处理初次创建或挂载的新节点逻辑</span>
        <span class="token comment">// 创建真实的DOM节点</span>
        <span class="token keyword">const</span> instance <span class="token operator">=</span> <span class="token function">createInstance</span><span class="token punctuation">(</span>type<span class="token punctuation">,</span> newProps<span class="token punctuation">,</span> workInProgress<span class="token punctuation">)</span><span class="token punctuation">;</span>
        <span class="token comment">// 把自己所有的儿子都添加到自己身上</span>
        <span class="token function">appendAllChildren</span><span class="token punctuation">(</span>instance<span class="token punctuation">,</span> workInProgress<span class="token punctuation">)</span><span class="token punctuation">;</span>
        workInProgress<span class="token punctuation">.</span>stateNode <span class="token operator">=</span> instance<span class="token punctuation">;</span>
        <span class="token function">finalizeInitialChildren</span><span class="token punctuation">(</span>instance<span class="token punctuation">,</span> type<span class="token punctuation">,</span> newProps<span class="token punctuation">)</span><span class="token punctuation">;</span>
      <span class="token punctuation">}</span>
      <span class="token function">bubbleProperties</span><span class="token punctuation">(</span>workInProgress<span class="token punctuation">)</span><span class="token punctuation">;</span>
      <span class="token keyword">break</span><span class="token punctuation">;</span>
    <span class="token punctuation">}</span>
    <span class="token keyword">case</span> <span class="token literal-property property">HostText</span><span class="token operator">:</span>
      <span class="token comment">// 文本节点的props就是文本内容，直接创建真实的文本节点</span>
      <span class="token keyword">const</span> newText <span class="token operator">=</span> newProps<span class="token punctuation">;</span>
      <span class="token comment">// 创建真实的DOM节点，并传入stateNode</span>
      workInProgress<span class="token punctuation">.</span>stateNode <span class="token operator">=</span> <span class="token function">createTextInstance</span><span class="token punctuation">(</span>newText<span class="token punctuation">)</span><span class="token punctuation">;</span>
      <span class="token comment">// 向上冒泡属性</span>
      <span class="token function">bubbleProperties</span><span class="token punctuation">(</span>workInProgress<span class="token punctuation">)</span><span class="token punctuation">;</span>
      <span class="token keyword">break</span><span class="token punctuation">;</span>
  <span class="token punctuation">}</span>
<span class="token punctuation">}</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="reactdomhostconfig-js" tabindex="-1"><a class="header-anchor" href="#reactdomhostconfig-js" aria-hidden="true">#</a> ReactDOMHostConfig.js</h3><p>src\\react-dom-bindings\\src\\client\\ReactDOMHostConfig.js</p><div class="language-javascript line-numbers-mode" data-ext="js"><pre class="language-javascript"><code><span class="token keyword">import</span> <span class="token punctuation">{</span> setInitialProperties<span class="token punctuation">,</span> diffProperties <span class="token punctuation">}</span> <span class="token keyword">from</span> <span class="token string">&quot;./ReactDOMComponent&quot;</span><span class="token punctuation">;</span>

<span class="token keyword">export</span> <span class="token keyword">function</span> <span class="token function">prepareUpdate</span><span class="token punctuation">(</span><span class="token parameter">domElement<span class="token punctuation">,</span> type<span class="token punctuation">,</span> oldProps<span class="token punctuation">,</span> newProps</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
  <span class="token keyword">return</span> <span class="token function">diffProperties</span><span class="token punctuation">(</span>domElement<span class="token punctuation">,</span> type<span class="token punctuation">,</span> oldProps<span class="token punctuation">,</span> newProps<span class="token punctuation">)</span><span class="token punctuation">;</span>
<span class="token punctuation">}</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="reactdomcomponent-js" tabindex="-1"><a class="header-anchor" href="#reactdomcomponent-js" aria-hidden="true">#</a> ReactDOMComponent.js</h3><p>src\\react-dom-bindings\\src\\client\\ReactDOMComponent.js</p><div class="language-javascript line-numbers-mode" data-ext="js"><pre class="language-javascript"><code><span class="token keyword">import</span> <span class="token punctuation">{</span> setValueForStyles <span class="token punctuation">}</span> <span class="token keyword">from</span> <span class="token string">&quot;react-dom/src/client/CSSPropertyOperations&quot;</span><span class="token punctuation">;</span>
<span class="token keyword">import</span> setTextContent <span class="token keyword">from</span> <span class="token string">&quot;react-dom/src/client/setTextContent&quot;</span><span class="token punctuation">;</span>
<span class="token keyword">import</span> <span class="token punctuation">{</span> setValueForProperty <span class="token punctuation">}</span> <span class="token keyword">from</span> <span class="token string">&quot;react-dom/src/client/DOMPropertyOperations&quot;</span><span class="token punctuation">;</span>

<span class="token keyword">const</span> <span class="token constant">STYLE</span> <span class="token operator">=</span> <span class="token string">&quot;style&quot;</span><span class="token punctuation">;</span>
<span class="token keyword">const</span> <span class="token constant">CHILDREN</span> <span class="token operator">=</span> <span class="token string">&quot;children&quot;</span><span class="token punctuation">;</span>

<span class="token keyword">function</span> <span class="token function">setInitialDOMProperties</span><span class="token punctuation">(</span><span class="token parameter">tag<span class="token punctuation">,</span> domElement<span class="token punctuation">,</span> nextProps</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
  <span class="token keyword">for</span> <span class="token punctuation">(</span><span class="token keyword">const</span> propKey <span class="token keyword">in</span> nextProps<span class="token punctuation">)</span> <span class="token punctuation">{</span>
    <span class="token keyword">if</span> <span class="token punctuation">(</span>nextProps<span class="token punctuation">.</span><span class="token function">hasOwnProperty</span><span class="token punctuation">(</span>propKey<span class="token punctuation">)</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
      <span class="token keyword">const</span> nextProp <span class="token operator">=</span> nextProps<span class="token punctuation">[</span>propKey<span class="token punctuation">]</span><span class="token punctuation">;</span>
      <span class="token keyword">if</span> <span class="token punctuation">(</span>propKey <span class="token operator">===</span> <span class="token constant">STYLE</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
        <span class="token function">setValueForStyles</span><span class="token punctuation">(</span>domElement<span class="token punctuation">,</span> nextProp<span class="token punctuation">)</span><span class="token punctuation">;</span>
      <span class="token punctuation">}</span> <span class="token keyword">else</span> <span class="token keyword">if</span> <span class="token punctuation">(</span>propKey <span class="token operator">===</span> <span class="token constant">CHILDREN</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
        <span class="token keyword">if</span> <span class="token punctuation">(</span><span class="token keyword">typeof</span> nextProp <span class="token operator">===</span> <span class="token string">&quot;string&quot;</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
          <span class="token function">setTextContent</span><span class="token punctuation">(</span>domElement<span class="token punctuation">,</span> nextProp<span class="token punctuation">)</span><span class="token punctuation">;</span>
        <span class="token punctuation">}</span> <span class="token keyword">else</span> <span class="token keyword">if</span> <span class="token punctuation">(</span><span class="token keyword">typeof</span> nextProp <span class="token operator">===</span> <span class="token string">&quot;number&quot;</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
          <span class="token function">setTextContent</span><span class="token punctuation">(</span>domElement<span class="token punctuation">,</span> nextProp <span class="token operator">+</span> <span class="token string">&quot;&quot;</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
        <span class="token punctuation">}</span>
      <span class="token punctuation">}</span> <span class="token keyword">else</span> <span class="token keyword">if</span> <span class="token punctuation">(</span>nextProp <span class="token operator">!==</span> <span class="token keyword">null</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
        <span class="token function">setValueForProperty</span><span class="token punctuation">(</span>domElement<span class="token punctuation">,</span> propKey<span class="token punctuation">,</span> nextProp<span class="token punctuation">)</span><span class="token punctuation">;</span>
      <span class="token punctuation">}</span>
    <span class="token punctuation">}</span>
  <span class="token punctuation">}</span>
<span class="token punctuation">}</span>

<span class="token keyword">export</span> <span class="token keyword">function</span> <span class="token function">setInitialProperties</span><span class="token punctuation">(</span><span class="token parameter">domElement<span class="token punctuation">,</span> tag<span class="token punctuation">,</span> props</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
  <span class="token function">setInitialDOMProperties</span><span class="token punctuation">(</span>tag<span class="token punctuation">,</span> domElement<span class="token punctuation">,</span> props<span class="token punctuation">)</span><span class="token punctuation">;</span>
<span class="token punctuation">}</span>

<span class="token keyword">export</span> <span class="token keyword">function</span> <span class="token function">diffProperties</span><span class="token punctuation">(</span><span class="token parameter">domElement<span class="token punctuation">,</span> tag<span class="token punctuation">,</span> lastProps<span class="token punctuation">,</span> nextProps</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
  <span class="token keyword">let</span> updatePayload <span class="token operator">=</span> <span class="token keyword">null</span><span class="token punctuation">;</span>
  <span class="token keyword">let</span> propKey<span class="token punctuation">;</span>
  <span class="token keyword">let</span> styleName<span class="token punctuation">;</span>
  <span class="token keyword">let</span> styleUpdates <span class="token operator">=</span> <span class="token keyword">null</span><span class="token punctuation">;</span>
  <span class="token keyword">for</span> <span class="token punctuation">(</span>propKey <span class="token keyword">in</span> lastProps<span class="token punctuation">)</span> <span class="token punctuation">{</span>
    <span class="token keyword">if</span> <span class="token punctuation">(</span>
      nextProps<span class="token punctuation">.</span><span class="token function">hasOwnProperty</span><span class="token punctuation">(</span>propKey<span class="token punctuation">)</span> <span class="token operator">||</span>
      <span class="token operator">!</span>lastProps<span class="token punctuation">.</span><span class="token function">hasOwnProperty</span><span class="token punctuation">(</span>propKey<span class="token punctuation">)</span> <span class="token operator">||</span>
      lastProps<span class="token punctuation">[</span>propKey<span class="token punctuation">]</span> <span class="token operator">==</span> <span class="token keyword">null</span>
    <span class="token punctuation">)</span> <span class="token punctuation">{</span>
      <span class="token keyword">continue</span><span class="token punctuation">;</span>
    <span class="token punctuation">}</span>
    <span class="token keyword">if</span> <span class="token punctuation">(</span>propKey <span class="token operator">===</span> <span class="token constant">STYLE</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
      <span class="token keyword">const</span> lastStyle <span class="token operator">=</span> lastProps<span class="token punctuation">[</span>propKey<span class="token punctuation">]</span><span class="token punctuation">;</span>
      <span class="token keyword">for</span> <span class="token punctuation">(</span>styleName <span class="token keyword">in</span> lastStyle<span class="token punctuation">)</span> <span class="token punctuation">{</span>
        <span class="token keyword">if</span> <span class="token punctuation">(</span>lastStyle<span class="token punctuation">.</span><span class="token function">hasOwnProperty</span><span class="token punctuation">(</span>styleName<span class="token punctuation">)</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
          <span class="token keyword">if</span> <span class="token punctuation">(</span><span class="token operator">!</span>styleUpdates<span class="token punctuation">)</span> <span class="token punctuation">{</span>
            styleUpdates <span class="token operator">=</span> <span class="token punctuation">{</span><span class="token punctuation">}</span><span class="token punctuation">;</span>
          <span class="token punctuation">}</span>
          styleUpdates<span class="token punctuation">[</span>styleName<span class="token punctuation">]</span> <span class="token operator">=</span> <span class="token string">&quot;&quot;</span><span class="token punctuation">;</span>
        <span class="token punctuation">}</span>
      <span class="token punctuation">}</span>
    <span class="token punctuation">}</span> <span class="token keyword">else</span> <span class="token punctuation">{</span>
      <span class="token punctuation">(</span>updatePayload <span class="token operator">=</span> updatePayload <span class="token operator">||</span> <span class="token punctuation">[</span><span class="token punctuation">]</span><span class="token punctuation">)</span><span class="token punctuation">.</span><span class="token function">push</span><span class="token punctuation">(</span>propKey<span class="token punctuation">,</span> <span class="token keyword">null</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
    <span class="token punctuation">}</span>
  <span class="token punctuation">}</span>
  <span class="token keyword">for</span> <span class="token punctuation">(</span>propKey <span class="token keyword">in</span> nextProps<span class="token punctuation">)</span> <span class="token punctuation">{</span>
    <span class="token keyword">const</span> nextProp <span class="token operator">=</span> nextProps<span class="token punctuation">[</span>propKey<span class="token punctuation">]</span><span class="token punctuation">;</span>
    <span class="token keyword">const</span> lastProp <span class="token operator">=</span> lastProps <span class="token operator">!=</span> <span class="token keyword">null</span> <span class="token operator">?</span> lastProps<span class="token punctuation">[</span>propKey<span class="token punctuation">]</span> <span class="token operator">:</span> <span class="token keyword">undefined</span><span class="token punctuation">;</span>
    <span class="token keyword">if</span> <span class="token punctuation">(</span>
      <span class="token operator">!</span>nextProps<span class="token punctuation">.</span><span class="token function">hasOwnProperty</span><span class="token punctuation">(</span>propKey<span class="token punctuation">)</span> <span class="token operator">||</span>
      nextProp <span class="token operator">===</span> lastProp <span class="token operator">||</span>
      <span class="token punctuation">(</span>nextProp <span class="token operator">==</span> <span class="token keyword">null</span> <span class="token operator">&amp;&amp;</span> lastProp <span class="token operator">==</span> <span class="token keyword">null</span><span class="token punctuation">)</span>
    <span class="token punctuation">)</span> <span class="token punctuation">{</span>
      <span class="token keyword">continue</span><span class="token punctuation">;</span>
    <span class="token punctuation">}</span>
    <span class="token keyword">if</span> <span class="token punctuation">(</span>propKey <span class="token operator">===</span> <span class="token constant">STYLE</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
      <span class="token keyword">if</span> <span class="token punctuation">(</span>lastProp<span class="token punctuation">)</span> <span class="token punctuation">{</span>
        <span class="token keyword">for</span> <span class="token punctuation">(</span>styleName <span class="token keyword">in</span> lastProp<span class="token punctuation">)</span> <span class="token punctuation">{</span>
          <span class="token keyword">if</span> <span class="token punctuation">(</span>
            lastProp<span class="token punctuation">.</span><span class="token function">hasOwnProperty</span><span class="token punctuation">(</span>styleName<span class="token punctuation">)</span> <span class="token operator">&amp;&amp;</span>
            <span class="token punctuation">(</span><span class="token operator">!</span>nextProp <span class="token operator">||</span> <span class="token operator">!</span>nextProp<span class="token punctuation">.</span><span class="token function">hasOwnProperty</span><span class="token punctuation">(</span>styleName<span class="token punctuation">)</span><span class="token punctuation">)</span>
          <span class="token punctuation">)</span> <span class="token punctuation">{</span>
            <span class="token keyword">if</span> <span class="token punctuation">(</span><span class="token operator">!</span>styleUpdates<span class="token punctuation">)</span> <span class="token punctuation">{</span>
              styleUpdates <span class="token operator">=</span> <span class="token punctuation">{</span><span class="token punctuation">}</span><span class="token punctuation">;</span>
            <span class="token punctuation">}</span>
            styleUpdates<span class="token punctuation">[</span>styleName<span class="token punctuation">]</span> <span class="token operator">=</span> <span class="token string">&quot;&quot;</span><span class="token punctuation">;</span>
          <span class="token punctuation">}</span>
        <span class="token punctuation">}</span>
        <span class="token keyword">for</span> <span class="token punctuation">(</span>styleName <span class="token keyword">in</span> nextProp<span class="token punctuation">)</span> <span class="token punctuation">{</span>
          <span class="token keyword">if</span> <span class="token punctuation">(</span>
            nextProp<span class="token punctuation">.</span><span class="token function">hasOwnProperty</span><span class="token punctuation">(</span>styleName<span class="token punctuation">)</span> <span class="token operator">&amp;&amp;</span>
            lastProp<span class="token punctuation">[</span>styleName<span class="token punctuation">]</span> <span class="token operator">!==</span> nextProp<span class="token punctuation">[</span>styleName<span class="token punctuation">]</span>
          <span class="token punctuation">)</span> <span class="token punctuation">{</span>
            <span class="token keyword">if</span> <span class="token punctuation">(</span><span class="token operator">!</span>styleUpdates<span class="token punctuation">)</span> <span class="token punctuation">{</span>
              styleUpdates <span class="token operator">=</span> <span class="token punctuation">{</span><span class="token punctuation">}</span><span class="token punctuation">;</span>
            <span class="token punctuation">}</span>
            styleUpdates<span class="token punctuation">[</span>styleName<span class="token punctuation">]</span> <span class="token operator">=</span> nextProp<span class="token punctuation">[</span>styleName<span class="token punctuation">]</span><span class="token punctuation">;</span>
          <span class="token punctuation">}</span>
        <span class="token punctuation">}</span>
      <span class="token punctuation">}</span> <span class="token keyword">else</span> <span class="token punctuation">{</span>
        <span class="token keyword">if</span> <span class="token punctuation">(</span><span class="token operator">!</span>styleUpdates<span class="token punctuation">)</span> <span class="token punctuation">{</span>
          <span class="token keyword">if</span> <span class="token punctuation">(</span><span class="token operator">!</span>updatePayload<span class="token punctuation">)</span> <span class="token punctuation">{</span>
            updatePayload <span class="token operator">=</span> <span class="token punctuation">[</span><span class="token punctuation">]</span><span class="token punctuation">;</span>
          <span class="token punctuation">}</span>
          updatePayload<span class="token punctuation">.</span><span class="token function">push</span><span class="token punctuation">(</span>propKey<span class="token punctuation">,</span> styleUpdates<span class="token punctuation">)</span><span class="token punctuation">;</span>
        <span class="token punctuation">}</span>
        styleUpdates <span class="token operator">=</span> nextProp<span class="token punctuation">;</span>
      <span class="token punctuation">}</span>
    <span class="token punctuation">}</span> <span class="token keyword">else</span> <span class="token keyword">if</span> <span class="token punctuation">(</span>propKey <span class="token operator">===</span> <span class="token constant">CHILDREN</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
      <span class="token keyword">if</span> <span class="token punctuation">(</span><span class="token keyword">typeof</span> nextProp <span class="token operator">===</span> <span class="token string">&quot;string&quot;</span> <span class="token operator">||</span> <span class="token keyword">typeof</span> nextProp <span class="token operator">===</span> <span class="token string">&quot;number&quot;</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
        <span class="token punctuation">(</span>updatePayload <span class="token operator">=</span> updatePayload <span class="token operator">||</span> <span class="token punctuation">[</span><span class="token punctuation">]</span><span class="token punctuation">)</span><span class="token punctuation">.</span><span class="token function">push</span><span class="token punctuation">(</span>propKey<span class="token punctuation">,</span> <span class="token string">&quot;&quot;</span> <span class="token operator">+</span> nextProp<span class="token punctuation">)</span><span class="token punctuation">;</span>
      <span class="token punctuation">}</span>
    <span class="token punctuation">}</span> <span class="token keyword">else</span> <span class="token punctuation">{</span>
      <span class="token punctuation">(</span>updatePayload <span class="token operator">=</span> updatePayload <span class="token operator">||</span> <span class="token punctuation">[</span><span class="token punctuation">]</span><span class="token punctuation">)</span><span class="token punctuation">.</span><span class="token function">push</span><span class="token punctuation">(</span>propKey<span class="token punctuation">,</span> nextProp<span class="token punctuation">)</span><span class="token punctuation">;</span>
    <span class="token punctuation">}</span>
  <span class="token punctuation">}</span>
  <span class="token keyword">if</span> <span class="token punctuation">(</span>styleUpdates<span class="token punctuation">)</span> <span class="token punctuation">{</span>
    <span class="token punctuation">(</span>updatePayload <span class="token operator">=</span> updatePayload <span class="token operator">||</span> <span class="token punctuation">[</span><span class="token punctuation">]</span><span class="token punctuation">)</span><span class="token punctuation">.</span><span class="token function">push</span><span class="token punctuation">(</span><span class="token constant">STYLE</span><span class="token punctuation">,</span> styleUpdates<span class="token punctuation">)</span><span class="token punctuation">;</span>
  <span class="token punctuation">}</span>
  <span class="token keyword">return</span> updatePayload<span class="token punctuation">;</span>
<span class="token punctuation">}</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="updatereducer-小结" tabindex="-1"><a class="header-anchor" href="#updatereducer-小结" aria-hidden="true">#</a> updateReducer 小结</h3><ol><li>在派发函数 dispatchReducerAction 中，基于当前 Fiber、更新队列和 action 对象，生成一个长度为 3n 的数组 concurrentQueues，每三个索引分别存储渲染对象 fiber、更新队列 queue、更新内容 update。最后回归到 HostRoot 根节点开启调度计划更新 scheduleUpdateOnFiber</li><li>在调度计划中，函数调用至 prepareFreshStack，开始串起更新任务，调用 finishQueueingConcurrentUpdates。将 concurrentQueues 每三个一组，将更新队列 queue 中的 pending 负载以链表形式环链，queue.pending 永远指向最后一个更新，queue.pending.next 指向第一个更新</li><li>prepareFreshStack 结束，进入 workLoopSync，执行工作单元调度 performUnitOfWork，首先执行 beginWork <ol><li>beginWork 阶段，由于 IndeterminateComponent 类型的组件在执行挂载的时候，tag 统一转为 FunctionComponent 类型组件，因此 FunctionComponent 更新时另起一个<code>case FunctionComponent</code>，用于更新函数组件</li><li>更新函数 updateFunctionComponent 包含两大步骤，重渲染 hooks(renderWithHooks) 和 协调 DIFF 子节点(reconcileChildren)</li><li>以下是 renderWithHooks 的过程： <ol><li>通过判断老 Fiber 是否为空且老 Fiber 的 memoizedState 是否为空来判断给 ReactCurrentDispatcher.current 中 useReducer 属性赋予为 mountReducer 或 updateReducer。此处函数更新，老 Fiber 不为空且 Fiber.memoizedState 为已创建的 hook 对象，所以函数组件如果重新执行渲染，原先的 useReducer 函数由挂载函数变更为更新函数，进入 updateReducer 调用</li><li>updateReducer 阶段，根据当前 Fiber 和当前 Hooks 依序进行更新操作，获取老 Fiber.alternate 的已有的 fiberHook 链表，顺序取出当前需要执行的 currentHook</li><li>由于 queue.pending 在 finishQueueingConcurrentUpdates 时已完成链接，所以从头开始循环 currentHook.queue.pending，顺序执行调用 useReducer 中存储的 reducer 方法，退出循环时将最新的状态值 newState 赋给 hook.memoizedState</li><li>返回最新的 hook.memoizedState 和 dispatch 派发函数组成的数组，等待函数组件执行渲染，并清除 FiberHooks 工作栈中的 hook 和 fiber 等</li></ol></li><li>以下是 reconcileChildren 的过程： <ol><li>由于老 fiber(workInProgress.alternate)不为 null，所以开始进行新老 child 的 diff 比较</li><li>暂时还是以单元素节点协调 reconcileSingleElement 为例，比较判断单节点的 key 和 type 是否相同，如果相同则基于老 Fiber 属性对老 child 拷贝一个新 Fiber(createWorkInProgress &amp;&amp; useFiber 克隆)并直接返回。此处比较关键的是新 Fiber 继承了老 Fiber 的 memoizedState、memoizedProps、StateNode 等属性，无需再次初始化</li></ol></li><li>beginWork 执行完毕，进入 completeWork 执行 <ol><li>对于需要完成更新的原生标签组件，判断老的 Fiber 节点 fiber.alternate 和新 Fiber 的 DOM 元素 workInProgress.stateNode 是否不为 null，如果成立则执行原生组件更新 updateHostComponent</li><li>对新 Fiber.pendingProps 和老 Fiber.memoizedProps 进行全属性比较与遍历，生成一个长度为 2n 的数组 updatePayload，偶数索引(0.2.4.6.8)元素代表属性名 propKey，奇数索引(1.3.5.7.9)元素代表属性值 propValue。注意对不同属性的 propKey 需要执行不同的生成策略，如 style 属性、children 属性等</li><li>最后为新 Fiber(workInProgress)的 updateQueue 挂载 updatePayload，并标记更新副作用，让最终的 workInProgress.flags 变更为 MutationMask(插入 | 更新)</li></ol></li></ol></li><li>现阶段最后挂载的 workInProgress.updateQueue，就是 updateReducer 阶段的最终产物了</li></ol><p>updateReducer 点击 button 的控制台输出结果：</p><p><img src="https://misaka10032.oss-cn-chengdu.aliyuncs.com/React/updateReducerResult.jpg" alt="updateReducerResult" loading="lazy"></p><h2 id="commitreducer" tabindex="-1"><a class="header-anchor" href="#commitreducer" aria-hidden="true">#</a> commitReducer</h2><h3 id="reactfibercompletework-js-1" tabindex="-1"><a class="header-anchor" href="#reactfibercompletework-js-1" aria-hidden="true">#</a> ReactFiberCompleteWork.js</h3><p>src\\react-reconciler\\src\\ReactFiberCompleteWork.js</p><p>执行函数组件副作用冒泡</p><div class="language-javascript line-numbers-mode" data-ext="js"><pre class="language-javascript"><code><span class="token keyword">import</span> logger<span class="token punctuation">,</span> <span class="token punctuation">{</span> indent <span class="token punctuation">}</span> <span class="token keyword">from</span> <span class="token string">&quot;shared/logger&quot;</span><span class="token punctuation">;</span>
<span class="token keyword">import</span> <span class="token punctuation">{</span>
  FunctionComponent<span class="token punctuation">,</span>
  HostComponent<span class="token punctuation">,</span>
  HostRoot<span class="token punctuation">,</span>
  HostText<span class="token punctuation">,</span>
<span class="token punctuation">}</span> <span class="token keyword">from</span> <span class="token string">&quot;react-reconciler/src/ReactWorkTags&quot;</span><span class="token punctuation">;</span>
<span class="token keyword">import</span> <span class="token punctuation">{</span>
  createInstance<span class="token punctuation">,</span>
  createTextInstance<span class="token punctuation">,</span>
  appendInitialChild<span class="token punctuation">,</span>
  finalizeInitialChildren<span class="token punctuation">,</span>
  prepareUpdate<span class="token punctuation">,</span>
<span class="token punctuation">}</span> <span class="token keyword">from</span> <span class="token string">&quot;react-dom/src/client/ReactDOMHostConfig&quot;</span><span class="token punctuation">;</span>
<span class="token keyword">import</span> <span class="token punctuation">{</span> NoFlags<span class="token punctuation">,</span> Update <span class="token punctuation">}</span> <span class="token keyword">from</span> <span class="token string">&quot;react-reconciler/src/ReactFiberFlags&quot;</span><span class="token punctuation">;</span>

<span class="token doc-comment comment">/**
 * 属性冒泡，旨在向上收集子孙节点的更新副作用，当子节点不存在副作用时说明无需更新，便于diff优化
 * <span class="token keyword">@param</span> <span class="token parameter">completedWork</span>
 */</span>
<span class="token keyword">function</span> <span class="token function">bubbleProperties</span><span class="token punctuation">(</span><span class="token parameter">completedWork</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
  <span class="token keyword">let</span> subtreeFlags <span class="token operator">=</span> NoFlags<span class="token punctuation">;</span>
  <span class="token keyword">let</span> child <span class="token operator">=</span> completedWork<span class="token punctuation">.</span>child<span class="token punctuation">;</span>
  <span class="token comment">// 遍历当前fiber的所有子节点，把所有子节点的副作用及子节点的子节点副作用合并收集起来</span>
  <span class="token keyword">while</span> <span class="token punctuation">(</span>child <span class="token operator">!==</span> <span class="token keyword">null</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
    subtreeFlags <span class="token operator">|=</span> child<span class="token punctuation">.</span>subtreeFlags<span class="token punctuation">;</span>
    subtreeFlags <span class="token operator">|=</span> child<span class="token punctuation">.</span>flags<span class="token punctuation">;</span>
    child <span class="token operator">=</span> child<span class="token punctuation">.</span>sibling<span class="token punctuation">;</span>
  <span class="token punctuation">}</span>
  <span class="token comment">// 收集子节点的副作用，注意flags才是节点自己的副作用</span>
  completedWork<span class="token punctuation">.</span>subtreeFlags <span class="token operator">=</span> subtreeFlags<span class="token punctuation">;</span>
<span class="token punctuation">}</span>

<span class="token doc-comment comment">/**
 * 把当前完成的fiber所有子节点对应真实DOM都挂在到父parent真实DOM节点上
 * <span class="token keyword">@param</span> <span class="token parameter">parent</span> 当前完成的fiber真实DOM节点
 * <span class="token keyword">@param</span> <span class="token parameter">workInProgress</span> 完成的fiber
 */</span>
<span class="token keyword">function</span> <span class="token function">appendAllChildren</span><span class="token punctuation">(</span><span class="token parameter">parent<span class="token punctuation">,</span> workInProgress</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
  <span class="token keyword">let</span> node <span class="token operator">=</span> workInProgress<span class="token punctuation">.</span>child<span class="token punctuation">;</span>
  <span class="token keyword">while</span> <span class="token punctuation">(</span>node<span class="token punctuation">)</span> <span class="token punctuation">{</span>
    <span class="token keyword">if</span> <span class="token punctuation">(</span>node<span class="token punctuation">.</span>tag <span class="token operator">===</span> HostComponent <span class="token operator">||</span> node<span class="token punctuation">.</span>tag <span class="token operator">===</span> HostText<span class="token punctuation">)</span> <span class="token punctuation">{</span>
      <span class="token comment">// 如果子节点是原生节点或文本节点</span>
      <span class="token function">appendInitialChild</span><span class="token punctuation">(</span>parent<span class="token punctuation">,</span> node<span class="token punctuation">.</span>stateNode<span class="token punctuation">)</span><span class="token punctuation">;</span>
    <span class="token punctuation">}</span> <span class="token keyword">else</span> <span class="token keyword">if</span> <span class="token punctuation">(</span>node<span class="token punctuation">.</span>child <span class="token operator">!==</span> <span class="token keyword">null</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
      <span class="token comment">// 如果第一个儿子不是原生节点，说明它可能是一个函数组件节点</span>
      node <span class="token operator">=</span> node<span class="token punctuation">.</span>child<span class="token punctuation">;</span>
      <span class="token keyword">continue</span><span class="token punctuation">;</span>
    <span class="token punctuation">}</span>
    <span class="token comment">// 如果当前的节点没有弟弟</span>
    <span class="token keyword">while</span> <span class="token punctuation">(</span>node<span class="token punctuation">.</span>sibling <span class="token operator">===</span> <span class="token keyword">null</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
      <span class="token keyword">if</span> <span class="token punctuation">(</span>node<span class="token punctuation">.</span>return <span class="token operator">===</span> <span class="token keyword">null</span> <span class="token operator">||</span> node<span class="token punctuation">.</span>return <span class="token operator">===</span> workInProgress<span class="token punctuation">)</span> <span class="token punctuation">{</span>
        <span class="token keyword">return</span><span class="token punctuation">;</span>
      <span class="token punctuation">}</span>
      <span class="token comment">// 回到父节点</span>
      node <span class="token operator">=</span> node<span class="token punctuation">.</span>return<span class="token punctuation">;</span>
    <span class="token punctuation">}</span>
    node <span class="token operator">=</span> node<span class="token punctuation">.</span>sibling<span class="token punctuation">;</span>
  <span class="token punctuation">}</span>
<span class="token punctuation">}</span>

<span class="token keyword">function</span> <span class="token function">markUpdate</span><span class="token punctuation">(</span><span class="token parameter">workInProgress</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
  workInProgress<span class="token punctuation">.</span>flags <span class="token operator">|=</span> Update<span class="token punctuation">;</span>
<span class="token punctuation">}</span>

<span class="token keyword">function</span> <span class="token function">updateHostComponent</span><span class="token punctuation">(</span><span class="token parameter">current<span class="token punctuation">,</span> workInProgress<span class="token punctuation">,</span> type<span class="token punctuation">,</span> newProps</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
  <span class="token keyword">const</span> oldProps <span class="token operator">=</span> current<span class="token punctuation">.</span>memoizedProps<span class="token punctuation">;</span>
  <span class="token keyword">const</span> instance <span class="token operator">=</span> workInProgress<span class="token punctuation">.</span>stateNode<span class="token punctuation">;</span>
  <span class="token keyword">const</span> updatePayload <span class="token operator">=</span> <span class="token function">prepareUpdate</span><span class="token punctuation">(</span>instance<span class="token punctuation">,</span> type<span class="token punctuation">,</span> oldProps<span class="token punctuation">,</span> newProps<span class="token punctuation">)</span><span class="token punctuation">;</span>
  workInProgress<span class="token punctuation">.</span>updateQueue <span class="token operator">=</span> updatePayload<span class="token punctuation">;</span>
  <span class="token keyword">if</span> <span class="token punctuation">(</span>updatePayload<span class="token punctuation">)</span> <span class="token punctuation">{</span>
    <span class="token function">markUpdate</span><span class="token punctuation">(</span>workInProgress<span class="token punctuation">)</span><span class="token punctuation">;</span>
  <span class="token punctuation">}</span>
<span class="token punctuation">}</span>

<span class="token doc-comment comment">/**
 * 完成一个fiber节点
 * <span class="token keyword">@param</span> <span class="token parameter">current</span> 老fiber
 * <span class="token keyword">@param</span> <span class="token parameter">workInProgress</span> 新的构建fiber
 */</span>
<span class="token keyword">export</span> <span class="token keyword">function</span> <span class="token function">completeWork</span><span class="token punctuation">(</span><span class="token parameter">current<span class="token punctuation">,</span> workInProgress</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
  <span class="token function">logger</span><span class="token punctuation">(</span><span class="token string">&quot; &quot;</span><span class="token punctuation">.</span><span class="token function">repeat</span><span class="token punctuation">(</span>indent<span class="token punctuation">.</span>number<span class="token punctuation">)</span> <span class="token operator">+</span> <span class="token string">&quot;completeWork&quot;</span><span class="token punctuation">,</span> workInProgress<span class="token punctuation">)</span><span class="token punctuation">;</span>
  indent<span class="token punctuation">.</span>number <span class="token operator">-=</span> <span class="token number">2</span><span class="token punctuation">;</span>
  <span class="token keyword">const</span> newProps <span class="token operator">=</span> workInProgress<span class="token punctuation">.</span>pendingProps<span class="token punctuation">;</span>
  <span class="token keyword">switch</span> <span class="token punctuation">(</span>workInProgress<span class="token punctuation">.</span>tag<span class="token punctuation">)</span> <span class="token punctuation">{</span>
    <span class="token keyword">case</span> <span class="token literal-property property">HostRoot</span><span class="token operator">:</span>
      <span class="token function">bubbleProperties</span><span class="token punctuation">(</span>workInProgress<span class="token punctuation">)</span><span class="token punctuation">;</span>
      <span class="token keyword">break</span><span class="token punctuation">;</span>
    <span class="token keyword">case</span> <span class="token literal-property property">HostComponent</span><span class="token operator">:</span> <span class="token punctuation">{</span>
      <span class="token keyword">const</span> <span class="token punctuation">{</span> type <span class="token punctuation">}</span> <span class="token operator">=</span> workInProgress<span class="token punctuation">;</span>
      <span class="token keyword">if</span> <span class="token punctuation">(</span>current <span class="token operator">!==</span> <span class="token keyword">null</span> <span class="token operator">&amp;&amp;</span> workInProgress<span class="token punctuation">.</span>stateNode <span class="token operator">!==</span> <span class="token keyword">null</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
        <span class="token function">updateHostComponent</span><span class="token punctuation">(</span>current<span class="token punctuation">,</span> workInProgress<span class="token punctuation">,</span> type<span class="token punctuation">,</span> newProps<span class="token punctuation">)</span><span class="token punctuation">;</span>
        console<span class="token punctuation">.</span><span class="token function">log</span><span class="token punctuation">(</span><span class="token string">&quot;updatePayload&quot;</span><span class="token punctuation">,</span> workInProgress<span class="token punctuation">.</span>updateQueue<span class="token punctuation">)</span><span class="token punctuation">;</span>
      <span class="token punctuation">}</span> <span class="token keyword">else</span> <span class="token punctuation">{</span>
        <span class="token comment">// 暂时只处理初次创建或挂载的新节点逻辑</span>
        <span class="token comment">// 创建真实的DOM节点</span>
        <span class="token keyword">const</span> instance <span class="token operator">=</span> <span class="token function">createInstance</span><span class="token punctuation">(</span>type<span class="token punctuation">,</span> newProps<span class="token punctuation">,</span> workInProgress<span class="token punctuation">)</span><span class="token punctuation">;</span>
        <span class="token comment">// 把自己所有的儿子都添加到自己身上</span>
        <span class="token function">appendAllChildren</span><span class="token punctuation">(</span>instance<span class="token punctuation">,</span> workInProgress<span class="token punctuation">)</span><span class="token punctuation">;</span>
        workInProgress<span class="token punctuation">.</span>stateNode <span class="token operator">=</span> instance<span class="token punctuation">;</span>
        <span class="token function">finalizeInitialChildren</span><span class="token punctuation">(</span>instance<span class="token punctuation">,</span> type<span class="token punctuation">,</span> newProps<span class="token punctuation">)</span><span class="token punctuation">;</span>
      <span class="token punctuation">}</span>
      <span class="token function">bubbleProperties</span><span class="token punctuation">(</span>workInProgress<span class="token punctuation">)</span><span class="token punctuation">;</span>
      <span class="token keyword">break</span><span class="token punctuation">;</span>
    <span class="token punctuation">}</span>
    <span class="token keyword">case</span> <span class="token literal-property property">FunctionComponent</span><span class="token operator">:</span> <span class="token punctuation">{</span>
      <span class="token function">bubbleProperties</span><span class="token punctuation">(</span>workInProgress<span class="token punctuation">)</span><span class="token punctuation">;</span>
      <span class="token keyword">break</span><span class="token punctuation">;</span>
    <span class="token punctuation">}</span>
    <span class="token keyword">case</span> <span class="token literal-property property">HostText</span><span class="token operator">:</span>
      <span class="token comment">// 文本节点的props就是文本内容，直接创建真实的文本节点</span>
      <span class="token keyword">const</span> newText <span class="token operator">=</span> newProps<span class="token punctuation">;</span>
      <span class="token comment">// 创建真实的DOM节点，并传入stateNode</span>
      workInProgress<span class="token punctuation">.</span>stateNode <span class="token operator">=</span> <span class="token function">createTextInstance</span><span class="token punctuation">(</span>newText<span class="token punctuation">)</span><span class="token punctuation">;</span>
      <span class="token comment">// 向上冒泡属性</span>
      <span class="token function">bubbleProperties</span><span class="token punctuation">(</span>workInProgress<span class="token punctuation">)</span><span class="token punctuation">;</span>
      <span class="token keyword">break</span><span class="token punctuation">;</span>
  <span class="token punctuation">}</span>
<span class="token punctuation">}</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="reactfibercommitwork-js" tabindex="-1"><a class="header-anchor" href="#reactfibercommitwork-js" aria-hidden="true">#</a> ReactFiberCommitWork.js</h3><p>src\\react-reconciler\\src\\ReactFiberCommitWork.js</p><div class="language-javascript line-numbers-mode" data-ext="js"><pre class="language-javascript"><code><span class="token keyword">import</span> <span class="token punctuation">{</span>
  appendChild<span class="token punctuation">,</span>
  insertBefore<span class="token punctuation">,</span>
  commitUpdate<span class="token punctuation">,</span>
<span class="token punctuation">}</span> <span class="token keyword">from</span> <span class="token string">&quot;react-dom/src/client/ReactDOMHostConfig&quot;</span><span class="token punctuation">;</span>
<span class="token keyword">import</span> <span class="token punctuation">{</span>
  FunctionComponent<span class="token punctuation">,</span>
  HostComponent<span class="token punctuation">,</span>
  HostRoot<span class="token punctuation">,</span>
  HostText<span class="token punctuation">,</span>
<span class="token punctuation">}</span> <span class="token keyword">from</span> <span class="token string">&quot;react-reconciler/src/ReactWorkTags&quot;</span><span class="token punctuation">;</span>
<span class="token keyword">import</span> <span class="token punctuation">{</span>
  MutationMask<span class="token punctuation">,</span>
  Placement<span class="token punctuation">,</span>
  Update<span class="token punctuation">,</span>
<span class="token punctuation">}</span> <span class="token keyword">from</span> <span class="token string">&quot;react-reconciler/src/ReactFiberFlags&quot;</span><span class="token punctuation">;</span>

<span class="token keyword">function</span> <span class="token function">recursivelyTraverseMutationEffects</span><span class="token punctuation">(</span><span class="token parameter">root<span class="token punctuation">,</span> parentFiber</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
  <span class="token keyword">if</span> <span class="token punctuation">(</span>parentFiber<span class="token punctuation">.</span>subtreeFlags <span class="token operator">&amp;</span> MutationMask<span class="token punctuation">)</span> <span class="token punctuation">{</span>
    <span class="token keyword">let</span> <span class="token punctuation">{</span> child <span class="token punctuation">}</span> <span class="token operator">=</span> parentFiber<span class="token punctuation">;</span>
    <span class="token keyword">while</span> <span class="token punctuation">(</span>child <span class="token operator">!==</span> <span class="token keyword">null</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
      <span class="token function">commitMutationEffectsOnFiber</span><span class="token punctuation">(</span>child<span class="token punctuation">,</span> root<span class="token punctuation">)</span><span class="token punctuation">;</span>
      child <span class="token operator">=</span> child<span class="token punctuation">.</span>sibling<span class="token punctuation">;</span>
    <span class="token punctuation">}</span>
  <span class="token punctuation">}</span>
<span class="token punctuation">}</span>

<span class="token keyword">function</span> <span class="token function">commitReconciliationEffects</span><span class="token punctuation">(</span><span class="token parameter">finishedWork</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
  <span class="token keyword">const</span> <span class="token punctuation">{</span> flags <span class="token punctuation">}</span> <span class="token operator">=</span> finishedWork<span class="token punctuation">;</span>
  <span class="token keyword">if</span> <span class="token punctuation">(</span>flags <span class="token operator">&amp;&amp;</span> Placement<span class="token punctuation">)</span> <span class="token punctuation">{</span>
    <span class="token comment">// 进行插入操作，也就是把此fiber对应的真实DOM节点添加到父真实DOM上</span>
    <span class="token function">commitPlacement</span><span class="token punctuation">(</span>finishedWork<span class="token punctuation">)</span><span class="token punctuation">;</span>
    <span class="token comment">// 把flags里的Placement删除</span>
    finishedWork<span class="token punctuation">.</span>flags <span class="token operator">&amp;=</span> <span class="token operator">~</span>Placement<span class="token punctuation">;</span>
  <span class="token punctuation">}</span>
<span class="token punctuation">}</span>

<span class="token keyword">function</span> <span class="token function">isHostParent</span><span class="token punctuation">(</span><span class="token parameter">fiber</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
  <span class="token keyword">return</span> fiber<span class="token punctuation">.</span>tag <span class="token operator">===</span> HostComponent <span class="token operator">||</span> fiber<span class="token punctuation">.</span>tag <span class="token operator">===</span> HostRoot<span class="token punctuation">;</span> <span class="token comment">//只有根fiber或根组件节点才能作为父fiber</span>
<span class="token punctuation">}</span>

<span class="token keyword">function</span> <span class="token function">getHostParentFiber</span><span class="token punctuation">(</span><span class="token parameter">fiber</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
  <span class="token keyword">let</span> parent <span class="token operator">=</span> fiber<span class="token punctuation">.</span>return<span class="token punctuation">;</span>
  <span class="token keyword">while</span> <span class="token punctuation">(</span>parent <span class="token operator">!==</span> <span class="token keyword">null</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
    <span class="token keyword">if</span> <span class="token punctuation">(</span><span class="token function">isHostParent</span><span class="token punctuation">(</span>parent<span class="token punctuation">)</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
      <span class="token keyword">return</span> parent<span class="token punctuation">;</span>
    <span class="token punctuation">}</span>
    parent <span class="token operator">=</span> parent<span class="token punctuation">.</span>return<span class="token punctuation">;</span>
  <span class="token punctuation">}</span>
<span class="token punctuation">}</span>

<span class="token doc-comment comment">/**
 * 把子节点对应的真实DOM插入到父节点DOM中
 * <span class="token keyword">@param</span> <span class="token parameter">node</span> 将要插入的fiber节点
 * <span class="token keyword">@param</span> <span class="token parameter">before</span> 待insertBefore的DOM节点
 * <span class="token keyword">@param</span> <span class="token parameter">parent</span> 父真实DOM节点
 */</span>
<span class="token keyword">function</span> <span class="token function">insertOrAppendPlacementNode</span><span class="token punctuation">(</span><span class="token parameter">node<span class="token punctuation">,</span> before<span class="token punctuation">,</span> parent</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
  <span class="token keyword">const</span> <span class="token punctuation">{</span> tag <span class="token punctuation">}</span> <span class="token operator">=</span> node<span class="token punctuation">;</span>
  <span class="token comment">// 判断此fiber对应的节点是不是真实DOM节点</span>
  <span class="token keyword">const</span> isHost <span class="token operator">=</span> tag <span class="token operator">===</span> HostComponent <span class="token operator">||</span> tag <span class="token operator">===</span> HostText<span class="token punctuation">;</span>
  <span class="token keyword">if</span> <span class="token punctuation">(</span>isHost<span class="token punctuation">)</span> <span class="token punctuation">{</span>
    <span class="token comment">// 如果是的话就直接插入</span>
    <span class="token keyword">const</span> <span class="token punctuation">{</span> stateNode <span class="token punctuation">}</span> <span class="token operator">=</span> node<span class="token punctuation">;</span>
    <span class="token keyword">if</span> <span class="token punctuation">(</span>before<span class="token punctuation">)</span> <span class="token punctuation">{</span>
      <span class="token function">insertBefore</span><span class="token punctuation">(</span>parent<span class="token punctuation">,</span> stateNode<span class="token punctuation">,</span> before<span class="token punctuation">)</span><span class="token punctuation">;</span>
    <span class="token punctuation">}</span> <span class="token keyword">else</span> <span class="token punctuation">{</span>
      <span class="token function">appendChild</span><span class="token punctuation">(</span>parent<span class="token punctuation">,</span> stateNode<span class="token punctuation">)</span><span class="token punctuation">;</span>
    <span class="token punctuation">}</span>
  <span class="token punctuation">}</span> <span class="token keyword">else</span> <span class="token punctuation">{</span>
    <span class="token comment">// 如果node不是真实DOM节点，获取它的child</span>
    <span class="token keyword">const</span> <span class="token punctuation">{</span> child <span class="token punctuation">}</span> <span class="token operator">=</span> node<span class="token punctuation">;</span>
    <span class="token keyword">if</span> <span class="token punctuation">(</span>child <span class="token operator">!==</span> <span class="token keyword">null</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
      <span class="token function">insertOrAppendPlacementNode</span><span class="token punctuation">(</span>child<span class="token punctuation">,</span> before<span class="token punctuation">,</span> parent<span class="token punctuation">)</span><span class="token punctuation">;</span>
      <span class="token keyword">let</span> <span class="token punctuation">{</span> sibling <span class="token punctuation">}</span> <span class="token operator">=</span> child<span class="token punctuation">;</span>
      <span class="token keyword">while</span> <span class="token punctuation">(</span>sibling <span class="token operator">!==</span> <span class="token keyword">null</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
        <span class="token function">insertOrAppendPlacementNode</span><span class="token punctuation">(</span>sibling<span class="token punctuation">,</span> before<span class="token punctuation">,</span> parent<span class="token punctuation">)</span><span class="token punctuation">;</span>
        sibling <span class="token operator">=</span> sibling<span class="token punctuation">.</span>sibling<span class="token punctuation">;</span>
      <span class="token punctuation">}</span>
    <span class="token punctuation">}</span>
  <span class="token punctuation">}</span>
<span class="token punctuation">}</span>

<span class="token doc-comment comment">/**
 * 找到要插入的锚点
 * 找到可以插在它前面的那个fiber对应的真实DOM
 * <span class="token keyword">@param</span> <span class="token parameter">fiber</span>
 */</span>
<span class="token keyword">function</span> <span class="token function">getHostSibling</span><span class="token punctuation">(</span><span class="token parameter">fiber</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
  <span class="token keyword">let</span> node <span class="token operator">=</span> fiber<span class="token punctuation">;</span>
  <span class="token literal-property property">siblings</span><span class="token operator">:</span> <span class="token keyword">while</span> <span class="token punctuation">(</span><span class="token boolean">true</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
    <span class="token keyword">while</span> <span class="token punctuation">(</span>node<span class="token punctuation">.</span>sibling <span class="token operator">===</span> <span class="token keyword">null</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
      <span class="token keyword">if</span> <span class="token punctuation">(</span>node<span class="token punctuation">.</span>return <span class="token operator">===</span> <span class="token keyword">null</span> <span class="token operator">||</span> <span class="token function">isHostParent</span><span class="token punctuation">(</span>node<span class="token punctuation">.</span>return<span class="token punctuation">)</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
        <span class="token keyword">return</span> <span class="token keyword">null</span><span class="token punctuation">;</span>
      <span class="token punctuation">}</span>
      node <span class="token operator">=</span> node<span class="token punctuation">.</span>return<span class="token punctuation">;</span>
    <span class="token punctuation">}</span>
    node <span class="token operator">=</span> node<span class="token punctuation">.</span>sibling<span class="token punctuation">;</span>
    <span class="token comment">// 如果弟弟不是原生节点or文本节点，不是要插入的节点，需要寻找弟弟或儿子</span>
    <span class="token keyword">while</span> <span class="token punctuation">(</span>node<span class="token punctuation">.</span>tag <span class="token operator">!==</span> HostComponent <span class="token operator">||</span> node<span class="token punctuation">.</span>tag <span class="token operator">!==</span> HostText<span class="token punctuation">)</span> <span class="token punctuation">{</span>
      <span class="token comment">// 如果此节点是一个将要插入的新节点，找它的弟弟，否则找儿子</span>
      <span class="token keyword">if</span> <span class="token punctuation">(</span>node<span class="token punctuation">.</span>flags <span class="token operator">&amp;&amp;</span> Placement<span class="token punctuation">)</span> <span class="token punctuation">{</span>
        <span class="token keyword">continue</span> siblings<span class="token punctuation">;</span>
      <span class="token punctuation">}</span> <span class="token keyword">else</span> <span class="token punctuation">{</span>
        node <span class="token operator">=</span> node<span class="token punctuation">.</span>child<span class="token punctuation">;</span>
      <span class="token punctuation">}</span>
    <span class="token punctuation">}</span>
    <span class="token keyword">if</span> <span class="token punctuation">(</span><span class="token operator">!</span><span class="token punctuation">(</span>node<span class="token punctuation">.</span>flags <span class="token operator">&amp;&amp;</span> Placement<span class="token punctuation">)</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
      <span class="token keyword">return</span> node<span class="token punctuation">.</span>stateNode<span class="token punctuation">;</span>
    <span class="token punctuation">}</span>
  <span class="token punctuation">}</span>
<span class="token punctuation">}</span>

<span class="token doc-comment comment">/**
 * 把此fiber的真实DOM插入到父DOM里
 * <span class="token keyword">@param</span> <span class="token parameter">finishedWork</span>
 */</span>
<span class="token keyword">function</span> <span class="token function">commitPlacement</span><span class="token punctuation">(</span><span class="token parameter">finishedWork</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
  <span class="token keyword">const</span> parentFiber <span class="token operator">=</span> <span class="token function">getHostParentFiber</span><span class="token punctuation">(</span>finishedWork<span class="token punctuation">)</span><span class="token punctuation">;</span>
  <span class="token keyword">switch</span> <span class="token punctuation">(</span>parentFiber<span class="token punctuation">.</span>tag<span class="token punctuation">)</span> <span class="token punctuation">{</span>
    <span class="token keyword">case</span> <span class="token literal-property property">HostRoot</span><span class="token operator">:</span> <span class="token punctuation">{</span>
      <span class="token keyword">const</span> parent <span class="token operator">=</span> parentFiber<span class="token punctuation">.</span>stateNode<span class="token punctuation">.</span>containerInfo<span class="token punctuation">;</span>
      <span class="token comment">// 获取最近的真实DOM节点</span>
      <span class="token keyword">const</span> before <span class="token operator">=</span> <span class="token function">getHostSibling</span><span class="token punctuation">(</span>finishedWork<span class="token punctuation">)</span><span class="token punctuation">;</span> <span class="token comment">// 获取最近的真实DOM节点</span>
      <span class="token function">insertOrAppendPlacementNode</span><span class="token punctuation">(</span>finishedWork<span class="token punctuation">,</span> before<span class="token punctuation">,</span> parent<span class="token punctuation">)</span><span class="token punctuation">;</span>
      <span class="token keyword">break</span><span class="token punctuation">;</span>
    <span class="token punctuation">}</span>
    <span class="token keyword">case</span> <span class="token literal-property property">HostComponent</span><span class="token operator">:</span> <span class="token punctuation">{</span>
      <span class="token keyword">const</span> parent <span class="token operator">=</span> parentFiber<span class="token punctuation">.</span>stateNode<span class="token punctuation">;</span>
      <span class="token comment">// 获取最近的真实DOM节点</span>
      <span class="token keyword">const</span> before <span class="token operator">=</span> <span class="token function">getHostSibling</span><span class="token punctuation">(</span>finishedWork<span class="token punctuation">)</span><span class="token punctuation">;</span> <span class="token comment">// 获取最近的真实DOM节点</span>
      <span class="token function">insertOrAppendPlacementNode</span><span class="token punctuation">(</span>finishedWork<span class="token punctuation">,</span> before<span class="token punctuation">,</span> parent<span class="token punctuation">)</span><span class="token punctuation">;</span>
      <span class="token keyword">break</span><span class="token punctuation">;</span>
    <span class="token punctuation">}</span>
  <span class="token punctuation">}</span>
<span class="token punctuation">}</span>

<span class="token doc-comment comment">/**
 * 遍历Fiber树，执行fiber上的副作用
 * <span class="token keyword">@param</span> <span class="token parameter">finishedWork</span> fiberJ节点
 * <span class="token keyword">@param</span> <span class="token parameter">root</span> 根节点
 */</span>
<span class="token keyword">export</span> <span class="token keyword">function</span> <span class="token function">commitMutationEffectsOnFiber</span><span class="token punctuation">(</span><span class="token parameter">finishedWork<span class="token punctuation">,</span> root</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
  <span class="token keyword">const</span> current <span class="token operator">=</span> finishedWork<span class="token punctuation">.</span>alternate<span class="token punctuation">;</span>
  <span class="token keyword">const</span> flags <span class="token operator">=</span> finishedWork<span class="token punctuation">.</span>flags<span class="token punctuation">;</span>
  <span class="token keyword">switch</span> <span class="token punctuation">(</span>finishedWork<span class="token punctuation">.</span>tag<span class="token punctuation">)</span> <span class="token punctuation">{</span>
    <span class="token keyword">case</span> <span class="token literal-property property">HostRoot</span><span class="token operator">:</span> <span class="token punctuation">{</span>
      <span class="token function">recursivelyTraverseMutationEffects</span><span class="token punctuation">(</span>root<span class="token punctuation">,</span> finishedWork<span class="token punctuation">)</span><span class="token punctuation">;</span>
      <span class="token function">commitReconciliationEffects</span><span class="token punctuation">(</span>finishedWork<span class="token punctuation">)</span><span class="token punctuation">;</span>
      <span class="token keyword">break</span><span class="token punctuation">;</span>
    <span class="token punctuation">}</span>
    <span class="token keyword">case</span> <span class="token literal-property property">FunctionComponent</span><span class="token operator">:</span> <span class="token punctuation">{</span>
      <span class="token function">recursivelyTraverseMutationEffects</span><span class="token punctuation">(</span>root<span class="token punctuation">,</span> finishedWork<span class="token punctuation">)</span><span class="token punctuation">;</span>
      <span class="token function">commitReconciliationEffects</span><span class="token punctuation">(</span>finishedWork<span class="token punctuation">)</span><span class="token punctuation">;</span>
      <span class="token keyword">break</span><span class="token punctuation">;</span>
    <span class="token punctuation">}</span>
    <span class="token keyword">case</span> <span class="token literal-property property">HostComponent</span><span class="token operator">:</span> <span class="token punctuation">{</span>
      <span class="token function">recursivelyTraverseMutationEffects</span><span class="token punctuation">(</span>root<span class="token punctuation">,</span> finishedWork<span class="token punctuation">)</span><span class="token punctuation">;</span>
      <span class="token function">commitReconciliationEffects</span><span class="token punctuation">(</span>finishedWork<span class="token punctuation">)</span><span class="token punctuation">;</span>
      <span class="token comment">// 识别更新副作用标识，判断执行更新</span>
      <span class="token keyword">if</span> <span class="token punctuation">(</span>flags <span class="token operator">&amp;</span> Update<span class="token punctuation">)</span> <span class="token punctuation">{</span>
        <span class="token keyword">const</span> instance <span class="token operator">=</span> finishedWork<span class="token punctuation">.</span>stateNode<span class="token punctuation">;</span>
        <span class="token keyword">if</span> <span class="token punctuation">(</span>instance <span class="token operator">!==</span> <span class="token keyword">null</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
          <span class="token keyword">const</span> newProps <span class="token operator">=</span> finishedWork<span class="token punctuation">.</span>memoizedProps<span class="token punctuation">;</span>
          <span class="token keyword">const</span> oldProps <span class="token operator">=</span> current <span class="token operator">!==</span> <span class="token keyword">null</span> <span class="token operator">?</span> current<span class="token punctuation">.</span>memoizedProps <span class="token operator">:</span> newProps<span class="token punctuation">;</span>
          <span class="token keyword">const</span> type <span class="token operator">=</span> finishedWork<span class="token punctuation">.</span>type<span class="token punctuation">;</span>
          <span class="token keyword">const</span> updatePayload <span class="token operator">=</span> finishedWork<span class="token punctuation">.</span>updateQueue<span class="token punctuation">;</span>
          finishedWork<span class="token punctuation">.</span>updateQueue <span class="token operator">=</span> <span class="token keyword">null</span><span class="token punctuation">;</span>
          <span class="token keyword">if</span> <span class="token punctuation">(</span>updatePayload <span class="token operator">!==</span> <span class="token keyword">null</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
            <span class="token function">commitUpdate</span><span class="token punctuation">(</span>
              instance<span class="token punctuation">,</span>
              updatePayload<span class="token punctuation">,</span>
              type<span class="token punctuation">,</span>
              oldProps<span class="token punctuation">,</span>
              newProps<span class="token punctuation">,</span>
              finishedWork
            <span class="token punctuation">)</span><span class="token punctuation">;</span>
          <span class="token punctuation">}</span>
        <span class="token punctuation">}</span>
      <span class="token punctuation">}</span>
      <span class="token keyword">break</span><span class="token punctuation">;</span>
    <span class="token punctuation">}</span>
    <span class="token keyword">case</span> <span class="token literal-property property">HostText</span><span class="token operator">:</span>
      <span class="token comment">// 遍历子节点，处理子节点上的副作用</span>
      <span class="token function">recursivelyTraverseMutationEffects</span><span class="token punctuation">(</span>root<span class="token punctuation">,</span> finishedWork<span class="token punctuation">)</span><span class="token punctuation">;</span>
      <span class="token comment">// 再处理自己身上的副作用</span>
      <span class="token function">commitReconciliationEffects</span><span class="token punctuation">(</span>finishedWork<span class="token punctuation">)</span><span class="token punctuation">;</span>
      <span class="token keyword">break</span><span class="token punctuation">;</span>
    <span class="token keyword">default</span><span class="token operator">:</span>
      <span class="token keyword">break</span><span class="token punctuation">;</span>
  <span class="token punctuation">}</span>
<span class="token punctuation">}</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="reactdomhostconfig-js-1" tabindex="-1"><a class="header-anchor" href="#reactdomhostconfig-js-1" aria-hidden="true">#</a> ReactDOMHostConfig.js</h3><p>src\\react-dom-bindings\\src\\client\\ReactDOMHostConfig.js</p><div class="language-javascript line-numbers-mode" data-ext="js"><pre class="language-javascript"><code><span class="token keyword">import</span> <span class="token punctuation">{</span>
  setInitialProperties<span class="token punctuation">,</span>
  diffProperties<span class="token punctuation">,</span>
  updateProperties<span class="token punctuation">,</span>
<span class="token punctuation">}</span> <span class="token keyword">from</span> <span class="token string">&quot;react-dom/src/client/ReactDOMComponent&quot;</span><span class="token punctuation">;</span>
<span class="token keyword">import</span> <span class="token punctuation">{</span>
  precacheFiberNode<span class="token punctuation">,</span>
  updateFiberProps<span class="token punctuation">,</span>
<span class="token punctuation">}</span> <span class="token keyword">from</span> <span class="token string">&quot;react-dom/src/client/ReactDOMComponentTree&quot;</span><span class="token punctuation">;</span>

<span class="token keyword">export</span> <span class="token keyword">function</span> <span class="token function">shouldSetTextContent</span><span class="token punctuation">(</span><span class="token parameter">type<span class="token punctuation">,</span> props</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
  <span class="token keyword">return</span> <span class="token punctuation">(</span>
    <span class="token keyword">typeof</span> props<span class="token punctuation">.</span>children <span class="token operator">===</span> <span class="token string">&quot;string&quot;</span> <span class="token operator">||</span> <span class="token keyword">typeof</span> props<span class="token punctuation">.</span>children <span class="token operator">===</span> <span class="token string">&quot;number&quot;</span>
  <span class="token punctuation">)</span><span class="token punctuation">;</span>
<span class="token punctuation">}</span>

<span class="token keyword">export</span> <span class="token keyword">function</span> <span class="token function">createTextInstance</span><span class="token punctuation">(</span><span class="token parameter">newText</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
  <span class="token keyword">return</span> document<span class="token punctuation">.</span><span class="token function">createTextNode</span><span class="token punctuation">(</span>newText<span class="token punctuation">)</span><span class="token punctuation">;</span>
<span class="token punctuation">}</span>

<span class="token doc-comment comment">/**
 * 在原生组件初次挂载的时候，会通过此方法创建真实DOM
 * <span class="token keyword">@param</span> <span class="token parameter">type</span> 类型props
 * <span class="token keyword">@param</span> <span class="token parameter">props</span> 属性
 * <span class="token keyword">@param</span> <span class="token parameter">internalInstanceHandle</span> 对应的fiber
 * <span class="token keyword">@returns</span> <span class="token class-name"><span class="token punctuation">{</span><span class="token operator">*</span><span class="token punctuation">}</span></span>
 */</span>
<span class="token keyword">export</span> <span class="token keyword">function</span> <span class="token function">createInstance</span><span class="token punctuation">(</span><span class="token parameter">type<span class="token punctuation">,</span> props<span class="token punctuation">,</span> internalInstanceHandle</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
  <span class="token keyword">const</span> domElement <span class="token operator">=</span> document<span class="token punctuation">.</span><span class="token function">createElement</span><span class="token punctuation">(</span>type<span class="token punctuation">)</span><span class="token punctuation">;</span>
  <span class="token comment">// 预先缓存fiber节点到DOM节点上</span>
  <span class="token function">precacheFiberNode</span><span class="token punctuation">(</span>internalInstanceHandle<span class="token punctuation">,</span> domElement<span class="token punctuation">)</span><span class="token punctuation">;</span>
  <span class="token comment">// 属性的添加TODO</span>
  <span class="token function">updateFiberProps</span><span class="token punctuation">(</span>domElement<span class="token punctuation">,</span> props<span class="token punctuation">)</span><span class="token punctuation">;</span>
  <span class="token keyword">return</span> domElement<span class="token punctuation">;</span>
<span class="token punctuation">}</span>

<span class="token keyword">export</span> <span class="token keyword">function</span> <span class="token function">appendInitialChild</span><span class="token punctuation">(</span><span class="token parameter">parent<span class="token punctuation">,</span> child</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
  parent<span class="token punctuation">.</span><span class="token function">appendChild</span><span class="token punctuation">(</span>child<span class="token punctuation">)</span><span class="token punctuation">;</span>
<span class="token punctuation">}</span>

<span class="token keyword">export</span> <span class="token keyword">function</span> <span class="token function">finalizeInitialChildren</span><span class="token punctuation">(</span><span class="token parameter">domElement<span class="token punctuation">,</span> type<span class="token punctuation">,</span> props<span class="token punctuation">,</span> hostContext</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
  <span class="token function">setInitialProperties</span><span class="token punctuation">(</span>domElement<span class="token punctuation">,</span> type<span class="token punctuation">,</span> props<span class="token punctuation">)</span><span class="token punctuation">;</span>
<span class="token punctuation">}</span>

<span class="token keyword">export</span> <span class="token keyword">function</span> <span class="token function">appendChild</span><span class="token punctuation">(</span><span class="token parameter">parent<span class="token punctuation">,</span> child</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
  parent<span class="token punctuation">.</span><span class="token function">appendChild</span><span class="token punctuation">(</span>child<span class="token punctuation">)</span><span class="token punctuation">;</span>
<span class="token punctuation">}</span>

<span class="token keyword">export</span> <span class="token keyword">function</span> <span class="token function">insertBefore</span><span class="token punctuation">(</span><span class="token parameter">parentInstance<span class="token punctuation">,</span> child<span class="token punctuation">,</span> beforeChild</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
  parentInstance<span class="token punctuation">.</span><span class="token function">insertBefore</span><span class="token punctuation">(</span>child<span class="token punctuation">,</span> beforeChild<span class="token punctuation">)</span><span class="token punctuation">;</span>
<span class="token punctuation">}</span>

<span class="token keyword">export</span> <span class="token keyword">function</span> <span class="token function">prepareUpdate</span><span class="token punctuation">(</span><span class="token parameter">domElement<span class="token punctuation">,</span> type<span class="token punctuation">,</span> oldProps<span class="token punctuation">,</span> newProps</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
  <span class="token keyword">return</span> <span class="token function">diffProperties</span><span class="token punctuation">(</span>domElement<span class="token punctuation">,</span> type<span class="token punctuation">,</span> oldProps<span class="token punctuation">,</span> newProps<span class="token punctuation">)</span><span class="token punctuation">;</span>
<span class="token punctuation">}</span>

<span class="token keyword">export</span> <span class="token keyword">function</span> <span class="token function">commitUpdate</span><span class="token punctuation">(</span>
  <span class="token parameter">domElement<span class="token punctuation">,</span>
  updatePayload<span class="token punctuation">,</span>
  type<span class="token punctuation">,</span>
  oldProps<span class="token punctuation">,</span>
  newProps</span>
<span class="token punctuation">)</span> <span class="token punctuation">{</span>
  <span class="token function">updateProperties</span><span class="token punctuation">(</span>domElement<span class="token punctuation">,</span> updatePayload<span class="token punctuation">,</span> type<span class="token punctuation">,</span> oldProps<span class="token punctuation">,</span> newProps<span class="token punctuation">)</span><span class="token punctuation">;</span>
  <span class="token function">updateFiberProps</span><span class="token punctuation">(</span>domElement<span class="token punctuation">,</span> newProps<span class="token punctuation">)</span><span class="token punctuation">;</span>
<span class="token punctuation">}</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="reactdomcomponent-js-1" tabindex="-1"><a class="header-anchor" href="#reactdomcomponent-js-1" aria-hidden="true">#</a> ReactDOMComponent.js</h3><p>src\\react-dom-bindings\\src\\client\\ReactDOMComponent.js</p><div class="language-javascript line-numbers-mode" data-ext="js"><pre class="language-javascript"><code><span class="token keyword">import</span> <span class="token punctuation">{</span> setValueForStyles <span class="token punctuation">}</span> <span class="token keyword">from</span> <span class="token string">&quot;react-dom/src/client/CSSPropertyOperations&quot;</span><span class="token punctuation">;</span>
<span class="token keyword">import</span> setTextContent <span class="token keyword">from</span> <span class="token string">&quot;react-dom/src/client/setTextContent&quot;</span><span class="token punctuation">;</span>
<span class="token keyword">import</span> <span class="token punctuation">{</span> setValueForProperty <span class="token punctuation">}</span> <span class="token keyword">from</span> <span class="token string">&quot;react-dom/src/client/DOMPropertyOperations&quot;</span><span class="token punctuation">;</span>

<span class="token keyword">const</span> <span class="token constant">STYLE</span> <span class="token operator">=</span> <span class="token string">&quot;style&quot;</span><span class="token punctuation">;</span>
<span class="token keyword">const</span> <span class="token constant">CHILDREN</span> <span class="token operator">=</span> <span class="token string">&quot;children&quot;</span><span class="token punctuation">;</span>

<span class="token keyword">function</span> <span class="token function">setInitialDOMProperties</span><span class="token punctuation">(</span><span class="token parameter">tag<span class="token punctuation">,</span> domElement<span class="token punctuation">,</span> nextProps</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
  <span class="token keyword">for</span> <span class="token punctuation">(</span><span class="token keyword">const</span> propKey <span class="token keyword">in</span> nextProps<span class="token punctuation">)</span> <span class="token punctuation">{</span>
    <span class="token keyword">if</span> <span class="token punctuation">(</span>nextProps<span class="token punctuation">.</span><span class="token function">hasOwnProperty</span><span class="token punctuation">(</span>propKey<span class="token punctuation">)</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
      <span class="token keyword">const</span> nextProp <span class="token operator">=</span> nextProps<span class="token punctuation">[</span>propKey<span class="token punctuation">]</span><span class="token punctuation">;</span>
      <span class="token keyword">if</span> <span class="token punctuation">(</span>propKey <span class="token operator">===</span> <span class="token constant">STYLE</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
        <span class="token function">setValueForStyles</span><span class="token punctuation">(</span>domElement<span class="token punctuation">,</span> nextProp<span class="token punctuation">)</span><span class="token punctuation">;</span>
      <span class="token punctuation">}</span> <span class="token keyword">else</span> <span class="token keyword">if</span> <span class="token punctuation">(</span>propKey <span class="token operator">===</span> <span class="token constant">CHILDREN</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
        <span class="token keyword">if</span> <span class="token punctuation">(</span><span class="token keyword">typeof</span> nextProp <span class="token operator">===</span> <span class="token string">&quot;string&quot;</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
          <span class="token function">setTextContent</span><span class="token punctuation">(</span>domElement<span class="token punctuation">,</span> nextProp<span class="token punctuation">)</span><span class="token punctuation">;</span>
        <span class="token punctuation">}</span> <span class="token keyword">else</span> <span class="token keyword">if</span> <span class="token punctuation">(</span><span class="token keyword">typeof</span> nextProp <span class="token operator">===</span> <span class="token string">&quot;number&quot;</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
          <span class="token function">setTextContent</span><span class="token punctuation">(</span>domElement<span class="token punctuation">,</span> nextProp <span class="token operator">+</span> <span class="token string">&quot;&quot;</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
        <span class="token punctuation">}</span>
      <span class="token punctuation">}</span> <span class="token keyword">else</span> <span class="token keyword">if</span> <span class="token punctuation">(</span>nextProp <span class="token operator">!==</span> <span class="token keyword">null</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
        <span class="token function">setValueForProperty</span><span class="token punctuation">(</span>domElement<span class="token punctuation">,</span> propKey<span class="token punctuation">,</span> nextProp<span class="token punctuation">)</span><span class="token punctuation">;</span>
      <span class="token punctuation">}</span>
    <span class="token punctuation">}</span>
  <span class="token punctuation">}</span>
<span class="token punctuation">}</span>

<span class="token keyword">export</span> <span class="token keyword">function</span> <span class="token function">setInitialProperties</span><span class="token punctuation">(</span><span class="token parameter">domElement<span class="token punctuation">,</span> tag<span class="token punctuation">,</span> props</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
  <span class="token function">setInitialDOMProperties</span><span class="token punctuation">(</span>tag<span class="token punctuation">,</span> domElement<span class="token punctuation">,</span> props<span class="token punctuation">)</span><span class="token punctuation">;</span>
<span class="token punctuation">}</span>

<span class="token keyword">export</span> <span class="token keyword">function</span> <span class="token function">diffProperties</span><span class="token punctuation">(</span><span class="token parameter">domElement<span class="token punctuation">,</span> tag<span class="token punctuation">,</span> lastProps<span class="token punctuation">,</span> nextProps</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
  <span class="token keyword">let</span> updatePayload <span class="token operator">=</span> <span class="token keyword">null</span><span class="token punctuation">;</span>
  <span class="token keyword">let</span> propKey<span class="token punctuation">;</span>
  <span class="token keyword">let</span> styleName<span class="token punctuation">;</span>
  <span class="token keyword">let</span> styleUpdates <span class="token operator">=</span> <span class="token keyword">null</span><span class="token punctuation">;</span>
  <span class="token keyword">for</span> <span class="token punctuation">(</span>propKey <span class="token keyword">in</span> lastProps<span class="token punctuation">)</span> <span class="token punctuation">{</span>
    <span class="token keyword">if</span> <span class="token punctuation">(</span>
      nextProps<span class="token punctuation">.</span><span class="token function">hasOwnProperty</span><span class="token punctuation">(</span>propKey<span class="token punctuation">)</span> <span class="token operator">||</span>
      <span class="token operator">!</span>lastProps<span class="token punctuation">.</span><span class="token function">hasOwnProperty</span><span class="token punctuation">(</span>propKey<span class="token punctuation">)</span> <span class="token operator">||</span>
      lastProps<span class="token punctuation">[</span>propKey<span class="token punctuation">]</span> <span class="token operator">==</span> <span class="token keyword">null</span>
    <span class="token punctuation">)</span> <span class="token punctuation">{</span>
      <span class="token keyword">continue</span><span class="token punctuation">;</span>
    <span class="token punctuation">}</span>
    <span class="token keyword">if</span> <span class="token punctuation">(</span>propKey <span class="token operator">===</span> <span class="token constant">STYLE</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
      <span class="token keyword">const</span> lastStyle <span class="token operator">=</span> lastProps<span class="token punctuation">[</span>propKey<span class="token punctuation">]</span><span class="token punctuation">;</span>
      <span class="token keyword">for</span> <span class="token punctuation">(</span>styleName <span class="token keyword">in</span> lastStyle<span class="token punctuation">)</span> <span class="token punctuation">{</span>
        <span class="token keyword">if</span> <span class="token punctuation">(</span>lastStyle<span class="token punctuation">.</span><span class="token function">hasOwnProperty</span><span class="token punctuation">(</span>styleName<span class="token punctuation">)</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
          <span class="token keyword">if</span> <span class="token punctuation">(</span><span class="token operator">!</span>styleUpdates<span class="token punctuation">)</span> <span class="token punctuation">{</span>
            styleUpdates <span class="token operator">=</span> <span class="token punctuation">{</span><span class="token punctuation">}</span><span class="token punctuation">;</span>
          <span class="token punctuation">}</span>
          styleUpdates<span class="token punctuation">[</span>styleName<span class="token punctuation">]</span> <span class="token operator">=</span> <span class="token string">&quot;&quot;</span><span class="token punctuation">;</span>
        <span class="token punctuation">}</span>
      <span class="token punctuation">}</span>
    <span class="token punctuation">}</span> <span class="token keyword">else</span> <span class="token punctuation">{</span>
      <span class="token punctuation">(</span>updatePayload <span class="token operator">=</span> updatePayload <span class="token operator">||</span> <span class="token punctuation">[</span><span class="token punctuation">]</span><span class="token punctuation">)</span><span class="token punctuation">.</span><span class="token function">push</span><span class="token punctuation">(</span>propKey<span class="token punctuation">,</span> <span class="token keyword">null</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
    <span class="token punctuation">}</span>
  <span class="token punctuation">}</span>
  <span class="token keyword">for</span> <span class="token punctuation">(</span>propKey <span class="token keyword">in</span> nextProps<span class="token punctuation">)</span> <span class="token punctuation">{</span>
    <span class="token keyword">const</span> nextProp <span class="token operator">=</span> nextProps<span class="token punctuation">[</span>propKey<span class="token punctuation">]</span><span class="token punctuation">;</span>
    <span class="token keyword">const</span> lastProp <span class="token operator">=</span> lastProps <span class="token operator">!=</span> <span class="token keyword">null</span> <span class="token operator">?</span> lastProps<span class="token punctuation">[</span>propKey<span class="token punctuation">]</span> <span class="token operator">:</span> <span class="token keyword">undefined</span><span class="token punctuation">;</span>
    <span class="token keyword">if</span> <span class="token punctuation">(</span>
      <span class="token operator">!</span>nextProps<span class="token punctuation">.</span><span class="token function">hasOwnProperty</span><span class="token punctuation">(</span>propKey<span class="token punctuation">)</span> <span class="token operator">||</span>
      nextProp <span class="token operator">===</span> lastProp <span class="token operator">||</span>
      <span class="token punctuation">(</span>nextProp <span class="token operator">==</span> <span class="token keyword">null</span> <span class="token operator">&amp;&amp;</span> lastProp <span class="token operator">==</span> <span class="token keyword">null</span><span class="token punctuation">)</span>
    <span class="token punctuation">)</span> <span class="token punctuation">{</span>
      <span class="token keyword">continue</span><span class="token punctuation">;</span>
    <span class="token punctuation">}</span>
    <span class="token keyword">if</span> <span class="token punctuation">(</span>propKey <span class="token operator">===</span> <span class="token constant">STYLE</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
      <span class="token keyword">if</span> <span class="token punctuation">(</span>lastProp<span class="token punctuation">)</span> <span class="token punctuation">{</span>
        <span class="token keyword">for</span> <span class="token punctuation">(</span>styleName <span class="token keyword">in</span> lastProp<span class="token punctuation">)</span> <span class="token punctuation">{</span>
          <span class="token keyword">if</span> <span class="token punctuation">(</span>
            lastProp<span class="token punctuation">.</span><span class="token function">hasOwnProperty</span><span class="token punctuation">(</span>styleName<span class="token punctuation">)</span> <span class="token operator">&amp;&amp;</span>
            <span class="token punctuation">(</span><span class="token operator">!</span>nextProp <span class="token operator">||</span> <span class="token operator">!</span>nextProp<span class="token punctuation">.</span><span class="token function">hasOwnProperty</span><span class="token punctuation">(</span>styleName<span class="token punctuation">)</span><span class="token punctuation">)</span>
          <span class="token punctuation">)</span> <span class="token punctuation">{</span>
            <span class="token keyword">if</span> <span class="token punctuation">(</span><span class="token operator">!</span>styleUpdates<span class="token punctuation">)</span> <span class="token punctuation">{</span>
              styleUpdates <span class="token operator">=</span> <span class="token punctuation">{</span><span class="token punctuation">}</span><span class="token punctuation">;</span>
            <span class="token punctuation">}</span>
            styleUpdates<span class="token punctuation">[</span>styleName<span class="token punctuation">]</span> <span class="token operator">=</span> <span class="token string">&quot;&quot;</span><span class="token punctuation">;</span>
          <span class="token punctuation">}</span>
        <span class="token punctuation">}</span>
        <span class="token keyword">for</span> <span class="token punctuation">(</span>styleName <span class="token keyword">in</span> nextProp<span class="token punctuation">)</span> <span class="token punctuation">{</span>
          <span class="token keyword">if</span> <span class="token punctuation">(</span>
            nextProp<span class="token punctuation">.</span><span class="token function">hasOwnProperty</span><span class="token punctuation">(</span>styleName<span class="token punctuation">)</span> <span class="token operator">&amp;&amp;</span>
            lastProp<span class="token punctuation">[</span>styleName<span class="token punctuation">]</span> <span class="token operator">!==</span> nextProp<span class="token punctuation">[</span>styleName<span class="token punctuation">]</span>
          <span class="token punctuation">)</span> <span class="token punctuation">{</span>
            <span class="token keyword">if</span> <span class="token punctuation">(</span><span class="token operator">!</span>styleUpdates<span class="token punctuation">)</span> <span class="token punctuation">{</span>
              styleUpdates <span class="token operator">=</span> <span class="token punctuation">{</span><span class="token punctuation">}</span><span class="token punctuation">;</span>
            <span class="token punctuation">}</span>
            styleUpdates<span class="token punctuation">[</span>styleName<span class="token punctuation">]</span> <span class="token operator">=</span> nextProp<span class="token punctuation">[</span>styleName<span class="token punctuation">]</span><span class="token punctuation">;</span>
          <span class="token punctuation">}</span>
        <span class="token punctuation">}</span>
      <span class="token punctuation">}</span> <span class="token keyword">else</span> <span class="token punctuation">{</span>
        <span class="token keyword">if</span> <span class="token punctuation">(</span><span class="token operator">!</span>styleUpdates<span class="token punctuation">)</span> <span class="token punctuation">{</span>
          <span class="token keyword">if</span> <span class="token punctuation">(</span><span class="token operator">!</span>updatePayload<span class="token punctuation">)</span> <span class="token punctuation">{</span>
            updatePayload <span class="token operator">=</span> <span class="token punctuation">[</span><span class="token punctuation">]</span><span class="token punctuation">;</span>
          <span class="token punctuation">}</span>
          updatePayload<span class="token punctuation">.</span><span class="token function">push</span><span class="token punctuation">(</span>propKey<span class="token punctuation">,</span> styleUpdates<span class="token punctuation">)</span><span class="token punctuation">;</span>
        <span class="token punctuation">}</span>
        styleUpdates <span class="token operator">=</span> nextProp<span class="token punctuation">;</span>
      <span class="token punctuation">}</span>
    <span class="token punctuation">}</span> <span class="token keyword">else</span> <span class="token keyword">if</span> <span class="token punctuation">(</span>propKey <span class="token operator">===</span> <span class="token constant">CHILDREN</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
      <span class="token keyword">if</span> <span class="token punctuation">(</span><span class="token keyword">typeof</span> nextProp <span class="token operator">===</span> <span class="token string">&quot;string&quot;</span> <span class="token operator">||</span> <span class="token keyword">typeof</span> nextProp <span class="token operator">===</span> <span class="token string">&quot;number&quot;</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
        <span class="token punctuation">(</span>updatePayload <span class="token operator">=</span> updatePayload <span class="token operator">||</span> <span class="token punctuation">[</span><span class="token punctuation">]</span><span class="token punctuation">)</span><span class="token punctuation">.</span><span class="token function">push</span><span class="token punctuation">(</span>propKey<span class="token punctuation">,</span> <span class="token string">&quot;&quot;</span> <span class="token operator">+</span> nextProp<span class="token punctuation">)</span><span class="token punctuation">;</span>
      <span class="token punctuation">}</span>
    <span class="token punctuation">}</span> <span class="token keyword">else</span> <span class="token punctuation">{</span>
      <span class="token punctuation">(</span>updatePayload <span class="token operator">=</span> updatePayload <span class="token operator">||</span> <span class="token punctuation">[</span><span class="token punctuation">]</span><span class="token punctuation">)</span><span class="token punctuation">.</span><span class="token function">push</span><span class="token punctuation">(</span>propKey<span class="token punctuation">,</span> nextProp<span class="token punctuation">)</span><span class="token punctuation">;</span>
    <span class="token punctuation">}</span>
  <span class="token punctuation">}</span>
  <span class="token keyword">if</span> <span class="token punctuation">(</span>styleUpdates<span class="token punctuation">)</span> <span class="token punctuation">{</span>
    <span class="token punctuation">(</span>updatePayload <span class="token operator">=</span> updatePayload <span class="token operator">||</span> <span class="token punctuation">[</span><span class="token punctuation">]</span><span class="token punctuation">)</span><span class="token punctuation">.</span><span class="token function">push</span><span class="token punctuation">(</span><span class="token constant">STYLE</span><span class="token punctuation">,</span> styleUpdates<span class="token punctuation">)</span><span class="token punctuation">;</span>
  <span class="token punctuation">}</span>
  <span class="token keyword">return</span> updatePayload<span class="token punctuation">;</span>
<span class="token punctuation">}</span>

<span class="token keyword">export</span> <span class="token keyword">function</span> <span class="token function">updateProperties</span><span class="token punctuation">(</span><span class="token parameter">domElement<span class="token punctuation">,</span> updatePayload</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
  <span class="token function">updateDOMProperties</span><span class="token punctuation">(</span>domElement<span class="token punctuation">,</span> updatePayload<span class="token punctuation">)</span><span class="token punctuation">;</span>
<span class="token punctuation">}</span>

<span class="token keyword">function</span> <span class="token function">updateDOMProperties</span><span class="token punctuation">(</span><span class="token parameter">domElement<span class="token punctuation">,</span> updatePayload</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
  console<span class="token punctuation">.</span><span class="token function">log</span><span class="token punctuation">(</span>updatePayload<span class="token punctuation">)</span><span class="token punctuation">;</span>
  <span class="token keyword">for</span> <span class="token punctuation">(</span><span class="token keyword">let</span> i <span class="token operator">=</span> <span class="token number">0</span><span class="token punctuation">;</span> i <span class="token operator">&lt;</span> updatePayload<span class="token punctuation">.</span>length<span class="token punctuation">;</span> i <span class="token operator">+=</span> <span class="token number">2</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
    <span class="token keyword">const</span> propKey <span class="token operator">=</span> updatePayload<span class="token punctuation">[</span>i<span class="token punctuation">]</span><span class="token punctuation">;</span>
    <span class="token keyword">const</span> propValue <span class="token operator">=</span> updatePayload<span class="token punctuation">[</span>i <span class="token operator">+</span> <span class="token number">1</span><span class="token punctuation">]</span><span class="token punctuation">;</span>
    <span class="token keyword">if</span> <span class="token punctuation">(</span>propKey <span class="token operator">===</span> <span class="token constant">STYLE</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
      <span class="token function">setValueForStyles</span><span class="token punctuation">(</span>domElement<span class="token punctuation">,</span> propValue<span class="token punctuation">)</span><span class="token punctuation">;</span>
    <span class="token punctuation">}</span> <span class="token keyword">else</span> <span class="token keyword">if</span> <span class="token punctuation">(</span>propKey <span class="token operator">===</span> <span class="token constant">CHILDREN</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
      <span class="token function">setTextContent</span><span class="token punctuation">(</span>domElement<span class="token punctuation">,</span> propValue<span class="token punctuation">)</span><span class="token punctuation">;</span>
    <span class="token punctuation">}</span> <span class="token keyword">else</span> <span class="token punctuation">{</span>
      <span class="token function">setValueForProperty</span><span class="token punctuation">(</span>domElement<span class="token punctuation">,</span> propKey<span class="token punctuation">,</span> propValue<span class="token punctuation">)</span><span class="token punctuation">;</span>
    <span class="token punctuation">}</span>
  <span class="token punctuation">}</span>
<span class="token punctuation">}</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="main-jsx-更新" tabindex="-1"><a class="header-anchor" href="#main-jsx-更新" aria-hidden="true">#</a> main.jsx 更新</h3><div class="language-jsx line-numbers-mode" data-ext="jsx"><pre class="language-jsx"><code><span class="token keyword">import</span> <span class="token operator">*</span> <span class="token keyword">as</span> React <span class="token keyword">from</span> <span class="token string">&quot;react/index&quot;</span><span class="token punctuation">;</span>
<span class="token keyword">import</span> <span class="token punctuation">{</span> createRoot <span class="token punctuation">}</span> <span class="token keyword">from</span> <span class="token string">&quot;react-dom/client&quot;</span><span class="token punctuation">;</span>

<span class="token keyword">const</span> <span class="token function-variable function">reducer</span> <span class="token operator">=</span> <span class="token punctuation">(</span><span class="token parameter">state<span class="token punctuation">,</span> action</span><span class="token punctuation">)</span> <span class="token operator">=&gt;</span> <span class="token punctuation">{</span>
  <span class="token keyword">if</span> <span class="token punctuation">(</span>action<span class="token punctuation">.</span>type <span class="token operator">===</span> <span class="token string">&quot;add&quot;</span><span class="token punctuation">)</span> <span class="token keyword">return</span> state <span class="token operator">+</span> action<span class="token punctuation">.</span>payload<span class="token punctuation">;</span>
  <span class="token keyword">return</span> state<span class="token punctuation">;</span>
<span class="token punctuation">}</span><span class="token punctuation">;</span>

<span class="token keyword">function</span> <span class="token function">FunctionComponent</span><span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
  <span class="token keyword">const</span> <span class="token punctuation">[</span>number<span class="token punctuation">,</span> setNumber<span class="token punctuation">]</span> <span class="token operator">=</span> React<span class="token punctuation">.</span><span class="token function">useReducer</span><span class="token punctuation">(</span>reducer<span class="token punctuation">,</span> <span class="token number">0</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
  <span class="token keyword">let</span> attrs <span class="token operator">=</span> <span class="token punctuation">{</span> <span class="token literal-property property">id</span><span class="token operator">:</span> <span class="token string">&quot;btn1&quot;</span> <span class="token punctuation">}</span><span class="token punctuation">;</span>
  <span class="token keyword">if</span> <span class="token punctuation">(</span>number <span class="token operator">===</span> <span class="token number">6</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
    <span class="token keyword">delete</span> attrs<span class="token punctuation">.</span>id<span class="token punctuation">;</span>
    attrs<span class="token punctuation">.</span>style <span class="token operator">=</span> <span class="token punctuation">{</span> <span class="token literal-property property">color</span><span class="token operator">:</span> <span class="token string">&quot;red&quot;</span> <span class="token punctuation">}</span><span class="token punctuation">;</span>
  <span class="token punctuation">}</span>
  <span class="token keyword">return</span> <span class="token punctuation">(</span>
    <span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span>button</span> <span class="token spread"><span class="token punctuation">{</span><span class="token operator">...</span>attrs<span class="token punctuation">}</span></span> <span class="token attr-name">onClick</span><span class="token script language-javascript"><span class="token script-punctuation punctuation">=</span><span class="token punctuation">{</span><span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token operator">=&gt;</span> <span class="token function">setNumber</span><span class="token punctuation">(</span><span class="token punctuation">{</span> <span class="token literal-property property">type</span><span class="token operator">:</span> <span class="token string">&quot;add&quot;</span><span class="token punctuation">,</span> <span class="token literal-property property">payload</span><span class="token operator">:</span> <span class="token number">3</span> <span class="token punctuation">}</span><span class="token punctuation">)</span><span class="token punctuation">}</span></span><span class="token punctuation">&gt;</span></span><span class="token plain-text">
      </span><span class="token punctuation">{</span>number<span class="token punctuation">}</span><span class="token plain-text">
    </span><span class="token tag"><span class="token tag"><span class="token punctuation">&lt;/</span>button</span><span class="token punctuation">&gt;</span></span>
  <span class="token punctuation">)</span><span class="token punctuation">;</span>
<span class="token punctuation">}</span>

<span class="token keyword">const</span> element <span class="token operator">=</span> <span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span><span class="token class-name">FunctionComponent</span></span> <span class="token punctuation">/&gt;</span></span><span class="token punctuation">;</span>
<span class="token keyword">const</span> root <span class="token operator">=</span> <span class="token function">createRoot</span><span class="token punctuation">(</span>document<span class="token punctuation">.</span><span class="token function">getElementById</span><span class="token punctuation">(</span><span class="token string">&quot;root&quot;</span><span class="token punctuation">)</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
<span class="token comment">// 把element虚拟DOM挂载到容器中</span>
root<span class="token punctuation">.</span><span class="token function">render</span><span class="token punctuation">(</span>element<span class="token punctuation">)</span><span class="token punctuation">;</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="commitreducer-小结" tabindex="-1"><a class="header-anchor" href="#commitreducer-小结" aria-hidden="true">#</a> commitReducer 小结</h3><p>commit 提交更新阶段相对简单一点，在 commitMutationEffectsOnFiber 这个提交副作用函数中，还是针对原生标签组件 HostComponent：</p><ol><li>如果更新副作用存在 Update 更新标识并且 updateQueue 不为 null，执行 commitUpdate 更新</li><li>commitUpdate 中调用两个方法：DOM 属性更新 updateProperties 和 Fiber 属性更新 updateFiberProps。updateFiberProps 主要是将属性挂载到原生 DOM 节点上，不再赘述</li><li>updateProperties 的主要作用就是循环 updateQueue 中的元素，两两一对进行确认，对原生的 DOM 节点，执行诸如 style、class、id、内部文本等内容更新</li></ol><p>commitReducer 点击 button 两次后的控制台输出结果：</p><p><img src="https://misaka10032.oss-cn-chengdu.aliyuncs.com/React/commitReducerResult.jpg" alt="commitReducerResult" loading="lazy"></p><p>手写源码仓库：</p>`,83),r={href:"https://github.com/mi-saka10032/mini-react/tree/master/packages/reducer",target:"_blank",rel:"noopener noreferrer"};function k(d,v){const s=i("ExternalLinkIcon");return t(),p("div",null,[u,n("p",null,[n("a",r,[e("https://github.com/mi-saka10032/mini-react/tree/master/packages/reducer"),o(s)])])])}const y=a(l,[["render",k],["__file","4-hooksReducer.html.vue"]]);export{y as default};
