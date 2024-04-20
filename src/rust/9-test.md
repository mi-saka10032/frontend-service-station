---
title: 自动化测试
order: 9

tag:
  - Rust测试控制
  - 断言
  - 恐慌测试
  - 单元测试
  - 集成测试
---

## 编写和运行测试

### 测试函数

验证非测试代码的功能是否和预期一致

测试函数体（通常）执行的 3 个操作：

1. 准备数据/状态
2. 运行被测试的代码
3. 断言（Assert）结果

测试函数需要使用 test 属性（attribute）进行标注

- Attribute 就是一段 Rust 代码元数据
- 在函数上加`#[test]`，可以把函数变成测试函数

### 运行测试

使用`cargo test`命令运行所有测试函数，Rust 会构建一个 Test Runner 可执行文件。它会运行标注了 test 的函数，并报告其运行是否成功

当使用 cargo 创建 library 项目的时候，会生成一个 test module，里面有一个 test 函数

- 你可以添加任意数量的 test module 或函数

```rust
// src/lib.rs
#[cfg(test)]
mod tests {
  #[test]
  fn it_works() {
    assert_eq!(2 + 2, 4);
  }
}
```

### 测试失败

- 测试函数 panic 就表示失败
- 每个测试运行在一个新线程
- 当主线程看见某个测试线程挂掉了，那个测试标记为失败

```rust
// src/lib.rs
#[cfg(test)]
mod tests {
  #[test]
  fn it_works() {
    assert_eq!(2 + 2, 4);
  }

  #[test]
  fn another() {
    panic!("Make this test fail");
  }
}
```

## 断言

### `assert!`

`assert!`宏来自标准库，用来确定某个状态是否为 true

- true：测试通过
- false：调用`panic!`，测试失败

```rust
#[derive(Debug)]
pub struct Rectangle {
  length: u32,
  width: u32,
}

impl Rectangle {
  pub fn can_hold(&self, other: &Rectangle) -> bool {
    self.length > other.length && self.width > other.width
  }
}

#[cfg(test)]
mod tests {
  // 表示使用外部模块的所有内容
  use super::*;

  #[test]
  fn larger_can_hold_smaller() {
    let larger = Rectangle {
      length； 8，
      width: 7,
    };
    let smaller = Rectangle {
      length: 5,
      width: 1
    };
    // 根据方法返回的结果状态值来判断程序成功or失败
    assert!(larger.can_hold(&smaller));
  }
}
```

### 断言相等性

使用`assert_eq!`和`assert_ne!`测试相等性

- 它们都来自标准库
- 判断两个参数是否相等或不等
- 实际上，它们使用的就是`==`和`!=`运算符
- 断言失败：自动打印出两个参数的值
- 使用条件：因为使用 debug 格式打印参数，因此要求参数实现了 PartialEq 和 Debug Traits（所有的基本类型和标准库里大部分类型都实现了）

```rust
pub fn add_two(a: i32) -> i32 {
  a + 2
}

#[cfg(test)]
mod tests {
  use super::*;

  #[test]
  fn it_adds_two() {
    assert_eq!(4, add_two(2));
    // assert_ne!(!5, add_two(2));
  }
}
```

### 自定义错误信息

可以向`assert!`、`assert_eq!`、`assert_ne!`添加可选的自定义消息

这些自定义消息和失败消息都会打印出来

- `assert!`：第一参数必填，自定义消息作为第二个参数
- `assert_eq!`、`assert_ne!`：前两个参数必填，自定义消息作为第三个参数
- 自定义消息会被传递给`format!`宏，可以使用`{}`占位符

```rust
pub fn greeting(name: &str) -> String {
  format!("Hello!");
}

#[cfg(test)]
mod tests {
  use super::*;

  fn greeting_contain_name() {
    let result = greeting("Carol");
    assert!(
      result.contains("Carol"),
      "Greeting didn't contain name, value was '{}'",
      result
    );
  }
}
```

## 恐慌测试

### 验证错误处理的情况

测试除了验证代码的返回值是否正确，还需要验证代码是否如预期的处理了发生错误的情况

可验证代码在特定情况下是否发生了 panic

should_panic 属性（attribute）：

- 函数 panic：测试通过
- 函数没有 panic：测试失败

```rust
pub struct Guess {
  value: u32,
}

impl Guess {
  pub fn new(value: u32) -> Guess {
    if value < 1 || value > 100 {
      panic!("Guess value must be between 1 and 100, got {}.", value)
    }
    Guess { value }
  }
}

#[cfg(test)]
mod tests {
  use super::*;

  #[test]
  #[should_panic]
  fn greater_than_100() {
    Guess::new(101);
  }
}
```

### 让`should_panic`更精确

为 should_panic 属性添加一个可选的 expected 参数：将检查失败消息中是否包含所指定的文字

```rust
pub struct Guess {
  value: u32,
}

impl Guess {
  pub fn new(value: u32) -> Guess {
    if value < 1 {
      panic!("Guess value must be greater than or equal to 1, got {}.", value)
    } else if value > 100 {
      panic!("Guess value must be less than or equal to 100, got {}.", value)
    }
    Guess { value }
  }
}

#[cfg(test)]
mod tests {
  use super::*;

  #[test]
  #[should_panic(expected = "Guess value must be less than or equal to 100")]
  fn greater_than_100() {
    Guess::new(101);
  }
}
```

### `Result`异常判断

无需 panic，可使用`Result<T,E>`作为返回类型编写测试：

- 返回 Ok：测试通过
- 返回 Err：测试失败

```rust
#[cfg(test)]
mod tests {
  #[test]
  fn it_works() -> Result<(), String> {
    if 2 + 2 == 4 {
      Ok(())
    } else {
      Err(String::from("two plus two does not equal four"))
    }
  }
}
```

注意：不要在使用`Result<T,E>`编写的测试上标注`#[should_panic]`

## 控制测试运行

改变 cargo test 的行为：添加命令行参数

默认行为是：

- 并行运行
- 所有测试
- 捕获（不显示）所有输出，使读取与测试结果相关的输出更加容易

### 命令行参数

- 针对 cargo test 的参数，紧跟在 cargo test 后面
- 针对 测试可执行程序：放在`--`之后

cargo test --help

显示 cargo test 后面可写参数

cargo test -- --help

显示 cargo test -- 后面可写参数

### 并行运行测试

运行多个测试：默认使用多个县城并行运行

必须确保测试之间：不会互相依赖；不依赖于某个共享状态（环境、工作目录、环境变量等）

`--test-threads`

不想以并行方式运行测试，或想对线程数进行细粒度控制，可以使用`--test-threads`，后面跟着线程数量

### 显式函数输出

默认情况下，如果测试通过，Rust 的 test 库会捕获所有打印到标准输出的内容

如果被测试代码中用到了`println!`

- 测试通过：不会在终端看到`println!`打印的内容
- 测试失败：会看到`println!`打印的内容和失败信息

如果想在成功的测试中看到打印的内容：加上`--show-output`

### 按名称运行测试

选择运行的测试：将测试的名称（一个 or 多个）作为 cargo test 的参数

运行单个测试：指定测试名

运行多个测试：指定测试名的一部分（模块名也可以）

```shell
# 运行单个测试
cargo test add_two_and_two
# 运行多个测试（名称包含add的fn）
cargo test add
```

```rust
pub fn add_two(a: i32) -> i32 {
  a + 2;
}

#[cfg(test)]
mod tests {
  use super::*;

  #[test]
  fn add_two_and_two() {
    assert_eq!(4, add_two(2));
  }

  #[test]
  fn add_three_and_two() {
    assert_eq!(5, add_two(3));
  }
}
```

### 忽略测试

属性：ignore

添加该属性后，测试运行会忽略这个 fn

如果要指定运行被忽略的测试，需要使用`cargo test -- --ignored`命令

```rust
pub fn add_two(a: i32) -> i32 {
  a + 2;
}

#[cfg(test)]
mod tests {
  use super::*;

  #[test]
  fn add_two_and_two() {
    assert_eq!(4, add_two(2));
  }

  #[test]
  #[ignore]
  fn add_three_and_two() {
    assert_eq!(5, add_two(3));
  }
}
```

## 测试组织

Rust 对测试分类：1. 单元测试；2. 集成测试

单元测试：

- 小而专注
- 一次对一个模块进行隔离测试
- 可测试 private 接口

集成测试：

- 在库外部。和其它外部代码一样使用你的代码
- 只能使用 public 接口
- 可能在每个测试中使用到多个模块

### 单元测试

tests 模块上的`#[cfg(test)]`标注：

- 只有运行 cargo test 才编译和运行代码
- 运行 cargo build 会忽略这个标注

集成测试在不同的目录，它不需要`#[cfg(test)]`标注

cfg（configuration）配置：

- 告诉 Rust 下面的条目只有在指定的配置选项下才被包含
- 配置选项 test：由 Rust 提供，用来编译和运行测试
- 只有 cargo test 才会编译代码，包括模块中的 helper 函数和`#[test]`标注的函数

Rust 允许测试私有函数

```rust
pub fn add_two(a: i32) -> i32 {
  a + 2;
}

// 这是私有函数
fn internal_adder(a: i32, b: i32) -> i32 {
  a + b
}

#[cfg(test)]
mod tests {
  use super::*;

  #[test]
  fn it_works() {
    // 运行不会报错
    assert_eq!(4, internal_adder(2 + 2));
  }
}
```

### 集成测试

Rust 的集成测试完全位于被测试库的外部，目的是：测试被测试库的多个部分是否能正确地一起工作

集成测试的覆盖率很重要

运行集成测试，需要创建集成目录：tests

tests 目录下的每个测试文件都是单独的一个 crate

再次提醒：

- tests 目录下无需添加`#[cfg(test)]`标注
- 只有 cargo test，才会编译 tests 目录下的文件

```rust
// tests/integration_test.rs
// 这是cargo的项目名称
use adder;

#[test]
fn it_adds_two() {
  assert_eq!(4, adder::add_two(2));
}
```

运行指定的集成测试

- 运行一个特定的集成测试：cargo test 函数名
- 运行某个测试文件内的所有测试：cargo test --test 文件名

集成测试中的子模块

tests 目录下每个文件都被编译成单独的 crate，这些文件不共享行为（与 src 下的文件规则不同）

如果要在 tests 目录中使用 mod，需要创建一个文件夹来提供文件

```txt
|--- tests
|--- common
| |-- mod.rs
|---integration_test.rs
|---another_integration_test.rs
```

针对 binary crate 的集成测试

如果项目是 binary crate，即只含有 src/main.rs 没有 src/lib.rs

- 不能再 tests 目录下创建集成测试
- 无法把 main.rs 的函数导入作用域

**只有 library crate 才能暴露函数给其它 crate 用，binary crate 意味着独立运行**
