---
title: SELECT
order: 2

tag:
  - 基本SELECT
  - 列别名
  - 去重
  - 空值运算
  - 着重号
  - 数据过滤
  - 运算符
---

因为 SELECT 语句使用频率最高，所以 SELECT 单开一节来记录

## 伪表

SELECT 后不跟 FROM 表示使用 DUAL 伪表

```sql
SELECT 1 + 1, 3 * 2;
# SELECT 1 + 1, 3 * 2 FROM DUAL;
```

## 基本操作

### FROM

`SELECT 标识选择哪些列`

`FROM 标识从哪个表中选择`

`SELECT * FROM departments; 选择全部列`

### 列别名

as（alias）：可以省略的关键字

列的别名可以用一堆`""`引起来。不要使用`''`

```sql
SELECT employee_id emp_id, last_name AS lname, department "dept_id", salary * 12 AS "annual sal" from employees;
```

### 去除重复行

默认情况下，查询会返回全部行，包括重复行

```sql
SELECT DISTINCT department_id FROM employees;
```

联合去重（DISTINCT 需要放到所有列名的前面）

```sql
SELECT DISTINCT department_id,salary
FROM employees;
```

### 空值参与运算

所有运算符或列值遇到 null 值，运算的结果都为 null

```sql
# ×
SELECT employee_id,salary,commission_pct,
12 * salary * (1 + commission_pct) "annual_sal"
FROM employees;

# √
SELECT employee_id,salary,commission_pct,
12 * salary * (1 + IFNULL(commission_pct,0)) "annual_sal"
FROM employees;
```

注意：在 MySQl 里面，空值不等于空字符串。一个空字符串的长度是 0，而一个空值的长度是空。并且 MySQL 里面空值是占用空间的

### 着重号

库名、表名、字段名与关键字重名时，必须使用着重号引起来

```sql
SELECT * FROM `ORDER`;
```

### 查询常数

整合不同的数据源时，使用常数作为这个表的标记，需要使用查询常数

```sql
SELECT 'NewColumn' as corporation, last_name FROM employees;
```

### 显示表结构

使用 DESCRIBE 或 DESC 表示

```sql
DESCRIBE employees;

DESC employees;
```

## 数据过滤

### WHERE

```sql
SELECT *
FROM employees
WHERE department_id = 90;
```

> 使用 WHERE 子句，将不满足条件的行过滤掉
> WHERE 子句紧随 FROM 子句

### 算术运算符

| 运算符  | 名称               | 作用                     | 示例                             |
| :------ | :----------------- | :----------------------- | :------------------------------- |
| +       | 加法运算符         | 计算两个值或表达式的和   | SELECT A + B                     |
| -       | 减法运算符         | 计算两个值或表达式的差   | SELECT A - B                     |
| \*      | 乘法运算符         | 计算两个值或表达式的乘积 | SELECT A \* B                    |
| /或 DIV | 除法运算符         | 计算两个值或表达式的商   | SELECT A / B 或者 SELECT A DIV B |
| %或 MOD | 求模（取余）运算符 | 计算两个值或表达式的余数 | SELECT A % B 或者 SELECT A MOD B |

注意：在 SQL 中，`+`没有连接作用，表示纯加法运算。此时，会将字符串转换为数值（隐式转换）

```sql
SELECT 100 + 'A' FROM DUAL; # a看作0处理

SELECT 100 + NULL FROM DUAL; # NULL
```

结论：

- 一个整数类型的值对整数进行加法和减法操作，结果还是一个整数
- 一个整数类型的值对浮点数进行加法和减法操作，结果是一个浮点数
- 加法和减法的优先级相同，进行先加后减操作与先减后加操作的结果是一样的
- 在 Java、JavaScript 中，`+`的左右两边有字符串表示字符串拼接，但是 MySQL 中`+`只表示数值相加。如果遇到非数值类型，先尝试转成数值，如果转失败则按 0 计算。（补充：MySQL 中字符串拼接要使用字符串函数 CONCAT()实现）

- 一个数乘以整数 1 和除以整数 1 后仍得原数
- 一个数乘以浮点数 1 和除以浮点数 1 后变成浮点数，数值与原数相等
- 一个数除以整数后，不管是否能除尽，结果都为一个浮点数
- 一个数除以另一个数，除不尽时，结果为一个浮点数，并保留到小数点后 4 位
- 乘法和除法的优先级相同，进行先乘后除与先除后乘操作，得出的结果相同
- 在数学运算中，0 不能用作除数，在 MySQL 中，一个数除以 0 为 NULL

### 比较运算符

比较运算符用来对表达式左边的操作数和右边的操作数进行比较，比较的结果为真则返回 1，比较的结果为假则返回 0，其他情况则返回 NULL。

等号运算符遵循如下规则：

- 如果等号两边的值、字符串或表达式都为字符串，则 MySQL 会按照字符串进行比较，其比较的是每个字符串中字符的 ANSII 编码是否相等
- 如果等号两边的值都是整数，则 MySQL 会按照整数来比较两个值的大小
- 如果等号两边的值一个是整数，另一个是字符串，则 MySQL 会将字符串转化为数字进行比较
- 如果等号两边的值、字符串或表达式中有一个为 NULL，则比较结果为 NULL

注意：`<=>`和`=`作用相似。唯一的区别是：`<=>`可以用来对 NULL 进行判断。在两个操作数均为 NULL 时，其返回值为 1，而不为 NULL；当一个操作数为 NULL 时，其返回值为 0，而不为 NULL

比较运算符经常被用来作为 SELECT 查询语句的条件来使用，返回符合条件的结果记录。

| 运算符 | 名称           | 作用                                                             | 示例                                 |
| :----- | :------------- | :--------------------------------------------------------------- | :----------------------------------- |
| =      | 等于运算符     | 判断两个值、字符串或表达式是否相等                               | SELECT C FROM TABLE WHERE A = B      |
| <=>    | 安全等于运算符 | 安全地判断两个值、字符串或表达式是否相等                         | SELECT C FROM TABLE WHERE A <=> B    |
| <>(!=) | 不等于运算符   | 判断两个值、字符串或表达式是否不相等                             | SELECT C FROM TABLE WHERE A <>(!=) B |
| <      | 小于运算符     | 判断前面的值、字符串或表达式是否小于后面的值、字符串或表达式     | SELECT C FROM TABLE WHERE A < B      |
| <=     | 小于等于运算符 | 判断前面的值、字符串或表达式是否小于等于后面的值、字符串或表达式 | SELECT C FROM TABLE WHERE A <= B     |
| >      | 大于运算符     | 判断前面的值、字符串或表达式是否大于后面的值、字符串或表达式     | SELECT C FROM TABLE WHERE A > B      |
| >=     | 大于等于运算符 | 判断前面的值、字符串或表达式是否大于等于后面的值、字符串或表达式 | SELECT C FROM TABLE WHERE A >= B     |

此外，还有非符号类型的运算符：

| 运算符      | 名称             | 作用                                     | 示例                                        |
| :---------- | :--------------- | :--------------------------------------- | :------------------------------------------ |
| IS NULL     | 为空运算符       | 判断值、字符串或表达式是否为空           | SELECT B FROM TABLE WHERE A IS NULL         |
| IS NOT NULL | 不为空运算符     | 判断值、字符串或表达式是否不为空         | SELECT B FROM TABLE WHERE A IS NOT NULL     |
| LEAST       | 最小值运算符     | 在多个值中返回最小值                     | SELECT D FROM TABLE WHERE C LEAST(A, B)     |
| GREATEST    | 最大值运算符     | 在多个值中返回最大值                     | SELECT D FROM TABLE WHERE C GREATEST(A, B)  |
| BETWEEN AND | 两值之间的运算符 | 判断一个值是否在两个值之间               | SELECT D FROM TABLE WHERE C BETWEEN A AND B |
| ISNULL      | 为空运算符       | 判断一个值、字符串或表达式是否为空       | SELECT B FROM TABLE WHERE ISNULL(A)         |
| IN          | 属于运算符       | 判断一个值是否为列表中的任意一个值       | SELECT D FROM TABLE WHERE C IN (A, B)       |
| NOT IN      | 不属于运算符     | 判断一个值是否不是一个列表中的任意一个值 | SELECT D FROM TABLE WHERE C NOT IN (A, B)   |
| LIKE        | 模糊匹配运算符   | 判断一个值是否符合模糊匹配规则           | SELECT C FROM TABLE WHERE A LIKE B          |
| REGEXP      | 正则表达式运算符 | 判断一个值是否符合正则表达式的规则       | SELECT C FROM TABLE WHERE A REGEXP B        |
| RLIKE       | 正则表达式运算符 | 判断一个值是否符合正则表达式的规则       | SELECT C FROM TABLE WHERE A RLIKE B         |

LIKE 搭配字符：

> `%`：代表不确定个数的字符（0 个、1 个或多个）
> `_`：代表一个不确定的字符

### 逻辑运算符

逻辑运算符主要用来判断表达式的真假，在 MySQL 中，逻辑运算符的返回结果为 1、0 或者 NULL。

注意：OR 可以和 AND 一起使用，但是在使用时要注意两者的优先级，由于 AND 的优先级高于 OR，因此先对 AND 两边的操作数进行操作，再与 OR 中的操作数结合。

| 运算符       | 作用     | 示例                               |
| :----------- | :------- | :--------------------------------- |
| NOT 或 !     | 逻辑非   | SELECT NOT A                       |
| AND 或 &&    | 逻辑与   | SELECT A AND B 或 SELECT A && B    |
| OR 或 `\|\|` | 逻辑或   | SELECT A OR B 或 SELECT A `\|\|` B |
| XOR          | 逻辑异或 | SELECT A XOR B                     |

### 运算符优先级

![运算符优先级](https://misaka10032.oss-cn-chengdu.aliyuncs.com/MySQL/MySQL%E8%BF%90%E7%AE%97%E7%AC%A6%E4%BC%98%E5%85%88%E7%BA%A7.png)

数字编号越大，优先级越高，优先级高的运算符先进行计算。可以看到，赋值运算符的优先级最低，使用"()"括起来的表达式的优先级最高。

### 位运算符

位运算符是在二进制数上进行计算的运算符。位运算符会先将操作数变成二进制数，然后进行位运算，最后将计算结果从二进制变回十进制数。

MySQL支持的位运算符如下：

![位运算符](https://misaka10032.oss-cn-chengdu.aliyuncs.com/MySQL/MySQL%E4%BD%8D%E8%BF%90%E7%AE%97%E7%AC%A6.png)