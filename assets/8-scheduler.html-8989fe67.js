import{_ as c,C as a,Y as i,Z as l,$ as s,a0 as n,a2 as t,a3 as u,a1 as p}from"./framework-bb209140.js";const r={},k=p(`<h2 id="messagechannel" tabindex="-1"><a class="header-anchor" href="#messagechannel" aria-hidden="true">#</a> MessageChannel</h2><p>在上面的源码中，我们使用 requestIdleCallback 来实现浏览器帧渲染与 JS 优化，但是目前 requestIdleCallback 的浏览器兼容性比较差</p><p>所以目前 React 利用 MessageChannel 模拟了 requestIdleCallback，将回调延迟到绘制操作之后执行</p><p>MessageChannel API 允许我们创建一个新的消息通道，并通过它的两个 MessagePort 属性发送数据</p><p>MessageChannel 创建了一个通信的管道，这个管道有两个端口，每个端口都可以通过 postMessage 发送数据，而一个端口只要绑定了 onmessage 回调方法，就可以接收从另一个端口传过来的数据</p><p>MessageChannel 是一个宏任务</p><figure><img src="https://misaka10032.oss-cn-chengdu.aliyuncs.com/React/liu_lan_qi_zhen.jpg" alt="MessageChannel" tabindex="0" loading="lazy"><figcaption>MessageChannel</figcaption></figure><p>以下是一个 MessageChannel 的代码示例</p><div class="language-javascript line-numbers-mode" data-ext="js"><pre class="language-javascript"><code><span class="token keyword">var</span> channel <span class="token operator">=</span> <span class="token keyword">new</span> <span class="token class-name">MessageChannel</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
<span class="token keyword">var</span> port1 <span class="token operator">=</span> channel<span class="token punctuation">.</span>port1<span class="token punctuation">;</span>
<span class="token keyword">var</span> port2 <span class="token operator">=</span> channel<span class="token punctuation">.</span>port2<span class="token punctuation">;</span>
port1<span class="token punctuation">.</span><span class="token function-variable function">onmessage</span> <span class="token operator">=</span> <span class="token keyword">function</span> <span class="token punctuation">(</span><span class="token parameter">event</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
  console<span class="token punctuation">.</span><span class="token function">log</span><span class="token punctuation">(</span><span class="token string">&quot;port1收到来自port2的数据：&quot;</span> <span class="token operator">+</span> event<span class="token punctuation">.</span>data<span class="token punctuation">)</span><span class="token punctuation">;</span>
<span class="token punctuation">}</span><span class="token punctuation">;</span>
port2<span class="token punctuation">.</span><span class="token function-variable function">onmessage</span> <span class="token operator">=</span> <span class="token keyword">function</span> <span class="token punctuation">(</span><span class="token parameter">event</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
  console<span class="token punctuation">.</span><span class="token function">log</span><span class="token punctuation">(</span><span class="token string">&quot;port2收到来自port1的数据：&quot;</span> <span class="token operator">+</span> event<span class="token punctuation">.</span>data<span class="token punctuation">)</span><span class="token punctuation">;</span>
<span class="token punctuation">}</span><span class="token punctuation">;</span>
port1<span class="token punctuation">.</span><span class="token function">postMessage</span><span class="token punctuation">(</span><span class="token string">&quot;发送给port2&quot;</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
port2<span class="token punctuation">.</span><span class="token function">postMessage</span><span class="token punctuation">(</span><span class="token string">&quot;发送给port1&quot;</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h2 id="最小堆" tabindex="-1"><a class="header-anchor" href="#最小堆" aria-hidden="true">#</a> 最小堆</h2><h3 id="二叉树简介" tabindex="-1"><a class="header-anchor" href="#二叉树简介" aria-hidden="true">#</a> 二叉树简介</h3><p>二叉树：每个节点最多有两个子节点</p><p>满二叉树：除最后一层无任何子节点外，每一层上的所有节点都有两个子节点的二叉树</p><figure><img src="https://misaka10032.oss-cn-chengdu.aliyuncs.com/React/manerchashu.jpg" alt="满二叉树" tabindex="0" loading="lazy"><figcaption>满二叉树</figcaption></figure><p>完全二叉树：</p><ul><li>叶子节点只能出现在最下层和次下层</li><li>且最下层的叶子节点集中在树的左部</li></ul><figure><img src="https://misaka10032.oss-cn-chengdu.aliyuncs.com/React/wanquanerchashu.jpg" alt="完全二叉树" tabindex="0" loading="lazy"><figcaption>完全二叉树</figcaption></figure><h3 id="最小堆机制" tabindex="-1"><a class="header-anchor" href="#最小堆机制" aria-hidden="true">#</a> 最小堆机制</h3><ul><li>最小堆是一种经过排序的完全二叉树</li><li>其中任一非终端节点的数据均不大于其左子节点和右子节点的值</li><li>根节点值是所有堆节点值中的最小值</li><li>编号关系： <ul><li>左子节点编号 = 父节点编号 x 2</li><li>右子节点编号 = 左子节点编号 + 1</li><li>父节点编号 = 子节点编号 / 2</li></ul></li><li>索引关系 <ul><li>左子节点索引 = (父节点索引 + 1) x 2 - 1</li><li>右子节点索引 = 左子节点索引 + 1</li><li>父节点索引 = (子节点索引 - 1) / 2</li></ul></li></ul><figure><img src="https://misaka10032.oss-cn-chengdu.aliyuncs.com/React/zui_xiao_dui_1_1643275468911.jpg" alt="最小堆" tabindex="0" loading="lazy"><figcaption>最小堆</figcaption></figure><p>使用最小堆的原因：</p><ol><li>设定任务队列，任务优先级越高，编号值越小</li><li>使推入最小堆中的任务队列永远是优先级最高的任务对象拍在顶点，永远取出优先级最高的任务</li></ol><h3 id="schedulerminheap-js" tabindex="-1"><a class="header-anchor" href="#schedulerminheap-js" aria-hidden="true">#</a> SchedulerMinHeap.js</h3><p>方法简析</p><ul><li>peek：查看堆的顶点</li><li>pop：弹出堆的顶点后需要调用 siftDown 函数向下调整堆</li><li>push：添加新节点后需要调用 siftUp 函数向上调整堆</li><li>siftDown：向下调整堆结构，保证最小堆</li><li>siftUp：向上调整堆结构，保证最小堆</li></ul><p>react\\packages\\scheduler\\src\\SchedulerMinHeap.js</p><div class="language-javascript line-numbers-mode" data-ext="js"><pre class="language-javascript"><code><span class="token comment">// 最小堆方法</span>
<span class="token keyword">export</span> <span class="token keyword">function</span> <span class="token function">push</span><span class="token punctuation">(</span><span class="token parameter">heap<span class="token punctuation">,</span> node</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
  <span class="token keyword">const</span> index <span class="token operator">=</span> heap<span class="token punctuation">.</span>length<span class="token punctuation">;</span>
  heap<span class="token punctuation">.</span><span class="token function">push</span><span class="token punctuation">(</span>node<span class="token punctuation">)</span><span class="token punctuation">;</span>
  <span class="token function">siftUp</span><span class="token punctuation">(</span>heap<span class="token punctuation">,</span> node<span class="token punctuation">,</span> index<span class="token punctuation">)</span><span class="token punctuation">;</span>
<span class="token punctuation">}</span>

<span class="token keyword">export</span> <span class="token keyword">function</span> <span class="token function">peek</span><span class="token punctuation">(</span><span class="token parameter">heap</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
  <span class="token keyword">return</span> heap<span class="token punctuation">.</span>length <span class="token operator">===</span> <span class="token number">0</span> <span class="token operator">?</span> <span class="token keyword">null</span> <span class="token operator">:</span> heap<span class="token punctuation">[</span><span class="token number">0</span><span class="token punctuation">]</span><span class="token punctuation">;</span>
<span class="token punctuation">}</span>

<span class="token keyword">export</span> <span class="token keyword">function</span> <span class="token function">pop</span><span class="token punctuation">(</span><span class="token parameter">heap</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
  <span class="token keyword">if</span> <span class="token punctuation">(</span>heap<span class="token punctuation">.</span>length <span class="token operator">===</span> <span class="token number">0</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
    <span class="token keyword">return</span> <span class="token keyword">null</span><span class="token punctuation">;</span>
  <span class="token punctuation">}</span>
  <span class="token keyword">const</span> first <span class="token operator">=</span> heap<span class="token punctuation">[</span><span class="token number">0</span><span class="token punctuation">]</span><span class="token punctuation">;</span>
  <span class="token keyword">const</span> last <span class="token operator">=</span> heap<span class="token punctuation">.</span><span class="token function">pop</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
  <span class="token keyword">if</span> <span class="token punctuation">(</span>last <span class="token operator">!==</span> first<span class="token punctuation">)</span> <span class="token punctuation">{</span>
    heap<span class="token punctuation">[</span><span class="token number">0</span><span class="token punctuation">]</span> <span class="token operator">=</span> last<span class="token punctuation">;</span>
    <span class="token function">siftDown</span><span class="token punctuation">(</span>heap<span class="token punctuation">,</span> last<span class="token punctuation">,</span> <span class="token number">0</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
  <span class="token punctuation">}</span>
  <span class="token keyword">return</span> first<span class="token punctuation">;</span>
<span class="token punctuation">}</span>

<span class="token keyword">function</span> <span class="token function">siftUp</span><span class="token punctuation">(</span><span class="token parameter">heap<span class="token punctuation">,</span> node<span class="token punctuation">,</span> i</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
  <span class="token keyword">let</span> index <span class="token operator">=</span> i<span class="token punctuation">;</span>
  <span class="token keyword">while</span> <span class="token punctuation">(</span>index <span class="token operator">&gt;</span> <span class="token number">0</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
    <span class="token keyword">const</span> parentIndex <span class="token operator">=</span> <span class="token punctuation">(</span>index <span class="token operator">-</span> <span class="token number">1</span><span class="token punctuation">)</span> <span class="token operator">&gt;&gt;&gt;</span> <span class="token number">1</span><span class="token punctuation">;</span>
    <span class="token keyword">const</span> parent <span class="token operator">=</span> heap<span class="token punctuation">[</span>parentIndex<span class="token punctuation">]</span><span class="token punctuation">;</span>
    <span class="token keyword">if</span> <span class="token punctuation">(</span><span class="token function">compare</span><span class="token punctuation">(</span>parent<span class="token punctuation">,</span> node<span class="token punctuation">)</span> <span class="token operator">&gt;</span> <span class="token number">0</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
      <span class="token comment">// The parent is larger. Swap positions.</span>
      heap<span class="token punctuation">[</span>parentIndex<span class="token punctuation">]</span> <span class="token operator">=</span> node<span class="token punctuation">;</span>
      heap<span class="token punctuation">[</span>index<span class="token punctuation">]</span> <span class="token operator">=</span> parent<span class="token punctuation">;</span>
      index <span class="token operator">=</span> parentIndex<span class="token punctuation">;</span>
    <span class="token punctuation">}</span> <span class="token keyword">else</span> <span class="token punctuation">{</span>
      <span class="token comment">// The parent is smaller. Exit.</span>
      <span class="token keyword">return</span><span class="token punctuation">;</span>
    <span class="token punctuation">}</span>
  <span class="token punctuation">}</span>
<span class="token punctuation">}</span>

<span class="token keyword">function</span> <span class="token function">siftDown</span><span class="token punctuation">(</span><span class="token parameter">heap<span class="token punctuation">,</span> node<span class="token punctuation">,</span> i</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
  <span class="token keyword">let</span> index <span class="token operator">=</span> i<span class="token punctuation">;</span>
  <span class="token keyword">const</span> length <span class="token operator">=</span> heap<span class="token punctuation">.</span>length<span class="token punctuation">;</span>
  <span class="token keyword">const</span> halfLength <span class="token operator">=</span> length <span class="token operator">&gt;&gt;&gt;</span> <span class="token number">1</span><span class="token punctuation">;</span>
  <span class="token keyword">while</span> <span class="token punctuation">(</span>index <span class="token operator">&lt;</span> halfLength<span class="token punctuation">)</span> <span class="token punctuation">{</span>
    <span class="token keyword">const</span> leftIndex <span class="token operator">=</span> <span class="token punctuation">(</span>index <span class="token operator">+</span> <span class="token number">1</span><span class="token punctuation">)</span> <span class="token operator">*</span> <span class="token number">2</span> <span class="token operator">-</span> <span class="token number">1</span><span class="token punctuation">;</span>
    <span class="token keyword">const</span> left <span class="token operator">=</span> heap<span class="token punctuation">[</span>leftIndex<span class="token punctuation">]</span><span class="token punctuation">;</span>
    <span class="token keyword">const</span> rightIndex <span class="token operator">=</span> leftIndex <span class="token operator">+</span> <span class="token number">1</span><span class="token punctuation">;</span>
    <span class="token keyword">const</span> right <span class="token operator">=</span> heap<span class="token punctuation">[</span>rightIndex<span class="token punctuation">]</span><span class="token punctuation">;</span>

    <span class="token comment">// If the left or right node is smaller, swap with the smaller of those.</span>
    <span class="token keyword">if</span> <span class="token punctuation">(</span><span class="token function">compare</span><span class="token punctuation">(</span>left<span class="token punctuation">,</span> node<span class="token punctuation">)</span> <span class="token operator">&lt;</span> <span class="token number">0</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
      <span class="token keyword">if</span> <span class="token punctuation">(</span>rightIndex <span class="token operator">&lt;</span> length <span class="token operator">&amp;&amp;</span> <span class="token function">compare</span><span class="token punctuation">(</span>right<span class="token punctuation">,</span> left<span class="token punctuation">)</span> <span class="token operator">&lt;</span> <span class="token number">0</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
        heap<span class="token punctuation">[</span>index<span class="token punctuation">]</span> <span class="token operator">=</span> right<span class="token punctuation">;</span>
        heap<span class="token punctuation">[</span>rightIndex<span class="token punctuation">]</span> <span class="token operator">=</span> node<span class="token punctuation">;</span>
        index <span class="token operator">=</span> rightIndex<span class="token punctuation">;</span>
      <span class="token punctuation">}</span> <span class="token keyword">else</span> <span class="token punctuation">{</span>
        heap<span class="token punctuation">[</span>index<span class="token punctuation">]</span> <span class="token operator">=</span> left<span class="token punctuation">;</span>
        heap<span class="token punctuation">[</span>leftIndex<span class="token punctuation">]</span> <span class="token operator">=</span> node<span class="token punctuation">;</span>
        index <span class="token operator">=</span> leftIndex<span class="token punctuation">;</span>
      <span class="token punctuation">}</span>
    <span class="token punctuation">}</span> <span class="token keyword">else</span> <span class="token keyword">if</span> <span class="token punctuation">(</span>rightIndex <span class="token operator">&lt;</span> length <span class="token operator">&amp;&amp;</span> <span class="token function">compare</span><span class="token punctuation">(</span>right<span class="token punctuation">,</span> node<span class="token punctuation">)</span> <span class="token operator">&lt;</span> <span class="token number">0</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
      heap<span class="token punctuation">[</span>index<span class="token punctuation">]</span> <span class="token operator">=</span> right<span class="token punctuation">;</span>
      heap<span class="token punctuation">[</span>rightIndex<span class="token punctuation">]</span> <span class="token operator">=</span> node<span class="token punctuation">;</span>
      index <span class="token operator">=</span> rightIndex<span class="token punctuation">;</span>
    <span class="token punctuation">}</span> <span class="token keyword">else</span> <span class="token punctuation">{</span>
      <span class="token comment">// Neither child is smaller. Exit.</span>
      <span class="token keyword">return</span><span class="token punctuation">;</span>
    <span class="token punctuation">}</span>
  <span class="token punctuation">}</span>
<span class="token punctuation">}</span>

<span class="token keyword">function</span> <span class="token function">compare</span><span class="token punctuation">(</span><span class="token parameter">a<span class="token punctuation">,</span> b</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
  <span class="token comment">// Compare sort index first, then task id.</span>
  <span class="token keyword">const</span> diff <span class="token operator">=</span> a<span class="token punctuation">.</span>sortIndex <span class="token operator">-</span> b<span class="token punctuation">.</span>sortIndex<span class="token punctuation">;</span>
  <span class="token keyword">return</span> diff <span class="token operator">!==</span> <span class="token number">0</span> <span class="token operator">?</span> diff <span class="token operator">:</span> a<span class="token punctuation">.</span>id <span class="token operator">-</span> b<span class="token punctuation">.</span>id<span class="token punctuation">;</span>
<span class="token punctuation">}</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h2 id="时间调度与优先级" tabindex="-1"><a class="header-anchor" href="#时间调度与优先级" aria-hidden="true">#</a> 时间调度与优先级</h2>`,28),d=p(`<figure><img src="https://misaka10032.oss-cn-chengdu.aliyuncs.com/React/shi_jian_qie_pian_diao_du_1643278352662.jpg" alt="时间切片" tabindex="0" loading="lazy"><figcaption>时间切片</figcaption></figure><figure><img src="https://misaka10032.oss-cn-chengdu.aliyuncs.com/React/duo_ge_ren_wu_1643279818108.jpg" alt="多任务队列" tabindex="0" loading="lazy"><figcaption>多任务队列</figcaption></figure><h3 id="schedulerpriorities-js" tabindex="-1"><a class="header-anchor" href="#schedulerpriorities-js" aria-hidden="true">#</a> SchedulerPriorities.js</h3><p>src\\scheduler\\src\\SchedulerPriorities.js</p><div class="language-javascript line-numbers-mode" data-ext="js"><pre class="language-javascript"><code><span class="token keyword">export</span> <span class="token keyword">const</span> NoPriority <span class="token operator">=</span> <span class="token number">0</span><span class="token punctuation">;</span>
<span class="token keyword">export</span> <span class="token keyword">const</span> ImmediatePriority <span class="token operator">=</span> <span class="token number">1</span><span class="token punctuation">;</span>
<span class="token keyword">export</span> <span class="token keyword">const</span> UserBlockingPriority <span class="token operator">=</span> <span class="token number">2</span><span class="token punctuation">;</span>
<span class="token keyword">export</span> <span class="token keyword">const</span> NormalPriority <span class="token operator">=</span> <span class="token number">3</span><span class="token punctuation">;</span>
<span class="token keyword">export</span> <span class="token keyword">const</span> LowPriority <span class="token operator">=</span> <span class="token number">4</span><span class="token punctuation">;</span>
<span class="token keyword">export</span> <span class="token keyword">const</span> IdlePriority <span class="token operator">=</span> <span class="token number">5</span><span class="token punctuation">;</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="scheduler-js" tabindex="-1"><a class="header-anchor" href="#scheduler-js" aria-hidden="true">#</a> Scheduler.js</h3><p>src\\scheduler\\src\\forks\\Scheduler.js</p><div class="language-javascript line-numbers-mode" data-ext="js"><pre class="language-javascript"><code><span class="token keyword">import</span> <span class="token punctuation">{</span> peek<span class="token punctuation">,</span> pop<span class="token punctuation">,</span> push <span class="token punctuation">}</span> <span class="token keyword">from</span> <span class="token string">&quot;./SchedulerMinHeap&quot;</span><span class="token punctuation">;</span>
<span class="token keyword">import</span> <span class="token punctuation">{</span>
  NoPriority<span class="token punctuation">,</span>
  ImmediatePriority<span class="token punctuation">,</span>
  UserBlockingPriority<span class="token punctuation">,</span>
  NormalPriority<span class="token punctuation">,</span>
  LowPriority<span class="token punctuation">,</span>
  IdlePriority<span class="token punctuation">,</span>
<span class="token punctuation">}</span> <span class="token keyword">from</span> <span class="token string">&quot;scheduler/src/forks/SchedulerPriorities&quot;</span><span class="token punctuation">;</span>

<span class="token comment">// 后面再考虑实现优先队列</span>
<span class="token comment">// export function scheduleCallback(callback) {</span>
<span class="token comment">//     // 告诉浏览器在空余时间调用回调</span>
<span class="token comment">//     requestIdleCallback(callback);</span>
<span class="token comment">// }</span>

<span class="token keyword">function</span> <span class="token function">getCurrentTime</span><span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
  <span class="token keyword">return</span> performance<span class="token punctuation">.</span><span class="token function">now</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
<span class="token punctuation">}</span>

<span class="token comment">// Max 31 bit integer. The max integer size in V8 for 32-bit systems.</span>
<span class="token comment">// Math.pow(2, 30) - 1</span>
<span class="token comment">// 0b111111111111111111111111111111</span>
<span class="token keyword">const</span> maxSigned31BitInt <span class="token operator">=</span> <span class="token number">1073741823</span><span class="token punctuation">;</span>

<span class="token comment">// Times out immediately</span>
<span class="token keyword">const</span> <span class="token constant">IMMEDIATE_PRIORITY_TIMEOUT</span> <span class="token operator">=</span> <span class="token operator">-</span><span class="token number">1</span><span class="token punctuation">;</span>
<span class="token comment">// Eventually times out</span>
<span class="token keyword">const</span> <span class="token constant">USER_BLOCKING_PRIORITY_TIMEOUT</span> <span class="token operator">=</span> <span class="token number">250</span><span class="token punctuation">;</span>
<span class="token keyword">const</span> <span class="token constant">NORMAL_PRIORITY_TIMEOUT</span> <span class="token operator">=</span> <span class="token number">5000</span><span class="token punctuation">;</span>
<span class="token keyword">const</span> <span class="token constant">LOW_PRIORITY_TIMEOUT</span> <span class="token operator">=</span> <span class="token number">10000</span><span class="token punctuation">;</span>
<span class="token comment">// Never times out</span>
<span class="token keyword">const</span> <span class="token constant">IDLE_PRIORITY_TIMEOUT</span> <span class="token operator">=</span> maxSigned31BitInt<span class="token punctuation">;</span>

<span class="token comment">// 任务ID计数器</span>
<span class="token keyword">let</span> taskIdCounter <span class="token operator">=</span> <span class="token number">1</span><span class="token punctuation">;</span>
<span class="token comment">// 任务最小堆</span>
<span class="token keyword">const</span> taskQueue <span class="token operator">=</span> <span class="token punctuation">[</span><span class="token punctuation">]</span><span class="token punctuation">;</span>
<span class="token keyword">let</span> scheduleHostCallback <span class="token operator">=</span> <span class="token keyword">null</span><span class="token punctuation">;</span>
<span class="token keyword">let</span> startTime <span class="token operator">=</span> <span class="token keyword">null</span><span class="token punctuation">;</span>
<span class="token comment">// 当前任务</span>
<span class="token keyword">let</span> currentTask <span class="token operator">=</span> <span class="token keyword">null</span><span class="token punctuation">;</span>
<span class="token comment">// 5ms 帧间隔时间；React每一帧向浏览器申请5ms用于自己任务执行</span>
<span class="token comment">// 如果5ms内没有完成，react也会放弃控制权，把控制权交给浏览器</span>
<span class="token keyword">const</span> frameInterval <span class="token operator">=</span> <span class="token number">5</span><span class="token punctuation">;</span>

<span class="token keyword">const</span> channel <span class="token operator">=</span> <span class="token keyword">new</span> <span class="token class-name">MessageChannel</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
<span class="token keyword">let</span> port1 <span class="token operator">=</span> channel<span class="token punctuation">.</span>port1<span class="token punctuation">;</span>
<span class="token keyword">let</span> port2 <span class="token operator">=</span> channel<span class="token punctuation">.</span>port2<span class="token punctuation">;</span>
port1<span class="token punctuation">.</span>onmessage <span class="token operator">=</span> performWorkUntilDeadLine<span class="token punctuation">;</span>

<span class="token doc-comment comment">/**
 * 按优先级执行任务
 * <span class="token keyword">@param</span> <span class="token parameter">priorityLevel</span>
 * <span class="token keyword">@param</span> <span class="token parameter">callback</span>
 */</span>
<span class="token keyword">export</span> <span class="token keyword">function</span> <span class="token function">scheduleCallback</span><span class="token punctuation">(</span><span class="token parameter">priorityLevel<span class="token punctuation">,</span> callback</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
  <span class="token comment">// 获取当前时间</span>
  <span class="token keyword">const</span> currentTime <span class="token operator">=</span> <span class="token function">getCurrentTime</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
  <span class="token comment">// 此任务的开始时间</span>
  <span class="token keyword">const</span> startTime <span class="token operator">=</span> currentTime<span class="token punctuation">;</span>
  <span class="token comment">// 超时时间</span>
  <span class="token keyword">let</span> timeout<span class="token punctuation">;</span>
  <span class="token keyword">switch</span> <span class="token punctuation">(</span>priorityLevel<span class="token punctuation">)</span> <span class="token punctuation">{</span>
    <span class="token keyword">case</span> <span class="token literal-property property">ImmediatePriority</span><span class="token operator">:</span>
      timeout <span class="token operator">=</span> <span class="token constant">IMMEDIATE_PRIORITY_TIMEOUT</span><span class="token punctuation">;</span> <span class="token comment">// -1</span>
      <span class="token keyword">break</span><span class="token punctuation">;</span>
    <span class="token keyword">case</span> <span class="token literal-property property">UserBlockingPriority</span><span class="token operator">:</span>
      timeout <span class="token operator">=</span> <span class="token constant">USER_BLOCKING_PRIORITY_TIMEOUT</span><span class="token punctuation">;</span> <span class="token comment">// 250ms</span>
      <span class="token keyword">break</span><span class="token punctuation">;</span>
    <span class="token keyword">case</span> <span class="token literal-property property">IdlePriority</span><span class="token operator">:</span>
      timeout <span class="token operator">=</span> <span class="token constant">IDLE_PRIORITY_TIMEOUT</span><span class="token punctuation">;</span> <span class="token comment">// 1073741823ms</span>
      <span class="token keyword">break</span><span class="token punctuation">;</span>
    <span class="token keyword">case</span> <span class="token literal-property property">LowPriority</span><span class="token operator">:</span>
      timeout <span class="token operator">=</span> <span class="token constant">LOW_PRIORITY_TIMEOUT</span><span class="token punctuation">;</span> <span class="token comment">// 10000ms</span>
      <span class="token keyword">break</span><span class="token punctuation">;</span>
    <span class="token keyword">case</span> <span class="token literal-property property">NormalPriority</span><span class="token operator">:</span>
    <span class="token keyword">default</span><span class="token operator">:</span>
      timeout <span class="token operator">=</span> <span class="token constant">NORMAL_PRIORITY_TIMEOUT</span><span class="token punctuation">;</span> <span class="token comment">// 5000ms</span>
      <span class="token keyword">break</span><span class="token punctuation">;</span>
  <span class="token punctuation">}</span>
  <span class="token comment">// 计算此任务的过期时间</span>
  <span class="token keyword">const</span> expirationTime <span class="token operator">=</span> startTime <span class="token operator">+</span> timeout<span class="token punctuation">;</span>
  <span class="token keyword">const</span> newTask <span class="token operator">=</span> <span class="token punctuation">{</span>
    <span class="token literal-property property">id</span><span class="token operator">:</span> taskIdCounter<span class="token operator">++</span><span class="token punctuation">,</span>
    callback<span class="token punctuation">,</span> <span class="token comment">// 回调任务函数</span>
    priorityLevel<span class="token punctuation">,</span> <span class="token comment">// 优先级别</span>
    startTime<span class="token punctuation">,</span> <span class="token comment">// 任务的开始时间</span>
    expirationTime<span class="token punctuation">,</span> <span class="token comment">// 任务的过期时间</span>
    <span class="token literal-property property">sortIndex</span><span class="token operator">:</span> expirationTime<span class="token punctuation">,</span> <span class="token comment">// 排序依据</span>
  <span class="token punctuation">}</span><span class="token punctuation">;</span>
  <span class="token comment">// 向任务最小堆里面添加任务，排序的依据是过期时间，时间最短的在队列头部</span>
  <span class="token function">push</span><span class="token punctuation">(</span>taskQueue<span class="token punctuation">,</span> newTask<span class="token punctuation">)</span><span class="token punctuation">;</span>
  <span class="token comment">// flushWork执行工作，刷新工作，执行任务</span>
  <span class="token function">requestHostCallback</span><span class="token punctuation">(</span>flushWork<span class="token punctuation">)</span><span class="token punctuation">;</span>
  <span class="token keyword">return</span> newTask<span class="token punctuation">;</span>
<span class="token punctuation">}</span>

<span class="token doc-comment comment">/**
 * 开始执行任务队列中的任务
 * <span class="token keyword">@param</span> <span class="token parameter">startTime</span>
 */</span>
<span class="token keyword">function</span> <span class="token function">flushWork</span><span class="token punctuation">(</span><span class="token parameter">startTime</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
  <span class="token keyword">return</span> <span class="token function">workLoop</span><span class="token punctuation">(</span>startTime<span class="token punctuation">)</span><span class="token punctuation">;</span>
<span class="token punctuation">}</span>

<span class="token keyword">function</span> <span class="token function">shouldYieldToHost</span><span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
  <span class="token comment">// 用当前时间减去开始的时间就是过去的时间</span>
  <span class="token keyword">const</span> timeElapsed <span class="token operator">=</span> <span class="token function">getCurrentTime</span><span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token operator">-</span> startTime<span class="token punctuation">;</span>
  <span class="token comment">// 如果流逝或经过的时间小于5ms，那就不需要放弃执行</span>
  <span class="token keyword">return</span> timeElapsed <span class="token operator">&gt;=</span> frameInterval<span class="token punctuation">;</span>
<span class="token punctuation">}</span>

<span class="token keyword">function</span> <span class="token function">workLoop</span><span class="token punctuation">(</span><span class="token parameter">startTime</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
  <span class="token keyword">let</span> currentTime <span class="token operator">=</span> startTime<span class="token punctuation">;</span>
  <span class="token comment">// 取出优先级最高的task</span>
  currentTask <span class="token operator">=</span> <span class="token function">peek</span><span class="token punctuation">(</span>taskQueue<span class="token punctuation">)</span><span class="token punctuation">;</span>
  <span class="token keyword">while</span> <span class="token punctuation">(</span>currentTask <span class="token operator">!==</span> <span class="token keyword">null</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
    <span class="token comment">// 如果此任务的过期时间大于当前时间，也就是没有过期，并且需要放弃执行 时间片到期</span>
    <span class="token keyword">if</span> <span class="token punctuation">(</span>currentTask<span class="token punctuation">.</span>expirationTime <span class="token operator">&gt;</span> currentTime <span class="token operator">&amp;&amp;</span> <span class="token function">shouldYieldToHost</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
      <span class="token comment">// 跳出工作循环</span>
      <span class="token keyword">break</span><span class="token punctuation">;</span>
    <span class="token punctuation">}</span>
    <span class="token comment">// 告诉浏览器要执行performConcurrentWorkOnRoot 在此触发更新</span>
    <span class="token keyword">const</span> callback <span class="token operator">=</span> currentTask<span class="token punctuation">.</span>callback<span class="token punctuation">;</span>
    <span class="token keyword">if</span> <span class="token punctuation">(</span><span class="token keyword">typeof</span> callback <span class="token operator">===</span> <span class="token string">&quot;function&quot;</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
      currentTask<span class="token punctuation">.</span>callback <span class="token operator">=</span> <span class="token keyword">null</span><span class="token punctuation">;</span>
      <span class="token keyword">const</span> continuationCallback <span class="token operator">=</span> <span class="token function">callback</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
      <span class="token comment">// 执行工作如果返回新的函数，表示当前工作未完成</span>
      <span class="token keyword">if</span> <span class="token punctuation">(</span><span class="token keyword">typeof</span> continuationCallback <span class="token operator">===</span> <span class="token string">&quot;function&quot;</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
        currentTask<span class="token punctuation">.</span>callback <span class="token operator">=</span> continuationCallback<span class="token punctuation">;</span>
        <span class="token keyword">return</span> <span class="token boolean">true</span><span class="token punctuation">;</span> <span class="token comment">// 还有任务要执行</span>
      <span class="token punctuation">}</span>
      <span class="token comment">// 如果此任务已经完成，则不需要再继续执行，可以把此任务弹出</span>
      <span class="token keyword">if</span> <span class="token punctuation">(</span>currentTask <span class="token operator">===</span> <span class="token function">peek</span><span class="token punctuation">(</span>taskQueue<span class="token punctuation">)</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
        <span class="token function">pop</span><span class="token punctuation">(</span>taskQueue<span class="token punctuation">)</span><span class="token punctuation">;</span>
      <span class="token punctuation">}</span>
    <span class="token punctuation">}</span> <span class="token keyword">else</span> <span class="token punctuation">{</span>
      <span class="token function">pop</span><span class="token punctuation">(</span>taskQueue<span class="token punctuation">)</span><span class="token punctuation">;</span>
    <span class="token punctuation">}</span>
    <span class="token comment">// 如果当前任务执行完了，或者当前任务不合法，取出下一个任务执行</span>
    currentTask <span class="token operator">=</span> <span class="token function">peek</span><span class="token punctuation">(</span>taskQueue<span class="token punctuation">)</span><span class="token punctuation">;</span>
  <span class="token punctuation">}</span>
  <span class="token comment">// 如果循环结束还有未完成的任务，表示hasMoreWork = true</span>
  <span class="token keyword">return</span> currentTask <span class="token operator">!==</span> <span class="token keyword">null</span><span class="token punctuation">;</span>
<span class="token punctuation">}</span>

<span class="token keyword">function</span> <span class="token function">requestHostCallback</span><span class="token punctuation">(</span><span class="token parameter">flushWork</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
  <span class="token comment">// 先缓存回调函数</span>
  scheduleHostCallback <span class="token operator">=</span> flushWork<span class="token punctuation">;</span>
  <span class="token comment">// 执行工作直到截止时间</span>
  <span class="token function">schedulePerformWorkUntilDeadLine</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
<span class="token punctuation">}</span>

<span class="token keyword">function</span> <span class="token function">schedulePerformWorkUntilDeadLine</span><span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
  port2<span class="token punctuation">.</span><span class="token function">postMessage</span><span class="token punctuation">(</span><span class="token keyword">null</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
<span class="token punctuation">}</span>

<span class="token keyword">function</span> <span class="token function">performWorkUntilDeadLine</span><span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
  <span class="token keyword">if</span> <span class="token punctuation">(</span>scheduleHostCallback<span class="token punctuation">)</span> <span class="token punctuation">{</span>
    <span class="token comment">// 先获取开始执行任务的时间</span>
    <span class="token comment">// 表示时间片的开始</span>
    startTime <span class="token operator">=</span> <span class="token function">getCurrentTime</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
    <span class="token comment">// 是否有更多的工作要做</span>
    <span class="token keyword">let</span> hasMoreWork <span class="token operator">=</span> <span class="token boolean">true</span><span class="token punctuation">;</span>
    <span class="token keyword">try</span> <span class="token punctuation">{</span>
      <span class="token comment">// 执行flushWork，并判断有没有返回值</span>
      hasMoreWork <span class="token operator">=</span> <span class="token function">scheduleHostCallback</span><span class="token punctuation">(</span>startTime<span class="token punctuation">)</span><span class="token punctuation">;</span>
    <span class="token punctuation">}</span> <span class="token keyword">finally</span> <span class="token punctuation">{</span>
      <span class="token comment">// 执行完以后说明还有更多工作要做</span>
      <span class="token keyword">if</span> <span class="token punctuation">(</span>hasMoreWork<span class="token punctuation">)</span> <span class="token punctuation">{</span>
        <span class="token comment">// 继续执行</span>
        <span class="token function">performWorkUntilDeadLine</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
      <span class="token punctuation">}</span> <span class="token keyword">else</span> <span class="token punctuation">{</span>
        scheduleHostCallback <span class="token operator">=</span> <span class="token keyword">null</span><span class="token punctuation">;</span>
      <span class="token punctuation">}</span>
    <span class="token punctuation">}</span>
  <span class="token punctuation">}</span>
<span class="token punctuation">}</span>

<span class="token keyword">export</span> <span class="token punctuation">{</span>
  shouldYieldToHost <span class="token keyword">as</span> shouldYield<span class="token punctuation">,</span>
  NoPriority<span class="token punctuation">,</span>
  ImmediatePriority<span class="token punctuation">,</span>
  UserBlockingPriority<span class="token punctuation">,</span>
  NormalPriority<span class="token punctuation">,</span>
  LowPriority<span class="token punctuation">,</span>
  IdlePriority<span class="token punctuation">,</span>
<span class="token punctuation">}</span><span class="token punctuation">;</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="reactfiberworkloop-js" tabindex="-1"><a class="header-anchor" href="#reactfiberworkloop-js" aria-hidden="true">#</a> ReactFiberWorkLoop.js</h3><p>src\\react-reconciler\\src\\ReactFiberWorkLoop.js</p><p>替换了原来的老 scheduleCallback 函数，更新了传入参数</p><p>加入 workLoopConcurrent 模式，与 workLoopSync 的区别是增加了判断 5ms 时间片逻辑</p><div class="language-javascript line-numbers-mode" data-ext="js"><pre class="language-javascript"><code><span class="token keyword">import</span> <span class="token punctuation">{</span>
  scheduleCallback<span class="token punctuation">,</span>
  NormalPriority <span class="token keyword">as</span> NormalSchedulePriority<span class="token punctuation">,</span>
  shouldYield<span class="token punctuation">,</span>
<span class="token punctuation">}</span> <span class="token keyword">from</span> <span class="token string">&quot;scheduler/index&quot;</span><span class="token punctuation">;</span>
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
  commitLayoutEffects<span class="token punctuation">,</span>
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
  <span class="token function">scheduleCallback</span><span class="token punctuation">(</span>
    NormalSchedulePriority<span class="token punctuation">,</span>
    <span class="token function">performConcurrentWorkOnRoot</span><span class="token punctuation">.</span><span class="token function">bind</span><span class="token punctuation">(</span><span class="token keyword">null</span><span class="token punctuation">,</span> root<span class="token punctuation">)</span>
  <span class="token punctuation">)</span><span class="token punctuation">;</span>
<span class="token punctuation">}</span>

<span class="token doc-comment comment">/**
 * 开始根据fiber构建fiber树，要创建真实的DOM节点，再把真实的DOM节点插入容器
 * <span class="token keyword">@param</span> <span class="token class-name"><span class="token punctuation">{</span><span class="token operator">*</span><span class="token punctuation">}</span></span> <span class="token parameter">root</span>
 */</span>
<span class="token keyword">function</span> <span class="token function">performConcurrentWorkOnRoot</span><span class="token punctuation">(</span><span class="token parameter">root</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
  <span class="token comment">// 第一次渲染以同步的方式渲染根节点，初次渲染的时候，都是同步执行</span>
  <span class="token comment">// 改成并发渲染</span>
  <span class="token comment">// renderRootSync(root);</span>
  <span class="token function">renderRootConcurrent</span><span class="token punctuation">(</span>root<span class="token punctuation">)</span><span class="token punctuation">;</span>
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
      <span class="token function">scheduleCallback</span><span class="token punctuation">(</span>NormalSchedulePriority<span class="token punctuation">,</span> flushPassiveEffect<span class="token punctuation">)</span><span class="token punctuation">;</span>
    <span class="token punctuation">}</span>
  <span class="token punctuation">}</span>
  console<span class="token punctuation">.</span><span class="token function">log</span><span class="token punctuation">(</span><span class="token string">&quot;~~~~~~~~~~~~~~~~~~~&quot;</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
  <span class="token keyword">const</span> subtreeHasEffects <span class="token operator">=</span>
    <span class="token punctuation">(</span>finishedWork<span class="token punctuation">.</span>subtreeFlags <span class="token operator">&amp;&amp;</span> MutationMask<span class="token punctuation">)</span> <span class="token operator">!==</span> NoFlags<span class="token punctuation">;</span>
  <span class="token keyword">const</span> rootHasEffect <span class="token operator">=</span> <span class="token punctuation">(</span>finishedWork<span class="token punctuation">.</span>flags <span class="token operator">&amp;&amp;</span> MutationMask<span class="token punctuation">)</span> <span class="token operator">!==</span> NoFlags<span class="token punctuation">;</span>
  <span class="token keyword">if</span> <span class="token punctuation">(</span>subtreeHasEffects <span class="token operator">||</span> rootHasEffect<span class="token punctuation">)</span> <span class="token punctuation">{</span>
    <span class="token comment">// 当DOM执行变更之后</span>
    <span class="token function">commitMutationEffectsOnFiber</span><span class="token punctuation">(</span>finishedWork<span class="token punctuation">,</span> root<span class="token punctuation">)</span><span class="token punctuation">;</span>
    <span class="token comment">// UI渲染之前：同步执行layoutEffect</span>
    <span class="token function">commitLayoutEffects</span><span class="token punctuation">(</span>finishedWork<span class="token punctuation">,</span> root<span class="token punctuation">)</span><span class="token punctuation">;</span>
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

<span class="token keyword">function</span> <span class="token function">renderRootConcurrent</span><span class="token punctuation">(</span><span class="token parameter">root</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
  <span class="token function">prepareFreshStack</span><span class="token punctuation">(</span>root<span class="token punctuation">)</span><span class="token punctuation">;</span>
  <span class="token function">workLoopConcurrent</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
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

<span class="token keyword">function</span> <span class="token function">workLoopConcurrent</span><span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
  <span class="token comment">// 如果有下一个要构建的fiber，并且时间片没有过期</span>
  <span class="token keyword">while</span> <span class="token punctuation">(</span>workInProgress <span class="token operator">!==</span> <span class="token keyword">null</span> <span class="token operator">&amp;&amp;</span> <span class="token operator">!</span><span class="token function">shouldYield</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
    <span class="token function">performUnitOfWork</span><span class="token punctuation">(</span>workInProgress<span class="token punctuation">)</span><span class="token punctuation">;</span>
  <span class="token punctuation">}</span>
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
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h2 id="手写源码仓库" tabindex="-1"><a class="header-anchor" href="#手写源码仓库" aria-hidden="true">#</a> 手写源码仓库</h2>`,14),v={href:"https://github.com/mi-saka10032/mini-react/tree/master/packages/messageChannel",target:"_blank",rel:"noopener noreferrer"};function m(b,f){const e=a("RouterLink"),o=a("ExternalLinkIcon");return i(),l("div",null,[k,s("p",null,[n("需要引入各类优先级常量，建立最小堆，管理队列任务，在"),t(e,{to:"/react%E6%BA%90%E7%A0%81%E5%88%86%E6%9E%90/2-fiber.html#requestIdleCallback"},{default:u(()=>[n("fiber-requestIdleCallback")]),_:1}),n("中通过 requestIdleCallback 实现的方法重新实现")]),d,s("p",null,[s("a",v,[n("https://github.com/mi-saka10032/mini-react/tree/master/packages/messageChannel"),t(o)])])])}const w=c(r,[["render",m],["__file","8-scheduler.html.vue"]]);export{w as default};
