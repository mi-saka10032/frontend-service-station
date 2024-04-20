---
title: 闭包与迭代器
order: 11

tag:
  - closures
  - iterators
  - 运行时性能
---

## 闭包

### 闭包定义

闭包：可以捕获其所在环境的匿名函数

- 这个匿名函数，可保存为变量、可作为参数
- 可在一个地方创建闭包，然后在另一个上下文中调用闭包来完成运算
- 可从其定义的作用域捕获值

例子：生成自定义运动计划的程序

算法的逻辑不是重点，重点是算法中的计算过程需要几秒钟时间。

目标：不让用户发生不必要的等待，仅在必要时调用该算法，且只调用一次

```rust
use std::thread;
use std::time::Duration;

fn main() {
  let simulated_user_specified_value = 10;
  let simulated_random_number = 7;

  generate_workout(simulated_user_specified_value, simulated_random_number);
}

// 普通函数
fn simulated_user_specified_value(intensity: u32) -> u32 {
  println!("calculating slowly...");
  thread::sleep(Duration::from_secs(2));
  intensity
}

fn generate_workout(intensity: u32, random_number: u32) {
  // 闭包函数
  let expensive_closure = |num| {
    println!("calculating slowly...");
    thread::sleep(Duration::from_secs(2));
    num
  };

  if intensity < 25 {
    println!("Today, do {} pushups!", expensive_closure(intensity));
    println!("Next, do {} situps!", expensive_closure(intensity));
  } else {
    if random_number == 3 {
      println!("Take a break today! Remember to stay hydrated!");
    } else {
      println!("Today, run for {} minutes!", expensive_closure(intensity));
    }
  }
}
```

### 闭包类型推断和标注

- 闭包不要求标注参数和返回值的类型
- 闭包通常很短小，只在狭小的上下文中工作，编译器通常能推断出类型
- 也可以手动添加类型标注

函数和闭包的定义语法四种写法

`fn add_one_v1 (x: u32) -> u32 { x + 1 }`

`fn add_one_v1 |x: u32| -> u32 { x + 1 };`

`fn add_one_v1 |x| { x + 1 };`

`fn add_one_v1 |x|  x + 1 ;`

闭包的定义最终只会为参数/返回值推断出唯一具体的类型

### 闭包存储

使用泛型参数和 Fn Trait 来存储闭包

解决上面程序的问题，另一种解决方案：

- 创建一个 struct，它持有闭包及其调用结果
- 只会在需要结果时才执行该闭包
- 可缓存结果

这个模式叫做记忆化（memoization）或延迟计算（lazy evaluation）

**让 struct 持有闭包**

struct 的定义需要知道所有字段的类型：需要指明闭包的类型

每个闭包实例都有自己唯一的匿名类型，即使两个闭包签名完全一样

需要使用：泛型和 Trait Bound

Fn traits 由标准库提供：

所有的闭包都至少实现了以下 trait 之一：

- Fn
- FnMut
- FnOnce

- 方案一：使用缓存器（Cacher）实现的限制

1. Cacher 实例假定针对不同的参数 arg，value 方法总会得到同样的值
2. 可以使用 HashMap 代替单个值
   - key：arg 参数
   - value：执行闭包的结果
3. 只能接收一个 u32 类型的参数和 u32 类型的返回值

```rust
use std::thread;
use std::time::Duration;

fn main() {
    let simulated_user_specified_value = 10;
    let simulated_random_number = 7;

    generate_workout(simulated_user_specified_value, simulated_random_number);
}

struct Cacher<T>
where
    T: Fn(u32) -> u32,
{
    calculation: T,
    value: Option<u32>,
}

impl<T> Cacher<T>
where
    T: Fn(u32) -> u32,
{
    fn new(calculation: T) -> Cacher<T> {
        Cacher {
            calculation,
            value: None,
        }
    }

    fn value(&mut self, arg: u32) -> u32 {
        match self.value {
            Some(v) => v,
            None => {
                let v = (self.calculation)(arg);
                self.value = Some(v);
                v
            }
        }
    }
}

fn generate_workout(intensity: u32, random_number: u32) {
    // 闭包函数
    let mut expensive_closure = Cacher::new(|num| {
        println!("calculating slowly...");
        thread::sleep(Duration::from_secs(2));
        num
    });

    if intensity < 25 {
        println!("Today, do {} pushups!", expensive_closure.value(intensity));
        println!("Next, do {} situps!", expensive_closure.value(intensity));
    } else {
        if random_number == 3 {
            println!("Take a break today! Remember to stay hydrated!");
        } else {
            println!("Today, run for {} minutes!", expensive_closure.value(intensity));
        }
    }
}
```

### 闭包捕获环境

- 闭包可以访问定义它的作用域内的变量，而普通函数则不能
- 相对的，会产生内存开销

```rust
fn main() {
  let x = 4;

  // 正确
  let equal_to_x = |z| z = x;
  // can't capture dynamic environment in a fn item
  fn equal_to_x(z: i32) -> bool {
    z == x
  }

  let y = 4;

  assert!(equal_to_x(y));
}
```

从所在环境捕获值的方式

1. 取得所有权：FnOnce
2. 可变借用：FnMut
3. 不可变借用：Fn

创建闭包时，通过闭包对环境值的使用，Rust 推断出具体使用哪个 trait

- 所有的闭包都实现了 FnOnce
- 没有移动捕获变量的实现了 FnMut
- 无需可变访问捕获变量的闭包实现了 Fn

**move 关键字**

在参数列表前使用 move 关键字，可以强制闭包取得它所使用的环境值的所有权

当将闭包传递给新线程以移动数据使其归新线程所有时，此技术最为有用

```rust
fn main() {
  let x = vec![1, 2, 3];

  let equal_to_x = move |z| z == x;

  // 报错 borrow of moved value : `x`
  println!("can't use x here: {:?}", x);

  let y = vec![1, 2, 3];

  assert!(equal_to_x(y));
}
```

**最佳实践**

当指定 Fn trait bound 之一时，首先用 Fn，基于闭包体里的情况，如果需要 FnOnce 或 FnMut，编译器会再告诉你

## 迭代器

迭代器模式：对一系列项执行某些任务

迭代器负责：

- 遍历每个项
- 确定序列（遍历）何时完成

Rust 的迭代器是懒惰的：除非调用消费迭代器的方法，否则迭代器本身没有任何效果

```rust
fn main() {
  let v1 = vec![1, 2, 3];
  let v1_iter = v1.iter();

  for val in v1_iter {
    println!("Got: {}", val);
  }
}
```

### 迭代方法

Iterator trait

所有的迭代器都实现了 Iterator trait，Iterator trait 定义于标准库，定义大致如下：

```rust
pub trait Iterator {
  type Item;

  fn next(&mut self) -> Option<Self::Item>;

  // methods with default implementations elided
}
```

`type Item` 和 `Self::Item` 定义了与此该 trait 关联的类型

实现需求：

类型：实现 Iterator trait 需要你定义一个 Item 类型，它用于 next 方法的返回类型（迭代器的返回类型）

方法：Iterator trait 仅要求实现一个方法：next

- 每次返回迭代器中的一项
- 返回结果包裹在 Some 里面
- 迭代结束，返回 None
- 可直接在迭代器上调用 next 方法

iter：在不可变引用上创建迭代器

into_iter：创建的迭代器会获得所有权

iter_mut：迭代可变的引用

### 消耗/产生迭代器

- 消耗迭代器的方法

在标准库中，Iterator trait 有一些带默认实现的方法，其中有一些方法会调用 next 方法

实现 Iterator trait 时必须实现 next 方法的原因之一：调用 next 的方法叫做“消耗型适配器”，调用它们会把迭代器消耗殆尽

以 sum 方法为例：

1. 取得迭代器的所有权
2. 通过反复调用 next，遍历所有元素
3. 每次迭代，把当前元素添加到一个总和里，迭代结束，返回总和

```rust
fn main() {
  fn iterator_sum() {
    let v1 = vec![1, 2, 3];
    let v1_iter = v1.iter();
    let total: i32 = v1_iter.sum();
    println!("total is: {}", total);
  }
}
```

- 产生其他迭代器的方法

定义在 Iterator trait 上的另外一些方法叫做“迭代器适配器”，可以把迭代器转换为不同种类的迭代器

同时，可以通过链式调用使用多个迭代器适配器来执行复杂的操作，这种调用可读性比较高

以 map collect 方法为例：

1. 接收一个闭包，闭包作用于每个元素
2. 产生一个新的迭代器
3. collect 方法：消耗型适配器，把结果收集到一个集合类型中

```rust
fn main() {
  fn iterator_sum() {
    let v1 = vec![1, 2, 3];
    let v2: Vec<_> = v1.iter().map(|x| x + 1).collect();
    println!("{:?}", v2);
  }
}
```

- 闭包与迭代器配合捕获环境方法

filter：

- 接收一个闭包
- 这个闭包在遍历迭代器的每个元素时，返回 bool 类型
- 如果闭包返回 true：当前元素将会包含在 filter 产生的迭代器中
- 如果闭包返回 false：当前元素将不会包含在 filter 产生的迭代器中

### 自定义迭代器

使用 Iterator trait 创建自定义迭代器首先需要实现 next 方法

```rust
struct Counter {
  count: u32,
}

impl Counter {
  fn new() -> Counter {
    Counter { count: 0 }
  }
}

impl Iterator for Counter {
  type Item = u32;

  fn next(&mut self) -> Option<Self::Item> {
    if self.count < 5 {
      self.count += 1;
      Some(self.count)
    } else {
      None
    }
  }
}

#[test]
fn calling_next_directly() {
  let mut counter = Counter::new();

  assert_eq!(counter.next(), Some(1));
  assert_eq!(counter.next(), Some(2));
  assert_eq!(counter.next(), Some(3));
  assert_eq!(counter.next(), Some(4));
  assert_eq!(counter.next(), Some(5));
  assert_eq!(counter.next(), None);
}

#[test]
fn using_other_iterator_trait_methods() {
    let sum: u32 = Counter::new()
        .zip(Counter::new().skip(1))
        .map(|(a, b)| a * b)
        .filter(|x| x % 3 == 0)
        .sum();

    assert_eq!(18, sum);
}
```

## 优化调整`项目1`

```rust
use std::error::Error;
use std::{env, fs};

pub struct Config {
    query: String,
    filename: String,
    case_sensitive: bool,
}

impl Config {
    pub fn new(mut args: std::env::Args) -> Result<Config, &'static str> {
        if args.len() < 3 {
            return Err("not enough arguments");
        }
        // 使用迭代器优化调整
        args.next();

        let query = match args.next() {
            Some(arg) => arg,
            None => return Err("Didn't get a query string"),
        };
        let filename = match args.next() {
            Some(arg) => arg,
            None => return Err("Didn't get a file name"),
        };

        // 注入env 出现err表示变量未出现：true；未出现err表示变量已存在：false
        let case_sensitive = env::var("CASE_INSENSITIVE").is_err();
        Ok(Config {
            query,
            filename,
            case_sensitive,
        })
    }

    pub fn run(&self) -> Result<(), Box<dyn Error>> {
        let contents = fs::read_to_string(&self.filename)?;
        let results = if self.case_sensitive {
            Config::search(&self.query, &contents)
        } else {
            Config::search_case_insensitive(&self.query, &contents)
        };
        for line in results {
            println!("{}", line);
        }
        Ok(())
    }

    pub fn search<'a>(query: &str, contents: &'a str) -> Vec<&'a str> {
        contents
            .lines()
            .filter(|line| line.contains(query))
            .collect()
    }

    pub fn search_case_insensitive<'a>(query: &str, contents: &'a str) -> Vec<&'a str> {
        contents
            .lines()
            .filter(|line| line.to_lowercase().contains(&query.to_lowercase()))
            .collect()
    }
}
```

## 性能比较

循环和迭代器性能比较：String 内遍历查找字符串的速度，迭代器会更快一点

**零开销抽象**

使用抽象时不会引入额外的运行时开销
