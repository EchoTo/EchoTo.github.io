---
title: 'File类,递归'
date: 2022-01-11 13:32:13
tags: [File类,递归]
categories: java
---

## File类、递归

-------

## 第一章	File类

-----

### 1.1概述

`java.io.File`类时文件和目录路径名的抽象表示，主要用于文件和目录的创建、查找和删除等操作。

java把电脑中的文件和文件夹(目录)封装为了一个FiLe类,我们可以使用FiLe类对文件和文件夹进行操作

我们可以使用File类的方法

*  创建一个文件/文件夹
*  删除文件/文件夹
*  获取文件/文件夹
*  判断文件/文件夹是否存在
*  对文件夹进行遍历
*  获取文件的大小

File类是一个与系统无关的类,任何的操作系统都可以使用这个类中的方法

重点:记住这三个单词

*  file:文件
*  directory :文件夹/目录
*  path :路径

#### File类的静态成员变量

```java
package com.priv.demo01.File;

import java.io.File;

public class Demo01File {
    public static void main(String[] args) {
        String pathSeparator = File.pathSeparator;
        System.out.println(pathSeparator);//路径分隔符 windows;分号   Linux:冒号

        String separator = File.separator;
        System.out.println(separator);//  \文件名称分隔符   windows\反斜杠  Linux/正斜杠

//        操作路径:路径不能写死了
//        C: \develop\a\a.txt    windows
//        C: /develop/a/a.txt    Linux
//        "C:"+File.separator+"develop"+File.separator+"a"+File.separator+"a.txt"

    }
}
```

-----------

### 1.2构造方法

* `public File(String pathname)`：通过将给定的**路径名字符串**转换为抽象路径名来创建新的File实例。
* `public File(String parent,String child)`：从**父路径名字符串和子路径名字符串**创建新的File实例。
* `public File(File parent,String child)`：从**父抽象路径名和子路径名字符串**创建新的File实例。

```java
package com.priv.demo01File;

import java.io.File;

public class Demo02File {
    public static void main(String[] args) {
//        show01();
//        show02("c:\\","a.txt");//c:\a.txt
          show03();//c:\Hello.java
    }
    //`public File(File parent,String child)`：从**父抽象路径名和子路径名字符串**创建新的File实例。
//    好处：父路径和子路径,可以单独书写,使用起来非常灵活;
//    父路径和子路径都可以变化父路径是File类型,可以使用File的方法对路径进行―些操作,再使用路径创建对象

    private static void show03() {
        File parent=new File("c:\\");
        File f3 =new File(parent,"Hello.java");
        System.out.println(f3);
    }

    //`public File(String parent,String child)`：从**父路径名字符串和子路径名字符串**创建新的File实例。
    // 好处：父路径和子路径,可以单独书写,使用起来非常灵活;
    private static void show02(String parent,String child) {
        File f2 =new File(parent,child);
        System.out.println(f2);
    }


    //`public File(String pathname)`：通过将给定的**路径名字符串**转换为抽象路径名来创建新的File实例。
    private static void show01() {
        File f1=new File("C:\\Users\\97189\\IdeaProjects\\Demo\\a.txt");
        System.out.println(f1);

        File f2=new File("C:\\Users\\97189\\IdeaProjects\\Demo");
        System.out.println(f2);

        File f3=new File("b.txt");
        System.out.println(f3);
    }

}
```

---------

### 1.3常用方法

#### 获取功能的方法

* `public String getAbsolutePath()`：返回此File的**绝对路径**名字符串。
* `public String getPath()`：将此File转换为路径名字符串。

​        tostring方法调用的就是getPath方法

源码:

```java
       public string tostring(){
           return getPath();
       }
```

* `public String getName()`：返回由此File表示的文件或目录的名称。
* `public long length()`：返回由此File表示的文件的长度。

​     获取的是构造方法指定的文件的大小,以字节为单位

> 注意:
> 文件夹是没有大小概念的,不能获取文件夹的大小
> 如果构造方法中给出的路径不存在,那么Length方法返回0

```java
package com.priv.demo01File;

import java.io.File;

public class Demo03FileGet {
    public static void main(String[] args) {
        File f1 =new File("d:/aaa/bbb.java");
        System.out.println("文件绝对路径"+f1.getAbsolutePath());
        System.out.println("文件构造路径"+f1.getPath());
        System.out.println("文件名称"+f1.getName());
        System.out.println("文件长度"+f1.length()+"字节");
        System.out.println("-------------------------------------");

        File f2 =new File("d:/aaa");
        System.out.println("目录绝对路径"+f2.getAbsolutePath());
        System.out.println("目录构造路径"+f2.getPath());
        System.out.println("目录名称"+f2.getName());
        System.out.println("目录长度"+f2.length());

//   输出结果：
//        文件绝对路径d:\aaa\bbb.java
//        文件构造路径d:\aaa\bbb.java
//        文件名称bbb.java
//        文件长度0字节
//        -------------------------------------
//        目录绝对路径d:\aaa
//        目录构造路径d:\aaa
//        目录名称aaa
//        目录长度0
    }
}
```

#### 绝对路径和相对路径

绝对路径：是一个完整的路径(以盘符开头)

相对路径：是一个简化的路径

如果使用当前项目的根目录，路径可以简化书写(可以省略项目的根目录)

> tips：1.路径是不区分大小写的
>
> ​         2.路径中的文件名称分隔符windows使用反斜杠，反斜杠是转义字符，两个反斜杠代表一个普通的反斜杠。

#### 判断功能的方法

* `public boolean exists() `：此File表示的文件或目录是否真实存在。
* `public boolean isDirectory()`：此File表示的是否为目录。
* `public boolean isFile()`：此File表示的是否为文件。

```java
package com.priv.demo01File;

import java.io.File;

public class Demo04FileIs {
    public static void main(String[] args) {
        File f1 =new File("C:\\Users\\97189\\IdeaProjects\\Demo\\a.txt");
        File f2 =new File("C:\\Users\\97189\\IdeaProjects\\Demo");
        //判断是否存在
        System.out.println("C:\\Users\\97189\\IdeaProjects\\Demo\\a.txt是否存在："+f1.exists());
        System.out.println("C:\\Users\\97189\\IdeaProjects\\Demo是否存在："+f2.exists());
        //判断是文件还是目录
        System.out.println("C:\\Users\\97189\\IdeaProjects\\Demo\\a.txt文件？："+f1.isFile());
        System.out.println("C:\\Users\\97189\\IdeaProjects\\Demo\\a.txt目录？："+f1.isDirectory());
        System.out.println("C:\\Users\\97189\\IdeaProjects\\Demo文件？："+f2.isFile());
        System.out.println("C:\\Users\\97189\\IdeaProjects\\Demo目录？："+f2.isDirectory());
        //输出结果：
//        C:\Users\97189\IdeaProjects\Demo是否存在：true
//        C:\Users\97189\IdeaProjects\Demo\a.txt文件？：false
//        C:\Users\97189\IdeaProjects\Demo\a.txt目录？：false
//        C:\Users\97189\IdeaProjects\Demo文件？：false
//        C:\Users\97189\IdeaProjects\Demo目录？：true
    }
}
```

#### 创建删除功能的方法

* `public boolean createNewFile()`：当且仅当具有该名称的文件尚不存在时，创建一个新的空文件。

> 注意:
>
> * 此方法只能创建文件,不能创建文件夹
> * 创建文件的路径必须存在,否则会抛出异常

* `public boolean delete() `：删除由此File表示的文件或目录。(都可以删除)

> 返回值:布尔值
> true:文件/文件夹删除成功,返回true
> false:文件夹中有内容,不会删除返回false;构造方法中路径不存在false
>
> 注意:
> delete方法是直接在硬盘删除文件/文件夹,不走回收站,删除要谨慎。

* `public boolean mkdir() `：创建由此File表示的目录。(**只能创建单级空文件夹**)

* `public boolean mkdirs() `：创建由此File表示的目录，包括任何必需但不存在的父目录。(**能创建单级空文件夹，也能创建多级空文件夹**)

```java
package com.priv.demo01File;

import java.io.File;
import java.io.IOException;

public class Demo05File {
    public static void main(String[] args) throws IOException {
//        show01();
//        show02();
        show03();

    }

    private static void show03() {
        File f6 =new File("C:\\Users\\97189\\Desktop\\s\\111\\222\\333\\444");
        System.out.println(f6.delete());
    }

    private static void show02() {
        File f3 =new File("C:\\Users\\97189\\Desktop\\s\\aaa");
        System.out.println("aaa："+f3.mkdir());//true

        File f4 =new File("C:\\Users\\97189\\Desktop\\s\\111\\222\\333\\444");
        System.out.println(f4.mkdir());//false mkdir()方法不能创建多级空文件夹，但是可以调用mkdirs()方法创建

        File f5 =new File("C:\\Users\\97189\\Desktop\\s\\111\\222\\333\\444");
        System.out.println(f5.mkdirs());
    }

    private static void show01() throws IOException {
        File f1 =new File("C:\\Users\\97189\\Desktop\\s\\1.txt");
        boolean newFile = f1.createNewFile();
        System.out.println("newFile"+newFile);

        File f2 =new File("C:\\Users\\97189\\Des\\s\\1.txt");
        System.out.println(f2.createNewFile());//会抛出IOException异常
    }
}
```

-------

### 1.4目录的遍历

* `punlic String[] list()`：返回一个String数组，表示该File目录中的所有子文件或目录。
* `public File[] listFiles()`：返回一个File数组，表示该File目录中的所有子文件或目录。

```java
package com.priv.demo01File;

import java.io.File;

public class Demo06FileFor {
    public static void main(String[] args) {
        File f1 =new File("C:\\Users\\97189\\Desktop\\s");

        String[] names =f1.list();
        for (String name:names) {
            System.out.println(name);//.idea
        }

        File[] files = f1.listFiles();
        for (File files1:files) {
            System.out.println(files1);//C:\Users\97189\Desktop\s\.idea
        }
    }
}
```

> tips：调用listFiles方法的File对象，表示的必须时实际存在的目录，否则返回null，无法进行遍历。
> list方法和ListFiles方法遍历的是构造方法中给出的目录如果构造方法中给出的自录的路径不存在,会抛出空指针异常。如果构造方法中给出的路径不是一个自录,也会抛出空指针异常

----------------------

## 第二章	递归

-----------

### 2.1概述

* **递归**：指在当前方法内调用自己的这种现象。
* **递归的分类**：

1.递归分为两种，直接递归和间接递归。

2.直接递归称为方法自身调用自己。

3.间接递归可以A方法调用B方法，B方法调用C方法，C方法调用A方法。

* **注意事项**：

1.递归一定要有条件限定，保证递归能够停止下来，否则会发生栈内存溢出。

2.在递归中虽然有限定条件，但是递归次数不能太多，否则也会发生栈内存溢出。

3.构造方法，禁止递归。

```java
package com.priv.demo02Recursion;

public class Demo01Recursion {
    public static void main(String[] args) {
//        a();
        b(1);
    }

    private static void b(int i) {
        System.out.println(i);//11416
        if (i==20000){
            return;//Exception in thread "main" java.lang.StackOverflowError
        }
        b(++i);
    }

    private static void a() {
        System.out.println("a方法！");
        a();
    }
}
```

--------

### 2.2递归累加求和

#### 计算1~n的和

**分析**：num的累和=num+(num-1)的累和，所以可以把累和的操作定义成一个方法，递归调用。

#### **代码实现**：

```java
package com.priv.demo02Recursion;

import sun.security.provider.Sun;

public class Demo02Recursion {
    public static void main(String[] args) {
        int sum = sum(3);
        System.out.println(sum);
    }

    private static int sum(int n) {
        if(n==1){
            return 1;
        }
        return n+sum(n-1);
    }
}
```

如果仅仅是计算1-n之间的和，不推荐使用递归，使用for循环即可。

#### 代码执行图解

![QQ截图20210814201633](https://jsdelivr.sianx.com/npm/blog-clouding/img/202202281743169.png)

> tips：递归一定要有条件限定，保证递归能够停止下来，次数不要太多，否则会发生栈内存溢出。

-----

### 2.3递归求阶乘

* **阶乘**：n！= n * (n-1) * ... * 3 * 2 * 1 

**分析**：n！= n * (n-1)！

**代码实现**：

```java
package com.priv.demo02Recursion;

public class Demo03Factorial {
    public static void main(String[] args) {
        int value =getValue(4);
        System.out.println("value="+value);
    }

    private static int getValue(int n) {
        if (n==1){
            return 1;
        }
        return n*getValue(n-1);
    }
}
```

----------

### 2.4递归打印多级目录

```java
package com.priv.demo02Recursion;

import java.io.File;

public class Demo04Recursion {
    public static void main(String[] args) {
         getAllFile(new File("C:\\Users\\97189\\Desktop\\s"));
    }

    private static void getAllFile(File dir) {
        File[] files = dir.listFiles();
        for (File files1:files) {
            if (files1.isDirectory()){
                getAllFile(files1);
            }else
            System.out.println(files1);
        }
    }
}
```

> tips：如果在增强for中直接打印filse1，则不能打印出文件夹里面的文件，所以要加一个判断语句if。

-----------

## 第三章	综合案例

--------

### 3.1文件搜索

搜索`C:\Users\97189\Desktop\s`目录中的`.png`文件。

* **分析**：

1.目录搜索，无法判断多少级目录，所以使用递归，遍历所有目录。

2.遍历目录时，获取的子文件，通过文件名称，判断是否符合条件。

```java
package com.priv.demo02Recursion;

import javax.sound.midi.Soundbank;
import java.io.File;

public class Demo05Case {
    public static void main(String[] args) {
        File file = new File("C:\\Users\\97189\\Desktop\\s");
        getAllFile(file);
    }

    private static void getAllFile(File dir) {
        File[] files = dir.listFiles();
        for (File f:files) {
            if (f.isDirectory()){
                getAllFile(f);
            }else {
                if (f.getName().toLowerCase().endsWith(".png")){
                    System.out.println(f);
                }
            }
        }
    }
}
```

--------

### 3.2文件过滤器优化

在FiLe类中有两个和ListFiles重载的方法,方法的参数传递的就是过滤器。

**1.File[ ] listFiLes (FileFilter filter)**
`java.io.FileFilter`接口:用于抽象路径名(FiLe对象)的过滤器。

作用:用来过滤文件(FiLe对象)

抽象方法:用来过滤文件的方法

* boolean accept(File pathname）测试指定抽象路径名是否应该包含在某个路径名列表中。

参数:
   File pathname :使用ListFiLes方法遍历目录,得到的每一个文件对象

**代码实现：**

```java
package com.priv.demo03Filter;

import java.io.File;
import java.io.FileFilter;

public class FileFilterImpl implements FileFilter {

    @Override
    public boolean accept(File pathname) {
        if(pathname.isDirectory()){
            return true;
        }
        return pathname.getName().toLowerCase().endsWith(".png");
    }
}
```

```java
package com.priv.demo03Filter;

import java.io.File;

public class Demo01Filter {
       public static void main(String[] args) {
    getAllFile(new File("C:\\Users\\97189\\Desktop\\s"));
}

    private static void getAllFile(File dir) {
        File[] files = dir.listFiles(new FileFilterImpl());//传递过滤器对象
//        listFiles方法一共做了3件事情:
//        1.listFiles方法会对构造方法中传递的目录进行遍历,获取目录中的每一个文件/文件夹-->封装为File对象
//        2.listFiles方法会调用参数传递的过滤器中的方法accept
//        3.listFiles方法会把遍历得到的每一个File对象,传递给accept方法的参数pathname

        for (File files1:files) {
            if (files1.isDirectory()){
                getAllFile(files1);
            }else
                System.out.println(files1);
        }
    }
}
```

优化：**使用匿名内部类**

```java
package com.priv.demo03Filter;

import java.io.File;
import java.io.FileFilter;

public class Demo01Filter {
       public static void main(String[] args) {
    getAllFile(new File("C:\\Users\\97189\\Desktop\\s"));
}

    private static void getAllFile(File dir) {
        //优化：使用匿名内部类
        File[] files = dir.listFiles(new FileFilter() {
            @Override
            public boolean accept(File pathname) {
                return pathname.isDirectory()||pathname.getName().endsWith(".png");
            }
        });
        for (File files1:files) {
            if (files1.isDirectory()){
                getAllFile(files1);
            }else
                System.out.println(files1);
        }
    }
}
```

**2.FiLe[ ] listFiles(FiLenameFilter filter)**

`java.io.FilenameFilter`接口:实现此接口的类实例可用于过滤器文件名。

作用:用于过滤文件名称

抽象方法:用来过滤文件的方法

* boolean accept(File dir，String name）测试指定文件是否应该包含在某一文件列表中。

参数︰
File dir:构造方法中传递的被遍历的目录
String name :使用ListFiles方法遍历自录,获取的每一个文件/文件夹的名称

> 注意:
> 两个过滤器接口是没有实现类的,需要我们自己写实现类,重写过滤的方法accept,在方法中自己定义过滤的规则

```java
package com.priv.demo03Filter;

import java.io.File;
import java.io.FileFilter;
import java.io.FilenameFilter;

public class Demo02FilenameFilter {
    public static void main(String[] args) {
        getAllFile(new File("C:\\Users\\97189\\Desktop\\s"));
    }

    private static void getAllFile(File dir) {
        //优化：使用匿名内部类
        File[] files = dir.listFiles(new FilenameFilter() {
            @Override
            public boolean accept(File dir, String name) {
                return new File(dir,name).isDirectory()||name.toLowerCase().endsWith(".png");
            }
        });
        for (File files1:files) {
            if (files1.isDirectory()){
                getAllFile(files1);
            }else
                System.out.println(files1);
        }
    }
}
```

**分析**：

1.接口作为参数，需要传递子类对象，重写其中方法。我们选择匿名内部类方式，比较简单。

2.`accept`方法，参数为File，表示当前File下所有的子文件和子目录。保留住则返回true，过滤掉则返回false。

​        保留规则：

​           1.要么是.java文件。

​           2.要么是目录，用于继续遍历。


--------

### 3.3Lambda优化

**1.File[ ] listFiLes (FileFilter filter)**

```java
package com.priv.demo03Filter;

import java.io.File;
import java.io.FileFilter;

public class Demo04Filter {
    public static void main(String[] args) {
        getAllFile(new File("C:\\Users\\97189\\Desktop\\s"));
    }

    private static void getAllFile(File dir) {
        //优化：使用匿名内部类
        File[] files = dir.listFiles(pathname->pathname.isDirectory()||pathname.getName().toLowerCase().endsWith(".png"));
        for (File files1:files) {
            if (files1.isDirectory()){
                getAllFile(files1);
            }else
                System.out.println(files1);
        }
    }
}
```

**2.FiLe[ ] listFiles(FiLenameFilter filter)**

```java
package com.priv.demo03Filter;

import java.io.File;
import java.io.FilenameFilter;

public class Demo03FilenameFilter {
    public static void main(String[] args) {
        getAllFile(new File("C:\\Users\\97189\\Desktop\\s"));
    }

    private static void getAllFile(File dir) {
        //优化：使用Lambda表达式(接口中只有一个方法)
        File[] files = dir.listFiles((dir1, name) -> new File(dir1,name).isDirectory()||name.toLowerCase().endsWith(".png"));
        for (File files1:files) {
            if (files1.isDirectory()){
                getAllFile(files1);
            }else
                System.out.println(files1);
        }
    }
}
```
