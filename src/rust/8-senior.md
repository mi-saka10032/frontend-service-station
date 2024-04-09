---
title: Rust高阶概念
order: 8

tag:
  - 泛型
  - trait
  - 生命周期
---

## 函数提取封装

Rust 函数提取的目的是为了消除重复代码，其步骤为：

1. 识别重复代码
2. 提取重复代码到函数体中，并在函数签名中指定函数的输入和返回值
3. 将重复的代码使用函数调用进行替代

```rust
fn largest(list: &[i32]) -> i32 {
  let mut largest = 0;
  // &item：将item结构为i32
  for &item in list {
    if item > largest {
      largest = item;
    }
  }
  largest
}

fn main() {
  let number_list = vec![34, 50, 25, 100, 65];
  let result = largest(&number_list);
  println!("The largest number is {}", result);

  let number_list = vec![102, 34, 6000, 89, 54, 2, 43, 8];
  let result = largest(&number_list);
  println!("The largest number is {}", result);
}
```

## 泛型

泛型能提高代码复用能力，是具体类型或其它属性的抽象代替：

- 你编写的代码不是最终的代码，而是一种模板，里面有一些“占位符”
- 编译器在编译时将“占位符”替换为具体的类型
- 类型参数很短，通常是一个字母，遵守 CamelCase 规范，最常用的是 T（type 的缩写）

### 函数泛型

函数中的泛型包含参数类型和返回类型两种

```rust
fn largest<T>(list: &[T]) -> T {
  let mut largest = 0;
  for &item in list {
    // 如果不对T进行约束，这里比较判断会报错，后面会提到泛型约束
    if item > largest {
      largest = item;
    }
  }
  largest
}
```

### 结构体泛型

struct 可以使用多个泛型的类型参数。但是如果类型参数太多，就意味着你的代码需要重组为多个更小的单元

```rust
struct Point<T, U> {
  x: T,
  y: U,
}

fn main() {
  let integer = Point { x; 5, y: 1.0 };
}
```

enum 支持变体持有泛型数据类型，例如：`Option<T>`、`Result<T, E>`

```rust
enum Option<T> {
  Some(T),
  None,
}

enum Result<T, E> {
  Ok(T),
  Err(E)
}
```

为 struct 或 enum 实现方法的时候，可以在定义中使用泛型

注意：

- 把 T 放在 impl 关键字后，表示在类型 T 上实现方法：`impl<T> Point<T>`
- 只针对具体类型实现方法，而其他类型不实现则应该是：`impl Point<i32>`
- struct 里的泛型类型参数可以和方法的泛型类型参数不同：`fn mixup<V, W>(self, other: Point<V, W>) -> Point<T, W>`

```rust
struct Point<T> {
  x: T,
  y: T,
}

impl<T> Point<T> {
  fn x(&self) -> &T {
    &self.x
  }
}

impl<T, U> Point<T, U> {
  fn mixup<V, W>(self, other: Point<V, W>) -> Point<T, W> {
    Point {
      x: self.x,
      y: other.y,
    }
  }
}

// 仅当Point的T为i32时才适用x1方法
impl Point<i32> {
  fn x1(&self) -> &i32 {
    &self.x
  }
}
```

### 泛型性能

使用泛型的代码和使用具体类型的代码运行速度是相同的，其原因是 Rust 编译时处理泛型采用的是**单态化（monomorphization）**：在编译时将泛型替换为具体类型的过程

## trait

trait：抽象的定义共享行为

trait bounds（约束）：泛型类型参数指定为实现了特定行为的类型

trait 告诉 Rust 编译器：某种类型具有哪些并且可以与其它类型共享的功能

trait 与其它语言的接口（interface）类似，但有些区别

### `定义trait`

trait 的定义：把方法签名放在一起，来定义实现某种目的所必需的一组行为

- 关键字：trait
- 只有方法签名，没有具体实现
- trait 可以有多个方法：每个方法签名占一行，以`;`结尾
- 实现该 trait 的类型必须提供具体的方法实现

```rust
pub trait Summary {
  fn summarize(&self) -> String;
}
```

### `实现trait`

与为类型实现方法类似，不同之处为：

- `impl Xxxx fro Tweet { ... }`
- 在 impl 的块里，需要对 trait 里的方法签名进行具体的实现

```rust
pub trait Summary {
  fn summarize(&self) -> String;
}

pub struct NewsArticle {
  pub headline: String,
  pub location: String,
  pub author: String,
  pub content: String,
}

impl Summary for NewsArticle {
  fn summarize(&self) -> String {
    format!("{}, by {} （{}）", self.headline, self.author, self.location)
  }
}

pub struct Tweet {
  pub username: String,
  pub content: String,
  pub reply: bool,
  pub retweet: bool,
}

impl Summary for Tweet {
  fn summarize(&self) -> String {
    format!("{}: {}", self.username, self.content)
  }
}
```

### `约束trait`

可以在某个类型上实现某个 trait 的前提条件是：这个类型或这个 trait 是在本地 crate 里定义的

无法为外部类型来实现外部的 trait：

- 这个限制是程序属性的一部分（也就是一致性）
- 更具体地说是孤儿规则：之所以这样命名是因为父类型不存在
- 此规则确保其他人的代码不能破坏您的代码，反之亦然
- 如果没有这个规则，两个 crate 可以为同一类型实现同一个 trait，Rust 就不知道应该使用哪个实现了

### 默认实现

默认实现的方法可以调用 trait 中其它的方法，即使这些方法没有默认实现

```rust
pub trait Summary {
  fn summarize_author(&self) -> String;

  fn summarize(&self) -> String {
    String::from("(Read more...)", self.summarize_author())
  }
}

pub struct NewsArticle {
  pub headline: String,
  pub location: String,
  pub author: String,
  pub content: String,
}

impl Summary for NewsArticle {
  fn summarize_author(&self) -> String {
    format!("@{}", self.author)
  }
}
```

### `trait作为参数`

impl trait 语法：适用于简单情况

```rust
pub fn notify(item: impl Summary) {
  println!("Breaking news! {}", item.summarize());
}
```

trait bound 语法：适用于复杂情况。

impl trait 语法是 trait bound 的语法糖

```rust
pub fn notify<T: Summary>(item: T) {
  println!("Breaking news! {}", item.summarize());
}
```

参数组合继承可以使用`+`指定多个 trait bound

```rust
pub fn notify(item: impl Summary + Display) {
  println!("Breaking news! {}", item.summarize());
}

pub fn notify1<T: Summary + Display>(item: T) {
  println!("Breaking news! {}", item.summarize());
}
```

trait bound 使用 where 子句

```rust
pub fn notify2<T, U>(a: T, b: U) -> String
where
    T: Summary + Display,
    U: Clone + Debug,
{
  format!("Breaking news! {}", a.summarize());
}
```

### `trait作为返回类型`

Rust 对于 trait 作为返回类型时，仅支持静态分发类型，也就是返回类型是固定的

注意：impl trait 只能返回确定的同一种类型，返回可能不同类型代码会报错

```rust
pub fn notify1(flag: bool) -> impl Summary {
  if flag {
    NewsArticle { ... }
  } else {
    // 不支持该实现。因为Tweet和NewsArticle具体实现可能还存在差异，Rust无法识别
    Tweet { ... }
  }
}
```

### 特定`trait`类型

在使用泛型类型参数的 impl 块上使用 trait bound，我们可以有条件地为实现了特定 trait 的类型来实现方法

```rust
use std::fmt::Display;

struct Pair<T> {
  x: T,
  y: T,
}

impl<T> Pair<T> {
  fn new(x: T, y: T) -> Self {
    Self { x, y }
  }
}

impl<T: Display + PartialOrd> Pair<T> {
  fn cmp_display(&self) {
    if self.x >= self.y {
      println!("The largest member is x = {}", self.x);
    } else {
      println!("The largest member is y = {}", self.y);
    }
  }
}
```

也可以为实现了其它 trait 的任意类型有条件地实现某个 trait

为满足 trait bound 的所有类型上实现 trait 叫做覆盖实现（blanket implementations）

```rust
fn main() {
  let s = 3.to_string();
}
```

以这个`to_string()`方法为例，这是因为 i32 的`trait Display`对`trait ToString`做了覆盖实现

截取部分源码：

```rust
pub trait ToString {
  fn to_string(&self) -> String;
}

impl<T: fmt::Display> ToString for T {
  default fn to_string(&self) -> String { ... }
}
```

## 生命周期

Rust 的每个引用都有自己的生命周期

生命周期指的是引用保持有效的作用域

大多数情况下，生命周期是隐式的、可被推断的

当引用的生命周期可能以不同的形式互相关联时，需手动标注生命周期

### 避免悬垂引用

生命周期的主要目标：避免悬垂引用（dangling reference）

```rust
fn main() {
  {
    let r;
    {
      let x = 5;
      // 报错原因：x生命周期仅存在于代码块中，下面的print无法正确打印r借用的x值
      r = &x;
    }
    println!("r:{}", r);
  }
}
```

Rust 实现借用判断的功能是编译器中的借用检查器：比较作用域来判断所有的借用是否合法

比较简单的判断方法：查看变量 r 的作用域从哪一行开始哪一行结束，x 的作用域从哪一行开始哪一行结束。如果 x 的作用域不能覆盖 r 的作用域，那么 r 对 x 的借用就不合法

### 泛型生命周期

- 生命周期的标注不会改变引用的生命周期长度
- 当指定了泛型生命周期参数，函数可以接收带有任何生命周期的引用
- 生命周期的标注：描述了多个引用的生命周期间的关系，但不影响生命周期

生命周期参数名：

- 以`'`开头
- 通常全小写且非常短
- 很多人使用`'a`

生命周期标注位置：

- 在引用的`&`符号后
- 使用空格将标注和引用类型分开
- 函数名和参数列表之间的`< >`里

`&i32` —— 一个引用

`&'a i32` ——带有显式生命周期的引用

`&'a mut i32` ——带有显式生命周期的可变引用

**单个生命周期标注本身没有意义**

```rust
fn main() {
  let string1 = String::from("abcd");
  let string2 = "xyz";

  let result = longest(string1.as_str(), string2);

  println!("The longest string is {}", result);
}

// 生命周期'a 的实际生命周期是：x和y两个生命周期中较小的那个
fn longest<'a>(x: &'a str, y: &'a str) -> &'a str {
  if x.len() > y.len() {
    x
  } else {
    y
  }
}
```

### 深入理解生命周期

指定生命周期参数的方式依赖于函数所做的事情

从函数返回引用时，返回类型的生命周期参数需要与其中一个参数的生命周期匹配

如果返回的引用没有指向任何参数，那么它只能引用函数内创建的值：这就是悬垂引用，该值在函数结束时就走出了作用域

来看一个报错的例子

```rust
fn main() {
  let string1 = String::from("abcd");
  let string2 = "xyz";
  let result = longest1(string1.as_str(), string2);
  // let result = longest2(string1.as_str(), string2);
  println!("The longest string is {}", result);
}

fn longest1<'a>(x: &'a str, y: &str) -> &'a str {
  let result = String::from("abc");
  // 非常经典的报错，借用转移但是result生命周期仅存于函数内部，所以必定报错
  result.as_str();
}

// 解决方法
fn longest2<'a>(x: &'a str, y: &str) -> String {
  let result = String::from("abc");
  result
}
```

### `Struct`生命周期

Struct 可包括：

- 自持有的类型
- 引用：需要在每个引用上添加生命周期标注

```rust
struct ImportantExcerpt<'a> {
  part: &'a str,
}

fn main() {
  let novel = String::from("Call me Ishmael. Some years age ...");

  let first_sentence = novel.split('.')
      .next()
      .expect("Could not found a '.'");

  let i = ImportantExcerpt{
    part: first_sentence
  }
}
```

### 生命周期省略规则

我们知道：

- 每个引用都有生命周期
- 需要为使用生命周期的函数或 struct 指定生命周期参数

**省略规则前置概述**

在 Rust 引用分析中所编入的模式称为生命周期省略规则

- 这些规则无需开发者来遵守
- 它们是一些特殊情况，由编译器来考虑
- 如果你的代码符合这些情况，那么就无需显式标注生命周期

**生命周期省略规则不会提供完整的推断**

- 如果应用规则后，引用的生命周期仍然模糊不清，会触发编译错误
- 解决办法：添加生命周期标注，表明引用间的相互关系

**生命周期的 IO**

- 函数/方法的参数：输入生命周期
- 函数/方法的返回值：输出生命周期

1. 规则 1：每个引用类型的参数都有自己的生命周期
2. 规则 2：如果只有 1 个输入生命周期参数，那么该生命周期被赋给所有的输出生命周期参数
3. 规则 3：如果有多个输入生命周期参数，但其中一个是`&self`或`&mut self`（是方法），那么 self 的生命周期会被赋给所有的输出生命周期参数

编译器使用以上 3 个规则，在没有显式标注生命周期的情况下，确定引用的生命周期：

- 规则 1 应用于输入生命周期
- 规则 2、3 应用于输出生命周期
- 如果编译器应用完 3 个规则之后，仍然有无法确定生命周期的引用，会报错
- 这些规则适用于 fn 定义和 impl 块

例子：

假设我们是编译器：

`fn first_word(s: &str) -> &str` ->

`fn first_word<'a>(s: &'a str) -> &str` ->

`fn first_word<'a>(s: &'a str) -> &'a str`

`fn longest(x: &str, y: &str) -> &str` ->

`fn longest<'a, 'b>(x: &'a str, y: &'b str) -> &str`

第一条`fn first_word`，经过 3 条规则判断，编译器会正确转换出正确的生命周期

第二条`fn longest`，经过 3 条规则判断，因为有多个输入生命周期参数，但是 fn 是纯函数而不是方法，所以无法判断输出生命周期参数，会报错

### 方法生命周期标注

在 struct 上使用生命周期实现方法，语法和泛型参数的语法一样

在哪声明和使用生命周期参数，依赖于：

- 生命周期参数是否和字段、方法的参数或返回值有关

struct 字段的生命周期名可以是：

- 在 impl 后声明
- 在 struct 名后使用
- 这些生命周期是 struct 类型的一部分

impl 块内的方法签名是：

- 引用必须绑定于 struct 字段引用的生命周期，或者引用是独立的也可以
- 生命周期省略规则经常使得方法中的生命周期标注不是必须的

```rust
struct ImportantExcerpt<'a> {
  part: &'a str,
}

impl<'a> ImportantExcerpt<'a> {
  fn level(&self) -> i32 {
    3
  }

  fn announce_and_return_part(&self, announcement: &str) -> &str {
    println!("Attention please: {}", announcement);
    self.part
  }
}
```

### 静态生命周期

`'static`是一个特殊的生命周期：它表示整个程序的持续时间。

- 所有的字符串字面值都拥有`'static`生命周期

为引用指定的`'static`生命周期前要三思：**是否需要引用在程序整个生命周期内都存活**

## 综合示例

```rust
use std::fmt::Display;

fn longest_with_an_announcement<'a, T>
  (x: &'a str, y: &'a str, ann: T) -> &'a str
where
  T: Display
{
  println!("Announcement! {}", ann);
  if x.len() > y.len() {
    x
  } else {
    y
  }
}

fn main() {}
```