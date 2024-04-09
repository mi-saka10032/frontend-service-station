import{_ as n,Y as s,Z as a,a1 as p}from"./framework-bb209140.js";const t={},e=p(`<h2 id="enum" tabindex="-1"><a class="header-anchor" href="#enum" aria-hidden="true">#</a> enum</h2><p>枚举允许我们列举所有可能的值来定义一个类型</p><h3 id="定义" tabindex="-1"><a class="header-anchor" href="#定义" aria-hidden="true">#</a> 定义</h3><p>以 IP 地址为例，以下是枚举声明与枚举值获取</p><div class="language-rust line-numbers-mode" data-ext="rs"><pre class="language-rust"><code><span class="token keyword">enum</span> <span class="token type-definition class-name">IpAddrKind</span> <span class="token punctuation">{</span>
  <span class="token constant">V4</span><span class="token punctuation">,</span>
  <span class="token constant">V6</span>
<span class="token punctuation">}</span>

<span class="token keyword">fn</span> <span class="token function-definition function">main</span><span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
  <span class="token keyword">let</span> four <span class="token operator">=</span> <span class="token class-name">IpAddrKind</span><span class="token punctuation">::</span><span class="token constant">V4</span><span class="token punctuation">;</span>
  <span class="token keyword">let</span> six <span class="token operator">=</span> <span class="token class-name">IpAddrKind</span><span class="token punctuation">::</span><span class="token constant">V6</span><span class="token punctuation">;</span>

  <span class="token comment">// 以下写法均可行</span>
  <span class="token function">route</span><span class="token punctuation">(</span>four<span class="token punctuation">)</span><span class="token punctuation">;</span>
  <span class="token function">route</span><span class="token punctuation">(</span>six<span class="token punctuation">)</span><span class="token punctuation">;</span>
  <span class="token function">route</span><span class="token punctuation">(</span><span class="token class-name">IpAddrKind</span><span class="token punctuation">::</span><span class="token constant">V6</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
<span class="token punctuation">}</span>

<span class="token keyword">fn</span> <span class="token function-definition function">route</span><span class="token punctuation">(</span>ip_kind<span class="token punctuation">:</span> <span class="token class-name">IpAddrKind</span><span class="token punctuation">)</span> <span class="token punctuation">{</span><span class="token punctuation">}</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="数据附加" tabindex="-1"><a class="header-anchor" href="#数据附加" aria-hidden="true">#</a> 数据附加</h3><p>rust 支持将数据类型直接附加到枚举变体中</p><div class="language-rust line-numbers-mode" data-ext="rs"><pre class="language-rust"><code><span class="token keyword">enum</span> <span class="token type-definition class-name">IpAddr1</span> <span class="token punctuation">{</span>
  <span class="token constant">V4</span><span class="token punctuation">(</span><span class="token class-name">String</span><span class="token punctuation">)</span><span class="token punctuation">,</span>
  <span class="token constant">V6</span><span class="token punctuation">(</span><span class="token class-name">String</span><span class="token punctuation">)</span><span class="token punctuation">,</span>
<span class="token punctuation">}</span>

<span class="token keyword">enum</span> <span class="token type-definition class-name">IpAddr2</span> <span class="token punctuation">{</span>
  <span class="token constant">V4</span><span class="token punctuation">(</span><span class="token keyword">u8</span><span class="token punctuation">,</span> <span class="token keyword">u8</span><span class="token punctuation">,</span> <span class="token keyword">u8</span><span class="token punctuation">,</span> <span class="token keyword">u8</span><span class="token punctuation">)</span><span class="token punctuation">,</span>
  <span class="token constant">V6</span><span class="token punctuation">(</span><span class="token class-name">String</span><span class="token punctuation">)</span>
<span class="token punctuation">}</span>

<span class="token keyword">fn</span> <span class="token function-definition function">main</span><span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
  <span class="token keyword">let</span> home <span class="token operator">=</span> <span class="token class-name">IpAddr2</span><span class="token punctuation">::</span><span class="token constant">V4</span><span class="token punctuation">(</span><span class="token number">127</span><span class="token punctuation">,</span> <span class="token number">0</span><span class="token punctuation">,</span> <span class="token number">0</span><span class="token punctuation">,</span> <span class="token number">1</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
  <span class="token keyword">let</span> loopback <span class="token operator">=</span> <span class="token class-name">IpAddr2</span><span class="token punctuation">::</span><span class="token constant">V6</span><span class="token punctuation">(</span><span class="token class-name">String</span><span class="token punctuation">::</span><span class="token function">from</span><span class="token punctuation">(</span><span class="token string">&quot;::1&quot;</span><span class="token punctuation">)</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
<span class="token punctuation">}</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>该写法不需要额外使用 struct，并且每个变体可以拥有不同的类型以及关联的数据量</p><h3 id="定义方法" tabindex="-1"><a class="header-anchor" href="#定义方法" aria-hidden="true">#</a> 定义方法</h3><p>枚举可以视为和 struct 类似的结构体，同样支持通过 impl 块添加方法</p><div class="language-rust line-numbers-mode" data-ext="rs"><pre class="language-rust"><code><span class="token keyword">enum</span> <span class="token type-definition class-name">Message</span> <span class="token punctuation">{</span>
  <span class="token class-name">Quit</span><span class="token punctuation">,</span>
  <span class="token class-name">Move</span> <span class="token punctuation">{</span> x<span class="token punctuation">:</span> <span class="token keyword">i32</span><span class="token punctuation">,</span> y<span class="token punctuation">:</span> <span class="token keyword">i32</span> <span class="token punctuation">}</span><span class="token punctuation">,</span>
  <span class="token class-name">Write</span><span class="token punctuation">(</span><span class="token class-name">String</span><span class="token punctuation">)</span><span class="token punctuation">,</span>
  <span class="token class-name">ChangeColor</span><span class="token punctuation">(</span><span class="token keyword">i32</span><span class="token punctuation">,</span> <span class="token keyword">i32</span><span class="token punctuation">,</span> <span class="token keyword">i32</span><span class="token punctuation">)</span><span class="token punctuation">,</span>
<span class="token punctuation">}</span>

<span class="token keyword">impl</span> <span class="token class-name">Message</span> <span class="token punctuation">{</span>
  <span class="token keyword">fn</span> <span class="token function-definition function">call</span><span class="token punctuation">(</span><span class="token operator">&amp;</span><span class="token keyword">self</span><span class="token punctuation">)</span> <span class="token punctuation">{</span><span class="token punctuation">}</span>
<span class="token punctuation">}</span>

<span class="token keyword">fn</span> <span class="token function-definition function">main</span><span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
  <span class="token keyword">let</span> q <span class="token operator">=</span> <span class="token class-name">Message</span><span class="token punctuation">::</span><span class="token class-name">Quit</span><span class="token punctuation">;</span>
  <span class="token keyword">let</span> m <span class="token operator">=</span> <span class="token class-name">Message</span><span class="token punctuation">::</span><span class="token class-name">Move</span> <span class="token punctuation">{</span> x<span class="token punctuation">:</span> <span class="token number">12</span><span class="token punctuation">,</span> y<span class="token punctuation">:</span> <span class="token number">24</span> <span class="token punctuation">}</span><span class="token punctuation">;</span>
  <span class="token keyword">let</span> w <span class="token operator">=</span> <span class="token class-name">Message</span><span class="token punctuation">::</span><span class="token class-name">Write</span><span class="token punctuation">(</span><span class="token class-name">String</span><span class="token punctuation">::</span><span class="token function">from</span><span class="token punctuation">(</span><span class="token string">&quot;Hello&quot;</span><span class="token punctuation">)</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
  <span class="token keyword">let</span> c <span class="token operator">=</span> <span class="token class-name">Message</span><span class="token punctuation">::</span><span class="token class-name">ChangeColor</span><span class="token punctuation">(</span><span class="token number">0</span><span class="token punctuation">,</span> <span class="token number">255</span><span class="token punctuation">,</span> <span class="token number">255</span><span class="token punctuation">)</span><span class="token punctuation">;</span>

  <span class="token comment">// 正常运行无报错</span>
  m<span class="token punctuation">.</span><span class="token function">call</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
<span class="token punctuation">}</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h2 id="option" tabindex="-1"><a class="header-anchor" href="#option" aria-hidden="true">#</a> option</h2><h3 id="定义-1" tabindex="-1"><a class="header-anchor" href="#定义-1" aria-hidden="true">#</a> 定义</h3><ul><li>该枚举定义于标准库中</li><li>在 Prelude（预导入模块）中，<code>Option&lt;T&gt;</code>、<code>Some(T)</code>、<code>None</code>均可直接使用</li><li>描述了某个值可能存在（某种类型）或不存在的情况</li></ul><p>标准库中定义为：</p><div class="language-rust line-numbers-mode" data-ext="rs"><pre class="language-rust"><code><span class="token keyword">enum</span> <span class="token type-definition class-name">Options</span><span class="token operator">&lt;</span><span class="token class-name">T</span><span class="token operator">&gt;</span> <span class="token punctuation">{</span>
  <span class="token class-name">Some</span><span class="token operator">&lt;</span><span class="token class-name">T</span><span class="token operator">&gt;</span><span class="token punctuation">,</span>
  <span class="token class-name">None</span><span class="token punctuation">,</span>
<span class="token punctuation">}</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="null" tabindex="-1"><a class="header-anchor" href="#null" aria-hidden="true">#</a> Null</h3><p><strong>注意！！！Rust 没有 Null！！！</strong></p><p><code>Option&lt;T&gt;</code>是 rust 对于 Null 类似的概念</p><div class="language-rust line-numbers-mode" data-ext="rs"><pre class="language-rust"><code><span class="token keyword">fn</span> <span class="token function-definition function">main</span><span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
  <span class="token comment">// 有效的值</span>
  <span class="token keyword">let</span> some_number <span class="token operator">=</span> <span class="token class-name">Some</span><span class="token punctuation">(</span><span class="token number">5</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
  <span class="token keyword">let</span> some_string <span class="token operator">=</span> <span class="token class-name">Some</span><span class="token punctuation">(</span><span class="token string">&quot;A String&quot;</span><span class="token punctuation">)</span><span class="token punctuation">;</span>

  <span class="token comment">// 无效值None</span>
  <span class="token keyword">let</span> absent_number <span class="token operator">=</span> <span class="token class-name">Option</span><span class="token operator">&lt;</span><span class="token keyword">i32</span><span class="token operator">&gt;</span> <span class="token operator">=</span> <span class="token class-name">None</span><span class="token punctuation">;</span>
<span class="token punctuation">}</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="优势" tabindex="-1"><a class="header-anchor" href="#优势" aria-hidden="true">#</a> 优势</h3><p><code>Option&lt;T&gt;</code>比 Null 好在哪？</p><ul><li><code>Option&lt;T&gt;</code>和 T 是不同的类型，不可以把<code>Option&lt;T&gt;</code>直接当成 T</li></ul><div class="language-rust line-numbers-mode" data-ext="rs"><pre class="language-rust"><code><span class="token keyword">fn</span> <span class="token function-definition function">main</span><span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
  <span class="token keyword">let</span> x<span class="token punctuation">:</span> <span class="token keyword">i8</span> <span class="token operator">=</span> <span class="token number">5</span><span class="token punctuation">;</span>
  <span class="token keyword">let</span> y<span class="token punctuation">:</span> <span class="token class-name">Option</span><span class="token operator">&lt;</span><span class="token keyword">i8</span><span class="token operator">&gt;</span> <span class="token operator">-</span> <span class="token class-name">Some</span><span class="token punctuation">(</span><span class="token number">5</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
  <span class="token comment">// 禁止直接相加</span>
  <span class="token keyword">let</span> sum <span class="token operator">=</span> x <span class="token operator">+</span> y<span class="token punctuation">;</span>
<span class="token punctuation">}</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><ul><li>若想使用<code>Option&lt;T&gt;</code>中的 T，必须将它转换为正确的 T</li></ul><h2 id="控制流运算符" tabindex="-1"><a class="header-anchor" href="#控制流运算符" aria-hidden="true">#</a> 控制流运算符</h2><h3 id="定义-2" tabindex="-1"><a class="header-anchor" href="#定义-2" aria-hidden="true">#</a> 定义</h3><p>非常强大的控制流运算符 match</p><ul><li>允许一个值与一系列模式进行匹配，并执行匹配的模式对应的代码</li><li>模式可以是字面值、变量名、通配符...</li></ul><div class="language-rust line-numbers-mode" data-ext="rs"><pre class="language-rust"><code><span class="token keyword">enum</span> <span class="token type-definition class-name">Coin</span> <span class="token punctuation">{</span>
  <span class="token class-name">Penny</span><span class="token punctuation">,</span>
  <span class="token class-name">Nickel</span><span class="token punctuation">,</span>
  <span class="token class-name">Dime</span><span class="token punctuation">,</span>
  <span class="token class-name">Quarter</span><span class="token punctuation">,</span>
<span class="token punctuation">}</span>

<span class="token keyword">fn</span> <span class="token function-definition function">value_in_cents</span><span class="token punctuation">(</span>coin<span class="token punctuation">:</span> <span class="token class-name">Coin</span><span class="token punctuation">)</span> <span class="token punctuation">-&gt;</span> <span class="token keyword">u8</span> <span class="token punctuation">{</span>
  <span class="token keyword">match</span> coin <span class="token punctuation">{</span>
    <span class="token class-name">Coin</span><span class="token punctuation">::</span><span class="token class-name">Penny</span> <span class="token operator">=&gt;</span> <span class="token punctuation">{</span>
      <span class="token macro property">println!</span><span class="token punctuation">(</span><span class="token string">&quot;Penny!&quot;</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
      <span class="token number">1</span>
    <span class="token punctuation">}</span>
    <span class="token class-name">Coin</span><span class="token punctuation">::</span><span class="token class-name">Nickel</span> <span class="token operator">=&gt;</span> <span class="token number">5</span><span class="token punctuation">,</span>
    <span class="token class-name">Coin</span><span class="token punctuation">::</span><span class="token class-name">Dime</span> <span class="token operator">=&gt;</span> <span class="token number">10</span><span class="token punctuation">,</span>
    <span class="token class-name">Coin</span><span class="token punctuation">::</span><span class="token class-name">Quarter</span> <span class="token operator">=&gt;</span> <span class="token number">25</span><span class="token punctuation">,</span>
  <span class="token punctuation">}</span>
<span class="token punctuation">}</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="绑定值模式" tabindex="-1"><a class="header-anchor" href="#绑定值模式" aria-hidden="true">#</a> 绑定值模式</h3><p>借助 enum 和 match 模式，我们可以轻松将不同结构的 enum 组合进控制流中进行判断</p><div class="language-rust line-numbers-mode" data-ext="rs"><pre class="language-rust"><code><span class="token attribute attr-name">#[derive(Debug)]</span>
<span class="token keyword">enum</span> <span class="token type-definition class-name">UsState</span> <span class="token punctuation">{</span>
  <span class="token class-name">Alabama</span><span class="token punctuation">,</span>
  <span class="token class-name">Alaska</span>
<span class="token punctuation">}</span>

<span class="token keyword">enum</span> <span class="token type-definition class-name">Coin</span> <span class="token punctuation">{</span>
  <span class="token class-name">Penny</span><span class="token punctuation">,</span>
  <span class="token class-name">Nickel</span><span class="token punctuation">,</span>
  <span class="token class-name">Dime</span><span class="token punctuation">,</span>
  <span class="token class-name">Quarter</span><span class="token punctuation">(</span><span class="token class-name">UsState</span><span class="token punctuation">)</span><span class="token punctuation">,</span>
<span class="token punctuation">}</span>

<span class="token keyword">fn</span> <span class="token function-definition function">value_in_cents</span><span class="token punctuation">(</span>coin<span class="token punctuation">:</span> <span class="token class-name">Coin</span><span class="token punctuation">)</span> <span class="token punctuation">-&gt;</span> <span class="token keyword">u8</span> <span class="token punctuation">{</span>
  <span class="token keyword">match</span> coin <span class="token punctuation">{</span>
    <span class="token class-name">Coin</span><span class="token punctuation">::</span><span class="token class-name">Penny</span> <span class="token operator">=&gt;</span> <span class="token punctuation">{</span>
      <span class="token macro property">println!</span><span class="token punctuation">(</span><span class="token string">&quot;Penny!&quot;</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
      <span class="token number">1</span>
    <span class="token punctuation">}</span>
    <span class="token class-name">Coin</span><span class="token punctuation">::</span><span class="token class-name">Nickel</span> <span class="token operator">=&gt;</span> <span class="token number">5</span><span class="token punctuation">,</span>
    <span class="token class-name">Coin</span><span class="token punctuation">::</span><span class="token class-name">Dime</span> <span class="token operator">=&gt;</span> <span class="token number">10</span><span class="token punctuation">,</span>
    <span class="token class-name">Coin</span><span class="token punctuation">::</span><span class="token class-name">Quarter</span><span class="token punctuation">(</span>state<span class="token punctuation">)</span> <span class="token operator">=&gt;</span> <span class="token punctuation">{</span>
      <span class="token macro property">println!</span><span class="token punctuation">(</span><span class="token string">&quot;State quarter from {:?}&quot;</span><span class="token punctuation">,</span> state<span class="token punctuation">)</span><span class="token punctuation">;</span>
      <span class="token number">25</span>
    <span class="token punctuation">}</span>
  <span class="token punctuation">}</span>
<span class="token punctuation">}</span>

<span class="token keyword">fn</span> <span class="token function-definition function">main</span><span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
  <span class="token keyword">let</span> c <span class="token operator">=</span> <span class="token class-name">Coin</span><span class="token punctuation">::</span><span class="token class-name">Quarter</span><span class="token punctuation">(</span><span class="token class-name">UsState</span><span class="token punctuation">::</span><span class="token class-name">Alaska</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
  <span class="token macro property">println!</span><span class="token punctuation">(</span><span class="token string">&quot;{}&quot;</span><span class="token punctuation">,</span> <span class="token function">value_in_cents</span><span class="token punctuation">(</span>c<span class="token punctuation">)</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
<span class="token punctuation">}</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="匹配option-t" tabindex="-1"><a class="header-anchor" href="#匹配option-t" aria-hidden="true">#</a> 匹配<code>Option&lt;T&gt;</code></h3><p>match 匹配 Option 时必须满足 Some 和 None 的双边判断</p><div class="language-rust line-numbers-mode" data-ext="rs"><pre class="language-rust"><code><span class="token keyword">fn</span> <span class="token function-definition function">main</span><span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
  <span class="token keyword">let</span> five <span class="token operator">=</span> <span class="token class-name">Some</span><span class="token punctuation">(</span><span class="token number">5</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
  <span class="token keyword">let</span> six <span class="token operator">=</span> <span class="token function">plus_one</span><span class="token punctuation">(</span>five<span class="token punctuation">)</span><span class="token punctuation">;</span>
  <span class="token keyword">let</span> none <span class="token operator">=</span> <span class="token function">plus_one</span><span class="token punctuation">(</span><span class="token class-name">None</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
<span class="token punctuation">}</span>

<span class="token keyword">fn</span> <span class="token function-definition function">plus_one</span><span class="token punctuation">(</span>x<span class="token punctuation">:</span> <span class="token class-name">Option</span><span class="token operator">&lt;</span><span class="token keyword">i32</span><span class="token operator">&gt;</span><span class="token punctuation">)</span> <span class="token punctuation">-&gt;</span> <span class="token class-name">Option</span><span class="token operator">&lt;</span><span class="token keyword">i32</span><span class="token operator">&gt;</span> <span class="token punctuation">{</span>
  <span class="token keyword">match</span> x <span class="token punctuation">{</span>
    <span class="token class-name">None</span> <span class="token operator">=&gt;</span> <span class="token class-name">None</span><span class="token punctuation">,</span>
    <span class="token class-name">Some</span><span class="token punctuation">(</span>i<span class="token punctuation">)</span> <span class="token operator">=&gt;</span> <span class="token class-name">Some</span><span class="token punctuation">(</span>i <span class="token operator">+</span> <span class="token number">1</span><span class="token punctuation">)</span><span class="token punctuation">,</span>
  <span class="token punctuation">}</span>
<span class="token punctuation">}</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="default" tabindex="-1"><a class="header-anchor" href="#default" aria-hidden="true">#</a> default</h3><p>match 匹配必须穷举所有的可能</p><p>而<code>_</code>通配符来表示默认的其他没列举出的值</p><div class="language-rust line-numbers-mode" data-ext="rs"><pre class="language-rust"><code><span class="token keyword">fn</span> <span class="token function-definition function">main</span><span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
  <span class="token keyword">let</span> v <span class="token operator">=</span> <span class="token number">0u8</span><span class="token punctuation">;</span>
  <span class="token keyword">match</span> v <span class="token punctuation">{</span>
    <span class="token number">1</span> <span class="token operator">=&gt;</span> <span class="token macro property">println!</span><span class="token punctuation">(</span><span class="token string">&quot;one&quot;</span><span class="token punctuation">)</span><span class="token punctuation">,</span>
    <span class="token number">3</span> <span class="token operator">=&gt;</span> <span class="token macro property">println!</span><span class="token punctuation">(</span><span class="token string">&quot;three&quot;</span><span class="token punctuation">)</span><span class="token punctuation">,</span>
    <span class="token number">5</span> <span class="token operator">=&gt;</span> <span class="token macro property">println!</span><span class="token punctuation">(</span><span class="token string">&quot;five&quot;</span><span class="token punctuation">)</span><span class="token punctuation">,</span>
    <span class="token number">7</span> <span class="token operator">=&gt;</span> <span class="token macro property">println!</span><span class="token punctuation">(</span><span class="token string">&quot;seven&quot;</span><span class="token punctuation">)</span><span class="token punctuation">,</span>
    _ <span class="token operator">=&gt;</span> <span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">,</span>
  <span class="token punctuation">}</span>
<span class="token punctuation">}</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p><code>_</code>通配符必须放在 match 的最下面，如果不希望输出任何内容，则以<code>_ =&gt; ()</code>返回空元组的形式表示无事发生</p><h2 id="if-let" tabindex="-1"><a class="header-anchor" href="#if-let" aria-hidden="true">#</a> if/let</h2><p>if/let 关键字用于处理只关心一种匹配而忽略其它匹配的情况</p><p>特点：</p><ul><li>更少的代码，更少的缩进，更少的样板代码</li><li>放弃了穷举的可能</li><li>可以把 if/let 看作是 match 的语法糖</li><li>同样可搭配 else</li></ul><div class="language-rust line-numbers-mode" data-ext="rs"><pre class="language-rust"><code><span class="token keyword">fn</span> <span class="token function-definition function">main</span><span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
  <span class="token keyword">let</span> v <span class="token operator">=</span> <span class="token class-name">Some</span><span class="token punctuation">(</span><span class="token number">0u8</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
  <span class="token comment">// 以下两种写法效果相同</span>
  <span class="token keyword">match</span> v <span class="token punctuation">{</span>
    <span class="token class-name">Some</span><span class="token punctuation">(</span><span class="token number">3</span><span class="token punctuation">)</span> <span class="token operator">=&gt;</span> <span class="token macro property">println!</span><span class="token punctuation">(</span><span class="token string">&quot;three&quot;</span><span class="token punctuation">)</span><span class="token punctuation">,</span>
    _ <span class="token operator">=&gt;</span> <span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">,</span>
  <span class="token punctuation">}</span>

  <span class="token keyword">if</span> <span class="token keyword">let</span> <span class="token class-name">Some</span><span class="token punctuation">(</span><span class="token number">3</span><span class="token punctuation">)</span> <span class="token operator">=</span> v <span class="token punctuation">{</span>
    <span class="token macro property">println!</span><span class="token punctuation">(</span><span class="token string">&quot;three&quot;</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
  <span class="token punctuation">}</span> <span class="token keyword">else</span> <span class="token punctuation">{</span>
    <span class="token macro property">println!</span><span class="token punctuation">(</span><span class="token string">&quot;others&quot;</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
  <span class="token punctuation">}</span>
<span class="token punctuation">}</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div>`,47),o=[e];function c(l,i){return s(),a("div",null,o)}const k=n(t,[["render",c],["__file","4-enum.html.vue"]]);export{k as default};
