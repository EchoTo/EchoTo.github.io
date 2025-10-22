---
title: OpenShift
date: 2025-03-17 15:07:00
tags: [OpenShift, Docker, K8s]
categories: [OpenShift]
---

## 第一章 OpenShift概述

----

### 1.1 概述

---

* Red Hat OpenShift Container Platform 基于kubernetes容器基础架构构建
* 增添了：远程管理、租户、安全性增强、监控与审计、应用生命周期管理和自服务接口等
* 是一个生产用的PaaS平台
* RHOCP v4开始，集群中所有主机均采用CoreOS作为底层操作系统

OpenShift功能

* 集成式开发流：OCP内置registry、CI/CD管道和S2I功能
* 路由：向外界发布service
* Metrics和日志记录：包含内置自我分析metrics服务和聚合日志记录(EKF)
* 统一UI：OC命令和Web Console

```powershell
[root@redhat1 ~]# podman images
REPOSITORY                           TAG         IMAGE ID      CREATED     SIZE
registry.access.redhat.com/ubi9/ubi  latest      a87631f6cdda  4 days ago  251 MB

[root@redhat1 ~]# podman run registry.access.redhat.com/ubi9/ubi:latest echo "Hello World!"
Hello World!

[root@redhat1 ~]# podman run -d -p 8080 registry.access.redhat.com/ubi9/ubi:latest
```

----

## 第二章 搭建OpenShift

---

### 2.1 资源规划

---

|  作用  |     IP地址     |          操作系统          |         配置          |
| :----: | :------------: | :------------------------: | :-------------------: |
| Master | 172.16.140.133 | Centos7.9   基础设施服务器 | 2颗CPU 2G内存 50G硬盘 |
| Node1  | 172.16.140.135 | Centos7.9   基础设施服务器 | 2颗CPU 2G内存 50G硬盘 |
| Node2  | 172.16.140.134 | Centos7.9   基础设施服务器 | 2颗CPU 2G内存 50G硬盘 |

---

### 2.2 安装过程

---

#### 2.2.1 前期配置

开启所有节点的SELinux(所有主机执行)

```powershell
[root@master ~]# grep -v ^# /etc/selinux/config | grep -v ^$
SELINUX=enforcing
SELINUXTYPE=targeted
```

所有节点关闭防火墙(所有主机执行)

```powershell
[root@master ~]# systemctl stop firewalld && systemctl disable firewalld
```

#### 2.2.2 安装依赖包

安装OpenShift依赖的软件包(所有主机执行)

```powershell
[root@master ~]# yum -y install wget git net-tools bind-utils iptables-services bridge-utils bash-completion kexec-tools sos psacct bash-completion.noarch python-passlib NetworkManager vim
```

安装docker(所有主机执行)

```powershell
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

配置Docker镜像仓库(所有主机执行)

```powershell
# 可以搭建私服，挂🪜把镜像推上去
[root@master ~]# less /etc/docker/daemon.json
{
        "exec-opts": ["native.cgroupdriver=systemd"],
        "registry-mirrors": ["https://kn0t2bca.mirror.aliyuncs.com"],
        "insecure-registries" : ["47.93.22.25:5000"]
}

# 重启docker使配置生效
[root@master ~]# systemctl daemon-reload && systemctl restart docker && systemctl enable docker
```

Master主机上安装Ansible(自动化运维工具)

```powershell
[root@master ~]# yum -y install epel-release
[root@master ~]# yum -y install centos-release-ansible-28.noarch
[root@master ~]# yum list ansible --showduplicates
已加载插件：fastestmirror, langpacks
Loading mirror speeds from cached hostfile
 * epel: d2lzkl7pfhq30w.cloudfront.net
可安装的软件包
ansible.noarch                                                                2.8.5-1.el7                                                                 epel
[root@master ~]# yum -y install ansible-2.8.5

# 查看ansible版本
[root@master ~]# ansible --version
ansible 2.8.5
  config file = /etc/ansible/ansible.cfg
  configured module search path = [u'/root/.ansible/plugins/modules', u'/usr/share/ansible/plugins/modules']
  ansible python module location = /usr/lib/python2.7/site-packages/ansible
  executable location = /usr/bin/ansible
  python version = 2.7.5 (default, Oct 14 2020, 14:56:59) [GCC 4.8.5 20150623 (Red Hat 4.8.5-44)]
```

#### 2.2.3 安装/配置 OpenShift

Master主机上下载安装`openshift-ansible-3.11.764-1.tar.gz`

下载安装包，解压后文件夹重命名

```powershell
#下载链接
# https://tonkyshan.cn/files/openshift-ansible-3.11.764-1.tar.gz
[root@master ~]# tar -zxvf openshift-ansible-openshift-ansible-3.11.764-1.tar.gz
[root@master ~]# mv openshift-ansible-openshift-ansible-3.11.764-1/  openshift-ansible
```

```powershell
# 修改内容如下
[OSEv3:children]
masters
nodes
etcd

[OSEv3:vars]
ansible_ssh_user=root
# 使用origin社区版
openshift_deployment_type=origin
deployment_type=origin
# 指定安装版本
openshift_release=v3.11
# 指定默认域名,访问时需要使用该域名,无dns服务器时需要手动添加本地hosts文件
openshift_master_default_subdomain=tonkyshan.cn
# 禁止磁盘、内存、镜像的检查
openshift_disable_check=disk_availability,docker_storage,memory_availability
# disk_availability: 报错信息是推荐的master磁盘空间剩余量大于40GB。测试环境无法满足;跳过检测
# memory_availability: 报错信息是推荐的master内存为16GB;node内存为8GB;测试环境无法满足;跳过检测
# docker_image_availability: 报错信息是需要的几个镜像未找到;选择跳过;装完集群后;在使用的时候再自行下载
# docker_storage: 报错信息是推荐选择一块磁盘空间存储镜像;这里选择跳过。采用docker默认的方式存储镜像
openshift_master_identity_providers=[{'name': 'htpasswd_auth', 'login': 'true', 'challenge': 'true', 'kind': 'HTPasswdPasswordIdentityProvider'}]
openshift_master_htpasswd_file=/etc/origin/master/htpasswd
# ntp时间同步
openshift_clock_enabled=true
# 节点配额
openshift_node_groups.edits={'pods-per-core': ['10']}
# 主机组
[masters]
master openshift_schedulable=True
# 节点的主机组,包含region和infra
[nodes]
master openshift_node_groups.labels="{'region': 'infra'}"
node1 openshift_node_groups.labels="{'region': 'infra', 'zone': 'default'}"
node2 openshift_node_groups.labels="{'region': 'infra', 'zone': 'default'}"
master openshift_node_group_name='node-config-master'
node1 openshift_node_group_name='node-config-compute'
node2 openshift_node_group_name='node-config-compute'

# 至少有一个节点需要是node-config-infra
node2 openshift_node_group_name='node-config-infra'

[etcd]
master
```

部署前检测

