---
title: MySQL
order: 9

tag:
  - 数据库
  - SQL
  - Mysql
  - ORM
---

该章节仅对 SQL 和 Mysql 做简单介绍

## 常见数据库

通常我们将数据划分成两类：关系型数据库和非关系型数据库

1. 关系型数据库：MySQL、Oracle、DB2、SQL Server、Postgre SQL 等

- 关系型数据库通常我们会创建很多个二维数据表
- 数据表之间相互关联起来，形成一对一、一对多、多对多等关系

- 之后可以利用 SQL 语句在多张表中查询我们所需的数据

- 支持事务，对数据的访问更加的安全

2. 非关系型数据库：MongoDB、Redis、Memcached、HBse 等

- 非关系型数据库的英文其实是 Not only SQL，也简称为 NoSQL

- 非关系型数据库比较简单一些，存储数据也会更加自由（甚至我们可以直接将一个复杂的 json 对象直接塞入到数据库中）

- NoSQL 是基于 Key-Value 的对应关系，并且查询的过程中不需要经过 SQL 解析，所以性能更高

- NoSQL 通常不支持事物，需要在自己的程序中来保证一些原子性的操作

如何在开发中选择他们呢？具体的选择会根据不同的项目进行综合的分析

- 目前在公司进行后端开发（Node、Java、Go 等），还是以关系型数据库为主

- 比较常用的用到非关系型数据库的，在爬取大量的数据进行存储时，会比较常见

## MySQL 介绍

MySQL 是一个关系型数据库，其实本质上就是一款软件、一个程序

- 这个程序中管理着多个数据库
- 每个数据库中可以有多张表

- 每个表中可以有多条数据

![MySQL介绍](https://misaka10032.oss-cn-chengdu.aliyuncs.com/Node/12-mysql/image-20211015161353155.png)

### 终端链接

两种方式的区别在于输入密码是直接输入，还是另起一行以密文形式输入

```shell
mysql -u root -p why888
```

```shell
mysql -u root
Enter password: your password
```

### 显示数据库

MylSQL 默认的数据库：

infomation_schema：信息数据库，其中包括 MySQL 在维护的其他数据库、表、列、访问权限等信息；

performance_schema：性能数据库，记录着 MySQL Server 数据库引擎在运行过程中的一些资源消耗相关的信息；

mysql：用于存储数据库管理者的用户信息、权限信息以及一些日志信息等；

sys：相当于是一个简易版的 performance_schema，将性能数据库中的数据汇总成更容易理解的形式。

### 创建数据库-表

```sql
create database test;

use test;

create table user(
  name varchar(20),
  age int,
  height double
);

insert into user (name, age, height) values ('why', 18, 1.88);
insert into user (name, age, height) values ('kobe', 40, 1.98);
```

## SQL 语句

SQL 是 Structured Query Language，称之为结构化查询语言，简称 SQL。

规范：

通常关键字是大写的，比如 CREATE、TABLE、SHOW 等等；

一条语句结束后，需要以 ; 结尾；

如果遇到关键字作为表明或者字段名称，可以使用\`\`包裹。

### DDL

DDL：（Data Definition Language）：数据定义语言

通过 DDL 语句对数据库或者表进行：创建、删除、修改等操作

#### 创建新的数据库

```sql
CREATE DATABASE bilibili;
CREATE DATABASE IF NOT EXISTS bilibili;
CREATE DATABASE IF NOT EXISTS bilibili
DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci;
```

#### 删除数据库

```sql
DROP DATABASE bilibili;
DROP DATABASE IF EXIT bilibili;
```

#### 修改数据库

```sql
# 修改数据库的字符集和排序规则
ALTER DATABASE bilibili CHARACTER SET = utf8 COLLATE = utf8_unicode_ci;
```

### DML

DML：（Data Manipulation Language）：数据操作语言

通过 DML 语句对表进行：添加、删除、修改等操作

#### 创建数据表

```sql
CREATE TABLE IF NOT EXISTS `users`(
	name VARCHAR(20),
	age INT,
	height DOUBLE
);
```

### DQL

DQL：（Data Query Language）：数据查询语言

通过 DQL 从数据库中查询记录（重点）

#### 查看当前数据库

```sql
SHOW DATABASES;
```

#### 使用某一个数据库

```sql
USE coderhub;
```

#### 查看当前正在使用的数据库

```sql
SELECT DATABASE();
```

#### 查看数据表

```sql
# 查看所有的数据表
SHOW TABLES;
# 查看某一个表结构
DESC user;
```

### DCL

DCL：（Data Control Language）：数据控制语言

对数据库、表格的权限进行相关访问控制操作

## SQL 数据类型

MySQL 支持的数据类型有：数字类型，日期和时间类型，字符串（字符和字节）类型，空间类型和 JSON 数据类型。

### 数字类型

整数数字类型：INTEGER，INT，SMALLINT，TINYINT，MEDIUMINT，BIGINT；

![MySQL数字类型](https://misaka10032.oss-cn-chengdu.aliyuncs.com/Node/12-mysql/image-20211016172050663.png)

浮点数字类型：FLOAT，DOUBLE（FLOAT 是 4 个字节，DOUBLE 是 8 个字节）；

精确数字类型：DECIMAL，NUMERIC（DECIMAL 是 NUMERIC 的实现形式）

### 日期类型

YEAR 以 YYYY 格式显示值，范围 1901 到 2155，和 0000

DATE 类型用于具有日期部分但没有时间部分的值，DATE 以格式 YYYY-MM-DD 显示值，支持的范围是 '1000-01-01' 到 '9999-12-31'

DATETIME 类型用于包含日期和时间部分的值，DATETIME 以格式'YYYY-MM-DD hh:mm:ss'显示值，支持的范围是 1000-01-01 00:00:00 到 9999-12-31 23:59:59

TIMESTAMP 数据类型被用于同时包含日期和时间部分的值，TIMESTAMP 以格式'YYYY-MM-DD hh:mm:ss'显示值，但是它的范围是 UTC 的时间范围：'1970-01-01 00:00:01'到'2038-01-19 03:14:07'

DATETIME 或 TIMESTAMP 值可以包括在高达微秒（6 位）精度的后小数秒一部分，DATETIME 表示的范围可以是'1000-01-01 00:00:00.000000'到'9999-12-31 23:59:59.999999'。

### 字符串类型

CHAR 是定长的，长度不可变，申请的内存大小就是我们指定的大小。在被查询时，会删除后面的空格

VARCHAR 类型的值是可变长度的字符串，长度可以指定为 0 到 65535 之间的值。在被查询时，不会删除后面的空格

BINARY 和 VARBINARY 类型用于存储二进制字符串，存储的是字节字符串。

BLOB 存储大的二进制类型

TEXT 存储大的字符串类型。

## 表约束（重要）

### 主键

一张表中，我们为了区分每一条记录的唯一性，必须有一个字段是永远不会重复，并且不会为空的，这个字段我们通常会将它设置为主键(primary key)

- 主键是表中唯一的索引

- 并且必须是 NOT NULL 的，如果没有设置 NOT NULL，那么 MySQL 也会隐式的设置为 NOT NULL

- 主键也可以是多列索引，PRIMARY KEY(key_part, ...)，我们一般称之为联合主键

- 建议：开发中主键字段应该是和业务无关的，尽量不要使用业务字段来作为主键

某些字段在开发中我们希望是唯一的，不会重复的，比如手机号码、身份证号码等，这个字段我们可以使 UNIQUE 来约束

使用 UNIQUE 约束的字段在表中必须是不同的

对于所有引擎，UNIQUE 索引允许 NULL 包含的列具有多个值 NUL

NOT NULL：某些字段我们要求用户必须插入值，不可以为空，这个时候我们可以使用 NOT NULL 来约束

DEFAULT：某些字段我们希望在没有设置值时给予一个默认值，这个时候我们可以使用 DEFAULT 来完成

AUTO_INCREMENT：某些字段我们希望不设置值时可以进行递增，比如用户的 id，这个时候可以使用 AUTO_INCREMENT 来完成

### DDL

#### 根据一个表结构创建另一张表

```sql
CREATE TABLE `user1` LIKE `user`;
```

#### 根据另一个表中的所有内容，创建一个新的表

```sql
CREATE TABLE `user3` (SELECT * FROM `user`);
```

### DML

#### 修改表的名字

```sql
ALTER TABLE `USERS` RENAME TO `USER`;
```

#### 添加一个新的列

```sql
ALTER TABLE `moment` ADD `publishTime` DATETIME;
ALTER TABLE `moment` ADD `updateTime` DATETIME;
```

#### 删除一列数据

```sql
ALTER TABLE `moment` DROP `updateTime`;
```

#### 修改列的名称

```sql
ALTER TABLE `moment` CHANGE `publishTime` `publishDate` DATE;
```

#### 修改列的数据类型

```sql
ALTER TABLE `moment` MODIFY `id` INT;
```

#### 插入新数据

```sql
INSERT INTO `products` (`title`, `description`, `price`, `publishTime`)
VALUES ('iPhone', 'iPhone12只要998', 998.88, '2020-10-10');
```

#### 删除数据

```sql
# 会删除表中所有的数据
DELETE FROM `products`;
# 会删除符合条件的数据
DELETE FROM `products` WHERE `title` = 'iPhone';
```

#### 修改完数据显示最新更新时间

```sql
ALTER TABLE `products` ADD `updateTime` TIMESTAMP
					DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP;
```

#### 修改表中所有的数据

```sql
UPDATE `products`  SET `title` = 'iPhone12', `price` = 1299.88;
```

#### 修改符合条件的数据

```sql
UPDATE `products`  SET `title` = 'iPhone12', `price` = 1299.88 WHERE `title` = 'iPhone';
```

### DQL

SELECT 用于从一个或者多个表中检索选中的行（Record）

查询的格式如下：

```sql
SELECT select_expr [, select_expr]...
		[FROM table_references]
		[WHERE where_condition]
		[ORDER BY expr [ASC | DESC]]
		[LIMIT {[offset,] row_count | row_count OFFSET offset}]
		[GROUP BY expr]
		[HAVING where_condition]
```

#### 基本查询

查询所有的数据并且显示所有的字段

```sql
SELECT * FROM `products`;
```

查询 title、brand、price

```sql
SELECT title, brand, price FROM `products`;
```

给字段起别名，别名一般在多张表或者给客户端返回对应的 key 时会使用到

```sql
SELECT title as t, brand as b, price as p FROM `products`
```

#### 比较运算符、逻辑运算符、between、in

```sql
# 查询品牌是华为，并且小于2000元的手机
SELECT * FROM `products` WHERE `brand` = '华为' and `price` < 2000;
SELECT * FROM `products` WHERE `brand` = ' 华为' && `price` < 2000;

# 查询1000到2000的手机（不含1000和2000）
SELECT * FROM `products` WHERE price > 1000 and price < 2000;

# OR：符合一个条件即可
# 查询所有的华为手机或者价格小于1000的手机
SELECT * FROM `products` WHERE brand = '华为' or price < 1000;

# 查询1000到2000的手机（包含1000和2000）
SELECT * FROM `products` WHERE price BETWEEN 1000 and 2000;

# 查看多个结果中的一个
SELECT * FROM `products` WHERE brand in ('华为', '小米');
```

#### like 关键字实现模糊查询，结合两个特殊符号

%表示匹配任意个的任意字符

\_表示匹配一个的任意字符

```sql
# 查询所有以v开头的title
SELECT * FROM `products` WHERE title LIKE 'v%';

# 查询带M的title
SELECT * FROM `products` WHERE  title LIKE '%M%';

# 查询带M的title必须是第三个字符
SELECT * FROM `products` WHERE title LIKE '__M%';
```

#### 结果排序

ORDER BY 有两个常用的值：ASC：升序排列；DESC：降序排列。

```sql
SELECT * FROM `products` WHERE brand = '华为' or price < 1000 ORDER BY price ASC;
```

#### 分页查询

它的用法有[LIMIT {[offset,] row_count | row_count OFFSET offset}]

```sql
SELECT * FROM `products` LIMIT 30 OFFSET 0;
SELECT * FROM `products` LIMIT 30 OFFSET 30;
SELECT * FROM `products` LIMIT 30 OFFSET 60;
# 另外一种写法：offset, row_count
SELECT * FROM `products` LIMIT 90, 30;
```

#### 聚合函数

聚合函数表示对值集合进行操作的组（集合）函数

常用函数：SUM MAX MIN AVG COUNT COUNT(DISTINCT)

#### Group By

```sql
SELECT brand,
		COUNT(*) as count,
		ROUND(AVG(price),2) as avgPrice,
		MAX(price) as maxPrice,
		MIN(price) as minPrice,
		AVG(score) as avgScore
FROM `products` GROUP BY brand;
```

**约束**

希望给 Group By 查询到的结果添加一些约束，那么我们可以使用：**HAVING**

效果：筛选出平均价格在 4000 以下，并且平均分在 7 以上的品牌

```sql
SELECT brand,
	COUNT(*) as count,
	ROUND(AVG(price),2) as avgPrice,
	MAX(price) as maxPrice,
	MIN(price) as minPrice,
	AVG(score) as avgScore
	FROM `products` GROUP BY brand
HAVING avgPrice < 4000 and avgScore > 7;
```

## 外键约束

将 products 的 brand_id 和 brand 的 id 进行绑定

如果是创建表添加外键约束，我们需要在创建表的()最后添加如下语句

```sql
FOREIGN KEY (brand_id) REFERENCES brand(id)
```

如果是表已经创建好，额外添加外键

```sql
ALTER TABLE `products` ADD FOREIGN KEY (brand_id) REFERENCES brand(id);
```

如果 products 中引用的外键被更新了或者删除了，执行代码会报错。

![外键报错](https://misaka10032.oss-cn-chengdu.aliyuncs.com/Node/12-mysql/image-20211016214918127.png)

```sql
ALTER TABLE `products` DROP FOREIGN KEY products_ibfk_1;
ALTER TABLE `products` add FOREIGN KEY (brand_id) REFERENCES brand(id)
											ON UPDATE CASCADE
											ON DELETE RESTRICT;
```

RESTRICT（默认属性）：当更新或删除某个记录时，会检查该记录是否有关联的外键记录，有的话会报错的，不允许更新或删除；

NO ACTION：和 RESTRICT 是一致的，是在 SQL 标准中定义的；

CASCADE：当更新或删除某个记录时，会检查该记录是否有关联的外键记录，有的话：
更新：那么会更新对应的记录；
删除：那么关联的记录会被一起删除掉；

SET NULL：当更新或删除某个记录时，会检查该记录是否有关联的外键记录，有的话，将对应的值设置为 NULL；

## 多表查询

```sql
SELECT * FROM `products`, `brand`;
```

默认查询结果为 笛卡尔乘积，也称为 直积，表示为 X\*Y。

大多数情况下，需要使用 table.column 进行 where 筛选。

```sql
SELECT * FROM `products`, `brand` WHERE `products`.brand_id = `brand`.id;
```

## 多表连接

### 左连接

![MySQL左连接1](https://misaka10032.oss-cn-chengdu.aliyuncs.com/Node/12-mysql/image-20211016232002717.png)

```sql
SELECT * FROM `products` LEFT JOIN `brand` ON `products`.brand_id = `brand`.id;
```

![MySQL左连接2](https://misaka10032.oss-cn-chengdu.aliyuncs.com/Node/12-mysql/image-20211016232018118.png)

```sql
SELECT * FROM `products` LEFT JOIN `brand` ON `products`.brand_id = `brand`.id WHERE brand.id IS NULL;
```

### 右连接

没有左连接常用。

![MySQLy右连接1](https://misaka10032.oss-cn-chengdu.aliyuncs.com/Node/12-mysql/image-20211016232153428.png)

```sql
SELECT * FROM `products` RIGHT JOIN `brand` ON `products`.brand_id = `brand`.id;
```

![MySQL右连接2](https://misaka10032.oss-cn-chengdu.aliyuncs.com/Node/12-mysql/image-20211016232208452.png)

```sql
SELECT * FROM `products` RIGHT JOIN `brand` ON `products`.brand_id = `brand`.id
WHERE products.id IS NULL;
```

### 内连接

![MySQL内连接1](https://misaka10032.oss-cn-chengdu.aliyuncs.com/Node/12-mysql/image-20211016232936276.png)

内连接在开发中偶尔也会常见使用，看自己的场景

内连接有其他的写法：CROSS JOIN 或者 JOIN 都可以

```sql
SELECT * FROM `products` INNER JOIN `brand` ON `products`.brand_id = `brand`.id;
```

```sql
SELECT * FROM `products`, `brand` WHERE `products`.brand_id = `brand`.id;
```

这两个效果一样，但是代表含义不同：

- SQL 语句一：内连接，代表的是在两张表连接时就会约束数据之间的关系，来决定之后查询的结果

- SQL 语句二：where 条件，代表的是先计算出笛卡尔乘积，在笛卡尔乘积的数据基础之上进行 where 条件筛选。

### 全连接

SQL 规范中全连接是使用 FULL JOIN，但是 MySQL 中并没有对它的支持，我们需要使用 UNION 来实现

![MySQL全连接1](https://misaka10032.oss-cn-chengdu.aliyuncs.com/Node/12-mysql/image-20211016232748724.png)

```sql
(SELECT * FROM `products` LEFT JOIN `brand` ON `products`.brand_id = `brand`.id)
UNION
(SELECT * FROM `products` RIGHT JOIN `brand` ON `products`.brand_id = `brand`.id);
```

![MySQL全连接2](https://misaka10032.oss-cn-chengdu.aliyuncs.com/Node/12-mysql/image-20211016232801262.png)

```sql
(SELECT * FROM `products` LEFT JOIN `brand` ON `products`.brand_id = `brand`.id WHERE `brand`.id IS NULL)
UNION
(SELECT * FROM `products` RIGHT JOIN `brand` ON `products`.brand_id = `brand`.id WHERE `products`.id IS NULL);
```

常见的多对多查询为创建关系表，将 A 表-关系表-B 表左连接，进行查询

## 查询数据转对象

```sql
SELECT products.id as id, products.title as title, products.price as price, products.score as score,
	JSON_OBJECT('id', brand.id, 'name', brand.name, 'rank', brand.phoneRank, 'website', brand.website) as brand
FROM products LEFT JOIN brand ON products.brand_id = brand.id;
```

![查询数据转对象](https://misaka10032.oss-cn-chengdu.aliyuncs.com/Node/12-mysql/image-20211017112126810.png)

在多对多关系中，我们希望查询到的是一个数组

比如一个学生的多门课程信息，应该是放到一个数组中的；数组中存放的是课程信息的一个个对象；这个时候我们要 JSON_ARRAYAGG 和 JSON_OBJECT 结合来使用。

```sql
SELECT stu.id, stu.name, stu.age,
				JSON_ARRAYAGG(JSON_OBJECT('id', cs.id, 'name', cs.name)) as courses
FROM students stu
LEFT JOIN students_select_courses ssc ON stu.id = ssc.student_id
LEFT JOIN courses cs ON ssc.course_id = cs.id
GROUP BY stu.id;
```

## Node-mysql2

### 简介

- 更快/更好的性能

- 预编译语句（Prepared Statement）：.

  提高性能：将创建的语句模块发送给 MySQL，然后 MySQL 编译（解析、优化、转换）语句模块，并且存储它但是不执行，之后我们在真正执行时会给?提供实际的参数才会执行；就算多次执行，也只会编译一次，所以性能是更高的

  防止 SQL 注入：之后传入的值不会像模块引擎那样就编译，那么一些 SQL 注入的内容不会被执行；or 1 = 1 不会被执行

- 支持 Promise，所以我们可以使用 async 和 await 语法

### 创建步骤

第一步：创建连接（通过 createConnection），并且获取连接对象；

第二步：执行 SQL 语句即可（通过 query）。

```js
const mysql = require("mysql2");

// 创建连接
const conn = mysql.createConnection({
  host: "localhost",
  database: "coderhub",
  user: "root",
  password: "why888.",
});

// 执行SQL语句
conn.query("SELECT * FROM products;", (err, results, fields) => {
  console.log(err);
  console.log(results);
  console.log(fields);
  conn.destroy();
});
```

### 预编译语句

```js
const statement = "SELECT * FROM products WHERE price > ? and brand = ?;";
conn.execute(statement, [1000, "华为"], (err, results) => {
  console.log(results);
});
```

如果再次执行该语句，它将会从 LRU（Least Recently Used） Cache 中获取获取，省略了编译 statement 的时间来提高性能

### 连接池

前面我们是创建了一个连接（connection），但是如果我们有多个请求的话，该连接很有可能正在被占用，那么我们是否需要每次一个请求都去创建一个新的连接呢？

- 事实上，mysql2 给我们提供了连接池（connection pools）
- 连接池可以在需要的时候自动创建连接，并且创建的连接不会被销毁，会放到连接池中，后续可以继续使用

- 我们可以在创建连接池的时候设置 LIMIT，也就是最大创建个数。

### Promise 写法

在 JavaScript 开发中我们更习惯 Promise 和 await、async 的方式，mysql2 同样是支持的

```sql
const mysql = require("mysql2");
const pool = mysql.createPool({
    host: 'localhost',
    port: 3306,
    database: 'yzh',
    user: 'root',
    password: 'Yzh123456.'
});
const statement = `SELECT * FROM products WHERE price > ?;`;
pool.promise().execute(statement, ['6000']).then(([results, fields]) => {
    for (const field of fields) {
        console.log(field.name);
    }
    pool.end();
});
```

### ORM

对象关系映射（英语：Object Relational Mapping，简称 ORM，或 O/RM，或 O/R mapping），是一种程序设计的方案：

从效果上来讲，它提供了一个可在编程语言中，使用**虚拟对象数据库**的效果

比如在 Java 开发中经常使用的 ORM 包括：Hibernate、MyBatis

Node 当中的 ORM 我们通常使用的是 sequelize。

[Sequelize](https://www.sequelize.cn/) 是用于 Postgres，MySQL，MariaDB，SQLite 和 Microsoft SQL Server 的基于 Node.js 的 ORM，它支持非常多的功能。

如果我们希望将 Sequelize 和 MySQL 一起使用，那么我们需要先安装两个东西

1. mysql2：sequelize 在操作 mysql 时使用的是 mysql2；

2. sequelize：使用它来让对象映射到表中。
