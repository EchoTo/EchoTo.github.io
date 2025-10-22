---
title: IO流(二)
date: 2022-01-13 12:24:22
tags: [IO流]
categories: java
---

## 第五章	属性集

------------

### 5.1概述

`java.util.Properties`继承于`Hashtable`，来表示一个持久的属性集。`java.util.Properties集合extends Hashtable<k, v> implements Map<k , v>`，它使用键值结构存储数据，`Properties`集合是一个双列集合, `key`和`value`默认都是字符串，该类也被许多Java类使用，比如获取系统属性时，`System.getProperties`方法返回一个`Properties`对象。

`Properties`集合是唯一一个和IO流相结合的集合。

* 可以使用Properties集合中的方法store,把集合中的临时数据,持久化写入到硬盘中存储
* 可以使用Properties集合中的方法Load,把硬盘中保存的文件(键值对),读取到集合中使用

----------

### 5.2Properties类

#### 基本的储存方法

**Properties集合有一些操作字符串的特有方法**

* object setProperty(String key, String value）：调用Hashtable 的方法 put。
* string getProperty(String key)：通过key找到value值,此方法相当于Nap集合中的get(key)方法
* set< string> stringPropertyNames()：返回此属性列表中的键集，其中该键及其对应值是字符串。

```java
package com.priv.demo07Properties;

import java.util.Iterator;
import java.util.Properties;
import java.util.Scanner;
import java.util.Set;

public class Demo01Properties {
    public static void main(String[] args) {
        Properties properties = new Properties();
        //object setProperty(String key, String value）：调用Hashtable 的方法 put。
        properties.setProperty("小明", "19");
        properties.setProperty("小林", "15");
        properties.setProperty("小李", "20");
        System.out.println(properties);//{小林=15, 小李=20, 小明=19}

        //set<string> stringPropertyNames()：返回此属性列表中的键集，其中该键及其对应值是字符串。
        Set<String> set = properties.stringPropertyNames();
        Iterator iterator = set.iterator();
        while (iterator.hasNext()) {
            System.out.print(iterator.next());//小林小李小明
        }

//        string getProperty(String key)：通过key找到value值,此方法相当于Nap集合中的get(key)方法
        String s = properties.getProperty("小林");
        System.out.println(s);//15

        //如果输入的Key不存在则返回null
        Scanner scanner = new Scanner(System.in);
        String s1 = properties.getProperty(scanner.next());
        System.out.println(s1);
    }
}
```

#### store方法与load方法

**stroe方法**

可以使用Properties集合中的方法store,把集合中的临时数据,持久化写入到硬盘中存储.

* void store ( outputStream out,String comments)
* void store (iriter wuriter,String comments)

参数：

OutputStream out：字节输出流，不能写入中文

Writer writer：字符输出流，可以写中文

String comments：注释，用来解释说明保存的文件是做什么用的，不能使用中文，会产生乱码，默认是Unicode编码，一般使用"空字符串"。

使用步骤:

* 创建Properties集合对象,添加数据
* 创建字节输出流/字符输出流对象,构造方法中绑定要输出的目的地
* 使用Properties集合中的方法store,把集合中的临时数据,持久化写入到硬盘中存储
* 释放资源

```java
package com.priv.demo07Properties;

import java.io.FileWriter;
import java.io.IOException;
import java.util.Properties;

public class Demo02PropertiesStore {
    public static void main(String[] args) throws IOException {
        //创建Properties集合对象,添加数据
        Properties properties = new Properties();
        properties.setProperty("小明", "19");
        properties.setProperty("小林", "15");
        properties.setProperty("小李", "20");
        //创建字节输出流/字符输出流对象,构造方法中绑定要输出的目的地
        FileWriter fw =new FileWriter("C:\\Users\\97189\\Desktop\\s\\4.txt");
        //使用Properties集合中的方法store,把集合中的临时数据,持久化写入到硬盘中存储
        properties.store(fw,"save data");
        //释放资源
        fw.close();
    }
}
//#save data
//#Thu Aug 19 17:17:58 CST 2021
//小林=15
//小李=20
//小明=19
```

**load方法**

可以使用Properties集合中的方法Load,把硬盘中保存的文件(键值对) ,读取到集合中使用

* void load( inputstream inStream)
* void load ( Reader reader)

**参数：**

* InputStream instream:字节输入流,不能读取含有中文的键值对
* Reader reader:字符输入流,能读取含有中文的键值对

**使用步骤：**

* 创建Properties集合对象
* 使用Properties集合对象中的方法load读取保存键值对的文件
* 遍历Properties集合

**注意：**

* 存储键值对的文件中,键与值默认的连接符号可以使用=或者空格(其他符号)
* 存储键值对的文件中,可以使用#进行注释,被注释的键值对不会再被读取
* 存储键值对的文件中,键与值默认都是字符串,不用再加引号

```java
package com.priv.demo07Properties;

import java.io.FileReader;
import java.io.IOException;
import java.util.Properties;
import java.util.Set;

public class Demo03PropertiesLoad {
    public static void main(String[] args) throws IOException {
        //创建Properties集合对象
        Properties properties =new Properties();
        //使用Properties集合对象中的方法load读取保存键值对的文件
        FileReader fileReader =new FileReader("C:\\Users\\97189\\Desktop\\s\\4.txt");
        properties.load(fileReader);
        fileReader.close();
        //遍历Properties集合
        Set<String> set = properties.stringPropertyNames();
        for (String key:set) {
            String property = properties.getProperty(key);
            System.out.println(key+"="+property);
            //小林=15
            //小李=20
            //小明=19
        }
    }
}
```

---------

## 第六章	缓冲流

-------

### 6.1概述

缓冲流，也叫高效流，是对4个基本的流的增强，按照数据类型分类：

* **字节缓冲流：** `BufferedInputStream`，`BufferedOutputStream`
* **字符缓冲流：** `BufferedReader`，`BufferedWriter`

缓冲流的基本原理，是在创建流对象时，会创建一个内置的默认大小的缓冲区数组，通过缓冲区读写，减少系统IO次数，从而提高读写效率。

<img src="https://tonkyshan.cn/img/202202281835217.png" alt="20210819184022" style="zoom: 50%;" />

------

### 6.2字节缓冲流

#### 构造方法

* `public BufferedOutputStream(OutputStream out)`：创建一个新的缓冲输出流。

`java.io.BufferedOutputStream extends OutputStream`                      Bufferedoutputstream:字节缓冲输出流

继承自父类的共性成员方法:

- public void close() :关闭此输出流并释放与此流相关联的任何系统资源。
- public void flush( ):刷新此输出流并强制任何缓冲的输出字节被写出。
- public void write(byte[ ] b):将b.length字节从指定的字节数组写入此输出流。
- public void write(byte[ ] b， int off, int len):从指定的字节数组写入、len字节，从偏移量off开始输出到此输出流。
- public abstract void write(int b):将指定的字节输出流。

**构造方法：**

* BufferedOutputStream(OutputStream out)创建一个新的缓冲输出流，以将数据写入指定的底层输出流。
* BufferedOutputStream(OutputStream out，int size)创建一个新的缓冲输出流，以将具有指定缓冲区大小的数据写入指定的底层输出流。

**参数：**

* OutputStream out：字节输出流，我们可以传递FileOutputStream，缓冲流会给FileOutputStream增加一个缓冲区，提高FileOutputStream的写入效率
* int size：指定缓冲流内部缓冲流区的大小，不指定默认

**使用步骤(重点)**

* 创建FileOutputStream对象，构造方法中绑定要输出的目的地。
* 创建BufferedOutputStream对象，构造方法中传递FileOutputStream对象，提高FileOutputStream对象效率
* 使用BufferedOutputStream对象中的方法write，把数据写入到内部缓冲区中
* 使用BufferedOutputStream对象中的方法flush，把内部缓冲区的数据，刷新到文件中
* 释放资源(会现调用flush方法刷新数据，第4步可以省略)

```java
package com.priv.demo01BufferedStream;

import java.io.BufferedOutputStream;
import java.io.FileOutputStream;
import java.io.IOException;

public class Demo01BufferedOutputStream {
    public static void main(String[] args) throws IOException {
        //创建FileOutputStream对象，构造方法中绑定要输出的目的地。
        FileOutputStream fom =new FileOutputStream("C:\\Users\\97189\\Desktop\\s\\5.txt");
        //创建BufferedOutputStream对象，构造方法中传递FileOutputStream对象，提高FileOutputStream对象效率
        BufferedOutputStream bof =new BufferedOutputStream(fom);
        //使用BufferedOutputStream对象中的方法write，把数据写入到内部缓冲区中
        bof.write("我们把数据写入文件中".getBytes());
//        bof.flush();//调用close方法时默认先调用flush方法刷新数据所以此步骤可以省略
        bof.close();
    }
}
```

* `public BufferedInputStream(InputStream in)`：创建一个新的缓冲输入流。

`java.io.BufferedInputstream extends Inputstream`                         BufferedInputstream :字节缓冲输入流

继承自父类的共性成员方法:

* `public void close()`：关闭此输入流并释放与此流相关联的任何系统资源。
* `public abstract int read()`：从输入流读取数据的下一个字节。
* `public int read(byte[] b)`：从输入流中读取一些字节数，并将它们存储到字节数组b中。

**构造方法：**

* BufferedInputStreom(InputStream in)：创建一个BufferedInputStream并保存其参数，即输入流 in，以便将来使用。
* BufferedInputStream(Inputstream in，int size)：创建具有指定缓冲区大小的 BufferedInputStream并保存其参数，即输入流in，以便将来使用。

**参数：**

* InputStream in：字节输入流，我们可以传递FileInputStream，缓冲流会给FileInputStream增加一个缓冲区，提高FileInputStream的读取效率
* int size：指定缓冲流内部缓冲流区的大小，不指定默认

**使用步骤(重点)**

* 创建FileInputStream对象，构造方法中绑定要读取的数据源。
* 创建BufferedInputStream对象，构造方法中传递FileInputStream对象，提高FileInputStream对象的读取效率
* 使用BufferedInputStream对象中的方法read，读取文件
* 释放资源

```java
package com.priv.demo01BufferedStream;

import java.io.BufferedInputStream;
import java.io.FileInputStream;
import java.io.IOException;

public class Demo02BufferedInputStream {
    public static void main(String[] args) throws IOException {
        FileInputStream fis =new FileInputStream("C:\\Users\\97189\\Desktop\\s\\5.txt");
        BufferedInputStream bis =new BufferedInputStream(fis);
        int len=0;
        byte[] bytes =new byte[1024];
        while ((len=bis.read(bytes))!=-1){
            System.out.println(new String(bytes,0,len));
        }
        bis.close();//关闭bis时fis自动关闭
    }
}
```

#### 效率测试

**文件复制的步骤：**

* 创建字节缓冲输入流对象,构造方法中传递字节输入流
* 创建字节缓冲输出流对象,构造方法中传递字节输出流
* 使用字节缓冲输入流对象中的方法read,读取文件
* 使用字节缓冲输出流中的方法write,把读取的数据写入到内部缓冲区中
* 释放资源(会先把缓冲区中的数据,刷新到文件中)

```java
package com.priv.demo02CopyFile;

import java.io.*;

public class Demo01CopeFile {
    public static void main(String[] args) throws IOException {
        long s=System.currentTimeMillis();
        //创建字节缓冲输入流对象,构造方法中传递字节输入流
        BufferedInputStream bis =new BufferedInputStream(new FileInputStream("C:\\1.png"));
        //创建字节缓冲输出流对象,构造方法中传递字节输出流
        BufferedOutputStream bos =new BufferedOutputStream(new FileOutputStream("D:\\1.png"));
        //使用字节缓冲输入流对象中的方法read,读取文件
        int len=0;
        byte[] bytes =new byte[1024];
        while ((len=bis.read(bytes))!=-1){
            //使用字节缓冲输出流中的方法write,把读取的数据写入到内部缓冲区中
            bos.write(bytes,0,len);
        }
        //释放资源(会先把缓冲区中的数据,刷新到文件中)
        bos.close();
        bis.close();
        long e =System.currentTimeMillis();
        System.out.println("共耗时："+(e-s)+"毫秒");
    }
}
```

----------

### 6.3字符缓冲流

#### 构造方法

* `public BufferedWriter(Writer out)`：创建一个新的缓冲输出流。

**构造方法：**

* Bufferediwriter(writer out）创建一个使用默认大小输出缓冲区的缓冲字符输出流。
* Bufferedwriter(writer out, int sz）创建一个使用给定大小输出缓冲区的新缓冲字符输出流。

**参数：**

* writer out:字符输出流，我们可以传递Filewriter ,缓冲流会给FiLewriter增加一个缓冲区,提高FiLewriter的写入效率
* int sz:指定缓冲区的大小,不与默认大小

#### **特有方法：**

BufferedWriter : `public void newLine()：`写一行行分隔符,由系统属性定义符号。

**使用步骤(重点)**

* 创建字符缓冲输出流对象,构造方法中传递字符输出流
* 调用字符缓冲输出流中的方法write,把数据写入到内存缓冲区中
* 调用字符缓冲输出流中的方法flush,把内存缓冲区中的数据,刷新到文件中
* 释放资源

```java
package com.priv.demo01BufferedStream;

import java.io.BufferedWriter;
import java.io.FileWriter;
import java.io.IOException;

public class Demo03BufferedWriter {
    public static void main(String[] args) throws IOException {
        //创建字符缓冲输出流对象,构造方法中传递字符输出流
        BufferedWriter bw =new BufferedWriter(new FileWriter("C:\\Users\\97189\\Desktop\\s\\6.txt"));
        //调用字符缓冲输出流中的方法write,把数据写入到内存缓冲区中
        for (int i = 0; i < 10; i++) {
            bw.write("我们把数据写入文件中");
            //调用字符缓冲输出流中的方法flush,把内存缓冲区中的数据,刷新到文件中
//            bw.write("\r\n");
            bw.newLine();
        }
        bw.flush();
        //释放资源
        bw.close();
    }
}
```

* `public BufferedReader(Reader in)`：创建一个新的缓冲输入流。

**构造方法：**

* `BufferedReader(Reader in)：`创建一个使用认大小输入缓冲区的缓冲字符输入流。
* `BufferedReader (Reader in, int sz)：`创建一个使用指定大小输入缓冲区的缓冲字符输入流。

**参数：**

* Reader in：字符输入流，我们可以传递FileReader ,缓冲流会给FiLeReader增加一个缓冲区,提高FiLeReader的读取效率。
* int sz:指定缓冲区的大小,不与默认大小

**特有方法：**

BufferedReader : `public string readLine()：`读一行文字。

读取一个文本行。通过下列字符之一即可认为某行已终止:换行('\n')、回车（'\r'）或回车后直接跟着换行。

返回:
包含该行内容的字符串，不包含任何行终止符，如果已到达流末尾，则返回null。

抛出:
IOException -如果发生I/o错误。

**使用步骤(重点)**

* 创建字符缓冲输入流对象,构造方法中传递字符输入流
* 使用字符缓冲输入流对象中的方法read/readline读取文本
* 释放资源

```java
package com.priv.demo01BufferedStream;

import java.io.BufferedReader;
import java.io.FileReader;
import java.io.IOException;

public class Demo04BufferedReader {
    public static void main(String[] args) throws IOException {
        BufferedReader br =new BufferedReader(new FileReader("C:\\Users\\97189\\Desktop\\s\\6.txt"));
        String line;
        while ((line=br.readLine())!=null){
            System.out.println(line);
        }
    }
}
```

#### 特有方法

字符缓冲流的基本方法与普通字符流调用方式一致，不再阐述，我们来看它们具备的特有方法。

* BufferedWriter : `public void newLine()：`写一行行分隔符,由系统属性定义符号。

> println方法调用的就是 `public void newLine()：`

* BufferedReader : `public string readLine()：`读一行文字。

------

### 6.4练习：文本排序

请将文本信息恢复顺序：

```java
3.侍中、侍郎郭攸之、费祎、董允等，此皆良实，志虑忠纯，是以先帝简拔以遗陛下。愚以为宫中之事，事无大小，悉以咨之，然后施行，必得裨补阙漏，有所广益。
8.愿陛下托臣以讨贼兴复之效，不效，则治臣之罪，以告先帝之灵。若无兴德之言，则责攸之、祎、允等之慢，以彰其咎﹔陛下亦宜自谋，以咨锻善道，察纳雅言，深追先帝遗诏，臣不胜受恩感激。
4 .将军向宠，性行淑均，晓畅军事，试用之于昔日，先帝称之曰能，是以众议举宠为督。愚以为营中之事，悉以咨之，必能使行阵和睦，优劣得所。
2.宫中府中，俱为一体，陟罚臧否，不宜异同。若有作奸犯科及为忠善者，宜付有司论其刑赏，以昭陛下平明之理，不宜偏私，使内外异法也。
1.先帝创业未半而中道崩殂，今天下三分，益州疲弊，此诚危急存亡之秋也。然侍卫之臣不懈于内，忠志之士忘身于外者，盖追先帝之殊遇，欲报之于陛下也。诚宜开张圣听，以光先帝遗德，恢弘志士之气，不宜妄自菲薄，引喻失义，以塞忠谏之路也。
9.今当远离，临表涕零，不知所言。
6.臣本布衣，躬耕于南阳，苟全性命于乱世，不求闻达于诸侯。先帝不以臣卑鄙，猥自枉屈，三顾臣于草庐之中，咨臣以当世之事，由是感激，遂许先帝以驱驰。后值倾覆，受任于败军之际，奉命于危难之间，尔来二十有一年矣。
7.先帝知臣谨慎，故临崩寄臣以大事也。受命以来，夙夜忧叹，恐付托不效，以伤先帝之明，故五月渡泸，深入不毛。今南方已定，兵甲已足，当奖率三军，北定中原，庶竭驽钝，攘除奸凶，兴复汉室，还于旧都。此臣所以报先帝而忠陛下之职分也。至于斟酌损益，进尽忠言，则攸之、祎、允之任也。
5.亲贤臣，远小人，此先汉所以兴隆也;亲小人，远贤臣，此后汉所以倾颓也。先帝在时，每与臣论此事，未尝不叹息痛恨于桓、灵也。侍中、尚书、长史、参军，此悉贞良死节之臣，愿陛下亲之信之，则汉室之隆，可计日而待也。
```

#### 案例分析

* 创建一个HashMap集合对象,可以:存储每行文本的序号(1,2,3,.. ) ;value:存储每行的文本
* 创建字符缓冲输入流对象,构造方法中绑定字符输入流
* 创建字符缓冲输出流对象,构造方法中绑定字符输出流
* 使用字符缓冲输入流中的方法readline,逐行读取文本
* 对读取到的文本进行切割,获取行中的序号和文本内容
* 把切割好的序号和文本的内容存储到HashMap集合中(key序号是有序的,会自动排序1,2,3,4..)
* 遍历HashMap集合,获取每一个键值对
* 把每一个键值对,拼接为一个文本行
* 把拼接好的文本,使用字符缓冲输出流中的方法write,写入到文件中
* 释放资源

#### 案例实现

```java
package com.priv.demo01BufferedStream;

import java.io.*;
import java.util.HashMap;

public class Demo05Test {
    public static void main(String[] args) throws IOException {
        //创建一个HashMap集合对象,Key:存储每行文本的序号(1,2,3,.. ) ;value:存储每行的文本
        HashMap<String,String> hashMap=new HashMap<>();
        //创建字符缓冲输入流对象,构造方法中绑定字符输入流
        BufferedReader br =new BufferedReader(new FileReader("C:\\Users\\97189\\Desktop\\s\\6.txt"));
        //创建字符缓冲输出流对象,构造方法中绑定字符输出流
        BufferedWriter bw =new BufferedWriter(new FileWriter("C:\\Users\\97189\\Desktop\\s\\7.txt"));
        //使用字符缓冲输入流中的方法readline,逐行读取文本
        String line;
        while ((line=br.readLine())!=null){
            //对读取到的文本进行切割,获取行中的序号和文本内容
            String[] arr = line.split("\\.");
            //把切割好的序号和文本的内容存储到HashMap集合中(key序号是有序的,会自动排序1,2,3,4..)
            hashMap.put(arr[0],arr[1]);
        }
        //遍历HashMap集合,获取每一个键值对
        for (String key:hashMap.keySet()) {
            String value = hashMap.get(key);
            //把每一个键值对,拼接为一个文本行
            line=key+"."+value;
            //把拼接好的文本,使用字符缓冲输出流中的方法write,写入到文件中
            bw.write(line);
            bw.newLine();//写换行
        }
        //释放资源
        bw.close();
        br.close();
    }
}
```

------------

## 第七章	转换流

---------

### 7.1字符编码和字符集

#### 字符编码

计算机中储存的信息都是用二进制数表示的，而我们在屏幕上看到的数字、英文、标点符号、汉字等字符是二进制数转换之后的结果。按照某种规则，将字符存储到计算机中，称为**编码**。反之，将存储在计算机中的二进制数按照某种规则解析显示出来，称为**解码**。比如说，按照A规则存储，同样按照A规则解析，那么就能显示正确的文本符号。反之，按照A规则存储，再按照B规则解析，就会导致乱码现象。

编码：字符(能看懂的)--->字节(看不懂的)

解码：字节(看不懂的)--->字符(能看懂的)

* **字符编码`Character Encoding`**：就是一套自然语言的字符与二进制数之间的对应规则。

编码表：生活中文字和计算机中二进制的对应规则。

#### 字符集

* **字符集`Charset`**：也叫编码表。是一个系统支持的所有字符的集合，包括各国家文字、标点符号、图形符号、数字等。

计算机要准确的存储和识别各种字符集符号，需要进行字符编码，一套字符集必然至少有一套字符编码。常见字符集有ASCII字符集、GBK字符集、Unicode字符集等。

![20210820082714](https://tonkyshan.cn/img/202202281750420.png)

可见，当指定了**编码**，它所对应的**字符集**自然就制定了，所以**编码**才是我们最终要关心的。

* **ASSII字符集：**

1.ASCll ( American Standard Code for Information Interchange，美国信息交换标准代码）是基于拉丁字母的一套电脑编码系统，用于显示现代英语，主要包括控制字符(回车键、退格、换行键等）和可显示字符(英文大小写字符、阿拉伯数字和西文符号)。

2.基本的ASCII字符集，使用7位( bits )表示一个字符，共128字符。ASCII的扩展字符集使用8位( bits )表示一个字符，共256字符，方便支持欧洲常用字符。

* **ISO-8859-1字符集：**

1.拉丁码表，别名Latin-1，用于显示欧洲使用的语言，包括荷兰、丹麦、德语、意大利语、西班牙语等。

2.ISO-5559-1使用单字节编码，兼容ASCII编码。

* **GBxxx字符集：**

1.GB就是国标的意思，是为了显示中文而设计的一套字符集。

2.GB2312∶简体中文码表。一个小于127的字符的意义与原来相同。但两个大于127的字符连在一起时，就表示一个汉字，这样大约可以组合了包含7000多个简体汉字，此外数学符号、罗马希腊的字母、日文的假名们都编进去了，连在ASCII里本来就有的数字、标点、字母都统统重新编了两个字节长的编码，这就是常说的"全角"字符，而原来在127号以下的那些就叫"半角"字符了。

3.GBK∶最常用的中文码表。是在GB2312标准基础上的扩展规范，使用了双字节编码方案，共收录了
21003个汉字，完全兼容GB2312标准，同时支持繁体汉字以及日韩汉字等。

4.GB18030∶最新的中文码表。收录汉字70244个，采用多字节编码，每个字可以由1个、2个或4个字节组成。支持中国国内少数民族的文字，同时支持繁体汉字以及日韩汉字等。

* **Unicode字符集：**

1.Unicode编码系统为表达任意语言的任意字符而设计，是业界的一种标准，也称为统一码、标准万国码。

2.它最多使用4个字节的数字来表达每个字母、符号，或者文字。有三种编码方案，UTF-8、UTF-16和UTF-32。最为常用的UTF-8编码。

3.UTF-8编码，可以用来表示Unicode标准中任何字符，它是电子邮件、网页及其他存储或传送文字的应用中，优先采用的编码。互联网工程工作小组(IETF ） 要求所有互联网协议都必须支持UTF-8编码。所以，我们开发Web应用，也要使用UTF-8编码。它使用一至四个字节为每个字符编码，编码规则∶

* 128个US-ASCl字符，只需一个字节编码。
* 拉丁文等字符，需要二个字节编码。
* 大部分常用字(含中文)，使用三个字节编码。
* 其他极少使用的Unicode辅助字符，使用四字节编码。

---------

### 7.2编码引出的问题

在IDEA中，使用`FileReader`读取项目中的文本文件。由于IDEA的设置，都是默认的UTF-8编码，所以没有任何问题。但是，当读取Windows系统中创建的文本文件时，由于Windows系统的默认是GBK编码，就会出现乱码。

```java
package com.priv.demo03ReverseStream;

import java.io.FileReader;
import java.io.IOException;

public class Demo01FileReader {
    public static void main(String[] args) throws IOException {
        FileReader fr =new FileReader("C:\\Users\\97189\\Desktop\\s\\11.txt");
        int len=0;
        while ((len=fr.read())!=-1){
            System.out.print((char) len);
        }
        fr.close();
    }
}
```

-------

### 7.3InputStreamReader类

`java.io.InputStreamReader extends Reader`

InputStreamReader：是字节流通向字符流的桥梁:它使用指定的charset读取字节并将其解码为字符。(解码:把看不懂的变成能看懂的)

继承自父类的共性成员方法:

* int read()：读取单个字符并返回。
* int read ( char[ ] cbuf)：一次读取多个字符,将字符读入数组。
* void close()：关闭该流并释放与之关联的所有资源。

#### 构造方法

* `InputStreamReader(InputStream in)`：创建一个使用默认字符集的字符流。

* `InputStreamReader(InputStream in,String charsetName)`：创建一个指定字符集的字符流。

```java
InputstreamReader isr = new InputStreamReader(new FileInputstream( "in.txt"));
InputStreamReader isr2 = new InputStreamReader(new FileInputStream("in.txt"),"GBK");
```

**参数：**

* InputStream in：字节输入流，用来读取文件中保存的字节
* String charsetName：指定的编码表名称,不区分大小写,可以是utf-8/UTF-8,gbk/GBK....不指定默认使用UTF-8

#### 指定编码读取

**使用步骤(重点)**

* 创建InputStreamReader对象,构造方法中传递字节输入流和指定的编码表名称
* 使用InputStreamReader对象中的方法read读取文件
* 释放资源

> tips：构造方法中指定的编码表名称要和文件的编码相同,否则会发生乱码。

```java
package com.priv.demo03ReverseStream;

import java.io.FileInputStream;
import java.io.IOException;
import java.io.InputStreamReader;

public class Demo03InputStreamReader {
    public static void main(String[] args) throws IOException {
        read_UTF_8();
    }

    private static void read_UTF_8() throws IOException {
        //创建InputStreamReader对象,构造方法中传递字节输入流和指定的编码表名称
        InputStreamReader isr =new InputStreamReader(new FileInputStream("C:\\Users\\97189\\Desktop\\s\\1.txt"),"UTF-8");
        int len=0;
        //使用InputStreamReader对象中的方法read读取文件
        while ((len=isr.read())!=-1){
            System.out.print((char) len);//你好
        }
        //释放资源
        isr.close();
    }
}
```

-------

### 7.4OutputStreamWriter类

`java.io.OutputStreamWriter extends Writer`

OutputStreamWriter:是字符流通向字节流的桥梁:可使用指定的 charset将要写入流中的字符编码成字节。(编码:把能看懂的变成看不懂)

继续自父类的共性成员方法:

- void write(int c)写入单个字符。
- void write(char[ ]  cbuf)写入字符数组。
- abstract void write(char[ ] cbuf，int off， int len)写入字符数组的某一部分, off数组的开始索引, len写的字符个数。
- void write ( String str)写入字符串。
- void write( String str，int off， int len)写入字符串的某一部分, off字符串的开始索引, Len写的字符个数。
- void flush ()刷新该流的缓冲。
- void close()关闭此流，但要先刷新它。

#### 构造方法

* `OutputStreamWriter(OutputStream out)：`创建使用黑认字符编码的 OutputStreamWriter。
* `OutputStreamWriter(OutputStream out，String charsetName)：`创建使用指定字符集的OutputStreamWriter。

**参数：**

* OutputStream out：字节输出流,可以用来写转换之后的字节到文件中
* String charsetName：指定的编码表名称,不区分大小写,可以是utf-8/UTF-8,gbk/GBK....不指定默认使用UTF-8

#### 指定编码写出

**使用步骤(重点)**

* 创建OutputStreamWriter对象,构造方法中传递字节输出流和指定的编码表名称
* 使用OutputStreamWriter对象中的方法write,把字符转换为字节存储缓冲区中(编码)
* 使用OutputStreamWriter对象中的方法flush,把内存缓冲区中的字节刷新到文件中(使用字节流写字节的过程)
* 释放资源

```java
package com.priv.demo03ReverseStream;

import java.io.*;

public class Demo02OutputStreamWriter {
    public static void main(String[] args) throws IOException{
        write_UTF_8();
    }

    private static void write_UTF_8() throws IOException{
        //创建OutputStreamWriter对象,构造方法中传递字节输出流和指定的编码表名称
        OutputStreamWriter osw =new OutputStreamWriter(new FileOutputStream("C:\\Users\\97189\\Desktop\\s\\1.txt"),"UTF-8");//不指定默认是UTF-8
        //使用OutputStreamWriter对象中的方法write,把字符转换为字节存储缓冲区中(编码)
        osw.write("你好");
        //使用OutputStreamWriter对象中的方法flush,把内存缓冲区中的字节刷新到文件中(使用字节流写字节的过程)
        osw.flush();
        //释放资源
        osw.close();
    }
}
```

---------

### 7.5练习：转换文件编码

将GBK编码的文本文件，转换为UTF-8编码的文本文件。

#### 案例分析

* 指定GBK编码的转换流，读取文本文件。
* 使用UTF-8编码的转换流，写出文本文件。

#### 案例实现

**使用步骤(重点)**

* 创建InputStreamReader对象，构造方法中传递字节输入流和指定的编码表名称GBK
* 创建OutputStreamWriter对象,构造方法中传递字节输出流和指定的编码表名称UTF-8
* 使用InputStreamReader对象中的方法read读取文件
* 使用OutputStreamWriter对象中的方法write,把读取的数据写入到文件中
* 释放资源

```java
package com.priv.demo03ReverseStream;

import java.io.*;

public class Demo04Test {
    public static void main(String[] args) throws IOException{
        //创建InputStreamReader对象，构造方法中传递字节输入流和指定的编码表名称GBK
        InputStreamReader isr =new InputStreamReader(new FileInputStream("C:\\Users\\97189\\Desktop\\s\\11.txt"),"GBK");
        //创建OutputStreamWriter对象,构造方法中传递字节输出流和指定的编码表名称UTF-8
        OutputStreamWriter osw =new OutputStreamWriter(new FileOutputStream("C:\\Users\\97189\\Desktop\\s\\12.txt"),"UTF-8");
        //使用InputStreamReader对象中的方法read读取文件
        int len =0;
        while ((len=isr.read())!=-1){
            //使用OutputStreamWriter对象中的方法write,把读取的数据写入到文件中
            osw.write(len);
        }
        //释放资源
        osw.close();
        isr.close();
    }
}
```

-----------

## 第八章	序列化

------

### 8.1概述

Java提供了一种对象**序列化**的机制。用一个字节序列可以表示一个对象，该字节序列包含该`对象的数据`，`对象的类型`和`对象中存储的属性`等信息。字节序列写出到文件之后，相当于文件中**持久保存**了一个对象的信息。

反之，该字节序列还可以从文件中读取回来，重构对象，对它进行**反序列化**。`对象的数据`，`对象的类型`和`对象中存储的属性`信息，都可以用来在内存中创建对象。

<img src="https://tonkyshan.cn/img/202202281835204.png" alt="20210820125126" style="zoom: 67%;" />

<img src="https://tonkyshan.cn/img/202202281750908.png" alt="20210820125835" style="zoom:67%;" />

----------

### 8.2ObjectOutputStream类

`java.io.ObjectOutputStream`类，将Java对象的原始数据类型写出到文件，实现对象的持久储存。ObjectOutputStream：对象的序列化流。

#### 构造方法

* `public 0bjectOutputStream(OutputStream out) `:创建一个指定OutputStream的ObjectOutputStream。

```java
FileOutputStream fileOut = new FileOutputStream("employee.txt");
ObjectOutputStream out = new ObjectOutputStream(fileOut);
```

**参数：**

* OutputStream out：字节输出流

**特有的成员方法：**

* void writeObject(Object obj)：将指定的对象写入ObjectOutputStream。

#### 序列化操作

1.一个对象要想序列化，必须满足两个条件:

* 该类必须实现`java.io.Serializable`接口，`Serializable`是一个标记接口(**里面是空的**)，不实现此接口的类将不会使任何状态序列化或反序列化，会抛出`NotSerializableException` 。
* 该类的所有属性必须是可序列化的。如果有一个属性不需要可序列化的，则该属性必须注明是瞬态的，使用`transient`关键字修饰。

1.static关键字:静态关键字
静态优先于非静态加载到内存中(静态优先于对象进入到内存中)被static修饰的成员变量不能被序列化的,序列化的都是对象

2.transient关键字:瞬态关键字
被transient修饰成员变量,不能被序列化

**使用步骤(重点)**

* 创建ObjectOutputStream对象,构造方法中传递字节输出流
* 使用ObjectOutputStream对象中的方法writeObject,把对象写入到文件中
* 释放资源

```java
package com.priv.demo04ObjectStream;

import java.io.Serializable;

public class Person implements Serializable {
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

```java
package com.priv.demo04ObjectStream;

import java.io.FileOutputStream;
import java.io.IOException;
import java.io.ObjectOutputStream;

public class Demo01ObjectOutputStream {
    public static void main(String[] args) throws IOException {
        //创建ObjectOutputStream对象,构造方法中传递字节输出流
        ObjectOutputStream oos =new ObjectOutputStream(new FileOutputStream("C:\\Users\\97189\\Desktop\\s\\1.txt"));
        //使用ObjectOutputStream对象中的方法writeObject,把对象写入到文件中
        oos.writeObject(new Person("小明",19));
        //释放资源
        oos.close();
    }
}
```

---------

### 8.3ObjectInputStream类

ObjectInputStream：对象的反序列化流，将之前使用ObjectOutputStream序列化的原始数据恢复为对象。

作用：把文件中保存的对象，以流的方式读取出来使用。

#### 构造方法

* `public ObjectInputStream(InputStream in):`创建一个指定InputStream的ObjectInputStream。

**参数：**

* InputStream in：字节输入流

**特有的成员方法：**

* `Object readObject()：`从ObjectInputStream读取对象

#### 反序列化操作1

如果能找到一个对象的class文件，我们可以进行反序列化操作，调用ObjectInputStream读取对象的方法:

* `public final Object readObject ()∶`读取一个对象。

**使用步骤(重点)**

* 创建ObjectInputStream对象,构造方法中传递字节输入流
* 使用ObjectInputStream对象中的方法readObject读取保存对象的文件
* 释放资源
* 使用读取出来的对象(打印)

> tips：read0bject方法声明抛出了classNotFoundException(class文件找不到异常)当不存在对象的class文件时抛出此异常
> 反序列化的前提:
>
> * 类必须实现Serializable
> * 必须存在类对应的class文件

```java
package com.priv.demo04ObjectStream;

import java.io.*;

public class Demo02ObjectInputStream {
    public static void main(String[] args) throws IOException, ClassNotFoundException {
        //创建ObjectInputStream对象,构造方法中传递字节输入流
        ObjectInputStream ois=new ObjectInputStream(new FileInputStream("C:\\Users\\97189\\Desktop\\s\\1.txt"));
        //使用ObjectInputStream对象中的方法readObject读取保存对象的文件
        Object o = ois.readObject();
        //释放资源
        ois.close();
        //使用读取出来的对象(打印)
        System.out.println(o);//Person{name='小明', age=19}
        Person p=(Person)o;
        System.out.println(p.getName()+p.getAge());//小明19
    }
}
```

**对于JVM可以反序列化对象，它必须是能够找到class文件的类。如果找不到该类的class文件，则抛出一个ClassNotFoundException异常。**

#### 反序列化操作2

**另外，当JVM反序列化对象时，能找到class文件，但是class文件在序列化对象之后发生了修改，那么反序列化操作也会失败，抛出一个`InvalidClassException`异常。发生这个异常的原因如下∶**

* 该类的序列版本号与从流中读取的类描述符的版本号不匹配
* 该类包含未知数据类型
* 该类没有可访问的无参数构造方法

`Serializable`接口给需要序列化的类，提供了一个序列版本号。`serialVersionUID`该版本号的目的在于验证序列化的对象和对应类是否版本匹配。

<img src="https://tonkyshan.cn/img/202202281835065.png" alt="20210820135233" style="zoom: 50%;" />

在Person类中添加一个自定义的序列号，序列化之后再对Person类修改时反序列化时就不会抛出`InvalidClassException`异常。

```java
private static final long serialVersionUID =1L;//在类里方法外添加
```

-----------

### 8.4练习：序列化集合

* 将存有多个自定义对象的集合序列化操作，保存到`list.txt`文件中。
* 反序列化`list.txt`，并遍历集合，打印对象信息。

#### 案例分析

* 定义一个存储Person对象的ArrayList集合
* 往Arraylist集合中存储Person对象
* 创建一个序列化流ObjectOutputStream对象
* 使用ObjectOutputStream对象中的方法writeObject ,对集合进行序列化
* 创建一个反序列化ObjectInputStream对象
* 使用ObjectInputStream对象中的方法readObject读取文件中保存的集合
* 把Object类型的集合转换为Arraylist类型
* 遍历Arraylist集合
* 释放资源

#### 案例实现

```java
package com.priv.demo04ObjectStream;

import java.io.*;
import java.util.ArrayList;
import java.util.Iterator;

public class Demo03Test {
    public static void main(String[] args) throws IOException, ClassNotFoundException {
        //定义一个存储Person对象的ArrayList集合
        ArrayList<Person> arrayList =new ArrayList<>();
        //往Arraylist集合中存储Person对象
        arrayList.add(new Person("小明",19));
        arrayList.add(new Person("小李",17));
        arrayList.add(new Person("小林",16));
        arrayList.add(new Person("小刚",22));
        arrayList.add(new Person("小金",19));
        arrayList.add(new Person("小吴",18));
        //创建一个序列化流ObjectOutputStream对象
        ObjectOutputStream oos =new ObjectOutputStream(new FileOutputStream("C:\\Users\\97189\\Desktop\\s\\list.txt"));
        //使用ObjectOutputStream对象中的方法writeObject ,对集合进行序列化
        oos.writeObject(arrayList);
        //创建一个反序列化ObjectInputStream对象
        ObjectInputStream ois =new ObjectInputStream(new FileInputStream("C:\\Users\\97189\\Desktop\\s\\list.txt"));
        //使用ObjectInputStream对象中的方法readObject读取文件中保存的集合
        Object o = ois.readObject();
        //把Object类型的集合转换为Arraylist类型
        ArrayList<Person> arrayList1=(ArrayList)o;
        //遍历Arraylist集合
        Iterator<Person> iterator =arrayList1.iterator();
        while (iterator.hasNext()){
            System.out.println(iterator.next());
            //Person{name='小明', age=19}
            //Person{name='小李', age=17}
            //Person{name='小林', age=16}
            //Person{name='小刚', age=22}
            //Person{name='小金', age=19}
            //Person{name='小吴', age=18}
        }
        //释放资源
        ois.close();
        oos.close();
    }
}
```

------------

## 第九章	打印流

-------

### 9.1概述

平时我们在控制台打印输出，是调用`print`方法和`println`方法完成的，这两个方法都来自于`java.io.PrintStream`类，该类能够方便地打印各种数据类型的值，是一种便捷的输出方式。

------

### 9.2PrintStream类

`java.io.Printstream:`打印流
PrintStream：为其他输出流添加了功能，使它们能够方便地打印各种数据值表示形式。

PrintStream特点:

* 只负责数据的输出,不负责数据的读取
* 与其他输出流不同，PrintStream永远不会抛出IOException
* 有特有的方法, print , println
  void print(任意类型的值)
  void println(任意类型的值并换行)

#### 构造方法

* PrintStream(FiLe file):输出的目的地是一个文件
* PrintStream(OutputStream out):输出的目的地是一个字节输出流
* PrintStream(String fileName):输出的目的地是一个文件路径

`PrintStream extends OutputStream`继承自父类的成员方法:

- `public void close( ) :`关闭此输出流并释放与此流相关联的任何系统资源。
- `public void flush():`刷新此输出流并强制任何缓冲的输出字节被写出。
- `public void write(byte[] b):`将b.length字节从指定的字节数组写入此输出流。
- `public void write(byte[] b，int off, int len) :`从指定的字节数组写入`len`字节，从偏移量`off`开始输出到此输出流。
- `public abstract void write(int b):`将指定的字节输出流。

> tips：
>
> * 如果使用继承自父类的write方法写数据,那么查看数据的时候会查询编码表97->a
> * 如果使用自己特有的方法print/println方法写数据，写的数据原样输出97->97

**代码：**

```java
PrintStream ps = new PrintStream("ps.txt");
```

#### 改变打印流向

`System.out`就是`PrintStream`类型的，只不过它的流向是系统规定的，打印在控制台上。不过，既然是流对象，我们就可以玩一个"小把戏”，改变它的流向。

使用`System.setOut`方法改变输出语句的目的地改为参数中传递的打印流的目的地

* static void setOut (PrintStream out)
  重新分配“标准”输出流。

```java
package com.priv.demo05PrintStream;

import java.io.FileNotFoundException;
import java.io.PrintStream;

public class Demo01PrintStream {
    public static void main(String[] args) throws FileNotFoundException {
        System.out.println("我是在控制台输出的");
        PrintStream ps =new PrintStream("C:\\Users\\97189\\Desktop\\s\\1.txt");
        System.setOut(ps);//把输出语句的自的地改变为打印流的目的地
        System.out.println("我在打印流的目的地输出");
        ps.close();
    }
}
```

