import{_ as l,C as i,Y as p,Z as c,$ as a,a0 as n,a2 as s,a3 as r,a1 as e}from"./framework-bb209140.js";const d={},u=e('<p>web 缓存技术主要分为 HTTP 缓存和浏览器缓存</p><p>HTTP 缓存是在 HTTP 请求传输时用到的缓存，主要在服务器代码上设置，<strong>是 web 缓存的核心</strong></p><p>浏览器缓存在前端项目上进行设置</p><figure><img src="https://misaka10032.oss-cn-chengdu.aliyuncs.com/performance/front-cache.jpg" alt="前端缓存" tabindex="0" loading="lazy"><figcaption>前端缓存</figcaption></figure><h2 id="为什么需要缓存" tabindex="-1"><a class="header-anchor" href="#为什么需要缓存" aria-hidden="true">#</a> 为什么需要缓存</h2><p>在讨论 HTTP 缓存和浏览器缓存前，我们先来说一下，为什么需要缓存，缓存到底能解决什么问题？</p><ol><li>减少不必要的网络传入，节省带宽</li><li>加载更快</li><li>减轻服务器负载</li><li>但是占用内存</li></ol><p>所以，缓存是为了加速页面加载、减轻服务器压力而存在的</p><h2 id="http-缓存" tabindex="-1"><a class="header-anchor" href="#http-缓存" aria-hidden="true">#</a> HTTP 缓存</h2>',9),h={href:"https://blog.csdn.net/wuliyouMaozhi/article/details/126455241",target:"_blank",rel:"noopener noreferrer"},k=e(`<figure><img src="https://misaka10032.oss-cn-chengdu.aliyuncs.com/performance/http-cache.png" alt="HTTP缓存流程图" tabindex="0" loading="lazy"><figcaption>HTTP缓存流程图</figcaption></figure><h3 id="强缓存" tabindex="-1"><a class="header-anchor" href="#强缓存" aria-hidden="true">#</a> 强缓存</h3><h4 id="废弃-expires" tabindex="-1"><a class="header-anchor" href="#废弃-expires" aria-hidden="true">#</a> 废弃 Expires</h4><p>从强制缓存的角度触发，如果浏览器判断请求的目标资源有效命中强缓存，如果命中，则可以直接从内存中读取目标资源，无需与服务器做任何通讯</p><p>以前，我们通常使用响应头的 Expires 字段去实现强缓存。但是现在 Expires 已经被废弃了，因为 Expires 判断强缓存是否过期的机制是:获取本地时间戳，并对先前拿到的资源文件中的 Expires 字段的时间做比较</p><p>这种过度依赖本地时间的做法，如果本地与服务器时间不同步，就会出现资源无法被缓存或者资源永远被缓存的情况</p><p>所以现在我们并不推荐使用 Expires，强缓存功能通常使用 cache-control 字段来代替 Expires 字段</p><h4 id="cache-control" tabindex="-1"><a class="header-anchor" href="#cache-control" aria-hidden="true">#</a> Cache-control</h4><p>Cache-control 这个字段在 http1.1 中被增加，Cache-control 完美解决了 Expires 本地时间和服务器时间不同步的问题</p><div class="language-text line-numbers-mode" data-ext="text"><pre class="language-text"><code>//往响应头中写入需要缓存的时间
res.writeHead(200,{
    &#39;Cache-Control&#39;:&#39;max-age=10&#39;
});
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>Cache-Control:max-age=N，N 就是需要缓存的秒数。从第一次请求资源的时候开始，往后 N 秒内，资源若再次请求，则直接从磁盘（或内存中读取），不与服务器做任何交互</p><p>Cache-control 有 max-age、s-maxage、no-cache、no-store、private、public 这六个属性</p><ul><li>max-age 决定客户端资源被缓存多久。</li><li>s-maxage 决定代理服务器缓存的时长。</li><li>no-cache 表示是强制进行协商缓存。</li><li>no-store 是表示禁止任何缓存策略。</li><li>public 表示资源即可以被浏览器缓存也可以被代理服务器缓存。</li><li>private 表示资源只能被浏览器缓存。</li></ul><h3 id="协商缓存" tabindex="-1"><a class="header-anchor" href="#协商缓存" aria-hidden="true">#</a> 协商缓存</h3><h4 id="基于-last-modified-的协商缓存" tabindex="-1"><a class="header-anchor" href="#基于-last-modified-的协商缓存" aria-hidden="true">#</a> 基于 last-modified 的协商缓存</h4><ol><li>首先需要在服务器端读出文件修改时间</li><li>将读出来的修改时间赋给响应头的 last-modified 字段</li><li>最后设置 Cache-control:no-cache</li></ol><div class="language-javascript line-numbers-mode" data-ext="js"><pre class="language-javascript"><code><span class="token keyword">const</span> <span class="token punctuation">{</span> mtime <span class="token punctuation">}</span> <span class="token operator">=</span> fs<span class="token punctuation">.</span><span class="token function">statSync</span><span class="token punctuation">(</span><span class="token string">&#39;./img.png&#39;</span><span class="token punctuation">)</span>  <span class="token comment">// 读取文件的最新修改事件</span>
res<span class="token punctuation">.</span><span class="token function">setHeader</span><span class="token punctuation">(</span><span class="token string">&#39;last-modified&#39;</span><span class="token punctuation">,</span> mtime<span class="token punctuation">.</span><span class="token function">toUTCString</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">)</span><span class="token punctuation">)</span>  <span class="token comment">// 设置文件最后修改时间</span>
res<span class="token punctuation">.</span><span class="token function">setHeader</span><span class="token punctuation">(</span><span class="token string">&#39;Cache-Control&#39;</span><span class="token punctuation">,</span> <span class="token string">&#39;no-cache&#39;</span><span class="token punctuation">)</span>  <span class="token comment">//设置no-cache</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>服务端如此操作之后，还没结束。当客户端读取到 last-modified 的时候，会在下次的请求标头中携带一个字段:If-Modified-Since</p><figure><img src="https://misaka10032.oss-cn-chengdu.aliyuncs.com/performance/if-modified-since.png" alt="If-Modified-Since" tabindex="0" loading="lazy"><figcaption>If-Modified-Since</figcaption></figure><p>而这个请求头中的 If-Modified-Since 就是服务器第一次修改时给的时间</p><p>那么之后每次对该资源的请求，都会带上 If-Modified-Since 这个字段，而服务端就需要拿到这个时间并再次读取该资源的修改时间，让他们两个做一个比对来决定是读取缓存还是返回新的资源</p><p>因为该方式是基于文件对比修改时间来判断缓存的，所以也有两个漏洞问题：</p><ol><li>根据文件修改时间来判断，所以，在文件内容本身不修改的情况下，依然有可能更新文件修改时间（修改文件名再改回来这种），这样缓存也会失效</li><li>文件在毫秒级别时间内完成修改，因为 last-modified 的记录最小单位是秒，所以文件修改时间不会变，不会返回新文件</li></ol><h4 id="基于-etag-的协商缓存" tabindex="-1"><a class="header-anchor" href="#基于-etag-的协商缓存" aria-hidden="true">#</a> 基于 ETag 的协商缓存</h4><p>http1.1 为了避开上面时间戳比较形式的缓存问题，加入了 ETag 的协商缓存，修改成了比较文件指纹</p><p>文件指纹：根据文件内容计算出唯一哈希值。文件内容一旦改变则指纹改变</p><p>流程是这样的：</p><ol><li>第一次请求某资源的时候，服务端读取文件并计算出文件指纹，将文件指纹放在响应头的 etag 字段中跟资源一起返回给客户端</li><li>第二次请求某资源的时候，客户端自动从缓存中读取出上一次服务端返回的 ETag 也就是文件指纹。并赋给请求头的 if-None-Match 字段，让上一次的文件指纹跟随请求一起回到服务端</li><li>服务端拿到请求头中的 is-None-Match 字段值（也就是上一次的文件指纹），并再次读取目标资源并生成文件指纹，两个指纹做对比。如果两个文件指纹完全吻合，说明文件没有被改变，则直接返回 304 状态码和一个空的响应体并 return。如果两个文件指纹不吻合，则说明文件被更改，那么将新的文件指纹重新存储到响应头的 ETag 中并返回给客户端</li></ol><p>当然，如此准确的缓存校验也有缺点：</p><ol><li>ETag 需要计算文件指纹，这样意味着，服务端需要更多的计算开销。如果文件尺寸大数量多，并且计算频繁，那么 ETag 的计算就会影响服务器性能。这样的场景就不再适合 ETag</li><li>ETag 有强验证和弱验证。强验证指哈希码深入到每一个字节，保证文件内容绝对的不变，但也非常消耗计算量；弱验证是提取部分属性生成哈希码，整体速度略快但准确率不搞，会降低协商缓存的有效性</li></ol><h3 id="总结" tabindex="-1"><a class="header-anchor" href="#总结" aria-hidden="true">#</a> 总结</h3><ul><li>http 缓存可以减少宽带流量，加快响应速度</li><li>关于强缓存，cache-control 是 Expires 的完全替代方案，在可以使用 cache-control 的情况下不要使用 expires</li><li>关于协商缓存,etag 并不是 last-modified 的完全替代方案，而是补充方案，具体用哪一个，取决于业务场景</li><li>有些缓存是从磁盘读取，有些缓存是从内存读取，有什么区别？答：从内存读取的缓存更快</li><li>所有带 304 的资源都是协商缓存，所有标注（从内存中读取/从磁盘中读取）的资源都是强缓存</li></ul><h2 id="浏览器缓存" tabindex="-1"><a class="header-anchor" href="#浏览器缓存" aria-hidden="true">#</a> 浏览器缓存</h2><h3 id="cookie" tabindex="-1"><a class="header-anchor" href="#cookie" aria-hidden="true">#</a> cookie</h3><p>主要用于存储用户信息，它的内容可以主动在请求时传递给服务器。</p><p>它是浏览器提供的一种将 document 对象的 cookie 属性提供给 js 的机制，可以由 js 对其进行控制。</p><p>cookie 存于用户硬盘的一个文件，通常对应于一个域名，当浏览器再次访问这个域名便让这个 cookie 可被使用。</p><p>因此 cookie <strong>可以跨域，一个域名下多个网页，但不能跨多个域名使用</strong>。</p><p>cookie 的结构简单来说是以键值对的形式保存，即 key = value 的格式，每个 cookie 间使用“；”隔开。</p><p>它最大的一个优点便是将信息存储于用户硬盘，因此可以作为全局变量，这是它常用的几种场合：</p><ol><li><p>保存用户登录状态</p></li><li><p>跟踪用户行为</p></li><li><p>定制页面</p></li><li><p>创建购物车，例如淘宝网就使用 cookie 记录了用户曾经浏览过的商品，方便随时进行比较，而 cookie 的缺点主要集中于安全性和隐私保护。</p></li></ol><p>主要包括以下几种：</p><ol><li><p>cookie 可能被禁用。当用户非常注重个人隐私保护时，他很有可能禁用浏览器的 cookie 功能。</p></li><li><p>cookie 是与浏览器相关的。这意味着即使访问的是同一个页面，不同浏览器之间所保存的 cookie 也是不能互相访问的。</p></li><li><p>cookie 可能被删除。因为每个 cookie 都是硬盘上的一个文件，因此很有可能被用户删除。</p></li><li><p>cookie 安全性不够高。所有的 cookie 都是以纯文本的形式记录于文件中，因此如果要保存用户名密码等信息时，最好事先经过加密处理</p></li><li><p>容量过小，只允许容纳 4 KB。</p></li></ol><h3 id="localstorage" tabindex="-1"><a class="header-anchor" href="#localstorage" aria-hidden="true">#</a> localStorage</h3><p>在 HTML5 中，新增了 localStorage 主要作为本地存储，以 5 MB 的内存大小，解决了 cookie 存储空间 4 KB 的问题。</p><p>且保存的数据将一直被保存于浏览器中，直到用户清除浏览器缓存数据为止。</p><p>localStorage 的优势与劣势：</p><ol><li><p>相比 cookie 节省带宽、容量更大</p></li><li><p>目前所有浏览器中都会把 localStorage 的值限定为 序列化的 string 格式</p></li><li><p>在浏览器隐私模式下不可读取</p></li><li><p>无法被网络爬虫捕捉</p></li></ol><h3 id="sessionstorage" tabindex="-1"><a class="header-anchor" href="#sessionstorage" aria-hidden="true">#</a> sessionStorage</h3><p>sessionStorage 的其他属性与 localStorage 相同，不过它的生命周期与标签页相同，当标签页被关闭时，sessionStorage 也会被清除</p><h3 id="大容量存储" tabindex="-1"><a class="header-anchor" href="#大容量存储" aria-hidden="true">#</a> 大容量存储</h3><p>webSql（已被废弃）和 indexDB 主要用于前端又大容量存储需求的页面上，比如在线编辑浏览器或者网页邮箱</p><table><thead><tr><th style="text-align:left;">存储方式</th><th style="text-align:left;">介绍</th><th style="text-align:left;">容量</th><th style="text-align:left;">状态</th></tr></thead><tbody><tr><td style="text-align:left;">webSql</td><td style="text-align:left;">关系型数据库</td><td style="text-align:left;">50MB</td><td style="text-align:left;">废弃</td></tr><tr><td style="text-align:left;">indexDB</td><td style="text-align:left;">非关系型数据库</td><td style="text-align:left;">50MB</td><td style="text-align:left;">正常使用</td></tr></tbody></table><p>下面主要讲一讲 indexDB，它具有以下特点</p><ol><li>键值对储存。 IndexedDB 内部采用对象仓库（object store）存放数据。所有类型的数据都可以直接存入，包括 JavaScript 对象。对象仓库中，数据以“键值对”的形式保存，每一个数据记录都有对应的主键，主键是独一无二的，不能有重复，否则会抛出一个错误。</li><li>异步。 IndexedDB 操作时不会锁死浏览器，用户依然可以进行其他操作，这与 LocalStorage 形成对比，后者的操作是同步的。异步设计是为了防止大量数据的读写，拖慢网页的表现。</li><li>支持事务。 IndexedDB 支持事务（transaction），这意味着一系列操作步骤之中，只要有一步失败，整个事务就都取消，数据库回滚到事务发生之前的状态，不存在只改写一部分数据的情况。</li><li>同源限制。 IndexedDB 受到同源限制，每一个数据库对应创建它的域名。网页只能访问自身域名下的数据库，而不能访问跨域的数据库。</li><li>储存空间大。 IndexedDB 的储存空间比 LocalStorage 大得多，一般来说不少于 250MB，甚至没有上限。</li><li>支持二进制储存。 IndexedDB 不仅可以储存字符串，还可以储存二进制数据（ArrayBuffer 对象和 Blob 对象）。</li></ol>`,55),g={href:"https://blog.csdn.net/qq_41581588/article/details/124744083",target:"_blank",rel:"noopener noreferrer"},m=e(`<h3 id="pwa" tabindex="-1"><a class="header-anchor" href="#pwa" aria-hidden="true">#</a> PWA</h3><p>PWA 即渐进式网络应用，主要目标是实现 web 网站的 APP 式功能和展示。</p><p>PWA 用 manifest 构建了自己的 APP 骨架，用 ServiceWorker 来控制缓存的使用</p><p>Manifest 就是一个 json 文件，在里面给出了诸如主题、背景色、图标等一系列的描述，用来让 Web 应用更接近于原生应用</p><div class="language-json line-numbers-mode" data-ext="json"><pre class="language-json"><code><span class="token punctuation">{</span>
  <span class="token property">&quot;name&quot;</span><span class="token operator">:</span> <span class="token string">&quot;Progressive Times web app&quot;</span><span class="token punctuation">,</span>
  <span class="token property">&quot;short_name&quot;</span><span class="token operator">:</span> <span class="token string">&quot;Progressive Times&quot;</span><span class="token punctuation">,</span>
  <span class="token property">&quot;start_url&quot;</span><span class="token operator">:</span> <span class="token string">&quot;/index.html&quot;</span><span class="token punctuation">,</span>
  <span class="token property">&quot;display&quot;</span><span class="token operator">:</span> <span class="token string">&quot;standalone&quot;</span><span class="token punctuation">,</span>
  <span class="token property">&quot;theme_color&quot;</span><span class="token operator">:</span> <span class="token string">&quot;#FFDF00&quot;</span><span class="token punctuation">,</span>
  <span class="token property">&quot;background_color&quot;</span><span class="token operator">:</span> <span class="token string">&quot;#FFDF00&quot;</span><span class="token punctuation">,</span>
  <span class="token property">&quot;icons&quot;</span><span class="token operator">:</span> <span class="token punctuation">[</span>
    <span class="token punctuation">{</span>
      <span class="token property">&quot;src&quot;</span><span class="token operator">:</span> <span class="token string">&quot;homescreen.png&quot;</span><span class="token punctuation">,</span>
      <span class="token property">&quot;sizes&quot;</span><span class="token operator">:</span> <span class="token string">&quot;192x192&quot;</span><span class="token punctuation">,</span>
      <span class="token property">&quot;type&quot;</span><span class="token operator">:</span> <span class="token string">&quot;image/png&quot;</span>
    <span class="token punctuation">}</span><span class="token punctuation">,</span>
    <span class="token punctuation">{</span>
      <span class="token property">&quot;src&quot;</span><span class="token operator">:</span> <span class="token string">&quot;homescreen-144.png&quot;</span><span class="token punctuation">,</span>
      <span class="token property">&quot;sizes&quot;</span><span class="token operator">:</span> <span class="token string">&quot;144x144&quot;</span><span class="token punctuation">,</span>
      <span class="token property">&quot;type&quot;</span><span class="token operator">:</span> <span class="token string">&quot;image/png&quot;</span>
    <span class="token punctuation">}</span>
  <span class="token punctuation">]</span>
<span class="token punctuation">}</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><ul><li>name、short_name：指定了 Web App 的名称。short_name 其实是该应用的一个简称。一般来说，当没有足够空间展示应用的 name 时，系统就会使用 short_name。</li><li>start_url：这个属性指定了用户打开该 Web App 时加载的 URL。相对 URL 会相对于 Manifest。这里我们指定了 start_url 为 index.html，访问 index 文件。</li><li>display：控制了应用的显示模式，它有四个值可以选择：fullscreen 、standalone 、minimal-ui 和 browser <ul><li>fullscreen：全屏显示，会尽可能将所有的显示区域都占满。</li><li>standalone：独立应用模式，这种模式下打开的应用有自己的启动图标，并且不会有浏览器的地址栏。因此看起来更像一个 Native App。</li><li>minimal-ui：与 standalone 相比，该模式会多出地址栏。</li><li>browser：一般来说，会和正常使用浏览器打开样式一致。</li></ul></li><li>orientation：控制 Web App 的方向。设置某些值会具有类似锁屏的效果（禁止旋转） <ul><li>landscape-primary：当视窗宽度大于高度时，当前应用处于“横屏”状态。</li><li>landscape-secondary：landscape-primary 的 180° 方向。</li><li>landscape：根据屏幕的方向，自动横屏幕 180° 切换。</li><li>portrait-primary：当视窗宽度小于高度时，当前应用处于“竖屏”状态。</li><li>portrait-secondary：portrait-primary 的 180° 方向。</li><li>portrait：根据屏幕方向，自动竖屏 180° 切换。</li><li>natural：根据不同平台的规则，显示为当前平台的 0° 方向。</li><li>any：任意方向切换。</li></ul></li><li>icons、background_color：icons 用来指定应用的桌面图标 <ul><li>sizes：图标的大小。通过指定大小，系统会选取最合适的图标展示在相应位置上。</li><li>src：图标的文件路径。注意相对路径是相对于 Manifest。</li><li>type：图标的图片类型。</li></ul></li><li>background_color 是在应用的样式资源加载完毕前的默认背景，因此会展示在开屏界面。background_color 加上我们刚才定义的 icons 就组成了 Web App 打开时的“开屏图”</li><li>theme_color：定义应用程序的默认主题颜色。这有时会影响操作系统显示应用程序的方式（例如，在 Android 的任务切换器上，主题颜色包围应用程序）</li></ul><p>在 html 中引入</p><div class="language-html line-numbers-mode" data-ext="html"><pre class="language-html"><code><span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span>html</span><span class="token punctuation">&gt;</span></span>
  <span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span>head</span><span class="token punctuation">&gt;</span></span>
    ...
    <span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span>link</span> <span class="token attr-name">rel</span><span class="token attr-value"><span class="token punctuation attr-equals">=</span><span class="token punctuation">&quot;</span>manifest<span class="token punctuation">&quot;</span></span> <span class="token attr-name">href</span><span class="token attr-value"><span class="token punctuation attr-equals">=</span><span class="token punctuation">&quot;</span>/manifest.json<span class="token punctuation">&quot;</span></span> <span class="token punctuation">/&gt;</span></span>
  <span class="token tag"><span class="token tag"><span class="token punctuation">&lt;/</span>head</span><span class="token punctuation">&gt;</span></span>
<span class="token tag"><span class="token tag"><span class="token punctuation">&lt;/</span>html</span><span class="token punctuation">&gt;</span></span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div>`,8),v=a("h3",{id:"往返缓存",tabindex:"-1"},[a("a",{class:"header-anchor",href:"#往返缓存","aria-hidden":"true"},"#"),n(" 往返缓存")],-1),f=a("p",null,"往返缓存又称为 BFCache，是浏览器在前进后退按钮上为了提升历史页面的渲染速度的一种策略",-1),b=a("p",null,"该策略具体表现为，当用户前往新页面时，将当前页面的浏览器 DOM 状态保存到 BFCache 中；当用户点击后退按钮的时候，将页面直接从 BFCache 中加载，节省了网络请求的时间。",-1);function x(q,y){const t=i("ExternalLinkIcon"),o=i("RouterLink");return p(),c("div",null,[u,a("p",null,[n("参考链接："),a("a",h,[n("https://blog.csdn.net/wuliyouMaozhi/article/details/126455241"),s(t)])]),k,a("p",null,[n("后续 API 及操作较为繁琐，不再赘述，详见："),a("a",g,[n("https://blog.csdn.net/qq_41581588/article/details/124744083"),s(t)])]),m,a("p",null,[n("实现了缓存策略的 ServiceWorker 的情况详见："),s(o,{to:"/performance/4-webworker.html#ServiceWorker"},{default:r(()=>[n("ServiceWorker")]),_:1})]),v,f,b])}const T=l(d,[["render",x],["__file","5-cache.html.vue"]]);export{T as default};