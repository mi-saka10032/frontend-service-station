---
title: Git子模块
order: 3
tag:
  - GitSubmodule
  - MonoRepo
---

## 介绍

关联的前后端链接：

<https://github.com/mi-saka10032/music-system-admin>

<https://github.com/mi-saka10032/jay-music-manage-system>

共有的 Git Submodule 仓库链接（ssh）：`git@github.com:mi-saka10032/music-api.git`

Git Submodule 是 Git 版本控制系统中的一个功能，它允许您将一个 Git 仓库作为另一个 Git 仓库的子模块进行管理。子模块是一个独立的 Git 仓库，可以被包含在其他 Git 仓库中，并且可以独立地进行版本控制和更新。

**为什么我使用 Git Submodule？**

根本原因：

1. 前后端的开发依赖差别巨大，两个仓库并不适合放在一起统一管理；
2. 前后端开发语言都是 ts，又需要相同的变量类型声明；
3. 两个仓库仅需要同步定义接口的入参出参类型即可。

## 原理

Git Submodule 的原理是通过在父仓库中添加一个指向子模块仓库的引用来实现的。父仓库中的引用指向子模块仓库的特定提交（commit），而不是直接包含子模块的文件内容。这样，父仓库只记录子模块的引用和路径信息，而不会将子模块的实际内容包含在其中。

## API

Git Submodule 提供了一组命令行 API 来管理子模块。以下是一些常用的 Git Submodule 命令：

- `git submodule add <repository> <path>`：将一个 Git 仓库添加为子模块，并指定子模块在父仓库中的路径。
- `git submodule init`：初始化父仓库中的子模块，将子模块的引用和路径信息记录在父仓库中。
- `git submodule update`：更新父仓库中的子模块，将子模块的内容拉取到指定的提交。
- `git submodule sync`：同步父仓库中的子模块的 URL 配置。
- `git submodule foreach <command>`：在每个子模块中执行指定的命令。

## 用法

下面的用法会结合之前提到的[仓库链接](#介绍)来说明

两个仓库的子仓库都位于`src/music-api`目录，以这个实际路径为例：

1.初始化子模块

```bash
# 位于项目根目录下
cd src

git submodule add git@github.com:mi-saka10032/music-api.git
```

2.提交子仓库的变更

子仓库的变更提交和普通仓库一样，`add -> commit -> push`

3.父仓库的变更

需要注意，如果子仓库存在变更，那么需要子仓库先提交变更并 push，父仓库再执行子仓库的变更（记录子仓库的分支修改记录）

4.克隆仓库

克隆包含子仓库的父仓库时，除了`git clone`之外，还需要执行子模块的初始化与更新，才能正确拉取最新的子仓库内容

```bash
git clone https://github.com/mi-saka10032/jay-music-manage-system

# 初始化父仓库中的子模块。
git submodule init

# 更新父仓库中的子模块，将子模块的内容拉取到指定的提交
git submodule update
```

## 变更或移除

如果并不需要上面的这个 submodule，或者希望将这个子仓库变更为自己的 submodule，可以按照以下步骤进行操作：

移除 Submodule：

- 进入包含 Submodule 的仓库目录。
- 使用`git submodule deinit <submodule-path>`命令将 Submodule 标记为删除。
- 使用`git rm <submodule-path>`命令从父仓库中移除 Submodule。
- 提交并推送这些变更到您的 GitHub 仓库。

还是以上面的实际路径为例：

```bash
cd src

git submodule deinit music-api

git rm music-api

# 提交变更
```

更换和更新 Submodule 的步骤见[用法](#用法)。
