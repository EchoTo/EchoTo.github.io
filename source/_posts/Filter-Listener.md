---
title: Filter&&Listener
date: 2022-04-02 19:02:31
tags: [Filter,Listener]
categories: JavaWeb
---

## Filter&Listener

-----

## 第一章   Filter

----

### 1.1概述

---

* Web中的过滤器：当访问服务器的资源时，过滤器可以将请求拦截下来，完成一些特殊的功能。
* 过滤器的作用：

  * 一般用于完成通用的操作。如：登录验证、统一编码处理、敏感字符过滤


------------

### 1.2快速入门

----

**一、步骤**

1.定义一个类，实现Filter接口

2.复写方法

3.配置拦截路径

* 配置方法一：web.xml
* 配置方法二：注解(下面的代码就是用这种方式)

```java
package com.priv.web.Filter;

import javax.servlet.*;
import javax.servlet.annotation.WebFilter;
import java.io.IOException;

/*
* 过滤器快速入门
* */

@WebFilter("/*")//访问所有资源之前，都会执行该过滤器
public class FilterDemo1 implements Filter {
    @Override
    public void init(FilterConfig filterConfig) throws ServletException {

    }

    @Override
    public void doFilter(ServletRequest servletRequest, ServletResponse servletResponse, FilterChain filterChain) throws IOException, ServletException {
        System.out.println("FilterDemo1被执行了...");

        //放行
        filterChain.doFilter(servletRequest, servletResponse);
    }

    @Override
    public void destroy() {

    }
}
```

```jsp
<%--
  Created by IntelliJ IDEA.
  User: 97189
  Date: 2022/3/26
  Time: 20:19
  To change this template use File | Settings | File Templates.
--%>
<%@ page contentType="text/html;charset=UTF-8" language="java" %>
<html>
  <head>
    <title>$Title$</title>
  </head>
  <body>
  index.jsp....
  </body>
</html>
```

没有放行之前是看不到body里的内容的。

------

### 1.3过滤器细节

-----

**一、web.xml配置**

FilterDemo1去掉注解复制一份到FilterDemo2

```xml
<?xml version="1.0" encoding="UTF-8"?>
<web-app xmlns="http://xmlns.jcp.org/xml/ns/javaee"
         xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
         xsi:schemaLocation="http://xmlns.jcp.org/xml/ns/javaee http://xmlns.jcp.org/xml/ns/javaee/web-app_4_0.xsd"
         version="4.0">

    <filter>
        <filter-name>demo2</filter-name>
        <filter-class>com.priv.web.Filter.FilterDemo2</filter-class>
    </filter>
    <filter-mapping>
        <filter-name>demo2</filter-name>
        <!--拦截路径-->
        <url-pattern>/*</url-pattern>
    </filter-mapping>
</web-app>
```

WebFilter注解源码：

```java
//
// Source code recreated from a .class file by IntelliJ IDEA
// (powered by Fernflower decompiler)
//

package javax.servlet.annotation;

import java.lang.annotation.Documented;
import java.lang.annotation.ElementType;
import java.lang.annotation.Retention;
import java.lang.annotation.RetentionPolicy;
import java.lang.annotation.Target;
import javax.servlet.DispatcherType;

@Target({ElementType.TYPE})//作用在类上面
@Retention(RetentionPolicy.RUNTIME)//保留到runtime阶段
@Documented//生成文档
public @interface WebFilter {
    String description() default "";

    String displayName() default "";

    WebInitParam[] initParams() default {};

    String filterName() default "";

    String smallIcon() default "";

    String largeIcon() default "";

    String[] servletNames() default {};

    String[] value() default {};

    String[] urlPatterns() default {};//默认空

    DispatcherType[] dispatcherTypes() default {DispatcherType.REQUEST};

    boolean asyncSupported() default false;
}
```

**二、过滤器执行流程**

1.执行过滤器

2.执行放行后的资源

3.回来执行过滤器放行代码下边的代码

**三、过滤器生命周期方法**

1.init：在服务器启动后，会创建Filter对象，然后调用init方法。只执行一次。用于加载资源。

2.doFilter：每一次请求被拦截资源时，会执行。执行多次。

3.destory：在服务器关闭后，Filter对象被销毁。如果服务器是正常关闭，则会执行destory方法。只执行一次。用于释放资源。

**四、过滤器配置详解**

* **拦截路径配置：**
  * 具体资源路径：/index.jsp 只有访问index.jsp资源时，过滤器才会被执行
  * 拦截目录：/user/* 访问/user下的所有资源时，过滤器才会被执行
  * 后缀名拦截：*.jsp 访问所有后缀名为jsp资源时，过滤器都会被执行
  * 拦截所有资源：/* 访问所有资源时，过滤器都会被执行
* **拦截方式配置：**资源被访问的方式
  * 注解配置：
    * 设置dispatcherTypes属性
      * REQUEST：默认值。浏览器直接请求资源时，过滤器会被执行
      * FORWARD：转发访问资源，过滤器会被执行
      * INCLUDE：包含访问资源，过滤器会被执行
      * ERROR：错误跳转资源，过滤器会被执行
      * ASYNC：异步访问资源，过滤器会被执行
    * web.xml配置
      * 设置`<dispatcher></dispatcher>`标签即可

**五.过滤器链**(配置多个过滤器)

* 执行顺序：如果有两个过滤器：过滤器1和过滤器2
  * 过滤器1
  * 过滤器2
  * 资源执行
  * 过滤器2
  * 过滤器1
* 过滤器先后顺序问题：
  * 注解配置：按照类名的字符串比较规则比较，值小的先执行
    * 如：AFilter和BFilter，AFilter就现执行了
  * web.xml配置：`<filter-mapping>`谁定义在上面，谁先执行

------

### 1.4案例

-----

**一、登录验证**

```java
package cn.itcast.web.filter;

import javax.servlet.*;
import javax.servlet.annotation.WebFilter;
import javax.servlet.http.HttpServletRequest;
import java.io.IOException;

/**
 * 登录验证的过滤器
 */
@WebFilter("/*")
public class LoginFilter implements Filter {


    public void doFilter(ServletRequest req, ServletResponse resp, FilterChain chain) throws ServletException, IOException {
        //0.强制转换
        HttpServletRequest request = (HttpServletRequest) req;

        //1.获取资源请求路径
        String uri = request.getRequestURI();
        //2.判断是否包含登录相关资源路径,要注意排除掉 css/js/图片/验证码等资源
        if(uri.contains("/login.jsp") || uri.contains("/loginServlet") || uri.contains("/css/") || uri.contains("/js/") || uri.contains("/fonts/") || uri.contains("/checkCodeServlet")  ){
            //包含，用户就是想登录。放行
            chain.doFilter(req, resp);
        }else{
            //不包含，需要验证用户是否登录
            //3.从获取session中获取user
            Object user = request.getSession().getAttribute("user");
            if(user != null){
                //登录了。放行
                chain.doFilter(req, resp);
            }else{
                //没有登录。跳转登录页面

                request.setAttribute("login_msg","您尚未登录，请登录");
                request.getRequestDispatcher("/login.jsp").forward(request,resp);
            }
        }


        // chain.doFilter(req, resp);
    }

    public void init(FilterConfig config) throws ServletException {

    }

    public void destroy() {
    }

}
```

---

**二、过滤敏感词汇**

```java
package cn.itcast.web.filter;

import javax.servlet.*;
import javax.servlet.annotation.WebFilter;
import java.io.BufferedReader;
import java.io.FileReader;
import java.io.IOException;
import java.lang.reflect.InvocationHandler;
import java.lang.reflect.Method;
import java.lang.reflect.Proxy;
import java.util.ArrayList;
import java.util.List;

/**
 * 敏感词汇过滤器
 */
@WebFilter("/*")
public class SensitiveWordsFilter implements Filter {


    public void doFilter(ServletRequest req, ServletResponse resp, FilterChain chain) throws ServletException, IOException {
        //1.创建代理对象，增强getParameter方法

        ServletRequest proxy_req = (ServletRequest) Proxy.newProxyInstance(req.getClass().getClassLoader(), req.getClass().getInterfaces(), new InvocationHandler() {
            @Override
            public Object invoke(Object proxy, Method method, Object[] args) throws Throwable {
                //增强getParameter方法
                //判断是否是getParameter方法
                if(method.getName().equals("getParameter")){
                    //增强返回值
                    //获取返回值
                    String value = (String) method.invoke(req,args);
                    if(value != null){
                        for (String str : list) {
                            if(value.contains(str)){
                                value = value.replaceAll(str,"***");
                            }
                        }
                    }
                    
                    return  value;
                }

                //判断方法名是否是 getParameterMap

                //判断方法名是否是 getParameterValue

                return method.invoke(req,args);
            }
        });

        //2.放行
        chain.doFilter(proxy_req, resp);
    }
    private List<String> list = new ArrayList<String>();//敏感词汇集合
    public void init(FilterConfig config) throws ServletException {

        try{
            //1.获取文件真实路径
            ServletContext servletContext = config.getServletContext();
            String realPath = servletContext.getRealPath("/WEB-INF/classes/敏感词汇.txt");
            //2.读取文件
            BufferedReader br = new BufferedReader(new FileReader(realPath));
            //3.将文件的每一行数据添加到list中
            String line = null;
            while((line = br.readLine())!=null){
                list.add(line);
            }

            br.close();

            System.out.println(list);

        }catch (Exception e){
            e.printStackTrace();
        }

    }

    public void destroy() {
    }

}
```

----

### 1.5动态代理

-----

增强对象的功能：

* 设计模式：一些通用的解决固定问题的方式

1.装饰模式：

2.代理模式：

* 动态代理

**一、概念**

* 真实对象：被代理的对象
* 代理对象：
* 代理模式：代理对象代理真实对象，达到增强真实对象功能的目的。

**二、实现方式**

* 静态代理：有一个类文件描述代理模式
* 动态代理：在内存中形成代理类

**三、实现步骤**

* 代理对象和真实对象实现相同的接口
* 代理对象 = Proxy.newInstance();
* 使用代理对象调用方法
* 增强方法

**四、增强方法**

* 增强参数列表
* 增强返回值类型
* 增强方法体执行逻辑

```java
package com.priv.proxy;

import java.lang.reflect.InvocationHandler;
import java.lang.reflect.Method;
import java.lang.reflect.Proxy;

public class ProxyTest {
    public static void main(String[] args) {
        //创建真实对象
        HuaWei huaWei = new HuaWei();

        //动态代理增强huawei对象
        /*
        *
        *       三个参数：
        *          1.类加载器:真实对象.getClass().getClassLoader()
        *          2.接口数组:真实对象.getClass().getInterfaces()
        *          3.处理器:new InvocationHandler()
        *
        * */
        SaleComputer proxy_huawei = (SaleComputer) Proxy.newProxyInstance(huaWei.getClass().getClassLoader(), huaWei.getClass().getInterfaces(), new InvocationHandler() {
            /*
            * 代理逻辑编写的方法：代理对象调用的所有方法都会触发该方法执行
            *       参数：
            *          1.proxy:代理对象
            *          2.method:代理对象调用的方法，被封装为的对象
            *          3.args:代理对象调用方法时，传递的实际参数
            * */
            @Override
            public Object invoke(Object proxy, Method method, Object[] args) throws Throwable {
//                System.out.println("该方法执行了...");
//                System.out.println(method.getName());//sale
//                System.out.println(args[0]);//8000.0

                //1.增强参数 判断是否为sale方法
                if (method.getName().equals("sale")){
                    double money = (double)args[0];
                    System.out.println("专车接...");//3.增强方法体执行逻辑
                    money = money * 0.85;
                    String obj = (String)method.invoke(huaWei, money);
                    System.out.println("免费送货...");//3.增强方法体执行逻辑
                    //2.增强返回值

                    return obj + "_鼠标";
                }else {
                    Object obj = method.invoke(huaWei, args);
                    return obj;
                }
            }
        });

        //调用方法
//        String computer = huaWei.sale(8000);
        String computer = proxy_huawei.sale(8000);
        System.out.println(computer);
    }
}
```

--------

## 第二章   Listener

-----

### 1.1概述

-----

Web的三大组件之一，监听器

* 事件监听机制：
  * 事件：一件事情
  * 事件源：事件发生的地方
  * 监听器：一个对象
  * 注册监听：将事件、事件源、监听器绑定在一起。当事件源上发生某个事件后，执行监听器代码

* ServletContextListener：监听ServletContext对象的创建和销毁
* **方法：**
  * void contextDestoryed(ServletContextEvent sce)：ServletContext对象被销毁之前会调用该方法
  * void contextInitialized(ServletContextEvent sce)：ServletContext对象创建后会调用该方法

* **步骤：**

1.定义一个类，实现ServletContextListener接口

2.复写方法

3.配置

* web.xml配置

```xml
<?xml version="1.0" encoding="UTF-8"?>
<web-app xmlns="http://xmlns.jcp.org/xml/ns/javaee"
         xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
         xsi:schemaLocation="http://xmlns.jcp.org/xml/ns/javaee http://xmlns.jcp.org/xml/ns/javaee/web-app_4_0.xsd"
         version="4.0">
    
    <!--
        配置监听器
    -->
    
    <listener>
        <listener-class>com.priv.web.listener.ContextLoaderListener</listener-class>
    </listener>

    <!--
        指定初始化参数
    -->
    <context-param>
        <param-name>contextConfigLocation</param-name>
        <param-value>/WEB-INF/classes/applicationContext.xml</param-value>
    </context-param>
</web-app>
```

```java
package com.priv.web.listener;

import javax.servlet.ServletContext;
import javax.servlet.ServletContextEvent;
import javax.servlet.ServletContextListener;
import java.io.FileInputStream;
import java.io.FileNotFoundException;

public class ContextLoaderListener implements ServletContextListener {

    /*
    * 监听ServletContext对象创建的。ServletContext对象服务器启动后自动创建
    *
    * 在服务器启动后自动调用
    * @Param servletContextEvent
    * */
    @Override
    public void contextInitialized(ServletContextEvent servletContextEvent) {
        //加载资源文件
        //1.获取ServletContext对象
        ServletContext servletContext = servletContextEvent.getServletContext();

        //2.加载资源文件
        String contextConfigLocation = servletContext.getInitParameter("contextConfigLocation");

        //3.获取真实路径
        String realPath = servletContext.getRealPath(contextConfigLocation);

        //4.加载进内存
        try {
            FileInputStream fis = new FileInputStream(realPath);
            System.out.println(fis);//java.io.FileInputStream@6209b415
        } catch (FileNotFoundException e) {
            e.printStackTrace();
        }

        System.out.println("ServletContext对象被创建了...");
    }

     /*
     *在服务器关闭后，ServletContext对象被销毁。当服务器正常关闭后该方法被调用
     * @Param servletContextEvent
     * */
    @Override
    public void contextDestroyed(ServletContextEvent servletContextEvent) {
        System.out.println("ServletContext对象被销毁了...");
    }

}
```

指定初始化参数`<context-param>`

* 注解配置

@WebListener
