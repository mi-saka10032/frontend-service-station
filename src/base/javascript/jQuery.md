---
title: jQuery
order: 6

tag:
  - Javascript库
  - 简化语法
  - 浏览器操作
---

## 概述

jQuery 是 Javascript 的 library 库，包含封装好的特定的集合（方法和函数）。

jQuery 为了快速方便地操作 DOM，里面基本都是函数（方法），封装 JS 常用的功能代码，优化了 DOM 操作、事件处理、动画设计和 Ajax 交互。

学习 jQuery 本质：学习调用这些函数（方法）。

优点：

1. 轻量级。核心文件才几十 kb，不影响页面加载速度

2. 跨浏览器兼容。基本兼容了现在主流的浏览器

3. 链式编程、隐式迭代

4. 对事件、样式、动画支持，大大简化了 DOM 操作

5. 支持插件扩展开发。有丰富的第三方插件，如树形菜单、日期控件、轮播图等。

6 免费、开源

## 基本使用

### 版本

1.x：兼容 IE 678 等低版本浏览器，不再更新

2.x：不兼容 IE 678 等低版本浏览器，不再更新

3.x：不兼容 IE 678 等低版本浏览器，是官方主要更新维护的版本

### 入口函数

```javascript
$(function(){
   ...;
});
```

```javascript
$(document).ready(function(){
   ...
});
```

1. 等着 DOM 结构渲染完毕即可执行内部代码，不必等到所有外部资源加载完成，jQuery 帮我们完成封装。

2. 相当于原生 JS 中的 DOMContentLoaded。

3. 不同于原生 JS 中的 load 事件，是等页面文档、外部 js 文件、css 文件、图片加载完毕才执行代码。

4. 更推荐第一种方式。

### 顶级对象 $

$是 jQuery 别称，在代码中可使用 jQuery 代替 $。

$是 jQuery 的顶级对象，相当于原生 JS 的 window。把元素包装成 jQuery 对象就可以使用 jQuery 方法。

### jQuery 对象和 DOM 对象

1. 用原生 JS 获取来的对象就是 DOM 对象。

2. 用 jQuery 对象获取的元素就是 jQuery 对象。

3. jQuery 对象本质：利用$对 DOM 对象包装后产生对象（伪数组形式存储）。

DOM 对象和 jQuery 对象可以相互转换。

1. DOM→jQuery $(DOM 对象)

```javascript
$("div")[index]	index是索引号
```

2. jQuery→DOM

```javascript
$("div").get(index)	index是索引号
```

## 常用 API

### 基础选择器

```javascript
$("选择器");
```

| 名称       | 用法            | 描述                     |
| :--------- | :-------------- | :----------------------- |
| ID 选择器  | $("#id")        | 获取指定 ID 的元素       |
| 全选选择器 | $("\*")         | 匹配所有元素             |
| 类选择器   | $(".class")     | 获取同一类 class 的元素  |
| 标签选择器 | $("div")        | 获取同一类标签的所有元素 |
| 并集选择器 | $("div,p,li")   | 选取多个元素             |
| 交集选择器 | $("li.current") | 交集元素                 |

### 层级选择器

| 名称       | 用法       | 描述                                                           |
| :--------- | :--------- | :------------------------------------------------------------- |
| 子代选择器 | $("ul>li") | 使用>号，获取亲儿子层级元素；注意，并不会获取孙子层级的元素    |
| 后代选择器 | $("ul li") | 使用空格，代表后代选择器，获取 ul 下所有的 li 元素，包括孙子等 |

### 隐式迭代（重要）

遍历内部 DOM 元素（伪数组形式存储）的过程叫做隐式迭代。

给匹配到的元素进行循环遍历，执行相应的方法，不需要再次循环，简化操作方便调用。

### 筛选选择器

| 语法       | 用法          | 描述                                                            |
| :--------- | :------------ | :-------------------------------------------------------------- |
| :first     | $("li:first") | 获取第一个 li 元素                                              |
| :last      | $("li:last")  | 获取最后一个 li 元素                                            |
| :eq(index) | $("li:eq(2)") | 获取到的 li 元素中，选择索引号为 2 的元素，索引 index 从 0 开始 |
| :odd       | $("li:odd")   | 获取到的 li 元素中，选择索引号为奇数的元素                      |
| :even      | $("li:even")  | 获取到的 li 元素中，选择索引号为偶数的元素                      |

### 筛选方法

| 语法               | 用法                           | 描述                                                |
| :----------------- | :----------------------------- | :-------------------------------------------------- |
| parent()           | $("li").parent()               | 查找父级                                            |
| children(selector) | $("ul").children("li")         | 相当于$("ul>li")，最近一级（儿子）                  |
| find(selector)     | $("ul").find("li")             | 相当于$("ul li")，后代选择                          |
| siblings(selector) | $(".first").siblings("li")     | 查找兄弟节点，不包括自己本身                        |
| nextAll([expr])    | $(".first").nextAll()          | 查找当前元素之后所有的同辈元素                      |
| prevAll([expr])    | $(".first").prevAll()          | 查找当前元素之前所有的同辈元素                      |
| hasClass(class)    | $("div").hasClass("protected") | 检查当前的元素是否含有某个特定类，如果有则返回 true |
| eq(index)          | $("li").eq(2)                  | 相当于$("li:eq(2)")，index 从 0 开始                |

### 排他思想

1. 隐式迭代，所有按钮统一绑定事件统一赋予属性。

2. this 元素改变。

3. 其余兄弟元素 this.siblings() 去掉背景颜色

4. 链式编程（节省代码量，优雅）

```javascript
$(this).css("color", "red").siblings().css("color", "red");
```

## 样式操作

### 操作 CSS 方法

jQuery 可以使用 css 方法来修改简单元素样式；也可以操作类，修改多个样式。

#### 只写 属性名，返回属性值

```javascript
$(this).css("color");
```

#### 参数是 属性名，属性值，逗号分隔

设置一组样式，属性必须加引号，值如果是数字可以不用跟单位和引号。

```javascript
$(this).css("color", "red");
```

#### 参数可以是对象形式

方便设置多组样式。属性名和属性值用冒号隔开，**属性可以不用加引号**。

```javascript
$(this).css({ color: "white", "font-size": "20px" });
```

注意：如果是复合属性需要采用驼峰命名法书写。

### 设置类样式方法

作用等同于以前的 classList，可以操作类样式，主要操作类里面的参数不要加点。

#### 添加类

```javascript
$("div").addClass("current");
```

#### 删除类

```javascript
$("div").removeClass("current");
```

#### 切换类

```javascript
$("div").toggleClass("current");
```

### 类操作与 className 区别

原生 JS 中 className 会覆盖元素原先类名。

jQuery 只对指定类进行操作，不影响原先的类名。

## 动画效果

### 显示隐藏

1.语法规范

```javascript
show([speed, [easing], [fn]]);
hide([speed, [easing], [fn]]);
toggle([speed, [easing], [fn]]);
```

2.显示参数

- 参数都可以省略，无动画则直接显示。

- speed：三种预定速度之一的字符串（"slow" "normal" or "fast"）或表示动画时长的毫秒数值（如：1000）。

- easing：（Optional）用来指定切换效果，默认是“swing”，可用参数“linear”。

- fn：回调函数，在动画完成时执行的函数，每个元素执行一次。

### 滑动效果

1.语法规范

```javascript
slidedown([speed, [easing], [fn]]);
slideup([speed, [easing], [fn]]);
slidetoggle([speed, [easing], [fn]]);
```

2.切换效果参数

- 参数都可以省略。

- speed：三种预定速度之一的字符串（"slow" "normal" or "fast"）或表示动画时长的毫秒数值（如：1000）。

- easing：（Optional）用来指定切换效果，默认是“swing”，可用参数“linear”。

- fn：回调函数，在动画完成时执行的函数，每个元素执行一次。

### 事件切换

```javascript
hover([over], out);
```

事件切换就是鼠标经过和离开的复合写法。

- over：鼠标移到元素上要触发的函数（相当于 mouseenter）

- out：鼠标移出元素要出发的函数（相当于 mouseleave）

- 如果只写一个函数，那么鼠标经过和鼠标离开都会触发这个函数。

### 动画队列及停止

```javascript
stop();
```

- stop()方法用于停止动画效果。

- 注意：stop()写到动画或者效果前面，相当于停止结束上一次的动画。

### 淡入淡出效果

```javascript
fadeIn([spped], [easing], [fn]);
fadeOut([spped], [easing], [fn]);
faddToggle([spped, [easing], [fn]]);
```

- 参数都可以省略。

- speed：三种预定速度之一的字符串（"slow" "normal" or "fast"）或表示动画时长的毫秒数值（如：1000）。

- easing：（Optional）用来指定切换效果，默认是“swing”，可用参数“linear”。

- fn：回调函数，在动画完成时执行的函数，每个元素执行一次。

```javascript
faddTo([spped],opacity,[easing],[fn]])
```

- opacity 透明度必须写，取值 0-1 之间。

- speed：种预定速度之一的字符串（"slow" "normal" or "fast"）或表示动画时长的毫秒数值（如：1000）。必须写。

- easing：（Optional）用来指定切换效果，默认是“swing”，可用参数“linear”。

- fn：回调函数，在动画完成时执行的函数，每个元素执行一次。

### 自定义动画 animate

```javascript
animate(params, [speed], [easing], [fn]);
```

- params：想要更改的样式属性，以**对象**形式传递，必须写。属性名可以不带引号，如果是复合属性则需要采取驼峰命名法 borderLeft。其余参数都可以省略。

- speed：三种预定速度之一的字符串（"slow" "normal" or "fast"）或表示动画时长的毫秒数值（如：1000）。

- easing：（Optional）用来指定切换效果，默认是“swing”，可用参数“linear”。

- fn：回调函数，在动画完成时执行的函数，每个元素执行一次。

## 属性操作

### prop()

获取：

```javascript
prop("属性");
```

设置：

```javascript
prop("属性", "属性值");
```

### attr()

可获取自定义属性

获取：

```javascript
attr("属性"); //类似于原生getAttribute()
```

设置：

```javascript
attr("属性", "属性值"); //类似于原生setAttribute()
```

### 数据缓存 data()

data()方法可以在指定的元素上存取数据，并不会修改 DOM 元素结构。一旦页面刷新，之前存放的数据全部清除。

获取：

```javascript
data("key");
```

添加：

```javascript
data("key", "value");
```

同时也可以读取 H5 自定义属性 data-index，得到的是 Number

### :checked 选择器

查找被选中的表单元素

## 内容文本值

### html()

相当于原生 innerHTML

html() //获取元素内容

html("内容") //设置元素的内容

### text()

相当于原生 inner Text

text() //获取文本内容

text("内容") //设置文本内容

### val()

相当于原生 value

val() //获取表单值

val("内容") //设置表单值

## 元素操作

### 遍历元素

隐式迭代默认对同一类元素做了同样操作，如果需要设置不同操作，需要遍历。

```javascript
$("div").each(function (index, domEle) {
  xxx;
});
```

index：每个元素的索引号；domEle：每个 DOM 元素对象，不是 jQuery 对象。

要想使用 jQuery 方法，需要转换：$(domEle)。

```javascript
$.each(object, function (index, element) {
  xxx;
});
```

1. $.each()方法可用于遍历任何对象。主要用于数据处理，比如数组、对象。

2. 里面的函数有 2 个参数：index 是索引号；element 遍历内容

3. 功能比较强大，可以遍历数组、对象。

### 创建元素

语法：

```javascript
$("<li></li>");
```

### 添加元素

1. 内部添加

```javascript
element.append("内容");
```

类似于原生 appendChild

2. 外部添加

```javascript
element.after("内容"); //把内容放入目标元素后面
element.before("内容"); //把内容放入目标元素前面
```

- 内部添加元素，生成之后，它们是父子关系。

- 外部添加元素，生成之后，它们是兄弟关系。

### 删除元素

```javascript
element.remove(); //删除匹配元素自身
element.empty(); //删除匹配元素集合中的所有子节点
element.html(""); //清空匹配的元素内容
```

第二行和第三行都为清空，效果相同。

## 尺寸位置操作

### 尺寸操作

| 语法                                 | 用法                                                |
| :----------------------------------- | :-------------------------------------------------- |
| width() / height()                   | 取得匹配元素宽度和高度值，只算 width / height       |
| innerWidth() / innerHeight()         | 取得匹配元素宽度和高度值 包含 padding               |
| outerWidth() / outerHeight()         | 取得匹配元素宽度和高度值 包含 padding、border       |
| outerWidth(true) / outerHeight(true) | 取得匹配元素宽度和高度值 包含 padding border margin |

### 位置操作

1. offset() 设置或获取元素偏移

- 返回被选元素相对于文档的偏移坐标，跟父级无关。

- offset().left offset().top

- 可设置元素偏移 offset({top:10 , left: 30 });

2. position() 获取距离带有定位父级位置的偏移

- 如果没有定位父级，以文档为准

- 可读不可写

3. scrollTop()/scrollLeft() 设置或获取被卷去头部或左侧

- scrollTop()设置或返回被选元素被卷去头部。

- 页面滚动条滚动长度 $(document).scrollTop()。

## 事件操作

### 事件注册

单个事件注册

```javascript
element.事件(function () {});
$("div").click(function () {});
```

其他事件和原生基本一致。

### 事件处理 on

on()方法在匹配元素上绑定一个或多个事件的函数

```javascript
element.on(events, [selector], fn);
```

- events：一个或多个用空格分隔的事件类型。

- selector：元素的子元素选择器。

- fn：回调函数。

优势 1：可以绑定多个事件，多个处理程序

```js
$("div").on({
  mouseover: function () {},
  mouseout: function () {},
  click: function () {},
});
```

如果处理程序相同

```js
$("div").on("mouseover mouseout", function () {
  $(this).toggleClass("current");
});
```

优势 2：

事件委派。子元素绑定事件可委派给父元素，把原来加给子元素身上的事件绑定在父元素身上，当父元素内部的子元素满足触发条件时再触发

```js
$("ul").on("click", "li", function () {
  alert("hello world");
});
```

在此之前有 bind()，live()，delegate()等方法来处理事件绑定或事件委派，最新版本用 on。

优势 3：

动态创建的元素，click()没有办法绑定事件，on()可以给动态生成的元素绑定事件。

### 事件处理 off

off()方法可以移除通过 on()方法添加的事件处理程序。

```js
$("p").off(); // 解绑p元素所有事件处理程序
$("p").off("click"); // 解绑p元素上面的点击事件
$("ul").off("click", "li"); // 解绑事件委托
```

如果有的事件只想触发一次，可以使用 one()来绑定事件。

### 自动触发事件

有些事件希望自动触发，比如轮播图自动播放跟点击右侧按钮一致。可以利用定时器自动触发右侧按钮点击事件。

```javascript
element.click(); //第一种简写

element.trigger("type"); //第二种自动触发模式
$("p").on("click", function () {
  alert();
});
$("p").trigger("click");

element.triggerHandler(type); //第三种自动触发模式
```

第三种自动触发模式不会触发元素默认行为

例如不会触发 input 光标焦点闪烁事件

### 事件对象

```javascript
element.on(events, [selector], function (event) {});
```

阻止默认行为：event.preventDefault() return false

阻止冒泡：event.stopPropagation()

## 对象拷贝

将对象拷贝（合并）给另外一个对象使用，此时可以使用$.extend()方法

```javascript
$.extend([deep], target, object1, [objectN]);
```

1. deep：true 深拷贝；false 默认 浅拷贝。

2. target：要拷贝的目标对象。

3. object1：待拷贝到第一个对象的对象。

4. ObjectN：待拷贝的第 N 个对象的对象。

5. 浅拷贝：把被拷贝对象复杂数据类型的地址拷给目标对象，修改目标对象会影响被拷贝对象。冲突属性会覆盖掉。

6. 深拷贝：前面加 true，完全克隆（拷贝对象而不是地址），修改目标不会影响被拷贝对象。不冲突属性会合并。

## 多库共存

jQuery 使用`$` 作为标识符，其他 js 也会用$()作为标识符，这样一起使用会冲突。

需求：需要一个解决方案，让 jQuery 和其他的 js 库不冲突，可以同时存在。

解决方案：

1. 把里面的$符号统一改为 jQuery。例如 jQuery("div")

2. jQuery 变量规定新名称：$.noConflict() var xx = $.noConflict();

## 插件封装

### 局部封装

```javascript
$.fn.extend({
  fun: function () {
    xxxxx;
  },
});
```

封装完成后，fun 即为对象方法。

### 全局封装

```javascript
$.extend({
  fun: function () {
    xxxxx;
  },
});
```

封装完成后，$.fun 即为全局方法。
