---
title: 仓库管理方案
icon: repo
order: 2
category:
  - 仓库管理方案
  - Monolithic
  - Monorepo
---

## 前言-项目(仓库)管理方案

Monorepo 这个词您可能不是首次听说，在当下大型前端项目中基于 monorepo 的解决方案已经深入人心，无论是比如 Google、Facebook，社区内部知名的开源项目 Babel、Vue-next ，还是集团中 rax-components 等等，都使用了 monorepo 方案来管理他们的代码。

## 发展历程

仓库（repository，简称 repo），是我们用来管理项目代码的一个基本单元。通常每个仓库负责一个模块或包的编码、构建、测试和发布，代码规模相对较小，逻辑聚合，业务场景也比较收拢。

当我们在一整块业务域下进行研发时，代码的解耦和复用是一个非常重要的问题。

这里，我们罗列仓库管理发展过程中出现的三大常见方案：

- 单体应用架构：Monolithic
- 多仓多模块管理：Multirepo
- 单仓多模块管理：Monorepo

![repo方案](https://misaka10032.oss-cn-chengdu.aliyuncs.com/git/repo-plan.png)

### Monolithic

Monolithic 称为单体应用架构。项目初期起步阶段，团队规模很小，此时适合「单体应用」，一个代码仓库承接一个应用，管理成本低，最简力度支撑业务快速落地。

这时我们会以合理划分目录，提取公共组件的方式来解决问题。由文件的层级划分和引入，来进行页面、组件和工具方法等的管理。此时其整个依赖和工作流都是统一的、单向的。

此时目录架构大概是这样的：

```text
project
├── node_modules/
│   ├── lib@1.0.0
├── src/
│   ├── compA
│   ├── compB
│   └── compC
└── package.json
```

#### `Monolithic`优点

1. 代码管理成本低
2. 代码能见度高（无需额外的学习成本）
3. 发布简单，链路轻便

#### `Monolithic`缺点

1. 代码量增大后，调试、构建效率显著下降
2. 无法跨项目复用

### Multirepo

团队规模变大，人员分工明确，单体应用的缺点会愈发突出。

特别是当业务复杂度的提升，项目的复杂性增长，由此就会导致一系列的问题：项目编译速度变慢（调试成本变大）、部署效率/频率低（非业务开发耗时增加）、单场景下加载内容冗余等等，技术债务会越积越多。

并且同时还有代码共享的需求，此时就需要按照业务和模块来拆分，拆分后会带来不少好处，如开发人员关注点可按照域来分散研发，队员只需要关心自己模块所在的仓库，对各自核心的业务场景关注思考更加集中和收拢。

这种情况下，「Multirepo」（Polyrepo 也是一个意思）就更适合，我们称之为**多仓多模块管理**。模块分工更明确，可拓展可复用性更强，调试构建发布能力也有一定提升。

此时目录架构大概是这样的：

```text
project
├── node_modules/
│   ├── lib@1.0.0
│   ├── lib@2.0.0
│   ├── pkgA
│   ├── pkgB
│   └── ..
├── src/
└── package.json

packageA
├── node_modules/
│   └── lib@1.0.0
├── src/
└── package.json

packageB
├── node_modules/
│   └── lib@2.0.0
├── src/
└── package.json
```

#### `Multirepo`优点

1. 便于代码复用
2. 模块组件独立开发调试，业务理解清晰度高
3. 人员编排分工更加明确
4. 提高研发人员的公共抽取思维能力
5. 源代码访问权限设置灵活

#### `Multirepo`缺点

1. 模块划分力度不容易把握
2. 共同引用的版本问题，容易导致重复安装相同依赖的多个版本
3. 构建配置不服用，不好管理
4. 串行构建，修改模块体量大时，发布成本急剧上升
5. Code Review、Merge Request 从各自模块仓库执行，比较发散

### Monorepo

随着组件/模块越来越多，multirepo 维护成本越来越大，依赖复杂度和存储构建复杂度的缺点会成倍增长，有没有一种更好的管理模式，既能享受到【组件化多包管理】的收益，又能减轻工程复杂度引起的影响呢？这时就提出了 Monorepo（单仓多模块管理）的概念。

Monorepo 其实不是一个新的概念，在软件工程领域，它已经有着十多年的历史了。它是相对于 Multirepo 而言的一种模式，概念上非常好理解，就是把多个项目放在一个仓库里面。用统一的本地关联、构建、发布流程，来消费业务域下所有管理的组件模块。

此时目录架构大概是这样的：

```text
project
├── node_modules/
│   ├── lib@2.0.0
│   ├── pkgA
│   ├── pkgB
│   └── ..
├── src/
└── package.json

mono-project
├── node_modules/
│   └── lib@2.0.0
├── packages/
│   ├── packageA
│   │    └── package.json
│   └── packageB
│        └── package.json
└── package.json
```

#### `Monorepo`优点

1. 所有源码在一个仓库内，分支管理与单体应用一样简单
2. 公共依赖显示更清晰，更方便统一公共模块版本
3. 统一的配置方案，统一的构建策略
4. 并行构建，执行效率提升
5. 保留 multirepo 的主要优势
   - 代码复用
   - 模块独立管理
   - 分工明确，业务场景独立
   - 代码耦合度降低
   - 项目引入时，除去非必要组件代码
6. CR 和 MR 由一个仓库发布，阅读和处理十分方便

#### `Monorepo`缺点

1. 性能问题：当仓库的代码规模非常的巨大，达到 GB/TB 的级别，会增大开发环境的代码 git clone、pull 成本，以及安装成本，本地硬盘的压力，执行 git status 也可能需要花费数秒甚至数分钟的时间。
2. 打包构建需要专门优化，否则会出现打包时间过长。
3. 权限管理问题：项目粒度的权限管理较为困难，github、gitlab 权限目前不支持文件夹级别。

## 优缺点对比

因为 Monolithic 基本适用于中小型项目开发，这里我们只对大型项目开发时采用的 Multirepo 和 MonoRepo 进行优缺点对比。

| 场景                             | multirepo                                                                                                                                    | monorepo                                                                                                                                                                                           |
| :------------------------------- | :------------------------------------------------------------------------------------------------------------------------------------------- | :------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 项目代码维护                     | ❌ 多个仓库需要分别 download 各自的 node_modules，像这种上百个包的，多少内存都不够用                                                         | ✅ 代码都只一个仓库中，相同依赖无需多分磁盘内存。                                                                                                                                                  |
| 代码可见性                       | ❌ 包管理按照各自 owner 划分，当出现问题时，需要到依赖包中进行判断并解决<br>✅ 对需要代码隔离的情况友好，研发者只关注自己核心管理模块本身    | ✅ 每个人可以方便地阅读到其他人的代码，这个横向可以为团队带来更好的协作和跨团队贡献，不同开发者容易关注到代码问题本身<br>❌ 但同时也会容易产生非 owner 管理者的改动风险<br>❌ 不好进行代码可视隔离 |
| 代码一致性                       | ❌ 需要收口 eslint 等配置包到统一的 npm 包，再到各自项目引用，这就允许每个包还能手动调整配置文件                                             | ✅ 当您将所有代码库放在一个地方时，执行代码质量标准和统一风格会更容易。                                                                                                                            |
| 代码提交                         | ❌ 底层组件升级，需要通知到所有项目依赖的相关方，并进行回归<br>❌ 每个包的修改需要分别提交                                                   | ✅ API 或共享库中的重大更改能够立即公开，迫使不同的开发者需要提前沟通并联合起来。每个人都必须跟上变化。<br>✅ 提交使大规模重构更容易。开发人员可以在一次提交中更新多个包或项目。                   |
| 唯一来源                         | ❌ 子包引用的相同依赖的不同版本的包                                                                                                          | ✅ 每个依赖项的一个版本意味着没有版本冲突，也没有依赖地狱。                                                                                                                                        |
| 开发                             | ✅ 仓库体积小，模块划分清晰。<br>❌ 多仓库来回切换（编辑器及命令行），项目一多真的得晕。如果仓库之间存在依赖，还得各种 npm link。            | ✅ 只需在一个仓库中开发，编码会相当方便。<br>✅ 代码复用高，方便进行代码重构。<br>❌ 项目如果变的很庞大，那么 git clone、安装依赖、构建都会是一件耗时的事情。                                      |
| 工程配置                         | ❌ 各个团队可能各自有一套标准，新建一个仓库又得重新配置一遍工程及 CI / CD 等内容。                                                           | ✅ 工程统一标准化                                                                                                                                                                                  |
| 依赖管理                         | ❌ 依赖重复安装，多个依赖可能在多个仓库中存在不同的版本，npm link 时不同项目的依赖可能会存在冲突问题。                                       | ✅ 共同依赖可以提取至 root，版本控制更加容易，依赖管理会变的方便。                                                                                                                                 |
| 代码管理                         | ✅ 各个团队可以控制代码权限，也几乎不会有项目太大的问题。                                                                                    | ❌ 代码全在一个仓库，如果项目一大，几个 G 的话，用 Git 管理可能会存在问题。<br>❌ 代码权限如果需要设置，暂时不支持                                                                                 |
| 部署（这部分两者其实都存在问题） | ❌ multi repo 的话，如果各个包之间不存在依赖关系倒没事，一旦存在依赖关系的话，开发者就需要在不同的仓库按照依赖先后顺序去修改版本及进行部署。 | ❌ 而对于 mono repo 来说，有工具链支持的话，部署会很方便，但是没有工具链的话，存在的问题一样蛋疼。（社区推荐 pnpm、lerna）                                                                         |
| 持续集成                         | ❌ 每个 repo 需要定制统一的构建部署过程，然后再各自执行                                                                                      | ✅ 可以为 repo 中的每个项目使用相同的 CI/CD 部署过程。<br>✅ 同时未来可以实现更自动化的部署方式，一次命令完成所有的部署                                                                            |

总体来说，当业务发展到一定规模时，monorepo 的升级相比 multirepo 来说，是利远大于弊的。

## 现状与生态

**再次强调**

Monorepo 只是一个管理概念，实际上它并不代表某项具体的技术，更不是所谓的框架。开发人员需要根据不同场景、不同的研发习惯，使用相应的技术手段或者工具，来达到或者完善它的整个流程，从而达到更好的开发和管理体验。

目前前端领域的 Monorepo 生态的显著特点是只有库，而没有大一统的框架或者完整的构建系统来支持。而 Monorepo 生态，整体由**包管理方案、包版本方案、包构建方案**三部分组成。

值得一提的是，现有生态社区中，Nx、Lerna、Turborepo 脱颖而出。

- 包管理方案：npm、yarn、pnpm
- 包版本方案：Lerna、Changesets
- 包构建方案：Turborepo、Nx

## `Monorepo`方案

### pnpm

pnpm 是自带 Monorepo 的解决方案之一，详细分析见：[pnpm](../node/包管理工具.md#pnpm)

vue 和 vite 开发团队都在使用 pnpm 管理 monorepo 项目

#### `pnpm`优点

天然支持 Monorepo(在根目录给所有空间安装依赖、在根目录单独给子包安装依赖)

#### `pnpm`缺点

1. 需要手动提升公共依赖。
2. 需要手动指定任务(dev,build)执行，任务不支持并行执行，影响构建速度。
3. 不支持自动版本控制，需要依赖第三方工具，官方推荐两个工具 changesets、Rush。
4. 没有通用的脚手架模板。
5. 不支持缓存。
6. 不支持依赖分析。

pnpm 推荐的方案其实是 changesets，但是 changesets 的发版流程更贴近 Github Action Workflow，以及 打 changeset 然后 version 的概念和流程相对 lerna 会复杂一些。

### Lerna

Lerna 是一个管理工具，用于管理包含多个软件包（package）的 JavaScript 项目。它可以优化使用 git 和 npm 管理多包存储库的工作流程。Lerna 主流应用在处理版本、构建工作流以及发布包等方面都比较优秀，既兼顾版本管理，还支持全量发布和单独发布等功能。在前端领域，它是最早出现也是相当长一段时间 monorepo 方案的事实标准，具有统治地位，很多后来的工具的概念或者 workspaces 结构都借鉴了 lerna，是 lerna 的延续。在业界实践中，比较多的时间上，都是采用 Yarn 配合 lerna 组合完整的实现了 Monorepo 中项目的包管理、更新到发布的全流程。

后来停更了相当长一段时间，至今还是不支持 pnpm 的 workspaces（pnpm 下有 workspace:protocol，lerna 并没有支持），与 yarn 强绑定。

最近由 nx 的开发公司 nrwl 接手维护，不过新增的 features 都是围绕 nx 而加，nrwl 目前似乎还并没有其他方向的 bug fix 或者新增 features 的计划。不过社区也出现了 lerna-lite ，可以作为 lerna 长久停滞的补充和替代，主要的新 features 就是支持在 pnpm workspaces。

#### `Lerna`优点

1. 依赖自动提升
2. 交给 Nx 公司之后，支持开启缓存、内部依赖分析、任务分析
3. 检测改动 commit 影响的包，区分提示
4. 自带版本控制（能分析出 private:false 的包，引导版本号提升）

#### `Lerna`缺点

1. 默认 npm，`npm@7`版本以下不支持 Monorepo，只能安装根目录的依赖，需要使用 `lerna bootstrap --hoist`，`npm@7`版本以上支持，可以直接 npm 安装所有子包的依赖

推荐导读：

1. lerna：https://www.lernajs.cn/
2. lerna-lite：https://github.com/ghiscoding/lerna-lite
3. Nx：https://nx.dev/

### Turbo

上述提到传统的 Monorepo 解决方案中，项目构建时如果基于多个应用程序存在依赖构建，耗时是非常可怕的。Turborepo 的出现，正是解决 Monorepo 慢的问题。

Turborepo 是一个用于 JavaScript 和 TypeScript 代码库的高性能构建系统。通过增量构建、智能远程缓存和优化的任务调度，Turborepo 可以将构建速度提高 85% 或更多，使各种规模的团队都能够维护一个快速有效的构建系统，该系统可以随着代码库和团队的成长而扩展。

```json
{
  "pipeline": {
    "build": {
      //   ^^^^^
      "dependsOn": ["^build"],
      "outputs": ["dist/**", ".next/**"]
    },
    "lint": {},
    "dev": {
      //   ^^^
      "cache": false
    }
  }
}
```

- 默认使用缓存
- 自动识别项目中的 dev build 命令，并全量运行

```bash
turbo build
```

- 仅运行某个单独的包，使用--filter

```bash
turo dev --filter package1
```

#### `turbo`优点

1. 多任务并行处理
2. 云缓存：多人开发共享缓存
3. 任务管道
4. 约定配置：显式声明，执行顺序

#### `turbo`缺点

1. 版本控制不支持，官方推荐 Changesets

推荐导读：https://vercel.com/blog/vercel-acquires-turborepo

## `Monorepo`实战

无界（Wujie）微前端是目前比较流行的微前端框架之一，它的框架会自动生成一套 turborepo 仓库模板，这里以一个`wujie-demo`的项目模板为例，讲解`pnpm+turbo`组合的 turborepo 方案（不考虑多个 git 仓库，如有需要，需对子应用做 git 初始化，并额外添加 Changesets 来管理）。

### 目录架构

```text
wujie-demo
├── CONTRIBUTING.md
├── LICENSE
├── README.md
├── commitlint.config.js
├── examples
│   ├── main-react # 主应用-react
│   │   ├── CHANGELOG.md
│   │   ├── README.md
│   │   ├── config
│   │   │   ├── env.js
│   │   │   ├── getHttpsConfig.js
│   │   │   ├── jest
│   │   │   │   ├── babelTransform.js
│   │   │   │   ├── cssTransform.js
│   │   │   │   └── fileTransform.js
│   │   │   ├── modules.js
│   │   │   ├── paths.js
│   │   │   ├── webpack
│   │   │   │   └── persistentCache
│   │   │   │       └── createEnvironmentHash.js
│   │   │   ├── webpack.config.js
│   │   │   └── webpackDevServer.config.js
│   │   ├── package.json
│   │   ├── public
│   │   │   ├── favicon.ico
│   │   │   ├── index.html
│   │   │   ├── logo192.png
│   │   │   ├── logo512.png
│   │   │   ├── manifest.json
│   │   │   └── robots.txt
│   │   ├── scripts
│   │   │   ├── build.js
│   │   │   ├── integration.js
│   │   │   ├── start.js
│   │   │   └── test.js
│   │   └── src
│   │       ├── App.js
│   │       ├── App.test.js
│   │       ├── fetch.js
│   │       ├── hostMap.js
│   │       ├── index.css
│   │       ├── index.js
│   │       ├── lifecycle.js
│   │       ├── logo.svg
│   │       ├── pages
│   │       │   ├── All.js
│   │       │   ├── Home.js
│   │       │   ├── Vite.js
│   │       │   ├── Vue2.js
│   │       │   └── Vue3.js
│   │       ├── plugin.js
│   │       ├── reportWebVitals.js
│   │       └── setupTests.js
│   ├── vite # 子应用 vite
│   │   ├── README.md
│   │   ├── index.html
│   │   ├── package.json
│   │   ├── public
│   │   │   └── vite.svg
│   │   ├── src
│   │   │   ├── App.vue
│   │   │   ├── assets
│   │   │   │   ├── vite.png
│   │   │   │   └── vue.svg
│   │   │   ├── components
│   │   │   │   ├── AppendBody.vue
│   │   │   │   └── HelloWorld.vue
│   │   │   ├── main.ts
│   │   │   ├── router
│   │   │   │   └── index.ts
│   │   │   ├── style.css
│   │   │   ├── views
│   │   │   │   ├── Communication.vue
│   │   │   │   ├── Dialog.vue
│   │   │   │   ├── Home.vue
│   │   │   │   ├── Location.vue
│   │   │   │   └── State.vue
│   │   │   └── vite-env.d.ts
│   │   ├── tsconfig.json
│   │   ├── tsconfig.node.json
│   │   └── vite.config.ts
│   ├── vue2 # 子应用 vue2
│   │   ├── README.md
│   │   ├── babel.config.js
│   │   ├── jsconfig.json
│   │   ├── package.json
│   │   ├── public
│   │   │   ├── favicon.ico
│   │   │   └── index.html
│   │   ├── src
│   │   │   ├── App.vue
│   │   │   ├── assets
│   │   │   │   └── logo.png
│   │   │   ├── components
│   │   │   │   ├── AppendBody.vue
│   │   │   │   └── HelloWorld.vue
│   │   │   ├── index.css
│   │   │   ├── main.js
│   │   │   ├── pageLifeTest.js
│   │   │   ├── router
│   │   │   │   └── index.js
│   │   │   ├── store
│   │   │   │   └── index.js
│   │   │   └── views
│   │   │       ├── Communication.vue
│   │   │       ├── Dialog.vue
│   │   │       ├── Home.vue
│   │   │       └── Location.vue
│   │   └── vue.config.js
│   └── vue3 # 子应用 vue3
│       ├── CHANGELOG.md
│       ├── README.md
│       ├── babel.config.js
│       ├── package.json
│       ├── public
│       │   ├── favicon.ico
│       │   └── index.html
│       ├── src
│       │   ├── App.vue
│       │   ├── assets
│       │   │   └── logo.png
│       │   ├── components
│       │   │   ├── AppendBody.vue
│       │   │   └── HelloWorld.vue
│       │   ├── index.css
│       │   ├── main.js
│       │   ├── router
│       │   │   └── index.js
│       │   └── views
│       │       ├── Communication.vue
│       │       ├── Dialog.vue
│       │       ├── Home.vue
│       │       ├── Location.vue
│       │       └── State.vue
│       └── vue.config.js
├── package.json
├── pnpm-lock.yaml
├── pnpm-workspace.yaml
├── scripts # sh构建用脚本，忽略
│   ├── local-angular12-build.sh
│   ├── local-doc-build.sh
│   ├── local-main-react.sh
│   ├── local-main-vue.sh
│   ├── local-react16-build.sh
│   ├── local-react17-build.sh
│   ├── local-vite-build.sh
│   ├── local-vue2-build.sh
│   └── local-vue3-build.sh
└── turbo.json  # turbo配置文件
```

简而言之，上面的目录架构，就是包含了一个 react 的主应用，以及三个 vite(vue3)、vue3、vue2 的子应用，共同组合而成的微前端项目。

### `turbo.json`

```json
{
  "pipeline": {
    "start": {},
    "dev": {
      "dependsOn": ["^esm"]
    },
    "docs:dev": {},
    "test": {},
    "build": {
      "cache": false
    },
    "lint": {
      "dependsOn": ["^esm"]
    },
    "esm": {},
    "start:esm": {}
  }
}
```

项目中的 turbo 配置很简单，build 时关闭了 cache 缓存，而`"dependsOn": ["^esm"]`，实际上就是对应`esm`和`start:esm`两个配置选项的，这里并没有用到它们，因此 dev 和 lint 时并不存在前置运行依赖

### `package.json`

```json
# package.json
{
  "name": "wujie-project",
  "version": "0.0.0",
  "description": "极致的微前端框架",
  "private": true,
  "scripts": {
    "dev": "turbo run start --parallel --no-cache",
    "doc": "turbo run docs:dev --filter=wujie-doc",
    "build": "turbo run build --filter=\"wujie-*\" --filter=wujie",
    "clean": "rimraf node_modules **/*/node_modules",
    "test": "turbo run test",
    "lint": "turbo run lint --filter wujie",
    "commitlint": "commitlint -E COMMIT_EDITMSG_PATH",
    "husky-commitlint": "commitlint -e",
    "prepare": "husky install"
  },
  "repository": {
    "type": "git",
    "url": "https://github.com/Tencent/wujie.git"
  },
  "author": "yiludege",
  "license": "MIT",
  "devDependencies": {
    "@changesets/cli": "^2.24.3",
    "@commitlint/cli": "^16.2.3",
    "@commitlint/config-conventional": "^16.2.1",
    "husky": "^7.0.4",
    "lint-staged": "^12.4.1",
    "rimraf": "^3.0.2",
    "turbo": "1.3.2"
  },
  "dependencies": {
    "prettier": "latest"
  }
}
```

```yaml
# pnpm-workspace.yaml
packages:
  - "examples/*"
```

turborepo 项目有别于普通 Monolithic 项目的地方就在于`package.json`的 scripts 配置。

**注意，我们使用 pnpm 来管理项目，在 pnpm-workspace.yaml，已明确位于 examples 目录下的应用都是 pnpm 的工作空间**

实际的最大区别就是，本地运行和打包命令的变化，由 turbo 来主导

`turbo run start --parallel --no-cache`

`turbo run start`：表示项目由 turbo 运行，启动命令 start，则 pnpm 的工作空间下所有的子应用，都将默认运行`pnpm run start`命令，因此也就实现了同时启动项目的目的

`--parallel`：表示多个项目是并行启动的，最大化节省了启动时间

`--no-cache`：表示不使用缓存，这是模板的默认配置，实际上大部分情况下都可以开启 cache

`turbo run build --filter=\"wujie-*\" --filter=wujie`

build命令与dev含义基本相同，多出的`--filter`意思是排除掉指定的目录，让其他目录的项目启动`pnpm run build`命令

### `turbo`小结

turbo本身应用起来非常简单，在`turbo.json`中自定义pipeline来设置命令，并调整前后置关系，然后在`package.json`中调用命令即可。turbo不提供依赖复用、依赖扁平化和工作空间等，这部分的功能实现靠pnpm。总的来说，对于一个大型的monorepo项目而言，改造成本很低。

turbo配置项API：https://turbo.build/repo/docs/reference/configuration

