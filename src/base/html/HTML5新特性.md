---
title: HTML5新特性
order: 2
category: false
tag:
  - HTML5
---

## 新增 input 特性

autocomplete:规定是否使用输入字段的自动完成功能。主要作用为自动填充，提交之后后退表单属性保留。

autofocus:规定输入字段在页面加载时是否获得焦点。

multiple:允许多选。如果使用该属性，则允许一个以上的值。

pattern:规定输入字段的值的正则表达式。

placeholder:规定帮助用户填写输入字段的提示。

readonly:指示字段的值初始化后无法被修改。

required:指示输入字段的值是必需的。

step:规定输入字的合法数字间隔。

list:引用包含输入字段的预定义选项的 datalist。与 datalist 标签配合使用组成下拉框。

list 示例代码：

```html
<div>
  <input list="browsers" name="browser" />
  <datalist id="browsers">
    <option value="Internet Explorer" />
    <option value="Firefox" />
    <option value="Chrome" />
    <option value="Opera" />
    <option value="Safari" />
  </datalist>
</div>
```

效果：

<div>
  <input list="browsers" name="browser">
  <datalist id="browsers">
    <option value="Internet Explorer" />
    <option value="Firefox" />
    <option value="Chrome" />
    <option value="Opera" />
    <option value="Safari" />
  </datalist>
</div>

formaction:

![formaction](https://misaka10032.oss-cn-chengdu.aliyuncs.com/HTML/formaction)

**新 type 属性**:

![新增input特性](https://misaka10032.oss-cn-chengdu.aliyuncs.com/HTML/%E6%96%B0input%E7%89%B9%E6%80%A7)

<form action-="">
  text<input type= "text" autofocus="autofocus"><br>
  email<input type=" email"><!-- IOS --><br>
  url<input type="url" disabled="disabled"> <br>
  TEL <input type="tel"><br>
  search<input type="search"><br>
  number<input type="number"><br>
  范围<input type="range"><br>
  颜色<input type="color"><br>
  月<input type="month" required="required"><br>
  周<input type="week"><br>
  日期<input type="date"><br>
  时间<input type="time"><br>
  日期时间<input type="datetime"><br>
  当地日期时间<input type="datetime-local"><br>
  <input type="submit">
</form>

<br>

## 新增结构化标签

新结构标签，实质上为语义标签，便于盒子模型的理解，提高网页的 SEO（中文名：搜索引擎优化，有利于提高网站访问量）

`<header>`：头部

`<nav>`：导航栏

`<article>`：带标题、主体内容的一大段文章

`<aside>`：侧边栏

`<section>`：章节栏

`<section>`：章节栏

`<hgroup>`：分组。使用 `<hgroup>` 标签对网页或区段（section）的标题进行组合

`<footer>`：尾部

`<figure></figure>`：用作文档中插图的图像

`<hr>`：生成灰色水平分割线，自动居中对齐。宽度高度可重新设置

`<pre>`：被包围在 pre 元素中的文本通常会保留空格和换行符。而文本也会呈现为等宽字体

`<fieldset>`：与`<legend>`标签配合使用。`<fieldset>`标签内包含`<legend>`标签和其他标签，`<legend>`内文本作为标题，其他标签作为正文，生成一个包含特殊边界的框

示例代码:

```html
<fieldset>
  <legend>legend标题</legend>
  <p><正文文本/p></p>
</fieldset>
```

效果：

<fieldset>
  <legend>legend标题</legend>
  <p>正文文本</p>
</fieldset>

## 视频标签 video

语法

```html
<video src="文件地址" controls="controls"></video>
```

| 属性 | 值 | 描述 |
| :---- | :---- | :---- |
| autoplay | autoplay | 如果出现该属性，则视频在就绪后马上播放。 |
| controls | controls | 如果出现该属性，则向用户显示控件，比如播放按钮。 |
| height | pixels | 设置视频播放器的高度。 |
| loop | loop | 如果出现该属性，则当媒介文件完成播放后再次开始播放。 |
| muted | muted | 规定视频的音频输出应该被静音。 |
| poster | URL | 规定视频下载时显示的图像，或者在用户点击播放按钮前显示的图像。 |
| preload |	preload | 如果出现该属性，则视频在页面加载时进行加载，并预备播放。<br>如果使用 "autoplay"，则忽略该属性。 |
| src | url |	要播放的视频的 URL。 |
| width | pixels | 设置视频播放器的宽度。 |

## 音频标签 audio


