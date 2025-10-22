---
title: SpringBoot——开发篇
date: 2023-06-24 15:06:53
tags: [SpringBoot,java]
categories: [SpringBoot,java]
---

## SpringBoot——开发篇

-------

## 第一章 开发

-----

### 1.1热部署

-------

#### 手动启动热部署

* 开启开发者工具

```xml
<dependency>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-devtools</artifactId>
    <optional>true</optional>
</dependency>
```

* 激活热部署：构建项目 **Ctrl + F9**

**关于热部署**

* 重启(Restart)：自定义开发代码，包含类、页面、配置文件等，加载位置restart类加载器
* 重载(ReLoad)：jar包，加载位置base类加载器

第一次启动有Restart也有ReLoad，热部署只有Restart

#### 自动启动热部署

一、勾选Build project automatically

![20230224112421](https://tonkyshan.cn/img/20230224112421.png)

二、勾选Allow auto-make to start ...

![20230224113030](https://tonkyshan.cn/img/20230224113030.png)

激活方式：IDEA失去焦点5秒后启动热部署

#### 热部署范围配置

默认不触发重启的目录

* /META-INF/maven
* /META-INF/resources
* /resources
* /static
* /public
* /templates

通过配置文件配置范围

```yaml
devtools:
  restart:
    exclude: public/**,...
```

#### 关闭热部署

![20230301081745](https://tonkyshan.cn/img/20230301081745.png)

**通过配置文件**

```yaml
devtools:
  restart:
    enabled: false
```

弊端：可能被覆盖

**通过系统配置**

设置高优先级属性禁用热部署

```java
package com.priv;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

@SpringBootApplication
public class SpringBoot01DeployApplication {

    public static void main(String[] args) {
        System.setProperty("spring.devtools.restart,enabled","false");
        SpringApplication.run(SpringBoot01DeployApplication.class, args);
    }

}
```

--------

### 1.2配置高级

-----------

#### @ConfigurationProperties

* 使用@ConfigurationProperties为第三方bean绑定属性

```java
@Bean
@ConfigurationProperties(prefix = "datasource")
public DruidDataSource dataSource(){
    DruidDataSource ds = new DruidDataSource();
    return ds;
}
```

```yaml
datasource:
  driverClassName: com.mysql.cj.jdbc.Driver
```

**@EnableConfigurationProperties(ServerConfig.class)**

开启属性绑定，并设置对应的目标

tips：@EnableConfigurationProperties和@Component不能同时使用，会匹配到两个bean对象

#### 宽松绑定/松散绑定

@ConfigurationProperties绑定属性支持属性名宽松绑定

绑定前缀名命名规范：仅能使用纯小写字母、数字、下划线作为合法的字符

@Value不支持

#### 常用计量单位绑定

* SpringBoot支持JDK8提供的时间与空间计量单位

```java
@Component
@Data
@ConfigurationProperties(prefix = "servers")
public class ServerConfig{
    private String ipAddress;
    private int port;
    private long timeout;
    @DurationUnit(ChronoUnit.MINUTES)
    private Duration serverTimeOut;
    @DataSizeUnit(DataUnit.MEGABYTES)
    private DataSize dataSize;
}
```

#### 数据校验

* 开启数据校验有助于系统安全性，J2EE规范中JSR303规范定义了一组有关数据校验相关的API

```xml
<!--导入JSR303规范API-->
<dependency>
    <groupId>javax.validation</groupId>
    <artifactId>validation-api</artifactId>
</dependency>
<!--使用hibernate框架提供的校验器做实现类-->
<dependency>
    <groupId>org.hibernate.validator</groupId>
    <artifactId>hibernate-validator</artifactId>
</dependency>
```

开启 @Validated

```java
@Max(value = 8888, message = "最大值不能超过8888")
@Min(value = 101, message = "最小值不能低于101")
```

tips：注意yaml文件中对于数字的定义支持进制书写格式，如需使用字符串请使用引号明确标注

------------

### 1.3测试

-----------

**加载测试专用属性**

properties属性可以为当前测试用例添加临时属性配置

args属性可以为当前测试用例添加临时命令行参数

```java
//@SpringBootTest(properties = {"test.prop = testValue1"})
@SpringBootTest(args = {"--test.prop = testValue2"})
public class PropertiesAndArgsTest{
	@Value("${test.prop}")
    private String msg;
    
    @Test
    void testProperties(){
        System.out.println(msg);
    }
}
```

如果都开启，args覆盖properties

加载测试临时属性应用于小范围测试环境

**加载测试专用配置**

使用@Import注解加载当前测试类专用的配置

**测试类中启动web环境**

webEnvironment

@SpringBootTest(webEnvironment = SpringBootTest.WebEnvironment.RANDOM_PORT)

随机端口启动

其他：MOCK，DEFINED_PORT，NONE

--------

### 1.4数据层解决方案

--------------

**发送虚拟请求**

开启虚拟MVC调用

@AutoConfigureMockMvc

![20230623161848](https://tonkyshan.cn/img/20230623161848.png)

**匹配响应执行状态**

![20230623162251](https://tonkyshan.cn/img/20230623162251.png)

**匹配响应体**

![20230623162419](https://tonkyshan.cn/img/20230623162419.png)

**匹配响应体（json）**

![20230623162612](https://tonkyshan.cn/img/20230623162612.png)

**匹配响应头**

![20230623162712](https://tonkyshan.cn/img/20230623162712.png)

**业务层测试数据回滚**

@Transactional

想提交事务，再加@Rollback(false)

**测试用例数据设定**

![20230624142617](https://tonkyshan.cn/img/20230624142617.png)

-----------

### 1.5数据层解决方案

------

**SQL**

选型

```
Druid + MyBatis-Plus + MySQL
```

* 数据源：DruidDataSource
* 持久化技术：MyBatis-Plus / MyBatis
* 数据库：MySQL

**数据源解决方案——HiKari**

 SpringBoot提供了三种内嵌的数据源对象

* HiKaiCP：默认内置数据源对象
* Tomcat提供DataSource：HiKaiCP不可用的情况下，且在Web环境中，将使用tomcat服务器配置的数据源对象
* Commons DBCP：HiKaiCP和tomcat数据源均不可用的情况下，将使用dbcp数据源

**内置持久化解决方案——JdbcTemplate**

![20230624144225](https://tonkyshan.cn/img/20230624144225.png)

**内嵌数据库——H2**

 SpringBoot提供了三种内嵌的数据库

* H2
* HSQL
* Derby

都可以在内存里运行，都是用java写的

![20230624144620](https://tonkyshan.cn/img/20230624144620.png)

* 设置当前项目为Web工程，并配置H2管理控制台参数

```yaml
server:
  port : 80
spring:
  h2:
    console:
      path: /h2
      enabled: true
```

* 访问用户名sa，默认密码123456

H2数据库控制台仅用于开发阶段，上线项目务必关闭控制台功能

**NOSQL**

[**Redis**](https://tonkyshan.cn/2022/04/02/Redis/)

jedis和lettuce(默认)：都是连接redis的客户端

一、导入jedis坐标

```xml
<dependency>
    <groupId>redis.clients</groupId>
    <artifactId>jedis</artifactId>
</dependency>
```

二、配置客户端

配置client-type: jedis

![20230624150141](https://tonkyshan.cn/img/20230624150141.png)

**Mongodb**

Mongodb是一个开源、高性能、无模式的文档型数据库，NoSQL数据库产品的一种，是最像关系型数据库的非关系型数据库

具体内容在微服务及分布式中介绍
