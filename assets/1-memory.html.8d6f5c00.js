const e=JSON.parse('{"key":"v-0f941738","path":"/performance/1-memory.html","title":"内存优化","lang":"en-US","frontmatter":{"title":"内存优化","order":1,"category":[],"tag":["JS性能优化","内存管理","垃圾回收","代码优化"],"description":"垃圾回收 JS 中的内存管理遵循：申请内存空间 -> 使用内存空间 -> 释放内存空间 的顺序 垃圾回收机制： 1. JS 自动进行内存管理 2. 对象不再被引用时就是垃圾 3. 对象不能从根（全局变量对象）上访问的时候就是垃圾 下面的垃圾回收算法都按照这个机制执行垃圾回收 垃圾回收(GC)算法 GC 可以找到内存中的垃圾，并释放和回收空间 优点： 发...","head":[["meta",{"property":"og:url","content":"http://localhost:8080/frontend-service-station/performance/1-memory.html"}],["meta",{"property":"og:site_name","content":"前端加油站"}],["meta",{"property":"og:title","content":"内存优化"}],["meta",{"property":"og:description","content":"垃圾回收 JS 中的内存管理遵循：申请内存空间 -> 使用内存空间 -> 释放内存空间 的顺序 垃圾回收机制： 1. JS 自动进行内存管理 2. 对象不再被引用时就是垃圾 3. 对象不能从根（全局变量对象）上访问的时候就是垃圾 下面的垃圾回收算法都按照这个机制执行垃圾回收 垃圾回收(GC)算法 GC 可以找到内存中的垃圾，并释放和回收空间 优点： 发..."}],["meta",{"property":"og:type","content":"article"}],["meta",{"property":"og:updated_time","content":"2023-02-16T08:45:49.000Z"}],["meta",{"property":"og:locale","content":"en-US"}],["meta",{"property":"article:tag","content":"JS性能优化"}],["meta",{"property":"article:tag","content":"内存管理"}],["meta",{"property":"article:tag","content":"垃圾回收"}],["meta",{"property":"article:tag","content":"代码优化"}],["meta",{"property":"article:modified_time","content":"2023-02-16T08:45:49.000Z"}]]},"excerpt":"","headers":[{"level":2,"title":"垃圾回收","slug":"垃圾回收","link":"#垃圾回收","children":[{"level":3,"title":"垃圾回收(GC)算法","slug":"垃圾回收-gc-算法","link":"#垃圾回收-gc-算法","children":[]},{"level":3,"title":"引用计数","slug":"引用计数","link":"#引用计数","children":[]},{"level":3,"title":"标记清除","slug":"标记清除","link":"#标记清除","children":[]},{"level":3,"title":"标记整理","slug":"标记整理","link":"#标记整理","children":[]}]},{"level":2,"title":"V8 垃圾回收策略","slug":"v8-垃圾回收策略","link":"#v8-垃圾回收策略","children":[{"level":3,"title":"新生代处理","slug":"新生代处理","link":"#新生代处理","children":[]},{"level":3,"title":"老生代处理","slug":"老生代处理","link":"#老生代处理","children":[]},{"level":3,"title":"新老生代回收细节对比","slug":"新老生代回收细节对比","link":"#新老生代回收细节对比","children":[]},{"level":3,"title":"增量标记优化","slug":"增量标记优化","link":"#增量标记优化","children":[]},{"level":3,"title":"总结","slug":"总结","link":"#总结","children":[]}]},{"level":2,"title":"JS 代码优化","slug":"js-代码优化","link":"#js-代码优化","children":[]}],"git":{"createdTime":1676533485000,"updatedTime":1676537149000,"contributors":[{"name":"yuzhihang","email":"misaka10032@aliyun.com","commits":3}]},"readingTime":{"minutes":5.1,"words":1530},"autoDesc":true,"filePathRelative":"performance/1-memory.md","localizedDate":"February 16, 2023"}');export{e as data};
