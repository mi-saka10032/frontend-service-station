import{_ as a}from"./_plugin-vue_export-helper.cdc0426e.js";import{o as e,c as s,e as n}from"./app.1ace90a7.js";const p={},i=n(`<h2 id="浏览器私有前缀" tabindex="-1"><a class="header-anchor" href="#浏览器私有前缀" aria-hidden="true">#</a> 浏览器私有前缀</h2><p>浏览器私有前缀是为了兼容老版本的写法，比较新版本的浏览器无须添加。</p><ol><li><p>-moz-：代表 firefox 私有属性</p></li><li><p>-ms-：代表 ie 私有属性</p></li><li><p>-webkit-：代表 safari、chrome 私有属性</p></li><li><p>-o-：代表 Opera 私有属性</p></li></ol><p>示例：</p><div class="language-css line-numbers-mode" data-ext="css"><pre class="language-css"><code><span class="token property">-moz-border-radius</span><span class="token punctuation">:</span> 10px<span class="token punctuation">;</span>
<span class="token property">-ms-border-radius</span><span class="token punctuation">:</span> 10px<span class="token punctuation">;</span>
<span class="token property">-webkit-border-radius</span><span class="token punctuation">:</span> 10px<span class="token punctuation">;</span>
<span class="token property">-o-border-radius</span><span class="token punctuation">:</span> 10px<span class="token punctuation">;</span>
<span class="token property">border-radius</span><span class="token punctuation">:</span> 10px<span class="token punctuation">;</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h2 id="emmet-语法" tabindex="-1"><a class="header-anchor" href="#emmet-语法" aria-hidden="true">#</a> Emmet 语法</h2><p>Emmet 语法的前身是 Zen coding，使用缩写，提高 html/css 编写速度，Vscode 内部已集成语法。</p><h3 id="快速生成-html-结构语法" tabindex="-1"><a class="header-anchor" href="#快速生成-html-结构语法" aria-hidden="true">#</a> 快速生成 HTML 结构语法</h3><p>1.生成标签，直接输入标签名，按 tab 键。</p><p>2.生成多个标签，加上*，如 div*3。</p><p>3.如果有父子级关系的标签，可以用&gt; 比如 ul&gt;li。</p><p>4.如果有兄弟关系的标签，用 + 比如 div+p。</p><p>5.如果生成带有类名或者 id 名字的，直接写 .demo 或 <code>#two</code> tab 键。</p><p>6.如果生成的 div 类名是有顺序的，可以用自增符号$。</p><p>7.如果想要在生成的标签内部写内容可以用{}。</p><h3 id="快速生成-css-样式语法" tabindex="-1"><a class="header-anchor" href="#快速生成-css-样式语法" aria-hidden="true">#</a> 快速生成 CSS 样式语法</h3><p>CSS 基本采取简写形式。</p><ol><li><p>w200 按 tab 可生成 width: 200px;</p></li><li><p>lh26 按 tab 可生成 line-height: 26px;</p></li></ol><h3 id="快速格式化代码" tabindex="-1"><a class="header-anchor" href="#快速格式化代码" aria-hidden="true">#</a> 快速格式化代码</h3><p>格式化文档：Shift + Alt + F，对齐格式。</p><p>formatOnType:true</p><p>formatOnSave:true</p><p>设置一次即可，可自动保存格式化代码。</p><h2 id="chrome-调试工具" tabindex="-1"><a class="header-anchor" href="#chrome-调试工具" aria-hidden="true">#</a> Chrome 调试工具</h2><p>Chrome 浏览器提供了非常好用的调试工具，可以用来调试 HTML 结构和 CSS 样式。（按下 F12or 右击页面空白 → 检查）</p><ol><li><p>ctrl+滚轮可以放大开发者工具代码大小。</p></li><li><p>左边是 HTML 元素结构，右边是 CSS 样式。</p></li><li><p>右边 CSS 样式可以改动数值（左右箭头或者直接输入）和查看颜色。</p></li><li><p>ctrl+0 复原浏览器大小。</p></li><li><p>如果点击元素，发现右侧没有样式引入，极有可能是类名或者样式引入错误。</p></li><li><p>如果有样式，但是样式前面有黄色叹号提示，则是样式属性书写错误。</p></li></ol>`,26),t=[i];function r(l,o){return e(),s("div",null,t)}const h=a(p,[["render",r],["__file","浏览器与编译器.html.vue"]]);export{h as default};
