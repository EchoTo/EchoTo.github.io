---
title: IO流(一)
date: 2022-01-13 8:15:27
tags: [IO流]
categories: java
---

## IO流

--------

## 第一章	IO概述

----------

### 1.1什么是IO

生活中，你肯定经历过这样的场景。当你编辑一个文本文件，忘记了`ctrl+s`，可能文件就白白编辑了。当你电脑上插入一个U盘，可以把一个视频，拷贝到你的电脑硬盘里。那么数据都是在哪些设备上的呢?键盘、内存、硬盘、外接设备等等。

我们把这种数据的传输，可以看做是一种数据的流动，按照流动的方向，以内存为基准，分为``输入input``和``输出output``，即流向内存是输入流，流出内存的输出流。

Java中I/O操作主要是指使用``java.io``包下的内容，进行输入、输出操作。**输入**也叫做**读取**数据，**输出**也叫做作**写出**数据。

------

### 1.2IO的分类

根据数据的流向分为：**输入流**和**输出流**。

* **输入流**：把数据从`其他设备`上读取到`内存`中的流。
* **输出流**：把数据从`内存`中写出到`其他设备`上的流。

根据数据的类型分为：**字节流**和**字符流**。

* **字节流**：以字节为单位，读写数据的流。
* **字符流**：以字符为单位，读写数据的流。

------

### 1.3IO的流向说明图解

![20210815215009](https://tonkyshan.cn/img/202202281835742.png)

--------

### 1.4顶级父类们

![20210815215021](https://tonkyshan.cn/img/202202281835224.png)

--------

## 第二章	字节流

--------

### 2.1一切皆为字节

一切文件数据(文本、图片、视频等)在存储时，都是以二进制数字的形式保存，都一个一个的字节，那么传输时一样如此。所以，字节流可以传输任意文件数据。在操作流的时候，我们要时刻明确，无论使用什么样的流对象，底层传输的始终为二进制数据。

-----

### 2.2字节输出流【OutputStream】

`java.io.OutputStream`抽象类是表示字节输出流的所有类型的超类，将指定的字节信息写出到目的地。它定义了字节输出流的基本共性功能方法。

* `public void close()`：关闭此输出流并释放与此流相关联的任何系统资源。
* `public void flush()`：刷新此输出流并强制任何缓冲的输出字节被写出。
* `public void write(byte[] b)`：将b.length字节从指定的字节数组写入此输出流。

> 一次写多个字节:
> 1.如果写的第一个字节是正数(0-127),那么显示的时候会查询ASCII表
> 2.如果写的第一个字节是负数,那第一个字节会和第二个字节,两个字节组成一个中文显示,查询系统默认码表(GBK)

* `public void write(byte[] b,int off,int len)`：从指定的字节数组写入len字节，从偏移量off开始输出到此输入流。

> int off：数组的开始索引
>
> int len：写几个字节

* `public abstract void write(int b)`：将指定的字节输出流。

> tips：close方法，当完成流的操作时，必须调用此方法，释放系统资源。

------------

### 2.3FileOutputStream类

java.io.FileOutputStream extends OutputStream

FileOutputStream：文件字节输出流

**作用：**把内存中的数据写入到硬盘的文件中

**字节输出流的使用步骤(重点)∶**

* 创建一个Fileoutputstream对象,构造方法中传递写入数据的目的地
* 调用Fileoutputstream对象中的方法write,把数据写入到文件中
* 释放资源(流使用会占用一定的内存,使用完毕要把内存清空,提供程序的效率)

#### 构造方法

* FileOutputStream(String name)：创建一个向具有指定名称的文件中写入数据的输出文件流。

* FileOutputStream(File file)：创建一个向指定File对象表示的文件中写入数据的文件输出流。

参数：写入数据的目的地

* String name：目的地是一个文件的路径
* File file：目的地是一个文件

构造方法的作用：

* 创建一个FileOutputStream对象
* 会根据构造方法中传递的文件/文件路径，创建一个空的文件
* 会把FileOutputStream对象指向创建好的文件

#### 写出字节数据

写入数据的原理(内存--->硬盘)

  java程序-->JVM(java虚拟机)-->OS(操作系统)-->OS调用写数据的方法-->把数据写入到文件中

```java
package com.priv.demo01OutputStream;

import java.io.FileNotFoundException;
import java.io.FileOutputStream;
import java.io.IOException;
import java.util.Arrays;

public class Demo01OutputStream {
    public static void main(String[] args) throws IOException {
        FileOutputStream fos =new FileOutputStream("C:\\Users\\97189\\Desktop\\s\\1.txt");
        //`public abstract void write(int b)`：将指定的字节输出流。
        fos.write(97);//ASCII码 a

        //`public void write(byte[] b)`：将b.length字节从指定的字节数组写入此输出流。
        byte[] bytes={65,66,67,68,69};
        fos.write(bytes);//ABCDE
        byte[] bytes1={-65,-66,-67,68,69};
        fos.write(bytes1);//烤紻E

        //`public void write(byte[] b,int off,int len)`：从指定的字节数组写入len字节，从偏移量off开始输出到此输入流。
        fos.write(bytes,1,2);//BC

        //写入字符的方法:可以使用string类中的方法把字符串,转换为字节数组
        //byte[] getBytes()把字符串转换为字节数组
        byte[] bytes2="你好".getBytes();
        System.out.println(Arrays.toString(bytes2));//[-28, -67, -96, -27, -91, -67]
        fos.write(bytes2);//你好

        //释放资源
        fos.close();
    }
}
```

#### 数据追加续写

追加写/续写：使用两个参数的构造方法。

* `public FileOutputStream(File file,boolean append)`：创建文件输出流以写入由指定的File对象表示的文件。
* `public FileOutputStream(String name,boolean append)`：创建文件输出流以指定的名称写入文件。

**参数：**

* Stream name,File file：写入数据的目的地

* boolean append：追加写开关

true：创建对象不会覆盖源文件，继续在文件的末尾追加写数据。

false：创建一个新文件，覆盖源文件

```java
package com.priv.demo01OutputStream;

import java.io.FileNotFoundException;
import java.io.FileOutputStream;
import java.io.IOException;

public class Demo02OutputStream {
    public static void main(String[] args) throws IOException {
        FileOutputStream fos =new FileOutputStream("C:\\Users\\97189\\Desktop\\s\\1.txt",true);
        fos.write("你好".getBytes());
        fos.close();
    }
}
```

程序运行多少次，就会有多少个你好，不会覆盖掉源文件。

#### 写出换行

写换行：写换行符号

* windows：\r\n
* linux：/n
* mac：/r

```java
package com.priv.demo01OutputStream;

import java.io.FileNotFoundException;
import java.io.FileOutputStream;
import java.io.IOException;

public class Demo03OutputStream {
    public static void main(String[] args) throws IOException {
        FileOutputStream fos =new FileOutputStream("C:\\Users\\97189\\Desktop\\s\\1.txt",true);
        for (int i = 0; i < 10; i++) {
            fos.write("你好".getBytes());
            fos.write("\r\n".getBytes());
        }
        fos.close();
    }
}
```

------------

### 2.4字节输入流【InputStream】

`java.io.InputStream`抽象类是表示字节输入流的所有类的超类，可以读取字节信息到内存中。它定义了字节输入流的基本共性功能方法。

* `public void close()`：关闭此输入流并释放与此流相关联的任何系统资源。
* `public abstract int read()`：从输入流读取数据的下一个字节。
* `public int read(byte[] b)`：从输入流中读取一些字节数，并将它们存储到字节数组b中。

> tips：close方法，当完成流的操作时，必须调用此方法，释放系统资源。

---------

### 2.5FileInputStream类

`java.io.FileInputStream`类是文件输入流，从文件中读取字节。

**作用：**把硬盘文件中的数据，读取到内存中使用

#### 构造方法

* `FileInputStream(File file)`：通过打开与实际文件的连接来创建一个FileInputStream，该文件由文件系统中的File对象file命名。
* `FileInputStream(String name)`：通过打开与实际文件的连接来创建一个FileInputStream，该文件由文件系统中的路径名name命名。

参数：读取文件的数据源

* String name：文件的路径
* File file：文件

构造方法的作用：

* 会创建一个FileInputStream对象
* 会把FileInputStream对象指向构造方法中要读取的文件

#### 读取字节数据

**1.读取字节**

`read`方法，每此可以读取一个字节的数据，提升为int类型，读取到文件末尾，返回`-1`，代码使用演示：

读取数据的原理(硬盘-->内存)

   java程序-->JVM-->OS-->OS读取数据的方法-->读取文件

字节输入流的使用步骤(重点)∶

* 创建FileInputstream对象,构造方法中绑定要读取的数据
* 使用FileInputStream对象中的方法read,读取文件
* 释放资源

![20210816183222](https://tonkyshan.cn/img/202202281835374.png)

1.`public abstract int read()`：从输入流读取数据的下一个字节。

```java
package com.priv.demo02InputStream;

import java.io.FileInputStream;
import java.io.FileNotFoundException;
import java.io.IOException;

public class Demo01InputStream {
    public static void main(String[] args) throws IOException {
        FileInputStream fis =new FileInputStream("C:\\Users\\97189\\Desktop\\s\\3.txt");
        //一个字节一个字节的读，读到最后返回-1
//        int len = fis.read();
//        System.out.println(len);//97
//
//        len = fis.read();
//        System.out.println(len);//98
//
//        len = fis.read();
//        System.out.println(len);//99
//
//        len = fis.read();
//        System.out.println(len);//-1
        //使用while循环优化
        int len=0;
        while ((len=fis.read())!=-1){
            System.out.println((char) len);//abc
        }

        fis.close();
    }

}
```

2.`public int read(byte[] b)`：从输入流中读取一些字节数，并将它们存储到字节数组b中。

输出时需要调用：

String类的构造方法：

* String(byte[ ] bytes)：把字节数组转换为字符串
* String(byte[ ] bytes，int offset, int length）：把字节数组的一部分转换为字符串 
* offset :数组的开始索引
* Length:转换的字节个数

**数组：缓存作用，存储读取到的多个字节**

数组的长度一般定义为1024(1kb)或者1024的整数倍

**方法的返回值int**是每次读取的有效字节个数

```java
package com.priv.demo02InputStream;

import java.io.FileInputStream;
import java.io.FileNotFoundException;
import java.io.IOException;

public class Demo02InputStream {
    public static void main(String[] args) throws IOException {
        FileInputStream fis =new FileInputStream("C:\\Users\\97189\\Desktop\\s\\3.txt");
        //1.String(byte[ ] bytes)：把字节数组转换为字符串
//        byte[] bytes =new byte[2];
//        int len=fis.read(bytes);
//        System.out.println(len);//2
//        System.out.println(new String(bytes));//ab
//
//        len=fis.read(bytes);
//        System.out.println(len);//1
//        System.out.println(new String(bytes));//cb
//
//        len=fis.read(bytes);
//        System.out.println(len);//-1
//        System.out.println(new String(bytes));//cb

        //使用while循环优化
        //2.String(byte[ ] bytes，int offset, int length）：把字节数组的一部分转换为字符串 
        byte[] bytes =new byte[1024];
        int len=0;
        while ((len=fis.read(bytes))!=-1){
            System.out.println(new String(bytes,0,len));//abc
        }
    }
}
```

----------

### 2.6字节流练习：图片复制

#### 复制原理图解

**原理：**从已有文件中读取字节，将该字节写出到另一个文件中。

![20210816192552](https://tonkyshan.cn/img/202202281835379.png)

#### 案例实现

```java
package com.priv.demo03FileCopy;

import java.io.FileInputStream;
import java.io.FileNotFoundException;
import java.io.FileOutputStream;
import java.io.IOException;

public class Demo01FileCopy {
    public static void main(String[] args) throws IOException {
        long s=System.currentTimeMillis();
        FileInputStream fis =new FileInputStream("C:\\1.png");
        FileOutputStream fos =new FileOutputStream("D:\\1.png");
        int len=0;
        byte[] bytes =new byte[1024];
        while ((len=fis.read(bytes))!=-1){
            fos.write(bytes,0,len);
        }
        //先关写的
        fos.close();
        fis.close();
        long e =System.currentTimeMillis();
        System.out.println("共耗时："+(e-s)+"毫秒");
    }
}
```

---

## 第三章	字符流

----------

当使用字节流读取文本文件时，可能会有一个小问题。就是遇到中文字符时，可能不会显示完整的字符，那是因为一个中文字符可能占用多个字节存储。所以Java提供一些字符流类，以字符为单位读写数据，专门用于处理文本文件。

```java
package com.priv.demo04Reader;
//使用字节流读取中文文件
//1个中文
//GBK:占用两个字节
//UTF-8:占用3个字节
import java.io.FileInputStream;
import java.io.FileNotFoundException;
import java.io.IOException;

public class Demo01InputStream {
    public static void main(String[] args) throws IOException {
        FileInputStream fis =new FileInputStream("C:\\Users\\97189\\Desktop\\s\\1.txt");
        int len=0;
//        while ((len=fis.read())!=-1){
//            System.out.println(len);
//        }
        while ((len=fis.read())!=-1){
            System.out.println((char) len);//读取中文会出现乱码问题
            //ä
            //½
            // 
            //å
            //¥
            //½
        }
        fis.close();
    }
}
//输出结果：
//228
//189
//160  组成 你

//229
//165
//189  组成 好
```

### 3.1字符输入流【Reader】

`java.io.Reader`抽象类是表示用于读取字符流的所有类的超类，可以读取字符信息到内存中。它定义了字符输入流的基本共性功能方法。

* `public void close()`：关闭此流并释放与此流相关联的任何系统资源。
* `public int read()`：从输入流读取一个字符。
* `public int read(char[] cbuf)`：从输入流中读取一些字符，并将它们存储到字符数组cbuf中。

-----

### 3.2FileReader类

`java.io.FileReader`类是读取字符文件的便利类。构造时使用系统默认的字符编码和默认字节缓冲区。

#### 构造方法

* FileReader(String fileName)
* FileReader(File file)

参数：读取文件的数据源

* String fileName：文件的路径
* File file：一个文件

FileReader构造方法的**作用**：

* 创建一个FileReader对象
* 会把FileReader对象指向要读取的文件

```java
package com.priv.demo04Reader;

import java.io.File;
import java.io.FileNotFoundException;
import java.io.FileReader;

public class Demo03FileReaderConstructor {
    public static void main(String[] args) throws FileNotFoundException {
        //使用File对象创建流对象
        File file =new File("a.txt");
        FileReader fileReader =new FileReader(file);
        
        //使用文件名称创建流对象
        FileReader fileReader1 =new FileReader("b.txt");
    }
}
```

#### 读取字符数据

1.**读取字符**：`read`方法，每次可以读取一个字符的数据，提升为int类型，读取到文件末尾，返回`-1`，循环读取。

**字符输入流的使用步骤:**

* 创建FiLeReader对象,构造方法中绑定要读取的数据源
* 使用FileReader对象中的方法read读取文件
* 释放资源

输出时需要调用：

**String类的构造方法**

* String ( char[ ] value)把字符数组转换为字符串
* String(char[ ] value，int offset,int count）把字符数组的一部分转换为字符串offset数组的开始索引count转换的个数

```java
package com.priv.demo04Reader;

import java.io.FileReader;
import java.io.IOException;

public class Demo02Reader {
    public static void main(String[] args) throws IOException {
        long s=System.currentTimeMillis();
        FileReader fileReader=new FileReader("C:\\Users\\97189\\Desktop\\s\\1.txt");
        int len=0;
//        `public int read()`：从输入流读取一个字符。
//        while ((len=fileReader.read())!=-1){
//            System.out.print((char)len);
//            //你好
//        }
        //`public int read(char[] cbuf)`：从输入流中读取一些字符，并将它们存储到字符数组cbuf中。
        char[] cs =new char[1024];
        while ((len=fileReader.read(cs))!=-1){
            System.out.print(new String(cs,0,len));
            //你好
        }
        long e=System.currentTimeMillis();
        System.out.println("所用时间为："+(e-s)+"毫秒");
    }
}
```

-----------

### 3.3字符输出流【Writer】

`java.io.Writer`抽象类是表示用于写出字符流的所有类的超类，将指定的字符信息写出到目的地。它定义了字节输出流的基本共性功能方法。

* `void writer(int c)`：写入单个字符。
* `void writer(char[] cbuf)`：写入字符数组。
* `abstract void writer(char[] cbuf,int off,int len)`：写入字符数组的某一部分，off是数组的开始索引，len是写的字符个数。
* `void writer(String str)`：写入字符串。
* `void writer(String str，int off,int len)`：写入字符串的某一部分，off是字符串的开始索引，len是写的字符个数。
* `void flush()`：刷新该流的缓冲。
* `void close()`：关闭此流，但要刷新它。

---------

### 3.4FileWriter类

文件字符输出流

**作用：**  把内存中字符数据写入到文件中。

#### 构造方法

* FileWriter(File file)：根据给定的File 对象构造一个 FileWriter对象。
* FileWriter(String fileName)：根据给定的文件名构造一个FileWriter对象。

参数：写入数据的目的地

* String fileName：文件的路径
* File file：是一个文件

构造方法的作用：

* 会创建一个FileWriter对象
* 会根据构造方法中传递的文件/文件的路径，创建文件
* 会把FileWriter对象指向创建好的文件

```java
package com.priv.demo05Writer;

import java.io.File;
import java.io.FileWriter;
import java.io.IOException;

public class Demo02FileWriterConstructor {
    public static void main(String[] args) throws IOException {
        //使用File对象创建流对象
        File file =new File("a.txt");
        FileWriter fileWriter =new FileWriter(file);
        
        //使用文件名称创建流对象
        FileWriter fileWriter1 =new FileWriter("b.txt");
    }
}
```

#### 基本写出数据

**写出字符：** `write(int b)`方法，每次可以写出一个字符数据。

字符输出流的使用步骤(重点):

* 创建FiLewriter对象,构造方法中绑定要写入数据的目的地
* 使用Filelwriter中的方法vrite,把数据写入到内存缓冲区中(字符转换为字节的过程)
* 使用Filewriter中的方法fLush,把内存缓冲区中的数据,刷新到文件中
* 释放资源(会先把内存缓冲区中的数据刷新到文件中)

```java
package com.priv.demo05Writer;

import java.io.FileWriter;
import java.io.IOException;

public class Demo01Writer {
    public static void main(String[] args) throws IOException {
        FileWriter fileWriter =new FileWriter("C:\\Users\\97189\\Desktop\\s\\3.txt");
        //`void writer(int c)`：写入单个字符。
        fileWriter.write("97");
        fileWriter.close();
    }
}
```

> tips：
>
> 1.虽然参数为int类型四个字节，但是只会保留一个字符的信息写出。
>
> 2.未调用close方法，数据只是保存到了缓冲区，并未写出到文件中。

#### 关闭和刷新

因为内置缓冲区的原因，如果不关闭输出流，无法写出字符到文件中。但是关闭的流对象，是无法继续写出数据的。如果我们既想写出数据，又想继续使用流，就需要`flush`方法了。

* `flush`：刷新缓冲区，流对象可以继续使用。
* `close`：先刷新缓冲区，然后通知系统释放资源。流对象不可以再被使用了。

**flush方法和close方法的区别**

- flush：刷新缓冲区，流对象可以继续使用。
- close：先刷新缓冲区，然后通知系统释放资源，流对象不可以再被使用了。

```java
package com.priv.demo05Writer;

import java.io.FileWriter;
import java.io.IOException;

public class Demo03CloseAndFlush {
    public static void main(String[] args) throws IOException {
        FileWriter fileWriter =new FileWriter("C:\\Users\\97189\\Desktop\\s\\3.txt");
        //`void writer(int c)`：写入单个字符。
        fileWriter.write("97");
        fileWriter.flush();
        //刷新之后流可以继续使用
        fileWriter.write("98");
        fileWriter.close();
//        fileWriter.write("99");
// close方法之后流已经关闭了,已经从内存中消失了,流就不能再使用了会报错 ：IOException:Stream closed

    }
}
```

> tips：即便是flush方法写出了数据，操作的最后还是要调用close方法，释放系统资源。

#### 写出其他数据

**1.写出字符数组**：`write(char[ ] cbuf)`和`write(char[ ] cbuf，int off，int len)`，每次可以写出字符数组中的数据，用法类似FileOutputStream。

**2.写出字符串**

* `void writer(String str)`：写入字符串。
* `void writer(String str，int off,int len)`：写入字符串的某一部分，off是字符串的开始索引，len是写的字符个数。

```java
package com.priv.demo05Writer;

import java.io.FileWriter;
import java.io.IOException;

public class Demo04Writer {
    public static void main(String[] args) throws IOException {
        FileWriter fileWriter =new FileWriter("C:\\Users\\97189\\Desktop\\s\\3.txt");
        char[] cs={'a','b','c','d','e'};
        //`void writer(char[] cbuf)`：写入字符数组。
        fileWriter.write(cs);//abcde
        //`abstract void writer(char[] cbuf,int off,int len)`：写入字符数组的某一部分，off是数组的开始索引，len是写的字符个数。
        fileWriter.write(cs,0,3);//abc
        //`void writer(String str)`：写入字符串。
        fileWriter.write("Java");
        //`void writer(String str，int off,int len)`：写入字符串的某一部分，off是字符串的开始索引，len是写的字符个数。
        fileWriter.write("Java",0,3);
        fileWriter.close();
    }
}
```

**3.续写和换行**：操作类似于FileOutputStream。

```java
package com.priv.demo05Writer;

import java.io.FileWriter;
import java.io.IOException;

public class Demo05Writer {
    public static void main(String[] args) throws IOException {
        //使用文件名称创建流对象，可续写数据
        FileWriter fileWriter =new FileWriter("C:\\Users\\97189\\Desktop\\s\\4.txt",true);
        //写出字符串
        fileWriter.write("博客");
        //换行
        fileWriter.write("\r\n");
        //写出字符串
        fileWriter.write("JAVA");
        //关闭资源
        fileWriter.close();
    }
}
```

> tips：字符流，只能操作文本文件，不能操作图片，视频等非文本文件。当我们单纯读或写文本文件时，使用字符流 其他情况使用字节流。

---------

## 第四章	IO异常的处理

----------

### 4.1JDK7前处理

之前的练习，我们一直把异常抛出，而实际开发中并不能这样处理，建议使用`try...catch...finally`代码块，处理异常部分。

在jdk1.7之前使用`try...catch...finally`处理流中的异常

**格式：**

```java
try{
    可能会产生出异常的代码
}catch(异常类变量 变量名){
    异常的处理逻辑
}finally{
    一定会指定的代码
    资源释放
}
```

```java
package com.priv.demo06TryCatch;

import java.io.FileWriter;
import java.io.IOException;

public class Demo01TryCatch {
    public static void main(String[] args) {
        //提高变量fileWriter的作用域,让finally可以使用
        FileWriter fileWriter=null;
        try {
            //使用文件名称创建流对象，可续写数据
            fileWriter =new FileWriter("C:\\Users\\97189\\Desktop\\s\\4.txt",true);
            //写出字符串
            fileWriter.write("博客");
            //换行
            fileWriter.write("\r\n");
            //写出字符串
            fileWriter.write("JAVA");

        }catch (IOException e){
            //异常的处理逻辑
            System.out.println(e);
        }finally {
            //创建对象失败了,fileWriter的默认值就是null,null是不能调用方法的,会抛出Null.PointerException ,需要增加一个判断,不是null再把资源释放。
            if (fileWriter!=null){
                try {
                    //关闭资源
                    fileWriter.close();
                }catch (IOException e){
                    e.printStackTrace();
                }
            }
        }
    }
}
```

### 4.2JDK7的处理(扩展知识点了解内容)

**JDK7的新特性**
在try的后边可以增加一个(),在括号中可以定义流对象那么这个流对象的作用域就在try中有效
try中的代码执行完毕,会自动把流对象释放,不用写finally

**格式：**

```java
try(定义流对象；定义流对象...){
    可能会产生出异常的代码
}catch(异常类变量 变量名){
    异常的处理逻辑
}
```

```java
package com.priv.demo06TryCatch;

import java.io.FileInputStream;
import java.io.FileOutputStream;
import java.io.IOException;

public class Demo02JDK7 {
    public static void main(String[] args) {
        try (FileInputStream fis =new FileInputStream("C:\\1.png");
             FileOutputStream fos=new FileOutputStream("D:\\1.png");
        ){int len=0;
        while ((fis.read())!=-1){
            System.out.println(len);
        }
        }catch (IOException e){
            //异常的处理逻辑
            System.out.println(e);
        }
    }
}
```

### 4.3JDK9的改进(扩展知识点了解内容)

**JDK9新特性**
try的前边可以定义流对象
在try后边的()中可以直接引入流对象的名称(变量名)
在try代码执行完毕之后,流对象也可以释放掉,不用写finally

**格式：**

```java
A a =new A();
B b =new B();
try(a;b){
    可能会产生出异常的代码
}catch(异常类变量 变量名){
    异常的处理逻辑
}
```

```java
package com.priv.demo06TryCatch;

import java.io.FileInputStream;
import java.io.FileNotFoundException;
import java.io.FileOutputStream;
import java.io.IOException;

public class Demo03JDK9 {
    public static void main(String[] args) throws IOException {
        FileInputStream fis =new FileInputStream("C:\\1.png");
        FileOutputStream fos=new FileOutputStream("D:\\1.png");
        try (fis;fos){
            int len=0;
            while ((fis.read())!=-1){
                System.out.println(len);
            }
        }catch (IOException e){
            System.out.println(e);
        }
//        fos.write("97");//Stream Closed  流已经关闭了
    }
}
```
