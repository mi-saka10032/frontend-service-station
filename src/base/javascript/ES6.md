---
title: ES6+
order: 8
category: false
tag:
  - Javascript高阶
  - ES6+
---

## ES6

### 1.let

1.变量不能重复声明

2.块级作用域

3.不存在变量提升

4.不影响作用域链

### 2.const

1.一定要赋初始值

2.一般常量使用大写（规范）

3.值不能修改

4.块级作用域

5.对于数组和对象的元素修改无影响

### 3.解构赋值

1.数组的解构

```javascript
const arr = [1, 2, 3, 4];
let [A, B, C, D] = arr;
console.log(A);
console.log(B);
console.log(C);
console.log(D);
```

2.对象的解构

```javascript
const obj = {
  name: "ZhangSan",
  age: 18,
  gender: "male",
  address: "China",
};
let { name, age, gender, address } = obj;
console.log(name);
console.log(age);
console.log(gender);
console.log(address);
```

### 4.模板字符串`

1.声明

```javascript
let str = `abc`;
```

2.内容中可以出现换行符

3.变量拼接 ${}

### 5.简化对象写法

ES6 允许在大括号里面，直接写入变量和函数，作为对象的属性和方法。

```javascript
let name = "ZhangSan";
let change = function () {
  console.log(1);
};
const obj = {
  name,
  change,
};
console.log(obj);
```

### 6.箭头函数 =>

1.this 是静态的，this 始终指向函数声明时所在作用域下的 this 的值。

2.不能作为构造实例化对象。

3.不能使用 arguments 变量。

4.箭头函数简写

1）形参只有一个，省略小括号。

2）代码体只有一条语句，省略花括号。此时 return 必须省略，语句执行结果就是函数返回值。

### 7.函数参数默认值

允许给函数参数赋值初始值

1.形参初始值具有默认值的参数，一般位置要靠后（规范）

2.与解构赋值结合

```javascript
function connect(host, username, password, port) {
  console.log(host);
  console.log(username);
  console.log(password);
  console.log(port);
}

connect({
  host: 1,
  username: 2,
  password: 3,
  port: 4,
});
```

### 8.rest 剩余参数

rest 用于获取函数实参，用来代替 arguments

rest 参数必须放到参数最后

```javascript
//ES5获取实参
function date() {
  console.log(arguments);
}
date(1, 2, 3, 4);
//ES6获取实参
function date2(...args) {
  console.log(args);
}
date2(1, 2, 3, 4);
```

### 9.扩展运算符

扩展运算符能将数组转换为逗号分隔的参数序列

1.数组合并

2.数组克隆

3.伪数组转为真正数组

### 10.Symbol（第七种数据类型）

Symbol 表示独一无二的值，它是 JS 第七种数据类型，类似字符串的数据类型。

#### 特点

1.Symbol 值是唯一的，用来解决命名冲突的问题

2.Symbol 值不能与其他数据进行运算

3.Symbol 定义的对象属性不能使用 for……in……循环遍历，但是可以使用 Reflect.ownKeys 来获取对象的所有键名

4.不能与其他数据进行运算

#### 语法

Symbol.for 创建以键名为导向的 Symbol，两个 for 相同的变量，他们的值也是相同的。

```javascript
let s = Symbol();
let s2 = Symbol("abc");
let s3 = Symbol("abc");
console.log(s2 === s3);
let s4 = Symbol.for("abc");
let s5 = Symbol.for("abc");
console.log(s4 === s5);
```

#### 应用

Symbol 值可以由程序创建，并可以作为属性名，而且不用担心属性名冲突

调用 Symbol() 方法将创建一个新的 Symbol 类型的值，并且该值不与其它任何值相等。

与数字和字符串一样，Symbol 类型的值也可以作为对象的属性名，正是由于它不与任何其它值相等，对应的属性也不会发生冲突

#### 内置值

| 值 | 描述 |
| :---- | :---- |
| Symbol.hasInstance | 当其他对象使用 instanceof 运算符，判断是否为该对象实例时，调用这个方法 |
| Symbol.isConcatSpreadable | 对象的 Symbol.isConcatSpreadable 属性等于的是一个布尔值，表示该对象用于 Array.prototype.concat()时，是否可以展开 |
| Symbol.unscopables | 该对象指定了使用 width 关键字时，那些属性会被 width 环境排除 |
| Symbol.match | 当执行 str.match(myObject)时，如果该属性存在，会调用它，返回该方法的返回值 |
| Symbol.replace | 当执行 str.replace(myObject)时，如果该属性存在，会调用它，返回该方法的返回值 |
| Symbol.search | 当执行 str.search(myObject)时，如果该属性存在，会调用它，返回该方法的返回值 |
| Symbol.split | 当执行 str.split(myObject)时，如果该属性存在，会调用它，返回该方法的返回值 |
| Symbol.iterator | 对象进行 for...of 循环时，会调用 Symbol.iterator 方法，返回该对象的默认遍历器 |
| Symbol.toPrimitive | 改对象被转为原始类型的值时，会调用这个方法，返回该对象对应的原始类型值 |
| Symbol.toStringTag | 在该对象上面调用 toString 方法时，返回该方法的返回值 |
| Symbol.species | 创建衍生对象时，会使用该属性 |

### 11.迭代器

Iterator 是一种接口，为不同数据结构提供统一的访问机制。任何数据结构只要部署 Iterator 接口，就可以完成遍历操作。主要供 for……of 使用

原生具备 Iterator 接口的数据

Array Arguments Set Map String TypedArray NodeList

#### 原理

1.创建一个指针对象，指向当前数据结构的起始位置

2.第一次调用对象 next 方法，指针自动指向数据结构的第一个成员

3.接下来不断调用 next 方法，指针一直往后移动，直到指向最后一个成员

4.每调用 next 方法返回一个包含 value 和 done 属性的对象

```javascript
const obj = {
  name: "class",
  status: [1, 2, 3, 4, 5, 6],
  [Symbol.iterator]() {
    let index = 0;
    return {
      next: () => {
        return index < this.status.length
          ? { value: this.status[index++], done: false }
          : { value: undefined, done: true };
      },
    };
  },
};
let iterator = obj[Symbol.iterator]();
let flag = true;
while (flag) {
  let temp = iterator.next();
  console.log(temp);
  temp.done === false ? (flag = true) : (flag = false);
}
```

### 12.生成器

生成器是一个特殊的函数

异步编程 纯回调函数

yield：函数代码分割符

```js
function* gen() {
  // console.log(111);
  yield "一只没有耳朵";
  // console.log(222);
  yield "一只没有尾巴";
  // console.log(333);
  yield "真奇怪";
  // console.log(444);
}

let iterator = gen();
console.log(iterator.next());
console.log(iterator.next());
console.log(iterator.next());
console.log(iterator.next());
```

打印结果：

![生成器打印结果](https://misaka10032.oss-cn-chengdu.aliyuncs.com/Javascript/%E7%94%9F%E6%88%90%E5%99%A8%E6%89%93%E5%8D%B0%E7%BB%93%E6%9E%9C)

yield \*\*\*\* 的返回值是 iterator.next() next 括号中的实参

iterator.next(123)

let res = yield \*\*\*\*;

延时打印案例（解决回调地狱）

```javascript
function one() {
  setTimeout(() => {
    console.log(111);
  }, 1000);
}
function two() {
  setTimeout(() => {
    console.log(222);
  }, 2000);
}
function three() {
  setTimeout(() => {
    console.log(333);
  }, 3000);
}

function* gen() {
  yield one();
  yield two();
  yield three();
}

let iterator = gen();
while (!iterator.next().done) {}
```

### 13. Promise

Promise 是 ES6 引入的异步编程的新解决方案。语法上 Promise 是一个构造函数，用来封装异步操作并可以获取其成功或失败的结果。

#### 语法

1）Promise 构造函数：Promise(resolve,reject) { }

resolve()将异步请求成功的结果返回给构造函数对象，reject()将失败的结果返回给构造函数对象。

#### 方法

2）Promise.prototype.then(function(value){

},function(reason){

})

then 方法内传递两个函数作为参数，第一个函数的第一个参数 value 为对象 resolve 返回的值，第二个函数的第二个参数 reason 为对象 reject 返回的值。

then 方法的返回结果是 Promise 对象，对象状态由回调函数的执行结果来决定：

1.回调函数返回结果是非 promise 类型的属性，状态为成功，返回值为对象的成功的值

2.回调函数返回结果是 promise 类型的属性，then 的返回值状态取决于返回值的状态。

链式调用

p.then 返回值接 p.then

3）Promise.prototype.catch 方法

reason 捕捉

### 14.Set

ES6 新增数据结构

size add delete has clear

应用：

1.去重

```javascript
let arr = [1, 3, 2, 4, 1, 85, 6, 1, 2, 3];
let result = [...new Set(arr)];
console.log(result);
```

2.交集

```javascript
let arr = [1, 3, 2, 4, 1, 85, 6, 1, 2, 3];
let arr2 = [1, 3, 65, 85, 1, 7, 8, 9];
let result = [...new Set(arr)].filter((item) => new Set(arr2).has(item));
console.log(result);
```

3.并集

```javascript
let arr = [1, 3, 2, 4, 1, 85, 6, 1, 2, 3];
let arr2 = [1, 3, 65, 85, 1, 7, 8, 9];
let result = [...new Set([...arr, ...arr2])];
console.log(result);
```

4.差集

```javascript
let arr = [1, 3, 2, 4, 1, 85, 6, 1, 2, 3];
let arr2 = [1, 3, 65, 85, 1, 7, 8, 9];
let result = [...new Set(arr)].filter((item) => !new Set(arr2).has(item));
console.log(result);
```

### 15.Map

键值对结合

for……of 遍历

size set get has clear

### 16.类

1.静态成员

类里面，static 关键字

2.继承

extends 关键字

3.重写

同方法名

4.get set

对参数进行读写

### 17.数值扩展

1）Number.EPSILON JS 最小精度 2.22………………E-16

```javascript
function equal(a, b) {
  return Math.abs(a - b) < Number.EPSILON;
}
console.log(equal(0.1 + 0.2, 0.3));
```

2）二进制 0b 八进制 0o 十六进制 0x

3）Number.isFinite 是否为有限数

4）Number.isNaN 是否为 NaN

5）Number.parseInt 字符串转整型 Number.parseFloat 字符串转浮点型

6）Number.isInteger 是否为整数

7）Math.trunc 抹掉小数部分

8）Math.sign 判断为正数、负数、0（1 -1 0）

### 18.对象扩展

#### 1.Object.is

与 === 基本一致，有两个特殊

+0 -0 值不相等；NaN 等于 NaN

#### 2.Object.assign

对象合并，后一个对象会覆盖掉前一个对象的重名属性。

#### 3.Object.setPrototypeOf

设置原型对象（any obj，prototype obj）

### 19.模块化

模块化是指将一个大的程序文件，拆分成许多晓得文件，然后将小文件组合起来。

#### 1.好处：

1.防止命名冲突。2.代码复用。3.高维护性

#### 2.模块化规范：

CommonsJS => NodeJS、Browserify

AMD => requireJS

CMD => seaJS

#### 3.模块化语法：

export 命令用于规定模块的对外接口

import 命令用于输入其他模块提供的功能

```javascript
//第一种引入方法
<script type="module">
    import * as m1 from "../JSOO/JSOO.js";

    console.log(m1);
</script>
//第二种引入方法
<script src="xxx" type="module"></script>
```

#### 4.暴露模块数据语法

分别暴露：

export let test = 123;

统一暴露：

export {test, fun};

默认暴露：

export default { }

export { test as default }

export default test;

#### 5.引入模块数据语法

1.通用的导入方式

import \* as m1 from "";

2.解构赋值方式

import {test, school} from "";

import {default as test} from "";

如果有重复引入的变量名字，会冲突报错，需要 as 重命名

3.简便形式 针对默认暴露

import m1 from "";

m1 为引入模块的默认变量

#### 6.babel 转换器模块化流程（node vue）

1.安装工具 babel-cli babel-preset-env browserify(webpack)

2.npx babel src/.js -d dist/js

3.打包 npx browserify dist/js/app.js -o dist/bundle.js

demo：引入 jquery

npx browserify dist/js/app.js -o dist/bundle.js

## ES7

### 1.指数操作符

`**` 功能与 Math.pow 相同

```js
// 25
console.log(5 ** 2);
```

### 2.Array.from

将类数组或可遍历对象转换为真正的数组

```javascript
let obj = {
  [0]: "a",
  [1]: "b",
  [2]: "c",
  length: 3, //此处length是必须的
};
let arr = Array.from(obj);
console.log(arr);
```

方法还可接受第二个参数，作用类似于数组的 map 方法，用来对每个元素进行处理，将处理后的值放入返回的数组。

### 3.数组方法（重要）

find：用于找出第一个符合条件的数组成员，如果没有找到返回 undefined。

findIndex：用于找出第一个符合条件的数组成员的位置，如果没有找到返回-1。

includes：表示某个数组是否包含给定的值，返回布尔值。

迭代方法：forEach() map() filter() some() every()

#### forEach

```javascript
array.forEach(function (value, index, arr) {});
```

value：数组当前项的值

index：数组当前项索引

arr：数组对象

#### filter

```javascript
array.filter(function (value, index, arr) {});
```

创建一个新数组，新数组中的元素通过检查指定数组中符合条件的所有元素，主要用于筛选数组。注意返回一个新数组

参数原理一致。

#### some

```javascript
array.some(function (value, index, arr) {});
```

检测数组中是否有满足条件的元素，返回布尔值。找到为 true 找不到为 false。

找到第一个满足条件的元素即终止循环，不在继续查找。

#### map

map() 方法返回一个新数组，数组中的元素为原始数组元素调用函数处理后的值。

map() 方法按照原始数组元素顺序依次处理元素。

#### every

every() 方法用于检测数组所有元素是否都符合指定条件（通过函数提供）。

如果数组中检测到有一个元素不满足，则整个表达式返回 false ，且剩余的元素不会再进行检测。

如果所有元素都满足条件，则返回 true。

### 4.字符串方法

startsWith()：表示参数字符串是否在原字符串的头部，返回布尔值。

endsWith()：表示参数字符串是否在原字符串的尾部，返回布尔值。

repeat()：表示将原字符串重复 n 次，返回一个新字符串。

s.padStart(num,str)：num 表示需要增加的字符串长度，str 为需要增加的字符串。

s.padEnd(num,str)：num 表示需要增加的字符串长度，str 为需要增加的字符串。

如果 s 的长度大于 num 则返回 s 原字符串。如果 num 大于 str 的字符串长度，则会循环添加 str 直到填充长度为 num。

trim()方法会从两端删除空白字符。不影响原串，返回新串。

## ES8

### 1.async await

async 和 await 两种语法结合可以让异步代码像同步代码一样。

#### 1.async 函数

async 函数的返回值为 promise 对象，

promise 对象的结果由 async 函数执行的返回值决定。

返回值不是 Promise 类型的对象，返回的结果是成功 promise 对象

抛出错误，返回的结果是失败的 promise

返回的结果是 promise 对象，取决于 resolve 和 reject 谁来返回

#### 2.await 表达式

1.await 必须写在 async 函数中

2.await 右侧的表达式一般为 promise 对象

3.await 返回的是成功的 promise 值

4.await 的 promise 失败了，会抛出异常，需要通过 try……catch 处理

```javascript
async function mainFun() {
  try {
    let result = await p;
    console.log(result);
  } catch (e) {
    console.log(e);
  }
}

const p = new Promise((resolve, reject) => {
  resolve("error");
});
mainFun();
```

#### 3.发送 ajax 请求

```javascript
function sendAjax(url) {
  return new Promise((resolve, reject) => {
    const x = new XMLHttpRequest();
    x.open("GET", url);
    x.send();
    x.onreadystatechange = () => {
      if (x.readyState === 4) {
        if (x.status >= 200 && x.status <= 300) {
          resolve(x.response);
        } else reject(x.status);
      }
    };
  });
}

async function mainTest() {
  try {
    let result = await sendAjax("https://api.apiopen.top/getJoke");
    console.log(result);
  } catch (e) {
    console.log(e);
  }
}
mainTest();
```

### 2.对象方法扩展

#### Object.keys Object.values

读取所有的键 读取所有的值（Symbol 除外）

#### Object.entries

创建当前对象的键值对数组，每个元素内含有两个子元素，属性名和值。

用于创建 Map 数据结构

#### Object.getOwnPropertyDescriptors()

获取对象属性的描述对象

#### Object.create(proto，[propertiesObject])

第一个参数为原型对象，第二个参数为键值对内容

## ES9

### 1.扩展运算符与 rest 参数

```javascript
function fun(...args) {
  console.log(args);
}
fun(1, 2, 3, 4, 5);
```

同时为对象也提供了像数组一样的扩展运算符

```javascript
let one = {
  name: "wang",
};
let two = {
  age: 20,
};
let three = {
  gender: "male",
};
let four = {
  address: "China",
};
let combine = { ...one, ...two, ...three, ...four };
console.log(combine);
```

### 2.正则命名分组捕获

```javascript
let str = `775244743@qq.com`;
const reg = /(.*)@(.*).(.*)/;
console.log(reg.exec(str));
```

![正则未分组](https://misaka10032.oss-cn-chengdu.aliyuncs.com/Javascript/%E6%AD%A3%E5%88%99%E5%88%86%E7%BB%841)

添加分组名：

在小括号内，最前面添加?<>，尖括号内为分组名字，作为 group 属性的属性名。

```javascript
let str = `775244743@qq.com`;
const reg = /(?<id>.*)@(?<host>.[^.]*).(?<address>.*)/;
console.log(reg.exec(str));
```

![正则分组](https://misaka10032.oss-cn-chengdu.aliyuncs.com/Javascript/%E6%AD%A3%E5%88%99%E5%88%86%E7%BB%842)

### 3.正则反向断言

(?<=\*\*\*)判断字符的前面是否为某字符串

```javascript
let str = `123456abcrth126`;
const reg = /(?<=th)\d*/;
console.log(reg.exec(str));
```

### 4.dotAll 模式

dot：元字符 除换行符以外的任意单个字符

模式修正符 s

```javascript
let obj = `{
    name: "zhangsan",
    age: 18,
    job: "front",
    }`;
const reg = /.*?name: (.*?),.*?age: (.*?),.*?job: (.*?),.*?/s;
console.log(reg.exec(obj));
```

reg 修饰符 s：可以将 . 元字符修正为可匹配换行符的单个字符。

### 5.Object.fromEntries

效果与 Object.entries 相反，接收 n\*2 的二维数组，返回对象。

## ES10

### 1.trimStart trimEnd

指定清除字符串左侧 or 右侧的空白

### 2.flat flatMap

flat

将多维数组转为低维数组 flat() 括号内可传数字，表示为拉平深度

```javascript
const arr = [1, 2, 3, [4, 5], [6, 7, [8, 9]]];
const result = arr.flat(2);
console.log(result);
```

flatMap

如果 map 执行回调后返回的是二维数组，则再执行一次展平操作。

```
const arr = [1, 2, 3, 4];
const result = arr.flatMap(item => [item * 2]);
console.log(result);
```

### 3. Symbol.prototype.description

获取 Symbol 指向的字符串

## ES11

### 1.私有属性

前面带了 `#`的变量

```javascript
class Person {
  name;
  #age;
  #weight;
  constructor(name, age, weight) {
    this.name = name;
    this.#age = age;
    this.#weight = weight;
    this._age = age;
    this._weight = weight;
  }

  get age() {
    return this._age;
  }

  set age(value) {
    this._age = value;
  }

  get weight() {
    return this._weight;
  }

  set weight(value) {
    this._weight = value;
  }
}

const person = new Person("小红", 18, "45kg");
console.log(person.age);
```

### 2.Promise.allSettled

allSettled 括号内传递一个 promise 的数组，不限成功失败，均返回成功。

static relative absloute fixed stick inhertive initial unset

静态 相对 绝对 固定 粘性 继承 初始 无设置

none 不占位

visi 占位

都是隐藏

### 3.Promise.all

all 括号内传递一个 promise 的数组，仅全部 p 对象都成功，才返回成功。

### 4.matchAll 方法

返回符合匹配结果的全局数组，修饰符加了 g，可迭代。

### 5.可选链操作符

可选链操作符（?.），在访问子属性之前，不再需要明确地校验当前属性的状态，再并用短路计算获取最终结果

```javascript
const name = adventurer?.cat?.name;
```

通过使用 ?. 操作符取代 . 操作符，JavaScript 会在尝试访问 adventurer.cat.name 之前，先隐式地检查并确定 adventurer.cat 既不是 null 也不是 undefined 。如果 adventurer.cat 是 null 或者 undefined ，表达式将会短路计算直接返回 undefined。

等价于以下表达式：

```javascript
let temp = adventurer.cat;
let name = temp === null || temp === undefined ? undefined : temp.name;
```

### 6.动态创建 import

import 返回值为 promise 对象，then 方法返回值为 module 对象。

```javascript
const btn = document.querySelector("button");
btn.onclick = () => {
  import("../ES6.js").then(
    (value) => {
      console.log(value);
      value.fun();
    },
    (reason) => {
      console.log(reason);
    }
  );
};
```

### 7. BigInt（第八种数据类型）

在普通整型数字基础上加上小写字母 n

let n = 100n;

大整型转换 BigInt(n)

用于大数值运算。当数值运算超过最大安全整型数值后，需要用 BigInt 进行运算。

```javascript
let max = Number.MAX_SAFE_INTEGER;
console.log(BigInt(max) + BigInt(5));
```

### 8.绝对全局对象 globalThis

全局属性 globalThis 包含全局的 `this` 值，类似于全局对象（global object）。

在以前，从不同的 JavaScript 环境中获取全局对象需要不同的语句。在 Web 中，可以通过 `window`、`self` 或者 `frames` 取到全局对象，但是在 Web Worker 中，只有 `self` 可以。在 Node.js 中，它们都无法获取，必须使用 `global`。

`globalThis` 提供了一个标准的方式来获取不同环境下的全局 `this` 对象（也就是全局对象自身）。不像 `window` 或者 `self` 这些属性，它确保可以在有无窗口的各种环境下正常工作。所以，你可以安心的使用 `globalThis`，不必担心它的运行环境。为便于记忆，你只需要记住，全局作用域中的 `this` 就是 `globalThis`。
