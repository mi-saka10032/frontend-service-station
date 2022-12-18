---
title: BOM
order: 5
category: false
tag:
  - Javascript基础
  - 浏览器顶级对象
  - 浏览器操作
---

全称 Browser Object Model 浏览器对象模型

BOM 可以使我们通过 JS 来操作浏览器

在 BOM 中为我们提供了一组对象，用来完成对浏览器的操作

## BOM 对象

### Window：

整个浏览器的窗口，同时也是网页中的全局对象。

下面的 Navigator、Location 这些对象都属于 window 属性。

#### 事件

1. onload

window.onload 是窗口 (页面）加载事件，当文档内容完全加载完成会触发该事件(包括图像、脚本 文件、CSS 文件等)。

注意：

1.有了 window.onload ，就可以把 JS 代码写到页面元素的上方，因为 onload 是等页面内容全 部加载完毕，再去执行处理函数

2.window.onload 传统注册事件方式 只能写一次，如果有多个，会以最后一个 window.onload 为准

3.如果使用 addEventListener 则没有限制

<br>

2. onresize

window.onresize 是调整窗口大小加载事件, 当触发时就调用的处理函数。

1.只要窗口大小发生像素变化，就会触发这个事件

2.经常利用这个事件完成响应式布局

3.window.innerWidth：获取当前屏幕的宽度

#### 方法

1. open()

打开新窗口

语法：

window.open(URL,name,parameters)

URL 为子窗口页面地址

name 为子窗口句柄

parameters 为窗口参数(各参数用逗号分隔)

<br>

2. close()

close() 方法用于关闭浏览器窗口。

<br>

3. **setInterval()**

按照指定的周期（以毫秒计）来调用函数或计算表达式。

参数：

1.回调函数，该函数每隔一段时间被调用一次。

2.每次调用间隔的时间，单位毫秒。

返回值：一个 Number 类型的数据。数字用来作为定时器的唯一标识。

<br>

4. clearInterval()

关闭一个定时器

方法中需要一个定时器的标识作为参数，这样将关闭标识对应定时器。

clearInterval()可以接收任意参数，如果参数标识有效，则停止对应定时器。

如果参数无效，则不执行。

<br>

5. setTimeout()

延时调用一个函数，不马上执行，而是隔一段时间以后再执行。

与定时调用区别：定时调用执行多次，延时调用只执行一次。

### Navigator

当前浏览器的信息，通过该对象可以识别不同浏览器。由于历史原因，Navigator 对象中大部分属性已经不能帮助识别浏览器了。

一般只会使用 userAgent（字符串）来判断浏览器信息

userAgent：包含浏览器信息内容，不同浏览器内容不同。

IE11 已去除微软和 IE 相关标识，现在也不能通过 userAgent 识别浏览器是否为 IE 了。

现在常通过一些浏览器中特有对象，判断浏览器信息。

比如：ActiveXObject

### Location：

当前浏览器的地址栏信息。通过它可以获取地址栏信息，操作浏览器跳转页面。

直接打印 location：获取到地址栏信息（当前页面的完整路径）。

修改 location 为完整路径 or 相对路径，会自动跳转到该路径，并且生成相应历史记录。

| 属性     | 描述                                        |
| :------- | :------------------------------------------ |
| hash     | 设置或返回从井号（#）开始的 URL（锚）       |
| host     | 设置或返回主机名和当前 URL 的端口号         |
| hostname | 设置或返回当前 URL 的主机名                 |
| href     | 设置或返回完整的 URL                        |
| pathname | 设置或返回当前 URL 的路径部分               |
| port     | 设置或返回当前 URL 的端口号                 |
| protocol | 设置或返回当前 URL 的协议                   |
| search   | 设置或返回从问号（?）开始的 URL（查询部分） |

| 属性      | 描述                                                                                 |
| :-------- | :----------------------------------------------------------------------------------- |
| assign()  | 跳转到其他页面，作用和直接修改 location 一样                                         |
| reload()  | 重新加载当前页面，作用和刷新一样。方法中传递 true，强制清空缓存刷新页面              |
| replace() | 使用一个新的页面替换当前页面，调用完毕后跳转页面。不会生成历史记录，不能使用回退按钮 |

#### 从输入 URL 到页面加载的全过程

1.DNS 域名解析

2.建立 TCP 连接

3.发送 HTTP 请求

4.服务器返回响应结果（处理请求并返回 HTTP 报文）

5.浏览器解析 THML

6.浏览器渲染页面

7.连接结束

### History

浏览器的历史记录，可以通过该对象操作浏览器的历史记录。由于隐私原因，该对象不能获取到具体历史记录，只能操作浏览器向前 or 向后翻页。而且该操作只在当次访问时有效。

| 属性   | 描述                            |
| :----- | :------------------------------ |
| length | 返回浏览器历史列表中的 URL 数量 |

| 方法      | 描述                              |
| :-------- | :-------------------------------- |
| back()    | 加载 history 列表中的前一个 URL   |
| forward() | 加载 history 列表中的下一个 URL   |
| go()      | 加载 history 列表中的某个具体页面 |

go()

跳转到指定页面

需要一个整数作为参数：

1：向前跳转1个页面 等于forward()

2：向前跳转2个页面

-1：向后跳转一个页面 等于back()

-2：向后跳转2个页面

### Screen：

用户的屏幕信息，可获取到用户的显示器相关信息。（用的较少）。

### 总结

这些BOM对象在浏览器中都是作为window对象的属性保存的，可以通过window对象来使用，也可以直接使用。

## 定时器应用

### 思想

定时器设置，通过启动/停止事件给定时器设置关键值，用于启动和停止定时器。

定时器放置于事件中的时候，由于事件不断调用导致定时器叠加，所以每次定时器函数调用时必须先清除定时器再向下执行。

### 设置

定义一个变量timer，用来保存定时器标识。

参数：

obj，执行动画的对象。

attr：要执行动画的样式，比如：left top width height

target：执行动画的目标位置。

speed，移动速度。

判断speed正负值，如果从左向右移，speed为正；如果从右向左移，speed为负。

回调函数，这个函数将会在动画执行完毕之后执行。

### 两个及以上元素调用同一个定时器响应函数

无法调用同一个timer变量，因为后一个元素触发响应时总会清除前一个timer定时器。

需要给对象添加obj.timer属性，对象自己保存自己的定时器标识。

## 执行机制

### JS是单线程

单线程就意味着，所有任务需要排队，前一个任务结束，才会执行后一个任务，这样所导致的问题 是：如果 JS 执行的时间过长，这样就会造成页面的渲染不连贯，导致页面渲染加载阻塞。

### 同步和异步

同步任务：都在主线程上执行，形成一个执行栈。

异步任务：JS 的异步是通过回调函数实现的，异步任务相关回调函数添加到任务队列中（任务队列也称为消息队列）,一般而言，异步任务有以下三种类型：

1.普通事件，如 click、resize 等

2.资源加载，如 load、error 等

3.定时器，包括 setInterval、setTimeout 等

为了解决这个问题，JS 的设计者将这种耗时很长的任务先挂起，并添加到一个叫做任务队列 的处理机制中，等到其他任务执行完毕后，才会来执行它，这种任务叫做异步任务，而其他先被执 行的任务叫做同步任务。

异步任务必须指定**回调函数**，当主线程开始执行异步任务，就是执行对应的回调函数

3.执行流程

1.先执行执行栈中的同步任务

2.异步任务（回调函数）放入任务队列中

3.一旦执行栈中的所有同步任务执行完毕，系统就会按次序读取任务队列中的异步任务，于是被 读取的异步任务结束等待状态，进入执行栈，开始执行

由于主线程不断的重复获得任务、执行任务、再获取任务、再执行，所以这种机制被称为事件循环