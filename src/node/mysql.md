---
title: MySQL
order: 9
category: false
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

SELECT用于从一个或者多个表中检索选中的行（Record）

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

查询title、brand、price

```sql
SELECT title, brand, price FROM `products`;
```

给字段起别名，别名一般在多张表或者给客户端返回对应的key时会使用到

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

#### like关键字实现模糊查询，结合两个特殊符号

%表示匹配任意个的任意字符

_表示匹配一个的任意字符

```sql
# 查询所有以v开头的title
SELECT * FROM `products` WHERE title LIKE 'v%';

# 查询带M的title
SELECT * FROM `products` WHERE  title LIKE '%M%';

# 查询带M的title必须是第三个字符
SELECT * FROM `products` WHERE title LIKE '__M%';
```

#### 结果排序

ORDER BY有两个常用的值：ASC：升序排列；DESC：降序排列。

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

希望给Group By查询到的结果添加一些约束，那么我们可以使用：**HAVING**

效果：筛选出平均价格在4000以下，并且平均分在7以上的品牌

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

将products的brand_id和brand的id进行绑定

如果是创建表添加外键约束，我们需要在创建表的()最后添加如下语句

```sql
FOREIGN KEY (brand_id) REFERENCES brand(id)
```

如果是表已经创建好，额外添加外键

```sql
ALTER TABLE `products` ADD FOREIGN KEY (brand_id) REFERENCES brand(id);
```

如果products中引用的外键被更新了或者删除了，执行代码会报错。

![外键报错](https://misaka10032.oss-cn-chengdu.aliyuncs.com/Node/12-mysql/image-20211016214918127.png)

```sql
ALTER TABLE `products` DROP FOREIGN KEY products_ibfk_1;
ALTER TABLE `products` add FOREIGN KEY (brand_id) REFERENCES brand(id) 
											ON UPDATE CASCADE 
											ON DELETE RESTRICT;
```

RESTRICT（默认属性）：当更新或删除某个记录时，会检查该记录是否有关联的外键记录，有的话会报错的，不允许更新或删除；

NO ACTION：和RESTRICT是一致的，是在SQL标准中定义的；

CASCADE：当更新或删除某个记录时，会检查该记录是否有关联的外键记录，有的话：
更新：那么会更新对应的记录；
删除：那么关联的记录会被一起删除掉；

SET NULL：当更新或删除某个记录时，会检查该记录是否有关联的外键记录，有的话，将对应的值设置为NULL；

b 