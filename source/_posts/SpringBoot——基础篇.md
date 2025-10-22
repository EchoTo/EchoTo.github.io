---
title: SpringBoot——基础篇
date: 2023-01-19 11:55:02
tags: [SpringBoot,java]
categories: [SpringBoot,java]
---

## SpringBoot——基础篇

-------

## 第一章   基础

-------

### 1.1快速上手SpringBoot

---------

#### 1.1.1SpringBoot入门程序开发

SpringBoot是由Pivotal团队提供的全新框架，其设计目的是用来简化Spring应用的**初始搭建**以及**开发过程**

一、IDEA创建SpringBoot项目

**开发控制器类**

```java
package com.priv.controller;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

/**
 * @author : 十一
 * @data : 13:39 2022/12/29
 * When in doubt, use brute force.
 * Rest模式
 */
@RestController
@RequestMapping("/books")
public class BookController {

    @GetMapping
    public String getById(){
        System.out.println("springboot is running...");
        return "springboot is running...";
    }
}
```

**运行自动生成的Application类**

* 最简SpringBoot程序所包含的基础文件
  * pom.xml文件
  * Application类

<img src="../../../imgs/20221229134727.png" alt="20221229134727" style="zoom:67%;" />

二、通过SpringBoot官网

选择Quickstart Your Project 创建工程，保存项目，解压，通过IDE导入项目

三、阿里云

https://start.aliyun.com/

四、手动创建

* 手工导入坐标

<img src="https://tonkyshan.cn/img/20221230182009.png" alt="20221230182009" style="zoom:50%;" />

* 手工制作引导类

<img src="https://tonkyshan.cn/img/20221230182117.png" alt="20221230182117" style="zoom:67%;" />

---------

#### 1.1.2浅谈入门程序工作原理

Spring程序缺点：

* 依赖设置繁琐
* 配置繁琐

SpringBoot程序优点：

* 起步依赖(简化依赖配置)
* 自动配置(简化常用工程相关配置)
* 辅助功能(内置服务器，...)

**一、parent**

继承parent模块可以避免多个依赖使用相同技术时出现依赖版本冲突

```xml
<parent>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-starter-parent</artifactId>
    <version>2.6.11</version>
    <relativePath/> <!-- lookup parent from repository -->
</parent>
```

spring-boot-starter-parent继承了spring-boot-dependencies

```xml
<parent>
  <groupId>org.springframework.boot</groupId>
  <artifactId>spring-boot-dependencies</artifactId>
  <version>2.6.11</version>
</parent>
```

spring-boot-dependencies里定义了一系列

```xml
<properties>
  <activemq.version>5.16.5</activemq.version>
  <antlr2.version>2.7.7</antlr2.version>
  <appengine-sdk.version>1.9.98</appengine-sdk.version>
  <artemis.version>2.19.1</artemis.version>
  <aspectj.version>1.9.7</aspectj.version>
  <assertj.version>3.21.0</assertj.version>
  <atomikos.version>4.0.6</atomikos.version>
  <awaitility.version>4.1.1</awaitility.version>
  <build-helper-maven-plugin.version>3.2.0</build-helper-maven-plugin.version>
  <byte-buddy.version>1.11.22</byte-buddy.version>
  <caffeine.version>2.9.3</caffeine.version>
  <cassandra-driver.version>4.13.0</cassandra-driver.version>
  <classmate.version>1.5.1</classmate.version>
  .........................
</properties>
<dependencyManagement>
  <dependencies>
    <dependency>
      <groupId>org.apache.activemq</groupId>
      <artifactId>activemq-amqp</artifactId>
      <version>${activemq.version}</version>
    </dependency>
    <dependency>
      <groupId>org.apache.activemq</groupId>
      <artifactId>activemq-blueprint</artifactId>
      <version>${activemq.version}</version>
    </dependency>
    <dependency>
      <groupId>org.apache.activemq</groupId>
      <artifactId>activemq-broker</artifactId>
      <version>${activemq.version}</version>
    </dependency>
    <dependency>
      <groupId>org.apache.activemq</groupId>
      <artifactId>activemq-camel</artifactId>
      <version>${activemq.version}</version>
    </dependency>
    <dependency>
      <groupId>org.apache.activemq</groupId>
      <artifactId>activemq-client</artifactId>
      <version>${activemq.version}</version>
    </dependency>
    <dependency>
      <groupId>org.apache.activemq</groupId>
      <artifactId>activemq-console</artifactId>
      <version>${activemq.version}</version>
      <exclusions>
        <exclusion>
          <groupId>commons-logging</groupId>
          <artifactId>commons-logging</artifactId>
        </exclusion>
      </exclusions>
    </dependency>
    <dependency>
      <groupId>org.apache.activemq</groupId>
      <artifactId>activemq-http</artifactId>
      <version>${activemq.version}</version>
    </dependency>
    <dependency>
      <groupId>org.apache.activemq</groupId>
      <artifactId>activemq-jaas</artifactId>
      <version>${activemq.version}</version>
    </dependency>
    <dependency>
      <groupId>org.apache.activemq</groupId>
      <artifactId>activemq-jdbc-store</artifactId>
      <version>${activemq.version}</version>
    </dependency>
    <dependency>
      <groupId>org.apache.activemq</groupId>
      <artifactId>activemq-jms-pool</artifactId>
      <version>${activemq.version}</version>
    </dependency>
    <dependency>
      <groupId>org.apache.activemq</groupId>
      <artifactId>activemq-kahadb-store</artifactId>
      <version>${activemq.version}</version>
    </dependency>
    <dependency>
      <groupId>org.apache.activemq</groupId>
      <artifactId>activemq-karaf</artifactId>
      <version>${activemq.version}</version>
    </dependency>
    <dependency>
      <groupId>org.apache.activemq</groupId>
      <artifactId>activemq-leveldb-store</artifactId>
      <version>${activemq.version}</version>
      <exclusions>
        <exclusion>
          <groupId>commons-logging</groupId>
          <artifactId>commons-logging</artifactId>
        </exclusion>
      </exclusions>
    </dependency>
    ........................
  </dependencies>
</dependencyManagement>
```

**二、starter**

包含了若干个坐标定义的pom管理文件

* SpringBoot中常见项目名称，定义了当前项目使用的所有依赖坐标，以达到**减少依赖配置**的目的

```xml
<dependencies>
    <dependency>
        <groupId>org.springframework.boot</groupId>
        <artifactId>spring-boot-starter-web</artifactId>
    </dependency>

    <dependency>
        <groupId>org.springframework.boot</groupId>
        <artifactId>spring-boot-starter-test</artifactId>
        <scope>test</scope>
    </dependency>
</dependencies>
```

spring-boot-starter-web里面导入了很多dependency

```xml
<dependencies>
  <dependency>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-starter</artifactId>
    <version>2.6.11</version>
    <scope>compile</scope>
  </dependency>
  <dependency>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-starter-json</artifactId>
    <version>2.6.11</version>
    <scope>compile</scope>
  </dependency>
  <dependency>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-starter-tomcat</artifactId>
    <version>2.6.11</version>
    <scope>compile</scope>
  </dependency>
  <dependency>
    <groupId>org.springframework</groupId>
    <artifactId>spring-web</artifactId>
    <version>5.3.22</version>
    <scope>compile</scope>
  </dependency>
  <dependency>
    <groupId>org.springframework</groupId>
    <artifactId>spring-webmvc</artifactId>
    <version>5.3.22</version>
    <scope>compile</scope>
  </dependency>
</dependencies>
```

**三、引导类**

```java
package com.priv;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

/**
 * @author 十一
 */
@SpringBootApplication
public class SpringBoot0101QuickstartApplication {

    public static void main(String[] args) {
        SpringApplication.run(SpringBoot0101QuickstartApplication.class, args);
    }

}
```

启动一个Spring容器

* SpringBoot的引导类是Boot工程的执行入口，运行main方法就可以启动项目
* SpringBoot工程运行后初始化Spring容器，扫描引导类所在包加载bean

**四、内嵌tomcat**

内嵌Tomcat服务器是SpringBoot辅助功能之一

内嵌Tomcat工作原理是将Tomcat服务器作为对象运行，并将该对象交给Spring容器管理

```xml
<dependency>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-starter-web</artifactId>
</dependency>
```

里面

```xml
<dependency>
  <groupId>org.springframework.boot</groupId>
  <artifactId>spring-boot-starter-tomcat</artifactId>
  <version>2.6.11</version>
  <scope>compile</scope>
</dependency>
```

里面

```xml
<dependency>
  <groupId>org.apache.tomcat.embed</groupId>
  <artifactId>tomcat-embed-core</artifactId>
  <version>9.0.65</version>
  <scope>compile</scope>
  <exclusions>
    <exclusion>
      <artifactId>tomcat-annotations-api</artifactId>
      <groupId>org.apache.tomcat</groupId>
    </exclusion>
  </exclusions>
</dependency>
```

设置不使用tomcat使用jetty

```xml
<dependencies>
    <dependency>
        <groupId>org.springframework.boot</groupId>
        <artifactId>spring-boot-starter-web</artifactId>
        <exclusions>
            <exclusion>
                <groupId>org.springframework.boot</groupId>
                <artifactId>spring-boot-starter-tomcat</artifactId>
            </exclusion>
        </exclusions>
    </dependency>

    <dependency>
        <groupId>org.springframework.boot</groupId>
        <artifactId>spring-boot-starter-jetty</artifactId>
    </dependency>

    <dependency>
        <groupId>org.springframework.boot</groupId>
        <artifactId>spring-boot-starter-test</artifactId>
        <scope>test</scope>
    </dependency>
</dependencies>
```

* Jetty比Tomcat更轻量级，可扩展性强(相较于tomcat)，谷歌应用引擎(GAE)已经全面切换为Jetty

内置服务器

* tomcat(默认)   apache出品，应用面广，负载了若干较重的组件
* jetty   更轻量级，负载性能远不及tomcat
* undertow   负载性能勉强跑赢tomcat

--------

### 1.2SpringBoot基础配置

---------

#### 1.2.1属性配置

SpringBoot默认配置文件application.properties，通过键值对配置对应属性

* 修改服务器端口

<img src="https://tonkyshan.cn/img/20221231133947.png" alt="20221231133947" style="zoom: 67%;" />

```properties
#服务器端口配置
server.port=80
```

* 关闭运行日志图标(banner)

```properties
spring.main.banner.mode = off
```

* 设置日志相关

```properties
logging.level.root = debug
```

[配置属性及设定值](https://docs.spring.io/spring-boot/docs/current/reference/html/application-properties.html#appendix.application-properties)

-----

#### 1.2.2配置文件分类

SpringBoot提供了多种属性配置方式

* application.properties

```properties
server.port = 80
```

* application.yml

```yml
server:
  port: 81
```

* application.yaml

```yaml
server:
  port: 82
```

优先级

properties > yml > yaml

不同配置文件中相同配置按加载优先级互相覆盖，不同配置文件中不同配置全部保留

常用：yml

--------

#### 1.2.3yaml文件

YAML(YAML Ain't Markup Langage)，一种数据序列化格式

* 优点：
  * 容易阅读
  * 容易与脚本语言交互
  * 以数据为核心，重数据轻格式
* YAML文件扩展名
  * **.yml(主流)**
  * .yaml

**一、yaml语法规则**

* 大小写敏感
* 属性层级关系使用多行描述，每行结尾使用冒号结束
* 使用缩进表示层级关系，同层级左侧对齐，只允许使用空格(不允许使用Tab键)
* 属性值前面加空格(属性名与属性值之间使用冒号+空格作为分隔)
* #表示注释

核心规则：**数据前面要加空格与冒号隔开**

* 字面值表示方式

<img src="https://tonkyshan.cn/img/20221231183256.png" alt="20221231183256" style="zoom:67%;" />

* 数组表示方式

<img src="https://tonkyshan.cn/img/20221231183240.png" alt="20221231183240" style="zoom:67%;" />

--------

#### 1.2.4yaml数据读取

* 使用@Value读取单个数据，属性名引用方式：**${一级属性名.二级属性名......}**

```yaml
spring:
  application:
    name: SpringBoot_02_yaml

server:
  port: 8080

country: china

user1:
  name: jack
  age: 23

likes:
  - game
  - music
  - sleep
```

```java
package com.priv.controller;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

/**
 * @author : 十一
 * @data : 13:39 2022/12/29
 * When in doubt, use brute force.
 * Rest模式
 */
@RestController
@RequestMapping("/books")
public class BookController {

    /**
     * 读取yaml数据中的单一数据
     */
    @Value("${country}")
    private String country1;

    @Value("${user1.name}")
    private String name1;

    @Value("${likes[1]}")
    private String likes1;

    @GetMapping
    public String getById(){
        System.out.println("springboot is running...");
        System.out.println(country1);
        System.out.println(name1);
        System.out.println(likes1);
        return "springboot is running...";
    }
}
```

* 变量引用

```yaml
baseDir: c:\win10

#使用${属性名}引用数据
tempDir: ${baseDir}\temp
```

使用转义字符：用引号包起来

* 全部属性数据

封装全部数据到Environment对象

```java
package com.priv.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.env.Environment;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

/**
 * @author : 十一
 * @data : 13:39 2022/12/29
 * When in doubt, use brute force.
 * Rest模式
 */
@RestController
@RequestMapping("/books")
public class BookController {

    /**
     * 读取yaml数据中的单一数据
     */
    @Value("${country}")
    private String country1;

    @Value("${user1.name}")
    private String name1;

    @Value("${likes[1]}")
    private String likes1;

    @Autowired
    private Environment env;

    @GetMapping
    public String getById(){
        System.out.println("springboot is running...");
        System.out.println(env.getProperty("server.port"));
        System.out.println(env.getProperty("user1.name"));
        return "springboot is running...";
    }
}
```

* 引用类型属性数据

```java
package com.priv.controller;

import com.priv.DataSource;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.env.Environment;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

/**
 * @author : 十一
 * @data : 13:39 2022/12/29
 * When in doubt, use brute force.
 * Rest模式
 */
@RestController
@RequestMapping("/books")
public class BookController {

    @Autowired
    private DataSource dataSource;

    @GetMapping
    public String getById(){
        System.out.println(dataSource);
        return "springboot is running...";
    }
}
```

```yaml
spring:
  application:
    name: SpringBoot_02_yaml

server:
  port: 8080

datasource:
  driver: com.mysql.cj.jdbc.Driver
  url: jdbc:mysql//localhost/spring_db
  username: root
  password: root
```

```java
package com.priv;

import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.stereotype.Component;

/**
 * @author : 十一
 * @data : 19:01 2022/12/31
 * When in doubt, use brute force.
 */
@Component
@ConfigurationProperties(prefix = "datasource")
public class DataSource {
    private String driver;
    private String url;
    private String username;
    private String password;

    public String getDriver() {
        return driver;
    }

    public void setDriver(String driver) {
        this.driver = driver;
    }

    public String getUrl() {
        return url;
    }

    public void setUrl(String url) {
        this.url = url;
    }

    public String getUsername() {
        return username;
    }

    public void setUsername(String username) {
        this.username = username;
    }

    public String getPassword() {
        return password;
    }

    public void setPassword(String password) {
        this.password = password;
    }

    @Override
    public String toString() {
        return "DataSource{" +
                "driver='" + driver + '\'' +
                ", url='" + url + '\'' +
                ", username='" + username + '\'' +
                ", password='" + password + '\'' +
                '}';
    }
}
```

--------

### 1.3基于SpringBoot实现SSM整合

---------

#### 1.3.1整合JUnit

```java
package com.priv;

import com.priv.dao.BookDao;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;

@SpringBootTest
class SpringBoot03JunitApplicationTests {

    @Autowired
    private BookDao bookDao;

    @Test
    void contextLoads() {
        bookDao.save();
    }

}
```

1、导入测试对应的starter

```xml
<dependency>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-starter</artifactId>
</dependency>
```

2、测试类使用@SpringBootTest修饰

3、使用自动装配的形式添加要测试的对象(**@Autowired**)



问题：测试类变更到比引导类更高的层次，会导致不可用：

解决方法：@SpringBootTest(class = SpringBoot03JunitApplication.class)

* 名称：@SpringBootTest
* 类型：**测试类注解**
* 位置：测试类定义上方
* 作用：设置Junit加载的SpringBoot启动类
* 相关属性：
  * classes：设置SpringBoot启动类

tips：如果测试类在SpringBoot启动类的包或子包中，可以省略启动类的设置，也就是省略classes的设定

---------

#### 1.3.2整合Mybatis

一、创建项目，导入当前模块需要使用的技术集(Mybatis、Mysql)

二、设置数据源参数

```yaml
spring:
  datasource:
    driver-class-name: com.mysql.cj.jdbc.Driver
    url: jdbc:mysql://localhost:3306/ssm_db
    username: root
    password: stq971898495
```

三、定义数据层接口与映射配置

```java
package com.priv.dao;

import com.priv.domain.Book;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Select;

/**
 * @author : 十一
 * @data : 14:18 2023/1/6
 * When in doubt, use brute force.
 */
@Mapper
public interface BookDao {
    /**
     * 通过id查询
     * @param id
     * @return Book
     */
    @Select("select * from tbl_book where id = #{id}")
    public Book getById(Integer id);
}
```

四、测试类注入dao接口，进行功能测试

```java
package com.priv;

import com.priv.dao.BookDao;
import com.priv.domain.Book;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;

@SpringBootTest
class SpringBoot04MybatisApplicationTests {

    @Autowired
    private BookDao bookDao;

    @Test
    void testGetById() {
        Book book = bookDao.getById(2);
        System.out.println(book);
    }

}
```

tips：数据库SQL映射需要添加@Mapper被容器识别到

问题：

一、MySQL8.X驱动强制要求设置时区

* 修改url，添加serverTimezone设定
* 修改MySQL数据库配置

二、驱动类过时，提醒更换com.mysql.cj.jdbc.Driver

-----------

#### 1.3.3整合MyBatis-Plus

MyBatis-Plus与MyBatis区别

* 导入坐标不同
* 数据层实现简化

**一、导坐标**

```xml
<dependency>
    <groupId>com.baomidou</groupId>
    <artifactId>mybatis-plus-boot-starter</artifactId>
    <version>3.5.3.1</version>
</dependency>
```

* 由于SpringBoot中未收录MyBatis-Plus的坐标版本，需要指定对应的Version

**二、定义数据层接口与映射关系**

继承BaseMapper

```java
package com.priv.dao;

import com.baomidou.mybatisplus.core.mapper.BaseMapper;
import com.priv.domain.Book;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Select;

/**
 * @author : 十一
 * @data : 14:18 2023/1/6
 * When in doubt, use brute force.
 */
@Mapper
public interface BookDao extends BaseMapper<Book> {
/*
* 将实体类作为泛型传进去
*/
}
```

**三、进行测试**

---------

#### 1.3.4整合Druid

方式一

```yaml
spring:
  datasource:
    driver-class-name: com.mysql.cj.jdbc.Driver
    url: jdbc:mysql://localhost:3306/ssm_db
    username: root
    password: stq971898495
    type: com.alibaba.druid.pool.DruidDataSource
```

方式二(推荐)

```yaml
spring:
  datasource:
    druid:
      driver-class-name: com.mysql.cj.jdbc.Driver
      url: jdbc:mysql://localhost:3306/ssm_db
      username: root
      password: stq971898495
```

----------

### 1.4基于SpringBoot的SSMP整合案例

--------

#### 一、实体类快速开发——lombok

导坐标

```xml
<dependency>
    <groupId>org.projectlombok</groupId>
    <artifactId>lombok</artifactId>
</dependency>
```

```java
package com.priv.domain;

import lombok.Data;

/**
 * @author : 十一
 * @data : 10:15 2023/1/14
 * When in doubt, use brute force.
 */
@Data
public class Book {
    private Integer id;
    private String type;
    private String name;
    private String description;
}
```

> 里面没有构造方法，可以用注解，也可以自己加，实体类一般不用构造方法
>
> @Data为当前实体类在编译期设置对应的get/set方法，toString方法，hashCode方法，equals方法等

#### 二、MP运行日志

```yaml
mybatis-plus:
  configuration:
    log-impl: org.apache.ibatis.logging.stdout.StdOutImpl
```

标准输出，还有更多配置，可以自行学习

#### 三、分页

分页操作需要设定分页对象IPage

```java
@Test
void testGetPage(){
	IPage page = new Page(1, 5);
	bookDao.selectPage(page, null);
}
```

IPage对象中封装了分页操作中的所有数据

* 数据
* 当前页码值
* 每页数据总量
* 最大页码值
* 数据总量

分页操作是在MyBatisPlus的常规操作基础上增强得到，内部是动态的拼写SQL语句，因此需要增强对应的功能，使用

MyBatisPlus拦截器实现。

```java
package com.priv.config;

import com.baomidou.mybatisplus.extension.plugins.MybatisPlusInterceptor;
import com.baomidou.mybatisplus.extension.plugins.inner.PaginationInnerInterceptor;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

/**
 * @author : 十一
 * @data : 10:58 2023/1/14
 * When in doubt, use brute force.
 */
@Configuration
public class MPConfig {
    @Bean
    public MybatisPlusInterceptor mybatisPlusInterceptor(){
        MybatisPlusInterceptor interceptor = new MybatisPlusInterceptor();
        interceptor.addInnerInterceptor(new PaginationInnerInterceptor());
        return interceptor;
    }
}
```

#### 四、数据层开发-条件查询功能

使用QueryWrapper对象封装查询条件，推荐使用LambdaQueryWrapper对象，所有查询操作封装成方法调用

```java
@Test
void testGetBy2(){
    String name = "Spring";
    LambdaQueryWrapper<Book> qw = new LambdaQueryWrapper<>();
    qw.like(name != null, Book::getName, name);
    bookDao.selectList(qw);
}
```

#### 五、业务层开发

接口定义

```java
package com.priv.service;

import com.baomidou.mybatisplus.core.metadata.IPage;
import com.priv.domain.Book;

import java.util.List;

/**
 * @author : 十一
 * @data : 12:55 2023/1/16
 * When in doubt, use brute force.
 */
public interface BookService {
    Boolean save(Book book);

    Boolean update(Book book);

    Boolean delete(Integer id);

    Book getById(Integer id);

    List<Book> getAll();

    IPage<Book> getPage(int currentPage, int pageSize);
}
```

实现类定义

```java
package com.priv.service.impl;

import com.baomidou.mybatisplus.core.metadata.IPage;
import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import com.priv.dao.BookDao;
import com.priv.domain.Book;
import com.priv.service.BookService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

/**
 * @author : 十一
 * @data : 12:57 2023/1/16
 * When in doubt, use brute force.
 */
@Service
public class BookServiceImpl implements BookService {

    @Autowired
    private BookDao bookDao;

    @Override
    public Boolean save(Book book) {
        return bookDao.insert(book) > 0;
    }

    @Override
    public Boolean update(Book book) {
        return bookDao.updateById(book) > 0;
    }

    @Override
    public Boolean delete(Integer id) {
        return bookDao.deleteById(id) > 0;
    }

    @Override
    public Book getById(Integer id) {
        return bookDao.selectById(id);
    }

    @Override
    public List<Book> getAll() {
        return bookDao.selectList(null);
    }

    @Override
    public IPage<Book> getPage(int currentPage, int pageSize) {
        IPage page = new Page(currentPage, pageSize);
        bookDao.selectPage(page, null);
        return page;
    }
}
```

测试类定义

```java
package com.priv;

import com.baomidou.mybatisplus.core.metadata.IPage;
import com.priv.domain.Book;
import com.priv.service.BookService;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;

/**
 * @author : 十一
 * @data : 13:07 2023/1/16
 * When in doubt, use brute force.
 */
@SpringBootTest
public class BookServiceTestCase {

    @Autowired
    private BookService bookService;

    @Test
    void testGetById(){
        System.out.println(bookService.getById(4));
    }

    @Test
    void testSave(){
        Book book = new Book();
        book.setType("测试数据");
        book.setName("测试数据");
        book.setDescription("测试数据");
        bookService.save(book);
    }

    @Test
    void testUpdate(){
        Book book = new Book();
        book.setId(11);
        book.setType("测试数据124");
        book.setName("测试数据654");
        book.setDescription("测试数据423");
        bookService.update(book);
    }

    @Test
    void testDelete(){
        bookService.delete(11);
    }

    @Test
    void testGetAll(){
        bookService.getAll();
    }

    @Test
    void testGetPage(){
        IPage<Book> page = bookService.getPage(2, 3);
        System.out.println(page.getCurrent());
        System.out.println(page.getSize());
        System.out.println(page.getTotal());
        System.out.println(page.getPages());
        System.out.println(page.getRecords());
    }
}
```

##### 快速开发

使用MyBatisPlus提供有业务层通用接口(IService< T >)与业务层通用实现类(ServiceImpl<M, T>)

```java
package com.priv.service;

import com.baomidou.mybatisplus.extension.service.IService;
import com.priv.domain.Book;

/**
 * @author : 十一
 * @data : 13:21 2023/1/16
 * When in doubt, use brute force.
 */
public interface IBookService extends IService<Book> {
}
```

```java
package com.priv.service.impl;

import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;
import com.priv.dao.BookDao;
import com.priv.domain.Book;
import com.priv.service.IBookService;
import org.springframework.stereotype.Service;

/**
 * @author : 十一
 * @data : 13:27 2023/1/16
 * When in doubt, use brute force.
 */
@Service
public class BookServicePlus extends ServiceImpl<BookDao, Book> implements IBookService {
}
```

#### 六、表现层开发

```java
package com.priv.controller;

import com.baomidou.mybatisplus.core.metadata.IPage;
import com.priv.domain.Book;
import com.priv.service.BookService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/**
 * @author : 十一
 * @data : 13:31 2023/1/16
 * When in doubt, use brute force.
 */
@RestController
@RequestMapping("/books")
public class BookController {

    @Autowired
    private BookService bookService;

    @GetMapping
    public List<Book> getAll(){
        return bookService.getAll();
    }

    @PostMapping
    public Boolean save(@RequestBody Book book){
        return bookService.save(book);
    }

    @PutMapping
    public Boolean update(@RequestBody Book book){
        return bookService.update(book);
    }

    @DeleteMapping("{id}")
    public Boolean delete(@PathVariable Integer id){
        return bookService.delete(id);
    }

    @GetMapping("{id}")
    public Book getById(@PathVariable Integer id){
        return bookService.getById(id);
    }

    @GetMapping("{currentPage}/{pageSize}")
    public IPage<Book> getPage(@PathVariable int currentPage, @PathVariable int pageSize){
        return bookService.getPage(currentPage, pageSize);
    }
}
```

![20230116135526](https://tonkyshan.cn/img/20230116135526.png)

##### 消息一致性处理

```java
package com.priv.controller.utils;

import lombok.Data;

/**
 * @author : 十一
 * @data : 13:58 2023/1/16
 * When in doubt, use brute force.
 */
@Data
public class R {
    private Boolean flag;
    private Object data;

    public R() {}

    public R(Boolean flag){
        this.flag = flag;
    }

    public R(Boolean flag, Object data){
        this.flag = flag;
        this.data = data;
    }
}
```

```java
package com.priv.controller;

import com.baomidou.mybatisplus.core.metadata.IPage;
import com.priv.controller.utils.R;
import com.priv.domain.Book;
import com.priv.service.BookService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/**
 * @author : 十一
 * @data : 13:31 2023/1/16
 * When in doubt, use brute force.
 */
@RestController
@RequestMapping("/books")
public class BookController {

    @Autowired
    private BookService bookService;

    @GetMapping
    public R getAll(){
        return new R(true, bookService.getAll());
    }

    @PostMapping
    public R save(@RequestBody Book book){
        return new R(bookService.save(book));
    }

    @PutMapping
    public R update(@RequestBody Book book){
        return new R(bookService.update(book));
    }

    @DeleteMapping("{id}")
    public R delete(@PathVariable Integer id){
        return new R(bookService.delete(id));
    }

    @GetMapping("{id}")
    public R getById(@PathVariable Integer id){
        return new R(true, bookService.getById(id));
    }

    @GetMapping("{currentPage}/{pageSize}")
    public R getPage(@PathVariable int currentPage, @PathVariable int pageSize){
        return new R(true, bookService.getPage(currentPage, pageSize));
    }
}
```

#### 七、分页功能

```javascript
getAll() {
    axios.get("/books/" + this.pagination.currentPage + "/" + this.pagination.pageSize).then((res)=>{
        this.pagination.pageSize = res.data.data.size;
        this.pagination.currentPage = res.data.data.current;
        this.pagination.total = res.data.data.total;
        this.dataList = res.data.data.records;
    });
},

handleCurrentChange(currentPage){
    this.pagination.currentPage = currentPage;
    this.getAll();
},
```

```javascript
pagination: {
    currentPage: 1,
    pageSize: 5,
    total: 0
}
```

```html
<!--分页组件-->
<div class="pagination-container">
    <el-pagination
            class="pagiantion"

            @current-change = "handleCurrentChange"

            :current-page = "pagination.currentPage"

            :page-size = "pagination.pageSize"

            layout = "total, prev, pager, next, jumper"

            :total = "pagination.total">

    </el-pagination>

</div>
```

Bug

对查询结果进行校验，如果当前页码值大于最大页码值，使用最大页码值作为当前页码值重新查询

```java
@GetMapping("{currentPage}/{pageSize}")
public R getPage(@PathVariable int currentPage, @PathVariable int pageSize){
    IPage<Book> page = bookService.getPage(currentPage, pageSize);
    if (currentPage > page.getPages()){
        page = bookService.getPage((int)page.getPages(), pageSize);
    }
    return new R(true, page);
}
```

#### 八、条件查询

```java
@Override
public IPage<Book> getPage(int currentPage, int pageSize, Book book) {
    LambdaQueryWrapper<Book> wrapper = new LambdaQueryWrapper<>();
    wrapper.like(Strings.isNotEmpty(book.getType()), Book::getType, book.getType());
    wrapper.like(Strings.isNotEmpty(book.getName()), Book::getName, book.getName());
    wrapper.like(Strings.isNotEmpty(book.getDescription()), Book::getDescription, book.getDescription());
    IPage page = new Page(currentPage, pageSize);
    bookDao.selectPage(page, wrapper);
    return page;
}
```

```java
@GetMapping("{currentPage}/{pageSize}")
public R getPage(@PathVariable int currentPage, @PathVariable int pageSize, Book book){
    IPage<Book> page = bookService.getPage(currentPage, pageSize, book);
    if (currentPage > page.getPages()){
        page = bookService.getPage((int)page.getPages(), pageSize, book);
    }
    return new R(true, page);
}
```

```javascript
pagination: {
    currentPage: 1,
    pageSize: 5,
    total: 0,
    type: "",
    name: "",
    description: ""
}
```

--------

## 小结

------

SpringBoot基础部分完结，代码请查看[GitHub仓库](https://github.com/EchoTo/SpringBoot)
