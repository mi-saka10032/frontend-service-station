---
title: 库和导入
order: 3
tag:
  - Dart库
  - 导入方式
---

以下划线(`_`)开头的标识符表示仅在库内部可见。每个 Dart 文件都是一个库。

## 使用库

使用 import 导入 dart 其他库的命名空间

```dart
import 'dart:html';
```

对于第三方库可以使用文件系统路径或 package 方案

```dart
import 'package:test/test.dart';
```

### 指定库前缀

如果导入两个具有冲突标识符的库，则可以为一个或两个库指定前缀。例如，如果 library1 和 library2 都有一个 Element 类：

```dart
import 'package:lib1/lib1.dart';
import 'package:lib2/lib2.dart' as lib2;

// Uses Element from lib1.
Element element1 = Element();

// Uses Element from lib2.
lib2.Element element2 = lib2.Element();
```

### 部分导入

```dart
// Import only foo.
import 'package:lib1/lib1.dart' show foo;

// Import all names EXCEPT foo.
import 'package:lib2/lib2.dart' hide foo;
```

### 懒加载

```dart
import 'package:greetings/hello.dart' deferred as hello;

Future<void> greet() async {
  await hello.loadLibrary();
  hello.printGreeting();
}
```
