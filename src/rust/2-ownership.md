---
title: 所有权
order: 2

tag:
  - Rust所有权规则
  - 引用和借用
  - Rust切片
---

所有权是 Rust 最独特的特性，它让 Rust 无需 GC 就可以保证内存安全

## 什么是所有权

- Rust 的核心特性就是所有权
- 所有程序在运行时都必须管理它们使用计算机内存的方式
  - 有些语言有 GC 机制，在程序运行时，它们会不断寻找不再使用的内存
  - 在其他语言中，程序员必须显式地分配和释放内存
- Rust 采用了第三种方式：
  - 内存是通过一个所有权系统来管理的，其中包含一组编译器在编译时检查的规则
  - 当程序运行时，所有权特性不会减慢程序的运行速度

## 内存空间

在像 Rust 这样的系统级编程语言里，一个值在 stack 上还是在 heap 上对语言的行为和你为什么要做某些决定是有更大影响的

在你的代码运行的时候，stack 和 heap 都是你可用的内存，但他们的结构很不相同。

### 内存存储规则

- stack 按值的接收顺序来存储，按相反的顺序将它们移除（后进先出，LIFO）
  - 添加数据为压入栈
  - 移除数据为弹出栈
- 所有存储在 stack 上的数据必须拥有已知的固定大小
  - 编译时大小未知的数据或运行时大小可能发生变化的数据必须存放在 heap 上
- 把值压到 stack 上不叫分配，因为指针是已知固定大小的，可以把指针存放在 stack 上

  - 但如果想要实际数据，你必须使用指针来定位
  - 把数据压到 stack 上要比在 heap 上分配快得多
    - 因为操作系统不需要寻找用来存储新数据的空间，那个位置永远都在 stack 的顶端
  - 在 heap 上分配空间需要做更多的工作
    - 操作系统首先需要找到一个足够大的空间来存放数据，然后要做好记录方便下次分配

- heap 内存组织性差一些，访问 heap 中的数据要比访问 stack 中的数据慢，因为需要通过指针才能找到 heap 中的数据
  - 当你把数据放入 heap 时，你会请求一定数量的空间
  - 操作系统在 heap 里找到一块足够大的空间，把它标记为再用，并返回一个指针，也就是这个空间的地址
  - 这个过程叫做在 heap 上进行分配，有时仅仅称为“分配”

### 函数调用

- 当你的代码调用函数时，值被传入到行数（也包括只指向 heap 的指针）。函数本地的变量被压到 stack 上。当函数结束后，这些值会从 stack 上弹出。

### 所有权存在原因

所有权解决的问题：

- 跟踪代码的哪些部分正在使用 heap 的哪些数据
- 最小化 heap 上的重复数据量
- 清理 heap 上未使用的数据以避免空间不足
- 管理 heap 数据是所有权存在的重要原因

## 所有权规则

- 每个值都有一个变量，这个变量是该值的所有者
- 每个值同时只能有一个所有者
- 当所有者超出作用域时，该值将被删除

### 变量作用域

scope 是程序中一个项目的有效范围

```rust
fn main() {
  // s 不可用
  let s = "hello"; // s 可用
  // 可以对s进行相关操作
} // s作用域到此结束，s不可再用
```

## 内存分配

- 以 String 为例，当用完 String 之后，需要使用某种方式将内存返回给操作系统，这步，在拥有 GC 的语言中，GC 会跟踪并清理不再使用的内存
- 没有 GC，就需要我们去识别内存何时不再使用，并调用代码将它返回
  - 如果忘了，就是浪费内存
  - 如果提前做了，变量就会非法
  - 如果做了两次，也是 BUG。必须一次分配对应一次释放

Rust 采用了不同的方式，对于某个值来说，当拥有它的变量走出作用范围时，内存会立即自动地交还给操作系统，此时会调用 Drop Trait

### Move

`let s1 = String::from("hello");`

![rust-string](https://misaka10032.oss-cn-chengdu.aliyuncs.com/rust/rust-string.png)

一个 String 由以上三部分组成：

1. 一个指向存放字符串内容的内存的指针
2. 一个长度 len
3. 一个容量 capacity

上面这些东西放在 stack 上，存放字符串内容的部分在 heap 上

长度 len 则是存放字符串内容所需的字节数（实际存了多少）

容量 capacity 是指 String 从操作系统总共获得内存的总字节数（最大可存多少）

`let s2 = s1;`

![rust-string-move](https://misaka10032.oss-cn-chengdu.aliyuncs.com/rust/rust-string-copy.png)

- 当把 s1 赋给 s2 时，String 的数据被复制了一份：即在 stack 上复制了一份指针、长度和容量，但并没有复制指针指向的 heap 上的数据
- 当变量离开作用域时，Rust 会自动调用 drop 函数，并将变量使用的 heap 内存释放
- 当 s1、s2 离开作用域时，它们都会尝试释放相同的内存，这里会引起二次释放（double free）BUG
- 为了保证内存安全：
  - Rust 没有尝试复制被分配的内存
  - Rust 会让 s1 失效。当 s1 离开作用域的时候，Rust 不需要释放任何东西
  - 经典报错：`error[E0382]：borrow of moved value: s1`

我们将这种变量交互的方式称为移动（Move）而不是拷贝（Copy），是因为 Rust 不同于含有 GC 的语言，直接让 s1 失效了

这里隐含了一个设计原则：**Rust 不会自动创建数据的深拷贝**

就运行时性能而言，任何自动赋值操作都是廉价的

### Clone

如果想对 heap 上面的 String 数据进行深度拷贝，而不仅仅是 stack 上的数据，可以使用 clone 方法

```rust
fn main() {
  let s1 = String::from("Hello");
  let s2 = s1.clone();

  println!("{}, {}", s1, s2);
}
```

![rust-string-clone](https://misaka10032.oss-cn-chengdu.aliyuncs.com/rust/rust-string-clone.png)

### Copy

- Copy trait，可以用于整数这样完全存放在 stack 上面的标量类型
- 如果一个类型实现了 Copy 这个 trait，那么旧的变量在赋值后仍然可用
- 如果一个类型或者该类型的一部分实现了 Drop trait，那么 Rust 不允许让它再去实现 Copy Trait
  - 例如`(i32, String)`就不允许 Copy

`let x = 5;`

`let y = x;`

整数是已知且固定大小的简单的值，这两个 5 被压到了 stack 中

## 所有权与函数

### 值传递方式

在语义上，将值传递给函数和把值传递给变量是类似的，将值传递给函数将发生 Move 或 Copy

```rust
fn main() {
  let s = String::from("Hello World");
  // s所有权Move
  take_ownership(s);
  // s失效
  let x = 5;
  // x所有权Copy
  makes_copy(x);
  // x所有权Copy后仍可用
  println!("x: {}", x);
}

fn take_ownership(some_string: String) {
  println!("{}", some_string);
}

fn makes_copy(some_number: i32) {
  println!("{}", some_number);
}
```

### 返回值与作用域

函数在返回值的过程中同样也会发生所有权转移

- 一个变量的所有权总是遵循同样的模式
  - 把一个值赋给其他变量时就会发生移动
  - 当一个包含 heap 数据的变量离开作用域时，它的值会被 drop 函数清理，除非数据的所有权移动到另一个变量上了

```rust
fn main() {
  // s1接收从gives_ownership移交的String所有权
  let s1 = gives_ownership();

  let s2 = String::from("hello");
  // s2所有权移动至takes_and_gives_back
  // s3接收从takes_and_gives_back移交的String所有权
  let s3 = takes_and_gives_back(s2);
  // s1、s3销毁
}

fn gives_ownership() -> String {
  let some_string = String::from("hello");
  // some_string所有权移动至s1
  some_string
}

fn takes_and_gives_back(a_string: String) -> String {
  // a_string所有权移动至s3
  a_string
}
```

## 引用和借用

参数的类型是`&String`而不是`String`

`&`符号就表示引用：允许你引用某些值而不取得其所有权

我们把引用作为函数参数这个行为叫做借用

```rust
fn main() {
  let s1 = String::from("Hello");
  // s1向calculate_length借用所有权，而非所有权move
  let len = calculate_length(&s1);

  println!("The length of '{}' is {}.", s1, len);
}

// s借用s1的所有权
fn calculate_length(s: &String) -> usize {
  // 会报错，引用变量不可变
  // s.push_str(", world");
  s.len()
  // 销毁s的所有权，但s引用的s1不受影响，因为s并不拥有s1的所有权
}
```

![rust-string-reference](https://misaka10032.oss-cn-chengdu.aliyuncs.com/rust/rust-string-reference.png)

### 不可变引用

**引用变量不可修改，默认不可变**

```rust
fn main() {
  let s1 = String::from("Hello");
  // s1向calculate_length借用所有权，而非所有权move
  let len = calculate_length(&s1);

  println!("The length of '{}' is {}.", s1, len);
}

// s借用s1的所有权
fn calculate_length(s: &String) -> usize {
  // 会报错，引用变量不可变
  s.push_str(", world");
  s.len()
  // 销毁s的所有权，但s引用的s1不受影响，因为s并不拥有s1的所有权
}
```

### 可变引用

```rust
fn main() {
  let mut s1 = String::from("Hello");
  // s1向calculate_length借用所有权，而非所有权move
  let len = calculate_length(&mut s1);

  println!("The length of '{}' is {}.", s1, len);
}

// s借用s1的所有权
fn calculate_length(s: &mut String) -> usize {
  s.push_str(", world");
  s.len()
  // 销毁s的所有权，但s引用的s1不受影响，因为s并不拥有s1的所有权
}
```

可变引用有一个重要限制：在特定作用域内，对某一块数据，只能有一个可变的引用

```rust
fn main() {
  let mut s = String::from("Hello");
  let s1 = &mut s;
  let s2 = &mut s;

  println!("The length of '{}' is {}.", s1, s2);
}
```

运行结果：

`error[E0499]: cannot borrow s as mutable more than once at a time`

这样做的好处是可在编译时防止数据竞争

以下三种行为会发生数据竞争：

- 两个或多个指针同时访问同一个数据
- 至少有一个指针用于写入数据
- 没有使用任何机制来同步对数据的访问

可以通过创建新的作用域，来避开同时的创建多个可变引用的禁用规则

```rust
fn main() {
  let mut s = String::from("hello");
  {
    let s1 = &mut s;
  }
  let s2 = &mut s;
}
```

### 另一重限制

- 不可以同时拥有一个可变引用和一个不可变引用
- 多个不变的引用是允许的

```rust
fn main() {
  let mut s = String::from("Hello");
  let r1 = &s;
  let r2 = &s;
  let s2 = &mut s;

  println!("{} {} {}", r1, r2, s2);
}
```

运行结果：

`error[E0502]: cannot borrow s as mutable because it is also borrowed as immutable`

### 悬空引用

别名：Dangling References

指一个指针引用了内存中的某个地址，而这块内存可能已经释放并分配给其他人使用了

在 Rust 里，编译器可保证**引用永远都不是悬空引用**

如果你引用了某些数据，编译器将保证在引用离开作用域之前数据不会离开作用域

```rust
fn main() {
  let r = dangle();
}

fn dangle() -> &String {
  let s = String::from("hello");
  &s
}
```

`error[E0106]: missing lifetime specifier`

### 引用规则

- 在任何给定的时刻，只能满足下列条件之一：
  - **一个**可变的引用
  - **任意数量**不可变的引用
- 引用必须一直有效

## 切片

切片支持多种类型：数组、元组、向量、字符串等，也就是说支持对集合中连续元素的访问进行切片，这里仅以String作为例子

demo 示例：编写一个函数，它接收字符串作为参数，返回它在这个字符串里找到的第一个单词，如果函数没找到任何空格，那么整个字符串就被返回

```rust
fn main() {
    let mut s = String::from("Hello World");
    let word_index = first_world(&s);

    // 即使调用了clear，word_index也仍然为5
    s.clear();
    println!("{}", word_index);
}

fn first_world(s: &String) -> usize {
    let mut len = s.len();
    let bytes = s.as_bytes();

    for (i, &item) in bytes.iter().enumerate() {
        if item == b' ' {
            len = i;
            break;
        }
    }
    len
}
```

上面这个 demo，虽然确实能提供正确索引，但是当目标 String 可变并且被修改之后，索引无法正确同步，仍存在一定同步风险。

因此，Rust 另外提供了一种不持有所有权的数据类型：切片（slice）

- 字符串切片是指向字符串中一部分内容的引用
- `[0..5]`表示从 0 开始，到 5 结束，左闭右开

```rust
fn main() {
  let s = String::from("Hello world");

  let hello = &s[0..5]; // 从零开始可简写[..5]
  let world = &s[6..11]; // 到末尾结束可简写[6..]
  let whole = &s[..];
}
```

注意：

- 字符串切片的范围索引必须发生在有效的 UTF-8 字符边界内
- 如果尝试从一个多字节的字符中创建字符串切片，程序会报错并退出

重写最开始的例子

```rust
fn main() {
    let mut s= String::from("Hello World");
    let word_index = first_world(&s);

    // 即使调用了clear，word_index也仍然为5
    s.clear();
    println!("{}", word_index);
}

// 改为返回字符串切片
fn main() {
    let mut s= String::from("Hello World");
    let slice = first_world(&s);

    // clear调用会报错，因为在上一行已经返回了不可变引用slice
    s.clear();
    println!("{}", slice);
}

fn first_world(s: &String) -> &str {
    let mut slice = &s[..];
    let bytes = s.as_bytes();

    for (i, &item) in bytes.iter().enumerate() {
        if item == b' ' {
            slice = &s[..i];
            break;
        }
    }
    slice
}
```

### 字符串字面量

再次重申，字符串字面值就是`&str`切片

`let s = "Hello, World!";`

变量 s 的类型是`&str`，它是一个指向二进制程序特定位置的切片，字面值不可变

### 传递字符串切片

`fn first_word(s: &String) -> &str {`

有经验的 Rust 开发者会采用`&str`作为参数类型，因为这样就可以同时接收 String 和`&str`类型的参数了

`fn first_word(s: &str) -> &str {`

定义函数时使用字符串切片来代替字符串引用，会使我们的API更加通用，且不会损失任何功能