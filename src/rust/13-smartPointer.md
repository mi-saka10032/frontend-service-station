---
title: 智能指针
order: 13

tag:
  - 智能指针
  - Box
  - Cons链表
  - DerefTrait
  - DropTrait
  - Rc
  - RefCell
  - 内存泄漏
  - WeakReference
---

## 智能指针

**智能指针扩展了 Rust 的语言功能，使其可以完成一些不安全操作**

指针：一个变量在内存中包含的一个地址（指向其它数据）

引用：使用`&`表示，表示借用它指向的值。没有其余开销，是最常见的指针类型

智能指针是这样的数据结构：

- 行为和指针相似
- 有额外的元数据和功能

通过记录所有者的数量，使一份数据被多个所有者同时持有

**两者区别**

引用：只借用数据
智能指针：很多时候都拥有它所指向的数据

智能指针的例子：

`String`和`Vec<T>`：

- 都拥有一片内存区域
- 允许用户对其操作
- 还拥有元数据（例如容量等）
- 提供额外的功能或保障（String 保障其数据是合法的 UTF-8 编码）

智能指针通常使用 struct 实现，并且实现了：Deref 和 Drop 这两个 trait

Deref trait：允许智能指针 struct 的实例像引用一样使用
Drop trait：允许你自定义当智能指针实例走出作用域时的代码

## `Box<T>`

`Box<T>`是最简单的智能指针：

- 允许你在 heap 上存储数据而不是 stack。而 stack 上是指向 heap 数据的指针
- 没有性能开销，没有其它额外功能
- 实现了 Deref trait 和 Drop trait

常用场景：

1. 在编译时，某类型的大小无法确定，但使用该类型时，上下文却需要知道它的确切大小
2. 当你有大量数据，想移交所有权，但需要确保在操作时数据不会被复制
3. 使用某个值时，你只关心它是否实现了特定的 trait，而不关心它的具体类型

使用 Box 赋能递归类型

在编译时，Rust 需要知道一个类型所占的空间大小，而递归类型的大小无法在编译时确定

Box 类型的大小确定，在递归类型中使用 Box 就可解决上述问题

## ConsList

ConsList 是来自 Lisp 语言的一种数据结构（俗称：链表）

ConsList 里每个成员由两个成员组成：当前项的值和下一个元素

ConsList 里最后一个成员只包含一个 Nil 值，没有下一个元素

要注意的时，ConsList 并不是 Rust 的常用集合，通常情况下`Vec<T>`是更好的选择

按照普通写法实现的 ConsList 无法正常编译

```rust
use crate::List::{Cons, Nil};

fn main() {
  // error[E0072]: recursive type `List` has infinite size
  let list = Cons(1, Cons(2, Cons(3, Nil)));
}

enum List {
  Cons(i32, List),
  Nil,
}
```

为了解决这个错误，需要使用 Box 来获得确定大小的递归类型，因为`Box<T>`是一个指针，Rust 知道它需要多少空间，指针的大小不会基于它指向的数据的大小变化而变化

```rust
use crate::List::{Cons, Nil};

fn main() {
  let list = Cons(1,
      Box::new(Cons(2,
          Box::new(Cons(3,
              Box::new(Nil))))));
}

enum List {
  Cons(i32, Box<List>),
  Nil,
}
```

## DerefTrait

实现 Deref Trait 使我们可以自定义解引用运算符`*`的行为

通常实现 Deref，智能指针可以像常规引用一样来处理

解引用运算符：

- 常规引用是一种指针

```rust
fn main() {
  let x = 5;
  let y = &x;

  assert_eq!(5, x);
  // 如果不加*会报错：error[E0277]: can't compare `{integer}` with `${integer}`
  assert_eq!(5, *y);
}
```

`Box<T>`可以代替上例中的引用：`let y = Box::new(x);`

### 定义自己的智能指针

`Box<T>`被定义成拥有一个元素的 tuple struct（需要实现 DerefTrait）

```rust
use std::ops::Deref;

struct MyBox<T>(T);

impl<T> MyBox<T> {
  fn new (x: T) -> MyBox<T> {
    MyBox(x)
  }
}

impl<T> Deref for MyBox<T> {
  type Target = T;

  fn deref(&self) -> &T {
    &self.0;
  }
}

fn main() {
  let x = 5;
  let y = MyBox::new(x);

  assert_eq!(5, x);
  // *y 将隐式展开为 *(y.deref())
  assert_eq!(5, *y);
}
```

### 隐式解引用转化

隐式解引用转化（Deref Coercion）是为函数和方法提供的一种便捷特性

假设 T 实现了 Deref Trait：Deref Coercion 可以把 T 的引用转化为 T 经过 Deref 操作后生成的引用

当把某类型的引用传递给函数或方法时，但它的类型与定义的参数类型不匹配：

1. Deref Coercion 会自动发生
2. 编译器会对 deref 进行一系列调用，来把它转为所需的参数类型。这一步会在编译时完成，没有额外性能开销

```rust
use std::ops::Deref;

fn hello(name: &str) {
  println!("Hello, {}", name);
}

fn main() {
  let m = MyBox::new(String::from("Rust"));

  // &m &MyBox<String>
  // deref &String
  // deref &str
  hello(&m);
  hello(&(*m)[..]);

  hello("Rust");
}
```

### 解引用与可变性

可使用 DerefMut trait 重载可变引用的`*`运算符

在类型和 trait 在下列三种情况发生时，Rust 会执行 deref coercion:

1. 当 T：`Deref<Target = U>`，允许`&T`转换为`&U`
2. 当 T：`DerefMut<Target = U>`，允许`&mut T`转换为`&mut U`
3. 当 T：`Deref<Target = U>`，允许`&mut T`换换位`&U`

## DropTrait

实现 Drop Trait，可以让我们自定义当值将要离开作用域时发生的动作，如：文件、网络资源释放等。任何类型都可以实现 Drop trait

Drop Trait 只要求你实现 drop 方法。参数：对 self 的可变引用

Drop Trait 在预导入模块里（prelude）

```rust
struct CustomSmartPointer {
  data: String,
}

impl Drop for CustomSmartPointer {
  fn drop(&mut self) {
    println!("Dropping CustomSmartPointer with data `{}`!", self.data);
  }
}

fn main() {
  let c = CustomSmartPointer { data: String::from("my stuff") };
  let d = CustomSmartPointer { data: String::from("other stuff") };
  println!("CustomSmartPointer created.");
}
```

### 提前释放

很难直接禁用自动的 drop 功能，也没必要。因为 Drop Trait 的目的就是进行自动的释放处理逻辑

Rust 不允许手动调用 Drop Trait 的 drop 方法

但可以调用标准库的`std::mem:drop`函数，来提前 drop 值（prelude 模块）

## Rc

`Rc<T>`是引用计数智能指针

有时，一个值会有多个所有者

为了支持多重所有权，Rust 引入了`Rc<T>`：

- reference counting（引用计数）
- 追踪所有到值的引用
- 0 个引用：该值可以被清理掉

### 使用场景：

需要在 heap 上分配数据，这些数据被程序的多个部分读取（只读），但在编译时无法确定哪个部分最后使用完这些数据

`Rc<T>`通过不可变引用，使你可以在程序不同部分之间共享只读数据

`Rc<T>`只能用于单线程场景

注意：`Rc<T>`不在预导入模块中（prelude）

`Rc::clone(&a)`函数：增加引用计数

`Rc::strong_count(&a)`：获得引用计数

`Rc::weak_count(&a)`：获得弱引用计数

以 ConsList 为例，来查看 Rc 的使用

```rust
use crate::List::{Cons, Nil};

enum List {
  Cons(i32, Box<List>),
  Nil,
}

fn main() {
  let a = Cons(5,
      Box::new(Cons(10,
          Box::new(Nil))));

  let b = Cons(3, Box::new(a));
  // error[E0382]: use of moved value: `a`
  let c = Cons(3, Box::new(a));
}
```

使用 Rc 解决

```rust
use crate::List::{Cons, Nil};
use std::rc::Rc;

enum List {
  Cons(i32, Rc<List>),
  Nil,
}

fn main() {
  let a = Rc::new(Cons(5, Rc::new(Cons(10, Rc::new(Nil)))));

  let b = Cons(3, Rc::clone(&a));
  let c = Cons(3, Rc::clone(&a));
}
```

### Rc::clone

`Rc::clone()`：增加引用，不会执行数据的深度拷贝操作

类型的`clone()`：很多会执行数据的深度拷贝操作

## RefCell

内部可变性（interior mutability）是 Rust 的设计模式之一

它允许你在只持有不可变引用的前提下对数据进行修改

数据结构中使用了 unsafe 代码来绕过 Rust 正常的可变性和借用规则

与`Rc<T>`不同，`RefCell<T>`类型代表了其持有数据的唯一所有权

### 记录借用信息

两个方法（安全接口）：

- borrow 方法：返回智能指针`Ref<T>`，它实现了 Deref
- borrow_mut 方法：返回智能指针`RefMut<T>`，它实现了 Deref

`RefCell<T>`会记录当前存在多少个活跃的`Ref<T>`和`RefMut<T>`智能指针：

- 每次调用 borrow：不可变借用计数加 1
- 任何一个`Ref<T>`的值离开作用域被释放时，不可变借用计数减 1
- 每次调用 borrow_mut：可变借用计数加 1
- 任何一个`RefMut<T>`的值离开作用域被释放时，可变借用计数减 1

以此计数来维护借用检查规则：

- 任何一个给定时间里，只允许拥有多个不可变借用或一个可变借用

### 拥有多重所有权的可变数据示例

```rust
use crate::List::{Cons, Nil};
use std::{cell::RefCell, rc::Rc};

#[derive(Debug)]
enum List {
    Cons(Rc<RefCell<i32>>, Rc<List>),
    Nil,
}

impl List {
    // 修改当前Cons的元素
    fn set_tail(&self) -> Result<(), List> {
        match self {
            Cons(count, _) => {
                *count.borrow_mut() += 10;
                Ok(())
            }
            Nil => Err(List::Nil),
        }
    }
}

fn main() {
    let value = Rc::new(RefCell::new(5));
    let a = Rc::new(Cons(Rc::clone(&value), Rc::new(Nil)));
    let b = Cons(Rc::new(RefCell::new(6)), Rc::clone(&a));
    let c = Cons(Rc::new(RefCell::new(10)), Rc::clone(&a));

    let _ = a.set_tail();

    println!("a after = {:?}", a);
    println!("b after = {:?}", b);
    println!("c after = {:?}", c);
}
```

### 其它可实现内部可变性的类型

`Cell<T>`：通过复制来访问数据

`Mutex<T>`：用于实现跨线程情形下的内部可变性模式

## 智能指针比较

比较`RefCell<T>`和`Box<T>`

| `Box<T>`                     | `RefCell<T>`             |
| :--------------------------- | :----------------------- |
| 编译阶段强制代码遵守借用规则 | 只会在运行时检查借用规则 |
| 否则出现错误                 | 否则触发 panic           |

借用规则在不同阶段进行检查的比较

| 编译阶段               | 运行时                                                 |
| :--------------------- | :----------------------------------------------------- |
| 尽早暴露问题           | 问题暴露延后，甚至到生产环境                           |
| 没有任何运行时开销     | 因为借用计数产生些许性能损失                           |
| 对大多数场景是最佳选择 | 实现某些特定的内存安全场景（不可变环境中修改自身数据） |

与`Rc<T>`相似，`RefCell<T>`也只能用于单线程场景

选择依据

|                  | `Box<T>`                       | `Rc<T>`                  | `RefCell<T>`                   |
| :--------------- | :----------------------------- | :----------------------- | :----------------------------- |
| 同一数据的所有者 | 一个                           | 多个                     | 一个                           |
| 可变性、借用检查 | 可变、不可变借用（编译时检查） | 不可变借用（编译时检查） | 可变、不可变借用（运行时检查） |

其中：即便`RefCell<T>`本身不可变，但仍能修改其中存储的值

## 内存泄漏问题

Rust 的内存安全机制可以保证很难发生内存泄漏，但不是不可能

例如使用`Rc<T>`和`RefCell<T>`就可能创造出循环引用，从而发生内存泄漏：每个项的引用数量不会变成 0，值也不会被处理掉

```rust
use crate::List::{Cons, Nil};
use std::{cell::RefCell, rc::Rc};

#[derive(Debug)]
enum List {
    Cons(i32, RefCell<Rc<List>>),
    Nil,
}

impl List {
    fn tail(&self) -> Option<&RefCell<Rc<List>>> {
        match self {
            Cons(_, item) => Some(item),
            Nil => None,
        }
    }
}

fn main() {
    let a = Rc::new(Cons(5, RefCell::new(Rc::new(Nil))));

    println!("a initial rc count = {}", Rc::strong_count(&a));
    println!("a next item = {:?}", a.tail());

    let b = Rc::new(Cons(10, RefCell::new(Rc::clone(&a))));
    println!("a rc count after b creation = {}", Rc::strong_count(&a));
    println!("b initial rc count = {}", Rc::strong_count(&a));
    println!("b next item = {:?}", b.tail());

    if let Some(link) = a.tail() {
        *link.borrow_mut() = Rc::clone(&b);
    }

    println!("b rc count after changing a = {}", Rc::strong_count(&b));
    println!("a rc count after changing a = {}", Rc::strong_count(&a));

    // Uncomment the next line to see that we have a cycle;
    // it will overflow the stack.
    // println!("a next item = {:?}", a.tail());
}
```

取消注释最后一行打印函数，将发生堆栈溢出

![Rc-StackOverflow](https://misaka10032.oss-cn-chengdu.aliyuncs.com/rust/rc-overflowStack.png)

### 防止内存泄漏的解决办法

1. 依靠开发者来保证，不依靠 Rust
2. 重新组织数据结构：一些引用来表达所有权，一些引用不表达所有权：循环引用中的一部分具有所有权关系，另一部分不涉及所有权关系。而只有所有权关系才影响值的清理
3. 防止循环引用，还可以把`Rc<T>`换成`Weak<T>`

`Rc::clone`为`Rc<T>`实例的 strong_count 加 1，`Rc<T>`的实例只有在 strong_count 为 0 的时候才会被清理

`Rc<T>`实例通过调用`Rc::downgrade`方法可以创建值的 Weak Reference（弱引用）：

- 返回类型是`Weak<T>`（智能指针）
- 调用`Rc::downgrade`会为 weak_count 加 1
- `Rc<T>`使用 weak_count 来追踪存在多少`Weak<T>`
- weak_count 不为 0 并不影响`Rc<T>`实例的清理

### StrongVsWeak

Strong Reference（强引用）是关于如何分享`Rc<T>`实例的所有权

Weak Reference（弱引用）并不表达上述意思

使用 Weak Reference 并不会创建循环引用：并且当 Strong Reference 数量为 0 的时候，Weak Reference 会自动断开

使用注意：在使用`Weak<T>`之前，需要保证它指向的值仍然存在

返回值：在`Weak<T>`实例上调用 upgrade 方法，返回`Option<Rc<T>>`

```rust
use std::{
    cell::RefCell,
    rc::{Rc, Weak},
};

#[derive(Debug)]
struct Node {
    value: i32,
    parent: RefCell<Weak<Node>>,
    children: RefCell<Vec<Rc<Node>>>,
}

fn main() {
    let leaf = Rc::new(Node {
        value: 3,
        parent: RefCell::new(Weak::new()),
        children: RefCell::new(vec![]),
    });

    println!("leaf parent = {:?}", leaf.parent.borrow().upgrade());

    let branch = Rc::new(Node {
        value: 5,
        parent: RefCell::new(Weak::new()),
        children: RefCell::new(vec![Rc::clone(&leaf)]),
    });

    *leaf.parent.borrow_mut() = Rc::downgrade(&branch);

    println!("leaf parent = {:?}", leaf.parent.borrow().upgrade());
}
```

