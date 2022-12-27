import{_ as n}from"./_plugin-vue_export-helper.cdc0426e.js";import{o as s,c as a,a as p}from"./app.77d60267.js";const e={},t=p(`<p>CSS 作为一门标记性语言，语法相对简单，对使用者的要求较低，但同时也带来一些问题</p><p>需要书写大量看似没有逻辑的代码，不方便维护及扩展，不利于复用，尤其对于非前端开发工程师来讲，往往会因为缺少 CSS 编写经验而很难写出组织良好且易于维护的 CSS 代码</p><p>CSS 预处理器便是针对上述问题的解决方案</p><h2 id="预编译语言" tabindex="-1"><a class="header-anchor" href="#预编译语言" aria-hidden="true">#</a> 预编译语言</h2><p>扩充了 CSS 语言，增加了诸如变量、混合（mixin）、函数等功能，让 CSS 更易维护、方便</p><p>本质上，预编译语言是 CSS 的超集</p><p>包含一套自定义的语法及一个解析器，根据这些语法定义自己的样式规则，这些规则最终会通过解析器，编译生成对应的 CSS 文件</p><p>CSS 预编译语言在前端里面有三大优秀的预编处理器，分别是：</p><ul><li>sass</li><li>less</li><li>stylus</li></ul><h3 id="sass" tabindex="-1"><a class="header-anchor" href="#sass" aria-hidden="true">#</a> sass</h3><p>2007 年诞生，最早也是最成熟的 CSS 预处理器，拥有 Ruby 社区的支持和 Compass 这一最强大的 CSS 框架，目前受 LESS 影响，已经进化到了全面兼容 CSS 的 Scss</p><p>文件后缀名为.sass 与 scss，可以严格按照 sass 的缩进方式省去大括号和分号</p><h3 id="less" tabindex="-1"><a class="header-anchor" href="#less" aria-hidden="true">#</a> less</h3><p>2009 年出现，受 SASS 的影响较大，但又使用 CSS 的语法，让大部分开发者和设计师更容易上手，在 Ruby 社区之外支持者远超过 SASS</p><p>其缺点是比起 SASS 来，可编程功能不够，不过优点是简单和兼容 CSS，反过来也影响了 SASS 演变到了 Scss 的时代</p><h3 id="stylus" tabindex="-1"><a class="header-anchor" href="#stylus" aria-hidden="true">#</a> stylus</h3><p>Stylus 是一个 CSS 的预处理框架，2010 年产生，来自 Node.js 社区，主要用来给 Node 项目进行 CCSSss 预处理支持</p><p>所以 Stylus 是一种新型语言，可以创建健壮的、动态的、富有表现力的 CSS。比较年轻，其本质上做的事情与 SASS/LESS 等类似。</p><h2 id="特性" tabindex="-1"><a class="header-anchor" href="#特性" aria-hidden="true">#</a> 特性</h2><p>由于各语言的功能函数各不相同，此处不作详细记录。</p><h3 id="基本使用" tabindex="-1"><a class="header-anchor" href="#基本使用" aria-hidden="true">#</a> 基本使用</h3><ul><li>less 和 scss</li></ul><div class="language-less line-numbers-mode" data-ext="less"><pre class="language-less"><code><span class="token selector">.box</span> <span class="token punctuation">{</span>
  <span class="token property">display</span><span class="token punctuation">:</span> block<span class="token punctuation">;</span>
<span class="token punctuation">}</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><ul><li>sass</li></ul><div class="language-sass line-numbers-mode" data-ext="sass"><pre class="language-sass"><code><span class="token selector">.box  display: block</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div></div></div><ul><li>stylus</li></ul><div class="language-stylus line-numbers-mode" data-ext="styl"><pre class="language-stylus"><code><span class="token punctuation">.</span>box  display<span class="token punctuation">:</span> block
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div></div></div><h3 id="嵌套" tabindex="-1"><a class="header-anchor" href="#嵌套" aria-hidden="true">#</a> 嵌套</h3><p>三者的嵌套语法都是一致的，甚至连引用父级选择器的标记 &amp; 也相同</p><p>区别只是 Sass 和 Stylus 可以用没有大括号的方式书写</p><div class="language-less line-numbers-mode" data-ext="less"><pre class="language-less"><code><span class="token selector">.a</span> <span class="token punctuation">{</span>
  <span class="token selector">&amp;.b</span> <span class="token punctuation">{</span>
    <span class="token property">color</span><span class="token punctuation">:</span> red<span class="token punctuation">;</span>
  <span class="token punctuation">}</span>
<span class="token punctuation">}</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="变量" tabindex="-1"><a class="header-anchor" href="#变量" aria-hidden="true">#</a> 变量</h3><p>变量无疑为 CSS 增加了一种有效的复用方式，减少了原来在 CSS 中无法避免的重复「硬编码」</p><p>less 声明的变量必须以@开头，后面紧跟变量名和变量值，而且变量名和变量值需要使用冒号:分隔开</p><div class="language-less line-numbers-mode" data-ext="less"><pre class="language-less"><code><span class="token variable">@red<span class="token punctuation">:</span></span> #c00<span class="token punctuation">;</span>
<span class="token selector">strong</span> <span class="token punctuation">{</span>
  <span class="token property">color</span><span class="token punctuation">:</span> <span class="token variable">@red</span><span class="token punctuation">;</span>
<span class="token punctuation">}</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>sass 声明的变量跟 less 十分的相似，只是变量名前面使用@开头</p><div class="language-sass line-numbers-mode" data-ext="sass"><pre class="language-sass"><code><span class="token variable-line"><span class="token variable">$red</span><span class="token punctuation">:</span> #c00;</span>
<span class="token selector">strong {</span>
<span class="token property-line">  <span class="token property">color</span><span class="token punctuation">:</span> <span class="token variable">$red</span>;</span>
<span class="token selector">}</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>stylus 声明的变量没有任何的限定，可以使用$开头，结尾的分号;可有可无，但变量与变量值之间需要使用=</p><p>在 stylus 中我们不建议使用@符号开头声明变量</p><div class="language-stylus line-numbers-mode" data-ext="styl"><pre class="language-stylus"><code><span class="token variable-declaration"><span class="token variable">red</span> <span class="token operator">=</span> <span class="token hexcode">#c00</span></span>
<span class="token property-declaration"><span class="token property">strong</span>  color<span class="token punctuation">:</span> <span class="token color">red</span></span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="作用域" tabindex="-1"><a class="header-anchor" href="#作用域" aria-hidden="true">#</a> 作用域</h3><p>CSS 预编译器把变量赋予作用域，也就是存在生命周期。就像 js 一样，它会先从局部作用域查找变量，依次向上级作用域查找</p><ul><li>sass 中不存在全局变量</li></ul><p>编译前：</p><div class="language-sass line-numbers-mode" data-ext="sass"><pre class="language-sass"><code><span class="token variable-line"><span class="token variable">$color</span><span class="token punctuation">:</span> black;</span>
<span class="token selector">.scoped {</span>
<span class="token variable-line">  <span class="token variable">$bg</span><span class="token punctuation">:</span> blue;</span>
<span class="token variable-line">  <span class="token variable">$color</span><span class="token punctuation">:</span> white;</span>
<span class="token property-line">  <span class="token property">color</span><span class="token punctuation">:</span> <span class="token variable">$color</span>;</span>
<span class="token property-line">  <span class="token property">background-color</span><span class="token punctuation">:</span> <span class="token variable">$bg</span>;</span>
<span class="token selector">}</span>
<span class="token selector">.unscoped {</span>
<span class="token property-line">  <span class="token property">color</span><span class="token punctuation">:</span> <span class="token variable">$color</span>;</span>
<span class="token selector">}</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>编译后：</p><div class="language-css line-numbers-mode" data-ext="css"><pre class="language-css"><code><span class="token selector">.scoped</span> <span class="token punctuation">{</span>
  <span class="token property">color</span><span class="token punctuation">:</span> white<span class="token punctuation">;</span> <span class="token comment">/*是白色*/</span>
  <span class="token property">background-color</span><span class="token punctuation">:</span> blue<span class="token punctuation">;</span>
<span class="token punctuation">}</span>
<span class="token selector">.unscoped</span> <span class="token punctuation">{</span>
  <span class="token property">color</span><span class="token punctuation">:</span> white<span class="token punctuation">;</span> <span class="token comment">/*白色（无全局变量概念）*/</span>
<span class="token punctuation">}</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>所以，<strong>在 sass 中最好不要定义相同的变量名</strong></p><ul><li>less 与 stylus</li></ul><p>less 与 stylus 的作用域跟 javascript 十分的相似，首先会查找局部定义的变量，如果没有找到，会像冒泡一样，一级一级往下查找，直到根为止</p><p>编译前：</p><div class="language-less line-numbers-mode" data-ext="less"><pre class="language-less"><code><span class="token variable">@color<span class="token punctuation">:</span></span> black<span class="token punctuation">;</span>
<span class="token selector">.scoped</span> <span class="token punctuation">{</span>
  <span class="token variable">@bg<span class="token punctuation">:</span></span> blue<span class="token punctuation">;</span>
  <span class="token variable">@color<span class="token punctuation">:</span></span> white<span class="token punctuation">;</span>
  <span class="token property">color</span><span class="token punctuation">:</span> <span class="token variable">@color</span><span class="token punctuation">;</span>
  <span class="token property">background-color</span><span class="token punctuation">:</span> <span class="token variable">@bg</span><span class="token punctuation">;</span>
<span class="token punctuation">}</span>
<span class="token selector">.unscoped</span> <span class="token punctuation">{</span>
  <span class="token property">color</span><span class="token punctuation">:</span> <span class="token variable">@color</span><span class="token punctuation">;</span>
<span class="token punctuation">}</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>编译后：</p><div class="language-css line-numbers-mode" data-ext="css"><pre class="language-css"><code><span class="token selector">.scoped</span> <span class="token punctuation">{</span>
  <span class="token property">color</span><span class="token punctuation">:</span> white<span class="token punctuation">;</span> <span class="token comment">/*白色（调用了局部变量）*/</span>
  <span class="token property">background-color</span><span class="token punctuation">:</span> blue<span class="token punctuation">;</span>
<span class="token punctuation">}</span>
<span class="token selector">.unscoped</span> <span class="token punctuation">{</span>
  <span class="token property">color</span><span class="token punctuation">:</span> black<span class="token punctuation">;</span> <span class="token comment">/*黑色（调用了全局变量）*/</span>
<span class="token punctuation">}</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="混入" tabindex="-1"><a class="header-anchor" href="#混入" aria-hidden="true">#</a> 混入</h3><p>混入（mixin）应该说是预处理器最精髓的功能之一了，简单点来说，Mixins 可以将一部分样式抽出，作为单独定义的模块，被很多选择器重复使用</p><p>可以在 Mixins 中定义变量或者默认参数</p><ul><li>less</li></ul><p>在 less 中，混合的用法是指将定义好的 ClassA 中引入另一个已经定义的 Class，也能够传递参数，参数变量为@声明</p><p>编译前：</p><div class="language-less line-numbers-mode" data-ext="less"><pre class="language-less"><code><span class="token selector">.alert</span> <span class="token punctuation">{</span>
  <span class="token property">font-weight</span><span class="token punctuation">:</span> 700<span class="token punctuation">;</span>
<span class="token punctuation">}</span>
<span class="token selector">.highlight(<span class="token variable">@color</span>: red)</span> <span class="token punctuation">{</span>
  <span class="token property">font-size</span><span class="token punctuation">:</span> 1.2em<span class="token punctuation">;</span>
  <span class="token property">color</span><span class="token punctuation">:</span> <span class="token variable">@color</span><span class="token punctuation">;</span>
<span class="token punctuation">}</span>
<span class="token selector">.heads-up</span> <span class="token punctuation">{</span>
  <span class="token mixin-usage function">.alert</span><span class="token punctuation">;</span>
  <span class="token mixin-usage function">.highlight</span><span class="token punctuation">(</span>red<span class="token punctuation">)</span><span class="token punctuation">;</span>
<span class="token punctuation">}</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>编译后：</p><div class="language-css line-numbers-mode" data-ext="css"><pre class="language-css"><code><span class="token selector">.alert</span> <span class="token punctuation">{</span>
  <span class="token property">font-weight</span><span class="token punctuation">:</span> 700<span class="token punctuation">;</span>
<span class="token punctuation">}</span>
<span class="token selector">.heads-up</span> <span class="token punctuation">{</span>
  <span class="token property">font-weight</span><span class="token punctuation">:</span> 700<span class="token punctuation">;</span>
  <span class="token property">font-size</span><span class="token punctuation">:</span> 1.2em<span class="token punctuation">;</span>
  <span class="token property">color</span><span class="token punctuation">:</span> red<span class="token punctuation">;</span>
<span class="token punctuation">}</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><ul><li>sass</li></ul><p>sass 声明 mixins 时需要使用 <strong>@mixin</strong>，后面紧跟 mixin 的名，也可以设置参数，参数名为变量$声明的形式，调用的时候使用 <strong>@include</strong> + mixin 名称</p><div class="language-scss line-numbers-mode" data-ext="scss"><pre class="language-scss"><code><span class="token keyword">@mixin</span> <span class="token selector">large-text </span><span class="token punctuation">{</span>
  <span class="token selector">font: </span><span class="token punctuation">{</span>
    <span class="token property">family</span><span class="token punctuation">:</span> Arial<span class="token punctuation">;</span>
    <span class="token property">size</span><span class="token punctuation">:</span> 20px<span class="token punctuation">;</span>
    <span class="token property">weight</span><span class="token punctuation">:</span> bold<span class="token punctuation">;</span>
  <span class="token punctuation">}</span>
  <span class="token property">color</span><span class="token punctuation">:</span> #ff0000<span class="token punctuation">;</span>
<span class="token punctuation">}</span>
<span class="token selector">.page-title </span><span class="token punctuation">{</span>
  <span class="token keyword">@include</span> large-text<span class="token punctuation">;</span>
  <span class="token property">padding</span><span class="token punctuation">:</span> 4px<span class="token punctuation">;</span>
  <span class="token property">margin-top</span><span class="token punctuation">:</span> 10px<span class="token punctuation">;</span>
<span class="token punctuation">}</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><ul><li>stylus</li></ul><p>stylus 中的混合和前两款 CSS 预处理器语言的混合略有不同，他可以不使用任何符号，就是直接声明 Mixins 名，然后在定义参数和默认值之间用等号（=）来连接</p><div class="language-stylus line-numbers-mode" data-ext="styl"><pre class="language-stylus"><code><span class="token func"><span class="token function">error</span><span class="token punctuation">(</span>borderWidth <span class="token operator">=</span> <span class="token number">2</span><span class="token unit">px</span><span class="token punctuation">)</span> <span class="token punctuation">{</span></span>
  <span class="token property-declaration"><span class="token property">border</span><span class="token punctuation">:</span> borderWidth solid <span class="token hexcode">#F00</span><span class="token punctuation">;</span></span>
  <span class="token property-declaration"><span class="token property">color</span><span class="token punctuation">:</span> <span class="token hexcode">#F00</span><span class="token punctuation">;</span></span>
<span class="token punctuation">}</span>
<span class="token selector">.generic-error <span class="token punctuation">{</span></span>
  <span class="token property-declaration"><span class="token property">padding</span><span class="token punctuation">:</span> <span class="token number">20</span><span class="token unit">px</span><span class="token punctuation">;</span></span>
  <span class="token property-declaration"><span class="token property">margin</span><span class="token punctuation">:</span> <span class="token number">4</span><span class="token unit">px</span><span class="token punctuation">;</span></span>
  <span class="token func"><span class="token function">error</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span> <span class="token comment">/* 调用error mixins */</span></span>
<span class="token punctuation">}</span>
<span class="token selector">.login-error <span class="token punctuation">{</span></span>
  <span class="token property-declaration"><span class="token property">left</span><span class="token punctuation">:</span> <span class="token number">12</span><span class="token unit">px</span><span class="token punctuation">;</span></span>
  <span class="token property-declaration"><span class="token property">position</span><span class="token punctuation">:</span> absolute<span class="token punctuation">;</span></span>
  <span class="token property-declaration"><span class="token property">top</span><span class="token punctuation">:</span> <span class="token number">20</span><span class="token unit">px</span><span class="token punctuation">;</span></span>
  <span class="token func"><span class="token function">error</span><span class="token punctuation">(</span><span class="token number">5</span><span class="token unit">px</span><span class="token punctuation">)</span><span class="token punctuation">;</span> <span class="token comment">/* 调用error mixins，并将参数 borderWidth 的值指定为5px */</span></span>
<span class="token punctuation">}</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="计算" tabindex="-1"><a class="header-anchor" href="#计算" aria-hidden="true">#</a> 计算</h3><p>预编译期允许对数字，颜色，变量的操作，支持加、减、乘、除或更复杂的综合运算</p><p>less、sass、stylus 的计算语法相同。当在属性值中使用/时，必须用圆括号括起来，为了避免某些属性对 / 运算符的误判</p><div class="language-less line-numbers-mode" data-ext="less"><pre class="language-less"><code><span class="token variable">@file<span class="token punctuation">:</span></span> 5%<span class="token punctuation">;</span>
<span class="token variable">@base-color<span class="token punctuation">:</span></span> lightblue<span class="token punctuation">;</span>
<span class="token selector">.cor</span> <span class="token punctuation">{</span>
  <span class="token property">width</span><span class="token punctuation">:</span> <span class="token variable">@file</span> <span class="token operator">*</span> 10<span class="token punctuation">;</span> <span class="token comment">//50%</span>
  <span class="token property">background-color</span><span class="token punctuation">:</span> <span class="token variable">@base-color</span> <span class="token operator">+</span> #111<span class="token punctuation">;</span>
<span class="token punctuation">}</span>

<span class="token variable">@color-black<span class="token punctuation">:</span></span> #000000<span class="token punctuation">;</span>

<span class="token selector">.content</span> <span class="token punctuation">{</span>
  <span class="token selector">h3</span> <span class="token punctuation">{</span>
    <span class="token property">color</span><span class="token punctuation">:</span> <span class="token variable">@color-black</span><span class="token punctuation">;</span> <span class="token comment">// #000000</span>
  <span class="token punctuation">}</span>
  <span class="token selector">p</span> <span class="token punctuation">{</span>
    <span class="token property">color</span><span class="token punctuation">:</span> <span class="token variable">@color-black</span> <span class="token operator">+</span> #888888<span class="token punctuation">;</span> <span class="token comment">// #888888</span>
  <span class="token punctuation">}</span>
<span class="token punctuation">}</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="条件判断" tabindex="-1"><a class="header-anchor" href="#条件判断" aria-hidden="true">#</a> 条件判断</h3><ul><li>less</li></ul><p>less 没有我们平常使用的 if，else 条件判断，而是用 when 来实现这种用法</p><ol><li>(),()相当于 JS 中的||</li></ol><div class="language-less line-numbers-mode" data-ext="less"><pre class="language-less"><code><span class="token comment">/* 当下边 div 中 .size 传入的第一个参数是100px或者第二个参数是100px才会执行*/</span>
<span class="token selector">.size(<span class="token variable">@width</span>,<span class="token variable">@height</span>) when (<span class="token variable">@width</span> = 100px),(<span class="token variable">@height</span> = 100px)</span> <span class="token punctuation">{</span>
  <span class="token property">width</span><span class="token punctuation">:</span> <span class="token variable">@width</span><span class="token punctuation">;</span>
  <span class="token property">height</span><span class="token punctuation">:</span> <span class="token variable">@height</span><span class="token punctuation">;</span>
<span class="token punctuation">}</span>

<span class="token selector">div</span> <span class="token punctuation">{</span>
  <span class="token mixin-usage function">.size</span><span class="token punctuation">(</span>100px<span class="token punctuation">,</span>100px<span class="token punctuation">)</span><span class="token punctuation">;</span>
  <span class="token property">background</span><span class="token punctuation">:</span> red<span class="token punctuation">;</span>
<span class="token punctuation">}</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><ol start="2"><li>()and()相当于 JS 中的&amp;&amp;</li></ol><div class="language-less line-numbers-mode" data-ext="less"><pre class="language-less"><code><span class="token comment">/* 当下边 div 中 .size 传入的第一个参数是100px并且第二个参数是100px才会执行*/</span>
<span class="token selector">.size(<span class="token variable">@width</span>,<span class="token variable">@height</span>) when (<span class="token variable">@width</span> = 100px) and (<span class="token variable">@height</span> = 100px)</span> <span class="token punctuation">{</span>
  <span class="token property">width</span><span class="token punctuation">:</span> <span class="token variable">@width</span><span class="token punctuation">;</span>
  <span class="token property">height</span><span class="token punctuation">:</span> <span class="token variable">@height</span><span class="token punctuation">;</span>
<span class="token punctuation">}</span>

<span class="token selector">div</span> <span class="token punctuation">{</span>
  <span class="token mixin-usage function">.size</span><span class="token punctuation">(</span>100px<span class="token punctuation">,</span>100px<span class="token punctuation">)</span><span class="token punctuation">;</span>
  <span class="token property">background</span><span class="token punctuation">:</span> red<span class="token punctuation">;</span>
<span class="token punctuation">}</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><ul><li>sass</li></ul><p>sass 中的条件判断和 less 一样 sass 中也支持条件判断，只不过 sass 中的条件判断支持得更为彻底</p><p>sass 中支持的条件判断如下：</p><p>@if(条件语句){}</p><p>@else if(条件语句){}</p><p>... ...</p><p>@else(条件语句){}</p><p>sass 中当条件不为 false 或者 null 时就会执行 {} 中的代码，和 less 一样 sass 中的条件语句支持通过 &gt;、&gt;=、&lt;、&lt;=、== 进行判断</p><div class="language-scss line-numbers-mode" data-ext="scss"><pre class="language-scss"><code><span class="token keyword">@mixin</span> <span class="token function">triangle</span><span class="token punctuation">(</span><span class="token variable">$dir</span><span class="token punctuation">,</span> <span class="token variable">$width</span><span class="token punctuation">,</span> <span class="token variable">$color</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
  <span class="token property">width</span><span class="token punctuation">:</span> 0<span class="token punctuation">;</span>
  <span class="token property">height</span><span class="token punctuation">:</span> 0<span class="token punctuation">;</span>
  <span class="token property">border-width</span><span class="token punctuation">:</span> <span class="token variable">$width</span><span class="token punctuation">;</span>
  <span class="token property">border-style</span><span class="token punctuation">:</span> solid solid solid solid<span class="token punctuation">;</span>
  <span class="token keyword">@if</span> <span class="token punctuation">(</span><span class="token variable">$dir</span> <span class="token operator">==</span> Up<span class="token punctuation">)</span> <span class="token punctuation">{</span>
    <span class="token property">border-color</span><span class="token punctuation">:</span> transparent transparent <span class="token variable">$color</span> transparent<span class="token punctuation">;</span>
  <span class="token punctuation">}</span> <span class="token keyword">@else if</span> <span class="token punctuation">(</span><span class="token variable">$dir</span> <span class="token operator">==</span> Down<span class="token punctuation">)</span> <span class="token punctuation">{</span>
    <span class="token property">border-color</span><span class="token punctuation">:</span> <span class="token variable">$color</span> transparent transparent transparent<span class="token punctuation">;</span>
  <span class="token punctuation">}</span> <span class="token keyword">@else if</span> <span class="token punctuation">(</span><span class="token variable">$dir</span> <span class="token operator">==</span> Left<span class="token punctuation">)</span> <span class="token punctuation">{</span>
    <span class="token property">border-color</span><span class="token punctuation">:</span> transparent <span class="token variable">$color</span> transparent transparent<span class="token punctuation">;</span>
  <span class="token punctuation">}</span> <span class="token keyword">@else if</span> <span class="token punctuation">(</span><span class="token variable">$dir</span> <span class="token operator">==</span> Right<span class="token punctuation">)</span> <span class="token punctuation">{</span>
    <span class="token property">border-color</span><span class="token punctuation">:</span> transparent transparent transparent <span class="token variable">$color</span><span class="token punctuation">;</span>
  <span class="token punctuation">}</span>
<span class="token punctuation">}</span>

<span class="token selector">div </span><span class="token punctuation">{</span>
  <span class="token keyword">@include</span> <span class="token function">triangle</span><span class="token punctuation">(</span>Left<span class="token punctuation">,</span> 50px<span class="token punctuation">,</span> blue<span class="token punctuation">)</span><span class="token punctuation">;</span>
<span class="token punctuation">}</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><ul><li>stylus</li></ul><p>stylus 的条件判断写法较 sass 而言更加简洁</p><div class="language-stylus line-numbers-mode" data-ext="styl"><pre class="language-stylus"><code><span class="token func"><span class="token function">box</span><span class="token punctuation">(</span>x<span class="token punctuation">,</span> y<span class="token punctuation">,</span> margin-only <span class="token operator">=</span> <span class="token boolean">false</span><span class="token punctuation">)</span></span>
  <span class="token statement"><span class="token keyword">if</span> margin-only</span>
    <span class="token property-declaration"><span class="token property">margin</span> y x</span>
  <span class="token selector">else</span>
    <span class="token property-declaration"><span class="token property">padding</span> y x</span>

<span class="token selector">body</span>
  <span class="token func"><span class="token function">box</span><span class="token punctuation">(</span><span class="token number">5</span><span class="token unit">px</span><span class="token punctuation">,</span> <span class="token number">10</span><span class="token unit">px</span><span class="token punctuation">,</span> <span class="token boolean">true</span><span class="token punctuation">)</span></span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="循环" tabindex="-1"><a class="header-anchor" href="#循环" aria-hidden="true">#</a> 循环</h3><ul><li>less</li></ul><p>less 的循环本质上是自递归调用</p><p>移动端适配方案 - less 写法</p><div class="language-less line-numbers-mode" data-ext="less"><pre class="language-less"><code><span class="token variable">@defaultRemValue<span class="token punctuation">:</span></span> 32px<span class="token punctuation">;</span>

<span class="token variable">@defaultWidth<span class="token punctuation">:</span></span> 750px<span class="token punctuation">;</span>

<span class="token selector">.LoopScreenArray(<span class="token variable">@n</span>, <span class="token variable">@i</span>: 1, <span class="token variable">@argu</span>) when (<span class="token variable">@i</span> &lt;= <span class="token variable">@n</span>)</span> <span class="token punctuation">{</span>
  <span class="token variable">@value<span class="token punctuation">:</span></span> <span class="token function">extract</span><span class="token punctuation">(</span><span class="token variable">@argu</span><span class="token punctuation">,</span> <span class="token variable">@i</span><span class="token punctuation">)</span><span class="token punctuation">;</span>

  <span class="token atrule">@media only screen and <span class="token punctuation">(</span>min-width<span class="token punctuation">:</span> unit<span class="token punctuation">(</span>@value, px<span class="token punctuation">)</span><span class="token punctuation">)</span></span> <span class="token punctuation">{</span>
    <span class="token selector">html,
    body</span> <span class="token punctuation">{</span>
      <span class="token property">font-size</span><span class="token punctuation">:</span> <span class="token function">unit</span><span class="token punctuation">(</span>
        <span class="token variable">@value</span> <span class="token operator">/</span> <span class="token variable">@defaultWidth</span> <span class="token operator">*</span> <span class="token variable">@defaultRemValue</span><span class="token punctuation">,</span>
        px
      <span class="token punctuation">)</span> <span class="token important">!important</span><span class="token punctuation">;</span> <span class="token comment">/* no */</span>
    <span class="token punctuation">}</span>
  <span class="token punctuation">}</span>

  .<span class="token function">LoopScreenArray</span><span class="token punctuation">(</span><span class="token variable">@n</span><span class="token punctuation">,</span> <span class="token variable">@i</span><span class="token operator">+</span>1<span class="token punctuation">,</span> <span class="token variable">@argu</span><span class="token punctuation">)</span><span class="token punctuation">;</span> <span class="token comment">// less的循环本质上是自递归调用</span>
<span class="token punctuation">}</span>

<span class="token comment">// 屏幕适配</span>
<span class="token selector">.LoopScreen(<span class="token variable">@a</span>, <span class="token variable">@b</span>, <span class="token variable">@c</span>, <span class="token variable">@d</span>, <span class="token variable">@e</span>, <span class="token variable">@f</span>, <span class="token variable">@g</span>, <span class="token variable">@h</span>, <span class="token variable">@i</span>, <span class="token variable">@j</span>, <span class="token variable">@k</span>, <span class="token variable">@l</span>, <span class="token variable">@m</span>, <span class="token variable">@n</span>, <span class="token variable">@o</span>, <span class="token variable">@p</span>, <span class="token variable">@q</span>, <span class="token variable">@r</span>)</span> <span class="token punctuation">{</span>
  <span class="token mixin-usage function">.LoopScreenArray</span><span class="token punctuation">(</span><span class="token function">length</span><span class="token punctuation">(</span><span class="token variable">@arguments</span><span class="token punctuation">)</span><span class="token punctuation">,</span> 1<span class="token punctuation">,</span> <span class="token variable">@arguments</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
<span class="token punctuation">}</span>

.<span class="token function">LoopScreen</span><span class="token punctuation">(</span>240px<span class="token punctuation">,</span> 320px<span class="token punctuation">,</span> 360px<span class="token punctuation">,</span> 375px<span class="token punctuation">,</span> 414px<span class="token punctuation">,</span> 480px<span class="token punctuation">,</span> 540px<span class="token punctuation">,</span> 600px<span class="token punctuation">,</span> 640px<span class="token punctuation">,</span> 667px<span class="token punctuation">,</span> 720px<span class="token punctuation">,</span> 750px<span class="token punctuation">,</span> 768px<span class="token punctuation">,</span> 800px<span class="token punctuation">,</span> 834px<span class="token punctuation">,</span> 1024px<span class="token punctuation">,</span> 1080px<span class="token punctuation">,</span> 1440px<span class="token punctuation">)</span><span class="token punctuation">;</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><ul><li>sass</li></ul><p>sass 中直接支持循环语句，分别是 for 循环和 while 循环</p><div class="language-scss line-numbers-mode" data-ext="scss"><pre class="language-scss"><code><span class="token selector">ul </span><span class="token punctuation">{</span>
  <span class="token selector">li </span><span class="token punctuation">{</span>
    <span class="token property">width</span><span class="token punctuation">:</span> 100%<span class="token punctuation">;</span>
    <span class="token property">height</span><span class="token punctuation">:</span> 50px<span class="token punctuation">;</span>
    <span class="token property">border</span><span class="token punctuation">:</span> 1px solid #000<span class="token punctuation">;</span>
    <span class="token property">font-size</span><span class="token punctuation">:</span> 20px<span class="token punctuation">;</span>
    <span class="token property">color</span><span class="token punctuation">:</span> #fff<span class="token punctuation">;</span>
    <span class="token property">background</span><span class="token punctuation">:</span> red<span class="token punctuation">;</span>
    <span class="token comment">// 5、6、7、8</span>
    <span class="token keyword">@for</span> <span class="token variable">$i</span> <span class="token keyword">from</span> 5 <span class="token keyword">through</span> <span class="token selector">8 </span><span class="token punctuation">{</span>
      &amp;<span class="token punctuation">:</span><span class="token function">nth-child</span><span class="token punctuation">(</span><span class="token variable">#{$i}</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
        <span class="token property">background</span><span class="token punctuation">:</span> deepskyblue<span class="token punctuation">;</span>
      <span class="token punctuation">}</span>
    <span class="token punctuation">}</span>
  <span class="token punctuation">}</span>
<span class="token punctuation">}</span>
<span class="token selector">ul </span><span class="token punctuation">{</span>
  <span class="token selector">li </span><span class="token punctuation">{</span>
    <span class="token property">width</span><span class="token punctuation">:</span> 100%<span class="token punctuation">;</span>
    <span class="token property">height</span><span class="token punctuation">:</span> 50px<span class="token punctuation">;</span>
    <span class="token property">border</span><span class="token punctuation">:</span> 1px solid #000<span class="token punctuation">;</span>
    <span class="token property">font-size</span><span class="token punctuation">:</span> 20px<span class="token punctuation">;</span>
    <span class="token property">color</span><span class="token punctuation">:</span> #fff<span class="token punctuation">;</span>
    <span class="token property">background</span><span class="token punctuation">:</span> red<span class="token punctuation">;</span>
    <span class="token comment">// 5、6、7</span>
    <span class="token keyword">@for</span> <span class="token variable">$i</span> <span class="token keyword">from</span> <span class="token selector">5 to 8 </span><span class="token punctuation">{</span>
      &amp;<span class="token punctuation">:</span><span class="token function">nth-child</span><span class="token punctuation">(</span><span class="token variable">#{$i}</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
        <span class="token property">background</span><span class="token punctuation">:</span> deepskyblue<span class="token punctuation">;</span>
      <span class="token punctuation">}</span>
    <span class="token punctuation">}</span>
  <span class="token punctuation">}</span>
<span class="token punctuation">}</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>两者的区别 through 包头包尾，to 包头不包尾</p><div class="language-scss line-numbers-mode" data-ext="scss"><pre class="language-scss"><code><span class="token selector">ul </span><span class="token punctuation">{</span>
  <span class="token selector">li </span><span class="token punctuation">{</span>
    <span class="token property">width</span><span class="token punctuation">:</span> 100%<span class="token punctuation">;</span>
    <span class="token property">height</span><span class="token punctuation">:</span> 50px<span class="token punctuation">;</span>
    <span class="token property">border</span><span class="token punctuation">:</span> 1px solid #000<span class="token punctuation">;</span>
    <span class="token property">font-size</span><span class="token punctuation">:</span> 20px<span class="token punctuation">;</span>
    <span class="token property">color</span><span class="token punctuation">:</span> #fff<span class="token punctuation">;</span>
    <span class="token property">background</span><span class="token punctuation">:</span> red<span class="token punctuation">;</span>
    <span class="token property"><span class="token variable">$i</span></span><span class="token punctuation">:</span> 5<span class="token punctuation">;</span>
    <span class="token keyword">@while</span> <span class="token punctuation">(</span><span class="token variable">$i</span> <span class="token operator">&lt;=</span> 8<span class="token punctuation">)</span> <span class="token punctuation">{</span>
      &amp;<span class="token punctuation">:</span><span class="token function">nth-child</span><span class="token punctuation">(</span><span class="token variable">#{$i}</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
        <span class="token property">background</span><span class="token punctuation">:</span> deepskyblue<span class="token punctuation">;</span>
      <span class="token punctuation">}</span>
      <span class="token property"><span class="token variable">$i</span></span><span class="token punctuation">:</span> <span class="token variable">$i</span> <span class="token operator">+</span> 1<span class="token punctuation">;</span>
    <span class="token punctuation">}</span>
  <span class="token punctuation">}</span>
<span class="token punctuation">}</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><ul><li>stylus</li></ul><p>stylus 允许通过 for/in 对表达式进行迭代形式如下</p><p><code> for &lt;val-name&gt; [, &lt;key-name&gt;] in &lt;expression&gt;</code></p><div class="language-stylus line-numbers-mode" data-ext="styl"><pre class="language-stylus"><code><span class="token statement"><span class="token keyword">for</span> num <span class="token operator">in</span> <span class="token punctuation">(</span><span class="token number">1</span><span class="token operator">..</span><span class="token number">10</span><span class="token punctuation">)</span></span>
  <span class="token selector">.box<span class="token interpolation variable"><span class="token delimiter punctuation">{</span>num<span class="token delimiter punctuation">}</span></span></span>
    <span class="token property-declaration"><span class="token property">animation</span><span class="token punctuation">:</span> box <span class="token operator">+</span> num <span class="token number">5</span><span class="token unit">s</span> infinite</span>

<span class="token atrule-declaration"><span class="token atrule">@keframes</span> box<span class="token interpolation variable"><span class="token delimiter punctuation">{</span>num<span class="token delimiter punctuation">}</span></span></span>
  <span class="token selector">0%   <span class="token punctuation">{</span> left: 0px <span class="token punctuation">}</span>
  100% <span class="token punctuation">{</span></span> <span class="token property-declaration"><span class="token property">left</span><span class="token punctuation">:</span> <span class="token punctuation">(</span>num <span class="token operator">*</span> <span class="token number">30</span><span class="token unit">px</span><span class="token punctuation">)</span> <span class="token punctuation">}</span></span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="模块化-import" tabindex="-1"><a class="header-anchor" href="#模块化-import" aria-hidden="true">#</a> 模块化 import</h3><p>模块化就是将 Css 代码分成一个个模块</p><p>sass、less、stylus 三者的使用方法都如下所示</p><div class="language-less line-numbers-mode" data-ext="less"><pre class="language-less"><code><span class="token variable">@import</span> <span class="token string">&quot;./common&quot;</span><span class="token punctuation">;</span>
<span class="token variable">@import</span> <span class="token string">&quot;./github-markdown&quot;</span><span class="token punctuation">;</span>
<span class="token variable">@import</span> <span class="token string">&quot;./mixin&quot;</span><span class="token punctuation">;</span>
<span class="token variable">@import</span> <span class="token string">&quot;./variables&quot;</span><span class="token punctuation">;</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div>`,110),l=[t];function c(i,o){return s(),a("div",null,l)}const d=n(e,[["render",c],["__file","预编译语言.html.vue"]]);export{d as default};
