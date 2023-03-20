import{_ as e}from"./_plugin-vue_export-helper.cdc0426e.js";import{o as p,c as o,e as c,w as i,d as a,r as l,a as n,b as s}from"./app.c7365eef.js";const u={},r=a('<h2 id="react-与-vue-的区别" tabindex="-1"><a class="header-anchor" href="#react-与-vue-的区别" aria-hidden="true">#</a> React 与 Vue 的区别</h2><p>首先，我们需要明确一点，就是 React 跟 Vue 存在一个很大差别的地方：</p><p><strong>Vue 的更新粒度是组件级别的，得益于响应式原理，Vue 能快速地识别出当前更新来源于哪个组件，并只针对于该组件以及受该组件 props 影响的子组件进行定向更新，所以更新速度相对较快</strong></p><p><strong>React 没有响应式更新！！！是基于单向 state 数据流的自顶向下的全节点判断比较式更新，通过 diff 算法比较得出存在 state 或 props 变化的组件，默认对该组件及其子组件进行更新</strong></p><p><strong>在 React 的 v16 版本之前，React 的 diff 更新策略为深度嵌套的虚拟 DOM 树，每次更新都会触发 diff 算法进行循环递归式节点判断，并且这个步骤是同步不可中断的，这就导致了当项目中的内容或节点数量极其庞大时，每次更新都会牵一发而动全身，引发用时较长的更新判断，非常影响用户体验</strong></p><h2 id="帧率与优化" tabindex="-1"><a class="header-anchor" href="#帧率与优化" aria-hidden="true">#</a> 帧率与优化</h2><h3 id="性能瓶颈" tabindex="-1"><a class="header-anchor" href="#性能瓶颈" aria-hidden="true">#</a> 性能瓶颈</h3><p>再延续上面更新用时的话题，详细讨论一下 React16 之前存在的问题：JS 执行时间问题</p><p>浏览器刷新频率为 60Hz，大概 16.6 毫秒渲染一次，而 JS 线程和渲染线程是互斥的，所以如果 JS 线程执行任务时间超过 16.6ms 的话，就会导致掉帧卡顿，解决方案就是 React 利用空闲时间进行更新，不影响渲染进程渲染</p><p>React 团队针对这个问题给出的解决方案就是：把一个耗时任务切分成一个个小任务，分布在每一帧里，也称为时间切片</p><h3 id="屏幕刷新率" tabindex="-1"><a class="header-anchor" href="#屏幕刷新率" aria-hidden="true">#</a> 屏幕刷新率</h3><p>目前大多数设备的屏幕刷新率为 60 次/秒</p><p>浏览器渲染动画或页面的每一帧的速率也需要跟设备屏幕的刷新率保持一致</p><p>页面是一帧一帧绘制出来的，当每秒绘制的帧数（FPS）达到 60 时，页面是流畅的。小于这个值时，用户会感觉到卡顿</p><p>每个帧的预算时间是 16.66 毫秒（1 秒/60）</p><p>1s60 帧，所以每一帧分到的时间就是 1000/60 ≈ 16ms，所以我们书写代码时力求不让一帧的工作量超过 16ms</p><h3 id="帧" tabindex="-1"><a class="header-anchor" href="#帧" aria-hidden="true">#</a> 帧</h3><p>每个帧的开头包括样式计算、布局和绘制</p><p>JS 执行 JS 引擎和页面渲染引擎在同一个渲染线程，GUI 渲染和 JS 执行两者互斥</p><p>如果某个任务执行时间过长，浏览器会推迟渲染</p><p><img src="https://misaka10032.oss-cn-chengdu.aliyuncs.com/React/lifeofframe.jpg" alt="帧执行过程" loading="lazy"></p><h3 id="requestidlecallback" tabindex="-1"><a class="header-anchor" href="#requestidlecallback" aria-hidden="true">#</a> requestIdleCallback</h3><p>我们希望快速响应用户，让用户觉得够快，不能阻塞用户的交互</p><p>requestIdleCallback 使开发者能够在主事件循环上执行后台和低优先级工作，而不会影响延迟关键事件，如动画和输入响应</p><p>正常帧任务完成后没超过 16ms，说明时间有富余，此时就会执行 requestIdleCallback 里注册的任务</p><p><img src="https://misaka10032.oss-cn-chengdu.aliyuncs.com/React/cooperativescheduling.jpg" alt="requestIdleCallback流程" loading="lazy"></p><p>以下是一个实现了 requestIdleCallback 的 demo，可以打开控制台查看按钮点击后的结果</p>',27),k=n("div",{class:"language-html line-numbers-mode","data-ext":"html"},[n("pre",{class:"language-html"},[n("code",null,[n("span",{class:"token tag"},[n("span",{class:"token tag"},[n("span",{class:"token punctuation"},"<"),s("button")]),s(),n("span",{class:"token attr-name"},"id"),n("span",{class:"token attr-value"},[n("span",{class:"token punctuation attr-equals"},"="),n("span",{class:"token punctuation"},'"'),s("btn"),n("span",{class:"token punctuation"},'"')]),n("span",{class:"token punctuation"},">")]),s("点击开始验证requestIdleCallback"),n("span",{class:"token tag"},[n("span",{class:"token tag"},[n("span",{class:"token punctuation"},"</"),s("button")]),n("span",{class:"token punctuation"},">")]),s(`
`)])]),n("div",{class:"line-numbers","aria-hidden":"true"},[n("div",{class:"line-number"})])],-1),d=n("div",{class:"language-javascript line-numbers-mode","data-ext":"js"},[n("pre",{class:"language-javascript"},[n("code",null,[n("span",{class:"token keyword"},"function"),s(),n("span",{class:"token function"},"sleep"),n("span",{class:"token punctuation"},"("),n("span",{class:"token parameter"},"duration"),n("span",{class:"token punctuation"},")"),s(),n("span",{class:"token punctuation"},"{"),s(`
  `),n("span",{class:"token keyword"},"for"),s(),n("span",{class:"token punctuation"},"("),n("span",{class:"token keyword"},"let"),s(" t "),n("span",{class:"token operator"},"="),s(" Date"),n("span",{class:"token punctuation"},"."),n("span",{class:"token function"},"now"),n("span",{class:"token punctuation"},"("),n("span",{class:"token punctuation"},")"),n("span",{class:"token punctuation"},";"),s(" Date"),n("span",{class:"token punctuation"},"."),n("span",{class:"token function"},"now"),n("span",{class:"token punctuation"},"("),n("span",{class:"token punctuation"},")"),s(),n("span",{class:"token operator"},"-"),s(" t "),n("span",{class:"token operator"},"<="),s(" duration"),n("span",{class:"token punctuation"},";"),s(),n("span",{class:"token punctuation"},")"),s(),n("span",{class:"token punctuation"},"{"),n("span",{class:"token punctuation"},"}"),s(`
`),n("span",{class:"token punctuation"},"}"),s(`
`),n("span",{class:"token keyword"},"const"),s(" works "),n("span",{class:"token operator"},"="),s(),n("span",{class:"token punctuation"},"["),s(`
  `),n("span",{class:"token punctuation"},"("),n("span",{class:"token punctuation"},")"),s(),n("span",{class:"token operator"},"=>"),s(),n("span",{class:"token punctuation"},"{"),s(`
    console`),n("span",{class:"token punctuation"},"."),n("span",{class:"token function"},"log"),n("span",{class:"token punctuation"},"("),n("span",{class:"token string"},'"第一个任务开始"'),n("span",{class:"token punctuation"},")"),n("span",{class:"token punctuation"},";"),s(`
    `),n("span",{class:"token function"},"sleep"),n("span",{class:"token punctuation"},"("),n("span",{class:"token number"},"1000"),n("span",{class:"token punctuation"},")"),n("span",{class:"token punctuation"},";"),s(`
    console`),n("span",{class:"token punctuation"},"."),n("span",{class:"token function"},"log"),n("span",{class:"token punctuation"},"("),n("span",{class:"token string"},'"第一个任务结束"'),n("span",{class:"token punctuation"},")"),n("span",{class:"token punctuation"},";"),s(`
  `),n("span",{class:"token punctuation"},"}"),n("span",{class:"token punctuation"},","),s(`
  `),n("span",{class:"token punctuation"},"("),n("span",{class:"token punctuation"},")"),s(),n("span",{class:"token operator"},"=>"),s(),n("span",{class:"token punctuation"},"{"),s(`
    console`),n("span",{class:"token punctuation"},"."),n("span",{class:"token function"},"log"),n("span",{class:"token punctuation"},"("),n("span",{class:"token string"},'"第二个任务开始"'),n("span",{class:"token punctuation"},")"),n("span",{class:"token punctuation"},";"),s(`
    `),n("span",{class:"token function"},"sleep"),n("span",{class:"token punctuation"},"("),n("span",{class:"token number"},"500"),n("span",{class:"token punctuation"},")"),n("span",{class:"token punctuation"},";"),s(`
    console`),n("span",{class:"token punctuation"},"."),n("span",{class:"token function"},"log"),n("span",{class:"token punctuation"},"("),n("span",{class:"token string"},'"第二个任务结束"'),n("span",{class:"token punctuation"},")"),n("span",{class:"token punctuation"},";"),s(`
  `),n("span",{class:"token punctuation"},"}"),n("span",{class:"token punctuation"},","),s(`
  `),n("span",{class:"token punctuation"},"("),n("span",{class:"token punctuation"},")"),s(),n("span",{class:"token operator"},"=>"),s(),n("span",{class:"token punctuation"},"{"),s(`
    console`),n("span",{class:"token punctuation"},"."),n("span",{class:"token function"},"log"),n("span",{class:"token punctuation"},"("),n("span",{class:"token string"},'"第三个任务开始"'),n("span",{class:"token punctuation"},")"),n("span",{class:"token punctuation"},";"),s(`
    `),n("span",{class:"token function"},"sleep"),n("span",{class:"token punctuation"},"("),n("span",{class:"token number"},"100"),n("span",{class:"token punctuation"},")"),n("span",{class:"token punctuation"},";"),s(`
    console`),n("span",{class:"token punctuation"},"."),n("span",{class:"token function"},"log"),n("span",{class:"token punctuation"},"("),n("span",{class:"token string"},'"第三个任务结束"'),n("span",{class:"token punctuation"},")"),n("span",{class:"token punctuation"},";"),s(`
  `),n("span",{class:"token punctuation"},"}"),n("span",{class:"token punctuation"},","),s(`
`),n("span",{class:"token punctuation"},"]"),n("span",{class:"token punctuation"},";"),s(`
`),n("span",{class:"token keyword"},"function"),s(),n("span",{class:"token function"},"performUnitOfWork"),n("span",{class:"token punctuation"},"("),n("span",{class:"token punctuation"},")"),s(),n("span",{class:"token punctuation"},"{"),s(`
  `),n("span",{class:"token keyword"},"let"),s(" work "),n("span",{class:"token operator"},"="),s(" works"),n("span",{class:"token punctuation"},"."),n("span",{class:"token function"},"shift"),n("span",{class:"token punctuation"},"("),n("span",{class:"token punctuation"},")"),n("span",{class:"token punctuation"},";"),s(`
  `),n("span",{class:"token function"},"work"),n("span",{class:"token punctuation"},"("),n("span",{class:"token punctuation"},")"),n("span",{class:"token punctuation"},";"),s(`
`),n("span",{class:"token punctuation"},"}"),s(`
`),n("span",{class:"token keyword"},"function"),s(),n("span",{class:"token function"},"workLoop"),n("span",{class:"token punctuation"},"("),n("span",{class:"token parameter"},"deadline"),n("span",{class:"token punctuation"},")"),s(),n("span",{class:"token punctuation"},"{"),s(`
  `),n("span",{class:"token comment"},"// 一帧是16.6ms，浏览器执行完高优先级之后，如果还有时间，会执行workLoop"),s(`
  console`),n("span",{class:"token punctuation"},"."),n("span",{class:"token function"},"log"),n("span",{class:"token punctuation"},"("),n("span",{class:"token string"},'"本帧的剩余时间是"'),n("span",{class:"token punctuation"},","),s(" deadline"),n("span",{class:"token punctuation"},"."),n("span",{class:"token function"},"timeRemaining"),n("span",{class:"token punctuation"},"("),n("span",{class:"token punctuation"},")"),n("span",{class:"token punctuation"},")"),n("span",{class:"token punctuation"},";"),s(`
  `),n("span",{class:"token comment"},"// 如果有剩余时间并且还有剩余任务就进入循环调用任务"),s(`
  `),n("span",{class:"token keyword"},"while"),s(),n("span",{class:"token punctuation"},"("),s("deadline"),n("span",{class:"token punctuation"},"."),n("span",{class:"token function"},"timeRemaining"),n("span",{class:"token punctuation"},"("),n("span",{class:"token punctuation"},")"),s(),n("span",{class:"token operator"},">"),s(),n("span",{class:"token number"},"1"),s(),n("span",{class:"token operator"},"&&"),s(" works"),n("span",{class:"token punctuation"},"."),s("length "),n("span",{class:"token operator"},">"),s(),n("span",{class:"token number"},"0"),n("span",{class:"token punctuation"},")"),s(),n("span",{class:"token punctuation"},"{"),s(`
    `),n("span",{class:"token function"},"performUnitOfWork"),n("span",{class:"token punctuation"},"("),n("span",{class:"token punctuation"},")"),n("span",{class:"token punctuation"},";"),s(`
  `),n("span",{class:"token punctuation"},"}"),s(`
  `),n("span",{class:"token comment"},"// 如果没有剩余时间就会跳出循环，要判断是否还有剩余任务"),s(`
  `),n("span",{class:"token keyword"},"if"),s(),n("span",{class:"token punctuation"},"("),s("works"),n("span",{class:"token punctuation"},"."),s("length "),n("span",{class:"token operator"},">"),s(),n("span",{class:"token number"},"0"),n("span",{class:"token punctuation"},")"),s(),n("span",{class:"token punctuation"},"{"),s(`
    console`),n("span",{class:"token punctuation"},"."),n("span",{class:"token function"},"log"),n("span",{class:"token punctuation"},"("),s(`
      `),n("span",{class:"token template-string"},[n("span",{class:"token template-punctuation string"},"`"),n("span",{class:"token string"},"只剩下"),n("span",{class:"token interpolation"},[n("span",{class:"token interpolation-punctuation punctuation"},"${"),s("deadline"),n("span",{class:"token punctuation"},"."),n("span",{class:"token function"},"timeRemaining"),n("span",{class:"token punctuation"},"("),n("span",{class:"token punctuation"},")"),n("span",{class:"token interpolation-punctuation punctuation"},"}")]),n("span",{class:"token string"},"ms，时间不足，等待浏览器下次空闲时调用"),n("span",{class:"token template-punctuation string"},"`")]),s(`
    `),n("span",{class:"token punctuation"},")"),n("span",{class:"token punctuation"},";"),s(`
    `),n("span",{class:"token function"},"requestIdleCallback"),n("span",{class:"token punctuation"},"("),s("workLoop"),n("span",{class:"token punctuation"},")"),n("span",{class:"token punctuation"},";"),s(`
  `),n("span",{class:"token punctuation"},"}"),s(`
`),n("span",{class:"token punctuation"},"}"),s(`
`),n("span",{class:"token keyword"},"const"),s(" btn "),n("span",{class:"token operator"},"="),s(" document"),n("span",{class:"token punctuation"},"."),n("span",{class:"token function"},"querySelector"),n("span",{class:"token punctuation"},"("),n("span",{class:"token string"},'"#btn"'),n("span",{class:"token punctuation"},")"),n("span",{class:"token punctuation"},";"),s(`
btn`),n("span",{class:"token punctuation"},"."),n("span",{class:"token function-variable function"},"onclick"),s(),n("span",{class:"token operator"},"="),s(),n("span",{class:"token punctuation"},"("),n("span",{class:"token punctuation"},")"),s(),n("span",{class:"token operator"},"=>"),s(),n("span",{class:"token punctuation"},"{"),s(`
  `),n("span",{class:"token function"},"requestIdleCallback"),n("span",{class:"token punctuation"},"("),s("workLoop"),n("span",{class:"token punctuation"},")"),n("span",{class:"token punctuation"},";"),s(`
  btn`),n("span",{class:"token punctuation"},"."),s("onclick "),n("span",{class:"token operator"},"="),s(),n("span",{class:"token keyword"},"null"),n("span",{class:"token punctuation"},";"),s(`
`),n("span",{class:"token punctuation"},"}"),n("span",{class:"token punctuation"},";"),s(`
`)])]),n("div",{class:"line-numbers","aria-hidden":"true"},[n("div",{class:"line-number"}),n("div",{class:"line-number"}),n("div",{class:"line-number"}),n("div",{class:"line-number"}),n("div",{class:"line-number"}),n("div",{class:"line-number"}),n("div",{class:"line-number"}),n("div",{class:"line-number"}),n("div",{class:"line-number"}),n("div",{class:"line-number"}),n("div",{class:"line-number"}),n("div",{class:"line-number"}),n("div",{class:"line-number"}),n("div",{class:"line-number"}),n("div",{class:"line-number"}),n("div",{class:"line-number"}),n("div",{class:"line-number"}),n("div",{class:"line-number"}),n("div",{class:"line-number"}),n("div",{class:"line-number"}),n("div",{class:"line-number"}),n("div",{class:"line-number"}),n("div",{class:"line-number"}),n("div",{class:"line-number"}),n("div",{class:"line-number"}),n("div",{class:"line-number"}),n("div",{class:"line-number"}),n("div",{class:"line-number"}),n("div",{class:"line-number"}),n("div",{class:"line-number"}),n("div",{class:"line-number"}),n("div",{class:"line-number"}),n("div",{class:"line-number"}),n("div",{class:"line-number"}),n("div",{class:"line-number"}),n("div",{class:"line-number"}),n("div",{class:"line-number"}),n("div",{class:"line-number"}),n("div",{class:"line-number"}),n("div",{class:"line-number"}),n("div",{class:"line-number"}),n("div",{class:"line-number"}),n("div",{class:"line-number"}),n("div",{class:"line-number"})])],-1),v=a(`<p><strong>注意：因为浏览器提供的 requestIdleCallback 这个 API 存在<em>版本兼容性</em>和一些<em>稳定性问题</em>，React 团队自行实现了 requestIdleCallback 的实际效果，在这里我们直接用这个 API 来实现源码效果</strong></p><h2 id="fiber-架构" tabindex="-1"><a class="header-anchor" href="#fiber-架构" aria-hidden="true">#</a> Fiber 架构</h2><p>从原有性能瓶颈出发，根据屏幕刷新率和 requestIdleCallback 的思路，在 React16 版本及以后，React 团队为我们带来了全新的 Fiber 架构</p><ul><li>Fiber：纤程，意为比线程更为纤细的执行单元</li><li>我们可以通过某些调度策略合理分配 CPU 资源，从而提高用户的响应速度</li><li>通过 Fiber 架构，让自己的调和过程变成可被中断，适时地让出 CPU 执行权，可以让浏览器及时地响应用户的交互</li></ul><h3 id="_1-fiber-是一个执行单元" tabindex="-1"><a class="header-anchor" href="#_1-fiber-是一个执行单元" aria-hidden="true">#</a> 1.Fiber 是一个执行单元</h3><p>Fiber 是一个执行单元，每次执行完一个执行单元，React 就会检查现在还剩多少时间，如果没有时间就将控制权让出去</p><p><img src="https://misaka10032.oss-cn-chengdu.aliyuncs.com/React/fiber-unit.jpg" alt="FiberUnit" loading="lazy"></p><h3 id="_2-fiber-是一种数据结构" tabindex="-1"><a class="header-anchor" href="#_2-fiber-是一种数据结构" aria-hidden="true">#</a> 2.Fiber 是一种数据结构</h3><p>React 目前的做法是使用链表，每个虚拟节点内部表示为一个 Fiber</p><ol><li>从顶点开始遍历</li><li>如果有第一个儿子，先遍历第一个儿子</li><li>如果没有第一个儿子，标志着此节点遍历完成</li><li>如果有弟弟遍历弟弟</li><li>如果没有下一个弟弟，返回父节点标识完成父节点遍历，如果有叔叔遍历叔叔</li><li>没有父节点则遍历结束</li></ol><p><img src="https://misaka10032.oss-cn-chengdu.aliyuncs.com/React/fiber-chain.jpg" alt="FiberChain" loading="lazy"></p><h3 id="_3-树的遍历" tabindex="-1"><a class="header-anchor" href="#_3-树的遍历" aria-hidden="true">#</a> 3.树的遍历</h3><p>对于树形结构的遍历，有两种遍历方法：</p><ol><li>深度优先（DFS）</li></ol><p>深度优先搜索：Depth First Search</p><p>其过程简要来说是对每一个可能的分支路径深入到不能再深入为止，而且每个节点只能访问一次</p><p>应用场景有：React 虚拟 DOM 的构建；React 的 Fiber 树构建</p><ol start="2"><li>广度优先（BFS）</li></ol><p>广度优先搜索：Breadth First Search</p><p>算法首先搜索距离为 k 的所有顶点，然后再去搜索距离为 k+1 的其他顶点</p><h3 id="_4-递归构建-fiber-树" tabindex="-1"><a class="header-anchor" href="#_4-递归构建-fiber-树" aria-hidden="true">#</a> 4.递归构建 Fiber 树</h3><p><img src="https://misaka10032.oss-cn-chengdu.aliyuncs.com/React/digui-fiberTree.jpg" alt="递归构建Fiber树" loading="lazy"></p><h2 id="fiber-源码" tabindex="-1"><a class="header-anchor" href="#fiber-源码" aria-hidden="true">#</a> Fiber 源码</h2><p>实现以上 Fiber 结构逻辑的关键点在于虚拟 DOM 树向单向链表的转化，这个链表的数据类型就是 FiberNode</p><h3 id="fiberrootnode" tabindex="-1"><a class="header-anchor" href="#fiberrootnode" aria-hidden="true">#</a> FiberRootNode</h3><p>createRoot</p><div class="language-javascript line-numbers-mode" data-ext="js"><pre class="language-javascript"><code><span class="token comment">// ReactDOMRoot.js</span>
<span class="token keyword">import</span> <span class="token punctuation">{</span> createContainer <span class="token punctuation">}</span> <span class="token keyword">from</span> <span class="token string">&quot;react-reconciler/src/ReactFiberReconciler&quot;</span><span class="token punctuation">;</span>

<span class="token keyword">function</span> <span class="token function">ReactDOMRoot</span><span class="token punctuation">(</span><span class="token parameter">internalRoot</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
  <span class="token keyword">this</span><span class="token punctuation">.</span>_internalRoot <span class="token operator">=</span> internalRoot<span class="token punctuation">;</span>
<span class="token punctuation">}</span>

<span class="token keyword">export</span> <span class="token keyword">function</span> <span class="token function">createRoot</span><span class="token punctuation">(</span><span class="token parameter">container</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
  <span class="token comment">// div#root</span>
  <span class="token keyword">const</span> root <span class="token operator">=</span> <span class="token function">createContainer</span><span class="token punctuation">(</span>container<span class="token punctuation">)</span><span class="token punctuation">;</span>
  <span class="token keyword">return</span> <span class="token keyword">new</span> <span class="token class-name">ReactDOMRoot</span><span class="token punctuation">(</span>root<span class="token punctuation">)</span><span class="token punctuation">;</span>
<span class="token punctuation">}</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>createContainer</p><div class="language-javascript line-numbers-mode" data-ext="js"><pre class="language-javascript"><code><span class="token comment">// ReactFiberReconciler.js</span>
<span class="token keyword">import</span> <span class="token punctuation">{</span> createFiberRoot <span class="token punctuation">}</span> <span class="token keyword">from</span> <span class="token string">&quot;./ReactFiberRoot&quot;</span><span class="token punctuation">;</span>

<span class="token keyword">export</span> <span class="token keyword">function</span> <span class="token function">createContainer</span><span class="token punctuation">(</span><span class="token parameter">containerInfo</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
  <span class="token keyword">return</span> <span class="token function">createFiberRoot</span><span class="token punctuation">(</span>containerInfo<span class="token punctuation">)</span><span class="token punctuation">;</span>
<span class="token punctuation">}</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>createFiberRoot</p><div class="language-javascript line-numbers-mode" data-ext="js"><pre class="language-javascript"><code><span class="token comment">// ReactFiberRoot.js</span>
<span class="token keyword">function</span> <span class="token function">FiberRootNode</span><span class="token punctuation">(</span><span class="token parameter">containerInfo</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
  <span class="token keyword">this</span><span class="token punctuation">.</span>containerInfo <span class="token operator">=</span> containerInfo<span class="token punctuation">;</span>
<span class="token punctuation">}</span>

<span class="token keyword">export</span> <span class="token keyword">function</span> <span class="token function">createFiberRoot</span><span class="token punctuation">(</span><span class="token parameter">containerInfo</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
  <span class="token keyword">const</span> root <span class="token operator">=</span> <span class="token keyword">new</span> <span class="token class-name">FiberRootNode</span><span class="token punctuation">(</span>containerInfo<span class="token punctuation">)</span><span class="token punctuation">;</span>
  <span class="token keyword">return</span> root<span class="token punctuation">;</span>
<span class="token punctuation">}</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>创建结果：FiberRootNode。containerInfo 属性，本质就是真实 DOM 节点（<code>div#root</code>）</p><p><img src="https://misaka10032.oss-cn-chengdu.aliyuncs.com/React/FiberRootNode.jpg" alt="FiberRootNode" loading="lazy"></p><p>main.jsx</p><div class="language-jsx line-numbers-mode" data-ext="jsx"><pre class="language-jsx"><code><span class="token keyword">import</span> <span class="token punctuation">{</span> createRoot <span class="token punctuation">}</span> <span class="token keyword">from</span> <span class="token string">&quot;react-dom/client&quot;</span><span class="token punctuation">;</span>

<span class="token keyword">const</span> element <span class="token operator">=</span> <span class="token punctuation">(</span>
  <span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span>h1</span><span class="token punctuation">&gt;</span></span><span class="token plain-text">
    hello</span><span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span>span</span> <span class="token attr-name">style</span><span class="token script language-javascript"><span class="token script-punctuation punctuation">=</span><span class="token punctuation">{</span><span class="token punctuation">{</span> <span class="token literal-property property">color</span><span class="token operator">:</span> <span class="token string">&quot;red&quot;</span> <span class="token punctuation">}</span><span class="token punctuation">}</span></span><span class="token punctuation">&gt;</span></span><span class="token plain-text">world</span><span class="token tag"><span class="token tag"><span class="token punctuation">&lt;/</span>span</span><span class="token punctuation">&gt;</span></span><span class="token plain-text">
  </span><span class="token tag"><span class="token tag"><span class="token punctuation">&lt;/</span>h1</span><span class="token punctuation">&gt;</span></span>
<span class="token punctuation">)</span><span class="token punctuation">;</span>

<span class="token keyword">const</span> root <span class="token operator">=</span> <span class="token function">createRoot</span><span class="token punctuation">(</span>document<span class="token punctuation">.</span><span class="token function">getElementById</span><span class="token punctuation">(</span><span class="token string">&quot;root&quot;</span><span class="token punctuation">)</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
console<span class="token punctuation">.</span><span class="token function">log</span><span class="token punctuation">(</span>root<span class="token punctuation">)</span><span class="token punctuation">;</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>输出结果：</p><p><img src="https://misaka10032.oss-cn-chengdu.aliyuncs.com/React/FiberRootNode-result.png" alt="FiberRootNode输出结果" loading="lazy"></p><h3 id="fibernode" tabindex="-1"><a class="header-anchor" href="#fibernode" aria-hidden="true">#</a> FiberNode</h3><p>为 FiberRootNode.current 创建 FiberNode 节点，根节点的 FiberNode 也称为 HostRootFiber</p><p>FiberNode 是真正与所有节点相关联的节点属性，包含大量属性值</p><div class="language-javascript line-numbers-mode" data-ext="js"><pre class="language-javascript"><code><span class="token keyword">import</span> <span class="token punctuation">{</span> createHostRootFiber <span class="token punctuation">}</span> <span class="token keyword">from</span> <span class="token string">&quot;./ReactFiber&quot;</span><span class="token punctuation">;</span>

<span class="token keyword">function</span> <span class="token function">FiberRootNode</span><span class="token punctuation">(</span><span class="token parameter">containerInfo</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
  <span class="token keyword">this</span><span class="token punctuation">.</span>containerInfo <span class="token operator">=</span> containerInfo<span class="token punctuation">;</span>
<span class="token punctuation">}</span>

<span class="token keyword">export</span> <span class="token keyword">function</span> <span class="token function">createFiberRoot</span><span class="token punctuation">(</span><span class="token parameter">containerInfo</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
  <span class="token keyword">const</span> root <span class="token operator">=</span> <span class="token keyword">new</span> <span class="token class-name">FiberRootNode</span><span class="token punctuation">(</span>containerInfo<span class="token punctuation">)</span><span class="token punctuation">;</span>
  <span class="token comment">// HostRoot指的是根节点div#root</span>
  <span class="token keyword">const</span> uninitializedFiber <span class="token operator">=</span> <span class="token function">createHostRootFiber</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
  <span class="token comment">// 根容器的current指向当前的根fiber</span>
  root<span class="token punctuation">.</span>current <span class="token operator">=</span> uninitializedFiber<span class="token punctuation">;</span>
  <span class="token comment">// 根fiber的stateNode，真实DOM节点指向FiberRootNode</span>
  uninitializedFiber<span class="token punctuation">.</span>stateNode <span class="token operator">=</span> root<span class="token punctuation">;</span>
  <span class="token keyword">return</span> root<span class="token punctuation">;</span>
<span class="token punctuation">}</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>createHostRootFiber</p><div class="language-javascript line-numbers-mode" data-ext="js"><pre class="language-javascript"><code><span class="token keyword">import</span> <span class="token punctuation">{</span> HostRoot <span class="token punctuation">}</span> <span class="token keyword">from</span> <span class="token string">&quot;./ReactWorkTags&quot;</span><span class="token punctuation">;</span>
<span class="token keyword">import</span> <span class="token punctuation">{</span> NoFlags <span class="token punctuation">}</span> <span class="token keyword">from</span> <span class="token string">&quot;./ReactFiberFlags&quot;</span><span class="token punctuation">;</span>

<span class="token doc-comment comment">/**
 *
 * <span class="token keyword">@param</span> <span class="token parameter">tag</span> fiber类型，函数组件0、类组件1、原生组件5、根元素3
 * <span class="token keyword">@param</span> <span class="token parameter">pendingProps</span> 新属性，等待处理或者生效的属性
 * <span class="token keyword">@param</span> <span class="token parameter">key</span> 唯一标识
 * <span class="token keyword">@constructor</span>
 */</span>
<span class="token keyword">export</span> <span class="token keyword">function</span> <span class="token function">FiberNode</span><span class="token punctuation">(</span><span class="token parameter">tag<span class="token punctuation">,</span> pendingProps<span class="token punctuation">,</span> key</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
  <span class="token keyword">this</span><span class="token punctuation">.</span>tag <span class="token operator">=</span> tag<span class="token punctuation">;</span>
  <span class="token keyword">this</span><span class="token punctuation">.</span>key <span class="token operator">=</span> key<span class="token punctuation">;</span>
  <span class="token keyword">this</span><span class="token punctuation">.</span>type <span class="token operator">=</span> <span class="token keyword">null</span><span class="token punctuation">;</span> <span class="token comment">// fiber类型，来自于虚拟DOM节点的type span div a</span>
  <span class="token keyword">this</span><span class="token punctuation">.</span>stateNode <span class="token operator">=</span> <span class="token keyword">null</span><span class="token punctuation">;</span> <span class="token comment">// 对应真实的DOM节点</span>

  <span class="token keyword">this</span><span class="token punctuation">.</span>return <span class="token operator">=</span> <span class="token keyword">null</span><span class="token punctuation">;</span> <span class="token comment">// 指向父节点</span>
  <span class="token keyword">this</span><span class="token punctuation">.</span>child <span class="token operator">=</span> <span class="token keyword">null</span><span class="token punctuation">;</span> <span class="token comment">// 指向第一个子节点</span>
  <span class="token keyword">this</span><span class="token punctuation">.</span>sibling <span class="token operator">=</span> <span class="token keyword">null</span><span class="token punctuation">;</span> <span class="token comment">// 指向弟节点</span>

  <span class="token comment">// 虚拟DOM提供pendingProps用于创建fiber节点的属性</span>
  <span class="token keyword">this</span><span class="token punctuation">.</span>pendingProps <span class="token operator">=</span> pendingProps<span class="token punctuation">;</span> <span class="token comment">// 等待生效的属性</span>
  <span class="token keyword">this</span><span class="token punctuation">.</span>memoizedProps <span class="token operator">=</span> <span class="token keyword">null</span><span class="token punctuation">;</span> <span class="token comment">// 已经生效的属性</span>

  <span class="token comment">// 每个fiber会有自己的状态，每一种fiber状态存的类型不一样</span>
  <span class="token comment">// 类组件对应的fiber存的是类实例状态，HostRoot存的是待渲染元素</span>
  <span class="token keyword">this</span><span class="token punctuation">.</span>memoizedState <span class="token operator">=</span> <span class="token keyword">null</span><span class="token punctuation">;</span>
  <span class="token comment">// 每个fiber身上可能还有更新队列</span>
  <span class="token keyword">this</span><span class="token punctuation">.</span>updateQueue <span class="token operator">=</span> <span class="token keyword">null</span><span class="token punctuation">;</span>
  <span class="token comment">// 副作用的标识，表示要针对此Fiber节点进行何种操作</span>
  <span class="token keyword">this</span><span class="token punctuation">.</span>flags <span class="token operator">=</span> NoFlags<span class="token punctuation">;</span>
  <span class="token comment">// 子节点对应的副作用标识</span>
  <span class="token keyword">this</span><span class="token punctuation">.</span>subtreeFlags <span class="token operator">=</span> NoFlags<span class="token punctuation">;</span>
  <span class="token comment">// 轮替节点</span>
  <span class="token keyword">this</span><span class="token punctuation">.</span>alternate <span class="token operator">=</span> <span class="token keyword">null</span><span class="token punctuation">;</span>
  <span class="token comment">// We use a double buffering pooling technique because we know that we&#39;ll</span>
  <span class="token comment">// only ever need at most two versions of a tree. We pool the &quot;other&quot; unused</span>
  <span class="token comment">// node that we&#39;re free to reuse.</span>

  <span class="token comment">// This is lazily created to avoid allocating</span>
  <span class="token comment">// extra objects for things that are never updated. It also allows us to</span>
  <span class="token comment">// reclaim the extra memory if needed.</span>
<span class="token punctuation">}</span>

<span class="token keyword">export</span> <span class="token keyword">function</span> <span class="token function">createFiber</span><span class="token punctuation">(</span><span class="token parameter">tag<span class="token punctuation">,</span> pendingProps<span class="token punctuation">,</span> key</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
  <span class="token keyword">return</span> <span class="token keyword">new</span> <span class="token class-name">FiberNode</span><span class="token punctuation">(</span>tag<span class="token punctuation">,</span> pendingProps<span class="token punctuation">,</span> key<span class="token punctuation">)</span><span class="token punctuation">;</span>
<span class="token punctuation">}</span>

<span class="token keyword">export</span> <span class="token keyword">function</span> <span class="token function">createHostRootFiber</span><span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
  <span class="token keyword">return</span> <span class="token function">createFiber</span><span class="token punctuation">(</span>HostRoot<span class="token punctuation">,</span> <span class="token keyword">null</span><span class="token punctuation">,</span> <span class="token keyword">null</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
<span class="token punctuation">}</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>输出结果：</p><p><img src="https://misaka10032.oss-cn-chengdu.aliyuncs.com/React/fiberNode-result.png" alt="FiberNode输出结果" loading="lazy"></p><p><strong>注意</strong></p><ul><li>到此为止，仅仅是 div#root 创建了一个根节点处的 Fiber 节点</li><li>正常来说，先有虚拟 DOM -&gt; Fiber 节点 -&gt; 真实 DOM</li><li>根节点在一开始就已经存在了 div#root，所以对于根节点只需要创建 Fiber 节点即可</li><li>current 是有特殊含义的，代表当前节点对应的 Fiber，在 render 阶段会根据组件树的结构来构建 Fiber 节点链</li></ul><h3 id="updatequeue" tabindex="-1"><a class="header-anchor" href="#updatequeue" aria-hidden="true">#</a> UpdateQueue</h3><p>创建完根 FiberNode 节点后，新建更新队列</p><p>更新队列为单向循环链表，头尾相连</p><p>注：更新队列采取单循环链表的原因，个人猜测应该是为了无需遍历更新队列，直接获取头部节点和尾部节点，并完成快速地新老更新队列拼接</p><p>prototype.render &amp;&amp; updateContainer</p><div class="language-javascript line-numbers-mode" data-ext="js"><pre class="language-javascript"><code><span class="token keyword">import</span> <span class="token punctuation">{</span>
  createContainer<span class="token punctuation">,</span>
  updateContainer<span class="token punctuation">,</span>
<span class="token punctuation">}</span> <span class="token keyword">from</span> <span class="token string">&quot;react-reconciler/src/ReactFiberReconciler&quot;</span><span class="token punctuation">;</span>

<span class="token keyword">function</span> <span class="token function">ReactDOMRoot</span><span class="token punctuation">(</span><span class="token parameter">internalRoot</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
  <span class="token keyword">this</span><span class="token punctuation">.</span>_internalRoote <span class="token operator">=</span> internalRoot<span class="token punctuation">;</span>
<span class="token punctuation">}</span>

<span class="token class-name">ReactDOMRoot</span><span class="token punctuation">.</span>prototype<span class="token punctuation">.</span><span class="token function-variable function">render</span> <span class="token operator">=</span> <span class="token keyword">function</span> <span class="token punctuation">(</span><span class="token parameter">children</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
  <span class="token keyword">const</span> root <span class="token operator">=</span> <span class="token keyword">this</span><span class="token punctuation">.</span>_internalRoote<span class="token punctuation">;</span>
  <span class="token function">updateContainer</span><span class="token punctuation">(</span>children<span class="token punctuation">,</span> root<span class="token punctuation">)</span><span class="token punctuation">;</span>
<span class="token punctuation">}</span><span class="token punctuation">;</span>

<span class="token keyword">export</span> <span class="token keyword">function</span> <span class="token function">createRoot</span><span class="token punctuation">(</span><span class="token parameter">container</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
  <span class="token comment">// div#root</span>
  <span class="token keyword">const</span> root <span class="token operator">=</span> <span class="token function">createContainer</span><span class="token punctuation">(</span>container<span class="token punctuation">)</span><span class="token punctuation">;</span>
  <span class="token keyword">return</span> <span class="token keyword">new</span> <span class="token class-name">ReactDOMRoot</span><span class="token punctuation">(</span>root<span class="token punctuation">)</span><span class="token punctuation">;</span>
<span class="token punctuation">}</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>initialUpdateQueue</p><div class="language-javascript line-numbers-mode" data-ext="js"><pre class="language-javascript"><code><span class="token keyword">import</span> <span class="token punctuation">{</span> createHostRootFiber <span class="token punctuation">}</span> <span class="token keyword">from</span> <span class="token string">&quot;./ReactFiber&quot;</span><span class="token punctuation">;</span>
<span class="token keyword">import</span> <span class="token punctuation">{</span> initialUpdateQueue <span class="token punctuation">}</span> <span class="token keyword">from</span> <span class="token string">&quot;./ReactFiberClassUpdateQueue&quot;</span><span class="token punctuation">;</span>

<span class="token keyword">function</span> <span class="token function">FiberRootNode</span><span class="token punctuation">(</span><span class="token parameter">containerInfo</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
  <span class="token keyword">this</span><span class="token punctuation">.</span>containerInfo <span class="token operator">=</span> containerInfo<span class="token punctuation">;</span>
<span class="token punctuation">}</span>

<span class="token keyword">export</span> <span class="token keyword">function</span> <span class="token function">createFiberRoot</span><span class="token punctuation">(</span><span class="token parameter">containerInfo</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
  <span class="token keyword">const</span> root <span class="token operator">=</span> <span class="token keyword">new</span> <span class="token class-name">FiberRootNode</span><span class="token punctuation">(</span>containerInfo<span class="token punctuation">)</span><span class="token punctuation">;</span>
  <span class="token comment">// HostRoot指的是根节点div#root</span>
  <span class="token keyword">const</span> uninitializedFiber <span class="token operator">=</span> <span class="token function">createHostRootFiber</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
  <span class="token comment">// 根容器的current指向当前的根fiber</span>
  root<span class="token punctuation">.</span>current <span class="token operator">=</span> uninitializedFiber<span class="token punctuation">;</span>
  <span class="token comment">// 根fiber的stateNode，真实DOM节点指向FiberRootNode</span>
  uninitializedFiber<span class="token punctuation">.</span>stateNode <span class="token operator">=</span> root<span class="token punctuation">;</span>
  <span class="token function">initialUpdateQueue</span><span class="token punctuation">(</span>uninitializedFiber<span class="token punctuation">)</span><span class="token punctuation">;</span>
  <span class="token keyword">return</span> root<span class="token punctuation">;</span>
<span class="token punctuation">}</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>updateContainer</p><div class="language-javascript line-numbers-mode" data-ext="js"><pre class="language-javascript"><code><span class="token keyword">import</span> <span class="token punctuation">{</span> createFiberRoot <span class="token punctuation">}</span> <span class="token keyword">from</span> <span class="token string">&quot;./ReactFiberRoot&quot;</span><span class="token punctuation">;</span>
<span class="token keyword">import</span> <span class="token punctuation">{</span> createUpdate<span class="token punctuation">,</span> enqueueUpdate <span class="token punctuation">}</span> <span class="token keyword">from</span> <span class="token string">&quot;./ReactFiberClassUpdateQueue&quot;</span><span class="token punctuation">;</span>

<span class="token keyword">export</span> <span class="token keyword">function</span> <span class="token function">createContainer</span><span class="token punctuation">(</span><span class="token parameter">containerInfo</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
  <span class="token keyword">return</span> <span class="token function">createFiberRoot</span><span class="token punctuation">(</span>containerInfo<span class="token punctuation">)</span><span class="token punctuation">;</span>
<span class="token punctuation">}</span>

<span class="token doc-comment comment">/**
 * 更新容易，把虚拟DOM Element变成真实DOM插入到container容器中
 * <span class="token keyword">@param</span> <span class="token parameter">element</span> 虚拟DOM
 * <span class="token keyword">@param</span> <span class="token parameter">container</span> DOM容器 FiberRootNode containerInfo div#root
 */</span>
<span class="token keyword">export</span> <span class="token keyword">function</span> <span class="token function">updateContainer</span><span class="token punctuation">(</span><span class="token parameter">element<span class="token punctuation">,</span> container</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
  <span class="token comment">// 获取当前的根fiber</span>
  <span class="token keyword">const</span> current <span class="token operator">=</span> container<span class="token punctuation">.</span>current<span class="token punctuation">;</span>
  <span class="token comment">// 创建更新</span>
  <span class="token keyword">const</span> update <span class="token operator">=</span> <span class="token function">createUpdate</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
  <span class="token comment">// 要更新的虚拟DOM</span>
  update<span class="token punctuation">.</span>payload <span class="token operator">=</span> <span class="token punctuation">{</span> element <span class="token punctuation">}</span><span class="token punctuation">;</span>
  <span class="token comment">// 添加至current根Fiber的更新队列</span>
  <span class="token keyword">const</span> root <span class="token operator">=</span> <span class="token function">enqueueUpdate</span><span class="token punctuation">(</span>current<span class="token punctuation">,</span> update<span class="token punctuation">)</span><span class="token punctuation">;</span>
<span class="token punctuation">}</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>Update</p><div class="language-javascript line-numbers-mode" data-ext="js"><pre class="language-javascript"><code><span class="token keyword">import</span> <span class="token punctuation">{</span> markUpdateLaneFromFiberToRoot <span class="token punctuation">}</span> <span class="token keyword">from</span> <span class="token string">&quot;react-reconciler/src/ReactFiberConcurrentUpdate&quot;</span><span class="token punctuation">;</span>

<span class="token keyword">export</span> <span class="token keyword">function</span> <span class="token function">initialUpdateQueue</span><span class="token punctuation">(</span><span class="token parameter">fiber</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
  <span class="token comment">// 创建一个新的更新队列</span>
  <span class="token keyword">const</span> queue <span class="token operator">=</span> <span class="token punctuation">{</span>
    <span class="token literal-property property">shared</span><span class="token operator">:</span> <span class="token punctuation">{</span>
      <span class="token comment">// pending是一个循环链表</span>
      <span class="token literal-property property">pending</span><span class="token operator">:</span> <span class="token keyword">null</span><span class="token punctuation">,</span>
    <span class="token punctuation">}</span><span class="token punctuation">,</span>
  <span class="token punctuation">}</span><span class="token punctuation">;</span>
  fiber<span class="token punctuation">.</span>updateQueue <span class="token operator">=</span> queue<span class="token punctuation">;</span>
<span class="token punctuation">}</span>

<span class="token keyword">export</span> <span class="token keyword">function</span> <span class="token function">createUpdate</span><span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
  <span class="token keyword">const</span> update <span class="token operator">=</span> <span class="token punctuation">{</span><span class="token punctuation">}</span><span class="token punctuation">;</span>
  <span class="token keyword">return</span> update<span class="token punctuation">;</span>
<span class="token punctuation">}</span>

<span class="token keyword">export</span> <span class="token keyword">function</span> <span class="token function">enqueueUpdate</span><span class="token punctuation">(</span><span class="token parameter">fiber<span class="token punctuation">,</span> update</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
  <span class="token keyword">const</span> updateQueue <span class="token operator">=</span> fiber<span class="token punctuation">.</span>updateQueue<span class="token punctuation">;</span>
  <span class="token comment">// 取出fiber上已有的老的更新链表pending</span>
  <span class="token keyword">const</span> pending <span class="token operator">=</span> updateQueue<span class="token punctuation">.</span>shared<span class="token punctuation">.</span>pending<span class="token punctuation">;</span>
  <span class="token keyword">if</span> <span class="token punctuation">(</span>pending <span class="token operator">===</span> <span class="token keyword">null</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
    <span class="token comment">// pending不存在则直接将新的更新链表挂载上去</span>
    update<span class="token punctuation">.</span>next <span class="token operator">=</span> update<span class="token punctuation">;</span>
  <span class="token punctuation">}</span> <span class="token keyword">else</span> <span class="token punctuation">{</span>
    <span class="token comment">// pending存在，注意pending为循环链表</span>
    <span class="token comment">// 新链表update的尾部next指向老pending链表的头部（尾部的next即指向头部）</span>
    update<span class="token punctuation">.</span>next <span class="token operator">=</span> pending<span class="token punctuation">.</span>next<span class="token punctuation">;</span>
    <span class="token comment">// 老pending链表尾部next指向新链表update的头部</span>
    pending<span class="token punctuation">.</span>next <span class="token operator">=</span> update<span class="token punctuation">;</span>
  <span class="token punctuation">}</span>
  <span class="token comment">// 最终结果：pending要指向最后一个更新，最后一个更新next指向第一个更新，构成单向循环链表</span>
  updateQueue<span class="token punctuation">.</span>shared<span class="token punctuation">.</span>pending <span class="token operator">=</span> update<span class="token punctuation">;</span>
  <span class="token comment">// 返回根节点 从当前的fiber到根节点（涉及到优先级队列，此处暂时不考虑优先级）</span>
  <span class="token keyword">return</span> <span class="token function">markUpdateLaneFromFiberToRoot</span><span class="token punctuation">(</span>fiber<span class="token punctuation">)</span><span class="token punctuation">;</span>
<span class="token punctuation">}</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>markUpdateLaneFromFiberToRoot</p><div class="language-javascript line-numbers-mode" data-ext="js"><pre class="language-javascript"><code><span class="token doc-comment comment">/**
 * 此文件本来还需要考虑处理优先级问题
 * 现在只实现找到根节点的功能
 */</span>
<span class="token keyword">import</span> <span class="token punctuation">{</span> HostRoot <span class="token punctuation">}</span> <span class="token keyword">from</span> <span class="token string">&quot;react-reconciler/src/ReactWorkTags&quot;</span><span class="token punctuation">;</span>

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
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>main.jsx</p><div class="language-jsx line-numbers-mode" data-ext="jsx"><pre class="language-jsx"><code><span class="token keyword">import</span> <span class="token punctuation">{</span> createRoot <span class="token punctuation">}</span> <span class="token keyword">from</span> <span class="token string">&quot;react-dom/client&quot;</span><span class="token punctuation">;</span>

<span class="token keyword">const</span> element <span class="token operator">=</span> <span class="token punctuation">(</span>
  <span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span>h1</span><span class="token punctuation">&gt;</span></span><span class="token plain-text">
    hello</span><span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span>span</span> <span class="token attr-name">style</span><span class="token script language-javascript"><span class="token script-punctuation punctuation">=</span><span class="token punctuation">{</span><span class="token punctuation">{</span> <span class="token literal-property property">color</span><span class="token operator">:</span> <span class="token string">&quot;red&quot;</span> <span class="token punctuation">}</span><span class="token punctuation">}</span></span><span class="token punctuation">&gt;</span></span><span class="token plain-text">world</span><span class="token tag"><span class="token tag"><span class="token punctuation">&lt;/</span>span</span><span class="token punctuation">&gt;</span></span><span class="token plain-text">
  </span><span class="token tag"><span class="token tag"><span class="token punctuation">&lt;/</span>h1</span><span class="token punctuation">&gt;</span></span>
<span class="token punctuation">)</span><span class="token punctuation">;</span>

<span class="token keyword">const</span> root <span class="token operator">=</span> <span class="token function">createRoot</span><span class="token punctuation">(</span>document<span class="token punctuation">.</span><span class="token function">getElementById</span><span class="token punctuation">(</span><span class="token string">&quot;root&quot;</span><span class="token punctuation">)</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
<span class="token comment">// 把element虚拟DOM挂载到容器中</span>
root<span class="token punctuation">.</span><span class="token function">render</span><span class="token punctuation">(</span>element<span class="token punctuation">)</span><span class="token punctuation">;</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p><img src="https://misaka10032.oss-cn-chengdu.aliyuncs.com/React/updateQueue.png" alt="UpdateQueueResult" loading="lazy"></p><h3 id="beginwork" tabindex="-1"><a class="header-anchor" href="#beginwork" aria-hidden="true">#</a> BeginWork</h3><p>建立好更新队列后，开始创建后台节点链表 WorkInProgress，同时启动 beginWork 任务扫描虚拟 DOM（递归的递阶段），beginWork 会在子节点没有 child 时结束</p><p>首先派发更新计划</p><div class="language-javascript line-numbers-mode" data-ext="js"><pre class="language-javascript"><code><span class="token keyword">import</span> <span class="token punctuation">{</span> createFiberRoot <span class="token punctuation">}</span> <span class="token keyword">from</span> <span class="token string">&quot;./ReactFiberRoot&quot;</span><span class="token punctuation">;</span>
<span class="token keyword">import</span> <span class="token punctuation">{</span> createUpdate<span class="token punctuation">,</span> enqueueUpdate <span class="token punctuation">}</span> <span class="token keyword">from</span> <span class="token string">&quot;./ReactFiberClassUpdateQueue&quot;</span><span class="token punctuation">;</span>
<span class="token keyword">import</span> <span class="token punctuation">{</span> scheduleUpdateOnFiber <span class="token punctuation">}</span> <span class="token keyword">from</span> <span class="token string">&quot;./ReactFiberWorkLoop&quot;</span><span class="token punctuation">;</span>

<span class="token keyword">export</span> <span class="token keyword">function</span> <span class="token function">createContainer</span><span class="token punctuation">(</span><span class="token parameter">containerInfo</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
  <span class="token keyword">return</span> <span class="token function">createFiberRoot</span><span class="token punctuation">(</span>containerInfo<span class="token punctuation">)</span><span class="token punctuation">;</span>
<span class="token punctuation">}</span>

<span class="token doc-comment comment">/**
 * 更新容易，把虚拟DOM Element变成真实DOM插入到container容器中
 * <span class="token keyword">@param</span> <span class="token parameter">element</span> 虚拟DOM
 * <span class="token keyword">@param</span> <span class="token parameter">container</span> DOM容器 FiberRootNode containerInfo div#root
 */</span>
<span class="token keyword">export</span> <span class="token keyword">function</span> <span class="token function">updateContainer</span><span class="token punctuation">(</span><span class="token parameter">element<span class="token punctuation">,</span> container</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
  <span class="token comment">// 获取当前的根fiber</span>
  <span class="token keyword">const</span> current <span class="token operator">=</span> container<span class="token punctuation">.</span>current<span class="token punctuation">;</span>
  <span class="token comment">// 创建更新</span>
  <span class="token keyword">const</span> update <span class="token operator">=</span> <span class="token function">createUpdate</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
  <span class="token comment">// 要更新的虚拟DOM</span>
  update<span class="token punctuation">.</span>payload <span class="token operator">=</span> <span class="token punctuation">{</span> element <span class="token punctuation">}</span><span class="token punctuation">;</span>
  <span class="token comment">// 添加至current根Fiber的更新队列</span>
  <span class="token keyword">const</span> root <span class="token operator">=</span> <span class="token function">enqueueUpdate</span><span class="token punctuation">(</span>current<span class="token punctuation">,</span> update<span class="token punctuation">)</span><span class="token punctuation">;</span>
  <span class="token comment">// 派发更新计划</span>
  <span class="token function">scheduleUpdateOnFiber</span><span class="token punctuation">(</span>root<span class="token punctuation">)</span><span class="token punctuation">;</span>
<span class="token punctuation">}</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>第二步：首次渲染执行根节点同步渲染，做两件事：1、创建后台进程节点 workInProgress；2、调用浏览器 requestIdleCallback 开启闲时 Fiber 树重构</p><p>第三步：开启浏览器空闲时间碎片化加载的功能之后，将会循环调用 performUnitOfWork（工作单元执行方法），碎片化地执行 beginWork 方法，当然了，beginWork 方法之中藏有结束循环的条件，那就是后台进程节点 workInProgress 为 null 的时候，没有剩余的工作单元，也就结束了整个 Fiber 树的构建</p><div class="language-javascript line-numbers-mode" data-ext="js"><pre class="language-javascript"><code><span class="token keyword">import</span> <span class="token punctuation">{</span> scheduleCallback <span class="token punctuation">}</span> <span class="token keyword">from</span> <span class="token string">&quot;scheduler/index&quot;</span><span class="token punctuation">;</span>
<span class="token keyword">import</span> <span class="token punctuation">{</span> createWorkInProgress <span class="token punctuation">}</span> <span class="token keyword">from</span> <span class="token string">&quot;./ReactFiber&quot;</span><span class="token punctuation">;</span>
<span class="token keyword">import</span> <span class="token punctuation">{</span> beginWork <span class="token punctuation">}</span> <span class="token keyword">from</span> <span class="token string">&quot;./ReactFiberBeginWork&quot;</span><span class="token punctuation">;</span>
<span class="token comment">// import { completeWork } from &#39;./ReactFiberCompleteWork&#39;;</span>

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
<span class="token punctuation">}</span>

<span class="token keyword">function</span> <span class="token function">prepareFreshStack</span><span class="token punctuation">(</span><span class="token parameter">root</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
  workInProgress <span class="token operator">=</span> <span class="token function">createWorkInProgress</span><span class="token punctuation">(</span>root<span class="token punctuation">.</span>current<span class="token punctuation">,</span> <span class="token keyword">null</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
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
    workInProgress <span class="token operator">=</span> <span class="token keyword">null</span><span class="token punctuation">;</span>
    <span class="token comment">// 没有子节点，表示当前fiber的beginWork已经完成，执行completeWork</span>
  <span class="token punctuation">}</span> <span class="token keyword">else</span> <span class="token punctuation">{</span>
    workInProgress <span class="token operator">=</span> next<span class="token punctuation">;</span>
  <span class="token punctuation">}</span>
<span class="token punctuation">}</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>createWorkInProgress 后台节点创建</p><div class="language-javascript line-numbers-mode" data-ext="js"><pre class="language-javascript"><code><span class="token keyword">import</span> <span class="token punctuation">{</span> HostRoot <span class="token punctuation">}</span> <span class="token keyword">from</span> <span class="token string">&quot;./ReactWorkTags&quot;</span><span class="token punctuation">;</span>
<span class="token keyword">import</span> <span class="token punctuation">{</span> NoFlags <span class="token punctuation">}</span> <span class="token keyword">from</span> <span class="token string">&quot;./ReactFiberFlags&quot;</span><span class="token punctuation">;</span>

<span class="token doc-comment comment">/**
 *
 * <span class="token keyword">@param</span> <span class="token parameter">tag</span> fiber类型，函数组件0、类组件1、原生组件5、根元素3
 * <span class="token keyword">@param</span> <span class="token parameter">pendingProps</span> 新属性，等待处理或者生效的属性
 * <span class="token keyword">@param</span> <span class="token parameter">key</span> 唯一标识
 * <span class="token keyword">@constructor</span>
 */</span>
<span class="token keyword">export</span> <span class="token keyword">function</span> <span class="token function">FiberNode</span><span class="token punctuation">(</span><span class="token parameter">tag<span class="token punctuation">,</span> pendingProps<span class="token punctuation">,</span> key</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
  <span class="token keyword">this</span><span class="token punctuation">.</span>tag <span class="token operator">=</span> tag<span class="token punctuation">;</span>
  <span class="token keyword">this</span><span class="token punctuation">.</span>key <span class="token operator">=</span> key<span class="token punctuation">;</span>
  <span class="token keyword">this</span><span class="token punctuation">.</span>type <span class="token operator">=</span> <span class="token keyword">null</span><span class="token punctuation">;</span> <span class="token comment">// fiber类型，来自于虚拟DOM节点的type span div a</span>
  <span class="token keyword">this</span><span class="token punctuation">.</span>stateNode <span class="token operator">=</span> <span class="token keyword">null</span><span class="token punctuation">;</span> <span class="token comment">// 对应真实的DOM节点</span>

  <span class="token keyword">this</span><span class="token punctuation">.</span>return <span class="token operator">=</span> <span class="token keyword">null</span><span class="token punctuation">;</span> <span class="token comment">// 指向父节点</span>
  <span class="token keyword">this</span><span class="token punctuation">.</span>child <span class="token operator">=</span> <span class="token keyword">null</span><span class="token punctuation">;</span> <span class="token comment">// 指向第一个子节点</span>
  <span class="token keyword">this</span><span class="token punctuation">.</span>sibling <span class="token operator">=</span> <span class="token keyword">null</span><span class="token punctuation">;</span> <span class="token comment">// 指向弟节点</span>
  <span class="token keyword">this</span><span class="token punctuation">.</span>index <span class="token operator">=</span> <span class="token number">0</span><span class="token punctuation">;</span> <span class="token comment">// 索引初始为0</span>

  <span class="token comment">// 虚拟DOM提供pendingProps用于创建fiber节点的属性</span>
  <span class="token keyword">this</span><span class="token punctuation">.</span>pendingProps <span class="token operator">=</span> pendingProps<span class="token punctuation">;</span> <span class="token comment">// 等待生效的属性</span>
  <span class="token keyword">this</span><span class="token punctuation">.</span>memoizedProps <span class="token operator">=</span> <span class="token keyword">null</span><span class="token punctuation">;</span> <span class="token comment">// 已经生效的属性</span>

  <span class="token comment">// 每个fiber会有自己的状态，每一种fiber状态存的类型不一样</span>
  <span class="token comment">// 类组件对应的fiber存的是类实例状态，HostRoot存的是待渲染元素</span>
  <span class="token keyword">this</span><span class="token punctuation">.</span>memoizedState <span class="token operator">=</span> <span class="token keyword">null</span><span class="token punctuation">;</span>
  <span class="token comment">// 每个fiber身上可能还有更新队列</span>
  <span class="token keyword">this</span><span class="token punctuation">.</span>updateQueue <span class="token operator">=</span> <span class="token keyword">null</span><span class="token punctuation">;</span>
  <span class="token comment">// 副作用的标识，表示要针对此Fiber节点进行何种操作</span>
  <span class="token keyword">this</span><span class="token punctuation">.</span>flags <span class="token operator">=</span> NoFlags<span class="token punctuation">;</span>
  <span class="token comment">// 子节点对应的副作用标识</span>
  <span class="token keyword">this</span><span class="token punctuation">.</span>subtreeFlags <span class="token operator">=</span> NoFlags<span class="token punctuation">;</span>
  <span class="token comment">// 轮替节点</span>
  <span class="token keyword">this</span><span class="token punctuation">.</span>alternate <span class="token operator">=</span> <span class="token keyword">null</span><span class="token punctuation">;</span>
  <span class="token comment">// We use a double buffering pooling technique because we know that we&#39;ll</span>
  <span class="token comment">// only ever need at most two versions of a tree. We pool the &quot;other&quot; unused</span>
  <span class="token comment">// node that we&#39;re free to reuse.</span>

  <span class="token comment">// This is lazily created to avoid allocating</span>
  <span class="token comment">// extra objects for things that are never updated. It also allows us to</span>
  <span class="token comment">// reclaim the extra memory if needed.</span>
<span class="token punctuation">}</span>

<span class="token keyword">export</span> <span class="token keyword">function</span> <span class="token function">createFiber</span><span class="token punctuation">(</span><span class="token parameter">tag<span class="token punctuation">,</span> pendingProps<span class="token punctuation">,</span> key</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
  <span class="token keyword">return</span> <span class="token keyword">new</span> <span class="token class-name">FiberNode</span><span class="token punctuation">(</span>tag<span class="token punctuation">,</span> pendingProps<span class="token punctuation">,</span> key<span class="token punctuation">)</span><span class="token punctuation">;</span>
<span class="token punctuation">}</span>

<span class="token keyword">export</span> <span class="token keyword">function</span> <span class="token function">createHostRootFiber</span><span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
  <span class="token keyword">return</span> <span class="token function">createFiber</span><span class="token punctuation">(</span>HostRoot<span class="token punctuation">,</span> <span class="token keyword">null</span><span class="token punctuation">,</span> <span class="token keyword">null</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
<span class="token punctuation">}</span>

<span class="token doc-comment comment">/**
 * 基于老fiber和新属性创建新的fiber
 * <span class="token keyword">@param</span> <span class="token parameter">current</span> 老fiber
 * <span class="token keyword">@param</span> <span class="token parameter">pendingProps</span> 新属性
 */</span>
<span class="token keyword">export</span> <span class="token keyword">function</span> <span class="token function">createWorkInProgress</span><span class="token punctuation">(</span><span class="token parameter">current<span class="token punctuation">,</span> pendingProps</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
  <span class="token keyword">let</span> workInProgress <span class="token operator">=</span> current<span class="token punctuation">.</span>alternate<span class="token punctuation">;</span>
  <span class="token comment">// 首次渲染时为null</span>
  <span class="token keyword">if</span> <span class="token punctuation">(</span>workInProgress <span class="token operator">===</span> <span class="token keyword">null</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
    workInProgress <span class="token operator">=</span> <span class="token function">createFiber</span><span class="token punctuation">(</span>current<span class="token punctuation">.</span>tag<span class="token punctuation">,</span> pendingProps<span class="token punctuation">,</span> current<span class="token punctuation">.</span>key<span class="token punctuation">)</span><span class="token punctuation">;</span>
    workInProgress<span class="token punctuation">.</span>type <span class="token operator">=</span> current<span class="token punctuation">.</span>type<span class="token punctuation">;</span>
    workInProgress<span class="token punctuation">.</span>stateNode <span class="token operator">=</span> current<span class="token punctuation">.</span>stateNode<span class="token punctuation">;</span>
    <span class="token comment">// 双向指针</span>
    workInProgress<span class="token punctuation">.</span>alternate <span class="token operator">=</span> current<span class="token punctuation">;</span>
    current<span class="token punctuation">.</span>alternate <span class="token operator">=</span> workInProgress<span class="token punctuation">;</span>
  <span class="token punctuation">}</span> <span class="token keyword">else</span> <span class="token punctuation">{</span>
    workInProgress<span class="token punctuation">.</span>pendingProps <span class="token operator">=</span> pendingProps<span class="token punctuation">;</span>
    workInProgress<span class="token punctuation">.</span>type <span class="token operator">=</span> current<span class="token punctuation">.</span>type<span class="token punctuation">;</span>
    <span class="token comment">// 副作用清空</span>
    workInProgress<span class="token punctuation">.</span>flags <span class="token operator">=</span> NoFlags<span class="token punctuation">;</span>
    workInProgress<span class="token punctuation">.</span>subtreeFlags <span class="token operator">=</span> NoFlags<span class="token punctuation">;</span>
  <span class="token punctuation">}</span>
  workInProgress<span class="token punctuation">.</span>child <span class="token operator">=</span> current<span class="token punctuation">.</span>child<span class="token punctuation">;</span>
  workInProgress<span class="token punctuation">.</span>sibling <span class="token operator">=</span> current<span class="token punctuation">.</span>sibling<span class="token punctuation">;</span>
  workInProgress<span class="token punctuation">.</span>index <span class="token operator">=</span> current<span class="token punctuation">.</span>index<span class="token punctuation">;</span>
  workInProgress<span class="token punctuation">.</span>memoizedProps <span class="token operator">=</span> current<span class="token punctuation">.</span>memoizedProps<span class="token punctuation">;</span>
  workInProgress<span class="token punctuation">.</span>memoizedState <span class="token operator">=</span> current<span class="token punctuation">.</span>memoizedState<span class="token punctuation">;</span>
  workInProgress<span class="token punctuation">.</span>updateQueue <span class="token operator">=</span> current<span class="token punctuation">.</span>updateQueue<span class="token punctuation">;</span>
  <span class="token keyword">return</span> workInProgress<span class="token punctuation">;</span>
<span class="token punctuation">}</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>闲时加载</p><div class="language-javascript line-numbers-mode" data-ext="js"><pre class="language-javascript"><code><span class="token comment">// 后面再考虑实现优先队列</span>
<span class="token keyword">export</span> <span class="token keyword">function</span> <span class="token function">scheduleCallback</span><span class="token punctuation">(</span><span class="token parameter">callback</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
  <span class="token comment">// 告诉浏览器在空余时间调用回调</span>
  <span class="token function">requestIdleCallback</span><span class="token punctuation">(</span>callback<span class="token punctuation">)</span><span class="token punctuation">;</span>
<span class="token punctuation">}</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>然后是关键任务 beginWork，对虚拟 DOM 启动 tag 判断，不同类型的 tag 执行不同情况的 update 更新，对于当前的简单 JSX 模型，我们只判断 JSX 根组件(HostRoot--updateHostRoot)和原生标签组件(HostComponent--updateHostComponent)的情况执行更新</p><div class="language-javascript line-numbers-mode" data-ext="js"><pre class="language-javascript"><code><span class="token keyword">import</span> logger <span class="token keyword">from</span> <span class="token string">&quot;shared/logger&quot;</span><span class="token punctuation">;</span>
<span class="token keyword">import</span> <span class="token punctuation">{</span>
  HostComponent<span class="token punctuation">,</span>
  HostRoot<span class="token punctuation">,</span>
  HostText<span class="token punctuation">,</span>
<span class="token punctuation">}</span> <span class="token keyword">from</span> <span class="token string">&quot;react-reconciler/src/ReactWorkTags&quot;</span><span class="token punctuation">;</span>
<span class="token keyword">import</span> <span class="token punctuation">{</span> processUpdateQueue <span class="token punctuation">}</span> <span class="token keyword">from</span> <span class="token string">&quot;./ReactFiberClassUpdateQueue&quot;</span><span class="token punctuation">;</span>
<span class="token keyword">import</span> <span class="token punctuation">{</span> mountChildFibers<span class="token punctuation">,</span> reconcileChildFibers <span class="token punctuation">}</span> <span class="token keyword">from</span> <span class="token string">&quot;./ReactChildFiber&quot;</span><span class="token punctuation">;</span>
<span class="token keyword">import</span> <span class="token punctuation">{</span> shouldSetTextContent <span class="token punctuation">}</span> <span class="token keyword">from</span> <span class="token string">&quot;react-dom/src/client/ReactDOMHostConfig&quot;</span><span class="token punctuation">;</span>

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
 * 目标是根据虚拟DOM构建新的fiber子链表
 * <span class="token keyword">@param</span> <span class="token parameter">current</span> 老fiber
 * <span class="token keyword">@param</span> <span class="token parameter">workInProgress</span> 新fiber
 */</span>
<span class="token keyword">export</span> <span class="token keyword">function</span> <span class="token function">beginWork</span><span class="token punctuation">(</span><span class="token parameter">current<span class="token punctuation">,</span> workInProgress</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
  <span class="token function">logger</span><span class="token punctuation">(</span><span class="token string">&quot;beginWork&quot;</span><span class="token punctuation">,</span> workInProgress<span class="token punctuation">)</span><span class="token punctuation">;</span>
  <span class="token keyword">debugger</span><span class="token punctuation">;</span>
  <span class="token keyword">switch</span> <span class="token punctuation">(</span>workInProgress<span class="token punctuation">.</span>tag<span class="token punctuation">)</span> <span class="token punctuation">{</span>
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
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><div class="language-javascript line-numbers-mode" data-ext="js"><pre class="language-javascript"><code><span class="token keyword">export</span> <span class="token keyword">function</span> <span class="token function">shouldSetTextContent</span><span class="token punctuation">(</span><span class="token parameter">type<span class="token punctuation">,</span> props</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
  <span class="token keyword">return</span> <span class="token punctuation">(</span>
    <span class="token keyword">typeof</span> props<span class="token punctuation">.</span>children <span class="token operator">===</span> <span class="token string">&quot;string&quot;</span> <span class="token operator">||</span> <span class="token keyword">typeof</span> props<span class="token punctuation">.</span>children <span class="token operator">===</span> <span class="token string">&quot;number&quot;</span>
  <span class="token punctuation">)</span><span class="token punctuation">;</span>
<span class="token punctuation">}</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>对于 HostRoot，我们需要补充更新队列（考虑到下一次更新时原来的更新队列中任务可能还没执行完）</p><p>这里单向循环链表正式发挥作用，我们可以迅速地找到首尾更新节点，然后剪开变成单向链表，遍历老的单向链表更新拼接到新更新队列中，生成最新状态（仅概念层面理论，首次渲染还是不会生效）</p><div class="language-javascript line-numbers-mode" data-ext="js"><pre class="language-javascript"><code><span class="token keyword">import</span> <span class="token punctuation">{</span> markUpdateLaneFromFiberToRoot <span class="token punctuation">}</span> <span class="token keyword">from</span> <span class="token string">&quot;react-reconciler/src/ReactFiberConcurrentUpdate&quot;</span><span class="token punctuation">;</span>
<span class="token keyword">import</span> assign <span class="token keyword">from</span> <span class="token string">&quot;shared/assign&quot;</span><span class="token punctuation">;</span>

<span class="token keyword">export</span> <span class="token keyword">const</span> UpdateState <span class="token operator">=</span> <span class="token number">0</span><span class="token punctuation">;</span>

<span class="token keyword">export</span> <span class="token keyword">function</span> <span class="token function">initialUpdateQueue</span><span class="token punctuation">(</span><span class="token parameter">fiber</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
  <span class="token comment">// 创建一个新的更新队列</span>
  <span class="token keyword">const</span> queue <span class="token operator">=</span> <span class="token punctuation">{</span>
    <span class="token literal-property property">shared</span><span class="token operator">:</span> <span class="token punctuation">{</span>
      <span class="token comment">// pending是一个循环链表</span>
      <span class="token literal-property property">pending</span><span class="token operator">:</span> <span class="token keyword">null</span><span class="token punctuation">,</span>
    <span class="token punctuation">}</span><span class="token punctuation">,</span>
  <span class="token punctuation">}</span><span class="token punctuation">;</span>
  fiber<span class="token punctuation">.</span>updateQueue <span class="token operator">=</span> queue<span class="token punctuation">;</span>
<span class="token punctuation">}</span>

<span class="token keyword">export</span> <span class="token keyword">function</span> <span class="token function">createUpdate</span><span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
  <span class="token keyword">const</span> update <span class="token operator">=</span> <span class="token punctuation">{</span> <span class="token literal-property property">tag</span><span class="token operator">:</span> UpdateState <span class="token punctuation">}</span><span class="token punctuation">;</span>
  <span class="token keyword">return</span> update<span class="token punctuation">;</span>
<span class="token punctuation">}</span>

<span class="token keyword">export</span> <span class="token keyword">function</span> <span class="token function">enqueueUpdate</span><span class="token punctuation">(</span><span class="token parameter">fiber<span class="token punctuation">,</span> update</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
  <span class="token keyword">const</span> updateQueue <span class="token operator">=</span> fiber<span class="token punctuation">.</span>updateQueue<span class="token punctuation">;</span>
  <span class="token comment">// 取出fiber上已有的老的更新链表pending</span>
  <span class="token keyword">const</span> pending <span class="token operator">=</span> updateQueue<span class="token punctuation">.</span>shared<span class="token punctuation">.</span>pending<span class="token punctuation">;</span>
  <span class="token keyword">if</span> <span class="token punctuation">(</span>pending <span class="token operator">===</span> <span class="token keyword">null</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
    <span class="token comment">// pending不存在则直接将新的更新链表挂载上去</span>
    update<span class="token punctuation">.</span>next <span class="token operator">=</span> update<span class="token punctuation">;</span>
  <span class="token punctuation">}</span> <span class="token keyword">else</span> <span class="token punctuation">{</span>
    <span class="token comment">// pending存在，注意pending为循环链表</span>
    <span class="token comment">// 新链表update的尾部next指向老pending链表的头部（尾部的next即指向头部）</span>
    update<span class="token punctuation">.</span>next <span class="token operator">=</span> pending<span class="token punctuation">.</span>next<span class="token punctuation">;</span>
    <span class="token comment">// 老pending链表尾部next指向新链表update的头部</span>
    pending<span class="token punctuation">.</span>next <span class="token operator">=</span> update<span class="token punctuation">;</span>
  <span class="token punctuation">}</span>
  <span class="token comment">// 最终结果：pending要指向最后一个更新，最后一个更新next指向第一个更新，构成单向循环链表</span>
  updateQueue<span class="token punctuation">.</span>shared<span class="token punctuation">.</span>pending <span class="token operator">=</span> update<span class="token punctuation">;</span>
  <span class="token comment">// 返回根节点 从当前的fiber到根节点（涉及到优先级队列，此处暂时不考虑优先级）</span>
  <span class="token keyword">return</span> <span class="token function">markUpdateLaneFromFiberToRoot</span><span class="token punctuation">(</span>fiber<span class="token punctuation">)</span><span class="token punctuation">;</span>
<span class="token punctuation">}</span>

<span class="token doc-comment comment">/**
 * 根据老状态和更新队列中的更新计算最新状态
 * <span class="token keyword">@param</span> <span class="token parameter">workInProgress</span> 要计算的fiber
 */</span>
<span class="token keyword">export</span> <span class="token keyword">function</span> <span class="token function">processUpdateQueue</span><span class="token punctuation">(</span><span class="token parameter">workInProgress</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
  <span class="token keyword">const</span> queue <span class="token operator">=</span> workInProgress<span class="token punctuation">.</span>updateQueue<span class="token punctuation">;</span>
  <span class="token keyword">const</span> pendingQueue <span class="token operator">=</span> queue<span class="token punctuation">.</span>shared<span class="token punctuation">.</span>pending<span class="token punctuation">;</span>
  <span class="token comment">// 如果有更新，或者更新队列里有内容</span>
  <span class="token keyword">if</span> <span class="token punctuation">(</span>pendingQueue <span class="token operator">!==</span> <span class="token keyword">null</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
    <span class="token comment">// 清除等待生效的更新</span>
    queue<span class="token punctuation">.</span>shared<span class="token punctuation">.</span>pending <span class="token operator">=</span> <span class="token keyword">null</span><span class="token punctuation">;</span>
    <span class="token comment">// 拿到最后一个等待生效的更新 update = { payload: { element: &#39;h1&#39; } }</span>
    <span class="token keyword">const</span> lastPendingUpdate <span class="token operator">=</span> pendingQueue<span class="token punctuation">;</span>
    <span class="token comment">// 指向第一个更新</span>
    <span class="token keyword">const</span> firstPendingUpdate <span class="token operator">=</span> lastPendingUpdate<span class="token punctuation">.</span>next<span class="token punctuation">;</span>
    <span class="token comment">// 剪开更新链表，变成单链表</span>
    lastPendingUpdate<span class="token punctuation">.</span>next <span class="token operator">=</span> <span class="token keyword">null</span><span class="token punctuation">;</span>
    <span class="token comment">// 获取老状态 null</span>
    <span class="token keyword">let</span> newState <span class="token operator">=</span> workInProgress<span class="token punctuation">.</span>memoizedState<span class="token punctuation">;</span>
    <span class="token keyword">let</span> update <span class="token operator">=</span> firstPendingUpdate<span class="token punctuation">;</span>
    <span class="token keyword">while</span> <span class="token punctuation">(</span>update<span class="token punctuation">)</span> <span class="token punctuation">{</span>
      <span class="token comment">// 根据老状态和更新，计算新状态</span>
      newState <span class="token operator">=</span> <span class="token function">getStateFromUpdate</span><span class="token punctuation">(</span>update<span class="token punctuation">,</span> newState<span class="token punctuation">)</span><span class="token punctuation">;</span>
      update <span class="token operator">=</span> update<span class="token punctuation">.</span>next<span class="token punctuation">;</span>
    <span class="token punctuation">}</span>
    <span class="token comment">// 把最终计算到的状态赋值给memoizedState</span>
    workInProgress<span class="token punctuation">.</span>memoizedState <span class="token operator">=</span> newState<span class="token punctuation">;</span>
  <span class="token punctuation">}</span>
<span class="token punctuation">}</span>

<span class="token doc-comment comment">/**
 * 根据老状态和更新计算新状态
 * <span class="token keyword">@param</span> <span class="token parameter">update</span> 更新时的对象，含多种类型
 * <span class="token keyword">@param</span> <span class="token parameter">prevState</span>
 */</span>
<span class="token keyword">function</span> <span class="token function">getStateFromUpdate</span><span class="token punctuation">(</span><span class="token parameter">update<span class="token punctuation">,</span> prevState</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
  <span class="token keyword">switch</span> <span class="token punctuation">(</span>update<span class="token punctuation">.</span>tag<span class="token punctuation">)</span> <span class="token punctuation">{</span>
    <span class="token keyword">case</span> <span class="token literal-property property">UpdateState</span><span class="token operator">:</span>
      <span class="token keyword">const</span> <span class="token punctuation">{</span> payload <span class="token punctuation">}</span> <span class="token operator">=</span> update<span class="token punctuation">;</span>
      <span class="token keyword">return</span> <span class="token function">assign</span><span class="token punctuation">(</span><span class="token punctuation">{</span><span class="token punctuation">}</span><span class="token punctuation">,</span> prevState<span class="token punctuation">,</span> payload<span class="token punctuation">)</span><span class="token punctuation">;</span>
  <span class="token punctuation">}</span>
<span class="token punctuation">}</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>接下来是执行更新时调用 reconcileChildren 协调子节点的函数，这里需要判断 current 是否为 null 的情况，存在两种情况：</p><ol><li>新 fiber 没有老 fiber，虚拟 DOM 中的节点首次挂载时执行 mountChildFibers</li><li>存在老 fiber 需要执行 DOM-DIFF，后续的虚拟 DOM 更新会从这里执行，root 节点首次创建后协调虚拟 DOM 的根节点时也会执行 reconcileChildFibers</li></ol><ul><li>两种方法最终收束为同一个函数 createChildReconciler 的返回值，通过 shouldTracksSideEffects 副作用标识来区分</li><li>在分辨出首次挂载或更新的情况后，开始创建子协调器 Fiber，目前暂时只判断虚拟 DOM 的<code>$$typeof</code>为原生组件类型(REACT_ELEMENT_TYPE)，或者组件存在 children 数组的虚拟 DOM 的情况</li><li>完成了 reconcileChildFibers 创建完成子 Fiber 后，将子 Fiber 返回给当前后台节点 workInProgress 的 child，这里如果父 Fiber 只有一个子节点那么这个子节点就是 child，如果父 Fiber 下存在子节点数组（虚拟 DOM 的 props:children 数组），那么 children 中的第一个子节点会作为父 Fiber 的 child</li><li>child 作为 beginWork 的返回值将结束 beginWork 的调用，这里我们称其为 next。当 next 不为空，也就是仍存在 child 的情况下，next 会继续指向给后台节点 workInProgress，继续向下查找节点 child（深度优先 DFS），直到不存在更深层次的 child，next 为 null，此时 workInProgress 设为 null，结束工作单元调用，beginWork 正式结束</li></ul><p>注意：此处更新的情况只考虑新节点插入(Placement)的情况</p><div class="language-javascript line-numbers-mode" data-ext="js"><pre class="language-javascript"><code><span class="token doc-comment comment">/**
 * <span class="token keyword">@param</span> <span class="token parameter">shouldTracksSideEffects</span> 是否跟踪副作用
 */</span>
<span class="token keyword">import</span> <span class="token punctuation">{</span> <span class="token constant">REACT_ELEMENT_TYPE</span> <span class="token punctuation">}</span> <span class="token keyword">from</span> <span class="token string">&quot;shared/ReactSymbols&quot;</span><span class="token punctuation">;</span>
<span class="token keyword">import</span> <span class="token punctuation">{</span> createFiberFromElement<span class="token punctuation">,</span> createFiberFromText <span class="token punctuation">}</span> <span class="token keyword">from</span> <span class="token string">&quot;./ReactFiber&quot;</span><span class="token punctuation">;</span>
<span class="token keyword">import</span> <span class="token punctuation">{</span> Placement <span class="token punctuation">}</span> <span class="token keyword">from</span> <span class="token string">&quot;react-reconciler/src/ReactFiberFlags&quot;</span><span class="token punctuation">;</span>
<span class="token keyword">import</span> isArray <span class="token keyword">from</span> <span class="token string">&quot;shared/isArray&quot;</span><span class="token punctuation">;</span>

<span class="token keyword">function</span> <span class="token function">createChildReconciler</span><span class="token punctuation">(</span><span class="token parameter">shouldTracksSideEffects</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
  <span class="token keyword">function</span> <span class="token function">reconcileSingleElement</span><span class="token punctuation">(</span><span class="token parameter">returnFiber<span class="token punctuation">,</span> currentFirstFiber<span class="token punctuation">,</span> element</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
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
    <span class="token keyword">if</span> <span class="token punctuation">(</span>shouldTracksSideEffects<span class="token punctuation">)</span> <span class="token punctuation">{</span>
      <span class="token comment">// 副作用标识：插入DOM节点，在最后的提交阶段插入此节点</span>
      <span class="token comment">// React的渲染分渲染（创建Fiber树）和提交（更新真实DOM）两个阶段</span>
      newFiber<span class="token punctuation">.</span>flags <span class="token operator">|=</span> Placement<span class="token punctuation">;</span>
    <span class="token punctuation">}</span>
    <span class="token keyword">return</span> newFiber<span class="token punctuation">;</span>
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

  <span class="token keyword">function</span> <span class="token function">reconcilerChildrenArray</span><span class="token punctuation">(</span>
    <span class="token parameter">returnFiber<span class="token punctuation">,</span>
    currentFirstFiber<span class="token punctuation">,</span>
    newChildren</span>
  <span class="token punctuation">)</span> <span class="token punctuation">{</span>
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
   * <span class="token keyword">@param</span> <span class="token parameter">currentFirstFiber</span> current一般来说指老fiber的第一个子fiber
   * <span class="token keyword">@param</span> <span class="token parameter">newChild</span> 新的子虚拟DOM
   */</span>
  <span class="token keyword">function</span> <span class="token function">reconcileChildFibers</span><span class="token punctuation">(</span><span class="token parameter">returnFiber<span class="token punctuation">,</span> currentFirstFiber<span class="token punctuation">,</span> newChild</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
    <span class="token comment">// 现在暂时只考虑新节点只有一个的情况</span>
    <span class="token keyword">if</span> <span class="token punctuation">(</span><span class="token keyword">typeof</span> newChild <span class="token operator">===</span> <span class="token string">&quot;object&quot;</span> <span class="token operator">&amp;&amp;</span> newChild <span class="token operator">!==</span> <span class="token keyword">null</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
      <span class="token keyword">switch</span> <span class="token punctuation">(</span>newChild<span class="token punctuation">.</span>$$<span class="token keyword">typeof</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
        <span class="token keyword">case</span> <span class="token constant">REACT_ELEMENT_TYPE</span><span class="token operator">:</span>
          <span class="token keyword">return</span> <span class="token function">placeSingleChild</span><span class="token punctuation">(</span>
            <span class="token function">reconcileSingleElement</span><span class="token punctuation">(</span>returnFiber<span class="token punctuation">,</span> currentFirstFiber<span class="token punctuation">,</span> newChild<span class="token punctuation">)</span>
          <span class="token punctuation">)</span><span class="token punctuation">;</span>
        <span class="token keyword">default</span><span class="token operator">:</span>
          <span class="token keyword">break</span><span class="token punctuation">;</span>
      <span class="token punctuation">}</span>
    <span class="token punctuation">}</span>
    <span class="token comment">// newChild [文本节点， span虚拟元素]</span>
    <span class="token keyword">if</span> <span class="token punctuation">(</span><span class="token function">isArray</span><span class="token punctuation">(</span>newChild<span class="token punctuation">)</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
      <span class="token keyword">return</span> <span class="token function">reconcilerChildrenArray</span><span class="token punctuation">(</span>returnFiber<span class="token punctuation">,</span> currentFirstFiber<span class="token punctuation">,</span> newChild<span class="token punctuation">)</span><span class="token punctuation">;</span>
    <span class="token punctuation">}</span>
    <span class="token keyword">return</span> <span class="token keyword">null</span><span class="token punctuation">;</span>
  <span class="token punctuation">}</span>

  <span class="token keyword">return</span> reconcileChildFibers<span class="token punctuation">;</span>
<span class="token punctuation">}</span>

<span class="token comment">// 虚拟DOM初次挂载</span>
<span class="token keyword">export</span> <span class="token keyword">const</span> mountChildFibers <span class="token operator">=</span> <span class="token function">createChildReconciler</span><span class="token punctuation">(</span><span class="token boolean">false</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
<span class="token comment">//老fiber更新</span>
<span class="token keyword">export</span> <span class="token keyword">const</span> reconcileChildFibers <span class="token operator">=</span> <span class="token function">createChildReconciler</span><span class="token punctuation">(</span><span class="token boolean">true</span><span class="token punctuation">)</span><span class="token punctuation">;</span>

<span class="token doc-comment comment">/**
 * 根据虚拟DOM，创建Fiber节点
 * <span class="token keyword">@param</span> <span class="token parameter">element</span>
 */</span>
<span class="token keyword">export</span> <span class="token keyword">function</span> <span class="token function">createFiberFromElement</span><span class="token punctuation">(</span><span class="token parameter">element</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
  <span class="token keyword">const</span> <span class="token punctuation">{</span> type<span class="token punctuation">,</span> key<span class="token punctuation">,</span> <span class="token literal-property property">props</span><span class="token operator">:</span> pendingProps <span class="token punctuation">}</span> <span class="token operator">=</span> element<span class="token punctuation">;</span>
  <span class="token keyword">return</span> <span class="token function">createFiberFromTypeAndProps</span><span class="token punctuation">(</span>type<span class="token punctuation">,</span> key<span class="token punctuation">,</span> pendingProps<span class="token punctuation">)</span><span class="token punctuation">;</span>
<span class="token punctuation">}</span>

<span class="token keyword">function</span> <span class="token function">createFiberFromTypeAndProps</span><span class="token punctuation">(</span><span class="token parameter">type<span class="token punctuation">,</span> key<span class="token punctuation">,</span> pendingProps</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
  <span class="token keyword">let</span> tag <span class="token operator">=</span> IndeterminateComponent<span class="token punctuation">;</span>
  <span class="token keyword">if</span> <span class="token punctuation">(</span><span class="token keyword">typeof</span> type <span class="token operator">===</span> <span class="token string">&quot;string&quot;</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
    <span class="token comment">// type为字符串，说明是原生组件，div p span</span>
    tag <span class="token operator">=</span> HostComponent<span class="token punctuation">;</span>
  <span class="token punctuation">}</span>
  <span class="token keyword">const</span> fiber <span class="token operator">=</span> <span class="token function">createFiber</span><span class="token punctuation">(</span>tag<span class="token punctuation">,</span> pendingProps<span class="token punctuation">,</span> key<span class="token punctuation">)</span><span class="token punctuation">;</span>
  fiber<span class="token punctuation">.</span>type <span class="token operator">=</span> type<span class="token punctuation">;</span>
  <span class="token keyword">return</span> fiber<span class="token punctuation">;</span>
<span class="token punctuation">}</span>

<span class="token keyword">export</span> <span class="token keyword">function</span> <span class="token function">createFiberFromText</span><span class="token punctuation">(</span><span class="token parameter">content</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
  <span class="token keyword">return</span> <span class="token function">createFiber</span><span class="token punctuation">(</span>HostText<span class="token punctuation">,</span> content<span class="token punctuation">,</span> <span class="token keyword">null</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
<span class="token punctuation">}</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>关于 logger</p><p>为了能清楚看到 beginWork 的调用顺序，我们在 beginWork 方法开始的时候加入了 logger 打印日志方法，以便我们能看到 workInProgress 深度遍历的子节点情况</p><div class="language-javascript line-numbers-mode" data-ext="js"><pre class="language-javascript"><code><span class="token keyword">import</span> <span class="token operator">*</span> <span class="token keyword">as</span> ReactWorkTags <span class="token keyword">from</span> <span class="token string">&quot;react-reconciler/src/ReactWorkTags&quot;</span><span class="token punctuation">;</span>

<span class="token keyword">const</span> ReactWorkTagsMap <span class="token operator">=</span> <span class="token keyword">new</span> <span class="token class-name">Map</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
<span class="token keyword">for</span> <span class="token punctuation">(</span><span class="token keyword">const</span> tag <span class="token keyword">in</span> ReactWorkTags<span class="token punctuation">)</span> <span class="token punctuation">{</span>
  ReactWorkTagsMap<span class="token punctuation">.</span><span class="token function">set</span><span class="token punctuation">(</span>ReactWorkTags<span class="token punctuation">[</span>tag<span class="token punctuation">]</span><span class="token punctuation">,</span> tag<span class="token punctuation">)</span><span class="token punctuation">;</span>
<span class="token punctuation">}</span>

<span class="token keyword">export</span> <span class="token keyword">default</span> <span class="token keyword">function</span> <span class="token punctuation">(</span><span class="token parameter">prefix<span class="token punctuation">,</span> workInProgress</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
  <span class="token keyword">let</span> tagValue <span class="token operator">=</span> workInProgress<span class="token punctuation">.</span>tag<span class="token punctuation">;</span>
  <span class="token keyword">let</span> tagName <span class="token operator">=</span> ReactWorkTagsMap<span class="token punctuation">.</span><span class="token function">get</span><span class="token punctuation">(</span>tagValue<span class="token punctuation">)</span><span class="token punctuation">;</span>
  <span class="token keyword">let</span> str <span class="token operator">=</span> <span class="token template-string"><span class="token template-punctuation string">\`</span><span class="token string"> </span><span class="token interpolation"><span class="token interpolation-punctuation punctuation">\${</span>tagName<span class="token interpolation-punctuation punctuation">}</span></span><span class="token string"> </span><span class="token template-punctuation string">\`</span></span><span class="token punctuation">;</span>
  <span class="token keyword">if</span> <span class="token punctuation">(</span>tagName <span class="token operator">===</span> <span class="token string">&quot;HostComponent&quot;</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
    str <span class="token operator">+=</span> <span class="token template-string"><span class="token template-punctuation string">\`</span><span class="token string"> </span><span class="token interpolation"><span class="token interpolation-punctuation punctuation">\${</span>workInProgress<span class="token punctuation">.</span>type<span class="token interpolation-punctuation punctuation">}</span></span><span class="token string"> </span><span class="token template-punctuation string">\`</span></span><span class="token punctuation">;</span>
  <span class="token punctuation">}</span> <span class="token keyword">else</span> <span class="token keyword">if</span> <span class="token punctuation">(</span>tagName <span class="token operator">===</span> <span class="token string">&quot;HostText&quot;</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
    str <span class="token operator">+=</span> <span class="token template-string"><span class="token template-punctuation string">\`</span><span class="token string"> </span><span class="token interpolation"><span class="token interpolation-punctuation punctuation">\${</span>workInProgress<span class="token punctuation">.</span>pendingProps<span class="token interpolation-punctuation punctuation">}</span></span><span class="token string"> </span><span class="token template-punctuation string">\`</span></span><span class="token punctuation">;</span>
  <span class="token punctuation">}</span>
  console<span class="token punctuation">.</span><span class="token function">log</span><span class="token punctuation">(</span><span class="token template-string"><span class="token template-punctuation string">\`</span><span class="token interpolation"><span class="token interpolation-punctuation punctuation">\${</span>prefix<span class="token interpolation-punctuation punctuation">}</span></span><span class="token string"> </span><span class="token interpolation"><span class="token interpolation-punctuation punctuation">\${</span>str<span class="token interpolation-punctuation punctuation">}</span></span><span class="token template-punctuation string">\`</span></span><span class="token punctuation">)</span><span class="token punctuation">;</span>
<span class="token punctuation">}</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>main.jsx</p><div class="language-jsx line-numbers-mode" data-ext="jsx"><pre class="language-jsx"><code><span class="token keyword">import</span> <span class="token punctuation">{</span> createRoot <span class="token punctuation">}</span> <span class="token keyword">from</span> <span class="token string">&quot;react-dom/client&quot;</span><span class="token punctuation">;</span>

<span class="token keyword">const</span> element <span class="token operator">=</span> <span class="token punctuation">(</span>
  <span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span>h1</span><span class="token punctuation">&gt;</span></span><span class="token plain-text">
    hello</span><span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span>span</span> <span class="token attr-name">style</span><span class="token script language-javascript"><span class="token script-punctuation punctuation">=</span><span class="token punctuation">{</span><span class="token punctuation">{</span> <span class="token literal-property property">color</span><span class="token operator">:</span> <span class="token string">&quot;red&quot;</span> <span class="token punctuation">}</span><span class="token punctuation">}</span></span><span class="token punctuation">&gt;</span></span><span class="token plain-text">world</span><span class="token tag"><span class="token tag"><span class="token punctuation">&lt;/</span>span</span><span class="token punctuation">&gt;</span></span><span class="token plain-text">
  </span><span class="token tag"><span class="token tag"><span class="token punctuation">&lt;/</span>h1</span><span class="token punctuation">&gt;</span></span>
<span class="token punctuation">)</span><span class="token punctuation">;</span>

<span class="token keyword">const</span> root <span class="token operator">=</span> <span class="token function">createRoot</span><span class="token punctuation">(</span>document<span class="token punctuation">.</span><span class="token function">getElementById</span><span class="token punctuation">(</span><span class="token string">&quot;root&quot;</span><span class="token punctuation">)</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
<span class="token comment">// 把element虚拟DOM挂载到容器中</span>
root<span class="token punctuation">.</span><span class="token function">render</span><span class="token punctuation">(</span>element<span class="token punctuation">)</span><span class="token punctuation">;</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>beginWork 输出结果，注意结合<a href="#_4-%E9%80%92%E5%BD%92%E6%9E%84%E5%BB%BA-fiber-%E6%A0%91">递归创建 Fiber 树</a>查看，整个 beginWork 的循环 会在最后一个 child，也就是文本节点 hello 这个地方结束</p><p><img src="https://misaka10032.oss-cn-chengdu.aliyuncs.com/React/beginWork-result.jpg" alt="beginWorkResult" loading="lazy"></p><h3 id="completework" tabindex="-1"><a class="header-anchor" href="#completework" aria-hidden="true">#</a> CompleteWork</h3><p>completeWork 的任务执行时间节点发生在 beginWork 的返回值为 null 的时候</p><p>在这之前我们已经了解到，beginWork 执行的是深度优先的子 Fiber 查找策略，在未能获取到下一级子 Fiber 时，beginWork 结束返回 null，执行 complete 任务更新 DOM（递归的归阶段）</p><p>此处暂时只考虑虚拟 DOM 的挂载添加操作，其余 DOM 的更新、移动、删除等操作暂不实现，因此也不存在更新副作用</p><p>首先在工作单元函数中更新 completeUnitOfWork</p><div class="language-javascript line-numbers-mode" data-ext="js"><pre class="language-javascript"><code><span class="token doc-comment comment">/**
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
    <span class="token comment">// 也就是说一个父fiber，所有的子fiber全部完成了</span>
    completedWork <span class="token operator">=</span> returnFiber<span class="token punctuation">;</span>
    workInProgress <span class="token operator">=</span> completedWork<span class="token punctuation">;</span>
    <span class="token comment">// 执行递归的 归阶段，当兄弟节点为空的时候执行while循环往上返回，直到根fiber时退出循环</span>
  <span class="token punctuation">}</span> <span class="token keyword">while</span> <span class="token punctuation">(</span>completedWork <span class="token operator">!==</span> <span class="token keyword">null</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
<span class="token punctuation">}</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>然后是关键任务 completeWork，同样也是 tag 判断，对不同类型的 tag 对应的不同组件执行不同情况的 update 更新，这里暂时只实现 create 新建挂载操作</p><p>在 completeWork 中，会对虚拟 DOM 执行真实 DOM 的创建与 append 操作，并且最后会有一个向上冒泡的方法 bubbleProperties，旨在将子节点的更新副作用不断向上传递汇聚</p><div class="language-javascript line-numbers-mode" data-ext="js"><pre class="language-javascript"><code><span class="token keyword">import</span> logger<span class="token punctuation">,</span> <span class="token punctuation">{</span> indent <span class="token punctuation">}</span> <span class="token keyword">from</span> <span class="token string">&quot;shared/logger&quot;</span><span class="token punctuation">;</span>
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
<span class="token punctuation">}</span> <span class="token keyword">from</span> <span class="token string">&quot;react-dom/src/client/ReactDOMHostConfig&quot;</span><span class="token punctuation">;</span>
<span class="token keyword">import</span> <span class="token punctuation">{</span> NoFlags <span class="token punctuation">}</span> <span class="token keyword">from</span> <span class="token string">&quot;react-reconciler/src/ReactFiberFlags&quot;</span><span class="token punctuation">;</span>

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
    <span class="token keyword">case</span> <span class="token literal-property property">HostComponent</span><span class="token operator">:</span>
      <span class="token comment">// 暂时只处理初次创建或挂载的新节点逻辑</span>
      <span class="token comment">// 创建真实的DOM节点</span>
      <span class="token keyword">const</span> <span class="token punctuation">{</span> type <span class="token punctuation">}</span> <span class="token operator">=</span> workInProgress<span class="token punctuation">;</span>
      <span class="token keyword">const</span> instance <span class="token operator">=</span> <span class="token function">createInstance</span><span class="token punctuation">(</span>type<span class="token punctuation">,</span> newProps<span class="token punctuation">,</span> workInProgress<span class="token punctuation">)</span><span class="token punctuation">;</span>
      <span class="token comment">// 把自己所有的儿子都添加到自己身上</span>
      <span class="token function">appendAllChildren</span><span class="token punctuation">(</span>instance<span class="token punctuation">,</span> workInProgress<span class="token punctuation">)</span><span class="token punctuation">;</span>
      workInProgress<span class="token punctuation">.</span>stateNode <span class="token operator">=</span> instance<span class="token punctuation">;</span>
      <span class="token function">finalizeInitialChildren</span><span class="token punctuation">(</span>instance<span class="token punctuation">,</span> type<span class="token punctuation">,</span> newProps<span class="token punctuation">)</span><span class="token punctuation">;</span>
      <span class="token function">bubbleProperties</span><span class="token punctuation">(</span>workInProgress<span class="token punctuation">)</span><span class="token punctuation">;</span>
      <span class="token keyword">break</span><span class="token punctuation">;</span>
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
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>下面是初始化 DOM 实例和设置 prop 的方法</p><div class="language-javascript line-numbers-mode" data-ext="js"><pre class="language-javascript"><code><span class="token keyword">import</span> <span class="token punctuation">{</span> setInitialProperties <span class="token punctuation">}</span> <span class="token keyword">from</span> <span class="token string">&quot;react-dom/src/client/ReactDOMComponent&quot;</span><span class="token punctuation">;</span>

<span class="token keyword">export</span> <span class="token keyword">function</span> <span class="token function">shouldSetTextContent</span><span class="token punctuation">(</span><span class="token parameter">type<span class="token punctuation">,</span> props</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
  <span class="token keyword">return</span> <span class="token punctuation">(</span>
    <span class="token keyword">typeof</span> props<span class="token punctuation">.</span>children <span class="token operator">===</span> <span class="token string">&quot;string&quot;</span> <span class="token operator">||</span> <span class="token keyword">typeof</span> props<span class="token punctuation">.</span>children <span class="token operator">===</span> <span class="token string">&quot;number&quot;</span>
  <span class="token punctuation">)</span><span class="token punctuation">;</span>
<span class="token punctuation">}</span>

<span class="token keyword">export</span> <span class="token keyword">function</span> <span class="token function">createTextInstance</span><span class="token punctuation">(</span><span class="token parameter">newText</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
  <span class="token keyword">return</span> document<span class="token punctuation">.</span><span class="token function">createTextNode</span><span class="token punctuation">(</span>newText<span class="token punctuation">)</span><span class="token punctuation">;</span>
<span class="token punctuation">}</span>

<span class="token keyword">export</span> <span class="token keyword">function</span> <span class="token function">createInstance</span><span class="token punctuation">(</span><span class="token parameter">type<span class="token punctuation">,</span> newProps<span class="token punctuation">,</span> workInProgress</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
  <span class="token keyword">const</span> domElement <span class="token operator">=</span> document<span class="token punctuation">.</span><span class="token function">createElement</span><span class="token punctuation">(</span>type<span class="token punctuation">)</span><span class="token punctuation">;</span>
  <span class="token comment">// 属性的添加TODO updateFiberProps(domElement, props);</span>
  <span class="token keyword">return</span> domElement<span class="token punctuation">;</span>
<span class="token punctuation">}</span>

<span class="token keyword">export</span> <span class="token keyword">function</span> <span class="token function">appendInitialChild</span><span class="token punctuation">(</span><span class="token parameter">parent<span class="token punctuation">,</span> child</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
  parent<span class="token punctuation">.</span><span class="token function">appendChild</span><span class="token punctuation">(</span>child<span class="token punctuation">)</span><span class="token punctuation">;</span>
<span class="token punctuation">}</span>

<span class="token keyword">export</span> <span class="token keyword">function</span> <span class="token function">finalizeInitialChildren</span><span class="token punctuation">(</span><span class="token parameter">domElement<span class="token punctuation">,</span> type<span class="token punctuation">,</span> props<span class="token punctuation">,</span> hostContext</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
  <span class="token function">setInitialProperties</span><span class="token punctuation">(</span>domElement<span class="token punctuation">,</span> type<span class="token punctuation">,</span> props<span class="token punctuation">)</span><span class="token punctuation">;</span>
<span class="token punctuation">}</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><div class="language-javascript line-numbers-mode" data-ext="js"><pre class="language-javascript"><code><span class="token keyword">import</span> <span class="token punctuation">{</span> setValueForStyles <span class="token punctuation">}</span> <span class="token keyword">from</span> <span class="token string">&quot;react-dom/src/client/CSSPropertyOperations&quot;</span><span class="token punctuation">;</span>
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
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>completeWork 输出结果，除了完整的 child 和 sibling 关系之外，注意每个 Fiber 的 stateNode 均已完成 DOM 元素挂载（原生元素节点、文本节点）</p><p><img src="https://misaka10032.oss-cn-chengdu.aliyuncs.com/React/completeWork-result.jpg" alt="completeWorkResult" loading="lazy"></p><h3 id="commitwork" tabindex="-1"><a class="header-anchor" href="#commitwork" aria-hidden="true">#</a> CommitWork</h3><p>完成 BeginWork 和 CompleteWork 之后，Work 工作进入提交阶段 CommitWork，执行 DOM 节点的更新（增删改等操作）</p><p>按照之前的工作单元渲染顺序，等到根节点渲染（renderRootSync）完成后，正式进入提交阶段</p><div class="language-javascript line-numbers-mode" data-ext="js"><pre class="language-javascript"><code><span class="token doc-comment comment">/**
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
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>提交阶段分两步，第一步为 mutation，意为向上提交子节点的副作用；第二步才是真正的处理 DOM 操作</p><div class="language-javascript line-numbers-mode" data-ext="js"><pre class="language-javascript"><code><span class="token doc-comment comment">/**
 * 遍历Fiber树，执行fiber上的副作用
 * <span class="token keyword">@param</span> <span class="token parameter">finishedWork</span> fiberJ节点
 * <span class="token keyword">@param</span> <span class="token parameter">root</span> 根节点
 */</span>
<span class="token keyword">export</span> <span class="token keyword">function</span> <span class="token function">commitMutationEffectsOnFiber</span><span class="token punctuation">(</span><span class="token parameter">finishedWork<span class="token punctuation">,</span> root</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
  <span class="token keyword">switch</span> <span class="token punctuation">(</span>finishedWork<span class="token punctuation">.</span>tag<span class="token punctuation">)</span> <span class="token punctuation">{</span>
    <span class="token keyword">case</span> <span class="token literal-property property">HostRoot</span><span class="token operator">:</span>
    <span class="token keyword">case</span> <span class="token literal-property property">HostComponent</span><span class="token operator">:</span>
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
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>commitPlacement：节点新增处理阶段，根据 tag 类型区别执行不同的插入操作，但总体分为两步：</p><ol><li>获取最近的真实 DOM 节点：这一步发生在 getHostSibling 函数里，意为剥离 Class 节点或 Function 节点，获取到真正的原生节点或文本节点，如果当前 Fiber 的 sibling 中没有，就向上 return 查找，再查找 return 父节点的 sibling 或 child，寻找非空原生或文本节点</li><li>对于根节点 root 而言，首次挂载执行一个整体 DOM 的 append 即可（通过 isHost 判断）；非 root 节点遍历 child 和 sibling 执行 append。这一步发生在 insertOrAppendPlacementNode 函数里</li></ol><div class="language-javascript line-numbers-mode" data-ext="js"><pre class="language-javascript"><code><span class="token keyword">function</span> <span class="token function">isHostParent</span><span class="token punctuation">(</span><span class="token parameter">fiber</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
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
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>至此，JSX 到 Fiber 到真实 DOM 的转化正式完成</p><p><img src="https://misaka10032.oss-cn-chengdu.aliyuncs.com/React/commitWork-result.jpg" alt="commitWork-result" loading="lazy"></p>`,118);function m(b,w){const t=l("CodeDemo");return p(),o("div",null,[r,c(t,{id:"code-demo-81",type:"normal",title:"requestIdleCallback",code:"eJydVF1PE0EU/SuT1ZA2wVIe5EFoX/TFxMREY3xwTSjtlK5MZ7E7DTGkCaAEKhVIJFIQNU2UQi3ypbi0Ff7Mzu72yb/gnZ22tnzVmOwms3fm3HPuPXdnUkmwJFFuKUMjacZ0irRYSFVGGFWVsDNzzOeqvDbFiwv1Us7dnU7h52lssLsxgm9HCBmJRMeG+iQwrFKlV3lmQKp4mkaZBrkMgvG4L5ZORcSnH02qFKG4nkI+ghliKITuRBgOUH3C5x9sW6MbsDkUQk3kIAJsRqXwRHVqMDShp8YMgD8RCeF8KCxzIyT2dYIDRB/1qYpTLlvmlGWWrGqVvy7IUlTFPygPS339wWCwGbkS7lTf2h8+NeGZ3n8gr+S6kN+8irsN/R/cZrZ74VfU/Rd9nvsprFouj+MUeJp8RDV2P/4YnAFdnihhsnAKjPIMCxgJLc7AarEpIt4STG2lEsF7ug4zgyMxolHcyNTXh8AIbhbt/G7/QGAgafyu5ewfS25xnq9t2dmiW8jxb7n617xVy/PZeadStI4X+PIiHOObM/bHDfc0b29k7dWj+up3CFq1dYlqMgqWzibYG2UgdNZf8ey29WtNQoFfVXpRU16AaUn8ACcjGtXoqM8vSwO1khQY28H8+MgyV6QSGW+4s7fvnr7ns1/4SclZ3HX3XjorW3LL61RCIxi1WnKWE4VRP+rpabSYYDrKEhALNlqHLvJHGtmp9aBwVu7ePrTJ/XnI5ypSGTTO3Zzm85/tdzvQCb68eb4YkVSLI9+lcjq67EUQGuZLJZHEXLg+eVmdGWm6J80y37hHh/Dp7GT5yWxrEiCBXS4425X66gGclJ0clizNUb/gDvPEiiloNaZ108BNCOMb06PpJKYsANDUi4eY4CjTUzAk17ybUsBgEdBplGhRMe9tv2Z3vk4oTRMifgt4lcwfpciKqQ=="},{default:i(()=>[k,d]),_:1}),v])}const g=e(u,[["render",m],["__file","2-fiber.html.vue"]]);export{g as default};
