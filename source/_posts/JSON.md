---
title: JSON
date: 2022-04-02 19:03:09
tags: JSON
categories: JavaWeb
---

## JSON

--------

## 第一章   概念

------

**一、概念**

JavaScript Object Notation  JavaScript对象表示法

**Java代码：**

```java
Person p = new Person();
p.setName("张三");
p.setAge(23);
p.setGender("男");
```

**JSON代码：**

```json
var p = {"name":"张三","age":"23","gender":"男"};
```

* json现在多用于存储和交换文本信息的语法
* 进行数据的传输
* JSON比XML更小、更快、更易解析

----

## 第二章   语法

-----

### 2.1基本规则

----

一、数据在名称/值对中：json数据是由键值对构成的

* 键用引号(单双都行)引起来，也可以不使用引号

* 值的取值类型：
  * 数字(整数或浮点数)
  * 字符串(在双引号中)
  * 逻辑值(true或false)
  * 数组(在方括号中) `{"persons":[{},{}]}`
  * 对象(在花括号中) `{"adderss":{"province":"辽宁"}}`
  * null

二、数据由逗号分隔：多个键值对由逗号分隔

三、花括号保存对象：使用{}定义json格式

四、方括号保存数组：[ ]

-----

### 2.2获取数据

--------

一、json对象.键名

二、json对象["键名"]

三、数组对象[索引]

**基本获取**

```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>Title</title>
    <script>
        //1.定义基本格式
        var person = {"name":"张三","age":23,"gender":true};

        //获取name的值
        // var name = person.name;
        var name = person["name"];
        alert(name);
        // alert(person);

        //2.嵌套格式  {} ---> []
        var persons = {
            "persons":[
                {"name":"张三","age":23,"gender":true},
                {"name":"李四","age":23,"gender":true},
                {"name":"王五","age":23,"gender":false}
            ]
        };
        // alert(persons);
        //获取王五
        var name1 = persons.persons[2].name;
        alert(name1);

        //2.嵌套格式  [] ---> {}
        var ps = [
            {"name":"张三","age":23,"gender":true},
            {"name":"李四","age":23,"gender":true},
            {"name":"王五","age":23,"gender":false}
        ];
        // alert(ps);
        //获取李四
        alert(ps[1].name);

    </script>
</head>
<body>

</body>
</html>
```

**遍历获取**

```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>Title</title>
    <script>
        //1.定义基本格式
        var person = {"name":"张三","age":23,"gender":true};

        //2.嵌套格式  [] ---> {}
        var ps = [
            {"name":"张三","age":23,"gender":true},
            {"name":"李四","age":23,"gender":true},
            {"name":"王五","age":23,"gender":false}
        ];


        //获取person对象中所有的键和值
        //for in 循环
        for (var key in person){
            // alert(key);
            // alert(key + ":" + person.key);这样的方式获取不到，因为相当于person."name"
            alert(key + ":" + person[key]);
        }

        //获取ps中的所有值
        for (var i = 0; i < ps.length; i++) {
            var p = ps[i];
            for (var key in p){
                alert(key + ":" + p[key]);
            }
        }

    </script>
</head>
<body>

</body>
</html>
```

--------

## 第三章   JSON数据与Java对象

----

* JSON解析器：
  * Jsonlib，Gson，fastjson，jackson(SpringMVC内置解析器)

----

### 3.1JSON转为Java对象

-------

(了解)

* `readValue(json数据，class类型(对象类型))`

-----

### 3.2Java对象转为JSON

---

**一、使用步骤**

1.导入jackson相关jar包

2.创建Jackson核心对象 ObjectMapper

3.调用ObjectMapper的相关方法进行转换

```java
package com.priv.test;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.priv.domain.Person;
import org.junit.Test;

import java.io.File;
import java.io.FileWriter;

public class JacksonTest {

    //Java对象转JSON
    @Test
    public void test1() throws Exception {
        //创建Person对象
        Person p = new Person();
        p.setName("张三");
        p.setAge(23);
        p.setGender("男");

        //创建Jackson的核心对象  ObjectMapper
        ObjectMapper mapper = new ObjectMapper();
        //转换
        /*
        * 转换方法：
        *       writeValue(参数1，obj):
                    参数1:
                        File: 将obj对象转换为J5oN字符串，并保存到指定的文件中
                        writer: 将obj对象转换为3soN字符串，并将json数据填充到字符输出流中
                        OutputStream: 将obj对象转换为3SoN字符串，并将json数据填充到字节输出流中
                writeValueAsString(obj):将对象转为json字符串

        * */
        String json = mapper.writeValueAsString(p);

        System.out.println(json);//{"name":"张三","age":23,"gender":"男"}

        //writeValue，将数据写到d://a.txt文件中
        mapper.writeValue(new File("d://a.txt"),p);

        //writeValue，将数据关联到Writer中
        mapper.writeValue(new FileWriter("d://b.txt"),p);

    }

}
```

```java
package com.priv.domain;

public class Person {
    private String name;
    private int age;
    private String gender;

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public int getAge() {
        return age;
    }

    public void setAge(int age) {
        this.age = age;
    }

    public String getGender() {
        return gender;
    }

    public void setGender(String gender) {
        this.gender = gender;
    }

    @Override
    public String toString() {
        return "Person{" +
                "name='" + name + '\'' +
                ", age=" + age +
                ", gender='" + gender + '\'' +
                '}';
    }
}
```

**二、细节**

**1.注解**

* @JsonIgnore：排除属性
* @JsonFormat：属性值的格式化

```java
@JsonFormat(pattern = "yyy-MM-dd")

private Date birthday;//默认打印出来是毫秒值，加上注解后，会相应格式化
```

**2.复杂java对象转换**

* List：打印出来：数组
* Map：打印出来：对象格式一致
