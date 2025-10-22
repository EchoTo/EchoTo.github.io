---
title: K8s
date: 2024-12-05 16:14:27
tags: [Linux, K8s]
categories: K8s
---

# K8s

-----

## 第一章 K8s的介绍

---

### 1.1 部署方式演变

---

* **传统部署**：互联网早期，会直接将应用程序部署在物理机上

  优点：简单，不需要其他技术的参与

  缺点：不能为应用程序定义资源使用边界，很难合理地分配计算资源，而且程序之间容易产生影响

* **虚拟化部署**：可以在一台物理机上运行多个虚拟机，每个虚拟机都是独立的一个环境

  优点：程序环境不会互相产生影响，提供了一定程度的安全性

  缺点：增加了操作系统，浪费了部分资源

* **容器化部署**：与虚拟化类似，但是共享了操作系统

  优点：可以保证每个容器拥有自己的文件系统、CPU、内存、进程空间等

  ​		   运行应用程序所需要的资源都被容器包装，并和底层基础架构解耦

  ​           容器化的应用程序可以跨云服务商、跨Linux操作系统发行版进行部署

<img src="https://tonkyshan.cn/img/20241205175710.png" alt="20241205175710" style="zoom: 35%;" />

容器化部署方式也会出现一些问题：

* 一个容器故障停机了，怎样让另外一个容器立刻启动去替补停机的容器
* 当并发量变大的时候，怎么样做到横向扩展容器数量

这些容器管理的问题统称为**容器编排**问题，为了解决这些容器的编排问题，就产生了一些容器编排的软件

* Swarm：Docker自己的容器编排工具
* Mesos：Apache的一个资源统一管控的工具，需要和Marathon结合使用
* Kubernetes：Google开源的容器编排工具

---

### 1.2 Kubernetes简介

----

Kubernetes本质是**一组服务器集群**，它可以在集群的每个节点上运行特定的程序，来对节点中的容器进行管理，它的目的就是实现资源管理的自动化，主要提供以下功能：

* **自我修复：**一旦某个容器崩溃，能够在1秒左右迅速启动新的容器
* **弹性伸缩：**可以根据需要，自动对集群中正在运行的容器数量进行调整
* **服务发现：**服务可以通过自动发现的形式找到它所依赖的服务
* **负载均衡：**如果一个服务启动了多个容器，能够自动实现请求的负载均衡
* **版本回退：**如果发现新发布的程序版本有问题，可以立即回退到原来的版本
* **存储编排：**可以根据容器自身的需求自动创建存储卷

----

### 1.3 Kubernetes组件

----

一个Kubernetes集群主要是由控制节点(master)、工作节点(node)构成，每个节点上都会安装不同的组件

**master：集群的控制平面，负责集群的决策**

* **ApiServer：**资源操作的唯一入口，接收用户输入的命令，提供认证、授权、API注册和发现等机制
* **Scheduler：**负责集群资源调度，按照预定的调度策略将Pod调度到相应的node节点上
* **ControllerManager：**负责维护集群的状态，比如程序部署安排、故障检测、自动扩展、滚动更新等
* **Etcd：**负责存储集群中各种资源对象的信息

**node：集群的数据平面，负责为容器提供运行环境**

* **Kubelet：**负责维护容器的生命周期，即通过控制docker，来创建、更新、销毁容器
* **KubeProxy：**负责提供集群内部的服务发现和负载均衡
* **Docker：**负责节点上容器的各种操作

<img src="https://tonkyshan.cn/img/20241206171029.png" alt="20241206171029" style="zoom: 55%;" />

以部署一个nginx服务来说明kubernetes系统各个组件调用关系

1、首先，一旦kubernetes环境启动后，master和node都会将自身的消息存储到etcd数据库中

2、一个nginx服务的安装请求会首先被发送到master节点到apiServer组件

3、apiServer组件会调用scheduler组件来决定到底应该把这个服务安装到哪个node节点上，此时，它会从etcd中读取各个node节点的信息，然后按照一定的算法进行选择，并将结果告知apiServer

4、apiServer调用controller-manager去调度Node节点安装nginx服务

5、kubelet接收到指令后，会通知docker，然后由docker来启动一个nginx的pod，pod是kubernetes的最小操作单元，容器必须跑在pod中

6、一个nginx服务就运行了，如果需要访问nginx，就需要通过kube-proxy来对pod产生访问的代理，这样，外界用户就可以访问集群中的nginx服务了

----

### 1.4 Kubernetes概念

-----

**Master：**集群控制节点，每个集群需要至少一个master节点负责集群的管控

**Node：**工作负载节点，由master分配容器到这些node工作节点上，然后node节点上的docker负责容器的运行

**Pod：**kubernetes的最小控制单元，容器都是运行在pod中的，一个pod中可以有1个或者多个容器

**Controller：**控制器，通过它来实现对pod的管理，比如启动pod、停止pod、伸缩pod的数量等等

**Service：**pod对外服务的统一入口，下面可以维护同一类的多个pod

**Label：**标签，用于对pod进行分类，同一类pod会拥有相同的标签

**NameSpace：**命名空间，用来隔离pod的运行环境

<img src="https://tonkyshan.cn/img/20241209153434.png" alt="20241209153434" style="zoom: 45%;" />

----

## 第二章 集群环境搭建

----

### 2.1 环境规划

---

#### 2.1.1 集群类型

-----

kubernetes集群大体上分为两类：一主多从和多主多从

* 一主多从：一台Master节点和多台Node节点，搭建简单，但是有单机故障风险，适用于测试环境
* 多主多从：多台Master节点和多台Node节点，搭建麻烦，安全性高，适用于生产环境

<img src="https://tonkyshan.cn/img/20241209155103.png" alt="20241209155103" style="zoom: 45%;" />

----

#### 2.1.2 安装方式

-----

kubernetes有多种部署方式，目前主流的方式有kubeadm、minikube、二进制包

* kubeadm：一个用于快速搭建kubernetes集群的工具
* minikube：一个用于快速搭建单节点kubernetes的工具
* 二进制包：从官网下载每个组件的二进制包，依次去安装，此方式对于理解kubernetes组件更加1有效

----

#### 2.1.3 主机规划

---

|  作用  |     IP地址     |          操作系统          |         配置          |
| :----: | :------------: | :------------------------: | :-------------------: |
| Master | 172.16.140.133 | Centos7.9   基础设施服务器 | 2颗CPU 2G内存 50G硬盘 |
| Node1  | 172.16.140.135 | Centos7.9   基础设施服务器 | 2颗CPU 2G内存 50G硬盘 |
| Node2  | 172.16.140.134 | Centos7.9   基础设施服务器 | 2颗CPU 2G内存 50G硬盘 |

---

### 2.2 环境搭建

---

环境搭建需要三台linux系统(一主二从)，内置Centos7.9系统，每台linux中分别安装docker(18.06.3)，kubeadm(1.17.4)，kubelet(1.17.4)，kubectl(1.17.4)程序。

----

#### 2.2.1 主机安装

---

* 操作系统环境：CPU(2C)、内存(2G)、硬盘(50G)
* 语言选择：中文简体
* 软件选择：基础设施服务器
* 分区选择：自动分区
* 网络配置：(配置网段远程连接失败，这里用的IPV4自动)

```
网络地址：192.168.108.100（100、101、102）
子网掩码：255.255.255.0
默认网关：192.168.108.2
DNS：223.5.5.5
```

---

#### 2.2.2 环境初始化

--------

1、环境版本

```powershell
# 此方式下安装kubernetes集群要求Centos版本要在7.5或之上
[root@master ~]# cat /etc/redhat-release
CentOS Linux release 7.9.2009 (AltArch)
```

2、主机名解析

为了方便后面集群节点之间的直接调用，配置一下主机名解析，企业中推荐使用内部DNS服务器

```powershell
# 主机名解析 编辑三台服务器的/etc/hosts文件，添加下面内容
172.16.140.133 master
172.16.140.135 node1
172.16.140.134 node2

##################################################
[root@master ~]$ ping master
PING master (172.16.140.133) 56(84) 比特的数据。
64 比特，来自 master (172.16.140.133): icmp_seq=1 ttl=64 时间=0.235 毫秒
64 比特，来自 master (172.16.140.133): icmp_seq=2 ttl=64 时间=0.132 毫秒
64 比特，来自 master (172.16.140.133): icmp_seq=3 ttl=64 时间=0.145 毫秒
^Z
[1]+  已停止               ping master
[root@master ~]$ ping node1
PING node1 (172.16.140.135) 56(84) 比特的数据。
64 比特，来自 node1 (172.16.140.135): icmp_seq=1 ttl=64 时间=1.10 毫秒
64 比特，来自 node1 (172.16.140.135): icmp_seq=2 ttl=64 时间=0.754 毫秒
64 比特，来自 node1 (172.16.140.135): icmp_seq=3 ttl=64 时间=0.858 毫秒
^Z
[2]+  已停止               ping node1
[root@master ~]$ ping node2
PING node2 (172.16.140.134) 56(84) 比特的数据。
64 比特，来自 node2 (172.16.140.134): icmp_seq=1 ttl=64 时间=1.16 毫秒
64 比特，来自 node2 (172.16.140.134): icmp_seq=2 ttl=64 时间=0.847 毫秒
64 比特，来自 node2 (172.16.140.134): icmp_seq=3 ttl=64 时间=0.722 毫秒
64 比特，来自 node2 (172.16.140.134): icmp_seq=4 ttl=64 时间=0.738 毫秒
64 比特，来自 node2 (172.16.140.134): icmp_seq=5 ttl=64 时间=0.875 毫秒
^Z
[3]+  已停止               ping node2
```

3、时间同步

kubernetes要求集群中的节点时间必须精确一致，这里直接使用chronyd服务从网络同步时间

企业中建议配置内置的时间同步服务器

```powershell
# 启动chronyd服务
[root@master ~]$ systemctl start chronyd
# 设置chronyd服务开机自启
[root@master ~]$ systemctl enable chronyd
# chronyd服务启动稍等几秒钟，使用date命令验证时间
[root@master ~]$ date
```

4、禁用iptables和firewalld服务

kubernetes和docker在运行中会产生大量的iptables规则，为了不让系统规则跟它们混淆，直接关闭系统的规则

```powershell
# 1 关闭firewalld服务
[root@master ~]$ systemctl stop firewalld
[root@master ~]$ systemctl disable firewalld
# 2 关闭iptables服务
[root@master ~]$ systemctl stop iptables
[root@master ~]$ systemctl disable iptables
```

5、禁用selinux

selinux是linux系统下的一个安全服务，如果不关闭，安装集群中会产生各种各样的问题

```powershell
# 编辑 /etc/selinux/config 文件，修改SELINUX的值为disabled
# 注意修改完毕之后需要重启linux服务
SELINUX=disabled

#坑：设置为disabled后 重启会登陆不上 卡死，这里建议改为 permissive
在系统选择界面按下e，设置启动环境，在语言设置后加上 selinux=0，ctrl+x启动系统
```

<img src="https://tonkyshan.cn/img/20241212201147.png" alt="20241212201147" style="zoom: 45%;" />

6、禁用swap分区

swap分区指的是虚拟内存分区，它的作用是在物理内存使用完之后，将磁盘空间虚拟成内存来使用

启用swap设备会对系统的性能产生非常负面的影响，因此kubernetes要求每个节点都要禁用swap设备

但是如果因为某些原因确实不能关闭swap分区，就需要在集群安装过程中通过明确的参数进行配置说明

```powershell
# 编辑分区配置文件/etc/fstab，注释掉swap分区一行
# 注意修改完毕之后需要重启linux服务
/dev/mapper/cl_fedora-root /                       xfs     defaults        0 0
UUID=3dbb1731-5126-4464-9471-4f9aef63a5ba /boot                   xfs     defaults        0 0
UUID=ADAC-4DB1          /boot/efi               vfat    umask=0077,shortname=winnt 0 2
# /dev/mapper/cl_fedora-swap none                    swap    defaults        0 0
```

7、修改linux的内核参数

```powershell
# 修改linux的内核参数，添加网桥过滤合地址转发功能
# 编辑/etc/sysctl.d/kubernetes.conf文件，添加如下配置
net.bridge.bridge-nf-call-ip6tables = 1
net.bridge.bridge-nf-call-iptables = 1
net.ipv4.ip_forward = 1

# 重新加载配置
[root@master ~]$ sysctl -p

# 加载网桥过滤模块
[root@master ~]$ modprobe br_netfilter

# 查看网桥过滤模块是否加载成功
[root@master ~]# lsmod | grep br_netfilter
br_netfilter           28672  0 
bridge                253952  1 br_netfilter
```

8、配置ipvs功能

在kubernetes中service有两种代理模型，一种是基于iptables的，一种是基于ipvs的

两者比较的话，ipvs的性能明显要高一些，但是如果要使用它，需要手动载入ipvs模块

```powershell
# 1 安装ipset和ipvsadm
[root@master ~]$ yum install ipset ipvsadm -y

#坑：下载会报错
# vi /etc/yum.repos.d/CentOS-Base.repo 注释掉mirrorlist，将mirror改为vault
#mirrorlist=http://mirrorlist.centos.org/?release=$releasever&arch=$basearch&repo=centosplus&infra=$infra
baseurl=http://vault.centos.org/altarch/$releasever/centosplus/$basearch/

# 2 添加需要加载的模块写入脚本文件
[root@master ~]$ cat <<EOF > /etc/sysconfig/modules/ipvs.modules
#! /bin/bash
modprobe -- ip_vs
modprobe -- ip_vs_rr
modprobe -- ip_vs_wrr
modprobe -- ip_vs_sh
modprobe -- nf_conntrack #nf_conntrack_ipv4会报错
EOF

# 3 为脚本文件添加执行权限
[root@master ~]$ chmod +x /etc/sysconfig/modules/ipvs.modules

# 4 执行脚本
[root@master ~]$ /bin/bash /etc/sysconfig/modules/ipvs.modules

# 5 查看对应的模块是否加载成功
[root@master ~]$ lsmod | grep -e ip_vs -e nf_conntrack

ip_vs_sh               12288  0
ip_vs_wrr              12288  0
ip_vs_rr               12288  0
ip_vs                 184320  6 ip_vs_rr,ip_vs_sh,ip_vs_wrr
nf_conntrack          200704  3 nf_nat,nft_ct,ip_vs
nf_defrag_ipv6         24576  2 nf_conntrack,ip_vs
nf_defrag_ipv4         12288  1 nf_conntrack
libcrc32c              12288  5 nf_conntrack,nf_nat,nf_tables,xfs,ip_vs
```

9、重启服务器

上面步骤完成之后，需要重新启动linux系统

```powershell
[shantianqi@master ~]$ reboot

##################################################
[shantianqi@node1 ~]$ getenforce
Disabled
[shantianqi@node1 ~]$ free -m
               total        used        free      shared  buff/cache   available
Mem:            1638         926         168          16         643         712
Swap:              0           0           0
```

--------

#### 2.2.3 安装docker

----

```powershell
# 1 切换镜像源
[root@master ~]$ wget https://mirrors.aliyun.com/docker-ce/linux/centos/docker-ce.repo -O /etc/yum.repos.d/docker-ce.repo

# 2 查看当前镜像源中支持的docker版本
[root@master ~]$ yum list docker-ce --showduplicates

# 3 安装特定版本的docker-ce
# 必须指定--setopt=obsoletes=0，否则yum会自动安装更高版本
[root@master ~]$ yum install --setopt=obsoletes=0 docker-ce-18.06.3.ce-3.el7 -y

# 4 添加一个配置文件
# Docker 在默认情况下使用的Cgroup Driver为cgroupfs，而kubernetes推荐使用systemd来代替cgroupfs
[root@master ~]$ mkdir /etc/docker
[root@master ~]$ cat <<EOF > /etc/docker/daemon.json
{
	"exec-opts": ["native.cgroupdriver=systemd"],
	"registry-mirrors": ["https://kn0t2bca.mirror.aliyuncs.com"],
	"insecure-registries" : ["47.93.22.25:5000"] # 搭建私服 pull flannel 相关镜像(没有用科学上网的情况下)，没有下载后续集群节点会NotReady
}
EOF

# 5 启动docker
[root@master ~]$ systemctl restart docker
[root@master ~]$ systemctl enable docker

# 6 检查docker状态和版本
[root@master ~]# docker version
Client:
 Version:           18.06.3-ce
 API version:       1.38
 Go version:        go1.10.3
 Git commit:        d7080c1
 Built:             Wed Feb 20 02:24:54 2019
 OS/Arch:           linux/arm64
 Experimental:      false

Server:
 Engine:
  Version:          18.06.3-ce
  API version:      1.38 (minimum version 1.12)
  Go version:       go1.10.3
  Git commit:       d7080c1
  Built:            Wed Feb 20 02:28:12 2019
  OS/Arch:          linux/arm64
  Experimental:     false
```

----

#### 2.2.4 安装kubernetes组件

----

```powershell
# 1 由于kubernetes的镜像源在国外，速度比较慢，这里切换成国内的镜像源
# 编辑/etc/yum.repos.d/kubernetes.repo，添加下面的配置
#mac用这个 baseurl=https://mirrors.aliyun.com/kubernetes/yum/repos/kubernetes-el7-aarch64
cat >>/etc/yum.repos.d/kubernetes.repo << EOF
[kubernetes]
name=Kubernetes
baseurl=https://mirrors.aliyun.com/kubernetes/yum/repos/kubernetes-el7-aarch64
enabled=1
gpgcheck=0
repo_gpgcheck=0
gpgkey=https://mirrors.aliyun.com/kubernetes/yum/doc/yum-key.gpg https://mirrors.aliyun.com/kubernetes/yum/doc/rpm-package-key.gpg
EOF

# 新版配置
[kubernetes]
name=Kubernetes
baseurl=https://mirrors.aliyun.com/kubernetes-new/core/stable/v1.31/rpm/
enabled=1
gpgcheck=1
gpgkey=https://mirrors.aliyun.com/kubernetes-new/core/stable/v1.31/rpm/repodata/repomd.xml.key
			 
# 2 安装kubeadm、kubelet和kubectl
[shantianqi@master ~]$ yum install --setopt=obsoletes=0 kubeadm-1.17.4-0 kubelet-1.17.4-0 kubectl-1.17.4-0 -y

# 3 配置kubelet的cgroup
# 编辑/etc/sysconfig/kubelet，添加下面的配置
KUBELET_CGROUP_ARGS="--cgroup-driver=systemd"
KUBE_PROXY_MODE="ipvs"

# 4 设置kubelet开机自启
[root@master ~]$ systemctl enable kubelet
```

----

#### 2.2.5 准备集群镜像

---

```powershell
# 在安装kubernetes集群之前，必须要提前准备好集群需要的镜像，所需要镜像可以通过下面命令查看
[root@node2 ~]# kubeadm config images list
W1213 16:23:20.839648    6916 version.go:101] could not fetch a Kubernetes version from the internet: unable to get URL "https://dl.k8s.io/release/stable-1.txt": Get https://cdn.dl.k8s.io/release/stable-1.txt: net/http: request canceled while waiting for connection (Client.Timeout exceeded while awaiting headers)
W1213 16:23:20.839828    6916 version.go:102] falling back to the local client version: v1.17.4
W1213 16:23:20.839941    6916 validation.go:28] Cannot validate kube-proxy config - no validator is available
W1213 16:23:20.839952    6916 validation.go:28] Cannot validate kubelet config - no validator is available
k8s.gcr.io/kube-apiserver:v1.17.4
k8s.gcr.io/kube-controller-manager:v1.17.4
k8s.gcr.io/kube-scheduler:v1.17.4
k8s.gcr.io/kube-proxy:v1.17.4
k8s.gcr.io/pause:3.1
k8s.gcr.io/etcd:3.4.3-0
k8s.gcr.io/coredns:1.6.5

# 下载镜像
images=(
	kube-apiserver:v1.17.4
	kube-controller-manager:v1.17.4
	kube-scheduler:v1.17.4
	kube-proxy:v1.17.4
	pause:3.1
	etcd:3.4.3-0
	coredns:1.6.5
)

for imageName in ${images[@]} ; do
		sudo docker pull registry.cn-hangzhou.aliyuncs.com/google_containers/$imageName
		sudo docker tag registry.cn-hangzhou.aliyuncs.com/google_containers/$imageName k8s.gcr.io/$imageName
		sudo docker rmi registry.cn-hangzhou.aliyuncs.com/google_containers/$imageName
done

########################################################################################
[root@master ~]# sudo docker images
REPOSITORY                           TAG                 IMAGE ID            CREATED             SIZE
k8s.gcr.io/kube-proxy                v1.17.4             22cb61f793ab        4 years ago         114MB
k8s.gcr.io/kube-apiserver            v1.17.4             1f3e6c7a6284        4 years ago         166MB
k8s.gcr.io/kube-controller-manager   v1.17.4             8bf4356e6736        4 years ago         156MB
k8s.gcr.io/kube-scheduler            v1.17.4             856664179c37        4 years ago         93.7MB
k8s.gcr.io/coredns                   1.6.5               f96217e2532b        5 years ago         39.3MB
k8s.gcr.io/etcd                      3.4.3-0             ab707b0a0ea3        5 years ago         363MB
k8s.gcr.io/pause                     3.1                 6cf7c80fe444        6 years ago         525kB
```

----

#### 2.2.6 集群初始化

-----

对集群进行初始化，并将node节点加入到集群中

> 下面操作只需要在`master`节点上执行

```powershell
# 创建集群
[shantianqi@master ~]$ kubeadm init \
	--kubernetes-version=v1.17.4 \
	--pod-network-cidr=10.244.0.0/16 \
	--service-cidr=10.96.0.0/12 \
	--apiserver-advertise-address=172.16.140.133
	
# 创建必要文件
[root@master ~]$ mkdir -p $HOME/.kube
[root@master ~]$ sudo cp -i /etc/kubernetes/admin.conf $HOME/.kube/config
[root@master ~]$ sudo chown $(id -u):$(id -g) $HOME/.kube/config

# 查看node
[root@master ~]# kubectl get node
NAME     STATUS     ROLES    AGE     VERSION
master   NotReady   master   2m28s   v1.17.4
```

> 下面操作只需要在`node`节点上执行

```powershell
# 将node节点加入集群
[root@master ~]$ kubeadm join 172.16.140.133:6443 \ 
		--token ef7fj1.0w864vlv34pxd1k0 \
    --discovery-token-ca-cert-hash \
    sha256:01f2897e4264cf27189a889d25f2b9c02e1225462ca62469c0fff207a66c96e3

# 查看node
[root@master ~]$ kubectl get node
NAME     STATUS     ROLES    AGE     VERSION
master   NotReady   master   7m57s   v1.17.4
node1    NotReady   <none>   4m30s   v1.17.4
node2    NotReady   <none>   42s     v1.17.4
```

----

#### 2.2.7 安装网络插件

-----

kubernetes支持多种网络插件，比如flannel、calico、canal等等，任选一种使用即可，本次选择flannel

> 下面操作只需要在`node`节点上执行，插件使用的是DaemonSet的控制器，它会在每个节点上都运行

```powershell
# 获取fannel的配置文件
wget https://raw.githubusercontent.com/coreos/flannel/master/Documentation/kube-flannel.yml

#下载链接
https://tonkyshan.cn/files/kube-flannel.yml
# 修改文件中quay.io仓库为quay-mirror.qiniu.com
# 现在不需要改了
 
# 使用配置文件启动fannel
kubectl apply -f kube-flannel.yml
 
# 稍等片刻，再次查看集群节点的状态
[root@master ~]$ kubectl get nodes
NAME     STATUS   ROLES    AGE   VERSION
master   Ready    master   24h   v1.17.4
node1    Ready    <none>   24h   v1.17.4
node2    Ready    <none>   24h   v1.17.4

# 坑：pull不下来flannel/flannel和flannel/flannel-cni-plugin 导致STATUS都是 NotReady
# 搭建私服，科学上网pull下来，推到私服，再使用虚拟机连到私服上，pull
# 解决方案参考：下方 解决方案 超链接
```

[解决方案](https://devpress.csdn.net/k8s/66c9866a8f4f502e1cfd4267.html?dp_token=eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpZCI6NTI1NzUyNywiZXhwIjoxNzM0NDg2ODc5LCJpYXQiOjE3MzM4ODIwNzksInVzZXJuYW1lIjoibTBfNTQ4NzAwOTYifQ.J3SxzhzLS_mZ4pmFuwhn5K-XHPJ3OuwyDTKByn1ZZcU&spm=1001.2101.3001.6650.6&utm_medium=distribute.pc_relevant.none-task-blog-2%7Edefault%7EBlogCommendFromBaidu%7Eactivity-6-139689686-blog-136213196.235%5Ev43%5Epc_blog_bottom_relevance_base6&depth_1-utm_source=distribute.pc_relevant.none-task-blog-2%7Edefault%7EBlogCommendFromBaidu%7Eactivity-6-139689686-blog-136213196.235%5Ev43%5Epc_blog_bottom_relevance_base6&utm_relevant_index=13) 至此kubernetes的集群环境搭建完成

----

### 2.3 服务部署

----

在kubernetes集群中部署一个nginx程序，测试集群是否正常工作

```powershell
# 部署nginx
[root@master ~]$ kubectl create deployment nginx --image=47.93.22.25:5000/nginx:latest
deployment.apps/nginx created

# 暴露端口
[root@master ~]$ kubectl expose deployment nginx --port=80 --type=NodePort
service/nginx exposed

# 查看服务状态
[root@master ~]$ kubectl get pods,svc
NAME                         READY   STATUS    RESTARTS   AGE
pod/nginx-69c9b99c8d-frl99   1/1     Running   0          24s

NAME                 TYPE        CLUSTER-IP      EXTERNAL-IP   PORT(S)        AGE
service/kubernetes   ClusterIP   10.96.0.1       <none>        443/TCP        28h
service/nginx        NodePort    10.99.253.103   <none>        80:31676/TCP   10s

# 在电脑上访问部署的nginx服务
```

<img src="https://tonkyshan.cn/img/20241218144649.png" alt="20241218144649" style="zoom:80%;" />

-----

## 第三章 资源管理

----

介绍yaml语法和kubernetes的资源管理方式

---

### 3.1 资源管理介绍

---

在kubernetes中，所有的内容都抽象为资源，用户需要通过操作资源来管理kubernetes

>​	kubernetes的本质上就是一个集群系统，用户可以在集群中部署各种服务，所谓的部署服务，其实就是在kubernetes集群中运行一个个的容器，并将指定的程序跑在容器中。
>
>​	kubernetes的最小管理单元是pod而不是容器，所以只能将容器放在`pod`中，而kubernetes一般也不会直接管理pod，而是通过`pod控制器`来管理pod的。
>
>​	pod可以提供服务之后，就要考虑如何访问pod中的服务，kubernetes提供了`service`资源实现这个功能。
>
>​	当然，如果pod中程序的数据需要持久化，kubernetes还提供了各种`存储`系统

<img src="https://tonkyshan.cn/img/20241218152551.png" alt="20241218152551" />

>学习kubernetes的核心就是学习如何对集群上的`pod、pod控制器、service、存储`等各种资源进行操作 

----

### 3.2 YAML语法介绍(略)

---------

### 3.3 资源管理方式

-----

* 命令式对象管理：直接使用命令去操作kubernetes资源

  `kubectl run nginx-pod --image=nginx --port=80`

* 命令式对象配置：通过命令配置和配置文件去操作kubernetes资源

  `kubectl create/patch -f nginx-pod.yaml`

* 声明式对象配置：通过apply命令和配置文件去操作kubernetes资源

  `kubectl apply -f nginx-pod.yaml`

|      类型      | 操作对象 | 适用环境 |      优点      |               缺点               |
| :------------: | :------: | :------: | :------------: | :------------------------------: |
| 命令式对象管理 |   对象   |   测试   |      简单      | 只能操作活动对象，无法审计、跟踪 |
| 命令式对象配置 |   文件   |   开发   | 可以审计、跟踪 |  项目大时，配置文件多，操作麻烦  |
| 声明式对象配置 |   目录   |   开发   |  支持目录操作  |        意外情况下难以调试        |

------

#### 3.3.1 命令式对象管理

----

**kubectl命令**

kubectl是kubernetes集群的命令行工具，通过它能够对集群本身进行管理，并能够在集群上进行容器化应用的安装部署。

kubectl命令的语法如下：

```
kubectl [command] [type] [name] [flags]
```

**command：**指定要对资源执行的操作，例如create、get、delete

**type：**指定资源类型，比如deployment、pod、service

**name：**指定资源的名称，名称大小写敏感

**flags：**指定额外的可选参数

```powershell
# 查看所有pod
kubectl get pod

# 查看某个pod
kubectl get pod pod_name

# 查看某个pod, 以yaml格式展示结果
kubectl get pod pod_name -o yaml
```

**资源类型**

kubernetes中所有的内容都抽象为资源，可以通过下面的命令进行查看

```powershell
kubectl api-resources
```

经常使用的资源有下面这些：

<table style="text-align: center;">
  <thead>
    <tr>
      <th>资源分类</th>
      <th>资源名称</th>
      <th>缩写</th>
      <th>资源作用</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td rowspan="2" style="padding-top: 2%">集群级别资源</td>
      <td>nodes</td>
      <td>no</td>
      <td>集群组成部分</td>
    </tr>
    <tr>
      <td>namespaces</td>
      <td>ns</td>
      <td>隔离Pod</td>
    </tr>
    <tr>
      <td>pod资源</td>
      <td>pods</td>
      <td>po</td>
      <td>装载容器</td>
    </tr>
    <tr>
      <td rowspan="8" style="padding-top: 12%">pod资源控制器</td>
      <td>replicationcontrollers</td>
      <td>rc</td>
      <td>控制pod资源</td>
    </tr>
    <tr>
      <td>replicasets</td>
      <td>rs</td>
      <td>控制pod资源</td>
    </tr>
    <tr>
      <td>deployments</td>
      <td>deploy</td>
      <td>控制pod资源</td>
    </tr>
    <tr>
      <td>daemonsets</td>
      <td>ds</td>
      <td>控制pod资源</td>
    </tr>
    <tr>
      <td>jobs</td>
      <td></td>
      <td>控制pod资源</td>
    </tr>
    <tr>
      <td>cronjobs</td>
      <td>cj</td>
      <td>控制pod资源</td>
    </tr>
    <tr>
      <td>horizontalpodautoscalers</td>
      <td>hpa</td>
      <td>控制pod资源</td>
    </tr>
    <tr>
      <td>statefulsets</td>
      <td>sts</td>
      <td>控制pod资源</td>
    </tr>
    <tr>
      <td rowspan="2" style="padding-top: 2%">服务发现资源</td>
      <td>services</td>
      <td>svc</td>
      <td>统一pod对外接口</td>
    </tr>
    <tr>
      <td>ingress</td>
      <td>ing</td>
      <td>统一pod对外接口</td>
    </tr>
    <tr>
      <td rowspan="3" style="padding-top: 4%">存储资源</td>
      <td>volumeattachments</td>
      <td></td>
      <td>存储</td>
    </tr>
    <tr>
      <td>persistentvolumes</td>
      <td>pv</td>
      <td>存储</td>
    </tr>
    <tr>
      <td>persistentvolumeclaims</td>
      <td>pvc</td>
      <td>存储</td>
    </tr>
    <tr>
      <td rowspan="2" style="padding-top: 2%">配置资源</td>
      <td>configmaps</td>
      <td>cm</td>
      <td>配置</td>
    </tr>
    <tr>
      <td>secrets</td>
      <td></td>
      <td>配置</td>
    </tr>
  </tbody>
</table>
**操作**

kubernetes允许对资源进行多种操作，可以通过--help查看详细的操作命令

```powershell
kebectl --help
```

经常使用的操作有下面这些

<table style="text-align: center;">
  <thead>
    <tr>
      <th>命令分类</th>
      <th>命令</th>
      <th>翻译</th>
      <th>命令作用</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td rowspan="6" style="padding-top: 9%">基本命令</td>
      <td>create</td>
      <td>创建</td>
      <td>创建一个资源</td>
    </tr>
    <tr>
      <td>edit</td>
      <td>编辑</td>
      <td>编辑一个资源</td>
    </tr>
    <tr>
      <td>get</td>
      <td>获取</td>
      <td>获取一个资源</td>
    </tr>
    <tr>
      <td>patch</td>
      <td>更新</td>
      <td>更新一个资源</td>
    </tr>
    <tr>
      <td>delete</td>
      <td>删除</td>
      <td>删除一个资源</td>
    </tr>
    <tr>
      <td>explain</td>
      <td>解释</td>
      <td>展示资源文档</td>
    </tr>
    <tr>
      <td rowspan="10" style="padding-top: 16%">运行和调试</td>
      <td>run</td>
      <td>运行</td>
      <td>在集群中运行一个指定的镜像</td>
    </tr>
    <tr>
      <td>expose</td>
      <td>暴露</td>
      <td>暴露资源为service</td>
    </tr>
    <tr>
      <td>describe</td>
      <td>描述</td>
      <td>显示资源内部信息</td>
    </tr>
    <tr>
      <td>logs</td>
      <td>日志</td>
      <td>输出容器在pod中的日志</td>
    </tr>
    <tr>
      <td>attach</td>
      <td>缠绕</td>
      <td>进入运行中的容器</td>
    </tr>
    <tr>
      <td>exec</td>
      <td>执行</td>
      <td>执行容器中的一个命令</td>
    </tr>
    <tr>
      <td>cp</td>
      <td>复制</td>
      <td>在pod内外复制文件</td>
    </tr>
    <tr>
      <td>rollout</td>
      <td>首次展示</td>
      <td>管理资源的发布</td>
    </tr>
    <tr>
      <td>scale</td>
      <td>规模</td>
      <td>扩(缩)容pod的数量</td>
    </tr>
    <tr>
      <td>autoscale</td>
      <td>自动调整</td>
      <td>自动调整pod数量</td>
    </tr>
    <tr>
      <td rowspan="2" style="padding-top: 2%">高级命令</td>
      <td>apply</td>
      <td>rc</td>
      <td>通过文件对资源进行配置</td>
    </tr>
    <tr>
      <td>label</td>
      <td>标签</td>
      <td>更新资源上的标签</td>
    </tr>
    <tr>
      <td rowspan="2" style="padding-top: 2%">其他命令</td>
      <td>cluster-info</td>
      <td>集群信息</td>
      <td>显示集群信息</td>
    </tr>
    <tr>
      <td>version</td>
      <td>版本</td>
      <td>显示当前server和client的版本</td>
    </tr>
  </tbody>
</table>

-----

#### 3.3.2 命令式对象配置

----

命令式对象配置就是使用命令配合配置文件一起来操作kubernetes资源

1、创建一个nginxpod.yaml

```yaml
apiVersion: v1
kind: Namespace
metadata: 
  name: dev
        
---

apiVersion: v1
kind: Pod
metadata:
  name: nginxpod
  namespace: dev
spec: 
  containers:
  - name: nginx-containers
    image: 47.93.22.25:5000/nginx:latest
```

2、执行creat命令，创建资源

```powershell
[root@master ~]# kubectl create -f nginxpod.yaml
namespace/dev created
pod/nginxpod created
```

此时发现创建了两个资源对象，分别是namespace和pod

3、执行get命令，查看资源

```powershell
[root@master ~]# kubectl get -f nginxpod.yaml 
NAME            STATUS   AGE
namespace/dev   Active   75s

NAME           READY   STATUS    RESTARTS   AGE
pod/nginxpod   1/1     Running   0          75s
```

4、执行delete命令，删除资源

```powershell
[root@master ~]# kubectl delete -f nginxpod.yaml 
namespace "dev" deleted
pod "nginxpod" deleted
```

>命令式对象配置的方式操作资源，可以简单的认为：命令 + yaml配置文件(里面是命令需要的各种参数)

----

#### 3.3.3 声明式对象配置

------

声明式对象配置跟命令式对象配置很相似，但是它只有一个命令apply

```powershell
# 执行创建资源
[root@master ~]# kubectl apply -f nginxpod.yaml
namespace/dev created
pod/nginxpod created

# 再次执行说明资源没有变动
[root@master ~]# kubectl apply -f nginxpod.yaml
namespace/dev unchanged
pod/nginxpod unchanged
```

其实声明式对象配置就是使用apply描述一个资源最终的状态(在yaml中定义状态)

使用apply操作资源：

* 如果资源不存在，就创建，相当于kubectl create
* 如果资源已存在，就更新，相当于kubectl patch

>扩展：kubectl可以在node节点上运行吗？

kubectl的运行是需要进行配置的，它的配置文件是$HOME/.kube，如果想要在node节点运行次命令，需要将master节点上的.kube文件复制到node节点，即在master节点上执行下面操作：

```powershell
scp -r HOME/.kube node1: HOME/
```

>使用推荐：三种方式应该怎么用？

创建/更新资源：使用声明式对象配置 kubectl apply -f XXX.yaml

删除资源：使用命令式对象配置 kubectl delete -f XXX.yaml

查询资源：使用命令式对象管理 kubectl get(describe) 资源名称

-----

## 第四章 入门

------

### 4.1 Namespace

-----

Namespace是kubernetes系统中的一种非常重要资源，它的主要作用是用来实现**多套环境的资源隔离**或者**多租户的资源隔离**

默认情况下，kubernetes集群中的所有的Pod都是可以相互访问的，但是在实际中，可能不想让两个Pod之间进行互相的访问，那此时就可以将两个Pod划分到不同的namespace下。kubernetes通过将集群内部的资源分配到不同的Namespace中，可以形成逻辑上的“组”，以方便不同的组的资源进行隔离使用和管理

可以通过kubernetes的授权机制，将不同的namespace交给不同的租户进行管理，这样就实现了多租户的资源隔离，此时还能结合kubernetes的资源配额机制，限定不同租户能占用的资源，例如CPU使用量、内存使用量等等，来实现租户可用资源的管理

kubernetes在集群启动后，会默认创建几个namespace

```powershell
[root@master ~]# kubectl get ns
NAME              STATUS   AGE
default           Active   2d20h # 所有未指定Namespace的对象都会被分配在default命名
kube-node-lease   Active   2d20h # 集群节点之间的心跳维护，v1.13开始引入
kube-public       Active   2d20h # 此命名空间下的资源可以被所有人访问(包括未认证用户)
kube-system       Active   2d20h # 所有由kubernetes系统创建的资源都处于这个命名空间
```

具体操作：

**查看**

```powershell
# 1 查看所有的ns 命令：kubectl get ns
[root@master ~]# kubectl get namespace
NAME              STATUS   AGE
default           Active   2d20h
dev               Active   12h
kube-flannel      Active   2d19h
kube-node-lease   Active   2d20h
kube-public       Active   2d20h
kube-system       Active   2d20h

# 2 查看指定的ns 命令：kubectl get ns ns名称
[root@master ~]# kubectl get namespace default
NAME              STATUS   AGE
default           Active   2d20h

# 3 指定输出格式 命令：kubectl get ns ns名称 -o 格式参数
# kubernetes支持的格式有很多，比较常见的是wide，json，yaml
[root@master ~]# kubectl get ns default -o yaml
apiVersion: v1
kind: Namespace
metadata:
  creationTimestamp: "2024-12-17T02:08:47Z"
  name: default
  resourceVersion: "145"
  selfLink: /api/v1/namespaces/default
  uid: 64bab35f-7d9e-42a6-bf59-30f9a0cc355b
spec:
  finalizers:
  - kubernetes
status:
  phase: Active

# 4 查看ns详情 命令：kubectl describe ns ns名称
[root@master ~]# kubectl describe ns default
Name:         default
Labels:       <none>
Annotations:  <none>
Status:       Active # Active 命名空间正在使用 Terminating 正在删除命名空间

# ResourceQuota 针对namespace做的资源限制
# LimitRange针对namespace中的每个组件做的资源限制
No resource quota.

No LimitRange resource.
```

**创建**

```powershell
# 创建namespace
[root@master ~]# kubectl create ns dev
namespace/dev created
```

**删除**

```powershell
# 删除namespace
[root@master ~]# kubectl delete ns dev
namespace "dev" deleted
```

**配置方式**

准备一个yaml文件：ns-dev.yaml

```yaml
apiVersion: v1
kind: Namespace
metadata:
  name: dev
```

然后就可以执行对应的创建和删除命令了：

* 创建：kubectl create -f ns-dev.yaml
* 删除：kubectl delete -f ns-dev.yaml

-----

### 4.2 Pod

----

Pod是kubernetes集群进行管理的最小单元，程序要运行必须部署在容器中，而容器必须存在于Pod中

Pod可以认为是容器的封装，一个Pod中可以存在一个或多个容器

<img src="https://tonkyshan.cn/img/20241224093559.png" alt="20241224093559" style="zoom: 40%;" />

kubernetes在集群启动后，集群中的各个组件也都是以Pod方式运行的，可以通过下面命令查看

```powershell
[root@master ~]# kubectl get pod -n kube-system
NAME                             READY   STATUS    RESTARTS   AGE
coredns-6955765f44-gfdpx         1/1     Running   3          2d21h
coredns-6955765f44-jn9hk         1/1     Running   3          2d21h
etcd-master                      1/1     Running   4          2d21h
kube-apiserver-master            1/1     Running   3          2d21h
kube-controller-manager-master   1/1     Running   4          2d21h
kube-flannel-ds-arm64-gkt5j      1/1     Running   1          2d19h
kube-flannel-ds-arm64-hj4mj      1/1     Running   4          2d19h
kube-flannel-ds-arm64-pwxgr      1/1     Running   1          2d19h
kube-proxy-lg5gz                 1/1     Running   2          2d21h
kube-proxy-ltc46                 1/1     Running   5          2d21h
kube-proxy-zgb7s                 1/1     Running   1          2d21h
kube-scheduler-master            1/1     Running   3          2d21h
```

**创建并运行**

kubernetes没有提供单独运行Pod的命令，都是通过Pod控制器来实现的

```powershell
# 命令格式：kubectl run (pod控制器名称) [参数]
# --image 指定pod的镜像
# --port 指定端口
# --namespace 指定namespace
[root@master ~]# kubectl run nginx --image=47.93.22.25:5000/nginx:latest --port=80 --namespace dev
deployment.app/nginx created
```

**查看pod信息**

```powershell
# 查看Pod基本信息
[root@master ~]# kubectl get pod -n dev
NAME       READY   STATUS    RESTARTS   AGE
nginxpod   1/1     Running   0          13h

# 查看Pod的详细信息
[root@master ~]# kubectl describe pod nginxpod -n dev
Name:         nginxpod
Namespace:    dev
Priority:     0
Node:         node1/172.16.140.135
Start Time:   Thu, 19 Dec 2024 17:57:38 +0800
Labels:       <none>
Annotations:  kubectl.kubernetes.io/last-applied-configuration:
                {"apiVersion":"v1","kind":"Pod","metadata":{"annotations":{},"name":"nginxpod","namespace":"dev"},"spec":{"containers":[{"image":"47.93.22...
Status:       Running
IP:           10.244.1.7
IPs:
  IP:  10.244.1.7
Containers:
  nginx-containers:
    Container ID:   docker://888d2548fbf3963499e2fbfd1365ddf5348ff621f308b66fde78e4a6772e2e7a
    Image:          47.93.22.25:5000/nginx:latest
    Image ID:       docker-pullable://47.93.22.25:5000/nginx@sha256:abcdeeef78ef79f67efee2e7078c390af6b3804e8df29fb2cf74f0d2a430b725
    Port:           <none>
    Host Port:      <none>
    State:          Running
      Started:      Thu, 19 Dec 2024 17:57:39 +0800
    Ready:          True
    Restart Count:  0
    Environment:    <none>
    Mounts:
      /var/run/secrets/kubernetes.io/serviceaccount from default-token-qkmtb (ro)
Conditions:
  Type              Status
  Initialized       True 
  Ready             True 
  ContainersReady   True 
  PodScheduled      True 
Volumes:
  default-token-qkmtb:
    Type:        Secret (a volume populated by a Secret)
    SecretName:  default-token-qkmtb
    Optional:    false
QoS Class:       BestEffort
Node-Selectors:  <none>
Tolerations:     node.kubernetes.io/not-ready:NoExecute for 300s
                 node.kubernetes.io/unreachable:NoExecute for 300s
Events:          <none>
```

**访问Pod**

```powershell
# 获取podIP
[root@master ~]# kubectl get pod -n dev -o wide
NAME       READY   STATUS    RESTARTS   AGE   IP           NODE    NOMINATED NODE   READINESS GATES
nginxpod   1/1     Running   0          16h   10.244.1.7   node1   <none>           <none>

# 访问Pod
[root@master ~]# curl 10.244.1.7:80
<!DOCTYPE html>
<html>
<head>
<title>Welcome to nginx!</title>
<style>
html { color-scheme: light dark; }
body { width: 35em; margin: 0 auto;
font-family: Tahoma, Verdana, Arial, sans-serif; }
</style>
</head>
<body>
<h1>Welcome to nginx!</h1>
<p>If you see this page, the nginx web server is successfully installed and
working. Further configuration is required.</p>

<p>For online documentation and support please refer to
<a href="http://nginx.org/">nginx.org</a>.<br/>
Commercial support is available at
<a href="http://nginx.com/">nginx.com</a>.</p>

<p><em>Thank you for using nginx.</em></p>
</body>
</html>
```

**删除指定Pod**

```powershell
# 删除指定Pod
[root@master ~]# kubectl delete pod nginxpod -n default
pod "nginxpod" deleted

# 此时 显示删除Pod成功，但是再查询，发现又新产生了一个
[root@master ~]# kubectl get pod -n default
NAME       READY   STATUS    RESTARTS   AGE
nginxpod   1/1     Running   0          25s

[root@master ~]# kubectl get pod -n dev
NAME                    READY   STATUS    RESTARTS   AGE
nginx-7f779f447-bnphh   1/1     Running   0          15m
nginx-7f779f447-cxtkx   1/1     Running   0          15m
nginx-7f779f447-h8b5f   1/1     Running   0          15m
[root@master ~]# kubectl delete pod nginx-7f779f447-bnphh -n dev
pod "nginx-7f779f447-bnphh" deleted
[root@master ~]# kubectl get pod -n dev
NAME                    READY   STATUS    RESTARTS   AGE
nginx-7f779f447-cxtkx   1/1     Running   0          15m
nginx-7f779f447-h8b5f   1/1     Running   0          15m
nginx-7f779f447-vrqc7   1/1     Running   0          6s

# 这是因为当前Pod是由Pod控制器创建的，控制器会监控Pod状况，一旦Pod死亡，会立即重建
# 此时要想删除Pod，必须删除Pod控制器

# 先来查询一下当前namespace下的Pod控制器
[root@master ~]# kubectl get deploy -n default
NAME    READY   UP-TO-DATE   AVAILABLE   AGE
nginx   1/1     1            1           44h

# 删除此Pod控制器
[root@master ~]# kubectl delete deploy nginx -n default
deployment.apps "nginx" deleted

# 稍等几秒，再去查询Pod，发现Pod被删除了
[root@master ~]# kubectl get pod -n default
No resources found in default namespace.
```

**配置操作**

创建一个pod-nginx.yaml，内容如下：

```yaml
apiVersion: v1
kind: Pod
metadata:
  name: nginx
  namespace: dev
spec:
  containers:
  - image: 47.93.22.25:5000/nginx:latest
    imagePullPolicy: IfNotPresent
    name: pod
    ports: # 端口定义应该作为container对象的一部分
    - name: nginx-port
      containerPort: 80
      protocol: TCP
```

然后就可以执行对应的创建和删除命令了

* 创建：kubectl create -f pod-nginx.yaml
* 删除：kubectl delete -f pod-nginx.yaml

----

### 4.3 Label

---

Label是kubernetes系统中的一个重要概念，它的作用就是在资源上添加标识，用来对它们进行管理和选择

Label的特点：

* 一个Label会以key/value键值对的形式附加到各种对象上，如Node、Pod、Service等等
* 一个资源对象可以定义任意数量的Label，同一个Label也可以被添加到任意数量的资源对象上去
* Label通常在资源对象定义时确定，当然也可以在对象创建后动态添加或者删除

可以通过Label实现资源的多维度分组，以便灵活、方便地进行资源分配、调度、配置、部署等管理工作

>一些常用的Label示例如下：
>
>* 版本标签："version" : "release"，"version" : "stable"......
>* 环境标签："environment" : "dev"，"environment" : "test"，"environment" : "pro"
>* 架构标签："tier" : "frontend"，"tier" : "backend"

标签定义完毕后，还要考虑到标签的选择，这就要使用到Label Selector，即：

* Label用于给某个资源对象定义标识
* Label Selector用于查询和筛选拥有某些标签的资源对象

当前有两种Label Selector：

* 基于等式的Label Selector

  name = slave：选择所有包含Label中key = "name"且value = "slave"的对象

  env != production：选择所有包含Label中key = "env"且value != "production"的对象

* 基于集合的Label Selector

  name in (master, slave)：选择所有包含Label中key = "name"且value = "master"或"slave"的对象

  name not in (frontend)：选择所有包含Label中key = "name"且value != "frontend"的对象

标签的选择条件可以使用多个，此时将多个Label Selector进行组合，使用逗号","进行分隔即可，例如：

* name = slave，env != production
* name not in (frontend)，env != production

**命令方式**

```powershell
# 查看标签
[root@master ~]# kubectl get pod -n dev --show-labels
NAME    READY   STATUS    RESTARTS   AGE     LABELS
nginx   1/1     Running   0          6m44s   <none>

# 为pod资源打标签
[root@master ~]# kubectl label pod nginx version=1.0 -n dev
pod/nginx labeled

[root@master ~]# kubectl get pod -n dev --show-labels
NAME    READY   STATUS    RESTARTS   AGE    LABELS
nginx   1/1     Running   0          9m1s   version=1.0

# 更新标签
[root@master ~]# kubectl label pod nginx version=2.0 --overwrite -n dev
pod/nginx labeled

[root@master ~]# kubectl get pod -n dev --show-labels
NAME    READY   STATUS    RESTARTS   AGE   LABELS
nginx   1/1     Running   0          11m   version=2.0

# 筛选标签
[root@master ~]# kubectl get pod -n dev -l version=2.0 --show-labels
NAME    READY   STATUS    RESTARTS   AGE   LABELS
nginx   1/1     Running   0          12m   version=2.0

[root@master ~]# kubectl get pod -n dev -l version!=2.0 --show-labels
No resources found in dev namespace.

# 删除标签
[root@master ~]# kubectl label pod nginx version- -n dev
pod/nginx labeled
```

**配置方式**

```yaml
apiVersion: v1
kind: Pod
metadata:
  name: nginx
  namespace: dev
  labels:
    version: "3.0"
    env: "test"
spec: 
  containers:
  - image: 47.93.22.25:5000/nginx:latest
    name: pod
    ports:
    - name: nginx-port
      containerPort: 80
      protocol: TCP
```

然后就可以执行对应的更新命令了：kubectl apply -f pod-nginx.yaml

----

### 4.4 Deployment

----

在kubernetes中，Pod是最小的控制单元，但是kubernetes很少直接控制Pod，一般都是通过Pod控制器来完成的，Pod控制器用于pod的管理，确保pod资源符合预期的状态，当pod的资源出现故障时，会尝试进行重启或者重建pod。

在kubernetes中Pod控制器的种类有很多，介绍一种：Deployment

**命令操作**

```powershell
 # 命令格式：kubectl run deployment名称 [参数]
 # --image 指定pod的镜像
 # --port 指定端口
 # --replicas 指定创建pod数量
 # --namespace 指定namespace
[root@master ~]# kubectl run nginx --image=47.93.22.25:5000/nginx:latest --port=80 --replicas=3 -n dev
kubectl run --generator=deployment/apps.v1 is DEPRECATED and will be removed in a future version. Use kubectl run --generator=run-pod/v1 or kubectl create instead.
deployment.apps/nginx created

# 查看创建的deployment和pod的信息
[root@master ~]# kubectl get deployment,pods -n dev
NAME                    READY   UP-TO-DATE   AVAILABLE   AGE
deployment.apps/nginx   3/3     3            3           91s

NAME                        READY   STATUS    RESTARTS   AGE
pod/nginx-7f779f447-bnphh   1/1     Running   0          91s
pod/nginx-7f779f447-cxtkx   1/1     Running   0          91s
pod/nginx-7f779f447-h8b5f   1/1     Running   0          91s

# UP-TO-DATE: 成功升级的副本数量 
# AVAILABLE: 可用副本的数量
[root@master ~]# kubectl get deploy -n dev -o wide
NAME    READY   UP-TO-DATE   AVAILABLE   AGE     CONTAINERS   IMAGES                          SELECTOR
nginx   3/3     3            3           2m48s   nginx        47.93.22.25:5000/nginx:latest   run=nginx

# 查看deployment的详细信息
[root@master ~]# kubectl describe deploy nginx -n dev
Name:                   nginx
Namespace:              dev
CreationTimestamp:      Fri, 20 Dec 2024 12:27:01 +0800
Labels:                 run=nginx
Annotations:            deployment.kubernetes.io/revision: 1
Selector:               run=nginx
Replicas:               3 desired | 3 updated | 3 total | 3 available | 0 unavailable
StrategyType:           RollingUpdate
MinReadySeconds:        0
RollingUpdateStrategy:  25% max unavailable, 25% max surge
Pod Template:
  Labels:  run=nginx
  Containers:
   nginx:
    Image:        47.93.22.25:5000/nginx:latest
    Port:         80/TCP
    Host Port:    0/TCP
    Environment:  <none>
    Mounts:       <none>
  Volumes:        <none>
Conditions:
  Type           Status  Reason
  ----           ------  ------
  Available      True    MinimumReplicasAvailable
  Progressing    True    NewReplicaSetAvailable
OldReplicaSets:  <none>
NewReplicaSet:   nginx-7f779f447 (3/3 replicas created)
Events:
  Type    Reason             Age    From                   Message
  ----    ------             ----   ----                   -------
  Normal  ScalingReplicaSet  8m44s  deployment-controller  Scaled up replica set nginx-7f779f447 to 3

# 删除
[root@master ~]# kubectl delete deploy nginx -n dev
deployment.apps "nginx" deleted
```

**配置操作**

创建一个deploy-nginx.yaml

```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: nginx
  namespace: dev
spec:
  replicas: 3
  selector:
    matchLabels:
      run: nginx
  template:
    metadata:
      labels:
        run: nginx
    spec:
      containers:
      - image: 47.93.22.25:5000/nginx:latest
        name: nginx
        ports:
        - containerPort: 80
          protocol: TCP
```

然后就可以执行对应的创建和删除命令了：

* 创建：kubectl create -f deploy-nginx.yaml
* 删除：kubectl delete -f deploy-nginx.yaml

-----

### 4.5 Service

-----

虽然每个Pod都会分配一个单独的Pod IP，然而却存在如下两问题：

* Pod IP会随着Pod的重建产生变化
* Pod IP仅仅是集群内可见的虚拟IP，外部无法访问

这样对于访问这个服务带来了难度，因此，kubernetes设计了Service来解决这个问题

Service可以看作是一组同类Pod**对外的访问接口**，借助Service，应用可以方便地实现服务发现和负载均衡

**操作一：创建集群内部可访问的Service**

```powershell
# 暴露Service
[root@master ~]# kubectl expose deploy nginx --name=svc-nginx1 --type=ClusterIP --port=80 --target-port=80 -n dev
service/svc-nginx1 exposed

# 查看service
[root@master ~]# kubectl get svc svc-nginx1 -n dev -o wide
NAME         TYPE        CLUSTER-IP      EXTERNAL-IP   PORT(S)   AGE    SELECTOR
svc-nginx1   ClusterIP   10.99.122.173   <none>        80/TCP    111s   run=nginx

# 这里产生了一个CLUSTER-IP，这就是service的IP，在Service的生命周期中，这个地址是不会变的
[root@master ~]# curl 10.99.122.173:80
<!DOCTYPE html>
<html>
<head>
<title>Welcome to nginx!</title>
<style>
html { color-scheme: light dark; }
body { width: 35em; margin: 0 auto;
font-family: Tahoma, Verdana, Arial, sans-serif; }
</style>
</head>
<body>
<h1>Welcome to nginx!</h1>
<p>If you see this page, the nginx web server is successfully installed and
working. Further configuration is required.</p>

<p>For online documentation and support please refer to
<a href="http://nginx.org/">nginx.org</a>.<br/>
Commercial support is available at
<a href="http://nginx.com/">nginx.com</a>.</p>

<p><em>Thank you for using nginx.</em></p>
</body>
</html>
```

**操作二：创建集群外部也可以访问的Service**

```powershell
# 上面创建的Service的type类型为ClusterIP，这个ip地址只有集群内部可以访问
# 如果需要创建外部也可以访问的Service，需要修改type为NodePort
[root@master ~]# kubectl expose deploy nginx --name=svc-nginx2 --type=NodePort --port=80 --target-port=80 -n dev
service/svc-nginx2 exposed

# 此时查看，会发现出现了NodePort类型的Service，而且有一对Port(80:31928/TC)
[root@master ~]# kubectl get svc svc-nginx2 -n dev -o wide
NAME         TYPE       CLUSTER-IP      EXTERNAL-IP   PORT(S)        AGE   SELECTOR
svc-nginx2   NodePort   10.107.170.15   <none>        80:31846/TCP   82s   run=nginx

# 接下来就可以通过集群外的主机访问 节点IP:31846访问服务了
# 例如访问下面地址
http://172.16.140.133:31846/
```

**删除Service**

```powershell
[root@master ~]# kubectl delete svc svc-nginx1 -n dev
service "svc-nginx1" deleted
```

**配置方式**

创建一个svc-nginx.yaml

```yaml
apiVersion: v1
kind: Service
metadata:
  name: svc-nginx
  namespace: dev
spec:
  clusterIP: 10.107.170.15
  ports:
  - port: 80
    protocol: TCP
    targetPort: 80
  selector:
    run: nginx
  type: ClusterIP
```

然后就可以执行对应的创建和删除命令了：

* 创建：kubectl create -f svc-nginx.yaml
* 删除：kubectl delete -f svc-nginx.yaml

>**小结**
>
>​	至此，已经学习了Namespace、Pod、Deployment、Service资源的基本操作，有了这些操作，就可以在kubernetes集群中实现一个服务的简单部署和访问了，但是如果想要更好的使用kubernetes，就需要深入学习这几种资源的细节和原理

-----

## 第五章 Pod详解

-----

### 5.1 Pod结构

---

<img src="https://tonkyshan.cn/img/20241224093559.png" alt="20241224093559" style="zoom: 40%;" />

每个Pod中都可以包含一个或多个容器，这些容器可以分为两类：

* 用户程序所在的容器，数量可多可少

* Pause容器，这是每个Pod都会有的一个**根容器**，它的作用有两个：

  * 可以以它为根据，评估整个Pod的健康状态

  * 可以在根容器上设置IP地址，其它容器共享此IP(Pod IP)，以实现Pod内部的网络通讯

    `这里是Pod内部的通讯，Pod之间的通讯采用的虚拟二层网络技术来实现，我们当前环境用的是Flannel`

-----

### 5.2 Pod定义

----

下面是Pod的资源清单

```yaml
apiVersion: v1		# 必选，版本号，例如 v1
kind: Pod					# 必选，资源类型，例如 Pod
metadata:					# 必选，元数据
  name: string		# 必选，Pod名称
  namespace: string		# Pod所属的命名空间，默认为"default"
  labels:							# 自定义标签列表
    - name: string
spec:		# 必选，Pod中容器的详细定义
  containers:		# 必选，Pod中容器列表
  - name: string		# 必选，容器名称
    image: string		# 必选，容器的镜像名称
    imagePullPolicy: [Always | Never | IfNotPresent]	# 获取镜像的策略
    command: [string]		# 容器的启动命令列表，如不指定，使用打包时使用的启动命令
    args: [string]			# 容器的启动命令参数列表
    workingDir: string	# 容器的工作目录
    volumeMounts:				# 挂载到容器内部的存储卷配置
    - name: string			# 引用pod定义的共享存储卷的名称，需用volumes[]部分定义的卷名
      mountPath: string # 存储卷在容器内mount的绝对路径，应少于512个字符
      readOnly: boolean # 是否为只读模式
    ports: 		# 需要暴露的端口库号列表
    - name: string			# 端口的名称
      containerPort: int		# 容器需要监听的端口号
      hostPort: int			# 容器所在主机需要监听的端口号，默认与Container相同
      protocol: string	# 端口协议，支持TCP和UDP，默认TCP
    env:			# 容器运行前需设置的环境变量列表
    - name: string			# 环境变量名称
      value: string			# 环境变量的值
    resources: 					# 资源限制和请求的设置
      limits:						# 资源限制的设置
        cpu: string			# CPU的限制，单位为core数，将用于docker run --cpu-shares参数
        memory: string	# 内存限制，单位可以为Mib/Gib，将用于docker run --memory参数
      requests:					# 资源请求的设置
        cpu: string			# CPU请求，容器启动的初始可用数量
        memory: string  # 内存请求，容器启动的初始可用数量
    lifecycle:				# 生命周期钩子
      postStart:			# 容器启动后立即执行此钩子，如果执行失败，会根据重启策略进行重启
      preStop:				# 容器终止前执行此钩子，无论结果如何，容器都会终止
    livenessProbe:		# 对Pod内各容器健康检查的设置，当探测无响应几次后将自动重启该容器
      exec:						# 对Pod容器内检查方式设置为exec方式
        command: [string]		# exec方式需要指定的命令或脚本
      httpGet: 			# 对Pod内各个容器健康检查方法设置为HttpGet，需要指定path、port
        path: string
        port: number
        host: string
        scheme: string
        HttpHeaders:
        - name: string
          value: string
      tcpSocket:		# 对Pod内各个容器健康检查方式设置为tcpSocket方式
        port: number
      initialDelaySeconds: 0		# 容器启动完成后首次探测的时间，单位为秒
      timeoutSeconds: 0					# 对容器健康检查探测等待响应的超时时间，单位为秒，默认1秒
      periodSeconds: 0					# 对容器健康检查的定期探测时间设置，单位为秒，默认10秒一次
      successThreshold: 0 
      failureThreshold: 0
    securityContext:
      privileged: false
  restartPolicy: [Always | Never | OnFailure]		# Pod的重启策略
  nodeName: <string>		# 设置NodeName表示将该Pod调度到指定名称的node节点上
  nodeSelector: object	# 设置NodeSelector表示将该Pod调度到包含这个label的node上
  imagePullSecrets: 		# Pull镜像时使用的secret名称，以key: secretkey格式指定
  - name: string
  hostNetwork: false		# 是否使用主机网络模式，默认为false，如果设置为true，表示使用宿主机网络
  volumes:							# 在该pod上定义共享存储卷列表
  - name: string				# 共享存储卷名称(volumes类型有很多种)
    emptyDir: {}				# 类型为emptyDir的存储卷，与Pod同生命周期的一个临时目录。为空值
    hostPath: string		# 类型为hostPath的存储卷，表示挂载Pod所在宿主机的目录
      path: string			# Pod所在宿主机的目录，将被用于同期中mount的目录
    secret:							# 类型为secret的存储卷，挂载集群与定义的secret对象到容器内部
      scretname: string
      items:
      - key: string
        path: string
    configMap:  				# 类型为configMap到存储卷，挂载预定义的configMap对象到容器内部
      name: string
      items:
      - key: string
        path: string
```

```powershell
# 通过explain命令查看每种资源的可配置项
# kubectl explain 资源类型				查看某种资源可以配置的一级属性
# kubectl explain 资源类型.属性    查看属性的子属性
[root@master ~]# kubectl explain pod
KIND:     Pod
VERSION:  v1

DESCRIPTION:
     Pod is a collection of containers that can run on a host. This resource is
     created by clients and scheduled onto hosts.

FIELDS:
   apiVersion   <string>
     APIVersion defines the versioned schema of this representation of an
     object. Servers should convert recognized schemas to the latest internal
     value, and may reject unrecognized values. More info:
     https://git.k8s.io/community/contributors/devel/sig-architecture/api-conventions.md#resources

   kind <string>
     Kind is a string value representing the REST resource this object
     represents. Servers may infer this from the endpoint the client submits
     requests to. Cannot be updated. In CamelCase. More info:
     https://git.k8s.io/community/contributors/devel/sig-architecture/api-conventions.md#types-kinds

   metadata     <Object>
     Standard object's metadata. More info:
     https://git.k8s.io/community/contributors/devel/sig-architecture/api-conventions.md#metadata

   spec <Object>
     Specification of the desired behavior of the pod. More info:
     https://git.k8s.io/community/contributors/devel/sig-architecture/api-conventions.md#spec-and-status

   status       <Object>
     Most recently observed status of the pod. This data may not be up to date.
     Populated by the system. Read-only. More info:
     https://git.k8s.io/community/contributors/devel/sig-architecture/api-conventions.md#spec-and-status
[root@master ~]# kubectl explain pod.metadata
KIND:     Pod
VERSION:  v1

RESOURCE: metadata <Object>

DESCRIPTION:
     Standard object's metadata. More info:
     https://git.k8s.io/community/contributors/devel/sig-architecture/api-conventions.md#metadata

     ObjectMeta is metadata that all persisted resources must have, which
     includes all objects users must create.

FIELDS:
   annotations  <map[string]string>
     Annotations is an unstructured key value map stored with a resource that
     may be set by external tools to store and retrieve arbitrary metadata. They
     are not queryable and should be preserved when modifying objects. More
     info: http://kubernetes.io/docs/user-guide/annotations

   clusterName  <string>
     The name of the cluster which the object belongs to. This is used to
     distinguish resources with same name and namespace in different clusters.
     This field is not set anywhere right now and apiserver is going to ignore
     it if set in create or update request.

   creationTimestamp    <string>
     CreationTimestamp is a timestamp representing the server time when this
     object was created. It is not guaranteed to be set in happens-before order
     across separate operations. Clients may not set this value. It is
     represented in RFC3339 form and is in UTC. Populated by the system.
     Read-only. Null for lists. More info:
     https://git.k8s.io/community/contributors/devel/sig-architecture/api-conventions.md#metadata

   deletionGracePeriodSeconds   <integer>
     Number of seconds allowed for this object to gracefully terminate before it
     will be removed from the system. Only set when deletionTimestamp is also
     set. May only be shortened. Read-only.

   deletionTimestamp    <string>
     DeletionTimestamp is RFC 3339 date and time at which this resource will be
     deleted. This field is set by the server when a graceful deletion is
     requested by the user, and is not directly settable by a client. The
     resource is expected to be deleted (no longer visible from resource lists,
     and not reachable by name) after the time in this field, once the
     finalizers list is empty. As long as the finalizers list contains items,
     deletion is blocked. Once the deletionTimestamp is set, this value may not
     be unset or be set further into the future, although it may be shortened or
     the resource may be deleted prior to this time. For example, a user may
     request that a pod is deleted in 30 seconds. The Kubelet will react by
     sending a graceful termination signal to the containers in the pod. After
     that 30 seconds, the Kubelet will send a hard termination signal (SIGKILL)
     to the container and after cleanup, remove the pod from the API. In the
     presence of network partitions, this object may still exist after this
     timestamp, until an administrator or automated process can determine the
     resource is fully terminated. If not set, graceful deletion of the object
     has not been requested. Populated by the system when a graceful deletion is
     requested. Read-only. More info:
     https://git.k8s.io/community/contributors/devel/sig-architecture/api-conventions.md#metadata

   finalizers   <[]string>
     Must be empty before the object is deleted from the registry. Each entry is
     an identifier for the responsible component that will remove the entry from
     the list. If the deletionTimestamp of the object is non-nil, entries in
     this list can only be removed. Finalizers may be processed and removed in
     any order. Order is NOT enforced because it introduces significant risk of
     stuck finalizers. finalizers is a shared field, any actor with permission
     can reorder it. If the finalizer list is processed in order, then this can
     lead to a situation in which the component responsible for the first
     finalizer in the list is waiting for a signal (field value, external
     system, or other) produced by a component responsible for a finalizer later
     in the list, resulting in a deadlock. Without enforced ordering finalizers
     are free to order amongst themselves and are not vulnerable to ordering
     changes in the list.

   generateName <string>
     GenerateName is an optional prefix, used by the server, to generate a
     unique name ONLY IF the Name field has not been provided. If this field is
     used, the name returned to the client will be different than the name
     passed. This value will also be combined with a unique suffix. The provided
     value has the same validation rules as the Name field, and may be truncated
     by the length of the suffix required to make the value unique on the
     server. If this field is specified and the generated name exists, the
     server will NOT return a 409 - instead, it will either return 201 Created
     or 500 with Reason ServerTimeout indicating a unique name could not be
     found in the time allotted, and the client should retry (optionally after
     the time indicated in the Retry-After header). Applied only if Name is not
     specified. More info:
     https://git.k8s.io/community/contributors/devel/sig-architecture/api-conventions.md#idempotency

   generation   <integer>
     A sequence number representing a specific generation of the desired state.
     Populated by the system. Read-only.

   labels       <map[string]string>
     Map of string keys and values that can be used to organize and categorize
     (scope and select) objects. May match selectors of replication controllers
     and services. More info: http://kubernetes.io/docs/user-guide/labels

   managedFields        <[]Object>
     ManagedFields maps workflow-id and version to the set of fields that are
     managed by that workflow. This is mostly for internal housekeeping, and
     users typically shouldn't need to set or understand this field. A workflow
     can be the user's name, a controller's name, or the name of a specific
     apply path like "ci-cd". The set of fields is always in the version that
     the workflow used when modifying the object.

   name <string>
     Name must be unique within a namespace. Is required when creating
     resources, although some resources may allow a client to request the
     generation of an appropriate name automatically. Name is primarily intended
     for creation idempotence and configuration definition. Cannot be updated.
     More info: http://kubernetes.io/docs/user-guide/identifiers#names

   namespace    <string>
     Namespace defines the space within each name must be unique. An empty
     namespace is equivalent to the "default" namespace, but "default" is the
     canonical representation. Not all objects are required to be scoped to a
     namespace - the value of this field for those objects will be empty. Must
     be a DNS_LABEL. Cannot be updated. More info:
     http://kubernetes.io/docs/user-guide/namespaces

   ownerReferences      <[]Object>
     List of objects depended by this object. If ALL objects in the list have
     been deleted, this object will be garbage collected. If this object is
     managed by a controller, then an entry in this list will point to this
     controller, with the controller field set to true. There cannot be more
     than one managing controller.

   resourceVersion      <string>
     An opaque value that represents the internal version of this object that
     can be used by clients to determine when objects have changed. May be used
     for optimistic concurrency, change detection, and the watch operation on a
     resource or set of resources. Clients must treat these values as opaque and
     passed unmodified back to the server. They may only be valid for a
     particular resource or set of resources. Populated by the system.
     Read-only. Value must be treated as opaque by clients and . More info:
     https://git.k8s.io/community/contributors/devel/sig-architecture/api-conventions.md#concurrency-control-and-consistency

   selfLink     <string>
     SelfLink is a URL representing this object. Populated by the system.
     Read-only. DEPRECATED Kubernetes will stop propagating this field in 1.20
     release and the field is planned to be removed in 1.21 release.

   uid  <string>
     UID is the unique in time and space value for this object. It is typically
     generated by the server on successful creation of a resource and is not
     allowed to change on PUT operations. Populated by the system. Read-only.
     More info: http://kubernetes.io/docs/user-guide/identifiers#uids
```

在kubernetes中基本所有资源的一级属性都是一样的，主要包含5部分：

* `apiVersion <string>`			版本，由kubernetes内部定义，版本号必须可以用kubectl api-versions 查询到
* `kind <string>`                       类型，由kubernetes内部定义，版本号必须可以用kubectl api-resource 查询到
* `metadata <Object>`               元数据，主要是资源标识和说明，常用的有name、namespace、labels等
* `spec <Object>`                       描述，这是配置中最重要的一部分，里面是对各种资源配置的详细描述
* `status <Object>`                   状态信息，里面的内容不需要定义，由kubernetes自动生成

在上面的属性中，spec是接下来研究的重点，它的常见子属性：

* `containers <[]Object>`         容器列表，用于定义容器的详细信息
* `nodeName <String>`                根据nodeName的值将pod调度到指定的Node节点上
* `nodeSelector <map[]>`           根据NodeSelector中定义的信息选择该Pod调度到包含这些label的Node上
* `hostNetwork <boolean>`         是否使用主机网络模式，默认为false，如果设置为true，表示使用宿主机网络
* `volumes <[]Object>`               存储卷，用于定义Pod上面挂载的存储信息
* `restartPolicy <string>`        重启策略，表示Pod在遇到故障的时候的处理策略

-----

### 5.3 Pod配置

-----

学习`pod.spec.containers`属性，这也是pod配置中最为关键的一项配置

```powershell
[root@master ~]# kubectl explain pod.spec.containers
KIND:     Pod
VERSION:  v1

RESOURCE: containers <[]Object>

DESCRIPTION:
     List of containers belonging to the pod. Containers cannot currently be
     added or removed. There must be at least one container in a Pod. Cannot be
     updated.

     A single application container that you want to run within a pod.

FIELDS:
   name <string> 								# 容器名称
   image <string>								# 容器需要的镜像地址
   imagePullPolicy <string>			# 镜像拉取策略
   command <[]string>						# 容器的启动命令列表，如不指定，使用打包时使用的启动命令
   args <[]string>							# 容器的启动命令需要的参数列表
   env  <[]Object>							# 容器环境变量的配置
   ports <[]Object>							# 容器需要暴露的端口号列表
   resources <Object>						# 资源限制和资源请求的设置
```

-----

#### 5.3.1 基本配置

---

创建pod-base.yaml文件：

```yaml
apiVersion: v1
kind: Pod
metadata:
  name: pod-base
  namespace: dev
  labels:
    user: heima
spec:
  containers:
  - name: nginx
    image: 47.93.22.25:5000/nginx:latest
  - name: busybox
    image: 47.93.22.25:5000/busybox:1.30
```

上面定义了一个比较简单Pod的配置，里面有两个容器：

* nginx：私服的nginx镜像创建(nginx是一个轻量级的web容器)
* busybox：用私服的1.30版本的busybox镜像创建(busybox是一个小巧的linux命令集合)

```powershell
# 创建Pod
[root@master ~]# kubectl create -f pod-base.yaml
pod/pod-base created

# 查看Pod状况
# READY 1/2 表示当前Pod中有2个容器，其中1个准备就绪，1个未就绪
# RESTARTS  重启次数，因为有1个容器故障了，Pod一直在重启试图恢复它
[root@master ~]# kubectl get pods -n dev
NAME       READY   STATUS             RESTARTS   AGE
pod-base   1/2     CrashLoopBackOff   2          36s

# 可以通过describe查看内部详情
# 此时已经运行起来了一个基本的Pod，虽然暂时有问题
[root@master ~]# kubectl describe pod pod-base -n dev
```

---

#### 5.3.2 镜像拉取

----

创建pod-imagepullpolicy.yaml文件：

```yaml
apiVersion: v1
kind: Pod
metadata:
  name: pod-imagepullpolicy
  namespace: dev
spec:
  containers:
  - name: nginx
    image: 47.93.22.25:5000/nginx:latest
    imagePullPolicy: Always # 用于设置镜像拉取策略
  - name: busybox
    image: 47.93.22.25:5000/busybox:1.30
```

imagePullPolicy，用于设置镜像拉取策略，Kubernetes支持配置三种拉取策略：

*  Always：总是从远程仓库拉取镜像(一直用远程的)
* IfNotPresent：本地有则使用本地镜像，本地没有则从远程仓库拉取镜像
* Never：只使用本地镜像，从不去远程仓库拉取，本地没有就报错

>默认值说明：
>
>​	如果镜像tag为具体版本号，默认策略是：IfNotPresent
>
>​	如果镜像tag为：latest(最终版本)，默认策略是Always

```powershell
# 创建Pod
[root@master ~]# kubectl create -f pod-imagepullpolicy.yaml
pod/pod-imagepullpolicy created

[root@master ~]# kubectl get pod -n dev
NAME                  READY   STATUS             RESTARTS   AGE
pod-base              1/2     CrashLoopBackOff   13         43m
pod-imagepullpolicy   1/2     CrashLoopBackOff   1          8s
```

---

#### 5.3.3 启动命令

---

前面busybox容器一直没有成功运行：

busybox并不是一个程序，而是类似于一个工具类的集合，kubernetes集群启动管理后，它会自动关闭，解决方法就是让其一直在运行，需要用到command配置

创建pod-command.yaml文件：

```yaml
apiVersion: v1
kind: Pod
metadata:
  name: pod-command
  namespace: dev
spec:
  containers:
  - name: nginx
    image: 47.93.22.25:5000/nginx:latest
  - name: busybox
    image: 47.93.22.25:5000/busybox:1.30
    command: ["/bin/sh", "-c", "touch /tmp/hello.txt;while true;do /bin/echo $(date +%T) >> /tmp/hello.txt; sleep 3; done;"]
```

command，用于在pod中的容器初始化完毕之后运行一个命令

>"/bin/sh","-c"	使用sh执行命令
>
>touch /tmp/hello.txt;	创建一个/tmp/hello.txt文件
>
>while true;do /bin/echo $(data +%T) >> /tmp/hello.txt; sleep 3; done;	每隔3s向文件中写入当前时间

```powershell
# 创建Pod
[root@master ~]# kubectl create -f pod-command.yaml
pod/pod-command created

# 查看Pod状态
[root@master ~]# kubectl get pod -n dev
NAME                  READY   STATUS             RESTARTS   AGE
pod-command           2/2     Running            0          45s

# 进入Pod中的busybox容器，查看文件内容
# 补充一个命令: kubectl exec pod名称 -n 命名空间 -it -c 容器名称 /bin/sh 在容器内部执行命令
[root@master ~]# kubectl exec pod-command -n dev -it -c busybox /bin/sh
/ # tail -f /tmp/hello.txt 
17:55:54
17:55:57
17:56:00
17:56:03
17:56:06
17:56:09
17:56:12
17:56:15
```

---

#### 5.3.4 环境变量

----

创建pod-env.yaml文件：

```yaml
apiVersion: v1
kind: Pod
metadata:
  name: pod-env
  namespace: dev
spec:
  containers:
  - name: busybox
    image: 47.93.22.25:5000/busybox:1.30
    command: ["/bin/sh", "-c", "while true;do /bin/echo $(date +%T);sleep 60; done;"]
    env: # 设置环境变量列表
    - name: "username"
      value: "admin"
    - name: "password"
      value: "123456"
```

env，环境变量，用于在Pod中的容器设置环境变量

```powershell
# 创建Pod
[root@master ~]# kubectl create -f pod-env.yaml
pod/pod-env created

# 查看Pod
[root@master ~]# kubectl get pod -n dev
NAME                  READY   STATUS             RESTARTS   AGE
pod-command           2/2     Running            0          8m44s
pod-env               1/1     Running            0          54s

# 进入容器，输出环境变量
[root@master ~]# kubectl exec pod-env -n dev -it -c busybox /bin/sh
/ # echo $username
admin
/ # echo $password
123456
```

不推荐这种方式，推荐将这些配置单独存储在配置文件中，后面会进行学习

---

#### 5.3.5 端口设置

----

编写测试案例，创建pod-ports.yaml

```yaml
apiVersion: v1
kind: Pod
metadata:
  name: pod-ports
  namespace: dev
spec:
  containers:
  - name: nginx
    image: 47.93.22.25:5000/nginx:latest
    ports: # 设置容器暴露的端口列表
    - name: nginx-port
      containerPort: 80
      protocol: TCP
```

```powershell
# 创建Pod
[root@master ~]# kubectl create -f pod-ports.yaml
pod/pod-ports created

# 查看Pod
# 在下面可以明显看到配置信息
[root@master ~]# kubectl get pod pod-ports -n dev -o yaml
apiVersion: v1
kind: Pod
metadata:
  creationTimestamp: "2024-12-24T18:31:19Z"
  name: pod-ports
  namespace: dev
  resourceVersion: "925550"
  selfLink: /api/v1/namespaces/dev/pods/pod-ports
  uid: ba0a1796-90c4-4a6f-a131-de32155f0b9c
spec:
  containers:
  - image: 47.93.22.25:5000/nginx:latest
    imagePullPolicy: Always
    name: nginx
    ports:
    - containerPort: 80
      name: nginx-port
      protocol: TCP
    resources: {}
    terminationMessagePath: /dev/termination-log
    terminationMessagePolicy: File
    volumeMounts:
    - mountPath: /var/run/secrets/kubernetes.io/serviceaccount
      name: default-token-t76k4
      readOnly: true
  dnsPolicy: ClusterFirst
  enableServiceLinks: true
  nodeName: node1
  priority: 0
  restartPolicy: Always
  schedulerName: default-scheduler
  securityContext: {}
  serviceAccount: default
  serviceAccountName: default
  terminationGracePeriodSeconds: 30
  tolerations:
  - effect: NoExecute
    key: node.kubernetes.io/not-ready
    operator: Exists
    tolerationSeconds: 300
  - effect: NoExecute
    key: node.kubernetes.io/unreachable
    operator: Exists
    tolerationSeconds: 300
  volumes:
  - name: default-token-t76k4
    secret:
      defaultMode: 420
      secretName: default-token-t76k4
status:
  conditions:
  - lastProbeTime: null
    lastTransitionTime: "2024-12-24T18:31:20Z"
    status: "True"
    type: Initialized
  - lastProbeTime: null
    lastTransitionTime: "2024-12-24T18:31:21Z"
    status: "True"
    type: Ready
  - lastProbeTime: null
    lastTransitionTime: "2024-12-24T18:31:21Z"
    status: "True"
    type: ContainersReady
  - lastProbeTime: null
    lastTransitionTime: "2024-12-24T18:31:19Z"
    status: "True"
    type: PodScheduled
  containerStatuses:
  - containerID: docker://f807a98790f322d293a252435f986e698c5eae8a561a3f4aab335e23fd82b9ff
    image: 47.93.22.25:5000/nginx:latest
    imageID: docker-pullable://47.93.22.25:5000/nginx@sha256:abcdeeef78ef79f67efee2e7078c390af6b3804e8df29fb2cf74f0d2a430b725
    lastState: {}
    name: nginx
    ready: true
    restartCount: 0
    started: true
    state:
      running:
        startedAt: "2024-12-24T18:31:21Z"
  hostIP: 172.16.140.135
  phase: Running
  podIP: 10.244.1.16
  podIPs:
  - ip: 10.244.1.16
  qosClass: BestEffort
  startTime: "2024-12-24T18:31:20Z"
```

访问容器中的程序需要使用的是`PodIP:containerPort`

---

#### 5.3.5 资源配额

----

kubernetes提供了对内存和cpu的资源进行配额的机制，这种机制主要通过resources选项实现，有两个子选项：

* limits：用于限制运行时容器的最大占用资源，当容器占用资源超过limits时会被终止，并进行重启
* requests：用于设置容器需要的最小资源，如果环境资源不够，容器将无法启动

可以通过上面两个选项设置资源的上下限

创建pod-resources.yaml

```yaml
apiVersion: v1
kind: Pod
metadata:
  name: pod-resources
  namespace: dev
spec:
  containers:
  - name: nginx
    image: 47.93.22.25:5000/nginx:latest
    resources: # 资源配额
      limits: # 限制资源(上限)
        cpu: "2" # CPU限制，单位是core数
        memory: "10Gi" # 内存限制
      requests: # 请求资源(下限)
        cpu: "1" # CPU限制，单位是core数
        memory: "10Mi" # 内存限制
```

cpu和memory单位：

* cpu：core数，可以为整数或小数
* memory：内存大小，可以使用Gi、Mi、G、M等形式

```powershell
# 运行Pod
[root@master ~]# kubectl create -f pod-resources.yaml
pod/pod-resources created

# 查看Pod状态
[root@master ~]# kubectl get pod pod-resources -n dev
NAME            READY   STATUS    RESTARTS   AGE
pod-resources   1/1     Running   0          44s
```

----

### 5.4 Pod生命周期

---

我们一般将Pod对象从创建至终的这段时间范围称为Pod的生命周期，它主要包含下面的过程：

* Pod创建过程
* 运行初始化容器(init container)过程
* 运行主容器(main container)过程
  * 容器启动后钩子(post start)、容器终止前钩子(pre stop)
  * 容器的存活性探测(liveness probe)、就绪性探测(readiness probe)
* Pod终止过程

<img src="https://tonkyshan.cn/img/20241225192322.png" alt="20241225192322" style="zoom: 40%;" />

在整个生命周期中，Pod会出现5种**状态(相位)**，分别如下

* 挂起(Pending)：apiserver已经创建了pod资源对象，但它尚未被调度完成或者仍处于下载镜像的过程中
* 运行中(Running)：pod已经被调度至某节点，并且所有容器都已经被kubelet创建完成
* 成功(Succeeded)：pod中的所有容器都已经成功终止并且不会被重启
* 失败(Failed)：所有容器都已经终止，但至少有一个容器终止失败，即容器返回了非0值的退出状态
* 位置(Unknown)：apiserver无法正常获取到pod对象的状态信息，通常由网络通信失败所导致

----

#### 5.4.1 创建和终止

---

**pod的创建过程**

1、用户通过kubectl或其它api客户端提交需要创建的pod信息给apiServer

2、apiServer开始生成pod对象的信息，并将信息存入etcd，然后返回确认信息至客户端

3、apiServer开始反映etcd的pod对象的变化，其它组件使用watch机制来跟踪检查apiServer上的变动

4、scheduler发现有新的pod对象要创建，开始为pod分配主机并将结果信息更新至apiServer

5、node节点上的kubelet发现有pod调度过来，尝试调用docker启动容器，并将结果回送至apiServer

6、apiServer将接收到的pod状态信息存入etcd中

**pod的终止过程**

1、用户向apiServer发送删除pod对象的命令

2、apiServer中的pod对象信息会随着时间的推移而更新，在宽限期内(默认30s)，pod被视为dead

3、将pod标记为terminating状态

4、kubelet在监控到pod对象转为terminating状态的同时启动pod关闭过程

5、端点控制器监控到了pod对象的关闭行为时将其从所有匹配到此端点的service资源的端点列表中移除

6、如果当前pod对象定义了preStop钩子处理器，则在其标记为terminating后即会以同步的方式启动执行

7、pod对象中的容器进程收到停止信号

8、宽限期结束后，若pod中还存在仍在运行的进程，那么pod对象会收到立即终止的信号

9、kubelet请求apiServer将此pod资源的宽限期设置为0从而完成删除操作，此时pod对于用户已不可见

---

#### 5.4.2 初始化容器

---

初始化容器是在pod的主容器启动之前要运行的容器，主要是做一些主容器的前置工作，它具有两大特征：

* 初始化容器必须运行完成直至结束，若某初始化容器运行失败，那么kubernetes需要重启它直到成功完成

* 初始化容器必须按照定义的顺序执行，当且仅当前一个成功后，后面的一个才能运行

初始化容器有很多的应用场景，下面列出的是最常见的几个：

* 提供主容器镜像中不具备的工具程序或自定义代码
* 初始化容器要先于应用容器串行启动并运行完成，因此可用于延后应用容器的启动直至其依赖的条件得到满足

模拟需求：

假设要以主容器来运行nginx，但是要求在运行nginx之前先要能够连接上mysql和redis所在服务器

创建pod-initcontainer.yaml

```yaml
apiVersion: v1
kind: Pod
metadata:
  name: pod-initcontainer
  namespace: dev
spec:
  containers:
  - name: main-container
    image: 47.93.22.25:5000/nginx:latest
    ports: # 设置容器暴露的端口列表
    - name: nginx-port
      containerPort: 80
  initContainers:
  - name: test-mysql
    image: 47.93.22.25:5000/busybox:1.30
    command: ['sh', '-c', 'until ping mysql的ip -c 1; do echo waiting for mysql ...; sleep 2; done;']
  - name: test-redis
    image: 47.93.22.25:5000/busybox:1.30
    command: ['sh', '-c', 'until ping redis的ip -c 1; do echo waiting for redis ...; sleep 2; done;']
```

```powershell
# 创建pod
[root@master ~]# kubectl create -f pod-initcontainer.yaml
pod/pod-initcontainer created

# 查看pod状态
[root@master ~]# kubectl get pod pod-initcontainer -n dev
NAME            	 READY    STATUS     RESTARTS      AGE
pod-initcontainer  0/1      Init:0/2   0             38s

# 新增ip，观察pod变化
```

---

#### 5.4.3 钩子函数

---

钩子函数能够感知自身生命周期中的事件，并在相应的时刻到来时运行用户指定的程序代码

kubernetes在主容器的启动之后和停止之前提供了两个钩子函数：

* post start：容器创建之后执行，如果失败了会重启容器
* pre stop：容器终止之前执行，执行完成之后容器将成功终止，在其完成之前会阻塞删除容器的操作

钩子处理器支持使用下面三种方式定义动作：

* Exec命令：在容器内执行一次命令

  ```yaml
  ...
    lifecycle:
      postStart:
        exec:
          command:
          - cat
          - /tmp/healthy
  ...
  ```

* TCPSocket：在当前容器尝试访问指定的socket

  ```yaml
  ...
    lifecycle:
      postStart:
        tcpSocket:
          port: 8080
  ...
  ```

* HTTPGet：在当前容器中向某url发起http请求：

  ```yaml
  ...
    lifecycle:
      postStart:
        httpGet:
          path: / # URI地址
          port: 80 # 端口号
          host: 127.0.0.1 # 主机地址
          scheme: HTTP # 支持的协议，http或者https
  ...
  ```

以exec方式为例，演示钩子函数的使用，创建pod-hook-exec.yaml文件：

```yaml
apiVersion: v1
kind: Pod
metadata:
  name: pod-hook-exec
  namespace: dev
spec:
  containers:
  - name: main-container
    image: 47.93.22.25:5000/nginx:latest
    ports: 
    - name: nginx-port
      containerPort: 80
    lifecycle: 
      postStart: 
        exec: # 在容器启动的时候执行一个命令，修改掉nginx的默认首页内容
          command: ["/bin/sh", "-c", "echo postStart... > /usr/share/nginx/html/index.html"]
      preStop:
        exec: # 在容器停止之前停止nginx服务
          command: ["usr/sbin/nginx", "-s", "quit"]
```

```powershell
# 创建pod
[root@master ~]# kubectl create -f pod-hook-exec.yaml
pod/pod-hook-exec created

# 查看pod状态
[root@master ~]# kubectl get pods pod-hook-exec -n dev -o wide
NAME            READY   STATUS    RESTARTS   AGE    IP            NODE    NOMINATED NODE   READINESS GATES
pod-hook-exec   1/1     Running   0          119s   10.244.2.15   node2   <none>           <none>

# 访问pod
[root@master ~]# curl 10.244.2.15:80
postStart...
```

----

#### 5.4.4 容器探测

---

容器探测用于检测容器中的应用实例是否正常工作，是保障业务可用性的一种传统机制。如果经过探测，实例的状态不符合预期，那么kubernetes就会把该问题实例摘除，不承担业务流量。kuberctl提供了两种探针来实现容器探测，分别是：

* liveness probes：存活性探针，用于检测应用实例当前是否处于正常运行状态，如果不是，k8s会重启容器
* readiness probes：就绪性探针，用于检测应用实例当前是否可以接收请求，如果不能，k8s不会转发流量

>livenessProbe 决定是否重启容器，readinessProbe决定是否将请求转发给容器

上面两种探针目前均支持三种探测方式：

* Exec命令：在容器内执行一次命令，如果命令执行的退出码为0，则认为程序正常，否则不正常

  ```yaml
  ...
    livenessProbe:
      exec:
        command:
        - cat:
        - /tmp/healthy
  ...
  ```

* TCPSocket：将会尝试访问一个用户容器的端口，如果能够建立这条连接，则认为程序正常，否则不正常

  ```yaml
  ...
    livenessProbe:
      tcpSocket:
        port: 8080
  ...
  ```

* HTTPGet：调用容器内Web应用的URL，如果返回的状态码在200和399之间，则认为程序正常，否则不正常

  ```yaml
  ...
    lifecycle:
      postStart:
        httpGet:
          path: / # URI地址
          port: 80 # 端口号
          host: 127.0.0.1 # 主机地址
          scheme: HTTP # 支持的协议，http或者https
  ...
  ```

**方式一：Exec**

创建pod-liveness-exec.yaml

```yaml
apiVersion: v1
kind: Pod
metadata:
  name: pod-liveness-exec
  namespace: dev
spec:
  containers:
  - name: nginx
    image: 47.93.22.25:5000/nginx:latest
    ports:
    - name: nginx-port
      containerPort: 80
    livenessProbe:
      exec:
        command: ["/bin/cat", "/tmp/hello.txt"] # 执行一个查看文件的命令
```

```powershell
# 创建pod，观察效果
[root@master ~]# kubectl create -f pod-liveness-exec.yaml
pod/pod-liveness-exec created

# 查看pod状态
[root@master ~]# kubectl get pods pod-liveness-exec -n dev
NAME                READY   STATUS    RESTARTS   AGE
pod-liveness-exec   1/1     Running   2          61s

[root@master ~]# kubectl get pods pod-liveness-exec -n dev
NAME                READY   STATUS    RESTARTS   AGE
pod-liveness-exec   1/1     Running   3          111s

# 查看pod详情
[root@master ~]# kubectl describe pods pod-liveness-exec -n dev
Name:         pod-liveness-exec
Namespace:    dev
Priority:     0
Node:         node1/172.16.140.135
Start Time:   Thu, 26 Dec 2024 03:24:26 +0800
Labels:       <none>
Annotations:  <none>
Status:       Running
IP:           10.244.1.17
IPs:
  IP:  10.244.1.17
Containers:
  nginx:
    Container ID:   docker://66880b94bbcc2382a0162ee6a15683c4eff6f602da3282d64ae1c65df88cf8a9
    Image:          47.93.22.25:5000/nginx:latest
    Image ID:       docker-pullable://47.93.22.25:5000/nginx@sha256:abcdeeef78ef79f67efee2e7078c390af6b3804e8df29fb2cf74f0d2a430b725
    Port:           80/TCP
    Host Port:      0/TCP
    State:          Waiting
      Reason:       CrashLoopBackOff
    Last State:     Terminated
      Reason:       Completed
      Exit Code:    0
      Started:      Thu, 26 Dec 2024 03:26:22 +0800
      Finished:     Thu, 26 Dec 2024 03:26:52 +0800
    Ready:          False
    Restart Count:  4
    Liveness:       exec [/bin/cat /tmp/hello.txt] delay=0s timeout=1s period=10s #success=1 #failure=3
    Environment:    <none>
    Mounts:
      /var/run/secrets/kubernetes.io/serviceaccount from default-token-t76k4 (ro)
Conditions:
  Type              Status
  Initialized       True 
  Ready             False 
  ContainersReady   False 
  PodScheduled      True 
Volumes:
  default-token-t76k4:
    Type:        Secret (a volume populated by a Secret)
    SecretName:  default-token-t76k4
    Optional:    false
QoS Class:       BestEffort
Node-Selectors:  <none>
Tolerations:     node.kubernetes.io/not-ready:NoExecute for 300s
                 node.kubernetes.io/unreachable:NoExecute for 300s
Events:
  Type     Reason     Age                   From               Message
  ----     ------     ----                  ----               -------
  Normal   Scheduled  <unknown>             default-scheduler  Successfully assigned dev/pod-liveness-exec to node1
  Normal   Pulled     104s (x3 over 2m40s)  kubelet, node1     Successfully pulled image "47.93.22.25:5000/nginx:latest"
  Normal   Created    104s (x3 over 2m40s)  kubelet, node1     Created container nginx
  Normal   Started    104s (x3 over 2m40s)  kubelet, node1     Started container nginx
  Normal   Pulling    75s (x4 over 2m40s)   kubelet, node1     Pulling image "47.93.22.25:5000/nginx:latest"
  Warning  Unhealthy  75s (x9 over 2m35s)   kubelet, node1     Liveness probe failed: /bin/cat: /tmp/hello.txt: No such file or directory
  Normal   Killing    75s (x3 over 2m15s)   kubelet, node1     Container nginx failed liveness probe, will be restarted
```

**方式二：TCPSocket**

创建pod-liveness-tcpsocket.yaml

```yaml
apiVersion: v1
kind: Pod
metadata:
  name: pod-liveness-tcpsocket
  namespace: dev
spec:
  containers:
  - name: nginx
    image: 47.93.22.25:5000/nginx:latest
    ports:
    - name: nginx-port
      containerPort: 80
    livenessProbe:
      tcpSocket:
        port: 8080 # 尝试访问8080端口
```

```powershell
# 创建pod
[root@master ~]# kubectl create -f pod-liveness-tcpsocket.yaml
pod/pod-liveness-tcpsocket created

# 查看pod详情
[root@master ~]# kubectl describe pod pod-liveness-tcpsocket -n dev
Name:         pod-liveness-tcpsocket
Namespace:    dev
Priority:     0
Node:         node1/172.16.140.135
Start Time:   Thu, 26 Dec 2024 03:58:19 +0800
Labels:       <none>
Annotations:  <none>
Status:       Running
IP:           10.244.1.18
IPs:
  IP:  10.244.1.18
Containers:
  nginx:
    Container ID:   docker://223d6cd966d2a43a30d8c487a42d4028cc1c7988b77abc99f7d7e5910a5e772e
    Image:          47.93.22.25:5000/nginx:latest
    Image ID:       docker-pullable://47.93.22.25:5000/nginx@sha256:abcdeeef78ef79f67efee2e7078c390af6b3804e8df29fb2cf74f0d2a430b725
    Port:           80/TCP
    Host Port:      0/TCP
    State:          Waiting
      Reason:       CrashLoopBackOff
    Last State:     Terminated
      Reason:       Completed
      Exit Code:    0
      Started:      Thu, 26 Dec 2024 04:02:07 +0800
      Finished:     Thu, 26 Dec 2024 04:02:36 +0800
    Ready:          False
    Restart Count:  6
    Liveness:       tcp-socket :8080 delay=0s timeout=1s period=10s #success=1 #failure=3
    Environment:    <none>
    Mounts:
      /var/run/secrets/kubernetes.io/serviceaccount from default-token-t76k4 (ro)
Conditions:
  Type              Status
  Initialized       True 
  Ready             False 
  ContainersReady   False 
  PodScheduled      True 
Volumes:
  default-token-t76k4:
    Type:        Secret (a volume populated by a Secret)
    SecretName:  default-token-t76k4
    Optional:    false
QoS Class:       BestEffort
Node-Selectors:  <none>
Tolerations:     node.kubernetes.io/not-ready:NoExecute for 300s
                 node.kubernetes.io/unreachable:NoExecute for 300s
Events:
  Type     Reason     Age                    From               Message
  ----     ------     ----                   ----               -------
  Normal   Scheduled  <unknown>              default-scheduler  Successfully assigned dev/pod-liveness-tcpsocket to node1
  Normal   Pulled     5m36s (x3 over 6m33s)  kubelet, node1     Successfully pulled image "47.93.22.25:5000/nginx:latest"
  Normal   Created    5m36s (x3 over 6m33s)  kubelet, node1     Created container nginx
  Normal   Started    5m36s (x3 over 6m33s)  kubelet, node1     Started container nginx
  Normal   Pulling    5m7s (x4 over 6m33s)   kubelet, node1     Pulling image "47.93.22.25:5000/nginx:latest"
  Warning  Unhealthy  5m7s (x9 over 6m27s)   kubelet, node1     Liveness probe failed: dial tcp 10.244.1.18:8080: connect: connection refused
  Normal   Killing    5m7s (x3 over 6m7s)    kubelet, node1     Container nginx failed liveness probe, will be restarted
  Warning  BackOff    84s (x11 over 4m7s)    kubelet, node1     Back-off restarting failed container
```

**方式三：HTTPGet**

创建pod-liveness-httpget.yaml

```yaml
apiVersion: v1
kind: Pod
metadata: 
  name: pod-liveness-httpget
  namespace: dev
spec:
  containers:
  - name: nginx
    image: 47.93.22.25:5000/nginx:latest
    ports: 
    - name: nginx-port
      containerPort: 80
      protocol: TCP
    livenessProbe:
      httpGet: # 其实就是访问scheme://host:port/path
        scheme: HTTP # 支持的协议，http或者https
        port: 80 # 端口号
        path: /hello # URI地址
```

```powershell
# 创建Pod
[root@master ~]# kubectl create -f pod-liveness-httpget.yaml
pod/pod-liveness-httpget created

# 查看pod详情
[root@master ~]# kubectl describe pod pod-liveness-httpget -n dev
Name:         pod-liveness-httpget
Namespace:    dev
Priority:     0
Node:         node1/172.16.140.135
Start Time:   Thu, 26 Dec 2024 04:45:45 +0800
Labels:       <none>
Annotations:  <none>
Status:       Running
IP:           10.244.1.19
IPs:
  IP:  10.244.1.19
Containers:
  nginx:
    Container ID:   docker://40b393f81bac78babc7e20f77e57f17c0f2d2efdb2080e9c4f110a405c5850b6
    Image:          47.93.22.25:5000/nginx:latest
    Image ID:       docker-pullable://47.93.22.25:5000/nginx@sha256:abcdeeef78ef79f67efee2e7078c390af6b3804e8df29fb2cf74f0d2a430b725
    Port:           80/TCP
    Host Port:      0/TCP
    State:          Running
      Started:      Thu, 26 Dec 2024 04:46:15 +0800
    Last State:     Terminated
      Reason:       Completed
      Exit Code:    0
      Started:      Thu, 26 Dec 2024 04:45:46 +0800
      Finished:     Thu, 26 Dec 2024 04:46:14 +0800
    Ready:          True
    Restart Count:  1
    Liveness:       http-get http://:80/hello delay=0s timeout=1s period=10s #success=1 #failure=3
    Environment:    <none>
    Mounts:
      /var/run/secrets/kubernetes.io/serviceaccount from default-token-t76k4 (ro)
Conditions:
  Type              Status
  Initialized       True 
  Ready             True 
  ContainersReady   True 
  PodScheduled      True 
Volumes:
  default-token-t76k4:
    Type:        Secret (a volume populated by a Secret)
    SecretName:  default-token-t76k4
    Optional:    false
QoS Class:       BestEffort
Node-Selectors:  <none>
Tolerations:     node.kubernetes.io/not-ready:NoExecute for 300s
                 node.kubernetes.io/unreachable:NoExecute for 300s
Events:
  Type     Reason     Age                From               Message
  ----     ------     ----               ----               -------
  Normal   Scheduled  <unknown>          default-scheduler  Successfully assigned dev/pod-liveness-httpget to node1
  Normal   Pulling    14s (x2 over 42s)  kubelet, node1     Pulling image "47.93.22.25:5000/nginx:latest"
  Normal   Killing    14s                kubelet, node1     Container nginx failed liveness probe, will be restarted
  Normal   Pulled     13s (x2 over 42s)  kubelet, node1     Successfully pulled image "47.93.22.25:5000/nginx:latest"
  Normal   Created    13s (x2 over 42s)  kubelet, node1     Created container nginx
  Normal   Started    13s (x2 over 42s)  kubelet, node1     Started container nginx
  Warning  Unhealthy  4s (x4 over 34s)   kubelet, node1     Liveness probe failed: HTTP probe failed with statuscode: 404
```

补充

查看livenessProbe的子属性，会发现除了这三种方式，还有一些其他的配置：

```powershell
[root@master ~]# kubectl explain pod.spec.containers.livenessProbe
FIELDS:
	 exec <Object>
	 tcpSocket <Object>
	 httpGet <Object>
	 initialDelaySeconds <integer>  # 容器启动后等待多少秒执行第一次探测
	 timeoutSeconds <integer> 		  # 探测超时时间 默认1s 最小1s
	 periodSeconds <integer> 				# 执行探测的频率 默认是10s 最小1s
	 failureThreshold <integer>			# 连续探测失败多少次才被认定为失败 默认是3 最小值是1
	 successThreshold <integer>			# 连续探测成功多少次才被认定为成功 默认是1
```

----

#### 5.4.5 重启策略

----

一旦容器探测出现了问题，kubernetes就会对容器所在的Pod进行重启，其实这是由pod的重启策略决定的，pod的重启策略有3种：

* Always：容器失效时，自动重启该容器，这也是默认值
* OnFailure：容器终止运行且退出码不为0时重启
* Never：不论状态为何，都不重启该容器

重启策略适用于pod对象中的所有容器，首次需要重启的容器，将在其需要时立即进行重启，随后再次需要重启的操作将由kubelet延迟一段时间后进行，且反复的重启操作的延迟时长依次为10s，20s，40s，80s，160s和300s，300s是最大延迟时长

创建pod-restartpolicy.yaml

```yaml
apiVersion: v1
kind: Pod
metadata:
  name: pod-restartpolicy
  namespace: dev
spec:
  containers:
  - name: nginx
    image: 47.93.22.25:5000/nginx:latest
    ports: 
    - name: nginx-port
      containerPort: 80
    livenessProbe:
      httpGet:
        scheme: HTTP
        port: 80
        path: /hello
  restartPolicy: Never # 设置重启策略为Never
```

```powershell
# 创建pod
[root@master ~]# kubectl create -f pod-restartpolicy.yaml
pod/pod-restartpolicy created

# 查看详情
[root@master ~]# kubectl describe pod pod-restartpolicy -n dev
Name:         pod-restartpolicy
Namespace:    dev
Priority:     0
Node:         node1/172.16.140.135
Start Time:   Thu, 26 Dec 2024 07:34:00 +0800
Labels:       <none>
Annotations:  <none>
Status:       Succeeded
IP:           10.244.1.20
IPs:
  IP:  10.244.1.20
Containers:
  nginx:
    Container ID:   docker://7878c97b3bff5564f74706112ff14d9a4df7e15ee74107325dc57e981d3505ef
    Image:          47.93.22.25:5000/nginx:latest
    Image ID:       docker-pullable://47.93.22.25:5000/nginx@sha256:abcdeeef78ef79f67efee2e7078c390af6b3804e8df29fb2cf74f0d2a430b725
    Port:           80/TCP
    Host Port:      0/TCP
    State:          Terminated
      Reason:       Completed
      Exit Code:    0
      Started:      Thu, 26 Dec 2024 07:34:01 +0800
      Finished:     Thu, 26 Dec 2024 07:34:27 +0800
    Ready:          False
    Restart Count:  0
    Liveness:       http-get http://:80/hello delay=0s timeout=1s period=10s #success=1 #failure=3
    Environment:    <none>
    Mounts:
      /var/run/secrets/kubernetes.io/serviceaccount from default-token-t76k4 (ro)
Conditions:
  Type              Status
  Initialized       True 
  Ready             False 
  ContainersReady   False 
  PodScheduled      True 
Volumes:
  default-token-t76k4:
    Type:        Secret (a volume populated by a Secret)
    SecretName:  default-token-t76k4
    Optional:    false
QoS Class:       BestEffort
Node-Selectors:  <none>
Tolerations:     node.kubernetes.io/not-ready:NoExecute for 300s
                 node.kubernetes.io/unreachable:NoExecute for 300s
Events:
  Type     Reason     Age                From               Message
  ----     ------     ----               ----               -------
  Normal   Scheduled  <unknown>          default-scheduler  Successfully assigned dev/pod-restartpolicy to node1
  Normal   Pulling    70s                kubelet, node1     Pulling image "47.93.22.25:5000/nginx:latest"
  Normal   Pulled     70s                kubelet, node1     Successfully pulled image "47.93.22.25:5000/nginx:latest"
  Normal   Created    70s                kubelet, node1     Created container nginx
  Normal   Started    70s                kubelet, node1     Started container nginx
  Warning  Unhealthy  44s (x3 over 64s)  kubelet, node1     Liveness probe failed: HTTP probe failed with statuscode: 404
  Normal   Killing    44s                kubelet, node1     Stopping container nginx

# 查看pod
[root@master ~]# kubectl get pod pod-restartpolicy -n dev
NAME                READY   STATUS      RESTARTS   AGE
pod-restartpolicy   0/1     Completed   0          117s
```

----

### 5.5 Pod调度

---

在默认情况下，一个Pod在哪个Node节点上运行，是由Scheduler组件采用相应的算法计算出来的，这个过程是不受人工控制的，实际使用中，这并不满足需求，因为很多情况下，我们需要控制某些Pod到达某些节点上。

kubernetes提供了四类调度方式：

* 自动调度：运行在哪个节点上完全由Scheduler经过一系列的算法计算得出
* 定向调度：NodeName、NodeSelector
* 亲和性调度：NodeAffinity、PodAffinity、PodAntiAffinity
* 污点(容忍)调度：Taints、Toleration

---

#### 5.5.1 定向调度

----

定向调度，指的是利用在pod上声明nodeName或者nodeSelector，以此将pod调度到期望的node节点上，这里的调度是强制性的，意味着即使要调度的目标Node不存在，也会向上面进行调度，只不过pod运行失败而已

**NodeName**

NodeName用于强制约束将pod调度到指定的Name的Node节点上，这种方式，其实是直接跳过Scheduler的调度逻辑，直接将Pod调度到指定名称的节点

创建一个pod-nodename.yaml

```yaml
apiVersion: v1
kind: Pod
metadata:
  name: pod-nodename
  namespace: dev
spec:
  containers:
  - name: nginx
    image: 47.93.22.25:5000/nginx:latest
  nodeName: node1 # 指定调度到node1节点上
```

```powershell
# 创建Pod
[root@master ~]# kubectl create -f pod-nodename.yaml
pod/pod-nodename created

# 查看Pod调度到NODE属性，调度到了node1节点上
[root@master ~]# kubectl get pods pod-nodename -n dev -o wide
NAME           READY   STATUS    RESTARTS   AGE   IP            NODE    NOMINATED NODE   READINESS GATES
pod-nodename   1/1     Running   0          73s   10.244.1.21   node1   <none>           <none>

# 接下来删除pod，修改nodeName的值为node3(并没有node3节点)
[root@master ~]# kubectl delete -f pod-nodename.yaml
pod "pod-nodename" deleted
[root@master ~]# vim pod-nodename.yaml
[root@master ~]# kubectl create -f pod-nodename.yaml
pod/pod-nodename created
[root@master ~]# kubectl get pods pod-nodename -n dev -o wide
NAME           READY   STATUS    RESTARTS   AGE   IP       NODE    NOMINATED NODE   READINESS GATES
pod-nodename   0/1     Pending   0          4s    <none>   node3   <none>           <none>
```

**NodeSelector**

NodeSelector用于将pod调度到添加了指定标签的node节点上，它是通过kubernetes的label-selector机制实现的，也就是说，在pod创建之前，会由scheduler使用MatchNodeSelector调度策略进行label匹配，找出目标node，然后将pod调度到目标节点，改匹配规则是强制约束

1、首先分别为node节点添加标签

```powershell
[root@master ~]# kubectl label nodes node1 nodeenv=pro
node/node1 labeled
[root@master ~]# kubectl label nodes node2 nodeenv=test
node/node2 labeled
```

2、创建一个pod-nodeselector.yaml文件

```yaml
apiVersion: v1
kind: Pod
metadata:
  name: pod-nodeselector
  namespace: dev
spec:
  containers:
  - name: nginx
    image: 47.93.22.25:5000/nginx:latest
  nodeSelector:
    nodeenv: pro # 指定调度到具有nodeenv=pro标签的节点上
```

```powershell
# 创建pod
[root@master ~]# kubectl create -f pod-nodeselector.yaml
pod/pod-nodeselector created

# 调度到了node1节点上
[root@master ~]# kubectl get pods pod-nodeselector -n dev -o wide
NAME               READY   STATUS    RESTARTS   AGE   IP            NODE    NOMINATED NODE   READINESS GATES
pod-nodeselector   1/1     Running   0          42s   10.244.1.22   node1   <none>           <none>

# 删除pod，修改nodeSelector的值为nodeenv: pro1(不存在打有此标签的节点)
[root@master ~]# kubectl delete -f pod-nodeselector.yaml
pod "pod-nodeselector" deleted
[root@master ~]# vim pod-nodeselector.yaml
[root@master ~]# kubectl create -f pod-nodeselector.yaml
pod/pod-nodeselector created
[root@master ~]# kubectl get pods pod-nodeselector -n dev -o wide
NAME               READY   STATUS    RESTARTS   AGE   IP       NODE     NOMINATED NODE   READINESS GATES
pod-nodeselector   0/1     Pending   0          4s    <none>   <none>   <none>           <none>

# 查看详情，发现node selector匹配失败的提示
[root@master ~]# kubectl describe pods pod-nodeselector -n dev
Name:         pod-nodeselector
Namespace:    dev
Priority:     0
Node:         <none>
Labels:       <none>
Annotations:  <none>
Status:       Pending
IP:           
IPs:          <none>
Containers:
  nginx:
    Image:        47.93.22.25:5000/nginx:latest
    Port:         <none>
    Host Port:    <none>
    Environment:  <none>
    Mounts:
      /var/run/secrets/kubernetes.io/serviceaccount from default-token-t76k4 (ro)
Conditions:
  Type           Status
  PodScheduled   False 
Volumes:
  default-token-t76k4:
    Type:        Secret (a volume populated by a Secret)
    SecretName:  default-token-t76k4
    Optional:    false
QoS Class:       BestEffort
Node-Selectors:  nodeenv=pro1
Tolerations:     node.kubernetes.io/not-ready:NoExecute for 300s
                 node.kubernetes.io/unreachable:NoExecute for 300s
Events:
  Type     Reason            Age        From               Message
  ----     ------            ----       ----               -------
  Warning  FailedScheduling  <unknown>  default-scheduler  0/3 nodes are available: 3 node(s) didn't match node selector.
```

---

#### 5.5.2 亲和性调度

----

定向调度方式，有一定的问题，如果没有满足条件的Node，那么Pod将不会被运行，即使在集群中还有可用的Node列表也不行，这就限制了它的使用场景

基于上面的问题，kubernetes还提供了一种亲和性调度(Affinity)，它在NodeSelector的基础之上进行了扩展，可以通过配置的形式，实现优先选择满足条件的Node进行调度，如果没有，也可以调度到不满足条件的节点上，使调度更加灵活

Affinity主要分为三类：

* nodeAffinity(node亲和性)：以node为目标，解决pod可以调度到哪些node的问题
* podAffinity(pod亲和性)：以pod为目标，解决pod可以和哪些已存在的pod部署在同一个拓扑域中的问题
* podAntiAffinity(pod反亲和性)：以pod为目标，解决pod不可以和哪些已存在的pod部署在同一个拓扑域中的问题

>关于亲和性(反亲和性)的使用场景：
>
>**亲和性：**如果两个应用频繁交互，那就有必要利用亲和性让两个应用尽可能的靠近，这样可以减少因网络通信带来的性能损耗
>
>**反亲和性：**当应用采用多副本部署时，有必要采用反亲和性让各个应用实例打散分布在各个node上，这样可以提高服务的高可用性

**NodeAffinity**

`NodeAffinity`的可配置项：

```markdown
pod.spec.affinity.nodeAffinity
  requiredDuringSchedulingIgnoredDuringExecution Node节点必须满足指定的所有规则才可以，相当于硬限制
    nodeSelectorTerms  节点选择列表
      matchFields  按节点字段列出的节点选择器要求列表
      matchExpressions  按节点标签列出的节点选择器要求列表(推荐)
        key  键
        values  值
        operator  关系符 支持Exists，DoesNotExist，In，NotIn，Gt，Lt
  preferredDuringSchedulingIgnoredDuringExecution 优先调度到满足指定的规则的Node，相当于软限制(倾向)
    preference  一个节点选择器项，与相应的权重相关联
      matchFields  按节点字段列出的节点选择器要求列表
      matchExpressions  按节点标签列出的节点选择器要求列表(推荐)
        key  键
        values  值
        operator  关系符 支持Exists，DoesNotExist，In，NotIn，Gt，Lt
    weight 倾向权重，范围在1-100
```

```markdown
关系符的使用说明：

- matchExpressions:
  - key: nodeenv  # 匹配存在的标签的key为nodeenv的节点
    operator: Exists
  - key: nodeenv	# 匹配标签的key为nodeenv，且value是"xxx"或"yyy"的节点
    operstor: In
    values: ["xxx", "yyy"]
  - key: nodeenv	# 匹配标签的key为nodeenv，且value大于"xxx"的节点
    operator: Gt
    values: "xxx"
```

演示一下`requiredDuringSchedulingIgnoredDuringExecution`

创建pod-nodeaffinity-required.yaml

```yaml
apiVersion: v1
kind: Pod
metadata:
  name: pod-nodeaffinity-required
  namespace: dev
spec:
  containers:
  - name: nginx
    image: 47.93.22.25:5000/nginx:latest
  affinity:		# 亲和性设置
    nodeAffinity:		# 设置node亲和性
      requiredDuringSchedulingIgnoredDuringExecution:		# 硬限制
        nodeSelectorTerms:
        - matchExpressions:		# 匹配env的值在["xxx", "yyy"]中的标签
          - key: nodeenv
            operator: In
            values: ["xxx", "yyy"]
```

```powershell
# 创建pod
[root@master ~]# kubectl create -f pod-nodeaffinity-required.yaml
pod/pod-nodeaffinity-required created

# 查看pod状态(运行失败)
[root@master ~]# kubectl get pods pod-nodeaffinity-required -n dev -o wide
NAME                        READY   STATUS    RESTARTS   AGE   IP       NODE     NOMINATED NODE   READINESS GATES
pod-nodeaffinity-required   0/1     Pending   0          40s   <none>   <none>   <none>           <none>

# 查看pod详情
[root@master ~]# kubectl describe pods pod-nodeaffinity-required -n dev
Name:         pod-nodeaffinity-required
Namespace:    dev
Priority:     0
Node:         <none>
Labels:       <none>
Annotations:  <none>
Status:       Pending
IP:           
IPs:          <none>
Containers:
  nginx:
    Image:        47.93.22.25:5000/nginx:latest
    Port:         <none>
    Host Port:    <none>
    Environment:  <none>
    Mounts:
      /var/run/secrets/kubernetes.io/serviceaccount from default-token-t76k4 (ro)
Conditions:
  Type           Status
  PodScheduled   False 
Volumes:
  default-token-t76k4:
    Type:        Secret (a volume populated by a Secret)
    SecretName:  default-token-t76k4
    Optional:    false
QoS Class:       BestEffort
Node-Selectors:  <none>
Tolerations:     node.kubernetes.io/not-ready:NoExecute for 300s
                 node.kubernetes.io/unreachable:NoExecute for 300s
Events:
  Type     Reason            Age        From               Message
  ----     ------            ----       ----               -------
  Warning  FailedScheduling  <unknown>  default-scheduler  0/3 nodes are available: 3 node(s) didn't match node selector.
  Warning  FailedScheduling  <unknown>  default-scheduler  0/3 nodes are available: 3 node(s) didn't match node selector.
  
# 将values: ["xxx", "yyy"]修改为 values: ["pro", "yyy"]
[root@master ~]# kubectl get nodes --show-labels
NAME     STATUS   ROLES    AGE   VERSION   LABELS
master   Ready    master   9d    v1.17.4   beta.kubernetes.io/arch=arm64,beta.kubernetes.io/os=linux,kubernetes.io/arch=arm64,kubernetes.io/hostname=master,kubernetes.io/os=linux,node-role.kubernetes.io/master=
node1    Ready    <none>   9d    v1.17.4   beta.kubernetes.io/arch=arm64,beta.kubernetes.io/os=linux,kubernetes.io/arch=arm64,kubernetes.io/hostname=node1,kubernetes.io/os=linux,nodeenv=pro
node2    Ready    <none>   9d    v1.17.4   beta.kubernetes.io/arch=arm64,beta.kubernetes.io/os=linux,kubernetes.io/arch=arm64,kubernetes.io/hostname=node2,kubernetes.io/os=linux,nodeenv=test

# 会调度到node1节点上
```

演示一下preferredDuringSchedulingIgnoredDuringExecution`

创建pod-nodeaffinity-preferred.yaml

```yaml
apiVersion: v1
kind: Pod
metadata:
  name: pod-nodeaffinity-preferred
  namespace: dev
spec:
  containers:
  - name: nginx
    image: 47.93.22.25:5000/nginx:latest
  affinity:		# 亲和性设置
    nodeAffinity:		# 设置node亲和性
      preferredDuringSchedulingIgnoredDuringExecution:		# 软限制
      - weight: 1
        preference:
          matchExpressions:		# 匹配env的值在["xxx", "yyy"]中的标签(当前环境没有)
          - key: nodeenv
            operator: In
            values: ["xxx", "yyy"]
```

```powershell
# 创建pod
[root@master ~]# kubectl create -f pod-nodeaffinity-preferred.yaml
pod/pod-nodeaffinity-preferred created

# 查看pod状态(运行成功)
[root@master ~]# kubectl get pods pod-nodeaffinity-preferred -n dev -o wide
NAME                         READY   STATUS    RESTARTS   AGE   IP            NODE    NOMINATED NODE   READINESS GATES
pod-nodeaffinity-preferred   1/1     Running   0          33s   10.244.2.16   node2   <none>           <none>
```

```markdown
NodeAffinity规则设置的注意事项：
		1 如果同时定义了nodeSelector和nodeAffinity, 那么必须两个条件都得到满足，pod才能运行在指定的Node上
		2 如果nodeAffinity指定了多个nodeSelectorTerms, 那么只需要其中一个能够匹配成功即可
		3 如果一个nodeSelectorTerms中有多个matchExpressions，则一个节点必须满足所有的才能匹配成功
		4 如果一个pod所在的Node在Pod运行期间其标签发生了改变，不再符合改pod的节点亲和性需求，则系统将忽略此变化
```

**PodAffinity**

PodAffinity主要实现以运行的Pod为参照，实现让新创建的Pod跟参照pod在一个区域的功能

`PodAffinity`的可配置项：

```markdown
pod.spec.affinity.podAffinity
  requiredDuringSchedulingIgnoredDuringExecution  硬限制
    namespaces			指定参照pod的namespace
    topologyKey			指定调度作用域
    labelSelector		标签选择器
      matchExpressions  按节点标签列出的节点选择器要求列表(推荐)
        key			键
        values	值
        operator  关系符 支持In、NotIn、Exists、DoesNotExist
      matchLabels		指多个matchExpressions映射的内容
  preferredDuringSchedulingIgnoredDuringExecution  软限制
    podAffinityTerm	 选项
      namespaces
      topologyKey
      labelSelector
        matchExpressions
          key			键
          values	值
          operator
        matchLables
    weight  倾向权重，范围在1-100
```

```markdown
topologyKey用于指定调度时作用域，例如:
		如果指定为kubernetes.io/hostname，那就是以Node节点为区分范围
		如果指定为beta.kubernetes.io/os，则以Node节点的操作系统类型来区分
```

演示一下`requiredDuringSchedulingIgnoredDuringExecution`

1、创建一个参照Pod，pod-podaffinity-target.yaml

```yaml
apiVersion: v1
kind: Pod
metadata: 
  name: pod-podaffinity-target
  namespace: dev
  labels:
    podenv: pro # 设置标签
spec:
  containers:
  - name: nginx
    image: 47.93.22.25:5000/nginx:latest
  nodeName: node1 # 将目标pod明确指定到node1上
```

```powershell
# 启动目标pod
[root@master ~]# kubectl create -f pod-podaffinity-target.yaml
pod/pod-podaffinity-target created

# 查看pod状况
[root@master ~]# kubectl get pods pod-podaffinity-target -n dev -o wide
NAME                     READY   STATUS    RESTARTS   AGE   IP            NODE    NOMINATED NODE   READINESS GATES
pod-podaffinity-target   1/1     Running   0          38s   10.244.1.23   node1   <none>           <none>
```

2、创建pod-podaffinity-required.yaml

```yaml
apiVersion: v1
kind: Pod
metadata:
  name: pod-podaffinity-required
  namespace: dev
spec:
  containers:
  - name: nginx
    image: 47.93.22.25:5000/nginx:latest
  affinity:		# 亲和性设置
    podAffinity:		# 设置pod亲和性
      requiredDuringSchedulingIgnoredDuringExecution:		# 硬限制
        - labelSelector:
            matchExpressions:		# 匹配env的值在["xxx", "yyy"]中的标签
            - key: podenv
              operator: In
              values: ["xxx", "yyy"]
          topologyKey: kubernetes.io/hostname
```

上面配置表达的意思是：新Pod必须要与拥有标签nodeenv=xxx或者nodeenv=yyy的pod在同一Node上，显然现在没有这样的pod，运行测试一下

```powershell
# 创建pod
[root@master ~]# kubectl create -f pod-podaffinity-required.yaml 
pod/pod-podaffinity-required created

# 查看pod状态，发现未运行
[root@master ~]# kubectl get pods pod-podaffinity-required -n dev
NAME                       READY   STATUS    RESTARTS   AGE
pod-podaffinity-required   0/1     Pending   0          102s

# 查看详细信息
[root@master ~]# kubectl describe pods pod-podaffinity-required -n dev
Name:         pod-podaffinity-required
Namespace:    dev
Priority:     0
Node:         <none>
Labels:       <none>
Annotations:  <none>
Status:       Pending
IP:           
IPs:          <none>
Containers:
  nginx:
    Image:        47.93.22.25:5000/nginx:latest
    Port:         <none>
    Host Port:    <none>
    Environment:  <none>
    Mounts:
      /var/run/secrets/kubernetes.io/serviceaccount from default-token-t76k4 (ro)
Conditions:
  Type           Status
  PodScheduled   False 
Volumes:
  default-token-t76k4:
    Type:        Secret (a volume populated by a Secret)
    SecretName:  default-token-t76k4
    Optional:    false
QoS Class:       BestEffort
Node-Selectors:  <none>
Tolerations:     node.kubernetes.io/not-ready:NoExecute for 300s
                 node.kubernetes.io/unreachable:NoExecute for 300s
Events:
  Type     Reason            Age        From               Message
  ----     ------            ----       ----               -------
  Warning  FailedScheduling  <unknown>  default-scheduler  0/3 nodes are available: 1 node(s) had taints that the pod didn't tolerate, 2 node(s) didn't match pod affinity rules.
  Warning  FailedScheduling  <unknown>  default-scheduler  0/3 nodes are available: 1 node(s) had taints that the pod didn't tolerate, 2 node(s) didn't match pod affinity rules.
  
# 将values: ["xxx", "yyy"]修改为 values: ["pro", "yyy"]
[root@master ~]# kubectl get pods pod-podaffinity-required -n dev
NAME                       READY   STATUS    RESTARTS   AGE
pod-podaffinity-required   1/1     Running   0          9s

# 会调度到与pod-podaffinity-target相同的节点上
```

**podAntiAffinity**

podAntiAffinity主要实现以运行的pod为参照，让新创建的pod跟参照pod不在一个区域中的功能

它的配置方式和选项和podAffinity是一样的

1、继续使用上一个案例中的目标pod

```powershell
[root@master ~]# kubectl get pods -n dev -o wide --show-labels
NAME                       READY   STATUS    RESTARTS   AGE    IP            NODE   NOMINATED NODE  READINESS GATES  LABELS
pod-podaffinity-required   1/1     Running   0          122m   10.244.1.26   node1  <none>          <none>           <none>
pod-podaffinity-target     1/1     Running   0          122m   10.244.1.25   node1  <none>          <none>          podenv=pro
```

2、创建pod-podantiaffinity-required.yaml

```yaml
apiVersion: v1
kind: Pod
metadata:
  name: pod-podantiaffinity-required
  namespace: dev
spec:
  containers:
  - name: nginx
    image: 47.93.22.25:5000/nginx:latest
  affinity:		# 亲和性设置
    podAntiAffinity:		# 设置pod亲和性
      requiredDuringSchedulingIgnoredDuringExecution:		# 硬限制
      - labelSelector: 
          matchExpressions:		# 匹配env的值在["pro"]中的标签
          - key: podenv
            operator: In
            values: ["pro"]
        topologyKey: kubernetes.io/hostname
```

以上配置意思为：新Pod必须要与拥有标签nodeenv=pro的pod不在同一Node上

```powershell
# 创建pod
[root@master ~]# kubectl create -f pod-podantiaffinity-required.yaml
pod/pod-podantiaffinity-required created

# 查看pod，发现调度到了node2上
[root@master ~]# kubectl get pods -n dev -o wide
NAME                           READY   STATUS    RESTARTS   AGE     IP            NODE    NOMINATED NODE   READINESS GATES
pod-podaffinity-required       1/1     Running   0          165m    10.244.1.26   node1   <none>           <none>
pod-podaffinity-target         1/1     Running   0          166m    10.244.1.25   node1   <none>           <none>
pod-podantiaffinity-required   1/1     Running   0          30m     10.244.2.17   node2   <none>           <none>
```

----

#### 5.5.3 污点和容忍

---

**污点(Taints)**

前面的调度方式都是站在Pod的角度上，通过在Pod上添加属性，来确认Pod是否要调度到指定的Node上，其实我们也可以站在Node的角度上，通过在Node上添加**污点**属性，来决定是否允许Pod调度过来

Node被设置上污点之后就和Pod之间存在了一种相斥的关系，进而拒绝Pod调度进来，甚至可以将已经存在的Pod驱逐出去

污点的格式为：`key=value:effect`，key和value是污点的标签，effect描述污点的作用，支持如下三个选项：

* PreferNoSchedule：kubernetes将尽量避免把Pod调度到具有该污点的Node上，除非没有其他节点可调度
* NoSchedule：kubernetes将不会把Pod调度到具有该污点的Node上，但不会影响当前Node上已存在的Pod
* NoExecute：kubernetes将不会把Pod调度到具有该污点的Node上，同时也会将Node上已存在的Pod驱离

使用kubectl设置和去除污点的命令：

```powershell
# 设置污点
kubectl taint nodes node1 key=value:effect

# 去除污点
kubectl taint nodes node1 key:effect-

# 去除所有污点
kubectl taint nodes node1 key-
```

演示：

1、准备节点node1(为了效果更加明显，暂停node2节点)

2、为node1节点设置一个污点：`tag=tonky:PreferNoSchedule`然后创建pod1(pod1 正常)

3、修改node1节点的污点为：`tag=tonky:NoSchedule`然后创建pod2(pod1 正常 pod2 失败)

4、修改node1节点的污点为：`tag=tonky:NoExecute`然后创建pod3(3个pod都失败)

```powershell
# 查看node状态
[root@master ~]# kubectl get nodes
NAME     STATUS     ROLES    AGE   VERSION
master   Ready      master   9d    v1.17.4
node1    Ready      <none>   9d    v1.17.4
node2    NotReady   <none>   9d    v1.17.4

# 为node1设置污点(PreferNoSchedule)
[root@master ~]# kubectl taint nodes node1 tag=tonky:PreferNoSchedule
node/node1 tainted

# 创建pod1
[root@master ~]# kubectl run taint1 --image=47.93.22.25:5000/nginx:latest -n dev
kubectl run --generator=deployment/apps.v1 is DEPRECATED and will be removed in a future version. Use kubectl run --generator=run-pod/v1 or kubectl create instead.
deployment.apps/taint1 created

[root@master ~]# kubectl get pods -n dev -o wide
NAME                           READY   STATUS    RESTARTS   AGE     IP            NODE    NOMINATED NODE   READINESS GATES
taint1-684f76768b-w7xjd        1/1     Running   0          29s     10.244.1.27   node1   <none>           <none>

# 为node1设置污点(取消PreferNoSchedule，设置NoSchedule)
[root@master ~]# kubectl taint nodes node1 tag:PreferNoSchedule-
node/node1 untainted
[root@master ~]# kubectl taint nodes node1 tag=tonky:NoSchedule
node/node1 tainted

# 创建pod2
[root@master ~]# kubectl run taint2 --image=47.93.22.25:5000/nginx:latest -n dev
kubectl run --generator=deployment/apps.v1 is DEPRECATED and will be removed in a future version. Use kubectl run --generator=run-pod/v1 or kubectl create instead.
deployment.apps/taint2 created

[root@master ~]# kubectl get pods -n dev -o wide
NAME                          READY   STATUS        RESTARTS   AGE     IP            NODE     NOMINATED NODE   READINESS GATES
taint1-684f76768b-w7xjd       1/1     Running       0          4m49s   10.244.1.27   node1    <none>           <none>
taint2-6cd9f7bdb-5zp82        0/1     Pending       0          19s     <none>        <none>   <none>           <none>

# 为node1设置污点(取消NoSchedule，设置NoExecute)
[root@master ~]# kubectl taint nodes node1 tag:NoSchedule-
node/node1 untainted
[root@master ~]# kubectl taint nodes node1 tag=tonky:NoExecute
node/node1 tainted

# 创建pod3
[root@master ~]# kubectl run taint3 --image=47.93.22.25:5000/nginx:latest -n dev
kubectl run --generator=deployment/apps.v1 is DEPRECATED and will be removed in a future version. Use kubectl run --generator=run-pod/v1 or kubectl create instead.
deployment.apps/taint3 created

[root@master ~]# kubectl get pods -n dev -o wide
NAME                          READY   STATUS        RESTARTS   AGE     IP            NODE     NOMINATED NODE   READINESS GATES
taint1-684f76768b-h6v89       0/1     Pending       0          54s     <none>        <none>   <none>           <none>
taint2-6cd9f7bdb-fc8vn        0/1     Pending       0          54s     <none>        <none>   <none>           <none>
taint3-96cdfddb-ghd2r         0/1     Pending       0          18s     <none>        <none>   <none>           <none>
```

>Tips：使用kubeadm搭建的集群，默认就会给master节点添加一个污点标记，所以pod就不会调度到master节点上

**容忍(Toleration)**

我们可以在node上添加污点用于拒绝pod调度上来，但是如果想将一个pod调度到一个有污点的node上去，需要使用**容忍**

>污点就是拒绝，容忍就是忽略，Node通过污点拒绝pod调度上去，Pod通过容忍忽略拒绝

1、已经在node1节点上打上了`NoExecute`的污点，此时pod是调度不上去的

2、通过给pod添加容忍，将其调度上去

创建pod-toleration.yaml

```yaml
apiVersion: v1
kind: Pod
metadata: 
  name: pod-toleration
  namespace: dev
spec:
  containers:
  - name: nginx
    image: 47.93.22.25:5000/nginx:latest
  tolerations:				# 添加容忍
  - key: "tag"				# 要容忍的污点的key
    operator: "Equal" # 操作符
    value: "tonky"    # 容忍的污点的value
    effect: "NoExecute"  # 添加容忍的规则，这里必须和标记的污点规则相同
```

```powershell
# 添加容忍之后的pod
[root@master ~]# kubectl get pods -n dev -o wide
NAME                          READY   STATUS        RESTARTS   AGE     IP            NODE     NOMINATED NODE   READINESS GATES
pod-toleration                1/1     Running       0          5s      10.244.1.34   node1    <none>           <none>
```

详细配置：

```powershell
[root@master ~]# kubectl explain pod.spec.tolerations
KIND:     Pod
VERSION:  v1

RESOURCE: tolerations <[]Object>

DESCRIPTION:
     If specified, the pod's tolerations.

     The pod this Toleration is attached to tolerates any taint that matches the
     triple <key,value,effect> using the matching operator <operator>.

FIELDS:
   key  <string>									# 对应着要容忍的污点的键，空意味着匹配所有的键
   value        <string>					# 对应着要容忍的污点的值
   operator     <string>					# key-value的运算符，支持Equal和Exists(默认)
   effect       <string>					# 对应污点的effect，空意味着匹配所有影响
   tolerationSeconds    <integer> # 容忍时间，当effect为NoExecute时生效，表示pod在Node上的停留时间
```

----

## 第六章 Pod控制器详解

----

### 6.1 Pod控制器介绍

----

在kubernetes中，按照pod的创建方式可以将其分为两类：

* 自主式pod：kubernetes直接创建出来的pod，这种pod删除后就没有了，也不会重建
* 控制器创建的pod：通过控制器创建的pod，这种pod删除了之后还会自动重建

>Pod控制器
>
>Pod控制器是管理pod的中间层，使用了pod控制器之后，我们只需要告诉pod控制器，想要多少个什么样的pod就可以了，它就会创建出满足条件的pod，并确保每个pod处于用户期望的状态，如果pod在运行中出现故障，控制器会基于指定策略重新启动或者重建pod

在kubernetes中，有很多类型的pod控制器，每种都有适合场景，常见的有以下这些：

* ReplicationController：比较原始的pod控制器，已经被废弃，由ReplicaSet替代
* ReplicaSet：保证指定数量的pod运行，并支持pod数量变更，镜像版本变更
* **Deployment**：通过控制ReplicaSet来控制pod，并支持滚动升级、版本回退
* Horizontal Pod Autoscaler：可以根据集群负载自动调整Pod的数量，实现削峰填谷
* DaemonSet：在集群中指定Node上都运行一个副本，一般用于守护进程类的任务
* Job：它创建的pod只要完成任务就立即退出，用于执行一次性任务
* Cronjob：它创建的pod会周期性的执行，用于执行周期性任务
* StatefulSet：管理有状态应用

---

### 6.2 ReplicaSet(RS)

----

ReplicaSet的主要作用是**保证一定数量的pod能够在集群中正常运行**，它会持续监听这些pod的运行状态，一旦pod发生故障，就会重启或重建。同时它还支持对pod数量的扩缩容和版本镜像的升级。

ReplicaSet的资源清单文件：

```yaml
apiVersion: apps/v1		# 版本号
kind: ReplicaSet		  # 类型
metadata: 						# 元数据
  name:								# rs名称
  namespace:					# 所属命名空间
  labels:							# 标签
    controller: rs
spec:									# 详情描述
  replicas: 3					# 副本数量
  selector:						# 选择器，通过它指定该控制器管理哪些pod
    matchLabels:			# Labels匹配规则
      app: nginx-pod
    matchExpressions: # Expressions匹配规则
      - {key: app, operator: In, values: [nginx-pod]}
  template:						# 模版，当副本数量不足时，会根据下面的模版创建pod副本
    metadata:
      labels:
        app: nginx-pod
    spec:
      containers:
      - nginx: nginx
        image: 47.93.22.25:5000/nginx:latest
        port:
        - containerPort: 80
```

* replicas：指定副本数量，其实就是当前rs创建出来的pod的数量，默认为1
* selector：选择器，它的作用是建立pod控制器和pod之间的关联关系，采用的Label Selector机制，在pod模版上定义label，在控制器上定义选择器，就可以表明当前控制器能管理哪些pod了
* template：模版，就是当前控制器创建pod所使用的模版，其实就是前面学过的pod的定义

**创建ReplicaSet**

创建pc-replicaset.yaml文件

```yaml
apiVersion: apps/v1
kind: ReplicaSet
metadata:
  name: pc-replicaset
  namespace: dev
spec:
  replicas: 3
  selector:
    matchLabels:
      app: nginx-pod
  template:
    metadata:
      labels:
        app: nginx-pod
    spec:
      containers:
      - name: nginx
        image: 47.93.22.25:5000/nginx:latest
```

```powershell
# 创建rs
[root@master ~]# kubectl create -f pc-replicaset.yaml
replicaset.apps/pc-replicaset created

# 查看rs
# DESIRED: 期望副本数量
# CURRENT: 当前副本数量
# READY: 已经准备好提供服务的副本数量
[root@master ~]# kubectl get rs pc-replicaset -n dev -o wide
NAME            DESIRED   CURRENT   READY   AGE   CONTAINERS   IMAGES                          SELECTOR
pc-replicaset   3         3         3       57s   nginx        47.93.22.25:5000/nginx:latest   app=nginx-pod

# 查看当前控制器创建出来的pod
[root@master ~]# kubectl get pod -n dev
NAME                      READY   STATUS    RESTARTS   AGE
pc-replicaset-f879d       1/1     Running   0          3m24s
pc-replicaset-jg55c       1/1     Running   0          3m24s
pc-replicaset-jxwn5       1/1     Running   0          3m24s
```

**扩缩容**

```powershell
# 编辑rs的副本数量，修改spec:replicas: 6即可
[root@master ~]# kubectl edit rs pc-replicaset -n dev
replicaset.apps/pc-replicaset edited

# 查看rs
[root@master ~]# kubectl get rs pc-replicaset -n dev -o wide
NAME            DESIRED   CURRENT   READY   AGE     CONTAINERS   IMAGES                          SELECTOR
pc-replicaset   6         6         6       8m32s   nginx        47.93.22.25:5000/nginx:latest   app=nginx-pod

# 查看pod
[root@master ~]# kubectl get pods -n dev
NAME                      READY   STATUS    RESTARTS   AGE
pc-replicaset-cbbms       1/1     Running   0          38s
pc-replicaset-f879d       1/1     Running   0          8m50s
pc-replicaset-jg55c       1/1     Running   0          8m50s
pc-replicaset-jxwn5       1/1     Running   0          8m50s
pc-replicaset-lhzbw       1/1     Running   0          38s
pc-replicaset-w7dks       1/1     Running   0          38s

# 可以直接使用命令实现
# 使用scale命令实现扩容，后面--replicas=n直接指定目标数量即可
[root@master ~]# kubectl scale rs pc-replicaset --replicas=2 -n dev
replicaset.apps/pc-replicaset scaled

# 可能执行慢了，没有看到Terminating，直接剩下2个了
[root@master ~]# kubectl get pods -n dev
NAME                      READY   STATUS    RESTARTS   AGE
pc-replicaset-jg55c       1/1     Running   0          11m
pc-replicaset-jxwn5       1/1     Running   0          11m
```

**镜像升级** 这里用的是latest 就不实际执行了

```powershell
# 编辑rs的容器镜像 -image: nignx:目标版本
[root@master ~]# kubectl edit rs pc-replicaset -n dev

# 再次查看，镜像版本已经改变

# 也可以使用命令完成
# kubectl set image rs rs名称 容器=镜像版本 -n namespace
[root@master ~]# kubectl set image rs pc-replicaset nginx=nginx:目标版本 -n dev

# 再次查看，镜像版本已经改变
```

**删除ReplicaSet**

```powershell
# 使用kubectl delete命令会删除此RS以及它管理的Pod
# 在kubernetes删除RS前，会将RS的replicasclear调整为0，等待所有的pod被删除后，再执行RS对象的删除
[root@master ~]# kubectl delete rs pc-replicaset -n dev
replicaset.apps "pc-replicaset" deleted

# 如果希望仅仅删除RS对象(保留Pod)，可以使用kubectl delete命令时添加--cascade=false选项(不推荐)
[root@master ~]# kubectl delete rs pc-replicaset -n dev --cascade=false
replicaset.apps "pc-replicaset" deleted

# 也可以使用yaml直接删除(推荐)
[root@master ~]# kubectl delete -f pc-replicaset.yaml
replicaset.apps "pc-replicaset" deleted
```

---

### 6.3 Deployment(Deploy)

---

为了更好的解决服务编排的问题，kubernetes在v1.2版本开始，引入了Deployment控制器，这种控制器并不直接管理pod，而是通过管理ReplicaSet来间接管理Pod，即Deployment管理ReplicaSet，ReplicaSet管理Pod。所以Deployment比ReplicaSet功能更加强大

Deployment的主要功能有下面几个：

* 支持ReplicaSet的所有功能
* 支持发布的停止、继续
* 支持版本滚动更新和版本回退

Deployment的资源清单文件：

```yaml
apiVersion: apps/v1		# 版本号
kind: Deployment			# 类型
metadata:							# 元数据
  name:								# rs名称
  namespace:					# 所属命名空间
  labels:							# 标签
    controller: deploy
spec:									# 详情描述
  replicas: 3					# 副本数量
  revisionHistoryLimit: 3		# 保留历史版本，默认是10
  paused: false  			# 暂停部署，默认是false
  progressDeadlineSeconds: 600	# 部署超时时间(s)，默认是600
  strategy: 					# 策略
    type: RollingUpdate				  # 滚动更新策略
    rollingUpdate:		# 滚动更新
      maxSurge: 30%   # 最大额外可以存在的副本数，可以为百分比，也可以为整数
      maxUnavailable: 30%				# 最大不可以状态的pod的最大值，可以为百分比，也可以为整数
  selector:						# 选择器，通过它指定该控制器管理哪些pod
    matchLabels:			# Labels匹配规则
      app: nginx-pod
    matchExpressions: # Expression匹配规则
      - {key: app, operator: In, values: [nginx-pod]}
  template:						# 模版，当副本数量不足时，会根据下面的模版创建pod副本
    metadata:
      labels:
        app: nginx-pod
    spec:
      containers:
      - name: nginx
        image: 47.93.22.25:5000/nginx:latest
        ports:
        - containerPort: 80
```

**创建Deployment**

创建pc-deployment.yaml

```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: pc-deployment
  namespace: dev
spec:
  replicas: 3
  selector:
    matchLabels:
      app: nginx-pod
  template:
    metadata:
      labels:
        app: nginx-pod
    spec:
      containers:
      - name: nginx
        image: 47.93.22.25:5000/nginx:latest
```

```powershell
# 创建deployment
# --record=true 记录每次的版本变化
[root@master ~]# kubectl create -f pc-deployment.yaml --record=true
deployment.apps/pc-deployment created

# 查看deployment
# UP-TO-DATE: 最新版本的pod数量
# AVAILABLE: 当前可用的pod数量
[root@master ~]# kubectl get deploy -n dev -o wide
NAME            READY   UP-TO-DATE   AVAILABLE   AGE   CONTAINERS   IMAGES                          SELECTOR
pc-deployment   3/3     3            3           37s   nginx        47.93.22.25:5000/nginx:latest   app=nginx-pod

# 查看rs
# 发现rs的名称是在原来deployment的名字后面添加了一个10位数的随机串
[root@master ~]# kubectl get rs -n dev
NAME                       DESIRED   CURRENT   READY   AGE
pc-deployment-7d6b4557f4   3         3         3       5m45s

# 查看pod
[root@master ~]# kubectl get pods -n dev
NAME                             READY   STATUS    RESTARTS   AGE
pc-deployment-7d6b4557f4-g88qz   1/1     Running   0          6m9s
pc-deployment-7d6b4557f4-jwrzd   1/1     Running   0          6m9s
pc-deployment-7d6b4557f4-nb2jh   1/1     Running   0          6m9s
```

**扩缩容**

```powershell
# 变更副本数量为5个
[root@master ~]# kubectl scale deploy pc-deployment --replicas=5 -n dev
deployment.apps/pc-deployment scaled

# 查看deployment
[root@master ~]# kubectl get deploy pc-deployment -n dev
NAME            READY   UP-TO-DATE   AVAILABLE   AGE
pc-deployment   5/5     5            5           51m

# 查看pod
[root@master ~]# kubectl get pods -n dev
NAME                             READY   STATUS    RESTARTS   AGE
pc-deployment-7d6b4557f4-8x2sv   1/1     Running   0          51s
pc-deployment-7d6b4557f4-g88qz   1/1     Running   0          52m
pc-deployment-7d6b4557f4-jwrzd   1/1     Running   0          52m
pc-deployment-7d6b4557f4-khp9g   1/1     Running   0          51s
pc-deployment-7d6b4557f4-nb2jh   1/1     Running   0          52m

# 编辑deployment的副本数量，修改spec:replicas:4即可
[root@master ~]# kubectl edit deploy pc-deployment -n dev
deployment.apps/pc-deployment edited

# 查看pod
[root@master ~]# kubectl get pods -n dev
NAME                             READY   STATUS    RESTARTS   AGE
pc-deployment-7d6b4557f4-g88qz   1/1     Running   0          53m
pc-deployment-7d6b4557f4-jwrzd   1/1     Running   0          53m
pc-deployment-7d6b4557f4-khp9g   1/1     Running   0          2m12s
pc-deployment-7d6b4557f4-nb2jh   1/1     Running   0          53m
```

**镜像更新**

Deployment支持两种镜像更新的策略：**重建更新**和**滚动更新(默认)**，可以通过**strategy**选项进行配置

```markdown
strategy: 指定新的Pod替换旧的Pod策略，支持两个属性
  type: 指定策略类型, 支持两种策略
		Recreate: 在创建出新的pod之前会先杀掉所有已存在的pod
		RollingUpdate: 滚动更新, 就是杀死一部分, 就启动一部分, 在更新过程中, 存在两个版本Pod
  rollingUpdate: 当type为RollingUpdate时生效, 用于为RollingUpdate设置参数, 支持两个属性
    maxUnavailable: 用来指定在升级过程中不可用Pod的最大数量, 默认为25%
    maxSurge: 用来指定在升级过程中可以超过期望的pod的最大数量, 默认为25%
```

重建更新

1、编辑pc-deployment.yaml，在spec节点下添加更新策略

```yaml
spec:
  strategy:  # 策略
    type: Recreate  # 重建更新策略
```

2、创建deploy进行验证

```powershell
# 变更镜像
[root@master ~]# kubectl set image deployment pc-deployment nginx=47.93.22.25:5000/nginx:1.17.2 -n dev
deployment.apps/pc-deployment image updated

# 观察升级过程
[root@master ~]# kubectl get pods -n dev -w
NAME                             READY   STATUS              RESTARTS   AGE
pc-deployment-64d4997486-nhrmk   0/1     ContainerCreating   0          1s
pc-deployment-64d4997486-t8rdg   0/1     ContainerCreating   0          1s
pc-deployment-7d6b4557f4-2cn9g   1/1     Running             0          4m36s
pc-deployment-7d6b4557f4-4tzt8   1/1     Running             0          4m36s
pc-deployment-7d6b4557f4-ddwcl   0/1     Terminating         0          4m34s
pc-deployment-7d6b4557f4-n4mbz   1/1     Running             0          4m35s
pc-deployment-64d4997486-nhrmk   1/1     Running             0          2s
pc-deployment-64d4997486-t8rdg   1/1     Running             0          2s
pc-deployment-7d6b4557f4-n4mbz   1/1     Terminating         0          4m36s
pc-deployment-64d4997486-jc9dw   0/1     Pending             0          0s
pc-deployment-64d4997486-jc9dw   0/1     Pending             0          0s
pc-deployment-64d4997486-jc9dw   0/1     ContainerCreating   0          0s
pc-deployment-7d6b4557f4-4tzt8   1/1     Terminating         0          4m37s
pc-deployment-64d4997486-mnqgq   0/1     Pending             0          0s
pc-deployment-64d4997486-mnqgq   0/1     Pending             0          0s
pc-deployment-64d4997486-mnqgq   0/1     ContainerCreating   0          1s
pc-deployment-7d6b4557f4-n4mbz   0/1     Terminating         0          4m37s
pc-deployment-7d6b4557f4-4tzt8   0/1     Terminating         0          4m38s
pc-deployment-64d4997486-mnqgq   1/1     Running             0          2s
pc-deployment-7d6b4557f4-2cn9g   1/1     Terminating         0          4m39s
pc-deployment-64d4997486-jc9dw   1/1     Running             0          3s
pc-deployment-7d6b4557f4-4tzt8   0/1     Terminating         0          4m41s
pc-deployment-7d6b4557f4-4tzt8   0/1     Terminating         0          4m41s
pc-deployment-7d6b4557f4-2cn9g   0/1     Terminating         0          4m41s
pc-deployment-7d6b4557f4-2cn9g   0/1     Terminating         0          4m42s
pc-deployment-7d6b4557f4-2cn9g   0/1     Terminating         0          4m42s
pc-deployment-7d6b4557f4-n4mbz   0/1     Terminating         0          4m42s
pc-deployment-7d6b4557f4-n4mbz   0/1     Terminating         0          4m42s
pc-deployment-7d6b4557f4-ddwcl   0/1     Terminating         0          4m41s
pc-deployment-7d6b4557f4-ddwcl   0/1     Terminating         0          4m41s

[root@master ~]# kubectl get pods -n dev -w
NAME                             READY   STATUS    RESTARTS   AGE
pc-deployment-64d4997486-jc9dw   1/1     Running   0          21s
pc-deployment-64d4997486-mnqgq   1/1     Running   0          21s
pc-deployment-64d4997486-nhrmk   1/1     Running   0          23s
pc-deployment-64d4997486-t8rdg   1/1     Running   0          23s
```

滚动更新

1、编辑pc-deployment.yaml，在spec节点下添加更新策略

```yaml
spec:
  strategy:  # 策略
    type: RollingUpdate  # 滚动更新策略
    rollingUpdate:
      maxSurge: 25%
      maxUnavailable: 25%
```

2、创建deploy进行验证

```powershell
# 变更镜像
[root@master ~]# kubectl set image deployment pc-deployment nginx=47.93.22.25:5000/nginx:latest -n dev
deployment.apps/pc-deployment image updated

# 观察升级过程
[root@master ~]# kubectl get pods -n dev -w
NAME                             READY   STATUS              RESTARTS   AGE
pc-deployment-64d4997486-jc9dw   0/1     Terminating         0          4m52s
pc-deployment-64d4997486-mnqgq   1/1     Running             0          4m52s
pc-deployment-64d4997486-nhrmk   1/1     Running             0          4m54s
pc-deployment-64d4997486-t8rdg   1/1     Running             0          4m54s
pc-deployment-7d6b4557f4-2br7t   0/1     ContainerCreating   0          2s
pc-deployment-7d6b4557f4-mspsj   0/1     ContainerCreating   0          2s
pc-deployment-7d6b4557f4-2br7t   1/1     Running             0          3s
pc-deployment-64d4997486-mnqgq   1/1     Terminating         0          4m53s
pc-deployment-7d6b4557f4-mspsj   1/1     Running             0          3s
pc-deployment-7d6b4557f4-wxljx   0/1     Pending             0          0s
pc-deployment-7d6b4557f4-wxljx   0/1     Pending             0          0s
pc-deployment-7d6b4557f4-wxljx   0/1     ContainerCreating   0          0s
pc-deployment-64d4997486-nhrmk   1/1     Terminating         0          4m55s
pc-deployment-7d6b4557f4-66l6n   0/1     Pending             0          0s
pc-deployment-7d6b4557f4-66l6n   0/1     Pending             0          0s
pc-deployment-7d6b4557f4-66l6n   0/1     ContainerCreating   0          0s
pc-deployment-7d6b4557f4-66l6n   1/1     Running             0          1s
pc-deployment-64d4997486-t8rdg   1/1     Terminating         0          4m56s
pc-deployment-64d4997486-mnqgq   0/1     Terminating         0          4m54s
pc-deployment-64d4997486-nhrmk   0/1     Terminating         0          4m57s
pc-deployment-64d4997486-t8rdg   0/1     Terminating         0          4m58s
pc-deployment-7d6b4557f4-wxljx   1/1     Running             0          3s
pc-deployment-64d4997486-mnqgq   0/1     Terminating         0          4m57s
pc-deployment-64d4997486-mnqgq   0/1     Terminating         0          4m57s
pc-deployment-64d4997486-nhrmk   0/1     Terminating         0          4m59s
pc-deployment-64d4997486-nhrmk   0/1     Terminating         0          4m59s
pc-deployment-64d4997486-t8rdg   0/1     Terminating         0          5m
pc-deployment-64d4997486-t8rdg   0/1     Terminating         0          5m
pc-deployment-64d4997486-jc9dw   0/1     Terminating         0          4m59s
pc-deployment-64d4997486-jc9dw   0/1     Terminating         0          4m59s

[root@master ~]# kubectl get pods -n dev -w
NAME                             READY   STATUS    RESTARTS   AGE
pc-deployment-7d6b4557f4-2br7t   1/1     Running   0          16s
pc-deployment-7d6b4557f4-66l6n   1/1     Running   0          13s
pc-deployment-7d6b4557f4-mspsj   1/1     Running   0          16s
pc-deployment-7d6b4557f4-wxljx   1/1     Running   0          13s
```

镜像更新中rs的变化：

```powershell
# 查看rs，发现原来的rs依旧存在，只是pod数量变为了0，而后又产生了一个rs，pod数量为3
# 其实这就是deployment能够进行版本回退的原因
[root@master ~]# kubectl get rs -n dev
NAME                       DESIRED   CURRENT   READY   AGE
pc-deployment-55d7586cd8   0         0         0       101m
pc-deployment-64d4997486   0         0         0       100m
pc-deployment-7d6b4557f4   4         4         4       178m
```

**版本回退**

deployment支持版本升级过程中的暂停、继续功能以及版本回退等诸多功能：

kubectl rollout：版本升级相关功能，支持下面的选项

* status：显示当前升级状态
* history：显示升级历史记录
* pause：暂停版本升级过程
* resume：继续已经暂停的版本升级过程
* undo：回滚到上一级版本(可以使用--to-revision回滚到指定版本)

```powershell
# 查看当前升级版本的状态
[root@master ~]# kubectl rollout status deploy pc-deployment -n dev
deployment "pc-deployment" successfully rolled out

# 查看历史版本
[root@master ~]# kubectl rollout history deploy pc-deployment -n dev
deployment.apps/pc-deployment 
REVISION  CHANGE-CAUSE
2         kubectl create --filename=pc-deployment.yaml --record=true
5         kubectl create --filename=pc-deployment.yaml --record=true
6         kubectl create --filename=pc-deployment.yaml --record=true

# 可以发现只有5和6版本有效，2版本是因为直接从中央仓库拉取nginx失败创建的，没有连续版本 可能因为之前没有使用--record=true或被后面版本覆盖
[root@master ~]# kubectl rollout history deploy pc-deployment -n dev --revision=2
deployment.apps/pc-deployment with revision #2
Pod Template:
  Labels:       app=nginx-pod
        pod-template-hash=55d7586cd8
  Annotations:  kubernetes.io/change-cause: kubectl create --filename=pc-deployment.yaml --record=true
  Containers:
   nginx:
    Image:      nginx:1.17.2
    Port:       <none>
    Host Port:  <none>
    Environment:        <none>
    Mounts:     <none>
  Volumes:      <none>

[root@master ~]# kubectl rollout history deploy pc-deployment -n dev --revision=5
deployment.apps/pc-deployment with revision #5
Pod Template:
  Labels:       app=nginx-pod
        pod-template-hash=64d4997486
  Annotations:  kubernetes.io/change-cause: kubectl create --filename=pc-deployment.yaml --record=true
  Containers:
   nginx:
    Image:      47.93.22.25:5000/nginx:1.17.2
    Port:       <none>
    Host Port:  <none>
    Environment:        <none>
    Mounts:     <none>
  Volumes:      <none>

[root@master ~]# kubectl rollout history deploy pc-deployment -n dev --revision=6
deployment.apps/pc-deployment with revision #6
Pod Template:
  Labels:       app=nginx-pod
        pod-template-hash=7d6b4557f4
  Annotations:  kubernetes.io/change-cause: kubectl create --filename=pc-deployment.yaml --record=true
  Containers:
   nginx:
    Image:      47.93.22.25:5000/nginx:latest
    Port:       <none>
    Host Port:  <none>
    Environment:        <none>
    Mounts:     <none>
  Volumes:      <none>

# 版本回退
# 这里直接使用--to-revision=5回滚到了5版本，如果省略这个选项，默认回退到上一个版本
[root@master ~]# kubectl rollout undo deployment pc-deployment --to-revision=5 -n dev
deployment.apps/pc-deployment rolled back

# 查看发现，通过nginx镜像版本可以发现回到了第5版
[root@master ~]# kubectl get deployment -n dev -o wide
NAME            READY   UP-TO-DATE   AVAILABLE   AGE     CONTAINERS   IMAGES                          SELECTOR
pc-deployment   4/4     4            4           3h17m   nginx        47.93.22.25:5000/nginx:1.17.2   app=nginx-pod

# 查看rs，发现第二个rs中有4个pod运行，其他两个版本rs中pod未运行
# 其实deployment之所以可以实现版本的回滚，就是通过记录下历史rs来实现的
# 一旦想回滚到哪个版本，只需要将当前版本pod数量降为0，然后将回滚版本的pod数量提升为目标数量就可以了
[root@master ~]# kubectl get rs -n dev
NAME                       DESIRED   CURRENT   READY   AGE
pc-deployment-55d7586cd8   0         0         0       121m
pc-deployment-64d4997486   4         4         4       120m
pc-deployment-7d6b4557f4   0         0         0       3h18m
```

**金丝雀发布**

​		Deployment支持更新过程中的控制，如"暂停(pause)"或"继续(resume)"更新操作

​        比如有一批新的Pod资源创建完成后立即暂停更新过程，此时，仅存在一部分新版本的应用，主体部分还是旧的版本，然后，再筛选一小部分的用户请求路由到新版本的Pod应用，继续观察能否稳定的按期望的方式运行，确定没问题之后再继续完成余下Pod资源的滚动更新，否则立即回滚更新操作。这就是所谓的金丝雀发布

```powershell
# 更新deployment的版本，并配置暂停deployment
[root@master ~]# kubectl set image deploy pc-deployment nginx=47.93.22.25:5000/nginx:latest -n dev && kubectl rollout pause deployment pc-deployment -n dev
deployment.apps/pc-deployment image updated
deployment.apps/pc-deployment paused

# 观察更新状态 
[root@master ~]# kubectl rollout status deploy pc-deployment -n dev
Waiting for deployment "pc-deployment" rollout to finish: 2 out of 4 new replicas have been updated...

# 监控更新过程可以看到已经新增了2个资源，但是并未按照预期去删除2个旧的资源，而是删除1个旧资源，就是因为使用了pause暂停命令
# 新建最多 1 个 Pod（25% 的 4 = 1）
# 删除最多 1 个旧 Pod（25% 的 4 = 1）
[root@master ~]# kubectl get rs -n dev -o wide
NAME                       DESIRED   CURRENT   READY   AGE     CONTAINERS   IMAGES                          SELECTOR
pc-deployment-64d4997486   3         3         3       138m    nginx        47.93.22.25:5000/nginx:1.17.2   app=nginx-pod,pod-template-hash=64d4997486
pc-deployment-7d6b4557f4   2         2         2       3h36m   nginx        47.93.22.25:5000/nginx:latest   app=nginx-pod,pod-template-hash=7d6b4557f4

# 但是此时新增了2个，删除了1个，可能的原因：
# 1.Pod 状态检查延迟
# Kubernetes 需要确保新建 Pod 达到 “Ready” 状态后再删除旧 Pod。如果新 Pod 启动较快，可能出现短暂的 5 个 Pod 状态（新增 2 个后删除 1 个）。
#	2.负载均衡调整
# 为减少服务中断，Kubernetes 可能会先引入更多新版本 Pod（如新增 2 个），再逐步删除旧版本 Pod。
#	3.maxUnavailable 和 maxSurge 配合
# 如果 maxSurge 和 maxUnavailable 配置比例较接近（如 25% 和 25%），在实际操作中，可能因负载压力导致短时间内新增 Pod 超出预期。
[root@master ~]# kubectl get pods -n dev
NAME                             READY   STATUS    RESTARTS   AGE
pc-deployment-64d4997486-8cp7w   1/1     Running   0          22m
pc-deployment-64d4997486-sqlnr   1/1     Running   0          22m
pc-deployment-64d4997486-xct2l   1/1     Running   0          22m
pc-deployment-7d6b4557f4-4sjlb   1/1     Running   0          4m10s
pc-deployment-7d6b4557f4-x6cvm   1/1     Running   0          4m10s

# 继续更新
[root@master ~]# kubectl rollout resume deploy pc-deployment -n dev
deployment.apps/pc-deployment resumed
[root@master ~]# kubectl get rs -n dev -o wide
NAME                       DESIRED   CURRENT   READY   AGE     CONTAINERS   IMAGES                          SELECTOR
pc-deployment-64d4997486   0         0         0       143m    nginx        47.93.22.25:5000/nginx:1.17.2   app=nginx-pod,pod-template-hash=64d4997486
pc-deployment-7d6b4557f4   4         4         4       3h41m   nginx        47.93.22.25:5000/nginx:latest   app=nginx-pod,pod-template-hash=7d6b4557f4
[root@master ~]# kubectl get pods -n dev
NAME                             READY   STATUS    RESTARTS   AGE
pc-deployment-7d6b4557f4-4sjlb   1/1     Running   0          6m39s
pc-deployment-7d6b4557f4-cw746   1/1     Running   0          11s
pc-deployment-7d6b4557f4-wjfbf   1/1     Running   0          11s
pc-deployment-7d6b4557f4-x6cvm   1/1     Running   0          6m39s
```

**删除Deployment**

```powershell
# 删除deployment，其下的rs和pod也将被删除
[root@master ~]# kubectl delete -f pc-deployment.yaml
deployment.apps "pc-deployment" deleted
```

---

### 6.4 Horizontal Pod Autoscaler(HPA)

---

可以通过手动执行`kubectl scale`命令实现Pod扩容，但是，kubernetes期望可以通过检测Pod的使用情况，实现pod数量的自动调整，于是就产生了HPA这种控制器

HPA可以获取每个pod利用率，然后和HPA中定义的指标进行对比，同时计算出需要伸缩的具体值，最后实现pod的数量调整，其实HPA与之前的Deployment一样，也属于一种kubernetes资源对象，它通过追踪分析目标pod的负载变化情况，来确定是否需要针对性地调整目标pod的副本数

**1、安装metrics-server**

metrics-server可以用来收集集群中的资源使用情况

```powershell
# 安装git
[root@master ~]# yum install git -y

# 获取metrics-server，注意使用的版本
git clone -b v0.3.6 https://github.com/kubernetes-incubator/metrics-server

# 修改/root/metrics-server-0.3.6/deploy/1.8+/metrics-server-deployment.yaml

# hostNetwork: true
# image: 47.93.22.25:5000/metrics-server-arm64:v0.3.6
# args:
# - --kubelet-insecure-tls
# - --kubelet-preferred-address-types=InternalIP,Hostname,InternalDNS,ExternalDNS,ExternalIP
```

<img src="https://tonkyshan.cn/img/20250106160253.png" alt="20250106160253" />

```powershell
# 安装metrics-server, 注意镜像架构(mac用的arm，window等可用amd)
[root@master 1.8+]# kubectl apply -f ./

# 查看pod运行情况
[root@master 1.8+]# kubectl get pod -n kube-system
NAME                              READY   STATUS    RESTARTS   AGE
metrics-server-557d99bdbb-4rklj   1/1     Running   0          36s

# 使用kubectl top node 查看资源使用情况
[root@master 1.8+]# kubectl top node
NAME     CPU(cores)   CPU%   MEMORY(bytes)   MEMORY%   
master   117m         5%     964Mi           70%       
node1    33m          1%     462Mi           34%       
node2    61m          3%     525Mi           38%

[root@master 1.8+]# kubectl top pod -n kube-system
NAME                              CPU(cores)   MEMORY(bytes)   
coredns-6955765f44-gfdpx          4m           13Mi            
coredns-6955765f44-jn9hk          3m           17Mi            
etcd-master                       12m          52Mi            
kube-apiserver-master             27m          341Mi           
kube-controller-manager-master    12m          59Mi            
kube-flannel-ds-arm64-gkt5j       3m           13Mi            
kube-flannel-ds-arm64-hj4mj       3m           14Mi            
kube-proxy-lg5gz                  1m           18Mi            
kube-proxy-ltc46                  1m           19Mi            
kube-proxy-zgb7s                  1m           18Mi            
kube-scheduler-master             4m           27Mi            
metrics-server-557d99bdbb-4rklj   1m           13Mi
```

**2、准备deployment和service**

```powershell
# 创建deployment
[root@master 1.8+]# kubectl run nginx --image=47.93.22.25:5000/nginx:latest --requests=cpu=100m -n dev
kubectl run --generator=deployment/apps.v1 is DEPRECATED and will be removed in a future version. Use kubectl run --generator=run-pod/v1 or kubectl create instead.
deployment.apps/nginx created

# 创建service
[root@master 1.8+]# kubectl expose deployment nginx --type=NodePort --port=80 -n dev
service/nginx exposed

# 查看
[root@master 1.8+]# kubectl get deployment,pod,svc -n dev
NAME                            READY   UP-TO-DATE   AVAILABLE   AGE
deployment.apps/nginx           1/1     1            1           22s

NAME                                 READY   STATUS    RESTARTS   AGE
pod/nginx-64f7fb684c-mcxkk           1/1     Running   0          22s

NAME            TYPE       CLUSTER-IP       EXTERNAL-IP   PORT(S)        AGE
service/nginx   NodePort   10.105.153.172   <none>        80:31552/TCP   3m56s
```

**3、部署HPA**

创建pc-hpa.yaml

```yaml
apiVersion: autoscaling/v1
kind: HorizontalPodAutoscaler
metadata:
  name: pc-hpa
  namespace: dev
spec:
  minReplicas: 1		# 最小pod数量
  maxReplicas: 10		# 最大pod数量
  targetCPUUtilizationPercentage: 3		# CPU使用率指标
  scaleTargetRef:		# 指定要控制的nginx信息
    apiVersion: apps/v1
    kind: Deployment
    name: nginx
```

```powershell
# 创建hpa
[root@master 1.8+]# kubectl create -f pc-hpa.yaml
horizontalpodautoscaler.autoscaling/pc-hpa created

# 查看hpa
[root@master 1.8+]# kubectl get hpa -n dev
NAME     REFERENCE          TARGETS   MINPODS   MAXPODS   REPLICAS   AGE
pc-hpa   Deployment/nginx   0%/3%     1         10        1          56s

kubectl get deploy -n dev -w

kubectl get pods -n dev -w

kubectl get hpa -n dev -w
```

**4、测试**

使用压测工具对service地址172.16.140.133:31552进行测压，发10000次请求，实现自动扩缩容

<img src="https://tonkyshan.cn/img/20250107143343.png" alt="20250107143343" />

```powershell
# hpa变化
[root@master ~]# kubectl get hpa -n dev -w
NAME     REFERENCE          TARGETS   MINPODS   MAXPODS   REPLICAS   AGE
pc-hpa   Deployment/nginx   0%/3%     1         10        1          31m
pc-hpa   Deployment/nginx   24%/3%    1         10        1          32m
pc-hpa   Deployment/nginx   24%/3%    1         10        4          32m
pc-hpa   Deployment/nginx   24%/3%    1         10        8          33m
pc-hpa   Deployment/nginx   0%/3%     1         10        8          33m
pc-hpa   Deployment/nginx   0%/3%     1         10        8          38m
pc-hpa   Deployment/nginx   0%/3%     1         10        1          38m

# deploy变化
[root@master ~]# kubectl get deploy -n dev -w
NAME            READY   UP-TO-DATE   AVAILABLE   AGE
nginx           1/1     1            1           5h54m
nginx           1/4     1            1           5h55m
nginx           1/4     1            1           5h55m
nginx           1/4     1            1           5h55m
nginx           1/4     4            1           5h55m
nginx           2/4     4            2           5h55m
nginx           3/4     4            3           5h55m
nginx           4/4     4            4           5h55m
nginx           4/8     4            4           5h56m
nginx           4/8     4            4           5h56m
nginx           4/8     4            4           5h56m
nginx           4/8     8            4           5h56m
nginx           5/8     8            5           5h56m
nginx           6/8     8            6           5h56m
nginx           7/8     8            7           5h56m
nginx           8/8     8            8           5h56m
nginx           8/1     8            8           6h1m
nginx           8/1     8            8           6h1m
nginx           1/1     1            1           6h1m

# pod变化
[root@master ~]# kubectl get pods -n dev -w
NAME                             READY   STATUS    RESTARTS   AGE
nginx-64f7fb684c-mcxkk           1/1     Running   0          5h54m
nginx-64f7fb684c-4tfxs           0/1     Pending   0          0s
nginx-64f7fb684c-4tfxs           0/1     Pending   0          0s
nginx-64f7fb684c-qdlfc           0/1     Pending   0          0s
nginx-64f7fb684c-9zp4g           0/1     Pending   0          0s
nginx-64f7fb684c-qdlfc           0/1     Pending   0          0s
nginx-64f7fb684c-9zp4g           0/1     Pending   0          0s
nginx-64f7fb684c-4tfxs           0/1     ContainerCreating   0          0s
nginx-64f7fb684c-9zp4g           0/1     ContainerCreating   0          0s
nginx-64f7fb684c-qdlfc           0/1     ContainerCreating   0          0s
nginx-64f7fb684c-9zp4g           1/1     Running             0          2s
nginx-64f7fb684c-qdlfc           1/1     Running             0          2s
nginx-64f7fb684c-4tfxs           1/1     Running             0          2s
nginx-64f7fb684c-r5n29           0/1     Pending             0          0s
nginx-64f7fb684c-r5n29           0/1     Pending             0          0s
nginx-64f7fb684c-ct47q           0/1     Pending             0          0s
nginx-64f7fb684c-2rdfk           0/1     Pending             0          0s
nginx-64f7fb684c-mswhf           0/1     Pending             0          0s
nginx-64f7fb684c-2rdfk           0/1     Pending             0          0s
nginx-64f7fb684c-ct47q           0/1     Pending             0          0s
nginx-64f7fb684c-mswhf           0/1     Pending             0          0s
nginx-64f7fb684c-r5n29           0/1     ContainerCreating   0          0s
nginx-64f7fb684c-2rdfk           0/1     ContainerCreating   0          0s
nginx-64f7fb684c-ct47q           0/1     ContainerCreating   0          0s
nginx-64f7fb684c-mswhf           0/1     ContainerCreating   0          0s
nginx-64f7fb684c-r5n29           1/1     Running             0          2s
nginx-64f7fb684c-mswhf           1/1     Running             0          2s
nginx-64f7fb684c-2rdfk           1/1     Running             0          3s
nginx-64f7fb684c-ct47q           1/1     Running             0          3s
nginx-64f7fb684c-ct47q           1/1     Terminating         0          5m34s
nginx-64f7fb684c-9zp4g           1/1     Terminating         0          5m49s
nginx-64f7fb684c-qdlfc           1/1     Terminating         0          5m49s
nginx-64f7fb684c-2rdfk           1/1     Terminating         0          5m34s
nginx-64f7fb684c-4tfxs           1/1     Terminating         0          5m49s
nginx-64f7fb684c-r5n29           1/1     Terminating         0          5m34s
nginx-64f7fb684c-mswhf           1/1     Terminating         0          5m34s
nginx-64f7fb684c-2rdfk           0/1     Terminating         0          5m35s
nginx-64f7fb684c-9zp4g           0/1     Terminating         0          5m50s
nginx-64f7fb684c-ct47q           0/1     Terminating         0          5m36s
nginx-64f7fb684c-r5n29           0/1     Terminating         0          5m36s
nginx-64f7fb684c-r5n29           0/1     Terminating         0          5m36s
nginx-64f7fb684c-r5n29           0/1     Terminating         0          5m36s
nginx-64f7fb684c-mswhf           0/1     Terminating         0          5m37s
nginx-64f7fb684c-mswhf           0/1     Terminating         0          5m37s
nginx-64f7fb684c-mswhf           0/1     Terminating         0          5m37s
nginx-64f7fb684c-qdlfc           0/1     Terminating         0          5m52s
nginx-64f7fb684c-qdlfc           0/1     Terminating         0          5m53s
nginx-64f7fb684c-qdlfc           0/1     Terminating         0          5m53s
nginx-64f7fb684c-4tfxs           0/1     Terminating         0          5m53s
nginx-64f7fb684c-2rdfk           0/1     Terminating         0          5m39s
nginx-64f7fb684c-2rdfk           0/1     Terminating         0          5m39s
nginx-64f7fb684c-9zp4g           0/1     Terminating         0          5m54s
nginx-64f7fb684c-9zp4g           0/1     Terminating         0          5m54s
nginx-64f7fb684c-ct47q           0/1     Terminating         0          5m40s
nginx-64f7fb684c-ct47q           0/1     Terminating         0          5m40s
nginx-64f7fb684c-4tfxs           0/1     Terminating         0          5m56s
nginx-64f7fb684c-4tfxs           0/1     Terminating         0          5m56s
```

---

### 6.5 DaemonSet(DS)

---

DaemonSet类型的控制器可以保证集群中的每一台(或指定)节点上都运行一个副本，一般适用于日志收集、节点监控等场景。也就是说，如果一个pod提供的功能是节点级别的(每个节点都需要且只需要一个)，那么这类Pod就适合使用DaemonSet类型的控制器创建

DaemonSet控制器的特点：

* 每当向集群中添加一个节点时，指定的pod副本也将添加到该节点上
* 当节点从集群中移除时，pod也就被垃圾回收了

DaemonSet的资源清单文件

```yaml
apiVersion: apps/v1		# 版本号
kind: DaemonSet		# 类型
metadata:					# 元数据
  name:						# rs名称
  namespace:			# 所属命名空间
  labels:					# 标签
    controller: daemonset
spec:							# 详情描述
  revisionHistoryLimit: 3		# 保留历史版本
  updateStrategy:	# 更新策略
    type: RollingUpdate:    # 滚动更新策略
    rollingUpdate:					# 滚动更新
      maxUnavailable: 1     # 最大不可用状态的Pod的最大值，可以为百分比，也可以为整数
  selector:				# 选择器，通过它指定该控制器管理哪些pod
    matchLabels:	# Labels匹配规则
      app: nginx-pod
    matchExpressions:				# Expressions匹配规则
      - {key: app, operator: In, values: [nginx-pod]}
  template:				# 模版，当副本数量不足时，会根据下面的模版创建pod副本
    metadata:
      lables:
        app: nginx-pod
    spec:
      containers:
      - name: nginx
        image: 47.93.22.25:5000/nginx:latest
        ports:
        - containerPort: 80
```

创建pc-daemonset.yaml，内容如下

```yaml
apiVersion: apps/v1
kind: DaemonSet
metadata:
  name: pc-daemonset
  namespace: dev
spec:
  selector:
    matchLabels:
      app: nginx-pod
  template:
    metadata:
      labels:
        app: nginx-pod
    spec:
      containers:
      - name: nginx
        image: 47.93.22.25:5000/nginx:latest
```

```powershell
# 创建daemonset
[root@master ~]# kubectl create -f pc-daemonset.yaml
daemonset.apps/pc-daemonset created

# 查看daemonset，有污点的节点上会根据污点类型进行调度处理
[root@master ~]# kubectl get ds pc-daemonset -n dev -o wide
NAME     DESIRED  CURRENT  READY  UP-TO-DATE AVAILABLE NODE SELECTOR  AGE CONTAINERS IMAGES  SELECTOR
pc-daemonset 2      2      2      2          2        <none>   22s   nginx   47.93.22.25:5000/nginx:latest   app=nginx-pod

# 查看pod
[root@master ~]# kubectl get pod -n dev -o wide
NAME                             READY   STATUS    RESTARTS   AGE     IP            NODE    NOMINATED NODE   READINESS GATES
pc-daemonset-hdmrf               1/1     Running   0          2m3s    10.244.2.80   node2   <none>           <none>
pc-daemonset-j25bl               1/1     Running   0          2m3s    10.244.1.35   node1   <none>           <none>
```

---

### 6.6 Job

---

Job，主要用于负责**批量处理(一次要处理指定数量任务)**短暂的**一次性(每个任务仅运行一次就结束)**的任务。

Job的特点如下：

* 当Job创建的pod执行成功结束时，Job将记录成功结束的pod数量
* 当成功结束的pod达到指定的数量时，Job将完成执行

Job的资源清单文件：

```yaml
apiVersion: batch/v1		# 版本号
kind: Job								# 类型
metadata:								# 元数据
  name:									# rs名称
  namespace:						# 所属命名空间
  labels:								# 标签
    controller: job
spec:		# 详情描述
  completions: 1				# 指定job需要成功运行Pods的次数。默认值：1
  parallelism: 1				# 指定job在任一时刻应该并发运行Pods的数量。默认值：1
  activeDeadlineSeconds: 30		# 指定job可运行的时间期限，超过时间还未结束，系统将会尝试进行终止
  backoffLimit: 6				# 指定job失败后进行重试的次数。默认是6
  manualSelector: true	# 是否可以使用selector选择器选择pod，默认是false
  selector: 						# 选择器，通过它指定该控制器管理哪些pod
    matchLables:				# Labels匹配规则
      app: counter-pod
    matchExpressions:		# Expressions匹配规则
      - {key: app, operator: In, values: [counter-pod]}
  template:							# 模版，当副本数量不足时，会根据下面的模版创建pod副本
    metadata:
      labels:
        app: counter-pod
    spec:
      restartPolicy: Never  # 重启策略只能设置为Never或者OnFailure
      containers: 
      - name: counter
        image: 47.93.22.25:5000/busybox:1.30
        command: ["bin/sh", "-c", "for i in 9 8 7 6 5 4 3 2 1; do echo $i; sleep 2; done"]
```

```markdown
关于重启策略设置的说明
		如果指定为OnFailure，则job会在pod出现故障时重启容器，而不是创建pod，failed次数不变
		如果指定为Never，则job会在pod出现故障时创建新的pod，并且故障pod不会消失，也不会重启，failed次数加1
		如果指定为Always的话，就意味着一直重启，意味着job任务会重复去执行，当然不对，所以不能设置为Always
```

创建pc-job.yaml

```yaml
apiVersion: batch/v1
kind: Job
metadata:
  name: pc-job
  namespace: dev
spec:
  manualSelector: true
  selector:
    matchLabels:
      app: counter-pod
  template:
    metadata:
      labels:
        app: counter-pod
    spec:
      restartPolicy: Never
      containers:
      - name: counter
        image: 47.93.22.25:5000/busybox:1.30
        command: ["bin/sh", "-c", "for i in 9 8 7 6 5 4 3 2 1; do echo $i; sleep 2; done"]
```

```powershell
# 创建job
[root@master ~]# kubectl create -f pc-job.yaml
job.batch/pc-job created

# 查看job
[root@master ~]# kubectl get job -n dev -o wide
NAME     COMPLETIONS   DURATION   AGE   CONTAINERS   IMAGES                          SELECTOR
pc-job   0/1           16s        16s   counter      47.93.22.25:5000/busybox:1.30   app=counter-pod

# 监控job
[root@master ~]# kubectl get job -n dev -w
NAME     COMPLETIONS   DURATION   AGE
pc-job   0/1                      0s
pc-job   0/1           0s         0s
pc-job   1/1           19s        19s

# 监控pod
[root@master ~]# kubectl get pod -n dev -w
NAME                             READY   STATUS    RESTARTS   AGE
pc-job-74pmw                     0/1     Pending   0          0s
pc-job-74pmw                     0/1     Pending   0          0s
pc-job-74pmw                     0/1     ContainerCreating   0          0s
pc-job-74pmw                     1/1     Running             0          2s
pc-job-74pmw                     0/1     Completed           0          19s
```

<img src="https://tonkyshan.cn/img/20250107165222.png" alt="20250107165222" />

添加参数

```powershell
# 监控job
[root@master ~]# kubectl get job -n dev -w
NAME     COMPLETIONS   DURATION   AGE
pc-job   0/6                      0s
pc-job   0/6           0s         0s
pc-job   1/6           19s        19s
pc-job   2/6           19s        19s
pc-job   3/6           19s        19s
pc-job   4/6           38s        38s
pc-job   5/6           38s        38s
pc-job   6/6           38s        38s

# 监控pod  3个同时执行
[root@master ~]# kubectl get pod -n dev -w
NAME                             READY   STATUS    RESTARTS   AGE
pc-job-trtch                     0/1     Pending   0          0s
pc-job-trtch                     0/1     Pending   0          0s
pc-job-8kf8m                     0/1     Pending   0          0s
pc-job-jsg9m                     0/1     Pending   0          0s
pc-job-jsg9m                     0/1     Pending   0          0s
pc-job-8kf8m                     0/1     Pending   0          0s
pc-job-trtch                     0/1     ContainerCreating   0          0s
pc-job-jsg9m                     0/1     ContainerCreating   0          0s
pc-job-8kf8m                     0/1     ContainerCreating   0          0s
pc-job-trtch                     1/1     Running             0          1s
pc-job-jsg9m                     1/1     Running             0          1s
pc-job-8kf8m                     1/1     Running             0          1s
pc-job-jsg9m                     0/1     Completed           0          19s
pc-job-2v4mg                     0/1     Pending             0          0s
pc-job-2v4mg                     0/1     Pending             0          0s
pc-job-trtch                     0/1     Completed           0          19s
pc-job-fxrqq                     0/1     Pending             0          0s
pc-job-fxrqq                     0/1     Pending             0          0s
pc-job-2v4mg                     0/1     ContainerCreating   0          0s
pc-job-fxrqq                     0/1     ContainerCreating   0          0s
pc-job-8kf8m                     0/1     Completed           0          19s
pc-job-jlcgk                     0/1     Pending             0          0s
pc-job-jlcgk                     0/1     Pending             0          0s
pc-job-jlcgk                     0/1     ContainerCreating   0          0s
pc-job-jlcgk                     1/1     Running             0          1s
pc-job-2v4mg                     1/1     Running             0          1s
pc-job-fxrqq                     1/1     Running             0          2s
pc-job-fxrqq                     0/1     Completed           0          19s
pc-job-jlcgk                     0/1     Completed           0          19s
pc-job-2v4mg                     0/1     Completed           0          19s
```

---

### 6.7 CronJob(CJ)

---

CronJob控制器以Job控制器资源为其管控对象，并借助它管理pod资源对象，Job控制器定义的作用任务在其控制器资源创建之后便会立即执行，但CronJob可以以类似于Linux操作系统的周期性任务作业计划的方式控制其运行**时间点**及**重复运行**的方式。也就是说，**CronJob可以在特定的时间点(反复的)去运行Job任务**

CronJob的资源清单文件

```yaml
apiVersion: batch/v1beta1		# 版本号
kind: CronJob				# 类型
metadata: 					# 元数据
  name:							# rs名称
  namespace:				# 所属命名空间
  labels:						# 标签
    controller: cronjob
spec:								# 详情描述
  schedule:					# cron格式的作业调度运行时间点，用于控制任务在什么时间执行
  concurrencyPolicy:  # 并发执行策略，用于定义前一次作业运行尚未完成时是否以及如何运行后一次的作业
  failedJobHistoryLimit:		  # 为失败的任务执行保留的历史记录数，默认为1
  successfulJobHistoryLimit:	# 为成功的任务执行保留的历史记录数，默认为3
  startingDeadlineSeconds:		# 启动作业错误的超时时长
  jobTemplate:			# job控制器模版，用于为cronjob控制器生成job对象 下面其实就是job的定义
    metadata:
    spec:
      completions: 1
      parallelism: 1
      activeDeadlineSeconds: 30
      backoffLimit: 6
      manualSelector: true
      selector:
        matchLabels:
          app: counter-pod
        matchExpressions:  # 规则
          - {key: app, operator: In, values: [counter-pod]}
      template:
        metadata:
          labels:
            app: counter-pod
        spec:
          restartPolicy: Never
          containers:
          - name: counter
            image: 47.93.22.25:5000/busybox:1.30
            command: ["bin/sh", "-c", "for i in 9 8 7 6 5 4 3 2 1; do echo $i; sleep 2; done"]
```

```markdown
schedule: cron表达式，用于指定任务的执行时间
		*/1			 *		  *		  *		   *			(每一分钟)
		<分钟>  <小时>  <日>  <月份>  <星期>

		分钟	值从 0 到 59
		小时	值从 0 到 23
		日	值从 1 到 31
		月 值从 1 到 12
		星期  值从 0 到 6，0 代表星期日
		多个时间可以用逗号隔开; 范围可以用连字符给出; * 可以作为通配符; /表示每...
concurrencyPolicy:
    Allow:	允许Jobs并发运行(默认)
    Forbid:	禁止并发运行，如果上一次运行尚未完成，则跳过下一次运行
    Replace: 替换，取消当前正在运行的作业并用新作业替换它
```

创建pc-cronjob.yaml

```yaml
apiVersion: batch/v1beta1
kind: CronJob
metadata:
  name: pc-cronjob
  namespace: dev
  labels:
    controller: cronjob
spec:
  schedule: "*/1 * * * *"
  jobTemplate:
    metadata:
    spec:
      template:
        spec:
          restartPolicy: Never
          containers:
          - name: counter
            image: 47.93.22.25:5000/busybox:1.30
            command: ["bin/sh", "-c", "for i in 9 8 7 6 5 4 3 2 1; do echo $i; sleep 3; done"]
```

```powershell
# 创建cj
[root@master ~]# kubectl create -f pc-cronjob.yaml
cronjob.batch/pc-cronjob created

# 监控cj
[root@master ~]# kubectl get cj -n dev -w
NAME         SCHEDULE      SUSPEND   ACTIVE   LAST SCHEDULE   AGE
pc-cronjob   */1 * * * *   False     0        <none>          0s
pc-cronjob   */1 * * * *   False     1        1s              55s
pc-cronjob   */1 * * * *   False     0        31s             85s
pc-cronjob   */1 * * * *   False     1        1s              115s
pc-cronjob   */1 * * * *   False     0        31s             2m25s

# 监控job
[root@master ~]# kubectl get job -n dev -w
NAME     COMPLETIONS   DURATION   AGE
pc-cronjob-1735465140   0/1                      0s
pc-cronjob-1735465140   0/1           0s         0s
pc-cronjob-1735465140   1/1           29s        29s
pc-cronjob-1735465200   0/1                      0s
pc-cronjob-1735465200   0/1           0s         0s
pc-cronjob-1735465200   1/1           29s        29s

# 监控pod
[root@master ~]# kubectl get pod -n dev -w
NAME                             READY   STATUS      RESTARTS   AGE
pc-cronjob-1735465140-ww6p9      0/1     Pending     0          0s
pc-cronjob-1735465140-ww6p9      0/1     Pending     0          0s
pc-cronjob-1735465140-ww6p9      0/1     ContainerCreating   0          0s
pc-cronjob-1735465140-ww6p9      1/1     Running             0          2s
pc-cronjob-1735465140-ww6p9      0/1     Completed           0          29s
pc-cronjob-1735465200-bljx7      0/1     Pending             0          0s
pc-cronjob-1735465200-bljx7      0/1     Pending             0          0s
pc-cronjob-1735465200-bljx7      0/1     ContainerCreating   0          0s
pc-cronjob-1735465200-bljx7      1/1     Running             0          2s
pc-cronjob-1735465200-bljx7      0/1     Completed           0          29s

# 每一分钟都会执行一次

# 删除
[root@master ~]# kubectl delete -f pc-cronjob.yaml
cronjob.batch "pc-cronjob" deleted
# pod 和 job 也会被停止
[root@master ~]# kubectl get pod -n dev -w
NAME                             READY   STATUS      RESTARTS   AGE
pc-cronjob-1735465140-ww6p9      0/1     Terminating         0          2m12s
pc-cronjob-1735465260-d98d6      1/1     Terminating         0          11s
pc-cronjob-1735465200-bljx7      0/1     Terminating         0          72s
pc-cronjob-1735465140-ww6p9      0/1     Terminating         0          2m12s
pc-cronjob-1735465200-bljx7      0/1     Terminating         0          72s
pc-cronjob-1735465260-d98d6      0/1     Terminating         0          29s
pc-cronjob-1735465260-d98d6      0/1     Terminating         0          36s
pc-cronjob-1735465260-d98d6      0/1     Terminating         0          36s
[root@master ~]# kubectl get job -n dev
No resources found in dev namespace.
```

---

## 第七章 Service详解

---

主要介绍kubernetes的流量负载组件：Service和Ingress

----

### 7.1 Service介绍

---

在kubernetes中，pod是应用程序的载体，我们可以通过pod的ip来访问应用程序，但是pod的ip地址不是固定的，不方便直接采用pod的ip对服务进行访问

为了解决这个问题，kubernetes提供了Service资源，Service会对提供同一个服务的多个pod进行聚合，并且提供一个统一的入口地址，通过访问Service的入口地址就能访问到后面的pod服务

<img src="https://tonkyshan.cn/img/20250108164231.png" alt="20250108164231" style="zoom:50%;" />

Service在很多情况下只是一个概念，真正起作用的其实是kube-proxy服务进程，每个Node节点上都运行着一个kube-proxy服务进程，当创建Service的时候会通过api-server向etcd写入创建的service的信息，而kube-proxy会基于监听的机制发现这种Service的变动，然后**它会将最新的Service信息转换成对应的访问规则**

<img src="https://tonkyshan.cn/img/20250108165634.png" alt="20250108165634" style="zoom: 43%;" />

kube-proxy目前支持三种工作模式：

**userspace 模式**

userspace模式下，kube-proxy会为每一个Service创建一个监听端口，发向Cluster IP的请求被Iptables规则重定向到kube-proxy监听的端口上，kube-proxy根据LB算法选择一个提供服务的Pod并和其建立链接，以将请求转发到Pod上

该模式下，kube-proxy充当了一个四层负责均衡器的角色，由于kube-proxy运行在userspace中，在进行转发处理时会增加内核和用户空间之间的数据拷贝，虽然比较稳定，但是效率比较低

<img src="https://tonkyshan.cn/img/20250108203451.png" alt="userspace 模式" style="zoom: 53%;" />

**iptables 模式**

iptables模式下，kube-proxy为service后端的每个Pod创建对应的iptables规则，直接将发向Cluster IP的请求重定向到一个Pod IP

该模式下，kube-proxy不承担四层负载均衡器的角色，只负责创建iptables规则，该模式的优点是较userspace模式效率更高，但不能提供灵活的LB策略，当后端Pod不可用时也无法进行重试

<img src="https://tonkyshan.cn/img/20250108204018.png" alt="iptables 模式" style="zoom: 53%;" />

**ipvs 模式**

ipvs模式和iptables类似，kube-proxy监控Pod的变化并创建相应的ipvs规则，ipvs相对iptables转发效率更高

除此以外，ipvs支持更多的LB算法

<img src="https://tonkyshan.cn/img/20250108204639.png" alt="ipvs 模式" style="zoom: 47%;" />

```powershell
# 此模式必须安装ipvs内核模块，否则会降级为iptables
# 开启ipvs
# 修改mode为ipvs
[root@master ~]# kubectl edit cm kube-proxy -n kube-system
configmap/kube-proxy edited
# 删除重建
[root@master ~]# kubectl delete pod -l k8s-app=kube-proxy -n kube-system
pod "kube-proxy-lg5gz" deleted
pod "kube-proxy-ltc46" deleted
pod "kube-proxy-zgb7s" deleted

# ipvs规则
[root@master ~]# ipvsadm -Ln
IP Virtual Server version 1.2.1 (size=4096)
Prot LocalAddress:Port Scheduler Flags
  -> RemoteAddress:Port           Forward Weight ActiveConn InActConn
TCP  172.16.140.133:31552 rr
  -> 10.244.2.62:80               Masq    1      0          0         
TCP  172.16.140.133:31676 rr
  -> 10.244.2.18:80               Masq    1      0          0         
TCP  172.17.0.1:31552 rr
  -> 10.244.2.62:80               Masq    1      0          0         
TCP  172.17.0.1:31676 rr
  -> 10.244.2.18:80               Masq    1      0          0         
TCP  10.96.0.1:443 rr
  -> 172.16.140.133:6443          Masq    1      0          0         
TCP  10.96.0.10:53 rr
  -> 10.244.0.10:53               Masq    1      0          0         
  -> 10.244.0.11:53               Masq    1      0          0         
TCP  10.96.0.10:9153 rr
  -> 10.244.0.10:9153             Masq    1      0          0         
  -> 10.244.0.11:9153             Masq    1      0          0         
TCP  10.99.253.103:80 rr
  -> 10.244.2.18:80               Masq    1      0          0         
TCP  10.104.35.138:443 rr
  -> 172.16.140.134:443           Masq    1      0          0         
TCP  10.105.153.172:80 rr
  -> 10.244.2.62:80               Masq    1      0          0         
TCP  10.244.0.0:31552 rr
  -> 10.244.2.62:80               Masq    1      0          0         
TCP  10.244.0.0:31676 rr
  -> 10.244.2.18:80               Masq    1      0          0         
TCP  10.244.0.1:31552 rr
  -> 10.244.2.62:80               Masq    1      0          0         
TCP  10.244.0.1:31676 rr
  -> 10.244.2.18:80               Masq    1      0          0         
TCP  127.0.0.1:31552 rr
  -> 10.244.2.62:80               Masq    1      0          0         
TCP  127.0.0.1:31676 rr
  -> 10.244.2.18:80               Masq    1      0          0         
UDP  10.96.0.10:53 rr
  -> 10.244.0.10:53               Masq    1      0          0         
  -> 10.244.0.11:53               Masq    1      0          0
```

----

### 7.2 Service类型

---

Service的资源清单文件：

```yaml
kind: Service		# 资源类型
apiVersion: v1	# 资源版本
metadata:				# 元数据
  name: service # 资源名称
  namespace: dev	# 命名空间
spec:						# 描述
  selector:			# 标签选择器，用于确定当前service代理哪些pod
    app: nginx
  type:					# Service类型，指定service的访问方式
  clusterIP:		# 虚拟服务的ip地址
  sessionAffinity:		# session亲和性，支持ClientIP、None两个选项
  ports:				# 端口信息
  - protocol: TCP
    port: 3017	# service端口
    targetPort: 5003 # pod端口
    nodePort: 31122  # 主机端口
```

* ClusterIP：默认值，它是Kubernetes系统自动分配的虚拟IP，只能在集群内部访问
* NodePort：将Service通过指定的Node上的端口暴露给外部，通过此方法，就可以在集群外部访问服务
* LoadBalancer：使用外接负载均衡完成到服务的负载分发，注意此模式需要外部云环境支持
* ExternalName：把集群外部的服务引入集群内部，直接使用

----

### 7.3 Service使用

---

#### 7.3.1 实验环境准备

---

在使用service之前，首先利用Deployment创建出3个pod，注意要为pod设置`app=nginx-pod`的标签

创建deployment.yaml

```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: pc-deployment
  namespace: dev
spec:
  replicas: 3
  selector:
    matchLabels:
      app: nginx-pod
  template:
    metadata:
      labels:
        app: nginx-pod
    spec:
      containers:
      - name: nginx
        image: 47.93.22.25:5000/nginx:latest
        ports:
        - containerPort: 80
```

```powershell
# 创建deployment
[root@master ~]# kubectl create -f deployment.yaml
deployment.apps/pc-deployment created

# 查看pod
[root@master ~]# kubectl get pods -n dev -o wide
NAME                             READY   STATUS      RESTARTS   AGE     IP            NODE    NOMINATED NODE   READINESS GATES
pc-deployment-7b4c87879f-bwgtt   1/1     Running     0          7m46s   10.244.1.47   node1   <none>           <none>
pc-deployment-7b4c87879f-j75tn   1/1     Running     0          7m46s   10.244.1.48   node1   <none>           <none>
pc-deployment-7b4c87879f-xrddd   1/1     Running     0          7m46s   10.244.2.81   node2   <none>           <none>

# 为了方便后面测试，修改下三台nginx的index.html页面(三台修改的IP地址不一致)
# kubectl exec -it pc-deployment-7b4c87879f-bwgtt -n dev /bin/sh
# echo "10.244.1.47" > /usr/share/nginx/html/index.html

# 修改完毕之后，访问测试
[root@master ~]# curl 10.244.1.47
10.244.1.47
[root@master ~]# curl 10.244.1.48
10.244.1.48
[root@master ~]# curl 10.244.2.81
10.244.2.81
```

---

#### 7.3.2 ClusterIP类型的Service

---

创建service-clusterip.yaml文件

```yaml
apiVersion: v1
kind: Service
metadata:
  name: service-clusterip
  namespace: dev
spec:
  selector:
    app: nginx-pod
  clusterIP: 10.97.97.97	# service的ip地址，如果不写，会默认生成一个
  type: ClusterIP
  ports:
  - port: 80	# Service端口
    targetPort: 80	# pod端口
```

```powershell
# 创建service
[root@master ~]# kubectl create -f service-clusterip.yaml
service/service-clusterip created

# 查看service
[root@master ~]# kubectl get svc -n dev -o wide
NAME                TYPE        CLUSTER-IP       EXTERNAL-IP   PORT(S)        AGE   SELECTOR
service-clusterip   ClusterIP   10.97.97.97      <none>        80/TCP         57s   app=nginx-pod

# 查看详细service信息
# 在这里有一个Endpoints列表，里面就是当前service可以负载到的服务入口
[root@master ~]# kubectl describe svc service-clusterip -n dev
Name:              service-clusterip
Namespace:         dev
Labels:            <none>
Annotations:       <none>
Selector:          app=nginx-pod
Type:              ClusterIP
IP:                10.97.97.97
Port:              <unset>  80/TCP
TargetPort:        80/TCP
Endpoints:         10.244.1.47:80,10.244.1.48:80,10.244.2.81:80
Session Affinity:  None
Events:            <none>

# 查看ipvs的映射规则
[root@master ~]# ipvsadm -Ln
IP Virtual Server version 1.2.1 (size=4096)
Prot LocalAddress:Port Scheduler Flags
  -> RemoteAddress:Port           Forward Weight ActiveConn InActConn
TCP  10.97.97.97:80 rr     
  -> 10.244.1.47:80               Masq    1      0          0         
  -> 10.244.1.48:80               Masq    1      0          0             
  -> 10.244.2.81:80               Masq    1      0          0
  
# 访问10.97.97.97:80观察效果
[root@master ~]# curl 10.97.97.97:80
10.244.2.81
[root@master ~]# curl 10.97.97.97:80
10.244.1.48
[root@master ~]# curl 10.97.97.97:80
10.244.1.47
```

**Endpoint**

Endpoint是kubernetes中的一个资源对象，存储在etcd中，用来记录一个service对应的所有pod的访问地址，它是根据service配置文件中selector描述产生的

一个Service由一组Pod组成，这些Pod通过Endpoints暴露出来，**Endpoints是实现实际服务的端点集合**，也就是说，service和pod之间的联系是通过endpoints实现的

**负载分发策略**

对Service的访问被分发到了后端的Pod上去，目前kubernetes提供了两张负载分发策略

* 如果不定义，默认使用kube-proxy的策略，比如随机、轮询
* 基于客户端地址的会话保持模式，即来自同一个客户端发起的所有请求都会转发到固定的一个Pod上，此模式可以使在spec中添加`sessionAffinity:ClientIP`选项

```powershell
# 查看ipvs的映射规则【rr轮询】
# 查看ipvs的映射规则
[root@master ~]# ipvsadm -Ln
IP Virtual Server version 1.2.1 (size=4096)
Prot LocalAddress:Port Scheduler Flags
  -> RemoteAddress:Port           Forward Weight ActiveConn InActConn
TCP  10.97.97.97:80 rr     
  -> 10.244.1.47:80               Masq    1      0          0         
  -> 10.244.1.48:80               Masq    1      0          0             
  -> 10.244.2.81:80               Masq    1      0          0
  
# 循环访问测试
[root@master ~]# while true; do curl 10.97.97.97:80; sleep 5; done;
10.244.2.81
10.244.1.48
10.244.1.47
10.244.2.81
10.244.1.48
10.244.1.47

# 修改分发策略 ---- sessionAffinity: ClientIP

# 查看ipvs规则【persistent 代表持久】
[root@master ~]# ipvsadm -Ln
IP Virtual Server version 1.2.1 (size=4096)
Prot LocalAddress:Port Scheduler Flags
  -> RemoteAddress:Port           Forward Weight ActiveConn InActConn       
TCP  10.97.97.97:80 rr persistent 10800     
  -> 10.244.1.47:80               Masq    1      0          0         
  -> 10.244.1.48:80               Masq    1      0          0      
  -> 10.244.2.81:80               Masq    1      0          0
  
# 循环访问测试
[root@master ~]# while true; do curl 10.97.97.97:80; sleep 5; done;
10.244.2.81
10.244.2.81
10.244.2.81

# 删除service 缺点：只能集群内部访问
[root@master ~]# kubectl delete -f service-clusterip.yaml
service "service-clusterip" deleted
```

----

#### 7.3.3 HeadLiness类型的Service

---

在某些场景中，开发人员可能不想使用Service提供的负载均衡功能，而希望自己来控制负载均衡策略，针对这种情况，kubernetes提供了HeadLiness Service，这类Service不会分配Cluster IP，如果想要访问service，只能通过service的域名进行查询

创建service-headliness.yaml

```yaml
apiVersion: v1
kind: Service
metadata:
  name: service-headliness
  namespace: dev
spec:
  selector:
    app: nginx-pod
  clusterIP: None	# 将clusterIP设置为None,即可创建headliness Service
  type: ClusterIP
  ports:
  - port: 80
    targetPort: 80
```

```powershell
# 创建service
[root@master ~]# kubectl create -f service-headliness.yaml
service/service-headliness created

# 获取service，发现CLUSTER-IP未分配
[root@master ~]# kubectl get svc -n dev -o wide
NAME                 TYPE        CLUSTER-IP       EXTERNAL-IP   PORT(S)        AGE     SELECTOR
service-headliness   ClusterIP   None             <none>        80/TCP         7m46s   app=nginx-pod

# 查看service详情
[root@master ~]# kubectl describe svc service-headliness -n dev
Name:              service-headliness
Namespace:         dev
Labels:            <none>
Annotations:       <none>
Selector:          app=nginx-pod
Type:              ClusterIP
IP:                None
Port:              <unset>  80/TCP
TargetPort:        80/TCP
Endpoints:         10.244.1.47:80,10.244.1.48:80,10.244.2.81:80
Session Affinity:  None
Events:            <none>

# 查看pod
[root@master ~]# kubectl get pods -n dev -o wide
NAME                             READY   STATUS      RESTARTS   AGE     IP            NODE    NOMINATED NODE   READINESS GATES
pc-deployment-7b4c87879f-bwgtt   1/1     Running     0          4h49m   10.244.1.47   node1   <none>           <none>
pc-deployment-7b4c87879f-j75tn   1/1     Running     0          4h49m   10.244.1.48   node1   <none>           <none>
pc-deployment-7b4c87879f-xrddd   1/1     Running     0          4h49m   10.244.2.81   node2   <none>           <none>

# 查看域名解析情况
[root@master ~]# kubectl exec -it pc-deployment-7b4c87879f-bwgtt -n dev /bin/sh
# cat /etc/resolv.conf
nameserver 10.96.0.10
search dev.svc.cluster.local svc.cluster.local cluster.local localdomain
options ndots:5

[root@master ~]# dig @10.96.0.10 service-headliness.dev.svc.cluster.local

; <<>> DiG 9.11.4-P2-RedHat-9.11.4-26.P2.el7 <<>> @10.96.0.10 service-headliness.dev.svc.cluster.local
; (1 server found)
;; global options: +cmd
;; Got answer:
;; WARNING: .local is reserved for Multicast DNS
;; You are currently testing what happens when an mDNS query is leaked to DNS
;; ->>HEADER<<- opcode: QUERY, status: NOERROR, id: 14041
;; flags: qr aa rd; QUERY: 1, ANSWER: 5, AUTHORITY: 0, ADDITIONAL: 1
;; WARNING: recursion requested but not available

;; OPT PSEUDOSECTION:
; EDNS: version: 0, flags:; udp: 4096
;; QUESTION SECTION:
;service-headliness.dev.svc.cluster.local. IN A

;; ANSWER SECTION:
service-headliness.dev.svc.cluster.local. 30 IN A 10.244.2.81
service-headliness.dev.svc.cluster.local. 30 IN A 10.244.1.48
service-headliness.dev.svc.cluster.local. 30 IN A 10.244.1.47

;; Query time: 13 msec
;; SERVER: 10.96.0.10#53(10.96.0.10)
;; WHEN: 一 12月 30 18:28:54 CST 2024
;; MSG SIZE  rcvd: 349
```

---

#### 7.3.4 NodePort类型的Service

---

在之前的样例中，创建的Service的ip地址只有集群内部才可以访问，如果希望将Service暴露给集群外部使用，那么就要使用到另一种类型的Service，称为NodePort类型，NodePort的工作原理其实就是**将service的端口映射到Node的一个端口上**，然后就可以通过`NodeIp:NodePort`来访问service了

创建service-nodeport.yaml

```yaml
apiVersion: v1
kind: Service
metadata:
  name: service-nodeport
  namespace: dev
spec:
  selector:
    app: nginx-pod
  type: NodePort
  ports:
  - port: 80
    nodePort: 30002 # 指定绑定的node的端口(默认的取值范围是: 30000-32767), 如果不指定，会默认分配
    targetPort: 80
```

```powershell
# 创建service
[root@master ~]# kubectl create -f service-nodeport.yaml
service/service-nodeport created

# 查看service
[root@master ~]# kubectl get svc -n dev -o wide
NAME               TYPE       CLUSTER-IP       EXTERNAL-IP   PORT(S)        AGE   SELECTOR
service-nodeport   NodePort   10.105.191.245   <none>        80:30002/TCP   19s   app=nginx-pod

# 可以通过电脑主机的浏览器去访问集群中任意一个nodeip的30002端口，即可访问到pod
# http://172.16.140.135:30002/  显示 10.244.2.81
```

----

#### 7.3.5 LoadBalancer类型的Service

---

LoadBalancer和NodePort很相似，目的都是向外部暴露一个端口，区别在于LoadBanlancer会在集群的外部再来做一个负载均衡设备，而这个设备需要外部环境支持的，外部范围发送到这个设备上的请求，会被设备负载之后转发到集群中

---

#### 7.3.6 ExternalName类型的Service

---

ExternalName类型的Service用于引入集群外部的服务，它通过`externalName`属性指定外部一个服务的地址，然后在集群内部访问此service就可以访问到外部的服务了

```yaml
apiVersion: v1
kind: Service
metadata:
  name: service-externalname
  namespace: dev
spec:
  type: ExternalName  # service类型
  externalName: www.baidu.com	# 改成ip地址也可以
```

```powershell
# 创建service
[root@master ~]# kubectl create -f service-externalname.yaml
service/service-externalname created

# 域名解析
[root@master ~]# dig @10.96.0.10 service-externalname.dev.svc.cluster.local

; <<>> DiG 9.11.4-P2-RedHat-9.11.4-26.P2.el7 <<>> @10.96.0.10 service-externalname.dev.svc.cluster.local
; (1 server found)
;; global options: +cmd
;; Got answer:
;; WARNING: .local is reserved for Multicast DNS
;; You are currently testing what happens when an mDNS query is leaked to DNS
;; ->>HEADER<<- opcode: QUERY, status: NOERROR, id: 25947
;; flags: qr aa rd; QUERY: 1, ANSWER: 4, AUTHORITY: 0, ADDITIONAL: 1
;; WARNING: recursion requested but not available

;; OPT PSEUDOSECTION:
; EDNS: version: 0, flags:; udp: 4096
;; QUESTION SECTION:
;service-externalname.dev.svc.cluster.local. IN A

;; ANSWER SECTION:
service-externalname.dev.svc.cluster.local. 5 IN CNAME www.baidu.com.
www.baidu.com.          5       IN      CNAME   www.a.shifen.com.
www.a.shifen.com.       5       IN      A       180.101.49.44
www.a.shifen.com.       5       IN      A       180.101.51.73

;; Query time: 29 msec
;; SERVER: 10.96.0.10#53(10.96.0.10)
;; WHEN: 一 12月 30 19:42:45 CST 2024
;; MSG SIZE  rcvd: 247
```

---

### 7.4 Ingress介绍

---

Service对集群之外暴露服务的主要方式有两种：NotePort和LoadBalancer，但是这两种方式，都有一定的缺点：

* NodePort方式的缺点是会占用很多集群机器的端口，那么当集群服务变多的时候，这个缺点就愈发明显
* LB方式的缺点是每个service需要一个LB，浪费、麻烦，并且需要kubernetes之外设备的支持

基于这种现状，kubernetes提供了Ingress资源对象，Ingress只需要一个NodePort或者一个LB就可以满足暴露多个Service的需求。工作机制大致如下图：

<img src="https://tonkyshan.cn/img/20250113173427.png" alt="Ingress" style="zoom: 47%;" />

实际上，Ingress相当于一个7层的负载均衡器，是kubernetes对反向代理的一个抽象，它的工作原理类似于Nginx，可以理解成在Ingress里建立诸多映射规则，Ingress Controller通过监听这些配置规则并转化成Nginx的配置，然后对外部提供服务，在这里有两个核心概念：

* Ingress：kubernetes中的一个对象，作用是定义请求如何转发到service的规则
* Ingress controller：具体实现反向代理及负载均衡的程序，对Ingress定义的规则进行解析，根据配置的规则来实现请求转发，实现方式有很多，比如Nginx，Contour，Haproxy等等

Ingress(以Nginx为例)的工作原理如下：

* 用户编写Ingress规则，说明哪个域名对应kubernetes集群中的哪个Service
* Ingress控制器动态感知Ingress服务规则的变化，然后生成一段对应的Nginx配置
* Ingress控制器会将生成的Nginx配置写入到一个运行着的Nginx服务中，并动态更新
* 到此为止，其实真正在工作的就是一个Nginx了，内部配置了用户定义的请求转发规则

<img src="https://tonkyshan.cn/img/20250114103724.png" alt="Ingress" style="zoom: 47%;" />

---

### 7.5 Ingress使用

---

#### 7.5.1 环境准备

----

**搭建ingress环境**

```powershell
# 创建文件夹
[root@master ~]# mkdir ingress-controller
[root@master ~]# cd ingress-controller/

# 获取ingress-nginx，使用的是0.30版本
# 链接已经失效，可以自取
# wget https://tonkyshan.cn/files/mandatory.yaml
# wget https://tonkyshan.cn/files/service-nodeport.yaml

# adm框架 记得把mandatory.yaml中镜像改成47.93.22.25:5000/quay.io/kubernetes-ingress-controller/nginx-ingress-controller:0.30.0
# yaml中是arm镜像

[root@master ingress-controller]# wget https://raw.githubusercontent.com/kubernetes/ingress-nginx/nginx-0.30.0/deploy/static/mandatory.yaml
[root@master ingress-controller]# wget https://raw.githubusercontent.com/kubernetes/ingress-nginx/nginx-0.30.0/deploy/static/provider/baremetal/service-nodeport.yaml

# 创建ingress-nginx
[root@master ingress-controller]# kubectl apply -f ./
namespace/ingress-nginx created
configmap/nginx-configuration created
configmap/tcp-services created
configmap/udp-services created
serviceaccount/nginx-ingress-serviceaccount created
clusterrole.rbac.authorization.k8s.io/nginx-ingress-clusterrole created
role.rbac.authorization.k8s.io/nginx-ingress-role created
rolebinding.rbac.authorization.k8s.io/nginx-ingress-role-nisa-binding created
clusterrolebinding.rbac.authorization.k8s.io/nginx-ingress-clusterrole-nisa-binding created
deployment.apps/nginx-ingress-controller created
limitrange/ingress-nginx created
service/ingress-nginx created

# 查看ingress-nginx
[root@master ingress-controller]# kubectl get pod -n ingress-nginx
NAME                                       READY   STATUS    RESTARTS   AGE
nginx-ingress-controller-79678cbb9-ppfdx   1/1     Running   0          5m33s

# 查看service
[root@master ingress-controller]# kubectl get svc -n ingress-nginx
NAME            TYPE       CLUSTER-IP      EXTERNAL-IP   PORT(S)                      AGE
ingress-nginx   NodePort   10.108.77.232   <none>        80:32018/TCP,443:31296/TCP   8s
```

**准备service和pod**

<img src="https://tonkyshan.cn/img/20250114163952.png" alt="service" style="zoom: 60%;" />

创建tomcat-nginx.yaml

```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: nginx-deployment
  namespace: dev
spec:
  replicas: 3
  selector:
    matchLabels:
      app: nginx-pod
  template:
    metadata:
      labels:
        app: nginx-pod
    spec:
      containers:
      - name: nginx
        image: 47.93.22.25:5000/nginx:latest
        ports:
        - containerPort: 80

---

apiVersion: apps/v1
kind: Deployment
metadata:
  name: tomcat-deployment
  namespace: dev
spec:
  replicas: 3
  selector:
    matchLabels:
      app: tomcat-pod
  template:
    metadata:
      labels:
        app: tomcat-pod
    spec:
      containers:
      - name: tomcat
        image: 47.93.22.25:5000/tomcat:8.5-jre10-slim
        ports:
        - containerPort: 8080

---

apiVersion: v1
kind: Service
metadata:
  name: nginx-service
  namespace: dev
spec:
  selector:
    app: nginx-pod
  clusterIP: None
  type: ClusterIP
  ports:
  - port: 80
    targetPort: 80

---

apiVersion: v1
kind: Service
metadata:
  name: tomcat-service
  namespace: dev
spec:
  selector:
    app: tomcat-pod
  clusterIP: None
  type: ClusterIP
  ports:
  - port: 8080
    targetPort: 8080
```

```powershell
# 创建
[root@master ~]# kubectl create -f tomcat-nginx.yaml
deployment.apps/nginx-deployment created
deployment.apps/tomcat-deployment created
service/nginx-service created
service/tomcat-service created

# 查看
[root@master ~]# kubectl get svc -n dev
NAME             TYPE        CLUSTER-IP   EXTERNAL-IP   PORT(S)    AGE
nginx-service    ClusterIP   None         <none>        80/TCP     60s
tomcat-service   ClusterIP   None         <none>        8080/TCP   60s

[root@master ~]# kubectl get pods -n dev
NAME                                 READY   STATUS    RESTARTS   AGE
nginx-deployment-64f4b88b45-b9xh8    1/1     Running   0          3s
nginx-deployment-64f4b88b45-f8k4h    1/1     Running   0          3s
nginx-deployment-64f4b88b45-wkfgl    1/1     Running   0          3s
tomcat-deployment-8465bd78b8-vtdrs   1/1     Running   0          3s
tomcat-deployment-8465bd78b8-wnb4s   1/1     Running   0          3s
tomcat-deployment-8465bd78b8-wzp8c   1/1     Running   0          3s
```

---

#### 7.5.2 Http代理

---

创建ingress-http.yaml

```yaml
apiVersion: extensions/v1beta1
kind: Ingress
metadata:
  name: ingress-http
  namespace: dev
spec:
  rules:
  - host: nginx.tonkyshan.cn
    http:
      paths:
      - path: /
        backend:
          serviceName: nginx-service
          servicePort: 80
  - host: tomcat.tonkyshan.cn
    http:
      paths:
      - path: /
        backend:
          serviceName: tomcat-service
          servicePort: 8080
```

```powershell
# 创建
[root@master ~]# kubectl create -f ingress-http.yaml
ingress.extensions/ingress-http created

# 查看ing
[root@master ~]# kubectl get ing ingress-http -n dev
NAME           HOSTS                                    ADDRESS         PORTS   AGE
ingress-http   nginx.tonkyshan.cn,tomcat.tonkyshan.cn   10.108.77.232   80      51s

# 查看详细信息
[root@master ~]# kubectl describe ing ingress-http -n dev
Name:             ingress-http
Namespace:        dev
Address:          10.108.77.232
Default backend:  default-http-backend:80 (<none>)
Rules:
  Host                 Path  Backends
  ----                 ----  --------
  nginx.tonkyshan.cn   
                       /   nginx-service:80 (10.244.1.80:80,10.244.1.82:80,10.244.2.103:80)
  tomcat.tonkyshan.cn  
                       /   tomcat-service:8080 (10.244.1.81:8080,10.244.1.83:8080,10.244.2.104:8080)
Annotations:
Events:
  Type    Reason  Age    From                      Message
  ----    ------  ----   ----                      -------
  Normal  CREATE  2m32s  nginx-ingress-controller  Ingress dev/ingress-http
  Normal  UPDATE  2m22s  nginx-ingress-controller  Ingress dev/ingress-http

# 修改主机host文件 
# master的ip  域名1
# master的ip  域名2

# 查看service
[root@master ingress-controller]# kubectl get svc -n ingress-nginx
NAME            TYPE       CLUSTER-IP      EXTERNAL-IP   PORT(S)                      AGE
ingress-nginx   NodePort   10.108.77.232   <none>        80:32018/TCP,443:31296/TCP   8s

# 访问url，端口 80 http ---> 32018  443 https ---> 31296
```

<img src="https://tonkyshan.cn/img/20250114175552.png" alt="http" style="zoom: 70%;" />

---

#### 7.5.3 Https代理

-----

创建证书

```powershell
# 生成证书
[root@master ~]# openssl req -x509 -sha256 -nodes -days 365 -newkey rsa:2048 -keyout tls.key -out tls.crt -subj "/C=CN/ST=BJ/O=nginx/CN=tonkyshan.cn"
Generating a 2048 bit RSA private key
...........................................................+++
................+++
writing new private key to 'tls.key'
-----

# 创建密钥
[root@master ~]# kubectl create secret tls tls-secret --key tls.key --cert tls.crt
secret/tls-secret created
```

创建ingress-https.yaml

```yaml
apiVersion: extensions/v1beta1
kind: Ingress
metadata:
  name: ingress-https
  namespace: dev
spec:
  tls:
    - hosts:
      - nginx.tonkyshan.com
      - tomcat.tonkyshan.com
      secretName: tls-secret # 指定密钥
  rules:
  - host: nginx.tonkyshan.cn
    http:
      paths:
      - path: /
        backend:
          serviceName: nginx-service
          servicePort: 80
  - host: tomcat.tonkyshan.cn
    http:
      paths:
      - path: /
        backend:
          serviceName: tomcat-service
          servicePort: 8080
```

```powershell
# 创建
[root@master ~]# kubectl create -f ingress-https.yaml
ingress.extensions/ingress-https created

# 查看ing
[root@master ~]# kubectl get ing ingress-https -n dev
NAME            HOSTS                                    ADDRESS   PORTS     AGE
ingress-https   nginx.tonkyshan.cn,tomcat.tonkyshan.cn             80, 443   31s

# 查看详情
[root@master ~]# kubectl describe ing ingress-https -n dev
Name:             ingress-https
Namespace:        dev
Address:          10.108.77.232
Default backend:  default-http-backend:80 (<none>)
TLS:
  tls-secret terminates nginx.tonkyshan.com,tomcat.tonkyshan.com
Rules:
  Host                 Path  Backends
  ----                 ----  --------
  nginx.tonkyshan.cn   
                       /   nginx-service:80 (10.244.1.80:80,10.244.1.82:80,10.244.2.103:80)
  tomcat.tonkyshan.cn  
                       /   tomcat-service:8080 (10.244.1.81:8080,10.244.1.83:8080,10.244.2.104:8080)
Annotations:
Events:
  Type    Reason  Age    From                      Message
  ----    ------  ----   ----                      -------
  Normal  CREATE  2m32s  nginx-ingress-controller  Ingress dev/ingress-https
  Normal  UPDATE  118s   nginx-ingress-controller  Ingress dev/ingress-https
```

<img src="https://tonkyshan.cn/img/20250114192552.png" alt="https" style="zoom: 70%;" />

---

## 第八章 数据存储

---

容器的生命周期可能很短，会被频繁的创建和销毁，那么容器在销毁时，保存在容器中的数据也会被清除。这种结果对于用户来说，在某些情况下是不愿意看到的，围栏持久化保存容器的数据，kubernetes引入了Volume概念

Volume是Pod中能够被多个容器访问的共享目录，它被定义在Pod上，然后被一个Pod里的多个容器挂载到具体的文件目录下，kubernetes通过Volume实现同一个Pod中不同容器之间的数据共享以及数据的持久化存储，Volume的生命容器不与Pod中单个容器的生命周期有关，当容器终止或者重启时，Volume中的数据也不会丢失

kubernetes的Volume支持多种类型，比较常见的有下面几个：

* 简单存储：EmptyDir、HostPath、NFS
* 高级存储：PV、PVC
* 配置存储：ConfigMap、Secret

---

### 8.1 基本存储

---

#### 8.1.1 EmptyDir

---

EmptyDir是最基础的Volume类型，一个EmptyDir就是Host上的一个空目录

EmptyDir是在Pod分配到Node时创建的，它的初始内容为空，并且无需指定宿主机上对应的目录文件，因为kubernetes会自动分配一个目录

**当Pod销毁时，EmptyDir中的数据也会被永久删除**

EmptyDir用途如下：

* 临时空间，例如用于某些应用程序运行时所需的临时目录，且无需永久保留
* 一个容器需要从另一个容器中获取数据的目录(多容器共享目录)

通过一个容器之间的文件共享案例来使用一下EmptyDir

在一个Pod中准备两个容器nginx和busybox，然后声明一个Volume分别挂载到两个容器的目录中，然后nginx容器负责向Volume中写日志，busybox中通过命令将日志内容读取到控制台

创建volume-emptydir.yaml

```yaml
apiVersion: v1
kind: Pod
metadata: 
  name: volume-emptydir
  namespace: dev
spec:
  containers:
  - name: nginx
    image: 47.93.22.25:5000/nginx:latest
    ports:
    - containerPort: 80
    volumeMounts:	# 将logs-volume挂载到nginx容器中，对应的目录为 /var/log/nginx
    - name: logs-volume
      mountPath: /var/log/nginx
  - name: busybox
    image: 47.93.22.25:5000/busybox:1.30
    command: ["/bin/sh", "-c", "tail -f /logs/access.log"]	# 初始命令，动态读取指定文件中内容
    volumeMounts: # 将logs-volume挂载到busybox容器中，对应的目录为 /logs
    - name: logs-volume
      mountPath: /logs
  volumes: # 声明volume，name为logs-volume，类型为emptyDir
  - name: logs-volume
    emptyDir: {}
```

```powershell
# 创建Pod
[root@master ~]# kubectl create -f volume-emptydir.yaml
pod/volume-emptydir created

# 查看Pod
[root@master ~]# kubectl get pods volume-emptydir -n dev -o wide
NAME              READY   STATUS    RESTARTS   AGE   IP             NODE    NOMINATED NODE   READINESS GATES
volume-emptydir   2/2     Running   0          21s   10.244.2.105   node2   <none>           <none>

# 通过podIP访问nginx
[root@master ~]# curl 10.244.2.105:80

# 通过kubectl logs命令查看指定容器的标准输出
[root@master ~]# kubectl logs -f volume-emptydir -n dev -c busybox
```

<img src="https://tonkyshan.cn/img/20250114202155.png" alt="EmptyDir" />

---

#### 8.1.2 HostPath

---

EmptyDir中数据不会被持久化，它会随着Pod的结束而销毁，如果想简单的将数据持久化到主机中，可以选择HostPath

HostPath就是将Node主机中一个实际目录挂载到Pod中，以供容器使用，这样的设计就可以保证Pod销毁了，但是数据依据可以存在于Node主机上

创建一个volume-hostpath.yaml

```yaml
apiVersion: v1
kind: Pod
metadata: 
  name: volume-hostpath
  namespace: dev
spec:
  containers:
  - name: nginx
    image: 47.93.22.25:5000/nginx:latest
    ports:
    - containerPort: 80
    volumeMounts:	# 将logs-volume挂载到nginx容器中，对应的目录为 /var/log/nginx
    - name: logs-volume
      mountPath: /var/log/nginx
  - name: busybox
    image: 47.93.22.25:5000/busybox:1.30
    command: ["/bin/sh", "-c", "tail -f /logs/access.log"]	# 初始命令，动态读取指定文件中内容
    volumeMounts: # 将logs-volume挂载到busybox容器中，对应的目录为 /logs
    - name: logs-volume
      mountPath: /logs
  volumes:
  - name: logs-volume
    hostPath:
      path: /root/logs
      type: DirectoryOrCreate	# 目录存在就使用，不存在就先创建后使用
```

```markdown
关于type值的说明
		DirectoryOrCreate	目录存在就使用，不存在就先创建后使用
		Directory					目录必须存在
		FileOrCreate			文件存在就使用，不存在就先创建后使用
		File							文件必须存在
		Socket						unix套接字必须存在
		CharDevice        字符设备必须存在
		BlockDevice				块设备必须存在
```

```powershell
# 创建Pod
[root@master ~]# kubectl create -f volume-hostpath.yaml
pod/volume-hostpath created

# 查看Pod
[root@master ~]# kubectl get pods volume-hostpath -n dev -o wide
NAME              READY   STATUS    RESTARTS   AGE   IP            NODE    NOMINATED NODE   READINESS GATES
volume-hostpath   2/2     Running   0          28s   10.244.1.84   node1   <none>           <none>
```

<img src="https://tonkyshan.cn/img/20250114204218.png" alt="HostPath" />

```powershell
# 删除pod
[root@master ~]# kubectl delete -f volume-hostpath.yaml
pod "volume-hostpath" deleted

# 查看node1节点上的日志，还存在
[root@node1 ~]# tail -f ./logs/access.log
10.244.0.0 - - [31/Dec/2024:00:27:15 +0000] "GET / HTTP/1.1" 200 615 "-" "curl/7.29.0" "-"
10.244.0.0 - - [31/Dec/2024:00:27:19 +0000] "GET / HTTP/1.1" 200 615 "-" "curl/7.29.0" "-"
10.244.0.0 - - [31/Dec/2024:00:27:20 +0000] "GET / HTTP/1.1" 200 615 "-" "curl/7.29.0" "-"
10.244.0.0 - - [31/Dec/2024:00:27:20 +0000] "GET / HTTP/1.1" 200 615 "-" "curl/7.29.0" "-"
```

---

#### 8.1.3 NFS

---

HostPath可以解决数据持久化的问题，但是一旦Node节点故障了，Pod如果转移到了别的节点，又会出现问题了，此时需要准备单独的网络存储系统，比较常用的是NFS、CIFS

NFS是一个网络文件存储系统，可以搭建一台NFS服务器，然后将Pod中的存储直接连接到NFS系统上，这样的话，无论Pod在节点上怎么转移，只要Node跟NFS的对接没问题，数据就可以成功访问

1、首先要准备NFS服务器，这里为了简单，使用master节点作为NFS服务器

```powershell
# 在master上安装nfs服务
[root@master ~]# yum install nfs-utils -y

# 准备一个共享目录
[root@master ~]# mkdir /root/data/nfs -pv
mkdir: 已创建目录 "/root/data"
mkdir: 已创建目录 "/root/data/nfs"

# 将共享目录以读写权限暴露给172.16.140.0/24网段中的所有主机
[root@master ~]# vim /etc/exports
[root@master ~]# more /etc/exports
/root/data/nfs  172.16.140.0/24(rw,no_root_squash)

# 启动nfs服务
[root@master ~]# systemctl start nfs
```

2、在每个node节点上都安装下nfs，这样的目的是为了node节点可以驱动nfs设备

```powershell
[root@master ~]# yum install nfs-utils -y
```

3、编写pod的配置文件，创建volume-nfs.yaml

```yaml
apiVersion: v1
kind: Pod
metadata: 
  name: volume-nfs
  namespace: dev
spec:
  containers:
  - name: nginx
    image: 47.93.22.25:5000/nginx:latest
    ports:
    - containerPort: 80
    volumeMounts:
    - name: logs-volume
      mountPath: /var/log/nginx
  - name: busybox
    image: 47.93.22.25:5000/busybox:1.30
    command: ["/bin/sh", "-c", "tail -f /logs/access.log"]
    volumeMounts:
    - name: logs-volume
      mountPath: /logs
  volumes:
  - name: logs-volume
    nfs: 
      server: 172.16.140.133	# nfs服务器地址
      path: /root/data/nfs	# 共享文件路径
```

4、运行pod，观察结果

```powershell
# 创建pod
[root@master ~]# kubectl create -f volume-nfs.yaml
pod/volume-nfs created

# 查看pod
[root@master ~]# kubectl get pods volume-nfs -n dev -o wide
NAME         READY   STATUS    RESTARTS   AGE     IP            NODE    NOMINATED NODE   READINESS GATES
volume-nfs   2/2     Running   0          2m34s   10.244.1.85   node1   <none>           <none>

# 查看nfs服务器上的共享目录，发现已经有文件了
```

<img src="https://tonkyshan.cn/img/20250115101618.png" alt="NFS" />

---

### 8.2 高级存储

---

#### 8.2.1 PV和PVC

---

前面学习了使用NFS提供存储，此时就要求用户会搭建NFS系统，并且会在yaml配置nfs，由于kubernetes支持的存储系统有很多，为了能够屏蔽底层存储实现的细节，方便用户使用，kubernetes引入PV和PVC两种资源对象

PV(Persistent Volume)是持久化卷的意思，是对底层的共享存储的一种抽象，一般情况下PV由kubernetes管理员进行创建和配置，它与底层具体的共享存储技术有关，并通过插件完成与共享存储的对接

PVC(Persistent Volume Claim)是持久卷声明的意思，是用户对于存储需求的一种声明，换句话说，PVC其实就是用户向kubernetes系统发出的一种资源需求申请

<img src="https://tonkyshan.cn/img/20250115110138.png" alt="PV/PVC" style="zoom:50%;" />

使用了PV和PVC之后，工作可以得到进一步细分：

* 存储：存储工程师维护
* PV：kubernetes管理员维护
* PVC：kubernetes用户维护

---

#### 8.2.2 PV

---

PV是存储资源的抽象，下面是资源清单文件

```yaml
apiVersion: v1
kind: PersistentVolume
metadata: 
  name: pv2
spec:
  nfs:	# 存储类型，与底层真正存储对应
  capacity:	# 存储能力，目前只支持存储空间的设置
    storage: 2Gi
  accessModes:	# 访问模式
  storageClassName:	# 存储类别
  persistentVolumeReclaimPolicy:	# 回收策略
```

PV的关键配置参数说明：

* **存储类型**

  底层实际存储的类型，kubernetes支持多种存储类型，每种存储类型的配置都有所差异

* **存储能力(capacity)**

  目前只支持存储空间的设置(storage = 1Gi)，不过未来可能会加入IOPS、吞吐量等指标等配置

* **访问模式(accessModes)**

  用于描述用户应用对存储资源的访问权限，访问权限包括下面几种方式：

  * ReadWriteOnce(RWO)：读写权限，但是只能被单个节点挂载
  * ReadOnlyMany(ROX)：只读权限，可以被多个节点挂载
  * ReadWriteMany(RWX)：读写权限，可以被多个节点挂载

  `需要注意的是，底层不同的存储类型可能支持的访问模式不同`

* **回收策略(persistentVolumeReclaimPolicy)**

  当PV不再被使用了之后，对其的处理方式。目前支持三种策略：

  * Retain(保留) 保留数据，需要管理员手动清理数据
  * Recycle(回收) 清除PV中的数据，效果相当于执行 rm -rf /thevolume/*
  * Delete(删除) 与PV相连的后端存储完成volume的删除操作，当然这常见于云服务商的存储服务

  `需要注意的是，底层不同的存储类型可能支持的回收策略不同`

* **存储类别**

  PV可以通过storageClassName参数指定一个存储类别

  * 具有特定类别的PV只能与请求了该类别的PVC进行绑定
  * 未设定类别的PV则只能与不请求任何类别的PVC进行绑定

* **状态(status)**

  一个PV的生命周期中，可能会处于4种不同的阶段：

  * Available(可用)：表示可用状态，还未被任何PVC绑定
  * Bound(已绑定)：表示PV已经被PVC绑定
  * Released(已释放)：表示PVC被删除，但是资源还未被集群重新声明
  * Failed(失败)：表示该PV的自动回收失败

**实验**

使用NFS作为存储，来演示PV的使用，创建3个PV，对应NFS中的3个暴露的路径

1、准备NFS环境

```powershell
# 创建目录
[root@master ~]# mkdir /root/data/{pv1,pv2,pv3} -pv
mkdir: 已创建目录 "/root/data/pv1"
mkdir: 已创建目录 "/root/data/pv2"
mkdir: 已创建目录 "/root/data/pv3"

# 暴露服务
[root@master ~]# more /etc/exports
/root/data/pv1  172.16.140.0/24(rw,no_root_squash)
/root/data/pv2  172.16.140.0/24(rw,no_root_squash)
/root/data/pv3  172.16.140.0/24(rw,no_root_squash)

# 重启服务
[root@master ~]# systemctl restart nfs
```

2、创建pv.yaml

```yaml
apiVersion: v1
kind: PersistentVolume
metadata:
  name: pv1
spec:
  capacity:
    storage: 1Gi
  accessModes:
  - ReadWriteMany
  persistentVolumeReclaimPolicy: Retain
  nfs:
    path: /root/data/pv1
    server: 172.16.140.133
 
---

apiVersion: v1
kind: PersistentVolume
metadata:
  name: pv2
spec:
  capacity:
    storage: 2Gi
  accessModes:
  - ReadWriteMany
  persistentVolumeReclaimPolicy: Retain
  nfs:
    path: /root/data/pv2
    server: 172.16.140.133
 
---

apiVersion: v1
kind: PersistentVolume
metadata:
  name: pv3
spec:
  capacity:
    storage: 3Gi
  accessModes:
  - ReadWriteMany
  persistentVolumeReclaimPolicy: Retain
  nfs:
    path: /root/data/pv3
    server: 172.16.140.133
```

```powershell
# 创建 pv
[root@master ~]# kubectl create -f pv.yaml
persistentvolume/pv1 created
persistentvolume/pv2 created
persistentvolume/pv3 created

# 查看pv
[root@master ~]# kubectl get pv -o wide
NAME   CAPACITY   ACCESS MODES   RECLAIM POLICY   STATUS      CLAIM   STORAGECLASS   REASON   AGE   VOLUMEMODE
pv1    1Gi        RWX            Retain           Available                                   39s   Filesystem
pv2    2Gi        RWX            Retain           Available                                   39s   Filesystem
pv3    3Gi        RWX            Retain           Available                                   39s   Filesystem
```

---

#### 8.2.3 PVC

----

PVC是资源的申请，用来声明对存储空间、访问模式、存储类别需求信息。下面是资源清单文件

```yaml
apiVersion: v1
kind: PersistentVolumeClaim
metadata:
  name: pcv
  namespace: dev
spec:
  accessModes:	# 访问模式
  selector:	# 采用标签对PV选择
  storageClassName:	# 存储类别
  resources:	# 请求空间
    requests:
      storage: 5Gi
```

PVC的关键配置参数说明：

* **访问模式(accessModes)**

  用于描述用户应用对存储资源的访问权限

* **选择条件(selector)**

  通过Label Selector的设置，可使PVC对于系统中已存在的PV进行筛选

* **存储类别(storageClassName)**

  PVC在定义时可以设定需要的后端存储的类别，只有设置了该class的pv才能被系统选出

* **资源请求(Resources)**

  描述对存储资源的请求

**实验**

1、创建pvc.yaml，申请pv

```yaml
apiVersion: v1
kind: PersistentVolumeClaim
metadata:
  name: pvc1
  namespace: dev
spec:
  accessModes:
  - ReadWriteMany
  resources:
    requests:
      storage: 1Gi
 
---

apiVersion: v1
kind: PersistentVolumeClaim
metadata:
  name: pvc2
  namespace: dev
spec:
  accessModes:
  - ReadWriteMany
  resources:
    requests:
      storage: 1Gi
 
---

apiVersion: v1
kind: PersistentVolumeClaim
metadata:
  name: pvc3
  namespace: dev
spec:
  accessModes:
  - ReadWriteMany
  resources:
    requests:
      storage: 5Gi
```

```powershell
# 创建pvc
[root@master ~]# kubectl create -f pvc.yaml
persistentvolumeclaim/pvc1 created
persistentvolumeclaim/pvc2 created
persistentvolumeclaim/pvc3 created

# 查看pv和pvc的绑定情况，pvc3是5Gi 没办法找到对应的pv绑定
[root@master ~]# kubectl get pvc -n dev -o wide
NAME   STATUS    VOLUME   CAPACITY   ACCESS MODES   STORAGECLASS   AGE   VOLUMEMODE
pvc1   Bound     pv1      1Gi        RWX                           84s   Filesystem
pvc2   Bound     pv2      2Gi        RWX                           84s   Filesystem
pvc3   Pending                                                     84s   Filesystem
[root@master ~]# kubectl get pv -o wide
NAME   CAPACITY   ACCESS MODES   RECLAIM POLICY   STATUS      CLAIM      STORAGECLASS   REASON   AGE    VOLUMEMODE
pv1    1Gi        RWX            Retain           Bound       dev/pvc1                           104m   Filesystem
pv2    2Gi        RWX            Retain           Bound       dev/pvc2                           104m   Filesystem
pv3    3Gi        RWX            Retain           Available                                      104m   Filesystem
```

2、创建pods.yaml，使用pv

```yaml
apiVersion: v1
kind: Pod
metadata:
  name: pod1
  namespace: dev
spec:
  containers:
  - name: busybox
    image: 47.93.22.25:5000/busybox:1.30
    command: ["/bin/sh", "-c", "while true; do echo pod1 >> /root/out.txt; sleep 10; done;"]
    volumeMounts:
    - name: volume
      mountPath: /root/
  volumes:
    - name: volume
      persistentVolumeClaim:
        claimName: pvc1
        readOnly: false

---

apiVersion: v1
kind: Pod
metadata:
  name: pod2
  namespace: dev
spec:
  containers:
  - name: busybox
    image: 47.93.22.25:5000/busybox:1.30
    command: ["/bin/sh", "-c", "while true; do echo pod2 >> /root/out.txt; sleep 10; done;"]
    volumeMounts:
    - name: volume
      mountPath: /root/
  volumes:
    - name: volume
      persistentVolumeClaim:
        claimName: pvc2
        readOnly: false
```

```powershell
# 创建pod
[root@master ~]# kubectl create -f pods.yaml
pod/pod1 created
pod/pod2 created

# 查看pod
[root@master ~]# kubectl get pods -n dev -o wide
NAME                            READY   STATUS    RESTARTS   AGE    IP             NODE    NOMINATED NODE   READINESS GATES
pod1                            1/1     Running   0          43s    10.244.2.106   node2   <none>           <none>
pod2                            1/1     Running   0          43s    10.244.2.107   node2   <none>           <none>

# 查看nfs中的文件存储
[root@master ~]# tail -f /root/data/pv1/out.txt 
pod1
pod1
[root@master ~]# tail -f /root/data/pv2/out.txt 
pod2
pod2
pod2

# 这时删除pod，删除pvc，查看pv状态，会变为Released
```

---

#### 8.2.4 生命周期

---

PVC和PV是一一对应的，PV和PVC之间的互相作用遵循以下生命周期：

* **资源供应：**管理员手动创建底层存储和PV

* **资源绑定：**用户创建PVC，kubernetes负责根据PVC的声明去寻找PV，并绑定

  用户定义好PVC之后，系统将根据PVC对存储资源的请求在已存在的PV中选择一个满足条件的

  * 一旦找到，就将该PV与用户定义的PVC进行绑定，用户的应用就可以使用这个PVC了
  * 如果找不到，PVC则会无期限处于Pending状态，直到等到系统管理员创建了一个符合要求的PV

  PV一旦绑定到某个PVC上，就会被这个PVC独占，不能再与其他PVC进行绑定了

* **资源使用：**用户可在pod中像volume一样使用pvc

  Pod使用Volume的定义，将PVC挂载到容器内的某个路径进行使用

* **资源释放：**用户删除PVC来释放PV

  当存储资源使用完毕以后，用户可以删除PVC，与该PVC绑定的PV将会被标记为"已释放"，但还不能立刻与其他PVC进行绑定。通过之前PVC写入的数据可能还被留在存储设备上，只有在清除之后该PV才能再次使用

* **资源回收：**kubernetes根据PV设置的回收策略进行资源的回收

  对于PV，管理员可以设定回收策略，用于设置与之绑定的PVC释放资源之后如何处理遗留数据的问题，只有PV的存储空间完成回收，才能供新的PVC绑定和使用

<img src="https://tonkyshan.cn/img/20250115174041.png" alt="生命周期" style="zoom:50%;" />

----

### 8.3 配置存储

---

#### 8.3.1 ConfigMap

----

ConfigMap是一种比较特殊的存储卷，它的主要作用是用来存储配置信息的

1、创建configmap.yaml

```yaml
apiVersion: v1
kind: ConfigMap
metadata:
  name: configmap
  namespace: dev
data:
  info: |
    username:admin
    password:123456
```

```powershell
# 创建configmap
[root@master ~]# kubectl create -f configmap.yaml
configmap/configmap created

# 查看configmap详情
[root@master ~]# kubectl describe cm configmap -n dev
Name:         configmap
Namespace:    dev
Labels:       <none>
Annotations:  <none>

Data
====
info:
----
username:admin
password:123456

Events:  <none>
```

2、创建pod-configmap.yaml，将上面创建的configmap挂载进去

```yaml
apiVersion: v1
kind: Pod
metadata:
  name: pod-configmap
  namespace: dev
spec:
  containers:
  - name: nginx
    image: 47.93.22.25:5000/nginx:latest
    volumeMounts:	# 将configmap挂载到目录
    - name: config
      mountPath: /configmap/config
  volumes:	# 引用configmap
  - name: config
    configMap:
      name: configmap
```

```powershell
# 创建pod
[root@master ~]# kubectl create -f pod-configmap.yaml
pod/pod-configmap created

# 查看pod
[root@master ~]# kubectl get pods pod-configmap -n dev
NAME            READY   STATUS    RESTARTS   AGE
pod-configmap   1/1     Running   0          15s

# 进入容器
[root@master ~]# kubectl exec -it pod-configmap -n dev /bin/sh
# cd /configmap/config/
# ls
info
# more info
username:admin
password:123456

# 可以看到映射已经成功，每个configmap都映射成了一个目录
# key ---> 文件		value ---> 文件中的内容
# 此时如果更新configmap的内容，容器中的值也会动态更新
```

---

#### 8.3.2 Secret

---

在kubernetes中，还存在一种和ConfigMap非常类似的对象，称为Secret对象，它主要用于存储敏感信息，例如密码、密钥、证书等

1、首先使用base64对数据进行编码

```powershell
# 准备username
[root@master ~]# echo -n 'admin' | base64
YWRtaW4=

# 准备password
[root@master ~]# echo -n '123456' | base64
MTIzNDU2
```

2、接下来编写secret.yaml，并创建Secret

```yaml
apiVersion: v1
kind: Secret
metadata:
  name: secret
  namespace: dev
type: Opaque
data:
  username: YWRtaW4=
  password: MTIzNDU2
```

```powershell
# 创建secret
[root@master ~]# kubectl create -f secret.yaml
secret/secret created

# 查看secret详情
[root@master ~]# kubectl describe secret secret -n dev
Name:         secret
Namespace:    dev
Labels:       <none>
Annotations:  <none>

Type:  Opaque

Data
====
password:  6 bytes
username:  5 bytes
```

3、创建pod-secret.yaml，将上面创建的secret挂载进去

```yaml
apiVersion: v1
kind: Pod
metadata:
  name: pod-secret
  namespace: dev
spec:
  containers:
  - name: nginx
    image: 47.93.22.25:5000/nginx:latest
    volumeMounts:	# 将secret挂载到目录
    - name: config
      mountPath: /secret/config
  volumes:
  - name: config
    secret:
      secretName: secret
```

```powershell
# 创建pod
[root@master ~]# kubectl create -f pod-secret.yaml
pod/pod-secret created

# 查看pod
[root@master ~]# kubectl get pod pod-secret -n dev
NAME         READY   STATUS    RESTARTS   AGE
pod-secret   1/1     Running   0          

# 进入容器，查看secret信息，发现已经自动解码了
[root@master ~]# kubectl exec -it pod-secret -n dev /bin/sh
# ls /secret/config
password  username
# more /secret/config/username
admin
# more /secret/config/password
123456
```

----

## 第九章 安全认证

主要介绍kubernetes的安全认证机制

---

### 9.1 访问控制概述

----

kubernetes作为一个分布式集群的管理工具，保证集群的安全性是一个重要的任务，所谓的安全性其实就是保证对kubernetes对各种**客户端**进行**认证和鉴权**操作

**客户端**

在kubernetes集群中，客户端通常有两类：

* **User Account：**一般是独立于kubernetes之外的其他服务管理的用户账号
* **Service Account：**kubernetes管理的账号，用于为Pod中的服务进程在访问kubernetes时提供身份标识

<img src="https://tonkyshan.cn/img/20250115200008.png" alt="客户端" style="zoom:50%;" />

**认证、授权与准入控制**

ApiServer是访问及管理资源对象的唯一入口，任何一个请求访问ApiServer，都要经过下面三个流程：

* Authentication(认证)：身份鉴别，只有正确的账号才能够通过认证
* Authorization(授权)：判断用户是否有权限对访问的资源执行特定的动作
* Admission Control(准入控制)：用于补充授权机制以实现更加精细的访问控制功能

<img src="https://tonkyshan.cn/img/20250115200843.png" alt="认证、授权与准入控制" style="zoom:50%;" />

---

### 9.2 认证管理

---

Kubernetes集群安全的最关键点在于如何识别并认证客户端身份，它提供了3种客户端身份认证方式：

* HTTP Base认证：通过用户名 + 密码的方式认证

  这种认证方式是把"用户名:密码"用BASE64算法进行编码后的字符串放在HTTP请求种的Header Authorization域里发送给服务端，服务端收到后进行解码，获取用户名及密码，然后进行用户身份认证的过程

* HTTP Token认证：通过一个Token来识别合法用户

  这种认证方式是用Token来表明客户身份的一种方式，每个Token对应一个用户名，当客户端发起API调用请求时，需要在HTTP Header里放入Token，API Server接到Token后会跟服务器中保存的token进行比对，然后进行用户身份认证的过程

* HTTPS证书认证：基于CA根证书签名的双向数字认证方式

  这种认证方式是安全性最高的一种方式，但是同时也是操作起来最麻烦的一种方式

<img src="https://tonkyshan.cn/img/20250115202732.png" alt="HTTPS证书认证" style="zoom:45%;" />

**HTTPS认证大致分为3个过程**

1、证书申请和下发

HTTPS通信双方的服务器向CA机构申请证书，CA机构下发根证书、服务端证书及私钥给申请者

2、客户端和服务端的双向认证

* 客户端向服务器端发起请求，服务端下发自己的证书给客户端，

  客户端接收到证书后，通过私钥解密证书，在证书种获得服务端的公钥，

  客户端利用服务器端的公钥认证证书中的信息，如果一致，则认可这个服务器

* 客户端发送自己的证书给服务器端，服务端接收到证书后，通过私钥解密证书，

  在证书中获得客户端的公钥，并用该公钥认证证书信息，确认客户端是否合法

3、服务器端和客户端进行通信

* 服务器端和客户端协商好加密方案后，客户端会产生一个随机的密钥并加密，然后发送到服务器端

  服务器端接收这个密钥后，双方接下来通信的所有内容都通过该随机密钥加密

`注意：kubernetes允许同时配置多种认证方式，只要其中任意一个方式认证通过即可`

---

### 9.3 权限管理

---

授权发生在认证成功之后，通过认证就可以知道请求用户是谁，然后kubernetes会根据事先定义的授权策略来决定用户是否有权限访问，这个过程就称为授权

每个发送到ApiServer到请求都带上了用户和资源的信息：比如发送请求的用户、请求的路径、请求的动作等，授权就是根据这些信息和授权策略进行比较，如果符合策略，则认为授权通过，否则会返回错误

ApiServer目前支持一下几种授权策略：

* AlwaysDeny：表示拒绝所有请求，一般用于测试
* AlwaysAllow：允许接收所有请求，相当于集群不需要授权流程(kubernetes默认的策略)
* ABAC：基于属性的访问控制，表示使用用户配置的授权规则对于用户请求进行匹配和控制
* Webhook：通过调用外部REST服务队用户进行授权
* Node：是一种专用模式，用于对kubelet发出的请求进行访问控制
* RBAC：基于角色的访问控制(kubeadm安装方式下的默认选项)

RBAC(Role-Based Access Control)基于角色的访问控制，主要是在描述一件事情：**给哪些对象授予了哪些权限**

其中涉及到了下面几个概念：

* 对象：User、Groups、ServiceAccount
* 角色：代表着一组定义在资源上的可操作动作(权限)的集合
* 绑定：将定义好的角色跟用户绑定在一起

<img src="https://tonkyshan.cn/img/20250116095032.png" alt="权限管理" style="zoom:45%;" />

RBAC引入了4个顶级资源对象：

* Role、ClusterRole：角色，用于指定一组权限
* RoleBinding、ClusterRoleBinding：角色绑定，用于将角色(权限)赋予给对象

**Role、ClusterRole**

一个角色就是一组权限的集合，这里的权限都是许可形式的(白名单)

```yaml
# Role只能对命名空间内的资源进行授权，需要指定namespace
kind: Role
apiVersion: rbac.authorization.k8s.io/v1beta1
metadata:
  namespace: dev
  name: authorization-role
rules:
- apiGroups: [""]	# 支持的API组列表，""空字符串，表示核心API群
  resources: ["pods"]	# 支持的资源对象列表
  verbs: ["get", "watch", "list"]	# 允许对资源对象的操作方法列表
```

```yaml
# ClusterRole可以对集群范围内资源、跨namespaces的范围资源、非资源类型进行授权
kind: ClusterRole
apiVersion: rbac.authorization.k8s.io/v1beta1
metadata:
  name: authorization-clusterrole
rules:
- apiGroups: [""]
  resources: ["pods"]
  verbs: ["get", "watch", "list"]
```

需要详细说明的是，rules中的参数

* apiGroups：支持的API组列表

  ```bash
  "", "apps", "autoscaling", "batch"
  ```

* resources：支持的资源对象列表

  ```bash
  "services", "endpoints", "pods", "secrets", "configmaps", "crontabs", "deployments", "jobs", "nodes", "rolebindings", "clusterroles", "daemonsets", "replicasets", "statefulsets", "horizontalpodautoscalers", "replicationcontrollers", "cronjobs"
  ```

* verbs：对资源对象的操作方法列表

  ```bash
  "get", "list", "watch", "create", "update", "patch", "delete", "exec"
  ```

**RoleBinding、ClusterRoleBinding**

角色绑定用来把一个角色绑定到一个目标对象上，绑定目标可以是User、Group或者ServiceAccount

```yaml
# RoleBinding可以将同一namespace中的subject绑定到某个Role下，则此subject即具有该Role定义的权限
kind: RoleBinding
apiVersion: rbac.authorization.k8s.io/v1beta1
metadata:
  name: authorization-role-binding
  namespace: dev
subjects:
- kind: User
  name: tonkyshan
  apiGroup: rbac.authorization.k8s.io
roleRef:
  kind: Role
  name: authorization-role
  apiGroup: rbac.authorization.k8s.io
```

```yaml
# ClusterRoleBinding在整个集群级别和所有namespaces将特定的subject与ClusterRole绑定，授予权限
kind: ClusterRoleBinding
apiVersion: rbac.authorization.k8s.io/v1beta1
metadata:
  name: authorization-clusterrole-binding
subjects:
- kind: User
  name: tonkyshan
  apiGroup: rbac.authorization.k8s.io
roleRef:
  kind: ClusterRole
  name: authorization-clusterrole
  apiGroup: rbac.authorization.k8s.io
```

**RoleBinding引用ClusterRole进行授权**

RoleBinding可以引用ClusterRole，对属于同一命名空间内ClusterRole定义的资源主体进行授权

一种很常用的做法就是，集群管理员为集群范围预定义好一组角色(ClusterRole)，然后在多个命名空间中重复使用这些ClusterRole，这样可以大幅提高授权管理工作效率，也使得各个命名空间下的基础性授权规则与使用体验保持一致

```yaml
# 虽然authorization-clusterrole是一个集群角色，但是因为使用了RoleBinding
# 所以tonkyshan只能读取dev命名空间中的资源
kind: RoleBinding
apiVersion: rbac.authorization.k8s.io/v1beta1
metadata:
  name: authorization-role-binding-ns
  namespace: dev
subjects:
- kind: User
  name: tonkyshan
  apiGroup: rbac.authorization.k8s.io
roleRef:
  kind: ClusterRole
  name: authorization-clusterrole
  apiGroup: rbac.authorization.k8s.io
```

**案例：创建一个只能管了dev空间下Pods资源的账号**

1、创建账号

```powershell
# 创建证书
[root@master ~]# cd /etc/kubernetes/pki/
[root@master pki]# (umask 077;openssl genrsa -out devman.key 2048)
Generating RSA private key, 2048 bit long modulus
........+++
...............................................+++
e is 65537 (0x10001)

# 用apiserver的证书去签署
# 签名申请，申请的用户是devman，组是devgroup
[root@master pki]# openssl req -new -key devman.key -out devman.csr -subj "/CN=devman/O=devgroup"
# 签署证书
[root@master pki]# openssl x509 -req -in devman.csr -CA ca.crt -CAkey ca.key -CAcreateserial -out devman.crt -days 3650
Signature ok
subject=/CN=devman/O=devgroup
Getting CA Private Key

# 设置集群、用户、上下文信息
[root@master pki]# kubectl config set-cluster kubernetes --embed-certs=true --certificate-authority=/etc/kubernetes/pki/ca.crt --server=https://172.16.140.133:6443
Cluster "kubernetes" set.

[root@master pki]# kubectl config set-credentials devman --embed-certs=true --client-certificate=/etc/kubernetes/pki/devman.crt --client-key=/etc/kubernetes/pki/devman.key
User "devman" set.

[root@master pki]# kubectl config set-context devman@kubernetes --cluster=kubernetes --user=devman
Context "devman@kubernetes" created.

# 切换账户到devman
[root@master pki]# kubectl config use-context devman@kubernetes
Switched to context "devman@kubernetes".

# 查看dev下pod，发现没有权限
[root@master pki]# kubectl get pods -n dev
Error from server (Forbidden): pods is forbidden: User "devman" cannot list resource "pods" in API group "" in the namespace "dev"

# 切换到admin账户
[root@master pki]# kubectl config use-context kubernetes-admin@kubernetes
Switched to context "kubernetes-admin@kubernetes".
```

2、创建Role和RoleBinding，为devman用户授权

dev-role.yaml

```yaml
kind: Role
apiVersion: rbac.authorization.k8s.io/v1beta1
metadata:
  namespace: dev
  name: dev-role
rules:
- apiGroups: [""]
  resources: ["pods"]
  verbs: ["get", "watch", "list"]
  
---

kind: RoleBinding
apiVersion: rbac.authorization.k8s.io/v1beta1
metadata:
  name: authorization-role-binding
  namespace: dev
subjects:
- kind: User
  name: devman
  apiGroup: rbac.authorization.k8s.io
roleRef:
  kind: Role
  name: dev-role
  apiGroup: rbac.authorization.k8s.io
```

```powershell
# 创建
[root@master pki]# kubectl create -f dev-role.yaml
role.rbac.authorization.k8s.io/dev-role created
rolebinding.rbac.authorization.k8s.io/authorization-role-binding created
```

3、切换账户，再次验证

```powershell
# 切换回devman账户
[root@master pki]# kubectl config use-context devman@kubernetes
Switched to context "devman@kubernetes".

# 查看dev下pod，发现有权限
[root@master pki]# kubectl get pods -n dev
NAME                                 READY   STATUS    RESTARTS   AGE
nginx-deployment-64f4b88b45-b9xh8    1/1     Running   0          36h
nginx-deployment-64f4b88b45-f8k4h    1/1     Running   0          36h
nginx-deployment-64f4b88b45-wkfgl    1/1     Running   0          36h
pod-configmap                        1/1     Running   0          14h
pod-secret                           1/1     Running   0          13h
pod1                                 1/1     Running   0          15h
pod2                                 1/1     Running   0          15h
tomcat-deployment-8465bd78b8-vtdrs   1/1     Running   0          36h
tomcat-deployment-8465bd78b8-wnb4s   1/1     Running   0          36h
tomcat-deployment-8465bd78b8-wzp8c   1/1     Running   0          36h
volume-emptydir                      2/2     Running   0          34h
volume-nfs                           2/2     Running   0          23h

# 查看dev下的deployment，发现没有权限，因为只加了pod
[root@master pki]# kubectl get deployment -n dev
Error from server (Forbidden): deployments.apps is forbidden: User "devman" cannot list resource "deployments" in API group "apps" in the namespace "dev"

# 切回admin账户
[root@master pki]# kubectl config use-context kubernetes-admin@kubernetes
Switched to context "kubernetes-admin@kubernetes".
```

----

### 9.4 准入控制

---

通过了签名的认证和授权之后，还需要经过准入控制处理通过之后，apiserver才会处理这个请求

准入控制是一个可配置的控制器列表，可以通过在Api-Server上通过命令行设置选择执行哪些准入控制器：

```markdown
--admission-control=NamespaceLifecycle,LimitRanger,ServiceAccount,PresistentVolumeLabel,
DefaultStorageClass,ResourceQuota,DefaultTolerationSeconds
```

只有当所以当准入控制器都检查通过后，apiserver才执行该请求，否则返回拒绝

当前可配置的Admission Control准入控制如下：

* AlwaysAdmit：允许所有请求
* AlwaysDeny：禁止所有请求，一般用于测试
* AlwaysPullImages：在启动容器之前总去下载镜像
* DenyExecOnPrivileged：它回拦截所有想在Privileged Container上执行命令的请求
* ImagePolicyWebhook：这个插件将允许后端的一个Webhook程序来完成admission controller的功能
* Service Account：实现ServiceAccount实现了自动化
* SecurityContextDeny：这个插件将使用SecurityContext的Pod中的定义全部失效
* ResourceQuota：用于资源配额管理目的，观察所有请求，确保在namespace上的配额不会超标
* LimitRanger：用于资源限制管理，作用于namespace上，确保对Pod进行资源限制
* InitialResources：为未设置资源请求与限制的Pod，根据其镜像的历史资源的使用情况进行设置
* NamespaceLifecycle：如果尝试在一个不存在的namespace中创建资源对象，则该创建请求将被拒绝，当删除一个namespace时，系统将会删除该namespace中所有对象
* DefaultStorageClass：为了实现共享存储的动态供应，为未指定StorageClass或PV的PVC尝试匹配默认的StorageClass，尽可能减少用户在申请PVC时所需了解的后端存储细节
* DefaultTolerationSeconds：这个插件为那些没有设置forgiveness tolerations并具有notready:NoExecute和unreachable:NoExecute两种taints的Pod设置默认的"容忍"时间，为5min
* PodSecurityPolicy：这个插件用于在创建或修改Pod时决定是否根据Pod的security context和可用的PodSecurityPolicy对Pod的安全策略进行控制

---

## 第十章 DashBoard

----

之前在kubernetes中完成的所有操作都是通过命令行工具kubectl完成的，其实，为了提供更丰富的用户体验，kubernetes还开发了一个基于web的用户界面(Dashboard)，用户可以使用Dashboard部署容器化的应用，还可以监控应用的状态，执行故障排查以及管理kubernetes中各种资源

---

### 10.1 部署Dashboard

---

1、下载yaml，并运行Dashboard

```powershell
# 下载yaml，这个下载下来是html
# https://tonkyshan.cn/files/recommended.yaml 可以获取
[root@master ~]# wget https://raw.githubsercontent.com/kubernetes/dashboard/v2.0.0/aio/deploy/recommended.yaml

# 修改kubernetes-dashboard的Service类型
kind: Service
apiVersion: v1
metadata:
  labels:
    k8s-app: kubernetes-dashboard
  name: kubernetes-dashboard
  namespace: kubernetes-dashboard
spec:
  type: NodePort	# 新增
  ports:
    - port: 443
      targetPort: 8443
      nodePort: 30009	# 新增
  selector:
    k8s-app: kubernetes-dashboard
    
# 部署
[root@master ~]# kubectl create -f recommended.yaml
namespace/kubernetes-dashboard created
serviceaccount/kubernetes-dashboard created
service/kubernetes-dashboard created
secret/kubernetes-dashboard-certs created
secret/kubernetes-dashboard-csrf created
secret/kubernetes-dashboard-key-holder created
configmap/kubernetes-dashboard-settings created
role.rbac.authorization.k8s.io/kubernetes-dashboard created
clusterrole.rbac.authorization.k8s.io/kubernetes-dashboard created
rolebinding.rbac.authorization.k8s.io/kubernetes-dashboard created
clusterrolebinding.rbac.authorization.k8s.io/kubernetes-dashboard created
deployment.apps/kubernetes-dashboard created
service/dashboard-metrics-scraper created
deployment.apps/dashboard-metrics-scraper created

# 查看namespace下的kubernetes-dashboard下的资源
[root@master ~]# kubectl get pod,svc -n kubernetes-dashboard
NAME                                             READY   STATUS    RESTARTS   AGE
pod/dashboard-metrics-scraper-6d4b97cd99-5xkhf   1/1     Running   0          32s
pod/kubernetes-dashboard-7bbd549fd5-ndk8x        1/1     Running   0          32s

NAME                                TYPE        CLUSTER-IP      EXTERNAL-IP   PORT(S)         AGE
service/dashboard-metrics-scraper   ClusterIP   10.111.70.148   <none>        8000/TCP        32s
service/kubernetes-dashboard        NodePort    10.106.200.76   <none>        443:30009/TCP   32s
```

2、创建访问账户，获取token

```powershell
# 创建账号
[root@master ~]# kubectl create serviceaccount dashboard-admin -n kubernetes-dashboard
serviceaccount/dashboard-admin created

# 授权
[root@master ~]# kubectl create clusterrolebinding dashboard-admin-rb --clusterrole=cluster-admin --serviceaccount=kubernetes-dashboard:dashboard-admin
clusterrolebinding.rbac.authorization.k8s.io/dashboard-admin-rb created

# 获取账号token
[root@master ~]# kubectl get secrets -n kubernetes-dashboard | grep dashboard-admin
dashboard-admin-token-bvlhs        kubernetes.io/service-account-token   3      2m20s
[root@master ~]# kubectl describe secrets dashboard-admin-token-bvlhs -n kubernetes-dashboard
Name:         dashboard-admin-token-bvlhs
Namespace:    kubernetes-dashboard
Labels:       <none>
Annotations:  kubernetes.io/service-account.name: dashboard-admin
              kubernetes.io/service-account.uid: 0267427a-1822-4b60-ae88-3e0b7b6114c9

Type:  kubernetes.io/service-account-token

Data
====
ca.crt:     1025 bytes
namespace:  20 bytes
token:      eyJhbGciOiJSUzI1NiIsImtpZCI6ImZlbmhfZXM5UDJybjZRQmFfMnc4Ry00a0hfbm52TmRZRGt1VlA0VVBObjQifQ.eyJpc3MiOiJrdWJlcm5ldGVzL3NlcnZpY2VhY2NvdW50Iiwia3ViZXJuZXRlcy5pby9zZXJ2aWNlYWNjb3VudC9uYW1lc3BhY2UiOiJrdWJlcm5ldGVzLWRhc2hib2FyZCIsImt1YmVybmV0ZXMuaW8vc2VydmljZWFjY291bnQvc2VjcmV0Lm5hbWUiOiJkYXNoYm9hcmQtYWRtaW4tdG9rZW4tYnZsaHMiLCJrdWJlcm5ldGVzLmlvL3NlcnZpY2VhY2NvdW50L3NlcnZpY2UtYWNjb3VudC5uYW1lIjoiZGFzaGJvYXJkLWFkbWluIiwia3ViZXJuZXRlcy5pby9zZXJ2aWNlYWNjb3VudC9zZXJ2aWNlLWFjY291bnQudWlkIjoiMDI2NzQyN2EtMTgyMi00YjYwLWFlODgtM2UwYjdiNjExNGM5Iiwic3ViIjoic3lzdGVtOnNlcnZpY2VhY2NvdW50Omt1YmVybmV0ZXMtZGFzaGJvYXJkOmRhc2hib2FyZC1hZG1pbiJ9.lzTINDRI-0NNVmOl7KTf6jEpOeRPGzj06h_0F1uj8c1fy0aatOOUjjZjxwQY2mrknPFb1sORuXaS7TAZsgORskcKuc90kdyW8jiAbcjWgOnYXOvQHUzelN8DZ4fboUFNiDjG9-rruCIS5i5tito-qcCJ3bIlKmC7t2eqftkgrFWGZUdHTXeOk-O3LviCCsSeTwSNC9DO0J_qlKpEK58w_hSP6Sb7fkUIxknMM7fvFvynI_heacOs2ErA5_cLmus9b-NINB1655N_X7uohM8FgqrGxsWCkfSjabMX9cZJkR_m7t7NFa6RcyPX0I5uONiFrDh0SLy0Z-KJ0CJpNyLgjw

# 访问https://172.16.140.133:30009 有的浏览器会报Your connection is not private
# 直接在空白部分 键盘键入 thisisunsafe 就可以进入了 ～～真是直接敲～～
```

<img src="https://tonkyshan.cn/img/20250116164148.png" alt="Dashboard" />

---

> 2025.01.16	完结撒花～
