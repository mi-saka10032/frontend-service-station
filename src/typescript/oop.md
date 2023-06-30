---
title: 面向对象
order: 2

tag:
  - 面向对象
  - 类、接口
  - 泛型
---

## 类(Class)

要想面向对象，操作对象，首先便要拥有对象，那么下一个问题就是如何创建对象。要创建对象，必须要先定义类，所谓的类可以理解为对象的模型，程序中可以根据类创建指定类型的对象，举例来说：可以通过 Person 类来创建人的对象，通过 Dog 类创建狗的对象，通过 Car 类来创建汽车的对象，不同的类可以用来创建不同的对象。

定义类：

```ts
class 类名 {
  属性名: 类型;

  constructor(参数: 类型){
    this.属性名 = 参数;
  }

  方法名(){
    ....
  }

}
```

示例：

```ts
class Person {
  name: string;
  age: number;

  constructor(name: string, age: number) {
    this.name = name;
    this.age = age;
  }

  sayHello() {
    console.log(`大家好，我是${this.name}`);
  }
}
```

使用类：

```ts
const p = new Person("孙悟空", 18);
p.sayHello();
```

## 面向对象特点

面向对象三大特点：封装、继承、多态，之所以在 TS 记录，是因为 JS 的面向对象语法不如 TS 精确，针对特点的使用也较少。

### 封装

对象实质上就是属性和方法的容器，它的主要作用就是存储属性和方法，这就是所谓的封装

默认情况下，对象的属性是可以任意的修改的，为了确保数据的安全性，在 TS 中可以对属性的权限进行设置

#### 只读属性(readonly)

如果在声明属性时添加一个 readonly，则属性便成了只读属性无法修改

#### 修饰符

TS 中属性具有三种修饰符：

- public（默认值），可以在类、子类和对象中修改
- protected ，可以在类、子类中修改
- private ，可以在类中修改

示例：

public

```ts
class Person {
  public name: string; // 写或什么都不写都是public
  public age: number;

  constructor(name: string, age: number) {
    this.name = name; // 可以在类中修改
    this.age = age;
  }

  sayHello() {
    console.log(`大家好，我是${this.name}`);
  }
}

class Employee extends Person {
  constructor(name: string, age: number) {
    super(name, age);
    this.name = name; //子类中可以修改
  }
}

const p = new Person("孙悟空", 18);
p.name = "猪八戒"; // 可以通过对象修改
```

protected

```ts
class Person {
  protected name: string;
  protected age: number;

  constructor(name: string, age: number) {
    this.name = name; // 可以修改
    this.age = age;
  }

  sayHello() {
    console.log(`大家好，我是${this.name}`);
  }
}

class Employee extends Person {
  constructor(name: string, age: number) {
    super(name, age);
    this.name = name; //子类中可以修改
  }
}

const p = new Person("孙悟空", 18);
p.name = "猪八戒"; // 不能修改
```

private

```ts
class Person {
  private name: string;
  private age: number;

  constructor(name: string, age: number) {
    this.name = name; // 可以修改
    this.age = age;
  }

  sayHello() {
    console.log(`大家好，我是${this.name}`);
  }
}

class Employee extends Person {
  constructor(name: string, age: number) {
    super(name, age);
    this.name = name; //子类中不能修改
  }
}

const p = new Person("孙悟空", 18);
p.name = "猪八戒"; // 不能修改
```

#### 属性存取器（关键）

对于一些不希望被任意修改的属性，可以将其设置为 private

直接将其设置为 private 将导致无法再通过对象修改其中的属性

我们可以在类中定义一组读取、设置属性的方法，这种对属性读取或设置的属性被称为属性的存取器

读取属性的方法叫做 setter 方法，设置属性的方法叫做 getter 方法

```ts
class Person {
  private _name: string;

  constructor(name: string) {
    this._name = name;
  }

  get name() {
    return this._name;
  }

  set name(name: string) {
    this._name = name;
  }
}

const p1 = new Person("孙悟空");
console.log(p1.name); // 通过getter读取name属性
p1.name = "猪八戒"; // 通过setter修改name属性
```

#### 静态属性

静态属性（方法），也称为类属性。使用静态属性无需创建实例，通过类即可直接使用

静态属性（方法）使用 static 开头

```ts
class Tools {
  static PI = 3.1415926;

  static sum(num1: number, num2: number) {
    return num1 + num2;
  }
}

console.log(Tools.PI);
console.log(Tools.sum(123, 456));
```

### 继承

通过继承可以将其他类中的属性和方法引入到当前类中，通过继承可以在不修改类的情况下完成对类的扩展

```ts
class Animal {
  name: string;
  age: number;

  constructor(name: string, age: number) {
    this.name = name;
    this.age = age;
  }
}

class Dog extends Animal {
  bark() {
    console.log(`${this.name}在汪汪叫！`);
  }
}

const dog = new Dog("旺财", 4);
dog.bark();
```

### 多态

多态指父类型的引用指向了子类型的对象，不同类型的对象针对相同的方法，产生了不同的行为。

```ts
class Animal {
  name: string;
  age: number;

  constructor(name: string, age: number) {
    this.name = name;
    this.age = age;
  }

  run() {
    console.log(`父类中的run方法！`);
  }
}

class Dog extends Animal {
  bark() {
    console.log(`${this.name}在汪汪叫！`);
  }

  run() {
    console.log(`子类中的run方法，会重写父类中的run方法！`);
  }
}

const dog = new Dog("旺财", 4);
dog.bark();
```

注意：在子类中可以使用 super 来完成对父类的引用

## 抽象类(abstract class)

抽象类是专门用来被其他类所继承的类，它只能被其他类所继承不能用来创建实例

```ts
abstract class Animal {
  abstract run(): void;
  bark() {
    console.log("动物在叫~");
  }
}

class Dog extends Animals {
  run() {
    console.log("狗在跑~");
  }
}
```

使用 abstract 开头的方法叫做抽象方法，抽象方法没有方法体只能定义在抽象类中，继承抽象类时抽象方法必须要实现

## 接口(Interface)

接口的作用类似于抽象类，不同点在于接口中的所有方法和属性都是没有实值的，换句话说接口中的所有方法都是抽象方法。接口主要负责定义一个类的结构，接口可以去限制一个对象的接口，对象只有包含接口中定义的所有属性和方法时才能匹配接口。同时，可以让一个类去实现接口，实现接口时类中要保护接口中的所有属性。

示例 1（检查对象类型）

```ts
interface Person {
  name: string;
  sayHello(): void;
}

function fn(per: Person) {
  per.sayHello();
}

fn({
  name: "孙悟空",
  sayHello() {
    console.log(`Hello, 我是 ${this.name}`);
  },
});
```

示例 2（实现）

```ts
interface Person {
  name: string;
  sayHello(): void;
}

class Student implements Person {
  constructor(public name: string) {}

  sayHello() {
    console.log("大家好，我是" + this.name);
  }
}
```

## 泛型(Generic)

定义一个函数或类时，有些情况下无法确定其中要使用的具体类型（返回值、参数、属性的类型不能确定），此时泛型便能够发挥作用。

```ts
function test<T>(arg: T): T {
  return arg;
}
```

这里的`<T>`就是泛型，T 是我们给这个类型起的名字（不一定非叫 T），设置泛型后即可在函数中使用 T 来表示该类型。所以泛型其实很好理解，就表示某个类型。

使用上述示例有两种方法。

方法一，直接使用：

```ts
function test<T>(arg: T): T {
  return arg;
}

test(10);
```

使用时可以直接传递参数使用，类型会由 TS 自动推断出来，但有时编译器无法自动推断时还需要使用下面的方式

方法二，指定类型：

也可以在函数后手动指定泛型

```ts
function test<T>(arg: T): T {
  return arg;
}

test<number>(10);
```

<br>

可以同时指定多个泛型，泛型间使用逗号隔开

```ts
function test<T, K>(a: T, b: K): K {
  return b;
}

test<number, string>(10, "hello");
```

类中同样可以使用泛型，使用泛型时，完全可以将泛型当成是一个普通的类去使用

```ts
class MyClass<T> {
  prop: T;

  constructor(prop: T) {
    this.prop = prop;
  }
}
```

<br>

除此之外，也可以对泛型的范围进行约束

```ts
interface MyInter {
  length: number;
}

function test<T extends MyInter>(arg: T): number {
  return arg.length;
}
```

使用 T extends MyInter 表示泛型 T 必须是 MyInter 的子类，接口类和抽象类同样适用。
