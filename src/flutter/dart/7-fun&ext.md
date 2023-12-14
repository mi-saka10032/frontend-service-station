---
title: 函数与扩展
order: 7
tag:
  - Dart函数
  - 扩展方法
  - 可调用对象
---

## 函数

Dart 的函数作为对象，具有 Function 类型

```dart
bool isNoble(int atomicNumber) {
  return _nobleGases[atomicNumber] != null;
}
```

函数的类型可以省略

```dart
isNoble(atomicNumber) {
  return _nobleGases[atomicNumber] != null;
}
```

Dart 支持箭头函数，注意：箭头函数的输出只能是表达式（可以是三元表达式）而不是语句。所以箭头函数在 Dart 中是作为“仅包含一个表达式的函数”的语法糖。

```dart
bool isNoble(int atomicNumber) => _nobleGases[atomicNumber] != null;
```

该语法是 的简写 。该表示法有时称为箭头语法。`=> expr{ return expr; }=>`

### 参数

函数普通形参声明方式和其他语言没有差异，这里存在两种差异参数

1.命名参数

命名参数类似于 TS 中的对象传参，但存在更全面的参数约束

```dart
bool test({required int key, String? msg, String pr = 'test'}) {
  late var res;
  if (key > 10) {
    res = true;
  } else {
    res = false;
  }
  print(msg);
  print(pr);
  return res;
}

void main() {
  const int hahaha = 20;
  bool res = test(key: hahaha);
  print(res);
}
```

首先，命名参数要求：

- 函数声明时以`{}`包裹，每个参数都是默认可选为 null 的，也就是常规必须以`int? key`的形式来声明
- 增加了 required 关键字的命名参数，在调用时是必填的，不填会报错
- 命名参数也支持以`int key = 常量`的形式来声明，表示在调用时不赋值情况下函数提供的默认值，注意该常量必须和类型声明相同，不同会报错

函数调用时：使用`test(key: 10, msg: 'test')`的格式进行调用，和 TS 中对象传参调用函数的格式略微不同，但都同样严格要求参数命名相同、类型相同

2.可选位置参数

将一组函数参数使用`[]`包裹，将它们标记为可选位置参数。如果您不提供默认值，则它们的类型必须可为空，因为它们的默认值将是 null。

```dart
String say(String from, String msg, [String? device]) {
  var result = '$from says $msg';
  if (device != null) {
    result = '$result with a $device';
  }
  return result;
}
assert(say('Bob', 'Howdy') == 'Bob says Howdy');
```

### main

每个应用程序都必须有一个顶级`main()`函数，作为应用程序的入口点。该`main()`函数返回 void 并有一个可选`List<String>`参数作为参数。

```dart
// Run the app like this: dart args.dart 1 test
void main(List<String> arguments) {
  print(arguments);

  assert(arguments.length == 2);
  assert(int.parse(arguments[0]) == 1);
  assert(arguments[1] == 'test');
}
```

### 匿名函数

匿名函数也称为 lambda 或闭包。下面的 map 函数和 forEach 函数都是匿名函数。

```dart
const list = ['apples', 'bananas', 'oranges'];
list.map((item) {
  return item.toUpperCase();
}).forEach((item) {
  print('$item: ${item.length}');
});
```

如果函数仅包含单个表达式或返回语句，可以使用箭头表示法缩短它

```dart
list
    .map((item) => item.toUpperCase())
    .forEach((item) => print('$item: ${item.length}'));
```

### 作用域

Dart 是一种词法作用域语言，这意味着变量的作用域是静态确定的，只需通过代码的布局即可。您可以“沿着大括号向外”来查看变量是否在范围内。

```dart
bool topLevel = true;

void main() {
  var insideMain = true;

  void myFunction() {
    var insideFunction = true;

    void nestedFunction() {
      var insideNestedFunction = true;

      assert(topLevel);
      assert(insideMain);
      assert(insideFunction);
      assert(insideNestedFunction);
    }
  }
}
```

### 函数相等性

下面的四个判断，测试顶级函数、静态方法和实例方法是否相同，结果都为 true

```dart
void foo() {} // A top-level function

class A {
  static void bar() {} // A static method
  void baz() {} // An instance method
}

void main() {
  Function x;

  // Comparing top-level functions.
  x = foo;
  print(foo == x);

  // Comparing static methods.
  x = A.bar;
  print(A.bar == x);

  // Comparing instance methods.
  var v = A(); // Instance #1 of A
  var w = A(); // Instance #2 of A
  var y = w;
  x = w.baz;

  // These closures refer to the same instance (#2),
  // so they're equal.
  print(y.baz == x);

  // These closures refer to different instances,
  // so they're unequal.
  print(v.baz != w.baz);
}
```

### 返回值

所有函数都会返回值，如果未指定返回值，则隐式`return null`

```dart
foo() {}

assert(foo() == null);
```

### 生成器

Dart 内置支持两种生成器函数：

1. 同步生成器：返回一个 Iterable 对象
2. 异步生成器：返回一个 Stream 对象

要实现同步生成器函数，请将函数体标记为 `sync*`，并使用 yield 语句传递值（类似 TS 语法）：

```dart
Iterable<int> naturalsTo(int n) sync* {
  int k = 0;
  while (k < n) yield k++;
}
```

要实现异步生成器函数，请将函数体标记为 `async*`，并使用 yield 语句传递值：

```dart
Stream<int> asynchronousNaturalsTo(int n) async* {
  int k = 0;
  while (k < n) yield k++;
}
```

递归生成器可以通过以下方法来提高性能

```dart
Iterable<int> naturalsDownFrom(int n) sync* {
  if (n > 0) {
    yield n;
    yield* naturalsDownFrom(n - 1);
  }
}
```

## 扩展

函数扩展某种意义上算是对已有库或实体类的方法扩充。

项目中使用时，扩展实现编写在 lib 目录中。

```dart
extension Parsing on String {
  int parseInt() {
    return int.parse(this);
  }
}

void main() {
  String v = '2';
  print(v.parseInt());
}
```

### 静态类型限制

动态类型变量不能调用扩展方法

```dart
dynamic d = '2';
print(d.parseInt()); // Runtime exception: NoSuchMethodError
```

扩展方法确实可以与 Dart 的类型推断配合使用。以下代码很好，因为该变量 v 被推断为具有类型 String

```dart
var v = '2';
print(v.parseInt()); // Output: 2
```

### API 冲突

如果扩展成员与接口或另一个扩展成员冲突，有两种选择：

一是更改导入冲突扩展的方式，使用 show 或 hide 限制

```dart
// Defines the String extension method parseInt().
import 'string_apis.dart';

// Also defines parseInt(), but hiding NumberParsing2
// hides that extension method.
import 'string_apis_2.dart' hide NumberParsing2;

// ···
// Uses the parseInt() defined in 'string_apis.dart'.
print('42'.parseInt());
```

二是显式应用扩展，这回导致代码看起来像是包装类

```dart
// Both libraries define extensions on String that contain parseInt(),
// and the extensions have different names.
import 'string_apis.dart'; // Contains NumberParsing extension.
import 'string_apis_2.dart'; // Contains NumberParsing2 extension.

// ···
// print('42'.parseInt()); // Doesn't work.
print(NumberParsing('42').parseInt());
print(NumberParsing2('42').parseInt());
```

扩展名相同情况下，还需要前缀导入

```dart
// Both libraries define extensions named NumberParsing
// that contain the extension method parseInt(). One NumberParsing
// extension (in 'string_apis_3.dart') also defines parseNum().
import 'string_apis.dart';
import 'string_apis_3.dart' as rad;

// ···
// print('42'.parseInt()); // Doesn't work.

// Use the ParseNumbers extension from string_apis.dart.
print(NumberParsing('42').parseInt());

// Use the ParseNumbers extension from string_apis_3.dart.
print(rad.NumberParsing('42').parseInt());

// Only string_apis_3.dart has parseNum().
print('42'.parseNum());
```

### 匿名扩展

声明扩展时，可以省略名称。未命名的扩展仅在声明它们的库中可见。由于它们没有名称，因此无法显式应用它们来解决 API 冲突。

```dart
extension on String {
  bool get isBlank => trim().isEmpty;
}
```

### 泛型扩展

扩展可以具有泛型类型参数

```dart
extension MyFancyList<T> on List<T> {
  int get doubleLength => length * 2;
  List<T> operator -() => reversed.toList();
  List<List<T>> split(int at) => [sublist(0, at), sublist(at)];
}
```

## 可调用对象

要允许像函数一样调用 Dart 类的实例，请实现该`call()`方法。

该`call()`方法允许定义它的任何类的实例来模拟函数。此方法支持与普通函数相同的功能， 例如参数和返回类型。

在下面的示例中，该类 WannabeFunction 定义了一个`call()`函数，该函数接受三个字符串并将它们连接起来，用空格分隔每个字符串，并附加一个感叹号。

```dart
class WannabeFunction {
  String call(String a, String b, String c) => '$a $b $c!';
}

var wf = WannabeFunction();
var out = wf('Hi', 'there,', 'gang');

void main() => print(out);
```
