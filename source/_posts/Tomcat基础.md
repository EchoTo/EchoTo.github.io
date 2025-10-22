---
title: Tomcat基础
date: 2022-04-02 19:01:37
tags: Tomcat
categories: JavaWeb
---

## Tomcat基础

-------

## 第一章   概述

-----

* 服务器：安装了服务器软件的计算机

* 服务器软件：接收用户的请求，处理请求，做出响应

* 在Web服务器软件中，可以部署web项目，让用户通过浏览器来访问这些项目

  **web容器**

常见的java相关的web服务器软件：

* webLogic：oracle公司，大型的JavaEE服务器，支持所有的JavaEE规范，是收费的
* webSphere：IBM公司，同上
* JBOSS：JBOSS公司的，同上
* Tomcat：Apache基金组织，中小型的JavaEE服务器，仅仅支持少量的JavaEE规范的servlet/jsp。开源免费

JavaEE：Java语言在企业级开发中使用的技术规范的总和，一共规定了13项大的规范。

--------

## 第二章   使用

-----

### 2.1部署项目方式

-----

1.直接将项目放到webapps目录下即可。

* localhost/项目目录名称/资源文件名称 --->虚拟目录

* 简化部署：将项目打成一个war包，再将war包放置到webapps目录下，war包会自动解压缩

2.配置conf/ server.xml文件

* 在`<Host>`标签体中配置
  `<context docBase="" path=""/>`
* docBase：项目存放的路径
* path：虚拟目录

3.在`conf\catalina\localhost`创建任意名称的xml文件。

* 在文件中编写`<context docBase="path"/>`
* 虚拟目录：xml文件的名称

-------

### 2.2动态java项目目录结构

----

---项目的根目录

   ---WEB-INF目录：

​      ---web.xml：web项目的核心配置文件

​      ---classes目录：放置字节码文件的目录

​      ---lib目录：放置依赖的jar包
