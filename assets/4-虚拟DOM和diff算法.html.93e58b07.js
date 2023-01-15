const e=JSON.parse('{"key":"v-588cd9c4","path":"/vue2%E6%BA%90%E7%A0%81%E5%88%86%E6%9E%90/4-%E8%99%9A%E6%8B%9FDOM%E5%92%8Cdiff%E7%AE%97%E6%B3%95.html","title":"虚拟DOM和diff算法","lang":"en-US","frontmatter":{"title":"虚拟DOM和diff算法","order":4,"category":[],"tag":["虚拟DOM","diff算法"],"description":"本章节内容参考自 【尚硅谷】Vue 源码解析之虚拟 DOM 和 diff 算法 (https://www.bilibili.com/video/BV1v5411H7gZ/?spmidfrom=333.1007.toprightbarwindowcustomcollection.content.click&vdsource=3880930731e557c...","head":[["meta",{"property":"og:url","content":"http://localhost:8080/frontend-service-station/vue2%E6%BA%90%E7%A0%81%E5%88%86%E6%9E%90/4-%E8%99%9A%E6%8B%9FDOM%E5%92%8Cdiff%E7%AE%97%E6%B3%95.html"}],["meta",{"property":"og:site_name","content":"前端加油站"}],["meta",{"property":"og:title","content":"虚拟DOM和diff算法"}],["meta",{"property":"og:description","content":"本章节内容参考自 【尚硅谷】Vue 源码解析之虚拟 DOM 和 diff 算法 (https://www.bilibili.com/video/BV1v5411H7gZ/?spmidfrom=333.1007.toprightbarwindowcustomcollection.content.click&vdsource=3880930731e557c..."}],["meta",{"property":"og:type","content":"article"}],["meta",{"property":"og:updated_time","content":"2023-01-15T19:19:02.000Z"}],["meta",{"property":"og:locale","content":"en-US"}],["meta",{"property":"article:tag","content":"虚拟DOM"}],["meta",{"property":"article:tag","content":"diff算法"}],["meta",{"property":"article:modified_time","content":"2023-01-15T19:19:02.000Z"}]]},"excerpt":"","headers":[{"level":2,"title":"源头-snabbdom","slug":"源头-snabbdom","link":"#源头-snabbdom","children":[{"level":3,"title":"真实 DOM 与虚拟 DOM","slug":"真实-dom-与虚拟-dom","link":"#真实-dom-与虚拟-dom","children":[]},{"level":3,"title":"snabbdom 库实现","slug":"snabbdom-库实现","link":"#snabbdom-库实现","children":[]},{"level":3,"title":"diff 触发时机","slug":"diff-触发时机","link":"#diff-触发时机","children":[]},{"level":3,"title":"diff 核心逻辑","slug":"diff-核心逻辑","link":"#diff-核心逻辑","children":[]}]},{"level":2,"title":"简易源码实现","slug":"简易源码实现","link":"#简易源码实现","children":[{"level":3,"title":"基础-h函数","slug":"基础-h函数","link":"#基础-h函数","children":[]},{"level":3,"title":"递归-遍历生成 DOM 对象","slug":"递归-遍历生成-dom-对象","link":"#递归-遍历生成-dom-对象","children":[]},{"level":3,"title":"比较-同一节点的更新策略(逻辑)","slug":"比较-同一节点的更新策略-逻辑","link":"#比较-同一节点的更新策略-逻辑","children":[]},{"level":3,"title":"比较-同一节点的更新策略(代码)","slug":"比较-同一节点的更新策略-代码","link":"#比较-同一节点的更新策略-代码","children":[]}]},{"level":2,"title":"最终完整源码","slug":"最终完整源码","link":"#最终完整源码","children":[{"level":3,"title":"index.js","slug":"index-js","link":"#index-js","children":[]},{"level":3,"title":"h.js","slug":"h-js","link":"#h-js","children":[]},{"level":3,"title":"vnode.js","slug":"vnode-js","link":"#vnode-js","children":[]},{"level":3,"title":"patch.js","slug":"patch-js","link":"#patch-js","children":[]},{"level":3,"title":"createElement.js","slug":"createelement-js","link":"#createelement-js","children":[]},{"level":3,"title":"patchVNode.js","slug":"patchvnode-js","link":"#patchvnode-js","children":[]},{"level":3,"title":"updateChildren.js","slug":"updatechildren-js","link":"#updatechildren-js","children":[]}]},{"level":2,"title":"太长不看-总结","slug":"太长不看-总结","link":"#太长不看-总结","children":[]}],"git":{"createdTime":1673344034000,"updatedTime":1673810342000,"contributors":[{"name":"yuzhihang","email":"misaka10032@aliyun.com","commits":3}]},"readingTime":{"minutes":22.78,"words":6834},"autoDesc":true,"filePathRelative":"vue2源码分析/4-虚拟DOM和diff算法.md","localizedDate":"January 10, 2023"}');export{e as data};
