import{_ as e,Y as r,Z as a,a1 as t}from"./framework-bb209140.js";const n={},i=t('<h2 id="背景" tabindex="-1"><a class="header-anchor" href="#背景" aria-hidden="true">#</a> 背景</h2><p>为什么会有微前端？任何新技术的产生都是为了解决现有场景和需求下的技术痛点，微前端也不例外：</p><ol><li><strong>拆分和细化</strong>：当下前端领域，单页面应用（SPA）是非常流行的项目形态之一，而随着时间的推移以及应用功能的丰富，SPA 也变得不再单一而是越来越大、越来越难以维护，往往是牵一发而动全身，由此带来的维护和发版成本也越来越高。微前端的意义就是将这些庞大应用进行拆分，并随之解耦，每个部分可以单独进行维护和部署，提升效率</li><li><strong>整合历史系统</strong>：在不少的业务中，或多或少会存在一些历史项目，这项项目大多以采用老框架类似的 B 端管理系统为主，介于日常运营，这些系统需要结合到新框架中来使用，还不能抛弃，对此我们也没有理由浪费时间和精力重写旧的逻辑。而微前端可以将这些系统进行整合，在基本不修改原来逻辑的同时来同时兼容新老两套系统并行运行</li></ol><h2 id="概念" tabindex="-1"><a class="header-anchor" href="#概念" aria-hidden="true">#</a> 概念</h2><p>微前端借鉴了微服务的结构理念，将一个庞大的前端应用拆分为多个独立灵活的小型应用，每个应用都可以独立开发、独立运行、独立部署，再将这些小型应用联合为一个完整的应用。微前端既可以将多个项目融合为一，又可以减少项目之间的耦合，提升项目扩展性，相比一整块的前端仓库，微前端架构下的前端仓库倾向于更小更灵活</p><h2 id="特点" tabindex="-1"><a class="header-anchor" href="#特点" aria-hidden="true">#</a> 特点</h2><ol><li><strong>技术栈无关</strong>：主框架不限制介入应用的技术栈，子应用可自主选择技术栈</li><li><strong>独立开发/部署</strong>：各个团队之间仓库独立，单独部署，互不依赖</li><li><strong>增量升级</strong>：当一个应用庞大之后，技术升级或重构相当麻烦，而微应用具备渐进式升级的特性</li><li><strong>独立运行时</strong>：微应用之间运行时互不依赖，有独立的状态管理</li><li><strong>提升效率</strong>：应用越庞大，越难以维护，协作效率越低下。微应用可以很好地拆分，提升效率</li></ol><h2 id="开发模式" tabindex="-1"><a class="header-anchor" href="#开发模式" aria-hidden="true">#</a> 开发模式</h2><p>微前端是一种多个团队通过独立发布功能的方式来共同构建现代化 web 应用的技术手段及方法策略</p><p>微前端的核心目标是将巨石应用拆解成若干可以自治的松耦合应用，这样才能确保微应用真正具备独立开发、独立运行的能力</p>',10),o=[i];function s(l,h){return r(),a("div",null,o)}const c=e(n,[["render",s],["__file","1-简介.html.vue"]]);export{c as default};
