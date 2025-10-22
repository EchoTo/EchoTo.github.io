---
title: Maven
date: 2022-04-13 20:26:13
tags: Maven
categories: Maven
---

## Maven基础

----

## 第一章   概述

----

### 1.1概述

----

传统项目管理状态分析：

* jar包不统一，jar包不兼容
* 工程升级维护过程操作繁琐
* ...

Maven的本质：Maven是一个项目管理工具，它包含了一个项目对象模型(POM：Project object Model)，一组标准集合，一个项目生命周期(Project Lifecycle)，一个依赖管理系统(Dependency Management System)，和用来运行定义在生命周期阶段(phase)中插件(plugin)目标(goal)的逻辑。

* 将项目开发和管理过程抽象成一个项目对象模型(POM)
* 项目构建：提供标准的、跨平台的自动化项目构建方式
* 依赖管理：方便快捷的管理项目依赖的资源(jar包)，避免资源间的版本冲突问题

![20220411120954](https://tonkyshan.cn/img/20220411120954.png)

------

## 第二章   使用

------

### 2.1Maven仓库

--------

仓库：用于存储资源，包含各种jar包。

**分类：**

* 本地仓库：用来存储从远程仓库或中央仓库下载的插件和jar包，项目使用一些插件或jar包优先从本地仓库查找。默认本地仓库在`${user.dir}/.m2/repository`，`${user.dir`}表示 windows用户目录。
* 远程仓库：如果本地需要插件或者jar包，本地仓库没有，默认去远程仓库下载，远程仓库可以在互联网内也可以在局域网内。
  * 中央仓库：在 maven 软件中内置一个远程仓库地址 `http://repo1.maven.org/maven2`，它是中央仓库，服务于整个互联网，它是由Maven团队自己维护，里面存储了非常全的 jar包，它包含了世界上大部分流行的开源项目构件。
  * 私服：部门/公司范围内存储资源的仓库，从中央仓库获取资源

**私服的作用：**

* 保存具有版权的资源,包含购买或自主研发的jar
  * 中央仓库中的jar都是开源的，不能存储具有版权的资源
* 一定范围内共享资源，仅对内部开放，不对外共享

![20220401224606](https://tonkyshan.cn/img/20220401224606.png)

**仓库配置：**

![20220411131525](https://tonkyshan.cn/img/20220411131525.png)

修改本地仓库默认位置

国外中央仓库由于下载速度缓慢，这里建议用阿里云的镜像仓库。

![20220411122025](https://tonkyshan.cn/img/20220411122025.png)

-------

### 2.2Maven目录结构

----

![20220401225842](https://tonkyshan.cn/img/20220401225842.png)

------

### 2.3Maven常用命令

------

* mvn compile：产生一个target目录存放java字节码文件(编译)
* mvn clean：删除target(清理)
* mvn test：(测试)
* mvn package：打成war包(打包)
* mvn install：将当前项目安装到本地仓库(安装到本地仓库)

**插件创建工程**

Java工程

```java
mvn archetype:generate -DgroupId={project-packaging} -DartifactId={project-name} 
-DarchetypeArtifactId=maven-archetype-quickstart -Dversion=0.0.1-snapshot -DinteractiveMode=false
```

Web工程

```java
mvn archetype:generate -DgroupId={project-packaging} -DartifactId={project-name} 
-DarchetypeArtifactId=maven-archetype-webapp -Dversion=0.0.1-snapshot -DinteractiveMode=false
```

---------

### 2.4Maven生命周期

-----

三套生命周期：

* Clean Lifecycle：清理
* Default Lifecycle：编译、测试、打包、安装
* Site Lifecycle：站点发步

在同一套生命周期中，执行后面的操作，会自动执行前面的所有操作

例：运行打包命令，会自动进行编译和测试。

![20220411161959](https://tonkyshan.cn/img/20220411161959.png)

![20220411162028](https://tonkyshan.cn/img/20220411162028.png)

![20220411162133](https://tonkyshan.cn/img/20220411162133.png)

**插件**

* 插件与生命周期内的阶段绑定，在执行到对应生命周期时执行对应的插件功能
* 默认maven在各个生命周期上绑定有预设的功能
* 通过插件可以自定义其他功能

```xml
<build>
  <plugins>
    <plugin>
      <groupId>org.apache.tomcat.maven</groupId>
      <artifactId>tomcat7-maven-plugin</artifactId>
      <version>2.1</version>
      <!--
      <executions>
      	<execution>
      		<goals>
      			<goal>jar</goal>  源码打包
      		</goals>
      		<phase>generate-test-resources</phase> 在这个阶段执行
      	</execution>
      </executions>
	  -->
    </plugin>
  </plugins>
</build>
```

-----

### 2.5Maven坐标

----

坐标：被Maven管理的资源的唯一标识

* groupld：定义当前Maven项目隶属组织名称(通常是域名反写，例如: org.mybatis)
* atifactld：定义当前Maven项目名称(通常是模块名称，例如CRM、SMS)
* version：定义当前项目版本号

打包方式：packaging：

* jar：java项目。默认值
* war：web项目。
* pom

-------

### 2.6依赖管理

------

**一、依赖配置**

* 依赖指当前项目运行所需的jar包，一个项目可以设置多个依赖

```xml
<dependencies>
	<denpendency>
		<groupId></groupId>
		<artifactId></artifactId>
		<version></version>
	</denpendency>
</dependencies>
```

**二、依赖传递**

依赖具有传递性

* 直接依赖：在当前项目中通过依赖配置建立的依赖关系
* 间接依赖：被资源的资源如果依赖其他资源，当前项目间接依赖其他资源

* 将一个项目的依赖传递给另一个项目

格式：

```xml
<dependencies>
	<denpendency>
         <!--项目1的坐标-->
		<groupId></groupId>
		<artifactId></artifactId>
		<version></version>
	</denpendency>
</dependencies>
```

**依赖传递冲突问题**

* 路径优先：当依赖中出现相同的资源时，层级越深，优先级越低，层级越浅，优先级越高
* 声明优先：当资源在相同层级被依赖时，配置顺序靠前的覆盖配置顺序靠后的

**可选依赖**

```xml
<dependencies>
	<denpendency>
		<groupId></groupId>
		<artifactId></artifactId>
		<version></version>
        <!--
		<optional>true</optional>
		-->
	</denpendency>
</dependencies>
```

可选依赖指对外隐藏当前所依赖的资源——不透明

**排除依赖**

排除依赖指主动断开依赖的资源，被排除的资源无需指定版本——不需要

```xml
<dependencies>
	<denpendency>
		<groupId></groupId>
		<artifactId></artifactId>
		<version></version>
        <!--
         <exclusions>
         	<exclusion>
         		 <groupId></groupId>
			    <artifactId></artifactId>
         	</exclusion>
         </exclusions>
		-->
	</denpendency>
</dependencies>
```

**三、依赖范围**

* 依赖的jar默认情况可以在任何地方使用，可以通过scope标签设定其作用范围
* 作用范围
  * 主程序范围有效(main文件夹范围内)
  * 测试程序范围有效(test文件夹范围内)
  * 是否参与打包(package指令范围内)

![20220411161211](https://tonkyshan.cn/img/20220411161211.png)

**依赖范围的传递性**

* 带有依赖范围的资源在进行传递时，作用范围将受到影响

![20220411161121](https://tonkyshan.cn/img/20220411161121.png)

---------

## Maven高级

-----

## 第三章   分模块开发与设计

------

### 3.1模块拆分

------

**一、ssm_pojo拆分**

* 新建模块
* 拷贝原始项目中对应的相关内容到ssm_pojo模块中
  * 实体类(User)
  * 配置文件(无)

**二、ssm_dao拆分**

* 新建模块
* 拷贝原始项目中对于的相关内容到ssm_dao模块中
  * 数据层接口(UserDao)
  * 配置文件：保留与数据层相关配置文件
    * tips：分页插件在配置中与SqlSessionFactoryBean绑定，需要保留
  * pom.xml：引入数据层相关坐标即可，删除SpringMVC相关坐标
    * Spring
    * Mybatis
    * Spring整合Mybatis
    * MySQL
    * Druid
    * Pagehelper
    * 直接依赖ssm_pojo(对ssm_pojo模块执行install指令，将其安装到本地仓库)

**三、ssm_service拆分**

* 新建模块
* 拷贝原始项目中对应的相关内容到ssm_service模块中
  * 业务层接口与实现类(UserService、UserServicelmpl)
  * 配置文件:保留与数据层相关配置文件(1个)
  * pom.xml: 引入数据层相关坐标即可，删除SpringMVC相关坐标
    * spring
    * junit
    * spring整合junit
    * 直接依赖ssm_dao (对ssm_dao模块执行install指令，将其安装到本地仓库)
    * 间接依赖ssm_pojo(由ssm_dao模块负责依赖关系的建立)
  * 修改service模块Spring核心配置文件名，添加模块名称，格式: applicationContext-service.xml
  * 修改dao模块Spring核心配置文件名，添加模块名称，格式: applicationContext-dao.xml
  * 修改单元测试引入的配置文件名称，由单个文件修改为多个文件

**四、ssm_control拆分**

* 新建模块(使用webapp模板)
* 拷贝原始项目中对应的相关内容到ssm_controller模块中
  * 表现层控制器类与相关设置类(UserController、异常相关……)
  * 配置文件:保留与表现层相关配置文件(1个)、服务器相关配置文件(1个)
  * pom.xml: 引入数据层相关坐标即可，删除springmvc相关坐标
    * Spring
    * springmvc
    * jackson
    * servlet
    * tomcat服务器插件
    * 直接依赖ssm_service (对ssm_service模块执行install指令，将其安装到本地仓库)
    * 间接依赖ssm_dao、ssm_pojo
  * 修改web.xml配置文件中加载spring环境的配置文件名称，使用*通配，加载所有applicationContext-开始的配置文件

**分模块开发**

* 模块中仅包含当前模块对应的功能类与配置文件
* Spring核心配置根据模块功能不同进行独立制作
* 当前模块所依赖的模块通过导入坐标的形式加入当前模块后才可以使用
* web.xml需要加载所有的spring核心配置文件

-----

## 第四章   聚合

-------

### 4.1聚合

--------

* 作用：聚合用于快速构建Maven工程，一次性构建多个项目/模块

* 制作方式：

  * 创建一个空模块，打包类型定义为pom

  ```xml
  <packaging>pom</packaging>
  ```

  * 定义当前模块进行构建操作时关联的其他模块名称

  ```xml
  <modules>
  	<module>../ ssm_controller</module>
  	<module>../ ssm_service</module>
  	<module>../ ssm_dao</module>
  	<module>../ssm_pojo</module>
  </ modules>
  ```

* 注意事项：参与聚合操作的模块最终执行顺序与模块间的依赖关系有关，与配置顺序无关

---

## 第五章   继承

----

### 5.1继承

-----

* 作用：通过继承可以实现在子工程中沿用父工程中的配置

  * Maven中的继承与java中的继承相似，在子工程中配置继承关系

* 制作方式

  * 在子工程中声明其父工程坐标与对应的位置

  ```xml
  <!--定义该工程的父工程-->
  <parent>
      <groupId>com.soup</groupId>
      <artifactId>ssm</artifactId>
      <version>1.0-SNAPSHOT</version>
      <!--填写父工程的pom文件-->
      <relativePath>../ssm/pom.xml</relativePath>
  </parent>
  ```

  * 在父工程中定义依赖管理

  ```xml
  <!--声明此处进行依赖管理-->
  <dependencyManagement>
  	<!--具体的依赖-->
  	<dependencies>
  		<!--spring环境-->
          <dependency>
  			<groupId>org.springframework</groupId>
               <artifactId>spring-context</artifactId>
               <version>5.1.9.RELEASE</version>
  	    </dependency>
       <dependencies>
  <dependencyManagement>
  ```

  **继承依赖使用**

  * 在子工程中定义依赖关系，无需声明依赖版本，版本参照父工程中依赖的版本

  ```xml
  <dependencies>
  	<!--spring环境-->
       <dependency>
  		<groupId>org.springframework</groupId>
           <artifactId>spring-context</artifactId>
       </dependency>
  </dependencies>
  ```

  ![20220413164251](https://tonkyshan.cn/img/20220413164251.png)

-----

**聚合与继承**

* 作用：
  * 聚合用于快速构建项目
  * 继承用于快速配置
* 相同点：
  * 聚合与继承的pom.xml文件打包方式均为pom，可以将两种关系制作到同一个pom文件中
  * 聚合与继承均属于设计型模块，并无实际的模块内容

* 不同点：
  * 聚合是在当前模块中配置关系，聚合可以感知到参与聚合的模块有哪些
  * 继承是在子模块中配置关系，父模块无法感知哪些子模块继承了自己

-----

## 第六章   属性

---------

**属性类别**

**一、自定义属性**

* 作用

  * 等同于定义变量，方便统一维护

* 定义格式

  ```xml
  <!--定义自定义属性-->
  <properties>
  	<spring.version>5.1.9.RELEASE</ spring.version><
      junit.version>4.12</junit.version>
  </properties>
  ```

* 调用格式

  ```xml
  <dependency>
  	<groupid>org.springframework</groupId>
      <artifactId>spring-context</artifactId>
      <version>${spring.version}</version>
  </dependency>
  ```

**二、内置属性**

* 作用

  * 使用Maven内置属性，快速配置

* 调用格式

  ```xml
  ${basedir}
  ${version}
  ```

**三、Setting属性**

* 作用

  * 使用Maven配置文件setting.xml中的标签属性，用于动态配置

* 调用格式

  ```xml
  ${settings.localRepository}
  ```

**四、Java系统属性**

* 作用

  * 读取Java系统属性

* 调用格式

  ```xml
  ${user.home}
  ```

* 系统属性查询方式

  ```xml
  mvn help:system
  ```

**五、环境变量属性**

* 作用

  * 使用Maven配置文件setting.xml中的标签属性，用于动态配置

* 调用格式

  ```xml
  ${env.JAVA_Home}
  ```

* 环境变量属性查询方式

  ```xml
  mvn help:system
  ```

-----

## 第七章   版本管理

----

**工程版本**

* SNAPSHOT(快照版本)
  * 项目开发过程中，为方便团队成员合作，解决模块间相互依赖和时时更新的问题，开发者对每个模块进行构建的时候，输出的临时性版本叫快照版本（测试阶段版本)
  * 快照版本会随着开发的进展不断更新
* RELEASE(发布版本)
  * 项目开发到进入阶段里程碑后，向团队外部发布较为稳定的版本，这种版本所对应的构件文件是稳定的，即便进行功能的后续开发，也不会改变当前发布版本内容，这种版本称为发布版本

![20220413181257](https://tonkyshan.cn/img/20220413181257.png)

-----

## 第八章   资源配置

-----

**配置文件引用pom属性**

* 作用

  * 在任意配置文件中加载pom文件中定义的属性

* 调用格式

  ```xml
  ${jdbc.url}
  ```

* 开启配置文件加载pom属性

  ```xml
  <!--配置资源文件对应的信息-->
  <resources>
  	<resource>
  	<!--设定配置文件对应的位置目录，支持使用属性动态设定路怪-->
  	<directory>${project.basedir}/src/main/resources</directory>
       <!--开启对配置文件的资源加载过滤-->
  	<filtering>true</filtering>
       </resource>
  </resources>
  ```

------

## 第九章   多环境开发配置

------

**多环境兼容**

![20220413182619](https://tonkyshan.cn/img/20220413182619.png)

**多环境配置**

```xml
<!--创建多环境-->
<profiles>
	<!--定义具体的环境:生产环境-->
    <profile>
		<!--定义环境对应的唯一名称-->
        <id>pro_env</id>
		<!--定义环玩中专用的属性值-->
        <properties>
			<jdbc.ur1>jdbc:mysql://127.1.1.1:3306/ssm_db</jdbc.ur1>
        </properties>
		<!--设置默认启动-->
        <activation>
			<activeByDefault>true</activeByDefault>
        </activation>
	</profile>
		<!--定义具体的环境:开发环境-->
    <profile>
		<id>dev_env</id>
         ....
	</profile>
</profiles>
```

**加载指定环境**

* 作用

  * 加载指定环境配置

* 调用格式

  ```xml
  mvn 指令 -p 环境定义id
  ```

* 范例

  ```xml
  mvn install -P pro_env
  ```

------

## 第十章   跳过测试

-------

**一、使用命令跳过测试**

* 命令

  ```xml
  mvn 指令 -D skipTests
  ```

* 注意事项

  * 执行的指令生命周期必须包含测试环节

**二、使用界面操作跳过测试**

![20220413183632](https://tonkyshan.cn/img/20220413183632.png)

**三、使用配置跳过测试**

```xml
<plugin>
	<artifactId>maven-surefire-plugin</artifactId>
    <version>2.22.1</version>
	<configuration>
		<skipTests>true</skipTests><!--设置跳过测试-->
         <includes> <!--包含指定的测试用例-->
			<include>**/User*Test.java</include>
         </includes>
		<excludes><!--排除指定的测试用例-->
			<exclude>**/User*Testcase.java</exclude>
        </excludes>
	</configuration>
</plugin>
```

-------

## 第十一章   私服

------

### 11.1Nexus私服

------

![20220413185804](https://tonkyshan.cn/img/20220413185804.png)

![20220413190041](https://tonkyshan.cn/img/20220413190041.png)

**仓库的分类**

* 宿主仓库hosted
  * 保存无法从中央仓库获取的资源
    * 自主研发
    * 第三方非开源文件
* 代理仓库proxy
  * 代理远程仓库，通过nexus访问其他公共仓库，例如中央仓库
* 仓库组group
  * 将若干个仓库组成一个群组，简化配置
  * 仓库组不能保存资源，属于设计型仓库

![20220413201842](https://tonkyshan.cn/img/20220413201842.png)

**发布到私服**

![20220413202405](https://tonkyshan.cn/img/20220413202405.png)
