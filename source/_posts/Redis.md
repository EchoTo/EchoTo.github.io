---
title: Redis
date: 2022-04-02 19:03:35
tags: [Redis,NoSQL,Jedis]
categories: [JavaWeb,NoSQL]
---

## Redis

-----

## 第一章   概念

-----

### 1.1概念

---

redis是一款高性能的NOSQL系列的非关系型数据库

![1](https://tonkyshan.cn/img/1..bmp)

-----

### 1.2NOSQL

----

NoSQL (NoSQL = Not only sQL)，意即“不仅仅是SQL”，是一项全新的数据库理念，泛指非关系型的数据库。

随着互联网web2.0网站的兴起，传统的关系数据库在应付web2.0网站，特别是超大规模和高并发的SNS类型的web2.0纯动态网站已经显得力不从心，暴露了很多难以克服的问题，而非关系型的数据库则由于其本身的特点得到了非常间速的发展。NoSQL数据库的产生就是为了解决大规模数据集合多重数据种类带来的挑战，尤其是大数据应用难题。

---

### 1.3对比

------

**优点∶**

* 成本: nosql数据库简单易部署，基本都是开源软件，不需要像使用oracle那样花费大量成本购买使用，相比关系型数据库价格便宜。
* 查询速度: nosql数据库将数据存储于缓存之中，关系型数据库将数据存储在硬盘中，自然查询速度远不及nosql数据库。
* 存储数据的格式: nosql的存储格式是key，value形式、文档形式、图片形式等等，所以可以存储基础类型以及对象或者是集合等各种格式，而数据库则只支持基础类型。
* 扩展性∶关系型数据库有类似join这样的多表查询机制的限制导致扩展很艰难。

**缺点：**

* 维护的工具和资料有限，因为nosql是属于新的技术，不能和关系型数据库10几年的技术同日而语。
* 不提供对sql的支持，如果不支持sql这样的工业标准，将产生一定用户的学习和使用成本。
* 不提供关系型数据库对事务的处理。

**非关系型数据库的优势∶**

* 性能NOSQL是基于键值对的，可以想象成表中的主键和值的对应关系，而且不需要经过SQL层的解析，所以性能非常高。
* 可扩展性同样也是因为基于键值对，数据之间没有耦合性，所以非常容易水平扩展。

**关系型数据库的优势︰**

* 复杂查询可以用SQL语句方便的在一个表以及多个表之间做非常复杂的数据查询。
* 事务支持使得对于安全性能很高的数据访问要求得以实现。对于这两类数据库，对方的优势就是自己的弱势，反之亦然。

**总结**
关系型数据库与NOSQL数据库并非对立而是互补的关系，即通常情况下使用关系型数据库，在适合使用NOSQL的时候使用NOSQL数据库，让NOSQL数据库对关系型数据库的不足进行弥补。

一般会将数据存储在关系型数据库中，在NOSQL数据库中备份存储关系型数据库的数据。

-------

### 1.4Redis

-----

Redis是用C语言开发的一个开源的高性能键值对(key -value)数据库，官方提供测试数据，50个并发执行100000个请求，读的速度是110000次/s,写的速度是81000次/s，且Redis通过提供多种键值数据类型来适应不同场景下的存储需求。目前为止Redis支持的键值数据类型如下:

* 字符串类型string
* 哈希类型hash
* 列表类型list
* 集合类型set
* 有序集合类型sortedset

**redis的应用场景**

* 缓存(数据查询、短连接、新闻内容、商品内容等等)
* 聊天室的在线好友列表
* 任务队列。(秒杀、抢购、306等等)
* 应用排行榜
* 网站访问统计
* 数据过期处理(可以精确到毫秒)
* 分布式集群架构中的session分离

------

* redis.windows.conf :配置文件
* redis-cli.exe : redis的客户端
* redis-server.exe : redis服务器端

------

## 第二章   命令操作

-----

### 2.1redis的数据结构

----

redis存储的是：Key，Value格式的数据，其中Key都是字符串，Value有5种不同的数据结构

* 字符串类型：string
* 哈希类型 hash : map格式
* 列表类型 list : linkedlist格式
* 集合类型 set
* 有序集合类型：sortedset

![2](https://tonkyshan.cn/img/2.bmp)

-------

### 2.2操作命令

------

**1.字符串类型   string**

* 存储：set  key  value
* 获取：get  key --->得到value
* 删除：del  key

**2.哈希类型   hash**

* 存储：hset key filed value
* 获取：
  * hget key filed：获取指定的filed对应的值
  * hgetall key：获取所有的filed和value
* 删除：hdel key filed

**3.列表类型   list**

可以添加一个元素到列表的头部(左边)或者尾部(右边)

![3.列表list数据结构](https://tonkyshan.cn/img/3..bmp)

1.添加：

* lpush key value：将元素加入列表左边
* rpush key value：将元素加入列表右边

2.获取：

* lrange key start end：范围获取

3.删除：

* lpop key：删除列表最左边的元素，并将元素返回
* rpop key：删除列表最右边的元素，并将元素返回

**4.集合类型  set**

不允许重复

1.存储：

* sadd key value

2.获取：

* smembers key：获取set集合中所有元素

3.删除：

* srem key value：删除set集合中的某个元素

**5.有序集合类型  sortedset**

不允许重复元素，且元素有顺序

1.存储：

* zadd key score value

2.获取：

* zrange key start end

3.删除：

* zren key value

**6.通用命令**

* key * ：查询所有的键
* type key：获取键对应的value的类型
* del key：删除指定的key value

------

## 第三章   持久化操作

-----

1.redis是一个内存数据库，当reds服务器重后，或者电脑重后，数据会丢失，我们可以将redis内存中的数据持久化保存到硬盘的文件中。

2.redis持久化机制：

* RDB：默认方式，不需要进行配置，默认就使用这种机制
  * 在一定的间隔时间中，检测key的变化情况，然后持久化数据
* AOF：日志记录的方式，可以记录每一条命令的操作。可以每一次命令操作后，持久化数据

--------

### 2.1RDB

-----

**1.编辑redis.windows.conf文件**

#after 900 sec (15 min) if at least 1 key changed

**save 900 1**

#after 300 sec (5 min) if at least 10 keys changed

**save 300 10**

#after 60 sec if at least 10000 keys changed

**save 60 10000**

**会生成.rdb文件**

**2.重新启动redis服务器，并指定配置文件名称**

redis根目录下 cmd `>redis-server.exe redis.windows.conf`

-----

### 2.2AOF

-----

配置文件中找到：appendonly 

默认值为no(关闭AOF)

改为yes后(开启AOF)

* appendfsync always：每一次操作都进行持久化
* appendfsync everysec：每隔一秒进行一次持久化**(默认开启)**
* appendfsync no：不进行持久化

**会生成.aof文件**

-----

## 第四章   Jedis

------

* Jedis：一款java操作redis数据库的工具

-------

### 4.1Jedis快速入门

```java
package com.priv.jedis.test;

import org.junit.Test;
import redis.clients.jedis.Jedis;

/*
* jedis测试类
* */
public class JedisTest {
    @Test
    public void test1(){
        //1.获取连接
        Jedis jedis = new Jedis("localhost", 6379);
        //2.操作
        jedis.set("username","zhangsan");
        //3.关闭连接
        jedis.close();

    }
}
```

![20220330232805](https://tonkyshan.cn/img/20220330232805.png)

* Jedis操作各种redis中的数据结构

```java
package com.priv.jedis.test;

import com.priv.jedis.utils.JedisPoolUtils;
import org.junit.Test;
import redis.clients.jedis.Jedis;
import redis.clients.jedis.JedisPool;
import redis.clients.jedis.JedisPoolConfig;

import java.util.List;
import java.util.Map;
import java.util.Set;

/*
* jedis测试类
* */
public class JedisTest {
    @Test
    public void test1() {
        //1.获取连接
        Jedis jedis = new Jedis("localhost", 6379);
        //2.操作
        jedis.set("username", "zhangsan");
        //3.关闭连接
        jedis.close();

    }

    /**
     * string 数据结构操作
     */
    @Test
    public void test2() {
        //1. 获取连接
        Jedis jedis = new Jedis();//如果使用空参构造，默认值 "localhost",6379端口
        //2. 操作
        //存储
        jedis.set("username", "zhangsan");
        //获取
        String username = jedis.get("username");
        System.out.println(username);

        //可以使用setex()方法存储可以指定过期时间的 key value
        jedis.setex("activecode", 20, "hehe");//将activecode：hehe键值对存入redis，并且20秒后自动删除该键值对

        //3. 关闭连接
        jedis.close();
    }

    /**
     * hash 数据结构操作
     */
    @Test
    public void test3() {
        //1. 获取连接
        Jedis jedis = new Jedis();//如果使用空参构造，默认值 "localhost",6379端口
        //2. 操作
        // 存储hash
        jedis.hset("user", "name", "lisi");
        jedis.hset("user", "age", "23");
        jedis.hset("user", "gender", "female");

        // 获取hash
        String name = jedis.hget("user", "name");
        System.out.println(name);


        // 获取hash的所有map中的数据
        Map<String, String> user = jedis.hgetAll("user");

        // keyset
        Set<String> keySet = user.keySet();
        for (String key : keySet) {
            //获取value
            String value = user.get(key);
            System.out.println(key + ":" + value);
        }

        //3. 关闭连接
        jedis.close();
    }


    /**
     * list 数据结构操作
     */
    @Test
    public void test4() {
        //1. 获取连接
        Jedis jedis = new Jedis();//如果使用空参构造，默认值 "localhost",6379端口
        //2. 操作
        // list 存储
        jedis.lpush("mylist", "a", "b", "c");//从左边存
        jedis.rpush("mylist", "a", "b", "c");//从右边存

        // list 范围获取
        List<String> mylist = jedis.lrange("mylist", 0, -1);
        System.out.println(mylist);

        // list 弹出
        String element1 = jedis.lpop("mylist");//c
        System.out.println(element1);

        String element2 = jedis.rpop("mylist");//c
        System.out.println(element2);

        // list 范围获取
        List<String> mylist2 = jedis.lrange("mylist", 0, -1);
        System.out.println(mylist2);

        //3. 关闭连接
        jedis.close();
    }


    /**
     * set 数据结构操作
     */
    @Test
    public void test5() {
        //1. 获取连接
        Jedis jedis = new Jedis();//如果使用空参构造，默认值 "localhost",6379端口
        //2. 操作


        // set 存储
        jedis.sadd("myset", "java", "php", "c++");

        // set 获取
        Set<String> myset = jedis.smembers("myset");
        System.out.println(myset);

        //3. 关闭连接
        jedis.close();
    }

    /**
     * sortedset 数据结构操作
     */
    @Test
    public void test6() {
        //1. 获取连接
        Jedis jedis = new Jedis();//如果使用空参构造，默认值 "localhost",6379端口
        //2. 操作
        // sortedset 存储
        jedis.zadd("mysortedset", 3, "亚瑟");
        jedis.zadd("mysortedset", 30, "后裔");
        jedis.zadd("mysortedset", 55, "孙悟空");

        // sortedset 获取
        Set<String> mysortedset = jedis.zrange("mysortedset", 0, -1);

        System.out.println(mysortedset);


        //3. 关闭连接
        jedis.close();
    }
    
}
```

--------

### 4.2Jedis连接池

------

JedisPool

* 使用：
  * 创建JedisPool连接池对象
  * 调用方法getResource()方法获取Jedis连接

```java
package com.priv.jedis.test;

import com.priv.jedis.utils.JedisPoolUtils;
import org.junit.Test;
import redis.clients.jedis.Jedis;
import redis.clients.jedis.JedisPool;
import redis.clients.jedis.JedisPoolConfig;

import java.util.List;
import java.util.Map;
import java.util.Set;

public class JedisTest {
/**
 * jedis连接池使用
 */
@Test
public void test7() {

    //0.创建一个配置对象
    JedisPoolConfig config = new JedisPoolConfig();
    config.setMaxTotal(50);//最大允许的连接数
    config.setMaxIdle(10);//最大空闲连接

    //1.创建Jedis连接池对象
    JedisPool jedisPool = new JedisPool(config, "localhost", 6379);

    //2.获取连接
    Jedis jedis = jedisPool.getResource();
    //3. 使用
    jedis.set("hehe", "heihei");


    //4. 关闭 归还到连接池中
    jedis.close();

   }
}    
```

**Jedis连接池工具类**

```properties
host=127.0.0.1
port=6379
maxTotal=50
maxIdle=10
```

```java
package com.priv.jedis.utils;

import redis.clients.jedis.Jedis;
import redis.clients.jedis.JedisPool;
import redis.clients.jedis.JedisPoolConfig;

import java.io.IOException;
import java.io.InputStream;
import java.util.Properties;

/**
 JedisPool工具类
    加载配置文件，配置连接池的参数
    提供获取连接的方法

 */
public class JedisPoolUtils {

    private static JedisPool jedisPool;

    static{
        //读取配置文件
        InputStream is = JedisPoolUtils.class.getClassLoader().getResourceAsStream("jedis.properties");
        //创建Properties对象
        Properties pro = new Properties();
        //关联文件
        try {
            pro.load(is);
        } catch (IOException e) {
            e.printStackTrace();
        }
        //获取数据，设置到JedisPoolConfig中
        JedisPoolConfig config = new JedisPoolConfig();
        config.setMaxTotal(Integer.parseInt(pro.getProperty("maxTotal")));
        config.setMaxIdle(Integer.parseInt(pro.getProperty("maxIdle")));

        //初始化JedisPool
        jedisPool = new JedisPool(config,pro.getProperty("host"),Integer.parseInt(pro.getProperty("port")));



    }


    /**
     * 获取连接方法
     */
    public static Jedis getJedis(){
        return jedisPool.getResource();
    }
}
```

```java
package com.priv.jedis.test;

import com.priv.jedis.utils.JedisPoolUtils;
import org.junit.Test;
import redis.clients.jedis.Jedis;
import redis.clients.jedis.JedisPool;
import redis.clients.jedis.JedisPoolConfig;

import java.util.List;
import java.util.Map;
import java.util.Set;

public class JedisTest {
/**
 * jedis连接池工具类使用
 */
@Test
public void test8() {

    //通过连接池工具类获取
    Jedis jedis = JedisPoolUtils.getJedis();


    //3. 使用
    jedis.set("hello", "world");


    //4. 关闭 归还到连接池中
    jedis.close();
	}
}
```
