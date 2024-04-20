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

### 关联类型

关联类型（associated type）是 trait 中的类型占位符，它可以用于 trait 的方法签名中，可以定义出包含某些类型的 trait，而在实现前无需知道这些类型是什么

```rust
pub trait Iterator {
  type Item;

  fn next(&mut self) -> Option<Self::Item>;
}

pub trait Iterator2<T> {
  fn next(&mut self) -> Option<T>;
}

struct Counter {}

impl Iterator for Counter {
  type Item = u32;

  fn next(&mut self) -> Options<Self::Item> { None }
}

impl Iterator2<String> for Counter {
  fn next(&mut self) -> Options<String> { None }
}

impl Iterator2<u32> for Counter {
  fn next(&mut self) -> Options<u32> { None }
}
```

关联类型和泛型区别：

| 泛型                             | 关联类型                         |
| :------------------------------- | :------------------------------- |
| 每次实现 trait 时标注类型        | 无需标注类型                     |
| 可以为一个类型多次实现某个 trait | 无法为单个类型多次实现某个 trait |

### supertrait

需要在一个 trait 中使用其它 trait 的功能：

- 需要被依赖的 trait 也被实现
- 那个被间接依赖的 trait 就是当前 trait 的 supertrait（类似 trait 继承）

```rust
use std::fmt;

trait OutlinePrint: fmt::Display {
  // self可使用.to_string()方法了
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

### 综合示例

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

## UnsafeRust

Rust 隐藏着第二个语言，它没有强制内存安全保证：Unsafe Rust

和普通的 Rust 一样，但提供了额外的能力

Unsafe Rust 存在的原因：

1. 静态分析是保守的。使用 Unsafe Rust：我知道我自己在做什么，并愿意承担相应风险
2. 计算机硬件本身就是不安全的，Rust 需要能够进行底层系统变成

### 关键字

使用 unsafe 关键字切换到 unsafe Rust，将开启一个块，里面放着 unsafe 代码，并允许以下四种 unsafe 操作：

1. 解引用原始指针
2. 调用 unsafe 函数或方法
3. 访问或修改可变的静态变量
4. 实现 unsafe trait

注意：

1. unsafe 并没有关闭借用检查或停用其它安全检查
2. 任何内存安全相关的错误必须留在 unsafe 块里
3. 尽可能隔离 unsafe 代码，最好将其封装在安全的抽象里，提供安全的 API

### 解引用原始指针

原始指针：

- 可变的：`*mut T`
- 不可变的：`*const T`。意味着指针在解引用后不能直接对其进行赋值
- 注意：主力的`*`不是解引用符号，它是类型名的一部分

与引用不同，原始指针具备以下特性：

- 允许通过同时具有不可变和可变指针或多个指向同一位置的可变指针来忽略借用规则
- 无法保证能指向合理的内存
- 允许为 null
- 不实现任何自动清理

通过放弃保证的安全，解引用原始指针来换取更好的性能/与其它语言或硬件接口的能力

```rust
fn main() {
  let mut num = 5;

  let r1 = &num as *const i32;
  let r2 = &mut num as *mut i32;
  unsafe {
    println!("r1: {}", *r1);
    println!("r2: {}", *r2);
  }
  let address = 0x012345usize;
  let r = address as *const i32;
  unsafe {
    println!("r: {}", *r);
  }
}
```

### 创建安全抽象

函数包含 unsafe 代码并不意味着需要将整个函数标记为 unsafe

将 unsafe 代码包裹在安全函数中是一个常见的抽象

### extern

extern 关键字：简化创建和使用外部函数接口(FFI)的过程

外部函数接口（FFI，Foreign Function Interface）：它允许一种编程语言定义函数，并让其它变成语言能调用这些函数

```rust
extern "C" {
  fn abs(input: i32) -> i32;
}

fn main() {
  unsafe {
    println!("Absolute value of -3 according to C: {}", abs(-3));
  }
}
```

应用二进制接口（ABI，Application Binary Interface）：定义函数在汇编层的调用方式

"C" ABI 是最常见的 ABI，它遵循 C 语言的 ABI

可以使用 extern 创建接口，其它语言通过它们可以调用 Rust 的函数

在 fn 前添加 extern 关键字，并指定 ABI

还需添加`#[no_mangle]`注解：避免 Rust 在编译时改变它的名称

### 访问或修改可变静态变量

Rust 支持全局变量，但因为所有权机制可能产生某些问题，例如数据竞争

静态变量：

- 静态变量与常量类似
- 命名：SCREAMING_SNAKE_CASE
- 必须标注类型
- 静态变量只能存储`'static`生命周期的引用，无需显式标注
- 访问不可变静态变量是安全的

```rust
static mut COUNTER: u32 = 0;

fn add_to_count(inc: u32) {
  unsafe {
    COUNTER += inc;
  }
}

fn main() {
  add_to_count();

  unsafe {
    println!("COUNTER: {}", COUNTER);
  }
}
```

### 实现不安全`trait`

当某个 trait 中存在至少一个方法拥有编译器无法校验的不安全因素时，就称这个 trait 是不安全的

声明 unsafe trait：在定义前添加 unsafe 关键字。该 trait 只能在 unsafe 代码块中实现

```rust
unsafe trait Foo {}

unsafe impl Foo for i32 {}

fn main() {

}
```

### 何时使用`unsafe`

1. 编译器无法保证内存安全，保证 unsafe 代码正确并不简单
2. 有充足理由使用 unsafe 代码时，就可以这样做
3. 通过显式标记 unsafe，可以在出现问题时轻松定位

## 高级类型

### newtype

newtype 模式：

- 用来静态地保证各种值之间不会混淆并表明值的单位
- 为类型的某些细节提供抽象能力
- 通过轻量级的封装来隐藏内部实现细节

```rust
type Thunk = Box<dyn Fn() + Send + 'static'>;

fn takes_long_type(f: Thunk) {
  //
}

fn returns_long_type() -> Thunk {
  Box::new(|| println!("hi"))
}

fn main() {
  let f: Thunk = Box::new(|| println!("hi"));
}
```

### never

有一个名为`!`的特殊类型：它没有任何值，行话成为空类型（empty type）

我们倾向于叫它 never 类型，因为它在不返回的函数中充当返回类型

不返回值的函数也被称作发散函数（diverging function）

类似 typescript 的 [never](../typescript/base.html#never) 类型，表示函数不可达，如必定发生错误的函数、死循环函数

### DST

Rust 需要在编译时确定为一个特定类型的值分配多少空间

动态大小的类型（Dynamically Sized Types DST）概念：

编写代码时使用只有在运行时才能确定大小的值

str 是动态大小的类型（注意不是`&str`）：只有运行时才能确定字符串的长度

`&str`：存储 str 的地址和 str 的长度

另一种动态大小的类型是 trait

每个 trait 都是一个动态大小的类型，可以通过名称对其进行引用

为了将 trait 用作 trait 对象，必须将它放置在某种指针之后

如：`&dyn Trait`或`Box<dyn Trait>`（`Rc<dyn Trait>`）之后

为了处理动态大小的类型，Rust 提供了一个 SizedTrait 来确定一个类型的大小在编译时是否已知：

- 编译时可计算出大小的类型会自动实现这一 trait
- Rust 还会为每一个泛型函数隐式地添加 Sized 约束

```rust
fn generic<T>(t: T) {
}

// fn generic<T: Sized>(t: T) {
// }

// fn generic<T: ？Sized>(t: &T) {
// }

fn main() {}
```

默认情况下，泛型函数只能被用于编译时已经知道大小的类型，可以通过特殊语法`?Sized`解除这一限制

## 函数指针

可以将函数传递给其它函数

函数在传递过程中会被强制转换成 fn 类型

```rust
fn add_one(x: i32) -> {
  x + 1
}

fn do_twice(f: fn(i32) -> i32, arg: i32) -> i32 {
  f(arg) + f(arg)
}

fn main() {
  let answer = do_twice(add_one, 5);

  println!("The answer is: {}", answer);
}
```

### 函数指针与闭包的区别

- fn 是一个类型，不是一个 trait
- 可以直接指定 fn 为参数类型，不用声明一个以 Fn trait 为约束的泛型参数
- 函数指针实现了全部 3 中闭包 trait（Fn, FnMut, FnOnce）

因为总是可以把函数指针用作参数传递给一个接收闭包的函数，所以我们更倾向于搭配闭包 trait 的泛型来编写函数：可以同时接收闭包和普通函数

### 返回闭包

闭包使用 trait 进行表达，无法在函数中直接返回一个闭包，可以将一个实现了该 trait 的具体类型作为返回值

```rust
// 编译失败
// fn returns_closure() -> Fn(i32) -> i32 {
//   |x| x + 1
// }

fn returns_closure() -> Box<dyn Fn(i32) -> i32> {
  Box::new(|x| x + 1)
}

fn main() {
    let closure = returns_closure();
    let res = closure(10);
    println!("res: {}", res);
}
```

## macro

宏在 Rust 里指的是一组相关特性的集合称谓：

- 使用`macro_rules!`构建的声明宏（declarative macro）
- 3 种过程宏
  1. 自定义`#[derive]`宏，用于 struct 或 enum，可以为其指定随 derive 属性添加的代码
  2. 类似属性的宏，在任何条目上添加自定义属性
  3. 类似函数的宏，看起来像函数调用，对其指定为参数的 token 进行操作

### 函数与宏的差别

本质上，宏是用来编写可以生成其它代码的代码（元编程，meta programming）

函数在定义签名时，必须声明参数的个数和类型，宏可处理可变的参数

编译器会在解释代码前展开宏

宏的定义比函数复杂得多，难以阅读、理解、维护

在某个文件调用宏时，必须提前定义宏或将宏引入当前作用域。

函数可以在任何位置定义并在任何位置使用

### 声明宏

`macro_rules!`声明宏现在可能已弃用，需注意

声明宏类似 match 的模式匹配，需要使用`macro_rules!`关键字

```rust
// let v: Vec<u32> = vec![1, 2, 3];

// 这是vec!宏的简化定义
#[macro_export]
macro_rules! vec {
( $( $x:expr ),* ) => {
    {
      let mut temp_vec = Vec::new();
      $(
        temp_vec.push($x);
      )*
      temp_vec
    }
  }
}
```

### 过程宏

过程宏一般指的是基于属性来生成代码的过程宏，这种形式更像函数

- 接收并操作输入的 Rust 代码
- 生成另外一些 Rust 代码作为结果

一般有三种过程宏：

1. 自定义派生
2. 属性宏
3. 函数宏

创建过程宏时，注意宏定义必须单独放在它们自己的包中，并使用特殊的包类型

#### 自定义派生

例子：自定义 derive 宏`#[derive(Hellomacro)]`，得到 hello_macro 的默认实现

先新建一个 Cargo 项目

```toml
[package]
name = "hello_macro_derive"
version = "0.1.0"
edition = "2018"

[lib]
proc-macro = true

[dependencies]
syn = "0.14.4"
quote = "0.6.3"
```

```rust
// lib.rs
extern crate proc_macro;

use crate::proc_macro::TokenStream;
use quote::quote;
use syn;

#[proc_macro_derive(HelloMacro)]
pub fn hello_macro_derive(input: TokenStream) -> TokenStream {
  let ast = syn::parse(input).unwrap();

  impl_hello_macro(&ast)
}

fn impl_hello_macro(ast: &syn::DeriveInput) -> TokenStream {
  let name = &ast.ident;
  let gen = quote! {
    impl HelloMacro for #name {
      fn hello_macro() {
        println!("Hello, Macro! My name is {}", stringify!(#name));
      }
    }
  };
  gen.into()
}
```

#### 属性宏

属性宏与自定义 derive 宏类似，允许创建新的属性，但不是为 derive 属性生成代码

属性宏更加灵活：derive 只能用于 struct 和 enum，属性宏可以用于任意条目，例如函数

如：MVC 框架常用的路由宏`#[route(GET, "/")]`

#### 函数宏

函数宏定义类似于函数调用的宏，但比普通函数更加灵活

函数宏可以接收 TokenStream 作为参数

与另外两种过程宏一样，在定义中使用 Rust 代码来操作 TokenStream

如：SQL 查询宏`sql!(SELECT * FROM posts WHERE id=1);`
