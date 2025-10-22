---
title: Servlet
date: 2022-04-02 18:59:52
tags: [Servlet,JSP,Cookie,Session,MVC,EL,JSTL,三层架构]
categories: JavaWeb
---

## Servlet

----------

## 第一章  Servlet规范

-------------

### 1.1介绍

--------

1.servlet规范来自于JavaEE规范中的一种

2.作用

* 在Servlet规范中，指定动态资源文件开发步骤
* 在Servlet规范中，指定Http服务器调用动态资源文件规则
* 在Servlet规范中，指定Http服务器管理动态资源文件实例对象规则

![](https://tonkyshan.cn/img/20211009095450.png)

**HTTP**

* 概念：Hyper Text Transfer Protocol 超文本传输协议
  * 传输协议：定义了，客户端和服务器端通信时，发送数据的格式
  * 特点：
    * 基于TCP/IP的高级协议
    * 默认端口号：80
    * 基于请求/响应模型的：一次请求对应一次响应
    * 无状态的：每次请求之间相互独立，不能交互数据

-------

### 1.2Servlet接口实现类开发步骤

----

**一.Servlet接口实现类**

1.Servlet接口来自于Servlet规范下一个接口，这个接口存在于Http服务器提供的jar包

2.Tomcat服务器下lib文件有一个servlet-api.jar存放Servlet接口(javax.servlet.Servlet接口)

3.Servlet规范中任务，Http服务器能调用的【动态资源文件】必须是一个Servlet接口实现类

例子：

```java
class Student{
    //不是动态资源文件，Tomcat无权调用
}
class Teacher implement Servlet{
    //合法动态资源文件，Tomcat有权利调用
    
    Servlet obj = new Teacher();
    obj.doGet();
}
```

----

**二.开发步骤**

* **第一步：创建一个Java类继承HttpServlet父类，使之成为一个Servlet接口实现类**

**抽象类作用：**

降低接口实现类对接口实现过程难度

将接口中不需要使用抽象方法教给抽象类进行完成，这样接口实现类，只需要对接口需要方法进行重写

`servlet`接口：

`init`

`getServletConfig`

`getServletInfo`

`destory`--------------------四个方法对于Servlet接口实现类没用



`service()`----------------有用

Tomcat根据Servlet规范调用Servlet接口实现类规则：

1.Tomcat有权创建Servlet接口实现类实例对象

```java
Servlet Demo01Servlet = new Demo01Servlet();
```

2.Tomcat根据实例对象调用`service`方法处理当前请求

```java
Demo01Servlet.service();
```

​                             extends                                          extends                                             implements

`Demo01Servlet`--------------->`(abstract)HttpServlet`--------------->`(abstract)GenericServlet`--------------->`servlet接口`

其他四个方法均为空，只有service()实现

* **第二步：重写HttpServlet父类中的两个方法，doGet或者doPost**

前提：重写规则，抽象类作用，子类实现接口规则，this指向，继承规则

​           get
浏览器-----> oneservlet.doGet()
​           post
浏览器------> oneservlet.doPost()

```java
//HttpServlet源码
protected void service(HttpServletRequest req, HttpServletResponse resp) throws ServletException, IOException {
    String method = req.getMethod();//拿到请求包里面的请求方式，获取浏览器是以何种方式进行请求的
    long lastModified;
    if (method.equals("GET")) {
        lastModified = this.getLastModified(req);
        if (lastModified == -1L) {
            this.doGet(req, resp);
        } else {
            long ifModifiedSince;
            try {
                ifModifiedSince = req.getDateHeader("If-Modified-Since");
            } catch (IllegalArgumentException var9) {
                ifModifiedSince = -1L;
            }

            if (ifModifiedSince < lastModified / 1000L * 1000L) {
                this.maybeSetLastModified(resp, lastModified);
                this.doGet(req, resp);
            } else {
                resp.setStatus(304);
            }
        }
    } else if (method.equals("HEAD")) {
        lastModified = this.getLastModified(req);
        this.maybeSetLastModified(resp, lastModified);
        this.doHead(req, resp);
    } else if (method.equals("POST")) {
        this.doPost(req, resp);
    } else if (method.equals("PUT")) {
        this.doPut(req, resp);
    } else if (method.equals("DELETE")) {
        this.doDelete(req, resp);
    } else if (method.equals("OPTIONS")) {
        this.doOptions(req, resp);
    } else if (method.equals("TRACE")) {
        this.doTrace(req, resp);
    } else {
        String errMsg = lStrings.getString("http.method_not_implemented");
        Object[] errArgs = new Object[]{method};
        errMsg = MessageFormat.format(errMsg, errArgs);
        resp.sendError(501, errMsg);
    }

}
```

通过父类决定在何种情况下调用子类中方法-------【设计模式】---模板设计模式

```java
//HttpServlet:
service {
        if(请求方式==GET){
            this.doGet
         }else if(请求方式== POST){
            this.doPost
         }
}
```

```java
package com.priv.controller.demo01Servlet;

import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServlet;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

import java.io.IOException;

public class Demo01Servlet extends HttpServlet {
    @Override
    protected void doGet(HttpServletRequest req, HttpServletResponse resp) throws ServletException, IOException {
        System.out.println("Demo01Servlet类针对浏览器发送GET请求方式处理");
    }

    @Override
    protected void doPost(HttpServletRequest req, HttpServletResponse resp) throws ServletException, IOException {
        System.out.println("Demo01Servlet类针对浏览器发送POST请求方式处理");
    }
}

//oneServlet:
//doGet doPost
Servlet Demo01Servlet = new Demo01Servlet();
Demo01Servlet.service()
```

* **第三步：将Servlet接口实现类信息【注册】到Tomcat服务器**

【网站】--->【web】 --->【WEB-INF】--->web.xml

```html
<!--将Servlet接口实现类类路径地址交给Tomcat-->
<servlet>
    <servlet-name>s1</servlet-name>
    <!--声明一个变量存储servlet接口实现类类路径-->
    <servlet-calss>com.priv.controller.demo01Servlet.Demo01Servlet</servlet-calss>
    <!--声明servlet接口实现类类路径-->
</servlet>

Tomcat String s1 = "com.priv.controller.demo01Servlet.Demo01Servlet"
<!---为了降低用户访问Servlet接口实现类难度，需要设置简短的请求别名--->
<servlet-mapping>
    <servlet-name>s1</servlet-name>
    <url-pattern>/one</url-pattern>
    <!---设置简短请求别名，别名在书写的时候必须以"/"为开头--->
</servlet-mapping>
```

---------

**实现：**

```java
package com.priv.controller.demo01Servlet;

import javax.servlet.ServletException;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import java.io.IOException;

public class Demo01Servlet extends HttpServlet {
    @Override
    protected void doGet(HttpServletRequest req, HttpServletResponse resp) throws ServletException, IOException {
        System.out.println("Demo01Servlet类针对浏览器发送GET请求方式处理");
    }

    @Override
    protected void doPost(HttpServletRequest req, HttpServletResponse resp) throws ServletException, IOException {
        System.out.println("Demo01Servlet类针对浏览器发送POST请求方式处理");
    }
}
```

```xml
<?xml version="1.0" encoding="UTF-8"?>
<web-app xmlns="http://xmlns.jcp.org/xml/ns/javaee"
         xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
         xsi:schemaLocation="http://xmlns.jcp.org/xml/ns/javaee http://xmlns.jcp.org/xml/ns/javaee/web-app_4_0.xsd"
         version="4.0">
<!--         servlet接口实现类类路径交给Tomcat-->
    <servlet>
        <servlet-name>Demo01Servlet</servlet-name>
        <servlet-class>com.priv.controller.demo01Servlet.Demo01Servlet</servlet-class>
    </servlet>
    <servlet-mapping>
        <servlet-name>Demo01Servlet</servlet-name>
        <url-pattern>/one</url-pattern>
    </servlet-mapping>
</web-app>
```

以Tomcat8运行文件

![](https://tonkyshan.cn/img/20211024105031.png)

![](https://tonkyshan.cn/img/20211024105116.png)

![20211024105134](https://tonkyshan.cn/img/20211024105134.png)

在ulr处改写/one

![20211024105207](https://tonkyshan.cn/img/20211024105207.png)

**结果**

![20211024105213](https://tonkyshan.cn/img/20211024105213.png)

------------

### 1.3Servlet生命周期

-------

1.网站中所有的Servlet接口实现类的实例对象，只能由Http服务器负责创建

   开发人员不能手动创建Servlet接口实现类的实例对象

2.在默认的情况下，Http服务器接收到对于当前Servlet接口实现类第一次请求时，自动创建这个Servlet接口实现类的实例对象

   在手动配置情况下，要求Http服务器在启动时自动创建某个Servlet接口实现类的实例对象

```xml
 <servlet>
        <servlet-name>Demo01Servlet</servlet-name>
        <servlet-class>com.priv.controller.demo01Servlet.Demo01Servlet</servlet-class>
        <load-on-startup>30</load-on-startup><!---填写一个大于0的整数即可--->
    </servlet>
```

3.在Http服务器运行期间，一个Servlet接口实现类只能被创建出一个实例对象

4.在Http服务器关闭时刻，自动将网站中所有的Servlet对象进行销毁

-----

**实例：**

```java
//在Http服务器接收请求后创建对象
package com.priv.controller.demo01Servlet;

import javax.servlet.ServletException;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;

public class Demo02ServletLife extends HttpServlet {
    public Demo02ServletLife() {
        System.out.println("Demo02ServletLife类被创建实例对象");
    }

    protected void doPost(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {

    }

    protected void doGet(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
        System.out.println("Demo02ServletLife doGet is run...");
    }
}
```

```java
//通知Tomcat在启动时负责创建实例对象
package com.priv.controller.demo01Servlet;

import javax.servlet.ServletException;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;

public class Demo03ServletLife extends HttpServlet {
    public Demo03ServletLife() {
        System.out.println("Demo03ServletLife实例对象被创建了");
    }

    protected void doPost(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {

    }

    protected void doGet(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
        System.out.println("Demo03ServletLife doGet is run...");
    }
}
```

```xml
<?xml version="1.0" encoding="UTF-8"?>
<web-app xmlns="http://xmlns.jcp.org/xml/ns/javaee"
         xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
         xsi:schemaLocation="http://xmlns.jcp.org/xml/ns/javaee http://xmlns.jcp.org/xml/ns/javaee/web-app_4_0.xsd"
         version="4.0">
<!--         servlet接口实现类类路径交给Tomcat-->
    <servlet>
        <servlet-name>Demo01Servlet</servlet-name>
        <servlet-class>com.priv.controller.demo01Servlet.Demo01Servlet</servlet-class>
    </servlet>

    <servlet-mapping>
    <servlet-name>Demo01Servlet</servlet-name>
    <url-pattern>/one</url-pattern>
    </servlet-mapping>

    <servlet>
        <servlet-name>Demo02ServletLife</servlet-name>
        <servlet-class>com.priv.controller.demo01Servlet.Demo02ServletLife</servlet-class>
    </servlet>

    <servlet-mapping>
        <servlet-name>Demo02ServletLife</servlet-name>
        <url-pattern>/two</url-pattern>
    </servlet-mapping>

    <servlet>
        <servlet-name>Demo03ServletLife</servlet-name>
        <servlet-class>com.priv.controller.demo01Servlet.Demo03ServletLife</servlet-class>
        <!--通知Tomcat在启动时负责创建Demo03ServletLife实例对象-->
        <load-on-startup>9</load-on-startup>
    </servlet>

    <servlet-mapping>
        <servlet-name>Demo03ServletLife</servlet-name>
        <url-pattern>/three</url-pattern>
    </servlet-mapping>
</web-app>
```

![20211024123024](https://tonkyshan.cn/img/20211024123024.png)

![20211024123221](https://tonkyshan.cn/img/20211024123221.png)

**当服务器接收到请求时**

![20211024123312](https://tonkyshan.cn/img/20211024123312.png)

![20211024123435](https://tonkyshan.cn/img/20211024123435.png)

**当服务器接收到请求/two时，Demo02ServletLife类被创建实例对象**

![20211024123801](https://tonkyshan.cn/img/20211024123801.png)

**当服务停止时，实例对象被销毁**

![20211024123945](https://tonkyshan.cn/img/20211024123945.png)

> 以上就是Servlet的生命周期

------------

### 1.4HttpServletResponse接口

---------

响应消息：服务器端发送给客户端的数据。

* 响应行：HTTP/1.1 200 OK
  * 组成：协议/版本   响应状态码  状态码描述
  * 状态码都是三位数字：
    * 1xx：服务器接收客户端消息，但没有接收完成，等待一段时间后，发送1xx状态码
    * 2xx：成功。代表：200
    * 3xx：重定向。代表：302(重定向)   304(访问缓存)
    * 4xx：客户端错误   404(请求路径没有对应的资源)   405(请求方式没有对应的doXxx方法)
    * 5xx：服务器端错误  代表：500(服务器内部出现异常)
* 响应头：KV键值对
  * 格式：头名称：值
  * 常见的响应头：
    * Content-Type:服务器告诉客户端本次响应体数据格式以及编码格式
    * Content-disposition:服务器告诉客户端以什么格式打开响应体数据
      * 值：in-line：默认值，在当前页面打开
      * attachment;filename=xxx：以附件形式打开响应体。文件下载
* 响应空行：空行
* 响应体：html页面源码   传输的数据

```http
HTTP/1.1 200 OK
Bdpagetype: 2
Bdqid: 0xe1fd1e7a0004902c
Cache-Control: private
Connection: keep-alive
Content-Encoding: gzip
Content-Type: text/html;charset=utf-8
Date: Mon, 21 Mar 2022 11:06:30 GMT
Expires: Mon, 21 Mar 2022 11:06:30 GMT
Server: BWS/1.1
Set-Cookie: BDSVRTM=342; path=/
Set-Cookie: BD_HOME=1; path=/
Set-Cookie: H_PS_PSSID=36068_35105_35979_34584_36141_36120_36033_35994_35956_35320_26350_36114_36100_36061; path=/; domain=.baidu.com
Strict-Transport-Security: max-age=172800
Traceid: 1647860790079157530616284205336976724012
X-Frame-Options: sameorigin
X-Ua-Compatible: IE=Edge,chrome=1
Transfer-Encoding: chunked
```

**设置响应行**

* 设置状态码：`setStatus(int sc)`

**设置响应头**

* `setHeader(String name, String value)`

**设置响应体**

1.获取输出流

* 字符输出流：`PrintWriter getWriter()`

* 字节输出流：`ServletOutputStream getOutputStream()`

2.使用输出流，将数据输出到客户端浏览器

**一.介绍：**

* HttpServletResponse接口来自于Servlet规范中，在Tomcat中存在servlet-api.jar
* HttpServletResponse接口实现类由Http服务器负责提供
* HttpServletResponse接口负责将doGet/doPost方法执行结果写入到【响应体】交给浏览器
* 习惯于将HttpServletResponse接口修饰的对象称为【响应对象】

**二.主要功能**

* 将执行结果以二进制形式写入到【响应体】
* 设置响应头中[content-type]属性值，从而控制浏览器使用，对应编译器将响应体二进制数据编译为【文字、图片、视频、命令】
* 设置响应头中【location】属性，将一个请求地址赋值给location，从而控制浏览器向指定服务器发送请求

功能一：

```java
package com.priv.controller.demo01Servlet;

import javax.servlet.ServletException;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.io.PrintWriter;

public class Demo04HttpServletResponse extends HttpServlet {

    protected void doGet(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
        String result = "Hello World";//执行结果
        //--------响应对象将结果写入到响应体-----------start
        //1.通过响应对象，向Tomcat索要输出流
        PrintWriter out = response.getWriter();
        //2.通过输出流，将执行结果以二进制的形式写入到响应体
        out.write(result);
    }//doGet执行完毕
    //Tomcat将相应包推送给浏览器
}
```

```xml
<?xml version="1.0" encoding="UTF-8"?>
<web-app xmlns="http://xmlns.jcp.org/xml/ns/javaee"
         xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
         xsi:schemaLocation="http://xmlns.jcp.org/xml/ns/javaee http://xmlns.jcp.org/xml/ns/javaee/web-app_4_0.xsd"
         version="4.0">
<!--         servlet接口实现类类路径交给Tomcat-->
    <servlet>
    <servlet-name>Demo04HttpServletResponse</servlet-name>
    <servlet-class>com.priv.controller.demo01Servlet.Demo04HttpServletResponse</servlet-class>
    </servlet>

    <servlet-mapping>
        <servlet-name>Demo04HttpServletResponse</servlet-name>
        <url-pattern>/four</url-pattern>
    </servlet-mapping>
</web-app>
```

解决办法

```java
package com.priv.controller.demo01Servlet;

import javax.servlet.ServletException;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.io.PrintWriter;

public class Demo05HttpServletResponse extends HttpServlet {
/*
*问题描述：浏览器接收到的数据是2，不是50
*
*问题原因：
*        out.write方法可以将【字符】、【字符串】、【ASCII码】写入响应体
*
*        【ASCII码】    a--------------------97
*                      2--------------------50
*
* 问题解决：实际开发过程中，都是通过out.print方法来将真实数据写入响应体
 */
    protected void doGet(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
        int money = 50; //执行结果
        PrintWriter out = response.getWriter();
//        out.write(money);输出的是2
        out.print(money);
    }
}
```

```xml
<?xml version="1.0" encoding="UTF-8"?>
<web-app xmlns="http://xmlns.jcp.org/xml/ns/javaee"
         xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
         xsi:schemaLocation="http://xmlns.jcp.org/xml/ns/javaee http://xmlns.jcp.org/xml/ns/javaee/web-app_4_0.xsd"
         version="4.0">
<!--         servlet接口实现类类路径交给Tomcat-->
    <servlet>
    <servlet-name>Demo05HttpServletResponse</servlet-name>
    <servlet-class>com.priv.controller.demo01Servlet.Demo05HttpServletResponse</servlet-class>
    </servlet>

    <servlet-mapping>
        <servlet-name>Demo05HttpServletResponse</servlet-name>
        <url-pattern>/five</url-pattern>
    </servlet-mapping>
</web-app>
```

------

功能二：

```java
package com.priv.controller.demo01Servlet;

import javax.servlet.ServletException;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.io.PrintWriter;

public class Demo06HttpServletResponse extends HttpServlet {
/*
* 问题描述：Java</br>Mysql</br>Html</br>
*         浏览器在接收到响应结果时，将</br>作为
*         文字内容在窗口展示出来，没有将</br>当做HTML标签命令来执行
*
* 问题原因：浏览器在接收到相应包之后，根据【响应头中content-type】
*         属性的值，来采用对应【编译器】对【响应体中的二进制内容】进行
*         编译处理
*
*         在默认的情况下，content-type属性的值为"text" 即content-type="text"
*         此时浏览器将会采用【文本编译器】对响应体二进制数据进行解析
*
* 解决方案：一定要在得到输出流之前，通过响应对象对响应头中的content-type属性进行一次重新的赋值
*         用于指定浏览器采用正确的编译器
*
*
* */
    protected void doGet(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
        response.setContentType("text/html");
        String result = "Java</br>Mysql</br>Html</br>";
        PrintWriter out = response.getWriter();
        out.print(result);
        //Java
        //Mysql
        //Html
    }
}
```

```xml
<?xml version="1.0" encoding="UTF-8"?>
<web-app xmlns="http://xmlns.jcp.org/xml/ns/javaee"
         xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
         xsi:schemaLocation="http://xmlns.jcp.org/xml/ns/javaee http://xmlns.jcp.org/xml/ns/javaee/web-app_4_0.xsd"
         version="4.0">
<!--         servlet接口实现类类路径交给Tomcat-->
    <servlet>
    <servlet-name>Demo06HttpServletResponse</servlet-name>
    <servlet-class>com.priv.controller.demo01Servlet.Demo06HttpServletResponse</servlet-class>
    </servlet>

    <servlet-mapping>
        <servlet-name>Demo06HttpServletResponse</servlet-name>
        <url-pattern>/six</url-pattern>
    </servlet-mapping>
</web-app>
```

**charset = ISO-8859-1(默认)**

当文字为中文时需要调整编码格式为UTF-8，即

```java
response.setContentType("text/html;charset=utf-8");
```

-------

功能三：**重定向**

* 重定向的特点：redirect
  * 地址栏发生变化
  * 重定向可以访问其他站点(服务器)的资源
  * 重定向是两次请求。不能使用request对象来共享数据
* 转发的特点：forward
  * 转发地址栏路径不变
  * 转发只能访问当前服务器下的资源
  * 转发是一次请求，可以使用request对象来共享数据

> tips：相对路径和绝对路径
>
> * 相对路径：通过相对路径不可以确定唯一资源
>   * 如：./index.html
>   * 不以/开头，以.开头
>   * ./：当前目录。../：后退一级目录
> * 绝对路径：通过绝对路径可以确定唯一资源
>   * 如：`http://location/day1/demo1`               `/day1/demo1`
>   * 以/开头
>   * 给客户端浏览器使用：需要加虚拟目录(项目的访问路径)
>     * 动态获取：request.getContextPath()
>     * `<a> <from>`
>   * 给服务器使用：不需要加虚拟目录
>     * 转发路径

```java
package com.priv.controller.demo01Servlet;

import javax.servlet.ServletException;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;

public class Demo07HttpServletResponse extends HttpServlet {

    protected void doGet(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
        String result = "http://www.baidu.com";

        response.sendRedirect(result);//[响应头 location："http://www.baidu.com"]
        /**
         * 浏览器在接收到响应包之后，如果发现响应头中存在location属性，自动通过地址栏向location指定网站发送请求
         *
         * sendRedirect方法远程控制浏览器请求行为【请求地址、请求方式、请求参数】
         *
         */

    }
}
```

```xml
<?xml version="1.0" encoding="UTF-8"?>
<web-app xmlns="http://xmlns.jcp.org/xml/ns/javaee"
         xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
         xsi:schemaLocation="http://xmlns.jcp.org/xml/ns/javaee http://xmlns.jcp.org/xml/ns/javaee/web-app_4_0.xsd"
         version="4.0">
<!--         servlet接口实现类类路径交给Tomcat-->
    <servlet>
    <servlet-name>Demo07HttpServletResponse</servlet-name>
    <servlet-class>com.priv.controller.demo01Servlet.Demo07HttpServletResponse</servlet-class>
    </servlet>

    <servlet-mapping>
        <servlet-name>Demo07HttpServletResponse</servlet-name>
        <url-pattern>/seven</url-pattern>
    </servlet-mapping>
</web-app>
```

![20211025005414](https://tonkyshan.cn/img/20211025005414.png)

![20211025005456](https://tonkyshan.cn/img/20211025005456.png)

> 请求方法：GET

--------

### 1.5HttpServletRequest接口

----

请求消息：客户端发送给服务器端的数据

* 请求行：请求方式 请求url 请求协议/版本
* 请求头：请求头名称：请求头值 KV形式   客户端浏览器告诉服务器一些信息
  * User-Agent：浏览器告诉服务器，我访问你使用的浏览器版本信息。可以在服务器端获取该头的信息，解决浏览器的兼容性问题
  * Referer: `http://localhost:8080/login.html` 告诉服务器，当前请求从哪里发出，作用：1.防盗链，2.统计工作
* 请求空行：空行
* 请求体：(正文)GET没有请求体   封装POST请求消息的请求参数的

GET：请求参数在请求行中，在url后。请求的url长度是有限制的。不太安全。

POST：请求参数在请求体中。请求的url长度是没有限制的。相对安全。

```http
GET /demo2 HTTP/1.1
Host: localhost:8080
Connection: keep-alive
Cache-Control: max-age=0
sec-ch-ua: " Not A;Brand";v="99", "Chromium";v="99", "Google Chrome";v="99"
sec-ch-ua-mobile: ?0
sec-ch-ua-platform: "Windows"
Upgrade-Insecure-Requests: 1
User-Agent: Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/99.0.4844.74 Safari/537.36
Accept: text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.9
Sec-Fetch-Site: none
Sec-Fetch-Mode: navigate
Sec-Fetch-User: ?1
Sec-Fetch-Dest: document
Accept-Encoding: gzip, deflate, br
Accept-Language: zh-CN,zh;q=0.9
Cookie: Idea-911f4368=8fd1f75e-d0e1-4a6a-bfcb-99d355c4c7a1; _ga=GA1.1.1512127944.1642000265; JSESSIONID=47B6E320E6C10C43B93BC8DF414816EF
```

POST

```http
POST /demo2 HTTP/1.1
Host: localhost:8080
Connection: keep-alive
Content-Length: 12
Cache-Control: max-age=0
sec-ch-ua: " Not A;Brand";v="99", "Chromium";v="99", "Google Chrome";v="99"
sec-ch-ua-mobile: ?0
sec-ch-ua-platform: "Windows"
Upgrade-Insecure-Requests: 1
Origin: http://localhost:8080
Content-Type: application/x-www-form-urlencoded
User-Agent: Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/99.0.4844.74 Safari/537.36
Accept: text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.9
Sec-Fetch-Site: same-origin
Sec-Fetch-Mode: navigate
Sec-Fetch-User: ?1
Sec-Fetch-Dest: document
Referer: http://localhost:8080/login.html
Accept-Encoding: gzip, deflate, br
Accept-Language: zh-CN,zh;q=0.9
Cookie: Idea-911f4368=8fd1f75e-d0e1-4a6a-bfcb-99d355c4c7a1; _ga=GA1.1.1512127944.1642000265; JSESSIONID=47B6E320E6C10C43B93BC8DF414816EF
```

此时POST的请求体：`username=aaa`

![20220320212322](https://tonkyshan.cn/img/20220402185134.png)

**一.介绍：**

* HttpServletRequest接口来自于Servlet规范中，在Tomcat中存在servlet-api.jar
* HttpServletRequest接口实现类由Http服务器负责提供
* HttpServletRequest接口负责在doGet/doPost方法运行时读取Http请求协议包中信息
* 习惯于将HttpServletRequest接口修饰的对象称为【请求对象】

**二.功能**

* 可以读取Http请求协议包中【请求行】信息
* 可以读取保存在Http请求协议包中【请求头】或者【请求体】中的请求参数信息
* 可以代替浏览器向Http服务器申请资源文件调用

方法：

* `String getMethod()`：获取请求方式
* `String getContextPath()`：获取虚拟路径
* `String getServletPath()`：获取Servlet路径
* `String getQueryString()`：获取get方式请求参数
* `String getRequestURI()`：获取请求URI
* `StringBuffer getRequestURL()`：获取请求URI
  * URL：统一资源定位符：`http://localhost/day1/demo1`
  * URI：统一资源标识符：`/day1/demo1`
* `String getProtocol()`：获取协议及版本
* `String getRemoteAddr()`：获取客户机的IP地址
* `String getHeader(String name)`：通过请求头的名称获取请求头的值
* `Enumeration<String> getHeaderNames()`：获取所有的请求头名称

获取请求体数据：

* `BufferedReader getReader()`：获取字符输入流，只能操作字符数据
* `ServletInputStream getInputStream()`：获取字节输入流，可以操作所有类型数据

**通用方法：**

**1.获取请求参数的通用方法**

* `String getParameter(String name)`：根据参数名称获取参数值
* `String[] getParameterValues(String name)`：根据参数名称获取参数值的数组
* `Enumeration<String> getParameterNames()`：获取所有请求的参数名称
* `Map<String,String[]> getParameterMap()`：获取所有参数的map集合

**2.请求转发**

步骤∶

* 通过request对象获取请求转发器对象∶`RequestDispatcher getRequestDispatcher(String path)`
* 使用RequestDispatcher对象来进行转发∶`forward(ServletRequest request，ServletResponse response)`

特点：

* 浏览器地址栏路径不发生变化
* 只能转发到当前服务器内部资源中
* 转发是一次请求

**3.共享数据**

* 域对象：一个有作用范围的对象，可以在范围内共享数据
* request域：代表一次请求的范围，一般用于请求转发的多个资源中共享数据
* 方法：
  * `void SetAttribute(String name,Object obj)`：存储数据
  * `Object getAttitude(String name)`：通过键获取值
  * `void removeAttribute(String name)`：通过键移除键值对

**4.获取ServletContext对象**

* `ServletContext getServletContext()`

功能一：

```java
package com.priv.controller.demo03HttpServletRequest;

import javax.servlet.ServletException;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;

public class Demo01HttpServletRequest extends HttpServlet {

    protected void doGet(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
        String url = request.getRequestURL().toString();
        String method = request.getMethod();
        System.out.println("url="+url);
        System.out.println("method="+method);
    }
}
```

```xml
<?xml version="1.0" encoding="UTF-8"?>
<web-app xmlns="http://xmlns.jcp.org/xml/ns/javaee"
         xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
         xsi:schemaLocation="http://xmlns.jcp.org/xml/ns/javaee http://xmlns.jcp.org/xml/ns/javaee/web-app_4_0.xsd"
         version="4.0">
<!--         servlet接口实现类类路径交给Tomcat-->
    <servlet>
    <servlet-name>Demo01HttpServletRequest</servlet-name>
    <servlet-class>com.priv.controller.demo03HttpServletRequest.Demo01HttpServletRequest</servlet-class>
    </servlet>

    <servlet-mapping>
        <servlet-name>Demo01HttpServletRequest</servlet-name>
        <url-pattern>/request1</url-pattern>
    </servlet-mapping>
</web-app>
```

![20211025012740](https://tonkyshan.cn/img/20211025012740.png)

![20211025012802](https://tonkyshan.cn/img/20211025012802.png)

获取URI

```java
package com.priv.controller.demo03HttpServletRequest;

import javax.servlet.ServletException;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;

public class Demo01HttpServletRequest extends HttpServlet {

    protected void doGet(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
        //1.通过请求对象，读取【请求行】中【url】信息
        String url = request.getRequestURL().toString();
        //2.通过请求对象，读取【请求行】中【method】信息
        String method = request.getMethod();
        //3.通过请求对象，读取【请求行】中uri信息
        /**
         * URI:资源文件精准定位地址，在请求行中并没有URI这一属性
         *     实际上URI中截取一个字符串，这个字符串的格式"/网站名/资源文件名"
         *     URI用于让Http服务器对被访问的资源文件进行定位
         */
        String URI = request.getRequestURI();

        System.out.println("url="+url);
        System.out.println("method="+method);
        System.out.println("uri="+URI);
    }
}
```

![20211025014106](https://tonkyshan.cn/img/20211025014106.png)

----

功能二：

```java
package com.priv.controller.demo03HttpServletRequest;

import javax.servlet.ServletException;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.util.Enumeration;
public class Demo02HttpServletRequest extends HttpServlet {
    protected void doGet(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
        //1.通过请求对象获得【请求头】中【所有请求参数名】
        Enumeration parameterNames = request.getParameterNames();//将所有请求参数名称保存到一个枚举对象进行返回
        while (parameterNames.hasMoreElements()){
            String parameterName = (String) parameterNames.nextElement();
            String value = request.getParameter(parameterName);
            System.out.println("请求参数名"+parameterName+"参数值"+value);
        }
    }
}
```

```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>Title</title>
</head>
<body>
<center>
    <a href="/014_Servlet_war_exploded/request2?username=mike&&password=123">通过超链接访问Demo02HttpServletRequest并携带请求参数</a>
</center>
</body>
</html>
```

![20211025155822](https://tonkyshan.cn/img/20211025155822.png)

----------

```java
package com.priv.controller.demo03HttpServletRequest;

import javax.servlet.ServletException;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;

public class Demo03HttpServletRequest extends HttpServlet {
    protected void doPost(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
        //通过请求对象，读取【请求体】参数信息
        String value = request.getParameter("userName");
        System.out.println("从请求体中得到的参数值"+value);
    }

    protected void doGet(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
        //通过请求对象，读取【请求头】参数信息
        String userName = request.getParameter("userName");
        System.out.println("从请求头中得到的参数值"+userName);

    }

}
```

```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>Title</title>
</head>
<body>
    <center>
        <form action="/014_Servlet_war_exploded/request3" method="get">
                请求参数：<input type="text" name="userName"/><br/>
                <input type="submit" value="get方式访问Demo03HttpServletRequest">
        </form>

        <form action="/014_Servlet_war_exploded/request3" method="post">
            请求参数：<input type="text" name="userName"/><br/>
            <input type="submit" value="post方式访问Demo03HttpServletRequest">
        </form>

    </center>
</body>
</html>
```

![20211025192911](https://tonkyshan.cn/img/20211025192911.png)

![20211025193109](https://tonkyshan.cn/img/20211025193109.png)

请求方法：Get和post

![20211025192922](https://tonkyshan.cn/img/20211025192922.png)

> post从请求体中获取参数值，Get从请求头中获取参数值

![20211026001350](https://tonkyshan.cn/img/20211026001350.png)

**问题：**

* **以GET方式发送中文参数内容时，得到正常结果**
* **以POST方式发送中文参数内容时，得到【乱码】**

**原因：**

浏览器以GET方式发送请求，请求参数保存在【请求头】，在Http请求协议包到达Http服务器之后，第一件事情就是进行解码，请求头二进制内容由Tomcat负责解码，Tomcat9.0默认使用【utf-8】字符集，可以解释一切国家文字       

浏览器以POST方式发送请求，请求参数保存在【请求体】，在Http请求协议包到达Http服务器之后，第一件事情就是进行解码，请求体二进制内容由当前请求对象（request)负责解码。request默认使用[IS0-8859-1]字符集，一个东欧语系字符集此时如果

请求体参数内容是中文，将无法解码只能得到乱码。

**解决方案：**

在Post请求方式下，在读取请求体内容之前，应该通知请求对象使用utf-8字符集对请求体内容进行一次重新解码

```java
package com.priv.controller.demo03HttpServletRequest;

import javax.servlet.ServletException;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;

public class Demo03HttpServletRequest extends HttpServlet {
    protected void doPost(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
        request.setCharacterEncoding("utf-8");
        //通过请求对象，读取【请求体】参数信息
        String value = request.getParameter("userName");
        System.out.println("从请求体中得到的参数值"+value);
    }

    protected void doGet(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
        //通过请求对象，读取【请求头】参数信息
        String userName = request.getParameter("userName");
        System.out.println("从请求头中得到的参数值"+userName);

    }

}
```

![20211026003833](https://tonkyshan.cn/img/20211026003833.png)

------

### 1.6请求对象和响应对象生命周期

-------

请求对象：`HttpServletRequest req`

响应对象：`HttpServletResponse resp`

* 在Http服务器接收到浏览器发送到【Http请求协议包】之后，自动为当前的【Http请求协议包】生成一个【请求对象】和【响应对象】
* 在Http服务器调用doGet/doPost方法时，负责将【请求对象】和【响应对象】，作为实参传递到方法，确保doGet/doPost正确执行
* 在Http服务器准备推送Http响应协议包之前，负责将本次请求关联的【请求对象】和【响应对象】销毁

【请求对象】和【响应对象】生命周期贯穿一次请求的处理过程中

【请求对象】和【响应对象】相当于用户在服务端的代言人

![20211026010609](https://tonkyshan.cn/img/20211026010609.png)

![](https://tonkyshan.cn/img/20211026080541.png)

------

### 1.7Http状态码

----

**1.介绍：**

* 由三位数字组成的一个符号

* Http服务器在推送相应包之前，根据本次请求处理情况，将Http状态码写入到响应包中【状态行】上

* 如果Http服务器针对本次请求，返回了对应的资源文件，通过Http状态码通知浏览器应该如何处理这个结果

  如果Http服务器针对本次请求，无法返回对应的资源文件，通过Http状态码向浏览器解释不能提供服务的原因

**2.分类：**

一.组成：100---599    分为5个大类

**1XX：**最有特征的是100    通知浏览器本次返回的资源文件并不是一个独立的资源文件，需要浏览器在接收响应包之后，继续向Http服务器所要依赖的其他资源文件。

**2XX：**最有特征的是200    通知浏览器本次返回的资源文件是一个完整独立资源文件，浏览器在接收到之后不需要再索要其他的关联文件

**3XX：**最有特征的是~~300~~(猜错了)，是302   通知浏览器本次返回的不是一个资源文件内容，而是一个资源文件地址，需要浏览器根据这个地址自动发起请求来索要这个资源文件

`response.sendRedirect("资源文件地址")`写入到响应头中

loncation

而这个行为导致Tomcat将302状态码写入到状态行。

**4XX：**

* 404：通知浏览器，由于在服务端没有定位到被访问的资源文件，因此无法提供帮助
* 405：通知浏览器，在服务端已经定位到被访问的资源文件(servlet)但是这个Servlet对于浏览器采用的请求方式不能处理

**5XX**

* 500：通知浏览器，在服务端已经定位到被访问的资源文件(servlet)，这个Servlet可以接收浏览器采用的请求方式，但是servlet在处理请求期间，由于java异常导致处理失败。

-----

### 1.8重定向解决方案

-----

**1.工作原理：**用户第一次通过【手动方式】通知浏览器访问oneservlet。oneservlet工作完毕后，将Twoservlet地址写入到响应头location属性中，导致Tomcat将302状态码写入到状态行。在浏览器接收到响应包之后，会读取到302状态。此时浏览器自动根据响应头中1ocation属性地址发起第二次请求,访问Twoservlet去完成请求中剩余任务

**2.实现命令：**

`response.sendRedirect("资源文件地址")`将地址写入到响应包中响应头中location属性

**3.特征：**

* 请求地址：
  既可以把当前网站内部的资源文件地址发送给浏览器`(/网站名/资源文件名)`
  也可以把其他网站资源文件地址发送给浏览器`(http://ip地址:端口号/网站名/资源文件名)`
* 请求次数：
  浏览器至少发送两次请求，但是只有第一次请求是用户手动发送。后续请求都是浏览器自动发送的。
* 请求方式：
  重定向解决方案中，通过地址栏通知浏览器发起下一次请求，因此通过重定向解决方案调用的资源文件接收的请求方式一定是【GET】

**4.缺点**

* 重定向解决方案需要在浏览器与服务器之间进行多次往返，大量时间消耗在往返次数上,增加用户等待服务时间

-----------

### 1.9请求转发解决方案

--------

**1.原理：**

* 用户第一次通过手动方式要求浏览器访问oneservlet，oneservlet工作完毕后，通过当前的请求对象代替浏览器向Tomcat发送请求,申请调用Twoservlet。Tomcat在接收到这个请求之后,自动调用Twoservlet来完成剩余任务

**2.实现命令：**

请求对象代替浏览器向Tomcat发送请求

一、通过当前请求对象生成资源文件申请报告对象

* `RequestDispatcher report = request.getRequestDispatcher("/资源文件名");`一定要以"/"为开头

二、将报告对象发送给Tomcat

* `report.forward(当前请求对象，当前响应对象)`

**3.优点：**

* 无论本次请求涉及到多少个servlet,用户只需要手动通过浏览器发送一次请求
* servlet之间调用发生在服务端计算机上，节省服务端与浏览器之间往返次数，增加处理服务速度

**4.特征：**

一、请求次数

* 在请求转发过程中，浏览器只发送一次请求

二、请求地址

* 只能向Tomcat服务器申请调用当前网站下资源文件地址
  `request.getRequestDispathcer("/资源文件名")`不要写网站名

三、请求方式

* 在请求转发过程中，浏览器只发送一个了个Http请求协议包。参与本次请求的所有servlet共享同一个请求协议包,因此
  这些servlet接收的请求方式与浏览器发送的请求方式保持一致

```java
package com.priv.servlet;

import javax.servlet.RequestDispatcher;
import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;

@WebServlet("/oneServlet")
public class OneServlet extends HttpServlet {
    protected void doPost(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {

    }

    protected void doGet(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
        System.out.println("OneServlet...");
        //通过当前请求对象生成资源文件申请报告对象
        RequestDispatcher requestDispatcher = request.getRequestDispatcher("/towServlet");
        //将报告对象发送给Tomcat
        requestDispatcher.forward(request,response);
    }
}
```

```java
package com.priv.servlet;

import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;

@WebServlet("/towServlet")
public class TowServlet extends HttpServlet {
    protected void doPost(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {

    }

    protected void doGet(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
        System.out.println("TowServlet...");
    }
}
```

![20220329202806](https://tonkyshan.cn/img/20220329202806.png)

访问OneServlet时，TwoServlet也会被访问

-------

### 1.10多个Servlet之间数据共享实现方案

-------

一、数据共享：oneservlet工作完毕后，将产生数据交给Twoservlet来使用

二、servlet规范中提供四种数据共享方案

* servletcontext接口
* cookie类
* Httpsession接口
* HttpservletRequest接口

---------

### 1.12ServletContext

----

**1.概念：**代表整个Web应用，可以和程序的容器(服务器)来通信

**2.获取：**`requset.getServletContext()` (通过request对象获取)或  `this.getServletContext()`(通过HttpServlet获取)

**3.功能：**

* **获取MIME类型**
  * MIME类型：在互联网通信过程中定义的一种文件数据类型
    * 格式：大类型/小类型    text/html     image/jpeg
  * 获取：`String getMimeType(String file)`
* **域对象**：共享数据
  * `setAttribute(String name,Object value)`
  * `getAttribute(String name)`
  * `removeAttribute(String name)`
  * ServletContext对象范围：所有用户所有请求的数据
* **获取文件的真实(服务器)路径**
  * 方法：`String getRealPath(String path)`

**tips：src下的文件在WEB-INF下的classes目录下**

------

## 第二章   学生在线考试管理系统搭建

--------

### 2.1环境搭建

--------

```java
package com.priv.demo01User;

public class Users {
    private Integer userId;
    private String userName;
    private String password;
    private String sex;
    private String email;

    public Integer getUserId() {
        return userId;
    }

    public void setUserId(Integer userId) {
        this.userId = userId;
    }

    public String getUserName() {
        return userName;
    }

    public void setUserName(String userName) {
        this.userName = userName;
    }

    public String getPassword() {
        return password;
    }

    public void setPassword(String password) {
        this.password = password;
    }

    public String getSex() {
        return sex;
    }

    public void setSex(String sex) {
        this.sex = sex;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public Users() {
    }

    public Users(Integer userId, String userName, String password, String sex, String email) {
        this.userId = userId;
        this.userName = userName;
        this.password = password;
        this.sex = sex;
        this.email = email;
    }
}
```

MySQL

```mysql
CREATE TABLE Users(
	userId INT PRIMARY KEY AUTO_INCREMENT,
	userName VARCHAR(50),
	PASSWORD VARCHAR(50),
	sex CHAR(1),
	email VARCHAR(50)
);
INSERT INTO Users (userName,PASSWORD,sex,email)
VALUES('mike','123','男','mike@163.com')

SELECT * FROM Users;
INSERT INTO Users (userName,PASSWORD,sex,email)
VALUES('simth','123','男','simth@163.com')

INSERT INTO Users (userId,userName,PASSWORD,sex,email)
VALUES(20,'Tom','123','男','Tom@163.com')
INSERT INTO Users (userName,PASSWORD,sex,email)
VALUES('King','123','男','King@163.com')
```

```
                                              准备文档
任务：在线考试管理系统----用户信息管理模块

子任务：用户信息注册
       用户信息查询
       用户信息删除
       用户信息更新

准备工作：

      1.创建用户信息表  Users.frm

      CREATE TABLE Users(

        userId   int   primary Key auto_increment,   #用户编号
        userName     varchar(50) ,    #用户名称
        password     varchar(50) ,    #用户密码
        sex          char(1)     ,    #用户性别   '男'或者'女'
        email        varchar(50) ,    #用户邮箱
      )

      auto_increment  自增序列   i++
      在插入时，如果不给定具体的用户编号，此时根据auto_increment的值递增添加

      2.在src下，com.priv.demo01User.Users 实体类

      3.在src下，com.priv.demo01User.utils.JDBCUtils 工具类【复用】

      4.在web下WEB-INF下创建lib文件夹，存放mysql提供JDBC实现jar包
```

------------

### 2.2用户信息注册流程图

--------

**需要背下来**

![20211026082257](https://tonkyshan.cn/img/20211026082257.png)

---------

### 2.3user_Add开发

------

```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>Title</title>
</head>
<body>
<center>
    <form action="/MyWeb/user/add" method="get" id="from">
            <table>
                <tr>
                    <td>用户姓名</td>
                    <td><input type="text" name="userName"></td>
                </tr>
                <tr>
                    <td>用户密码</td>
                    <td><input type="password" name="password"></td>
                </tr>
                <tr>
                    <td>用户性别</td>
                    <td>
                        <input type="radio" name="sex" value="男">男
                        <input type="radio" name="sex" value="女">女
                    </td>
                </tr>
                <tr>
                    <td>用户邮箱</td>
                    <td><input type="text" name="email"></td>
                </tr>
                <tr>
                    <td><input type="submit" value="用户注册"></input></td>
                    <td><input type="reset"></td>
                </tr>
            </table>

    </form>
</center>
</body>
</html>
```

-------

### 2.4UserAddServlet开发

--------

```java
package com.priv.controller;

import com.priv.dao.UserDao;
import com.priv.entity.Users;

import javax.servlet.ServletException;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.io.PrintWriter;

public class UserAddServlet extends HttpServlet {

    protected void doGet(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
        String userName,password,sex,email;
        UserDao userDao = new UserDao();
        Users users = null;
        int result = 0;
        PrintWriter out = null;
        //1.【调用请求对象】读取【请求头】参数信息，得到用户的注册信息
        userName=request.getParameter("userName");
        password=request.getParameter("password");
        sex=request.getParameter("sex");
        email=request.getParameter("email");
        //2.【调用UserDao】将用户信息填充到INSERT命令并借助JDBC规范发送到数据库服务器
        users = new Users(null, userName, password, sex, email);
        result = userDao.add(users);
        //3.【调用响应对象】将【处理结果】以二进制的形式写入到响应体
        response.setContentType("text/html;charset=utf-8");
        out = response.getWriter();
        if(result == 1){
            out.print("<font style='color:red;font-size:40'>用户注册成功</font>");
        }else {
            out.print("<font style='color:red;font-size:40'>用户注册失败</font>");
        }
        //Tomcat负责销毁【请求对象】和【响应对象】
        //Tomcat负责将Http响应协议包推送到发起请求的浏览器上
        //浏览器根据响应头content-type指定编译器对响应体二进制内容编辑
        //浏览器将编辑后结果在窗口中展示给用户【结束】
    }
}
```

------

### 2.5UserFindServlet开发

---------

![20211027101231](https://tonkyshan.cn/img/20211027101231.png)

```java
package com.priv.controller;

import com.priv.dao.UserDao;
import com.priv.entity.Users;

import javax.servlet.ServletException;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.io.PrintWriter;
import java.util.List;

public class UserFindServlet extends HttpServlet {

    protected void doGet(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
        UserDao userDao = new UserDao();
        PrintWriter out;
        //1.调用DAO，将查询命令推送到数据库服务器上，得到所有用户信息【list】
        List<Users> userList = userDao.findAll();
        //2.【调用响应对象】将用户信息结合<table>标签命令以二进制形式写入到响应体
        response.setContentType("text/html;charset=utf-8");
        out = response.getWriter();
        out.print("<table border='2',align='center'>");
        out.print("<tr>");
        out.print("<td>用户编号</td>");
        out.print("<td>用户名称</td>");
        out.print("<td>用户密码</td>");
        out.print("<td>用户性别</td>");
        out.print("<td>用户邮箱</td>");
        out.print("</tr>");
        for (Users users : userList) {
            out.print("<tr>");
            out.print("<td>" + users.getUserId() + "</td>");
            out.print("<td>" + users.getUserName() + "</td>");
            out.print("<td>**********************</td>");
            out.print("<td>" + users.getSex() + "</td>");
            out.print("<td>" + users.getEmail() + "</td>");
            out.print("</tr>");
        }
        out.print("</table>");

    }
}
```

---------

### 2.6UserFindServlet开发

-------

```java
package com.priv.controller;

import com.priv.dao.UserDao;

import javax.servlet.ServletException;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.io.PrintWriter;

public class UserDeleteServlet extends HttpServlet {

    protected void doGet(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
        String userId;
        UserDao dao = new UserDao();
        int result = 0;
        PrintWriter out = null;
        //1.【调用请求对象】读取【请求头】参数【用户编号】
        userId = request.getParameter("userId");
        //2.【调用DAO】将用户编号填充到delete命令并发送到数据库服务器
        result = dao.delete(userId);
        response.setContentType("text/html;charset=utf-8");
        out = response.getWriter();
        if(result==1){
            out.print("<font style='color:red;font-size:40'>用户删除成功</font>");
        }else {
            out.print("<font style='color:red;font-size:40'>用户删除失败</font>");
        }

    }
}
```

--------

### 2.7登录验证

------

<img src="https://tonkyshan.cn/img/登录流程图.png" alt="登录流程图"  />

```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>Title</title>
</head>
<body>
<center>
    <form action="/myWeb/login" method="post">
        <table border="2">
            <tr>
                <td>登录名</td>
                <td><input type="text" name="userName"></td>
            </tr>
            <tr>
                <td>登录密码</td>
                <td><input type="password" name="password"></td>
            </tr>
            <tr>
                <td><input type="submit" value="登录"></input></td>
                <td><input type="reset"></td>
            </tr>
        </table>
    </form>
</center>
</body>
</html>
```

```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>Title</title>
</head>
<body>
<center>
    <font style="color: red;font-size: 30px">登录信息不存在，请重新登录</font>
    <form action="/myWeb/login" method="post">
        <table border="2">
            <tr>
                <td>登录名</td>
                <td><input type="text" name="userName"></td>
            </tr>
            <tr>
                <td>登录密码</td>
                <td><input type="password" name="password"></td>
            </tr>
            <tr>
                <td><input type="submit" value="登录"></input></td>
                <td><input type="reset"></td>
            </tr>
        </table>
    </form>
</center>
</body>
</html>
```

```java
package com.priv.controller;

import com.priv.dao.UserDao;

import javax.servlet.ServletException;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;

public class LoginServlet extends HttpServlet {
    protected void doPost(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
        String userName,password;
        UserDao dao = new UserDao();
        int result = 0;
        //1.调用请求对象对请求体使用utf-8字符集进行重新编辑
        request.setCharacterEncoding("utf-8");
        //2.调用请求对象读取请求体参数信息
        userName = request.getParameter("userName");
        password = request.getParameter("password");
        //3.调用Dao将查询验证信息推送到数据库服务器上
        result = dao.login(userName, password);
        //4.调用响应对象，根据验证结果将不同资源文件地址写入到响应头，交给浏览器
        if(result==1){
                response.sendRedirect("/myWeb/index.html");
        }else {
            response.sendRedirect("/myWeb/login_error.html");
        }
    }

}
```

------

### 2.8欢迎资源文件

------

1.前提：用户可以记住网站名，但是不会记住网站资源文件名

2.默认欢迎资源文件：用户发送了一个针对某个网站的【默认请求时】，此时由Http服务器自动从当前网站返回的资源文件

* 正常请求：`http://location:8080/myWeb/index.html`
* 默认请求：`http://location:8080/myWeb`

3.Tomcat对于默认欢迎资源文件定位规则

* 规则位置：Tomcat安装位置/conf/web.xml
* 规则命令：

```xml
<welcome-file-list>
<welcome-file>index.html</welcome-file>
<welcome-file>index.htm</welcome-file>
<welcome-file>index.jsp</welcome-file>
</welcome-file-list>
```

4.设置当前网站的默认欢迎资源文件规则

* 规则位置：网站/web/WEB-INF/web.xml
* 规则命令：

```xml
<welcome-file-list>
<welcome-file>login.html</welcome-file>
</welcome-file-list>
```

* 网站设置自定义默认文件定位规则，此时Tomcat自带定位规则将失效

> Servlet作为默认欢迎资源文件时，开头的斜线必须删掉

--------

## 第三章   会话技术

------

**1.会话：**一次会话中包含多次请求和响应

* 一次会话：浏览器第一次给服务器资源发送请求，会话建立，直到有一方断开为止

**2.功能：**在一次会话的范围内的多次请求间，共享数据

**3.方式：**

* 客户端会话技术：Cookie
* 服务器端会话技术：Session

------

### 3.1Cookie

-----

**1.概念：**客户端会话技术，将数据保存到客户端。

**2.快速入门：**

* 使用步骤：
  * 创建Cookie对象，绑定数据：`new Cookie(String name, String value)`
  * 发送Cookie对象：`response.addCookie(Cookie cookie)`
  * 获取Cookie，拿到数据：`Cookie[] request.getCookies()`

```java
package com.priv.cookie;

import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.Cookie;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;

@WebServlet("/cookieDemo1")
public class CookieDemo1 extends HttpServlet {
    protected void doPost(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
        //创建Cookie对象
        Cookie cookie = new Cookie("msg", "hello");
        //发送cookie
        response.addCookie(cookie);

    }

    protected void doGet(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
        this.doPost(request, response);
    }
}
```

```java
package com.priv.cookie;

import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.Cookie;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;

@WebServlet("/cookieDemo2")
public class CookieDemo2 extends HttpServlet {
    protected void doPost(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
        //获取Cookie
        Cookie[] cookies = request.getCookies();
        //获取数据，遍历cookies
        if (cookies != null){
            for (Cookie c : cookies){
                String name = c.getName();
                String value = c.getValue();
                System.out.println(name + ":" + value);
            }
        }
    }

    protected void doGet(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
        this.doPost(request, response);
    }
}
```

![20220322183907](https://tonkyshan.cn/img/202203221839817.png)

**成功获取到数据**

**3.原理实现**

* 基于响应头Set-Cookie和请求头cookie实现

![20220322195206](https://tonkyshan.cn/img/202203221952446.png)

运行第一个Servlet时Cookie在响应头中 Set-Cookie：msg = hello

运行第二个Servlet时Cookie在请求头中 

![20220322195009](https://tonkyshan.cn/img/202203221954597.png)

![20220322195114](https://tonkyshan.cn/img/202203221954150.png)

**4.cookie的细节**

**细节一：发送多个cookie**

创建多个Cookie对象，多次调用`response.addCookie()`即可

**细节二：cookie存活时间**

1.默认情况下，浏览器关闭后，Cookie数据被销毁

2.持久化存储：`setMaxAge(int seconds)`

* 参数为正：将Cookie数据写到硬盘的文件中，参数即cookie存活秒数
* 参数为负：默认值
* 参数为零：删除cookie信息

**细节三：cookie存中文**

* tomcat8之前不能之间存储中文数据，tomcat8之后支持存储中文数据，但是特殊字符还是不支持
* tomcat8之前：需要将中文数据转码---一般采用URL编码(%E3)

**细节四：cookie共享问题**

1.同一个tomcat服务器中

默认不能共享，`setPath(String path)`设置Cookie的获取范围。默认为当前的虚拟目录

* 如果要共享，则设置path为"/"

2.不同tomcat服务器中

* `setDomain(String path)`：如果设置一级域名相同，那么多个服务器之间cookie可以共享
* `setDomain(".baidu.com")`，那么`tieba.baidu.com`和`news.baidu.com`中cookie可以共享

**5.Cookie的特点和作用**

1.cookie存储数据在客户端浏览器

2.浏览器对于单个cookie的大小有限制(4kb)以及 对同一个域名下的总cookie数量也有限制(20个)

* 作用：
  * cookie一般用于存储少量的不太敏感的数据
  * 在不登录的情况下，完成服务器对客户端的身份识别

----

### 3.2Session

-------

**1.概念：**服务器端会话技术，在一次会话的多次请求间共享数据，将数据保存在服务器端的对象中。HttpSession

**2.快速入门**

获取Httpsession对象：`request.getSession()`

使用HttpSession对象：

* `Object getAttribute(String name)`：获取数据
* `void setAttribute(String name, Object value)`：存储数据
* `void removeAttribute(String name)`：移除数据

**3.基本原理**

![20220322230331](https://tonkyshan.cn/img/202203222303830.png)

Session是依赖于Cookie的。来确保两次Session对象为同一个。

**4.细节**

一、当客户端关闭后，服务器不关闭，两次获取的session是否为同一个？

* 默认情况下，不是。
* 如果需要相同，则可以创建Cookie，键为JSESSIONID，设置最大存活时间，让cookie持久化保存。
  * `Cookie c = new Cookie("JSESSIONID","session.getId()");`
  * `c.setMaxAge(60 * 60);//一天`
  * `response.addCookie(c);`

二、客户端不关闭，服务器关闭后，两次获取的session是同一个吗？

不是同一个，服务器关闭后，session对象被销毁，在此启动服务器时，两次session对象地址值很难相同。

但是要确保数据不丢失。

* session的钝化：在服务器正常关闭之前，将session对象系列化到硬盘上
* session的活化：在服务器启动后，将session文件转化为内存中的session对象即可

三、session的失效时间(什么时候被销毁)？

* 服务器关闭

* session对象调用invalidate()

* session默认失效时间 30分钟

  * 选择性配置修改

    ```xml
    <session-config>
    	<session-timeout>30</session-timeout>
    </session-config>
    ```

**5.特点**

* session用于存储一次会话的多次请求的数据，存在服务器端
* session可以存储任意类型，任意大小的数据

session与cookie的区别：

* session存储数据在服务器端，Cookie在客户端
* session没有数据大小限制，Cookie有
* session数据安全，Cookie相对不安全

------

## 第四章   JSP

--------

### 4.1概念

---

**1.概念**

Java Server Pages：java服务器端页面

* 可以理解为：一个特殊的页面，其中既可以指定定义html标签，又可以定义java代码
* 用于简化书写

**2.原理**

![20220322205939](https://tonkyshan.cn/img/202203222059291.png)

* JSP本质上就是一个Servlet

**3.脚本**

JSP定义Java代码的方式

* <% 代码 %>：定义的java代码，在service方法中。service方法中可以定义什么，该脚本中就可以定义什么。
* <%! 代码 %>：定义的java代码，在jsp转换后的java类的成员位置。
* <%= 代码 %>：定义的java代码，会输出到页面上，输出语句中可以定义什么，该脚本中就可以定义什么。

**4.JSP内置对象**

* 在jsp页面中不需要获取和创建，可以之间使用的对象。
* jsp一共有9个内置对象

**request、response、session、application、out、pagecontext、config、page 和 exception**

* request
* response
* out：字符输出流对象，可以将数据输出到页面上，和response.getWriter()类似
  * 区别：在tomcat服务器真正给客户端做出响应之前，会先找response缓冲区数据，再找out缓冲区数据。
  * `response.getwriter()`数据输出永远在`out.write()`之前

------

### 4.2指令

-----

**1.作用：**用于配置JSP页面，导入资源文件

**2.格式：**`<%@ 指令名称 属性名1 = 属性值1 属性名2 = 属性值2 ...%>`

**3.分类：**

* page：配置JSP页面的
* include：页面包含的。导入页面的资源文件。
* taglib：导入资源

**一、page**

**属性：**

**contentType**：等同于response.setContestType()

* 设置响应体的mime类型以及字符集
* 设置当前jsp页面的编码(只能是高级的IDE才能生效，如果使用低级工具，则需要设置pageEncoding属性来设置当前页面的字符集)

**import**：导包

**errorpage**：当前页面发生一次后，会自动跳转到指定的错误页面

**isErrorPage**：标识当前页面是否是错误页面

* true：是，可以使用内置对象exception
* flase：否，默认值。不可以使用内置对象exception

**二、include**

**<%@include file = "top.jsp"%>**

**三、taglib**

**<%@ taglib prefix = "c" uri = "`http://java.sun.com/jsp/jstl/core`"%>**

* prefix：前缀，自定义的

------

### 4.3注释

------

**1.html注释：**

`<!-- -->`：只能注释html代码片段

**2.jsp注释：**

`<%-- --%>`：可以注释所有

-----

### 4.4内置对象

---

| 变量名      | 真实类型            | 作用                                         |
| ----------- | ------------------- | -------------------------------------------- |
| pagecontext | PageContext         | 当前页面共享数据，还可以获取其他八个内置对象 |
| request     | HttpServletRequest  | 一次请求访问的多个资源(转发)                 |
| session     | HttpSession         | 一次会话的多个请求间                         |
| application | ServletContext      | 所有用户间共享数据                           |
| response    | HttpServletResponse | 响应对象                                     |
| page        | Object              | 当前页面(Servlet)的对象，this                |
| out         | JspWriter           | 输出对象，数据输出到页面上                   |
| config      | ServletConfig       | Servlet的配置对象                            |
| exception   | Throwable           | 异常对象                                     |

-----

## 第五章   MVC

---

### 5.1演变

---

* 早期只有servlet，只能使用response输出标签数据，非常麻烦
* 后来又jsp，简化了servlet的开发，如果过度使用jsp，在jsp中即写大量的java代码，有写html表，造成难于维护，于分工协作
* 再后来，java的web开发，借鉴mvc开发模式，使得程序的设计更加合理性

-------

### 5.2详解

---

**1.MVC**

* M：Model，模型。JavaBean
  * 完成具体的业务操作，如：查询数据库，封装对象
* V：View，视图。JSP
  * 展示对象
* C：Controller，控制器
  * 获取用户的输入
  * 调用模型
  * 将数据交给视图进行展示

![20220323231712](https://tonkyshan.cn/img/202203232317588.png)

**2.优缺点**

* 优点：
  * 耦合性低，便于维护，可以利用分工协作
  * 重用性高
* 缺点：
  * 使得项目架构变得复杂，对开发人员要求高

JSP中不写Java代码，所以下面学习**EL表达式**和**JSTL标签**来替代Java代码。

-----

## 第六章   EL表达式&JSTL标签

---

### 6.1EL表达式

-----

**1.概念：**

Expression Language 表达式语言

**2.作用：**替换和简化jsp页面中java代码的书写。

**3.语法：**`${表达式}`

**4.注意：**

* jsp默认支持EL表达式。如果想要忽略：
  * 设置jsp中page指令中：isELIgnored="true"忽略当前jsp页面中所有的EL表达式
  * `\${表达式}`：忽略当前这个EL表达式

**5.使用：**

一、**运算**

* 运算符：
  * 算数运算符：+ - * /(div) %(mod)
  * 比较运算符：> < >= <= == !=
  * 逻辑运算符：&&(and) ||(or) !(not)
  * 空运算符：empty    返回boolean
    * 功能：用于判断字符串，集合，数组对象是否为null，并且长度是否为0
    * ${empty list}：判断字符串，集合，数组对象是否为null并且长度为0
    * ${not empty list}：表示判断字符串，集合，数组对象是否不为null并且长度>0

二、**获取值**

1.EL表达式只能从域对象中获取值

2.语法：

* ${域名称.键名}：从指定域中获取指定键的值

  * pageScope     --->    pageContext
  * requestScope     --->    request
  * sessionScope     --->    session
  * applicationScope     --->    application(ServletContext)

  举例：在request域中存储了name=张三

  获取：`${requestScope.name}`

* ${键名}：表示依次从最小的域中查找是否有该键对应的值，直到找到为止。

**三、获取对象，List集合，Map集合的值**

**1.对象**：`${域名称.键名.属性名}`

* 本质上会去调用对象的getter方法

**2.List集合&Map集合**：

* List：`${域名称.键名[索引]}`

* Map：`${域名称.键名.key名称}`或`${域名称.键名["key名称"]}`

**隐式对象：**

* EL表达式中有11个隐式对象

* pageContext：
  * 获取jsp其他8个内置对象：`${pageContext.request.contextPath}`

------

### 6.2JSTL标签

-----

**1.概念：**JavaServer Pages Tag Library   JSP标准标签库

* 是由Apache组织提供的开源的免费的JSP标签

**2.作用：**用于简化和替换jsp页面上的java代码

**3.使用步骤：**

* 导入jstl相关jar包
* 引入标签库：taglib指令：`<%@ taglib%>`
* 使用标签

**4.常用的JSTL标签：**

**一、if(相当于java代码的if语句)**

1．属性：test 必须属性，接收boolean表达式

* 如果表达式为true，则显示if标签体内容，如果为false，则不显示标签体内容
* —般情况下, test属性值会结合el表达式一起使用

2．注意：c :if标签没有else情况，想要else情况，则可以再定义一个c:if标签

`<c:if test=""></c:if>`

```jsp
<%@ page import="java.util.ArrayList" %>
<%@ page import="java.util.List" %><%--
  Created by IntelliJ IDEA.
  User: 97189
  Date: 2022/3/24
  Time: 21:27
  To change this template use File | Settings | File Templates.
--%>
<%@ page contentType="text/html;charset=UTF-8" language="java" %>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>
<html>
<head>
    <title>Title</title>
</head>
<body>
    <%
        //判断request域中的一个list集合是否为空，如果不为null，则显示遍历集合

        List list = new ArrayList();
        list.add("aaa");
        request.setAttribute("list", list);

    %>
        <c:if test="${not empty list}">
            遍历集合...
        </c:if>
</body>
</html>
```

**二、choose(相当于java代码的switch语句)**

```jsp
<%--
  Created by IntelliJ IDEA.
  User: 97189
  Date: 2022/3/24
  Time: 21:53
  To change this template use File | Settings | File Templates.
--%>
<%@ page contentType="text/html;charset=UTF-8" language="java" %>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>
<html>
<head>
    <title>Title</title>
</head>
<body>

    <%--
        完成数字编号对应星期几案例
        1.域中存储-数字
        2.使用choose标签取出数字         相当于switch声明
        3.使用when标签做数字判断         相当于case
        4.otherwise标签做其他情况的声明  相当于default

    --%>

<%
    request.setAttribute("number",51);

%>

    <c:choose>
        <c:when test="${number == 1}">星期一</c:when>
        <c:when test="${number == 2}">星期二</c:when>
        <c:when test="${number == 3}">星期三</c:when>
        <c:when test="${number == 4}">星期四</c:when>
        <c:when test="${number == 5}">星期五</c:when>
        <c:when test="${number == 6}">星期六</c:when>
        <c:when test="${number == 7}">星期日</c:when>

        <c:otherwise>数字输入有误</c:otherwise>

    </c:choose>

</body>
</html>
```

**三、foreach(相当于java代码的for语句)**

```jsp
<%@ page import="java.util.ArrayList" %>
<%@ page import="java.util.List" %><%--
  Created by IntelliJ IDEA.
  User: 97189
  Date: 2022/3/24
  Time: 21:59
  To change this template use File | Settings | File Templates.
--%>
<%@ page contentType="text/html;charset=UTF-8" language="java" %>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>
<html>
<head>
    <title>Title</title>
</head>
<body>
    <%--
        foreach:相当于java代码的for语句
            1．完成重复的操作
            for(int i = e; i < 10; i ++){

            }
            属性:
                begin:开始值
                end:结束值
                var:临时变量
                step:步长
                varStatus:循环状态对象
                    index:容器中元素的索引，从0开始
                    count:循环次数，从1开始
            2．遍历容器
            List<User> list;
            for(User user : list){

            }
            属性：
                items:容器对象
                var:容器中元素的临时变量
                varStatus:循环状态对象
                    index:容器中元素的索引，从0开始
                    count:循环次数，从1开始

    --%>

    <c:forEach begin="1" end="10" var="i" step="1" varStatus="s">
        ${i}<h3>${s.index}</h3><h4>${s.count}</h4><br>
    </c:forEach>
    
    <hr>

    <%
        List list = new ArrayList();
        list.add("aaa");
        list.add("bbb");
        list.add("ccc");

        request.setAttribute("list", list);
    %>

    <c:forEach items="${list}" var="str" varStatus="s">
        ${s.index} ${s.count} ${str}<br>
    </c:forEach>

</body>
</html>
```

---

## 第七章   三层架构

----

软件设计架构：

1.界面层(表示层)：用户看得见的界面。用户可以通过界面上的组件和服务器进行交互

2.业务逻辑层：处理业务逻辑的。

3.数据访问层：操作数据存储文件。

![20220324234926](https://tonkyshan.cn/img/202203242349602.png)
