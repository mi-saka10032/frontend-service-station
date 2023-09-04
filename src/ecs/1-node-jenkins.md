---
title: jenkins安装与项目部署
order: 1
tag:
    - jenkins初始化
    - pipeline流水线
    - docker部署
---

最近有一个 idea，需要部署一个网易云音乐 API 用来提供音乐相关数据的查询，而 github 上正好有一个[网易云音乐 API](https://github.com/Binaryify/NeteaseCloudMusicApi)，可以 fork 过来直接发到我自己的阿里云 ECS 上作为个人的公共查询服务，现在就记录一下我从阿里云远程环境初始化、jenkins 安装和建立发布任务，最后完成在线项目发布运行的过程。

## 1.初始化远程环境

首先，需要明确部署目标：

在阿里云 ECS 上安装 jenkins，创建一个 jenkins 发布任务，关联 github 仓库，拉取下来的仓库使用 docker 完成镜像打包和容器服务运行。

因此，ECS 上必需安装的应用有：java11、jenkins(我选择 java11 支持的版本)、docker、git。

### 环境和前置条件

服务器：阿里云服务 ECS 1 核(vCPU) 2 GiB

操作系统：Alibaba Cloud Linux 3.2104 64 位

### 远程连接

进入阿里云-云服务器 ECS 工作台，远程连接进入命令行操作台界面

![阿里云ECS远程连接](https://misaka10032.oss-cn-chengdu.aliyuncs.com/ecs/aliyunecs-remoteLink.png)

我这个 ECS 的操作系统已经提供了 yum 包管理器，提供一系列 yum 命令直接一键安装各种应用，下面的安装操作都使用 yum 来执行。

其他比较常见的还有 Debian / Ubuntu 的 apt-get 包管理器，也是类似的操作。

## 安装 jenkins

注意：网上大多数文章推荐安装的 jenkins 基于 java8，截至目前，jenkins 新版本已不支持 java8，需要特别备注安装 jenkins 老版本才能正确安装并运行。因此这里我们直接安装 java11 版本的 jenkins。

```shell
# 安装java11
yum install java-11-openjdk

# 正常显示java版本即表示java11已成功安装
java -version
```

![java-version](https://misaka10032.oss-cn-chengdu.aliyuncs.com/ecs/java-version.png)

```shell
# 设置jenkins源
sudo wget -O /etc/yum.repos.d/jenkins.repo https://pkg.jenkins.io/redhat-stable/jenkins.repo
sudo rpm --import https://pkg.jenkins.io/redhat-stable/jenkins.io.key

yum install -y jenkins

# 正常显示jenkins版本即表示jenkins已安装成功
jenkins --version
```

![jenkins--version](https://misaka10032.oss-cn-chengdu.aliyuncs.com/ecs/jenkins--version.png)

### 初始化 jenkins 配置

修改 jenkins 的配置文件，注意修改用户为 root 以获取管理员权限，端口按个人喜好修改（这里是 8888）

```shell
vim /etc/sysconfig/jenkins
```

![jenkins-config](https://misaka10032.oss-cn-chengdu.aliyuncs.com/ecs/jenkins-config.png)

```shell
# 修改项目权限
chown -R root:root /var/lib/jenkins
chown -R root:root /var/cache/jenkins
chown -R root:root /var/log/jenkins
```

### 启动 jenkins

使用`systemctl start jenkins`启动 jenkins，没有报错说明成功。第一次启动会比较慢，要多等一下

```shell
# 启动
systemctl start jenkins
# 停止
systemctl stop jenkins
# 重启
systemctl restart jenkins
# 查看状态
systemctl status jenkins
```

启动成功后可以查看运行中的 jenkins 状态

![jenkins-status](https://misaka10032.oss-cn-chengdu.aliyuncs.com/ecs/jenkins-status.png)

### 设置安全组

对于阿里云 ECS 而言，不存在系统级防火墙，仅需要在控制台开通对应端口的安全组外网访问权限即可。腾讯云应该也是类似的情况，其他类型服务器或许需要输入命令放开对应端口的访问权限

这里我使用的 jenkins 是 8888 端口，因此需要开启 8888 端口访问入口方向的权限

![ecs-security](https://misaka10032.oss-cn-chengdu.aliyuncs.com/ecs/ecs-security.png)

### 登录 jenkins

开通安全组之后，使用 ECS 的公网 IP+jenkins 端口号访问 jenkins。初次登录需要初始密码，登录之后修改为自定义密码

```shell
# 查看初始密码，用于首次登录jenkins
cat /var/lib/jenkins/secrets/initialAdminPassword
```

接下来，就是等待 jenkins 安装必要的插件了，也需要等待不少时间。

登录成功之后的 jenkins 状态界面如下图所示

![jenkins状态界面](https://misaka10032.oss-cn-chengdu.aliyuncs.com/ecs/jenkins-login.png)

### 更换端口小坑

网上的大多数更换 jenkins 端口的方案，都是`vim /etc/sysconfig/jenkins`修改`JENKINS_PORT`之后重启 jenkins，但是我这套系统不大一样，修改之后重启不生效

![修改jenkins端口](https://misaka10032.oss-cn-chengdu.aliyuncs.com/ecs/modify-port.png)

修改完成后输入以下指令

```shell
# 停止jenkins
systemctl stop jenkins

# 配置文件使生效
source /etc/sysconfig/jenkins

# 启动jenkins
systemctl start jenkins
```

使用`systemctl status jenkins`查看 jenkins 状态或者`netstat -ntlp`查看进程中端口，都可以看到 jenkins 的端口并没有从 8888 迁移到 9000

![无效的jenkins端口修改](https://misaka10032.oss-cn-chengdu.aliyuncs.com/ecs/invalid_port_mod.png)

```shell
netstat -ntlp
```

![netstat](https://misaka10032.oss-cn-chengdu.aliyuncs.com/ecs/netstat.png)

这种情况，需要使用以下指令修改 jenkins 端口配置并重启

```shell
# 修改JENKINS_PORT的端口号
vim /etc/systemd/system/jenkins.service.d/override.conf

# 重新加载服务配置
systemctl daemon-reload

## 重启jenkins
systemctl restart jenkins
```

这样，jenkins 才能在新端口重新启动。

## 创建 jenkins 任务

目标仓库为 github 仓库，部署方式预计使用 docker 打包部署，因此 ECS 需要安装 git 和 docker

### 安装 docker 和 git

```shell
# 前提软件包
yum install -y yum-utils
# 更换源地址
yum-config-manager --add-repo http: //mirrors.aliyun.com/docker-ce/linux/centos/docker-ce.repo
# 更新yum软件包索引
yum makecache fast
# 安装
yum install docker-ce docker-ce-cli containerd.io
# 启动
systemctl start docker
# 自机启动
systemctl enable docker
# 重新加载服务配置
systemctl daemon-reload
```

![docker-v](https://misaka10032.oss-cn-chengdu.aliyuncs.com/ecs/docker-v.png)

```shell
sudo yum update

sudo yum install git

# 查看git版本
git --version
```

![git-v](https://misaka10032.oss-cn-chengdu.aliyuncs.com/ecs/git-v.png)

### 创建 jenkins 任务

github 仓库已经建好，为个人使用的私库，仓库搭建过程不再赘述，直接进入 jenkins 任务创建环节

这里为求简洁，我们使用比较简单的流水线（PipeLine）操作

**创建凭据**

问题大多出在这里，注意 ECS 需要创建 ssh-key，公钥添加到个人的 github 账号 ssh 配置里。

进入系统管理，点击凭据 -> 任意一个 System 的超链接 -> 全局凭据 -> 右上角蓝色按钮 Add Credentials

![new-credentials](https://misaka10032.oss-cn-chengdu.aliyuncs.com/ecs/jenkins-new-ssh.png)

注意粘贴 ECS 上`~/.ssh/id_rsa`的私钥内容到上图指定位置并保存

保存完成后，会生成一个名为 github-ssh（这就是上面的 user-name）的凭据，复制这个凭据的 ID

**构建触发器**

基于 github 仓库的触发器基本都是在远程仓库 push 时触发，网上也有很多范例，我的仓库因为是 fork 过来的仓库很稳定就不需要设置触发器了，所以这一步跳过。

**流水线**

```groovy
pipeline {
    agent any

    parameters {
        string(name: 'IMAGE_NAME', defaultValue: '自定义镜像名称', description: 'Docker image name')
        string(name: 'CONTAINER_NAME', defaultValue: '自定义容器名称', description: 'Docker container name')
        string(name: 'HOST_PORT', defaultValue: '自定义服务端口号', description: 'Host port to map to container port')
        string(name: 'CONTAINER_PORT', defaultValue: '自定义容器端口号', description: 'Container port to map to host port')
    }

    stages {
        // 拉取github仓库代码
        stage('Checkout') {
            steps {
                git credentialsId: '上面复制的凭据id',
                url: 'github仓库地址',
                branch: '分支名'
            }
        }

        // 构建docker容器
        stage('Docker Build') {
            steps {
                script {
                    dockerImage = docker.build(params.IMAGE_NAME)
                }
            }
        }

        // 清除非首次部署docker容器，运行容器
        stage('Docker Run') {
            steps {
                script {
                    try {
                        sh "docker stop ${params.CONTAINER_NAME}"
                        sh "docker rm ${params.CONTAINER_NAME}"
                    } catch (Exception e) {
                        echo "No previous container found"
                    }
                    dockerImage.run("--name ${params.CONTAINER_NAME} -p ${params.HOST_PORT}:${params.CONTAINER_PORT}")
                }
            }
        }
    }
}
```

配置完成后，点击左侧立即构建开始执行

![流水线运行](https://misaka10032.oss-cn-chengdu.aliyuncs.com/ecs/pipeline-run.png)

部署成功后，注意设置这个部署端口的[安全组](#设置安全组)，以允许外网访问

至此，阿里云ECS的CI/CD就完成了，通过公网IP+部署端口号即可访问这个服务。为了保密公网ip，地址栏就不粘贴了

![阿里云音乐API外网访问](https://misaka10032.oss-cn-chengdu.aliyuncs.com/ecs/netease-music-visit.png)