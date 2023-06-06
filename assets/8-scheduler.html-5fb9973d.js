import{_ as c,C as a,Y as l,Z as i,$ as s,a0 as n,a2 as e,a3 as u,a1 as p}from"./framework-bb209140.js";const r={},k=p(`<h2 id="messagechannel" tabindex="-1"><a class="header-anchor" href="#messagechannel" aria-hidden="true">#</a> MessageChannel</h2><p>在上面的源码中，我们使用 requestIdleCallback 来实现浏览器帧渲染与 JS 优化，但是目前 requestIdleCallback 的浏览器兼容性比较差</p><p>所以目前 React 利用 MessageChannel 模拟了 requestIdleCallback，将回调延迟到绘制操作之后执行</p><p>MessageChannel API 允许我们创建一个新的消息通道，并通过它的两个 MessagePort 属性发送数据</p><p>MessageChannel 创建了一个通信的管道，这个管道有两个端口，每个端口都可以通过 postMessage 发送数据，而一个端口只要绑定了 onmessage 回调方法，就可以接收从另一个端口传过来的数据</p><p>MessageChannel 是一个宏任务</p><figure><img src="https://misaka10032.oss-cn-chengdu.aliyuncs.com/React/liu_lan_qi_zhen.jpg" alt="MessageChannel" tabindex="0" loading="lazy"><figcaption>MessageChannel</figcaption></figure><p>以下是一个 MessageChannel 的代码示例</p><div class="language-javascript line-numbers-mode" data-ext="js"><pre class="language-javascript"><code><span class="token keyword">var</span> channel <span class="token operator">=</span> <span class="token keyword">new</span> <span class="token class-name">MessageChannel</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
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
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h2 id="手写源码仓库" tabindex="-1"><a class="header-anchor" href="#手写源码仓库" aria-hidden="true">#</a> 手写源码仓库</h2>`,9),v={href:"https://github.com/mi-saka10032/mini-react/tree/master/packages/messageChannel",target:"_blank",rel:"noopener noreferrer"};function m(b,h){const t=a("RouterLink"),o=a("ExternalLinkIcon");return l(),i("div",null,[k,s("p",null,[n("需要引入各类优先级常量，建立最小堆，管理队列任务，在"),e(t,{to:"/react%E6%BA%90%E7%A0%81%E5%88%86%E6%9E%90/2-fiber.html#requestIdleCallback"},{default:u(()=>[n("fiber-requestIdleCallback")]),_:1}),n("中通过 requestIdleCallback 实现的方法重新实现")]),d,s("p",null,[s("a",v,[n("https://github.com/mi-saka10032/mini-react/tree/master/packages/messageChannel"),e(o)])])])}const f=c(r,[["render",m],["__file","8-scheduler.html.vue"]]);export{f as default};
