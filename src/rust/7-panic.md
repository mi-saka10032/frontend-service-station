---
title: 错误处理
order: 7

tag:
  - Panic
  - Result
---

## 错误处理概述

在大部分情况下，在编译时支持提示错误，并处理

错误分类：

- 可恢复，例如文件未找到，可再次尝试
- 不可恢复，例如访问的索引超出范围

**注意**

Rust 没有类似的异常机制，取而代之的是：

- 可恢复错误使用：`Result<T,E>`
- 不可恢复：`panic!`宏

## `panic!`

当`panic!`宏执行：

- 你的程序会打印一个错误信息
- 展开（unwind）、清理调用栈（stack）
- 退出程序
- 为应对 panic，Rust 也支持展开 or 中止（abort）调用栈

默认情况下，当 panic 发生时：

- 程序展开调用栈（工作量大），Rust 沿着调用栈往回走，并清理每个遇到的函数中的数据
- 或立即中止调用栈，此时不进行清理，直接停止程序，而内存需要操作系统 OS 进行清理

若是想让构建产物的二进制文件尽可能小，我们需要把设置从“展开”改为“中止”操作

### `Cargo.toml设置`

```toml
[package]
# 内容略

[dependencies]
# 内容略

[profile.release]
panic = 'abort'
```

### 回溯信息

`panic!`可能出现在：

- 我们写的代码中
- 我们所依赖的代码中

可通过调用`panic!`的函数的回溯信息来定位引起问题的代码。通常是设置环境变量`RUST_BACKTRACE`来得到回溯信息

为了获取带有调试信息的回溯，必须启用调试符号（不带`--release`），开发环境下（cargo run）默认不携带该信息

```shell
# 简要回溯细节
set RUST_BACKTRACE=1 && cargo run
# 完整回溯细节
set RUST_BACKTRACE=full && cargo run
```

## `Result`枚举错误

```rust
enum Result<T, E> {
  Ok(T),
  Err(E),
}
```

T：操作成功情况下，Ok 变体里返回的数据类型
E：操作失败情况下，Err 变体里返回的错误类型

### `match处理`

以 fs 的 open 方法为例，搭配 match 来处理错误（和 Option 枚举一样，Result 及其变体也是由 prelude 带入作用域）

```rust
use std::fs::File;

fn main() {
  let f = File::open("hello.txt");

  let f = match f {
    Ok(file) => file,
    Err(error) => match error.kind() {
      ErrorKind::NotFound => match File::create("hello.txt") {
        Ok(fc) => fc,
        Err(e) => panic!("Error creating file {:?}", e);
      },
      other_error => panic!("Error opening file {:?}", other_error),
    }
  };
}
```

上面是一个匹配不同错误的例子，使用了很多 match。match 很有用，但是也非常原始

`Result<T, E>`的另一种用法是闭包（closure）：

- 它们接收闭包作为参数
- 使用 match 实现
- 使用这些方法会让代码更简洁

### `unwrap处理`

unwrap 是 match 表达式的一个快捷方法

- 如果 Result 结果是 Ok，返回 Ok 里面的值
- 如果 Result 结果是 Err，调用`panic!`宏

```rust
use std::fs::File;

fn main() {
  let f = File::open("hello.txt").unwrap();
}
```

### `expect处理`

和 unwrap 类似，但可指定错误信息

```rust
use std::fs::File;

fn main() {
  let f = File::open("hello.txt").expect("无法打开文件 hello.txt");
}
```

## 传播错误

将错误返回给调用者

```rust
use std:fs::File;
use std::io;
use std::io::Read;

fn read_username_from_file() -> Result<String, io::Error> {
  let f = File::open("hello.txt");

  let mut f = match f {
    Ok(file) => file,
    Err(e) => return Err(e),
  };

  let mut s = String::new();
  match f.read_to_string(&mut s) {
    Ok(_) => Ok(s),
    Err(e) => Err(e),
  }
}
```

### `?`运算符

传播错误的快捷方式

- 如果 Result 是 Ok：Ok 中的值就是表达式的结果，然后继续执行程序
- 如果 Result 是 Err：Err 就是整个函数的返回值，就像使用了 return

```rust
use std:fs::File;
use std::io;
use std::io::Read;

fn read_username_from_file() -> Result<String, io::Error> {
  let mut f = File::open("hello.txt")?;
  let mut s = String::new();
  f.read_to_string(&mut s)?;
  Ok(s)
}
```

`?`还支持链式调用

```rust
use std:fs::File;
use std::io;
use std::io::Read;

fn read_username_from_file() -> Result<String, io::Error> {
  let mut s = String::new();
  File::open("hello.txt")?.read_to_string(&mut s)?;
  Ok(s)
}
```

**注意：**`?`运算符只能用于返回 Result 的函数

### `?&from`

`Trait std::convert::From`上的 from 函数

- 用于错误之间的转换
- 被`?`所应用的错误，会隐式地被 from 函数处理

当`?`调用 from 函数时：它所接收的错误类型会被转化为当前函数返回类型所定义的数据类型

主要用于针对不同错误原因，返回同一种错误类型，只要每个错误类型实现了转换为所返回的错误类型的 from 函数即可

### `main`错误类型

通常情况下，main 函数的返回类型是：`()`

但是 main 函数的返回类型也可以是：`Result<(), Box<dyn Error>>`

其中`Box<dyn Error>`是 trait 对象

```rust
use std::error::Error;
use std::fs::File;

fn main() -> Result<(), Box<dyn Error>> {
  let f = File::open("hello.txt")?;
  Ok(())
}
```

## 错误使用原则

- 在定义一个可能失败的函数时，优先考虑返回 Result，其次才是`panic!`

1. 编写示例：主要通过使用 unwrap 来控制
2. 原型代码：unwrap、expect
3. 测试：unwrap、expect

- 当你比编译器掌握更多的信息

你可以确定 Result 就是 Ok：unwrap

### 指导性建议

当代码最终可能处于损坏状态时：最好使用`panic!`

损坏状态：某些假设、保证、约定或不可变性被打破

- 例如非法的值、矛盾的值或空缺的值被传入代码
- 以及下列中的一条：
  1. 这种损坏状态并不是预期能否偶尔发生的事情
  2. 在此之后，您的代码如果处于这种损坏状态就无法运行
  3. 在您使用的类型中没有一个好的方法来将这些信息（处于损坏状态）进行编码

### 场景建议

- 调用你的代码，传入无意义的参数值：使用`panic!`
- 调用外部不可控代码，返回非法状态，你无法修复：使用`panic!`
- 如果失败是可预期的：Result
- 当你的代码对值进行操作，首先应该验证这些值：使用`panic!`
