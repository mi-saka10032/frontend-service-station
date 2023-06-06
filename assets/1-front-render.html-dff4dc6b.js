import{_ as a,Y as n,Z as s,a1 as t}from"./framework-bb209140.js";const p={},e=t(`<h2 id="术语介绍" tabindex="-1"><a class="header-anchor" href="#术语介绍" aria-hidden="true">#</a> 术语介绍</h2><p>CSR：Client Side Rendering =&gt; 客户端（通常是浏览器）渲染</p><p>SSR：Server Side Rendering =&gt; 服务端渲染</p><p>SPR：Serverless Pre-Rendering =&gt; 服务端渲染</p><p>SSG：Static Site Generation =&gt; 静态网站生成</p><p>ISR：Incremental Site Rendering =&gt; 增量式的网站渲染</p><h2 id="啥是-xxr" tabindex="-1"><a class="header-anchor" href="#啥是-xxr" aria-hidden="true">#</a> 啥是 XXR</h2><p>前端研发中有许多常见场景，根据不同的构建、渲染过程有不同的优劣势和适用情况。如现代 UI 库加持下常用的 CSR、具有更好 SEO 效果的 SSR (SPR)、转换思路主打构建时生成的 SSG、大架构视野之上的 ISR、DPR，还有更少听到的 NSR、ESR 等等</p><h2 id="渲染模式" tabindex="-1"><a class="header-anchor" href="#渲染模式" aria-hidden="true">#</a> 渲染模式</h2><p>这里说的渲染模式，指的是：</p><ol><li>页面/应用在开发完成之后的产物编译方式</li><li>部署上线之后的服务形态</li><li>资源存储与分发的方式</li><li>用户访问时的启动与渲染过程</li></ol><p>下面要介绍的几种渲染模式，均在这几方面有不同的实现和规范</p><h2 id="csr" tabindex="-1"><a class="header-anchor" href="#csr" aria-hidden="true">#</a> CSR</h2><p>顾名思义的“客户端渲染”，是当下用于渲染各类 UI 库构建的前端项目的最常见方案。</p><h2 id="定义" tabindex="-1"><a class="header-anchor" href="#定义" aria-hidden="true">#</a> 定义</h2><div class="language-html line-numbers-mode" data-ext="html"><pre class="language-html"><code><span class="token doctype"><span class="token punctuation">&lt;!</span><span class="token doctype-tag">DOCTYPE</span> <span class="token name">html</span><span class="token punctuation">&gt;</span></span>
<span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span>html</span><span class="token punctuation">&gt;</span></span>
  <span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span>head</span><span class="token punctuation">&gt;</span></span>
    <span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span>meta</span> <span class="token attr-name">charset</span><span class="token attr-value"><span class="token punctuation attr-equals">=</span><span class="token punctuation">&quot;</span>utf-8<span class="token punctuation">&quot;</span></span> <span class="token punctuation">/&gt;</span></span>
    <span class="token comment">&lt;!-- metas --&gt;</span>
    <span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span>title</span><span class="token punctuation">&gt;</span></span><span class="token tag"><span class="token tag"><span class="token punctuation">&lt;/</span>title</span><span class="token punctuation">&gt;</span></span>
    <span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span>link</span> <span class="token attr-name">rel</span><span class="token attr-value"><span class="token punctuation attr-equals">=</span><span class="token punctuation">&quot;</span>shortcut icon<span class="token punctuation">&quot;</span></span> <span class="token attr-name">href</span><span class="token attr-value"><span class="token punctuation attr-equals">=</span><span class="token punctuation">&quot;</span>xxx.png<span class="token punctuation">&quot;</span></span> <span class="token punctuation">/&gt;</span></span>
    <span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span>link</span> <span class="token attr-name">rel</span><span class="token attr-value"><span class="token punctuation attr-equals">=</span><span class="token punctuation">&quot;</span>stylesheet<span class="token punctuation">&quot;</span></span> <span class="token attr-name">href</span><span class="token attr-value"><span class="token punctuation attr-equals">=</span><span class="token punctuation">&quot;</span>xxx.css<span class="token punctuation">&quot;</span></span> <span class="token punctuation">/&gt;</span></span>
  <span class="token tag"><span class="token tag"><span class="token punctuation">&lt;/</span>head</span><span class="token punctuation">&gt;</span></span>
  <span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span>body</span><span class="token punctuation">&gt;</span></span>
    <span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span>div</span> <span class="token attr-name">id</span><span class="token attr-value"><span class="token punctuation attr-equals">=</span><span class="token punctuation">&quot;</span>root<span class="token punctuation">&quot;</span></span><span class="token punctuation">&gt;</span></span><span class="token comment">&lt;!-- page content --&gt;</span><span class="token tag"><span class="token tag"><span class="token punctuation">&lt;/</span>div</span><span class="token punctuation">&gt;</span></span>
    <span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span>script</span> <span class="token attr-name">src</span><span class="token attr-value"><span class="token punctuation attr-equals">=</span><span class="token punctuation">&quot;</span>xxx/filterXss.min.js<span class="token punctuation">&quot;</span></span><span class="token punctuation">&gt;</span></span><span class="token script"></span><span class="token tag"><span class="token tag"><span class="token punctuation">&lt;/</span>script</span><span class="token punctuation">&gt;</span></span>
    <span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span>script</span> <span class="token attr-name">src</span><span class="token attr-value"><span class="token punctuation attr-equals">=</span><span class="token punctuation">&quot;</span>xxx/x.chunk.js<span class="token punctuation">&quot;</span></span><span class="token punctuation">&gt;</span></span><span class="token script"></span><span class="token tag"><span class="token tag"><span class="token punctuation">&lt;/</span>script</span><span class="token punctuation">&gt;</span></span>
    <span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span>script</span> <span class="token attr-name">src</span><span class="token attr-value"><span class="token punctuation attr-equals">=</span><span class="token punctuation">&quot;</span>xxx/main.chunk.js<span class="token punctuation">&quot;</span></span><span class="token punctuation">&gt;</span></span><span class="token script"></span><span class="token tag"><span class="token tag"><span class="token punctuation">&lt;/</span>script</span><span class="token punctuation">&gt;</span></span>
  <span class="token tag"><span class="token tag"><span class="token punctuation">&lt;/</span>body</span><span class="token punctuation">&gt;</span></span>
<span class="token tag"><span class="token tag"><span class="token punctuation">&lt;/</span>html</span><span class="token punctuation">&gt;</span></span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>可以按到页面中流出一个用于填充渲染内容的视图节点，并插入指向项目编译压缩后的 JS Bundle 文件的 script 节点和指向 CSS 文件的 link.stylesheet 节点等。</p><p>浏览器接收到这样的文档响应之后，会根据文档内的链接加载脚本与样式资源，并完成以下几方面主要工作：</p><p>1、执行脚本</p><p>2、进行网络访问以获取在线数据</p><p>3、使用 DOM API 更新页面结构</p><p>4、绑定交互事件、注入样式</p><p>以此完成整个渲染过程。</p><h2 id="优劣相依" tabindex="-1"><a class="header-anchor" href="#优劣相依" aria-hidden="true">#</a> 优劣相依</h2><p>CSR 模式的优点：</p><p><strong>UI 库支持</strong>：常用 UI 方案如 React、Vue，默认的应用形态都是 SPA (for Single Page Application)，是交互程度高、动态化强的 Web 应用，CSR 很好地满足了这种应用形态的需要，并在主流技术栈中拥有广泛支持</p><p><strong>前后端分离</strong>：视图交互和具体数据解耦，有赖于这种应用形态的出现和普及，做到前后端职能清晰明确，更容易维护与协作</p><p><strong>服务器负担轻</strong>：从示例可见，CSR 场景下的页面托管服务只需要对访问请求返回一个每次部署后固定的空白页，其他的资源加载和渲染交给浏览器完成，项目静态资源（bundle、css、assets）则都是部署在 CDN 上的，服务器负担轻、响应快，且更利于资源的终端和 CDN 缓存</p><p>CSR 模式的缺点：</p><p><strong>呈现速度受限</strong>：基于上面特点，尽管更轻的服务负荷带来了更快的访问响应速度，但 CSR 页面的呈现速度和效果容易受到限制——用户浏览器拿到模板 HTML 之后对文档和 JS 代码的解析耗时、逻辑执行耗时、接口请求耗时、加载静态资源工作对 CDN 情况、网络环境、终端浏览器性能的依赖，都能很大程度上影响甚至阻塞页面渲染，破坏用户体验；简而言之，页面加载时会白屏</p><p><strong>不利于 SEO (for Search Engine Optimization)</strong>：爬虫请求 CSR 的页面时会受限从服务器得到不含内容的空页面，不利于站点在搜索引擎上的信息采集和曝光（但现在头牌搜索引擎如谷歌、百度、必应等，其爬虫能力已经可以部分支持 CSR SPA 的页面内容爬取）。在非常动态的、交互性很强而轻实际内容的情景下，SEO 友好程度或许并不重要——即使重要，也有部分解决方法，如结合 meta / template 插入一些重要信息，还有后面将会提到的 SSG</p><p><strong>较低的安全性</strong>：了解到的一个论调是 CSR 场景下，页面更容易受到 XSS (for Cross-Site Scripting) 攻击，通过发掘页面内可以干预逻辑代码的入口，劫持用户的会话并进行恶意操作。CSR 在此方面相对安全性较低的一个考虑点，或许是有更多的逻辑代码需要在浏览器上直接运行并可见，让不怀好意者更有可乘之机——但在如今越来越多的安全工具、浏览器安全部署、代码混淆方案背景下，魔与道孰高孰低其实一直在较量之中</p><h2 id="ssr" tabindex="-1"><a class="header-anchor" href="#ssr" aria-hidden="true">#</a> SSR</h2><h3 id="定义-1" tabindex="-1"><a class="header-anchor" href="#定义-1" aria-hidden="true">#</a> 定义</h3><p>SSR 的概念，即与 CSR 相对地，在服务端完成大部分渲染工作，其实这就是一开始还没有如今的前端的时候，页面的呈现方式——服务器在响应站点访问请求的时候，就已经渲染好可供呈现的页面</p><h3 id="原理" tabindex="-1"><a class="header-anchor" href="#原理" aria-hidden="true">#</a> 原理</h3><p>借助 React、Vue 的虚拟 VDOM 模型生成的抽象的嵌套数据结构，可以在 Node 环境下跑起来，把原来的视图代码拿来在服务端跑，通过 VDOM 维护，再在最后拼接好字符串作为页面响应，生成文档作为响应页面，此时的页面内容已经基本生成完毕，把逻辑代码、样式代码附上，则可以实现完整的、可呈现页面的响应。</p><p>在此基础上，另外对于一些需要在客户端激活的内容，如 Vue 实例接管组件行为、React Effect 在客户端的触发执行，则由编译时生成 Bundle，并在响应页面内的超链接脚本额外附着</p><h3 id="先扬后抑" tabindex="-1"><a class="header-anchor" href="#先扬后抑" aria-hidden="true">#</a> 先扬后抑</h3><p>SSR 方案发展在 CSR 之后再次得到推进，很大程度上就是为了解决 CSR 的一些问题，这也是 SSR 相较之下突出的优势：</p><p><strong>呈现速度和用户体验佳</strong>：SSR 对比 CSR，少了很多页面到达浏览器之后的解析、资源加载、逻辑代码执行的过程，用户拿到响应内容后，这份内容基本已经是可以呈现的页面，首屏时间大大缩短</p><p><strong>SEO 友好</strong>：SSR 服务对于站点访问请求响应的是填充过的页面，其中已经有许多站点信息和数据可供爬虫直接识别，搜索引擎优化自不必说；</p><p>说完优势，接下来说说 SSR 的局限在哪：</p><p><strong>引入成本高</strong>：SSR 方案重新将视图渲染的工作交给了服务器做，这就引入了新的概念和技术栈（如 Node），并且带来了更高的服务器硬件成本和运维成本</p><p><strong>响应时间长</strong>：对比 CSR 只需要响应早已准备好的空页面，SSR 在完成访问响应的时候需要做更多的计算和生成工作，因此其请求响应时间更长，同时还受限于前置数据接口的响应速度，一项关键指标 TTFB (Time To First Byte) 将变得更大</p><p><strong>首屏交互不佳</strong>：又是那句话，“SSR 的用户启动体验好，但不完全好”。虽然 SSR 可以让页面请求响应后更快在浏览器上渲染出来，但在首帧出现，需要客户端加载激活的逻辑代码（如事件绑定）还没有初始化完毕的时候，其实是不可交互的状态，同样影响用户体验</p><p><strong>传统开发思路受限</strong>：斟酌之下还是将其列出作为 SSR 的局限性，既然主要页面内容是在服务端完成渲染的，那么对于浏览器（或者 Hybrid、Webview 之下的宿主）环境的获知和相关操作就会受到局限，一些操作不得不延迟到客户端激活之后才得以进行，这也是导致上一个局限点的原因</p><h3 id="spr" tabindex="-1"><a class="header-anchor" href="#spr" aria-hidden="true">#</a> SPR</h3><p>无服务预渲染，这是 Serverless 话题之下的一项渲染技术。SPR 是指在 SSR 架构下通过预渲染与缓存能力，将部分页面转化为静态页面，以避免其在服务器接收到请求的时候频繁被渲染的能力，同时一些框架还支持设置静态资源过期时间，以确保这部分“静态页面”也能有一定的即时性</p><p>这是对 SSR 服务运行计算成本高、服务负载大的一种针对性优化，如今也已经有不少前沿框架支持，开发者可以非常方便地引入</p><h2 id="ssg" tabindex="-1"><a class="header-anchor" href="#ssg" aria-hidden="true">#</a> SSG</h2><h3 id="定义-2" tabindex="-1"><a class="header-anchor" href="#定义-2" aria-hidden="true">#</a> 定义</h3><p>如果说 CSR 与 SSR 差异在于渲染工作重心的抉择，那么 SSR 和 SSG 则是渲染——或者是这其中非常重要的“注水”——填充内容操作在时机上的抉择</p><ul><li>又或者从另一个角度来说，不同于把大部分渲染工作留到请求时做的 CSR 和 SSR，SSG 在站点项目构建部署的时候，就把页面内容大致填充好了。</li></ul><p>最终 SSG 模式的有点真正“返璞归真”的意思，原本日益动态化、交互性增强的页面，变成了大部分已经填充好，托管在页面服务 / CDN 上的静态页面。</p><h3 id="平衡够好吗" tabindex="-1"><a class="header-anchor" href="#平衡够好吗" aria-hidden="true">#</a> 平衡够好吗？</h3><p>SSG 兼收了传统 CSR 和 SSR 的优点的同时，对这两者的短板也做到较好的互补。服务负担低、加载性能与体验佳、SEO 友好，这些 SSG 的取各家之长的优势此处不必单独分析，但还有一些好处源自这个模式本身：</p><p>页面内容都是静态生成过的，页面部署只需要简单的页面托管服务器，甚至只需要放在 CDN 之上，大量减少了动态性，还有服务器对页面加载、渲染工作的干预，也就让恶意攻击少了很多可乘之机</p><p>然后是需要讨论的不足之处：</p><p>随着应用的拓展和复杂化，预渲染页面的数量增长速度很快。SSG 项目有较高的构建和部署开销，应用越复杂，需要构建出来的静态页面就会越多，对于功能丰富的大型站点，每次构建需要渲染成千上万个页面都是有可能的，这必然带来较高的部署、更新成本</p><p>高度静态化带来非即时性，用户访问到的页面内 SSG 生成的部分，确保有效性的时间节点是上一次构建，使该模式下的应用失去了部分时效性，这部分缺陷需要通过定时构建、或者部分非 SSG 来弥补，这也是 SSG 的主要问题。</p><h2 id="isr" tabindex="-1"><a class="header-anchor" href="#isr" aria-hidden="true">#</a> ISR</h2><h3 id="定义-3" tabindex="-1"><a class="header-anchor" href="#定义-3" aria-hidden="true">#</a> 定义</h3><p>直译，增量式网站渲染。也很好理解，就是对待页面内容小刀切，有更细的差异化渲染粒度，能渐进、分层地进行渲染</p><p>常见的选择是：对于重要页面如首屏、访问量较大的直接落地页，进行预渲染并添加缓存，保证最佳的访问性能；对于次要页面，则确保有兜底内容可以即时 fallback，再将其实时数据的渲染留到 CSR 层次完成，同时触发异步缓存更新</p><p>对于“异步缓存更新”，则需要提到一个常见的内容缓存策略：Stale While Revalidate，CDN 对于数据请求始终首先响应缓存内容，如果这份内容已经过期，则在响应之后再触发异步更新——这也是对于次要元素或页面的缓存处理方式</p><figure><img src="https://misaka10032.oss-cn-chengdu.aliyuncs.com/renderMode/image-20220325201023489.png" alt="ISR" tabindex="0" loading="lazy"><figcaption>ISR</figcaption></figure><p>基于此种模式，CDN 做的事情就是直接响应用户的每个请求，并在用户触发 fallback，当前预渲染过的页面过期失效且再次被用户访问的时候更新缓存的预渲染资源</p><h2 id="总结-如何选择" tabindex="-1"><a class="header-anchor" href="#总结-如何选择" aria-hidden="true">#</a> 总结：如何选择</h2><p>这些方案并非完全并列，较难完全“分支化决策”，这里列出几个考虑中的关注点：</p><h3 id="特性关注点" tabindex="-1"><a class="header-anchor" href="#特性关注点" aria-hidden="true">#</a> 特性关注点</h3><ol><li><p>是否关注 SEO</p><ul><li>是：需要 Pre-Render，纯 CSR 不可取</li><li>否：无限制</li></ul></li><li><p>是否具有丰富可交互性、需要用户能力、差异化渲染</p><ul><li>是：CSR 较方便、SSR 加载快</li><li>否：Pre-Render 系列保证加载体验</li></ul></li><li><p>页面结构和路由是否复杂、数据更新是否频繁、是否依赖实时数据接口</p><ul><li>是：首先排除 SSG，如果内容不能拆解，ISR、DPR 也不便接入</li><li>否：无限制</li></ul></li></ol><h3 id="依赖关注点" tabindex="-1"><a class="header-anchor" href="#依赖关注点" aria-hidden="true">#</a> 依赖关注点</h3><ol><li><p>是否接受引入服务器运维成本</p><ul><li>是：无限制，SSR 可冲</li><li>否：失去 SSR 选项</li></ul></li><li><p>旧有实现中是否有浏览器依赖如 UI 框架内对 DOM、BOM 甚至 Hybrid 场景下 JSBridge 的使用</p><ul><li>是：SSR、SSG 受限</li><li>否：无限制</li></ul></li></ol><p>以上考虑点都不产生限制，那就选用优缺点最能满足项目特征的、有比较完备的技术基建支持的模式即可</p>`,75),l=[e];function c(i,o){return n(),s("div",null,l)}const u=a(p,[["render",c],["__file","1-front-render.html.vue"]]);export{u as default};