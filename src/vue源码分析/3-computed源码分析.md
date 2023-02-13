---
title: computed源码解析
order: 3
category: false
tag:
  - 响应式原理
  - 惰性缓存
  - 依赖耦合
---

## 前言

computed 是三大 watcher 中最复杂的一个 watcher(computed-watcher)，因为它不光是惰性缓存，而且只要是在 getter 中有出现过的响应式数据，都需要触发它的响应式变化

首先，根据[computed 惰性取值](https://v2.cn.vuejs.org/v2/api/#computed)的原理，我们先构建一个配置项，设置惰性的布尔值为 true

`const computedWatcherOptions = { lazy: true }`

## initComputed.js

接下来，初始化 computed 中的配置项

```js
// 初始化computed
import defineComputed from "./defineComputed.js";
import Watcher from "../reactive/watcher.js";

/**
 * Perform no operation.
 * Stubbing args to make Flow happy without leaving useless transpiled code
 * with ...rest (https://flow.org/blog/2017/05/07/Strict-Function-Call-Arity/).
 */
function noop(a, b, c) {}

const computedWatcherOptions = { lazy: true };

// vm为组件实例，computed为组件中的 computed 配置项
function initComputed(vm: Component, computed: Object) {
  // 初始化一个 _computedWatchers 属性绑定在组件实例上，用来存储每个计算属性的 watcher 实例
  const watchers = (vm._computedWatchers = Object.create(null));
  // 是否服务端渲染，在当前场景中，isSSR默认永久为false
  const isSSR = isServerRendering();
  //遍历 computed 配置项
  for (const key in computed) {
    const userDef = computed[key];
    // 如果是函数，则该函数默认是getter；不是函数说明是一个对象，则获取对象上面的get函数
    const getter = typeof userDef === "function" ? userDef : userDef.get;
    // 非服务端渲染，当前场景必定为true
    if (!isSSR) {
      // 为计算属性创建内部watcher，保存到 watchers 中
      // computed实际上就是通过 watcher 实现的，第四个参数是关键 { lazy: true }
      watchers[key] = new Watcher(
        vm,
        getter || noop,
        noop,
        computedWatcherOptions
      );
    }
    // key不能直接绑定在vm实例上，需要通过响应式数据声明
    if (!(key in vm)) {
      defineComputed(vm, key, userDef);
    }
  }
}
```

## watcher.js

在初始化最后，vm.\_computedWatchers 需要根据 computed 对象中的 key-value 实例化 Watcher，vm 也需要根据不同的 key-value 声明响应式数据，因此需要创建一个`defineComputed`函数，并优化重构[响应式原理](./1-深入响应式原理.html#watcher.js)中的 Watcher 类

- Watcher 类中对 computed 重要的属性在于 dirty（脏值），只有 watcher 实例初始化或调用 update 更新依赖值的时候，dirty 为 true
- watcher 实例调用 evaluate 方法，即封装后的 get 方法，调用一次响应式 get，随后 dirty 为 false
- `defineComputed` 函数实现目标是为组件实例绑定 set 函数和封装后的 get 函数，当且仅当组件实例上绑定的 watcher 实例的 dirty 为 true 时才调用 get 方法，否则直接返回 watcher.value，跳过 get 方法执行

```js
// watcher.js
import { pushTarget, popTarget } from "./dep.js";

let uid = 0;
export default class Watcher {
  constructor(data, expression, cb, options) {
    // data: 数据对象，如obj
    // expression：表达式，如b.c，根据data和expression就可以获取watcher依赖的数据
    // cb：依赖变化时触发的回调
    this.id = uid++;
    this.data = data;
    this.expression = expression;
    this.cb = cb;
    if (options) {
      this.lazy = !!options.lazy; // this.lazy=true 默认不执行 这是一个 computed
    }
    this.dirty = this.lazy; // computed 看是否需要重新取值
    if (typeof expression === "function") {
      this.getters = expression;
    }
    // 初始化watcher实例时订阅数据
    // lazy 留住value
    this.value = this.lazy ? undefined : this.get();
  }

  get() {
    // 1.新增watcher目标target的push和pop步骤
    // 2.因为js为单线程执行，因此同一时刻仅有一个watcher实例执行，Dep.target必定是当前正处于实例化过程中的watcher
    // 3.等待value值成功析出之后，将当前实例从targetStack中弹出，保证父子对象的两个watcher实例初始化时不会出现target冲突
    let value;
    pushTarget(this);
    try {
      value = this.getters.call(this.data, this.data);
    } finally {
      popTarget();
    }
    return value;
  }

  update() {
    // 修改属性计算属性依赖的变量重置 dirty，说明value已被修改，外部判断dirty为true会调用evaluate执行一次get()，最后将dirty置为false
    if (this.lazy) {
      this.dirty = true;
    }
  }

  evaluate() {
    //当走到这里时，页面正在渲染中 Dep.target, 已经有一个渲染 watcher 了
    this.value = this.get();
    // 修改了计算属性里面脏值，直到下次value改变之前，evaluate不会再次调用
    this.dirty = false;
  }
}
```

## defineComputed.js

```js
// defineComputed
function noop(a, b, c) {}

const sharedPropertyDefinition = {
  enumerable: true,
  configurable: true,
  get: noop,
  set: noop,
};

export default function defineComputed(
  target: any,
  key: string,
  userDef: Object | Function
) {
  // 非服务端环境才有缓存效果，当前场景必定为true
  const shouldCache = !isServerRendering();
  // 传入的是方法，computed传统写法
  if (typeof userDef === "function") {
    // 此处默认为true，调用 createComputedGetter 方法，createGetterInvoker 仅作了解
    sharedPropertyDefinition.get = shouldCache
      ? createComputedGetter(key)
      : createGetterInvoker(userDef);
    // 传入方法，set为空函数
    sharedPropertyDefinition.set = noop;
  } else {
    // 传入的是get()和set()
    // 不是服务端渲染，调用createComputedGetter
    // 注意，如果computed中某个key不需要缓存，可将cache设置为false
    // 在当前场景中，userDef中仅传入get()和set()，shouldCache 为 true，cache 为 undefined，因此调用 createComputedGetter 方法创建getter
    sharedPropertyDefinition.get = userDef.get
      ? shouldCache && userDef.cache !== false
        ? createComputedGetter(key)
        : createGetterInvoker(userDef.get)
      : noop;
    // 传入set方法绑定
    sharedPropertyDefinition.set = userDef.set || noop;
  }
  // 代理到vm实例上
  Object.defineProperty(target, key, sharedPropertyDefinition);
}

// 创建computed的getter方法
function createComputedGetter(key) {
  // 模板上访问计算属性
  return function computedGetter() {
    // 取出创建的 computedWatchers，此处为与key值匹配的watcher实例，在 initComputed 时创建
    const watcher = this._computedWatchers && this._computedWatchers[key];
    if (watcher) {
      if (watcher.dirty) {
        // 如果依赖的数据发生了变化，通过调用watcher的update函数，吧dirty的值变为true，需要重新计算值
        watcher.evaluate();
      }
      //计算好的参数返回给用户
      return watcher.value;
    }
  };
}
```

## 仍未解决的问题-多重嵌套 watcher

经过上面的`initComputed`、`watcher`、`defineComputed`的实现，实际上现在已经能实现 data 数据与 computed 数据的相互依赖，data 数据的变化可以引起 computed 属性重新计算并在 data 数据未发生变化时 computed 数据默认取缓存

但是，笔者在这里发现了一个坑，那就是沿用上面的代码在 demo 中运行，当 computed 属性 A 依赖 computed 属性 B 时，会出现的一个问题：

```js
// entry.js
// 将上述代码复制到项目中运行，可以发现问题
import observe from "./reactive/observe.js";
import initComputed from "./computed/initComputed.js";

let visitCount = 0;

const vm = {
  data: {
    a: {
      m: {
        n: 5,
      },
      x: 20,
    },
    b: 10,
    c: [1, 2, 3, 4],
    d: 20,
    e: 30,
  },
  computed: {
    res() {
      console.log("访问res申请通过，访问次数", ++visitCount, "次");
      const arr = this.data.c.reduce((a, b) => a + b, 0);
      return this.data.b + arr;
    },
    dbRes: {
      get() {
        return this.data.d + this.data.e;
      },
      set(value) {
        this.data.d = value - this.data.e;
      },
    },
    comRes() {
      return this.res + 1;
    },
  },
};

observe(vm.data);
initComputed(vm, vm.computed);
vm.data.c = [1, 2, 3, 4, 5];
vm.data.b = 15;
console.log("monitor", vm.res); // 30
console.log("monitor", vm.comRes); // 31
vm.data.b = 20;
console.log("monitor", vm.res); // 35
console.log("monitor", vm.comRes); // 31，没有正确响应，应该输出36
```

![computed嵌套watcher引发的问题](https://misaka10032.oss-cn-chengdu.aliyuncs.com/Vue/1673245603782.jpg)

从上面的 demo 可以看出

`vm.res`的变化仅在第一次初始化的时候引起了`vm.comRes的变化`，而第二次`vm.res`变化之后，`vm.comRes` 就不再变化了。因为 computed-watcher 本身没有自己的 dep 实例，因此其他依赖这个 watcher 实例的 computed-watcher 是无法正确执行依赖收发的

同样在 watch 监听 computed 属性时，如果按照上面的代码执行，因为缺失 dep 实例，watch 也是无非正确监听 computed-watcher 的

在 Vue2 的实际开发中，也存在 computed 属性计算值完全依赖另一个 computed 属性计算值的情况，是怎么解决的呢？

其实，Vue2 真正的源码早已给出了答案，但是笔者在查询了网上很多博客和文档的源码分析，这一段都没有讲清楚，这一段代码就在 `createComputedGetter` 函数中

```js
// 创建computed的getter方法
function createComputedGetter(key) {
  // 模板上访问计算属性
  return function computedGetter() {
    // 取出创建的 computedWatchers，此处为与key值匹配的watcher实例，在 initComputed 时创建
    const watcher = this._computedWatchers && this._computedWatchers[key];
    if (watcher) {
      if (watcher.dirty) {
        // 如果依赖的数据发生了变化，通过调用watcher的update函数，吧dirty的值变为true，需要重新计算值
        watcher.evaluate();
      }
      // 真正的关键，解决嵌套watcher的真正方案
      if (Dep.target) {
        // 思路转变，在watcher中收集依赖
        watcher.depend();
      }
      //计算好的参数返回给用户
      return watcher.value;
    }
  };
}
```

```js
// Dep.target栈结构
const targetStack = [];

export function pushTarget(_target) {
  targetStack.push(_target);
  Dep.target = _target;
}

export function popTarget() {
  targetStack.pop();
  Dep.target = targetStack[targetStack.length - 1];
}
```

## 嵌套 watcher 解决方案

先暂时不考虑 watcher.depend()的实现，我们以上面的 demo 为例分析一下这么做的原因：

1. 初始化并首次调用 `vm.comRes` 的 getter 时，调用这个 computedGetter 函数，这时由于 `vm.comRes`的 watcher 依赖于 `vm.res`的 watcher，所以在`vm.comRes`执行 getter 时，`vm.res`的 getter 也会执行，并且`vm.comRes` 的 watcher 先入栈 `targetStack`，`vm.res`的 watcher 后入栈 `targetStack`

2. 代码继续执行，`vm.res`的 watcher 执行完实例的 get 方法后，Dep.target 的栈数组 `targetStack` 弹出自己的 watcher，栈内还剩下依赖`vm.res`的 `vm.comRes`的 watcher 实例，因为 computed-watcher 自身没有 dep 实例用来收发依赖，所以 watcher 实例内部实际上需要创建一个 deps 数组用来存储 deps 实例，但 watcher 实例自身无需创建 dep 实例，思路与响应式原理中 Deps 存储 watcher 实例的`this.subs`相同.

3. watcher和dep之间相互耦合，watcher实例中收集关联的dep依赖存储为`this.deps`，提供dep新增、收集、移除的方法，到真正需要用到dep方法的时候调用dep实例自身的方法；dep实例中收集关联的watcher监听器实例存储为`this.subs`，提供watcher新增、收集（实际上是让当前的watcher实例去收集调用它的dep实例）、移除的方法，到真正需要用到watcher方法的时候调用watcher实例自身的方法

4. 上述代码继续执行，栈内剩余的`vm.comRes`的 watcher 实例需要转存`vm.res`真正需要的`vm.data.b`和`vm.data.c`的 dep 实例，因此对 Watcher 和 Dep 的调整如下

```js
var uid = 0;
export default class Dep {
  static target = null;

  constructor() {
    this.id = uid++;
    // 存储订阅者数组 subscribes
    // 数组里实际存放的是 Watcher 的实例对象
    this.subs = [];
  }
  // 添加watcher依赖到指定的dep实例，当且仅当全局的Dep.target绑定了watcher实例时才会push进去
  depend() {
    if (Dep.target) {
      // !改动!
      // 不再由实例调用方法添加依赖
      // this.addSub(Dep.target);
      Dep.target.addDep(this);
    }
  }
  // 通知更新
  notify() {
    // 浅拷贝
    const subs = [...this.subs];
    // 遍历执行watcher实例的update方法更新value
    subs.forEach((s) => s.update());
  }

  addSub(sub) {
    this.subs.push(sub);
  }

  // 借此完善订阅者定向清除方法
  removeSub(sub) {
    remove(this.subs, sub);
  }
}

function remove(arr, item) {
  if (arr.length) {
    const index = arr.indexOf(item);
    if (index > -1) {
      return arr.splice(index, 1);
    }
  }
}

const targetStack = [];

export function pushTarget(_target) {
  targetStack.push(Dep.target);
  Dep.target = _target;
}

export function popTarget() {
  Dep.target = targetStack.pop();
}
```

```js
// watcher.js
import { pushTarget, popTarget } from "./dep.js";

let uid = 0;
export default class Watcher {
  constructor(data, expression, cb, options) {
    // data: 数据对象，如obj
    // expression：表达式，如b.c，根据data和expression就可以获取watcher依赖的数据
    // cb：依赖变化时触发的回调
    this.id = uid++;
    this.data = data;
    this.expression = expression;
    this.cb = cb;
    if (options) {
      this.lazy = !!options.lazy; // this.lazy=true 默认不执行 这是一个 computed
    }
    this.dirty = this.lazy; // computed 看是否需要重新取值
    // dep依赖实例数组结构、新增的dep数组
    this.deps = [];
    this.newDeps = [];
    // depId去重set结构、新增的depId去重set结构，防止引入重复dep
    this.depIds = new Set();
    this.newDepIds = new Set();
    if (typeof expression === "function") {
      this.getters = expression;
    }
    // 初始化watcher实例时订阅数据
    // lazy 留住value
    this.value = this.lazy ? undefined : this.get();
  }

  get() {
    // 1.新增watcher目标target的push和pop步骤
    // 2.因为js为单线程执行，因此同一时刻仅有一个watcher实例执行，Dep.target必定是当前正处于实例化过程中的watcher
    // 3.等待value值成功析出之后，将当前实例从targetStack中弹出，保证父子对象的两个watcher实例初始化时不会出现target冲突
    let value;
    pushTarget(this);
    try {
      // getter标记，此时触发dep.depend，Dep.target.addDep(this)开始收集依赖，实际上还是在watcher实例中执行收集
      value = this.getters.call(this.data, this.data);
    } finally {
      popTarget();
      // 上方已经重新执行过一次dep收集，此时存储在newDeps和newDepIds中的数据进行无用id判断后真正落实到deps和depIds中
      this.cleanupDeps();
    }
    return value;
  }

  update() {
    // 修改属性计算属性依赖的变量重置 dirty，说明value已被修改，外部判断dirty为true会调用evaluate执行一次get()，最后将dirty置为false
    if (this.lazy) {
      this.dirty = true;
    }
  }

  evaluate() {
    //当走到这里时，页面正在渲染中 Dep.target, 已经有一个渲染 watcher 了
    this.value = this.get();
    // 修改了计算属性里面脏值，直到下次value改变之前，evaluate不会再次调用
    this.dirty = false;
  }

  // 增加关联的dep依赖实例到当前监听器watcher实例中
  addDep(dep) {
    const id = dep.id;
    if (!this.newDepIds.has(id)) {
      // 当前新增的dep实例中没有当前dep.id，则加入这个dep实例，避免重复引入
      this.newDepIds.add(id);
      this.newDeps.push(dep);
      // 此处使用了十分巧妙的class耦合，看似无关
      // 实际上在这里判断出当前dep.id不存在于已有depsId结构中时
      // 转而将参数中的dep实例取出，反过来调用dep.addSub实例方法
      // 保证dep实例中成功加入当前watcher实例，以后的setter更新
      // 必定调用dep.notify通知到当前watcher实例引发更新
      if (!this.depIds.has(id)) {
        dep.addSub(this);
      }
    }
  }

  // 在watcher实例中开启依赖收集，数量繁多的dep依赖实例与数量稀少的订阅者watcher实例
  // 相互之间构成你中有我，我中有你的关系
  depend() {
    let i = this.deps.length;
    while (i--) {
      this.deps[i].depend();
    }
  }

  // 每次执行完依赖更新后
  // 多余的dep实例，调用dep.removeSub移除调当前watcher
  // 新增deps实例的方法后清空用于新增的数据结构
  cleanupDeps() {
    let i = this.deps.length;
    while (i--) {
      const dep = this.deps[i];
      if (!this.newDepIds.has(dep.id)) {
        dep.removeSub(this);
      }
    }
    // 1. exchange depIds <--> newDepIds; 2. clear newDepIds
    let tmp = this.depIds;
    this.depIds = this.newDepIds;
    this.newDepIds = tmp;
    this.newDepIds.clear();
    // 1. exchange deps <--> newDeps; 2. clear newDeps
    tmp = this.deps;
    this.deps = this.newDeps;
    this.newDeps = tmp;
    this.newDeps.length = 0;
  }
}
```

现在，依赖 computed 属性的 computed 属性值也可以正确响应了

```js
import observe from "./reactive/observe.js";
import initComputed from "./computed/initComputed.js";

let visitCount = 0;

const vm = {
  data: {
    a: {
      m: {
        n: 5,
      },
      x: 20,
    },
    b: 10,
    c: [1, 2, 3, 4],
    d: 20,
    e: 30,
  },
  computed: {
    res() {
      console.log("访问res申请通过，访问次数", ++visitCount, "次");
      const arr = this.data.c.reduce((a, b) => a + b, 0);
      return this.data.b + arr;
    },
    dbRes: {
      get() {
        return this.data.d + this.data.e;
      },
      set(value) {
        this.data.d = value - this.data.e;
      },
    },
    comRes() {
      return this.res + 1;
    },
  },
};

observe(vm.data);
initComputed(vm, vm.computed);
vm.data.c = [1, 2, 3, 4, 5];
vm.data.b = 15;
console.log("monitor", vm.res);
console.log("monitor", vm.comRes);
vm.data.b = 20;
console.log("monitor", vm.res);
console.log("monitor", vm.comRes);
```

![computed实现watcher与dep双向依赖](https://misaka10032.oss-cn-chengdu.aliyuncs.com/Vue/1673245880621.jpg)


## 太长不看-总结

computed 是三种 watcher 之一的 computed-watcher，也是最复杂的 watcher，结合 computed 的配置项来理解：

1. computed 在 vue 实例初始化时，调用一个`initComputed`初始化 computed 的函数，遍历 computed 中的属性，遍历过程中会执行以下步骤
   1. 对其 value 进行类型判断，有两种情况：普通 getter 函数类型或者 getter 与 setter 函数混合的对象类型
   2. 在`initComputed`做类型兼容性判断，并且在当前组件上新建一个 `_computedWatchers` 对象，开启 computed 属性的监听器
   3. 初始化 watcher 时，会传入 getter 方法，与一个`{ lazy: true }`的值，表示这个 watcher 是惰性取值的
   4. 遍历的最后，为当前 computed 属性创建真正的 computed 对象，调用`defineComputed`函数，传入（当前组件实例、computed 属性名、computed 属性值）
2. 在`defineComputed`函数中，computed 属性值中的 getter 函数会进行一次函数柯里化，返回一个经过封装的高阶 getter 方法
   - 该高阶 getter 函数中，从 `this` 中取出之前已创建好的 `this._computedWatchers[key]` 对象，其实就是对应的 watcher 实例
   - 每次 getter 的调用，会先判断 watcher 实例的值是否更新（此处记为 dirty，true 表示已更新且未调用 getter，false 表示调用过 getter 无需更新）
   - 如果 watcher 实例更新，则调用 watcher 的 getter 方法获取依赖值，并执行依赖收集
   - **非常重要！！**因为 computed-watcher 本身并不具备依赖收集器 dep，为了保证 computed-A 依赖于 computed-B，B 数据变化时 A 能够正确收到更新通知也发生变化，亦或是 user-watcher 能够正确监听到 computed 属性变化，此时需要判断当前处于活化状态的 Dep.target，表明是与当前 watcher 实例密切关联的 watcher 实例，然后手动开启依赖收集`watcher.depend()`
   - 因为当前函数内仅有 watcher 实例，因此 dep 实例也需要存储在 watcher 实例中，在 watcher 实例中完成依赖的 depend、add、remove 等操作，虽然增加了 Dep 和 Watcher 之间的耦合度，但是解决了嵌套依赖不能正确响应的问题
   - 在将当前 computed 相关的所有 watcher 实例通知相关的 dep 实例收集完成之后，`this.value = 依赖值`，最后 dirty 置为 false
   - 如果 watcher 实例无需更新，则直接返回 watcher.value，即依赖对象原有的 getter 的值。因为 watcher 实例只要不去更新，`this.value`就稳定不变，因此 computed 在依赖值不更新时，默认直接返回实例的 value 值，而不是去调用 getter 方法获取，此为惰性取值
3. `defineComputed`函数最后，将高阶 getter 方法、可能存在的 setter 方法，一并通过 `Object.defineProperty` 声明在当前组件实例的 computed 属性名上（`vm[key]`）
4. computed 依然是通过 Dep 和 Watcher 收集和更新依赖，不过与普通的 render-watcher 不同之处在于，getter 内部存在 watcher 实例更新判断，如果无需更新则直接返回实例的 value 值，不再调用 watcher 本身的 getter 获取依赖值，实现了数据缓存

可运行项目 demo 详见：

https://github.com/mi-saka10032/vue2-reactive-sourceCode/tree/master/watch