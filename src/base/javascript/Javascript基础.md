---
title: Javascript基础
order: 1
category: false
tag:
  - Javascript基础
  - JS基本语法
---

## JS 历史介绍

JS 诞生于 1995 年，出现主要是用于处理网页中的前端验证（检查用户输入内容是否符合一定规则）。

市面上存在两个版本的 JS，分别是 JavaScript 和 JScript，为了确保标准一致，制定了共同的标准名为 ECMAScript。

![历史时间表](https://misaka10032.oss-cn-chengdu.aliyuncs.com/Javascript/time%E6%97%B6%E9%97%B4%E8%A1%A8)

不同浏览器的不同实现方式

![不同浏览器实现](https://misaka10032.oss-cn-chengdu.aliyuncs.com/Javascript/time%E6%97%B6%E9%97%B4%E8%A1%A8)

ECMAScript 是 JavaScript 标准，所以一般情况下这两个词认为是一个意思，但实际上 JavaScript 的含义要更大一些。

一个完整的 JavaScript 实现应该由以下三个部分构成：

- ECMAScript：JavaScript 标准

- BOM：Browser Object Model 浏览器对象模型

- DOM：Document Object Model 文档对象模型

## 基础语法

### 写入方式

行内、内联、外联

同样的，JS 虽然可以写在标签属性中，但是结构与行为耦合，不方便维护，不推荐使用。

推荐方式：将 JS 代码编写到外部 JS 文件中，然后通过 script 标签引入。写到外部文件中可以在不同的页面中同时使用，也可以利用浏览器缓存机制。

**script 标签一旦用于引入外部文件，就不能在该标签内编写代码了，即使编写了浏览器也会忽略。**

### 执行顺序

从上到下逐行执行

### 基础输出语句

alert(); 控制浏览器弹出一个警示框

document.write(); 让计算机在页面 body 中输出一个内容

console.log(); 向控制台输出一个内容

## 书写规范

- 严格区分大小写

- 每一条语句以 ; 结尾（非强制）

- 忽略多个空格和换行

### 字面量与变量

字面量：就是数据，是源程序的组成部分之一。

变量：本质上是内存中的一块空间，这块空间有数据类型、名字、字面值。变量是内存中存储数据的最基本单元。

变量声明关键字：`var`

```js
// 声明一个字面为数字1的变量，变量名为a
var a = 1;
```

### 标识符

js 语法中的标识符包括变量名、函数名、属性名。

- 由字母、数字、\_、$组成

- 不能以数字开头

- 不能是 ES 中的关键字或保留字

![关键字和保留字](https://misaka10032.oss-cn-chengdu.aliyuncs.com/Javascript/%E5%85%B3%E9%94%AE%E5%AD%97%E5%92%8C%E4%BF%9D%E7%95%99%E5%AD%97)

![其他不建议字符](https://misaka10032.oss-cn-chengdu.aliyuncs.com/Javascript/%E5%85%B6%E4%BB%96%E4%B8%8D%E5%BB%BA%E8%AE%AE%E5%AD%97%E7%AC%A6)

- 驼峰命名法

骆驼式命名法（Camel-Case）又称驼峰命名法，是电脑程式编写时的一套命名规则（惯例）。正如它的名称 CamelCase 所表示的那样，是指混合使用大小写字母来构成变量和函数的名字。程序员们为了自己的代码能更容易的在同行之间交流，所以多采取统一的可读性比较好的命名方式。

骆驼式命名法就是当变量名或函式名是由一个或多个单词连结在一起，而构成的唯一识别字时，第一个单词以小写字母开始；第二个单词的首字母大写或每一个单词的首字母都采用大写字母，例如：myFirstName、myLastName，这样的变量名看上去就像骆驼峰一样此起彼伏，故得名。

`小驼峰命名法：camelCase`

`下划线命名法：snake_case`

js 底层保存标识符实际采用 Unicode 编码，所以所有 UTF-8 内容理论上均可作为标识符。

## 数据类型（重要）

js 现阶段的数据类型有六种

- Number 数值型

- Boolean 布尔型

- String 字符串，注意在书写时需要用引号括起来，字符串内部的引号注意加转移字符 \

- Null 空类型

- Undefined 未定义类型

- Object 对象

除了 Object 是引用数据类型，其他都是基本数据类型。

### 转义字符

- `\"` 表示 `"`

- `\'` 表示 `'`

- `\n` 表示换行

- `\t` 表示制表符

### Number

js 中所有的数值都是 Number 类型，包括整数、浮点。

注意：

1. 当变量超过了 Number.MAX_VALUE 时，返回 Infinity

2. Number 变量被赋予了非数字值，返回 NaN(Not A Number)。使用 type of 检查 NaN，返回 Number

### Null

Null 类型只有一个值，就是 Null，专门用来表示一个空对象。typeof 检查返回 Object

### Undefined

声明变量不赋值，就为 undefined

### String

这是 String

### Object

这是 Object

### 强制类型转换

#### 1. 转换 String

方法一：.toString() 不会影响原变量 null 和 undefined 没有 toString 方法，空指针异常

方法二：String()函数，跟方法一不同之处在于，null 和 undefined 会直接转换为 null 和 undefined

#### 2.转换 Number

方法一：Number()函数

- 纯数字字符串，转换为数字。

- 字符串有非数字内容，转换 NaN。

- 空串或者是一个全空格的字符串，转换为 0。

- 布尔值转换为 0 和 1。

- null 转为 0。

- undefined 转换为 NaN。

方法二：

parseInt() 字符串转为整数

parseFloat() 字符串转为浮点数

转换有效位置从字符串首字符为数字开始，非数字字符结束。如果首字符不是数字，返回 NaN

#### 3.转换 Boolean

方法一：Boolean 函数

数字 → 布尔，除了 0 和 NaN，其他都是 true

字符串 → 布尔，除了空串，其他都是 true

null 和 undefined 都是 false

方法二：任意数据类型两次取反，转换布尔值。

### 其他进制数字

十六进制 0x 开头

八进制 0 开头

二进制 0b 开头

**注意**：parseInt()里面可以传递第二个参数，指定数字进制

## 运算符

运算符也叫操作符，计算一个或多个值，返回运算结果

### 算数运算符

#### 1.加号 +

字符串两两相加，效果为字符串拼接

任何值与字符串相加，均转换为字符串再拼接

**转换字符串快捷方法：任意类型+ ""**

#### 2.减乘除模 - \* / %

任何值做减乘除模运算时都会转为 Number。

**转换 Number 快捷方法：任意类型 -0 \*1 /1 ""**

### 一元运算符

正号 + 负号 -

转换方法与 Number 函数一致。

### 自增和自减

++i 先自增，后赋值参与运算

i++先赋值参与运算，后自增

```js
var i = 1;
var j = 1;
// a的值是6
var a = i++ + 5;
// 2
console.log(i);
//7 b的值是7
var b = ++j + 5;
// 2
console.log(j);
console.log(a);
console.log(b);
```

### 逻辑运算符

&& 短路与 || 短路或 ! 非

非布尔值两次取反，返回 true

短路与：1.第一个值为 true，返回第二个值；2.第一个值为 false，返回第一个值。（注意返回原值）

短路或：1.第一个值为 true，返回第一个值；2.第一个值为 false，返回第二个值。（注意返回原值）

### 赋值运算符

+= -= \*= /=

变量对等号右边的字面量做相应的四则运算，得到的结果重新赋值给当前变量

```js
var a = 1;
var b = 2;
var c = 3;
var d = 4;
a += 1; // 2
b -= 2; // 0
c *= 2; // 6
d /= 2; // 2
```

### 关系运算符

大于 >

小于 <

等于 ==（仅为值比较）

不等于 !=（仅为值比较）

全等 ===（全等，包含类型比较）

不全等 !==（不全等，包含类型比较）

1.比较字符串时，比较的是字符串的字符编码，且一位一位进行比较。

因此比较两个字符串型数字一定要转型，否则可能得到不可预期结果。

2.其他类型跟 Number 比较，转换为数字后再比较。

3.Null、Undefined 跟数字比较均为 false，没有可比性。

4.NaN 不等于任何值

### Unicode 编码

\u + 4 位 Unicode 编码

网页 html 中的 Unicode 编码使用： &# + 编码。注意此处编码为十进制

### 三元运算符

条件表达式 ? 语句 1 : 语句 2;

判断表达式的值，如果是 true 则取值 1，如果是 false 则取值第二个 0；

### 空值合并操作符

比较 ?? 左右两侧的值，如果左侧为 null 或 undefined，返回右侧值，否则返回左侧值

```js
null ?? "hi"; // 'hi'
undefined ?? "hey"; // 'hey'
false ?? "hola"; // false
0 ?? "bonjour"; // 0
"first" ?? "second"; // first
```

### 逗号操作符

( _ , _ , _ , _)对每个操作数求值（从左到右），并返回最后一个操作数的值。

```js
var a=1 , b=2 , c=3

相当于：
var a=1
var b=2
var c=3
```

```js
a = ((b = 1), (c = 2)); //连续执行和赋值
console.log(a); //返回2
console.log(b); //返回1
console.log(c); //返回2
```

### 隐式类型转换

上述运算在两变量类型不相同时均遵循[隐式类型转换](https://www.cnblogs.com/WayToGo-hwd/p/13994961.html)

## 流程控制语句

### 条件判断语句 if

单 if：满 30 减 20 用程序表示

```js
var a = 30;
if (a >= 30) {
  console.log(a - 20);
}
```

如果语句块之间只有一行代码，大括号可以省略

if-else：满 100 减 20 否则打九折

```js
var a = 90;
if (a >= 100) {
  console.log(a - 20);
} else {
  console.log(a * 0.9);
}
```

### 条件分支语句 switch

