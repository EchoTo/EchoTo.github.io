---
title: Exactly Once语义在Flink中的实现 | 青训营笔记
date: 2022-08-01 09:50:12
tags: [大数据,Exactly Once语义在Flink中的实现]
categories: 大数据
---

## Exactly Once语义在Flink中的实现

-------

### 1.1数据流和动态表

-------

**专有名词：**

- Stream：数据流

- Dynamic Table：动态表

- Continuous Queries：连续查询

- Append-only Stream：Append-only 流（只有 INSERT 消息）

- Retract Stream：Retract 流（同时包含 INSERT 消息和 DELETE 消息）

- Upsert Stream：Upsert 流（同时包含 UPSERT 消息和 DELETE 消息）

- Changelog：包含 INSERT/UPDATE/DELETE 等的数据流

- State：计算处理逻辑的状态

**动态表：随时间不断变化的表**，在任意时刻，可以像查询静态批处理表一样查询它们

**一、传统SQL和流处理**

| 特征             | SQL                              | 流处理                     |
| ---------------- | -------------------------------- | -------------------------- |
| 处理数据的有界性 | 处理的表是有界的                 | 流是一个无限元组序列       |
| 处理数据的完整性 | 执行查询可以访问完整的数据       | 执行查询无法访问所有的数据 |
| 执行时间         | 批处理查询产生固定大小结果后终止 | 查询不断更新结果，永不终止 |

实时流的查询特点：

* 查询从不终止
* 查询结果会不断更新，并且会产生一个新的动态表
* 结果的动态表也可转换成输出的实时流

**二、数据流与动态表的转换**

- 动态表到实时流的转换
  - Append-only Stream：Append-only 流（只有 INSERT 消息）
  - **Retract Stream**：Retract 流（同时包含 INSERT 消息和 DELETE 消息）

![img](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/1604b80a4a914de3a369d5d94433768a~tplv-k3u1fbpfcp-zoom-in-crop-mark:3024:0:0:0.awebp)

- Upsert Stream：Upsert 流（同时包含 UPSERT 消息和 DELETE 消息）

![img](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/9fd495a37cb348ad87b4f3f5c82a66aa~tplv-k3u1fbpfcp-zoom-in-crop-mark:3024:0:0:0.awebp)

- 算子状态
  -  在流式计算中，会存在有**状态**的计算逻辑（算子），有状态的算子典型处理逻辑如下图所示：

![img](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/3749eaf076e24a509110bb8e4eaba03a~tplv-k3u1fbpfcp-zoom-in-crop-mark:3024:0:0:0.awebp)

比如，需要计算某个用户在网上的点击量，该用户在网站当前的总点击次数就是算子状态，对于新的输入数据，先判断是否是该用户的点击行为，如果是，则将保留的点击次数（状态）增加一，并将当前累加结果输出。

![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/a01d767f3e2046b4bed880e2e1970064~tplv-k3u1fbpfcp-zoom-in-crop-mark:3024:0:0:0.awebp)
