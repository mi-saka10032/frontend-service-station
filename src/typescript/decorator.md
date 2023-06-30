---
title: 装饰器
order: 3

tag:
  - 装饰器
  - 功能增强
---

## 定义

装饰器是一种特殊类型的声明，它能够被附加到类声明，方法，访问符，属性或参数上。装饰器使用@expression 这种形式，expression 求值后必须为一个函数，它会在运行时被调用，被装饰的声明信息作为参数传入。

定义来自：https://www.tslang.cn/docs/handbook/decorators.html

简单来说，TS 的装饰器就是通过修饰类、方法、属性、参数的形式，增强类、方法、属性、参数的功能、扩充其原有内容，同时不影响原本代码的逻辑。换一种说法，装饰器实际上就是高阶函数的一种特殊实现形式

注意：JS 的新版 ECMA 规范已经支持装饰器语法，但是 JS 项目中需要配置 babel 插件支持，有 ESLint 的还要给 ESLint 加上装饰器语法支持。有的项目中脚手架自带支持，原生 Webpack 项目需要自行配置

## 类装饰器

类装饰器是我们最常用的，它的作用是为目标类扩展功能

- 类装饰器只有一个参数，参数为类的构造函数 constructor
- 如果类装饰器返回一个值，它会使用提供的构造函数来替换类的声明

### 应用案例

看描述是不是很抽象？那我们来假设一个场景

目前有一些植物类（Tree、Flower、Grass），都存在一个公共方法来实现生长（Grow）

```ts
class Base {
class Base {
  name: string;
  constructor(name = "") {
    this.name = name;
  }
  grow() {
    console.log(`${this.name}在生长`);
  }
}

class Tree extends Base {}
class Flower extends Base {}
class Grass extends Base {}

const tree = new Tree("树");
const flower = new Flower("花儿");
const grass = new Grass("小草");

tree.grow();
flower.grow();
grass.grow();
```

好了，现在新增动物类（Dog、Cat），需要一个 run 方法表示动物在奔跑，但植物没办法奔跑所以不需要这个方法。此时 class 继承好像行不通了，而装饰器可以完美实现这个功能

```ts
function growClassDecorator(name: string): ClassDecorator {
  return (constructor: Function) => {
    constructor.prototype.grow = () => {
      console.log(`${name}在生长`);
    };
  };
}

function runClassDecorator(name: string): ClassDecorator {
  return (constructor: Function) => {
    constructor.prototype.run = () => {
      console.log(`${name}在奔跑`);
    };
  };
}

// 为了避免编译器报错，准备一个抽象类供实体类继承
abstract class Base {
  grow() {}
  run() {}
}

@growClassDecorator("树")
class Tree extends Base {}

@growClassDecorator("花儿")
class Flower extends Base {}

@growClassDecorator("小草")
class Grass extends Base {}

@growClassDecorator("小狗")
@runClassDecorator("小狗")
class Dog extends Base {}

@growClassDecorator("小猫")
@runClassDecorator("小猫")
class Cat extends Base {}

const tree = new Tree();
const flower = new Flower();
const grass = new Grass();
const dog = new Dog();
const cat = new Cat();

tree.grow();
dog.run();
```

### 属性重载

在类装饰器中如果返回一个 class，它会使用提供的构造函数替换类的声明

```ts
const growClassDecorator = (name: string) => {
  return <T extends { new (...args: any[]): {} }>(constructor: T) => {
    return class extends constructor {
      hello = "override";
      grow() {
        console.log(`${name}在生长`);
      }
    };
  };
};

function runClassDecorator(name: string): ClassDecorator {
  return (constructor: Function) => {
    constructor.prototype.run = () => {
      console.log(`${name}在奔跑`);
    };
  };
}

// 为了避免编译器报错，准备一个抽象类供实体类继承
class Base {
  hello: string;
  grow() {}
  run() {}
}

interface Hello {
  hello: string;
}

@growClassDecorator("树")
class Tree extends Base {}

@growClassDecorator("花儿")
class Flower extends Base {}

@growClassDecorator("小草")
class Grass extends Base {}

@growClassDecorator("小狗")
@runClassDecorator("小狗")
class Dog extends Base {}

@growClassDecorator("小猫")
@runClassDecorator("小猫")
class Cat extends Base {}

const tree = new Tree();
const flower = new Flower();
const grass = new Grass();
const dog = new Dog();
const cat = new Cat();

tree.grow();
dog.run();
console.log(cat.hello); // override
```

最后，`cat.hello`的属性已经默认被类装饰器全部覆写

**注意：多个装饰器叠加的时候，执行顺序为离被装饰对象越近的装饰器越先执行**

## 方法装饰器

方法装饰器也是非常常用的装饰器，尤其是在 Vue2 项目中，配置项形式的 Vue2 组件最适用的就是方法装饰器

方法装饰器接收三个参数：

1. 对于静态方法，第一个参数为类的构造函数。对于实例方法，为类的原型对象
2. 第二个参数为方法名
3. 第三个参数为方法描述符

方法装饰器可以有返回值，返回值作为方法的属性描述符

以一个错误捕获装饰器为例，受到装饰的方法都会自动获得异常捕捉的能力

```ts
const ErrorDecorator: MethodDecorator = (
  target: Object,
  propertyKey: string | symbol,
  descriptor: PropertyDescriptor
) => {
  const fn: Function = descriptor.value;
  descriptor.value = async function (...args: any) {
    try {
      await fn.apply(this, args);
    } catch (error) {
      console.error(error);
    }
  };
};

class App {
  @ErrorDecorator
  async getLists() {
    const res = await apiQueryLists();
    if (res.code === 1) {
      // 同步设置列表数据 ...
      console.log("列表查询成功");
    }
  }

  @ErrorDecorator
  async deleteList(id: string) {
    await apiDeleteList(id);
    console.log("删除成功");
  }
}
```

通过修改 descriptor，我们可以实现对方法进行重新描述。比如设置方法禁止修改，禁止删除等

```ts
descriptor.value = () => {
  console.log("eat方法被替换");
};
descriptor.writable = true;
descriptor.enumerable = true;
descriptor.configurable = true;
```

## 属性装饰器

属性装饰器接受两个参数

1. 对于静态属性，第一个参数为类的构造函数。对于实例属性，参数为类的原型对象
2. 第二个参数为属性名称

```ts
import "reflect-metadata";

const CarPropertyDecorator: PropertyDecorator = (
  target: object,
  propertyKey: string | symbol
) => {
  target[propertyKey] = "小汽车";
};

class Car {
  @CarPropertyDecorator
  name: string;
}

const car = new Car();
console.log(car.name);
```

定义一个可覆写值的属性装饰器需要引入 reflect-metadata 这个库

```ts
import "reflect-metadata";

const formatMetadataKey = Symbol("format");

function carDecorator(property: string) {
  return Reflect.metadata(formatMetadataKey, property);
}

function typeDecorator(property: number) {
  return Reflect.metadata(formatMetadataKey, property);
}

function _getDecorator(target: any, propertyKey: string) {
  return Reflect.getMetadata(formatMetadataKey, target, propertyKey);
}

class Car {
  @carDecorator("奔驰")
  name: string;
  @typeDecorator(880)
  type: number;

  getCar() {
    return _getDecorator(this, "name");
  }

  getType() {
    return _getDecorator(this, "type");
  }
}

const car = new Car();
console.log(car.getCar());
console.log(car.getType());
```

由此可以看出，属性装饰器配合 reflect-metadata 可以自由地向属性中添加元数据，并在恰当的时候消费它

## 参数装饰器

参数装饰器接收三个参数

1. 对于静态方法，第一个参数为类的构造函数。对于实例方法，第一个参数为类的原型对象
2. 第二个参数为参数所在的方法名称
3. 第三个参数为参数在参数列表中的索引

参数装饰器的返回值会被忽略

参数装饰器一般用来做参数校验，不过在 Nest 或 Midway 等 Node 框架中，也常用来过滤筛选请求体中的对应参数

```ts
import "reflect-metadata";

const validate: MethodDecorator = (
  target: Object,
  propertyKey: string | symbol,
  descriptor: PropertyDescriptor
) => {
  const method = descriptor.value;
  descriptor.value = function (...args: Array<any>) {
    const paramIndexArr = Reflect.getMetadata("required", target, propertyKey);
    paramIndexArr.forEach((index: number) => {
      if (args[index] === undefined) {
        throw new Error(`第${index}参数未必传项！`);
      }
    });
    method.apply(this, args);
  };
};

const required: ParameterDecorator = (
  target: Object,
  propertyKey: string | symbol,
  parameterIndex: number
) => {
  const paramIndexArr =
    Reflect.getMetadata("required", target, propertyKey) || [];
  paramIndexArr.push(parameterIndex);
  Reflect.defineMetadata("required", paramIndexArr, target, propertyKey);
};

class SSO {
  @validate
  login(@required username: string, @required password: string) {}
}
```

以上 demo 有一个单点登录类，其中 login 方法必须传入 username 和 password。我们使用参数装饰器，当函数未传入指定类型数据时候进行报错

## 访问器装饰器

访问器装饰器实际上就是属性的 get 和 set 方法的装饰器，注意 get 和 set 访问器不能用同一个装饰器

访问器装饰器的使用方法和方法装饰器一致，因为 getter、setter 本质上也是方法

```ts
function visitDecorator(
  target: any,
  key: string,
  descriptor: PropertyDescriptor
) {
  descriptor.writable = false;
}

class Test {
  private _name: string;
  constructor(name: string) {
    this._name = name;
  }
  // getter访问器
  get name() {
    return this._name;
  }
  @visitDecorator
  //  setter访问器
  set name(name: string) {
    this._name = name;
  }
}

const test = new Test("yang");
test.name = "1231313";
console.log(test.name); // 报错，set方法被装饰后禁止修改
```

## Reflect-metadata

reflect-metadata 是 ES7 的一个提案，它主要用来在声明的时候添加和读取元数据

1. MetaData：也称元数据，元数据是用来描述数据的数据。举个例子：元数据概念其实是跟数据库的字段名（field）一致 —— 在传统的数据库中就天然包含元数据的概念。比如 name，phone，它们就是元数据
2. Reflect：ES6 规范中，Reflect 已然存在，这个 API 的作用就是实现对变量操作的函数化，也就是反射

### 概念术语

- MetadataKey：元数据的 key，对于一个对象来说，它可以有很多元数据，每一个元数据都对应有一个 key。一个很简单的例子就是说，你可以在一个对象上面设置一个叫做“name”的 key，用以设置它的名字，用一个`created time`的 key 来表示它创建的时间。这个 key 可以是任意类型
- MetadataValue：元数据的值，任意类型
- Target：元数据的目标对象，对象类型，表示要在这个对象上面加元数据
- Property：用于设置在哪个属性上添加元数据。注意：Property 和 MetadataKey 的区别在于，MetadataKey 是元数据的 key，可以把 MetadataKey 理解为元数据内部一个对象的 key，这个 MetadataKey 指向的对象里面有很多个字段，字段的 key 就是 property，对应的 value 就是设置 property 时输入的 MetadataValue

![Reflect-metadata](https://misaka10032.oss-cn-chengdu.aliyuncs.com/TypeScript/reflect-metadata.png)

### API

```ts
namespace Reflect {
  // 用于装饰器
  metadata(k, v): (target, property?) => void

  // 在对象上面定义元数据
  defineMetadata(k, v, o, p?): void

  // 是否存在元数据
  hasMetadata(k, o, p?): boolean
  hasOwnMetadata(k, o, p?): boolean

  // 获取元数据
  getMetadata(k, o, p?): any
  getOwnMetadata(k, o, p?): any

  // 获取所有元数据的 Key
  getMetadataKeys(o, p?): any[]
  getOwnMetadataKeys(o, p?): any[]

  // 删除元数据
  deleteMetadata(k, o, p?): boolean
}
```

### 创建元数据

语法：`Reflect.metadata/Reflect.defineMetadata`

1. `Reflect.metadata`：通过装饰器声明方式创建，主流推荐方式
2. `Reflect.defineMetadata`：在属性装饰器中使用时，类创建完毕后再给目标属性创建元数据

```ts
class Test {
  public func(val: string): string {
    return val;
  }
}

Reflect.defineMetadata("a", "1111", Test); // 给类添加元数据
Reflect.defineMetadata("b", "22222", Test.prototype, "func"); // 给类的属性添加元数据

console.log(Reflect.getMetadata("a", Test)); // 1111
console.log(Reflect.getMetadata("b", Test.prototype, "func")); // 22222
```

```ts
import "reflect-metadata";

const formatMetadataKey = Symbol("format");

function carDecorator(property: string) {
  return Reflect.metadata(formatMetadataKey, property);
}

function typeDecorator(property: number) {
  return Reflect.metadata(formatMetadataKey, property);
}

function _getDecorator(target: any, propertyKey: string) {
  return Reflect.getMetadata(formatMetadataKey, target, propertyKey);
}

class Car {
  @carDecorator("奔驰")
  name: string;
  @typeDecorator(880)
  type: number;

  getCar() {
    return _getDecorator(this, "name");
  }

  getType() {
    return _getDecorator(this, "type");
  }
}

const car = new Car();
console.log(car.getCar());
console.log(car.getType());
```

```ts
class Test {
  public func(val: string): string {
    return val;
  }
}

Reflect.defineMetadata("a", "1111", Test); // 给类添加元数据
Reflect.defineMetadata("b", "22222", Test.prototype, "func"); // 给类的属性添加元数据

console.log(Reflect.getMetadata("a", Test)); // 1111
console.log(Reflect.getMetadata("b", Test.prototype, "func")); // 22222
```

### 元数据判断

语法：`Reflect.hasMetadata/Reflect.hasOwnMetadata`

两者调用方式一样，唯一的区别是前者会包含原型链查找，后者不会查找原型链

```ts
console.log(Reflect.hasMetadata("a", Test)); //true
console.log(Reflect.hasOwnMetadata("a", Test)); //true
console.log(Reflect.hasMetadata("b", Test, "func")); //false
console.log(Reflect.hasOwnMetadata("b", Test.prototype, "func")); //true
```

### 查询元数据

语法：`Reflect.getMetadata/Reflect.getOwnMetadata`

两者调用方式一样，唯一的区别是前者会包含原型链查找，后者不会查找原型链

```ts
console.log(Reflect.getMetadata("a", Test)); //1111
console.log(Reflect.getOwnMetadata("a", Test)); //1111
console.log(Reflect.getMetadata("b", Test, "func")); //undefined
console.log(Reflect.getOwnMetadata("b", Test.prototype, "func")); //22222
```

### 删除元数据

语法：`Reflect.deleteMetadata`

```ts
console.log(Reflect.deleteMetadata("a", Test)); //true
console.log(Reflect.deleteMetadata("b", Test.prototype, "func")); //true
console.log(Reflect.deleteMetadata("a", Test)); //false
```

## 依赖注入

注：下面的内容是参考这篇链接写的：https://zhuanlan.zhihu.com/p/33492169，写得也很有趣

为了更好解释依赖注入，我们直接上场景：

### 初始工厂

首先声明一个工厂，这个工厂的主要产品就是生产奔驰汽车

```ts
class Factory {
  name: string;
  constructor(name: string) {
    this.name = name;
  }
  produceCar() {
    console.log("生产奔驰汽车");
  }
}
```

但是，汽车不是一体化直接生产完成的，一辆汽车必须先生产车体和轮胎，最后再组装成汽车

```ts
class BenzBody {
  produceBody() {
    console.log("生产奔驰车体");
  }
}

class BenzTyre {
  produceTyre() {
    console.log("生产奔驰轮胎");
  }
}

class Factory {
  name: string;
  constructor(name: string) {
    this.name = name;
  }
  produceCar() {
    new BenzBody().produceBody();
    new BenzTyre().produceTyre();
    console.log("组装奔驰汽车");
  }
}

const factory = new Factory("奔驰汽车厂");
factory.produceCar();
```

好了，现在一家奔驰汽车厂就开始了源源不断地生产奔驰汽车了

### 工厂改制

但是有一天，这家工厂经营不善倒闭了，新的老板接手了工厂，决定吸取之前奔驰汽车销量不佳的教训，改为生产比亚迪汽车

但是修改产品，就意味着所有生产线都需要重新更换设备，于是在大刀阔斧地修改下，工厂变成了这样

```ts
class BYDBody {
  produceBody() {
    console.log("生产比亚迪车体");
  }
}

class BYDTyre {
  produceTyre() {
    console.log("生产比亚迪轮胎");
  }
}

class Factory {
  name: string;
  constructor(name: string) {
    this.name = name;
  }
  produceCar() {
    new BYDBody().produceBody();
    new BYDTyre().produceTyre();
    console.log("组装比亚迪汽车");
  }
}

const factory = new Factory("比亚迪汽车厂");
factory.produceCar();
```

在修改了车体和轮胎生产线、以及组装工序之后，比亚迪汽车厂终于能生产比亚迪汽车了

但是好景不长，汽车厂换车销售之后，好不容易有点起色，这时候原材料的供应商原料涨价，老板发现入不敷出了，现在又面临着要重新换产线了

于是，老板发现一个问题：生产线修改的时候我亲力亲为，煞费苦心才改好的结果，现在遇到风险之后又要重新修改，每次只要工厂出问题就需要费事费力地修整，实在是太**依赖**生产线了，同时抗风险能力也很差

### 工序承包

老板发现，自己的控制欲有点太强了，生产车体、轮胎、组装都是自己来，导致生产线和工厂**耦合**程度太高，所以想了一个办法：将车体生产和轮胎生产工序分包出去，需要什么样的车体和轮胎就寻找什么样的生产商，这样虽然赚取利润少了一点，但是假如销量不好可以随时更换厂商，换一种汽车来组装销售

```ts
// CarBody代表生产车体的能力
interface CarBody {
  produceBody(): void;
}

// CarTyre代表生产轮胎的能力
interface CarTyre {
  produceTyre(): void;
}

class BMWBody implements CarBody {
  produceBody() {
    console.log("生产宝马车体");
  }
}

class BMWTyre implements CarTyre {
  produceTyre() {
    console.log("生产宝马轮胎");
  }
}

class Factory {
  name: string;
  // 招标车体制造商
  body: CarBody;
  // 招标轮胎制造商
  tyre: CarTyre;

  constructor(name: string, body: CarBody, tyre: CarTyre) {
    this.name = name;
    this.body = body;
    this.tyre = tyre;
  }
  produceCar() {
    this.body.produceBody();
    this.tyre.produceTyre();
    console.log("组装宝马汽车");
  }
}

// 宝马车体制造商投标
const bmwBody = new BMWBody();
// 宝马轮胎制造商投标
const bmwTyre = new BMWTyre();
// 制造商招标
const factory = new Factory("宝马汽车厂", bmwBody, bmwTyre);
factory.produceCar();
```

从现在开始，老板已经不需要担心市场的风险对于生产线的影响了，只要汽车有问题，换一家就行，甚至到后面组装工序的生产线也可以找组装供应商来执行

这就是**依赖注入**

### 总结

说了这么多，其实依赖注入就是一句话：

**本来一个类需要接受各种参数来构造一个对象，现在只接受一个参数————已经实例化的对象**

所以，本来由多种参数带来的依赖在外部实例化，目标类接受【注入依赖】的实例来运作，从而和它原本的构造方式解耦了。构造和销毁这些操作，也就交给了负责提供实例化的第三方，也就是【控制反转】

**上面提到的一系列装饰器，其核心思想都是依赖注入，提供第三方实例解耦初始类**
