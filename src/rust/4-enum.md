---
title: 枚举与匹配模式
order: 4

tag:
  - enum枚举
  - option枚举
  - 控制流运算符
  - 匹配模式
  - if/let
---

## enum

枚举允许我们列举所有可能的值来定义一个类型

### 定义

以 IP 地址为例，以下是枚举声明与枚举值获取

```rust
enum IpAddrKind {
  V4,
  V6
}

fn main() {
  let four = IpAddrKind::V4;
  let six = IpAddrKind::V6;

  // 以下写法均可行
  route(four);
  route(six);
  route(IpAddrKind::V6);
}

fn route(ip_kind: IpAddrKind) {}
```

### 数据附加

rust 支持将数据类型直接附加到枚举变体中

```rust
enum IpAddr1 {
  V4(String),
  V6(String),
}

enum IpAddr2 {
  V4(u8, u8, u8, u8),
  V6(String)
}

fn main() {
  let home = IpAddr2::V4(127, 0, 0, 1);
  let loopback = IpAddr2::V6(String::from("::1"));
}
```

该写法不需要额外使用 struct，并且每个变体可以拥有不同的类型以及关联的数据量

### 定义方法

枚举可以视为和 struct 类似的结构体，同样支持通过 impl 块添加方法

```rust
enum Message {
  Quit,
  Move { x: i32, y: i32 },
  Write(String),
  ChangeColor(i32, i32, i32),
}

impl Message {
  fn call(&self) {}
}

fn main() {
  let q = Message::Quit;
  let m = Message::Move { x: 12, y: 24 };
  let w = Message::Write(String::from("Hello"));
  let c = Message::ChangeColor(0, 255, 255);

  // 正常运行无报错
  m.call();
}
```

## option

### 定义

- 该枚举定义于标准库中
- 在 Prelude（预导入模块）中，`Option<T>`、`Some(T)`、`None`均可直接使用
- 描述了某个值可能存在（某种类型）或不存在的情况

标准库中定义为：

```rust
enum Options<T> {
  Some<T>,
  None,
}
```

### Null

**注意！！！Rust 没有 Null！！！**

`Option<T>`是 rust 对于 Null 类似的概念

```rust
fn main() {
  // 有效的值
  let some_number = Some(5);
  let some_string = Some("A String");

  // 无效值None
  let absent_number = Option<i32> = None;
}
```

### 优势

`Option<T>`比 Null 好在哪？

- `Option<T>`和 T 是不同的类型，不可以把`Option<T>`直接当成 T

```rust
fn main() {
  let x: i8 = 5;
  let y: Option<i8> - Some(5);
  // 禁止直接相加
  let sum = x + y;
}
```

- 若想使用`Option<T>`中的 T，必须将它转换为正确的 T

## 匹配模式

### 定义

非常强大的控制流运算符 match

- 允许一个值与一系列模式进行匹配，并执行匹配的模式对应的代码
- 模式可以是字面值、变量名、通配符...

```rust
enum Coin {
  Penny,
  Nickel,
  Dime,
  Quarter,
}

fn value_in_cents(coin: Coin) -> u8 {
  match coin {
    Coin::Penny => {
      println!("Penny!");
      1
    }
    Coin::Nickel => 5,
    Coin::Dime => 10,
    Coin::Quarter => 25,
  }
}
```

### 绑定值模式

借助 enum 和 match 模式，我们可以轻松将不同结构的 enum 组合进控制流中进行判断

```rust
#[derive(Debug)]
enum UsState {
  Alabama,
  Alaska
}

enum Coin {
  Penny,
  Nickel,
  Dime,
  Quarter(UsState),
}

fn value_in_cents(coin: Coin) -> u8 {
  match coin {
    Coin::Penny => {
      println!("Penny!");
      1
    }
    Coin::Nickel => 5,
    Coin::Dime => 10,
    Coin::Quarter(state) => {
      println!("State quarter from {:?}", state);
      25
    }
  }
}

fn main() {
  let c = Coin::Quarter(UsState::Alaska);
  println!("{}", value_in_cents(c));
}
```

### 匹配`Option<T>`

match 匹配 Option 时必须满足 Some 和 None 的双边判断

```rust
fn main() {
  let five = Some(5);
  let six = plus_one(five);
  let none = plus_one(None);
}

fn plus_one(x: Option<i32>) -> Option<i32> {
  match x {
    None => None,
    Some(i) => Some(i + 1),
  }
}
```

### 匹配命名变量

命名的变量是可匹配任何值的无可辩驳模式

```rust
fn main() {
  let x = Some(5);
  let y = 10;

  match x {
    Some(50) => println!("Got 50"),
    Some(y) => println!("Matched, y = {:?}", y),
    _ println!("Default case, x = {:?}", x),
  }

  println!("at the end: x = {:?}, y = {:?}", x, y);
}
```

### 多重模式

在 match 表达式中，使用`|`语法可以匹配多种模式

```rust
fn main() {
  let x = 1;

  match x {
    1 | 2 => println!("one or two"),
    3 => println!("three"),
    _ => println("anything"),
  }
}
```

### 范围匹配

使用 `..=` 来匹配某个范围的值

```rust
fn main() {
  let x = 5;
  match x {
    1 ..=5 => println!("one through five"),
    _ => println!("something else"),
  }

  let x = 'c';
  match x {
    'a' ..='j' => println!("early ASCII letter"),
    'k' ..='z' => println!("late ASCII letter"),
    _ => println!("something else"),
  }
}
```

### 解构匹配

可以使用模式来解构 struct enum tuple，从而引用这些类型值的不同部分

```rust
struct Point {
  x: i32,
  y: i32,
}

fn main() {
  let p = Point { x: 0, y: 7 };

  let Point { x: a, y: b } = p;
  assert_eq!(0, a);
  assert_eq!(7, b);

  match p {
    Point { x, y: 0 } => println!("On the x axis at {}", x),
    Point { x: 0, y } => println!("On the y axis at {}", y),
    Point { x, y } => println!("On neither axis: ({}, {})", x, y),
  }
}
```

### 匹配守卫

match守卫就是match arm模式后额外的if条件，想要匹配该条件也必须满足

match守卫适用于比单独的模式更复杂的场景

```rust
fn main() {
  let num = Some(4);

  match num {
    Some(x) if x < 5 => println!("less than five: {}", x),
    Some(x) => println!("{}", x),
    None => (),
  }
}
```

### `@`绑定

`@`符号让我们可以创建一个变量，该变量可以在测试某个值是否与模式匹配的同时保存该值

```rust
enum Message {
  Hello { id: i32 }
}

fn main() {
  let msg = Message::Hello { id: 5 };

  match msg {
    Message::Hello {
      id: id_variable @ 3..=7,
    } => {
        println!("Found an id in range: {}", id_variable) 
    }
    Message::Hello { id: 10..=12 } => {
        println!("Found an id another range") 
    }
    Message::Hello { id } => {
        println!("Found some other id: {}", id) 
    }
  }
}
```

### 默认匹配

match 匹配必须穷举所有的可能

而`_`通配符来表示默认的其他没列举出的值

```rust
fn main() {
  let v = 0u8;
  match v {
    1 => println!("one"),
    3 => println!("three"),
    5 => println!("five"),
    7 => println!("seven"),
    _ => (),
  }
}
```

`_`通配符必须放在 match 的最下面，如果不希望输出任何内容，则以`_ => ()`返回空元组的形式表示无事发生

### 剩余忽略

使用 .. 来忽略值的剩余部分

```rust
fn main() {
  let numbers = (2, 4, 8, 16, 32);
  match numbers {
    (first, .., last) => {
      println!("Some numbers: {}, {}", first, last);
    }
  }
}
```

### if/let

if/let 关键字用于处理只关心一种匹配而忽略其它匹配的情况

特点：

- 更少的代码，更少的缩进，更少的样板代码
- 放弃了穷举的可能
- 可以把 if/let 看作是 match 的语法糖
- 同样可搭配 else

```rust
fn main() {
  let v = Some(0u8);
  // 以下两种写法效果相同
  match v {
    Some(3) => println!("three"),
    _ => (),
  }

  if let Some(3) = v {
    println!("three");
  } else {
    println!("others");
  }
}
```

### while/let

只要模式继续满足匹配的条件，那它允许 while 循环一直运行

```rust
fn main() {
  let mut stack = Vec::new();

  stack.push(1);
  stack.push(2);
  stack.push(3);

  while let Some(top) = stack.pop() {
    println!("{}", top);
  }
}
```

### 两种形式

匹配模式有两种形式：可辩驳的、无可辩驳的

能匹配任何可能传递的值的模式：无可辩驳的，例如`let x = 5;`

对某些可能的值，无法进行匹配的模式：可辩驳的，例如`if let Some(x) = a_value`

- 函数参数、let 语句、for 循环只接受无可辩驳的模式
- if let 和 while let 接受可辩驳和无可辩驳的模式
