---
title: CSS技巧
order: 5
category: false
tag:
  - CSS3
  - 特殊技巧
  - tips
---

## 精灵图

精灵技术主要针对于背景图片使用，就是把多个小背景图片整合到一张大图片中。

这个大图片也称为 `sprites` 精灵图或者雪碧图。

移动背景图片位置，此时可以使用 `background-position`。

移动的距离就是这个目标图片的 x 和 y 坐标，注意网页中的坐标有所不同。

因为一般情况下都是往上往左移动，所以数值是负值。

使用精灵图的时候需要精确测量，每个小背景图片的大小和位置。

**缺点**

1. 图片文件比较大

2. 图片本身放大和缩小会失真

3. 一旦图片制作完毕想要更换非常复杂

**总结**

1. 精灵图主要针对于小的背景图片使用。

2. 主要借助于背景位置来实现 `background-position`。

3. 一般情况下精灵图都是负值。（x 轴右边走是正值，左边走是负值，y 轴同理）

## 字体图标`iconfont`（重要）

提供了一种方便高效的图标使用方式，展示的是图标，本质属于字体

优点：轻量级 轻、灵活性 强、兼容性 高

三种引用方式：

​ 1. `unicode` 引用（原始）

​ 2. `font-class` 引用（`unicode` 引用的升级）

​ 3. `symbol` 引用（未来主流）但目前暂时不接触

以阿里巴巴矢量图库引用为例展示三种引用方式（以下内容取自阿里巴巴矢量库使用帮助）：

### `unicode` 引用

`unicode` 是字体在网页端最原始的应用方式，特点是：

- 兼容性最好，支持 ie6+，及所有现代浏览器。
- 支持按字体的方式去动态调整图标大小，颜色等等。

- 但是因为是字体，所以不支持多色。只能使用平台里单色的图标，就算项目里有多色图标也会自动去色。

**注意**：新版 `iconfont` 支持多色图标，这些多色图标在 `unicode` 模式下将不能使用，如果有需求建议使用 `symbol` 的引用方式

第一步：拷贝项目下面生成的 `font-face`

```css
@font-face {
  font-family: "iconfont";
  src: url("iconfont.eot");
  src: url("iconfont.eot?#iefix") format("embedded-opentype"), url("iconfont.woff")
      format("woff"), url("iconfont.ttf") format("truetype"), url("iconfont.svg#iconfont")
      format("svg");
}
```

第二步：定义使用 `iconfont` 的样式

```css
.iconfont {
  font-family: "iconfont" !important;
  font-size: 16px;
  font-style: normal;
  -webkit-font-smoothing: antialiased;
  -webkit-text-stroke-width: 0.2px;
  -moz-osx-font-smoothing: grayscale;
}
```

第三步：挑选相应图标并获取字体编码，应用于页面

```css
<i class="iconfont">&#x33;</i>
```

### `font-class` 引用

`font-class` 是 `unicode` 使用方式的一种变种，主要是解决 `unicode` 书写不直观，语意不明确的问题。

与 `unicode` 使用方式相比，具有如下特点：

- 兼容性良好，支持 ie8+，及所有现代浏览器。

- 相比于 `unicode` 语意明确，书写更直观。可以很容易分辨这个 `icon` 是什么。

- 因为使用 `class` 来定义图标，所以当要替换图标时，只需要修改 `class` 里面的 `unicode` 引用。

- 不过因为本质上还是使用的字体，所以多色图标还是不支持的。

第一步：拷贝项目下面生成的 `fontclass` 代码

```html
<link href="//at.alicdn.com/t/font_8d5l8fzk5b87iudi.css" />
```

第二步：挑选相应图标并获取类名，应用于页面：

```css
<i class="iconfont icon-xxx"></i>
```

### `symbol` 引用

这是一种全新的使用方式，应该说这才是未来的主流，也是平台目前推荐的用法。相关介绍可以参考这篇文章 这种用法其实是做了一个 `svg` 的集合，与上面两种相比具有如下特点：

- 支持多色图标了，不再受单色限制。

- 通过一些技巧，支持像字体那样，通过 `font-size`, `color` 来调整样式。

- 兼容性较差，支持 ie9+,及现代浏览器。

- 浏览器渲染 `svg` 的性能一般，还不如 `png`。

第一步：拷贝项目下面生成的 `symbol` 代码：

```html
<script src="//at.alicdn.com/t/font_8d5l8fzk5b87iudi.js" />
```

第二步：加入通用 css 代码（引入一次就行）：

```css
<style type="text/css">
    .icon {
       width: 1em; height: 1em;
       vertical-align: -0.15em;
       fill: currentColor;
       overflow: hidden;
    }
</style>
```

第三步：挑选相应图标并获取类名，应用于页面：

```html
<svg class="icon" aria-hidden="true">
  <use xlink:href="#icon-xxx"></use>
</svg>
```

## CSS 三角

### 等腰三角

::: normal-demo 等腰三角

```html
<div class="demo"></div>
```

```css
.demo {
  width: 0;
  height: 0;
  line-height: 0;
  font-size: 0;
  border: 50px solid transparent;
  border-left-color: pink;
}
```

:::

### 直角三角

::: normal-demo 直角三角

```html
<div class="tri3"></div>
<hr />
<div class="tri4"></div>
<hr />
<div class="tri5"></div>
<hr />
<div class="tri6"></div>
```

```css
.tri3 {
  width: 0;
  height: 0;
  border-color: transparent red; /*上下颜色 左右颜色*/
  border-width: 0 0 50px 50px;
  border-style: solid;
}
.tri4 {
  width: 0;
  height: 0;
  border-color: red transparent; /*上下颜色 左右颜色*/
  border-width: 0 0 50px 50px;
  border-style: solid;
}
.tri5 {
  width: 0;
  height: 0;
  border-color: red transparent; /*上下颜色 左右颜色*/
  border-width: 0 50px 50px 0;
  border-style: solid;
}
.tri6 {
  width: 0;
  height: 0;
  border-color: transparent red; /*上下颜色 左右颜色*/
  border-width: 0 50px 50px 0;
  border-style: solid;
}
```

:::

## 行内(块)垂直属性 vertical-align

经常用于设置图片或者表单（行内块元素）和文字垂直对齐

官方解释：用于设置一个元素的垂直对齐方式，但是它只针对于行内元素或者行内块元素有效。

```css
vertical-align: baseline | top | middle | bottom;
```

| 值          | 描述                                                     |
| :---------- | :------------------------------------------------------- |
| baseline    | 默认。元素放置在父元素的基线上。                         |
| sub         | 垂直对齐文本的下标。                                     |
| super       | 垂直对齐文本的上标                                       |
| top         | 把元素的顶端与行中最高元素的顶端对齐                     |
| text-top    | 把元素的顶端与父元素字体的顶端对齐                       |
| middle      | 把此元素放置在父元素的中部。                             |
| bottom      | 使元素及其后代元素的底部与整行的底部对齐。               |
| text-bottom | 把元素的底端与父元素字体的底端对齐。                     |
| length      | 将元素升高或降低指定的高度，可以是负数。                 |
| % 使用      | `line-height` 属性的百分比值来排列此元素。允许使用负值。 |
| inherit     | 规定应该从父元素继承 `vertical-align` 属性的值。         |

图片、表单默认属于行内块元素，默认的 `vertical-align` 是 `baseline` 基线对齐

此时可以给图片、表单这些行内块元素的 `vertical-align` 属性设置为 `middle` 就可以让文字和图片垂直居中对齐了。

- 图片底部默认留白缝隙解决方法

图片底侧会有一个空白缝隙，原因是行内块元素和文字的基线对齐

解决方法有两种：

​1. 给图片添加 `vertical-align:middle | top | bottom` 等（提倡使用）

1. 把图片转换为块级元素 `display: block;`

## 溢出文字省略号显示

### 单行文本溢出显示省略号

```css
overflow: hidden;（文字长度超出限定宽度，则隐藏超出的内容）
white-space: nowrap;（设置文字在一行显示，不能换行）
text-overflow: ellipsis;（规定当文本溢出时，显示省略符号来代表被修剪的文本）
```

### 多行文本溢出显示省略号

多行文本溢出显示省略号，有较大兼容性问题，适合于 webkit 浏览器或移动端（移动端大部分是 webkit 内核）

```css
-webkit-line-clamp: 2;（用来限制在一个块元素显示的文本的行数，2 表示最多显示 2 行。为了实现该效果，它需要组合其他的 WebKit 属性）
display: -webkit-box;（和 1 结合使用，将对象作为弹性伸缩盒子模型显示 ）
-webkit-box-orient: vertical;（和 1 结合使用 ，设置或检索伸缩盒对象的子元素的排列方式 ）
overflow: hidden;（文本溢出限定的宽度就隐藏内容）
text-overflow: ellipsis;（多行文本的情况下，用省略号 “…” 隐藏溢出范围的文本)
```

## 元素绝对居中方式

::: normal-demo 1.定宽高-绝对定位+负 margin 值

```html
<div class="box-wrapper">
  <div class="box-absolute-margin"></div>
</div>
```

```css
.box-wrapper {
  width: 300px;
  height: 300px;
  border: 1px solid #000;
  position: relative;
}

.box-absolute-margin {
  width: 200px;
  height: 200px;
  background-color: mediumblue;
  /* 关键因素 */
  position: absolute;
  left: 50%;
  top: 50%;
  margin-left: -100px; /*margin-left/top负值根据width和height来决定，取值为一半;*/
  margin-top: -100px;
}
```

:::

::: normal-demo 2.定宽高-绝对定位+margin auto

```html
<div class="box-wrapper">
  <div class="box-absolute-margin-auto"></div>
</div>
```

```css
.box-wrapper {
  width: 300px;
  height: 300px;
  border: 1px solid #000;
  position: relative;
}
.box-absolute-margin-auto {
  width: 200px;
  height: 200px;
  background-color: mediumblue;
  /* 关键因素 */
  position: absolute;
  left: 0;
  top: 0;
  right: 0;
  bottom: 0;
  margin: auto;
}
```

:::

::: normal-demo 3.不定宽高-绝对定位+transform

```html
<div class="box-wrapper">
  <div class="box-absolute-transform">的撒的吾问无为谓无若多</div>
</div>
```

```css
.box-wrapper {
  width: 300px;
  height: 300px;
  border: 1px solid #000;
  position: relative;
}
.box-absolute-transform {
  background-color: yellow;
  /* 关键因素 */
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%); /*向x,y移动： 移动距离为自身盒子宽高的50%*/
}
```

:::

::: normal-demo 4.不定宽高-table-cell

```html
<div class="box-wrapper box-wrapper-table-cell">
  <div class="box-table-cell">少时诵诗书所大付错</div>
</div>
```

```css
.box-wrapper {
  width: 300px;
  height: 300px;
  border: 1px solid #000;
  position: relative;
}

.box-wrapper-table-cell {
  display: table-cell;
  vertical-align: middle;
  text-align: center;
}
.box-table-cell {
  background-color: yellowgreen;
  display: inline-block;
}
```

:::

::: normal-demo 5.不定宽高-flex

```html
<div class="box-wrapper box-wrapper-flex">
  <div class="box-flex">flex的点点滴滴多多多多多多多</div>
</div>
```

```css
.box-wrapper-flex {
  display: flex;
  justify-content: center;
  align-items: center;
}
.box-flex {
  background-color: tomato;
}
```

:::
