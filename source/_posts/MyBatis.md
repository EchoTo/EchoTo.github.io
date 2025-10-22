---
title: MyBatis
date: 2022-12-03 15:55:55
tags: [MyBatis,java,SSM]
categories: [SSM,java]
---

## 第一章   MyBatis

--------------

### 1.1MyBatis简介

-----

**一、原始JDBC操作的分析**

原始jdbc开发存在的问题：

* 数据库创建连接、释放频繁造成系统资源浪费从而影响系统性能
* sql语句在代码中硬编码，造成代码不易维护，实际应用sql变化可能较大，sql变动需要改变java代码
* 查询操作时，需要手动将结果集中的数据封装到实体中。插入操作时，需要手动将实体的数据设置到sql语句的占位符位置。

解决方案：

* 使用数据库连接池初始化连接资源
* 将sql语句抽取到xml配置文件中
* 使用反射、内省等底层技术，自动将实体与表进行属性与字段的自动映射

​        MyBatis 是一款优秀的持久层框架，它支持定制化 SQL、存储过程以及高级映射。MyBatis 避免了几乎所有的 JDBC 代码和手动设置参数以及获取结果集。MyBatis 可以使用简单的 XML 或注解来配置和映射原生信息，将接口和 Java 的 POJOs(Plain Ordinary Java Object,普通的 Java对象)映射成数据库中的记录。

------

### 1.2MyBatis快速入门

--------

**一、MyBatis开发步骤**

**1、添加MyBatis的坐标**

```xml
<dependencies>
    <!--dependency>
  <groupId>org.example</groupId>
  <artifactId>[the artifact id of the block to be mounted]</artifactId>
  <version>1.0-SNAPSHOT</version>
</dependency-->
    <dependency>
        <groupId>mysql</groupId>
        <artifactId>mysql-connector-java</artifactId>
        <version>8.0.27</version>
    </dependency>
    <dependency>
        <groupId>org.mybatis</groupId>
        <artifactId>mybatis</artifactId>
        <version>3.5.7</version>
    </dependency>
    <dependency>
        <groupId>junit</groupId>
        <artifactId>junit</artifactId>
        <version>4.12</version>
        <scope>test</scope>
    </dependency>
    <dependency>
        <groupId>log4j</groupId>
        <artifactId>log4j</artifactId>
        <version>1.2.17</version>
    </dependency>
</dependencies>
```

**2、创建user数据表**

<img src="https://tonkyshan.cn/img/20221110155032.png" alt="20221110155032" style="zoom:67%;" />

**3、编写User实体类**

```java
package com.priv.domain;

/**
 * @author : 十一
 * @data : 15:20 2022/11/10
 */
public class User {

    private int id;
    private String username;
    private String password;

    public int getId() {
        return id;
    }

    public void setId(int id) {
        this.id = id;
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
        return "User{" +
                "id=" + id +
                ", username='" + username + '\'' +
                ", password='" + password + '\'' +
                '}';
    }
}
```

**4、编写映射文件UserMapper.xml**

```xml
<?xml version="1.0" encoding="UTF-8" ?>
<!DOCTYPE mapper PUBLIC "-//mybatis.org//DTD Mapper 3.0//EN" "http://mybatis.org/dtd/mybatis-3-mapper.dtd">
<mapper namespace="userMapper">

    <select id="findAll" resultType="com.priv.domain.User">
        select * from user;
    </select>

</mapper>
```

**5、编写核心文件SqlMapConfig.xml**

```xml
<?xml version="1.0" encoding="UTF-8" ?>
<!DOCTYPE configuration PUBLIC "-//mybatis.org//DTD Config 3.0//EN" "http://mybatis.org/dtd/mybatis-3-config.dtd">
<configuration>

    <!--数据源环境-->
    <environments default="development">
        <environment id="development">
            <transactionManager type="JDBC"></transactionManager>
            <dataSource type="POOLED">
                <property name="driver" value="com.mysql.cj.jdbc.Driver"/>
                <property name="url" value="jdbc:mysql://localhost:3306/test"/>
                <property name="username" value="root"/>
                <property name="password" value="写自己数据库密码，嘿嘿嘿~"/>
            </dataSource>
        </environment>
    </environments>

    <!--加载映射文件-->
    <mappers>
        <mapper resource="com/priv/mapper/UserMapper.xml"></mapper>
    </mappers>

</configuration>
```

**6、编写测试类**

```java
package com.priv.test;

import com.priv.domain.User;
import org.apache.ibatis.io.Resources;
import org.apache.ibatis.session.SqlSession;
import org.apache.ibatis.session.SqlSessionFactory;
import org.apache.ibatis.session.SqlSessionFactoryBuilder;
import org.junit.Test;

import java.io.IOException;
import java.io.InputStream;
import java.util.List;


/**
 * @author : 十一
 * @data : 15:40 2022/11/10
 */
public class MyBatisTest {

    @Test
    public void test1() throws IOException {
        //获取核心配置文件
        InputStream resourceAsStream = Resources.getResourceAsStream("sqlMapConfig.xml");
        //获得session工厂对象
        SqlSessionFactory sqlSessionFactory = new SqlSessionFactoryBuilder().build(resourceAsStream);
        //获得session会话对象
        SqlSession sqlSession = sqlSessionFactory.openSession();
        //执行操作  参数： namespace+id
        List<User> userlist = sqlSession.selectList("userMapper.findAll");
        //打印数据
        System.out.println(userlist);
        //释放资源
        sqlSession.close();

    }
}
```

--------

### 1.3MyBatis映射文件概述

-----

![20221110161259](https://tonkyshan.cn/img/20221110161259.png)

----

### 1.4MyBatis增删改查操作

-----

**一、insert**

UserMapper.xml

```xml
<?xml version="1.0" encoding="UTF-8" ?>
<!DOCTYPE mapper PUBLIC "-//mybatis.org//DTD Mapper 3.0//EN" "http://mybatis.org/dtd/mybatis-3-mapper.dtd">
<mapper namespace="userMapper">

    <!--插入操作-->
    <insert id="save" parameterType="com.priv.domain.User">
        insert into user values(#{id}, #{username}, #{password});
    </insert>
    
</mapper>
```

测试类

```java
package com.priv.test;

import com.priv.domain.User;
import org.apache.ibatis.io.Resources;
import org.apache.ibatis.session.SqlSession;
import org.apache.ibatis.session.SqlSessionFactory;
import org.apache.ibatis.session.SqlSessionFactoryBuilder;
import org.junit.Test;

import java.io.IOException;
import java.io.InputStream;
import java.util.List;


/**
 * @author : 十一
 * @data : 15:40 2022/11/10
 */
public class MyBatisTest {

    @Test
    public void test2() throws IOException {

        //模拟user对象
        User user = new User();
        user.setId(6);
        user.setUsername("tom");
        user.setPassword("abc");

        //获取核心配置文件
        InputStream resourceAsStream = Resources.getResourceAsStream("sqlMapConfig.xml");
        //获得session工厂对象
        SqlSessionFactory sqlSessionFactory = new SqlSessionFactoryBuilder().build(resourceAsStream);
        //获得session会话对象
        SqlSession sqlSession = sqlSessionFactory.openSession();
        //执行操作  参数： namespace+id
        int result = sqlSession.insert("userMapper.save", user);
        //打印返回值
        System.out.println(result);
        //mybatis执行更新操作   提交事务
        sqlSession.commit();
        //释放资源
        sqlSession.close();

    }
}
```

> tips：
>
> 1、在映射文件中使用parameterType属性指定要插入的数据类型
>
> 2、Sql语句中使用#{实体属性名}方式引用实体中的属性值
>
> 3、插入操作涉及数据库数据变化，所以要使用sqlSession对象显示的提交事务，即sqlSession.commit()

**二、update**

UserMapper.xml

```xml
<?xml version="1.0" encoding="UTF-8" ?>
<!DOCTYPE mapper PUBLIC "-//mybatis.org//DTD Mapper 3.0//EN" "http://mybatis.org/dtd/mybatis-3-mapper.dtd">
<mapper namespace="userMapper">

    <!--修改操作-->
    <update id="update" parameterType="com.priv.domain.User">
        update user set username = #{username}, password = #{password} where id = #{id};
    </update>

</mapper>
```

测试类

```java
package com.priv.test;

import com.priv.domain.User;
import org.apache.ibatis.io.Resources;
import org.apache.ibatis.session.SqlSession;
import org.apache.ibatis.session.SqlSessionFactory;
import org.apache.ibatis.session.SqlSessionFactoryBuilder;
import org.junit.Test;

import java.io.IOException;
import java.io.InputStream;
import java.util.List;


/**
 * @author : 十一
 * @data : 15:40 2022/11/10
 */
public class MyBatisTest {

    @Test
    public void test3() throws IOException {

        //模拟user对象
        User user = new User();
        user.setId(6);
        user.setUsername("jack");
        user.setPassword("def");

        //获取核心配置文件
        InputStream resourceAsStream = Resources.getResourceAsStream("sqlMapConfig.xml");
        //获得session工厂对象
        SqlSessionFactory sqlSessionFactory = new SqlSessionFactoryBuilder().build(resourceAsStream);
        //获得session会话对象
        SqlSession sqlSession = sqlSessionFactory.openSession();
        //执行操作  参数： namespace+id
        int result = sqlSession.update("userMapper.update", user);
        //打印返回值
        System.out.println(result);
        //mybatis执行更新操作   提交事务
        sqlSession.commit();
        //释放资源
        sqlSession.close();

    }
}
```

**三、delete**

UserMapper.xml

```xml
<?xml version="1.0" encoding="UTF-8" ?>
<!DOCTYPE mapper PUBLIC "-//mybatis.org//DTD Mapper 3.0//EN" "http://mybatis.org/dtd/mybatis-3-mapper.dtd">
<mapper namespace="userMapper">

    <!--删除操作-->
    <delete id="delete" parameterType="java.lang.Integer">
        delete from user where id = #{id};
    </delete>

</mapper>
```

测试类

```java
package com.priv.test;

import com.priv.domain.User;
import org.apache.ibatis.io.Resources;
import org.apache.ibatis.session.SqlSession;
import org.apache.ibatis.session.SqlSessionFactory;
import org.apache.ibatis.session.SqlSessionFactoryBuilder;
import org.junit.Test;

import java.io.IOException;
import java.io.InputStream;
import java.util.List;


/**
 * @author : 十一
 * @data : 15:40 2022/11/10
 */
public class MyBatisTest {

    @Test
    public void test4() throws IOException {

        //获取核心配置文件
        InputStream resourceAsStream = Resources.getResourceAsStream("sqlMapConfig.xml");
        //获得session工厂对象
        SqlSessionFactory sqlSessionFactory = new SqlSessionFactoryBuilder().build(resourceAsStream);
        //获得session会话对象
        SqlSession sqlSession = sqlSessionFactory.openSession();
        //执行操作  参数： namespace+id
        int result = sqlSession.delete("userMapper.delete", 6);
        //打印返回值
        System.out.println(result);
        //mybatis执行更新操作   提交事务
        sqlSession.commit();
        //释放资源
        sqlSession.close();

    }
}
```

> tips：
>
> 1、Sql语句中使用#{任意字符串}方式引用传递的单个参数

---

###  1.5MyBatis核心配置文件概述

-------

**一、MyBatis核心配置文件层级关系**

* Configuration配置
  * properties属性
  * setting设置
  * typeAliases类型别名
  * typeHandlers类型处理器
  * objectFactory对象工厂
  * plugins插件
  * environments环境
    * environment环境变量
      * transactionManager事务管理器
      * dataSource数据源
  * databasesldProvider数据库厂商标识
  * mappers映射器

**1、environments标签**

数据库环境的配置，支持多环境配置

![20221111203647](https://tonkyshan.cn/img/20221111203647.png)

其中，事务管理器(transactionManager) 类型有两种：

* JDBC：这个配置就是直接使用了JDBC的提交和回滚设置，它依赖于从数据源得到的连接来管理事务作用域。
* MANAGED：这个配置几乎没做什么。它从来不提交或回滚一 个连接,而是让容器来管理事务的整个生命周期(比如JEE应用服务器的上下文)。默认情况下它会关闭连接,然而一些容器并不希望这样， 因此需要将closeConnection属性设置为false 来阻止它默认的关闭行为。

其中，数据源(dataSource) 类型有三种：

* UNPOOLED：这个数据源的实现只是每次被请求时打开和关闭连接。
* POOLED：这种数据源的实现利用“池” 的概念将JDBC连接对象组织起来。
* JNDI：这个数据源的实现是为了能在如EJB或应用服务器这类容器中使用，容器可以集中或在外部配置数据源，然后放置一个JNDI上下文的引用。

**2、mappers标签**

该标签的作用是加载映射的，加载方式有如下几种：

![20221111204459](https://tonkyshan.cn/img/20221111204459.png)

**3、Properties标签**

实际开发中，习惯将数据源的配置信息单独抽取成一个properties文件，该标签可以加载额外配置的properties文件

**4、typeAliases标签**

类型别名是Java类型设置一个短的名字

```xml
<?xml version="1.0" encoding="UTF-8" ?>
<!DOCTYPE configuration PUBLIC "-//mybatis.org//DTD Config 3.0//EN" "http://mybatis.org/dtd/mybatis-3-config.dtd">
<configuration>

    <!--通过properties标签加载外部properties文件-->
    <properties resource="jdbc.properties"></properties>

    <typeAliases>
        <typeAlias type="com.priv.domain.User" alias="user"></typeAlias>
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

    <!--加载映射文件-->
    <mappers>
        <mapper resource="com/priv/mapper/UserMapper.xml"></mapper>
    </mappers>

</configuration>
```

------------

### 1.6MyBatis相应API

-----------

**一、SqlSession工厂构建器SqlSessionFactoryBuilder**

常用API：SqlSessionFactory build(InputStream inputStream)

通过加载mybatis的核心文件的输入流的形式构建一个SqlSessionFactory对象

```java
//获取核心配置文件
InputStream resourceAsStream = Resources.getResourceAsStream("sqlMapConfig.xml");
//获得session工厂对象
SqlSessionFactory sqlSessionFactory = new SqlSessionFactoryBuilder().build(resourceAsStream);
```

其中，Resources 具类,这个类在org.apache.ibatis.io包中。Resources 类帮助你从类路径下、文件系统或一个web URL中加载资源文件。

**二、SqlSession工厂对象SqlSessionFactory**

SqlSessionFactory有多个方法创建SqlSession实例

|              方法               |                             解释                             |
| :-----------------------------: | :----------------------------------------------------------: |
|          openSession()          | 会默认开启一个事务，但事务不会自动提交，也就意味着需要手动提交该事务，更新操作数据才会持久化到数据库中 |
| openSession(boolean autoCommit) |  参数为是否自动提交，如果设置为true，那么不需要手动提交事务  |

 **三、SqlSession会话对象**

SqlSession实例在MyBatis中是一个非常强大的一个类

执行语句的方法主要有：

```java
<T> T selectOne(String statement, Object parameter)
<E> List<E> selectList(String statement, Object parameter)
int insert(String statement, Object parameter)
int update(String statement, Object parameter)
int delete(String statement, Object parameter)
```

操作事务的方法主要有：

```java
void commit()
void rollback()
```

-----

### 1.7MyBatis Dao层实现

-------

**一、传统方式实现**

dao

UserMapper.java

```java
package com.priv.dao;

import com.priv.domain.User;

import java.io.IOException;
import java.util.List;

/**
 * @author : 十一
 * @data : 13:00 2022/11/14
 */
public interface UserMapper {

    public List<User> findAll() throws IOException;
}
```

dao.impl

UserMapperImpl.java

```java
package com.priv.dao.impl;

import com.priv.dao.UserMapper;
import com.priv.domain.User;
import org.apache.ibatis.io.Resources;
import org.apache.ibatis.session.SqlSession;
import org.apache.ibatis.session.SqlSessionFactory;
import org.apache.ibatis.session.SqlSessionFactoryBuilder;

import java.io.IOException;
import java.io.InputStream;
import java.util.List;

/**
 * @author : 十一
 * @data : 13:03 2022/11/14
 */
public class UserMapperImpl implements UserMapper {
    @Override
    public List<User> findAll() throws IOException {
        //获取核心配置文件
        InputStream resourceAsStream = Resources.getResourceAsStream("sqlMapConfig.xml");
        //获得session工厂对象
        SqlSessionFactory sqlSessionFactory = new SqlSessionFactoryBuilder().build(resourceAsStream);
        //获得session会话对象
        SqlSession sqlSession = sqlSessionFactory.openSession();
        //执行操作  参数： namespace+id
        List<User> userlist = sqlSession.selectList("userMapper.findAll");

        return userlist;
    }
}
```

service

serviceDemo.java

```java
package com.priv.service;

import com.priv.dao.UserMapper;
import com.priv.dao.impl.UserMapperImpl;
import com.priv.domain.User;

import java.io.IOException;
import java.util.List;

/**
 * @author : 十一
 * @data : 13:09 2022/11/14
 */
public class ServiceDemo {

    public static void main(String[] args) throws IOException {

        //创建dao层对象
        UserMapper userMapper = new UserMapperImpl();
        List<User> userList = userMapper.findAll();

        System.out.println(userList);
    }
}
```

UerMapper.xml

```xml
<?xml version="1.0" encoding="UTF-8" ?>
<!DOCTYPE mapper PUBLIC "-//mybatis.org//DTD Mapper 3.0//EN" "http://mybatis.org/dtd/mybatis-3-mapper.dtd">
<mapper namespace="userMapper">

    <!--查询操作-->
    <select id="findAll" resultType="user">
        select * from user;
    </select>

</mapper>
```

**二、代理开发方式**

采用Mybatis的代理开发方式实现DAO层的开发，这种方式是我们后面进入企业的主流。
Mapper接口开发方法只需要程序员编写Mapper接口(相当于Dao接口)，由Mybatis框架根据接口定义创建接口的动态代理对象，代理对象的方法体同上边Dao接口实现类方法。

Mapper接口开发需要遵循以下规范：
1、Mapper.xml文件中的namespace与mapper接口的全限定名相同

2、Mapper接口方法名和Mapper.xmI中定义的每个statement的id相同

3、Mapper接口方法的输入参数类型和mapper.xmI中定义的每个sq|的parameterType的类型相同

4、Mapper接口方法的输出参数类型和mapper.xmI中定义的每个sq|的resultType的类型相同

![20221114134153](https://tonkyshan.cn/img/20221114134153.png)

dao

UserMapper.java

```java
package com.priv.dao;

import com.priv.domain.User;

import java.io.IOException;
import java.util.List;

/**
 * @author : 十一
 * @data : 13:00 2022/11/14
 */
public interface UserMapper {

    public List<User> findAll() throws IOException;

    public User findById(int id);
}

```

service

serviceDemo.java

```java
package com.priv.service;

import com.priv.dao.UserMapper;
import com.priv.domain.User;
import org.apache.ibatis.io.Resources;
import org.apache.ibatis.session.SqlSession;
import org.apache.ibatis.session.SqlSessionFactory;
import org.apache.ibatis.session.SqlSessionFactoryBuilder;

import java.io.IOException;
import java.io.InputStream;
import java.util.List;

/**
 * @author : 十一
 * @data : 13:09 2022/11/14
 */
public class ServiceDemo {

    public static void main(String[] args) throws IOException {

        //获取核心配置文件
        InputStream resourceAsStream = Resources.getResourceAsStream("sqlMapConfig.xml");
        //获得session工厂对象
        SqlSessionFactory sqlSessionFactory = new SqlSessionFactoryBuilder().build(resourceAsStream);
        //获得session会话对象
        SqlSession sqlSession = sqlSessionFactory.openSession();

        UserMapper mapper = sqlSession.getMapper(UserMapper.class);

//        List<User> userList = mapper.findAll();
//
//        System.out.println(userList);

        User user = mapper.findById(1);
        System.out.println(user);
    }
}
```

UserMapper.xml

```xml
<?xml version="1.0" encoding="UTF-8" ?>
<!DOCTYPE mapper PUBLIC "-//mybatis.org//DTD Mapper 3.0//EN" "http://mybatis.org/dtd/mybatis-3-mapper.dtd">
<mapper namespace="com.priv.dao.UserMapper">

    <!--查询操作-->
    <select id="findAll" resultType="user">
        select * from user;
    </select>

    <!--根据id进行查询-->
    <select id="findById" parameterType="int" resultType="user">
        select * from user where id = #{id};
    </select>
    
</mapper>
```

----------

### 1.8MyBatis映射文件深入

--------

**一、动态sql语句**

  Mybatis的映射文件中，前面我们的SQL都是比较简单的，有些时候业务逻辑复杂时，我们的sql是动态变化的，此时在前面的学习中我们的sql就不能满足要求了。

**1、if**

UserMapper.xml

```xml
<?xml version="1.0" encoding="UTF-8" ?>
<!DOCTYPE mapper PUBLIC "-//mybatis.org//DTD Mapper 3.0//EN" "http://mybatis.org/dtd/mybatis-3-mapper.dtd">
<mapper namespace="com.priv.mapper.UserMapper">

    <select id="findByCondition" parameterType="user" resultType="user">
        select * from user
        <where>
            <if test="id != 0">
                and id = #{id}
            </if>
            <if test="username != null">
                and username = #{username}
            </if>
            <if test="password != null">
                and password = #{password}
            </if>
        </where>
    </select>
</mapper>
```

MapperTest.java

```java
package com.priv.test;


import com.priv.domain.User;
import com.priv.mapper.UserMapper;
import org.apache.ibatis.io.Resources;
import org.apache.ibatis.session.SqlSession;
import org.apache.ibatis.session.SqlSessionFactory;
import org.apache.ibatis.session.SqlSessionFactoryBuilder;
import org.junit.Test;

import java.io.IOException;
import java.io.InputStream;
import java.util.List;

/**
 * @author : 十一
 * @data : 16:22 2022/11/15
 */
public class MapperTest {

    @Test
    public void test1() throws IOException {
        InputStream resourceAsStream = Resources.getResourceAsStream("sqlMapConfig.xml");
        SqlSessionFactory sqlSessionFactory = new SqlSessionFactoryBuilder().build(resourceAsStream);
        SqlSession sqlSession = sqlSessionFactory.openSession();
        UserMapper mapper = sqlSession.getMapper(UserMapper.class);

        //模拟条件
        User condition = new User();
        condition.setId(1);
//        condition.setUsername("zhangsan");
//        condition.setPassword("123");
        List<User> userList = mapper.findByCondition(condition);
        System.out.println(userList);
    }
}
```

**2、foreach**

```xml
<?xml version="1.0" encoding="UTF-8" ?>
<!DOCTYPE mapper PUBLIC "-//mybatis.org//DTD Mapper 3.0//EN" "http://mybatis.org/dtd/mybatis-3-mapper.dtd">
<mapper namespace="com.priv.mapper.UserMapper">
    
    <select id="findByIds" parameterType="list" resultType="user">
        select * from user
        <where>
            <foreach collection="list" open="id in(" close=")" item="id" separator=",">
                #{id}
            </foreach>
        </where>
    </select>
    
</mapper>
```

```java
package com.priv.test;


import com.priv.domain.User;
import com.priv.mapper.UserMapper;
import org.apache.ibatis.io.Resources;
import org.apache.ibatis.session.SqlSession;
import org.apache.ibatis.session.SqlSessionFactory;
import org.apache.ibatis.session.SqlSessionFactoryBuilder;
import org.junit.Test;

import java.io.IOException;
import java.io.InputStream;
import java.util.ArrayList;
import java.util.List;

/**
 * @author : 十一
 * @data : 16:22 2022/11/15
 */
public class MapperTest {

    @Test
    public void test2() throws IOException {
        InputStream resourceAsStream = Resources.getResourceAsStream("sqlMapConfig.xml");
        SqlSessionFactory sqlSessionFactory = new SqlSessionFactoryBuilder().build(resourceAsStream);
        SqlSession sqlSession = sqlSessionFactory.openSession();
        UserMapper mapper = sqlSession.getMapper(UserMapper.class);

        //模拟Ids数据
        List<Integer> ids = new ArrayList<>();
        ids.add(1);
        ids.add(2);
        List<User> userList = mapper.findByIds(ids);
        System.out.println(userList);
     //[User{id=1, username='zhangsan', password='123'}, User{id=2, username='lisi', password='123'}]
    }
}
```

**二、sql片段的抽取**

sql标签

```xml
<?xml version="1.0" encoding="UTF-8" ?>
<!DOCTYPE mapper PUBLIC "-//mybatis.org//DTD Mapper 3.0//EN" "http://mybatis.org/dtd/mybatis-3-mapper.dtd">
<mapper namespace="com.priv.mapper.UserMapper">

    <!--sql语句抽取-->
    <sql id="selectUser">select * from user</sql>

    <select id="findByCondition" parameterType="user" resultType="user">
        <include refid="selectUser"></include>
        <where>
            <if test="id != 0">
                and id = #{id}
            </if>
            <if test="username != null">
                and username = #{username}
            </if>
            <if test="password != null">
                and password = #{password}
            </if>
        </where>
    </select>

    <select id="findByIds" parameterType="list" resultType="user">
        <include refid="selectUser"></include>
        <where>
            <foreach collection="list" open="id in(" close=")" item="id" separator=",">
                #{id}
            </foreach>
        </where>
    </select>
</mapper>
```

------

### 1.9mybatis核心配置文件深入

---

**一、typeHandlers标签**

​	无论是Mybatis在预处理语句(PreparedStatement)中设置一个参数时，还是从结果集中取出一个值时，都会用类型处理器将获取的值以合适的方式转换成Java类型，下表描述了一些默认的类型处理器。

![20221124153505](https://tonkyshan.cn/img/20221124153505.png)

你可以重写类型处理器或创建你自己的类型处理器来处理不支持的或非标准的类型。具体做法为：实现org.apache.ibatis.type.TypeHandler接口，或继承一个很便利的类org.apache.ibatis.type.BaseTypeHandler，然
后可以选择性地将它映射到一个JDBC类型。例如需求：一个Java中的Date数据类型，我想将之存到数据库的时候存成一
个1970年至今的毫秒数，取出来时转换成java的Date，即java的Date与数据库的varchar毫秒值之间转换。

开发步骤：

* 定义转换类继承类BaseTypeHandler< T >
* 覆盖4个未实现的方法，其中setNonNullParameter为java程序设置数据到数据库的回调方法，getNullableResult为查询时mysql的字符串类型转换成java的Type类型的方法
* 在Mybatis核心配置文件中进行注册
* 测试转换是否正确

sqlMapConfig.xml

```xml
<?xml version="1.0" encoding="UTF-8" ?>
<!DOCTYPE configuration PUBLIC "-//mybatis.org//DTD Config 3.0//EN" "http://mybatis.org/dtd/mybatis-3-config.dtd">
<configuration>

    <!--通过properties标签加载外部properties文件-->
    <properties resource="jdbc.properties"></properties>

    <typeAliases>
        <typeAlias type="com.priv.domain.User" alias="user"></typeAlias>
    </typeAliases>

    <!--定义类型处理器-->
    <typeHandlers>
        <typeHandler handler="com.priv.handler.DateTypeHandler"></typeHandler>
    </typeHandlers>

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

    <!--加载映射文件-->
    <mappers>
        <mapper resource="com.priv.mapper/UserMapper.xml"></mapper>
    </mappers>

</configuration>
```

UserMapper.xml

```xml
<?xml version="1.0" encoding="UTF-8" ?>
<!DOCTYPE mapper PUBLIC "-//mybatis.org//DTD Mapper 3.0//EN" "http://mybatis.org/dtd/mybatis-3-mapper.dtd">
<mapper namespace="com.priv.mapper.UserMapper">
    <insert id="save" parameterType="user">
        insert into user values(#{id}, #{username}, #{password}, #{birthday})
    </insert>

    <select id="findById" parameterType="int" resultType="user">
        select * from user where id = #{id};
    </select>
</mapper>
```

DateTypeHandler.java

```java
package com.priv.handler;

import org.apache.ibatis.type.BaseTypeHandler;
import org.apache.ibatis.type.JdbcType;

import java.sql.CallableStatement;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.Date;

/**
 * @author : 十一
 * @data : 19:44 2022/11/24
 */
public class DateTypeHandler extends BaseTypeHandler<Date> {

    //将java类型转换成数据库需要的类型
    @Override
    public void setNonNullParameter(PreparedStatement preparedStatement, int i, Date date, JdbcType jdbcType) throws SQLException {
        long time = date.getTime();
        preparedStatement.setLong(i, time);
    }

    //将数据库类型转换成java类型
    //String 参数 要转换的字段名称
    //ResultSet 查询出的结果集
    @Override
    public Date getNullableResult(ResultSet resultSet, String s) throws SQLException {
        long aLong = resultSet.getLong(s);
        Date date = new Date(aLong);
        return date;
    }

    //将数据库类型转换成java类型
    @Override
    public Date getNullableResult(ResultSet resultSet, int i) throws SQLException {
        long aLong = resultSet.getLong(i);
        Date date = new Date(aLong);
        return date;
    }

    //将数据库类型转换成java类型
    @Override
    public Date getNullableResult(CallableStatement callableStatement, int i) throws SQLException {
        long aLong = callableStatement.getLong(i);
        Date date = new Date(aLong);
        return date;
    }
}
```

MapperTest.java

```java
package com.priv.test;

import com.priv.domain.User;
import com.priv.mapper.UserMapper;
import org.apache.ibatis.io.Resources;
import org.apache.ibatis.session.SqlSession;
import org.apache.ibatis.session.SqlSessionFactory;
import org.apache.ibatis.session.SqlSessionFactoryBuilder;
import org.junit.Test;

import java.io.IOException;
import java.io.InputStream;
import java.util.Date;
import java.util.List;

/**
 * @author : 十一
 * @data : 19:36 2022/11/24
 */
public class MapperTest {

    @Test
    public void test2() throws IOException {
        InputStream resourceAsStream = Resources.getResourceAsStream("sqlMapConfig.xml");
        SqlSessionFactory sqlSessionFactory = new SqlSessionFactoryBuilder().build(resourceAsStream);
        SqlSession sqlSession = sqlSessionFactory.openSession();
        UserMapper mapper = sqlSession.getMapper(UserMapper.class);

        User user = mapper.findById(6);
        System.out.println("user中的birthday:" + user.getBirthday());

        sqlSession.commit();
        sqlSession.close();
    }

    @Test
    public void test1() throws IOException {
        InputStream resourceAsStream = Resources.getResourceAsStream("sqlMapConfig.xml");
        SqlSessionFactory sqlSessionFactory = new SqlSessionFactoryBuilder().build(resourceAsStream);
        SqlSession sqlSession = sqlSessionFactory.openSession();
        UserMapper mapper = sqlSession.getMapper(UserMapper.class);

        //模拟User
        User user = new User();
        user.setId(6);
        user.setUsername("jack");
        user.setPassword("123456");
        user.setBirthday(new Date());

        mapper.save(user);

        sqlSession.commit();
        sqlSession.close();
    }
}
```

**二、plugins标签**

Mybatis可以使用第三方的插件来对功能进行拓展，分页助手PageHelper是将分页的复杂操作进行封装，使用简单的方式即可获得分页的相关数据

开发步骤：

* 导入通用的PageHelper的坐标
* 在mybatis核心配置文件中配置PageHelper插件
* 测试分页数据获取

pom.xml

```xml
<dependency>
    <groupId>com.github.pagehelper</groupId>
    <artifactId>pagehelper</artifactId>
    <version>3.7.5</version>
</dependency>
<dependency>
    <groupId>com.github.jsqlparser</groupId>
    <artifactId>jsqlparser</artifactId>
    <version>4.0</version>
</dependency>
```

sqlMapConfig.xml

```xml
<!--配置分页助手插件-->
<plugins>
    <plugin interceptor="com.github.pagehelper.PageHelper">
        <property name="dialect" value="mysql"/>
    </plugin>
</plugins>
```

Test.java

```java
package com.priv.test;

import com.github.pagehelper.PageHelper;
import com.github.pagehelper.PageInfo;
import com.priv.domain.User;
import com.priv.mapper.UserMapper;
import org.apache.ibatis.io.Resources;
import org.apache.ibatis.session.SqlSession;
import org.apache.ibatis.session.SqlSessionFactory;
import org.apache.ibatis.session.SqlSessionFactoryBuilder;
import org.junit.Test;

import java.io.IOException;
import java.io.InputStream;
import java.util.Date;
import java.util.List;

/**
 * @author : 十一
 * @data : 19:36 2022/11/24
 */
public class MapperTest {

    @Test
    public void test3() throws IOException {
        InputStream resourceAsStream = Resources.getResourceAsStream("sqlMapConfig.xml");
        SqlSessionFactory sqlSessionFactory = new SqlSessionFactoryBuilder().build(resourceAsStream);
        SqlSession sqlSession = sqlSessionFactory.openSession();
        UserMapper mapper = sqlSession.getMapper(UserMapper.class);

        //设置分页相关参数 当前页 + 每页显示的条数
        PageHelper.startPage(2, 3);//实际加limit
        List<User> userList = mapper.findAll();
        for (User user : userList) {
            System.out.println(user);
        }

        //获取与分页相关的参数
        PageInfo<User> pageInfo = new PageInfo<>(userList);
        System.out.println("当前页：" + pageInfo.getPageNum());
        System.out.println("每页显示条数：" + pageInfo.getPageSize());
        System.out.println("总条数：" + pageInfo.getTotal());
        System.out.println("总页数：" + pageInfo.getPages());
        System.out.println("上一页：" + pageInfo.getPrePage());
        System.out.println("下一页：" + pageInfo.getNextPage());
        System.out.println("是否是第一个：" + pageInfo.isIsFirstPage());
        System.out.println("是否是最后一个：" + pageInfo.isIsLastPage());

        sqlSession.close();
    }
}
```

-----------

### 1.10Mybatis的多表操作

--------

**一、一对一查询的模型**

<img src="https://tonkyshan.cn/img/20221129113030.png" alt="20221129113030" style="zoom:67%;" />

orderMapper.xml

```xml
<?xml version="1.0" encoding="UTF-8" ?>
<!DOCTYPE mapper PUBLIC "-//mybatis.org//DTD Mapper 3.0//EN" "http://mybatis.org/dtd/mybatis-3-mapper.dtd">
<mapper namespace="com.priv.mapper.OrderMapper">

    <resultMap id="orderMap" type="order">
        <!--手动指定字段与实体属性的映射关系
            column：数据表的字段名称
            property：实体的属性名称
        -->
        <id column="oid" property="id"></id>
        <result column="ordertime" property="ordertime"></result>
        <result column="total" property="total"></result>
        <result column="uid" property="user.id"></result>
<!--        <result column="username" property="user.username"></result>-->
<!--        <result column="password" property="user.password"></result>-->
<!--        <result column="birthday" property="user.birthday"></result>-->
        <!--
            property:当前实体(order)中的属性名称(private User user)
            javaType:当前实体(order)中的属性的类型(User)
        -->
        <association property="user" javaType="user">
            <id column="uid" property="id"></id>
            <result column="username" property="username"></result>
            <result column="password" property="password"></result>
            <result column="birthday" property="birthday"></result>
        </association>
    </resultMap>

    <select id="findAll" resultMap="orderMap">
        select *,o.id oid from orders o, user u where o.uid = u.id;
    </select>
</mapper>
```

MapperTest.java

```java
package com.priv.test;

import com.priv.domain.Order;
import com.priv.mapper.OrderMapper;
import org.apache.ibatis.io.Resources;
import org.apache.ibatis.session.SqlSession;
import org.apache.ibatis.session.SqlSessionFactory;
import org.apache.ibatis.session.SqlSessionFactoryBuilder;
import org.junit.Test;

import java.io.IOException;
import java.io.InputStream;
import java.util.List;

/**
 * @author : 十一
 * @data : 12:07 2022/11/29
 */
public class MapperTest {

    @Test
    public void test1() throws IOException {
        InputStream resourceAsStream = Resources.getResourceAsStream("sqlMapConfig.xml");
        SqlSessionFactory sqlSessionFactory = new SqlSessionFactoryBuilder().build(resourceAsStream);
        SqlSession sqlSession = sqlSessionFactory.openSession();
        OrderMapper mapper = sqlSession.getMapper(OrderMapper.class);

        List<Order> orderList = mapper.findAll();
        for (Order order : orderList) {
            System.out.println(order);
        }

        sqlSession.close();
    }
}
```

**二、一对多查询模型**

<img src="https://tonkyshan.cn/img/20221203100547.png" style="zoom:67%;" />

OrderMapper.xml

```xml
<?xml version="1.0" encoding="UTF-8" ?>
<!DOCTYPE mapper PUBLIC "-//mybatis.org//DTD Mapper 3.0//EN" "http://mybatis.org/dtd/mybatis-3-mapper.dtd">
<mapper namespace="com.priv.mapper.OrderMapper">

    <resultMap id="orderMap" type="order">
        <!--手动指定字段与实体属性的映射关系
            column：数据表的字段名称
            property：实体的属性名称
        -->
        <id column="oid" property="id"></id>
        <result column="ordertime" property="ordertime"></result>
        <result column="total" property="total"></result>
        <result column="uid" property="user.id"></result>
<!--        <result column="username" property="user.username"></result>-->
<!--        <result column="password" property="user.password"></result>-->
<!--        <result column="birthday" property="user.birthday"></result>-->
        <!--
            property:当前实体(order)中的属性名称(private User user)
            javaType:当前实体(order)中的属性的类型(User)
        -->
        <association property="user" javaType="user">
            <id column="uid" property="id"></id>
            <result column="username" property="username"></result>
            <result column="password" property="password"></result>
            <result column="birthday" property="birthday"></result>
        </association>
    </resultMap>

    <select id="findAll" resultMap="orderMap">
        select *,o.id oid from orders o, user u where o.uid = u.id;
    </select>
</mapper>
```

UserMapper.xml

```xml
<?xml version="1.0" encoding="UTF-8" ?>
<!DOCTYPE mapper PUBLIC "-//mybatis.org//DTD Mapper 3.0//EN" "http://mybatis.org/dtd/mybatis-3-mapper.dtd">
<mapper namespace="com.priv.mapper.UserMapper">

    <resultMap id="userMap" type="user">
        <id column="uid" property="id"></id>
        <result column="username" property="username"></result>
        <result column="password" property="password"></result>
        <result column="birthday" property="birthday"></result>

        <!--
            配置集合信息：
            property：集合名称
            ofType：当前集合中的数据类型
        -->
        <collection property="orderList" ofType="order">
            <!--封装order的数据-->
            <id column="oid" property="id"></id>
            <result column="ordertime" property="ordertime"></result>
            <result column="total" property="total"></result>
        </collection>
    </resultMap>

    <select id="findAll" resultMap="userMap">
        SELECT *,o.id oid FROM USER u,orders o WHERE u.id=o.id
    </select>
</mapper>
```

MapperTest.java

```java
package com.priv.test;

import com.priv.domain.Order;
import com.priv.domain.User;
import com.priv.mapper.OrderMapper;
import com.priv.mapper.UserMapper;
import org.apache.ibatis.io.Resources;
import org.apache.ibatis.session.SqlSession;
import org.apache.ibatis.session.SqlSessionFactory;
import org.apache.ibatis.session.SqlSessionFactoryBuilder;
import org.junit.Test;

import java.io.IOException;
import java.io.InputStream;
import java.util.List;

/**
 * @author : 十一
 * @data : 12:07 2022/11/29
 */
public class MapperTest {

    @Test
    public void test2() throws IOException {
        InputStream resourceAsStream = Resources.getResourceAsStream("sqlMapConfig.xml");
        SqlSessionFactory sqlSessionFactory = new SqlSessionFactoryBuilder().build(resourceAsStream);
        SqlSession sqlSession = sqlSessionFactory.openSession();
        UserMapper sqlSessionMapper = sqlSession.getMapper(UserMapper.class);

        List<User> userList = sqlSessionMapper.findAll();
        for (User user : userList) {
            System.out.println(user);
        }

        sqlSession.close();
    }
    
}
```

**三、多对多查询模型**

<img src="https://tonkyshan.cn/img/20221203101619.png" alt="20221203101619" style="zoom:67%;" />

UserMapper.xml

```xml
<?xml version="1.0" encoding="UTF-8" ?>
<!DOCTYPE mapper PUBLIC "-//mybatis.org//DTD Mapper 3.0//EN" "http://mybatis.org/dtd/mybatis-3-mapper.dtd">
<mapper namespace="com.priv.mapper.UserMapper">

    <resultMap id="userMap" type="user">
        <id column="uid" property="id"></id>
        <result column="username" property="username"></result>
        <result column="password" property="password"></result>
        <result column="birthday" property="birthday"></result>

        <!--
            配置集合信息：
            property：集合名称
            ofType：当前集合中的数据类型
        -->
        <collection property="orderList" ofType="order">
            <!--封装order的数据-->
            <id column="oid" property="id"></id>
            <result column="ordertime" property="ordertime"></result>
            <result column="total" property="total"></result>
        </collection>
    </resultMap>

    <select id="findAll" resultMap="userMap">
        SELECT *,o.id oid FROM USER u,orders o WHERE u.id=o.id
    </select>
    
    <resultMap id="userRoleMap" type="user">
        <!--user的信息-->
        <id column="userId" property="id"></id>
        <result column="username" property="username"></result>
        <result column="password" property="password"></result>
        <result column="birthday" property="birthday"></result>
        <!--user内部的roleList信息-->
        <collection property="roleList" ofType="role">
            <id column="roleId" property="id"></id>
            <result column="roleName" property="roleName"></result>
            <result column="roleDesc" property="roleDesc"></result>
        </collection>

    </resultMap>
    <select id="findUserAndRoleAll" resultMap="userRoleMap">
        SELECT * FROM USER u,user_role ur,ROLE r WHERE u.id=ur.userId AND ur.roleId=r.id
    </select>
</mapper>
```

MapperTest.java

```java
package com.priv.test;

import com.priv.domain.Order;
import com.priv.domain.User;
import com.priv.mapper.OrderMapper;
import com.priv.mapper.UserMapper;
import org.apache.ibatis.io.Resources;
import org.apache.ibatis.session.SqlSession;
import org.apache.ibatis.session.SqlSessionFactory;
import org.apache.ibatis.session.SqlSessionFactoryBuilder;
import org.junit.Test;

import java.io.IOException;
import java.io.InputStream;
import java.util.List;

/**
 * @author : 十一
 * @data : 12:07 2022/11/29
 */
public class MapperTest {

    @Test
    public void test3() throws IOException {
        InputStream resourceAsStream = Resources.getResourceAsStream("sqlMapConfig.xml");
        SqlSessionFactory sqlSessionFactory = new SqlSessionFactoryBuilder().build(resourceAsStream);
        SqlSession sqlSession = sqlSessionFactory.openSession();
        UserMapper sqlSessionMapper = sqlSession.getMapper(UserMapper.class);

        List<User> userList = sqlSessionMapper.findUserAndRoleAll();
        for (User user : userList) {
            System.out.println(user);
        }

        sqlSession.close();
    }
}
```

**知识小结**

Mybatis多表配置方式：

一对一：使用< resultMap >配置

一对多：使用< resultMap > + < collection >配置

多对多：使用< resultMap > + < collection >配置

-------

### 1.11注解开发

-----

Mybatis注解开发模式减少编写Mapper映射文件。

常用注解：

@Insert：实现新增

@Update：实现更新

@Delete：实现删除

@Select：实现查询

@Result：实现结果集封装

@Results：可与@Result一起使用，封装多个结果集

@One：实现一对一结果集封装

@Many：实现一对多结果集封装

**传统方法**

UserMapper.java

```java
package com.priv.mapper;

import com.priv.domain.User;

import java.util.List;

/**
 * @author : 十一
 * @data : 11:38 2022/12/3
 */
public interface UserMapper {

    public void save(User user);

    public void update(User user);

    public void delete(int id);

    public User findById(int id);

    public List<User> findAll();
}
```

UserMapper.xml

```xml
<?xml version="1.0" encoding="UTF-8" ?>
<!DOCTYPE mapper PUBLIC "-//mybatis.org//DTD Mapper 3.0//EN" "http://mybatis.org/dtd/mybatis-3-mapper.dtd">
<mapper namespace="com.priv.mapper.UserMapper">
    <insert id="save" parameterType="user">
        insert into user values (#{id}, #{username}, #{password}, #{birthday})
    </insert>

    <update id="update" parameterType="user">
        update user set username = #{username}, password = #{password} where id = #{id}
    </update>

    <delete id="delete" parameterType="int">
        delete from user where id = #{id}
    </delete>

    <select id="findById" parameterType="int" resultType="user">
        select * from user where id = #{id}
    </select>

    <select id="findAll" resultType="user">
        select * from user
    </select>
</mapper>
```

MapperTest.java

```java
package com.priv.test;

import com.priv.domain.User;
import com.priv.mapper.UserMapper;
import org.apache.ibatis.io.Resources;
import org.apache.ibatis.session.SqlSession;
import org.apache.ibatis.session.SqlSessionFactory;
import org.apache.ibatis.session.SqlSessionFactoryBuilder;
import org.junit.Before;
import org.junit.Test;

import java.io.IOException;
import java.io.InputStream;
import java.util.List;

/**
 * @author : 十一
 * @data : 11:40 2022/12/3
 */
public class MapperTest {

    private UserMapper mapper;

    @Before
    public void before() throws IOException {
        InputStream resourceAsStream = Resources.getResourceAsStream("sqlMapConfig.xml");
        SqlSessionFactory sqlSessionFactory = new SqlSessionFactoryBuilder().build(resourceAsStream);
        SqlSession sqlSession = sqlSessionFactory.openSession(true);
        mapper = sqlSession.getMapper(UserMapper.class);
    }

    @Test
    public void testSave(){
        User user = new User();
        user.setUsername("tom");
        user.setPassword("abc");
        mapper.save(user);
    }

    @Test
    public void testUpdate(){
        User user = new User();
        user.setId(5);
        user.setUsername("lucy");
        user.setPassword("33225");
        mapper.update(user);
    }

    @Test
    public void testDelete(){
        mapper.delete(6);
    }

    @Test
    public void testfindById(){
        User user = mapper.findById(5);
        System.out.println(user);
    }

    @Test
    public void testfindAll(){
        List<User> userList = mapper.findAll();
        for (User user : userList) {
            System.out.println(user);
        }
    }

}
```

**注解开发**

sqlMapConfig.xml

```xml
<?xml version="1.0" encoding="UTF-8" ?>
<!DOCTYPE configuration PUBLIC "-//mybatis.org//DTD Config 3.0//EN" "http://mybatis.org/dtd/mybatis-3-config.dtd">
<configuration>

    <!--通过properties标签加载外部properties文件-->
    <properties resource="jdbc.properties"></properties>

    <typeAliases>
        <typeAlias type="com.priv.domain.User" alias="user"></typeAlias>
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

<!--    &lt;!&ndash;加载映射文件&ndash;&gt;-->
<!--    <mappers>-->
<!--        <mapper resource="com.priv.mapper/UserMapper.xml"></mapper>-->
<!--    </mappers>-->

    <!--加载映射关系-->
    <mappers>
        <package name="com.priv.mapper.UserMapper"/>
    </mappers>

</configuration>
```

UserMapper.java

```java
package com.priv.mapper;

import com.priv.domain.User;
import org.apache.ibatis.annotations.Delete;
import org.apache.ibatis.annotations.Insert;
import org.apache.ibatis.annotations.Select;
import org.apache.ibatis.annotations.Update;

import java.util.List;

/**
 * @author : 十一
 * @data : 11:38 2022/12/3
 */
public interface UserMapper {

    @Insert("insert into user values (#{id}, #{username}, #{password}, #{birthday})")
    public void save(User user);

    @Update("update user set username = #{username}, password = #{password} where id = #{id}")
    public void update(User user);

    @Delete("delete from user where id = #{id}")
    public void delete(int id);

    @Select("select * from user where id = #{id}")
    public User findById(int id);

    @Select("select * from user")
    public List<User> findAll();
}
```

---------

**二、Mybatis注解实现复杂映射开发**

​         实现复杂关系映射之前我们可以在映射文件中通过配置< resultMap >来实现，使用注解开发后，我们可以使用@Results注解，@Result注解，@One注解，@Many注解组合完成复杂关系的配置。

<img src="https://tonkyshan.cn/img/20221203141543.png" alt="20221203141543" style="zoom: 67%;" />

<img src="https://tonkyshan.cn/img/20221203141612.png" alt="20221203141612" style="zoom:67%;" />

**一对一**

UserMapper.java

```java
package com.priv.mapper;

import com.priv.domain.User;
import org.apache.ibatis.annotations.Delete;
import org.apache.ibatis.annotations.Insert;
import org.apache.ibatis.annotations.Select;
import org.apache.ibatis.annotations.Update;

import java.util.List;

/**
 * @author : 十一
 * @data : 11:38 2022/12/3
 */
public interface UserMapper {

    @Insert("insert into user values (#{id}, #{username}, #{password}, #{birthday})")
    public void save(User user);

    @Update("update user set username = #{username}, password = #{password} where id = #{id}")
    public void update(User user);

    @Delete("delete from user where id = #{id}")
    public void delete(int id);

    @Select("select * from user where id = #{id}")
    public User findById(int id);

    @Select("select * from user")
    public List<User> findAll();
}
```

OrderMapper.java

```java
package com.priv.mapper;

import com.priv.domain.Order;
import com.priv.domain.User;
import org.apache.ibatis.annotations.One;
import org.apache.ibatis.annotations.Result;
import org.apache.ibatis.annotations.Results;
import org.apache.ibatis.annotations.Select;

import java.util.List;

/**
 * @author : 十一
 * @data : 14:27 2022/12/3
 */
public interface OrderMapper {

    @Select("select * from orders")
    @Results({
              @Result(column = "id", property = "id"),
              @Result(column = "ordertime", property = "ordertime"),
              @Result(column = "total", property = "total"),
              @Result(
                      property = "user",//要封装的属性名称
                      column = "uid",//根据哪个字段去查询user表的数据
                      javaType = User.class,//要封装的实体类型
                      //select属性 代表查询哪个接口的方法获得数据
                      one = @One(select = "com.priv.mapper.UserMapper.findById")
              )
    })
    public List<Order> findAll();

//    @Select("select *, o.id oid from orders o, user u where o.uid = u.id")
//    @Results({
//            @Result(column = "oid", property = "id"),
//            @Result(column = "ordertime", property = "ordertime"),
//            @Result(column = "total", property = "total"),
//            @Result(column = "uid", property = "user.id"),
//            @Result(column = "username", property = "user.username"),
//            @Result(column = "password", property = "user.password")
//
//    })
//    public List<Order> findAll();
}
```

MapperTest.java

```java
package com.priv.test;

import com.priv.domain.Order;
import com.priv.mapper.OrderMapper1;
import org.apache.ibatis.io.Resources;
import org.apache.ibatis.session.SqlSession;
import org.apache.ibatis.session.SqlSessionFactory;
import org.apache.ibatis.session.SqlSessionFactoryBuilder;
import org.junit.Before;
import org.junit.Test;

import java.io.IOException;
import java.io.InputStream;
import java.util.List;

/**
 * @author : 十一
 * @data : 11:40 2022/12/3
 */
public class MapperTest {

    private OrderMapper mapper;

    @Before
    public void before() throws IOException {
        InputStream resourceAsStream = Resources.getResourceAsStream("sqlMapConfig.xml");
        SqlSessionFactory sqlSessionFactory = new SqlSessionFactoryBuilder().build(resourceAsStream);
        SqlSession sqlSession = sqlSessionFactory.openSession(true);
        mapper = sqlSession.getMapper(OrderMapper.class);
    }

    @Test
    public void testfindAll(){
        List<Order> orderList = mapper.findAll();
        for (Order order : orderList) {
            System.out.println(order);
        }
    }

}
```

**一对多**

UserMapper.java

```java
package com.priv.mapper;

import com.priv.domain.User;
import org.apache.ibatis.annotations.*;

import java.util.List;

/**
 * @author : 十一
 * @data : 11:38 2022/12/3
 */
public interface UserMapper {
    
    @Select("select * from user")
    @Results({
            @Result(id = true, column = "id", property = "id"),
            @Result(column = "username", property = "username"),
            @Result(column = "password", property = "password"),
            @Result(
                    property = "orderList",
                    column = "id",
                    javaType = List.class,
                    many = @Many(select = "com.priv.mapper.OrderMapper.findByUid")
            )
    })
    public List<User> findUserAndOrderAll();
}
```

OrderMapper.java

```java
package com.priv.mapper;

import com.priv.domain.Order;
import com.priv.domain.User;
import org.apache.ibatis.annotations.One;
import org.apache.ibatis.annotations.Result;
import org.apache.ibatis.annotations.Results;
import org.apache.ibatis.annotations.Select;

import java.util.List;

/**
 * @author : 十一
 * @data : 14:27 2022/12/3
 */
public interface OrderMapper1 {

    @Select("select * from orders where uid = #{uid}")
    public List<Order> findByUid(int uid);

}
```

MapperTest.java

```java
package com.priv.test;

import com.priv.domain.User;
import com.priv.mapper.UserMapper1;
import org.apache.ibatis.io.Resources;
import org.apache.ibatis.session.SqlSession;
import org.apache.ibatis.session.SqlSessionFactory;
import org.apache.ibatis.session.SqlSessionFactoryBuilder;
import org.junit.Before;
import org.junit.Test;

import java.io.IOException;
import java.io.InputStream;
import java.util.List;

/**
 * @author : 十一
 * @data : 11:40 2022/12/3
 */
public class MapperTest {

    private UserMapper mapper;

    @Before
    public void before() throws IOException {
        InputStream resourceAsStream = Resources.getResourceAsStream("sqlMapConfig.xml");
        SqlSessionFactory sqlSessionFactory = new SqlSessionFactoryBuilder().build(resourceAsStream);
        SqlSession sqlSession = sqlSessionFactory.openSession(true);
        mapper = sqlSession.getMapper(UserMapper.class);
    }

    @Test
    public void testfindUserAndOrderAll(){
        List<User> userList = mapper.findUserAndOrderAll();
        for (User user : userList) {
            System.out.println(user);
        }
    }

}
```

**多对多**

UserMapper.java

```java
package com.priv.mapper;

import com.priv.domain.User;
import org.apache.ibatis.annotations.*;

import java.util.List;

/**
 * @author : 十一
 * @data : 11:38 2022/12/3
 */
public interface UserMapper {

    @Select("select * from user")
    @Results({
            @Result(id = true, column = "id", property = "id"),
            @Result(id = true, column = "username", property = "username"),
            @Result(id = true, column = "password", property = "password"),
            @Result(
                    property = "roleList",
                    column = "id",
                    javaType = List.class,
                    many = @Many(select = "com.priv.mapper.RoleMapper.findByUid")
            )
    })
    public List<User> findUserAndRoleAll();
}
```

RoleMapper.java

```java
package com.priv.mapper;

import com.priv.domain.Role;
import org.apache.ibatis.annotations.Select;

import java.util.List;

/**
 * @author : 十一
 * @data : 15:32 2022/12/3
 */
public interface RoleMapper {

    @Select("select * from user_role ur, role r where ur.roleId = r.id and ur.userId = #{uid}")
    public List<Role> findByUid(int id);
}
```

Test.java

```java
package com.priv.test;

import com.priv.domain.User;
import com.priv.mapper.UserMapper1;
import org.apache.ibatis.io.Resources;
import org.apache.ibatis.session.SqlSession;
import org.apache.ibatis.session.SqlSessionFactory;
import org.apache.ibatis.session.SqlSessionFactoryBuilder;
import org.junit.Before;
import org.junit.Test;

import java.io.IOException;
import java.io.InputStream;
import java.util.List;

/**
 * @author : 十一
 * @data : 11:40 2022/12/3
 */
public class MapperTest {

    private UserMapper mapper;

    @Before
    public void before() throws IOException {
        InputStream resourceAsStream = Resources.getResourceAsStream("sqlMapConfig.xml");
        SqlSessionFactory sqlSessionFactory = new SqlSessionFactoryBuilder().build(resourceAsStream);
        SqlSession sqlSession = sqlSessionFactory.openSession(true);
        mapper = sqlSession.getMapper(UserMapper.class);
    }

    @Test
    public void testfindUserAndRoleAll(){
        List<User> userList = mapper.findUserAndRoleAll();
        for (User user : userList) {
            System.out.println(user);
        }
    }

}
```

-----------

## 小结

关于Spring整合Mybatis将在Spring中展示

相关源码请查看[gitee仓库](https://gitee.com/are-you-a-cookie/my-batis)
