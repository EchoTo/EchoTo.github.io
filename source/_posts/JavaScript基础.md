---
title: JavaScript基础
date: 2022-01-24 12:24:34
tags: [JavaScript]
categories: JavaWeb
---

## JavaScript基础

----------

## 第一章    初识JS

----

### 1.1简介

**概念**

一门客户端脚本语言

* 运行在客户端浏览器中的。每一个浏览器都有JavaScript的解析引擎。
* 脚本语言：不需要编译，直接就可以被浏览器解析执行。

**功能**

* 可以来增强用户和html页面的交互过程，可以来控制html元素，让页面有一些动态的效果，增强用户的体验。

------

### 1.2发展史

------

* 1992年，Nombase公司，开发出第一门客户端脚本语言，专门用于表单的校验。命名为：C--，后来更名为：ScriptEase
* 1995年，Netscape(网景)公司，开发了一门客户端脚本语言：LiveScript。后来，请来SUN公司的专家，修改LiveScript，命名为JavaScript
* 1996年，微软开发出JScript
* 1997年，ECMA(欧洲计算机制造商协会)，ECMAScript，就是所有客户端脚本语言的标准。

JavaScript = ECMAScript + JavaScript自己特有的东西(BOM + DOM)

-----

## 第二章   ECMAScript

------

### 2.1基本语法

-----

#### 1.与HTML结合方式

```html
<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Document</title>
    <!-- 
    内部
    外部 
-->

    <script>
        alert("Hello World");
    </script>

    <script src="a.js"></script>
</head>

<body>

</body>

</html>
```

> tips：1.< script>可以定义在html页面的任何地方。但是定义的位置会影响执行顺序
>
> 2.< script>可以定义多个

#### 2.注释

* 单行注释：//注释内容
* 多行注释：/* 注释内容 */

#### 3.数据类型

**原始数据类型(基本数据类型)**

* number：数字。整数/小数/NaN(not a number，一个不是数字的数字类型)

* string：字符串。

* boolean：true/false

* null：一个对象为空的占位符

* undefined：未定义。如果一个变量没有初始化值，则会被默认赋值为undefined

**引用数据类型：对象**

#### 4.变量

定义：一小块存储数据的内存空间

Java语言是强类型语言，而JavaScript是弱类型语言

* 强类型：在开辟变量存储空间时，定义了空间将来存储数据的数据类型。只能存储固定类型的数据、
* 弱类型：在开辟变量存储空间时，不定义空间将来存储的数据类型，可以存放任意类型的数据。

语法：var 变量名 = 初始化值;

输出到页面上：document.write();

#### 5.运算符

typeof()：返回变量数据类型  

null --- object

这实际上是JavaScript最初实现中的一个错误，然后被ECMAScript 沿用了。现在，nul被认为是对象的占位符，从而解释了这一矛盾，但从技术上来说，它仍然是原始值。

* 一元运算符：只有一个运算数的运算符

​      ++，--，+(正号)

* 算数运算符

​       + - * / %...

* 赋值运算符

​       = += -+....

* 比较运算符

​       < > >= <= == ===(全等于)

* 逻辑运算符

​       &&    ||     ！

* 三元运算符

​       ？   :

> var 
>
> 使用：局部变量
>
> 不使用：全局变量

#### 6.流程控制语句

* if...else...
* switch
* while
* do...while
* for

同java，这里就不多说了

--------------

### 2.2基本对象

------

#### 1.Function

函数(方法)对象

```html
<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Fuunction对象</title>
    <script>
        // Function：函数(方法)对象
        //     1.创建：
        //         1.var fun = new Function(形式参数列表,方法体);
        //         2.function 方法名称(形式参数列表){
        //             方法体
        //         }
        //         3.var 方法名 = function(形式参数列表){
        //             方法体
        //         }
        //     2.方法：
        //     3.属性：
        //         length：代表形参的个数
        //     4.特点：
        //         1.方法定义时，形参的类型不用写，返回值类型也不写
        //         2.方法是一个对象，如果定义名称相同的方法，会覆盖
        //         3.在JS中，方法的调用只与方法的名称有关，和参数列表无关
        //     5.调用：
        //         方法名称(实际参数列表);


        //1.创建方式1
        var fun1 = new Function("a", "b", "alert(a);");
        //调用方法
        fun1(3, 4);

        //2.创建方式2
        function fun2(a, b) {
            alert(a + b);
        }
        //调用方法
        fun2(3, 4);

        //3.创建方式3
        var fun3 = function(a, b) {
                alert(a + b);
        }
        //调用方法
        fun3(3, 4);

        //求任意数的和
        function add() {
            var sum = 0;
            for (var i = 0; i < arguments.length; i++) {
                sum += arguments[i];
            }
            return sum;
        }

        var sum = add(1, 2, 3, 4);
        alert(sum);
    </script>
</head>

<body>

</body>

</html>
```

--------

#### 2.Array

数组对象

```html
<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Array对象</title>
    <script>
        // Array：数组对象
        //     1.创建：
        //         1.var arr = new Array(元素列表);
        //         2.var arr = new Array(默认长度);
        //         3.var arr = [元素列表];
        //     2.方法
        //         1.join(参数)：将数组中的元素按照指定的分隔符拼接为字符串
        //         2.push()：向数组的末尾添加一个或更多元素，并返回新的长度
        //     3.属性
        //         1.length：数组的长度
        //     4.特点
        //         1.JS中，数组元素的类型是可变的
        //         1.JS中，数组长度是可变的

        //创建
        var arr1 = new Array(1, 2, 3);
        var arr2 = new Array(5);
        var arr3 = [1, 2, 3, 4];

        document.write(arr1 + "<br>");
        document.write(arr2 + "<br>");
        document.write(arr3 + "<br>");
    </script>
</head>

<body>

</body>

</html>
```

------

#### 3.Boolean

Boolean对象表示两个值："true"或"flase"。

创建Boolean对象的语法：

```javascript
new Boolean(value);     //构造函数
Boolean(value);         //转换函数
```

-----

#### 4.Date

Date对象用于处理日期和时间。

创建Date对象的语法：

```javascript
var myDate = new Date();
```

方法：

```javascript
toLocaleString();//返回当前date对象对应的时间本地字符串格式
getTime()：//获取毫秒值。返回当前日期对象描述的时间到1970年1月1日零点的毫秒值差
```

#### 5.Math

数学对象

创建：

* 特点：Math对象不用创建，直接使用。Math.方法名

方法：

* random()：0~1随机数字(左开右闭)
* ceil(x)：向上取整
* floor(x)：向下取整
* round(x)：四舍五入

属性：

* PI

![20220315140632](https://tonkyshan.cn/img/202203151406411.png)

------

#### 6.Number

#### 7.String

-------

#### 8.RegExp

**正则表达式对象**

一.正则表达式：定义字符串的组成规则。

1.单个字符：[ ]

* 如 [a] [ab] [a - zA - Z0 - 9 _ ]

特殊符号代表特殊含义的单个字符：\d：单个数字字符 [0 - 9]    \w：单个单词字符[a - zA - Z0 - 9 _ ]

2.量词符号：

​       ?：表示出现0次或1次

​       *：表示出现0次或多次

​       +：表示出现1次或多次

{m, n}：表示m<= 数量 <= n

* 如果m不写，最多n次
* 如果n不写，最少m次

3.开始结束符号

* ^：开始
* $：结束

二.正则对象

​	1.创建

```javascript
var reg = new RegExp("正则表达式");
var reg = /正则表达式/;
```

​	2.方法

```javascript
1.test(参数)：//验证指定的字符串是否符合正则定义的规范，符合返回true，不符合返回false
```

第一种方式定义正则表达式时：

```javascript
var reg = new RegExp("^\\w{6,12}$");
//需要用两根反斜线，去除转译含义
//第二种不需要
var reg2 = /^\w{6,12}$/;
```

-----

#### 9.Global

1.特点：全局对象，这个Global中封装的方法不需要对象就可以直接调用。   方法名();

2.方法：

```javascript
encodeURI()：//url编码
decodeURI()：//url解码

encodeURIComponent()：//url编码，编码的字符更多
decodeURIComponent()：//url解码

parseInt()：//将字符串转为数字
//逐一判断每一个字符是否是数字，直到不是数字为止，将前边数字部分转为number

isNaN()：//判断一个值是否是NaN
//NaN参与的==比较，结果全为false

eval()：//计算JavaScript字符串，并把它作为脚本代码来执行
```

URL编码

```
//工程师
encodeURI	%E5%B7%A5%E7%A8%8B%E5%B8%88
encodeURIComponent	%E5%B7%A5%E7%A8%8B%E5%B8%88
```

```javascript
var str = "工程师";
var encode = encodeURI(str);
document.write(encode + "<br>");//%E5%B7%A5%E7%A8%8B%E5%B8%88
var s = decodeURI(encode);
document.write(s + "<br>");//工程师


var str1 = "工程师";
var encode1 = encodeURIComponent(str);
document.write(encode1 + "<br>");//%E5%B7%A5%E7%A8%8B%E5%B8%88
var s1 = decodeURIComponent(encode1);
document.write(s1 + "<br>");//工程师

var str2 = "123";
var number = parseInt(str2);
alert(number + 1);//124

var str3 = "123abc";
var number1 = parseInt(str2);
alert(number1 + 1);//124

var jscode = "alert(123)";
eval(jscode);//123
```

-----------

## 第三章   DOM

------

**DOM简单学习**

1.功能：控制html文档的内容

2.代码：获取页面标签(元素)对象   Element

```javascript
document.getElementById("id值")：//通过元素的id获取元素对象
```

```html
<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Document</title>

    <script>
        //通过id获取元素对象
        var light = document.getElementById("ligth");
        alert(light);//null
    </script>
</head>

<body>

    <img id="light" src="./img/wallhaven-5weyz8.jpg">

</body>

</html>
```

```html
<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Document</title>
</head>

<body>

    <img id="light" src="./img/wallhaven-5weyz8.jpg">

    <script>
        //通过id获取元素对象
        var light = document.getElementById("light");
        alert(light); //[object HTMLImageElement]
    </script>

</body>

</html>
```

3.操作Element对象：

* 修改属性值

  1.明确获取的对象是哪一个

  2.查看API文档，找其中有哪些属性可以设置

```html
<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Document</title>
</head>

<body>

    <img id="light" src="./img/wallhaven-5weyz8.jpg">

    <script>
        //通过id获取元素对象
        var light = document.getElementById("light");
        alert(light); //[object HTMLImageElement]
        alert("换图片");
        light.src = "./img/20220304114746.png"
    </script>

</body>

</html>
```

* 修改标签体内容

```javascript
innerHTML
```

```html
<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Document</title>
</head>

<body>

    <img id="light" src="./img/wallhaven-5weyz8.jpg">
    <h1 id="title">算法工程师</h1>

    <script>
        //通过id获取元素对象
        var light = document.getElementById("light");
        alert(light); //[object HTMLImageElement]
        alert("换图片");
        light.src = "./img/20220304114746.png"

        //获取h1标签对象
        var title = document.getElementById("title");
        alert("换内容");
        title.innerHTML = "后端工程师";
    </script>

</body>

</html>
```

**事件**

功能：某些组件被执行了某些操作后，触发某些代码的执行

如何绑定事件：

* 直接在html标签上，指定事件的属性，属性值就是js代码

​       1.事件：onclick --- 单击事件

```html
<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>事件绑定</title>
    <script>
        function fun() {
            alert("点亮");
        }
    </script>
</head>

<body>

    <img id="light" src="./img/OIP-C.jpg" onclick="fun();">

</body>

</html>
```

* 通过js获取元素对象，指定事件属性，设置一个函数

```html
<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>事件绑定</title>
</head>

<body>

    <img id="light" src="./img/OIP-C.jpg">

    <script>
        function fun() {
            alert("点亮");
        }
        var light = document.getElementById("light");
        light.onclick = fun;
    </script>

</body>

</html>
```

**案例一：灯泡开关**

```html
<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>电灯开关</title>
</head>

<body>

    <img id="light" src="./img/OIP-C.jpg" alt="">

    <script>
        var light = document.getElementById("light");
        var flag = false;
        light.onclick = function() {
            if (flag) {
                light.src = "./img/OIP-C.jpg"
                flag = false;
            } else {
                light.src = "./img/R-C.png"
                flag = true;
            }

        }
    </script>

</body>

</html>
```

----------

### 3.1DOM

---

1.概念：Document Object Model   文档对象模型

* 将标记语言文档的各个组成部分，封装为对象。可以使用这些对象，对标记语言文档进行CRUD的动态操作。

**DOM树**

![ct_htmltree](https://tonkyshan.cn/img/202203172051609.gif)

2.W3C DOM 标准被分为3个不同的部分：

* 核心DOM - 针对任何结构化文档的标准模型

  * Document：文档对象

  * Element：元素对象

  * Attribute：属性对象

  * Text：文本对象

  * Comment：注释对象

    

  * Node：节点对象，其他5个的父对象

* XML DOM - 针对XML文档的标准模型

* HTML DOM - 针对HTML文档的标准模型

---------

### 3.2Document对象

-------

**1.创建**

在html dom模型中可以使用window对象来获取

* window.document等同于document

**2.方法**

* 获取Element对象
  * getElementById()：根据id属性值获取元素对象。id属性值一般唯一。
  * getElementsByTagName()：根据元素名称获取元素对象们。返回值是一个数组。
  * getElementsByClassName()：根据Class属性值获取元素对象们。返回值是一个数组。
  * getElementsByName()：根据name属性值获取元素对象们。返回值是一个数组。
* 创建其他DOM对象
  * createAttribute(name)：创建拥有指定名称的属性节点，并返回新的 Attr 对象。
  * createComment()：创建注释节点
  * createElement()：创建元素节点
  * createTextNode()：创建文本节点

**3.属性**

```html
<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Document对象</title>
</head>

<body>

    <div id="div1">div1</div>
    <div id="div2">div2</div>

    <div id="div3">div3</div>

    <div class="cls1">div4</div>
    <div class="cls1">div5</div>

    <input type="text" name="username">

    <script>
        var div = document.getElementsByTagName("div");
        alert(div.length);

        var div_cls = document.getElementsByClassName("cls1");
        alert(div_cls.length);

        var ele_username = document.getElementsByName("username");
        alert(ele_username.length);
        
        var table = document.createElement("table");
        alert(table);
    </script>

</body>

</html>
```

-----

### 3.3Element对象

-----

**1.获取/创建**

通过document来获取和创建

**2.方法**

* removeAttribute()：删除属性
* setAttribute()：设置属性

```html
<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Element对象</title>
</head>

<body>

    <a>点击</a>
    <input type="button" id="btn_set" value="设置属性">
    <input type="button" id="btn_remove" value="删除属性">

    <script>
        var btn_set = document.getElementById("btn_set");
        btn_set.onclick = function() {
            var a = document.getElementsByTagName("a")[0];
            a.setAttribute("href", "https://www.baidu.com");
        }

        var btn_set = document.getElementById("btn_remove");
        btn_remove.onclick = function() {
            var a = document.getElementsByTagName("a")[0];
            a.removeAttribute("href");
        }
    </script>

</body>

</html>
```

-------

### 3.4Node对象

--------

节点对象，其他5个的父对象

**1.特点**

所有dom对象都可以被认为是一个节点

**2.方法**

* CRUD dom树
  * appendChild()：向节点的子节点列表的结尾添加新的子节点。
  * removeChild()：删除(并返回)当前节点的指定子节点。
  * replaceChild()：用新节点替换一个子节点。

**3.属性**

* parentNode   返回节点的父节点

```html
<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Node对象</title>
    <style>
        div {
            border: 1px solid red;
        }
        
        #div1 {
            width: 200px;
            height: 200px;
        }
        
        #div2 {
            width: 100px;
            height: 100px;
        }
        
        #div3 {
            width: 100px;
            height: 100px;
        }
    </style>
</head>

<body>

    <div id="div1">
        <div id="div2">div2</div>
        div1
    </div>

    <a href="javascript:void(0);" id="del">删除子节点</a>
    <a href="javascript:void(0);" id="add">添加子节点</a>
    <!-- <input type="button" id="del" value="删除子节点"> -->

    <script>
        document.getElementById("del").onclick = function() {
            document.getElementById("div1").removeChild(document.getElementById("div2"));
        }

        document.getElementById("add").onclick = function() {
            var div1 = document.getElementById("div1");
            var div3 = document.createElement("div");
            div3.setAttribute("id", "div3");
            div1.appendChild(div3);
        }


        alert(document.getElementById("div2").parentNode);
        //超链接功能：
        // 1. 可以被点击：样式
        // 2.点击后跳转到href指定的url

        //需求：保留1功能，去掉2功能
        //实现：href = "javascript:void(0);"
    </script>

</body>

</html>
```

--------

**案例：动态表格**

-------

```html
<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>动态表格</title>
    <style>
        table {
            border: 1px solid;
            margin: auto;
            width: 500px;
        }
        
        td,
        th {
            text-align: center;
            border: 1px solid;
        }
        
        div {
            text-align: center;
            margin: 50px;
        }
    </style>
</head>

<body>

    <div>
        <input type="text" id="id" placeholder="请输入编号">
        <input type="text" id="name" placeholder="请输入姓名">
        <input type="text" id="gender" placeholder="请输入性别">
        <input type="button" value="添加" id="btn_add">
    </div>

    <table>
        <caption>学生信息表</caption>
        <tr>
            <th>编号</th>
            <th>姓名</th>
            <th>性别</th>
            <th>操作</th>
        </tr>

        <tr>
            <th>1</th>
            <th>张三</th>
            <th>男</th>
            <td><a href="javascript:void(0);" onclick="delTr(this);">删除</a></td>
        </tr>
    </table>


    <script>
        document.getElementById("btn_add").onclick = function() {
            var id = document.getElementById("id").value;
            var name = document.getElementById("name").value;
            var gender = document.getElementById("gender").value;

            var td_id = document.createElement("td");
            var text_id = document.createTextNode(id);
            td_id.appendChild(text_id);

            var td_name = document.createElement("td");
            var text_name = document.createTextNode(name);
            td_name.appendChild(text_name);

            var td_gender = document.createElement("td");
            var text_gender = document.createTextNode(gender);
            td_gender.appendChild(text_gender);

            var td_a = document.createElement("td");
            var ele_a = document.createElement("a");
            ele_a.setAttribute("href", "javascript:void(0);")
            ele_a.setAttribute("onclick", "delTr(this);")
            var text_a = document.createTextNode("删除");
            ele_a.appendChild(text_a);
            td_a.appendChild(ele_a);

            var tr = document.createElement("tr");
            tr.appendChild(td_id);
            tr.appendChild(td_name);
            tr.appendChild(td_gender);
            tr.appendChild(td_a);

            document.getElementsByTagName("table")[0].appendChild(tr);
        }

        function delTr(obj) {
            var table = obj.parentNode.parentNode.parentNode;
            var tr = obj.parentNode.parentNode;

            table.removeChild(tr);
        }
    </script>


</body>

</html>
```

------

### 3.5HTML   DOM

-----

1.标签体的设置和获取：innerHTML

2.使用html元素对象的属性

3.控制样式

* 使用元素的style属性来设置
* 提前定义好类选择器的样式，通过元素的className属性来设置其class属性值

```html
<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>HTMLDOM</title>
    <style>
        .d1 {
            border: 1px solid red;
            width: 100px;
            height: 100px;
        }
        
        .d2 {
            border: 1px solid blue;
            width: 200px;
            height: 200px;
        }
    </style>
</head>

<body>

    <div id="div1">
        div1
    </div>

    <div id="div2">
        div2
    </div>

    <script>
        var innerHTML = document.getElementById("div1").innerHTML;
        alert(innerHTML);

        // document.getElementById("div1").innerHTML = "<input type='text'>";
        var div = document.getElementById("div1");
        var innerHTML = div.innerHTML;
        div.innerHTML += "<input type='text'>";

        var div1 = document.getElementById("div1");
        div1.onclick = function() {
            //修改样式方式1
            div.style.border = "1px solid red";
            div.style.width = "200px"

            //font-size --> fontSize
        }

        var div2 = document.getElementById("div2");
        div2.onclick = function() {
            div2.className = "d2";
        }
    </script>

</body>

</html>
```

**案例四代码简化：**

```html
<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>动态表格</title>
    <style>
        table {
            border: 1px solid;
            margin: auto;
            width: 500px;
        }
        
        td,
        th {
            text-align: center;
            border: 1px solid;
        }
        
        div {
            text-align: center;
            margin: 50px;
        }
    </style>
</head>

<body>

    <div>
        <input type="text" id="id" placeholder="请输入编号">
        <input type="text" id="name" placeholder="请输入姓名">
        <input type="text" id="gender" placeholder="请输入性别">
        <input type="button" value="添加" id="btn_add">
    </div>

    <table>
        <caption>学生信息表</caption>
        <tr>
            <th>编号</th>
            <th>姓名</th>
            <th>性别</th>
            <th>操作</th>
        </tr>

        <tr>
            <td>1</td>
            <td>张三</td>
            <td>男</td>
            <td><a href="javascript:void(0);" onclick="delTr(this);">删除</a></td>
        </tr>
    </table>

    <script>
        document.getElementById("btn_add").onclick = function() {
            var id = document.getElementById("id").value;
            var name = document.getElementById("name").value;
            var gender = document.getElementById("gender").value;

            document.getElementsByTagName("table")[0].innerHTML += "<tr>\n" +
                "<td>" + id + "</td>\n" +
                "<td>" + name + "</td>\n" +
                "<td>" + gender + "</td>\n" +
                "<td><a href='javascript:void(0);' onclick='delTr(this);'>删除</a></td>\n" +
                "</tr>";
        }

        function delTr(obj) {
            var table = obj.parentNode.parentNode.parentNode;
            var tr = obj.parentNode.parentNode;

            table.removeChild(tr);
        }
    </script>

</body>

</html>
```

-------

### 3.6事件监听机制

-----

* 概念：某些组件被执行了某些操作后，触发某些代码的执行。

  * 事件：某些操作。如单机，双击，键盘按下，鼠标移动
  * 事件源：组件。如：按钮   文本输入框
  * 监听器：代码
  * 注册监听：将事件，事件源，监听器结合在一起。当事件源上发生了某个事件，则触发执行某个监听代码。

* 常见的事件：

  * 点击事件：

    1.onclick：单击事件

    2.ondblclick：双击事件

  * 焦点事件：

    1.onblur：失去焦点

    2.onfocus：元素获得焦点

  * 加载事件：

    1.onload：一张页面或一副图像完成加载

  * 鼠标事件：

    1.onmousedown：鼠标按钮被摁下

    2.onmouseup：鼠标按键被松开

    3.onmousemove：鼠标被移动

    4.onmouseover：鼠标移到某元素之上

    5.onmouseout：鼠标从某元素移开

  * 键盘事件：

    1.onkeydown：某个键盘按键被按下

    2.inkeyup：某个键盘按键被松开

    3.onkeypress：某个键盘按键被摁下并松开

  * 选择和改变：

    1.onchange：域的内容被改变

    2.onselect：文本被选中

  * 表单事件：

    1.onsubmit：确认按钮被点击

    2.onreset：重置按钮被点击

------

## 第四章   BOM

-------

1.概念：Browser Object Model   浏览器对象模型

将浏览器的各个组成部分封装成对象

* **Window (窗口对象)**
* Navigator (浏览器对象)
* Screen (显示器屏幕对象)
* **History (历史记录对象)**
* **Location (地址栏对象)**

### 4.1Window对象

----------

**1.创建**(不用创建，直接使用)

**2.方法**

* **与弹出框有关的方法**

  1.alert() 显示带有一段消息和一个确认按钮的警告框。

  2.confirm() 显示带有一段消息以及确认按钮和取消按钮的对话框。

  * 如果用户点击确认按钮，则方法返回true
  * 如果用户点击取消按钮，则方法返回false

  3.prompt() 显示可提示用户输入的对话框。

  * 返回值：获取用户输入的值


* **与打开关闭有关的方法**

  1.close() 关闭浏览器窗口(谁调用方法，关闭谁)

  2.open() 打开一个新的浏览器窗口(返回新的Window对象)

* **与定时器有关的方法**

  1.setTimeout()：在指定的毫秒数后调用函数或计算表达式

  * 参数

    1.js代码或者方法对象

    2.毫秒值

  * 返回值：唯一标识，用于取消定时器

  2.clearTimeout()：取消由setTimeout()方法设置的timeout

  3.setInterval()：按照指定的周期(以毫秒计)来调用函数或计算表达式

  * 参数与返回值和setTimeout()一模一样

  4.clearInterval()：取消由setInterval()设置的timeout

**3.属性**

* **获取其他BOM对象**

  history

  location

  Navigator

  Screen

* **获取DOM对象**

  document

**4.特点**

* Window对象不需要创建，可以直接使用window使用。window.方法名();
* window引用可以省略。方法名();

```html
<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Window对象</title>
</head>

<body>

    <input id="openBtn" type="button" value="打开窗口">
    <input id="closeBtn" type="button" value="关闭窗口">

    <script>
        var openBtn = document.getElementById("openBtn");
        var closeBtn = document.getElementById("closeBtn");
        var newWindow;
        openBtn.onclick = function() {
            newWindow = open("https://www.baidu.com");
        }

        closeBtn.onclick = function() {
            newWindow.close();
        }
        
        //一次性定时器
        var id1 = setTimeout(fun, 2000);
        clearTimeout(id1); //取消一次性定时器

        function fun() {
            alert('boom~~');
        }
        //循环定时器
        var id2 = setInterval(fun, 2000);
        clearInterval(id2); //取消循环定时器
    </script>

</body>

</html>
```

-----

**轮播图案例**

-----

**分析：**

* 在页面上使用img标签展示图片
* 定义一个方法，修改图片对象的src属性
* 定义一个定时器，每隔3秒调用方法一次

```html
<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>轮播图</title>
</head>

<body>

    <img id="img" src="./img/banner_1.jpg" alt="" width="100%" height="900px">

    <script>
        var number = 1;
        var m = ".jpg";

        function fun() {
            number++;
            if (number > 3) {
                number = 1;
            }
            if (number == 3) {
                m = ".png";
            } else m = ".jpg";

            var img = document.getElementById("img");
            img.src = "./img/banner_" + number + m;
        }

        //定义定时器
        setInterval(fun, 3000);
    </script>

</body>

</html>
```

--------

### 4.2Location对象

---

**地址栏对象**

**1.创建**

* window.location等同于location

**2.方法**

* reload()：重新加载当前文档。刷新

**3.属性**

* href：设置或返回完整的URL。

```html
<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Location对象</title>
</head>

<body>

    <input type="button" id="btn" value="刷新">
    <input type="button" id="go" value="访问">

    <script>
        var btn = document.getElementById("btn");
        btn.onclick = function() {
            location.reload();
        }

        var href = location.href;
        alert(href);

        var go = document.getElementById("go");
        go.onclick = function() {
            location.href = "https://www.baidu.com";
        }
    </script>

</body>

</html>
```

----

**案例：自动跳转首页**

---

```html
<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>自动跳转首页</title>
    <style>
        p {
            text-align: center;
        }
        
        span {
            color: red;
        }
    </style>

</head>

<body>

    <p>
        <span id="time">5</span>秒之后，自动跳转首页...
    </p>

    <script>
        var second = 5;
        var time = document.getElementById("time");

        function showTime() {
            second--;

            if (second <= 0) {
                location.href = "https://www.baidu.com";
            }

            time.innerHTML = second + "";
        }

        setInterval(showTime, 1000);
    </script>
</body>

</html>
```

-------

### 4.3History对象

----

**历史记录对象**

当前window窗口所访问的历史记录

**1.创建**

* windows.history等同于history

**2.方法**

* back()      加载history列表中的前一个URL。
* forward()  加载history列表中的下一个URL。
* go(参数)   加载history列表中的某个具体页面。
  * 正数：前进几个历史记录
  * 负数：后退几个历史记录

**3.属性**

* length    返回当前窗口历史列表中的URL数量。

```html
<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>History对象</title>
</head>

<body>

    <input type="button" id="btn" value="获取历史记录个数">

    <script>
        var btn = document.getElementById("btn");
        btn.onclick = function() {
            var length = history.length;
            alert(length);
        }
    </script>

</body>

</html>
```
