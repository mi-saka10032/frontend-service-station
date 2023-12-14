---
title: 类
order: 6
tag:
  - Dart类
---

## 构造函数

```dart
class Point {
  double x = 0;
  double y = 0;

  Point(double x, double y) {
    // See initializing formal parameters for a better way
    // to initialize instance variables.
    this.x = x;
    this.y = y;
  }
}
```

```dart
class Point {
  final double x;
  final double y;

  // Sets the x and y instance variables
  // before the constructor body runs.
  Point(this.x, this.y);
}
```

1. 如果您不声明构造函数，则会为您提供默认构造函数。默认构造函数没有参数，并调用超类中的无参数构造函数；
2. 子类不会从其超类继承构造函数。未声明构造函数的子类仅具有默认（无参数、无名称）构造函数。

### 命名构造函数

```dart
const double xOrigin = 0;
const double yOrigin = 0;

class Point {
  final double x;
  final double y;

  Point(this.x, this.y);

  // Named constructor
  Point.origin()
      : x = xOrigin,
        y = yOrigin;
}

void main() {
  Point p = Point.origin();
  print(p.x); //
}
```

### 调用非默认超类构造函数

调用顺序如下：

1. 初始化列表
2. 调用超类构造器
3. 调用主类构造器

```dart
class Person {
  String? firstName;

  Person.fromJson(Map data) {
    print('in Person');
  }
}

class Employee extends Person {
  // Person does not have a default constructor;
  // you must call super.fromJson().
  Employee.fromJson(super.data) : super.fromJson() {
    print('in Employee');
  }
}

void main() {
  var employee = Employee.fromJson({});
  print(employee);
  // Prints:
  // in Person
  // in Employee
  // Instance of 'Employee'
}
```

因为超类构造函数的参数是在调用构造函数之前计算的，所以参数可以是表达式，例如函数调用：

```dart
class Employee extends Person {
  Employee() : super.fromJson(fetchDefaultData());
  // ···
}
```

### 重定向构造函数

```dart
class Point {
  double x, y;

  // The main constructor for this class.
  Point(this.x, this.y);

  // Delegates to the main constructor.
  Point.alongXAxis(double x) : this(x, 0);
}
```

### 常量构造函数

常量构造一般用 static const 修饰

```dart
class ImmutablePoint {
  static const ImmutablePoint origin = ImmutablePoint(0, 0);

  final double x, y;

  const ImmutablePoint(this.x, this.y);
}
```

### 工厂构造器

工厂构造函数可能会从缓存返回一个实例，也可能会返回一个子类型的实例。工厂构造函数的另一个用例是使用初始化程序列表中无法处理的逻辑来初始化最终变量。

```dart
class Logger {
  final String name;
  bool mute = false;

  // _cache is library-private, thanks to
  // the _ in front of its name.
  static final Map<String, Logger> _cache = <String, Logger>{};

  factory Logger(String name) {
    return _cache.putIfAbsent(name, () => Logger._internal(name));
  }

  factory Logger.fromJson(Map<String, Object> json) {
    return Logger(json['name'].toString());
  }

  Logger._internal(this.name);

  void log(String msg) {
    if (!mute) print(msg);
  }
```

**注意：**工厂构造函数不能访问 this

调用

```dart
var logger = Logger('UI');
logger.log('Button clicked');

var logMap = {'name': 'UI'};
var loggerJson = Logger.fromJson(logMap);
```

## 成员方法

### 实例方法

实例方法的实现是和其他语言相同的

```dart
import 'dart:math';

class Point {
  final double x;
  final double y;

  Point(this.x, this.y);

  double distanceTo(Point other) {
    var dx = x - other.x;
    var dy = y - other.y;
    return sqrt(dx * dx + dy * dy);
  }
}
```

### 运算符

含有特殊名称的实例方法

![Class实例运算符](https://misaka10032.oss-cn-chengdu.aliyuncs.com/Dart/dart-class_operator.png)

以下是一个实例运算符的例子

```dart
class Vector {
  final int x, y;

  Vector(this.x, this.y);

  Vector operator +(Vector v) => Vector(x + v.x, y + v.y);
  Vector operator -(Vector v) => Vector(x - v.x, y - v.y);

  @override
  bool operator ==(Object other) =>
      other is Vector && x == other.x && y == other.y;

  @override
  int get hashCode => Object.hash(x, y);
}

void main() {
  final v = Vector(2, 3);
  final w = Vector(2, 2);

  assert(v + w == Vector(4, 5));
  assert(v - w == Vector(0, 1));
}
```

### Getters&Setters

OOP 语言常规的实例方法

```dart
class Rectangle {
  double left, top, width, height;

  Rectangle(this.left, this.top, this.width, this.height);

  // Define two calculated properties: right and bottom.
  double get right => left + width;
  set right(double value) => left = value - width;
  double get bottom => top + height;
  set bottom(double value) => top = value - height;
}

void main() {
  var rect = Rectangle(3, 4, 20, 15);
  assert(rect.left == 3);
  rect.right = 12;
  assert(rect.left == -8);
}
```

### 抽象方法

Dart 的抽象方法只能存在于抽象类或 mixin 中

```dart
abstract class Doer {
  // Define instance variables and methods...

  void doSomething(); // Define an abstract method.
}

class EffectiveDoer extends Doer {
  void doSomething() {
    // Provide an implementation, so the method is not abstract here...
  }
}
```

## 继承

继承用法基本相同

```dart
class Television {
  void turnOn() {
    _illuminateDisplay();
    _activateIrSensor();
  }
  // ···
}

class SmartTelevision extends Television {
  void turnOn() {
    super.turnOn();
    _bootNetworkInterface();
    _initializeMemory();
    _upgradeApps();
  }
  // ···
}
```

### 重写

子类可以重写实例方法（包括运算符）、getter 和 setter。使用`@override`注释来表明覆盖父类成员

```dart
class Television {
  // ···
  set contrast(int value) {...}
}

class SmartTelevision extends Television {
  @override
  set contrast(num value) {...}
  // ···
}
```

重写方法声明具有以下规则：

- 返回类型必须与重写方法的返回类型相同（或其子类型）。
- 参数类型必须与重写方法的参数类型相同（或其超类型）。
- 如果重写的方法接受 N 个位置参数，则重写方法也必须接受 N 个位置参数。
- 泛型方法不能覆盖非泛型方法，非泛型方法也不能覆盖泛型方法。

### noSuchMethod

noSuchMethod 方法通常用于检测实例成员是否存在，该方法也支持重写

```dart
class A {
  // Unless you override noSuchMethod, using a
  // non-existent member results in a NoSuchMethodError.
  @override
  void noSuchMethod(Invocation invocation) {
    print('You tried to use a non-existent member: '
        '${invocation.memberName}');
  }
}
```

除非满足以下条件之一，否则无法调用未实现的方法：

- 接收者具有静态类型 dynamic。
- noSuchMethod 接收者有一个静态类型，定义了未实现的方法，接收者的动态类型有一个与 class 中不同的实现。

## Mixin

Mixin 旨在向多个同层级兄弟 class 提供可复用的代码方法，集体提供成员实现。

通过使用 on 关键字，来指定超类限制 mixin 的实现。

```dart
mixin Musical {
  bool canPlayPiano = false;
  bool canCompose = false;
  bool canConduct = false;

  void entertainMe() {
    if (canPlayPiano) {
      print('Playing piano');
    } else if (canConduct) {
      print('Waving hands');
    } else {
      print('Humming to self');
    }
  }
}

class Musician {
  // ...
}
mixin MusicalPerformer on Musician {
  // ...
}
class SingerDancer extends Musician with MusicalPerformer {
  // ...
}
```

### 抽象混入

abstract 可以和 mixin 同时使用

```dart
abstract mixin class Musician {
  // No 'on' clause, but an abstract method that other types must define if
  // they want to use (mix in or extend) Musician:
  void playInstrument(String instrumentName);

  void playPiano() {
    playInstrument('Piano');
  }
  void playFlute() {
    playInstrument('Flute');
  }
}

class Virtuoso with Musician { // Use Musician as a mixin
  void playInstrument(String instrumentName) {
    print('Plays the $instrumentName beautifully');
  }
}

class Novice extends Musician { // Use Musician as a class
  void playInstrument(String instrumentName) {
    print('Plays the $instrumentName poorly');
  }
}
```

## 修饰符

类修饰符控制类或 mixin 的使用方式，既可以 在其自己的库内使用，也可以在定义它的库外部使用。

修饰符关键字位于类或 mixin 声明之前。例如，编写 abstract class 定义一个抽象类。可以出现在类声明之前的完整修饰符集包括：

- abstract
- base
- final
- interface
- sealed
- mixin

只有 base 修饰符可以出现在 mixin 声明之前。这些修饰符不适用于其他声明，例如 enum、typedef 或 extension。

在决定是否使用类修饰符时，请考虑类的预期用途以及类需要能够依赖的行为。

### abstract

要定义不需要完整、具体实现其整个接口的类，请使用修饰符 abstract。

抽象类不能从任何库构造，无论是它自己的库还是外部库。抽象类通常具有抽象方法。

```dart
// Library a.dart
abstract class Vehicle {
  void moveForward(int meters);
}
```

```dart
// Library b.dart
import 'a.dart';

// Error: Cannot be constructed
Vehicle myVehicle = Vehicle();

// Can be extended
class Car extends Vehicle {
  int passengers = 4;
  // ···
}

// Can be implemented
class MockVehicle implements Vehicle {
  @override
  void moveForward(int meters) {
    // ...
  }
}
```

### base

要强制继承类或 mixin 的实现，请使用 base 修饰符。基类不允许在其自己的库之外实现。这保证：

- 每当创建该类的子类型的实例时，都会调用基类构造函数。
- 所有实现的私有成员都存在于子类型中。
- 类中新实现的成员 base 不会破坏子类型，因为所有子类型都会继承新成员。
  - 除非子类型已经声明了具有相同名称和不兼容签名的成员，否则这是正确的。

您必须将实现或扩展基类的任何类标记为 base、final 或 sealed。这可以防止外部库破坏基类保证。

```dart
// Library a.dart
base class Vehicle {
  void moveForward(int meters) {
    // ...
  }
}
```

```dart
// Library b.dart
import 'a.dart';

// Can be constructed
Vehicle myVehicle = Vehicle();

// Can be extended
base class Car extends Vehicle {
  int passengers = 4;
  // ...
}

// ERROR: Cannot be implemented
base class MockVehicle implements Vehicle {
  @override
  void moveForward() {
    // ...
  }
}
```

### interface

要定义接口，请使用修饰符 interface。接口自己的定义库之外的库可以实现该接口，但不能扩展它。这保证：

- 当类的实例方法之一调用 上的另一个实例方法时 this，它将始终调用同一库中该方法的已知实现。
- 其他库无法重写接口类自己的方法稍后可能以意外方式调用的方法。这减少了基类脆弱的问题。

```dart
// Library a.dart
interface class Vehicle {
  void moveForward(int meters) {
    // ...
  }
}
```

```dart
// Library b.dart
import 'a.dart';

// Can be constructed
Vehicle myVehicle = Vehicle();

// ERROR: Cannot be inherited
class Car extends Vehicle {
  int passengers = 4;
  // ...
}

// Can be implemented
class MockVehicle implements Vehicle {
  @override
  void moveForward(int meters) {
    // ...
  }
}
```

### abstract interface

修饰符最常见的用途 interface 是定义纯接口。 将和修饰符组合起来 形成 abstract interface class

类似 interface，其他库可以实现但不能继承抽象接口。

类似 abstract，纯接口可以具有抽象成员。

### final