---
title: 结构体
order: 3

tag:
  - Struct
  - 结构体
---

## 基本定义

- 结构体，自定义的数据类型
- 为相关联的值命名，打包 => 有意义的组合
- 使用 struct 关键字，并为整个 struct 命名
- 在花括号内，为所有字段（Field）定义名称和类型

```rust
struct User {
  username: String,
  email: String,
  sign_in_count: u64,
  active: bool,
}
```

### 实例

想要使用 struct，需要创建 struct 的实例：

- 为每个字段指定具体值
- 无需按声明的顺序进行指定

```rust
struct User {
  username: String,
  email: String,
  sign_in_count: u64,
  active: bool,
}

fn main() {
  let user1 = User {
    email: String::from("abc@126.com"),
    username: String::from("Tom"),
    active: true,
    sign_in_count: 42,
  }
}
```

### 取值

取值一般用点标记法

```rust
struct User {
  username: String,
  email: String,
  sign_in_count: u64,
  active: bool,
}

fn main() {
  let mut user1 = User {
    email: String::from("abc@126.com"),
    username: String::from("Tom"),
    active: true,
    sign_in_count: 42,
  }

  user1.email = String::from("anotherEmail@example.com");
}
```

注意：

- 一旦 struct 实例可变，那么实例中的所有字段都是可变的
- 当字段名和字段值对应变量名相同时，就可以使用字段初始化简写的方式

### 更新

当你想基于某个 struct 实例来创建一个新实例的时候，可以使用 struct 更新语法

注意：这种更新语法属于 Move

```rust
struct User {
  username: String,
  email: String,
  sign_in_count: u64,
  active: bool,
}

fn main() {
  let user1 = User {
    email: String::from("abc@126.com"),
    username: String::from("Tom"),
    active: true,
    sign_in_count: 42,
  }

  let user2 = User {
    email: String::from("another@126.com"),
    username: String::from("anotherUsername567"),
    ..user1,
  }
}
```

### TupleStruct

可定义类似 tuple 的 struct，叫做 tuple struct

- Tuple Struct 整体有名字，但里面的元素没有名字
- 适用：想给整个 tuple 起名，并让它不同于其他 tuple，而且不需要给每个元素起名

定义 tuple struct，使用 struct 关键字，后边是名字，以及里面元素的类型

```rust
struct Color(i32, i32, i32);
struct Point(i32, i32, i32);
let black = Color(0, 0, 0);
let origin = Point(0, 0, 0);
```

black 和 origin 是不同的类型，是不同 tuple struct 的实例

### UnitLikeStruct

没有任何字段的 struct，叫做 Unit-Like-Struct，与`()`空元组类型类似

适用于需要在某个类型上实现某个 trait，但是在里面又没有想要存储的数据

### 所有权

struct 内部字段使用了 String 而不是`&str`：

- 该 struct 示例拥有其所有的数据
- 只要 struct 实例有效，那么里面的字段数据也是有效的

struct 里面也可以存放引用，但这需要使用生命周期：

- 生命周期保证只要 struct 实例有效，那么里面的引用也有效
- 如果 struct 里面存储引用，而不使用生命周期，就会报错

## 阶段性示例

例子：计算长方形面积

```rust
struct Rectangle {
  width: u32,
  height: u32,
}

fn main() {
  let rect = Rectangle {
    width: 30,
    height: 50,
  };

  println!("{}", area(&rect));
  // 会报错
  println!("{}", area);
}

fn area(rect: &Rectangle) -> u32 {
  rect.width * rect.height
}
```

### 打印问题

Struct 不能直接通过 print 打印，因为没有实现 Trait Display，会报错：

`error[E0277]: Rectangle doesn't implement std::fmt::Display`

`Rectangle cannot be formatted with the default formatter`

解决方案：

```rust
// 派生trait std::fmt::Debug功能
#[derive(Debug)]
struct Rectangle {
  width: u32,
  height: u32,
}

fn main() {
  let rect = Rectangle {
    width: 30,
    height: 50,
  };

  println!("{}", area(&rect));
  // 占位符改为 {:?} 或 {:#?}
  println!("{:?}", area);
}

fn area(rect: &Rectangle) -> u32 {
  rect.width * rect.height
}
```

## 方法

### 定义

方法和函数类似：fn 关键字、名称、参数、返回值

方法与函数不同之处：

- 方法是在 struct（或 enum、trait 对象）的上下文中定义
- 第一个参数是 self，表示方法被调用的 struct 实例
- 方法需要在 impl 块里定义
- 方法的第一个参数可以是`&self`，也可以获得其所有权或可变借用。和其他参数一样

### 使用

```rust
// 派生trait std::fmt::Debug功能
#[derive(Debug)]
struct Rectangle {
  width: u32,
  height: u32,
}
// 结构体的方法需要在impl块中定义
impl Rectangle {
  fn area(&self) -> u32 {
    self.width * self.height
  }
}

fn main() {
  let rect = Rectangle {
    width: 30,
    height: 50,
  };
  // 第一个参数是&self无需传参
  println!("{}", rect.area());
  // 占位符改为 {:?} 或 {:#?}
  println!("{:?}", area);
}
```

### 运算符

- 在 C/C++中，方法调用`object->something()`和`(*object).something()`一样，也就是取对象方法和取指针对象方法效果相同
- Rust 没有 `->` 运算符
- Rust 会自动引用或解引用，在调用方法时会自动发生这种行为。Rust 会根据情况自动添加`&`、`&mut`或`*`，以便 object 可以匹配方法的签名

下面两行代码效果相同：

- `p1.distance(&p2);`
- `(&p1).distance(&p2);`

### 方法形参

```rust
// 派生trait std::fmt::Debug功能
#[derive(Debug)]
struct Rectangle {
  width: u32,
  height: u32,
}
// 结构体的方法需要在impl块中定义
impl Rectangle {
  fn area(&self) -> u32 {
    self.width * self.height
  }

  fn can_hold(&self, other: &Rectangle) -> bool {
    self.width > other.width && self.height > other.height
  }
}

fn main() {
  let rect1 = Rectangle {
    width: 30,
    height: 50,
  };
  let rect2 = Rectangle {
    width: 10,
    height: 40,
  };
  let rect3 = Rectangle {
    width: 35,
    height: 55,
  };

  println!("{}", rect1.can_hold(&rect2));
  println!("{}", rect1.can_hold(&rect3));
}
```

## 关联函数

- 可以在 impl 块里定义不把 self 作为第一个参数的函数，它们叫关联函数（不是方法）。例如`String::from()`
- 关联函数常用于构造器。**可以近似理解为静态方法，没有指向实例的self**
- 符号`::`，用于**关联函数**，或者是**模块创建的命名空间**

```rust
struct Rectangle {
  width: u32,
  height: u32,
}
// 结构体的方法需要在impl块中定义
impl Rectangle {
  fn area(&self) -> u32 {
    self.width * self.height
  }

  fn can_hold(&self, other: &Rectangle) -> bool {
    self.width > other.width && self.height > other.height
  }

  // 构造正方形
  fn square(size: u32) -> Rectangle {
    Rectangle {
      width: size,
      height: size,
    }
  }
}
```