import{_ as s}from"./_plugin-vue_export-helper.cdc0426e.js";import{o as l,c as r,b as e,e as a,d,a as i,r as p}from"./app.57c4b210.js";const o={},t=i('<p><strong>项目配置文件</strong></p><p>配置文件会记录着你项目的名称、版本号、项目描述等；</p><p>也会记录着你项目所依赖的其他库的信息和依赖库的版本号；</p><p>这个配置文件在 Node 环境下面（无论是前端还是后端）就是 package.json</p><h2 id="常见属性" tabindex="-1"><a class="header-anchor" href="#常见属性" aria-hidden="true">#</a> 常见属性</h2><h3 id="必填属性-name-version" tabindex="-1"><a class="header-anchor" href="#必填属性-name-version" aria-hidden="true">#</a> 必填属性:name version</h3><p>name 是项目的名称</p><p>version 是当前项目的版本号</p><p>description 是描述信息，很多时候是作为项目的基本描述</p><p>author 是作者相关信息（发布时用到）</p><p>license 是开源协议（发布时用到）</p><h3 id="private" tabindex="-1"><a class="header-anchor" href="#private" aria-hidden="true">#</a> private</h3><p>private 属性记录当前的项目是否是私有的</p><p>当值为 true 时，npm 是不能发布它的，这是防止私有项目或模块发布出去的方式</p><h3 id="main" tabindex="-1"><a class="header-anchor" href="#main" aria-hidden="true">#</a> main</h3><p>设置程序的入口</p><ul><li><p>这个入口和 webpack 打包的入口并不冲突;</p></li><li><p>它是在你发布一个模块的时候会用到的;</p></li><li><p>比如我们使用 axios 模块 const axios = require(&#39;axios&#39;)，实际上是找到对应的 main 属性查找文件的；</p></li></ul><h3 id="scripts" tabindex="-1"><a class="header-anchor" href="#scripts" aria-hidden="true">#</a> scripts</h3><p>scripts 属性用于配置一些脚本命令，以键值对的形式存在</p><p>配置后我们可以通过 npm run 命令的 key 来执行这个命令</p><p>npm start 和 npm run start 的区别是什么：</p><p>它们是等价的；对于常用的 start、 test、stop、restart 可以省略掉 run 直接通过 npm start 等方式运行。</p><h3 id="dependencies" tabindex="-1"><a class="header-anchor" href="#dependencies" aria-hidden="true">#</a> dependencies</h3><p>dependencies 属性是指定无论<strong>开发环境</strong>还是<strong>生产环境</strong>都需要依赖的包</p><p>通常是我们项目实际开发用到的一些库模块</p><p>与之对应的是 devDependencies</p><h3 id="devdependencies" tabindex="-1"><a class="header-anchor" href="#devdependencies" aria-hidden="true">#</a> devDependencies</h3><p>一些包在生成环境是不需要的，比如 webpack、babel 等；</p><p>这个时候我们会通过 npm install webpack --save-dev，将它安装到 devDependencies 属性中；</p><p><strong>生产环境</strong>不需要安装时，我们需要通过 npm install --production 来安装文件的依赖</p><h2 id="版本管理属性" tabindex="-1"><a class="header-anchor" href="#版本管理属性" aria-hidden="true">#</a> 版本管理属性</h2><h3 id="版本规范" tabindex="-1"><a class="header-anchor" href="#版本规范" aria-hidden="true">#</a> 版本规范</h3><p>npm 的包通常需要遵从 semver 版本规范</p>',33),c={href:"https://semver.org/lang/zh-CN/",target:"_blank",rel:"noopener noreferrer"},u={href:"https://docs.npmjs.com/misc/semver",target:"_blank",rel:"noopener noreferrer"},m=i('<p>semver 的版本规范是 X.Y.Z</p><p>X 主版本号（major）：当你做了不兼容的 API 修改（可能不兼容之前的版本）</p><p>Y 次版本号（minor）：当你做了向下兼容的功能性新增（新功能增加，但是兼容之前的版本）</p><p>Z 修订号（patch）：当你做了向下兼容的问题修正（没有新功能，修复了之前版本的 bug）</p><h3 id="和-的区别" tabindex="-1"><a class="header-anchor" href="#和-的区别" aria-hidden="true">#</a> ^和~的区别</h3><p>^x.y.z：表示 x 是保持不变的，y 和 z 永远安装最新的版本；</p><p>~x.y.z：表示 x 和 y 保持不变的，z 永远安装最新的版本；</p><h3 id="engines" tabindex="-1"><a class="header-anchor" href="#engines" aria-hidden="true">#</a> engines</h3><p>engines 属性用于指定 Node 和 NPM 的版本号；</p><p>安装的过程中，会先检查对应的引擎版本，如果不符合就会报错</p><p>事实上也可以指定所在的操作系统 &quot;os&quot; : [ &quot;darwin&quot;, &quot;linux&quot; ]，只是很少用到</p><h3 id="browserlist" tabindex="-1"><a class="header-anchor" href="#browserlist" aria-hidden="true">#</a> browserlist</h3><p>用于配置打包后的 JavaScript 浏览器的兼容情况，参考</p><p>否则我们需要手动的添加 polyfills 来让支持某些语法</p><p>它是为 webpack 等打包工具服务的一个属性</p><h2 id="项目安装" tabindex="-1"><a class="header-anchor" href="#项目安装" aria-hidden="true">#</a> 项目安装</h2><h3 id="npm-install" tabindex="-1"><a class="header-anchor" href="#npm-install" aria-hidden="true">#</a> npm install</h3><p>全局安装： npm install yarn -g</p><p>项目局部安装：npm install</p><p>全局安装通常都是一些工具包：yarn webpack 等</p><p>全局安装了之后并不能让我们在所有的项目中使用 axios 等库</p><p>项目安装会在当前目录下生产一个 node_modules 文件夹，我们之前讲解 require 查找顺序时有讲解过这个包在什 么情况下被查找</p><p>局部安装分为开发时依赖和生产时依赖：</p><p>安装开发和生产依赖</p><p>npm i axios</p><p>开发依赖</p><p>npm install webpack --save-dev</p><p>npm i webpack –D</p><p>根据 package.json 中的依赖包</p><p>npm install</p><h3 id="安装原理" tabindex="-1"><a class="header-anchor" href="#安装原理" aria-hidden="true">#</a> 安装原理</h3><p><img src="https://misaka10032.oss-cn-chengdu.aliyuncs.com/Node/04-包管理工具/image-20211012153010790.png" alt="安装原理" loading="lazy"></p><p>原理图解析：</p><ol><li>没有 lock 文件</li></ol><p>分析依赖关系，这是因为我们可能包会依赖其他的包，并且多个包之间会产生相同依赖的情况</p><p>从 registry 仓库中下载压缩包（如果我们设置了镜像，那么会从镜像服务器下载压缩包）</p><p>获取到压缩包后会对压缩包进行缓存（从 npm5 开始有的）</p><p>将压缩包解压到项目的 node_modules 文件夹中（前面我们讲过，require 的查找顺序会在该包下面查找）</p><ol start="2"><li>有 lock 文件</li></ol><p>检测 lock 中包的版本是否和 package.json 中一致（会按照 semver 版本规范检测）</p><p>​ 不一致，那么会重新构建依赖关系，直接会走顶层的流程</p><p>一致的情况下，会去优先查找缓存</p><p>​ 没有找到，会从 registry 仓库下载，直接走顶层流程</p><p>查找到，会获取缓存中的压缩文件，并且将压缩文件解压到 node_modules 文件夹中</p><h3 id="package-lock-json" tabindex="-1"><a class="header-anchor" href="#package-lock-json" aria-hidden="true">#</a> package-lock.json</h3><p><img src="https://misaka10032.oss-cn-chengdu.aliyuncs.com/Node/04-包管理工具/image-20211012153230902.png" alt="package-lock文件分析" loading="lazy"></p><h2 id="npm-其他命令" tabindex="-1"><a class="header-anchor" href="#npm-其他命令" aria-hidden="true">#</a> npm 其他命令</h2><h3 id="卸载某依赖包" tabindex="-1"><a class="header-anchor" href="#卸载某依赖包" aria-hidden="true">#</a> 卸载某依赖包</h3><p><code>npm uninstall package</code></p><p><code>npm uninstall package --save-dev</code></p><p><code>npm uninstall package -D</code></p><h3 id="强制重新-build" tabindex="-1"><a class="header-anchor" href="#强制重新-build" aria-hidden="true">#</a> 强制重新 build</h3><p><code>npm rebuild</code></p><h3 id="清除缓存" tabindex="-1"><a class="header-anchor" href="#清除缓存" aria-hidden="true">#</a> 清除缓存</h3><p><code>npm cache clean</code></p><p>更多查阅官方文档</p>',56),v={href:"https://docs.npmjs.com/cli-documentation/cli",target:"_blank",rel:"noopener noreferrer"},b=i(`<h2 id="cnpm" tabindex="-1"><a class="header-anchor" href="#cnpm" aria-hidden="true">#</a> cnpm</h2><p><img src="https://misaka10032.oss-cn-chengdu.aliyuncs.com/Node/04-包管理工具/image-20211012161131392.png" alt="cnpm" loading="lazy"></p><h2 id="npx" tabindex="-1"><a class="header-anchor" href="#npx" aria-hidden="true">#</a> npx</h2><p>npx 是 npm5.2 之后自带的一个命令。</p><p>npx 作用非常多，但是比较常见的是使用它来解决局部命令执行，调用项目中的某个模块的指令。</p><p>使用项目局部 webpack，常见的是两种方式</p><p>方法一：明确查找到 node_module 下面的 webpack</p><div class="language-bash line-numbers-mode" data-ext="sh"><pre class="language-bash"><code><span class="token comment"># 在终端中使用如下命令（项目根目录下）</span>
./node_modules/.bin/webpack <span class="token parameter variable">--version</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div></div></div><p>方法二：在 scripts 定义脚本，执行 webpack</p><div class="language-json line-numbers-mode" data-ext="json"><pre class="language-json"><code><span class="token comment">// 修改package.json中的scripts</span>
<span class="token property">&quot;scripts&quot;</span><span class="token operator">:</span> <span class="token punctuation">{</span>
  <span class="token property">&quot;webpack&quot;</span><span class="token operator">:</span> <span class="token string">&quot;webpack --version&quot;</span>
<span class="token punctuation">}</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>方法三：使用 npx</p><div class="language-bash line-numbers-mode" data-ext="sh"><pre class="language-bash"><code>npx webpack <span class="token parameter variable">--version</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div></div></div><p>npx 的原理非常简单，它会到当前目录的 node_modules/.bin 目录下查找对应的命令</p><h2 id="yarn" tabindex="-1"><a class="header-anchor" href="#yarn" aria-hidden="true">#</a> yarn</h2><p>另一个 node 包管理工具 yarn</p><p>yarn 是由 Facebook、Google、Exponent 和 Tilde 联合推出了一个新的 JS 包管理工具</p><p>yarn 是为了弥补 npm 的一些缺陷而出现的</p><p>早期的 npm 存在很多的缺陷，比如安装依赖速度很慢、版本依赖混乱等等一系列的问题</p><p><img src="https://misaka10032.oss-cn-chengdu.aliyuncs.com/Node/04-包管理工具/image-20211012153802354.png" alt="命令对比" loading="lazy"></p><h2 id="pnpm" tabindex="-1"><a class="header-anchor" href="#pnpm" aria-hidden="true">#</a> pnpm</h2><p>pnpm 是最新的、快速的、节省磁盘空间的包管理工具。</p><h3 id="特点" tabindex="-1"><a class="header-anchor" href="#特点" aria-hidden="true">#</a> 特点</h3><p>1、快速 pnpm比其他包管理器快2倍。</p><p>2、高效 node_modules 中的文件为复制或链接自特定的内容寻址存储库。</p><p>3、支持monorepos pnpm内置支持单仓多包。</p><p>4、严格 pnpm 默认创建了一个非平铺的 node_modules，因此代码无法访问任意包。</p><h3 id="pnpm做了什么" tabindex="-1"><a class="header-anchor" href="#pnpm做了什么" aria-hidden="true">#</a> pnpm做了什么</h3><p>1、当使用npm或yarn时，如果你有100个项目，并且所有项目都有一个相同的依赖包，那么，你在硬盘上就需要保存100份该相同依赖包的副本。 2、如果是使用pnpm,依赖包将被存放在一个统一的位置，因此：</p><ul><li><p>如果你对同一依赖包使用相同的版本，那么磁盘上只有这个依赖包的一份文件；</p></li><li><p>如果你对同一依赖包需要使用不同的版本，则仅有版本之间不同的文件会被存储起来；</p></li><li><p>所有文件都保存在硬盘的统一的位置：</p></li><li><p>当安装软件包时，其包含的所有文件都会硬链接到此位置，而不会占用而外的硬盘空间；</p></li><li><p>这让你可以在项目之间方便地共享相同版本的依赖包。</p></li></ul><h3 id="node-modules目录创建" tabindex="-1"><a class="header-anchor" href="#node-modules目录创建" aria-hidden="true">#</a> node_modules目录创建</h3><p>1、npm和yarn</p><ul><li><p>当使用npm或yarn安装依赖包时，所以软件包都被提升到node_modules的根目录下；</p></li><li><p>其结果是，源码可以访问本不属于当前项目所设定的依赖包。</p></li></ul><p>2、pnpm</p><ul><li><p>使用pnpm安装依赖包时，只有安装的那个包会在node_modules的根目录下，并且以软链接(符号链接)的方式存在；</p></li><li><p>在node_modules的根目录下同时还会有一个.pnpm文件，里面保存的是所有包的硬链接；</p></li><li><p>其结果是，源码不可以访问本不属于当前项目所设定的依赖包。</p></li></ul><h3 id="命令对比" tabindex="-1"><a class="header-anchor" href="#命令对比" aria-hidden="true">#</a> 命令对比</h3><table><thead><tr><th style="text-align:left;">npm命令</th><th style="text-align:left;">pnpm等价命令</th></tr></thead><tbody><tr><td style="text-align:left;">npm install</td><td style="text-align:left;">pnpm install</td></tr><tr><td style="text-align:left;">npm install 包名</td><td style="text-align:left;">pnpm add 包名</td></tr><tr><td style="text-align:left;">npm uninstall 包名</td><td style="text-align:left;">pnpm remove 包名</td></tr><tr><td style="text-align:left;">npm run 脚本</td><td style="text-align:left;">pnpm 脚本</td></tr></tbody></table><h3 id="常用仓库命令" tabindex="-1"><a class="header-anchor" href="#常用仓库命令" aria-hidden="true">#</a> 常用仓库命令</h3><div class="language-bash line-numbers-mode" data-ext="sh"><pre class="language-bash"><code><span class="token function">pnpm</span> store path  // 获取包仓库地址（pnpm的仓库不能跨磁盘）
<span class="token function">pnpm</span> store prune  // 从store中删除当前未被引用的包来释放store的空间
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="软链接与硬链接-操作系统" tabindex="-1"><a class="header-anchor" href="#软链接与硬链接-操作系统" aria-hidden="true">#</a> 软链接与硬链接（操作系统）</h3><p>本章节只介绍在没有包有 peer 依赖的情况下 pnpm 的 node_modules 是如何被构建的。</p><p>pnpm 的 node_modules 布局使用符号链接来创建依赖项的嵌套结构。</p><h4 id="_1-依赖安装" tabindex="-1"><a class="header-anchor" href="#_1-依赖安装" aria-hidden="true">#</a> 1.依赖安装</h4><p>node_modules 中每个包的每个文件都是来自内容可寻址存储的硬链接。 假设您安装了依赖于 bar@1.0.0 的 foo@1.0.0。 pnpm 会将两个包硬链接到 node_modules 如下所示：</p><div class="language-text line-numbers-mode" data-ext="text"><pre class="language-text"><code>node_modules
└── .pnpm
    ├── bar@1.0.0
    │   └── node_modules
    │       └── bar -&gt; &lt;store&gt;/bar
    │           ├── index.js
    │           └── package.json
    └── foo@1.0.0
        └── node_modules
            └── foo -&gt; &lt;store&gt;/foo
                ├── index.js
                └── package.json
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>这是 node_modules 中的唯一的“真实”文件。 一旦所有包都硬链接到 node_modules，就会创建符号链接来构建嵌套的依赖关系图结构。</p><p>您可能已经注意到，这两个包都硬链接到一个 node_modules 文件夹（foo@1.0.0/node_modules/foo）内的子文件夹中。这是必要的：</p><ol><li><p>允许包自行导入自己。 foo 应该能够 require(&#39;foo/package.json&#39;) 或者 import * as package from &quot;foo/package.json&quot;。</p></li><li><p>避免循环符号链接。 依赖以及需要依赖的包被放置在一个文件夹下。 对于 Node.js 来说，依赖是在包的内部 node_modules 中或在任何其它在父目录 node_modules 中是没有区别的。</p></li></ol><h4 id="_2-依赖链接" tabindex="-1"><a class="header-anchor" href="#_2-依赖链接" aria-hidden="true">#</a> 2.依赖链接</h4><p>安装的下一阶段是符号链接依赖项。 bar 将被符号链接到 foo@1.0.0/node_modules 文件夹：</p><div class="language-text line-numbers-mode" data-ext="text"><pre class="language-text"><code>node_modules
└── .pnpm
    ├── bar@1.0.0
    │   └── node_modules
    │       └── bar -&gt; &lt;store&gt;/bar
    └── foo@1.0.0
        └── node_modules
            ├── foo -&gt; &lt;store&gt;/foo
            └── bar -&gt; ../../bar@1.0.0/node_modules/bar
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h4 id="_3-依赖关系处理" tabindex="-1"><a class="header-anchor" href="#_3-依赖关系处理" aria-hidden="true">#</a> 3.依赖关系处理</h4><p>接下来，处理直接依赖关系。 foo 将被符号链接至根目录的 node_modules 文件夹，因为 foo 是项目的依赖项：</p><div class="language-text line-numbers-mode" data-ext="text"><pre class="language-text"><code>node_modules
├── foo -&gt; ./.pnpm/foo@1.0.0/node_modules/foo
└── .pnpm
    ├── bar@1.0.0
    │   └── node_modules
    │       └── bar -&gt; &lt;store&gt;/bar
    └── foo@1.0.0
        └── node_modules
            ├── foo -&gt; &lt;store&gt;/foo
            └── bar -&gt; ../../bar@1.0.0/node_modules/bar
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>这是一个非常简单的例子。 但是，无论依赖项的数量和依赖关系图的深度如何，布局都会保持这种结构。</p><p>让我们添加 qar@2.0.0 作为 bar 和 foo 的依赖项。 这是新的结构的样子：</p><div class="language-text line-numbers-mode" data-ext="text"><pre class="language-text"><code>node_modules
├── foo -&gt; ./.pnpm/foo@1.0.0/node_modules/foo
└── .pnpm
    ├── bar@1.0.0
    │   └── node_modules
    │       ├── bar -&gt; &lt;store&gt;/bar
    │       └── qar -&gt; ../../qar@2.0.0/node_modules/qar
    ├── foo@1.0.0
    │   └── node_modules
    │       ├── foo -&gt; &lt;store&gt;/foo
    │       ├── bar -&gt; ../../bar@1.0.0/node_modules/bar
    │       └── qar -&gt; ../../qar@2.0.0/node_modules/qar
    └── qar@2.0.0
        └── node_modules
            └── qar -&gt; &lt;store&gt;/qar
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>如您所见，即使图形现在更深（foo &gt; bar &gt; qar），但目录深度仍然相同。</p><p>这种布局乍一看可能很奇怪，但它与 Node 的模块解析算法完全兼容！ 解析模块时，Node 会忽略符号链接，因此当 foo@1.0.0/node_modules/foo/index.js 需要 bar 时，Node 不会使用在 foo@1.0.0/node_modules/bar 的 bar，相反，bar 是被解析到其实际位置（bar@1.0.0/node_modules/bar）。 因此，bar 也可以解析其在 bar@1.0.0/node_modules 中的依赖项。</p><p>这种布局的一大好处是只有真正在依赖项中的包才能访问。 使用平铺的 node_modules 结构，所有被提升的包都可以访问。</p><h3 id="peers的处理方案" tabindex="-1"><a class="header-anchor" href="#peers的处理方案" aria-hidden="true">#</a> peers的处理方案</h3><p>pnpm 的最佳特征之一是，在一个项目中，package的一个特定版本将始终只有一组依赖项。 这个规则有一个例外 -那就是具有弱依赖 peer dependencies 的package。</p><p>peer 依赖项（peer dependencies）会从依赖图中更高的已安装的依赖项中解析（resolve），因为它们与父级共享相同的版本。 这意味着，如果 foo@1.0.0 有两个peers依赖（bar@^1 和 baz@^1），那么它可能在一个项目中有多个不同的依赖项集合。</p><div class="language-text line-numbers-mode" data-ext="text"><pre class="language-text"><code>- foo-parent-1
  - bar@1.0.0
  - baz@1.0.0
  - foo@1.0.0
- foo-parent-2
  - bar@1.0.0
  - baz@1.1.0
  - foo@1.0.0
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>在上面的示例中， foo@1.0.0 已安装在 foo-parent-1 和 foo-parent-2 中。 Both packages have bar and baz as well, but they depend on different versions of baz. 因此， foo@1.0.0 有两组不同的依赖项：一组具有 baz@1.0.0 ，另一组具有 baz@1.1.0。 若要支持这些用例，pnpm 必须有几组不同的依赖项，就去硬链接几次 foo@1.0.0。</p><p>通常，如果一个package没有 peer 依赖项（peer dependencies），它会被硬链接到其依赖项的软连接（symlinks）旁的 node_modules，就像这样：</p><div class="language-text line-numbers-mode" data-ext="text"><pre class="language-text"><code>node_modules
└── .pnpm
    ├── foo@1.0.0
    │   └── node_modules
    │       ├── foo
    │       ├── qux   -&gt; ../../qux@1.0.0/node_modules/qux
    │       └── plugh -&gt; ../../plugh@1.0.0/node_modules/plugh
    ├── qux@1.0.0
    ├── plugh@1.0.0
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>但是，如果 foo 有 peer 依赖（peer dependencies），那么它可能就会有多组依赖项，所以我们为不同的 peer 依赖项创建不同的解析：</p><div class="language-text line-numbers-mode" data-ext="text"><pre class="language-text"><code>node_modules
└── .pnpm
    ├── foo@1.0.0_bar@1.0.0+baz@1.0.0
    │   └── node_modules
    │       ├── foo
    │       ├── bar   -&gt; ../../bar@1.0.0/node_modules/bar
    │       ├── baz   -&gt; ../../baz@1.0.0/node_modules/baz
    │       ├── qux   -&gt; ../../qux@1.0.0/node_modules/qux
    │       └── plugh -&gt; ../../plugh@1.0.0/node_modules/plugh
    ├── foo@1.0.0_bar@1.0.0+baz@1.1.0
    │   └── node_modules
    │       ├── foo
    │       ├── bar   -&gt; ../../bar@1.0.0/node_modules/bar
    │       ├── baz   -&gt; ../../baz@1.1.0/node_modules/baz
    │       ├── qux   -&gt; ../../qux@1.0.0/node_modules/qux
    │       └── plugh -&gt; ../../plugh@1.0.0/node_modules/plugh
    ├── bar@1.0.0
    ├── baz@1.0.0
    ├── baz@1.1.0
    ├── qux@1.0.0
    ├── plugh@1.0.0
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>我们创建 foo@1.0.0_bar@1.0.0+baz@1.0.0 或foo@1.0.0_bar@1.0.0+baz@1.1.0内到foo的软链接。 因此，Node.js 模块解析器将找到正确的 peers。</p><p>如果一个package没有 peer 依赖（peer dependencies），不过它的依赖项有 peer 依赖，这些依赖会在更高的依赖图中解析, 则这个传递package便可在项目中有几组不同的依赖项。 例如，a@1.0.0 具有单个依赖项 b@1.0.0。 b@1.0.0 有一个 peer 依赖为 c@^1。 a@1.0.0 永远不会解析b@1.0.0的 peer, 所以它也会依赖于 b@1.0.0 的 peer 。</p><p>以下是该结构在 node_modules 的情况。 在这个例子中，a@1.0.0 需要在项目的node_modules 中出现两次 - 其中一次是被 c@1.0.0 resolve，另一次被 c@1.1.0再次 resolve。</p><div class="language-text line-numbers-mode" data-ext="text"><pre class="language-text"><code>node_modules
└── .pnpm
    ├── a@1.0.0_c@1.0.0
    │   └── node_modules
    │       ├── a
    │       └── b -&gt; ../../b@1.0.0_c@1.0.0/node_modules/b
    ├── a@1.0.0_c@1.1.0
    │   └── node_modules
    │       ├── a
    │       └── b -&gt; ../../b@1.0.0_c@1.1.0/node_modules/b
    ├── b@1.0.0_c@1.0.0
    │   └── node_modules
    │       ├── b
    │       └── c -&gt; ../../c@1.0.0/node_modules/c
    ├── b@1.0.0_c@1.1.0
    │   └── node_modules
    │       ├── b
    │       └── c -&gt; ../../c@1.1.0/node_modules/c
    ├── c@1.0.0
    ├── c@1.1.0
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div>`,72);function h(g,_){const n=p("ExternalLinkIcon");return l(),r("div",null,[t,e("p",null,[e("a",c,[a("https://semver.org/lang/zh-CN/"),d(n)])]),e("p",null,[e("a",u,[a("https://docs.npmjs.com/misc/semver"),d(n)])]),m,e("p",null,[e("a",v,[a("https://docs.npmjs.com/cli-documentation/cli"),d(n)])]),b])}const k=s(o,[["render",h],["__file","包管理工具.html.vue"]]);export{k as default};
