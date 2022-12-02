---
title: CSS属性
order: 2
category: false
tag:
  - CSS属性
  - 基本属性
---

## 1.显示属性

元素显示模式就是元素（标签）以什么方式进行显示。

HTML 元素一般分为块元素和行内元素两种类型。

### 块元素

常见块元素 h1~h6 p div ul ol li，其中 div 是最典型的块元素。

特点：

1. 比较霸道，自己独占一行。

2. 高度、宽度、外边距以及内边距都可以控制。

3. 宽度默认是容器（父级宽度）的 100%。

4. 是一个容器及盒子，里面可以放行内或者块级元素。

**注意：**

- 文字类的元素内不能使用块级元素。

- `<p>`标签主要用于存放文字，因此`<p>`里面不能放块级元素，特别不能放`<div>`。h1~h6 这种文字类块级元素也不能放其他块级元素。

### 行内元素

常见行内元素 a strong b em i del s ins u span，其中 span 是最典型的行内元素，也称为内联元素。

特点：

1. 相邻行内元素在一行上，一行可以显示多个。

2. 高、宽度直接设置无效。

3. 默认宽度为本身内容的宽度。

4. 行内元素只能容纳文本或其他行内元素。

注意：

- 链接里面不能再放链接。

- 特殊情况链接`<a>`里面可以放块级元素，但是转换块级模式更安全。

### 行内块元素

`<img />` `<input />` `<td>`，同时具有块元素和行内元素的特点，有些资料称为行内块元素。

特点：

1. 和相邻行内元素（行内块）在一行上，但是他们之间会有空白缝隙。一行可以显示多个（行内元素特点）。

2. 默认宽度是本身内容宽度（行内元素特点）。

3. 高度、行高、外边距以及内边距都可以控制（块级元素特点）。

<br>

**元素显示模式总结**

| 元素模式   | 元素排列               | 设置样式               | 默认宽度         | 包含                   |
| :--------- | :--------------------- | :--------------------- | :--------------- | :--------------------- |
| 块级元素   | 一行只能放一个块级元素 | 可以设置宽度高度       | 容器的 100%      | 容器级可以包含任何标签 |
| 行内元素   | 一行可以放多个行内元素 | 不可以直接设置宽度高度 | 它本身内容的宽度 | 容纳文本或其他行内元素 |
| 行内块元素 | 一行放多个行内块元素   | 可以这是宽度高度       | 它本身内容的宽度 |                        |

### 元素显示模式转换

块元素转换：display: block;

行内元素转换：display: inline;

行内块元素转换：display:inline-block;

### 小技巧 单行文字垂直居中代码

CSS 没有提供文字垂直居中代码，实现方法：让文字的行高 line-height == 盒子高度 div.height。

## 2.字体属性

字体属性定义 字体系列、大小、粗细和文字样式。

### 字体系列 font-family

CSS 使用 font-family 属性定义文本的字体系列。

各字体之间必须使用英文逗号隔开。

一般情况下，如果有空格隔开的多个单词组成的字体，加引号。

尽量使用系统默认自带字体，保证任何用户浏览器都能正确显示。

最常见的字体：

`body{font-family:’Microsoft YaHei’,tahoma,arial,’Hiragino Sans GB’;}`

### 字体大小 font-size

CSS 使用 font-size 属性定义字体大小。

px（像素）大小是我们网页的最常用的单位。谷歌浏览器默认 16px。

不同浏览器可能默认显示的字号大小不一致，尽量给一个明确值大小，不要默认太小。

可以给 body 指定整个页面文字的大小。

### 字体粗细 font-weight

CSS 使用 font-weight 属性设置文本字体的粗细。

参数：

normal number400

bold number700

bolder IE5 + 特粗体

lighter IE5 + 细体

number IE5 + 100 200 300 ……

实际开发中，提倡使用数字表示加粗或者变细。

### 文本风格 font-style

CSS 使用 font-style 属性设置文本的风格。

属性值：

normal 默认值，浏览器显示标准样式 font-style: normal;

italic 浏览器会显示斜体的字体样式。

**注意**：平时很少给文字加斜体，反而要给斜体标签改不倾斜字体

### font 属性复合使用

font:font-sytle font-variant font-weight font-size/line-height font-family;

顺序依次为 风格 粗细 大小 样式。不能颠倒顺序，属性间以空格隔开。必须至少保留 font-size 和 font-family 属性。

### 新增 variant 属性

用于设置小型大写字母的字体显示文本。

属性值：normal 默认；small-caps 浏览器显示小型大写字母的字体。

<br>

**字体属性总结**

| 属性        | 表示     | 注意点                                                                 |
| :---------- | :------- | :--------------------------------------------------------------------- |
| font-size   | 字号     | 我们通常用的单位是 px 像素，一定要跟上单位                             |
| font-family | 字体     | 实际工作中按照团队约定来写字体                                         |
| font-weight | 字体粗细 | 记住加粗是 700 或者 bold，不加粗是 normal 或者 400，记住数字不要跟单位 |
| font-style  | 字体样式 | 记住倾斜是 italic，不倾斜是 normal，工作中我们最常用 normal            |
| font        | 字体连写 | 1.字体连写是有顺序的，不能随意换位置 2.其中字号和字体必须同时出现      |

## 4.文本属性

CSStext 文本属性可定义文本外观（颜色、对齐文本、装饰文本、文本缩进、行间距等）。

### 文本颜色 color

表示：预定义颜色、**十六进制（`#FF0000`）**（最常用）、RGB 代码(rgb(255,0,0)或者 rgb(100%,0%,0%))。

### 对齐文本 text-align

用于设置元素内文本内容的水平对齐方式。

left 左对齐（默认） right 右对齐 center 居中对齐

### 装饰文本 text-decoration

规定添加到文本的修饰。可添加下划线、删除线、上划线等。

none 默认无装饰线 underline 下划线，链接 a 自带下划线

overline 上划线（几乎不用） line-through 删除线（不常用）

### 文本缩进 text-indent

指定文本的第一行缩进，通常是将段落的首行缩进。

px:像素单位 em:相对单位，相对当前元素的倍数。

### 行间距 line-height

设置行间距离（行高）。控制文字行与行之间的距离。

行间距=上间距+文本高度+下间距。

<br>

**文本属性总结**

| 属性            | 表示     | 注意点                                                  |
| :-------------- | :------- | :------------------------------------------------------ |
| color           | 文本颜色 | 我们通常用 十六进制 比如 而且是简写形式 `#fff`          |
| text-align      | 文本对齐 | 可以设定文字水平的对齐方式                              |
| text-indent     | 文本缩进 | 通常我们用于段落首行缩进 2 个字的距离 text-indent: 2em; |
| text-decoration | 文本修饰 | 记住 添加下划线 underline 取消下划线 none               |
| line-height     | 行高     | 控制行与行之间的距离                                    |

## 4.背景属性

通过背景属性，可以给页面元素添加背景样式。

背景属性可以设置背景颜色、背景图片、背景平铺、背景图片位置、背景图像固定等。

### 背景颜色 background-color

背景颜色为红色：`{ background-color: red }`

一般情况下背景颜色默认值 transparent（透明）。

### 背景图片 background-image

实际开发常见于 logo 或者一些装饰性的小图片或者超大背景图，优点是非常便于控制位置（精灵图也是一种运用场景）。

`{ background-image: none | url (url) }` （默认平铺）

### 背景平铺 background-repeat

对背景图像实现平铺。

`{ background-repeat: repeat | no-repeat | repeat-x | repeat-y }`

### 背景图片位置 background-position

改变图片在背景中的位置。

`{ background-position: x y; }`

x 坐标和 y 坐标，可以使用方位名词或精确单位。

1. 参数是方位名词

- 前后顺序无关：left top / top left 效果一致。

- 只指定了一个方位名词，另一个值省略，第二个值默认居中对齐。

2. 参数是精确单位

- 第一个是 x 坐标，第二个是 y 坐标。

- 只指定一个数值，那该数值一定是 x 坐标，y 坐标默认垂直居中。

3. 参数是混合单位

- 方位名词和精确单位混用，第一个是 x 坐标，第二个是 y 坐标。

### 背景图像固定 background-attachment

设置背景图像是否固定或者随着页面的其余部分滚动。后期可以制作视差滚动效果。

`{ background-attachment: scroll | fixed 滚动/固定 }`

### 背景复合写法

简写属性没有特定书写顺序，一般书写规范：

**background:背景颜色 图片地址 背景平铺 背景图像滚动 背景图片位置**。

### 背景色半透明

`{ background: rgba(0, 0, 0, 0.3); }`（一般习惯把 0.3 的 0 省略掉）

最后一个参数是 alpha 透明度，取值范围 0~1。

**背景总结**

| 属性                  | 作用               | 值                                                |
| :-------------------- | :----------------- | :------------------------------------------------ |
| background-color      | 背景颜色           | 预定义的颜色值/十六进制/RGB(A)代码                |
| background-image      | 背景图片           | url(图片路径)                                     |
| background-repeat     | 是否平铺           | repeat/no-repeat/repeat-x/repeat-y                |
| background-position   | 背景位置           | length/position 分别是 x 和 y 坐标                |
| background-attachment | 背景附着           | scroll（背景滚动）/fixed（背景固定）              |
| 背景简写              | 书写更简单         | 背景颜色 背景图片地址 背景平铺 背景滚动 背景位置; |
| 背景色半透明          | 背景颜色<br>半透明 | background: rgba(0,0,0,0.3); 后面必须是 4 个值    |

## 5.边框属性

1. 边框组成：边框宽度（粗细）、边框样式、边框颜色。

2. 语法：border : border-width border-style border-color

border-style: none | hidden | dotted | dashed | solid | double | groove | ridge | inset | outset

**详细参数**

none: 无边框。与任何指定的 border-width 值无关

hidden：隐藏边框。IE 不支持

dashed：虚线边框，当 border 不定义边框指定的一面，就默认四条边都是实线边框。也可以虚线跟实线定义

dotted：虚线边框，dashed 是短竖线，而 dotted 边框是由点组成的。主要还是点状的频率不同，dotted 频度高，dashed 的频度偏小

solid：实线边框

double：双线边框。两条单线与其间隔的和等于指定的 border-width 值

groove：根据 border-color 值画 3D 凹槽

ridge：根据 border-color 值画菱形边框

inset：根据 border-color 值画 3D 凹边

outset：根据 border-color 值画 3D 凸边

**常用：solid dashed dotted**

<br>

**额外内容：表格细线边框 border-collapse**

语法：border-collapse: collapse; 相邻边框合并在一起。

因为常态下边框会额外增加盒子的实际大小，解决方案：

1. 测量盒子大小的时候，不量边框。

2. 如果测量的时候包含了边框，则需要宽高减去边框厚度。

## 6.边框扩展与阴影属性

### 圆角边框 border-radius

语法：border-radius: length;

- 参数值可以为数值或百分比的形式。

- 正方形设置为一个圆，数值修改为高度或宽度的一半，或直接写 50%。

- 矩形设置高度的一半就可以。

- 该属性是一个简写属性，可以跟四个值，分别代表左上角、右上角、右下角、左下角。

### 盒子阴影 box-shadow

语法：box-shadow: h-shadow v-shadow blur spread color inset;

| 值 | 描述 |
| :---- | :---- |
| h-shadow | 必需。水平阴影的位置，允许负值 |
| v-shadow | 必需。垂直阴影的位置，允许负值 |
| blur | 可选。模糊距离 |
| spread | 可选。阴影的尺寸 |
| color | 可选。阴影的颜色，参阅CSS颜色值 |
| inset | 可选。将外部阴影(默认值outset)改为内部阴影 |


### 文字阴影 text-shadow

语法：text-shadow: h-shadow v-shadow blur color;

**多重阴影**：阴影属性之间用 逗号 隔开

| 值 | 描述 |
| :---- | :---- |
| h-shadow | 必需。水平阴影的位置，允许负值 |
| v-shadow | 必需。垂直阴影的位置，允许负值 |
| blur | 可选。模糊距离 |
| color | 可选。阴影的颜色，参阅CSS颜色值 |