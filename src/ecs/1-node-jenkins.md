---
title: jenkins安装与git项目部署记录
order: 1
category: false
---

最近有一个idea，需要部署一个网易云音乐API用来提供音乐相关数据的查询，而github上正好有一个[网易云音乐API](https://github.com/Binaryify/NeteaseCloudMusicApi)，可以fork过来直接发到我自己的阿里云ECS上作为个人的公共查询服务，现在就记录一下我从阿里云远程环境初始化、jenkins安装和建立发布任务，最后完成在线项目发布运行的过程。

## 1.初始化远程环境

首先，需要明确部署目标：

在阿里云ECS上安装jenkins，创建一个jenkins发布任务，关联github仓库，拉取下来的仓库使用docker完成镜像打包和容器服务运行。

因此，ECS上必需安装的应用有：java11、jenkins(我选择java11支持的版本)、docker、git。

### 环境和前置条件

服务器：阿里云服务ECS 1核(vCPU) 2 GiB

操作系统：Alibaba Cloud Linux  3.2104 64位

### 远程连接

进入阿里云-云服务器ECS工作台，远程连接进入命令行操作台界面

![阿里云ECS远程连接](https://misaka10032.oss-cn-chengdu.aliyuncs.com/ecs/aliyunecs-remoteLink.png)

我这个ECS的操作系统已经提供了yum包管理器，提供一系列yum命令直接一键安装各种应用，下面的安装操作都使用yum来执行。

其他比较常见的还有 Debian / Ubuntu 的apt-get包管理器，也是类似的操作。

### 安装jenkins