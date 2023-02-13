const e=JSON.parse('{"key":"v-f3c6b8ca","path":"/render/2-nuxt.html","title":"Nuxt","lang":"en-US","frontmatter":{"title":"Nuxt","order":2,"category":[],"tag":["Vue","SSR","服务端渲染框架"],"description":"本章主要记录面向 Vue2 的 Nuxt2 的框架结构与重构要点 项目结构 pages：存放页面 对标 vue-cli 的 src/views components：存放组件 对标 vue-cli 的 src/components static：存放静态资源 对标 vue-cli 的 src/assets store：vuex 状态树 对标 vue-c...","head":[["meta",{"property":"og:url","content":"http://localhost:8080/frontend-service-station/render/2-nuxt.html"}],["meta",{"property":"og:site_name","content":"前端加油站"}],["meta",{"property":"og:title","content":"Nuxt"}],["meta",{"property":"og:description","content":"本章主要记录面向 Vue2 的 Nuxt2 的框架结构与重构要点 项目结构 pages：存放页面 对标 vue-cli 的 src/views components：存放组件 对标 vue-cli 的 src/components static：存放静态资源 对标 vue-cli 的 src/assets store：vuex 状态树 对标 vue-c..."}],["meta",{"property":"og:type","content":"article"}],["meta",{"property":"og:updated_time","content":"2023-02-13T01:01:48.000Z"}],["meta",{"property":"og:locale","content":"en-US"}],["meta",{"property":"article:tag","content":"Vue"}],["meta",{"property":"article:tag","content":"SSR"}],["meta",{"property":"article:tag","content":"服务端渲染框架"}],["meta",{"property":"article:modified_time","content":"2023-02-13T01:01:48.000Z"}]]},"excerpt":"","headers":[{"level":2,"title":"项目结构","slug":"项目结构","link":"#项目结构","children":[]},{"level":2,"title":"服务端生命周期","slug":"服务端生命周期","link":"#服务端生命周期","children":[{"level":3,"title":"nuxtServerInit","slug":"nuxtserverinit","link":"#nuxtserverinit","children":[]},{"level":3,"title":"middleware","slug":"middleware","link":"#middleware","children":[]},{"level":3,"title":"validate","slug":"validate","link":"#validate","children":[]},{"level":3,"title":"asyncData","slug":"asyncdata","link":"#asyncdata","children":[]},{"level":3,"title":"fetch","slug":"fetch","link":"#fetch","children":[]}]},{"level":2,"title":"服务端和客户端共有生命周期","slug":"服务端和客户端共有生命周期","link":"#服务端和客户端共有生命周期","children":[]},{"level":2,"title":"客户端生命周期","slug":"客户端生命周期","link":"#客户端生命周期","children":[]},{"level":2,"title":"Nuxt 路由","slug":"nuxt-路由","link":"#nuxt-路由","children":[{"level":3,"title":"标签变动","slug":"标签变动","link":"#标签变动","children":[]},{"level":3,"title":"基础路由","slug":"基础路由","link":"#基础路由","children":[]},{"level":3,"title":"动态路由","slug":"动态路由","link":"#动态路由","children":[]},{"level":3,"title":"嵌套路由","slug":"嵌套路由","link":"#嵌套路由","children":[]}]},{"level":2,"title":"使用原生 VueRouter","slug":"使用原生-vuerouter","link":"#使用原生-vuerouter","children":[]},{"level":2,"title":"使用导航守卫","slug":"使用导航守卫","link":"#使用导航守卫","children":[{"level":3,"title":"@nuxt-js/router","slug":"nuxt-js-router","link":"#nuxt-js-router","children":[]},{"level":3,"title":"使用 middleware 中间件","slug":"使用-middleware-中间件","link":"#使用-middleware-中间件","children":[]},{"level":3,"title":"plugins","slug":"plugins","link":"#plugins","children":[]}]},{"level":2,"title":"服务端解决本地存储问题方案","slug":"服务端解决本地存储问题方案","link":"#服务端解决本地存储问题方案","children":[]},{"level":2,"title":"Nuxt 配置","slug":"nuxt-配置","link":"#nuxt-配置","children":[{"level":3,"title":"head","slug":"head","link":"#head","children":[]},{"level":3,"title":"css","slug":"css","link":"#css","children":[]},{"level":3,"title":"plugins","slug":"plugins-1","link":"#plugins-1","children":[]},{"level":3,"title":"modules","slug":"modules","link":"#modules","children":[]}]},{"level":2,"title":"Nuxt 代理","slug":"nuxt-代理","link":"#nuxt-代理","children":[]},{"level":2,"title":"loading","slug":"loading","link":"#loading","children":[{"level":3,"title":"默认配置","slug":"默认配置","link":"#默认配置","children":[]},{"level":3,"title":"个性化 loading","slug":"个性化-loading","link":"#个性化-loading","children":[]},{"level":3,"title":"自定义 loading","slug":"自定义-loading","link":"#自定义-loading","children":[]}]},{"level":2,"title":"重构要点","slug":"重构要点","link":"#重构要点","children":[{"level":3,"title":"配置路由","slug":"配置路由","link":"#配置路由","children":[]},{"level":3,"title":"请求接口","slug":"请求接口","link":"#请求接口","children":[]},{"level":3,"title":"组件重构","slug":"组件重构","link":"#组件重构","children":[]},{"level":3,"title":"配置 store","slug":"配置-store","link":"#配置-store","children":[]},{"level":3,"title":"导航守卫","slug":"导航守卫","link":"#导航守卫","children":[]},{"level":3,"title":"打包上线","slug":"打包上线","link":"#打包上线","children":[]}]}],"git":{"createdTime":1676211813000,"updatedTime":1676250108000,"contributors":[{"name":"yuzhihang","email":"misaka10032@aliyun.com","commits":2}]},"readingTime":{"minutes":7.77,"words":2330},"autoDesc":true,"filePathRelative":"render/2-nuxt.md","localizedDate":"February 12, 2023"}');export{e as data};
