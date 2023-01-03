const e=JSON.parse('{"key":"v-c5d27524","path":"/webpack/senior.html","title":"webpack进阶配置","lang":"en-US","frontmatter":{"title":"webpack进阶配置","order":3,"category":[],"tag":["Webpack","进阶配置"],"description":"source-map 模式 解释 :---------------------- :------------------------------------------------------------------------------------------------------------ eval 每个 module 会封装到 eval 里...","head":[["meta",{"property":"og:url","content":"http://localhost:8080/frontend-service-station/webpack/senior.html"}],["meta",{"property":"og:site_name","content":"前端加油站"}],["meta",{"property":"og:title","content":"webpack进阶配置"}],["meta",{"property":"og:description","content":"source-map 模式 解释 :---------------------- :------------------------------------------------------------------------------------------------------------ eval 每个 module 会封装到 eval 里..."}],["meta",{"property":"og:type","content":"article"}],["meta",{"property":"og:updated_time","content":"2023-01-03T09:32:16.000Z"}],["meta",{"property":"og:locale","content":"en-US"}],["meta",{"property":"article:tag","content":"Webpack"}],["meta",{"property":"article:tag","content":"进阶配置"}],["meta",{"property":"article:modified_time","content":"2023-01-03T09:32:16.000Z"}]]},"excerpt":"","headers":[{"level":2,"title":"source-map","slug":"source-map","link":"#source-map","children":[]},{"level":2,"title":"dev-server","slug":"dev-server","link":"#dev-server","children":[]},{"level":2,"title":"模块热替换与热加载","slug":"模块热替换与热加载","link":"#模块热替换与热加载","children":[]},{"level":2,"title":"eslint","slug":"eslint","link":"#eslint","children":[]},{"level":2,"title":"git-hooks 与 husky","slug":"git-hooks-与-husky","link":"#git-hooks-与-husky","children":[]},{"level":2,"title":"模块与依赖","slug":"模块与依赖","link":"#模块与依赖","children":[{"level":3,"title":"模块路径解析规则","slug":"模块路径解析规则","link":"#模块路径解析规则","children":[]},{"level":3,"title":"外部扩展 externals","slug":"外部扩展-externals","link":"#外部扩展-externals","children":[]},{"level":3,"title":"依赖图 dependency graph","slug":"依赖图-dependency-graph","link":"#依赖图-dependency-graph","children":[]}]},{"level":2,"title":"扩展功能","slug":"扩展功能","link":"#扩展功能","children":[{"level":3,"title":"PostCSS 与 CSS 模块","slug":"postcss-与-css-模块","link":"#postcss-与-css-模块","children":[]},{"level":3,"title":"Web Worker","slug":"web-worker","link":"#web-worker","children":[]},{"level":3,"title":"TypeScript","slug":"typescript","link":"#typescript","children":[]}]},{"level":2,"title":"多页面配置","slug":"多页面配置","link":"#多页面配置","children":[]},{"level":2,"title":"Tree Shaking（重要）","slug":"tree-shaking-重要","link":"#tree-shaking-重要","children":[]},{"level":2,"title":"渐进式网络应用程序 PWA","slug":"渐进式网络应用程序-pwa","link":"#渐进式网络应用程序-pwa","children":[]},{"level":2,"title":"Shimming 预置依赖","slug":"shimming-预置依赖","link":"#shimming-预置依赖","children":[{"level":3,"title":"Shimming 预置全局变量","slug":"shimming-预置全局变量","link":"#shimming-预置全局变量","children":[]},{"level":3,"title":"细粒度 Shimming","slug":"细粒度-shimming","link":"#细粒度-shimming","children":[]},{"level":3,"title":"全局 exports","slug":"全局-exports","link":"#全局-exports","children":[]},{"level":3,"title":"Polyfills","slug":"polyfills","link":"#polyfills","children":[]}]},{"level":2,"title":"library 轮子","slug":"library-轮子","link":"#library-轮子","children":[]},{"level":2,"title":"npm 发布","slug":"npm-发布","link":"#npm-发布","children":[]},{"level":2,"title":"模块联邦 Module Federation","slug":"模块联邦-module-federation","link":"#模块联邦-module-federation","children":[]},{"level":2,"title":"八个通用构建优化","slug":"八个通用构建优化","link":"#八个通用构建优化","children":[{"level":3,"title":"1.更新到最新版本","slug":"_1-更新到最新版本","link":"#_1-更新到最新版本","children":[]},{"level":3,"title":"2.将 loader 应用于最少数量的必要模块","slug":"_2-将-loader-应用于最少数量的必要模块","link":"#_2-将-loader-应用于最少数量的必要模块","children":[]},{"level":3,"title":"3.引导 bootstrap","slug":"_3-引导-bootstrap","link":"#_3-引导-bootstrap","children":[]},{"level":3,"title":"4.解析","slug":"_4-解析","link":"#_4-解析","children":[]},{"level":3,"title":"5.小即是快 smaller = faster","slug":"_5-小即是快-smaller-faster","link":"#_5-小即是快-smaller-faster","children":[]},{"level":3,"title":"6.持久化缓存","slug":"_6-持久化缓存","link":"#_6-持久化缓存","children":[]},{"level":3,"title":"7.自定义 plugin/loader","slug":"_7-自定义-plugin-loader","link":"#_7-自定义-plugin-loader","children":[]},{"level":3,"title":"8.progress plugin","slug":"_8-progress-plugin","link":"#_8-progress-plugin","children":[]}]},{"level":2,"title":"DLL","slug":"dll","link":"#dll","children":[]},{"level":2,"title":"worker 池(worker pool)","slug":"worker-池-worker-pool","link":"#worker-池-worker-pool","children":[]},{"level":2,"title":"开发环境构建性能","slug":"开发环境构建性能","link":"#开发环境构建性能","children":[{"level":3,"title":"增量编译","slug":"增量编译","link":"#增量编译","children":[]},{"level":3,"title":"内存中编译","slug":"内存中编译","link":"#内存中编译","children":[]},{"level":3,"title":"stats.toJson 加速","slug":"stats-tojson-加速","link":"#stats-tojson-加速","children":[]},{"level":3,"title":"devtool","slug":"devtool","link":"#devtool","children":[]},{"level":3,"title":"避免在生产环境使用 dev 工具","slug":"避免在生产环境使用-dev-工具","link":"#避免在生产环境使用-dev-工具","children":[]},{"level":3,"title":"最小化 entry chunk","slug":"最小化-entry-chunk","link":"#最小化-entry-chunk","children":[]},{"level":3,"title":"避免额外的优化步骤","slug":"避免额外的优化步骤","link":"#避免额外的优化步骤","children":[]},{"level":3,"title":"输出结果不携带路径信息","slug":"输出结果不携带路径信息","link":"#输出结果不携带路径信息","children":[]},{"level":3,"title":"Node.js 版本 8.9.10 - 9.11.1","slug":"node-js-版本-8-9-10-9-11-1","link":"#node-js-版本-8-9-10-9-11-1","children":[]},{"level":3,"title":"TypeScript Loader","slug":"typescript-loader","link":"#typescript-loader","children":[]}]}],"git":{"createdTime":1672738336000,"updatedTime":1672738336000,"contributors":[{"name":"yuzhihang","email":"misaka10032@aliyun.com","commits":1}]},"readingTime":{"minutes":15.25,"words":4575},"autoDesc":true,"filePathRelative":"webpack/senior.md","localizedDate":"January 3, 2023"}');export{e as data};
