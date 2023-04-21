---
title: Scheduler
order: 8
category: false
tag:
  - Scheduler
  - MessageChannel
---

## MessageChannel

在上面的源码中，我们使用 requestIdleCallback 来实现浏览器帧渲染与 JS 优化，但是目前 requestIdleCallback 的浏览器兼容性比较差

所以目前 React 利用 MessageChannel 模拟了 requestIdleCallback，将回调延迟到绘制操作之后执行

MessageChannel API 允许我们创建一个新的消息通道，并通过它的两个 MessagePort 属性发送数据

MessageChannel 创建了一个通信的管道，这个管道有两个端口，每个端口都可以通过 postMessage 发送数据，而一个端口只要绑定了 onmessage 回调方法，就可以接收从另一个端口传过来的数据

MessageChannel 是一个宏任务

![MessageChannel](https://misaka10032.oss-cn-chengdu.aliyuncs.com/React/liu_lan_qi_zhen.jpg)

以下是一个 MessageChannel 的代码示例

```js
var channel = new MessageChannel();
var port1 = channel.port1;
var port2 = channel.port2;
port1.onmessage = function (event) {
  console.log("port1收到来自port2的数据：" + event.data);
};
port2.onmessage = function (event) {
  console.log("port2收到来自port1的数据：" + event.data);
};
port1.postMessage("发送给port2");
port2.postMessage("发送给port1");
```

