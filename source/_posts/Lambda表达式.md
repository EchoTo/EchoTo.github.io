---
title: Lambda表达式
date: 2022-01-11 13:32:13
tags: [Lambda表达式]
categories: java
---

## 第一章	Lambda表达式

-----------

### 1.1函数式编程思想概述

![20210811130116](https://tonkyshan.cn/img/202202281741356.png)

在数学中，**函数**就是有输入量、输出量的一套计算方案，也就是"拿什么东西做什么事情"。相对而言，面向对象过分强调"必须通过对象的形式来做事情"，而函数式思想则尽量忽略面向对象的复杂语法--**强调做什么，而不是以什么形式做**。

面向对象的思想：

* 做一件事情，找一个能解决这个事情的对象，调用对象的方法，完成事情。

函数式编程思想：

* 只要能获取到结果，谁去做的，怎么做的都不重要，重视的是结果，不重视过程。

--------

### 1.2冗余的Runnable代码

#### 传统写法

当需要启动一个线程去完成任务时，通常会通过`java.lang.Runnable`接口来定义任务内容，并使用`java.lang.Thread`类来启动该线程。

```java
package com.indi;

public class demo13Runnable {
    public static void main(String[] args) {
        //匿名内部类
        Runnable task =new Runnable() {
            @Override
            public void run() {//覆盖重写抽象方法
                System.out.println(Thread.currentThread().getName()+"多线程任务执行！");
            }
        };
        new Thread(task).start();//启动线程
    }
}
```

"一切皆对象"的思想：首先创建一个`Runnable`接口的匿名内部类对象来指定任务内容，再将其交给一个线程来启动。

#### 代码分析

对于`Runnable`的匿名内部类用法，可以分析出几点内容︰

* `Thread`类需要`Runnable`接口作为参数，其中的抽象run方法是用来指定线程任务内容的核心;
* 为了指定 `run`的方法体，**不得不**需要`Runnable`接口的实现类;
* 为了省去定义一个`RunnableImpl`实现类的麻烦，**不得不**使用匿名内部类;
* 必须覆盖重写抽象`run`方法，所以方法名称、方法参数、方法返回值**不得不**再写一遍，且不能写错;
* 而实际上，**似乎只有方法体才是关键所在**。

----------

### 1.3编程思想转换

#### 做什么，而不是怎么做

我们真的希望创建一个匿名内部类对象吗?不。我们只是为了做这件事情而**不得不**创建一个对象。我们真正希望做的事情是︰将`run`方法体内的代码传递给`Thread`类知晓。

**传递一段代码**——这才是我们真正的目的。而创建对象只是受限于面向对象语法而不得不采取的一种手段方式。那，有没有更加简单的办法?如果我们将关注点从"怎么做"回归到“做什么""的本质上，就会发现只要能够更好地达到目的，过程与形式其实并不重要。

#### 生活举例

![20210811133204](https://tonkyshan.cn/img/202202281741360.png)

当我们需要从北京到上海时，可以选择高铁、汽车、骑行或是徒步。我们的真正目的是到达上海，而如何才能到达上海的形式并不重要，所以我们一直在探索有没有比高铁更好的方式―一搭乘飞机。

![20210811133256](https://tonkyshan.cn/img/202202281741362.png)

而现在这种飞机(甚至是飞船）已经诞生∶2014年3月Oracle所发布的Java 8 ( JDK 1.8)中，加入了**Lambda表达式**这一重量级新特性，为我们打开了新世界的大门。

----------

### 1.4体验Lambda的更优写法

借助Java 8的全新语法，上述`Runnable`接口的匿名内部类写法可以通过更简单的Lambda表达式达到等效︰

```java
package com.indi.demo13Runnable;

public class Demo02LambdaRunnable {
    public static void main(String[] args) {
        new Thread(()-> System.out.println(Thread.currentThread().getName()+"新线程创建来")).start();//启动线程
    }
}
```

这段代码和刚才的执行效果是完全一样的，可以在1.8或更高的编译级别下通过。从代码的语义中可以看出∶我们启动了一个线程，而线程任务的内容以一种更加简洁的形式被指定。

不再有"不得不创建接口对象"的束缚，不再有"抽象方法覆盖重写"的负担，就是这么easy!

-------

### 1.5回顾匿名内部类

#### 使用实现类

```java
package com.indi.demo05.Thread;

public class Demo05Runnable {
    public static void main(String[] args) {
            RunnableImpl run =new RunnableImpl();
            Thread t =new Thread(run);
            t.start();
    }
}
class RunnableImpl implements Runnable {

    @Override
    public void run() {
            System.out.println("多线程任务执行！");
        }
    }
}
```

#### 使用匿名内部类

```java
package com.indi.demo05.Thread;

public class Demo06InnerClassThread {
    public static void main(String[] args) {
       //简化接口的方式
        new Thread(new Runnable(){
            @Override
            public void run() {
                System.out.println("多线程任务执行！");
            }
        }).start();
    }
}
```

#### 匿名内部类的好处与弊端

一方面，匿名内部类可以帮我们**省去实现类的定义**；另一方面，匿名内部类的语法**确实太复杂了**。

#### 语义分析

仔细分析代码中的语义，`Runnable`接口中只有一个`run`方法的定义：

* `public abstract void run();`

即制定了一种做事情的方案(其实就是一个函数)：

* **无参数**：不需要任何条件即可执行方案。
* **无返回值**：该方案不产生任何结果。
* **代码块**(方法体)：该方案的具体执行步骤。

同样的语义体现在`Lambda`语法中，要更加简单：

```java
()-> System.out.println("多线程任务执行！")
```

* 前面的一对小括号即`run`方法的参数(无)，代表不需要任何条件；
* 中间的一个箭头代表将前面的参数传递给后面的代码；
* 后面的输出语句即业务逻辑代码。

-----------

### 1.6Lambda标准格式

Lambda省去面向对象的条条框框，格式由**3个部分**组成：

* 一些参数
* 一个箭头
* 一段代码

Lambda表达式的**标准格式**为：

```java
(参数类型 参数名称)->{ 代码语句 }
```

解释说明格式:

* ()：接口中抽象方法的参数列表,没有参数,就空着;有参数就写出参数,多个参数使用逗号分隔
* ->：传递的意思,把参数传递给方法体{}
* {}：重写接口的抽象方法的方法体

-------

### 1.7练习：使用Lambda标准格式(无参无返回)

#### 题目

给定一个厨子`Cook`接口，内含唯一的抽象方法`makeFood`，且无参数、无返回值。如下︰

```java
public interface Cook {
    void makeFood();
}
```

在下面的代码中，请使用Lambda的标准格式调用`invokeCook`方法，打印输出“吃饭啦!"字样:

```java
public class Demo01InvokeCook {
   public static void main(String[] args){
// TODO请在此使用Lambda【标准格式】调用invokecook方法
}
    
  private static void invokeCook (Cook cook) {
       cook.makeFood(); 
    }
}
```

#### 解答

```java
package com.indi.demo14Case;

public interface Cook {
    void makeFood();
}
```

```java
package com.indi.demo14Case;

public class Demo01InvokeCook {
    public static void main(String[] args) {
        //之前的方法
//       invokeCook(new Cook() {
//           @Override
//           public void makeFood() {
//               System.out.println("吃饭啦！");
//           }
//       });
        //使用Lambda表达式
        invokeCook(()->{
            System.out.println("吃饭啦！");
        });
    }

    private static void invokeCook (Cook cook) {
        cook.makeFood();
    }
}
```

> tips：小括号代表`Cook` 接口`makeFood`方法的参数为空，大括号代表`makeFood`的方法体。

-----

### 1.8Lambda的参数和返回值

```java
需求：
    使用数组储存多个Person对象
    对数组中的Persion对象使用Arrays的sort方法通过年龄进行升序排序
```

下面举例演示`java.util.Comparator<T>`接口的使用场景代码，其中的抽象方法定义为：

* `public abstract int compare(T o1, T o2);`

当需要对一个对象数组进行排序时，`Arrays.sort`方法需要一个`Comparator`接口实例来指定排序的规则。假设有一个`Person`类，含有`String name`和`int age`两个成员变量：

```java
package com.indi.demo15Lambda;

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

#### 传统写法

```java
package com.indi.demo15Lambda;

import java.lang.reflect.Array;
import java.util.Arrays;
import java.util.Comparator;
import java.util.Iterator;

public class Demo01Array {
    public static void main(String[] args) {
        Person[] arr= {
                new Person("小明",19),
                new Person("小李",23),
                new Person("小林",18)
        };
        Arrays.sort(arr, new Comparator<Person>() {
            @Override
            public int compare(Person o1, Person o2) {
                return o1.getAge()-o2.getAge();
            }
        });
        for (Person p : arr) {
            System.out.println(p);
        }
    }
}
```

#### Lambda写法

```java
package com.indi.demo15Lambda;

import java.lang.reflect.Array;
import java.util.Arrays;
import java.util.Comparator;
import java.util.Iterator;

public class Demo01Array {
    public static void main(String[] args) {
        Person[] arr= {
                new Person("小明",19),
                new Person("小李",23),
                new Person("小林",18)
        };
        Arrays.sort(arr,(Person o1, Person o2)->{
            return o1.getAge()-o2.getAge();
        });
        for (Person p : arr) {
            System.out.println(p);
        }
    }
}
```

--------

### 1.9练习：使用Lambda标准格式(有参有返回)

#### 题目

给定一个计算器`Calculator`接口，内含抽象方法`calc`可以将两个int数字相加得到和值：

```java
package com.indi.demo15Lambda;

public interface Calculator {
    int calc(int a,int b);
}
```

在下面的代码中，请使用Lambda的**标准格式**调用`invokeCalc`方法，完成120和130的相加计算：

```java
package com.indi.demo15Lambda;

public class Demo02InvokeCalc {
    public static void main(String[] args) {
        //TODO请在此使用Lambda【标准格式】调用invokecalc方法来计算120+130的结果β
    }

    public static void invokeCalc(int a,int b,Calculator calculator){
        int result=calculator.calc(a, b);
        System.out.println("结果是："+result);
    }
}
```

#### 解答

```java
package com.indi.demo15Lambda;

public interface Calculator {
    int calc(int a,int b);
}
```

```java
package com.indi.demo15Lambda;

public class Demo02InvokeCalc {
    public static void main(String[] args) {
        //TODO请在此使用Lambda【标准格式】调用invokecalc方法来计算120+130的结果β
        //传统方式
//        invokeCalc(20, 30, new Calculator() {
//            @Override
//            public int calc(int a, int b) {
//                return a+b;
//            }
//        });
        //Lambda
        invokeCalc(120,130,(int a,int b)->{
            return a+b;
        });
    }

    public static void invokeCalc(int a,int b,Calculator calculator){
        int result=calculator.calc(a, b);
        System.out.println("结果是："+result);
    }
}
```

-----

### 1.10Lambda省略格式

#### 可推导即可省略

Lambda强调的是“做什么"而不是“怎么做”，所以凡是可以根据上下文推导得知的信息，都可以省略。例如上例还可以使用Lambda的省略写法∶

```java
public static void main(String[] args){
   invokecalc(120，130，(a, b) ->a+ b);
}
```

#### 省略规则

在Lambda标准格式的基础上，使用省略写法的规则为:

* 小括号内参数的类型可以省略;
* 如果小括号内有且仅有一个参，则小括号可以省略;
* 如果大括号内有且仅有一个语句，则无论是否有返回值，都可以省略大括号、return关键字及语句分号。

> 备注:掌握这些省略规则后，请对应地回顾本章开头的多线程案例。

-----

### 1.11练习：使用Lambda省略格式

#### 题目

```java
package com.indi.demo15Lambda;

public interface Calculator {
    int calc(int a,int b);
}
```

```java
package com.indi.demo15Lambda;

public class Demo02InvokeCalc {
    public static void main(String[] args) {
        invokeCalc(120,130,(int a,int b)->{
            return a+b;
        });
    }

    public static void invokeCalc(int a,int b,Calculator calculator){
        int result=calculator.calc(a, b);
        System.out.println("结果是："+result);
    }
}
```

#### 解答

```java
package com.indi.demo15Lambda;

public interface Calculator {
    int calc(int a,int b);
}
```

```java
package com.indi.demo15Lambda;

public class Demo02InvokeCalc {
    public static void main(String[] args) {
        invokeCalc(120,130,(a,b)->a+b);
    }

    public static void invokeCalc(int a,int b,Calculator calculator){
        int result=calculator.calc(a, b);
        System.out.println("结果是："+result);
    }
}
```

--------

### 1.12Lambda的使用前提

Lambda的语法非常简洁，完全没有面向对象复杂的束缚。但是使用时有几个问题需要特别注意:

1.使用Lambda必须具有接口，且要求**接口中有且仅有一个抽象方法**。
无论是JDK内置的`Runnable` 、`comparator` 接口还是自定义的接口，只有当接口中的抽象方法存在且唯一时，才可以使用Lambda。

2.使用Lambda必须具有**上下文推断**。
也就是方法的参数或局部变星类型必须为Lambda对应的接口类型，才能使用Lambda作为该接口的实例。

> 备注:有且仅有一个抽象方法的接口，称为“函数式接口”。https://tonkyshan.cn/img/
