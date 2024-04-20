---
title: Rust面向对象
order: 15

tag:
  - 动态派发
  - 状态模式
---

## 面向对象特性分析

Rust 是面向对象：

- struct、enum 包含数据
- impl 块为之提供方法
- 但带有方法的 struct、enum 并没有被称为对象

### 封装

封装：调用对象外部的代码无法直接访问对象内部的实现细节，唯一可以与对象进行交互的方法就是通过它公开的 API

Rust 通过 pub 关键字来实现这一点

### 继承

继承：使对象可以沿用另外一个对象的数据和行为，且无需重复定义相关代码

Rust 没有继承

使用继承原因通常是希望代码复用。Rust 使用默认的 trait 方法来进行代码共享

### 多态

Rust 使用泛型和 trait 约束来完成

## 动态派发

```rust
// lib.rs
pub trait Draw {
  fn draw(&self);
}

pub struct Screen {
  pub components: Vec<Box<dyn Draw>>,
}

impl Screen {
  pub fn run(&self) {
    for component in self.components.iter() {
      component.draw();
    }
  }
}

pub struct Button {
  pub width: u32,
  pub height: u32,
  pub label: String,
}

impl Draw for Button {
  fn draw(&self) {
    // 绘制一个按钮
  }
}

pub struct SelectBox {
  pub width: u32,
  pub height: u32,
  options: Vec<String>,
}

impl Draw for SelectBox {
  fn draw(&self) {
    // 绘制一个选择框
  }
}

fn main() {
  let screen = Screen {
    components: vec![
      Box::new(SelectBox {
        width: 75,
        height: 10,
        options: vec![
          String::from("Yes"),
          String::from("Maybe"),
          String::from("No"),
        ],
      }),
      Box::new(Button {
        width: 50,
        height: 10,
        label: String::from("OK"),
      }),
    ],
  };

  screen.run();
}
```

trait 对象执行的是**动态派发**

将 trait 约束作用于泛型时，Rust 编译器会执行单态化：

编译器会为我们用来替换泛型类型参数的每一个具体类型生成对应函数和方法的非泛型实现

通过单态化生成的代码会执行**静态派发**（static dispatch），在编译过程中确定调用的具体方法

而**动态派发**（dynamic dispatch）则是：

- 无法在编译过程中确定你调用的究竟是哪一种方法
- 编译器会产生额外的代码以便在运行时找出希望调用的方法

trait 对象必须保证对象安全

Rust 只能把满足对象安全（object-safe）的 trait 转化为 trait 对象

Rust 采用一系列规则来判定某个对象是否安全，只需记住两条：

1. 方法的返回类型不是 self
2. 方法中不包含任何泛型类型参数

## 状态模式

状态模式（state pattern）是一种面向对象设计模式：一个值拥有的内部状态由数个状态对象（state project）表达而成，而值的行为则随着内部状态的改变而改变

使用状态模式意味着：

- 业务需求变化时，不需要修改持有状态的值的代码，或者使用这个值的代码
- 只需要更新状态对象内部的代码，以便改变其规则，或者增加一些新的状态对象

```rust
// lib.rs
pub struct Post {
    state: Option<Box<dyn State>>,
    content: String,
}

impl Post {
    pub fn new() -> Post {
        Post {
            state: Some(Box::new(Draft {})),
            content: String::new(),
        }
    }

    pub fn add_text(&mut self, text: &str) {
        self.content.push_str(text);
    }

    pub fn content(&self) -> &str {
        // 返回字符串内容（Published状态才正常返回）
        self.state.as_ref().unwrap().content(&self)
    }

    pub fn request_review(&mut self) {
        if let Some(s) = self.state.take() {
            self.state = Some(s.request_review());
        }
    }

    pub fn approve(&mut self) {
        if let Some(s) = self.state.take() {
            self.state = Some(s.approve());
        }
    }
}

trait State {
    fn request_review(self: Box<Self>) -> Box<dyn State>;
    fn approve(self: Box<Self>) -> Box<dyn State>;
    fn content<'a>(&self, _post: &'a Post) -> &'a str {
        ""
    }
}

struct Draft {}

impl State for Draft {
    fn request_review(self: Box<Self>) -> Box<dyn State> {
        Box::new(PendingReview {})
    }

    fn approve(self: Box<Self>) -> Box<dyn State> {
        self
    }
}

struct PendingReview {}

impl State for PendingReview {
    fn request_review(self: Box<Self>) -> Box<dyn State> {
        self
    }

    fn approve(self: Box<Self>) -> Box<dyn State> {
        Box::new(Published {})
    }
}

struct Published {}

impl State for Published {
    fn request_review(self: Box<Self>) -> Box<dyn State> {
        self
    }

    fn approve(self: Box<Self>) -> Box<dyn State> {
        self
    }

    fn content<'a>(&self, post: &'a Post) -> &'a str {
        // 已发布状态才正常展示content内容
        &post.content
    }
}
```
