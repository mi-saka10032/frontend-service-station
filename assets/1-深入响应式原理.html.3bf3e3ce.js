const e=JSON.parse('{"key":"v-6868d6d1","path":"/vue%E6%BA%90%E7%A0%81%E5%88%86%E6%9E%90/1-%E6%B7%B1%E5%85%A5%E5%93%8D%E5%BA%94%E5%BC%8F%E5%8E%9F%E7%90%86.html","title":"深入响应式原理","lang":"en-US","frontmatter":{"title":"深入响应式原理","order":1,"category":[],"tag":["响应式原理","监视-订阅模式","依赖收集"],"description":"这里是官网的响应式原理 (https://v2.cn.vuejs.org/v2/guide/reactivity.html)原文 当你把一个普通的 JavaScript 对象传入 Vue 实例作为 data 选项，Vue 将遍历此对象所有的 property，并使用 Object.defineProperty 把这些 property 全部转为 get...","head":[["meta",{"property":"og:url","content":"http://localhost:8080/frontend-service-station/vue%E6%BA%90%E7%A0%81%E5%88%86%E6%9E%90/1-%E6%B7%B1%E5%85%A5%E5%93%8D%E5%BA%94%E5%BC%8F%E5%8E%9F%E7%90%86.html"}],["meta",{"property":"og:site_name","content":"前端加油站"}],["meta",{"property":"og:title","content":"深入响应式原理"}],["meta",{"property":"og:description","content":"这里是官网的响应式原理 (https://v2.cn.vuejs.org/v2/guide/reactivity.html)原文 当你把一个普通的 JavaScript 对象传入 Vue 实例作为 data 选项，Vue 将遍历此对象所有的 property，并使用 Object.defineProperty 把这些 property 全部转为 get..."}],["meta",{"property":"og:type","content":"article"}],["meta",{"property":"og:updated_time","content":"2023-02-13T01:18:33.000Z"}],["meta",{"property":"og:locale","content":"en-US"}],["meta",{"property":"article:tag","content":"响应式原理"}],["meta",{"property":"article:tag","content":"监视-订阅模式"}],["meta",{"property":"article:tag","content":"依赖收集"}],["meta",{"property":"article:modified_time","content":"2023-02-13T01:18:33.000Z"}]]},"excerpt":"","headers":[{"level":2,"title":"前言","slug":"前言","link":"#前言","children":[{"level":3,"title":"MVVM 模式","slug":"mvvm-模式","link":"#mvvm-模式","children":[]},{"level":3,"title":"非侵入式变化","slug":"非侵入式变化","link":"#非侵入式变化","children":[]},{"level":3,"title":"上帝的钥匙","slug":"上帝的钥匙","link":"#上帝的钥匙","children":[]}]},{"level":2,"title":"1.实现完整的数据劫持","slug":"_1-实现完整的数据劫持","link":"#_1-实现完整的数据劫持","children":[{"level":3,"title":"方法简介","slug":"方法简介","link":"#方法简介","children":[]},{"level":3,"title":"隐藏属性","slug":"隐藏属性","link":"#隐藏属性","children":[]},{"level":3,"title":"getter/setter","slug":"getter-setter","link":"#getter-setter","children":[]},{"level":3,"title":"递归侦测对象属性(实现 Observer 类)","slug":"递归侦测对象属性-实现-observer-类","link":"#递归侦测对象属性-实现-observer-类","children":[]},{"level":3,"title":"数组的响应式处理","slug":"数组的响应式处理","link":"#数组的响应式处理","children":[]},{"level":3,"title":"完整的数据劫持源码参考","slug":"完整的数据劫持源码参考","link":"#完整的数据劫持源码参考","children":[]}]},{"level":2,"title":"2.实现订阅-发布模式的依赖收集","slug":"_2-实现订阅-发布模式的依赖收集","link":"#_2-实现订阅-发布模式的依赖收集","children":[{"level":3,"title":"初始化订阅-发布系统","slug":"初始化订阅-发布系统","link":"#初始化订阅-发布系统","children":[]},{"level":3,"title":"Watcher 类初步实现","slug":"watcher-类初步实现","link":"#watcher-类初步实现","children":[]},{"level":3,"title":"Dep 类初步实现","slug":"dep-类初步实现","link":"#dep-类初步实现","children":[]},{"level":3,"title":"订阅-发布初步实现","slug":"订阅-发布初步实现","link":"#订阅-发布初步实现","children":[]},{"level":3,"title":"订阅系统完善","slug":"订阅系统完善","link":"#订阅系统完善","children":[]}]},{"level":2,"title":"最终完整源码","slug":"最终完整源码","link":"#最终完整源码","children":[{"level":3,"title":"util.js","slug":"util-js","link":"#util-js","children":[]},{"level":3,"title":"defineReactive.js","slug":"definereactive-js","link":"#definereactive-js","children":[]},{"level":3,"title":"array.js","slug":"array-js","link":"#array-js","children":[]},{"level":3,"title":"dep.js","slug":"dep-js","link":"#dep-js","children":[]},{"level":3,"title":"watcher.js","slug":"watcher-js","link":"#watcher-js","children":[]},{"level":3,"title":"observer.js","slug":"observer-js","link":"#observer-js","children":[]},{"level":3,"title":"observe.js","slug":"observe-js","link":"#observe-js","children":[]}]},{"level":2,"title":"太长不看-总结","slug":"太长不看-总结","link":"#太长不看-总结","children":[{"level":3,"title":"响应式数据声明","slug":"响应式数据声明","link":"#响应式数据声明","children":[]},{"level":3,"title":"订阅-发布系统","slug":"订阅-发布系统","link":"#订阅-发布系统","children":[]}]}],"git":{"createdTime":1676251113000,"updatedTime":1676251113000,"contributors":[{"name":"yuzhihang","email":"misaka10032@aliyun.com","commits":1}]},"readingTime":{"minutes":34.42,"words":10325},"autoDesc":true,"filePathRelative":"vue源码分析/1-深入响应式原理.md","localizedDate":"February 13, 2023"}');export{e as data};
