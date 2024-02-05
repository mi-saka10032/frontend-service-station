---
title: 通用的编程概念
order: 1

tag:
  - Rust变量
  - Rust关键字
  - Rust常量
  - Rust数据类型
  - Rust函数与注释
  - Rust控制流
---

## 变量与关键字与常量

### 变量与可变性

- 声明变量使用 let 关键字
- 默认情况下，变量是不可变的（Immutable）
- 声明变量时，在变量前面加上 mut，就可以使变量可变。

错误示例

```rust
fn main() {
  println!("Hello World");

  let x = 5;
  println!("The value of x is {}", x);

  x = 6;
  println!("The value of x is {}", x);
}
```

`error[E0384]：Cannot assign twice to immutable variable x`

正确示例

```rust
fn main() {
  println!("Hello World");

  let mut x = 5;
  println!("The value of x is {}", x);

  x = 6;
  println!("The value of x is {}", x);
}
```

### 变量与常量

- 常量（constant），常量在绑定值以后也是不可变的，但是它与不可变的变量有很多区别：
  - 不可以使用 mut，常量永远都是不可变的
  - 声明常量需要使用 const 关键字，它的类型必须被标注
  - 常量可以在任何作用域内进行声明，包括全局作用域
  - 常量只可以绑定到常量表达式，无法绑定到函数的调用结果或只能在运行时才能计算出的值
- 在程序运行期间，常量在其声明的作用域内一直有效
- 命名规范：Rust 里常量使用全大写字母，每个单词之间用下划线分开
  - 例子：`const MAX_POINTS:u32 = 100_000`;

### Shadowing

- 变量 shadow 是指在同一个作用域内，使用一个新的变量名来覆盖（隐藏）之前的同名变量。这样做可以在同一个作用域内重新定义一个新的变量，而不会影响之前的同名变量

```rust
fn main() {
  let x = 5;
  let x = x + 1;
  let x = x * 2;
  // The value of x is 12
  println!("The value of x is {}", x);
}
```

shadow 和把变量标记为 mut 不一样：

- 如果不使用 let 关键字，那么重新给非 mut 的变量赋值会导致编译时错误
- 使用 let 声明的同名新变量，也是不可变的
- 使用 let 声明的同名新变量，它的类型可以与之前不同

```rust
fn main() {
  // √
  let spaces = "     ";
  let spaces = spaces.len();

  println!("{}", spaces);
}
```

```rust
fn main() {
  // ×
  let mut spaces = "     ";
  spaces = spaces.len();

  println!("{}", spaces);
}
```

## 数据类型

- Rust 数据类型分为：标量和复合类型
- Rust 是静态编译语言，在编译时必须知道所有变量的类型
  - 基于使用的值，编译器通常能够推断出它的具体类型
  - 但如果可能的类型比较多（例如把 String 转为整数的 parse 方法），就必须添加类型的标准，否则编译出错

```rust
fn main() {
  // 必须声明guess的类型，因为parse整数的结果多样，可以是i32 u32 i64等
  let guess: u32 = "42".prase().expect("Not a number");

  println!("{}", guess);
}
```

### 标量类型

- 一个标量类型代表一个单个的值
- Rust 有四个主要的标量类型
  - 整数类型
  - 浮点类型
  - 布尔类型
  - 字符类型

#### 整数类型

- 整数类型没有小数部分
- 无符号整数类型以 u 开头
- 有符号整数类型以 i 开头

| Length  | Signed | Unsigned |
| :------ | :----- | :------- |
| 8-bit   | i8     | u8       |
| 16-bit  | i16    | u16      |
| 32-bit  | i32    | u32      |
| 64-bit  | i64    | u64      |
| 128-bit | i128   | u128     |
| arch    | isize  | usize    |

- 有符号范围：-(2^(n-1)) ~ 2^(n-1) -1
- 无符号范围：0 ~ 2^n -1
- isize 和 usize 类型由计算机的结构所决定，如果是 64 位计算机则是 64 位
- 使用 isize 或 usize 的主要场景是对某种集合进行索引操作

##### 整数字面值

整数可以通过加下划线增强可读性，并不影响整数的值

除了 byte 类型以外，所有的数值字面值都允许使用类型后缀

整数的默认类型是 i32

| Length        | Signed      |
| :------------ | :---------- |
| Decimal       | 98_222      |
| Hex           | 0xff        |
| Octal         | 0o77        |
| Binary        | 0b1111_0000 |
| Byte(u8 only) | b'A'        |

##### 整数溢出

例如：u8 的范围是 0-255，如果你把一个 u8 变量设为 256

- 调试模式：编译会检查溢出，运行时发生 panic
- 发布模式（--release）：Rust 不会检查可能导致 panic 的整数溢出
  - 如果溢出，Rust 会执行“环绕”操作：256 变为 0,257 变为 1...

#### 浮点类型

- f32，32 位，单精度
- f64，64 位，双精度

Rust 的浮点类型使用了 IEEE-754 标准来表述

f64 是默认类型，因为在现代 CPU 上 f64 和 f32 速度差不多，且精度更高

Rust 也支持对浮点类型取余，限制要求：分子分母都是同类型浮点数

#### 布尔类型

一个字节大小，符号是 bool，true or false

#### 字符类型

char 类型用来描述语言中最基础的单个字符。

字符类型的字面值使用单引号

占用 4 字节大小

是 Unicode 标量值，可以表示比 ASCII 多得多的字符内容：拼音、中日韩文、零长度空白字符、emoji 表情等，长度是

- U+0000 到 U+D7FF
- U+E000 到 U+10FFFF

```rust
fn main() {
  let x = 'z';
  let y: char = 'Z';
  let z = '😂';
}
```

### 复合类型

Rust 提供了两种基础的复合类型：元组（Tuple）和数组

#### 元组

- Tuple 可以将多个类型的多个值放在一个类型里
- Tuple 长度固定，一旦声明就无法改变
- 声明元组时，在小括号里，各值用逗号分开
- tuple 变量使用点标记法，后接元素索引号

```rust
fn main() {
  let tup: (i32, f64, u8) = (500, 6.4, 1);

  println!("{}, {}, {}, ", tup.0, tup.1, tup.2);
}
```

可以使用模式匹配来解构（destructure）一个 tuple 来获取元素的值

```rust
fn main() {
  let tup: (i32, f64, u8) = (500, 6.4, 1);

  let (x, y, z) = tu;

  println!("{}, {}, {}, ", x, y, z);
}
```

#### 数组

- 数组可以将多个值放在一个类型里
- 数组中每个元素的类型必须相同
- 数组长度固定
- 声明数组时，在中括号里，各值用逗号分开

```rust
fn main() {
  let a = [1, 2, 3, 4, 5];
}
```

##### 数组的用处

如果想让你的数据存放在 stack（栈）上而不是 heap（堆）上，或者想保证有固定数量的元素，应使用数组

但是，数组没有 Vector 灵活

- Vector 和数组类似，它由标准库提供
- Vector 的长度可以改变
- 如果你不确定应该用数组还是 Vector，那么你应该使用 Vector

##### 数组类型声明

数组类型以这种形式表示：`[类型； 长度]`

`let a: [i32; 5] = [1, 2, 3, 4, 5];`

如果数组中每个元素都相同，那么可以这样简写：

`let a = [3; 5];`

它相当于

`let a = [3, 3, 3, 3, 3];`

##### 元素访问

数组是 Stack 上分配的单个块内存

可以使用索引`arr[0]`来访问数组元素

如果访问索引超出数组范围，即下标越界，那么

- 编译时会报错
- 运行时会报错（runtime 时会 panic），Rust 不会允许其继续访问相应地址的内存

#### String

- String 比那些基础标量数据类型更复杂
- 字符串字面值：程序里手写的那些字符串值，它们是不可变的
- Rust还有第二种字符串类型：String
  - 在heap上分配，能够存储在编译时位置数量的复合文本类型

创建方法：

1. 使用from函数

`let s = String::from("hello");`

这类字符串是可以被修改的，是真正的String类型

2. 直接输入字面值

`let s = "hello";`

这类字符串是不可被修改的，也称为`&str`字符串切片类型

**原因**

- 字符串字面值，在编译时就知道它的内容了，其文本内容会被直接硬编码到最终的可执行文件里。
  - 特点：不可变性，速度快、高效。
  - 通常存储在编译时分配的静态存储区域，也称为常量区或静态区。这个区域通常位于程序的可执行文件中，并在程序加载时被加载到内存中。
- String类型，为了支持可变性，需要在heap上分配内存来保存编译时未知的文本内容：
  - 操作系统必须在运行时请求内存，这步通过调用`String::from`来实现


## 函数

- 声明函数使用 fn 关键字
- 依照惯例，针对函数和变量名，Rust 使用 snake case 命名规范：所有字母小写，单词之间使用下划分分开

### 函数参数

函数签名里，必须声明每个参数的类型

```rust
fn main() {
  another_function(5); // argument 实参
}

fn another_function(x: i32) { // parameter 形参
  println!("The value of x is {}", x);
}
```

### 语句与表达式

- 函数体由一系列语句组成，可选的由一个表达式结束
- Rust 是基于表达式的语言
- 语句是执行一些动作的指令
- 表达式会计算产生一个值
- 函数的定义也是语句
- 语句的返回值是空元组类型，也就是`()`

```rust
fn main() {
  let x = 5;

  let y = {
    let x = 1;
    x + 3 // 注意这一行是表达式，返回值是4，不能加分号；如果加了分号就变成了语句，返回()
  };

  println!("The value of y is {}", y);
}
```

### 函数返回值

- 在`->`符号后边声明函数返回值的类型，但是不可以为返回值命名
- 在 Rust 里面，返回值就是函数体里面最后一个表达式的值
- 若想提前返回，需使用 return 关键字，并指定一个值
- 大多数函数都默认使用最后一个表达式作为返回值

```rust
fn five() -> i32 {
  5
}

fn main() {
  let x = five();

  println!("The value of x is {}", x);
}
```

## 控制流

### if

if 语句允许您根据条件来执行不同的代码分支

- 这个条件必须是 bool 类型
- 与条件相关联的代码块叫做分支（arm）
- 同样支持 else 语句

### let+if

因为 if 是一个表达式，所以可以将它放在 let 语句中等号的右边（替换三元运算符）

```rust
fn main() {
  let condition = true;

  let number = if condition { 5 } else { 6 };

  println!("The value of number is {}", number);
}
```

### loop 循环

loop 关键字将反复执行一块代码，直到停止（break）

```rust
fn main() {
  let mut count = 0;

  let result = loop {
    count += 1;

    if count == 10 {
      // break跟返回值，result等于20
      break count * 2;
    }
  };

  println!("The result is {}", result);
}
```

### while 循环

另外一种常见的循环模式是每次执行循环体之前都判断一次条件

```rust
fn main() {
  let mut number = 3;

  while number != 0 {
    println!("{}!", number);

    number -= 1;
  }

  println!("LIFTOFF!!!");
}
```

### for 循环

- 使用 while 或 loop 来遍历集合，易错且低效
- 使用 for 更简洁紧凑，它可以针对集合中每个元素来执行一些代码
- 由于 for 循环的安全、简洁性，它在 Rust 里使用最多

```rust
fn main() {
  let a = [10, 20, 30, 40, 50];
  for element in a.iter() {
    println!("the value is {}", element);
  }
}
```

### Range

- 标准库提供
- 指定一个开始数字和一个结束数字，Range 可以生成它们之间的数字（不含结束）
- rev 方法可以反转 Range

```rust
fn main() {
  // 左闭右开
  for number in (1..4).rev() {
    println!("{}!", number);
  }
}
```
