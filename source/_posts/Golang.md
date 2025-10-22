---
title: Golang
date: 2025-05-28 10:18:27
tags: [Golang]
categories: [Golang]
---

# Golang

---

## 第一章 基础

----

Go语言保证了既能达到静态编译语言的安全和特性，又达到了动态语言开发维护的高效率，使用一个表达式来形容Go语言：

**Go = C + Python**

说明Go语言既有C静态语言程序的运行速度，又能达到python动态语言的快速开发

1、从C语言中继承了很多理念，包括表达式语法，控制结构，基础数据类型，调用参数传值，指针等等，也保留了和C语言一样的编译执行方式及弱化的指针

2、引入包的概念，用于组织程序结构，Go语言的一个文件都要归属于一个包，而不能单独的存在

3、垃圾回收机制，内存自动回收，不需要开发人员管理

4、天然并发

* 从语言层面支持并发，实现简单
* goroutine，轻量级线程，可实现大并发处理，高效利用多核
* 基于CPS并发模型(Communicating Sequential Processes) 实现

5、吸收了管道通信机制，形成Go语言特有的管道channel，通过管道channel，可以实现不同的goroute之间的相互通信

6、函数返回多个值

7、新的创新：比如切片slice，延时执行defer等

-----

### 1.1 Golang执行流程分析

---

一、如果是对源码编译后，再执行，Go的执行流程如下

```mermaid
flowchart LR
    InputData[.go文件 源文件] --> |go build 编译| Input1Data[可执行文件 .exe或可执行文件]
    Input1Data[可执行文件 .exe或可执行文件] --> |运行|Input2Data[结果]
```

二、如果我们是对源码直接执行 go run 源码，Go的流程如下图



```mermaid
flowchart LR
    InputData[.go文件 源文件] --> |go run 编译运行一步| Input1Data[结果]
```

说明：两种执行流程的方式区别

1、如果我们先编译了可执行文件，那么我们可以将该可执行文件拷贝到没有go开发环境的机器上，仍然可以运行

2、如果我们是直接go run go源码，那么如果要在另外一个机器上这么运行，也需要go开发环境，否则无法执行

3、在编译时，编译器会将程序运行依赖的库文件包含在可执行文件中，所以，可执行文件变大了很多

---

### 1.2 语法

----

数据类型

* 基本数据类型：
  * 数值型
    * 整数类型 int int8 int16 int32 int64 uint unint8 unint16 unint32 unint64 byte
    * 浮点类型 float32 float64
  * 字符型
  * 布尔型 bool
  * 字符串型 string
* 派生/复杂数据类型：
  * 指针 Pointer
  * 数组
  * 结构体 struct
  * 管道 Channel
  * 函数
  * 切片 slice
  * 接口 interface
  * map

```go
// 声明变量
package main

import (
  "fmt"
)

func main() {
  s := "gopher"
  fmt.Println("Hello and welcome, %s!", s)

  for i := 1; i <= 5; i++ {
		fmt.Println("i =", 100/i)
  }
}
```



















