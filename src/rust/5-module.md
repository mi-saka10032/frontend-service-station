---
title: 包与模块
order: 5

tag:
  - Package
  - Crate
  - Module
  - Path
---

## 代码组织与模块系统

代码组织主要包括：

- 哪些细节可以暴露，哪些细节是私有的
- 作用域内哪些名称有效

模块系统：

- Package（包）：Cargo 的特性，支持构建、测试、共享 crate
- Crate（单元包）：一个模块树，可产生一个 library 或可执行文件
- Module（模块）、use：控制代码的组织、作用域、私有路径
- Path（路径）：为 struct、function 或 module 等项命名的方式

## Package&Crate

Crate 有两种类型：

1. binary，可理解为**入口文件**
2. library，可理解为**库文件**

CrateRoot：

- 源代码文件
- Rust 编译器从这里开始，组成你的 crate 的根 module

Package：

- 包含一个 Cargo.toml，描述了如何构建这些 crates
- 只能包含 0-1 个 library crate
- 可以包含任意数量的 binary crate
- 但必须至少包含一个 crate（library 或 binary）

### `Cargo`约定

Cargo 的惯例约定：

`src/main.rs`：

- binary crate 的 crate root
- crate 名字与 package 名字相同

`src/lib.rs`：

- package 包含一个 library crate
- library create 的 crate root
- crate 名字与 package 名字相同

**一个 Package 可以同时包含`src/main.rs`和`src/lib.rs`**

这表示它包含了一个 binary crate 和一个 library crate，且它们名称都与 package 名称相同

**这两个文件（任意一个）的内容形成了名为 crate 的模块，位于整个模块树的根部**

这表示如果这个项目对外暴露 lib，那么它可被定义为功能 lib 库；如果对外暴露 main，那么它可被定义为 project 库

**一个 Package 可以有多个 binary crate**

这些 binary 入口文件放在 src/bin 下面，每个文件是单独的 binary crate

### `Crate`作用

主要作用是将相关功能组合到一个作用域内，便于在项目间进行共享，以防冲突

例如：`rand crate`，访问它的功能需要通过它的名字：rand

### dependencies

1. 在`cargo.toml`中添加依赖的包(package)。可以在 toml 文件中输入依赖，保存文件后依赖 vscode 的插件自动安装，也可以使用`cargo add rand`命令实现
2. 使用 use 将特定条目引入作用域

```toml
[package]
name = "my-project"
version = "0.1.0"
authors = [abc@qq.com]
edition = "2021"

[dependencies]
rand = "0.5.5"
```

```rust
use rand::Rng;

fn main() {}
```

注意：

标准库（std）也被当作外部包，但是不需要修改 toml 文件来包含 std，rust 自带 std

## Module

在一个 crate 内，将代码进行分组，可理解为**命名空间**或**代码目录**

- 增加可读性，易于复用
- 控制项目（item）的私有性。public、private 区分

### 创建

- 通过 mod 关键字
- 可嵌套
- 可包含其他项（struct、enum、常量、trait、函数等）的定义

```rust
// lib.rs
mod front_of_house {
  mod hosting {
    fn add_to_waitlist() {}
    fn seat_at_table() {}
  }
  mod serving {
    fn take_order() {}
    fn serve_order() {}
    fn take_payment() {}
  }
}
```

### 移动

模块定义时，如果模块名后面是`;`而不是代码块：

- Rust 会从与模块同名的文件中加载内容
- 模块树的结构不会变化

简单来说就是：声明一个模块，但在 src 目录下与模块同名的文件中定义

```rust
// src/front_of_house.rs
mod front_of_house {
  mod hosting {
    fn add_to_waitlist() {}
    fn seat_at_table() {}
  }
  mod serving {
    fn take_order() {}
    fn serve_order() {}
    fn take_payment() {}
  }
}
```

```rust
// src/lib.rs
// 不会报错
mod front_of_house;

pub fn eat_at_restaurant() {
  front_of_house::hosting::add_to_waitlist();
}
```

随着模块逐渐变大，该技术可以让你把模块的内容移动到其他与模块同名的文件夹中

## Path

为了在 Rust 的模块中找到某个条目，需要使用路径 Path

路径有两种形式：

- 绝对路径：从 crate root 开始，使用 crate 名字或字面值 crate
- 相对路径：从当前模块开始，使用 self，super 或当前模块的标识符

路径至少由一个标识符组成，标识符之间使用`::`

### 私有边界

模块不仅可以组织代码，还可以定义私有边界

如果想把函数或 struct 设为私有，可以将它放到某个模块中

Rust 中所有的条目（函数、方法、struct、enum、模块、常量等）默认是私有的

父级模块无法访问子模块的私有条目

子模块里可以使用所有祖先模块的条目

### pub 关键字

使用 pub 关键字来将某些条目标记为公共的，以此来避免父模块访问子模块的条目时发生错误

```rust
// src/lib.rs
mod front_of_house {
  // 注意需加pub
  pub mod hosting {
    // 注意需加pub
    pub fn add_to_waitlist() {}
  }
}

pub fn eat_at_restaurant() {
  // 绝对路径
  crate::front_of_house::hosting::add_to_waitlist();
  // 相对路径
  front_of_house::hosting::add_to_waitlist();
}
```

### super 关键字

用来访问父级模块路径中的内容，类似文件系统中的`../`

```rust
fn serve_order() {}

mod back_of_house {
  fn fix_incorrect_order() {
    cook_order();
    super::serve_order();
    // 使用绝对路径
    crate::serve_order();
  }
  fn cook_order() {}
}
```

### pub+struct

pub 放在 struct 前面：

- struct 是公共的
- struct 的字段默认私有
- struct 的字段需要单独设置 pub 来变成公有

```rust
mod back_of_house {
  pub struct Breakfast {
    pub toast: String,
    seasonal_fruit: String,
  }

  impl Breakfast {
    pub fn summer(toast: &str) -> Breakfast {
      Breakfast {
        toast: String::from(toast),
        seasonal_fruit: String::from("peaches"),
      }
    }
  }
}

pub fn eat_at_restaurant() {
  let mut meal = back_of_house::Breakfast::summer("Rye");
  meal.toast = String::from("Wheat");
  println!("I'd like {} toast please", meal.toast);
  // 上面的seasonal_fruit如果不设为pub，这里会报错
  meal.seasonal_fruit = String::from("blueberries");
}
```

### pub+enum

pub 放在 enum 前面：

- enum 是公共的
- enum 的变体也是公共的

## use

可以使用 use 关键字将路径导入到作用域内。此时，仍遵循私有原则

```rust
mod front_of_house {
  // 注意需加pub
  pub mod hosting {
    // 注意需加pub
    pub fn add_to_waitlist() {}
  }
}

use crate::front_of_house::hosting;

pub fn eat_at_restaurant() {
  hosting::add_to_waitlist();
  hosting::add_to_waitlist();
}
```

use 的习惯用法有：

1. 函数：将函数的父级模块引入作用域（指定到父级）
2. 对于 struct、enum、其他，指定完整路径（指定到本身）
3. 同名条目：指定到父级

```rust
use std::collections:HashMap;

fn main() {
  let mut map = HashMap::new();
  map.insert(1, 2);
}
```

### pub+use

使用 use 将路径（名称）导入到作用域内后，该名称在此作用域内是私有的

使用 pub use，可实现重导出：

- 将条目引入作用域
- 该条目可以被外部代码引入到它们的作用域

```rust
mod front_of_house {
  // 注意需加pub
  pub mod hosting {
    // 注意需加pub
    pub fn add_to_waitlist() {}
  }
}

// 此处如果use前面不加pub，则外部代码即使use该子模块，也无法访问hosting模块
use crate::front_of_house::hosting;

pub fn eat_at_restaurant() {
  hosting::add_to_waitlist();
  hosting::add_to_waitlist();
}
```

### 嵌套路径

如果使用同一个包或模块下的多个条目，可使用嵌套路径在同一行内将上述条目进行引入：

**路径相同的部分::{路径差异的部分}**

如果两个 use 路径之一是另一个的子路径，则需使用 self

```rust
use std::io::{self, Write};

fn main() {}
```

### 通配符

使用`*`可以把路径中所有的公共条目都引入到作用域

注意：谨慎使用

应用场景：

- 测试。将所有被测试代码引入到 test 模块
- 有时被用于预导入（prelude）模块

## as

as 关键字可以为引入的路径指定本地的别名

```rust
use std::fmt::Result;
use std::io::Result as IoResult;

fn f1() -> Result {}

fn f2() -> IoResult {}

fn main() {}
```
