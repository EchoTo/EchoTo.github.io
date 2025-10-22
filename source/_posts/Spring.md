---
title: Spring
date: 2022-12-16 14:32:17
tags: [Spring,java,SSM]
categories: [SSM,java]
---

## 第一章   Spring

----

### 1.1基础

-----

* 官网：spring.io
* Spring发展到今天已经形成了一种开发的生态圈，Spring提供了若干个项目，每个项目用于完成特定的功能

**Spring全家桶**

![20220617194846](https://tonkyshan.cn/img/20220617194846.png)

**发展史**

![20220617195507](https://tonkyshan.cn/img/20220617195507.png)

------

### 1.2Spring系统架构

------

Spring Framework是Spring生态圈中最基础的项目，是其他项目的根基

* Core Container：核心容器
* AOP：面向切面编程
* Aspects：AOP思想实现
* Data Access：数据访问
* Data Integration：数据集成
* Web：Web开发
* Test：单元测试与集成测试

<img src="https://tonkyshan.cn/img/20220617200429.png" alt="20220617200429" style="zoom: 67%;" />

学习路线：

![20220620090533](https://tonkyshan.cn/img/20220620090533.png)

-----

### 1.3核心概念

--------

**一、IoC/DI**

* IoC(Inversion of Control)：控制反转 
  * 使用对象时，由主动new产生对象转换为由**外部**提供对象，此过程中对象创建控制权由程序转移到**外部**，此思想称为控制反转。
* Spring技术对IoC思想进行了实现
  * Spring提供了一个容器，称为**IoC容器**，用来充当IoC思想中的“外部”
  * IoC容器负责对象的创建、初始化等一系列工作，被创建或被管理的对象在IoC容器中统称为Bean
* DI(Dependency Injection)：依赖注入
  * 在容器中建立service和bean之间的依赖关系的整个过程，称为依赖注入。

之前实现：

![20220620092220](https://tonkyshan.cn/img/20220620092220.png)

现在实现：

![20220620092321](https://tonkyshan.cn/img/20220620092321.png)

目标：**充分解耦**

* 使用IoC容器管理bean(IoC)
* 在IoC容器内将有依赖关系的bean进行关系绑定(DI)

效果：

* 使用对象时不仅可以直接从IoC容器中获取，并且获取到的bean已经绑定了所有的依赖关系

**二、IoC容器**

入门案例

![20220620094128](https://tonkyshan.cn/img/20220620094128.png)

1.导入Spring坐标

```xml
<dependency>
	<groupId>org.springframework</groupId>
	<artifactId>spring-context</artifactId>
	<version>5.2.10.RELEASE</version>
</dependency>
```

2.定义Spring管理的类(接口)

```java
public interface BookService {
	public void save();
}
```

```java
public class BookServiceImpl implements BookService {
	private BookDao bookDao = new BookDaoImpl();
	
	public void save(){
		bookDao.save();
	}
}
```

3.创建Spring配置文件，配置对应类作为Spring管理的bean

```xml
<?xml version="1.0" encoding="UTF-8"?>
<beans xmlns="http: / /www.springframework.org/schema/beans"
	xmlns:xsi="http: / /www.w3.org/2001/XMLSchema-instance"
	xsi:schemaLocation="http://www.springframework.org/schema/beans
					  https://www.springframework.org/schema/beans/spring-beans.xsd">
   <!--    1.导入spring的坐标spring-context-->

<!--    2.配置bean-->
<!--    bean标签表示配置bean，id属性表示给bean起名字，class属性表示给bean定义类型-->
    <bean id="bookDao" class="com.priv.dao.impl.BookDaoImpl"/>

    <bean id="bookService" class="com.priv.service.impl.BookServiceImpl"/>
</beans>
```

> tips：bean定义时id属性在同一个上下文中不能重复

```java
package com.priv;

import com.priv.dao.BookDao;
import com.priv.service.BookService;
import org.springframework.context.ApplicationContext;
import org.springframework.context.support.ClassPathXmlApplicationContext;

/**
 * @author : 十一
 * @data : 19:06 2022/11/5
 */
public class App2 {
    public static void main(String[] args) {
        //3.获取IOC容器
        ApplicationContext applicationContext = new ClassPathXmlApplicationContext("applicationContext.xml");
        //4.获取bean
//        BookDao bookDao = (BookDao) applicationContext.getBean("bookDao");
//        bookDao.save();
        BookService bookService = (BookService) applicationContext.getBean("bookService");
        bookService.save();
    }
}
```

**三、DI**

入门案例

![20220620200853](https://tonkyshan.cn/img/20220620200853.png)

1.删除使用new的形式创建对象的代码

```java
public class BookServiceImpl implements BookService {
	private BookDao bookDao;//private BookDao bookDao = new BookDaoImpl();
    
    public void save() {
        bookDao.save();
    }
}
```

2.提供依赖对象对应的setter方法

```java
public class BookServiceImpl implements BookService {
	private BookDao bookDao;
    
    public void save() {
        bookDao.save();
    }
    
    public void setBookDao(BookDao bookDao) {
        this.bookDao = bookDao;
    }
}
```

3.配置service与dao之间的关系

```xml
<?xml version="1.0" encoding="UTF-8"?>
<beans xmlns="http://www.springframework.org/schema/beans"
	xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
	xsi:schemaLocation="http://www.springframework.org/schema/beans
					  https://www.springframework.org/schema/beans/spring-beans.xsd">
  <bean id="bookService" class="com.itheima.di.service.impl.BookServiceImpl">
	  <property name="bookDao" ref="bookDao"/><!-- name里的bookDao就是上面第二行的bookDao这个属性(对象)，ref里的bookDao就是下面第九行的bookDao这个bean-->
  </bean>
  <bean id="bookDao" class="com.itheima.di.dao.impl.BookDaoImpl" />
</beans>
```

**四、Bean**

**1.bean基础配置：**

* 名称：bean
* 类型：标签
* 所属：beans标签
* 功能：定义Spring核心容器管理的对象
* 格式

```xml
<beans>
	<bean/>
	<bean></bean>
</beans>
```

* 属性列表：
  * id：bean的id，使用容器可以通过id值获取对应的bean，在一个容器中id值唯一
  * class：bean的类型，即配置的bean的全路径类名
* 范例

```xml
<bean id="bookDao" class="com.dao.impl.BookDaoImpl"/>
<bean id="bookService" class="com.service.impl.BookServiceImpl"></bean>
```

**2.bean别名配置**

* 名称：name
* 类型：属性
* 所属：bean标签
* 功能：定义bean的别名，可定义多个，使用逗号，分号，空格分隔
* 示例

```xml
<bean id="bookDao" naem="dao bookDaoImpl" class="com.dao.impl.BookDaoImpl"/>
<bean name="service,bookServiceImpl" class="com.service.impl.BookServiceImpl"/>
```

> tips：获取bean无论是通过id还是name获取，如果无法获取到，将抛出异常**NoSuchBeanDefinitionException**：NoSuchBeanDefinitionException: **No bean named 'bookServiceImpl' available**

**3.bean作用范围配置**

* 名称：scope
* 类型：属性
* 功能：定义bean的作用范围，可选范围如下
  * singleton：单例(默认)
  * prototype：非单例
* 示例

```xml
<bean id="bookDao" class="com.dao.impl.BookDaoImpl" scope="prototype"/>
```

适合交给容器进行管理的bean

* 表现层对象
* 业务层对象
* 数据层对象
* 工具对象

不适合交给容器进行管理的bean

* 封装实体的域对象

**4.bean的实例化**

**一、构造方法**

* bean本质上就是对象，创建bean使用构造方法完成
* 提供可访问的构造方法
* spring调用的是无参的构造方法，public和private都可以调用，机制：反射

```java
public class BookDaoImpl implements BookDao {
	public BookDaoImpl(){
		System.out.println( "book constructor is running ...");
    }
	public void save() {
		system.out.println( "book dao save ..." );
    }
}
```

* 配置

```xml
<bean id="bookDao" class="com.dao.impl.BookDaoImpl"/>
```

* 构造方法如果不存在，将抛出异常BeanCreationException

**二、静态工厂**

```java
public class OrderDaoFactory {
    public static OrderDao getOrderDao(){
        return new OrderDaoImpl();
    }
}
```

* 配置

```xml
<bean id="orderDao" factory-method="getOrderDao" class="com.factory.OrderDaoFactory"/>
<!--如果不加factory-method="getOrderDao"造出来的是Factory对象，要配置工厂里真正造对象的那个方法名-->
```

**三、实例工厂**

```java
public class UserDaoFactory {
	public UserDao getUserDao(){
		return new UserDaoImpl();
	}
}
```

```xml
<bean id="userFactory" class="com.factory.UserDaoFactory" /><!--先造工厂对象-->
<bean id="userDao" factory-method="getUserDao" factory-bean="userFactory" />
```

配置太麻烦，优化一下：

* **四、FactoryBean**

代替原始实例工厂中创建对象的方法

创建的对象是单例的，如果想改成非单例的：实现isSingleton方法，return false即可实现

```java
package com.factory;

import com.dao.UserDao;
import com.dao.imp1.userDaoImpl;
import org.springframework.beans.factory.FactoryBean;

public class UserDaoFactoryBean implements FactoryBean<UserDao> {
	//代替原始实例工厂中创建对象的方法
	public UserDao getobject() throws Exception {
		return new UserDaoImpl();
	}
	public class<?> getobjectType() {
     	return UserDao.class;
    }
}
```

* 配置

```xml
<bean id="userDao" class="com.factory.UserDaoFactoryBean" />
```

---

### 1.4bean的生命周期

---

* 生命周期：从创建到消亡的完整过程
* bean生命周期：bean从创建到销毁的整体过程
* bean生命周期控制：在bean创建后到销毁前做一些事情

**控制生命周期：**

**第一种  配置实现**

```java
//获取bean实例对象
ClassPathXmlApplicationContext ctx = new ClassPathXmlApplicationContext("applicationContext.xml");
//容器关闭前触发bean的销毁
//调用销毁(destroy)方法
//方法一：手动关闭容器(在最后)
ctx.close();//比较暴力
//方法二：注册关闭钩子，在虚拟机退出前先关闭容器再退出虚拟机
ctx.registerShutdownHook();
```

```xml
<!--配置
    在BookDaoImpl中定义两个方法init()和destory()-->
<bean id="bookDao" class="com.dao.impl.BookDaoImpl" init-method="init" destroy-method="destroy"/>
```

**第二种  接口实现**

implements InitializingBean,DisposableBean

方法重载

* destroy方法
* afterPropertiesSet方法：相当于init(在属性设置之后运行)

这种方法就不用在配置文件中去设置init-method="init" destroy-method="destroy"了

**生命周期**

* 初始化容器

  1、创建对象(内存分配)

  2、执行构造方法

  3、执行属性注入(set操作)

  4、执行bean初始化方法

* 使用bean

  1、执行业务操作

* 关闭/销毁容器

  1、执行bean销毁方法

---

### 1.5依赖注入(DI)

----

方式

* setter注入
  * 简单类型
  * 引用类型
* 构造器注入
  * 简单类型
  * 引用类型

一、setter注入引用类型(之前说过)

* 在bean中定义引用类型属性并提供可访问的**set**方法

```java
public class BookServiceImpl implements BookService {
	private BookDao bookDao;
    public void setBookDao(BookDao bookDao) {
        this.bookDao = bookDao;
    }
}
```

* 配置中使用**property**标签**ref**属性注入引用类型对象

```xml
<bean id="bookService" class="com.service.impl.BookServiceImpl">
	<property name="bookDao" ref="bookDao"/>
</bean>
<bean id="bookDao" class="com.dao.impl.BookDaoImpl"/>
```

二、setter注入简单类型

* 在bean中定义简单类型属性并提供可访问的**set**方法

```java
public class BookDaoImpl implements BookDao {
    private String databaseName;
    private int connextionNumber;
    
    public void setConnectionNum(int connectionNum) {
        this.connectionNum = connectionNum;
    }
    
    public void setDatabaseName(String databaseName) {
        this.databaseName = databaseName;
    }
}
```

* 配置中使用**property**标签**value**属性注入简单类型数据

```xml
<bean id="bookDao" class="com.dao.impl.BookDaoImpl">
    <property name="databaseName" value="mysql"/>
    <property name="connectionNum" value="100">
</bean>
```

三、构造器注入引用类型(了解)

* 在bean中定义引用类型属性并提供可访问的构造方法

```java
public class BookServiceImpl implements BookService {
    private BookDao bookDao;
    public BookServiceImpl(BookDao bookDao) {
        thos.bookDao = bookDao;
    }
}
```

* 配置中使用**constructor-arg**标签**ref**属性注入引用类型对象

```xml
<bean id="bookService" class="com.service.impl.BookServiceImpl">
	<constructor-arg name="bookDao" ref="bookDao" /><!--name名就是形参的名称-->
</bean>
<bean id="bookDao" class="com.dao.impl.BookDaoImpl" />
```

四、构造器注入简单类型

* 在bean中定义引用类型属性并提供可访问的**set**方法

```java
public class BookDaoImpl implements BookDao {
    private int connectionNumber;
    public void setConnectionNumber(int connectionNumber) {
        this.connectionNumber = connectionNumber;
    }
}
```

* 配置中使用**constructor-arg**标签**value**属性注入简单类型数据

```xml
<bean id="bookDao" class="com.dao.impl.BookDaoImpl">
	<constructor-arg name="connectionNumber" value="10"/>
</bean>
```

> tips：这种用name属性的方式耦合性太高，name后面接的是构造方法参数名称。这里可以利用type(形参类型)或者index(位置编号)属性替换。

------

**依赖自动装配**

* IoC容器根据bean所依赖的资源在容器中自动查找并注入到bean中的过程称为自动装配

* 自动装配的方式
  * 按类型(常用)：`autowire="byType"`
  * 按名称
  * 按构造方法
  * 不启动自动装配

一、配置中使用bean标签autowire属性设置自动装配类型

```xml
<bean id="bookDao" class="com.dao.impl.BookDaoImpl" />
<bean id="bookService" class="com.service.impl.BookServiceImpl" autowire="byType"/>
<!--byName是匹配bean的id名称与setter方法名首字母变小写-->
```

**特征**

* 自动装配用于引用类型依赖注入，不能对简单类型进行操作
* 使用按类型装配时(byType)必须保障容器中相同类型的bean唯一，推荐使用
* 使用按名称装配时(byName)必须保障容器中具有指定名称的bean，因变量名与配置耦合，不推荐使用
* 自动装配优先级低于setter注入与构造器注入，同时出现时自动装配配置失效

-----

### 1.6集合注入

-------

* 数组

* List

* Set

* Map

* Properties

```xml
<bean id="bookDao" class="com.dao.impl.BookDaoImpl">
    <property name="array">
        <array>
            <value>100</value>
            <value>200</value>
            <value>300</value>
        </array>
    </property>
    <property name="list">
        <list>
            <value>js</value>
            <value>java</value>
            <value>python</value>
        </list>
    </property>
    <property name="set">
        <set>
            <value>100</value>
            <value>200</value>
            <value>300</value>
            <value>300</value>#会过滤掉
        </set>
    </property>
    <property name="map">
        <map>
            <entry key="country" value="china"/>
            <entry key="province" value="liaoning"/>
            <entry key="city" value="shenyang"/>
        </map>
    </property>
    <property name="properties">
        <props>
            <prop key="country">china</prop>
            <prop key="province">liaoning</prop>
            <prop key="city">shenyang</prop>
        </props>
    </property>
</bean>
```

---

### 1.7数据源对象管理

-------

**一、druid**

管理DruidDataSource对象

```xml
<bean id="dataSource" class="com.alibaba.druid.pool.DruidDataSource">
    <property name="driverClassName" value="com.mysql.cj.jdbc.Driver"/>
    <property name="url" value="jdbc:mysql://localhost:3306/students"/>
    <property name="username" value="root"/>
    <property name="password" value="root"/>
    。。。
</bean>
```

**二、C3P0**

管理ComboPooledDataSource对象

```xml
<bean id="dataSource" class="com.mchange.v2.c3p0.ComboPooledDataSource">
	<property name="driverClass" value="com.mysql.cj.jdbc.Driver"/>
    <property name="jdbcUrl" value="jdbc:mysql://localhost:3306/students"/>
    <property name="user" value="root"/>
    <property name="password" value="root"/>
    。。。
</bean>
```

这么写显然是不合适的。。。

看下面

---------

### 1.8加载properties

-------

一、开启context命名空间第3，7，8行。

将第1行复制到第3行，5，6复制到7，8，改context

```xml
<beans xmlns="http://www.springframework.org/schema/beans"
	   xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
       xmlns:context="http://www.springframework.org/schema/context"
       xsi:schemaLocation="
			http://www.springframework.org/schema/beans
			http://www.springframework.org/schema/beans/spring-beans.xsd
             http://www.springframework.org/schema/context
			http://www.springframework.org/schema/context/spring-context.xsd
">
```

二、使用context空间加载properties文件

```xml
<context:property-placeholder location="jdbc.properties"/>
```

三、使用属性占位符${}读取prroperties文件中的属性

```xml
<bean id="dataSource" class="com.alibaba.druid.pool.DruidDataSource">
    <property name="driverClassName" value="${jdbc.driver}"/>
    <property name="url" value="${jdbc.url}"/>
    <property name="username" value="${jdbc.username}"/>
    <property name="password" value="${jdbc.password}"/>
</bean>
```

jdbc.properties

```properties
jdbc.driver=com.mysql.cj.jdbc.Driver
jdbc.url=jdbc:mysql://localhost:3306/students
jdbc.username=root
jdbc.password=root

#假设设置，并且把占位符中的jdbc.username改为username，调用结果可能不是Echo
#可能会与系统环境变量产生冲突，而且系统环境变量优先级高，所以如果要使用自定义名称的话，可以在
#<context:property-placeholder location="jdbc.properties"/>中添加
#system-properties-mode="NEVER"
username=Echo
```

> tips：加载多个配置文件，直接逗号即可，或者直接使用`classpath*:*property`，加载所有配置文件

`classpath*:*property`和`classpath:*property`的区别

* `classpath*:*property`：不仅可以读取当前项目下的配置文件，还可以读取类路径或jar包的配置文件
* `classpath:*property`：可以读取当前项目下的配置文件

--------

### 1.9容器

--------

**一、创建容器**

```java
//1.加载类路径下的配置文件
ApplicationContext ctx = new ClassPathXmlApplicationContext("applicationcontext.xm1");
//2.从文件系统下加载配置文件(了解即可)
ApplicationContext ctx = new FileSystemXmlApplicationContext("绝对路径")
```

**二、获取bean**

```java
//1.使用bean名称获取
BookDao bookDao = (BookDao)ctx.getBean("bookDao");
//2.使用bean名称获取并指定类型
BookDao bookDao = ctx.getBean("bookDao", BookDao.class);
//3.使用bean类型获取
BookDao bookDao = ctx.getBean(BookDao.class);
```

**三、容器类层次结构**

![20220706134822](https://tonkyshan.cn/img/20220706134822.png)

**四、BeanFactory**

* 类路径加载配置文件

```java
Resource resources = new ClassPathResource("applicationContext.xml");
BeanFactory bf = new XmlBeanFactory(resources);
BookDao bookDao = bf.getBean("bookDao", BookDao.class);
bookDao.save();
```

* BeanFactory创建完毕后，所有吧的bean均为延迟加载，ApplicationContext创建完毕后，所有的bean为立即加载

> tips：如果想让ApplicationContext创建后，bean也为延迟加载，可以在配置文件中bean添加`lazy-init="true"`

---------

### 1.10阶段总结

---

**一、容器相关**

![20220706135644](https://tonkyshan.cn/img/20220706135644.png)

**二、bean相关**

![20220706135533](https://tonkyshan.cn/img/20220706135533.png)

**三、依赖注入相关**

![20220706135629](https://tonkyshan.cn/img/20220706135629.png)

------

### 1.11注解开发

-------

#### 1.11.1注解开发定义bean

* 使用@Component定义bean

```java
@Component("bookDao")
public class BookDaoImpl implements BookDao {

}
@Component
public class BookServiceImpl implements BookService {

}
```

* 核心配置文件中通过组件扫描加载bean

```xml
<context:component-scan base-package="com.dao">
```

* Spring提供@Component注解的三个衍生注解
  * @Controller：用于表现层bean定义
  * @Service：用于业务层bean定义
  * @Repository：用于数据层bean定义

#### 1.11.2纯注解开发

Spring3.0升级了纯注解开发模式，使用Java类替代配置文件，开启了Spring快速开发赛道

* Java类替代Spring核心配置文件

![20220710174402](https://tonkyshan.cn/img/20220710174402.png)

* @Configuration注解用于设定当前类为**配置类**
* @ComponentScan注解用于设定扫描路径，此注解只能添加一次，多个数据用数组格式

```java
@ComponentScan({"com.service","com.dao"})
```

读取Spring核心配置文件初始化容器对象切换为读取Java配置类初始化容器对象

```java
//加载配置文件初始化容器
ApplicationContext ctx = new classPathXmlApplicationContext("applicationContext.xml" );
//加载配置类初始化容器
ApplicationContext ctx = new AnnotationConfigApplicationContext(SpringConfig.class);
```

#### 1.11.3bean的管理

**一、bean作用范围**

* 使用@Scope定义bean作用范围

```java
@Repository
@Scope("singleton")//单例 @Scope("prototype") 非单例
public class BookDaoImpl implements BookDao {
    
}
```

**二、bean生命周期**

* 使用@PostConstruct、@PreDestroy定义bean生命周期

```java
@Repository
@Scope("singleton")
public class BookDaoImpl implements BookDao {
    public BookDaoImpl() {
        System.out.println("book dao constructor ...");
    }
    
    @PostConstruct//构造方法后
    public void init() {
        System.out.println("book init ...");
    }
    
    @PreDestroy//销毁前
    public void destroy() {
        System.out.println("book destroy ...");
    }
}
```

#### 1.11.4依赖注入

* 使用@Autowired注解开启自动装配模式(按类型)

<img src="https://tonkyshan.cn/img/20220710180912.png" alt="20220710180912" style="zoom:67%;" />

自动装配基于反射设计创建对象并暴力反射对应属性为私有属性初始化数据，因此无需提供setter方法。

自动装配建议使用无参构造方法创建对象(默认)，如果不提供对应构造方法，请提供唯一的构造方法。

* 使用@Qualifier注解开启指定名称装配bean

<img src="https://tonkyshan.cn/img/20220710181249.png" alt="20220710181249" style="zoom:67%;" />

> tips：@Qualifier注解无法单独使用，必须配合@Autowired注解使用

* 使用@Value实现简单类型注入

<img src="https://tonkyshan.cn/img/20220710181531.png" alt="20220710181531" style="zoom:67%;" />

* 使用@PropertySource注解加载properties文件

<img src="https://tonkyshan.cn/img/20220710182007.png" alt="20220710182007" style="zoom:67%;" />

> tips：路径仅支持单一文件配置，多文件请使用数组格式配置，不允许使用通配符*

#### 1.11.5第三方bean管理

**一、第三方bean管理**

* 使用@Bean配置第三方bean

```java
@Configuration
public class SpringConfig {
    @Bean
    public DataSource dataSource() {
        DruidDataSource ds = new DruidDataSource();
        ds.setDriverClassName("com.mysql.cj.jdbc.Driver");
        ds.setUrl("jdbc:mysql://localhost:3306/students");
        ds.setUsername("root");
        ds.setPassword("root");
        return ds;
    }
}
```

* 使用独立的配置类管理第三方bean

```java
public class JdbcConfig {
    @Bean
    public DataSource dataSource() {
        DruidDataSource ds = new DruidDataSource();
        ds.setDriverClassName("com.mysql.cj.jdbc.Driver");
        ds.setUrl("jdbc:mysql://localhost:3306/students");
        ds.setUsername("root");
        ds.setPassword("root");
        return ds;
    }
}
```

* 将独立的配置类加入核心配置
* 方式一：导入式

```java
public class JdbcConfig {
    @Bean
    public DataSource dataSource() {
        DruidDataSource ds = new DruidDataSource();
        
        //相关配置
        return ds;
    }
}
```

* 使用@Import注解手动加入配置类到核心配置，此注解只能添加一次，多个数据请用数组格式

```java
@Configuration
@Import(JdbcConfig.class)//写多个用{}
public class SpringConfig {
}
```

* 方式二：扫描式(不推荐)

```java
@Configuration
public class JdbcConfig {
    @Bean
    public DataSource dataSource() {
        DruidDataSource ds = new DruidDataSource();
        
        //相关配置
        return ds;
    }
}
```

* 使用@ComponentScan注解扫描配置类所在的包，加载对应的配置类信息

```java
@Configuration
@ComponentScan({"com.config","com.service","com.dao"})
public class SpringConfig {
}
```

**二、第三方bean依赖注入**

* 简单类型依赖注入

![20220710185710](https://tonkyshan.cn/img/20220710185710.png)

* 引用类型

![20220710185754](https://tonkyshan.cn/img/20220710185754.png)

引用类型注入只需要为bean定义方法设置形参即可，容器会根据类型自动装配对象

#### 1.11.6注解总结

![20220710190054](https://tonkyshan.cn/img/20220710190054.png)

--------

### 1.12Spring整合MyBatis

---------

导坐标：

* spring操作jdbc的jar包：spring-jdbc
* spring整合mybatis的jar包：mybatis-spring

mybatis配置文件换成spring整合

两个bean：

* SqlSessionFactoryBean
* MapperScannerConfigurer

![20220716174524](https://tonkyshan.cn/img/20220716174524.png)

![20220716174547](https://tonkyshan.cn/img/20220716174547.png)

实际：把sqlMapConfig.xml换成Spring的MybatisConfig.java

```xml
<?xml version="1.0" encoding="UTF-8" ?>
<!DOCTYPE configuration PUBLIC "-//mybatis.org//DTD Config 3.0//EN" "http://mybatis.org/dtd/mybatis-3-config.dtd">
<configuration>

    <!--通过properties标签加载外部properties文件-->
    <properties resource="jdbc.properties"></properties>

    <typeAliases>
        <typeAlias type="com.priv.domain.Account" alias="account"></typeAlias>
    </typeAliases>

    <!--数据源环境-->
    <environments default="development">
        <environment id="development">
            <transactionManager type="JDBC"></transactionManager>
            <dataSource type="POOLED">
                <property name="driver" value="${jdbc.driver}"/>
                <property name="url" value="${jdbc.url}"/>
                <property name="username" value="${jdbc.username}"/>
                <property name="password" value="${jdbc.password}"/>
            </dataSource>
        </environment>
    </environments>

    <mappers>
        <package name="com.priv.dao"/>
    </mappers>

</configuration>
```

```java
package com.priv.config;

import org.mybatis.spring.SqlSessionFactoryBean;
import org.mybatis.spring.mapper.MapperScannerConfigurer;
import org.springframework.context.annotation.Bean;

import javax.sql.DataSource;

/**
 * @author : 十一
 * @data : 14:12 2022/12/14
 */
public class MybatisConfig {

    @Bean
    public SqlSessionFactoryBean sqlSessionFactory(DataSource dataSource){
        SqlSessionFactoryBean sqlSessionFactoryBean = new SqlSessionFactoryBean();
        sqlSessionFactoryBean.setTypeAliasesPackage("com.priv.domain");
        sqlSessionFactoryBean.setDataSource(dataSource);
        return sqlSessionFactoryBean;
    }

    @Bean
    public MapperScannerConfigurer mapperScannerConfigurer(){
        MapperScannerConfigurer mapperScannerConfigurer = new MapperScannerConfigurer();
        mapperScannerConfigurer.setBasePackage("com.priv.dao");
        return mapperScannerConfigurer;
    }
}
```

![20221214142646](https://tonkyshan.cn/img/20221214142646.png)

--------

### 1.13Spring整合JUnit

---------

导两个坐标：junit和spring-test

如果不整合会报空指针异常java.lang.NullPointerException(一开始我好奇如果不整合直接使用会出现什么问题，结果试了一下会报空指针)

* 使用Spring整合Junit专用的类加载器

```java
package com.priv;

import com.priv.config.SpringConfig;
import com.priv.domain.Account;
import com.priv.service.AccountService;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.test.context.ContextConfiguration;
import org.springframework.test.context.junit4.SpringJUnit4ClassRunner;

import java.util.List;

/**
 * @author : 十一
 * @data : 14:33 2022/12/14
 */
@RunWith(SpringJUnit4ClassRunner.class)
@ContextConfiguration(classes = SpringConfig.class)
public class AccountServiceTest {
    @Autowired
    private AccountService accountService;

    @Test
    public void testSave(){
        List<Account> all = accountService.findAll();
        System.out.println(all);
    }
}
```

--------

### 1.14AOP

-------

#### 1.14.1简介

-------

AOP(Aspect Oriented Programming)：面向切面编程，一种编程范式，指导开发者如何组织程序结构。

* OOP(Object Oriented Programming)：面向对象编程

作用：**在不惊动原始设计的基础上为其进行功能增强**。

Spring理念：无入侵式/无侵入式

![20220724191910](https://tonkyshan.cn/img/20220724191910.png)

* 连接点(JoinPoint)：程序执行过程中的任意位置，粒度为执行方法、抛出异常、设置变量等。
  * 在SpringAOP中，理解为方法的执行
* 切入点(Pointcut)：匹配连接点的式子
  * 在SpringAOP中，一个切入点可以只描述一个具体方法，也可以匹配多个方法
    * 一个具体方法：com.dao包下的BookDao接口中的无形参无返回值的save方法
    * 匹配多个方法：所有的save方法，所有get开头的方法，所有以Dao结尾的接口中的任意方法，所有带有一个参数的方法
* 通知(Advice)：在切入点处执行的操作，也就是共性功能
  * 在SpringAOP中，功能最终以方法的形式呈现
* 通知类：定义通知的类
* 切面(Aspect)：描述通知与切入点的对应关系

-------------

#### 1.14.2AOP入门案例

------

**一、导入aop坐标**

```xml
<dependency>
    <groupId>org.aspectj</groupId>
    <artifactId>aspectjweaver</artifactId>
    <version>1.9.7</version>
</dependency>
```

​                         ![20220730210002](https://tonkyshan.cn/img/20220730210002.png)                                        

**二、定义dao接口与实现类**

```java
package com.dao;

/**
 * @author : 十一
 * @data : 20:12 2022/7/30
 * When in doubt, use brute force.
 */
public interface BookDao {
    public void save();
    public void update();
}
```

```java
package com.dao.impl;

import com.dao.BookDao;
import org.springframework.stereotype.Repository;

/**
 * @author : 十一
 * @data : 20:12 2022/7/30
 * When in doubt, use brute force.
 */
@Repository
public class BookDaoImpl implements BookDao {
    
    public void save() {
        System.out.println(System.currentTimeMillis());
        System.out.println("book dao save ...");
    }

    public void update() {
        System.out.println("book dao update ...");
    }
}
```

**三、定义通知类**

```java
package com.aop;

public class MyAdvice {

    public void method(){
        System.out.println(System.currentTimeMillis());
    }

}
```

**四、定义切入点**

```java
package com.aop;

public class MyAdvice {
    
    private void pt(){}

    public void method(){
        System.out.println(System.currentTimeMillis());
    }

}
```

> tips：切入点定义依托一个不具有实际意义的方法进行，即无参数，无返回值，方法体无实际逻辑

**五、绑定切入点与通知关系，并指定通知添加到原始连接点的具体执行位置**

```java
package com.aop;

import org.aspectj.lang.annotation.Aspect;
import org.aspectj.lang.annotation.Before;
import org.aspectj.lang.annotation.Pointcut;
import org.springframework.stereotype.Component;

/**
 * @author : 十一
 * @data : 20:50 2022/7/30
 * When in doubt, use brute force.
 */

public class MyAdvice {

    @Pointcut("execution(void com.dao.BookDao.update())")
    private void pt(){}

    @Before("pt()")
    public void method(){
        System.out.println(System.currentTimeMillis());
    }

}
```

**六、定义通知类受Spring容器管理，并定义当前类为切面类**

```java
package com.aop;

import org.aspectj.lang.annotation.Aspect;
import org.aspectj.lang.annotation.Before;
import org.aspectj.lang.annotation.Pointcut;
import org.springframework.stereotype.Component;

/**
 * @author : 十一
 * @data : 20:50 2022/7/30
 * When in doubt, use brute force.
 */

@Component
@Aspect
public class MyAdvice {

    @Pointcut("execution(void com.dao.BookDao.update())")
    private void pt(){}

    @Before("pt()")
    public void method(){
        System.out.println(System.currentTimeMillis());
    }

}
```

**七、开启Spring对AOP注解驱动支持**

```java
package com.config;

import org.springframework.context.annotation.ComponentScan;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.EnableAspectJAutoProxy;

/**
 * @author : 十一
 * @data : 20:12 2022/7/30
 * When in doubt, use brute force.
 */
@Configuration
@ComponentScan("com.priv")
@EnableAspectJAutoProxy
public class SpringConfig {
}
```

--------

#### 1.14.3AOP工作流程

---------

1.Spring容器启动

2.读取所有切面配置中的切入点：没有使用的不读取

3.初始化bean，判定bean对应的类中的方法是否匹配到任意切入点

* 匹配失败，创建对象
* 匹配成功，创建原始对象(**目标对象**)的**代理**对象

4.获取bean执行方法

* 获取bean，调用方法并执行，完成操作
* 获取的bean是代理对象时，根据代理对象的运行模式运行原始方法与增强的内容，完成操作

**目标对象(Target)**：原始功能去掉共性功能对应的类产生的对象，这种对象是无法直接完成最终工作的

**代理(Proxy)**：目标对象无法直接完成工作，需要对其进行功能回填，通过原始对象的代理对象实现

--------

#### 1.14.4AOP切入点表达式

-------

* 切入点：要进行增强的方法
* 切入点表达式：要进行增强的方法的描述方式

![20220821163800](https://tonkyshan.cn/img/20220821163800.png)

一、切入点表达式标准格式：动作关键字(访问修饰符  返回值  包名.类/接口名.方法名(参数)异常名)

```java
execution(public User com.service.UserService.findById(int))
```

* 动作关键字：描述切入点的行为动作，例如execution表示执行到指定切入点
* 访问修饰符：public，private等，可以省略
* 返回值类型
* 包名
* 类/接口名
* 方法名
* 参数
* 异常名：方法定义中抛出指定异常，可以省略

二、可以使用通配符描述切入点，快速描述

* *：单个独立的任意符号，可以独立实现，也可以作为前缀或者后缀的匹配符出现

```java
execution(public * com.*.UserService.find*(*))
```

匹配com包下的任意包中的UserService类或接口中所有find开头的带有一个参数的方法

* ..：多个连续的任意符号，可以独立出现，常用于简化包名与参数的书写

```java
execution(public User com..UserService.findById(..))
```

匹配com包下的任意包中的UserService类或接口中所有名称为findById的方法

* +：专用于匹配子类类型

```java
execution(* *..*Service+.*(..))
```

![20220821165726](https://tonkyshan.cn/img/20220821165726.png)

----

#### 1.14.5AOP通知类型

-------

AOP通知描述了抽取的共性功能，根据共性功能抽取的位置不同，最终运行代码时要将其加入到合理的位置

AOP通知共分为5种类型

* 前置通知
* 后置通知
* 环绕通知(重点)
* 返回后通知(了解)
* 抛出异常后通知(了解)

**一、@Before**

类型：**方法注解**

位置：通知方法定义上方

作用：设置当前通知方法与切入点之间的绑定关系，当前通知方法在原始切入点方法前运行

范例：

```java
@Before("pt()")
public void before() {
    System.out.println("before advice ...");
}
```

相关属性：value(默认)：切入点方法名，格式为类名.方法名()

**二、@After**

类型：**方法注解**

位置：通知方法定义上方

作用：设置当前通知方法与切入点之间的绑定关系，当前通知方法在原始切入点方法后运行

范例：

```java
@After("pt()")
public void after() {
    System.out.println("after advice ...");
}
```

相关属性：value(默认)：切入点方法名，格式为类名.方法名()

**三、@Around**

类型：**方法注解**

位置：通知方法定义上方

作用：设置当前通知方法与切入点之间的绑定关系，当前通知方法在原始切入点方法前后运行

范例：

```java
@Around("pt()")
public Object around(ProceedingJoinPoint pjp) throws Throwable {
    System.out.println("around before advice ...");
	Object ret = pjp.proceed();
    System.out.println("around after advice ...");
    return ret;
}
```

调用方法具有返回值时，around方法要将值ret返回。

注意事项

* 环绕通知必须依赖形参ProceedingJoinPoint才能实现对原始方法的调用，进而实现原始方法调用前后同时添加通知
* 通知中如果未使用ProceedingJoinPoint对原始方法进行调用将跳过原始方法的执行
* 对原始方法的调用可以不接收返回值，通知方法设置成void即可,如果接收返回值，必须设定为Object类型
* 原始方法的返回值如果是void类型，通知方法的返回值类型可以设置成void，也可以设置成Object
* 由于无法预知原始方法运行后是否会抛出异常，因此环绕通知方法必须抛出Throwable对象

**四、@AfterReturning**

类型：**方法注解**

位置：通知方法定义上方

作用：设置当前通知方法与切入点之间的绑定关系，当前通知方法在原始切入点方法**正常执行完毕后**运行

范例：

```java
@AfterReturning("pt()")
public void afterReturning() {
    System.out.println("afterReturning advice ...");
}
```

相关属性：value(默认)：切入点方法名，格式为类名.方法名()

**五、@AfterThrowing**

类型：**方法注解**

位置：通知方法定义上方

作用：设置当前通知方法与切入点之间的绑定关系，当前通知方法在原始切入点方法运行抛出异常后执行

范例：

```java
@AfterThrowing("pt()")
public void afterThrowing() {
    System.out.println("afterThrowing advice ...");
}
```

相关属性：value(默认)：切入点方法名，格式为类名.方法名()

---------

#### 1.14.6案例：测量业务层接口执行效率

-------

1、业务功能：业务层接口执行前后分别记录时间，求差值得到执行效率

2、通知类型选择前后均可增强的类型——环绕通知

![20221215192341](https://tonkyshan.cn/img/20221215192341.png)

ProjectAdvice.java

```java
package com.priv.aop;

import org.aspectj.lang.ProceedingJoinPoint;
import org.aspectj.lang.Signature;
import org.aspectj.lang.annotation.Around;
import org.aspectj.lang.annotation.Aspect;
import org.aspectj.lang.annotation.Pointcut;
import org.springframework.stereotype.Component;

/**
 * @author : 十一
 * @data : 19:08 2022/12/15
 * When in doubt, use brute force.
 */
@Component
@Aspect
public class ProjectAdvice {

    @Pointcut("execution(* com.priv.service.*Service.*(..))")
    private void servicePt(){

    }

    @Around("ProjectAdvice.servicePt()")
    public void runSpeed(ProceedingJoinPoint joinPoint) throws Throwable {
        Signature signature = joinPoint.getSignature();
        String name = signature.getName();
        String className = signature.getDeclaringTypeName();
        long start = System.currentTimeMillis();
        for (int i = 0; i < 10000; i++) {
            joinPoint.proceed();
        }
        long end = System.currentTimeMillis();
        System.out.println("万次执行: "+ className + "." + name  + "----->" + (end - start) + "ms");
    }
}
```

Test

```java
package com.priv.service;

import com.priv.config.SpringConfig;
import com.priv.domain.Account;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.test.context.ContextConfiguration;
import org.springframework.test.context.junit4.SpringJUnit4ClassRunner;

import java.util.List;

/**
 * @author : 十一
 * @data : 19:01 2022/12/15
 * When in doubt, use brute force.
 */
@RunWith(SpringJUnit4ClassRunner.class)
@ContextConfiguration(classes = SpringConfig.class)
public class AccountServiceTestCse {
    @Autowired
    private AccountService accountService;

    @Test
    public void testFindById(){
        Account byId = accountService.findById(2);
//        System.out.println(byId);
    }

    @Test
    public void testFindAll(){
        List<Account> all = accountService.findAll();
//        System.out.println(all);
    }
}
```

-----

####  1.14.7AOP通知获取数据

-------

* 获取切入点方法的参数
  * JoinPoint：适用于前置，后置，返回后，抛出异常后通知
    * jp.getArgs()
  * ProceedJointPoint：适用于环绕通知，是JoinPoint的子类
    * pjp.proceed(pjp.getArgs())
* 获取切入点方法返回值
  * 返回后通知
  * 环绕通知
* 获取切入点方法运行异常信息
  * 抛出异常后通知
  * 环绕通知

```java
@PointCut("execution(* com.priv.dao.BookDao.findName(..))")
private void pt(){}

@AfterReturning(value = "pt()", returing = "ret")
public void afterReturing(Object ret) {//当参数有多个时，JoinPoint必须是第一个
	System.out.println("afterReturing advice ..." + ret);
}

@AfterThrowing(value = "pt()", throwing = "t")
public void afterThrowing(Throwable t) {
	System.out.println("afterThrowing advice ..." + t);
}
```

--------

#### 1.14.8案例：百度网盘密码数据兼容处理

------

需求：对百度网盘分享链接输入密码时尾部多输入的空格做兼容处理

分析：

* 在业务方法执行之前对所有的输入参数进行格式处理——trim()
* 使用处理后的参数调用原始方法——环绕通知中存在对原始方法的调用

```java
package com.priv.aop;

import org.aspectj.lang.ProceedingJoinPoint;
import org.aspectj.lang.annotation.Around;
import org.aspectj.lang.annotation.Aspect;
import org.aspectj.lang.annotation.Pointcut;
import org.springframework.stereotype.Component;

/**
 * @author : 十一
 * @data : 12:25 2022/12/16
 * When in doubt, use brute force.
 */
@Component
@Aspect
public class DataAdvice {

    @Pointcut("execution(boolean com.priv.service.*Service.*(..))")
    private void servicePt(){}

    @Around("DataAdvice.servicePt()")
    public Object trimStr(ProceedingJoinPoint pjp) throws Throwable {
        Object[] args = pjp.getArgs();
        for (int i = 0; i < args.length; i++) {
            if (args[i].getClass().equals(String.class)){
                args[i] = args[i].toString().trim();
            }
        }
        Object proceed = pjp.proceed(args);
        return proceed;
    }
}
```

```java
package com.priv.config;

import org.springframework.context.annotation.ComponentScan;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.EnableAspectJAutoProxy;

/**
 * @author : 十一
 * @data : 12:17 2022/12/16
 * When in doubt, use brute force.
 */
@Configuration
@ComponentScan("com.priv")
@EnableAspectJAutoProxy
public class SpringConfig {
}
```

```java
package com.priv.dao;

/**
 * @author : 十一
 * @data : 12:18 2022/12/16
 * When in doubt, use brute force.
 */
public interface ResourcesDao {
    public boolean readResources(String url, String password);
}
```

```java
package com.priv.dao.impl;

import com.priv.dao.ResourcesDao;
import org.springframework.stereotype.Repository;

/**
 * @author : 十一
 * @data : 12:18 2022/12/16
 * When in doubt, use brute force.
 */
@Repository
public class ResourcesDaoImpl implements ResourcesDao {
    public boolean readResources(String url, String password) {
        System.out.println(password.length());
        return password.equals("root");
    }
}
```

```java
package com.priv.service;

/**
 * @author : 十一
 * @data : 12:19 2022/12/16
 * When in doubt, use brute force.
 */
public interface ResourcesService {
    public boolean openURL(String url, String password);
}
```

```java
package com.priv.service.impl;

import com.priv.dao.ResourcesDao;
import com.priv.service.ResourcesService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

/**
 * @author : 十一
 * @data : 12:19 2022/12/16
 * When in doubt, use brute force.
 */
@Service
public class ResourcesServiceImpl implements ResourcesService {

    @Autowired
    private ResourcesDao resourcesDao;

    public boolean openURL(String url, String password) {
        return resourcesDao.readResources(url, password);
    }
}
```

```java
import com.priv.config.SpringConfig;
import com.priv.service.ResourcesService;
import org.springframework.context.annotation.AnnotationConfigApplicationContext;

/**
 * @author : 十一
 * @data : 12:19 2022/12/16
 * When in doubt, use brute force.
 */
public class App {
    public static void main(String[] args) {
        AnnotationConfigApplicationContext annotationConfigApplicationContext = new AnnotationConfigApplicationContext(SpringConfig.class);
        ResourcesService bean = annotationConfigApplicationContext.getBean(ResourcesService.class);
        boolean flag = bean.openURL("http://pan.baidu.com/haha", "root ");
        System.out.println(flag);
    }
}
```

-----

### 1.15Spring事务

----

#### 1.15.1事务简介

--------

* 事务作用：在数据层保障一系列的数据库操作同成功同失败
* Spring事务作用：在数据层或**业务层**保障一系列的数据库操作同成功同失败

```java
public interface PlatformTransactionmanager{
	void commit(TransactionStatus status) throws TransactionException;
	void rollback(TransactionStatus status) throws TransactionException;
}
```

```java
public class DataSourceTransactionmanager{
	...
}
```

**案例：银行转账**

![20221216134720](https://tonkyshan.cn/img/20221216134720.png)

模拟异常出现，当正常执行转账操作时：Tom减100，Jerry加100

当出现异常时，Tom减100，Jerry不变，这时就需要用到Spring事务

<img src="https://tonkyshan.cn/img/20221216134742.png" alt="20221216134742" style="zoom:80%;" />

<img src="https://tonkyshan.cn/img/20221216134806.png" alt="20221216134806" style="zoom:80%;" />

开启Spring事务：

1、在业务层接口中添加@Transactional

```java
package com.priv.service;

import org.springframework.transaction.annotation.Transactional;

/**
 * @author : 十一
 * @data : 12:58 2022/12/16
 * When in doubt, use brute force.
 */
public interface AccountService {
    /**
     * 转账操作
     * @param out 转出方
     * @param in 转入方
     * @param money 金额
     */

    @Transactional
    public void transfer(String out, String in, double money);
}
```

在Spring配置类加@EnableTransactionManagement

```java
package com.priv.config;

import org.springframework.context.annotation.ComponentScan;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Import;
import org.springframework.context.annotation.PropertySource;
import org.springframework.transaction.annotation.EnableTransactionManagement;

/**
 * @author : 十一
 * @data : 12:50 2022/12/16
 * When in doubt, use brute force.
 */
@Configuration
@ComponentScan("com.priv")
@PropertySource("classpath:jdbc.properties")
@Import({JdbcConfig.class, MybatisConfig.class})
@EnableTransactionManagement
public class SpringConfig {
}
```

-----------

#### 1.15.2事务角色

-----

![20221216135930](https://tonkyshan.cn/img/20221216135930.png)

![20221216135953](https://tonkyshan.cn/img/20221216135953.png)

**事务管理员：**发起事务方，在Spring中通常指代业务层开启事务的方法

**事务协调员：**加入事务方，在Spring中通常指代数据层方法，也可以是业务层方法

----

#### 1.15.3事务属性

----

**事务相关配置**

<img src="https://tonkyshan.cn/img/20221216140415.png" alt="20221216140415" style="zoom: 65%;" />

Spring事务遇到以下两种异常进行回滚：Error系，运行时异常

如IOException就不会回滚事务：把int i = 1 / 0;换成if(true) {throw new IOException();}

解决：@Transactional(rollbackFor = {IOException.class})

**案例：转账日志**

要求转账记录日志，是否成功都需要记录日志

**事务传播行为**

事务传播行为：事务协调员对事务管理员所携带事务的处理态度

![20221216142442](https://tonkyshan.cn/img/20221216142442.png)

解决办法：log的事务单独开一个T2

在业务层接口上添加Spring事务，设置事务传播行为**REQUIRES_NEW**(需要新事务)

![20221216142948](https://tonkyshan.cn/img/20221216142948.png)

---------

## 小结

关于SpringMVC将后续更新

相关源码请查看[gitee仓库](https://gitee.com/are-you-a-cookie/spring)

