---
title: 项目1：命令行程序
order: 10
---

项目功能：制作一个简单版本的 grep 工具，实现指定字符串和文件名称，对文件全文每一行进行模糊匹配检测并输出包含字符串内容的文本行

```shell
cargo run xxxx xxxx.txt
```

## 接收命令行参数

```rust
use std::env;

fn main() {
  // 获取命令行输入参数的集合，空格符进行分隔
  let args: Vec<String> = env::args().collect();

  println!("{:?}", args);

  let query_dir = &args[1];
  let filename = &args[2];
}
```

```shell
cargo run 1234 abcd
# 输出
["target/debug/minigrep", "1234", "abcd"]
```

## 读取文件

```rust
use std::env;
use std::fs;

fn main() {
  // 获取命令行输入参数的集合，空格符进行分隔
  let args: Vec<String> = env::args().collect();

  let query_dir = &args[1];
  let filename = &args[2];

  let contents = fs::read_to_string(filename)
  .expect("Something went wrong reading the file");

  println!("With text:\n{}", contents);
}
```

## 重构：改进模块和错误处理

二进制程序关注点分离的指导性原则：

- 将程序拆分为 main.rs 和 lib.rs，将业务逻辑放入 lib.rs
- 当命令行解析逻辑较少时，将它放在 main.rs 也行
- 当命令行解析逻辑变复杂时，需要将它从 main.rs 提取到 lib.rs

经过上述拆分，留在 main 的功能有：

1. 使用参数值调用命令行解析逻辑
2. 进行其它配置
3. 调用 lib.rs 中的 run 函数
4. 处理 run 函数可能出现的错误

### 改善模块化

```rust
use std::env;
use std::fs;

fn main() {
  // 获取命令行输入参数的集合，空格符进行分隔
  let args: Vec<String> = env::args().collect();

  let config = Config::new(&args);

  let contents = fs::read_to_string(config.filename)
  .expect("Something went wrong reading the file");

  println!("With text:\n{}", contents);
}

struct Config {
  query: String,
  filename: String,
}

impl Config {
  fn new(args: &[String]) -> Config {
    let query = args[1].clone();
    let filename = args[2].clone();

    Config { query, filename }
  }
}
```

### 错误处理

如果命令行参数长度小于 3，需要执行错误处理

```rust
use std::env;
use std::fs;
use std::process;

fn main() {
    // 获取命令行输入参数的集合，空格符进行分隔
    let args: Vec<String> = env::args().collect();
    let config = Config::new(&args).unwrap_or_else(|err| {
        println!("Problem parsing arguments: {}", err);
        process::exit(0);
    });

    let contents =
        fs::read_to_string(config.filename).expect("Something went wrong reading the file");

    println!("With text:\n{}", contents);
}

struct Config {
    query: String,
    filename: String,
}

impl Config {
    fn new(args: &[String]) -> Result<Config, &'static str> {
        if args.len() < 3 {
            return Err("not enough arguments");
        }
        let query = args[1].clone();
        let filename = args[2].clone();
        Ok(Config { query, filename })
    }
}
```

### 业务逻辑迁移

将 run 和 Config 相关逻辑全部迁移到 lib.rs，main.rs 仅保留逻辑执行和错误处理

```rust
// src/lib.rs
use std::error::Error;
use std::fs;

pub struct Config {
    query: String,
    filename: String,
}

impl Config {
    pub fn new(args: &[String]) -> Result<Config, &'static str> {
        if args.len() < 3 {
            return Err("not enough arguments");
        }
        let query = args[1].clone();
        let filename = args[2].clone();
        Ok(Config { query, filename })
    }

    pub fn run(&self) -> Result<(), Box<dyn Error>> {
        let contents = fs::read_to_string(&self.filename)?;
        println!("With text:\n{}", contents);
        Ok(())
    }
}
```

```rust
// src/main.rs
use std::env;
use std::process;

use miniregp::Config;

fn main() {
    // 获取命令行输入参数的集合，空格符进行分隔
    let args: Vec<String> = env::args().collect();
    // unwrap_or_else 闭包err信息
    let config = Config::new(&args).unwrap_or_else(|err| {
        println!("Problem parsing arguments: {}", err);
        process::exit(0);
    });
    // run函数成功的结果是() 因此只需要关注错误信息即可
    if let Err(e) = config.run() {
        println!("Application error: {}", e);
        process::exit(0);
    }
}
```

## 使用`TDD`开发库功能

测试驱动开发 TDD（Test-Driven Development）

1. 编写一个会失败的测试，运行该测试，确保它是按照预期的原因失败
2. 编写或修改刚好足够的代码，让新测试通过
3. 重构刚刚添加或修改的代码，确保测试会始终通过
4. 返回步骤 1，继续

```rust
// src/lib.rs
use std::error::Error;
use std::fs;

pub struct Config {
    query: String,
    filename: String,
}

impl Config {
    pub fn new(args: &[String]) -> Result<Config, &'static str> {
        if args.len() < 3 {
            return Err("not enough arguments");
        }
        let query = args[1].clone();
        let filename = args[2].clone();
        Ok(Config { query, filename })
    }

    pub fn run(&self) -> Result<(), Box<dyn Error>> {
        let contents = fs::read_to_string(&self.filename)?;
        let results = search(&self.query, &contents);
        for line in results {
          println!("{}", line);
        }
        Ok(())
    }
}

pub fn search<'a>(query: &str, contents: &'a str) -> Vec<&'a str> {
    let mut results = Vec::new();
    for line in contents.lines() {
        if line.contains(query) {
            results.push(line);
        }
    }
    results
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn one_result() {
        let query = "duct";
        let contents = "\
Rust:
safe, fast, productive.";

        assert_eq!(vec!["safe, fast, productive."], search(query, contents));
    }
}
```

## 使用环境变量

通过环境变量 CASE_INSENSITIVE 来判断是否支持大小写匹配

```rust
// src/lib.rs
use std::error::Error;
use std::{env, fs};

pub struct Config {
    query: String,
    filename: String,
    case_sensitive: bool,
}

impl Config {
    pub fn new(args: &[String]) -> Result<Config, &'static str> {
        if args.len() < 3 {
            return Err("not enough arguments");
        }
        let query = args[1].clone();
        let filename = args[2].clone();
        // 注入env 出现err表示变量未出现：true；未出现err表示变量已存在：false
        let case_sensitive = env::var("CASE_INSENSITIVE").is_err();
        Ok(Config { query, filename, case_sensitive })
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
        let mut results = Vec::new();
        for line in contents.lines() {
            if line.contains(query) {
                results.push(line);
            }
        }
        results
    }

    pub fn search_case_insensitive<'a>(query: &str, contents: &'a str) -> Vec<&'a str> {
      let mut results = Vec::new();
      let query = query.to_lowercase();
      for line in contents.lines() {
          if line.to_lowercase().contains(&query) {
              results.push(line);
          }
      }
      results
  }
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn case_sensitive() {
        let query = "duct";
        let contents = "\
Rust:
safe, fast, productive.";

        assert_eq!(
            vec!["safe, fast, productive."],
            Config::search(query, contents)
        );
    }

    #[test]
    fn case_insensitive() {
        let query = "rUsT";
        let contents = "\
Rust:
safe, fast, productive.
Trust me.";

        assert_eq!(
            vec!["Rust:", "Trust me."],
            Config::search_case_insensitive(query, contents)
        );
    }
}
```

现在项目根目录下有 poem.txt 文件如下：

```txt
Hello Rust!
Hello Java!
Hello JavaScript!
Hello Python!
```

使用忽略大小写模糊匹配寻找含 java 的行，注意不同操作系统环境变量的设置有所不同

Mac:

```bash
CASE_INSENSITIVE=1 cargo run java poem.txt
```

Windows CMD

```shell
set CASE_INSENSITIVE=1 | cargo run java poem.txt
```

Windows PowerShell

```shell
$env:CASE_INSENSITIVE=1; cargo run java poem.txt
```

## 将错误消息写入标准错误而不是标准输出

标准输出：`stdout::println!`

标准错误：`stderr::eprintln!`

`cargo run > output.txt`：将标准输出信息打印到根目录下的 output.txt 文件

我们希望：

- 标准输出打印到文件中作为日志信息
- 标准错误不打印到文件中

调整main.rs

```rust
use std::env;
use std::process;

use miniregp::Config;

fn main() {
    // 获取命令行输入参数的集合，空格符进行分隔
    let args: Vec<String> = env::args().collect();
    // unwrap_or_else 闭包err信息
    let config = Config::new(&args).unwrap_or_else(|err| {
        eprintln!("Problem parsing arguments: {}", err);
        process::exit(0);
    });
    // run函数成功的结果是() 因此只需要关注错误信息即可
    if let Err(e) = config.run() {
        eprintln!("Application error: {}", e);
        process::exit(0);
    }
}
```