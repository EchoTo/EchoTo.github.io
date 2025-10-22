---
title: 'Junit,反射,注解,枚举类'
date: 2022-01-17 11:13:46
tags: [Junit,反射,注解,枚举类]
categories: java
---

## Junit、反射、注解、枚举类

--------

## 第一章	Junit单元测试

-----------

### 1.1概述

* 测试分类：

1.黑盒测试：不需要写代码，给输入值，看程序是否能够输出期望的值。

2.白盒测试：需要写代码。关注程序具体的执行流程。

![20210820172911](https://tonkyshan.cn/img/202202281801968.png)

---------

### 1.2使用步骤

**Junit(白盒测试)**

**步骤：**

1.定义一个测试类(测试用例)

建议：测试类名：被测试的类名Test

​           包名：xxx.xxx.xx.test

2.定义测试方法：可以独立运行

建议：方法名：test+测试的方法名

​           返回值：void

​           参数列表：空参

3.给方法加@Test

4.导入junit依赖环境

**判定结果：**

* 红色：失败

* 绿色：成功

一般我们会使用断言操作来处理结果

* Assert.assertEquals(期望的结果,运算的结果);

```java
package com.priv.demo01Junit;

public class Demo01Junit {
    /**
     * 加法
     * @param a
     * @param b
     * @return
     */
    public int add(int a,int b){
        return a+b;
    }

    /**
     * 减法
     * @param a
     * @param b
     * @return
     */
    public int sub(int a,int b){
        return a-b;
    }
}
```

```java
package com.priv.test;

import com.priv.demo01Junit.Demo01Junit;
import org.junit.Assert;
import org.junit.Test;

public class Demo01JunitTest {


    /**
     * 测试add方法
     */
    @Test
    public void testAdd(){
        Demo01Junit d =new Demo01Junit();
        int i = d.add(1, 2);
        System.out.println(i);

        //断言
        Assert.assertEquals(3,i);
    }

    @Test
    public void testSub(){
        Demo01Junit d =new Demo01Junit();
        int i = d.sub(1, 2);
        System.out.println(i);
        //断言
        Assert.assertEquals(-1,i);
    }
}
```

---------

### 1.3@Before&@After

1.@Before：

* 修饰的方法会在测试方法之前被自动执行

2.@After：

* 修饰的方法会在测试方法之后被自动执行

```java
/**
 * 初始化方法：
 *   用于资源申请，所有测试方法在执行之前都会执行该方法
 */
@Before
public void init(){
    System.out.println("init...");
}

/**
 * 释放资源方法：
 *   在所有测试方法执行完后，都会自动执行该方法
 */
@After
public void close(){
    System.out.println("close...");
}
```

------

## 第二章	反射

----

### 2.1概述

**反射：框架设计的灵魂**

框架：半成品软件。可以在框架的基础上进行软件开发，简化编码

反射：将类的各个组成部分封装为其他对象，这就是反射机制。

![20210820192313](https://tonkyshan.cn/img/202202281801970.png)

好处：

* 可以在程序运行过程中，操作这些对象。
* 可以解耦，提高程序的可扩展性。

-----

### 2.2获取Class对象的方式

1.Class.forName("全类名")：将字节码文件加载进内存，返回Class文件。

* 多用于配置文件，将类名定义在配置文件中。读取文件，加载类

2.类名.class：通过类名的属性class获取。

* 多用于参数的传递

3.对象.getClass()：getClass()方法在Object类中定义着。

* 多用于对象的获取字节码的方式

```java
package com.priv.demo02Reflect;

public class Demo01Reflect {
    public static void main(String[] args) throws ClassNotFoundException {
        //1.Class.forName("全类名")：将字节码文件加载进内存，返回Class文件。
        Class cls1 = Class.forName("com.priv.demo02Reflect.Person");
        System.out.println(cls1);//class com.priv.demo02Reflect.Person
        //2.类名.class：通过类名的属性class获取。
        Class cls2 = Person.class;
        System.out.println(cls2);//class com.priv.demo02Reflect.Person
        //3.对象.getClass()：getClass()方法在Object类中定义着。
        Person person =new Person();
        Class cls3 = person.getClass();
        System.out.println(cls3);//class com.priv.demo02Reflect.Person

        System.out.println(cls1==cls2);//比较地址值是否相同  true
        System.out.println(cls1==cls3);//true
        System.out.println(cls3==cls2);//true
    }
}
```

```java
package com.priv.demo02Reflect;

public class Person {
    private String name;
    private int age;

    public Person() {
    }

    public Person(String name, int age) {
        this.name = name;
        this.age = age;
    }

    @Override
    public String toString() {
        return "Person{" +
                "name='" + name + '\'' +
                ", age=" + age +
                '}';
    }

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
}
```

**结论：**

* 同一字节码文件(*.class)在一次程序运行过程中，只会被加载一次，不论通过哪一种方式获取的Class对象都是同一个。

-------

### 2.3Class对象功能

#### 概述

**1.获取功能：**

* 获取成员变量们
* 获取构造方法们
* 获取成员方法们
* 获取类名

#### 获取Field(成员变量)

* `Field[] getFields()：`返回一个包含某些 `Field` 对象的数组，这些对象反映此 `Class`  对象所表示的类或接口的所有可访问公共字段。**(获取所有public修饰的成员变量)**
* `Field[] getField(String name)：`返回一个 `Field` 对象，它反映此 `Class` 对象所表示的类或接口的指定公共成员字段。

* `Field[] getDeclaredFields()：`返回 `Field` 对象的一个数组，这些对象反映此 `Class` 对象所表示的类或接口所声明的所有字段。**(获取所有的成员变量，不考虑修饰符)**
* `Field[] getDeclaredField(String name)：`返回一个 `Field` 对象，该对象反映此 `Class` 对象所表示的类或接口的指定已声明字段。

`Field`：成员变量

操作：

1.设置值

* `void set(Object obj,Object value)`

2.获取值

* `get(Object obj)`

3.忽略访问权限修饰符的安全检查

* 对象名.setAccessible(true)：暴力反射

```java
package com.priv.demo02Reflect;

import java.lang.reflect.Field;

public class Demo02Reflect {
    public static void main(String[] args) throws Exception {
        Class personClass = Person.class;
        //`Field[] getFields()：`返回一个包含某些 `Field` 对象的数组，**(获取所有public修饰的成员变量)**
        Field[] fields = personClass.getFields();
        for (Field field:fields) {
            System.out.println(field);//public java.lang.String com.priv.demo02Reflect.Person.sex
        }

        //`Field[] getField(String name)：`返回一个 `Field` 对象，
        Field sex = personClass.getField("sex");
        //获取成员变量sex的值
        Person p =new Person();
        Object value = sex.get(p);
        System.out.println(value);//没有初始值的String类型数据默认值为null
        //设置成员变量sex的值
        sex.set(p,"man");
        System.out.println(p);//Person{name='null', age=0, sex='man'}

        //`Field[] getDeclaredFields()：返回 `Field` 对象的一个数组，**(获取所有的成员变量，不考虑修饰符)**
        Field[] declaredFields = personClass.getDeclaredFields();
        for (Field field: declaredFields) {
            System.out.println(field);
            //private java.lang.String com.priv.demo02Reflect.Person.name
            //private int com.priv.demo02Reflect.Person.age
            //public java.lang.String com.priv.demo02Reflect.Person.sex
        }

        //`Field[] getDeclaredField(String name)：`返回一个 `Field` 对象
        Field name = personClass.getDeclaredField("name");
        ///忽略访问权限修饰符的安全检查
        name.setAccessible(true);//暴力反射
        Object value1 = name.get(p);
        System.out.println(value1);//如果直接打印私有成员变量的值会报错IllegalAccessException
        //null
         
    }
}
```

#### 获取Constructor(构造方法)

* `Constructor<?>[] getConstructors()：`返回一个包含某些 `Constructor` 对象的数组，这些对象反映此 `Class`  对象所表示的类的所有公共构造方法。**(获取所有public修饰的构造方法)**
* `Constructor<T> getConstructor(类<?>... parameterTypes)：`返回一个 `Constructor` 对象，它反映此 `Class` 对象所表示的类的指定公共构造方法。
* `Constructor<T> getDeclaredConstructor(类<?>... parameterTypes)：`返回一个 `Constructor` 对象，该对象反映此 `Class` 对象所表示的类或接口的指定构造方法。
* `Constructor<?> getDeclaredConstructors()：`返回 `Constructor` 对象的一个数组，这些对象反映此 `Class` 对象表示的类声明的所有构造方法。**(获取所有的构造方法，不考虑修饰符)**

`Constructor`：构造方法

创建对象：

* `T newInstance(Object... initargs)`
* 如果使用空参数构造方法创建对象，操作可以简化：Class对象的newInstance方法
* 忽略访问权限修饰符的安全检查，对象名.setAccessible(true)：暴力反射

```java
package com.priv.demo02Reflect;

import java.lang.reflect.Constructor;

public class Demo03ReflectConstructor {
    public static void main(String[] args) throws Exception {
        Class personClass = Person.class;
        //`Constructor<?>[] getConstructors()：`返回一个包含某些 `Constructor` 对象的数组
        Constructor[] constructors = personClass.getConstructors();
        for (Constructor constructor:constructors) {
            System.out.println(constructor);
            //public com.priv.demo02Reflect.Person()
            //public com.priv.demo02Reflect.Person(java.lang.String,int,java.lang.String)
        }

        //`Constructor<T> getConstructor(类<?>... parameterTypes)：`返回一个 `Constructor` 对象
        //满参
        Constructor constructor = personClass.getConstructor(String.class, int.class, String.class);
        System.out.println(constructor);//public com.priv.demo02Reflect.Person(java.lang.String,int,java.lang.String)
        //创建对象
        Object person = constructor.newInstance("张三", 24, "man");
        System.out.println(person);//Person{name='张三', age=24, sex='man'}
        //空参
        Constructor constructor1 = personClass.getConstructor();
        System.out.println(constructor1);//public com.priv.demo02Reflect.Person()
        //创建对象
        Object person1 = constructor1.newInstance();
        System.out.println(person1);//Person{name='null', age=0, sex='null'}
        //相当于Object o = personClass.newInstance();
        
    }
}
```

#### 获取Method(成员方法)

* `Method[] getMethods()：`返回一个包含某些 `Method` 对象的数组，这些对象反映此 `Class`  对象所表示的类或接口（包括那些由该类或接口声明的以及从超类和超接口继承的那些的类或接口）的公共 *member* 方法。**(获取所有public修饰的成员方法)**
* `Method[] getMethod(String name,类<?>... parameterTypes)：`返回一个 `Method` 对象，它反映此 `Class` 对象所表示的类或接口的指定公共成员方法。
* `Method[] getDeclaredMethods()：`返回 `Method` 对象的一个数组，这些对象反映此 `Class`  对象表示的类或接口声明的所有方法，包括公共、保护、默认（包）访问和私有方法，但不包括继承的方法。**(获取所有的成员方法，不考虑修饰符)**
* `Method[] getDeclaredMethod(String name,类<?>... parameterTypes)：`返回一个 `Method` 对象，该对象反映此 `Class` 对象所表示的类或接口的指定已声明方法。

Method：方法对象

* 执行方法：`Object invoke(Object obj,Object... args)`
* 获取方法名称：`String getName`：获取方法名

```java
package com.priv.demo02Reflect;

import java.lang.reflect.Method;

public class Demo04ReflectMethod {
    public static void main(String[] args) throws Exception {
        Class<Person> personClass = Person.class;
        //`Method[] getMethods()：`返回一个包含某些 `Method` 对象的数组
        Method[] methods = personClass.getMethods();
        for (Method method:methods) {
            System.out.println(method);
            String name = method.getName();
            System.out.println(name);
        }
            //public java.lang.String com.priv.demo02Reflect.Person.toString()
            //public java.lang.String com.priv.demo02Reflect.Person.getName()
            //public void com.priv.demo02Reflect.Person.setName(java.lang.String)
            //public void com.priv.demo02Reflect.Person.setAge(int)
            //public java.lang.String com.priv.demo02Reflect.Person.getSex()
            //public void com.priv.demo02Reflect.Person.setSex(java.lang.String)
            //public int com.priv.demo02Reflect.Person.getAge()
            //public final void java.lang.Object.wait() throws java.lang.InterruptedException
            //public final void java.lang.Object.wait(long,int) throws java.lang.InterruptedException
            //public final native void java.lang.Object.wait(long) throws java.lang.InterruptedException
            //public boolean java.lang.Object.equals(java.lang.Object)
            //public native int java.lang.Object.hashCode()
            //public final native java.lang.Class java.lang.Object.getClass()
            //public final native void java.lang.Object.notify()
            //public final native void java.lang.Object.notifyAll()

            //`Method[] getMethod(String name,类<?>... parameterTypes)：`返回一个 `Method` 对象
            Method eat = personClass.getMethod("eat");
            System.out.println(eat);//public void com.priv.demo02Reflect.Person.eat()
            Person p =new Person();
            //执行方法
            eat.invoke(p);

            Method eat1 = personClass.getMethod("eat", String.class);
            eat1.invoke(p,"饭");

        }
    }
```

#### 获取类名

* `String getName()：`以 `String` 的形式返回此 `Class` 对象所表示的实体（类、接口、数组类、基本类型或 void）名称。

```java
package com.priv.demo02Reflect;

public class Demo05ReflectClass {
    public static void main(String[] args) {
        Class personClass = Person.class;
        String name = personClass.getName();
        System.out.println(name);//com.priv.demo02Reflect.Person
    }
}
```

---------

### 2.4案例

需求：写一个"框架"，不能改变该类任何代码的前提下，可以帮助我们创建任意类的对象，并且执行其中任意方法。

**1.实现：**

* 配置对象

* 反射

**2.步骤：**

* 将需要创建的对象的全类名和需要执行的方法定义在配置文件中
* 在程序中加载读取配置文件
* 使用反射技术来加载类文件进内存
* 创建对象
* 执行方法

```
className=com.priv.demo02Reflect.Person
methodName=eat
```

```java
package com.priv.demo02Reflect;

import java.io.InputStream;
import java.lang.reflect.Method;
import java.util.Properties;

public class Demo06ReflectTest {
    public static void main(String[] args) throws Exception {
      //在程序中加载读取配置文件
        Properties properties =new Properties();
        ClassLoader classLoader = Demo06ReflectTest.class.getClassLoader();
        InputStream resourceAsStream = classLoader.getResourceAsStream("pro.properties");
        properties.load(resourceAsStream);
        //获取配置文件中的数据
        String className = properties.getProperty("className");//获取全类名
        String methodName = properties.getProperty("methodName");//获取方法名
        //使用反射技术来加载类文件进内存
        Class aClass = Class.forName(className);//获取Class对象aClass
        Object obj = aClass.newInstance();
        //获取方法对象
        Method method = aClass.getMethod(methodName);
        method.invoke(obj);
    }
}
```

-------

## 第三章	注解

----

### 3.1概念

* 注解：说明程序的。给计算机看

* 注释：用文字描述程序的。给程序员看

**定义：**注解(Annotation)，也叫元数据。一种代码级别的说明。它是JDK1.5及以后版本引入的一个特性，与类、接口、枚举是在同一个层次。它可以声明在包、类、字段、方法、局部变量、方法参数等的前面，用来对这些元素进行说明，注释。

**概念描述：**

* JDK1.5之后的新特性
* 说明程序的
* 使用注解：@注解名称

**作用分类：**

* 编写文档:通过代码里标识的注解生成文档【生成文档doc文档】javadoc命令生成文档

* 代码分析:通过代码里标识的注解对代码进行分析【使用反射】
* 编译检查:通过代码里标识的注解让编译器能够实现基本的编译检查【override】

---------

### 3.2JDK内置注解

#### 1.@Override

检测被该注解标注的方法是否是继承自父类(接口)的

#### 2.@Deprecated

将该注解标注的内容，表示**已过时**

#### 3.@SuppressWarnings

压制警告

一般传递参数all：@SuppressWarnings(all)

```java
package com.priv.demo03Annotation;
/**
 * JDK内置注解演示
 */

@SuppressWarnings("all")//压制所有的警告⚠
public class Demo02Annotation {

    //### 1.@Override
    //
    //检测被该注解标注的方法是否是继承自父类(接口)的
    @Override
    public String toString() {
        return super.toString();
    }

    @Deprecated
    public void show01(){
        //有缺陷
    }

    public void show02(){
        //替代show01方法
    }

    public void demo(){
        show01();//已过时  不建议使用
    }
}
```

---

### 3.3自定义注解

#### 格式&本质

**格式：**

* 元注解

* ```java
  public @interface 注解名称{
      属性列表;
  }
  ```

  

**本质：**

注解本质上就是一个接口，该接口默认继承Annotation接口

```java
public interface Demo03MyAnnotation extends java.lang.annotation.Annotation {}
```

#### 属性定义

**属性：**接口中的抽象方法

要求：

* **属性的返回类型有下列取值：**

1.基本数据类型

2.String

3.枚举

4.注解

以上类型的数组

* **定义了属性，在使用时需要给属性赋值**

1.如果定义属性时，使用default关键字给属性默认初始化值，则使用注解时，可以不进行属性的赋值。

2.如果只有一个属性需要赋值，并且属性的名称是value，则value可以省略，直接定义值即可。

3.数组赋值时，值使用{ }包裹。如果数组中只有一个值，则{ }可以省略。

#### 元注解

用于描述注解的注解

##### @Target

**描述注解能够作用的位置**

ElementType取值：

* TYPE：可以作用于类上
* METHOD：可以作用于方法上
* FIELD：可以作用于成员变量上

赋值时value可以省略

##### @Retention

**描述注解被保留的阶段**

* @Retention(RetentionPolicy.SOURCE)：当前被描述的注解，不会保留到class字节码文件中。
* @Retention(RetentionPolicy.CLASS)：当前被描述的注解，会保留到class字节码文件中，但是不会JVM读取到。
* @Retention(RetentionPolicy.RUNTIME)：当前被描述的注解，会保留到class字节码文件中，并被JVM读取到。

##### @Documented

**描述注解是否被抽取到api文档中**

加入此注解后的注解，在标记时，会在api文档中显示(显示的是被@Documented标注的那个注解)。

##### @Inherited

**描述注解是否被子类继承**

当A注解被此注解描述时，一个类继承了被A注解标注的类时，这个子类会继承这个A注解。

---------

### 3.4解析(使用)注解

**获取注解中定义的属性值**

1.获取注解定义的位置的对象(class,Method,Field)

2.获取指定的注解
       *getAnnotation(class)

3.调用注解中的抽象方法获取配置的属性值

> 字节码文件对象.getAnnotation(注解名.class)来获取注解对象
>
> 注解对象.方法获取定义的抽象方法的返回值

```java
package com.priv.demo03Annotation;

import java.lang.annotation.ElementType;
import java.lang.annotation.Retention;
import java.lang.annotation.RetentionPolicy;
import java.lang.annotation.Target;

/**
 *描述需要执行的类名，方法名
 */
@Target({ElementType.TYPE})
@Retention(RetentionPolicy.RUNTIME)
public @interface Pro {
      String className();
      String MethodName();
}
```

```java
package com.priv.demo03Annotation;

import java.lang.reflect.Method;

@Pro(className = "com.priv.demo03Annotation.Demo06",MethodName = "show01")
public class Demo05ReflectTest {
    public static void main(String[] args) throws Exception {
    //1.解析注解
        //1.1获取该类的字节码文件对象
        Class<Demo05ReflectTest> d = Demo05ReflectTest.class;
        //2.获取上边的注解对象
        Pro annotation = d.getAnnotation(Pro.class);///其实就是在内存中生成了一个该注解接口的子类实现对象
        //3.调用注解对象中定义的抽象方法，获取返回值
        String s = annotation.className();
        String s1 = annotation.MethodName();
        //使用反射技术来加载类文件进内存
        Class aClass = Class.forName(s);//获取Class对象aClass
        Object obj = aClass.newInstance();
        //获取方法对象
        Method method = aClass.getMethod(s1);
        method.invoke(obj);
    }
}
```

------------

### 3.5案例：简单的测试框架

```java
package com.priv.demo03Annotation;

import java.lang.annotation.ElementType;
import java.lang.annotation.Retention;
import java.lang.annotation.RetentionPolicy;
import java.lang.annotation.Target;

/**
 *描述需要执行的类名，方法名
 */
@Target({ElementType.TYPE})
@Retention(RetentionPolicy.RUNTIME)
public @interface Pro {
      String className();
      String MethodName();
}
```

```java
package com.priv.demo03Annotation;

public class Demo08Calculator {

    //加法
    public void add(){
        System.out.println("1+0="+(1+0));
    }

    //减法
    public void sbu(){
        System.out.println("1-0="+(1-0));
    }

    //乘法
    public void mul(){
        System.out.println("1*0="+(1*0));
    }

    //除法
    public void div(){
        System.out.println("1/0="+(1/0));//InvocationTargetException
    }

    public void show(){
        System.out.println("永无bug...");
    }
}
```

```java
package com.priv.demo03Annotation;

import java.lang.reflect.Method;

/**
 * 测试类框架
 */
@Pro(className = "com.priv.demo03Annotation.Demo08Calculator",MethodName = "show")
public class Demo09Test {
    public static void main(String[] args) throws Exception {
        //解析注解
        //获取该类的字节码文件对象
        Class<Demo09Test> demo09TestClass = Demo09Test.class;
        //获取注解对象
        Pro annotation = demo09TestClass.getAnnotation(Pro.class);
        //调用注解对象中定义的抽象方法，获取返回值
        String s = annotation.MethodName();
        String s1 = annotation.className();
        //使用反射技术来加载类文件进内存
        Class<?> aClass = Class.forName(s1);//获取Class对象aClass
        Object obj = aClass.newInstance();
        //获取方法对象
        Method method = aClass.getMethod(s);
        method.invoke(obj);
    }
}
```

------

## 第四章	枚举类

--------

### 4.1枚举类的使用

* 类的对象：有限个，确定的

![20210821113625](https://tonkyshan.cn/img/202202281801978.png)

* 当需要定义一组常量时，强烈建议使用枚举类
* 如果枚举类中只有一个对象，则可以作为单例模式的实现方式

--------

### 4.2定义枚举类

方式一：jdk5.0之前，自定义枚举类

```java
package com.priv.demo01Enum;

public class Demo01Enum {
    public static void main(String[] args) {
        Season spring = Season.SPRING;
        System.out.println(spring);//Season{seasonName='春天', seasonDesc='春暖花开'}
    }
}
 class Season{
    //声明Season对象的属性：private final修饰
     private final String seasonName;
     private final String seasonDesc;
    //私有化类的构造器,并给对象属性赋值
     private Season(String seasonName, String seasonDesc){
         this.seasonName = seasonName;
         this.seasonDesc = seasonDesc;
     }
     //提供当前枚举类的多个对象：public static final的
     public static final Season SPRING =new Season("春天","春暖花开");
     public static final Season SUMMER =new Season("夏天","夏日炎炎");
     public static final Season AUTUMN =new Season("秋天","秋高气爽");
     public static final Season WINTER =new Season("冬天","冰天雪地");

     public String getSeasonName() {
         return seasonName;
     }

     public String getSeasonDesc() {
         return seasonDesc;
     }

     @Override
     public String toString() {
         return "Season{" +
                 "seasonName='" + seasonName + '\'' +
                 ", seasonDesc='" + seasonDesc + '\'' +
                 '}';
     }
 }
```

方式二：在jdk5.0，可以使用enum关键字定义枚举类

```java
package com.priv.demo01Enum;

/**
 * 使用enum关键字定义枚举类
 * 说明：定义的枚举类默认继承于java.lang.Enum类
 *
 * @author Echo
 * @create 2021 8.21 上午 12：35
 */
public class Demo02Enum {
    public static void main(String[] args) {
        Season1 spring = Season1.SPRING;
        System.out.println(spring);
        System.out.println(Season1.class.getSuperclass());//class java.lang.Enum
    }
}
enum Season1{
    SPRING("春天","春暖花开"),
    SUMMER("夏天","夏日炎炎"),
    AUTUMN("秋天","秋高气爽"),
    WINTER("冬天","冰天雪地");

    private final String seasonName;
    private final String seasonDesc;

    Season1(String seasonName, String seasonDesc){
        this.seasonName = seasonName;
        this.seasonDesc = seasonDesc;
    }

    public String getSeasonName() {
        return seasonName;
    }

    public String getSeasonDesc() {
        return seasonDesc;
    }

}
```

-----

### 4.3Enum类中的常用方法

* `values()：`返回枚举类型的对象数组。该方法可以很方便的遍历所有的枚举值。
* `valueOf(String str)：`可以把一个字符串转为对应的枚举类对象。要求字符串必须是枚举类对象的“名字”。如不是，会有运行时异常。
* `toString()：`返回当前枚举类对象常量的名称。

```java
package com.priv.demo01Enum;

/**
 * 使用enum关键字定义枚举类
 * 说明：定义的枚举类默认继承于java.lang.Enum类
 *
 * @author Echo
 * @create 2021 8.21 上午 12：35
 */
public class Demo02Enum {
    public static void main(String[] args) {
        Season1 spring = Season1.SPRING;
        //`toString()：`返回当前枚举类对象常量的名称。
        System.out.println(spring);
        System.out.println(Season1.class.getSuperclass());//class java.lang.Enum
        //`values()：`返回枚举类型的对象数组。该方法可以很方便的遍历所有的枚举值。
        Season1[] values = Season1.values();
        for (Season1 value:values) {
            System.out.println(value);
            //SPRING
            //SUMMER
            //AUTUMN
            //WINTER
        }
        Thread.State[] values1 = Thread.State.values();
        for (Thread.State s:values1) {
            System.out.println(s);
            //NEW
            //RUNNABLE
            //BLOCKED
            //WAITING
            //TIMED_WAITING
            //TERMINATED
        }
        //`valueOf(String str)：`可以把一个字符串转为对应的枚举类对象。要求字符串必须是枚举类对象的“名字”。如不是，会有运行时异常。
        Season1 winter = Season1.valueOf("WINTER");
        System.out.println(winter);//WINTER 打印方法名

    }
}
enum Season1{
    SPRING("春天","春暖花开"),
    SUMMER("夏天","夏日炎炎"),
    AUTUMN("秋天","秋高气爽"),
    WINTER("冬天","冰天雪地");

    private final String seasonName;
    private final String seasonDesc;

    Season1(String seasonName, String seasonDesc){
        this.seasonName = seasonName;
        this.seasonDesc = seasonDesc;
    }

    public String getSeasonName() {
        return seasonName;
    }

    public String getSeasonDesc() {
        return seasonDesc;
    }

}
```

----------

### 4.4使用enum关键字定义的枚举类实现接口的情况

情况一：实现接口，在enum类中实现抽象方法

情况二：让枚举类的对象分别实现接口中的抽象方法https://tonkyshan.cn/img/
