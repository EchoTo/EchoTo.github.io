---
title: Ajax
date: 2022-04-02 19:03:00
tags: Ajax
categories: JavaWeb
---

## Ajax

---

## 第一章   概念

----

ASynchronous JavaScript And XML   异步的JavaScript和XML

一、异步和同步

客户端和服务器端相互通信的基础上

![20220329220808](https://tonkyshan.cn/img/20220329220808.png)

* 同步：客户端必须等待服务器端的响应。在等待的期间客户端不能做其他操作。
* 异步：客户端不需要等待服务器端的响应。在服务器处理请求的过程中，客户端可以进行其他的操作。

Ajax是一种在无需重新加载整个网页的情况下，能够更新部分网页的技术。
通过在后台与服务器进行少量数据交换，Ajax可以使网页实现异步更新。这意味着可以在不重新加载整个网页的情况下，对网页的某部分进行更新。传统的网页（不使用Ajax）如果需要更新内容，必须重载整个网页页面。

-----

## 第二章   实现方式

------

### 2.1原生的JS实现方式

-------

(了解)

```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>Title</title>
    <script>
        //定义方法
        function fun() {
            //发送异步请求
            //1，创建核心对象
            var xmlhttp;
            if (window.XMLHttpRequest){
                //code for IE7+,Firefox,Chrome,Opera,Safari
                xmlhttp = new XMLHttpRequest();
            }
            else {
                //code for IE6,IE5
                xmlhttp = new ActiveXObject("Microsoft.XMLHTTP");
            }

            //2.建立连接
            /*
            * 参数：
            *       1.请求方式：GET、POST
            *           * get方式，请求参数在URL后面拼接，send方法为空
            *           * post方式，请求参数在send方法中定义
            *       2.请求的URL：
            *       3.同步或异步：true(异步)或false(同步)
            * */
            xmlhttp.open("GET","ajaxServlet?username=tom",true);

            //3.发送请求
            xmlhttp.send();

            //4.接收并处理来自服务器的响应结果
            //什么时候获取：当服务器响应成功后再获取
            //当xmlhttp对象的就绪状态发生改变时，触发事件onreadystatechange
            xmlhttp.onreadystatechange = function () {
                /*
                * readyState:
                *   0:请求未初始化
                    1:服务器连接已建立
                    2:请求已接收
                    3:请求处理中
                    4:请求已完成，且响应已就绪
                  status:
                    200: "OK"
                    404:未找到页面

                * */
                //判断readyState就绪状态是否为4，status响应状态码是否为200
                if (xmlhttp.readyState == 4 && xmlhttp.status == 200){
                    //获取服务器的响应结果
                    var responseText = xmlhttp.responseText;
                    alert(responseText);//hello：tom
                }
            }
        }
    </script>
</head>
<body>

        <input type="button" value="实现异步请求" onclick="fun();">

</body>
</html>
```

```java
package com.priv.Ajax;

import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;

@WebServlet("/ajaxServlet")
public class AjaxServlet extends HttpServlet {
    protected void doPost(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
        //1.获取请求参数
        String username = request.getParameter("username");

        //2.打印username
        System.out.println(username);

        //3.响应
        response.getWriter().write("hello：" + username);
    }

    protected void doGet(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
        this.doPost(request, response);
    }
}
```

---------

### 2.2JQuery实现方式

---------

**一、$.ajax()**

* 语法：`$.ajax({键值对});`

```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>Title</title>
    <script src="js/jquery-3.5.1.min.js"></script>
    <script>
        //定义方法
        function fun() {
            //使用$.ajax()发送异步请求
            $.ajax({
                url:"ajaxServlet",//请求路径
                type:"POST",//请求方式
                data:{"username" : "jack", "age" : 23},//请求参数
                success:function (data) {
                    alert(data);
                },//响应成功后的回调函数
                error:function () {
                    alert("出错了...")
                },//表示如果请求响应出现错误，会执行的回调函数
                dataType:"text"//设置接收导的响应数据的格式
            })
        }
    </script>
</head>
<body>

        <input type="button" value="实现异步请求" onclick="fun();">

</body>
</html>
```

**二、$.get()**

发送get请求

* 语法：`$.get(url,[data],[callback],[type])`

* 参数：
  * url：请求路径
  * data：请求参数
  * callback：回调函数
  * type：响应结果的类型

```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>Title</title>
    <script src="js/jquery-3.5.1.min.js"></script>
    <script>
        //定义方法
        function fun() {
            $.get("ajaxServlet",{username:"rose"},function (data) {
                alert(data);
            },"text");
        }
    </script>
</head>
<body>

        <input type="button" value="实现异步请求" onclick="fun();">

</body>
</html>
```

**三、$.post()**

发送post请求

```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>Title</title>
    <script src="js/jquery-3.5.1.min.js"></script>
    <script>
        //定义方法
        function fun() {
            $.post("ajaxServlet",{username:"rose"},function (data) {
                alert(data);
            },"text");
        }
    </script>
</head>
<body>

        <input type="button" value="实现异步请求" onclick="fun();">

</body>
</html>
```

