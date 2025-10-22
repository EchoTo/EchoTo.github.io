---
title: gRPC
date: 2024-12-03 11:45:42
tags: [gRPC,Java]
categories: gRPC
---

# GRPC

----

## 1.1 gRPC简介

---

```markdown
gRPC是由Google开源的一个高性能的RPC框架。由Stubby Google内部RPC演化而来，2015年正式开源。支持异构系统的RPC

云原生时代是一个RPC标准： 
容器：
* 容器化 Docker go语言开发
* 服务编排 k8s go语言开发
* gRPC go语言开发
 
 gRPC的设计思路
 		1、网络通信 ---> gRPC自己封装网络通信的部分 提供多语言的 网络通信的封装(C Java[Netty] GO)
 		2、协议 ---> HTTP2 传输数据的时候 二进制数据内容 支持双向流(双工) 连接的多路复用
 		3、序列化 ---> 基于文本 JSON 基于二进制 Java原生序列化方式 Thrift二进制的序列化 压缩二进制序列化
 									protobuf (Protocol Buffers) Google开源的一种序列化方式 时间效率和空间效率是JSON的3-5倍
 									IDL语言
 		4、代理的创建 ---> 让调用者像调用本地方法一样 去调用远端的服务方法
 											stub
 gRPC 与 ThriftRPC 区别
 		共性：支持异构语言的RPC
 		区别：
 				1、网络通信 Thrift TCP（传输层协议）专属协议  传输速度更快
 				 				 	gRPC	HTTP2（应用层协议）        更方便整合
 			  2、性能角度 Thrift RPC 性能 高于 gRPC
 			  3、gRPC 大厂背书 (Google) 云原生时代与其他组件合作的顺利。所以gRPC应用更加广泛
 gRPC的好处
 		1、高效的进行进程间通信
 		2、支持多种语言 原生支持C Go Java实现 C语言版本上扩展 C++ C# NodeJS Python Ruby PHP...
 		3、支持多平台运行 Linux Android IOS MacOS Windows
 		4、gRPC序列化方式采用protobuf 效率更高
 		5、使用HTTP2协议
 		6、大厂的背书
```

---

## 2.1 HTTP2.0协议

----

**HTTP1.x协议**

一、HTTP1.0协议

* 请求 响应的模式
* 短连接协议（无状态协议）
* HTTP基于TCP协议，TCP协议是长连接协议，为什么HTTP是短连接协议？HTTP自己主动切断的，互联网发展前期，服务器中通信长时间处于连接状态会导致资源不足
* 传输数据 文本结构 单工（只能客户端找服务端，服务器不能主动向客户端推送数据） 无法实现服务端推送 变相实现推送（客户端轮询的方式）

二、HTTP1.1协议

* 有限的长连接 （保持一段时间 keepalived决定）
* 升级的方式 WebSocket 
* 双工 实现服务器向客户端推送

三、共性

* 传输数据文本格式 可读性好但是效率差
* 本质上HTTP1.x协议无法实现双工通信，是因为升级了WebSocket才实现的双工通信
* 资源的请求 需要发送多次请求 建立多个连接才可以完成



**HTTP2.0协议**

* HTTP2.0协议是一个二进制协议，效率高于HTTP1.x协议，可读性差
* 可以实现双工通信
* 一个请求 一个连接 可以请求多个数据 【多路复用】

 

**HTTP2.0协议的三个概念**

* 数据流 stream
* 消息 message
* 帧 frame

<img src="https://tonkyshan.cn/img/20240802160614.png" alt="20240802160614.png" style="zoom:40%;" />

概念

* 数据流的优先级：可以通过为不同的stream设置权重，来限制不同流的传输顺序
* 流控：client发送的数据太快了，server处理不过来，通知client暂停数据的发送 

-----

## 2.2 Protocol Buffers【protobuf】

----

protobuf 是一种与编程语言无关【IDL】 与具体平台无关【OS】它定义的中间语言，可以方便的在client与server中进行RPC的数据传输

protobuf 两种版本 proto2 proto3，但是目前主流应用的都是proto3

protobuf 的使用需要安装的protobuf的编译器，编译器的目的是把protobuf的IDL语言，转换成具体某一种开发语言



**protobuf编译器的安装**

`brew install prorobuf`

<img src="/Users/test/Library/Application Support/typora-user-images/截屏2024-08-05 09.57.54.png" alt="截屏2024-08-05 09.57.54" style="zoom:50%;" />

<img src="https://tonkyshan.cn/img/20240805095754.png" alt="20240805095754.png" style="zoom:50%;" />

**protobuf语法**

* 文件格式

  ```markdown
  .proto
  ```

* 版本设定

  ```protobuf
  syntax = "proto3";
  ```

* 注释

  ```markdown
  1、单行注释     //
  2、多行注释     /* */
  ```

* 与Java语言相关的语法

  ```java
  // 后续protobuf生成的java代码 一个源文件还是多个源文件  xx.java
  option java_multiple_files = false;
  
  // 指定protobuf生成的类 放置在哪个包中
  option java_package = "com.suns";
  
  // 指定protobuf生成的外部类的名字（管理内部类【内部类才是真正开发使用的类】）
  option java_outer_classname = "UserService";
  ```

* 逻辑包【了解】

  ```java
  // protobuf对于文件内容的管理
  package xxx;
  ```

* 导入

  ```markdown
  UserService.proto
  
  OrderService.proto
  	import "xxx/UserService.proto";
  ```

* 基本类型

  <img src="https://tonkyshan.cn/img/20240805163224.png" alt="20240805163224.png" style="zoom:90%;" />

* 枚举类型

  ```protobuf
  enum SEASON {
  	SPRING = 0;
  	SUMMER = 1;
  }
  // 枚举的值 必须是0开始
  ```

* 消息 Message

  ```protobuf
  message LoginRequest {
  	string username = 1; // 1这个值 是字段在message中的编号
  	string password = 2;
  	int32 age = 3;
  }
  
  // 编号 从1开始 到 2^29-1 注意：19000 - 19999的编号不能用，因为它是protobuf自己保留的。 
  - singular : 这个字段的值 只能是0个或者1个（默认关键字） null "123456"
  - repeated
  
  message Result {
  	string content = 1;
  	repeated string status = 2; // 这个字段的返回值 是多个 等价于Java List Protobuf getStatusList() --> List
  }
  
  protobuf【grpc】
  // 可以定义多个消息
  
  message LoginRequest {
  	...
  }
  
  message LoginResponse {
  	...
  }
  
  消息可以嵌套
  message SearchResponse {
  	message Result {
  		string url = 1;
  		string title = 2;
  	}
  	
  	string xxx = 1;
  	int32 yyy = 2;
  	Result ppp = 3;
  }
  
  SearchResponse.Result
  
  message AAA {
  	string xxx = 1;
  	SearchResponse.Result yyy = 2;
  }
  
  oneof【其中一个】
  message SimpleMessage {
  	oneof test_oneof {
  		string name = 1;
  		int32 age = 2;
  	}
  }
  // test_oneof值只能为name和age中的一个
  ```

* 服务

  ```protobuf
  service HelloService {
  	rpc hello(HelloRequest) returns(HelloResponse){}
  }
  
  // 里面是可以定义多个服务方法
  // 定义多个服务接口
  // gRPC 服务 4个服务方式
  ```

-----

## 2.3 gRPC开发

-----

* 项目结构

  ```markdown
  一、xxx-api模块
  	定义 protobuf IDL语言
  	并且通过命令创建具体的代码，后续client server引入使用
  	1、message
  	2、service
  二、xxx-server模块
  	1、实现api模块中定义的服务接口
  	2、发布gRPC服务（创建服务端程序）
  三、xxx-client模块
  	1、创建服务端stub（代理）
  	2、基于代理（stub）RPC调用
  ```

* api模块

  ```markdown
  一、.proto文件 书写protobuf的IDL
  二、[了解]protoc命令 把proto文件中的IDL 转换成编程语言
  	protoc --java_out=/xxx/xxx   /xxx/xxx/xx.proto
  三、[实战] maven插件 进行protobuf IDL 文件的编译，并把他放置在IDEA具体位置 
  	grpc-java
  ```

  导入依赖和插件

  ```xml
  <dependencies>
          <dependency>
              <groupId>io.grpc</groupId>
              <artifactId>grpc-netty-shaded</artifactId>
              <version>1.30.2</version>
              <scope>runtime</scope>
          </dependency>
          <dependency>
              <groupId>io.grpc</groupId>
              <artifactId>grpc-protobuf</artifactId>
              <version>1.26.0</version>
          </dependency>
          <dependency>
              <groupId>io.grpc</groupId>
              <artifactId>grpc-stub</artifactId>
              <version>1.26.0</version>
          </dependency>
          <dependency>
              <groupId>org.apache.tomcat</groupId>
              <artifactId>annotations-api</artifactId>
              <version>6.0.53</version>
              <scope>provided</scope>
          </dependency>
      </dependencies>
  
      <build>
          <extensions>
              <extension>
                  <groupId>kr.motd.maven</groupId>
                  <artifactId>os-maven-plugin</artifactId>
                  <version>1.7.1</version>
              </extension>
          </extensions>
          <plugins>
              <plugin>
                  <groupId>org.xolstice.maven.plugins</groupId>
                  <artifactId>protobuf-maven-plugin</artifactId>
                  <version>0.6.1</version>
                  <configuration>
                      <protoSourceRoot>src/main/proto</protoSourceRoot>
                      <!-- protoc命令 —— message信息 -->
                    	<!-- ${} maven内置变量 获取当前操作系统类型 坑：macos M芯片运行时可能出问题-->
                      <protocArtifact>com.google.protobuf:protoc:3.21.7:exe:${os.detected.classifier}</protocArtifact>
                      <pluginId>grpc-java</pluginId>
                    	<!-- 生成服务接口 service -->
                      <pluginArtifact>io.grpc:protoc-gen-grpc-java:1.52.1:exe:${os.detected.classifier}</pluginArtifact>
                      <outputDirectory>${basedir}/src/main/java</outputDirectory>
                      <clearOutputDirectory>false</clearOutputDirectory>
                  </configuration>
                  <executions>
                      <execution>
                          <goals>
                              <!-- 编译消息对象 -->
                              <goal>compile</goal>
                              <!-- 依赖消息对象,生成接口服务 -->
                              <goal>compile-custom</goal>
                          </goals>
                      </execution>
                  </executions>
              </plugin>
          </plugins>
      </build>
  ```

  proto文件

  ```protobuf
  syntax = "proto3";
  
  option java_multiple_files = false;
  option java_package = "com.grpc";
  option java_outer_classname = "HelloProto";
  
  /**
   * IDL文件 目的 发布RPC服务，service ---> message    message <---
   */
  
  message HelloRequest {
      string name = 1;
  }
  
  message HelloResponse {
      string result = 1;
  }
  
  service HelloService {
      rpc Hello(HelloRequest) returns (HelloResponse) {}
  }
  ```

  点击protobuf:compile 生成message相关信息

  <img src="https://tonkyshan.cn/img/20240808161140.png" alt="20240808161140.png" />

  点击protobuf:compile-custom 生成接口相关信息

  <img src="https://tonkyshan.cn/img/20240808162857.png" alt="20240808162857.png" />

  <img src="https://tonkyshan.cn/img/20240806102313.png" alt="20240806102313.png" style="zoom:50%;" />

* xxx-server服务端模块

```java
// 1、实现业务接口 添加具体的功能 （MyBatis + MySQL）
package com.grpc.service;

import com.grpc.HelloProto;
import com.grpc.HelloServiceGrpc;
import io.grpc.stub.StreamObserver;

/**
 * @author: tianqi shan
 * @create: 2024-08-08 17:19
 * @description:
 **/
public class HelloServiceImpl extends HelloServiceGrpc.HelloServiceImplBase{
    /*
       1、接受client提交的参数
       2、业务处理service + dao调用对应的业务功能
       3、提供返回值
     */

    @Override
    public void hello(HelloProto.HelloRequest request, StreamObserver<HelloProto.HelloResponse> responseObserver) {
        //1、接收client的请求参数
        String name = request.getName();
        //2、业务处理
        System.out.println("name Parameter：" + name);
        //3、封装响应
        //3.1、创建相应对象的构造者
        HelloProto.HelloResponse.Builder builder = HelloProto.HelloResponse.newBuilder();
        //3.2、填充数据
        builder.setResult("hello method invoke ok");
        //3.3、封装相应
        HelloProto.HelloResponse helloResponse = builder.build();

        responseObserver.onNext(helloResponse);
        responseObserver.onCompleted();
    }
}

// 2、创建服务端 （Netty）
package com.grpc;

import com.grpc.service.HelloServiceImpl;
import io.grpc.Server;
import io.grpc.ServerBuilder;

import java.io.IOException;

/**
 * @author: tianqi shan
 * @create: 2024-08-08 17:50
 * @description:
 **/
public class GrpcServer1 {
    public static void main(String[] args) throws IOException, InterruptedException {
        //1、绑定端口
        ServerBuilder serverBuilder = ServerBuilder.forPort(9000);
        //2、发布服务
        serverBuilder.addService(new HelloServiceImpl());
        //3、创建服务对象
        Server server = serverBuilder.build();

        server.start();
        server.awaitTermination();
    }
}
```

* xxx-client模块

```java
// 1、client通过代理对象完成远端对象的调用
package com.grpc;

import io.grpc.ManagedChannel;
import io.grpc.ManagedChannelBuilder;

/**
 * @author: tianqi shan
 * @create: 2024-08-08 19:20
 * @description:
 **/
public class GrpcClient1 {
    public static void main(String[] args) {
        // 1、创建通信的管道
        ManagedChannel managedChannel = ManagedChannelBuilder.forAddress("localhost", 9000).usePlaintext().build();
        try {
            // 2、获得代理对象 stub
            HelloServiceGrpc.HelloServiceBlockingStub helloService = HelloServiceGrpc.newBlockingStub(managedChannel);
            // 3、完成RPC调用
            // 3.1、准备参数
            HelloProto.HelloRequest.Builder builder = HelloProto.HelloRequest.newBuilder();
            builder.setName("shantq");
            HelloProto.HelloRequest helloRequest = builder.build();
            // 3.2、进行功能RPC调用，获取相应内容
            HelloProto.HelloResponse helloResponse = helloService.hello(helloRequest);
            String result = helloResponse.getResult();
            System.out.println("result：" + result);
        } catch (Exception e) {
            throw new RuntimeException(e);
        } finally {
            managedChannel.shutdown();
        }
    }
}
```

**repeated**

```protobuf
syntax = "proto3";

option java_multiple_files = false;
option java_package = "com.grpc";
option java_outer_classname = "HelloProto";

/**
 * IDL文件 目的 发布RPC服务，service ---> message    message <---
 */

message HelloRequest {
    string name = 1;
}

message HelloResponse {
    string result = 1;
}

message HelloRequest1 {
    repeated string name = 1;
}

message HelloResponse1 {
    string result = 1;
}

service HelloService {
    rpc Hello(HelloRequest) returns (HelloResponse) {}
    rpc Hello1(HelloRequest1) returns (HelloResponse1) {}
}
```

```java
package com.grpc.service;

import com.google.protobuf.ProtocolStringList;
import com.grpc.HelloProto;
import com.grpc.HelloServiceGrpc;
import io.grpc.stub.StreamObserver;

/**
 * @author: tianqi shan
 * @create: 2024-08-08 17:19
 * @description:
 **/
public class HelloServiceImpl extends HelloServiceGrpc.HelloServiceImplBase{
    @Override
    public void hello1(HelloProto.HelloRequest1 request, StreamObserver<HelloProto.HelloResponse1> responseObserver) {
        ProtocolStringList nameList = request.getNameList();
        for (String s : nameList) {
            System.out.println("s = " + s);
        }

        System.out.println("HelloServiceImpl.hello1");

        HelloProto.HelloResponse1.Builder builder = HelloProto.HelloResponse1.newBuilder();
        builder.setResult("ok");

        HelloProto.HelloResponse1 helloResponse1 = builder.build();

        responseObserver.onNext(helloResponse1);
        responseObserver.onCompleted();
    }
```

```java
package com.grpc;

import io.grpc.ManagedChannel;
import io.grpc.ManagedChannelBuilder;

/**
 * @author: tianqi shan
 * @create: 2024-08-08 19:20
 * @description:
 **/
public class GrpcClient2 {
    public static void main(String[] args) {
        // 1、创建通信的管道
        ManagedChannel managedChannel = ManagedChannelBuilder.forAddress("localhost", 9000).usePlaintext().build();
        try {
            // 2、获得代理对象 stub
            HelloServiceGrpc.HelloServiceBlockingStub helloService = HelloServiceGrpc.newBlockingStub(managedChannel);
            // 3、完成RPC调用
            // 3.1、准备参数
            HelloProto.HelloRequest1.Builder builder = HelloProto.HelloRequest1.newBuilder();
            builder.addName("shantq1");
            builder.addName("shantq2");
            builder.addName("shantq3");
            HelloProto.HelloRequest1 build = builder.build();
            // 3.2、进行功能RPC调用，获取相应内容
            HelloProto.HelloResponse1 helloResponse = helloService.hello1(build);
            String result = helloResponse.getResult();
            System.out.println("result：" + result);
        } catch (Exception e) {
            throw new RuntimeException(e);
        } finally {
            managedChannel.shutdown();
        }
    }
}
```

* tips

  ```java
  responseObserver.onNext(helloResponse1); // 通过这个方法 把响应的消息 回传client
  responseObserver.onCompleted();          // 通知client 整个服务结束  底层返回标记
  																				// client就会监听标记 【grpc做的】
  ```

-----

## 2.4 gRPC的四种通信方式

---

**一、简单rpc 一元rpc（Unary RPC）**

第一个RPC程序，实际上就是一元RPC

* 特点

<img src="https://tonkyshan.cn/img/20240809113741.png" alt="20240809113741.png" style="zoom:40%;" />

当client发起调用后，提交数据，并且等待 服务器响应

开发过程中，主要采用就是一元RPC的这种通信方式

* 语法

```protobuf
service HelloService {
    rpc Hello(HelloRequest) returns (HelloResponse) {}
    rpc Hello1(HelloRequest1) returns (HelloResponse1) {}
}
```

**二、服务端流式RPC（Server Streaming RPC）**

一个请求对象，服务端可以回传多个结果对象

<img src="https://tonkyshan.cn/img/20240809115637.png" alt="20240809115637.png" style="zoom:40%;" />

错误的认知：

* 认为服务端返回的是一组数据 就应该封装在一个List中，如果这样进行，叫做返回一个结果

返回的多组数据不一定同时返回



使用场景：

* 查询股票行情

语法：

```protobuf
service HelloService {
    rpc Hello(HelloRequest) returns (HelloResponse) {}
    rpc Hello1(HelloRequest1) returns (HelloResponse1) {}
    rpc C2ss(HelloRequest) returns (stream HelloResponse) {} //服务端流式rpc
}
```

```java
package com.grpc.service;

import com.google.protobuf.ProtocolStringList;
import com.grpc.HelloProto;
import com.grpc.HelloServiceGrpc;
import io.grpc.stub.StreamObserver;

/**
 * @author: tianqi shan
 * @create: 2024-08-08 17:19
 * @description:
 **/
public class HelloServiceImpl extends HelloServiceGrpc.HelloServiceImplBase{

    @Override
    public void c2ss(HelloProto.HelloRequest request, StreamObserver<HelloProto.HelloResponse> responseObserver) {
        //1、接收client的请求参数
        String name = request.getName();
        //2、做业务处理
        System.out.println("name = " + name);
        //3、根据业务处理的结果，提供响应
        for (int i = 0; i < 10; i++) {
            HelloProto.HelloResponse.Builder builder = HelloProto.HelloResponse.newBuilder();
            builder.setResult("处理的结果" + i);
            HelloProto.HelloResponse build = builder.build();

            responseObserver.onNext(build);

            try {
                Thread.sleep(1000);
            } catch (InterruptedException e) {
                throw new RuntimeException(e);
            }
        }

        responseObserver.onCompleted();
    }
}

```

```java
package com.grpc;

import com.grpc.service.HelloServiceImpl;
import io.grpc.Server;
import io.grpc.ServerBuilder;

import java.io.IOException;

/**
 * @author: tianqi shan
 * @create: 2024-08-08 17:50
 * @description:
 **/
public class GrpcServer1 {
    public static void main(String[] args) throws IOException, InterruptedException {
        //1、绑定端口
        ServerBuilder serverBuilder = ServerBuilder.forPort(9000);
        //2、发布服务
        serverBuilder.addService(new HelloServiceImpl());
        //3、创建服务对象
        Server server = serverBuilder.build();

        server.start();
        server.awaitTermination();
    }
}
```

```java
package com.grpc;

import io.grpc.ManagedChannel;
import io.grpc.ManagedChannelBuilder;

import java.util.Iterator;

/**
 * @author: tianqi shan
 * @create: 2024-08-08 19:20
 * @description:
 **/
public class GrpcClient3 {
    public static void main(String[] args) {
        // 1、创建通信的管道
        ManagedChannel managedChannel = ManagedChannelBuilder.forAddress("localhost", 9000).usePlaintext().build();
        try {
            // 2、获得代理对象 stub  （阻塞的形式，等待服务端响应时不能异步处理任务，不符合真正的开发需求）
            HelloServiceGrpc.HelloServiceBlockingStub helloService = HelloServiceGrpc.newBlockingStub(managedChannel);
            // 3、完成RPC调用
            // 3.1、准备参数
            HelloProto.HelloRequest.Builder builder = HelloProto.HelloRequest.newBuilder();
            builder.setName("shantq");
            HelloProto.HelloRequest helloRequest = builder.build();
            // 3.2、进行功能RPC调用，获取相应内容
            Iterator<HelloProto.HelloResponse> helloResponseIterator = helloService.c2ss(helloRequest);
            while (helloResponseIterator.hasNext()) System.out.println("result: " + helloResponseIterator.next().getResult());
        } catch (Exception e) {
            throw new RuntimeException(e);
        } finally {
            managedChannel.shutdown();
        }
    }
}

/*
	监听 异步方式 处理服务端流式RPC的开发
	1、api
	2、server
	3、client
*/
package com.grpc;

import io.grpc.ManagedChannel;
import io.grpc.ManagedChannelBuilder;
import io.grpc.stub.StreamObserver;

import java.util.Iterator;
import java.util.concurrent.TimeUnit;

/**
 * @author: tianqi shan
 * @create: 2024-08-08 19:20
 * @description:
 **/
public class GrpcClient4 {
    public static void main(String[] args) {
        // 1、创建通信的管道
        ManagedChannel managedChannel = ManagedChannelBuilder.forAddress("localhost", 9000).usePlaintext().build();
        try {
            // 2、获得代理对象 stub
            HelloServiceGrpc.HelloServiceStub helloService = HelloServiceGrpc.newStub(managedChannel);
            // 3、完成RPC调用
            // 3.1、准备参数
            HelloProto.HelloRequest.Builder builder = HelloProto.HelloRequest.newBuilder();
            builder.setName("shantq");
            HelloProto.HelloRequest helloRequest = builder.build();
            // 3.2、进行功能RPC调用，获取相应内容
            helloService.c2ss(helloRequest, new StreamObserver<HelloProto.HelloResponse>() {
                @Override
                public void onNext(HelloProto.HelloResponse helloResponse) {
                    // 服务端 响应了 一个消息后 如果需要立即处理，把代码写在这个方法中
                    System.out.println("服务端每一次响应端信息" + helloResponse.getResult());
                }

                @Override
                public void onError(Throwable throwable) {
                    System.out.println("ERROR!!!");
                }

                @Override
                public void onCompleted() {
                    // 需要把服务端 响应端所有数据 拿到后 再进行业务处理
                    System.out.println("需要把服务端 响应端所有数据 拿到后 再进行业务处理");
                }
            });

            managedChannel.awaitTermination(11, TimeUnit.SECONDS);
        } catch (Exception e) {
            throw new RuntimeException(e);
        } finally {
            managedChannel.shutdown();
        }
    }
}
```

**三、客户端流式RPC（Client Streaming RPC）**

客户端发送多个请求对象，服务端只返回一个结果

应用场景：IOT(物联网【传感器】向服务端 发送数据)



语法：

```protobuf
rpc Cs2s(stream HelloRequest) returns (HelloResponse) {}
```

```java
package com.grpc.service;

import com.google.protobuf.ProtocolStringList;
import com.grpc.HelloProto;
import com.grpc.HelloServiceGrpc;
import io.grpc.stub.StreamObserver;

/**
 * @author: tianqi shan
 * @create: 2024-08-08 17:19
 * @description:
 **/
public class HelloServiceImpl extends HelloServiceGrpc.HelloServiceImplBase{

    @Override
    public StreamObserver<HelloProto.HelloRequest> cs2s(StreamObserver<HelloProto.HelloResponse> responseObserver) {
        return new StreamObserver<HelloProto.HelloRequest>() {
            @Override
            public void onNext(HelloProto.HelloRequest helloRequest) {
                System.out.println("接收到了client发送的消息" + helloRequest.getName());
                HelloProto.HelloResponse.Builder builder = HelloProto.HelloResponse.newBuilder();
                builder.setResult("this is result");
                HelloProto.HelloResponse build = builder.build();
                responseObserver.onNext(build);
                responseObserver.onCompleted();
            }

            @Override
            public void onError(Throwable throwable) {

            }

            @Override
            public void onCompleted() {
                System.out.println("client的所有消息 都发送到了 服务端...");
                /*
                如果想让server都接收完client发送的数据之后再统一处理，可以将response结果在onCompleted里设置，否则可以在onNext中设置(接收一条，响应一条)
                HelloProto.HelloResponse.Builder builder = HelloProto.HelloResponse.newBuilder();
                builder.setResult("this is result");
                HelloProto.HelloResponse build = builder.build();
                responseObserver.onNext(build);
                responseObserver.onCompleted();*/
            }
        };
    }
}

// server不用变 同上 通信用的netty  实现：绑定接口 发布服务 创建服务对象
```

```java
package com.grpc;

import io.grpc.ManagedChannel;
import io.grpc.ManagedChannelBuilder;
import io.grpc.stub.StreamObserver;

import java.util.concurrent.TimeUnit;

/**
 * @author: tianqi shan
 * @create: 2024-08-08 19:20
 * @description:
 **/
public class GrpcClient5 {
    public static void main(String[] args) {
        // 1、创建通信的管道
        ManagedChannel managedChannel = ManagedChannelBuilder.forAddress("localhost", 9000).usePlaintext().build();
        try {
            // 2、获得代理对象 stub
            HelloServiceGrpc.HelloServiceStub helloService = HelloServiceGrpc.newStub(managedChannel);
            // 3、完成RPC调用
            StreamObserver<HelloProto.HelloRequest> streamObserver = helloService.cs2s(new StreamObserver<HelloProto.HelloResponse>() {
                @Override
                public void onNext(HelloProto.HelloResponse helloResponse) {
                    // 监控响应
                    System.out.println("服务端 响应 数据内容为：" + helloResponse.getResult());
                }

                @Override
                public void onError(Throwable throwable) {

                }

                @Override
                public void onCompleted() {
                    System.out.println("服务端响应结束...");
                }
            });

            // 客户端发送数据到服务端 多条数据 不定时
            for (int i = 0; i < 10; i++) {
                HelloProto.HelloRequest.Builder builder = HelloProto.HelloRequest.newBuilder();
                builder.setName("shantq " + i);
                HelloProto.HelloRequest build = builder.build();

                streamObserver.onNext(build);
                Thread.sleep(1000);
            }

            streamObserver.onCompleted();
            managedChannel.awaitTermination(11, TimeUnit.SECONDS);
        } catch (Exception e) {
            throw new RuntimeException(e);
        } finally {
            managedChannel.shutdown();
        }
    }
}
```

**四、双向流RPC（Bi-directional Stream RPC）**

客户端可以发送多个请求消息，服务器响应多个响应消息

<img src="https://tonkyshan.cn/img/20240812115511.png" alt="20240812115511.png" style="zoom:50%;" />

应用场景：聊天室

```java
package com.grpc.service;

import com.google.protobuf.ProtocolStringList;
import com.grpc.HelloProto;
import com.grpc.HelloServiceGrpc;
import io.grpc.stub.StreamObserver;

/**
 * @author: tianqi shan
 * @create: 2024-08-08 17:19
 * @description:
 **/
public class HelloServiceImpl extends HelloServiceGrpc.HelloServiceImplBase{
    @Override
    public StreamObserver<HelloProto.HelloRequest> cs2ss(StreamObserver<HelloProto.HelloResponse> responseObserver) {
        return new StreamObserver<HelloProto.HelloRequest>() {
            @Override
            public void onNext(HelloProto.HelloRequest helloRequest) {
                System.out.println("接收到client 提交的消息 " + helloRequest.getName());
                responseObserver.onNext(HelloProto.HelloResponse.newBuilder().setResult("response " + helloRequest.getName() + "result ").build());

            }

            @Override
            public void onError(Throwable throwable) {

            }

            @Override
            public void onCompleted() {
                System.out.println("接收了所有的请求消息...");
                responseObserver.onCompleted();
            }
        };
    }
}
```

```java
package com.grpc;

import io.grpc.ManagedChannel;
import io.grpc.ManagedChannelBuilder;
import io.grpc.stub.StreamObserver;

import java.util.concurrent.TimeUnit;

/**
 * @author: tianqi shan
 * @create: 2024-08-08 19:20
 * @description:
 **/
public class GrpcClient6 {
    public static void main(String[] args) {
        // 1、创建通信的管道
        ManagedChannel managedChannel = ManagedChannelBuilder.forAddress("localhost", 9000).usePlaintext().build();
        try {
            // 2、获得代理对象 stub
            HelloServiceGrpc.HelloServiceStub helloService = HelloServiceGrpc.newStub(managedChannel);
            // 3、完成RPC调用
            StreamObserver<HelloProto.HelloRequest> streamObserver = helloService.cs2ss(new StreamObserver<HelloProto.HelloResponse>() {
                @Override
                public void onNext(HelloProto.HelloResponse helloResponse) {
                    System.out.println("响应的结果 " + helloResponse.getResult());
                }

                @Override
                public void onError(Throwable throwable) {

                }

                @Override
                public void onCompleted() {
                    System.out.println("响应全部结束...");
                }
            });

            for (int i = 0; i < 10; i++) {
                streamObserver.onNext(HelloProto.HelloRequest.newBuilder().setName("shantq " + i).build());
            }
            streamObserver.onCompleted();

            managedChannel.awaitTermination(11, TimeUnit.SECONDS);
        } catch (Exception e) {
            throw new RuntimeException(e);
        } finally {
            managedChannel.shutdown();
        }
    }
}
```

----

## 2.5 gRPC代理方式

-----

一、BlockingStub

* 阻塞 通信方式

二、Stub

* 异步 通过监听处理

三、FutureStub

* 同步 异步 NettyFuture
* FutureStub只能应用 一元RPC

```protobuf
syntax = "proto3";

option java_multiple_files = false;
option java_package = "com.grpc";
option java_outer_classname = "TestProto";

message TestRequest {
    string name = 1;
}

message TestResponse {
    string result = 1;
}

service TestService {
    rpc Test1(TestRequest) returns (TestResponse) {};
}
```

```java
package com.grpc.service;

import com.grpc.TestProto;
import com.grpc.TestServiceGrpc;
import io.grpc.stub.StreamObserver;

/**
 * @author: tianqi shan
 * @create: 2024-08-12 15:15
 * @description:
 **/
public class TestServiceImpl extends TestServiceGrpc.TestServiceImplBase {
    @Override
    public void test1(TestProto.TestRequest request, StreamObserver<TestProto.TestResponse> responseObserver) {
        String name = request.getName();
        System.out.println("name = " + name);

        responseObserver.onNext(TestProto.TestResponse.newBuilder().setResult("test is ok").build());
        responseObserver.onCompleted();
    }
}
```

```java
package com.grpc;

import com.grpc.service.HelloServiceImpl;
import com.grpc.service.TestServiceImpl;
import io.grpc.Server;
import io.grpc.ServerBuilder;

import java.io.IOException;

/**
 * @author: tianqi shan
 * @create: 2024-08-08 17:50
 * @description:
 **/
public class GrpcServer1 {
    public static void main(String[] args) throws IOException, InterruptedException {
        //1、绑定端口
        ServerBuilder serverBuilder = ServerBuilder.forPort(9000);
        //2、发布服务
        serverBuilder.addService(new HelloServiceImpl());
        serverBuilder.addService(new TestServiceImpl());
        //3、创建服务对象
        Server server = serverBuilder.build();

        server.start();
        server.awaitTermination();
    }
}
```

```java
package com.grpc;

import com.google.common.util.concurrent.FutureCallback;
import com.google.common.util.concurrent.Futures;
import com.google.common.util.concurrent.ListenableFuture;
import io.grpc.ManagedChannel;
import io.grpc.ManagedChannelBuilder;
import org.checkerframework.checker.nullness.compatqual.NullableDecl;

import java.util.concurrent.Executors;
import java.util.concurrent.TimeUnit;

/**
 * @author: tianqi shan
 * @create: 2024-08-08 19:20
 * @description:
 **/
public class GrpcClient7 {
    public static void main(String[] args) {
        // 1、创建通信的管道
        ManagedChannel managedChannel = ManagedChannelBuilder.forAddress("localhost", 9000).usePlaintext().build();
        try {
            // 2、获得代理对象 stub
            TestServiceGrpc.TestServiceFutureStub testServiceFutureStub = TestServiceGrpc.newFutureStub(managedChannel);
            // 3、完成RPC调用
            ListenableFuture<TestProto.TestResponse> future = testServiceFutureStub.test1(TestProto.TestRequest.newBuilder().setName("shantq").build());
            /*
            同步操作
            TestProto.TestResponse testResponse = future.get();
            System.out.println(testResponse.getResult());*/

            /*
            future.addListener(() -> {
                System.out.println("异步的rpc响应 回来了");
            }, Executors.newCachedThreadPool());*/

            Futures.addCallback(future, new FutureCallback<TestProto.TestResponse>() {
                @Override
                public void onSuccess(@NullableDecl TestProto.TestResponse testResponse) {
                    System.out.println("result：" + testResponse.getResult());
                }

                @Override
                public void onFailure(Throwable throwable) {

                }
            }, Executors.newCachedThreadPool());

            System.out.println("后续的操作...");
            managedChannel.awaitTermination(11, TimeUnit.SECONDS);
        } catch (Exception e) {
            throw new RuntimeException(e);
        } finally {
            managedChannel.shutdown();
        }
    }
}
```

-----

## 2.6 gRPC与SpringBoot整合

---

<img src="https://tonkyshan.cn/img/20240812155942.png" alt="20240812155942.png" style="zoom:40%;" />

<img src="https://tonkyshan.cn/img/20240813095042.png" alt="20240813095042.png" style="zoom:50%;" />

一、搭建SpringBoot开发环境

二、引入与Grpc相关的内容（服务端和客户端都要引）

```xml
<dependency>
    <groupId>org.example</groupId>
    <artifactId>rpc-grpc-api</artifactId>
    <version>1.0-SNAPSHOT</version>
</dependency>

<dependency>
    <groupId>net.devh</groupId>
    <artifactId>grpc-server-spring-boot-starter</artifactId>
    <version>2.12.0.RELEASE</version>
</dependency>
```

三、开发服务

```java
// server
package com.example.service;

import com.grpc.HelloProto;
import com.grpc.HelloServiceGrpc;
import io.grpc.stub.StreamObserver;
import net.devh.boot.grpc.server.service.GrpcService;

@GrpcService
public class HelloServiceImpl extends HelloServiceGrpc.HelloServiceImplBase {
    @Override
    public void hello(HelloProto.HelloRequest request, StreamObserver<HelloProto.HelloResponse> responseObserver) {
        String name = request.getName();
        System.out.println("name = " + name);
        responseObserver.onNext(HelloProto.HelloResponse.newBuilder().setResult("this is result...").build());
        responseObserver.onCompleted();
    }
}
```

```yaml
# 核心配置的 就是gRPC服务的端口号
spring:
  application:
    name: boot-server
  main:
    web-application-type: none #不启动tomcat

grpc:
  server:
    port: 9000
```

```java
// client
package com.grpc.controller;

import com.grpc.HelloProto;
import com.grpc.HelloServiceGrpc;
import net.devh.boot.grpc.client.inject.GrpcClient;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class TestController {

    @GrpcClient("grpc-server")
    private HelloServiceGrpc.HelloServiceBlockingStub stub;

    @RequestMapping("/test1")
    public String test1(String name) {
        System.out.println("name = " + name);
        HelloProto.HelloResponse hello = stub.hello(HelloProto.HelloRequest.newBuilder().setName(name).build());
        return hello.getResult();
    }
}
```

```yaml
spring:
  application:
    name: boot-client

grpc:
  client:
    grpc-server:
      address: 'static://127.0.0.1:9000'
      negotiation-type: plaintext
```

-----

## 2.7 gRPC的高级应用

-----

一、拦截器 一元拦截器

二、Stream Tracer [监听流] 流式拦截器

三、Retry Policy 客户端重试机制

四、NameResolver

* consule
* ectd

五、负载均衡（pick-first，轮询）

六、grpc与微服务整合

* 序列化（protobuf）Dobbo
* grpc                        Dobbo
* grpc                        GateWay
* grpc                        JWT
* grpc                        Nacos2.0
* grpc                        OpenFeign
