---
title: MySQL基础
date: 2022-01-27 15:23:12
tags: [MySQL]
categories: 数据库
---

## MySQL基础

--------------

## 第一章	初识MySQL

---------

### 1.1相关概念

保存数据的容器：`数组`、`集合`、`文件`

**使用数据库的好处：**

* 实现数据持久化
* 使用完整的管理系统统一管理，易于查询

**1.DB**

数据库(database)：存储数据的"仓库"。它保存了一系列有组织的数据。

**2.DBMS**

数据库管理系统(Database Management System)。数据库是通过DBMS创建和操作的容器。

常见的DBMS：MySQL、Oracle、DB2、SqlServer等

**3.SQL**

结构化查询语言(Structure Query Language)：专门用来与数据库通信的语言。

![20210821171708](https://tonkyshan.cn/img/202203021318347.png)

优点：

* 不是某个特定数据库供应商专有的语言，几乎所有DBMS都支持SQL
* 简单易学
* 虽然简单，但实际上是一种强有力的语言，灵活使用其语言元素，可以进行非常复杂和高级的数据库操作。

-------

### 1.2数据库存储数据的特点

1.将数据放到表中，表再放到库中

![20210821182429](https://tonkyshan.cn/img/202203021318258.png)

2.一个数据库中可以有多个表，每个表都有一个名字，用来标识自己。表名具有唯一性。

3.表具有一些特性，这些特性定义了数据再表中如何存储，类似java中"类"的设计。

4.表由列组成，我们也称为字段。所有表都是由一个或多个列组成的，每一列类似java中的"属性"。

5.表中的数据是按行存储的，每一行类似于java中的"对象"。

----------

## 第二章	初始MySQL

--------

### 2.1MySQL产品的介绍

MySQL数据库隶属于MySQLAB公司，总部位于瑞典，后被oracle收购。

创始人：Monty

优点：

* 成本低：开放源代码，一般可以免费试用
* 性能高：执行很快
* 简单：很容易安装和使用

--------

### 2.2MySQL产品的安装

DBMS分为两类：

* 基于共享文件系统的DBMS(Access)微软的
* 基于客户机——服务器的DBMS，比如MySQL、Oracle、SqlServer

-------

2.3MySQL服务的启动和停止

第一种方法：WIN+R   输入  services.msc，找到MySQL右键启动或停止服务

第二种方法：以管理员身份打开cmd 

* 启动  `net start mysql`
* 关闭  `net stop mysql`

---------

### 2.4MySQL服务的登录与退出

登录：在dos窗口中输入命令`mysql -h localhost -P 3306 -u root -p`

本机简写：`mysql -u root -p密码`

* 最前面的mysql你可以理解成一个关键字或者理解成一个固定的命令，是固定写法，类似于java、jdk中的javac命令或java命令
* -h表示host,即主机的ip地址
* -P表示port，端口，mysql数据库的默认端口是3306，当然啦，你可以自己改端口号，我这里没改端口号(注意：这是大写的字母P)
* -u表示user用户名
* -p表示password密码(注意：这是小写的字母p)

> **大写的P表示端口号，小写的p表示密码**

退出：**exit**

--------

### 2.5MySQL的常见命令和语法规范

**常见命令：**

1.查看当前所有的数据库

`show databases;`

2.打开指定的库

`use 库名;`

3.查看当前库的所有表

`show tables;`

4.查看其他库的所有表

`show tables from 库名;`

5.创建表

```java
CREATE table 表名{
     列名  列类型，
     列名  列类型，
     ...
};
```

6.查看表结构

`desc 表名;`

7.查看服务器的版本

方式一：登录到mysql服务端

`select version();`

方式二：没有登录到mysql服务端

`mysql --version`或者`mysql --V`

**语法规范**：

1.不区分大小写。但建议关键字大写，表名、列名小写

2.每条命令最好用分号结尾

3.每条命令根据需要，可以进行缩进或换行

4.注释

​     单行注释：#注释文字

​     单行注释：-- 注释文字

​      多行注释：/* 注释文字 */

--------------

## 第三章	DQL语言

--------

**数据查询语言**

### 3.1基础查询

**语法：**

```java
SELECT     查询列表     
FROM      表名;
```

类似于：System.out.println(打印东西);

**特点：**

1.查询列表可以是：表中的字段、常量值、表达式、函数

2.查询的结果是一个虚拟的表格

**1.查询表中的单个字段**

```java
SELECT last_name 
FROM employees;
```

**2.查询表中的多个字段**

```java
SELECT last_name,job_id 
FROM employees;
```

**3.查询表中的所有字段**

第一种方式：哪里不会点哪里(双击)（~~坏笑~~）

第二种方式：

```java
SELECT * FROM employees;
```

> tips：
>
> * 查询前：**USE   库名;**         #进入指定的数据库
> * 当表名和关键字重复时，表名用着重号包裹，如`name`

**4.查询常量值**

```java
SELECT 100;
SELECT 'john';
```

> tips：字符型和日期型的常量值必须用单引号引起来，数值型不需要。

**5.查询表达式**

```java
SELECT 100*98;
SELECT 100%98;
```

**6.查询函数**

```java
SELECT VERSION(实参列表);
```

**7.起别名**

* 便于理解
* 如果要查询的字段有重名的情况，使用别名可以区分开来

```java
方式一：使用AS
SELECT 100*98 AS 结果(别名);
方式二：使用空格
SELECT last_name 姓,first_name 名 FROM employees;
#案例：查询salary，显示结果为 out put
SELECT salary AS 'out put' FROM employess;
```

**8.去重**

关键字：**DISTINCT**

**去掉重复的数据**

```mysql
SELECT DISTINCT department_id FROM employees;
```

**9.+号的作用**

Java中的+

* 运算符：两个操作数都为数值型
* 连接符：只要有一个操作数为字符串

MySQL中的+

* 仅仅只有一个功能：运算符

```java
SELECT 100+90;#两个操作数都为数值型，则做加法运算
SELECT '123'+90;#其中一方为字符型，则试图将字符型数值转换成数值型，如果转换成功，则继续做加法运算，
SELECT 'john'+90;
#如果转换失败，则将字符型数值转换成0
SELECT null+10;#只要一方为null，结果肯定为null
```

案例：查询员工名和姓连接成一个字段，并显示 姓名

```java
SELECT CONCAT('A','B','C') AS 结果

SELECT CONCAT(last_name,first_name) AS 姓名
FROM employees;
```

**附加：**

* **IFNULL函数**

MySQL `IFNULL`函数是MySQL控制流函数之一，它接受两个参数，如果不是`NULL`，则返回第一个参数。 否则，`IFNULL`函数返回第二个参数。

两个参数可以是文字值或表达式。

以下说明了`IFNULL`函数的语法：

```java
IFNULL(expression_1,expression_2);
```

如果`expression_1`不为`NULL`，则`IFNULL`函数返回`expression_1`; 否则返回`expression_2`的结果。

`IFNULL`函数根据使用的上下文返回字符串或数字。

如果要返回基于`TRUE`或`FALSE`条件的值，而不是`NULL`，则应使用IF函数。

* **ISNULL函数**

返回 **一个布尔值** ，该值指示一个 表达式 是否不包含 Null (数据) 。

**语法**

所需的 **表达式参数**包含一个或多个 数值表达式 变量 字符串表达式 。

**备注**

**如果表达式为** **Null，**则 IsNull**返回\True;**否则**，IsNull**返回**False。如果表达式由多个表达式 变量 ，则任何构成变量中的**Null都会导致为整个表达式返回 True。

Null 值表示**变体不包含**任何有效数据。 **Null** 与 空 不同，它表示变量尚未初始化。 它也不与零长度字符串 (") ，有时称为 null 字符串。

**重要:** 使用 **IsNull** 函数确定表达式是否包含 **Null** 值。 在某些情况下，预期计算结果为**True**的表达式（例如 If Var = Null 和 If Var <> Null）始终**为 False。** 这是因为包含NULL**的任何表达式本身为**Null，**因此为**False。

--------

### 3.2条件查询

**语法：**

```java
SELECT 查询列表
FROM   表名
WHERE 筛选条件;#类似于if语句
#执行语句顺序 2、3、1
```

**分类：**

**1.按条件表达式筛选**

* 简单条件运算符：>  <  =  !=或<>(建议这个)  >=  <=

案例一：查询工资>12000的员工信息

```java
SELECT *
FROM employees
WHERE salary>12000;
```

案例二：查询部门编号不等于90号的员工名和部门编号

```java
SELECT 
  last_name,
  department_id 
FROM
  employees 
WHERE department_id <> 90 ;
```

**2.按逻辑表达式筛选**

作用：用于连接条件表达式

* 逻辑运算符 &&  ||  ！

​       建议使用MySQL里自带的 and  or  not

案例一：查询工资在10000到20000之间的员工名、工资、以及奖金

```java
SELECT 
  last_name,
  salary,
  commission_pct 
FROM
  employees 
WHERE salary >= 10000 
  AND salary <= 20000 ;
```

案例二：查询部门编号不是在90到110之间，或者工资高于15000的员工信息

```java
SELECT 
  * 
FROM
  employees 
WHERE department_id <= 90 
  OR department_id >= 110 
  OR salary >= 15000 ;
```

**3.模糊查询**

**like**

特点：一般和通配符搭配使用

* %任意多个字符，包含0个字符

* 任意单个字符

案例一：查询员工名中包含字符a的员工信息

```java
SELECT 
  * 
FROM
  employees 
WHERE last_name LIKE '%a%' ;
```

案例二：查询员工名中第三个字符为e，第五个字符为a的员工名和工资

```java
SELECT
last_name,
salary
FROM
employees
WHERE
last_name LIKE '__e_a%';
```

案例三：查询员工名中第二个字符为_的员工名

**ESCAPE转译**

```java
SELECT
last_name
FROM
employees
WHERE
last_name LIKE '_\_%';
#或者last_name LIKE '_$_%' ESCAPE '$';
```

**between and**

特点：

* 使用between and可以提高语句的简洁度
* 包含临界值
* 两个临界值不要调换顺序

案例一：查询员工编号在100到120之间的员工信息

```java
SELECT 
  * 
FROM
  employees 
WHERE manager_id BETWEEN 100 
  AND 120 ;
```

**in**

含义：判断某字段的值是否属于in列表中的某一项

特点：

* 使用in提高语句简洁度
* in列表的值类型必须一致或兼容
* 不支持通配符

案例一：查询员工的工种编号是 IT_PROG、AD_VP、AD_PRES中的一个员工名和工种编号

```java
SELECT 
  last_name,
  job_id 
FROM
  employees 
WHERE job_id IN ('IT_PROG', 'AD_VP', 'AD_PRES') ;
```

**is  null**

特点：

* =或<>不能用于判断null值
* is null或者is not null 可以判断null值
* is不能判断数值(不能当=来用)

案例一：查询没有奖金的员工名和奖金率

```java
SELECT 
  last_name,
  commission_pct 
FROM
  employees 
WHERE commission_pct IS NULL ;
```

**附加：安全等于<=>**

* 可以判断null值

```java
SELECT 
  last_name,
  commission_pct 
FROM
  employees 
WHERE commission_pct <=> NULL ;
```

* 也可以判断数值

```java
SELECT *
FROM employees
WHERE salary <=> 12000;
```

> tips：
>
> * IS NULL：仅仅可以判断NULL值，可读性较高，建议使用
> * <=>：既可以判断NULL值，又可以判断普通的数值，可读性较低

```java
SELECT 
last_name,
department_id,
salary*12*(1+IFNULL(commission_pct,0)) AS 年薪
FROM
employees;
```

--------

### 3.3排序查询

**语法：**

```java
SELECT 查询列表
FROM 表
【WHERE 筛选条件】
ORDER BY 排序列表  【ASC|DESC】
```

**特点：**

1.ASC：升序，DESC：降序，如果不写默认是升序

2.ORDER BY字句中可以支持单个字段、多个字段、表达式、函数、别名

3.ORDER BY字句一般是放再查询语句的最后面，limit字句除外



案例一：查询员工信息，要求工资从高到低排序

```java
SELECT 
  * 
FROM
  employees 
ORDER BY salary DESC ;
```

案例二：查询部门编号>=90的员工信息，按入职信息先后进行排序【添加筛选条件】

```java
SELECT 
  * 
FROM
  employees 
WHERE department_id >= 90 
ORDER BY hiredate ASC ;
```

案例三：按年薪的高低显示员工的信息和 年薪【按表达式排序】

```java
SELECT 
  *,
  salary * 12 * (1+ IFNULL(commission_pct, 0)) AS 年薪 
FROM
  employees 
ORDER BY salary * 12 * (1+ IFNULL(commission_pct, 0)) DESC ;
```

案例四：按年薪的高低显示员工的信息和 年薪【按别名排序】

```java
SELECT 
  *,
  salary * 12 * (1+ IFNULL(commission_pct, 0)) AS 年薪 
FROM
  employees 
ORDER BY 年薪 DESC ;
```

案例五：按姓名的长度显示员工的姓名和工资【按函数排序】

```java
SELECT 
  LENGTH(last_name) 字节长度,
  last_name,
  salary 
FROM
  employees 
ORDER BY LENGTH(last_name) DESC ;
```

案例6：查询员工信息，要求先按工资升序排序，再按员工编号降序排序【按多个字段排序】

```java
SELECT 
  * 
FROM
  employees 
ORDER BY salary ASC,
  employee_id DESC ;
```

---------

### 3.4常见函数

**概念：**

类似于java的方法，将一组逻辑语句封装在方法体中，对外暴露方法名。

**好处：**

* 隐藏了实现细节
* 提高代码的重用性

**调用：**

SECLET 函数名(实参列表) 【from表】;

**特点：**

* 叫什么(函数名)
* 干什么(函数功能)

**分类：**

* 单行函数

如concat、length、ifnull等

* 分组函数

做统计使用，又称为统计函数、聚合函数、组函数

**单行函数：**

**1.字符函数**

* **length**

  获取参数值的字节个数

```java
SELECT LENGTH('joho');
SELECT LENGTH('数据库MySQL');

SHOW VARIABLES LIKE '%char%'
```

* **conact**

  拼接字符串

```java
SELECT CONCAT(last_name,'_',first_name) 姓名
FROM
employees;
```

* **upper(大写)、lower(小写)**

```java
SELECT UPPER('john');
SELECT LOWER('john');
SELECT LOWER('JOHN');
```

案例一：将姓变大写，名变小写，然后拼接

```java
SELECT 
  CONCAT(
    UPPER(last_name),
    '_',
    LOWER(first_name)
  ) AS 姓名 
FROM
  employees ;
```

* **substr、substring**

  截取字符串

> 注意：索引从1开始

```java
#截取从指定索引处后面所有的字符
SELECT SUBSTR('罗密欧与朱丽叶',5) out_put;#朱丽叶
#截取从指定索引处指定字符长度的字符
SELECT SUBSTR('罗密欧与朱丽叶',1,3(截几位)) out_put;#罗密欧
```

案例一：姓名中首字符大写，其他字符小写，然后用_拼接显示出来

```java
SELECT 
  CONCAT(
    UPPER(SUBSTR(last_name, 1, 1)),
    '_',
    LOWER(SUBSTR(last_name, 2))
  ) AS 姓名 
FROM
  employees ;
```

* **instr**

  返回字符串中子字符串第一次出现的位置。如果在`str`中找不到子字符串，则`INSTR()`函数返回零(`0`)。

```java
SELECT INSTR('罗密欧与朱丽叶','朱');#5
```

* **trim**

除掉一个字串中的字头或字尾

```java
SELECT LENGTH(TRIM('     张翠山     ') ) As out_put;
#张翠山
SELECT TRIM ('a' FROM 'aaaaaaaa张aaaaaaaaaaaa翠山aaaaaaaaaaaaaaaa8aaaaaaaaaaaaaaaaaaa ') AS out_put;
#张aaaaaaaaaaaa翠山
```

* **lpad**

用指定的字符实现左填充指定长度

```java
SELECT LPAD('拉姆达',10,'*') 
AS out_put;
#out_put
#*******拉姆达
SELECT LPAD('拉姆达',2,'*') 
AS out_put;
#out_put
#拉姆  从右边截断
```

* **rpad**

用指定的字符实现右填充指定长度

```java
SELECT RPAD('拉姆达',10,'ab') 
AS out_put;
#out_put
#拉姆达abababa
```

* **replace**

替换

```java
SELECT REPLACE('JAVA与MyAQL','MyAQL','JS') AS out_put;
#JAVA与JS  
SELECT REPLACE('MyAQL与JAVA与MyAQL','MyAQL','JS') AS out_put;
#JS与JAVA与JS  全部替换
```

**2.数学函数**

* **round**

四舍五入

```java
SELECT ROUND(1.65);#2
SELECT ROUND(-1.65);#-2
SELECT ROUND(1.567，2);#1.57
```

* **ceil**

向上取整，返回>=该参数的最小整数

```java
SELECT CEIL(1.001);#2
SELECT CEIL(-1.001);#-1
```

* **floor**

向下取整，返回<=该参数的最大整数

```java
SELECT CEIL(9.99);#9
SELECT CEIL(-9.99);#-10
```

* **truncate**

截断

```java
SELECT TRUNCATE(1.65,1);#1.6
```

* **mod**

取余

```java
SELECT MOD(10,3);#1
SELECT MOD(-10,-3);#-1
#被除数为正结果为正，若为负，结果为负
#相当于
SELECT 10%3;
```

MOD(a,b)：a-a/b*b;

**3.日期函数**

* **now**

返回当前系统日期+时间

```java
SELECT NOW();
#now
#2021-08-25 17:49:07
```

* **curdate**

返回当前系统日期，不包含时间

```java
SELECT CURDATE();
```

* **curtime**

返回当前时间，不包含日期

```java
SELECT CURTIME();
```

* 可以获取指定的部分，年、月、日、小时、分钟、秒

```java
SELECT YEAR(NOW()) 年;
SELECT YEAR(hiredate) 年 FROM employees;

SELECT MONTH(NOW()) 月;
#英文
SELECT MONTHNAME(NOW()) 月; #August
```

* **str_to_date**

将日期格式的字符转换成指定格式的日期

```java
SELECT
STR_TO_DATE('13-9-1999','%d-%m-%y');
#1999-9-13
```

* **date_format**

将日期转换成字符

```java
SELECT
DATE_FORMAT('2018/6/6','%Y年%m月%d日');
#2018年6月6日
```

<img src="https://tonkyshan.cn/img/202203021321186.png" alt="20210826113850" style="zoom:80%;" />

案例一：查询有奖金的员工名和入职日期(xx月/xx日 xx年)

```java
SELECT 
  last_name,
  DATE_FORMAT(hiredate, '%m月/%d日 %y年') 入职日期 
FROM
  employees 
WHERE commission_pct IS NOT NULL ;
```

**4.其他函数**

*  **version**

版本号

```java
SELECT VERSION();
```

* **database**

查看当前数据库

```java
SELECT DATABASE();
```

* **user**

查询当前用户

```java
SELECT USER();
```

**5.流程控制函数**

* **if函数**

if else的效果

```java
SELECT
IF('10>5','大','小');#大
```

* **case函数**

使用一：类似switch case 的效果

语法：

```java
CASE 要判断的字段或表达式
WHEN 常量1 THEN 要显示的值1或语句1;#值不用加分号
WHEN 常量2 THEN 要显示的值2或语句2;
...
ELSE 要显示的值n或语句n;
END
```

案例一：查询员工的工资，要求

部门号=30，显示的工资为1.1倍

部门号=40，显示的工资为1.2倍

部门号=50，显示的工资为1.3倍

其他部门，显示的工资为原工资

```java
SELECT salary 原始工资,department_id,
CASE department_id
WHEN 30 THEN salary*1.1
WHEN 40 THEN salary*1.2
WHEN 50 THEN salary*1.3
ELSE salary
END AS 新工资
FROM
employees;
```

使用二：类似 多重if

语法：

```java
CASE 
WHEN 条件一 THEN 要显示的值1或语句1
WHEN 条件一 THEN 要显示的值1或语句1
...
ELSE 要显示的值n或语句n
END
```

案例一：查询员工的工资的情况

如果工资>20000，显示A级别

如果工资>15000，显示B级别

如果工资>10000，显示C级别

否则显示D级别

```java
SELECT 
  salary,
  CASE
    WHEN salary > 20000 
    THEN 'A' 
    WHEN salary > 15000 
    THEN 'B' 
    WHEN salary > 10000 
    THEN 'C' 
    ELSE 'D' 
  END AS 工资级别 
FROM
  employees ;
```

--------

### 3.5分组函数

功能：用作统计使用，又称为聚合函数、统计函数、组函数

分类：sum求和、avg平均值、max最大值、min最小值、count计算个数

1.简单使用：

```java
#sum
SELECT SUM(salary)
FROM employees;
#avg
SELECT AVG(salary)
FROM employees;
#max
SELECT MAX(salary)
FROM employees;
#min
SELECT MIN(salary)
FROM employees;
#count
SELECT COUNT(salary)
FROM employees;
#一起查询
SELECT SUM(salary)  和,AVG(salary)  平均值,MAX(salary)  最大值,MIN(salary)  最小值,COUNT(salary)  个数
FROM employees;
```

特点：

2.参数支持哪些类型

* sum、avg一般用于处理数值型
* max、min、count可以处理任何类型

3.是否忽略null值

以上分组函数都忽略nll值

3.可以和distinct搭配实现去重的运算

```java
SELECT SUM(DISTINCT salary),SUM(salary) 
FROM employees;

SELECT COUNT(DISTINCT salary),COUNT(salary)
FROM employees;
```

4.count函数单独介绍

一般用`COUNT(*)`统计行数

```java
SELECT COUNT(salary)
FROM employees;
#统计行数
SELECT COUNT(*)
FROM employees;
#插入一列1，查看行数
SELECT COUNT(1)
FROM employees;
```

效率：

MYISAM存储引擎下，`COUNT(*)`的效率高

INNODB存储引擎下，`COUNT(*)`和`COUNT(*)`的效率差不多，比`COUNT(字段)`要高一些。

6.和分组函数一同查询的字段有限制

```java
SELECT AVG(salary),employee_id
FROM employees;
```

`AVG()`查询完是一个表格，而employee_id是107个但是只能显示出一个。

> tips：和分组函数一同查询的字段要求是group by后的字段

7.**DATEDIFF函数**

计算日期差

```java
SELECT DATEDIFF('2017-10-1','2017-9-29')
#2
```

--------

### 3.6分组查询

语法：

```java
SELECT 分组函数,列(要求出现在group by的后面)
FROM 表
【WHERE 筛选条件】
GROUP BY 分组的列表
【ORDER BY 字句】
```

> tips：查询列表比较特殊，要求是分组函数和group by后面出现的字段

特点：

1.分组查询中的筛选条件分两类

|            | 数据源         | 位置               | 关键字 |
| ---------- | -------------- | ------------------ | ------ |
| 分组前筛选 | 原始表         | group by字句的前面 | WHERE  |
| 分组后筛选 | 分组后的结果集 | group by字句的后面 | HAVING |

* 分组函数分组函数做条件肯定是放在having字句中
* 能用分组前筛选的尽量用分组前筛选

2.group by字句支持单个字段分组，多个字段分组(多个字段之间用逗号隔开没有顺序要求)，表达式或函数(用的较少)

3.也可以添加排序(排序放在整个分组查询的最后)

**1.添加分组前筛选**

简单的分组查询：

案例一：查询每个工种的最高工资

```java
SELECT MAX(salary),job_id
FROM
employees
GROUP BY job_id;
```

案例二：查询每个位置上的部门个数

```java
SELECT
COUNT(*),location_id
FROM
departments
GROUP BY location_id;
```

添加筛选条件：

案例一：查询邮箱中包含a字符的，每个部门的平均工资

```java
SELECT AVG(salary),department_id
FROM
employees
WHERE
email LIKE '%a%'
GROUP BY department_id;
```

案例二：查询有奖金的每个领导手下员工的最高工资

```java
SELECT AVG(salary),department_id
FROM
employees
WHERE
email LIKE '%a%'
GROUP BY department_id;
```

**2.添加分组后筛选**

添加复杂的筛选条件

案例一：查询哪个部门的员工个数>2

* 查询每个部门的员工个数

```java
SELECT COUNT(*),department_id
FROM employees
GROUP BY department_id;
```

* 根据Ⅰ的结果进行筛选，查询哪个部门的员工数>2

```java
SELECT COUNT(*),department_id
FROM employees
GROUP BY department_id
HAVING COUNT(*)>2;
```

案例二：查询每个工种有奖金的员工的最高工资>12000的工种编号和最高工资

```java
SELECT MAX(salary),job_id
FROM
employees
WHERE
commission_pct IS NOT NULL
GROUP BY job_id
HAVING MAX(salary)>12000;
```

案例三：查询领导编号>102的，最低工资>5000的领导的编号是哪个，及其最低工资

```java
SELECT MIN(salary),manager_id
FROM
employees
WHERE
manager_id>102
GROUP BY 
manager_id
HAVING
MIN(salary)>5000;
```

**3.按表达式或函数分组**

案例一：按员工姓名的长度分组，查询每一组的员工个数，筛选员工个数>5的有哪些

```java
SELECT COUNT(*),LENGTH(last_name)
FROM
employees
GROUP BY 
LENGTH(last_name)
HAVING 
COUNT(*)>5;
```

**4.按多个字段分组**

案例一：查询每个部门每个工种的员工的平均工资

```java
SELECT AVG(salary),department_id,job_id
FROM
employees
GROUP BY department_id,job_id;
```

**5.添加排序**

案例一：查询每个部门每个工种的员工的平均工资，并且按平均工资的高低显示

```java
SELECT AVG(salary),department_id,job_id
FROM
employees
GROUP BY department_id,job_id
ORDER BY AVG(salary) DESC;
```

------

### 3.7连接查询

含义：又称多表查询，当查询的字段来自于多个表时，就会用到连接查询

笛卡尔乘积现象：表1 有m行 ，表2 有n行 ，结果=m*n行

* 发生原因：没有有效的连接条件
* 如何避免：添加有效的连接条件

分类：

1.按年代分类

* sql192标准：仅仅支持内连接
* sql199标准【推荐】：支持内连接+外连接(左外和右外)+交叉连接

2.按功能分类

* 内连接：等值连接、非等值连接、自连接
* 外连接：左外连接、右外连接、全外连接
* 交叉连接

<img src="https://tonkyshan.cn/img/202203021318147.png" alt="20210830112023" style="zoom:80%;" />

**一.sql192标准**

**1.等值连接**

* 多表等值连接的结果为多表的交集部分
* n表连接，至少需要n-1个连接条件
* 多表的顺序没有要求
* 一般需要为表起别名
* 可以搭配前面介绍的所有字句使用，比如排序、分组、筛选

案例一：查询男女对应的名字

```java
SELECT NAME,boyname
FROM
boys,beauty
WHERE beauty.boyfriend_id=boys.id;
```

案例二：查询员工名和对应的部门名

```java
SELECT last_name,department_name
FROM
departments,employees
WHERE
departments.`department_id`=employees.`department_id`;
```

为表起别名：

案例一：查询员工名、工种号、工种名

* 提高语句的简洁度
* 区分多个重名的字段

```java
SELECT last_name,e.`job_id`,job_title
FROM employees e,jobs j
WHERE e.`job_id`=j.`job_id`;
```

> tips：如果为表起了别名，则查询的字段就不能使用原来的表名去限定
>
> 两个表的顺序是可以调换的

加筛选：

案例一：查询有奖金的员工名、部门名

```java
SELECT last_name,department_name
FROM
departments,employees
WHERE
departments.`department_id`=employees.`department_id`
AND
commission_pct IS NOT NULL;
```

案例二：查询城市名中第二个字符为o的部门名和城市名

```java
SELECT
department_name,city
FROM
departments d,locations l
WHERE
d.`location_id`=l.`location_id`
AND
city LIKE '_o%';
```

加分组：

案例一：查询每个城市的部门个数

```java
SELECT
COUNT(*) 个数,city
FROM
departments d,locations l
WHERE
d.`location_id`=l.`location_id`
GROUP BY city;
```

案例二：查询有奖金的每个部门的部门名和部门的领导编号和该部门的最低工资

```java
SELECT
department_name,d.manager_id,MIN(salary)
FROM
departments d,employees e
WHERE 
d.`department_id`=e.`department_id`
AND commission_pct IS NOT NULL
GROUP BY department_name,d.manager_id;
```

加排序：

案例一：查询每个工种的工种名和员工的个数，并且按员工个数降序

```java
SELECT job_title,COUNT(*) 员工个数
FROM employees e,jobs j
WHERE
e.`job_id`=j.`job_id`
GROUP BY job_title
ORDER BY COUNT(*) DESC;
```

三表连接：

案例一：查询员工名、部门名和所在的城市

```java
SELECT
last_name,department_name,city
FROM
employees e,departments d,locations l
WHERE
e.`department_id`=d.`department_id`
AND
d.`location_id`=l.`location_id`;
```

**2.非等值连接**

案例一：查询员工的工资和工资级别

```java
SELECT salary,grade_level
FROM employees e,job_grades j
WHERE salary BETWEEN j.iowest_sal AND j.highest_sal;
```

**3.自连接**

案例一：查询员工名和上级的名称

```java
SELECT e.employee_id,e.last_name,m.last_name,m.employee_id
FROM employees e,employees m
WHERE e.`manager_id`=m.`employee_id`;
```

**二.sql199标准**

语法：

```java
SELECT 查询列表
FROM 表1 别名 【连接类型】
JOIN 表2 别名
ON 连接条件
【WHERE 筛选条件】
【GROUP BY 分组】
【HAVING 筛选条件】
【ORDER BY 排序列表】
```

**1.内连接**

连接类型：inner

```java
SELECT 查询列表
FROM 表1 别名
INNER JOIN 表2 别名
ON 连接条件;
```

分类：

**1.等值连接**

特点：

* 可以添加排序、分组、筛选
* inner可以省略
* 筛选条件放在where的后面，连接条件放在on后面，提高分离性，便于阅读
* inner join 连接和sql192语法中的等值连接效果是一样的，都是查询多表的交集

案例一：查询员工名、部门名

```java
SELECT last_name,department_name
FROM
employees e
INNER JOIN departments d
ON e.`department_id`=d.`department_id`;
```

案例二：查询名字中包含e的员工名和工种名(加筛选)

```java
SELECT last_name,job_title
FROM
employees e
INNER JOIN jobs j
ON e.`job_id`=j.`job_id`
WHERE e.`last_name` LIKE '%e%';
```

案例三：查询部门个数>3的城市名和部门个数(分组+筛选)

```java
SELECT COUNT(*) 部门个数,city
FROM
departments d
INNER JOIN locations l
ON d.`location_id`=l.`location_id`
GROUP BY city
HAVING 部门个数>3;
```

案例四：查询部门员工个数>3的部门名和员工个数，并按个数降序(排序)

```java
SELECT COUNT(*) 个数,department_name
FROM
employees e
INNER JOIN departments d
ON e.`department_id`=d.`department_id`
GROUP BY department_name
HAVING COUNT(*)>3
ORDER BY COUNT(*) DESC;
```

案例五：查询员工名、部门名、工种名，并按部门名降序(三表连接)

```java
SELECT last_name,department_name,job_title
FROM employees e
INNER JOIN departments d ON e.`department_id`=d.`department_id`
INNER JOIN jobs j ON e.`job_id`=j.`job_id`
ORDER BY department_name DESC;
```

**2.非等值连接**

案例一：查询员工的工资级别

```java
SELECT salary,grade_level
FROM employees e
JOIN job_grades j
ON e.`salary` BETWEEN j.`iowest_sal` AND j.`highest_sal`;
```

案例二：查询每个工资级别的个数>20的个数，并且按工资级别降序

```java
SELECT COUNT(*) 个数,grade_level
FROM employees e
JOIN job_grades j
ON e.`salary` BETWEEN j.`iowest_sal` AND j.`highest_sal`
GROUP BY grade_level
HAVING COUNT(*)>20
ORDER BY grade_level DESC;
```

**3.自连接**

案例一：查询姓名中包含字符k的员工的名字、上级的名字

```java
SELECT e.last_name,m.last_name
FROM
employees e
JOIN employees m
ON e.`manager_id`=m.`employee_id`
WHERE e.`last_name` LIKE '%k%';
```

**2.外连接**

应用场景：用于查询一个表中有，另一个表没有的记录

**特点：**

1.外连接的查询结果为主表中的所有记录

* 如果从表中有和它匹配的，则显示匹配的值
* 如果从表中没有和它匹配的，则显示null
* 外连接查询结果=内连接查询结果+主表中有而从表中没有的记录

2.左外连接，left join左边的是主表

3.右外连接，right join右边的是主表

4.左外和右外交换两个表的顺序，可以实现同样的效果

5.全外连接=内连接的结果+表1中有但是表2中没有的+表2中有但是表1中没有的

**语法：**

```java
SELECT 查询列表
FROM 表1 别名
LEFT|RIGHT|FULL【OUTER】 JOIN 表2 别名 ON 连接条件
WHERE 筛选条件
GROUP BY 分组条件
HAVING 分组后的筛选
ORDER BY 排序列表
LIMIT 字句
```

--------------------------

* **左外连接**

连接类型：left 【outer】

案例一：查询没有男朋友的女神名

```java
SELECT b.name
FROM beauty b
LEFT OUTER JOIN boys bo
ON  b.`boyfriend_id`=bo.`id`
WHERE bo.`id` IS NULL;
```

案例二：查询哪个部门没有员工(左外连接)

```java
SELECT d.*,e.employee_id
FROM departments d
LEFT OUTER JOIN employees e
ON d.`department_id`=e.`department_id`
WHERE e.`employee_id` IS NULL;
```

* **右外连接**

连接类型：right 【outer】

案例一：查询没有男朋友的女神名

```java
SELECT b.name
FROM boys bo
RIGHT OUTER JOIN beauty b
ON  b.`boyfriend_id`=bo.`id`
WHERE bo.`id` IS NULL;
```

案例二：查询哪个部门没有员工(右外连接)

```java
SELECT d.*,e.employee_id
FROM employees e
LEFT OUTER JOIN departments d
ON d.`department_id`=e.`department_id`
WHERE e.`employee_id` IS NULL;
```

* **全外连接**

连接类型：full 【outer】

语法：

```java
USE girls;
SELECT b.*,bo.*
FROM beauty b
FULL OUTER JOIN boys bo
ON b.`boyfriend_id`=bo.id;
```

**3.交叉连接**

连接类型：cross

```java
SELECT b.*,bo.*
FROM beauty b
CROSS JOIN boys bo;
```

**总结：**

sql192和sql199**PK**

功能：sql支持的较多

可读性：sql199实现连接条件和筛选条件分离，可读性较高

<img src="https://tonkyshan.cn/img/202203021318145.png" alt="20210904174554" style="zoom:67%;" />

<img src="https://tonkyshan.cn/img/202203021318153.png" alt="20210904174652" style="zoom:67%;" />

案例一：查询编号>3的女神的男朋友信息，如果有则列出信息，如果没有，则用null填充

```java
SELECT b.id,b.name,bo.*
FROM beauty b
LEFT OUTER JOIN boys bo
ON b.`boyfriend_id`=bo.`id`
WHERE b.`id`>3;
```

案例二：查询哪个城市没有部门

```java
SELECT city
FROM departments d
RIGHT OUTER JOIN locations l
ON d.`location_id`=l.`location_id`
WHERE d.`department_id` IS NULL;
```

案例三：查询部门名为SAL或IT的员工信息

```java
SELECT e.*,d.department_name,d.department_id
FROM departments d
LEFT OUTER JOIN employees e
ON d.`department_id`=e.`department_id`
WHERE d.`department_name` IN ('SAL','IT');
```

![20210904181727](https://tonkyshan.cn/img/202203021321533.png)

![20210904181736](https://tonkyshan.cn/img/202203021321181.png)

> tips：一个名字但是id不一样

---------------

### 3.8子查询

**含义：**

出现在其他语句内部的`SELECT`语句，称为子查询或内查询。

外部的`SELECT`语句，称为主查询或外查询。

**分类：**

1.按子查询出现的位置分类

* `SELECT`后面

仅仅支持标量子查询

* `FROM`后面

支持表子查询

* `WHERE`或`HAVING`后面(重点)

支持标量子查询(单行)(重点)、列子查询(多行)(重点)、行子查询

* `EXISTS`后面(相关子查询)

支持表子查询

2.按结果集的行列数不同分类

* 标量子查询(结果集只有一行一列)
* 列子查询(结果集有一列多行)
* 行子查询(结果集有一行多列)
* 表子查询(结果集为一般为多行多列)

**一.`WHERE`或`HAVING`后面**

**特点：**

* 子查询放在小括号内
* 子查询一般放在条件的右侧
* 标量子查询，一般搭配着单行操作符使用

`>` `<` `>=` `<=` `=` `<>`

* 列子查询，一般搭配着多行操作符使用

IN、ANY/SOME、ALL

* 子查询的执行优先于主查询执行，主查询的条件用到了子查询的结果

**1.标量子查询(单行子查询)**

*一列一行*

案例一：谁的工资比Abel高？

```java
SELECT * 
FROM employees
WHERE salary>(
	SELECT salary
	FROM employees
	WHERE last_name='Abel'
);
```

案例二：查询`job_id`与141号员工相同，`salary`比143号员工多的员工的姓名、`job_id`和工资

```java
SELECT last_name,job_id,salary
FROM employees
WHERE job_id=(
	SELECT job_id
	FROM employees
	WHERE	employee_id=141
)
AND salary>(
	SELECT salary
	FROM employees
	WHERE employee_id=143
);
```

案例三：返回公司工资最少的员工的`last_name`、`job_id`、`salary`

```java
SELECT last_name,job_id,salary
FROM employees
WHERE	salary=(
	SELECT MIN(salary)
	FROM employees
);
```

案例四：查询最低工资大于50号部门最低工资的部门id和其最低工资

```java
SELECT MIN(salary),department_id
FROM employees
GROUP BY department_id
HAVING MIN(salary)>(
	SELECT MIN(salary)
	FROM employees
	WHERE department_id=50
);
```

非法使用标量子查询

```java
SELECT MIN(salary),department_id
FROM employees
GROUP BY department_id
HAVING MIN(salary)>(
	SELECT salary
	FROM employees
	WHERE department_id=50
);
```

```java
SELECT MIN(salary),department_id
FROM employees
GROUP BY department_id
HAVING MIN(salary)>(
	SELECT MIN(salary)
	FROM employees
	WHERE department_id=250
);
```

**2.列子查询(多行子查询)**

*一列多行*

* 返回多行
* 使用多行比较操作符

![20210906184307](https://tonkyshan.cn/img/202203021318642.png)

案例一：返回`location_id`是1400或1700的部门中的所有员工姓名

```java
SELECT last_name
FROM employees
WHERE department_id IN(
	SELECT DISTINCT department_id
	FROM departments
	WHERE location_id IN(1400,1700)
);
```

或

```java
SELECT last_name
FROM employees
WHERE department_id =ANY(
	SELECT DISTINCT department_id
	FROM departments
	WHERE location_id IN(1400,1700)
);
```

> * IN等价于=ALL
> * NOT IN等价于<>ALL

案例二：返回其它工种中比`job_id`为`IT_PROG`工种任一工资低的员工的员工号、姓名、`job id` 以及`salary`

```java
SELECT last_name,employee_id,job_id,salary
FROM employees
WHERE salary<ANY(
	SELECT salary
	FROM employees
	WHERE job_id='IT_PROG'
)
AND job_id<>'IT_PROG';
```

或

```java
SELECT last_name,employee_id,job_id,salary
FROM employees
WHERE salary<(
	SELECT MAX(salary)
	FROM employees
	WHERE job_id='IT_PROG'
)
AND job_id<>'IT_PROG';
```

案例三：返回其它工种中比`job_id`为`IT_PROG`工种所有工资低的员工的员工号、姓名、`job id` 以及`salary`

```java
SELECT last_name,employee_id,job_id,salary
FROM employees
WHERE salary<ALL(
	SELECT salary
	FROM employees
	WHERE job_id='IT_PROG'
)
AND job_id<>'IT_PROG';
```

或

```java
SELECT last_name,employee_id,job_id,salary
FROM employees
WHERE salary<(
	SELECT MIN(salary)
	FROM employees
	WHERE job_id='IT_PROG'
)
AND job_id<>'IT_PROG';
```

**3.行子查询(多列多行)**

*一行多列或者多行多列*     主要为一行多列

案例一：查询员工编号最小并且工资最高的员工信息

```java
SELECT *
FROM employees
WHERE employee_id=(
	SELECT MIN(employee_id)
	FROM employees
)
AND salary=(
	SELECT MAX(salary)
	FROM employees
);
```

或

```java
SELECT * 
FROM employees
WHERE (employee_id,salary)=(
	SELECT MIN(employee_id),MAX(salary)
	FROM employees
);
```

**二.`SELECT`后面**

* **仅仅支持标量子查询**

案例一：查询每个部门的员工个数

```java
SELECT d.*,(
	SELECT COUNT(*)
	FROM employees e
	WHERE d.`department_id`=e.department_id
) 个数
FROM departments d;
```

案例二：查询员工号=102的部门名

```java
SELECT (
	SELECT department_name
	FROM departments d
	INNER JOIN employees e
	ON d.department_id=e.department_id
	WHERE  e.employee_id=102
) 部门名;
```

**三.`FROM`后面**

**仅仅支持表子查询**

> tips：将子查询结果充当一张表，要求必须起别名

案例一：查询每个部门的平均工资的工资等级

```java
SELECT ag_dep.*,j.`grade_level`
FROM (
	SELECT AVG(salary) ag,department_id
	FROM employees
	GROUP BY department_id
) ag_dep
INNER JOIN job_grades j
ON ag_dep.ag BETWEEN j.`iowest_sal` AND j.`highest_sal`;
```

**四.`EXISTS`后面(相关子查询)**

**仅仅支持表子查询**

exists 布尔类型

语法：

```java
EXISTS(完整的查询语句)
```

结果：1或0

案例一：查询有员工的部门名

```java
#用EXISTS
SELECT department_name
FROM departments d
WHERE EXISTS(
	SELECT *
	FROM employees e
	WHERE e.`department_id`=d.`department_id`
);
```

或

```java
#用IN
SELECT department_name
FROM departments d
WHERE d.`department_id` IN(
	SELECT department_id
	FROM employees
);
```

案例二：查询没有女朋友的男神信息

```java
#IN
SELECT bo.*
FROM boys bo
WHERE bo.`id` NOT IN(
	SELECT boyfriend_id
	FROM beauty
);
```

或

```java
#EXISTS
SELECT bo.*
FROM boys bo
WHERE NOT EXISTS(
	SELECT boyfriend_id
	FROM beauty b
	WHERE bo.`id`=b.`boyfriend_id`
);
```

-------

### 3.9分页查询

* 应用场景： 当要显示的数据，一页显示不全，需要分页提交sql请求
* 语法：

```java
SELECT 	查询列表
FROM 表
【JOIN TYPE JOIN 表2
ON 连接条件
WHERE 筛选条件
GROUP BY 分组字段
HAVING 分组后的筛选
ORDER BY 排序的字段】
LIMIT offset,size;
```

* `offset`：要显示条目的起始索引(起始索引从0开始)
* `size`：要显示的条目个数

特点：

* `LIMIT`语句放在查询语句的最后
* 公式

要显示的页数  page     每页的条目数   size

```java
SELECT 查询列表
FROM 表
LIMIT (page-1)*size,size;
```

案例一：查询前五条员工信息

```java
SELECT *
FROM employees
LIMIT 0,5;
```

案例二：查询第11条——第25条

```java
SELECT *
FROM employees
LIMIT 10,15;
```

案例三：有奖金的员工信息，并且工资较高的前10名显示出来

```java
SELECT *
FROM employees
WHERE commission_pct IS NOT NULL
ORDER BY salary DESC
LIMIT 0,10;
```

--------

## 3.10union联合查询

关键字：**UNION** 联合 合并 ：将多条查询语句的结果合并成一个结果

语法：

```java
查询语句1
UNION
查询语句2
UNION
...
```

应用场景：要查询的结果来自于多个表，且多个表没有直接的连接关系，但查询的信息一致时，一般用联合查询。

特点：

* 要求多条查询语句的查询列数是一致的
* 要求多条查询语句查询的每一列的类型和顺序最好一致
* UNION关键字默认去重，如果使用UNION ALL可以包含重复项 

案例一：查询部门编号大于90或者邮箱包含a的员工信息

```java
SELECT *
FROM
employees
WHERE email LIKE '%a%'
OR department_id>90 ;
```

```java
SELECT * FROM employees WHERE email LIKE '%a%'
UNION
SELECT * FROM employees WHERE department_id>90;
```

----------

## 第四章	DML语言

--------

**数据操纵语言**

### 4.1插入语言

**INSERT**

**方式一：经典的插入**

语法：

```java
INSERT INTO 表名(列名,...) VALUES(值1,...)
```

1.插入的值的类型要与列的类型一致或兼容

```java
INSERT INTO beauty(id,NAME,sex,borndate,phone,photo,boyfriend_id)
VALUE(13,'唐艺昕','女','1990-4-23','18988888888',NULL,2);
```

2.不可以为null的列必须插入值，可以为null的列如何插入值？

方式一：

```java
INSERT INTO beauty(id,NAME,sex,borndate,phone,photo,boyfriend_id)
VALUE(13,'唐艺昕','女','1990-4-23','18988888888',NULL,2);
```

方式二：

```java
INSERT INTO beauty(id,NAME,sex,borndate,phone,boyfriend_id)
VALUE(14,'金星','女','1980-4-13','18988888888',9);
```

3.列的顺序是否可以调换

```java
INSERT INTO beauty(NAME,sex,id,phone)
VALUE('蒋欣','女',15,'18988588888');
```

可以调换

4.列数和值的个数必须一致

```java
INSERT INTO beauty(NAME,sex,id,phone)
VALUE('蒋欣','女',15,'18988588888');
```

5.可以省略列名，默认所有列，而且列的顺序和表中列的顺序一致

```java
INSERT INTO beauty
VALUES(18,'张飞','男',NULL,'119',NULL,NULL);
```

**方式二：**

语法：

```java
INSERT INTO 表名
SET 列名=值,列名=值,...
```

案例一：插入数据

```java
INSERT INTO beauty
SET id=19,NAME='刘涛',phone='999';
```

**两种方式进行比较**

1.方式一：支持插入多行

```java
INSERT INTO beauty(id,NAME,sex,borndate,phone,photo,boyfriend_id)
VALUE(13,'唐艺昕','女','1990-4-23','18988888888',NULL,2),
(14,'唐艺昕','女','1990-4-23','18988888888',NULL,2),
(15,'唐艺昕','女','1990-4-23','18988888888',NULL,2);
```

2.方式一：支持子查询

```java
INSERT INTO beauty(id,NAME,phone)
SELECT id,boyname,'11809866'
FROM boys 
WHERE id<3;
```

--------

### 4.2修改语句

**UPDATE**

**1.修改单表的记录**

```java
UPDATE 表名#1
SET 列=新值,列=新值,...#2
WHERE 筛选条件;#3
#执行顺序132
```

案例一：修改beauty表中姓唐的电话为13899889999

```java
UPDATE beauty
SET phone='13899889999'
WHERE NAME LIKE '唐%';
```

案例二：修改boys表中id号为2的名称为张飞，魅力值1000

```java
UPDATE boys
SET boyName='张飞',userCP=1000
WHERE id=2;
```

**2.修改多表的记录(级联更新)**

语法：

sql192语法：

```java
UPDATE 表1 别名,表2 别名
SET 列=值,...
WHERE 连接条件
AND 筛选条件;
```

sql199语法：

```java
UPDATE 表1 别名
INNER|LEFT|RIGHT JOIN 表2 别名
ON 连接条件
SET 列=值
WHERE 筛选条件;
```

案例一：修改张无忌女朋友的手机号为114

```java
UPDATE boys bo
INNER JOIN beauty b
ON bo.`id`=b.`boyfriend_id`
SET phone=114
WHERE boyName='张无忌';
```

案例二：修改没有男朋友的女神的男朋友编号都为2号

```java
UPDATE boys bo
RIGHT JOIN beauty b
ON bo.`id`=b.`boyfriend_id`
SET boyfriend_id=2
WHERE b.`boyfriend_id` IS NULL;
```

-------

### 4.3删除语句

**DELETE**

**1.单表的删除**

方式一：**DELETE**

语法：

```java
DELETE 
FROM 表名 
【WHERE 筛选条件】
【LIMIT 条目数】 
```

案例：删除一条

```java
DELETE
FROM beauty
WHERE boyfriend_id=4
LIMIT 1;
```

案例一：删除手机号以9结尾的女神信息

```java
DELETE 
FROM beauty b
WHERE phone LIKE '%9';
```

方式二：**TRUNCATE语句**

* 不允许加WHERE语句
* 删除表中全部数据

案例二：将魅力值>100的男神的信息删除

```java
#不允许筛选，全部删除
```

**2.多表的删除(级联删除)**

方式一：**DELETE**

语法：

sql192语法：

```java
DELETE 表1的别名，表2的别名#删除哪个表写哪个表
FROM 表1 别名,表2 别名
WHERE 连接条件
AND 筛选条件;
```

sql199语法：

```java
DELETE 表1的别名，表2的别名
FROM 表1 别名
INNER|LEFT|RIGHT JOIN 表2 别名 
ON 连接条件
WHERE 筛选条件;
```

案例一：删除张无忌的女朋友的信息

```java
DELETE b
FROM boys bo
JOIN beauty b
ON bo.`id`=b.`boyfriend_id`
WHERE boyName='张无忌';
```

案例二：删除黄晓明的信息以及他女朋友的信息

```java
DELETE b,bo
FROM boys bo
RIGHT JOIN beauty b
ON bo.`id`=b.`boyfriend_id`
WHERE boyName='黄晓明';
```

**DELETE**和**TRUNCATE** 比较：(**面试题**)

1.delete可以加`WHERE`条件,`TRUNCATE`不能加

2.`TRUNCATE`删除，效率高一点

3.加入要删除表中有自增长列，如果用delete删除后，再插入数据，自增长列从断点开始，而truncate删除后，再插入数据，自增长列的值从1开始

4.truncate删除，没有返回值，delete删除，有返回值

5.truncate删除，不能回滚，delete删除，可以回滚

-----------

## 第五章	DDL语言

-------

**数据定义语言**

### 5.1库和表的管理

----------

* **创建：`CREATE`**
* **修改：`ALTER`**
* **删除：`DROP`**

**一.库的管理**

**1.库的创建**

语法：

```java
CREATE DATABASE 【IF NOT EXISTS】库名;#容错性处理
```

案例一：创建数据库Books

```java
CREATE DATABASE IF NOT EXISTS Books;
```

**2.库的修改**    ~~啥用都没有~~

```java
RENAME DATABASE Books TO 新库名;#已经不能使用了
```

想改的话在文件夹data里面直接改文件夹名称

**更改库的字符集**

```java
ALTER DATABASE Books CHARACTER SET gbk;
```

**3.库的删除**

```java
DROP DATABASE IF EXISTS Books;#容错性处理
```

**二.表的管理**

**1.表的创建**

语法：

```java
CREATE TABLE 表名(
          列名 列的类型 【(长度) 约束】,
          列名 列的类型 【(长度) 约束】,
          列名 列的类型 【(长度) 约束】,
          ...
          列名 列的类型 【(长度) 约束】
);
```

案例一：创建表Book

```java
CREATE TABLE Book(
         id INT,#编号
         bName VARCHAR(20),#图书名
         price DOUBLE,#价格
         authorID INT(20),#作者编号
         publishDate DATETIME#出版日期    
);
```

案例二：创建表author

```java
CREATE TABLE IF NOT EXISTS author(
          id INT,
          au_name VARCHAR(20),
          nation VARCHAR(10)
);
```

**2.表的修改**

语法：

```java
ALTER TABLE 表名 ADD|DROP|MODIFY|CHANGE COLUMN 列名 【列类型 约束】;
```

* 修改列名

```java
ALTER TABLE book CHANGE COLUMN publishDate pubDate DATETIME;
```

> tips：`COLUMN`可以省略

* 修改列的类型和约束

```java
ALTER TABLE book MODIFY COLUMN pubDate TIMESTAMP;
```

* 添加新列

```java
ALTER TABLE author ADD COLUMN annual DOUBLE;
```

* 删除列

```java
ALTER TABLE author DROP COLUMN annual;
```

* 修改表名

```java
ALTER TABLE author RENAME TO book_author;
```

**3.表的删除**

语法：

```java
DROP TABLE IF EXISTS book_author;
```

**通用的写法**

```java
DROP DATABASE IF EXISTS 旧库名;
CREATE DATABASE 新库名;

DROP TABLE IF EXISTS 旧表名;
CREATE TABLE 新表名();
```

**4.表的复制**

**1.仅复制表的结构**

```java
CREATE TABLE author LIKE book_author;
```

**2.复制表的结构和数据**

```java
CREATE TABLE copytwo
SELECT * FROM book_author;
```

**3.只复制部分结构**

```java
CREATE TABLE copythree
SELECT id,au_name
FROM book_author
WHERE 1=0;#恒不成立
```

**4.只复制部分数据**

```java
CREATE TABLE copyfour
SELECT id,au_name
FEOM book_author
WHERE nation='中国';
```

---

### 5.2常见数据类型介绍

**数值型：**

* 整型

![20210915215236](https://tonkyshan.cn/img/202203021318221.png)

分类：tinyint、smallint、mediumint、int/integer、bigint

​             1            2                 3                  4                8   

特点：

* 如果不设置无符号还是有符号，默认是有符号，如果想设置无符号，需要添加unsigned
* 如果插入的数值超出了整型的范围，会报out of range异常，并且插入失败(新版本)，5的话插入临界值
* 如果不设置长度，会有默认的长度

长度代表了显示的最大宽度，如果不够会用0在左边填充，但必须搭配** `ZEROFILL`**使用。

1.如何设置无符号和有符号

```java
CREATE TABLE tab_int(
	t1 INT,
	t2 INT UNSIGNED
);

DESC tab_int;

INSERT INTO tab_int VALUE(-123456,-123456);#无符号范围0~4294967295

SELECT * FROM tab_int;
```

* 小数

![20210916211328](https://tonkyshan.cn/img/202203021318228.png)

特点：

* M：整数部分+小数部分     D：小数部分。如果超出范围，则插入临界值
* M和D都可以省略

如果是`decimal(M,D)`，则M默认为10，D默认为0

如果是 `float(M,D)`**和** `double(M,D)`，则会根据插入的数值的精度来决定精度

* 定点型的精确度较高，如果要求插入数值的精度较高如货币运算等则考虑使用

原则：所选择的类型越简单越好，能保存数值的类型越小越好

分类：

1.浮点型

* `float(M,D)`
* `double(M,D)`

2.定点型

* `decimal(M,D)`

**字符型：**

1.较短的文本：

* `char(M)`
* `varchar(M)`

![20210917092411](https://tonkyshan.cn/img/202203021321679.png)

特点：

​                        特点                            空间的耗费             效率                     M的意思

char           固定长度的字符               比较耗费                  高             最大的字符数，可以省略，默认为1

varchar      可变长度的字符               比较节省                  低             最大的字符数，不可以省略

**位类型**

![20210917094843](https://tonkyshan.cn/img/202203021318227.png)

**binary和varbinary类型**

用于保存较短的二进制

说明：类似于char和varchar，不同的是他们包含二进制字符串而不包含非二进制字符串。

**Enum类型**

用于保存枚举

说明：又称枚举类型，要求插入的值必须属于列表中指定的值之一。

**Set类型**

用于保存集合

说明：和Enum类型类似，里面可以保存0~64个成员。和Enum类型最大的区别是：Set类型一次可以选取多个成员，而Enum只能选一个，根据成员个数不同，存储所占的字节也不同。

![20210919111952](https://tonkyshan.cn/img/202203021318240.png)

2.较长的文本：

* text
* blob(较长的二进制数据)

**日期型：**

![20210919112335](https://tonkyshan.cn/img/202203021321758.png)

分类：

* date只保存日期
* time只保存时间
* year只保存年
* datetime保存日期+时间
* timestamp保存日期+时间

特点：

​                                             字节                             范围                           时区等的影响

datetime                                 8                             1000-9999                            不受

timestamp                              4                             1970-2038                              受

---

### 5.3常见约束

**含义：**一种限制，用于限制表中的数据，为了保证表中的数据的准确和可靠性

**分类：**六大约束

* `NOT NULL`：非空约束，用于保证该字段的值不能为空。比如姓名、学号等
* `DEFAULT`：默认约束，用于保证该字段有默认值。比如性别
* `PRIMARY KEY`：主键约束，用于保证该字段的值具有唯一性，并且非空。比如学号、员工编号等
* `UNIQUE`：唯一约束，用于保证该字段的值具有唯一性，可以为空。比如座位号
* `CHECK`：检查约束【mysql中不支持】(不报错，但是没有效果)。比如年龄、性别
* `FOREIGN KEY`：外键约束，用于限制两个表的关系，用于保证该字段的值必须来自于主表的关联列的值。在从表添加外键约束，用于引用主表中某列的值。比如学生表的专业编号，员工表的部门编号，员工表的工种编号

**添加约束的时机：**

1.创建表时

2.修改表时

**约束的添加分类**

* 列级约束

​           六大约束语法上都支持，但外键约束没有效果

* 表级约束

​           除了非空、默认，其他的都支持

**一、创建表时添加约束**

1.添加列级约束

语法：

直接在字段名和类型后面追加 约束类型即可。

只支持：默认、非空、主键、唯一

```java
CREATE DATABASE students;

CREATE TABLE stuinfo(
	id INT PRIMARY KEY,#主键
	stuName VARCHAR(20) NOT NULL,#非空
	gender CHAR(1) CHECK(gender='男' OR gender='女'),#检查 不报错，但是没有效果
	seat INT UNIQUE,#唯一
	age INT DEFAULT  18,#默认约束
	majorId INT REFERENCES major(id)#外键  无效果
);
CREATE TABLE major(
        id INT PRIMARY KEY,
        majorName VARCHAR(20)
);

DESC stuinfo;
#查看stuinfo中的所有索引，包括主键、外键、唯一
SHOW INDEX FROM stuinfo;
```

2.添加表级约束

**语法：**

在各个字段的最下面

【constraint 约束名】 约束类型(字段名)

```java
DROP TABLE IF EXISTS stuinfo;
CREATE TABLE stuinfo(
	id INT,
	stuname VARCHAR(20),
	gender CHAR(1),
	seat INT,
	age INT,
	majorid INT,
	
	CONSTRAINT pk PRIMARY KEY(id),#主键  （默认名为PRIMARY pk没有效果）
	CONSTRAINT uq UNIQUE(seat),#唯一键
	CONSTRAINT ck CHECK(gender='男' OR gender='女'),#检查
	CONSTRAINT fk_stuinfo_major FOREIGN KEY(majorid) REFERENCES major(id)#外键
);

SHOW INDEX FROM stuinfo;
```

**通用的写法**

```java
CREATE TABLE IF NOT EXISTS stuinfo(
	id INT PRIMARY KEY,
	stuname VARCHAR(20) NOT NULL,
	sex CHAR(1),
	age INT DEFAULT 18,
	seat INT UNIQUE,
	majorid INT,
	CONSTRAINT fk_stuinfo_major FOREIGN KEY(majorid) REFERENCES major(id)
);
```

**二.修改表时添加约束**

1.添加列级约束

```java
ALTER TABLE 表名 MODIFY COLUMN 字段名 字段类型 新约束;
```

2.添加表级约束

```java
ALTER TABLE 表名 ADD 【CONSTRAINT 约束名】 约束类型(字段名) 【外键的引用】;
```

* 添加非空约束

```java
DROP TABLE IF EXISTS stuinfo;
CREATE TABLE stuinfo(
	id INT,
	stuname VARCHAR(20),
	gender CHAR(1),
	seat INT,
	age INT,
	majorid INT
);

#添加非空约束
ALTER TABLE stuinfo MODIFY COLUMN stuname VARCHAR(20) NOT NULL;
```

* 添加默认约束

```java
ALTER TABLE stuinfo MODIFY COLUMN age INT DEFAULT 18;
```

* 添加主键

```java
#列级约束
ALTER TABLE stuinfo MODIFY COLUMN id INT PRIMARY KEY;
#表级约束
ALTER TABLE stuinfo ADD PRIMARY KEY(id);
```

* 添加外键

```java
ALTER TABLE stuinfo ADD CONSTRAINT fk_stuinfo_major FOREIGN KEY(majorid) REFERENCES major(id);
```

**二.修改表时删除约束**

* 删除非空约束

```java
#删除非空约束
ALTER TABLE stuinfo MODIFY COLUMN stuname VARCHAR(20) NULL;
```

* 删除默认约束

```java
ALTER TABLE stuinfo MODIFY COLUMN age INT;
```

* 删除主键

```java
ALTER TABLE stuinfo DROP PRIMARY KEY;
```

* 删除唯一

```java
ALTER TABLE stuinfo DROP INDEX seat;
```

* 删除外键

```java
ALTER TABLE stuinfo DROP FOREIGN KEY fk_stuinfo_major;
```

**三.对比**

**1.主键和唯一**

​                保正唯一性       是否允许为空        一个表中可以有多少个             是否允许组合

主键              √                          ×                            至多有一个                       √，但不推荐

唯一              √                          ×                            可以有多个                       √，但不推荐

组合主键，组合唯一键

```java
PRIMARY KEY(id,stuname)#当id与stuname都相同时，会报错
```

**2.外键的特点**

* 要求在从表设置外键关系
* 从表的外键列的类型和主表的关联列的类型要求一致或兼容
* 主表的关联列必须是一个Key(一般是主键或唯一)
* 插入数据时，先插入主表，再插入从表。删除数据时，先删除从表，再删除主表

**3.列级约束和表级约束**

​                              位置                          支持的约束类型                                 是否可以起约束名

列级约束：       列的后面                 语法都支持，但是外键没有效果                   不可以

表级约束：       所有列的下面          默认和非空不支持，其他支持                       可以(主键没有效果)

**标识列**

又称为自增长列

**含义：**可以不用手动的插入值，系统提供默认的序列值

**特点：**

* 标识列必须和主键搭配吗？不一定，但要求是一个Key
* 一个表可以有几个标识列？至多一个！
* 标识列的类型 只能是数值型
* 标识列可以通过SET auto_increment_increment=3;设置步长，可以通过 手动插入值，设置起始值

**一.创建表时设置标识列**

关键字：** `AUTO_INCREMENT`**

```java
DROP TABLE IF EXISTS tab_indentity;
CREATE TABLE tab_indentity(
	id INT PRIMARY KEY AUTO_INCREMENT,#标识列
	NAME VARCHAR(20)
);

INSERT INTO tab_indentity VALUE(NULL,'join');
SELECT *
FROM tab_indentity;
```

**1.MySQL中起始值永远是1，设置其他值也没有效果，但是步程可以设置**

```java
SHOW VARIABLES LIKE '%AUTO_INCREMENT%';
SET auto_increment_increment=3;
```

![20210926165712](https://tonkyshan.cn/img/202203021318866.png)

**2.设置起始值**

```java
DROP TABLE IF EXISTS tab_indentity;
CREATE TABLE tab_indentity(
	id INT PRIMARY KEY AUTO_INCREMENT,#标识列
	NAME VARCHAR(20)
);
INSERT INTO tab_indentity VALUE(10,'join');
INSERT INTO tab_indentity VALUE(NULL,'join');
SELECT *
FROM tab_indentity;#起始值就为10了
```

**二.修改表时设置标识列**

```java
ALTER TABLE tab_indentity MODIFY COLUMN id INT PRIMARY KEY AUTO_INCREMENT;
```

**三.修改表时删除标识列**

```java
ALTER TABLE tab_indentity MODIFY COLUMN id INT;
```

---------

## 第六章	DCL语言

--------

**数据控制语言**

### 6.1管理用户

------------

**一.添加用户**

* 语法：

```java
CREATE USER '用户名'@'主机名' IDENTIFIED BY '密码';
```

**二.删除用户**

* 语法：

```java
DROP USER '用户名'@'主机名';
```

**三.修改用户密码**

* 语法：

```java
UPDATE USER SET PASSWORD = PASSWORD('新密码')
WHERE USER = '用户名';

SET PASSWORD FOR '用户名'@'主机名' = PASSWORD('新密码');
```

* MySQL中忘记了root用户的密码？

1.cmd - - > net stop mysql     停止mysql服务（需要以管理员身份运行cmd）

2.使用无验证方式启动mysql服务：mysqld --skip-grant-tables

3.打开新的cmd窗口，直接输入mysql命令，敲回车就可以登录成功

4.use mysql

5.update user set password = password('新密码') where user='root';

6.关闭两个窗口

7.打开任务管理器，手动结束mysql.exe进程

8.启动mysql服务

9.使用新密码登录

**四.查询用户**

* 切换到mysql数据库

```java
USE mysql;
```

* 查询user表

```java
SELECT * FROM USER;
```

* 通配符：%表示可以在任意主机使用用户登录数据库

---------

### 6.2权限管理

**一.查询权限**

```java
SHOW GRANTS FOR '用户名'@'主机名';
```

**二.授予权限**

```java
GRANT 权限列表 ON 数据库名.表名 TO '用户名'@'主机名';

GRANT ALL ON *.* TO '用户名'@'主机名';#授予所有的权限
```

**三.撤销权限**

```java
REVOKE 权限列表 ON 数据库.表名 FROM '用户名'@'主机名';
```

-------

## 第七章	TCL语言

------

**事务控制语言(Transaction Control Language)**

### 7.1事务和事务处理

**事务：**一个或一组sql语句组成的一个执行单元，这个执行单元要么全部执行，要么全部不执行。

**MySQL中的存储引擎**

1.概念：在MySQL中的数据用各种不同的技术存储在文件(或内存)中。

2.通过show engines，来查看MySQL支持的存储引擎。

3.在MySQL中用的最多存储引擎有：innodb、myisam、memory等。其中innodb支持事务，而myisam、memory等不支持事务。

**一.事务的ACID属性**

**1.原子性**(Atomicity)

原子性是指事务是一个不可分隔的工作单位，事务中的操作要么都发生，要么都不发生。

**2.一致性**(Consistency)

事务必须使数据库从一个一致性状态变换到另一个一致性状态。

**3.隔离性**(Isolation)

事务的隔离性是指一个事务的执行不能被其他事务干扰，即一个事务内部的操作及使用的数据对并发的其他事务是隔离的，并发执行的各个事务之间不能相互干扰。

**4.持久性**(Durability)

持久性是指一个事务一旦被提交，它对数据库中数据的改变就是永久性的，接下来的其他操作和数据库故障不应该对其有任何影响。

**二.事务的创建**

* **隐式事务：**事务没有明显的开启和结束的标记。比如：INSERT、UPDATE、DELETE语句。

```java
DELETE FROM 表 WHERE id=1;
```

* **显式事务：**事务具有明显的开启和结束的标记。前提：必须先设置自动提交功能为禁用。

```java
SET autocommit=0;#设置自动提交功能为禁用
```

步骤一：开启事务

```java
SET autocommit=0;
START transaction;#可选的
```

步骤二：编写事务中的sql语句(SELECT  INSERT  UPDATE  DELETE)

```java
语句1;
语句2;
...
```

步骤三：结束事务

```java
COMMIT;提交事务
ROLLBACK;回滚事务
SAVEPOINT;节点名,设置保存点
```

**演示事务的使用步骤**

```java
#开启事务
SET autocommit=0;
START TRANSACTION;
#编写一组事务语句
UPDATE account SET balance = 1500 WHERE username='张无忌';
UPDATE account SET balance = 500  WHERE username='赵敏';
#结束事务
COMMIT;#提交
```

```java
#开启事务
SET autocommit=0;
START TRANSACTION;
#编写一组事务语句
UPDATE account SET balance = 1000 WHERE username='张无忌';
UPDATE account SET balance = 1000  WHERE username='赵敏';
#结束事务
ROLLBACK;#回滚

#执行成功后，结果查看为 张无忌1500 赵敏500 不变
```

**事务的并发问题**

![20210928194246](https://tonkyshan.cn/img/202203021319927.png)

![20210928194400](https://tonkyshan.cn/img/202203021321504.png)

**演示事务的隔离级别**

​                                                        脏读                    不可重复读                  幻读

* READ UNCOMMITTED             √                              √                              √ 
* READ COMMITTED                  ×                              √                              √
* REPEATABLE READ                 ×                              ×                              √
* SERIALIZABLE                          ×                              ×                              ×

MySQL中默认 第三个隔离级别 REPEATABLE READ

Oracle中默认 第二个隔离级别 READ COMMITTED 

查看隔离级别

```java
SELECT @@transaction_isolation;
```

设置当前MySQL连接的隔离级别

```java
SET TRANSACTION ISOLATION LEVEL READ COMMITTED;
```

设置数据库系统的全局的隔离级别

```java
SET GLOBAL TRANSACTION ISOLATION LEVEL READ COMMITTED;
```

**演示savepoint的使用**

```java
SET autocommit=0;
START TRANSACTION;
DELETE FROM account WHERE id=25;
SAVEPOINT a;#设置保存点
DELETE FROM account WHERE id=28;
ROLLBACK TO a;#回滚到保存点
```

-----------

## 第八章	视图的讲解

------------

**含义：**虚拟表，和普通表一样使用

MySQL5.1版本出现的新特性，是通过表动态生成的数据

**应用场景**

* 多个地方用到同样的查询结果
* 该查询结果使用的sql语句较复杂

**视图的好处**

* 重用sql语句
* 简化复杂的sql操作，不必知道它的查询细节
* 保护数据，提高安全性

案例一：查询姓张的学生名和专业名

以前：

```java
SELECT stuname,majorname
FROM stuinfo s
INNER JOIN major m
ON s.`majorid`=m.`id`
WHERE s.`stuname` LIKE '张%';
```

通过视图：

```java
CREATE VIEW v1
AS
SELECT stuname,majorname
FROM stuinfo s
INNER JOIN major m
ON s.`majorid`=m.`id`;#通过视图进行封装

SELECT * FROM v1 WHERE stuname LIKE '张%';
```

**一.创建视图**

**语法：**

```java
CREATE VIEW 视图名
AS
查询语句;
```

案例一：查询姓名中包含a字符的员工名、部门名和工种信息

```java
USE myemployees;
#创建
CREATE VIEW myv1
AS 
SELECT last_name,department_name,job_title 
FROM employees e
JOIN departments d
ON e.department_id=d.department_id
JOIN jobs j
ON j.job_id = e.job_id;
#使用
SELECT *
FROM myv1
WHERE last_name LIKE '%a%';
```

案例二：查询各部门的平均工资级别

```java
#创建
CREATE VIEW myv2
AS
SELECT AVG(salary) ag,department_id
FROM employees
GROUP BY department_id;
#使用
SELECT myv2.`ag`,g.grade_level
FROM myv2
JOIN job_grades g
ON myv2.`ag` BETWEEN g.`iowest_sal` AND g.`highest_sal`;
```

案例三：查询平均工资最低的部门的信息

```java
SELECT * FROM myv2 ORDER BY ag LIMIT 1;
```

案例四：查询平均工资最低的部门名和工资

```java
CREATE VIEW myv3
AS
SELECT *
FROM myv2 ORDER BY ag LIMIT 1;

SELECT d.*,m.ag
FROM myv3 m
JOIN departments d
ON m.`department_id`=d.`department_id`;
```

**二.视图的修改**

方式一：

```java
CREATE OR REPLACE VIEW 
AS
查询语句;
```

方式二：

```java
ALTER VIEW 视图名
AS
查询语句;
```

**三.删除视图**

语法：

```java
DROP VIEW 视图名,视图名,...;
```

**四.查看视图**

```java
DESC myv3;

SHOW CREATE VIEW myv3;
```

**五.视图的更新**

```java
CREATE OR REPLACE VIEW myv1
AS
SELECT last_name,email
FROM employees;

SELECT * FROM myv1;
```

> tips：对视图进行更新时，原始表也会进行更新

1.插入

```java
INSERT INTO MYV1 VALUE('张飞','zf@qq.com');
```

2.修改

```java
UPDATE myv1 SET last_name='张无忌' WHERE last_name='张飞';
```

3.删除

```java
DELETE FROM myv1 WHERE last_name='张无忌';
```

4.具备以下特点的视图不能更新

* 包含以下关键字的sql语句:分组函数、distinct、group by、having、union或者union all
* 常量视图
* Select中也含子查询
* join
* from—个不能更新的视图
* where子句的子查询引用了from子句中的表

**六.视图与表的对比**

​                                      创建语法的关键字                          是否实际占用物理空间                          使用

视图                                  create view                                  只是保存了sql逻辑                 增删改查，一般不能增删改

表                                      create table                                       保存了数据                                   增删改查

**七.delete和truncate在事务使用时的区别**

1.演示delete

```java
SET autocommit=0;
START TRANSACTION;
DELETE FROM account;
ROLLBACK;
```

2.演示truncate

```java
SET autocommit=0;
START TRANSACTION;
TRUNCATE TABLE account;
ROLLBACK;
```

> delete支持回滚，truncate不支持回滚
