---
title: SELECT
order: 2

tag:
  - 基本SELECT
  - 列别名
  - 去重
  - 空值运算
  - 着重号
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
