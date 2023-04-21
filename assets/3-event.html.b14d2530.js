import{_ as a}from"./_plugin-vue_export-helper.cdc0426e.js";import{o as t,c as e,a as n,b as p,e as o,d as c,r as i}from"./app.5f8837b7.js";const l={},u=c(`<h2 id="原理简述" tabindex="-1"><a class="header-anchor" href="#原理简述" aria-hidden="true">#</a> 原理简述</h2><p>React 提供了有别于原生 DOM 事件系统(onclick)的完整的可插入式合成事件系统(onClick)，其原理是将全部的派发事件全部代理到根节点，然后遵循事件捕获和事件冒泡的顺序执行合成事件</p><ol><li>首先将 React 所定义的全部 DOM 事件名称转化为合成事件名称，这一步称为事件注册</li><li>根节点 Fiber 初始化完成(createContainer)之后，对根节点 DOM 开启已注册事件的代理监听。这一步会将之前已注册的合成事件名进行原生事件名转化，向根节点 DOM 添加事件监听器</li><li>每个原生事件注册的监听函数以事件派发(dispatchEvent)的形式触发，会自底向上地推入回调函数队列，按照事件捕获 =&gt; 事件冒泡的顺序触发这一系列合成事件</li></ol><p>下面将分阶段介绍事件系统的实现</p><h2 id="事件注册" tabindex="-1"><a class="header-anchor" href="#事件注册" aria-hidden="true">#</a> 事件注册</h2><p>事件注册阶段，将事件名 Set 中全部需注册的原生事件遍历一遍，并结合对应的 React 事件名生成映射关系 Map，最终将注册事件名称添加到 <strong>allNativeEvents</strong> 的 Set 中</p><h3 id="domplugineventsystem-js" tabindex="-1"><a class="header-anchor" href="#domplugineventsystem-js" aria-hidden="true">#</a> DOMPluginEventSystem.js</h3><div class="language-javascript line-numbers-mode" data-ext="js"><pre class="language-javascript"><code><span class="token keyword">import</span> <span class="token operator">*</span> <span class="token keyword">as</span> SimpleEventPlugin <span class="token keyword">from</span> <span class="token string">&quot;./plugins/SimpleEventPlugin&quot;</span><span class="token punctuation">;</span>

SimpleEventPlugin<span class="token punctuation">.</span><span class="token function">registerEvents</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="simpleeventplugin-js" tabindex="-1"><a class="header-anchor" href="#simpleeventplugin-js" aria-hidden="true">#</a> SimpleEventPlugin.js</h3><div class="language-javascript line-numbers-mode" data-ext="js"><pre class="language-javascript"><code><span class="token keyword">import</span> <span class="token punctuation">{</span> registerSimpleEvents <span class="token punctuation">}</span> <span class="token keyword">from</span> <span class="token string">&quot;../DOMEventProperties&quot;</span><span class="token punctuation">;</span>

<span class="token keyword">export</span> <span class="token punctuation">{</span> registerSimpleEvents <span class="token keyword">as</span> registerEvents <span class="token punctuation">}</span><span class="token punctuation">;</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="domeventproperties-js" tabindex="-1"><a class="header-anchor" href="#domeventproperties-js" aria-hidden="true">#</a> DOMEventProperties.js</h3><div class="language-javascript line-numbers-mode" data-ext="js"><pre class="language-javascript"><code><span class="token keyword">import</span> <span class="token punctuation">{</span> registerTwoPhaseEvent <span class="token punctuation">}</span> <span class="token keyword">from</span> <span class="token string">&quot;react-dom/src/events/EventRegistry&quot;</span><span class="token punctuation">;</span>
<span class="token comment">// 只注册click事件，其他需要注册的事件往里面添加就可以</span>
<span class="token keyword">const</span> simpleEventPluginEvents <span class="token operator">=</span> <span class="token punctuation">[</span><span class="token string">&quot;click&quot;</span><span class="token punctuation">]</span><span class="token punctuation">;</span>
<span class="token comment">// 存储原生事件名和React事件名的映射关系</span>
<span class="token keyword">export</span> <span class="token keyword">const</span> topLevelEventsTOReactNames <span class="token operator">=</span> <span class="token keyword">new</span> <span class="token class-name">Map</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
<span class="token keyword">function</span> <span class="token function">registerSimpleEvent</span><span class="token punctuation">(</span><span class="token parameter">domEventName<span class="token punctuation">,</span> reactName</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
  <span class="token comment">// 把原生事件名和处理函数的名字进行映射或绑定，click =&gt; onClick</span>
  topLevelEventsTOReactNames<span class="token punctuation">.</span><span class="token function">set</span><span class="token punctuation">(</span>domEventName<span class="token punctuation">,</span> reactName<span class="token punctuation">)</span><span class="token punctuation">;</span>
  <span class="token function">registerTwoPhaseEvent</span><span class="token punctuation">(</span>reactName<span class="token punctuation">,</span> <span class="token punctuation">[</span>domEventName<span class="token punctuation">]</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
<span class="token punctuation">}</span>

<span class="token keyword">export</span> <span class="token keyword">function</span> <span class="token function">registerSimpleEvents</span><span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
  <span class="token keyword">for</span> <span class="token punctuation">(</span><span class="token keyword">let</span> i <span class="token operator">=</span> <span class="token number">0</span><span class="token punctuation">;</span> i <span class="token operator">&lt;</span> simpleEventPluginEvents<span class="token punctuation">.</span>length<span class="token punctuation">;</span> i<span class="token operator">++</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
    <span class="token keyword">const</span> eventName <span class="token operator">=</span> simpleEventPluginEvents<span class="token punctuation">[</span>i<span class="token punctuation">]</span><span class="token punctuation">;</span> <span class="token comment">// click</span>
    <span class="token keyword">const</span> domEventName <span class="token operator">=</span> eventName<span class="token punctuation">.</span><span class="token function">toLowerCase</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span> <span class="token comment">// click</span>
    <span class="token keyword">const</span> capitalizeEvent <span class="token operator">=</span> eventName<span class="token punctuation">[</span><span class="token number">0</span><span class="token punctuation">]</span><span class="token punctuation">.</span><span class="token function">toUpperCase</span><span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token operator">+</span> eventName<span class="token punctuation">.</span><span class="token function">slice</span><span class="token punctuation">(</span><span class="token number">1</span><span class="token punctuation">)</span><span class="token punctuation">;</span> <span class="token comment">// Click</span>
    <span class="token function">registerSimpleEvent</span><span class="token punctuation">(</span>domEventName<span class="token punctuation">,</span> <span class="token template-string"><span class="token template-punctuation string">\`</span><span class="token string">on</span><span class="token interpolation"><span class="token interpolation-punctuation punctuation">\${</span>capitalizeEvent<span class="token interpolation-punctuation punctuation">}</span></span><span class="token template-punctuation string">\`</span></span><span class="token punctuation">)</span><span class="token punctuation">;</span> <span class="token comment">// click onClick</span>
  <span class="token punctuation">}</span>
<span class="token punctuation">}</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="eventregistry-js" tabindex="-1"><a class="header-anchor" href="#eventregistry-js" aria-hidden="true">#</a> EventRegistry.js</h3><div class="language-javascript line-numbers-mode" data-ext="js"><pre class="language-javascript"><code><span class="token keyword">export</span> <span class="token keyword">const</span> allNativeEvents <span class="token operator">=</span> <span class="token keyword">new</span> <span class="token class-name">Set</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span>

<span class="token doc-comment comment">/**
 * 注册两个阶段的事件名
 * 当页面中触发事件的时候，会走事件处理函数
 * 事件处理函数需要找到DOM元素对应要执行的React事件，onClick、onClickCapture等
 * <span class="token keyword">@param</span> <span class="token parameter">registrationName</span> React事件名
 * <span class="token keyword">@param</span> <span class="token parameter">dependencies</span> 原生事件数组[click]
 */</span>
<span class="token keyword">export</span> <span class="token keyword">function</span> <span class="token function">registerTwoPhaseEvent</span><span class="token punctuation">(</span><span class="token parameter">registrationName<span class="token punctuation">,</span> dependencies</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
  <span class="token comment">// 注册冒泡事件关系</span>
  <span class="token function">registerDirectEvent</span><span class="token punctuation">(</span>registrationName<span class="token punctuation">,</span> dependencies<span class="token punctuation">)</span><span class="token punctuation">;</span>
  <span class="token comment">// 注册捕获事件关系</span>
  <span class="token function">registerDirectEvent</span><span class="token punctuation">(</span>registrationName <span class="token operator">+</span> <span class="token string">&quot;Capture&quot;</span><span class="token punctuation">,</span> dependencies<span class="token punctuation">)</span><span class="token punctuation">;</span>
<span class="token punctuation">}</span>

<span class="token keyword">export</span> <span class="token keyword">function</span> <span class="token function">registerDirectEvent</span><span class="token punctuation">(</span><span class="token parameter">registrationName<span class="token punctuation">,</span> dependencies</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
  <span class="token keyword">for</span> <span class="token punctuation">(</span><span class="token keyword">let</span> i <span class="token operator">=</span> <span class="token number">0</span><span class="token punctuation">;</span> i <span class="token operator">&lt;</span> dependencies<span class="token punctuation">.</span>length<span class="token punctuation">;</span> i<span class="token operator">++</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
    allNativeEvents<span class="token punctuation">.</span><span class="token function">add</span><span class="token punctuation">(</span>dependencies<span class="token punctuation">[</span>i<span class="token punctuation">]</span><span class="token punctuation">)</span><span class="token punctuation">;</span> <span class="token comment">// click</span>
  <span class="token punctuation">}</span>
<span class="token punctuation">}</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h2 id="事件监听" tabindex="-1"><a class="header-anchor" href="#事件监听" aria-hidden="true">#</a> 事件监听</h2><p>createRoot 阶段，创建完根节点 Fiber 后，遍历<strong>allNativeEvents</strong>，开启对所有已注册事件的监听</p><p>注意监听器只针对根容器，且只会监听一次不会重复监听</p><h3 id="reactdomroot-js" tabindex="-1"><a class="header-anchor" href="#reactdomroot-js" aria-hidden="true">#</a> ReactDOMRoot.js</h3><div class="language-javascript line-numbers-mode" data-ext="js"><pre class="language-javascript"><code><span class="token keyword">export</span> <span class="token keyword">function</span> <span class="token function">createRoot</span><span class="token punctuation">(</span><span class="token parameter">container</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
  <span class="token comment">// div#root</span>
  <span class="token keyword">const</span> root <span class="token operator">=</span> <span class="token function">createContainer</span><span class="token punctuation">(</span>container<span class="token punctuation">)</span><span class="token punctuation">;</span>
  <span class="token function">listenToAllSupportedEvents</span><span class="token punctuation">(</span>container<span class="token punctuation">)</span><span class="token punctuation">;</span>
  <span class="token keyword">return</span> <span class="token keyword">new</span> <span class="token class-name">ReactDOMRoot</span><span class="token punctuation">(</span>root<span class="token punctuation">)</span><span class="token punctuation">;</span>
<span class="token punctuation">}</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="eventsystemflags-js" tabindex="-1"><a class="header-anchor" href="#eventsystemflags-js" aria-hidden="true">#</a> EventSystemFlags.js</h3><div class="language-javascript line-numbers-mode" data-ext="js"><pre class="language-javascript"><code><span class="token keyword">export</span> <span class="token keyword">const</span> <span class="token constant">IS_CAPTURE_PHASE</span> <span class="token operator">=</span> <span class="token number">1</span> <span class="token operator">&lt;&lt;</span> <span class="token number">2</span><span class="token punctuation">;</span>
<span class="token comment">// 0b0100</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="domplugineventsystem-js-1" tabindex="-1"><a class="header-anchor" href="#domplugineventsystem-js-1" aria-hidden="true">#</a> DOMPluginEventSystem.js</h3><div class="language-javascript line-numbers-mode" data-ext="js"><pre class="language-javascript"><code><span class="token keyword">import</span> <span class="token punctuation">{</span> allNativeEvents <span class="token punctuation">}</span> <span class="token keyword">from</span> <span class="token string">&quot;./EventRegistry&quot;</span><span class="token punctuation">;</span>
<span class="token keyword">import</span> <span class="token punctuation">{</span> <span class="token constant">IS_CAPTURE_PHASE</span> <span class="token punctuation">}</span> <span class="token keyword">from</span> <span class="token string">&quot;./EventSystemFlags&quot;</span><span class="token punctuation">;</span>

<span class="token keyword">const</span> listeningMarker <span class="token operator">=</span> <span class="token template-string"><span class="token template-punctuation string">\`</span><span class="token string">_reactListening</span><span class="token template-punctuation string">\`</span></span> <span class="token operator">+</span> Math<span class="token punctuation">.</span><span class="token function">random</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">.</span><span class="token function">toString</span><span class="token punctuation">(</span><span class="token number">36</span><span class="token punctuation">)</span><span class="token punctuation">.</span><span class="token function">slice</span><span class="token punctuation">(</span><span class="token number">2</span><span class="token punctuation">)</span><span class="token punctuation">;</span>

<span class="token keyword">export</span> <span class="token keyword">function</span> <span class="token function">listenToAllSupportedEvents</span><span class="token punctuation">(</span><span class="token parameter">rootContainerElement</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
  <span class="token comment">// 监听根容器div#root，只监听执行一次</span>
  <span class="token keyword">if</span> <span class="token punctuation">(</span><span class="token operator">!</span>rootContainerElement<span class="token punctuation">[</span>listeningMarker<span class="token punctuation">]</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
    rootContainerElement<span class="token punctuation">[</span>listeningMarker<span class="token punctuation">]</span> <span class="token operator">=</span> <span class="token boolean">true</span><span class="token punctuation">;</span>
    allNativeEvents<span class="token punctuation">.</span><span class="token function">forEach</span><span class="token punctuation">(</span><span class="token punctuation">(</span><span class="token parameter">domEventName</span><span class="token punctuation">)</span> <span class="token operator">=&gt;</span> <span class="token punctuation">{</span>
      <span class="token function">listenToNativeEvent</span><span class="token punctuation">(</span>domEventName<span class="token punctuation">,</span> <span class="token boolean">true</span><span class="token punctuation">,</span> rootContainerElement<span class="token punctuation">)</span><span class="token punctuation">;</span>
      <span class="token function">listenToNativeEvent</span><span class="token punctuation">(</span>domEventName<span class="token punctuation">,</span> <span class="token boolean">false</span><span class="token punctuation">,</span> rootContainerElement<span class="token punctuation">)</span><span class="token punctuation">;</span>
    <span class="token punctuation">}</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
  <span class="token punctuation">}</span>
<span class="token punctuation">}</span>

<span class="token doc-comment comment">/**
 * 注册原生事件
 * <span class="token keyword">@param</span> <span class="token parameter">domEventName</span> 原生事件
 * <span class="token keyword">@param</span> <span class="token parameter">isCapturePhaseListener</span> 是否是捕获节点
 * <span class="token keyword">@param</span> <span class="token parameter">target</span> 目标DOM节点 div#root 容器节点
 */</span>
<span class="token keyword">export</span> <span class="token keyword">function</span> <span class="token function">listenToNativeEvent</span><span class="token punctuation">(</span>
  <span class="token parameter">domEventName<span class="token punctuation">,</span>
  isCapturePhaseListener<span class="token punctuation">,</span>
  target</span>
<span class="token punctuation">)</span> <span class="token punctuation">{</span>
  <span class="token keyword">let</span> eventSystemFlags <span class="token operator">=</span> <span class="token number">0</span><span class="token punctuation">;</span> <span class="token comment">// 默认是0，冒泡 4是捕获</span>
  <span class="token keyword">if</span> <span class="token punctuation">(</span>isCapturePhaseListener<span class="token punctuation">)</span> <span class="token punctuation">{</span>
    eventSystemFlags <span class="token operator">|=</span> <span class="token constant">IS_CAPTURE_PHASE</span><span class="token punctuation">;</span>
  <span class="token punctuation">}</span>
  <span class="token function">addTrappedEventListener</span><span class="token punctuation">(</span>
    target<span class="token punctuation">,</span>
    domEventName<span class="token punctuation">,</span>
    eventSystemFlags<span class="token punctuation">,</span>
    isCapturePhaseListener
  <span class="token punctuation">)</span><span class="token punctuation">;</span>
<span class="token punctuation">}</span>

<span class="token keyword">function</span> <span class="token function">addTrappedEventListener</span><span class="token punctuation">(</span>
  <span class="token parameter">targetContainer<span class="token punctuation">,</span>
  domEventName<span class="token punctuation">,</span>
  eventSystemFlags<span class="token punctuation">,</span>
  isCapturePhaseListener</span>
<span class="token punctuation">)</span> <span class="token punctuation">{</span>
  <span class="token comment">// 创建基于优先级的监听函数回调</span>
  <span class="token keyword">const</span> listener <span class="token operator">=</span> <span class="token function">createEventListenerWrapperWithPriority</span><span class="token punctuation">(</span>
    targetContainer<span class="token punctuation">,</span>
    domEventName<span class="token punctuation">,</span>
    eventSystemFlags
  <span class="token punctuation">)</span><span class="token punctuation">;</span>
  <span class="token keyword">if</span> <span class="token punctuation">(</span>isCapturePhaseListener<span class="token punctuation">)</span> <span class="token punctuation">{</span>
    <span class="token function">addEventCaptureListener</span><span class="token punctuation">(</span>targetContainer<span class="token punctuation">,</span> domEventName<span class="token punctuation">,</span> listener<span class="token punctuation">)</span><span class="token punctuation">;</span>
  <span class="token punctuation">}</span> <span class="token keyword">else</span> <span class="token punctuation">{</span>
    <span class="token function">addEventBubbleListener</span><span class="token punctuation">(</span>targetContainer<span class="token punctuation">,</span> domEventName<span class="token punctuation">,</span> listener<span class="token punctuation">)</span><span class="token punctuation">;</span>
  <span class="token punctuation">}</span>
<span class="token punctuation">}</span>

<span class="token comment">// EventListener.js</span>
<span class="token keyword">export</span> <span class="token keyword">function</span> <span class="token function">addEventCaptureListener</span><span class="token punctuation">(</span><span class="token parameter">target<span class="token punctuation">,</span> eventType<span class="token punctuation">,</span> listener</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
  target<span class="token punctuation">.</span><span class="token function">addEventListener</span><span class="token punctuation">(</span>eventType<span class="token punctuation">,</span> listener<span class="token punctuation">,</span> <span class="token boolean">true</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
  <span class="token keyword">return</span> listener<span class="token punctuation">;</span>
<span class="token punctuation">}</span>

<span class="token keyword">export</span> <span class="token keyword">function</span> <span class="token function">addEventBubbleListener</span><span class="token punctuation">(</span><span class="token parameter">target<span class="token punctuation">,</span> eventType<span class="token punctuation">,</span> listener</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
  target<span class="token punctuation">.</span><span class="token function">addEventListener</span><span class="token punctuation">(</span>eventType<span class="token punctuation">,</span> listener<span class="token punctuation">,</span> <span class="token boolean">false</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
  <span class="token keyword">return</span> listener<span class="token punctuation">;</span>
<span class="token punctuation">}</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h2 id="事件派发" tabindex="-1"><a class="header-anchor" href="#事件派发" aria-hidden="true">#</a> 事件派发</h2><p>上面的事件监听，对监听函数 listener 实例函数进行了特殊处理，使得每个监听回调函数能自动执行事件派发功能，这里用到的关键函数就是<strong>createEventListenerWrapperWithPriority</strong></p><p>注意事件派发中事件捕获和冒泡累加回调函数的关键函数是 accumulateSinglePhaseListeners，通过不断执行 Fiber 的 return 循环，判断符合条件的 React 事件，将回调推入 listeners 回调数组，并加入到执行队列 dispatchQueue 中</p><h3 id="reactdomeventlistener-js" tabindex="-1"><a class="header-anchor" href="#reactdomeventlistener-js" aria-hidden="true">#</a> ReactDOMEventListener.js</h3><div class="language-javascript line-numbers-mode" data-ext="js"><pre class="language-javascript"><code><span class="token keyword">import</span> <span class="token punctuation">{</span> getEventTarget <span class="token punctuation">}</span> <span class="token keyword">from</span> <span class="token string">&quot;./getEventTarget&quot;</span><span class="token punctuation">;</span>
<span class="token keyword">import</span> <span class="token punctuation">{</span> getClosestInstanceFromNode <span class="token punctuation">}</span> <span class="token keyword">from</span> <span class="token string">&quot;../client/ReactDOMComponentTree&quot;</span><span class="token punctuation">;</span>
<span class="token keyword">import</span> <span class="token punctuation">{</span> dispatchEventForPluginEventSystem <span class="token punctuation">}</span> <span class="token keyword">from</span> <span class="token string">&quot;./DOMPluginEventSystem&quot;</span><span class="token punctuation">;</span>

<span class="token keyword">export</span> <span class="token keyword">function</span> <span class="token function">createEventListenerWrapperWithPriority</span><span class="token punctuation">(</span>
  <span class="token parameter">targetContainer<span class="token punctuation">,</span>
  domEventName<span class="token punctuation">,</span>
  eventSystemFlags</span>
<span class="token punctuation">)</span> <span class="token punctuation">{</span>
  <span class="token keyword">const</span> listenerWrapper <span class="token operator">=</span> dispatchDiscreteEvent<span class="token punctuation">;</span>
  <span class="token keyword">return</span> <span class="token function">listenerWrapper</span><span class="token punctuation">.</span><span class="token function">bind</span><span class="token punctuation">(</span>
    <span class="token keyword">null</span><span class="token punctuation">,</span>
    domEventName<span class="token punctuation">,</span>
    eventSystemFlags<span class="token punctuation">,</span>
    targetContainer
  <span class="token punctuation">)</span><span class="token punctuation">;</span>
<span class="token punctuation">}</span>

<span class="token doc-comment comment">/**
 * 派发离散事件的监听函数
 * <span class="token keyword">@param</span> <span class="token parameter">domEventName</span> 事件名
 * <span class="token keyword">@param</span> <span class="token parameter">eventSystemFlags</span> 阶段 0冒泡 4捕获
 * <span class="token keyword">@param</span> <span class="token parameter">container</span> 容器div#root
 * <span class="token keyword">@param</span> <span class="token parameter">nativeEvent</span> 原生事件
 */</span>
<span class="token keyword">function</span> <span class="token function">dispatchDiscreteEvent</span><span class="token punctuation">(</span>
  <span class="token parameter">domEventName<span class="token punctuation">,</span>
  eventSystemFlags<span class="token punctuation">,</span>
  container<span class="token punctuation">,</span>
  nativeEvent</span>
<span class="token punctuation">)</span> <span class="token punctuation">{</span>
  <span class="token function">dispatchEvent</span><span class="token punctuation">(</span>domEventName<span class="token punctuation">,</span> eventSystemFlags<span class="token punctuation">,</span> container<span class="token punctuation">,</span> nativeEvent<span class="token punctuation">)</span><span class="token punctuation">;</span>
<span class="token punctuation">}</span>

<span class="token doc-comment comment">/**
 * 此方法就是委托给容器的回调，当容器#root在捕获或者说冒泡阶段处理事件的时候执行此函数
 * <span class="token keyword">@param</span> <span class="token parameter">domEventName</span>
 * <span class="token keyword">@param</span> <span class="token parameter">eventSystemFlags</span>
 * <span class="token keyword">@param</span> <span class="token parameter">targetContainer</span>
 * <span class="token keyword">@param</span> <span class="token parameter">nativeEvent</span>
 */</span>
<span class="token keyword">export</span> <span class="token keyword">function</span> <span class="token function">dispatchEvent</span><span class="token punctuation">(</span>
  <span class="token parameter">domEventName<span class="token punctuation">,</span>
  eventSystemFlags<span class="token punctuation">,</span>
  targetContainer<span class="token punctuation">,</span>
  nativeEvent</span>
<span class="token punctuation">)</span> <span class="token punctuation">{</span>
  <span class="token comment">// 获取事件源，它应该是一个真实DOM</span>
  <span class="token keyword">const</span> nativeEventTarget <span class="token operator">=</span> <span class="token function">getEventTarget</span><span class="token punctuation">(</span>nativeEvent<span class="token punctuation">)</span><span class="token punctuation">;</span>
  <span class="token keyword">const</span> targetInst <span class="token operator">=</span> <span class="token function">getClosestInstanceFromNode</span><span class="token punctuation">(</span>nativeEventTarget<span class="token punctuation">)</span><span class="token punctuation">;</span>
  <span class="token function">dispatchEventForPluginEventSystem</span><span class="token punctuation">(</span>
    domEventName<span class="token punctuation">,</span> <span class="token comment">// click</span>
    eventSystemFlags<span class="token punctuation">,</span> <span class="token comment">// 0 4</span>
    nativeEvent<span class="token punctuation">,</span> <span class="token comment">// 原生事件</span>
    targetInst<span class="token punctuation">,</span> <span class="token comment">// 此真实DOM对应的fiber</span>
    targetContainer <span class="token comment">// 目标容器</span>
  <span class="token punctuation">)</span><span class="token punctuation">;</span>
<span class="token punctuation">}</span>

<span class="token comment">// getEventTarget.js</span>
<span class="token keyword">export</span> <span class="token keyword">function</span> <span class="token function">getEventTarget</span><span class="token punctuation">(</span><span class="token parameter">nativeEvent</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
  <span class="token keyword">const</span> target <span class="token operator">=</span> nativeEvent<span class="token punctuation">.</span>target <span class="token operator">||</span> nativeEvent<span class="token punctuation">.</span>srcElement <span class="token operator">||</span> window<span class="token punctuation">;</span>
  <span class="token keyword">return</span> target<span class="token punctuation">;</span>
<span class="token punctuation">}</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="reactdomcomponenttree-js" tabindex="-1"><a class="header-anchor" href="#reactdomcomponenttree-js" aria-hidden="true">#</a> ReactDOMComponentTree.js</h3><div class="language-javascript line-numbers-mode" data-ext="js"><pre class="language-javascript"><code><span class="token keyword">const</span> randomKey <span class="token operator">=</span> Math<span class="token punctuation">.</span><span class="token function">random</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">.</span><span class="token function">toString</span><span class="token punctuation">(</span><span class="token number">36</span><span class="token punctuation">)</span><span class="token punctuation">.</span><span class="token function">slice</span><span class="token punctuation">(</span><span class="token number">2</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
<span class="token keyword">const</span> internalInstanceKey <span class="token operator">=</span> <span class="token string">&quot;__reactFiber$&quot;</span> <span class="token operator">+</span> randomKey<span class="token punctuation">;</span>
<span class="token keyword">const</span> internalPropsKey <span class="token operator">=</span> <span class="token string">&quot;__reactProps$&quot;</span> <span class="token operator">+</span> randomKey<span class="token punctuation">;</span>

<span class="token doc-comment comment">/**
 * 从真实的DOM节点上获取它对应的Fiber节点
 * <span class="token keyword">@param</span> <span class="token parameter">targetNode</span>
 */</span>
<span class="token keyword">export</span> <span class="token keyword">function</span> <span class="token function">getClosestInstanceFromNode</span><span class="token punctuation">(</span><span class="token parameter">targetNode</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
  <span class="token keyword">const</span> targetInst <span class="token operator">=</span> targetNode<span class="token punctuation">[</span>internalInstanceKey<span class="token punctuation">]</span><span class="token punctuation">;</span>
  <span class="token keyword">return</span> targetInst<span class="token punctuation">;</span>
<span class="token punctuation">}</span>

<span class="token doc-comment comment">/**
 * 提前缓存Fiber节点的实例到DOM节点上
 * <span class="token keyword">@param</span> <span class="token parameter">hostInst</span> fiber实例
 * <span class="token keyword">@param</span> <span class="token parameter">node</span> 真实DOM
 */</span>
<span class="token keyword">export</span> <span class="token keyword">function</span> <span class="token function">precacheFiberNode</span><span class="token punctuation">(</span><span class="token parameter">hostInst<span class="token punctuation">,</span> node</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
  node<span class="token punctuation">[</span>internalInstanceKey<span class="token punctuation">]</span> <span class="token operator">=</span> hostInst<span class="token punctuation">;</span>
<span class="token punctuation">}</span>

<span class="token keyword">export</span> <span class="token keyword">function</span> <span class="token function">updateFiberProps</span><span class="token punctuation">(</span><span class="token parameter">node<span class="token punctuation">,</span> props</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
  node<span class="token punctuation">[</span>internalPropsKey<span class="token punctuation">]</span> <span class="token operator">=</span> props<span class="token punctuation">;</span>
<span class="token punctuation">}</span>

<span class="token keyword">export</span> <span class="token keyword">function</span> <span class="token function">getFiberCurrentPropsFromNode</span><span class="token punctuation">(</span><span class="token parameter">node</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
  <span class="token keyword">return</span> node<span class="token punctuation">[</span>internalPropsKey<span class="token punctuation">]</span> <span class="token operator">||</span> <span class="token keyword">null</span><span class="token punctuation">;</span>
<span class="token punctuation">}</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="domplugineventsystem-js-2" tabindex="-1"><a class="header-anchor" href="#domplugineventsystem-js-2" aria-hidden="true">#</a> DOMPluginEventSystem.js</h3><p>再次回到 DOMPluginEventSystem，派发事件函数还是在这里进行声明</p><div class="language-javascript line-numbers-mode" data-ext="js"><pre class="language-javascript"><code><span class="token keyword">export</span> <span class="token keyword">function</span> <span class="token function">dispatchEventForPluginEventSystem</span><span class="token punctuation">(</span>
  <span class="token parameter">domEventName<span class="token punctuation">,</span>
  eventSystemFlags<span class="token punctuation">,</span>
  nativeEvent<span class="token punctuation">,</span>
  targetInst<span class="token punctuation">,</span>
  targetContainer</span>
<span class="token punctuation">)</span> <span class="token punctuation">{</span>
  <span class="token function">dispatchEventForPlugins</span><span class="token punctuation">(</span>
    domEventName<span class="token punctuation">,</span>
    eventSystemFlags<span class="token punctuation">,</span>
    nativeEvent<span class="token punctuation">,</span>
    targetInst<span class="token punctuation">,</span>
    targetContainer
  <span class="token punctuation">)</span><span class="token punctuation">;</span>
<span class="token punctuation">}</span>

<span class="token keyword">function</span> <span class="token function">dispatchEventForPlugins</span><span class="token punctuation">(</span>
  <span class="token parameter">domEventName<span class="token punctuation">,</span>
  eventSystemFlags<span class="token punctuation">,</span>
  nativeEvent<span class="token punctuation">,</span>
  targetInst<span class="token punctuation">,</span>
  targetContainer</span>
<span class="token punctuation">)</span> <span class="token punctuation">{</span>
  <span class="token keyword">const</span> nativeEventTarget <span class="token operator">=</span> <span class="token function">getEventTarget</span><span class="token punctuation">(</span>nativeEvent<span class="token punctuation">)</span><span class="token punctuation">;</span>
  <span class="token comment">// 派发事件的数组</span>
  <span class="token keyword">const</span> dispatchQueue <span class="token operator">=</span> <span class="token punctuation">[</span><span class="token punctuation">]</span><span class="token punctuation">;</span>
  <span class="token function">extractEvents</span><span class="token punctuation">(</span>
    dispatchQueue<span class="token punctuation">,</span>
    domEventName<span class="token punctuation">,</span>
    targetInst<span class="token punctuation">,</span>
    nativeEvent<span class="token punctuation">,</span>
    nativeEventTarget<span class="token punctuation">,</span>
    eventSystemFlags<span class="token punctuation">,</span>
    targetContainer
  <span class="token punctuation">)</span><span class="token punctuation">;</span>
<span class="token punctuation">}</span>

<span class="token keyword">function</span> <span class="token function">extractEvents</span><span class="token punctuation">(</span>
  <span class="token parameter">dispatchQueue<span class="token punctuation">,</span>
  domEventName<span class="token punctuation">,</span>
  targetInst<span class="token punctuation">,</span>
  nativeEvent<span class="token punctuation">,</span>
  nativeEventTarget<span class="token punctuation">,</span>
  eventSystemFlags<span class="token punctuation">,</span>
  targetContainer</span>
<span class="token punctuation">)</span> <span class="token punctuation">{</span>
  SimpleEventPlugin<span class="token punctuation">.</span><span class="token function">extractEvents</span><span class="token punctuation">(</span>
    dispatchQueue<span class="token punctuation">,</span>
    domEventName<span class="token punctuation">,</span>
    targetInst<span class="token punctuation">,</span>
    nativeEvent<span class="token punctuation">,</span>
    nativeEventTarget<span class="token punctuation">,</span>
    eventSystemFlags<span class="token punctuation">,</span>
    targetContainer
  <span class="token punctuation">)</span><span class="token punctuation">;</span>
<span class="token punctuation">}</span>

<span class="token keyword">export</span> <span class="token keyword">function</span> <span class="token function">accumulateSinglePhaseListeners</span><span class="token punctuation">(</span>
  <span class="token parameter">targetFiber<span class="token punctuation">,</span>
  reactName<span class="token punctuation">,</span>
  nativeEventType<span class="token punctuation">,</span>
  isCapturePhase</span>
<span class="token punctuation">)</span> <span class="token punctuation">{</span>
  <span class="token keyword">const</span> captureName <span class="token operator">=</span> reactName <span class="token operator">+</span> <span class="token string">&quot;Capture&quot;</span><span class="token punctuation">;</span>
  <span class="token keyword">const</span> reactEventName <span class="token operator">=</span> isCapturePhase <span class="token operator">?</span> captureName <span class="token operator">:</span> reactName<span class="token punctuation">;</span>
  <span class="token keyword">const</span> listeners <span class="token operator">=</span> <span class="token punctuation">[</span><span class="token punctuation">]</span><span class="token punctuation">;</span>
  <span class="token keyword">let</span> instance <span class="token operator">=</span> targetFiber<span class="token punctuation">;</span>
  <span class="token keyword">while</span> <span class="token punctuation">(</span>instance <span class="token operator">!==</span> <span class="token keyword">null</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
    <span class="token keyword">const</span> <span class="token punctuation">{</span> stateNode<span class="token punctuation">,</span> tag <span class="token punctuation">}</span> <span class="token operator">=</span> instance<span class="token punctuation">;</span>
    <span class="token keyword">if</span> <span class="token punctuation">(</span>tag <span class="token operator">===</span> HostComponent <span class="token operator">&amp;&amp;</span> stateNode <span class="token operator">!==</span> <span class="token keyword">null</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
      <span class="token keyword">const</span> listener <span class="token operator">=</span> <span class="token function">getListener</span><span class="token punctuation">(</span>instance<span class="token punctuation">,</span> reactEventName<span class="token punctuation">)</span><span class="token punctuation">;</span>
      <span class="token keyword">if</span> <span class="token punctuation">(</span>listener<span class="token punctuation">)</span> <span class="token punctuation">{</span>
        listeners<span class="token punctuation">.</span><span class="token function">push</span><span class="token punctuation">(</span><span class="token function">createDispatchListener</span><span class="token punctuation">(</span>instance<span class="token punctuation">,</span> listener<span class="token punctuation">,</span> stateNode<span class="token punctuation">)</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
      <span class="token punctuation">}</span>
    <span class="token punctuation">}</span>
    instance <span class="token operator">=</span> instance<span class="token punctuation">.</span>return<span class="token punctuation">;</span>
  <span class="token punctuation">}</span>
  <span class="token keyword">return</span> listeners<span class="token punctuation">;</span>
<span class="token punctuation">}</span>

<span class="token keyword">function</span> <span class="token function">createDispatchListener</span><span class="token punctuation">(</span><span class="token parameter">instance<span class="token punctuation">,</span> listener<span class="token punctuation">,</span> currentTarget</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
  <span class="token keyword">return</span> <span class="token punctuation">{</span> instance<span class="token punctuation">,</span> listener<span class="token punctuation">,</span> currentTarget <span class="token punctuation">}</span><span class="token punctuation">;</span>
<span class="token punctuation">}</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="getlistener-js" tabindex="-1"><a class="header-anchor" href="#getlistener-js" aria-hidden="true">#</a> getListener.js</h3><div class="language-javascript line-numbers-mode" data-ext="js"><pre class="language-javascript"><code><span class="token keyword">import</span> <span class="token punctuation">{</span> getFiberCurrentPropsFromNode <span class="token punctuation">}</span> <span class="token keyword">from</span> <span class="token string">&quot;react-dom/src/client/ReactDOMComponentTree&quot;</span><span class="token punctuation">;</span>

<span class="token doc-comment comment">/**
 * 获取此fiber上对应的回调函数
 * <span class="token keyword">@param</span> <span class="token parameter">inst</span>
 * <span class="token keyword">@param</span> <span class="token parameter">registrationName</span>
 */</span>

<span class="token keyword">export</span> <span class="token keyword">default</span> <span class="token keyword">function</span> <span class="token function">getListener</span><span class="token punctuation">(</span><span class="token parameter">inst<span class="token punctuation">,</span> registrationName</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
  <span class="token keyword">const</span> <span class="token punctuation">{</span> stateNode <span class="token punctuation">}</span> <span class="token operator">=</span> inst<span class="token punctuation">;</span>
  <span class="token keyword">if</span> <span class="token punctuation">(</span>stateNode <span class="token operator">===</span> <span class="token keyword">null</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
    <span class="token keyword">return</span> <span class="token keyword">null</span><span class="token punctuation">;</span>
  <span class="token punctuation">}</span>
  <span class="token keyword">const</span> props <span class="token operator">=</span> <span class="token function">getFiberCurrentPropsFromNode</span><span class="token punctuation">(</span>stateNode<span class="token punctuation">)</span><span class="token punctuation">;</span>
  <span class="token keyword">if</span> <span class="token punctuation">(</span>props <span class="token operator">===</span> <span class="token keyword">null</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
    <span class="token keyword">return</span> <span class="token keyword">null</span><span class="token punctuation">;</span>
  <span class="token punctuation">}</span>
  <span class="token keyword">const</span> listener <span class="token operator">=</span> props<span class="token punctuation">[</span>registrationName<span class="token punctuation">]</span><span class="token punctuation">;</span> <span class="token comment">// props.onClick</span>
  <span class="token keyword">return</span> listener<span class="token punctuation">;</span>
<span class="token punctuation">}</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="simpleeventplugin-js-1" tabindex="-1"><a class="header-anchor" href="#simpleeventplugin-js-1" aria-hidden="true">#</a> SimpleEventPlugin.js</h3><div class="language-javascript line-numbers-mode" data-ext="js"><pre class="language-javascript"><code><span class="token keyword">import</span> <span class="token punctuation">{</span>
  registerSimpleEvents<span class="token punctuation">,</span>
  topLevelEventsTOReactNames<span class="token punctuation">,</span>
<span class="token punctuation">}</span> <span class="token keyword">from</span> <span class="token string">&quot;../DOMEventProperties&quot;</span><span class="token punctuation">;</span>
<span class="token keyword">import</span> <span class="token punctuation">{</span> <span class="token constant">IS_CAPTURE_PHASE</span> <span class="token punctuation">}</span> <span class="token keyword">from</span> <span class="token string">&quot;react-dom/src/events/EventSystemFlags&quot;</span><span class="token punctuation">;</span>
<span class="token keyword">import</span> <span class="token punctuation">{</span> SyntheticMouseEvent <span class="token punctuation">}</span> <span class="token keyword">from</span> <span class="token string">&quot;../SyntheticEvent&quot;</span><span class="token punctuation">;</span>

<span class="token doc-comment comment">/**
 * 把要执行的回调函数添加到派发队列中
 * <span class="token keyword">@param</span> <span class="token parameter">dispatchQueue</span> 派发队列，里面放置监听函数
 * <span class="token keyword">@param</span> <span class="token parameter">domEventName</span> DOM事件名，click
 * <span class="token keyword">@param</span> <span class="token parameter">targetInst</span> 目标fiber
 * <span class="token keyword">@param</span> <span class="token parameter">nativeEvent</span> 原生事件
 * <span class="token keyword">@param</span> <span class="token parameter">nativeEventTarget</span> 原生事件源
 * <span class="token keyword">@param</span> <span class="token parameter">eventSystemFlags</span> 事件系统标识 0冒泡 4捕获
 * <span class="token keyword">@param</span> <span class="token parameter">targetContainer</span> 目标容器 div#root
 */</span>
<span class="token keyword">function</span> <span class="token function">extractEvents</span><span class="token punctuation">(</span>
  dispatchQueue<span class="token punctuation">,</span>
  domEventName<span class="token punctuation">,</span>
  targetInst<span class="token punctuation">,</span>
  nativeEvent<span class="token punctuation">,</span>
  nativeEventTarget<span class="token punctuation">,</span> <span class="token comment">// click =&gt; onClick</span>
  eventSystemFlags<span class="token punctuation">,</span>
  targetContainer
<span class="token punctuation">)</span> <span class="token punctuation">{</span>
  <span class="token keyword">const</span> reactName <span class="token operator">=</span> topLevelEventsTOReactNames<span class="token punctuation">.</span><span class="token function">get</span><span class="token punctuation">(</span>domEventName<span class="token punctuation">)</span><span class="token punctuation">;</span> <span class="token comment">// click =&gt; onClick</span>
  <span class="token keyword">let</span> SyntheticEventCtor<span class="token punctuation">;</span> <span class="token comment">// 合成事件的构造函数</span>
  <span class="token keyword">switch</span> <span class="token punctuation">(</span>domEventName<span class="token punctuation">)</span> <span class="token punctuation">{</span>
    <span class="token keyword">case</span> <span class="token string">&quot;click&quot;</span><span class="token operator">:</span>
      SyntheticEventCtor <span class="token operator">=</span> SyntheticMouseEvent<span class="token punctuation">;</span>
      <span class="token keyword">break</span><span class="token punctuation">;</span>
    <span class="token keyword">default</span><span class="token operator">:</span>
      <span class="token keyword">break</span><span class="token punctuation">;</span>
  <span class="token punctuation">}</span>
  <span class="token comment">// 检查是否捕获阶段</span>
  <span class="token keyword">const</span> inCapturePhase <span class="token operator">=</span> <span class="token punctuation">(</span>eventSystemFlags <span class="token operator">&amp;</span> <span class="token constant">IS_CAPTURE_PHASE</span><span class="token punctuation">)</span> <span class="token operator">!==</span> <span class="token number">0</span><span class="token punctuation">;</span> <span class="token comment">// 是否是捕获阶段</span>
  <span class="token comment">// 累加单个阶段的监听</span>
  <span class="token keyword">const</span> listeners <span class="token operator">=</span> <span class="token function">accumulateSinglePhaseListeners</span><span class="token punctuation">(</span>
    targetInst<span class="token punctuation">,</span>
    reactName<span class="token punctuation">,</span>
    nativeEvent<span class="token punctuation">.</span>type<span class="token punctuation">,</span>
    inCapturePhase
  <span class="token punctuation">)</span><span class="token punctuation">;</span>
  <span class="token comment">// 如果有要执行的监听函数[onClickCapture, onClickCapture] = [ChildCapture, ParentCapture]</span>
  <span class="token keyword">if</span> <span class="token punctuation">(</span>listeners<span class="token punctuation">.</span>length <span class="token operator">&gt;</span> <span class="token number">0</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
    <span class="token keyword">const</span> event <span class="token operator">=</span> <span class="token keyword">new</span> <span class="token class-name">SyntheticEventCtor</span><span class="token punctuation">(</span>
      reactName<span class="token punctuation">,</span>
      domEventName<span class="token punctuation">,</span>
      <span class="token keyword">null</span><span class="token punctuation">,</span>
      nativeEvent<span class="token punctuation">,</span>
      nativeEventTarget
    <span class="token punctuation">)</span><span class="token punctuation">;</span>
    dispatchQueue<span class="token punctuation">.</span><span class="token function">push</span><span class="token punctuation">(</span><span class="token punctuation">{</span>
      event<span class="token punctuation">,</span> <span class="token comment">// 合成事件实例</span>
      listeners<span class="token punctuation">,</span> <span class="token comment">// 监听函数数组</span>
    <span class="token punctuation">}</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
  <span class="token punctuation">}</span>
<span class="token punctuation">}</span>

<span class="token keyword">export</span> <span class="token punctuation">{</span> registerSimpleEvents <span class="token keyword">as</span> registerEvents<span class="token punctuation">,</span> extractEvents <span class="token punctuation">}</span><span class="token punctuation">;</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="syntheticevent-js" tabindex="-1"><a class="header-anchor" href="#syntheticevent-js" aria-hidden="true">#</a> SyntheticEvent.js</h3><p>这个方法的主要作用是融合 React 事件的 Event 和原生事件的 Event</p><div class="language-javascript line-numbers-mode" data-ext="js"><pre class="language-javascript"><code><span class="token keyword">import</span> hasOwnProperty <span class="token keyword">from</span> <span class="token string">&quot;shared/hasOwnProperty&quot;</span><span class="token punctuation">;</span>
<span class="token keyword">import</span> assign <span class="token keyword">from</span> <span class="token string">&quot;shared/assign&quot;</span><span class="token punctuation">;</span>

<span class="token keyword">function</span> <span class="token function">functionThatReturnsTrue</span><span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
  <span class="token keyword">return</span> <span class="token boolean">true</span><span class="token punctuation">;</span>
<span class="token punctuation">}</span>

<span class="token keyword">function</span> <span class="token function">functionThatReturnsFalse</span><span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
  <span class="token keyword">return</span> <span class="token boolean">false</span><span class="token punctuation">;</span>
<span class="token punctuation">}</span>

<span class="token keyword">const</span> MouseEventInterface <span class="token operator">=</span> <span class="token punctuation">{</span>
  <span class="token literal-property property">clientX</span><span class="token operator">:</span> <span class="token number">0</span><span class="token punctuation">,</span>
  <span class="token literal-property property">clientY</span><span class="token operator">:</span> <span class="token number">0</span><span class="token punctuation">,</span>
<span class="token punctuation">}</span><span class="token punctuation">;</span>

<span class="token keyword">function</span> <span class="token function">createSyntheticEvent</span><span class="token punctuation">(</span><span class="token parameter">inter</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
  <span class="token doc-comment comment">/**
   * 合成事件的基类
   * <span class="token keyword">@param</span> <span class="token parameter">reactName</span> react的属性名 onClick
   * <span class="token keyword">@param</span> <span class="token parameter">reactEventType</span> react时间类型 click
   * <span class="token keyword">@param</span> <span class="token parameter">targetInst</span> 事件源对应的fiber实例
   * <span class="token keyword">@param</span> <span class="token parameter">nativeEvent</span> 原生事件对象
   * <span class="token keyword">@param</span> <span class="token parameter">nativeEventTarget</span> 原生事件源 真实DOM
   * <span class="token keyword">@constructor</span>
   */</span>
  <span class="token keyword">function</span> <span class="token function">SyntheticBaseEvent</span><span class="token punctuation">(</span>
    <span class="token parameter">reactName<span class="token punctuation">,</span>
    reactEventType<span class="token punctuation">,</span>
    targetInst<span class="token punctuation">,</span>
    nativeEvent<span class="token punctuation">,</span>
    nativeEventTarget</span>
  <span class="token punctuation">)</span> <span class="token punctuation">{</span>
    <span class="token keyword">this</span><span class="token punctuation">.</span>_reactName <span class="token operator">=</span> reactName<span class="token punctuation">;</span>
    <span class="token keyword">this</span><span class="token punctuation">.</span>type <span class="token operator">=</span> reactEventType<span class="token punctuation">;</span>
    <span class="token keyword">this</span><span class="token punctuation">.</span>_targetInst <span class="token operator">=</span> targetInst<span class="token punctuation">;</span>
    <span class="token keyword">this</span><span class="token punctuation">.</span>nativeEvent <span class="token operator">=</span> nativeEvent<span class="token punctuation">;</span>
    <span class="token keyword">this</span><span class="token punctuation">.</span>target <span class="token operator">=</span> nativeEventTarget<span class="token punctuation">;</span>
    <span class="token comment">// 把此接口上对应的属性从原生事件上拷贝到合成事件实例上</span>
    <span class="token keyword">for</span> <span class="token punctuation">(</span><span class="token keyword">const</span> propName <span class="token keyword">in</span> inter<span class="token punctuation">)</span> <span class="token punctuation">{</span>
      <span class="token keyword">if</span> <span class="token punctuation">(</span><span class="token operator">!</span><span class="token function">hasOwnProperty</span><span class="token punctuation">.</span><span class="token function">call</span><span class="token punctuation">(</span>inter<span class="token punctuation">,</span> propName<span class="token punctuation">)</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
        <span class="token keyword">continue</span><span class="token punctuation">;</span>
      <span class="token punctuation">}</span>
      <span class="token keyword">this</span><span class="token punctuation">[</span>propName<span class="token punctuation">]</span> <span class="token operator">=</span> nativeEvent<span class="token punctuation">[</span>propName<span class="token punctuation">]</span><span class="token punctuation">;</span>
    <span class="token punctuation">}</span>
    <span class="token comment">// 是否已阻止默认事件</span>
    <span class="token keyword">this</span><span class="token punctuation">.</span>isDefaultPrevented <span class="token operator">=</span> functionThatReturnsFalse<span class="token punctuation">;</span>
    <span class="token comment">// 是否已阻止继续传播</span>
    <span class="token keyword">this</span><span class="token punctuation">.</span>isPropagationStopped <span class="token operator">=</span> functionThatReturnsFalse<span class="token punctuation">;</span>
    <span class="token keyword">return</span> <span class="token keyword">this</span><span class="token punctuation">;</span>
  <span class="token punctuation">}</span>
  <span class="token function">assign</span><span class="token punctuation">(</span><span class="token class-name">SyntheticBaseEvent</span><span class="token punctuation">.</span>prototype<span class="token punctuation">,</span> <span class="token punctuation">{</span>
    <span class="token function">preventDefault</span><span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
      <span class="token keyword">const</span> event <span class="token operator">=</span> <span class="token keyword">this</span><span class="token punctuation">.</span>nativeEvent<span class="token punctuation">;</span>
      <span class="token keyword">if</span> <span class="token punctuation">(</span>event<span class="token punctuation">.</span>preventDefault<span class="token punctuation">)</span> <span class="token punctuation">{</span>
        event<span class="token punctuation">.</span><span class="token function">preventDefault</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
      <span class="token punctuation">}</span> <span class="token keyword">else</span> <span class="token punctuation">{</span>
        event<span class="token punctuation">.</span>returnValue <span class="token operator">=</span> <span class="token boolean">false</span><span class="token punctuation">;</span>
      <span class="token punctuation">}</span>
      <span class="token keyword">this</span><span class="token punctuation">.</span>isDefaultPrevented <span class="token operator">=</span> functionThatReturnsTrue<span class="token punctuation">;</span>
    <span class="token punctuation">}</span><span class="token punctuation">,</span>
    <span class="token function">stopPropagation</span><span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
      <span class="token keyword">const</span> event <span class="token operator">=</span> <span class="token keyword">this</span><span class="token punctuation">.</span>nativeEvent<span class="token punctuation">;</span>
      <span class="token keyword">if</span> <span class="token punctuation">(</span>event<span class="token punctuation">.</span>stopPropagation<span class="token punctuation">)</span> <span class="token punctuation">{</span>
        event<span class="token punctuation">.</span><span class="token function">stopPropagation</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
      <span class="token punctuation">}</span> <span class="token keyword">else</span> <span class="token punctuation">{</span>
        event<span class="token punctuation">.</span>cancelBubble <span class="token operator">=</span> <span class="token boolean">true</span><span class="token punctuation">;</span>
      <span class="token punctuation">}</span>
      <span class="token keyword">this</span><span class="token punctuation">.</span>isPropagationStopped <span class="token operator">=</span> functionThatReturnsTrue<span class="token punctuation">;</span>
    <span class="token punctuation">}</span><span class="token punctuation">,</span>
  <span class="token punctuation">}</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
  <span class="token keyword">return</span> SyntheticBaseEvent<span class="token punctuation">;</span>
<span class="token punctuation">}</span>

<span class="token keyword">export</span> <span class="token keyword">const</span> SyntheticMouseEvent <span class="token operator">=</span> <span class="token function">createSyntheticEvent</span><span class="token punctuation">(</span>MouseEventInterface<span class="token punctuation">)</span><span class="token punctuation">;</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h2 id="事件处理" tabindex="-1"><a class="header-anchor" href="#事件处理" aria-hidden="true">#</a> 事件处理</h2><p>在回调函数执行完成 extractEvents 之后，实际上 dispatchQueue 就已经成功储存到所有基于事件捕获和事件冒泡的两套回调函数的数组了，接下来需要根据捕获顺序和冒泡顺序处理派发事件 processDispatchQueue</p><h3 id="domplugineventsystem-js-3" tabindex="-1"><a class="header-anchor" href="#domplugineventsystem-js-3" aria-hidden="true">#</a> DOMPluginEventSystem.js</h3><div class="language-javascript line-numbers-mode" data-ext="js"><pre class="language-javascript"><code><span class="token keyword">function</span> <span class="token function">dispatchEventForPlugins</span><span class="token punctuation">(</span>
  <span class="token parameter">domEventName<span class="token punctuation">,</span>
  eventSystemFlags<span class="token punctuation">,</span>
  nativeEvent<span class="token punctuation">,</span>
  targetInst<span class="token punctuation">,</span>
  targetContainer</span>
<span class="token punctuation">)</span> <span class="token punctuation">{</span>
  <span class="token keyword">const</span> nativeEventTarget <span class="token operator">=</span> <span class="token function">getEventTarget</span><span class="token punctuation">(</span>nativeEvent<span class="token punctuation">)</span><span class="token punctuation">;</span>
  <span class="token comment">// 派发事件的数组</span>
  <span class="token keyword">const</span> dispatchQueue <span class="token operator">=</span> <span class="token punctuation">[</span><span class="token punctuation">]</span><span class="token punctuation">;</span>
  <span class="token function">extractEvents</span><span class="token punctuation">(</span>
    dispatchQueue<span class="token punctuation">,</span>
    domEventName<span class="token punctuation">,</span>
    targetInst<span class="token punctuation">,</span>
    nativeEvent<span class="token punctuation">,</span>
    nativeEventTarget<span class="token punctuation">,</span>
    eventSystemFlags<span class="token punctuation">,</span>
    targetContainer
  <span class="token punctuation">)</span><span class="token punctuation">;</span>
  <span class="token comment">// processDispatchQueue 处理派发事件</span>
  <span class="token function">processDispatchQueue</span><span class="token punctuation">(</span>dispatchQueue<span class="token punctuation">,</span> eventSystemFlags<span class="token punctuation">)</span><span class="token punctuation">;</span>
<span class="token punctuation">}</span>

<span class="token keyword">function</span> <span class="token function">processDispatchQueue</span><span class="token punctuation">(</span><span class="token parameter">dispatchQueue<span class="token punctuation">,</span> eventSystemFlags</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
  <span class="token comment">// 判断是否捕获阶段</span>
  <span class="token keyword">const</span> inCapturePhase <span class="token operator">=</span> <span class="token punctuation">(</span>eventSystemFlags <span class="token operator">&amp;</span> <span class="token constant">IS_CAPTURE_PHASE</span><span class="token punctuation">)</span> <span class="token operator">!==</span> <span class="token number">0</span><span class="token punctuation">;</span>
  <span class="token comment">// 循环派发队列</span>
  <span class="token keyword">for</span> <span class="token punctuation">(</span><span class="token keyword">let</span> i <span class="token operator">=</span> <span class="token number">0</span><span class="token punctuation">;</span> i <span class="token operator">&lt;=</span> dispatchQueue<span class="token punctuation">.</span>length <span class="token operator">-</span> <span class="token number">1</span><span class="token punctuation">;</span> i<span class="token operator">++</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
    <span class="token keyword">const</span> <span class="token punctuation">{</span> event<span class="token punctuation">,</span> listeners <span class="token punctuation">}</span> <span class="token operator">=</span> dispatchQueue<span class="token punctuation">[</span>i<span class="token punctuation">]</span><span class="token punctuation">;</span>
    <span class="token function">processDispatchQueueItemsInOrder</span><span class="token punctuation">(</span>event<span class="token punctuation">,</span> listeners<span class="token punctuation">,</span> inCapturePhase<span class="token punctuation">)</span><span class="token punctuation">;</span>
  <span class="token punctuation">}</span>
<span class="token punctuation">}</span>

<span class="token doc-comment comment">/**
 * 合成事件的实例currentTarget是在不断变化的
 * event nativeEventTarget指的是原始事件源，永远不变
 * event currentTarget 当前的事件源，会随着事件回调执行不断变化
 * <span class="token keyword">@param</span> <span class="token parameter">listener</span>
 * <span class="token keyword">@param</span> <span class="token parameter">event</span>
 * <span class="token keyword">@param</span> <span class="token parameter">currentTarget</span>
 */</span>
<span class="token keyword">function</span> <span class="token function">executeDispatch</span><span class="token punctuation">(</span><span class="token parameter">listener<span class="token punctuation">,</span> event<span class="token punctuation">,</span> currentTarget</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
  event<span class="token punctuation">.</span>currentTarget <span class="token operator">=</span> currentTarget<span class="token punctuation">;</span>
  <span class="token function">listener</span><span class="token punctuation">(</span>event<span class="token punctuation">)</span><span class="token punctuation">;</span>
<span class="token punctuation">}</span>

<span class="token keyword">function</span> <span class="token function">processDispatchQueueItemsInOrder</span><span class="token punctuation">(</span>
  <span class="token parameter">event<span class="token punctuation">,</span>
  dispatchListeners<span class="token punctuation">,</span>
  inCapturePhase</span>
<span class="token punctuation">)</span> <span class="token punctuation">{</span>
  <span class="token keyword">if</span> <span class="token punctuation">(</span>inCapturePhase<span class="token punctuation">)</span> <span class="token punctuation">{</span>
    <span class="token comment">// dispatchListeners[子，父]</span>
    <span class="token keyword">for</span> <span class="token punctuation">(</span><span class="token keyword">let</span> i <span class="token operator">=</span> dispatchListeners<span class="token punctuation">.</span>length <span class="token operator">-</span> <span class="token number">1</span><span class="token punctuation">;</span> i <span class="token operator">&gt;=</span> <span class="token number">0</span><span class="token punctuation">;</span> i<span class="token operator">--</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
      <span class="token keyword">const</span> <span class="token punctuation">{</span> listener<span class="token punctuation">,</span> currentTarget <span class="token punctuation">}</span> <span class="token operator">=</span> dispatchListeners<span class="token punctuation">[</span>i<span class="token punctuation">]</span><span class="token punctuation">;</span>
      <span class="token keyword">if</span> <span class="token punctuation">(</span>event<span class="token punctuation">.</span><span class="token function">isPropagationStopped</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
        <span class="token keyword">return</span><span class="token punctuation">;</span>
      <span class="token punctuation">}</span>
      <span class="token function">executeDispatch</span><span class="token punctuation">(</span>listener<span class="token punctuation">,</span> event<span class="token punctuation">,</span> currentTarget<span class="token punctuation">)</span><span class="token punctuation">;</span>
    <span class="token punctuation">}</span>
  <span class="token punctuation">}</span> <span class="token keyword">else</span> <span class="token punctuation">{</span>
    <span class="token comment">// dispatchListeners[父，子]</span>
    <span class="token keyword">for</span> <span class="token punctuation">(</span><span class="token keyword">let</span> i <span class="token operator">=</span> <span class="token number">0</span><span class="token punctuation">;</span> i <span class="token operator">&lt;=</span> dispatchListeners<span class="token punctuation">.</span>length <span class="token operator">-</span> <span class="token number">1</span><span class="token punctuation">;</span> i<span class="token operator">++</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
      <span class="token keyword">const</span> <span class="token punctuation">{</span> listener<span class="token punctuation">,</span> currentTarget <span class="token punctuation">}</span> <span class="token operator">=</span> dispatchListeners<span class="token punctuation">[</span>i<span class="token punctuation">]</span><span class="token punctuation">;</span>
      <span class="token keyword">if</span> <span class="token punctuation">(</span>event<span class="token punctuation">.</span><span class="token function">isPropagationStopped</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
        <span class="token keyword">return</span><span class="token punctuation">;</span>
      <span class="token punctuation">}</span>
      <span class="token function">executeDispatch</span><span class="token punctuation">(</span>listener<span class="token punctuation">,</span> event<span class="token punctuation">,</span> currentTarget<span class="token punctuation">)</span><span class="token punctuation">;</span>
    <span class="token punctuation">}</span>
  <span class="token punctuation">}</span>
<span class="token punctuation">}</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h2 id="容易忽略的点" tabindex="-1"><a class="header-anchor" href="#容易忽略的点" aria-hidden="true">#</a> 容易忽略的点</h2><p>在 accumulateSinglePhaseListeners 累加回调函数阶段</p><ol><li>我们对当前 Fiber 节点进行 return 循环，逐步获取上级 Fiber 的节点和 DOM 元素</li><li>我们从 getListener 中获取到了匹配 React 合成事件名的回调函数，加入回调数组</li></ol><p>但是</p><ol><li>如何获取当前最近的 Fiber 节点？</li><li>从何获取 JSX 上绑定的事件回调函数？</li></ol><p>实际上，我们需要对 Fiber 方法中的创建实例的函数进行修改，让 Fiber 对应的 DOM 元素绑定预存 Fiber 节点和 props</p><h3 id="reactdomhostconfig-js" tabindex="-1"><a class="header-anchor" href="#reactdomhostconfig-js" aria-hidden="true">#</a> ReactDOMHostConfig.js</h3><div class="language-javascript line-numbers-mode" data-ext="js"><pre class="language-javascript"><code><span class="token keyword">export</span> <span class="token keyword">function</span> <span class="token function">createInstance</span><span class="token punctuation">(</span><span class="token parameter">type<span class="token punctuation">,</span> props<span class="token punctuation">,</span> internalInstanceHandle</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
  <span class="token keyword">const</span> domElement <span class="token operator">=</span> document<span class="token punctuation">.</span><span class="token function">createElement</span><span class="token punctuation">(</span>type<span class="token punctuation">)</span><span class="token punctuation">;</span>
  <span class="token comment">// 预先缓存fiber节点到DOM节点上</span>
  <span class="token function">precacheFiberNode</span><span class="token punctuation">(</span>internalInstanceHandle<span class="token punctuation">,</span> domElement<span class="token punctuation">)</span><span class="token punctuation">;</span>
  <span class="token comment">// 属性的添加TODO</span>
  <span class="token function">updateFiberProps</span><span class="token punctuation">(</span>domElement<span class="token punctuation">,</span> props<span class="token punctuation">)</span><span class="token punctuation">;</span>
  <span class="token keyword">return</span> domElement<span class="token punctuation">;</span>
<span class="token punctuation">}</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>这样，便可以在 dispatchEvent 派发事件函数中获取到 target 目标 DOM 上最近的那一个 Fiber 节点</p><div class="language-javascript line-numbers-mode" data-ext="js"><pre class="language-javascript"><code><span class="token keyword">export</span> <span class="token keyword">function</span> <span class="token function">dispatchEvent</span><span class="token punctuation">(</span>
  <span class="token parameter">domEventName<span class="token punctuation">,</span>
  eventSystemFlags<span class="token punctuation">,</span>
  targetContainer<span class="token punctuation">,</span>
  nativeEvent</span>
<span class="token punctuation">)</span> <span class="token punctuation">{</span>
  <span class="token comment">// 获取事件源，它应该是一个真实DOM</span>
  <span class="token keyword">const</span> nativeEventTarget <span class="token operator">=</span> <span class="token function">getEventTarget</span><span class="token punctuation">(</span>nativeEvent<span class="token punctuation">)</span><span class="token punctuation">;</span>
  <span class="token keyword">const</span> targetInst <span class="token operator">=</span> <span class="token function">getClosestInstanceFromNode</span><span class="token punctuation">(</span>nativeEventTarget<span class="token punctuation">)</span><span class="token punctuation">;</span>
  <span class="token function">dispatchEventForPluginEventSystem</span><span class="token punctuation">(</span>
    domEventName<span class="token punctuation">,</span> <span class="token comment">// click</span>
    eventSystemFlags<span class="token punctuation">,</span> <span class="token comment">// 0 4</span>
    nativeEvent<span class="token punctuation">,</span> <span class="token comment">// 原生事件</span>
    targetInst<span class="token punctuation">,</span> <span class="token comment">// 此真实DOM对应的fiber</span>
    targetContainer <span class="token comment">// 目标容器</span>
  <span class="token punctuation">)</span><span class="token punctuation">;</span>
<span class="token punctuation">}</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="accumulatesinglephaselisteners-js" tabindex="-1"><a class="header-anchor" href="#accumulatesinglephaselisteners-js" aria-hidden="true">#</a> accumulateSinglePhaseListeners.js</h3><p>累加回调也能通过上面透传的 targetInst(targetFiber)，执行 return 循环查找</p><div class="language-javascript line-numbers-mode" data-ext="js"><pre class="language-javascript"><code><span class="token keyword">export</span> <span class="token keyword">function</span> <span class="token function">accumulateSinglePhaseListeners</span><span class="token punctuation">(</span>
  <span class="token parameter">targetFiber<span class="token punctuation">,</span>
  reactName<span class="token punctuation">,</span>
  nativeEventType<span class="token punctuation">,</span>
  isCapturePhase</span>
<span class="token punctuation">)</span> <span class="token punctuation">{</span>
  <span class="token keyword">const</span> captureName <span class="token operator">=</span> reactName <span class="token operator">+</span> <span class="token string">&quot;Capture&quot;</span><span class="token punctuation">;</span>
  <span class="token keyword">const</span> reactEventName <span class="token operator">=</span> isCapturePhase <span class="token operator">?</span> captureName <span class="token operator">:</span> reactName<span class="token punctuation">;</span>
  <span class="token keyword">const</span> listeners <span class="token operator">=</span> <span class="token punctuation">[</span><span class="token punctuation">]</span><span class="token punctuation">;</span>
  <span class="token keyword">let</span> instance <span class="token operator">=</span> targetFiber<span class="token punctuation">;</span>
  <span class="token keyword">while</span> <span class="token punctuation">(</span>instance <span class="token operator">!==</span> <span class="token keyword">null</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
    <span class="token keyword">const</span> <span class="token punctuation">{</span> stateNode<span class="token punctuation">,</span> tag <span class="token punctuation">}</span> <span class="token operator">=</span> instance<span class="token punctuation">;</span>
    <span class="token keyword">if</span> <span class="token punctuation">(</span>tag <span class="token operator">===</span> HostComponent <span class="token operator">&amp;&amp;</span> stateNode <span class="token operator">!==</span> <span class="token keyword">null</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
      <span class="token keyword">const</span> listener <span class="token operator">=</span> <span class="token function">getListener</span><span class="token punctuation">(</span>instance<span class="token punctuation">,</span> reactEventName<span class="token punctuation">)</span><span class="token punctuation">;</span>
      <span class="token keyword">if</span> <span class="token punctuation">(</span>listener<span class="token punctuation">)</span> <span class="token punctuation">{</span>
        listeners<span class="token punctuation">.</span><span class="token function">push</span><span class="token punctuation">(</span><span class="token function">createDispatchListener</span><span class="token punctuation">(</span>instance<span class="token punctuation">,</span> listener<span class="token punctuation">,</span> stateNode<span class="token punctuation">)</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
      <span class="token punctuation">}</span>
    <span class="token punctuation">}</span>
    instance <span class="token operator">=</span> instance<span class="token punctuation">.</span>return<span class="token punctuation">;</span>
  <span class="token punctuation">}</span>
  <span class="token keyword">return</span> listeners<span class="token punctuation">;</span>
<span class="token punctuation">}</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="getlistener-js-1" tabindex="-1"><a class="header-anchor" href="#getlistener-js-1" aria-hidden="true">#</a> getListener.js</h3><p>同理，在上面需要获取 listener 回调函数的时候，也是能获取到函数的</p><div class="language-javascript line-numbers-mode" data-ext="js"><pre class="language-javascript"><code><span class="token keyword">export</span> <span class="token keyword">default</span> <span class="token keyword">function</span> <span class="token function">getListener</span><span class="token punctuation">(</span><span class="token parameter">inst<span class="token punctuation">,</span> registrationName</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
  <span class="token keyword">const</span> <span class="token punctuation">{</span> stateNode <span class="token punctuation">}</span> <span class="token operator">=</span> inst<span class="token punctuation">;</span>
  <span class="token keyword">if</span> <span class="token punctuation">(</span>stateNode <span class="token operator">===</span> <span class="token keyword">null</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
    <span class="token keyword">return</span> <span class="token keyword">null</span><span class="token punctuation">;</span>
  <span class="token punctuation">}</span>
  <span class="token keyword">const</span> props <span class="token operator">=</span> <span class="token function">getFiberCurrentPropsFromNode</span><span class="token punctuation">(</span>stateNode<span class="token punctuation">)</span><span class="token punctuation">;</span>
  <span class="token keyword">if</span> <span class="token punctuation">(</span>props <span class="token operator">===</span> <span class="token keyword">null</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
    <span class="token keyword">return</span> <span class="token keyword">null</span><span class="token punctuation">;</span>
  <span class="token punctuation">}</span>
  <span class="token keyword">const</span> listener <span class="token operator">=</span> props<span class="token punctuation">[</span>registrationName<span class="token punctuation">]</span><span class="token punctuation">;</span> <span class="token comment">// props.onClick</span>
  <span class="token keyword">return</span> listener<span class="token punctuation">;</span>
<span class="token punctuation">}</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h2 id="流程图" tabindex="-1"><a class="header-anchor" href="#流程图" aria-hidden="true">#</a> 流程图</h2><p>事件监听流程图</p><p><img src="https://misaka10032.oss-cn-chengdu.aliyuncs.com/React/DOMPluginEventSystem.jpg" alt="DOMPluginEventSystem" loading="lazy"></p><p>事件派发流程图</p><p><img src="https://misaka10032.oss-cn-chengdu.aliyuncs.com/React/extractEvents.jpg" alt="extractEvents" loading="lazy"></p><p>事件处理流程图</p><p><img src="https://misaka10032.oss-cn-chengdu.aliyuncs.com/React/processDispatchQueue.jpg" alt="processDispatchQueue" loading="lazy"></p><h2 id="最终输出结果" tabindex="-1"><a class="header-anchor" href="#最终输出结果" aria-hidden="true">#</a> 最终输出结果</h2><p>main.jsx</p><div class="language-javascript line-numbers-mode" data-ext="js"><pre class="language-javascript"><code><span class="token keyword">import</span> <span class="token punctuation">{</span> createRoot <span class="token punctuation">}</span> <span class="token keyword">from</span> <span class="token string">&quot;react-dom/client&quot;</span><span class="token punctuation">;</span>

<span class="token keyword">function</span> <span class="token function">FunctionComponent</span><span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
  <span class="token keyword">const</span> <span class="token function-variable function">parentBubble</span> <span class="token operator">=</span> <span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token operator">=&gt;</span> <span class="token punctuation">{</span>
    console<span class="token punctuation">.</span><span class="token function">log</span><span class="token punctuation">(</span><span class="token string">&quot;父冒泡&quot;</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
  <span class="token punctuation">}</span><span class="token punctuation">;</span>
  <span class="token keyword">const</span> <span class="token function-variable function">parentCapture</span> <span class="token operator">=</span> <span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token operator">=&gt;</span> <span class="token punctuation">{</span>
    console<span class="token punctuation">.</span><span class="token function">log</span><span class="token punctuation">(</span><span class="token string">&quot;父捕获&quot;</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
  <span class="token punctuation">}</span><span class="token punctuation">;</span>
  <span class="token keyword">const</span> <span class="token function-variable function">childBubble</span> <span class="token operator">=</span> <span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token operator">=&gt;</span> <span class="token punctuation">{</span>
    console<span class="token punctuation">.</span><span class="token function">log</span><span class="token punctuation">(</span><span class="token string">&quot;子冒泡&quot;</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
  <span class="token punctuation">}</span><span class="token punctuation">;</span>
  <span class="token keyword">const</span> <span class="token function-variable function">childCapture</span> <span class="token operator">=</span> <span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token operator">=&gt;</span> <span class="token punctuation">{</span>
    console<span class="token punctuation">.</span><span class="token function">log</span><span class="token punctuation">(</span><span class="token string">&quot;子捕获&quot;</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
  <span class="token punctuation">}</span><span class="token punctuation">;</span>
  <span class="token keyword">return</span> <span class="token punctuation">(</span>
    <span class="token operator">&lt;</span>h1 id<span class="token operator">=</span><span class="token string">&quot;container&quot;</span> onClick<span class="token operator">=</span><span class="token punctuation">{</span>parentBubble<span class="token punctuation">}</span> onClickCapture<span class="token operator">=</span><span class="token punctuation">{</span>parentCapture<span class="token punctuation">}</span><span class="token operator">&gt;</span>
      hello
      <span class="token operator">&lt;</span>span
        style<span class="token operator">=</span><span class="token punctuation">{</span><span class="token punctuation">{</span> <span class="token literal-property property">color</span><span class="token operator">:</span> <span class="token string">&quot;red&quot;</span> <span class="token punctuation">}</span><span class="token punctuation">}</span>
        onClick<span class="token operator">=</span><span class="token punctuation">{</span>childBubble<span class="token punctuation">}</span>
        onClickCapture<span class="token operator">=</span><span class="token punctuation">{</span>childCapture<span class="token punctuation">}</span>
      <span class="token operator">&gt;</span>
        world
      <span class="token operator">&lt;</span><span class="token operator">/</span>span<span class="token operator">&gt;</span>
    <span class="token operator">&lt;</span><span class="token operator">/</span>h1<span class="token operator">&gt;</span>
  <span class="token punctuation">)</span><span class="token punctuation">;</span>
<span class="token punctuation">}</span>
<span class="token keyword">const</span> element <span class="token operator">=</span> <span class="token operator">&lt;</span>FunctionComponent <span class="token operator">/</span><span class="token operator">&gt;</span><span class="token punctuation">;</span>
<span class="token keyword">const</span> root <span class="token operator">=</span> <span class="token function">createRoot</span><span class="token punctuation">(</span>document<span class="token punctuation">.</span><span class="token function">getElementById</span><span class="token punctuation">(</span><span class="token string">&quot;root&quot;</span><span class="token punctuation">)</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
<span class="token comment">// 把element虚拟DOM挂载到容器中</span>
root<span class="token punctuation">.</span><span class="token function">render</span><span class="token punctuation">(</span>element<span class="token punctuation">)</span><span class="token punctuation">;</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>点击 world 之后控制台打印结果：</p><p><img src="https://misaka10032.oss-cn-chengdu.aliyuncs.com/React/eventSystem-result.png" alt="eventSystemResult" loading="lazy"></p><h2 id="手写源码仓库" tabindex="-1"><a class="header-anchor" href="#手写源码仓库" aria-hidden="true">#</a> 手写源码仓库</h2>`,73),r={href:"https://github.com/mi-saka10032/mini-react/tree/master/packages/events",target:"_blank",rel:"noopener noreferrer"};function k(d,v){const s=i("ExternalLinkIcon");return t(),e("div",null,[u,n("p",null,[n("a",r,[p("https://github.com/mi-saka10032/mini-react/tree/master/packages/events"),o(s)])])])}const g=a(l,[["render",k],["__file","3-event.html.vue"]]);export{g as default};
