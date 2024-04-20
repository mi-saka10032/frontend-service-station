---
title: 无畏并发
order: 14

tag:
  - spawn
  - 消息传递
  - 共享状态
  - Mutex
  - 扩展并发
---

## 并发与线程

Concurrent：程序的不同部分之间独立的执行

Parallel：程序的不同部分同时运行

Rust 无畏并发：允许你编写没有细微 BUG 的代码，并在不引入新 BUG 的情况下易于重构

### 多线程问题

竞争状态：线程以不一致的顺序访问数据或资源

死锁：两个线程彼此等待对方使用完所持有的资源，线程无法继续

只在某些情况下发生的 BUG，很难可靠地复制现象和修复

### 实现线程方式

通过调用 OS 的 API 来创建线程：属于 1：1 模型，需要较小的运行时

语言自己实现的线程（绿色线程）：属于 M：N 模型，需要更大的运行时

Rust：需要权衡运行时的支持

Rust 标准库仅提供 1：1 模型线程

## spawn

通过 thread::spawn 函数可以创建新线程，所需参数：一个闭包（在新线程里运行的代码）

```rust
use std::thread;
use std::time::Duration;

fn main() {
  thread::spawn(|| {
    for i in 1..10 {
      println!("hi number {} from the spawned thread!", i);
      thread::sleep(Duration::from_millis(1));
    }
  });

  for i in 1..5 {
    println!("hi number {} from the main thread!",i );
    thread::sleep(Duration::from_millis(1));
  }
}
```

示例中当主线程的 for 循环结束之后，将退出运行，spawn 线程无法完整执行

### 线程等待

thread::spawn 函数的返回值类型的 JoinHandle

调用其 join 方法，可以等待对应的其它线程的完成

join 方法详细描述：调用 handle 的 join 方法会阻止当前运行线程的执行，直到 handle 所表示的这些线程终结

```rust
use std::thread;
use std::time::Duration;

fn main() {
  let handle = thread::spawn(|| {
    for i in 1..10 {
      println!("hi number {} from the spawned thread!", i);
      thread::sleep(Duration::from_millis(1));
    }
  });

  for i in 1..5 {
    println!("hi number {} from the main thread!",i );
    thread::sleep(Duration::from_millis(1));
  }

  handle.join().unwrap();
}
```

### move

move 闭包通常和 thread::spawn 函数一起使用，它允许你使用其它线程的数据

创建线程时，把值的所有权从一个线程转移到另一个线程

```rust
use std::thread;

fn main() {
  let v = vec![1, 2, 3];
  let handle = thread::spawn(move || {
    println!("Here's a vector: {:?}", v);
  })

  handle.join().unwrap();
}
```

## 消息传递

一种很流行且能保证安全并发的技术就是：消息传递

线程（Actor）通过彼此发送消息（数据）来进行通信

Go 语言的名言：_不要用共享内存来通信，要用通信来共享内存_

Rust 中，通过标准库提供的 Channel 实现通信

### `Channel`定义

Channel 包含发送端和接收端

调用发送端的方法：发送数据

接收端会检查和接收到达的数据

如果发送端、接收端中任意一端被丢弃了，那么 Channel 会直接关闭

### `Channel`创建

使用 mpsc::channel 函数来创建 Channel

mpsc：表示 multiple producer，single consumer（多个生产者、一个消费者）

返回值：一个 tuple，里面元素分别是发送端、接收端

### `Channel`方法

**发送端**

`send()`方法

参数：想要发送的数据

返回：`Result<T, E>`

- 如果有问题（例如接收端已被丢弃），就返回一个错误

**接收端**

`recv()`方法：阻止当前线程执行，直到 channel 有值发送过来

- 一旦有值收到，就返回`Result<T, E>`
- 当发送端关闭，就会收到一个错误

`try_recv()`方法：不会阻塞当前线程

- 立即返回`Result<T, E>`
- 如果有数据到达，返回 Ok，里面包含数据
- 否则返回一个错误
- 通常使用循环调用来检查 try_recv 的结果

```rust
use std::sync::mpsc;
use std::thread;

fn main() {
  let (tx, rx) = mpsc::channel();

  thread::spawn(move || {
    let val = String::from("hi");
    tx.send(val).unwrap();
  })

  // 主线程将持续同步阻塞直到接收到channel消息
  let received = rx.recv().unwrap();
  println!("Got: {}", received);
}
```

### `Channel`多值发送

```rust
use std::sync::mpsc;
use std::thread;
use std::time::Duration;

fn main() {
    let (tx, rx) = mpsc::channel();

    thread::spawn(move || {
        let vals = vec!["hi", "from", "the", "thread"];

        for val in vals {
            tx.send(val).unwrap();
            thread::sleep(Duration::from_millis(200));
        }
    });

    for received in rx {
        println!("Got: {}", received);
    }
}
```

### `Channel`克隆

```rust
use std::sync::mpsc;
use std::thread;
use std::time::Duration;

fn main() {
    let (tx, rx) = mpsc::channel();

    let tx1 = mpsc::Sender::clone(&tx);

    thread::spawn(move || {
        let vals = vec!["1 hi", "1 from", "1 the", "1 thread"];

        for val in vals {
            tx1.send(val).unwrap();
            thread::sleep(Duration::from_millis(200));
        }
    });

    thread::spawn(move || {
        let vals = vec!["hi", "from", "the", "thread"];

        for val in vals {
            tx.send(val).unwrap();
            thread::sleep(Duration::from_millis(200));
        }
    });

    for received in rx {
        println!("Got: {}", received);
    }
}
```

## 共享状态

Rust 支持通过共享状态来实现并发

Channel 类似单所有权：一旦将值的所有权转移至 Channel，就无法使用它了

共享内存并发类似多所有权：多个线程可以同时访问同一块内存

### `Mutex`定义

Mutex 是 mutual exclusion（互斥锁）的简写

在同一时刻，Mutex 只允许一个线程来访问某些数据

想要访问数据，线程必须首先获取互斥锁（lock）

Mutex 通常被描述为：通过锁定系统来保护它所持有的数据

使用规则有二：

1. 在使用数据之前，必须尝试获取 lock
2. 使用完 Mutex 所保护的数据，必须对数据进行解锁，以便其它线程可以获取 lock

### `Mutex`创建

通过`Mutex::new(数据)`来创建`Mutex<T>`（这是一个智能指针）

访问数据前，通过 lock 方法来获取锁

- 该操作会阻塞当前线程
- lock 可能会失败
- 返回的是 MutexGuard（智能指针，实现了 Deref 和 Drop）

### `Mutex`多线程共享

Mutex 在多线程之间共享所有权不能使用`Rc<T>`，而是`Arc<T>`原子引用计数

`Arc<T>`和`Rc<T>`的 API 是相同的，但是牺牲了一部分性能作为代价

```rust
use std::sync::{Arc, Mutex};
use std::thread;

fn main() {
    let counter = Arc::new(Mutex::new(0));
    let mut handles = vec![];

    for _ in 0..10 {
        let count = Arc::clone(&counter);
        let handle = thread::spawn(move || {
            let mut num = count.lock().unwrap();
            *num += 1;
        });
        handles.push(handle);
    }

    for handle in handles {
        handle.join().unwrap();
    }

    println!("Result: {}", Arc::clone(&counter).lock().unwrap());
}
```

### RefCellVsMutex

`Mutex<T>`提供了内部可变性，和 Cell 家族一样

我们使用`RefCell<T>`来改变`Rc<T>`里面的内容

我们使用`Mutex<T>`来改变`Arc<T>`里面的内容

注意：`Mutex<T>`有死锁风险

## 扩展并发

Rust 语言的并发特性较少，目前讲的并发特性都来自标准库（而不是语言本身）

Rust 语言中有两个并发概念：

- `std::marker::Sync`
- `std::marker::Send`

### Send

Send 允线程之间转移所有权

实现了 Send trait 的类型可在线程间转移所有权

Rust 中几乎所有的类型都实现了 Send。但是`Rc<T>`没有实现 Send，它只用于单线程情景

任何完全由 Send 类型组成的类型也被标记为 Send

除了原始指针之外，几乎所有的基础类型都是 Send

### Sync

Sync 允许从多线程访问

实现了 Sync trait 的类型可以安全地被多个线程引用

如果 T 是 Sync，那么`&T`就是 Send

基础类型都是 Sync

完全由 Sync 类型组成的类型也是 Sync。

但是`Rc<T>`不是 Sync，`RefCell<T>`和`Cell<T>`也不是 Sync

`Mutex<T>`是 Sync

**注意：手动实现 Send 和 Sync 是不安全的**
