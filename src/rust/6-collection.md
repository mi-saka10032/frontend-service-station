---
title: 集合
order: 6

tag:
  - Vector
  - String
  - HashMap
---

## `Vector`

Vector，写作：`Vec<T>`

- 由标准库提供
- 可存储多个值
- 只能存储相同类型的数据
- 值在内存中连续存放
- 长度可变，这一点与数组不同

### `创建Vector`

使用`Vec::new`函数或者`vec!`宏创建（类型可智能推断）

```rust
fn main() {
  let v1: Vec<i32> = Vec::new();
  // 使用宏
  let v2 = vec![1, 2, 3];
}
```

### `读取Vector`

两种方式均可引用 Vector 里面的值：1、索引；2、get 方法

注意：

**处理访问越界的情况时：索引会报错 panic，而 get 会返回 None**

```rust
fn main() {
  let v = vec![1, 2, 3, 4, 5];
  let third: &i32 = &v[2];
  println!("The third element is {}", third);

  match v.get(2) {
    Some(third) => println1("The third element is {}", third),
    None => println!("There is no third element"),
  }
}
```

### `更新Vector`

```rust
fn main() {
  let mut v = Vec::new();
  // 支持上下文类型推断
  v.push(1); // Vec<i32>
  v.push(2);
}
```

### `删除Vector`

与任何其他 struct 一样，当 Vector 离开作用域后

- 它会被立刻清理掉
- 同时它的所有元素也会被清理掉

### `Vector所有权规则`

- 不能在同一作用域内同时拥有可变和不可变引用

```rust
fn main() {
  let mut v = vec![1, 2, 3, 4, 5];
  let first = &v[0];
  // 会报错 error[E0502]: cannot borrow `v` as mutable because it is also borrowed as immutable
  v.push(6);
  println!("The first element is {}", first);
}
```

### `遍历Vector`

```rust
fn main() {
  let v = vec![100, 32, 57];
  for i in &v {
    println!("{}", i);
  }
}
```

tips：如果需要修改 i 的值，需要解引用

```rust
fn main() {
  let mut v = vec![100, 32, 57];
  for i in &mut v {
    *i += 50;
  }
}
```

### `配合enum存储多种数据类型`

```rust
enum SpreadSheetCell {
  Int(i32),
  Float(f64),
  Text(String),
}

fn main() {
  let row = vec![
    SpreadSheetCell:Int(3),
    SpreadSheetCell:Text(String::from("blue")),
    SpreadSheetCell:Int(Float(10.12)),
  ]
}
```

## `String`

Rust 开发者经常会被字符串困扰的原因：

- Rust 倾向于暴露可能的错误
- 字符串数据结构复杂
- UTF-8

**注意：在 Rust 中字符串类型和 String 类型是有区别的**

### `&str类型`

- Byte 的集合
- 其中一些方法，能将 byte 解析为文本
- **Rust 的核心语言层面，只有一个字符串类型：字符串切片 str（或者说&str）**

字符串切片：对存储在其他地方、UTF-8 编码的字符串的引用

字符串字面值：存储在二进制文件中，也是字符串切片

### `String类型`

- 来自标准库而不是核心语言
- 可增长、可修改、可拥有
- UTF-8 编码

**我们通常所说的字符串指的是 String 和&str**

### 其它类型的字符串

Rust 标准库还包含了很多其它的字符串类型，例如：OsString、OsStr、CString、CStr

- String vs Str 后缀：拥有或借用的变体
- 可存储不同编码的文本或在内存中以不同的形式展现

Library crate 针对存储字符串可提供更多的选项

### `创建String`

很多`Vec<T>`的操作都可用于 String

这里再次复述初始值创建 String 的方法：

`to_string()`：用于实现了 Display trait 的类型，包括字符串字面值

`String::from()`，从字面值创建 String

```rust
fn main() {
  let data = "initial contents";
  let s = data.to_string();

  let s1 = "initial contents".to_string();
}
```

### `访问String`

按索引语法访问 String 的某部分，会报错

Rust 字符串不支持索引语法访问

内部实现：

**String 是对`Vec<u8>`的包装**

Rust 对字符串的包装，有三种看待字符串的方式：

1. 字节
2. 标量值
3. 字形簇（最接近所谓的字母）

Rust 不允许对 String 进行索引的最后一个原因：

- 索引操作应消耗一个常量时间（O(1)）
- 而 String 无法保证：需要遍历所有内容，来确定有多少个合法的字符

### `更新String`

`push_str()`：把一个字符串切片附加到 String

```rust
fn main() {
  let mut s = String::from("foo");
  let s1 = String::from("bar");
  // &String 自动转为 字符串切片 &str
  s.push_str(&s1);

  println!("{}", s1);
  println!("{}", s);
}
```

`push()`：把单个字符附加到 String

```rust
fn main() {
  let mut s = String::from("lo");
  s.push('l');
}
```

`+`：连接字符串

要求+左边是 String 类型，右边是&str 类型

使用了类似这个签名的方法：`fn add(&self, s: &str) -> String { ... }`

- 标准库中的 add 方法使用了泛型
- 只能把&str 添加到 String
- 解引用强制转换(deref coercion)

```rust
fn main() {
  let s1 = String::from("Hello, ");
  let s2 = String::from("World!");

  let s3 = s1 + &s2;

  println("{}", s3);
  // 这里s1已经销毁了，所有权转让给s3
  println("{}", s1);
  println("{}", s2);
}
```

`format!`：连接多个字符串

- 和`println!()`类似，但会返回字符串
- 不会取得原 String 的所有权

```rust
fn main() {
  let s1 = String::from("tic");
  let s2 = String::from("tac");
  let s3 = String::from("toe");

  let s = format!("{}-{}-{}", s1, s2, s3);
  println!("{}", s);
  println!("{}", s1);
  println!("{}", s2);
  println!("{}", s3);
}
```

### `切割String`

可以使用`[]`和`一个范围`来创建字符串的切片

- 必须谨慎使用
- 如果切割时跨越了字符边界，程序就会 panic
- `(b1, b2)(b3, b4)(b5, b6)(b7, b8)`：如果只切割了 b1-b3，没有完整切割字符，同样会崩溃

```rust
fn main() {
    let str = "你好，世界！";

    let s = &str[0..2];

    println!("{}", s);
}
// thread 'main' panicked at test.rs:4:17:
// byte index 2 is not a char boundary; it is inside '你' (bytes 0..3) of `你好，世界！`
// note: run with `RUST_BACKTRACE=1` environment variable to display a backtrace
```

### `遍历String`

- 对于标量值：`chars()`
- 对于字节：`bytes()`
- 对于字形簇：很复杂，标准库未提供

### `String并不简单`

Rust 选择将正确处理 String 数据作为所有 Rust 程序的默认行为

程序员必须在处理 UTF-8 数据之前投入更多精力

这可以防止在开发后期处理涉及非 ASCII 字符的错误

## `HashMap<K,V>`

键值对的形式存储数据，一个键（Key）对应一个值（Value）

Hash 函数：决定如何在内存中存放 K 和 V

适用场景：通过 K（任何类型）来寻找数据，而不是通过索引

提示：

- HashMap 用的较少，不在 Prelude 中
- 标准库对其支持较少，没有内置的宏来创建 HashMap
- 数据存储在 heap 上
- HashMap 是同构的，一个 HashMap 中，所有的 K 必须是同一种类型

### `创建HashMap`

第一种是 new 方法

`HashMap::new()`

添加数据：insert 方法

```rust
use std::collections::HashMap;

fn main() {
  let mut scores: HashMap<String, i32> = HashMap::new();

  scores.insert(String::from("Blue"), 10);
  scores.insert(String::from("Yellow"), 50);
}
```

另一种是 collect 方法

在元素类型为 Tuple 的 Vector 上使用 collect 方法，可以组建一个 HashMap

- 要求 Tuple 有两个值，一个作为 K，一个作为 V
- collect 方法可以把数据整合成多种集合类型，包括 HashMap
- 返回值需要显式指明类型

```rust
use std::collections::HashMap;

fn main() {
  let teams = vec![String::from("Blue"), String::from("Yellow")];
  let initial_scores = vec![10, 50];

  // zip接受一个参数，将调用者的元素与参数中的元素一一对应组成tuple，若数量不匹配，多的元素会丢掉
  // collect方法形成了一个HashMap，元素的顺序并不固定
  // key -> value的顺序是由zip一一对应的，不是由collect决定的
  let scores: HashMap<_, _> =
      teams.iter().zip(initial_scores.iter()).collect();
}
```

### `访问HashMap`

get 方法：

- 参数：K
- 返回：`Option<&V>`

```rust
use std::collections::HashMap;

fn main() {
  let mut scores: HashMap<String, i32> = HashMap::new();

  scores.insert(String::from("Blue"), 10);
  scores.insert(String::from("Yellow"), 50);

  let team_name = String::from("Blue");
  let score = scores.get(&team_name);

  match score {
    Some(s) => println!("{}", s),
    None => println!("team not exist"),
  }
}
```

### `更新HashMap`

- HashMap 大小可变
- 每个 K 同时只能对应一个 V

更新规则：

- K 已经存在，对应一个 V

有以下选择：

1. 替换现有的 V
2. 保留现有的 V，忽略新的 V
3. 合并现有的 V 和新的 V

#### 替换

如果向 HashMap 插入一对 KV，然后再插入同样的 K，但是不同的 V，那么原来的 V 会被替换掉

```rust
use std::collections::HashMap;

fn main() {
  let mut scores: HashMap<String, i32> = HashMap::new();

  scores.insert(String::from("Blue"), 10);
  scores.insert(String::from("Blue"), 25);

  println!("{:?}", scores);
}
```

只有在 K 不对应任何值的情况下，才插入 V

rust 提供 entry 方法：检查指定的 K 是否对应一个 V

- 参数为 K
- 返回 enum Entry：代表值是否存在
- Entry 的`or_insert()`方法返回：
  - 如果 K 存在，返回到对应的 V 的一个可变引用
  - 如果 K 不存在，将方法参数作为 K 的新值插进去，返回到这个值的可变引用

```rust
use std::collections::HashMap;

fn main() {
  let mut scores: HashMap<String, i32> = HashMap::new();

  scores.insert(String::from("Blue"), 10);

  let e = scores.entry(String::from("Yellow"));
  println!("{:?}", e);
  e.or_insert(50);  // 执行insert
  scores.entry(String::from("Blue")).or_insert(50); // 不执行insert

  println!("{:?}", scores);
}
```

可变引用解引用的写法 demo

```rust
use std::collections::HashMap;

fn main() {
  let text = "hello world wonderful world";

  let mut map = HashMap::new();

  for word in text.split_whitespace() {
    let count = map.entry(word).or_insert(0);
    // 此处必须解引用才能修改HashMap上V的值
    *count += 1; // 等同于 *count = &*count + 1;
  }

  println!("{:?}", map);
}
```

- K 不存在

添加一对新的 K,V

### `遍历HashMap`

for 循环

```rust
use std::collections::HashMap;

fn main() {
  let mut scores: HashMap<String, i32> = HashMap::new();

  scores.insert(String::from("Blue"), 10);
  scores.insert(String::from("Yellow"), 50);

  for (k, v) in &scores {
    println!("{}:{}", k, v);
  }
}
```

### `HashMap所有权`

- 对于实现了 Copy trait 的类型（i32），值会被复制到 HashMap 中
- 对于拥有所有权的值（String），值会被移动，所有权会转移给 HashMap
- 如果将值的引用插入到 HashMap，值本身不会移动
- 在 HashMap 有效的期间，被引用的值必须保持有效

```rust
use std::collections::HashMap;

fn main() {
  let field_name = String::from("Favorite color");
  let field_value = String::from("Blue");

  let mut map = HashMap::new();
  map.insert(&field_name, &field_value);

  println!("{}:{}", field_name, field_value);
}
```

### `Hash函数`

默认情况下，HashMap 使用加密功能强大的 Hash 函数，可以抵抗拒绝服务（DoS）攻击

- 不是可用的最快的 Hash 算法
- 但具有更好的安全性
- 可以指定不同的 hasher 来切换到另一个函数
- hasher 是实现 BuildHasher trait 的类型
