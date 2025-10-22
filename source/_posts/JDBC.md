---
title: JDBC
date: 2022-01-29 9:34:14
tags: [MySQL,java,JDBC]
categories: [数据库,java]
---

## JDBC

-----------------

## 第一章  JDBC简介

-----------

### 1.1概念

* 概念：Java DataBase Connectivity   Java 数据库连接  Java语言操作数据库
* JDBC本质：其实是官方(SUN公司)定义的一套操作所有关系型数据库的规则，即接口。各个数据库厂商去实现这套接口，提供数据库驱动jar包。我们可以使用这套接口(JDBC)编程，真正执行的代码是驱动jar包中的实现类。

-----

### 1.2步骤

1.导入驱动jar包

* 复制jar包到项目的libs目录下
* 右键-->Add As Library

2.注册驱动

3.获取数据库连接对象Connection

4.定义sql

5.获取执行sql语句的对象 Statement

6.执行sql，接受返回结果

7.处理结果

8.释放资源

--------

### 1.3代码实现

```java
package com.priv.demo01JDBC;

import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.Statement;

public class Demo01JDBC {
    public static void main(String[] args) throws Exception {
        //1.导入驱动jar包
        // 2.注册驱动
        Class.forName("com.mysql.cj.jdbc.Driver");
        //3.获取数据库连接对象Connection
        Connection connection = DriverManager.getConnection("jdbc:mysql://localhost:3306/students", "root", "填自己的数据库密码");
        //4.定义sql
        String sql="update account set balance=500 where username='张无忌'";
        //5.获取执行sql语句的对象 Statement
        Statement statement = connection.createStatement();
        //6.执行sql，接受返回结果
        int i = statement.executeUpdate(sql);
        //7.处理结果
        System.out.println(i);
        //8.释放资源
        statement.close();
        connection.close();
    }
}
```

**结果**

![20211001181141](https://tonkyshan.cn/img/202203021329399.png)

----------

## 第二章  详解各个对象

----------

### 2.1DriverManager

**驱动管理对象**

**1.功能**

* 注册驱动：告诉程序该使用哪一个数据库驱动jar

** `static void registerDriver(Driver driver)`：**注册与给定的驱动程序 DriverManager 

写代码使用:class.forName( "com.mysql.jdbc.Driver" );

通过查看源码发现:在com.mysql.jdbc.Driver类中存在静态代码块

```java
static {
     try {
        java.sql.DriverManager.registerDriver(new Driver());
     } catch (sQLException E) {
throw new RuntimeException( "can't register driver!");
     }
}
```

> tips：mysql5之后的驱动jar包可以忽略注册驱动的步骤。

* 获取数据库连接

**方法：**

```java
static Connection getConnection(String url,String user,String password);
```

**参数：**

1.url：指定连接的路径

* 语法：jdbc:mysql://ip地址(域名):端口号/数据库名称
* 例子：jdbc:mysql://localhost:3306/students
* 细节：如果连接的是本机mysql服务器，并且mysql服务默认端口是3306，则url可以简写为：jdbc:mysql:///数据库名称

2.user：用户名

3.password：密码

---------

### 2.2Connection

**数据库连接对象**

**一.功能**

**1.获取执行sql的对象**

* ** ` Statement createStatement()`**
* ** ` PreparedStatement prepareStatement(String sql)`**

**2.管理事务**

* 开启事务：** ` setAutoCommit(boolean autoCommit)`**：调用该方法设置参数为false，即开启事务
* 提交事务：** ` commit()`**
* 回滚事务：** ` rollback()`**

-------

### 2.3Statement

**执行sql的对象**

1.执行sql

* ** ` boolean execute(String sql)`**：可以执行任意的sql(了解)
* ** ` int executeUpdate(String sql)`**：执行DML(insert、update、delete)语句、DDL(create、alter、drop)语句

返回值：影响的行数，可以通过这个影响的行数判断DML语句是否执行成功 返回值>0的则执行成功，反之，则失败。

* ** ` ResultSet executeQuery(String sql)`**：执行DQL(select)语句

---------

### 2.4ResultSet

**结果集对象**

ResultSet：结果集对象，封装查询结果

* next()：游标向下移动一行
* getXXX(参数)：获取数据

Xxx：代表数据类型   如：int getInt()       String getString()

* 参数：

1.int：代表列的编号，从1开始     如：getString(1)

2.String：代表列名称。 如：getDouble("balance")

* ** ` boolean next()`**：游标向下移动一行，判断当前行是否是最后一行末尾(是否有数据)，如果是，则返回false，如果不是则返回true

* 注意：

1.游标向下移动一行

2.判断是否有数据

3.获取数据

```java
package com.priv.demo01JDBC;

import java.sql.*;
/**
 * 执行DQL语言
 */

public class Demo05JDBC {
    public static void main(String[] args) {
        Connection connection=null;
        Statement statement=null;
        ResultSet resultSet=null;
        try {
            Class.forName("com.mysql.cj.jdbc.Driver");
            String sql="SELECT * FROM account";
            connection = DriverManager.getConnection("jdbc:mysql:///students", "root", "填自己的数据库密码");
            statement = connection.createStatement();
            resultSet = statement.executeQuery(sql);
            while(resultSet.next()){
                int anInt = resultSet.getInt(1);
                String username = resultSet.getString("username");
                double aDouble = resultSet.getDouble(3);
                System.out.println(anInt+"---"+username+"---"+aDouble);
            }

        } catch (ClassNotFoundException e) {
            e.printStackTrace();
        } catch (SQLException throwables) {
            throwables.printStackTrace();
        }finally {
            try {
                resultSet.close();
            } catch (SQLException throwables) {
                throwables.printStackTrace();
            }
            try {
                statement.close();
            } catch (SQLException throwables) {
                throwables.printStackTrace();
            }
            try {
                connection.close();
            } catch (SQLException throwables) {
                throwables.printStackTrace();
            }
        }

    }
}
```

-----

### 2.5PreparedStatement

**执行sql的对象**

1.SQL注入问题：在拼接sql时，有一些sql的特殊关键字参与字符串的拼接。会造成安全性问题

* 输入用户随便，输入密码：a' or 'a'='a
* sql：SELECT * FROM USER  WHERE username='fhjjhishaid'and password='a' or 'a'='a'

2.解决sql注入问题：使用PreparedStatement对象来解决

```java
package com.priv.demo01JDBC;

import com.priv.demo03util.Demo01JDBCUtils;

import java.sql.*;
import java.util.Scanner;

public class Demo09JDBC {
    public static void main(String[] args) {
        Scanner scanner=new Scanner(System.in);
        System.out.println("请输入用户名：");
        String username = scanner.nextLine();
        System.out.println("请输入密码：");
        String password = scanner.nextLine();
        boolean login = new Demo08JDBC().login(username, password);
        if(login){
            System.out.println("登录成功！");
        }else{
            System.out.println("******用户名或密码错误！******");
        }
    }

    public boolean login(String username,String password){
        Connection connection=null;
        PreparedStatement preparedStatement=null;
        ResultSet resultSet=null;
        if(username==null||password==null){
            return false;
        }
        try {
            connection = Demo01JDBCUtils.getConnection();
            String sql="SELECT * FROM USER  WHERE username= ? and password= ? ";
            preparedStatement = connection.prepareStatement(sql);
            preparedStatement.setString(1,username);
            preparedStatement.setString(2,password);
            resultSet = preparedStatement.executeQuery();
            return resultSet.next();
        } catch (SQLException throwables) {
            throwables.printStackTrace();
        }finally {
            Demo01JDBCUtils.close(resultSet,preparedStatement,connection);
        }
        return false;
    }
}
```

> tips：后期都会使用preparedStatement来完成增删改查的所有操作
>
> * 可以防止SQL注入
> * 效率更高

------------

## 第三章  JDBC练习

--------

### 3.1insert语句

----

```java
package com.priv.demo01JDBC;

import java.sql.*;
/**
 * account表 添加一条记录 insert语句
 */
public class Demo02JDBC {
    public static void main(String[] args) {
        Connection connection =null;
        Statement  statement =null;
        try {
            Class.forName("com.mysql.cj.jdbc.Driver");
            String sql="insert into account values(NULL,'张三',1800)";
            connection = DriverManager.getConnection("jdbc:mysql:///students", "root", "填自己的数据库密码");
            statement = connection.createStatement();
            int count = statement.executeUpdate(sql);
            System.out.println(count);
            if(count>0){
                System.out.println("添加成功！");
            }else{
                System.out.println("添加失败！");
            }
        } catch (ClassNotFoundException e) {
            e.printStackTrace();
        } catch (SQLException throwables) {
            throwables.printStackTrace();
        }finally {
            //避免空指针异常
            if(connection!=null){
                try {
                    connection.close();
                } catch (SQLException throwables) {
                    throwables.printStackTrace();
                }
            }
            if(statement!=null){
                try {
                    statement.close();
                } catch (SQLException throwables) {
                    throwables.printStackTrace();
                }
            }
        }
    }
}
```

-----

### 3.2update语句

-----

```java
package com.priv.demo01JDBC;

import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.SQLException;
import java.sql.Statement;
/**
 * account表 修改一条记录 update语句
 */
public class Demo03JDBC {
    public static void main(String[] args) {
        Connection connection =null;
        Statement statement=null;
        try {
            Class.forName("com.mysql.cj.jdbc.Driver");
            String sql="update account set balance=500 where username='张三'";
            connection = DriverManager.getConnection("jdbc:mysql:///students", "root", "填自己的数据库密码");
            statement = connection.createStatement();
            int i = statement.executeUpdate(sql);
            System.out.println(i);
            if(i>0){
                System.out.println("修改成功！");
            }else {
                System.out.println("修改失败！");
            }
        } catch (ClassNotFoundException e) {
            e.printStackTrace();
        } catch (SQLException throwables) {
            throwables.printStackTrace();
        }finally {
            if(statement!=null){
                try {
                    statement.close();
                } catch (SQLException throwables) {
                    throwables.printStackTrace();
                }
            }
            if(connection!=null){
                try {
                    connection.close();
                } catch (SQLException throwables) {
                    throwables.printStackTrace();
                }
            }
        }
    }
}
```

---------

### 3.3delete语句

------

```java
package com.priv.demo01JDBC;

import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.SQLException;
import java.sql.Statement;
/**
 * account表 删除一条记录 delete语句
 */
public class Demo04JDBC {
    public static void main(String[] args) {
        Connection connection=null;
        Statement statement=null;
        try {
            Class.forName("com.mysql.cj.jdbc.Driver");
            String sql="DELETE FROM ACCOUNT WHERE USERNAME='张三'";
            connection = DriverManager.getConnection("jdbc:mysql:///students", "root", "填自己的数据库密码");
            statement = connection.createStatement();
            int count = statement.executeUpdate(sql);
            System.out.println(count);
            if(count>0){
                System.out.println("删除成功");
            }else{
                System.out.println("删除失败");
            }
        } catch (ClassNotFoundException e) {
            e.printStackTrace();
        } catch (SQLException throwables) {
            throwables.printStackTrace();
        }finally {
            try {
                statement.close();
            } catch (SQLException throwables) {
                throwables.printStackTrace();
            }
            try {
                connection.close();
            } catch (SQLException throwables) {
                throwables.printStackTrace();
            }
        }

    }
}
```

> tips：返回的count值是受影响的行数

--------

### 3.4select语句

```java
package com.priv.demo02JDBC;

import java.util.Date;

public class employees {
    private int employee_id;
    private String first_name;
    private String last_name;
    private String email;
    private String phone_number;
    private String job_id;
    private double salary;
    private double commission_pct;
    private int manager_id;
    private int department_id;
    private Date hiredate;

    public employees() {

    }

    public int getEmployee_id() {
        return employee_id;
    }

    public void setEmployee_id(int employee_id) {
        this.employee_id = employee_id;
    }

    public String getFirst_name() {
        return first_name;
    }

    public void setFirst_name(String first_name) {
        this.first_name = first_name;
    }

    public String getLast_name() {
        return last_name;
    }

    public void setLast_name(String last_name) {
        this.last_name = last_name;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getPhone_number() {
        return phone_number;
    }

    public void setPhone_number(String phone_number) {
        this.phone_number = phone_number;
    }

    public String getJob_id() {
        return job_id;
    }

    public void setJob_id(String job_id) {
        this.job_id = job_id;
    }

    public double getSalary() {
        return salary;
    }

    public void setSalary(double salary) {
        this.salary = salary;
    }

    public double getCommission_pct() {
        return commission_pct;
    }

    public void setCommission_pct(double commission_pct) {
        this.commission_pct = commission_pct;
    }

    public int getManager_id() {
        return manager_id;
    }

    public void setManager_id(int manager_id) {
        this.manager_id = manager_id;
    }

    public int getDepartment_id() {
        return department_id;
    }

    public void setDepartment_id(int department_id) {
        this.department_id = department_id;
    }

    public Date getHiredate() {
        return hiredate;
    }

    public void setHiredate(Date hiredate) {
        this.hiredate = hiredate;
    }

    @Override
    public String toString() {
        return "Demo01List{" +
                "employee_id=" + employee_id +
                ", first_name='" + first_name + '\'' +
                ", last_name='" + last_name + '\'' +
                ", emile='" + email + '\'' +
                ", phone_number='" + phone_number + '\'' +
                ", job_id='" + job_id + '\'' +
                ", salary=" + salary +
                ", commission_pct=" + commission_pct +
                ", manager_id=" + manager_id +
                ", department_id=" + department_id +
                ", hiredate='" + hiredate + '\'' +
                '}';
    }

    public employees(int employee_id, String first_name, String last_name, String emile, String phone_number, String job_id, float salary, float commission_pct, int manager_id, int department_id, Date hiredate) {
        this.employee_id = employee_id;
        this.first_name = first_name;
        this.last_name = last_name;
        this.email = email;
        this.phone_number = phone_number;
        this.job_id = job_id;
        this.salary = salary;
        this.commission_pct = commission_pct;
        this.manager_id = manager_id;
        this.department_id = department_id;
        this.hiredate = hiredate;
    }
}
```

```java
package com.priv.demo01JDBC;

import com.priv.demo02JDBC.employees;

import java.sql.*;
import java.util.ArrayList;
import java.util.Date;
import java.util.Iterator;
import java.util.List;

public class Demo06JDBC {
    public static void main(String[] args) {
        List<employees> all = new Demo06JDBC().findAll();
        Iterator<employees> iterator=all.iterator();
        while (iterator.hasNext()){
            System.out.println(iterator.next());
        }
    }
    /**
     *查询所有employees对象
     * @return
     */
    public List<employees> findAll(){
        Connection connection=null;
        Statement statement=null;
        ResultSet resultSet=null;
        List<employees> list=null;
        try {
            Class.forName("com.mysql.cj.jdbc.Driver");
            String sql="SELECT * FROM EMPLOYEES";
            connection = DriverManager.getConnection("jdbc:mysql:///myemployees", "root", "填自己的数据库密码");
            statement = connection.createStatement();
            resultSet = statement.executeQuery(sql);
            employees employees=null;
            list=new ArrayList<>();

            while (resultSet.next()){
                int employee_id = resultSet.getInt(1);
                String first_name = resultSet.getString("first_name");
                String last_name = resultSet.getString("last_name");
                String email = resultSet.getString("email");
                String phone_number = resultSet.getString("phone_number");
                String job_id = resultSet.getString("job_id");
                double salary = resultSet.getDouble(7);
                double commission_pct = resultSet.getDouble(8);
                int manager_id = resultSet.getInt(9);
                int department_id = resultSet.getInt(10);
                Date hiredate = resultSet.getDate("hiredate");
                employees=new employees();
                employees.setEmployee_id(employee_id);
                employees.setFirst_name(first_name);
                employees.setLast_name(last_name);
                employees.setEmail(email);
                employees.setPhone_number(phone_number);
                employees.setJob_id(job_id);
                employees.setSalary(salary);
                employees.setCommission_pct(commission_pct);
                employees.setManager_id(manager_id);
                employees.setDepartment_id(department_id);
                employees.setHiredate(hiredate);
                list.add(employees);

            }
        } catch (ClassNotFoundException e) {
            e.printStackTrace();
        } catch (SQLException throwables) {
            throwables.printStackTrace();
        }finally {
            try {
                resultSet.close();
            } catch (SQLException throwables) {
                throwables.printStackTrace();
            }
            try {
                statement.close();
            } catch (SQLException throwables) {
                throwables.printStackTrace();
            }
            try {
                connection.close();
            } catch (SQLException throwables) {
                throwables.printStackTrace();
            }
        }
        return list;
    }
}
```



---------

## 第四章  JDBC工具类

------

### 4.1工具类实现

```properties
url=jdbc:mysql:///students
user=root
password=填自己的数据库密码
driver=com.mysql.cj.jdbc.Driver
```

```java
package com.priv.demo03util;

import java.io.FileNotFoundException;
import java.io.FileReader;
import java.io.IOException;
import java.net.URL;
import java.sql.*;
import java.util.Properties;

public class Demo01JDBCUtils {
    private static String url;
    private static String user;
    private static String password;
    private static String driver;

    static{
        try {
            Properties properties = new Properties();
            ClassLoader classLoader = Demo01JDBCUtils.class.getClassLoader();
            URL resource = classLoader.getResource("jdbc.properties");
            String path = resource.getPath();
            properties.load(new FileReader(path));
            url=properties.getProperty("url");
            user=properties.getProperty("user");
            password=properties.getProperty("password");
            driver=properties.getProperty("driver");
            Class.forName(driver);
        } catch (ClassNotFoundException | FileNotFoundException e) {
            e.printStackTrace();
        } catch (IOException e) {
            e.printStackTrace();
        }
    }
    /**
     *获取连接
     * @return 连接对象
     */

    public static Connection getConnection() throws SQLException {
        return DriverManager.getConnection(url,user,password);
    }

    /**
     * 释放资源
     * @param statement
     * @param connection
     */
    public static void close(Statement statement,Connection connection){
        if(statement!=null){
            try {
                statement.close();
            } catch (SQLException throwables) {
                throwables.printStackTrace();
            }
        }
        if(connection!=null){
            try {
                connection.close();
            } catch (SQLException throwables) {
                throwables.printStackTrace();
            }
        }
    }

    public static void close(ResultSet resultSet,Statement statement, Connection connection){
        if(resultSet!=null){
            try {
                resultSet.close();
            } catch (SQLException throwables) {
                throwables.printStackTrace();
            }
        }
        if(statement!=null){
            try {
                statement.close();
            } catch (SQLException throwables) {
                throwables.printStackTrace();
            }
        }
        if(connection!=null){
            try {
                connection.close();
            } catch (SQLException throwables) {
                throwables.printStackTrace();
            }
        }
    }

}
```

```java
package com.priv.demo01JDBC;

import com.priv.demo02JDBC.employees;
import com.priv.demo03util.Demo01JDBCUtils;

import java.sql.*;
import java.util.ArrayList;
import java.util.Date;
import java.util.Iterator;
import java.util.List;

public class Demo07JDBC {
    public static void main(String[] args) {
        List<employees> all = new Demo06JDBC().findAll();
        Iterator<employees> iterator=all.iterator();
        while (iterator.hasNext()){
            System.out.println(iterator.next());
        }
    }
    /**
     *演示JDBC工具类
     * @return
     */
    public List<employees> findAll(){
        Connection connection=null;
        Statement statement=null;
        ResultSet resultSet=null;
        List<employees> list=null;
        try {
            Connection connection1 = Demo01JDBCUtils.getConnection();
            String sql="SELECT * FROM EMPLOYEES";
            statement = connection.createStatement();
            resultSet = statement.executeQuery(sql);
            employees employees=null;
            list=new ArrayList<>();

            while (resultSet.next()){
                int employee_id = resultSet.getInt(1);
                String first_name = resultSet.getString("first_name");
                String last_name = resultSet.getString("last_name");
                String email = resultSet.getString("email");
                String phone_number = resultSet.getString("phone_number");
                String job_id = resultSet.getString("job_id");
                double salary = resultSet.getDouble(7);
                double commission_pct = resultSet.getDouble(8);
                int manager_id = resultSet.getInt(9);
                int department_id = resultSet.getInt(10);
                Date hiredate = resultSet.getDate("hiredate");
                employees=new employees();
                employees.setEmployee_id(employee_id);
                employees.setFirst_name(first_name);
                employees.setLast_name(last_name);
                employees.setEmail(email);
                employees.setPhone_number(phone_number);
                employees.setJob_id(job_id);
                employees.setSalary(salary);
                employees.setCommission_pct(commission_pct);
                employees.setManager_id(manager_id);
                employees.setDepartment_id(department_id);
                employees.setHiredate(hiredate);
                list.add(employees);

            }
        }catch (SQLException throwables) {
            throwables.printStackTrace();
        }
        Demo01JDBCUtils.close(resultSet,statement,connection);
        return list;
    }
}
```

---------

### 4.2登录案例

```java
package com.priv.demo01JDBC;

import com.priv.demo03util.Demo01JDBCUtils;

import java.sql.Connection;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.sql.Statement;
import java.util.Scanner;

public class Demo08JDBC {
    public static void main(String[] args) {
        Scanner scanner=new Scanner(System.in);
        System.out.println("请输入用户名：");
        String username = scanner.nextLine();
        System.out.println("请输入密码：");
        String password = scanner.nextLine();
        boolean login = new Demo08JDBC().login(username, password);
        if(login){
            System.out.println("登录成功！");
        }else{
            System.out.println("******用户名或密码错误！******");
        }
    }

    public boolean login(String username,String password){
        Connection connection=null;
        Statement statement=null;
        ResultSet resultSet=null;
        if(username==null||password==null){
            return false;
        }
        try {
            connection = Demo01JDBCUtils.getConnection();
            String sql="SELECT * FROM USER  WHERE username='"+username+"'and password='"+password+"'";
            statement = connection.createStatement();
            resultSet = statement.executeQuery(sql);
            return resultSet.next();
        } catch (SQLException throwables) {
            throwables.printStackTrace();
        }finally {
            Demo01JDBCUtils.close(resultSet,statement,connection);
        }
        return false;
    }
}
```





-----------

## 第五章  JDBC控制事务

---------

### 5.1概述

---

1.事务：一个包含多个步骤的业务操作。如果这个业务操作被事务管理，则这多个步骤要么同时成功，要么同时失败。

2.操作：

* 开启事务
* 提交事务
* 回滚事务

3.使用Connection对象来管理事务

* 开启事务：** ` setAutoCommit(boolean autoCommit)`**：调用该方法设置参数为false，即开启事务

  `在执行sql之前开启事务`

* 提交事务：** ` commit()`**

  `当所有sql都执行完提交事务`

* 回滚事务：** ` rollback()`**

  `在catch中回滚事务`

-------

### 5.2实现案例

------------

```java
package com.priv.demo01JDBC;

import com.priv.demo03util.Demo01JDBCUtils;

import java.sql.*;

/**
 *事务操作：转账
 */
public class Demo10JDBC {
    public static void main(String[] args) {
        Connection connection=null;
        PreparedStatement preparedStatement1=null;
        PreparedStatement preparedStatement2=null;
        ResultSet resultSet=null;
        try {
            connection = Demo01JDBCUtils.getConnection();
            //开启事务
            connection.setAutoCommit(false);
            String sql1="update account set balance=balance-? where id=?";
            String sql2="update account set balance=balance+? where id=?";
            preparedStatement1 = connection.prepareStatement(sql1);
            preparedStatement2 = connection.prepareStatement(sql2);
            preparedStatement1.setDouble(1,500);
            preparedStatement1.setInt(2,1);

            preparedStatement2.setDouble(1,500);
            preparedStatement2.setInt(2,2);

            preparedStatement1.executeUpdate();
            //手动制造异常
            int i=3/0;
            preparedStatement2.executeUpdate();
            //提交事务
            connection.commit();
        } catch (SQLException throwables) {
            //事务回滚
            try {
                if(connection!=null) {
                    connection.rollback();
                }
            } catch (Exception e) {
                e.printStackTrace();
            }
            throwables.printStackTrace();
        }finally {
            Demo01JDBCUtils.close(preparedStatement1,connection);
            Demo01JDBCUtils.close(preparedStatement2,null);
        }

    }
}
```

----------

## 第六章  数据库连接池

----------

### 6.1概述

-------

**1.概念：**其实就是一个容器(集合)，存放数据库连接的容器。当系统初始化好后，容器被创建，容器中会申请一些连接对象，当用户来访问数据库时，从容器中获取连接对象，用户访问完之后，会将连接对象归还给容器。

**2.好处：**

* 节约资源
* 用户访问高效

**3.实现**

1.标准接口：DataSource   javax.sql包下

​          1.方法：

​           获取连接：getConnection()

​           归还连接：Connection.close() 如果连接对象Connection时从连接池中获取的，那么调用Connection.close()方法，则不会再关闭连接了。而是归还连接

2.一般我们不去实现它，由数据库厂商来实现

* C3P0：数据库连接池技术
* Druid：数据库连接池实现技术，由阿里巴巴提供

------

### 6.2C3P0

------

**步骤：**

1.导入jar包：两个 c3p0-0.9.5.5.jar和mchange-commons-java-0.2.19.jar

2.定义配置文件：

* 名称：c3p0.properties或者c3p0-config.xml
* 路径：直接将文件放在src目录下即可。

3.创建核心对象 数据库连接池对象  ComboPooledDataSource

4.获取连接：getConnection

```java
package com.priv.demo04JDBCTemplate;

import com.mchange.v2.c3p0.ComboPooledDataSource;

import javax.sql.DataSource;
import java.sql.Connection;
import java.sql.SQLException;

/**
 * C3P0的演示
 */
public class Demo01C3P0 {
    public static void main(String[] args) throws SQLException {
        //创建数据库连接池对象
        DataSource ds = new ComboPooledDataSource();
        Connection connection = ds.getConnection();
        System.out.println(connection);
    }
}
```

---------

### 6.3Druid

-----

**步骤：**

1.导入jar包：druid-1.0.9.jar

2.定义配置文件

* 是properties形式的
* 可以叫任意名称，可以放在任意目录下

3.获取数据库连接池对象：通过工厂类来获取  DruidDataSourceFactory

4.获取连接：getConnection

```java
package com.priv.demo04JDBCTemplate;

import com.alibaba.druid.pool.DruidDataSourceFactory;

import javax.sql.DataSource;
import java.io.InputStream;
import java.sql.Connection;
import java.util.Properties;

public class Demo02Druid {
    public static void main(String[] args) throws Exception {
        //1.导入jar包
        //2.定义配置文件
        //3.加载配置文件
        Properties properties = new Properties();
        ClassLoader classLoader = Demo02Druid.class.getClassLoader();
        InputStream resourceAsStream = classLoader.getResourceAsStream("druid.properties");
        properties.load(resourceAsStream);
        //4.获取连接池对象
        DataSource dataSource = DruidDataSourceFactory.createDataSource(properties);
        //5.获取连接
        Connection connection = dataSource.getConnection();
        System.out.println(connection);
    }
}
```

------

**工具类**

1.定义一个类 JDBCUtils

2.提供静态代码块加载配置文件，初始化连接池对象

3.提供方法

* 获取连接方法：通过数据库连接池获取连接
* 释放资源
* 获取连接池的方法

```java
package com.priv.demo04JDBCTemplate;
/**
 * Druid工具类
 */

import com.alibaba.druid.pool.DruidDataSourceFactory;

import javax.sql.DataSource;
import java.io.IOException;
import java.sql.Connection;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.sql.Statement;
import java.util.Properties;

public class JDBCUtils {
    private static DataSource dataSource;
    static {

        try {
            Properties properties=new Properties();
            properties.load(JDBCUtils.class.getResourceAsStream("druid.properties"));
            dataSource= DruidDataSourceFactory.createDataSource(properties);
        } catch (IOException e) {
            e.printStackTrace();
        } catch (Exception e) {
            e.printStackTrace();
        }
    }

    /**
     *获取连接
     */
    public static Connection getConnection() throws SQLException {

        return dataSource.getConnection();
    }
    /**
     * 释放资源
     */
    public static void close(Statement statement,Connection connection){
        if(statement!=null){
            try {
                statement.close();
            } catch (SQLException throwables) {
                throwables.printStackTrace();
            }
        }
        if(connection!=null){
            try {
                connection.close();//归还连接
            } catch (SQLException throwables) {
                throwables.printStackTrace();
            }
        }
    }

    public static void close(ResultSet resultSet,Statement statement, Connection connection){
        if(resultSet!=null){
            try {
                resultSet.close();
            } catch (SQLException throwables) {
                throwables.printStackTrace();
            }
        }
        close(statement, connection);
    }

    /**
     * 获取连接池方法
     */
    public static DataSource getDataSource(){
        return dataSource;
    }
}
```

**实现**

```java
package com.priv.demo04JDBCTemplate;

import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.SQLException;

/**
 * 使用新的工具类
 */
public class Demo03Druid {
    public static void main(String[] args) {
        Connection connection =null;
        PreparedStatement preparedStatement =null;
        try {
            connection = JDBCUtils.getConnection();
            String sql="insert into account value(null,?,?) ";
            preparedStatement = connection.prepareStatement(sql);
            preparedStatement.setString(1,"张飞");
            preparedStatement.setInt(2,1000);
            int count = preparedStatement.executeUpdate();
            System.out.println(count);
        } catch (SQLException throwables) {
            throwables.printStackTrace();
        }finally {
            JDBCUtils.close(preparedStatement,connection);
        }

    }
}
```

-------

## 第七章   Spring JDBC

--------

### 7.1JDBCTemplate简介

------

Spring框架对JDBC的简单封装。提供了一个JDBCTemplate对象简化JDBC的开发

**步骤：**

1.导入jar包

2.创建JDBCTemplate对象。依赖于数据源DataSource

* ```java
  JdbcTemplate jdbcTemplate=new JdbcTemplate(ds);
  ```

3.调用JDBCTemplate的方法来完成CRUD的操作

* ** `update():`**执行DML语句。增、删、改语句
* ** `queryForMap():`**查询结果将结果集封装为Map集合

注意：这个方法查询的结果集长度只能是1

* ** `queryForList():`**查询结果将结果集封装为List集合

注意：将每一条记录封装为一个Map集合，再将Map集合装载到List集合中

* ** `query():`**查询结果将结果集封装为JavaBean集合

query的参数：RowMapper

一般我们使用BeanPropertyRowMapper实现类。可以完成数据到JavaBean的自动封装

new BeanPropertyRowMapper<类型>(类型.class)

* ** `queryForObject():`**查询结果将结果集封装为对象

一般用于聚合函数的查询

```java
package com.priv.demo04JDBCTemplate;

import org.springframework.jdbc.core.JdbcTemplate;

/**
 * JDBCTemplate入门
 */
public class Demo04JDBCTemplate {
    public static void main(String[] args) {
        //导入jar包
        //创建JdbcTemplate对象
        JdbcTemplate jdbcTemplate=new JdbcTemplate(JDBCUtils.getDataSource());
        String sql="update account set balance=5000 where id=?";
        //调用方法
        int count = jdbcTemplate.update(sql,3);
        System.out.println(count);
    }
}
```

------

### 7.2JDBCTemplate执行DML语句

-----

```java
package com.priv.demo04JDBCTemplate;

import org.junit.Test;
import org.springframework.jdbc.core.JdbcTemplate;

/**
 * 案例一：修改1号数据的balance为5000
 */
public class Demo05JDBCTemplateP {
    @Test
    public void test1() {
        JdbcTemplate jdbcTemplate=new JdbcTemplate(JDBCUtils.getDataSource());
        String sql="update account set balance=5000 where id=?";
        int update = jdbcTemplate.update(sql, 1);
        System.out.println(update);
    }
/**
 * 案例二：添加一条记录
 */
    @Test
    public void test2() {
        JdbcTemplate jdbcTemplate=new JdbcTemplate(JDBCUtils.getDataSource());
        String sql="insert into account value(null ,?,?)";
        int count = jdbcTemplate.update(sql, "郭靖", "1000");
        System.out.println(count);
    }

/**
 * 案例三：删除刚才添加的记录
 */
    @Test
    public void test3() {
        JdbcTemplate jdbcTemplate=new JdbcTemplate(JDBCUtils.getDataSource());
        String sql="delete from account where id=?";
        int count = jdbcTemplate.update(sql, "4");
        System.out.println(count);
}
}
```

-------

### 7.3JDBCTemplate执行DQL语句

------

```java
package com.priv.demo04JDBCTemplate;

import org.junit.Test;
import org.springframework.jdbc.core.BeanPropertyRowMapper;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.jdbc.core.RowMapper;

import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.List;
import java.util.Map;

public class Demo06JDBCTemplateP2 {
    /**
     * 案例一：查询id为1的记录，将其封装为Map集合
     */
    @Test
    public void Test1(){
        JdbcTemplate jdbcTemplate=new JdbcTemplate(JDBCUtils.getDataSource());
        String sql="select * from account where id=?";
        Map<String, Object> stringObjectMap = jdbcTemplate.queryForMap(sql, "1");
        System.out.println(stringObjectMap);
    }

    /**
     * 案例二：查询所有记录，将其封装为List集合
     */
    @Test
    public void Test2(){
        JdbcTemplate jdbcTemplate=new JdbcTemplate(JDBCUtils.getDataSource());
        String sql="select * from account";
        List<Map<String, Object>> maps = jdbcTemplate.queryForList(sql);
        for(Map<String, Object> stringObjectMap:maps){
            System.out.println(stringObjectMap);
        }
    }

    /**
     *案例三：查询所有记录，将其封装为account对象的List集合
     */
    @Test
    public void Test3(){
        JdbcTemplate jdbcTemplate=new JdbcTemplate(JDBCUtils.getDataSource());
        String sql="select * from account";
        List<account> list=jdbcTemplate.query(sql, new RowMapper<account>() {
            @Override
            public account mapRow(ResultSet resultSet, int i) throws SQLException {
                account account=new account();
                int id = account.getId("id");
                String username = account.getUsername();
                int balance = account.getBalance();

                account.setId(id);
                account.setUsername(username);
                account.setBalance(balance);
                return null;
            }
        });
        for(account account:list){
            System.out.println(account);
        }
    }

    @Test
    public void Test4(){
        JdbcTemplate jdbcTemplate=new JdbcTemplate(JDBCUtils.getDataSource());
        String sql="select * from account";
        List<account> query = jdbcTemplate.query(sql, new BeanPropertyRowMapper<account>(account.class));
        for(account account:query){
            System.out.println(account);
        }
    }

    /**
     *案例四：查询总记录数
     */
    @Test
    public void Test5(){
        JdbcTemplate jdbcTemplate=new JdbcTemplate(JDBCUtils.getDataSource());
        String sql="select count(id) from account";
        Long aLong = jdbcTemplate.queryForObject(sql, long.class);
        System.out.println(aLong);
    }
}
```
