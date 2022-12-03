---
title: CSS3新属性
order: 4
category: false
tag:
  - CSS3
  - 新属性
  - Transform
---

​ CSS3 现状：

​ 新增的 CSS3 特性有兼容性问题，ie9+才支持

​ 移动端支持优于 PC 端

​ 不断改进中

​ 应用相对广泛

## 新增选择器

### 属性选择器

属性选择器可以根据元素特定属性来选择元素，这样就可以不用借助于类或者 id 选择器。

::: code-tabs#css

@tab attribute=value

```css
/* [attribute="value"] 选择器用于选取带有指定属性和值的元素。
下例选取所有带有 target="_blank" 属性的 <a> 元素： */
a[target="_blank"] {
  background-color: yellow;
}
```

@tab attribute~="value"

```css
/* [attribute~="value"] 选择器选取属性值包含指定词的元素。

下例选取 title 属性包含 "flower" 单词的所有元素： */
[title~="flower"] {
  border: 5px solid yellow;
}
```

@tab attribute|="value"

```css
/* [attribute|="value"] 选择器用于选取指定属性以指定值开头的元素。

下例选取 class 属性以 "top" 开头的所有元素：

注释：值必须是完整或单独的单词，比如 class="top" 或者后跟连字符的，比如 class="top-text"。 */
[class|="top"] {
  background: yellow;
}
```

:::

::: code-tabs#css

@tab attribute^="value"

```css
/* [attribute^="value"] 选择器用于选取指定属性以指定值开头的元素。

下例选取 class 属性以 "top" 开头的所有元素：

提示：值不必是完整单词 */
[class^="top"] {
  background: yellow;
}
```

@tab attribute$="value"

```css
/* [attribute$="value"] 选择器用于选取指定属性以指定值结尾的元素。

下例选取 class 属性以 "test" 结尾的所有元素：

提示：值不必是完整单词！ */
[class$="test"] {
  background: yellow;
}
```

@tab attribute\*="value"

```css
/* [attribute*="value"] 选择器选取属性值包含指定词的元素。

下例选取 class 属性包含 "te" 的所有元素：

提示：值不必是完整单词！ */
[class*="te"] {
  background: yellow;
}
```

@tab 表单样式

```css
/* 若需为不带 class 或 id 的表单设置样式，属性选择器会很有用： */
input[type="text"] {
  width: 150px;
  display: block;
  margin-bottom: 10px;
  background-color: yellow;
}

input[type="button"] {
  width: 120px;
  margin-left: 35px;
  display: block;
}
```

:::

**注意：类选择器、属性选择器、伪类选择器，权重为 10**

### 结构伪类选择器

结构伪类选择器主要根据文档结构来选择器元素，常用语根据父级选择器里面的子元素

| 选择器           | 说明                                                               |
| :--------------- | :----------------------------------------------------------------- |
| E:first-child    | 选择父元素的第一个子元素                                           |
| E:last-child     | 选择父元素的最后一个子元素                                         |
| E:nth-child(n)   | 选择父元素下的第 n 个元素或奇偶元素，n 的值为“数字 \| odd \| even” |
| E:only-child     | 选择父元素中唯一的子元素（该父元素只有一个子元素）                 |
| E:first-of-type  | 选择同类型的第一个同级兄弟元素                                     |
| E:last-of-type   | 选择同类型的最后一个同级兄弟元素                                   |
| E:nth-of-type(n) | 选择同类型的第 n 个同级兄弟元素，n 的值为“数字 \| odd \| even”     |
| E:only-of-type   | 选择父元素中特定类型的唯一子元素（该父元素有多个子元素）           |
| :root            | 选择文档的根元素。在 HTML 中根元素永远是 HTML                      |
| E:not()          | 选择某个元素之外的所有元素                                         |
| E:target         | 选取页面中某个 target 元素                                         |

nth-child 和 nth-of-type 区别：

- nth-child 对父元素里面所有孩子排序选择（序号固定）先找到第 n 个孩子，然后看是否匹配。

- nth-of-type 对父元素里面指定子元素进行排序选择。先去匹配 E，然后再根据 E 找第 n 个孩子。

**注意：类选择器、属性选择器、伪类选择器，权重为 10**

### 伪元素选择器

​ 伪元素选择器可以帮助我们利用 CSS 创建新标签元素，而不需要 HTML 标签，从而简化 HTML 结构。

语法：`selector.class:pseudo-element {property:value;}`

1. first-line 伪元素

"first-line" 伪元素用于向文本的首行设置特殊样式。

```css
p:first-line {
  color: #ff0000;
  font-variant: small-caps;
}
```

**注意**："first-line" 伪元素只能用于块级元素。

**注意：** 下面的属性可应用于 "first-line" 伪元素：

- font properties
- color properties
- background properties
- word-spacing
- letter-spacing
- text-decoration
- vertical-align
- text-transform
- line-height
- clear

2. first-letter 伪元素

"first-letter" 伪元素用于向文本的首字母设置特殊样式。

```css
p:first-letter {
  color: #ff0000;
  font-size: xx-large;
}
```

**注意：** "first-letter" 伪元素只能用于块级元素。

**注意：** 下面的属性可应用于 "first-letter" 伪元素：

- font properties
- color properties
- background properties
- margin properties
- padding properties
- border properties
- text-decoration
- vertical-align (only if "float" is "none")
- text-transform
- line-height
- float
- clear

3. before 伪元素

":before" 伪元素可以在元素的内容前面插入新内容。

下面的例子在每个`<h1>`元素前面插入一幅图片：

```css
h1:before {
  content: url(smiley.gif);
}
```

4. after 伪元素

:after" 伪元素可以在元素的内容之后插入新内容。

下面的例子在每个`<h1>`元素后面插入一幅图片：

```css
h1:after {
  content: url(smiley.gif);
}
```

## 滤镜 filter

filter CSS 属性将模糊或颜色偏移等图形效果应用于元素

```css
/* 例如: filter: blur(5px);  blur模糊处理 数值越大越模糊 */
p {
  filter: blur(5px);
}
```

::: normal-demo 哀悼模式

```html
<div style="width: 300px; height: 200px">
  <p>测试文字</p>
  <p>测试文字</p>
  <p>测试文字</p>
  <p>测试文字</p>
  <p>测试文字</p>
  <p>测试文字</p>
</div>
```

```css
/* 如果需要全部页面置灰，将选择器改为html即可 */
div {
  filter: grayscale(85%) saturate(80%);
  -webkit-filter: grayscale(85%) saturate(80%);
  -moz-filter: grayscale(85%) saturate(80%);
  -ms-filter: grayscale(85%) saturate(80%);
  -o-filter: grayscale(85%) saturate(80%);
  filter: progid:DXImageTransform.Microsoft.BasicImage(grayscale=.85);
  -webkit-filter: grayscale(0.85) saturate(0.8);
}
```

:::

## calc 函数

calc()让你在声明 CSS 属性值时执行一些计算。括号里允许四则运算。

```css
/* 此处宽度为元素继承父容器的宽度的100%减去80px后的结果 */
width: calc(100% - 80px);
```

## 背景线性渐变 linear-gradient

创建一个线性渐变，需要指定两种颜色，还可以实现不同方向（指定为一个角度）的渐变效果，如果不指定方向，默认从上到下渐变。

```css
/* 从上到下，蓝色渐变到红色 */
background-image: linear-gradient(blue, red);

/* 渐变轴为45度，从蓝色渐变到红色 */
background-image: linear-gradient(45deg, blue, red);

/* 从右下到左上、从蓝色渐变到红色 */
background-image: linear-gradient(to left top, blue, red);

/* 从下到上，从蓝色开始渐变、到高度40%位置是绿色渐变开始、最后以红色结束 */
background-image: linear-gradient(0deg, blue, green 40%, red);
```

- 起始方向可以是：方位名词 或者 度数，如果省略默认就是 top。

- 背景渐变必须加浏览器私有前缀（不加前缀的方法：括号内方向位置加(to left top)。

```css
background-image: linear-gradient(blue, red);
background-image: -webkit-linear-gradient(left, blue, red);
background-image: -webkit-linear-gradient(left top, blue, red);
```

linear-gradient 非常灵活强大，可以实现很多效果如渐变花纹、进度条等（配合动画使用）。

::: normal-demo 方格背景

```html
<div class="grid"></div>
```

```css
.grid {
  height: 63px;
  background-image: linear-gradient(
      90deg,
      rgba(0, 0, 0, 0.3) 10%,
      rgba(0, 0, 0, 0) 10%
    ), linear-gradient(rgba(0, 0, 0, 0.3) 10%, rgba(0, 0, 0, 0) 10%);
  background-size: 30px 30px;
  background-color: white;
}
```

:::

::: normal-demo 棋盘背景

```html
<div class="checkerboard"></div>
```

```css
.checkerboard {
  height: 60px;
  background-image: linear-gradient(45deg, #ccc 25%, transparent 0),
    linear-gradient(45deg, transparent 75%, #ccc 0), linear-gradient(
      45deg,
      #ccc 25%,
      transparent 0
    ), linear-gradient(45deg, transparent 75%, #ccc 0);
  background-position: 0 0, -15px 15px, 15px -15px, 30px 30px;
  background-size: 30px 30px;
  background-color: white;
}
```

:::

::: normal-demo 虚线背景

```html
<div class="dotted"></div>
```

```css
.dotted {
  height: 1px;
  background-image: linear-gradient(to right, gray, gray 10px, transparent 0);
  background-size: 20px 100%;
}
```

:::

::: normal-demo 进度条

```html
<div class="process"></div>
```

```css
.process {
  height: 20px;
  background: repeating-linear-gradient(
    45deg,
    #30e8bf 25%,
    #ff8235 0,
    #ff8235 50%,
    #30e8bf 0,
    #30e8bf 75%,
    #ff8235 0
  );
  background-size: 30px 30px;
  animation: roll 1s linear infinite;
}
@keyframes roll {
  from {
    background-position-x: 0;
  }
  to {
    background-position-x: 30px;
  }
}
```

:::

## 鼠标样式 cursor

| 值        | 描述                                                                                                            |
| :-------- | :-------------------------------------------------------------------------------------------------------------- |
| url       | 需使用的自定义光标的 URL。<br>注释：请在此列表的末端始终定义一种普通的光标，<br>以防没有由 URL 定义的可用光标。 |
| default   | 默认光标（通常是一个箭头）                                                                                      |
| auto      | 默认。浏览器设置的光标。                                                                                        |
| crosshair | 光标呈现为十字线。                                                                                              |
| pointer   | 光标呈现为指示链接的指针（一只手）                                                                              |
| move      | 此光标指示某对象可被移动。                                                                                      |
| e-resize  | 此光标指示矩形框的边缘可被向右（东）移动。                                                                      |
| ne-resize | 此光标指示矩形框的边缘可被向上及向右移动（北/东）。                                                             |
| nw-resize | 此光标指示矩形框的边缘可被向上及向左移动（北/西）。                                                             |
| n-resize  | 此光标指示矩形框的边缘可被向上（北）移动。                                                                      |
| se-resize | 此光标指示矩形框的边缘可被向下及向右移动（南/东）。                                                             |
| sw-resize | 此光标指示矩形框的边缘可被向下及向左移动（南/西）。                                                             |
| s-resize  | 此光标指示矩形框的边缘可被向下移动（南）。                                                                      |
| w-resize  | 此光标指示矩形框的边缘可被向左移动（西）。                                                                      |
| text      | 此光标指示文本。                                                                                                |
| wait      | 此光标指示程序正忙（通常是一只表或沙漏）。                                                                      |
| help      | 此光标指示可用的帮助（通常是一个问号或一个气球）。                                                              |

## 2D 转换（重要）

### transform

transform 是 CSS3 中具有颠覆性的特征之一，可以实现：

- 移动:translate

- 旋转:rotate

- 缩放:scale

- 倾斜:skew

#### 1.translate

2D 移动是 2D 转换里面的一种功能，可以改变元素在页面中的位置，类似定位。

语法

```css
transform: translate(x, y);
transform: translateX(n);
transform: translateY(n);
```

- 2D 转换中的移动，沿着 X 和 Y 轴移动元素

- translate 最大的优点：不影响其他元素位置

- translate 中的百分比单位是相对于自身元素的 `translate(50%, 50%);`

- 对行内标签没有效果

#### 2.rotate

2D 旋转指的是让元素在二维平面内顺时针或逆时针旋转

```css
transform: rotate(度数);
```

- rotate 里面的度数，单位是 deg 比如 rotate(45deg)

- 角度为正时，顺时针，负数时，为逆时针

- 默认旋转的中心点是元素的中心点，需要改变中心点需加 `transform-origin` 属性

```css
transform-origin: x y;
```

- 注意后面的参数 x 和 y 用空格隔开

- x y 默认转换的中心点是元素中心点(50% 50%)

- 还可以给 x y 设置像素 或者 方位名词(top bottom left right center)

#### 3.scale

控制元素放大或缩小。

```css
transform: scale(x, y);
```

- 注意其中的 x 和 y 用逗号分隔

- transform: scale(1,1) 宽高都放大一倍，相当于没有放大

- transform: scale(2, 2) 宽高都放大 2 倍

- transform: scale(2) 只写一个参数，第二个参数默认和第一个参数一样，相当于 scale(2, 2)

- transform: scale(0.5, 0.5) 缩小 0.5 倍

- scale 缩放最大的优势：可以设置转换中心点缩放，默认以中心点缩放，不影响其他盒子

#### 4.skew

指定对象 skew transformation（斜切扭曲）。第一个参数对应 X 轴，第二个参数对应 Y 轴。如果第二个参数未提供，则默认值为 0

```css
transform: skew(45deg);
```

- 改属性实际上会改变方块所在的坐标系

- 在上面虽然设置的是 x 轴斜切角度，实际拉伸的是 y 坐标轴

- 同理，当在设置 y 轴时，实际 x 轴被拉伸。

#### 5.复合写法

- 同时使用多个转换，其格式为：transform: translate() rotate() scale() ……等

- 其顺序会影响转换的效果（先旋转会改变坐标轴方向）。

- 当我们同时有位移和其他属性的时候，记得要将位移放到最前。

### transition

transition 是 CSS3 中具有颠覆性的特征之一，我们可以在不适用 Flash 动画或 JS 的情况下， 当元素从一种样式变换为另一种样式时为元素添加效果。

过渡动画：是从一个状态渐渐的过渡到另一个状态。

低版本浏览器（ie9 以下版本）但是不会影响页面布局。

现在经常和:hover 一起搭配使用。

```css
transition: 要过渡的属性 花费时间 运动曲线 何时开始：;
```

1. 属性：想要变化的属性，宽高 背景 内外边距都可以。如果想要所有的属性都变化过渡，写一个 all 就可以。

2. 花费时间：单位是秒（必须写单位）比如 0.5s

3. 运动曲线：默认是 ease（可以省略）

4. 何时开始：单位是秒（必须写单位）可以设置延迟触发事件 默认是 0s（可以省略）

### animation

动画是 CSS3 中具有颠覆性的特征之一，可通过设置多个节点来精确控制一个或一组动画，常用来实现复杂的动画效果。

​ 相比较过渡，动画可以实现更多变化，更多控制，连续自动播放等效果。

#### 1、定义动画

1. keyframes 定义动画（类似定义类选择器）

- 0%是动画的开始，100%是动画的完成。这样的规则就是动画序列。

- 在 @keyframes 中规定某项 CSS 样式，就能创建由当前样式逐渐改为新样式的动画效果。

- 动画是使元素从一种样式逐渐变化为另一种样式的效果，可以改变任意多的样式和任意多的次数。

- 请用百分比来规定变化发生的时间，或用关键词 from 和 to，等同于 0%和 100%。

#### 2.调用动画

语法：

animation: name duration timing-function delay iteration-count direction fill-mode

| 属性                      | 描述                                                                |
| :------------------------ | :------------------------------------------------------------------ |
| @keyframes                | 规定动画                                                            |
| animation                 | 所有动画属性的简写属性（类比于 font background）                    |
| animation-name            | 规定@keyframes 动画名称（必需）                                     |
| animation-duration        | 规定动画完成一个周期所花费的秒或毫秒，默认 0（必需）                |
| animation-timing-function | 规定动画速度曲线，默认是 ease                                       |
| animation-delay           | 规定动画延时开始的时机，默认是 0                                    |
| animation-iteration-count | 规定动画被播放的次数，默认是 1，循环播放为 infinite                 |
| animation-direction       | 规定动画是否在下一周期逆向播放，默认是 normal（alternate 为逆播放） |
| animation-play-state      | 规定动画是否运行或暂停，默认是 running，以及 paused                 |
| animation-fill-mode       | 规定动画结束后状态，保持 forwards，回到起始位置 backwards           |

- 简写属性里面不包含 animation-play-state

- 暂停动画：animation-play-state: paused; 经常和鼠标经过等其他配合使用

- 想要动画**走回来**，而不是直接**跳回来**：animation-direction: alternate

- 盒子动画结束后，停在结束位置：animation-fill-mode: forwards

#### 3.关于速度曲线

animation-timing-function：规定动画的速度曲线，默认是"ease"

| 值                        | 描述                                                                                                                                                                                                                                                                                                                                                             |
| :------------------------ | :--------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| linear                    | 动画从头到尾速度相同，匀速                                                                                                                                                                                                                                                                                                                                       |
| ease                      | 默认。动画以低速开始，然后加快，结束前变慢                                                                                                                                                                                                                                                                                                                       |
| ease-in                   | 动画以低速开始                                                                                                                                                                                                                                                                                                                                                   |
| ease-out                  | 动画以低速结束                                                                                                                                                                                                                                                                                                                                                   |
| ease-in-out               | 动画以低速开始和结束                                                                                                                                                                                                                                                                                                                                             |
| steps(int,start \| end)   | 指定了时间函数中的间隔数量（步长）。有两个参数，第一个参数指定函数的间隔数，该参数是一个正整数（大于 0）。 第二个参数是可选的，表示动画是从时间段的开头连续还是末尾连续。含义分别如下：<li>start：表示直接开始。</li><li>end：默认值，表示戛然而止。</li>                                                                                                        |
| cubic-bezier(P0,P1,P2,P3) | 在 cubic-bezier（贝塞尔曲线） 函数中自己的值。可能的值是从 0 到 1 的数值。<li>P0 和 P3 是曲线的起点和终点。P0 是（0,0）并且表示初始时间和初始状态，P3 是（1,1）并且表示最终时间和最终状态。</li><li>需要关注的是 P1(P0 点的导数)和 P2（P3 点的导数）两点的取值，而其中 x 轴的取值范围是 0 到 1。当取值超出范围时 cubic-bezier 将失效；Y 轴的取值没有规定。 </li> |

## 3D 转换

特点：近大远小，物体后面遮挡不可见。

三维坐标系：x 轴水平向右 → 正值；y 轴垂直向下 → 正值；z 轴垂直屏幕朝外 → 正值。

### transform-style

- 控制子元素是否开启三维立体环境。

- transform-style: flat; 子元素不开启 3d 立体空间，默认

- transform-style: preserve-3d; 子元素开启立体空间

- 代码写给父级，但影响的是子元素

### translate3d

- transform: translateX(100px); 仅在 X 轴上移动

- transform: translateY(100px); 仅在 Y 轴上移动

- transform: translateZ(100px); 仅在 Z 轴上移动(translateZ 一般用 px 单位)

- transform: translate3d(x,y,z); x、y、z 分别指要移动的轴方向的距离

### rotate3d

3D 旋转可以让元素在三维平面内沿着 x、y、z 轴或者自定义轴旋转。

- transform: rotateX(45deg); 沿着 X 轴正向旋转 45 度

- transform: rotateY(45deg); 沿着 Y 轴正向旋转 45 度

- transform: rotateZ(45deg); 沿着 Z 轴正向旋转 45 度

- transform: rotate3d(x,y,z,deg); 沿着自定义轴旋转 deg 的角度

- transform: rotate3d(1,0,0,45deg); 沿着 X 轴旋转 45deg

- transform: rotate3d(1,1,0,45deg); 沿着对角线旋转 45deg

**旋转左手准则**：左手拇指指向坐标轴的正方向

### perspective

- 定义：3D 元素距视图的距离，以像素计。该属性允许您改变 3D 元素查看 3D 元素的视图。当为元素定义 perspective 属性时，其子元素会获得透视效果，而不是元素本身。

- 取值：

1. 指定观察者距离「z=0」平面的距离，为元素及其内容应用透视变换。

2. 不允许负值。

3. none：不指定透视。

![perspective](https://misaka10032.oss-cn-chengdu.aliyuncs.com/CSS/perspective.png)
