import{_ as t}from"./_plugin-vue_export-helper.cdc0426e.js";import{o as e,c as l,e as a}from"./app.36825fdc.js";const n={},s=a(`<h2 id="现状" tabindex="-1"><a class="header-anchor" href="#现状" aria-hidden="true">#</a> 现状</h2><h3 id="浏览器现状" tabindex="-1"><a class="header-anchor" href="#浏览器现状" aria-hidden="true">#</a> 浏览器现状</h3><p>UC QQ 欧朋 百度手机 360 安全 谷歌 搜狗手机 猎豹 以及其他杂牌浏览器。</p><p>以上均为移动端浏览器。</p><p>兼容移动端主流浏览器，处理 Webkit 内核浏览器即可。</p><h3 id="手机屏幕" tabindex="-1"><a class="header-anchor" href="#手机屏幕" aria-hidden="true">#</a> 手机屏幕</h3><p>移动端设备屏幕尺寸非常多，碎片化严重。</p><p>Android 设备有多重分辨率：480x800，480x854，540x960，720x1280，1080x1920 等，甚至 2K、4K 屏等。</p><p>近年来 iPhone 的碎片化也加剧了，其设备的主要分辨率有：640x960，640x1136，750x1334，1242x2208 等。</p><p>作为开发者无需关注这些分辨率，因为我们常用的尺寸单位是 px。</p><h3 id="移动端调试方法" tabindex="-1"><a class="header-anchor" href="#移动端调试方法" aria-hidden="true">#</a> 移动端调试方法</h3><p>Chrome DevTools（谷歌浏览器）模拟手机调试</p><p>搭建本地 Web 服务器，手机和服务器一个局域网内，通过手机访问服务器</p><p>使用外网服务器，直接 IP 或域名访问。</p><h2 id="视口" tabindex="-1"><a class="header-anchor" href="#视口" aria-hidden="true">#</a> 视口</h2><p>视口就是浏览器显示页面内容的屏幕区域，视口可以分为<strong>布局视口</strong>、<strong>视觉视口</strong>和<strong>理想视口</strong></p><h3 id="布局视口-layout-viewport" tabindex="-1"><a class="header-anchor" href="#布局视口-layout-viewport" aria-hidden="true">#</a> 布局视口 layout-viewport</h3><p>一般移动设备的浏览器都默认设置了一个布局视口，用于解决早期 PC 端页面在手机上显示的问题</p><p>iOS，Android 基本都将这个视口分辨率设置为 980px，所以 PC 上的网页大多都能在手机上呈现，只不过元素看上去很小，一般默认可以通过手动缩放网页。</p><h3 id="视觉视口-visual-viewport" tabindex="-1"><a class="header-anchor" href="#视觉视口-visual-viewport" aria-hidden="true">#</a> 视觉视口 visual-viewport</h3><p>它是用户正在看到的网站区域。<strong>注意</strong>：是网站的区域。</p><p>我们可以通过缩放去操作视觉视口，但不会影响布局视口，布局视口仍保持原来宽度。</p><h3 id="理想视口-ideal-viewport" tabindex="-1"><a class="header-anchor" href="#理想视口-ideal-viewport" aria-hidden="true">#</a> 理想视口 ideal-viewport</h3><p>为了使网站在移动端有最理想的浏览和阅读宽度而设定</p><ul><li><p>理想视口，对设备来讲，是最理想的视口尺寸</p></li><li><p>需要手动添写 meta 视口标签通知浏览器操作</p></li><li><p>meta 视口标签的主要目的：布局视口的宽度应该与理想视口的宽度一致，简单理解就是设备有多宽，我们布局的视口就多宽</p></li></ul><h3 id="视口标签-meta" tabindex="-1"><a class="header-anchor" href="#视口标签-meta" aria-hidden="true">#</a> 视口标签 meta</h3><div class="language-html line-numbers-mode" data-ext="html"><pre class="language-html"><code><span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span>meta</span>
  <span class="token attr-name">name</span><span class="token attr-value"><span class="token punctuation attr-equals">=</span><span class="token punctuation">&quot;</span>viewport<span class="token punctuation">&quot;</span></span>
  <span class="token attr-name">content</span><span class="token attr-value"><span class="token punctuation attr-equals">=</span><span class="token punctuation">&quot;</span>width=device-width,
  user-scalable=no,
  initial-scale=1.0,
  maximum-scale=1.0,
  minimum-scale=1.0<span class="token punctuation">&quot;</span></span>
<span class="token punctuation">/&gt;</span></span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><table><thead><tr><th style="text-align:left;">属性</th><th style="text-align:left;">解释说明</th></tr></thead><tbody><tr><td style="text-align:left;">width</td><td style="text-align:left;">宽度设置的是 viewport 宽度，可以设置 device-width 特殊值</td></tr><tr><td style="text-align:left;">initial-scale</td><td style="text-align:left;">初始缩放比，大于 0 的数字</td></tr><tr><td style="text-align:left;">maximum-scale</td><td style="text-align:left;">最大缩放比，大于 0 的数字</td></tr><tr><td style="text-align:left;">minimum-scale</td><td style="text-align:left;">最小缩放比，大于 0 的数字</td></tr><tr><td style="text-align:left;">user-scalable</td><td style="text-align:left;">用户是否可以缩放，yes or no(1 or 0)</td></tr></tbody></table><p><strong>标准viewport设置</strong></p><ul><li><p>视口宽度和设备保持一致</p></li><li><p>视口默认缩放比例1.0</p></li><li><p>不允许用户自行缩放</p></li><li><p>最大允许的缩放比例1.0</p></li><li><p>最小允许的缩放比例1.0</p></li></ul><h2 id="二倍图" tabindex="-1"><a class="header-anchor" href="#二倍图" aria-hidden="true">#</a> 二倍图</h2><h3 id="物理像素-物理像素比" tabindex="-1"><a class="header-anchor" href="#物理像素-物理像素比" aria-hidden="true">#</a> 物理像素&amp;物理像素比</h3><ul><li><p>物理像素点指的是屏幕显示的最小颗粒，是物理真实存在的。</p></li><li><p>开发时候的1px不是一定等于1个物理像素的。</p></li><li><p>一个px能显示的物理像素点的个数，称为物理像素比或者屏幕像素比。</p></li></ul><table><thead><tr><th style="text-align:left;">设备</th><th style="text-align:left;">尺寸(英寸)</th><th style="text-align:left;">开发尺寸(px)</th><th style="text-align:left;">物理像素比(dpr)</th></tr></thead><tbody><tr><td style="text-align:left;">iphone3G</td><td style="text-align:left;">3.5</td><td style="text-align:left;">320*480</td><td style="text-align:left;">1.0</td></tr><tr><td style="text-align:left;">iphone4/4s</td><td style="text-align:left;">3.5</td><td style="text-align:left;">320*480</td><td style="text-align:left;">2.0</td></tr><tr><td style="text-align:left;">iphone5/5s/5c</td><td style="text-align:left;">4.0</td><td style="text-align:left;">320*568</td><td style="text-align:left;">2.0</td></tr><tr><td style="text-align:left;">HTC One M8</td><td style="text-align:left;">4.5</td><td style="text-align:left;">360*640</td><td style="text-align:left;">3.0</td></tr><tr><td style="text-align:left;">iphone6</td><td style="text-align:left;">4.7</td><td style="text-align:left;">375*667</td><td style="text-align:left;">2.0</td></tr><tr><td style="text-align:left;">Nexus 4</td><td style="text-align:left;">4.7</td><td style="text-align:left;">384*640</td><td style="text-align:left;">2.0</td></tr><tr><td style="text-align:left;">Nexus 5x</td><td style="text-align:left;">5.2</td><td style="text-align:left;">411*731</td><td style="text-align:left;">2.6</td></tr><tr><td style="text-align:left;">iphone6 Plus</td><td style="text-align:left;">5.5</td><td style="text-align:left;">414*736</td><td style="text-align:left;">3.0</td></tr><tr><td style="text-align:left;">Samsung Galaxy Note 4</td><td style="text-align:left;">5.7</td><td style="text-align:left;">480*853</td><td style="text-align:left;">3.0</td></tr><tr><td style="text-align:left;">Sony Xperia Z Ultra</td><td style="text-align:left;">6.4</td><td style="text-align:left;">540*960</td><td style="text-align:left;">2.0</td></tr><tr><td style="text-align:left;">Nexus 7(&#39;12)</td><td style="text-align:left;">7.0</td><td style="text-align:left;">600*960</td><td style="text-align:left;">1.3</td></tr><tr><td style="text-align:left;">iPad Mini</td><td style="text-align:left;">7.9</td><td style="text-align:left;">768*1024</td><td style="text-align:left;">1.0</td></tr></tbody></table><h3 id="多倍图" tabindex="-1"><a class="header-anchor" href="#多倍图" aria-hidden="true">#</a> 多倍图</h3><ul><li><p>在标准viewport设置中，使用倍图来提高图片质量，解决在高清设备中的模糊问题</p></li><li><p>通常使用二倍图，但也有3倍图4倍图的情况，看实际需求。</p></li></ul><h3 id="背景缩放-background-size" tabindex="-1"><a class="header-anchor" href="#背景缩放-background-size" aria-hidden="true">#</a> 背景缩放 background-size</h3><p>属性：background-size: 背景图片宽度 背景图片高度;</p><ul><li><p>属性值可以是px(50px 50px)、方向词(left center)、cover、contain。</p></li><li><p>只写一个参数，高度省略的会等比例缩放。</p></li><li><p>里面的单位可以跟%，相对于父盒子而言。</p></li><li><p>cover：把背景图像扩展至足够大，以使背景图像完全覆盖背景区域。</p></li><li><p>contain：把图像扩展至最大尺寸，以使宽度和高度完全适应内容区域。</p></li></ul><h3 id="其他图片格式" tabindex="-1"><a class="header-anchor" href="#其他图片格式" aria-hidden="true">#</a> 其他图片格式</h3><ul><li><p>DPG图片压缩技术：京东自主研发的图片压缩技术，能够兼容jpeg，压缩后的图片和webp的清晰度对比没有差距。</p></li><li><p>webp图片格式：谷歌开发的一种旨在加快图片加载速度的图片格式，图片压缩体积大约只有jpeg的2/3，节省大量服务器宽带资源和数据空间。</p></li></ul><h2 id="移动端开发选择" tabindex="-1"><a class="header-anchor" href="#移动端开发选择" aria-hidden="true">#</a> 移动端开发选择</h2><h3 id="单独制作移动端页面-主流" tabindex="-1"><a class="header-anchor" href="#单独制作移动端页面-主流" aria-hidden="true">#</a> 单独制作移动端页面（主流）</h3><p>通常情况下，网站域名前面加m（mobile）可以打开移动端。通过判断设备，如果是移动设备打开，则跳转至移动端页面。</p><h3 id="响应式页面兼容移动端-其次" tabindex="-1"><a class="header-anchor" href="#响应式页面兼容移动端-其次" aria-hidden="true">#</a> 响应式页面兼容移动端（其次）</h3><p>通过判断屏幕宽度来改变样式，以适应不同终端。</p><p>缺点：制作麻烦，需要花很大精力去调兼容性问题。</p><h2 id="移动端常见布局" tabindex="-1"><a class="header-anchor" href="#移动端常见布局" aria-hidden="true">#</a> 移动端常见布局</h2><p>移动端布局和PC端有所区别：</p><p>1.单独制作移动端页面（主流）</p><ul><li><p>流式布局（百分比布局）</p></li><li><p>flex弹性布局（强烈推荐）</p></li><li><p>less+rem+媒体查询布局</p></li><li><p>混合布局</p></li></ul><p>2.响应式页面兼容移动端（其次）</p><ul><li><p>媒体查询</p></li><li><p>bootstrap</p></li></ul><h3 id="流式布局-百分比布局" tabindex="-1"><a class="header-anchor" href="#流式布局-百分比布局" aria-hidden="true">#</a> 流式布局（百分比布局）</h3><p>流式布局，就是百分比布局，也称非固定像素布局。</p><p>通过盒子的宽度设置成百分比来根据屏幕的宽度进行伸缩，不受固定像素的限制，内容向两侧填充。</p><p>流式布局方式是移动web开发使用的比较常见的布局方式。</p><p>max-width：最大宽度；min-width：最小宽度。height同理</p><p>视口标签与样式初始化示例：</p><div class="language-html line-numbers-mode" data-ext="html"><pre class="language-html"><code><span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span>meta</span> <span class="token attr-name">name</span><span class="token attr-value"><span class="token punctuation attr-equals">=</span><span class="token punctuation">&quot;</span>viewport<span class="token punctuation">&quot;</span></span> <span class="token attr-name">content</span><span class="token attr-value"><span class="token punctuation attr-equals">=</span><span class="token punctuation">&quot;</span>width=device-width, user-scalable=no,
initial-scale=1.0, maximum-scale=1.0, minimum-scale=1.0<span class="token punctuation">&quot;</span></span><span class="token punctuation">&gt;</span></span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div></div></div><div class="language-css line-numbers-mode" data-ext="css"><pre class="language-css"><code><span class="token selector">body</span> <span class="token punctuation">{</span>
  <span class="token property">margin</span><span class="token punctuation">:</span> 0 auto<span class="token punctuation">;</span>
  <span class="token property">min-width</span><span class="token punctuation">:</span> 320px<span class="token punctuation">;</span>
  <span class="token property">max-width</span><span class="token punctuation">:</span> 640px<span class="token punctuation">;</span>
  <span class="token property">background</span><span class="token punctuation">:</span> #fff<span class="token punctuation">;</span>
  <span class="token property">font-size</span><span class="token punctuation">:</span> 14px<span class="token punctuation">;</span>
  <span class="token property">font-family</span><span class="token punctuation">:</span> -apple-system<span class="token punctuation">,</span> Helvetica<span class="token punctuation">,</span> sans-serif<span class="token punctuation">;</span>
  <span class="token property">line-height</span><span class="token punctuation">:</span> 1.5<span class="token punctuation">;</span>
  <span class="token property">color</span><span class="token punctuation">:</span> #666<span class="token punctuation">;</span>
<span class="token punctuation">}</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="flex布局-非常重要" tabindex="-1"><a class="header-anchor" href="#flex布局-非常重要" aria-hidden="true">#</a> flex布局（非常重要）</h3><p>传统布局：兼容性好、布局繁琐、局限性，不能在移动端很好布局。</p><p>flex弹性布局：操作方便，布局极简单，移动端应用广泛、IE11或更低版本部分支持、现阶段主流浏览器都支持，如今PC端也非常建议大量使用。</p><h4 id="布局原理" tabindex="-1"><a class="header-anchor" href="#布局原理" aria-hidden="true">#</a> 布局原理</h4><p>当我们为父盒子设为flex布局后，子元素的float、clear和vertical-align属性将失效。</p><p>伸缩布局=弹性布局=伸缩盒布局=弹性盒布局=flex布局</p><p>采用flex布局的元素，称为flex 容器，简称<strong>容器</strong>。它的所有子元素自动成为容器成员，称为flex 项目，简称<strong>项目</strong>。</p><p><strong>总结</strong>：通过给父盒子添加flex属性，控制子盒子的位置和排列方式。</p><h4 id="容器属性" tabindex="-1"><a class="header-anchor" href="#容器属性" aria-hidden="true">#</a> 容器属性</h4><p>容器由主轴和侧轴按一定方向排列组成，默认x轴为主轴，水平向右、y轴为侧轴，水平向下。</p><ol><li>flex-direction</li></ol><p>flex-direction属性决定主轴方向（项目排列方向）。</p><table><thead><tr><th style="text-align:left;">属性值</th><th style="text-align:left;">说明</th></tr></thead><tbody><tr><td style="text-align:left;">row</td><td style="text-align:left;">默认值从左到右</td></tr><tr><td style="text-align:left;">row-reverse</td><td style="text-align:left;">从右到左</td></tr><tr><td style="text-align:left;">column</td><td style="text-align:left;">从上到下</td></tr><tr><td style="text-align:left;">column-reverse</td><td style="text-align:left;">从下到上</td></tr></tbody></table><br><ol start="2"><li>justify-content</li></ol><p>justify-content属性定义了项目在主轴上的对齐方式。</p><table><thead><tr><th style="text-align:left;">属性值</th><th style="text-align:left;">说明</th></tr></thead><tbody><tr><td style="text-align:left;">flex-start</td><td style="text-align:left;">默认值 从头部开始 如果主轴是x轴，则从左到右</td></tr><tr><td style="text-align:left;">flex-end</td><td style="text-align:left;">从尾部开始</td></tr><tr><td style="text-align:left;">center</td><td style="text-align:left;">在主轴居中对齐（如果主轴是x轴则水平居中）</td></tr><tr><td style="text-align:left;">space-around</td><td style="text-align:left;">平分剩余控件</td></tr><tr><td style="text-align:left;">space-between</td><td style="text-align:left;">先两边贴边 再平分剩余空间（重要）</td></tr></tbody></table><br><ol start="3"><li>flex-wrap</li></ol><p>flex-wrap属性定义，flex布局默认不换行。</p><table><thead><tr><th style="text-align:left;">属性值</th><th style="text-align:left;">说明</th></tr></thead><tbody><tr><td style="text-align:left;">nowrap</td><td style="text-align:left;">默认值 不换行</td></tr><tr><td style="text-align:left;">wrap</td><td style="text-align:left;">换行</td></tr></tbody></table><br><ol start="4"><li>align-items（单行子项）</li></ol><p>align-items控制子项在侧轴上的排列方式，在子项为单项的时候使用。</p><table><thead><tr><th style="text-align:left;">属性值</th><th style="text-align:left;">说明</th></tr></thead><tbody><tr><td style="text-align:left;">flex-start</td><td style="text-align:left;">从上到下</td></tr><tr><td style="text-align:left;">flex-end</td><td style="text-align:left;">从下到上</td></tr><tr><td style="text-align:left;">center</td><td style="text-align:left;">挤在一起居中（垂直居中）</td></tr><tr><td style="text-align:left;">stretch</td><td style="text-align:left;">默认值 拉伸</td></tr></tbody></table><br><ol start="5"><li>align-content（多行子项）</li></ol><p>align-content设置子项在侧轴上的排列方式并且只能用于子项出现换行的情况，在单行下是没有效果的。</p><table><thead><tr><th style="text-align:left;">属性值</th><th style="text-align:left;">说明</th></tr></thead><tbody><tr><td style="text-align:left;">flex-start</td><td style="text-align:left;">默认值 在侧轴的头部开始排列</td></tr><tr><td style="text-align:left;">flex-end</td><td style="text-align:left;">在侧轴的尾部开始排列</td></tr><tr><td style="text-align:left;">center</td><td style="text-align:left;">在侧轴中间显示</td></tr><tr><td style="text-align:left;">space-around</td><td style="text-align:left;">子项在侧轴平分剩余空间</td></tr><tr><td style="text-align:left;">space-between</td><td style="text-align:left;">子项在侧轴先分布在两头，再平分剩余空间</td></tr><tr><td style="text-align:left;">stretch</td><td style="text-align:left;">设置子项元素高度，平分父元素高度</td></tr></tbody></table><br><ol start="6"><li>align-content和align-items比较</li></ol><p>align-items适用于单行情况，只有上对齐、下对齐、居中和拉伸。</p><p>align-content适用于多行情况下，单行情况失效，可以设置上对齐、下对齐、居中、拉伸以及平均分配剩余空间等属性值。</p><br><ol start="7"><li>flex-flow</li></ol><p>flex-flow是flex-direction和flex-wrap的复合属性</p><p>示例写法：flex-flow: column wrap;</p><br><p><strong>总结</strong></p><ul><li><p>flex-direction：设置主轴的方向</p></li><li><p>justify-content：设置主轴上的子元素排列方式</p></li><li><p>flex-wrap：设置子元素是否换行</p></li><li><p>align-content：设置侧轴上的子元素的排列方式（多行）</p></li><li><p>align-items：设置侧轴上的子元素排列方式（单行）</p></li><li><p>flex-flow：复合属性，相当于同时设置了flex-direction和flex-wrap</p></li></ul><h4 id="项目属性" tabindex="-1"><a class="header-anchor" href="#项目属性" aria-hidden="true">#</a> 项目属性</h4><ol><li>order</li></ol><p>order属性定义项目的排列顺序。</p><p>数值越小，排列越靠前，默认为0。注意和z-index不一样。</p><br><ol start="2"><li>align-self</li></ol><p>align-self 属性允许您为某个项目设置不同于其它项目的对齐方式，该属性可以覆盖 align-items 属性的值。</p><table><thead><tr><th style="text-align:left;">值</th><th style="text-align:left;">描述</th></tr></thead><tbody><tr><td style="text-align:left;">auto</td><td style="text-align:left;">默认值 表示元素将继承其父容器的 align-items 属性值，<br>如果没有父容器，则为“stretch”</td></tr><tr><td style="text-align:left;">stretch</td><td style="text-align:left;">项目将被拉伸以适合容器</td></tr><tr><td style="text-align:left;">center</td><td style="text-align:left;">项目位于容器的中央</td></tr><tr><td style="text-align:left;">flex-start</td><td style="text-align:left;">项目位于容器的顶部</td></tr><tr><td style="text-align:left;">flex-end</td><td style="text-align:left;">项目位于容器的底部</td></tr><tr><td style="text-align:left;">baseline</td><td style="text-align:left;">项目与容器的基线对齐</td></tr><tr><td style="text-align:left;">initial</td><td style="text-align:left;">将此属性设置为属性的默认值</td></tr><tr><td style="text-align:left;">inherit</td><td style="text-align:left;">从父元素继承属性的值</td></tr></tbody></table><br><ol start="3"><li>flex</li></ol><p>flex 属性是 flex-grow、flex-shrink 和 flex-basis 三个属性的简写</p><p>语法：flex: flex-grow flex-shrink flex-basis;</p><p>参数说明如下：</p><ul><li><p>flex-grow：（必填参数）一个数字，用来设置项目相对于其他项目的增长量，默认值为 0；</p></li><li><p>flex-shrink：（选填参数）一个数字，用来设置项目相对于其他项目的收缩量，默认值为 1；</p></li><li><p>flex-basis：（选填参数）项目的长度，合法值为 auto（默认值，表示自动）、inherit（表示从父元素继承该属性的值） 或者以具体的值加 &quot;%&quot;、&quot;px&quot;、&quot;em&quot; 等单位的形式。</p></li></ul><p>另外，flex 属性还有两个快捷值，分别为 auto（1 1 auto）和 none（0 0 auto）。</p><p><strong>总结</strong></p><ul><li><p>flex 子项目占的份数（增长比例、收缩比例）</p></li><li><p>align-self 控制子项在侧轴的排列方式</p></li><li><p>order 定义子项的排列顺序（先后顺序）</p></li></ul>`,118),i=[s];function d(r,p){return e(),l("div",null,i)}const x=t(n,[["render",d],["__file","移动端布局.html.vue"]]);export{x as default};
