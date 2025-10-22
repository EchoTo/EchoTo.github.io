---
title: XML基础
date: 2022-01-25 6:23:24
tags: [XML,Jsoup,JsoupXpath]
categories: JavaWeb
---

## XML基础

------

## 第一章   概念

------

1.概念：Extensible Markup Language   可扩展标记语言

* 可扩展：标签都是自定义的。`<user>`     `<student>`

2.功能：

* 存储数据

  1.配置文件

  2.在网络中传输

3.xml与html的区别

* xml标签都是自定义的，html标签是预定义的。
* xml的语法严格，html语法松散
* xml是存储数据的，html是展示数据的

W3C：万维网联盟

----

## 第二章   语法

------

### 2.1基本语法

----

* xml文档的后缀名 .xml
* xml第一行必须定义为文档声明
* xml文档中有且仅有一个根标签
* 属性值必须使用引号(单双都可)引起来
* 标签必须正确关闭
* xml标签名称区分大小写

----

### 2.2快速入门

----

```xml
<?xml version="1.0" encoding="UTF-8"?>
<users>
    <user id="1">
        <name>zhangsan</name>
        <age>23</age>
        <gender>male</gender>
    </user>
    <user id="2">
        <name>lisi</name>
        <age>24</age>
        <gender>female</gender>
    </user>
</users>
```

-----

### 2.3组成部分

------

1.文档声明

* 格式：`<?xml 属性列表?>`
* 属性列表：
  * version：版本号，必须的属性
  * encoding：编码方式。告知解析引擎当前文档使用的字符集，默认值：ISO-8859-1
  * standalone：是否独立
    * yes：不依赖其他文件
    * no：依赖其他文件

2.指令(了解)：结合CSS的

* `<?xml-stylesheet href="a.css" type="text/css"?>`

3.标签：标签名称是自定义的

* 名称可以包含字母，数字以及其他字符
* 名称不能以数字或者标点符号开始
* 名称不能以字母xml(或者XML、Xml等等)开始
* 名称不能包含空格

4.属性

* id属性值唯一

5.文本

* CSATA区：在该区域中数据会被原样展示
  * 格式：`<![CDATA][数据]>`

------

### 2.4约束

----

规定xml文档的书写规则

分类：

* DTD：一种简单的约束技术
* Schema：一种复杂的约束技术

----

#### DTD

**.dtd**

* 引入dtd文档到xml文档中
  * 内部dtd：将约束规则定义在xml文档中
    * `<!DOCTYPE 根标签名 [dtd文件内容]>`
  * 外部dtd：将约束的规则定义在外部的dtd文件中
    * 本地：`<!DOCTYPE 根标签名 SYSTEM "dtd文件的位置">`
    * 网络：`<!DOCTYPE 根标签名 PUBLIC "dtd文件名字" dtd文件的位置URL">`

缺点：不能规定标签内内容的有效性。

------

#### Schema

**.xsd**

规定好了标签内内容的数据类型和范围。

引入：

1.填写xml文档的根元素

2.引入xsi前缀

3.引入xsxd文件命名空间

4.为每一个xsd约束声明一个前缀，作为标识

-----

## 第三章   解析

----

### 3.1解析方式

-------

解析：操作xml文档，将文档中的数据读取到内存中。

* **操作xml文档**
  * 解析(读取)：将文档中的数据读取到内存中
  * 写入：将内存中的数据保存到xml文档中。持久化的存储

* **解析xml的方式**
  * DOM：将标记语言文档一次性加载进内存，在内存中形成一颗DOM树
    * 优点：操作方便，可以对文档进行CRUD的所有操作
    * 缺点：占内存
  * SAX：逐行读取，基于事件驱动的。类似指针，读一行释放一行，内存中永远只有一行
    * 优点：不占内存
    * 缺点：只能读取，不能增删改

------

### 3.2常见的解析器

-------

1.JAXP：sun公司提供的解析器，支持dom和sax两种思想。

2.DOM4J：一款非常优秀的解析器。

3.Jsoup：jsoup是一款Java的HTML解析器，可以直接解析某个URL地址、HTML文本内容。它提供了一套非常省力的API，可以通过DOM，CSS以及类似于jQuery的操作方法来取出和操作数据。

4.PULL：Android操作系统内置的解析器，sax方式的。

----------

## 第四章   Jsoup

-------

### 4.1快速入门

------

步骤：

* 导入jar包
* 获取Document对象
* 获取相应的标签Element对象
* 获取数据

```java
package com.demo.xml.jsoup;

import org.jsoup.Jsoup;
import org.jsoup.nodes.Document;
import org.jsoup.nodes.Element;
import org.jsoup.select.Elements;

import java.io.File;
import java.io.IOException;

/*
* Jsoup快速入门
* */
public class JsoupDemo1 {
    public static void main(String[] args) throws IOException {
        //2.获取Document对象，根据xml文档获取
        //2.1获取student.xml的path
        String path = JsoupDemo1.class.getClassLoader().getResource("student.xml").getPath();
        //2.2解析xml文档，加载文档进内存，获取dom树 ---> Document
        Document document = Jsoup.parse(new File(path), "utf-8");
        //2.3获取元素对象 Element
        Elements elements = document.getElementsByTag("name");

        System.out.println(elements.size());
        //3.1获取第一个name的Element对象
        Element element = elements.get(0);
        //3.2获取数据
        String name = element.text();
        System.out.println(name);
    }
}
```

```xml
<?xml version="1.0" encoding="UTF-8"?>

<students>
    <student number="1">
        <name>zhangsan</name>
        <age>23</age>
        <sex>male</sex>
    </student>
    <student number="2">
        <name>lisi</name>
        <age>24</age>
        <sex>female</sex>
    </student>
</students>
```

---------

### 4.2对象

---

**1.Jsoup对象**

工具类，可以解析html或xml文档，返回Document

* parse：解析html或xml文档，返回Document
  * `parse(File in, String charsetName)`：解析xml或html文件的。
  * `parse(String html)`：解析xml或html字符串。
  * `parse(URL url, int timeoutMillis)`：通过网络路径获取指定的html或xml的文档对象。

**2.Document对象**

文档对象，代表内存中的dom树

* 获取Element对象

  * `getElementById(String id)`：根据id属性值获取唯一的element对象。

  * `getElementsByTag(String tagName)`：根据标签名称获取元素对象集合。
  * `getElementsByAttribute(String Key)`：根据属性名称获取元素对象集合。
  * `getElementsByAttributeValue(String key, String value)`：根据对应的属性名和属性值获取元素对象集合。

**3.Elements对象**

元素Element对象的集合。可以当做`ArrayList<Element>`来使用

**4.Element对象**

元素对象

* 获取子元素对象
  * 同Document对象获取Element对象方法一致。
* 获取属性值
  * `String attr(String key)`：根据属性名称获取属性值。
* 获取文本
  * `String text()`：获取文本内容
  * `String html()`：获取标签体的所有内容(包括子标签的字符串内容)

**5.Node对象**

节点对象

* 是Document和Element的父类

-----------

### 4.3查询

-------

**1.selector：选择器**

* 使用的方法：Elements  select(String cssQuery)
  * 语法：参考Selector类中定义的语法

**2.Xpath**

即为XML路径语言，它是一种用来确定XML(标准通用标记语言的子集)文档中某部分位置的语言

* 使用Jsoup的Xpath需要导入jar包
* 查询w3cshool参考手册，使用xpath的语法完成查询

```java
package com.demo.xml.jsoup;

import cn.wanghaomiao.xpath.exception.XpathSyntaxErrorException;
import cn.wanghaomiao.xpath.model.JXDocument;
import cn.wanghaomiao.xpath.model.JXNode;
import org.jsoup.Jsoup;
import org.jsoup.nodes.Document;

import java.io.File;
import java.io.IOException;
import java.util.List;

public class JsoupDemo2 {
    public static void main(String[] args) throws IOException, XpathSyntaxErrorException {
        //1获取student.xml的path
        String path = JsoupDemo1.class.getClassLoader().getResource("student.xml").getPath();

        //2.获取Document对象
        Document document = Jsoup.parse(new File(path), "utf-8");

        //3.根据document对象，创建JXDocument对象
        JXDocument jxDocument = new JXDocument(document);

        //4.结合xpath语法查询
        List<JXNode> jxNodes = jxDocument.selN("//student");
        for (JXNode jxNode : jxNodes) {
            System.out.println(jxNode);
        }

        List<JXNode> jxNodes2 = jxDocument.selN("//student/name");
        for (JXNode jxNode : jxNodes2) {
            System.out.println(jxNode);
        }

        List<JXNode> jxNodes3 = jxDocument.selN("//student/name[@number]");
        for (JXNode jxNode : jxNodes3) {
            System.out.println(jxNode);
        }

        List<JXNode> jxNodes4 = jxDocument.selN("//student/name[@number = '1']");
        for (JXNode jxNode : jxNodes4) {
            System.out.println(jxNode);
        }

    }
}
```
