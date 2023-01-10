const e=JSON.parse('{"key":"v-6c29f1c8","path":"/vue2%E6%BA%90%E7%A0%81%E5%88%86%E6%9E%90/3-computed%E6%BA%90%E7%A0%81%E5%88%86%E6%9E%90.html","title":"computed源码解析","lang":"en-US","frontmatter":{"title":"computed源码解析","order":3,"category":[],"tag":["响应式原理","惰性缓存","依赖耦合"],"description":"前言 computed 是三大 watcher 中最复杂的一个 watcher(computed-watcher)，因为它不光是惰性缓存，而且只要是在 getter 中有出现过的响应式数据，都需要触发它的响应式变化 首先，根据computed 惰性取值 (https://v2.cn.vuejs.org/v2/api/#computed)的原理，我们先构...","head":[["meta",{"property":"og:url","content":"http://localhost:8080/frontend-service-station/vue2%E6%BA%90%E7%A0%81%E5%88%86%E6%9E%90/3-computed%E6%BA%90%E7%A0%81%E5%88%86%E6%9E%90.html"}],["meta",{"property":"og:site_name","content":"前端加油站"}],["meta",{"property":"og:title","content":"computed源码解析"}],["meta",{"property":"og:description","content":"前言 computed 是三大 watcher 中最复杂的一个 watcher(computed-watcher)，因为它不光是惰性缓存，而且只要是在 getter 中有出现过的响应式数据，都需要触发它的响应式变化 首先，根据computed 惰性取值 (https://v2.cn.vuejs.org/v2/api/#computed)的原理，我们先构..."}],["meta",{"property":"og:type","content":"article"}],["meta",{"property":"og:updated_time","content":"2023-01-10T09:47:14.000Z"}],["meta",{"property":"og:locale","content":"en-US"}],["meta",{"property":"article:tag","content":"响应式原理"}],["meta",{"property":"article:tag","content":"惰性缓存"}],["meta",{"property":"article:tag","content":"依赖耦合"}],["meta",{"property":"article:modified_time","content":"2023-01-10T09:47:14.000Z"}]]},"excerpt":"","headers":[{"level":2,"title":"前言","slug":"前言","link":"#前言","children":[]},{"level":2,"title":"initComputed.js","slug":"initcomputed-js","link":"#initcomputed-js","children":[]},{"level":2,"title":"watcher.js","slug":"watcher-js","link":"#watcher-js","children":[]},{"level":2,"title":"defineComputed.js","slug":"definecomputed-js","link":"#definecomputed-js","children":[]},{"level":2,"title":"仍未解决的问题-多重嵌套 watcher","slug":"仍未解决的问题-多重嵌套-watcher","link":"#仍未解决的问题-多重嵌套-watcher","children":[]},{"level":2,"title":"嵌套 watcher 解决方案","slug":"嵌套-watcher-解决方案","link":"#嵌套-watcher-解决方案","children":[]},{"level":2,"title":"太长不看-总结","slug":"太长不看-总结","link":"#太长不看-总结","children":[]}],"git":{"createdTime":1673271401000,"updatedTime":1673344034000,"contributors":[{"name":"yuzhihang","email":"misaka10032@aliyun.com","commits":2}]},"readingTime":{"minutes":14.22,"words":4265},"autoDesc":true,"filePathRelative":"vue2源码分析/3-computed源码分析.md","localizedDate":"January 9, 2023"}');export{e as data};
