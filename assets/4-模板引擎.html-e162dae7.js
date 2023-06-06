const e=JSON.parse('{"key":"v-4a0435b4","path":"/vue%E6%BA%90%E7%A0%81%E5%88%86%E6%9E%90/4-%E6%A8%A1%E6%9D%BF%E5%BC%95%E6%93%8E.html","title":"模板引擎","lang":"zh-CN","frontmatter":{"title":"模板引擎","order":4,"tag":["模板引擎","渲染流程"],"description":"本章节不是对 Vue 源码的解读，而是对模板引擎的鼻祖 mustache 库的源码解读。熟悉了模板引擎的真正运作机制之后，对 Vue 的模板渲染方法才能有更深刻的认知 模板引擎历史 模板引擎的出现是为了更优雅地将数据转化为视图 历史上曾经出现的数据转视图的方法 1. 纯 DOM 法：非常笨拙，没有实战价值 2. 数组 join 法：曾经非常流行 3. ...","head":[["meta",{"property":"og:url","content":"http://localhost:8080/frontend-service-station/vue%E6%BA%90%E7%A0%81%E5%88%86%E6%9E%90/4-%E6%A8%A1%E6%9D%BF%E5%BC%95%E6%93%8E.html"}],["meta",{"property":"og:site_name","content":"前端加油站"}],["meta",{"property":"og:title","content":"模板引擎"}],["meta",{"property":"og:description","content":"本章节不是对 Vue 源码的解读，而是对模板引擎的鼻祖 mustache 库的源码解读。熟悉了模板引擎的真正运作机制之后，对 Vue 的模板渲染方法才能有更深刻的认知 模板引擎历史 模板引擎的出现是为了更优雅地将数据转化为视图 历史上曾经出现的数据转视图的方法 1. 纯 DOM 法：非常笨拙，没有实战价值 2. 数组 join 法：曾经非常流行 3. ..."}],["meta",{"property":"og:type","content":"article"}],["meta",{"property":"og:locale","content":"zh-CN"}],["meta",{"property":"og:updated_time","content":"2023-02-19T13:42:20.000Z"}],["meta",{"property":"article:author","content":"Misaka10032"}],["meta",{"property":"article:tag","content":"模板引擎"}],["meta",{"property":"article:tag","content":"渲染流程"}],["meta",{"property":"article:modified_time","content":"2023-02-19T13:42:20.000Z"}],["script",{"type":"application/ld+json"},"{\\"@context\\":\\"https://schema.org\\",\\"@type\\":\\"Article\\",\\"headline\\":\\"模板引擎\\",\\"image\\":[\\"\\"],\\"dateModified\\":\\"2023-02-19T13:42:20.000Z\\",\\"author\\":[{\\"@type\\":\\"Person\\",\\"name\\":\\"Misaka10032\\",\\"url\\":\\"https://github.com/mi-saka10032?tab=repositories\\",\\"email\\":\\"misaka10032@aliyun.com\\"}]}"]]},"headers":[{"level":2,"title":"模板引擎历史","slug":"模板引擎历史","link":"#模板引擎历史","children":[]},{"level":2,"title":"mustache 基本使用","slug":"mustache-基本使用","link":"#mustache-基本使用","children":[{"level":3,"title":"循环模式","slug":"循环模式","link":"#循环模式","children":[]},{"level":3,"title":"数组嵌套","slug":"数组嵌套","link":"#数组嵌套","children":[]},{"level":3,"title":"不循环","slug":"不循环","link":"#不循环","children":[]},{"level":3,"title":"布尔值","slug":"布尔值","link":"#布尔值","children":[]}]},{"level":2,"title":"mustache 底层核心机理","slug":"mustache-底层核心机理","link":"#mustache-底层核心机理","children":[]},{"level":2,"title":"手写实现 mustache","slug":"手写实现-mustache","link":"#手写实现-mustache","children":[{"level":3,"title":"实现扫描器类 Scanner","slug":"实现扫描器类-scanner","link":"#实现扫描器类-scanner","children":[]},{"level":3,"title":"生成 tokens","slug":"生成-tokens","link":"#生成-tokens","children":[]},{"level":3,"title":"实现 tokens 嵌套","slug":"实现-tokens-嵌套","link":"#实现-tokens-嵌套","children":[]},{"level":3,"title":"解析 DOM 字符串","slug":"解析-dom-字符串","link":"#解析-dom-字符串","children":[]}]},{"level":2,"title":"最终完整源码","slug":"最终完整源码","link":"#最终完整源码","children":[{"level":3,"title":"index.js","slug":"index-js","link":"#index-js","children":[]},{"level":3,"title":"parseTemplateToTokens.js","slug":"parsetemplatetotokens-js","link":"#parsetemplatetotokens-js","children":[]},{"level":3,"title":"scanner.js","slug":"scanner-js","link":"#scanner-js","children":[]},{"level":3,"title":"nestTokens.js","slug":"nesttokens-js","link":"#nesttokens-js","children":[]},{"level":3,"title":"renderTemplate.js","slug":"rendertemplate-js","link":"#rendertemplate-js","children":[]}]},{"level":2,"title":"太长不看-总结","slug":"太长不看-总结","link":"#太长不看-总结","children":[]}],"git":{"createdTime":1676251113000,"updatedTime":1676814140000,"contributors":[{"name":"yuzhihang","email":"misaka10032@aliyun.com","commits":2}]},"readingTime":{"minutes":13.56,"words":4067},"filePathRelative":"vue源码分析/4-模板引擎.md","localizedDate":"2023年2月13日","autoDesc":true,"excerpt":""}');export{e as data};
