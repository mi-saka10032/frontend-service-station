import{_ as r}from"./_plugin-vue_export-helper.cdc0426e.js";import{o,c as i,a as e,b as t,e as n,d as l,r as _}from"./app.566a2765.js";const s={},d=e("p",null,"虽然现在微前端方案中 iframe 嵌套的方案并非主流，这里还是单独拿出来讲一讲，我们需要在优缺点之间寻找一个平衡，什么时候用 iframe？什么时候不用它",-1),c={href:"https://blog.csdn.net/qq_32198115/article/details/128564837?spm=1001.2101.3001.6650.3&utm_medium=distribute.pc_relevant.none-task-blog-2%7Edefault%7EYuanLiJiHua%7EPosition-3-128564837-blog-106750074.pc_relevant_3mothn_strategy_and_data_recovery&depth_1-utm_source=distribute.pc_relevant.none-task-blog-2%7Edefault%7EYuanLiJiHua%7EPosition-3-128564837-blog-106750074.pc_relevant_3mothn_strategy_and_data_recovery&utm_relevant_index=6",target:"_blank",rel:"noopener noreferrer"},u=l('<h2 id="优缺点分析" tabindex="-1"><a class="header-anchor" href="#优缺点分析" aria-hidden="true">#</a> 优缺点分析</h2><p><img src="https://misaka10032.oss-cn-chengdu.aliyuncs.com/MicroApp/iframe-analyze.png" alt="iframe优缺点分析" loading="lazy"></p><h2 id="适合场景" tabindex="-1"><a class="header-anchor" href="#适合场景" aria-hidden="true">#</a> 适合场景</h2><p>iframe 容易出现尴尬的场景就是父子页面双滚动条这一点了</p><p>所以：</p><ul><li>如果页面本身比较简单，是一个没有弹窗、浮层，高度也固定的纯信息展示页，用 iframe 没问题</li><li>如果页面包含弹窗、信息提示，或者高度不固定，需要看 iframe <strong>是否占据了全部的内容区域</strong>（不占据的话就会在页面内出现滚动条），如果是经典的管理系统界面（顶部 navbar + 左侧 sidebar + 右侧 main），并且整个 content 区域都是 iframe，那么也可以尝试 iframe</li></ul><h2 id="注意问题" tabindex="-1"><a class="header-anchor" href="#注意问题" aria-hidden="true">#</a> 注意问题</h2><p>使用 iframe 需要注意的主要问题有：</p>',8),m={href:"https://blog.csdn.net/qq_32198115/article/details/128564837?spm=1001.2101.3001.6650.3&utm_medium=distribute.pc_relevant.none-task-blog-2%7Edefault%7EYuanLiJiHua%7EPosition-3-128564837-blog-106750074.pc_relevant_3mothn_strategy_and_data_recovery&depth_1-utm_source=distribute.pc_relevant.none-task-blog-2%7Edefault%7EYuanLiJiHua%7EPosition-3-128564837-blog-106750074.pc_relevant_3mothn_strategy_and_data_recovery&utm_relevant_index=6",target:"_blank",rel:"noopener noreferrer"},h={href:"https://blog.csdn.net/qq_32198115/article/details/128564837?spm=1001.2101.3001.6650.3&utm_medium=distribute.pc_relevant.none-task-blog-2%7Edefault%7EYuanLiJiHua%7EPosition-3-128564837-blog-106750074.pc_relevant_3mothn_strategy_and_data_recovery&depth_1-utm_source=distribute.pc_relevant.none-task-blog-2%7Edefault%7EYuanLiJiHua%7EPosition-3-128564837-blog-106750074.pc_relevant_3mothn_strategy_and_data_recovery&utm_relevant_index=6",target:"_blank",rel:"noopener noreferrer"},p={href:"https://blog.csdn.net/qq_32198115/article/details/128564837?spm=1001.2101.3001.6650.3&utm_medium=distribute.pc_relevant.none-task-blog-2%7Edefault%7EYuanLiJiHua%7EPosition-3-128564837-blog-106750074.pc_relevant_3mothn_strategy_and_data_recovery&depth_1-utm_source=distribute.pc_relevant.none-task-blog-2%7Edefault%7EYuanLiJiHua%7EPosition-3-128564837-blog-106750074.pc_relevant_3mothn_strategy_and_data_recovery&utm_relevant_index=6",target:"_blank",rel:"noopener noreferrer"},f=e("p",null,"篇幅较长，iframe 也不是我关注的重点，所以这些问题点就不再赘述，看 CSDN 链接即可",-1),g=e("h2",{id:"其他问题",tabindex:"-1"},[e("a",{class:"header-anchor",href:"#其他问题","aria-hidden":"true"},"#"),t(" 其他问题")],-1),b=e("p",null,"其他可能需要考虑的问题是：",-1),v=e("ol",null,[e("li",null,"两套系统是否共用一套用户体系（SSO），否则方案无效"),e("li",null,"参数透传与删除：父子之间的参数传递靠 query，参数数据量大的时候很麻烦"),e("li",null,"埋点：数据上报的时候需要增加一个额外参数来标识流量来自另一个系统")],-1),E=e("p",null,"总之，iframe 作为一套可行的微前端方案，也是有它的适用场景的，并非一无是处",-1);function y(k,x){const a=_("ExternalLinkIcon");return o(),i("div",null,[d,e("p",null,[t("参考链接："),e("a",c,[t("你可能并不需要微前端"),n(a)])]),u,e("ol",null,[e("li",null,[t("iframe 的 url 需要和主页面的 url 同步更新："),e("a",m,[t("URL 同步更新"),n(a)])]),e("li",null,[t("需要预先拦截全局的路由 url，判断由哪个页面来执行跳转："),e("a",h,[t("全局跳转拦截"),n(a)])]),e("li",null,[t("iframe 的激活与切换需要考虑增加 loading 效果："),e("a",p,[t("全局 loading 处理"),n(a)])])]),f,g,b,v,E])}const H=r(s,[["render",y],["__file","4-iframe.html.vue"]]);export{H as default};