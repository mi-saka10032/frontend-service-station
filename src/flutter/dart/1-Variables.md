---
title: 变量
order: 1
tag:
  - Dart变量
  - 空值安全
  - 变量懒加载
---

## 变量类型关键字

### var

在使用变量之前必须先声明变量。Dart 使用 `var` 关键字来标识一个变量。声明变量的语法如下所示

```dart
var name = 'Tom';
```

1. `var`标记的变量会在赋予初始值之后确定类型，上面的 name 就会明确为 String 类型。
2. Dart 中的所有变量都存储对值的引用，而不是包含该值。name 变量包含对 String 对象的引用，其值为`Tom`。
3. Dart 通过在变量名前加上数据类型前缀来支持类型检查。类型检查确保变量仅包含特定于数据类型的数据。下面给出了相同的语法。

```dart
Object age = 20;
String name = 'Maxsu';
int number = 99;
```

以下示例会警告，因为分配给变量的值与变量的数据类型不匹配

```dart
void main() {
  String name = 1;
}
```

```shell
Warning: A value of type 'String' cannot be assigned to a variable of type 'int'
```

### dynamic

`dynamic` 是用来声明动态类型的变量。这意味着变量的类型可以在运行时动态地改变。

```dart
dynamic value = 'Tom'; // value 的类型为 String
value = 123; // 现在 value 的类型为 int
```

### 区别

```dart
var name = 'Tom'; // 推断出 name 的类型为 String
dynamic name1 = 'Tom'; // 推断出 name1 的动态类型为 String
String name2 = 'Tom'; // 显式声明 name2 的类型为 String
```

在这种情况下，var 和 dynamic 的行为是相同的。但是，使用 var 时，变量的类型会被推断出来，并且不能再改变；而使用 dynamic 时，变量的类型可以在运行时动态地改变。

## 空值安全

Dart 的空值安全有三个特点：

1.使用?添加在类型声明末尾表示该变量允许为 null；dynamic 关键字也可做到这点

```dart
String? name;  // Nullable type. Can be `null` or string.

dynamic name;  // Nullable type. dynamic type or `null`.

String name;   // Non-nullable type. Cannot be `null` but can be string.
```

2.使用变量之前必须进行初始化

3.无法访问具有可为 null 类型的表达式的属性或调用方法。例外，null 支持`hashCode`、`toString()`这些 Object 顶层方法。

## 常量类型关键字

### final

final 是运行时常量。final 声明的 object 栈不可被修改，但是可以理解为堆的内容可修改

```dart
final name = 'Tom';
name = 'Jerry'; // Error: Can't assign to the final variable 'name'.
```

```dart
final arr = [1, 2, 3];
arr[0] = 10;  // √
```

### const

const 是编译时常量。const 声明的 object 栈和堆均不可被修改

```dart
final name = 'Tom';
name = 'Jerry'; // Error: Can't assign to the final variable 'name'.
```

```dart
final arr = [1, 2, 3];
arr[0] = 10;  // Unhandled exception: Unsupported operation: Cannot modify an unmodifiable list
```

## `late`关键字

late 关键字修饰的变量有两个特点：

1. 声明变量不允许为 null，但是初始化时可以不赋初值。
2. 可以在运行时调用变量赋值。

```dart
late String description;

void main() {
  description = 'Feijoada!';
  print(description);
}
```

late 的主要作用是避免无用变量初始化带来的额外开销。

```dart
// This is the program's only call to readThermometer().
late String temperature = readThermometer(); // Lazily initialized.
```
