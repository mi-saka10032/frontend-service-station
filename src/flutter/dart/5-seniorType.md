---
title: 高级类型
order: 5
tag:
  - Dart高级类型
---

## Collections

### Lists

Lists 即常规意义上的数组类型。默认`List<int>`类型。

注意，由于类型推断的存在，Lists 允许集合内存在多种不同基础类型的元素对象，但应尽量保持类型唯一性。

```dart
void main() {
  var list = [
    'Car',
    'Boat',
    123
  ];
  list.removeLast();
  list.add("Train");
  list.removeAt(0);
  print(list);
}
```

### Sets

Sets 即常规意义上的非重复值集合类型。默认`Set<String>`类型。

```dart
var names = <String>{};
// Set<String> names = {}; // This works, too.
// var names = {}; // Creates a map, not a set.
```

```dart
void main() {
  Set names = {"a", "b", "c"};
  names.remove("k");
  names.remove("b");
  names.add("b");
  print(names);
}
```

```dart
var elements = <String>{};
elements.add('fluorine');
elements.addAll(halogens);
assert(elements.length == 5);
```

### Maps

Maps 即常规以上的 K-V 集合。默认`Map<String, String>`类型。

```dart
var gifts = {
  // Key:    Value
  'first': 'partridge',
  'second': 'turtledoves',
  'fifth': 'golden rings'
};

var nobleGases = {
  2: 'helium',
  10: 'neon',
  18: 'argon',
};
```

### 解构

Dart 提供类似 JavaScript 中 ES6 的解构语法，但是更强大、更灵活，也包含灵活的条件判断。

List 解构：

```dart
var list = [1, 2, 3];
var list2 = [0, ...list];
assert(list2.length == 4);

var list2 = [0, ...?list];
assert(list2.length == 1);
```

```dart
var nav = ['Home', 'Furniture', 'Plants', if (promoActive) 'Outlet'];
```

Map 解构（条件判断）：

```dart
void main() {
  String login = 'Manager';
  var nav = [
    'Home',
    'Furniture',
    'Plants',
    if (login case 'Manager') 'Inventory'
  ];
  var obj = {
    "name": 'tom',
    if (login case 'Manager') 'age': 18
  };
  print(nav);
  print(obj);
}
```

## 泛型

泛型的使用情况与范围和 TypeScript 的泛型一样。

## 类型定义

类型定义的使用情况与范围和 TypeScript 的 type 一样，但 TS 的 type 类型更加灵活。

```dart
typedef ListMapper<X> = Map<X, List<X>>;
Map<String, List<String>> m1 = {}; // Verbose.
ListMapper<String> m2 = {}; // Same thing but shorter and clearer.
```

## 枚举

这里只记录简单枚举，增强枚举比较复杂暂时不写。

```dart
enum Color { red, green, blue }
```

枚举值可以像静态变量一样直接访问

```dart
final favoriteColor = Color.blue;
if (favoriteColor == Color.blue) {
  print('Your favorite color is blue!');
}
```

枚举值默认从 0 开始

```dart
assert(Color.red.index == 0);
assert(Color.green.index == 1);
assert(Color.blue.index == 2);
```

values：获取枚举值列表

```dart
List<Color> colors = Color.values;
assert(colors[2] == Color.blue);
```

name：获取枚举名称

```dart
print(Color.blue.name); // 'blue'
```
