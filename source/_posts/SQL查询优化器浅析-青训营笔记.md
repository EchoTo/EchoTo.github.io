---
title: SQL查询优化器浅析 | 青训营笔记
date: 2022-07-25 20:11:15
tags: [大数据,SQL查询优化器]
categories: 大数据 
---

## SQL查询优化器浅析

------

### 1.1大数据体系和SQL

---------

**大数据体系中的SQL**

分析引擎：

* 批式分析：Spark、Hive、MR
* 实时分析：Flink
* 交互分析：Presto、ClickHouse、Doris

**SQL的处理流程**

![](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/1d8c8519152d4a2e933a74323eab39b2~tplv-k3u1fbpfcp-zoom-in-crop-mark:3024:0:0:0.awebp?)

**一、Parser**

String -> AST(Abstract Syntax Tree)：抽象语法树

* 词法分析：把源码中的一行行代码按照事先规定好的格式分隔成一个个单词符号(token)，拆分字符串，得到关键字、数值常量、字符串常量、运算符号等token
* 语法分析：分析词法分析后的一个个token，是否能够拼装，组成事先规定好的语法中的一个，将token组成AST node(抽象语法树的节点)，最终得到一个AST

实现：递归下降(ClickHouse)，Flex和Bison(PostgreSQL)，JavaCC(Flink)，Antlr(Presto，Spark)

![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/eb13d9ac41f44ca5ae07b91d6c72498d~tplv-k3u1fbpfcp-zoom-in-crop-mark:3024:0:0:0.awebp?)

**二、Analyzer和Logical Plan**

**Analyzer**

* 检查并绑定Database、Table、Column等元信息
* SQL的合法性检查，比如min，max，avg的输入是数值
* AST -> Logical Plan

**Logical Plan**

* 逻辑地描述SQL对应的分步骤计算操作
* 计算操作：算子(operator)

逻辑优化阶段对逻辑计划应用标准的基于规则的优化，这些规则包括常量合并、谓词下推、列裁切、布尔表达式简化等。

> tips：查询优化
>
> SQL只是声明式语言，用户只描述做什么，没有告诉数据库怎么做，目标：找到一个正确且执行代价最小的物理执行计划。

**三、Physical Plan和Executor**

**Physical Plan**

执行计划子树

* 目标：最小化网络数据传输
* 利用上数据的物理分布(数据亲和性)
* 增加Shuffle算子

**Executor**

* 单机并行：cache、pipeline、SIMD
* 多机并行：一个fragment对应多个实例

> 总结：One SQL rules big data all

----------

### 1.2常见的查询优化器

------

**一、查询优化器的分类**

**Top-down Optimizer**

* 从目标输出开始，由上往下遍历计划树，找到最完整的最优执行计划
* 例子：Volcano/Cascade、SQLServer

**Bottom-up Optimizer**

* 从零开始，由下往上遍历计划树，找到完整的执行计划
* 例子：System R、PostgreSQL、IBM DB2

**Rule-based Optimizer(RBO)**

基于规则的优化器

* 根据关系代数等价语义，重写查询
* 基于启发式规则
* 会访问表的元信息(catalog)，不会涉及具体的表数据(data)

**Cost-based Optimizer(CBO)**

基于代价的优化器

* 使用一个模型估算执行计划的代价，选择代价最小的执行计划

**二、RBO**

关系代数

* 运算符：Select(σ)，Project(Π)，Join(▷◁)，Rename(ρ)，Union(U)等
* 等价变化：结合律，交换律，传递性

优化原则

* Read data less and faster(I/O)
* Transfer data less and faster(Network)
* Process data less and faster(CPU & Memory)

1.列裁剪：类似剪枝思想，把不用的列减去，减少参与的数据量

2.谓词下推：把类似><=≠之类的条件下推，减少数据量

3.传递闭包：创建新谓词，下推，减少数据量

4.Runtime Filter：通过在join的probe端提前过滤掉那些不会命中join的输入数据来大幅减少join中的数据传输和计算，从而减少整体的执行时间

**小结**

* 优点：实现简单，优化速度快
* 缺点：不保证得到最优的执行计划

  * 单表扫描：索引扫描(随机I/O) vs 全表扫描(顺序I/O)：如果查询的数据非常不均衡，索引扫描可能不如全表扫描
  * Join的实现：Hash Join vs SortMerge Join
  * 两表Hash Join：用小表构建哈希表---如何找到小表
  * 多表Join


![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/c9bf31459dc14df3beb6a1e5e70afd8d~tplv-k3u1fbpfcp-zoom-in-crop-mark:3024:0:0:0.awebp?)


**三、CBO**

**概念**

使用一个模型估算执行计划的代价，选择代价最小的执行计划

* 执行计划的代价等于所有算子的执行代价总和
* 通过RBO得到所有可能的等价执行计划

算子代价：CPU、内存、磁盘I/O，网络I/O等代价

* 和算子输入数据的统计信息有关：输入、输出结果的行数，每行大小等
  * 叶子算子Scan：通过统计原始表数据得到
  * 中间算子：根据一定推到规则，通过下层算子的统计信息推导得到
* 和具体的算子类型，以及算子的物理实现有关
* 例：Spark Join算子代价：`weight * row_count + (1.0 - weight) * size`

**统计信息**

原始表统计信息

* 表或者分区级别：行数、行平均大小、表在磁盘中占用了多少字节等
* 列级别：min、max、num nulls、num not nulls、num distinct value(NDV)、histogram等

推导统计信息

* **选择率(selectivity)**：对于某一个过滤条件，查询会从表中返回多大比例的数据
* **基数(cardinality)**：在查询计划中常指算子需要处理的行数

> tips：准确的cardinality，远比代价模型本身重要。

**统计信息的收集方式**

* 在DDL里指定需要收集的统计信息，数据库会在数据写入时收集或者更新统计信息
* 手动执行explain analyze statement，触发数据库收集或者更新统计信息
* 动态采样`SELECT count(*) FROM table_name`

**统计信息推导规则**

假设列和列之间是独立的，列的值是均匀分布

**Filter Selectivity**

* AND：fs(a AND b) = fs(a) * fs(b)
* OR：fs(a OR b) = fs(a) + fs(b) - (fs(a) * fs(b))
* NOT：fs(NOT a) = 1.0 - fs(a)
* 等于条件(x = literal)
  * literal < min && literal > max ： 0
  * 1 / NDV
* 小于条件(x < literal)
  * literal < min：0
  * literal > max：1
  * (literal - min) / (max - min)

**问题**

假设经常与现实不符：列与列之间不独立

**执行计划枚举**

通常使用**贪心算法**或者**动态规划**选出最优的执行计划

**TPS-DS Q25**

关闭CBO时：

* Shuffle数据量太大
* 执行效率差

![](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/226f5e7b8ffa4881a6bbc03cfb7d2dd6~tplv-k3u1fbpfcp-zoom-in-crop-mark:3024:0:0:0.awebp?)

开启CBO时：

* 减少了90%的Shuffle数据量
* 3.4倍的加速比

![](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/70ad5e76f7574b41a7281edc2921199a~tplv-k3u1fbpfcp-zoom-in-crop-mark:3024:0:0:0.awebp?)

**CBO小结**

* CBO使用代价模型和统计信息估算执行计划的代价
* CBO使用贪心或者动态规划算法寻找最优执行计划
* 在大数据场景下CBO对查询性能非常重要

----------

### 1.3社区开源实践

-------

**概览**

![](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/97d82e9225844c6a93b0e7d5fed8d301~tplv-k3u1fbpfcp-zoom-in-crop-mark:3024:0:0:0.awebp?)

**Apache Calcite**

Apache Calcite 是面向 Hadoop 新的查询引擎，它提供了标准的 SQL 语言、多种查询优化和连接各种数据源的能力。

Calcite 的目标是“ one size fits all （一种方案适应所有需求场景）”， 希望能为不同计算平台和数据源提供统一的查询引擎，并以类似传统数据库的访问方式（SQL 和高级查询优化）来访问Hadoop 上的数据。

![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/aca371f40e9f48aaa806c330f5068a73~tplv-k3u1fbpfcp-zoom-in-crop-mark:3024:0:0:0.awebp?)

* One size fits all：统一的SQL查询引擎
* 模块化、插件化，稳定可靠
* 支持异构数据模型
  * 关系型
  * 半结构化
  * 流式
  * 地理空间数据
* 内置RBO和CBO

**Calcite RBO**

HepPlanner

* 优化规则(Rule)
  * Pattern：匹配表达式子树
  * 等价变换：得到新的表达式
* 四种匹配规则
  * ARBITRARY/DEPTH_FIRST：深度优先
  * TOP_DOWN：拓扑排序
  * BOTTOM_UP：与拓扑排序顺序相反
* 遍历所有的rule，直到没有rule可以被触发
* 优化速度快，实现简单，但是不能保证最优
* 内置100+优化规则

VolcanoPlanner

* 基于**Volcano/Cascade**框架
* 成本最优假设
* Memo：存储候选执行计划
  * Group：等价计划集合
* Top_down：动态规划搜索

VolcanoPlanner

* 应用Rule搜索候选计划
* Memo
  * 本质：AND/OR graph
  * 共享子树减少内存开销
* Group winner：目前的最优计划
* 剪枝(Branch-and-bound pruning)：减少搜索空间
* Top-down遍历：选择winner构建最优执行计划

**总结**

* 主流的查询优化器都包含RBO和CBO
* Apache Calcite是大数据领域很流行的查询优化器
* Apache Calcite RBO定义了许多优化规则，使用pattern匹配子树，执行等价变换
* Apache Calcite CBO基于Volcano/Cascade框架
* Volcano/Cascade的精髓: Memo、 动态规划、剪枝

------------

### 1.4前沿趋势

-------

对SQL优化器的新要求：

* 引擎架构的进化：储存计算分离，一体化(HTAP，HSAP，HTSAP)
* Cloud云原生 serverless
* 湖仓一体：Query Federation
* **DATA + AI**

**DATA + AI**

AI4DB

* 自配置
  * 智能调参(OtterTune，QTune)
  * 负载预测/调度
* 自诊断和自愈合：错误恢复和迁移
* 自优化：
  * 统计信息估计
  * 代价估计
  * 学习型优化器
  * 索引/视图推荐

DB4AI

* 内嵌人工智能算法(MLSQL，SQLFlow)
* 内嵌机器学习框架(SparkML，Alink，dl-on-flink)
