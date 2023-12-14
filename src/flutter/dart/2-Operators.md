---
title: 操作符
order: 2
tag:
  - Dart操作符
  - 特殊运算符
---

## 提前声明

Dart 的操作运算符与 Java、JavaScript 非常接近，个人理解有两点需注意：

1. Dart 和 JavaScript 的相等运算不同，只有`==`判断，因为 Dart 中万物皆对象，这一点与 Java 相同。
2. Dart 的可选链操作符与 JavaScript 的 ES6+语法类似，一定程度上增加了语法灵活度。

主要记录类型操作符和级联操作符。

## 类型操作符

| 操作符 | 含义                              |
| :----- | :-------------------------------- |
| `as`   | 类型转换                          |
| `is`   | 如果对象具有指定类型，则为 True   |
| `is!`  | 如果对象没有指定的类型，则为 True |

`as`近似于 TypeScript 的类型判断操作符。

`is`近似于`instanceof`。

## 级联操作符

级联操作符允许对同一对象进行一系列链式操作。

```dart
var paint = Paint()
  ..color = Colors.black
  ..strokeCap = StrokeCap.round
  ..strokeWidth = 5.0;
```

等同于

```dart
var paint = Paint();
paint.color = Colors.black;
paint.strokeCap = StrokeCap.round;
paint.strokeWidth = 5.0;
```

---

```dart
querySelector('#confirm') // Get an object.
  ?..text = 'Confirm' // Use its members.
  ..classes.add('important')
  ..onClick.listen((e) => window.alert('Confirmed!'))
  ..scrollIntoView();
```

等同于

```dart
var button = querySelector('#confirm');
button?.text = 'Confirm';
button?.classes.add('important');
button?.onClick.listen((e) => window.alert('Confirmed!'));
button?.scrollIntoView();
```

在级联操作时需要注意返回实际对象的操作方法，可能导致链式操作失败。

```dart
var sb = StringBuffer();
sb.write('foo')
  ..write('bar'); // Error: method 'write' isn't defined for 'void'.
```

## 其他操作符

其他操作符统计：

| 操作符 | 名称         | 含义                                                                                                                                                                  |
| :----- | :----------- | :-------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `()`   | 函数应用     | 代表一个函数调用                                                                                                                                                      |
| `[]`   | 下标访问     | 表示对可重写运算符的调用`[]`；示例：`fooList[1]`传递 int1 来 fooList 访问索引处的元素 1                                                                               |
| `?[]`  | 条件下表访问 | 与 类似`[]`，但最左边的操作数可以为 null；示例：`fooList?[1]`传递 int1 来 fooList 访问索引处的元素 1，除非 fooList 为 null（在这种情况下表达式的计算结果为 null）     |
| `.`    | 成员访问     | 指的是表达式的属性；示例： `foo.bar` 从表达式 foo 中选择属性 bar                                                                                                      |
| `?.`   | 条件成员访问 | 与`.`类似，但最左边的操作数可以为空；示例： `foo?.bar` 从表达式 foo 中选择属性 bar，除非 foo 为 null（在这种情况下，`foo?.bar` 的值为 null）                          |
| `!`    | 空断言运算符 | 将表达式转换为其基础的不可空类型，如果转换失败，则抛出运行时异常；示例： `foo!.bar` 断言 foo 为非 null 并选择属性 bar，除非 foo 为 null，在这种情况下会引发运行时异常 |
