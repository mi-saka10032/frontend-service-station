import{_ as p}from"./_plugin-vue_export-helper.cdc0426e.js";import{o as e,c as o,a as n,b as a,e as t,d as c,r as l}from"./app.5f8837b7.js";const i={},u=c(`<p>React 的核心设计之一就是基于虚拟 DOM 的 diff 算法，最大化地降低了 DOM 渲染压力。diff 算法主要分为两类：单节点 diff(SingleDiff)和多节点 diff(MultipleDiff)</p><h2 id="单节点-diff" tabindex="-1"><a class="header-anchor" href="#单节点-diff" aria-hidden="true">#</a> 单节点 Diff</h2><p><img src="https://misaka10032.oss-cn-chengdu.aliyuncs.com/React/dan_jie_dian_diff.png" alt="单节点diff流程图" loading="lazy"></p><p>React 存在单节点的情况，除了单个的原生节点(div、span 等)、文本节点之外，还有我们熟悉的单个类组件、函数组件，这些都属于单节点 diff 的范畴</p><p>现在以单节点 diff 存在的三种情况来分别讲解单节点 diff 策略</p><h3 id="key-不同-type-相同" tabindex="-1"><a class="header-anchor" href="#key-不同-type-相同" aria-hidden="true">#</a> key 不同 type 相同</h3><p>单节点 key 不同，类型相同：删除老节点，添加新节点</p><h4 id="main-jsx" tabindex="-1"><a class="header-anchor" href="#main-jsx" aria-hidden="true">#</a> main.jsx</h4><p>src\\main.jsx</p><div class="language-jsx line-numbers-mode" data-ext="jsx"><pre class="language-jsx"><code><span class="token keyword">import</span> <span class="token operator">*</span> <span class="token keyword">as</span> React <span class="token keyword">from</span> <span class="token string">&quot;react&quot;</span><span class="token punctuation">;</span>
<span class="token keyword">import</span> <span class="token punctuation">{</span> createRoot <span class="token punctuation">}</span> <span class="token keyword">from</span> <span class="token string">&quot;react-dom/client&quot;</span><span class="token punctuation">;</span>

<span class="token keyword">function</span> <span class="token function">FunctionComponent</span><span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
  <span class="token keyword">const</span> <span class="token punctuation">[</span>number<span class="token punctuation">,</span> setNumber<span class="token punctuation">]</span> <span class="token operator">=</span> React<span class="token punctuation">.</span><span class="token function">useState</span><span class="token punctuation">(</span><span class="token number">0</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
  <span class="token keyword">return</span> number <span class="token operator">===</span> <span class="token number">0</span> <span class="token operator">?</span> <span class="token punctuation">(</span>
    <span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span>div</span> <span class="token attr-name">onClick</span><span class="token script language-javascript"><span class="token script-punctuation punctuation">=</span><span class="token punctuation">{</span><span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token operator">=&gt;</span> <span class="token function">setNumber</span><span class="token punctuation">(</span>number <span class="token operator">+</span> <span class="token number">1</span><span class="token punctuation">)</span><span class="token punctuation">}</span></span> <span class="token attr-name">key</span><span class="token attr-value"><span class="token punctuation attr-equals">=</span><span class="token punctuation">&quot;</span>title1<span class="token punctuation">&quot;</span></span> <span class="token attr-name">id</span><span class="token attr-value"><span class="token punctuation attr-equals">=</span><span class="token punctuation">&quot;</span>title<span class="token punctuation">&quot;</span></span><span class="token punctuation">&gt;</span></span><span class="token plain-text">
      title
    </span><span class="token tag"><span class="token tag"><span class="token punctuation">&lt;/</span>div</span><span class="token punctuation">&gt;</span></span>
  <span class="token punctuation">)</span> <span class="token operator">:</span> <span class="token punctuation">(</span>
    <span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span>div</span> <span class="token attr-name">onClick</span><span class="token script language-javascript"><span class="token script-punctuation punctuation">=</span><span class="token punctuation">{</span><span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token operator">=&gt;</span> <span class="token function">setNumber</span><span class="token punctuation">(</span>number <span class="token operator">+</span> <span class="token number">1</span><span class="token punctuation">)</span><span class="token punctuation">}</span></span> <span class="token attr-name">key</span><span class="token attr-value"><span class="token punctuation attr-equals">=</span><span class="token punctuation">&quot;</span>title2<span class="token punctuation">&quot;</span></span> <span class="token attr-name">id</span><span class="token attr-value"><span class="token punctuation attr-equals">=</span><span class="token punctuation">&quot;</span>title2<span class="token punctuation">&quot;</span></span><span class="token punctuation">&gt;</span></span><span class="token plain-text">
      title2
    </span><span class="token tag"><span class="token tag"><span class="token punctuation">&lt;/</span>div</span><span class="token punctuation">&gt;</span></span>
  <span class="token punctuation">)</span><span class="token punctuation">;</span>
<span class="token punctuation">}</span>
<span class="token keyword">let</span> element <span class="token operator">=</span> <span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span><span class="token class-name">FunctionComponent</span></span> <span class="token punctuation">/&gt;</span></span><span class="token punctuation">;</span>
<span class="token keyword">const</span> root <span class="token operator">=</span> <span class="token function">createRoot</span><span class="token punctuation">(</span>document<span class="token punctuation">.</span><span class="token function">getElementById</span><span class="token punctuation">(</span><span class="token string">&quot;root&quot;</span><span class="token punctuation">)</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
root<span class="token punctuation">.</span><span class="token function">render</span><span class="token punctuation">(</span>element<span class="token punctuation">)</span><span class="token punctuation">;</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h4 id="reactfiberflags-js" tabindex="-1"><a class="header-anchor" href="#reactfiberflags-js" aria-hidden="true">#</a> ReactFiberFlags.js</h4><p>src\\react-reconciler\\src\\ReactFiberFlags.js</p><div class="language-javascript line-numbers-mode" data-ext="js"><pre class="language-javascript"><code><span class="token keyword">export</span> <span class="token keyword">const</span> NoFlags <span class="token operator">=</span> <span class="token number">0b00000000000000000000000000</span><span class="token punctuation">;</span>
<span class="token keyword">export</span> <span class="token keyword">const</span> Placement <span class="token operator">=</span> <span class="token number">0b00000000000000000000000010</span><span class="token punctuation">;</span>
<span class="token keyword">export</span> <span class="token keyword">const</span> Update <span class="token operator">=</span> <span class="token number">0b00000000000000000000000100</span><span class="token punctuation">;</span>
<span class="token keyword">export</span> <span class="token keyword">const</span> ChildDeletion <span class="token operator">=</span> <span class="token number">0b00000000000000000000001000</span><span class="token punctuation">;</span>
<span class="token keyword">export</span> <span class="token keyword">const</span> MutationMask <span class="token operator">=</span> Placement <span class="token operator">|</span> Update<span class="token punctuation">;</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h4 id="reactfiber-js" tabindex="-1"><a class="header-anchor" href="#reactfiber-js" aria-hidden="true">#</a> ReactFiber.js</h4><p>src\\react-reconciler\\src\\ReactFiber.js</p><div class="language-javascript line-numbers-mode" data-ext="js"><pre class="language-javascript"><code><span class="token keyword">export</span> <span class="token keyword">function</span> <span class="token function">FiberNode</span><span class="token punctuation">(</span><span class="token parameter">tag<span class="token punctuation">,</span> pendingProps<span class="token punctuation">,</span> key</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
  <span class="token keyword">this</span><span class="token punctuation">.</span>tag <span class="token operator">=</span> tag<span class="token punctuation">;</span>
  <span class="token keyword">this</span><span class="token punctuation">.</span>key <span class="token operator">=</span> key<span class="token punctuation">;</span>
  <span class="token keyword">this</span><span class="token punctuation">.</span>type <span class="token operator">=</span> <span class="token keyword">null</span><span class="token punctuation">;</span>
  <span class="token keyword">this</span><span class="token punctuation">.</span>stateNode <span class="token operator">=</span> <span class="token keyword">null</span><span class="token punctuation">;</span>

  <span class="token keyword">this</span><span class="token punctuation">.</span>return <span class="token operator">=</span> <span class="token keyword">null</span><span class="token punctuation">;</span>
  <span class="token keyword">this</span><span class="token punctuation">.</span>child <span class="token operator">=</span> <span class="token keyword">null</span><span class="token punctuation">;</span>
  <span class="token keyword">this</span><span class="token punctuation">.</span>sibling <span class="token operator">=</span> <span class="token keyword">null</span><span class="token punctuation">;</span>

  <span class="token keyword">this</span><span class="token punctuation">.</span>pendingProps <span class="token operator">=</span> pendingProps<span class="token punctuation">;</span>
  <span class="token keyword">this</span><span class="token punctuation">.</span>memoizedProps <span class="token operator">=</span> <span class="token keyword">null</span><span class="token punctuation">;</span>
  <span class="token keyword">this</span><span class="token punctuation">.</span>updateQueue <span class="token operator">=</span> <span class="token keyword">null</span><span class="token punctuation">;</span>
  <span class="token keyword">this</span><span class="token punctuation">.</span>memoizedState <span class="token operator">=</span> <span class="token keyword">null</span><span class="token punctuation">;</span>

  <span class="token keyword">this</span><span class="token punctuation">.</span>flags <span class="token operator">=</span> NoFlags<span class="token punctuation">;</span>
  <span class="token keyword">this</span><span class="token punctuation">.</span>subtreeFlags <span class="token operator">=</span> NoFlags<span class="token punctuation">;</span>
  <span class="token comment">// 存放将要删除的子Fiber</span>
  <span class="token keyword">this</span><span class="token punctuation">.</span>deletions <span class="token operator">=</span> <span class="token keyword">null</span><span class="token punctuation">;</span>
  <span class="token keyword">this</span><span class="token punctuation">.</span>alternate <span class="token operator">=</span> <span class="token keyword">null</span><span class="token punctuation">;</span>
<span class="token punctuation">}</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h4 id="reactdomhostconfig-js" tabindex="-1"><a class="header-anchor" href="#reactdomhostconfig-js" aria-hidden="true">#</a> ReactDOMHostConfig.js</h4><div class="language-javascript line-numbers-mode" data-ext="js"><pre class="language-javascript"><code><span class="token keyword">export</span> <span class="token keyword">function</span> <span class="token function">removeChild</span><span class="token punctuation">(</span><span class="token parameter">parentInstance<span class="token punctuation">,</span> child</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
  parentInstance<span class="token punctuation">.</span><span class="token function">removeChild</span><span class="token punctuation">(</span>child<span class="token punctuation">)</span><span class="token punctuation">;</span>
<span class="token punctuation">}</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h4 id="reactchildfiber-js" tabindex="-1"><a class="header-anchor" href="#reactchildfiber-js" aria-hidden="true">#</a> ReactChildFiber.js</h4><div class="language-javascript line-numbers-mode" data-ext="js"><pre class="language-javascript"><code><span class="token doc-comment comment">/**
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

  <span class="token comment">// 向fiber上推入需要删除的子节点</span>
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
        <span class="token comment">// key不同，删除老fiber.child</span>
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
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h4 id="reactfibercommitwork-js" tabindex="-1"><a class="header-anchor" href="#reactfibercommitwork-js" aria-hidden="true">#</a> ReactFiberCommitWork.js</h4><p>src\\react-reconciler\\src\\ReactFiberCommitWork.js</p><div class="language-javascript line-numbers-mode" data-ext="js"><pre class="language-javascript"><code><span class="token keyword">import</span> <span class="token punctuation">{</span>
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
  Placement<span class="token punctuation">,</span>
  Update<span class="token punctuation">,</span>
<span class="token punctuation">}</span> <span class="token keyword">from</span> <span class="token string">&quot;react-reconciler/src/ReactFiberFlags&quot;</span><span class="token punctuation">;</span>

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
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="key-相同-type-不同" tabindex="-1"><a class="header-anchor" href="#key-相同-type-不同" aria-hidden="true">#</a> key 相同 type 不同</h3><p>这种情况其实跟 key 不同 type 相同一样，删除老节点添加新节点，对 ReactChildFiber 中的 reconcileSingleElement 方法做补充</p><h4 id="main-jsx-1" tabindex="-1"><a class="header-anchor" href="#main-jsx-1" aria-hidden="true">#</a> main.jsx</h4><p>src\\main.jsx</p><div class="language-jsx line-numbers-mode" data-ext="jsx"><pre class="language-jsx"><code><span class="token keyword">import</span> <span class="token operator">*</span> <span class="token keyword">as</span> React <span class="token keyword">from</span> <span class="token string">&quot;react&quot;</span><span class="token punctuation">;</span>
<span class="token keyword">import</span> <span class="token punctuation">{</span> createRoot <span class="token punctuation">}</span> <span class="token keyword">from</span> <span class="token string">&quot;react-dom/client&quot;</span><span class="token punctuation">;</span>

<span class="token keyword">function</span> <span class="token function">FunctionComponent</span><span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
  <span class="token keyword">const</span> <span class="token punctuation">[</span>number<span class="token punctuation">,</span> setNumber<span class="token punctuation">]</span> <span class="token operator">=</span> React<span class="token punctuation">.</span><span class="token function">useState</span><span class="token punctuation">(</span><span class="token number">0</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
  <span class="token keyword">return</span> number <span class="token operator">===</span> <span class="token number">0</span> <span class="token operator">?</span> <span class="token punctuation">(</span>
    <span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span>div</span> <span class="token attr-name">onClick</span><span class="token script language-javascript"><span class="token script-punctuation punctuation">=</span><span class="token punctuation">{</span><span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token operator">=&gt;</span> <span class="token function">setNumber</span><span class="token punctuation">(</span>number <span class="token operator">+</span> <span class="token number">1</span><span class="token punctuation">)</span><span class="token punctuation">}</span></span> <span class="token attr-name">key</span><span class="token attr-value"><span class="token punctuation attr-equals">=</span><span class="token punctuation">&quot;</span>title1<span class="token punctuation">&quot;</span></span> <span class="token attr-name">id</span><span class="token attr-value"><span class="token punctuation attr-equals">=</span><span class="token punctuation">&quot;</span>title1<span class="token punctuation">&quot;</span></span><span class="token punctuation">&gt;</span></span><span class="token plain-text">
      title1
    </span><span class="token tag"><span class="token tag"><span class="token punctuation">&lt;/</span>div</span><span class="token punctuation">&gt;</span></span>
  <span class="token punctuation">)</span> <span class="token operator">:</span> <span class="token punctuation">(</span>
    <span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span>p</span> <span class="token attr-name">onClick</span><span class="token script language-javascript"><span class="token script-punctuation punctuation">=</span><span class="token punctuation">{</span><span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token operator">=&gt;</span> <span class="token function">setNumber</span><span class="token punctuation">(</span>number <span class="token operator">+</span> <span class="token number">1</span><span class="token punctuation">)</span><span class="token punctuation">}</span></span> <span class="token attr-name">key</span><span class="token attr-value"><span class="token punctuation attr-equals">=</span><span class="token punctuation">&quot;</span>title1<span class="token punctuation">&quot;</span></span> <span class="token attr-name">id</span><span class="token attr-value"><span class="token punctuation attr-equals">=</span><span class="token punctuation">&quot;</span>title1<span class="token punctuation">&quot;</span></span><span class="token punctuation">&gt;</span></span><span class="token plain-text">
      title1
    </span><span class="token tag"><span class="token tag"><span class="token punctuation">&lt;/</span>p</span><span class="token punctuation">&gt;</span></span>
  <span class="token punctuation">)</span><span class="token punctuation">;</span>
<span class="token punctuation">}</span>
<span class="token keyword">let</span> element <span class="token operator">=</span> <span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span><span class="token class-name">FunctionComponent</span></span> <span class="token punctuation">/&gt;</span></span><span class="token punctuation">;</span>
<span class="token keyword">const</span> root <span class="token operator">=</span> <span class="token function">createRoot</span><span class="token punctuation">(</span>document<span class="token punctuation">.</span><span class="token function">getElementById</span><span class="token punctuation">(</span><span class="token string">&quot;root&quot;</span><span class="token punctuation">)</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
root<span class="token punctuation">.</span><span class="token function">render</span><span class="token punctuation">(</span>element<span class="token punctuation">)</span><span class="token punctuation">;</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h4 id="reactchildfiber-js-1" tabindex="-1"><a class="header-anchor" href="#reactchildfiber-js-1" aria-hidden="true">#</a> ReactChildFiber.js</h4><p>src\\react-reconciler\\src\\ReactChildFiber.js</p><div class="language-javascript line-numbers-mode" data-ext="js"><pre class="language-javascript"><code><span class="token doc-comment comment">/**
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

  <span class="token comment">// 删除从currentFirstChild之后的所有fiber节点</span>
  <span class="token keyword">function</span> <span class="token function">deleteRemainingChildren</span><span class="token punctuation">(</span><span class="token parameter">returnFiber<span class="token punctuation">,</span> currentFirstChild</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
    <span class="token keyword">if</span> <span class="token punctuation">(</span><span class="token operator">!</span>shouldTracksSideEffects<span class="token punctuation">)</span> <span class="token punctuation">{</span>
      <span class="token keyword">return</span> <span class="token keyword">null</span><span class="token punctuation">;</span>
    <span class="token punctuation">}</span>
    <span class="token keyword">let</span> childToDelete <span class="token operator">=</span> currentFirstChild<span class="token punctuation">;</span>
    <span class="token keyword">while</span> <span class="token punctuation">(</span>childToDelete <span class="token operator">!==</span> <span class="token keyword">null</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
      <span class="token function">deleteChild</span><span class="token punctuation">(</span>returnFiber<span class="token punctuation">,</span> childToDelete<span class="token punctuation">)</span><span class="token punctuation">;</span>
      childToDelete <span class="token operator">=</span> childToDelete<span class="token punctuation">.</span>sibling<span class="token punctuation">;</span>
    <span class="token punctuation">}</span>
    <span class="token keyword">return</span> <span class="token keyword">null</span><span class="token punctuation">;</span>
  <span class="token punctuation">}</span>

  <span class="token keyword">function</span> <span class="token function">reconcileSingleElement</span><span class="token punctuation">(</span><span class="token parameter">returnFiber<span class="token punctuation">,</span> currentFirstChild<span class="token punctuation">,</span> element</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
    <span class="token keyword">const</span> key <span class="token operator">=</span> element<span class="token punctuation">.</span>key<span class="token punctuation">;</span>
    <span class="token keyword">let</span> child <span class="token operator">=</span> currentFirstChild<span class="token punctuation">;</span>
    <span class="token keyword">while</span> <span class="token punctuation">(</span>child <span class="token operator">!==</span> <span class="token keyword">null</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
      <span class="token keyword">if</span> <span class="token punctuation">(</span>child<span class="token punctuation">.</span>key <span class="token operator">===</span> key<span class="token punctuation">)</span> <span class="token punctuation">{</span>
        <span class="token keyword">const</span> elementType <span class="token operator">=</span> element<span class="token punctuation">.</span>type<span class="token punctuation">;</span>
        <span class="token keyword">if</span> <span class="token punctuation">(</span>child<span class="token punctuation">.</span>type <span class="token operator">===</span> elementType<span class="token punctuation">)</span> <span class="token punctuation">{</span>
          <span class="token comment">// key相同且元素类型相同，fiber复用</span>
          <span class="token function">deleteRemainingChildren</span><span class="token punctuation">(</span>returnFiber<span class="token punctuation">,</span> child<span class="token punctuation">.</span>sibling<span class="token punctuation">)</span><span class="token punctuation">;</span>
          <span class="token keyword">const</span> existing <span class="token operator">=</span> <span class="token function">useFiber</span><span class="token punctuation">(</span>child<span class="token punctuation">,</span> element<span class="token punctuation">.</span>props<span class="token punctuation">)</span><span class="token punctuation">;</span>
          existing<span class="token punctuation">.</span>return <span class="token operator">=</span> returnFiber<span class="token punctuation">;</span>
          <span class="token keyword">return</span> existing<span class="token punctuation">;</span>
        <span class="token punctuation">}</span> <span class="token keyword">else</span> <span class="token punctuation">{</span>
          <span class="token comment">// key相同但是类型不同，删除剩下的全部fiber.child</span>
          <span class="token function">deleteRemainingChildren</span><span class="token punctuation">(</span>returnFiber<span class="token punctuation">,</span> child<span class="token punctuation">)</span><span class="token punctuation">;</span>
        <span class="token punctuation">}</span>
      <span class="token punctuation">}</span> <span class="token keyword">else</span> <span class="token punctuation">{</span>
        <span class="token comment">// key不同，删除老fiber.child</span>
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
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="多节点剩一个节点" tabindex="-1"><a class="header-anchor" href="#多节点剩一个节点" aria-hidden="true">#</a> 多节点剩一个节点</h3><p>此种情况在上一个情况中的 ReactChildFiber.js 的 deleteRemainingChildren 方法中已经实现，多节点下的单节点可复用时，其他节点尽数删除</p><div class="language-jsx line-numbers-mode" data-ext="jsx"><pre class="language-jsx"><code><span class="token keyword">import</span> <span class="token operator">*</span> <span class="token keyword">as</span> React <span class="token keyword">from</span> <span class="token string">&quot;react&quot;</span><span class="token punctuation">;</span>
<span class="token keyword">import</span> <span class="token punctuation">{</span> createRoot <span class="token punctuation">}</span> <span class="token keyword">from</span> <span class="token string">&quot;react-dom/client&quot;</span><span class="token punctuation">;</span>

<span class="token keyword">function</span> <span class="token function">FunctionComponent</span><span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
  <span class="token keyword">const</span> <span class="token punctuation">[</span>number<span class="token punctuation">,</span> setNumber<span class="token punctuation">]</span> <span class="token operator">=</span> React<span class="token punctuation">.</span><span class="token function">useState</span><span class="token punctuation">(</span><span class="token number">0</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
  <span class="token keyword">return</span> number <span class="token operator">===</span> <span class="token number">0</span> <span class="token operator">?</span> <span class="token punctuation">(</span>
    <span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span>ul</span> <span class="token attr-name">key</span><span class="token attr-value"><span class="token punctuation attr-equals">=</span><span class="token punctuation">&quot;</span>container<span class="token punctuation">&quot;</span></span> <span class="token attr-name">onClick</span><span class="token script language-javascript"><span class="token script-punctuation punctuation">=</span><span class="token punctuation">{</span><span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token operator">=&gt;</span> <span class="token function">setNumber</span><span class="token punctuation">(</span>number <span class="token operator">+</span> <span class="token number">1</span><span class="token punctuation">)</span><span class="token punctuation">}</span></span><span class="token punctuation">&gt;</span></span><span class="token plain-text">
      </span><span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span>li</span> <span class="token attr-name">key</span><span class="token attr-value"><span class="token punctuation attr-equals">=</span><span class="token punctuation">&quot;</span>A<span class="token punctuation">&quot;</span></span><span class="token punctuation">&gt;</span></span><span class="token plain-text">A</span><span class="token tag"><span class="token tag"><span class="token punctuation">&lt;/</span>li</span><span class="token punctuation">&gt;</span></span><span class="token plain-text">
      </span><span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span>li</span> <span class="token attr-name">key</span><span class="token attr-value"><span class="token punctuation attr-equals">=</span><span class="token punctuation">&quot;</span>B<span class="token punctuation">&quot;</span></span> <span class="token attr-name">id</span><span class="token attr-value"><span class="token punctuation attr-equals">=</span><span class="token punctuation">&quot;</span>B<span class="token punctuation">&quot;</span></span><span class="token punctuation">&gt;</span></span><span class="token plain-text">
        B
      </span><span class="token tag"><span class="token tag"><span class="token punctuation">&lt;/</span>li</span><span class="token punctuation">&gt;</span></span><span class="token plain-text">
      </span><span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span>li</span> <span class="token attr-name">key</span><span class="token attr-value"><span class="token punctuation attr-equals">=</span><span class="token punctuation">&quot;</span>C<span class="token punctuation">&quot;</span></span><span class="token punctuation">&gt;</span></span><span class="token plain-text">C</span><span class="token tag"><span class="token tag"><span class="token punctuation">&lt;/</span>li</span><span class="token punctuation">&gt;</span></span><span class="token plain-text">
    </span><span class="token tag"><span class="token tag"><span class="token punctuation">&lt;/</span>ul</span><span class="token punctuation">&gt;</span></span>
  <span class="token punctuation">)</span> <span class="token operator">:</span> <span class="token punctuation">(</span>
    <span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span>ul</span> <span class="token attr-name">key</span><span class="token attr-value"><span class="token punctuation attr-equals">=</span><span class="token punctuation">&quot;</span>container<span class="token punctuation">&quot;</span></span> <span class="token attr-name">onClick</span><span class="token script language-javascript"><span class="token script-punctuation punctuation">=</span><span class="token punctuation">{</span><span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token operator">=&gt;</span> <span class="token function">setNumber</span><span class="token punctuation">(</span>number <span class="token operator">+</span> <span class="token number">1</span><span class="token punctuation">)</span><span class="token punctuation">}</span></span><span class="token punctuation">&gt;</span></span><span class="token plain-text">
      </span><span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span>li</span> <span class="token attr-name">key</span><span class="token attr-value"><span class="token punctuation attr-equals">=</span><span class="token punctuation">&quot;</span>B<span class="token punctuation">&quot;</span></span> <span class="token attr-name">id</span><span class="token attr-value"><span class="token punctuation attr-equals">=</span><span class="token punctuation">&quot;</span>B2<span class="token punctuation">&quot;</span></span><span class="token punctuation">&gt;</span></span><span class="token plain-text">
        B2
      </span><span class="token tag"><span class="token tag"><span class="token punctuation">&lt;/</span>li</span><span class="token punctuation">&gt;</span></span><span class="token plain-text">
    </span><span class="token tag"><span class="token tag"><span class="token punctuation">&lt;/</span>ul</span><span class="token punctuation">&gt;</span></span>
  <span class="token punctuation">)</span><span class="token punctuation">;</span>
<span class="token punctuation">}</span>
<span class="token keyword">let</span> element <span class="token operator">=</span> <span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span><span class="token class-name">FunctionComponent</span></span> <span class="token punctuation">/&gt;</span></span><span class="token punctuation">;</span>
<span class="token keyword">const</span> root <span class="token operator">=</span> <span class="token function">createRoot</span><span class="token punctuation">(</span>document<span class="token punctuation">.</span><span class="token function">getElementById</span><span class="token punctuation">(</span><span class="token string">&quot;root&quot;</span><span class="token punctuation">)</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
root<span class="token punctuation">.</span><span class="token function">render</span><span class="token punctuation">(</span>element<span class="token punctuation">)</span><span class="token punctuation">;</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h2 id="多节点-diff" tabindex="-1"><a class="header-anchor" href="#多节点-diff" aria-hidden="true">#</a> 多节点 Diff</h2><p>React 最复杂的正是多节点的 Diff 分辨与遍历规则</p><p>Diff 规则有三：</p><ol><li>只对同级元素进行比较，不同层级不对比</li><li>不同的类型对应不同的元素</li><li>可以通过 key 来标识同一个节点</li></ol><p>遍历顺序有三：</p><ol><li><p>第一轮遍历</p><ul><li>如果 key 不同则直接结束本轮循环</li><li>newChildren 或 oldFiber 遍历完，结束本轮循环</li><li>key 相同而 type 也相同，则可以复用老节 oldFiber 节点，继续循环</li></ul></li><li><p>第二轮遍历</p><ul><li>newChildren 遍历完而 oldFiber 还有，遍历剩下所有的 oldFiber 标记为删除，DIFF 结束</li><li>oldFiber 遍历完了，而 newChildren 还有，将剩下的 newChildren 标记为插入，DIFF 结束</li><li>newChildren 和 oldFiber 都同时遍历完成，diff 结束</li><li>newChildren 和 oldFiber 都没有完成，则进行节点移动的逻辑，进入下一轮遍历</li></ul></li><li><p>第三轮遍历</p><ul><li>处理节点移动的情况</li></ul></li></ol><h3 id="前两轮遍历" tabindex="-1"><a class="header-anchor" href="#前两轮遍历" aria-hidden="true">#</a> 前两轮遍历</h3><p>这里列举前两轮遍历的一种理想情况，新旧节点的数量相同，key 相同，有的 type 不同</p><p>这种情况下，第一轮遍历会在 updateElement 函数中对这些 key 都相同的节点进行 type 比较，不同的老节点推入 deletion，新节点创建新 fiber</p><p><img src="https://misaka10032.oss-cn-chengdu.aliyuncs.com/React/duo_jie_dian_diff.png" alt="多节点diff第一轮循环" loading="lazy"></p><h4 id="src-main-jsx" tabindex="-1"><a class="header-anchor" href="#src-main-jsx" aria-hidden="true">#</a> src\\main.jsx</h4><p>src\\main.jsx</p><div class="language-jsx line-numbers-mode" data-ext="jsx"><pre class="language-jsx"><code><span class="token keyword">import</span> <span class="token operator">*</span> <span class="token keyword">as</span> React <span class="token keyword">from</span> <span class="token string">&quot;react&quot;</span><span class="token punctuation">;</span>
<span class="token keyword">import</span> <span class="token punctuation">{</span> createRoot <span class="token punctuation">}</span> <span class="token keyword">from</span> <span class="token string">&quot;react-dom/client&quot;</span><span class="token punctuation">;</span>

<span class="token keyword">function</span> <span class="token function">FunctionComponent</span><span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
  console<span class="token punctuation">.</span><span class="token function">log</span><span class="token punctuation">(</span><span class="token string">&quot;FunctionComponent&quot;</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
  <span class="token keyword">const</span> <span class="token punctuation">[</span>number<span class="token punctuation">,</span> setNumber<span class="token punctuation">]</span> <span class="token operator">=</span> React<span class="token punctuation">.</span><span class="token function">useState</span><span class="token punctuation">(</span><span class="token number">0</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
  <span class="token keyword">return</span> number <span class="token operator">===</span> <span class="token number">0</span> <span class="token operator">?</span> <span class="token punctuation">(</span>
    <span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span>ul</span> <span class="token attr-name">key</span><span class="token attr-value"><span class="token punctuation attr-equals">=</span><span class="token punctuation">&quot;</span>container<span class="token punctuation">&quot;</span></span> <span class="token attr-name">onClick</span><span class="token script language-javascript"><span class="token script-punctuation punctuation">=</span><span class="token punctuation">{</span><span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token operator">=&gt;</span> <span class="token function">setNumber</span><span class="token punctuation">(</span>number <span class="token operator">+</span> <span class="token number">1</span><span class="token punctuation">)</span><span class="token punctuation">}</span></span><span class="token punctuation">&gt;</span></span><span class="token plain-text">
      </span><span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span>li</span> <span class="token attr-name">key</span><span class="token attr-value"><span class="token punctuation attr-equals">=</span><span class="token punctuation">&quot;</span>A<span class="token punctuation">&quot;</span></span><span class="token punctuation">&gt;</span></span><span class="token plain-text">A</span><span class="token tag"><span class="token tag"><span class="token punctuation">&lt;/</span>li</span><span class="token punctuation">&gt;</span></span><span class="token plain-text">
      </span><span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span>li</span> <span class="token attr-name">key</span><span class="token attr-value"><span class="token punctuation attr-equals">=</span><span class="token punctuation">&quot;</span>B<span class="token punctuation">&quot;</span></span> <span class="token attr-name">id</span><span class="token attr-value"><span class="token punctuation attr-equals">=</span><span class="token punctuation">&quot;</span>B<span class="token punctuation">&quot;</span></span><span class="token punctuation">&gt;</span></span><span class="token plain-text">
        B
      </span><span class="token tag"><span class="token tag"><span class="token punctuation">&lt;/</span>li</span><span class="token punctuation">&gt;</span></span><span class="token plain-text">
      </span><span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span>li</span> <span class="token attr-name">key</span><span class="token attr-value"><span class="token punctuation attr-equals">=</span><span class="token punctuation">&quot;</span>C<span class="token punctuation">&quot;</span></span> <span class="token attr-name">id</span><span class="token attr-value"><span class="token punctuation attr-equals">=</span><span class="token punctuation">&quot;</span>C<span class="token punctuation">&quot;</span></span><span class="token punctuation">&gt;</span></span><span class="token plain-text">
        C
      </span><span class="token tag"><span class="token tag"><span class="token punctuation">&lt;/</span>li</span><span class="token punctuation">&gt;</span></span><span class="token plain-text">
    </span><span class="token tag"><span class="token tag"><span class="token punctuation">&lt;/</span>ul</span><span class="token punctuation">&gt;</span></span>
  <span class="token punctuation">)</span> <span class="token operator">:</span> <span class="token punctuation">(</span>
    <span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span>ul</span> <span class="token attr-name">key</span><span class="token attr-value"><span class="token punctuation attr-equals">=</span><span class="token punctuation">&quot;</span>container<span class="token punctuation">&quot;</span></span> <span class="token attr-name">onClick</span><span class="token script language-javascript"><span class="token script-punctuation punctuation">=</span><span class="token punctuation">{</span><span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token operator">=&gt;</span> <span class="token function">setNumber</span><span class="token punctuation">(</span>number <span class="token operator">+</span> <span class="token number">1</span><span class="token punctuation">)</span><span class="token punctuation">}</span></span><span class="token punctuation">&gt;</span></span><span class="token plain-text">
      </span><span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span>li</span> <span class="token attr-name">key</span><span class="token attr-value"><span class="token punctuation attr-equals">=</span><span class="token punctuation">&quot;</span>A<span class="token punctuation">&quot;</span></span><span class="token punctuation">&gt;</span></span><span class="token plain-text">A2</span><span class="token tag"><span class="token tag"><span class="token punctuation">&lt;/</span>li</span><span class="token punctuation">&gt;</span></span><span class="token plain-text">
      </span><span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span>p</span> <span class="token attr-name">key</span><span class="token attr-value"><span class="token punctuation attr-equals">=</span><span class="token punctuation">&quot;</span>B<span class="token punctuation">&quot;</span></span> <span class="token attr-name">id</span><span class="token attr-value"><span class="token punctuation attr-equals">=</span><span class="token punctuation">&quot;</span>B2<span class="token punctuation">&quot;</span></span><span class="token punctuation">&gt;</span></span><span class="token plain-text">
        B2
      </span><span class="token tag"><span class="token tag"><span class="token punctuation">&lt;/</span>p</span><span class="token punctuation">&gt;</span></span><span class="token plain-text">
      </span><span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span>li</span> <span class="token attr-name">key</span><span class="token attr-value"><span class="token punctuation attr-equals">=</span><span class="token punctuation">&quot;</span>C<span class="token punctuation">&quot;</span></span> <span class="token attr-name">id</span><span class="token attr-value"><span class="token punctuation attr-equals">=</span><span class="token punctuation">&quot;</span>C2<span class="token punctuation">&quot;</span></span><span class="token punctuation">&gt;</span></span><span class="token plain-text">
        C2
      </span><span class="token tag"><span class="token tag"><span class="token punctuation">&lt;/</span>li</span><span class="token punctuation">&gt;</span></span><span class="token plain-text">
    </span><span class="token tag"><span class="token tag"><span class="token punctuation">&lt;/</span>ul</span><span class="token punctuation">&gt;</span></span>
  <span class="token punctuation">)</span><span class="token punctuation">;</span>
<span class="token punctuation">}</span>
<span class="token keyword">let</span> element <span class="token operator">=</span> <span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span><span class="token class-name">FunctionComponent</span></span> <span class="token punctuation">/&gt;</span></span><span class="token punctuation">;</span>
<span class="token keyword">const</span> root <span class="token operator">=</span> <span class="token function">createRoot</span><span class="token punctuation">(</span>document<span class="token punctuation">.</span><span class="token function">getElementById</span><span class="token punctuation">(</span><span class="token string">&quot;root&quot;</span><span class="token punctuation">)</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
root<span class="token punctuation">.</span><span class="token function">render</span><span class="token punctuation">(</span>element<span class="token punctuation">)</span><span class="token punctuation">;</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h4 id="reactchildfiber-js-2" tabindex="-1"><a class="header-anchor" href="#reactchildfiber-js-2" aria-hidden="true">#</a> ReactChildFiber.jS</h4><p>src\\react-reconciler\\src\\ReactChildFiber.js</p><div class="language-javascript line-numbers-mode" data-ext="js"><pre class="language-javascript"><code><span class="token doc-comment comment">/**
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

  <span class="token comment">// 删除从currentFirstChild之后的所有fiber节点</span>
  <span class="token keyword">function</span> <span class="token function">deleteRemainingChildren</span><span class="token punctuation">(</span><span class="token parameter">returnFiber<span class="token punctuation">,</span> currentFirstChild</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
    <span class="token keyword">if</span> <span class="token punctuation">(</span><span class="token operator">!</span>shouldTracksSideEffects<span class="token punctuation">)</span> <span class="token punctuation">{</span>
      <span class="token keyword">return</span> <span class="token keyword">null</span><span class="token punctuation">;</span>
    <span class="token punctuation">}</span>
    <span class="token keyword">let</span> childToDelete <span class="token operator">=</span> currentFirstChild<span class="token punctuation">;</span>
    <span class="token keyword">while</span> <span class="token punctuation">(</span>childToDelete <span class="token operator">!==</span> <span class="token keyword">null</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
      <span class="token function">deleteChild</span><span class="token punctuation">(</span>returnFiber<span class="token punctuation">,</span> childToDelete<span class="token punctuation">)</span><span class="token punctuation">;</span>
      childToDelete <span class="token operator">=</span> childToDelete<span class="token punctuation">.</span>sibling<span class="token punctuation">;</span>
    <span class="token punctuation">}</span>
    <span class="token keyword">return</span> <span class="token keyword">null</span><span class="token punctuation">;</span>
  <span class="token punctuation">}</span>

  <span class="token keyword">function</span> <span class="token function">reconcileSingleElement</span><span class="token punctuation">(</span><span class="token parameter">returnFiber<span class="token punctuation">,</span> currentFirstChild<span class="token punctuation">,</span> element</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
    <span class="token keyword">const</span> key <span class="token operator">=</span> element<span class="token punctuation">.</span>key<span class="token punctuation">;</span>
    <span class="token keyword">let</span> child <span class="token operator">=</span> currentFirstChild<span class="token punctuation">;</span>
    <span class="token keyword">while</span> <span class="token punctuation">(</span>child <span class="token operator">!==</span> <span class="token keyword">null</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
      <span class="token keyword">if</span> <span class="token punctuation">(</span>child<span class="token punctuation">.</span>key <span class="token operator">===</span> key<span class="token punctuation">)</span> <span class="token punctuation">{</span>
        <span class="token keyword">const</span> elementType <span class="token operator">=</span> element<span class="token punctuation">.</span>type<span class="token punctuation">;</span>
        <span class="token keyword">if</span> <span class="token punctuation">(</span>child<span class="token punctuation">.</span>type <span class="token operator">===</span> elementType<span class="token punctuation">)</span> <span class="token punctuation">{</span>
          <span class="token comment">// key相同且元素类型相同，fiber复用</span>
          <span class="token function">deleteRemainingChildren</span><span class="token punctuation">(</span>returnFiber<span class="token punctuation">,</span> child<span class="token punctuation">.</span>sibling<span class="token punctuation">)</span><span class="token punctuation">;</span>
          <span class="token keyword">const</span> existing <span class="token operator">=</span> <span class="token function">useFiber</span><span class="token punctuation">(</span>child<span class="token punctuation">,</span> element<span class="token punctuation">.</span>props<span class="token punctuation">)</span><span class="token punctuation">;</span>
          existing<span class="token punctuation">.</span>return <span class="token operator">=</span> returnFiber<span class="token punctuation">;</span>
          <span class="token keyword">return</span> existing<span class="token punctuation">;</span>
        <span class="token punctuation">}</span> <span class="token keyword">else</span> <span class="token punctuation">{</span>
          <span class="token comment">// key相同但是类型不同，删除剩下的全部fiber.child</span>
          <span class="token function">deleteRemainingChildren</span><span class="token punctuation">(</span>returnFiber<span class="token punctuation">,</span> child<span class="token punctuation">)</span><span class="token punctuation">;</span>
        <span class="token punctuation">}</span>
      <span class="token punctuation">}</span> <span class="token keyword">else</span> <span class="token punctuation">{</span>
        <span class="token comment">// key不同，删除老fiber.child</span>
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
      <span class="token keyword">const</span> current <span class="token operator">=</span> newFiber<span class="token punctuation">.</span>alternate<span class="token punctuation">;</span>
      <span class="token keyword">if</span> <span class="token punctuation">(</span>current <span class="token operator">===</span> <span class="token keyword">null</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
        <span class="token comment">// 新节点，需要插入</span>
        newFiber<span class="token punctuation">.</span>flags <span class="token operator">|=</span> Placement<span class="token punctuation">;</span>
      <span class="token punctuation">}</span>
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

  <span class="token keyword">function</span> <span class="token function">updateElement</span><span class="token punctuation">(</span><span class="token parameter">returnFiber<span class="token punctuation">,</span> current<span class="token punctuation">,</span> element</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
    <span class="token keyword">const</span> elementType <span class="token operator">=</span> element<span class="token punctuation">.</span>type<span class="token punctuation">;</span>
    <span class="token keyword">if</span> <span class="token punctuation">(</span>current <span class="token operator">!==</span> <span class="token keyword">null</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
      <span class="token comment">// key和type都相同</span>
      <span class="token keyword">if</span> <span class="token punctuation">(</span>current<span class="token punctuation">.</span>type <span class="token operator">===</span> elementType<span class="token punctuation">)</span> <span class="token punctuation">{</span>
        <span class="token keyword">const</span> existing <span class="token operator">=</span> <span class="token function">useFiber</span><span class="token punctuation">(</span>current<span class="token punctuation">,</span> element<span class="token punctuation">.</span>props<span class="token punctuation">)</span><span class="token punctuation">;</span>
        existing<span class="token punctuation">.</span>return <span class="token operator">=</span> returnFiber<span class="token punctuation">;</span>
        <span class="token keyword">return</span> existing<span class="token punctuation">;</span>
      <span class="token punctuation">}</span>
    <span class="token punctuation">}</span>
    <span class="token keyword">const</span> created <span class="token operator">=</span> <span class="token function">createFiberFromElement</span><span class="token punctuation">(</span>element<span class="token punctuation">)</span><span class="token punctuation">;</span>
    created<span class="token punctuation">.</span>return <span class="token operator">=</span> returnFiber<span class="token punctuation">;</span>
    <span class="token keyword">return</span> created<span class="token punctuation">;</span>
  <span class="token punctuation">}</span>

  <span class="token keyword">function</span> <span class="token function">updateSlot</span><span class="token punctuation">(</span><span class="token parameter">returnFiber<span class="token punctuation">,</span> oldFiber<span class="token punctuation">,</span> newChild</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
    <span class="token keyword">const</span> key <span class="token operator">=</span> oldFiber <span class="token operator">!==</span> <span class="token keyword">null</span> <span class="token operator">?</span> oldFiber<span class="token punctuation">.</span>key <span class="token operator">:</span> <span class="token keyword">null</span><span class="token punctuation">;</span>
    <span class="token keyword">if</span> <span class="token punctuation">(</span>newChild <span class="token operator">!==</span> <span class="token keyword">null</span> <span class="token operator">&amp;&amp;</span> <span class="token keyword">typeof</span> newChild <span class="token operator">===</span> <span class="token string">&quot;object&quot;</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
      <span class="token keyword">switch</span> <span class="token punctuation">(</span>newChild<span class="token punctuation">.</span>$$<span class="token keyword">typeof</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
        <span class="token keyword">case</span> <span class="token constant">REACT_ELEMENT_TYPE</span><span class="token operator">:</span> <span class="token punctuation">{</span>
          <span class="token keyword">if</span> <span class="token punctuation">(</span>newChild<span class="token punctuation">.</span>key <span class="token operator">===</span> key<span class="token punctuation">)</span> <span class="token punctuation">{</span>
            <span class="token keyword">return</span> <span class="token function">updateElement</span><span class="token punctuation">(</span>returnFiber<span class="token punctuation">,</span> oldFiber<span class="token punctuation">,</span> newChild<span class="token punctuation">)</span><span class="token punctuation">;</span>
          <span class="token punctuation">}</span>
        <span class="token punctuation">}</span>
        <span class="token keyword">default</span><span class="token operator">:</span>
          <span class="token keyword">return</span> <span class="token keyword">null</span><span class="token punctuation">;</span>
      <span class="token punctuation">}</span>
    <span class="token punctuation">}</span>
  <span class="token punctuation">}</span>

  <span class="token keyword">function</span> <span class="token function">reconcileChildrenArray</span><span class="token punctuation">(</span><span class="token parameter">returnFiber<span class="token punctuation">,</span> currentFirstChild<span class="token punctuation">,</span> newChildren</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
    <span class="token keyword">let</span> resultingFirstChild <span class="token operator">=</span> <span class="token keyword">null</span><span class="token punctuation">;</span> <span class="token comment">// 返回的第一个新儿子</span>
    <span class="token keyword">let</span> previousNewFiber <span class="token operator">=</span> <span class="token keyword">null</span><span class="token punctuation">;</span> <span class="token comment">// 之前的新fiber</span>
    <span class="token keyword">let</span> newIdx <span class="token operator">=</span> <span class="token number">0</span><span class="token punctuation">;</span> <span class="token comment">// 遍历新虚拟DOM的索引</span>
    <span class="token keyword">let</span> oldFiber <span class="token operator">=</span> currentFirstChild<span class="token punctuation">;</span> <span class="token comment">// 第一个老fiber</span>
    <span class="token keyword">let</span> nextOldFiber <span class="token operator">=</span> <span class="token keyword">null</span><span class="token punctuation">;</span> <span class="token comment">// 下一个老fiber</span>
    <span class="token comment">// 开始第一轮循环 如果老fiber有值，新的虚拟DOM也有值</span>
    <span class="token keyword">for</span> <span class="token punctuation">(</span><span class="token punctuation">;</span> oldFiber <span class="token operator">!==</span> <span class="token keyword">null</span> <span class="token operator">&amp;&amp;</span> newIdx <span class="token operator">&lt;</span> newChildren<span class="token punctuation">.</span>length<span class="token punctuation">;</span> newIdx<span class="token operator">++</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
      <span class="token comment">// 暂存下一个老fiber</span>
      nextOldFiber <span class="token operator">=</span> oldFiber<span class="token punctuation">.</span>sibling<span class="token punctuation">;</span>
      <span class="token comment">// 试图更新或者试图复用老的fiber</span>
      <span class="token keyword">const</span> newFiber <span class="token operator">=</span> <span class="token function">updateSlot</span><span class="token punctuation">(</span>returnFiber<span class="token punctuation">,</span> oldFiber<span class="token punctuation">,</span> newChildren<span class="token punctuation">[</span>newIdx<span class="token punctuation">]</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
      <span class="token keyword">if</span> <span class="token punctuation">(</span>newFiber <span class="token operator">===</span> <span class="token keyword">null</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
        <span class="token keyword">break</span><span class="token punctuation">;</span>
      <span class="token punctuation">}</span>
      <span class="token keyword">if</span> <span class="token punctuation">(</span>shouldTracksSideEffects<span class="token punctuation">)</span> <span class="token punctuation">{</span>
        <span class="token comment">// 有老fiber，但是新的fiber并没有成功复用老fiber和老的真实DOM，删除老fiber，提交阶段删除真实DOM</span>
        <span class="token keyword">if</span> <span class="token punctuation">(</span>oldFiber <span class="token operator">&amp;&amp;</span> newFiber<span class="token punctuation">.</span>alternate <span class="token operator">===</span> <span class="token keyword">null</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
          <span class="token function">deleteChild</span><span class="token punctuation">(</span>returnFiber<span class="token punctuation">,</span> oldFiber<span class="token punctuation">)</span><span class="token punctuation">;</span>
        <span class="token punctuation">}</span>
      <span class="token punctuation">}</span>
      <span class="token comment">// 指定新fiber的位置</span>
      <span class="token function">placeChild</span><span class="token punctuation">(</span>newFiber<span class="token punctuation">,</span> newIdx<span class="token punctuation">)</span><span class="token punctuation">;</span>
      <span class="token keyword">if</span> <span class="token punctuation">(</span>previousNewFiber <span class="token operator">===</span> <span class="token keyword">null</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
        resultingFirstChild <span class="token operator">=</span> newFiber<span class="token punctuation">;</span>
      <span class="token punctuation">}</span> <span class="token keyword">else</span> <span class="token punctuation">{</span>
        previousNewFiber<span class="token punctuation">.</span>sibling <span class="token operator">=</span> newFiber<span class="token punctuation">;</span>
      <span class="token punctuation">}</span>
      previousNewFiber <span class="token operator">=</span> newFiber<span class="token punctuation">;</span>
      oldFiber <span class="token operator">=</span> nextOldFiber<span class="token punctuation">;</span>
    <span class="token punctuation">}</span>
    <span class="token comment">// 新的虚拟DOM已经循环完毕</span>
    <span class="token keyword">if</span> <span class="token punctuation">(</span>newIdx <span class="token operator">===</span> newChildren<span class="token punctuation">.</span>length<span class="token punctuation">)</span> <span class="token punctuation">{</span>
      <span class="token comment">// 第二轮循环情况1 删除剩下的老fiber</span>
      <span class="token function">deleteRemainingChildren</span><span class="token punctuation">(</span>returnFiber<span class="token punctuation">,</span> oldFiber<span class="token punctuation">)</span><span class="token punctuation">;</span>
      <span class="token keyword">return</span> resultingFirstChild<span class="token punctuation">;</span>
    <span class="token punctuation">}</span>
    <span class="token keyword">if</span> <span class="token punctuation">(</span>oldFiber <span class="token operator">===</span> <span class="token keyword">null</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
      <span class="token comment">// 第二轮循环情况2 老fiber已经没有了，新的虚拟DOM还在，进入插入新节点的逻辑</span>
      <span class="token keyword">for</span> <span class="token punctuation">(</span><span class="token punctuation">;</span> newIdx <span class="token operator">&lt;</span> newChildren<span class="token punctuation">.</span>length<span class="token punctuation">;</span> newIdx<span class="token operator">++</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
        <span class="token keyword">const</span> newFiber <span class="token operator">=</span> <span class="token function">createChild</span><span class="token punctuation">(</span>returnFiber<span class="token punctuation">,</span> newChildren<span class="token punctuation">[</span>newIdx<span class="token punctuation">]</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
        <span class="token keyword">if</span> <span class="token punctuation">(</span>newFiber <span class="token operator">===</span> <span class="token keyword">null</span><span class="token punctuation">)</span> <span class="token keyword">continue</span><span class="token punctuation">;</span>
        <span class="token comment">// 把新fiber放到索引位置</span>
        <span class="token function">placeChild</span><span class="token punctuation">(</span>newFiber<span class="token punctuation">,</span> newIdx<span class="token punctuation">)</span><span class="token punctuation">;</span>
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
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>因为第二轮遍历也相对简单，主要是对第一轮遍历彻底完成后残留的新旧节点做处理，因此上面的 ReactChildFiber.js 已经补全了这部分逻辑</p><h3 id="第三轮遍历" tabindex="-1"><a class="header-anchor" href="#第三轮遍历" aria-hidden="true">#</a> 第三轮遍历</h3><p>接下来讨论情况最复杂的第三轮遍历，前两轮遍历已经对头部 key 相同的节点进行了处理，最后进入第三轮遍历前，新旧节点依然存在数量相等或不等的乱序节点，key 和 type 也不尽相同</p><p>以下面这张节点图为例，描述具体的第三轮遍历 diff 规则：</p><p><img src="https://misaka10032.oss-cn-chengdu.aliyuncs.com/React/duo_ge_jie_dian_shu_liang_bu_tong_key_bu_tong.jpg" alt="多节点diff第三轮循环" loading="lazy"></p><p>其实第三轮遍历的关键在于对于剩余 oldFiber 的 map 映射表建立，以及剩余 newChildren 遍历过程中对 lastPlacedIndex 这个索引的判断来进行增加、更新、删除等操作</p><h4 id="src-main-jsx-1" tabindex="-1"><a class="header-anchor" href="#src-main-jsx-1" aria-hidden="true">#</a> src\\main.jsx</h4><p>src\\main.jsx</p><div class="language-jsx line-numbers-mode" data-ext="jsx"><pre class="language-jsx"><code><span class="token keyword">import</span> <span class="token operator">*</span> <span class="token keyword">as</span> React <span class="token keyword">from</span> <span class="token string">&quot;react/index&quot;</span><span class="token punctuation">;</span>
<span class="token keyword">import</span> <span class="token punctuation">{</span> createRoot <span class="token punctuation">}</span> <span class="token keyword">from</span> <span class="token string">&quot;react-dom/client&quot;</span><span class="token punctuation">;</span>

<span class="token keyword">function</span> <span class="token function">FunctionComponent</span><span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
  console<span class="token punctuation">.</span><span class="token function">log</span><span class="token punctuation">(</span><span class="token string">&quot;FunctionComponent&quot;</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
  <span class="token keyword">const</span> <span class="token punctuation">[</span>number<span class="token punctuation">,</span> setNumber<span class="token punctuation">]</span> <span class="token operator">=</span> React<span class="token punctuation">.</span><span class="token function">useState</span><span class="token punctuation">(</span><span class="token number">0</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
  <span class="token keyword">return</span> number <span class="token operator">===</span> <span class="token number">0</span> <span class="token operator">?</span> <span class="token punctuation">(</span>
    <span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span>ul</span> <span class="token attr-name">key</span><span class="token attr-value"><span class="token punctuation attr-equals">=</span><span class="token punctuation">&quot;</span>container<span class="token punctuation">&quot;</span></span> <span class="token attr-name">onClick</span><span class="token script language-javascript"><span class="token script-punctuation punctuation">=</span><span class="token punctuation">{</span><span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token operator">=&gt;</span> <span class="token function">setNumber</span><span class="token punctuation">(</span>number <span class="token operator">+</span> <span class="token number">1</span><span class="token punctuation">)</span><span class="token punctuation">}</span></span><span class="token punctuation">&gt;</span></span><span class="token plain-text">
      </span><span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span>li</span> <span class="token attr-name">key</span><span class="token attr-value"><span class="token punctuation attr-equals">=</span><span class="token punctuation">&quot;</span>A<span class="token punctuation">&quot;</span></span><span class="token punctuation">&gt;</span></span><span class="token plain-text">A</span><span class="token tag"><span class="token tag"><span class="token punctuation">&lt;/</span>li</span><span class="token punctuation">&gt;</span></span><span class="token plain-text">
      </span><span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span>li</span> <span class="token attr-name">key</span><span class="token attr-value"><span class="token punctuation attr-equals">=</span><span class="token punctuation">&quot;</span>B<span class="token punctuation">&quot;</span></span> <span class="token attr-name">id</span><span class="token attr-value"><span class="token punctuation attr-equals">=</span><span class="token punctuation">&quot;</span>b<span class="token punctuation">&quot;</span></span><span class="token punctuation">&gt;</span></span><span class="token plain-text">
        B
      </span><span class="token tag"><span class="token tag"><span class="token punctuation">&lt;/</span>li</span><span class="token punctuation">&gt;</span></span><span class="token plain-text">
      </span><span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span>li</span> <span class="token attr-name">key</span><span class="token attr-value"><span class="token punctuation attr-equals">=</span><span class="token punctuation">&quot;</span>C<span class="token punctuation">&quot;</span></span><span class="token punctuation">&gt;</span></span><span class="token plain-text">C</span><span class="token tag"><span class="token tag"><span class="token punctuation">&lt;/</span>li</span><span class="token punctuation">&gt;</span></span><span class="token plain-text">
      </span><span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span>li</span> <span class="token attr-name">key</span><span class="token attr-value"><span class="token punctuation attr-equals">=</span><span class="token punctuation">&quot;</span>D<span class="token punctuation">&quot;</span></span><span class="token punctuation">&gt;</span></span><span class="token plain-text">D</span><span class="token tag"><span class="token tag"><span class="token punctuation">&lt;/</span>li</span><span class="token punctuation">&gt;</span></span><span class="token plain-text">
      </span><span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span>li</span> <span class="token attr-name">key</span><span class="token attr-value"><span class="token punctuation attr-equals">=</span><span class="token punctuation">&quot;</span>E<span class="token punctuation">&quot;</span></span><span class="token punctuation">&gt;</span></span><span class="token plain-text">E</span><span class="token tag"><span class="token tag"><span class="token punctuation">&lt;/</span>li</span><span class="token punctuation">&gt;</span></span><span class="token plain-text">
      </span><span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span>li</span> <span class="token attr-name">key</span><span class="token attr-value"><span class="token punctuation attr-equals">=</span><span class="token punctuation">&quot;</span>F<span class="token punctuation">&quot;</span></span><span class="token punctuation">&gt;</span></span><span class="token plain-text">F</span><span class="token tag"><span class="token tag"><span class="token punctuation">&lt;/</span>li</span><span class="token punctuation">&gt;</span></span><span class="token plain-text">
    </span><span class="token tag"><span class="token tag"><span class="token punctuation">&lt;/</span>ul</span><span class="token punctuation">&gt;</span></span>
  <span class="token punctuation">)</span> <span class="token operator">:</span> <span class="token punctuation">(</span>
    <span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span>ul</span> <span class="token attr-name">key</span><span class="token attr-value"><span class="token punctuation attr-equals">=</span><span class="token punctuation">&quot;</span>container<span class="token punctuation">&quot;</span></span> <span class="token attr-name">onClick</span><span class="token script language-javascript"><span class="token script-punctuation punctuation">=</span><span class="token punctuation">{</span><span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token operator">=&gt;</span> <span class="token function">setNumber</span><span class="token punctuation">(</span>number <span class="token operator">+</span> <span class="token number">1</span><span class="token punctuation">)</span><span class="token punctuation">}</span></span><span class="token punctuation">&gt;</span></span><span class="token plain-text">
      </span><span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span>li</span> <span class="token attr-name">key</span><span class="token attr-value"><span class="token punctuation attr-equals">=</span><span class="token punctuation">&quot;</span>A<span class="token punctuation">&quot;</span></span><span class="token punctuation">&gt;</span></span><span class="token plain-text">A2</span><span class="token tag"><span class="token tag"><span class="token punctuation">&lt;/</span>li</span><span class="token punctuation">&gt;</span></span><span class="token plain-text">
      </span><span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span>li</span> <span class="token attr-name">key</span><span class="token attr-value"><span class="token punctuation attr-equals">=</span><span class="token punctuation">&quot;</span>C<span class="token punctuation">&quot;</span></span><span class="token punctuation">&gt;</span></span><span class="token plain-text">C2</span><span class="token tag"><span class="token tag"><span class="token punctuation">&lt;/</span>li</span><span class="token punctuation">&gt;</span></span><span class="token plain-text">
      </span><span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span>li</span> <span class="token attr-name">key</span><span class="token attr-value"><span class="token punctuation attr-equals">=</span><span class="token punctuation">&quot;</span>E<span class="token punctuation">&quot;</span></span><span class="token punctuation">&gt;</span></span><span class="token plain-text">E2</span><span class="token tag"><span class="token tag"><span class="token punctuation">&lt;/</span>li</span><span class="token punctuation">&gt;</span></span><span class="token plain-text">
      </span><span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span>li</span> <span class="token attr-name">key</span><span class="token attr-value"><span class="token punctuation attr-equals">=</span><span class="token punctuation">&quot;</span>B<span class="token punctuation">&quot;</span></span> <span class="token attr-name">id</span><span class="token attr-value"><span class="token punctuation attr-equals">=</span><span class="token punctuation">&quot;</span>b2<span class="token punctuation">&quot;</span></span><span class="token punctuation">&gt;</span></span><span class="token plain-text">
        B2
      </span><span class="token tag"><span class="token tag"><span class="token punctuation">&lt;/</span>li</span><span class="token punctuation">&gt;</span></span><span class="token plain-text">
      </span><span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span>li</span> <span class="token attr-name">key</span><span class="token attr-value"><span class="token punctuation attr-equals">=</span><span class="token punctuation">&quot;</span>G<span class="token punctuation">&quot;</span></span><span class="token punctuation">&gt;</span></span><span class="token plain-text">G</span><span class="token tag"><span class="token tag"><span class="token punctuation">&lt;/</span>li</span><span class="token punctuation">&gt;</span></span><span class="token plain-text">
      </span><span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span>li</span> <span class="token attr-name">key</span><span class="token attr-value"><span class="token punctuation attr-equals">=</span><span class="token punctuation">&quot;</span>D<span class="token punctuation">&quot;</span></span><span class="token punctuation">&gt;</span></span><span class="token plain-text">D2</span><span class="token tag"><span class="token tag"><span class="token punctuation">&lt;/</span>li</span><span class="token punctuation">&gt;</span></span><span class="token plain-text">
    </span><span class="token tag"><span class="token tag"><span class="token punctuation">&lt;/</span>ul</span><span class="token punctuation">&gt;</span></span>
  <span class="token punctuation">)</span><span class="token punctuation">;</span>
<span class="token punctuation">}</span>

<span class="token keyword">const</span> element <span class="token operator">=</span> <span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span><span class="token class-name">FunctionComponent</span></span> <span class="token punctuation">/&gt;</span></span><span class="token punctuation">;</span>
<span class="token keyword">const</span> root <span class="token operator">=</span> <span class="token function">createRoot</span><span class="token punctuation">(</span>document<span class="token punctuation">.</span><span class="token function">getElementById</span><span class="token punctuation">(</span><span class="token string">&quot;root&quot;</span><span class="token punctuation">)</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
<span class="token comment">// 把element虚拟DOM挂载到容器中</span>
root<span class="token punctuation">.</span><span class="token function">render</span><span class="token punctuation">(</span>element<span class="token punctuation">)</span><span class="token punctuation">;</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h4 id="reactfiberworkloop-js" tabindex="-1"><a class="header-anchor" href="#reactfiberworkloop-js" aria-hidden="true">#</a> ReactFiberWorkLoop.js</h4><p>src\\react-reconciler\\src\\ReactFiberWorkLoop.js</p><p>这里引入一下打印日志函数，便于查看 diff 细节</p><div class="language-javascript line-numbers-mode" data-ext="js"><pre class="language-javascript"><code><span class="token keyword">import</span> <span class="token punctuation">{</span> scheduleCallback <span class="token punctuation">}</span> <span class="token keyword">from</span> <span class="token string">&quot;scheduler/index&quot;</span><span class="token punctuation">;</span>
<span class="token keyword">import</span> <span class="token punctuation">{</span> createWorkInProgress <span class="token punctuation">}</span> <span class="token keyword">from</span> <span class="token string">&quot;./ReactFiber&quot;</span><span class="token punctuation">;</span>
<span class="token keyword">import</span> <span class="token punctuation">{</span> beginWork <span class="token punctuation">}</span> <span class="token keyword">from</span> <span class="token string">&quot;./ReactFiberBeginWork&quot;</span><span class="token punctuation">;</span>
<span class="token keyword">import</span> <span class="token punctuation">{</span> completeWork <span class="token punctuation">}</span> <span class="token keyword">from</span> <span class="token string">&quot;./ReactFiberCompleteWork&quot;</span><span class="token punctuation">;</span>
<span class="token keyword">import</span> <span class="token punctuation">{</span>
  NoFlags<span class="token punctuation">,</span>
  MutationMask<span class="token punctuation">,</span>
  Placement<span class="token punctuation">,</span>
  Update<span class="token punctuation">,</span>
  ChildDeletion<span class="token punctuation">,</span>
<span class="token punctuation">}</span> <span class="token keyword">from</span> <span class="token string">&quot;react-reconciler/src/ReactFiberFlags&quot;</span><span class="token punctuation">;</span>
<span class="token keyword">import</span> <span class="token punctuation">{</span> commitMutationEffectsOnFiber <span class="token punctuation">}</span> <span class="token keyword">from</span> <span class="token string">&quot;./ReactFiberCommitWork&quot;</span><span class="token punctuation">;</span>
<span class="token keyword">import</span> <span class="token punctuation">{</span> finishQueueingConcurrentUpdates <span class="token punctuation">}</span> <span class="token keyword">from</span> <span class="token string">&quot;./ReactFiberConcurrentUpdates&quot;</span><span class="token punctuation">;</span>
<span class="token keyword">import</span> <span class="token punctuation">{</span>
  FunctionComponent<span class="token punctuation">,</span>
  HostComponent<span class="token punctuation">,</span>
  HostRoot<span class="token punctuation">,</span>
  HostText<span class="token punctuation">,</span>
<span class="token punctuation">}</span> <span class="token keyword">from</span> <span class="token string">&quot;react-reconciler/src/ReactWorkTags&quot;</span><span class="token punctuation">;</span>

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
  <span class="token function">printFinishedWork</span><span class="token punctuation">(</span>finishedWork<span class="token punctuation">)</span><span class="token punctuation">;</span>
  console<span class="token punctuation">.</span><span class="token function">log</span><span class="token punctuation">(</span><span class="token string">&quot;~~~~~~~~~~~~~~~~~~~&quot;</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
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
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h4 id="reactchildfiber-js-3" tabindex="-1"><a class="header-anchor" href="#reactchildfiber-js-3" aria-hidden="true">#</a> ReactChildFiber.js</h4><p>src\\react-reconciler\\src\\ReactChildFiber.js</p><div class="language-javascript line-numbers-mode" data-ext="js"><pre class="language-javascript"><code><span class="token doc-comment comment">/**
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

  <span class="token comment">// 删除从currentFirstChild之后的所有fiber节点</span>
  <span class="token keyword">function</span> <span class="token function">deleteRemainingChildren</span><span class="token punctuation">(</span><span class="token parameter">returnFiber<span class="token punctuation">,</span> currentFirstChild</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
    <span class="token keyword">if</span> <span class="token punctuation">(</span><span class="token operator">!</span>shouldTracksSideEffects<span class="token punctuation">)</span> <span class="token punctuation">{</span>
      <span class="token keyword">return</span> <span class="token keyword">null</span><span class="token punctuation">;</span>
    <span class="token punctuation">}</span>
    <span class="token keyword">let</span> childToDelete <span class="token operator">=</span> currentFirstChild<span class="token punctuation">;</span>
    <span class="token keyword">while</span> <span class="token punctuation">(</span>childToDelete <span class="token operator">!==</span> <span class="token keyword">null</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
      <span class="token function">deleteChild</span><span class="token punctuation">(</span>returnFiber<span class="token punctuation">,</span> childToDelete<span class="token punctuation">)</span><span class="token punctuation">;</span>
      childToDelete <span class="token operator">=</span> childToDelete<span class="token punctuation">.</span>sibling<span class="token punctuation">;</span>
    <span class="token punctuation">}</span>
    <span class="token keyword">return</span> <span class="token keyword">null</span><span class="token punctuation">;</span>
  <span class="token punctuation">}</span>

  <span class="token keyword">function</span> <span class="token function">reconcileSingleElement</span><span class="token punctuation">(</span><span class="token parameter">returnFiber<span class="token punctuation">,</span> currentFirstChild<span class="token punctuation">,</span> element</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
    <span class="token keyword">const</span> key <span class="token operator">=</span> element<span class="token punctuation">.</span>key<span class="token punctuation">;</span>
    <span class="token keyword">let</span> child <span class="token operator">=</span> currentFirstChild<span class="token punctuation">;</span>
    <span class="token keyword">while</span> <span class="token punctuation">(</span>child <span class="token operator">!==</span> <span class="token keyword">null</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
      <span class="token keyword">if</span> <span class="token punctuation">(</span>child<span class="token punctuation">.</span>key <span class="token operator">===</span> key<span class="token punctuation">)</span> <span class="token punctuation">{</span>
        <span class="token keyword">const</span> elementType <span class="token operator">=</span> element<span class="token punctuation">.</span>type<span class="token punctuation">;</span>
        <span class="token keyword">if</span> <span class="token punctuation">(</span>child<span class="token punctuation">.</span>type <span class="token operator">===</span> elementType<span class="token punctuation">)</span> <span class="token punctuation">{</span>
          <span class="token comment">// key相同且元素类型相同，fiber复用</span>
          <span class="token function">deleteRemainingChildren</span><span class="token punctuation">(</span>returnFiber<span class="token punctuation">,</span> child<span class="token punctuation">.</span>sibling<span class="token punctuation">)</span><span class="token punctuation">;</span>
          <span class="token keyword">const</span> existing <span class="token operator">=</span> <span class="token function">useFiber</span><span class="token punctuation">(</span>child<span class="token punctuation">,</span> element<span class="token punctuation">.</span>props<span class="token punctuation">)</span><span class="token punctuation">;</span>
          existing<span class="token punctuation">.</span>return <span class="token operator">=</span> returnFiber<span class="token punctuation">;</span>
          <span class="token keyword">return</span> existing<span class="token punctuation">;</span>
        <span class="token punctuation">}</span> <span class="token keyword">else</span> <span class="token punctuation">{</span>
          <span class="token comment">// key相同但是类型不同，删除剩下的全部fiber.child</span>
          <span class="token function">deleteRemainingChildren</span><span class="token punctuation">(</span>returnFiber<span class="token punctuation">,</span> child<span class="token punctuation">)</span><span class="token punctuation">;</span>
        <span class="token punctuation">}</span>
      <span class="token punctuation">}</span> <span class="token keyword">else</span> <span class="token punctuation">{</span>
        <span class="token comment">// key不同，删除老fiber.child</span>
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

  <span class="token keyword">function</span> <span class="token function">placeChild</span><span class="token punctuation">(</span><span class="token parameter">newFiber<span class="token punctuation">,</span> lastPlacedIndex<span class="token punctuation">,</span> newIndex</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
    newFiber<span class="token punctuation">.</span>index <span class="token operator">=</span> newIndex<span class="token punctuation">;</span>
    <span class="token comment">// 如果不需要跟踪副作用</span>
    <span class="token keyword">if</span> <span class="token punctuation">(</span><span class="token operator">!</span>shouldTracksSideEffects<span class="token punctuation">)</span> <span class="token punctuation">{</span>
      <span class="token keyword">return</span> lastPlacedIndex<span class="token punctuation">;</span>
    <span class="token punctuation">}</span>
    <span class="token comment">// 如果一个fiber的flags上有placement，说明此节点需要创建真实DOM，插入到父容器中</span>
    <span class="token comment">// 如果父fiber初次挂载，shouldTracksSideEffects为false，不需要添加flags</span>
    <span class="token comment">// 这种情况下会在完成阶段把所有子阶段全部添加到自己身上</span>
    <span class="token keyword">const</span> current <span class="token operator">=</span> newFiber<span class="token punctuation">.</span>alternate<span class="token punctuation">;</span>
    <span class="token keyword">if</span> <span class="token punctuation">(</span>current <span class="token operator">===</span> <span class="token keyword">null</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
      <span class="token comment">// 新节点，需要插入</span>
      newFiber<span class="token punctuation">.</span>flags <span class="token operator">|=</span> Placement<span class="token punctuation">;</span>
      <span class="token keyword">return</span> lastPlacedIndex<span class="token punctuation">;</span>
    <span class="token punctuation">}</span> <span class="token keyword">else</span> <span class="token punctuation">{</span>
      <span class="token keyword">const</span> oldIndex <span class="token operator">=</span> current<span class="token punctuation">.</span>index<span class="token punctuation">;</span>
      <span class="token comment">// 如果老fiber的索引比lastPlacedIndex要小，则老fiber对应的DOM节点需要移动</span>
      <span class="token keyword">if</span> <span class="token punctuation">(</span>oldIndex <span class="token operator">&lt;</span> lastPlacedIndex<span class="token punctuation">)</span> <span class="token punctuation">{</span>
        newFiber<span class="token punctuation">.</span>flags <span class="token operator">|=</span> Placement<span class="token punctuation">;</span>
        <span class="token keyword">return</span> lastPlacedIndex<span class="token punctuation">;</span>
      <span class="token punctuation">}</span> <span class="token keyword">else</span> <span class="token punctuation">{</span>
        <span class="token keyword">return</span> oldIndex<span class="token punctuation">;</span>
      <span class="token punctuation">}</span>
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

  <span class="token keyword">function</span> <span class="token function">updateElement</span><span class="token punctuation">(</span><span class="token parameter">returnFiber<span class="token punctuation">,</span> current<span class="token punctuation">,</span> element</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
    <span class="token keyword">const</span> elementType <span class="token operator">=</span> element<span class="token punctuation">.</span>type<span class="token punctuation">;</span>
    <span class="token keyword">if</span> <span class="token punctuation">(</span>current <span class="token operator">!==</span> <span class="token keyword">null</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
      <span class="token comment">// key和type都相同</span>
      <span class="token keyword">if</span> <span class="token punctuation">(</span>current<span class="token punctuation">.</span>type <span class="token operator">===</span> elementType<span class="token punctuation">)</span> <span class="token punctuation">{</span>
        <span class="token keyword">const</span> existing <span class="token operator">=</span> <span class="token function">useFiber</span><span class="token punctuation">(</span>current<span class="token punctuation">,</span> element<span class="token punctuation">.</span>props<span class="token punctuation">)</span><span class="token punctuation">;</span>
        existing<span class="token punctuation">.</span>return <span class="token operator">=</span> returnFiber<span class="token punctuation">;</span>
        <span class="token keyword">return</span> existing<span class="token punctuation">;</span>
      <span class="token punctuation">}</span>
    <span class="token punctuation">}</span>
    <span class="token keyword">const</span> created <span class="token operator">=</span> <span class="token function">createFiberFromElement</span><span class="token punctuation">(</span>element<span class="token punctuation">)</span><span class="token punctuation">;</span>
    created<span class="token punctuation">.</span>return <span class="token operator">=</span> returnFiber<span class="token punctuation">;</span>
    <span class="token keyword">return</span> created<span class="token punctuation">;</span>
  <span class="token punctuation">}</span>

  <span class="token keyword">function</span> <span class="token function">updateSlot</span><span class="token punctuation">(</span><span class="token parameter">returnFiber<span class="token punctuation">,</span> oldFiber<span class="token punctuation">,</span> newChild</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
    <span class="token keyword">const</span> key <span class="token operator">=</span> oldFiber <span class="token operator">!==</span> <span class="token keyword">null</span> <span class="token operator">?</span> oldFiber<span class="token punctuation">.</span>key <span class="token operator">:</span> <span class="token keyword">null</span><span class="token punctuation">;</span>
    <span class="token keyword">if</span> <span class="token punctuation">(</span>newChild <span class="token operator">!==</span> <span class="token keyword">null</span> <span class="token operator">&amp;&amp;</span> <span class="token keyword">typeof</span> newChild <span class="token operator">===</span> <span class="token string">&quot;object&quot;</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
      <span class="token keyword">switch</span> <span class="token punctuation">(</span>newChild<span class="token punctuation">.</span>$$<span class="token keyword">typeof</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
        <span class="token keyword">case</span> <span class="token constant">REACT_ELEMENT_TYPE</span><span class="token operator">:</span> <span class="token punctuation">{</span>
          <span class="token keyword">if</span> <span class="token punctuation">(</span>newChild<span class="token punctuation">.</span>key <span class="token operator">===</span> key<span class="token punctuation">)</span> <span class="token punctuation">{</span>
            <span class="token keyword">return</span> <span class="token function">updateElement</span><span class="token punctuation">(</span>returnFiber<span class="token punctuation">,</span> oldFiber<span class="token punctuation">,</span> newChild<span class="token punctuation">)</span><span class="token punctuation">;</span>
          <span class="token punctuation">}</span>
        <span class="token punctuation">}</span>
        <span class="token keyword">default</span><span class="token operator">:</span>
          <span class="token keyword">return</span> <span class="token keyword">null</span><span class="token punctuation">;</span>
      <span class="token punctuation">}</span>
    <span class="token punctuation">}</span>
  <span class="token punctuation">}</span>

  <span class="token keyword">function</span> <span class="token function">mapRemainingChildren</span><span class="token punctuation">(</span><span class="token parameter">returnFiber<span class="token punctuation">,</span> currentFirstChild</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
    <span class="token keyword">const</span> existingChildren <span class="token operator">=</span> <span class="token keyword">new</span> <span class="token class-name">Map</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
    <span class="token keyword">let</span> existingChild <span class="token operator">=</span> currentFirstChild<span class="token punctuation">;</span>
    <span class="token keyword">while</span> <span class="token punctuation">(</span>existingChild <span class="token operator">!==</span> <span class="token keyword">null</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
      <span class="token comment">// 有key用key，无key用index</span>
      <span class="token keyword">if</span> <span class="token punctuation">(</span>existingChild<span class="token punctuation">.</span>key <span class="token operator">!==</span> <span class="token keyword">null</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
        existingChildren<span class="token punctuation">.</span><span class="token function">set</span><span class="token punctuation">(</span>existingChild<span class="token punctuation">.</span>key<span class="token punctuation">,</span> existingChild<span class="token punctuation">)</span><span class="token punctuation">;</span>
      <span class="token punctuation">}</span> <span class="token keyword">else</span> <span class="token punctuation">{</span>
        existingChildren<span class="token punctuation">.</span><span class="token function">set</span><span class="token punctuation">(</span>existingChild<span class="token punctuation">.</span>index<span class="token punctuation">,</span> existingChild<span class="token punctuation">)</span><span class="token punctuation">;</span>
      <span class="token punctuation">}</span>
      existingChild <span class="token operator">=</span> existingChild<span class="token punctuation">.</span>sibling<span class="token punctuation">;</span>
    <span class="token punctuation">}</span>
    <span class="token keyword">return</span> existingChildren<span class="token punctuation">;</span>
  <span class="token punctuation">}</span>

  <span class="token keyword">function</span> <span class="token function">updateTextNode</span><span class="token punctuation">(</span><span class="token parameter">returnFiber<span class="token punctuation">,</span> current<span class="token punctuation">,</span> textContent</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
    <span class="token keyword">if</span> <span class="token punctuation">(</span>current <span class="token operator">===</span> <span class="token keyword">null</span> <span class="token operator">||</span> current<span class="token punctuation">.</span>tag <span class="token operator">!==</span> HostText<span class="token punctuation">)</span> <span class="token punctuation">{</span>
      <span class="token keyword">const</span> created <span class="token operator">=</span> <span class="token function">createFiberFromText</span><span class="token punctuation">(</span>textContent<span class="token punctuation">)</span><span class="token punctuation">;</span>
      created<span class="token punctuation">.</span>return <span class="token operator">=</span> returnFiber<span class="token punctuation">;</span>
      <span class="token keyword">return</span> created<span class="token punctuation">;</span>
    <span class="token punctuation">}</span> <span class="token keyword">else</span> <span class="token punctuation">{</span>
      <span class="token keyword">const</span> existing <span class="token operator">=</span> <span class="token function">useFiber</span><span class="token punctuation">(</span>current<span class="token punctuation">,</span> textContent<span class="token punctuation">)</span><span class="token punctuation">;</span>
      existing<span class="token punctuation">.</span>return <span class="token operator">=</span> returnFiber<span class="token punctuation">;</span>
      <span class="token keyword">return</span> existing<span class="token punctuation">;</span>
    <span class="token punctuation">}</span>
  <span class="token punctuation">}</span>

  <span class="token keyword">function</span> <span class="token function">updateFromMap</span><span class="token punctuation">(</span><span class="token parameter">existingChildren<span class="token punctuation">,</span> returnFiber<span class="token punctuation">,</span> newIdx<span class="token punctuation">,</span> newChild</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
    <span class="token keyword">if</span> <span class="token punctuation">(</span>
      <span class="token punctuation">(</span><span class="token keyword">typeof</span> newChild <span class="token operator">===</span> <span class="token string">&quot;string&quot;</span> <span class="token operator">&amp;&amp;</span> newChild <span class="token operator">!==</span> <span class="token string">&quot;&quot;</span><span class="token punctuation">)</span> <span class="token operator">||</span>
      <span class="token keyword">typeof</span> newChild <span class="token operator">===</span> <span class="token string">&quot;number&quot;</span>
    <span class="token punctuation">)</span> <span class="token punctuation">{</span>
      <span class="token keyword">const</span> matchedFiber <span class="token operator">=</span> existingChildren<span class="token punctuation">.</span><span class="token function">get</span><span class="token punctuation">(</span>newIdx<span class="token punctuation">)</span> <span class="token operator">||</span> <span class="token keyword">null</span><span class="token punctuation">;</span>
      <span class="token keyword">return</span> <span class="token function">updateTextNode</span><span class="token punctuation">(</span>returnFiber<span class="token punctuation">,</span> matchedFiber<span class="token punctuation">,</span> <span class="token string">&quot;&quot;</span> <span class="token operator">+</span> newChild<span class="token punctuation">)</span><span class="token punctuation">;</span>
    <span class="token punctuation">}</span>
    <span class="token keyword">if</span> <span class="token punctuation">(</span><span class="token keyword">typeof</span> newChild <span class="token operator">===</span> <span class="token string">&quot;object&quot;</span> <span class="token operator">&amp;&amp;</span> newChild <span class="token operator">!==</span> <span class="token keyword">null</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
      <span class="token keyword">switch</span> <span class="token punctuation">(</span>newChild<span class="token punctuation">.</span>$$<span class="token keyword">typeof</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
        <span class="token keyword">case</span> <span class="token constant">REACT_ELEMENT_TYPE</span><span class="token operator">:</span> <span class="token punctuation">{</span>
          <span class="token keyword">const</span> matchedFiber <span class="token operator">=</span>
            existingChildren<span class="token punctuation">.</span><span class="token function">get</span><span class="token punctuation">(</span>
              newChild<span class="token punctuation">.</span>key <span class="token operator">===</span> <span class="token keyword">null</span> <span class="token operator">?</span> newIdx <span class="token operator">:</span> newChild<span class="token punctuation">.</span>key
            <span class="token punctuation">)</span> <span class="token operator">||</span> <span class="token keyword">null</span><span class="token punctuation">;</span>
          <span class="token keyword">return</span> <span class="token function">updateElement</span><span class="token punctuation">(</span>returnFiber<span class="token punctuation">,</span> matchedFiber<span class="token punctuation">,</span> newChild<span class="token punctuation">)</span><span class="token punctuation">;</span>
        <span class="token punctuation">}</span>
      <span class="token punctuation">}</span>
    <span class="token punctuation">}</span>
  <span class="token punctuation">}</span>

  <span class="token keyword">function</span> <span class="token function">reconcileChildrenArray</span><span class="token punctuation">(</span><span class="token parameter">returnFiber<span class="token punctuation">,</span> currentFirstChild<span class="token punctuation">,</span> newChildren</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
    <span class="token keyword">let</span> resultingFirstChild <span class="token operator">=</span> <span class="token keyword">null</span><span class="token punctuation">;</span> <span class="token comment">// 返回的第一个新儿子</span>
    <span class="token keyword">let</span> previousNewFiber <span class="token operator">=</span> <span class="token keyword">null</span><span class="token punctuation">;</span> <span class="token comment">// 之前的新fiber</span>
    <span class="token keyword">let</span> newIdx <span class="token operator">=</span> <span class="token number">0</span><span class="token punctuation">;</span> <span class="token comment">// 遍历新虚拟DOM的索引</span>
    <span class="token keyword">let</span> oldFiber <span class="token operator">=</span> currentFirstChild<span class="token punctuation">;</span> <span class="token comment">// 第一个老fiber</span>
    <span class="token keyword">let</span> nextOldFiber <span class="token operator">=</span> <span class="token keyword">null</span><span class="token punctuation">;</span> <span class="token comment">// 下一个老fiber</span>
    <span class="token keyword">let</span> lastPlacedIndex <span class="token operator">=</span> <span class="token number">0</span><span class="token punctuation">;</span> <span class="token comment">// 上一个不需要移动的老节点的索引</span>
    <span class="token comment">// 开始第一轮循环 如果老fiber有值，新的虚拟DOM也有值</span>
    <span class="token keyword">for</span> <span class="token punctuation">(</span><span class="token punctuation">;</span> oldFiber <span class="token operator">!==</span> <span class="token keyword">null</span> <span class="token operator">&amp;&amp;</span> newIdx <span class="token operator">&lt;</span> newChildren<span class="token punctuation">.</span>length<span class="token punctuation">;</span> newIdx<span class="token operator">++</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
      <span class="token comment">// 暂存下一个老fiber</span>
      nextOldFiber <span class="token operator">=</span> oldFiber<span class="token punctuation">.</span>sibling<span class="token punctuation">;</span>
      <span class="token comment">// 试图更新或者试图复用老的fiber</span>
      <span class="token keyword">const</span> newFiber <span class="token operator">=</span> <span class="token function">updateSlot</span><span class="token punctuation">(</span>returnFiber<span class="token punctuation">,</span> oldFiber<span class="token punctuation">,</span> newChildren<span class="token punctuation">[</span>newIdx<span class="token punctuation">]</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
      <span class="token keyword">if</span> <span class="token punctuation">(</span>newFiber <span class="token operator">===</span> <span class="token keyword">null</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
        <span class="token keyword">break</span><span class="token punctuation">;</span>
      <span class="token punctuation">}</span>
      <span class="token keyword">if</span> <span class="token punctuation">(</span>shouldTracksSideEffects<span class="token punctuation">)</span> <span class="token punctuation">{</span>
        <span class="token comment">// 有老fiber，但是新的fiber并没有成功复用老fiber和老的真实DOM，删除老fiber，提交阶段删除真实DOM</span>
        <span class="token keyword">if</span> <span class="token punctuation">(</span>oldFiber <span class="token operator">&amp;&amp;</span> newFiber<span class="token punctuation">.</span>alternate <span class="token operator">===</span> <span class="token keyword">null</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
          <span class="token function">deleteChild</span><span class="token punctuation">(</span>returnFiber<span class="token punctuation">,</span> oldFiber<span class="token punctuation">)</span><span class="token punctuation">;</span>
        <span class="token punctuation">}</span>
      <span class="token punctuation">}</span>
      <span class="token comment">// 指定新fiber的位置</span>
      lastPlacedIndex <span class="token operator">=</span> <span class="token function">placeChild</span><span class="token punctuation">(</span>newFiber<span class="token punctuation">,</span> lastPlacedIndex<span class="token punctuation">,</span> newIdx<span class="token punctuation">)</span><span class="token punctuation">;</span>
      <span class="token keyword">if</span> <span class="token punctuation">(</span>previousNewFiber <span class="token operator">===</span> <span class="token keyword">null</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
        resultingFirstChild <span class="token operator">=</span> newFiber<span class="token punctuation">;</span>
      <span class="token punctuation">}</span> <span class="token keyword">else</span> <span class="token punctuation">{</span>
        previousNewFiber<span class="token punctuation">.</span>sibling <span class="token operator">=</span> newFiber<span class="token punctuation">;</span>
      <span class="token punctuation">}</span>
      previousNewFiber <span class="token operator">=</span> newFiber<span class="token punctuation">;</span>
      oldFiber <span class="token operator">=</span> nextOldFiber<span class="token punctuation">;</span>
    <span class="token punctuation">}</span>
    <span class="token comment">// 新的虚拟DOM已经循环完毕</span>
    <span class="token keyword">if</span> <span class="token punctuation">(</span>newIdx <span class="token operator">===</span> newChildren<span class="token punctuation">.</span>length<span class="token punctuation">)</span> <span class="token punctuation">{</span>
      <span class="token comment">// 第二轮循环情况1 删除剩下的老fiber</span>
      <span class="token function">deleteRemainingChildren</span><span class="token punctuation">(</span>returnFiber<span class="token punctuation">,</span> oldFiber<span class="token punctuation">)</span><span class="token punctuation">;</span>
      <span class="token keyword">return</span> resultingFirstChild<span class="token punctuation">;</span>
    <span class="token punctuation">}</span>
    <span class="token keyword">if</span> <span class="token punctuation">(</span>oldFiber <span class="token operator">===</span> <span class="token keyword">null</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
      <span class="token comment">// 第二轮循环情况2 老fiber已经没有了，新的虚拟DOM还在，进入插入新节点的逻辑</span>
      <span class="token keyword">for</span> <span class="token punctuation">(</span><span class="token punctuation">;</span> newIdx <span class="token operator">&lt;</span> newChildren<span class="token punctuation">.</span>length<span class="token punctuation">;</span> newIdx<span class="token operator">++</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
        <span class="token keyword">const</span> newFiber <span class="token operator">=</span> <span class="token function">createChild</span><span class="token punctuation">(</span>returnFiber<span class="token punctuation">,</span> newChildren<span class="token punctuation">[</span>newIdx<span class="token punctuation">]</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
        <span class="token keyword">if</span> <span class="token punctuation">(</span>newFiber <span class="token operator">===</span> <span class="token keyword">null</span><span class="token punctuation">)</span> <span class="token keyword">continue</span><span class="token punctuation">;</span>
        <span class="token comment">// 把新fiber放到索引位置</span>
        lastPlacedIndex <span class="token operator">=</span> <span class="token function">placeChild</span><span class="token punctuation">(</span>newFiber<span class="token punctuation">,</span> lastPlacedIndex<span class="token punctuation">,</span> newIdx<span class="token punctuation">)</span><span class="token punctuation">;</span>
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
    <span class="token punctuation">}</span>
    <span class="token comment">// 第三轮循环 开始处理移动的情况</span>
    <span class="token keyword">const</span> existingChildren <span class="token operator">=</span> <span class="token function">mapRemainingChildren</span><span class="token punctuation">(</span>returnFiber<span class="token punctuation">,</span> oldFiber<span class="token punctuation">)</span><span class="token punctuation">;</span>
    <span class="token comment">// 开始遍历剩下的虚拟DOM子节点</span>
    <span class="token keyword">for</span> <span class="token punctuation">(</span><span class="token punctuation">;</span> newIdx <span class="token operator">&lt;</span> newChildren<span class="token punctuation">.</span>length<span class="token punctuation">;</span> newIdx<span class="token operator">++</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
      <span class="token keyword">const</span> newFiber <span class="token operator">=</span> <span class="token function">updateFromMap</span><span class="token punctuation">(</span>
        existingChildren<span class="token punctuation">,</span>
        returnFiber<span class="token punctuation">,</span>
        newIdx<span class="token punctuation">,</span>
        newChildren<span class="token punctuation">[</span>newIdx<span class="token punctuation">]</span>
      <span class="token punctuation">)</span><span class="token punctuation">;</span>
      <span class="token keyword">if</span> <span class="token punctuation">(</span>newFiber <span class="token operator">!==</span> <span class="token keyword">null</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
        <span class="token keyword">if</span> <span class="token punctuation">(</span>shouldTracksSideEffects<span class="token punctuation">)</span> <span class="token punctuation">{</span>
          <span class="token comment">// 需要跟踪副作用且存在的老fiber</span>
          <span class="token keyword">if</span> <span class="token punctuation">(</span>newFiber<span class="token punctuation">.</span>alternate <span class="token operator">!==</span> <span class="token keyword">null</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
            existingChildren<span class="token punctuation">.</span><span class="token function">delete</span><span class="token punctuation">(</span>
              newFiber<span class="token punctuation">.</span>key <span class="token operator">===</span> <span class="token keyword">null</span> <span class="token operator">?</span> newIdx <span class="token operator">:</span> newFiber<span class="token punctuation">.</span>key
            <span class="token punctuation">)</span><span class="token punctuation">;</span>
          <span class="token punctuation">}</span>
        <span class="token punctuation">}</span>
        <span class="token comment">// 指定新fiber的存放位置，并且给lastPlacedIndex赋值</span>
        lastPlacedIndex <span class="token operator">=</span> <span class="token function">placeChild</span><span class="token punctuation">(</span>newFiber<span class="token punctuation">,</span> lastPlacedIndex<span class="token punctuation">,</span> newIdx<span class="token punctuation">)</span><span class="token punctuation">;</span>
        <span class="token keyword">if</span> <span class="token punctuation">(</span>previousNewFiber <span class="token operator">===</span> <span class="token keyword">null</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
          resultingFirstChild <span class="token operator">=</span> newFiber<span class="token punctuation">;</span> <span class="token comment">// 这个newFiber就是大儿子</span>
        <span class="token punctuation">}</span> <span class="token keyword">else</span> <span class="token punctuation">{</span>
          <span class="token comment">// 否则说明不是大儿子，把这个newFiber添加上一个子节点后面</span>
          previousNewFiber<span class="token punctuation">.</span>sibling <span class="token operator">=</span> newFiber<span class="token punctuation">;</span>
        <span class="token punctuation">}</span>
        <span class="token comment">// 让newFiber成为最后一个或上一个子Fiber</span>
        previousNewFiber <span class="token operator">=</span> newFiber<span class="token punctuation">;</span>
      <span class="token punctuation">}</span>
    <span class="token punctuation">}</span>
    <span class="token keyword">if</span> <span class="token punctuation">(</span>shouldTracksSideEffects<span class="token punctuation">)</span> <span class="token punctuation">{</span>
      <span class="token comment">// 全部处理完之后，删除map中所有剩下的老fiber</span>
      existingChildren<span class="token punctuation">.</span><span class="token function">forEach</span><span class="token punctuation">(</span><span class="token punctuation">(</span><span class="token parameter">child</span><span class="token punctuation">)</span> <span class="token operator">=&gt;</span> <span class="token function">deleteChild</span><span class="token punctuation">(</span>returnFiber<span class="token punctuation">,</span> child<span class="token punctuation">)</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
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
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h4 id="控制台打印结果" tabindex="-1"><a class="header-anchor" href="#控制台打印结果" aria-hidden="true">#</a> 控制台打印结果</h4><p><img src="https://misaka10032.oss-cn-chengdu.aliyuncs.com/React/duo_jie_dian_diff_result.jpg" alt="多节点diff复杂遍历打印结果" loading="lazy"></p><h2 id="手写源码仓库" tabindex="-1"><a class="header-anchor" href="#手写源码仓库" aria-hidden="true">#</a> 手写源码仓库</h2>`,69),r={href:"https://github.com/mi-saka10032/mini-react/tree/master/packages/singledomdiff",target:"_blank",rel:"noopener noreferrer"},k={href:"https://github.com/mi-saka10032/mini-react/tree/master/packages/multipledomdiff",target:"_blank",rel:"noopener noreferrer"};function d(v,m){const s=l("ExternalLinkIcon");return e(),o("div",null,[u,n("p",null,[n("a",r,[a("https://github.com/mi-saka10032/mini-react/tree/master/packages/singledomdiff"),t(s)])]),n("p",null,[n("a",k,[a("https://github.com/mi-saka10032/mini-react/tree/master/packages/multipledomdiff"),t(s)])])])}const y=p(i,[["render",d],["__file","6-diff.html.vue"]]);export{y as default};
