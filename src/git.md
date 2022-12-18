---
title: Git
icon: git
category:
  - AJAX
  - axios
---

## 版本控制

版本控制是一种在开发的过程中用于管理我们对文件、目录或工程等内容的修改历史，方便查看更改历史记录，备份以便恢复以前的版本的软件工程技术。简而言之就是用于管理多人协同开发项目的技术。

**版本控制分类**

1.本地版本控制

2.集中版本控制

3.分布式版本控制

Git是目前世界上最先进的分布式版本控制系统

## git配置

Git Bash：Unix与Linux风格的命令行，使用最多，推荐最多。

Git CMD：Windows风格的命令行。

Git GUI：图形界面的Git，不建议初学者使用，尽量先熟悉常用命令。

### 常用Linux命令

![linux命令](https://misaka10032.oss-cn-chengdu.aliyuncs.com/git/linux%E5%91%BD%E4%BB%A4)

### 环境配置

```bash
git config -l	#查看配置

git config --global username "***"	#设置用户名

git config --global user.email *** @ ***.com	#设置密码
```

git相关配置文件：

1）Git\mingw64\etc\gitconfig：git安装目录下的gitconfig  --system 系统级

2）C:\Users\Administrator\.gitconfig：只适用于当前登录用户的配置  --global 全局

这里可以直接编辑配置文件，通过命令设置后会响应到这里。

## 基本理论（Core）

Git本地三个工作区域 工作目录 Working Directory、暂存区 Stage/Index 资源库 Repository/Git Directory。加上远程的git仓库 Remote Directory就分为四个工作区域。

转换关系：

![first](https://misaka10032.oss-cn-chengdu.aliyuncs.com/git/image-20210719223552477.png)

![second](https://misaka10032.oss-cn-chengdu.aliyuncs.com/git/image-20210719223709278.png)

![third](https://misaka10032.oss-cn-chengdu.aliyuncs.com/git/image-20210719223902246.png)

![fourth](https://misaka10032.oss-cn-chengdu.aliyuncs.com/git/image-20210719224001714.png)

### 项目搭建

#### 创建工作目录与常用指令

**工作目录不要有中文**

#### 本地仓库搭建

1.创建全新仓库。2.克隆远程仓库。

1.创建全新仓库，需要用GIT管理的项目根目录执行。

`$ git init`

#### 克隆远程仓库

将远程服务器上的仓库完全镜像一份至本地。

`$ git clone [url]`

### 文件操作

#### 4种状态

![four status pic](https://misaka10032.oss-cn-chengdu.aliyuncs.com/git/image-20210719224448211.png)

![four status text](https://misaka10032.oss-cn-chengdu.aliyuncs.com/git/image-20210719230733524.png)

#### 指令

```bash
git status [filename]	#查看指定文件状态

git status	#查看所有文件状态

git add .	#添加所有文件到暂存区

git commit -m "消息内容"	#提交暂存区中的内容到本地仓库	-m	提交信息
```

### 忽略文件

![gitignore1](https://misaka10032.oss-cn-chengdu.aliyuncs.com/git/image-20210720083357492.png)

![gitignore-demo](https://misaka10032.oss-cn-chengdu.aliyuncs.com/git/image-20210720083442204.png)

工程化项目中常用的.gitignore文件内容（npm/yarn/pnpm）：

```.gitignore
.DS_Store
node_modules/
dist/
npm-debug.log*
yarn-debug.log*
yarn-error.log*
package-lock.json
pnpm-lock.yaml
tests/**/coverage/

# Editor directories and files
.idea
.vscode
*.suo
*.ntvs*
*.njsproj
*.sln
```