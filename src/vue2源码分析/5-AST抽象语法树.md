---
title: AST抽象语法树
order: 5
category: false
tag:
  - AST语法树
  - Vue模板引擎
---

## 前言

Vue 在编译时会将 Vue 文件中的 template 标签内容通过 `模板语法` 编译为 `AST抽象语法树`，再直接转译为 `渲染函数(h函数)`

![语法树渲染过程](https://misaka10032.oss-cn-chengdu.aliyuncs.com/Vue/1673951133288.jpg)

渲染函数是 AST 的产物，也是 VNode 的源头

在开始手写 AST 抽象语法树之前，建议先熟悉了解[模板引擎](./4-模板引擎.html)的指针思想与栈结构遍历

本章同样也简化了 AST 语法树的源码，仅生成常规闭合标签与内部常规属性的 AST 语法树，了解模板内的插值语法详见[模板引擎](./4-模板引擎.html)

## AST 形成

AST 语法树的形成，同样围绕模板字符串的循环遍历，以及标签堆栈和内容堆栈的数据变化进行（为了便于理解此处开辟了双堆栈数组，实际源码可优化压缩至单数组）

循环过程中：

- 剩余字符串 rest 随指针移动不断缩减长度
- 首先判断 rest 开头是否满足**标签开始标签的正则**，判断通过则将标签截取并推入到标签堆栈中，内容堆栈推入一个包含标签属性和 children 空数组的对象`{ tag, children: [] }`
- 其次判断 rest 开头是否满足**标签结束标签的正则**，判断通过则将标签截取，同时标签堆栈 pop 出栈顶标签，判断截取后标签与出栈标签是否相同
  - 截取标签与出栈标签相同，说明开始与闭合标签对得上，此时让内容堆栈的栈顶对象(pop_arr)出栈，因为栈结构的性质（后进先出），所以弹出的栈顶对象 pop_arr（栈顶标签）必定是前一项栈顶对象的 children，如果弹栈后的内容堆栈长度不为 0，则将 pop_arr 推入到当前内容堆栈的栈顶对象 children 中；如果弹栈后的内容堆栈为 0，说明最后的弹出项就是最终完整的内容结构，在外部声明一个数组 output 接收它
  - 截取标签与出栈标签不同，说明开始与闭合标签对不上，抛出异常 new Error
- 然后判断 rest 开头是否满足**标签结束标签之前的正文内容**（开始标签与开始标签之间的文本内容本章节不做判断），判断通过则将文本内容截取，如果内容不为空就把文本内容赋给当前内容堆栈栈顶对象的 text 属性
- 如果上述判断都未通过，则指针 index 右移一位
  - 判断开始标签通过的语句中，最后 index 要增加标签长度+2(`<>`的长度为 2)
  - 判断结束标签通过的语句中，最后 index 要增加标签长度+3(`</>`的长度为 3)
- 最后返回 output 数组，即结构正确的 AST 数组

```js
// index.js
import parse from "./parse.js";

const templateString = `<div>
    <h3>哈哈哈哈你好</h3>
    <ul>
        <li>A</li>
        <li>B</li>
        <li>C</li>
    </ul>
    <div>
        <div>哈哈</div>
    </div>
</div>
`;

const ast = parse(templateString);
console.log(ast);
```

```js
// parse函数 主函数
export default function parse(templateString) {
  // 指针
  let index = 0;
  // 剩余部分
  let rest = "";
  // 开始标记 <div>
  const startReg = /^<([a-z]+[1-6]?)>/;
  // 结束标记 </div>
  const endReg = /^<\/([a-z]+[1-6]?)>/;
  // 结束标记前的文字
  const wordReg = /^([^<]+)<\/[a-z]+[1-6]?>/;
  // 标签堆栈
  const tagStack = [];
  // 内容堆栈
  const contentStack = [];
  // 输出结果
  let output = [];

  while (index < templateString.length - 1) {
    rest = templateString.substring(index);
    // 识别开始标签
    if (startReg.test(rest)) {
      const tag = rest.match(startReg)[1];
      // console.log("检测到开始标记", tag);
      // 开始标记入栈1
      tagStack.push(tag);
      // 空数组入栈2
      contentStack.push({ tag, children: [] });
      // <>占两位，额外+2
      index += tag.length + 2;
    } else if (endReg.test(rest)) {
      const tag = rest.match(endReg)[1];
      // console.log("检测到结束标记", tag);
      const pop_tag = tagStack.pop();
      // tag和tagStack顶部相同，标签必定是封闭闭合的
      if (tag === pop_tag) {
        const pop_arr = contentStack.pop();
        const len = contentStack.length;
        if (len > 0) {
          // 长度不为0，出栈项往上一项的children里推
          contentStack[contentStack.length - 1].children.push(pop_arr);
        } else if (len === 0) {
          // 长度为0，最后推出的项就是堆叠完整的AST结构
          output = pop_arr;
        }
      } else {
        throw new Error(tagStack[tagStack.length - 1] + "标签没有封闭!");
      }
      // </>占三位，额外+3
      index += tag.length + 3;
    } else if (wordReg.test(rest)) {
      const word = rest.match(wordReg)[1];
      // 检测截取片段内容不为空
      if (!/^\s+$/.test(word)) {
        // console.log("检测到文字", word);
        contentStack[tagStack.length - 1].type = 3;
        contentStack[tagStack.length - 1].text = word;
      }
      index += word.length;
    } else {
      index++;
    }
  }
  return output;
}
```

最终输出结果：

![AST树初步结果](https://misaka10032.oss-cn-chengdu.aliyuncs.com/Vue/1673964270395.jpg)

### 识别 attrs

上面的 parse 函数已经支持纯净标签与文本内容的 AST 生成，但当标签内书写 class 等属性时，仍会报错，所以需要继续完善补充正则与判断

修改开始标签正则：

`const startReg = /^<([a-z]+[1-6]?)(\s[^<]+)?>/;`

调整开始标签正则判断内部语句

```js
// 识别开始标签
if (startReg.test(rest)) {
  const tag = rest.match(startReg)[1];
  // attrs内容
  const attrs = rest.match(startReg)[2];
  // console.log("检测到开始标记", tag);
  // 开始标记入栈1
  tagStack.push(tag);
  // 空数组入栈2
  contentStack.push({ tag, attrs: parseAttrsString(attrs), children: [] });
  // <>占两位，额外+2 再加attrs长度
  index += tag.length + (attrs ? attrs.length : 0) + 2;
}
```

attrs 转换函数

```js
// 把attrsString转换为数组返回
export default function parseAttrsString(attrsString) {
  if (attrsString === null || attrsString === undefined) return [];
  // 当前是否在引号内
  let inYinHao = false;
  // 断点
  let point = 0;
  // 结果数组，根据引号判断拆分出的字符串存入result中
  let result = [];
  // 遍历attrsString
  for (let i = 0; i < attrsString.length; i++) {
    let char = attrsString[i];
    if (char === '"') {
      inYinHao = !inYinHao;
    } else if (char === " " && !inYinHao) {
      // 遇见了空格并且不在引号中，并且截取范围不为空值
      if (!/^\s*$/.test(attrsString.substring(point, i))) {
        result.push(attrsString.substring(point, i).trim());
        point = i;
      }
    }
  }
  // 循环结束之后，如果最后引号紧贴标签没有空格比如 <h3 class="hello" id="top" data-src="888">
  // data-src会push不到result里面，需要做额外判断
  result.push(attrsString.substring(point));

  // 根据等号拆分
  // 将["k=v", "k=v", "k=v"]变为[{ name: k, value: v },{ name: k, value: v },{ name: k, value: v }]
  return result.map((item) => {
    // 根据等号拆分
    const o = item.match(/^(.+)="(.+)"$/);
    return { name: o[1], value: o[2] };
  });
}
```

## 太长不看-总结

1. 搭配[模板引擎](./4-模板引擎.html)中对插值语法`{{}}`的编译与 data 数据的字符串编译，可以生成数据完整且静态的 DOM 模板字符串（此处插值语法单独处理，实际的 Vue 源码对插值语法解析和 AST 转换是同时进行的）
2. 循环遍历 DOM 模板字符串，通过对开始标签、开始标签内的 attrs 字符串、正文内容、结束标签等正则判断，结合栈结构的原理，解析完开始标签之后，将处于遍历中的 attrs 内容、正文内容推入栈顶对象，解析完结束标签之后栈顶出栈，往上一项栈顶对象的 children 回推，最终生成结构层次分明的 AST 语法树
3. AST 语法树最后可以经过渲染函数生成虚拟节点对象 VNode，最后根据 diff 算法最小量更新生成真实 DOM 对象，在页面中完成渲染

可运行项目 demo 详见：

https://github.com/mi-saka10032/ast-demo