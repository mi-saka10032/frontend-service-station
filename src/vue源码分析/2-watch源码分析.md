---
title: watch源码解析
order: 2

tag:
  - 响应式原理
  - watch
  - 深度Watch
---

## 前言

在[深入响应式原理](./1-深入响应式原理.html)中，我们已经了解了 Observer、Dep、Watcher 之间的关系，最后实现了数据的响应式变化与监听回调，也就是实现了 API 中 data 的响应式数据效果，而且从 Watcher 的源码不难看出，Watcher 类的定义很接近于 API 中 watch 的效果，因此本章对 watch 的源码进行解析，进一步加深对三大依赖收集器：data(render-watcher)、computed(computed-watcher)、watch(user-watcher)中 watch 的理解。

在初始化 initState 方法中，如果用户传入的配置有 watch，调用 initWatch 方法。

## initWatch.js

```js
function initWatch(vm: Component, watch: Object) {
  for (const key in watch) {
    const handler = watch[key];
    // 监听的是数组
    if (Array.isArray(handler)) {
      for (let i = 0; i < handler.length; i++) {
        // 为数组中每个元素创建watcher
        createWatcher(vm, key, handler[i]);
      }
    } else {
      createWatcher(vm, key, handler);
    }
  }
}
```

## createWatcher.js

- 接下来监听器创建函数，该函数主要针对 handler 的类型做判断（handler 可以是函数类型，也可以是对象类型，也就是 watch 的简写和完整写法），最后返回实例原型的`$watch`方法调用
- `$watch` 中创建独属于 watch 的 user-watch 标识符，new 了一个 watcher 实例对象，关键参数有二，options.user 和 options.immediate
  - options.user，该参数传入 watcher 中实例化时，在 watcher 实例执行依赖更新时，判断出是属于 watch 的监听器，才会执行 cb 回调函数
  - options.immediate，该参数会在 watcher 实例化之后进行一次判断，如果为 true，则自行执行一次 watcher 的回调函数（函数带错误捕获以防止错误的回调执行）

```js
// createWatcher.js

/**
 * Strict object type check. Only returns true
 * for plain JavaScript objects.
 */
function isPlainObject(obj: any): boolean {
  return Object.prototype.toString.call(obj) === "[object Object]";
}

function createWatcher(
  vm: Component,
  expOrFn: string | Function,
  handler: any,
  options?: Object
) {
  // 如果是对象（配置项形式），handler取对象中的handler函数
  if (isPlainObject(handler)) {
    options = handler;
    // 如果是: test:{handler(old,new){}}
    handler = handler.handler;
  }
  // 监听a.b.c（很少使用）
  if (typeof handler === "string") {
    handler = vm[handler];
  }
  // 返回实例的原型方法 $watch 的返回值，handler对应cb回调函数，options在handler为对象时取出并赋值(deep immediate sync等)
  return vm.$watch(expOrFn, handler, options);
}

// 原型方法$watch
Vue.prototype.$watch = function (
  expOrFn: string | Function,
  cb: any,
  options?: Object
): Function {
  const vm: Component = this;
  // 回调如果是对象，调用createWatcher解构
  if (isPlainObject(cb)) {
    return createWatcher(vm, expOrFn, cb, options);
  }
  options = options || {};
  // 标识这个是用户 user-watch
  options.user = true;
  // 同样，创建内部watcher
  const watcher = new Watcher(vm, expOrFn, cb, options);
  // **立即监听**
  if (options.immediate) {
    const info = `callback for immediate watcher "${watcher.expression}"`;
    pushTarget();
    // 自执行错误捕获函数
    invokeWithErrorHandling(cb, vm, [watcher.value], vm, info);
    popTarget();
  }
  return function unwatchFn() {
    watcher.teardown();
  };
};
```

## watcher.js

- Watcher 类有一处特别需要注意的地方，就是 Vue2 的 watch API 中 watch 配置项，其中的 deep 属性将允许开启深度监听，每当调用 get 函数时都需要判断`this.deep`
- `this.deep`为 true 时，需要对 value 值递归式查找其内部嵌套的全部 `__ob__` 属性，以触发 get 进行依赖收集

```js
// watcher.js
import traverse from './deep.js'
var id = 0;

// 属性路径解析，通过'a.b.m.n'的字符串解析出对象内部的属性值
function parsePath(path) {
  path = path.split('.')
	return function (obj) {
		path.forEach((key) => {
		  obj = obj[key]
		})
		return obj
	}
}

export default class Watcher {
    // 四个参数分别是组件实例、属性路径、回调函数、配置项信息
    constructor(vm, expOrFn , cb,options) {
        this.vm = vm
        this.expOrFn = expOrFn //监听的属性 如：a.b.c
        this.cb = cb // watch 回调
        if (options) {
            this.user = !!options.user //这是个 watch
            this.deep = !!options.deep //深度监听
        }
        this.deps = [];
        this.set = {}
        this.id = id++

        if (typeof expOrFn === 'function') {
            // 如果expOrFn是函数，说明是watch的函数简写，直接将函数绑定给getters
            this.getters = expOrFn
        } else {
        	  //访问监听的变量 如：a.b.c.d，解析后返回value值获取函数
            this.getters = parsePath(this.expOrFn)
        }
        //留住 value 调用一次get
        this.value = this.get();
    }
    get() {
        //标记target，Dep.target入栈
        pushTarget(this)
        //访问监听的属性
        let value = this.getters.call(this.vm, this.vm);
        // deep开启深度监听，与其他普通watcher最特别的地方
        if (this.deep) {
            traverse(value)
        }
        //弹出target防止data上每个属性都产生依赖，只有页面上使用的变量需要依赖，Dep.target出栈
        popTarget()
        return value
    }
    run() {
        let newValue = this.get()
        //取出旧值
        const oldValue = this.value
        //留住新值
        this.value = newValue
        //用户自己传入的watch，user-watcher标识符，只有watch的配置项才会声明this.user=true
        if (this.user) {
        	//这里的 cb 就是传入的 watch 回调函数
             this.cb.call(this.vm, newValue, oldValue)
        }
    }
    addDep(dep) {
        let id = dep.id
        //去重防止dep添加watch多次
        if (!this.set[id]) {
            //watcher添加dep
            this.deps.push(dep)
            //给dep添加watch
            dep.addSub(this)
            this.set[id] = true;
        }
    }
    upDate() {
        this.run()
    }
    // 从所有依赖项的订阅者列表中删除自身
    teardown() {
  		if (this.active) {
			// vm实例的watch列表中移除，这是一个开销较大的操作，所以如果vm实例正在被销毁，就跳过
		    if (!this.vm._isBeingDestroyed) {
		      remove(this.vm._watchers, this)
		    }
		    let i = this.deps.length
		    while (i--) {
		      this.deps[i].removeSub(this)
		    }
		    this.active = false
	  }
}
```

## deep.js

- watch 配置项中存在 deep 属性，当 deep 为 true 时可以开启深度监听，上面的 Watcher 类中在 deep 为 true 时调用 traverse 函数

- 实际上 deep 的实现原理就是递归的触发数组或对象的 get 进行依赖收集，又因为 `__ob__` 属性仅有数组和对象才有（详见[递归侦测对象属性](./1-深入响应式原理.html#递归侦测对象属性)），因此在这里需要声明一个递归式手动依赖管理函数，将它们的依赖收集到 Observer 类的 dep 中完成 deep 深度监听

```js
// deep.js
const seenObjects = new Set(); // 不重复添加

export default function traverse(val) {
  _traverse(val, seenObjects);
  seenObjects.clear();
}

function _traverse(val, seen) {
  let i, keys;
  const isA = Array.isArray(val); // val是否是数组
  const isO = typeof val === "object"; // val是否是对象
  const isF = Object.isFrozen(val); // val是否是冻结对象

  // 如果不是array和object，或者是已经冻结对象（源码上还判断了VNode对象，此处暂时忽略不计）
  if ((!isA && !isO) || isF) {
    return; // 再见
  }

  if (val.__ob__) {
    // 只有object和array才有__ob__属性
    const depId = val.__ob__.dep.id; // 手动依赖收集器的id
    if (seen.has(depId)) {
      // 已经有收集过
      return; // 再见
    }
    seen.add(depId); // 没有被收集，添加
  }

  if (isA) {
    // 是array
    i = val.length;
    while (i--) {
      _traverse(val[i], seen); // 递归触发每一项的get进行依赖收集
    }
  } else {
    // 是object
    keys = Object.keys(val);
    i = keys.length;
    while (i--) {
      _traverse(val[keys[i]], seen); // 递归触发子属性的get进行依赖收集
    }
  }
}
```

## 太长不看-总结

watch 是三种 watcher 之一的 user-watcher，结合 watch 的配置项来理解：

1. watch 在 vue 实例初始化时，调用一个`initWatch`初始化 watch 的函数，遍历 watch 中的属性，遍历过程中会执行以下步骤
   1. 循环遍历调用`createWatcher`函数，传入（当前组件 vm 实例、watch 属性名、watch 属性值）
   2. 在`createWatcher`函数内对 watch 属性值 handler 进行类型判断，有两种情况：普通 handler 函数或者包含 immediate、deep、handler 函数在内的对象（此处不涉及异步处理，暂不写 sync 属性）
   3. 最后调用组件 vm 的原型方法`$watch`方法，传入（watch 属性名、watch 属性值 handler、handler 中的其他配置选项）
2. 在 Vue 的原型方法`$watch`，是实现 user-watcher 的关键方法，初始化 Watcher 实例并传入 user 标识符表示该 watcher 实例属于 user-watcher
3. `$watch`方法最后判断配置选项中的 immediate 是否为 true，如果为true，则自动执行一次 watcher 入栈 -> 自执行函数调用与错误捕获函数（防止 handler 函数中出现异常） -> watcher 出栈操作，以实现 handler 函数的立即执行效果
4. 在 Watcher 类中，新增两项配置，deep 和 user，user 为 true 表示是 watch 创建的 user-watcher 实例
   - 当 watcher 实例受 dep 通知，更新依赖值时，只有`this.user`为 true 才会执行 handler 的回调函数
   - 每次 watcher 实例调用 getter 时，都会对`this.deep`进行判断，如果为 true 则表示开启深度监听
   - 开启深度监听后，watcher 实例会对当前的 value 值进行地毯式循环+递归查询，逐项触发 getter 执行 dep 的依赖收集，添加当前 watcher 实例。所以当复杂对象内部属性变化时，开启深度监听亦可触发 watch 的 handler 回调

可运行项目 demo 详见：

https://github.com/mi-saka10032/vue2-reactive-sourceCode/tree/master/computed
