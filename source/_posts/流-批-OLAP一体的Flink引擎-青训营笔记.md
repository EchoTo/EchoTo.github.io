---
title: 流/批/OLAP一体的Flink引擎 | 青训营笔记
date: 2022-07-31 11:40:58
tags: [大数据,流/批/OLAP一体的Flink引擎]
categories: 大数据 
---

## 流/批/OLAP一体的Flink引擎

------

### 1.1Flink概述

---------

#### 1.1.1Apache Flink的诞生背景

------

一、什么是大数据

大数据(Big Data)：指无法在一定时间内用常规软件工具对其进行获取、存储、管理和处理的数据集合。

* 价值化：Value
* 海量化：Volumes
* 快速化：Velocity
* 多样化：Variety

二、发展历史

| 史前阶段~2006 | Hadoop     | Spark        | Flink               |
| ------------- | ---------- | ------------ | ------------------- |
| 传统数仓      | 分布式     | 批处理       | 流计算              |
| Oracle        | Map-Reduce | 流处理       | 实时、更快          |
| 单机          | 离线计算   | SQL高阶API   | 流批一体            |
| 黑箱使用      |            | 内存迭代计算 | Streaming/Batch SQL |

三、为什么需要流式计算

大数据实时性带来**价值更大**

| 批式计算            | 流式计算               |
| ------------------- | ---------------------- |
| 离线计算，非实时    | 实时计算，快速、低延迟 |
| 静态数据集          | 无线流、动态、无边界   |
| 小时/天等周期性计算 | 7 * 24h持续运行        |
|                     | 流批一体               |

----

#### 1.1.2为什么Apache Flink会脱颖而出

-----

* Storm
  * Storm API 的 low-level 以及开发效率低下
  * 一致性问题：Storm 更多考虑到实时流计算的处理时延而非数据的一致性保证
* Spark Streaming
  * Spark Streaming 相比于 Storm 的低阶 API 以及无法正确性语义保证，Spark 是流处理的分水岭：第一个广泛使用的大规模流处理引擎，既提供较为高阶的 API 抽象，同时提供流式处理正确性保证

![QQ截图20220731120312.png](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/d7e04b47dd6a4343a2d59d9edcd2ed70~tplv-k3u1fbpfcp-watermark.image?)

* Flink
  * Exactly-Once：精确一次的计算语义
  * 状态容错：Checkpoint
  * Dataflow编程模型，Window等高阶需求支持友好
  * 流批一体

-----

#### 1.1.3Apache Flink开源生态

---------

* 流批一体：支持流式计算和批式计算

* OLAP：Flink 可以支持 OLAP 这种短查询场景

* Flink ML：pyFlink、ALink、AIFlow 等生态支持 Flink 在 ML 场景的应用

* Gelly：图计算

* Stateful Function：支持有状态的 FAAS 场景
* . . .

![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/fefa1a6cd1ff4943b136a0e001d5153c~tplv-k3u1fbpfcp-zoom-in-crop-mark:3024:0:0:0.awebp)

[来自](https://juejin.cn/post/7122754431371706404#heading-14)

------

### 1.2Flink整体架构

-------

#### 1.2.1Flink分层架构

--------

**一、SDK层**

Flink的SDK目前主要有三类：SQL/Table、DataStream、Python

**二、执行引擎层(Runtime层)**

执行引擎层提供了统一的DAG，用来描述数据处理的Pipeline，不管是流还是批，都会转化为DAG图，调度层再把DAG转化成分布式环境下的Task，Task之间通过Shuffle传输数据。

**三、状态存储层**

负责存储算子的状态信息

**四、资源调度层**

目前Flink可以支持部署在多种环境

------

#### 1.2.2Flink整体架构

--------

一个Flink集群，主要包括以下两个核心组件：

**一、JobManager(JM)**

负责整个任务的协调工作，包括：调度task、触发协调Task做Checkpoint、协调容错恢复等

- Dispatcher: 接收作业，拉起 JobManager 来执行作业，并在 JobMaster 挂掉之后恢复作业
- JobMaster: 管理一个 job 的整个生命周期，会向 ResourceManager 申请 slot，并将 task 调度到对应 TM 上
- ResourceManager：负责 slot 资源的管理和调度，Task manager 拉起之后会向 RM 注册

![QQ截图20220731130248.png](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/9c807b1243784d36ab7b33f90622fea3~tplv-k3u1fbpfcp-watermark.image?)

**二、TaskManager(TM)**

负责执行一个DataFlow Graph的各个task以及data streams的buffer和数据交换

![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/8398ed4aebcd474594f9070ce91bb0e5~tplv-k3u1fbpfcp-zoom-in-crop-mark:3024:0:0:0.awebp)

-------

#### 1.2.3Flink如何做到流批一体

--------

**一、为什么需要流批一体**

抖音：实时统计短视频播放量，点赞数。按天统计创造者的一些数据信息，如昨天的播放量多少。

![QQ截图20220731132741.png](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/77c32a809e444091a8f3b20cf1e49bfa~tplv-k3u1fbpfcp-watermark.image?)

这种架构有一些痛点：

- 人力成本比较高：批、流两套系统，相同逻辑需要开发两遍
- 数据链路冗余：本身计算内容是一致的，由于是两套链路，相同逻辑需要运行两遍，产生一定的资源浪费
- 数据口径不一致：两套系统、两套算子、两套 UDF，通常会产生不同程度的误差，这些误差会给业务方带来非常大的困扰

**二、流批一体的挑战**

| 流式计算           | 批式计算                             |
| ------------------ | ------------------------------------ |
| 实时计算           | 离线计算                             |
| 延迟在秒级以内     | 处理时间为分钟到小时级别，甚至天级别 |
| 0 ~ 1s             | 10s ~ 1h+                            |
| 广告推荐、金融风控 | 搜索引擎构建索引、批式数据分析       |

批式计算相比于流式计算核心区别：

| 维度   | 流式计算                       | 批式计算                               |
| ------ | ------------------------------ | -------------------------------------- |
| 数据流 | 无限数据集                     | 有限数据集                             |
| 时延   | 低延迟、业务会感知运行中的情况 | 实时性要求不高，只关注最终结果产出时间 |

**三、Flink如何做到流批一体**

批式计算是流式计算的特例，Everything is Streams，有界数据集（批式数据）也是一种数据流、一种特殊的数据流

![QQ截图20220731133357.png](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/2d3f271cf85d42f581ce33c2a1d7ac77~tplv-k3u1fbpfcp-watermark.image?)

站在 Flink 的角度，Everything is Streams，无边界数据集是一种数据流，一个无边界的数据流可以按时间切段成一有边界的数据集，所以有界数据集（批式数据）也是一种数据流。因此，不管是有边界的数据集（批式数据）还是无边界数据集，Flink 都可以天然地支持，这是 Flink 支持流批一体的基础。并且 Flink 在流批一体上，从上面的 API 到底层的处理机制都是统一的，是真正意义上的流批一体

Apache Flink 主要从以下几个模块来做流批一体：

- SQL 层
- DataStream API 层统一，批和流都可以使用 DataStream API 来开发
- Scheduler 层架构统一，支持流批场景
- Failover Recovery 层 架构统一，支持流批场景
- Shuffle Service 层架构统一，流批场景选择不同的 Shuffle Service

**四、流批一体的Scheduler层**

Scheduler 主要负责将作业的 DAG 转化为在分布式环境中可以执行的 Task

在1.12之前的Flink版本中，Flink支持以下两种调度模式：

| 模式  | 特点                                                         | 场景           |
| ----- | ------------------------------------------------------------ | -------------- |
| EAGER | 申请一 个作业所需要的全部资源，然后同时调度。这个作业的全部Task，所有的Task之间采取。Pipeline的方式进行通信 | Stream作业场景 |
| LAZY  | 先调度上游，等待上游产生数据或结束后再调度。下游，类似Spark的Stage执行模式。 | Batch作业场景  |

EAGER模式（Streaming 场景）

* 12个task会一起调度，集群需要有足够的资源
* 申请一个作业所需要的全部资源，然后同时调度这个作业的全部 Task，所有的 Task 之间采取 Pipeline 的方式进行通信

LAZY（Batch 场景）

* 最小调度一个 task即可，集群有1个slot资源可以运行
* 先调度上游，等待上游产生数据或结束后再调度下游，类似 Spark 的 Stage 执行模式

Pipeline Region

由Pipeline的数据交换方式连接的Task构成一个Pipeline Region

本质上，不管是流作业还是批作业，都是按照Pipeline Region粒度来申请资源和调度任务

ALL_EDGES_BLOCKIN

* 所有Task之间的数据交换都是BLOCKING模式
* 分为12个pipeline region

ALL_EDGES_PIPELINED

* 所有Task之间的数据交换都是PIPELINED模式
* 分为1个pipeline region

**五、流批一体的Shuffle Service层**

Shuffle：在分布式计算中，用来连接上下游数据交互的过程叫做 Shuffle。

实际上，分布式计算中所有涉及到上下游衔接的过程，都可以理解为 Shuffle

Shuffle 分类：

- 基于文件的 Pull Based Shuffle，比如 Spark 或 MR，它的特点是具有较高的容错性，适合较大规模的批处理作业，由于是基于文件的，它的容错性和稳定性会更好一些
- 基于 Pipeline 的 Push Based Shuffle，比如 Flink、Storm、Presto 等，它的特点是低延迟和高性能，但是因为 shuffle 数据没有存储下来，如果是 batch 任务的话，就需要进行重跑恢复

流和批 Shuffle 之间的差异：

- Shuffle 数据的生命周期：流作业的 Shuffle 数据与 Task 是绑定的，而批作业的 Shuffle 数据与 Task 是解耦的
- Shuffle 数据存储介质：流作业的生命周期比较短、而且流作业为了实时性，Shuffle 通常存储在内存中，批作业因为数据量比较大以及容错的需求，一般会存储在磁盘里
- Shuffle 的部署方式：流作业 Shuffle 服务和计算节点部署在一起，可以减少网络开销，从而减少 latency，而批作业则不同

Pluggable Shuffle Service：Flink 的目标是提供一套统一的 Shuffle 架构，既可以满足不同 Shuffle 在策略上的定制，同时还能避免在共性需求上进行重复开发

Flink 流批一体总结

- 经过相应的改造和优化之后，Flink 在架构设计上，针对 DataStream 层、调度层、Shuffle Service 层，均完成了对流和批的支持
- 业务已经可以非常方便地使用 Flink 解决流和批场景的问题了

------

### 1.3Flink架构优化

----------

#### 1.3.1流/批/OLAP业务场景概述

------

三种业务场景的特点：

| 流式计算           | 批式计算                             | 交互式分析     |
| ------------------ | ------------------------------------ | -------------- |
| 实时计算           | 离线计算                             | OLAP           |
| 延迟在秒级以内     | 处理时间为分钟到小时级别，甚至天级别 | 处理时间秒级   |
| 0 ~ 1s             | 10s ~ 1h+                            | 1 ~ 10s        |
| 广告推荐、金融风控 | 搜索引擎构建索引、批式数据分析       | 数据分析BI报表 |

三种业务场景的解决方案的要求及带来的挑战：

| 模块     | 流式计算                                     | 批式计算                   | 交互式分析(OLAP)                         |
| -------- | -------------------------------------------- | -------------------------- | ---------------------------------------- |
| SQL      | Yes                                          | Yes                        | Yes                                      |
| 实时性   | 高、处理延迟毫秒级别                         | 低                         | 高、查询延迟在秒级，但要求**高并发查询** |
| 容错能力 | 高                                           | 中，大作业失败重跑代价高   | No，失败重试即可                         |
| 状态     | Yes                                          | No                         | No                                       |
| 准确性   | Exactly Once，要求高，重跑需要恢复之前的状态 | Exactly Once，失败重跑即可 | Exactly Once，失败重跑即可               |
| 扩展性   | Yes                                          | Yes                        | Yes                                      |

--------

#### 1.3.2为什么三种场景可以用一套引擎来解决

--------

场景上对比发现：

- 批式计算是流式计算的特例，Everything is Streams，有界数据集（批式数据）也是一种数据流、一种特殊的数据流
- OLAP 计算是一种特殊的批式计算，它对并发和实时性要求更高，其他情况与普通批式作业没有特别大区别

Apache Flink从流式计算出发，需要想支持Batch和OLAP场景，就需要解决下面的问题：

| Batch场景需求        | OLAP场景需求   |
| -------------------- | -------------- |
| 流批一体支持         | 短查询作业场景 |
| Unify DataStream API | 高并发支持     |
| Scheduler            | 极致处理性能   |
| Shuffle Service      |                |
| Failover Recovery    |                |

-------

#### 1.3.3Flink如何支持OLAP场景

-------

一、Flink 做 OLAP 的优势

- 统一引擎：流处理、批处理、OLAP 统一使用 Flink 引擎
  - 降低学习成本，仅需要学习一个引擎
  - 提高开发效率，很多 SQL 是流批通
  - 提高维护效率，可以更集中维护好一个引擎
- 既有优势：利用 Flink 已有的很多特性，使 OLAP 使用场景更为广泛
  - 使用流处理的内存计算、Pipeline
  - 支持代码动态生成
  - 也可以支持批处理数据落盘能力
- 相互增强：OLAP 能享有现有引擎的优势，同时也能增强引擎能力
  - 无统计信息场景的优化
  - 开发更高效的算子
  - 使 Flink 同时兼备流、批、OLAP 处理的能力，成为更通用的框架

二、Flink OLAP 场景的挑战

- 秒级和毫秒级的小作业
- 作业频繁启停、资源碎片
  - Flink OLAP 计算相比流式和批式计算，最大的特点是 Flink OLAP 计算是一个面向秒级和毫秒级的小作业，作业在启动过程中会频繁申请内存、网络以及磁盘资源，导致 Flink 集群内产生大量的资源碎片
- Latency + 高 APS 要求
  - OLAP 最大的特点是查询作业对 Latency 和 QPS 有要求的，需要保证作业在 Latency 的前提下提供比较高的并发调度和执行能力，这就对 Flink 引擎提出了一个新的要求

三、Flink OLAP 架构现状

- Client：提交 SQL Query
- Gateway：接收 Client 提交的 SQL Query，对 SQL 进行语法解析和查询优化，生成 Flink 作业执行计划，提交给 Session 集群
- Session Cluster：执行作业调度及计算，并返回结果
  - JobManager 管理作业的执行，在接收到 Gateway 提交过来的作业逻辑执行计划后，将逻辑执行计划转换为物理执行计划，为每个物理计算任务分配资源，将每个计算任务分发给不同的 TaskManager 执行，同时管理作业以及每个计算任务执行状态
  - TaskManager执行具体的计算任务，采用线程模型，为每个计算任务创建计算线程，根据计算任务的上下游数据依赖关系跟上游计算任务建立/复用网络连接，向上游计算任务发送数据请求，并处理上游分发给它的数据

四、Flink 在 OLAP 架构上的问题与设想

- 架构与功能模块：
  - JobManager 与 ResourceManager 在一个进程内启动，无法对JobManager 进行水平扩展；
  - Gateway 与 Flink Session Cluster 互相独立，无法进行统一管理；
- 作业管理及部署模块：
  - JobManager 处理和调度作业时，负责的功能比较多，导致单作业处理时间长、并占用了过多的内存；
  - TaskManager 部署计算任务时，任务初始化部分耗时验证，消耗大量 CPU；
- 资源管理及计算任务调度：
  - 资源申请及资源释放流程链路过长；
  - Slot 作为资源管理单元，JM 管理 slot 资源，导致 JM 无法感知到 TM 维度的资源分布，使得资源管理完全依赖于 ResourceManager；
- 其他：
  - 作业心跳与 Failover 机制，并不合适 AP 这种秒级或毫秒级计算场景；
  - AP 目前使用 Batch 算子进行计算，这些算子初始化比较耗时；

![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/a859f4048c184656b270ed2380f8f537~tplv-k3u1fbpfcp-zoom-in-crop-mark:3024:0:0:0.awebp)

--------

### 1.4Flink使用案例

-------

#### 1.4.1电商流批一体实践

------

抖音电商业务原有的离线和实时数仓架构：

![QQ截图20220731132741.png](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/77c32a809e444091a8f3b20cf1e49bfa~tplv-k3u1fbpfcp-watermark.image?)

Flink社区现状

![QQ截图20220731183827.png](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/9854df9984cb4bfbbe46730cba0ecba9~tplv-k3u1fbpfcp-watermark.image?)

目前电商业务数据分为离线数仓和实时数仓建设，离线和实时数据源，计算引擎和业务代码没有统一，在开
发相同需求的时候经常需要离线和实时对齐口径，同时，由于需要维护两套计算路径，对运维也带来压力。

从数据源，业务逻辑，计算引擎完成统一,提高开发和运维效率。

--------

#### 1.4.2Flink OLAP场景实践

------

HTAP场景

![QQ截图20220731184024.png](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/3f9898a53f2d45cdbfed3a6b2e4da085~tplv-k3u1fbpfcp-watermark.image?)

原来的链路

![QQ截图20220731184101.png](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/364499be12ba422d95cd5fbd725376bc~tplv-k3u1fbpfcp-watermark.image?)

走HTAP之后的链路，Flink之间提供数据查询与分析能力

![QQ截图20220731184108.png](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/6e56b11fd1874ab18e9d097bcd6d6681~tplv-k3u1fbpfcp-watermark.image?)
