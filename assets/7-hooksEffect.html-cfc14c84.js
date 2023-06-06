import{_ as a,C as t,Y as p,Z as e,$ as n,a0 as o,a2 as c,a1 as i}from"./framework-bb209140.js";const l={},u=i(`<h2 id="副作用的意义" tabindex="-1"><a class="header-anchor" href="#副作用的意义" aria-hidden="true">#</a> 副作用的意义</h2><figure><img src="https://misaka10032.oss-cn-chengdu.aliyuncs.com/React/effectHook.jpg" alt="effectHook" tabindex="0" loading="lazy"><figcaption>effectHook</figcaption></figure><p>在函数组件主体内（这里指在 React 渲染阶段）改变 DOM、添加订阅、设置定时器、记录日志以及执行其他包含副作用的操作都是不被允许的，因为这可能会产生莫名其妙的 bug 并破坏 UI 的一致性</p><p>使用 useEffect 完成副作用操作。赋值给 useEffect 的函数会在组件渲染到屏幕之后执行。你可以把 effect 看作从 React 的纯函数式世界通往命令式世界的逃生通道</p><p>useEffect 就是一个 Effect Hook，给函数组件增加了操作副作用的能力。它跟 class 组件中的 componentDidMount、componentDidUpdate 和 componentWillUnmount 具有相同的用途，只不过被合并成了一个 API</p><p>该 Hook 接收一个包含命令式、且可能有副作用代码的函数</p><p>注意：</p><ol><li>要避免在 useEffect 的副作用函数中操作 useEffect 绑定的依赖项，这会引起堆栈溢出异常</li><li>effectHook 提供了两种 hook，分为 useEffect 和 useLayoutEffect</li><li>useEffect 在浏览器渲染变更完成后非阻塞执行</li><li>useLayoutEffect 在浏览器渲染变更时阻塞执行</li></ol><h2 id="useeffect" tabindex="-1"><a class="header-anchor" href="#useeffect" aria-hidden="true">#</a> useEffect</h2><figure><img src="https://misaka10032.oss-cn-chengdu.aliyuncs.com/React/flushPassiveEffects.jpg" alt="useEffect流程图" tabindex="0" loading="lazy"><figcaption>useEffect流程图</figcaption></figure><p>useEffect 和其他 hook 函数一样，beginWork 时为 Fiber 挂载 effectHook，二次触发时更新 effectHook，需要注意的是 effect 的 hook 链表和 state、reducer 不是同一个 hook 链表，为的是区分数据流和副作用流</p><h3 id="src-main-jsx" tabindex="-1"><a class="header-anchor" href="#src-main-jsx" aria-hidden="true">#</a> src\\main.jsx</h3><p>src\\main.jsx</p><div class="language-jsx line-numbers-mode" data-ext="jsx"><pre class="language-jsx"><code><span class="token keyword">import</span> <span class="token operator">*</span> <span class="token keyword">as</span> React <span class="token keyword">from</span> <span class="token string">&quot;react/index&quot;</span><span class="token punctuation">;</span>
<span class="token keyword">import</span> <span class="token punctuation">{</span> createRoot <span class="token punctuation">}</span> <span class="token keyword">from</span> <span class="token string">&quot;react-dom/client&quot;</span><span class="token punctuation">;</span>

<span class="token keyword">function</span> <span class="token function">FunctionComponent</span><span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
  console<span class="token punctuation">.</span><span class="token function">log</span><span class="token punctuation">(</span><span class="token string">&quot;FunctionComponent&quot;</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
  <span class="token keyword">const</span> <span class="token punctuation">[</span>number<span class="token punctuation">,</span> setNumber<span class="token punctuation">]</span> <span class="token operator">=</span> React<span class="token punctuation">.</span><span class="token function">useState</span><span class="token punctuation">(</span><span class="token number">1</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
  React<span class="token punctuation">.</span><span class="token function">useEffect</span><span class="token punctuation">(</span><span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token operator">=&gt;</span> <span class="token punctuation">{</span>
    console<span class="token punctuation">.</span><span class="token function">log</span><span class="token punctuation">(</span><span class="token string">&quot;useEffect1&quot;</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
    <span class="token keyword">return</span> <span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token operator">=&gt;</span> <span class="token punctuation">{</span>
      console<span class="token punctuation">.</span><span class="token function">log</span><span class="token punctuation">(</span><span class="token string">&quot;destroy useEffect1&quot;</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
    <span class="token punctuation">}</span><span class="token punctuation">;</span>
  <span class="token punctuation">}</span><span class="token punctuation">,</span> <span class="token punctuation">[</span><span class="token punctuation">]</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
  React<span class="token punctuation">.</span><span class="token function">useEffect</span><span class="token punctuation">(</span><span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token operator">=&gt;</span> <span class="token punctuation">{</span>
    console<span class="token punctuation">.</span><span class="token function">log</span><span class="token punctuation">(</span><span class="token string">&quot;useEffect2&quot;</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
    <span class="token keyword">return</span> <span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token operator">=&gt;</span> <span class="token punctuation">{</span>
      console<span class="token punctuation">.</span><span class="token function">log</span><span class="token punctuation">(</span><span class="token string">&quot;destroy useEffect2&quot;</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
    <span class="token punctuation">}</span><span class="token punctuation">;</span>
  <span class="token punctuation">}</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
  React<span class="token punctuation">.</span><span class="token function">useEffect</span><span class="token punctuation">(</span><span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token operator">=&gt;</span> <span class="token punctuation">{</span>
    console<span class="token punctuation">.</span><span class="token function">log</span><span class="token punctuation">(</span><span class="token string">&quot;useEffect3&quot;</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
    <span class="token keyword">return</span> <span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token operator">=&gt;</span> <span class="token punctuation">{</span>
      console<span class="token punctuation">.</span><span class="token function">log</span><span class="token punctuation">(</span><span class="token string">&quot;destroy useEffect3&quot;</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
    <span class="token punctuation">}</span><span class="token punctuation">;</span>
  <span class="token punctuation">}</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
  <span class="token keyword">return</span> <span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span>div</span> <span class="token attr-name">onClick</span><span class="token script language-javascript"><span class="token script-punctuation punctuation">=</span><span class="token punctuation">{</span><span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token operator">=&gt;</span> <span class="token function">setNumber</span><span class="token punctuation">(</span>number <span class="token operator">+</span> <span class="token number">1</span><span class="token punctuation">)</span><span class="token punctuation">}</span></span><span class="token punctuation">&gt;</span></span><span class="token punctuation">{</span>number<span class="token punctuation">}</span><span class="token tag"><span class="token tag"><span class="token punctuation">&lt;/</span>div</span><span class="token punctuation">&gt;</span></span><span class="token punctuation">;</span>
<span class="token punctuation">}</span>

<span class="token keyword">const</span> element <span class="token operator">=</span> <span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span><span class="token class-name">FunctionComponent</span></span> <span class="token punctuation">/&gt;</span></span><span class="token punctuation">;</span>
<span class="token keyword">const</span> root <span class="token operator">=</span> <span class="token function">createRoot</span><span class="token punctuation">(</span>document<span class="token punctuation">.</span><span class="token function">getElementById</span><span class="token punctuation">(</span><span class="token string">&quot;root&quot;</span><span class="token punctuation">)</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
<span class="token comment">// 把element虚拟DOM挂载到容器中</span>
root<span class="token punctuation">.</span><span class="token function">render</span><span class="token punctuation">(</span>element<span class="token punctuation">)</span><span class="token punctuation">;</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="react-index-js" tabindex="-1"><a class="header-anchor" href="#react-index-js" aria-hidden="true">#</a> react\\index.js</h3><p>src\\react\\index.js</p><div class="language-javascript line-numbers-mode" data-ext="js"><pre class="language-javascript"><code><span class="token keyword">export</span> <span class="token punctuation">{</span>
  __SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED<span class="token punctuation">,</span>
  useReducer<span class="token punctuation">,</span>
  useState<span class="token punctuation">,</span>
  useEffect<span class="token punctuation">,</span>
<span class="token punctuation">}</span> <span class="token keyword">from</span> <span class="token string">&quot;./src/React&quot;</span><span class="token punctuation">;</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="react-js" tabindex="-1"><a class="header-anchor" href="#react-js" aria-hidden="true">#</a> React.js</h3><p>src\\react\\src\\React.js</p><div class="language-javascript line-numbers-mode" data-ext="js"><pre class="language-javascript"><code><span class="token keyword">import</span> <span class="token punctuation">{</span> useReducer<span class="token punctuation">,</span> useState<span class="token punctuation">,</span> useEffect <span class="token punctuation">}</span> <span class="token keyword">from</span> <span class="token string">&quot;./ReactHooks&quot;</span><span class="token punctuation">;</span>
<span class="token keyword">import</span> ReactSharedInternals <span class="token keyword">from</span> <span class="token string">&quot;./ReactSharedInternals&quot;</span><span class="token punctuation">;</span>

<span class="token keyword">export</span> <span class="token punctuation">{</span>
  useReducer<span class="token punctuation">,</span>
  useState<span class="token punctuation">,</span>
  useEffect<span class="token punctuation">,</span>
  ReactSharedInternals <span class="token keyword">as</span> __SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED<span class="token punctuation">,</span>
<span class="token punctuation">}</span><span class="token punctuation">;</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="reacthooks-js" tabindex="-1"><a class="header-anchor" href="#reacthooks-js" aria-hidden="true">#</a> ReactHooks.js</h3><p>src\\react\\src\\ReactHooks.js</p><div class="language-javascript line-numbers-mode" data-ext="js"><pre class="language-javascript"><code><span class="token keyword">import</span> ReactCurrentDispatcher <span class="token keyword">from</span> <span class="token string">&quot;./ReactCurrentDispatcher&quot;</span><span class="token punctuation">;</span>

<span class="token keyword">function</span> <span class="token function">resolveDispatcher</span><span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
  <span class="token keyword">const</span> dispatcher <span class="token operator">=</span> ReactCurrentDispatcher<span class="token punctuation">.</span>current<span class="token punctuation">;</span>
  <span class="token keyword">return</span> dispatcher<span class="token punctuation">;</span>
<span class="token punctuation">}</span>

<span class="token keyword">export</span> <span class="token keyword">function</span> <span class="token function">useReducer</span><span class="token punctuation">(</span><span class="token parameter">reducer<span class="token punctuation">,</span> initialArg<span class="token punctuation">,</span> init</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
  <span class="token keyword">const</span> dispatcher <span class="token operator">=</span> <span class="token function">resolveDispatcher</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
  <span class="token keyword">return</span> dispatcher<span class="token punctuation">.</span><span class="token function">useReducer</span><span class="token punctuation">(</span>reducer<span class="token punctuation">,</span> initialArg<span class="token punctuation">,</span> init<span class="token punctuation">)</span><span class="token punctuation">;</span>
<span class="token punctuation">}</span>

<span class="token keyword">export</span> <span class="token keyword">function</span> <span class="token function">useState</span><span class="token punctuation">(</span><span class="token parameter">reducer<span class="token punctuation">,</span> initialArg<span class="token punctuation">,</span> init</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
  <span class="token keyword">const</span> dispatcher <span class="token operator">=</span> <span class="token function">resolveDispatcher</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
  <span class="token keyword">return</span> dispatcher<span class="token punctuation">.</span><span class="token function">useState</span><span class="token punctuation">(</span>reducer<span class="token punctuation">,</span> initialArg<span class="token punctuation">,</span> init<span class="token punctuation">)</span><span class="token punctuation">;</span>
<span class="token punctuation">}</span>

<span class="token keyword">export</span> <span class="token keyword">function</span> <span class="token function">useEffect</span><span class="token punctuation">(</span><span class="token parameter">create<span class="token punctuation">,</span> deps</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
  <span class="token keyword">const</span> dispatcher <span class="token operator">=</span> <span class="token function">resolveDispatcher</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
  <span class="token keyword">return</span> dispatcher<span class="token punctuation">.</span><span class="token function">useEffect</span><span class="token punctuation">(</span>create<span class="token punctuation">,</span> deps<span class="token punctuation">)</span><span class="token punctuation">;</span>
<span class="token punctuation">}</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="reacthookeffecttags-js" tabindex="-1"><a class="header-anchor" href="#reacthookeffecttags-js" aria-hidden="true">#</a> ReactHookEffectTags.js</h3><p>src\\react-reconciler\\src\\ReactHookEffectTags.js</p><div class="language-javascript line-numbers-mode" data-ext="js"><pre class="language-javascript"><code><span class="token keyword">export</span> <span class="token keyword">const</span> HasEffect <span class="token operator">=</span> <span class="token number">0b0001</span><span class="token punctuation">;</span> <span class="token comment">// 1</span>
<span class="token comment">// 浏览器绘制之前执行的effect，UI绘制之前，类似微任务</span>
<span class="token keyword">export</span> <span class="token keyword">const</span> Layout <span class="token operator">=</span> <span class="token number">0b0100</span><span class="token punctuation">;</span> <span class="token comment">// 4</span>
<span class="token comment">// 浏览器绘制之后执行的effect，UI绘制之后，类似于宏任务</span>
<span class="token keyword">export</span> <span class="token keyword">const</span> Passive <span class="token operator">=</span> <span class="token number">0b1000</span><span class="token punctuation">;</span> <span class="token comment">// 8</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="reactfiberflags-js" tabindex="-1"><a class="header-anchor" href="#reactfiberflags-js" aria-hidden="true">#</a> ReactFiberFlags.js</h3><p>src\\react-reconciler\\src\\ReactFiberFlags.js</p><div class="language-javascript line-numbers-mode" data-ext="js"><pre class="language-javascript"><code><span class="token comment">// 如果函数组件里使用了useEffect，那么此函数组件对应的fiber上会有一个flags，为Passive</span>
<span class="token keyword">export</span> <span class="token keyword">const</span> Passive <span class="token operator">=</span> <span class="token comment">/*                      */</span> <span class="token number">0b00000000000000010000000000</span><span class="token punctuation">;</span> <span class="token comment">// 1024</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="reactfiberhooks-js" tabindex="-1"><a class="header-anchor" href="#reactfiberhooks-js" aria-hidden="true">#</a> ReactFiberHooks.js</h3><p>src\\react-reconciler\\src\\ReactFiberHooks.js</p><div class="language-javascript line-numbers-mode" data-ext="js"><pre class="language-javascript"><code><span class="token keyword">import</span> ReactSharedInternals <span class="token keyword">from</span> <span class="token string">&quot;shared/ReactSharedInternals&quot;</span><span class="token punctuation">;</span>
<span class="token keyword">import</span> <span class="token punctuation">{</span> enqueueConcurrentHookUpdate <span class="token punctuation">}</span> <span class="token keyword">from</span> <span class="token string">&quot;./ReactFiberConcurrentUpdates&quot;</span><span class="token punctuation">;</span>
<span class="token keyword">import</span> <span class="token punctuation">{</span> scheduleUpdateOnFiber <span class="token punctuation">}</span> <span class="token keyword">from</span> <span class="token string">&quot;./ReactFiberWorkLoop&quot;</span><span class="token punctuation">;</span>
<span class="token keyword">import</span> is <span class="token keyword">from</span> <span class="token string">&quot;shared/objectIs&quot;</span><span class="token punctuation">;</span>
<span class="token keyword">import</span> <span class="token punctuation">{</span> Passive <span class="token keyword">as</span> PassiveEffect <span class="token punctuation">}</span> <span class="token keyword">from</span> <span class="token string">&quot;./ReactFiberFlags&quot;</span><span class="token punctuation">;</span>
<span class="token keyword">import</span> <span class="token punctuation">{</span>
  HasEffect <span class="token keyword">as</span> HookHasEffect<span class="token punctuation">,</span>
  Passive <span class="token keyword">as</span> HookPassive<span class="token punctuation">,</span>
<span class="token punctuation">}</span> <span class="token keyword">from</span> <span class="token string">&quot;./ReactHookEffectTags&quot;</span><span class="token punctuation">;</span>

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

<span class="token keyword">function</span> <span class="token function">dispatchSetState</span><span class="token punctuation">(</span><span class="token parameter">fiber<span class="token punctuation">,</span> queue<span class="token punctuation">,</span> action</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
  <span class="token keyword">const</span> update <span class="token operator">=</span> <span class="token punctuation">{</span>
    action<span class="token punctuation">,</span>
    <span class="token literal-property property">hasEagerState</span><span class="token operator">:</span> <span class="token boolean">false</span><span class="token punctuation">,</span> <span class="token comment">// 是否有急切的更新</span>
    <span class="token literal-property property">eagerState</span><span class="token operator">:</span> <span class="token keyword">null</span><span class="token punctuation">,</span> <span class="token comment">// 急切的更新状态</span>
    <span class="token literal-property property">next</span><span class="token operator">:</span> <span class="token keyword">null</span><span class="token punctuation">,</span>
  <span class="token punctuation">}</span><span class="token punctuation">;</span>
  <span class="token comment">// 派发动作后，立刻用上一次的状态和上一次的reducer计算新状态</span>
  <span class="token keyword">const</span> <span class="token punctuation">{</span> lastRenderedReducer<span class="token punctuation">,</span> lastRenderedState <span class="token punctuation">}</span> <span class="token operator">=</span> queue<span class="token punctuation">;</span>
  <span class="token keyword">const</span> eagerState <span class="token operator">=</span> <span class="token function">lastRenderedReducer</span><span class="token punctuation">(</span>lastRenderedState<span class="token punctuation">,</span> action<span class="token punctuation">)</span><span class="token punctuation">;</span>
  update<span class="token punctuation">.</span>hasEagerState <span class="token operator">=</span> <span class="token boolean">true</span><span class="token punctuation">;</span>
  update<span class="token punctuation">.</span>eagerState <span class="token operator">=</span> eagerState<span class="token punctuation">;</span>
  <span class="token keyword">if</span> <span class="token punctuation">(</span><span class="token function">is</span><span class="token punctuation">(</span>eagerState<span class="token punctuation">,</span> lastRenderedState<span class="token punctuation">)</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
    <span class="token keyword">return</span><span class="token punctuation">;</span>
  <span class="token punctuation">}</span>
  <span class="token comment">// 入队更新，调度更新逻辑</span>
  <span class="token keyword">const</span> root <span class="token operator">=</span> <span class="token function">enqueueConcurrentHookUpdate</span><span class="token punctuation">(</span>fiber<span class="token punctuation">,</span> queue<span class="token punctuation">,</span> update<span class="token punctuation">)</span><span class="token punctuation">;</span>
  <span class="token function">scheduleUpdateOnFiber</span><span class="token punctuation">(</span>root<span class="token punctuation">)</span><span class="token punctuation">;</span>
<span class="token punctuation">}</span>

<span class="token keyword">const</span> HooksDispatcherOnMountInDEV <span class="token operator">=</span> <span class="token punctuation">{</span>
  <span class="token literal-property property">useReducer</span><span class="token operator">:</span> mountReducer<span class="token punctuation">,</span>
  <span class="token literal-property property">useState</span><span class="token operator">:</span> mountState<span class="token punctuation">,</span>
  <span class="token literal-property property">useEffect</span><span class="token operator">:</span> mountEffect<span class="token punctuation">,</span>
<span class="token punctuation">}</span><span class="token punctuation">;</span>

<span class="token keyword">function</span> <span class="token function">updateEffect</span><span class="token punctuation">(</span><span class="token parameter">create<span class="token punctuation">,</span> deps</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
  <span class="token keyword">return</span> <span class="token function">updateEffectImpl</span><span class="token punctuation">(</span>PassiveEffect<span class="token punctuation">,</span> HookPassive<span class="token punctuation">,</span> create<span class="token punctuation">,</span> deps<span class="token punctuation">)</span><span class="token punctuation">;</span>
<span class="token punctuation">}</span>

<span class="token keyword">function</span> <span class="token function">updateEffectImpl</span><span class="token punctuation">(</span><span class="token parameter">fiberFlags<span class="token punctuation">,</span> hookFlags<span class="token punctuation">,</span> create<span class="token punctuation">,</span> deps</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
  <span class="token keyword">const</span> hook <span class="token operator">=</span> <span class="token function">updateWorkInProgressHook</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
  <span class="token keyword">const</span> nextDeps <span class="token operator">=</span> deps <span class="token operator">===</span> <span class="token keyword">undefined</span> <span class="token operator">?</span> <span class="token keyword">null</span> <span class="token operator">:</span> deps<span class="token punctuation">;</span>
  <span class="token keyword">let</span> destroy<span class="token punctuation">;</span>
  <span class="token comment">// 上一个老hook</span>
  <span class="token keyword">if</span> <span class="token punctuation">(</span>currentHook <span class="token operator">!==</span> <span class="token keyword">null</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
    <span class="token comment">// 获取此useEffect这个Hook上老的effect对象</span>
    <span class="token keyword">const</span> prevEffect <span class="token operator">=</span> currentHook<span class="token punctuation">.</span>memoizedState<span class="token punctuation">;</span>
    destroy <span class="token operator">=</span> prevEffect<span class="token punctuation">.</span>destroy<span class="token punctuation">;</span>
    <span class="token keyword">if</span> <span class="token punctuation">(</span>nextDeps <span class="token operator">!==</span> <span class="token keyword">null</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
      <span class="token keyword">const</span> prevDeps <span class="token operator">=</span> prevEffect<span class="token punctuation">.</span>deps<span class="token punctuation">;</span>
      <span class="token comment">// 用新数组和老数组进行对比，如果一样说明依赖项相同不需要执行</span>
      <span class="token keyword">if</span> <span class="token punctuation">(</span><span class="token function">areHookInputsEqual</span><span class="token punctuation">(</span>nextDeps<span class="token punctuation">,</span> prevDeps<span class="token punctuation">)</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
        <span class="token comment">// 不管要不要重新执行，都需要把新的effect组成完整的单循环链表放到fiber.updateQueue中</span>
        hook<span class="token punctuation">.</span>memoizedState <span class="token operator">=</span> <span class="token function">pushEffect</span><span class="token punctuation">(</span>hookFlags<span class="token punctuation">,</span> create<span class="token punctuation">,</span> destroy<span class="token punctuation">,</span> nextDeps<span class="token punctuation">)</span><span class="token punctuation">;</span>
        <span class="token keyword">return</span><span class="token punctuation">;</span>
      <span class="token punctuation">}</span>
    <span class="token punctuation">}</span>
  <span class="token punctuation">}</span>
  <span class="token comment">// 如果要执行的话，需要修改fiber的flags</span>
  currentlyRenderingFiber<span class="token punctuation">.</span>flags <span class="token operator">|=</span> fiberFlags<span class="token punctuation">;</span>
  <span class="token comment">// 如果要执行的话，添加HookHasEffect flag。不是每个Passive都会执行，只有含有HookHasEffect的Passive才执行</span>
  hook<span class="token punctuation">.</span>memoizedState <span class="token operator">=</span> <span class="token function">pushEffect</span><span class="token punctuation">(</span>
    HookHasEffect <span class="token operator">|</span> hookFlags<span class="token punctuation">,</span>
    create<span class="token punctuation">,</span>
    destroy<span class="token punctuation">,</span>
    nextDeps
  <span class="token punctuation">)</span><span class="token punctuation">;</span>
<span class="token punctuation">}</span>

<span class="token keyword">function</span> <span class="token function">areHookInputsEqual</span><span class="token punctuation">(</span><span class="token parameter">nextDeps<span class="token punctuation">,</span> prevDeps</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
  <span class="token keyword">if</span> <span class="token punctuation">(</span>prevDeps <span class="token operator">===</span> <span class="token keyword">null</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
    <span class="token keyword">return</span> <span class="token keyword">null</span><span class="token punctuation">;</span>
  <span class="token punctuation">}</span>
  <span class="token keyword">for</span> <span class="token punctuation">(</span><span class="token keyword">let</span> i <span class="token operator">=</span> <span class="token number">0</span><span class="token punctuation">;</span> i <span class="token operator">&lt;</span> prevDeps<span class="token punctuation">.</span>length <span class="token operator">&amp;&amp;</span> i <span class="token operator">&lt;</span> nextDeps<span class="token punctuation">.</span>length<span class="token punctuation">;</span> i<span class="token operator">++</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
    <span class="token keyword">if</span> <span class="token punctuation">(</span><span class="token function">is</span><span class="token punctuation">(</span>nextDeps<span class="token punctuation">[</span>i<span class="token punctuation">]</span><span class="token punctuation">,</span> prevDeps<span class="token punctuation">[</span>i<span class="token punctuation">]</span><span class="token punctuation">)</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
      <span class="token keyword">continue</span><span class="token punctuation">;</span>
    <span class="token punctuation">}</span>
    <span class="token keyword">return</span> <span class="token boolean">false</span><span class="token punctuation">;</span>
  <span class="token punctuation">}</span>
  <span class="token keyword">return</span> <span class="token boolean">true</span><span class="token punctuation">;</span>
<span class="token punctuation">}</span>

<span class="token keyword">function</span> <span class="token function">mountEffect</span><span class="token punctuation">(</span><span class="token parameter">create<span class="token punctuation">,</span> deps</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
  <span class="token keyword">return</span> <span class="token function">mountEffectImpl</span><span class="token punctuation">(</span>PassiveEffect<span class="token punctuation">,</span> HookPassive<span class="token punctuation">,</span> create<span class="token punctuation">,</span> deps<span class="token punctuation">)</span><span class="token punctuation">;</span>
<span class="token punctuation">}</span>

<span class="token keyword">function</span> <span class="token function">mountEffectImpl</span><span class="token punctuation">(</span><span class="token parameter">fiberFlags<span class="token punctuation">,</span> hookFlags<span class="token punctuation">,</span> create<span class="token punctuation">,</span> deps</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
  <span class="token keyword">const</span> hook <span class="token operator">=</span> <span class="token function">mountWorkInProgressHook</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
  <span class="token keyword">const</span> nextDeps <span class="token operator">=</span> deps <span class="token operator">===</span> <span class="token keyword">undefined</span> <span class="token operator">?</span> <span class="token keyword">null</span> <span class="token operator">:</span> deps<span class="token punctuation">;</span>
  <span class="token comment">// 给当前的函数组件fiber添加 effectFlags</span>
  currentlyRenderingFiber<span class="token punctuation">.</span>flags <span class="token operator">|=</span> fiberFlags<span class="token punctuation">;</span>
  hook<span class="token punctuation">.</span>memoizedState <span class="token operator">=</span> <span class="token function">pushEffect</span><span class="token punctuation">(</span>
    HookHasEffect <span class="token operator">|</span> hookFlags<span class="token punctuation">,</span>
    create<span class="token punctuation">,</span>
    <span class="token keyword">undefined</span><span class="token punctuation">,</span>
    nextDeps
  <span class="token punctuation">)</span><span class="token punctuation">;</span>
<span class="token punctuation">}</span>

<span class="token doc-comment comment">/**
 * 添加effect链表
 * <span class="token keyword">@param</span> <span class="token parameter">tag</span> effect的标签
 * <span class="token keyword">@param</span> <span class="token parameter">create</span> 创建方法
 * <span class="token keyword">@param</span> <span class="token parameter">destroy</span> 销毁方法
 * <span class="token keyword">@param</span> <span class="token parameter">deps</span> 依赖数组
 */</span>
<span class="token keyword">function</span> <span class="token function">pushEffect</span><span class="token punctuation">(</span><span class="token parameter">tag<span class="token punctuation">,</span> create<span class="token punctuation">,</span> destroy<span class="token punctuation">,</span> deps</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
  <span class="token keyword">const</span> effect <span class="token operator">=</span> <span class="token punctuation">{</span>
    tag<span class="token punctuation">,</span>
    create<span class="token punctuation">,</span>
    destroy<span class="token punctuation">,</span>
    deps<span class="token punctuation">,</span>
    <span class="token literal-property property">next</span><span class="token operator">:</span> <span class="token keyword">null</span><span class="token punctuation">,</span>
  <span class="token punctuation">}</span><span class="token punctuation">;</span>
  <span class="token keyword">let</span> componentUpdateQueue <span class="token operator">=</span> currentlyRenderingFiber<span class="token punctuation">.</span>updateQueue<span class="token punctuation">;</span>
  <span class="token keyword">if</span> <span class="token punctuation">(</span>componentUpdateQueue <span class="token operator">===</span> <span class="token keyword">null</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
    componentUpdateQueue <span class="token operator">=</span> <span class="token function">createFunctionComponentUpdateQueue</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
    currentlyRenderingFiber<span class="token punctuation">.</span>updateQueue <span class="token operator">=</span> componentUpdateQueue<span class="token punctuation">;</span>
    componentUpdateQueue<span class="token punctuation">.</span>lastEffect <span class="token operator">=</span> effect<span class="token punctuation">.</span>next <span class="token operator">=</span> effect<span class="token punctuation">;</span>
  <span class="token punctuation">}</span> <span class="token keyword">else</span> <span class="token punctuation">{</span>
    <span class="token comment">// effect单向环链</span>
    <span class="token keyword">const</span> lastEffect <span class="token operator">=</span> componentUpdateQueue<span class="token punctuation">.</span>lastEffect<span class="token punctuation">;</span>
    <span class="token keyword">if</span> <span class="token punctuation">(</span>lastEffect <span class="token operator">===</span> <span class="token keyword">null</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
      componentUpdateQueue<span class="token punctuation">.</span>lastEffect <span class="token operator">=</span> effect<span class="token punctuation">.</span>next <span class="token operator">=</span> effect<span class="token punctuation">;</span>
    <span class="token punctuation">}</span> <span class="token keyword">else</span> <span class="token punctuation">{</span>
      <span class="token keyword">const</span> firstEffect <span class="token operator">=</span> lastEffect<span class="token punctuation">.</span>next<span class="token punctuation">;</span>
      lastEffect<span class="token punctuation">.</span>next <span class="token operator">=</span> effect<span class="token punctuation">;</span>
      effect<span class="token punctuation">.</span>next <span class="token operator">=</span> firstEffect<span class="token punctuation">;</span>
      componentUpdateQueue<span class="token punctuation">.</span>lastEffect <span class="token operator">=</span> effect<span class="token punctuation">;</span>
    <span class="token punctuation">}</span>
  <span class="token punctuation">}</span>
  <span class="token keyword">return</span> effect<span class="token punctuation">;</span>
<span class="token punctuation">}</span>

<span class="token keyword">function</span> <span class="token function">createFunctionComponentUpdateQueue</span><span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
  <span class="token keyword">return</span> <span class="token punctuation">{</span>
    <span class="token literal-property property">lastEffect</span><span class="token operator">:</span> <span class="token keyword">null</span><span class="token punctuation">,</span>
  <span class="token punctuation">}</span><span class="token punctuation">;</span>
<span class="token punctuation">}</span>

<span class="token keyword">function</span> <span class="token function">mountState</span><span class="token punctuation">(</span><span class="token parameter">initialState</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
  <span class="token keyword">const</span> hook <span class="token operator">=</span> <span class="token function">mountWorkInProgressHook</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
  hook<span class="token punctuation">.</span>memoizedState <span class="token operator">=</span> initialState<span class="token punctuation">;</span>
  <span class="token keyword">const</span> queue <span class="token operator">=</span> <span class="token punctuation">{</span>
    <span class="token literal-property property">pending</span><span class="token operator">:</span> <span class="token keyword">null</span><span class="token punctuation">,</span>
    <span class="token literal-property property">dispatch</span><span class="token operator">:</span> <span class="token keyword">null</span><span class="token punctuation">,</span>
    <span class="token literal-property property">lastRenderedReducer</span><span class="token operator">:</span> baseStateReducer<span class="token punctuation">,</span> <span class="token comment">// 上一个reducer</span>
    <span class="token literal-property property">lastRenderedState</span><span class="token operator">:</span> initialState<span class="token punctuation">,</span> <span class="token comment">// 上一个state</span>
  <span class="token punctuation">}</span><span class="token punctuation">;</span>
  hook<span class="token punctuation">.</span>queue <span class="token operator">=</span> queue<span class="token punctuation">;</span>
  <span class="token keyword">const</span> dispatch <span class="token operator">=</span> <span class="token punctuation">(</span>queue<span class="token punctuation">.</span>dispatch <span class="token operator">=</span> <span class="token function">dispatchSetState</span><span class="token punctuation">.</span><span class="token function">bind</span><span class="token punctuation">(</span>
    <span class="token keyword">null</span><span class="token punctuation">,</span>
    currentlyRenderingFiber<span class="token punctuation">,</span>
    queue
  <span class="token punctuation">)</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
  <span class="token keyword">return</span> <span class="token punctuation">[</span>hook<span class="token punctuation">.</span>memoizedState<span class="token punctuation">,</span> dispatch<span class="token punctuation">]</span><span class="token punctuation">;</span>
<span class="token punctuation">}</span>

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
  <span class="token literal-property property">useState</span><span class="token operator">:</span> updateState<span class="token punctuation">,</span>
  <span class="token literal-property property">useEffect</span><span class="token operator">:</span> updateEffect<span class="token punctuation">,</span>
<span class="token punctuation">}</span><span class="token punctuation">;</span>

<span class="token comment">// useState就是一个内置了reducer的useReducer</span>
<span class="token keyword">function</span> <span class="token function">baseStateReducer</span><span class="token punctuation">(</span><span class="token parameter">state<span class="token punctuation">,</span> action</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
  <span class="token keyword">return</span> <span class="token keyword">typeof</span> action <span class="token operator">===</span> <span class="token string">&quot;function&quot;</span> <span class="token operator">?</span> <span class="token function">action</span><span class="token punctuation">(</span>state<span class="token punctuation">)</span> <span class="token operator">:</span> action<span class="token punctuation">;</span>
<span class="token punctuation">}</span>

<span class="token keyword">function</span> <span class="token function">updateState</span><span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
  <span class="token keyword">return</span> <span class="token function">updateReducer</span><span class="token punctuation">(</span>baseStateReducer<span class="token punctuation">)</span><span class="token punctuation">;</span>
<span class="token punctuation">}</span>

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
  <span class="token comment">// 每次渲染hook前需要清除更新队列</span>
  workInProgress<span class="token punctuation">.</span>updateQueue <span class="token operator">=</span> <span class="token keyword">null</span><span class="token punctuation">;</span>
  workInProgress<span class="token punctuation">.</span>memoizedState <span class="token operator">=</span> <span class="token keyword">null</span><span class="token punctuation">;</span>
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
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="reactfiberworkloop-js" tabindex="-1"><a class="header-anchor" href="#reactfiberworkloop-js" aria-hidden="true">#</a> ReactFiberWorkLoop.js</h3><p>src\\react-reconciler\\src\\ReactFiberWorkLoop.js</p><div class="language-javascript line-numbers-mode" data-ext="js"><pre class="language-javascript"><code><span class="token keyword">import</span> <span class="token punctuation">{</span> scheduleCallback <span class="token punctuation">}</span> <span class="token keyword">from</span> <span class="token string">&quot;scheduler/index&quot;</span><span class="token punctuation">;</span>
<span class="token keyword">import</span> <span class="token punctuation">{</span> createWorkInProgress <span class="token punctuation">}</span> <span class="token keyword">from</span> <span class="token string">&quot;./ReactFiber&quot;</span><span class="token punctuation">;</span>
<span class="token keyword">import</span> <span class="token punctuation">{</span> beginWork <span class="token punctuation">}</span> <span class="token keyword">from</span> <span class="token string">&quot;./ReactFiberBeginWork&quot;</span><span class="token punctuation">;</span>
<span class="token keyword">import</span> <span class="token punctuation">{</span> completeWork <span class="token punctuation">}</span> <span class="token keyword">from</span> <span class="token string">&quot;./ReactFiberCompleteWork&quot;</span><span class="token punctuation">;</span>
<span class="token keyword">import</span> <span class="token punctuation">{</span>
  NoFlags<span class="token punctuation">,</span>
  MutationMask<span class="token punctuation">,</span>
  Placement<span class="token punctuation">,</span>
  Update<span class="token punctuation">,</span>
  ChildDeletion<span class="token punctuation">,</span>
  Passive<span class="token punctuation">,</span>
<span class="token punctuation">}</span> <span class="token keyword">from</span> <span class="token string">&quot;react-reconciler/src/ReactFiberFlags&quot;</span><span class="token punctuation">;</span>
<span class="token keyword">import</span> <span class="token punctuation">{</span>
  commitMutationEffectsOnFiber<span class="token punctuation">,</span>
  commitPassiveUnmountEffects<span class="token punctuation">,</span>
  commitPassiveMountEffects<span class="token punctuation">,</span>
<span class="token punctuation">}</span> <span class="token keyword">from</span> <span class="token string">&quot;./ReactFiberCommitWork&quot;</span><span class="token punctuation">;</span>
<span class="token keyword">import</span> <span class="token punctuation">{</span> finishQueueingConcurrentUpdates <span class="token punctuation">}</span> <span class="token keyword">from</span> <span class="token string">&quot;./ReactFiberConcurrentUpdates&quot;</span><span class="token punctuation">;</span>
<span class="token keyword">import</span> <span class="token punctuation">{</span>
  FunctionComponent<span class="token punctuation">,</span>
  HostComponent<span class="token punctuation">,</span>
  HostRoot<span class="token punctuation">,</span>
  HostText<span class="token punctuation">,</span>
<span class="token punctuation">}</span> <span class="token keyword">from</span> <span class="token string">&quot;react-reconciler/src/ReactWorkTags&quot;</span><span class="token punctuation">;</span>

<span class="token keyword">let</span> workInProgress <span class="token operator">=</span> <span class="token keyword">null</span><span class="token punctuation">;</span>
<span class="token keyword">let</span> rootDoesHavePassiveEffect <span class="token operator">=</span> <span class="token boolean">false</span><span class="token punctuation">;</span> <span class="token comment">// 此根节点上有没有useEffect类似的副作用</span>
<span class="token keyword">let</span> rootWithPendingPassiveEffects <span class="token operator">=</span> <span class="token keyword">null</span><span class="token punctuation">;</span> <span class="token comment">// 具有useEffect副作用的根节点 FiberRootNode，根fiber.stateNode</span>

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

<span class="token keyword">function</span> <span class="token function">flushPassiveEffect</span><span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
  <span class="token keyword">if</span> <span class="token punctuation">(</span>rootWithPendingPassiveEffects <span class="token operator">!==</span> <span class="token keyword">null</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
    <span class="token keyword">const</span> root <span class="token operator">=</span> rootWithPendingPassiveEffects<span class="token punctuation">;</span>
    <span class="token comment">// 执行卸载副作用 destroy</span>
    <span class="token function">commitPassiveUnmountEffects</span><span class="token punctuation">(</span>root<span class="token punctuation">.</span>current<span class="token punctuation">)</span><span class="token punctuation">;</span>
    <span class="token comment">// 执行挂载副作用 create</span>
    <span class="token function">commitPassiveMountEffects</span><span class="token punctuation">(</span>root<span class="token punctuation">,</span> root<span class="token punctuation">.</span>current<span class="token punctuation">)</span><span class="token punctuation">;</span>
  <span class="token punctuation">}</span>
<span class="token punctuation">}</span>

<span class="token keyword">function</span> <span class="token function">commitRoot</span><span class="token punctuation">(</span><span class="token parameter">root</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
  <span class="token keyword">const</span> <span class="token punctuation">{</span> finishedWork <span class="token punctuation">}</span> <span class="token operator">=</span> root<span class="token punctuation">;</span>
  <span class="token comment">// printFinishedWork(finishedWork);</span>
  <span class="token keyword">if</span> <span class="token punctuation">(</span>
    <span class="token punctuation">(</span>finishedWork<span class="token punctuation">.</span>subtreeFlags <span class="token operator">&amp;</span> Passive<span class="token punctuation">)</span> <span class="token operator">!==</span> NoFlags <span class="token operator">||</span>
    <span class="token punctuation">(</span>finishedWork<span class="token punctuation">.</span>flags <span class="token operator">&amp;</span> Passive<span class="token punctuation">)</span> <span class="token operator">!==</span> NoFlags
  <span class="token punctuation">)</span> <span class="token punctuation">{</span>
    <span class="token keyword">if</span> <span class="token punctuation">(</span><span class="token operator">!</span>rootDoesHavePassiveEffect<span class="token punctuation">)</span> <span class="token punctuation">{</span>
      rootDoesHavePassiveEffect <span class="token operator">=</span> <span class="token boolean">true</span><span class="token punctuation">;</span>
      <span class="token function">scheduleCallback</span><span class="token punctuation">(</span>flushPassiveEffect<span class="token punctuation">)</span><span class="token punctuation">;</span>
    <span class="token punctuation">}</span>
  <span class="token punctuation">}</span>
  console<span class="token punctuation">.</span><span class="token function">log</span><span class="token punctuation">(</span><span class="token string">&quot;~~~~~~~~~~~~~~~~~~~&quot;</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
  <span class="token keyword">const</span> subtreeHasEffects <span class="token operator">=</span>
    <span class="token punctuation">(</span>finishedWork<span class="token punctuation">.</span>subtreeFlags <span class="token operator">&amp;&amp;</span> MutationMask<span class="token punctuation">)</span> <span class="token operator">!==</span> NoFlags<span class="token punctuation">;</span>
  <span class="token keyword">const</span> rootHasEffect <span class="token operator">=</span> <span class="token punctuation">(</span>finishedWork<span class="token punctuation">.</span>flags <span class="token operator">&amp;&amp;</span> MutationMask<span class="token punctuation">)</span> <span class="token operator">!==</span> NoFlags<span class="token punctuation">;</span>
  <span class="token keyword">if</span> <span class="token punctuation">(</span>subtreeHasEffects <span class="token operator">||</span> rootHasEffect<span class="token punctuation">)</span> <span class="token punctuation">{</span>
    <span class="token comment">// 当DOM执行变更之后</span>
    <span class="token function">commitMutationEffectsOnFiber</span><span class="token punctuation">(</span>finishedWork<span class="token punctuation">,</span> root<span class="token punctuation">)</span><span class="token punctuation">;</span>
    <span class="token keyword">if</span> <span class="token punctuation">(</span>rootDoesHavePassiveEffect<span class="token punctuation">)</span> <span class="token punctuation">{</span>
      rootDoesHavePassiveEffect <span class="token operator">=</span> <span class="token boolean">false</span><span class="token punctuation">;</span>
      rootWithPendingPassiveEffects <span class="token operator">=</span> root<span class="token punctuation">;</span>
    <span class="token punctuation">}</span>
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

<span class="token keyword">function</span> <span class="token function">printFinishedWork</span><span class="token punctuation">(</span><span class="token parameter">fiber</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
  <span class="token keyword">const</span> <span class="token punctuation">{</span> flags<span class="token punctuation">,</span> deletions <span class="token punctuation">}</span> <span class="token operator">=</span> fiber<span class="token punctuation">;</span>
  <span class="token keyword">if</span> <span class="token punctuation">(</span><span class="token punctuation">(</span>flags <span class="token operator">&amp;</span> ChildDeletion<span class="token punctuation">)</span> <span class="token operator">!==</span> NoFlags<span class="token punctuation">)</span> <span class="token punctuation">{</span>
    fiber<span class="token punctuation">.</span>flags <span class="token operator">&amp;=</span> <span class="token operator">~</span>ChildDeletion<span class="token punctuation">;</span>
    <span class="token keyword">for</span> <span class="token punctuation">(</span><span class="token keyword">let</span> i <span class="token operator">=</span> <span class="token number">0</span><span class="token punctuation">;</span> i <span class="token operator">&lt;</span> deletions<span class="token punctuation">.</span>length<span class="token punctuation">;</span> i<span class="token operator">++</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
      console<span class="token punctuation">.</span><span class="token function">log</span><span class="token punctuation">(</span>
        <span class="token string">&quot;子节点有删除&quot;</span><span class="token punctuation">,</span>
        deletions<span class="token punctuation">[</span>i<span class="token punctuation">]</span><span class="token punctuation">.</span>type<span class="token punctuation">,</span>
        deletions<span class="token punctuation">[</span>i<span class="token punctuation">]</span><span class="token punctuation">.</span>memoizedProps
      <span class="token punctuation">)</span><span class="token punctuation">;</span>
    <span class="token punctuation">}</span>
  <span class="token punctuation">}</span>
  <span class="token keyword">let</span> child <span class="token operator">=</span> fiber<span class="token punctuation">.</span>child<span class="token punctuation">;</span>
  <span class="token keyword">while</span> <span class="token punctuation">(</span>child<span class="token punctuation">)</span> <span class="token punctuation">{</span>
    <span class="token function">printFinishedWork</span><span class="token punctuation">(</span>child<span class="token punctuation">)</span><span class="token punctuation">;</span>
    child <span class="token operator">=</span> child<span class="token punctuation">.</span>sibling<span class="token punctuation">;</span>
  <span class="token punctuation">}</span>
  <span class="token keyword">if</span> <span class="token punctuation">(</span>fiber<span class="token punctuation">.</span>flags <span class="token operator">!==</span> NoFlags<span class="token punctuation">)</span> <span class="token punctuation">{</span>
    console<span class="token punctuation">.</span><span class="token function">log</span><span class="token punctuation">(</span>
      <span class="token function">getFlags</span><span class="token punctuation">(</span>fiber<span class="token punctuation">)</span><span class="token punctuation">,</span>
      <span class="token function">getTag</span><span class="token punctuation">(</span>fiber<span class="token punctuation">.</span>tag<span class="token punctuation">)</span><span class="token punctuation">,</span>
      <span class="token keyword">typeof</span> fiber<span class="token punctuation">.</span>type <span class="token operator">===</span> <span class="token string">&quot;function&quot;</span> <span class="token operator">?</span> fiber<span class="token punctuation">.</span>type<span class="token punctuation">.</span>name <span class="token operator">:</span> fiber<span class="token punctuation">.</span>type<span class="token punctuation">,</span>
      fiber<span class="token punctuation">.</span>memoizedProps
    <span class="token punctuation">)</span><span class="token punctuation">;</span>
  <span class="token punctuation">}</span>
<span class="token punctuation">}</span>

<span class="token keyword">function</span> <span class="token function">getFlags</span><span class="token punctuation">(</span><span class="token parameter">fiber</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
  <span class="token keyword">const</span> <span class="token punctuation">{</span> flags<span class="token punctuation">,</span> deletions <span class="token punctuation">}</span> <span class="token operator">=</span> fiber<span class="token punctuation">;</span>
  <span class="token keyword">if</span> <span class="token punctuation">(</span>flags <span class="token operator">===</span> Placement<span class="token punctuation">)</span> <span class="token punctuation">{</span>
    <span class="token keyword">return</span> <span class="token string">&quot;插入&quot;</span><span class="token punctuation">;</span>
  <span class="token punctuation">}</span>
  <span class="token keyword">if</span> <span class="token punctuation">(</span>flags <span class="token operator">===</span> Update<span class="token punctuation">)</span> <span class="token punctuation">{</span>
    <span class="token keyword">return</span> <span class="token string">&quot;更新&quot;</span><span class="token punctuation">;</span>
  <span class="token punctuation">}</span>
  <span class="token keyword">return</span> flags<span class="token punctuation">;</span>
<span class="token punctuation">}</span>

<span class="token keyword">function</span> <span class="token function">getTag</span><span class="token punctuation">(</span><span class="token parameter">tag</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
  <span class="token keyword">switch</span> <span class="token punctuation">(</span>tag<span class="token punctuation">)</span> <span class="token punctuation">{</span>
    <span class="token keyword">case</span> <span class="token literal-property property">FunctionComponent</span><span class="token operator">:</span>
      <span class="token keyword">return</span> <span class="token string">&quot;FunctionComponent&quot;</span><span class="token punctuation">;</span>
    <span class="token keyword">case</span> <span class="token literal-property property">HostRoot</span><span class="token operator">:</span>
      <span class="token keyword">return</span> <span class="token string">&quot;HostRoot&quot;</span><span class="token punctuation">;</span>
    <span class="token keyword">case</span> <span class="token literal-property property">HostComponent</span><span class="token operator">:</span>
      <span class="token keyword">return</span> <span class="token string">&quot;HostComponent&quot;</span><span class="token punctuation">;</span>
    <span class="token keyword">case</span> <span class="token literal-property property">HostText</span><span class="token operator">:</span>
      <span class="token keyword">return</span> <span class="token string">&quot;HostText&quot;</span><span class="token punctuation">;</span>
    <span class="token keyword">default</span><span class="token operator">:</span>
      <span class="token keyword">return</span> tag<span class="token punctuation">;</span>
  <span class="token punctuation">}</span>
<span class="token punctuation">}</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="reactfibercommitwork-js" tabindex="-1"><a class="header-anchor" href="#reactfibercommitwork-js" aria-hidden="true">#</a> ReactFiberCommitWork.js</h3><p>src\\react-reconciler\\src\\ReactFiberCommitWork.js</p><div class="language-javascript line-numbers-mode" data-ext="js"><pre class="language-javascript"><code><span class="token keyword">import</span> <span class="token punctuation">{</span>
  appendChild<span class="token punctuation">,</span>
  insertBefore<span class="token punctuation">,</span>
  commitUpdate<span class="token punctuation">,</span>
  removeChild<span class="token punctuation">,</span>
<span class="token punctuation">}</span> <span class="token keyword">from</span> <span class="token string">&quot;react-dom/src/client/ReactDOMHostConfig&quot;</span><span class="token punctuation">;</span>
<span class="token keyword">import</span> <span class="token punctuation">{</span>
  FunctionComponent<span class="token punctuation">,</span>
  HostComponent<span class="token punctuation">,</span>
  HostRoot<span class="token punctuation">,</span>
  HostText<span class="token punctuation">,</span>
<span class="token punctuation">}</span> <span class="token keyword">from</span> <span class="token string">&quot;react-reconciler/src/ReactWorkTags&quot;</span><span class="token punctuation">;</span>
<span class="token keyword">import</span> <span class="token punctuation">{</span>
  MutationMask<span class="token punctuation">,</span>
  Passive<span class="token punctuation">,</span>
  Placement<span class="token punctuation">,</span>
  Update<span class="token punctuation">,</span>
<span class="token punctuation">}</span> <span class="token keyword">from</span> <span class="token string">&quot;react-reconciler/src/ReactFiberFlags&quot;</span><span class="token punctuation">;</span>
<span class="token keyword">import</span> <span class="token punctuation">{</span>
  Passive <span class="token keyword">as</span> HookPassive<span class="token punctuation">,</span>
  HasEffect <span class="token keyword">as</span> HookHasEffect<span class="token punctuation">,</span>
<span class="token punctuation">}</span> <span class="token keyword">from</span> <span class="token string">&quot;./ReactHookEffectTags&quot;</span><span class="token punctuation">;</span>

<span class="token keyword">let</span> hostParent <span class="token operator">=</span> <span class="token keyword">null</span><span class="token punctuation">;</span>

<span class="token doc-comment comment">/**
 * 提交删除副作用
 * <span class="token keyword">@param</span> <span class="token parameter">root</span> 根节点
 * <span class="token keyword">@param</span> <span class="token parameter">returnFiber</span> 父fiber
 * <span class="token keyword">@param</span> <span class="token parameter">deletedFiber</span> 删除的fiber
 */</span>
<span class="token keyword">function</span> <span class="token function">commitDeletionEffects</span><span class="token punctuation">(</span><span class="token parameter">root<span class="token punctuation">,</span> returnFiber<span class="token punctuation">,</span> deletedFiber</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
  <span class="token keyword">let</span> parent <span class="token operator">=</span> returnFiber<span class="token punctuation">;</span>
  <span class="token comment">// 一直向上查找直到找到真实DOM节点为止</span>
  <span class="token literal-property property">findParent</span><span class="token operator">:</span> <span class="token keyword">while</span> <span class="token punctuation">(</span>parent <span class="token operator">!==</span> <span class="token keyword">null</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
    <span class="token keyword">switch</span> <span class="token punctuation">(</span>parent<span class="token punctuation">.</span>tag<span class="token punctuation">)</span> <span class="token punctuation">{</span>
      <span class="token keyword">case</span> <span class="token literal-property property">HostComponent</span><span class="token operator">:</span> <span class="token punctuation">{</span>
        hostParent <span class="token operator">=</span> parent<span class="token punctuation">.</span>stateNode<span class="token punctuation">;</span>
        <span class="token keyword">break</span> findParent<span class="token punctuation">;</span>
      <span class="token punctuation">}</span>
      <span class="token keyword">case</span> <span class="token literal-property property">HostRoot</span><span class="token operator">:</span> <span class="token punctuation">{</span>
        hostParent <span class="token operator">=</span> parent<span class="token punctuation">.</span>stateNode<span class="token punctuation">.</span>containerInfo<span class="token punctuation">;</span>
        <span class="token keyword">break</span> findParent<span class="token punctuation">;</span>
      <span class="token punctuation">}</span>
    <span class="token punctuation">}</span>
    parent <span class="token operator">=</span> parent<span class="token punctuation">.</span>return<span class="token punctuation">;</span>
  <span class="token punctuation">}</span>
  <span class="token function">commitDeletionEffectsOnFiber</span><span class="token punctuation">(</span>root<span class="token punctuation">,</span> returnFiber<span class="token punctuation">,</span> deletedFiber<span class="token punctuation">)</span><span class="token punctuation">;</span>
  hostParent <span class="token operator">=</span> <span class="token keyword">null</span><span class="token punctuation">;</span>
<span class="token punctuation">}</span>

<span class="token keyword">function</span> <span class="token function">commitDeletionEffectsOnFiber</span><span class="token punctuation">(</span>
  <span class="token parameter">finishedRoot<span class="token punctuation">,</span>
  nearestMountedAncestor<span class="token punctuation">,</span>
  deletedFiber</span>
<span class="token punctuation">)</span> <span class="token punctuation">{</span>
  <span class="token keyword">switch</span> <span class="token punctuation">(</span>deletedFiber<span class="token punctuation">.</span>tag<span class="token punctuation">)</span> <span class="token punctuation">{</span>
    <span class="token keyword">case</span> <span class="token literal-property property">HostComponent</span><span class="token operator">:</span>
    <span class="token keyword">case</span> <span class="token literal-property property">HostText</span><span class="token operator">:</span> <span class="token punctuation">{</span>
      <span class="token comment">// 递归处理子节点，当要删除一个节点的时候，要先删除它的子节点 不直接删除自己</span>
      <span class="token function">recursivelyTraverseDeletionEffects</span><span class="token punctuation">(</span>
        finishedRoot<span class="token punctuation">,</span>
        nearestMountedAncestor<span class="token punctuation">,</span>
        deletedFiber
      <span class="token punctuation">)</span><span class="token punctuation">;</span>
      <span class="token comment">// 再把自己删除</span>
      <span class="token keyword">if</span> <span class="token punctuation">(</span>hostParent <span class="token operator">!==</span> <span class="token keyword">null</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
        <span class="token function">removeChild</span><span class="token punctuation">(</span>hostParent<span class="token punctuation">,</span> deletedFiber<span class="token punctuation">.</span>stateNode<span class="token punctuation">)</span><span class="token punctuation">;</span>
      <span class="token punctuation">}</span>
      <span class="token keyword">break</span><span class="token punctuation">;</span>
    <span class="token punctuation">}</span>
    <span class="token keyword">default</span><span class="token operator">:</span>
      <span class="token keyword">break</span><span class="token punctuation">;</span>
  <span class="token punctuation">}</span>
<span class="token punctuation">}</span>

<span class="token keyword">function</span> <span class="token function">recursivelyTraverseDeletionEffects</span><span class="token punctuation">(</span>
  <span class="token parameter">finishedRoot<span class="token punctuation">,</span>
  nearestMountedAncestor<span class="token punctuation">,</span>
  parent</span>
<span class="token punctuation">)</span> <span class="token punctuation">{</span>
  <span class="token keyword">let</span> child <span class="token operator">=</span> parent<span class="token punctuation">.</span>child<span class="token punctuation">;</span>
  <span class="token keyword">while</span> <span class="token punctuation">(</span>child <span class="token operator">!==</span> <span class="token keyword">null</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
    <span class="token function">commitDeletionEffectsOnFiber</span><span class="token punctuation">(</span>finishedRoot<span class="token punctuation">,</span> nearestMountedAncestor<span class="token punctuation">,</span> child<span class="token punctuation">)</span><span class="token punctuation">;</span>
    child <span class="token operator">=</span> child<span class="token punctuation">.</span>sibling<span class="token punctuation">;</span>
  <span class="token punctuation">}</span>
<span class="token punctuation">}</span>

<span class="token doc-comment comment">/**
 * 递归遍历处理变更的副作用
 * <span class="token keyword">@param</span> <span class="token parameter">root</span> 根节点
 * <span class="token keyword">@param</span> <span class="token parameter">parentFiber</span> 父Fiber
 */</span>
<span class="token keyword">function</span> <span class="token function">recursivelyTraverseMutationEffects</span><span class="token punctuation">(</span><span class="token parameter">root<span class="token punctuation">,</span> parentFiber</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
  <span class="token comment">// 先把父Fiber上该删除的节点都删除</span>
  <span class="token keyword">const</span> deletions <span class="token operator">=</span> parentFiber<span class="token punctuation">.</span>deletions<span class="token punctuation">;</span>
  <span class="token keyword">if</span> <span class="token punctuation">(</span>deletions <span class="token operator">!==</span> <span class="token keyword">null</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
    <span class="token keyword">for</span> <span class="token punctuation">(</span><span class="token keyword">let</span> i <span class="token operator">=</span> <span class="token number">0</span><span class="token punctuation">;</span> i <span class="token operator">&lt;</span> deletions<span class="token punctuation">.</span>length<span class="token punctuation">;</span> i<span class="token operator">++</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
      <span class="token keyword">const</span> childToDelete <span class="token operator">=</span> deletions<span class="token punctuation">[</span>i<span class="token punctuation">]</span><span class="token punctuation">;</span>
      <span class="token function">commitDeletionEffects</span><span class="token punctuation">(</span>root<span class="token punctuation">,</span> parentFiber<span class="token punctuation">,</span> childToDelete<span class="token punctuation">)</span><span class="token punctuation">;</span>
    <span class="token punctuation">}</span>
  <span class="token punctuation">}</span>
  <span class="token comment">// 再去处理剩下的子节点</span>
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

<span class="token keyword">export</span> <span class="token keyword">function</span> <span class="token function">commitPassiveUnmountEffects</span><span class="token punctuation">(</span><span class="token parameter">finishedWork</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
  <span class="token function">commitPassiveUnmountOnFiber</span><span class="token punctuation">(</span>finishedWork<span class="token punctuation">)</span><span class="token punctuation">;</span>
<span class="token punctuation">}</span>

<span class="token keyword">function</span> <span class="token function">commitPassiveUnmountOnFiber</span><span class="token punctuation">(</span><span class="token parameter">finishedWork</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
  <span class="token keyword">const</span> flags <span class="token operator">=</span> finishedWork<span class="token punctuation">.</span>flags<span class="token punctuation">;</span>
  <span class="token keyword">switch</span> <span class="token punctuation">(</span>finishedWork<span class="token punctuation">.</span>tag<span class="token punctuation">)</span> <span class="token punctuation">{</span>
    <span class="token keyword">case</span> <span class="token literal-property property">HostRoot</span><span class="token operator">:</span> <span class="token punctuation">{</span>
      <span class="token function">recursivelyTraversePassiveUnmountEffects</span><span class="token punctuation">(</span>finishedWork<span class="token punctuation">)</span><span class="token punctuation">;</span>
      <span class="token keyword">break</span><span class="token punctuation">;</span>
    <span class="token punctuation">}</span>
    <span class="token keyword">case</span> <span class="token literal-property property">FunctionComponent</span><span class="token operator">:</span> <span class="token punctuation">{</span>
      <span class="token function">recursivelyTraversePassiveUnmountEffects</span><span class="token punctuation">(</span>finishedWork<span class="token punctuation">)</span><span class="token punctuation">;</span>
      <span class="token keyword">if</span> <span class="token punctuation">(</span>flags <span class="token operator">&amp;</span> Passive<span class="token punctuation">)</span> <span class="token punctuation">{</span>
        <span class="token function">commitHookPassiveUnmountEffects</span><span class="token punctuation">(</span>
          finishedWork<span class="token punctuation">,</span>
          HookPassive <span class="token operator">|</span> HookHasEffect
        <span class="token punctuation">)</span><span class="token punctuation">;</span>
      <span class="token punctuation">}</span>
      <span class="token keyword">break</span><span class="token punctuation">;</span>
    <span class="token punctuation">}</span>
  <span class="token punctuation">}</span>
<span class="token punctuation">}</span>

<span class="token keyword">function</span> <span class="token function">recursivelyTraversePassiveUnmountEffects</span><span class="token punctuation">(</span><span class="token parameter">parentFiber</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
  <span class="token keyword">if</span> <span class="token punctuation">(</span>parentFiber<span class="token punctuation">.</span>subtreeFlags <span class="token operator">&amp;</span> Passive<span class="token punctuation">)</span> <span class="token punctuation">{</span>
    <span class="token keyword">let</span> child <span class="token operator">=</span> parentFiber<span class="token punctuation">.</span>child<span class="token punctuation">;</span>
    <span class="token keyword">while</span> <span class="token punctuation">(</span>child <span class="token operator">!==</span> <span class="token keyword">null</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
      <span class="token function">commitPassiveUnmountOnFiber</span><span class="token punctuation">(</span>child<span class="token punctuation">)</span><span class="token punctuation">;</span>
      child <span class="token operator">=</span> child<span class="token punctuation">.</span>sibling<span class="token punctuation">;</span>
    <span class="token punctuation">}</span>
  <span class="token punctuation">}</span>
<span class="token punctuation">}</span>

<span class="token keyword">function</span> <span class="token function">commitHookPassiveUnmountEffects</span><span class="token punctuation">(</span><span class="token parameter">finishedWork<span class="token punctuation">,</span> hookFlags</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
  <span class="token function">commitHookEffectListUnmount</span><span class="token punctuation">(</span>hookFlags<span class="token punctuation">,</span> finishedWork<span class="token punctuation">)</span><span class="token punctuation">;</span>
<span class="token punctuation">}</span>

<span class="token keyword">function</span> <span class="token function">commitHookEffectListUnmount</span><span class="token punctuation">(</span><span class="token parameter">flags<span class="token punctuation">,</span> finishedWork</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
  <span class="token keyword">const</span> updateQueue <span class="token operator">=</span> finishedWork<span class="token punctuation">.</span>updateQueue<span class="token punctuation">;</span>
  <span class="token keyword">const</span> lastEffect <span class="token operator">=</span> updateQueue <span class="token operator">!==</span> <span class="token keyword">null</span> <span class="token operator">?</span> updateQueue<span class="token punctuation">.</span>lastEffect <span class="token operator">:</span> <span class="token keyword">null</span><span class="token punctuation">;</span>
  <span class="token keyword">if</span> <span class="token punctuation">(</span>lastEffect <span class="token operator">!==</span> <span class="token keyword">null</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
    <span class="token keyword">const</span> firstEffect <span class="token operator">=</span> lastEffect<span class="token punctuation">.</span>next<span class="token punctuation">;</span>
    <span class="token keyword">let</span> effect <span class="token operator">=</span> firstEffect<span class="token punctuation">;</span>
    <span class="token keyword">do</span> <span class="token punctuation">{</span>
      <span class="token keyword">if</span> <span class="token punctuation">(</span><span class="token punctuation">(</span>effect<span class="token punctuation">.</span>tag <span class="token operator">&amp;</span> flags<span class="token punctuation">)</span> <span class="token operator">===</span> flags<span class="token punctuation">)</span> <span class="token punctuation">{</span>
        <span class="token keyword">const</span> destroy <span class="token operator">=</span> effect<span class="token punctuation">.</span>destroy<span class="token punctuation">;</span>
        <span class="token keyword">if</span> <span class="token punctuation">(</span>destroy <span class="token operator">!==</span> <span class="token keyword">undefined</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
          <span class="token function">destroy</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
        <span class="token punctuation">}</span>
      <span class="token punctuation">}</span>
      effect <span class="token operator">=</span> effect<span class="token punctuation">.</span>next<span class="token punctuation">;</span>
    <span class="token punctuation">}</span> <span class="token keyword">while</span> <span class="token punctuation">(</span>effect <span class="token operator">!==</span> firstEffect<span class="token punctuation">)</span><span class="token punctuation">;</span>
  <span class="token punctuation">}</span>
<span class="token punctuation">}</span>

<span class="token keyword">export</span> <span class="token keyword">function</span> <span class="token function">commitPassiveMountEffects</span><span class="token punctuation">(</span><span class="token parameter">root<span class="token punctuation">,</span> finishedWork</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
  <span class="token function">commitPassiveMountOnFiber</span><span class="token punctuation">(</span>root<span class="token punctuation">,</span> finishedWork<span class="token punctuation">)</span><span class="token punctuation">;</span>
<span class="token punctuation">}</span>

<span class="token keyword">function</span> <span class="token function">commitPassiveMountOnFiber</span><span class="token punctuation">(</span><span class="token parameter">finishedRoot<span class="token punctuation">,</span> finishedWork</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
  <span class="token keyword">const</span> flags <span class="token operator">=</span> finishedWork<span class="token punctuation">.</span>flags<span class="token punctuation">;</span>
  <span class="token keyword">switch</span> <span class="token punctuation">(</span>finishedWork<span class="token punctuation">.</span>tag<span class="token punctuation">)</span> <span class="token punctuation">{</span>
    <span class="token keyword">case</span> <span class="token literal-property property">HostRoot</span><span class="token operator">:</span> <span class="token punctuation">{</span>
      <span class="token function">recursivelyTraversePassiveMountEffects</span><span class="token punctuation">(</span>finishedRoot<span class="token punctuation">,</span> finishedWork<span class="token punctuation">)</span><span class="token punctuation">;</span>
      <span class="token keyword">break</span><span class="token punctuation">;</span>
    <span class="token punctuation">}</span>
    <span class="token keyword">case</span> <span class="token literal-property property">FunctionComponent</span><span class="token operator">:</span> <span class="token punctuation">{</span>
      <span class="token function">recursivelyTraversePassiveMountEffects</span><span class="token punctuation">(</span>finishedRoot<span class="token punctuation">,</span> finishedWork<span class="token punctuation">)</span><span class="token punctuation">;</span>
      <span class="token keyword">if</span> <span class="token punctuation">(</span>flags <span class="token operator">&amp;</span> Passive<span class="token punctuation">)</span> <span class="token punctuation">{</span>
        <span class="token function">commitHookPassiveMountEffects</span><span class="token punctuation">(</span>
          finishedWork<span class="token punctuation">,</span>
          HookPassive <span class="token operator">|</span> HookHasEffect
        <span class="token punctuation">)</span><span class="token punctuation">;</span>
      <span class="token punctuation">}</span>
      <span class="token keyword">break</span><span class="token punctuation">;</span>
    <span class="token punctuation">}</span>
  <span class="token punctuation">}</span>
<span class="token punctuation">}</span>

<span class="token keyword">function</span> <span class="token function">recursivelyTraversePassiveMountEffects</span><span class="token punctuation">(</span><span class="token parameter">root<span class="token punctuation">,</span> parentFiber</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
  <span class="token keyword">if</span> <span class="token punctuation">(</span>parentFiber<span class="token punctuation">.</span>subtreeFlags <span class="token operator">&amp;</span> Passive<span class="token punctuation">)</span> <span class="token punctuation">{</span>
    <span class="token keyword">let</span> child <span class="token operator">=</span> parentFiber<span class="token punctuation">.</span>child<span class="token punctuation">;</span>
    <span class="token keyword">while</span> <span class="token punctuation">(</span>child <span class="token operator">!==</span> <span class="token keyword">null</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
      <span class="token function">commitPassiveMountOnFiber</span><span class="token punctuation">(</span>root<span class="token punctuation">,</span> child<span class="token punctuation">)</span><span class="token punctuation">;</span>
      child <span class="token operator">=</span> child<span class="token punctuation">.</span>sibling<span class="token punctuation">;</span>
    <span class="token punctuation">}</span>
  <span class="token punctuation">}</span>
<span class="token punctuation">}</span>

<span class="token keyword">function</span> <span class="token function">commitHookPassiveMountEffects</span><span class="token punctuation">(</span><span class="token parameter">finishedWork<span class="token punctuation">,</span> hookFlags</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
  <span class="token function">commitHookEffectListMount</span><span class="token punctuation">(</span>hookFlags<span class="token punctuation">,</span> finishedWork<span class="token punctuation">)</span><span class="token punctuation">;</span>
<span class="token punctuation">}</span>

<span class="token keyword">function</span> <span class="token function">commitHookEffectListMount</span><span class="token punctuation">(</span><span class="token parameter">flags<span class="token punctuation">,</span> finishedWork</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
  <span class="token keyword">const</span> updateQueue <span class="token operator">=</span> finishedWork<span class="token punctuation">.</span>updateQueue<span class="token punctuation">;</span>
  <span class="token keyword">const</span> lastEffect <span class="token operator">=</span> updateQueue <span class="token operator">!==</span> <span class="token keyword">null</span> <span class="token operator">?</span> updateQueue<span class="token punctuation">.</span>lastEffect <span class="token operator">:</span> <span class="token keyword">null</span><span class="token punctuation">;</span>
  <span class="token keyword">if</span> <span class="token punctuation">(</span>lastEffect <span class="token operator">!==</span> <span class="token keyword">null</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
    <span class="token keyword">const</span> firstEffect <span class="token operator">=</span> lastEffect<span class="token punctuation">.</span>next<span class="token punctuation">;</span>
    <span class="token keyword">let</span> effect <span class="token operator">=</span> firstEffect<span class="token punctuation">;</span>
    <span class="token keyword">do</span> <span class="token punctuation">{</span>
      <span class="token keyword">if</span> <span class="token punctuation">(</span><span class="token punctuation">(</span>effect<span class="token punctuation">.</span>tag <span class="token operator">&amp;</span> flags<span class="token punctuation">)</span> <span class="token operator">===</span> flags<span class="token punctuation">)</span> <span class="token punctuation">{</span>
        <span class="token keyword">const</span> create <span class="token operator">=</span> effect<span class="token punctuation">.</span>create<span class="token punctuation">;</span>
        effect<span class="token punctuation">.</span>destroy <span class="token operator">=</span> <span class="token function">create</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
      <span class="token punctuation">}</span>
      effect <span class="token operator">=</span> effect<span class="token punctuation">.</span>next<span class="token punctuation">;</span>
    <span class="token punctuation">}</span> <span class="token keyword">while</span> <span class="token punctuation">(</span>effect <span class="token operator">!==</span> firstEffect<span class="token punctuation">)</span><span class="token punctuation">;</span>
  <span class="token punctuation">}</span>
<span class="token punctuation">}</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h2 id="uselayouteffect" tabindex="-1"><a class="header-anchor" href="#uselayouteffect" aria-hidden="true">#</a> useLayoutEffect</h2><figure><img src="https://misaka10032.oss-cn-chengdu.aliyuncs.com/React/useLayoutEffect.jpg" alt="useLayoutEffect" tabindex="0" loading="lazy"><figcaption>useLayoutEffect</figcaption></figure><figure><img src="https://misaka10032.oss-cn-chengdu.aliyuncs.com/React/commitLayoutEffects.jpg" alt="commitLayoutEffect" tabindex="0" loading="lazy"><figcaption>commitLayoutEffect</figcaption></figure><ul><li>其函数签名与 useEffect 相同，但它会在所有的 DOM 变更之后同步调用 effect</li><li>useEffect 不会阻塞浏览器渲染，而 useLayoutEffect 会浏览器渲染</li><li>useEffect 会在浏览器渲染结束后执行,useLayoutEffect 则是在 DOM 更新完成后,浏览器绘制之前执行</li></ul><p><strong>相较于在 commit 阶段执行完毕后才执行的副作用 useEffect，useLayoutEffect 选择在 commitWork 执行 DOM 操作前就会先执行</strong></p><h3 id="src-main-jsx-1" tabindex="-1"><a class="header-anchor" href="#src-main-jsx-1" aria-hidden="true">#</a> src\\main.jsx</h3><p>src\\main.jsx</p><div class="language-jsx line-numbers-mode" data-ext="jsx"><pre class="language-jsx"><code><span class="token keyword">import</span> <span class="token operator">*</span> <span class="token keyword">as</span> React <span class="token keyword">from</span> <span class="token string">&quot;react/index&quot;</span><span class="token punctuation">;</span>
<span class="token keyword">import</span> <span class="token punctuation">{</span> createRoot <span class="token punctuation">}</span> <span class="token keyword">from</span> <span class="token string">&quot;react-dom/client&quot;</span><span class="token punctuation">;</span>

<span class="token keyword">function</span> <span class="token function">FunctionComponent</span><span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
  console<span class="token punctuation">.</span><span class="token function">log</span><span class="token punctuation">(</span><span class="token string">&quot;FunctionComponent&quot;</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
  <span class="token keyword">const</span> <span class="token punctuation">[</span>number<span class="token punctuation">,</span> setNumber<span class="token punctuation">]</span> <span class="token operator">=</span> React<span class="token punctuation">.</span><span class="token function">useState</span><span class="token punctuation">(</span><span class="token number">1</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
  React<span class="token punctuation">.</span><span class="token function">useLayoutEffect</span><span class="token punctuation">(</span><span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token operator">=&gt;</span> <span class="token punctuation">{</span>
    console<span class="token punctuation">.</span><span class="token function">log</span><span class="token punctuation">(</span><span class="token string">&quot;useLayoutEffect1&quot;</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
    <span class="token keyword">return</span> <span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token operator">=&gt;</span> <span class="token punctuation">{</span>
      console<span class="token punctuation">.</span><span class="token function">log</span><span class="token punctuation">(</span><span class="token string">&quot;destroy useLayoutEffect1&quot;</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
    <span class="token punctuation">}</span><span class="token punctuation">;</span>
  <span class="token punctuation">}</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
  React<span class="token punctuation">.</span><span class="token function">useEffect</span><span class="token punctuation">(</span><span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token operator">=&gt;</span> <span class="token punctuation">{</span>
    console<span class="token punctuation">.</span><span class="token function">log</span><span class="token punctuation">(</span><span class="token string">&quot;useEffect2&quot;</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
    <span class="token keyword">return</span> <span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token operator">=&gt;</span> <span class="token punctuation">{</span>
      console<span class="token punctuation">.</span><span class="token function">log</span><span class="token punctuation">(</span><span class="token string">&quot;destroy useEffect2&quot;</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
    <span class="token punctuation">}</span><span class="token punctuation">;</span>
  <span class="token punctuation">}</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
  React<span class="token punctuation">.</span><span class="token function">useEffect</span><span class="token punctuation">(</span><span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token operator">=&gt;</span> <span class="token punctuation">{</span>
    console<span class="token punctuation">.</span><span class="token function">log</span><span class="token punctuation">(</span><span class="token string">&quot;useEffect3&quot;</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
    console<span class="token punctuation">.</span><span class="token function">log</span><span class="token punctuation">(</span>number<span class="token punctuation">)</span><span class="token punctuation">;</span>
    <span class="token keyword">return</span> <span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token operator">=&gt;</span> <span class="token punctuation">{</span>
      console<span class="token punctuation">.</span><span class="token function">log</span><span class="token punctuation">(</span><span class="token string">&quot;destroy useEffect3&quot;</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
    <span class="token punctuation">}</span><span class="token punctuation">;</span>
  <span class="token punctuation">}</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
  <span class="token keyword">return</span> <span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span>div</span> <span class="token attr-name">onClick</span><span class="token script language-javascript"><span class="token script-punctuation punctuation">=</span><span class="token punctuation">{</span><span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token operator">=&gt;</span> <span class="token function">setNumber</span><span class="token punctuation">(</span>number <span class="token operator">+</span> <span class="token number">1</span><span class="token punctuation">)</span><span class="token punctuation">}</span></span><span class="token punctuation">&gt;</span></span><span class="token punctuation">{</span>number<span class="token punctuation">}</span><span class="token tag"><span class="token tag"><span class="token punctuation">&lt;/</span>div</span><span class="token punctuation">&gt;</span></span><span class="token punctuation">;</span>
<span class="token punctuation">}</span>

<span class="token keyword">const</span> element <span class="token operator">=</span> <span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span><span class="token class-name">FunctionComponent</span></span> <span class="token punctuation">/&gt;</span></span><span class="token punctuation">;</span>
<span class="token keyword">const</span> root <span class="token operator">=</span> <span class="token function">createRoot</span><span class="token punctuation">(</span>document<span class="token punctuation">.</span><span class="token function">getElementById</span><span class="token punctuation">(</span><span class="token string">&quot;root&quot;</span><span class="token punctuation">)</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
<span class="token comment">// 把element虚拟DOM挂载到容器中</span>
root<span class="token punctuation">.</span><span class="token function">render</span><span class="token punctuation">(</span>element<span class="token punctuation">)</span><span class="token punctuation">;</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="react-index-js-1" tabindex="-1"><a class="header-anchor" href="#react-index-js-1" aria-hidden="true">#</a> react\\index.js</h3><p>src\\react\\index.js</p><div class="language-javascript line-numbers-mode" data-ext="js"><pre class="language-javascript"><code><span class="token keyword">export</span> <span class="token punctuation">{</span>
  __SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED<span class="token punctuation">,</span>
  useReducer<span class="token punctuation">,</span>
  useState<span class="token punctuation">,</span>
  useEffect<span class="token punctuation">,</span>
  useLayoutEffect<span class="token punctuation">,</span>
<span class="token punctuation">}</span> <span class="token keyword">from</span> <span class="token string">&quot;./src/React&quot;</span><span class="token punctuation">;</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="react-js-1" tabindex="-1"><a class="header-anchor" href="#react-js-1" aria-hidden="true">#</a> React.js</h3><p>src\\react\\src\\React.js</p><div class="language-javascript line-numbers-mode" data-ext="js"><pre class="language-javascript"><code><span class="token keyword">import</span> <span class="token punctuation">{</span> useReducer<span class="token punctuation">,</span> useState<span class="token punctuation">,</span> useEffect<span class="token punctuation">,</span> useLayoutEffect <span class="token punctuation">}</span> <span class="token keyword">from</span> <span class="token string">&quot;./ReactHooks&quot;</span><span class="token punctuation">;</span>
<span class="token keyword">import</span> ReactSharedInternals <span class="token keyword">from</span> <span class="token string">&quot;./ReactSharedInternals&quot;</span><span class="token punctuation">;</span>

<span class="token keyword">export</span> <span class="token punctuation">{</span>
  useReducer<span class="token punctuation">,</span>
  useState<span class="token punctuation">,</span>
  useEffect<span class="token punctuation">,</span>
  useLayoutEffect<span class="token punctuation">,</span>
  ReactSharedInternals <span class="token keyword">as</span> __SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED<span class="token punctuation">,</span>
<span class="token punctuation">}</span><span class="token punctuation">;</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="reacthooks-js-1" tabindex="-1"><a class="header-anchor" href="#reacthooks-js-1" aria-hidden="true">#</a> ReactHooks.js</h3><p>src\\react\\src\\ReactHooks.js</p><div class="language-javascript line-numbers-mode" data-ext="js"><pre class="language-javascript"><code><span class="token keyword">import</span> ReactCurrentDispatcher <span class="token keyword">from</span> <span class="token string">&quot;./ReactCurrentDispatcher&quot;</span><span class="token punctuation">;</span>

<span class="token keyword">function</span> <span class="token function">resolveDispatcher</span><span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
  <span class="token keyword">const</span> dispatcher <span class="token operator">=</span> ReactCurrentDispatcher<span class="token punctuation">.</span>current<span class="token punctuation">;</span>
  <span class="token keyword">return</span> dispatcher<span class="token punctuation">;</span>
<span class="token punctuation">}</span>

<span class="token keyword">export</span> <span class="token keyword">function</span> <span class="token function">useReducer</span><span class="token punctuation">(</span><span class="token parameter">reducer<span class="token punctuation">,</span> initialArg<span class="token punctuation">,</span> init</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
  <span class="token keyword">const</span> dispatcher <span class="token operator">=</span> <span class="token function">resolveDispatcher</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
  <span class="token keyword">return</span> dispatcher<span class="token punctuation">.</span><span class="token function">useReducer</span><span class="token punctuation">(</span>reducer<span class="token punctuation">,</span> initialArg<span class="token punctuation">,</span> init<span class="token punctuation">)</span><span class="token punctuation">;</span>
<span class="token punctuation">}</span>

<span class="token keyword">export</span> <span class="token keyword">function</span> <span class="token function">useState</span><span class="token punctuation">(</span><span class="token parameter">reducer<span class="token punctuation">,</span> initialArg<span class="token punctuation">,</span> init</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
  <span class="token keyword">const</span> dispatcher <span class="token operator">=</span> <span class="token function">resolveDispatcher</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
  <span class="token keyword">return</span> dispatcher<span class="token punctuation">.</span><span class="token function">useState</span><span class="token punctuation">(</span>reducer<span class="token punctuation">,</span> initialArg<span class="token punctuation">,</span> init<span class="token punctuation">)</span><span class="token punctuation">;</span>
<span class="token punctuation">}</span>

<span class="token keyword">export</span> <span class="token keyword">function</span> <span class="token function">useEffect</span><span class="token punctuation">(</span><span class="token parameter">create<span class="token punctuation">,</span> deps</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
  <span class="token keyword">const</span> dispatcher <span class="token operator">=</span> <span class="token function">resolveDispatcher</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
  <span class="token keyword">return</span> dispatcher<span class="token punctuation">.</span><span class="token function">useEffect</span><span class="token punctuation">(</span>create<span class="token punctuation">,</span> deps<span class="token punctuation">)</span><span class="token punctuation">;</span>
<span class="token punctuation">}</span>

<span class="token keyword">export</span> <span class="token keyword">function</span> <span class="token function">useLayoutEffect</span><span class="token punctuation">(</span><span class="token parameter">create<span class="token punctuation">,</span> deps</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
  <span class="token keyword">const</span> dispatcher <span class="token operator">=</span> <span class="token function">resolveDispatcher</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
  <span class="token keyword">return</span> dispatcher<span class="token punctuation">.</span><span class="token function">useLayoutEffect</span><span class="token punctuation">(</span>create<span class="token punctuation">,</span> deps<span class="token punctuation">)</span><span class="token punctuation">;</span>
<span class="token punctuation">}</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="reacthookeffecttags-js-1" tabindex="-1"><a class="header-anchor" href="#reacthookeffecttags-js-1" aria-hidden="true">#</a> ReactHookEffectTags.js</h3><p>src\\react-reconciler\\src\\ReactHookEffectTags.js</p><div class="language-javascript line-numbers-mode" data-ext="js"><pre class="language-javascript"><code><span class="token keyword">export</span> <span class="token keyword">const</span> HasEffect <span class="token operator">=</span> <span class="token number">0b0001</span><span class="token punctuation">;</span> <span class="token comment">// 1</span>
<span class="token comment">// 浏览器绘制之前执行的effect，UI绘制之前，类似微任务</span>
<span class="token keyword">export</span> <span class="token keyword">const</span> Layout <span class="token operator">=</span> <span class="token number">0b0100</span><span class="token punctuation">;</span> <span class="token comment">// 4</span>
<span class="token comment">// 浏览器绘制之后执行的effect，UI绘制之后，类似于宏任务</span>
<span class="token keyword">export</span> <span class="token keyword">const</span> Passive <span class="token operator">=</span> <span class="token number">0b1000</span><span class="token punctuation">;</span> <span class="token comment">// 8</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="reactfiberflags-js-1" tabindex="-1"><a class="header-anchor" href="#reactfiberflags-js-1" aria-hidden="true">#</a> ReactFiberFlags.js</h3><p>src\\react-reconciler\\src\\ReactFiberFlags.js</p><div class="language-javascript line-numbers-mode" data-ext="js"><pre class="language-javascript"><code><span class="token comment">// Don&#39;t change these two values. They&#39;re used by React Dev Tools.</span>
<span class="token keyword">export</span> <span class="token keyword">const</span> NoFlags <span class="token operator">=</span> <span class="token comment">/*                      */</span> <span class="token number">0b00000000000000000000000000</span><span class="token punctuation">;</span>
<span class="token keyword">export</span> <span class="token keyword">const</span> PerformedWork <span class="token operator">=</span> <span class="token comment">/*                */</span> <span class="token number">0b00000000000000000000000001</span><span class="token punctuation">;</span>

<span class="token comment">// You can change the rest (and add more).</span>
<span class="token comment">// Placement 插入</span>
<span class="token keyword">export</span> <span class="token keyword">const</span> Placement <span class="token operator">=</span> <span class="token comment">/*                    */</span> <span class="token number">0b00000000000000000000000010</span><span class="token punctuation">;</span>
<span class="token comment">// Update 更新</span>
<span class="token keyword">export</span> <span class="token keyword">const</span> Update <span class="token operator">=</span> <span class="token comment">/*                       */</span> <span class="token number">0b00000000000000000000000100</span><span class="token punctuation">;</span>
<span class="token keyword">export</span> <span class="token keyword">const</span> ChildDeletion <span class="token operator">=</span> <span class="token comment">/*                     */</span> <span class="token number">0b00000000000000000000001000</span><span class="token punctuation">;</span>

<span class="token keyword">export</span> <span class="token keyword">const</span> MutationMask <span class="token operator">=</span> Placement <span class="token operator">|</span> Update<span class="token punctuation">;</span>
<span class="token comment">// 如果函数组件里使用了useEffect，那么此函数组件对应的fiber上会有一个flags，为Passive</span>
<span class="token keyword">export</span> <span class="token keyword">const</span> Passive <span class="token operator">=</span> <span class="token comment">/*                      */</span> <span class="token number">0b00000000000000010000000000</span><span class="token punctuation">;</span> <span class="token comment">// 1024</span>
<span class="token keyword">export</span> <span class="token keyword">const</span> LayoutMask <span class="token operator">=</span> <span class="token comment">/*                      */</span> Update<span class="token punctuation">;</span> <span class="token comment">// 4</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="reactfiberhooks-js-1" tabindex="-1"><a class="header-anchor" href="#reactfiberhooks-js-1" aria-hidden="true">#</a> ReactFiberHooks.js</h3><p>src\\react-reconciler\\src\\ReactFiberHooks.js</p><div class="language-javascript line-numbers-mode" data-ext="js"><pre class="language-javascript"><code><span class="token keyword">import</span> <span class="token punctuation">{</span>
  Passive <span class="token keyword">as</span> PassiveEffect<span class="token punctuation">,</span>
  Update <span class="token keyword">as</span> UpdateEffect<span class="token punctuation">,</span>
<span class="token punctuation">}</span> <span class="token keyword">from</span> <span class="token string">&quot;./ReactFiberFlags&quot;</span><span class="token punctuation">;</span>
<span class="token keyword">import</span> <span class="token punctuation">{</span>
  HasEffect <span class="token keyword">as</span> HookHasEffect<span class="token punctuation">,</span>
  Passive <span class="token keyword">as</span> HookPassive<span class="token punctuation">,</span>
  Layout <span class="token keyword">as</span> HookLayout<span class="token punctuation">,</span>
<span class="token punctuation">}</span> <span class="token keyword">from</span> <span class="token string">&quot;./ReactHookEffectTags&quot;</span><span class="token punctuation">;</span>

<span class="token keyword">const</span> HooksDispatcherOnMountInDEV <span class="token operator">=</span> <span class="token punctuation">{</span>
  <span class="token literal-property property">useReducer</span><span class="token operator">:</span> mountReducer<span class="token punctuation">,</span>
  <span class="token literal-property property">useState</span><span class="token operator">:</span> mountState<span class="token punctuation">,</span>
  <span class="token literal-property property">useEffect</span><span class="token operator">:</span> mountEffect<span class="token punctuation">,</span>
  <span class="token literal-property property">useLayoutEffect</span><span class="token operator">:</span> mountLayoutEffect<span class="token punctuation">,</span>
<span class="token punctuation">}</span><span class="token punctuation">;</span>

<span class="token keyword">function</span> <span class="token function">mountLayoutEffect</span><span class="token punctuation">(</span><span class="token parameter">create<span class="token punctuation">,</span> deps</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
  <span class="token keyword">return</span> <span class="token function">mountEffectImpl</span><span class="token punctuation">(</span>UpdateEffect<span class="token punctuation">,</span> HookLayout<span class="token punctuation">,</span> create<span class="token punctuation">,</span> deps<span class="token punctuation">)</span><span class="token punctuation">;</span>
<span class="token punctuation">}</span>

<span class="token keyword">function</span> <span class="token function">updateLayoutEffect</span><span class="token punctuation">(</span><span class="token parameter">create<span class="token punctuation">,</span> deps</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
  <span class="token keyword">return</span> <span class="token function">updateEffectImpl</span><span class="token punctuation">(</span>UpdateEffect<span class="token punctuation">,</span> HookLayout<span class="token punctuation">,</span> create<span class="token punctuation">,</span> deps<span class="token punctuation">)</span><span class="token punctuation">;</span>
<span class="token punctuation">}</span>

<span class="token keyword">const</span> HooksDispatcherOnUpdateInDEV <span class="token operator">=</span> <span class="token punctuation">{</span>
  <span class="token literal-property property">useReducer</span><span class="token operator">:</span> updateReducer<span class="token punctuation">,</span>
  <span class="token literal-property property">useState</span><span class="token operator">:</span> updateState<span class="token punctuation">,</span>
  <span class="token literal-property property">useEffect</span><span class="token operator">:</span> updateEffect<span class="token punctuation">,</span>
  <span class="token literal-property property">useLayoutEffect</span><span class="token operator">:</span> updateLayoutEffect<span class="token punctuation">,</span>
<span class="token punctuation">}</span><span class="token punctuation">;</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="reactfiberworkloop-js-1" tabindex="-1"><a class="header-anchor" href="#reactfiberworkloop-js-1" aria-hidden="true">#</a> ReactFiberWorkLoop.js</h3><p>src\\react-reconciler\\src\\ReactFiberWorkLoop.js</p><div class="language-javascript line-numbers-mode" data-ext="js"><pre class="language-javascript"><code><span class="token keyword">import</span> <span class="token punctuation">{</span>
  commitMutationEffectsOnFiber<span class="token punctuation">,</span>
  commitPassiveUnmountEffects<span class="token punctuation">,</span>
  commitPassiveMountEffects<span class="token punctuation">,</span>
  commitLayoutEffects<span class="token punctuation">,</span>
<span class="token punctuation">}</span> <span class="token keyword">from</span> <span class="token string">&quot;./ReactFiberCommitWork&quot;</span><span class="token punctuation">;</span>

<span class="token keyword">function</span> <span class="token function">commitRoot</span><span class="token punctuation">(</span><span class="token parameter">root</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
  <span class="token keyword">const</span> <span class="token punctuation">{</span> finishedWork <span class="token punctuation">}</span> <span class="token operator">=</span> root<span class="token punctuation">;</span>
  <span class="token comment">// printFinishedWork(finishedWork);</span>
  <span class="token keyword">if</span> <span class="token punctuation">(</span>
    <span class="token punctuation">(</span>finishedWork<span class="token punctuation">.</span>subtreeFlags <span class="token operator">&amp;</span> Passive<span class="token punctuation">)</span> <span class="token operator">!==</span> NoFlags <span class="token operator">||</span>
    <span class="token punctuation">(</span>finishedWork<span class="token punctuation">.</span>flags <span class="token operator">&amp;</span> Passive<span class="token punctuation">)</span> <span class="token operator">!==</span> NoFlags
  <span class="token punctuation">)</span> <span class="token punctuation">{</span>
    <span class="token keyword">if</span> <span class="token punctuation">(</span><span class="token operator">!</span>rootDoesHavePassiveEffect<span class="token punctuation">)</span> <span class="token punctuation">{</span>
      rootDoesHavePassiveEffect <span class="token operator">=</span> <span class="token boolean">true</span><span class="token punctuation">;</span>
      <span class="token function">scheduleCallback</span><span class="token punctuation">(</span>flushPassiveEffect<span class="token punctuation">)</span><span class="token punctuation">;</span>
    <span class="token punctuation">}</span>
  <span class="token punctuation">}</span>
  console<span class="token punctuation">.</span><span class="token function">log</span><span class="token punctuation">(</span><span class="token string">&quot;~~~~~~~~~~~~~~~~~~~&quot;</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
  <span class="token keyword">const</span> subtreeHasEffects <span class="token operator">=</span>
    <span class="token punctuation">(</span>finishedWork<span class="token punctuation">.</span>subtreeFlags <span class="token operator">&amp;&amp;</span> MutationMask<span class="token punctuation">)</span> <span class="token operator">!==</span> NoFlags<span class="token punctuation">;</span>
  <span class="token keyword">const</span> rootHasEffect <span class="token operator">=</span> <span class="token punctuation">(</span>finishedWork<span class="token punctuation">.</span>flags <span class="token operator">&amp;&amp;</span> MutationMask<span class="token punctuation">)</span> <span class="token operator">!==</span> NoFlags<span class="token punctuation">;</span>
  <span class="token keyword">if</span> <span class="token punctuation">(</span>subtreeHasEffects <span class="token operator">||</span> rootHasEffect<span class="token punctuation">)</span> <span class="token punctuation">{</span>
    <span class="token comment">// 当DOM执行变更之后</span>
    <span class="token function">commitMutationEffectsOnFiber</span><span class="token punctuation">(</span>finishedWork<span class="token punctuation">,</span> root<span class="token punctuation">)</span><span class="token punctuation">;</span>
    <span class="token comment">// !!! UI渲染之前：同步执行layoutEffect</span>
    <span class="token function">commitLayoutEffects</span><span class="token punctuation">(</span>finishedWork<span class="token punctuation">,</span> root<span class="token punctuation">)</span><span class="token punctuation">;</span>
    <span class="token keyword">if</span> <span class="token punctuation">(</span>rootDoesHavePassiveEffect<span class="token punctuation">)</span> <span class="token punctuation">{</span>
      rootDoesHavePassiveEffect <span class="token operator">=</span> <span class="token boolean">false</span><span class="token punctuation">;</span>
      rootWithPendingPassiveEffects <span class="token operator">=</span> root<span class="token punctuation">;</span>
    <span class="token punctuation">}</span>
  <span class="token punctuation">}</span>
  <span class="token comment">// 等DOM变更后，就可以把root的current指向新Fiber树</span>
  root<span class="token punctuation">.</span>current <span class="token operator">=</span> finishedWork<span class="token punctuation">;</span>
<span class="token punctuation">}</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="reactfibercommitwork-js-1" tabindex="-1"><a class="header-anchor" href="#reactfibercommitwork-js-1" aria-hidden="true">#</a> ReactFiberCommitWork.js</h3><p>src\\react-reconciler\\src\\ReactFiberCommitWork.js</p><div class="language-javascript line-numbers-mode" data-ext="js"><pre class="language-javascript"><code><span class="token keyword">import</span> <span class="token punctuation">{</span>
  appendChild<span class="token punctuation">,</span>
  insertBefore<span class="token punctuation">,</span>
  commitUpdate<span class="token punctuation">,</span>
  removeChild<span class="token punctuation">,</span>
<span class="token punctuation">}</span> <span class="token keyword">from</span> <span class="token string">&quot;react-dom/src/client/ReactDOMHostConfig&quot;</span><span class="token punctuation">;</span>
<span class="token keyword">import</span> <span class="token punctuation">{</span>
  FunctionComponent<span class="token punctuation">,</span>
  HostComponent<span class="token punctuation">,</span>
  HostRoot<span class="token punctuation">,</span>
  HostText<span class="token punctuation">,</span>
<span class="token punctuation">}</span> <span class="token keyword">from</span> <span class="token string">&quot;react-reconciler/src/ReactWorkTags&quot;</span><span class="token punctuation">;</span>
<span class="token keyword">import</span> <span class="token punctuation">{</span>
  MutationMask<span class="token punctuation">,</span>
  Passive<span class="token punctuation">,</span>
  Placement<span class="token punctuation">,</span>
  Update<span class="token punctuation">,</span>
  LayoutMask<span class="token punctuation">,</span>
<span class="token punctuation">}</span> <span class="token keyword">from</span> <span class="token string">&quot;react-reconciler/src/ReactFiberFlags&quot;</span><span class="token punctuation">;</span>
<span class="token keyword">import</span> <span class="token punctuation">{</span>
  Passive <span class="token keyword">as</span> HookPassive<span class="token punctuation">,</span>
  HasEffect <span class="token keyword">as</span> HookHasEffect<span class="token punctuation">,</span>
  Layout <span class="token keyword">as</span> HookLayout<span class="token punctuation">,</span>
<span class="token punctuation">}</span> <span class="token keyword">from</span> <span class="token string">&quot;./ReactHookEffectTags&quot;</span><span class="token punctuation">;</span>

<span class="token keyword">let</span> hostParent <span class="token operator">=</span> <span class="token keyword">null</span><span class="token punctuation">;</span>

<span class="token doc-comment comment">/**
 * 提交删除副作用
 * <span class="token keyword">@param</span> <span class="token parameter">root</span> 根节点
 * <span class="token keyword">@param</span> <span class="token parameter">returnFiber</span> 父fiber
 * <span class="token keyword">@param</span> <span class="token parameter">deletedFiber</span> 删除的fiber
 */</span>
<span class="token keyword">function</span> <span class="token function">commitDeletionEffects</span><span class="token punctuation">(</span><span class="token parameter">root<span class="token punctuation">,</span> returnFiber<span class="token punctuation">,</span> deletedFiber</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
  <span class="token keyword">let</span> parent <span class="token operator">=</span> returnFiber<span class="token punctuation">;</span>
  <span class="token comment">// 一直向上查找直到找到真实DOM节点为止</span>
  <span class="token literal-property property">findParent</span><span class="token operator">:</span> <span class="token keyword">while</span> <span class="token punctuation">(</span>parent <span class="token operator">!==</span> <span class="token keyword">null</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
    <span class="token keyword">switch</span> <span class="token punctuation">(</span>parent<span class="token punctuation">.</span>tag<span class="token punctuation">)</span> <span class="token punctuation">{</span>
      <span class="token keyword">case</span> <span class="token literal-property property">HostComponent</span><span class="token operator">:</span> <span class="token punctuation">{</span>
        hostParent <span class="token operator">=</span> parent<span class="token punctuation">.</span>stateNode<span class="token punctuation">;</span>
        <span class="token keyword">break</span> findParent<span class="token punctuation">;</span>
      <span class="token punctuation">}</span>
      <span class="token keyword">case</span> <span class="token literal-property property">HostRoot</span><span class="token operator">:</span> <span class="token punctuation">{</span>
        hostParent <span class="token operator">=</span> parent<span class="token punctuation">.</span>stateNode<span class="token punctuation">.</span>containerInfo<span class="token punctuation">;</span>
        <span class="token keyword">break</span> findParent<span class="token punctuation">;</span>
      <span class="token punctuation">}</span>
    <span class="token punctuation">}</span>
    parent <span class="token operator">=</span> parent<span class="token punctuation">.</span>return<span class="token punctuation">;</span>
  <span class="token punctuation">}</span>
  <span class="token function">commitDeletionEffectsOnFiber</span><span class="token punctuation">(</span>root<span class="token punctuation">,</span> returnFiber<span class="token punctuation">,</span> deletedFiber<span class="token punctuation">)</span><span class="token punctuation">;</span>
  hostParent <span class="token operator">=</span> <span class="token keyword">null</span><span class="token punctuation">;</span>
<span class="token punctuation">}</span>

<span class="token keyword">function</span> <span class="token function">commitDeletionEffectsOnFiber</span><span class="token punctuation">(</span>
  <span class="token parameter">finishedRoot<span class="token punctuation">,</span>
  nearestMountedAncestor<span class="token punctuation">,</span>
  deletedFiber</span>
<span class="token punctuation">)</span> <span class="token punctuation">{</span>
  <span class="token keyword">switch</span> <span class="token punctuation">(</span>deletedFiber<span class="token punctuation">.</span>tag<span class="token punctuation">)</span> <span class="token punctuation">{</span>
    <span class="token keyword">case</span> <span class="token literal-property property">HostComponent</span><span class="token operator">:</span>
    <span class="token keyword">case</span> <span class="token literal-property property">HostText</span><span class="token operator">:</span> <span class="token punctuation">{</span>
      <span class="token comment">// 递归处理子节点，当要删除一个节点的时候，要先删除它的子节点 不直接删除自己</span>
      <span class="token function">recursivelyTraverseDeletionEffects</span><span class="token punctuation">(</span>
        finishedRoot<span class="token punctuation">,</span>
        nearestMountedAncestor<span class="token punctuation">,</span>
        deletedFiber
      <span class="token punctuation">)</span><span class="token punctuation">;</span>
      <span class="token comment">// 再把自己删除</span>
      <span class="token keyword">if</span> <span class="token punctuation">(</span>hostParent <span class="token operator">!==</span> <span class="token keyword">null</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
        <span class="token function">removeChild</span><span class="token punctuation">(</span>hostParent<span class="token punctuation">,</span> deletedFiber<span class="token punctuation">.</span>stateNode<span class="token punctuation">)</span><span class="token punctuation">;</span>
      <span class="token punctuation">}</span>
      <span class="token keyword">break</span><span class="token punctuation">;</span>
    <span class="token punctuation">}</span>
    <span class="token keyword">default</span><span class="token operator">:</span>
      <span class="token keyword">break</span><span class="token punctuation">;</span>
  <span class="token punctuation">}</span>
<span class="token punctuation">}</span>

<span class="token keyword">function</span> <span class="token function">recursivelyTraverseDeletionEffects</span><span class="token punctuation">(</span>
  <span class="token parameter">finishedRoot<span class="token punctuation">,</span>
  nearestMountedAncestor<span class="token punctuation">,</span>
  parent</span>
<span class="token punctuation">)</span> <span class="token punctuation">{</span>
  <span class="token keyword">let</span> child <span class="token operator">=</span> parent<span class="token punctuation">.</span>child<span class="token punctuation">;</span>
  <span class="token keyword">while</span> <span class="token punctuation">(</span>child <span class="token operator">!==</span> <span class="token keyword">null</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
    <span class="token function">commitDeletionEffectsOnFiber</span><span class="token punctuation">(</span>finishedRoot<span class="token punctuation">,</span> nearestMountedAncestor<span class="token punctuation">,</span> child<span class="token punctuation">)</span><span class="token punctuation">;</span>
    child <span class="token operator">=</span> child<span class="token punctuation">.</span>sibling<span class="token punctuation">;</span>
  <span class="token punctuation">}</span>
<span class="token punctuation">}</span>

<span class="token doc-comment comment">/**
 * 递归遍历处理变更的副作用
 * <span class="token keyword">@param</span> <span class="token parameter">root</span> 根节点
 * <span class="token keyword">@param</span> <span class="token parameter">parentFiber</span> 父Fiber
 */</span>
<span class="token keyword">function</span> <span class="token function">recursivelyTraverseMutationEffects</span><span class="token punctuation">(</span><span class="token parameter">root<span class="token punctuation">,</span> parentFiber</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
  <span class="token comment">// 先把父Fiber上该删除的节点都删除</span>
  <span class="token keyword">const</span> deletions <span class="token operator">=</span> parentFiber<span class="token punctuation">.</span>deletions<span class="token punctuation">;</span>
  <span class="token keyword">if</span> <span class="token punctuation">(</span>deletions <span class="token operator">!==</span> <span class="token keyword">null</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
    <span class="token keyword">for</span> <span class="token punctuation">(</span><span class="token keyword">let</span> i <span class="token operator">=</span> <span class="token number">0</span><span class="token punctuation">;</span> i <span class="token operator">&lt;</span> deletions<span class="token punctuation">.</span>length<span class="token punctuation">;</span> i<span class="token operator">++</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
      <span class="token keyword">const</span> childToDelete <span class="token operator">=</span> deletions<span class="token punctuation">[</span>i<span class="token punctuation">]</span><span class="token punctuation">;</span>
      <span class="token function">commitDeletionEffects</span><span class="token punctuation">(</span>root<span class="token punctuation">,</span> parentFiber<span class="token punctuation">,</span> childToDelete<span class="token punctuation">)</span><span class="token punctuation">;</span>
    <span class="token punctuation">}</span>
  <span class="token punctuation">}</span>
  <span class="token comment">// 再去处理剩下的子节点</span>
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
    <span class="token keyword">case</span> <span class="token literal-property property">HostRoot</span><span class="token operator">:</span>
    <span class="token keyword">case</span> <span class="token literal-property property">FunctionComponent</span><span class="token operator">:</span>
    <span class="token keyword">case</span> <span class="token literal-property property">HostText</span><span class="token operator">:</span> <span class="token punctuation">{</span>
      <span class="token comment">// 遍历子节点，处理子节点上的副作用</span>
      <span class="token function">recursivelyTraverseMutationEffects</span><span class="token punctuation">(</span>root<span class="token punctuation">,</span> finishedWork<span class="token punctuation">)</span><span class="token punctuation">;</span>
      <span class="token comment">// 再处理自己身上的副作用</span>
      <span class="token function">commitReconciliationEffects</span><span class="token punctuation">(</span>finishedWork<span class="token punctuation">)</span><span class="token punctuation">;</span>
      <span class="token keyword">if</span> <span class="token punctuation">(</span>flags <span class="token operator">&amp;</span> Update<span class="token punctuation">)</span> <span class="token punctuation">{</span>
        <span class="token function">commitHookEffectListUnmount</span><span class="token punctuation">(</span>HookHasEffect <span class="token operator">|</span> HookLayout<span class="token punctuation">,</span> finishedWork<span class="token punctuation">)</span><span class="token punctuation">;</span>
      <span class="token punctuation">}</span>
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
    <span class="token keyword">default</span><span class="token operator">:</span>
      <span class="token keyword">break</span><span class="token punctuation">;</span>
  <span class="token punctuation">}</span>
<span class="token punctuation">}</span>

<span class="token keyword">export</span> <span class="token keyword">function</span> <span class="token function">commitPassiveUnmountEffects</span><span class="token punctuation">(</span><span class="token parameter">finishedWork</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
  <span class="token function">commitPassiveUnmountOnFiber</span><span class="token punctuation">(</span>finishedWork<span class="token punctuation">)</span><span class="token punctuation">;</span>
<span class="token punctuation">}</span>

<span class="token keyword">function</span> <span class="token function">commitPassiveUnmountOnFiber</span><span class="token punctuation">(</span><span class="token parameter">finishedWork</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
  <span class="token keyword">const</span> flags <span class="token operator">=</span> finishedWork<span class="token punctuation">.</span>flags<span class="token punctuation">;</span>
  <span class="token keyword">switch</span> <span class="token punctuation">(</span>finishedWork<span class="token punctuation">.</span>tag<span class="token punctuation">)</span> <span class="token punctuation">{</span>
    <span class="token keyword">case</span> <span class="token literal-property property">HostRoot</span><span class="token operator">:</span> <span class="token punctuation">{</span>
      <span class="token function">recursivelyTraversePassiveUnmountEffects</span><span class="token punctuation">(</span>finishedWork<span class="token punctuation">)</span><span class="token punctuation">;</span>
      <span class="token keyword">break</span><span class="token punctuation">;</span>
    <span class="token punctuation">}</span>
    <span class="token keyword">case</span> <span class="token literal-property property">FunctionComponent</span><span class="token operator">:</span> <span class="token punctuation">{</span>
      <span class="token function">recursivelyTraversePassiveUnmountEffects</span><span class="token punctuation">(</span>finishedWork<span class="token punctuation">)</span><span class="token punctuation">;</span>
      <span class="token keyword">if</span> <span class="token punctuation">(</span>flags <span class="token operator">&amp;</span> Passive<span class="token punctuation">)</span> <span class="token punctuation">{</span>
        <span class="token function">commitHookPassiveUnmountEffects</span><span class="token punctuation">(</span>
          finishedWork<span class="token punctuation">,</span>
          HookPassive <span class="token operator">|</span> HookHasEffect
        <span class="token punctuation">)</span><span class="token punctuation">;</span>
      <span class="token punctuation">}</span>
      <span class="token keyword">break</span><span class="token punctuation">;</span>
    <span class="token punctuation">}</span>
  <span class="token punctuation">}</span>
<span class="token punctuation">}</span>

<span class="token keyword">function</span> <span class="token function">recursivelyTraversePassiveUnmountEffects</span><span class="token punctuation">(</span><span class="token parameter">parentFiber</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
  <span class="token keyword">if</span> <span class="token punctuation">(</span>parentFiber<span class="token punctuation">.</span>subtreeFlags <span class="token operator">&amp;</span> Passive<span class="token punctuation">)</span> <span class="token punctuation">{</span>
    <span class="token keyword">let</span> child <span class="token operator">=</span> parentFiber<span class="token punctuation">.</span>child<span class="token punctuation">;</span>
    <span class="token keyword">while</span> <span class="token punctuation">(</span>child <span class="token operator">!==</span> <span class="token keyword">null</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
      <span class="token function">commitPassiveUnmountOnFiber</span><span class="token punctuation">(</span>child<span class="token punctuation">)</span><span class="token punctuation">;</span>
      child <span class="token operator">=</span> child<span class="token punctuation">.</span>sibling<span class="token punctuation">;</span>
    <span class="token punctuation">}</span>
  <span class="token punctuation">}</span>
<span class="token punctuation">}</span>

<span class="token keyword">function</span> <span class="token function">commitHookPassiveUnmountEffects</span><span class="token punctuation">(</span><span class="token parameter">finishedWork<span class="token punctuation">,</span> hookFlags</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
  <span class="token function">commitHookEffectListUnmount</span><span class="token punctuation">(</span>hookFlags<span class="token punctuation">,</span> finishedWork<span class="token punctuation">)</span><span class="token punctuation">;</span>
<span class="token punctuation">}</span>

<span class="token keyword">function</span> <span class="token function">commitHookEffectListUnmount</span><span class="token punctuation">(</span><span class="token parameter">flags<span class="token punctuation">,</span> finishedWork</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
  <span class="token keyword">const</span> updateQueue <span class="token operator">=</span> finishedWork<span class="token punctuation">.</span>updateQueue<span class="token punctuation">;</span>
  <span class="token keyword">const</span> lastEffect <span class="token operator">=</span> updateQueue <span class="token operator">!==</span> <span class="token keyword">null</span> <span class="token operator">?</span> updateQueue<span class="token punctuation">.</span>lastEffect <span class="token operator">:</span> <span class="token keyword">null</span><span class="token punctuation">;</span>
  <span class="token keyword">if</span> <span class="token punctuation">(</span>lastEffect <span class="token operator">!==</span> <span class="token keyword">null</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
    <span class="token keyword">const</span> firstEffect <span class="token operator">=</span> lastEffect<span class="token punctuation">.</span>next<span class="token punctuation">;</span>
    <span class="token keyword">let</span> effect <span class="token operator">=</span> firstEffect<span class="token punctuation">;</span>
    <span class="token keyword">do</span> <span class="token punctuation">{</span>
      <span class="token keyword">if</span> <span class="token punctuation">(</span><span class="token punctuation">(</span>effect<span class="token punctuation">.</span>tag <span class="token operator">&amp;</span> flags<span class="token punctuation">)</span> <span class="token operator">===</span> flags<span class="token punctuation">)</span> <span class="token punctuation">{</span>
        <span class="token keyword">const</span> destroy <span class="token operator">=</span> effect<span class="token punctuation">.</span>destroy<span class="token punctuation">;</span>
        <span class="token keyword">if</span> <span class="token punctuation">(</span>destroy <span class="token operator">!==</span> <span class="token keyword">undefined</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
          <span class="token function">destroy</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
        <span class="token punctuation">}</span>
      <span class="token punctuation">}</span>
      effect <span class="token operator">=</span> effect<span class="token punctuation">.</span>next<span class="token punctuation">;</span>
    <span class="token punctuation">}</span> <span class="token keyword">while</span> <span class="token punctuation">(</span>effect <span class="token operator">!==</span> firstEffect<span class="token punctuation">)</span><span class="token punctuation">;</span>
  <span class="token punctuation">}</span>
<span class="token punctuation">}</span>

<span class="token keyword">export</span> <span class="token keyword">function</span> <span class="token function">commitPassiveMountEffects</span><span class="token punctuation">(</span><span class="token parameter">root<span class="token punctuation">,</span> finishedWork</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
  <span class="token function">commitPassiveMountOnFiber</span><span class="token punctuation">(</span>root<span class="token punctuation">,</span> finishedWork<span class="token punctuation">)</span><span class="token punctuation">;</span>
<span class="token punctuation">}</span>

<span class="token keyword">function</span> <span class="token function">commitPassiveMountOnFiber</span><span class="token punctuation">(</span><span class="token parameter">finishedRoot<span class="token punctuation">,</span> finishedWork</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
  <span class="token keyword">const</span> flags <span class="token operator">=</span> finishedWork<span class="token punctuation">.</span>flags<span class="token punctuation">;</span>
  <span class="token keyword">switch</span> <span class="token punctuation">(</span>finishedWork<span class="token punctuation">.</span>tag<span class="token punctuation">)</span> <span class="token punctuation">{</span>
    <span class="token keyword">case</span> <span class="token literal-property property">HostRoot</span><span class="token operator">:</span> <span class="token punctuation">{</span>
      <span class="token function">recursivelyTraversePassiveMountEffects</span><span class="token punctuation">(</span>finishedRoot<span class="token punctuation">,</span> finishedWork<span class="token punctuation">)</span><span class="token punctuation">;</span>
      <span class="token keyword">break</span><span class="token punctuation">;</span>
    <span class="token punctuation">}</span>
    <span class="token keyword">case</span> <span class="token literal-property property">FunctionComponent</span><span class="token operator">:</span> <span class="token punctuation">{</span>
      <span class="token function">recursivelyTraversePassiveMountEffects</span><span class="token punctuation">(</span>finishedRoot<span class="token punctuation">,</span> finishedWork<span class="token punctuation">)</span><span class="token punctuation">;</span>
      <span class="token keyword">if</span> <span class="token punctuation">(</span>flags <span class="token operator">&amp;</span> Passive<span class="token punctuation">)</span> <span class="token punctuation">{</span>
        <span class="token function">commitHookPassiveMountEffects</span><span class="token punctuation">(</span>
          finishedWork<span class="token punctuation">,</span>
          HookPassive <span class="token operator">|</span> HookHasEffect
        <span class="token punctuation">)</span><span class="token punctuation">;</span>
      <span class="token punctuation">}</span>
      <span class="token keyword">break</span><span class="token punctuation">;</span>
    <span class="token punctuation">}</span>
  <span class="token punctuation">}</span>
<span class="token punctuation">}</span>

<span class="token keyword">function</span> <span class="token function">recursivelyTraversePassiveMountEffects</span><span class="token punctuation">(</span><span class="token parameter">root<span class="token punctuation">,</span> parentFiber</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
  <span class="token keyword">if</span> <span class="token punctuation">(</span>parentFiber<span class="token punctuation">.</span>subtreeFlags <span class="token operator">&amp;</span> Passive<span class="token punctuation">)</span> <span class="token punctuation">{</span>
    <span class="token keyword">let</span> child <span class="token operator">=</span> parentFiber<span class="token punctuation">.</span>child<span class="token punctuation">;</span>
    <span class="token keyword">while</span> <span class="token punctuation">(</span>child <span class="token operator">!==</span> <span class="token keyword">null</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
      <span class="token function">commitPassiveMountOnFiber</span><span class="token punctuation">(</span>root<span class="token punctuation">,</span> child<span class="token punctuation">)</span><span class="token punctuation">;</span>
      child <span class="token operator">=</span> child<span class="token punctuation">.</span>sibling<span class="token punctuation">;</span>
    <span class="token punctuation">}</span>
  <span class="token punctuation">}</span>
<span class="token punctuation">}</span>

<span class="token keyword">function</span> <span class="token function">commitHookPassiveMountEffects</span><span class="token punctuation">(</span><span class="token parameter">finishedWork<span class="token punctuation">,</span> hookFlags</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
  <span class="token function">commitHookEffectListMount</span><span class="token punctuation">(</span>hookFlags<span class="token punctuation">,</span> finishedWork<span class="token punctuation">)</span><span class="token punctuation">;</span>
<span class="token punctuation">}</span>

<span class="token keyword">function</span> <span class="token function">commitHookEffectListMount</span><span class="token punctuation">(</span><span class="token parameter">flags<span class="token punctuation">,</span> finishedWork</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
  <span class="token keyword">const</span> updateQueue <span class="token operator">=</span> finishedWork<span class="token punctuation">.</span>updateQueue<span class="token punctuation">;</span>
  <span class="token keyword">const</span> lastEffect <span class="token operator">=</span> updateQueue <span class="token operator">!==</span> <span class="token keyword">null</span> <span class="token operator">?</span> updateQueue<span class="token punctuation">.</span>lastEffect <span class="token operator">:</span> <span class="token keyword">null</span><span class="token punctuation">;</span>
  <span class="token keyword">if</span> <span class="token punctuation">(</span>lastEffect <span class="token operator">!==</span> <span class="token keyword">null</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
    <span class="token keyword">const</span> firstEffect <span class="token operator">=</span> lastEffect<span class="token punctuation">.</span>next<span class="token punctuation">;</span>
    <span class="token keyword">let</span> effect <span class="token operator">=</span> firstEffect<span class="token punctuation">;</span>
    <span class="token keyword">do</span> <span class="token punctuation">{</span>
      <span class="token keyword">if</span> <span class="token punctuation">(</span><span class="token punctuation">(</span>effect<span class="token punctuation">.</span>tag <span class="token operator">&amp;</span> flags<span class="token punctuation">)</span> <span class="token operator">===</span> flags<span class="token punctuation">)</span> <span class="token punctuation">{</span>
        <span class="token keyword">const</span> create <span class="token operator">=</span> effect<span class="token punctuation">.</span>create<span class="token punctuation">;</span>
        effect<span class="token punctuation">.</span>destroy <span class="token operator">=</span> <span class="token function">create</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
      <span class="token punctuation">}</span>
      effect <span class="token operator">=</span> effect<span class="token punctuation">.</span>next<span class="token punctuation">;</span>
    <span class="token punctuation">}</span> <span class="token keyword">while</span> <span class="token punctuation">(</span>effect <span class="token operator">!==</span> firstEffect<span class="token punctuation">)</span><span class="token punctuation">;</span>
  <span class="token punctuation">}</span>
<span class="token punctuation">}</span>

<span class="token keyword">export</span> <span class="token keyword">function</span> <span class="token function">commitLayoutEffects</span><span class="token punctuation">(</span><span class="token parameter">finishedWork<span class="token punctuation">,</span> root</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
  <span class="token comment">// 老的根fiber</span>
  <span class="token keyword">const</span> current <span class="token operator">=</span> finishedWork<span class="token punctuation">.</span>alternate<span class="token punctuation">;</span>
  <span class="token function">commitLayoutEffectOnFiber</span><span class="token punctuation">(</span>root<span class="token punctuation">,</span> current<span class="token punctuation">,</span> finishedWork<span class="token punctuation">)</span><span class="token punctuation">;</span>
<span class="token punctuation">}</span>

<span class="token keyword">function</span> <span class="token function">commitLayoutEffectOnFiber</span><span class="token punctuation">(</span><span class="token parameter">finishedRoot<span class="token punctuation">,</span> current<span class="token punctuation">,</span> finishedWork</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
  <span class="token keyword">const</span> flags <span class="token operator">=</span> finishedWork<span class="token punctuation">.</span>flags<span class="token punctuation">;</span>
  <span class="token keyword">switch</span> <span class="token punctuation">(</span>finishedWork<span class="token punctuation">.</span>tag<span class="token punctuation">)</span> <span class="token punctuation">{</span>
    <span class="token keyword">case</span> <span class="token literal-property property">HostRoot</span><span class="token operator">:</span> <span class="token punctuation">{</span>
      <span class="token function">recursivelyTraverseLayoutEffects</span><span class="token punctuation">(</span>finishedRoot<span class="token punctuation">,</span> finishedWork<span class="token punctuation">)</span><span class="token punctuation">;</span>
      <span class="token keyword">break</span><span class="token punctuation">;</span>
    <span class="token punctuation">}</span>
    <span class="token keyword">case</span> <span class="token literal-property property">FunctionComponent</span><span class="token operator">:</span> <span class="token punctuation">{</span>
      <span class="token function">recursivelyTraverseLayoutEffects</span><span class="token punctuation">(</span>finishedRoot<span class="token punctuation">,</span> finishedWork<span class="token punctuation">)</span><span class="token punctuation">;</span>
      <span class="token keyword">if</span> <span class="token punctuation">(</span>flags <span class="token operator">&amp;</span> LayoutMask<span class="token punctuation">)</span> <span class="token punctuation">{</span>
        <span class="token comment">// 4 LayoutMask = Update = 4</span>
        <span class="token function">commitHookLayoutEffects</span><span class="token punctuation">(</span>finishedWork<span class="token punctuation">,</span> HookLayout <span class="token operator">|</span> HookHasEffect<span class="token punctuation">)</span><span class="token punctuation">;</span>
      <span class="token punctuation">}</span>
      <span class="token keyword">break</span><span class="token punctuation">;</span>
    <span class="token punctuation">}</span>
  <span class="token punctuation">}</span>
<span class="token punctuation">}</span>

<span class="token keyword">function</span> <span class="token function">recursivelyTraverseLayoutEffects</span><span class="token punctuation">(</span><span class="token parameter">root<span class="token punctuation">,</span> parentFiber</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
  <span class="token keyword">if</span> <span class="token punctuation">(</span>parentFiber<span class="token punctuation">.</span>subtreeFlags <span class="token operator">&amp;</span> LayoutMask<span class="token punctuation">)</span> <span class="token punctuation">{</span>
    <span class="token keyword">let</span> child <span class="token operator">=</span> parentFiber<span class="token punctuation">.</span>child<span class="token punctuation">;</span>
    <span class="token keyword">while</span> <span class="token punctuation">(</span>child <span class="token operator">!==</span> <span class="token keyword">null</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
      <span class="token keyword">const</span> current <span class="token operator">=</span> child<span class="token punctuation">.</span>alternate<span class="token punctuation">;</span>
      <span class="token function">commitLayoutEffectOnFiber</span><span class="token punctuation">(</span>root<span class="token punctuation">,</span> current<span class="token punctuation">,</span> child<span class="token punctuation">)</span><span class="token punctuation">;</span>
      child <span class="token operator">=</span> child<span class="token punctuation">.</span>sibling<span class="token punctuation">;</span>
    <span class="token punctuation">}</span>
  <span class="token punctuation">}</span>
<span class="token punctuation">}</span>

<span class="token keyword">function</span> <span class="token function">commitHookLayoutEffects</span><span class="token punctuation">(</span><span class="token parameter">finishedWork<span class="token punctuation">,</span> hookFlags</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
  <span class="token function">commitHookEffectListMount</span><span class="token punctuation">(</span>hookFlags<span class="token punctuation">,</span> finishedWork<span class="token punctuation">)</span><span class="token punctuation">;</span>
<span class="token punctuation">}</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h2 id="手写源码仓库" tabindex="-1"><a class="header-anchor" href="#手写源码仓库" aria-hidden="true">#</a> 手写源码仓库</h2>`,71),r={href:"https://github.com/mi-saka10032/mini-react/tree/master/packages/effect",target:"_blank",rel:"noopener noreferrer"};function k(d,v){const s=t("ExternalLinkIcon");return p(),e("div",null,[u,n("p",null,[n("a",r,[o("https://github.com/mi-saka10032/mini-react/tree/master/packages/effect"),c(s)])])])}const b=a(l,[["render",k],["__file","7-hooksEffect.html.vue"]]);export{b as default};
