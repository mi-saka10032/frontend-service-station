import{_ as e}from"./_plugin-vue_export-helper.cdc0426e.js";import{o as a,c as d,a as r}from"./app.a22c0505.js";const t={},h=r('<h2 id="流程图" tabindex="-1"><a class="header-anchor" href="#流程图" aria-hidden="true">#</a> 流程图</h2><p><img src="https://misaka10032.oss-cn-chengdu.aliyuncs.com/Vue/image-20211020112435819.png" alt="Vue2生命周期" loading="lazy"></p><h2 id="分析" tabindex="-1"><a class="header-anchor" href="#分析" aria-hidden="true">#</a> 分析</h2><h3 id="初始化显示" tabindex="-1"><a class="header-anchor" href="#初始化显示" aria-hidden="true">#</a> 初始化显示</h3><p>beforeCreate()：初始化生命周期、事件，但数据代理还未开始。此时，无法通过 vm 访问 data 中数据、methods 中方法。</p><p>created()：初始化数据监测、数据代理。此时，可以通过 vm 访问到 data 中的数据、methods 中方法。</p><p>beforeMount()：页面呈现的是未经 Vue 编译的 DOM 结构，所有对 DOM 的操作不奏效。</p><p>mounted()：此时，页面中呈现的是经过 Vue 编译的 DOM，对 DOM 的操作均有效（尽可能避免）。一般在此进行：开启定时器、发送网络请求、订阅消息、绑定自定义事件等初始化操作。</p><h3 id="更新状态" tabindex="-1"><a class="header-anchor" href="#更新状态" aria-hidden="true">#</a> 更新状态</h3><p>当 data 中监听的数据变化时，<code>this.xxx = value</code></p><p>beforeUpdate()：此时，数据是新的但页面时旧的，即页面尚未和数据保持同步。</p><p>中场：根据新数据，生成新的虚拟 DOM，随后与旧的虚拟 DOM 进行比较，最终完成页面更新，完成了 Model→View 的更新。</p><p>updated()：此时数据和页面都是最新的，页面和数据同步。</p><h3 id="销毁实例" tabindex="-1"><a class="header-anchor" href="#销毁实例" aria-hidden="true">#</a> 销毁实例</h3><p>beforeDestroy()：此时，vm 中所有的 data、methods、指令等等，都处于可用状态，马上要执行销毁过程，一般在此阶段：关闭定时器、取消订阅消息、解绑自定义事件等收尾操作。</p><h3 id="常用周期" tabindex="-1"><a class="header-anchor" href="#常用周期" aria-hidden="true">#</a> 常用周期</h3><p>1.mounted(): 发送 ajax 请求, 启动定时器等异步任务，绑定自定义事件</p><p>2.beforeDestroy(): 做收尾工作, 如: 清除定时器、解绑自定义事件、取消订阅消息</p><p>3.销毁 Vue 实例：</p><p>销毁后期借助 Vue-dev 工具看不到任何信息。</p><p>销毁后自定义事件会失效，但原生 DOM 事件依然有效。</p><p>一般不会在 beforeDestroy 操作数据，因为即便更新数据也无法更新。</p>',22),o=[h];function p(i,n){return a(),d("div",null,o)}const u=e(t,[["render",p],["__file","5-生命周期.html.vue"]]);export{u as default};
