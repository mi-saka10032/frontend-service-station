---
title: 基本类型
order: 4
tag:
  - Dart基本类型
---

Dart 支持以下数据类型：

- 数字（int double）
- 字符串 String
- 布尔值 bool
- 记录 Records
- 列表 Lists
- 集合 Sets
- 映射表 Maps
- 特殊符号 Runes
- 象征 Symbol
- 空值 null

这一章只记录基本类型

## num

Dart 的数字类型有两种：int 和 double

int 的整数值不大于 64 位，值的范围可以是 -2^63 到 2^63 - 1。在 Web 上，整数值表示为 JavaScript 数字（没有小数部分的 64 位浮点值），并且可以是从 -2^53 到 2^53 - 1。

double 是 64 位的双精度浮点数。

int 和 double 都是 num 的子类型。

### 类型转换

```dart
// String -> int
var one = int.parse('1');
assert(one == 1);

// String -> double
var onePointOne = double.parse('1.1');
assert(onePointOne == 1.1);

// int -> String
String oneAsString = 1.toString();
assert(oneAsString == '1');

// double -> String
String piAsString = 3.14159.toStringAsFixed(2);
assert(piAsString == '3.14');
```

### 位运算

```dart
assert((3 << 1) == 6); // 0011 << 1 == 0110
assert((3 | 4) == 7); // 0011 | 0100 == 0111
assert((3 & 4) == 0); // 0011 & 0100 == 0000
```

## String

字符串使用单引号和双引号均可

```dart
var s1 = 'Single quotes work well for string literals.';
var s2 = "Double quotes work just as well.";
var s3 = 'It\'s easy to escape the string delimiter.';
var s4 = "It's even easier to use the other delimiter.";
```

字符串支持`${}`插值语法

```dart
var s = 'string interpolation';

assert('Dart has $s, which is very handy.' ==
    'Dart has string interpolation, '
        'which is very handy.');
assert('That deserves all caps. '
        '${s.toUpperCase()} is very handy!' ==
    'That deserves all caps. '
        'STRING INTERPOLATION is very handy!');
```

也可以直接操作相邻字符串拼接或使用"+"连接

```dart
var s1 = 'String '
    'concatenation'
    " works even over line breaks.";
assert(s1 ==
    'String concatenation works even over '
        'line breaks.');

var s2 = 'The + operator ' + 'works, as well.';
assert(s2 == 'The + operator works, as well.');
```

创建可换行字符串，使用三引号

```dart
var s1 = '''
You can create
multi-line strings like this one.
''';

var s2 = """This is also a
multi-line string.""";
```

注意组合的字符串常量必须全部由常量组成

```dart
void main() {
// These work in a const string.
  const aConstNum = 0;
  const aConstBool = true;
  const aConstString = 'a constant string';

// These do NOT work in a const string.
  int aNum = 0;
  bool aBool = true;
  String aString = 'a string';
  List aConstList = [1, 2, 3];

  const validConstString = '$aConstNum $aConstBool $aConstString';
  // const invalidConstString = '$aNum $aBool $aString $aConstList'; ×
  // String validConstString2 = '$aNum $aBool $aString $aConstList'; √
}
```

## bool

Dart 的布尔值判断不存在 JS 的隐式转换

```dart
// Check for an empty string.
var fullName = '';
assert(fullName.isEmpty);

// Check for zero.
var hitPoints = 0;
assert(hitPoints <= 0);

// Check for null.
var unicorn = null;
assert(unicorn == null);

// Check for NaN.
var iMeantToDoThis = 0 / 0;
assert(iMeantToDoThis.isNaN);
```

## Runes

要使用特殊的如 emoji 等 Unicode 字符，需导入 dart 的 character 库

```dart
import 'package:characters/characters.dart';

void main() {
  var hi = 'Hi 🇩🇰';
  print(hi);
  print('The end of the string: ${hi.substring(hi.length - 1)}');
  print('The last character: ${hi.characters.last}');
}
```

输出参考

```bash
$ dart run bin/main.dart
Hi 🇩🇰
The end of the string: ???
The last character: 🇩🇰
```

## Symbol

Symbol 含义及用法与 JS 相同。

```dart
var sym = new Symbol('tom');

print(sym); // Symbol('tom')
```
