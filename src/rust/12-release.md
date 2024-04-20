---
title: 构建与发布
order: 12

tag:
  - Cargo安装
  - 自定义构建
  - 文档注释
  - 导出和发布
  - Cargo工作空间
---

## 二进制安装

从 crate.io 安装二进制 crate

```shell
cargo install
```

来源：https://crates.io

限制：只能安装具有二进制目标（binary target）的 crate

二进制目标 binary target：是一个可运行程序，由拥有 src/main.rs 或其它被指定为二进制文件的 crate 生成

通常：README 里有关于 crate 的描述：

- 是否拥有 library target
- 是否拥有 binary target
- 或者两者都有

cargo install 安装的二进制存放在根目录的 bin 文件夹

如果你用 rustup 安装的 Rust，没有任何自定义配置，那么二进制存放目录是`$HOME/.cargo/bin`

使用前要注意确保该目录在环境变量`$PATH`中

### 自定义命令扩展

cargo 被设计成可以使用子命令来扩展

如果`$PATH`中的某个二进制是`cargo-something`，你可以像子命令一样运行：

```shell
cargo something
```

类似这样的自定义命令可以通过该命令列出：`cargo --list`

优点：可使用 cargo install 来安装扩展，像内置工具一样来运行

## 自定义构建

通过 release profile 自定义构建

release profile 是预定义的；可使用不同的配置，对代码编译拥有更多的控制

每个 profile 的配置都独立于其它的 profile

Cargo 主要的两个 profile：

1. dev profile：适用于开发，`cargo build`
2. release profile：适用于发布，`cargo build --release`

在`Cargo.toml`里添加`[profile.xxxx]`区域，在里面覆盖默认配置的子集

```toml
[profile.dev]
## 默认是0
opt-level = 1

[profile.release]
# 默认是3
opt-level = 3
```

默认值和完整选项，请参见：https://doc.rust-lang.org/cargo/

## 文档注释

文档注释用于

- 生成 HTML 文档
- 显示公共 API 的文档注释：如何使用 API
- 使用`///`
- 支持 Markdown
- 放置在被说明条目之前

### 文档命令

cargo doc：运行 rustdoc 工具（Rust 安装包自带），把生成的 HTML 文档放在`target/doc`目录下

cargo doc -open：构建当前 crate 的文档（也包含 crate 依赖项的文档），同时在浏览器打开文档

### 常用章节

`#Examples`

其它常用章节：

- Panics：函数可能发生 panic 的场景
- Errors：如果函数返回 Result，描述可能的错误种类，以及可导致错误的条件
- Safety：如果函数处于 unsafe 调用，就应该解释函数 unsafe 的原因，以及调用者确保的使用前提

````rust
/// Adds one to the number given.
///
/// # Examples
///
/// ```
/// let arg = 5;
/// let answer = my_crate::add_one(arg);
///
/// assert_eq!(6, answer);
/// ```
pub fn add_one(x: i32) -> i32 {
  x + 1
}
````

### 测试文档注释

示例代码块的附加值：运行 cargo test 将把文档注释中的示例代码作为测试来运行

### 注释项添加文档注释

符号：`//!`

这类注释通常用来描述 crate 和模块，可以简单理解为文件头部注释：

- crate root（按管理 src/lib.rs）
- 一个模块内，将 crate 或模块作为一个整体进行记录

## 导出与发布

### 快捷导出

使用 pub use 导出方便使用的公共 API

问题：crate 的程序结构在开发时对于开发者很合理，但对于它的使用者不够方便

开发者会把程序结构分为很多层，使用者想找到这种深层结构中的某个类型很费劲

例如：`my_crate:;some_module::another_module::UsefulType;`

解决办法：

- 不需要重新组织内部代码结构
- 使用 pub use：可以重新导出，创建一个与内部私有结构不同的对外公共结构

### 发布网站

crates.io 支持通过发布包来共享代码

crates 的注册表在 https://crates.io/

它会分发已注册的包的源代码，主要托管开源代码

发布 crate 前，需要在 crates.io 创建账号并获得 API token

```shell
cargo login [你的API token]
```

你的 API token 存储在本地`~/.cargo/credentials`

API token 可以在网站上撤销

### 发布元数据

发布 crate 之前，需要在`Cargo.toml`的`[package]`区域为 crate 添加一些元数据：

- crate 需要唯一名称：name
- description：一两句话即可，会出现在 crate 搜索的结果里
- license：需提供许可证标识值（可到 http://spdx.org/licenses/ 查找），可用 OR 指定多个 license
- version
- author

发布命令：cargo publish

crate 一旦发布，就是用就行的，该版本无法覆盖，代码无法删除

目的：依赖于该版本的项目可继续正常工作

### 发布新版本

修改 crate 后，需要先修改`Cargo.toml`里面的 version 值，再进行重新发布

参照 http://semver.org/ 来使用你的语义版本

### 撤回版本

虽然不可以删除 crate 之前的版本，但是可以防止其它项目把它作为新的依赖：yank(撤回) 一个 crate 版本

该操作是为了防止新项目依赖于该版本，同时已经存在的项目可继续将其作为依赖并可下载

yank 意味着：

- 所有已经产生`Cargo.lock`的项目都不会中断
- 任何将来生成的`Cargo.lock`文件都不会使用被 yank 的版本

命令：

- yank 一个版本（不会删除任何代码）：`cargo yank --vers 1.0.1`
- 取消 yank：`cargo yank --vers 1.0.1 --undo`

## 工作空间

cargo 工作空间：帮助管理多个相互关联且需要协同开发的 crate

cargo 工作空间是一套共享同一个`Cargo.lock`和输出文件夹的包

可理解为 Rust 的 [monorepo](../vcs/2-repo.html#monorepo方案) 方案

### 创建工作空间

有多重方式组件工作空间：1 个二进制 crate，2 个库 crate

- 二进制 crate：main 函数，依赖于其它 2 个库 crate
- 其中 1 个库 crate 提供 add_one 函数
- 另外 1 个库 crate 提供 add_two 函数

```txt
# 文件目录
|--- adder
|--- add-one
|--- Cargo.toml
|--- Cargo.lock
```

```toml
[workspace]

members = [
  "adder",
  "add-one"
]
```

### 外部依赖

工作空间只有一个`Cargo.lock`文件，在工作空间的顶层目录

保证工作空间内所有 crate 使用的依赖版本都相同

保证工作空间内所有 crate 相互兼容
